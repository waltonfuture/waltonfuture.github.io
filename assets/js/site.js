'use strict';

// All content remains visible when JavaScript is unavailable.
const toolbar = document.querySelector('.research-toolbar');
const filterButtons = [...document.querySelectorAll('[data-filter]')];
const papers = [...document.querySelectorAll('.publication')];
const resultCount = document.querySelector('.result-count');

function matchesFilter(paper, filter) {
  return filter === 'all' || (filter === 'first' ? paper.dataset.first === 'true' : paper.dataset.year === filter);
}

filterButtons.forEach((button) => {
  const count = papers.filter((paper) => matchesFilter(paper, button.dataset.filter)).length;
  button.querySelector('span').textContent = count;
  button.addEventListener('click', () => {
    filterButtons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    papers.forEach((paper) => { paper.hidden = !matchesFilter(paper, button.dataset.filter); });
    resultCount.textContent = `${count} publication${count === 1 ? '' : 's'}`;
  });
});
resultCount.textContent = `${papers.length} publications`;
toolbar.hidden = false;

// Preserve links shared from the previous homepage.
const legacyAnchors = {
  'about-me': 'about', '-about-me': 'about', '-publications': 'publications',
  '-educations': 'education', '-honors-and-awards': 'honors',
  '-services': 'services', '-interests-and-hobbies': 'interests', '-preprints': 'publications'
};
function restoreLegacyAnchor() {
  const destination = legacyAnchors[window.location.hash.slice(1)];
  if (destination) {
    history.replaceState(null, '', `#${destination}`);
    document.getElementById(destination).scrollIntoView({ behavior: 'instant' });
  }
}
window.addEventListener('hashchange', restoreLegacyAnchor);
restoreLegacyAnchor();

const navLinks = [...document.querySelectorAll('.site-nav a')];
const navSections = navLinks.map((link) => document.querySelector(link.getAttribute('href')));
let scrollPending = false;
function updateActiveLink() {
  const topOffset = document.querySelector('.site-header').offsetHeight + 80;
  let active = navSections[0];
  navSections.forEach((section) => {
    if (section.getBoundingClientRect().top <= topOffset) active = section;
  });
  navLinks.forEach((link) => {
    if (link.hash === `#${active.id}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  scrollPending = false;
}
window.addEventListener('scroll', () => {
  if (!scrollPending) { scrollPending = true; requestAnimationFrame(updateActiveLink); }
}, { passive: true });
window.addEventListener('resize', updateActiveLink);
updateActiveLink();

let awardsWereOpen = false;
window.addEventListener('beforeprint', () => {
  const awards = document.querySelector('.earlier-awards');
  awardsWereOpen = awards.open;
  awards.open = true;
});
window.addEventListener('afterprint', () => {
  document.querySelector('.earlier-awards').open = awardsWereOpen;
});
