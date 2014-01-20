function pie(data, target) {
	var options = {		
		segmentShowStroke : false,	
		segmentStrokeColor : "#fff",	
		segmentStrokeWidth : 20,	
		animation : true,	
		animationSteps : 60,	
		animationEasing : "easeOutBounce",	
		animateRotate : true,
		animateScale : true,	
		onAnimationComplete : null
	}
	new Chart(document.getElementById(target).getContext("2d")).Pie(data, options);	
	$('#'+target).attr("width","100").attr("height","100"); //forced size
}


function linechart(datas){
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
		scaleFontColor : "#666",				
		scaleShowGridLines : false,			
		scaleGridLineColor : "rgba(0,0,0,.05)",	
		scaleGridLineWidth : 1,				
		bezierCurve : true,			
		pointDot : true,			
		pointDotRadius : 3,			
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
		labels : ["2008","2009","2010","2011","2012","2013"],
		datasets : [
			{
				fillColor : "#1c638d",
				strokeColor : "#454447",
				pointColor : "#ffffff",
				pointStrokeColor : "#454447",
				data : datas[0][0]['data']
			},
			{
				fillColor : "#4DA3D5",
				strokeColor : "#454447",
				pointColor : "#ffffff",
				pointStrokeColor : "#454447",
				data : datas[0][1]['data']
			}
		]			
	}
	var myLine = new Chart(document.getElementById("linechart").getContext("2d")).Line(lineChartData,options);
	window.slideval = lineChartData.datasets;
}

function loadDiffHome(penduduk,belia,belia_diff,belia_diff_pcnt,belia_diff_bfr,belia_diff_bfr_pcnt,belia_diff_aft,belia_diff_aft_pcnt){
	$(".belia_total").text(output(belia,0));
	$(".pop_total").text(output(penduduk,0));
	$(".belia_pcnt").text(output(belia_diff_pcnt,0)+'%');
	$(".pop_pcnt").text(output((100 - belia_diff_pcnt),0)+'%');

	$(".belia_diff").text(output(belia_diff,0));
	$(".belia_diff_pcnt").text(output(belia_diff_pcnt,0)+'%');

	$(".belia_diff_bfr").text(output(belia_diff_bfr,0));
	$(".belia_diff_bfr_pcnt").text(output(belia_diff_bfr_pcnt,0)+'%');

	$(".belia_diff_aft").text(output(belia_diff_aft,0));
	$(".belia_diff_aft_pcnt").text(output(belia_diff_aft_pcnt,0)+'%');

	if(belia_diff_bfr < 0){
		$('.home .belia_diff_bfr_pcnt').removeClass('up').addClass('down');
	} else {
		$('.home .belia_diff_bfr_pcnt').removeClass('down').addClass('up');
	}
	if(belia_diff_aft < 0){
		$('.home .belia_diff_aft_pcnt').removeClass('up').addClass('down');
	} else {
		$('.home .belia_diff_aft_pcnt').removeClass('down').addClass('up');
	}	
}


function calculate(min, yearindex, dataset){
	var index = yearindex - min;

	var penduduk, penduduk_bfr, penduduk_aft, belia_diff, belia_diff_pcnt, belia_diff_bfr, belia_diff_bfr_pcnt, belia_diff_aft, belia_diff_aft_pcnt;

	penduduk 			= dataset[0]['data'][index];
	window.belia 		= dataset[1]['data'][index];
	penduduk_bfr 		= dataset[0]['data'][index-1];
	window.belia_bfr 	= dataset[1]['data'][index-1];
	penduduk_aft 		= dataset[0]['data'][index+1];
	window.belia_aft 	= dataset[1]['data'][index+1];

	// console.log(dataset);

	// $.each(dataset, function(key, val){
	// 	penduduk		= dataset[0]['data'][index];
	// 	window.belia	= dataset[1]['data'][index];		
	// });

	belia_diff = penduduk - belia;
	belia_diff_pcnt = (belia/penduduk) * 100;
	belia_diff_bfr = belia_bfr-belia;
	belia_diff_bfr_pcnt = ((belia_bfr/belia) * 100)-100;
	belia_diff_aft = belia_aft - belia;
	belia_diff_aft_pcnt = ((belia_aft/belia) * 100)-100;

	var piedata = [
		{value: belia_diff, color: "#1c638d"},
		{value: belia, color:"#4DA3D5"}
	];
	pie(piedata, 'pie');

	loadDiffHome(penduduk,belia,belia_diff,belia_diff_pcnt,belia_diff_bfr,belia_diff_bfr_pcnt,belia_diff_aft,belia_diff_aft_pcnt);
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

function bar(stats_set,datas,thisyear){
	var cat = Array();
	var Bbelia = Array();
	var Bpenduduk = Array();

	var index = (typeof thisyear != 'undefined')? ((thisyear-window.min_year)): (window.year-window.min_year);
	var bardata = Array();

	for (var i = 0; i < stats_set; i++) {
		cat.push((datas[i][2]['district'])? datas[i][2]['district'] : datas[i][3]['state']);
		Bbelia.push(datas[i][1]['data'][index]);
		Bpenduduk.push(datas[i][0]['data'][index]);
	};

	$("#compare").kendoChart({
	    axisDefaults: {
	        majorGridLines: { visible: false },
	        majorTicks: { visible: false }
	    },
		legend: {
		    visible: false
		},
		seriesDefaults: {
		    type: "column",
	        stack: true,
	        border: {
	            width: 0
	        },
	        overlay: {
	            gradient: "none"
	        }
		},
		series: [{
		    name: "Belia",
		    data: Bbelia,
	        color: "#4DA3D5"
		}, {
	        name: "Penduduk",
	        data: Bpenduduk,
	        color: "#1C638D"
	    }],
		valueAxis: {
		    max: 140000,
		    line: {
		        visible: false
		    },
		    minorGridLines: {
		        visible: false
		    }
		},
		categoryAxis: {
		    categories: cat,
		    majorGridLines: {
		        visible: false
		    }
		},
	    tooltip: {
	        visible: true,
			template: function(e){
				window.comparex = 0;
				setSparklines(e.category);
	      		return e.series['name'] + ': ' + output(e.value,0); 
			}
	    },
	    valueAxis: {
	        visible: false
	    },
	    legend: { visible: false }
	});		
}



function setSparklines(getData){
	var pushdata;
	window.pushdatas = [];
	pushdata = window.loaddata.filter(function (d) {
		return d.state == getData;
	});
	$.each(pushdata, function(key, val){
		pushdatas[key]= [{data: val.penduduk}, {data: val.belia}, {district: val.district}, {state: val.state}];
	});
	pushSparklines(window.stats_set, window.pushdatas, window.min_year, window.selected_year);
}

function pushSparklines(stats_set, getdata, min_year, thisyear){
	var thisdata = (typeof window.pushdatas == 'undefined')? getdata : window.pushdatas;

	var Bbelia = thisdata[window.comparex][1]['data'];
	var BPenduduk = thisdata[window.comparex][0]['data'];
	var index = (typeof thisyear != 'undefined')? ((thisyear-window.min_year)): (window.year-window.min_year);

	var piedata = [
		{value: (BPenduduk[index]-Bbelia[index]), color: "#1c638d"},
		{value: Bbelia[index], color:"#4DA3D5"}
	];

	pie(piedata, 'cpie');

	var title = (thisdata[window.comparex][2]['district'])? thisdata[window.comparex][2]['district'] : thisdata[window.comparex][3]['state'];
	$('.thatdistrict').text(title);

	var belia = Bbelia[index];
	var belia_bfr = Bbelia[index-1];
	var belia_aft = Bbelia[index+1];

	var belia_diff_bfr = veriNum(belia_bfr-belia);
	var belia_diff_aft = veriNum(belia_aft-belia);
	var belia_diff_bfr_pcnt = veriNum(((belia_bfr/belia) * 100)-100);
	var belia_diff_aft_pcnt = veriNum(((belia_aft/belia) * 100)-100);

	var belia_diff_pcnt = (Bbelia[index]/BPenduduk[index]) * 100;

	$(".Bbelia_total").text(output(Bbelia[index]));
	$(".Bpop_total").text(output(BPenduduk[index]));
	$(".Bbelia_pcnt").text(output(belia_diff_pcnt,0)+'%');
	$(".Bpop_pcnt").text(output((100 - belia_diff_pcnt),0)+'%');

	$(".Bbelia_diff_bfr").text(output(belia_diff_bfr));
	$(".Bbelia_diff_aft").text(output(belia_diff_aft));
	$(".Bbelia_diff_bfr_pcnt").text(output(belia_diff_bfr_pcnt)+'%');
	$(".Bbelia_diff_aft_pcnt").text(output(belia_diff_aft_pcnt)+'%');


	var home_total = window.belia;
	var away_total = Bbelia[index];
	var home_pcnt = (home_total/(home_total + away_total)) * 100;
	var away_pcnt = (away_total/(home_total + away_total)) * 100;

	var Dpiedata = [
		{value: away_total, color:"#103636"},
		{value: home_total, color: "#108F97"}
	];

	pie(Dpiedata, 'Dpie');

	$(".home_diff .Dbelia_diff_total").text(output(home_total));
	$(".away_diff .Dbelia_diff_total").text(output(away_total));
	$(".home_diff .Dbelia_diff_pcnt").text(output(home_pcnt)+'%');
	$(".away_diff .Dbelia_diff_pcnt").text(output(away_pcnt)+'%');

	if(belia_diff_bfr < 0){
		$('.away .Bbelia_diff_bfr_pcnt').removeClass('up').addClass('down');
	} else {
		$('.away .Bbelia_diff_bfr_pcnt').removeClass('down').addClass('up');
	}
	if(belia_diff_aft < 0){
		$('.away .Bbelia_diff_aft_pcnt').removeClass('up').addClass('down');
	} else {
		$('.away .Bbelia_diff_aft_pcnt').removeClass('down').addClass('up');
	}	
}

function veriNum(z){
	return (z != 'Infinity')? z: 0;
}

function summary(stats_set,datas,val){
	bar(stats_set,datas,val);
	pushSparklines(window.stats_set, datas, window.min_year, val);

	if(typeof val != 'undefined'){
		$('.widget_tahun').html(val);
		$('.widget_tahun_prev').html(val-1);
		$('.widget_tahun_aft').html(val+1);		
	}
}

function getYearBfr(){
	$('.getYearBfr').tooltip({ content: "Awesome title!" });
}
function getYearAft(){
	$('.getYearAft').tooltip({ content: "Awesome title!" });

}

