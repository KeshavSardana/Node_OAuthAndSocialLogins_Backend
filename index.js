const express = require("express");
const mongoose = require("mongoose");
const app = express();
const passportConfig = require("./passport/passport");
const passport = require("passport");
var cookieSession = require("cookie-session");

// connect to db
mongoose.connect("mongodb://localhost:27017/passport_OAuth", () =>
  console.log("Connected to DB Successfully")
);

// everything is fine here , google is sending us the user and we are storing that user in our db
// but the passport is not generating a session for us and thats the only reason we are not able to login other than session
//  we got the approval from google . its just the passport is not able to generate a session for us.

app.use(
  cookieSession({
    maxAge: 3 * 24 * 60 * 60 * 1000,
    keys: ["thisisasecretkeytogeneratethetoken"], // dotenv
  })
);

const isLoggedIn = (req, res, next) => {
  if (!req.user) {
    res.redirect("/auth/login");
  }
  next();
};

app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");

// import auth routes
const auth = require("./routes/auth");

app.use("/auth", auth);

app.get("/", isLoggedIn, (req, res) => {
  res.render("home");
});

app.listen(4000, () => console.log("Server is up and running at port 4000"));
