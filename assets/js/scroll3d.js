/* Sinma Hair And Beauty — 3D scroll layer (GSAP ScrollTrigger + Lenis).
   Remove this file and its three <script> tags to return to the standard version. */
(function(){
"use strict";
var reduced=!!(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches);
if(reduced||!window.gsap||!window.ScrollTrigger)return;
gsap.registerPlugin(ScrollTrigger);
document.documentElement.classList.add("has-scroll3d");

function $(s,c){return (c||document).querySelector(s);}
function $$(s,c){return gsap.utils.toArray(s,c);}
function headerH(){var h=$(".site-header");return h?h.offsetHeight:0;}
/* Elements driven by GSAP drop their CSS reveal/transition so the two don't fight. */
function own(els){(Array.isArray(els)?els:[els]).forEach(function(el){if(!el)return;el.classList.remove("reveal");el.classList.add("in");el.style.transition="none";});}

/* ---------- Smooth scrolling ---------- */
var lenis=null;
if(window.Lenis){
  try{
    lenis=new Lenis({duration:1.15,smoothWheel:true});
    lenis.on("scroll",ScrollTrigger.update);
    gsap.ticker.add(function(t){lenis.raf(t*1000);});
    gsap.ticker.lagSmoothing(0);
  }catch(e){lenis=null;}
}
if(lenis){
  /* Pause while a popup (booking, lightbox) locks the page */
  new MutationObserver(function(){document.body.style.overflow==="hidden"?lenis.stop():lenis.start();}).observe(document.body,{attributes:true,attributeFilter:["style"]});
  /* Same-page anchor links glide with Lenis */
  document.addEventListener("click",function(e){
    var a=e.target.closest('a[href^="#"]');if(!a)return;
    var id=a.getAttribute("href");if(id.length<2)return;
    var t=document.getElementById(id.slice(1));if(!t)return;
    e.preventDefault();
    var m=parseFloat(getComputedStyle(t).scrollMarginTop)||0;
    lenis.scrollTo(t,{offset:-(m||headerH()+10)});
  });
}

var mm=gsap.matchMedia();

/* ---------- 1. Hero: fly-through zoom (home) ---------- */
(function(){
  var hero=$("#hero");if(!hero)return;
  var photo=$(".hero-photo",hero),copy=$(".hero-in",hero),script=$(".hero-script",hero),canvas=$("canvas.petals",hero);
  mm.add({desk:"(min-width: 861px)",mob:"(max-width: 860px)"},function(ctx){
    var d=ctx.conditions.desk;
    var tl=gsap.timeline({scrollTrigger:{trigger:hero,start:"top top",end:"bottom top",scrub:true,
      onUpdate:function(s){if(canvas)canvas.__boost=s.progress;},onLeaveBack:function(){if(canvas)canvas.__boost=0;}}});
    /* Photo stays in place; it only zooms in gently inside its frame */
    var img=photo?photo.querySelector("img"):null;
    if(img)tl.fromTo(img,{scale:1},{scale:d?1.12:1.08,transformOrigin:"50% 30%",ease:"none"},0);
    tl.to(copy,{y:d?-110:-50,z:d?140:60,transformPerspective:1000,ease:"none"},0);
    if(script)tl.to(script,{y:d?-170:-80,rotation:-22,ease:"none"},0);
    return function(){if(canvas)canvas.__boost=0;};
  });
})();

/* ---------- 2. Services + Lookbook: 3D card deck that fans out into the grid (home) ---------- */
["services","gallery"].forEach(function(id){
  var sec=document.getElementById(id);if(!sec)return;
  var grid=$(".svc-grid",sec);if(!grid)return;
  var cards=$$(".svc",grid);if(!cards.length)return;
  own(cards);
  mm.add("(min-width: 1061px)",function(){
    gsap.set(grid,{perspective:1400});
    var mid=(cards.length-1)/2;
    var tl=gsap.timeline({scrollTrigger:{trigger:sec,start:function(){return "top top+="+headerH();},end:"+=110%",pin:true,scrub:1,invalidateOnRefresh:true}});
    tl.fromTo(cards,{
      x:function(i,el){return grid.clientWidth/2-(el.offsetLeft+el.offsetWidth/2);},
      y:70,
      rotateY:function(i){return (i-mid)*-16;},
      rotateZ:function(i){return (i-mid)*6;},
      z:function(i){return -Math.abs(i-mid)*90;}
    },{x:0,y:0,rotateY:0,rotateZ:0,z:0,ease:"power2.out",stagger:.07,duration:1},0);
  });
  mm.add("(max-width: 1060px)",function(){
    cards.forEach(function(c){
      gsap.from(c,{rotateX:-60,y:70,z:-120,transformPerspective:900,transformOrigin:"50% 100%",ease:"power2.out",
        scrollTrigger:{trigger:c,start:"top 96%",end:"top 62%",scrub:true}});
    });
  });
});

/* ---------- 3. Depth parallax and 3D entrances (all pages) ---------- */
function parallax(sel,from,to,trigger){
  $$(sel).forEach(function(el){
    gsap.fromTo(el,from,Object.assign({ease:"none",scrollTrigger:{trigger:trigger?el.closest(trigger)||el:el,start:"top bottom",end:"bottom top",scrub:true}},to));
  });
}
parallax(".about-photo img",{yPercent:-8,scale:1.16},{yPercent:8,scale:1.16},".about-photo");
parallax(".band-photo img",{yPercent:-10,scale:1.22},{yPercent:10,scale:1.22},".band");
parallax(".cat-photo img",{yPercent:-7,scale:1.16},{yPercent:7,scale:1.16},".cat-photo");
parallax(".about-script",{y:60},{y:-60},".about-copy");
$$(".page-hero").forEach(function(ph){
  var img=$(".ph-photo img",ph),inner=$(".ph-in",ph),canvas=$("canvas.petals",ph);
  var tl=gsap.timeline({scrollTrigger:{trigger:ph,start:"top top",end:"bottom top",scrub:true,onUpdate:function(s){if(canvas)canvas.__boost=s.progress;}}});
  if(img)tl.fromTo(img,{scale:1.06,yPercent:0},{scale:1.18,yPercent:12,ease:"none"},0);
  if(inner)tl.to(inner,{y:-70,z:90,rotateX:6,transformPerspective:1000,ease:"none"},0);
});

/* Section headings tilt up into place */
$$(".head-c, .look-head .lh, .cat-copy").forEach(function(el){
  own(el);
  gsap.from(el,{rotateX:22,y:60,z:-80,transformPerspective:1000,transformOrigin:"50% 100%",ease:"power2.out",
    scrollTrigger:{trigger:el,start:"top 95%",end:"top 60%",scrub:true}});
});

/* Services page: category photos swing round in 3D */
$$(".svc-cat").forEach(function(sec){
  var ph=$(".cat-photo",sec);if(!ph)return;own(ph);
  var flip=sec.classList.contains("flip");
  gsap.from(ph,{rotateY:flip?-30:30,x:flip?70:-70,z:-200,transformPerspective:1200,ease:"power2.out",
    scrollTrigger:{trigger:sec,start:"top 92%",end:"top 35%",scrub:1}});
});

/* Cards flip in as they arrive (about, contact, gallery, reviews) */
function batchIn(sel,from){
  var els=$$(sel);if(!els.length)return;own(els);
  ScrollTrigger.batch(els,{start:"top 92%",once:true,onEnter:function(batch){
    gsap.from(batch,Object.assign({transformPerspective:1000,duration:1,ease:"power3.out",stagger:.1,overwrite:true,clearProps:"transform"},from));
  }});
}
batchIn(".promise, .c-card",{rotateY:-35,x:-40,z:-120});
batchIn(".masonry .look",{rotateX:-40,y:90,z:-100});
batchIn(".rev",{rotateY:28,x:50,z:-100});
batchIn(".feat",{rotateX:-50,y:40});

/* Booking band card floats forward */
var info=$(".band .info-card");
if(info){own(info);gsap.from(info,{rotateY:-24,rotateX:8,z:-160,x:60,transformPerspective:1200,ease:"power2.out",scrollTrigger:{trigger:".band",start:"top 85%",end:"top 25%",scrub:1}});}

/* Images load late; re-measure pins and triggers once everything is in */
window.addEventListener("load",function(){ScrollTrigger.refresh();});
})();
