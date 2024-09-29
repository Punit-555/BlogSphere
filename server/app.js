const express = require('express');
const db = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const cors = require('cors');
require('dotenv').config();
const PORT = process.env.PORT || 8080;


const app = express();
app.use(express.json());
app.use(cors());

app.use('/', userRoutes);
app.use('/posts', postRoutes);

app.use("/post/likes&comment", postRoutes)



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
