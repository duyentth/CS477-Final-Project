const express = require('express');
const app = express();
const mongoose = require('mongoose');
const buildingRouter = require('./routes/building.routes');

//connect to mongo database
function connectToDB () {
    return mongoose.connect('mongodb://127.0.0.1:27017/finalproject');
}
connectToDB().then(() => {console.log('Database is connected')})
    .catch(error => console.log(error));


app.use(express.json());
app.use('/buildings', buildingRouter );



//error handler
app.use((error, req, res, next) => {
    if(error && error.message) {
        res.status(400).send(error.message);
    } else {
        res.status(500).send('Server Error');
    }
});

app.use((req, res) => {
    res.status(501).send("API is not supported");
});

//server listen on port 4000
app.listen(4000, () => console.log('listening on the port 4000...'));