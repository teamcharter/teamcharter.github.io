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
			} else if (model.url.indexOf('omnipointment.com/meeting') > -1) {
				icon = 'calendar';
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
			let html = `
				<div class="tile is-vertical">
					<div class="box">
						<div class="tile">
							<div class="content">
								<h3 class="title">${model.name}</h3>
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
			let link = `${origin}/class.html?team=${model.cid}`;
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
							<div class="columns is-multiline">
								${items.join('')}
							</ul>
						</div>
					</div>
				</div>`;
				//<a href="${link}" class="button is-primary is-outlined">View Class Progress</a>
			let div = document.createElement('div');
				div.classList.add('column');
				div.classList.add('is-12');
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
				let link = `${origin}/charter.html?team=${team.tid}&mentor=true`;
				html += `
					<tr>
						<td>${team.name}</td>
						<td>${Object.keys(team.members).length}</td>
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
		}

	}

	return views;

}

export {Views};