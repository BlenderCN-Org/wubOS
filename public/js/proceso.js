var proceso = function(rootProcess, sourceAV, parentProcess)
{
	this.isMainProcess = rootProcess;
	this.source = sourceAV;
	this.isOnClose = false;
	this.parentProcess = null;
	function guid()
	{
		function s4() 
		{
			return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
		}
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
	};
	this.removeProcess = function(p)
	{
		var index = this.subProcesos.indexOf(p);
		if(index != -1)
		{
			this.subProcesos.splice(index, 1);
		}
		/*if(!this.isOnClose && this.subProcesos.length == 0)
			this.close();*/
	};
	this.pID = guid();
	this.subProcesos = [];
	this.onClose = null;
	//this.cancelClose = false;
	this.close = function(forceClose){
		if(this.isOnClose)
			return;
		this.isOnClose = true;
		if(this.source instanceof ventana && !this.source.isOnClose)
			this.source.cerrar(forceClose);
		/*if(this.cancelClose)
		{
			this.cancelClose = false;
			this.isOnClose = false;
			return;
		}*/
		for(var i = this.subProcesos.length - 1; i > -1 ; i--)
		{
			this.subProcesos[i].close(forceClose);
		}
		if(this.isMainProcess)
		{
			var index = OS.procesos.indexOf(this);
			if(index != -1)
			{
				OS.procesos.splice(index, 1);
			}
		}
		else
			this.parentProcess.removeProcess(this);
		if(isFunction(this.onClose))
			this.onClose();
		OS.onRemoveProcess(this);
	};
	if(this.isMainProcess)
		OS.procesos.push(this);
	else
	{
		this.parentProcess = parentProcess;
		this.parentProcess.subProcesos.push(this);
	}
	OS.onAddProcess(this);
};