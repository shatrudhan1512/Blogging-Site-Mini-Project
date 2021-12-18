const authorModels = require("../models/authorModel");
const jwt = require("jsonwebtoken");

//----------------------------------------------------------------------------------//
// This is the first api to create an author in database with email validation.

const createAuthor = async function (req, res) {
  try {
    let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let checkEmail = regex.test(req.body.email);

    if (checkEmail) {
      let myAuthor = req.body;
      let authorSaved = await authorModels.create(myAuthor);
      res.status(200).send({status:true, data: authorSaved });
    } else {
      res.status(400).send({status:false, message: "Please provide a Valid Email Id"});
    }
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

//----------------------------------------------------------------------------------//
// This is the login api of phase 2 for the authentication.

const doLogin = async function (req, res) {
  try {
    userEmail = req.body.email;
    userPassword = req.body.password;
    let user = await authorModels.findOne({
      email: userEmail,
      password: userPassword,
      isDeleted: false,
    });

    if (user) {
      let fname = user.fname;
      let lname = user.lname;
      let payload = { userId: user._id, email: user.email };
      const generatedToken = jwt.sign(payload, "Radium Star");
      res.status(200).send({
        message: fname + " " + lname + " you have logged in Succesfully",
        YourId: user._id,
        token: generatedToken,
      });
    } else {
      res.status(400).send({ status: false, message: "Oops...Invalid credentials" });
    }
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

//---------------------------------------------------------------------------------//

module.exports.createAuthor = createAuthor;
module.exports.doLogin = doLogin;