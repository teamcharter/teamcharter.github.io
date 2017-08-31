import {config} from './config';
import {Database} from './database';
import {Views} from './views';

let database = Database(firebase, config);

let params = getQueryParams(document.location.search);

let views = Views();

let CLASS_CODE = params.class || false;

let feedbackBtn = document.getElementById('feedback');
let teamSpace = document.getElementById('team-space');

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

	database.getInstructorClasses(uid).then((classMap) => {
		let classData = classMap[classCode] || false;
		if (classData) {

			fillText('fill-class-name', classData.name);
			let teams = classData.teams;

			let instructorMap = classData.members || {};
			let userPromises = [];
			for (let uid in instructorMap) {
				let p = database.getUser(uid);
				p.uid = uid;
				userPromises.push(p);
			}

			let studentMap = {};
			for (let tid in classData.teams) {
				let team = classData.teams[tid];
				for (let uid in team.members) {
					let p = database.getUser(uid);
					p.uid = uid;
					userPromises.push(p);
					studentMap[uid] = team.name;
				}
			}

			let promises = [];
			for (let tid in teams) {
				let p = database.getTeamEdits(tid);
				p.tid = tid;
				promises.push(p);
			}


			let profileMap = {};

			Promise.all(userPromises).then((userList) => {
				userList.forEach((user, idx) => {
					if (user) {
						let uid = userPromises[idx].uid;
						user.uid = uid;
						profileMap[uid] = user;
					}
				});
				// Cut out instructor and student rendering here

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
				let table = views.getClassTeamGrid({
					teams: viewTeams,
					profiles: profileMap,
					uid: database.getCurrentUser().uid
				});
				teamSpace.innerHTML = '';
				teamSpace.appendChild(table);

				document.getElementById('new-team').addEventListener('click', (e) => {
					let uid = database.getCurrentUser().uid;
					let jc = convertTidToJoinCode(uid);
					vex.dialog.prompt({
						message: `What is your team's name?`,
						value: 'My Team',
						callback: (value) => {
							if (value) {
								database.createNewTeam(uid, jc, {
									name: value
								}).then((res) => {
									let tid = res.tid;
									database.addTeamToClass(tid, uid, classCode).then((done) => {
										let origin = window.location.origin;
										let link = `${origin}/charter.html?team=${tid}`;
										window.location = link;
									}).catch(reportErrorToUser);
								}).catch(reportErrorToUser);
							}
						}
					});
				})

			}).catch(console.error);

			});

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