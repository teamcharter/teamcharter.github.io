import {config} from './config';
import {Database} from './database';
import {Views} from './views';

let database = Database(firebase, config);

let params = getQueryParams(document.location.search);

let views = Views();

let loginBtn = document.getElementById('login');
let feedbackBtn = document.getElementById('feedback');
let teamTiles = document.getElementById('team-tiles');

loginBtn.addEventListener('click', (e) => {
	database.login(main);
});

database.init(main, () => {
	// No current user
});

function main(user) {

	console.log(user);

	fillText('fill-user-name', user.displayName);
	fillSrc('fill-user-image', user.photoURL);

	let uid = database.getCurrentUser().uid;

	database.getAllTeams(uid).then((teams) => {
		console.log(teams);
		teamTiles.innerHTML = '';
		for (let tid in teams) {
			let team = teams[tid];
			let tile = views.getTeamTile({
				tid: tid,
				name: team.name
			});
			teamTiles.appendChild(tile);
		}
	}).catch(reportErrorToUser)

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
	console.log(text)
	let spans = document.getElementsByClassName(className);
	for (let s = 0; s < spans.length; s++) {
		console.log(text)
		spans[s].src = text;
	}
}
