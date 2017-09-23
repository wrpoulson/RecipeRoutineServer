const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");
const keys = require("./config/keys");
require("./models/user");
const auth = require("./services/authentication")(passport);

mongoose.connect(keys.mongoUri);

const app = express();

app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

require("./routes/login-routes")(app);

app.get("/secret", auth.requireToken(), function(req, res) {
    res.json("Success! You can not see this without a token");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);
