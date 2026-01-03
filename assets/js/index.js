import { showThief } from './thieves.js';
import { initParticles } from './particles.js';

document.addEventListener('DOMContentLoaded', () => {
  // Ladrones en secciones
  const sections = document.querySelectorAll('.info-section');
  sections.forEach(section => showThief(section));

  // Botón jugar
  const playButton = document.getElementById('play-button');
  if (playButton) {
    playButton.addEventListener('click', () => {
      playButton.style.transform = 'scale(0.95)';
      setTimeout(() => {
        playButton.style.transform = '';
        window.location.href = 'game.html';
      }, 150);
    });
  }

  // Scroll indicator
  const scrollIndicator = document.querySelector('.scroll-indicator');
  const infoSections = document.querySelector('.info-sections');
  if (scrollIndicator && infoSections) {
    scrollIndicator.addEventListener('click', () => {
      window.scrollTo({
        top: infoSections.offsetTop,
        behavior: 'smooth'
      });
    });
  }

  // Partículas
  initParticles();

  console.log('Credit Fraud Hunters - index modular cargado correctamente');
});