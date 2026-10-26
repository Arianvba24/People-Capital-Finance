(function () {
  var d = document;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Menú móvil
  var toggle = d.querySelector('.menu-toggle'), menu = d.getElementById('menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () { toggle.setAttribute('aria-expanded', menu.classList.toggle('open')); });
    menu.addEventListener('click', function (e) { if (e.target.tagName === 'A') menu.classList.remove('open'); });
  }

  // Aparición al hacer scroll
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); } });
  }, { threshold: 0.15 }) : null;
  d.querySelectorAll('.reveal').forEach(function (el) { io ? io.observe(el) : el.classList.add('in-view'); });

  // Fondo del hero: las imágenes se deslizan lateralmente (carrusel infinito)
  var track = d.querySelector('.hero-track');
  if (track && !reduce) {
    var n = track.children.length, i = 0;
    track.appendChild(track.children[0].cloneNode(true));
    setInterval(function () {
      i++; track.classList.remove('jump'); track.style.transform = 'translateX(-' + i * 100 + '%)';
      if (i === n) setTimeout(function () { track.classList.add('jump'); track.style.transform = 'translateX(0)'; i = 0; }, 1150);
    }, 6000);
  }

  // Contador de la franja de estadísticas
  var c = d.querySelector('[data-count]');
  if (c) {
    var target = +c.dataset.count, started = false;
    var run = function () {
      if (started) return; started = true;
      var k = 0, step = Math.max(1, Math.round(target / 60));
      (function tick() { k = Math.min(target, k + step); c.textContent = k; if (k < target) setTimeout(tick, 25); })();
    };
    if (io) new IntersectionObserver(function (es, o) { if (es[0].isIntersecting) { run(); o.disconnect(); } }).observe(c); else c.textContent = target;
  }

  // Sección activa en el menú (solo en index)
  var secs = d.querySelectorAll('section[id]'), links = d.querySelectorAll('nav.links a');
  if (secs.length > 1) {
    var spy = function () {
      var y = window.scrollY + 120, cur = secs[0].id;
      secs.forEach(function (s) { if (s.offsetTop <= y) cur = s.id; });
      links.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + cur); });
    };
    window.addEventListener('scroll', spy, { passive: true }); spy();
  }
})();
