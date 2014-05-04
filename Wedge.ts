/// <reference path="jquery.d.ts" />

interface IWedgeAnimator {
    animateIn(overlayId, contentId): void;
    animateOut(overlayId, contentId, completed): void;
}

class SimpleFadeAnimation implements IWedgeAnimator {
    animateIn(overlayId, contentId): void {
        $('#' + overlayId).fadeIn('slow');
        $('#' + contentId).fadeIn('slow');
    }

    animateOut(overlayId, contentId, completed): void {
        $('#' + overlayId).fadeOut('slow');
        $('#' + contentId).fadeOut('show');
    }
}

//Requires jQuery.GSAP for scale animations
class ScaleInAnimation implements IWedgeAnimator {
    animateIn(overlayId, contentId) {
        $('#' + overlayId).fadeIn('slow');
        var content = '#' + contentId;
        $(content).css('transform', 'matrix(0.2, 0, 0, 0.2, 0, 0)');
        $(content).animate({
            scaleX: 1,
            scaleY: 1,
            "opacity": 1
        });
    }
    animateOut(overlayId, contentId, completed) {
        $('#' + overlayId).fadeOut('slow', completed);
        $('#' + contentId).animate({
            scaleX: 0.2,
            scaleY: 0.2,
            "opacity": 0
        });
    }
}

/* initWedge()
 * Displays the Wedge Lightbox
 *
 * link: A link to the youtube video or picture
 * title: Text displayed below the content
 * type: The type of link provided - youtube, pic, or div
 * animator: An IWedgeAnimator that controls how animations are handled
 * exitOnEscape: Controls whether the lightbox can be exited by pressing the escape key
 * doAutoPosition: Controls whether the lightbox is automatically centered
 * opacity: The final opacity of the overlay
 * allowExit: Controls whether the user is allowed to exit the lightbox
 */
function initWedge(link, title, type, animator: IWedgeAnimator = new SimpleFadeAnimation, exitOnEscape = true, doAutoPosition = true, opacity = 0.9, allowExit = true, overlayId = 'wedge-overlay', contentId = 'wedge-content') {
    /*
     * Shows the overlay
     */
    var overlay = '#' + overlayId;
    var content = '#' + contentId;

    $('body').append('<div id="' + overlayId + '" style="overflow:hidden;top:0px;left:0px;position:fixed;z-index:2147483630;opacity:' + opacity.toString() + ';background-color:#000000;display:none;" />');
    $(overlay).css('height', window.innerHeight);
    $(overlay).css('width', window.innerWidth);

    if (allowExit) {
        var doExit = () => {
            animator.animateOut(overlayId, contentId, () => {
                if (type == 'div') {
                    $('#' + link).appendTo($('body'));
                    $('#' + link).hide();
                }
                $(overlay).unbind('click', doExit);
                $(document).unbind("keyup", keyUp);

                $(overlay).stop().remove();
                $(content).stop().remove();
            });
        }

        var keyUp = (e) => { //Thanks! https://stackoverflow.com/questions/3369593/how-to-detect-escape-key-press-with-javascript
            if (e.keyCode == 27) {
                doExit();
            }
        };

        $(overlay).click(doExit);
        if (exitOnEscape) {
            $(document).keyup(keyUp);
        }
    }
    /*
     * Shows the content
     */
    $('body').append('<div id="' + contentId + '" style="text-align:center;z-index:2147483641;opacity:0;position:fixed;">');
    switch (type) {
        case 'youtube':
            $(content).append('<iframe id="youtubeFrame" width="853" height="480" src="' + link.replace('/watch?v=', '/embed/').replace(/&.*/, '') + '" frameborder="0" allowfullscreen></iframe><h3 style="color:#A0A0A0;">' + title + '</h3>');
            break;
        case 'pic':
            $(content).append('<img src="' + link + '" style="max-height:' + (window.innerHeight - 100) + 'px;max-width:' + (window.innerWidth - 100) + 'px;"/><h3 style="color:#A0A0A0;">' + title + '</h3>');
            break;
        case 'div':
            $('#' + link).show();
            $(content).append($("#" + link));
    }
    if (doAutoPosition) {
        $(content).css({ top: '50%', left: '50%', margin: '-' + ($(content).height() / 2) + 'px 0 0 -' + ($(content).width() / 2) + 'px' }); //courtesy of http://archive.plugins.jquery.com/project/autocenter
    }
    var goodMarginLeft = $(content).css('margin-left');
    $(content).css('margin-left', goodMarginLeft);
    animator.animateIn(overlayId, contentId);
}