const mongoose=require("mongoose");
const Schema = mongoose.Schema;

const RatingSchema = new Schema(
{
  rater: {type: String},
  rated: {type: String},
  rating: {
	  type: Number
  }
}
);

module.exports = Rating = mongoose.model("rating", RatingSchema);
