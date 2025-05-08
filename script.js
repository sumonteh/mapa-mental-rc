const canvas = document.getElementById('lines');
const ctx = canvas.getContext('2d');
const nodos = document.querySelectorAll('.nodo');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const conexiones = [];
nodos.forEach(n => {
  const hijos = n.dataset.child?.split(',') || [];
  hijos.forEach(h => conexiones.push([n.dataset.id, h]));
});

function getPos(id) {
  const el = document.querySelector(`.nodo[data-id="${id}"]`);
  return {
    x: el.offsetLeft + el.offsetWidth / 2,
    y: el.offsetTop + el.offsetHeight / 2
  };
}

function dibujarLineas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#aaa";
  ctx.lineWidth = 2;
  conexiones.forEach(([a, b]) => {
    const p1 = getPos(a);
    const p2 = getPos(b);
    if (
      document.querySelector(`.nodo[data-id="${a}"]`).style.display !== 'none' &&
      document.querySelector(`.nodo[data-id="${b}"]`).style.display !== 'none'
    ) {
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
  });
}

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  dibujarLineas();
});

nodos.forEach(nodo => {
  let offsetX, offsetY;
  let isTouch = false;

  const mover = e => {
    const clientX = isTouch ? e.touches[0].clientX : e.clientX;
    const clientY = isTouch ? e.touches[0].clientY : e.clientY;
    nodo.style.left = `${clientX - offsetX}px`;
    nodo.style.top = `${clientY - offsetY}px`;
    dibujarLineas();
  };

  const detener = () => {
    document.removeEventListener('mousemove', mover);
    document.removeEventListener('touchmove', mover);
  };

  nodo.addEventListener('mousedown', e => {
    isTouch = false;
    offsetX = e.clientX - nodo.offsetLeft;
    offsetY = e.clientY - nodo.offsetTop;
    document.addEventListener('mousemove', mover);
    document.addEventListener('mouseup', detener, { once: true });
  });

  nodo.addEventListener('touchstart', e => {
    isTouch = true;
    offsetX = e.touches[0].clientX - nodo.offsetLeft;
    offsetY = e.touches[0].clientY - nodo.offsetTop;
    document.addEventListener('touchmove', mover);
    document.addEventListener('touchend', detener, { once: true });
  });

  const mostrarHijos = () => {
    const hijos = nodo.dataset.child?.split(',') || [];
    hijos.forEach(id => {
      const hijo = document.querySelector(`.nodo[data-id="${id}"]`);
      if (hijo) hijo.style.display = 'block';
    });
    dibujarLineas();
  };

  nodo.addEventListener('dblclick', mostrarHijos);      // PC
  nodo.addEventListener('touchend', e => {              // Móviles
    e.preventDefault();
    mostrarHijos();
  });
});
