const cord = document.createElement("div");
cord.className = "pullcord";
cord.innerHTML = '<svg width="64" height="340" viewBox="0 0 64 340" aria-hidden="true"><path d="M32 0 Q32 88 32 176" fill="none" stroke="gray" stroke-width="1.5"/><circle cx="32" cy="176" r="7" fill="#eee"/></svg><button aria-label="Puxe para trocar o tema" title="Puxe para trocar o tema"></button><span>Puxe a cordinha! ↗</span>';
document.body.append(cord);
cord.querySelector("span").innerHTML = "<span class=\"cord-hint-text\">puxe a<br>cordinha!</span><svg class=\"cord-hint-arrow\" viewBox=\"16 11 59 68\" width=\"44\" height=\"50\" aria-hidden=\"true\"><path d=\"M63.9304352,16.6935883c-0.7543335-0.2961426-1.5021973-0.5897217-2.2429199-0.8804922c-0.4156494-0.151001-0.8272705-0.3005371-1.2348022-0.4485474c-0.8189087-0.2849731-1.6208496-0.5641479-2.4039307-0.8366699c-3.142334-1.060791-6.0206909-1.8996582-8.4889526-2.4821777c-4.9364014-1.164978-8.2321777-1.3042603-8.7171021-0.1418457c-0.4849243,1.1624756,1.9327393,3.4066162,6.2335815,6.0951529c1.8245239,1.140564,4.0041504,2.3630371,6.4287109,3.6149292c-3.9299927,0.5129395-8.5645752,1.7341919-13.3596802,4.0892334c-2.4478149,1.2183838-4.8989258,2.7646484-7.2866211,4.5922241c-2.3288574,1.8961792-4.618042,4.0429077-6.6160278,6.5328979c-4.0496826,4.9500122-6.6275635,10.5092773-8.1968384,15.6245728c-1.5393066,5.1433716-2.2120972,9.887085-2.272583,13.8354492c-0.1154785,1.9729614,0.012085,3.7541504,0.1219482,5.3097534c0.0647583,0.777832,0.1106567,1.4995117,0.2159424,2.1618042c0.1115112,0.6623535,0.2285767,1.265686,0.350769,1.8070068c0.4889526,2.1658325,1.0587769,3.3349609,1.6884766,3.3342896c0.6296387-0.0006104,1.2607422-1.1640625,1.8604736-3.2163696c0.1498413-0.5132446,0.2977295-1.0822754,0.4429321-1.703186c0.1628418-0.6179199,0.3389282-1.2863159,0.5276489-2.0026855c0.3671875-1.4299927,0.6803589-3.0605469,1.182373-4.8129272c0.8353271-3.5391235,2.0805664-7.6299438,3.805542-11.9075317c1.7584839-4.2592163,4.09375-8.6965942,7.3496704-12.6729736c1.6064453-2.0076294,3.4013062-3.7537842,5.2017822-5.3754272c1.8607788-1.5527344,3.755249-2.9500122,5.6772461-4.1428223c3.8567505-2.3618164,7.7036743-4.0240479,11.0596924-5.2119751c0.1141968-0.0405884,0.2226563-0.0770874,0.3356323-0.1167603c-2.00354,2.4140625-3.7368164,4.677124-5.1082764,6.6715088c-2.8739014,4.1792603-4.1975708,7.2007446-3.2896729,8.0737915c0.9078369,0.8730469,3.8753052-0.5675049,7.9391479-3.602478c2.0318604-1.5174561,4.3378906-3.4335327,6.7976074-5.6582031c0.6096802-0.5618896,1.2340698-1.1373901,1.8716431-1.7250366c0.3148193-0.2980347,0.6328735-0.5991821,0.9540405-0.9032593c0.5633545-0.5615845,1.1321411-1.128479,1.7058105-1.7003784c2.5238647-2.5367432,5.1615601-5.2334595,7.8085938-7.9859619C70.7511749,19.4375458,67.2552032,18.0151825,63.9304352,16.6935883z\" fill=\"currentColor\"></path></svg>";
const knob = cord.querySelector("button");
cord.querySelector("svg").insertAdjacentHTML("afterbegin", '<defs><linearGradient id="cord-knob-gradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fff"/><stop offset="100%" stop-color="#e7e7ec"/></linearGradient><filter id="cord-knob-shadow" x="-70%" y="-70%" width="240%" height="240%"><feDropShadow dx="0" dy="1.4" stdDeviation="1.5" flood-color="rgba(0,0,0,0.32)"/></filter></defs>');
const cordBall = cord.querySelector("circle");
cordBall.setAttribute("r", "6.5");
cordBall.setAttribute("fill", "url(#cord-knob-gradient)");
cordBall.setAttribute("stroke", "rgba(0,0,0,0.10)");
cordBall.setAttribute("stroke-width", "0.5");
cordBall.setAttribute("filter", "url(#cord-knob-shadow)");
const cordPoints = Array.from({ length: 17 }, (_, index) => ({ x: 32, y: index * 11, ox: 32, oy: index * 11 }));
const cordPath = cord.querySelector("svg > path");
let cordDragging = false;
let cordMoved = false;
let cordToggled = false;
let cordPointer = { x: 32, y: 176 };
let cordOrigin;
let cordFrame = 0;
let cordTime = 0;
let cordStep = 0;
function drawCord() {
  let path = `M ${cordPoints[0].x.toFixed(1)} ${cordPoints[0].y.toFixed(1)}`;
  for (let index = 1; index < 16; index++) {
    const point = cordPoints[index];
    const next = cordPoints[index + 1];
    path += ` Q ${point.x.toFixed(1)} ${point.y.toFixed(1)} ${((point.x + next.x) / 2).toFixed(1)} ${((point.y + next.y) / 2).toFixed(1)}`;
  }
  const end = cordPoints[16];
  cordPath.setAttribute("d", `${path} L ${end.x.toFixed(1)} ${end.y.toFixed(1)}`);
  cordBall.setAttribute("transform", `translate(${end.x - 32} ${end.y - 176})`);
  knob.style.transform = `translate(${end.x - 32}px, ${end.y - 176}px)`;
}
function stepCord(time) {
  const dt = cordTime ? Math.min(.04, Math.max(.004, (time - cordTime) / 1000)) : 1 / 60;
  cordTime = time;
  const damping = (cordStep ? dt / cordStep : 1) * Math.pow(.94, 60 * dt);
  cordPoints.forEach((point, index) => {
    if (index === 0 || (index === 16 && cordDragging)) return;
    const vx = point.x - point.ox;
    const vy = point.y - point.oy;
    point.ox = point.x;
    point.oy = point.y;
    point.x += vx * damping;
    point.y += vy * damping + 1250 * dt * dt;
  });
  if (cordDragging) {
    const end = cordPoints[16];
    end.ox = end.x;
    end.oy = end.y;
    end.x = cordPointer.x;
    end.y = cordPointer.y;
  }
  for (let iteration = 0; iteration < 20; iteration++) {
    for (let index = 0; index < 16; index++) {
      const a = cordPoints[index];
      const b = cordPoints[index + 1];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const distance = Math.hypot(dx, dy) || .0001;
      const correction = (11 - distance) / distance * .5;
      if (index !== 0) { a.x -= dx * correction; a.y -= dy * correction; }
      if (!(index === 15 && cordDragging)) { b.x += dx * correction; b.y += dy * correction; }
    }
  }
  cordStep = dt;
  drawCord();
  const motion = cordPoints.slice(1).reduce((sum, point) => sum + Math.abs(point.x - point.ox) + Math.abs(point.y - point.oy), 0);
  cordFrame = !cordDragging && motion < .15 * dt * 60 ? 0 : requestAnimationFrame(stepCord);
}
function wakeCord() {
  if (cordFrame) return;
  cordTime = cordStep = 0;
  cordFrame = requestAnimationFrame(stepCord);
}
knob.addEventListener("pointerdown", (event) => {
  cordOrigin = { x: event.clientX, y: event.clientY };
  cordPointer = { x: cordPoints[16].x, y: cordPoints[16].y };
  cordDragging = true;
  cordMoved = cordToggled = false;
  knob.setPointerCapture(event.pointerId);
  wakeCord();
});
knob.addEventListener("pointermove", (event) => {
  if (!cordDragging) return;
  const dx = event.clientX - cordOrigin.x;
  const y = 176 + event.clientY - cordOrigin.y;
  const distance = Math.hypot(dx, y) || .0001;
  const scale = Math.min(1, 202 / distance);
  cordPointer = { x: 32 + dx * scale, y: y * scale };
  cordMoved ||= Math.hypot(dx, y - 176) > 3;
  if (!cordToggled && distance - 176 >= 20) {
    cordToggled = true;
    themeToggle.click();
  }
});
function releaseCord() {
  if (!cordDragging) return;
  cordDragging = false;
  const end = cordPoints[16];
  const vx = end.x - end.ox;
  const vy = end.y - end.oy;
  const speed = Math.hypot(vx, vy);
  if (speed > 22) { end.ox = end.x - vx * 22 / speed; end.oy = end.y - vy * 22 / speed; }
  wakeCord();
}
knob.addEventListener("pointerup", releaseCord);
knob.addEventListener("pointercancel", () => { cordMoved = true; releaseCord(); });
knob.addEventListener("lostpointercapture", releaseCord);
knob.addEventListener("click", (event) => {
  if (event.detail !== 0 && cordMoved) return;
  themeToggle.click();
  cordPoints[16].oy -= 22;
  wakeCord();
});
drawCord();
window.setTimeout(() => {
  cordPoints[16].oy -= 13;
  cordPoints[16].ox -= 6;
  wakeCord();
}, 1700);

document.querySelectorAll(".stack-logo").forEach((logo) => {
  const name = decodeURIComponent(logo.src.split("/").pop().replace(".svg", ""));
  const wrapper = document.createElement("span");
  wrapper.className = "stack-item";
  wrapper.tabIndex = 0;
  wrapper.dataset.label = name;
  logo.alt = name;
  logo.before(wrapper);
  wrapper.append(logo);
});

const searchDialog = document.createElement("dialog");
searchDialog.className = "command-dialog";
searchDialog.setAttribute("aria-label", "Pesquisar no portfólio");
searchDialog.innerHTML = '<div class="command-input"><span aria-hidden="true">⌕</span><input aria-label="Pesquisar" placeholder="Digite um comando ou pesquise…" autocomplete="off"><button aria-label="Fechar pesquisa">×</button></div><div class="command-results"></div><div class="command-footer">WA <span>↑ ↓ Navegar　 ↵ Abrir　 Esc Sair</span></div>';
document.body.append(searchDialog);
const searchInput = searchDialog.querySelector("input");
document.querySelector("#searchToggle > span").innerHTML = referenceIcons.search;
searchDialog.querySelector(".command-input > span").innerHTML = referenceIcons.search;
searchDialog.querySelector(".command-input button").innerHTML = referenceIcons.close;
searchDialog.querySelector(".command-footer").innerHTML = '<img src="assets/logos/WA.svg" alt=""><span>Go to Page <kbd>↵</kbd>　│　Exit <kbd>Esc</kbd></span>';
const results = searchDialog.querySelector(".command-results");
const contributionTooltip = document.createElement("div");
contributionTooltip.className = "contribution-tooltip";
contributionTooltip.id = "contribution-tooltip";
contributionTooltip.setAttribute("role", "tooltip");
contributionTooltip.hidden = true;
document.body.append(contributionTooltip);
let tooltipDay;
function hideContributionTooltip() {
  tooltipDay?.removeAttribute("aria-describedby");
  tooltipDay = null;
  contributionTooltip.hidden = true;
}
function showContributionTooltip(event) {
  const day = event.target.closest?.(".contribution-day[data-tooltip]");
  if (!day) return;
  hideContributionTooltip();
  tooltipDay = day;
  contributionTooltip.textContent = day.dataset.tooltip;
  contributionTooltip.hidden = false;
  day.setAttribute("aria-describedby", contributionTooltip.id);
  const rect = day.getBoundingClientRect();
  const width = contributionTooltip.offsetWidth;
  const left = Math.max(8, Math.min(innerWidth - width - 8, rect.left + rect.width / 2 - width / 2));
  contributionTooltip.style.left = `${left}px`;
  contributionTooltip.style.top = `${Math.max(8, rect.top - contributionTooltip.offsetHeight - 8)}px`;
}
githubGrid?.addEventListener("pointerover", showContributionTooltip);
githubGrid?.addEventListener("focusin", showContributionTooltip);
githubGrid?.addEventListener("pointerout", hideContributionTooltip);
githubGrid?.addEventListener("focusout", hideContributionTooltip);
window.addEventListener("scroll", hideContributionTooltip, { capture: true, passive: true });
window.addEventListener("resize", hideContributionTooltip);
document.addEventListener("keydown", (event) => { if (event.key === "Escape") hideContributionTooltip(); });
let selected = 0;
let commands = [];
function collectCommands() {
  commands = [{ label: "Início", run: () => window.scrollTo({ top: 0, behavior: "smooth" }) }];
  document.querySelectorAll(".title, .github-project-name").forEach((element) => {
    commands.push({ label: element.textContent.trim(), run: () => element.scrollIntoView({ behavior: "smooth", block: "center" }) });
  });
  document.querySelectorAll(".contact-container a, .footer-section a").forEach((link) => {
    commands.push({ label: link.getAttribute("aria-label") || link.textContent.trim(), run: () => link.click() });
  });
  commands.push({ label: "Baixar contato", run: () => { window.location.href = "willian-alves.vcf"; } });
  ["Claro", "Escuro", "Automático"].forEach((label, index) => commands.push({ label: `Tema ${label}`, run: () => aplicarTema(index === 0 ? "light" : index === 1 ? "dark" : matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light", true) }));
}
function markSelection() {
  [...results.querySelectorAll("button")].forEach((button, index) => {
    button.classList.toggle("selected", index === selected);
    if (index === selected) button.scrollIntoView({ block: "nearest" });
  });
}
function renderCommands() {
  results.replaceChildren();
  selected = 0;
  const query = searchInput.value.trim().toLocaleLowerCase();
  commands.filter((command) => command.label.toLocaleLowerCase().includes(query)).forEach((command) => {
    const button = document.createElement("button");
    const iconNames = { "Início": "Portfolio", "Sobre Mim": "About", "Stack": "Tech Stack", "Minha Marca": "Brand Guidelines", "Baixar contato": "Download vCard", "Tema Claro": "Light", "Tema Escuro": "Dark", "Tema Automático": "Auto" };
    const iconName = iconNames[command.label] || (command.label.startsWith("Projetos") ? "Projects" : command.label.includes("GitHub") ? "GitHub GitHub" : "Projects");
    const icon = referenceIcons.icons.find((item) => item.label === iconName)?.svg;
    if (command.label === "Início") button.innerHTML = '<img class="command-wa" src="assets/logos/WA.svg" alt="">';
    else if (icon) button.innerHTML = icon;
    button.append(document.createTextNode(command.label));
    button.addEventListener("click", () => closeSearch(command.run));
    results.append(button);
  });
  if (!results.childElementCount) results.textContent = "Nenhum resultado encontrado.";
  markSelection();
}
function closeSearch(afterClose) {
  if (searchDialog.classList.contains("closing")) return;
  searchDialog.classList.add("closing");
  window.setTimeout(() => {
    searchDialog.close();
    searchDialog.classList.remove("closing");
    afterClose?.();
  }, 200);
}
function openSearch() {
  if (searchDialog.open) return closeSearch();
  collectCommands();
  searchInput.value = "";
  searchDialog.showModal();
  renderCommands();
  searchInput.focus();
}
document.getElementById("searchToggle").addEventListener("click", openSearch);
searchInput.addEventListener("input", renderCommands);
searchDialog.querySelector(".command-input button").addEventListener("click", () => closeSearch());
searchDialog.addEventListener("cancel", (event) => { event.preventDefault(); closeSearch(); });
searchDialog.addEventListener("click", (event) => { if (event.target === searchDialog) closeSearch(); });
document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    openSearch();
  }
  if (!searchDialog.open) return;
  const buttons = results.querySelectorAll("button");
  if (["ArrowDown", "ArrowUp"].includes(event.key) && buttons.length) {
    event.preventDefault();
    selected = (selected + (event.key === "ArrowDown" ? 1 : -1) + buttons.length) % buttons.length;
    markSelection();
  }
  if (event.key === "Enter") { event.preventDefault(); buttons[selected]?.click(); }
});
