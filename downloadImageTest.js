http = require('http');
fs = require('fs');
qs = require('querystring');
cmd=require('node-cmd');
request = require('request');

 function getClientAddress(req) {
        return (req.headers['x-forwarded-for'] || '').split(',')[0] 
        || req.connection.remoteAddress;
};

function prettyClientAddress(nonPrettyString) {
    var index = 0;
    //console.log(nonPrettyString[index]);
    //console.log(nonPrettyString[index]>57);
    while(nonPrettyString[index]!=null && (nonPrettyString.charCodeAt(index)<48 || nonPrettyString.charCodeAt(index)>57)){
        //console.log("happens");
        index++;
    }
        
    //console.log(index);
    var ans = nonPrettyString.substring(index,nonPrettyString.length);


    return 'http://'+ans;
};

function myCallBack(numResponses,dataString,clientAddress) { //we will now format data into json object and send back to requester
    //console.log("begin post json object fun");

    var merchantsArr = new Array();
    var priceArr = new Array();
    var thumbnailsArr = new Array();
    var linksArr = new Array();
    var actProductName = '';

    var lineSplitData = dataString.split("\n");



    actProductName = lineSplitData[0];

    var forLoopLength = numResponses;
    var index = 1;
    for(var i = 0; i < forLoopLength; i++){
        //save thumbnail first
        //console.log('happens foor loop');
        thumbnailsArr.push(lineSplitData[index]);
        index++;
        linksArr.push(lineSplitData[index]);
        index++;
        priceArr.push(lineSplitData[index]);
        index++;
        merchantsArr.push(lineSplitData[index]);
        index++;
            
    }
    console.log('product result');
    console.log(actProductName);
    console.log('links:');
    for(var i = 0;i<linksArr.length;i++)
        console.log(linksArr[i]);
    console.log('prices:');
    for(var i = 0;i<linksArr.length;i++)
        console.log(priceArr[i]);
    console.log('merchants:');
    for(var i = 0;i<linksArr.length;i++)
        console.log(merchantsArr[i]);
    console.log('not printing thumbnails due to length');

    var json = JSON.stringify({ 
        prices: priceArr, 
        merchants: merchantsArr,
        thumbnails: thumbnailsArr,
        links: linksArr, 
        product: actProductName
    });

    return json;


    /*var options = {
      uri: 'https://www.googleapis.com/urlshortener/v1/url',//prettyClientAddress(clientAddress) //this will change to incoming ip address
      method: 'POST',
      json: {
        "product": actProductName
      }
    };

    request(options, function (error, response, body) {
        
      if (!error && response.statusCode == 200) {
        console.log("status code 1 hunnit x2");
      }
      if(error)
        console.log("error :(");
    });*/
    //console.log("done of function");
};
//f=fs.createWriteStream('name.jpeg');
server = http.createServer( function(req, res) {

    //console.dir(req.param);

    if (req.method == 'POST') {
        console.log("POST");
        console.log('Incoming post from: ' + prettyClientAddress(getClientAddress(req)) );
        
        var body = '';
        req.setEncoding('binary');
        //console.log(req.data);
        req.on('data', function (data) {
            //f.write(data);
            body+=data;
            //console.log("Partial body: " + body);

        });
        req.on('end', function () {
            fs.writeFile("body.png", body, 'binary', function(err){
              console.log("Saved pic.");
              //console.log(body);
            });
        
        });

        //remove write above. it will actually go to yaya's function. pass image path to scrapper function. 
        var yayaReturnURL = 'phantomjs googleScrapper.js ';



        //hardcode return value for now. instead will be method call
        yayaReturnURL += 'https://images-na.ssl-images-amazon.com/images/I/615UOznDLEL._UL1500_.jpg'

        var scrapperData ='';
        //console.log('before');
        cmd.get(
            yayaReturnURL,
            function(data){
              //console.log(data);
              scrapperData += data;

              var jsonResponse = myCallBack(5,scrapperData,getClientAddress(req));

              res.writeHead(200, {"Content-Type": "application/json"});
              res.end(jsonResponse);
            }
        );
        
        


        
        //server.close();
    }
    else
    {
        console.log("Non-Post request received");
        fs.readFile('body.png', function (err, content) {
            if (err) {
                res.writeHead(400, {'Content-type':'text/html'})
                console.log(err);
                res.end("No such image");    
            } else {
                //specify the content type in the response will be an image
                res.writeHead(200,{'Content-type':'image/jpg'});
                res.end(content);
            }
        });
    }

});

port = 3000;
//host = '127.0.0.0';
server.listen(port);
console.log('Listening on port ' + port);