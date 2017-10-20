import {config} from './config';
import {Database} from './database';
import {Views} from './views';

let database = Database(firebase, config);

let params = getQueryParams(document.location.search);

let views = Views();

let CLASS_CODE = params.class || false;

let feedbackBtn = document.getElementById('feedback');
let teamSpace = document.getElementById('team-space');
let instructorSpace = document.getElementById('instructor-space');
let studentSpace = document.getElementById('student-space');
let tabList = document.getElementsByClassName('charter-tab');
let inviteInstructorBtn = document.getElementById('invite-instructor');

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

	inviteInstructorBtn.addEventListener('click', (e) => {
		vex.dialog.prompt({
			message: 'Send them this link:',
			value: `${window.location.origin}/me.html?instructor=${classCode}`,
			callback: (done) => {}
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

			let profileMap = {};

			Promise.all(userPromises).then((userList) => {
				userList.forEach((user, idx) => {
					if (user) {
						let uid = userPromises[idx].uid;
						user.uid = uid;
						profileMap[uid] = user;
					}
				});
				instructorSpace.innerHTML = '';
				let iCount = 0;
				for (let uid in instructorMap) {
					let ins = instructorMap[uid];
					if (!ins.hidden) {
						let profile = profileMap[uid];
						if (profile) {
							let tile = views.getUserTile({
								name: profile.name,
								image: profile.image,
								subtitle: 'Instructor'
							});
							instructorSpace.appendChild(tile);
							iCount++;
						}
					}
				}
				fillText('fill-number-instructors', `(${iCount})`);
				let sCount = 0;
				for (let uid in studentMap) {
					let profile = profileMap[uid];
					if (profile) {
						let teamName = studentMap[uid];
						let tile = views.getUserTile({
							name: profile.name,
							image: profile.image,
							subtitle: teamName
						});
						studentSpace.appendChild(tile);
						sCount++;
					}
				}
				fillText('fill-number-students', `(${sCount})`);
			});

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

				for (let k = 0; k < tabList.length; k++) {
					tabList[k].addEventListener('click', (e) => {
						onTabClick(tabList, tabList[k]);
					});
				}

				onTabClick(tabList, document.querySelectorAll('.charter-tab[data-tab="container-teams"]')[0]);

			}).catch(console.error);

			mainProgressUpdates(classData);

		}
	}).catch(console.error);

	database.getPrometheus().save({
		type: 'CLASS_PAGE',
		classCode: classCode
	});

}

function mainProgressUpdates(classData) {
	let teams = classData.teams;
	console.log(teams);
	let promises = [];
	for (let tid in teams) {
		let p = new Promise((resolve, reject) => {
			database.getDB().ref(`progress_updates/${tid}`).once('value', (snap) => {
				let val = snap.val() || {};
				resolve(val);
			}).catch(reject);
		});
		p.tid = tid;
		promises.push(p);
	}
	Promise.all(promises).then((updates) => {
		console.log(updates);
	}).catch(console.error);
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

function onTabClick(tabGroup, tab) {
	let tabid = tab.dataset.tab;
	let showTab = document.getElementById(tabid);
	if (showTab) {
		database.getPrometheus().save({
			type: 'CHANGE_CLASS_TAB',
			classCode: CLASS_CODE,
			tab: tabid
		});
		for (let j = 0; j < tabGroup.length; j++) {
			tabGroup[j].classList.remove('is-active');
		}
		let otherTabs = document.getElementsByClassName('tabbed-container');
		for (let i = 0; i < otherTabs.length; i++) {
			otherTabs[i].style.display = 'none';
		}
		showTab.style.display = 'block';
		tab.classList.add('is-active');
	}

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
