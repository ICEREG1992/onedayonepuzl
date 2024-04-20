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
var storage = firebase.storage();
var solution;

// get all queries from the url
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
// if the url has a puzzle name, load the puzzle side of the page
if (urlParams.has('id') && !urlParams.has('week')) {
	// error out
	window.location.replace("../");
} else if (urlParams.has('id')) {
	document.getElementById("puzzle").hidden = false;
	document.getElementById("week").hidden = true;
	let week = urlParams.get('week');
	if (!isNaN(parseInt(week))) {
		document.getElementById('week-header').innerHTML = "week " + parseInt(week);
	}
	loadPuzzle(week, urlParams.get('id'));
} else if (urlParams.has('week')) {
	// do nothing, week side of the site is already shown
	let week = urlParams.get('week');
	if (!isNaN(parseInt(week))) {
		document.getElementById('week-header').innerHTML = "week " + parseInt(week);
	}
	loadWeek(week);
} else {
	// error out
	window.location.replace("../");
}

function loadPuzzle(week, id) {
	document.getElementById('week-header').href = "./puzzle?week=" + week;
	database.ref('weeks').child(week).once('value').then(function(snapshot) {
		// populate site fields
		document.getElementById('week-header').innerHTML = "week " + snapshot.child('week').val();

		snapshot = snapshot.child('puzzles').child(id);
		// build image element, depending on file type
		switch (snapshot.child('image').val()) {
			case 'png':
			case 'jpg':
			case 'jpeg':
			case 'gif':
				storage.ref(week + '/' + id + '.' + snapshot.child('image').val()).getDownloadURL().then((url) => {
					var imgElem = document.createElement("img");
					imgElem.setAttribute("src", url);
					imgElem.setAttribute('onerror', "this.src='./slosserr.png'");
					var aElem = document.createElement("a");
					aElem.setAttribute('href', url);
					aElem.appendChild(imgElem);
					document.getElementById('puzzle-image').appendChild(aElem);
				})
				break;
			default:
				var aElem = document.createElement("a");
				aElem.setAttribute('href', snapshot.child('image').val());
				aElem.innerHTML = "Click this link to visit the puzzle's URL";
				document.getElementById('puzzle-image').appendChild(aElem);
				break;
		}
		// add title and info
		document.getElementById('puzzle-title').innerHTML = "<b>" + snapshot.child('title').val() + "</b> by <b>" + snapshot.key + "</b>";
		document.getElementById('puzzle-info').appendChild(processInfo(snapshot.child('info').val())); 
		solution = snapshot.child('solution').val();
	});
}

function loadWeek(week) {
	database.ref('weeks').child(week).once('value').then(function(snapshot) {
		document.getElementById('week-header').innerHTML = "week " + snapshot.child('week').val();

		snapshot = snapshot.child('puzzles');
		listElem = document.getElementById('week-puzzles');
		snapshot.forEach(function(puzzle) {
			var textElem = document.createElement("a");
			textElem.setAttribute("class", "puzzle");
			textElem.innerHTML = puzzle.key + " - " + puzzle.child('title').val();
			textElem.setAttribute("href", "./puzzle?week=" + week + "&id=" + puzzle.key);
			listElem.appendChild(textElem);
		});
	});
}

function processInfo(text) {
	return htmlToElement(markdown.toHTML(text));
}

function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    html = html.replace(/\n/g, "<br><br>");
    html = html.replace(/\\n/g, "<br><br>");
    var spoilerRx = (/(\|\|)([^\[\]]*?)(\|\|)/g);
    var m, a = [];
    while (m = spoilerRx.exec(html)) {
		a.push(m[2]);
    }
    for (var s of a) {
    	html = html.replace(s, "<span class='spoiler' onclick='reveal(this)'>" + s + "</span>");
    }
    html = html.replace(/(\|\|)/g, "");
    template.innerHTML = html;
    return template.content;
}

function reveal(elem) {
	elem.setAttribute('class', 'spoiler clicked');
}