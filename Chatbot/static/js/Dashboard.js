queue()
    .defer(d3.csv, 'https://raw.githubusercontent.com/bprash/Hello/master/sales_data_sample.csv')
    .await(makeGraphs);

function makeGraphs(error, apiData) {
	if (chartdisplayed == true){
		d3.csv('https://raw.githubusercontent.com/bprash/Hello/master/sales_data_sample.csv', function(apiData){
			console.log('entered')
		var dataSet = apiData;
		console.log(dataSet)
		var dateFormat = d3.time.format("%m/%d/%Y");
		dataSet.forEach(function(d) {
			d.ORDERDATE = dateFormat.parse(d.ORDERDATE);
					d.ORDERDATE.setDate(1);
			d.QUANTITYORDERED = +d.QUANTITYORDERED;
			d.ORDERNUMBER = + d.ORDERNUMBER;

		});

		//Create a Crossfilter instance
		var ndx = crossfilter(dataSet);

		//Define Dimensions
		var dateOrdered = ndx.dimension(function(d) { return d.ORDERDATE; });
		var gradeLevel = ndx.dimension(function(d) { return d.DEALSIZE; });
		var resourceType = ndx.dimension(function(d) { return d.PRODUCTLINE; });
		var fundingStatus = ndx.dimension(function(d) { return d.STATUS; });
		var povertyLevel = ndx.dimension(function(d) { return d.poverty_level; });
		var state = ndx.dimension(function(d) { return d.STATE; });
		var totalDonations  = ndx.dimension(function(d) { return d.SALES; });


		//Calculate metrics
		var itemsByDate = dateOrdered.group(); 
		var projectsByGrade = gradeLevel.group(); 
		var projectsByResourceType = resourceType.group();
		var projectsByFundingStatus = fundingStatus.group();
		var projectsByPovertyLevel = povertyLevel.group();
		var stateGroup = state.group();

		var all = ndx.groupAll();

		//Calculate Groups
		var totalDonationsState = state.group().reduceSum(function(d) {
			return d.SALES;
		});

		var totalDonationsGrade = gradeLevel.group().reduceSum(function(d) {
			return d.DEALSIZE;
		});

		var totalDonationsFundingStatus = fundingStatus.group().reduceSum(function(d) {
			return d.STATUS;
		});



		var netTotalDonations = ndx.groupAll().reduceSum(function(d) {return d.SALES;});

		//Define threshold values for data
		var minDate = dateOrdered.bottom(1)[0].ORDERDATE;
		var maxDate = dateOrdered.top(1)[0].ORDERDATE;

	console.log(minDate);
	console.log(maxDate);

	    //Charts
		var dateChart = dc.lineChart("#date-chart");
		var gradeLevelChart = dc.rowChart("#grade-chart");
		var resourceTypeChart = dc.rowChart("#resource-chart");
		var fundingStatusChart = dc.pieChart("#funding-chart");
		var povertyLevelChart = dc.rowChart("#poverty-chart");
		var totalProjects = dc.numberDisplay("#total-projects");
		var netDonations = dc.numberDisplay("#net-donations");
		var stateDonations = dc.barChart("#state-donations");


	  selectField = dc.selectMenu('#menuselect')
	        .dimension(state)
	        .group(stateGroup); 

	       dc.dataCount("#row-selection")
	        .dimension(ndx)
	        .group(all);


		totalProjects
			.formatNumber(d3.format("d"))
			.valueAccessor(function(d){return d; })
			.group(all);

		netDonations
			.formatNumber(d3.format("d"))
			.valueAccessor(function(d){return d; })
			.group(netTotalDonations)
			.formatNumber(d3.format(".3s"));

		dateChart
			//.width(600)
			.height(220)
			.margins({top: 10, right: 50, bottom: 30, left: 50})
			.dimension(dateOrdered)
			.group(itemsByDate)
			.renderArea(true)
			.transitionDuration(500)
			.x(d3.time.scale().domain([minDate, maxDate]))
			.elasticY(true)
			.renderHorizontalGridLines(true)
	    	.renderVerticalGridLines(true)
			.xAxisLabel("Year")
			.yAxis().ticks(6);

		resourceTypeChart
	        //.width(300)
	        .height(220)
	        .dimension(resourceType)
	        .group(projectsByResourceType)
	        .elasticX(true)
	        .xAxis().ticks(5);

		povertyLevelChart
			//.width(300)
			.height(220)
	        .dimension(povertyLevel)
	        .group(projectsByPovertyLevel)
	        .xAxis().ticks(4);

		gradeLevelChart
			//.width(300)
			.height(220)
	        .dimension(gradeLevel)
	        .group(projectsByGrade)
	        .xAxis().ticks(4);

	  
	          fundingStatusChart
	            .height(220)
	            //.width(350)
	            .radius(90)
	            .innerRadius(40)
	            .transitionDuration(1000)
	            .dimension(fundingStatus)
	            .group(projectsByFundingStatus);


	    stateDonations
	    	//.width(800)
	        .height(220)
	        .transitionDuration(1000)
	        .dimension(state)
	        .group(totalDonationsState)
	        .margins({top: 10, right: 50, bottom: 30, left: 50})
	        .centerBar(false)
	        .gap(5)
	        .elasticY(true)
	        .x(d3.scale.ordinal().domain(state))
	        .xUnits(dc.units.ordinal)
	        .renderHorizontalGridLines(true)
	        .renderVerticalGridLines(true)
	        .ordering(function(d){return d.value;})
	        .yAxis().tickFormat(d3.format("s"));






	    dc.renderAll();
	})	
}else{
	$('#container').empty();
	// document.getElementById("#container").style.display = "none"
	
	d3.csv('https://raw.githubusercontent.com/bprash/Hello/master/sampledata.csv', function(apiData){
			console.log('entered')
		var dataSet = apiData;
		console.log(dataSet)
		var dateFormat = d3.time.format("%m/%d/%Y");
		dataSet.forEach(function(d) {
			d.ORDERDATE = dateFormat.parse(d.ORDERDATE);
					d.ORDERDATE.setDate(1);
			d.SALES = +d.SALES;
		});

		//Create a Crossfilter instance
		var ndx = crossfilter(dataSet);

		//Define Dimensions
		var dateOrdered = ndx.dimension(function(d) { return d.ORDERDATE; });
		var gradeLevel = ndx.dimension(function(d) { return d.DEALSIZE; });
		var resourceType = ndx.dimension(function(d) { return d.PRODUCTLINE; });
		var fundingStatus = ndx.dimension(function(d) { return d.STATUS; });
		var povertyLevel = ndx.dimension(function(d) { return d.poverty_level; });
		var state = ndx.dimension(function(d) { return d.STATE; });
		var totalDonations  = ndx.dimension(function(d) { return d.SALES; });


		//Calculate metrics
		var itemsByDate = dateOrdered.group(); 
		var projectsByGrade = gradeLevel.group(); 
		var projectsByResourceType = resourceType.group();
		var projectsByFundingStatus = fundingStatus.group();
		var projectsByPovertyLevel = povertyLevel.group();
		var stateGroup = state.group();

		var all = ndx.groupAll();

		//Calculate Groups
		var totalDonationsState = state.group().reduceSum(function(d) {
			return d.SALES;
		});

		var totalDonationsGrade = gradeLevel.group().reduceSum(function(d) {
			return d.DEALSIZE;
		});

		var totalDonationsFundingStatus = fundingStatus.group().reduceSum(function(d) {
			return d.STATUS;
		});



		var netTotalDonations = ndx.groupAll().reduceSum(function(d) {return d.SALES;});

		//Define threshold values for data
		var minDate = dateOrdered.bottom(1)[0].ORDERDATE;
		var maxDate = dateOrdered.top(1)[0].ORDERDATE;

	console.log(minDate);
	console.log(maxDate);

	    //Charts
		var dateChart = dc.lineChart("#date-chart");
		var gradeLevelChart = dc.rowChart("#grade-chart");
		var resourceTypeChart = dc.rowChart("#resource-chart");
		var fundingStatusChart = dc.pieChart("#funding-chart");
		var povertyLevelChart = dc.rowChart("#poverty-chart");
		var totalProjects = dc.numberDisplay("#total-projects");
		var netDonations = dc.numberDisplay("#net-donations");
		var stateDonations = dc.barChart("#state-donations");


	  selectField = dc.selectMenu('#menuselect')
	        .dimension(state)
	        .group(stateGroup); 

	       dc.dataCount("#row-selection")
	        .dimension(ndx)
	        .group(all);


		totalProjects
			.formatNumber(d3.format("d"))
			.valueAccessor(function(d){return d; })
			.group(all);

		netDonations
			.formatNumber(d3.format("d"))
			.valueAccessor(function(d){return d; })
			.group(netTotalDonations)
			.formatNumber(d3.format(".3s"));

		dateChart
			//.width(600)
			.height(220)
			.margins({top: 10, right: 50, bottom: 30, left: 50})
			.dimension(dateOrdered)
			.group(itemsByDate)
			.renderArea(true)
			.transitionDuration(500)
			.x(d3.time.scale().domain([minDate, maxDate]))
			.elasticY(true)
			.renderHorizontalGridLines(true)
	    	.renderVerticalGridLines(true)
			.xAxisLabel("Year")
			.yAxis().ticks(6);

		resourceTypeChart
	        //.width(300)
	        .height(220)
	        .dimension(resourceType)
	        .group(projectsByResourceType)
	        .elasticX(true)
	        .xAxis().ticks(5);

		povertyLevelChart
			//.width(300)
			.height(220)
	        .dimension(povertyLevel)
	        .group(projectsByPovertyLevel)
	        .xAxis().ticks(4);

		gradeLevelChart
			//.width(300)
			.height(220)
	        .dimension(gradeLevel)
	        .group(projectsByGrade)
	        .xAxis().ticks(4);

	  
	          fundingStatusChart
	            .height(220)
	            //.width(350)
	            .radius(90)
	            .innerRadius(40)
	            .transitionDuration(1000)
	            .dimension(fundingStatus)
	            .group(projectsByFundingStatus);


	    stateDonations
	    	//.width(800)
	        .height(220)
	        .transitionDuration(1000)
	        .dimension(state)
	        .group(totalDonationsState)
	        .margins({top: 10, right: 50, bottom: 30, left: 50})
	        .centerBar(false)
	        .gap(5)
	        .elasticY(true)
	        .x(d3.scale.ordinal().domain(state))
	        .xUnits(dc.units.ordinal)
	        .renderHorizontalGridLines(true)
	        .renderVerticalGridLines(true)
	        .ordering(function(d){return d.value;})
	        .yAxis().tickFormat(d3.format("s"));






	    dc.renderAll();
	})	}
	//Start Transformations
		

	};