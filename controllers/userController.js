const User = require('../models/userModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const multer = require('multer');
const sharp = require('sharp');

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     const extension = file.mimetype.split('/')[1];
//     const fileName = `${req.user.id}-${Date.now()}.${extension}`;
//     cb(null, fileName);
//   },
// });
const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image. Please upload only images.', 400), false);
  }
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadUserImage = upload.single('photo');

exports.resizeUserImage = (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `${req.user.id}-${Date.now()}.jpg`;
  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);
  next();
};

// For '/' route
exports.getUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    data: {
      users,
    },
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  const data = req.body;
  const newUser = await User.create(data);

  res.status(201).json({
    status: 'success',
    newUser,
  });
});

//updating the current user
exports.updateMe = catchAsync(async (req, res, next) => {
  req.body.photo = req.file?.filename;
  const { name, email, photo } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name, email, photo },
    {
      new: true,
      runValidators: true,
    },
  );
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

//for '/:id' route for admin.
exports.getUser = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const currentUser = await User.findById(userId);

  if (!currentUser)
    return next(new AppError('No user found with that ID.', 404));

  res.status(200).json({
    status: 'success',
    data: {
      user: currentUser,
    },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const data = req.body;
  const updatedUser = await User.findByIdAndUpdate(userId, data, {
    runValidators: true,
    new: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const data = await User.findByIdAndDelete(userId);
  res.status(204).json({
    status: 'success',
    data,
  });
});
