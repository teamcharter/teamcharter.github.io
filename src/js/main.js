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
let tabList = document.getElementsByClassName('charter-tab');

let teamName = document.getElementById('team-name');
let teamQuest = document.getElementById('team-question');
let saveQuest = document.getElementById('save-question');
let teamExpect = document.getElementById('team-expectations');
let saveExpect = document.getElementById('save-expectations');
let myUpdate = document.getElementById('my-update');
let saveUpdate = document.getElementById('save-update');
let teamUpdates = document.getElementById('team-updates');

let progressUpdates = document.getElementById('progress-updates');
//let charterUpdates = document.getElementById('charter-updates');

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

		for (let k = 0; k < tabList.length; k++) {
			tabList[k].addEventListener('click', (e) => {
				onTabClick(tabList, tabList[k]);
			});
		}

		// Show the Charter tab when the page loads
		onTabClick(tabList, document.querySelectorAll('.charter-tab[data-tab="container-charter"]')[0]);

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

		let checkedPermissions = false;
		database.onTeamChange(tid, (team, members) => {
			if (!checkedPermissions) {
				checkUserPermission(database, team, members);
				checkedPermissions = true;
			}
		}, reportErrorToUser);

		mainCharterTab(user, tid);
		mainProgressTab(user, tid);

	});

}

function mainCharterTab(user, tid) {

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
			myUpdate.value = '';
		}).catch(reportErrorToUser);
	});

	database.onTeamChange(tid, (team, members) => {
		if (Object.keys(team).length > 0) {
				renderTeamCharter(team, members);
			}
	}, reportErrorToUser);

}

function mainProgressTab(user, tid) {

	database.onTeamChange(tid, (team, members) => {

		renderProgressUpdates(tid, team, members);

	}, reportErrorToUser);

}

function renderProgressUpdates(tid, team, members) {
	let updateMap = team.updates || {};
	
	let updateList = [];

	for (let uid in updateMap) {
		let subMap = updateMap[uid];
		for (let upid in subMap) {
			let node = subMap[upid];
			node.uid = uid;
			node.key = upid;
			updateList.push(node);
		}
	}

	for (let uid in team.members) {
		let member = team.members[uid];
		let profile = members[uid];
		updateList.push({
			update: `${profile.name} joined the team.`,
			timestamp: member.joined,
			uid: uid,
			key: `${uid}-joined`
		});
	}

	updateList.sort((a, b) => {
		return b.timestamp - a.timestamp;
	});

	progressUpdates.innerHTML = '';

	if (updateList.length > 0) {
		updateList.forEach((update) => {
			let author = members[update.uid];
			let tile = views.getProgressUpdate({
				name: author.name,
				role: team.members[update.uid].role,
				image: author.image,
				update: update.update,
				timestamp: update.timestamp
			});
			progressUpdates.appendChild(tile);
		});
	} else {
		let noUpdatesWarning = document.createElement('div');
		noUpdatesWarning.innerHTML = `<div class="content">
			<h4>No updates to show :(</h4>
		</div>`;
		progressUpdates.appendChild(noUpdatesWarning);
	}
}

function renderTeamCharter(team, members) {

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

function checkUserPermission(database, team, members) {
	/*return new Promise((resolve, reject) => {

	});*/
	let uid = database.getCurrentUser().uid;
	if (uid in members) {
		if (Object.keys(team).length > 0) {
			renderTeamCharter(team, members);
		}
	} else if (params.code) {
		vex.dialog.confirm({
			message: `Do you want to join ${team.name || 'this team'}?`,
			buttons: [
				$.extend({}, vex.dialog.buttons.YES, {text: 'Yes'}),
				$.extend({}, vex.dialog.buttons.NO, {text: 'No'})
			],
			callback: (yes) => {
				if (yes) {
					database.joinTeam(tid, uid, params.code).then((res) => {
						if (res.success) {
							vex.dialog.alert({
								message: `Congratulations, you just joined ${team.name || 'your new team'}!`
							});
							if (Object.keys(team).length > 0) {
								renderTeamCharter(team, members);
							}
						} else {
							window.location = window.location.origin + '/me.html';
						}
					});
				} else {
					window.location = window.location.origin + '/me.html';
				}
			}
		});
	} else if (params.rdr) {
		if (Object.keys(team).length > 0) {
			renderTeamCharter(team, members);
		}
	} else {
		window.location = window.location.origin + '/me.html';
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

function onTabClick(tabGroup, tab) {
	let tabid = tab.dataset.tab;
	let showTab = document.getElementById(tabid);
	if (showTab) {
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

