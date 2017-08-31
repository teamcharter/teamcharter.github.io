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

/*let user_uids = {
	vinesh: '74EmwjB7Y6S02sFYfgIGn7a5zuP2',
	faraz: '82dZC5ktFbeSNIDcT20CLVB8qMW2',
	kelly: 'G9hzoVBclzRzqLo4VUlZq4yVxFG2',
	rosa: 'jCKUJrFM4EfxAH2VZjwtMjvKEnW2'
}

let promiseData = {
	a0: {
		promiseid: "promise-a",
		type: "edit",
		author: user_uids.rosa,
		timestamp: new Date("8/1/2017 4:07 PM").getTime(),
		//
		title: "Brainstorm",
		description: "brainstorm 50 startups",
		due: new Date("8/3/2017 1:50 PM").getTime(),
		level: 1 // small
	},
	a1: {
		promiseid: "promise-a",
		type: "comment",
		author: user_uids.rosa,
		timestamp: new Date("8/1/2017 4:08 PM").getTime(),
		//
		text: "I will follow the IDEO rules of brainstorming."
	},
	a2: {
		promiseid: "promise-a",
		type: "edit",
		author: user_uids.rosa,
		timestamp: new Date("8/1/2017 4:09 PM").getTime(),
		//
		description: "brainstorm 50 startups for us to learn about"
	},
	a3: {
		promiseid: "promise-a",
		type: "edit",
		author: user_uids.rosa,
		timestamp: new Date("8/1/2017 4:10 PM").getTime(),
		//
		title: "Brainstorm Startups"
	},
	a4: {
		promiseid: "promise-a",
		type: "link",
		author: user_uids.rosa,
		timestamp: new Date("8/1/2017 4:12 PM").getTime(),
		//
		linkid: "link-a",
		url: "https://drive.google.com/drive/u/0/folders/0B7DvBWuSCfXcbGZTclg2TTlYRU0",
		name: "Brainstorm Doc"
	},
	a5: {
		promiseid: "promise-a",
		type: "comment",
		author: user_uids.vinesh,
		timestamp: new Date("8/1/2017 4:17 PM").getTime(),
		//
		text: "Did you consider AirBnb?"
	},
	a6: {
		promiseid: "promise-a",
		type: "comment",
		author: user_uids.rosa,
		timestamp: new Date("8/1/2017 4:18 PM").getTime(),
		//
		text: "Yes, I did!"
	},
	a7: {
		promiseid: "promise-a",
		type: "complete",
		author: user_uids.rosa,
		timestamp: new Date("8/2/2017 9:43 AM").getTime(),
		//
		completed: true
	},
	a8: {
		promiseid: "promise-a",
		type: "complete",
		author: user_uids.rosa,
		timestamp: new Date("8/2/2017 2:31 PM").getTime(),
		//
		completed: false
	},
	a9: {
		promiseid: "promise-a",
		type: "comment",
		author: user_uids.rosa,
		timestamp: new Date("8/2/2017 2:31 PM").getTime(),
		//
		text: "Added some extra companies I came up with."
	},
	a10: {
		promiseid: "promise-a",
		type: "complete",
		author: user_uids.rosa,
		timestamp: new Date("8/2/2017 2:32 PM").getTime(),
		//
		completed: true
	},
	b0: {
		promiseid: "promise-b",
		type: "edit",
		author: user_uids.vinesh,
		timestamp: new Date("8/3/2017 1:32 PM").getTime(),
		//
		title: "Articles",
		description: "find articles about startup leadership",
		due: new Date("8/3/2017 1:50 PM").getTime(),
		level: 2 // medium
	},
};*/

function mainPromiseTab(tid, team, members, user) {

	console.log('main promise tab')

	//database.getTeam(tid).then((team) => {
		//console.log(members)
	//});

	let renderedTable = false;

	database.onTeamPromisesChange(tid, (allPromiseData) => {
		let teamPromises = parsePromiseData(allPromiseData);
		//console.log(teamPromises);
		renderPromiseTable(teamPromises, members, tid);
		if (!renderedTable) {
			renderedTable = true;
			document.getElementById('new-promise').addEventListener('click', (e) => {
				database.addPromise({
					tid: tid,
					author: database.getCurrentUser().uid,
				}).then((res) => {
					let promiseid = res.promiseid;
					let promiseData = res.data;
					let wrapper = parsePromiseData({init: promiseData});
					let focusedPromise = wrapper[promiseid];
					//console.log(focusedPromise)
					renderPromiseEditor(promiseid, focusedPromise, members, tid, true);
				}).catch(reportErrorToUser);
			});
		}
	});

	document.querySelector('#charter-tab').addEventListener('click', (e) => {
		window.location = `${window.location.origin}/charter.html${document.location.search}`;
	});

	document.querySelector('#promises-tab').addEventListener('click', (e) => {
		window.location = `${window.location.origin}/promises.html${document.location.search}`;
	});

	document.querySelector('#health-tab').addEventListener('click', (e) => {
		window.location = `${window.location.origin}/health.html${document.location.search}`;
	});

	/*let proms = [];
	for (let person_key in user_uids) {
		let uid = user_uids[person_key];
		let pr = database.getUser(uid);
		pr.uid = uid;
		proms.push(pr);
	}
	Promise.all(proms).then((users) => {

		let user_profiles = {};
		users.forEach((userData, uidx) => {
			let uid = proms[uidx].uid;
			user_profiles[uid] = userData;
		});

		let teamPromises = parsePromiseData(promiseData);
		console.log(teamPromises);

		renderPromiseTable(teamPromises, user_profiles, tid);

	});*/

}

function renderPromiseTable(promiseData, profiles, tid) {

	let table = views.getPromiseTable({
		promises: promiseData,
		profiles: profiles
	});

	let tableHolder = document.getElementById('promise-table');
	tableHolder.innerHTML = '';
	tableHolder.appendChild(table);

	let promiseButtons = Array.from(document.querySelectorAll('[data-promiseid]'));
	promiseButtons.forEach((button) => {
		button.addEventListener('click', (e) => {
			let promiseid = button.dataset['promiseid'];
			console.log(`promiseid: ${promiseid}`);
			let focusedPromise = promiseData[promiseid];
			renderPromiseBox(promiseid, focusedPromise, profiles, tid);
		});
	});

	/*let i = 0;
	for (let pdid in promiseData) {
		if (i > 0) {
			renderPromiseBox(pdid, promiseData[pdid], profiles, tid);
			break;
		}
		i++;
	}*/

}

function renderPromiseBox(promiseid, focusedPromise, profiles, tid) {

	renderPromiseBoxCallback(promiseid, focusedPromise, profiles, tid);

	database.onPromiseChange(tid, promiseid, (data) => {

		let wrapper = parsePromiseData(data);
		let inPromise = wrapper[promiseid];
		// Account for change in profiles?
		renderPromiseBoxCallback(promiseid, inPromise, profiles, tid);

	});

}

let justSubmittedComment = false;

function renderPromiseBoxCallback(promiseid, focusedPromise, profiles, tid) {

	let box = views.getPromiseBox({
		promise: focusedPromise,
		profiles: profiles
	});

	let saveTyping = false;
	let textarea = document.querySelector('[data-fpb="textarea"]');
	if (textarea) {
		saveTyping = textarea.value;
	}

	let out = focusedPromiseDiv;
		out.innerHTML = '';
		out.appendChild(box);

	if (justSubmittedComment) {
		saveTyping = false;
		justSubmittedComment = false;
	}

	if (saveTyping) {
		textarea = document.querySelector('[data-fpb="textarea"]');
		textarea.value = saveTyping;
	}

	editPromiseDiv.style.display = 'none';
	allPromisesDiv.style.display = 'none';
	out.style.display = 'block';

	document.querySelector('[data-fpb="back"]').addEventListener('click', (e) => {
		allPromisesDiv.style.display = 'block';
		out.style.display = 'none';
	});

	document.querySelector('[data-fpb="edit"]').addEventListener('click', (e) => {
		renderPromiseEditor(promiseid, focusedPromise, profiles, tid, false);
	});

	document.querySelector('[data-fpb="comment"]').addEventListener('click', (e) => {
		let myTextarea = document.querySelector('[data-fpb="textarea"]');
		let text = myTextarea.value;
		if (text) {
			justSubmittedComment = true;
			database.commentOnPromise({
				tid: tid,
				promiseid: promiseid,
				author: database.getCurrentUser().uid,
				text: text
			}).then((done) => {
				myTextarea.value = '';
			}).catch(reportErrorToUser);
		}
	});

	document.querySelector('[data-fpb="link"]').addEventListener('click', (e) => {
		let msg = `Enter Link URL:`;
		promptLinkDataThen(msg, (url, name) => {
			database.addLinkToPromise({
				tid: tid,
				promiseid: promiseid,
				author: database.getCurrentUser().uid,
				url: url,
				name: name
			}).then((done) => {}).catch(reportErrorToUser);
		});
	});

	document.querySelector('[data-fpb="complete"]').addEventListener('click', (e) => {
		database.updatePromise({
			type: 'complete',
			tid: tid,
			promiseid: promiseid,
			author: database.getCurrentUser().uid,
			completed: !focusedPromise.completed
		}).then((done) => {}).catch(reportErrorToUser);
	});

	Array.from(document.querySelectorAll('.edit-link[data-for]')).forEach((editor) => {
		editor.addEventListener('click', (e) => {
			let key = editor.dataset['for'];
			console.log('link key: ' + key);
			let linkData = focusedPromise.links[key];
			let msg = `Edit Link URL:`;
			promptLinkDataThen(msg, (url, name) => {
				database.addLinkToPromise({
					tid: tid,
					promiseid: promiseid,
					linkid: key,
					author: database.getCurrentUser().uid,
					url: url,
					name: name
				}).then((done) => {}).catch(reportErrorToUser);
			}, linkData);
		});
	});

}

function renderPromiseEditor(promiseid, focusedPromise, profiles, tid, inDeletable) {
	let deletable = inDeletable || false;
	let out = focusedPromiseDiv;
	allPromisesDiv.style.display = 'none';
	out.style.display = 'none';
	editPromiseDiv.style.display = 'block';
	let model = focusedPromise;
	model.deletable = deletable;
	let div = views.getPromiseEditor(model);
	editPromiseDiv.innerHTML = '';
	editPromiseDiv.appendChild(div);
	let warning = document.querySelector('[data-pef="warning"]');
	let btn = document.querySelector('[data-pef="submit"]');
	btn.addEventListener('click', (e) => {
		let title = document.querySelector('[data-pef="title"]');
		let description = document.querySelector('[data-pef="description"]');
		let due = document.querySelector('[data-pef="due"]');
		let timestamp = Date.parse(due.innerText);
		if (isNaN(timestamp) == false) {
			database.updatePromise({
				type: 'edit',
				tid: tid,
				promiseid: promiseid,
				author: database.getCurrentUser().uid,
				title: title.innerText,
				description: description.innerText,
				due: timestamp
			}).then((done) => {
				editPromiseDiv.style.display = 'none';
				renderPromiseBox(promiseid, focusedPromise, profiles, tid);
			}).catch(reportErrorToUser);
		} else {
			warning.innerText = 'Choose a valid date.';
		}
	});
	let remove = document.querySelector('[data-pef="remove"]');
	if (remove) {
		remove.addEventListener('click', (e) => {
			database.unsetPromise({
				tid: tid,
				promiseid: promiseid
			}).then((done) => {
				allPromisesDiv.style.display = 'block';
				out.style.display = 'none';
				editPromiseDiv.style.display = 'none';
			}).catch(reportErrorToUser);
		});
	}
	let cancel = document.querySelector('[data-pef="cancel"]');
	if (cancel) {
		cancel.addEventListener('click', (e) => {
			editPromiseDiv.style.display = 'none';
			renderPromiseBox(promiseid, focusedPromise, profiles, tid);
		});
	}
}

function parsePromiseData(data) {
	//console.log(data);
	let output = {};
	if (data) {
		Object.keys(data).map((key) => {
			let val = data[key];
				val.key = key;
			return val;
		}).sort((a, b) => {
			return a.timestamp - b.timestamp;
		}).forEach((node) => {
			let promiseid = node.promiseid;
			if (!(promiseid in output)) {
				output[promiseid] = {
					//
					promise_id: false,
					author: false,
					title: 'Untitled Promise',
					description: '...',
					level: 1,
					completed: false,
					//
					started: false,
					finished: false,
					due: false,
					lastActive: false,
					//
					links: {},
					comments: {}
				};
			}
			output[promiseid].lastActive = node.timestamp;
			switch (node.type) {
				case 'edit': 
					if (!output[promiseid].started) {
						output[promiseid].started = node.timestamp;
					}
					if (node.author && !output[promiseid].author) {
						output[promiseid].author = node.author;
					}
					if (node.title) {
						output[promiseid].title = node.title;
						// Add Comment
					}
					if (node.description) {
						output[promiseid].description = node.description;
						// Add Comment
						output[promiseid].comments[node.key] = {
							author: node.author,
							timestamp: node.timestamp,
							text: `Set description: ${node.description}`,
							generated: true
						};
					}
					if (node.level) {
						output[promiseid].level = node.level;
						// Add Comment
					}
					if (node.due) {
						output[promiseid].due = node.due;
						// Add Comment
					}
					break;
				case 'comment':
					output[promiseid].comments[node.key] = {
						author: node.author,
						timestamp: node.timestamp,
						text: node.text
					};
					break;
				case 'link':
					let linkid = node.linkid;
					if (!(linkid in output[promiseid].links)) {
						output[promiseid].links[linkid] = {
							linkid: linkid
						};
					}
					if (node.url) {
						output[promiseid].links[linkid].url = node.url;
					}
					if (node.name) {
						output[promiseid].links[linkid].name = node.name;
					}
					if (node.remove) {
						delete output[promiseid].links[linkid];
						// Add Comment
					}
					break;
				case 'complete':
					output[promiseid].completed = node.completed;
					output[promiseid].finished = node.timestamp;
					// Add Comment
					output[promiseid].comments[node.key] = {
						author: node.author,
						timestamp: node.timestamp,
						text: `Marked as ${node.completed ? 'complete' : 'incomplete'}.`,
						generated: true
					};
					break;
				default:
					break;
			}

		});
	}
	return output;
}

function promptLinkDataThen(message, callback, inPrefill) {
	let prefill = inPrefill || {};
	vex.dialog.prompt({
		message: message,
		value: prefill.url,
		callback: (url) => {
			if (url) {
				vex.dialog.prompt({
					message: 'What is the name of this link?',
					value: prefill.name,
					callback: (name) => {
						if (url && name) {
							callback(url, name);
						}
					}
				});
			}
		}
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
			mainPromiseTab(tid, team, members, user);
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

