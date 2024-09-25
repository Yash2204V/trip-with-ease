const express = require("express");
const app = express();
const path = require("path");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'src', 'public')));

app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    res.render("home");
});
app.get("/hotelsAndHouses", (req, res) => {
    res.render("hotelsAndHouses");
});
app.get("/hotel", (req, res) => {
    res.render("hotel");
});

app.listen(3000, ()=>{
    console.log("Server running on http://localhost:3000");
})
