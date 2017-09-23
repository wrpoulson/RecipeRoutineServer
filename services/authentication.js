const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const keys = require("../config/keys");

const User = mongoose.model("users");

module.exports = function(passport) {
    var options = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: keys.secret
    };
    passport.use(
        new JwtStrategy(options, function(jwt_payload, done) {
            User.findOne({ id: jwt_payload.id }, function(error, user) {
                if (error) {
                    return done(error, false);
                }
                if (user) {
                    done(null, user);
                } else {
                    done(null, false);
                }
            });
        })
    );
    return {
        requireToken: () => {
            return passport.authenticate("jwt", { session: false });
        }
    };
};
