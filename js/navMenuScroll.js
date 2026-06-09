export function initNavMenuScroll(navSelector = "#navMenu", offset = 50) {
    const navbar = document.querySelector(navSelector);
    if (!navbar) return;

    const updateNavbarState = () => {
        if (window.scrollY > offset) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    };

    window.addEventListener("scroll", updateNavbarState, { passive: true });
    updateNavbarState();
}