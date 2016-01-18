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
for year in d:
	entry = {'year' : year, 'data': {}}
	for country in d[year]:
		if country not in d_formatted:
			d_formatted.update({country: {}})
		if 'population' in d[year][country].keys() and 'internet' in d[year][country].keys():
			d_formatted[country].update({year: int(d[year][country]['population'] * d[year][country]['internet'] / 100)})
		else:
			d_formatted[country].update({year: 0})

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

#pp.pprint(sorted(d_formatted.keys()))

out = []
for country in d_formatted:
	entry = {'name':country}
	entry.update(d_formatted[country])
	out.append(entry)

with open('./data/data.json','w+') as f:
	json.dump(out, f)