const bcrypt = require("bcrypt");
var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
//milddleware
const cookieSession = require("cookie-session");

// function seeCookies(req, res, next) {
//   console.log("cookies running:", req.headers.cookie);
//   // console.log(accounts["aJ48lW"].id);
//   next();
// }

// app.use(bcrypt)
// app.use(seeCookies)
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieSession({
  name: "session",
  keys: ["Random string"],
  maxAge: 24 * 60 * 60 * 1000
}));

app.set('view engine', 'ejs');


//routes
const accounts = {
  "aJ48lW": {
    id: "aJ48lW",
    email: "kylemcloughlin1000@hotmail.ca",
    password: "mugsy"
  },
  "b2xVn2": {
    id: "b2xVn2",
    email: "nigel_white@gmail.com",
    password: "spottedox"
  },
  "bridasd": {
    id: "bridasd",
    email: "jordan_hind@hotmail.com",
    password: "kenil"
  }
};

const urlDatabase = {
  "b6UTxQ": {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW"
  },
  "i3BoGr": {
    longURL: "https://www.google.ca",
    userID: "aJ48lW"
  },
  "qwxerty": {
    longURL: "http://www.jjjjound.com",
    userID: "b2xVn2"
  },
  "i3BoGr": {
    longURL: "https://www.ebay.com",
    userID: "aJ48lW"
  },
  "isdllee": {
    longURL: "https://www.netflix",
    userID: "bridasd"
  },
  "d35n4ts": {
    longURL: "https://www.msn.ca",
    userID: "bridasd"
  }

};


//helpper functions
function randomNum(min, max) {
  let letterBank = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "k", "L", "M", "n", "O", "P", "Q", "r", "S", "T", "u", "v", "W", "X", "y", "z"];
  let num = Math.round(Math.random() * (max - min) + min);
  let random = letterBank[num];
  for (let i = 0; i < 6; i++) {

    random += letterBank[Math.round(Math.random() * (max - min) + min)];

  }

  return random;
} //for new user

function emailComparer(element, users) {
  var emailArray = []
  var idArray = [];
  for (var email in accounts) {

    idArray.push(email)
  }

  for (var i = 0; i < idArray.length; i++) {
    if (users[idArray[i]].email == element) {
      return true;
    }

  }
  return false;
}

function userURLS(id, urlDatabase) {
  var personalURLS = {}
  for (var shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID == id) {
      personalURLS[shortURL] = urlDatabase[shortURL].longURL;

    }

  }
  return personalURLS;
}

function idShow(users, element) {
  var idArray = [];
  for (var id in accounts) {
    idArray.push(id)
  }
  for (var i = 0; i < idArray.length; i++) {

    if (`${accounts[idArray[i]].email} == ${element}`) {
      return `${idArray[i]}`;
    }

  }

}

app.get("/login", (req, res) => {

  let templateVars = {
    urls: urlDatabase,
    user: accounts[req.session.user_id]
  }
  res.render("loginPage", templateVars)

})

app.post("/register", (req, res) => {
  var randomId = randomNum(0, 6)
  if (!req.body.email || !req.body.password || emailComparer(req.body.email, accounts) === true) {
    res.send("404: invalid username or password, refresh and try again!!")
  } else
    accounts[randomId] = {
      id: `${randomId}`,
      email: `${req.body.email}`,
      password: bcrypt.hashSync(`${req.body.password}`, 1)
    }

  req.session.user_id = accounts[`${randomId}`].id;

  res.redirect("/urls")
})



app.get("/register", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    user: accounts[req.session.user_id]
  }


  res.render("registestration", templateVars)
})




app.post("/login", (req, res) => {
  var hashedPassword = bcrypt.hashSync(`${req.body.password}`, 1);
  var email = `${req.body.email}`;
  if (emailComparer(email, accounts) === false || !req.body.password) {
    res.send("404: invalid username or password, refresh and try again!!")
  } else {
    if (email === "kylemcloughlin1000@hotmail.ca" && bcrypt.compareSync("mugsy", hashedPassword)) {

      req.session.user_id = accounts["aJ48lW"].id;
    } else if (email === "nigel_white@gmail.com" && bcrypt.compareSync("spottedox", hashedPassword)) {
      req.session.user_id = accounts["b2xVn2"].id;
    } else if (email === "jordan_hind@hotmail.com" && bcrypt.compareSync("kenil", hashedPassword)) {
      req.session.user_id = accounts["bridasd"].id;
    } else {
      res.send("incorrect password or email! refresh and try again!!")
    }
  }


  res.redirect("/urls")

}) //login








app.post("/register", (req, res) => {
  if (emailComparer(req.body.email, accounts) == false) {

    req.session.user_id = req.body.user_id;
  }
  res.redirect("/urls")
}); //loginfunction 

app.post("/logout", (req, res) => {
  req.session = null
  console.log("logout")
  res.redirect("/urls")
}); //logout POST

app.get("/urls/new", (req, res) => {
  user = accounts[req.session.user_id];
  //   if (!user) {
  //     res.redirect('/login')
  // } else {
  var newId = randomNum(0, 26);
  // urlDatabase[newId] = req.body.longURL;
  const templateVars = {
    shortURL: newId,
    longURL: urlDatabase[newId],
    user: accounts[req.session.user_id]
  }
  console.log('"/urls/new')
  // var templateVars = urlDatabase;
  // }
  res.render('urls_new', templateVars);
}); // new user need to add random number 


app.post("/urls/new", (req, res) => {
  var newId = randomNum(0, 26);
  urlDatabase[`${newId}`] = {
    longURL: req.body.longURL,
    userID: req.session.user_id
  }
  const templateVars = {
    shortURL: newId,
    longURL: urlDatabase[newId],
    user: accounts[req.session.user_id]
  }

  res.redirect('/urls')
}); // new user buttom debug!!! something got switched with here and urls_new


app.post("/urls/:shortURL/delete", (req, res) => {
  var shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];

  res.redirect('/urls');
});
//deletebutton

app.post("/urls/update/:shortURL", (req, res) => {
  console.log("urls")
  urlDatabase[req.params.shortURL].longURL = req.body.longURL;
  res.redirect('/urls');

}) // update button//incorrect associated URL must debug



app.get("/urls", (req, res) => {
  console.log("/urls")
  console.log(req.session.user_id)
  let templateVars = {
    urls: userURLS(`${req.session.user_id}`, urlDatabase),
    user: accounts[req.session.user_id]
  }
  let user = accounts[req.session.user_id];
  if (user) {
    res.render('urls_index', templateVars);
  } else {
    res.redirect('/login');
  }
}); //index page

app.get("/urls/:shortURL", (req, res) => {
  console.log('/urls/:short');
  const shortURL = req.params.shortURL;
  console.log("hit", urlDatabase[shortURL].longURL);

  const templateVars = {
    shortURL: shortURL,
    longURL: urlDatabase[shortURL].longURL,
    user: accounts[req.session.user_id]
  };

  res.render("urls_show", templateVars);
}); //dynamic shorturl page


app.get("/u/:shortURL", (req, res) => {
  let shorten = req.params.shortURL
  console.log("/u/:shortURL")
  console.log(urlDatabase[shorten]);
  const direction = {
    shortURL: shorten,
    longURL: urlDatabase[shorten].longURL
  }
  res.redirect(direction.longURL);
}); //redirectfunctioning 

app.listen(PORT, () => {
  console.log(`tinyURL: Listening on port ${PORT}!`);
}); // server