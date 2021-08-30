const express = require("express");
const router = express.Router();
const multer = require("multer");
var upload = multer({ dest: '/tmp/uploads/' })
// CHANGE: The path to your service account
const HomeController = require("../controllers/home.controller")



// var filename = "./tmp/image/image.png"

var Storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './tmp/uploads')
      },
      filename: function (req, file, cb) {
          cb(null, file.originalname)
      }
});
  
//   var upload = multer({
//     storage: Storage,
//   });


  

  router.post("/register", upload.single("file"),HomeController.addUser);
//   router.post("/register", uploadFile,HomeController.addUser);
  router.post("/count",HomeController.getCount);
  router.post("/search",HomeController.getUserByMobile);

module.exports = router; 