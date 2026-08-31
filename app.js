(function () {
  'use strict';

  const GAMES = [
    ['Persona 5 Royal', 'RPG', 2020], ['Persona 4 Golden', 'RPG', 2012], ['Persona 3 Reload', 'RPG', 2024],
    ['Shin Megami Tensei V: Vengeance', 'RPG', 2024], ['Terraria', 'Aventura', 2011], ['Portal', 'Puzzle', 2007],
    ['Portal 2', 'Puzzle', 2011], ['Danganronpa: Trigger Happy Havoc', 'Visual Novel', 2010], ['Danganronpa 2: Goodbye Despair', 'Visual Novel', 2012],
    ['Danganronpa V3: Killing Harmony', 'Visual Novel', 2017], ['Katawa Shoujo', 'Visual Novel', 2012], ['The Stanley Parable', 'Aventura', 2013],
    ['The Stanley Parable: Ultra Deluxe', 'Aventura', 2022], ['Final Fantasy VI', 'RPG', 1994], ['Final Fantasy VII', 'RPG', 1997],
    ['Final Fantasy V', 'RPG', 1992], ['Final Fantasy IV', 'RPG', 1991], ['Final Fantasy VIII', 'RPG', 1999],
    ['Final Fantasy IX', 'RPG', 2000], ['Final Fantasy X', 'RPG', 2001], ['Chrono Trigger', 'RPG', 1995],
    ['Xenoblade Chronicles', 'RPG', 2010], ['Xenoblade Chronicles 2', 'RPG', 2017], ['NieR Replicant ver.1.22474487139...', 'RPG', 2021],
    ['The Legend of Zelda: Ocarina of Time', 'Aventura', 1998], ['The Legend of Zelda: Majora’s Mask', 'Aventura', 2000],
    ['The Legend of Zelda: A Link to the Past', 'Aventura', 1991], ['The Legend of Zelda: Link’s Awakening', 'Aventura', 1993],
    ['Super Mario 64', 'Plataforma', 1996], ['Super Mario World', 'Plataforma', 1990], ['Super Mario Bros. 3', 'Plataforma', 1988],
    ['Pokémon Ultra Sun', 'RPG', 2017], ['Pokémon Emerald', 'RPG', 2004], ['Pokémon Platinum', 'RPG', 2008],
    ['Undertale', 'RPG', 2015], ['Bad End Theater', 'Puzzle', 2021], ['Hotline Miami', 'Ação', 2012], ['Hotline Miami 2: Wrong Number', 'Ação', 2015],
    ['People Playground', 'Simulação', 2019], ['Minecraft', 'Sandbox', 2011], ['Half-Life', 'Ação', 1998], ['Half-Life 2', 'Ação', 2004],
    ['Left 4 Dead 2', 'Ação', 2009], ['Team Fortress 2', 'Ação', 2007], ['Counter-Strike 1.6', 'Ação', 2003], ['Grand Theft Auto: San Andreas', 'Ação', 2004],
    ['Grand Theft Auto V', 'Ação', 2013], ['Red Dead Redemption 2', 'Ação', 2018], ['The Elder Scrolls V: Skyrim', 'RPG', 2011], ['Fallout: New Vegas', 'RPG', 2010],
    ['Dark Souls', 'RPG', 2011], ['Dark Souls III', 'RPG', 2016], ['Elden Ring', 'RPG', 2022], ['Hollow Knight', 'Aventura', 2017],
    ['Celeste', 'Plataforma', 2018], ['Pikuniku', 'Aventura', 2019], ['Aokana: Four Rhythms Across the Blue', 'Visual Novel', 2014],
    ['Steins;Gate', 'Visual Novel', 2009], ['Ace Attorney', 'Visual Novel', 2001], ['Sonic the Hedgehog', 'Plataforma', 1991], ['Sonic the Hedgehog 2', 'Plataforma', 1992],
    ['Kirby Super Star Ultra', 'Plataforma', 2008], ['Donkey Kong Country 2', 'Plataforma', 1995], ['Metal Slug', 'Ação', 1996], ['Journey', 'Aventura', 2012],
    ['Moving Out', 'Party', 2020], ['Overcooked! 2', 'Party', 2018], ['LEGO Marvel Super Heroes', 'Aventura', 2013], ['LEGO Batman: The Videogame', 'Aventura', 2008],
    ['FIFA 14', 'Esporte', 2013], ['EA Sports FC 25', 'Esporte', 2024], ['Football Manager 2024', 'Esporte', 2023], ['Five Nights at Freddy’s', 'Terror', 2014],
    ['Five Nights at Freddy’s 2', 'Terror', 2014], ['Outer Wilds', 'Aventura', 2019], ['Disco Elysium', 'RPG', 2019], ['Baldur’s Gate 3', 'RPG', 2023],
    ['The Sims 2', 'Simulação', 2004], ['The Sims 4', 'Simulação', 2014], ['SimCity 4', 'Simulação', 2003], ['RollerCoaster Tycoon 2', 'Simulação', 2002]
  ];

  const ADMIN_LOGS = [
    {id:'demo1', game:'SimCity 4', status:'completed', rating:'8', date:'2009-06-17', note:''},
    {id:'demo2', game:'Half-Life 2', status:'completed', rating:'9', date:'2010-02-04', note:''},
    {id:'demo3', game:'The Sims 2', status:'playing', rating:'10', date:'2010-05-22', note:''},
    {id:'demo4', game:'Portal', status:'completed', rating:'9', date:'2011-01-03', note:''},
    {id:'demo5', game:'Final Fantasy VII', status:'abandoned', rating:'6', date:'2011-08-19', note:''},
    {id:'demo6', game:'Team Fortress 2', status:'playing', rating:'8', date:'2012-12-26', note:''}
  ];

  const STATUS = {
    completed:'Terminado', playing:'Jogando agora', abandoned:'Abandonado', wishlist:'Quero jogar', played:'Jogado', backlog:'Na pilha'
  };

  const page = document.getElementById('page');
  const crumb = document.getElementById('crumb');
  const memberBox = document.getElementById('member-box');
  const toast = document.getElementById('toast');
  let selectedGame = '';
  let lastSearch = GAMES.slice(0, 20);
  let dragState = null;

  function readJSON(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch (_) { return fallback; }
  }
  function writeJSON(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
  function user() { return readJSON('loglab_user', null); }
  function session() { return sessionStorage.getItem('loglab_session') === '1' && !!user(); }
  function logs() { return readJSON('loglab_logs', []); }
  function positions() { return readJSON('loglab_positions', {}); }
  function esc(value) { return String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
  function today() { return new Date().toISOString().slice(0,10); }
  function uid() { return 'g' + Date.now().toString(36) + Math.random().toString(36).slice(2,7); }

  function showToast(text) {
    toast.textContent = text;
    toast.style.display = 'block';
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.style.display = 'none', 4300);
  }

  function title(name, subtitle) {
    return `<h1 class="page-title">${name}</h1>${subtitle ? `<div class="subhead">${subtitle}</div>` : ''}`;
  }

  function updateChrome() {
    const u = user();
    if (session()) {
      memberBox.innerHTML = `<div class="welcome">Membro: ${esc(u.username)}</div>
        <a href="#profile">ver perfil</a><a href="#settings">conta</a><a href="#home" id="logout-link">sair</a>
        <div class="tiny">Sessão local nº ${String(u.memberNo || 18432).padStart(6,'0')}</div>`;
      const logout = document.getElementById('logout-link');
      logout.addEventListener('click', function (e) {
        e.preventDefault();
        if (confirm('Tem certeza que deseja encerrar a sessão? Quaisquer formulários abertos serão perdidos.')) {
          sessionStorage.removeItem('loglab_session');
          location.hash = '#home';
          updateChrome();
          route();
        }
      });
    } else {
      memberBox.innerHTML = `<div class="welcome">Área do membro</div>
        <a href="#login">ENTRAR</a><a href="#register">CRIAR CONTA</a>
        <div class="tiny">Contas são gratuitas. Cookies devem estar habilitados.</div>`;
    }
  }

  function renderHome() {
    crumb.textContent = 'página inicial';
    const my = session();
    const recent = my ? logs().slice().reverse().slice(0,6) : ADMIN_LOGS.slice().reverse().slice(0,6);
    const who = my ? esc(user().username) : 'admin';
    page.innerHTML = title('LogLab - Arquivo de Jogos', 'Acompanhe o que você jogou, terminou, abandonou ou pretende lembrar que comprou.') + `
      <div class="two-col">
        <section>
          <div class="panel">
            <h2>Bem-vindo ao LogLab</h2>
            <div class="panel-body">
              <div class="announcement"><b>Organize seu histórico pessoal de videogames.</b><br>
              LogLab mantém uma lista simples dos seus jogos e permite registrar estado, nota e data. As informações do catálogo são mantidas manualmente por colaboradores e podem conter pequenas diferenças de edição.</div>
              <div class="home-actions">
                ${my ? `<a class="big-old-button primary" href="#log">+ LOGAR UM JOGO</a><a class="big-old-button" href="#profile">MEU PERFIL</a>` : `<a class="big-old-button primary" href="#register">CRIAR MINHA CONTA</a><a class="big-old-button" href="#login">JÁ SOU MEMBRO</a>`}
              </div>
              <div class="misaligned-note">Dica: use títulos em inglês para obter resultados mais completos.</div>
            </div>
          </div>
          <div class="panel">
            <h2>Atividade recente ${my ? 'na sua conta' : 'da comunidade'}</h2>
            <div class="panel-body">
              ${recent.length ? recent.map(l => `<div class="activity-line"><b>${who}</b> marcou <a href="#games" data-game-link="${esc(l.game)}">${esc(l.game)}</a> como <b>${STATUS[l.status] || l.status}</b>${l.rating ? ` — nota ${esc(l.rating)}/10` : ''}<div class="very-small">${esc(l.date || 'data não informada')} • atualização processada pelo sistema</div></div>`).join('') : '<i>Nenhuma atividade localizada para este membro.</i>'}
            </div>
          </div>
          <div class="panel">
            <h3>Jogos mais registrados esta semana</h3>
            <div class="panel-body">
              <table class="mini-table"><thead><tr><th class="rank">#</th><th>Jogo</th><th>Logs</th><th>Variação</th></tr></thead><tbody>
              ${[['Minecraft','132','+4'],['Persona 5 Royal','98','+18'],['EA Sports FC 25','91','-2'],['Terraria','88','+1'],['Elden Ring','84','+7']].map((x,i)=>`<tr><td class="rank">${i+1}</td><td><a href="#games" data-game-link="${x[0]}">${x[0]}</a></td><td>${x[1]}</td><td>${x[2]}%</td></tr>`).join('')}
              </tbody></table>
            </div>
          </div>
        </section>
        <aside>
          <div class="panel"><h3>Pesquisa rápida</h3><div class="panel-body">
            <form id="home-search"><input id="home-search-input" type="text" size="25" placeholder="nome exato ou parcial"><br><button class="big-old-button" style="margin-top:6px;min-width:110px">Pesquisar</button></form>
            <div class="field-note">Não recomendamos pesquisar apenas uma palavra com menos de 4 letras.</div>
          </div></div>
          <div class="panel"><h3>Estado do serviço</h3><div class="panel-body">
            Banco de títulos: <b>ONLINE</b><br>Contas: <b>ONLINE</b><br>Capas: <b>desativadas</b><br><br>
            Sincronização geral: <span class="fake-progress"><span></span></span><br><span class="very-small">74% (estimado)</span>
          </div></div>
          <div class="panel"><h3>Estatísticas gerais</h3><div class="panel-body">
            Membros cadastrados: <b>18.432</b><br>Jogos catalogados: <b>${GAMES.length}</b><br>Logs enviados hoje: <b>1.107</b><br>Visitantes agora: <b>23</b>
          </div></div>
          <div class="notice-box">O LogLab é mantido em tempo livre. Caso um jogo esteja ausente, não envie o mesmo pedido mais de uma vez na mesma semana.</div>
        </aside>
      </div>`;
    document.getElementById('home-search').addEventListener('submit', e => {
      e.preventDefault();
      const q = document.getElementById('home-search-input').value;
      sessionStorage.setItem('loglab_search', q);
      location.hash = '#games';
    });
  }

  function renderRegister() {
    crumb.textContent = 'conta > novo cadastro';
    page.innerHTML = title('Criar nova conta', 'Todos os campos marcados com * são obrigatórios. Leia as instruções antes de enviar.') + `
      <div class="panel"><h2>Registro de membro — etapa 1 de 3</h2><div class="panel-body">
        <div id="register-message"></div>
        <form id="register-form">
          <table class="form-table">
            <tr><th><span class="required">*</span> Nome de usuário:</th><td><input name="username" type="text" maxlength="18" required><div class="field-note">3 a 18 caracteres. Espaços no final serão removidos sem aviso.</div></td></tr>
            <tr><th><span class="required">*</span> Senha:</th><td><input name="password" type="password" minlength="4" required><div class="field-note">A senha deve ser exclusiva do LogLab. Não use a mesma senha em outro site.</div></td></tr>
            <tr><th><span class="required">*</span> Confirme a senha:</th><td><input name="confirm" type="password" minlength="4" required></td></tr>
            <tr><th>Ano de nascimento:</th><td><select name="year"><option value="">-- prefiro selecionar depois --</option>${Array.from({length:70},(_,i)=>`<option>${2012-i}</option>`).join('')}</select></td></tr>
            <tr><th>Pergunta de recuperação:</th><td><select name="question"><option>Qual foi o primeiro jogo que você fingiu ter terminado?</option><option>Qual era a cor do seu primeiro controle?</option><option>Qual jogo você alugou mais vezes?</option></select><input style="margin-top:4px" name="answer" type="text"><div class="field-note">Resposta opcional, embora a pergunta não seja.</div></td></tr>
            <tr><th>Comunicações:</th><td><label><input name="mail" type="checkbox" checked> Não desejo deixar de receber o resumo mensal do LogLab.</label></td></tr>
            <tr><th><span class="required">*</span> Termos:</th><td><label><input name="terms" type="checkbox" required> Li e aceito que a classificação de jogos pode mudar sem notificação.</label></td></tr>
          </table>
          <p><button class="big-old-button primary" type="submit">VALIDAR E CONTINUAR &gt;&gt;</button> <button class="big-old-button" type="reset">LIMPAR CAMPOS</button></p>
        </form>
        <div class="very-small">Ao prosseguir você autoriza a criação de um número interno de membro. O nome de usuário poderá ser alterado uma vez a cada 180 dias.</div>
      </div></div>
      <div class="backline"><a href="#home">&lt;&lt; retornar à página anterior sem salvar</a></div>`;

    const form = document.getElementById('register-form');
    form.addEventListener('submit', e => {
      e.preventDefault();
      const fd = new FormData(form);
      const username = String(fd.get('username') || '').trim();
      const password = String(fd.get('password') || '');
      const confirmPw = String(fd.get('confirm') || '');
      const msg = document.getElementById('register-message');
      if (password !== confirmPw) {
        msg.innerHTML = '<div class="form-error">ERRO 104: as duas senhas não são idênticas. Por segurança, os campos de senha foram limpos.</div>';
        form.password.value = ''; form.confirm.value = ''; form.password.focus(); return;
      }
      if (!sessionStorage.getItem('loglab_password_rejected_once')) {
        sessionStorage.setItem('loglab_password_rejected_once', '1');
        msg.innerHTML = '<div class="form-error">NÃO FOI POSSÍVEL CONCLUIR O CADASTRO: esta senha já está sendo usada por outro membro do LogLab. Por favor escolha uma senha que ainda não esteja cadastrada no sistema.</div>';
        form.password.value = ''; form.confirm.value = ''; form.password.focus();
        window.scrollTo(0,0);
        return;
      }
      const account = {
        username,
        password,
        joined: today(),
        memberNo: 18432 + Math.floor(Math.random()*734),
        bio:'Ainda não preencheu a apresentação pessoal.',
        favoriteGenre:'Não informado'
      };
      writeJSON('loglab_user', account);
      writeJSON('loglab_logs', []);
      writeJSON('loglab_positions', {});
      msg.innerHTML = `<div class="form-good">Cadastro aceito. Seu número de membro foi reservado. <b>Por motivos de segurança você não foi conectado automaticamente.</b> Use o botão abaixo para entrar.</div>`;
      form.classList.add('hidden');
      msg.insertAdjacentHTML('beforeend', '<p><a class="big-old-button primary" href="#login">IR PARA A PÁGINA DE LOGIN</a></p>');
      updateChrome();
      window.scrollTo(0,0);
    });
  }

  function renderLogin() {
    crumb.textContent = 'conta > entrada de membro';
    page.innerHTML = title('Entrar no LogLab', 'A identificação diferencia letras maiúsculas e minúsculas.') + `
      <div class="two-col">
        <section class="panel"><h2>Login de membro</h2><div class="panel-body">
          <div id="login-message"></div>
          <form id="login-form" class="inline-login">
            <label for="login-user">Usuário:</label><input id="login-user" name="username" type="text" autocomplete="username">
            <label for="login-pass">Senha:</label><input id="login-pass" name="password" type="password" autocomplete="current-password">
            <span></span><label><input type="checkbox" checked disabled> manter sessão apenas nesta aba</label>
            <span></span><button class="big-old-button primary" type="submit">ENTRAR</button>
          </form>
          <hr class="bad-separator">
          <a href="#register">Ainda não possui uma conta?</a><br><a href="#help">Esqueci minha senha ou meu nome de usuário</a>
        </div></section>
        <aside class="panel"><h3>Problemas para entrar?</h3><div class="panel-body">Verifique se o Caps Lock está desativado e se o navegador permite armazenamento local. Após 6 tentativas incorretas recomendamos aguardar alguns minutos, embora o contador seja reiniciado ao atualizar a página.</div></aside>
      </div>`;
    document.getElementById('login-form').addEventListener('submit', e => {
      e.preventDefault();
      const acc = user();
      const fd = new FormData(e.target);
      const msg = document.getElementById('login-message');
      if (!acc) { msg.innerHTML = '<div class="form-error">Nenhum cadastro local foi encontrado neste navegador. Contas criadas em outro dispositivo não podem ser localizadas.</div>'; return; }
      if (String(fd.get('username')) !== acc.username || String(fd.get('password')) !== acc.password) {
        msg.innerHTML = '<div class="form-error">Nome de usuário ou senha inválidos. Código de retorno: L-02.</div>';
        document.getElementById('login-pass').value = '';
        return;
      }
      sessionStorage.setItem('loglab_session','1');
      updateChrome();
      location.hash = '#home';
      showToast('Login aceito. Carregando preferências do membro... concluído.');
    });
  }

  function requireLogin() {
    if (session()) return true;
    page.innerHTML = title('Área reservada aos membros') + `<div class="form-error">Você precisa entrar antes de acessar esta seção.</div><p><a class="big-old-button primary" href="#login">ENTRAR</a> <a href="#register">criar conta</a></p>`;
    crumb.textContent = 'acesso negado';
    return false;
  }

  function renderGames() {
    crumb.textContent = 'catálogo > pesquisa de jogos';
    const pre = sessionStorage.getItem('loglab_search') || '';
    sessionStorage.removeItem('loglab_search');
    page.innerHTML = title('Catálogo de Jogos', 'Pesquisa por título. As capas foram removidas para reduzir o tempo de carregamento do catálogo.') + `
      <div class="catalog-controls">
        <form id="catalog-search"><b>Nome do jogo:</b> <input id="catalog-q" type="text" value="${esc(pre)}"> <button>LOCALIZAR</button> <button type="button" id="catalog-clear">limpar / reiniciar</button>
        <label style="margin-left:19px"><input type="checkbox" id="exact-box"> apenas título completo</label></form>
      </div>
      <div id="catalog-count" class="subhead"></div>
      <table class="catalog-results"><thead><tr><th>Título</th><th>Tipo principal</th><th>Ano</th><th>Opções</th></tr></thead><tbody id="catalog-body"></tbody></table>
      <div class="backline">Não encontrou? <a href="#help">Solicitar correção do catálogo</a> (prazo médio não disponível).</div>`;

    function draw() {
      const q = document.getElementById('catalog-q').value.trim().toLowerCase();
      const exact = document.getElementById('exact-box').checked;
      let result = GAMES.filter(g => !q || (exact ? g[0].toLowerCase() === q : g[0].toLowerCase().includes(q)));
      if (!q) result = result.slice(0, 35);
      document.getElementById('catalog-count').textContent = `Exibindo ${result.length} resultado(s). Resultados sem pesquisa são limitados.`;
      document.getElementById('catalog-body').innerHTML = result.length ? result.map(g => `<tr><td>${esc(g[0])}</td><td>${esc(g[1])}</td><td>${g[2]}</td><td>${session() ? `<a href="#log" data-log-game="${esc(g[0])}">logar este jogo</a>` : '<a href="#login">entre para logar</a>'}</td></tr>`).join('') : '<tr><td colspan="4"><b>Nenhum título localizado.</b> Tente remover pontuação, subtítulos ou números romanos.</td></tr>';
      document.querySelectorAll('[data-log-game]').forEach(a => a.addEventListener('click', () => sessionStorage.setItem('loglab_preselect', a.dataset.logGame)));
    }
    document.getElementById('catalog-search').addEventListener('submit', e => { e.preventDefault(); draw(); });
    document.getElementById('exact-box').addEventListener('change', draw);
    document.getElementById('catalog-clear').addEventListener('click', () => location.reload());
    draw();
  }

  function renderLog() {
    if (!requireLogin()) return;
    crumb.textContent = 'membro > adicionar jogo';
    selectedGame = sessionStorage.getItem('loglab_preselect') || '';
    sessionStorage.removeItem('loglab_preselect');
    page.innerHTML = title('Logar um Jogo', 'Passo 1: localize o título. Passo 2: clique no título. Passo 3: preencha o registro.') + `
      <div class="log-layout">
        <section class="panel"><h2>1. Localizar no catálogo</h2><div class="panel-body">
          <input id="log-search" type="text" style="width:290px" placeholder="digite parte do nome"> <button id="log-search-btn">PESQUISAR</button>
          <div class="search-hint">A lista abaixo não atualiza enquanto você digita. Use PESQUISAR.</div>
          <select id="game-search-results" size="12"></select>
          <p class="very-small">Clique uma vez para selecionar. Duplo clique não adiciona automaticamente.</p>
        </div></section>
        <section class="panel"><h2>2. Informações do registro</h2><div class="panel-body">
          <div id="selected-game-box" class="${selectedGame ? '' : 'empty'}">${selectedGame ? esc(selectedGame) : 'Nenhum jogo selecionado. Selecione um item na coluna à esquerda.'}</div>
          <form id="log-form" class="log-options">
            <label><b>Situação:</b><br><select name="status"><option value="played">Jogado</option><option value="completed">Terminado</option><option value="playing">Jogando agora</option><option value="abandoned">Abandonado</option><option value="backlog">Na pilha</option><option value="wishlist">Quero jogar</option></select></label>
            <label><b>Nota:</b><br><select name="rating"><option value="">sem nota</option>${Array.from({length:11},(_,i)=>`<option value="${10-i}">${10-i} / 10</option>`).join('')}</select></label>
            <label><b>Data do registro:</b><br><input type="date" name="date" value="${today()}"></label>
            <label><b>Observação pública:</b><br><textarea name="note" maxlength="180"></textarea></label>
            <label><input type="checkbox" name="replay"> considero que pretendo rejogar futuramente</label>
            <p><button class="big-old-button primary" type="submit">ENVIAR REGISTRO</button></p>
          </form>
          <div class="notice-box">Registros não podem ser editados nesta tela depois de enviados. Para alterar um registro, abra seu perfil, localize o jogo e utilize a opção correspondente.</div>
        </div></section>
      </div>`;

    const input = document.getElementById('log-search');
    const results = document.getElementById('game-search-results');
    function searchLog() {
      const q = input.value.trim().toLowerCase();
      lastSearch = GAMES.filter(g => !q || g[0].toLowerCase().includes(q)).slice(0,45);
      results.innerHTML = lastSearch.map(g => `<option value="${esc(g[0])}">${esc(g[0])} (${g[2]})</option>`).join('');
      if (!lastSearch.length) results.innerHTML = '<option disabled>NENHUM RESULTADO</option>';
    }
    results.addEventListener('change', () => {
      selectedGame = results.value;
      const box = document.getElementById('selected-game-box');
      box.textContent = selectedGame; box.classList.remove('empty');
    });
    document.getElementById('log-search-btn').addEventListener('click', searchLog);
    searchLog();
    if (selectedGame) input.value = selectedGame;

    document.getElementById('log-form').addEventListener('submit', e => {
      e.preventDefault();
      if (!selectedGame) { alert('ERRO: nenhum título foi selecionado na etapa 1. Digitar o nome no campo de pesquisa não conta como seleção.'); return; }
      const fd = new FormData(e.target);
      const item = { id:uid(), game:selectedGame, status:String(fd.get('status')), rating:String(fd.get('rating')), date:String(fd.get('date') || today()), note:String(fd.get('note') || ''), replay:fd.get('replay') === 'on' };
      const arr = logs(); arr.push(item); writeJSON('loglab_logs', arr);
      alert('Registro recebido com sucesso. Algumas áreas do perfil podem levar de 2 a 4 minutos para refletir a alteração.');
      location.hash = '#profile';
    });
  }

  function defaultPosition(index) {
    const cols = [328, 510, 710, 935, 1180, 1420];
    const x = cols[index % cols.length] + ((index * 37) % 91) - 30;
    const y = 35 + ((index * 121) % 790);
    return {x, y};
  }

  function renderProfile() {
    if (!requireLogin()) return;
    crumb.textContent = 'membro > perfil público';
    const u = user();
    const arr = logs();
    const pos = positions();
    page.innerHTML = title(`${esc(u.username)} — Perfil`, 'Área pública do membro. Os jogos podem ser reorganizados manualmente.') + `
      <div class="profile-toolbar">
        <button id="auto-organize">ORGANIZAR AUTOMATICAMENTE</button>
        <button id="reset-positions">restaurar posições</button>
        <span class="rightish">Itens exibidos: <b>${arr.length}</b> &nbsp; | &nbsp; <a href="#log">adicionar jogo</a></span>
      </div>
      <div id="profile-yard-shell"><div id="profile-yard">
        <div class="profile-id-card"><h2>${esc(u.username)}</h2><div class="id-meta">Membro nº ${u.memberNo}<br>Desde ${esc(u.joined)}<br>Gênero favorito: ${esc(u.favoriteGenre || 'Não informado')}<br><br>${esc(u.bio || '')}<br><a href="#settings">editar informações</a></div></div>
        ${arr.length ? arr.map((l,i) => {
          const p = pos[l.id] || defaultPosition(i);
          return `<div class="drag-game status-${esc(l.status)}" data-id="${esc(l.id)}" style="left:${p.x}px;top:${p.y}px"><div class="game-name">${esc(l.game)}</div><div class="game-meta">${esc(STATUS[l.status] || l.status)}${l.rating ? ` • ${esc(l.rating)}/10` : ''} • ${esc(l.date)}</div></div>`;
        }).join('') : '<div class="empty-yard"><b>Este membro ainda não posicionou nenhum jogo no perfil.</b><br><br>Depois de logar um título, ele aparecerá em algum lugar desta área. A posição inicial pode variar de acordo com a quantidade de itens já cadastrados.</div>'}
      </div></div>
      <div class="very-small" style="margin-top:5px">Para mover: clique e arraste pelo bloco do jogo. A posição é gravada ao soltar. Em telas menores pode ser necessário usar as barras de rolagem horizontal e vertical.</div>`;

    document.querySelectorAll('.drag-game').forEach(el => {
      el.addEventListener('pointerdown', e => {
        el.setPointerCapture(e.pointerId);
        const r = el.getBoundingClientRect();
        dragState = {el, id:el.dataset.id, dx:e.clientX-r.left, dy:e.clientY-r.top, pointerId:e.pointerId};
        el.style.zIndex = '20';
      });
      el.addEventListener('pointermove', e => {
        if (!dragState || dragState.el !== el) return;
        const yard = document.getElementById('profile-yard').getBoundingClientRect();
        let x = e.clientX - yard.left - dragState.dx;
        let y = e.clientY - yard.top - dragState.dy;
        x = Math.max(0, Math.min(1650, x)); y = Math.max(0, Math.min(925, y));
        el.style.left = x + 'px'; el.style.top = y + 'px';
      });
      el.addEventListener('pointerup', e => {
        if (!dragState || dragState.el !== el) return;
        const p = positions(); p[el.dataset.id] = {x:parseInt(el.style.left,10), y:parseInt(el.style.top,10)}; writeJSON('loglab_positions',p);
        el.style.zIndex = '2'; dragState = null;
      });
      el.addEventListener('dblclick', () => editLog(el.dataset.id));
    });
    document.getElementById('auto-organize').addEventListener('click', () => {
      if (!arr.length) return alert('Não há itens suficientes para executar a organização automática.');
      if (!confirm('O organizador tentará distribuir os jogos para melhorar a leitura. As posições atuais serão substituídas. Continuar?')) return;
      const p = {};
      arr.forEach((l,i) => p[l.id] = {x:320 + Math.floor(Math.random()*1260), y:25 + Math.floor(Math.random()*840)});
      writeJSON('loglab_positions',p);
      renderProfile();
      showToast('Organização automática concluída. Verifique manualmente possíveis sobreposições.');
    });
    document.getElementById('reset-positions').addEventListener('click', () => {
      if (confirm('Restaurar a distribuição inicial? Esta ação não pode ser desfeita.')) { writeJSON('loglab_positions',{}); renderProfile(); }
    });
  }

  function editLog(id) {
    const arr = logs(); const item = arr.find(x => x.id === id); if (!item) return;
    const action = prompt(`Registro: ${item.game}\n\nDigite uma opção:\n1 = alterar nota\n2 = alterar situação\n3 = remover do perfil\n\nOutros valores cancelam.`, '1');
    if (action === '1') {
      const n = prompt('Nova nota (0 a 10) ou deixe vazio para remover:', item.rating || '');
      if (n === null) return;
      if (n !== '' && (isNaN(Number(n)) || Number(n)<0 || Number(n)>10)) return alert('Valor fora do intervalo permitido.');
      item.rating = n; writeJSON('loglab_logs',arr); renderProfile();
    } else if (action === '2') {
      const s = prompt('Digite exatamente uma situação: played, completed, playing, abandoned, backlog ou wishlist', item.status);
      if (!STATUS[s]) return alert('Situação não reconhecida. Nenhuma alteração foi feita.');
      item.status = s; writeJSON('loglab_logs',arr); renderProfile();
    } else if (action === '3') {
      if (confirm('Remover este registro permanentemente do perfil?')) {
        writeJSON('loglab_logs', arr.filter(x=>x.id!==id));
        const p = positions(); delete p[id]; writeJSON('loglab_positions',p); renderProfile();
      }
    }
  }

  function renderStats() {
    if (!requireLogin()) return;
    crumb.textContent = 'membro > estatísticas';
    const arr = logs();
    const count = s => arr.filter(x=>x.status===s).length;
    const rated = arr.filter(x=>x.rating !== '' && !isNaN(Number(x.rating)));
    const avg = rated.length ? (rated.reduce((a,b)=>a+Number(b.rating),0)/rated.length).toFixed(2) : '—';
    const completed = count('completed');
    const completion = arr.length ? Math.round((completed/arr.length)*100) : 0;
    const favorite = (() => {
      const map={}; arr.forEach(l=>{const g=GAMES.find(x=>x[0]===l.game); if(g) map[g[1]]=(map[g[1]]||0)+1;});
      return Object.keys(map).sort((a,b)=>map[b]-map[a])[0] || 'indefinido';
    })();
    page.innerHTML = title('Estatísticas do membro', 'Cálculos gerados a partir dos registros disponíveis neste navegador.') + `
      <div class="stats-grid">
        <div class="stat-box"><h3>Total de jogos</h3><div class="stat-number">${arr.length}</div><div class="stat-caption">inclui jogos apenas desejados e jogos abandonados</div></div>
        <div class="stat-box"><h3>Média das notas</h3><div class="stat-number">${avg}</div><div class="stat-caption">calculada somente entre itens com nota informada</div></div>
        <div class="stat-box"><h3>Índice de conclusão</h3><div class="stat-number">${completion}%</div><div class="fake-bar"><span style="width:${Math.min(100,completion)}%"></span></div></div>
        <div class="stat-box"><h3>Terminados</h3><div class="stat-number">${completed}</div><div class="stat-caption">situação atual: terminado</div></div>
        <div class="stat-box"><h3>Abandonados</h3><div class="stat-number">${count('abandoned')}</div><div class="stat-caption">não inclui itens que você apenas não abriu recentemente</div></div>
        <div class="stat-box"><h3>Categoria mais frequente</h3><div class="stat-number" style="font-size:20px">${esc(favorite)}</div><div class="stat-caption">com base na classificação principal do catálogo</div></div>
      </div>
      <div class="panel" style="margin-top:12px"><h3>Distribuição por situação</h3><div class="panel-body"><table class="mini-table"><tr><th>Jogado</th><th>Terminado</th><th>Jogando</th><th>Abandonado</th><th>Na pilha</th><th>Quero jogar</th></tr><tr>${['played','completed','playing','abandoned','backlog','wishlist'].map(s=>`<td>${count(s)}</td>`).join('')}</tr></table></div></div>
      <div class="notice-box">As estatísticas são atualizadas quando esta página é aberta. Manter a página aberta não atualiza os valores automaticamente.</div>`;
  }

  function renderSettings() {
    if (!requireLogin()) return;
    crumb.textContent = 'membro > preferências > edição';
    const u = user();
    page.innerHTML = title('Preferências e dados da conta', 'Algumas alterações exigem recarregar o site para serem aplicadas completamente.') + `
      <div class="settings-warning"><b>Atenção:</b> não feche esta página enquanto uma alteração estiver sendo processada.</div>
      <div class="panel"><h2>Informações do perfil</h2><div class="panel-body"><form id="profile-settings"><table class="form-table">
        <tr><th>Nome de usuário:</th><td><input type="text" value="${esc(u.username)}" disabled><div class="field-note">Alterações de nome não estão disponíveis na versão atual.</div></td></tr>
        <tr><th>Apresentação:</th><td><textarea name="bio" maxlength="140">${esc(u.bio||'')}</textarea></td></tr>
        <tr><th>Gênero favorito:</th><td><select name="favoriteGenre">${['Não informado','RPG','Ação','Aventura','Puzzle','Visual Novel','Plataforma','Simulação','Esporte','Party'].map(x=>`<option ${x===(u.favoriteGenre||'Não informado')?'selected':''}>${x}</option>`).join('')}</select></td></tr>
        <tr><th>Estilo visual:</th><td><select name="theme"><option>Padrão do LogLab</option><option>Compatibilidade LCD</option><option>Web Safe Colors</option><option>Alto contraste (experimental)</option></select><div class="field-note">O estilo visual selecionado pode não afetar todas as seções.</div></td></tr>
      </table><p><button class="big-old-button primary">SALVAR ALTERAÇÕES</button></p></form></div></div>
      <div class="panel"><h3>Operações da conta</h3><div class="panel-body">
        <button id="export-data">exportar meus dados</button> <button id="forget-layout">esquecer posições do perfil</button>
        <hr class="bad-separator"><button id="delete-account" class="big-old-button danger">EXCLUIR CONTA</button>
        <span style="margin-left:137px"><a href="#home" id="settings-logout">sair da conta</a></span>
      </div></div>`;
    document.getElementById('profile-settings').addEventListener('submit', e => {
      e.preventDefault(); const fd=new FormData(e.target); const n={...u,bio:String(fd.get('bio')||''),favoriteGenre:String(fd.get('favoriteGenre')||'Não informado')}; writeJSON('loglab_user',n); showToast('Alterações salvas. Algumas páginas podem exibir a versão anterior até serem abertas novamente.');
    });
    document.getElementById('forget-layout').addEventListener('click',()=>{if(confirm('Apagar somente as posições manuais dos jogos?')){writeJSON('loglab_positions',{});showToast('Posições removidas.');}});
    document.getElementById('export-data').addEventListener('click',()=>{
      const payload = JSON.stringify({user:user(),logs:logs(),positions:positions()},null,2);
      const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([payload],{type:'application/json'})); a.download='loglab-export.txt'; a.click(); URL.revokeObjectURL(a.href);
    });
    document.getElementById('settings-logout').addEventListener('click',e=>{e.preventDefault();sessionStorage.removeItem('loglab_session');updateChrome();location.hash='#home';});
    document.getElementById('delete-account').addEventListener('click',()=>{
      if(!confirm('EXCLUIR CONTA? Todos os jogos registrados neste navegador serão removidos.')) return;
      if(!confirm('Confirma novamente? Esta operação não oferece recuperação automática.')) return;
      ['loglab_user','loglab_logs','loglab_positions'].forEach(k=>localStorage.removeItem(k));sessionStorage.clear();updateChrome();location.hash='#home';showToast('Conta local removida.');
    });
  }

  function renderHelp() {
    crumb.textContent = 'ajuda > índice geral';
    page.innerHTML = title('Ajuda / Perguntas frequentes', 'Antes de enviar uma solicitação, verifique as perguntas abaixo.') + `
      <div class="help-index"><b>Nesta página:</b><a href="#q-account">Conta</a><a href="#q-password">Senha já utilizada</a><a href="#q-profile">Perfil</a><a href="#q-covers">Capas</a><a href="#q-mobile">Celular</a><a href="#q-sync">Sincronização</a></div>
      <div id="q-account" class="help-q">Como funciona uma conta do LogLab?</div><div class="help-a">Nesta demonstração a conta é armazenada no navegador em uso. Ela não é enviada para um servidor e não acompanha você automaticamente para outro dispositivo.</div>
      <div id="q-password" class="help-q">O cadastro diz que outra pessoa já usa minha senha. Como isso é possível?</div><div class="help-a">Por motivos de privacidade o sistema não fornece informações sobre o outro membro. Escolha outra senha e envie o formulário novamente. Se a mensagem persistir, feche menos abas do navegador.</div>
      <div id="q-profile" class="help-q">Por que os jogos aparecem espalhados no meu perfil?</div><div class="help-a">O perfil livre permite ao membro decidir quais títulos merecem maior destaque. Arraste os blocos para a posição desejada. O botão de organização automática é apenas uma estimativa e pode exigir correções manuais.</div>
      <div id="q-covers" class="help-q">Onde estão as imagens e capas dos jogos?</div><div class="help-a">A exibição de capas foi temporariamente desativada para melhorar compatibilidade e reduzir divergências entre edições regionais.</div>
      <div id="q-mobile" class="help-q">O site cabe na tela do celular?</div><div class="help-a">O layout principal é otimizado para 1024×768 ou superior. Em telas menores utilize a rolagem horizontal do navegador para acessar colunas fora da área visível.</div>
      <div id="q-sync" class="help-q">Por que aparece “sincronização 74%”?</div><div class="help-a">O indicador representa o estado aproximado do catálogo geral e não interfere nos seus registros locais.</div>
      <div class="backline"><a href="#home">&lt;&lt; voltar ao início</a></div>`;
  }

  function renderNotFound() {
    crumb.textContent = 'erro';
    page.innerHTML = title('Página não localizada') + '<div class="form-error">ERRO 404-B: o endereço solicitado não corresponde a uma área ativa do LogLab.</div><p><a href="#home">Retornar para a página inicial</a></p>';
  }

  function route() {
    updateChrome();
    const hash = (location.hash || '#home').split('?')[0];
    const routes = {'#home':renderHome,'#register':renderRegister,'#login':renderLogin,'#games':renderGames,'#log':renderLog,'#profile':renderProfile,'#stats':renderStats,'#settings':renderSettings,'#help':renderHelp};
    (routes[hash] || renderNotFound)();
    document.querySelectorAll('[data-hard-refresh]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();location.reload();}));
    window.scrollTo(0,0);
  }

  function clock() {
    const d = new Date();
    document.getElementById('clock').textContent = 'Hora do servidor: ' + d.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}) + ' BRT';
  }

  window.addEventListener('hashchange', route);
  window.addEventListener('storage', () => { updateChrome(); });
  clock(); setInterval(clock, 30000);
  route();
})();
