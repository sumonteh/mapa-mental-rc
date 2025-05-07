const canvas = document.getElementById('lines');
const ctx = canvas.getContext('2d');
const nodos = document.querySelectorAll('.nodo');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const conexiones = [
  ['central', 'definicion'], ['central', 'imagenologia'], ['central', 'aplicaciones'],
  ['central', 'rcmi'], ['central', 'futuro'],
  ['definicion', 'rc-definicion1'], ['definicion', 'rc-definicion2'], ['definicion', 'rc-definicion3'],
  ['imagenologia', 'img-cbct'], ['imagenologia', 'img-rm'], ['imagenologia', 'img-opg'],
  ['aplicaciones', 'app-protesis'], ['aplicaciones', 'app-ortodoncia'], ['aplicaciones', 'app-ttm'],
  ['rcmi', 'disc-discrepancia'], ['rcmi', 'disc-sintomas'],
  ['futuro', 'ia-analisis'], ['futuro', 'ia-estandarizacion']
];

function getPos(id) {
  const el = document.querySelector(`.nodo[data-id="${id}"]`);
  return { x: el.offsetLeft + el.offsetWidth / 2, y: el.offsetTop + el.offsetHeight / 2 };
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

dibujarLineas();
window.addEventListener('resize', dibujarLineas);

nodos.forEach(nodo => {
  let offsetX, offsetY;
  const mover = e => {
    nodo.style.left = `${e.clientX - offsetX}px`;
    nodo.style.top = `${e.clientY - offsetY}px`;
    dibujarLineas();
  };

  nodo.addEventListener('mousedown', e => {
    offsetX = e.clientX - nodo.offsetLeft;
    offsetY = e.clientY - nodo.offsetTop;
    document.addEventListener('mousemove', mover);
    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', mover);
    }, { once: true });
  });

  nodo.addEventListener('dblclick', () => {
    const hijos = nodo.dataset.child?.split(',') || [];
    hijos.forEach(id => {
      const hijo = document.querySelector(`.nodo[data-id="${id}"]`);
      if (hijo) hijo.style.display = 'block';
    });
    dibujarLineas();
  });
});
