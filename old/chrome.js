var webdriver = require('selenium-webdriver'); // Karma Testrunner
var fs = require('fs');
var By = webdriver.By;
var until = webdriver.until;
var url = [ 'https://www.neps-data.de', 'http://google.de' ];
var driver = new webdriver.Builder().withCapabilities({ browserName: 'chrome' }).build();

let startDriver = function() {
	return new Promise(function(resolve, reject) {
		resolve();
		console.log('driver started');
	});
};

let getUrl = function(p) {
	return new Promise(function(resolve, reject) {
		resolve(driver.get('https://www.neps-data.de'));
		console.log('got URL');
	});
};

let maximize = function(p) {
	return new Promise(function(resolve, reject) {
		resolve(driver.manage().window().maximize());
		console.log('window maximized');
	});
};

let delCookies = function(p) {
	return new Promise(function(resolve, reject) {
		resolve(driver.manage().deleteAllCookies());
		console.log('cookies deleted');
	});
};

let writeScreenshot = function(data, name) {
	return new Promise(function(resolve, reject) {
		resolve();
		name = name || 'ss.png';
		var screenshotPath = 'C:UsersmrwcodingprojectsAutoWebsiteScreenshot';
		fs.writeFileSync(name, data, 'base64');
		console.log('screenshot written');
	});
};

let takeScreenshot = function(p) {
	return new Promise(function(resolve, reject) {
		resolve(
			driver.takeScreenshot().then(function(data) {
				writeScreenshot(data, 'SS_Chrome.png');
			})
		);
		console.log('screenshot taken');
	});
};

let quitDriver = function(p) {
	return new Promise(function(resolve, reject) {
		resolve(driver.quit());
		console.log('driver quit');
	});
};

startDriver()
	.then(function() {
		return maximize();
	})
	.then(function() {
		return delCookies();
	})
	.then(function() {
		return getUrl();
	})
	.then(function() {
		return takeScreenshot();
	})
	.then(function() {
		return quitDriver();
	});
