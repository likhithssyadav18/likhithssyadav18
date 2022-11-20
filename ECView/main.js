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
													Hashtags: d['Hashtags']
												};
											})
				])	
        .then(function(values) {
            console.log('loaded twitter_data.csv and twitter_data.json');
            twitter_csv=values[0];
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
	let data_csv=twitter_csv;
	let svg_ec = document.querySelector('#svg1');
	const width = parseInt(getComputedStyle(svg_ec).width, 10);
	const height = parseInt(getComputedStyle(svg_ec).height, 10);
	const innWidth = width - margin.left - margin.right;
	const innHeight = height - margin.top - margin.bottom;
	//let start,stop,begin,end;
	//[start,stop,begin,end]=getDateRange(data_csv);
	console.log(start,stop,begin,end);
	let diff=stop.getTime()-start.getTime();
	let steps=Math.ceil(diff/(1000*3600*24));
	//console.log(steps)

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
		x_scl.domain([begin,end]).ticks(1440);

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
					.ticks(25)
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
				}).transition()
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
