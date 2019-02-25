const bcrypt = require("bcrypt");
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
//milddleware
const cookieSession = require("cookie-session");

function seeCookies(req, res, next) {
  console.log("cookies running:", req.headers.cookie);
  next();
}

// app.use(bcrypt)
app.use(seeCookies)
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
  "i3BiGr": {
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


//helper functions
function randomNum(min, max) {
  let letterBank = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "k", "L", "M", "n", "O", "P", "Q", "r", "S", "T", "u", "v", "W", "X", "y", "z"];
  let num = Math.round(Math.random() * (max - min) + min);
  let random = letterBank[num];
  for (let i = 0; i < 6; i++) {

    random += letterBank[Math.round(Math.random() * (max - min) + min)];

  }

  return random;
} //for new user

function cookieHelper(element, users) {
  let idArray = [];
  for (var email in accounts) {

    idArray.push(email);
  }

  for (var i = 0; i < idArray.length; i++) {
    if (users[idArray[i]].email == element) {
      return users[idArray[i]].id ;
    }

  }
  return false;
}

function passwordComparer(element, users) {

  let idArray = [];
  for (var email in accounts) {

    idArray.push(email);
  }

  for (var i = 0; i < idArray.length; i++) {
    if (users[idArray[i]].email == element) {
      return users[idArray[i]].password;
    }

  }
  return false;
}
function emailComparer(element, users) {

  let idArray = [];
  for (var email in accounts) {

    idArray.push(email);
  }

  for (var i = 0; i < idArray.length; i++) {
    if (users[idArray[i]].email == element) {
      return true;
    }

  }
  return false;
}

function userURLS(id, urlDatabase) {
  const personalURLS = {};
  for (var shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID == id) {
      personalURLS[shortURL] = urlDatabase[shortURL].longURL;

    }

  }
  return personalURLS;
}

function idShow(users, element) {
  let idArray = [];
  for (var id in accounts) {
    idArray.push(id);
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
  };
  res.render("loginPage", templateVars);

});

app.post("/register", (req, res) => {
  let randomId = randomNum(0, 6);
  if (!req.body.email || !req.body.password || emailComparer(req.body.email, accounts) === true) {
    res.send("404: invalid username or password, refresh and try again!!");
  } else
    accounts[randomId] = {
      id: `${randomId}`,
      email: `${req.body.email}`,
      password: `${req.body.password}`
    };
   console.log(emailComparer(req.body.email, accounts))
  req.session.user_id = accounts[`${randomId}`].id;

  res.redirect("/urls");
});



app.get("/register", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    user: accounts[req.session.user_id]
  };


  res.render("registestration", templateVars);
});




app.post("/login", (req, res) => {
  let hashedPassword = bcrypt.hashSync(`${req.body.password}`, 1);
  let email = `${req.body.email}`;
  if (emailComparer(email, accounts) == false || !req.body.password) {
    res.send("404: invalid username or password, refresh and try again!!");
  } 
  else if (bcrypt.compareSync(passwordComparer(email, accounts), hashedPassword)) {
     req.session.user_id = cookieHelper(email, accounts);
  } else {
     
    res.send("incorrect password or email! refresh and try again!!");

  }
  res.redirect("/urls");

}); //login





app.post("/register", (req, res) => {
  if (emailComparer(req.body.email, accounts) == false) {

    req.session.user_id = req.body.user_id;
  }
  res.redirect("/urls");
}); //registester a user

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
}); //logouts out a user

app.get("/urls/new", (req, res) => {
  user = accounts[req.session.user_id];
  var newId = randomNum(0, 26);
  const templateVars = {
    shortURL: newId,
    longURL: urlDatabase[newId],
    user: accounts[req.session.user_id]
  };
  res.render('urls_new', templateVars);
}); // new user need to add random number 


app.post("/urls/new", (req, res) => {
  var newId = randomNum(0, 26);
  urlDatabase[`${newId}`] = {
    longURL: req.body.longURL,
    userID: req.session.user_id
  };
  let templateVars = {
    shortURL: newId,
    longURL: urlDatabase[newId],
    user: accounts[req.session.user_id]
  };

  res.redirect('/urls');
}); 


app.post("/urls/:shortURL/delete", (req, res) => {
  let shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];

  res.redirect('/urls');
});
//deletebutton

app.post("/urls/update/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL].longURL = req.body.longURL;
  res.redirect('/urls');

}); // update button//incorrect associated URL must debug



app.get("/urls", (req, res) => {
  let templateVars = {
    urls: userURLS(`${req.session.user_id}`, urlDatabase),
    user: accounts[req.session.user_id]
  };
  let user = accounts[req.session.user_id];
  if (user) {
    res.render('urls_index', templateVars);
  } else {
    res.redirect('/login');
  }
}); //index page

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  let templateVars = {
    shortURL: shortURL,
    longURL: urlDatabase[shortURL].longURL,
    user: accounts[req.session.user_id]
  };
  let user = accounts[req.session.user_id];
  if (user) {
    res.render("urls_show", templateVars);
  } else {
    res.redirect('/login');
  }
}); // dynamic  individual shortURL page


app.get("/u/:shortURL", (req, res) => {
  
  let shorten = req.params.shortURL;
  const direction = {
    shortURL: shorten,
    longURL: urlDatabase[shorten].longURL
  };
  res.redirect(direction.longURL);
}); //redirects to long url

app.listen(PORT, () => {
  console.log(`tinyURL: Listening on port ${PORT}!`);
}); // server port:8080