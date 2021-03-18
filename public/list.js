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
	var puzzleList = [];
	var promises = [];
	snapshot.forEach(function(week) {
		week.child('puzzles').forEach(function(puzzle) {
			let tempPuzzle = {'week':week.key, 'id':puzzle.key, 'title':puzzle.child('title').val()};
			puzzleList.push(tempPuzzle);
		});
	});
	Promise.all(promises).then(function() {
		puzzleList.sort(puzzleSorter);
		buildList(puzzleList);
	})
});

function puzzleSorter(a, b) {
	return a.title.localeCompare(b.title);
}

function buildList(list) {
	var puzzlesElem = document.getElementById('puzzles');
	
	// clear the whole list
	while (puzzlesElem.firstChild) {
		puzzlesElem.removeChild(puzzlesElem.lastChild);
	}
	
	list.forEach(function(puzzle) {
		var divElem = document.createElement("div");
		divElem.setAttribute("class", "puzzle");
		var aElem = document.createElement("a");
		aElem.setAttribute("href", "/puzzle?week=" + puzzle.week + "&id=" + puzzle.id);
		aElem.innerHTML = puzzle.title// + "&emsp;(" + puzzle.id + ")";
		var spanElem = document.createElement("span");
		spanElem.innerHTML = "&emsp;(" + puzzle.id + ")";
		divElem.appendChild(aElem);
		divElem.appendChild(spanElem);
		puzzlesElem.appendChild(divElem);
	});
}