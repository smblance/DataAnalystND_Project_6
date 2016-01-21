import json

with open('./data/data.json') as f:
	data = json.load(f)['data']

print data[0]