var webdriver = require('selenium-webdriver'); // Karma Testrunner
var fs = require('fs');
// var async = require('async');

var By = webdriver.By;
var until = webdriver.until;
var url = [ 'https://www.neps-data.de', 'http://google.de' ];
var driver = new webdriver.Builder().forBrowser('chrome').build();

// open Firefox

// maxmimazie the window
driver.manage().window().maximize();

// delete all cookies
driver.manage().deleteAllCookies();

//navigate to website
driver.get(url[i]);
console.log('driver.get = ' + url[i]);

//taking screenshot
driver.takeScreenshot().then(function(image, err) {
	fs.writeFileSync(url[i] + '.png', image, 'base64', function(err) {
		console.log(err);
	});
	console.log(__dirname + '/' + url[i] + '.png');
});

//close broswer
//driver.quit();

console.log(url.length + ' Screenshot(s) taken');
