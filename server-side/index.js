require('dotenv').config();
const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require('mongoose');
//const https = require('https');
//const fs = require('fs');
const passport = require('passport');
const usersRouter = require('./routes/usersRoute');
const booksRouter = require('./routes/booksRoute');
const session = require('express-session');
const cartRouter = require("./routes/cartRoute");
const paymentRouter = require('./routes/paymentRoute');
const conditionalJson = require('./middlewares/conditionJson');
const socketIO = require('./socket');
//const costumerRoute = require('./routes/costumerRoute');
//const loanRoute = require('./routes/loanRoute');
const statisticsRoute = require('./routes/statisticsRoute');
const emailsRoute = require('./routes/emailsRoute');
require('./cronJob/cronJob');

app.use(conditionalJson);
app.use(cors());

app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);


app.use(passport.initialize());
require('./config/passport')(passport);
app.use(passport.session());
app.use("/api/users", usersRouter);
app.use("/api/books", booksRouter);
app.use("/api/cart", cartRouter);
app.use("/api/payment", paymentRouter);
app.use('/api/statistics', statisticsRoute);
//app.use('/costumers', costumerRoute);
//app.use('/loans', loanRoute);
app.use('/api/email', emailsRoute);

/*const httpsOptions = {
  key: fs.readFileSync('/etc/ssl/private/oralmeds.co.key'),
  cert: fs.readFileSync('/etc/ssl/certs/www_oralmeds_co.crt'),
  ca: fs.readFileSync('/etc/ssl/certs/www_oralmeds_co.ca-bundle')
};*/

const httpServer = require('http').createServer(app);

//const httpsServer = https.createServer(httpsOptions, app);

const io = require('socket.io')(httpServer, {
  cors: {
    origin: "*",
  }
});

socketIO(io);

const port = process.env.PORT;

mongoose.connect(`${process.env.MONGO_URL}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,

}).then(() => console.log("MongoDb database Connected ...")).catch((err) => console.log(err));

httpServer.listen(port, () => console.log(`Up & Running on port ${port}`));
