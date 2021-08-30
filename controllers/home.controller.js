const mysql = require("mysql");
const key = require("../config/keys");
var admin = require("firebase-admin");
const uuid = require('uuid-v4');
var serviceAccount = require("../serviceAccountKey.json");
const options = {
    host: key.MYSQL_HOST,
    port:key.MYSQL_PORT,
    user: key.MYSQL_USER,
    password: key.MYSQL_PASSWORD,
    database: key.MYSQL_DATABASE
};

var connection = mysql.createConnection(options);


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "gs://assignment-324414.appspot.com"
});

var bucket = admin.storage().bucket();

exports.addUser=async(req,res)=>{
    const metadata = {
        metadata: {
          // This line is very important. It's to create a download token.
          firebaseStorageDownloadTokens: uuid()
        },
        contentType: 'image/png',
        cacheControl: 'public, max-age=31536000',
      };
      await bucket.upload(req.file.path, {
        // Support for HTTP requests made with `Accept-Encoding: gzip`
        public: true,
        destination: `uploads/hashnode/${req.file.filename}`,
        metadata: metadata,
      })
      .then(results=>{
          console.log("result-----------",results[4]);
          const metadata = results[0];
          let token=metadata.metadata.metadata.firebaseStorageDownloadTokens;
          let bucket1=metadata.bucket;
          let file_name=metadata.name;
          console.log("result============",metadata.metadata.metadata);
      
    console.log("file request is ", req.file,req.file.path);
    const {name,mobile,profile} = req.body;
    let data={};
    data.name=name;
    data.mobile=mobile;
    // data.profile=metadata.mediaLink;
    data.profile=`https://firebasestorage.googleapis.com/v0/b/${bucket1.id}/o/${(encodeURI(file_name)).replace(/\//g, "%2F")}?alt=media&token=${token}`;

    connection.query("INSERT INTO users SET ?", data, function(
        error,
        results,
        fields
      ) {
        if (error) {
          console.log(error);
          res.send({
            code: 400,
            failed: "error ocurred",
            error
          });
        } else {
            res.send({
                code: 200,
                msg:"User Registeration Successfull !"
            })
        }
    })
})
}

exports.getCount=async(req,res)=>{
    console.log("getting");
    connection.query("SELECT COUNT(*) As count from users",function (error, results, fields) {
          if (error) {
            console.log(error);
            res.send({
              code: 400,
              failed: "error ocurred",
            });
          } else {
              console.log(results)
              res.send({
                  code: 200,
                  msg:"successful !",
                  data: results
              })
          }
        })
}

exports.getUserByMobile=async(req,res)=>{
    const { mobile}=req.query;
    console.log(mobile)
    connection.query(
        `SELECT * from users where mobile='${mobile}'`,
        function (error, results, fields) {
          if (error) {
            console.log(error);
            res.send({
              code: 400,
              failed: "error ocurred",
            });
          } else {
              console.log(results)
            res.send({
                code: 200,
                msg:"successful !",
                 data: results
            })
            
          }
        })
}