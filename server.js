import express from "express";
import session  from "express-session"
import cors from "cors";
import mongoose from "mongoose";
import { Socket, Server } from "socket.io";
import cookieParser from "cookie-parser";
import http  from "http"
import 'dotenv/config'
import passport from "passport"
import passportSteam from 'passport-steam'
import router from "./routers/index.js";
import errorMiddleware from "./middleware/error-middleware.js";
import userController from "./controllers/user-controller.js";

const PORT = process.env.PORT || 5000;

const app = express();
const SteamStrategy = passportSteam.Strategy
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

passport.serializeUser((user, done) => {
  done(null, user);
 });

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(new SteamStrategy(
  {
    returnURL: 'http://localhost:5000' + '/api/auth/steam/return',
    realm: 'http://localhost:5000' + '/',
    apiKey: process.env.API_KEY
  },

    function (identifier, profile, done) {

    process.nextTick(function () {
      profile.identifier = identifier;
      return done(null, profile);
    });
  }
 ));

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);
});

app.use(cors({
  credentials: true,
  origin: "http://localhost:3000",
}));
app.use(express.json());
app.use(cookieParser());
app.use('/api', router);

app.use(session({
  name: 'sessionAuth',
  secret: process.env.SECRET_KEY_SESSION,
  saveUninitialized: true,
  resave: false,
  cookie: {
    maxAge: 3600000
  }
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(errorMiddleware);

app.get('/', userController.loginSteam); 

app.get('/api/auth/steam', passport.authenticate('steam', {failureRedirect: '/'}), function (req, res) {
  res.redirect('/')
});

app.get('/api/auth/steam/return', passport.authenticate('steam', {failureRedirect: '/'}), function (req, res) {
  res.redirect('/')
});

mongoose.connect('mongodb+srv://admin:admin@cluster0.xmyb5.mongodb.net/blog?retryWrites=true&w=majority').then(() => console.log('MongoDB is connected')).catch((err) => console.log('DB error', err))

httpServer.listen(PORT, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log(`The server is running in ${PORT} port`);
})