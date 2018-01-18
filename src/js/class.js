import {config} from './config';
import {Database} from './database';
import {Views} from './views';
import {EmotionWheel} from './emotion-wheel';

let database = Database(firebase, config);

let params = getQueryParams(document.location.search);

let views = Views();

let CLASS_CODE = params.class || false;

let feedbackBtn = document.getElementById('feedback');
let teamSpace = document.getElementById('team-space');
let zeroSpace = document.getElementById('zero-space');
let onboardLink = document.getElementById('onboard-link');
let teamDirectLink = document.getElementById('lms-link');

database.init(main, () => {
	// No user signed in
	window.location = `${window.location.origin}/login.html${document.location.search}`;
});

function main(user) {

	let classCode = CLASS_CODE;

	if (!classCode) {
		window.location = `${window.location.origin}/me.html${document.location.search}`;
	}

	let teamDirectURL = `${window.location.origin}/lms.html?class=${classCode}`;
	teamDirectLink.setAttribute('href', teamDirectURL);

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
					});

					let currentUser =  database.getCurrentUser();
					profileMap[currentUser.uid] = {
						email: currentUser.email || false,
						name: currentUser.displayName || false,
						image: currentUser.photoURL || false,
						uid: currentUser.uid
					};

					fetchProgressUpdates(classData, profileMap).then((modelMap) => {
						let table = views.getClassTeamMetricsGrid({
							teams: viewTeams,
							profiles: profileMap,
							metrics: modelMap,
							uid: database.getCurrentUser().uid
						});
						teamSpace.innerHTML = '';
						teamSpace.appendChild(table);
						if (teamList.length === 0) {
							let onboardURL = `${window.location.origin}/onboard.html?class=${classCode}`;
							onboardLink.setAttribute('href', onboardURL);
							zeroSpace.classList.remove('is-hidden');
						}
					});

				}).catch(console.error);

			});

		}
	}).catch(console.error);

	database.getPrometheus().save({
		type: 'CLASS_PAGE',
		classCode: classCode
	});

}

function fetchProgressUpdates(classData, profileMap) {
	console.log('fetchProgressUpdates');
	return new Promise((resolve, reject) => {
		let teams = classData.teams;
		//console.log(classData);
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
		Promise.all(promises).then((updateList) => {
			let modelMap = {};
			teamSpace.innerHTML = ``;
			updateList.forEach((updateObj, idx) => {
				let tid = promises[idx].tid;
				let data = Object.keys(updateObj).map((key) => {
					updateObj[key].key = key;
					return updateObj[key];
				});
				let emotionList = [];
				let emotionMap = data.reduce((list, update) => {
					update.emotions.filter((e) => e !== 'None').forEach((e) => {
						list.push(e);
						//console.log(update);
						emotionList.push({
							uid: update.uid,
							emotion: e,
							feelings: update.feelings,
							data: EmotionWheel[e],
							timestamp: update.timestamp,
							progress: update.progress,
							roadblocks: update.roadblocks
						});
					});
					return list;
				}, []).reduce((map, e) => {
					if (!(e in map)) {
						map[e] = {
							count: 0,
							data: EmotionWheel[e]
						};
					}
					map[e].count++;
					return map;
				}, {});
				let feedbackMap = data.reduce((list, update) => {
					update.teammates.filter((f) => f.feedback !== 'None').forEach((f) => {
						f.from = update.uid;
						f.timestamp = update.timestamp;
						list.push(f);
					});
					return list;
				}, []).reduce((map, f) => {
					if (!(f.for in map)) {
						map[f.for] = [];
					}
					map[f.for].push(f);
					return map;
				}, {});
				let progress = data.filter((u) => u.progress !== 'None').map((u) => {
					return { 
						note: u.progress,
						timestamp: u.timestamp,
						from: u.uid
					}
				});
				let roadblocks = data.filter((u) => u.roadblocks !== 'None').map((u) => {
					return { 
						note: u.roadblocks,
						timestamp: u.timestamp,
						from: u.uid
					}
				});
				let feelings = data.filter((u) => u.feelings !== 'None').map((u) => {
					return { 
						note: u.feelings,
						timestamp: u.timestamp,
						from: u.uid
					}
				});
				let team = teams[tid] || {};
				/*let ps = views.getTeamProgressSection({
					name: team.name || 'Untitled Team',
					team: team,
					emotions: emotionMap,
					feedback: feedbackMap,
					feelings: feelings,
					progress: progress,
					roadblocks: roadblocks,
					profiles: profileMap
				});
				ps.classList.add('box');
				teamSpace.appendChild(ps);*/
				let metricsModel = {
					name: team.name || 'Untitled Team',
					team: team,
					emotions: emotionList,
					feedback: feedbackMap,
					feelings: feelings,
					progress: progress,
					roadblocks: roadblocks,
					profiles: profileMap
				};
				//resolve(metricsModel);
				modelMap[tid] = metricsModel;
			});
			resolve(modelMap);
		}).catch(console.error);
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