require("dotenv").config();
const session = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const passport = require("./passport");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const SECRET = process.env.SECRET;

const sessionMiddleware = session({
  secret: SECRET,
  resave: false,
  saveUninitialized: true,
  rolling: true,
  store: new PrismaSessionStore(prisma, {
    checkPeriod: 60 * 60 * 1000,
    dbRecordIdIsSessionId: true,
    onError: (error) => {
      console.error("Session Store Error:", error);
    },
  }),
  cookie: {
    maxAge: 1000 * 60 * 30,
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "strict",
  },
});

const initializeSession = (app) => {
  app.use(sessionMiddleware);
  app.use(passport.initialize());
  app.use(passport.session());
};

module.exports = initializeSession;
