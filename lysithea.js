// Store decisions.
var decisions = [];

// Default to title page.
$(document).ready(function() {
    loadPage("title");
});

// Display a page.
function loadPage(page) {
    // TODO: "testcontent.xml" should be named something else, or variable.
    // Consider making a separate Lysithea Engine JS file for common functions.
    $.get("./testcontent.xml", function(data) {
        // Find the designated page in the content XML file.
        var rawPage = $(data).find("page[id=" + page + "]");

        var temp;
        var text = "";
        var choices = "";
        var next = "";

        // TODO: You're doing the same thing thrice. Helper function this.
        
        // Find the text to display.
        temp = rawPage.find("text");
        if (temp.length > 0) {
            text = temp[0].innerHTML.trim();
        }

        // If there are choices to display, find them as well.
        temp = rawPage.find("choice");
        if (temp.length > 0) {
            choices = temp;
        }

        // Find the next page, if there is one.
        temp = rawPage.find("next");
        if (temp.length > 0) {
            next = temp[0].innerHTML.trim();
        }

        // Display the page text as HTML.
        
        // TODO: Parse this to allow for changeable text depending on previous
        // choices.
        $('#content').html(text);

        // Display the choices.
        if (choices.length > 0) {
            $('#content').append("<form id='choices'></form>");
            for (var i = 0; i < choices.length; i++) {
                var choice = choices[i].innerHTML.trim();
                var value = $(choices[i]).attr('value');
                var choiceNext = $(choices[i]).attr('next');

            var appendString = "<input type='radio' name='choice' value='" + value + "'";

            if (choiceNext != undefined) {
                appendString += " next='" + choiceNext + "'";
            }

            appendString += ">" + choice + "</input><br/>";
        
        $('#choices').append(appendString);
            }
        }

        // Display the next link. On click, save the choice made, if there was
        // a choice to be made.
        if (next.length > 0) {
            $('#content').append("<div id='next'><a href='#'>Next</a></div>");
            $('#next').click(function () {
                if (choices.length > 0) {
                    choice = $('input:checked').attr('value');
                    choiceNext = $('input:checked').attr('next');
                    if (choice == undefined) {
                        // TODO: Come up with some better text to remind
                        // someone that a choice needs to be made.
                        alert("Choose!");
                    } else {
                        // Record that choice.
                        recordChoice(decisions, page, choice);
                        if (choiceNext != undefined) {
                            loadPage(choiceNext);
                        } else {
                            loadPage(next);
                        }
                    }
                } else {
                    loadPage(next);
                }
            });
        }
    });
}

// Record choices made.
function recordChoice(decisions, page, choice) {
    decisions.push({"page":page, "choice":choice});
}
