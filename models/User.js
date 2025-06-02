const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide us with your name']
  },
  email: {
    type: String,
    required: [true, 'Please provide us with your email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email address'
    ]
  },
  photo: {
    type: String,
    default: 'default.jpg'
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Please provide your password'],
    minLength: 8,
    select: false // Do not return password in queries
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function(el) {
        return el === this.password; // 'this' refers to the current document
      },
      message: 'Passwords does not match!'
    }
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  }
});

userSchema.pre('save', async function(next) {
  // Only run this function if password was actually modified (or created)
  if (!this.isModified('password')) return next();

  // Hash the password with bcrypt
  this.password = await bcrypt.hash(this.password, 12); // hash() is asynchronous

  this.passwordConfirm = undefined; // Remove passwordConfirm field after hashing. Possible because it is not needed anymore. 'required' validation on the schema just for requiring the input data, not means it have to be persisted on the database.

  next();
});

userSchema.pre('save', function(next) {
  // Only run this function if password was actually modified (not include created)
  if (!this.isModified('password' || this.isNew)) return next();

  this.passwordChangedAt = Date.now() - 1000; // Set passwordChangedAt to current time minus 1 second to ensure it is always before the JWT issued at time

  next();
});

userSchema.pre(/^find/, function(next) {
  // 'this' refers to the current query
  this.find({ active: { $ne: false } });

  next();
});

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  // Cannot access to 'this.password' because it is set to "select: false" in the schema, so we need to pass the userPassword as an argument

  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  // If passwordChangedAt is not set, return false
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp; // true if password was changed after the token was issued
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function() {
  // Create a reset token
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Hash the reset token
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  // Set the expiration time for the reset token
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes later

  return resetToken; // Return the plain token to send to the user
  // Note: The hashed token is saved in the database, not the plain token
};

const User = mongoose.model('User', userSchema);

module.exports = User;
