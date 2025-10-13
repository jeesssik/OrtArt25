// Animaciones del bosque encantado - Optimizado
document.addEventListener('DOMContentLoaded', function() {
    // Limpiar partículas acumuladas
    clearAccumulatedParticles();
    
    // Crear estrellas animadas
    createStars();
    
    // Crear luciérnagas (reducido)
    createFireflies();
    
    // Crear hojas cayendo (reducido)
    createFallingLeaves();
    
    // Crear efecto bokeh
    createBokehEffect();
    
    // Efectos de mouse (simplificado)
    addMouseEffects();
});

// Función para limpiar partículas acumuladas
function clearAccumulatedParticles() {
    const bokehContainer = document.querySelector('.bokeh-container');
    if (bokehContainer) {
        bokehContainer.innerHTML = '';
    }
}

// Función para crear estrellas animadas
function createStars() {
    const canvas = document.getElementById('stars');
    const ctx = canvas.getContext('2d');
    
    // Ajustar tamaño del canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const stars = [];
    const numStars = 30; // Reducido para mejor rendimiento
    
    // Crear estrellas
    for (let i = 0; i < numStars; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2 + 0.5,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            opacity: Math.random() * 0.8 + 0.2,
            twinkleSpeed: Math.random() * 0.02 + 0.01
        });
    }
    
    // Animar estrellas
    function animateStars() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        stars.forEach(star => {
            // Actualizar posición
            star.x += star.vx;
            star.y += star.vy;
            
            // Efecto de parpadeo
            star.opacity += Math.sin(Date.now() * star.twinkleSpeed) * 0.1;
            star.opacity = Math.max(0.1, Math.min(1, star.opacity));
            
            // Reaparecer en el otro lado si sale de la pantalla
            if (star.x < 0) star.x = canvas.width;
            if (star.x > canvas.width) star.x = 0;
            if (star.y < 0) star.y = canvas.height;
            if (star.y > canvas.height) star.y = 0;
            
            // Dibujar estrella
            ctx.save();
            ctx.globalAlpha = star.opacity;
            ctx.fillStyle = '#ffd700';
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#ffd700';
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
        
        requestAnimationFrame(animateStars);
    }
    
    animateStars();
}

// Función para crear luciérnagas (optimizado)
function createFireflies() {
    const firefliesContainer = document.querySelector('.fireflies');
    const numFireflies = 5; // Reducido para mejor rendimiento
    
    for (let i = 0; i < numFireflies; i++) {
        const firefly = document.createElement('div');
        firefly.className = 'firefly';
        firefly.style.left = Math.random() * 100 + '%';
        firefly.style.animationDelay = Math.random() * 8 + 's';
        firefly.style.animationDuration = (Math.random() * 4 + 6) + 's';
        firefliesContainer.appendChild(firefly);
    }
}

// Función para crear hadas
function createFairies() {
    const numFairies = 3;
    
    for (let i = 0; i < numFairies; i++) {
        const fairy = document.createElement('div');
        fairy.className = 'fairy';
        fairy.style.left = Math.random() * 80 + '%';
        fairy.style.top = Math.random() * 60 + '%';
        fairy.style.animationDelay = Math.random() * 12 + 's';
        fairy.style.animationDuration = (Math.random() * 6 + 10) + 's';
        document.body.appendChild(fairy);
    }
}

// Función para crear duendes
function createGoblins() {
    const numGoblins = 4;
    
    for (let i = 0; i < numGoblins; i++) {
        const goblin = document.createElement('div');
        goblin.className = 'goblin';
        goblin.style.left = Math.random() * 70 + '%';
        goblin.style.bottom = Math.random() * 30 + '%';
        goblin.style.animationDelay = Math.random() * 6 + 's';
        goblin.style.animationDuration = (Math.random() * 3 + 5) + 's';
        document.body.appendChild(goblin);
    }
}

// Función para crear partículas mágicas
function createMagicParticles() {
    const numParticles = 20;
    
    for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div');
        particle.className = 'magic-particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.animationDuration = (Math.random() * 5 + 8) + 's';
        document.body.appendChild(particle);
    }
}

// Función para crear efectos de brillos
function createSparkles() {
    const numSparkles = 25;
    
    for (let i = 0; i < numSparkles; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        sparkle.style.animationDelay = Math.random() * 4 + 's';
        sparkle.style.animationDuration = (Math.random() * 2 + 3) + 's';
        document.body.appendChild(sparkle);
    }
}

// Efectos de mouse (optimizado)
function addMouseEffects() {
    let mouseX = 0;
    let mouseY = 0;
    let lastTime = 0;
    
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Crear partículas que siguen el mouse (reducido)
        const now = Date.now();
        if (now - lastTime > 200 && Math.random() < 0.1) { // Solo cada 200ms
            createMouseParticle(mouseX, mouseY);
            lastTime = now;
        }
    });
    
    // Crear partícula en la posición del mouse
    function createMouseParticle(x, y) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.background = 'radial-gradient(circle, #ffd700, #ff6b9d)';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '1000';
        particle.style.boxShadow = '0 0 10px #ffd700';
        
        document.body.appendChild(particle);
        
        // Animar partícula
        let opacity = 1;
        let scale = 1;
        const animate = () => {
            opacity -= 0.02;
            scale += 0.02;
            particle.style.opacity = opacity;
            particle.style.transform = `scale(${scale})`;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        };
        
        animate();
    }
}

// Efectos adicionales para hacer el bosque más mágico
function addMagicalEffects() {
    // Crear lluvia de estrellas ocasional
    setInterval(() => {
        if (Math.random() < 0.3) {
            createShootingStar();
        }
    }, 8000);
}


// Función para crear estrellas fugaces
function createShootingStar() {
    const star = document.createElement('div');
    star.innerHTML = '✨';
    star.style.position = 'fixed';
    star.style.fontSize = '20px';
    star.style.zIndex = '6';
    star.style.pointerEvents = 'none';
    star.style.left = '-50px';
    star.style.top = Math.random() * 50 + '%';
    
    document.body.appendChild(star);
    
    // Animar estrella fugaz
    let x = -50;
    let y = parseFloat(star.style.top);
    const animate = () => {
        x += 3;
        y += 0.5;
        star.style.left = x + 'px';
        star.style.top = y + '%';
        
        if (x < window.innerWidth + 50) {
            requestAnimationFrame(animate);
        } else {
            star.remove();
        }
    };
    
    animate();
}

// Inicializar efectos mágicos adicionales
addMagicalEffects();

// Efecto de parallax suave para el scroll (deshabilitado para mejor rendimiento)
// window.addEventListener('scroll', function() {
//     const scrolled = window.pageYOffset;
//     const parallax = document.querySelector('.bg');
//     const speed = scrolled * 0.5;
//     
//     if (parallax) {
//         parallax.style.transform = `translateY(${speed}px)`;
//     }
// });

// Efectos de sonido visual (sin audio real)
function addVisualSoundEffects() {
    // Crear ondas de sonido visuales cuando se hace clic
    document.addEventListener('click', function(e) {
        createSoundWave(e.clientX, e.clientY);
    });
}

// Función para crear ondas de sonido visuales
function createSoundWave(x, y) {
    const wave = document.createElement('div');
    wave.style.position = 'fixed';
    wave.style.left = x + 'px';
    wave.style.top = y + 'px';
    wave.style.width = '10px';
    wave.style.height = '10px';
    wave.style.border = '2px solid #ffd700';
    wave.style.borderRadius = '50%';
    wave.style.transform = 'translate(-50%, -50%)';
    wave.style.zIndex = '1000';
    wave.style.pointerEvents = 'none';
    
    document.body.appendChild(wave);
    
    // Animar onda
    let size = 10;
    let opacity = 1;
    const animate = () => {
        size += 5;
        opacity -= 0.05;
        wave.style.width = size + 'px';
        wave.style.height = size + 'px';
        wave.style.opacity = opacity;
        
        if (opacity > 0) {
            requestAnimationFrame(animate);
        } else {
            wave.remove();
        }
    };
    
    animate();
}

// Función para crear hojas cayendo (optimizado)
function createFallingLeaves() {
    const leavesContainer = document.querySelector('.falling-leaves');
    const numLeaves = 8; // Reducido para mejor rendimiento
    
    for (let i = 0; i < numLeaves; i++) {
        const leaf = document.createElement('div');
        leaf.className = 'leaf';
        leaf.style.left = Math.random() * 100 + '%';
        leaf.style.animationDelay = Math.random() * 8 + 's';
        leaf.style.animationDuration = (Math.random() * 4 + 8) + 's';
        leavesContainer.appendChild(leaf);
    }
}

// Función para crear efecto bokeh
function createBokehEffect() {
    const bokehContainer = document.querySelector('.bokeh-container');
    const numBubbles = 4; // Muy reducido para evitar acumulación
    
    for (let i = 0; i < numBubbles; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bokeh-bubble';
        
        // Tamaño muy pequeño para efecto shimmer
        const size = Math.random() * 8 + 4; // Entre 4-12px
        bubble.style.width = size + 'px';
        bubble.style.height = size + 'px';
        
        // Posición inicial aleatoria
        bubble.style.left = Math.random() * 100 + '%';
        
        // Delay muy largo para evitar acumulación
        bubble.style.animationDelay = (Math.random() * 40 + 20) + 's'; // Entre 20-60 segundos
        
        // Duración más corta para que desaparezcan más rápido
        const duration = Math.random() * 3 + 12; // Entre 12-15 segundos
        bubble.style.animationDuration = duration + 's';
        
        bokehContainer.appendChild(bubble);
    }
}

// Inicializar efectos de sonido visual
addVisualSoundEffects();
