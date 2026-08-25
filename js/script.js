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
const stackSection = document.querySelector(".stack-section");

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

const seletorTextosAnimados = [
  ".info-text",
  ".contact-title",
  ".contact-username",
  ".title",
  ".about-list li",
  ".github-project-name",
  ".github-project-meta",
  ".github-project-description",
  ".github-project-tag",
  ".github-projects-status",
  ".brand-container",
  ".footer-text",
  ".footer-elements"
].join(",");

const inicioAnimacoesTexto = performance.now();
const delayInicialTextos = 200;
const seletorSublinhadosAnimados = ".info-link, .github-calendar-summary a, .footer-section a";

function revelarTexto(elemento) {
  const tempoRestante = Math.max(0, delayInicialTextos - (performance.now() - inicioAnimacoesTexto));

  window.setTimeout(() => {
    elemento.classList.add("texto-visivel");
  }, tempoRestante);
}

function revelarSublinhado(link) {
  const palavrasDoLink = [
    ...(link.matches(".scroll-word") ? [link] : []),
    ...link.querySelectorAll(".scroll-word")
  ].filter((palavra) => getComputedStyle(palavra).display !== "none");
  const indicesPalavras = palavrasDoLink
    .map((palavra) => Number(palavra.style.getPropertyValue("--word-index")) || 0);
  const ultimoIndice = indicesPalavras.length > 0 ? Math.max(...indicesPalavras) : -1;
  const fimDaAnimacaoTexto = ultimoIndice >= 0 ? (ultimoIndice * 40) + 450 : 120;
  const delayInicialRestante = Math.max(0, delayInicialTextos - (performance.now() - inicioAnimacoesTexto));

  window.setTimeout(() => {
    link.classList.add("sublinhado-visivel");
  }, delayInicialRestante + fimDaAnimacaoTexto);
}

const observadorTextos = "IntersectionObserver" in window
  ? new IntersectionObserver((entradas, observador) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;

        revelarTexto(entrada.target);
        observador.unobserve(entrada.target);
      });
    }, {
      threshold: 0.05,
      rootMargin: "0px 0px 2% 0px"
    })
  : null;

const observadorSublinhados = "IntersectionObserver" in window
  ? new IntersectionObserver((entradas, observador) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;

        revelarSublinhado(entrada.target);
        observador.unobserve(entrada.target);
      });
    }, {
      threshold: 0.05,
      rootMargin: "0px 0px 2% 0px"
    })
  : null;

function ajustarTruncamentoEmail(link) {
  const segmentos = [...link.querySelectorAll(".email-segment")];
  const reticencias = link.querySelector(".email-ellipsis");
  const container = link.parentElement;

  if (!reticencias || !container) return;

  link.classList.remove("email-truncated");
  link.style.width = "";
  segmentos.forEach((segmento) => segmento.classList.remove("email-segment-hidden"));

  const estiloContainer = getComputedStyle(container);
  const larguraDisponivel = container.clientWidth
    - parseFloat(estiloContainer.paddingLeft)
    - parseFloat(estiloContainer.paddingRight);
  const larguraCompleta = segmentos.reduce((total, segmento) => total + segmento.offsetWidth, 0);

  if (larguraCompleta <= larguraDisponivel) return;

  link.classList.add("email-truncated");

  const larguraReticencias = reticencias.offsetWidth;
  const limiteSegmentos = Math.max(0, larguraDisponivel - larguraReticencias);
  let larguraUsada = 0;
  let ultimoIndiceVisivel = -1;
  let limiteAtingido = false;

  segmentos.forEach((segmento, indice) => {
    const larguraSegmento = segmento.offsetWidth;

    if (!limiteAtingido && larguraUsada + larguraSegmento <= limiteSegmentos) {
      larguraUsada += larguraSegmento;
      ultimoIndiceVisivel = indice;
      return;
    }

    limiteAtingido = true;
    segmento.classList.add("email-segment-hidden");
  });

  reticencias.style.setProperty("--word-index", String(ultimoIndiceVisivel + 1));
  link.style.width = `${Math.min(larguraDisponivel, larguraUsada + larguraReticencias)}px`;
}

function prepararTextoAnimado(elemento) {
  if (
    !(elemento instanceof HTMLElement)
    || elemento.dataset.textoAnimado === "true"
  ) return;

  const linkEmail = elemento.querySelector(".info-email-link");

  if (linkEmail) {
    const partesEmail = ["willian", ".", "alves", ".", "nascimento", "2008", "@", "gmail", ".", "com"];
    const fragmentoEmail = document.createDocumentFragment();

    partesEmail.forEach((parte, indice) => {
      const segmento = document.createElement("span");
      segmento.className = "scroll-word email-segment";
      segmento.style.setProperty("--word-index", String(indice));
      segmento.textContent = parte;
      fragmentoEmail.appendChild(segmento);
    });

    const reticencias = document.createElement("span");
    reticencias.className = "scroll-word email-ellipsis";
    reticencias.style.setProperty("--word-index", String(partesEmail.length));
    reticencias.textContent = "...";
    fragmentoEmail.appendChild(reticencias);

    linkEmail.replaceChildren(fragmentoEmail);
    ajustarTruncamentoEmail(linkEmail);
    window.addEventListener("resize", () => ajustarTruncamentoEmail(linkEmail));
    document.fonts?.ready.then(() => ajustarTruncamentoEmail(linkEmail));
    elemento.dataset.textoAnimado = "true";
    elemento.classList.add("texto-animado");

    if (observadorTextos) {
      observadorTextos.observe(elemento);
    } else {
      revelarTexto(elemento);
    }

    return;
  }

  const nosDeTexto = [];
  const caminhador = document.createTreeWalker(elemento, NodeFilter.SHOW_TEXT, {
    acceptNode(no) {
      if (!no.textContent.trim()) return NodeFilter.FILTER_REJECT;

      const pai = no.parentElement;
      if (!pai || pai.closest(".bio-text, time, [aria-hidden='true'], .scroll-word")) {
        return NodeFilter.FILTER_REJECT;
      }

      return NodeFilter.FILTER_ACCEPT;
    }
  });

  while (caminhador.nextNode()) nosDeTexto.push(caminhador.currentNode);
  if (nosDeTexto.length === 0) return;

  elemento.dataset.textoAnimado = "true";
  elemento.classList.add("texto-animado");

  let indicePalavra = 0;

  nosDeTexto.forEach((no) => {
    const fragmento = document.createDocumentFragment();

    no.textContent.split(/(\s+)/).forEach((parte) => {
      if (!parte) return;

      if (/^\s+$/.test(parte)) {
        fragmento.appendChild(document.createTextNode(parte));
        return;
      }

      const palavra = document.createElement("span");
      palavra.className = "scroll-word";
      palavra.style.setProperty("--word-index", String(indicePalavra));
      palavra.textContent = parte;
      fragmento.appendChild(palavra);
      indicePalavra += 1;
    });

    no.replaceWith(fragmento);
  });

  if (observadorTextos) {
    observadorTextos.observe(elemento);
  } else {
    revelarTexto(elemento);
  }
}

function prepararTextosAnimados(raiz = document) {
  if (raiz instanceof HTMLElement && raiz.matches(seletorTextosAnimados)) {
    prepararTextoAnimado(raiz);
  }

  raiz.querySelectorAll?.(seletorTextosAnimados).forEach(prepararTextoAnimado);
}

function prepararSublinhadosAnimados(raiz = document) {
  raiz.querySelectorAll?.(seletorSublinhadosAnimados).forEach((link) => {
    if (link.classList.contains("sublinhado-animado")) return;

    link.classList.add("sublinhado-animado");

    if (observadorSublinhados) {
      observadorSublinhados.observe(link);
    } else {
      revelarSublinhado(link);
    }
  });
}

function prepararAnimacaoStack() {
  if (!stackSection) return;

  const logos = stackSection.querySelectorAll(".stack-logo");
  logos.forEach((logo, indice) => {
    logo.style.setProperty("--stack-delay", `${indice * 65}ms`);
  });

  stackSection.classList.add("stack-animada");

  if (!("IntersectionObserver" in window)) {
    stackSection.classList.add("stack-visivel");
    return;
  }

  const observadorStack = new IntersectionObserver((entradas, observador) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;

      entrada.target.classList.add("stack-visivel");
      observador.unobserve(entrada.target);
    });
  }, {
    threshold: 0.05,
    rootMargin: "0px 0px 2% 0px"
  });

  observadorStack.observe(stackSection);
}

function atualizarHorarioBrasilia() {
  if (!horarioBrasilia) return;

  const agora = new Date();
  horarioBrasilia.textContent = formatadorHorarioBrasilia.format(agora);
  horarioBrasilia.dateTime = agora.toISOString();
}

function obterMinutosHorarioBrasilia(data) {
  const partes = formatadorHorarioBrasilia.formatToParts(data);
  const hora = Number(partes.find((parte) => parte.type === "hour")?.value || 0) % 24;
  const minuto = Number(partes.find((parte) => parte.type === "minute")?.value || 0);

  return (hora * 60) + minuto;
}

function formatarTotalMinutos(totalMinutos) {
  const hora = Math.floor(totalMinutos / 60) % 24;
  const minuto = totalMinutos % 60;

  return `${String(hora).padStart(2, "0")}:${String(minuto).padStart(2, "0")}`;
}

function animarHorarioBrasilia() {
  if (!horarioBrasilia) return;

  const agora = new Date();
  const minutosAlvo = obterMinutosHorarioBrasilia(agora);
  const duracao = 1800;

  horarioBrasilia.textContent = "00:00";
  horarioBrasilia.dateTime = agora.toISOString();

  window.setTimeout(() => {
    const inicio = performance.now();

    function atualizarContagem(instante) {
      const progresso = Math.min((instante - inicio) / duracao, 1);
      const progressoSuave = 1 - Math.pow(1 - progresso, 3);
      const minutosAtuais = Math.floor(minutosAlvo * progressoSuave);

      horarioBrasilia.textContent = formatarTotalMinutos(minutosAtuais);

      if (progresso < 1) {
        requestAnimationFrame(atualizarContagem);
        return;
      }

      atualizarHorarioBrasilia();
      setInterval(atualizarHorarioBrasilia, 1000);
    }

    requestAnimationFrame(atualizarContagem);
  }, delayInicialTextos);
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
  } catch {}
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
  prepararTextoAnimado(githubProjectsCount);
  prepararTextosAnimados(githubProjectsList);
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
    prepararTextoAnimado(status);
  }
}

aplicarTema(document.documentElement.dataset.theme);
prepararTextosAnimados();
prepararSublinhadosAnimados();
prepararAnimacaoStack();
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
animarHorarioBrasilia();

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
