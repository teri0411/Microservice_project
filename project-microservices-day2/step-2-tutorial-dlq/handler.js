const { SQS } = require("aws-sdk");

// 인위적으로 처리속도를 제어하기 위해서 지연을 준다.
function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}
const sqs = new SQS();

const producer = async (event) => { 
  let statusCode = 200; 
  let message;
  await delay(1000); // function A 처리속도를 제어하기 위해서 지연을 준다.
  if (!event.body) {
    return {
      statusCode: 400, 
      body: JSON.stringify({
        message: "No body was found",
      }),
    };
  }

  try {
    await sqs
      .sendMessage({
        QueueUrl: process.env.QUEUE_URL, 
        MessageBody: event.body,
        MessageAttributes: {
          AttributeName: {
            StringValue: "Attribute Value",
            DataType: "String",
          },
        },
      })
      .promise();

      message = `Message accepted!`;
    } catch (error) {
    console.log(error);
    message = error;
    statusCode = 500; 
  }

  return {
    statusCode,
    body: JSON.stringify({
      message,
    }),
  };
};

const consumer = async (event) => {
  for (const record of event.Records) {
    const messageAttributes = record.messageAttributes;
    console.log(
      "Message Attribute: ",
      messageAttributes.AttributeName.stringValue
    );
    console.log("Message Body: ", record.body);
    if( parseInt(JSON.parse(record.body).step) % 2 == 0 ) {
      await delay(30000); // 비정상 요청으로 생각이상으로 처리시간이 오래걸린 ( = 30초동안 알고리즘이 진행중인) 상황 
    }else{
      await delay(1000); // 정상처리 1초 
    }
    const message = `Message accepted! Result: ${parseInt(JSON.parse(record.body).input) + 1}`; // # FILL_ME_IN
    console.log(message);
  }
};

module.exports = {
  producer,
  consumer,
};
