var webdriver = require('selenium-webdriver');
var fs = require('fs');
var By = webdriver.By;
var until = webdriver.until;
var readline = require('readline-sync');
var filename = process.argv[2];
var browsers = [ 'firefox', 'chrome', 'internet explorer' ];
var LineByLineReader = require('line-by-line'),
	lr = new LineByLineReader('url.txt');

//set maxListeners
//process.setMaxListeners(0);

//reading URLs from file url.txt

lr.on('line', function(line) {
	lr.pause();
	for (let i = 0; i < browsers.length; i++) {
		takeimageofurl(line, browsers[i]);
	}
	setTimeout(function() {
		lr.resume();
	}, 20000);
});

/* readline
	.createInterface({
		input: fs.createReadStream(filename),
		terminal: false
	})
	.on('line', function(line) {
		for (let i = 0; i < browsers.length; i++) {
			takeimageofurl(line, browsers[i]);
		}
	}); */

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

/* let delCookies = function(driver) {
	return new Promise(function(resolve, reject) {
		driver.manage().deleteAllCookies();
		resolve(driver);
		console.log('cookies deleted');
	});
}; */

let writeScreenshot = function(data, name, url) {
	return new Promise(function(resolve, reject) {
		resolve();
		name = name || 'ss.png';
		var screenshotPath = 'C:UsersmrwcodingprojectsAutoWebsiteScreenshot';
		process.chdir(url.replace('http://', '').replace('https://', ''));
		console.log('The new working directory is ' + process.cwd());
		fs.writeFileSync(name, data, 'base64');
		process.chdir('../');
		console.log(name + ' screenshot written');
		console.log('Changing back to ' + process.cwd());
	});
};

let takeScreenshot = function(driver, browser, url) {
	return new Promise(function(resolve, reject) {
		fs.existsSync(url.replace('http://', '').replace('https://', '')) ||
			fs.mkdirSync(url.replace('http://', '').replace('https://', ''));
		driver.takeScreenshot().then(function(data) {
			writeScreenshot(
				data,
				url.replace('http://', '').replace('https://', '') + '_' + browser + '_' + Date.now() + '.png',
				url
			);

			resolve(driver);
		});
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
