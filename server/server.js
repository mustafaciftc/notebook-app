const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const noteRoutes = require("./routes/noteRoutes");
const userRoutes = require("./routes/userRoutes");
const app = express();

const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.use("/api/notes", noteRoutes);
app.use("/api/users", userRoutes);

app.listen(port, () => {
    console.log(`Sunucu ${port} portunda çalışıyor..`)
});