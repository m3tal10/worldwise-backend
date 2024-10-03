const City = require('../models/cityModel');
const catchAsync = require('../utils/catchAsync');

exports.getCities = catchAsync(async (req, res, next) => {
  const cities = await City.find();

  res.status(200).json({
    status: 'success',
    data: {
      cities,
    },
  });
});

exports.getCitiesUser = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const cities = await City.find({ user: userId });
  res.status(200).json({
    status: 'success',
    data: {
      cities,
    },
  });
});

exports.createCity = catchAsync(async (req, res, next) => {
  const data = req.body;
  const city = await City.create(data);

  res.status(201).json({
    status: 'success',
    data: {
      city,
    },
  });
});

exports.deleteCity = catchAsync(async (req, res, next) => {
  const { cityId } = req.params;
  const data = await City.findByIdAndDelete(cityId);
  res.status(204).json({
    status: 'success',
    data,
  });
});
