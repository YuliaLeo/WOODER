"use strict";

window.onload = function () {

	//=============================IS_MOBILE
	let isMobile = {
		Android: function () { return navigator.userAgent.match(/Android/i); },
		BlackBerry: function () { return navigator.userAgent.match(/BlackBerry/i); },
		iOS: function () { return navigator.userAgent.match(/iPhone|iPad|iPod/i); },
		Opera: function () { return navigator.userAgent.match(/Opera Mini/i); },
		Windows: function () { return navigator.userAgent.match(/IEMobile/i); },
		any: function () { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); }
	};
	//=============================

	//=============================BURGER
	const iconMenu = document.querySelector('.icon-menu');
	const menuBlock = document.querySelector('.menu__block');
	if (iconMenu) {
		iconMenu.addEventListener('click', function (e) {
			document.body.classList.toggle("_lock");
			iconMenu.classList.toggle("_active");
			menuBlock.classList.toggle("_active");
		});
	}
	//=============================

	//=============================LINK_ACTIVATE_FUNCTION
	function activateLinks() {
		const menuLinks = document.querySelectorAll('.menu__link[data-goto]');

		if (menuLinks.length > 0) {
			menuLinks.forEach(menuLink => {
				menuLink.addEventListener('click', onMenuLinkClick);
			});

			function onMenuLinkClick(e) {
				const menuLink = e.target;

				if (menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)) {
					const gotoBlock = document.querySelector(menuLink.dataset.goto);
					const gotoBlockValue = gotoBlock.getBoundingClientRect().top + pageYOffset - document.querySelector("header").offsetHeight;

					if (iconMenu.classList.contains("_active")) {
						document.body.classList.remove("_lock");
						iconMenu.classList.remove("_active");
						menuBlock.classList.remove("_active");
					}

					window.scrollTo({
						top: gotoBlockValue,
						behavior: "smooth"
					});
					e.preventDefault();
				}
			}
		}
	}
	//=============================

	function testWebP(callback) {

	var webP = new Image();
	webP.onload = webP.onerror = function () {
		callback(webP.height == 2);
	};
	webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}

testWebP(function (support) {

	if (support == true) {
		document.querySelector('body').classList.add('webp');
	} else {
		document.querySelector('body').classList.add('no-webp');
	}
});;
// HTML data-da="where(uniq class name),position(digi),when(breakpoint)"
// e.x. data-da="item,2,992"

"use strict";

(function () {
	let originalPositions = [];
	let daElements = document.querySelectorAll('[data-da]');
	let daElementsArray = [];
	let daMatchMedia = [];

	if (daElements.length > 0) {
		let number = 0;
		for (let index = 0; index < daElements.length; index++) {
			const daElement = daElements[index];
			const daMove = daElement.getAttribute('data-da');
			if (daMove != '') {
				const daArray = daMove.split(',');
				const daPlace = daArray[1] ? daArray[1].trim() : 'last';
				const daBreakpoint = daArray[2] ? daArray[2].trim() : '767';
				const daType = daArray[3] === 'min' ? daArray[3].trim() : 'max';
				const daDestination = document.querySelector('.' + daArray[0].trim())
				if (daArray.length > 0 && daDestination) {
					daElement.setAttribute('data-da-index', number);

					originalPositions[number] = {
						"parent": daElement.parentNode,
						"index": indexInParent(daElement)
					};

					daElementsArray[number] = {
						"element": daElement,
						"destination": document.querySelector('.' + daArray[0].trim()),
						"place": daPlace,
						"breakpoint": daBreakpoint,
						"type": daType
					}
					number++;
				}
			}
		}
		dynamicAdaptSort(daElementsArray);


		for (let index = 0; index < daElementsArray.length; index++) {
			const el = daElementsArray[index];
			const daBreakpoint = el.breakpoint;
			const daType = el.type;

			daMatchMedia.push(window.matchMedia("(" + daType + "-width: " + daBreakpoint + "px)"));
			daMatchMedia[index].addListener(dynamicAdapt);
		}
	}

	function dynamicAdapt(e) {
		for (let index = 0; index < daElementsArray.length; index++) {
			const el = daElementsArray[index];
			const daElement = el.element;
			const daDestination = el.destination;
			const daPlace = el.place;
			const daBreakpoint = el.breakpoint;
			const daClassname = "_dynamic_adapt_" + daBreakpoint;

			if (daMatchMedia[index].matches) {

				if (!daElement.classList.contains(daClassname)) {
					let actualIndex = indexOfElements(daDestination)[daPlace];
					if (daPlace === 'first') {
						actualIndex = indexOfElements(daDestination)[0];
					} else if (daPlace === 'last') {
						actualIndex = indexOfElements(daDestination)[indexOfElements(daDestination).length];
					}
					daDestination.insertBefore(daElement, daDestination.children[actualIndex]);
					daElement.classList.add(daClassname);
				}
			} else {
				if (daElement.classList.contains(daClassname)) {
					dynamicAdaptBack(daElement);
					daElement.classList.remove(daClassname);
				}
			}
		}
	}

	dynamicAdapt();

	function dynamicAdaptBack(el) {
		const daIndex = el.getAttribute('data-da-index');
		const originalPlace = originalPositions[daIndex];
		const parentPlace = originalPlace['parent'];
		const indexPlace = originalPlace['index'];
		const actualIndex = indexOfElements(parentPlace, true)[indexPlace];
		parentPlace.insertBefore(el, parentPlace.children[actualIndex]);
	}
	function indexInParent(el) {
		var children = Array.prototype.slice.call(el.parentNode.children);
		return children.indexOf(el);
	}
	function indexOfElements(parent, back) {
		const children = parent.children;
		const childrenArray = [];
		for (let i = 0; i < children.length; i++) {
			const childrenElement = children[i];
			if (back) {
				childrenArray.push(i);
			} else {
				if (childrenElement.getAttribute('data-da') == null) {
					childrenArray.push(i);
				}
			}
		}
		return childrenArray;
	}
	function dynamicAdaptSort(arr) {
		arr.sort(function (a, b) {
			if (a.breakpoint > b.breakpoint) { return -1 } else { return 1 }
		});
		arr.sort(function (a, b) {
			if (a.place > b.place) { return 1 } else { return -1 }
		});
	}
}());;
let header = document.querySelector('.header');
let wrapper = document.querySelector('.wrapper');
let page = document.querySelector('.page');

let pageSlider = new Swiper(".page", {

	wrapperClass: "page__wrapper",

	slideClass: "page__screen",

	direction: "vertical",

	sliderPerView: "auto",

	keyboard: {
		enabled: true,
		onlyInViewport: true,
		pageUpDown: true,
	},

	mousewheel: {
		sensitivity: 1,
	},

	watchOverflow: true,

	speed: 800,

	observer: true,
	observeParents: true,
	observeSlideChildren: true,

	pagination: {
		el: ".page__pagination",
		type: "bullets",
		clickable: true,
		bulletClass: "page__bullet",
		bulletActiveClass: "page__bullet_active",
	},

	scrollbar: {
		el: ".page__scroll",
		dragClass: "page__drag-scroll",
		draggable: true,
	},

	init: false,

	on: {

		init: function () {
			menuSlider();
			setScrollType();
			wrapper.classList.add("_loaded");
		},

		slideChange: function () {
			menuSliderRemove();
			menuLinks[pageSlider.realIndex].classList.add("_active");
		},

		resize: function () {
			setScrollType();
		},

	},

});

let menuLinks = document.querySelectorAll('.menu__link');

function menuSlider() {
	if (menuLinks.length > 0) {
		menuLinks[pageSlider.realIndex].classList.add("_active");
		for (let index = 0; index < menuLinks.length; index++) {
			const menuLink = menuLinks[index];
			menuLink.addEventListener('click', function (e) {
				menuSliderRemove();
				pageSlider.slideTo(index, 800);
				menuLink.classList.add("_active");

				if (iconMenu.classList.contains("_active")) {
					document.body.classList.remove("_lock");
					iconMenu.classList.remove("_active");
					menuBlock.classList.remove("_active");
				}

				e.preventDefault();
			});
		}
	}
}

function menuSliderRemove() {
	let menuLinkActive = document.querySelector('.menu__link._active');
	if (menuLinkActive) {
		menuLinkActive.classList.remove("_active");
	}
}

function setScrollType() {
	if (wrapper.classList.contains("_free")) {
		wrapper.classList.remove("_free");
		wrapper.classList.add("_notfree");
	}
	for (let index = 0; index < pageSlider.slides.length; index++) {
		const pageSlide = pageSlider.slides[index];
		const pageSlideContent = pageSlide.querySelector(".screen__content");
		if (pageSlideContent) {
			const pageSlideContentHeight = pageSlideContent.offsetHeight;
			if ((pageSlideContentHeight > window.innerHeight) || ((window.innerHeight <= 700))) {
				wrapper.classList.add("_free");
				wrapper.classList.remove("_notfree");
				pageSlider.destroy();
				activateLinks();
				break;
			}
			else {
				wrapper.classList.add("_notfree");
			}
		}
	}
}

pageSlider.init();
;
const popupLinks = document.querySelectorAll(".popup-link"); //elegir todos las enlaces para popups
const body = document.querySelector('body');
const lockPadding = document.querySelectorAll('.lock-padding'); //utilizar para objetos son valor absolute y fixed

let unlock = true;

const timeout = 800;  //para detener la animacion, tiene que ser el mismo numero que transition: all 0.8s;

if (popupLinks.length > 0) {
	for (let index = 0; index < popupLinks.length; index++) {
		const popupLink = popupLinks[index];
		popupLink.addEventListener('click', function (e) {
			const popupName = popupLink.getAttribute("href").replace("#", ""); //para qiutar #
			const curentPopup = document.getElementById(popupName);
			popupOpen(curentPopup);
			e.preventDefault();
		});
	}
}

const popupCloseIcon = document.querySelectorAll(".close-popup"); //para cerrar popups
if (popupCloseIcon.length > 0) {
	for (let index = 0; index < popupCloseIcon.length; index++) {
		const el = popupCloseIcon[index];
		el.addEventListener('click', function (e) {
			popupClose(el.closest(".popup"));
			e.preventDefault();
		});
	}
}

function popupOpen(curentPopup) {
	if (curentPopup && unlock) {
		const popupActive = document.querySelector('.popup._open');
		if (popupActive) {
			popupClose(popupActive, false);
		}
		else {
			bodyLock();
		}
		curentPopup.classList.add("_open");
		curentPopup.addEventListener('click', function (e) {
			if (!e.target.closest(".popup__content")) { //permite cerrar popup si haces click en area negra
				popupClose(e.target.closest(".popup"));
			}
		});
	}
}

function popupClose(popupActive, doUnlock = true) {
	if (unlock) {
		popupActive.classList.remove("_open");
		if (doUnlock) {
			bodyUnlock();
		}
	}
}

function bodyLock() {
	const lockPaddingValue = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";

	if (lockPadding.length > 0) {
		for (let index = 0; index < lockPadding.length; index++) {
			const el = lockPadding[index];
			el.style.paddingRight = lockPaddingValue;
		}
	}

	body.style.paddingRight = lockPaddingValue;
	body.classList.add("_lock");

	unlock = false;
	setTimeout(function () { //para detener la animacion
		unlock = true;
	}, timeout);
}

function bodyUnlock() {
	setTimeout(function () {
		if (lockPadding.length > 0) {
			for (let index = 0; index < lockPadding.length; index++) {
				const el = lockPadding[index];
				el.style.paddingRight = "0px";
			}
		}
		body.style.paddingRight = "0px";
		body.classList.remove("_lock");
	}, timeout);

	unlock = false;
	setTimeout(function () {
		unlock = true;
	}, timeout);

}

document.addEventListener('keydown', function (e) { //para cerrar con ESCAPE
	if (e.which === 27) {
		const popupActive = document.querySelector(".popup._open");
		popupClose(popupActive);
	}
});

//POLIFILLS PARA EXPLOER (para que closest y matches funcionen)
(function () {

	if (!Element.prototype.closest) {

		Element.prototype.closest = function (css) {
			var node = this;

			while (node) {
				if (node.matches(css)) return node;
				else node = node.parentElement;
			}
			return null;
		};
	}

})();

(function () {

	if (!Element.prototype.matches) {

		Element.prototype.matches = Element.prototype.matchesSelector ||
			Element.prototype.webkitMatchesSelector ||
			Element.prototype.mozMatchesSelector ||
			Element.prototype.msMatchesSelector;

	}

})();;
//Para los elementos con la misma animacion se puede usar una clase separada, por ejemplo "anim-show"
/*
.anim-show {
	transform: translate(0, 120%);
	opacity: 0;
	transition: all 0.8s ease 0s;
	&._animation {
		transform: translate(0, 0%);
		opacity: 1;
	}
}
._animation {
	.anim-show {
		transform: translate(0, 0%);
		opacity: 1;
	}
}
*/
//!Tambien es mejor hacer animaciones con elementos que estan dentro de los elementos estaticos

//Para hacer muchas manipulaciones con nth-child()
/*
			@for $var from 1 to 7 {
					$delay: $var * 0.2;
					&:nth-child(#{$var}) {
						@if $var == 1 {
							transition: all 0.8s ease 0s;
						} @else {
							transition: all 0.8s ease #{$delay + s};
						}
					}
				}
*/

const animItems = document.querySelectorAll("._anim-item");

if (animItems.length > 0) {

	window.addEventListener('scroll', animOnScroll);

	function animOnScroll(params) {
		for (let index = 0; index < animItems.length; index++) {

			const animItem = animItems[index];
			const animItemHeight = animItem.offsetHeight;
			const animItemOffset = offset(animItem).top;
			const animStart = 4; //para que el objeto aparezca cuando alcamzamos su quarta parte

			let animItemPoint = window.innerHeight - animItemHeight / animStart;

			if (animItemHeight > window.innerHeight) {
				animItemPoint = window.innerHeight - window.innerHeight / animStart;
			}

			if ((pageYOffset > animItemOffset - animItemPoint) && (pageYOffset < (animItemOffset + animItemHeight))) {
				animItem.classList.add("_animation");
			}
			else {
				if (!animItem.classList.contains("_anim-no-hide")) {
					animItem.classList.remove("_animation");
				}
			}
		}
	}

	function offset(el) {
		const rect = el.getBoundingClientRect(),
			scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
			scrollTop = window.pageYOffset || document.documentElement.scrollTop;
		return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
	}

	setTimeout(() => { //Delay al principio
		animOnScroll();
	}, 300);

};

;


	//=============================IBG
	function ibg() {
		let ibgs = document.querySelectorAll('.ibg');
		for (let index = 0; index < ibgs.length; index++) {
			const ibg = ibgs[index];
			if (ibg.querySelector("img")) {
				ibg.style.backgroundImage = 'url("' + ibg.querySelector('img').src + '")';
			}
		}
	}
	ibg();
	//=============================

	//=============================CLICK_FINCTION
	document.addEventListener("click", documentActions);
	function documentActions(e) {
		const targetElement = e.target;

		//---SELECT
		if (!targetElement.closest(".select") && document.querySelector(".select._active")) {
			document.querySelector(".select").classList.remove("_active");
		}
		//---

		//---VIDEO
		if (targetElement.classList.contains("quality__link")) {
			targetElement.classList.add("_active");
		}
		else if ((!targetElement.closest(".popup__content") || (targetElement.classList.contains("popup__close"))) && document.querySelector(".quality__link._active")) {
			document.querySelector(".quality__link._active").classList.remove("_active");
		}
		//---

	}
	//=============================

	//=============================LANGUAGE_SELECTOR
	const select = document.querySelector('.select');
	const selected = document.querySelector('.select__selected');
	const selectItems = document.querySelectorAll('.select__item');

	if (select) {
		selected.addEventListener('click', () => {
			select.classList.toggle("_active");
		});

		selectItems.forEach(item => {
			item.addEventListener('click', function (e) {
				selected.innerHTML = item.querySelector(".select__span").innerHTML;
				select.classList.remove("_active");
			});
		});
	}
	//=============================

	//=============================SLIDER_COUNTER
	if (pageSlider && !pageSlider.destroyed) {
		let mySliderCurrentSlide = document.querySelector('.page__current');

		pageSlider.on("slideChange", function () {
			let currentSlide = ++pageSlider.realIndex;
			mySliderCurrentSlide.innerHTML = "0" + currentSlide;
		});
	}
	//=============================
}



