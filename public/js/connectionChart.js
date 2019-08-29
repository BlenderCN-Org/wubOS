var connectionChar = function(contenedor)
{
	var dps = []; // dataPoints
	var chartContenedor = contenedor;
	var lbl = $('<span/>', {
		'id': 'spnChartCnx',
	},{
		
	});
	$(chartContenedor).parent().append(lbl);
	//contenedor.appendChild(lbl);
	$(chartContenedor).sparkline(
		dps, 
		{
			type: 'line',
			width: '150',
			height: '30',
			minSpotColor: undefined,
			fillColor: '#ff0000',
			lineColor: '#ff0000',
			maxSpotColor: undefined
		}
	);
	var updateInterval = 1000;
	var dataLength = 20; // number of dataPoints visible at any point

	var updateChart = 
		function () 
		{
			if(dps.length > dataLength)
				dps.shift();
			$.ajax({
				cache: false,
				url: '/ping',
				beforeSend:
					function() 
					{
						this.fechaActual = new Date().getTime();
					},
				success: 
					function() 
					{
						var f = new Date().getTime();
						yVal= f - this.fechaActual;
						dps.push(f - this.fechaActual);
						$(chartContenedor).sparkline(
							dps, 
							{
								type: 'line',
								width: '100',
								height: '30',
								minSpotColor: undefined,
								fillColor: '#ff0000',
								lineColor: '#ff0000',
								maxSpotColor: undefined
							}
						);
						$(lbl).html((f - this.fechaActual) + "ms");
					},
				error:
					function()
					{
						dps.push(0);
						$(chartContenedor).sparkline(
							dps, 
							{
								type: 'line',
								width: '100',
								height: '30',
								minSpotColor: undefined,
								fillColor: '#ff0000',
								lineColor: '#ff0000',
								maxSpotColor: undefined
							}
						);
						$(lbl).html("");
					},
				complete: function()
				{
					setTimeout(updateChart, updateInterval);
				}
			});	

		};

	// update chart after specified time.
	updateChart();
}