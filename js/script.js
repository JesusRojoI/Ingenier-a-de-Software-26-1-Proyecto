// script.js - Lógica corregida para mostrar ladrones permanentes

document.addEventListener('DOMContentLoaded', function() {
    // Configuración de los ladrones disponibles (usando los nombres reales)
    const thieves = [
        'imgs/carcelero.png',
        'imgs/gordo.png', 
        'imgs/kid.png',
        'imgs/principal.png',
        'imgs/repartidor.png'
    ];
    
    // Obtener todas las secciones
    const sections = document.querySelectorAll('.info-section');
    
    // Array para rastrear qué ladrones se han mostrado
    let usedThieves = [];
    
    // Función para obtener un ladrón aleatorio
    function getRandomThief() {
        // Si ya usamos todos los ladrones, reiniciamos
        if (usedThieves.length >= thieves.length) {
            usedThieves = [];
        }
        
        // Filtramos ladrones no usados
        const availableThieves = thieves.filter(thief => !usedThieves.includes(thief));
        
        // Seleccionamos uno aleatorio
        const randomIndex = Math.floor(Math.random() * availableThieves.length);
        const selectedThief = availableThieves[randomIndex];
        
        // Lo marcamos como usado
        usedThieves.push(selectedThief);
        
        return selectedThief;
    }
    
    // Función para mostrar un ladrón en una sección (solo una vez)
    function showThief(section) {
        const thiefContainer = section.querySelector('.thief-container');
        
        // Si ya hay un ladrón mostrándose, no hacer nada
        if (thiefContainer.classList.contains('show') || thiefContainer.hasAttribute('data-loaded')) return;
        
        // Obtener un ladrón aleatorio
        const randomThief = getRandomThief();
        
        // Crear la imagen del ladrón
        const thiefImg = document.createElement('img');
        thiefImg.src = randomThief;
        thiefImg.alt = 'Ladrón de identidad';
        thiefImg.classList.add('thief-image');
        
        // Agregar texto alternativo basado en el nombre del archivo
        const thiefName = randomThief.split('/').pop().split('.')[0];
        thiefImg.title = `Ladrón: ${thiefName}`;
        
        // Limpiar el contenedor y agregar la nueva imagen
        thiefContainer.innerHTML = '';
        thiefContainer.appendChild(thiefImg);
        
        // Marcar como cargado y mostrar permanentemente
        thiefContainer.setAttribute('data-loaded', 'true');
        setTimeout(() => {
            thiefContainer.classList.add('show');
        }, 300);
    }
    
    // Función para verificar si un elemento está en el viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) * 0.9 &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // Función para manejar el scroll
    function handleScroll() {
        sections.forEach(section => {
            if (isInViewport(section)) {
                showThief(section);
            }
        });
    }
    
    // Agregar evento de scroll con throttling
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(function() {
                handleScroll();
                scrollTimeout = null;
            }, 150);
        }
    });
    
    // Verificar al cargar la página
    handleScroll();
    
    // Agregar funcionalidad al botón de jugar
    const playButton = document.getElementById('play-button');
    if (playButton) {
        playButton.addEventListener('click', function() {
            window.location.href = 'game.html';
        });
    }
    
    // Efecto de aparición suave para las secciones
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Aplicar observer a cada sección
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(section);
    });
    
    // Mostrar mensaje de carga
    console.log('Credit Fraud Hunters - Ladrones cargados correctamente');
    console.log('Ladrones disponibles:', thieves);
});