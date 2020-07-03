/* Copyright (c) 2020 Warren Usui, MIT License */
/*jslint browser:true, this */
/*global jquery $ */
/*****************************************************************************
 *
 * Jquery interfaces.
 *
 *****************************************************************************
 */
var ioModule = (function () {
    /**
     * Send message to user.  Displays html.
     *
     * @param {String} in_text -- text of messsage to be sent
     * @param {String} header -- header on the display page
     * @param {function} actions -- code to excute upon exiting the
     *                              message window
     *
     */
    function message(in_text, header, actions) {
        $("<div></div>").html(in_text).dialog({
            title: header,
            resizable: false,
            modal: true,
            buttons: {
                "OK": function () {
                    $(this).dialog("close");
                }
            },
            close: function () {
                if (actions) {
                    actions();
                }
            }
        });
    }

    return {
        message
    };
}());
