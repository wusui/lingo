/* Copyright (c) 2020 Warren Usui, MIT License */
/*jslint browser:true */
/*global GUESSES GUESS_PAT WORD_COUNT SHORT_LIST LONG_LIST */
/*global BBUTTON xcanvas */
/*****************************************************************************
 *
 * Startup code for Lingo
 *
 *****************************************************************************
 */
var startup = (function () {
    var req1;
    var req2;
    /**
     * Make the http read request and setup callback function
     *
     * @param {String} file -- json file to be read
     * @param {function} callback  -- what to execute when this read completes
     * @param {XMLHttpRequest} req -- XMLHttpRequest used
     *
     */
    function readLocal(file, callback, req) {
        req.addEventListener("load", callback, false);
        req.open("GET", file, true);
        req.send();
    }

    /**
     * Shuffle the word list passed in
     *
     * @param {Array} file -- word list to be shuffled
     *
     */
    function shuffle(words) {
        var i = words.length - 1;
        while (i > 0) {
            const j = Math.floor(Math.random() * i);
            const temp = words[i];
            words[i] = words[j];
            words[j] = temp;
            i -= 1;
        }
    }

    /**
     *
     * Called when the short file has completed reading.
     *
     * shuffle the list of words for the player to guess.
     * set localStorage values to defaults
     * update the display
     *
     */
    function sortshort() {
        var wlist = JSON.parse(req1.responseText);
        shuffle(wlist);
        var newlist = JSON.stringify(wlist);
        localStorage.setItem(SHORT_LIST, newlist);
        localStorage.setItem(WORD_COUNT, 0);
        localStorage.setItem(GUESSES, "[]");
        localStorage.setItem(GUESS_PAT, "[]");
        xcanvas.draw_board();
    }

    /**
     *
     * Called when the long file has finished reading.
     *
     * save the long list
     * allow the submit button to be used
     *
     */
    function continue1() {
        localStorage.setItem(LONG_LIST, req2.responseText);
        document.getElementById(BBUTTON).disabled = false;
    }

    /**
     * Main entry point.  This is called when the html file is loaded
     *
     * Read the short list and the long list.  Call sortshort and continue1
     * on the completion of each read.
     */
    function onloadFunc() {
        req1 = new XMLHttpRequest();
        readLocal("util/short_list.json", sortshort, req1);
        req2 = new XMLHttpRequest();
        readLocal("util/long_list.json", continue1, req2);
    }

    return {
        onloadFunc
    };
}());
