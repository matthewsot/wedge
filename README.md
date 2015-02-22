wedge
=====
A drop-dead simple lightbox.

[Demo](http://matthewsot.github.com/wedge/demo)

How to use
==========
To use wedge, just use wedge.show:

```
wedge.show(link, options);
```

``link`` is a string, containing an element selector (like ``#id``), youtube link, or image link.

```options``` is an object with any number of properties, all of which are optional:

```
wedge.options = {
    animator: fadeAnimation, //The animation to use
    allowExit: true, //Whether to allow exiting the wedge
    exitOnEscape: true, //Whether pressing "Escape" should exit the wedge
    exitOnClick: true, //Whether clicking the overlay should exit the wedge
    title: "", //The title to be displayed below the wedge
    type: "element", //The type of the wedge, either "element", "image", or "youtube"
    opacity: 0.9, //The opacity of the overlay
    autoPositionType: 1, //The auto positioner to use. 0 is none/custom, 1 is auto, and 2 is experimental
    positioner: function() { }, //The positioner to use
    overlayId: "wedge-overlay", //The ID to use for the overlay
    contentId: "wedge-content" //The ID to use for the content container
};
```

### Custom Animators
Wedge supports custom animators. All you need to do is create an object with two function properties:
```
var yourAnimation = {};
yourAnimation.animateIn = function (overlay, content, completed) {
    //Complete the animation on $(overlay) and $(content), then call completed
};

yourAnimation.animateOut = function (overlay, content, completed) {
    //Complete the animation on $(overlay) and $(content), then call completed
};
```

### Types
Wedge will attempt to auto-determine the type of link, but if you'd like to override that you can pass the ```type``` option.

### Positioners
I'd recommend leaving ``options.autoPositionerType: 1`` unless you have major problems with the positioner.

If you do have problems, try ``options.autoPositionerType: 2``. To use a custom positioner, set ``options.autoPositionerType: 0`` and provide an ``options.positioner``:

```
var options = {
    autoPositionerType: 0,
    positioner: function (content) {
        //position $(content) however you'd like
    }
}
```

## Dependencies
jQuery is the only requirement to use wedge, which contains the basic lightbox and two animations (fadeAnimation and slideAnimation). 

If you'd like to use the animations in animations.js (such as scaleAnimation and rotateAnimation), you'll need to add the jquery.gsap plugin to your site. Instructions for that can be found [here](http://www.greensock.com/jquery-gsap-plugin/).