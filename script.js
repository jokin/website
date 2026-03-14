/**
 * Nobodies Collective Association
 */

(function() {
    'use strict';

    // Mobile Navigation
    function initMobileNav() {
        const toggle = document.querySelector('.nav-toggle');
        const links = document.querySelector('.nav-links');
        if (!toggle || !links) return;

        toggle.addEventListener('click', () => {
            links.classList.toggle('active');
        });

        // Close on link click
        links.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                links.classList.remove('active');
            });
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!toggle.contains(e.target) && !links.contains(e.target)) {
                links.classList.remove('active');
            }
        });
    }

    // Smooth scroll
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const id = this.getAttribute('href');
                if (id === '#') return;

                const target = document.querySelector(id);
                if (target) {
                    e.preventDefault();
                    const header = document.querySelector('.header');
                    const offset = header ? header.offsetHeight : 0;

                    window.scrollTo({
                        top: target.offsetTop - offset,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Header scroll effect
    function initHeaderScroll() {
        var header = document.querySelector('.header');
        if (!header) return;

        // Pages without a hero section always get dark nav text
        var hasHero = !!document.querySelector('.hero');
        if (!hasHero) {
            header.classList.add('scrolled');
            return;
        }

        function checkScroll() {
            if (window.scrollY > 80) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        window.addEventListener('scroll', checkScroll, { passive: true });
        checkScroll();
    }

    // Hero Slideshow
    function initSlideshow() {
        var slides = document.querySelectorAll('.hero-slide');
        if (slides.length < 2) return;

        var current = 0;
        var total = slides.length;

        setInterval(function() {
            slides[current].classList.remove('active');
            current = (current + 1) % total;
            slides[current].classList.add('active');
        }, 5000);
    }

    // Scroll Animations
    function initScrollAnimations() {
        var animEls = document.querySelectorAll('.anim');
        if (!animEls.length || !('IntersectionObserver' in window)) {
            // No support or no elements — show everything
            animEls.forEach(function(el) { el.classList.add('visible'); });
            return;
        }

        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px'
        });

        animEls.forEach(function(el) { observer.observe(el); });
    }

    // Hero Glitch Text
    function initGlitchText() {
        var hero = document.querySelector('.hero');
        if (!hero) return;

        // Respect reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        var words = ['ELSEWHERE', 'BURN', 'ELSEWHERE BURN', 'BURN ELSEWHERE'];
        var blendModes = ['difference', 'exclusion', 'color-dodge', 'hard-light', 'overlay'];
        var glitchColors = ['#fff', '#0ff', '#f0f', '#ff0', '#fff', '#fff'];
        var glitchStyles = ['', 'glitch-aberration', 'glitch-ghost', 'glitch-scan'];

        function makeEl(text) {
            var el = document.createElement('div');
            el.className = 'glitch-flash';
            var style = glitchStyles[Math.floor(Math.random() * glitchStyles.length)];
            if (style) el.classList.add(style);
            el.textContent = text;
            el.style.mixBlendMode = blendModes[Math.floor(Math.random() * blendModes.length)];
            el.style.color = glitchColors[Math.floor(Math.random() * glitchColors.length)];
            var skew = (Math.random() - 0.5) * 15;
            var scale = 0.7 + Math.random() * 0.8;
            var rotate = (Math.random() - 0.5) * 8;
            el.style.transform = 'skew(' + skew + 'deg) scale(' + scale + ') rotate(' + rotate + 'deg)';
            el.style.fontSize = (2.5 + Math.random() * 4.5) + 'rem';
            el.style.opacity = 0.4 + Math.random() * 0.6;
            return el;
        }

        function removeEl(el) {
            if (el.parentNode) el.parentNode.removeChild(el);
        }

        // Mode 1: Teleport — blink in at several positions, vanish between each
        function modeTeleport(text) {
            var jumps = 2 + Math.floor(Math.random() * 4); // 2-5 positions
            var onTime = 100 + Math.random() * 400; // 100-500ms visible
            var offTime = 40 + Math.random() * 80; // 40-120ms gap between
            var i = 0;

            function jump() {
                var el = makeEl(text);
                el.style.top = (10 + Math.random() * 65) + '%';
                el.style.left = (5 + Math.random() * 50) + '%';
                hero.appendChild(el);
                i++;
                setTimeout(function() {
                    removeEl(el);
                    if (i < jumps) {
                        setTimeout(jump, offTime);
                    }
                }, onTime);
            }
            jump();
        }

        // Mode 2: Drift — multiple overlaid copies that drift subtly apart (pixels)
        function modeDrift(text) {
            var count = 2 + Math.floor(Math.random() * 3); // 2-4 copies
            var baseTop = 10 + Math.random() * 65;
            var baseLeft = 5 + Math.random() * 50;
            var duration = 200 + Math.random() * 500;
            var els = [];

            for (var c = 0; c < count; c++) {
                var el = makeEl(text);
                el.style.top = baseTop + '%';
                el.style.left = baseLeft + '%';
                el.style.transition = 'transform 0.3s ease-out';
                hero.appendChild(el);
                els.push(el);
            }

            // Drift apart by 5-20px using translate, keeping position anchored
            requestAnimationFrame(function() {
                els.forEach(function(el) {
                    var dx = (Math.random() - 0.5) * 2 * (5 + Math.random() * 15);
                    var dy = (Math.random() - 0.5) * 2 * (5 + Math.random() * 15);
                    var existing = el.style.transform;
                    el.style.transform = existing + ' translate(' + dx + 'px, ' + dy + 'px)';
                });
            });

            setTimeout(function() {
                els.forEach(removeEl);
            }, duration);
        }

        // Mode 3: Flicker — rapidly blink in place, sometimes with drift
        function modeFlicker(text) {
            var el = makeEl(text);
            var baseTop = 10 + Math.random() * 65;
            var baseLeft = 5 + Math.random() * 50;
            el.style.top = baseTop + '%';
            el.style.left = baseLeft + '%';
            hero.appendChild(el);

            var blinks = 3 + Math.floor(Math.random() * 5); // 3-7 blinks
            var blinkTime = 60 + Math.random() * 80; // 60-140ms per blink
            var doDrift = Math.random() < 0.4; // 40% chance of drifting while flickering
            var i = 0;

            function blink() {
                el.style.display = (i % 2 === 0) ? 'block' : 'none';
                if (doDrift && i % 2 === 0) {
                    el.style.top = (baseTop + (Math.random() - 0.5) * 6) + '%';
                    el.style.left = (baseLeft + (Math.random() - 0.5) * 5) + '%';
                }
                i++;
                if (i < blinks * 2) {
                    setTimeout(blink, blinkTime);
                } else {
                    removeEl(el);
                }
            }
            blink();
        }

        var modes = [modeTeleport, modeDrift, modeFlicker];

        function flash() {
            var text = words[Math.floor(Math.random() * words.length)];
            var mode = modes[Math.floor(Math.random() * modes.length)];
            mode(text);

            // Schedule next flash
            var nextDelay = 5000 + Math.random() * 25000;
            setTimeout(flash, nextDelay);
        }

        // Start after a short delay
        setTimeout(flash, 2000);
    }

    // Init
    function init() {
        initMobileNav();
        initSmoothScroll();
        initSlideshow();
        initHeaderScroll();
        initScrollAnimations();
        initGlitchText();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
