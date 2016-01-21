function draw (json) {
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

	var data = json['data']
	world_population = json['world_population']

	var years = [];
	for (var i=1990;i<=2014;i++) { years.push(i); }
	year = 1900;

	var internet_population_part = {}
	for (c in years) {
		var year = years[c];
		internet_population_part[year] = 0
		for (country in data) {
			internet_population_part[year] += data[country][year]
		}
		internet_population_part[year] = d3.round(internet_population_part[year]/world_population[year],4)
	}

	var annotation_text = {
		1990: 'First high-speed cable was installed over the Atlantic.\n0.04% of the world population was using the internet, and only in developed countries.',
		1993: 'Japan took second place from Germany.',
		1996: 'Developing countries enter the scene: Brazil, Poland, India, Russia, and South Africa.',
		1998: 'More people were using internet outsite the US than inside.',
		1999: 'The term Web 2.0 was coined to anticipate the rise of interactivity and user-generated content',
		2000: 'More than $100B was spent in the US to address the Y2K problem. Very few problems were encountered, despite the hype.',
		2003: 'China took the second place in internet users. US still has by far most people.',
		2009: 'For the first time, more people use internet in China than in the US.'
	}

	


	var bar_height = 25,
		bar_num = 15,
		bar_margin = 2;
		margin = 50,
		width = 800 - margin,
		height = bar_height*(bar_num+1) - margin,
		bar_start = width/2,
		value_text_width = 70,
		value_text_bar_margin = 5,
		increase_text_width = 100,
		value_text_size = 10,
		axis_height = 30;

	var move_axis = [1995, 2002, 2009, 2014]

	var tf = {true:1, false:0}


	var tick = 500,
		transition_time = 500;

	var header = d3.select('body')
		.append('div')
		.attr('class','header')

	var title = header.append('h2')
		.attr('class','title')
		.text('Internet population 1990');

	var annotation = header.append('p')
		.attr('class', 'annotation')
		.text(annotation_text[1990])

	var controls = header.append('g').attr('class','controls')

	var left_button = controls.append('i')
		.attr('class', 'fa fa-chevron-left fa-2x');

	var play_pause_button = controls.append('i')
		.attr('class', 'fa fa-pause fa-2x')

	var right_button = controls.append('i')
		.attr('class', 'fa fa-chevron-right fa-2x')
		

	var svg_chart = d3.select('body')
		.append('svg')
		.attr('width', width + margin)
		.attr('height', height + margin)


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

	svg_chart.append('g')
		.attr('class','axis')
		.attr('transform', 'translate(' + bar_start + ',0)')
        .call(axis);

	year = 1990;

	var data_bars = svg_chart.selectAll('.data-bar')
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
					if (position === -1) { position = bar_num; }
					return position*(bar_height+bar_margin) + axis_height;
				});


	var country_text = svg_chart.selectAll('.country-text')
			.data(data, d => d['name'])
			.enter()
			.append('text')
			.text(d => d['name'])
			.attr('class', 'country-text')
			.attr('country', d => d['name'].replace(' ','_'))
			.attr('x', bar_start - value_text_width - increase_text_width)
			.attr('y', function (d) {
					if (display[year].indexOf(d['name']) !== -1)
						{ return (bar_height+bar_margin)*display[year].indexOf(d['name']) + bar_height/2 + axis_height; }
					else {
						return bar_num*(bar_height+bar_margin) + bar_height/2 + axis_height;
					}
				})
			.style('text-anchor', 'end')
			.style('alignment-baseline','middle')
			.style('fill-opacity', d => tf[(display[year].indexOf(d['name']) != -1)]);
			
	var value_text = svg_chart.selectAll('.value-text')
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
						return bar_num*(bar_height+bar_margin) + axis_height;
					}
				})
			.style('fill-opacity', d => tf[(display[year].indexOf(d['name']) != -1)])
			.style('text-anchor','end')
			.style('alignment-baseline','middle');
			

	var increase_text = svg_chart.selectAll('.increase-text')
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

		title.text('Internet population ' + year);

		x_scale.domain([0,max_value[year]]);

		d3.select('.axis')
			.transition()
			.duration(transition_time)
			.ease('in-out')
			.call(axis)
		
		for (y in annotation_text) {
			if (y == year) {
				annotation.text(annotation_text[year]);
			}
		}

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
						return bar_height*display[year].indexOf(d['name']) + bar_height/2 + axis_height;
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

	year_idx = 1;
	var playing = true;
	var year_interval;
	function start_interval() {
		year_interval = setInterval(function () {
			playing = true;
			if (year_idx >= years.length) {
				clearInterval(year_interval);
				playing = false;
			} else {
				update(years[year_idx]);
				year_idx++;
			}
		}, tick);
	}
	start_interval();

	left_button.on('click', function () {
		if (year_idx > 0) {update(years[year_idx-1]); year_idx--;}
	});
	right_button.on('click', function() {
		if (year_idx < 2014-1990) {update(years[year_idx+1]); year_idx++;}
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

