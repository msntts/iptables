const proc = require('child_process');
const fs = require("fs");
const url = require("url");
const pam = require('authenticate-pam');

module.exports = {
	authUsers: {}, // last authentication time is stored
	
	settingsDir: "/etc/iptables/config.json",
	_settings: {
		savePath: "/etc/iptables/rules.save"
	},
	
	loadSettings: function() {
		try {
			fs.readFile(module.exports.settingsDir, [], function (err, data) {
				// Restore new settings after load from file
				var s = module.exports._settings;
				module.exports._settings = JSON.parse(data);
				for (var key in s) {
					if (!module.exports._settings[key]) {
						module.exports._settings[key] = s[key];
					}
				}

				console.log("Load settings from " + module.exports.settingsDir);
			});
		} catch (e) { /* do nothing */ }
	},
	
	saveSettings: function() {
		fs.writeFile(this.settingsDir, JSON.stringify(this._settings), function(err) {
			if(err) {
				return console.log(err);
			}

			console.log("The file was saved!");
		});
	},
	
	index: function(req, res) {
		fs.readFile('./tpl/index.html', [], function(err, data) {
			//res.writeHead(320, {"Content-Type": "text/plain"});
			res.end(data);
		});
	},
	
	showChannel: function(req, res) {
		var query = url.parse(req.url).query;
		var args = new URLSearchParams(query);

		var run = "iptables -t " + args.get("t") + " -S " + args.get("c").toUpperCase();
		proc.exec(run, function(error, stdout, stderr) {
			var arr = stdout.split("\n");
			
			res.setHeader("Content-Type", "text/plain");
			res.end(JSON.stringify(arr));
		});
	},
	
	deleteRule: function(req, res) {
		var query = url.parse(req.url).query;
		var args = new URLSearchParams(query);
		
		proc.exec("iptables -t " + args.get("t") + " -D " + args.get("c").toUpperCase() + " " + args.get("i"), function(error, stdout, stderr) {
			module.exports.showChannel(req, res);
		});
	},
	
	insertRule: function (req, res) {
		var body = '';
	    req.on('data', function (data) {
	        body += data;
	    });
	    req.on('end', function () {
	        var post = new URLSearchParams(body);
	        
	        var rule = post.get('rule');
	        console.log(rule);
	    	proc.exec("iptables " + rule, function(error, stdout, stderr) {
	    		if(stderr) {
	    			res.end(stderr);
	    		}
	    		else {
	    			module.exports.showChannel(req, res);
	    		}
	    	});
	    });
	},
	
	monitor: function(req, res) {
		var query = url.parse(req.url).query;
		var args = new URLSearchParams(query);

		var run = "iptables -t " + args.get("t") + " -L " + args.get("c").toUpperCase() + " -vn";
		proc.exec(run, function(error, stdout, stderr) {
			var arr = stdout.split("\n");
			
			res.writeHead(200, {"Cache-Control": "no-cache", "Content-Type" : "text/plain"});
			res.end(JSON.stringify(arr));
		});
	},
	
	chainList: function(req, res) {
		var new_arr = [];
		var n = 0;
		
		proc.exec("iptables -S", function(error, stdout, stderr) {
			var arr = stdout.split("\n");
			
			var n = 0;
			for(var i = 0; i < arr.length; i++) {
				var item = arr[i];
				if(item.indexOf("-N") === 0) {
					new_arr[n++] = item.substring(3) + " (filter)";
				}
			}
			
			proc.exec("iptables -t nat -S", function(error, stdout, stderr) {
				var arr = stdout.split("\n");

				for(var i = 0; i < arr.length; i++) {
					var item = arr[i];
					if(item.indexOf("-N") === 0) {
						new_arr[n++] = item.substring(3) + " (nat)";
					}
				}

				proc.exec("iptables -t mangle -S", function(error, stdout, stderr) {
					var arr = stdout.split("\n");

					for(var i = 0; i < arr.length; i++) {
						var item = arr[i];
						if(item.indexOf("-N") === 0) {
							new_arr[n++] = item.substring(3) + " (mangle)";
						}
					}
					
					res.setHeader("Content-Type", "text/plain");
					res.end(JSON.stringify(new_arr));
				});
			});
		});
	},
    
    save: function(req, res) {
        proc.exec("iptables-save > " + module.exports._settings.savePath, function(error, stdout, stderr) {

			res.setHeader("Content-Type", "text/plain");
			res.end(stderr);
		});
    },
    
    load: function(req, res) {
        proc.exec("iptables-restore < " + module.exports._settings.savePath, function(error, stdout, stderr) {

			res.setHeader("Content-Type", "text/plain");
			res.end(stderr);
		});
    },
	
	settings: function(req, res) {
		var query = url.parse(req.url).query;
		var args = new URLSearchParams(query);
		
		if(args.get("c") === "save") {
            var body = '';
            req.on('data', function (data) {
                body += data;
            });
            req.on('end', function () {
                var post = new URLSearchParams(body);
                var data = post.get("data");
                
                module.exports._settings = JSON.parse(data);
                module.exports.saveSettings();
            });
			res.end();
		}
		else {
			var themes = [];
			var items = fs.readdirSync("./tpl/theme");
			for (var item of items) {
				themes.push(item.substring(0, item.length-4));
			}
			module.exports._settings.themes = themes;

			res.setHeader("Content-Type", "text/plain");
			res.end(JSON.stringify(module.exports._settings));
		}
	},
	
	authMe: function(req, res) {
		var pathname = url.parse(req.url).pathname;
		
		if(pathname === "/login") {
			var body = '';
			req.on('data', function (data) {
				body += data;
			});
			req.on('end', function () {
				var post = new URLSearchParams(body);
				var login = post.get("login");
				var pass = post.get("pass");

				pam.authenticate(login, pass, function(err) {
					if(err) {
						res.end(err);
					}
					else {
						var ip = req.connection.remoteAddress;
						module.exports.authUsers[ip] = Date.now();
						res.writeHead(301, {"Location": "/"});
						res.end();
					}
				  });
			});
		}
		else {
			res.writeHead(301, {"Location": "auth.html", "Cache-Control": "no-cache"});
			res.end();
		}
	},
	
	isAuth: function(req) {
		var ip = req.connection.remoteAddress;

		// authentication token is expired when spend 1 hour from last sign in
		var elapsedTime = Date.now() - module.exports.authUsers[ip]; // milli seconds
		var period = (60 * 60 * 1000);

		return (module.exports.authUsers[ip] !== null) && (period > elapsedTime);
	},

	logout: function(req, res) {
		var ip = req.connection.remoteAddress;
		module.exports.authUsers[ip] = null;
		res.writeHead(301, {"Location": "auth.html", "Cache-Control": "no-cache"});
		res.end();
	},
	
	userList: function(req, res) {
		for(var ip in module.exports.authUsers) {
			res.write("IP: " + ip + " " + (module.exports.authUsers[ip] ? "auth" : "none"));
		}
		res.end();
	}
};

module.exports.loadSettings();