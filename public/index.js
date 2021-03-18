const firebaseConfig = {
  apiKey: "AIzaSyDBoX2m8Y2bKSDKgEmV0QI9wlJpyL84eTo",
  authDomain: "onedayonepuzl.firebaseapp.com",
  databaseURL: "https://onedayonepuzl.firebaseio.com",
  projectId: "onedayonepuzl",
  storageBucket: "onedayonepuzl.appspot.com",
  messagingSenderId: "32555065444",
  appId: "1:32555065444:web:d88428ba681638c2a63f71",
  measurementId: "G-TGRR5W87BB"
};
firebase.initializeApp(firebaseConfig);
firebase.analytics();

var database = firebase.database();

database.ref('weeks').orderByChild("week").on("value", function(snapshot) {
	buildList(snapshot);
});

function openAbout() {
	document.getElementById("about-text").hidden = false;
	window.scrollTo(0, document.body.scrollHeight);
	document.getElementById("open-about").setAttribute("onClick", "closeAbout()");
}

function closeAbout() {
	document.getElementById("about-text").hidden = true;
	document.getElementById("open-about").setAttribute("onclick", "openAbout()");
}

function buildList(snapshot) {
	var weeksElem = document.getElementById('weeks');
	
	// clear the whole list
	while (weeksElem.firstChild) {
		weeksElem.removeChild(weeksElem.lastChild);
	}
	
	snapshot.forEach(function(week) {
		var divElem = document.createElement("div");
		divElem.setAttribute("class", "week");
		var aElem = document.createElement("a");
		aElem.setAttribute("href", "/puzzle?week=" + week.key);
		aElem.innerHTML = "week " + week.child('week').val();

		divElem.appendChild(aElem);
		weeksElem.appendChild(divElem);
	});

	weeksElem.lastChild.firstChild.setAttribute('id', 'first');
}