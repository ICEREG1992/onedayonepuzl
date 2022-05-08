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
	return database.ref("passwords").orderByKey().equalTo(week_num).once('value').then(function(snapshot) {
        snapshot = snapshot.child(week_num);
        if (snapshot.val() == document.getElementById('password').value) {
            return database.ref("weeks").orderByKey().equalTo(week_num).once('value').then(function(snapshot) {
                snapshot = snapshot.child(week_num);
                console.log("Snapshot returned");
                if (snapshot.hasChild('week')) {
                    // password and week both exist, upload just the puzzle
                    update = {};
        
                    week_num = document.getElementById('create-week').value;
                    week = week_num < 10 ? "0" + week_num : "" + week_num;
        
                    artistName = document.getElementById('create-author').value;
                    update["/title"] = document.getElementById('create-title').value;
                    update["/info"] = document.getElementById('create-info').value;
                    update["/image"] = document.getElementById('create-image').value;
                    database.ref('weeks/' + week + '/puzzles/' + artistName).update(update);
                } else {
                    // password exists but not week, so create full week object
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
    }).then(function() {
        return false;
    });
    
    
}