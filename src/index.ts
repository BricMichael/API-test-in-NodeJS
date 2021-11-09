import express, { Application } from 'express';
import { config } from 'dotenv';
import cors from 'cors'
//import routes
import authRoutes from './routes/authRoute';
import postRoutes from './routes/postRoutes';
config();
//import setting database
import './database/settings';

const app: Application = express();
//middlewares
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: false }))



//routes
app.use('/api', authRoutes);
app.use('/api', postRoutes);


const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running on port ${port}`))