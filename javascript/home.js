const lis = document.querySelectorAll("li");
const lbs = document.querySelectorAll(".lb");
const ul = document.querySelector("ul");
const lineDash = document.querySelector(".line-dash");


var dashOrigin = -35;
var selectedLi = -35; //init position
var speed = 500;
var distance = 0;
var time = 0;

TweenLite.to(lineDash, time, {  //origin position of the upper bracket
	strokeDashoffset: -35,
	ease: Bounce.easeOut});

TweenLite.to(lbs[0], 0.6, {  //origin position of the lower bracket
					y: -43,
					ease: Bounce.easeOut,
					delay: 1
				});

lis[0].classList.add("active");  //origin height light of the text

function pushDownLb() {
	for(let k = 0; k < lbs.length; ++k)
		TweenLite.to(lbs[k], 0.5, {
					y: 0,
					ease:  Power3.easeOut
				});
}

ul.addEventListener(
	"mouseleave",
	function(e) {

		if (e.relatedTarget) {
			distance = Math.abs(dashOrigin - selectedLi);
			time = distance / speed;
			dashOrigin = selectedLi;
			if (time) {

				TweenLite.to(lineDash, time, {
					strokeDashoffset: selectedLi,
					ease: Bounce.easeOut
				});
			}
		}
	},
	false
);

for (let i = 0; i < 5; ++i) {
	lis[i].addEventListener("mouseover", function() {
		distance = Math.abs(-200 * i - 35 - dashOrigin);
		time = distance / speed;
		dashOrigin = -200 * i - 35;
		if (time) {
			TweenLite.to(lineDash, time, {
				strokeDashoffset: -200 * i - 35,
				ease: Bounce.easeOut
			});
		} //if
	});

	lis[i].addEventListener("click", function() {
		selectedLi = -200 * i - 35;
		pushDownLb();
		let current = document.getElementsByClassName("active");
		current[0].classList.remove("active");
		lis[i].classList.add("active");
		TweenLite.to(lbs[i], 0.5, {
					y: -43,
					ease: Bounce.easeOut
				});
	});
}


document.getElementById("body").onscroll = function myFunction() {
    var scrolltotop = document.scrollingElement.scrollTop;
    var target = document.getElementById("banner");
    var xvalue = "center";
    var factor = 0.5;
    var yvalue = scrolltotop * factor;
    target.style.backgroundPosition = xvalue + " " + yvalue + "px";
  }

function scrollToSection(id, offset) {
	const element = document.getElementById(id);
	const yOffset = -offset;
	const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
	window.scrollTo({ top: y, behavior: 'smooth' });
}
