// Piezas de grafiti sobre el afiche amarillo.
document.addEventListener('DOMContentLoaded', function () {
  const capa = document.querySelector('.graffiti-stickers');
  if (!capa) return;

  const reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  montarStickers(capa, reducir);
  if (!reducir) sprayAlClick();
});

const ARCHIVOS = [
  'Copia de Asterisco celeste.png',
  'Copia de Asterisco violeta.png',
  'Copia de Cruz celeste.png',
  'Copia de Cruz violeta.png',
  'Copia de Estrella celeste.png',
  'Copia de Estrella violeta.png'
];

// Repartidas en los bordes para no tapar la línea de tiempo.
const PUESTOS = [
  { archivo: 4, top: '8%', left: '-3%', size: 230, rot: -16, dx: 18, dy: -30, spin: 14, dur: 15 },
  { archivo: 5, top: '4%', left: '78%', size: 200, rot: 12, dx: -16, dy: 22, spin: -18, dur: 17, gira: true },
  { archivo: 0, top: '28%', left: '-6%', size: 150, rot: 20, dx: 22, dy: -18, spin: 20, dur: 13 },
  { archivo: 1, top: '36%', left: '86%', size: 170, rot: -24, dx: -14, dy: 20, spin: -12, dur: 18 },
  { archivo: 2, top: '58%', left: '-4%', size: 190, rot: 8, dx: 12, dy: -26, spin: 16, dur: 16 },
  { archivo: 3, top: '62%', left: '82%', size: 210, rot: -10, dx: -20, dy: -14, spin: 22, dur: 19, gira: true },
  { archivo: 5, top: '78%', left: '4%', size: 140, rot: 28, dx: 16, dy: -20, spin: -14, dur: 14 },
  { archivo: 0, top: '84%', left: '70%', size: 180, rot: -18, dx: -10, dy: -24, spin: 10, dur: 20 },
  { archivo: 1, top: '16%', left: '42%', size: 90, rot: 15, dx: 8, dy: -12, spin: 24, dur: 11 },
  { archivo: 2, top: '48%', left: '8%', size: 80, rot: -30, dx: 10, dy: 14, spin: -20, dur: 12 },
  { archivo: 4, top: '70%', left: '90%', size: 110, rot: 6, dx: -12, dy: -16, spin: 18, dur: 15 }
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

function prepararPieza(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        resolve(quitarFondoNegro(img));
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

function sprayAlClick() {
  const colores = ['#6d1b86', '#12b5b0', '#1a1020', '#f4e20a'];
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
