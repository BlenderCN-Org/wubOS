(function(){ 
	var calculadora = new App('calculadora', 'apps/calculadora/img/favicon.png', 'Calculadora',
					[], [], null, null, true);
	calculadora.run = function(){
		var self = this;
		var prog = new Program(self ,function(){
			var selfProg = this;
			var v = new ventana(selfProg.proceso,{
				sizeX: 200,
				sizeY: 300,
				resizable: false,
				maximizable: false,
				maximizeButton: false
			});
			v.getDivContenido().className += " calculadora";
			v.setIcono('apps/calculadora/img/favicon.png');
			v.setTitulo('Calculadora');
			v.onClose = function(){
				selfProg.proceso.close();
			};
			v.cargarContenidoArchivo('apps/calculadora/index.xml', function(){
				v.mostrar();
				function checkNum(str) 
				{
					for (var i = 0; i < str.length; i++) {
						var ch = str.substring(i, i+1)
						if (ch < "0" || ch > "9") {
							if (ch != "/" && ch != "*" && ch != "+" && ch != "-" && ch != "." 
								&& ch != "(" && ch!= ")") {
								alert("invalid entry!");
								return false
							}
						}
					}
					return true
				};
				function changeSign()
				{
					// could use input.value = 0 - input.value, but let's show off substring
					if(v.controles.display.value.substring(0, 1) == "-")
						v.controles.display.value = v.controles.display.value.substring(1, v.controles.display.value.length)
					else
						v.controles.display.value = "-" + v.controles.display.value
				}
				function square() 
				{
					if (checkNum(v.controles.display.value))
						v.controles.display.value = eval(v.controles.display.value) * eval(v.controles.display.value);
				};
				function resolve()
				{
					if (checkNum(v.controles.display.value))
					{ 
						compute();
					}
				};
				function compute() 
				{
					v.controles.display.value = eval(v.controles.display.value);
				};
				function deleteChar()
				{
					v.controles.display.value = v.controles.display.value.substring(0, v.controles.display.value.length - 1)
				}
				function addChar()
				{
					if(v.controles.display.value == null || v.controles.display.value == "0")
						v.controles.display.value = this.value;
					else
						v.controles.display.value += this.value;
				};
				
				v.controles.btn0.onclick = addChar;
				v.controles.btn1.onclick = addChar;
				v.controles.btn2.onclick = addChar;
				v.controles.btn3.onclick = addChar;
				v.controles.btn4.onclick = addChar;
				v.controles.btn5.onclick = addChar;
				v.controles.btn6.onclick = addChar;
				v.controles.btn7.onclick = addChar;
				v.controles.btn8.onclick = addChar;
				v.controles.btn9.onclick = addChar;
				v.controles.btnMas.onclick = addChar;
				v.controles.btnMenos.onclick = addChar;
				v.controles.btnMult.onclick = addChar;
				v.controles.btnDiv.onclick = addChar;
				v.controles.btnPtn.onclick = addChar;
				v.controles.btnAbrePar.onclick = addChar;
				v.controles.btnCierraPar.onclick = addChar;
				v.controles.btnIgual.onclick = resolve;
				v.controles.btnC.onclick = function()
				{
					v.controles.display.value = "0";
				};
				v.controles.btnCuadrado.onclick = square;
				v.controles.btnSigno.onclick = changeSign;
				v.controles.btnDel.onclick = deleteChar;
			});
		});
	};
})();