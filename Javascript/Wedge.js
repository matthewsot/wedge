/// <reference path="jquery.d.ts" />

var FadeAnimation = (function () {
    function FadeAnimation() {
    }
    FadeAnimation.prototype.animateIn = function (overlayId, contentId, completed) {
        $('#' + overlayId).fadeIn('slow');
        $('#' + contentId).animate({ opacity: 1 }, 'slow', completed);
    };

    FadeAnimation.prototype.animateOut = function (overlayId, contentId, completed) {
        $('#' + overlayId).fadeOut('slow', completed);
        $('#' + contentId).fadeOut('slow');
    };
    return FadeAnimation;
})();

var SlideAnimation = (function () {
    function SlideAnimation() {
    }
    SlideAnimation.prototype.animateIn = function (overlayId, contentId, completed) {
        $('#' + overlayId).fadeIn('slow');
        var content = '#' + contentId;
        var regularMarginLeft = parseInt($(content).css('margin-left').replace('px', ''));
        $(content).css('margin-left', (regularMarginLeft - 50) + 'px');
        $(content).animate({
            "opacity": 1,
            marginLeft: regularMarginLeft + 'px'
        }, completed);
    };
    SlideAnimation.prototype.animateOut = function (overlayId, contentId, completed) {
        $('#' + overlayId).fadeOut('slow', completed);
        var regularMarginLeft = parseInt($('#' + contentId).css('margin-left').replace('px', ''));
        $('#' + contentId).animate({
            "opacity": 0,
            marginLeft: (regularMarginLeft - 50) + 'px'
        });
    };
    return SlideAnimation;
})();

var wedge = (function () {
    function wedge() {
    }
    wedge.keyUpHandler = function (e) {
        if (e.keyCode == 27) {
            wedge.close();
        }
    };

    wedge.link = "";
    wedge.options = {};
    wedge.setOptions = function (options) {
        wedge.options = {
            animator: fadeAnimation,
            allowExit: true,
            exitOnEscape: true,
            exitOnClick: true,
            title: "",
            type: "div",
            opacity: 0.9,
            autoPositionType: 1,
            overlayId: "wedge-overlay",
            contentId: "wedge-content"
        };

        /*
         * To use a custom positioner, set options.autoPositionType = 0
         * and specify options.positioner = function (content), where content is
         * the #wedge-content to be positioned.
         */
        if (typeof options.autoPositionType === "undefined") options.autoPositionType = wedge.options.autoPositionType;
        switch (options.autoPositionType) {
            case 0:
                wedge.options.positioner = function() {};
                break;
            case 1:
                //This is less of a "good" solution, but it doesn't mess with transforms
                //(which is useful for the animations that do)
                options.positioner = function(content) {
                    $(content).css({
                        top: "50%",
                        left: "50%",
                        marginTop: "-" + ($(content).height() / 2) + "px",
                        marginLeft: "-" + ($(content).width() / 2) + "px"
                    });
                };
                break;
            case 2:
                //This is recommended for the standard animations.
                options.positioner = function (content) {
                    $(content).css({
                        top: "50%",
                        left: "50%",
                        transform: "translateY(-50%) translateX(-50%)"
                    });
                };
                break;
        }

        for (var option in options) {
            wedge.options[option] = options[option];
        }
    };

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
    wedge.show = function (link, options) {
        if (typeof options === "undefined") options = {};

        if (typeof options.type === "undefined") {
            if (link.startsWith("#")) {
                options.type = "element";
            } else if (link.indexOf("youtube.com") !== -1) {
                options.type = "youtube";
            } else {
                options.type = "image";
            }
        }

        wedge.setOptions(options);

        /*
        * Shows the overlay
        */
        this.link = link;
        this.type = type;
        this.overlayId = overlayId;
        this.contentId = contentId;


        if (wedge.options.allowExit) {
            if (wedge.options.exitOnClick) {
                $(overlay).click(this.close);
            }
            if (wedge.options.exitOnEscape) {
                $(document).keyup(this.keyUpHandler);
            }
        }

        /*
        * Shows the content
        */
        var content = $("<div></div>", { id: wedge.options.contentId }).css({
            textAlign: "center",
            zIndex: "2147483641",
            opacity: "0",
            position: "fixed"
        });

        $("body").append(content);

        switch (wedge.options.type) {
            case "element":
                $(content).append($(link));
                $(link).show();
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
            var doPositioning = function () {
                $(content).css({ top: '50%', left: '50%', marginTop: '-' + ($(content).height() / 2) + 'px', marginLeft: '-' + ($(content).width() / 2) + 'px' });
            };
            doPositioning();
            if (type == 'img') {
                window.onresize = function () {
                    $("#wedge-img").css({ maxHeight: (window.innerHeight * .80) + 'px', maxWidth: (window.innerWidth * .80) + 'px' });
                    doPositioning();
                };

                //Some images can take a while to load, so make sure to position them once they load
                var isShownYet = false;
                $("#wedge-img").load(function () {
                    if (isShownYet) {
                        //we don't want to mess with anything until after it's shown, since some animations rely on the margins
                        doPositioning();
                    }
                });
                this.animator.animateIn(overlayId, contentId, function () {
                    isShownYet = true;
                    doPositioning(); //in case the image has already loaded
                });
            } else {
                this.animator.animateIn(overlayId, contentId, function () {
                });
            }
        } else {
            this.animator.animateIn(overlayId, contentId, function () {
            });
        }
    };

    wedge.close = function (callback) {
        wedge.animator.animateOut(wedge.overlayId, wedge.contentId, function () {
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
    };
    return wedge;
})();
