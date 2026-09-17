// Typing effect for the hero subtitle
const phrases = [
  "Sinh viên CNTT · HUST",
  "Đang học Công nghệ Web và dịch vụ trực tuyến",
  "Xây dựng namhai23905.id.vn từng bước một",
];

const typedEl = document.getElementById("typed");
let phraseIndex = 0;
let charIndex = 0;
let deleting = false;

function tick() {
  const current = phrases[phraseIndex];

  if (!deleting) {
    charIndex++;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(tick, 1400);
      return;
    }
  } else {
    charIndex--;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }

  setTimeout(tick, deleting ? 35 : 65);
}

if (typedEl) tick();

// Reveal sections on scroll
const sections = document.querySelectorAll(".section");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("in-view");
    });
  },
  { threshold: 0.15 }
);
sections.forEach((s) => observer.observe(s));
