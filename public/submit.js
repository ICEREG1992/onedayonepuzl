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

function postPuzzle(elem) {
	week_num = document.getElementById('create-week').value;
	return database.ref("weeks").orderByKey().equalTo(week_num).once('value').then(function(snapshot) {
        snapshot = snapshot.child(week_num);
		console.log("Snapshot returned");
		if (snapshot.hasChild('week')) {
			// week already exists, now check password
            database.ref("passwords").orderByKey().equalTo(week_num).once('value').then(function(snapshot) {
                snapshot = snapshot.child(week_num);
                if (snapshot.val() == document.getElementById('password').value) {
                    update = {};

                    week_num = document.getElementById('create-week').value;
                    week = week_num < 10 ? "0" + week_num : "" + week_num;

                    artistName = document.getElementById('create-author').value;
                    update["/title"] = document.getElementById('create-title').value;
                    update["/info"] = document.getElementById('create-info').value;
                    update["/image"] = document.getElementById('create-image').value;
                    database.ref('weeks/' + week + '/puzzles/' + artistName).update(update);
                }
            })
		} else {
			// week does not exist, do nothing
		}
	}).then(function() {
		return false;
	});
}