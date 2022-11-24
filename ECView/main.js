const margin = { top: 10, right: 40, bottom: 10, left: 40 };
let svg;
let onLoad = () => {
	svg = d3.select('#svg1').append('g')
		.attr("id","chart_g")
		.attr('transform', `translate(${margin.left}, ${margin.top})`);	
}

let twitter_csv,twitter_json;
let formatDate = d3.timeFormat("%Y-%m-%d");
let formatTime = d3.timeFormat("%H:%M");


let totalTime = temp => {
	let [hours, minutes] = temp.split(':');
	let tot=Number(hours)*60+Number(minutes);
	return tot;
}

let convertTime = temp => {
	let [hours, minutes] = temp.split(':');
	if (hours === '0') {
	   hours = '00';
	}
	if (hours === '1') {
		hours = '01';
	}
	if (hours === '2') {
		hours = '02';
	 } 
	 if (hours === '3') {
		hours = '03';
	 }
	 if (hours === '4') {
		hours = '04';
	 }
	 if (hours === '5') {
		hours = '05';
	 }
	 if (hours === '6') {
		hours = '06';
	 }
	 if (hours === '7') {
		hours = '07';
	 }
	 if (hours === '8') {
		hours = '08';
	 }
	 if (hours === '9') {
		hours = '09';
	 }
	return `${hours}:${minutes}`;
 };

 let convertDate = temp => {
	let [month,date,year] = temp.split("/");
	if (date === '1') {
		date = '01';
	}
	if (date === '2') {
		date = '02';
	 } 
	 if (date === '3') {
		date = '03';
	 }
	 if (date === '4') {
		date = '04';
	 }
	 if (date === '5') {
		date = '05';
	 }
	 if (date === '6') {
		date = '06';
	 }
	 if (date === '7') {
		date = '07';
	 }
	 if (date === '8') {
		date = '08';
	 }
	 if (date === '9') {
		date = '09';
	 }
	return `${year}-${month}-${date}`;
 };

 
function convDate(text)
{
	const myArray=text.split(" ");
	const datestamp=convertDate(myArray[0]);
	const timestamp=convertTime(myArray[1]);
	//let time=datestamp+"T"+timestamp;
	let time=`${datestamp}T00:00`;
	let d=new Date(time);
	return d;
}
  
function convTime(text)
{
	const myArray=text.split(" ");
	const datestamp=convertDate(myArray[0]);
	let total_time=totalTime(myArray[1]);
	let timestamp=convertTime(myArray[1]);
	let time=datestamp+"T"+timestamp;
	//console.log(total_time)
	//let d=new Date(time).getHours();
	return total_time;
}

document.addEventListener('DOMContentLoaded', function () {
   
    Promise.all([d3.csv('twitter_data_pro.csv',function(d) {
											return {
													Event_Name: d['Event Name'],
													Latitude: +d.Latitude,
													Longitude: +d.Longitude,													
													//Tweet_Latitude: +d.Tweet_Latitude,
													//Tweet_Longitude: +d.Tweet_Longitude,
													//Event_Latitude: +d.Event_Latitude,
													//Event_Longitude: +d.Event_Longitude,
													Tweet_Datestamp: convDate(d['Tweet Timestamp']),
													Tweet_Timestamp: convTime(d['Tweet Timestamp']),
													Event_Datestamp: convDate(d['Event Timestamp']),
													Event_Timestamp: convTime(d['Event Timestamp']),
													Category: d['Category (for our reference)'],
													Emotions: d['Emotion'],
													Uncertainity: +d['Uncertainity'],
													Hashtags: d['Hashtags'],
													NPMI: +d['NPMI'],
													Link_Ratio: +d.Link_Ratio,
													Hashtag_Ratio: +d.Hashtag_Ratio,
													User_Credibility: +d.User_Credibility,
													User_Diversity:	+d['User_Diversity'],
													Degree_Centrality:	+d['Degree_Centrality'],
													Tweet_Similarity: +d['Tweet_Similarity'],
													PMI: +d['PMI']
												};
											})
				])	
        .then(function(values) {
            console.log('loaded twitter_data.csv and twitter_data.json');
            twitter_csv=values[0];
			//console.log(twitter_csv);
            getDateRange(twitter_csv);
		});
		
});

function getDateRange(twitter_csv)
{
	let start_date_str=d3.select("#d_start").property('value');
	let [s_year,s_month,s_date] = start_date_str.split('-');
	let start_date = new Date(+s_year, +s_month-1, +s_date);
	let end_date_str=d3.select("#d_end").property('value');
	let [e_year,e_month,e_date] = end_date_str.split('-');
	let end_date = new Date(+e_year, +e_month-1, +e_date);
	
	let delta=end_date.getTime()-start_date.getTime();

	let tweet_date=d3.extent(twitter_csv, a => a.Tweet_Datestamp);
	let event_date=d3.extent(twitter_csv, a => a.Event_Datestamp);
	let tweet_time=d3.extent(twitter_csv, a => a.Tweet_Timestamp);
	let event_time=d3.extent(twitter_csv, a => a.Event_Timestamp);
	//let start=event_date[0],stop=event_date[1],begin=event_time[0],end=event_time[1];

	let start,stop,begin,end;
	
	if(start_date>=event_date[0] || start_date>=tweet_date[0] && delta>0)
	{
		document.getElementById("st_demo").innerHTML="";
		start=start_date;
	}
	else
	{

			document.getElementById("st_demo").innerHTML="Start date: "+start_date_str + " not in range";
			//console.log("Start date not in Range");
			if(tweet_date[0]<event_date[0])
			{
				start=tweet_date[0];
			}
			else
			{
				start=event_date[0];
			}
	}

	if(end_date<=event_date[1] || end_date<=tweet_date[1] && delta>0)
	{
		document.getElementById("en_demo").innerHTML="";
		stop=end_date;
	}
	else
	{
		document.getElementById("en_demo").innerHTML="End date: "+end_date_str + " not in range";
		//console.log("End date not in Range");
		if(tweet_date[1]>event_date[1])
		{
			stop=tweet_date[1];
		}
		else
		{
			stop=event_date[1];
		}
	}

	if(tweet_time[1]>event_time[1])
	{
		end=tweet_time[1];
	}
	else
	{
		end=event_time[1];
	}

	if(tweet_time[0]<event_time[0])
	{
		begin=tweet_time[0];
	}
	else
	{
		begin=event_time[0];
	}
	drawEventCalendarView(twitter_csv,start,stop,begin,end);
}

function drawEventCalendarView(twitter_csv,start,stop,begin,end)
{
	svg.selectAll('*').remove();
	let svg_ec = document.querySelector('#svg1');
	const width = parseInt(getComputedStyle(svg_ec).width, 10);
	const height = parseInt(getComputedStyle(svg_ec).height, 10);
	const innWidth = width - margin.left - margin.right;
	const innHeight = height - margin.top - margin.bottom;
	//console.log(start,stop,begin,end);
	let diff=stop.getTime()-start.getTime();
	let steps=Math.ceil(diff/(1000*3600*24));
	//console.log(steps)
	if(steps==0)
	{
		document.getElementById("st_demo").innerHTML="Start Date and End Date can't be same";
	}
	else
	{
	let tip = d3.select("body")
			.append("div")
			.style("position", "absolute")
			.style("width","auto")
			.style("height","auto")
			.style("text-align","center")
			.style("z-index", "10")
			.style("visibility", "hidden")
			.style("padding", "15px")
			.style("background", "black")
			.style("border", "2px")
			.style("margin", "5px")
			.style("border-radius", "8px")
			.style("color", "white")
			.style("font-family","sans-serif")
			.style("font-size","15px")
			.style("line-height","20px")
			.style("pointer-events","none");

	let x_scl = d3.scaleTime().range([margin.left, innWidth-margin.right]).nice();
		x_scl.domain([begin,end]).ticks(86400);				//Timestamp in HH:MM:SS converted to SS(24*60*60)

		/*let x_axisT = d3.axisTop(x_scl)
						.ticks(1440)
					// .tickSizeInner(0) // the inner ticks will be of size 3
      				// .tickSizeOuter(5)
					.tickFormat(d3.timeFormat("%H:%M"));

		svg.append('g')
			.attr('id','xScaleT')
			.attr('transform', `translate(0,${margin.top})`)
			.attr('opacity', 0.5)
			.call(x_axisT);*/

	/*let x_axisB = d3.axisBottom(x_scl)
					.ticks(2)
					//.tickSizeInner(0) // the inner ticks will be of size 3
	  				//.tickSizeOuter(5)
					.tickFormat(d3.timeFormat("%H:%M"));

		svg.append('g')
			.attr('id','xScaleB')
			.attr('transform', `translate(0,${innHeight-margin.bottom})`)
			.attr('opacity', 0.5)
			.call(x_axisB);*/

	let y_scl = d3.scaleTime().range([innHeight-margin.bottom, margin.top]).nice();
		y_scl.domain([stop,start]);
		
	let y_axisL = d3.axisLeft(y_scl)
					.ticks(steps)
					.tickSizeInner(5) 
      				.tickSizeOuter(0)
					.tickFormat(d3.timeFormat("%Y-%m-%d"));

		svg.append('g')
			.attr('id','yScaleL')
			.attr('transform', `translate(${margin.left},0)`)
			.attr('opacity', 0.5)
			.call(y_axisL);
			// .on("click", function(d,i){
			// 			d3.select(this).style("stroke-width",2);
			//     		tip.html(`Value: ${d.originalTarget["__data__"]}`)
			//     			.style("visibility", "visible")
			//     			.style("left",(event.pageX)+"px")
			//     			.style("top", (event.pageY)+"px");	
			//    });
			

	let y_axisR = d3.axisRight(y_scl)
					.ticks(steps)
					.tickSizeInner(5) 
	  				.tickSizeOuter(0)
					.tickFormat(d3.timeFormat("%a"));

		svg.append('g')
			.attr('id','yScaleR')
			.attr('transform', `translate(${innWidth-margin.right+margin.left},0)`)
			.attr('opacity', 0.5)
			.call(y_axisR);
		
			
	let gridLines = d3.axisRight()
					  .ticks(steps)
					  .tickSize(innWidth-margin.right)
					  .tickFormat('')
					  .scale(y_scl);
		  
		svg.append('g')
			.attr('id','grid')
			.attr('transform', `translate(${margin.left},0)`)
			.attr('opacity', 0.2)
			.call(gridLines);
			
	//function update(stop,start)
	//{
		y_scl.domain([stop,start]);
		svg.selectAll("#yScaleL")
			.transition()
			.duration(1500)
			.delay(600)
			.call(y_axisL);
		
		svg.selectAll("#yScaleR")
			.transition()
			.duration(1500)
			.delay(600)
			.call(y_axisR);

		// x_scl.domain([start,end]);
		
		// svg.selectAll("#xScale")
		// 	.transition()
		// 	.duration(1500)
		// 	.delay(600)
		// 	.call(x_axis);
	//}
	//update(stop,start);	
	let emotions=['anger','disgust','fear','joy','sadness','surprise']
	let color=d3.scaleOrdinal(d3.schemeAccent).domain(emotions).range(["#A52A2A","#662D91","#FF7F50","#568203","#72A0C1","#FFC72C"]);

	let barGroups = svg.selectAll('g.barGroup')
						.data(twitter_csv)
						.join('g')
			  			.attr('class', 'barGroup');		
		/*
		barGroups
				.append('circle')
				.attr('transform', `translate(${margin.left},0)`)
				.attr('cx', d => x_scl(new Date(d.Tweet_Timestamp)))
				.attr('cy',d => y_scl(new Date(d.Tweet_Datestamp)))
				.attr('r', 6)
				.attr('stroke', 'red')
				.attr('fill', d => color(d.Emotions))
				.style('opacity',d => d.Uncertainity)
				.attr('stroke-width',d => d.Uncertainity)
				.on("mouseover", function(d,i) {
					//console.log(d,i);
					d3.select(this).style("stroke-width",2).attr('opacity',2);
					
					tip.html(`Current Event: <br> ${i.Event_Name}`)
						.style("visibility", "visible")
						.style("left",(event.pageX)+"px")
						.style("top", (event.pageY)+"px");			
				})	
				.on("mouseout", function(d,i) {
					d3.select(this).style("stroke-width",1).attr('opacity',0.25);
					tip.style("visibility", "hidden");
				})
				.on("mousemove",function(d,i) {
					tip.style("top", (event.pageY)+"px").style("left",(event.pageX)+"px");
				});
		*/
		barGroups
				.append('circle')
				.attr('transform', `translate(${margin.left},0)`)
				.attr('cx',d => x_scl(new Date(d.Event_Timestamp)))
				.attr('cy',d => y_scl(new Date(d.Event_Datestamp)))
				.attr('r', 10)
				.attr('stroke', 'blue')
				.attr('fill', d => color(d.Emotions))
				.style('opacity',d => d.Uncertainity)
				.attr('stroke-width',d => d.Uncertainity)
				.on("mouseover", function(d,i) {
					//console.log(d,i);
					d3.select(this).style("stroke-width",2).attr('opacity',2);
					
					tip.html(`Future Event: ${i.Event_Name} <br> Location: (${i.Latitude},${i.Longitude}) <br><br> Keywords:[${i.Hashtags.split(" ")}]`)
						.style("visibility", "visible")
						.style("left",(event.pageX)+"px")
						.style("top", (event.pageY)+"px");			
				})	
				.on("mouseout", function(d,i) {
					d3.select(this).style("stroke-width",1).attr('opacity',0.25);
					tip.style("visibility", "hidden");
				})
				.on("mousemove",function(d,i) {
					tip.style("top", (event.pageY)+"px").style("left",(event.pageX)+"px");
				})
				// .on('click',function(d,i) {
				// 	//console.log(d,i);
				// 	let temp=[{"Event_Name":0,"Tweet_Datestamp":0,"Event_Datestamp":0}]
				// 	temp[0]["Event_Name"]=i.Event_Name;
				// 	temp[0]["Tweet_Datestamp"]=i.Tweet_Datestamp;
				// 	temp[0]["Event_Datestamp"]=i.Event_Datestamp;
				// 	console.log(temp)			
				// })
				.on("click", function(d,i){
					let temp = [ 
						[
							{axis:"NPMI",value:Math.round(i.NPMI)},
							{axis:"Link Ratio",value:Math.round(i.Link_Ratio)},
							{axis:"Hashtag Ratio",value:Math.round(i.Hashtag_Ratio)},
							{axis:"User Credibility",value:Math.round(i.User_Credibility)},
							{axis:"User Diversity",value:Math.round(i.User_Diversity)},
							{axis:"Degree Centrality",value:Math.round(i.Degree_Centrality)},
							{axis:"Tweet Similarity",value:Math.round(i.Tweet_Similarity)}
						]
					];
					console.log(temp)
					tip.html("<p>Rank-SVM View</p><div id='tipDiv'><svg id='tipSVG'></svg></div>")
						.style("visibility", "visible")
						.style("left",(event.pageX)+"px")
						.style("top", (event.pageY)+"px")
						.transition().duration(200);
		
					//const margin = {top: 90, right: 70, bottom:90, left: 70},
					let margin_tip = {top: 70, right: 30, bottom: 70, left: 60};
					let svg_rad = document.querySelector('#tipSVG');
					let width = parseInt(getComputedStyle(svg_rad).width, 10);
					let height = parseInt(getComputedStyle(svg_rad).height, 10);
					let inwidth = 600 - margin_tip.left - margin_tip.right;
					let inheight = 500 - margin_tip.top - margin_tip.bottom;
					
					// d3.select("#tipDiv")
					// 	.append("svg")
					// 	.attr("id","tipSVG")
					// 	.attr("width", width - margin.left - margin.right)
					// 	.attr("height", height - margin.top - margin.bottom)
					// 	  .append("g")
					// 	.attr("transform","translate(" + margin.left + "," + margin.top + ")");
					
					let color_temp=d3.scaleOrdinal(d3.schemeAccent).domain(temp[0]).range(["#A52A2A"]);
					let radarChartOptions_temp={
							w: inwidth,
							h: inheight,
							margin: margin_tip,
							maxValue: 0.5,
							levels: 10,
							roundStrokes: true,
							color: color_temp
						  };			
					RadarChart("#tipSVG", temp, radarChartOptions_temp);
				})
				.on("dblclick", function(){
					tip.selectAll('*').remove();
					tip.style("visibility", "hidden");
				})
				.transition()
				.duration(1500)
				.delay(600);
				
	function getSolidLine(k,l)
	{
		let events=[];
		events.push(k.Event_Name,l.Event_Name);
			barGroups.append('line')
				.attr('transform', `translate(${margin.left},0)`)
				.attr('x1', x_scl(k.Event_Timestamp))
				.attr('y1', y_scl(k.Event_Datestamp))
				.attr('x2', x_scl(l.Event_Timestamp))
				.attr('y2', y_scl(l.Event_Datestamp))
				.attr('stroke', 'red')
				.attr('opacity',0.1)
				.style("stroke-width",0.6)
				.on("mouseover", function(d,i) {
					//console.log(d,i);
					d3.select(this).style("stroke-width",2).attr('opacity',1);	
					tip.html(`Future Events: <br> ${events}`)
							.style("visibility", "visible")
							.style("left",(event.pageX)+"px")
							.style("top", (event.pageY)+"px");			
				})	
				.on("mouseout", function(d,i) {
					d3.select(this).style("stroke-width",0.6).attr('opacity',0.1);
					tip.style("visibility", "hidden");
				})
				.on("mousemove",function(d,i) {
					tip.style("top", (event.pageY)+"px").style("left",(event.pageX)+"px");
				}).transition()
				.duration(1500)
				.delay(600);
	}

	function getDottedLine(k,l)
		{
				let hash1=k.Hashtags.split(" ");
				for(let i=0;i<hash1.length;i++)
				{
					hash1[i]=hash1[i].toString().replace("#","");
				}

				let hash2=l.Hashtags.split(" ");
				for(let i=0;i<hash2.length;i++)
				{
					hash2[i]=hash2[i].toString().replace("#","");
				}
				let intersection=hash1.filter(x=>hash2.includes(x));
				if(intersection.length>=8)
				{
					//console.log(hash1,hash2,intersection);
					barGroups.append('line')
						.attr('transform', `translate(${margin.left},0)`)
						.attr('x1', x_scl(k.Event_Timestamp))
						.attr('y1', y_scl(k.Event_Datestamp))
						.attr('x2', x_scl(l.Event_Timestamp))
						.attr('y2', y_scl(l.Event_Datestamp))
						.style("stroke-dasharray", ("9,2"))
						.attr('stroke', 'blue')
						.attr('opacity',0.1)
						.style("stroke-width",0.6)
						.on("mouseover", function(d,i) {
							//console.log(d,i);
							d3.select(this).style("stroke-width",2).attr('opacity',1);	
							tip.html(`Shared Keywords: <br> ${intersection}`)
									.style("visibility", "visible")
									.style("left",(event.pageX)+"px")
									.style("top", (event.pageY)+"px");			
						})	
						.on("mouseout", function(d,i) {
							d3.select(this).style("stroke-width",0.6).attr('opacity',0.25);
							tip.style("visibility", "hidden");
						})
						.on("mousemove",function(d,i) {
							tip.style("top", (event.pageY)+"px").style("left",(event.pageX)+"px");
						}).transition()
						.duration(1500)
						.delay(600);
						//.style("stroke-dasharray", ("3, 3"));
				}
		}

	for(let i=0;i<barGroups._groups[0].length-1;i++)
	{
		for(let j=i+1;j<barGroups._groups[0].length;j++)
		{
			//console.log('23',x_scl(barGroups._groups[0][i]["__data__"].Tweet_Timestamp),x_scl(barGroups._groups[0][j]["__data__"].Tweet_Timestamp))
			if(barGroups._groups[0][i]["__data__"].Latitude===barGroups._groups[0][j]["__data__"].Latitude && barGroups._groups[0][i]["__data__"].Longitude===barGroups._groups[0][j]["__data__"].Longitude){
				getSolidLine(barGroups._groups[0][i]["__data__"],barGroups._groups[0][j]["__data__"]);
			}
			if(i!=j)
			{
				getDottedLine(barGroups._groups[0][i]["__data__"],barGroups._groups[0][j]["__data__"]);
			}
		}
	}
}			
			
}

function RadarChart(id,data,options,publisher,filler) {
	d3.select(id).select("svg").remove();
	let cfg = {
	 w: 200,				
	 h: 200,
	 margin: {top: 20, right: 20, bottom: 20, left: 20}, 
	 levels: 3,				
	 maxValue: 0, 			
	 labelFactor: 1.25, 	
	 wrapWidth: 60, 		
	 opacityArea: 0.35, 	
	 dotRadius: 4, 			
	 opacityCircles: 0.1, 	
	 strokeWidth: 2, 		
	 roundStrokes: false,
	 color: d3.scaleOrdinal(d3.schemeAccent)	
	};
	
	if('undefined' !== typeof options){
	  for(let i in options){
		if('undefined' !== typeof options[i]){ cfg[i] = options[i]; }
	  }
	}

	let maxValue = Math.max(cfg.maxValue, d3.max(data, function(i){return d3.max(i.map(function(o){return o.value;}))}));
		
	let allAxis = (data[0].map(function(i, j){return i.axis})),	
		total = allAxis.length,					
		radius = Math.min(cfg.w/2, cfg.h/2), 	
		Format = d3.format(''),			 	
		angleSlice = Math.PI * 2 / total;
	
	let rScale = d3.scaleLinear()
		.range([0, radius])
		.domain([0, maxValue]);
	
	let svg = d3.select(id).append("svg")
			.attr("width",  cfg.w + cfg.margin.left + cfg.margin.right)
			.attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
			.attr("class", "radar"+id);
		
	let g = svg.append("g")
			.attr("transform", "translate(" + (cfg.w/2 + cfg.margin.left) + "," + (cfg.h/2 + cfg.margin.top) + ")");
	
	let filter = g.append('defs').append('filter').attr('id','glow'),
		feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation','2.5').attr('result','coloredBlur'),
		feMerge = filter.append('feMerge'),
		feMergeNode_1 = feMerge.append('feMergeNode').attr('in','coloredBlur'),
		feMergeNode_2 = feMerge.append('feMergeNode').attr('in','SourceGraphic');

	let axisGrid = g.append("g").attr("class", "axisWrapper");
	
	axisGrid.selectAll(".levels")
	   .data(d3.range(1,(cfg.levels+1)).reverse())
	   .enter()
		.append("circle")
		.attr("class", "gridCircle")
		.attr("r", function(d, i){return radius/cfg.levels*d;})
		.style("fill", "#CDCDCD")
		.style("stroke", "black")
		.style("fill-opacity", cfg.opacityCircles)
		.style("filter" , "url(#glow)");

	axisGrid.selectAll(".axisLabel")
	   .data(d3.range(1,(cfg.levels+1)).reverse())
	   .enter().append("text")
	   .attr("class", "axisLabel")
	   .attr("x", 4)
	   .attr("y", function(d){return -d*radius/cfg.levels;})
	   .attr("dy", "0.4em")
	   .style("font-size", "12px")
	   .attr("fill", "#737373")
	   .text(function(d,i) { return Format(maxValue * d/cfg.levels); });
	
	let axis = axisGrid.selectAll(".axis")
		.data(allAxis)
		.enter()
		.append("g")
		.attr("class", "axis");

	axis.append("line")
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", function(d, i){ return rScale(maxValue*1.1) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("y2", function(d, i){ return rScale(maxValue*1.1) * Math.sin(angleSlice*i - Math.PI/2); })
		.attr("class", "line")
		.style("stroke", "black")
		.style("stroke-width", "2px");

	axis.append("text")
		.attr("class", "legend")
		.style("font-size", "12.5px")
		.attr("text-anchor", "middle")
		.attr("dy", "0.25em")
		.attr("x", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("y", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice*i - Math.PI/2); })
		.text(function(d){return d})
		.call(textWrap, cfg.wrapWidth);

	let radarLine = d3.lineRadial()
		.radius(function(d) { return rScale(d.value); })
		.angle(function(d,i) {	return i*angleSlice; })
		.curve(d3.curveLinearClosed);
		
	if(cfg.roundStrokes) {
		radarLine.curve(d3.curveCardinalClosed);
	}
				
	let radialBlobWrapper = g.selectAll(".radarWrapper")
		.data(data)
		.enter().append("g")
		.attr("class", "radarWrapper");
			
	radialBlobWrapper
		.append("path")
		.attr("class", "radarArea")
		.attr("d", function(d,i) { return radarLine(d); })
		.style("fill", function(d,i) { return cfg.color(i); })
		.style("fill-opacity", cfg.opacityArea);
		
	radialBlobWrapper.append("path")
		.attr("class", "radarStroke")
		.attr("d", function(d,i) { return radarLine(d); })
		.style("stroke-width", cfg.strokeWidth + "px")
		.style("stroke", function(d,i) { return cfg.color(i); })
		.style("fill", "none")
		.style("filter" , "url(#glow)");		
	
	radialBlobWrapper.selectAll(".radarCircle")
		.data(function(d,i) { return d; })
		.enter().append("circle")
		.attr("class", "radarCircle")
		.attr("r", cfg.dotRadius)
		.attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
		.style("fill", function(d,i,j) { return cfg.color(j); })
		.style("fill-opacity", 0.8);

	let radialBlobCircleWrapper = g.selectAll(".radarCircleWrapper")
		.data(data)
		.enter().append("g")
		.attr("class", "radarCircleWrapper");
		
	radialBlobCircleWrapper.selectAll(".radarInvisibleCircle")
		.data(function(d,i) { return d; })
		.enter().append("circle")
		.attr("class", "radarInvisibleCircle")
		.attr("r", cfg.dotRadius*1.5)
		.attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
		.style("fill", "none")
		.style("pointer-events", "all");

	function textWrap(text, width) {
	  text.each(function() {
		let text = d3.select(this),
			words = text.text().split(/\s+/).reverse(),
			word,
			line = [],
			lineNumber = 0,
			lineHeight = 1.4,
			y = text.attr("y"),
			x = text.attr("x"),
			dy = parseFloat(text.attr("dy")),
			tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
			
		while (word = words.pop()) {
		  line.push(word);
		  tspan.text(line.join(" "));
		  if (tspan.node().getComputedTextLength() > width) {
			line.pop();
			tspan.text(line.join(" "));
			line = [word];
			tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
		  }
		}
	  });
	}
}
