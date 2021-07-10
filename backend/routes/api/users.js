const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
const User = require("../../models/User");
const Appl = require("../../models/Applicant");
const Recr = require("../../models/Recruiter.js");
const passportd = require("passport");
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
require("../../config/passport.js")(passportd)
passportd.use(new GoogleStrategy({
    clientID: "435067288340-jos11bqoai836qdr6fmf3eci9tjnj3n8.apps.googleusercontent.com",
    clientSecret: "wBB83-Pqf9-YZD5mahUU4VgI",
    callbackURL: "http://localhost:5000/api/users/googleredirect"
  },
  function(accessToken, refreshToken, profile, done) {
      //console.log(accessToken, refreshToken, profile)
      console.log("GOOGLE BASED OAUTH VALIDATION GETTING CALLED")
      return done(null, profile)
  }
))
passportd.serializeUser(function(user, done) {
    console.log('I should have jack ')
    done(null, user)
})
passportd.deserializeUser(function(obj, done) {
    console.log('I wont have jack shit')
    done(null, obj)
})
const fileUpload = require('express-fileupload');
router.get('/google',  passportd.authenticate('google', { scope: ['email'] })
)
router.get('/googleredirect', passportd.authenticate('google'), async (req, res) => {
	email = req.user.emails[0].value;
    var user = await Appl.findOne({ email: email });
    if (user) {
		const payload = {
          id: user.id,
          name: user.name,
		  type: 0
        };
        const token = await jwt.sign(
          payload,
          keys.secretKey,
          {
            expiresIn: 31556926
          });
		/*
          (err, token) => {
			console.log("Bearer");
            res.json({
			  type: type,
              success: true,
              token: "Bearer " + token
            });
          }
        );
		*/

	return res.redirect("http://localhost:3000/glog?token=" + token);
    } 
    var user = await Recr.findOne({ email: req.body.email });
    if (user) {
				const payload = {
          id: user.id,
          name: user.name,
		  type: 1
        };
        const token = await jwt.sign(
          payload,
          keys.secretKey,
          {
            expiresIn: 31556926
          });
		/*
          (err, token) => {
			console.log("Bearer");
            res.json({
			  type: type,
              success: true,
              token: "Bearer " + token
            });
          }
        );
		*/

	return res.redirect("http://localhost:3000/glog?token=" + token);
    } 
	res.redirect("http://localhost:3000/glog?email=" + email);
});
router.post("/register", async (req, res) => {
	console.log("Register called");
const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
	  console.log(errors);
    return res.status(400).json(errors);
  }
console.log("Register SED");
await Appl.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email Appl already exists" });
    }  });
console.log("YAYA");
await Recr.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email Recr already exists" });
    }  });
console.log("YAYP");

 if(req.body.type == 0)
 {
      const newUser = new Appl(req.body);
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => {res.json(user);})
            .catch(err => console.log(err));
        });
      });
  }
else if(req.body.type == 1)
 {
      const newUser = new Recr(req.body);
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => {return res.json(user);})
            .catch(err => console.log(err));
        });
      });
  }
else
{console.log(req.body.type);
	return res.status(400).json({error: "Wrong type"});
}
});
function xo(user, password, res, type){
	console.log("XO called");
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        const payload = {
          id: user.id,
          name: user.name,
		  type: type
        };
        jwt.sign(
          payload,
          keys.secretKey,
          {
            expiresIn: 31556926
          },
          (err, token) => {
			console.log("Bearer");
            res.json({
			  type: type,
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {

			console.log("KRE");
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
}

router.post("/login", (req, res) => {
	console.log("Login called");
const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
const email = req.body.email;
  const password = req.body.password;
  Appl.findOne({ email }).then(user => {
    if (!user) {
	  Recr.findOne({email}).then(user => {if(user) {xo(user, password, res, 1);} else {return res.status(404).json({ emailnotfound: "Email not found" });
}});
          }
	else
	{
	xo(user,password, res, 0);
	}
  });
});
router.get("/test", (req, res) => {
	console.log("FRO");
	passportd.authenticate("jwt", {session: false}, (err, user, info) => {
	console.log("In authenticate");
        if (err || !user) {
			console.log(err);
            return res.status(400).json({
                message: 'Something is not right',
                user   : user
            });
        }
		else
		{
		return res.status(200).json(user);
		}
    })(req, res, () => {});
	console.log("END");

});
router.post("/uploadp", (req, res) => {
	passportd.authenticate("jwt", {session: false}, (err, user, info) => {
        if (err || !user) {
			console.log(err);
            return res.status(400).json({
                message: 'Something is not right',
                user   : user
            });
        }
		else
		{
		if (!req.files) {
        return res.status(500).send({ msg: "file is not found" })
    }
    const myFile = req.files.file;
    myFile.mv(`${__dirname}/files/${user._id}_${myFile.name}`, async function (err) {
        if (err) {
            console.log(err)
            return res.status(500).send({ msg: "Error occured" });
        }
		if("jobs" in user)
		{
			var us = await Recr.findOne({_id: user._id});
			us.pp = `api/users/getf/${user._id}_${myFile.name}`;
			await us.save();
			console.log(us);
		}
		else
		{
			var us = await Appl.findOne({_id: user._id});
			us.pp = `api/users/getf/${user._id}_${myFile.name}`;
			us.save();
		}
        // returing the response with file path and name
        return res.status(200).json({pp: `api/users/getf/${user._id}_${myFile.name}`});
		});
	}})(req, res, () => {});
	console.log("END");

});

router.post("/uploadr", (req, res) => {
	passportd.authenticate("jwt", {session: false}, (err, user, info) => {
        if (err || !user) {
			console.log(err);
            return res.status(400).json({
                message: 'Something is not right',
                user   : user
            });
        }
		else
		{
		if (!req.files) {
        return res.status(500).send({ msg: "file is not found" })
    }
    const myFile = req.files.file;
    myFile.mv(`${__dirname}/files/${user._id}_resume_${myFile.name}`, async function (err) {
        if (err) {
            console.log(err)
            return res.status(500).send({ msg: "Error occured" });
        }
		if("jobs" in user)
		{
			return json.status(400).json({error: "Only for applicants"});
		}
		else
		{
			var us = await Appl.findOne({_id: user._id});
			us.resume = `/api/users/getf/${user._id}_resume_${myFile.name}`;
			await us.save();
			console.log(us);
		}
        // returing the response with file path and name
        return res.status(200).json({resume: `/api/users/getf/${user._id}_resume_${myFile.name}`});
		});
	}})(req, res, () => {});
	console.log("END");

});


router.get("/getf/:fname", (req, res) => {
	var fname = __dirname + "/files/" + req.params.fname;
	console.log(fname);
	res.sendFile(fname);
}
);

async function xo2(user, payload, res)
{
	console.log("IN XO2");
	if("jobs" in user)
	{
		console.log("Changing Recr");
		await Recr.findOneAndUpdate({_id: user._id}, payload);
		res.status(200).json({});
	}
	else
	{	
		console.log("Changing Appl");
		await Appl.findOneAndUpdate({_id: user._id}, payload);
		console.log("Changed Appl");
		res.status(200).json({});
	}
}
async function isUsedEmail(email, res)
{
			await Appl.findOne({ email: email }).then(user => {
    if (user) {
	  console.log("EMAIL in Use by APPL");
      res.status(400).json({ email: "Email Appl already exists" });
		return true;
    }  });
await Recr.findOne({ email: email }).then(user => {
    if (user) {
	  console.log("EMAIL in Use by RECR");
      res.status(400).json({ email: "Email Recr already exists" });
	   return true;
    }  });
	return false;
}
router.post("/edit", (req, res) => {
	console.log("EDITO");
	passportd.authenticate("jwt", {session: false}, async (err, user, info) => {
        if (err || !user) {
			console.log(err);
            return res.status(400).json({
                message: 'Something is not right',
                user   : user
            });
        }
		else
		{
		console.log("MORE EDITO");
		if(req.body.email===user.email)
		{
		console.log("MORE EDITO WITH SAme EMAIL");
			xo2(user,req.body, res);
		}
		else
		{
		console.log("MORE EDITO WITH CHANGED EMAIL");
			if(await isUsedEmail(req.body.email, res))
			{
				console.log("EMAIL IN USE");
			}
			else
			{
				xo2(user, req.body, res);
			}
		}
		}
    })(req, res, () => {});
	console.log("END");

});


module.exports = router;
