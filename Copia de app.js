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
var device = require('express-device');
var xml2js = require('xml2js');
var progress = require('progress-stream');
var clear = require('clear');
var User = require('./public/serverjs/user.js');
var fsBaseDir = './usuarios/';

//var geoip = require('geoip-lite');
var hat = require('hat');
var fileType = require('file-type');
var protocolHTTP = require('http');
var protocolHTTPS = require('https');


var cursession = session({ secret: 'zasca', cookie: { maxAge: null }, resave: true, saveUninitialized: true });

app.use(cursession);
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true }));
app.use(device.capture());
app.use(bodyParser.json());

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
		if (req.session.user && connectUsers[req.session.user])
		{
			res.sendFile(path.join(__dirname, 'public/views/alreadyLogin.html'));
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

app.post('/login',function(req, res){
	if(!req.session.user)
	{
		if(req.body.user && req.body.authToken)
		{
			var curUser = getUserByAuthToken(req.body.authToken);
			if(curUser && (curUser.name == req.body.user))
			{
				console.log('Iniciada Sesion: ' + req.body.user);
				req.session.user = req.body.user;
				curUser.request = req;
				res.status(200).send('ok');
			}
			else
				res.status(401).send('Not auth');
		}
		else
			res.status(401).send('Not auth');
	}
	else
		res.status(409).send('Session allready in use');
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

app.post('/logout',function(req, res){
	if(req.session.user)
	{
		console.log('Cerrado Sesion: ' + req.session.user);
		req.session.user = null;
	}
	res.status(200).send('ok');
});

/*app.use(multer({ dest: './uploads',
	changeDest: function(dest, req, res) {
		return path.join(fsBaseDir, req.body.directoryFTP); 
	},
	rename: function (fieldname, filename) {
		return filename;
	},
	onFileUploadStart: function (file, req, res) {
		var realPath = path.join(fsBaseDir, req.body.directoryFTP);
		var token = req.body.authToken;
		var curUser = null;
		if(token)
			curUser = getUserByAuthToken(token);
		if((curUser != null && curUser.isOwner(realPath)) || (req.session.user && connectUsers[req.session.user] && connectUsers[req.session.user].isOwner(realPath)))
		{
			try
			{
				if(!fs.statSync(realPath).isDirectory())
				{
					console.log("Not propety:" + fsBaseDir + req.body.directoryFTP);
					return false;
				}
			}
			catch(e)
			{
				console.log("Not exist:" + fsBaseDir + req.body.directoryFTP);
				return false;
			}
		}
		else
		{
			console.log("Fail login");
			return false;
		}
		console.log(file.originalname + ' is starting ...');
	},
	onFileUploadComplete: function (file, req, res) {
		console.log(file.fieldname + ' uploaded to ' + file.path);
		res.isUploadFileFtp = true;
	}
}));

app.post('/upload',function(req, res){
	if(res.isUploadFileFtp)
	{
		//console.log(req.body);
		console.log("upload");
		res.end("File uploaded.");
		//if(io.sockets.in(req.body.userFTP).length > 0)??
		var files = loadDir(req.body.userFTP ,fsBaseDir + req.body.userFTP);
		io.sockets.in(req.body.userFTP).emit('explorer', JSON.stringify(files));
	}
	else
	{
		res.status(401).send('Unauthorized');
	}
});*/
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
	var file = path.join(fsBaseDir, decodeURIComponent(req._parsedOriginalUrl.pathname).replace('/download/files/', ''));
	var curUser = null;
	if(token)
		curUser = getUserByAuthToken(token);
	/*if((curUser != null && curUser.isOwner(file)) || (req.session.user && connectUsers[req.session.user] && connectUsers[req.session.user].isOwner(file)))
	{
		if(fs.existsSync(file))
			res.download(file);
		else
			res.status(404).send('Not found');
	}
	else
		res.status(401).send('Not auth');*/
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
		var data = dataString.replace(/^data:image\/\w+;base64,/, "");
		var buf = new Buffer(data, 'base64');
		fs.writeFile(defFileFullName, buf);
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
			var url = req.query.url;
			var prtcl = (url.indexOf('https')== 0)?protocolHTTPS:protocolHTTP;
			prtcl.get(url, resp => {
				resp.once('data', chunk => {
					resp.destroy();
					var ft = fileType(chunk);
					var ext = (ft)?ft.ext:mime.extension(mime.lookup(url));
					//console.log(ext);
					res.send(ext);
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
});

app.get("/console", function(req, res){
	res.sendFile(__dirname + "/public/views/console.html");
});

app.get("/files/*:file(*)", function(req, res){
	//console.log(req.get('User-Agent'));
	var realPath = path.join(fsBaseDir, decodeURIComponent(req._parsedOriginalUrl.pathname).replace('/files/', ''));
	var token = req.query.authToken;
	var curUser = null;
	if(token)
		curUser = getUserByAuthToken(token);
	if(fs.existsSync(realPath) && ((req.session.user && connectUsers[req.session.user].isOwner(realPath)) ||
		(curUser != null && curUser.isOwner(realPath))))
	{
		if(!req.session.user && curUser)
		{
			req.session.user = curUser.name;
		}
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

var usersDB = [];
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
usersDB['root'].apps.push('apps/admintask/index.js');

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
}

function logInUser(u,p)
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
}
function logOutUser(user)
{
	if(connectUsers[user.name])
	{
		if(connectUsers[user.name].request)
			connectUsers[user.name].request.session.destroy();
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
	database	: 'xcht',
	user		: 'root',
	password	: ''
});
connection.connect();*/
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
	var childs = fs.readdirSync(fullPath);
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
					else//link
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
							/*else if(statsLnk.isFile())
								base.files.push(new fileNode(childs[i], data);*/
						}
					}
				}
				else if(stats.isDirectory())
				{
					var direcN = loadDir(childs[i] ,fullPath + '/' + childs[i]);
					/*getDirectorySize(fullPath + '/' + childs[i], function(err, size){
						if(!err)
							direcN.size = size;
					})*/
					direcN.size = getFolderSize(fullPath + '/' + childs[i]);
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
//

https.listen(process.env.PORT || 3000, function(){
	console.log('listening on *:3000');
});

//sockets
io.sockets.on('connection', function(socket) 
{
	console.log('Conectado: ' + socket.handshake.address);
	//console.log(socket.request._query['type']);
	
	socket.on('disconnect', function(){
		if(socket.explorer && socket.user)
			console.log('Desconectado explorador: ' + socket.user.name);
		else if(socket.request._query['type'] == "cmd")
		{
			console.log('Desconectado cmd: ' + socket.handshake.address);
		}
		else
		{
			if(socket.user)
			{
				console.log('Desconectado: ' + socket.user.name);
				logOutUser(socket.user);
				socket.user = null;
			}
			else
				console.log('Desconectado: ' + socket.handshake.address);
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
		//wubos
		console.log(socket.id);
		socket.on("ping", function(){
			socket.emit("ping");
		});
		socket.on('setLocation', function(llat, llong){
			if(socket.user)
			{
				socket.user.location = [llat, llong];
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
			if(!connectUsers[user])
			{
				var u = logInUser(user, pass)
				if(u)
				{
					if(!socket.user)
					{
						u.ip = socket.handshake.address;
						socket.explorer = false;
						console.log('Logeado: ' + u.name);
						socket.user = u;
					}
					//socket.request.session.user = u;
					socket.emit('logIn', u);
				}
				else//datos erroneos
				{
					socket.emit('logIn', null,'Datos incorrectos');
				}
			}
			else //emit error login
			{
				socket.emit('logIn', null, 'Usuario ya logeado');
			}
		});
		socket.on('getApps',function(){
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
					fse.copySync(fsBaseDir + origen, fsBaseDir + destino);
					var files = loadDir(socket.user.name , fsBaseDir + socket.user.name);
					io.sockets.in(socket.user.name).emit('explorer', JSON.stringify(files));
				}
				catch(e)
				{
					socket.emit('explorererror', e);
				}
				io.sockets.in(socket.user.name).emit('unlockexplorer');
				/*var stat = null;
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