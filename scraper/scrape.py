import requests
import json
import geocoder
from bs4 import BeautifulSoup

eventArray = []

# class Event(object):

#     def __init__(self, title=None, url=None, image=None, address=None, startDate=None, venue=None, ticketInfo=None, upvotes=None):
#         self.title = title
#         self.url = url
#         self.image = image
#         self.address = address
#         self.startDate = startDate
#         self.venue = venue
#         self.ticketInfo = ticketInfo
#         self.upvotes = upvotes


class Object:
    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__,
                          sort_keys=True, indent=4)

pageNum = 1
stop = False
apiKey = ''

f = open("key.txt", "r")
apiKey = f.readline(100)
f.close()
if apiKey == '':
    print('no api key')
    stop = True
while not stop:
    url = 'https://2019.do512.com/?page=' + str(pageNum)
    response = requests.get(url)
    html = response.content

    soup = BeautifulSoup(html, 'lxml')
    eventList = soup.find('div', attrs={'class': 'ds-events-group'})
    
    if eventList.findAll('div', {'class': 'ds-listing'}) == None or pageNum == 2:
        stop = True
        break
    i = 0
    for event in eventList.findAll('div', {'class': 'ds-listing'}):
        eventToAdd = Object()
        eventToAdd.title = event.find('span', {'class': 'ds-listing-event-title-text'}).text

        url = event.find('a', {'class': 'url'})['href']
        eventToAdd.url = 'https://2019.do512.com' + url

        backgroundImage = event.find('div', {'class': 'ds-cover-image'})['style']
        backgroundImage = backgroundImage.split('url(')[1]
        eventToAdd.backgroundImage = backgroundImage.split(');')[0]

        address = event.find('div', {'class': 'ds-venue-name'}).find('a')['href']
        if 'venues' not in address:
            eventToAdd.address = address.partition('q=')[2]
            g = geocoder.bing(eventToAdd.address, key='Ak-NT9oLpkkIZQQUpDVh0O8eAh2LSv39o6UWpkfrZG78weT9N-HJ99lKyVXxHHJD')
            eventToAdd.location = g.latlng
        else:
            eventToAdd.address = address.partition('venues')[2]

        startDate = event.find(itemprop='startDate')
        if startDate == None:
            eventToAdd.startDate = ''
        else:
            eventToAdd.startDate = startDate.get('content')

        eventToAdd.venue = event.find(
            'div', {'class': 'ds-venue-name'}).find('span', itemprop='name').text

        ticketInfo = event.find('div', {'class': 'ds-listing-ticket-info'})
        if ticketInfo == None:
            eventToAdd.ticketInfo = ''
        else:
            eventToAdd.ticketInfo = ticketInfo.text

        upvotes = event.find('span', {'class': 'ds-icon-text'})
        if upvotes == None:
            eventToAdd.upvotes = ''
        else:
            eventToAdd.upvotes = upvotes.text

        # eventArray.append(Event(title, url, backgroundImage, address, startDate, venue, ticketInfo, upvotes))
        eventArray.append(eventToAdd.toJSON())
        print(i)
        i += 1
    print(pageNum)
    pageNum += 1
with open('../map512/src/data/data.json', 'w') as f:
    json.dump(eventArray, f)
print('Done with ' + str(len(eventArray)) + ' results')
