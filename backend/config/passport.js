const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const User = mongoose.model("users");
const Appl = mongoose.model("appl");
const Recr = mongoose.model("recr");
const keys = require("../config/keys");
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretKey;
module.exports = passport => {
  console.log("KDE")
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
	  console.log("IN the strat");
      Appl.findById(jwt_payload.id)
        .then(user => {
          if (user) {
            return done(null, user);
          }
		  else
		{
		  Recr.findById(jwt_payload.id).then(user => {if(user) {return done(null, user)}else{ return done(null, false);
}});
         		}
        })
        .catch(err => console.log(err));
    })
  );
};
