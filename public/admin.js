var firebaseConfig = {
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

console.log("Pls dont be mean to my database");

function moveWeeksToPushId() {
	database.ref("weeks").once("value").then(function(snapshot) {
		snapshot.forEach(function(week) {
			database.ref("weeks").push(week.val());
		});
	});
}

function movePuzzlesToPuzzle() {
	database.ref("weeks").once("value").then(function(snapshot) {
		snapshot.forEach(function(week) {
			update = {};
			update["/puzzles"] = week.val();
			week.ref.update(update);
		});
	});
}

function repostWeek(number) {
	database.ref("weeks").orderByChild('week').equalTo(number).once('value').then(function(snapshot) {
		snapshot.forEach(function(week) {
			database.ref('weeks').push(week.val());
		})
	});
}

function postPuzzle(elem) {
	week_num = document.getElementById('create-week').value;
	return database.ref("weeks").orderByChild('week').equalTo(week_num).once('value').then(function(snapshot) {
		console.log("Snapshot returned")
		if (snapshot.hasChild('week')) {
			// week already exists, push to puzzles
			update = {};

			week_num = document.getElementById('create-week').value;
			week = week_num < 10 ? "0" + week_num : "" + week_num;

			artistName = document.getElementById('create-author').value;
			update["/title"] = document.getElementById('create-title').value;
			update["/info"] = document.getElementById('create-info').value;
			update["/image"] = document.getElementById('create-image').value;
			database.ref('weeks/' + week + '/puzzles/' + artistName).update(update);
		} else {
			// week does not exist, create week
			update = {};

			week_num = document.getElementById('create-week').value;
			week = week_num < 10 ? "0" + week_num : "" + week_num;
			
			artistName = document.getElementById('create-author').value;
			update["/puzzles/" + artistName + "/title"] = document.getElementById('create-title').value;
			update["/puzzles/" + artistName + "/info"] = document.getElementById('create-info').value;
			update["/puzzles/" + artistName + "/image"] = document.getElementById('create-image').value;
			update["/week"] = week_num;
			database.ref('weeks/' + week).update(update);
		}
	}).then(function() {
		return false;
	});
}