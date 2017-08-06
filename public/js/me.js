!function t(e,n,i){function a(r,o){if(!n[r]){if(!e[r]){var c="function"==typeof require&&require;if(!o&&c)return c(r,!0);if(s)return s(r,!0);var l=new Error("Cannot find module '"+r+"'");throw l.code="MODULE_NOT_FOUND",l}var d=n[r]={exports:{}};e[r][0].call(d.exports,function(t){var n=e[r][1][t];return a(n||t)},d,d.exports,t,e,n,i)}return n[r].exports}for(var s="function"==typeof require&&require,r=0;r<i.length;r++)a(i[r]);return a}({1:[function(t,e,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var i={apiKey:"AIzaSyBWk9EWPkkvqiruG8aYnHV0dBPg1z3EtN4",authDomain:"charter-ecb07.firebaseapp.com",databaseURL:"https://charter-ecb07.firebaseio.com",projectId:"charter-ecb07",storageBucket:"",messagingSenderId:"134239305153"};n.config=i},{}],2:[function(t,e,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});n.Database=function(t,e){var n=t.initializeApp(e,"Charter Database"),i=n.database(),a=n.auth();e.localhost=!0,e.noScreenshots=!0;var s=Prometheus(e,n),r={init:function(t,e){var n=!1;a.onAuthStateChanged(function(i){i?(s.logon(i.uid,{name:i.displayName,email:i.email,image:i.photoURL,uid:i.uid}),n||(n=!0,t(i))):n||(n=!0,e())})},login:function(e){var n=new t.auth.GoogleAuthProvider;a.signInWithPopup(n).then(function(t){t.credential.accessToken;var n=t.user;s.logon(n.uid,{name:n.displayName,email:n.email,image:n.photoURL,uid:n.uid}),e(n)}).catch(function(t){console.error(t)})},getPrometheus:function(){return s},getCurrentUser:function(){return a.currentUser||{}},saveFeedback:function(t,e,n){return i.ref("feedback").push({tid:t,uid:e,feedback:n,timestamp:Date.now()})},getUser:function(t){return new Promise(function(e,n){i.ref("prometheus/users/"+t+"/profile").once("value",function(t){var n=t.val();e(n)}).catch(n)})},getTeam:function(t){return new Promise(function(e,n){i.ref("teams/"+t).once("value",function(n){var i=n.val()||{};Object.keys(i).length>0?(i.tid=t,e(i)):e({})}).catch(n)})},onTeamChange:function(t,e,n){if(!t)throw Error("No team id given.");var a={};i.ref("teams/"+t).on("value",function(t){var n=[],i=t.val()||{},s=i.members||{};for(var o in s)if(!(o in a)){var c=r.getUser(o);c.uid=o,n.push(c)}n.length>0?Promise.all(n).then(function(t){t.forEach(function(t,e){var i=n[e].uid;a[i]=t}),e(i,a)}):e(i,a)})},updateTeamName:function(t,e,n){if(!t)throw Error("No team id given.");return i.ref("edits/"+t).push({field:"name",uid:e,value:n,timestamp:Date.now()}),i.ref("teams/"+t+"/name").set(n)},updateQuestion:function(t,e,n){if(!t)throw Error("No team id given.");return i.ref("edits/"+t).push({field:"question",uid:e,value:n,timestamp:Date.now()}),i.ref("teams/"+t+"/question").set(n)},updateExpectations:function(t,e,n){if(!t)throw Error("No team id given.");return i.ref("edits/"+t).push({field:"expectations",uid:e,value:n,timestamp:Date.now()}),i.ref("teams/"+t+"/expectations").set(n)},submitUpdate:function(t,e,n){if(!t)throw Error("No team id given.");if(!e)throw Error("No user id given.");return s.save({type:"SUBMIT_UPDATE",tid:t,update:n}),i.ref("teams/"+t+"/updates/"+e).push({update:n,timestamp:Date.now()})},addLink:function(t,e,n){if(!t)throw Error("No team id given.");if(!e)throw Error("No user id given.");return s.save({type:"ADD_LINK",tid:t,name:n.name,url:n.url}),i.ref("teams/"+t+"/links").push({name:n.name,url:n.url,uid:e,added:Date.now()})},updateLink:function(t,e,n,a){if(!t)throw Error("No team id given.");if(!e)throw Error("No user id given.");if(!n)throw Error("No link id given.");s.save({type:"UPDATE_LINK",tid:t,name:a.name,url:a.url,key:n});var r=i.ref("teams/"+t+"/links/"+n+"/name").set(a.name),o=i.ref("teams/"+t+"/links/"+n+"/url").set(a.url);return Promise.all([r,o])},removeLink:function(t,e,n){if(!t)throw Error("No team id given.");if(!e)throw Error("No user id given.");if(!n)throw Error("No link id given.");return s.save({type:"REMOVE_LINK",tid:t,key:n}),i.ref("teams/"+t+"/links/"+n).remove()},updateRole:function(t,e,n){if(!t)throw Error("No team id given.");if(!e)throw Error("No user id given.");s.save({type:"UPDATE_ROLE",tid:t,role:n.role,responsibility:n.responsibility});var a=i.ref("teams/"+t+"/members/"+e+"/role").set(n.role),r=i.ref("teams/"+t+"/members/"+e+"/responsibility").set(n.responsibility);return Promise.all([a,r])},joinTeam:function(t,e,n){if(!t)throw Error("No team id given.");if(!e)throw Error("No user id given");return new Promise(function(i,a){r.getTeam(t).then(function(s){n!==s.joinCode&&s.joinCode?i({success:!1}):r.addMember(t,e).then(function(t){i({success:!0})}).catch(a)}).catch(a)})},addMember:function(t,e){return s.save({type:"ADD_MEMBER",tid:t,uid:e}),i.ref("teams/"+t+"/members/"+e).set({status:"member",role:"Team Member",joined:Date.now(),member:!0})},getAllTeams:function(t){return new Promise(function(e,n){i.ref("teams").orderByChild("members/"+t+"/member").startAt(!0).endAt(!0).once("value",function(t){var n=t.val()||{};e(n)}).catch(n)})},createNewTeam:function(t,e,n){return new Promise(function(a,o){i.ref("teams").push({name:n||"New Team Charter",joinCode:e}).then(function(e){var i=e.path.ct,c=i[i.length-1];s.save({type:"CREATE_TEAM",tid:c,name:n}),r.addMember(c,t).then(function(t){a({tid:c})}).catch(o)}).catch(o)})},getInstructorClasses:function(t){return new Promise(function(e,n){i.ref("classes").orderByChild("members/"+t+"/access").startAt(!0).endAt(!0).once("value",function(t){var i=t.val()||{},a=Object.keys(i).map(function(t){var e=i[t];return e.cid=t,e});if(a.length>0){var s=[];a.forEach(function(t){var e=t.cid;for(var n in t.teams)!function(t){var n=new Promise(function(e,n){r.getTeam(t).then(e).catch(n)});n.cid=e,s.push(n)}(n)}),Promise.all(s).then(function(t){t.forEach(function(t,e){var n=s[e];i[n.cid]&&i[n.cid].teams[t.tid]&&(i[n.cid].teams[t.tid]=t)}),e(i)}).catch(n)}else e({})}).catch(n)})},addTeamToClass:function(t,e,n){return new Promise(function(e,a){i.ref("classes/"+n).once("value",function(r){var o=r.val();o?(s.save({type:"ADD_TEAM_TO_CLASS",tid:t,classCode:n}),i.ref("classes/"+n+"/teams/"+t).set({access:!0,joined:Date.now()}).then(function(t){e(o)}).catch(a)):a("Could not find a class with code: "+n+".")})})},addInstructorToClass:function(t,e){return new Promise(function(n,a){i.ref("classes/"+e).once("value",function(r){var o=r.val();if(o){var c=o.members||{};t in c?n({isAlreadyInstructor:!0,classData:o}):(s.save({type:"ADD_INSTRUCTOR_TO_CLASS",classCode:e}),i.ref("classes/"+e+"/members/"+t).set({access:!0,type:"instructor",joined:Date.now()}).then(function(t){n({isAlreadyInstructor:!1,classData:o})}).catch(a))}else a("Could not find a class with code: "+e+".")})})}};return r}},{}],3:[function(t,e,n){"use strict";function i(t){p.addEventListener("click",function(t){vex.dialog.prompt({message:"What feedback do you have to share with us?",callback:function(t){if(t){var e=m.getCurrentUser().uid;m.saveFeedback(!1,e,t).then(function(t){vex.dialog.alert("Thank you for your feedback, it really helps us a lot!")}).catch(r)}}})}),o("fill-user-name",t.displayName),c("fill-user-image",t.photoURL);var e=m.getCurrentUser().uid;m.getAllTeams(e).then(function(t){b.innerHTML="";for(var e in t){var n=t[e],i=v.getTeamTile({tid:e,name:n.name});b.appendChild(i)}}).catch(r),g.addEventListener("click",function(t){var e=m.getCurrentUser().uid,n=s(e);vex.dialog.prompt({message:"What is your team's name?",value:"My Team",callback:function(t){t&&m.createNewTeam(e,n,t).then(function(t){var e=t.tid,n=window.location.origin+"/charter.html?team="+e;window.location=n}).catch(r)}})});var n=f.instructor;n?m.addInstructorToClass(e,n).then(function(t){a(e),t.isAlreadyInstructor?console.log("You are already an instructor in "+t.classData.name+"!"):vex.dialog.alert({message:"You have been added as an instructor to "+t.classData.name+"!"})}).catch(r):a(e),m.getPrometheus().save({type:"ACCOUNT_PAGE"})}function a(t){m.getInstructorClasses(t).then(function(t){if(Object.keys(t).length>0){var e=document.getElementById("class-tiles");document.getElementById("section-instructor").style.display="block",e.innerHTML="";for(var n in t){var i=t[n],a=v.getClassTile({cid:n,name:i.name,teams:i.teams});e.appendChild(a)}}}).catch(console.error)}function s(t){var e="",n=t.split("").reverse(),i=5,a=Math.round(n.length/2);a>i&&(i=a);for(var s=0;s<i;s++)e+=n[s];return e}function r(t){vex.dialog.alert(t+"")}function o(t,e){for(var n=document.getElementsByClassName(t),i=0;i<n.length;i++)n[i].innerText=e}function c(t,e){for(var n=document.getElementsByClassName(t),i=0;i<n.length;i++)n[i].src=e}var l=t("./config"),d=t("./database"),u=t("./views"),m=(0,d.Database)(firebase,l.config),f=function(t){t=t.split("+").join(" ");for(var e,n={},i=/[?&]?([^=]+)=([^&]*)/g;e=i.exec(t);)n[decodeURIComponent(e[1])]=decodeURIComponent(e[2]);return n}(document.location.search),v=(0,u.Views)(),h=document.getElementById("login"),p=document.getElementById("feedback"),g=document.getElementById("create"),b=document.getElementById("team-tiles");h.addEventListener("click",function(t){m.login(i)}),m.init(i,function(){window.location=window.location.origin+"/login.html"+document.location.search})},{"./config":1,"./database":2,"./views":4}],4:[function(t,e,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});n.Views=function(){return{getRoleAndUpdateTile:function(t){var e=new Date(t.timestamp),n=moment(e).format("M/D h:mm A"),i=moment(Date.now()).diff(moment(t.timestamp)),a=moment.duration(i).asDays(),s="is-success";a>=5?s="is-danger":a>=3&&(s="is-warning");var r='\n\t\t\t\t<div class="tile is-parent is-vertical is-5">\n\t\t\t\t\t<div class="tile is-child">\n\t\t\t\t\t\t<div class="media">\n\t\t\t\t\t\t\t<figure class="media-left">\n\t\t\t\t\t\t\t\t<p class="image is-48x48">\n\t\t\t\t\t\t\t\t\t<img src="'+t.image+'">\n\t\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t</figure>\n\t\t\t\t\t\t\t<div class="media-content content">\n\t\t\t\t\t\t\t\t<h3 class="title is-5">'+t.name+'</h3>\n\t\t\t\t\t\t\t\t<p class="subtitle is-6">'+t.role+'</p>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class="tile is-parent is-vertical is-7">\n\t\t\t\t\t<div class="tile is-child">\n\t\t\t\t\t\t<div class="content">\n\t\t\t\t\t\t\t<span class="tag '+s+'">'+n+"</span> "+t.update+"\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>",o=document.createElement("div");return o.classList.add("tile"),o.innerHTML=r,o},getRoleTile:function(t){var e='<div class="content">\n\t\t\t\t<h3 class="title is-5">'+t.role+'</h3>\n\t\t\t\t<p class="subtitle is-6">'+t.responsibility+"</p>\n\t\t\t</div>";t.editable&&(e='<div class="content">\n\t\t\t\t\t<h3 id="my-title" class="title is-5" contenteditable="true">'+t.role+'</h3>\n\t\t\t\t\t<p id="my-responsibility" class="subtitle is-6" contenteditable="true">'+t.responsibility+'</p>\n\t\t\t\t\t<button id="my-role-save" class="button is-primary is-outlined is-hidden-to-mentor">\n\t\t\t\t\t\t<span class="icon">\n\t\t\t\t\t\t\t<i class="fa fa-edit"></i>\n\t\t\t\t\t\t</span>\n\t\t\t\t\t\t<span>Save Role</span>\n\t\t\t\t\t</button>\n\t\t\t\t</div>');var n='\n\t\t\t\t<div class="tile is-parent is-vertical is-5">\n\t\t\t\t\t<div class="tile is-child">\n\t\t\t\t\t\t<div class="media">\n\t\t\t\t\t\t\t<figure class="media-left">\n\t\t\t\t\t\t\t\t<p class="image is-48x48">\n\t\t\t\t\t\t\t\t\t<img src="'+t.image+'">\n\t\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t</figure>\n\t\t\t\t\t\t\t<div class="content">\n\t\t\t\t\t\t\t\t<h3 class="title is-5">'+t.name+'</h3>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class="tile is-parent is-vertical is-7">\n\t\t\t\t\t<div class="tile is-child">\n\t\t\t\t\t\t'+e+"\n\t\t\t\t\t</div>\n\t\t\t\t</div>",i=document.createElement("div");return i.classList.add("tile"),i.innerHTML=n,i},getProgressUpdate:function(t){var e=new Date(t.timestamp),n=moment(e).format("M/D h:mm A"),i=moment(Date.now()).diff(moment(t.timestamp)),a=moment.duration(i).asDays(),s="is-success";a>=5?s="is-danger":a>=3&&(s="is-warning");var r='\n\t\t\t\t<div class="tile is-parent is-vertical is-5">\n\t\t\t\t\t<div class="tile is-child">\n\t\t\t\t\t\t<span class="tags has-addons">\n\t\t\t\t\t\t\t<span class="tag '+s+' is-medium">'+n+'</span>\n\t\t\t\t\t\t\t<span class="tag is-medium">\n\t\t\t\t\t\t\t\t<span class="image image-tag-rounded is-32x32">\n\t\t\t\t\t\t\t\t\t<img src="'+t.image+'">\n\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t<span class="is-medium">\n\t\t\t\t\t\t\t\t\t'+t.name+'\n\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t</span>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class="tile is-parent is-vertical is-7">\n\t\t\t\t\t<div class="tile is-child">\n\t\t\t\t\t\t<div class="content">\n\t\t\t\t\t\t\t'+t.update+"\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>",o=document.createElement("div");return o.classList.add("tile"),o.innerHTML=r,o},getLinkItem:function(t){var e="file";t.url.indexOf("docs.google")>-1?e="google":t.url.indexOf("omnipointment.com/meeting")>-1&&(e="calendar");var n='\n\t\t\t\t<a target="_blank" href="'+t.url+'">\n\t\t\t\t\t<span class="icon">\n\t\t\t\t\t\t<i class="fa fa-'+e+'"></i>\n\t\t\t\t\t</span>\n\t\t\t\t\t<span>'+t.name+'</span>\n\t\t\t\t</a>\n\t\t\t\t<a class="is-danger is-hidden-to-mentor">\n\t\t\t\t\t<span class="icon edit-link" data-for="'+t.key+'">\n\t\t\t\t\t\t<i class="fa fa-edit"></i>\n\t\t\t\t\t</span>\n\t\t\t\t</a>\n\t\t\t',i=document.createElement("div");return i.classList.add("team-link"),i.innerHTML=n,i},getTeamTile:function(t){var e=window.location.origin+"/charter.html?team="+t.tid,n='\n\t\t\t\t<div class="tile is-parent">\n\t\t\t\t\t<div class="tile box is-child">\n\t\t\t\t\t\t<div class="content">\n\t\t\t\t\t\t\t<h3 class="title">'+t.name+'</h3>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<a href="'+e+'" class="button is-primary is-outlined">View Team Charter</a>\n\t\t\t\t\t</div>\n\t\t\t\t</div>',i=document.createElement("div");return i.classList.add("column"),i.classList.add("is-4"),i.innerHTML=n,i},getClassTile:function(t){var e=window.location.origin,n=(t.cid,Object.keys(t.teams).filter(function(e){return Object.keys(t.teams[e]).length>0}).map(function(e){var n=t.teams[e];return n.tid=e,n})),i=n.length,a=n.map(function(t){return'\n\t\t\t\t\t<div class="tile is-4">\n\t\t\t\t\t\t<a href='+e+"/charter.html?team="+t.tid+'&mentor=true class="button is-primary is-outlined">'+t.name+"</a>\n\t\t\t\t\t</div>\n\t\t\t\t"}),s='\n\t\t\t\t<div class="tile is-parent">\n\t\t\t\t\t<div class="tile box is-child">\n\t\t\t\t\t\t<div class="content">\n\t\t\t\t\t\t\t<h3 class="title">'+t.name+'</h3>\n\t\t\t\t\t\t\t<p class="subtitle">'+i+" team"+(1===i?"":"s")+"</p>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t"+a.join()+"\n\t\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>",r=document.createElement("div");return r.classList.add("column"),r.classList.add("is-12"),r.innerHTML=s,r}}}},{}]},{},[3]);
//# sourceMappingURL=maps/me.js.map
