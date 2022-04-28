const { SQS } = require("aws-sdk");

// 인위적으로 처리속도를 제어하기 위해서 지연을 준다.
function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}
const sqs = new SQS();

const producer = async (event) => {
  let statusCode = FILL_ME_IN
  let message;
  await delay(1000); // function A 처리속도를 제어하기 위해서 지연을 준다.
  if (!event.body) {
    return {
      statusCode: FILL_ME_IN,
      body: JSON.stringify({
        message: "No body was found",
      }),
    };
  }

  try {
    await sqs
      .sendMessage({
        QueueUrl: FILL_ME_IN,
        MessageBody: event.body
      })
      .promise();

    message = `Message accepted!`;
  } catch (error) {
    console.log(error);
    message = error;
    statusCode = FILL_ME_IN
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
    console.log("Message Body: ", record.body);
    await delay(4000); // function B 처리속도를 제어하기 위해서 지연을 준다.
    const message = `Message accepted! Result: <FILL_ME_IN : JSON 형태로 전달되는 body의 input을 parse한 후 +1 되도록 하는 코드로 작성해주세요.>`;
    console.log(message);
  }
};

module.exports = {
  producer,
  consumer,
};
