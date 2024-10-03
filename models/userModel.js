const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A user must have a name.'],
    },
    email: {
      type: String,
      required: [true, 'A user must have an email.'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email address.'],
    },
    photo: String,
    password: {
      type: String,
      required: [true, 'Password cannot be empty.'],
      select: false,
      minlength: [8, 'Password must be at least 8 characters long.'],
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password.'],
      validate: {
        validator: function (value) {
          return this.password === value;
        },
        message: 'Confirm password must be the same as password.',
      },
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    passwordModifiedAt: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.passwordModifiedAt = Date.now() - 1000;
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.comparePasswords = async function (
  candidatePass,
  originalPass,
) {
  return await bcrypt.compare(candidatePass, originalPass);
};

userSchema.methods.passwordChangedAfter = function (iat) {
  const passwordChangedAt = new Date(this.passwordModifiedAt).getTime() / 1000;
  return passwordChangedAt > iat;
};

userSchema.methods.createResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetToken = hashedResetToken;
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};
// userSchema.virtual('any').get(function () {
//   return ;
// });

const User = mongoose.model('User', userSchema);

module.exports = User;
