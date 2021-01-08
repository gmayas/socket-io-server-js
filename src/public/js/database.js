const mongoose = require('mongoose');

mongoose.connect(process.env['URIMONGODB'], {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
  .then(() => console.log('db connected in Cluster0'))
  .catch(err => console.log('db connected error in Cluster0: ', err));
