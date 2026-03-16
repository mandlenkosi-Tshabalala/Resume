// wwwroot/js/scrollFade.js
(function () {
    // function called from Blazor OnAfterRenderAsync
    window.onBlazorReady = function () {
        try {
            const items = Array.from(document.querySelectorAll('.fadeInContent'));
            if (!items.length) return;

            const observerOptions = {
                root: null,
                rootMargin: '0px 0px -10% 0px', // trigger slightly before the element fully enters
                threshold: 0.12
            };

            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // add class to start CSS transition
                        entry.target.classList.add('in-view');
                        // stop observing this element (one-time animation)
                        obs.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            // optionally add a small stagger using inline transitionDelay based on index
            items.forEach((el, idx) => {
                // only add a little stagger so multiple items don't animate at once
                const delayMs = Math.min(300, idx * 80); // cap delay to 300ms
                el.style.transitionDelay = `${delayMs}ms`;
                // ensure the element has the baseline transition properties if CSS file wasn't loaded early
                el.style.willChange = 'transform, opacity';
                observer.observe(el);
            });
        } catch (e) {
            // fail silently in older browsers
            console.error('onBlazorReady error:', e);
        }
    };
})();
