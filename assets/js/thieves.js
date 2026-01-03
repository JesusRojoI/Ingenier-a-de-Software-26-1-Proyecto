const thieves = [
  'assets/images/carcelero.png',
  'assets/images/gordo.png',
  'assets/images/kid.png',
  'assets/images/principal.png',
  'assets/images/repartidor.png'
];

let usedThieves = [];

function getRandomThief() {
  if (usedThieves.length >= thieves.length) usedThieves = [];

  const available = thieves.filter(t => !usedThieves.includes(t));
  const randomIndex = Math.floor(Math.random() * available.length);
  const selected = available[randomIndex];

  usedThieves.push(selected);
  return selected;
}

export function showThief(section) {
  const thiefContainer = section.querySelector('.thief-container');
  if (!thiefContainer) return;

  if (thiefContainer.hasAttribute('data-loaded')) return;

  const randomThief = getRandomThief();

  const thiefImg = document.createElement('img');
  thiefImg.src = randomThief;
  thiefImg.alt = 'Ladrón de identidad';
  thiefImg.classList.add('thief-image');

  const thiefName = randomThief.split('/').pop().split('.')[0];
  thiefImg.title = `Ladrón: ${thiefName}`;

  thiefContainer.innerHTML = '';
  thiefContainer.appendChild(thiefImg);

  thiefContainer.setAttribute('data-loaded', 'true');
  thiefImg.style.animation = 'thiefAppear 0.6s ease-out';
}