'use strict';

///////////////////////////////////////
// Variable
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabContent = document.querySelectorAll('.operations__content');

const nav = document.querySelector('.nav');
const header = document.querySelector('.header');

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Implementing smooth scroll
btnScrollTo.addEventListener('click', function (e) {
  e.preventDefault();
  section1.scrollIntoView({ behavior: 'smooth' })
});

// Page navigation
// Using Event Delegation
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link') && !(e.target.getAttribute('href') === '#')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
})

// Tabbed component
tabContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  if (!clicked) return;

  // Remove Active classes
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  tabContent.forEach(tab => tab.classList.remove('operations__content--active'));

  // Add Active classes
  clicked.classList.add('operations__tab--active');
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
})

// Menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const linkHover = e.target;
    const linkSibling = linkHover.closest('.nav').querySelectorAll('.nav__link');
    const logo = linkHover.closest('.nav').querySelector('img');

    linkSibling.forEach(link => {
      if (link !== linkHover) link.style.opacity = this
    })
    logo.style.opacity = this
  }
}

nav.addEventListener('mouseover', handleHover.bind(0.5))
nav.addEventListener('mouseout', handleHover.bind(1))

// Sticky Navigation
/*
window.addEventListener('scroll', function () {
  if (this.window.scrollY > section1.getBoundingClientRect().top) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
})*/

const stickyNav = function () {
  const navComputedHeight = nav.getBoundingClientRect().height;
  const stickyNav = function (entries) {
    const [entry] = entries;
    if (!entry.isIntersecting) {
      nav.classList.add('sticky')
    } else {
      nav.classList.remove('sticky')
    }
  }

  const headerObserver = new IntersectionObserver(stickyNav, {
    root: null,
    threshold: 0,
    rootMargin: `-${navComputedHeight}px`,
  })

  headerObserver.observe(header);
}
stickyNav();

const revealOnScroll = function () {
  const allSections = document.querySelectorAll('.section');
  const sections = function (entries, observer) {
    const [entry] = entries;
    if (!entry.isIntersecting) return;
    entry.target.classList.remove('section--hidden');
    entry.target.style.transition = 'all 3s';
    observer.unobserve(entry.target);
  }
  const sectionObserver = new IntersectionObserver(sections, {
    root: null,
    threshold: 0.20,
  })
  allSections.forEach(function (section) {
    section.classList.add('section--hidden');
    sectionObserver.observe(section);
  })
}

// revealOnScroll();

// Lazy Loading img
const lazyLoading = function () {
  const imgTargets = document.querySelectorAll('img[data-src]');
  const callBack = function (entries, observer) {
    const [entry] = entries;
    if (!entry.isIntersecting) return;
    entry.target.src = entry.target.dataset.src;
    entry.target.addEventListener('load', function () {
      entry.target.classList.remove('lazy-img')
    })
    observer.unobserve(entry.target)
  }

  const imgObserver = new IntersectionObserver(callBack, {
    root: null,
    threshold: 0,
    rootMargin: '-200px'
  });
  imgTargets.forEach(function (img) {
    imgObserver.observe(img)
  })
}

lazyLoading();

const sliding = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  let maxSlide = slides.length - 1;

  const createDots = function (varName) {
    varName.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide="${i}"></button>`)
    })
  }
  createDots(slides);

  const activateDot = function (slide) {
    const dots = document.querySelectorAll('.dots__dot');
    dots.forEach(function (dot) {
      dot.classList.remove('dots__dot--active');
    })
    document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
  }

  activateDot(curSlide);

  const goToSlide = function (varName, curSlide) {
    varName.forEach(function (slide, index) {
      slide.style.transform = `TranslateX(${100 * (index - curSlide)}%)`;
    })
  }
  goToSlide(slides, 0);

  const nextSlide = function () {
    if (curSlide === maxSlide) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(slides, curSlide);
    activateDot(curSlide);
  }

  const prevSlide = function () {
    if (curSlide > 0) {
      curSlide--;
    } else {
      curSlide = maxSlide;
    }

    goToSlide(slides, curSlide);
    activateDot(curSlide);
  }

  // Event Listener
  btnRight.addEventListener('click', nextSlide)
  btnLeft.addEventListener('click', prevSlide)
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slides, slide)
      activateDot(slide);
    }
  })
}

sliding();

//////////////////////////////////////////////////////////////////////////
// LECTURES
/*
// IntersectionObserver API
const obsCall = function (entries) {
  entries.forEach(entry => console.log(entry));
}

const obsOption = {
  root: null,
  threshold: 0.1,
}
const observer = new IntersectionObserver(obsCall, obsOption);
observer.observe(section1)
// selectng element
console.log(document.documentElement);
console.log(document.head)
console.log(document.body);

// querySelectors
const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');

console.log(document.getElementById('section--1'));
console.log(document.getElementsByTagName('button'));
console.log(document.getElementsByClassName('btn'));

// creating element
const message = document.createElement('div')
message.classList.add('cookie-message');
message.innerHTML = 'We use cookie for improved functionality and performance <button class="btn btn--close-cookie">Got It</button>';

// using insertAdjacentHTML
// const messageNew = `<div class="cookie-message">
// We use cookie for improved functionality and performance <button class="btn btn--close-cookie">Got It</button>
// </div>`;
// header.insertAdjacentHTML('beforeend', messageNew)

// header.prepend(message)
header.append(message)
// header.before(message)
// header.after(message)

// deleting items
document.querySelector('.btn--close-cookie').addEventListener('click', function () {
  message.remove()
})

// Styles, Attributes and Classes
// We can also style our webpage using javascript - Styling
message.style.backgroundColor = '#ddd';
message.style.setProperty('background-color', 'red');
message.style.width = '120%';
document.body.style.overflowX = 'hidden';
message.style.height = Number.parseFloat(getComputedStyle(message).height) + 30 + 'px';
// console.log(document.documentElement.style.setProperty('--color-primary', 'yellow'));

// Attributes
const logo = document.querySelector('.nav__logo');
console.log(logo.src);
console.log(logo);
console.log(logo.setAttribute('company', 'bankist'));
logo.dataset.versionNumber = 3;
console.log(logo.getAttribute('src'));

// Event Listener - adding and removing eventlistener
const h1 = document.querySelector('h1');
const alertH1 = function () {
  alert('The first heading as being entered')
  h1.removeEventListener('mouseenter', alertH1)
}

h1.addEventListener('mouseenter', alertH1);
// h1.onmouseenter = alertH1();

// event propagation
const navLink = document.querySelector('.nav__link');
const navLinks = document.querySelector('.nav__links');
const nav = document.querySelector('.nav')

const randomColor = (min, max) => `rgb(${Math.trunc((Math.random() * (max - min) + 1) + min)}, ${Math.trunc((Math.random() * (max - min) + 1) + min)}, ${Math.trunc((Math.random() * (max - min) + 1) + min)})`;
navLink.addEventListener('click', function (e) {
  // e.preventDefault();
  this.style.backgroundColor = randomColor(0, 255)
  console.log('LINK', e.target, e.currentTarget);
})

navLinks.addEventListener('click', function (e) {
  e.preventDefault();
  this.style.backgroundColor = randomColor(0, 255)
  console.log('CONTAINER', e.target, e.currentTarget);

  // STOP PROPAGATION
  // e.stopPropagation();
})

nav.addEventListener('click', function (e) {
  e.preventDefault();
  this.style.backgroundColor = randomColor(0, 255)
  console.log('NAV', e.target, e.currentTarget);

});

const h1 = document.querySelector('h1');
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes)
console.log(h1.children);
console.log(h1.firstElementChild);
console.log(h1.lastElementChild);
console.log(h1.parentElement); // we can also use the closest method to get parent element that are faroff in the DOM
console.log(h1.nextElementSibling);
*/

// document.addEventListener('DOMContentLoaded', function (e) {
//   console.log('DOM is ready', e);
// })

// window.addEventListener('load', function (e) {
//   console.log(e);
// })

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   e.returnValue = '';
// })

