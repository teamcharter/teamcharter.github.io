import {config} from './config';
import {Database} from './database';
import {Views} from './views';

let database = Database(firebase, config);

let params = getQueryParams(document.location.search);
let ROLE = params.role || false;
let EDIT = false;

let views = Views();

let loginBtn = document.getElementById('login');
let feedbackBtn = document.getElementById('feedback');
let sectionLoader = document.getElementById('section-loader');
let sectionRole = document.getElementById('section-role');
let sectionAll = document.getElementById('section-all');

database.init(main, () => {
	// No user signed in
	if (ROLE) {
		window.location = `${window.location.origin}/login.html?ref=rolelibrary&role=${ROLE}`;
	} else {
		window.location = `${window.location.origin}/login.html?ref=rolelibrary`;
	}
});

function main(user) {

	if (!ROLE) {
		//window.location = `${window.location.origin}/me.html`;
		database.getAllRoleMaps().then((map) => {
			sectionLoader.classList.add('is-hidden');
			sectionAll.classList.remove('is-hidden');
			let roleOut = document.getElementById('role-out');
			roleOut.innerHTML = ``;
			for (let rid in map) {
				let data = map[rid];
				data.id = rid;
				let div = views.getRoleMapCard(data);
				roleOut.appendChild(div);
			}
		});
	}

	if (params.create_role) {
		database.saveRoleMap({
			role: params.create_role,
			data: {
				exists: true
			}
		}).then((done) => {
			window.location = `${window.location.origin}/rolelibrary.html?role=${params.create_role}`;
		}).catch(reportErrorToUser);
	}

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
					database.saveFeedback(false, uid, feedback).then((done) => {
						vex.dialog.alert('Thank you for your feedback, it really helps us a lot!');
					}).catch(reportErrorToUser);
				}
			}
		});
	});

	/*let roleMap = {
		links: {
			a: {
				title: `99Lime: You Only Need 10 HTML Tags`,
				step: `a`,
				url: `http://www.99lime.com/_bak/topics/you-only-need-10-tags/`,
				type: `Tutorial`
			},
			b: {
				title: `W3Schools: CSS Reference`,
				step: `b`,
				url: `https://www.w3schools.com/css/css_intro.asp`,
				type: `Reference`
			},
			c: {
				title: `Mozilla: Introduction to the DOM`,
				step: `c`,
				url: `https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction`,
				type: `Tutorial`
			},
			d: {
				title: `W3Schools: Event Listeners`,
				step: `d`,
				url: `https://www.w3schools.com/js/js_htmldom_eventlistener.asp`,
				type: `Tutorial`
			},
			e: {
				title: `Mozilla: Events Reference`,
				step: `d`,
				url: `https://developer.mozilla.org/en-US/docs/Web/Events`,
				type: `Reference`
			},
			f: {
				title: `W3Schools: Introduction to the W3.CSS framework`,
				step: `e`,
				url: `https://www.w3schools.com/w3css/default.asp`,
				type: `Tutorial`
			},
			g: {
				title: `Mozilla: How to debug HTML`,
				step: `f`,
				url: `https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML/Debugging_HTML`,
				type: `Tutorial`
			}
		},
		steps: {
			a: {
				title: 'Introduction to HTML',
				order: 0,
				note: `As a frontend engineer, you will use HTML to design layouts and pages for your team's web application. You don't have to memorize HTML tags: specifics can always be found online! The rest of your team is just getting started, so focus on learning HTML tags that are used for structure and content. Later, elements like forms will come into play.\n<p>To learn how to give your pages structure, check out these 10 basic HTML tags.`
			},
			b: {
				title: 'Introduction to CSS',
				order: 1,
				note: `To style your web application, you will use CSS. Don't worry about making the web application look beautiful right away. There will be plenty of time over the course of this project to experiment with styles. Again, no need to memorize: the W3Schools CSS reference is a place you can always look to for help.\nTo learn how to give your pages style, explore the W3Schools CSS reference. At least read up to and including the section about the Box Model.`
			},
			c: {
				title: 'DOM: The Document Object Model',
				order: 2,
				note: `With HTML, you can create layouts, with CSS you can style them. JavaScript will allow you to interact with your pages. To help out your team's application engineer, you will need to get information from page forms and display new content that the application code gives you. The Document Object Model (DOM) makes this easy.\nTo make your pages more than just fixed content, learn about the DOM.`
			},
			d: {
				title: `JavaScript: Event Listeners`,
				order: 3,
				note: `The application engineer on your team will want user actions like clicks and hovers to trigger certain parts of their code. Event listeners are the way your frontend work hooks up with the application layer! If you do no other JavaScript in this project, make sure you master event listeners.\nTo integrate better with your application code, learn the basics of event listeners.`
			},
			e: {
				title: `CSS Framework: W3.CSS`,
				order: 4,
				note: `As a frontend engineer, you are not expected to write all of the styling for your web app from scratch. Many professional teams use a CSS framework, which provides reusable classes for formatting the layout of a page.\nTo save development time, learn W3.CSS: a simple CSS framework for responsive websites. If you are curious, you can check out other CSS frameworks like Bootstrap, Bulma, or Semantic UI.`
			},
			f: {
				title: `Debugging HTML`,
				order: 5,
				note: `Sometimes your pages will display content in an unexpected way, or you'll be stuck trying to get an element styled just right. These situations happen to even the best frontend engineers. Every engineer on this team must learn how to overcome tricky bugs: frontend engineer is no different!\nTo deal with pages that don't seem to be working correctly, learn how to debug HTML.`
			}
		},
		importance: `Takes ownership of interface and experience design\nHooks up application code to the site.\nHelps QA engineer understand the webpage structure.`,
		codebase: 'Create HTML pages in `/(root)`\nCreate CSS styles in `/public/css`\nContribute to JS in `/public/js`',
		title: `Frontend Designer`,
		icon: `desktop`,
		description: `Design the interface for your team's web application and hook up to the application code.`
	};*/

	if (ROLE) {
		database.getRoleMap({
			role: ROLE
		}).then((dataMap) => {

			sectionLoader.classList.add('is-hidden');
			sectionRole.classList.remove('is-hidden');

			let roleMap = getDefaultRoleMap(dataMap);

			let editBtn = document.getElementById('toggle-edit');
			let addModBtn = document.getElementById('add-module');

			database.getPrometheus().can('contributor', (data) => {
				editBtn.classList.remove('is-hidden');
			});

			let divName = document.getElementById('role-name');
			let editName = (e) => {
				if (EDIT) {
					vex.dialog.prompt({
						message: 'Edit Title',
						value: roleMap.title,
						callback: (res) => {
							divName.removeEventListener('click', editName);
							if (res) {
								roleMap.title = res;
								mainTab(user, roleMap, EDIT);
							}
						}
					});
				}
			}
			divName.addEventListener('click', editName);

			let divIcon = document.getElementById('role-icon');
			let editIcon = (e) => {
				if (EDIT) {
					vex.dialog.prompt({
						message: 'Edit Icon',
						value: roleMap.icon,
						callback: (res) => {
							divIcon.removeEventListener('click', editIcon);
							if (res) {
								roleMap.icon = res;
								mainTab(user, roleMap, EDIT);
							}
						}
					});
				}
			}
			divIcon.addEventListener('click', editIcon);

			let divDesc = document.getElementById('role-desc');
			let editDesc = (e) => {
				if (EDIT) {
					vex.dialog.prompt({
						message: 'Edit Description',
						value: roleMap.description,
						callback: (res) => {
							divDesc.removeEventListener('click', editDesc);
							if (res) {
								roleMap.description = res;
								mainTab(user, roleMap, EDIT);
							}
						}
					});
				}
			}
			divDesc.addEventListener('click', editDesc);

			let addModFn = (e) => {
				if (EDIT) {
					//addModBtn.removeEventListener('click', addModFn);
					let size = Object.keys(roleMap.steps).length - 1;
					let newstepid = `step-${size}`;
					roleMap.steps[newstepid] = {
						title: 'Untitled Module',
						order: size,
						note: `...`
					}
					mainTab(user, roleMap, EDIT);
				}
			}
			addModBtn.addEventListener('click', addModFn);

			editBtn.addEventListener('click', (e) => {
				EDIT = !EDIT;
				if (EDIT) {
					editBtn.innerText = 'Publish Role';
					editBtn.classList.add('is-success');
					editBtn.classList.remove('is-warning');
					addModBtn.classList.remove('is-hidden');
					mainTab(user, roleMap, EDIT);
				} else {
					editBtn.innerText = 'Edit Role';
					editBtn.classList.remove('is-success');
					editBtn.classList.add('is-warning');
					editBtn.classList.add('is-loading');
					addModBtn.classList.add('is-hidden');
					database.saveRoleMap({
						role: ROLE,
						data: roleMap
					}).then((done) => {
						vex.dialog.alert(`Saved Role: ${roleMap.title}`);
						mainTab(user, roleMap, EDIT);
						editBtn.classList.remove('is-loading');
					}).catch(reportErrorToUser);
				}
			});

			if (EDIT) {
				editBtn.innerText = 'Publish Role';
				editBtn.classList.add('is-success');
				editBtn.classList.remove('is-warning');
				addModBtn.classList.remove('is-hidden');
			} else {
				editBtn.innerText = 'Edit Role';
				editBtn.classList.remove('is-success');
				editBtn.classList.add('is-warning');
				addModBtn.classList.add('is-hidden');
			}
			mainTab(user, roleMap, EDIT);

		}).catch(reportErrorToUser);
	}

	database.getPrometheus().save({
		type: 'ROLE_LIBRARY',
		role: ROLE
	});

}

function mainTab(user, roleMap, editable) {

	let roleData = transformRoleData(roleMap);

	document.getElementById('role-name').innerText = roleData.title;
	document.getElementById('role-icon').classList.add(`fa-${roleData.icon}`);
	document.getElementById('role-desc').innerText = roleData.description;

	let cardOut = document.getElementById('card-out');
	cardOut.innerHTML = ``;
	roleData.steps.map((model) => {
		model.editable = editable;
		model.isOpen = editable;
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
						console.log(`${user.uid} learned: ${data}`);
						database.getDB().ref(`role_browsing`).push({
							uid: user.uid,
							role: ROLE,
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
				console.log(`${user.uid} clicked: ${linkid}`);
				database.getDB().ref(`role_browsing`).push({
					uid: user.uid,
					role: ROLE,
					step: step,
					type: 'link',
					linkid: linkid,
					timestamp: Date.now()
				});
			});
		});
	}

	Array.from(document.querySelectorAll('[data-action]')).forEach((div) => {
		//console.log(div.dataset.action, div.dataset);
		div.addEventListener('click', (e) => {
			let action = div.dataset.action;
			let step = false;
			let linkid = false;
			let order = 0;
			let idx = -1;
			let field = false;
			switch (action) {
				case 'save-note':
					step = div.dataset.step;
					field = cardOut.querySelector(`.step-note[data-step="${step}"]`);
					roleMap.steps[step].note = field.innerText;
					mainTab(user, roleMap, editable);
					break;
				case 'edit-name':
					step = div.dataset.step;
					let stepData = roleMap.steps[step];
					vex.dialog.prompt({
						message: 'Rename Module',
						value: stepData.title,
						callback: (title) => {
							if (title) {
								roleMap.steps[step].title = title;
								mainTab(user, roleMap, editable);
							}
						}
					});
					break;
				case 'save-importance':
					field = document.querySelector(`[data-textarea="get-importance"]`);
					roleMap.importance = field.innerText;
					mainTab(user, roleMap, editable);
					break;
				case 'save-codebase':
					field = document.querySelector(`[data-textarea="get-codebase"]`);
					roleMap.codebase = field.innerText;
					mainTab(user, roleMap, editable);
					break;
				case 'add-step-link':
					step = div.dataset.step;
					let size = Object.keys(roleMap.links).length - 1;
					let newlinkid = `link${size + 1}`;
					getStepLinkDetails({
						step: step
					}, (res) => {
						roleMap.links[newlinkid] = {
							title: res.title,
							step: res.step,
							url: res.url,
							type: res.type
						}
						mainTab(user, roleMap, editable);
					});
					break;
				case 'move-step-up':
					step = div.dataset.step;
					order = roleMap.steps[step].order;
					idx = -1;
					roleData.steps.forEach((s, i) => {
						if (s.order === order) {
							idx = i;
						}
					});
					let swap = roleData.steps[idx - 1];
					if (swap) {
						let switchWith = swap.id;
						roleMap.steps[switchWith].order = order;
						roleMap.steps[step].order = order - 1;
						mainTab(user, roleMap, editable);
					}
					break;
				case 'move-step-down':
					step = div.dataset.step;
					order = roleMap.steps[step].order;
					idx = -1;
					roleData.steps.forEach((s, i) => {
						if (s.order === order) {
							idx = i;
						}
					});
					if (order < (Object.keys(roleMap.steps).length - 1)) {
						let target = roleData.steps[idx + 1];
						if (target) {
							switchWith = target.id;
							roleMap.steps[switchWith].order = order;
							roleMap.steps[step].order = order + 1;
							mainTab(user, roleMap, editable);
						}
					}
					break;
				case 'edit-link':
					linkid = div.dataset.link;
					let ogLink = roleMap.links[linkid];
					step = ogLink.step;
					getStepLinkDetails(ogLink, (res) => {
						roleMap.links[linkid] = {
							title: res.title,
							step: res.step,
							url: res.url,
							type: res.type
						}
						mainTab(user, roleMap, editable);
					});
					break;
				case 'remove-link':
					linkid = div.dataset.link;
					roleMap.links[linkid].removed = true;
					mainTab(user, roleMap, editable);
					break;
				default:
					console.log(action, div.dataset);
			}
		});
	});

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





