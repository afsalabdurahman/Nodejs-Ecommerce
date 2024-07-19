const mongoose = require('mongoose')
module.exports = function offDb() {

  // Database config..................
  mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log('Connected!'));
}
