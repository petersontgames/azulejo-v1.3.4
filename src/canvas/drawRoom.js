/**
 * drawRoom.js — Renderização do ambiente no canvas (browser)
 * AzulejoCalc v1.3.4
 *
 * Exporta a função drawRoom(params) que desenha o grid de peças
 * no elemento <canvas id="roomCanvas">.
 *
 * Modos suportados:
 *   azulejo — bordas azuis, destaque de cortes em laranja
 *   piso    — sem bordas, grain de madeira, cor muda ao preencher medidas
 */

/**
 * @typedef {Object} DrawParams
 * @property {number}  comp        — comprimento do ambiente (m)
 * @property {number}  larg        — largura do ambiente (m)
 * @property {number}  tileW       — largura da peça (cm)
 * @property {number}  tileH       — altura da peça (cm)
 * @property {string}  modo        — 'azulejo' | 'piso'
 * @property {boolean} pisoFilled  — true quando comp/larg estão preenchidos (modo piso)
 */

/** Paletas de cor por modo */
const PALETA = {
  azulejo: {
    main: '#1E3A5F',
    alt: '#152a40',
    cut: '#3a1a06',
    grout: '#0a1520',
    border: '#2B5EA7',
    accent: '#5B9BD5',
    cutStroke: '#a05020',
  },
  piso_vazio: {
    main: '#4A3520',
    alt: '#3A2A14',
    grout: '#1a0e05',
    border: '#6B4C2A',
    accent: '#C8943A',
  },
  piso_cheio: {
    main: '#4A5A2A',
    alt: '#3A4A1E',
    grout: '#1e2a0e',
    border: '#6B8A30',
    accent: '#A0C040',
  },
};

/**
 * Desenha o ambiente com grid de azulejos/piso no canvas.
 * @param {DrawParams} params
 */
function drawRoom({ comp, larg, tileW, tileH, modo, pisoFilled }) {
  const canvas = document.getElementById('roomCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const isPiso = modo === 'piso';
  const cores = isPiso
    ? (pisoFilled ? PALETA.piso_cheio : PALETA.piso_vazio)
    : PALETA.azulejo;

  // Piso ocupa o canvas inteiro; azulejo tem padding para bordas
  const pad = isPiso ? 0 : 20;
  const rW = W - pad * 2;
  const rH = H - pad * 2;

  // Dimensões de cada peça em pixels
  const px = (tileW / 100) * (rW / comp);
  const py = (tileH / 100) * (rH / larg);

  const numCols = Math.ceil(rW / px) + 1;
  const numRows = Math.ceil(rH / py) + 1;

  // ── Primeira passagem: preencher peças ──
  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols; c++) {
      const x = pad + c * px;
      const y = pad + r * py;
      const x2 = Math.min(x + px, pad + rW);
      const y2 = Math.min(y + py, pad + rH);
      if (x >= pad + rW || y >= pad + rH) continue;

      const isCut = (x + px > pad + rW + 0.5) || (y + py > pad + rH + 0.5);
      const isAlt = (r + c) % 2 === 1;

      // Cor da peça
      if (!isPiso && isCut) ctx.fillStyle = cores.cut;
      else if (isAlt) ctx.fillStyle = cores.alt;
      else ctx.fillStyle = cores.main;
      ctx.fillRect(x, y, x2 - x, y2 - y);

      // Efeito de veios de madeira (só modo piso)
      if (isPiso) {
        ctx.save();
        ctx.globalAlpha = 0.07;
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 0.5;
        for (let g = 0; g < 3; g++) {
          const gx = x + (x2 - x) * (0.2 + g * 0.3);
          ctx.beginPath();
          ctx.moveTo(gx, y);
          ctx.lineTo(gx, y2);
          ctx.stroke();
        }
        ctx.restore();
      }

      // Rejunte
      ctx.strokeStyle = cores.grout;
      ctx.lineWidth = isPiso ? 0.8 : 1;
      ctx.strokeRect(x, y, x2 - x, y2 - y);
    }
  }

  // ── Segunda passagem (azulejo): destaca cortes e bordas ──
  if (!isPiso) {
    for (let r = 0; r < numRows; r++) {
      for (let c = 0; c < numCols; c++) {
        const x = pad + c * px;
        const y = pad + r * py;
        const x2 = Math.min(x + px, pad + rW);
        const y2 = Math.min(y + py, pad + rH);
        if (x >= pad + rW || y >= pad + rH) continue;
        const isCut = (x + px > pad + rW + 0.5) || (y + py > pad + rH + 0.5);
        if (isCut) {
          ctx.strokeStyle = cores.cutStroke;
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, x2 - x, y2 - y);
        }
      }
    }

    // Borda do ambiente
    ctx.strokeStyle = cores.border;
    ctx.lineWidth = 2;
    ctx.strokeRect(pad, pad, rW, rH);

    // Cantoneiras decorativas
    const a = 12;
    ctx.strokeStyle = cores.accent;
    ctx.lineWidth = 1.5;
    [[pad, pad], [pad + rW, pad], [pad, pad + rH], [pad + rW, pad + rH]]
      .forEach(([x, y], i) => {
        const sx = i % 2 === 0 ? 1 : -1;
        const sy = i < 2 ? 1 : -1;
        ctx.beginPath();
        ctx.moveTo(x + sx * a, y);
        ctx.lineTo(x, y);
        ctx.lineTo(x, y + sy * a);
        ctx.stroke();
      });
  }
}

export { drawRoom, PALETA };

