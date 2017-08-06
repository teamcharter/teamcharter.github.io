import {config} from './config';
import {Database} from './database';
import {Views} from './views';

let database = Database(firebase, config);

let params = getQueryParams(document.location.search);

let views = Views();

let loginBtn = document.getElementById('login');
let feedbackBtn = document.getElementById('feedback');
let createBtn = document.getElementById('create');
let teamTiles = document.getElementById('team-tiles');

/*loginBtn.addEventListener('click', (e) => {
	database.login(main);
});*/

database.init(main, () => {
	// No user signed in
	window.location = `${window.location.origin}/login.html${document.location.search}`;
});

function main(user) {

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

	database.getAllTeams(uid).then((teams) => {
		teamTiles.innerHTML = '';
		for (let tid in teams) {
			let team = teams[tid];
			let tile = views.getTeamTile({
				tid: tid,
				name: team.name
			});
			teamTiles.appendChild(tile);
		}
	}).catch(reportErrorToUser);

	createBtn.addEventListener('click', (e) => {
		let uid = database.getCurrentUser().uid;
		let jc = convertTidToJoinCode(uid);
		vex.dialog.prompt({
			message: `What is your team's name?`,
			value: 'My Team',
			callback: (value) => {
				if (value) {
					database.createNewTeam(uid, jc, value).then((res) => {
						let tid = res.tid;
						let origin = window.location.origin;
						let link = `${origin}/charter.html?team=${tid}`;
						window.location = link;
					}).catch(reportErrorToUser);
				}
			}
		});
	});

	let classCode = params.instructor;
	if (classCode) {
		database.addInstructorToClass(uid, classCode).then((res) => {
			initInstructorSection(uid);
			if (!res.isAlreadyInstructor) {
				vex.dialog.alert({
					message: `You have been added as an instructor to ${res.classData.name}!`
				});
			} else {
				console.log(`You are already an instructor in ${res.classData.name}!`);
			}
		}).catch(reportErrorToUser);
	} else{
		initInstructorSection(uid);
	}

	database.getPrometheus().save({
		type: 'ACCOUNT_PAGE'
	});

}

function initInstructorSection(uid) {
	database.getInstructorClasses(uid).then((classMap) => {
		if (Object.keys(classMap).length > 0){

			let classTiles = document.getElementById('class-tiles');
			document.getElementById('section-instructor').style.display = 'block';
			classTiles.innerHTML = '';

			for (let cid in classMap) {
				let classData = classMap[cid];
				let tile = views.getClassTile({
					cid: cid,
					name: classData.name || 'Untitled Class',
					teams: classData.teams || {}
				});
				classTiles.appendChild(tile);
			}
		}
	}).catch(console.error);
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
