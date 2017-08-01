let Database = (firebase, config) => {

	let CharterFirebase = firebase.initializeApp(config, 'Charter Database');
	let db = CharterFirebase.database();
	let auth = CharterFirebase.auth();
		config.localhost = true;
		config.noScreenshots = true;
	let prometheus = Prometheus(config, CharterFirebase);

	let database = {
		
		init: (callback, fallback) => {
			let called = false;
			auth.onAuthStateChanged((user) => {
				if (user) {
					prometheus.logon(user.uid, {
						name: user.displayName,
						email: user.email,
						image: user.photoURL,
						uid: user.uid
					});
					if (!called) {
						called = true;
						callback(user);
					}
				} else {
					if (!called) {
						called = true;
						fallback();
					}
				}
			});
		},

		login: (callback) => {
			//auth.signOut().then((done) => {
				let provider = new firebase.auth.GoogleAuthProvider();
				auth.signInWithPopup(provider).then((result) => {
					let token = result.credential.accessToken;
					let user = result.user;
					prometheus.logon(user.uid, {
						name: user.displayName,
						email: user.email,
						image: user.photoURL,
						uid: user.uid
					});
					callback(user);
				}).catch(function(error) {
					/*let errorCode = error.code;
					let errorMessage = error.message;
					let email = error.email;
					let credential = error.credential;*/
					console.error(error);
				});
			/*}).catch((err) => {
				console.error(err);
			});*/
		},

		getPrometheus: () => {
			return prometheus;
		},

		getCurrentUser: () => {
			return auth.currentUser || {};
		},

		saveFeedback: (tid, uid, feedback) => {
			return db.ref(`feedback`).push({
				tid: tid,
				uid: uid,
				feedback: feedback,
				timestamp: Date.now()
			});
		},

		getUser: (uid) => {
			return new Promise((resolve, reject) => {
				db.ref(`prometheus/users/${uid}/profile`).once('value', (snap) => {
					let user = snap.val();
					resolve(user);
				}).catch(reject);
			});
		},

		getTeam: (tid) => {
			return new Promise((resolve, reject) => {
				db.ref(`teams/${tid}`).once('value', (snap) => {
					let team = snap.val();
					resolve(team);
				}).catch(reject);
			});
		},

		onTeamChange: (tid, callback, fallback) => {
			if (!tid) {
				throw Error('No team id given.');
			}
			let members = {};
			db.ref(`teams/${tid}`).on('value', (snap) => {
				let promises = [];
				let team = snap.val() || {};
				let memberMap = team.members || {};
				for (let uid in memberMap) {
					if (!(uid in members)) {
						let p = database.getUser(uid);
						p.uid = uid;
						promises.push(p);
					}
				}
				if (promises.length > 0) {
					Promise.all(promises).then((users) => {
						users.forEach((member, idx) => {
							let uid = promises[idx].uid;
							members[uid] = member;
						});
						callback(team, members);
					});
				} else {
					callback(team, members);
				}
			});
		},

		updateTeamName: (tid, uid, name) => {
			if (!tid) {
				throw Error('No team id given.');
			}
			return db.ref(`teams/${tid}/name`).set(name);
		},

		updateQuestion: (tid, uid, question) => {
			if (!tid) {
				throw Error('No team id given.');
			}
			return db.ref(`teams/${tid}/question`).set(question);
		},

		updateExpectations: (tid, uid, list) => {
			if (!tid) {
				throw Error('No team id given.');
			}
			return db.ref(`teams/${tid}/expectations`).set(list);
		},

		submitUpdate: (tid, uid, update) => {
			if (!tid) {
				throw Error('No team id given.');
			}
			if (!uid) {
				throw Error('No user id given.');
			}
			return db.ref(`teams/${tid}/updates/${uid}`).push({
				update: update,
				timestamp: Date.now()
			});
		},

		joinTeam: (tid, uid, joinCode) => {
			if (!tid) {
				throw Error('No team id given.');
			}
			if (!uid) {
				throw Error('No user id given');
			}
			return new Promise((resolve, reject) => {
				database.getTeam(tid).then((team) => {
					if (joinCode === team.joinCode || !team.joinCode) {
						database.addMember(tid, uid).then((done) => {
							resolve({
								success: true
							});
						}).catch(reject);
					} else {
						resolve({
							success: false
						});
					}
				}).catch(reject);
			});
		},

		addMember: (tid, uid) => {
			return db.ref(`teams/${tid}/members/${uid}`).set({
				status: 'member',
				role: 'Team Member',
				joined: Date.now(),
				member: true
			});
		},

		getAllTeams: (uid) => {
			return new Promise((resolve, reject) => {
				let ref = db.ref(`teams`);
				let query = ref.orderByChild(`members/${uid}/member`).startAt(true).endAt(true);
				query.once('value', (snap) => {
					let nodes = snap.val() || {};
					resolve(nodes);
				}).catch(reject);
			});
		},

		createNewTeam: (uid, joinCode, teamName) => {
			return new Promise((resolve, reject) => {
				db.ref('teams').push({
					name: teamName || 'New Team Charter',
					joinCode: joinCode
				}).then((res) => {
					let pathList = res.path.ct;
					let tid = pathList[pathList.length - 1];
					database.addMember(tid, uid).then((done) => {
						resolve({
							tid: tid
						});
					}).catch(reject);
				}).catch(reject);
			});
		}

	}

	return database;
}

export {Database};