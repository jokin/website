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

    // Nav dropdowns — toggle on mobile, let hover work on desktop
    function initNavDropdowns() {
        document.querySelectorAll('.nav-dropdown > a').forEach(function(link) {
            link.addEventListener('click', function(e) {
                // Only intercept on mobile (nav-toggle visible)
                var toggle = document.querySelector('.nav-toggle');
                if (!toggle || window.getComputedStyle(toggle).display === 'none') return;

                var parent = this.parentElement;
                if (!parent.classList.contains('open')) {
                    e.preventDefault();
                    parent.classList.toggle('open');
                }
                // Second tap follows the link normally
            });
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

    // Hero Slideshow — lazy-loads each image just before it's shown
    function initSlideshow() {
        var slides = document.querySelectorAll('.hero-slide');
        if (slides.length < 2) return;

        var current = 0;
        var total = slides.length;

        function loadSlide(index) {
            var slide = slides[index];
            if (slide.dataset.bg && !slide.style.backgroundImage) {
                slide.style.backgroundImage = "url('" + slide.dataset.bg + "')";
            }
        }

        // Preload the next slide a beat ahead so it's ready when it transitions
        function advance() {
            slides[current].classList.remove('active');
            current = (current + 1) % total;
            loadSlide(current);
            slides[current].classList.add('active');
            // Queue the one after that too
            loadSlide((current + 1) % total);
        }

        // Preload slide 2 immediately so it's ready for the first transition
        loadSlide(1);

        setInterval(advance, 5000);
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

    // Promo Image Glitch
    function initPromoGlitch() {
        var container = document.querySelector('.about-promo');
        if (!container) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        var mainImg = container.querySelector('img');
        var originalSrc = mainImg.src;
        var glitchSrcs = [
            'images/glitch-1.png',
            'images/glitch-2.png',
            'images/glitch-3.png',
            'images/glitch-4.png',
            'images/glitch-5.png'
        ];
        var allSrcs = [originalSrc].concat(glitchSrcs.map(function(s) {
            return new URL(s, window.location.href).href;
        }));

        // Preload all glitch images
        glitchSrcs.forEach(function(src) {
            var img = new Image();
            img.src = src;
        });

        // Make container position:relative for overlay positioning
        container.style.position = 'relative';

        function randomGlitchSrc() {
            return glitchSrcs[Math.floor(Math.random() * glitchSrcs.length)];
        }

        // Simple swap: replace image for ~500ms
        function simpleSwap() {
            mainImg.src = randomGlitchSrc();
            setTimeout(function() {
                mainImg.src = originalSrc;
            }, 400 + Math.random() * 200);
        }

        // Chromatic burst: show all 6 images layered with offsets, drifting apart
        function chromaticBurst() {
            var blendModes = ['difference', 'exclusion', 'color-dodge', 'hard-light'];
            var overlays = [];

            allSrcs.forEach(function(src, i) {
                if (i === 0) return; // skip original, it's already showing

                var img = document.createElement('img');
                img.src = src;
                img.style.position = 'absolute';
                img.style.top = '0';
                img.style.left = '0';
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'cover';
                img.style.mixBlendMode = blendModes[Math.floor(Math.random() * blendModes.length)];
                img.style.opacity = '0.7';
                img.style.pointerEvents = 'none';

                // Random initial offset 5-10px
                var dx = (Math.random() < 0.5 ? -1 : 1) * (5 + Math.random() * 5);
                var dy = (Math.random() < 0.5 ? -1 : 1) * (5 + Math.random() * 5);
                img.style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';
                img.style.transition = 'transform 1.5s ease-out, opacity 0.3s ease';

                // Drift direction (2-4 px/s extra over ~1.5s)
                var driftX = dx + (dx > 0 ? 1 : -1) * (3 + Math.random() * 3);
                var driftY = dy + (dy > 0 ? 1 : -1) * (3 + Math.random() * 3);

                container.appendChild(img);
                overlays.push({ el: img, driftX: driftX, driftY: driftY });
            });

            // Also swap main image to a glitch variant
            mainImg.src = randomGlitchSrc();

            // Start drift
            requestAnimationFrame(function() {
                overlays.forEach(function(o) {
                    o.el.style.transform = 'translate(' + o.driftX + 'px, ' + o.driftY + 'px)';
                });
            });

            // Fade out and remove after ~1.2s
            setTimeout(function() {
                overlays.forEach(function(o) {
                    o.el.style.opacity = '0';
                });
                mainImg.src = originalSrc;
                setTimeout(function() {
                    overlays.forEach(function(o) {
                        if (o.el.parentNode) o.el.parentNode.removeChild(o.el);
                    });
                }, 350);
            }, 1200);
        }

        function glitch() {
            if (Math.random() < 0.2) {
                chromaticBurst();
            } else {
                simpleSwap();
            }

            var nextDelay = 3000 + Math.random() * 12000;
            setTimeout(glitch, nextDelay);
        }

        setTimeout(glitch, 3000);
    }

    // Title Glitch — subtle glitches on "Your Temporary Desert City"
    function initTitleGlitch() {
        var title = document.querySelector('.about-title');
        if (!title) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        var effects = [
            { cls: 'glitch-shake',     duration: 400 },
            { cls: 'glitch-chromatic', duration: 500 },
            { cls: 'glitch-skew',      duration: 300 },
            { cls: 'glitch-flicker',   duration: 400 },
            { cls: 'glitch-dropout',   duration: 350 }
        ];

        var last = -1;

        function glitch() {
            // Pick a different effect than last time
            var idx;
            do { idx = Math.floor(Math.random() * effects.length); } while (idx === last);
            last = idx;

            var fx = effects[idx];
            title.classList.add(fx.cls);

            setTimeout(function() {
                title.classList.remove(fx.cls);
            }, fx.duration);

            var next = 5000 + Math.random() * 15000;
            setTimeout(glitch, next);
        }

        // Start after initial delay
        setTimeout(glitch, 3000);
    }

    // Photo Glitch — glitch effects on the 4 whatis photos
    function initPhotoGlitch() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        // Map each container to its source image number and glitch files
        var photos = [
            { sel: '.ac-img--a', src: 1 },
            { sel: '.ac-img--b', src: 4 },
            { sel: '.ac-img--c', src: 3 },
            { sel: '.ac-img--d', src: 2 }
        ];

        var blendModes = ['difference', 'exclusion', 'color-dodge', 'hard-light'];

        photos.forEach(function(photo) {
            var container = document.querySelector(photo.sel);
            if (!container) return;

            var mainImg = container.querySelector('img');
            var originalSrc = mainImg.src;

            // Build glitch src list
            var glitchSrcs = [];
            for (var g = 1; g <= 5; g++) {
                glitchSrcs.push('images/whatis-' + photo.src + '-glitch-' + g + '.jpg');
            }

            // Preload
            glitchSrcs.forEach(function(src) { var img = new Image(); img.src = src; });

            function randomGlitchSrc() {
                return glitchSrcs[Math.floor(Math.random() * glitchSrcs.length)];
            }

            // Mode 1: Simple swap — replace image for ~400-600ms
            function modeSwap() {
                mainImg.src = randomGlitchSrc();
                setTimeout(function() {
                    mainImg.src = originalSrc;
                }, 400 + Math.random() * 200);
            }

            // Mode 2: Difference drift — overlay with blend mode, drift a few px, fade out
            function modeDrift() {
                var overlay = document.createElement('img');
                overlay.src = randomGlitchSrc();
                overlay.className = 'photo-glitch-overlay';
                overlay.style.mixBlendMode = blendModes[Math.floor(Math.random() * blendModes.length)];
                overlay.style.opacity = '0.7';
                overlay.style.transition = 'transform 1.2s ease-out, opacity 0.4s ease';

                // Match the main image's transform (rotation, filters) so it overlays correctly
                var computed = window.getComputedStyle(mainImg);
                overlay.style.transform = computed.transform;
                overlay.style.filter = computed.filter;
                overlay.style.borderRadius = computed.borderRadius;
                overlay.style.boxShadow = 'none';

                container.appendChild(overlay);

                // Drift by 3-10px in a random direction
                var dx = (Math.random() - 0.5) * 2 * (3 + Math.random() * 7);
                var dy = (Math.random() - 0.5) * 2 * (3 + Math.random() * 7);

                requestAnimationFrame(function() {
                    var baseTransform = overlay.style.transform;
                    if (baseTransform && baseTransform !== 'none') {
                        overlay.style.transform = baseTransform + ' translate(' + dx + 'px, ' + dy + 'px)';
                    } else {
                        overlay.style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';
                    }
                });

                // Fade out and remove
                setTimeout(function() {
                    overlay.style.opacity = '0';
                    setTimeout(function() {
                        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
                    }, 400);
                }, 900 + Math.random() * 400);
            }

            function glitch() {
                if (Math.random() < 0.45) {
                    modeDrift();
                } else {
                    modeSwap();
                }

                var next = 10000 + Math.random() * 30000;
                setTimeout(glitch, next);
            }

            // Stagger start times so all 4 photos don't glitch simultaneously
            var startDelay = 2000 + Math.random() * 4000;
            setTimeout(glitch, startDelay);
        });
    }

    // Principles Carousel
    function initPrinciplesCarousel() {
        var track = document.getElementById('principlesTrack');
        var dotsContainer = document.getElementById('principlesDots');
        var prevBtn = document.querySelector('.principles-arrow--prev');
        var nextBtn = document.querySelector('.principles-arrow--next');
        if (!track) return;

        var cards = track.querySelectorAll('.principle-card');
        var currentIndex = 0;

        // Build dots
        cards.forEach(function(_, i) {
            var dot = document.createElement('button');
            dot.className = 'principles-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', 'Go to principle ' + (i + 1));
            dot.addEventListener('click', function() { scrollToCard(i); });
            if (dotsContainer) dotsContainer.appendChild(dot);
        });

        function getDots() {
            return dotsContainer ? dotsContainer.querySelectorAll('.principles-dot') : [];
        }

        function updateDots() {
            var dots = getDots();
            dots.forEach(function(dot, i) {
                dot.classList.toggle('active', i === currentIndex);
            });
        }

        function scrollToCard(index) {
            var card = cards[index];
            if (!card) return;
            var cardLeft = card.offsetLeft;
            var cardWidth = card.offsetWidth;
            var trackWidth = track.clientWidth;
            var scrollPos = cardLeft - (trackWidth - cardWidth) / 2;
            track.scrollTo({ left: scrollPos, behavior: 'smooth' });
            currentIndex = index;
            updateDots();
        }

        function updateIndexFromScroll() {
            var trackCenter = track.scrollLeft + track.clientWidth / 2;
            var bestIdx = 0;
            var bestDist = Infinity;
            cards.forEach(function(card, i) {
                var cardCenter = card.offsetLeft + card.offsetWidth / 2;
                var dist = Math.abs(cardCenter - trackCenter);
                if (dist < bestDist) { bestDist = dist; bestIdx = i; }
            });
            if (bestIdx !== currentIndex) {
                currentIndex = bestIdx;
                updateDots();
            }
        }

        if (prevBtn) prevBtn.addEventListener('click', function() {
            scrollToCard(Math.max(0, currentIndex - 1));
        });
        if (nextBtn) nextBtn.addEventListener('click', function() {
            scrollToCard(Math.min(cards.length - 1, currentIndex + 1));
        });

        track.addEventListener('scroll', updateIndexFromScroll, { passive: true });

        // Example toggles
        track.querySelectorAll('.principle-example-toggle').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var card = btn.closest('.principle-card');
                if (!card) return;
                var isOpen = card.classList.toggle('example-open');
                btn.textContent = isOpen ? 'Hide example' : 'Show example';
                btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            });
        });
    }

    // Back to Top
    function initBackToTop() {
        var btn = document.querySelector('.back-to-top');
        if (!btn) return;

        window.addEventListener('scroll', function() {
            if (window.scrollY > 600) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        }, { passive: true });
    }

    // Hero Dust Particles — low-opacity warm motes drifting upward
    function initHeroDust() {
        var canvas = document.getElementById('hero-dust-canvas');
        if (!canvas) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        var ctx = canvas.getContext('2d');
        var particles = [];
        var COUNT = 45;
        var raf;

        function resize() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }

        resize();
        window.addEventListener('resize', resize, { passive: true });

        for (var i = 0; i < COUNT; i++) {
            particles.push({
                x: Math.random(),          // 0–1 normalised
                y: Math.random(),
                r: 0.4 + Math.random() * 1.6,
                vx: (Math.random() - 0.45) * 0.0003,
                vy: -(0.00015 + Math.random() * 0.00025),
                opacity: 0.018 + Math.random() * 0.055,
                pulse: Math.random() * Math.PI * 2  // phase offset for subtle breathe
            });
        }

        var tick = 0;
        function draw() {
            tick++;
            var w = canvas.width;
            var h = canvas.height;
            ctx.clearRect(0, 0, w, h);

            particles.forEach(function(p) {
                var breathe = 1 + 0.15 * Math.sin(tick * 0.018 + p.pulse);
                var op = p.opacity * breathe;
                ctx.beginPath();
                ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(215, 155, 65, ' + op + ')';
                ctx.fill();

                p.x += p.vx;
                p.y += p.vy;

                // wrap
                if (p.y < -0.02) { p.y = 1.02; p.x = Math.random(); }
                if (p.x > 1.02)  { p.x = -0.02; }
                if (p.x < -0.02) { p.x = 1.02; }
            });

            raf = requestAnimationFrame(draw);
        }

        draw();

        // Stop animating when hero is off-screen to save CPU
        var hero = document.querySelector('.hero');
        if (hero && 'IntersectionObserver' in window) {
            var obs = new IntersectionObserver(function(entries) {
                entries.forEach(function(e) {
                    if (e.isIntersecting) {
                        if (!raf) draw();
                    } else {
                        cancelAnimationFrame(raf);
                        raf = null;
                    }
                });
            }, { threshold: 0 });
            obs.observe(hero);
        }
    }

    // Init
    function init() {
        initMobileNav();
        initNavDropdowns();
        initSmoothScroll();
        initSlideshow();
        initHeaderScroll();
        initScrollAnimations();
        initGlitchText();
        initPromoGlitch();
        initTitleGlitch();
        initPhotoGlitch();
        initBackToTop();
        initPrinciplesCarousel();
        initHeroDust();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
