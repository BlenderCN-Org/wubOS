var User = function (n, p, at)
{
	this.name = n;
	
	var pass = p;
	
	this.authToken = at;
	
	this.folders = [];
	
	this.logIn = function(p){
		return (p == pass);
	};
}