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
var storage = firebase.storage();

function postPuzzle(elem) {
	week_num = document.getElementById('create-week').value;
    try {
        return database.ref("weeks").orderByKey().equalTo(week_num).once('value').then(function(snapshot) {
            snapshot = snapshot.child(week_num);
            console.log("Snapshot returned");
            if (snapshot.hasChild('week')) {
                //  week exists, upload just the puzzle
                update = {};
    
                week_num = document.getElementById('create-week').value;
                week = week_num < 10 ? "0" + week_num : "" + week_num;
    
                artistName = document.getElementById('create-author').value;
                update["/title"] = document.getElementById('create-title').value;
                update["/info"] = document.getElementById('create-info').value;
                if (document.getElementById('browse-image').value) {
                    const file = document.getElementById('browse-image').files[0];
                    const fileExtension = file.name.split('.').pop();
                    storage.ref(week_num + '/' + artistName + '.' + fileExtension).put(file);
                    update["/image"] = fileExtension;
                } else {
                    if (document.getElementById('create-url').value) {
                        update["/image"] = document.getElementById('create-url').value;
                    } else {
                        update["/image"] = 'none';
                    }
                }
                return database.ref('weeks/' + week + '/puzzles/' + artistName).update(update, onComplete);
            } else {
                // week doesn't exist, so create full week object
                update = {};
                
                week_num = document.getElementById('create-week').value;
                week = week_num < 10 ? "0" + week_num : "" + week_num;
                
                artistName = document.getElementById('create-author').value;
                update["/puzzles/" + artistName + "/title"] = document.getElementById('create-title').value;
                update["/puzzles/" + artistName + "/info"] = document.getElementById('create-info').value;
                if (document.getElementById('browse-image').value) {
                    const file = document.getElementById('browse-image').files[0];
                    const fileExtension = file.name.split('.').pop();
                    storage.ref(week_num + '/' + artistName + '.' + fileExtension).put(file);
                    update["/puzzles/" + artistName + "/image"] = fileExtension;
                } else {
                    if (document.getElementById('create-url').value) {
                        update["/puzzles/" + artistName + "/image"] = document.getElementById('create-url').value;
                    } else {
                        update["/puzzles/" + artistName + "/image"] = 'none';
                    }
                    
                }
                update["/week"] = week_num;
                return database.ref('weeks/' + week).update(update, onComplete);
            }
        }).then(res => {
            return false;
        });
    } catch(e) {
        updateStatus("Something went wrong! Show this to William:<br>" + e, "Red");
    }
	
}

function onComplete(error) {
    if (error) {
        updateStatus(error, "Red");
    } else {
        week_num = document.getElementById('create-week').value;
        week = week_num < 10 ? "0" + week_num : "" + week_num;
        author = document.getElementById('create-author').value;
        updateStatus("Puzzle uploaded!<br><a style='color=black' href='../puzzle?week=" + week + "&id=" + author + "'>Go to your puzzle</a>", "Green");
    }
}

function disableUrl() {
    document.getElementById('create-url').disabled = true;
    document.getElementById('cancel-upload').hidden = false;
}

function cancelUpload() {
    document.getElementById('browse-image').value = "" 
    document.getElementById('cancel-upload').hidden = true;
    document.getElementById('create-url').disabled = false;
}

function updateStatus(text, color) {
    var statusElem = document.getElementById('status');
    statusElem.innerHTML = text;
    statusElem.style = "color: " + color;
}