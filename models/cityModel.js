const mongoose = require('mongoose');

const citySchema = new mongoose.Schema(
  {
    cityName: {
      type: String,
      required: [true, 'A City must have a name.'],
    },
    country: {
      type: String,
      required: [true, 'A City must have a country'],
    },
    emoji: {
      type: String,
      reuired: [true, 'A City must have a emoji.'],
    },
    date: {
      type: Date,
      required: [true, 'A City must have a date.'],
    },
    notes: String,
    position: {
      type: Object,
      required: [true, 'A City must have a geospatial position.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      //   required: [true, 'A City must need a user'],
      ref: 'User',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

//Virtual properties
// citySchema.virtual('hihi').get(function () {
//   return 1;
// });

const City = mongoose.model('City', citySchema);
module.exports = City;
