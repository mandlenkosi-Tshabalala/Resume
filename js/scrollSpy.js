export function initScrollSpy(navSelector = "#navMenu", linkSelector = "a.nav-link", activeClass = "active", offset = 0) {
    const nav = document.querySelector(navSelector);
    if (!nav) return;

    const links = Array.from(nav.querySelectorAll(linkSelector));

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

    const clearActive = () => links.forEach(l => l.classList.remove(activeClass));

    const setActive = (id) => {
        clearActive();
        const link = idToLink.get(id);
        if (link) link.classList.add(activeClass);
    };

    const observer = new IntersectionObserver((entries) => {
        const visible = entries
            .filter(e => e.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) {
            setActive(visible.target.id);
        }
    }, {
        root: null,
        rootMargin: `0px 0px -${offset}px 0px`,
        threshold: 0.4
    });

    sections.forEach(section => observer.observe(section));

    const initialHash = window.location.hash.replace("#", "");
    if (initialHash && idToLink.has(initialHash)) {
        setActive(initialHash);
    }

    const clickHandlers = new Map();

    links.forEach(link => {
        const handler = (ev) => {
            const href = link.getAttribute("href") || "";
            if (!href.startsWith("#")) return;

            ev.preventDefault();

            const id = href.slice(1);
            const target = document.getElementById(id);
            if (!target) return;

            target.scrollIntoView({ behavior: "smooth", block: "start" });
            history.replaceState(null, "", `#${id}`);
            setActive(id);
        };

        clickHandlers.set(link, handler);
        link.addEventListener("click", handler);
    });

    return {
        destroy: () => {
            observer.disconnect();
            links.forEach(link => {
                const handler = clickHandlers.get(link);
                if (handler) {
                    link.removeEventListener("click", handler);
                }
            });
        }
    };
}