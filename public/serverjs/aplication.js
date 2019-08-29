module.exports = function Aplication(n,d,fp,ic, insn)
{
	this.name = n;
	
	this.description = d;
	
	this.filePath = fp;
	
	this.icon = ic;
	
	this.instalationName = [];
	this.instalationName.add(insn);
}