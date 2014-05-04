/// <reference path="jquery.d.ts" />

var SimpleFadeAnimation = (function () {
    function SimpleFadeAnimation() {
    }
    SimpleFadeAnimation.prototype.animateIn = function (overlayId, contentId) {
        $('#' + overlayId).fadeIn('slow');
        $('#' + contentId).fadeIn('slow');
    };

    SimpleFadeAnimation.prototype.animateOut = function (overlayId, contentId, completed) {
        $('#' + overlayId).fadeOut('slow');
        $('#' + contentId).fadeOut('show');
    };
    return SimpleFadeAnimation;
})();

//Requires jQuery.GSAP for scale animations
var ScaleInAnimation = (function () {
    function ScaleInAnimation() {
    }
    ScaleInAnimation.prototype.animateIn = function (overlayId, contentId) {
        $('#' + overlayId).fadeIn('slow');
        var content = '#' + contentId;
        $(content).css('transform', 'matrix(0.2, 0, 0, 0.2, 0, 0)');
        $(content).animate({
            scaleX: 1,
            scaleY: 1,
            "opacity": 1
        });
    };
    ScaleInAnimation.prototype.animateOut = function (overlayId, contentId, completed) {
        $('#' + overlayId).fadeOut('slow', completed);
        $('#' + contentId).animate({
            scaleX: 0.2,
            scaleY: 0.2,
            "opacity": 0
        });
    };
    return ScaleInAnimation;
})();

/*
* Displays the Wedge Lightbox.
* link: A link to the youtube video or picture.
* title: Text displayed below the content
* type: The type of link provided - youtube or pic
*/
function initWedge(link, title, type, animator, doAutoPosition, opacity, allowExit, overlayId, contentId) {
    if (typeof animator === "undefined") { animator = new SimpleFadeAnimation; }
    if (typeof doAutoPosition === "undefined") { doAutoPosition = true; }
    if (typeof opacity === "undefined") { opacity = 0.9; }
    if (typeof allowExit === "undefined") { allowExit = true; }
    if (typeof overlayId === "undefined") { overlayId = 'wedge-overlay'; }
    if (typeof contentId === "undefined") { contentId = 'wedge-content'; }
    /*
    * Shows the overlay
    */
    var overlay = '#' + overlayId;
    var content = '#' + contentId;

    $('body').append('<div id="' + overlayId + '" style="overflow:hidden;top:0px;left:0px;position:fixed;z-index:2147483630;opacity:' + opacity.toString() + ';background-color:#000000;display:none;" />');
    $(overlay).css('height', window.innerHeight);
    $(overlay).css('width', window.innerWidth);

    if (allowExit) {
        $(overlay).click(function () {
            animator.animateOut(overlayId, contentId, function () {
                if (type == 'div') {
                    $('#' + link).appendTo($('body'));
                    $('#' + link).hide();
                }
                $(content).stop().remove();
                $(overlay).stop().remove();
            });
        });
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
//# sourceMappingURL=Wedge.js.map
