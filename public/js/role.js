!function t(e,n,s){function i(o,l){if(!n[o]){if(!e[o]){var r="function"==typeof require&&require;if(!l&&r)return r(o,!0);if(a)return a(o,!0);var c=new Error("Cannot find module '"+o+"'");throw c.code="MODULE_NOT_FOUND",c}var d=n[o]={exports:{}};e[o][0].call(d.exports,function(t){var n=e[o][1][t];return i(n||t)},d,d.exports,t,e,n,s)}return n[o].exports}for(var a="function"==typeof require&&require,o=0;o<s.length;o++)i(s[o]);return i}({1:[function(t,e,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var s={apiKey:"AIzaSyBWk9EWPkkvqiruG8aYnHV0dBPg1z3EtN4",authDomain:"charter-ecb07.firebaseapp.com",databaseURL:"https://charter-ecb07.firebaseio.com",projectId:"charter-ecb07",storageBucket:"",messagingSenderId:"134239305153"};n.config=s},{}],2:[function(t,e,n){"use strict";t("./config");var s=t("./views"),i=(function(t){t=t.split("+").join(" ");for(var e,n={},s=/[?&]?([^=]+)=([^&]*)/g;e=s.exec(t);)n[decodeURIComponent(e[1])]=decodeURIComponent(e[2])}(document.location.search),(0,s.Views)());!function(t){var e=[{title:"Introduction to HTML",ps:["As a frontend engineer, you will use HTML to design layouts and pages for your team's web application. You don't have to memorize HTML tags: specifics can always be found online! The rest of your team is just getting started, so focus on learning HTML tags that are used for structure and content. Later, elements like forms will come into play.","<p>To learn how to give your pages structure, check out these 10 basic HTML tags."],links:[{title:"99Lime: You Only Need 10 HTML Tags",url:"http://www.99lime.com/_bak/topics/you-only-need-10-tags/",type:"Tutorial"}]},{title:"Introduction to CSS",ps:["To style your web application, you will use CSS. Don't worry about making the web application look beautiful right away. There will be plenty of time over the course of this project to experiment with styles. Again, no need to memorize: the W3Schools CSS reference is a place you can always look to for help.","To learn how to give your pages style, explore the W3Schools CSS reference. At least read up to and including the section about the Box Model."],links:[{title:"W3Schools: CSS Reference",url:"https://www.w3schools.com/css/css_intro.asp",type:"Reference"}]},{title:"DOM: The Document Object Model",ps:["With HTML, you can create layouts, with CSS you can style them. JavaScript will allow you to interact with your pages. To help out your team's application engineer, you will need to get information from page forms and display new content that the application code gives you. The Document Object Model (DOM) makes this easy.","To make your pages more than just fixed content, learn about the DOM."],links:[{title:"Mozilla: Introduction to the DOM",url:"https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction",type:"Tutorial"}]},{title:"JavaScript: Event Listeners",ps:["The application engineer on your team will want user actions like clicks and hovers to trigger certain parts of their code. Event listeners are the way your frontend work hooks up with the application layer! If you do no other JavaScript in this project, make sure you master event listeners.","To integrate better with your application code, learn the basics of event listeners."],links:[{title:"W3Schools: Event Listeners",url:"https://www.w3schools.com/js/js_htmldom_eventlistener.asp",type:"Tutorial"},{title:"Mozilla: Events Reference",url:"https://developer.mozilla.org/en-US/docs/Web/Events",type:"Reference"}]},{title:"CSS Framework: W3.CSS",ps:["As a frontend engineer, you are not expected to write all of the styling for your web app from scratch. Many professional teams use a CSS framework, which provides reusable classes for formatting the layout of a page.","To save development time, learn W3.CSS: a simple CSS framework for responsive websites. If you are curious, you can check out other CSS frameworks like Bootstrap, Bulma, or Semantic UI."],links:[{title:"W3Schools: Introduction to the W3.CSS framework",url:"https://www.w3schools.com/w3css/default.asp",type:"Tutorial"}]},{title:"Debugging HTML",ps:["Sometimes your pages will display content in an unexpected way, or you'll be stuck trying to get an element styled just right. These situations happen to even the best frontend engineers. Every engineer on this team must learn how to overcome tricky bugs: frontend engineer is no different!","To deal with pages that don't seem to be working correctly, learn how to debug HTML."],links:[{title:"Mozilla: How to debug HTML",url:"https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML/Debugging_HTML",type:"Tutorial"}]}],n=document.getElementById("card-out");e.map(function(t){return i.getRoleStepCard(t)}).forEach(function(t){n.appendChild(t)}),Array.from(document.querySelectorAll("[collapsible]")).forEach(function(t){t.querySelector(".message-header").addEventListener("click",function(e){t.classList.contains("is-collapsed")?t.classList.remove("is-collapsed"):t.classList.add("is-collapsed")}),t.querySelector(".message-body button").addEventListener("click",function(e){vex.dialog.prompt({message:"What did you learn?",callback:function(e){e&&t.classList.contains("is-primary")&&(t.classList.remove("is-primary"),t.classList.add("is-success"))}})})})}()},{"./config":1,"./views":3}],3:[function(t,e,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});n.Views=function(){var t={getRoleAndUpdateTile:function(t){var e=new Date(t.timestamp),n=moment(e).format("M/D h:mm A"),s=moment(Date.now()).diff(moment(t.timestamp)),i=moment.duration(s).asDays(),a="is-success";i>=5?a="is-danger":i>=3&&(a="is-warning");var o='\n\t\t\t\t<div class="tile is-parent is-vertical is-5">\n\t\t\t\t\t<div class="tile is-child">\n\t\t\t\t\t\t<div class="media">\n\t\t\t\t\t\t\t<figure class="media-left">\n\t\t\t\t\t\t\t\t<p class="image is-48x48">\n\t\t\t\t\t\t\t\t\t<img src="'+t.image+'">\n\t\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t</figure>\n\t\t\t\t\t\t\t<div class="media-content content">\n\t\t\t\t\t\t\t\t<h3 class="title is-5">'+t.name+'</h3>\n\t\t\t\t\t\t\t\t<p class="subtitle is-6">'+t.role+'</p>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class="tile is-parent is-vertical is-7">\n\t\t\t\t\t<div class="tile is-child">\n\t\t\t\t\t\t<div class="content">\n\t\t\t\t\t\t\t<span class="tag '+a+'">'+n+"</span> "+t.update+"\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>",l=document.createElement("div");return l.classList.add("tile"),l.innerHTML=o,l},getRoleTile:function(t){var e='<div class="content">\n\t\t\t\t<h3 class="title is-5">'+t.role+'</h3>\n\t\t\t\t<p class="subtitle is-6">'+t.responsibility+"</p>\n\t\t\t</div>";t.editable&&(e='<div class="content">\n\t\t\t\t\t<h3 id="my-title" class="title is-5" contenteditable="true">'+t.role+'</h3>\n\t\t\t\t\t<p id="my-responsibility" class="subtitle is-6" contenteditable="true">'+t.responsibility+'</p>\n\t\t\t\t\t<button id="my-role-save" class="button is-primary is-outlined is-hidden-to-mentor">\n\t\t\t\t\t\t<span class="icon">\n\t\t\t\t\t\t\t<i class="fa fa-edit"></i>\n\t\t\t\t\t\t</span>\n\t\t\t\t\t\t<span>Save Role</span>\n\t\t\t\t\t</button>\n\t\t\t\t</div>');var n='\n\t\t\t\t<div class="tile is-parent is-vertical is-5">\n\t\t\t\t\t<div class="tile is-child">\n\t\t\t\t\t\t<div class="media">\n\t\t\t\t\t\t\t<figure class="media-left">\n\t\t\t\t\t\t\t\t<p class="image is-48x48">\n\t\t\t\t\t\t\t\t\t<img src="'+t.image+'">\n\t\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t</figure>\n\t\t\t\t\t\t\t<div class="content">\n\t\t\t\t\t\t\t\t<h3 class="title is-5">'+t.name+'</h3>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class="tile is-parent is-vertical is-7">\n\t\t\t\t\t<div class="tile is-child">\n\t\t\t\t\t\t'+e+"\n\t\t\t\t\t</div>\n\t\t\t\t</div>",s=document.createElement("div");return s.classList.add("tile"),s.innerHTML=n,s},getRoleTemplateTile:function(t){var e='<div class="content">\n\t\t\t\t<h3 class="title is-5">'+t.role+'</h3>\n\t\t\t\t<p class="subtitle is-6">'+t.responsibility+"</p>\n\t\t\t</div>",n="";t.editable&&(e='<div class="content">\n\t\t\t\t\t<h3 data-bind="field-role" class="title is-5" contenteditable="true">'+t.role+'</h3>\n\t\t\t\t\t<p data-bind="field-responsibility" class="subtitle is-6" contenteditable="true">'+t.responsibility+"</p>\n\t\t\t\t</div>",n='\n\t\t\t\t<div class="tile is-parent is-vertical is-4">\n\t\t\t\t\t<button data-bind="button-save" class="button is-primary is-outlined is-hidden-to-mentor">\n\t\t\t\t\t\t<span class="icon">\n\t\t\t\t\t\t\t<i class="fa fa-edit"></i>\n\t\t\t\t\t\t</span>\n\t\t\t\t\t\t<span>Save Role</span>\n\t\t\t\t\t</button>\n\t\t\t\t</div>\n\t\t\t\t');var s='\n\t\t\t\t<div class="tile is-parent is-vertical {model.editable ? \'is-8\' : \'is-12\'}">\n\t\t\t\t\t<div class="tile is-child">\n\t\t\t\t\t\t<div class="media">\n\t\t\t\t\t\t\t<figure class="media-left">\n\t\t\t\t\t\t\t\t<div data-bind="field-icon" class="image is-48x48 icon-image">\n\t\t\t\t\t\t\t\t\t<i class="fa fa-'+(t.icon||"user")+'"></i>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</figure>\n\t\t\t\t\t\t\t<div class="tile is-child">\n\t\t\t\t\t\t\t\t'+e+"\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t"+n+"\n\t\t\t",i=document.createElement("div");if(i.classList.add("tile"),i.innerHTML=s,t.editable&&t.onSave){var a=i.querySelectorAll("[data-bind=button-save]")[0],o=i.querySelectorAll("[data-bind=field-role]")[0],l=i.querySelectorAll("[data-bind=field-responsibility]")[0];a.addEventListener("click",function(e){t.onSave({e:e,model:t,role:o.innerText,responsibility:l.innerText})}),i.querySelectorAll("[data-bind=field-icon]")[0].addEventListener("click",function(e){t.onIconEdit({e:e,model:t})})}return i},getProgressUpdate:function(t){var e=new Date(t.timestamp),n=moment(e).format("M/D h:mm A"),s=moment(Date.now()).diff(moment(t.timestamp)),i=moment.duration(s).asDays(),a="is-success";i>=5?a="is-danger":i>=3&&(a="is-warning");var o='\n\t\t\t\t<div class="tile is-parent is-vertical is-5">\n\t\t\t\t\t<div class="tile is-child">\n\t\t\t\t\t\t<span class="tags has-addons">\n\t\t\t\t\t\t\t<span class="tag '+a+' is-medium">'+n+'</span>\n\t\t\t\t\t\t\t<span class="tag is-medium">\n\t\t\t\t\t\t\t\t<span class="image image-tag-rounded is-32x32">\n\t\t\t\t\t\t\t\t\t<img src="'+t.image+'">\n\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t<span class="is-medium">\n\t\t\t\t\t\t\t\t\t'+t.name+'\n\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t</span>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class="tile is-parent is-vertical is-7">\n\t\t\t\t\t<div class="tile is-child">\n\t\t\t\t\t\t<div class="content">\n\t\t\t\t\t\t\t'+t.update+"\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>",l=document.createElement("div");return l.classList.add("tile"),l.innerHTML=o,l},getLinkItem:function(t){var e="file";t.url.indexOf("docs.google")>-1?(e="google",t.url.indexOf("docs.google.com/document")>-1?e="file-text":t.url.indexOf("docs.google.com/spreadsheets")>-1?e="table":t.url.indexOf("docs.google.com/presentation")>-1&&(e="slideshare")):t.url.indexOf("omnipointment.com/meeting")>-1?e="calendar":t.url.indexOf("github.com")>-1?e="github":t.url.indexOf("youtube.com")>-1?e="youtube-play":t.url.indexOf("vimeo.com")>-1?e="vimeo":(t.url.indexOf("codeshare.io")>-1||t.url.indexOf("codepen.io")>-1)&&(e="code-fork");var n='\n\t\t\t\t<a target="_blank" href="'+t.url+'">\n\t\t\t\t\t<span class="icon">\n\t\t\t\t\t\t<i class="fa fa-'+e+'"></i>\n\t\t\t\t\t</span>\n\t\t\t\t\t<span>'+t.name+'</span>\n\t\t\t\t</a>\n\t\t\t\t<a class="is-danger is-hidden-to-mentor">\n\t\t\t\t\t<span class="icon edit-link" data-for="'+t.key+'">\n\t\t\t\t\t\t<i class="fa fa-edit"></i>\n\t\t\t\t\t</span>\n\t\t\t\t</a>\n\t\t\t',s=document.createElement("div");return s.classList.add("team-link"),s.innerHTML=n,s},getTeamTile:function(t){var e=window.location.origin+"/charter.html?team="+t.tid,n='\n\t\t\t\t<div class="tile is-vertical">\n\t\t\t\t\t<div class="box">\n\t\t\t\t\t\t<div class="tile">\n\t\t\t\t\t\t\t<div class="content">\n\t\t\t\t\t\t\t\t<h3 class="title">'+t.name+" "+(t.isTemplate?'<span class="tag is-warning">Template</span>':"")+'</h3>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="tile">\n\t\t\t\t\t\t\t<a href="'+e+'" class="button is-primary is-outlined">View Team Charter</a>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>',s=document.createElement("div");return s.classList.add("column"),s.classList.add("is-4"),s.innerHTML=n,s},getClassTile:function(t){var e=window.location.origin,n=e+"/class.html?class="+t.cid,s=Object.keys(t.teams).filter(function(e){return Object.keys(t.teams[e]).length>0}).map(function(e){var n=t.teams[e];return n.tid=e,n}),i=s.length,a=(s.map(function(t){return'\n\t\t\t\t\t<div class="column is-4">\n\t\t\t\t\t\t<a href='+e+"/charter.html?team="+t.tid+'&mentor=true class="button is-primary is-outlined is-fullwidth">'+t.name+"</a>\n\t\t\t\t\t</div>\n\t\t\t\t"}),'\n\t\t\t\t<div class="tile is-vertical">\n\t\t\t\t\t<div class="tile box is-child">\n\t\t\t\t\t\t<div class="content">\n\t\t\t\t\t\t\t<h3 class="title">'+t.name+'</h3>\n\t\t\t\t\t\t\t<p class="subtitle">'+i+" team"+(1===i?"":"s")+" | Code: "+t.cid+'</p>\n\t\t\t\t\t\t\t<a href="'+n+'" class="button is-primary is-outlined">View Class Dashboard</a>\n\t\t\t');a+="\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>";var o=document.createElement("div");return o.classList.add("column"),o.classList.add("is-4"),o.innerHTML=a,o},getUserTile:function(t){var e='\n\t\t\t\t<div class="tile is-child">\n\t\t\t\t\t<div class="media">\n\t\t\t\t\t\t<figure class="media-left">\n\t\t\t\t\t\t\t<p class="image is-48x48 image-tag-rounded">\n\t\t\t\t\t\t\t\t<img src="'+t.image+'">\n\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t</figure>\n\t\t\t\t\t\t<div class="content">\n\t\t\t\t\t\t\t<h3 class="title is-5">'+t.name+'</h3>\n\t\t\t\t\t\t\t<p class="subtitle is-6">'+t.subtitle+"</p>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t",n=document.createElement("div");return n.classList.add("column"),n.classList.add("is-4"),n.innerHTML=e,n},getClassTeamTable:function(t){var e="\n\t\t\t\t<thead>\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th>Team Name</th>\n\t\t\t\t\t\t<th>Members</th>\n\t\t\t\t\t\t<th>Charter Edits</th>\n\t\t\t\t\t\t<th>Progress Updates</th>\n\t\t\t\t\t\t<th>Last Active</th>\n\t\t\t\t\t\t<th>View Team</th>\n\t\t\t\t\t</tr>\n\t\t\t\t</thead>\n\t\t\t\t<tbody>\n\t\t\t";t.teams.forEach(function(t){var n=0;for(var s in t.updates)for(var i in t.updates[s])n++;var a=window.location.origin+"/charter.html?team="+t.tid+"&mentor=true",o=t.members||{};e+="\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<td>"+t.name+"</td>\n\t\t\t\t\t\t<td>"+Object.keys(o).length+"</td>\n\t\t\t\t\t\t<td>"+Object.keys(t.edits).length+"</td>\n\t\t\t\t\t\t<td>"+n+"</td>\n\t\t\t\t\t\t<td>"+moment(t.lastAccess).fromNow()+'</td>\n\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t<a href="'+a+'" class="button is-primary is-outlined">View Charter</a>\n\t\t\t\t\t\t</td>\n\t\t\t\t\t</tr>\n\t\t\t\t'}),e+="\n\t\t\t\t</tbody>\n\t\t\t";var n=document.createElement("table");return n.classList.add("table"),n.classList.add("is-narrow"),n.classList.add("is-fullwidth"),n.innerHTML=e,n},getClassTeamGrid:function(e){var n="";e.teams.forEach(function(s){for(var i in s.updates)for(var a in s.updates[i]);var o=window.location.origin+"/charter.html?team="+s.tid+"&code="+s.joinCode;s.members,n+='\n\t\t\t\t\t<div class="column is-6">\n\t\t\t\t\t\t<div class="box content has-text-centered">\n\t\t\t\t\t\t\t<h2 class="title is-4">'+s.name+'</h2 class="title is-4">\n\t\t\t\t\t\t\t<p class="subtitle is-neatly-spaced">Last active '+moment(s.lastAccess).fromNow()+'</p>\n\t\t\t\t\t\t\t<p class="subtitle is-neatly-spaced">'+Object.keys(s.edits).length+" charter edits</p>\n\t\t\t\t";for(var l in s.members){var r=e.profiles[l],c={name:"Unknown Student",image:"./public/img/no-user.png",subtitle:"..."};r.name&&(c.name=r.name),r.image&&(c.image=r.image),s.members[l].role&&(c.subtitle=s.members[l].role);var d=t.getUserTile(c);n+=d.innerHTML}n+='\n\t\t\t\t\t\t\t<div class="is-grouped has-text-centered">\n\t\t\t\t\t\t\t\t<a href="'+o+'" class="button is-primary is-outlined">Join Team</a>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t'}),n+='\n\t\t\t\t\t<div class="column is-6">\n\t\t\t\t\t\t<div class="box content has-text-centered">\n\t\t\t\t\t\t\t<h2 class="title is-4">Start New Team</h2 class="title is-4">\n\t\t\t\t\t\t\t<p class="subtitle is-neatly-spaced">Don\'t see your team?</p>\n\t\t\t';var s=e.profiles[e.uid],i={name:"Unknown Student",image:"./public/img/no-user.png",subtitle:"Team Member"};s.name&&(i.name=s.name),s.image&&(i.image=s.image);var a=t.getUserTile(i);n+=a.innerHTML,n+='\t\t\t\t\n\t\t\t\t\t\t\t<div class="is-grouped has-text-centered">\n\t\t\t\t\t\t\t\t<a id="new-team" class="button is-primary is-outlined">Start New Team</a>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t';var o=document.createElement("div");return o.classList.add("columns"),o.classList.add("is-multiline"),o.innerHTML=n,o},getPromiseTable:function(t){var e="\n\t\t\t\t<thead>\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th>Name</th>\n\t\t\t\t\t\t<th>Member</th>\n\t\t\t\t\t\t<th>Status</th>\n\t\t\t\t\t\t<th>Last Active</th>\n\t\t\t\t\t\t<th>View</th>\n\t\t\t\t\t</tr>\n\t\t\t\t</thead>\n\t\t\t\t<tbody>\n\t\t\t";Object.keys(t.promises).map(function(e){var n=t.promises[e];return n.key=e,n}).sort(function(t,e){return 0}).forEach(function(n){var s="Unknown",i=moment(n.lastActive).fromNow();try{s=t.profiles[n.author].name}catch(t){console.error(t)}var a=moment.duration(moment(n.due).diff(moment(Date.now()))),o=Math.floor(a.asDays());e+="\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<td>"+n.title+"</td>\n\t\t\t\t\t\t<td>"+s+"</td>\n\t\t\t\t\t\t<td>"+(n.completed?"Complete":o<0?Math.abs(o)+" days overdue":o+" days left")+"</td>\n\t\t\t\t\t\t<td>"+i+'</td>\n\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t<button data-promiseid="'+n.key+'" class="button is-primary is-outlined">View</button>\n\t\t\t\t\t\t</td>\n\t\t\t\t\t</tr>\n\t\t\t\t'}),e+="\n\t\t\t\t</tbody>\n\t\t\t";var n=document.createElement("table");return n.classList.add("table"),n.classList.add("is-narrow"),n.classList.add("is-fullwidth"),n.classList.add("is-striped"),n.innerHTML=e,n},getPromiseBox:function(e){var n=e.promise,s=e.profiles;n.level;var i=moment(n.started).fromNow(),a=moment(n.due).format("M/D/YY"),o="Unknown",l="./public/img/no-user.png";try{o=s[n.author].name,l=s[n.author].image}catch(t){console.error(t)}var r='\n\t\t\t\t<div class="column">\n\t\t\t\t<div class="box content">\n\t\t\t\t\t<h1 class="title is-2">'+n.title+'</h1>\n\t\t\t\t\t<p class="subtitle is-neatly-spaced">\n\t\t\t\t\t\t<div class="comment">\n\t\t\t\t\t\t\t<span class="image is-16x16 is-rounded is-inline-image">\n\t\t\t\t\t\t\t\t<img src="'+l+'">\n\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t<span class="title is-6">'+o+'</span>\n\t\t\t\t\t\t\t<span class="is-faded"> started '+i+'</span>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</p>\n\t\t\t\t\t<p class="subtitle is-normally-spaced">I promise to '+n.description+" by "+a+".</p>\n\t\t\t",c=Object.keys(n.links).map(function(t){var e=n.links[t];return e.key=t,e});c.length>0&&(r+="<div>",c.forEach(function(e){r+='<div class="team-link">'+t.getLinkItem(e).innerHTML+"</div>"}),r+="</div>"),r+='\n\t\t\t\t\t<div class="is-grouped">\n\t\t\t\t\t\t<button data-fpb="edit" class="button is-primary is-outlined is-hidden-to-mentor">\n\t\t\t\t\t\t\t<span class="icon">\n\t\t\t\t\t\t\t\t<i class="fa fa-edit"></i>\n\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t<span>Edit</span>\n\t\t\t\t\t\t</button>\n\t\t\t\t\t\t<button data-fpb="link" class="button is-primary is-outlined is-hidden-to-mentor">\n\t\t\t\t\t\t\t<span class="icon">\n\t\t\t\t\t\t\t\t<i class="fa fa-link"></i>\n\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t<span>Add Link</span>\n\t\t\t\t\t\t</button>\n\t\t\t\t\t\t<button data-fpb="back" class="button is-danger is-outlined">\n\t\t\t\t\t\t\t<span class="icon">\n\t\t\t\t\t\t\t\t<i class="fa fa-arrow-left"></i>\n\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t<span>Back to Promises</span>\n\t\t\t\t\t\t</button>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class="column">\n\t\t\t\t<div class="box content">\n\t\t\t\t\t<h1 class="title is-4">Progress</h1>\n\t\t\t\t\t<div id="comments-field">\n\t\t\t\t\t',Object.keys(n.comments).map(function(t){return n.comments[t]}).sort(function(t,e){return t.timestamp-e.timestamp}).forEach(function(t){var e={name:"Unknown",image:"./public/img/no-user.png"};try{e.name=s[t.author].name,e.image=s[t.author].image}catch(t){console.error(t)}var n=moment(t.timestamp).format("M/D h:mm A");t.generated?r+='\n\t\t\t\t\t\t<div class="comment">\n\t\t\t\t\t\t\t<span class="image is-16x16 is-rounded is-inline-image">\n\t\t\t\t\t\t\t\t<img src="'+e.image+'">\n\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t<span class="title is-6">'+e.name+'</span>\n\t\t\t\t\t\t\t<span class="is-faded"> '+n+': </span>\n\t\t\t\t\t\t\t<span class="generated-text">'+t.text+"</span>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t":r+='\n\t\t\t\t\t\t<div class="comment">\n\t\t\t\t\t\t\t<span class="image is-16x16 is-rounded is-inline-image">\n\t\t\t\t\t\t\t\t<img src="'+e.image+'">\n\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t<span class="title is-6">'+e.name+'</span>\n\t\t\t\t\t\t\t<span class="is-faded"> '+n+": </span>\n\t\t\t\t\t\t\t<span>"+t.text+"</span>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t"}),r+='\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="is-hidden-to-mentor">\n\t\t\t\t\t\t<div class="tile is-child">\n\t\t\t\t\t\t\t<div class="tile-editable">\n\t\t\t\t\t\t\t\t<textarea data-fpb="textarea" class="textarea" rows="2" placeholder="Write here..."></textarea>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class="is-grouped">\n\t\t\t\t\t\t\t\t<button data-fpb="comment" class="button is-primary">\n\t\t\t\t\t\t\t\t\t<span class="icon">\n\t\t\t\t\t\t\t\t\t\t<i class="fa fa-comment-o"></i>\n\t\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t\t<span>Comment</span>\n\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t\t<button data-fpb="complete" class="button is-primary is-outlined">\n\t\t\t\t\t\t\t\t\t<span class="icon">\n\t\t\t\t\t\t\t\t\t\t<i class="fa '+(n.completed?"fa-times":"fa-check")+'"></i>\n\t\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t\t<span>'+(n.completed?"Mark as Incomplete":"Mark as Complete")+"</span>\n\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t";var d=document.createElement("div");return d.classList.add("columns"),d.innerHTML=r,d},getPromiseEditor:function(t){"..."===t.description&&(t.description=!1);var e='\n\t\t\t\t<h1 data-pef="title" class="title is-2 nlp-editable" contenteditable="true">'+(t.title?t.title:"Title of Promise")+'</h1>\n\t\t\t\t<p class="subtitle is-neatly-spaced">\n\t\t\t\t\tI promise to <span data-pef="description" class="nlp-editable" contenteditable="true">'+(t.description?t.description:"(do something for my team)")+'</span> by <span data-pef="due" class="nlp-editable" contenteditable="true">'+(t.due?moment(t.due).format("M/D/YYYY"):"MM/DD/YYYY")+'</span>.\n\t\t\t\t</p>\n\t\t\t\t<p data-pef="warning" class="is-danger-text"></p>\n\t\t\t\t<button data-pef="submit" class="button is-primary">Save Promise</button>\n\t\t\t';t.deletable?e+='<button data-pef="remove" class="button is-danger is-outlined">Cancel</button>':e+='<button data-pef="cancel" class="button is-danger is-outlined">Cancel</button>';var n=document.createElement("div");return n.classList.add("box"),n.classList.add("content"),n.innerHTML=e,n},getRoleStepCard:function(t){var e='\n\t\t\t\t<div class="message is-collapsed is-primary" collapsible>\n\t\t\t\t\t<div class="message-header is-contrast">\n\t\t\t\t\t\t<h2 class="title">'+t.title+'</h2>\n\t\t\t\t\t\t<button>\n\t\t\t\t\t\t\t<span class="icon is-small">\n\t\t\t\t\t\t\t\t<i class="fa show-collapsed fa-chevron-up"></i>\n\t\t\t\t\t\t\t\t<i class="fa show-unfurled fa-chevron-down"></i>\n\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t</button>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="message-body">\n\t\t\t\t\t\t'+t.ps.reduce(function(t,e){return t+"<p>"+e+"</p>"},"")+"\n\t\t\t\t\t\t"+t.links.reduce(function(t,e){return t+'\n\t\t\t\t\t\t\t\t<div class="tags has-addons">\n\t\t\t\t\t\t\t\t\t<span class="tag is-medium is-primary">'+e.type+'</span>\n\t\t\t\t\t\t\t\t\t<span class="tag is-medium is-warning">\n\t\t\t\t\t\t\t\t\t\t<a class="link" target="_blank" href="'+e.url+'">'+e.title+"</a>\n\t\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t"},"")+'\n\t\t\t\t\t\t<button class="button is-primary is-outlined">Mark Complete</button>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t',n=document.createElement("div");return n.innerHTML=e,n.children[0]}};return t}},{}]},{},[2]);
//# sourceMappingURL=maps/role.js.map
