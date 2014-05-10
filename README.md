wedge
=====
A drop-dead simple lightbox written in Typescript. [Demo](http://matthewsot.github.com/wedge/Demo)

Wedge can display images, YouTube videos, and divs easily.

To show an image with the title text "Hey there!", just use:
```
initWedge('img.jpg', 'img', 'Hey there!');
```

Like animations? Wedge makes them easy -
```
initWedge('https://www.youtube.com/watch?v=wZZ7oFKsKzY', 'youtube', '', new SlideAnimation());
```

Wedge comes with two built-in animations (FadeAnimation and SlideAnimation), but you can easily create your own:
```
//(Typescript)
class FadeAnimation implements IWedgeAnimator {
    animateIn(overlayId, contentId): void {
        $('#' + overlayId).fadeIn('slow');
        $('#' + contentId).fadeIn('slow');
    }

    animateOut(overlayId, contentId, completed): void {
        $('#' + overlayId).fadeOut('slow');
        $('#' + contentId).fadeOut('slow');
    }
}

initWedge('some-div-id', 'div', '', new FadeAnimation());
```

There are even more complicated animations (like ScaleAnimation and RotateAnimation) which use separate animation libraries. You can find and use those in Animations.ts:

And if you don't like a default, you can customize just about any part of the lightbox through parameters:
```
initWedge(link: 'some-div-id', type: 'div', title: 'title', animator: new ScaleAnimation(), exitOnEscape: true, doAutoPosition: true, opacity: 0.8, allowExit: true, overlayId: 'overlay-id', contentId: 'content-container-id');
```

## Dependencies
jQuery is the only requirement to use Wedge.js, which contains the basic lightbox and two animations (FadeAnimation and SlideAnimation). 

If you'd like to use the animations in Animations.js (such as ScaleAnimation and RotateAnimation), you'll need to add the jquery.gsap plugin to your site. Instructions for that can be found [here](http://www.greensock.com/jquery-gsap-plugin/).