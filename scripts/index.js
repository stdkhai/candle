async function onEntry(entry) {
  for (let i = 0; i < entry.length; i++) {
    if (entry[i].isIntersecting) {
      if (i != 0) {
        await new Promise(r => setTimeout(r, 5000));
      }
      entry[i].target.classList.add('element-show');
    }

  }

}
let options = { threshold: [0.5] };
let observer = new IntersectionObserver(onEntry, options);
let elements = document.querySelectorAll('.step');
for (let elm of elements) {
  observer.observe(elm);
}

let points = document.getElementsByClassName("detail");
for (let i = 0; i < points.length; i++) {
  console.log(points[i]);

}

one = $('#detail1').position();
two = $('#flame').position();
$('#line1').attr({ "x2": two.left, "y2": $('#flame').offset().top, "y1": $('#detail1').offset().top, "x1": $('#detail1').width() });


one = $('#detail2').position();
two = $('#wix').position();
$('#line2').attr({ "x2":$('#wix').offset().left+ $('#wix').width()/2, "y2": $('#wix').offset().top, "y1": $('#detail2').offset().top, "x1": $('#detail2').offset().left });


one = $('#detail3').position();
two = $('#wix').position();
$('#line3').attr({ "x2":$('#wix').offset().left+ $('#wix').width()/2, "y2":$('#wix').offset().top+ $('#wix').height()/3*2, "y1": $('#detail3').offset().top, "x1": $('#detail3').width() });


one = $('#detail4').position();
two = $('#wix').position();
$('#line4').attr({ "x2":$('#wix').offset().left+ $('#wix').width()*0.9, "y2":$('#wix').offset().top+ $('#wix').height()/3*2, "y1": $('#detail4').offset().top, "x1":$('#detail4').offset().left });


one = $('#detail5').position();
two = $('#wix').position();
$('#line5').attr({ "x2":$('#wix').offset().left+ $('#wix').width()*0.7, "y2":$('#wix').offset().top+ $('#wix').height()/5*4, "y1": $('#detail5').offset().top, "x1":$('#detail5').offset().left });
