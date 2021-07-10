const mongoose=require("mongoose");
const Schema = mongoose.Schema;

const education = new Schema(
	{
		name: {
			type: String,
			required: true
		},
		start: {
			type: Number,
			required: true
		}
		,
		end: {
			type: Number,
		}
	}
)
const ApplSchema = new Schema(
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
  skills: [{type: String}],
  rating: {type: Number},
  ed_list: [education],
  resume: {
	  type: String
  },
  app: [{type: Schema.Types.ObjectId, ref: "app"}],
  pp: {
	  type: String
  }
}
);

module.exports = Appl = mongoose.model("appl", ApplSchema);
