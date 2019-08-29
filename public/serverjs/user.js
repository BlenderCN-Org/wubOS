module.exports = function User(n,p,rd,aps)
{
	var hat = require('hat');
	var path = require('path');
	var fsBaseDir = './usuarios/';
	
	this.name = n;
	
	this.session = null;
	
	var pass = p;
	
	this.authToken = null;
	
	this.ip = "";
	
	this.location = null;
	
	this.folders = rd.slice(0);//provisional
	
	//this.apps = aps.slice(0);//provisional
	this.apps = aps;
	
	this.preferences = {};
	
	this.loadPreferences = function(){};
	this.ganerateAuthToken = function(){
		this.authToken = hat();
	};
	this.logIn = function(u, p){
		return (p == pass);
	};
	this.checkLogIn = function(aT){
		return (aT == this.authToken);
	};
	this.isOwner = function(pathName){
		var realPath = path.normalize(pathName);
		for(var i = 0; i < this.folders.length; i++)
		{
			var indx = realPath.indexOf(path.join(fsBaseDir, this.folders[i]));
			//console.log(realPath +'---'+path.join(fsBaseDir, this.folders[i])+'---'+indx);
			if(indx == 0)
				return true;
		}
		return false;
	};
	this.appIsInstaled = function(appName){};
	this.installApp = function(app){
		this.apps.push(app);
	};
	this.uninstallApp = function(app){};
	this.ganerateAuthToken();
}