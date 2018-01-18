import {config} from './config';
import {Database} from './database';
import {Views} from './views';

let database = Database(firebase, config);

let params = getQueryParams(document.location.search);

let views = Views();

let CLASS_CODE = params.class || false;

let feedbackBtn = document.getElementById('feedback');
let teamLink = document.getElementById('team-link');

database.init(main, () => {
	// No user signed in
	window.location = `${window.location.origin}/login.html${document.location.search}`;
});

function main(user) {

	let classCode = CLASS_CODE;

	if (!classCode) {
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

	database.getClassTeams(classCode).then((classMap) => {
		let classData = classMap[classCode] || false;
		if (classData) {

			let members = classData.members || {};

			if (uid in members) {
				document.getElementById('ins-note').classList.remove('is-hidden');
			}

			fillText('fill-class-name', classData.name);
			let teams = classData.teams;

			let found = false;
			let myTeam = {};
			let myTeamID = false;
			for (let tid in teams) {
				let team = teams[tid];
				if (uid in team.members) {
					found = true;
					myTeam = team;
					myTeamID = tid;
					break;
				}
			}

			if (found) {
				fillText('fill-team-name', myTeam.name || 'Found Team');
				let healthLink = `${window.location.origin}/health.html?team=${myTeamID}`;
				teamLink.setAttribute('href', healthLink);
			} else {
				fillText('fill-team-name', 'Could not find your team.');
				let backLink = `${window.location.origin}/me.html${document.location.search}`;
				teamLink.innerText = 'Back to Dashboard';
				teamLink.setAttribute('href', backLink);
			}

			teamLink.classList.remove('is-loading');

		}
	}).catch(console.error);

	database.getPrometheus().save({
		type: 'LMS_PAGE',
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

function convertTidToJoinCode(tid) {
	let jc = '';
	let ts = tid.split('').reverse();
	let limit = 5;
	let half = Math.round(ts.length / 2);
	if (half > limit) {
		limit = half;
	}
	for (let t = 0; t < limit; t++) {
		jc += ts[t];
	}
	return jc;
}