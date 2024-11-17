require("dotenv").config();
const passport = require("../config/passport");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res
        .status(401)
        .json({ error: "Authentication failed", message: info.message });
    }
    req.logIn(user, async (err) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Login failed, please try again" });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: "1h",
      });

      return res.status(200).json({
        message: "Login successfully",
        token: token,
        user: {
          id: user.id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          state: user.state,
          city: user.city,
          neighborhood: user.neighborhood,
          profileImage: user.profileImage,
          role: user.role,
        },
      });
    });
  })(req, res, next);
};

const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.clearCookie("connect.sid");
      return res.status(200).json({ message: "Logout sucessfully" });
    });
  });
};

module.exports = { login, logout };
