module.exports = function copyObject(target, destiny, baseUrl, progressCallback, finishCallback)
{
	var fs = require('fs');
	var path = require('path');
	var copiedFolder;
	var destFolder = destiny;
	var folders = [];
	var files = [];
	var fsBaseDir = './usuarios/';

	function createCopyMedia(fullPath)
	{
		var uF = fullPath.replace(baseUrl + '/', '');
		folders.push(uF);
		var childs = fs.readdirSync(fullPath);
		if(childs.length > 0)
		{
			for (var i = 0; i < childs.length; i++) 
			{
				try
				{
					var stats = fs.lstatSync(fullPath + '/' + childs[i]);
					if(stats.isFile())
					{
						files.push(uF + '/' + childs[i]);
					}
					else if(stats.isDirectory())
					{
						createCopyMedia.call(this, fullPath + '/' + childs[i]);
					}
				}
				catch(err)
				{ }
			}
		}
	};

	function copy(endCallback){
		var f = files.pop();
		copyFile.call(this, baseUrl + '/' +f, destFolder + "/" + f, function(){
			if(files.length > 0)
				copy.call(this, endCallback);
			else if(endCallback)
				endCallback();
		});
	};
	function createFolders(){
		console.log(folders);
		for(var i = 0; i < folders.length; i++)
		{
			fs.mkdirSync(destFolder + "/" + folders[i]);
		}
	};

	function copyFile(sourceFile, destFile, callback)
	{
		fs.stat(sourceFile, function(err, stat){
			var filesize = stat.size
			var bytesCopied = 0
			var fname = destFile;
			const readStream = fs.createReadStream(sourceFile)

			readStream.on('data', function(buffer){
				bytesCopied += buffer.length
				var porcentage = ((bytesCopied/filesize)*100).toFixed(2)
				console.log(fname + " : " + porcentage+'%');
				if(progressCallback)
					progressCallback(porcentage, path.basename(fname));
			});
			readStream.on('end', function(){
				console.log('endfile');
				if(callback)
					callback();
			});
			readStream.pipe(fs.createWriteStream(destFile));
		});
		
	};
	createCopyMedia.call(this, target);
	createFolders.call(this);
	console.log(files);
	copy.call(this, function(){
		if(finishCallback)
			finishCallback();
	});
}