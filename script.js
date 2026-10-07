const G='Gameplay/';
const projects=[
{t:'Orbit Defenders',g:'Roguelite',y:2025,p:'PC',d:'BYOG Game Jam 2025 entry. Orbit the Earth in a spaceship, shoot falling asteroids and collect the materials they drop, in a roguelite take on Space Invaders and Asteroids.',f:['Endless','Skill-based','Game jam'],img:'Orbit Defenders.jpg',vid:'Orbit Defenders Gameplay.mp4'},
{t:'Bubble UP',g:'Hypercasual',y:2024,p:'PC',d:'Swipe a bubble upward past fish and obstacles. The focus was smooth, responsive controls and level pacing that invites quick retries. Built in 48 hours.',f:['2D','Level based','48 hours'],img:'Bubble UP.jpg',vid:'Bubble UP Gameplay.mp4'},
{t:'Maze Runner',g:'3D Puzzle',y:2024,p:'PC',d:'A time-trial maze game built around one question: how do you keep players coming back? Mazes grow in size and difficulty, and friends compete for the fastest time.',f:['Time trial','Competitive','3D'],img:'Maze Runner Gameplay.jpg',vid:'Maze Runner Gameplay.mp4'},
{t:'VR Golf',g:'VR Sports',y:2023,p:'PC (VR)',d:'Three courses, as few strokes as possible. The main challenge was believable ball physics driven by swing strength and angle.',f:['Immersive VR','Skill-based','Physics'],img:'VR Golf Gameplay.jpg',vid:'VR Golf Gameplay.mp4'},
{t:'HIDE',g:'2D Platformer',y:2023,p:'PC',d:'A story-driven platformer inspired by Sqube Darkness, built around a core hiding ability.',f:['Narrative','Stealth'],img:'HIDE_Gameplay.jpg',vid:'HIDE Gameplay.mp4'},
{t:'Fire Propagation',g:'Research demo',y:2022,p:'PC',d:'Thesis mechanic simulating fire spread across cells, driven by wind speed and direction, terrain moisture and flammability.',f:['Thesis','Systems','Environment'],img:'Fire Propagation Gameplay.jpg',vid:'Fire Propagation Gameplay.mp4'},
{t:'Marathon Runner',g:'3D Endless Runner',y:2022,p:'PC',d:'A Subway Surfers style runner with a twist: keep an eye on your hydration and grab bottles to stay in the race.',f:['Endless','Procedural','Competitive'],img:'Marathon Runner.jpg',vid:null},
{t:'Into the Dead: Remake',g:'Action Survival',y:2021,p:'PC',d:'My practice remake of Into the Dead, with procedural generation and an endless mode.',f:['Single player','Procedural','Endless'],img:'Into the Dead.jpg',vid:'Into the Dead - Remake Gameplay.mp4'},
{t:'Do You Suck?',g:'2D Platformer',y:2021,p:'PC',d:'A 2D parkour rage platformer in the spirit of Happy Wheels: reach the end goal if you can.',f:['2D','Level based','Rage game'],img:'Do You Suck Gameplay.jpg',vid:'Do You Suck Gameplay.mp4'}];

const $=s=>document.querySelector(s),pad=n=>String(n).padStart(2,'0');
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const el=(h)=>{const d=document.createElement('div');d.innerHTML=h.trim();return d.firstChild};

/* Level select */
const lvls=$('#lvls'),panel=$('#panel');let cur=0;
projects.forEach((p,i)=>{
  const b=el(`<button class="lvl" role="option" aria-selected="false"><img src="${G+p.img}" alt="" loading="lazy"><span><b>LEVEL ${pad(i+1)}</b>${p.t}</span></button>`);
  b.onclick=()=>select(i);lvls.append(b);
});
function select(i,focus){
  cur=i;const p=projects[i];
  [...lvls.children].forEach((b,j)=>b.setAttribute('aria-selected',j===i));
  if(focus)lvls.children[i].focus();
  const media=p.vid?`<video src="${G+p.vid}" poster="${G+p.img}" controls muted loop playsinline preload="none"></video>`:`<img src="${G+p.img}" alt="${p.t} screenshot">`;
  panel.innerHTML=`<div class="media">${media}</div><div class="info"><span class="meta">LEVEL ${pad(i+1)} // ${p.y} // ${p.p}</span><h3>${p.t}</h3><p>${p.d}</p><ul class="tags">${[p.g,...p.f].map(x=>`<li>${x}</li>`).join('')}</ul></div>`;
}
lvls.addEventListener('keydown',e=>{
  const n=projects.length;
  if(e.key==='ArrowRight'||e.key==='ArrowDown'){e.preventDefault();select((cur+1)%n,true)}
  if(e.key==='ArrowLeft'||e.key==='ArrowUp'){e.preventDefault();select((cur+n-1)%n,true)}
});
select(0);

/* HUD */
const secs=[...document.querySelectorAll('section')];
function hud(){
  const max=document.documentElement.scrollHeight-innerHeight,pr=max>0?scrollY/max:0;
  $('#xp').style.width=pr*100+'%';
  $('.xp').setAttribute('aria-valuenow',Math.round(pr*100));
  $('#lvl').textContent=pad(1+Math.floor(pr*9));
  let s=secs[0];secs.forEach(x=>{if(x.getBoundingClientRect().top<innerHeight*.4)s=x});
  $('#stage').textContent='// '+s.dataset.stage;
}
addEventListener('scroll',hud,{passive:true});hud();

/* Typewriter */
const words=['Gameplay programming & prototyping','Game & level design','Balancing & systems','Monetization strategies','Metric analysis','Web development'];
const tp=$('#type');let wi=0,ci=0,del=false;
function tick(){
  const w=words[wi];
  tp.textContent=w.slice(0,ci);
  if(!del&&ci===w.length){del=true;return setTimeout(tick,1600)}
  if(del&&ci===0){del=false;wi=(wi+1)%words.length}
  ci+=del?-1:1;setTimeout(tick,del?25:55);
}
reduce?tp.textContent=words[0]:tick();

/* Coins */
let got=0;
const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2600)};
secs.slice(0,5).forEach((s,i)=>{
  s.style.position='relative';
  const c=el(`<button class="coin" aria-label="Collect coin"></button>`);
  c.style.left=(12+Math.random()*76)+'%';c.style.top=(20+Math.random()*60)+'%';
  c.onclick=()=>{c.classList.add('got');got++;$('#coins').textContent=got;
    toast(got===5?'All coins found! Hit me up, Player 02.':'Coin collected: '+got+'/5')};
  s.append(c);
});

/* Background: dot grid that lights up near the cursor */
const cv=$('#bg'),cx=cv.getContext('2d');let W,H,m={x:-999,y:-999};
const size=()=>{W=cv.width=innerWidth;H=cv.height=innerHeight};size();addEventListener('resize',size);
addEventListener('pointermove',e=>{m.x=e.clientX;m.y=e.clientY});
function draw(t){
  cx.clearRect(0,0,W,H);const gap=36;
  for(let x=gap/2;x<W;x+=gap)for(let y=gap/2;y<H;y+=gap){
    const d=Math.hypot(x-m.x,y-m.y),near=Math.max(0,1-d/220);
    const wave=.5+.5*Math.sin(x*.01+y*.012+t*.0008);
    cx.fillStyle=`rgba(92,240,74,${.07+wave*.05+near*.7})`;
    const r=1.2+near*2.6;cx.fillRect(x-r/2,y-r/2,r,r);
  }
  if(!reduce)requestAnimationFrame(draw);
}
requestAnimationFrame(draw);
