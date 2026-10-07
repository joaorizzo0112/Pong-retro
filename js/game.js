(()=>{
const W=640,H=400,PW=10,BS=10,$=id=>document.getElementById(id);
const cv=$('c'),g=cv.getContext('2d'),scr=$('scr');
const store={get(k,d){try{const v=localStorage.getItem('pong:'+k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem('pong:'+k,JSON.stringify(v))}catch(e){}}};
const O=Object.assign({mode:0,opp:0,diff:1,goal:1,theme:1,psp:1,pw:0},store.get('opt2',{}));
const MODES=[['CLÁSSICO','O Pong de sempre'],['TURBO','Bola veloz que só acelera'],['MULTIBOLA','Duas bolas ao mesmo tempo'],['ENCOLHE','Raquetes diminuem a cada rebatida'],['PAREDÃO','Solo: 3 vidas, bata o recorde'],['SOBREVIVÊNCIA','CPU cada vez mais forte, 3 vidas']];
const OPP=['VS CPU','2 JOGADORES'],DIFF=['FÁCIL','MÉDIO','DIFÍCIL','INSANO'],GOALS=[5,7,11],PSP=[.75,1,1.25,1.5,2,2.5,3],PSPL=['0,75X','1X','1,25X','1,5X','2X','2,5X','3X'];
const THEMES=[['BRANCO','#f2f2ea'],['VERDE','#39ff5a'],['ÂMBAR','#ffb300'],['CIANO','#3df2ff'],['VERMELHO','#ff3b3b'],['LARANJA','#ff7a1a'],['ROSA','#ff4fd8'],['ROXO','#a770ff'],['AZUL','#4f8dff'],['LIMA','#b6ff2e'],['GAMEBOY','#9bbc0f']];
const AL=[['first','🏓','Primeiro ponto','Marque seu primeiro ponto'],['win','🏆','Campeão','Vença uma partida'],['clean','🛡️','Intocável','Vença sem sofrer pontos'],['rally10','🔥','Maratona','10 rebatidas num ponto'],['hard','💀','Sem medo','Vença a CPU no Insano'],['turbo','⚡','Velocista','Vença no modo Turbo'],['multi','🎱','Malabarista','Vença no Multibola'],['wall','🧱','Paredão','15 rebatidas no Paredão'],
 ['rally20','🌪️','Furacão','20 rebatidas num ponto'],['shrink','🔬','Alvo pequeno','Vença no modo Encolhe'],['wall30','🏰','Fortaleza','30 rebatidas no Paredão'],['comeback','🔄','Virada','Vença após perder por 3 pontos'],
 ['twop','🤝','Duelo','Termine uma partida de 2 jogadores'],['veteran','🎖️','Veterano','Jogue 10 partidas'],['perfect','👑','Imbatível','Vença o Insano sem sofrer pontos','imp'],['train','🎓','Aluno aplicado','Conclua o treino jogável'],
 ['classic5','🎯','Tradicionalista','Vença 5 partidas no Clássico'],['turbo_clean','🏎️','Piloto de provas','Vença no Turbo sem sofrer pontos'],['turbo15','🚀','Hipervelocidade','15 rebatidas num ponto no Turbo'],
 ['multi_clean','🎪','Show de bolas','Vença no Multibola sem sofrer pontos'],['multi_insane','🧠','Mente dividida','Vença no Multibola contra o Insano'],
 ['shrink_min','🪡','Cabeça de alfinete','16 rebatidas num ponto no Encolhe'],['shrink_insane','🧵','Linha fina','Vença no Encolhe contra o Insano'],
 ['wall50','⛓️','Inabalável','50 rebatidas no Paredão'],['tour','🗺️','Volta ao mundo','Vença nos 4 modos, 15 no Paredão e 5 na Sobrevivência'],['levels','📶','Escalada','Vença em todos os 4 níveis da CPU'],['rainbow','🌈','Arco-íris','Experimente todas as cores'],
 ['wall100','🌋','Lendário','100 rebatidas no Paredão','imp'],['rally50','♾️','Infinito','50 rebatidas num ponto','imp'],['flawless11','☄️','Perfeição absoluta','Vença o Insano por 11 a 0','imp'],
 ['slow_insane','🐢','Tartaruga assassina','Vença o Insano com raquete 0,75X','imp'],['games100','🧟','Sem vida social','Jogue 100 partidas','imp'],
 ['surv5','⏳','Sobrevivente','5 pontos na Sobrevivência'],['surv15','🧗','Resistência','15 pontos na Sobrevivência'],['surv30','👻','Imortal','30 pontos na Sobrevivência','imp'],['pw10','🎁','Colecionador','Pegue 10 power-ups'],
 ['plat','💎','PONG Platinado','Complete o PONG: todas as outras conquistas','plat']];
let ach=store.get('ach',{}),best=store.get('best',0),wbest=store.get('wbest',0),sbest=store.get('sbest',0),pwCount=store.get('pwc',0);
const wm=store.get('wm',{}),dw=store.get('dw',[]),tour=store.get('tour',[]),tused=store.get('tused',[]);
const nAch=()=>AL.filter(a=>ach[a[0]]).length;
function theme(chk){document.documentElement.style.setProperty('--fg',THEMES[O.theme][1]);if(!tused.includes(O.theme)){tused.push(O.theme);store.set('tused',tused)}if(chk&&tused.length>=THEMES.length)unlock('rainbow')}theme();
const SV=(w,r,h=8)=>`<svg viewBox="0 0 ${w} ${h}">${r.map(a=>`<rect x="${a[0]}" y="${a[1]}" width="${a[2]}" height="${a[3]}"/>`).join('')}</svg>`;
const BM=rows=>{const r=[];rows.forEach((row,y)=>{let x=0;while(x<row.length){if(row[x]==='#'){let e=x;while(e<row.length&&row[e]==='#')e++;r.push([x,y,e-x,1]);x=e}else x++}});return SV(rows[0].length,r,rows.length)};
const SPK=[[0,3,2,2],[2,2,1,4],[3,1,1,6]];
const PX={pause:SV(8,[[1,1,2,6],[5,1,2,6]]),play:SV(8,[[2,0,1,8],[3,1,1,6],[4,2,1,4],[5,3,1,2]]),
 snd0:SV(10,[...SPK,[6,3,1,1],[8,3,1,1],[7,4,1,1],[6,5,1,1],[8,5,1,1]]),snd1:SV(10,[...SPK,[5,3,1,2]]),snd2:SV(10,[...SPK,[5,3,1,2],[7,2,1,4]]),
 gear:BM(['...###...','.#.###.#.','.#######.','###...###','###...###','###...###','.#######.','.#.###.#.','...###...']),
 dl:BM(['...##...','...##...','...##...','.######.','..####..','...##...','........','########']),
 help:BM(['..####..','.##..##.','.....##.','....##..','...##...','...##...','........','...##...']),
 copy:BM(['..#####..','.#.....#.','#..###..#','#.#.....#','#.#.....#','#.#.....#','#..###..#','.#.....#.','..#####..']),
 trophy:SV(8,[[1,0,6,3],[0,1,1,2],[7,1,1,2],[2,3,4,1],[3,4,2,2],[2,6,4,1]])};
const SL=['MUDO','SOM 50%','SOM 100%'];
let st='menu',sel=0,view='menu',osel=0,hsel=0,llk='';
const PB={how:['tutb','bkh'],ach:['bka'],cred:['gh','bkc']};
function renderPB(){(PB[view]||[]).forEach((id,i)=>$(id).classList.toggle('sel',i===hsel))}
const K=(...a)=>a.map(x=>`<kbd>${x}</kbd>`).join('');
function LG(){
 if(st==='play')return'<span class="fo">'+(O.opp&&!solo()?`P1 ${K('W','S')} · P2 ${K('↑','↓')}`:`${K('W','S')} MOVER`)+` · ${K('ESPAÇO')} ${paused?'CONTINUAR':'PAUSA'} · ${K('ESC')} MENU</span>`;
 if(st==='tut')return`${K('W','S')} MOVER · ${K('ESC')} SAIR`;
 if(st==='over')return'';
 if(view==='menu')return`${K('W','S')} NAVEGAR · ${K('A','D')} ALTERAR · ${K('ENTER')} OK`;
 if(view==='opt')return`${K('W','S')} NAVEGAR · ${K('A','D')} ALTERAR · ${K('ESC')} VOLTAR`;
 if(view==='ach')return`${K('W','S')} ROLAR · ${K('ENTER')} OK · ${K('ESC')} VOLTAR`;
 return`${K('W','S')} ROLAR · ${K('A','D')} ESCOLHER · ${K('ENTER')} OK · ${K('ESC')} VOLTAR`}
const solo=()=>O.mode===4||st==='tut',surv=()=>O.mode===5&&st!=='tut';
let deferredInstall=null,manifestOk=false;
const standalone=()=>(typeof matchMedia==='function'&&matchMedia('(display-mode: standalone)').matches)||navigator.standalone===true;
const isIOS=()=>/iphone|ipad|ipod/i.test(navigator.userAgent||'')||((navigator.platform||'')==='MacIntel'&&navigator.maxTouchPoints>1);
const canInstall=()=>!standalone()&&(!!deferredInstall||(isIOS()&&manifestOk));
function installApp(){
 if(deferredInstall){const d=deferredInstall;d.prompt();d.userChoice.then(()=>{deferredInstall=null;renderMenu()})}
 else{tq.push(['ios','📲','Instalar no iPhone/iPad','Toque em Compartilhar e depois em Adicionar à Tela de Início']);if(!tb)nextToast()}}
const ITEMS=[
 {l:'MODO DE JOGO',v:()=>MODES[O.mode][0],k:'mode',n:MODES.length,c:'w6'},
 {t:()=>'<i class="pxr"></i> JOGAR',c:'w6 play',a:()=>start()},
 {t:()=>`${PX.gear} OPÇÕES`,c:'w3',a:()=>{osel=0;renderOpt();panel('opt')}},
 {t:()=>`${PX.trophy} <span class="cnt">${nAch()}/${AL.length}</span>`,aria:'Conquistas',c:'w3 trophy',a:()=>{drawAch();panel('ach')}},
 {t:()=>`${PX.help} AJUDA`,c:'w3',a:()=>panel('how')},
 {t:()=>`${PX.copy} CRÉDITOS`,c:'w3',a:()=>{drawCred();panel('cred')}},
 {t:()=>`${PX.dl} INSTALAR APP`,c:'w6',a:()=>installApp(),show:canInstall}];
const SL2=['MUDO','50%','100%'];
const OPTS=[
 {l:'SOM',v:()=>SL2[snd],ch:d=>{snd=(snd+d+3)%3;store.set('snd',snd)}},
 {l:'ADVERSÁRIO',v:()=>solo()?'SOLO':surv()?'VS CPU':OPP[O.opp],k:'opp',n:2,off:()=>solo()||surv()},
 {l:'NÍVEL DA CPU',v:()=>surv()?'AUTO':(solo()||O.opp)?'—':DIFF[O.diff],k:'diff',n:4,off:()=>solo()||O.opp||surv()},
 {l:'PONTOS',v:()=>(solo()||surv())?'—':GOALS[O.goal],k:'goal',n:3,off:()=>solo()||surv()},
 {l:'VEL. RAQUETE',v:()=>PSPL[O.psp],k:'psp',n:PSP.length},
 {l:'POWER-UPS',v:()=>O.pw?'LIGADO':'DESLIGADO',k:'pw',n:2},
 {l:'COR',v:()=>THEMES[O.theme][0],sw:()=>THEMES[O.theme][1],k:'theme',n:THEMES.length},
 {t:'<i class="pxl"></i> VOLTAR',a:()=>toMenu()}];
function ochange(i,d){const it=OPTS[i];if(!it.l||(it.off&&it.off()))return;
 if(it.ch)it.ch(d);else{O[it.k]=(O[it.k]+d+it.n)%it.n;store.set('opt2',O);theme(1)}beep(330,.04);renderOpt()}
function renderOpt(){const el=$('olist');el.innerHTML='';
 OPTS.forEach((it,i)=>{const d=document.createElement('div');d.className='orow'+(i===osel?' sel':'')+(it.off&&it.off()?' off':'')+(it.a?' back':'');
  if(it.a)d.innerHTML=it.t;
  else{d.innerHTML=`<span class="ol">${it.l}</span><b><span class="ar"><i class="pxl"></i></span><span${it.sw?` style="color:${it.sw()};text-shadow:0 0 8px ${it.sw()}"`:''}>${it.v()}</span><span class="ar"><i class="pxr"></i></span></b>`;
   const ar=d.querySelectorAll('.ar');ar[0].onclick=e=>{e.stopPropagation();osel=i;ochange(i,-1)};ar[1].onclick=e=>{e.stopPropagation();osel=i;ochange(i,1)}}
  d.onclick=()=>{osel=i;if(it.a){beep(520,.07);it.a()}else renderOpt()};el.appendChild(d)})}
function mvSel(d){do{sel=(sel+d+ITEMS.length)%ITEMS.length}while(ITEMS[sel].show&&!ITEMS[sel].show())}
function change(i,d){const it=ITEMS[i];if(!it.k||(it.off&&it.off()))return;O[it.k]=(O[it.k]+d+it.n)%it.n;store.set('opt2',O);theme();beep(330,.04);renderMenu()}
function renderMenu(){const el=$('items');el.innerHTML='';$('mt').classList.toggle('gold',!!ach.plat);
 ITEMS.forEach((it,i)=>{if(it.show&&!it.show())return;const d=document.createElement('div');d.className='it '+(it.c||'')+(i===sel?' sel':'')+(it.off&&it.off()?' off':'');
  if(it.k){d.innerHTML=`<span class="lb">${it.l}</span><b><span class="ar"><i class="pxl"></i></span><span>${it.v()}</span><span class="ar"><i class="pxr"></i></span></b>`;
   const ar=d.querySelectorAll('.ar');ar[0].onclick=e=>{e.stopPropagation();sel=i;change(i,-1)};ar[1].onclick=e=>{e.stopPropagation();sel=i;change(i,1)}}
  else{const t=typeof it.t==='function'?it.t():it.t;d.innerHTML=it.l&&it.l!==undefined&&typeof it.t==='function'?`<span class="lb">${it.l}</span><b>${t}</b>`:`<b>${t}</b>`}
  if(it.aria){d.title=it.aria;d.setAttribute&&d.setAttribute('aria-label',it.aria)}
  d.onclick=()=>{sel=i;if(it.a){beep(520,.07);it.a()}else renderMenu()};el.appendChild(d)});
}
function drawCred(){$('cstats').innerHTML=`${games} partidas<br>${nAch()}/${AL.length} conquistas${ach.plat?' · <b>★ PLATINADO</b>':''}`}
function drawAch(){$('acnt').textContent=nAch()+'/'+AL.length;
 $('alist').innerHTML=AL.map(a=>`<div class="ach ${ach[a[0]]?'on':''} ${a[4]||''}"><i>${a[1]}</i><div>${a[2]}<br><small>${a[3]}</small>${a[4]==='imp'?'<span class="tg">IMPOSSÍVEL</span>':''}</div></div>`).join('')+`<div class="sub" style="grid-column:span 2;text-align:center">RECORDES · REBATIDAS: ${best} · PAREDÃO: ${wbest}</div>`}
function panel(id){view=id;hsel=0;['menu','how','ach','cred','opt','end'].forEach(p=>$(p).classList.toggle('hide',p!==id));renderPB()}
document.querySelectorAll('[data-back]').forEach(b=>b.onclick=toMenu);
let tq=[],tb=false;
function unlock(k){if(st!=='play'&&st!=='over'&&st!=='tut'&&k!=='rainbow'&&k!=='plat')return;if(ach[k])return;ach[k]=1;store.set('ach',ach);tq.push(AL.find(x=>x[0]===k));renderMenu();if(!tb)nextToast();
 if(k!=='plat'&&AL.every(a=>a[0]==='plat'||ach[a[0]]))unlock('plat')}
function nextToast(){const a=tq.shift();if(!a){tb=false;return}tb=true;$('ti').textContent=a[1];$('tt').textContent=a[2];$('td').textContent=a[3];$('toast').classList.toggle('gold',a[0]==='plat');$('toast').classList.add('show');beep(780,.08);setTimeout(()=>beep(1040,.12),90);setTimeout(()=>{$('toast').classList.remove('show');setTimeout(nextToast,400)},a[0]==='plat'?5200:3000);if(a[0]==='plat')jingle([523,659,784,1047,1319,1568])}
const VOL=[0,.5,1],SI=['🔇','🔉','🔊'];let snd=store.get('snd',2);let ac;function beep(f,d,t){if(!VOL[snd])return;try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();if(ac.state==='suspended')ac.resume();const o=ac.createOscillator(),v=ac.createGain();o.type=t||'square';o.frequency.value=f;v.gain.value=.05*VOL[snd];v.gain.exponentialRampToValueAtTime(.001,ac.currentTime+d);o.connect(v);v.connect(ac.destination);o.start();o.stop(ac.currentTime+d)}catch(e){}}

let L={y:165,h:70},R={y:165,h:70},balls=[],sc=[0,0],lives=3,hits=0,rally=0,keys={},cd=0,paused=false,last=0,trail=[],shake=0,sp=300,pw=null,slowT=0,pwT=8,pwMsg='',pwMsgT=0;
const M=()=>st==='tut'?0:O.mode,baseH=()=>M()===3?90:70,baseSp=()=>M()===1?460:M()===5?Math.min(300+sc[0]*18,520):300,inc=()=>M()===1?35:22,maxSp=()=>M()===1?900:760;
function mk(dir,y){return{x:W/2-BS/2,y:y??H/2-BS/2,vx:0,vy:0,dir}}
function reset(dir){const d=dir||(Math.random()<.5?-1:1);sp=baseSp();L.h=R.h=baseH();L.pm=R.pm=1;L.pt=R.pt=0;L.it=R.it=0;pw=null;slowT=0;pwT=6+Math.random()*4;L.y=H/2-L.h/2;R.y=H/2-R.h/2;
 balls=M()===2?[mk(d,H/2-70),mk(-d,H/2+60)]:[mk(d)];cd=.9;rally=0;trail=[]}
function launch(){balls.forEach(b=>{const a=Math.random()*.8-.4;b.vx=Math.cos(a)*sp*b.dir;b.vy=Math.sin(a)*sp})}
function start(){if(O.mode===5&&O.opp){oppKeep=O.opp;O.opp=0}maxDef=0;sc=[0,0];lives=3;hits=0;paused=false;st='play';panel('none');reset()}
function toMenu(){if(oppKeep!==null){O.opp=oppKeep;oppKeep=null}st='menu';paused=false;panel('menu');reset();renderMenu()}
let pmSel=0,pmConf=0,lpm=false;
function renderPM(){[0,1,2].forEach(i=>$('pm'+i).classList.toggle('sel',i===pmSel));$('pm2').textContent=pmConf?'TOQUE DE NOVO PARA SAIR':'SAIR PARA O MENU'}
const coarse=()=>typeof matchMedia==='function'&&matchMedia('(pointer:coarse)').matches;
function pmDo(i){
 if(i===0)paused=false;
 else if(i===1){paused=false;start()}
 else{if(!pmConf&&coarse()){pmConf=1;pmSel=2;renderPM();setTimeout(()=>{pmConf=0;renderPM()},3000);return}pmConf=0;toMenu()}}
[0,1,2].forEach(i=>{$('pm'+i).onclick=()=>{pmSel=i;pmDo(i)}});
let tut={s:0,n:0,y0:null,t:0};
const TT=['MOVA A RAQUETE (W/S OU ARRASTE)','REBATA A BOLA 3 VEZES','ACERTE COM A PONTA DA RAQUETE 2X','PRONTO! VOCÊ JÁ SABE JOGAR'];
function jingle(n){n.forEach((f,i)=>setTimeout(()=>beep(f,.14),i*110))}
function startTut(){st='tut';tut={s:0,n:0,y0:null,t:0};paused=false;panel('none');reset(1)}
function tutNext(){tut.s++;tut.n=0;jingle([660,880]);if(tut.s===3)unlock('train')}
function tutHit(left,rel){if(!left)return;if(tut.s===1&&++tut.n>=3)tutNext();else if(tut.s===2&&Math.abs(rel)>.6&&++tut.n>=2)tutNext()}
function tutStep(dt){if(tut.s===0){if(tut.y0==null)tut.y0=L.y;if(Math.abs(L.y-tut.y0)>50)tutNext()}if(tut.s===3){tut.t+=dt;if(tut.t>2.5){jingle([523,659,784,1047]);toMenu()}}}
$('again').onclick=start;$('tomenu').onclick=toMenu;
addEventListener('keydown',e=>{const k=e.key.toLowerCase();keys[k]=1;
 if(st==='over'){e.preventDefault();if(e.repeat)return;
  if(k==='w'||k==='arrowup'){endSel=0;renderEnd();beep(260,.03)}
  else if(k==='s'||k==='arrowdown'){endSel=1;renderEnd();beep(260,.03)}
  else if(k==='escape')toMenu();
  else if((k===' '||k==='enter')&&performance.now()-endT>450){beep(520,.07);endSel?toMenu():start()}
  return}
 if(['arrowup','arrowdown',' '].includes(k))e.preventDefault();
 const up=k==='arrowup'||k==='w',dn=k==='arrowdown'||k==='s',lf=k==='arrowleft'||k==='a',rt=k==='arrowright'||k==='d',ok=k==='enter'||k===' ';
 if(st==='play'&&paused&&!e.repeat){if(up){pmSel=Math.max(0,pmSel-1);pmConf=0;renderPM()}else if(dn){pmSel=Math.min(2,pmSel+1);pmConf=0;renderPM()}else if(k==='enter'){pmDo(pmSel);return}}
 if(st==='menu'&&view==='menu'){
  if(up){mvSel(-1);beep(260,.03);renderMenu()}
  else if(dn){mvSel(1);beep(260,.03);renderMenu()}
  else if(lf)change(sel,-1);else if(rt)change(sel,1);
  else if(ok&&!e.repeat){if(ITEMS[sel].a){beep(520,.07);ITEMS[sel].a()}else change(sel,1)}}
 else if(st==='menu'&&view==='opt'){
  if(up){osel=(osel+OPTS.length-1)%OPTS.length;beep(260,.03);renderOpt()}
  else if(dn){osel=(osel+1)%OPTS.length;beep(260,.03);renderOpt()}
  else if(lf)ochange(osel,-1);else if(rt)ochange(osel,1);
  else if(ok&&!e.repeat){if(OPTS[osel].a){beep(520,.07);OPTS[osel].a()}else ochange(osel,1)}
  else if(k==='escape'||k==='backspace')toMenu()}
 else if(st==='menu'){const ids=PB[view]||[];
  if(k==='escape'||k==='backspace')toMenu();
  else if(view==='ach'&&(up||dn)){$('alist').scrollTop+=dn?60:-60;beep(260,.03)}
  else if((view==='how'||view==='cred')&&(up||dn)){const el=$(view).querySelector('.hrows');if(el)el.scrollTop+=dn?60:-60;beep(260,.03)}
  else if(up||lf){if(hsel>0){hsel--;renderPB();beep(260,.03)}}
  else if(dn||rt){if(hsel<ids.length-1){hsel++;renderPB();beep(260,.03)}}
  else if(ok&&!e.repeat&&ids[hsel]){beep(520,.07);$(ids[hsel]).click()}}
 else if(k==='escape')toMenu();
 if(k===' '&&st==='play'&&!e.repeat)paused=!paused});
addEventListener('keyup',e=>keys[e.key.toLowerCase()]=0);
function ptr(e){if(st!=='play'&&st!=='tut')return;const r=cv.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height*H;const p=(O.opp&&!solo()&&x>.5)?R:L;p.y=Math.max(0,Math.min(H-p.h,(p.it>0?H-y:y)-p.h/2))}
cv.addEventListener('pointerdown',ptr);cv.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse'||e.buttons||!(O.opp&&!solo()))ptr(e)});
const clamp=p=>p.y=Math.max(0,Math.min(H-p.h,p.y));
const AIC=[{sp:230,err:30,think:.18,aim:0,lapse:.16,pm:0},{sp:320,err:18,think:.10,aim:0,lapse:.08,pm:1},{sp:420,err:12,think:.05,aim:.45,lapse:.04,pm:2},{sp:600,err:4,think:.03,aim:.75,lapse:.015,pm:2}];
const AIMAX={sp:760,err:0,think:.01,aim:.9,lapse:0,pm:2},mixO=(a,b,f)=>({sp:a.sp+(b.sp-a.sp)*f,err:a.err+(b.err-a.err)*f,think:a.think+(b.think-a.think)*f,aim:a.aim+(b.aim-a.aim)*f,lapse:a.lapse+(b.lapse-a.lapse)*f,pm:Math.round(a.pm+(b.pm-a.pm)*f)});
function AIX(l){if(Number.isInteger(l)&&l<=3)return AIC[l];if(l<=3){const i=Math.floor(l);return mixO(AIC[i],AIC[i+1],l-i)}return mixO(AIC[3],AIMAX,Math.min(1,l-3))}
const svLv=()=>Math.min(4,sc[0]*.5),svName=()=>{const l=svLv();return l>=4?'LENDA':l>3?'INSANO+':DIFF[Math.floor(l)]};
function predict(b,x){const t=(x-b.x)/b.vx,m=H-BS,per=2*m;let y=((b.y+b.vy*t)%per+per)%per;return y>m?per-y:y}
function ai(p,right,lv,dt,other){const c=AIX(lv);p.t=(p.t||0)-dt;if(p.t>0){mv(p,c.sp*dt);return}p.t=c.think;
 let b=null,bd=1e9;balls.forEach(q=>{if(q.vx*(right?1:-1)>0){const d=Math.abs((right?W-30:30)-q.x);if(d<bd){bd=d;b=q}}});
 if(!b){p.tg=H/2-p.h/2;p.flip=1;mv(p,c.sp*dt);return}
 if(p.flip){p.err=(Math.random()-.5)*2*c.err;if(Math.random()<c.lapse)p.err+=(Math.random()<.5?-1:1)*(55+Math.random()*60);p.flip=0}
 const aim=c.aim?(other.y+other.h/2<H/2?1:-1)*c.aim:0;
 const xT=right?W-20-PW-BS:20+PW,py=c.pm===2?predict(b,xT):c.pm===1?Math.max(0,Math.min(H-BS,b.y+b.vy*(xT-b.x)/b.vx)):b.y;
 p.tg=py+BS/2-aim*p.h/2-p.h/2+(p.err||0);mv(p,c.sp*dt)}
function mv(p,s){const d=(p.tg??p.y)-p.y;p.y+=(p.it>0?-1:1)*Math.max(-s,Math.min(s,d))}
const PU=24,PWI={G:'RAQUETE GRANDE',L:'BOLA LENTA',I:'CONTROLES INVERTIDOS',E:'RAQUETE ENCOLHIDA'};
function hNow(){return M()===3?Math.max(26,90-rally*4):baseH()}
function setH(p){const nh=Math.min(150,hNow()*(p.pm||1)),old=p.h;p.h=nh;p.y+=(old-nh)/2;clamp(p)}
function pwTick(dt){
 [L,R].forEach(p=>{if(p.pt>0){p.pt-=dt;if(p.pt<=0){p.pm=1;setH(p)}}if(p.it>0)p.it-=dt});
 if(slowT>0)slowT-=dt;if(pwMsgT>0)pwMsgT-=dt;
 if(cd>0)return;
 if(pw){pw.t-=dt;if(pw.t<=0)pw=null}
 else{pwT-=dt;if(pwT<=0){const ks=solo()?['G','L']:['G','L','I','E'];pw={k:ks[Math.floor(Math.random()*ks.length)],x:W*.32+Math.random()*W*.36-PU/2,y:30+Math.random()*(H-60-PU),t:8};pwT=8+Math.random()*6;beep(900,.05)}}}
function pwPick(){const b=balls.find(q=>q.x<pw.x+PU&&q.x+BS>pw.x&&q.y<pw.y+PU&&q.y+BS>pw.y);if(!b)return;
 const who=(solo()||b.vx>0)?L:R,opp=who===L?R:L,k=pw.k;pw=null;pwCount++;store.set('pwc',pwCount);if(pwCount>=10)unlock('pw10');
 if(k==='G'){who.pm=1.6;who.pt=8;setH(who)}else if(k==='L')slowT=5;else if(k==='I')opp.it=5;else if(k==='E'){opp.pm=.6;opp.pt=8;setH(opp)}
 pwMsg=(solo()?'':who===L?(O.opp?'J1: ':'VOCÊ: '):(O.opp?'J2: ':'CPU: '))+PWI[k];pwMsgT=1.6;beep(1100,.06);setTimeout(()=>beep(1400,.08),70)}
function hit(p,left,b){const rel=(b.y+BS/2-(p.y+p.h/2))/(p.h/2),a=rel*Math.PI/3.2;sp=Math.min(sp+inc(),st==='tut'?380:maxSp());
 b.vx=Math.cos(a)*sp*(left?1:-1);b.vy=Math.sin(a)*sp;beep(left?460:380,.06);
 if(st==='tut'){tutHit(left,rel);return}
 if(st!=='play')return;hits++;rally++;(left?R:L).flip=1;
 if(solo()&&left){sc[0]++;if(sc[0]>wbest){wbest=sc[0];store.set('wbest',wbest)}if(sc[0]>=15){unlock('wall');tourAdd(4)}if(sc[0]>=30)unlock('wall30');if(sc[0]>=50)unlock('wall50');if(sc[0]>=100)unlock('wall100')}
 if(!solo()&&rally>best){best=rally;store.set('best',best)}if(rally>=10)unlock('rally10');if(rally>=20)unlock('rally20');if(rally>=50)unlock('rally50');if(O.mode===1&&rally>=15)unlock('turbo15');if(O.mode===3&&rally>=16)unlock('shrink_min');
 if(O.mode===3)[L,R].forEach(setH)}
let endSel=0,endT=0,conf=[],oppKeep=null,maxDef=0,games=store.get('games',0);
function played(){games++;store.set('games',games);if(games>=10)unlock('veteran');if(games>=100)unlock('games100')}
function tourAdd(m){if(!tour.includes(m)){tour.push(m);store.set('tour',tour)}if(tour.length>=6)unlock('tour')}
function winStats(){wm[O.mode]=(wm[O.mode]||0)+1;store.set('wm',wm);const z=sc[1]===0,ins=O.diff===3;
 if(O.mode===0&&wm[0]>=5)unlock('classic5');
 if(!dw.includes(O.diff)){dw.push(O.diff);store.set('dw',dw)}if(dw.length>=4)unlock('levels');
 tourAdd(O.mode);
 if(O.mode===1&&z)unlock('turbo_clean');if(O.mode===2&&z)unlock('multi_clean');if(O.mode===2&&ins)unlock('multi_insane');if(O.mode===3&&ins)unlock('shrink_insane');
 if(ins&&z&&GOALS[O.goal]===11)unlock('flawless11');if(ins&&O.psp===0)unlock('slow_insane')}
function renderEnd(){$('again').classList.toggle('sel',endSel===0);$('tomenu').classList.toggle('sel',endSel===1)}
function finish(tag,title,big,stats,win){st='over';endSel=0;endT=performance.now();jingle(win?[523,659,784,1047]:[392,330,262,196]);
 $('etag').textContent=tag;$('emsg').textContent=title;$('escore').textContent=big;
 $('estats').innerHTML=stats.map(x=>`<span>${x[0]} <b>${x[1]}</b></span>`).join('');
 $('end').classList.toggle('win',win);$('end').classList.toggle('lose',!win);renderEnd();
 conf=win?Array.from({length:70},()=>({x:Math.random()*W,y:-Math.random()*H,vy:60+Math.random()*120,s:3+Math.random()*5,c:Math.random()<.5?1:0})):[];
 if(!win)shake=.35;panel('end')}
function score(i){shake=.25;
 if(solo()){lives--;jingle([300,220]);if(sc[0]>wbest){wbest=sc[0];store.set('wbest',wbest)}
  if(lives<=0){played();finish('GAME OVER','FIM DE JOGO',sc[0],[['REBATIDAS',sc[0]],['RECORDE',wbest],['CONQUISTAS',nAch()+'/'+AL.length]],false)}else reset(1);return}
 if(surv()){if(i===0){sc[0]++;unlock('first');jingle([660,880]);if(sc[0]>sbest){sbest=sc[0];store.set('sbest',sbest)}if(sc[0]>=5){unlock('surv5');tourAdd(5)}if(sc[0]>=15)unlock('surv15');if(sc[0]>=30)unlock('surv30');reset(-1)}
  else{lives--;jingle([300,220]);if(lives<=0){played();finish('GAME OVER','SOBREVIVÊNCIA',sc[0],[['PONTOS',sc[0]],['RECORDE',sbest],['NÍVEL',svName()],['CONQUISTAS',nAch()+'/'+AL.length]],false)}else reset(1)}return}
 sc[i]++;if(!O.opp)maxDef=Math.max(maxDef,sc[1]-sc[0]);if(i===0||O.opp){unlock('first');jingle([660,880])}else jingle([300,220]);
 if(sc[i]>=GOALS[O.goal]){played();const w=!O.opp&&i===0;
  if(w){winStats();unlock('win');if(sc[1]===0)unlock('clean');if(O.diff===3)unlock('hard');if(O.mode===1)unlock('turbo');if(O.mode===2)unlock('multi');if(O.mode===3)unlock('shrink');if(maxDef>=3)unlock('comeback');if(O.diff===3&&sc[1]===0)unlock('perfect')}
  else if(O.opp){unlock('win');unlock('twop')}
  finish(O.opp?'FIM DE PARTIDA':(w?'VITÓRIA':'DERROTA'),O.opp?`JOGADOR ${i+1} VENCEU!`:(w?'VOCÊ VENCEU!':'A CPU VENCEU'),sc[0]+' × '+sc[1],[['MELHOR RALLY',best],['CONQUISTAS',nAch()+'/'+AL.length]],O.opp||w)}
 else reset(i===0?-1:1)}
function update(dt){const demo=st==='menu',s=380*dt*PSP[O.psp];
 if(demo){ai(L,false,2,dt,R);ai(R,true,2,dt,L)}
 else{const sl=L.it>0?-1:1,sr=R.it>0?-1:1;if(keys['w'])L.y-=s*sl;if(keys['s'])L.y+=s*sl;
  if(solo()){}else if(O.opp){if(keys['arrowup'])R.y-=s*sr;if(keys['arrowdown'])R.y+=s*sr}else ai(R,true,surv()?svLv():O.diff,dt,L)}
 clamp(L);clamp(R);
 if(st==='play'&&O.pw)pwTick(dt);
 if(st==='tut')tutStep(dt);
 if(cd>0){cd-=dt;if(cd<=0)launch();return}
 const lx=20+PW,rx=W-20-PW;let out=0;const kslow=slowT>0?.55:1;
 balls.forEach(b=>{b.x+=b.vx*dt*kslow;b.y+=b.vy*dt*kslow;
  if(b.y<6){b.y=6;b.vy=Math.abs(b.vy);beep(250,.04)}
  if(b.y>H-6-BS){b.y=H-6-BS;b.vy=-Math.abs(b.vy);beep(250,.04)}
  if(b.vx<0&&b.x<=lx&&b.x>lx-PW-6-Math.abs(b.vx*dt)&&b.y+BS>=L.y&&b.y<=L.y+L.h){b.x=lx;hit(L,true,b)}
  if(solo()){if(b.vx>0&&b.x+BS>=W-14){b.x=W-14-BS;b.vx=-Math.abs(b.vx);beep(380,.05)}}
  else if(b.vx>0&&b.x+BS>=rx&&b.x+BS<rx+PW+6+Math.abs(b.vx*dt)&&b.y+BS>=R.y&&b.y<=R.y+R.h){b.x=rx-BS;hit(R,false,b)}
  if(b.x<-BS)out=1;else if(b.x>W&&!solo())out=2});
 trail.push(balls.map(b=>[b.x,b.y]));if(trail.length>6)trail.shift();
 if(st==='play'&&pw)pwPick();
 if(demo){if(out)reset();return}
 if(st==='tut'){if(out)reset(1);return}
 if(out===1)score(solo()?0:1);else if(out===2)score(0)}
function draw(){const fg=THEMES[O.theme][1];g.fillStyle='#000';g.fillRect(0,0,W,H);
 g.shadowColor=fg;g.shadowBlur=12;g.fillStyle=fg;
 g.fillRect(0,0,W,6);g.fillRect(0,H-6,W,6);
 if(!solo())for(let y=14;y<H-10;y+=26)g.fillRect(W/2-3,y,6,14);else g.fillRect(W-8,0,8,H);
 const F='"Press Start 2P","Courier New",monospace';g.textAlign='center';
 if(st==='play'||st==='over'){g.font='30px '+F;
  if(solo()){g.fillText(sc[0],W/2,88);g.font='10px '+F;g.fillText('VIDAS '+lives+'   RECORDE '+wbest,W/2,114)}
  else if(surv()){g.fillText(sc[0],W/2-80,64);g.font='9px '+F;g.fillText('VIDAS '+lives,W/2+80,46);g.fillText(svName(),W/2+80,66)}
  else{g.fillText(sc[0],W/2-80,64);g.fillText(sc[1],W/2+80,64)}}
 g.fillRect(20,L.y,PW,L.h);if(!solo())g.fillRect(W-20-PW,R.y,PW,R.h);
 trail.forEach((tr,i)=>{g.globalAlpha=(i+1)/trail.length*.3;tr.forEach(t=>g.fillRect(t[0],t[1],BS,BS))});g.globalAlpha=1;
 if(cd<=0||Math.floor(cd*10)%2)balls.forEach(b=>g.fillRect(b.x,b.y,BS,BS));
 if(pw&&(pw.t>2||Math.floor(pw.t*6)%2)){g.fillStyle=fg;g.fillRect(pw.x,pw.y,PU,PU);g.fillStyle='#000';g.fillRect(pw.x+3,pw.y+3,PU-6,PU-6);g.fillStyle=fg;g.font='12px '+F;g.fillText(pw.k,pw.x+PU/2+1,pw.y+PU-6)}
 if(pwMsgT>0){g.font='9px '+F;g.fillText(pwMsg,W/2,H-48)}
  if(st==='tut'){g.font='11px '+F;g.fillText(TT[tut.s],W/2,H-56);g.font='8px '+F;g.fillText('PASSO '+(tut.s+1)+' DE 4',W/2,H-40)}
 if(st==='over')conf.forEach(p=>{g.fillStyle=p.c?'#fff':fg;g.fillRect(p.x,p.y,p.s,p.s)});g.shadowBlur=0}
function loop(t){const dt=Math.min((t-last)/1000,.05);last=t;if(st==='over')conf.forEach(p=>{p.y+=p.vy*dt;if(p.y>H){p.y=-10;p.x=Math.random()*W}});pb.style.visibility=st==='play'&&!paused?'visible':'hidden';if(lps!==+paused){lps=+paused;pbR()}{const sp=st==='play'&&paused;if(sp!==lpm){lpm=sp;$('pm').classList.toggle('hide',!sp);if(sp){pmSel=0;pmConf=0;renderPM()}}}scr.classList.toggle('dim',st==='menu'&&view==='menu');scr.classList.toggle('dim2',st==='menu'&&view!=='menu');{const lk=st+view+O.opp+(solo()?1:0)+paused;if(lk!==llk){llk=lk;$('lg').innerHTML=LG()}}
 if((st==='play'&&!paused)||st==='menu'||st==='tut')update(dt);
 if(shake>0){shake-=dt;scr.style.transform=`translate(${(Math.random()-.5)*8}px,${(Math.random()-.5)*8}px)`}else scr.style.transform='';
 draw();requestAnimationFrame(loop)}
$('tutb').onclick=startTut;
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstall=e;renderMenu()});
window.addEventListener('appinstalled',()=>{deferredInstall=null;renderMenu()});
try{if(typeof fetch==='function'&&/^https?:/.test(location.protocol))fetch('manifest.json').then(r=>{manifestOk=r.ok&&/json/.test(r.headers.get('content-type')||'');renderMenu()}).catch(()=>{})}catch(e){}
$('gh').onclick=()=>window.open('https://github.com/joaorizzo0112','_blank','noopener');
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('button');if(b)b.blur()});
const pb=$('pb');let lps=-1;
function pbR(){pb.innerHTML=(paused?PX.play:PX.pause)+`<span class="tl">${paused?'CONTINUAR':'PAUSAR'}</span>`}
pb.onclick=()=>{if(st==='play')paused=!paused;pb.blur()};
const ap=()=>{keys={};if(st==='play')paused=true};addEventListener('blur',ap);document.addEventListener('visibilitychange',()=>{if(document.hidden)ap()});
cv.addEventListener('pointerdown',()=>{if(paused&&st==='play')paused=false});
renderOpt();renderMenu();reset();requestAnimationFrame(t=>{last=t;loop(t)});
try{if('serviceWorker' in navigator&&/^https?:/.test(location.protocol))navigator.serviceWorker.register('sw.js').catch(()=>{})}catch(e){}
})();
