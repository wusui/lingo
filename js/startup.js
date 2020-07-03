/* Copyright (c) 2020 Warren Usui, MIT License */
/*jslint browser:true */
/*global GUESSES GUESS_PAT WORD_COUNT SHORT_LIST */
/*global RED YELLOW BLACK FONT MYCANVAS */
/*****************************************************************************
 *
 * Canvas routines
 *
 *****************************************************************************
 */
var xcanvas = (function () {
    var ORIGIN = 60;
    var SQSIZE = 60;
    var OFFSET = 80;
    var TXT_OFFX = 10;
    var TXT_OFFY = 50;
    var ctx;
    var xoffset;
    var yoffset;
    var box_switch;
    var ltr_indices = [0, 1, 2, 3, 4];
    var odd_letter = {"I": 12, "W": -8};

    /**
     * Wrapper used to handle oddly sized letters on the display.
     *
     * @param {String} letter -- letter to be displayed
     * @param {integer} xoff -- x-coordinate of character in display
     * @param {integer} yoff -- y-coordinate of character in display
     */
    function add_letter(letter, xoff, yoff) {
        var x = xoff;
        if (odd_letter.hasOwnProperty(letter)) {
            x += odd_letter[letter];
        }
        ctx.fillText(letter, x, yoff);
    }

    /**
     *
     * Draw the letter given in the information passed
     *
     * The location of the letter is in the external xoffset an yoffest
     * values.  The value parameter passed a two element Array consisting
     * of a charactter of display information and the character to display.
     *
     * If the display information is R, a red letter on white is displayed
     * If the display information is Y, a black letter on yellow is displayed
     * If the display information is B, a black letter on white is displayed
     *
     * @param {Array} value -- described above
     */
    function draw_letter(value) {
        if (value[0] === "R") {
            ctx.fillStyle = RED;
            add_letter(value[1], xoffset + TXT_OFFX, yoffset + TXT_OFFY);
        } else {
            if (value[0] === "Y") {
                ctx.fillStyle = YELLOW;
                ctx.fillRect(xoffset, yoffset, SQSIZE, SQSIZE);
            }
            ctx.fillStyle = BLACK;
            add_letter(value[1], xoffset + TXT_OFFX, yoffset + TXT_OFFY);
        }
        xoffset += OFFSET;
    }

    /**
     * Draw a word on the display
     *
     * Compare each charactter in the word with the corresponding value
     * in the guess pattern.  These values are combined into an Array of
     * two value Arrays which are passed to draw_letter.
     *
     * @param {String} item -- word to display
     * @param {Integer} index -- position of the word on the screen
     */
    function draw_word_line(item, index) {
        var guess_pat = JSON.parse(localStorage.getItem(GUESS_PAT));
        yoffset = ORIGIN + OFFSET * index;
        var gletters = item.split("");
        var symbols = guess_pat[index].split("");
        xoffset = ORIGIN;
        ctx.font = FONT;
        ctx.clearRect(ORIGIN, yoffset, SQSIZE, SQSIZE);
        var comb_data = symbols.map(function (elemnt, indx) {
            return [elemnt, gletters[indx]];
        });
        comb_data.forEach(draw_letter);
    }

    /**
     * Clear a square on the display
     *
     * @param {integer} item -- location of the square in the word
     *
     * A box_switch value of 0 draws the intial square (used on startup).
     * A box_switch value of 1 clears the data in the squeate.
     */
    function clear_square(item) {
        xoffset = ORIGIN + item * OFFSET;
        if (box_switch === 0) {
            ctx.rect(xoffset, yoffset, SQSIZE, SQSIZE);
        } else {
            ctx.clearRect(xoffset, yoffset, SQSIZE, SQSIZE);
        }
    }
    /**
     * Clear a word on the display
     *
     * @param {integer} item -- location of the word on the display
     *
     */
    function clear_line(item) {
        yoffset = ORIGIN + item * OFFSET;
        ltr_indices.forEach(clear_square);
    }

    /**
     * Draw the board of letter boxes.
     *
     * Display all the previous guesses.  If the entry is new, then make
     * sure the first letter is displayed.
     */
    function draw_board() {
        var c = document.getElementById(MYCANVAS);
        ctx = c.getContext("2d");
        ctx.beginPath();
        box_switch = 0;
        ltr_indices.forEach(clear_line);
        ctx.stroke();
        var indx = JSON.parse(localStorage.getItem(WORD_COUNT));
        var short_list = JSON.parse(localStorage.getItem(SHORT_LIST));
        var guesses = JSON.parse(localStorage.getItem(GUESSES));
        if (guesses.length === 0) {
            box_switch = 1;
            ltr_indices.forEach(clear_line);
            var flet = short_list[indx][0];
            ctx.font = FONT;
            ctx.fillStyle = RED;
            add_letter(flet, ORIGIN + TXT_OFFX, ORIGIN + TXT_OFFY);
        } else {
            guesses.forEach(draw_word_line);
        }
    }

    return {
        draw_board
    };
}());
