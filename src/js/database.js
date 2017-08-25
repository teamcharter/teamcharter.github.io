let Database = (firebase, config) => {

	let CharterFirebase = firebase.initializeApp(config, 'Charter Database');
	let db = CharterFirebase.database();
	let auth = CharterFirebase.auth();
		config.localhost = true;
		config.noScreenshots = true;
	let prometheus = Prometheus(config, CharterFirebase);

// Super Dirty: Update Prometheus Promos and Features Here
// db.ref('prometheus/features/contributor').set({info: {name: 'Charter Contributor'}, validate: 'return {allowed: userData.contributor,data: userData}'})

//db.ref('classes/master/teams').remove();
/*db.ref('teams').once('value', (snap) => {
	let teamMap = snap.val() || {};
	for (let tid in teamMap) {
		db.ref(`classes/master/teams/${tid}`).set({
			access: true,
			joined: Date.now()
		});
	}
});*/

	let database = {
		
		init: (callback, fallback) => {
			let called = false;
			auth.onAuthStateChanged((user) => {
				if (user) {
					//
					prometheus.logon(user.uid, {
						name: user.displayName,
						email: user.email,
						image: user.photoURL,
						uid: user.uid
					});
					//
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

		login: (callback, method) => {
			//auth.signOut().then((done) => {
				let provider = new firebase.auth.GoogleAuthProvider();
				if (method === 'facebook') {
					provider = new firebase.auth.FacebookAuthProvider();
				}
				auth.signInWithPopup(provider).then((result) => {
					//console.log(result);
					let token = result.credential.accessToken;
					let user = result.user;
					let providerId = 'Unknown Provider';
					try {
						providerId = user.providerData[0].providerId;
					} catch (e) {
						console.error(e);
					}
					//
					prometheus.logon(user.uid, {
						name: user.displayName,
						email: user.email,
						image: user.photoURL,
						uid: user.uid,
						provider: providerId
					});
					//
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
			if (!uid) {
				throw Error('No user id given.');
			}
			return new Promise((resolve, reject) => {
				db.ref(`prometheus/users/${uid}/profile`).once('value', (snap) => {
					let user = snap.val();
					resolve(user);
				}).catch(reject);
			});
		},

		getTeam: (tid) => {
			if (!tid) {
				throw Error('No team id given.');
			}
			return new Promise((resolve, reject) => {
				db.ref(`teams/${tid}`).once('value', (snap) => {
					let team = snap.val() || {};
					if (Object.keys(team).length > 0) {
						team.tid = tid;
						resolve(team);
					} else {
						resolve({});
					}
				}).catch(reject);
			});
		},

		getTeamEdits: (tid) => {
			if (!tid) {
				throw Error('No team id given.');
			}
			return new Promise((resolve, reject) => {
				db.ref(`edits/${tid}`).once('value', (snap) => {
					let edits = snap.val() || {};
					resolve(edits);
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
						if (memberMap[uid].status === 'template') {
							members[uid] = {
								name: 'Unknown',
								image: './public/img/no-user.png',
								uid: uid,
								email: 'team@omnipointment.com'
							}
						} else {
							let p = database.getUser(uid);
							p.uid = uid;
							promises.push(p);
						}
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
			db.ref(`edits/${tid}`).push({
				field: 'name',
				uid: uid,
				value: name,
				timestamp: Date.now()
			});
			return db.ref(`teams/${tid}/name`).set(name);
		},

		updateQuestion: (tid, uid, question) => {
			if (!tid) {
				throw Error('No team id given.');
			}
			db.ref(`edits/${tid}`).push({
				field: 'question',
				uid: uid,
				value: question,
				timestamp: Date.now()
			});
			return db.ref(`teams/${tid}/question`).set(question);
		},

		updateExpectations: (tid, uid, list) => {
			if (!tid) {
				throw Error('No team id given.');
			}
			db.ref(`edits/${tid}`).push({
				field: 'expectations',
				uid: uid,
				value: list,
				timestamp: Date.now()
			});
			return db.ref(`teams/${tid}/expectations`).set(list);
		},

		submitUpdate: (tid, uid, update) => {
			if (!tid) {
				throw Error('No team id given.');
			}
			if (!uid) {
				throw Error('No user id given.');
			}
			//
			prometheus.save({
				type: 'SUBMIT_UPDATE',
				tid: tid,
				update: update
			});
			//
			return db.ref(`teams/${tid}/updates/${uid}`).push({
				update: update,
				timestamp: Date.now()
			});
		},

		addLink: (tid, uid, data) => {
			if (!tid) {
				throw Error('No team id given.');
			}
			if (!uid) {
				throw Error('No user id given.');
			}
			//
			prometheus.save({
				type: 'ADD_LINK',
				tid: tid,
				name: data.name,
				url: data.url
			});
			//
			db.ref(`edits/${tid}`).push({
				field: 'link',
				uid: uid,
				value: data,
				timestamp: Date.now()
			});
			return db.ref(`teams/${tid}/links`).push({
				name: data.name,
				url: data.url,
				uid: uid,
				added: Date.now()
			});
		},

		updateLink: (tid, uid, key, data) => {
			if (!tid) {
				throw Error('No team id given.');
			}
			if (!uid) {
				throw Error('No user id given.');
			}
			if (!key) {
				throw Error('No link id given.');
			}
			//
			prometheus.save({
				type: 'UPDATE_LINK',
				tid: tid,
				name: data.name,
				url: data.url,
				key: key
			});
			//
			data.key = key;
			db.ref(`edits/${tid}`).push({
				field: 'link',
				uid: uid,
				value: data,
				timestamp: Date.now()
			});
			let p1 = db.ref(`teams/${tid}/links/${key}/name`).set(data.name);
			let p2 = db.ref(`teams/${tid}/links/${key}/url`).set(data.url);
			return Promise.all([p1, p2]);
		},

		removeLink: (tid, uid, key) => {
			if (!tid) {
				throw Error('No team id given.');
			}
			if (!uid) {
				throw Error('No user id given.');
			}
			if (!key) {
				throw Error('No link id given.');
			}
			//
			prometheus.save({
				type: 'REMOVE_LINK',
				tid: tid,
				key: key
			});
			//
			db.ref(`edits/${tid}`).push({
				field: 'link',
				uid: uid,
				value: {
					removed: true,
					key: key
				},
				timestamp: Date.now()
			});
			return db.ref(`teams/${tid}/links/${key}`).remove();
		},

		updateRole: (tid, author, data) => {
			if (!tid) {
				throw Error('No team id given.');
			}
			if (!author) {
				throw Error('No authoring user id given.');
			}
			if (!data.uid) {
				data.uid = author; // If someone is editing their own role
			}
			//
			prometheus.save({
				type: 'UPDATE_ROLE',
				tid: tid,
				uid: data.uid,
				role: data.role,
				responsibility: data.responsibility
			});
			//
			db.ref(`edits/${tid}`).push({
				field: 'role',
				uid: author,
				value: data,
				timestamp: Date.now()
			});
			let p1 = db.ref(`teams/${tid}/members/${data.uid}/role`).set(data.role);
			let p2 = db.ref(`teams/${tid}/members/${data.uid}/responsibility`).set(data.responsibility);
			return Promise.all([p1, p2]);
		},

		addTemplateRole: (tid, author) => {
			//
			prometheus.save({
				type: 'ADD_TEMPLATE_ROLE',
				tid: tid
			});
			//
			return db.ref(`teams/${tid}/members`).push({
				status: 'template',
				role: 'Team Member',
				joined: Date.now(),
				member: true,
				icon: 'user'
			});
		},

		updateRoleIcon: (tid, author, data) => {
			if (!tid) {
				throw Error('No team id given.');
			}
			if (!author) {
				throw Error('No authoring user id given.');
			}
			//
			prometheus.save({
				type: 'UPDATE_ROLE_ICON',
				tid: tid,
				uid: data.uid,
				icon: data.icon
			});
			//
			if (!data.uid) {
				data.uid = author; // If someone is editing their own role
			}
			db.ref(`edits/${tid}`).push({
				field: 'role',
				uid: author,
				value: data,
				timestamp: Date.now()
			});
			return db.ref(`teams/${tid}/members/${data.uid}/icon`).set(data.icon);
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
			//
			prometheus.save({
				type: 'ADD_MEMBER',
				tid: tid,
				uid: uid
			});
			//
			return db.ref(`teams/${tid}/members/${uid}`).set({
				status: 'member',
				role: 'Team Member',
				joined: Date.now(),
				member: true
			});
		},

		removeMember: (tid, author, uid) => {
			//
			prometheus.save({
				type: 'REMOVE_MEMBER',
				tid: tid,
				uid: uid
			});
			//
			return db.ref(`teams/${tid}/members/${uid}`).remove();
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

		createNewTeam: (uid, joinCode, data) => {
			return new Promise((resolve, reject) => {
				let teamName = data.name;
				db.ref('teams').push({
					name: teamName || 'New Team Charter',
					joinCode: joinCode,
					status: data.status || 'regular'
				}).then((res) => {
					let pathList = res.path.ct;
					let tid = pathList[pathList.length - 1];
					//
					prometheus.save({
						type: 'CREATE_TEAM',
						tid: tid,
						name: teamName,
						data: data
					});
					//
					database.addMember(tid, uid).then((done) => {
						resolve({
							tid: tid
						});
					}).catch(reject);
				}).catch(reject);
			});
		},

		getInstructorClasses: (uid) => {
			return new Promise((resolve, reject) => {
				let ref = db.ref(`classes`);
				let query = ref.orderByChild(`members/${uid}/access`).startAt(true).endAt(true);
				query.once('value', (snap) => {
					let nodes = snap.val() || {};
					let list = Object.keys(nodes).map((cid) => {
						let classData = nodes[cid];
						classData.cid = cid;
						return classData;
					});
					if (list.length > 0) {
						let promises = [];
						list.forEach((classData) => {
							let cid = classData.cid;
							for (let tid in classData.teams) {
								let p = new Promise((resolveTeam, rejectTeam) => {
									database.getTeam(tid).then(resolveTeam).catch(rejectTeam);
								});
								p.cid = cid;
								promises.push(p);
							}
						});
						Promise.all(promises).then((teamList) => {
							teamList.forEach((team, tidx) => {
								let meta = promises[tidx];
								if (nodes[meta.cid]){
									if (nodes[meta.cid].teams[team.tid]) {
										nodes[meta.cid].teams[team.tid] = team;
									}
								}
							});
							resolve(nodes)
						}).catch(reject);
					} else {
						resolve({});
					}
				}).catch(reject);
			});
		},

		addTeamToClass: (tid, uid, code) => {
			return new Promise((resolve, reject) => {
				db.ref(`classes/${code}`).once('value', (snap) => {
					let classData = snap.val();
					if (classData) {
						//
						prometheus.save({
							type: 'ADD_TEAM_TO_CLASS',
							tid: tid,
							classCode: code
						});
						//
						db.ref(`classes/${code}/teams/${tid}`).set({
							access: true,
							joined: Date.now()
						}).then((done) => {
							resolve(classData);
						}).catch(reject);
					} else {
						reject(`Could not find a class with code: ${code}.`);
					}
				});
			});
		},

		addInstructorToClass: (uid, code) => {
			return new Promise((resolve, reject) => {
				db.ref(`classes/${code}`).once('value', (snap) => {
					let classData = snap.val();
					if (classData) {
						let memberMap = classData.members || {};
						if (uid in memberMap) {
							resolve({
								isAlreadyInstructor: true,
								classData: classData
							});
						} else {
							//
							prometheus.save({
								type: 'ADD_INSTRUCTOR_TO_CLASS',
								classCode: code
							});
							//
							db.ref(`classes/${code}/members/${uid}`).set({
								access: true,
								type: 'instructor',
								joined: Date.now()
							}).then((done) => {
								resolve({
									isAlreadyInstructor: false,
									classData: classData
								});
							}).catch(reject);
						}
					} else {
						reject(`Could not find a class with code: ${code}.`);
					}
				});
			});
		},

		getInstructorsByClass: (classCode) => {

		}

	}

	return database;
}

export {Database};