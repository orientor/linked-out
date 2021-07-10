const mongoose=require("mongoose");
const Schema = mongoose.Schema;

const AppSchema = new Schema(
{
  appl: {
    type: Schema.Types.ObjectId,
    ref: "appl",
	  required: true
  },
  sop: {
    type: String,
	default: ""
  },
  job: {
	type: Schema.Types.ObjectId,
    ref: "job",
	required: true
  },
  date: {
	  type: Date,
	  default: Date.now()
  },
  status: {
	  type: String,
	  default: "Applied"//Applied, Accepted, Rejected, Shortlisted
  }
}
);

module.exports = App = mongoose.model("app", AppSchema);
