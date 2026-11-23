// Mobile menu
const btn = document.querySelector('.menu-btn');
const nav = document.querySelector('nav.main');
if (btn && nav) btn.addEventListener('click', () => nav.classList.toggle('open'));

// ---- Shop contact details (change here to update the whole site) ----
const SHOP_PHONE = '918286282418';           // country code + number, no spaces
const PHONE_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/></svg>';
const WA_ICON = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.3-.5 0-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8 0-1.3.7-2 1-2.3.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.3.5-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.1 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.7-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.3Z"/></svg>';
const waLink = msg => 'https://wa.me/' + SHOP_PHONE + '?text=' + encodeURIComponent(msg);

// Product cards: add "Call" + "WhatsApp" enquiry buttons (no cart).
// Every .product card gets them automatically, using its <h3> as the item name.
document.querySelectorAll('.product').forEach(card => {
  if (card.hasAttribute('data-no-enquiry') || card.querySelector('.enq')) return;
  const body = card.querySelector('.body') || card;
  const name = card.dataset.item || (card.querySelector('h3') || {}).textContent || 'your products';
  const box = document.createElement('div');
  box.className = 'enq';
  box.innerHTML =
    '<a class="e-call" href="tel:+' + SHOP_PHONE + '">' + PHONE_ICON + 'Call</a>' +
    '<a class="e-wa" target="_blank" rel="noopener" href="' +
      waLink('Hello Shree Sawariya Ji, I want to enquire about: ' + name.trim() + '.\nSchool / Class: \nSize / Qty: ') +
    '">' + WA_ICON + 'WhatsApp</a>';
  body.appendChild(box);
});

// Floating call button + scroll-to-top (added on every page)
if (!document.querySelector('.call-float')) {
  const c = document.createElement('a');
  c.className = 'call-float'; c.href = 'tel:+' + SHOP_PHONE; c.setAttribute('aria-label', 'Call us');
  c.innerHTML = PHONE_ICON.replace('stroke="currentColor"', 'stroke="#fff"');
  document.body.appendChild(c);
}
const topBtn = document.createElement('button');
topBtn.className = 'to-top'; topBtn.setAttribute('aria-label', 'Scroll to top'); topBtn.textContent = '↑';
topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
document.body.appendChild(topBtn);
addEventListener('scroll', () => topBtn.classList.toggle('show', scrollY > 500), { passive: true });

// Banner slider
const slider = document.querySelector('.slider');
if (slider) {
  const track = slider.querySelector('.slides');
  const slides = track.children;
  const dotsBox = slider.querySelector('.dots');
  let i = 0, timer;
  const go = n => {
    i = (n + slides.length) % slides.length;
    track.style.transform = 'translateX(' + (-100 * i) + '%)';
    dotsBox.querySelectorAll('button').forEach((d, k) => d.classList.toggle('on', k === i));
  };
  [...slides].forEach((_, k) => {
    const d = document.createElement('button');
    d.setAttribute('aria-label', 'Go to slide ' + (k + 1));
    d.addEventListener('click', () => { go(k); restart(); });
    dotsBox.appendChild(d);
  });
  const restart = () => {
    clearInterval(timer);
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) timer = setInterval(() => go(i + 1), 5000);
  };
  slider.querySelector('.prev').addEventListener('click', () => { go(i - 1); restart(); });
  slider.querySelector('.next').addEventListener('click', () => { go(i + 1); restart(); });
  slider.addEventListener('mouseenter', () => clearInterval(timer));
  slider.addEventListener('mouseleave', restart);
  // swipe on phones
  let x0 = null;
  slider.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) { go(i + (dx < 0 ? 1 : -1)); restart(); }
    x0 = null;
  });
  go(0); restart();
}

// Footer year
document.querySelectorAll('.year').forEach(el => el.textContent = new Date().getFullYear());

// Reveal on scroll
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Enquiry form -> sends email via send-enquiry.php
const form = document.querySelector('form.enquiry');
if (form) {
  const status = form.querySelector('.form-status');
  const submitBtn = form.querySelector('button[type="submit"]');
  const show = (ok, msg) => {
    status.textContent = msg;
    status.className = 'form-status ' + (ok ? 'ok' : 'err');
  };

  // Result after a non-JS fallback submit (redirect back with ?sent=1 / ?error=1)
  const qs = new URLSearchParams(location.search);
  if (qs.has('sent')) show(true, 'Thank you! Your enquiry has been sent. We will contact you soon.');
  if (qs.has('error')) show(false, 'Sorry, the message could not be sent. Please call or WhatsApp us on +91 82862 82418.');

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const label = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    status.className = 'form-status';
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'X-Requested-With': 'fetch' }
      });
      const data = await res.json();
      show(data.ok, data.message);
      if (data.ok) form.reset();
    } catch {
      show(false, 'Could not send right now. Please call or WhatsApp us on +91 82862 82418.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = label;
    }
  });
}
