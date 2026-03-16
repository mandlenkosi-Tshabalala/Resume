// wwwroot/js/scrollSpy.js
export function initScrollSpy(navSelector = "#navMenu", linkSelector = "a.nav-link", activeClass = "active", offset = 0) {
    const nav = document.querySelector(navSelector);
    if (!nav) return;

    const links = Array.from(nav.querySelectorAll(linkSelector));
    // Map section id -> link
    const idToLink = new Map();
    links.forEach(l => {
        const href = l.getAttribute("href") || "";
        if (href.startsWith("#")) {
            idToLink.set(href.slice(1), l);
        }
    });

    const sections = Array.from(idToLink.keys())
        .map(id => document.getElementById(id))
        .filter(Boolean);

    // Remove active on all
    const clearActive = () => links.forEach(l => l.classList.remove(activeClass));

    // IntersectionObserver to detect visible section
    const observerOptions = {
        root: null,
        rootMargin: `0px 0px -${offset}px 0px`,
        threshold: 0.4
    };

    const observer = new IntersectionObserver((entries) => {
        // choose the most visible entry (largest intersectionRatio)
        const visible = entries
            .filter(e => e.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) {
            const id = visible.target.id;
            clearActive();
            const link = idToLink.get(id);
            if (link) link.classList.add(activeClass);
        }
    }, observerOptions);

    sections.forEach(s => observer.observe(s));

    // Click handlers: smooth scroll and set active immediately
    links.forEach(l => {
        l.addEventListener("click", (ev) => {
            const href = l.getAttribute("href") || "";
            if (!href.startsWith("#")) return;
            ev.preventDefault();
            const id = href.slice(1);
            const target = document.getElementById(id);
            if (!target) return;
            // smooth scroll and update history hash
            target.scrollIntoView({ behavior: "smooth", block: "start" });
            history.replaceState(null, "", `#${id}`);
            clearActive();
            l.classList.add(activeClass);
        });
    });

    // Expose a destroy helper (optional)
    return {
        destroy: () => {
            observer.disconnect();
            links.forEach(l => l.replaceWith(l.cloneNode(true))); // remove event listeners
        }
    };
}