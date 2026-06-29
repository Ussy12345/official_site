// ── LIVE TICKER ────────────────────────────────────────────
var PLAYERS=[
  {name:'Ahmed_M',   xp:28400, delta:'+120', av:'AM', col:'#8B1A2E', up:true},
  {name:'Fatima_A',  xp:25100, delta:'+85',  av:'FA', col:'#2C5364', up:true},
  {name:'Musa_K',    xp:21800, delta:'+64',  av:'MK', col:'#3D5A3E', up:true},
  {name:'Yusuf_B',   xp:18200, delta:'+42',  av:'YB', col:'#4A3060', up:true},
  {name:'You',       xp:520,   delta:'+10',  av:'YO', col:'#9B1627', up:true, me:true},
];

function renderTicker(){
  var sorted=[...PLAYERS].sort(function(a,b){return b.xp-a.xp;});
  var html=sorted.map(function(p,i){
    var rankClass=i===0?'r1':i===1?'r2':i===2?'r3':'';
    return '<div class="ticker-row'+(p.me?' my-row':'')+'">'+
      '<div class="ticker-rank '+rankClass+'">'+(i+1)+'</div>'+
      '<div class="ticker-av" style="background:'+p.col+'">'+p.av+'</div>'+
      '<div class="ticker-info">'+
        '<strong>'+(p.me?'<span style="color:var(--gold)">You</span>':p.name)+'</strong>'+
        '<span>'+p.xp.toLocaleString()+' XP</span>'+
      '</div>'+
      '<div class="ticker-delta'+(p.up?'':' down')+'">'+p.delta+'</div>'+
    '</div>';
  }).join('');
  document.getElementById('tickerBoard').innerHTML=html;
}

renderTicker();
setInterval(function(){
  // Simulate live XP changes
  PLAYERS.forEach(function(p){
    if(Math.random()>0.6){
      var gain=Math.floor(Math.random()*30)+5;
      p.xp+=gain;
      p.delta='+'+(p.me?gain:gain+Math.floor(Math.random()*20));
      p.up=true;
    }
  });
  renderTicker();
},2800);

// ── COUNTDOWN ──────────────────────────────────────────────
var SEASON_END=new Date('2025-08-31T23:59:59').getTime();
function tickCountdown(){
  var ms=Math.max(0,SEASON_END-Date.now());
  var d=Math.floor(ms/86400000);
  var h=Math.floor((ms%86400000)/3600000);
  var m=Math.floor((ms%3600000)/60000);
  var s=Math.floor((ms%60000)/1000);
  var cd=document.getElementById('cd-d');
  var ch=document.getElementById('cd-h');
  var cm=document.getElementById('cd-m');
  var cs=document.getElementById('cd-s');
  if(cd) cd.textContent=String(d).padStart(2,'0');
  if(ch) ch.textContent=String(h).padStart(2,'0');
  if(cm) cm.textContent=String(m).padStart(2,'0');
  if(cs) cs.textContent=String(s).padStart(2,'0');
}
tickCountdown();
setInterval(tickCountdown,1000);

// ── COUNTER ANIMATION ──────────────────────────────────────
function animateCount(el,target,duration,prefix){
  prefix=prefix||'';
  var start=0,step=target/((duration/16));
  var t=setInterval(function(){
    start+=step;
    if(start>=target){start=target;clearInterval(t);}
    el.textContent=prefix+Math.floor(start).toLocaleString();
  },16);
}

// ── SCROLL REVEAL ──────────────────────────────────────────
var countersRun=false;
var observer=new IntersectionObserver(function(entries){
  entries.forEach(function(entry){
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      if(!countersRun&&entry.target.classList.contains('stats-strip')){
        countersRun=true;
        animateCount(document.getElementById('userCount'),1240,1200);
        animateCount(document.getElementById('poolCount'),320,1400);
      }
      observer.unobserve(entry.target);
    }
  });
},{threshold:0.12});

document.querySelectorAll('.reveal').forEach(function(el){
  observer.observe(el);
});

// ── WALLET BALANCE ANIMATION ───────────────────────────────
var balEl=document.getElementById('ew-bal-val');
if(balEl){
  var balObs=new IntersectionObserver(function(entries){
    if(entries[0].isIntersecting){
      var val=0,target=3.50;
      var t=setInterval(function(){
        val+=0.05;
        if(val>=target){val=target;clearInterval(t);}
        balEl.textContent=val.toFixed(2);
      },30);
      balObs.disconnect();
    }
  },{threshold:0.3});
  balObs.observe(balEl);
}
