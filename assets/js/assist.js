/* Sinma Hair And Beauty — 24/7 Assistant (System 1) and WhatsApp automation demo (System 2).
   Rule-based, runs entirely in the browser; the only thing that leaves the page is a wa.me link the visitor taps. */
(function(){
"use strict";
var reduced=!!(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches);

/* ---------- Verified facts only ---------- */
var PHONE_DISPLAY="07311 189118";
var WA_BASE="https://wa.me/447311189118?text=";
var MAPS="https://www.google.com/maps/search/?api=1&query=Sinma+Hair+And+Beauty+Garratt+Lane+Tooting+London";
var SERVICES=["Cut & Finish","Blow Dry & Styling","Full Colour","Highlights & Balayage","Hair Treatments","Bridal & Occasion Hair","Eyebrow Threading & Tinting","Waxing","Facials","Manicure & Pedicure","Lashes & Brows"];
var HOURS_TEXT="We're open Monday to Saturday, 10:00 AM to 7:00 PM. We're closed on Sundays.";
var PRICE_TEXT="Our final price list is being added — message us on WhatsApp and we'll confirm the price for your service right away.";
function wa(text){return WA_BASE+encodeURIComponent(text);}

/* ---------- Dates and times (London) ---------- */
function pad(n){return(n<10?"0":"")+n;}
function nowLondon(){var p={};try{new Intl.DateTimeFormat("en-GB",{timeZone:"Europe/London",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(new Date()).forEach(function(x){p[x.type]=x.value;});}catch(e){var d=new Date();p={year:String(d.getFullYear()),month:pad(d.getMonth()+1),day:pad(d.getDate()),hour:pad(d.getHours()),minute:pad(d.getMinutes())};}return{iso:p.year+"-"+p.month+"-"+p.day,mins:(parseInt(p.hour,10)%24)*60+parseInt(p.minute,10)};}
function dateOf(iso){return new Date(iso+"T12:00:00Z");}
function dow(iso){return dateOf(iso).getUTCDay();}
function addDays(iso,n){var d=dateOf(iso);d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10);}
function fmt(iso,o){o.timeZone="UTC";return dateOf(iso).toLocaleDateString("en-GB",o);}
function dayName(iso){return fmt(iso,{weekday:"long"});}
function dateLabel(iso){return fmt(iso,{day:"numeric",month:"long"});}
function dateLong(iso){return fmt(iso,{day:"numeric",month:"long",year:"numeric"});}
function chipDay(iso){return fmt(iso,{weekday:"short",day:"numeric",month:"short"});}
function time12(m){var h=Math.floor(m/60),mm=m%60,s=h>=12?"PM":"AM",h12=((h+11)%12)+1;return h12+":"+pad(mm)+" "+s;}
function makeRef(){var c="ABCDEFGHJKLMNPQRSTUVWXYZ23456789",r="SIN-";for(var i=0;i<5;i++)r+=c.charAt(Math.floor(Math.random()*c.length));return r;}
function el(tag,cls,text){var e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e;}

/* =====================================================================
   SYSTEM 2 — WhatsApp automation (phone mockup + real send button)
   ===================================================================== */
function messagesFor(b){
  var day=dayName(b.iso),date=dateLabel(b.iso),t=time12(b.mins);
  return [
    {label:"Instant confirmation",text:"Hello "+b.name+", your appointment at Sinma Hair And Beauty is confirmed. "+b.service+" — "+day+", "+date+" at "+t+". We're at Garratt Lane, Tooting. Need to change anything? Just reply to this message."},
    {label:"Sent the day before",text:"Hi "+b.name+", a friendly reminder about your appointment tomorrow, "+date+" at "+t+" for "+b.service+". Reply YES to confirm, or message us to reschedule."},
    {label:"Sent after the visit",text:"Hi "+b.name+", thank you for visiting Sinma Hair And Beauty today. We hope you love your new look! If you were happy, a quick Google review would mean the world to us.",review:true}
  ];
}
function phoneShell(){
  var phone=el("div","wa-phone");
  var head=el("div","wa-head");
  var av=el("span","wa-av","S");av.setAttribute("aria-hidden","true");
  var who=el("div","wa-who");who.appendChild(el("strong",null,"Sinma Hair And Beauty"));who.appendChild(el("span",null,"Business account"));
  head.appendChild(av);head.appendChild(who);
  var body=el("div","wa-body");body.setAttribute("aria-live","polite");
  phone.appendChild(head);phone.appendChild(body);
  return {phone:phone,body:body};
}
function bubble(m){
  var wrap=el("div","wa-msg");
  wrap.appendChild(el("span","wa-label",m.label));
  var b=el("div","wa-bubble");
  b.appendChild(el("p",null,m.text));
  if(m.review){
    var a=el("a","wa-review","Review us on Google");a.href="#";a.addEventListener("click",function(e){e.preventDefault();});
    b.appendChild(a);
    b.appendChild(el("small","wa-note","live link added at launch"));
  }
  wrap.appendChild(b);
  return wrap;
}
function typing(){var t=el("div","wa-typing");t.setAttribute("aria-label","Sinma is typing");for(var i=0;i<3;i++)t.appendChild(el("span"));return t;}
/* Plays the three messages in order; returns a stop() function */
function play(body,msgs,opts){
  opts=opts||{};var timers=[],stopped=false;
  function later(fn,ms){timers.push(setTimeout(function(){if(!stopped)fn();},ms));}
  function run(){
    body.textContent="";
    if(reduced){msgs.forEach(function(m){body.appendChild(bubble(m));});return;}
    var t=300;
    msgs.forEach(function(m){
      var tp;
      later(function(){tp=typing();body.appendChild(tp);body.scrollTop=body.scrollHeight;},t);
      t+=1100;
      later(function(){if(tp)tp.remove();body.appendChild(bubble(m));body.scrollTop=body.scrollHeight;},t);
      t+=900;
    });
    if(opts.loop)later(run,t+3200);
  }
  run();
  return function(){stopped=true;timers.forEach(clearTimeout);};
}
function bookingSummary(b){
  return "Hello Sinma Hair And Beauty, I'd like to book an appointment.\nService: "+b.service+"\nDay: "+dayName(b.iso)+"\nDate: "+dateLong(b.iso)+"\nTime: "+time12(b.mins)+"\nName: "+b.name+(b.ref?"\nRef: "+b.ref:"");
}
/* Public: render the "What happens next" panel for a real booking */
function renderAutomation(container,b){
  var panel=el("div","auto-panel");
  panel.appendChild(el("h4","auto-title","What happens next — automatically:"));
  var shell=phoneShell();panel.appendChild(shell.phone);
  var send=el("a","btn btn-wood auto-send","Send this booking to the salon's WhatsApp");
  send.href=wa(bookingSummary(b));send.target="_blank";send.rel="noopener";
  panel.appendChild(send);
  container.appendChild(panel);
  play(shell.body,messagesFor(b));
  return panel;
}
window.SinmaAutomation={render:renderAutomation};

/* Demo mockup in "Your Website Works While You Work" (sample: Emily Carter), cycles while on screen */
(function(){
  var host=document.querySelector("[data-wa-demo]");if(!host)return;
  var n=nowLondon(),iso=addDays(n.iso,3);if(dow(iso)===0)iso=addDays(iso,1);
  var sample={name:"Emily Carter",service:"Highlights & Balayage",iso:iso,mins:14*60+30};
  var shell=phoneShell();host.appendChild(shell.phone);
  var stop=null;
  function start(){if(!stop)stop=play(shell.body,messagesFor(sample),{loop:!reduced});}
  function halt(){if(stop){stop();stop=null;}}
  if("IntersectionObserver" in window){new IntersectionObserver(function(es){es[0].isIntersecting?start():halt();}).observe(host);}else start();
})();

/* =====================================================================
   SYSTEM 1 — 24/7 Assistant
   ===================================================================== */
var launch=el("button","sa-launch");launch.type="button";launch.setAttribute("aria-expanded","false");launch.setAttribute("aria-controls","saPanel");
launch.innerHTML='<span class="sa-dot" aria-hidden="true"></span><span>24/7 Assistant</span>';
var panel=el("section","sa-panel");panel.id="saPanel";panel.hidden=true;panel.setAttribute("role","dialog");panel.setAttribute("aria-label","Sinma Assistant");
panel.innerHTML='<div class="sa-head"><span class="sa-av" aria-hidden="true">S</span><p class="sa-title"><strong>Sinma Assistant</strong> · replies instantly, 24/7</p><button class="sa-close" type="button" aria-label="Close assistant">×</button></div>'+
  '<div class="sa-log" id="saLog" aria-live="polite" data-lenis-prevent></div>'+
  '<div class="sa-chips" id="saChips"></div>'+
  '<form class="sa-form" id="saForm"><label for="saInput" class="sr">Type your message</label><input id="saInput" type="text" autocomplete="off" placeholder="Type your message…"><button type="submit">Send</button></form>';
document.body.appendChild(launch);document.body.appendChild(panel);
var log=panel.querySelector("#saLog"),chips=panel.querySelector("#saChips"),form=panel.querySelector("#saForm"),input=panel.querySelector("#saInput");
var started=false,flow=null;
var MAIN_CHIPS=["Opening hours","Services","Where are you?","Book an appointment","Chat on WhatsApp"];

function openChat(){panel.hidden=false;launch.setAttribute("aria-expanded","true");launch.classList.add("open");if(!started){started=true;greet();}setTimeout(function(){input.focus({preventScroll:true});},60);}
function closeChat(){panel.hidden=true;launch.setAttribute("aria-expanded","false");launch.classList.remove("open");launch.focus();}
launch.addEventListener("click",function(){panel.hidden?openChat():closeChat();});
panel.querySelector(".sa-close").addEventListener("click",closeChat);
document.addEventListener("keydown",function(e){if(e.key==="Escape"&&!panel.hidden)closeChat();});
document.addEventListener("click",function(e){var t=e.target.closest("[data-open-chat]");if(t){e.preventDefault();openChat();}});

function scroll(){log.scrollTop=log.scrollHeight;}
function say(text,who){var m=el("div","sa-msg "+(who||"bot"),text);log.appendChild(m);scroll();return m;}
function actions(list){
  var w=el("div","sa-actions");
  list.forEach(function(a){
    var b;
    if(a.href){b=el("a",a.alt?"alt":"",a.label);b.href=a.href;if(/^https?:/.test(a.href)){b.target="_blank";b.rel="noopener";}}
    else{b=el("button",a.alt?"alt":"",a.label);b.type="button";b.addEventListener("click",a.fn);}
    w.appendChild(b);
  });
  log.appendChild(w);scroll();
}
function setChips(list){chips.textContent="";list.forEach(function(c){var b=el("button",null,c);b.type="button";b.addEventListener("click",function(){user(c);});chips.appendChild(b);});}
function botSay(text,acts,chipList){
  if(reduced){say(text);if(acts)actions(acts);if(chipList)setChips(chipList);return;}
  var t=el("div","sa-msg bot sa-typing");t.innerHTML="<span></span><span></span><span></span>";log.appendChild(t);scroll();
  setTimeout(function(){t.remove();say(text);if(acts)actions(acts);if(chipList)setChips(chipList);},450);
}
function greet(){botSay("Hi, welcome to Sinma Hair And Beauty! I'm the Sinma Assistant. I can share our opening hours, services and where to find us, or book you in right here. How can I help?",null,MAIN_CHIPS);}
form.addEventListener("submit",function(e){e.preventDefault();var v=input.value.trim();if(!v)return;input.value="";user(v);});
function user(text){say(text,"me");if(flow){step(text);return;}respond(text);}

function respond(raw){
  var t=raw.toLowerCase();
  if(/chat on whatsapp|^whatsapp$/.test(t)){botSay("Of course. Tap below to open WhatsApp with a message ready to send, or call us on "+PHONE_DISPLAY+".",[{label:"Open WhatsApp",href:wa("Hello Sinma Hair And Beauty, I'd like to ask about an appointment")},{label:"Call "+PHONE_DISPLAY,href:"tel:+447311189118",alt:true}],MAIN_CHIPS);return;}
  if(/\b(book|booking|appointment|appoint|reserve|slot)\b/.test(t)){startBooking();return;}
  if(/(price|prices|cost|how much|£|charge|fee|quote|expensive|cheap)/.test(t)){botSay(PRICE_TEXT,[{label:"Ask for a price on WhatsApp",href:wa("Hello Sinma Hair And Beauty, could you confirm the price for: ")}],MAIN_CHIPS);return;}
  if(/\b(open|opening|hours?|timings?|close|closes|closing|closed|what time|sunday|sundays|today|tomorrow|weekend)\b/.test(t)){botSay(HOURS_TEXT,null,MAIN_CHIPS);return;}
  if(/\b(where|address|location|located|directions?|map|postcode|find you|get there|garratt|tooting)\b|where are you/.test(t)){botSay("You'll find us on Garratt Lane, Tooting, London.",[{label:"Open in Google Maps",href:MAPS}],MAIN_CHIPS);return;}
  if(/(service|menu|treatment|offer|do you do|haircut|hair cut|cut|colour|color|balayage|highlight|blow ?dry|bridal|occasion|thread|tint|brow|wax|facial|manicure|pedicure|nail|lash|styling)/.test(t)){botSay("Here's what we offer:\n• "+SERVICES.join("\n• ")+"\n\nWould you like to book one of these?",null,["Book an appointment","Opening hours","Chat on WhatsApp"]);return;}
  if(/\b(phone|call|number|contact|whatsapp|speak|talk)\b/.test(t)){botSay("You can call or WhatsApp us on "+PHONE_DISPLAY+".",[{label:"Open WhatsApp",href:wa("Hello Sinma Hair And Beauty, I'd like to ask about an appointment")},{label:"Call",href:"tel:+447311189118",alt:true}],MAIN_CHIPS);return;}
  if(/\b(hi|hello|hey|hiya|salam|assalam|good (morning|afternoon|evening))\b/.test(t)){botSay("Hello! How can I help you today?",null,MAIN_CHIPS);return;}
  if(/\b(thanks?|thank you|cheers)\b/.test(t)){botSay("You're very welcome! Is there anything else I can help with?",null,MAIN_CHIPS);return;}
  unknown(raw);
}

/* Unknown question: apology + WhatsApp handoff + in-chat enquiry form (every enquiry captured) */
function unknown(q){
  botSay("Sorry, I don't have the answer to that one. You can ask the salon directly on WhatsApp, or leave your details below and we'll get back to you.",
    [{label:"Ask on WhatsApp",href:wa("Hello Sinma Hair And Beauty, I have a question: "+q)}]);
  setTimeout(function(){enquiryForm(q);},reduced?0:500);
}
function enquiryForm(q){
  var f=el("form","sa-enquiry");f.noValidate=true;
  var uid="q"+Math.random().toString(36).slice(2,7);
  f.innerHTML='<p class="sa-enq-title">Leave an enquiry</p>'+
    '<label for="'+uid+'n">Name</label><input id="'+uid+'n" type="text" autocomplete="name" required>'+
    '<label for="'+uid+'m">Mobile</label><input id="'+uid+'m" type="tel" autocomplete="tel" required placeholder="07…">'+
    '<label for="'+uid+'t">Message</label><textarea id="'+uid+'t" rows="3" required></textarea>'+
    '<p class="sa-err" role="alert"></p><button type="submit">Send enquiry</button>';
  f.querySelector("textarea").value=q;
  f.addEventListener("submit",function(e){
    e.preventDefault();
    var n=f.querySelector("#"+uid+"n").value.trim(),m=f.querySelector("#"+uid+"m").value.trim(),t=f.querySelector("#"+uid+"t").value.trim(),err=f.querySelector(".sa-err");
    if(n.length<2){err.textContent="Please enter your name.";return;}
    if(m.replace(/[^\d]/g,"").length<10){err.textContent="Please enter your mobile number.";return;}
    if(t.length<2){err.textContent="Please type your message.";return;}
    var done=el("div","sa-msg bot sa-thanks","Thank you — Sinma will get back to you shortly.");
    f.replaceWith(done);setChips(MAIN_CHIPS);scroll();
  });
  log.appendChild(f);scroll();
}

/* In-chat booking: service → day → time → name → mobile */
function nextDays(){var n=nowLondon(),out=[];for(var i=0;i<14;i++)out.push(addDays(n.iso,i));return out;}
function timesFor(iso){var n=nowLondon(),out=[];for(var m=600;m<=1110;m+=30){if(iso===n.iso&&m<n.mins+30)continue;out.push(m);}return out;}
function startBooking(){
  flow={step:"service",data:{}};
  botSay("Lovely, let's get you booked in. Which service would you like?",null,SERVICES.concat(["Cancel"]));
}
function step(raw){
  var t=raw.trim(),d=flow.data;
  if(/^(cancel|stop|exit|never ?mind)$/i.test(t)){flow=null;botSay("No problem, I've cancelled that booking. Anything else I can help with?",null,MAIN_CHIPS);return;}
  if(flow.step==="service"){
    var match=null;SERVICES.forEach(function(s){if(!match&&s.toLowerCase()===t.toLowerCase())match=s;});
    if(!match)SERVICES.forEach(function(s){if(!match&&(s.toLowerCase().indexOf(t.toLowerCase())>-1||t.toLowerCase().indexOf(s.toLowerCase().split(" ")[0])>-1))match=s;});
    if(!match){botSay("Please choose one of our services below.",null,SERVICES.concat(["Cancel"]));return;}
    d.service=match;flow.step="day";flow.days=nextDays();
    botSay("Great choice: "+match+". Which day would suit you? We're open Monday to Saturday.",null,flow.days.map(chipDay).concat(["Cancel"]));return;
  }
  if(flow.step==="day"){
    var i=flow.days.map(chipDay).indexOf(t),iso=i>-1?flow.days[i]:null;
    if(!iso&&/today/i.test(t))iso=flow.days[0];
    if(!iso&&/tomorrow/i.test(t))iso=flow.days[1];
    if(!iso){botSay("Please pick a day from the options below.",null,flow.days.map(chipDay).concat(["Cancel"]));return;}
    if(dow(iso)===0){botSay("Sorry, we're closed on Sundays. Please choose another day, Monday to Saturday.",null,flow.days.map(chipDay).concat(["Cancel"]));return;}
    var times=timesFor(iso);
    if(!times.length){botSay("Sorry, there are no times left today. Please choose another day.",null,flow.days.map(chipDay).concat(["Cancel"]));return;}
    d.iso=iso;flow.times=times;flow.step="time";
    botSay("What time on "+dayName(iso)+", "+dateLabel(iso)+"?",null,times.map(time12).concat(["Cancel"]));return;
  }
  if(flow.step==="time"){
    var j=flow.times.map(time12).map(function(s){return s.toLowerCase();}).indexOf(t.toLowerCase());
    if(j<0){botSay("Please choose one of the available times below.",null,flow.times.map(time12).concat(["Cancel"]));return;}
    d.mins=flow.times[j];flow.step="name";
    botSay("Perfect, "+time12(d.mins)+". What name should I put the booking under?",null,["Cancel"]);return;
  }
  if(flow.step==="name"){
    if(t.length<2){botSay("Please type your name.",null,["Cancel"]);return;}
    d.name=t;flow.step="mobile";
    botSay("Thanks, "+t.split(" ")[0]+". And your mobile number?",null,["Cancel"]);return;
  }
  if(flow.step==="mobile"){
    if(t.replace(/[^\d]/g,"").length<10){botSay("That doesn't look like a full mobile number. Please try again, for example 07…",null,["Cancel"]);return;}
    d.mobile=t;d.ref=makeRef();flow=null;
    botSay("Here's your booking summary:\n\nService: "+d.service+"\nDay & date: "+dayName(d.iso)+", "+dateLong(d.iso)+"\nTime: "+time12(d.mins)+"\nName: "+d.name+"\nMobile: "+d.mobile+"\nBooking reference: "+d.ref);
    setTimeout(function(){var holder=el("div","sa-auto");log.appendChild(holder);renderAutomation(holder,d);scroll();setChips(MAIN_CHIPS);},reduced?0:700);
  }
}
})();
