import csv, json, re
import pprint
pp = pprint.PrettyPrinter()


d = {}
with open('./data/data_unprocessed.csv') as f:
	reader = csv.DictReader(f)
	for row in reader:
		country = row['country']
		series = row['series']
		year = int(re.search('20[01]\d|199\d', row['Date']).group(0))
		value = row['Value']
		if year not in d:
			d.update({year: {}})
		if country not in d[year]:
			d[year].update({country: {}})
		if 'Internet' in series:
			d[year][country].update({'internet' : float(value)})
		else:
			d[year][country].update({'population': int(value)})


d_formatted = {}
world_population = {}
for year in d:
	world_population.update({year: 0})
	entry = {'year' : year, 'data': {}}
	for country in d[year]:
		if country not in d_formatted:
			d_formatted.update({country: {}})
		if 'population' in d[year][country].keys(): 
			world_population[year] += d[year][country]['population']
			if'internet' in d[year][country].keys():
				d_formatted[country].update({year: int(d[year][country]['population'] * d[year][country]['internet'] / 100)})
			else:
				d_formatted[country].update({year: 0})
		else:
			d_formatted[country].update({year: 0})

#some bug?
d_formatted['Kuwait'].update({'1992' : 0})

del d_formatted['South Asia']
del d_formatted['North America']
rename_countries = {
 'Egypt, Arab Rep.' : 'Egypt',
 'Hong Kong SAR, China' : 'Hong Kong',
 'Iran, Islamic Rep.' : 'Iran',
 'Lao PDR' : 'Laos',
 'Macao SAR, China' : 'Macao',
 'Macedonia, FYR' : 'Macedonia',
 'Micronesia, Fed. Sts.' : 'Micronesia',
 'Russian Federation' : 'Russia',
 'Syrian Arab Republic' : 'Syria',
 'United Arab Emirates' : 'UAE'
 }

for country in rename_countries:
	d_formatted.update({rename_countries[country] : d_formatted[country]})
	del d_formatted[country]

#explore
y = 1997
d1 = [(x,d_formatted[x][y]) for x in d_formatted]
print sum([x[1] for x in d1 if x[0] != 'United States'])
print d_formatted['United States'][y]
#pp.pprint(sorted(d_formatted.keys()))

data = []
for country in d_formatted:
	entry = {'name':country}
	entry.update(d_formatted[country])
	data.append(entry)

with open('./data/data.json','w+') as f:
	json.dump(data, f)

with open('./data/world_population.json', 'w+') as f:
	json.dump(world_population, f)