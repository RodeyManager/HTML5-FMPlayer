var express = require('express');
var request = require('request');
var fs 		= require('fs');
var router 	= express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  	//res.render('index', { title: 'Express' });
  	var url = req.query.musicURL;
  	console.log(url);
  	//请求源
    var rq = request({uri: url}, function(error, response, body){
    	if(!error && response.statusCode == 200){
    		//写入文件, 以便好分析
    		fs.writeFile('./temp/temp.mp3', body, function (err) {
			   	if (err) throw err;
			  	console.log('It\'s saved!');
			});
    		res.send('temp.mp3');
    	}else{
    		res.send('{"code": "601", "message": "no nothing news <::>  !"');
    	}
    });
  
});

module.exports = router;
