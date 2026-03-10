# AzulejoCalc v1.3.4 — Estrutura JavaScript modular

Calculadora de azulejos e piso separada em módulos independentes.

## Estrutura de pastas

```
src/
├── index.js                    ← ponto de entrada e orquestrador
│
├── config/
│   └── defaults.js             constantes, tamanhos padrão, tipos de argamassa
│
├── calc/
│   ├── area.js                 calcularArea, calcularAreaTotal
│   └── azulejo.js              calcularAreaAzulejo, calcularSemPerda, aplicarPerda
│
├── caixas/
│   └── calcularCaixas.js       estimarM2PorCaixa, calcularCaixas, calcularCustoAzulejo
│
├── argamassa/
│   └── calcularArgamassa.js    calcularArgamassa (AC-I / AC-II / AC-III)
│
├── maoDeObra/
│   └── calcularMaoDeObra.js    calcularMaoDeObra (R$/m² + fixo + obs)
│
├── canvas/
│   └── drawRoom.js             renderização do canvas (azulejo e piso)
│
├── relatorio/
│   ├── formatar.js             fNum, fBRL (formatação pt-BR)
│   └── gerarRelatorio.js       saída completa em texto (terminal / Node)
│
└── ui/
    ├── estado.js               estado global reativo (modo, tileW/H, amb2, arg)
    ├── lerInputs.js            leitura centralizada dos campos do DOM
    ├── atualizarDOM.js         escrita de resultados no DOM
    ├── eventos.js              registro de todos os event listeners
    └── changelog.js            CHANGELOG + renderChangelog + toggleChangelog
```

## Responsabilidades por módulo

| Módulo | Responsabilidade |
|---|---|
| `config/defaults.js` | Constantes estáticas — nunca muda em runtime |
| `calc/area.js` | Fórmulas de área — sem DOM, sem estado |
| `calc/azulejo.js` | Quantidade de peças — sem DOM, sem estado |
| `caixas/calcularCaixas.js` | Conversão peças → caixas — sem DOM |
| `argamassa/calcularArgamassa.js` | Consumo e custo de argamassa — sem DOM |
| `maoDeObra/calcularMaoDeObra.js` | Custo de mão de obra — sem DOM |
| `canvas/drawRoom.js` | Renderização visual — só acessa `document.getElementById('roomCanvas')` |
| `relatorio/formatar.js` | Formatação numérica pt-BR — pura |
| `relatorio/gerarRelatorio.js` | Relatório em texto — usa formatar, sem DOM |
| `ui/estado.js` | Variáveis de estado compartilhadas entre módulos UI |
| `ui/lerInputs.js` | Lê inputs do DOM — única entrada de dados da UI |
| `ui/atualizarDOM.js` | Escreve no DOM — única saída de dados para a UI |
| `ui/eventos.js` | Conecta o DOM aos handlers — sem lógica de negócio |
| `ui/changelog.js` | Dados e renderização do painel de versões |
| `src/index.js` | Orquestra tudo: lê → calcula → atualiza |

## Fluxo de dados

```
DOM (input)
  └─→ ui/lerInputs.js      lê os valores
        └─→ calc/*.js       calcula
              └─→ ui/atualizarDOM.js  escreve os resultados
                    └─→ DOM (output)
```
