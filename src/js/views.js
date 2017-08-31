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
				let sinceStart = moment(promise.started).fromNow();
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
						<td>${promise.completed ? 'Complete' : daysLeft + ' days left'}</td>
						<td>${sinceStart}</td>
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
		}

	}

	return views;

}

export {Views};
