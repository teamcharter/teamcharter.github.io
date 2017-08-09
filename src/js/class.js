import {config} from './config';
import {Database} from './database';
import {Views} from './views';

let database = Database(firebase, config);

let params = getQueryParams(document.location.search);

let views = Views();

let feedbackBtn = document.getElementById('feedback');
let teamSpace = document.getElementById('team-space');

database.init(main, () => {
	// No user signed in
	window.location = `${window.location.origin}/login.html${document.location.search}`;
});

function main(user) {

	let classCode = params.class;

	if (!params.class) {
		window.location = `${window.location.origin}/me.html${document.location.search}`;
	}

	feedbackBtn.addEventListener('click', (e) => {
		vex.dialog.prompt({
			message: 'What feedback do you have to share with us?',
			callback: (feedback) => {
				if (feedback) {
					let uid = database.getCurrentUser().uid;
					database.saveFeedback(false, uid, feedback).then((done) => {
						vex.dialog.alert('Thank you for your feedback, it really helps us a lot!');
					}).catch(reportErrorToUser);
				}
			}
		});
	});

	fillText('fill-user-name', user.displayName);
	fillSrc('fill-user-image', user.photoURL);

	let uid = database.getCurrentUser().uid;

	database.getInstructorClasses(uid).then((classMap) => {
		let classData = classMap[classCode] || false;
		if (classData) {

			fillText('fill-class-name', classData.name);
			let teams = classData.teams;

			let promises = [];
			for (let tid in teams) {
				let p = database.getTeamEdits(tid);
				p.tid = tid;
				promises.push(p);
			}

			Promise.all(promises).then((editList) => {

				let teamList = [];
				editList.forEach((editMap, idx) => {
					let tid = promises[idx].tid;
					let team = teams[tid];
					team.tid = tid;
					team.edits = editMap;
					team.lastAccess = getLastAccess(team);
					teamList.push(team);
				});
				let viewTeams = teamList.sort((a, b) => {
					return b.lastAccess - a.lastAccess;
				})
				let table = views.getClassTeamTable({
					teams: viewTeams
				});
				teamSpace.innerHTML = '';
				teamSpace.appendChild(table);

			}).catch(console.error);

		}
	}).catch(console.error);

	database.getPrometheus().save({
		type: 'CLASS_PAGE',
		classCode: classCode
	});

}

function getLastAccess(team) {
	let lastAccess = 0;
	for (let uid in team.updates) {
		for (let upid in team.updates[uid]) {
			let up = team.updates[uid][upid];
			if (up.timestamp > lastAccess) {
				lastAccess = up.timestamp;
			}
		}
	}
	for (let uid in team.members) {
		let joined = team.members[uid].joined;
		if (joined > lastAccess) {
			lastAccess = joined;
		}
	}
	for (let eid in team.edits) {
		let edit = team.edits[eid];
		if (edit.timestamp > lastAccess) {
			lastAccess = edit.timestamp;
		}
	}
	return lastAccess;
}

function reportErrorToUser(err) {
	vex.dialog.alert(err + '');
}

function getQueryParams(qs) {
	qs = qs.split('+').join(' ');
	var params = {},
		tokens,
		re = /[?&]?([^=]+)=([^&]*)/g;
	while (tokens = re.exec(qs)) {
		params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
	}
	return params;
}

function fillText(className, text) {
	let spans = document.getElementsByClassName(className);
	for (let s = 0; s < spans.length; s++) {
		spans[s].innerText = text;
	}
}

function fillSrc(className, text) {
	let spans = document.getElementsByClassName(className);
	for (let s = 0; s < spans.length; s++) {
		spans[s].src = text;
	}
}
