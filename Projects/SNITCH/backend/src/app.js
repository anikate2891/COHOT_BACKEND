import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookie from 'cookie-parser';
import authRouter from './routes/user.route.js';

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(cookie());

app.use('/api/auth', authRouter);   


export default app;

