import {config} from './config';
import {Database} from './database';
import {Views} from './views';

let database = Database(firebase, config);

let params = getQueryParams(document.location.search);

let views = Views();

let loginBtn = document.getElementById('login');
let loginFacebookBtn = document.getElementById('login-facebook');
let feedbackBtn = document.getElementById('feedback');

loginBtn.addEventListener('click', (e) => {
	database.login(main, 'google');
});

loginFacebookBtn.addEventListener('click', (e) => {
	database.login(main, 'facebook');
});

if (!params.nologin) {
	database.init(main, () => {
		// No user signed in
	});
}

function main(user) {

	console.log(user);

	// Redirect
	if (params.team) {
		window.location = `${window.location.origin}/charter.html${document.location.search}`;
	} else if (params.class) {
		window.location = `${window.location.origin}/onboard.html${document.location.search}`;
	} else {
		window.location = `${window.location.origin}/me.html${document.location.search}`;
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
