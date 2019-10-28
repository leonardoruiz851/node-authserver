const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_ADDRESS, {useNewUrlParser: true}, function(err) {
    if (err) {
      throw err;
    }
});

module.exports = mongoose;