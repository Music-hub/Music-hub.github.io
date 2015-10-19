/* animate menu */
;
;(function () {
  $("#toggle-menu").remove();
  var isOn = false;
  
  var menuWidth = $('.links').width();
  $('.links').css({
    'right' : (-menuWidth) + 'px'
  });
  function toggleMenu () {
    var menuWidth = $('.links').width();
    $('.overlay').stop();
    $('.links').stop();
    if (!isOn) {
      $('.overlay').fadeIn();
      $('.links').animate({
        'right' : '0px',
      }, 1000)
    } else {
      $('.overlay').fadeOut();
      $('.links').animate({
        'right' : (-menuWidth) + 'px',
      }, 1000)
    }
    isOn = !isOn;
  }
  $('nav .icon, nav .close').click(toggleMenu);
} ());


/* make nav color transform */

;(function () {
  function throttle (func, delay) {
    var id = null;
    return function () {
      if (!id) {
        id = setTimeout(function () {
          id = null;
          func();
        }, delay)
      }
    }
  }
  if (!window.console) {
    window.console = {
      log : window.alert
    };
  }
  var navHeight = $('nav').height();
  var header = $('header');
  var headerBottom = $('header').offset().top + $('header').outerHeight() - navHeight;
  var color = [112, 144, 160];
  var initAlpha = 0;
  var finalAlpha = 1;
  var ie8 = '#606060';
  var handle = throttle(function (ev) {
    var alpha;
    var currentScroll = $(window).scrollTop();
    //console.log(navHeight, headerBottom, currentScroll);
    if (currentScroll < headerBottom - navHeight) {
      alpha = initAlpha;
    } else if (headerBottom < currentScroll) {
      alpha = finalAlpha;
    } else {
      alpha = ((headerBottom - currentScroll) * initAlpha +
               (currentScroll - headerBottom + navHeight) * finalAlpha)
        / navHeight;
    }
    //alert('rgba(' + color.concat([alpha]).join('') + ')');
    var bg = 'rgba(' + color.concat([alpha]).join(',') + ')';
    if ($('html').hasClass('ie-8') && headerBottom < currentScroll) {
      bg = ie8;
    }
    $('nav').css('background', bg);
    //console.log(alpha, bg);
  }, 100);
  $(document).on('scroll', handle);
  $(window).scroll(handle);
  $(window).on('resize', function () {
    navHeight = $('nav').height();
    headerBottom = $('header').offset().top + $('header').outerHeight() - navHeight;
    $(document).trigger('scroll');
    $(window).trigger('scroll');
  })
} ());

/* make scroll smooth */

/**
* Check a href for an anchor. If exists, and in document, scroll to it.
* If href argument ommited, assumes context (this) is HTML Element,
* which will be the case when invoked by jQuery after an event
*/

;(function () {
  function scroll_if_anchor(href) {
    var ev = typeof(href) == "string" ? null : href;
    href = typeof(href) == "string" ? href : $(this).attr("href");

    // You could easily calculate this dynamically if you prefer
    var fromTop = 0;

    // If our Href points to a valid, non-empty anchor, and is on the same page (e.g. #foo)
    // Legacy jQuery and IE7 may have issues: http://stackoverflow.com/q/1593174
    if(href.indexOf("#") == 0) {
      var $target = $(href);
      // Older browser without pushState might flicker here, as they momentarily
      // jump to the wrong position (IE < 10)
      if($target.get().length) {
        if (ev) {ev.preventDefault();}
        var top = $target.offset().top;
        $('html, body').animate({ scrollTop: top - fromTop });
        if(history && "pushState" in history) {
          history.pushState({}, document.title, window.location.pathname + href);
          return false;
        }
      }
    }
  }    

  // When our page loads, check to see if it contains and anchor
  scroll_if_anchor(window.location.hash);

  // Intercept all anchor clicks
  $("body").on("click", "a", scroll_if_anchor);

}());

/* link scrollspy */


;(function () {
  var spyLinks = [
    "#about-wrapper",
    "#description",
    "#images",
    "#feature",
    "#copyright"
  ];
  var offsets = 40;
  var linkContainers = spyLinks.map(function (val) {
    return $('a[href=' + val + ']').parent();
  });
  var elements = spyLinks.map(function (val) {
    return $(val);
  });
  var areas = null;
  function getAreas() {
    areas = elements.map(function (el) {
      return [
        el.offset().top,
        el.offset().top + el.outerHeight()
      ]
    })
  }
  getAreas();
  
  //console.log(linkContainers, elements, areas);
  var scrollHandle = function () {
    var currentScroll = $(window).scrollTop() + offsets;
    var max = areas.length - 1;
    var foundIndex = null;
    var index;
    for (index = 0; index < max + 1; index++) {
      if (currentScroll < areas[index][1]) {
        break;
      }
    }
    //console.log(currentScroll, areas, index);
    index = index > max ? max : index;
    linkContainers.map(function (el) {
      el.removeClass('selected');
    })
    linkContainers[index].addClass('selected');
  }
  $(document).on('scroll', scrollHandle);
  $(window).scroll(scrollHandle);
  $(window).on('resize', function () {
    getAreas();
    $(document).trigger('scroll');
    $(window).trigger('scroll');
  });
}());

/* slide show */
(function () {
  var doc = document.documentElement;
  var top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
  
  $('.images .slides').unslider({
    speed: 500,               //  The speed to animate each slide (in milliseconds)
    delay: 3000,              //  The delay between slide animations (in milliseconds)
    keys: true,               //  Enable keyboard (left, right) arrow shortcuts
    dots: true,               //  Display dot navigation
    fluid: true ,             //  Support responsive design. May break non-responsive designs
    autoplay: false 
  });
  $('html, body').scrollTop(top);
  
  $(window).on('resize', function () {
    $('.images .slides, .images .slides ul').css({
      height: $(window).height() + 'px'
    })
  });
}())
/* force anything related to scroll init */
$(document).trigger('scroll');
$(window).trigger('scroll');