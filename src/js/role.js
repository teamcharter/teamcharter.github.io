import {config} from './config';
import {Database} from './database';
import {Views} from './views';

let database = Database(firebase, config);

let params = getQueryParams(document.location.search);
let TEAM_ID = params.team;
let MENTOR_MODE = params.mentor ? true : false;
let EDIT = false;

let views = Views();

let loginBtn = document.getElementById('login');
let feedbackBtn = document.getElementById('feedback');
let sectionLoader = document.getElementById('section-loader');
let sectionChoose = document.getElementById('section-choose-role');
let sectionRole = document.getElementById('section-role');
let sectionAll = document.getElementById('section-all');

database.init(main, () => {
	// No user signed in
	window.location = `${window.location.origin}/login.html${document.location.search}`;
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

		let checkedPermissions = false;
		database.onTeamChange(tid, (team, members) => {
			if (!checkedPermissions) {
				checkUserPermission(tid, team, members, user);
				checkedPermissions = true;
			}
		}, reportErrorToUser);

		database.getPrometheus().save({
			type: 'ROLE_PAGE',
			tid: tid,
			mentor: isMentor()
		});

	});

}

function mainRoleTab(tid, team, members, user) {

	if (team.name) {
		fillText('fill-team-name', team.name);
	}

	document.querySelector('#charter-tab').addEventListener('click', (e) => {
		window.location = `${window.location.origin}/charter.html${document.location.search}`;
	});

	document.querySelector('#promises-tab').addEventListener('click', (e) => {
		window.location = `${window.location.origin}/promises.html${document.location.search}`;
	});

	document.querySelector('#health-tab').addEventListener('click', (e) => {
		window.location = `${window.location.origin}/health.html${document.location.search}`;
	});

	console.log('special type:', team.special_type);

	if (isMentor()) {
		window.location = `${window.location.origin}/charter.html${document.location.search}`;
	} else {
		Array.from(document.querySelector('#section-choose-role').querySelectorAll('[data-roleid]')).forEach((btn) => {
			btn.addEventListener('click', (e) => {
				let roleid = btn.dataset.roleid;
				console.log(roleid);
				database.getDB().ref(`teams/${tid}/swe_roles/${user.uid}`).set(roleid).then((done) => {
					sectionChoose.classList.add('is-hidden');
					showRoleWithNotes(TEAM_ID, role_id, user.uid);
				}).catch(reportErrorToUser);
			});
		});

		let initRole = false;
		if (team.special_type) {
			if (team.special_type === 'swe_roles') {
				let roleMap = team.swe_roles;
				if (team.swe_roles) {
					let role_id = team.swe_roles[user.uid];
					if (role_id) {
						initRole = true;
						showRoleWithNotes(TEAM_ID, role_id, user.uid);
					}
				}
			}
		}
		if (!initRole) {
			console.log(`Sorry, you don't have a role on the team!`);
			sectionLoader.classList.add('is-hidden');
			sectionChoose.classList.remove('is-hidden');
		}
	}

}

function showRoleWithNotes(tid, roleid, user_id) {
	database.getDB().ref(`role_learning/${tid}`).orderByChild(`uid`).equalTo(user_id).on('value', (snap) => {
		let stepMap = {};
		let nodes = snap.val() || {};
		console.log(nodes)
		Object.keys(nodes).map(key => nodes[key]).filter(node => node.role === roleid).filter(node => node.type === 'learning').sort((a, b) => {
			return a.timestamp - b.timestamp;
		}).forEach((node) => {
			if (!(node.step in stepMap)) {
				stepMap[node.step] = [];
			}
			stepMap[node.step].push(node);
		});
		console.log(stepMap)
		initRoleViewer(roleid, user_id, stepMap);
	});
}

function checkUserPermission(tid, team, members, user) {
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
			mainRoleTab(tid, team, members, user);
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
	console.error(err);
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

function initRoleViewer(roleid, user_id, stepMap) {

	database.getRoleMap({
		role: roleid
	}).then((dataMap) => {

		sectionLoader.classList.add('is-hidden');
		sectionRole.classList.remove('is-hidden');

		let roleMap = getDefaultRoleMap(dataMap);
		let changeBtn = document.getElementById('toggle-change');

		changeBtn.addEventListener('click', (e) => {
			sectionRole.classList.add('is-hidden');
			sectionChoose.classList.remove('is-hidden');
		});
		mainTab(roleid, user_id, roleMap, stepMap, EDIT);

	}).catch(reportErrorToUser);
	
}

function mainTab(roleid, user_id, roleMap, stepMap, editable) {

	let roleData = transformRoleData(roleMap);

	document.getElementById('role-name').innerText = roleData.title;
	document.getElementById('role-icon').classList.add(`fa-${roleData.icon}`);
	document.getElementById('role-desc').innerText = roleData.description;

	let cardOut = document.getElementById('card-out');
	cardOut.innerHTML = ``;
	roleData.steps.map((model) => {
		model.editable = editable;
		model.isOpen = editable;
		let learned_data = stepMap[model.id] || [];
		model.learned = learned_data;
		return model;
	}).map((model) => views.getRoleStepCard(model)).forEach((div) => {
		cardOut.appendChild(div);
	});

	let detailsOut = document.getElementById('details-out');
	detailsOut.innerHTML = ``;

	let importanceView = views.getListCard({
		title: 'Importance to Team',
		field: 'importance',
		ps: roleData.importance,
		editable: editable
	});
	detailsOut.appendChild(importanceView);

	let codebaseView = views.getListCard({
		title: 'Role in Codebase',
		field: 'codebase',
		ps: roleData.codebase,
		hasCode: true,
		editable: editable
	});
	detailsOut.appendChild(codebaseView);

	Array.from(document.querySelectorAll('[collapsible]')).forEach((div) => {
		div.querySelector('.message-header').addEventListener('click', (e) => {
			if (div.classList.contains('is-collapsed')) {
				div.classList.remove('is-collapsed');
			} else {
				div.classList.add('is-collapsed');
			}
		});
		div.querySelector('.message-body button').addEventListener('click', (e) => {
			vex.dialog.prompt({
				message: 'What did you learn?',
				callback: (data) => {
					if (data) {
						let step = div.dataset.step;
						console.log(`${user_id} learned: ${data}`);
						database.getDB().ref(`role_learning/${TEAM_ID}`).push({
							uid: user_id,
							role: roleid,
							step: step,
							type: 'learning',
							learned: data,
							timestamp: Date.now()
						});
					}
					if (data && div.classList.contains('is-primary')) {
						div.classList.remove('is-primary');
						div.classList.add('is-success');
					}
				}
			});
		});
	});

	if (!editable) {
		Array.from(document.querySelectorAll('[data-linkid]')).forEach((link) => {
			link.addEventListener('click', (e) => {
				let linkid = link.dataset.linkid;
				let step = link.dataset.step;
				console.log(`${user_id} clicked: ${linkid}`);
				database.getDB().ref(`role_learning/${TEAM_ID}`).push({
					uid: user_id,
					role: roleid,
					step: step,
					type: 'link',
					linkid: linkid,
					timestamp: Date.now()
				});
			});
		});
	}

}

function reportErrorToUser(err) {
	console.error(err);
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

function getDefaultRoleMap(roleMap) {
	// Set defaults
	roleMap.links = roleMap.links || {};
	roleMap.steps = roleMap.steps || {};
	roleMap.title = roleMap.title || 'Untitled Role';
	roleMap.description = roleMap.description || 'Edit...';
	roleMap.icon = roleMap.icon || 'user';
	roleMap.importance = roleMap.importance || 'Edit...';
	roleMap.codebase = roleMap.codebase || 'Edit...';
	return roleMap;
}

function transformRoleData(thisMap) {
	let inMap = getDefaultRoleMap(thisMap);
	let roleMap = JSON.parse(JSON.stringify(inMap));
	// Start transformation
	let roleData = {};
	roleData.importance = roleMap.importance.split('\n');
	roleData.codebase = roleMap.codebase.split('\n');
	roleData.steps = {};
	for (let stepid in roleMap.steps) {
		roleData.steps[stepid] = roleMap.steps[stepid];
	}
	for (let linkid in roleMap.links) {
		let data = roleMap.links[linkid];
		data.id = linkid;
		if (!roleData.steps[data.step].links) {
			roleData.steps[data.step].links = {};
		}
		roleData.steps[data.step].links[linkid] = data;
	}
	let list = Object.keys(roleData.steps).map((key) => {
		let stepData = roleData.steps[key];
		stepData.id = key;
		if (!stepData.links) {
			stepData.links = {};
		}
		let linkList = Object.keys(stepData.links).map((linkKey) => {
			return stepData.links[linkKey];
		}).sort((a, b) => {
			return a.order - b.order;
		}).filter((l) => {
			return !l.removed;
		});
		stepData.ps = stepData.note.split('\n');
		stepData.links = linkList;
		return stepData;
	}).sort((a, b) => {
		return a.order - b.order;
	});
	roleData.steps = list;
	roleData.title = roleMap.title;
	roleData.description = roleMap.description;
	roleData.icon = roleMap.icon;
	return roleData;
}

function getStepLinkDetails(data, callback) {
	vex.dialog.prompt({
		message: 'Link URL',
		value: data.url,
		callback: (url) => {
			if (url) {
				vex.dialog.prompt({
					message: 'Link Title',
					value: data.title,
					callback: (title) => {
						if (title) {
							vex.dialog.prompt({
								message: 'Link Type',
								value: data.type,
								callback: (type) => {
									if (type) {
										callback({
											step: data.step,
											url: url,
											title: title,
											type: type
										});
									}
								}
							});
						}
					}
				});
			}
		}
	});
}

