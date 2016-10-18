var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/', function(req, res) {
    var imageFile;

    if (!req.files) {
        res.send('No files were uploaded.');
        return;
    }
    console.log(res.files);
    imageFile = req.files.imageFile;
    console.log(imageFile);
    // imageFile.mv('/somewhere/on/your/server/filename.jpg', function(err) {
    //     if (err) {
    //         res.status(500).send(err);
    //     }
    //     else {
    //         res.send('File uploaded!');
    //     }
    // });
});

module.exports = router;
