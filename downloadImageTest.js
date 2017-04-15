http = require('http');
fs = require('fs');
qs = require('querystring');
cmd=require('node-cmd');

 function getClientAddress(req) {
        return (req.headers['x-forwarded-for'] || '').split(',')[0] 
        || req.connection.remoteAddress;
};

function myCallBack(dataString) { //we will now format data into json object and send back to requester
  





}
//f=fs.createWriteStream('name.jpeg');
server = http.createServer( function(req, res) {

    //console.dir(req.param);

    if (req.method == 'POST') {
        console.log("POST");
        console.log('Incoming post from: ' + getClientAddress(req) );
        
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
              console.log(data);
              scrapperData += data;

              myCallBack(scrapperData);
            }
        );
        
        


        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end('post received');
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
//host = '192.168.1.7';
server.listen(port);
console.log('Listening at http://' +  ':' + port);