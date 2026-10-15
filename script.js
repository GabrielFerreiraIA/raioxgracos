const causeData = {
  referral: {
    title: 'A indicação é um ativo — não o problema.',
    body: 'O risco está em depender dela como quase única fonte de novos clientes. A Gracos solicita indicações, mas ainda não mede nem conduz esse canal de ponta a ponta.',
    fact: 'Fato citado na reunião: cerca de 90% dos clientes chegam por indicação.',
  },
  control: {
    title: 'Sem cadência ativa, a empresa controla a entrega — não a chegada.',
    body: 'As grandes oportunidades aparecem, mas o volume, o perfil e o momento não são conduzidos pela Gracos. Isso dificulta previsão, prioridade e planejamento comercial.',
    fact: 'Fernando resumiu o modelo atual de forma objetiva: hoje há praticamente um canal de aquisição.',
  },
  founder: {
    title: 'A confiança está forte, mas ainda muito concentrada.',
    body: 'Fernando continua envolvido em relações comerciais-chave porque o seguro exige confiança. O próximo passo é formar alguém dentro da técnica e da cultura antes de transferir essas relações.',
    fact: 'O cuidado é legítimo: uma delegação precipitada pode comprometer clientes estratégicos.',
  },
  growth: {
    title: 'A capacidade existe. A repetição comercial ainda não.',
    body: 'A Gracos tem estrutura para atender contas maiores, mas ainda não há um processo ativo e repetível para criar, amadurecer e converter essas oportunidades em sequência.',
    fact: 'Oportunidade central: aumentar a velocidade sem reduzir a qualidade do atendimento.',
  },
};

const leverData = {
  channels: {
    number: '01',
    title: 'Do canal único a uma arquitetura de aquisição.',
    body: 'Manter a indicação como ativo central, mas torná-la mensurável e acompanhá-la com prospecção direcionada a contas que valorizem especialização, pós-venda e capacidade técnica.',
    items: ['Mapear de onde cada oportunidade chega.', 'Escolher segmentos e contas prioritárias.', 'Criar uma cadência de relacionamento B2B.', 'Preservar a confiança em cada abordagem.'],
  },
  team: {
    number: '02',
    title: 'Separar atendimento, renovação e aquisição.',
    body: 'O time atual opera renovações e demandas recebidas. A nova camada precisa ter dono, rotina e remuneração coerente sem desorganizar o que já funciona.',
    items: ['Definir o papel comercial antes de contratar.', 'Criar regras claras de comissão e carteira.', 'Proteger a capacidade operacional existente.', 'Treinar cultura, técnica e relacionamento.'],
  },
  metrics: {
    number: '03',
    title: 'Trocar sensação por visibilidade do funil.',
    body: 'A previsibilidade começa quando a empresa mede volume, origem, estágio, ciclo, conversão, ticket e potencial por canal e por segmento.',
    items: ['Oportunidades qualificadas por mês.', 'Taxa de avanço entre etapas.', 'Tempo médio até fechamento.', 'Receita e margem por canal e carteira.'],
  },
  leadership: {
    number: '04',
    title: 'Tirar Fernando do centro sem tirar Fernando da estratégia.',
    body: 'A confiança do fundador continua sendo um ativo. O objetivo é concentrá-la onde ela gera mais valor: grandes relações, direção e decisões — não em cada tarefa operacional.',
    items: ['Delegar por nível de risco e maturidade.', 'Formar liderança dentro da cultura.', 'Criar rituais curtos de acompanhamento.', 'Reservar a agenda do fundador para alavancas.'],
  },
};

const causeDetail = document.querySelector('#causeDetail');
const causeButtons = [...document.querySelectorAll('[data-cause]')];

causeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const data = causeData[button.dataset.cause];
    if (!data) return;
    causeButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-selected', String(active));
    });
    causeDetail.innerHTML = `<span>LEITURA</span><h3>${data.title}</h3><p>${data.body}</p><div class="fact-tag">${data.fact}</div>`;
  });
});

const leverContent = document.querySelector('#leverContent');
const leverButtons = [...document.querySelectorAll('[data-lever]')];

leverButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const data = leverData[button.dataset.lever];
    if (!data) return;
    leverButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-selected', String(active));
    });
    leverContent.innerHTML = `
      <div><span class="lever-number">${data.number}</span><h3>${data.title}</h3><p>${data.body}</p></div>
      <ul>${data.items.map((item) => `<li>${item}</li>`).join('')}</ul>
    `;
  });
});

const opportunities = document.querySelector('#opportunities');
const conversion = document.querySelector('#conversion');
const opportunitiesValue = document.querySelector('#opportunitiesValue');
const conversionValue = document.querySelector('#conversionValue');
const monthlyWins = document.querySelector('#monthlyWins');
const annualWins = document.querySelector('#annualWins');

function updateSimulation() {
  const volume = Number(opportunities.value);
  const rate = Number(conversion.value) / 100;
  const monthly = volume * rate;
  opportunitiesValue.textContent = String(volume);
  conversionValue.textContent = `${conversion.value}%`;
  monthlyWins.textContent = monthly.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  annualWins.textContent = Math.round(monthly * 12).toLocaleString('pt-BR');
}

opportunities?.addEventListener('input', updateSimulation);
conversion?.addEventListener('input', updateSimulation);
updateSimulation();

const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  reveals.forEach((item) => observer.observe(item));
} else {
  reveals.forEach((item) => item.classList.add('is-visible'));
}

document.querySelector('#printPage')?.addEventListener('click', () => window.print());
