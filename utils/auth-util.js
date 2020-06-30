let bcrypt = require('bcrypt');

exports.encryptPassword = function (password, callback) {
  bcrypt.genSalt(10, function (err, salt) {
    if (err)
      return callback(err);

    bcrypt.hash(password, salt, function (err, hash) {
      return callback(err, hash);
    });
  });
};

exports.comparePassword = function (plainPass, hashword, callback) {
  bcrypt.compare(plainPass, hashword, function (err, isPasswordMatch) {
    return err == null ?
      callback(null, isPasswordMatch) :
      callback(err);
  });
};

// Check if the error name is an JWT unauthorized one
exports.isUnauthorizedError = function (errorName) {
  return errorName === 'JsonWebTokenError' || errorName === 'TokenExpiredError' || errorName === 'NotBeforeError';
}