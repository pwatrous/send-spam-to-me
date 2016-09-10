var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');
var formidable = require('formidable');
var util = require('util');

/*
Serving of root html page
*/
var server = http.createServer(function (req, res) {
    if (req.method.toLowerCase() == 'get') {
      serveHTML(req, res);
    } else if (req.method.toLowerCase() == 'post') {
      processFormFieldsIndividual(req, res);
    }
});

function serveHTML(req, res) {
  var uri = url.parse(req.url).pathname
  var filename = path.join(process.cwd(), uri);
  fs.exists(filename, function(exists) {
    if (!exists) {
      /*
      res.writeHead(404, {"Content-Type": "text/plain"});
      res.write("404 Not Found\n");
      res.end();
      */
      fs.readFile('404.html', function (err, data) {
        res.writeHead(404, {
          'Content-Type': 'text/html',
          'Content-Length': data.length
        });
        res.write(data);
        res.end();
      });
      return;
    }
    if (fs.statSync(filename).isDirectory()) filename += '/index.html';
    fs.readFile(filename, "binary", function(err, file) {
      if(err) {        
        res.writeHead(500, {"Content-Type": "text/plain"});
        res.write(err + "\n");
        res.end();
        return;
      }
      res.writeHead(200);
      res.write(file, "binary");
      res.end();
    });
  });
}

function displayForm(res) {
    fs.readFile('index.html', function (err, data) {
        res.writeHead(200, {
            'Content-Type': 'text/html',
                'Content-Length': data.length
        });
        res.write(data);
        res.end();
    });
}

function processFormFieldsIndividual(req, res) {
  var fields = [];
  var form = new formidable.IncomingForm();
  form.on('field', function (field, value) {
      console.log('field: ' + field + ' value: ' + value);
      fields[field] = value;
  });

  form.on('end', function () {
      res.writeHead(200, {
          'content-type': 'text/plain'
      });
      res.write('received the data:\n\n');
      res.end(util.inspect({
          fields: fields
      }));
  });
  form.parse(req);
}

server.listen(1185);
console.log("server listening on 1185");