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

			if (team.special_type) {
				if (team.special_type === 'swe_roles') {
					let roleTab = document.querySelector('#role-tab');
					roleTab.classList.remove('is-hidden');
					console.log('Show the role tab!', roleTab);
				}
			}

		}, reportErrorToUser);

		document.querySelector('#charter-tab').addEventListener('click', (e) => {
			window.location = `${window.location.origin}/charter.html${document.location.search}`;
		});

		document.querySelector('#promises-tab').addEventListener('click', (e) => {
			window.location = `${window.location.origin}/promises.html${document.location.search}`;
		});

		document.querySelector('#role-tab').addEventListener('click', (e) => {
			window.location = `${window.location.origin}/role.html${document.location.search}`;
		});

		document.querySelector('#health-tab').addEventListener('click', (e) => {
			window.location = `${window.location.origin}/health.html${document.location.search}`;
		});

		database.getPrometheus().save({
			type: 'HEALTH_PAGE',
			tid: tid,
			mentor: isMentor()
		});

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

	if (team.name) {
		fillText('fill-team-name', team.name);
	}

	let uid = database.getCurrentUser().uid;
	if (uid in members || isMentor()) {
		if (Object.keys(team).length > 0) {
			//mainPromiseTab(tid, team, members, user);
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

