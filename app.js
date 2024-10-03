//General packages
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
//Packages For security
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

//Local modules
const userRouter = require('./routes/userRoutes');
const cityRouter = require('./routes/cityRoutes');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();
app.use(cors());
app.options('*', cors());
//Set security HTTP headers
// app.use(helmet());

//This will limit the requests sent to the server from an IP. Currently, the limit is 100 requests per hour.
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP.Please try again in an hour.',
});
app.use('/api', limiter);

//express.json and cookieParser for parsing request body and cookie that comes from requests.
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

//Data sanitization agains NoSQL query injection and XSS attacks.
app.use(mongoSanitize());
app.use(xss());

//Prevents Request parameter polltion. Removes all duplicate parameters. But if you need to add multiple duplicate parameter then whitelist the parameter in the middleware options.
// app.use(hpp({
//    //add the parameter names that you want to be duplicates in the whitelist array.
//   whitelist:['']
// }));

// app.use((req, res, next) => {
//   console.log(req.cookies.jwt);
//   next();
// });

app.use('/api/v1/users', userRouter);
app.use('/api/v1/cities', cityRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
