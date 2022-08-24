const passport = require("passport");
const User = require("../model/user");

var GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  const user = await User.findById(id, function (err, user) {});
  done(err, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID:"",
      clientSecret: "",
      callbackURL: "http://localhost:4000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, next) => {
      console.log("MY PROFILE:", profile._json.email);
      await User.find({ email: profile._json.email }).then(async (user) => {
        if (user.length > 0) {
          console.log("User already exists", user);

          // send cookie token
          next(null, user);
        } else {
          await User.create({
            name: profile._json.email,
            googleId: profile.id,
            email: profile._json.email,
          })
            .then((user) => {
              console.log("New User : ", user);
              // send cookie token
              next(null, user);
            })
            .catch((err) => console.log(err));
        }
      });
      next();
    }
  )
);
