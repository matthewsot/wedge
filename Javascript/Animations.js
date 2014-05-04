/// <reference path="jquery.d.ts" />
//Animations that require other libraries to work
//Requires jquery.GSAP: http://www.greensock.com/jquery-gsap-plugin/
var ScaleAnimation = (function () {
    function ScaleAnimation() {
    }
    ScaleAnimation.prototype.animateIn = function (overlayId, contentId) {
        $('#' + overlayId).fadeIn('slow');
        var content = '#' + contentId;
        $(content).css('transform', 'matrix(0.2, 0, 0, 0.2, 0, 0)');
        $(content).animate({
            scaleX: 1,
            scaleY: 1,
            "opacity": 1
        });
    };
    ScaleAnimation.prototype.animateOut = function (overlayId, contentId, completed) {
        $('#' + overlayId).fadeOut('slow', completed);
        $('#' + contentId).animate({
            scaleX: 0.2,
            scaleY: 0.2,
            "opacity": 0
        });
    };
    return ScaleAnimation;
})();

//Requires jQuery.GSAP for scale animations
var RotationAnimation = (function () {
    function RotationAnimation() {
    }
    RotationAnimation.prototype.animateIn = function (overlayId, contentId) {
        $('#' + overlayId).fadeIn('slow');
        var content = '#' + contentId;
        $(content).css('transform', 'matrix3d(0.93969, 0.34202, 0, 0, -0.34202, 0.93969, 0, 0, 0, 0, 1, -0.05, 0, 0, 0, 1)');
        $(content).animate({
            rotationZ: 0,
            "opacity": 1
        });
    };
    RotationAnimation.prototype.animateOut = function (overlayId, contentId, completed) {
        $('#' + overlayId).fadeOut('slow', completed);
        $('#' + contentId).animate({
            rotationZ: -20,
            "opacity": 0
        });
    };
    return RotationAnimation;
})();
//# sourceMappingURL=Animations.js.map
