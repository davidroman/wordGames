// Game to guess the characters in a word, will migrate to an Alexa skill

var AWS = require("aws-sdk");
AWS.config.update({ region: "us-west-2", endpoint: "http://localhost:8000" });
var docClient = new AWS.DynamoDB.DocumentClient();
var randomWords = require('random-words');
var table = "WORDLIST";

input = process.argv[2];

var newWord = chooseWord();
console.log(newWord);
checkChar(input, newWord[0]);

function checkChar (input, newWord) {
	wordLength = newWord.length;
	i = 0;
	while (i < wordLength) {
		if (input==newWord.charAt(i)) {
			console.log("Match! the character is in the word");
			console.log(i+1);
			return true;
	    }
	    console.log("in while loop")
	    console.log(newWord.charAt(i));
	    i++;
	}
	console.log("sorry, that character is not in the word.")
	return false;
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
// console.log(myId);

var params = { TableName:table, Item:{ "ID": myId, "WORD": newWord}};
console.log("Adding a new item to WordList table");

docClient.put(params, function(err, data) {
	 if (err) { 
	 	console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
	 }
	 else {
	 	console.log("Added item:", JSON.stringify(data, null, 2));
	 }
});
