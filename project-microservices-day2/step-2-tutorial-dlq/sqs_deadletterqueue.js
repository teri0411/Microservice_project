
var AWS = require('aws-sdk');
AWS.config.update({region: 'ap-northeast-2'});

var sqs = new AWS.SQS({apiVersion: '2012-11-05'});

var params = {
 Attributes: {
  "RedrivePolicy": "{\"deadLetterTargetArn\":\"DEAD_LETTER_QUEUE_ARN\",\"maxReceiveCount\":\"5\"}",
 },
 QueueUrl: "SOURCE_QUEUE_URL"
};

sqs.setQueueAttributes(params, function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Success", data);
  }
});
