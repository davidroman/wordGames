// Game to guess the characters in a word, will migrate to an Alexa skill

let AWS = require("aws-sdk");
AWS.config.update({ region: "us-west-2", endpoint: "http://localhost:8000" });
let docClient = new AWS.DynamoDB.DocumentClient();
const readline = require('readline');
let prompt = require('prompt');
let randomWords = require('random-words');
let fs = require('fs');

var table = "WORDLIST";
var incorrectGuesses = 0;
const allowedMisses = 3;
var guesses = [];
// const readln = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

input = process.argv[2];

var newWord = chooseWord();
console.log(newWord);
var matchedChars = new Array(newWord.length).fill(null);
console.log(matchedChars);

checkChar(input, newWord, matchedChars);

function checkChar (input, newWord) {
	i = 0;
	while (i < newWord.length) {
		if (input==newWord.charAt(i)) {
			console.log("Match! the character is in the word");
			console.log(i+1);
			matchedChars[i]=input;
			console.log(matchedChars)
			return true;
	    }
	    console.log("in while loop")
	    console.log(newWord.charAt(i));
	    i++;
	}
	console.log("sorry, that character is not in the word.")
	incorrectGuesses++;
	if (incorrectGuesses > allowedMisses) {
		console.log("You have no more attempts, sorry.");
		console.log("The word was " + newWord);
		return false;
	} else {
		// prompt 
	}
}

function chooseWord () {
	myWord = randomWords({exactly: 1, minimumLength: 4, maxLength: 10});
	return String(myWord);
}

// Creating ID for DynamoDB random suffix.  ID equals myDate concat myRandom
myDate = Date.now();
//console.log(myDate);

myRandom = getRandom();
//console.log(myRandom);

function getRandom() {
	return Math.floor(Math.random() * 9000) + 1000;
}

// I don't want a string, this doesn't work ... myId = "" + myDate + myRandom;
myId = Number(myDate + myRandom);
console.log(myId);

var params = { TableName:table, Item:{ "ID": myId, "WORD": newWord, "TEST": 'testing more', "decimal": 88348955721583}};
console.log("Adding a new item to WordList table");

docClient.put(params, function(err, data) {
	 if (err) { 
	 	console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
	 }
	 else {
	 	console.log("Added item:", JSON.stringify(data, null, 2));
	 }
});
