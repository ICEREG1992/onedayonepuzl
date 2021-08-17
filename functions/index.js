const functions = require("firebase-functions");
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const fs = require('fs');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.host = functions.https.onRequest((req, res) => {
	// const userAgent = req.headers['user-agent'].toLowerCase();
	let indexHTML = fs.readFileSync('./hosting/puzzle.html').toString();
	// const path = req.path ? req.path.split('/') : req.path;
    const queryString = req.url.substring(7);
    console.log(queryString);
    const urlParams = new URLSearchParams(queryString);
    if (urlParams.has("id")) {
        const week = urlParams.get("week");
        const id = urlParams.get("id");
        return admin.database().ref().child('weeks/' + week + '/puzzles/' + id).once('value').then(snapshot => {
            if (snapshot.exists()) {
                // populate meta tags
                out = "";
                out += '<meta property="og:type" content="website">\n';
                out += '<meta property="og:site_name" content="One Day One Puzl" />\n';
                out += '<meta property="og:title" content="' + snapshot.child("title").val() + ' by ' + snapshot.key + '" />\n';
                out += '<meta property="og:description" content="Another excellent 1d1p submission made by ' + snapshot.key + '!" />\n';
                out += '<meta property="og:url" content="https://onedayonepuzl.web.app/puzzle?week=' + week + '&id=' + id + '" />\n';
                out += '<meta property="og:image" content="' + snapshot.child("image").val() + '" />\n';
                // live swap into html
                indexHTML = indexHTML.replace('<meta name="functions-insert-dynamic-og">', out);
            } else {
                indexHTML = fs.readFileSync('./hosting/404.html').toString();
            }
            res.send(indexHTML);
        });
    } else {
        const week = urlParams.get("week");
        return admin.database().ref().child('weeks/' + week).once('value').then(snapshot => {
            if (snapshot.exists()) {
                // populate meta tags
                out = "";
                out += '<meta property="og:type" content="website">\n';
                out += '<meta property="og:site_name" content="One Day One Puzl" />\n';
                out += '<meta property="og:title" content="Week ' + snapshot.child("week").val() + ' Puzzles List" />\n';
                out += '<meta property="og:description" content="All of the excellent 1d1p submissions made for week ' + snapshot.child("week").val() + ' by participants!" />\n';
                out += '<meta property="og:url" content="https://onedayonepuzl.web.app/puzzle?week=' + week + '" />\n';
                out += '<meta property="og:image" content="https://onedayonepuzl.web.app/1d1p.png" />\n';
                // live swap into html
                indexHTML = indexHTML.replace('<meta name="functions-insert-dynamic-og">', out);
                console.log("html swapped");
            } else {
                indexHTML = fs.readFileSync('./hosting/404.html').toString();
            }
            res.send(indexHTML);
        });
    }

	

	// optional - turn on caching: res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
	// indexHTML = indexHTML.replace(metaPlaceholder, getMeta());
	// indexHTML = indexHTML.replace(ogPlaceholder, getOpenGraph());
	// res.status(200).send(indexHTML);
});