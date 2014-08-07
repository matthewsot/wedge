/// <reference path="jquery.d.ts" />

interface IWedgeAnimator {
    animateIn(overlayId, contentId, completed): void;
    animateOut(overlayId, contentId, completed): void;
}

class FadeAnimation implements IWedgeAnimator {
    animateIn(overlayId, contentId, completed): void {
        $('#' + overlayId).fadeIn('slow');
        $('#' + contentId).animate({ opacity: 1 }, 'slow', completed);
    }

    animateOut(overlayId, contentId, completed): void {
        $('#' + overlayId).fadeOut('slow', completed);
        $('#' + contentId).fadeOut('slow');
    }
}

class SlideAnimation implements IWedgeAnimator {
    animateIn(overlayId, contentId, completed) {
        $('#' + overlayId).fadeIn('slow');
        var content = '#' + contentId;
        var regularMarginLeft = parseInt($(content).css('margin-left').replace('px', ''));
        $(content).css('margin-left', (regularMarginLeft - 50) + 'px');
        $(content).animate({
            "opacity": 1,
            marginLeft: regularMarginLeft + 'px'
        }, completed);
    }
    animateOut(overlayId, contentId, completed) {
        $('#' + overlayId).fadeOut('slow', completed);
        var regularMarginLeft = parseInt($('#' + contentId).css('margin-left').replace('px', ''));
        $('#' + contentId).animate({
            "opacity": 0,
            marginLeft: (regularMarginLeft - 50) + 'px'
        });
    }
}

class wedge {
    static animator: IWedgeAnimator;
    static type: string;
    static link: string;
    static overlayId: string;
    static contentId: string;

    static keyUpHandler(e) { //Thanks! https://stackoverflow.com/questions/3369593/how-to-detect-escape-key-press-with-javascript
        if (e.keyCode == 27) {
            wedge.close();
        }        
    }

    /* initWedge()
     * Displays the Wedge Lightbox
     *
     * link: A link to the youtube video or picture
     * title: Text displayed below the content
     * type: The type of link provided - youtube, img, or div
     * animatorToUse: An IWedgeAnimator that controls how animations are handled
     * exitOnEscape: Controls whether the lightbox can be exited by pressing the escape key
     * doAutoPosition: Controls whether the lightbox is automatically centered
     * opacity: The final opacity of the overlay
     * allowExit: Controls whether the user is allowed to exit the lightbox
     */
    static show(link, type, title, animator: IWedgeAnimator = new FadeAnimation, exitOnEscape = true, doAutoPosition = true, opacity = 0.9, allowExit = true, overlayId = 'wedge-overlay', contentId = 'wedge-content') {
        /*
         * Shows the overlay
         */
        var overlay = '#' + overlayId;
        var content = '#' + contentId;

        this.animator = animator;
        this.link = link;
        this.type = type;
        this.overlayId = overlayId;
        this.contentId = contentId;

        $('body').append('<div id="' + overlayId + '" style="overflow:hidden;top:0px;left:0px;position:fixed;z-index:2147483630;opacity:' + opacity.toString() + ';background-color:#000000;display:none;height:100%;width:100%;" />');

        if (allowExit) {
            $(overlay).click(this.close);
            if (exitOnEscape) {
                $(document).keyup(this.keyUpHandler);
            }
        }
        /*
         * Shows the content
         */
        $('body').append('<div id="' + contentId + '" style="text-align:center;z-index:2147483641;opacity:0;position:fixed;">');
        switch (type) {
        case 'youtube':
            $(content).append('<iframe id="youtube-img" width="853" height="480" src="' + link.replace('/watch?v=', '/embed/').replace(/&.*/, '') + '" frameborder="0" allowfullscreen></iframe><h3 style="color:#A0A0A0;">' + title + '</h3>');
            break;
        case 'img':
            $(content).append('<img id="wedge-img" src="' + link + '" style="max-height:' + (window.innerHeight * .80) + 'px;max-width:' + (window.innerWidth * .80) + 'px;"/><h3 style="color:#A0A0A0;">' + title + '</h3>');
            break;
        case 'div':
            $('#' + link).show();
            $(content).append($("#" + link));
        }
        if (doAutoPosition) {
            //this is more of a sure-fire way to do it, even if it's a bit sketchy
            var doPositioning = () => {
                $(content).css({ top: '50%', left: '50%', marginTop: '-' + ($(content).height() / 2) + 'px', marginLeft: '-' + ($(content).width() / 2) + 'px' });
            }
            doPositioning();
            if (type == 'img') {
                window.onresize = function () {
                    $("#wedge-img").css({ maxHeight: (window.innerHeight * .80) + 'px', maxWidth: (window.innerWidth * .80) + 'px'});
                    doPositioning();
                }
                //Some images can take a while to load, so make sure to position them once they load
                var isShownYet = false;
                $("#wedge-img").load(() => {
                    if (isShownYet) {
                        //we don't want to mess with anything until after it's shown, since some animations rely on the margins
                        doPositioning();
                    }
                });
                this.animator.animateIn(overlayId, contentId, () => {
                    isShownYet = true;
                    doPositioning(); //in case the image has already loaded
                });
            } else {
                this.animator.animateIn(overlayId, contentId, () => {});
            }
        } else {
            this.animator.animateIn(overlayId, contentId, () => {});
        }
    }

    static close(callback?: Function) {
        wedge.animator.animateOut(wedge.overlayId, wedge.contentId, () => {
            if (wedge.type == 'div') {
                $('#' + wedge.link).appendTo($('body'));
                $('#' + wedge.link).hide();
            }
            $('#' + wedge.overlayId).unbind('click', close);
            $(document).unbind("keyup", wedge.keyUpHandler);

            $('#' + wedge.overlayId).stop().remove();
            $('#' + wedge.contentId).stop().remove();
            if (typeof callback == "function") {
                callback();
            }
        });
    }
}