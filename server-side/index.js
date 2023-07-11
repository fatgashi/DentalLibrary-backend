const express = require("express");
const cors = require("cors");
require('dotenv').config();
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const usersRouter = require('./routes/usersRoute');

app.use(express.json());
app.use(cors());
app.use(passport.initialize());
require('./config/passport')(passport);
app.use("/users", usersRouter);

const port = process.env.PORT;

mongoose.connect("mongodb://localhost:27017/dentalDatabase", {
    useNewUrlParser: true,
    useUnifiedTopology: true,

}).then(() => console.log("MongoDb database Connected ...")).catch((err) => console.log(err));

app.listen(port, () => console.log(`Up & Running on port ${port}`));
