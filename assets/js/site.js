/* Sinma Hair And Beauty — shared site script (all pages) */
(function(){
"use strict";
document.documentElement.classList.add("js");
var reduced=!!(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches);
var finePointer=!!(window.matchMedia&&matchMedia("(pointer: fine)").matches);
function $(s,c){return (c||document).querySelector(s);}
function $$(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s));}

var FACTS={address:"Garratt Lane, Tooting, London SW17 0LN",phoneDisplay:"+44 7311 189118",phoneTel:"+447311189118",wa:"https://wa.me/447311189118",maps:"https://www.google.com/maps/search/?api=1&query=51.429239,-0.171175",hoursText:"Monday to Saturday, 10:00 AM to 7:00 PM. Closed on Sundays.",openMin:600,closeMin:1140};

/* Service menu — generated from the build's single service list. */
var SERVICES=[{"slug": "hair", "name": "Hair Services", "short": "Cuts, styling, colouring", "items": [{"name": "Ladies' cut & blow-dry"}, {"name": "Men's cut"}, {"name": "Children's cut"}, {"name": "Blow-dry & styling"}, {"name": "Full head colour"}, {"name": "Root touch-up"}, {"name": "Highlights & balayage"}, {"name": "Conditioning treatment"}]}, {"slug": "skin", "name": "Skin Care", "short": "Facials, cleansing, glow", "items": [{"name": "Signature facial"}, {"name": "Deep cleansing facial"}, {"name": "Hydrating facial"}]}, {"slug": "makeup", "name": "Makeup", "short": "Party, events, special days", "items": [{"name": "Party makeup"}, {"name": "Special occasion makeup"}, {"name": "Eye makeup"}]}, {"slug": "nails", "name": "Nail Care", "short": "Manicure, pedicure, nail art", "items": [{"name": "Manicure"}, {"name": "Pedicure"}, {"name": "Gel polish"}, {"name": "Nail art"}]}, {"slug": "beauty", "name": "Beauty Treatments", "short": "Threading, waxing, brows", "items": [{"name": "Eyebrow threading"}, {"name": "Facial threading"}, {"name": "Waxing"}, {"name": "Brow tint & shape"}]}, {"slug": "bridal", "name": "Bridal Packages", "short": "Complete bridal makeover", "items": [{"name": "Bridal hair"}, {"name": "Bridal makeup"}, {"name": "Bridal hair & makeup"}, {"name": "Bridal party styling"}]}];
var ADVICE="Not sure yet, I'd like advice";
var DAYS=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

/* ---------- Time (London) ---------- */
function pad(n){return(n<10?"0":"")+n;}
function londonNow(){var p={};try{new Intl.DateTimeFormat("en-GB",{timeZone:"Europe/London",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(new Date()).forEach(function(x){p[x.type]=x.value;});}catch(e){var d=new Date();p={year:String(d.getFullYear()),month:pad(d.getMonth()+1),day:pad(d.getDate()),hour:pad(d.getHours()),minute:pad(d.getMinutes())};}var iso=p.year+"-"+p.month+"-"+p.day;return{iso:iso,dow:dowOf(iso),mins:(parseInt(p.hour,10)%24)*60+parseInt(p.minute,10)};}
function dowOf(iso){return new Date(iso+"T12:00:00Z").getUTCDay();}
function addDays(iso,n){var d=new Date(iso+"T12:00:00Z");d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10);}
function niceDate(iso){return new Date(iso+"T12:00:00Z").toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long",year:"numeric",timeZone:"UTC"});}
function shortDate(iso){return new Date(iso+"T12:00:00Z").toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short",timeZone:"UTC"});}
function hm(m){return pad(Math.floor(m/60))+":"+pad(m%60);}
function statusInfo(){var n=londonNow(),od=n.dow>=1&&n.dow<=6;if(od&&n.mins>=FACTS.openMin&&n.mins<FACTS.closeMin)return{open:true,text:"Open now · until 7 PM"};if(od&&n.mins<FACTS.openMin)return{open:false,text:"Closed · opens 10 AM today"};if(n.dow===6||n.dow===0)return{open:false,text:"Closed · opens Monday 10 AM"};return{open:false,text:"Closed · opens tomorrow 10 AM"};}
function renderStatus(){var s=statusInfo();$$("[data-status]").forEach(function(el){el.classList.toggle("open",s.open);var t=$(".status-text",el);if(t)t.textContent=s.text;});}
renderStatus();setInterval(renderStatus,60000);
$$(".year").forEach(function(el){el.textContent=londonNow().iso.slice(0,4);});
/* Highlight today in any hours table */
(function(){var d=londonNow().dow;$$("[data-day]").forEach(function(r){if(Number(r.getAttribute("data-day"))===d)r.classList.add("today");});})();

/* ---------- Nav ---------- */
var nav=$("#nav"),menuBtn=$("#menuBtn");
if(nav&&menuBtn){
  menuBtn.addEventListener("click",function(){var o=nav.classList.toggle("open");menuBtn.setAttribute("aria-expanded",String(o));});
  nav.addEventListener("click",function(e){if(e.target.tagName==="A"){nav.classList.remove("open");menuBtn.setAttribute("aria-expanded","false");}});
}

/* ---------- Reveal (content always visible; only position eases) ---------- */
if("IntersectionObserver" in window){var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add("in");io.unobserve(en.target);}});},{rootMargin:"0px 0px -6% 0px"});$$(".reveal").forEach(function(el){io.observe(el);});}
else $$(".reveal").forEach(function(el){el.classList.add("in");});

/* ---------- 3D tilt ---------- */
function tilt(el,max){
  if(reduced||!finePointer)return;
  el.addEventListener("pointermove",function(e){if(el.closest(".cyl"))return;var r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
    el.style.transform="perspective(900px) rotateY("+((x-.5)*max)+"deg) rotateX("+((.5-y)*max)+"deg) translateZ(6px)";
    el.style.setProperty("--gx",(x*100)+"%");el.style.setProperty("--gy",(y*100)+"%");});
  el.addEventListener("pointerleave",function(){if(el.closest(".cyl"))return;el.style.transform="";});
}
$$(".svc").forEach(function(el){tilt(el,14);});
$$(".look").forEach(function(el){tilt(el,12);});
$$("[data-tilt]").forEach(function(el){tilt(el,8);});

/* Hero photo parallax (home) */
(function(){
  var hero=$("#hero"),t=$("#heroTilt"),sc=$("#heroScript");
  if(!hero||!t||reduced||!finePointer)return;
  hero.addEventListener("pointermove",function(e){var r=hero.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    t.style.transform="rotateY("+(x*-7)+"deg) rotateX("+(y*5)+"deg) translate3d("+(x*-14)+"px,"+(y*-10)+"px,0) scale(1.03)";
    if(sc&&!document.documentElement.classList.contains("has-scroll3d"))sc.style.transform="rotate(-12deg) translate3d("+(x*24)+"px,"+(y*18)+"px,0)";});
  hero.addEventListener("pointerleave",function(){t.style.transform="";if(sc&&!document.documentElement.classList.contains("has-scroll3d"))sc.style.transform="";});
})();

/* ---------- Filters (lookbook, gallery) ---------- */
$$("[data-filter-for]").forEach(function(group){
  var target=document.getElementById(group.getAttribute("data-filter-for"));
  if(!target)return;
  group.addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;var f=b.getAttribute("data-f");
    $$("button",group).forEach(function(x){x.setAttribute("aria-pressed",String(x===b));});
    $$("[data-cat]",target).forEach(function(l){l.hidden=!(f==="all"||l.getAttribute("data-cat")===f);});
    target.scrollLeft=0;});
});
/* Rails */
$$("[data-rail]").forEach(function(btn){
  var el=document.getElementById(btn.getAttribute("data-rail")),dir=Number(btn.getAttribute("data-dir"))||1;
  if(el)btn.addEventListener("click",function(){el.scrollBy({left:dir*el.clientWidth*.8,behavior:reduced?"auto":"smooth"});});
});

/* ---------- Services page: highlight current category chip ---------- */
(function(){
  var chips=$$(".cat-nav a");if(!chips.length||!("IntersectionObserver" in window))return;
  var map={};chips.forEach(function(a){map[a.getAttribute("href").slice(1)]=a;});
  var ob=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){chips.forEach(function(c){c.classList.remove("on");});var a=map[en.target.id];if(a){a.classList.add("on");a.scrollIntoView({block:"nearest",inline:"center"});}}});},{rootMargin:"-45% 0px -50% 0px"});
  $$(".svc-cat").forEach(function(s){ob.observe(s);});
})();

/* ---------- Gallery lightbox ---------- */
(function(){
  var items=$$("[data-lightbox]");if(!items.length)return;
  var box=document.createElement("div");box.className="lightbox";box.hidden=true;box.setAttribute("role","dialog");box.setAttribute("aria-modal","true");box.setAttribute("aria-label","Photo viewer");box.setAttribute("data-lenis-prevent","");
  box.innerHTML='<button class="lb-close" type="button" aria-label="Close">×</button><button class="lb-nav lb-prev" type="button" aria-label="Previous photo">‹</button><figure class="lb-fig"><img alt=""><figcaption></figcaption></figure><button class="lb-nav lb-next" type="button" aria-label="Next photo">›</button>';
  document.body.appendChild(box);
  var img=$("img",box),cap=$("figcaption",box),idx=0,last=null;
  function visible(){return items.filter(function(i){return !i.hidden;});}
  function show(i){var list=visible();if(!list.length)return;idx=(i+list.length)%list.length;var src=$("img",list[idx]);img.src=src.src;img.alt=src.alt;cap.textContent=src.alt;box.classList.remove("pop");void box.offsetWidth;box.classList.add("pop");}
  function open(el){last=document.activeElement;box.hidden=false;document.body.style.overflow="hidden";show(visible().indexOf(el));$(".lb-close",box).focus();}
  function close(){box.hidden=true;document.body.style.overflow="";if(last)last.focus();}
  items.forEach(function(el){el.tabIndex=0;el.addEventListener("click",function(){open(el);});el.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();open(el);}});});
  $(".lb-close",box).addEventListener("click",close);
  $(".lb-prev",box).addEventListener("click",function(){show(idx-1);});
  $(".lb-next",box).addEventListener("click",function(){show(idx+1);});
  box.addEventListener("click",function(e){if(e.target===box)close();});
  document.addEventListener("keydown",function(e){if(box.hidden)return;if(e.key==="Escape")close();if(e.key==="ArrowLeft")show(idx-1);if(e.key==="ArrowRight")show(idx+1);});
})();

/* ---------- Copy buttons ---------- */
$$("[data-copy]").forEach(function(btn){
  btn.addEventListener("click",function(){var v=btn.getAttribute("data-copy"),orig=btn.textContent;
    function reset(){setTimeout(function(){btn.textContent=orig;},1600);}
    function fallback(){var t=document.getElementById(btn.getAttribute("data-copy-target")||"");if(t){var r=document.createRange();r.selectNodeContents(t);var s=getSelection();s.removeAllRanges();s.addRange(r);}btn.textContent="Selected";reset();}
    try{navigator.clipboard.writeText(v).then(function(){btn.textContent="Copied";reset();},fallback);}catch(e){fallback();}});
});

/* ---------- WhatsApp helpers ---------- */
function waLink(t){return FACTS.wa+"?text="+encodeURIComponent(t);}
$$("[data-quote]").forEach(function(a){a.href=waLink("Hello Sinma Hair And Beauty, could you tell me the price for: "+a.getAttribute("data-quote")+"? Thank you.");a.target="_blank";a.rel="noopener";});

/* ---------- Booking modal (shared) ---------- */
var modal=$("#bookModal");
var form,bService,bDate,bDateNice,bSlots,bName,bPhone,bNotes,bError,confirmEl,chosenTime=null,lastFocus=null;
function allItems(){var a=[];SERVICES.forEach(function(s){s.items.forEach(function(i){a.push(i.name);});});return a;}
function slotsFor(iso){var n=londonNow(),out=[];if(iso<n.iso||dowOf(iso)===0)return out;for(var m=FACTS.openMin;m<=FACTS.closeMin-30;m+=30){if(iso===n.iso&&m<n.mins+30)continue;out.push(m);}return out;}
function firstOpenDate(){var iso=londonNow().iso;for(var i=0;i<10;i++){if(slotsFor(iso).length)return iso;iso=addDays(iso,1);}return londonNow().iso;}
function makeRef(){return"SN-"+Math.random().toString(36).slice(2,6).toUpperCase();}
function calLink(b){var d=b.date.replace(/-/g,""),s=b.time,e=s+60;return"https://calendar.google.com/calendar/render?action=TEMPLATE&text="+encodeURIComponent(b.service+" at Sinma Hair And Beauty")+"&dates="+d+"T"+pad(Math.floor(s/60))+pad(s%60)+"00/"+d+"T"+pad(Math.floor(e/60))+pad(e%60)+"00&ctz=Europe/London&location="+encodeURIComponent(FACTS.address)+"&details="+encodeURIComponent("Booking ref "+b.ref+". Waiting for confirmation from the salon on WhatsApp. Salon: "+FACTS.phoneDisplay);}
function linkBtn(c,h,l){var a=document.createElement("a");a.className=c;a.href=h;a.target="_blank";a.rel="noopener";a.textContent=l;return a;}

if(modal){
  form=$("#bookForm");bService=$("#bService");bDate=$("#bDate");bDateNice=$("#bDateNice");bSlots=$("#bSlots");bName=$("#bName");bPhone=$("#bPhone");bNotes=$("#bNotes");bError=$("#bError");confirmEl=$("#confirm");
  (function(){var o=document.createElement("option");o.value="";o.textContent="Choose a service";bService.appendChild(o);
    SERVICES.forEach(function(s){var g=document.createElement("optgroup");g.label=s.name;s.items.forEach(function(it){var op=document.createElement("option");op.value=it.name;op.textContent=it.name;g.appendChild(op);});bService.appendChild(g);});
    var oa=document.createElement("option");oa.value=ADVICE;oa.textContent=ADVICE;bService.appendChild(oa);})();
  var renderSlots=function(){var iso=bDate.value;chosenTime=null;bSlots.textContent="";bError.textContent="";
    function empty(m){var e=document.createElement("span");e.className="slots-empty";e.textContent=m;bSlots.appendChild(e);}
    if(!iso){bDateNice.value="";empty("Choose a date to see available times.");return;}
    bDateNice.value=niceDate(iso);var list=slotsFor(iso);
    if(!list.length){empty(dowOf(iso)===0?"We're closed on Sundays. Please choose Monday to Saturday.":(iso<londonNow().iso?"That date has passed. Please choose another day.":"No times left on this day. Please choose another day."));return;}
    list.forEach(function(m){var b=document.createElement("button");b.type="button";b.className="slot";b.textContent=hm(m);b.setAttribute("aria-pressed","false");
      b.addEventListener("click",function(){$$(".slot",bSlots).forEach(function(x){x.setAttribute("aria-pressed","false");});b.setAttribute("aria-pressed","true");chosenTime=m;bError.textContent="";});bSlots.appendChild(b);});};
  bDate.addEventListener("change",renderSlots);
  var openBooking=function(service){
    lastFocus=document.activeElement;
    bDate.min=londonNow().iso;bDate.max=addDays(londonNow().iso,90);
    if(!bDate.value||bDate.value<bDate.min)bDate.value=firstOpenDate();
    renderSlots();
    if(service&&allItems().indexOf(service)>-1)bService.value=service;
    confirmEl.hidden=true;form.hidden=false;modal.hidden=false;document.body.style.overflow="hidden";
    setTimeout(function(){bService.focus();},60);
  };
  var closeBooking=function(){modal.hidden=true;document.body.style.overflow="";if(lastFocus&&lastFocus.focus)lastFocus.focus();};
  window.SinmaBook=openBooking;
  document.addEventListener("click",function(e){var b=e.target.closest("[data-book]");if(!b)return;e.preventDefault();openBooking(b.getAttribute("data-service")||"");});
  $$("[data-close]",modal).forEach(function(b){b.addEventListener("click",closeBooking);});
  document.addEventListener("keydown",function(e){if(e.key==="Escape"&&!modal.hidden)closeBooking();});
  form.addEventListener("submit",function(e){e.preventDefault();var err="";
    if(!bService.value)err="Please choose a service.";else if(!bDate.value)err="Please choose a date.";else if(dowOf(bDate.value)===0)err="We're closed on Sundays. Please choose Monday to Saturday.";else if(chosenTime===null)err="Please choose a time.";else if(bName.value.trim().length<2)err="Please enter your name.";else if(bPhone.value.replace(/[^\d]/g,"").length<10)err="Please enter a mobile number so the salon can reach you.";
    if(err){bError.textContent=err;return;}
    var b={service:bService.value,date:bDate.value,time:chosenTime,name:bName.value.trim(),phone:bPhone.value.trim(),notes:bNotes.value.trim(),ref:makeRef()};
    form.hidden=true;confirmEl.hidden=false;confirmEl.textContent="";
    var tag=document.createElement("p");tag.className="eyebrow";tag.textContent="Request ready · "+b.ref;
    var h=document.createElement("h3");h.textContent="One last tap: send it to the salon";
    var p=document.createElement("p");p.className="lead";p.textContent="Your request opens in WhatsApp with all the details filled in. Your time is held once the salon replies.";
    var dl=document.createElement("dl");[["Service",b.service],["Date",niceDate(b.date)],["Time",hm(b.time)],["Name",b.name],["Mobile",b.phone]].forEach(function(r){var dt=document.createElement("dt");dt.textContent=r[0];var dd=document.createElement("dd");dd.textContent=r[1];dl.appendChild(dt);dl.appendChild(dd);});
    var acts=document.createElement("div");acts.className="confirm-actions";
        acts.appendChild(linkBtn("btn btn-line sm",calLink(b),"Add to Google Calendar"));
    acts.appendChild(linkBtn("btn btn-line sm",FACTS.maps,"Directions"));
    var again=document.createElement("button");again.type="button";again.className="btn btn-line sm";again.textContent="Change details";again.addEventListener("click",function(){confirmEl.hidden=true;form.hidden=false;});acts.appendChild(again);
    [tag,h,p,dl].forEach(function(x){confirmEl.appendChild(x);});
    if(window.SinmaAutomation)window.SinmaAutomation.render(confirmEl,{name:b.name,service:b.service,iso:b.date,mins:b.time,ref:b.ref});
    confirmEl.appendChild(acts);
  });
  /* Open booking straight away when a page link asks for it: page.html#book */
  if(location.hash==="#book")setTimeout(function(){openBooking("");},300);
}

/* ---------- 3D floating petals (any canvas.petals) ---------- */
$$("canvas.petals").forEach(function(canvas){
  if(!window.THREE){canvas.style.display="none";return;}
  var renderer;try{renderer=new THREE.WebGLRenderer({canvas:canvas,antialias:true,alpha:true,powerPreference:"low-power"});}catch(e){canvas.style.display="none";return;}
  renderer.setClearColor(0x000000,0);
  var scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(40,1,0.1,50);camera.position.z=10;
  var shape=new THREE.Shape();shape.moveTo(0,0);shape.bezierCurveTo(0.55,0.25,0.5,1.05,0,1.35);shape.bezierCurveTo(-0.5,1.05,-0.55,0.25,0,0);
  var geo=new THREE.ShapeGeometry(shape,14);geo.translate(0,-0.65,0);
  var mat=new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0.82,side:THREE.DoubleSide,depthWrite:false});
  var small=window.matchMedia("(max-width: 760px)").matches,density=Number(canvas.getAttribute("data-count"))||54,COUNT=small?Math.round(density/2):density;
  var mesh=new THREE.InstancedMesh(geo,mat,COUNT);mesh.frustumCulled=false;scene.add(mesh);
  var palette=[0xf2cfc7,0xe8aaa1,0xf6dcd5,0xd98f88,0xe9c3a6,0xffffff];
  var P=[],dummy=new THREE.Object3D(),col=new THREE.Color();
  for(var i=0;i<COUNT;i++){P.push({x:(Math.random()-.5)*16,y:(Math.random()-.5)*10,z:(Math.random()-.5)*6,s:0.16+Math.random()*0.22,vy:0.25+Math.random()*0.45,sw:Math.random()*6.28,rx:Math.random()*6.28,ry:Math.random()*6.28,vr:0.4+Math.random()*0.9});col.setHex(palette[i%palette.length]);mesh.setColorAt(i,col);}
  if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;
  var host=canvas.parentElement,wind=0,windT=0,visible=true,running=true,looping=false,last=performance.now(),halfW=8,halfH=5;
  function resize(){var w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();halfH=Math.tan(camera.fov*Math.PI/360)*10;halfW=halfH*camera.aspect;if(reduced)step(0,4);}
  host.addEventListener("pointermove",function(e){var r=host.getBoundingClientRect();windT=((e.clientX-r.left)/r.width-.5)*2.4;});
  host.addEventListener("pointerleave",function(){windT=0;});
  function step(dt,t){wind+=(windT-wind)*0.03;camera.position.z=10-(canvas.__boost||0)*6.5;
    for(var i=0;i<COUNT;i++){var p=P[i];p.y-=p.vy*dt;p.x+=(Math.sin(t*0.6+p.sw)*0.35+wind)*dt;p.rx+=p.vr*dt;p.ry+=p.vr*0.7*dt;
      if(p.y<-halfH-1){p.y=halfH+1;p.x=(Math.random()-.5)*halfW*2;}if(p.x>halfW+1)p.x=-halfW-1;if(p.x<-halfW-1)p.x=halfW+1;
      dummy.position.set(p.x,p.y,p.z);dummy.rotation.set(p.rx,p.ry,Math.sin(t+p.sw)*0.6);dummy.scale.setScalar(p.s);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);}
    mesh.instanceMatrix.needsUpdate=true;renderer.render(scene,camera);}
  resize();window.addEventListener("resize",resize);
  function loop(){if(looping)return;looping=true;last=performance.now();(function tick(now){if(!visible||!running){looping=false;return;}var dt=Math.min(0.05,((now||performance.now())-last)/1000);last=now||performance.now();step(dt,last/1000);requestAnimationFrame(tick);})(performance.now());}
  if("IntersectionObserver" in window){new IntersectionObserver(function(es){visible=es[0].isIntersecting;if(visible&&running&&!reduced)loop();}).observe(host);}
  document.addEventListener("visibilitychange",function(){running=!document.hidden;if(running&&visible&&!reduced)loop();});
  if(reduced)step(0,4);else loop();
});

})();
