const mongoose = require('mongoose');
const dotenv = require('dotenv');
process.on('uncaughtExeption', (err) => {
  console.log('Uncaught Exeption?Shutting down');
  console.log(err.name, err.message);
  process.exit(1);
});
dotenv.config({ path: './config.env' });
const app = require('./app');

// const DB = process.env.DATABASE.replace(
//   '<PASSWORD>',
//   process.env.DATABASE_PASSWORD,
// );
const DB = 'mongodb://localhost:27017/test';

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connection successful'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
//Test
process.on('unhandledRejection', (err) => {
  console.log('Unhhandled rejection?Shutting down');
  console.log('SHF', err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
