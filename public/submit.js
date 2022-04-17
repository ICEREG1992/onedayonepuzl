function postPuzzle(elem) {
	week_num = document.getElementById('create-week').value;
	return database.ref("weeks").orderByChild('week').equalTo(week_num).once('value').then(function(snapshot) {
		console.log("Snapshot returned")
		if (snapshot.hasChild('week')) {
			// week already exists, now check password
            database.ref("password").orderByKey().equalTo(week_num).once('value').then(function(snapshot) {
                if (snapshot.value == document.getElementById('password').value) {
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