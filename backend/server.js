const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const passport = require("passport");
const users = require("./routes/api/users");
const jobs = require("./routes/api/jobs");
const fileUpload = require('express-fileupload');
var cors = require('cors');
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
// DB Config
const db = require("./config/keys").mongoURI;
// Connect to MongoDB
mongoose.connect( db,{ useNewUrlParser: true }).then(() => console.log("MongoDB successfully connected")).catch(err => console.log(err));
app.use(passport.initialize());
app.use(fileUpload());
require("./config/passport")(passport);
app.use("/api/users", users);
app.use("/api/jobs", jobs);
app.get('*', function(req, res){
	console.log("YUP");
  res.status(404).send('what???');
});
const port = 5000;
console.log("YO")
app.listen(port, () => console.log(`Server up and running on port ${port} !`));
