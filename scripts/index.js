import { details } from './content.js'
window.addEventListener("load",function() {
  setTimeout(function(){
      // This hides the address bar:
      window.scrollTo(0, 1);
  }, 0);
});
document.querySelector("body").onload = startTime()
let candleGlowing = false;
let modalCross = document.querySelector("#close");
let feedback = document.querySelector('.feedback');
let notifyMe = document.querySelector('#notify');
////////////////////scroll limiter///////////////////////////////

var keys = { 37: 1, 38: 1, 39: 1, 40: 1 };
let hotspots = document.getElementsByClassName('HotspotAnnotation');
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
      if (window.innerWidth > 699) {
        disableScroll()
      }

      if (i == 0) {
        document.addEventListener('touchmove', async e => {
          let target = e.target;
          let steps = document.querySelectorAll('.step');
          for (let i = 0; i < steps.length; i++) {
              steps[i].classList.add('element-show');
              return
          }
          await sleep(2000)
          enableScroll()
        });


        document.addEventListener('wheel', async e => {
          e.preventDefault();
          let target = e.target;
          let steps = document.querySelectorAll('.step');
          for (let i = 0; i < steps.length; i++) {
              steps[i].classList.add('element-show');
              return
          }
          await sleep(2000)
          enableScroll()
        })
      }
    }
  }
}

//////////////////////////////////////////////////////////////////////


////////////////////////////chande classes on scroll//////////////////////////////////////////


window.addEventListener('load', e => {
  let box = document.querySelector('header')
  let prevRatio = 0;
  let ratioKoeficient = 0.92;
  let candleSection = document.querySelector('.candle-section-head')
  let h1 = document.querySelector('.header-span');
  let candleText = document.querySelector('.candle-text');


  if (window.innerWidth < 600) {
    h1.classList.add('static');
  }

  const modelViewer = document.querySelector('.model');
  const orbitCycle = [
    '105deg 84deg auto',
    '135deg 84deg auto',
    modelViewer.cameraOrbit
  ];

  let observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      let curRatio = entry.intersectionRatio;
      let curRatioKoef = 0.1;
      let isMobile = false;
      if (window.innerWidth <= 669) {
        ratioKoeficient = 0.7;
       // curRatioKoef = 0.7;
        isMobile = true;
      }
      console.log("curRatio", curRatio);
      console.log("prevRatio", prevRatio);
      console.log("ratioKoeficient", ratioKoeficient);
      console.log("curRatioKoeficient", curRatioKoef);
      console.log("scroolTop", window.scrollY);
      //  curRatio > curRatioKoef ? entry.target.classList.add('animated') : (entry.target.classList.remove('animated'));
      if (curRatio < ratioKoeficient) {
        candleSection.classList.add('animated')
        modelViewer.cameraOrbit = orbitCycle[1]
        h1.classList.add('out')
        h1.classList.remove('static')
        candleText.classList.add('in')
        candleText.classList.remove('out')
      } else if (!isMobile) {
        candleSection.classList.remove('animated')
        modelViewer.cameraOrbit = orbitCycle[0]
        h1.classList.remove('out')
        candleText.classList.remove('in')
        candleText.classList.add('out')
        prevRatio != 0 && curRatio >= ratioKoeficient ?
          h1.classList.add('static')
          :
          h1.classList.remove('static')
      } else//if mobile
       if (/*curRatio >= ratioKoeficient+0.085 */ window.scrollY<10) {
        candleSection.classList.remove('animated')
        modelViewer.cameraOrbit = orbitCycle[0]
        h1.classList.remove('out')
        candleText.classList.remove('in')
        candleText.classList.add('out')
        prevRatio != 0 && curRatio >= ratioKoeficient ?
          !isMobile ?
            h1.classList.add('static')
            : ""
          :
          h1.classList.remove('static')
      }

      /* curRatio < ratioKoeficient ?
        (
          candleSection.classList.add('animated'),
          modelViewer.cameraOrbit = orbitCycle[1],
          h1.classList.add('out'),
          h1.classList.remove('static'),
          candleText.classList.add('in'),
          candleText.classList.remove('out')
        ) :
        !isMobile ?
          (
            candleSection.classList.remove('animated'),
            modelViewer.cameraOrbit = orbitCycle[0],
            h1.classList.remove('out'),
            candleText.classList.remove('in'),
            candleText.classList.add('out'),
            prevRatio != 0 && curRatio >= ratioKoeficient ?
              !isMobile ?
                h1.classList.add('static')
                : ""
              :
              h1.classList.remove('static')
          ) :
          curRatio>=ratioKoeficient+0.04?
          (
            candleSection.classList.remove('animated'),
            modelViewer.cameraOrbit = orbitCycle[0],
            h1.classList.remove('out'),
            candleText.classList.remove('in'),
            candleText.classList.add('out'),
            prevRatio != 0 && curRatio >= ratioKoeficient ?
              !isMobile ?
                h1.classList.add('static')
                : ""
              :
              h1.classList.remove('static')
          ):
          ("") */

      prevRatio = curRatio
    })
  }, {
    threshold: buildThresholdList()
  })

  observer.observe(box)
  function buildThresholdList() {
    let thresholds = []
    let steps = 100

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

let descriptionBlock = document.querySelector('.detail-description')
for (let i = 0; i < hotspots.length; i++) {
  hotspots[i].addEventListener('click', async () => {
    let idx = hotspots[i].className.split(' ')[1];
    let title = descriptionBlock.querySelector('.title');
    let description = descriptionBlock.querySelector('.description');
    title.innerHTML = details[idx].title;
    description.innerHTML = details[idx].description;
    descriptionBlock.classList.add('animated');
    await sleep(1000);
    descriptionBlock.classList.add('shown');
  })

}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

////////////////////////Live clock/////////////////////
function startTime() {
  const today = new Date();
  let h = today.getHours();
  let m = today.getMinutes();
  h = checkTime(h);
  m = checkTime(m);
  document.getElementById('clock').innerHTML = h + ":" + m;
  setTimeout(startTime, 1000);
}

function checkTime(i) {
  return i < 10 ? "0" + i : i;
}


///////////////////////////////////////////////////////////////////
let phoneModel = document.querySelector('#phone-view');
let powerButton = document.querySelector('#power_button');
let phoneScreen = document.querySelector('.phone-screen');
let glow = document.querySelector('.glow-outer')

phoneModel.addEventListener('finished', () => {
  candleGlowing = false;
});

phoneModel.addEventListener('play', () => {
  candleGlowing = true;
})

powerButton.addEventListener('click', () => {
  if (candleGlowing) { return }
  if (phoneScreen.classList.contains('active')) {
    phoneScreen.classList.remove('active');
    glow.classList.remove('active');
    powerButton.classList.remove('active');
    phoneModel.currentTime = 0;
  } else {
    phoneModel.play({ repetitions: 1 });
    phoneScreen.classList.add('active');
    glow.classList.add('active');
    powerButton.classList.add('active');
  }
})

//////////////////////////////////////////////////////////////////////////
window.onscroll = function () { stickyHeaderF() };
let stickyHeader = document.querySelector('.header');
let sticky = stickyHeader.offsetTop;

function stickyHeaderF(params) {
  if (window.pageYOffset > sticky) {
    stickyHeader.classList.add("sticky");
  } else {
    stickyHeader.classList.remove("sticky");
  }
}
let wrapper = document.querySelector(".wrapper")

let als = deepText(wrapper)
for (let i = 0; i < als.length; i++) {
  //als[i].parentNode.classList.add("transp")

}
console.log(als);

function deepText(node) {
  var A = [];
  if (node) {
    node = node.firstChild;
    while (node != null) {
      if (node.nodeType == 3) A[A.length] = node;
      else A = A.concat(deepText(node));
      node = node.nextSibling;
    }
  }
  return A;
}

notifyMe.addEventListener('click', openModal)
modalCross.addEventListener('click', closeModal)
feedback.addEventListener('click', closeModal)


function closeModal(e) {
  let target = e.target;
  if (!target.closest('.modal') || target.closest('#close')) {
    let modal = document.querySelector('.feedback');
    modal.classList.add('closed');
    return
  }
}

function openModal(e) {
  let modal = document.querySelector('.feedback');
  modal.classList.remove('closed');
}