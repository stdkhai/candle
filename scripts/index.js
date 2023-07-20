import { details } from './content.js'
window.addEventListener("load", function () {
  setTimeout(function () {
    // This hides the address bar:
    window.scrollTo(0, 1);
  }, 0);
});
document.querySelector("body").onload = startTime()
let candleGlowing = false;
let modalCross = document.querySelector("#close");
let feedback = document.querySelector('.feedback');
let notifyMe = document.querySelector('#notify');
let wrapper = document.querySelector(".wrapper")
let candleSection = document.querySelector('.candle-section-head')


const screenHeight = window.innerHeight;
/* document.querySelector("header").style.height = screenHeight + "px";
 */
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
  let block = document.querySelector('.section-steps')
  block.scrollIntoView({ block: 'nearest' })
}

function enableScroll() {
  window.removeEventListener('DOMMouseScroll', preventDefault, false);
  window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
/*   window.removeEventListener('touchmove', preventDefault, wheelOpt);
 */  window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
  let block = document.querySelector('.section-steps')
  block.scrollIntoView = function () { }
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
        document.addEventListener('touchmove', e => {
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
/**
 * 
 * @param {String} selector 
 * @returns 
 */
function calculateVisibilityPercentage(selector) {
  const block = document.querySelector(selector);
  const blockRect = block.getBoundingClientRect();

  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  const aboveViewportPercentage = Math.max(0, (-blockRect.top / blockRect.height));
  const belowViewportPercentage = Math.max(0, ((blockRect.bottom - viewportHeight) / blockRect.height));

  return {
    above: aboveViewportPercentage,
    below: belowViewportPercentage
  }
}


window.addEventListener('load', scrollObserver);
window.addEventListener('scroll', scrollObserver);

const modelViewer = document.querySelector('.model');
const orbitCycle = [
  '300deg 84deg auto',
  '420deg 84deg auto',
  modelViewer.cameraOrbit
];

function scrollObserver(e) {
 
  let headerOut = calculateVisibilityPercentage('header');
/*   console.log(headerOut);
 */
  if (headerOut.below!=0) {
    headerObserver(headerOut)
    return
  }
  
}
/**
 * 
 * @param {Object} headerOut 
 * @param {Number} headerOut.below
 * @param {Number} headerOut.above
 */
function headerObserver(headerOut) {
  let h1 = document.querySelector('.header-span');
  let candleText = document.querySelector('.candle-text');
  let isMobile = false;
  if (window.innerWidth <= 669) {
    isMobile = true;
  }
  let headerAbove = 0.1;
  if (isMobile) {
    headerAbove = 0.2;
  }
  if (headerOut.above > headerAbove && headerOut.below > 0) {
    candleSection.classList.add('animated')
    h1.classList.add('out')
    h1.classList.remove('static')
    candleText.classList.add('in')
    candleText.classList.remove('out')
  }
  if (headerOut.above <0.05) {
    candleSection.classList.remove('animated')
    h1.classList.remove('out')
    candleText.classList.remove('in')
    candleText.classList.add('out')
  }
  
}


candleSection.addEventListener('animationend', e=>{
  switch (e.animationName) {
    case 'candleUP':
      modelViewer.cameraOrbit = orbitCycle[1]
      break;
    case 'candleBACK':
      modelViewer.cameraOrbit = orbitCycle[0];
      break;
    default:
      break;
  }
});

/* window.addEventListener('w', e => {
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
    '300deg 84deg auto',
    '420deg 84deg auto',
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
        if (window.scrollY < 10) {
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
      prevRatio = curRatio
    })
  }, {
    threshold: buildThresholdList()
  })

  observer.observe(box)
  function buildThresholdList() {
    let thresholds = []
    let steps = 1000
    for (let i = 1.0; i <= steps; i++) {
      let ratio = i / steps
      thresholds.push(ratio)
    }
    return thresholds
  }
});
 */
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
  document.getElementById('clock').textContent = h + ":" + m;
  setTimeout(startTime, 5000);
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
  let digits = document.querySelectorAll('#time-left .digit');
  document.querySelectorAll('h4').forEach(e => e.classList.toggle('lighted'))
  document.querySelector('h1').classList.toggle('lighted');
  if (phoneScreen.classList.contains('active')) {
    phoneScreen.classList.remove('active');
    glow.classList.remove('active');
    powerButton.classList.remove('active');
    phoneModel.currentTime = 0;
    digits.forEach((d) => d.innerHTML = `<i class="fa-solid fa-clock"></i>`);
  } else {
    phoneModel.play({ repetitions: 1 });
    phoneScreen.classList.add('active');
    glow.classList.add('active');
    powerButton.classList.add('active');
    digits.forEach((d) => digitAnim(d, d.classList[d.classList.length - 1]));
  }
})


function digitAnim(block, finValue) {
  let finalTime = 0
  for (let index = 0; index < 10; index++) {
    let time = 1000 * Math.random()
    setTimeout(() => {
      block.innerHTML = index;
    }, time);
    if (time > finalTime) {
      finalTime = time;
    }
  }
  setTimeout(() => { block.innerHTML = finValue }, finalTime)
}

//////////////////////////////////////////////////////////////////////////
window.onscroll = function () { stickyHeaderF() };
let stickyHeader = document.querySelector('.header');
let sticky = stickyHeader.offsetTop;

function stickyHeaderF(params) {
  if (window.scrollY > sticky) {
    stickyHeader.classList.add("sticky");
  } else {
    stickyHeader.classList.remove("sticky");
  }
}

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
