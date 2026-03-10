/**
 * atualizarDOM.js — Atualização de resultados no DOM
 * AzulejoCalc v1.3.4
 *
 * Cada função recebe os dados calculados e escreve
 * nos elementos corretos do HTML. Nenhuma lógica de
 * cálculo fica aqui — só formatação e injeção de HTML.
 */

import { fNum, fBRL } from '../relatorio/formatar.js';
import { estado } from './estado.js';

/**
 * Atualiza o painel principal de resultados (área, peças, caixas, custo).
 */
function atualizarResultado({ area, perAmb, comp, larg, perda, semPerda, comPerda, caixas, box, custo, preco }) {
  document.getElementById('dimBottom').textContent = comp.toFixed(2) + ' m';
  document.getElementById('dimSide').textContent = larg.toFixed(2) + ' m';

  document.getElementById('rArea').innerHTML = fNum(area, 2) + '<span class="result-unit">m²</span>';

  if (estado.ambientesCount > 1) {
    document.getElementById('rAreaSub').textContent = perAmb.map(a => fNum(a, 2)).join(' + ') + ' m²';
  } else {
    document.getElementById('rAreaSub').textContent = `${comp.toFixed(2)} × ${larg.toFixed(2)}`;
  }

  document.getElementById('rSem').innerHTML = fNum(semPerda) + '<span class="result-unit">un.</span>';
  document.getElementById('rCom').innerHTML = fNum(comPerda) + '<span class="result-unit">un.</span>';
  document.getElementById('rComSub').textContent = `+${perda}% de segurança`;

  document.getElementById('rCx').innerHTML = caixas + '<span class="result-unit">cx.</span>';
  document.getElementById('rCxSub').textContent = `~${fNum(box, 2)} m²/cx`;

  const blockCusto = document.getElementById('blockCusto');
  if (custo !== null) {
    blockCusto.style.display = 'block';
    const el = document.getElementById('rCusto');
    const novo = fBRL(custo);
    if (el.textContent !== novo) {
      el.textContent = novo;
      el.style.animation = 'none';
      void el.offsetWidth;
      el.style.animation = 'numFlash 0.3s ease';
    }
    document.getElementById('rCustoSub').textContent = `${fBRL(preco)}/cx × ${caixas} cx`;
  } else {
    blockCusto.style.display = 'none';
  }
}

/**
 * Atualiza o subtotal e área combinada dos Ambientes extras.
 */
function atualizarAmb2({ area, perAmb }) {
  const totalRow = document.getElementById('areaTotalRow');
  if (estado.ambientesCount > 1) {
    totalRow.style.display = 'flex';
    document.getElementById('areaTotalVal').textContent = fNum(area, 2) + ' m²';

    // Update individual subtotals if elements exist
    for (let i = 2; i <= 4; i++) {
      const el = document.getElementById(`areaSub${i}`);
      if (el) {
        el.textContent = i <= estado.ambientesCount
          ? `Área ${i}: ${fNum(perAmb[i - 1], 2)} m²`
          : '';
      }
    }
  } else {
    totalRow.style.display = 'none';
  }
}

/**
 * Atualiza os previews do botão ×2.
 */
function atualizarX2Previews() {
  ['comp', 'larg', 'comp2', 'larg2', 'comp3', 'larg3', 'comp4', 'larg4'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const prev = document.getElementById(id + '-preview');
    if (!prev) return;
    const val = parseFloat(el.value) || 0;
    prev.textContent = val === 0
      ? '= —'
      : '= ' + (+(val * 2).toFixed(2)).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  });
}

/**
 * Atualiza o painel de Argamassa.
 */
function atualizarArgamassa({ totalKg, sacosAuto, sacos, modoSacos, custo, area, precoSaco }) {
  document.getElementById('argConsumo').innerHTML =
    fNum(totalKg, 1) + '<span class="arg-unit">kg</span>';
  document.getElementById('argConsumoSub').textContent =
    `${estado.argConsumoKgM2} kg/m² × ${fNum(area, 2)} m²`;

  document.getElementById('argSacos').innerHTML =
    sacos + '<span class="arg-unit">sacos</span>';
  document.getElementById('argSacosSub').textContent = modoSacos === 'manual'
    ? `inserido manualmente · auto: ${sacosAuto}`
    : `sacos de ${estado.argSacoKg} kg`;

  if (custo !== null) {
    document.getElementById('argCusto').textContent = fBRL(custo);
    document.getElementById('argCustoSub').textContent = `${fBRL(precoSaco)}/saco × ${sacos} sacos`;
  } else {
    document.getElementById('argCusto').textContent = '—';
    document.getElementById('argCustoSub').textContent = 'informe o preço';
  }
}

/**
 * Atualiza o painel de Mão de Obra.
 */
function atualizarMaoDeObra({ valorM2, fixo, total, obs, temCusto, area, taxaM2 }) {
  document.getElementById('maoResultM2').innerHTML =
    taxaM2 > 0 ? fBRL(valorM2) : '—<span class="mao-unit">R$</span>';
  document.getElementById('maoResultM2Sub').textContent =
    taxaM2 > 0 ? `${fBRL(taxaM2)}/m² × ${fNum(area, 2)} m²` : 'informe o valor por m²';

  document.getElementById('maoResultFixo').innerHTML =
    fixo > 0 ? fBRL(fixo) : '—<span class="mao-unit">R$</span>';
  document.getElementById('maoResultFixoSub').textContent =
    fixo > 0 ? 'valor fixo adicional' : 'informe o valor fixo';

  document.getElementById('maoResultTotal').textContent = temCusto ? fBRL(total) : '—';
  document.getElementById('maoResultObs').textContent = obs || '';
}

/**
 * Atualiza a barra de Custo Total (azulejos + argamassa + mão de obra).
 */
function atualizarCustoTotal() {
  const parseVal = str => {
    const n = parseFloat(str.replace(/[R$\s.]/g, '').replace(',', '.'));
    return isNaN(n) ? null : n;
  };

  const valAz = document.getElementById('blockCusto').style.display !== 'none'
    ? parseVal(document.getElementById('rCusto').textContent.trim()) : null;

  const argTxt = document.getElementById('argCusto').textContent.trim();
  const valArg = argTxt !== '—' ? parseVal(argTxt) : null;

  const maoTxt = document.getElementById('maoResultTotal').textContent.trim();
  const valMao = maoTxt !== '—' ? parseVal(maoTxt) : null;

  const ctMao = document.getElementById('ctMaoObra');
  document.getElementById('ctAzulejos').textContent = valAz !== null ? fBRL(valAz) : '—';
  document.getElementById('ctArgamassa').textContent = valArg !== null ? fBRL(valArg) : '—';
  if (ctMao) ctMao.textContent = valMao !== null ? fBRL(valMao) : '—';

  const total = (valAz || 0) + (valArg || 0) + (valMao || 0);
  document.getElementById('ctTotal').textContent =
    (valAz !== null || valArg !== null || valMao !== null) ? fBRL(total) : '—';
}

/**
 * Atualiza o terminal com o HTML do relatório.
 */
function atualizarTerminal(htmlLinhas) {
  document.getElementById('terminal').innerHTML = htmlLinhas;
}

export {
  atualizarResultado,
  atualizarAmb2,
  atualizarX2Previews,
  atualizarArgamassa,
  atualizarMaoDeObra,
  atualizarCustoTotal,
  atualizarTerminal,
};

