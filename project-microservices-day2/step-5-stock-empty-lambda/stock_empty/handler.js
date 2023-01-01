
const { SQS } = require("aws-sdk");
const fetch = require("node-fetch");

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

const sqs = new SQS();

const producer = async (event) => {
  let statusCode = 200;
  let message;
  await delay(1000); // function A 처리속도를 제어하기 위해서 지연을 준다.

  fetch("http://factory.p3.api.codestates-devops.be:8080/api/manufactures", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    body: 
    {
    "MessageGroupId": "stock-arrival-group",
    "MessageAttributeProductId": "CP-502101",
    "MessageAttributeProductCnt": 10,
    "MessageAttributeFactoryId": "FF-500293",
    "MessageAttributeRequester": "홍길동",
    "CallbackUrl": "https://rr298yy7hk.execute-api.ap-northeast-2.amazonaws.com/arrival"
    }
    
  }),
  }).then((response) => console.log(response));


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

    message = "Message accepted!";
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

module.exports = {
  producer
};
