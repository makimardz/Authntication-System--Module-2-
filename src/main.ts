import express from 'express';
import cors from "cors";
import router from './routes/index'; 

const app = express();
app.use(express.json());
app.use(cors());
// Mount the router at the base path
app.use('/', router);

app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running...');
});