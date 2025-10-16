const toggleBtn = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('nav ul');

toggleBtn.addEventListener('click', () => {
  navLinks.classList.toggle('show');
});