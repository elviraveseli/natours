const path = require('path');
const express = require('express');
const exp = require('constants');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
//Set Security http headers
//1)Global Middleware

// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public')));

app.use(helmet());
//Development logging
console.log(process.env.Node_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//Limit requests from same Api
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP.Please try again in hour!',
});
app.use('/api', limiter);
//Body parser,reading data from the body into req.body
app.use(express.json({ limit: '10kb' }));
//Data santization against NoSQL query injection

app.use(mongoSanitize());
//Data santization against XSS
app.use(xss());
//Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);
//Serving static files

// app.use((req, res, next) => {
//   console.log('hello from the middleware');
//   next();
// });
//Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//2)Route handlers

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

//3)Routes

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl}on this server`,
  // });
  // const err = new Error(`Can't find ${req.originalUrl}on this server`);
  // err.status = 'fail';
  // err.statusCode = 404;
  next(new AppError(`Cant find ${req.originalUrl}on this server`, 404));
});
app.use(globalErrorHandler);
//4)Start server
module.exports = app;
