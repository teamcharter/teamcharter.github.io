const EMOTION_HEADERS = {
	'Joy': {type: 'Joy', color: '#BEFC8C', level: 1},
	'Love': {type: 'Love', color: '#EEF982', level: 1},
	'Fear': {type: 'Fear', color: '#ECA09D', level: 1},
	'Anger': {type: 'Anger', color: '#E078EF', level: 1},
	'Sadness': {type: 'Sadness', color: '#A9C1FA', level: 1},
	'Surprise': {type: 'Surprise', color: '#BCFCDE', level: 1}
};

let Views = () => {

	let views = {

		getRoleAndUpdateTile: (model) => {
			let posted = new Date(model.timestamp);
			let dateFormat = moment(posted).format('M/D h:mm A');
			let diff = moment(Date.now()).diff(moment(model.timestamp));
			let daysSinceLastUpdate = moment.duration(diff).asDays();
			let tagClass = 'is-success';
			if (daysSinceLastUpdate >= 5) {
				tagClass = 'is-danger';
			}
			else if (daysSinceLastUpdate >= 3) {
				tagClass = 'is-warning';
			}
			let html = `
				<div class="tile is-parent is-vertical is-5">
					<div class="tile is-child">
						<div class="media">
							<figure class="media-left">
								<p class="image is-48x48">
									<img src="${model.image}">
								</p>
							</figure>
							<div class="media-content content">
								<h3 class="title is-5">${model.name}</h3>
								<p class="subtitle is-6">${model.role}</p>
							</div>
						</div>
					</div>
				</div>
				<div class="tile is-parent is-vertical is-7">
					<div class="tile is-child">
						<div class="content">
							<span class="tag ${tagClass}">${dateFormat}</span> ${model.update}
						</div>
					</div>
				</div>`;
			let div = document.createElement('div');
				div.classList.add('tile');
				div.innerHTML = html;
			return div;
		},

		getRoleTile: (model) => {
			let editSection = `<div class="content">
				<h3 class="title is-5">${model.role}</h3>
				<p class="subtitle is-6">${model.responsibility}</p>
			</div>`;
			if (model.editable) {
				editSection = `<div class="content">
					<h3 id="my-title" class="title is-5" contenteditable="true">${model.role}</h3>
					<p id="my-responsibility" class="subtitle is-6" contenteditable="true">${model.responsibility}</p>
					<button id="my-role-save" class="button is-primary is-outlined is-hidden-to-mentor">
						<span class="icon">
							<i class="fa fa-edit"></i>
						</span>
						<span>Save Role</span>
					</button>
				</div>`;
			}
			let html = `
				<div class="tile is-parent is-vertical is-5">
					<div class="tile is-child">
						<div class="media">
							<figure class="media-left">
								<p class="image is-48x48">
									<img src="${model.image}">
								</p>
							</figure>
							<div class="content">
								<h3 class="title is-5">${model.name}</h3>
							</div>
						</div>
					</div>
				</div>
				<div class="tile is-parent is-vertical is-7">
					<div class="tile is-child">
						${editSection}
					</div>
				</div>`;
			let div = document.createElement('div');
				div.classList.add('tile');
				div.innerHTML = html;
			return div;
		},

		getRoleTemplateTile: (model) => {
			let editSection = `<div class="content">
				<h3 class="title is-5">${model.role}</h3>
				<p class="subtitle is-6">${model.responsibility}</p>
			</div>`;
			let editButton = ``;
			if (model.editable) {
				editSection = `<div class="content">
					<h3 data-bind="field-role" class="title is-5" contenteditable="true">${model.role}</h3>
					<p data-bind="field-responsibility" class="subtitle is-6" contenteditable="true">${model.responsibility}</p>
				</div>`;
				editButton = `
				<div class="tile is-parent is-vertical is-4">
					<button data-bind="button-save" class="button is-primary is-outlined is-hidden-to-mentor">
						<span class="icon">
							<i class="fa fa-edit"></i>
						</span>
						<span>Save Role</span>
					</button>
				</div>
				`;
			}
			let html = `
				<div class="tile is-parent is-vertical {model.editable ? 'is-8' : 'is-12'}">
					<div class="tile is-child">
						<div class="media">
							<figure class="media-left">
								<div data-bind="field-icon" class="image is-48x48 icon-image">
									<i class="fa fa-${model.icon || 'user'}"></i>
								</div>
							</figure>
							<div class="tile is-child">
								${editSection}
							</div>
						</div>
					</div>
				</div>
				${editButton}
			`;
			let div = document.createElement('div');
				div.classList.add('tile');
				div.innerHTML = html;
			if (model.editable && model.onSave) {
				let button = div.querySelectorAll('[data-bind=button-save]')[0];
				let role = div.querySelectorAll('[data-bind=field-role]')[0];
				let resp = div.querySelectorAll('[data-bind=field-responsibility]')[0];
				button.addEventListener('click', (e) => {
					model.onSave({
						e: e,
						model: model,
						role: role.innerText,
						responsibility: resp.innerText
					});
				});
				let iconEdit = div.querySelectorAll('[data-bind=field-icon]')[0];
				iconEdit.addEventListener('click', (e) => {
					model.onIconEdit({
						e: e,
						model: model
					});
				});
			}
			return div;
		},

		getProgressUpdate: (model) => {
			let posted = new Date(model.timestamp);
			let dateFormat = moment(posted).format('M/D h:mm A');
			let diff = moment(Date.now()).diff(moment(model.timestamp));
			let daysSinceLastUpdate = moment.duration(diff).asDays();
			let tagClass = 'is-success';
			if (daysSinceLastUpdate >= 5) {
				tagClass = 'is-danger';
			}
			else if (daysSinceLastUpdate >= 3) {
				tagClass = 'is-warning';
			}
			let html = `
				<div class="tile is-parent is-vertical is-5">
					<div class="tile is-child">
						<span class="tags has-addons">
							<span class="tag ${tagClass} is-medium">${dateFormat}</span>
							<span class="tag is-medium">
								<span class="image image-tag-rounded is-32x32">
									<img src="${model.image}">
								</span>
								<span class="is-medium">
									${model.name}
								</span>
							</span>
						</span>
					</div>
				</div>
				<div class="tile is-parent is-vertical is-7">
					<div class="tile is-child">
						<div class="content">
							${model.update}
						</div>
					</div>
				</div>`;
			let div = document.createElement('div');
				div.classList.add('tile');
				div.innerHTML = html;
			return div;
		},

		getLinkItem: (model) => {
			let icon = 'file';
			if (model.url.indexOf('docs.google') > -1) {
				icon = 'google';
				if (model.url.indexOf('docs.google.com/document') > -1) {
					icon = 'file-text';
				} else if (model.url.indexOf('docs.google.com/spreadsheets') > -1) {
					icon = 'table';
				} else if (model.url.indexOf('docs.google.com/presentation') > -1) {
					icon = 'slideshare';
				}
			} else if (model.url.indexOf('omnipointment.com/meeting') > -1) {
				icon = 'calendar';
			} else if (model.url.indexOf('github.com') > -1) {
				icon = 'github';
			} else if (model.url.indexOf('youtube.com') > -1) {
				icon = 'youtube-play';
			} else if (model.url.indexOf('vimeo.com') > -1) {
				icon = 'vimeo';
			} else if (model.url.indexOf('codeshare.io') > -1 || model.url.indexOf('codepen.io') > -1) {
				icon = 'code-fork';
			}
			let html = `
				<a target="_blank" href="${model.url}">
					<span class="icon">
						<i class="fa fa-${icon}"></i>
					</span>
					<span>${model.name}</span>
				</a>
				<a class="is-danger is-hidden-to-mentor">
					<span class="icon edit-link" data-for="${model.key}">
						<i class="fa fa-edit"></i>
					</span>
				</a>
			`;
			let div = document.createElement('div');
				div.classList.add('team-link');
				div.innerHTML = html;
			return div;
		},

		getTeamTile: (model) => {
			let origin = window.location.origin;
			let link = `${origin}/charter.html?team=${model.tid}`;
			let tag = `<span class="tag is-warning">Template</span>`;
			let html = `
				<div class="tile is-vertical">
					<div class="box">
						<div class="tile">
							<div class="content">
								<h3 class="title">${model.name} ${model.isTemplate ? tag : ''}</h3>
							</div>
						</div>
						<div class="tile">
							<a href="${link}" class="button is-primary is-outlined">View Team Charter</a>
						</div>
					</div>
				</div>`;
			let div = document.createElement('div');
				div.classList.add('column');
				div.classList.add('is-4');
				div.innerHTML = html;
			return div;
		},

		getClassTile: (model) => {
			let origin = window.location.origin;
			let classLink = `${origin}/class.html?class=${model.cid}`;
			let list = Object.keys(model.teams).filter((tid) => {
				return Object.keys(model.teams[tid]).length > 0;
			}).map((tid) => {
				let team = model.teams[tid];
				team.tid = tid;
				return team;
			});
			let n = list.length;
			let items = list.map((team) => {
				let teamLink = `${origin}/charter.html?team=${team.tid}&mentor=true`;
				let itemHTML = `
					<div class="column is-4">
						<a href=${teamLink} class="button is-primary is-outlined is-fullwidth">${team.name}</a>
					</div>
				`;
				return itemHTML;
			});
			let html = `
				<div class="tile is-vertical">
					<div class="tile box is-child">
						<div class="content">
							<h3 class="title">${model.name}</h3>
							<p class="subtitle">${n} team${n === 1 ? '' : 's'} | Code: ${model.cid}</p>
							<a href="${classLink}" class="button is-primary is-outlined">View Class Dashboard</a>
			`;
							/*<div class="columns is-multiline">
								${items.join('')}
							</div>*/
			html += `
						</div>
					</div>
				</div>`;
				//<a href="${link}" class="button is-primary is-outlined">View Class Progress</a>
			let div = document.createElement('div');
				div.classList.add('column');
				div.classList.add('is-4');
				div.innerHTML = html;
			return div;
		},

		getUserTile: (model) => {
			let html = `
				<div class="tile is-child">
					<div class="media">
						<figure class="media-left">
							<p class="image is-48x48 image-tag-rounded">
								<img src="${model.image}">
							</p>
						</figure>
						<div class="content">
							<h3 class="title is-5">${model.name}</h3>
							<p class="subtitle is-6">${model.subtitle}</p>
						</div>
					</div>
				</div>
			`;
			let div = document.createElement('div');
				div.classList.add('column');
				div.classList.add('is-4');
				div.innerHTML = html;
			return div;
		},

		getClassTeamTable: (model) => {
			let html = `
				<thead>
					<tr>
						<th>Team Name</th>
						<th>Members</th>
						<th>Charter Edits</th>
						<th>Progress Updates</th>
						<th>Last Active</th>
						<th>View Team</th>
					</tr>
				</thead>
				<tbody>
			`;
			model.teams.forEach((team) => {
				let updates = 0;
				for (let uid in team.updates) {
					for (let upid in team.updates[uid]) {
						updates++;
					}
				}
				let origin = window.location.origin;
				let link = `${origin}/charter.html?team=${team.tid}&mentor=true`;
				let members = team.members || {};
				html += `
					<tr>
						<td>${team.name}</td>
						<td>${Object.keys(members).length}</td>
						<td>${Object.keys(team.edits).length}</td>
						<td>${updates}</td>
						<td>${moment(team.lastAccess).fromNow()}</td>
						<td>
							<a href="${link}" class="button is-primary is-outlined">View Charter</a>
						</td>
					</tr>
				`;
			});
			html += `
				</tbody>
			`;
			let table = document.createElement('table');
				table.classList.add('table');
				table.classList.add('is-narrow');
				table.classList.add('is-fullwidth');
				table.innerHTML = html;
			return table;
		},

		getClassTeamGrid: (model) => {
			let html = ``;
			model.teams.forEach((team) => {
				let updates = 0;
				for (let uid in team.updates) {
					for (let upid in team.updates[uid]) {
						updates++;
					}
				}
				let origin = window.location.origin;
				let link = `${origin}/charter.html?team=${team.tid}&code=${team.joinCode}`;
				let members = team.members || {};
				html += `
					<div class="column is-6">
						<div class="box content has-text-centered">
							<h2 class="title is-4">${team.name}</h2 class="title is-4">
							<p class="subtitle is-neatly-spaced">Last active ${moment(team.lastAccess).fromNow()}</p>
							<p class="subtitle is-neatly-spaced">${Object.keys(team.edits).length} charter edits</p>
				`;
				for (let uid in team.members) {
					let profile = model.profiles[uid];
					let userModel = {
						name: 'Unknown Student',
						image: './public/img/no-user.png',
						subtitle: '...'
					}
					if (profile.name) {
						userModel.name = profile.name;
					}
					if (profile.image) {
						userModel.image = profile.image;
					}
					if (team.members[uid].role) {
						userModel.subtitle = team.members[uid].role;
					}
					let userDiv = views.getUserTile(userModel);
					html += userDiv.innerHTML;
				}
				html += `
							<div class="is-grouped has-text-centered">
								<a href="${link}" class="button is-primary is-outlined">Join Team</a>
							</div>
						</div>
					</div>
				`;
			});
			html += `
					<div class="column is-6">
						<div class="box content has-text-centered">
							<h2 class="title is-4">Start New Team</h2 class="title is-4">
							<p class="subtitle is-neatly-spaced">Don't see your team?</p>
			`;

			let profile = model.profiles[model.uid];
			let userModel = {
				name: 'Unknown Student',
				image: './public/img/no-user.png',
				subtitle: 'Team Member'
			}
			if (profile.name) {
				userModel.name = profile.name;
			}
			if (profile.image) {
				userModel.image = profile.image;
			}
			let userDiv = views.getUserTile(userModel);
			html += userDiv.innerHTML;

			html += `				
							<div class="is-grouped has-text-centered">
								<a id="new-team" class="button is-primary is-outlined">Start New Team</a>
							</div>
						</div>
					</div>
			`;
			let div = document.createElement('div');
				div.classList.add('columns');
				div.classList.add('is-multiline');
				div.innerHTML = html;
			return div;
		},

		getClassTeamMetricsGrid: (model) => {
			let html = ``;
			model.teams.forEach((team) => {
				let updates = 0;
				for (let uid in team.updates) {
					for (let upid in team.updates[uid]) {
						updates++;
					}
				}
				let origin = window.location.origin;
				let link = `${origin}/charter.html?team=${team.tid}&mentor=true`;
				let members = team.members || {};
				html += `
					<div class="column is-12">
						<div class="box content has-text-centered">
							<h2 class="title is-3">${team.name}</h2>
							<p class="subtitle is-neatly-spaced">Last active ${moment(team.lastAccess).fromNow()} | ${Object.keys(team.edits).length} charter edits</p>
							<a href="${link}" class="button is-primary is-outlined">View Team Charter</a>
							<hr>
							<div class="columns">
								<div class="column is-4">
				`;
				/*let teamOverviewDiv = views.getUserTile({
					name: 'Team Overview',
					image: './public/img/no-user.png',
					subtitle: '...'
				});
				html += teamOverviewDiv.innerHTML;*/
				for (let uid in team.members) {
					let profile = model.profiles[uid] || {};
					let userModel = {
						name: 'Unknown Student',
						image: './public/img/no-user.png',
						subtitle: '...'
					}
					if (profile.name) {
						userModel.name = profile.name;
					}
					if (profile.image) {
						userModel.image = profile.image;
					}
					if (team.members[uid].role) {
						userModel.subtitle = team.members[uid].role;
					}
					let userDiv = views.getUserTile(userModel);
					userDiv.children[0].dataset.studentid = uid;
					userDiv.children[0].dataset.teamid = team.tid;
					html += userDiv.innerHTML;
				}
				let metrics = model.metrics[team.tid] || {};
				//console.log(metrics);
				html += `
								</div>
								<div data-teamlink="${team.tid}" class="column is-8">
									<p class="has-text-centered">Click on a student to view their updates.</p>
								</div>
							</div>
						</div>
					</div>
				`;
			});
			let div = document.createElement('div');
				div.classList.add('columns');
				div.classList.add('is-multiline');
				div.innerHTML = html;
				Array.from(div.querySelectorAll('[data-studentid]')).forEach((stdiv) => {
					stdiv.addEventListener('click', (e) => {
						let uid = stdiv.dataset.studentid;
						let tid = stdiv.dataset.teamid;
						//console.log(uid, model.profiles[uid]);
						let emotionList = model.metrics[tid].emotions.filter((ed) => {
							return ed.uid === uid;
						});
						let mdiv = views.getStudentMetricsView({
							profiles: model.profiles,
							uid: uid,
							tid: tid,
							emotions: emotionList,
							feedback: model.metrics[tid].feedback
						});
						let tdiv = document.querySelector(`[data-teamlink="${tid}"]`);
						tdiv.innerHTML = '';
						tdiv.appendChild(mdiv);
					});
				});
			return div;
		},

		getStudentMetricsView: (model) => {
			let html = `
				<div class="columns">
					<div class="column is-6">
						<h4 class="title">${model.profiles[model.uid].name}</h4>
						<canvas width="400" height="200"></canvas>
						<p>Hover over a data point to read the student's update.</p>
						<button class="button is-primary is-outlined">View Peer Feedback</button>
					</div>
					<div class="column is-6">
						<div class="has-text-left" data-feeling></div>
					</div>
				</div>
			`;
			let div = document.createElement('div');
				div.innerHTML = html;
				let alertHTML = ``;
				//console.log(model.uid, model.feedback);
				//
				let feedbackList = model.feedback[model.uid];
				let profile = model.profiles[model.uid] || {};
				let ts = views.getTeammateJustFeedbackCardFilled({
					name: profile.name || 'No Name',
					feedback: feedbackList
				});
				alertHTML = ts.innerHTML;
				//
				div.querySelector('button').addEventListener('click', (e) => {
					vex.dialog.alert({
						unsafeMessage: alertHTML
					});
				});
				let ctx = div.querySelector('canvas').getContext('2d');
				let emotionTable = {};
				let feelingMap = {};
				model.emotions.forEach((ed) => {
					if (!(ed.timestamp in emotionTable)) {
						emotionTable[ed.timestamp] = {};
					}
					if (!(ed.data.type in emotionTable[ed.timestamp])) {
						emotionTable[ed.timestamp][ed.data.type] = 0;
					}
					emotionTable[ed.timestamp][ed.data.type] += ed.data.level;
					if (!(ed.timestamp in feelingMap)) {
						feelingMap[ed.timestamp] = {
							feelings: 'No student note.',
							emotions: []
						};
					}
					feelingMap[ed.timestamp].feelings = ed.feelings;
					feelingMap[ed.timestamp].progress = ed.progress;
					feelingMap[ed.timestamp].roadblocks = ed.roadblocks;
					feelingMap[ed.timestamp].emotions.push(ed);
				});
				let emotionTableList = Object.keys(emotionTable).map((ts) => {
					let entry = emotionTable[ts];
					entry.timestamp = ts;
					return entry;
				}).sort((a, b) => {
					return a.timestamp - b.timestamp;
				});
				let datasets = [];
				for (let etype in EMOTION_HEADERS) {
					let data = EMOTION_HEADERS[etype];
					datasets.push({
						label: etype,
						borderColor: data.color,
						fill: false,
						data: emotionTableList.map((entry) => {
							return entry[etype] || 0;
						})
					});
				}
				let timestampList = emotionTableList.map(entry => {
					let ts = parseInt(entry.timestamp);
					return ts;
				});
				function getNoteFromIndex(index) {
					let noteHTML = ``;
					try {
						let ts = timestampList[index];
						let f = feelingMap[ts];
						noteHTML += `
							<h5 class="title has-text-centered">Update for ${moment(ts).format('dddd M/D')}</h5>
							<h6 class="title">How are you feeling?</h6>
							<p>`;
						f.emotions.forEach((d) => {
							noteHTML += `<span class="tag" style="background: ${d.data.color};">${d.emotion}</span> `;
						});
						noteHTML += `</p>
							<p>${f.feelings}</p>
							<h6 class="title">Progress</h6>
							<p>${f.progress}</p>
							<h6 class="title">Roadblocks</h6>
							<p>${f.roadblocks}</p>
						`;
					} catch (err) {
						noteHTML = `<p>No student updates found.</p>`;
					}
					return noteHTML;
				}
				let chart = new Chart(ctx, {
					type: 'line',
					data: {
						labels: timestampList.map((ts) => {
							let label = moment(ts).format('M/D');
							return label;
						}),
						datasets: datasets
					},
					options: {
						scales: {
							xAxes: [{
								display: true,
									scaleLabel: {
									display: true,
									labelString: 'Date'
								}
							}],
							yAxes: [{
								display: true,
								scaleLabel: {
									display: true,
									labelString: 'Strength'
								}
							}]
						},
						tooltips: {
							callbacks: {
								label: function(tooltipItem, data) {
									let index = tooltipItem.index;
									let noteHTML = getNoteFromIndex(index);
									div.querySelector('[data-feeling]').innerHTML = noteHTML;
									return tooltipItem.yLabel;
								}
							}
						}
					}
				});
				div.querySelector('[data-feeling]').innerHTML = getNoteFromIndex(0);
			return div;
		},

		getPromiseTable: (model) => {
			let html = `
				<thead>
					<tr>
						<th>Name</th>
						<th>Member</th>
						<th>Status</th>
						<th>Last Active</th>
						<th>View</th>
					</tr>
				</thead>
				<tbody>
			`;

			Object.keys(model.promises).map((pdid) => {
				let val = model.promises[pdid];
					val.key = pdid;
				return val;
			}).sort((a, b) => {
				return 0;
			}).forEach((promise) => {
				let authorName = 'Unknown';
				let lastActive = moment(promise.lastActive).fromNow();
				try {
					authorName = model.profiles[promise.author].name;
				} catch (e) {
					console.error(e);
				}
				let dur = moment.duration(moment(promise.due).diff(moment(Date.now())));
				let daysLeft = Math.floor(dur.asDays());
				html += `
					<tr>
						<td>${promise.title}</td>
						<td>${authorName}</td>
						<td>${promise.completed ? 'Complete' : (daysLeft < 0 ? Math.abs(daysLeft) + ' days overdue' : daysLeft + ' days left')}</td>
						<td>${lastActive}</td>
						<td>
							<button data-promiseid="${promise.key}" class="button is-primary is-outlined">View</button>
						</td>
					</tr>
				`;
			});
			html += `
				</tbody>
			`;
			let table = document.createElement('table');
				table.classList.add('table');
				table.classList.add('is-narrow');
				table.classList.add('is-fullwidth');
				table.classList.add('is-striped');
				table.innerHTML = html;
			return table;
		},

		getPromiseBox: (model) => {
			let promise = model.promise;
			let profiles = model.profiles;
			let levelText = 'Unknown';
			switch (promise.level) {
				case 1: levelText = 'Small'; break;
				case 2: levelText = 'Medium'; break;
				case 3: levelText = 'Large'; break;
			}
			let sinceStart = moment(promise.started).fromNow();
			let dueDate = moment(promise.due).format('M/D/YY');
			let authorName = 'Unknown';
			let authorImage = './public/img/no-user.png';
			try {
				authorName = profiles[promise.author].name;
				authorImage = profiles[promise.author].image;
			} catch (e) {
				console.error(e)
			}
			//<h1 class="title is-2">${promise.title} <span class="tag is-warning">${levelText}</span></h1>
			let html = `
				<div class="column">
				<div class="box content">
					<h1 class="title is-2">${promise.title}</h1>
					<p class="subtitle is-neatly-spaced">
						<div class="comment">
							<span class="image is-16x16 is-rounded is-inline-image">
								<img src="${authorImage}">
							</span>
							<span class="title is-6">${authorName}</span>
							<span class="is-faded"> started ${sinceStart}</span>
						</div>
					</p>
					<p class="subtitle is-normally-spaced">I promise to ${promise.description} by ${dueDate}.</p>
			`;
			let linkList = Object.keys(promise.links).map((key) => {
				let val = promise.links[key];
				val.key = key;
				return val;
			});
			if (linkList.length > 0) {
				html += `<div>`;
				linkList.forEach((link) => {
					html += `<div class="team-link">${views.getLinkItem(link).innerHTML}</div>`;
					//html += `<li><a href="${link.url}" target="_blank">${link.name}</a></li>`;
				});
				html += `</div>`;
			}
			html += `
					<div class="is-grouped">
						<button data-fpb="edit" class="button is-primary is-outlined is-hidden-to-mentor">
							<span class="icon">
								<i class="fa fa-edit"></i>
							</span>
							<span>Edit</span>
						</button>
						<button data-fpb="link" class="button is-primary is-outlined is-hidden-to-mentor">
							<span class="icon">
								<i class="fa fa-link"></i>
							</span>
							<span>Add Link</span>
						</button>
						<button data-fpb="back" class="button is-danger is-outlined">
							<span class="icon">
								<i class="fa fa-arrow-left"></i>
							</span>
							<span>Back to Promises</span>
						</button>
					</div>
				</div>
				</div>
				<div class="column">
				<div class="box content">
					<h1 class="title is-4">Progress</h1>
					<div id="comments-field">
					`;

			Object.keys(promise.comments).map((key) => {
				return promise.comments[key];
			}).sort((a, b) => {
				return a.timestamp - b.timestamp;
			}).forEach((comment) => {
				let commentAuthor = {
					name: 'Unknown',
					image: './public/img/no-user.png'
				}
				try {
					commentAuthor.name = profiles[comment.author].name;
					commentAuthor.image = profiles[comment.author].image;
				} catch (e) {
					console.error(e)
				}
				let sinceComment = moment(comment.timestamp).format('M/D h:mm A');//.fromNow();
				if (comment.generated) {
					html += `
						<div class="comment">
							<span class="image is-16x16 is-rounded is-inline-image">
								<img src="${commentAuthor.image}">
							</span>
							<span class="title is-6">${commentAuthor.name}</span>
							<span class="is-faded"> ${sinceComment}: </span>
							<span class="generated-text">${comment.text}</span>
						</div>
					`;
				} else {
					html += `
						<div class="comment">
							<span class="image is-16x16 is-rounded is-inline-image">
								<img src="${commentAuthor.image}">
							</span>
							<span class="title is-6">${commentAuthor.name}</span>
							<span class="is-faded"> ${sinceComment}: </span>
							<span>${comment.text}</span>
						</div>
					`;
				}
			});

			html += `
					</div>
					<div class="is-hidden-to-mentor">
						<div class="tile is-child">
							<div class="tile-editable">
								<textarea data-fpb="textarea" class="textarea" rows="2" placeholder="Write here..."></textarea>
							</div>
							<div class="is-grouped">
								<button data-fpb="comment" class="button is-primary">
									<span class="icon">
										<i class="fa fa-comment-o"></i>
									</span>
									<span>Comment</span>
								</button>
								<button data-fpb="complete" class="button is-primary is-outlined">
									<span class="icon">
										<i class="fa ${promise.completed ? 'fa-times' : 'fa-check'}"></i>
									</span>
									<span>${promise.completed ? 'Mark as Incomplete' : 'Mark as Complete'}</span>
								</button>
							</div>
						</div>
					</div>
				</div>
				</div>
			`;
			let box = document.createElement('div');
				box.classList.add('columns');
				box.innerHTML = html;
			return box;
		},

		getPromiseEditor: (model) => {
			if (model.description === '...') {
				model.description = false;
			}
			let html = `
				<h1 data-pef="title" class="title is-2 nlp-editable" contenteditable="true">${model.title ? model.title : 'Title of Promise'}</h1>
				<p class="subtitle is-neatly-spaced">
					I promise to <span data-pef="description" class="nlp-editable" contenteditable="true">${model.description ? model.description : '(do something for my team)'}</span> by <span data-pef="due" class="nlp-editable" contenteditable="true">${model.due ? moment(model.due).format('M/D/YYYY') :'MM/DD/YYYY'}</span>.
				</p>
				<p data-pef="warning" class="is-danger-text"></p>
				<button data-pef="submit" class="button is-primary">Save Promise</button>
			`;
			if (model.deletable) {
				html += `<button data-pef="remove" class="button is-danger is-outlined">Cancel</button>`;
			} else {
				html += `<button data-pef="cancel" class="button is-danger is-outlined">Cancel</button>`;
			}
			let div = document.createElement('div');
				div.classList.add('box');
				div.classList.add('content');
				div.innerHTML = html;
			return div;
		},

		getRoleStepCard: (model) => {
			let isCompleted = false;
			if (model.learned.length > 0) {
				isCompleted = true;
			}
			let html = `
				<div data-step="${model.id}" class="message ${model.isOpen ? `` : `is-collapsed`} ${isCompleted ? `is-success` : `is-primary`}" collapsible>
					<div class="message-header is-contrast">
						<div class="circle">
							<span class="icon is-small">
								<i class="fa fa-check"></i>
							</span>
						</div>
						<h3 class="title is-5">${model.title}</h3>
						<button>
							<span class="icon is-small">
								<i class="fa show-collapsed fa-chevron-up"></i>
								<i class="fa show-unfurled fa-chevron-down"></i>
							</span>
						</button>
					</div>
					<div class="message-body">
						<div class="step-note" data-step="${model.id}" contenteditable="${model.editable}">
							${model.ps.reduce((agg, val) => {
								return agg + `<p>${val}</p>`;
							}, '')}
						</div>
			`;
			if (model.editable) {
				html += `
					<span data-action="save-note" data-step="${model.id}" class="button is-small is-dark is-outlined has-top-margin">
						<span class="icon is-small">
							<i class="fa fa-save"></i>
						</span>
						<span>Save Note</span>
					</span>
					<span data-action="edit-name" data-step="${model.id}" class="button is-small is-dark is-outlined has-top-margin">
						<span class="icon is-small">
							<i class="fa fa-edit"></i>
						</span>
						<span>Edit Name</span>
					</span>
					<span data-action="move-step-up" data-step="${model.id}" class="button is-small is-primary is-outlined has-top-margin">
						<span class="icon is-small">
							<i class="fa fa-arrow-up"></i>
						</span>
						<span>Move Up</span>
					</span>
					<span data-action="move-step-down" data-step="${model.id}" class="button is-small is-primary is-outlined has-top-margin">
						<span class="icon is-small">
							<i class="fa fa-arrow-down"></i>
						</span>
						<span>Move Down</span>
					</span>
					<hr>
				`;
			}
			html += `
						<div class="has-top-margin">
							${model.links.reduce((agg, val) => {
								let linkHtml = `
									<div class="tags has-addons">
								`;
								if (model.editable) {
									linkHtml += `
										<span class="tag is-medium is-transparent-background">
											<span data-action="edit-link" data-step="${model.id}" data-link="${val.id}" class="icon is-small">
												<i class="fa fa-edit"></i>
											</span>
											<span data-action="remove-link" data-step="${model.id}" data-link="${val.id}" class="icon is-small">
												<i class="fa fa-remove"></i>
											</span>
										</span>
									`;
								}	
								linkHtml += `
										<span class="tag is-medium is-primary">${val.type}</span>
										<span class="tag is-medium is-warning">
											<a class="link" data-linkid="${val.id}" data-step="${model.id}" target="_blank" href="${val.url}">${val.title}</a>
										</span>
									</div>
								`;
								return agg + linkHtml
							}, '')}
						</div>
			`;
			if (isCompleted) {
				html += `
					<div class="has-top-margin">
						<h5 class="title is-5">Lessons Learned</h5>
						<ul>
						${model.learned.reduce((agg, val) => {
							let div = `
								<li><span class="tag">${moment(val.timestamp).format(`M/D h:mm A`)}</span> ${val.learned}</li>
							`;
							return `${agg}${div}`;
						}, ``)}
						</ul>
					</div>
					<button class="button is-primary is-outlined has-top-margin ${model.editable ? 'is-hidden' : ''}">Add Another Note</button>
				`;
			} else {
				html += `
					<button class="button is-primary is-outlined has-top-margin ${model.editable ? 'is-hidden' : ''}">Mark Complete</button>
				`;
			}
			if (model.editable) {
				html += `
					<span data-action="add-step-link" data-step="${model.id}" class="button is-small is-dark is-outlined has-top-margin">
						<span class="icon is-small">
							<i class="fa fa-plus"></i>
						</span>
						<span>Add Link</span>
					</span>
				`;
			}
			html += `
					</div>
				</div>
			`;
			let div = document.createElement('div');
				div.innerHTML = html;
				div.classList.add('circle-connector');
			return div;
		},

		tagCode: (text) => {
			let out = ``;
			let open = false;
			for (let c = 0; c < text.length; c++) {
				if (text[c] === '`') {
					if (!open) {
						out += `<span class="tag is-code">`;
					} else {
						out += `</span>`;
					}
					open = !open;
				} else {
					out += text[c];
				}
			}
			if (open) {
				out += `</span>`;
			}
			return out;
		},

		getListCard: (model) => {
			let html = `
				<h2 class="title is-4">${model.title}</h2>
				<ul data-textarea="get-${model.field}" contenteditable="${model.editable}">
					${model.ps.reduce((agg, val) => {
						let text = val;
						if (model.hasCode && (!model.editable)) {
							text = views.tagCode(val);
						}
						return agg + `<li>${text}</li>`;
					}, '')}
				</ul>
			`;
			if (model.editable) {
				html += `
					<button data-action="save-${model.field}" class="button is-small is-primary is-outlined has-top-margin">
						<span class="icon is-small">
							<i class="fa fa-save"></i>
						</span>
						<span>Save</span>
					</button>
				`;
			}
			let div = document.createElement('div');
				div.innerHTML = html;
				div.classList.add('column');
				div.classList.add('is-6');
			return div;
		},

		getRoleMapCard: (model) => {
			let origin = window.location.origin;
			let link = `${origin}/rolelibrary.html?role=${model.id}`;
			let html = `
				<div class="box">
					<h3 class="title is-4">
						<span class="icon">
							<i class="fa fa-${model.icon}"></i>
						</span>
						<span>${model.title}</span>
					</h3>
					<ul>
						${model.importance.split('\n').reduce((agg, val) => {
							return `${agg}<li>${val}</li>`;
						})}
					</ul>
					<a href="${link}" class="button is-primary is-outlined has-top-margin">Preview Role</a>
				</div>
			`;
			let div = document.createElement('div');
				div.innerHTML = html;
				div.classList.add('column');
				div.classList.add('is-3');
			return div;
		},

		getTeammateFeedbackCard: (model) => {
			let html = `
				<div class="media-left">
					<figure class="image is-64x64">
						<img src="${model.image}" alt="${model.name}">
					</figure>
				</div>
				<div class="media-content">
					<div class="content">
						<textarea class="textarea textarea-teammate" data-uid=${model.uid} placeholder="Feedback for ${model.name}..."></textarea>
					</div>
				</div>
			`;
			let div = document.createElement('div');
				div.innerHTML = html;
				div.classList.add('media');
			return div;
		},

		getTeammateFeedbackCardFilled: (model) => {
			let tsFormat = 'dddd M/D h:mm A';
			let html = `
				<div class="media-left">
					<figure class="image is-64x64">
						<img src="${model.image}" alt="${model.name}">
					</figure>
				</div>
				<div class="media-content">
					<div class="content">
					<h4 class="title">${model.name}</h4>
					<p class="subtitle is-6"><span class="is-bold">Role:</span> ${model.member.role}, ${model.member.responsibility}</p>
			`;
			if (model.feedback) {
				model.feedback.sort((a, b) => {
						return b.timestamp - a.timestamp;
					}).forEach((p) => {
					html += `
						<p><span class="tag">${moment(p.timestamp).format(tsFormat)}</span> ${p.feedback}</p>
					`;
				});
			}
			html += `
					</div>
				</div>
			`;
			let div = document.createElement('div');
				div.innerHTML = html;
				div.classList.add('media');
			return div;
		},

		getTeammateJustFeedbackCardFilled: (model) => {
			let tsFormat = 'dddd M/D h:mm A';
			let html = `
				<div class="content">
					<h4 class="title">Feedback for ${model.name}</h4>
			`;
			if (model.feedback) {
				model.feedback.sort((a, b) => {
						return b.timestamp - a.timestamp;
					}).forEach((p) => {
					html += `
						<p><span class="tag">${moment(p.timestamp).format(tsFormat)}</span></p><p>${p.feedback}</p>
					`;
				});
			}
			html += `
					</div>
				</div>
			`;
			let div = document.createElement('div');
				div.innerHTML = html;
				div.classList.add('media');
			return div;
		},

		getTeamProgressSection: (model) => {
			console.log(model.team)
			let tsFormat = 'dddd M/D h:mm A';
			let html = `
				<div class="content">
					<h2 class="title">${model.name}</h2>
					<h3 class="title">This Team is Feeling</h3>
					<div>
			`;
					Object.keys(model.emotions).map((e) => {
						return {
							emotion: e,
							count: model.emotions[e].count,
							data: model.emotions[e].data
						}
					}).sort((a, b) => {
						return b.count - a.count;
					}).forEach((d) => {
						html += `
							<span class="tag" style="background: ${d.data.color};">${d.emotion} (x${d.count})</span>
						`;
					});
			html += `
					</div>
					<hr>
			`;
					model.feelings.sort((a, b) => {
						return b.timestamp - a.timestamp;
					}).forEach((p) => {
						let h = `
							<p><span class="tag">${moment(p.timestamp).format(tsFormat)}</span> ${p.note}</p>
						`;
						html += h;
					});
			html += `
					<h3 class="title">Progress Updates</h3>
			`;
					if (model.progress.length > 0) {
						model.progress.sort((a, b) => {
							return b.timestamp - a.timestamp;
						}).forEach((p) => {
							let h = `
								<p><span class="tag">${moment(p.timestamp).format(tsFormat)}</span> ${p.note}</p>
							`;
							html += h;
						});
					} else {
						html += `<p>No roadblocks yet.</p>`
					}
			html += `
					<h3 class="title">Roadblocks</h3>
			`;
					if (model.roadblocks.length > 0) {
						model.roadblocks.sort((a, b) => {
							return b.timestamp - a.timestamp;
						}).forEach((p) => {
							let h = `
								<p><span class="tag">${moment(p.timestamp).format(tsFormat)}</span> ${p.note}</p>
							`;
							html += h;
						});
					} else {
						html += `<p>No roadblocks yet.</p>`
					}
			html += `
					<h3 class="title">Peer Feedback</h3>
			`;
					let list = Object.keys(model.feedback).map((key) => {
						return {
							uid: key,
							feedback: model.feedback[key]
						}
					});
					if (list.length > 0) {
						list.forEach((d) => {
							let profile = model.profiles[d.uid] || {};
							let ts = views.getTeammateFeedbackCardFilled({
								name: profile.name || 'No Name',
								image: profile.image || './public/img/no-user.png',
								member: model.team.members[d.uid] || {},
								feedback: d.feedback
							});
							html += `
								<div class="media">
									${ts.innerHTML}
								</div>
							`;
						});
					} else {
						html += `
							<div class="media">No peer feedback yet.</div>
						`;
					}
			html += `
				</div>
			`;
			let div = document.createElement('div');
				div.innerHTML = html;
			return div;
		}

	}

	return views;

}

export {Views};
