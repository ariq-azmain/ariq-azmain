    // Reading time & progress
    (function(){
      const article = document.getElementById('post');
      const readTimeEl = document.getElementById('read-time');
      const calcMinEl = document.getElementById('calc-min');
      const progress = document.getElementById('read-progress');

      function estimate() {
        const text = article.innerText || article.textContent;
        const words = text.trim().split(/\s+/).length;
        const minutes = Math.max(1, Math.round(words / 220));
        readTimeEl.textContent = 'Reading: ' + minutes + ' min';
        calcMinEl.textContent = minutes;
      }

      function updateProgress() {
        const rect = article.getBoundingClientRect();
        const top = Math.max(0, -rect.top);
        const height = rect.height - window.innerHeight;
        const pct = height > 0 ? Math.min(100, Math.round((top / height) * 100)) : 100;
        progress.style.width = pct + '%';
      }

      estimate();
      updateProgress();
      document.addEventListener('scroll', updateProgress, {passive:true});
      window.addEventListener('resize', updateProgress);
    })();

    // Dynamic theme, color & font selection based on topic
    (function(){
      const post = document.getElementById('post');
      const topics = (post.getAttribute('data-topic') || '').toLowerCase().split(/\s+/);
      const topicPill = document.getElementById('topic-pill');
      const topicBadge = document.getElementById('topic-badge');

      const palette = {
        culture: { colorClass:'accent-teal', colorHex:'#20c997', font:'Merriweather, serif', pill:'Culture' },
        memes:   { colorClass:'accent-coral', colorHex:'#ff6b6b', font:'Nunito, sans-serif', pill:'Memes' },
        tech:    { colorClass:'accent-purple', colorHex:'#6f42c1', font:'Poppins, sans-serif', pill:'Tech' },
        food:    { colorClass:'accent-blue', colorHex:'#0d6efd', font:'Merriweather, serif', pill:'Food' }
      };

      let chosen = null;
      for (const t of topics){
        if (palette[t]) { chosen = palette[t]; break; }
      }
      if (!chosen) chosen = palette['culture'];

      document.documentElement.classList.add(chosen.colorClass);
      document.documentElement.style.setProperty('--accent', chosen.colorHex);
      const title = document.querySelector('.title');
      if (title) title.style.fontFamily = chosen.font;

      topicPill.textContent = chosen.pill + ' · Quiet Revolution';
      topicBadge.textContent = chosen.pill;
      topicBadge.style.background = '#eef2ff';
      topicBadge.style.color = chosen.colorHex;
    })();

    // Quiz interactions
    (function(){
      const options = Array.from(document.querySelectorAll('.quiz-option'));
      const resultEl = document.getElementById('quiz-result');
      const scoreEl = document.getElementById('quiz-score');
      let score = 0;
      options.forEach(opt => {
        function handle() {
          if (opt.getAttribute('data-used') === '1') return;
          const val = opt.getAttribute('data-answer');
          opt.setAttribute('aria-pressed','true');
          opt.setAttribute('data-used','1');
          const pts = parseInt(val,10) % 4 + 1;
          score += pts;
          scoreEl.textContent = score;
          const messages = {
            '1':'You fold memory into flavor. Try a tiny spice remix this week.',
            '2':'You craft nudges that ripple. Memes with heart spread quietly but widely.',
            '3':'A local spark fits you — start with a small weekend event.',
            '4':'You hold space; listening can be the gentlest revolution.'
          };
          resultEl.innerHTML = `<div class="mt-2"><strong>Result:</strong> ${messages[val] || 'You are beautifully unpredictable.'}</div>`;
          options.forEach(o => {
            if (o !== opt) o.style.opacity = '.6';
          });
        }
        opt.addEventListener('click', handle);
        opt.addEventListener('keypress', (e) => { if (e.key === 'Enter' || e.key === ' ') { handle(); e.preventDefault(); }});
      });
    })();

    // Playful bitcoin miner (satire)
    (function(){
      const mineBtn = document.getElementById('mine-btn');
      const coolBtn = document.getElementById('cool-btn');
      const chip = document.getElementById('miner-chip');
      const status = document.getElementById('miner-status');
      const hashrate = document.getElementById('hashrate');
      const minedCount = document.getElementById('mined-count');

      if (!mineBtn || !coolBtn) return;

      let mining = false;
      let mined = 0;
      let minerInterval = null;

      function startMining(){
        if (mining) return;
        mining = true;
        status.textContent = 'Mining (satire mode) — hashing...';
        let fakeHash = Math.floor(Math.random()*900) + 100;
        hashrate.textContent = fakeHash + ' H/s';
        chip.style.transform = 'rotate(6deg) scale(1.02)';
        mineBtn.textContent = 'Stop';
        minerInterval = setInterval(() => {
          const delta = Math.random() < 0.06 ? 1 : 0;
          mined += delta;
          minedCount.textContent = 'Mined coins: ' + mined + ' (satirical)';
          const wobble = fakeHash + Math.floor((Math.random()-0.5)*60);
          hashrate.textContent = wobble + ' H/s';
        }, 900);
      }

      function stopMining(){
        mining = false;
        status.textContent = 'Idle miner';
        hashrate.textContent = '0 H/s';
        chip.style.transform = '';
        mineBtn.textContent = 'Mine (just for fun)';
        clearInterval(minerInterval);
      }

      mineBtn.addEventListener('click', () => {
        if (mining) stopMining(); else startMining();
      });

      coolBtn.addEventListener('click', () => {
        mined = Math.max(0, mined - 1);
        minedCount.textContent = 'Mined coins: ' + mined + ' (satirical)';
        chip.animate([{transform:'scale(1.06)'},{transform:'scale(.98)'}],{duration:350,iterations:1});
      });
    })();

    // Share / Copy / Theme toggle
    (function(){
      const shareBtn = document.getElementById('share-btn');
      const copyBtn = document.getElementById('copy-link');
      const toggleBtn = document.getElementById('toggle-theme');

      shareBtn && shareBtn.addEventListener('click', async () => {
        const data = { title: document.title, text: document.querySelector('.title').innerText, url: location.href };
        if (navigator.share) {
          try { await navigator.share(data); } catch(e){ /* ignore */ }
        } else {
          const tw = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(data.text + ' — ' + data.url);
          window.open(tw,'_blank','noopener');
        }
      });

      copyBtn && copyBtn.addEventListener('click', async () => {
        const url = location.href;
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(url);
          copyBtn.innerHTML = '<i class="bi bi-check-lg"></i> Copied';
          setTimeout(()=> copyBtn.innerHTML = '<i class="bi bi-link-45deg"></i> Copy link',1400);
        } else {
          alert('Copy not supported on this browser.');
        }
      });

      toggleBtn && toggleBtn.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (!isDark) {
          document.documentElement.setAttribute('data-theme','dark');
          document.body.style.background = '#071226';
          document.body.style.color = '#e8eef8';
          toggleBtn.querySelector('i').className = 'bi bi-moon-stars';
          document.querySelectorAll('.post, .fun-widget, .related-card').forEach(el => el.style.background = '#071226');
        } else {
          document.documentElement.removeAttribute('data-theme');
          document.body.style.background = '';
          document.body.style.color = '';
          toggleBtn.querySelector('i').className = 'bi bi-brightness-high';
          document.querySelectorAll('.post, .fun-widget, .related-card').forEach(el => el.style.background = '');
        }
      });
    })();

    // Small playful view increment
    (function(){
      const vc = document.getElementById('views-count');
      if (!vc) return;
      let v = parseInt(vc.textContent.replace(/,/g,''),10) || 0;
      setTimeout(()=> {
        v += Math.floor(Math.random()*10) + 3;
        vc.textContent = v.toLocaleString();
      }, 1200);
    })();