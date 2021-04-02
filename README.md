# onedayonepuzl
1d1p, or One Day One Puzl, is a "weekly" "puzzle" "challenge" where players are tasked with creating a unique puzzle in the span of 24 hours (or so). Puzzles are due on Froday night. Puzzles typically come in the form of a single square image with a title, and a small blurb which can be used to include a prompt, puzzle specifications, or a clue sequence.
1d1p is lead by **RAZ369** and **sus**.

## About the app
This repo holds a simple web app UI for viewing past submissions to 1d1p and utilizes Firebase as a store of data. The external Firebase Realtime Database in use has all write access turned to false, so all the app does is connect to the service and read information. All additions of information are made through the Firebase Web Console.

## Database Structure
Since all data in the app is manually entered, the app only deals with the minimal set of data required to function. The database hierarchy looks something like this:

    onedayonepuzl
      -weeks
        {number}
          -week: {number}
          -puzzles
            {author name}
              -title: {title}
              -info: {markdown-style text}
              -image: {url}

In the case that non-integer values are needed (say, Week 6.5), we access that week using the `{number}` key in the URL queries, but once the DataSnapshot comes in, we hotswap the proper `week` value into the page. Weeks are sorted by their `week` value, not their key.

## `info` Styling

The string stored in the `info` attribute for each puzzle is passed through a markdown interpreter, which allows commonly-used formatting to be used in puzzle bios. In addition to most markdown formatting, you can use a `||` opening and closing token to mark a discord-style "spoiler", as well as plaintext code blocks through the usual backtick tokens. Finally, you can use a `\n` newline character to mark line breaks in puzzle bios-- these are designed to be forgiving with input into the Firebase Web Console, so `\\n` is also considered a linebreak token (Firebase Web Console likes to escape special characters on your behalf).

## Setup

 1. Clone the repository.
 2. Initialize into a Firebase project of your choice.
 3. Replace all of the Firebase Javascript headers with those pertaining to your project.
 4. Deploy.
