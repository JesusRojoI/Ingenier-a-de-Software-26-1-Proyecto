/*

// script.js - Lógica mejorada para mostrar ladrones

document.addEventListener('DOMContentLoaded', function() {
    // Configuración de los ladrones disponibles
    const thieves = [
        'imgs/thief1.jpg',
        'imgs/thief2.jpg', 
        'imgs/thief3.jpg',
        'imgs/thief4.jpg',
        'imgs/thief5.jpg'
    ];
    
    // Obtener todas las secciones
    const sections = document.querySelectorAll('.info-section');
    
    // Verificar si las imágenes existen
    function checkImageExists(url, callback) {
        const img = new Image();
        img.onload = function() { callback(true); };
        img.onerror = function() { callback(false); };
        img.src = url;
    }
    
    // Función para obtener un ladrón aleatorio que exista
    function getRandomThief(callback) {
        const randomIndex = Math.floor(Math.random() * thieves.length);
        const randomThief = thieves[randomIndex];
        
        checkImageExists(randomThief, function(exists) {
            if (exists) {
                callback(randomThief);
            } else {
                // Si la imagen no existe, intentar con otra
                console.warn(`La imagen ${randomThief} no se encuentra. Probando con otra...`);
                getRandomThief(callback);
            }
        });
    }
    
    // Función para verificar si un elemento está en el viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // Función para mostrar un ladrón en una sección
    function showThief(section) {
        const thiefContainer = section.querySelector('.thief-container');
        
        // Si ya hay un ladrón mostrándose, no hacer nada
        if (thiefContainer.classList.contains('show')) return;
        
        // Obtener un ladrón aleatorio que exista
        getRandomThief(function(randomThief) {
            // Crear la imagen del ladrón
            const thiefImg = document.createElement('img');
            thiefImg.src = randomThief;
            thiefImg.alt = 'Ladrón de identidad';
            thiefImg.classList.add('thief-image');
            
            // Limpiar el contenedor y agregar la nueva imagen
            thiefContainer.innerHTML = '';
            thiefContainer.appendChild(thiefImg);
            
            // Mostrar el contenedor con animación
            setTimeout(() => {
                thiefContainer.classList.add('show');
            }, 300);
            
            // Ocultar después de 5 segundos y mostrar otro
            setTimeout(() => {
                thiefContainer.classList.remove('show');
                setTimeout(() => {
                    if (isInViewport(section)) {
                        showThief(section);
                    }
                }, 2000);
            }, 5000);
        });
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
    
    // Debug: mostrar en consola si las imágenes se cargan
    console.log('Buscando imágenes de ladrones en:', thieves);
});
*/
// script.js - Lógica mejorada para mostrar ladrones

document.addEventListener('DOMContentLoaded', function() {
    // Configuración de los ladrones disponibles
    const thieves = [
        'imgs/thief1.jpg',
        'imgs/thief2.jpg', 
        'imgs/thief3.jpg',
        'imgs/thief4.jpg',
        'imgs/thief5.jpg'
    ];
    
    // Obtener todas las secciones
    const sections = document.querySelectorAll('.info-section');
    
    // Verificar si las imágenes existen
    function checkImageExists(url, callback) {
        const img = new Image();
        img.onload = function() { callback(true); };
        img.onerror = function() { callback(false); };
        img.src = url;
    }
    
    // Función para obtener un ladrón aleatorio que exista
    function getRandomThief(callback) {
        const randomIndex = Math.floor(Math.random() * thieves.length);
        const randomThief = thieves[randomIndex];
        
        checkImageExists(randomThief, function(exists) {
            if (exists) {
                callback(randomThief);
            } else {
                // Si la imagen no existe, usar imagen de respaldo
                console.warn(`La imagen ${randomThief} no se encuentra. Usando imagen de respaldo.`);
                callback('imgs/placeholder-thief.jpg');
            }
        });
    }
    
    // Función para verificar si un elemento está en el viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // Función para mostrar un ladrón en una sección
    function showThief(section) {
        const thiefContainer = section.querySelector('.thief-container');
        
        // Si ya hay un ladrón mostrándose, no hacer nada
        if (thiefContainer.classList.contains('show')) return;
        
        // Obtener un ladrón aleatorio que exista
        getRandomThief(function(randomThief) {
            // Crear la imagen del ladrón
            const thiefImg = document.createElement('img');
            thiefImg.src = randomThief;
            thiefImg.alt = 'Ladrón de identidad';
            thiefImg.classList.add('thief-image');
            
            // Limpiar el contenedor y agregar la nueva imagen
            thiefContainer.innerHTML = '';
            thiefContainer.appendChild(thiefImg);
            
            // Mostrar el contenedor con animación
            setTimeout(() => {
                thiefContainer.classList.add('show');
            }, 300);
            
            // Ocultar después de 5 segundos y mostrar otro
            setTimeout(() => {
                thiefContainer.classList.remove('show');
                setTimeout(() => {
                    if (isInViewport(section)) {
                        showThief(section);
                    }
                }, 2000);
            }, 5000);
        });
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
    
    // Debug: mostrar en consola si las imágenes se cargan
    console.log('Buscando imágenes de ladrones en:', thieves);
});