#!/usr/bin/python
# Copyright (c) 2020 Warren Usui, MIT License
# pylint: disable=W0223
"""
Extract short word list
"""
import requests
import json
from html.parser import HTMLParser

class GetElementInfo(HTMLParser):
    """
    Extract element names from web page
    """
    def __init__(self):
        HTMLParser.__init__(self)
        self.wlist = []
        self.href = ''

    def handle_starttag(self, tag, attrs):
        if tag == 'a':
            for x in attrs:
                if x[0] == 'href':
                    self.href = x[1]

    def handle_data(self, data):
        if data == self.href:
            self.wlist.append(data.upper())

    def handle_endtag(self, tag):
        pass

    def get_answer(self):
        return self.wlist

def get_text():
    """
    Read the webpage
    """
    dictv = "https://www.thefreedictionary.com/5-letter-words.htm"
    data = requests.get(dictv)
    parser = GetElementInfo()
    parser.feed(data.text)
    json_object = json.dumps(parser.get_answer(), indent = 4)
    with open("short_list.json", "w") as outfile:
        outfile.write(json_object)

if __name__ == "__main__":
    get_text()
