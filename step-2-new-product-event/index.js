const express = require("express");
const app = express();
const AWS = require("aws-sdk");
const credentials = new AWS.SharedIniFileCredentials({profile: "dob_profile",});
const sns = new AWS.SNS({ credentials: credentials, region: "ap-northeast-2" });
const port = 3000;

app.use(express.json());
app.get("/status", (req, res) => res.json({ status: "ok", sns: sns }));
app.post("/send", (req, res) => {
  var mysql = require("mysql");
  var connection = mysql.createConnection({
    host: "localhost",
    user: "dob_user",
    password: "dob_user_secret",
    database: "step-4-init-microservice",
  });
  connection.query(`
        SELECT
            BIN_TO_UUID(product_id) as product_id
            , name, price, stock, BIN_TO_UUID(factory_id) as factory_id, BIN_TO_UUID(ad_id) as ad_id
        FROM product
        WHERE sku = '${req.body.MessageAttributeProductId}';
        `,
    function (error, results, fields) {
        if (error) {
          return res.status(500).send({ message: error });
        }
        console.log("The stock is: ", results[0].stock);
        const sql = `
                UPDATE product
                SET stock = stock + ${req.body.MessageAttributeProductCnt || 0}
                WHERE product_id = UUID_TO_BIN('${results[0].product_id}');
                `;
        console.log(sql);
        connection.query(sql, function (error, results2, fields) {
          if (error)
          return res.status(500).send({ message: error });


        });
        console.log("상품 입고 !!");
        return res.status(200).send({ message: "입고완료" });
      }

  );
});
app.listen(port, () => console.log(`SNS App listening on port ${port}!`));
