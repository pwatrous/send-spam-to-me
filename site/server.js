var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');
var formidable = require('formidable');
var util = require('util');
var phantom = require('phantom');
var validator = require('validator');

var port = 1185;

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
  var uri = url.parse(req.url).pathname;
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
  var fields = {};
  var form = new formidable.IncomingForm();
  form.on('field', function (field, value) {
      fields[field] = value;
  });
  form.on('end', function () {
    fs.readFile('thank-you.html', function (err, data) {
      res.writeHead(200, {
          'Content-Type': 'text/html',
          'Content-Length': data.length
      });
      res.write(data);
      res.end();
    });
    var email = fields['email'];
    signUp(email);
  });
  form.parse(req);
}

// in last .then, do: "phInstance.exit()";
// in every other do "return phInstance.createPage();"
function signUp(email) {
  if (!validator.isEmail(email))
    return;
  console.log('registering email: ' + email);
  signUpForSite(email, 'http://www.crosswalk.com/newsletters/',
    'crosswalk.js');
  signUpForSite(email,
    'https://www.hillaryclinton.com/forms/om-hvf-join/?utm_medium=om2016&utm_source=gs&utm_campaign=lb-branded&utm_content=105583673051&utm_term=c&gclid=Cj0KEQjw3s6-BRC3kKL_86XDvq4BEiQAAUqtZxBrOsMz4SyoZcPzZ_M2HRmB_XY-ugY3xwx5_6ggVMEaAoI08P8HAQ',
    'hillary.js');
  signUpForSite(email, 'http://www.proflowers.com/blog/?ref=homenoref',
    'flowers.js');
  /*
  signUpForSite(email, 'https://www.donaldjtrump.com/',
    'trump.js');
  */
  /*signUpForSite(email, 'http://www.owletcare.com/mailing-list',
    'owletcare.js');*/
}

function signUpForSite(email, url, script) {
  var phInstance = null;
  phantom.create()
    .then(instance => {
      phInstance = instance;
      return instance.createPage();
    })
    .then(page => {
      // sign up for the site
      page.open(url);
      console.log('opened ' + url);
      page.evaluateJavaScript(setupInjectedScript(email, script));
      console.log('evaluated script');
      page.close();
      phInstance.exit();
      console.log('closed and exited phantom');
    })
    .catch(error => {
      console.log(error);
      phInstance.exit();
    });
}

function setupInjectedScript(email, script) {
  var raw = String(fs.readFileSync('injected-scripts/' + script));
  return raw.replace('%%EMAIL_ADDRESS%%', email);
}

server.listen(port);
console.log("server listening on " + port);