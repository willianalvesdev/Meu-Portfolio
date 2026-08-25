const btnTopo = document.getElementById("btnTopo");
const logoHeader = document.querySelector(".logo-header");
const topSection = document.querySelector(".top-section");
const header = document.querySelector("header");
const bioText = document.querySelector(".bio-text");
const horarioBrasilia = document.getElementById("horario-brasilia");
const themeToggle = document.getElementById("themeToggle");
const themeColor = document.querySelector('meta[name="theme-color"]');
const audioInterruptor = new Audio("assets/audio/Click.wav");
const githubCalendar = document.getElementById("githubCalendar");
const githubCalendarContent = document.getElementById("githubCalendarContent");
const githubCalendarScroll = document.getElementById("githubCalendarScroll");
const githubMonths = document.getElementById("githubMonths");
const githubGrid = document.getElementById("githubGrid");
const githubContributionTotal = document.getElementById("githubContributionTotal");
const githubProjectsList = document.getElementById("githubProjectsList");
const githubProjectsCount = document.getElementById("githubProjectsCount");

audioInterruptor.preload = "auto";

const titulosBio = [
  "Desenvolvedor Fullstack",
  "Desenvolvedor Frontend",
  "Desenvolvedor Backend",
  "Desenvolvedor Mobile"
];

const mesesGitHub = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const formatadorDataGitHub = new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC"
});
const formatadorMesProjeto = new Intl.DateTimeFormat("pt-BR", {
  month: "2-digit",
  year: "numeric",
  timeZone: "UTC"
});

const formatadorHorarioBrasilia = new Intl.DateTimeFormat("pt-BR", {
  timeZone: "America/Sao_Paulo",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false
});

function atualizarHorarioBrasilia() {
  if (!horarioBrasilia) return;

  const agora = new Date();
  horarioBrasilia.textContent = formatadorHorarioBrasilia.format(agora);
  horarioBrasilia.dateTime = agora.toISOString();
}

function aplicarTema(tema, salvar = false) {
  const temaClaro = tema === "light";

  document.documentElement.dataset.theme = temaClaro ? "light" : "dark";
  themeToggle?.setAttribute("aria-label", temaClaro ? "Ativar tema escuro" : "Ativar tema claro");
  themeToggle?.setAttribute("aria-pressed", String(temaClaro));
  themeColor?.setAttribute("content", temaClaro ? "#f5f5f3" : "#0a0a0a");

  if (!salvar) return;

  try {
    localStorage.setItem("theme", temaClaro ? "light" : "dark");
  } catch {
    // O tema continua funcionando mesmo se o armazenamento estiver indisponível.
  }
}

function tocarSomInterruptor() {
  audioInterruptor.currentTime = 0;
  audioInterruptor.play().catch(() => {});
}

function renderizarContribuicoesGitHub(dados) {
  const anoAtual = new Date().getFullYear();
  const todasAsContribuicoes = dados.contributions;

  if (!Array.isArray(todasAsContribuicoes)) {
    throw new Error("Nenhuma contribuição recebida");
  }

  const contribuicoes = todasAsContribuicoes.filter((dia) => dia.date.startsWith(`${anoAtual}-`));
  if (contribuicoes.length === 0) throw new Error("Nenhuma contribuição recebida");

  const primeiroDia = new Date(`${contribuicoes[0].date}T00:00:00Z`).getUTCDay();
  const diasDoCalendario = [...Array(primeiroDia).fill(null), ...contribuicoes];
  const quantidadeSemanas = Math.ceil(diasDoCalendario.length / 7);
  const fragmentoDias = document.createDocumentFragment();
  const fragmentoMeses = document.createDocumentFragment();

  diasDoCalendario.forEach((contribuicao) => {
    const dia = document.createElement("span");
    dia.className = "contribution-day";
    dia.setAttribute("aria-hidden", "true");

    if (!contribuicao) {
      dia.style.visibility = "hidden";
    } else {
      const data = new Date(`${contribuicao.date}T00:00:00Z`);
      const plural = contribuicao.count === 1 ? "contribuição" : "contribuições";

      dia.dataset.level = String(contribuicao.level);
      dia.title = `${contribuicao.count} ${plural} em ${formatadorDataGitHub.format(data)}`;
    }

    fragmentoDias.appendChild(dia);
  });

  let ultimoMes = -1;
  let ultimaSemanaRotulada = -1;

  contribuicoes.forEach((contribuicao, indice) => {
    const data = new Date(`${contribuicao.date}T00:00:00Z`);
    const mes = data.getUTCMonth();
    const semana = Math.floor((indice + primeiroDia) / 7) + 1;

    if (mes === ultimoMes || semana === ultimaSemanaRotulada) return;

    const rotulo = document.createElement("span");
    rotulo.className = "github-month-label";
    rotulo.style.gridColumn = String(semana);
    rotulo.textContent = mesesGitHub[mes];
    fragmentoMeses.appendChild(rotulo);

    ultimoMes = mes;
    ultimaSemanaRotulada = semana;
  });

  githubCalendarContent.style.setProperty("--github-weeks", String(quantidadeSemanas));
  githubGrid.replaceChildren(fragmentoDias);
  githubMonths.replaceChildren(fragmentoMeses);

  const total = contribuicoes.reduce((soma, dia) => soma + dia.count, 0);
  const pluralTotal = total === 1 ? "contribuição" : "contribuições";

  githubContributionTotal.textContent = `${total.toLocaleString("pt-BR")} ${pluralTotal} em ${anoAtual} no `;
  githubGrid.setAttribute("aria-label", `${total} ${pluralTotal} no GitHub em ${anoAtual}`);

  requestAnimationFrame(() => {
    githubCalendarScroll.scrollLeft = githubCalendarScroll.scrollWidth;
  });
}

async function carregarContribuicoesGitHub() {
  if (!githubCalendar) return;

  const usuario = githubCalendar.dataset.username;
  const url = `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(usuario)}?y=last`;

  try {
    const resposta = await fetch(url, { headers: { Accept: "application/json" } });
    if (!resposta.ok) throw new Error(`GitHub API: ${resposta.status}`);

    renderizarContribuicoesGitHub(await resposta.json());
  } catch {
    githubContributionTotal.textContent = "Não foi possível carregar as contribuições. Veja o perfil no ";
    githubGrid.setAttribute("aria-label", "Calendário de contribuições indisponível");
  }
}

function criarTagProjeto(texto) {
  const tag = document.createElement("span");
  tag.className = "github-project-tag";
  tag.textContent = texto;
  return tag;
}

function criarProjetoGitHub(repositorio, indice) {
  const projeto = document.createElement("article");
  const linha = document.createElement("div");
  const icone = document.createElement("div");
  const imagemCodigo = document.createElement("img");
  const informacoes = document.createElement("div");
  const nome = document.createElement("p");
  const metadados = document.createElement("p");
  const botao = document.createElement("button");
  const imagemExpandir = document.createElement("img");
  const detalhes = document.createElement("div");
  const conteudoDetalhes = document.createElement("div");
  const interiorDetalhes = document.createElement("div");
  const descricao = document.createElement("p");
  const tags = document.createElement("div");
  const detalhesId = `github-project-details-${repositorio.id}`;
  const abertoInicialmente = indice === 0;

  projeto.className = `github-project${abertoInicialmente ? " aberto" : ""}`;
  linha.className = "github-project-row";
  icone.className = "icon-frame github-project-icon";
  imagemCodigo.className = "info-icon";
  imagemCodigo.src = "assets/Icons/Code.svg";
  imagemCodigo.alt = "";

  informacoes.className = "github-project-info";
  nome.className = "github-project-name";
  nome.textContent = repositorio.name;
  metadados.className = "github-project-meta";

  const criadoEm = formatadorMesProjeto.format(new Date(repositorio.created_at)).replace("/", ".");
  const atualizadoEm = formatadorMesProjeto.format(new Date(repositorio.updated_at)).replace("/", ".");
  metadados.textContent = `Criado em ${criadoEm} • Atualizado em ${atualizadoEm}`;

  botao.className = "github-project-toggle";
  botao.type = "button";
  imagemExpandir.className = "github-project-expand-icon";
  imagemExpandir.src = "assets/Icons/Expand.svg";
  imagemExpandir.alt = "";
  botao.setAttribute("aria-label", `${abertoInicialmente ? "Recolher" : "Expandir"} detalhes de ${repositorio.name}`);
  botao.setAttribute("aria-expanded", String(abertoInicialmente));
  botao.setAttribute("aria-controls", detalhesId);

  detalhes.className = "github-project-details";
  detalhes.id = detalhesId;
  conteudoDetalhes.className = "github-project-details-content";
  interiorDetalhes.className = "github-project-details-inner";
  descricao.className = "github-project-description";
  descricao.textContent = repositorio.description || "Este repositório ainda não possui uma descrição no GitHub.";
  tags.className = "github-project-tags";

  if (repositorio.language) tags.appendChild(criarTagProjeto(repositorio.language));
  const topicos = Array.isArray(repositorio.topics) ? repositorio.topics : [];
  topicos.slice(0, 6).forEach((topico) => tags.appendChild(criarTagProjeto(topico)));
  if (repositorio.archived) tags.appendChild(criarTagProjeto("Arquivado"));

  botao.addEventListener("click", () => {
    const aberto = projeto.classList.toggle("aberto");
    botao.setAttribute("aria-expanded", String(aberto));
    botao.setAttribute("aria-label", `${aberto ? "Recolher" : "Expandir"} detalhes de ${repositorio.name}`);
  });

  icone.appendChild(imagemCodigo);
  informacoes.append(nome, metadados);
  botao.appendChild(imagemExpandir);
  linha.append(icone, informacoes, botao);
  interiorDetalhes.append(descricao, tags);
  conteudoDetalhes.appendChild(interiorDetalhes);
  detalhes.appendChild(conteudoDetalhes);
  projeto.append(linha, detalhes);

  return projeto;
}

function renderizarProjetosGitHub(repositorios) {
  const projetos = repositorios
    .filter((repositorio) => !repositorio.fork)
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

  if (projetos.length === 0) throw new Error("Nenhum projeto público encontrado");

  const fragmento = document.createDocumentFragment();
  projetos.forEach((repositorio, indice) => fragmento.appendChild(criarProjetoGitHub(repositorio, indice)));

  githubProjectsCount.textContent = `(${projetos.length})`;
  githubProjectsList.replaceChildren(fragmento);
  githubProjectsList.setAttribute("aria-busy", "false");
}

async function carregarProjetosGitHub() {
  if (!githubProjectsList) return;

  const usuario = githubProjectsList.dataset.username;
  const url = `https://api.github.com/users/${encodeURIComponent(usuario)}/repos?type=owner&sort=updated&per_page=100`;

  try {
    const resposta = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
    if (!resposta.ok) throw new Error(`GitHub API: ${resposta.status}`);

    renderizarProjetosGitHub(await resposta.json());
  } catch {
    const status = document.createElement("p");
    status.className = "github-projects-status";
    status.textContent = "Não foi possível carregar os projetos agora.";
    githubProjectsList.replaceChildren(status);
    githubProjectsList.setAttribute("aria-busy", "false");
    githubProjectsCount.textContent = "";
  }
}

aplicarTema(document.documentElement.dataset.theme);
carregarContribuicoesGitHub();
carregarProjetosGitHub();

themeToggle?.addEventListener("click", () => {
  const novoTema = document.documentElement.dataset.theme === "light" ? "dark" : "light";

  tocarSomInterruptor();
  aplicarTema(novoTema, true);
});

let ultimoScroll = window.scrollY;
let timerScroll;

function checkLogoHeader() {
  const headerHeight = header.offsetHeight;
  const limite = topSection.offsetTop + topSection.offsetHeight - headerHeight;

  if (window.scrollY >= limite) {
    logoHeader.classList.add("visivel");
  } else {
    logoHeader.classList.remove("visivel");
  }
}

window.addEventListener("scroll", () => {
  const scrollAtual = window.scrollY;

  if (scrollAtual > 300) {
    btnTopo.classList.add("visivel");
  } else {
    btnTopo.classList.remove("visivel");
    btnTopo.classList.remove("opaco");
  }

  const chegouAoFim =
    window.innerHeight + scrollAtual >=
    document.documentElement.scrollHeight - 2;

  const scrollandoParaCima = scrollAtual < ultimoScroll;

  if (scrollAtual > 300) {
    if (chegouAoFim || scrollandoParaCima) {
      btnTopo.classList.add("opaco");
    } else {
      btnTopo.classList.remove("opaco");
    }
  }

  clearTimeout(timerScroll);

  timerScroll = setTimeout(() => {
    const estaNoFim =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 2;

    if (!estaNoFim && window.scrollY > 300) {
      btnTopo.classList.remove("opaco");
    }
  }, 200);

  ultimoScroll = scrollAtual;
  checkLogoHeader();
});

window.addEventListener("resize", checkLogoHeader);

btnTopo.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

checkLogoHeader();
atualizarHorarioBrasilia();
setInterval(atualizarHorarioBrasilia, 1000);

if (bioText && titulosBio.length > 1) {
  let indiceTitulo = 0;

  setInterval(() => {
    indiceTitulo = (indiceTitulo + 1) % titulosBio.length;

    bioText.classList.add("saindo");

    setTimeout(() => {
      bioText.textContent = titulosBio[indiceTitulo];
      bioText.classList.remove("saindo");
      bioText.classList.add("entrando");

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          bioText.classList.remove("entrando");
        });
      });
    }, 350);
  }, 2800);
}
