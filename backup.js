var fbapp = require('./fb_app');
var FacebookClient = require('facebook-client').FacebookClient;
var http = require('http');
var urltool = require('url');
var client = new FacebookClient(fbapp.id, fbapp.secret, {'timeout': 10000});

//file stream
var fs = require('fs');
var writeStream = fs.createWriteStream('./h-all-feed.txt');

//temp 1695585164213120115162221887616
var url = '/';
var path = '/feed';
var access_token = 'YEA OK';
var holder = "";

function parseParams(url){
	return urltool.parse(url, true).query;
}
function isEmpty(map) {
   for(var key in map) {
      if (map.hasOwnProperty(key)) {
         return false;
			}
   return true;
	}
}
var feedPages = 0;
function request(url, path, params){
		switch (path){
			case '/feed':
					client.graphCall(url+path, params, 'GET')(function(result){
								if(result && result.data && !isEmpty(result.data) && result.paging && !isEmpty(result.paging) ){
									//console.log("\nReceived page: " + feedPages++);
									holder = holder + "\n PAGE " + feedPages+"\n\n" + JSON.stringify(result.data);
									//console.log("\nNext page: " + result.paging.next);
									var new_params = parseParams(result.paging.next);
									//console.log("\nNew params: " + JSON.stringify(new_params));
									request(url, path, new_params);
								}
								else{
										console.log("total pages of 25 posts each:" +  feedPages);
										writeStream.write(holder);
								}
							});
					break;
			default:
					console.log('No path was specified.');
		}
}
writeStream.on('error', function (err) {
        console.log(err);
});

//call request
request(url, path, {'access_token': access_token} );
