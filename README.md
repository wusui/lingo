# Lingo

Lingo is an implementation of the five letter word game Lingo, as played on the eponymous television game show in 1987.  See https://en.wikipedia.org/wiki/Lingo_(American_game_show) for more details.

## General Operation

A short list of words and a long list of words are used by this game.  The short list is extracted from util/short_list.json, and the long list is extracted from util/long_list.json.  Util/short_list.json was previously scraped from https://www.thefreedictionary.com/5-letter-words.htm using util/get_short_list.py.  Util/long_list.py was scraped from http://www.poslarchive.com/math/scrabble/lists/common-5.html using util/get_long_list.py

Each word that the player is trying to solve comes from the short list.  Words that the player is allowed to play come from the long list.  This allows for the player to guess a wide set of words but the solution should be a word that is commonly known.

Game.html contains the following objects used by the javascript code:
* myCanvas1 -- a canvas used to display the squares on the Lingo board
* guess -- a text field where the player's guess is entered
* bbutton -- a submit button for each guess.

### js directory

The js sub-directory contains the following files:
* constants.js -- Constants used by other js modules
* ioModule.js -- Display module used when a solution is found. The player loses by making too many guesses, or loses by entering an invalid word.  The message function here is used instead of alert in order to allow html formatted text to be dislayed.
* startup.js -- onloadFunc is called when the page is loaded.  It reads the long and short lists, and shuffles the short list so that different words get picked for the player to guess.  The submit button gets activated once the long list is completely read.
* buttonh.js -- readButton is called when the button is pressed.  It reads the guess inputed, determines the outcome of the guess, updates the canvas display, and calls the message function in ioModule.js if the word is solved or if the player loses.
* canvas.js -- draw_board is used to update the display.

## Copyright, Licence, Author

Lingo was written and copyrighted by Warren Usui and is made available under the MIT license.
