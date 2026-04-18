import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookie from 'cookie-parser';
import authRouter from './routes/user.route.js';
import { config } from './config/config.js';

import passport from 'passport';
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

const app = express();
app.use(express.json());
app.use(cors(
    {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    }
));

app.use(passport.initialize());
passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback" 
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));

app.use(morgan('dev'));
app.use(cookie());

app.use('/api/auth', authRouter);   


export default app;

