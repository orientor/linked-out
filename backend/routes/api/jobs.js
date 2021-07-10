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
const Job = require("../../models/Job.js");
const App = require("../../models/Application.js");
const Rating = require("../../models/Rating");
const passportd = require("passport");
require("../../config/passport.js")(passportd)
var nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
port: 465,               // true for 465, false for other ports
host: "smtp.gmail.com",
   auth: {
        user: 'noreplymela@gmail.com',
        pass: 'melamela',
     },
secure: true,
});
router.post("/register", (req, res) => {
	console.log("Register called");
const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
Appl.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email Appl already exists" });
    }  });
Recr.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email Recr already exists" });
    }  });

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
function xo(user, password, res){
	console.log("XO called");
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        const payload = {
          id: user.id,
          name: user.name
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
	  Recr.findOne({email}).then(user => {if(user) {xo(user, password, res);} else {return res.status(404).json({ emailnotfound: "Email not found" });
}});
          }
	else
	{
	xo(user,password, res);
	}
  });
});

router.post("/job", (req, res) => {
	console.log("FRO");
	passportd.authenticate("jwt", {session: false}, (err, user, info) => {
	console.log("In authenticate");
		console.log(user);
		        if (err || !user) {
			console.log("Why");
			console.log(user);
            return res.status(400).json({
                message: 'Something is not rite',
                user   : user
            });
        }
		else
		{
		req.body.recr = user._id;

		if ("jobs" in user)
		{	const jb= new Job(req.body);
			console.log(user);
		jb.save().then(jb => {user.jobs.push(jb);user.save(); console.log(jb); res.json(jb);});

		}
		else
		{
			return res.status(400).json({
                message: 'Only recruiter can use this endpoint',
            });
		}
			}
    })(req, res, () => {});
	console.log("END");

});

router.post("/edit", (req, res) => {
	console.log("XOOXOXOXOXOXOXO");
	console.log("FRO");
	passportd.authenticate("jwt", {session: false}, async (err, user, info) => {
	console.log("In authenticate");
		        if (err || !user) {
			console.log("Why");
            return res.status(400).json({
                message: 'Something is not rite',
                user   : user
            });
        }
		else
		{
		if ("jobs" in user)
		{
			console.log("YEX");
			console.log(req.body);
			await Job.findOneAndUpdate({_id: req.body.idx},req.body);
			return res.status(200).json({message: "Success"});
		}
		else
		{
			return res.status(400).json({
                message: 'Only recruiter can use this endpoint',
            });
		}
			}
    })(req, res, () => {});
	console.log("END");

});

router.post("/get", (req, res) => {
	console.log("FRO");
	passportd.authenticate("jwt", {session: false}, async (err, user, info) => {
	console.log("In authenticate");
		console.log(user);
		        if (err || !user) {
			console.log("Why");
			console.log(user);
            return res.status(400).json({
                message: 'Something is not rite',
                user   : user
            });
        }
		else
		{
		req.body.recr = user._id;

		if ("jobs" in user)
		{
			const ret = await Job.findById(req.body.job);
			return res.json(ret);
		}
		else
		{
			return res.status(400).json({
                message: 'Only recruiter can use this endpoint',
            });
		}
			}
    })(req, res, () => {});
	console.log("END");

});


router.post("/delete", (req, res) => {
	console.log("FRO");
	passportd.authenticate("jwt", {session: false},async (err, user, info) => {
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
		req.body.appl = user._id;

		if ("app" in user)
		{	return res.status(400).json({
                message: 'Only for Recruiters',
                user   : user
            });
		}
		else
		{
		const joba = await Job.findOne({_id: req.body.job}).populate({path: "apps", populate: {path: "appl"}});
		const job = await joba.toObject();
		console.log(job);
		if ("apps" in job)
		{
			await Promise.all(job.apps.map( async (app) => {
				console.log("YUP");
				const apl = await Appl.findById(app.appl._id);
				await apl.app.pull(app);
				await apl.save();
				await App.findOneAndDelete({_id: app._id});
			}
			));
			await Job.findOneAndDelete({_id: req.body.job});
			console.log("YETO");
			return res.status(200).json({mesage: "Success"});
		}
		{
			res.status(400).json({error: "Did you forget Job ID?"});
		}
		}
		}
    })(req, res, () => {});
	console.log("END");

});

router.post("/app", (req, res) => {
	console.log("FRO");
	passportd.authenticate("jwt", {session: false},async (err, user, info) => {
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
		req.body.appl = user._id;

		if ("jobs" in user)
		{	return res.status(400).json({
                message: 'Only for applicants.',
                user   : user
            });
		}
		else
		{
		const job = await Job.findOne({_id: req.body.job});
		if(job.app_no<0)
		{
			return res.status.json({error: "Sorry, but the job is full."});
		}
		else
		{
		if ("apps" in job)
		{
		const aw = await Appl.findOne({_id: user._id}).populate('app');
		var emp=false;
		var mten=0;
		aw.app.forEach(item => {
			if(item.status==="Accepted")
			{
				emp=true;
			}
			else if(item.status!=="Rejected")
			{
				mten+=1;
			}
		});
		if(emp)
		{
			return res.status(400).json({error: "Already got an accepted application"});
		}
		else if(mten>=10)
		{

			return res.status(400).json({error: "Can only have at max 10 applications open at a time"});
		}
		else
		{
		const jb= new App(req.body);
		jb.save().then(jb => {user.app.push(jb);user.save(); job.apps.push(jb); job.app_no-=1; job.save();res.json(jb);});
		}
		}
		else
		{
			res.status(400).json({error: "Did you forget Job ID?"});
		}
		}
		}
		}
    })(req, res, () => {});
	console.log("END");

});
router.get("/app", async (req, res) => {
	console.log("FRK");
	passportd.authenticate("jwt", {session: false}, async (err, user, info) => {
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
		req.body.appl = user._id;

		if ("jobs" in user)
		{
            console.log("FRL");
			console.log(req.params);
			const jb_id = req.query.job;
			console.log(jb_id);
			const job = await Job.findById(jb_id).populate({path: 'apps', populate: {path: 'appl'}});
			console.log(job);
			var jobx  = await job.toObject();
			const ret = await jobx.apps.filter((app) => {if(app.status=== "Applied" || app.status==="Shortlisted"){return true;} else{return false}});
			return res.json(ret);
		}
		else
		{
            console.log("FRD");
		let userx=await Appl.findOne({_id: user._id}).populate({path:'app', populate: {path: 'job', populate: {path: 'recr'}}});
		var usery=await userx.toObject();
		usery.app = await Promise.all(usery.app.map( async (app) =>
				{
					if(await Rating.exists({rater: user._id, rated: app.job._id}))
					{
						app.rated = true;
					}
					else
					{
						app.rated = false;
					}
					return app;
				}
			));
		console.log(usery.app);
		return res.json(usery.app);
		}
		}
    })(req, res, () => {});
	console.log("END");

});
router.get("/emp", async (req, res) => {
	console.log("FRK");
	passportd.authenticate("jwt", {session: false}, async (err, user, info) => {
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
		req.body.appl = user._id;

		if ("jobs" in user)
		{
            console.log("FRL");
			console.log(req.params);
			const jb_id = req.query.job;
			console.log(jb_id);
			const recr = await Recr.findById(user._id).populate({path: 'jobs', populate: {path: 'apps', populate: {path: 'appl job'}}});
			var los= []
			await recr.jobs.map((job) => {
				job.apps.map((app) =>{
					if(app.status==="Accepted")
					{
						los.push(app.toObject());
					}
				}
				);
			});
			await Promise.all(los.map( async (app) =>
				{
					if(await Rating.exists({rater: user._id, rated: app.appl._id}))
					{
						app.rated = true;
					}
					else
					{
						app.rated = false;
					}
					return app;
				}
			));
			return res.json(los);
		}
		else
		{
		return res.status(400);
		}
		}
    })(req, res, () => {});
	console.log("END");

});

router.get("/job", async function(req, res){
	console.log("FRES");
	passportd.authenticate("jwt", {session: false}, async function(err, user, info){
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
		req.body.appl = user._id;

		if ("jobs" in user)
		{
			console.log("YOA");
			let userx = await Recr.findOne({_id: user.id}).populate('jobs');
			console.log(userx);
			let ret = await userx['jobs'];
			console.log(ret);
			return res.json(ret);
			//Recr.findOne({_id: user._id}).populate('jobs').exec(function(err, userx){
			//console.log(userx);
			//console.log("In recruiter");
			//return res.json(userx.jobs);
		//});
		}
		else
		{
		console.log("Applicant");
		const xo = await Job.find({}).populate('recr');
		var results = await Promise.all(xo.map(async function(job){
			var kr = job.toObject();
			console.log(kr);
			var ex=await App.findOne({appl: user._id, job: job._id});
			console.log(ex);
			if(ex===null)
			{
				if(job.app_no<=0)
				{
					kr.status="Full";
				}
				else
				{
				console.log("IN THE RIGHT THANG");
				kr.status=null;
				}
			}
			else
			{
				kr.status = ex.status;
			}
			return kr;
		}));
		var tod=new Date();
		results = await results.filter(function(re){if(re.deadline<tod){return false}else {return true}});
		res.json(results);
		}
    }})(req, res, () => {});
	console.log("END");

});
router.post("/up", async function(req, res){
	console.log("FAAAAAAAAAAAAAAAAAAW");
	passportd.authenticate("jwt", {session: false}, async function(err, user, info){
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

		if ("jobs" in user)
		{
			console.log("YOA");
			const apx = await App.findById(req.body.id).populate('job');
			let userx = await Recr.findOne({_id: user.id}).populate('jobs');
			if (apx.status==="Applied")
			{
				apx.status="Shortlisted";
				apx.save();
				return res.status(200).json({message: "Success"});
			}
			else if(apx.status==="Shortlisted")
			{

				console.log("HERE");
				if(apx.job.post_no<=0)
				{
					return res.status(400).json({error: "All seats have already been taken"});
				}
				else
				{
					apx.date = new Date();
					apx.save();
					const sus= await Appl.findById(apx.appl);
					const mailData = {
from: 'melamela@gmail.com',  // sender address
  to: sus.email,   // list of receivers
  subject: 'Ya got Accepted',
  text: 'You just got a job from' + user.name +"! Congrats!",
  html: '<b>Hey there! </b>'+ 'You just got a job from' + user.name +"! Congrats!"
};
transporter.sendMail(mailData, function (err, info) {
   if(err)
     console.log(err)
   else
     console.log(info);
});
					const jobx= await Job.findById(apx.job);
					jobx.post_no-=1;
					jobx.save();
					sus.app.forEach((aid) => {if(aid!==apx._id){App.update({_id: aid}, {status: "Rejected"})}});
					apx.status="Accepted";
					apx.save();
					return res.status(200).json({message: "Success"});
				}
			}
			else
			{
				console.log("DEAR");
				return res.status(400).json({error: "Some error"});
			}
			//Recr.findOne({_id: user._id}).populate('jobs').exec(function(err, userx){
			//console.log(userx);
			//console.log("In recruiter");
			//return res.json(userx.jobs);
		//});
		}
    }})(req, res, () => {});
	console.log("END");

});
async function get_rating(id)
{
	var rati = await Rating.find({rated: id});
	var num=0;
	var dem=0;
	rati.map(kro => {
		console.log("NUM" );
		console.log(kro.rating);
		num+=kro.rating;
		dem+=1;
	});
	return num/dem;
};
router.post("/down", async function(req, res){ // Need id in body
	console.log("FRES");
	passportd.authenticate("jwt", {session: false}, async function(err, user, info){
	console.log("In authenticate");
        if (err || !user) {
			console.log(err);
            return res.status(400).json({
                error: 'Something is not right',
                user   : user
            });
        }
		else
		{

		if ("jobs" in user)
		{
			console.log("YOA");
			const apw = await App.findById(req.body.id).populate('job');
			let userx = await Recr.findOne({_id: user.id}).populate('jobs');
			if (apx.status==="Rejcted")
			{
				return res.status(200);
			}
			else if(apx.status!=="Accepted")
			{
					apw.status="Rejected";
					apw.save();
					return res.json(200);
			}
			else
			{
				return res.status(400).json({error: "Some error"});
			}
			//Recr.findOne({_id: user._id}).populate('jobs').exec(function(err, userx){
			//console.log(userx);
			//console.log("In recruiter");
			//return res.json(userx.jobs);
		//});
		}
    }})(req, res, () => {});
	console.log("END");

});
router.post("/rate", async function(req, res){ // Need id in body
	console.log("FRES");
	passportd.authenticate("jwt", {session: false}, async function(err, user, info){
	console.log("In authenticate");
        if (err || !user) {
			console.log(err);
            return res.status(400).json({
                error: 'Something is not right',
                user   : user
            });
        }
		else
		{
			req.body.rater=user._id;

			var xo = await Rating.findOne({rated: req.body.rated, rater: req.body.rater});
			if(xo===null)
			{}
			else
			{
				return res.status(400);
			}

		if ("jobs" in user)
		{
			var appl  = await Appl.findById(req.body.rated);
			var rating = await new Rating(req.body);
			await rating.save();
			appl.rating = await get_rating(req.body.rated);
			await appl.save();
			return res.json(200);
		}
		else
		{	
			var job  = await Job.findById(req.body.rated);
			var rating = await new Rating(req.body);
			await rating.save();
			job.rating = await get_rating(req.body.rated);
			console.log(job.rating);
			await job.save();
			return res.json(200);


		}
    }})(req, res, () => {});
	console.log("END");

});





module.exports = router;
