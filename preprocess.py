import csv, json, re
import pprint
pp = pprint.PrettyPrinter()

internet_percentage = {}
country_population = {}
with open('./data/data_unprocessed.csv') as f:
	reader = csv.DictReader(f)
	for row in reader:
		country = row['country']
		series = row['series']
		year = int(re.search('20[01]\d|199\d', row['Date']).group(0))
		value = row['Value']
		if country not in internet_percentage:
			internet_percentage[country] = {}
		if country not in country_population:
			country_population[country] = {}

		if year not in internet_percentage[country]:
			internet_percentage[country][year] = {}
		if year not in country_population[country]:
			country_population[country][year] = {}

		if 'Internet' in series:
			internet_percentage[country][year] = float(value)
		else:
			country_population[country][year] = int(value)


# print internet_percentage['Canada']
# print country_population['Canada']
del internet_percentage['South Asia']
del internet_percentage['North America']
del country_population['South Asia']
del country_population['North America']
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
for name in rename_countries:
	internet_percentage[rename_countries[name]] = internet_percentage[name]
	del internet_percentage[name]

	country_population[rename_countries[name]] = country_population[name]
	del country_population[name]



l = []
for country in internet_percentage:
	entry = {'name' : country}
	entry['internet_pct'] = internet_percentage[country]
	entry['population'] = country_population[country]
	l.append(entry)

# with open('data/internet_percentage.json','w+') as f:
# 	json.dump(internet_percentage, f)

# with open('data/country_population.json','w+') as f:
# 	json.dump(country_population, f)

with open('data/data.json','w+') as f:
	json.dump(l, f)