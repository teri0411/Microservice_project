const serverless = require('serverless-http');
const express = require("express");
const app = express();
require('dotenv').config()

const AWS = require("aws-sdk");
const sns = new AWS.SNS();

app.use(express.json());
app.get("/status", (req, res) => res.json({ status: "ok", sns: sns }));
app.post("/send", (req, res) => {
    console.log(process.env.PASSWORD)
    console.log(process.env.USERNAME)
    console.log(process.env.HOST)
    console.log(process.env.DATABASE)
  var mysql = require("mysql");
  var connection = mysql.createConnection({
    // RDS에서 DB를 생성하고 연결.
    host: process.env.HOST,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
  });

  connection.query(
    `
        SELECT
            BIN_TO_UUID(product_id) as product_id
            , name, price, stock, BIN_TO_UUID(factory_id), BIN_TO_UUID(ad_id)
        FROM product
        WHERE sku = '${req.body.MessageAttributeProductId}';
        `,
    function (error, results, fields) {
      if (error) throw error;
      if (results[0].stock > 0) {
        console.log(results);
        console.log("The stock is: ", results[0].stock);
        const sql = `
                UPDATE product
                SET stock = ${results[0].stock - 1}
                WHERE product_id = UUID_TO_BIN('${results[0].product_id}');
                `;
        console.log(sql);
        connection.query(sql, function (error, results2, fields) {
          if (error) throw error;
        });
        console.log("재고 감소 !!");
        return res.status(200).send({ message: "판매완료" });
      } else {
        console.log("재고 부족 상황!!");
        console.log(req.body);
        let now = new Date().toString();
        let email = `${req.body.message} \n \n This was sent: ${now}`;
        let params = {
          Message: email,
          MessageGroupId: req.body.MessageGroupId,
          MessageDeduplicationId: new Date().getTime().toString(),
          Subject: req.body.subject,
          MessageAttributes: {
            ProductId: {
              StringValue: req.body.MessageAttributeProductId,
              DataType: "String",
            },
            FactoryId: {
              StringValue: req.body.MessageAttributeFactoryId,
              DataType: "String",
            },
          },
         
          TopicArn: 'arn:aws:sns:ap-northeast-2:967699999360:stock_empty.fifo'

        };

        sns.publish(params, function (err, data) {
          if (err) console.log(err, err.stack);
          else console.log(data);
          return res.status(200).send({ message: "재고부족, 제품 생산 요청!" });
        });
      }
    }
  );
});

module.exports.handler = serverless(app);