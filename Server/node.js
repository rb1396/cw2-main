const express = require("express"); //This is the required express module libary.

const path = require("path"); //Required for finding the file path of the images/or any files.

const fs = require("fs"); //Gets the information about the files.

const MongoClient = require("mongodb").MongoClient; //This is part of the driver to connect to the mongoDB database.

const ObjectID = require("mongodb").ObjectID; //Unique Object ID for the Objects in the collection.

const bodyParser = require("body-parser");

 

const app = express(); //This is where the express app has been created by calling the express function.

 

//Start of the database

 

let db; //Declares the databse varible. Below, is the connection of the database.

//Connection link to the remote MongoDD Atlas with the username & password.

MongoClient.connect(

  "mongodb+srv://Rabbia:abc@cluster0.o2a3c.mongodb.net/test?authSource=admin&replicaSet=atlas-z2lv3v-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true",

  (err, client) => {

    //connecting the client with the database.

    db = client.db("learningApp"); // name of my Database.

  }

);

 

//This middleware is used for selecting a particular collection.

app.param("collectionName", (req, res, next, collectionName) => {

  req.collection = db.collection(collectionName); //this gets the collection name.

  return next();

});

 

const cors = require("cors"); //This allows to nable CORS with various options such as which has been blocked.

app.use(cors()); //Cors for crossing the origin allowances/domain requests e.g, Allow-Origin-Aceess.

 

//This GET route is used to GET this message on the server.

//This is a root message which directs the users to type a URL such as to select an Image file or a Collection.

app.get("/", (req, res, next) => {

  // the message will get below when the server is loaded.

  res.send(

    "Select a collection, e.g., /collection/collectionName or Select an Image, e.g., /ImageName.png"

  );

});

 

//A GET Route which retievs all the documents objects from the collection.

app.get("/collection/:collectionName", (req, res, next) => {

  req.collection.find({}).toArray((e, results) => {

    if (e) return next(e);

    //allow different IP address

    res.header("Access-Control-Allow-Origin", "*");

    //allow different header fields

    res.header("Access-Control-Allow-Headers", "*");

    res.send(results);

  });

});

 

//To extract the parameters from the request.

app.use(bodyParser.urlencoded({ extended: true })); //This middleware is used for parsing bodies from the URL.

app.use(bodyParser.json()); //This middleware is used for parsing the JSON Object.

 

//A POST Route Which saves the new Order to the Database. //The request body is the JSON Object which is being inserted to the DB.

app.post("/collection/:collectionName", (req, res, next) => {

  req.collection.insert(req.body, (e, results) => {

    if (e) return next(e);

    //allow different IP address

    res.send(results.ops);

  });

});

 

//A PUT Route which updates the number of available spaces in the ‘lesson’ collection.

//The request url requires the name of the collection and the ID of the object being updated.

app.put("/collection/:collectionName/:id", (req, res, next) => {

  req.collection.update(

    { _id: new ObjectID(req.params.id) },

    { $set: req.body }, //The set is used to update the whole JSON body of the document. On update it will replace the data.

    { safe: true, multi: false }, //Waiting for the execution before running the callback funcation, and only process 1st item.

    (e, result) => {

      if (e) return next(e); //1 means if the JSON Object found matches with the ObjectID else iy will rerun an error message.

      res.send(result.result.n === 1 ? { msg: "Updated" } : { msg: "Error" });

    }

  );

});

 

//End of the Database

 

//Start of Middleware for getting images.

 

//This is the Middleware Logger which outputs the request to the server.



 

//No next is required because this will be the last middleware.


 

//End of for getting images.

 

const port = process.env.PORT || 3000; //Identifes the PORT Number

app.listen(port); //The express server listens for the PORT Number.

console.log("App has started on port " + port); //Returns a message onto the console to alert that the serer has been sated on this port number.