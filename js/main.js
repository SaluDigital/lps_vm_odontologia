(function () {
  var WA_NUMBER = '5524988678637';
  var WA_TEXT = document.body.getAttribute('data-wa-text') || 'Olá, quero avaliar invisalign.';
  var url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(WA_TEXT);

  document.querySelectorAll('[data-wa]').forEach(function (a) {
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener';
  });

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Carrossel de avaliações
  document.querySelectorAll('[data-carousel]').forEach(function (root) {
    var track = root.querySelector('[data-track]');
    var nav = root.querySelector('[data-nav]');
    var dots = root.querySelector('[data-dots]');
    var slides = Array.prototype.slice.call(track.children);
    var prev = root.querySelector('[data-prev]');
    var next = root.querySelector('[data-next]');
    var timer;

    function step() {
      var s = slides[0];
      return s.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 22);
    }
    function pages() {
      return Math.max(1, Math.round((track.scrollWidth - track.clientWidth) / step()) + 1);
    }
    function current() { return Math.round(track.scrollLeft / step()); }
    function goTo(i) {
      var max = pages() - 1;
      track.scrollTo({ left: Math.max(0, Math.min(i, max)) * step() });
    }
    function build() {
      var n = pages();
      nav.hidden = n <= 1;
      dots.innerHTML = '';
      for (var i = 0; i < n; i++) {
        (function (k) {
          var b = document.createElement('button');
          b.type = 'button';
          b.setAttribute('aria-label', 'Ir para avaliação ' + (k + 1));
          b.addEventListener('click', function () { goTo(k); restart(); });
          dots.appendChild(b);
        })(i);
      }
      update();
    }
    function update() {
      var c = Math.min(current(), dots.children.length - 1);
      Array.prototype.forEach.call(dots.children, function (d, i) {
        d.setAttribute('aria-current', i === c ? 'true' : 'false');
      });
    }
    function autoplay() {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      timer = setInterval(function () {
        if (nav.hidden) return;
        var c = current();
        goTo(c >= pages() - 1 ? 0 : c + 1);
      }, 6000);
    }
    function restart() { clearInterval(timer); autoplay(); }

    prev.addEventListener('click', function () { goTo(current() - 1); restart(); });
    next.addEventListener('click', function () { goTo(current() + 1); restart(); });
    track.addEventListener('scroll', function () { window.requestAnimationFrame(update); }, { passive: true });
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { goTo(current() + 1); restart(); }
      if (e.key === 'ArrowLeft') { goTo(current() - 1); restart(); }
    });
    root.addEventListener('mouseenter', function () { clearInterval(timer); });
    root.addEventListener('mouseleave', restart);
    window.addEventListener('resize', build);
    build();
    autoplay();
  });

  var els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    els.forEach(function (e) { e.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.classList.add('in');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(function (e, i) {
    e.style.transitionDelay = (i % 4) * 70 + 'ms';
    io.observe(e);
  });
})();
