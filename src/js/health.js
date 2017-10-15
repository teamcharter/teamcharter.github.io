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

		let once = true;

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

			if (once) {
				mainHealthTab(tid, team, members, user);
				once = false;
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

const RAW_EMOTIONS = `Joy
Love
Fear
Anger
Sadness
Surprise
Content
Happy
Cheerful
Proud
Optimistic
Enthusiastic
Elation
Enthralled
Affectionate
Longing
Desire
Tenderness
Peaceful
Scared
Terror
Insecure
Nervous
Horror
Rage
Exasperated
Irritable
Envy
Disgust
Suffering
Sadness
Disappointed
Shameful
Neglected
Despair
Stunned
Confused
Amazed
Overcome
Moved
Pleased
Satisfied
Amused
Delighted
Jovial
Blissful
Triumphant
Illustrious
Eager
Hopeful
Excited
Zeal
Euphoric
Jubilation
Enchanted
Rapture
Fondness
Romantic
Sentimental
Attracted
Passion
Infatuation
Caring
Compassionate
Relieved
Satisfied
Frightened
Helpless
Panic
Hysterical
Inferior
Inadequate
Worried
Anxious
Mortified
Dread
Hate
Hostile
Agitated
Frustrated
Annoyed
Aggravated
Resentful
Jealous
Contempt
Revoluted
Agony
Hurt
Depressed
Sorrow
Dismayed
Displeased
Regretful
Guilty
Isolated
Lonely
Grief
Powerless
Shocked
Dismayed
Disillusioned
Perplexed
Astonished
Awe-struck
Speechless
Astounded
Stimulated
Touched`;

const EMOTION_LIST = RAW_EMOTIONS.split('\n').map((e) => {
	return e.trim();
});
const EMOTION_WHEEL = {};

function mainHealthTab(tid, team, members, user) {
	//console.log(team, members, user);
	//console.log(EMOTION_LIST);
	Array.from(document.querySelectorAll(`.emotion-selector`)).forEach((sel) => {
		EMOTION_LIST.forEach((e) => {
			let opt = document.createElement(`option`);
				opt.value = e;
				opt.innerText = e;
			sel.appendChild(opt);
		});
	});
	let teammateField = document.querySelector(`#field-team-feedback`);
	teammateField.innerHTML = ``;
	for (let uid in members) {
		let mate = members[uid];
		let card = views.getTeammateFeedbackCard({
			uid: uid,
			name: mate.name,
			image: mate.image
		});
		teammateField.appendChild(card);
	}
	let submitBtn = document.querySelector(`#submit-update`);
	submitBtn.addEventListener(`click`, (e) => {
		let progress = document.querySelector(`#textarea-progress`).value;
		let roadblocks = document.querySelector(`#textarea-roadblocks`).value;
		let feelings = document.querySelector(`#textarea-feelings`).value;
		let emotions = Array.from(document.querySelectorAll(`.emotion-selector`)).map((el) => {
			let emotion = el.options[el.selectedIndex].value;
			return emotion;
		});
		let teammates = Array.from(document.querySelectorAll(`.textarea-teammate`)).map((el) => {
			let uid = el.dataset.uid;
			let feedback = el.value;
			return {
				for: uid,
				feedback: feedback || `None`
			}
		});
		let update = {
			timestamp: Date.now(),
			uid: user.uid,
			tid: tid,
			progress: progress || `None`,
			roadblocks: roadblocks || `None`,
			feelings: feelings || `None`,
			emotions: emotions || [`None`],
			teammates: teammates || [`None`]
		}
		console.log(update);
		submitBtn.classList.add(`is-loading`);
		let p = database.getDB().ref(`progress_updates/${tid}`).push(update);
		p.then((done) => {
			submitBtn.classList.remove(`is-loading`);
			vex.dialog.alert({
				message: `Successfully submitted!`,
				callback: (val) => {
					window.location = `${window.location.origin}/charter.html${document.location.search}`;
				}
			});
		}).catch(reportErrorToUser);
	});
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

