/// <reference path="jquery.d.ts" />

var fadeAnimation = (function () {
    function fadeAnimation() { }

    fadeAnimation.animateIn = function (overlay, content, completed) {
        $(overlay).fadeIn("slow");

        $(content).animate({ opacity: 1 }, "slow", completed);
    };

    fadeAnimation.animateOut = function (overlay, content, completed) {
        $(overlay).fadeOut("slow", completed);

        $(content).fadeOut("slow");
    };

    return fadeAnimation;
})();

var slideAnimation = (function () {
    function slideAnimation() { }

    slideAnimation.animateIn = function (overlay, content, completed) {
        $(overlay).fadeIn("slow");

        var regularMarginLeft = parseInt($(content).css("margin-left").replace("px", ""));
        $(content).css("margin-left", (regularMarginLeft - 50) + "px");
        $(content).animate({
            "opacity": 1,
            marginLeft: regularMarginLeft + "px"
        }, completed);
    };

    slideAnimation.animateOut = function (overlay, content, completed) {
        $(overlay).fadeOut("slow", completed);

        var regularMarginLeft = parseInt($(content).css("margin-left").replace("px", ""));
        $(content).animate({
            "opacity": 0,
            marginLeft: (regularMarginLeft - 50) + "px"
        });
    };

    return slideAnimation;
})();

var wedge = (function () {
    function wedge() {
    }

    wedge.keyUpHandler = function (e) {
        if (e.keyCode === 27) {
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
    * exitOnClick: Controls whether the lightbox can be exited by clicking on the overlay
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

        //Add the overlay div
        var overlay = $("<div></div>", { id: wedge.options.overlayId })
                .css({
                    overflow: "hidden",
                    top: "0",
                    left: "0",
                    position: "fixed",
                    zIndex: "2147483630",
                    opacity: wedge.options.opacity,
                    backgroundColor: "#000000",
                    display: "none",
                    height: "100%",
                    width: "100%"
                });

        $("body").append(overlay);

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
            case "youtube":
                var tubeFrame = $("<iframe></iframe>")
                    .attr("width", "853")
                    .attr("height", "480")
                    .attr("src", link.replace("/watch?v=", "/embed/").replace(/&.*/, ""))
                    .attr("frameborder", "0")
                    .attr("allowfullscreen", "allowfullscreen")
                    .attr("id", "youtube-img");

                var title = $("<h3></h3>").text(wedge.options.title).css("color", "#A0A0A0");

                $(content).append(tubeFrame).append(title);
                break;
            case "image":
                var image = $("<img></img>")
                    .attr("src", link)
                    .css({
                        maxHeight: (window.innerHeight * .80) + "px",
                        maxWidth: (window.innerWidth * .80) + "px"
                    }).attr("id", "wedge-img");

                var title = $("<h3></h3>").text(wedge.options.title).css("color", "#A0A0A0");

                $(content).append(image).append(title);
                break;
        }

        wedge.options.positioner(content);

        if (wedge.options.type === "image") {
            window.onresize = function() {
                $("#wedge-img").css({
                    maxHeight: (window.innerHeight * .80) + "px",
                    maxWidth: (window.innerWidth * .80) + "px"
                });
                wedge.options.positioner(content);
            };

            //Some images can take a while to load, so make sure to position them once they load
            var isShownYet = false;
            $("#wedge-img").load(function() {
                if (isShownYet) {
                    //we don't want to mess with anything until after it's shown, since some animations rely on the margins
                    wedge.options.positioner(content);
                }
            });
            wedge.options.animator.animateIn($("#" + wedge.options.overlayId), $("#" + wedge.options.contentId), function () {
                isShownYet = true;
                wedge.options.positioner(content); //in case the image has already loaded
            });
        } else {
            wedge.options.animator.animateIn($("#" + wedge.options.overlayId), $("#" + wedge.options.contentId), function () {
            });
        }
    };

    wedge.close = function (callback) {
        wedge.options.animator.animateOut($("#" + wedge.options.overlayId), $("#" + wedge.options.contentId), function () {
            if (wedge.options.type === "element") {
                $(wedge.link).appendTo($("body"));
                $(wedge.link).hide();
            }
            var overlay = $("#" + wedge.options.overlayId);
            var content = $("#" + wedge.options.contentId);

            $(overlay).unbind("click", close);
            $(document).unbind("keyup", wedge.keyUpHandler);

            $(overlay).stop().remove();
            $(content).stop().remove();

            if (typeof callback == "function") {
                callback();
            }
        });
    };
    return wedge;
})();
