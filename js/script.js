const btnTopo = document.getElementById("btnTopo");
const logoHeader = document.querySelector(".logo-header");
const topSection = document.querySelector(".top-section");
const header = document.querySelector("header");
const bioText = document.querySelector(".bio-text");
const horarioBrasilia = document.getElementById("horario-brasilia");

const titulosBio = [
  "Desenvolvedor Fullstack",
  "Desenvolvedor Frontend",
  "Desenvolvedor Backend",
  "Desenvolvedor Mobile"
];

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
