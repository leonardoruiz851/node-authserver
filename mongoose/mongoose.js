const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/nodeauthserver', {useNewUrlParser: true}, function(err) {
    if (err) {
      throw err;
    }
});

module.exports = mongoose;