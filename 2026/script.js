// Piezas de grafiti sobre el afiche amarillo.
document.addEventListener('DOMContentLoaded', function () {
  montarTitulo();
  const reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reducir) estelaAerosol();
  const capa = document.querySelector('.graffiti-stickers');
  if (!capa) return;

  montarStickers(capa, reducir);
  if (!reducir) sprayAlClick();
});

const ARCHIVOS = [
  'Asterisco celeste.png',
  'Asterisco violeta.png',
  'Asterisco amarillo.png',
  'Cruz celeste.png',
  'Cruz violeta.png',
  'Cruz amarrilla.png',
  'Estrella celeste.png',
  'Estrella violeta.png',
  'Estrella amarilla.png',
  'Linea celeste.png',
  'Línea viooleta.png',
  'Línea amarilla.png'
];

// Repartidas en los bordes para no tapar la línea de tiempo.
const PUESTOS = [
  { archivo: 6, top: '8%', left: '-3%', size: 230, rot: -16, dx: 18, dy: -30, spin: 14, dur: 15 },
  { archivo: 7, top: '4%', left: '78%', size: 200, rot: 12, dx: -16, dy: 22, spin: -18, dur: 17, gira: true },
  { archivo: 0, top: '28%', left: '-6%', size: 150, rot: 20, dx: 22, dy: -18, spin: 20, dur: 13 },
  { archivo: 1, top: '36%', left: '86%', size: 170, rot: -24, dx: -14, dy: 20, spin: -12, dur: 18 },
  { archivo: 3, top: '58%', left: '-4%', size: 190, rot: 8, dx: 12, dy: -26, spin: 16, dur: 16 },
  { archivo: 4, top: '62%', left: '82%', size: 210, rot: -10, dx: -20, dy: -14, spin: 22, dur: 19, gira: true },
  { archivo: 2, top: '78%', left: '4%', size: 160, rot: 28, dx: 16, dy: -20, spin: -14, dur: 14 },
  { archivo: 8, top: '84%', left: '70%', size: 180, rot: -18, dx: -10, dy: -24, spin: 10, dur: 20 },
  { archivo: 5, top: '16%', left: '42%', size: 110, rot: 15, dx: 8, dy: -12, spin: 24, dur: 11 },
  { archivo: 9, top: '46%', left: '-2%', size: 280, rot: -8, dx: 10, dy: 8, spin: 6, dur: 18 },
  { archivo: 10, top: '70%', left: '86%', size: 260, rot: 12, dx: -12, dy: -10, spin: -8, dur: 16 },
  { archivo: 11, top: '18%', left: '88%', size: 240, rot: -18, dx: -8, dy: 12, spin: 8, dur: 19 }
];

function montarStickers(capa, reducir) {
  const urls = new Map();

  Promise.all(ARCHIVOS.map(nombre => prepararPieza('elementos/' + encodeURIComponent(nombre))
    .then(url => urls.set(nombre, url))
    .catch(() => urls.set(nombre, 'elementos/' + encodeURIComponent(nombre)))))
    .then(() => {
      PUESTOS.forEach((puesto, i) => {
        const img = document.createElement('img');
        img.className = 'sticker' + (puesto.gira && !reducir ? ' gira' : '');
        img.alt = '';
        img.src = urls.get(ARCHIVOS[puesto.archivo]);
        img.style.top = puesto.top;
        img.style.left = puesto.left;
        img.style.setProperty('--size', puesto.size + 'px');
        img.style.setProperty('--rot', puesto.rot + 'deg');
        img.style.setProperty('--dx', puesto.dx + 'px');
        img.style.setProperty('--dy', puesto.dy + 'px');
        img.style.setProperty('--spin', puesto.spin + 'deg');
        img.style.setProperty('--dur', puesto.dur + 's');
        img.style.setProperty('--delay', (-i * 0.7) + 's');
        capa.appendChild(img);
      });
    });
}

function montarTitulo() {
  document.querySelectorAll('.title-logo').forEach(img => {
    const src = img.getAttribute('src');
    prepararPieza(src, true).then(url => {
      img.onload = () => img.classList.add('listo');
      img.src = url;
    }).catch(function () {
      img.classList.add('listo');
    });
  });
}

function prepararPieza(src, esTitulo) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        resolve(esTitulo ? quitarFondoTitulo(img) : quitarFondoNegro(img));
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = reject;
    img.src = src;
  });
}

// El PNG trae el aerosol sobre negro. El negro pasa a transparente.
function quitarFondoNegro(img) {
  const maxLado = 720;
  const escala = Math.min(1, maxLado / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.max(1, Math.round(img.naturalWidth * escala));
  const h = Math.max(1, Math.round(img.naturalHeight * escala));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, w, h);
  const frame = ctx.getImageData(0, 0, w, h);
  const px = frame.data;

  for (let i = 0; i < px.length; i += 4) {
    const max = Math.max(px[i], px[i + 1], px[i + 2]);
    const alpha = max < 26 ? 0 : Math.min(255, Math.round((max - 16) * 1.45));
    px[i + 3] = alpha;
    if (alpha > 0 && max > 0) {
      const boost = Math.min(1.7, 255 / max);
      px[i] = Math.min(255, px[i] * boost);
      px[i + 1] = Math.min(255, px[i + 1] * boost);
      px[i + 2] = Math.min(255, px[i + 2] * boost);
    }
  }

  ctx.putImageData(frame, 0, 0);
  return canvas.toDataURL('image/png');
}

// El violeta del nombre es oscuro: si se mide solo por brillo, desaparece.
function quitarFondoTitulo(img) {
  const maxLado = 1200;
  const escala = Math.min(1, maxLado / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.max(1, Math.round(img.naturalWidth * escala));
  const h = Math.max(1, Math.round(img.naturalHeight * escala));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, w, h);
  const frame = ctx.getImageData(0, 0, w, h);
  const px = frame.data;

  for (let i = 0; i < px.length; i += 4) {
    const max = Math.max(px[i], px[i + 1], px[i + 2]);
    const min = Math.min(px[i], px[i + 1], px[i + 2]);
    const sat = max === 0 ? 0 : (max - min) / max;
    if (max < 14) px[i + 3] = 0;
    else if (sat > 0.4) px[i + 3] = Math.min(255, Math.round(max * 5.4));
    else px[i + 3] = max < 32 ? 0 : Math.min(255, Math.round((max - 24) * 8));
  }

  ctx.putImageData(frame, 0, 0);
  return canvas.toDataURL('image/png');
}

function estelaAerosol() {
  if (window.matchMedia('(hover: none)').matches) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'estela-aerosol';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  const colores = ['#2C002C', '#2C002C', '#007A77', '#007A77', '#F3F300'];
  const gotas = [];
  let ancho = 0;
  let alto = 0;
  let ultimo = null;

  function medir() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    ancho = window.innerWidth;
    alto = window.innerHeight;
    canvas.width = Math.round(ancho * dpr);
    canvas.height = Math.round(alto * dpr);
    canvas.style.width = ancho + 'px';
    canvas.style.height = alto + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function salpicar(x, y) {
    const cantidad = 2 + (Math.random() < 0.35 ? 1 : 0);
    for (let i = 0; i < cantidad; i++) {
      const ang = Math.random() * Math.PI * 2;
      const radio = 6 + Math.random() * 16;
      gotas.push({
        x: x + Math.cos(ang) * radio,
        y: y + Math.sin(ang) * radio,
        r: 1.2 + Math.random() * 1.6,
        color: colores[(Math.random() * colores.length) | 0],
        life: 0.55 + Math.random() * 0.25
      });
    }
    if (gotas.length > 240) gotas.splice(0, gotas.length - 240);
  }

  medir();
  window.addEventListener('resize', medir);
  window.addEventListener('pointermove', function (e) {
    if (e.pointerType === 'touch') return;
    if (ultimo) {
      const dx = e.clientX - ultimo.x;
      const dy = e.clientY - ultimo.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 36) return;
      const pasos = Math.min(3, Math.max(1, Math.floor(dist / 48)));
      for (let s = 1; s <= pasos; s++) {
        salpicar(ultimo.x + dx * (s / pasos), ultimo.y + dy * (s / pasos));
      }
    }
    ultimo = { x: e.clientX, y: e.clientY };
  });

  function cuadro() {
    if (gotas.length) {
      ctx.clearRect(0, 0, ancho, alto);
      for (let i = gotas.length - 1; i >= 0; i--) {
        const g = gotas[i];
        g.life -= 0.012;
        if (g.life <= 0) {
          gotas.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = g.life * 0.72;
        ctx.fillStyle = g.color;
        ctx.beginPath();
        ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    requestAnimationFrame(cuadro);
  }
  requestAnimationFrame(cuadro);
}

function sprayAlClick() {
  const colores = ['#2C002C', '#007A77', '#F3F300'];
  document.addEventListener('click', (e) => {
    for (let i = 0; i < 7; i++) {
      const punto = document.createElement('span');
      punto.className = 'spray-pop';
      punto.style.left = e.clientX + 'px';
      punto.style.top = e.clientY + 'px';
      punto.style.background = colores[i % colores.length];
      const ang = Math.random() * Math.PI * 2;
      const dist = 18 + Math.random() * 36;
      punto.style.setProperty('--sx', Math.cos(ang) * dist + 'px');
      punto.style.setProperty('--sy', Math.sin(ang) * dist + 'px');
      document.body.appendChild(punto);
      punto.addEventListener('animationend', () => punto.remove());
    }
  });
}
