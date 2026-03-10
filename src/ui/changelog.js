/**
 * changelog.js — Histórico de versões e renderização do painel
 * AzulejoCalc v1.3.4
 */

const CHANGELOG = [
  {
    version: '1.3.4',
    date: '2026-03-07',
    latest: true,
    changes: [
      'Campo de metragem da caixa (m²/cx) no painel de tamanhos',
      'Valor manual sobrescreve o cálculo automático por tamanho',
      'Hint atualiza indicando se está em modo manual ou automático',
      'Botão ✕ limpa o valor manual e volta ao cálculo por tamanho',
      'Campo resetado pelo botão Limpar',
    ],
  },
  {
    version: '1.3.3',
    date: '2026-03-07',
    latest: false,
    changes: [
      'Novo painel de Mão de Obra após argamassa',
      'Campo R$/m² calculado sobre a área total do projeto',
      'Campo de valor fixo adicional (deslocamento, mínimo etc.)',
      'Campo de observação livre (ex: inclui rejunte)',
      'Total de mão de obra incluído no Custo Total Geral',
    ],
  },
  {
    version: '1.3.2',
    date: '2026-03-07',
    latest: false,
    changes: [
      'Botão Limpar no header — reseta todos os campos de uma vez',
      'Restaura valores padrão, fecha ambiente 2, reseta argamassa e tamanho do azulejo',
    ],
  },
  {
    version: '1.3.1',
    date: '2026-03-07',
    latest: false,
    changes: [
      'Campo de quantidade manual de sacos de argamassa',
      'Badge "● manual" aparece quando a quantidade é inserida manualmente',
      'Botão ✕ limpa o valor manual e volta ao cálculo automático',
      'Sub-label mostra o valor automático de referência ao usar modo manual',
    ],
  },
  {
    version: '1.3.0',
    date: '2026-03-07',
    latest: false,
    changes: [
      'Novo painel de Argamassa com tema verde escuro',
      'Seletor de tipo: AC-I (4,5 kg/m²), AC-II (5,5 kg/m²), AC-III (7 kg/m²)',
      'Seletor de peso do saco: 20 kg, 25 kg ou 50 kg',
      'Cálculo automático de consumo total (kg) e sacos necessários',
      'Campo de preço por saco com custo total em R$',
      'Argamassa atualiza junto com as medidas do cômodo',
    ],
  },
  {
    version: '1.2.8',
    date: '2026-03-07',
    latest: false,
    changes: ['Nome do app em português: AZULEJO/CALC e PISO/CALC'],
  },
  {
    version: '1.2.7',
    date: '2026-03-07',
    latest: false,
    changes: [
      'Nome modernizado: TILE/CALC (azulejo) e FLOOR/CALC (piso)',
      'Logotipo geométrico com grid de 4 peças no canto',
      'Tipografia monospace compacta substituindo serif no título',
      'Ícone do logo muda de cor conforme o modo ativo',
    ],
  },
  {
    version: '1.2.6',
    date: '2026-03-07',
    latest: false,
    changes: [
      'Modo Azulejo 🧱: segundo ambiente com comprimento e largura independentes',
      'Botão "＋ Adicionar ambiente 2" expande/recolhe o segundo par de campos',
      'Área dos dois ambientes somada automaticamente no cálculo total',
      'Subtotal do Ambiente 2 exibido em tempo real',
      'Linha de Área total combinada destacada em dourado',
    ],
  },
  {
    version: '1.2.5',
    date: '2026-03-07',
    latest: false,
    changes: [
      'Modo Piso 🪵: peças mudam para Verde Oliva ao preencher as medidas',
      'Campos de medida iniciam vazios ao entrar no modo Piso',
    ],
  },
  {
    version: '1.2.4',
    date: '2026-03-07',
    latest: false,
    changes: [
      'Modo Piso 🪵: visualização preenche toda a tela do canvas (sem bordas)',
      'Peças cortadas no modo Piso renderizam com a cor normal',
    ],
  },
  {
    version: '1.2.3',
    date: '2026-03-07',
    latest: false,
    changes: ['Botão ×2 oculto no modo Piso 🪵'],
  },
  {
    version: '1.2.2',
    date: '2026-03-07',
    latest: false,
    changes: [
      'Percentual de perda inicia em 0% (sem desperdício)',
      'Slider de perda agora vai de 0% a 20%',
    ],
  },
  {
    version: '1.2.1',
    date: '2026-03-07',
    latest: false,
    changes: [
      'Bugfix: percentual de perda agora atualiza corretamente o custo total',
      'Animação de flash no custo total ao mudar qualquer parâmetro',
    ],
  },
  {
    version: '1.2.0',
    date: '2026-03-07',
    latest: false,
    changes: [
      'Botão ×2 em comprimento e largura para dobrar o valor',
      'Preview do valor dobrado exibido antes de clicar',
      'Animação de pulso ao aplicar o ×2',
    ],
  },
  {
    version: '1.1.0',
    date: '2026-03-07',
    latest: false,
    changes: [
      'Toggle modo Azulejo 🧱 / Piso 🪵',
      'Tema visual distinto por modo (azul vs marrom)',
      'Efeito de veios de madeira no canvas (modo Piso)',
    ],
  },
  {
    version: '1.0.0',
    date: '2026-03-07',
    latest: false,
    changes: [
      'Cálculo completo de azulejos por área',
      'Seletor de tamanhos padrão (20×20 até 90×90)',
      'Tamanho personalizado de peça',
      'Slider de percentual de desperdício',
      'Campo precoPorCaixa com custo total em R$',
      'Canvas com visualização do piso em tempo real',
      'Terminal com output idêntico ao node src/index.js',
    ],
  },
];

/** Renderiza o changelog no painel lateral. */
function renderChangelog() {
  const body = document.getElementById('changelogBody');
  if (!body) return;
  body.innerHTML = CHANGELOG.map((entry, i) => `
    <div class="cl-entry" style="animation-delay:${i * 0.05}s">
      <div class="cl-entry-header">
        <span class="cl-version">v${entry.version}</span>
        <span class="cl-date">${entry.date}</span>
        <span class="cl-badge ${entry.latest ? 'latest' : 'stable'}">${entry.latest ? 'latest' : 'stable'}</span>
      </div>
      <ul class="cl-changes">
        ${entry.changes.map(c => `<li>${c}</li>`).join('')}
      </ul>
    </div>
  `).join('');
}

/** Abre/fecha o painel de changelog. */
function toggleChangelog() {
  const popup = document.getElementById('changelogPopup');
  const overlay = document.getElementById('clOverlay');
  if (!popup || !overlay) return;
  const isOpen = popup.classList.contains('open');
  if (!isOpen) renderChangelog();
  popup.classList.toggle('open', !isOpen);
  overlay.classList.toggle('open', !isOpen);
}

export { CHANGELOG, renderChangelog, toggleChangelog };
