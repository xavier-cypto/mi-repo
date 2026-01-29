// Basic interactivity for the betting starter site
document.addEventListener('DOMContentLoaded', () => {
  // Populate year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Mobile menu
  const burger = document.getElementById('burger');
  const mainNav = document.getElementById('main-nav');
  if (burger) {
    burger.addEventListener('click', () => {
      mainNav.classList.toggle('open');
      mainNav.style.display = mainNav.classList.contains('open') ? 'block' : '';
    });
  }

  // Modals
  const betSlip = document.getElementById('bet-slip');
  const openBet = document.getElementById('open-bet-slip');
  const closeBet = document.getElementById('close-bet-slip');
  const signupBtn = document.getElementById('signup-btn');
  const loginBtn = document.getElementById('login-btn');
  const authModal = document.getElementById('auth-modal');
  const closeAuth = document.getElementById('close-auth');
  const heroSignup = document.getElementById('hero-signup');

  function openModal(modal){
    modal.setAttribute('aria-hidden', 'false');
  }
  function closeModal(modal){
    modal.setAttribute('aria-hidden', 'true');
  }
  if (openBet && closeBet && betSlip) {
    openBet.addEventListener('click', ()=> openModal(betSlip));
    closeBet.addEventListener('click', ()=> closeModal(betSlip));
  }
  if (signupBtn) signupBtn.addEventListener('click', ()=> openModal(authModal));
  if (heroSignup) heroSignup.addEventListener('click', ()=> openModal(authModal));
  if (loginBtn) loginBtn.addEventListener('click', ()=> openModal(authModal));
  if (closeAuth) closeAuth.addEventListener('click', ()=> closeModal(authModal));

  // Add odds click -> bet slip
  const odds = Array.from(document.querySelectorAll('.odd'));
  const betsList = document.getElementById('bets-list');
  const stakeInput = document.getElementById('stake');
  const potential = document.getElementById('potential');
  let selections = [];

  function renderBets(){
    if (!betsList) return;
    betsList.innerHTML = '';
    if (selections.length === 0) {
      betsList.innerHTML = '<p class="empty">No selections yet. Click an odd to add a selection.</p>';
      potential.textContent = '0.00';
      return;
    }
    selections.forEach((s, idx) => {
      const el = document.createElement('div');
      el.className = 'bet-line';
      el.style.display = 'flex';
      el.style.justifyContent = 'space-between';
      el.style.alignItems = 'center';
      el.style.padding = '8px 0';
      el.innerHTML = `<div><strong>${s.label}</strong><div style="color:#94a3b8;font-size:13px">${s.odd}</div></div>
                      <div>
                        <button data-idx="${idx}" class="remove" style="background:transparent;border:0;color:#ff8a00;cursor:pointer">Remove</button>
                      </div>`;
      betsList.appendChild(el);
    });

    // attach remove handlers
    Array.from(betsList.querySelectorAll('.remove')).forEach(btn=>{
      btn.addEventListener('click', (e)=>{
        const i = parseInt(e.currentTarget.getAttribute('data-idx'),10);
        selections.splice(i,1);
        renderBets();
      });
    });

    updatePotential();
  }

  function updatePotential(){
    const stake = parseFloat(stakeInput?.value || 0) || 0;
    const totalOdds = selections.reduce((acc, s)=> acc * parseFloat(s.odd) || acc + parseFloat(s.odd), selections.length === 1 ? parseFloat(selections[0].odd) : selections.reduce((a,b)=>a * b.odd, 1));
    // if single selection
    let oddsVal = 0;
    if (selections.length === 0) oddsVal = 0;
    else if (selections.length === 1) oddsVal = parseFloat(selections[0].odd);
    else {
      oddsVal = selections.reduce((acc, s)=> acc * parseFloat(s.odd), 1);
    }
    const ret = (stake * oddsVal).toFixed(2);
    potential.textContent = isNaN(ret) ? '0.00' : ret;
  }

  odds.forEach(o => {
    o.addEventListener('click', (e) => {
      // Extract label + odd value from button
      const label = o.innerText.split('\n')[0].trim();
      const oddSpan = o.querySelector('span');
      const oddValue = oddSpan ? oddSpan.textContent.trim() : o.innerText.trim();
      selections.push({label, odd: oddValue});
      renderBets();
      openModal(betSlip);
    });
  });

  if (stakeInput) {
    stakeInput.addEventListener('input', updatePotential);
  }

  // Place bet (demo)
  const placeBet = document.getElementById('place-bet');
  if (placeBet) {
    placeBet.addEventListener('click', () => {
      if (selections.length === 0) {
        alert('Add a selection first.');
        return;
      }
      // In real app: send to backend
      alert(`Bet placed! Selections: ${selections.length}\nStake: ${stakeInput.value}\nPotential: ${potential.textContent}`);
      selections = [];
      renderBets();
      closeModal(betSlip);
    });
  }

  // Simple signup form action (demo)
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // In production: send to API
      const email = document.getElementById('email').value;
      alert(`Account created for ${email} (demo).`);
      closeModal(authModal);
    });
  }
});
