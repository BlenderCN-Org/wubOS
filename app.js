var express = require('express');
var app = express();
var fs = require("fs");
var jade = require('jade');
/*
var options = {
	key: fs.readFileSync('key.pem'),
	cert: fs.readFileSync('cert.cert')
};*/
var https = require('http').Server(app);
//var https = require('http'/*s*/).Server(/*options,*/app);
var io = require('socket.io')(https);
var path = require('path');
var bodyParser = require('body-parser');
var util = require("util");
var mime = require('mime');
//var multer = require('multer');
var formidable = require('formidable');
var fse = require('fs-extra');
var session = require('express-session');
var sharedsession = require("express-socket.io-session");
var device = require('express-device');
var xml2js = require('xml2js');
var progress = require('progress-stream');
var clear = require('clear');
var User = require('./public/serverjs/user.js');
var copyObject = require('./public/serverjs/copyObject.js');
var fsBaseDir = './usuarios/';
var sha1 = require('sha1');
var request = require('request');

//var geoip = require('geoip-lite');
var hat = require('hat');
var extract = require('meta-extractor');
var fileType = require('file-type');
var protocolHTTP = require('http');
var protocolHTTPS = require('https');
var firebase = require('firebase');
var admin = require("firebase-admin");
var base64 = require('file-base64');

var cursession = session({ secret: 'zasca', cookie: { maxAge: null }, resave: true, saveUninitialized: true });

app.use(cursession);

//richexplorer
var config = require(__dirname + '/public/apps/richexplorer/config/filemanager.config.json');
app.get('/apps/richexplorer/', function(req, res){
	const mode = req.query.mode;
	
	//console.log('mode:' + mode);
	const path = req.query.path;
	var userName = req.session.user;
	if(!userName)
	{
		respond(res, {Code: 0});
		return;
	}
	//console.log("rE:" + userName);
	if(!mode)
		res.sendFile('C:/xampp/htdocs/RichFilemanager/index.html');
		else

	switch (mode.trim()) {
		case 'initiate':
			respond(res, JSON.parse('{"data":{"id":"\/","type":"initiate","attributes":{"config":{"security":{"readOnly":false,"extensions":{"policy":"DISALLOW_LIST","ignoreCase":true,"restrictions":[]}},"upload":{"fileSizeLimit":16000000},"viewer":{"absolutePath":null,"previewUrl":"http://'+req.headers.host+'/files/'+userName+'/"}}}}}'));
		break;
		case 'getinfo':
			parsePath(path, (pp) => {
				getinfo(pp, (result) => {
					respond(res, {data: result});
				});// getinfo
			}, userName);// parsePath
		break;
		case 'readfolder':
			parsePath(path, (pp) => {
				readfolder(pp, (result) => {
					respond(res, {data: result});
				}, userName);// readfolder
			}, userName);// parsePath
			break;
		case 'getimage':
			parsePath(path, (pp) => {
				res.sendFile(paths.resolve(pp.osFullPath));
			}, userName);// parsePath
			break;
		case 'readfile':
			parsePath(path, (pp) => {
				res.sendFile(paths.resolve(pp.osFullPath));
			}, userName);// parsePath
			break;
		case 'download':
			parsePath(path, (pp) => {
				res.setHeader('content-type', 'text/html; charset=UTF-8');
				res.setHeader('content-description', 'File Transfer');
				res.setHeader('content-disposition', 'attachment; filename="' + pp.filename + '"');
				res.sendFile(paths.resolve(pp.osFullPath));
			}, userName);// parsePath
			break;
		case 'addfolder':
			parsePath(path, (pp) => {
				addfolder(pp, req.query.name, (result) => {
					respond(res, {data: result});
				}, userName);// addfolder
			}, userName);// parsePath
			break;
		case 'delete':
			parsePath(path, (pp) => {
				deleteItem(pp, (result) => {
					respond(res, {data: result});
				});// parsePath
			}, userName);// parsePath
			break;
		case 'rename':
			parsePath(req.query.old, (opp) => {
				const newPath = paths.posix.parse(opp.uiPath).dir;
				const newish = paths.posix.join(newPath, req.query.new);

				parseNewPath(newish, (npp) => {
					rename(opp, npp, (result) => {
						respond(res, {data: result});
					});// rename
				}, userName);// parseNewPath
			}, userName);// parsePath
			break;
		case 'move':
			parsePath(req.query.old, (opp) => {
				parseNewPath(paths.posix.join('/', req.query.new, opp.filename), (npp) => {
					rename(opp, npp, (result) => {
						respond(res, {data: result});
					});// rename
				}, userName);// parseNewPath
			}, userName);// parsePath
			break;
		case 'copy':
			parsePath(req.query.source, (opp) => {
				parseNewPath(paths.posix.join('/', req.query.target, opp.filename), (npp) => {
					copy(opp, npp, (result) => {
						respond(res, {data: result});
					});// rename
				}, userName);// parseNewPath
			}, userName);// parsePath
			break;
		default:
			// eslint-disable-next-line no-console
			console.log('no matching GET route found with mode: \'', mode.trim(), '\' query -> ', req.query);
			respond(res, {Code: 0});
	}// switch
});// get

/*app.post('/apps/richexplorer/', function(req, res){
	console.log(req);
	const mode = req.body.mode;
	const path = req.body.path;
	var userName = req.session.user;
	if(!userName)
	{
		respond(res, {Code: 0});
		return;
	}
	switch (mode.trim()) {
		case 'upload':
			parsePath(req.body.path, (pp) => {
				savefiles(pp, req.files, (result) => {
					respond(res, {data: result});
				});// savefiles
			});// parsePath
			var form = new formidable.IncomingForm();
			form.on('field', function(name, value) {
				console.log(name, value);
			});
		break;
		case 'savefile':
			parsePath(path, (pp) => {
				getinfo(pp, (result) => {
				fs.writeFile(paths.resolve(pp.osFullPath), req.body.content, (error) => {
					if (error) {
						res.status(500).send(error);
					}
					fs.readFile(paths.resolve(pp.osFullPath), (err, f) => {
					if (err) {
						res.status(500).send(err);
					}
					result.attributes.content = f.toString();
						respond(res, {data: result});
					});
				});
			});// getinfo
		});// parsePath
			break;
		default:
			// eslint-disable-next-line no-console
			console.log("no matching POST route found with mode: '", mode.trim(), '\' query -> ', req.query);
			respond(res, {Code: 0});
	}// switch
}); // post*/

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true }));
app.use(device.capture());
app.use(bodyParser.json());

io.use(sharedsession(cursession, {
	autoSave:true
}));

//html2canvas imageproxy
var proxy = require('html2canvas-proxy');
app.use("/proxy", proxy());
////////////////////////////////////////////////////////////////////////

app.get("/", function(req, res){
	/*console.log(req.device.type);
	console.log(req.sessionID);*/
	if (/mobile/i.test(req.headers['user-agent']))
	{
		res.sendFile(path.join(__dirname, 'public/views/incompatibleDevice.html'));
	}
	else
		if(req.session.user && connectUsers[req.session.user])
		{
			res.sendFile(path.join(__dirname, 'public/views/alreadyLogin.html'));
		}
		else if(req.session.isOpen)
		{
			res.sendFile(path.join(__dirname, 'public/views/multipleInstance.html'));
		}
		else
		{
			if(req.session.user)
			{
				req.session.destroy();
				console.log("Reset sesion");
			}
			res.sendFile(path.join(__dirname, 'public/views/index.html'));
			//res.render(path.join(__dirname, 'public/views/download.jade'));
		}
});

app.post('/checkLogin',function(req, res){
	if(req.body.user == req.session.user 
		&& connectUsers[req.body.user] 
		&& connectUsers[req.body.user].checkLogIn(req.body.authToken))
	{
		res.status(200).send('ok');
	}
	else
		res.status(401).send('Not auth');
});

app.post('/upload',function(req, res){
	var form = new formidable.IncomingForm();
	var targetDir = null;
	var userFTP = null;
	var curUser = null;
	form.parse(req);
	
	form.on('field', function(name, value) {
		switch(name)
		{
			case "userFTP":
				userFTP = value;
			break;
			case "userFTPAuthToken":
				curUser = getUserByAuthToken(value);
			break;
			case "directoryFTP":
				targetDir  = path.join(fsBaseDir, value);
			break;
			default:
				console.log(name+": "+value+"\n");
			break;
		}
	});
	
	form.on('fileBegin', function (name, file){
		var realPath = targetDir;
		if((curUser != null && curUser.isOwner(realPath)) || (req.session.user && connectUsers[req.session.user] && connectUsers[req.session.user].isOwner(realPath)))
		{
			try
			{
				if(!fs.statSync(realPath).isDirectory())
				{
					console.log("Not propety:" + targetDir);
					return false;
				}
			}
			catch(e)
			{
				console.log("Not exist:" + targetDir);
				return false;
			}
		}
		else
		{
			console.log("Fail login");
			return false;
		}
		file.path = targetDir + '/' + file.name;
		console.log(file.path);
	});
	
	/*form.on('progress', function(bytesReceived, bytesExpected) {
		console.log('Progress so far: '+(100*(bytesReceived/bytesExpected))+"%");
	});*/
	
	form.on('file', function (name, file){
		console.log('Uploaded ' + file.name);
		var files = loadDir(userFTP ,fsBaseDir + userFTP);
		io.sockets.in(userFTP).emit('explorer', JSON.stringify(files));
	});
	
	form.on('error', function(err) {
		console.log('Uploaded ERROR!');
		res.end();
	});
	
	form.on('end', function() {
		res.end();
	});
	
	form.on('aborted', function() {
		console.log('Uploaded ABORTED!');
		res.end();
	});
});

app.post("/download/files/*:file(*)", function(req, res){
	//console.log(req.query);
	//console.log(req.body);
	//console.log("post download: " + req.body.fileName);
	var file = req.body.fileFullPath;

	/*var filename = encodeURI(req.body.fileName);
	var mimetype = mime.lookup(file);

	res.setHeader('Content-disposition', 'attachment; filename=' + filename);
	res.setHeader('Content-type', mimetype);

	var filestream = fs.createReadStream(file);
	filestream.pipe(res);*/
	var token = req.body.authToken;
	var file = path.join(fsBaseDir, req.url.replace('/download/files/', ''));
	var curUser = getUserByAuthToken(token);
	if(curUser != null && curUser.isOwner(file) && fs.existsSync(file))
		res.download(file);
	else
		res.status(404).send('Not found');
});

app.get("/download/files/*:file(*)", function(req, res){
	var token = req.query.authToken;
	//isOwner??
	var file = path.join(fsBaseDir, decodeURIComponent(req._parsedOriginalUrl.pathname).replace('/download/files/', ''));
	var curUser = null;
	if(token)
		curUser = getUserByAuthToken(token);
	if(curUser != null)
	{
		if(curUser.isOwner(file))
		{
			if(fs.existsSync(file))
				res.download(file);
			else
				res.status(404).send('Not found');
		}
		else
		{
			res.status(401).send('Not auth file');
		}
	}
	else if(req.session.user && connectUsers[req.session.user])
	{
		if(connectUsers[req.session.user].isOwner(file))
		{
			if(fs.existsSync(file))
				res.download(file);
			else
				res.status(404).send('Not found');
		}
		else
		{
			res.status(401).send('Not auth file');
		}
	}
	else
		res.status(401).send('Not auth');
});

app.post("/uploadFileContent",function(req, res){
	console.log("uploadContent");
	//login?
	if(req.body.fileFullName && req.body.content)
	{
		console.log(path.join(fsBaseDir, decodeURIComponent(req.body.fileFullName).replace('/files/', '')));
		fs.writeFile(path.join(fsBaseDir, decodeURIComponent(req.body.fileFullName).replace('/files/', '')), decodeURIComponent(req.body.content), function (err,data) {
			if (err) {
				return console.log(err);
			}
			//socket
		});
		res.end("File uploaded.");
	}
	else
		res.end("Error");
});

app.post("/uploadFileContentB64",function(req, res){
	//login?
	if(req.body.fileFullName && req.body.content)
	{
		var defFileFullName = path.join(fsBaseDir, decodeURIComponent(req.body.fileFullName).replace('/files/', ''));
		var dataString = req.body.content;
		var data = dataString.replace(/^data:.*\/\w+;base64,/, "");
		/*var buf = new Buffer(data, 'base64');
		fs.writeFile(defFileFullName, buf);*/
		base64.decode(data, defFileFullName, function(err, output) {
			if(err)
				console.log(err);
			else
				console.log('success');
		});
		//socket
	}
});

app.get("/ping", function(req,res){
	res.send('ok');
});

app.get("/mimetype", function(req, res){
	if(req.query.url)
	{
		try
		{
			var url = decodeURIComponent(req.query.url);
			var prtcl = (url.indexOf('https')== 0)?protocolHTTPS:protocolHTTP;
			prtcl.get(url, resp => {
				resp.once('data', chunk => {
					try
					{
						resp.destroy();
						var ft = fileType(chunk);
						var ext = (ft)?ft.ext:mime.extension(mime.lookup(url));
						//console.log(ext);
						res.send(ext);
					}
					catch(e2)
					{
						res.status(400).send('Bad Request');
					}
				});
			});
		}
		catch(e)
		{
			res.status(400).send('Bad Request');
		}
	}
	else
	{
		res.status(400).send('Bad Request');
	}
	//res.status(400).send('Bad Request');
});

app.get("/seoog", function(req, res){
	if(req.query.url)
	{
		try
		{
			var url = req.query.url;
			//console.log('url:' + url);
			/*extract({ uri: 'http://www.newyorker.com' }, (err, res) =>
				if(err)
					res.status(400).send('Bad Request');
				else
					res.send(res);
			);*/
			extract({ uri: url }, function(err, resp){
				if(err)
					res.status(400).send('Bad Request');
				else
					res.send(resp);
				
			});
		}
		catch(e)
		{
			res.status(400).send('Bad Request');
		}
	}
	else
	{
		res.status(400).send('Bad Request');
	}
});

app.get("/console", function(req, res){
	res.sendFile(__dirname + "/public/views/console.html");
});

app.get("/oauth", function(req, res){
	res.sendFile(__dirname + "/public/views/oauth.html");
});

app.get("/files/*:file(*)", function(req, res){
	//console.log(req.get('User-Agent'));
	var realPath = path.join(fsBaseDir, decodeURIComponent(req._parsedOriginalUrl.pathname).replace('/files/', ''));
	var token = req.query.authToken;
	var curUser = null;
	if(token)
		curUser = getUserByAuthToken(token);
	if(fs.existsSync(realPath))
	{
		if(((req.session.user && connectUsers[req.session.user].isOwner(realPath)) ||
			(curUser != null && curUser.isOwner(realPath))))
		{
			/*if(!req.session.user && curUser)
			{
				req.session.user = curUser.name;
			}*/
			var st = fs.statSync(realPath);
			if(st.isFile())
			{
				
				var size = parseFloat(st.size) / 1000000.0;
				if(size > 10)
				{
					res.writeHead(200, {
						'Content-Length' : st.size
					});
					var stream = fs.createReadStream(realPath, { bufferSize: 64 * 1024 });
					stream.pipe(res);
					req.connection.on('close',function(){
						stream.close();
						res.end();
					});
				}
				else
				{
					res.sendFile(realPath, { root: __dirname });
				}
			}
			else
			{
				res.status(404).send('Not found');
				console.log('not found');
			}
		}
		/*else if(usersUsingIP(req.connection.remoteAddress))//provisional
		{
			console.log("provisional");
			var st = fs.statSync(realPath);
			if(st.isFile())
			{
				
				var size = parseFloat(st.size) / 1000000.0;
				if(size > 10)
				{
					var stream = fs.createReadStream(realPath, { bufferSize: 64 * 1024 });
					stream.pipe(res);
					req.connection.on('close',function(){
						stream.close();
						res.end();
					});
				}
				else
				{
					res.sendFile(realPath, { root: __dirname });
				}
			}
			else
			{
				res.status(404).send('Not found');
				console.log('not found');
			}
		}*/
		else
		{
			res.status(401).send('Not auth');
			console.log('not auth');
		}
	}
	else
	{
		res.status(404).send('Not found');
		console.log('not found');
	}
});

app.get("/downloadPage/*", function(req, res){
	var idFile = decodeURIComponent(req._parsedOriginalUrl.pathname).replace('/downloadPage/', '');
	if(publicLinks[idFile]){
		res.render(__dirname + "/public/views/download.jade" , {
			name: path.basename(publicLinks[idFile]),
			id: idFile
		});
	}
	else{
		res.render(__dirname + "/public/views/filenotfound.jade");
	}
});

app.get("/downloadPageProtect/*", function(req, res){
	var idFile = decodeURIComponent(req._parsedOriginalUrl.pathname).replace('/downloadPageProtect/', '');
	if(privateLinks[idFile]){
		res.render(__dirname + "/public/views/downloadProtect.jade" , {
			name: path.basename(privateLinks[idFile].url),
			id: idFile
		});
	}
	else{
		res.render(__dirname + "/public/views/filenotfound.jade");
	}
});

app.get("/downloadPublic/*", function(req, res){
	var idFile = decodeURIComponent(req._parsedOriginalUrl.pathname).replace('/downloadPublic/', '');
	if(publicLinks[idFile]){
		var fullPath = path.join(fsBaseDir ,publicLinks[idFile]);
		res.download(fullPath);
	}
	else
	{
		res.status(404).send('Not found');
	}
});

/*var usersDB = [];
usersDB['javi'] = {};
usersDB['javi'].folders = [];
usersDB['javi'].folders.push('javi');
usersDB['javi'].password = 'qwerty';
usersDB['javi'].apps = [];
usersDB['javi'].apps.push('apps/appsmarket/index.js');
usersDB['javi'].apps.push('apps/ftpexplorer/index.js');
usersDB['javi'].apps.push('apps/fileviwer/index.js');
usersDB['javi'].apps.push('apps/admintask/index.js');

usersDB['cr'] = {};
usersDB['cr'].folders = [];
usersDB['cr'].folders.push('cr');
usersDB['cr'].password = 'qwerty';
usersDB['cr'].apps = [];
usersDB['cr'].apps.push('apps/appsmarket/index.js');
usersDB['cr'].apps.push('apps/ftpexplorer/index.js');
usersDB['cr'].apps.push('apps/fileviwer/index.js');
usersDB['cr'].apps.push('apps/admintask/index.js');

usersDB['prueba'] = {};
usersDB['prueba'].folders = [];
usersDB['prueba'].folders.push('prueba');
usersDB['prueba'].password = 'prueba';
usersDB['prueba'].apps = [];
usersDB['prueba'].apps.push('apps/appsmarket/index.js');
usersDB['prueba'].apps.push('apps/ftpexplorer/index.js');
usersDB['prueba'].apps.push('apps/fileviwer/index.js');
usersDB['prueba'].apps.push('apps/admintask/index.js');

usersDB['root'] = {};
usersDB['root'].folders = [];
usersDB['root'].folders.push('root');
usersDB['root'].folders.push('javi/nuevacarpeta1');
usersDB['root'].password = '1';
usersDB['root'].apps = [];
usersDB['root'].apps.push('apps/appsmarket/index.js');
usersDB['root'].apps.push('apps/ftpexplorer/index.js');
usersDB['root'].apps.push('apps/fileviwer/index.js');
usersDB['root'].apps.push('apps/admintask/index.js');*/

var connectUsers = [];
var publicLinks = [];
function createPublicLink(url)
{
	for(var key in publicLinks)
	{
		if(url == publicLinks[key])
		{
			return key;
		}
	}
	var tempId = null;
	do{
		tempId = hat();
	}while(publicLinks[tempId]);
	publicLinks[tempId] = url;
	return tempId;
};

var privateLinks = [];
function createPrivateLink(url, pass)
{
	var tempId = null;
	do{
		tempId = hat();
	}while(privateLinks[tempId]);
	privateLinks[tempId] = {};
	privateLinks[tempId].pass = pass;
	privateLinks[tempId].url = url;
	return tempId;
};

/*function logInUser(u,p)
{
	if(usersDB[u] && usersDB[u].password == p)
	{
		var usr = new User(u, p, usersDB[u].folders, usersDB[u].apps);
		connectUsers[u] = usr;
		return usr;
	}
	return null;
}
function checkLogIn(u,p)
{
	return (connectUsers[u] && usersDB[u] && usersDB[u].password == p);
}*/
function logOutUser(user)
{
	if(connectUsers[user.name])
	{
		if(connectUsers[user.name].session)
			connectUsers[user.name].session.destroy();
		connectUsers[user.name] = null;
		delete connectUsers[user.name];
	}
}
function getUserByAuthToken(token)
{
	if(token)
	{
		for (var key in connectUsers)
		{
			if(connectUsers[key].authToken == token)
				return connectUsers[key];
		}
	}
	return null;
}

function usersUsingIP(ip)
{
	for (var key in connectUsers)
	{
		if(connectUsers[key].ip == ip)
			return true;
	}
	return false;
}

function copyFile(source, target, cb) {
	var cbCalled = false;

	var rd = fs.createReadStream(source);
	rd.on("error", function(err) {
		done(err);
	});
	var wr = fs.createWriteStream(target);
	wr.on("error", function(err) {
		done(err);
	});
	wr.on("close", function(ex) {
		done();
	});
	rd.pipe(wr);

	function done(err) {
		if (!cbCalled) {
			cb(err);
			cbCalled = true;
		}
	}
};
//MYSQL
/*var mysql		= require('mysql');
var connection	= mysql.createConnection({
	host		: '127.0.0.1',
	database	: 'wubos',
	user		: 'wubos',
	password	: 'wubos'
});
connection.connect(function(err) {
	if (err) {
		console.error('error connecting: ' + err.stack);
		return;
	}
 
	console.log('connected as id ' + connection.threadId);
});
function logInBBDD(user, pass, callback){
	connection.query('SELECT * from usuarios where username="' + user + '" and password="' + pass + '"', function(err, rows) {
		if(err){
			console.log(err);
			if(callback)
				callback(null);
			return;
		}
		console.log(rows);
		var usr = new User(user, pass, usersDB[u].folders, usersDB[u].apps);
		if(callback)
			callback(usr);
	});
};*/
//Firebase
var fireConfig = {
};
firebase.initializeApp(fireConfig);

var serviceAccount = require("./firebase-admin.json");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://api-project-268959058773.firebaseio.com"
});

function logInUser(u, p, callback)
{
	var db = admin.database();
	var ref = db.ref("usuarios/" + u);

	ref.on("value", function(snapshot) {
		
		if(snapshot.val() && snapshot.val().pass == p)
		{
			var usr = new User(u, p, [u], snapshot.val().apps);
			connectUsers[u] = usr;
			if(callback)
				callback(usr);
		}
		else if(callback)
			callback(null);
		ref.off();
	}, function (errorObject) {
		if(callback)
			callback(null);
	});
}
function dbUserExist(useName, callback){
	var db = admin.database();
	var ref = db.ref("usuarios/");
	ref.on("value", function(snapshot) {
		var e = false;
		if(snapshot.val() && snapshot.val()[useName])
			e = true;
		if(callback)
			callback(e);
		ref.off();
	}, function (errorObject) {
		if(callback)
			callback(null);
	});
};
function dbUpdateApps(u)
{
	admin.database().ref('usuarios/' + u.name + '/apps').set(u.apps);
}
//
var diretoryNode = function(nameDir)
{
	this.name = nameDir;
	this.directories = [];
	this.files = [];
	this.lnk = null;
	this.size = 0;
}
var fileNode = function(nameFile, idFile, fullPath)
{
	this.id = idFile;
	this.name = nameFile;
	this.fullName = fullPath;
	this.size = undefined;
};

var getFolderSize = function(folder){
	var childs = fs.readdirSync(folder);
	var totalSize = 0;
	if(childs.length > 0)
	{
		for (var i = 0; i < childs.length; i++)
		{
			var stats = fs.lstatSync(folder + '/' + childs[i]);
			if(stats.isFile())
			{
				var ext = path.extname(folder + '/' + childs[i]);
				if(ext != ".nodeLnk")
					totalSize += stats.size;
				else
				{
					var data = fs.readFileSync(fullPath + '/' + childs[i], "utf8");
					var fulldata = path.join(fsBaseDir, data);
					if(fs.existsSync(fulldata))
					{
						var statsLnk = fs.lstatSync(fulldata);
						if(statsLnk.isDirectory())
						{
							totalSize += getFolderSize(fulldata);
						}
					}
				}
			}
			else  if(stats.isDirectory())
			{
				totalSize += getFolderSize(folder + '/' + childs[i]);
			}
		}
	}
	return totalSize;
};

var loadDir = function (name, fullPath, lnk)
{
	var base = new diretoryNode(name);
	if(lnk)
		base.lnk = lnk;
	try
	{
		var childs = fs.readdirSync(fullPath);
	}
	catch(excp){ return base; }
	if(childs.length > 0)
	{
		for (var i = 0; i < childs.length; i++) 
		{
			try
			{
				var stats = fs.lstatSync(fullPath + '/' + childs[i]);
				//console.log(fullPath + '/' + childs[i] + ":" + stats.isSymbolicLink());
				if(stats.isFile())
				{
					var ext = path.extname(fullPath + '/' + childs[i]);
					if(ext != ".nodeLnk")
					{
						var fileN = new fileNode(childs[i], stats.ino, fullPath + '/' + childs[i]);
						fileN.size = stats.size;
						//base.size += stats.size;
						base.files.push(fileN);
					}
					/*else//link
					{
						var data = fs.readFileSync(fullPath + '/' + childs[i], "utf8");
						var fulldata = path.join(fsBaseDir, data);
						if(fs.existsSync(fulldata))
						{
							var statsLnk = fs.lstatSync(fulldata);
							if(statsLnk.isDirectory())
							{
								var direcLnk = loadDir(childs[i] ,fulldata, data);
								direcLnk.size = getFolderSize(fulldata);
								base.directories.push(direcLnk);
							}
							//else if(statsLnk.isFile())
								//base.files.push(new fileNode(childs[i], data);
						}
					}*/
				}
				else if(stats.isDirectory())
				{
					var direcN = loadDir(childs[i] ,fullPath + '/' + childs[i]);
					/*getDirectorySize(fullPath + '/' + childs[i], function(err, size){
						if(!err)
							direcN.size = size;
					})*/
					//direcN.size = getFolderSize(fullPath + '/' + childs[i]);
					base.directories.push(direcN);
				}
			}
			catch(err)
			{ }
		}
	}
	return base;
}

var deleteFolderRecursive = function(path) 
{
	var files = [];
	if( fs.existsSync(path) ) {
		files = fs.readdirSync(path);
		files.forEach(function(file,index){
			var curPath = path + "/" + file;
			if(fs.lstatSync(curPath).isDirectory()) { // recurse
				deleteFolderRecursive(curPath);
			} else { // delete file
				fs.unlinkSync(curPath);
			}
		});
		fs.rmdirSync(path);
	}
};


var copyFile2 = function (sourceFile, destFile, onprogress, callback)
{
	fs.stat(sourceFile, function(err, stat){
		var filesize = stat.size
		var bytesCopied = 0
		var fname = destFile;
		const readStream = fs.createReadStream(sourceFile)

		readStream.on('data', function(buffer){
			bytesCopied += buffer.length
			var porcentage = ((bytesCopied/filesize)*100).toFixed(2)
			if(onprogress)
				onprogress(porcentage);
		});
		readStream.on('end', function(){
			if(callback)
				callback();
		});
		readStream.pipe(fs.createWriteStream(destFile));
	});
	
};
//

//
https.listen(process.env.PORT || 3000, function(){
	console.log('listening on *:3000');
});

//sockets
io.sockets.on('connection', function(socket) 
{
	console.log('Conectado: ' + socket.handshake.address);
	console.log(socket.request._query['type']);
	
	socket.on('disconnect', function(){
		if(socket.request._query['type'] == "explorer" && socket.explorer && socket.user)
			console.log('Desconectado explorador: ' + socket.user.name);
		else if(socket.request._query['type'] == "cmd")
		{
			console.log('Desconectado cmd: ' + socket.handshake.address);
		}
		else
		{
			if(socket.user)
			{
				console.log('Desconectado main: ' + socket.user.name);
				logOutUser(socket.user);
				socket.user = null;
			}
			else
			{
				socket.handshake.session.destroy();
				console.log('Desconectado: ' + socket.handshake.address);
			}
		}
	});
	socket.on('reconnect', function(){
		if(socket.explorer && socket.user)
			console.log('Reconectado explorador: ' + socket.user.name);
		else
		{
			console.log('Reconectado: ' + socket.handshake.address);
			if(socket.user)
			{
				console.log('Reconectado: ' + socket.user.name);
				logOutUser(socket.user);
				socket.user = null;
			}
		}
	});
	if(!socket.request._query['type']){
		socket.handshake.session.isOpen = true;
		socket.on('ping', function(){
			console.log('ping');
			//socket.emit('ping');
		});
		socket.on('getRequest', function(options){
			//console.log(options);
			request.post(options, function(error, response, body) {
				console.log('response');
				socket.emit('responseRequest', options, error, response, body);
			});
		});
		socket.on('setLocation', function(llat, llong){
			if(socket.user)
			{
				socket.user.location = [llat, llong];
				console.log("Location: " + socket.user.location);
			}
		});
		/*socket.on('getAuth', function(user, pass, callbackFunction){
			if(connectUsers[user])
			{
				if(checkLogIn(user, pass))
				{}
			}
		});*/
		socket.on('logOut',function(){
			if(socket.user)
			{
				logOutUser(socket.user);
				socket.user = null;
			}
		});
		socket.on('logIn',function(user,pass){
			if(!socket.user)
			{
				if(!connectUsers[user])
				{
					//logInBBDD(user, sha1(pass), function(){});
					var u = logInUser(user, pass, function(u){
						if(u)
						{
							u.ip = socket.handshake.address;
							socket.explorer = false;
							console.log('Logeado: ' + u.name);
							socket.user = u;
							socket.handshake.session.user = user;
							socket.emit('logIn', u);
							u.session = socket.handshake.session;
							socket.handshake.session.save();
						}
						else//datos erroneos
						{
							socket.emit('logIn', null,'Datos incorrectos');
						}
					});
					/**/
				}
				else //emit error login
				{
					socket.emit('logIn', null, 'Usuario ya logeado');
				}
			}
			else
			{
				socket.emit('logIn', null, 'Sesión ya iniciada');
			}
		});
		socket.on('getApps',function(){
			console.log('Get Apps');
			var parser = new xml2js.Parser();
			fs.readFile('./public/apps/apps.xml', 'utf8', function(err, data) {
				parser.parseString(data, function (err, result) {
					if(!err)
						socket.emit('apps', JSON.stringify(result));
				});
			});
		});
		socket.on('installApp', function(fPApp){
			if(socket.user)
			{
				console.log("install:" + fPApp);
				connectUsers[socket.user.name].installApp(fPApp);
				dbUpdateApps(socket.user);
			}
		});
		socket.on('uninstallApp', function(fPApp){
			if(socket.user)
			{
				console.log("uninstall:" + fPApp);
				var posApp = connectUsers[socket.user.name].apps.indexOf(fPApp);
				if(posApp)
				{
					connectUsers[socket.user.name].apps.splice(posApp, 1);
					dbUpdateApps(socket.user);
				}
			}
		});
		socket.on('installedApps', function(){
			if(socket.user)
			{
				socket.emit('installedApps', JSON.stringify(connectUsers[socket.user.name].apps));
			}
		});
	}
	else if(socket.request._query['type'] == 'explorer'){
		//explorer
		socket.explorer = true;
		socket.on('explorer', function(user, authToken){
			if(socket.user)
			{
				var files = loadDir(socket.user.name , fsBaseDir + socket.user.name);
				socket.emit('explorer', JSON.stringify(files));
			}
			else if(connectUsers[user] && authToken && (getUserByAuthToken(authToken) == connectUsers[user]))
			{
				socket.user = connectUsers[user];
				socket.join(connectUsers[user].name);
				var files = loadDir(socket.user.name , fsBaseDir + socket.user.name);
				socket.emit('explorer', JSON.stringify(files));
				console.log('Logeado explorer: ' + user);
			}
		});
		socket.on('explorermkdir', function(path, name){
			if(socket.user)
			{
				try
				{
					fs.mkdirSync(fsBaseDir + path + '/' + name);
					var files = loadDir(socket.user.name ,fsBaseDir + socket.user.name);
					io.sockets.in(socket.user.name).emit('explorer', JSON.stringify(files));
				}
				catch(e)
				{
					socket.emit('explorererror', e);
				}
				io.sockets.in(socket.user.name).emit('unlockexplorer');
			}
		});
		socket.on('explorerrename', function(oldName, newName){
			if(socket.user)
			{
				try
				{
					fs.renameSync(fsBaseDir + oldName, fsBaseDir + newName);
					var files = loadDir(socket.user.name , fsBaseDir + socket.user.name);
					io.sockets.in(socket.user.name).emit('explorer', JSON.stringify(files));
				}
				catch(e)
				{
					socket.emit('explorererror', e);
				}
				io.sockets.in(socket.user.name).emit('unlockexplorer');
			}
		});
		socket.on('explorerrmdir', function(dirName){
			if(socket.user)
			{
				try
				{
					deleteFolderRecursive(fsBaseDir + dirName);
					var files = loadDir(socket.user.name , fsBaseDir + socket.user.name);
					io.sockets.in(socket.user.name).emit('explorer', JSON.stringify(files));
				}
				catch(e)
				{
					socket.emit('explorererror', e);
				}
				io.sockets.in(socket.user.name).emit('unlockexplorer');
			}
		});
		socket.on('explorerunlink', function(fileFullName){
			if(socket.user)
			{
				try
				{
					fs.statSync(fsBaseDir + fileFullName);
					fs.unlinkSync(fsBaseDir + fileFullName);
					var files = loadDir(socket.user.name , fsBaseDir + socket.user.name);
					io.sockets.in(socket.user.name).emit('explorer', JSON.stringify(files));
				}
				catch(e)
				{
					socket.emit('explorererror', e);
				}
				io.sockets.in(socket.user.name).emit('unlockexplorer');
			}
		});
		socket.on('explorercopy', function(origen, destino){
			if(socket.user)
			{
				try
				{
					var stf = fs.lstatSync(fsBaseDir + origen)
					if(stf.isFile())
						copyFile2(fsBaseDir + origen, fsBaseDir + destino, 
							function(p){
								io.sockets.in(socket.user.name).emit('lockPercentage', p, "");
							},
							function(){
								
								var files = loadDir(socket.user.name , fsBaseDir + socket.user.name);
								io.sockets.in(socket.user.name).emit('explorer', JSON.stringify(files));
								io.sockets.in(socket.user.name).emit('unlockexplorer');
							});
					else if(stf.isDirectory())
						new copyObject(fsBaseDir + origen, path.dirname(fsBaseDir + destino), path.dirname(fsBaseDir + origen),
							function(per, fileName){
								io.sockets.in(socket.user.name).emit('lockPercentage', per, fileName);
							},
							function(){
								var files = loadDir(socket.user.name , fsBaseDir + socket.user.name);
								io.sockets.in(socket.user.name).emit('explorer', JSON.stringify(files));
								io.sockets.in(socket.user.name).emit('unlockexplorer');
							});
				}
				catch(e)
				{
					console.log(e);
					socket.emit('explorererror', e);
				}
				/*try
				{
					fse.copySync(fsBaseDir + origen, fsBaseDir + destino);
					var files = loadDir(socket.user.name , fsBaseDir + socket.user.name);
					io.sockets.in(socket.user.name).emit('explorer', JSON.stringify(files));
				}
				catch(e)
				{
					socket.emit('explorererror', e);
				}
				io.sockets.in(socket.user.name).emit('unlockexplorer');
				
				//////////////////////////////////////////////////////////////////
				var stat = null;
				try
				{
					stat = fs.statSync(path.join(fsBaseDir,origen));
				}
				catch(e)
				{
					socket.emit('explorererror', e);
					return;
				}
				var str = progress({
					length: stat.size,
					time: 500
				});
				str.on('progress', function(progress) {
					io.sockets.in(socket.user.name).emit('lockPercentage', progress.percentage, progress.eta);
				});
				var rdS = fs.createReadStream(path.join(fsBaseDir, origen));
				rdS.on("error", function(err) {
					socket.emit('explorererror', e);
				});
				var wrS = fs.createWriteStream(path.join(fsBaseDir, destino));
				wrS.on("close", function(ex) {
					var files = loadDir(socket.user.name ,path.join(fsBaseDir, socket.user.name));
					io.sockets.in(socket.user.name).emit('explorer', JSON.stringify(files));
					io.sockets.in(socket.user.name).emit('unlockexplorer');
				});
				wrS.on("error", function(err) {
					socket.emit('explorererror', e);
				});
				rdS.pipe(str).pipe(wrS);*/
				
			}
		});
		socket.on('explorermove', function(origen, destino){
			fse.move(fsBaseDir + origen, fsBaseDir + destino, function (err) {
				if (err)
					socket.emit('explorererror', err);
				else
				{
					var files = loadDir(socket.user.name , fsBaseDir + socket.user.name);
					io.sockets.in(socket.user.name).emit('explorer', JSON.stringify(files));
				}
				io.sockets.in(socket.user.name).emit('unlockexplorer');
			});
		});
		socket.on('explorerrefresh', function(){
			var files = loadDir(socket.user.name , fsBaseDir + socket.user.name);
			io.sockets.in(socket.user.name).emit('explorer', JSON.stringify(files));
		});
		socket.on('explorergetpubliclink', function(fileName){
			var pLink = '/downloadPage/' + createPublicLink(fileName);
			socket.emit('explorergetpubliclink', pLink, path.basename(fileName));
		});
		socket.on('explorergetprivatelink', function(fileName, pass){
			var pLink = '/downloadPageProtect/' + createPrivateLink(fileName, pass);
			console.log(pLink);
			socket.emit('explorergetprivatelink', pLink, path.basename(fileName));
		});
		/*socket.on('explorerlnk', function(origen, destino){
			
		});*/
		//
	}
	else if(socket.request._query['type'] == 'cmd'){
		socket.join('cmdSockets');
		socket.on('consoleeval', function(evalString){
			try
			{
				var resultEval = eval(evalString);
				if (typeof resultEval === "undefined")
					socket.emit('*', 'undefined');
				else
					socket.emit('*', resultEval.toString());
			}
			catch(e)
			{
				socket.emit('*', e.toString());
			}
		});
		socket.on('getConnectedIps', function(){
			var ips = [];
			for (var key in connectUsers)
			{
				if(connectUsers[key].location)
					ips.push(connectUsers[key].location);
				/*else if(connectUsers[key].ip)
					ips.push(geoip.lookup(connectUsers[key].ip).ll);*/
			}
			socket.emit('ipsCoords', JSON.stringify(ips));
		});
	}
});


var paths = require('path');
paths.posix = require('path-posix');
var __appRoot = function(username){
	return path.join(__dirname, 'usuarios/' + username);
}
// We will handle errors consistently by using a function that returns an error object
	function errors(err) {
		const error = err || {}; // This allows us to call errors and just get a default error
		return {
			Error: error.Error,
			nodeCode: error.errno,
			Code: -1,
		};// return
	}// errors

	// This is a seperate function because branch new files are uploaded and won't have an existing file
	// to get information from
	function parseNewPath(inputPath, callback, username) {
		let path = inputPath;
		const parsedPath = {};
		const fileRoot = config.options.fileRoot || '';
		parsedPath.uiPath = path;

		// if the passed in path isn't in the fileRoot path, make it so
		// This should go away and every path should be relative to the fileRoot
		if (path.substring(0, fileRoot.length) !== fileRoot) {
			path = paths.posix.join(fileRoot, path);
		}

		parsedPath.relativePath = paths.posix.normalize(path);
		parsedPath.filename = paths.posix.basename(parsedPath.relativePath);
		parsedPath.osRelativePath = paths.normalize(path);
		parsedPath.osExecutionPath = __appRoot(username);
		parsedPath.osFullPath = paths.join(parsedPath.osExecutionPath, parsedPath.osRelativePath);
		parsedPath.osFullDirectory = paths.parse(parsedPath.osFullPath).dir;
		callback(parsedPath);
	}// parseNewPath

	// because of windows, we are going to start by parsing out all the needed path information
	// this will include original values, as well as OS specific values
	function parsePath(path, callback, username) {
		parseNewPath(path, (parsedPath) => {
			fs.stat(parsedPath.osFullPath, (err, stats) => {
				if (err) {
					callback(errors(err));
				} else if (stats.isDirectory()) {
					parsedPath.isDirectory = true;
					parsedPath.stats = stats;
					callback(parsedPath);
				} else if (stats.isFile()) {
					parsedPath.isDirectory = false;
					parsedPath.stats = stats;
					callback(parsedPath);
				} else {
					callback(errors(err));
				}
			});
		}, username);// parseNewPath
	}// parsePath

	// This function will create the return object for a file.  This keeps it consistent and
	// adheres to the DRY principle
	function fileInfo(pp, callback) {
		const result = {
			id: pp.uiPath,
			type: 'file',
			attributes: {
				created: pp.stats.birthtime,
				modified: pp.stats.mtime,
				name: pp.filename,
				path: pp.uiPath,
				readable: 1,
				writable: 1,
				timestamp: '',
			},
		};
		callback(result);
	}// fileInfo

	// This function will create the return object for a directory.  This keeps it consistent and
	// adheres to the DRY principle
	function directoryInfo(pp, callback) {
		const result = {
			id: pp.uiPath.replace(/([\s\S^/])\/?$/, '$1/'),
			type: 'folder',
			attributes: {
				created: pp.stats.birthtime,
				modified: pp.stats.mtime,
				name: pp.filename,
				path: pp.uiPath.replace(/([\s\S^/])\/?$/, '$1/'),
				readable: 1,
				writable: 1,
				timestamp: '',
			},
		};
		callback(result);
	}// directoryInfo

	// Getting information is different for a file than it is for a directory, so here
	// we make sure we are calling the right function.
	function getinfo(pp, callback) {
		if (pp.isDirectory) {
			directoryInfo(pp, (result) => {
				callback(result);
		});
		} else {
			fileInfo(pp, (result) => {
				callback(result);
		});
		}// if
	}// getinfo

	// Here we get the information for a folder, which is a content listing

	// This function exists merely to capture the index and and pp(parsedPath) information in the for loop
	// otherwise the for loop would finish before our async functions
	function getIndividualFileInfo(pp, files, loopInfo, callback, $index, username) {
		parsePath(paths.posix.join(pp.uiPath, files[$index]), (ipp) => {
			getinfo(ipp, (result) => {
				loopInfo.results.push(result);
				if ($index + 1 >= loopInfo.total) {
					callback(loopInfo.results);
				}// if
			});// getinfo
		}, username);// parsePath
	}// getIndividualFileInfo

	function readfolder(pp, callback, username) {
		fs.readdir(pp.osFullPath, (err, files) => {
			if (err) {
				console.log('err -> ', err); // eslint-disable-line no-console
				callback(errors(err));
			} else {
				const loopInfo = {
					results: [],
					total: files.length,
				};

				if (loopInfo.total === 0) {
					callback(loopInfo.results);
				}

				for (let i = 0; i < loopInfo.total; i++) {
					getIndividualFileInfo(pp, files, loopInfo, callback, i, username);
				}// for
			}// if
		});// fs.readdir
	}// getinfo

	// function to delete a file/folder
	function deleteItem(pp, callback) {
		if (pp.isDirectory === true) {
			fs.rmdir(pp.osFullPath, (err) => {
				if (err) {
					callback(errors(err));
				} else {
					directoryInfo(pp, callback);
		}// if
		});// fs.rmdir
		} else {
			fs.unlink(pp.osFullPath, (err) => {
				if (err) {
					callback(errors(err));
				} else {
					fileInfo(pp, callback);
		}// if
		});// fs.unlink
		}// if
	}// deleteItem

	// function to add a new folder
	function addfolder(pp, name, callback) {
		fs.mkdir(paths.join(pp.osFullPath, name), (err) => {
			if (err) {
				callback(errors(err));
			} else {
				const result = {
					id: `${pp.relativePath}${name}/`,
					type: 'folder',
					attributes: {
						name,
						created: pp.stats.birthtime,
						modified: pp.stats.mtime,
						path: `${pp.relativePath}${name}/`,
						readable: 1,
						writable: 1,
						timestamp: '',
					},
				};
				callback(result);
			}// if
		});// fs.mkdir
	}// addfolder

	// function to save uploaded files to their proper locations
	function renameIndividualFile(loopInfo, files, pp, callback, $index) {
		if (loopInfo.error === false) {
			// const oldfilename = paths.join(__appRoot, files[$index].path);
			const oldfilename = paths.resolve(files[$index].path);
			// new files comes with a directory, replaced files with a filename.  I think there is a better way to handle this
			// but this works as a starting point
			const newfilename = paths.join(
				__appRoot,
				pp.isDirectory ? pp.relativePath : '',
				pp.isDirectory ? files[$index].originalname : pp.filename
			); // not sure if this is the best way to handle this or not

			fs.rename(oldfilename, newfilename, (err) => {
				if (err) {
					loopInfo.error = true;
					console.log('savefiles error -> ', err); // eslint-disable-line no-console
					callback(errors(err));
					return;
				}
				const name = paths.parse(newfilename).base;
			const result = {
				id: `${pp.relativePath}${name}`,
				type: 'file',
				attributes: {
					name,
					created: pp.stats.birthtime,
					modified: pp.stats.mtime,
					path: `${pp.relativePath}${name}`,
					readable: 1,
					writable: 1,
					timestamp: '',
				},
			};
			loopInfo.results.push(result);
			if ($index + 1 >= loopInfo.total) {
				callback(loopInfo.results);
			}
		});// fs.rename
		}// if not loop error
	}// renameIndividualFile

	function savefiles(pp, files, callback) {
		const loopInfo = {
			results: [],
			total: files.length,
			error: false,
		};

		for (let i = 0; i < loopInfo.total; i++) {
			renameIndividualFile(loopInfo, files, pp, callback, i);
		}// for
	}// savefiles

	// function to rename files
	function rename(old, newish, callback) {
		fs.rename(old.osFullPath, newish.osFullPath, (err) => {
			if (err) {
				callback(errors(err));
			} else {
				const name = paths.parse(newish.osFullPath).base;
		const result = {
			id: `${newish.relativePath}`,
			type: 'file',
			attributes: {
				name,
				created: '',
				modified: '',
				path: `${newish.relativePath}`,
				readable: 1,
				writable: 1,
				timestamp: '',
			},
		};
		callback(result);
	}// if
	}); // fs.rename
	}// rename

	// function to copy files
	function copy(source, target, callback) {
		fs.readFile(source.osFullPath, (err, file) => {
			if (err) {
				callback(errors(err));
				return;
			}
			fs.writeFile(target.osFullPath, file, (error) => {
			if (err) {
				callback(errors(error));
				return;
			}
			const name = paths.parse(target.osFullPath).base;
		const result = {
			id: `${target.relativePath}`,
			type: 'file',
			attributes: {
				name,
				created: '',
				modified: '',
				path: `${target.relativePath}`,
				readable: 1,
				writable: 1,
				timestamp: '',
			},
		};
		callback(result);
	});
	});
	}// copy

	// RichFilemanager expects a pretified string and not a json object, so this will do that
	// This results in numbers getting recieved as 0 instead of '0'
	function respond(res, obj) {
		res.setHeader('Content-Type', 'application/json');
		res.send(JSON.stringify(obj));
	}// respond

/*
Object.prototype.removeItem = function (key) {
   if (!this.hasOwnProperty(key))
      return
   if (isNaN(parseInt(key)) || !(this instanceof Array))
      delete this[key]
   else
      this.splice(key, 1)
};
*/

/*app.get("./public/usuarios/*:file(*)", function(req,res){
	if(fs.existsSync(req.url))
		res.senFile(req.url);
	else
		res.status(404).send('Not found');
});*/


/*app.get('/download:file(*)', function(req, res){
	var file = req.params.file
	, ruta = path.join(fsBaseDir ,file);
	if(fs.existsSync(ruta))
		res.download(ruta);
	else
		res.status(404).send('Not found');
});*/
/*setInterval(function() {
	protocolHTTPS.get("https://wubos.herokuapp.com/");
}, 10000); // every 5 minutes (300000)*/
