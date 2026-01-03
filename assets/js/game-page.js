import { initParticlesGame } from './particles-game.js';

function openModal(level) {
  const modal = document.getElementById(level + 'Modal');
  if (modal) modal.style.display = 'flex';
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.style.display = 'none';
}

function startLevel(level) {
  const gamePages = {
    whatsapp: 'game-whatsapp.html',
    email: 'game-email.html',
    calls: 'game-calls.html',
    web: 'game-web.html',
    sms: 'game-sms.html',
  };

  if (gamePages[level]) window.location.href = gamePages[level];
}

// Exponer funciones para tus onclick="" del HTML
window.openModal = openModal;
window.closeModal = closeModal;
window.startLevel = startLevel;

document.addEventListener('DOMContentLoaded', () => {
  initParticlesGame();

  // Cerrar modal al hacer click fuera del contenido
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.style.display = 'none';
    });
  });

  // Cerrar modal con tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.style.display = 'none';
      });
    }
  });
});