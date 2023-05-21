import { details } from './content.js'
document.querySelector("body").onload = startTime()
let candleGlowing = false;

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
      if (window.innerWidth > 600) {
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


window.addEventListener('load', event => {
  let box = document.querySelector('header')
  let prevRatio = 0;
  let ratioKoeficient = 0.95;
  let candleSection = document.querySelector('.candle-section-head')
  let h1 = document.querySelector('.header-span');
  let candleText = document.querySelector('.candle-text');
  let model = document.querySelector('.model');
  let headerLogo = document.querySelector(".logo")

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
      let curRatio = entry.intersectionRatio
      curRatio > 0.1 ? entry.target.classList.add('animated') : (entry.target.classList.remove('animated'));
      if (window.innerWidth < 600) {
        ratioKoeficient = 0.91;
      }
      curRatio < ratioKoeficient ?
        (candleSection.classList.add('animated'),
          modelViewer.cameraOrbit = orbitCycle[1],
          h1.classList.add('out'),
          h1.classList.remove('static'),
          candleText.classList.add('in'),
          candleText.classList.remove('out')) :
        (candleSection.classList.remove('animated'),
          modelViewer.cameraOrbit = orbitCycle[0],
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

phoneModel.addEventListener('finished',()=>{
  phoneModel.setAttribute('environment-image','./media/assets/spruit_sunrise_1k_HDR.hdr')
  candleGlowing=false;
});

phoneModel.addEventListener('play',()=>{
  candleGlowing=true;
})

powerButton.addEventListener('click',()=>{
  if(candleGlowing){return}
  if (phoneScreen.classList.contains('active')){
    phoneScreen.classList.remove('active');
    glow.classList.remove('active');
    phoneModel.setAttribute('environment-image','./media/assets/lightroom_14b.hdr')
    phoneModel.currentTime = 0;
  }else{
    phoneModel.play({repetitions: 1});
    phoneScreen.classList.add('active');
    glow.classList.add('active');
  }
})