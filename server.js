import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose';
import cors from 'cors';

import chatRoutes from './routes/chat.route.js'
import userRoutes from './routes/user.route.js'

//DB connection
mongoose.connect(process.env.DB_URL)
.then(console.log("DB connected"))
.catch(e=>console.error(e))

const app = express();
const PORT = process.env.PORT || 4000;

//Allow frontend requests
// app.use(cors({
//     origin: 'https://secret-share-btri.onrender.com/',
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true,
//     allowedHeaders: ['Content-Type', 'Authorization']
// }));

app.use(cors())

//Middlewares
app.use(express.urlencoded({ extended:false }));
app.use(express.json());

//Routes
app.use('/api/v1/messages',chatRoutes)
app.use('/api/v1/user', userRoutes)

app.listen(PORT,() => {console.log("Server running at PORT: "+PORT)})