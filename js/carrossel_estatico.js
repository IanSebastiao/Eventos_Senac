let currentIndex = 0;
const items = document.querySelectorAll(".carousel-item");
const totalItems = items.length;
const carousel = document.querySelector(".carousel");

document.querySelector(".next").addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % totalItems;
  updateCarousel();
});

document.querySelector(".prev").addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + totalItems) % totalItems;
  updateCarousel();
});

function updateCarousel() {
  carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
}