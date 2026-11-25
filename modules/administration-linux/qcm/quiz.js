"use strict";
(()=>{
const bank=window.ENI_QCM_BANK, chapters=window.ENI_QCM_CHAPTERS;
const quotas=[2,2,3,4,4,3,6,6,4,3,3];
const TOTAL=40;
const KEY="eni-linux-qcm-state-v1";
const HISTORY="eni-linux-qcm-recent-v1";
const byId=new Map((bank||[]).map(q=>[q.id,q]));
const el=id=>document.getElementById(id);
if(!Array.isArray(bank)||bank.length<40||!Array.isArray(chapters)||chapters.length!==11||quotas.reduce((a,b)=>a+b,0)!==TOTAL){
  el("quiz-intro").textContent="Le questionnaire n'a pas pu se charger. Actualise la page.";
  return;
}
el("total-bank").textContent=bank.length;
const shuffle=list=>{
 const result=[...list];
 for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}
 return result;
};
const load=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}};
const save=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value))}catch{}};
const pickQuiz=()=>{
 let recent=load(HISTORY,[]);
 if(!Array.isArray(recent))recent=[];
 const drawn=[];
 for(let ch=1;ch<=11;ch++){
  const pool=bank.filter(q=>q.ch===ch), fresh=shuffle(pool.filter(q=>!recent.includes(q.id))), old=shuffle(pool.filter(q=>recent.includes(q.id)));
  drawn.push(...fresh.concat(old).slice(0,quotas[ch-1]));
 }
 const quiz=shuffle(drawn).map(q=>({id:q.id,order:shuffle([0,1,2,3])}));
 save(HISTORY,quiz.map(x=>x.id));
 return quiz;
};
const validState=s=>s&&Array.isArray(s.quiz)&&s.quiz.length===TOTAL&&s.quiz.every(x=>byId.has(x.id)&&Array.isArray(x.order)&&x.order.length===4&&new Set(x.order).size===4)&&Number.isInteger(s.pos)&&s.pos>=0&&s.pos<TOTAL&&s.answers&&typeof s.answers==="object";
let state=load(KEY,null);
if(!validState(state))state=null;
const persist=()=>save(KEY,state);
const panel=id=>{for(const name of ["quiz-intro","quiz-active","quiz-done"])el(name).hidden=name!==id};
const numberOfCorrect=()=>state.quiz.reduce((total,entry,i)=>{
 const q=byId.get(entry.id);
 return total+(Object.prototype.hasOwnProperty.call(state.answers,i)&&state.answers[i]===q.answer?1:0);
},0);
const completed=()=>Object.keys(state.answers).length===TOTAL;
const start=()=>{
 state={quiz:pickQuiz(),pos:0,answers:{},choice:null,locked:false,done:false};
 persist();
 showQuestion();
};
const quotaBox=el("quota-list");
for(let ch=1;ch<=11;ch++){
 const item=document.createElement("div");item.className="quota-item";
 const title=document.createElement("span");title.textContent=String(ch).padStart(2,"0")+" · "+chapters[ch-1];
 const count=document.createElement("strong");count.textContent=quotas[ch-1]+" question"+(quotas[ch-1]>1?"s":"");
 item.append(title,count);quotaBox.append(item);
}
el("start-quiz").addEventListener("click",start);
el("resume-quiz").addEventListener("click",()=>{if(state)state.done?showFinal():showQuestion()});
el("new-quiz").addEventListener("click",start);
el("restart-during").addEventListener("click",()=>{if(confirm("Recommencer et remplacer la session actuelle ?"))start()});
el("validate-answer").addEventListener("click",()=>{
 if(!state||state.locked||state.choice===null)return;
 state.answers[state.pos]=state.choice;
 state.locked=true;
 persist();
 showQuestion();
});
el("next-question").addEventListener("click",()=>{
 if(!state||!state.locked)return;
 if(state.pos===TOTAL-1){state.done=true;persist();showFinal();return;}
 state.pos++;
 state.choice=null;state.locked=false;persist();showQuestion();
});
function showQuestion(){
 panel("quiz-active");
 const entry=state.quiz[state.pos],q=byId.get(entry.id);
 const locked=!!state.locked, chosen=locked?state.answers[state.pos]:state.choice;
 el("question-count").textContent="Question "+(state.pos+1)+" / "+TOTAL;
 el("question-score").textContent="Score : "+numberOfCorrect();
 el("progress-fill").style.width=((state.pos+(locked?1:0))/TOTAL*100)+"%";
 el("question-chapter").textContent="Chapitre "+q.ch+" · "+chapters[q.ch-1];
 el("question-title").textContent=q.q;
 const wrap=el("question-options");
 wrap.replaceChildren();
 for(let j=0;j<4;j++){
  const original=entry.order[j];
  const label=document.createElement("label");
  label.className="q-option";
  const input=document.createElement("input");input.type="radio";input.name="qcm-answer";input.value=original;input.checked=chosen===original;input.disabled=locked;
  const letter=document.createElement("span");letter.className="option-letter";letter.textContent="ABCD"[j]+".";
  const text=document.createElement("span");text.className="option-text";text.textContent=q.choices[original];
  label.append(input,letter,text);
  if(chosen===original)label.classList.add("selected");
  if(locked){label.classList.add("locked");if(original===q.answer)label.classList.add("correct");else if(chosen===original)label.classList.add("incorrect");}
  else input.addEventListener("change",()=>{state.choice=original;persist();showQuestion()});
  wrap.append(label);
 }
 const feedback=el("question-feedback");feedback.hidden=!locked;
 feedback.className="feedback"+(locked?(chosen===q.answer?" good":" bad"):"");
 feedback.replaceChildren();
 if(locked){
  const header=document.createElement("strong");
  header.textContent=chosen===q.answer?"✓ Bonne réponse !":"✗ Réponse incorrecte";
  const right=document.createElement("p");right.textContent="Bonne réponse : "+q.choices[q.answer];
  const why=document.createElement("p");why.textContent=q.why;
  const source=document.createElement("p");source.className="source";source.textContent="Source : support ENI 2021-11, page "+q.page+".";
  feedback.append(header,right,why,source);
 }
 el("validate-answer").hidden=locked;
 el("validate-answer").disabled=!locked&&state.choice===null;
 el("next-question").hidden=!locked;
 el("next-question").textContent=state.pos===TOTAL-1?"Voir mes résultats":"Question suivante";
 el("question-title").focus({preventScroll:true});
}
function showFinal(){
 panel("quiz-done");
 const good=numberOfCorrect(),pct=Math.round(good/TOTAL*100);
 el("final-score").textContent=good+" / "+TOTAL+" · "+pct+" %";
 el("final-subtitle").textContent=pct>=90?"Excellent travail !":pct>=75?"Très bon résultat.":pct>=50?"Bonne base, certaines notions méritent une révision.":"Reprends les chapitres progressivement puis lance une nouvelle session.";
 const tally=chapters.map(()=>({good:0,total:0})),errors=[];
 state.quiz.forEach((entry,i)=>{
  const q=byId.get(entry.id),score=tally[q.ch-1];
  score.total++;
  const ok=state.answers[i]===q.answer;
  if(ok)score.good++;else errors.push({q,choice:state.answers[i]});
 });
 const results=el("chapter-results");results.replaceChildren();
 for(let i=0;i<11;i++){
  const row=document.createElement("div");row.className="chapter-result";
  const title=document.createElement("span");title.className="chapter-name";title.textContent=String(i+1).padStart(2,"0")+" · "+chapters[i];
  const track=document.createElement("span");track.className="mini-track";
  const fill=document.createElement("span");fill.style.width=(tally[i].good/tally[i].total*100)+"%";track.append(fill);
  const fraction=document.createElement("span");fraction.className="chapter-fraction";fraction.textContent=tally[i].good+"/"+tally[i].total;
  row.append(title,track,fraction);results.append(row);
 }
 el("errors-count").textContent=errors.length;
 const list=el("errors-list");list.replaceChildren();
 if(!errors.length){
  const p=document.createElement("p");p.textContent="Aucune erreur, bravo !";list.append(p);
 }
 for(const item of errors){
  const entry=document.createElement("div");entry.className="error-entry";
  const title=document.createElement("strong");title.textContent="Chapitre "+item.q.ch+" · "+item.q.q;
  const mine=document.createElement("p");mine.textContent="Ta réponse : "+item.q.choices[item.choice];
  const correct=document.createElement("p");correct.className="correct-response";correct.textContent="Bonne réponse : "+item.q.choices[item.q.answer];
  const why=document.createElement("p");why.textContent=item.q.why+" (PDF ENI, p. "+item.q.page+")";
  entry.append(title,mine,correct,why);list.append(entry);
 }
 el("errors-details").open=false;
}
document.addEventListener("keydown",event=>{
 if(!state||state.done||el("quiz-active").hidden||event.ctrlKey||event.altKey||event.metaKey||event.target.closest("input,textarea,select"))return;
 const key=event.key.toUpperCase();
 if("ABCD".includes(key)&&key.length===1&&!state.locked){
  state.choice=state.quiz[state.pos].order["ABCD".indexOf(key)];persist();showQuestion();
 }
 if(key==="ENTER"){
  event.preventDefault();
  if(state.locked)el("next-question").click();
  else if(state.choice!==null)el("validate-answer").click();
 }
});
if(state){
 el("resume-quiz").hidden=false;
 el("resume-quiz").textContent=state.done?"Revoir mon dernier résultat":"Reprendre ma session ("+(state.pos+1)+"/40)";
}
})();