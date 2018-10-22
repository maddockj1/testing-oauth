var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const passport = require('passport');
var app = express();

const cookieSession = require('cookie-session')
app.use(cookieSession({
  secret: 'keyboard cat'
}));
const GitHubStrategy = require('passport-github').Strategy
app.use(passport.initialize())

passport.use(new GitHubStrategy({
    clientID: 'cdd7a51b35d8ba1e3565',
    clientSecret: '33b3ec89ba14b26a5b45780e48f1a00526a78a95',
    callbackURL: 'http://localhost:3000/auth/github/callback',
    userAgent: 'monday-demo.example.com'
  },function onSuccessfulLogin(token, refreshToken, profile, done) {

    // This is a great place to find or create a user in the database
    // This function happens once after a successful login

    // Whatever you pass to `done` gets passed to `serializeUser`
    done(null, {token, user});
  }
));



app.get('/auth/github', passport.authenticate('github'));

app.get('/auth/github/callback',
  passport.authenticate('github', {
    successRedirect: '/',
    failureRedirect: '/login'
  }))



// this wires up passport's session code to your session
app.use(passport.session())
passport.serializeUser((object, done) => {
  done(null, {
    token: object.token
  })
})
passport.deserializeUser((object, done) => {
  done(null, object)
})



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
