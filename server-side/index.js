require('dotenv').config();
const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const usersRouter = require('./routes/usersRoute');
const booksRouter = require('./routes/booksRoute');
const session = require('express-session');
const cartRouter = require("./routes/cartRoute");
const paymentRouter = require('./routes/paymentRoute');
const conditionalJson = require('./middlewares/conditionJson');
const socketIO = require('./socket');
const costumerRoute = require('./routes/costumerRoute');
const loanRoute = require('./routes/loanRoute');
const visitorRouter = require('./routes/visitorsRoute');
require('./cronJob/cronJob');

const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {
  cors: {
    origin: "*",
  }
});

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
app.use("/users", usersRouter);
app.use("/books", booksRouter);
app.use("/cart", cartRouter);
app.use("/payment", paymentRouter);
app.use('/visitor', visitorRouter);
app.use('/costumers', costumerRoute);
app.use('/loans', loanRoute);


socketIO(io);

const port = process.env.PORT;

mongoose.connect(`${process.env.MONGO_URL}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,

}).then(() => console.log("MongoDb database Connected ...")).catch((err) => console.log(err));

httpServer.listen(port, () => console.log(`Up & Running on port ${port}`));
