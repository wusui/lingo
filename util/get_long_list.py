#!/usr/bin/python
# Copyright (c) 2020 Warren Usui, MIT License
# pylint: disable=W0223
"""
Extract log word list
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
        self.pre = False

    def handle_starttag(self, tag, attrs):
        if tag == 'pre':
            self.pre = True

    def handle_data(self, data):
        if self.pre:
            for word in data.split(' '):
                for part in word.split('\n'):
                    self.wlist.append(part.upper())

    def handle_endtag(self, tag):
        if tag == 'pre':
            self.pre = False

    def get_answer(self):
        return self.wlist

def get_text():
    """
    Read the webpage
    """
    dictv = "http://www.poslarchive.com/math/scrabble/lists/common-5.html"
    data = requests.get(dictv)
    parser = GetElementInfo()
    parser.feed(data.text)
    json_object = json.dumps(parser.get_answer(), indent = 4)
    with open("long_list.json", "w") as outfile:
        outfile.write(json_object)

if __name__ == "__main__":
    get_text()
