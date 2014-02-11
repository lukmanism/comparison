function pieChart(data,target) {
	var options = {
		segmentShowStroke : false,	
		segmentStrokeColor : "#fff",	
		segmentStrokeWidth : 20,	
		animation : true,	
		animationSteps : 60,	
		animationEasing : "easeOutBounce",	
		animateRotate : true,
		animateScale : false,	
		onAnimationComplete : null
	}
	new Chart(document.getElementById(target).getContext("2d")).Pie(data, options);	
	$('#'+target).attr("width","100").attr("height","100"); //forced size
}

function lineChart(datas){
	var datasets = [];
	var strokeColor = "#ababab";
	var pointColor = "#ECEBEE";
	var pointStrokeColor = "#ababab";

	var i = 0;
	var legend = '';

	$.each(datas['dd'], function(key,val){
		datasets[key] = {
			fillColor: window.seriecolor[0][key],
			strokeColor: strokeColor,
			pointColor: pointColor,
			pointStrokeColor: pointStrokeColor,
			data: val	
		}
		legend += '<dl class="column" style="border-bottom: 4px solid '+window.seriecolor[0][key]+';"><dt class="grey50 left">'+datas['x'][key]+'</dt><dd class="ilegend small left">'+val[val.length - 1]+'</dd></dl>';
		i++;
	});

	legend = legend.replace(/column/g, 'col'+i);
	$('.legend').html(legend);
	$('.stats_title').html(datas['x'].join(' vs. '));

	var options = {	
		scaleOverlay : false,
		scaleOverride : false,
		scaleSteps : window.scaleSteps,
		scaleStepWidth : window.scaleStepWidth,
		scaleStartValue : window.scaleStartValue,
		scaleLineColor : "rgba(0,0,0,0)",			
		scaleLineWidth : 1,
		scaleShowLabels : true,			
		scaleLabel : "<%=value%>",			
		scaleFontFamily : "'Helvetica'",			
		scaleFontSize : 12,			
		scaleFontStyle : "normal",			
		scaleFontColor : "#838285",				
		scaleShowGridLines : false,			
		scaleGridLineColor : "rgba(0,0,0,.05)",	
		scaleGridLineWidth : 1,				
		bezierCurve : true,
		pointDot : true,			
		pointDotRadius : 2,			
		pointDotStrokeWidth : 1,			
		datasetStroke : true,			
		datasetStrokeWidth : 2,			
		datasetFill : true,			
		animation : true,
		animationSteps : 60,			
		animationEasing : "easeOutQuart",
		onAnimationComplete : null			
	}
	var lineChartData = {
		labels : datas['y'],
		datasets : datasets			
	}
	var myLine = new Chart(document.getElementById("linechart").getContext("2d")).Line(lineChartData,options);
	window.slideval = lineChartData.datasets;
}

function barChart(datas){
	$("#compare").kendoChart({
	    axisDefaults: {
	        majorGridLines: {visible: false}, majorTicks: {visible: false}},
		legend: {visible: false},
		seriesDefaults: {
		    type: "column",
	        stack: true,
	        border: {width: 0},
	        overlay: {gradient: "none"}
		},
		series: datas['data'],
		valueAxis: {
		    max: 140000,
		    line: {visible: false},
		    minorGridLines: {visible: false}
		},
		categoryAxis: {
		    categories: datas['cat'],
		    majorGridLines: {visible: false}
		},
	    tooltip: {
	        visible: true,
			template: function(e){
				var id = barData(e);
				action(id, loaddata, 'bar');
	      		return e.series['name'] + ': ' + output(e.value,0); 
			}
	    },
	    valueAxis: {
	        visible: false
	    },
	    legend: { visible: false }
	});		
}

function barData(getData){	
	var dataItem = getData['dataItem'];
	var data = getData['series']['data'];
	var thatid;
	$.each(data, function(k,v){
		if(v == dataItem){
			thatid = getData['series']['ids'][k];
		}
	});
	return thatid;
}

function output(number, dec)	{
	number = (isNaN(number))? 0 : number;
    number = number.toFixed(dec) + '';
    x = number.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

function setArrow(that, data){
	data = output(data, 0);
	$(that).removeClass('down').removeClass('up').removeClass('green');
	if (data <= -1){			
		$(that).addClass('down');
	} else if (data >= 1 && data <= 99.9){			
		$(that).addClass('up');
	} else {		
		$(that).addClass('green');
	}
}

function setTitle(data){
	$('.main_title').text(data['title']);
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////// - New Stuff

function truncate(str, n, useWordBoundary) {
    var singular, tooLong = str.length > n;
    useWordBoundary = useWordBoundary || true;
    // Edge case where someone enters a ridiculously long string.
    str = tooLong ? str.substr(0, n-1) : str;
    singular = (str.search(/\s/) === -1) ? true : false;
    if(!singular) {
      str = useWordBoundary && tooLong ? str.substr(0, str.lastIndexOf(' ')) : str;
    }
    str = str.replace(',','');
    return  tooLong ? str + '...' : str;
}

function pieCompare(data){
	config = {
		id:['Lpie', 'Rpie'],
		pcnt:['.Lpcnt', '.Rpcnt'],
		target:['.home', '.away']
	};

	temp = [];
	pcntContainer = '';
	$.each(data, function(k,v){
		var total = data['total'][k].sum();
			pieChart(v, config['id'][k]);
			pcntContainer = '';
			$.each(v, function(k2,v2){
				diffPcnt = (v2['value']/total) * 100;
				pcntContainer += '<dl class="column"><dt class="grey50">'+v2['title']+'</dt><dd class="pcnt large" style="color: '+v2['color']+';">'+output(diffPcnt)+'%</dd><dd class="small">'+output(v2['value'])+'</dd></dl>';
				$(config['target'][k]+'.title').text(v2['cat']);
				$(config['target'][k]+'.subtitle').text(v2['cat']);
				temp[k2] = v2['title'];
			});		
			$(config['pcnt'][k]).html(pcntContainer);
		
	});
	slider(temp, "vertical", 'vslider'); // Load Slider
	// console.log($('.Lpcnt').height());		
}

function pieSummary(data, index){
	index = (typeof index != 'undefined')? index: 0;
	var c = pusher.color(window.seriecolor[0][index]);
	filter = data[index]; // filter by cat
	config = {
		id:['Bpie', 'Rpie'],
		pcnt:['.BLpcnt', '.BRpcnt'],
		totalc:['.BLtotal', '.BRtotal'],
		target:['.home_diff ', '.away_diff ']
	};
	var total = data['total'][index].sum();
	temp = [];
	$.each(filter, function(k,v){
		color = c.tint(-(k*0.5)).hex6();
		filter[k]['color'] = color;
		diffPcnt = (v['value']/total) * 100;
		pcntContainer = '<dl class="column"><dt class="grey50"><span class="home subtitle">'+v['title']+'</span></dt><dd class="'+config['pcnt'][k]+' large" style="color: '+color+';">'+output(diffPcnt)+'%</dd><dd class="'+config['totalc'][k]+' small">'+output(v['value'])+'</dd></dl>';
		$(config['target'][k]).html(pcntContainer);
	});
	pieChart(filter, config['id'][0]);
}

function projection(data, index){
	// console.log(data, index)
	target = ['.home', '.away'];
	index = (typeof index != 'undefined')? index: 0; // discharge = 0, death = 1
	$.each(data, function(k,v){
		if(typeof v == 'object'){
			dt = v['dataset'][index];
			now = dt['now'];
			bfr = dt['bfr'];
			aft = dt['aft'];
			diffBfr = bfr+now;
			diffBfrPcnt = ((bfr/now) * 100)-100;
			diffAft = aft - now;
			diffAftPcnt = ((aft/now) * 100)-100;
			$.each(v, function(k2,v2){
// title
				if(typeof(v2) == 'object'){
					$.each(v2[index], function(k3,v3){
						$(target[k]+" ."+k3).text(v3);
						if(k3 == 'now'){ // 100% marker
							diff = now;
							diffPcnt = (now/now) * 100;
						} else {
							if(v3 == 0){
								diffPcnt = 0;
							} else {
								diff = now-v3;
								diffPcnt = ((diff/now) * 100);								
							}
						}
						var push = $(target[k]+" ."+k3+"_pcnt"); // left / right
						$(push).text(output(diffPcnt, 0)+"%");
						setArrow(push, diffPcnt);
					});
				} 
			});
		} else {
			$(".index_after").text(data['indexAft']);
			$(".index_current").text(data['index']);
			$(".index_before").text(data['indexBfr']);
		}
		$('.year_timeline span').css("color", window.seriecolor[0][index]);
	});

}


function populate(data, id, type, index){
	// populate for pie, line, bar, summary
	indexid = (id.length > 1)? id[0]: id;
	index = (typeof index != 'undefined')? index : data['d'][indexid]['s'][0][0].length-1;

	switch(type){
		case 'line':
			var series = data['d'][id];
			var datas = {
				cat: data['t'], catName: data['n'], name: series['a']['n'], title: series['a']['t'], x: data['h'][0], y: data['h'][1], dd: {0: series['s'][0][0], 1: series['s'][0][1]}
			}
		break;
		case 'pie':
			temp= [], temp3= [], cat= [];
			$.each(id, function(k,v){
				var series = data['d'][v];
				temp[k]= [], temp2= [];
				cat[k] = truncate(series['a']['t'],30,true);
				$.each(data['h'][0], function(k2,v2){
					temp2[k2] = series['s'][0][k2][index];
					temp[k][k2] =  {
						value: series['s'][0][k2][index], color: window.seriecolor[0][k2], cat: cat[k], title: v2
					}
				});
				temp3[k] = temp2;
			});
			temp['total'] = temp3;
			datas = temp;
		break;
		case 'bar':
			// if(typeof id != 'undefined'){
			temp= [], cat= [], ids= [], dataset= [];
			$.each(data['h'][0], function(k2,v2){
				temp[k2] = [];
				$.each(id, function(k,v){
					var series = data['d'][v];
					temp[k2][k] = series['s'][0][k2][index];
					cat[k] = truncate(series['a']['t'],30,true);
					ids[k] = v;
				});
				dataset[k2] = {
					color: window.seriecolor[0][k2], data: temp[k2], name: v2, ids: ids
				}
			});
			datas = {data: dataset, cat: cat};
			// }
		break;
		case 'projection':
			temp = {
				index: data['h'][1][index],
				indexAft: (typeof data['h'][1][index+1] != 'undefined')? data['h'][1][index+1]: 'NA',
				indexBfr: (typeof data['h'][1][index-1] != 'undefined')? data['h'][1][index-1]: 'NA'
			}
			$.each(id, function(k,v){
				var series = data['d'][v];
				cat[k] = truncate(series['a']['t'],30,true);
				var dataset = {title: data['h'][0]}
				$.each(series['s'][0], function(k2,v2){
					now = v2[index];
					aft = (typeof v2[index+1] != 'undefined')? v2[index+1]: 0;
					bfr = (typeof v2[index-1] != 'undefined')? v2[index-1]: 0;
					dataset[k2] = {now: now, bfr: bfr, aft: aft}
				});
				temp[k] = {cat: cat[k], dataset: dataset}
			});
			datas = temp;
		break;
		case 'pieSummary':	
			temp= [], temp3= [], cat= [];
			$.each(data['h'][0], function(k2,v2){
				temp[k2] = [], temp2 = [];
				$.each(id, function(k,v){
					var series = data['d'][v];
					cat[k2] = truncate(series['a']['t'],30,true);
					temp2[k] = series['s'][0][k2][index];
					temp[k2][k] =  {
						value: series['s'][0][k2][index], cat: v2, title: cat[k2]
					}
				});
				temp3[k2] = temp2;
			});
			temp['total'] = temp3;
			datas = temp;
		break;
		default:
		break;
	}
	// calculate here!
	return datas;
}

function slider(data, orientation, type){
	orientation = (orientation)? orientation: "horizontal";
	var list = '';
	index = [];
	$.each(data, function(k,v){
		list += '<li data-index="'+k+'">'+v+'</li>';
		index[k] = k;
	});
	$('.'+orientation+' .marker').html(list);			

	var slider = $('.'+orientation+" .slider" ).slider({
		orientation: orientation,
		value: index.max(), //slider default value
		min: index.min(),
		max: index.max(),
		step: 1,
		slide: function( event, ui ) {

			if(type == 'onload') {
				action(window.loadId, loaddata, 'slider', ui.value);
// console.log(window.vertIndex);
// 				if(typeof window.vertIndex != 'undefined'){
// 					$(".vslider .slider").hide();
// 				}
			} 

			if(type == 'vslider') {
				// console.log(window.loadId[1], loaddata)
// to be edited - window.loadId[1]
				var pushid = (typeof window.pushId != 'undefined')? window.pushId: window.loadId[1];

			// console.log(pushid)
				window.vertIndex =  index.max() - ui.value;
				action(pushid, loaddata, 'vslider', window.vertIndex);
			} 

		}

	});
}

function action(id, data, type, index){
	if(type == 'onload'){
		var linedata = populate(data, id[0], 'line');
		setTitle(linedata);
		lineChart(linedata); // Load Line Chart
		slider(linedata['y'], "horizontal", type); // Load Slider

		var bardata = populate(data, id, 'bar');
		barChart(bardata); // Load Bar Charts
		
		var allid = [id[0], id[1]];
		var piedata = populate(data, allid, 'pie');
		pieCompare(piedata); // Load Pie Chart
		
		var projectdata = populate(data, allid, 'projection');
		projection(projectdata); //load report projection summary

		var pieSdata = populate(data, allid, 'pieSummary');
		pieSummary(pieSdata); // Load Pie Chart		
	}
	if(type == 'slider'){
		// Load Bar Chart
		var bardata = populate(loaddata, id, 'bar', index);
		barChart(bardata);

		// Load Pie Chart
		var allid = [id[0], id[1]];
		var piedata = populate(loaddata, allid, 'pie', index);
		pieCompare(piedata);

		var projectdata = populate(loaddata, allid, 'projection', index);
		projection(projectdata); //load report projection summary

		var pieSdata = populate(loaddata, allid, 'pieSummary', index);
		pieSummary(pieSdata); // Load Pie Chart

		window.hIndex =  index;
	}
	if(type == 'vslider'){
		var allid = [window.loadId[0], id];		

// index vs vindex
		var projectdata = populate(loaddata, allid, 'projection', window.hIndex);
		projection(projectdata, index); //load report projection summary


		var pieSdata = populate(loaddata, allid, 'pieSummary', window.hIndex);
		pieSummary(pieSdata, index); // Load Pie Chart

		// console.log(index, window.hIndex);
	}
	if(type == 'bar'){
		var allid = [window.loadId[0], id];
		var piedata = populate(loaddata, allid, 'pie', window.hIndex);
		pieCompare(piedata);

// index vs vindex
		var projectdata = populate(loaddata, allid, 'projection', window.hIndex);
		projection(projectdata, index); //load report projection summary

		var pieSdata = populate(loaddata, allid, 'pieSummary', index);
		pieSummary(pieSdata); // Load Pie Chart

		window.pushId = id; //parse to vslider
	}
}