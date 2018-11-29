var webdriver = require('selenium-webdriver'); // Karma Testrunner
var fs = require('fs');
var By = webdriver.By;
var until = webdriver.until;
var urls = new Array();

//urls einlesen
var fs = require('fs');
var readline = require('readline');
var filename = process.argv[2];
var browsers = [ 'internet explorer' ];

readline
	.createInterface({
		input: fs.createReadStream(filename),
		terminal: false
	})
	.on('line', function(line) {
		console.log('Line: ' + line);

		for (let i = 0; i < browsers.length; i++) {
			takeimageofurl(line, browsers[i]);
		}
	});

let startDriver = function(browser) {
	return new Promise(function(resolve, reject) {
		resolve(new webdriver.Builder().withCapabilities({ browserName: browser }).build());
		console.log(browser + ' started');
	});
};

let getUrl = function(driver, url) {
	return new Promise(function(resolve, reject) {
		driver.get(url).then(function() {
			resolve(driver);
		});
	});
};

let maximize = function(driver) {
	return new Promise(function(resolve, reject) {
		driver.manage().window().maximize().then(function() {
			resolve(driver);
		});
	});
};

let delCookies = function(driver) {
	return new Promise(function(resolve, reject) {
		driver.manage().deleteAllCookies();
		resolve(driver);
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

let takeScreenshot = function(driver, browser, url) {
	return new Promise(function(resolve, reject) {
		driver.takeScreenshot().then(function(data) {
			writeScreenshot(
				data,
				url.replace('http://', '').replace('https://', '') + '_' + browser + '_' + Date.now() + '.png'
			);
			resolve(driver);
		});

		console.log('screenshot taken');
	});
};

let quitDriver = function(driver) {
	return new Promise(function(resolve, reject) {
		resolve(driver.quit());
		console.log('driver quit');
	});
};

var takeimageofurl = function(url, browser) {
	startDriver(browser)
		.then(function(driver) {
			return maximize(driver);
		})
		.then(
			function(driver) {
				console.log(url + ' <- url');
				return getUrl(driver, url);
			}.bind(url)
		)
		.then(function(driver) {
			return takeScreenshot(driver, browser, url);
		})
		.then(function(driver) {
			return quitDriver(driver);
		});
};
