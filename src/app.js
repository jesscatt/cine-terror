/* Cine Terror — protótipo front-end (v0.1)
 * Os dados ficam no navegador (localStorage). Numa próxima etapa serão
 * substituídos por um back-end (ex.: Supabase).
 */
(() => {
  "use strict";

  const LIBERA_EM = 0.9;          // RF06/RF07: 90% assistido
  const CREDITOS_POR_AVALIACAO = 10; // RF09

  // ---------- Armazenamento ----------
  const memoria = {};
  const db = {
    get(chave, padrao) {
      try {
        const v = localStorage.getItem("ct_" + chave);
        return v === null ? padrao : JSON.parse(v);
      } catch { return chave in memoria ? memoria[chave] : padrao; }
    },
    set(chave, valor) {
      memoria[chave] = valor;
      try { localStorage.setItem("ct_" + chave, JSON.stringify(valor)); } catch { /* modo privado */ }
    },
  };

  // ---------- Utilidades ----------
  const $ = (s, el = document) => el.querySelector(s);
  const app = $("#app");
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const normaliza = (s) => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const formataTempo = (seg) => {
    seg = Math.max(0, Math.floor(seg));
    const h = Math.floor(seg / 3600), m = Math.floor((seg % 3600) / 60), s = seg % 60;
    return h ? `${h}h${String(m).padStart(2, "0")}min` : `${m}:${String(s).padStart(2, "0")}`;
  };

  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2800);
  }

  // ---------- Segurança (RNF02): senha com sal + SHA-256 ----------
  async function hashSenha(senha, sal) {
    const dados = new TextEncoder().encode(sal + ":" + senha);
    const buf = await crypto.subtle.digest("SHA-256", dados);
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  const novoSal = () => [...crypto.getRandomValues(new Uint8Array(16))].map((b) => b.toString(16).padStart(2, "0")).join("");

  // ---------- Usuários (RF01, RF02) ----------
  const usuarios = () => db.get("usuarios", {});
  const usuarioAtual = () => {
    const email = db.get("sessao", null);
    return email ? usuarios()[email] || null : null;
  };
  function salvaUsuario(u) {
    const todos = usuarios();
    todos[u.email] = u;
    db.set("usuarios", todos);
  }

  // ---------- Filmes (RF03) ----------
  const filmes = () => [...window.FILMES_INICIAIS, ...db.get("filmes_extra", [])];
  const filmePorId = (id) => filmes().find((f) => f.id === id);

  // ---------- Avaliações (RF06, RF08, RF09) ----------
  const avaliacoes = () => db.get("avaliacoes", {});
  function mediaDo(filmeId) {
    const notas = Object.values(avaliacoes()[filmeId] || {});
    if (!notas.length) return { media: 0, total: 0 };
    return { media: notas.reduce((a, b) => a + b, 0) / notas.length, total: notas.length };
  }
  const estrelas = (n) => "★".repeat(Math.round(n)) + "☆".repeat(5 - Math.round(n));

  // ---------- Progresso assistido (RF05) ----------
  // Guardamos os trechos realmente assistidos como intervalos [início, fim].
  // Pular trechos (seek) não conta como assistido.
  const progressoTodos = () => db.get("progresso", {});
  function progressoDe(email, filmeId) {
    return (progressoTodos()[email] || {})[filmeId] || { trechos: [], duracao: 0 };
  }
  function salvaProgresso(email, filmeId, p) {
    const todos = progressoTodos();
    todos[email] = todos[email] || {};
    todos[email][filmeId] = p;
    db.set("progresso", todos);
  }
  function adicionaTrecho(trechos, a, b) {
    const lista = [...trechos, [a, b]].sort((x, y) => x[0] - y[0]);
    const unidos = [];
    for (const t of lista) {
      const ult = unidos[unidos.length - 1];
      if (ult && t[0] <= ult[1] + 0.5) ult[1] = Math.max(ult[1], t[1]);
      else unidos.push([t[0], t[1]]);
    }
    return unidos;
  }
  const segundosAssistidos = (trechos) => trechos.reduce((s, [a, b]) => s + (b - a), 0);
  const percentual = (p) => (p.duracao ? Math.min(1, segundosAssistidos(p.trechos) / p.duracao) : 0);

  // ---------- Comentários (RF07) ----------
  const comentarios = () => db.get("comentarios", {});

  // ---------- Layout ----------
  function atualizaChrome(rota) {
    const u = usuarioAtual();
    const logado = !!u;
    $("#topbar").hidden = !logado;
    $("#tabbar").hidden = !logado;
    if (u) $("#credits span").textContent = u.creditos || 0;
    document.querySelectorAll(".tabbar a").forEach((a) => a.classList.toggle("ativo", a.dataset.tab === rota));
  }

  // ---------- Telas ----------
  function telaLogin(modo = "login") {
    atualizaChrome();
    const cadastro = modo === "cadastro";
    app.innerHTML = `
      <section class="auth">
        <h1 class="logo grande">Cine Terror</h1>
        <p class="tag">Só avalia quem teve coragem de assistir até o fim.</p>
        <form id="formAuth" class="card form" novalidate>
          <h2>${cadastro ? "Criar conta" : "Entrar"}</h2>
          ${cadastro ? `<label>Nome<input name="nome" autocomplete="name" required minlength="2"></label>` : ""}
          <label>E-mail<input name="email" type="email" autocomplete="email" required></label>
          <label>Senha<input name="senha" type="password" autocomplete="${cadastro ? "new-password" : "current-password"}" required minlength="6"></label>
          <p class="erro" id="erro"></p>
          <button class="btn primario" type="submit">${cadastro ? "Cadastrar" : "Entrar"}</button>
          <p class="troca">${cadastro ? `Já tem conta? <a href="#/login">Entrar</a>` : `Ainda não tem conta? <a href="#/cadastro">Cadastre-se</a>`}</p>
        </form>
      </section>`;

    $("#formAuth").addEventListener("submit", async (e) => {
      e.preventDefault();
      const f = new FormData(e.target);
      const email = String(f.get("email") || "").trim().toLowerCase();
      const senha = String(f.get("senha") || "");
      const erro = $("#erro");
      if (!/^\S+@\S+\.\S+$/.test(email)) return (erro.textContent = "Informe um e-mail válido.");
      if (senha.length < 6) return (erro.textContent = "A senha precisa ter pelo menos 6 caracteres.");

      if (cadastro) {
        const nome = String(f.get("nome") || "").trim();
        if (nome.length < 2) return (erro.textContent = "Informe seu nome.");
        if (usuarios()[email]) return (erro.textContent = "Já existe uma conta com esse e-mail.");
        const sal = novoSal();
        salvaUsuario({ nome, email, sal, hash: await hashSenha(senha, sal), creditos: 0, criadoEm: Date.now() });
        db.set("sessao", email);
        toast(`Bem-vindo(a), ${nome}!`);
      } else {
        const u = usuarios()[email];
        if (!u || (await hashSenha(senha, u.sal)) !== u.hash) return (erro.textContent = "E-mail ou senha incorretos.");
        db.set("sessao", email);
        toast(`Olá de novo, ${u.nome}!`);
      }
      location.hash = "#/";
    });
  }

  function cardFilme(f, email) {
    const { media, total } = mediaDo(f.id);
    const pct = Math.round(percentual(progressoDe(email, f.id)) * 100);
    return `
      <a class="filme" href="#/filme/${encodeURIComponent(f.id)}">
        <div class="poster" style="background-image:url('${esc(f.imagem)}')">
          ${pct ? `<div class="barra"><i style="width:${pct}%"></i></div>` : ""}
        </div>
        <div class="info">
          <strong>${esc(f.titulo)}</strong>
          <small>${esc(f.ano)} · ${esc(f.diretor)}</small>
          <small class="nota">${total ? `<b>★ ${media.toFixed(1)}</b> (${total})` : "Sem avaliações"}</small>
        </div>
      </a>`;
  }

  function telaCatalogo() {
    const u = usuarioAtual();
    atualizaChrome("home");
    app.innerHTML = `
      <section>
        <label class="busca">
          <span aria-hidden="true">🔍</span>
          <input id="busca" type="search" placeholder="Pesquisar filme pelo título" aria-label="Pesquisar filme pelo título">
        </label>
        <div class="grade" id="grade"></div>
      </section>`;
    const grade = $("#grade");
    const desenha = (termo = "") => {
      const t = normaliza(termo.trim());
      const lista = filmes().filter((f) => normaliza(f.titulo).includes(t));
      grade.innerHTML = lista.length
        ? lista.map((f) => cardFilme(f, u.email)).join("")
        : `<p class="vazio">Nenhum filme encontrado para “${esc(termo)}”.</p>`;
    };
    $("#busca").addEventListener("input", (e) => desenha(e.target.value));
    desenha();
  }

  let limpaPlayer = null;

  function telaFilme(id) {
    const u = usuarioAtual();
    const f = filmePorId(id);
    atualizaChrome("home");
    if (!f) {
      app.innerHTML = `<p class="vazio">Filme não encontrado. <a href="#/">Voltar</a></p>`;
      return;
    }

    app.innerHTML = `
      <article class="detalhe">
        <a href="#/" class="voltar">← Filmes</a>
        <div class="player">
          <video id="video" controls playsinline preload="metadata" poster="${esc(f.imagem)}" src="${esc(f.video)}"></video>
        </div>
        <div class="progresso card">
          <div class="linha">
            <span>Assistido de forma válida</span>
            <b id="pctTxt">0%</b>
          </div>
          <div class="barra grande"><i id="pctBar"></i><span class="marca" style="left:${LIBERA_EM * 100}%"></span></div>
          <div class="linha pequena">
            <span id="tempoTxt">—</span>
            <label class="vel">Velocidade
              <select id="vel">
                <option value="1">1x</option><option value="1.5">1,5x</option><option value="2">2x</option>
                <option value="4">4x</option><option value="8">8x</option><option value="16">16x (apresentação)</option>
              </select>
            </label>
          </div>
          <p class="dica">Pular trechos não conta. A avaliação e os comentários são liberados ao chegar em ${LIBERA_EM * 100}%.</p>
        </div>

        <h1>${esc(f.titulo)}</h1>
        <p class="meta">${esc(f.ano)} · Direção: ${esc(f.diretor)}</p>
        <p class="media" id="media"></p>
        <p class="sinopse">${esc(f.sinopse)}</p>

        <section id="interacao"></section>
      </article>`;

    const video = $("#video");
    let prog = progressoDe(u.email, f.id);
    let liberado = percentual(prog) >= LIBERA_EM;
    let ultimo = null;
    let ultimoSalvo = 0;

    const desenhaMedia = () => {
      const { media, total } = mediaDo(f.id);
      $("#media").innerHTML = total
        ? `<span class="estrelas">${estrelas(media)}</span> <b>${media.toFixed(1)}</b> · ${total} ${total === 1 ? "avaliação" : "avaliações"}`
        : `<span class="estrelas apagado">☆☆☆☆☆</span> Ainda sem avaliações`;
    };

    const desenhaProgresso = () => {
      const p = percentual(prog);
      $("#pctTxt").textContent = `${Math.floor(p * 100)}%`;
      $("#pctBar").style.width = `${p * 100}%`;
      $("#tempoTxt").textContent = prog.duracao
        ? `${formataTempo(segundosAssistidos(prog.trechos))} de ${formataTempo(prog.duracao)}`
        : "Carregando duração…";
      const faltam = $("#faltam");
      if (faltam) faltam.textContent = Math.max(0, Math.ceil((LIBERA_EM - p) * 100));
      if (!liberado && p >= LIBERA_EM) {
        liberado = true;
        salvaProgresso(u.email, f.id, prog);
        toast("🔓 Avaliação e comentários liberados!");
        desenhaInteracao();
      }
    };

    const salva = (forcar) => {
      const agora = Date.now();
      if (forcar || agora - ultimoSalvo > 3000) {
        salvaProgresso(u.email, f.id, prog);
        ultimoSalvo = agora;
      }
    };

    function desenhaInteracao() {
      const box = $("#interacao");
      if (!liberado) {
        // Critério de aceite 1: botões NÃO são exibidos antes de 90%.
        box.innerHTML = `
          <div class="card bloqueado">
            <span class="cadeado">🔒</span>
            <div><b>Assista ao filme para avaliar e comentar</b>
            <p>Faltam <span id="faltam">${Math.max(0, Math.ceil((LIBERA_EM - percentual(prog)) * 100))}</span>% para liberar. Assim as notas da comunidade são sempre de quem realmente viu.</p></div>
          </div>
          ${listaComentarios()}`;
        return;
      }
      const minha = (avaliacoes()[f.id] || {})[u.email] || 0;
      box.innerHTML = `
        <div class="card">
          <h2>Sua avaliação</h2>
          <div class="estrelas-input" role="radiogroup" aria-label="Nota de 1 a 5">
            ${[1, 2, 3, 4, 5].map((n) => `<button type="button" role="radio" aria-checked="${n === minha}" aria-label="${n} estrela${n > 1 ? "s" : ""}" data-nota="${n}" class="${n <= minha ? "on" : ""}">★</button>`).join("")}
          </div>
          <p class="pequena">${minha ? "Você já avaliou este filme. Pode mudar a nota quando quiser." : `Avalie e ganhe ${CREDITOS_POR_AVALIACAO} créditos 🩸`}</p>
        </div>
        <form class="card form" id="formComentario">
          <h2>Comentar</h2>
          <textarea name="texto" rows="3" maxlength="500" placeholder="O que você achou do filme?" required></textarea>
          <button class="btn primario" type="submit">Publicar comentário</button>
        </form>
        ${listaComentarios()}`;

      box.querySelectorAll("[data-nota]").forEach((b) =>
        b.addEventListener("click", () => {
          const nota = Number(b.dataset.nota);
          const todas = avaliacoes();
          todas[f.id] = todas[f.id] || {};
          const primeira = !todas[f.id][u.email];
          todas[f.id][u.email] = nota;
          db.set("avaliacoes", todas);
          if (primeira) {
            const atual = usuarioAtual();
            atual.creditos = (atual.creditos || 0) + CREDITOS_POR_AVALIACAO;
            salvaUsuario(atual);
            atualizaChrome("home");
            toast(`Obrigado! +${CREDITOS_POR_AVALIACAO} créditos 🩸`);
          } else toast("Nota atualizada.");
          desenhaMedia();
          desenhaInteracao();
        })
      );

      $("#formComentario").addEventListener("submit", (e) => {
        e.preventDefault();
        const texto = String(new FormData(e.target).get("texto") || "").trim();
        if (!texto) return;
        const todos = comentarios();
        todos[f.id] = todos[f.id] || [];
        todos[f.id].unshift({ email: u.email, nome: u.nome, texto, data: Date.now() });
        db.set("comentarios", todos);
        toast("Comentário publicado.");
        desenhaInteracao();
      });
    }

    function listaComentarios() {
      const lista = comentarios()[f.id] || [];
      return `
        <section class="comentarios">
          <h2>Comentários <small>(${lista.length})</small></h2>
          ${lista.length
            ? lista.map((c) => `
              <div class="comentario">
                <b>${esc(c.nome)}</b> <small>${new Date(c.data).toLocaleDateString("pt-BR")}</small>
                <p>${esc(c.texto)}</p>
              </div>`).join("")
            : `<p class="vazio">Nenhum comentário ainda.</p>`}
        </section>`;
    }

    // --- Monitoramento do player ---
    video.addEventListener("loadedmetadata", () => {
      if (isFinite(video.duration) && video.duration > 0) {
        prog.duracao = video.duration;
        desenhaProgresso();
      }
    });
    video.addEventListener("play", () => { ultimo = video.currentTime; });
    video.addEventListener("seeking", () => { ultimo = null; }); // pulo: não conta
    video.addEventListener("seeked", () => { ultimo = video.currentTime; });
    video.addEventListener("timeupdate", () => {
      const t = video.currentTime;
      if (ultimo !== null && !video.paused && !video.seeking) {
        const d = t - ultimo;
        const limite = 1.5 * video.playbackRate + 1; // avanço natural entre dois eventos
        if (d > 0 && d <= limite) {
          prog.trechos = adicionaTrecho(prog.trechos, ultimo, t);
          desenhaProgresso();
          salva(false);
        }
      }
      ultimo = t;
    });
    video.addEventListener("pause", () => salva(true));
    video.addEventListener("ended", () => salva(true));
    video.addEventListener("error", () => toast("Não foi possível carregar o vídeo agora."));

    $("#vel").addEventListener("change", (e) => { video.playbackRate = Number(e.target.value); });

    desenhaMedia();
    desenhaProgresso();
    desenhaInteracao();

    limpaPlayer = () => { salva(true); video.pause(); video.removeAttribute("src"); video.load(); };
  }

  function telaNovoFilme() {
    atualizaChrome("novo");
    app.innerHTML = `
      <section>
        <h1>Cadastrar filme</h1>
        <form id="formFilme" class="card form" novalidate>
          <label>Título<input name="titulo" required maxlength="120"></label>
          <label>Sinopse<textarea name="sinopse" rows="4" required maxlength="800"></textarea></label>
          <div class="duas">
            <label>Ano<input name="ano" type="number" inputmode="numeric" min="1890" max="2100" required></label>
            <label>Diretor<input name="diretor" required maxlength="80"></label>
          </div>
          <label>Imagem (URL)<input name="imagem" type="url" placeholder="https://…" required></label>
          <label>Vídeo (URL de um .mp4)<input name="video" type="url" placeholder="https://…/filme.mp4" required></label>
          <p class="erro" id="erro"></p>
          <button class="btn primario" type="submit">Salvar filme</button>
        </form>
      </section>`;

    $("#formFilme").addEventListener("submit", (e) => {
      e.preventDefault();
      const d = Object.fromEntries([...new FormData(e.target)].map(([k, v]) => [k, String(v).trim()]));
      const erro = $("#erro");
      const urlOk = (s) => /^https?:\/\/\S+$/i.test(s);
      const ano = Number(d.ano);
      if (!d.titulo || !d.sinopse || !d.diretor) return (erro.textContent = "Preencha título, sinopse e diretor.");
      if (!(ano >= 1890 && ano <= 2100)) return (erro.textContent = "Informe um ano válido.");
      if (!urlOk(d.imagem) || !urlOk(d.video)) return (erro.textContent = "Informe links válidos para a imagem e o vídeo.");
      const id = normaliza(d.titulo).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Date.now().toString(36);
      const extras = db.get("filmes_extra", []);
      extras.push({ id, titulo: d.titulo, sinopse: d.sinopse, ano, diretor: d.diretor, imagem: d.imagem, video: d.video });
      db.set("filmes_extra", extras);
      toast("Filme cadastrado!");
      location.hash = `#/filme/${encodeURIComponent(id)}`;
    });
  }

  function telaPerfil() {
    const u = usuarioAtual();
    atualizaChrome("perfil");
    const meus = progressoTodos()[u.email] || {};
    const minhasNotas = Object.entries(avaliacoes()).filter(([, n]) => n[u.email]).length;
    const vistos = Object.entries(meus)
      .map(([id, p]) => ({ f: filmePorId(id), pct: percentual(p) }))
      .filter((x) => x.f && x.pct > 0)
      .sort((a, b) => b.pct - a.pct);

    app.innerHTML = `
      <section>
        <div class="card perfil">
          <div class="avatar">${esc(u.nome.charAt(0).toUpperCase())}</div>
          <div><h1>${esc(u.nome)}</h1><p class="pequena">${esc(u.email)}</p></div>
        </div>
        <div class="stats">
          <div class="card"><b>${u.creditos || 0}</b><span>créditos 🩸</span></div>
          <div class="card"><b>${minhasNotas}</b><span>avaliações</span></div>
          <div class="card"><b>${vistos.filter((v) => v.pct >= LIBERA_EM).length}</b><span>filmes concluídos</span></div>
        </div>
        <p class="pequena">Você ganha ${CREDITOS_POR_AVALIACAO} créditos por filme avaliado. Em breve eles viram desconto na loja e na assinatura.</p>

        <h2>Continuar assistindo</h2>
        ${vistos.length
          ? vistos.map(({ f, pct }) => `
            <a class="linha-filme card" href="#/filme/${encodeURIComponent(f.id)}">
              <span>${esc(f.titulo)}</span>
              <span class="barra"><i style="width:${pct * 100}%"></i></span>
              <b>${Math.floor(pct * 100)}%</b>
            </a>`).join("")
          : `<p class="vazio">Você ainda não começou nenhum filme.</p>`}

        <button class="btn" id="sair">Sair da conta</button>
      </section>`;

    $("#sair").addEventListener("click", () => {
      db.set("sessao", null);
      location.hash = "#/login";
    });
  }

  // ---------- Rotas ----------
  function rotear() {
    if (limpaPlayer) { limpaPlayer(); limpaPlayer = null; }
    const partes = (location.hash.replace(/^#\/?/, "") || "").split("/");
    const [rota, param] = partes;
    const logado = !!usuarioAtual();

    if (!logado && rota !== "cadastro") return telaLogin("login");
    window.scrollTo(0, 0);
    switch (rota) {
      case "cadastro": return logado ? (location.hash = "#/") : telaLogin("cadastro");
      case "login": return (location.hash = "#/");
      case "filme": return telaFilme(decodeURIComponent(param || ""));
      case "novo": return telaNovoFilme();
      case "perfil": return telaPerfil();
      default: return telaCatalogo();
    }
  }

  window.addEventListener("hashchange", rotear);
  window.addEventListener("beforeunload", () => limpaPlayer && limpaPlayer());
  rotear();
})();
