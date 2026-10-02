'use strict';

// Keep contact details usable even without a configured email application.
const contactDialog = document.querySelector('#contact-dialog');
if (contactDialog && typeof contactDialog.showModal === 'function') {
  const contactStatus = contactDialog.querySelector('.contact-status');
  const contactAddress = contactDialog.querySelector('#contact-address');
  document.querySelectorAll('[data-contact]').forEach((link) => {
    link.setAttribute('aria-haspopup', 'dialog');
    link.setAttribute('aria-controls', contactDialog.id);
    link.addEventListener('click', (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      contactStatus.textContent = '';
      contactDialog.showModal();
    });
  });
  contactDialog.querySelector('.copy-email').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(contactAddress.textContent.trim());
      contactStatus.textContent = 'Email address copied.';
    } catch {
      contactStatus.textContent = 'Please select the address above and copy it manually.';
    }
  });
  contactDialog.addEventListener('click', (event) => {
    if (event.target !== contactDialog) return;
    const bounds = contactDialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
      contactDialog.close();
    }
  });
}

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
