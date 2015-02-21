//Animations that require other libraries to work
//Requires jquery.GSAP: http://www.greensock.com/jquery-gsap-plugin/
var scaleAnimation = (function () {
    function scaleAnimation() {}

    scaleAnimation.prototype.animateIn = function (overlay, content, completed) {
        $(overlay).fadeIn("slow", completed);

        $(content).css("transform", "matrix(0.2, 0, 0, 0.2, 0, 0)");
        $(content).animate({
            scaleX: 1,
            scaleY: 1,
            "opacity": 1
        });
    };

    scaleAnimation.prototype.animateOut = function (overlay, content, completed) {
        $(overlay).fadeOut("slow", completed);
        $(content).animate({
            scaleX: 0.2,
            scaleY: 0.2,
            "opacity": 0
        });
    };

    return scaleAnimation;
})();

//Requires jQuery.GSAP for scale animations
var rotateAnimation = (function () {
    function rotateAnimation() {}

    rotateAnimation.prototype.animateIn = function (overlay, content, completed) {
        $(overlay).fadeIn("slow");

        $(content).css("transform", "matrix3d(0.93969, 0.34202, 0, 0, -0.34202, 0.93969, 0, 0, 0, 0, 1, -0.05, 0, 0, 0, 1)");
        $(content).animate({
            rotationZ: 0,
            "opacity": 1
        }, completed);
    };

    rotateAnimation.prototype.animateOut = function (overlay, content, completed) {
        $(overlay).fadeOut("slow", completed);

        $(content).animate({
            rotationZ: -20,
            "opacity": 0
        });
    };

    return rotateAnimation;
})();
