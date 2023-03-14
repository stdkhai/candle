////////////////////scroll limiter///////////////////////////////

var keys = { 37: 1, 38: 1, 39: 1, 40: 1 };

function preventDefault(e) {
  e.preventDefault();
}

function preventDefaultForScrollKeys(e) {
  if (keys[e.keyCode]) {
    preventDefault(e);
    return false;
  }
}

var supportsPassive = false;
try {
  window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
    get: function () { supportsPassive = true; }
  }));
} catch (e) { }

var wheelOpt = supportsPassive ? { passive: false } : false;
var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

function disableScroll() {
  window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
  window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
/*   window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
 */  window.addEventListener('keydown', preventDefaultForScrollKeys, false);
}

function enableScroll() {
  window.removeEventListener('DOMMouseScroll', preventDefault, false);
  window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
/*   window.removeEventListener('touchmove', preventDefault, wheelOpt);
 */  window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
}

//////////////////////////////////////////////////////

//////////////////////steps animation/////////////////////////////////

async function onEntry(entry) {
  for (let i = 0; i < entry.length; i++) {
    if (entry[i].isIntersecting) {
      disableScroll()
      if (i == 0) {
        document.addEventListener('touchmove',e=>{
          for (let i = 0; i < steps.length; i++) {
              steps[i].classList.add('element-show');
              
          }
        });

        document.addEventListener('wheel', e => {
          e.preventDefault();
          let steps = document.querySelectorAll('.step');
          for (let i = 0; i < steps.length; i++) {
              steps[i].classList.add('element-show');
              return
            
          }
          enableScroll()
        })
      }
    }
  }
}

//////////////////////////////////////////////////////////////////////

////////////////////////////chande classes on scroll//////////////////////////////////////////
window.addEventListener('load', event => {
  let box = document.querySelector('header')
  let prevRatio = 0
  let candleSection = document.querySelector('.candle-section-head')
  let h1 = document.querySelector('.header-span');
  let candleText = document.querySelector('.candle-text');
  let observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      let curRatio = entry.intersectionRatio
      curRatio > 0.1 ? entry.target.classList.add('animated') : (entry.target.classList.remove('animated'));

      curRatio < 0.95 ?
        (candleSection.classList.add('animated'),
          h1.classList.add('out'),
          h1.classList.remove('static'),
          candleText.classList.add('in'),
          candleText.classList.remove('out')) :
        (candleSection.classList.remove('animated'),
          h1.classList.remove('out'),
          candleText.classList.remove('in'),
          candleText.classList.add('out'),
          prevRatio != 0 && curRatio >= 0.95 ?
            h1.classList.add('static') :
            h1.classList.remove('static'))

      prevRatio = curRatio
    })
  }, {
    threshold: buildThresholdList()
  })

  observer.observe(box)
  function buildThresholdList() {
    let thresholds = []
    let steps = 20

    for (let i = 1.0; i <= steps; i++) {
      let ratio = i / steps
      thresholds.push(ratio)
    }
    return thresholds
  }
})

///////////////////////////////////////////////////////////////

//////////////////////////set observer to steps////////////////////////////////////
let options = { threshold: [0.99] };
let observer = new IntersectionObserver(onEntry, options);
let elements = document.querySelectorAll('.step');
for (let elm of elements) {
  observer.observe(elm);
}
////////////////////////////////////////////////////////////////////////////////

//////////////////////////lines for details/////////////////////////////////////////////////
one = $('#detail1').position();
two = $('#flame').position();
$('#line1').attr({ "x2": two.left, "y2": $('#flame').offset().top, "y1": $('#detail1').offset().top, "x1": $('#detail1').width() });


one = $('#detail2').position();
two = $('#wix').position();
$('#line2').attr({ "x2": $('#wix').offset().left + $('#wix').width() / 2, "y2": $('#wix').offset().top, "y1": $('#detail2').offset().top, "x1": $('#detail2').offset().left });


one = $('#detail3').position();
two = $('#wix').position();
$('#line3').attr({ "x2": $('#wix').offset().left + $('#wix').width() / 2, "y2": $('#wix').offset().top + $('#wix').height() / 3 * 2, "y1": $('#detail3').offset().top, "x1": $('#detail3').width() });


one = $('#detail4').position();
two = $('#wix').position();
$('#line4').attr({ "x2": $('#wix').offset().left + $('#wix').width() * 0.9, "y2": $('#wix').offset().top + $('#wix').height() / 3 * 2, "y1": $('#detail4').offset().top, "x1": $('#detail4').offset().left });


one = $('#detail5').position();
two = $('#wix').position();
$('#line5').attr({ "x2": $('#wix').offset().left + $('#wix').width() * 0.7, "y2": $('#wix').offset().top + $('#wix').height() / 5 * 4, "y1": $('#detail5').offset().top, "x1": $('#detail5').offset().left });
//////////////////////////////////////////////////////////////////////////////