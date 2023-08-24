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

app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.json());
app.use(cors());
app.use(passport.initialize());
require('./config/passport')(passport);
app.use("/users", usersRouter);
app.use("/books", booksRouter);
app.use("/cart", cartRouter);
app.use("/payment", paymentRouter);
app.use(passport.session());

const port = process.env.PORT;

mongoose.connect(`${process.env.MONGO_URL}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,

}).then(() => console.log("MongoDb database Connected ...")).catch((err) => console.log(err));

app.listen(port, () => console.log(`Up & Running on port ${port}`));
