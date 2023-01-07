const express = require("express");
const app = express();
const https = require("https");
const bodyParser = require("body-parser");
const client = require("@mailchimp/mailchimp_marketing");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("server is up and running");
});

client.setConfig({
  apiKey: "d49485567b93e57d4dc412bb073154ee-us21",
  server: "us21",
});

app.post("/", function (req, res) {
  const fName = req.body.firstName;
  const lName = req.body.lastName;
  const email = req.body.emailAddress;
  const listId = "244c11a956";
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

// Api key - 8626eb2edce9ab20f0b1e2999b270e94-us21
// Audience ID - 244c11a956
