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
        document.addEventListener('touchmove', e => {
          console.log("whelled");
          let target = e.target;
          let steps = document.querySelectorAll('.step');
          for (let i = 0; i < steps.length; i++) {
            if (!steps[i].classList.contains('element-show')) {
              steps[i].classList.add('element-show');
              return
            }
          }
          enableScroll()
        });


        document.addEventListener('wheel', e => {
          console.log("whelled");
          e.preventDefault();
          let target = e.target;
          let steps = document.querySelectorAll('.step');
          for (let i = 0; i < steps.length; i++) {
            if (!steps[i].classList.contains('element-show')) {
              steps[i].classList.add('element-show');
              return
            }
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
  let prevRatio = 0;
  let ratioKoeficient=0.95;
  let candleSection = document.querySelector('.candle-section-head')
  let h1 = document.querySelector('.header-span');
  let candleText = document.querySelector('.candle-text');

  if (window.innerWidth <600) {
    h1.classList.add('static');
  }

  let observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      let curRatio = entry.intersectionRatio
      curRatio > 0.1 ? entry.target.classList.add('animated') : (entry.target.classList.remove('animated'));

  
      if (window.innerWidth < 600) {
        ratioKoeficient=0.9;
      }

      curRatio < ratioKoeficient ?
        (candleSection.classList.add('animated'),
          h1.classList.add('out'),
          h1.classList.remove('static'),
          candleText.classList.add('in'),
          candleText.classList.remove('out')) :
        (candleSection.classList.remove('animated'),
          h1.classList.remove('out'),
          candleText.classList.remove('in'),
          candleText.classList.add('out'),
          prevRatio != 0 && curRatio >= ratioKoeficient ?
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
