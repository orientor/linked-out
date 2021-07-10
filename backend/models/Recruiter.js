const mongoose=require("mongoose");
const Schema = mongoose.Schema;

const RecrSchema = new Schema(
{
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  contact: {type: String},
  bio: {
	  type: String
  },
  pp: {
	  type: String
  },
  jobs: [{type: Schema.Types.ObjectId, ref: "job"}]
}
);

module.exports = Recr = mongoose.model("recr", RecrSchema);
