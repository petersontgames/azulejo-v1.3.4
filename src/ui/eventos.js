/**
 * eventos.js — Registro de todos os event listeners da UI
 * AzulejoCalc v1.3.4
 *
 * Centraliza os addEventListener para que o index.js fique limpo.
 * Chama recalc() ou funções específicas conforme o campo alterado.
 */

import { estado } from './estado.js';
import { toggleChangelog } from './changelog.js';

/**
 * Registra todos os eventos da aplicação.
 * @param {{ recalc, recalcArgamassa, recalcMaoObra, setMode, toggleAmb2, doubleValue, limparTudo, clearCxM2, clearArgManual }} handlers
 */
function registrarEventos(handlers) {
  const { recalc, recalcArgamassa, recalcMaoObra,
    setMode, toggleAmb2, doubleValue,
    limparTudo, clearCxM2, clearArgManual } = handlers;

  // ── Modo ────────────────────────────────────────────────────────
  document.getElementById('btnAzulejo').addEventListener('click', () => setMode('azulejo'));
  document.getElementById('btnPiso').addEventListener('click', () => setMode('piso'));

  // ── Dimensões ───────────────────────────────────────────────────
  ['comp', 'larg', 'preco'].forEach(id =>
    document.getElementById(id).addEventListener('input', recalc)
  );
  ['comp2', 'larg2', 'comp3', 'larg3', 'comp4', 'larg4'].forEach(id =>
    document.getElementById(id).addEventListener('input', recalc)
  );

  // ── Slider de perda ─────────────────────────────────────────────
  document.getElementById('perda').addEventListener('input', e => {
    document.getElementById('perdaDisplay').textContent = e.target.value + '%';
    recalc();
  });

  // ── Tamanhos padrão ─────────────────────────────────────────────
  document.getElementById('tileGrid').querySelectorAll('.tile-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tile-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      estado.tileW = +btn.dataset.w;
      estado.tileH = +btn.dataset.h;
      document.getElementById('cw').value = '';
      document.getElementById('ch').value = '';
      recalc();
    });
  });

  // ── Tamanho personalizado ────────────────────────────────────────
  ['cw', 'ch'].forEach(id => {
    document.getElementById(id).addEventListener('input', () => {
      const cw = +document.getElementById('cw').value;
      const ch = +document.getElementById('ch').value;
      if (cw > 0 && ch > 0) {
        document.querySelectorAll('.tile-btn').forEach(b => b.classList.remove('active'));
        estado.tileW = cw;
        estado.tileH = ch;
        recalc();
      }
    });
  });

  // ── Metragem manual da caixa ─────────────────────────────────────
  document.getElementById('cxM2').addEventListener('input', () => {
    const val = parseFloat(document.getElementById('cxM2').value) || 0;
    const hasVal = val > 0;
    document.getElementById('cxM2ClearBtn').style.display = hasVal ? 'flex' : 'none';
    document.getElementById('cxM2Hint').textContent = hasVal
      ? `usando ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} m²/cx (manual)`
      : 'deixe vazio para calcular automaticamente pelo tamanho';
    recalc();
  });
  document.getElementById('cxM2ClearBtn').addEventListener('click', clearCxM2);

  // ── Ambientes ───────────────────────────────────────────────────
  document.getElementById('addAmbBtn').addEventListener('click', () => handlers.addAmbiente());
  document.getElementById('remAmbBtn').addEventListener('click', () => handlers.remAmbiente());

  // ── ×2 buttons ───────────────────────────────────────────────────
  document.querySelectorAll('[data-x2-target]').forEach(btn => {
    btn.addEventListener('click', () => doubleValue(btn.dataset.x2Target));
  });

  // ── Argamassa: tipo ──────────────────────────────────────────────
  document.getElementById('argTipos').querySelectorAll('.arg-tipo-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.arg-tipo-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      estado.argConsumoKgM2 = parseFloat(btn.dataset.consumo);
      recalcArgamassa();
    });
  });

  // ── Argamassa: peso do saco ──────────────────────────────────────
  document.getElementById('argSacoOpts').querySelectorAll('.arg-saco-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.arg-saco-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      estado.argSacoKg = parseFloat(btn.dataset.kg);
      recalcArgamassa();
    });
  });

  // ── Argamassa: preço e manual ────────────────────────────────────
  document.getElementById('precoArgamassa').addEventListener('input', recalcArgamassa);
  document.getElementById('argQtdManual').addEventListener('input', () => {
    const val = document.getElementById('argQtdManual').value.trim();
    const isManual = val !== '' && parseInt(val) > 0;
    document.getElementById('argManualBadge').style.display = isManual ? 'inline' : 'none';
    document.getElementById('argClearBtn').style.display = isManual ? 'flex' : 'none';
    recalcArgamassa();
  });
  document.getElementById('argClearBtn').addEventListener('click', clearArgManual);

  // ── Mão de obra ──────────────────────────────────────────────────
  ['maoM2', 'maoFixo', 'maoObs'].forEach(id =>
    document.getElementById(id).addEventListener('input', recalcMaoObra)
  );

  // ── Changelog ────────────────────────────────────────────────────
  const clBtn = document.getElementById('versionBadge');
  if (clBtn) clBtn.addEventListener('click', toggleChangelog);
  const clOverlay = document.getElementById('clOverlay');
  if (clOverlay) clOverlay.addEventListener('click', toggleChangelog);

  // ── Limpar e PDF ────────────────────────────────────────────────
  const limparBtn = document.getElementById('btnLimpar');
  if (limparBtn) limparBtn.addEventListener('click', limparTudo);
  const pdfBtn = document.getElementById('btnPDF');
  if (pdfBtn) pdfBtn.addEventListener('click', () => handlers.gerarPDF());
}

export { registrarEventos };
