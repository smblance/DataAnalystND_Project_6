function draw (data, world_population, annotation_text) {
	//convert years and population to integers
	// for (country in data) {
	// 	for (year in data[country]) {
	// 		if (year !== 'name') {
	// 			data[country][year] = +data[country][year];
	// 			data[country][+year] = data[country][year];
	// 			delete data[country][year];
	// 		}
	// 	}
	// }

	var years = [0];
	for (var i=1990;i<=2015;i++) { years.push(i); }
	year = 1990;

	var l = {};
	for (y = 1990; y <=2014; y++) {
		l[y] = 0;
		for (country in data) {
			l[y] += data[country][y]
		}
		l[y] /= 1e6
	}
	console.log(l)
	var internet_population_part = {}
	var internet_population = {}
	for (c in years) {
		var year = years[c];
		internet_population_part[year] = 0
		for (country in data) {
			internet_population_part[year] += data[country][year]
		}
		internet_population[year] = internet_population_part[year];
		internet_population_part[year] = d3.round(internet_population_part[year]/world_population[year],4);
	}
	console.log(internet_population)
	console.log(internet_population_part)

	// l = []
	// for (c in data) {l.push(data[c]['name'])}
	// console.log(l);
	// return null;

	var tip = d3.tip()
		.attr('class', 'd3-tip')
		.offset([-10,0])
		.html(function(d) { return d; })

	var bar_height = 25,
		bar_num = 15,
		bar_margin = 2;
		margin = 0,
		width = 800 - margin,
		annotation_width = 800,
		bar_start = width/2,
		value_text_width = 70,
		value_text_bar_margin = 5,
		increase_text_width = 100,
		value_text_size = 10,
		axis_height = 30,
		height = (bar_height+bar_margin)*(bar_num+1) + margin + axis_height;

	var move_axis = [1995, 2002, 2009, 2014]

	var tf = {true:1, false:0}

	var tick = 3000,
		transition_time = 1000;

	var header = d3.select('body')
		.append('div')
		.attr('class','header')
		.attr('width', width)

	var title = header.append('h2')
		.attr('class','title')
		.text('History of the Internet')
		// .attr('x', width/2)
		// .attr('y', 0)
		// .style('text-anchor', 'middle')
		// .style('alignment-baseline','hanging');

	var annotation = header.append('p')
		.attr('class', 'annotation')
		.style('width', annotation_width + 'px')
		.html(annotation_text[1990])

	var controls = d3.select('body').append('span').attr('class','controls');

	var begin_button = controls.append('i')
		.attr('class', 'fa fa-angle-double-left fa-2x')

	var left_button = controls.append('i')
		.attr('class', 'fa fa-chevron-left fa-2x')

	var play_pause_button = controls.append('i')
		.attr('class', 'fa fa-play fa-2x')

	var right_button = controls.append('i')
		.attr('class', 'fa fa-chevron-right fa-2x')

	var end_button = controls.append('i')
		.attr('class', 'fa fa-angle-double-right fa-2x')

	controls.selectAll('*').on('mouseover', function() {
			d3.select(this).style('color', 'black');
		})
		.on('mouseout', function () {
			d3.select(this).style('color', '');
		})
		
	var svg_bar_chart = d3.select('body')
		.append('svg')
		.attr('class','bar_chart')
		.attr('width', width + 2*margin)
		.attr('height', height + 2*margin)
		.call(tip)

	svg_bar_chart.append('text')
		.attr('x', bar_start - 10)
		.attr('y', axis_height/2)
		.attr('class', 'legend_icon')
		.attr('fill', '')
		.text('\uf0c0')
		.style('text-anchor', 'end')
		.style('alignment-baseline','middle')
		.style('font-family','FontAwesome')
		.data(['Number of users in a country'])
  		.on('mouseover', tip.show)
  		.on('mouseout', tip.hide)


	svg_bar_chart.append('text')
		.attr('x', bar_start - value_text_width - 10)
		.attr('y', axis_height/2)
		.attr('class', 'legend_icon')
		.attr('fill', '')
		.text('\uf201')
		.style('text-anchor', 'end')
		.style('alignment-baseline','middle')
		.style('font-family','FontAwesome')
		.data(['Increase from previous year'])
		.on('mouseover', tip.show)
  		.on('mouseout', tip.hide)


  	d3.select('body').append('p')
  		.html('Data: <a href="http://knoema.com/WBWDIGDF2015Dec/world-development-indicators-wdi-december-2015" target="_blank">World Bank</a>')
  		.style('text-align','right')
  		.style('font-size','10px')
  		.style('margin-right','50px')

	var display = {};
	//display[1990] - list of countries to show at 1990
	for (c in years) {
		display[years[c]] = []
	}
	var other = {'name' : 'Other'};

	for (var c in years) {
		var year = years[c];
		data.sort((x,y) => y[year] - x[year]);
		for (i in data.slice(0,bar_num)) {
			display[year].push(data[i]['name']);
		}
		other[year] = d3.sum(data.slice(bar_num), d => d[year]);
		display[year].push('Other');
	}
	data.push(other);

	function get_max_value(year) {
		var mv = 0
		for (i in data) {
			if (display[year].indexOf(data[i]['name']) != -1) {
				if (mv < data[i][year]) {mv = data[i][year]; }
			}
		}
		return mv;
	}

	max_value = {}
	for (y in years) {
		year = years[y];
		for (c in move_axis) {
			if (year <= move_axis[c]) {
				max_value[year] = get_max_value(move_axis[c]); 
				break;
			}
		}
	}

	year = 1990;

	var x_scale = d3.scale.linear()
		.domain([0,max_value[year]])
		.range([0,width - bar_start]);

	var axis = d3.svg.axis()
            .scale(x_scale)
            .orient('bottom')
            .ticks(5)
            .tickSize(0)
            .tickFormat(function (n) {
				 if (n!=0) {return number_to_text(n);} 
				 else {return '';}
			});

	svg_bar_chart.append('g')
		.attr('class','axis')
		.attr('transform', 'translate(' + bar_start + ',0)')
        .call(axis);

	var data_bars = svg_bar_chart.selectAll('.data-bar')
			.data(data, d => d['name'])
			.enter()
			.append('rect')
			.attr('class', 'data-bar')
			.attr('country', d => d['name'].replace(' ','_'))
			.attr('height', bar_height)
			.attr('width', d => x_scale(d[year]) )
			.attr('x', bar_start)
			.attr('y',  function (d) {
					var position = display[year].indexOf(d['name']);
					if (position === -1) { position = bar_num + 1; }
					return position*(bar_height+bar_margin) + axis_height;
				});
			


	var country_text = svg_bar_chart.selectAll('.country-text')
			.data(data, d => d['name'])
			.enter()
			.append('text')
			.text(d => d['name'])
			.attr('class', 'country-text')
			.attr('country', d => d['name'].replace(' ','_'))
			.attr('x', bar_start - value_text_bar_margin - value_text_width - increase_text_width)
			.attr('y', function (d) {
					if (display[year].indexOf(d['name']) !== -1)
						{ return (bar_height+bar_margin)*display[year].indexOf(d['name']) + bar_height/2 + axis_height; }
					else {
						return bar_num*(bar_height+bar_margin) + bar_height/2 + axis_height;
					}
					// return bar_num*(bar_height+bar_margin) + bar_height/2 + axis_height;
				})
			.style('text-anchor', 'end')
			.style('alignment-baseline','middle')
			.style('fill-opacity', d => tf[(display[year].indexOf(d['name']) != -1)]);
				
	var value_text = svg_bar_chart.selectAll('.value-text')
			.data(data, d => d['name'])
			.enter()
			.append('text')
			.attr('class', 'value-text')
			.attr('country', d => d['name'].replace(' ','_'))
			.text(d => number_to_text(d[year]) )
			.attr('x', d => bar_start - value_text_bar_margin)
			.attr('y', function (d) {
					if (display[year].indexOf(d['name']) !== -1) {
						return (bar_height+bar_margin)*display[year].indexOf(d['name']) + bar_height/2 + axis_height;
					} else {
						return bar_num*(bar_height+bar_margin) + bar_height/2 + axis_height;
					}
					// return bar_num*(bar_height+bar_margin) + bar_height/2 + axis_height;
				})
			.style('fill-opacity', d => tf[(display[year].indexOf(d['name']) != -1)])
			.style('text-anchor','end')
			.style('alignment-baseline','middle');
			

	var increase_text = svg_bar_chart.selectAll('.increase-text')
		.data(data, d => d['name'])
		.enter()
		.append('text')
		.attr('class', 'increase-text')
		.attr('country', d => d['name'].replace(' ','_'))
		.attr('x', d => bar_start - value_text_bar_margin - value_text_width)
		.attr('y', function (d) {
				if (display[year].indexOf(d['name']) !== -1) {
					return (bar_height+bar_margin)*display[year].indexOf(d['name']) + bar_height/2 + axis_height;
				} else {
					return bar_num*(bar_height+bar_margin) + axis_height;
				}
			})
		.style('fill-opacity', d => tf[(display[year].indexOf(d['name']) != -1)])
		.style('text-anchor','end')
		.style('alignment-baseline','middle');



	function update(year) {

		if (year == 2015) {
			color_interval = setInterval(function() {
				// data_bars.style('fill', function(d) {
				// 	return 'rgb(' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ')';
				// });
				data_bars.transition().duration(transition_time*2).attr('width', x => Math.random()*(width - bar_start))
			},transition_time); 
		} else {
			if (color_interval) {clearInterval(color_interval);}
		}

		// color_interval = setInterval(function() {
		// 	data_bars.style('fill', function(d) {
		// 		console.log('hi')
		// 		return 'rgb(' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ')';
		// 	});
		// },500); 

		switch (year) {
			case 0:
				annotation.html(annotation_text[0]);
				title.text('History of the Internet');
				year = years[1]; 
				break;
			case 2015:
				annotation.html(annotation_text[year]);
				title.text('Internet in the Future');
				// var color_interval_running = true;
				year = years[years.length - 2]
				break;
			default:
				annotation.html(annotation_text[year]);
				title.text('Internet in ' + year);
		}

		// if (color_interval_running) {clearInterval(color_interval); color_interval_running = false;}


		// if (year === 0) {
		// 	annotation.html(annotation_text[0]);
		// 	title.text('History of the Internet');
		// 	year = years[1]; 
		// } else if (year === ){
		// 	annotation.html(annotation_text[year]);
		// 	title.text('Internet in ' + year);
		// }

		

		x_scale.domain([0,max_value[year]]);

		d3.select('.axis')
			.transition()
			.duration(transition_time)
			.ease('in-out')
			.call(axis)


		data_bars.transition()
			.duration(transition_time)
			.attr('width', d => x_scale(d[year]) )
			.attr('y',  function (d) {
					var position = display[year].indexOf(d['name']);
					if (position === -1) { position = bar_num; }
					return position*(bar_height+bar_margin) + axis_height;
				});
		
		country_text.transition()
			.duration(transition_time)
			.style('fill-opacity', d => tf[(display[year].indexOf(d['name']) != -1)])
			.attr('y', function (d) {
					if (display[year].indexOf(d['name']) !== -1)
						{ return (bar_height+bar_margin)*display[year].indexOf(d['name']) + bar_height/2 + axis_height; }
					else {
						return (bar_height+bar_margin)*bar_num + axis_height;
					}
				})

		value_text.text(d => number_to_text(d[year]) )
			.transition()
			.duration(transition_time)
			.style('fill-opacity', d => tf[(display[year].indexOf(d['name']) != -1)])
			.attr('y', function (d) {
					if (display[year].indexOf(d['name']) !== -1) {
						return (bar_height+bar_margin)*display[year].indexOf(d['name']) + bar_height/2 + axis_height;

					} else {
						return bar_height*bar_num + bar_height/2 + axis_height;
					}
				})

		increase_text.text(function(d) {
				if (year > 1990) {
					return d3.round((d[year]/d[year-1]-1)*100,0) + '%';
				} else {
					return '';
				}
			})
			.transition()
			.duration(transition_time)
			.style('fill-opacity', d => tf[(display[year].indexOf(d['name']) != -1)])
			.attr('y', function (d) {
					if (display[year].indexOf(d['name']) !== -1) {
						return (bar_height+bar_margin)*display[year].indexOf(d['name']) + bar_height/2 + axis_height;
					} else {
						return (bar_height+bar_margin)*bar_num + axis_height;
					}
				});

	}


	// use skip_update to double the time in years with (annotation != '')
	// var skip_update = false;


	function start_interval() {
		//skip_update = (annotation_text[years[year_idx]] === '')

		year_interval = setInterval(function () {
			playing = true;

			// if (annotation != '') {
			// 	if (skip_update) {
			// 		skip_update = false;
			// 		return null;
			// 	}
			// }

			if (year_idx >= years.length-1) {
					clearInterval(year_interval);
					playing = false;
					play_pause_button.classed({'fa-pause' : false, 'fa-play': true});
				} else {
					year_idx++;
					update(years[year_idx]);
					// skip_update = (annotation_text[years[year_idx]] !== '');
			}
		}, tick);
	}
	
	begin_button.on('click', function () {
		if (year_idx > 1) {
			year_idx = 1;
			update(years[year_idx]);
		}
	});

	left_button.on('click', function () {
		if (year_idx > 0) {update(years[year_idx-1]); year_idx--;}
	})

	d3.select('body').on('keydown', function () {
		switch (d3.event.keyCode) {
			case 32:
				d3.event.preventDefault();
				if (playing) {
					clearInterval(year_interval);
					playing = false;
					play_pause_button.classed({'fa-pause' : false, 'fa-play': true});
				} else {
					start_interval();
					playing = true;
					play_pause_button.classed({'fa-pause' : true, 'fa-play': false});
				}
				break;

			case 37:
				d3.event.preventDefault();
				if (year_idx > 0) {
					update(years[year_idx-1]); 
					year_idx--;
				}
				break;
			case 39:
				d3.event.preventDefault();
				if (year_idx < 2016-1990) {update(years[year_idx+1]); year_idx++;}
				break;
		}
			
	});

	right_button.on('click', function() {
		if (year_idx < 2016-1990) {update(years[year_idx+1]); year_idx++;}
	});

	end_button.on('click', function () {
		if (year_idx < 2016-1990) {
			year_idx = 2016-1990;
			update(years[year_idx]);
			clearInterval(year_interval);
			playing = false;
			play_pause_button.classed({'fa-pause' : false, 'fa-play': true});
		}
	});

	play_pause_button.on('click', function(){
		if (playing) {
			clearInterval(year_interval);
			playing = false;
			play_pause_button.classed({'fa-pause' : false, 'fa-play': true});
		} else {
			start_interval();
			playing = true;
			play_pause_button.classed({'fa-pause' : true, 'fa-play': false});
		}
	})

	annotation.html(annotation_text[0])
	var color_interval = null;
	//started = false;
	//update(0);
	var year_idx = 0;
	var playing = false;
	var year_interval;

}

function number_to_text(n) {
	if (n >= 1e9) {
		return d3.round(n/1e9,1) + 'B';
	} else if (n >= 1e6) {
		return d3.round(n/1e6,1) + 'M';
	} else if (n >= 1e3) {
		return d3.round(n/1e3,1) + 'K';
	} else {
		return n;
	}
}

