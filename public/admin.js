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

console.log("Just so you know, write access is False to the database, so trying anything is pointless.");

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