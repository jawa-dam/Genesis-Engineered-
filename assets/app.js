/* Genesis Engineered 2.0 — portal, progression, sound, unlock timers */
const TOTAL_DAYS = 6;
const STORAGE_KEY = 'gei-progress';
const TIMER_SECONDS = 5 * 60;

/* Replace these transparent PNG URLs whenever you want new artwork. */
const HERO_IMAGES = [
  'assets/images/hero-1.png',
  'assets/images/hero-2.png',
  'assets/images/hero-3.png',
  'assets/images/hero-4.png',
  'assets/images/hero-5.png',
  'assets/images/hero-6.png'
];

const getProgress = () => Math.max(0, Math.min(TOTAL_DAYS, Number(localStorage.getItem(STORAGE_KEY)) || 0));
function updateProgress(value = getProgress()) {
  value = Math.max(0, Math.min(TOTAL_DAYS, Number(value) || 0));
  const fill = document.querySelector('#progressFill');
  const count = document.querySelector('#progressCount');
  if (fill) { fill.style.width = `${value / TOTAL_DAYS * 100}%`; fill.classList.toggle('active', value > 0); }
  if (count) { count.textContent = `${value}/${TOTAL_DAYS}`; count.classList.toggle('progress-excited', value > 0); }
}
function activateProgress(day) {
  const next = Math.max(getProgress(), Number(day) || 0);
  localStorage.setItem(STORAGE_KEY, next); updateProgress(next);
  ['#progressFill','#progressCount'].forEach(selector => { const el=document.querySelector(selector); if(el){el.classList.remove('progress-excited');void el.offsetWidth;el.classList.add('progress-excited');} });
}
function completeDay(day) { activateProgress(day); }

function chooseRandomHero() {
  const hero = document.querySelector('#heroImage'); if (!hero || !HERO_IMAGES.length) return;
  hero.src = HERO_IMAGES[Math.floor(Math.random() * HERO_IMAGES.length)];
  hero.addEventListener('error', () => { hero.alt='Genesis Engineered artwork could not be loaded'; hero.style.display='none'; }, {once:true});
}

function playTone(day, type = 'chime') {
  const AudioContext = window.AudioContext || window.webkitAudioContext; if (!AudioContext) return;
  const audio = new AudioContext(), now = audio.currentTime, master = audio.createGain();
  master.gain.setValueAtTime(.0001, now); master.gain.exponentialRampToValueAtTime(type === 'water' ? .18 : .2, now+.02); master.gain.exponentialRampToValueAtTime(.0001, now+(type==='water'? .7 : .45)); master.connect(audio.destination);
  if (type === 'water') {
    const buffer=audio.createBuffer(1,audio.sampleRate*.55,audio.sampleRate), data=buffer.getChannelData(0);
    for(let i=0;i<data.length;i++) data[i]=(Math.random()*2-1)*Math.pow(1-i/data.length,.8);
    const noise=audio.createBufferSource(), filter=audio.createBiquadFilter(); noise.buffer=buffer; filter.type='lowpass'; filter.frequency.setValueAtTime(1500,now); filter.frequency.exponentialRampToValueAtTime(280,now+.6); noise.connect(filter); filter.connect(master); noise.start(now);
    const osc=audio.createOscillator(); osc.type='sine'; osc.frequency.setValueAtTime(120+day*14,now); osc.frequency.exponentialRampToValueAtTime(55,now+.65); osc.connect(master); osc.start(now); osc.stop(now+.7);
  } else {
    const osc=audio.createOscillator(); osc.type='sine'; osc.frequency.setValueAtTime(day===0?330:210+day*30,now); osc.frequency.exponentialRampToValueAtTime(day===0?165:360+day*20,now+.25); osc.connect(master); osc.start(now); osc.stop(now+.5);
  }
  setTimeout(()=>audio.close(),900);
}
function playRubble() {
  const AudioContext=window.AudioContext||window.webkitAudioContext; if(!AudioContext)return; const audio=new AudioContext(),now=audio.currentTime,master=audio.createGain(); master.gain.setValueAtTime(.0001,now);master.gain.exponentialRampToValueAtTime(.22,now+.02);master.gain.exponentialRampToValueAtTime(.0001,now+.55);master.connect(audio.destination);
  const buffer=audio.createBuffer(1,audio.sampleRate*.42,audio.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*Math.pow(1-i/data.length,2.4);const noise=audio.createBufferSource(),filter=audio.createBiquadFilter();noise.buffer=buffer;filter.type='lowpass';filter.frequency.setValueAtTime(720,now);filter.frequency.exponentialRampToValueAtTime(90,now+.4);noise.connect(filter);filter.connect(master);noise.start(now);[55,73,98].forEach((f,i)=>{const o=audio.createOscillator(),g=audio.createGain();o.frequency.value=f;o.frequency.exponentialRampToValueAtTime(f*.42,now+.45+i*.05);g.gain.setValueAtTime(.0001,now+i*.05);g.gain.exponentialRampToValueAtTime(.34,now+.025+i*.05);g.gain.exponentialRampToValueAtTime(.0001,now+.5+i*.05);o.connect(g);g.connect(master);o.start(now+i*.05);o.stop(now+.6)});setTimeout(()=>audio.close(),800);
}

function showToast(message, kind='locked') { let toast=document.querySelector('#geiToast'); if(!toast){toast=document.createElement('div');toast.id='geiToast';document.body.appendChild(toast)} toast.className=kind;toast.textContent=message;toast.classList.remove('show');void toast.offsetWidth;toast.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>toast.classList.remove('show'),1800); }
function bindDaySounds() {
  document.querySelectorAll('.day-card').forEach(card=>card.addEventListener('click',event=>{
    const day=Number(card.className.match(/day-(\d+)/)?.[1]||0);
    if(day>1 && localStorage.getItem(`gei-complete-${day-1}`)!=='true'){event.preventDefault();playTone(0,'chime');card.classList.add('locked-tap');setTimeout(()=>card.classList.remove('locked-tap'),650);showToast(`DAY ${day} LOCKED · COMPLETE DAY ${day-1} FIRST`);return;}
    activateProgress(day); if(day===1)playRubble();else playTone(day); card.classList.add('activating'); event.preventDefault(); setTimeout(()=>{window.location.href=card.href},220);
  }));
}

function startWater() { const canvas=document.querySelector('#waterCanvas');if(!canvas||!canvas.getContext)return;const ctx=canvas.getContext('2d');let width,height,dpr,waves=[];const reduce=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;function resize(){width=canvas.clientWidth;height=canvas.clientHeight;dpr=Math.min(devicePixelRatio||1,2);canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);waves=Array.from({length:Math.max(5,Math.round(width/120))},(_,i)=>({y:height*(.76+i*.045),amp:3+i*1.5,length:90+i*35,speed:.25+i*.07,phase:Math.random()*7}))}function draw(time){ctx.clearRect(0,0,width,height);const t=reduce?0:time/1000;waves.forEach((w,i)=>{ctx.beginPath();for(let x=-20;x<=width+20;x+=8){const y=w.y+Math.sin(x/w.length+t*w.speed+w.phase)*w.amp;x===-20?ctx.moveTo(x,y):ctx.lineTo(x,y)}ctx.strokeStyle=`rgba(${i%3===0?'190,246,255':'65,184,231'},${.13-i*.012})`;ctx.lineWidth=i%3===0?1.5:1;ctx.stroke()});if(!reduce)requestAnimationFrame(draw)}resize();addEventListener('resize',resize);draw(0); }

function initDayPage() {
  const day=Number(document.body.dataset.day); if(!day)return;
  activateProgress(day); const key=`gei-unlock-${day}`, prior=day-1, unlocked=day===1||localStorage.getItem(`gei-complete-${prior}`)==='true';
  const panel=document.querySelector('#unlockPanel'); if(!panel)return;
  if(!unlocked){panel.innerHTML='<strong>DAY LOCKED</strong><p>Complete the previous day in numerical order to access this system.</p><a href="index.html#portal">Return to portal</a>';panel.classList.add('is-locked');return;}
  if(localStorage.getItem(key)!=='done'&&!localStorage.getItem(key)){localStorage.setItem(key,String(Date.now()+TIMER_SECONDS*1000));}
  const timer=panel.querySelector('#countdown'), skip=panel.querySelector('#speedTimer'), message=panel.querySelector('#timerMessage'); let last=0;
  const effects=['Water system calibrating…','Mountain signal detected…','Blueprint energy rising…','The architecture is waking…','Creation sequence holding…','A new horizon is forming…'];
  function render(){let left=Math.max(0,Math.ceil((Number(localStorage.getItem(key))-Date.now())/1000));if(localStorage.getItem(key)==='done')left=0;const min=String(Math.floor(left/60)).padStart(2,'0'),sec=String(left%60).padStart(2,'0');if(timer)timer.textContent=`${min}:${sec}`;if(left===0){localStorage.setItem(key,'done');localStorage.setItem(`gei-complete-${day}`,'true');if(day<TOTAL_DAYS){message.textContent=`DAY ${day+1} UNLOCKED · The next gate is open.`;skip.disabled=true;}else message.textContent='THE BLUEPRINT IS COMPLETE · All six days are now open.';panel.classList.add('unlocked');return}message.textContent=effects[Math.floor(Date.now()/7000)%effects.length];setTimeout(render,1000)}
  skip?.addEventListener('click',()=>{let left=Math.max(0,Number(localStorage.getItem(key))-Date.now());localStorage.setItem(key,String(Date.now()+Math.max(0,left-6000)));playTone(day,'water');showToast('6 SECONDS REMOVED · WATER SYSTEM ACCELERATED','water');}); render();
}

document.addEventListener('DOMContentLoaded',()=>{updateProgress();chooseRandomHero();startWater();bindDaySounds();initDayPage();const gate=document.querySelector('#liftGate'),welcome=document.querySelector('#welcome'),portal=document.querySelector('#portal'),close=document.querySelector('#closePortal');if(gate)gate.addEventListener('click',()=>{welcome.hidden=true;portal.hidden=false;portal.scrollIntoView({behavior:'smooth'});history.replaceState(null,'','#portal')});if(close)close.addEventListener('click',()=>{portal.hidden=true;welcome.hidden=false;welcome.scrollIntoView({behavior:'smooth'});history.replaceState(null,'',location.pathname)});if(location.hash==='#portal'&&welcome&&portal){welcome.hidden=true;portal.hidden=false}});
