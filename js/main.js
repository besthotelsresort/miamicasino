(function () {
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  var tabsRoot = document.querySelector('[data-tabs]');

  if (header) {
    var onScroll = function () {
      if (window.scrollY > 24) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      nav.classList.toggle('is-open', open);
    };

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        setOpen(false);
      });
    });

    document.addEventListener('click', function (e) {
      if (toggle.getAttribute('aria-expanded') !== 'true') return;
      if (nav.contains(e.target) || toggle.contains(e.target)) return;
      setOpen(false);
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var id = anchor.getAttribute('href');
      if (!id || id === '#') return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  if (tabsRoot) {
    var tablist = tabsRoot.querySelector('[role="tablist"]');
    var tabs = Array.prototype.slice.call(tabsRoot.querySelectorAll('[role="tab"]'));
    var panels = Array.prototype.slice.call(tabsRoot.querySelectorAll('[role="tabpanel"]'));
    var accordionMq = window.matchMedia('(max-width: 480px)');

    var layoutPanels = function () {
      if (!tablist) return;
      if (accordionMq.matches) {
        tabs.forEach(function (tab) {
          var panel = document.getElementById(tab.getAttribute('aria-controls'));
          if (panel) {
            tab.insertAdjacentElement('afterend', panel);
          }
        });
      } else {
        panels.forEach(function (panel) {
          tabsRoot.appendChild(panel);
        });
      }
    };

    var activate = function (tab) {
      tabs.forEach(function (t) {
        var selected = t === tab;
        t.setAttribute('aria-selected', selected ? 'true' : 'false');
        t.setAttribute('tabindex', selected ? '0' : '-1');
      });
      panels.forEach(function (panel) {
        var match = panel.id === tab.getAttribute('aria-controls');
        panel.classList.toggle('is-active', match);
        if (match) {
          panel.removeAttribute('hidden');
        } else {
          panel.setAttribute('hidden', '');
        }
      });
    };

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        activate(tab);
      });

      tab.addEventListener('keydown', function (e) {
        var i = tabs.indexOf(tab);
        var next = -1;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          next = (i + 1) % tabs.length;
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          next = (i - 1 + tabs.length) % tabs.length;
        } else if (e.key === 'Home') {
          next = 0;
        } else if (e.key === 'End') {
          next = tabs.length - 1;
        } else {
          return;
        }
        e.preventDefault();
        tabs[next].focus();
        activate(tabs[next]);
      });
    });

    layoutPanels();
    if (typeof accordionMq.addEventListener === 'function') {
      accordionMq.addEventListener('change', layoutPanels);
    } else if (typeof accordionMq.addListener === 'function') {
      accordionMq.addListener(layoutPanels);
    }
  }

  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      reveals.forEach(function (el) {
        el.classList.add('is-visible');
      });
    } else if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );
      reveals.forEach(function (el) {
        io.observe(el);
      });
    } else {
      reveals.forEach(function (el) {
        el.classList.add('is-visible');
      });
    }
  }
})();
