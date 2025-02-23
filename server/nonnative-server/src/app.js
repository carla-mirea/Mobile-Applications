const cors = require('cors');
const express = require('express');
const app = express();

app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:8080", "http://10.0.2.2:3000"], // 10.0.2.2 is for Android Emulator
    methods: ["POST", "GET"],
    credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the server!');
});

const concertRouter = require('./routers/concertRouters');
app.use('/api/concerts', concertRouter);

module.exports = app;
