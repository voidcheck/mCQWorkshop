var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/xmlFile',( req,res,next)=> {
  try {
  res.set('Content-Type', 'text/xml');
  const data = fs.readFileSync(path.join(__dirname,'..','/assessment.xml'));
  return res.send(data);
  } catch (err) {
    console.log(err);
  }
})
module.exports = router;
