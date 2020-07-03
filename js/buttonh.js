/* Copyright (c) 2020 Warren Usui, MIT License */
/*jslint browser:true */
/*global GUESSES GUESS_PAT WORD_COUNT SHORT_LIST LONG_LIST */
/*global xcanvas ioModule GUESS */
/*****************************************************************************
 *
 * Button handling routines
 *
 *****************************************************************************
 */
var buttonh = (function () {
    var ltr_ind = [0, 1, 2, 3, 4];
    var arr_ans;
    var arr_gue;
    var pattern;
    var pyellow;

    /**
     * Check for exact match
     *
     * @param {integer} -- location in word being checked
     *
     */
    function red_check(value) {
        if (arr_ans[value] === arr_gue[value]) {
            pattern.push("R");
        } else {
            pattern.push("B");
        }
    }

    /**
     * If an exact match was not found, on this pass make sure that letter
     * in the corresponding location of the solution is saved.
     *
     * @param {integer} -- location in word being checked
     *
     */
    function black_check(value) {
        if (pattern[value] === "B") {
            pyellow.push(arr_ans[value]);
        }
    }

    /**
     * Check for yellow letters  (letter in word but in different location)
     *
     * If the letter is not in the right location, set value to Y and remove
     * the leter from the list of letters that did not match by location
     *
     * @param {integer} -- location in word being checked
     *
     */
    function yellow_check(value) {
        if (pattern[value] === "B") {
            var yind = pyellow.indexOf(arr_gue[value]);
            if (yind >= 0) {
                pyellow[yind] = "_";
                pattern[value] = "Y";
            }
        }
    }

    /**
     * Return pattern describing how the word guessed matches the solution.
     *
     * The pattern returned is of the form XXXXX where each X corresponds to
     * a letter in the word.  R indicates that the letter matches the letter
     * in the same location as the solution.  Y indicates that the
     * corresponding letter is correct but in the wrong location.
     * B indicates that the letter is not in the solution.
     *
     * @param {String} answer -- solution trying to be guessed
     * @param {String} guess -- word guessed
     */
    function eval_word(answer, guess) {
        arr_ans = answer.split("");
        arr_gue = guess.split("");
        pattern = [];
        pyellow = [];
        ltr_ind.forEach(red_check);
        ltr_ind.forEach(black_check);
        ltr_ind.forEach(yellow_check);
        return pattern.join("");
    }

    /**
     * Get the next word on the short word list
     * Reset local storage values
     * Redraw the display
     */
    function start_next() {
        var indx = JSON.parse(localStorage.getItem(WORD_COUNT));
        indx += 1;
        localStorage.setItem(WORD_COUNT, indx);
        localStorage.setItem(GUESSES, "[]");
        localStorage.setItem(GUESS_PAT, "[]");
        xcanvas.draw_board();
    }

    /**
     * The submit button has been clicked
     *
     * Return if no input.
     * If input is not valid, send an error message and callback start_next.
     * Check the word using eval_word.
     * If the word is solved, send contratulations message and callback
     *     start_next.
     * Otherwise, update the display and data being tracked.
     */
    function readbutton() {
        var indata = document.getElementById(GUESS).value.toUpperCase();
        indata = indata.trim();
        var wlist = JSON.parse(localStorage.getItem(LONG_LIST));
        var tloc = wlist.indexOf(indata);
        var indx = JSON.parse(localStorage.getItem(WORD_COUNT));
        var slist = JSON.parse(localStorage.getItem(SHORT_LIST));
        if (indata.length === 0) {
            return;
        }
        if (tloc === -1) {
            var mtext = "<div><p><b>";
            mtext += indata;
            mtext += "</b> is not a valid word</p><br><p>The word is ";
            mtext += slist[indx] + "</p></div>";

            ioModule.message(mtext, "ERROR", start_next);
        } else {
            var glist = JSON.parse(localStorage.getItem(GUESSES));
            var oresult = eval_word(slist[indx], indata);
            if (oresult === "RRRRR") {
                var ocount = glist.length + 1;
                var stext = "<div><p>You solved it</p>";
                stext += "<p>Word is <b>" + indata + "</b></p>";
                stext += "<p>Total guesses: ";
                stext += ocount.toString();
                stext += "</p></div>";
                ioModule.message(stext, "Congratulations", start_next);
            } else {
                if (glist.length > 4) {
                    var gtext = "<div><p>Too many guesses taken, word is <b>";
                    gtext += slist[indx];
                    gtext += "</b></p>";
                    gtext += "</div>";
                    ioModule.message(gtext, "Sorry", start_next);
                } else {
                    glist.push(indata);
                    var gval = JSON.stringify(glist);
                    localStorage.setItem(GUESSES, gval);
                    var olist = JSON.parse(localStorage.getItem(GUESS_PAT));
                    olist.push(oresult);
                    var oval = JSON.stringify(olist);
                    localStorage.setItem(GUESS_PAT, oval);
                    xcanvas.draw_board();
                }
            }
        }
    }

    return {
        readbutton
    };
}());
