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
					<button id="my-role-save" class="button is-primary is-outlined">
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
				<a class="is-danger">
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
				<div class="tile is-parent">
					<div class="tile box is-child">
						<div class="content">
							<h3 class="title">${model.name}</h3>
						</div>
						<a href="${link}" class="button is-primary is-outlined">View Team Charter</a>
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
			let n = Object.keys(model.teams).length;
			let html = `
				<div class="tile is-parent">
					<div class="tile box is-child">
						<div class="content">
							<h3 class="title">${model.name}</h3>
							<p class="subtitle">${n} team${n === 1 ? '' : 's'}</p>
						</div>
						<a href="${link}" class="button is-primary is-outlined">View Class Progress</a>
					</div>
				</div>`;
			let div = document.createElement('div');
				div.classList.add('column');
				div.classList.add('is-4');
				div.innerHTML = html;
			return div;
		}

	}

	return views;

}

export {Views};