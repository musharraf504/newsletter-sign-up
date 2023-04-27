const express = require("express");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req,res){
    res.sendFile(__dirname+"/signUp.html");

});

app.post("/",function(req,res){
    const firstName = req.body.firstName;
    const secondName = req.body.secondName;
    const email = req.body.email;

    // console.log(firstName);
    // console.log(secondName);
    // console.log(email);

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields:{
                    FNAME:firstName,
                    LNAME:secondName
                }
            }
        ],
        update_existing: false
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us21.api.mailchimp.com/3.0/lists/c8e173e05a";

    const options = {
        method: "POST",
        auth: "musharraf:fd44a4b584d7d38bdd0290801a9ce876-us21"
    };

    const request = https.request(url, options, function(response){

        if (response.statusCode === 200) {
            res.sendFile(__dirname+"/success.html");
            // res.send("success");
          }
          else{
            res.sendFile(__dirname+"/failure.html");
            // res.send("something went wrong :(");
          }

        response.on("data",function(data){
            console.log(JSON.parse(data));
        });
    });
    request.write(jsonData);
    request.end();
});

app.post("/failure",function(req, res){
    res.redirect("/");
});

app.listen(process.env.PORT || 3000,function(){
    console.log("server has started at port 3000");
});

// API key
// c904c047c3ae9b880b906508bb1e43e4-us21 ---- revoked -----
// fd44a4b584d7d38bdd0290801a9ce876-us21 ---- new API key -----

// List/Audiance Id
// c8e173e05a 

// Endpoind for API
// https://us21.api.mailchimp.com/3.0/c8e173e05a
