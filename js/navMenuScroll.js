
window.addEventListener('scroll', function () {
	const navbar = document.getElementById('navMenu');
	if (window.scrollY > 50) { // Adjust value (50px) as needed
		navbar.classList.add('scrolled');
	} else {
		navbar.classList.remove('scrolled');
	}
});
