var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
//milddleware
const cookieParser = require("cookie-parser");
function seeCookies (req, res, next) {
  console.log("cookies running:", req.headers.cookie);
next();
}


app.use(seeCookies)
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser("Random string juan said touse when activating cookies"));
app.set('view engine', 'ejs');


//routes

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  "we3Fkk": "http://www.yahoo.com",
  "brick" : "http://www.jjjjound.com"
};


function randomNum(min, max) {
  let letterBank = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "k", "L", "M","n", "O", "P", "Q", "r", "S", "T", "u", "v", "W", "X", "y", "z"];
  let num = Math.round(Math.random() * (max - min) + min);
  let random = letterBank[num];
  for (let i = 0; i < 6; i++){
    
      random += letterBank[Math.round(Math.random() * (max - min) + min)];
  
  } 
  
  return random; 
  } //for new user


  
app.post("/login",(req, res) => {
  
  res.cookie("username", req.body.username);
  res.redirect("/urls")
}); //loginfunction 

app.post("/logout", (req, res) => {
  res.clearCookie("username")
  console.log("logout")
  res.redirect("/urls")
});//logout POST

app.get("/urls/new", (req, res) => {
  var newId = randomNum(0, 26);
  urlDatabase[newId] = req.body.longURL;
  const templateVars = { shortURL : newId, longURL: urlDatabase[newId], cookie: req.cookies.username}
  console.log('"/urls/new')
  // var templateVars = urlDatabase;
  
  res.render('urls_new', templateVars);
});// new user need to add random number 


app.post("/urls/new",(req, res) => {
 var newId = randomNum(0, 26);
  urlDatabase[newId] = req.body.longURL;
  const templateVars = { shortURL : newId, longURL: urlDatabase[newId]}
  
  res.redirect('/urls')
});// new user buttom debug!!! something got switched with here and urls_new


app.post("/urls/:shortURL/delete",(req, res) => {
  var shortURL = req.params.shortURL;
  
  delete urlDatabase[shortURL];
  
  res.redirect('/urls');
});
//deletebutton
  
  app.post("/urls/update/:shortUrl",(req, res) => {
    urlDatabase[req.params.shortURL] = req.body.longURL;
    console.log('here', req.body)
console.log('update/:sjpr')
    res.redirect('/urls');
    
    })// update button
   
    
  
  
app.get("/urls", (req, res) => {
  // console.log("/urls!")
  let templateVars = { urls: urlDatabase, cookie: req.cookies.username}
  res.render('urls_index', templateVars);

});//index page
  
app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const templateVars = { shortURL: shortURL, longURL: urlDatabase[shortURL], cookie: req.cookies.username };
console.log('/urls/:short');
  res.render("urls_show", templateVars);
});//dynamic shorturl page


app.get("/u/:shortURL", (req, res) => {
  let shorten = req.params.shortURL;
  
  const direction = { shortURL: shorten, longURL: urlDatabase[shorten]}
  
  res.redirect(direction.longURL);
});//redirectfunctioning

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}!`);
});// server

