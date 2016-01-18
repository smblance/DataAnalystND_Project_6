function draw (data) {
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


	var margin = 10,
		width = 800 - margin,
		height = 600 - margin,
		controls_height = 50,
		bar_start = 200,
		value_text_width = 70,
		value_text_bar_margin = 5,
		bar_height = 20,
		bar_num = 20,
		value_text_size = 10;

	d3.select('body')
	  .append('h2')
	  .text('Internet population ');

	var svg_chart = d3.select('body')
		.append('svg')
		.attr('width', width + margin)
		.attr('height', height + margin)

	var max_value = 0;
	for (i in data) {
		for (var year in data[i]) {
			if (year !== 'name') {
				if (max_value < data[i][year]) {max_value = data[i][year];}
			}
		}
	}

	var x_scale = d3.scale.linear()
		.domain([0,max_value])
		.range([0,width - bar_start]);

	
	var years = [];
	for (var i=1990;i<=2014;i++) { years.push(i); }

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


	function update(year) {
		var filtered = data.filter(d => (display[year].indexOf(d['name']) != -1));

		var data_bars = svg_chart.selectAll('.data-bar')
			.data(filtered, d => d['name'])
			.attr('y', d => bar_height*display[year].indexOf(d['name']))
			.attr('width', d => x_scale(d[year]) );
		
		data_bars.enter()
			.append('rect')
			.attr('class', 'data-bar')
			.attr('height', bar_height)
			.attr('width', d => x_scale(d[year]) )
			.attr('x', bar_start)
			.attr('y', d => bar_height*display[year].indexOf(d['name']));

		data_bars.exit().remove();

		var country_text = svg_chart.selectAll('.country-text')
			.data(filtered, d => d['name'])
			.attr('y', d => bar_height*display[year].indexOf(d['name']) + bar_height/2)

		country_text.enter()
			.append('text')
			.text(d => d['name'])
			.attr('class', 'country-text')
			.attr('x', bar_start - value_text_width)
			.attr('y', d => bar_height*display[year].indexOf(d['name']) + bar_height/2)
			.style('text-anchor', 'end')
			.style('alignment-baseline','middle');

		country_text.exit().remove();

		d3.select('h2').text('Internet polulation ' + year);

		var value_text = svg_chart.selectAll('.value-text')
			.data(filtered, d => d['name'])
			.attr('y', d => bar_height*display[year].indexOf(d['name']) + bar_height/2 )
			.text(d => number_to_text(d[year]) );

		value_text.enter()
			.append('text')
			.attr('class','value-text')
			.attr('x', d => bar_start - value_text_bar_margin)
			.attr('y', d => bar_height*display[year].indexOf(d['name']) + bar_height/2)
			.style('text-anchor','end')
			.style('alignment-baseline','middle')
			.text(d => number_to_text(d[year]) );

		value_text.exit().remove();

	}

	var year_idx = 0;
	var year_interval = setInterval(function () {
		if (year_idx >= years.length) {
			clearInterval(year_interval);
		} else {
			update(years[year_idx]);
			year_idx++;
		}
	}, 200);
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

