import {config} from './config';
import {Database} from './database';
import {Views} from './views';

let database = Database(firebase, config);

let params = getQueryParams(document.location.search);
let TEAM_ID = params.team;
let MENTOR_MODE = params.mentor ? true : false;

let views = Views();

let loginBtn = document.getElementById('login');
let feedbackBtn = document.getElementById('feedback');

let inviteBtn = document.getElementById('invite');
let classCodeBtn = document.getElementById('class-code');
let mentorLinkBtn = document.getElementById('mentor-link');
let tabList = document.getElementsByClassName('charter-tab');

let teamName = document.getElementById('team-name');
let teamQuest = document.getElementById('team-question');
let saveQuest = document.getElementById('save-question');
let teamExpect = document.getElementById('team-expectations');
let saveExpect = document.getElementById('save-expectations');
let myUpdate = document.getElementById('my-update');
let saveUpdate = document.getElementById('save-update');
let teamUpdates = document.getElementById('team-updates');
let addLink = document.getElementById('add-link');
let teamLinks = document.getElementById('team-links');
let addMeeting = document.getElementById('add-meeting');

let progressUpdates = document.getElementById('progress-updates');
//let charterUpdates = document.getElementById('charter-updates');

/*loginBtn.addEventListener('click', (e) => {
	database.login(main);
});*/

database.init(main, () => {
	// No user signed in
	window.location = `${window.location.origin}/login.html${document.location.search}`;
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
				checkUserPermission(tid, team, members);
				checkedPermissions = true;
			}
		}, reportErrorToUser);

		database.getPrometheus().save({
			type: 'CHARTER_PAGE',
			tid: tid,
			mentor: isMentor()
		});

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

	classCodeBtn.addEventListener('click', (e) => {
		vex.dialog.prompt({
			message: 'Enter the code from your instructor (case sensitive):',
			callback: (code) => {
				if (code) {
					let uid = database.getCurrentUser().uid;
					database.addTeamToClass(tid, uid, code).then((classData) => {
						vex.dialog.alert({
							message: `Successfully added your team to ${classData.name}!`
						});
					}).catch(reportErrorToUser);
				}
			}
		})
	});

	mentorLinkBtn.addEventListener('click', (e) => {
		let origin = window.location.origin;
		let pathname = window.location.pathname;
		let link = `${origin}${pathname}?team=${tid}&mentor=true`;
		vex.dialog.prompt({
			message: 'Send this link to a mentor:',
			value: link,
			callback: () => {}
		});
	});

	teamName.addEventListener('click', (e) => {
		if (!isMentor()) {
			let name = e.target.innerText;
			vex.dialog.prompt({
				message: 'Edit your team name:',
				value: name,
				callback: (newName) => {
					if (newName) {
						let uid = database.getCurrentUser().uid;
						database.updateTeamName(tid, uid, newName);
					}
				}
			});
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

	addLink.addEventListener('click', (e) => {
		promptLinkData(e, tid, 'Paste the URL:');
	});

	addMeeting.addEventListener('click', (e) => {
		//let omniWin = window.open('https://www.omnipointment.com/meeting/create');
		promptLinkData(e, tid, 'Paste the link to your Omnipointment:');
	});

	database.onTeamChange(tid, (team, members) => {
		if (Object.keys(team).length > 0) {
				renderTeamCharter(tid, team, members);
			}
	}, reportErrorToUser);

}

function promptLinkData(e, tid, message) {
	let uid = database.getCurrentUser().uid;
	vex.dialog.prompt({
		message: message,
		callback: (url) => {
			if (url) {
				vex.dialog.prompt({
					message: 'What is the name of this link?',
					callback: (name) => {
						if (url && name) {
							addLink.classList.add('is-loading');
							database.addLink(tid, uid, {
								name: name,
								url: url
							}).then((done) => {
								addLink.classList.remove('is-loading');
							}).catch(reportErrorToUser);
						}
					}
				});
			}
		}
	});
}

function mainProgressTab(user, tid) {

	database.onTeamChange(tid, (team, members) => {

		let isTeamTemplate = team.status === 'template';
		if (!isTeamTemplate) {
			renderProgressUpdates(tid, team, members);
		}

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
			if (update.update.length > 0) {
				let tile = views.getProgressUpdate({
					name: author.name,
					role: team.members[update.uid].role,
					image: author.image,
					update: update.update,
					timestamp: update.timestamp
				});
				progressUpdates.appendChild(tile);
			}
		});
	} else {
		let noUpdatesWarning = document.createElement('div');
		noUpdatesWarning.innerHTML = `<div class="content">
			<h4>No updates to show :(</h4>
		</div>`;
		progressUpdates.appendChild(noUpdatesWarning);
	}
}

function renderTeamCharter(tid, team, members) {

	let teamMembers = team.members || {};

	if (team.name) {
		fillText('fill-team-name', team.name);
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

	if (team.status === 'template') {
		let hSpan = document.getElementById('header-subtitle');
		hSpan.innerHTML = `Team Charter <span class="tag is-warning">Template</span>`;
		document.querySelectorAll('[data-tab=container-progress]')[0].style.display = 'none';
	}

	/*let allUpdates = team.updates || {};
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
	}*/

	let isTeamTemplate = team.status === 'template';

	teamUpdates.innerHTML = '';
	for (let uid in teamMembers) {
		let user = members[uid];
		let member = teamMembers[uid];
		if (member.status === 'member' && !isTeamTemplate) {
			let tile = views.getRoleTile({
				name: user.name,
				role: member.role,
				image: user.image,
				responsibility: member.responsibility || 'What are you responsible for?',
				editable: uid === database.getCurrentUser().uid && !isMentor()
			});
			teamUpdates.appendChild(tile);
		} else if (member.status === 'template') {
			let tile = views.getRoleTemplateTile({
				name: user.name,
				role: member.role,
				image: user.image,
				icon: member.icon,
				responsibility: member.responsibility || 'What are you responsible for?',
				editable: !isMentor(),
				uid: uid,
				onSave: (data) => {
					//console.log(data);
					let uidAuthor = database.getCurrentUser().uid;
					let uidEdit = data.model.uid;
					database.updateRole(tid, uidAuthor, {
						role: data.role,
						responsibility: data.responsibility,
						uid: uidEdit
					});
				},
				onIconEdit: (data) => {
					let uidAuthor = database.getCurrentUser().uid;
					let uidEdit = data.model.uid;
					vex.dialog.prompt({
						message: `Change icon for ${data.model.role}?`,
						value: data.model.icon,
						callback: (iconValue) => {
							database.updateRoleIcon(tid, uidAuthor, {
								uid: uidEdit,
								icon: iconValue
							});
						}
					});
				}
			});
			teamUpdates.appendChild(tile);
		}
	}

	if (isTeamTemplate) {
		let div = document.createElement('div');
			div.classList.add('field');
			div.classList.add('is-grouped');
			div.classList.add('is-grouped-centered');
			div.classList.add('is-hidden-to-mentor');
		div.innerHTML = `
			<div class="control">
				<button data-bind="button-add-role" class="button is-primary is-outlined">
					<span class="icon">
						<i class="fa fa-user"></i>
					</span>
					<span>Add Role</span>
				</button>
				<button data-bind="button-remove-role" class="button is-danger is-outlined">
					<span class="icon">
						<i class="fa fa-remove"></i>
					</span>
					<span>Remove Role</span>
				</button>
			</div>
		`;
		let btnAdd = div.querySelectorAll('[data-bind=button-add-role]')[0];
		btnAdd.addEventListener('click', (e) => {
			let uidAuthor = database.getCurrentUser().uid;
			database.addTemplateRole(tid, uidAuthor);
		});
		let btnRemove = div.querySelectorAll('[data-bind=button-remove-role]')[0];
		btnRemove.addEventListener('click', (e) => {
			let vexText = `
				<div class="content">
					<h5 class="title">Enter the Number of the Role to Remove</h5>
					<ul>`;
			let counter = 1;
			let map = {};
			for (let uid in teamMembers) {
				let user = members[uid];
				let member = teamMembers[uid];
				if (member.status === 'template') {
					vexText += `<li>${counter}: ${member.role}</li>`;
					map[counter] = uid;
					counter++;
				}
			}
			vexText += `
					</ul>
					<br>
				</div>`;
			vex.dialog.prompt({
				unsafeMessage: vexText,
				callback: (removeIdx) => {
					if (removeIdx) {
						let author = database.getCurrentUser().uid;
						let ridx = parseInt(removeIdx, 10);
						let uidRemove = map[ridx];
						if (uidRemove) {
							database.removeMember(tid, author, uidRemove);
						}
					}
				}
			});
		});
		teamUpdates.appendChild(div);
	}

	let roleSave = document.getElementById('my-role-save');
	let roleInput = document.getElementById('my-title');
	let respInput = document.getElementById('my-responsibility');
	if (roleSave && roleInput && respInput) {
		roleSave.addEventListener('click', (e) => {
			roleSave.classList.add('is-loading');
			let role = roleInput.innerText;
			let resp = respInput.innerText;
			let uid = database.getCurrentUser().uid;
			database.updateRole(tid, uid, {
				role: role,
				responsibility: resp
			}).then((done) => {
				roleSave.classList.remove('is-loading');
			}).catch(reportErrorToUser);
		});
	}

	teamLinks.innerHTML = '';
	let linkMap = team.links || {};
	if (Object.keys(linkMap).length > 0) {
		for (let lid in linkMap) {
			let data = linkMap[lid];
			let link = views.getLinkItem({
				name: data.name,
				url: data.url,
				key: lid
			});
			link.dataset.key = lid;
			link.addEventListener('click', (e) => {
				database.getPrometheus().save({
				//console.log({
					type: 'CLICK_TEAM_LINK',
					key: lid,
					name: data.name,
					url: data.url
				});
			});
			teamLinks.appendChild(link);
		}
	} else {
		let noLinks = document.createElement('div');
		noLinks.innerHTML = `<div class="content">
				<p class="is-6">No links yet.</p>
			</div>`;
		teamLinks.appendChild(noLinks);
	}

	let editLinkBtns = teamLinks.getElementsByClassName('edit-link');
	for (let b = 0; b < editLinkBtns.length; b++) {
		editLinkBtns[b].addEventListener('click', (e) => {
			let key = editLinkBtns[b].dataset.for;
			let uid = database.getCurrentUser().uid;
			if (key) {
				let data = linkMap[key];
				let vexWin = vex.dialog.alert({
					unsafeMessage: `
						<div class="field">
							<label class="label">Name</label>
							<div class="control">
								<input id="edit-link-name" type="text" class="input is-primary" value="${data.name}">
							</div>
						</div>
						<div class="field">
							<label class="label">URL</label>
							<div class="control">
								<input id="edit-link-url" type="text" class="input is-primary" value="${data.url}">
							</div>
						</div>
					`,
					buttons: [
						$.extend({}, vex.dialog.buttons.YES, {text: 'Save'}),
						$.extend({}, vex.dialog.buttons.NO, {text: 'Delete', click: (e) => {
							database.removeLink(tid, uid, key).catch(reportErrorToUser);
							vexWin.close();
						}}),
						$.extend({}, vex.dialog.buttons.NO, {text: 'Cancel'})
					],
					callback: (save) => {
						if (save) {
							let nameInput = document.getElementById('edit-link-name');
							let urlInput = document.getElementById('edit-link-url');
							//console.log(nameInput.value, urlInput.value);
							if (nameInput.value && urlInput.value) {
								database.updateLink(tid, uid, key, {
									name: nameInput.value,
									url: urlInput.value
								}).catch(reportErrorToUser);
							}
						}
					}
				});
			}
		})
	}

}

function checkUserPermission(tid, team, members) {
	/*return new Promise((resolve, reject) => {

	});*/

	if (isMentor()) {
		console.log('in mentor mode')
		document.body.classList.add('mentoring');
		let editableNodes = document.querySelectorAll('[contenteditable=true]')
		for (let n = 0; n < editableNodes.length; n++) {
			editableNodes[n].setAttribute('contenteditable', false);
		}
	} 

	let uid = database.getCurrentUser().uid;
	if (uid in members || isMentor()) {
		if (Object.keys(team).length > 0) {
			renderTeamCharter(tid, team, members);
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
								renderTeamCharter(tid, team, members);
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
	} else {
		window.location = window.location.origin + '/me.html';
	}
}

function isMentor() {
	return MENTOR_MODE;
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
		database.getPrometheus().save({
			type: 'CHANGE_TAB',
			tid: TEAM_ID,
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

