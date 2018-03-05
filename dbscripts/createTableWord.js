// AWS SDK for Node.js
var AWS = require('aws-sdk');

var dynamoDBConfiguration = {
	"accessKeyId": "foo",
	"secretAccessKey": "bar",
	"region": "us-east-1",
	"endpoint": new AWS.Endpoint("http://localhost:8000")
};

AWS.config.update(dynamoDBConfiguration);

// Create the DynamoDB service object
var ddb = new AWS.DynamoDB(dynamoDBConfiguration);

var params = {
  AttributeDefinitions: [
    {
      AttributeName: 'ID',
      AttributeType: 'N'
    },
    {
      AttributeName: 'WORD',
      AttributeType: 'S'
    }
  ],
  KeySchema: [
    {
      AttributeName: 'ID',
      KeyType: 'HASH'
    },
    {
      AttributeName: 'WORD',
      KeyType: 'RANGE'
    }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1
  },
  TableName: 'WORDLIST',
  StreamSpecification: {
    StreamEnabled: false
  }
};

// Call DynamoDB to create the table
ddb.createTable(params, function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Success", data.Table.KeySchema);
  }
});

