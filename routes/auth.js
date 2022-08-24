const express = require("express");
const router = express.Router();
const passport = require("passport");

router.route("/login").get((req, res) => {
  res.render("login");
});

router.route("/logout").get((req, res) => {
  req.logout();
  res.redirect("/auth/login");
});

router
  .route("/google")
  .get(
    passport.authenticate("google", { scope: ["profile", "email"] }),
    (req, res) => {
      res.send("login with google");
    }
  );

router
  .route("/google/callback")
  .get(passport.authenticate("google"), (req, res) => {
    res.send(req.user);
  });

module.exports = router;
