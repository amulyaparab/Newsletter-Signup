const express = require("express");
const app = express();
const https = require("https");
const bodyParser = require("body-parser");
const client = require("@mailchimp/mailchimp_marketing");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
const apiKey = config.apiKey;
const server = config.server;
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("server is up and running");
});

client.setConfig({
  apiKey: apiKey,
  server: server,
});

app.post("/", function (req, res) {
  const fName = req.body.firstName;
  const lName = req.body.lastName;
  const email = req.body.emailAddress;
  const listId = config.listID;
  const subscribingUser = {
    firstName: fName,
    lastName: lName,
    email: email,
  };
  const run = async () => {
    const response = await client.lists.addListMember(listId, {
      email_address: subscribingUser.email,
      status: "subscribed",
      merge_fields: {
        FNAME: subscribingUser.firstName,
        LNAME: subscribingUser.lastName,
      },
    });
    console.log(response);
    res.sendFile(__dirname + "/success.html");
  };

  run().catch((e) => {
    res.sendFile(__dirname + "/failure.html");
    console.log(e);
  });
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});
