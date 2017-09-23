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

let allPromisesDiv = document.getElementById('all-promises');
let focusedPromiseDiv = document.getElementById('focused-promise-box');
let editPromiseDiv = document.getElementById('edit-promise');

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
			type: 'PROMISES_PAGE',
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

	let cards = [
		{
			title: 'Introduction to HTML',
			ps: [
				`As a frontend engineer, you will use HTML to design layouts and pages for your team's web application. You don't have to memorize HTML tags: specifics can always be found online! The rest of your team is just getting started, so focus on learning HTML tags that are used for structure and content. Later, elements like forms will come into play.`,
				`<p>To learn how to give your pages structure, check out these 10 basic HTML tags.`
			],
			links: [
				{
					title: `99Lime: You Only Need 10 HTML Tags`,
					url: `http://www.99lime.com/_bak/topics/you-only-need-10-tags/`,
					type: `Tutorial`,
					id: 'link0'
				}
			]
		},
		{
			title: 'Introduction to CSS',
			ps: [
				`To style your web application, you will use CSS. Don't worry about making the web application look beautiful right away. There will be plenty of time over the course of this project to experiment with styles. Again, no need to memorize: the W3Schools CSS reference is a place you can always look to for help.`,
				`To learn how to give your pages style, explore the W3Schools CSS reference. At least read up to and including the section about the Box Model.`
			],
			links: [
				{
					title: `W3Schools: CSS Reference`,
					url: `https://www.w3schools.com/css/css_intro.asp`,
					type: `Reference`,
					id: 'link1'
				}
			]
		},
		{
			title: 'DOM: The Document Object Model',
			ps: [
				`With HTML, you can create layouts, with CSS you can style them. JavaScript will allow you to interact with your pages. To help out your team's application engineer, you will need to get information from page forms and display new content that the application code gives you. The Document Object Model (DOM) makes this easy.`,
				`To make your pages more than just fixed content, learn about the DOM.`
			],
			links: [
				{
					title: `Mozilla: Introduction to the DOM`,
					url: `https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction`,
					type: `Tutorial`,
					id: 'link2'
				}
			]
		},
		{
			title: `JavaScript: Event Listeners`,
			ps: [
				`The application engineer on your team will want user actions like clicks and hovers to trigger certain parts of their code. Event listeners are the way your frontend work hooks up with the application layer! If you do no other JavaScript in this project, make sure you master event listeners.`,
				`To integrate better with your application code, learn the basics of event listeners.`
			],
			links: [
				{
					title: `W3Schools: Event Listeners`,
					url: `https://www.w3schools.com/js/js_htmldom_eventlistener.asp`,
					type: `Tutorial`,
					id: 'link3'
				},
				{
					title: `Mozilla: Events Reference`,
					url: `https://developer.mozilla.org/en-US/docs/Web/Events`,
					type: `Reference`,
					id: 'link4'
				}
			]
		},
		{
			title: `CSS Framework: W3.CSS`,
			ps: [
				`As a frontend engineer, you are not expected to write all of the styling for your web app from scratch. Many professional teams use a CSS framework, which provides reusable classes for formatting the layout of a page.`,
				`To save development time, learn W3.CSS: a simple CSS framework for responsive websites. If you are curious, you can check out other CSS frameworks like Bootstrap, Bulma, or Semantic UI.`
			],
			links: [
				{
					title: `W3Schools: Introduction to the W3.CSS framework`,
					url: `https://www.w3schools.com/w3css/default.asp`,
					type: `Tutorial`,
					id: 'link5'
				}
			]
		},
		{
			title: `Debugging HTML`,
			ps: [
				`Sometimes your pages will display content in an unexpected way, or you'll be stuck trying to get an element styled just right. These situations happen to even the best frontend engineers. Every engineer on this team must learn how to overcome tricky bugs: frontend engineer is no different!`,
				`To deal with pages that don't seem to be working correctly, learn how to debug HTML.`
			],
			links: [
				{
					title: `Mozilla: How to debug HTML`,
					url: `https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML/Debugging_HTML`,
					type: `Tutorial`,
					id: 'link6'
				}
			]
		}
	];


	let importance = [
		`Takes ownership of interface and experience design.`,
		`Hooks up application code to the site.`,
		`Helps QA engineer understand the webpage structure.`
	];

	let codebase = [
		'Create HTML pages in `/(root)`',
		'Create CSS styles in `/public/css`',
		'Contribute to JS in `/public/js`'
	];

	let cardOut = document.getElementById('card-out');
	cardOut.innerHTML = ``;
	cards.map((model) => views.getRoleStepCard(model)).forEach((div) => {
		cardOut.appendChild(div);
	});

	let detailsOut = document.getElementById('details-out');
	detailsOut.innerHTML = ``;

	let importanceView = views.getListCard({
		title: 'Importance to Team',
		ps: importance
	});
	detailsOut.appendChild(importanceView);

	let codebaseView = views.getListCard({
		title: 'Role in Codebase',
		ps: codebase,
		hasCode: true
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
						console.log(`${user.uid} learned: ${data}`);
					}
					if (data && div.classList.contains('is-primary')) {
						div.classList.remove('is-primary');
						div.classList.add('is-success');
					}
				}
			});
		});
	});

	Array.from(document.querySelectorAll('[data-linkid]')).forEach((link) => {
		link.addEventListener('click', (e) => {
			let linkid = link.dataset.linkid;
			console.log(`${user.uid} clicked: ${linkid}`);
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