import sys
import datetime
import json
import urllib.request

apikey = "d438a2b4b7665f104bd7bc938662fa20" # Example API Key
lat = 53.480759
long = -2.242631

data = []

if apikey == "d438a2b4b7665f104bd7bc938662fa20":
    print("Please replace the script with your Darksky API Key - https://darksky.net/dev/account")
    sys.exit()

api_url_base = "https://api.darksky.net/forecast/%s/" % apikey
max_days_back = 365
start_date = datetime.datetime.today() - datetime.timedelta(days=(max_days_back + 1))
for days_back in range(max_days_back):
    date = start_date + datetime.timedelta(days=days_back)
    date_string = date.strftime('%Y-%m-%d')
    url = api_url_base + "%s,%s,%sT12:00:00" % (lat, long, date_string)
    res = urllib.request.urlopen(url).read()
    try:
        print("Grabbing data for %s" % date_string)
        weather_data = json.loads(res)
        daily_weather_data = weather_data["daily"]["data"][0]
        daily_weather_data.update({ "date": date_string })
        data.append(daily_weather_data)
    except:
        print("Trouble loading data for %s" % date_string)

data_file = open('weather_data.json', 'w')
data_file.seek(0)
data_file.truncate()
data_file.write(json.dumps(data))
