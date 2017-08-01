import {config} from './config';
import {Database} from './database';
import {Views} from './views';

let database = Database(firebase, config);

let params = getQueryParams(document.location.search);
let TEAM_ID = params.team;

let views = Views();

let loginBtn = document.getElementById('login');
let feedbackBtn = document.getElementById('feedback');
let inviteBtn = document.getElementById('invite');
let teamName = document.getElementById('team-name');
let teamQuest = document.getElementById('team-question');
let saveQuest = document.getElementById('save-question');
let teamExpect = document.getElementById('team-expectations');
let saveExpect = document.getElementById('save-expectations');
let myUpdate = document.getElementById('my-update');
let saveUpdate = document.getElementById('save-update');
let teamUpdates = document.getElementById('team-updates');

loginBtn.addEventListener('click', (e) => {
	database.login(main);
});

database.init(main, () => {
	// No user signed in
	window.location = window.location.origin + '/login.html';
});

function main(user) {

	initWithTeamCode((tid) => {
	
		console.log('What makes working at Omnipointment better than, say, Google?');

		fillText('fill-user-name', user.displayName);
		fillSrc('fill-user-image', user.photoURL);

		let prometheus = database.getPrometheus();

		feedbackBtn.addEventListener('click', (e) => {
			vex.dialog.prompt({
				message: 'What feedback do you have to share with us?',
				callback: (feedback) => {
					if (feedback) {
						let uid = database.getCurrentUser().uid;
						database.saveFeedback(tid, uid, feedback).then((done) => {
							vex.dialog.alert('Thank you for your feedback, it really helps us a lot!');
						}).catch(reportErrorToUser);
					}
				}
			});
		});

		inviteBtn.addEventListener('click', (e) => {
			database.getTeam(tid).then((team) => {
				let origin = window.location.origin;
				let pathname = window.location.pathname;
				let code = team.joinCode || false;
				let linkEnd = code ? `&code=${code}` : '';
				let link = `${origin}${pathname}?team=${tid}${linkEnd}`;
				vex.dialog.prompt({
					message: 'Send this link to your teammates:',
					value: link,
					callback: () => {}
				});
			});
		});

		teamName.addEventListener('input', (e) => {
			let name = e.target.innerText;
			let cleaned = name.split('\n').reduce((agg, val) => {
				if (val) {
					return agg + val;
				} else {
					return agg;
				}
			}, '');
			//console.log(name, name.split('\n'), cleaned);
			e.target.innerText = cleaned;
			cursorManager.setEndOfContenteditable(e.target);
		});

		teamName.addEventListener('keypress', (e) => {
			let keyCode = e.keyCode || e.which;
			if (keyCode == 13) {
				let name = e.target.innerText;
				let uid = database.getCurrentUser().uid;
				database.updateTeamName(tid, uid, name);
			}
		});

		saveQuest.addEventListener('click', (e) => {
			saveQuest.classList.add('is-loading');
			let uid = database.getCurrentUser().uid;
			let question = teamQuest.innerText;
			database.updateQuestion(tid, uid, question).then((done) => {
				saveQuest.classList.remove('is-loading');
			}).catch(reportErrorToUser);
		});

		saveExpect.addEventListener('click', (e) => {
			saveExpect.classList.add('is-loading');
			let uid = database.getCurrentUser().uid;
			let text = teamExpect.innerText;
			let list = text.split('\n');
			let popped = list.pop();
			if (!popped.length < 1) {
				list.push(popped);
			}
			database.updateExpectations(tid, uid, list).then((done) => {
				saveExpect.classList.remove('is-loading');
			}).catch(reportErrorToUser);
		});

		saveUpdate.addEventListener('click', (e) => {
			saveUpdate.classList.add('is-loading');
			let uid = database.getCurrentUser().uid;
			let update = myUpdate.value;
			database.submitUpdate(tid, uid, update).then((done) => {
				saveUpdate.classList.remove('is-loading');
			}).catch(reportErrorToUser);
		});

		database.onTeamChange(tid, (team, members) => {
			let uid = database.getCurrentUser().uid;
			if (uid in members) {
				if (Object.keys(team).length > 0) {
					renderTeam(team, members);
				}
			} else if (params.code) {
				database.joinTeam(tid, uid, params.code).then((res) => {
					if (res.success) {
						vex.dialog.alert({
							message: `Congratulations, you just joined ${team.name || 'your new team'}!`
						});
						if (Object.keys(team).length > 0) {
							renderTeam(team, members);
						}
					} else {
						window.location = window.location.origin + '/me.html';
					}
				});
			} else {
				window.location = window.location.origin + '/me.html';
			}
		}, reportErrorToUser);

	});

}

function renderTeam(team, members) {

	let teamMembers = team.members || {};

	if (team.name) {
		fillText('fill-team-name', team.name);
		cursorManager.setEndOfContenteditable(teamName);
	}
	if (team.question) {
		fillText('fill-team-question', team.question);
	}
	let expectations = team.expectations || [];
	if (expectations.length > 0) {
		teamExpect.innerHTML = expectations.reduce((total, val) => {
			return total + `<li>${val}</li>`;
		}, '');
	}
	let allUpdates = team.updates || {};
	teamUpdates.innerHTML = '';
	for (let uid in teamMembers) {
		let user = members[uid];
		let updateMap = allUpdates[uid] || {};
		let updateList = Object.keys(updateMap).map(upid => updateMap[upid]).sort((a, b) => {
			return b.timestamp - a.timestamp;
		});
		let update = updateList[0];
		let message = 'No updates yet.';
		let ts = teamMembers[uid].joined;
		if (update) {
			message = update.update;
			ts = update.timestamp;
		}
		let tile = views.getRoleAndUpdateTile({
			name: user.name,
			role: team.members[uid].role,
			image: user.image,
			update: message,
			timestamp: ts
		});
		teamUpdates.appendChild(tile);
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

let cancels = 0;
function initWithTeamCode(callback) {
	if (TEAM_ID) {
		callback(TEAM_ID);
	} else {
		vex.dialog.prompt({
			message: 'Enter your team code:',
			callback: (code) => {
				if (code) {
					callback(code);
				} else if (cancels >= 1) {
					window.location = './';
				} else {
					cancels++;
					initWithTeamCode(callback);
				}
			}
		});
	}
}

