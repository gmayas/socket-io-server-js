const mongoose = require('mongoose');

const urlMongo ="mongodb+srv://adminchat:chtjsmgdb1000@cluster0.osjde.mongodb.net/Chat?retryWrites=true&w=majority";

mongoose.connect(process.env['URIMONGODB'], {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
  .then(() => console.log('db connected in Cluster0'))
  .catch(err => console.log('db connected error in Cluster0: ', err));
