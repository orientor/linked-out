const mongoose=require("mongoose");
const Schema = mongoose.Schema;

const JobSchema = new Schema(
{
  job_title: {
    type: String
  },
  app_no: {
    type: Number,
	default: 15
  },
  post_no: {
    type: Number,
	default: 5
  },
  post_date: {
    type: Date,
	default: Date.now()
  },
  deadline: {
    type: Date,
	default: Date.now() + 7
  },
  skill: [{type: String}],
  type_of_job: Number,
  duration: Number,
  salary: Number,
  rating: Number,
  recr: {
	type: Schema.Types.ObjectId,
    ref: "recr"
  },
  apps: [{type: Schema.Types.ObjectId, ref: "app"}]
}
);

module.exports = Job = mongoose.model("job", JobSchema);
