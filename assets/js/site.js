/* Bob Zheng — portfolio
 * Progressive enhancement only: every piece of content is in index.html.
 * Adds: date-driven status, scroll position (nav, index rule), mobile menu, copy email.
 */
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.add('js');

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  /* ---------------------------------------------------------------- status
   * Anything with data-start / data-end (YYYY-MM or "present") is marked
   * active / complete / scheduled from today's date, so it never goes stale. */
  function monthIndex(ym) {
    var parts = ym.split('-');
    return Number(parts[0]) * 12 + Number(parts[1]) - 1;
  }

  function updateStatus() {
    var now = new Date();
    var current = now.getFullYear() * 12 + now.getMonth();
    var labels = { active: 'Active', complete: 'Complete', scheduled: 'Scheduled' };

    $$('[data-start]').forEach(function (el) {
      var start = monthIndex(el.dataset.start);
      var end = el.dataset.end === 'present' ? Infinity : monthIndex(el.dataset.end);
      var state = current < start ? 'scheduled' : current > end ? 'complete' : 'active';
      el.classList.toggle('is-active', state === 'active');
      el.classList.toggle('is-complete', state === 'complete');
      el.classList.toggle('is-scheduled', state === 'scheduled');
      var chip = $('[data-status]', el);
      if (chip) chip.textContent = labels[state];
    });

    var active = $$('.rec.is-active').map(function (r) { return r.dataset.short; }).filter(Boolean);
    $$('[data-current]').forEach(function (el) {
      el.textContent = active.length ? active.join(' · ') : el.dataset.fallback;
    });
    $$('.current').forEach(function (list) {
      list.classList.toggle('is-empty', !$('li.is-active', list));
    });
    root.classList.add('status-on');
  }

  /* ------------------------------------------------------- scroll position
   * Highlights the current nav item and moves the lime marker down the index rule. */
  function position() {
    var links = $$('.nav__link');
    var sections = $$('main > section[id]');
    var rule = $('.rule');

    function setCurrent(section) {
      links.forEach(function (a) {
        if (a.hash === '#' + section.id) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    }

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) setCurrent(e.target); });
      }, { rootMargin: '-35% 0px -60% 0px' });
      sections.forEach(function (s) { io.observe(s); });
    }

    if (!rule) return;
    var queued = false;
    function update() {
      queued = false;
      var max = Math.max(1, root.scrollHeight - window.innerHeight);
      rule.style.setProperty('--p', Math.min(1, Math.max(0, window.scrollY / max)).toFixed(4));
    }
    window.addEventListener('scroll', function () {
      if (!queued) { queued = true; requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ------------------------------------------------------------------ menu */
  function menu() {
    var btn = $('.menu');
    var nav = $('#nav');
    if (!btn || !nav) return;
    var compact = window.matchMedia('(max-width: 1240px)');

    function setOpen(open) {
      btn.setAttribute('aria-expanded', String(open));
      btn.textContent = open ? 'Close' : 'Menu';
      root.classList.toggle('menu-open', open);
    }
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') !== 'true';
      setOpen(open);
      if (open) $('a', nav).focus();
    });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && root.classList.contains('menu-open')) { setOpen(false); btn.focus(); }
    });
    document.addEventListener('focusin', function (e) {
      if (root.classList.contains('menu-open') && !nav.contains(e.target) && e.target !== btn) setOpen(false);
    });
    compact.addEventListener('change', function (e) { if (!e.matches) setOpen(false); });
  }

  /* ------------------------------------------------------------ copy email */
  function copyButtons() {
    var buttons = $$('[data-copy]');
    if (!buttons.length || !navigator.clipboard) return;
    var live = document.createElement('p');
    live.className = 'sr-only';
    live.setAttribute('aria-live', 'polite');
    live.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)';
    document.body.appendChild(live);

    buttons.forEach(function (btn) {
      var original = btn.textContent;
      btn.hidden = false;
      btn.addEventListener('click', function () {
        navigator.clipboard.writeText(btn.dataset.copy).then(function () {
          btn.textContent = 'Copied';
          btn.classList.add('is-done');
          live.textContent = 'Email address copied to clipboard.';
        }, function () {
          btn.textContent = 'Failed';
        });
        clearTimeout(btn._reset);
        btn._reset = setTimeout(function () {
          btn.textContent = original;
          btn.classList.remove('is-done');
          live.textContent = '';
        }, 1800);
      });
    });
  }

  updateStatus();
  position();
  menu();
  copyButtons();
})();
