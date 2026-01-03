export function initParticles() {
  const host = document.getElementById('particles-bg') || document.body;

  const canvas = document.createElement('canvas');
  canvas.id = 'particles-canvas';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.display = 'block';

  host.innerHTML = '';
  host.appendChild(canvas);

  const ctx = canvas.getContext('2d');

  function resize() {
    // Ajuste real del tamaño del canvas (no solo CSS)
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();

  const particles = [];
  const particleCount = 50;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 1,
      speedX: Math.random() * 0.5 - 0.25,
      speedY: Math.random() * 0.5 - 0.25,
      color: `rgba(99, 179, 237, ${Math.random() * 0.5 + 0.1})`
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of particles) {
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
      if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    }

    requestAnimationFrame(animate);
  }
  animate();

  window.addEventListener('resize', resize);
}