import express, { json } from 'express';
import { config, configDotenv } from 'dotenv';

import auth from './routes/user';
import connectDB from './config/db';
import cookieParser from 'cookie-parser';
import camp from './routes/camp';


config({path:'./config/config.env'});

connectDB();

const app = express();
app.use(cookieParser());
//Body parser
app.use(json());

/*app.get('/', (req,res) => {
    //1. res.send('<h1>Hello from express<h1>');
    //2. res.send({name:'Brad'});
    //3. res.json({name:'Brad'});
    //4. res.sendStatus(400);
    //5. res.status(400).json({success:false});
    res.status(200).json({success:true, data:{id:1}});
});*/

app.use('/camp',camp);
app.use('/api/v1/auth',auth);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, ()=>console.log('Server running in ',process.env.NODE_ENV, ' mode on port ', PORT));

process.on('unhandledRejection',(err:Error,Promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});