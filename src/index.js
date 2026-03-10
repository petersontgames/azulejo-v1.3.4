/**
 * index.js — Ponto de entrada e orquestrador principal
 * AzulejoCalc v1.3.4
 *
 * ─── Estrutura de módulos ──────────────────────────────────────────
 *
 *  src/
 *  ├── config/
 *  │   └── defaults.js          constantes, tamanhos, tipos argamassa
 *  │
 *  ├── calc/
 *  │   ├── area.js              calcularArea, calcularAreaTotal
 *  │   └── azulejo.js           calcularAreaAzulejo, calcularSemPerda, aplicarPerda
 *  │
 *  ├── caixas/
 *  │   └── calcularCaixas.js    estimarM2PorCaixa, calcularCaixas, calcularCustoAzulejo
 *  │
 *  ├── argamassa/
 *  │   └── calcularArgamassa.js calcularArgamassa
 *  │
 *  ├── maoDeObra/
 *  │   └── calcularMaoDeObra.js calcularMaoDeObra
 *  │
 *  ├── canvas/
 *  │   └── drawRoom.js          drawRoom (renderização do canvas)
 *  │
 *  ├── relatorio/
 *  │   ├── formatar.js          fNum, fBRL
 *  │   └── gerarRelatorio.js    gerarRelatorio (saída em texto)
 *  │
 *  └── ui/
 *      ├── estado.js            estado global reativo
 *      ├── lerInputs.js         leitura dos campos do DOM
 *      ├── atualizarDOM.js      escrita de resultados no DOM
 *      ├── eventos.js           registro de event listeners
 *      └── changelog.js         CHANGELOG, renderChangelog, toggleChangelog
 *
 * ──────────────────────────────────────────────────────────────────
 */

// ── Módulos de cálculo ─────────────────────────────────────────────
import { calcularAreaTotal } from './calc/area.js';
import { calcularAreaAzulejo, calcularSemPerda, aplicarPerda } from './calc/azulejo.js';
import { calcularCaixas, calcularCustoAzulejo } from './caixas/calcularCaixas.js';
import { calcularArgamassa } from './argamassa/calcularArgamassa.js';
import { calcularMaoDeObra } from './maoDeObra/calcularMaoDeObra.js';

// ── Canvas ─────────────────────────────────────────────────────────
import { drawRoom } from './canvas/drawRoom.js';

// ── Relatório ──────────────────────────────────────────────────────
import { gerarRelatorio } from './relatorio/gerarRelatorio.js';
import { fNum, fBRL } from './relatorio/formatar.js';

// ── UI ─────────────────────────────────────────────────────────────
import { estado } from './ui/estado.js';
import { lerMedidas, lerPerda, lerPreco, lerCxM2, lerArgamassa, lerMaoDeObra } from './ui/lerInputs.js';
import {
  atualizarResultado, atualizarAmb2, atualizarX2Previews,
  atualizarArgamassa as uiAtualizarArgamassa, atualizarMaoDeObra as uiAtualizarMaoDeObra, atualizarCustoTotal,
  atualizarTerminal,
} from './ui/atualizarDOM.js';
import { registrarEventos } from './ui/eventos.js';


// ─────────────────────────────────────────────────────────────────
// RECALC PRINCIPAL
// ─────────────────────────────────────────────────────────────────

function recalc() {
  const medidas = lerMedidas();
  const loss = lerPerda();
  const price = lerPreco();
  const boxM2 = lerCxM2();

  const { area, perAmb } = calcularAreaTotal(medidas, estado.ambientesCount);

  const tileArea = calcularAreaAzulejo(estado.tileW, estado.tileH);
  const qtyBase = calcularSemPerda(area, tileArea);
  const qtyTotal = aplicarPerda(qtyBase, loss);
  const { caixas, box, modo: boxModo } = calcularCaixas(qtyTotal, tileArea, estado.tileW, boxM2);
  const cost = calcularCustoAzulejo(caixas, price);

  atualizarAmb2({ area, perAmb });
  atualizarResultado({
    area, perAmb, comp: medidas.comp1, larg: medidas.larg1,
    perda: loss, semPerda: qtyBase, comPerda: qtyTotal, caixas, box, custo: cost, preco: price
  });
  atualizarX2Previews();

  drawRoom({
    comp: medidas.comp1, larg: medidas.larg1,
    tileW: estado.tileW,
    tileH: estado.tileH,
    modo: estado.modo,
    pisoFilled: estado.modo === 'piso' &&
      document.getElementById('comp').value.trim() !== '' &&
      document.getElementById('larg').value.trim() !== '',
  });

  sincronizarRelatorio();

  recalcArgamassa();
  recalcMaoObra();
}

/**
 * Atualiza o sistema de relatório (terminal e estado para PDF)
 * Centraliza a lógica para evitar que dados fiquem defasados.
 */
function sincronizarRelatorio() {
  const medidas = lerMedidas();
  const { area, perAmb } = calcularAreaTotal(medidas, estado.ambientesCount);
  const loss = parseFloat(document.getElementById('perda').value) || 0;
  const price = parseFloat(document.getElementById('preco').value) || 0;
  const tileArea = calcularAreaAzulejo(estado.tileW, estado.tileH);
  const qtyBase = calcularSemPerda(area, tileArea);
  const qtyTotal = aplicarPerda(qtyBase, loss);
  const boxM2 = parseFloat(document.getElementById('cxM2').value) || 0;
  const { caixas, box, modo: boxModo } = calcularCaixas(qtyTotal, tileArea, estado.tileW, boxM2);
  const cost = calcularCustoAzulejo(caixas, price);

  const { precoSaco, qtdManual } = lerArgamassa();
  const resArg = calcularArgamassa(area, estado.argConsumoKgM2, estado.argSacoKg, precoSaco, qtdManual);

  const { taxaM2, fixo, obs } = lerMaoDeObra();
  const resMao = calcularMaoDeObra(area, taxaM2, fixo, obs);

  const rel = gerarRelatorio({
    modo: estado.modo,
    ...medidas,
    perAmb,
    tileW: estado.tileW,
    tileH: estado.tileH,
    perda: loss,
    preco: price,
    area,
    azul: tileArea,
    semPerda: qtyBase,
    comPerda: qtyTotal,
    caixas,
    box,
    boxModo,
    argamassa: { ...resArg, pesoSaco: estado.argSacoKg, precoSaco, consumoKgM2: estado.argConsumoKgM2 },
    maoDeObra: { ...resMao, taxaM2, valorM2: resMao.valorM2 },
    custo: cost
  });

  estado.ultimoRelatorio = rel;
  atualizarTerminal(rel.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;'));
}

function recalcArgamassa() {
  const medidas = lerMedidas();
  const { area } = calcularAreaTotal(medidas, estado.ambientesCount);
  const { precoSaco, qtdManual } = lerArgamassa();

  const resultado = calcularArgamassa(
    area, estado.argConsumoKgM2, estado.argSacoKg, precoSaco, qtdManual
  );

  uiAtualizarArgamassa({ ...resultado, area, precoSaco });
  atualizarCustoTotal();
  sincronizarRelatorio();
}

function recalcMaoObra() {
  const medidas = lerMedidas();
  const { area } = calcularAreaTotal(medidas, estado.ambientesCount);
  const { taxaM2, fixo, obs } = lerMaoDeObra();

  const resultado = calcularMaoDeObra(area, taxaM2, fixo, obs);
  uiAtualizarMaoDeObra({ ...resultado, area, taxaM2 });
  atualizarCustoTotal();
  sincronizarRelatorio();
}

function addAmbiente() {
  if (estado.ambientesCount >= 4) return;
  estado.ambientesCount++;
  document.getElementById(`amb${estado.ambientesCount}Block`).style.display = 'block';
  document.getElementById('remAmbBtn').style.display = 'flex';
  if (estado.ambientesCount === 4) {
    document.getElementById('addAmbBtn').style.display = 'none';
  }
  recalc();
}

function remAmbiente() {
  if (estado.ambientesCount <= 1) return;
  document.getElementById(`amb${estado.ambientesCount}Block`).style.display = 'none';
  document.getElementById(`comp${estado.ambientesCount}`).value = '';
  document.getElementById(`larg${estado.ambientesCount}`).value = '';
  estado.ambientesCount--;
  document.getElementById('addAmbBtn').style.display = 'flex';
  if (estado.ambientesCount === 1) {
    document.getElementById('remAmbBtn').style.display = 'none';
  }
  recalc();
}

// ─────────────────────────────────────────────────────────────────
// HANDLERS DE UI
// ─────────────────────────────────────────────────────────────────

function setMode(mode) {
  estado.modo = mode;
  document.body.className = 'mode-' + mode;

  document.getElementById('btnAzulejo').classList.toggle('active', mode === 'azulejo');
  document.getElementById('btnPiso').classList.toggle('active', mode === 'piso');

  const isAzulejo = mode === 'azulejo';
  document.getElementById('mainTitle').innerHTML = isAzulejo
    ? 'AZULEJO<span class="sep">/</span><span class="highlight">CALC</span>'
    : 'PISO<span class="sep">/</span><span class="highlight">CALC</span>';
  document.title = isAzulejo ? 'AzulejoCalc' : 'PisoCalc';

  document.getElementById('panelTitleCanvas').textContent =
    `// Visualização do ${isAzulejo ? 'revestimento' : 'piso'} em tempo real`;

  document.getElementById('comp').value = '';
  document.getElementById('larg').value = '';


  recalc();
}

function toggleAmb2() {
  estado.amb2Active = !estado.amb2Active;
  const block = document.getElementById('amb2Block');
  const btn = document.getElementById('ambToggleBtn');
  const icon = document.getElementById('ambToggleIcon');
  const totalRow = document.getElementById('areaTotalRow');

  block.style.display = estado.amb2Active ? 'block' : 'none';
  totalRow.style.display = estado.amb2Active ? 'flex' : 'none';
  btn.classList.toggle('active', estado.amb2Active);
  icon.textContent = estado.amb2Active ? '－' : '＋';
  btn.childNodes[1].textContent = estado.amb2Active ? ' Remover ambiente 2' : ' Adicionar ambiente 2';

  if (!estado.amb2Active) {
    document.getElementById('comp2').value = '';
    document.getElementById('larg2').value = '';
  }
  recalc();
}

function doubleValue(id) {
  const input = document.getElementById(id);
  const val = parseFloat(input.value) || 0;
  input.value = +(val * 2).toFixed(2);

  const btn = input.parentElement.querySelector('.x2-btn');
  if (btn) {
    btn.classList.remove('pulsing');
    void btn.offsetWidth;
    btn.classList.add('pulsing');
    setTimeout(() => btn.classList.remove('pulsing'), 400);
  }

  recalc();
}

function clearCxM2() {
  document.getElementById('cxM2').value = '';
  document.getElementById('cxM2ClearBtn').style.display = 'none';
  document.getElementById('cxM2Hint').textContent = 'deixe vazio para calcular automaticamente pelo tamanho';
  recalc();
}

function clearArgManual() {
  document.getElementById('argQtdManual').value = '';
  document.getElementById('argManualBadge').style.display = 'none';
  document.getElementById('argClearBtn').style.display = 'none';
  recalcArgamassa();
}

function limparTudo() {
  const isAzulejo = estado.modo === 'azulejo';
  document.getElementById('comp').value = isAzulejo ? '5.05' : '';
  document.getElementById('larg').value = isAzulejo ? '3.85' : '';

  // Clear all extra environments
  for (let i = 2; i <= 4; i++) {
    document.getElementById(`comp${i}`).value = '';
    document.getElementById(`larg${i}`).value = '';
    document.getElementById(`amb${i}Block`).style.display = 'none';
  }
  estado.ambientesCount = 1;
  document.getElementById('addAmbBtn').style.display = 'flex';
  document.getElementById('remAmbBtn').style.display = 'none';

  document.getElementById('perda').value = '0';
  document.getElementById('perdaDisplay').textContent = '0%';
  document.getElementById('preco').value = '';

  document.querySelectorAll('.tile-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('.tile-btn[data-w="20"]').classList.add('active');
  estado.tileW = 20;
  estado.tileH = 20;
  document.getElementById('cw').value = '';
  document.getElementById('ch').value = '';
  clearCxM2();

  document.getElementById('precoArgamassa').value = '';
  clearArgManual();
  document.querySelectorAll('.arg-tipo-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('.arg-tipo-btn[data-consumo="4.5"]').classList.add('active');
  estado.argConsumoKgM2 = 4.5;

  document.querySelectorAll('.arg-saco-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('.arg-saco-btn[data-kg="20"]').classList.add('active');
  estado.argSacoKg = 20;

  document.getElementById('maoM2').value = '';
  document.getElementById('maoFixo').value = '';
  document.getElementById('maoObs').value = '';

  recalc();
}

function gerarPDF() {
  const relText = estado.ultimoRelatorio || 'Nenhum dado calculado';
  const dataStr = new Date().toLocaleString('pt-BR');

  // Janela de impressão profissional
  const win = window.open('', '_blank');
  win.document.write(`
    <!DOCTYPE html>
    <html>
        <head>
            <title>Relatório Técnico - AzulejoCalc</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');
                
                body { 
                  background: #f8fafc; 
                  margin: 0; 
                  padding: 40px; 
                  display: flex; 
                  flex-direction: column; 
                  align-items: center;
                  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                }
                
                .btn-container { 
                  margin-bottom: 30px; 
                  text-align: center; 
                  background: white;
                  padding: 15px 30px;
                  border-radius: 12px;
                  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
                  border: 1px solid #e2e8f0;
                }
                
                .btn { 
                  background: #0ea5e9; 
                  color: white; 
                  border: none; 
                  padding: 12px 28px; 
                  border-radius: 8px; 
                  cursor: pointer; 
                  font-weight: 700; 
                  font-size: 16px;
                  box-shadow: 0 10px 15px -3px rgba(14, 165, 233, 0.3);
                  transition: transform 0.1s;
                }
                .btn:active { transform: scale(0.98); }
                
                .report-card {
                  background: white;
                  width: 100%;
                  max-width: 800px;
                  padding: 50px;
                  border-radius: 4px;
                  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
                  border: 1px solid #e2e8f0;
                  position: relative;
                }
                
                .header {
                  border-bottom: 2px solid #0ea5e9;
                  padding-bottom: 20px;
                  margin-bottom: 30px;
                }
                
                h1 { margin: 0; color: #0f172a; font-size: 28px; }
                .sub { color: #64748b; font-size: 14px; margin-top: 5px; }
                
                pre { 
                  font-family: 'JetBrains Mono', monospace; 
                  white-space: pre-wrap; 
                  line-height: 1.6; 
                  font-size: 13px; 
                  color: #1e293b;
                  background: #f1f5f9;
                  padding: 25px;
                  border-radius: 8px;
                  border: 1px solid #e2e8f0;
                }
                
                .footer {
                  margin-top: 40px;
                  text-align: center;
                  font-size: 11px;
                  color: #94a3b8;
                  border-top: 1px solid #f1f5f9;
                  padding-top: 20px;
                }

                @media print {
                    .no-print { display: none !important; }
                    body { background: white; padding: 0; }
                    .report-card { border: none; box-shadow: none; padding: 0; width: 100%; }
                    pre { border: none; background: transparent; padding: 0; font-size: 11pt; }
                }
            </style>
        </head>
        <body>
            <div class="no-print btn-container">
                <button class="btn" onclick="window.print()">🖨️ IMPRIMIR / SALVAR PDF</button>
                <p style="color: #64748b; font-size: 13px; margin: 10px 0 0 0;">
                  Selecione <b>"Salvar como PDF"</b> no destino para baixar o arquivo.
                </p>
            </div>
            
            <div class="report-card">
                <div class="header">
                    <h1>AZULEJOCALC v1.3.4</h1>
                    <div class="sub">Relatório de Cálculo de Revestimento • ${dataStr}</div>
                </div>
                
                <pre>${relText}</pre>
                
                <div class="footer">
                    Documento gerado eletronicamente por AzulejoCalc. Arredondamentos de segurança aplicados.
                </div>
            </div>

            <script>
                // Abre o diálogo de impressão após o carregamento
                window.onload = () => {
                    setTimeout(() => { 
                      if(!/Android|iPhone|iPad/i.test(navigator.userAgent)) {
                        window.print(); 
                      }
                    }, 800);
                };
            </script>
        </body>
    </html>
  `);
  win.document.close();
}

// ─────────────────────────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────────────────────────

document.body.className = 'mode-azulejo';

registrarEventos({
  recalc,
  recalcArgamassa,
  recalcMaoObra,
  setMode,
  addAmbiente,
  remAmbiente,
  doubleValue,
  limparTudo,
  clearCxM2,
  clearArgManual,
  gerarPDF,
});

recalc();
