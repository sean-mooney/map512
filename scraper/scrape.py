import requests
from bs4 import BeautifulSoup
url = 'https://2019.do512.com/'
response = requests.get(url)
html = response.content

soup = BeautifulSoup(html, 'lxml')
eventList = soup.find('div', attrs={'class': 'ds-events-group'})
with open('scrapedHTML.html', 'w') as file:
    file.write(str(soup))
    
eventArray = []

class Event(object):

    def __init__(self, title=None, url=None, image=None, address=None, startDate=None, venue=None, ticketInfo=None, upvotes=None):
        self.title = title
        self.url = url
        self.image = image
        self.address = address
        self.startDate = startDate
        self.venue = venue
        self.ticketInfo = ticketInfo
        self.upvotes = upvotes

for event in eventList.findAll('div', {'class': 'ds-listing'}):
    title = event.find('span', {'class': 'ds-listing-event-title-text'}).text

    url = event.find('a', {'class': 'url'})['href']
    url = 'https://2019.do512.com' + url

    backgroundImage = event.find('div', {'class': 'ds-cover-image'})['style']
    backgroundImage = backgroundImage.split('url(')[1]
    backgroundImage = backgroundImage.split(');')[0]

    address = event.find('div', {'class': 'ds-venue-name'}).find('a')['href']
    if 'venues' not in address:
        address = address.partition('q=')[2]
    else:
        address = address.partition('venues')[2]

    startDate = event.find(itemprop='startDate').get('content')

    venue = event.find('div', {'class': 'ds-venue-name'}).find('span', itemprop='name').text

    ticketInfo = event.find('div', {'class': 'ds-listing-ticket-info'})
    if ticketInfo == None:
        ticketInfo = ''
    else:
        ticketInfo = ticketInfo.text

    upvotes = event.find('span', {'class': 'ds-icon-text'}).text

    eventArray.append(Event(title, url, backgroundImage, address, startDate, venue, ticketInfo, upvotes))

print('Done with ' + str(len(eventArray)) + ' results')
