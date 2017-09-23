const passport = require("passport");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const keys = require("../config/keys");

const User = mongoose.model("users");

module.exports = app => {
    app.post("/signup", function(req, res) {
        if (!req.body.username || !req.body.password) {
            res.status(400).send("Username and Password Required");
        } else {
            var newUser = new User({
                userName: req.body.username,
                password: req.body.password
            });
            newUser.save(function(error) {
                if (error) {
                    return res.json({
                        success: false,
                        message: "Username already exists."
                    });
                }
                res.json({ success: true, message: "User Created." });
            });
        }
    });

    app.post("/login", function(req, res) {
        if (!req.body.username || !req.body.password) {
            res.status(400).send("Username and Password Required");
        } else {
            User.findOne(
                {
                    userName: req.body.username
                },
                function(error, user) {
                    if (error) res.status(500).send("An error occurred.");
                    if (!user) {
                        res.status(401).send({
                            success: false,
                            message: "User does not exist."
                        });
                    } else {
                        user.comparePassword(req.body.password, function(
                            error,
                            isMatch
                        ) {
                            if (isMatch && !error) {
                                var token = jwt.sign(user.id, keys.secret);
                                res.json({
                                    success: true,
                                    token: token
                                });
                            } else {
                                res.status(401).send({
                                    success: false,
                                    message: "Incorrect password."
                                });
                            }
                        });
                    }
                }
            );
        }
    });
};
