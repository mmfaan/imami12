/* أدوات نصية مشتركة (المتصفح + Node): تطبيع عربي، فصل السند عن المتن، إبراز نتائج البحث */
(function(g){
const DIA=/[ؐ-ًؚ-ٰٟۖ-ۭـ]/g;
/* تطبيع للبحث: حذف التشكيل وتوحيد الألف والياء والتاء المربوطة */
function nz(s){return String(s||'').replace(DIA,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/[ؤ]/g,'و').replace(/[ئ]/g,'ي').replace(/[^ء-يa-zA-Z0-9\s]/g,' ').replace(/\s+/g,' ').trim()}
/* نسخة بلا تشكيل مع خريطة الفهارس إلى النص الأصلي */
function strip(t){let s='',m=[];for(let i=0;i<t.length;i++){if(DIA.test(t[i])){DIA.lastIndex=0;continue}DIA.lastIndex=0;s+=t[i];m.push(i)}return{s,m}}
/* فصل السند عن المتن: أول «قال/يقول» لا يتبعه راوٍ جديد (حدثنا/أخبرنا/عن) وقد سبقه سند فعلاً */
const LINK=/(?:^|\s)(?:عن|حدثنا|أخبرنا|اخبرنا|حدثني|أخبرني|اخبرني|حدثه|أخبره|روى|رفعه|وحدثنا|وأخبرنا|و حدثنا|و أخبرنا)(?=\s)/;
function splitIsnad(text){
  const t=String(text||'').replace(/^\s*\d+\s*[-ـ–]+\s*/,'');
  const {s,m}=strip(t);
  const limit=Math.min(s.length,1100);
  const re=/(?:أنه|إنه|انه)?\s*(?:قال|يقول|قالا)\s*[:：]?\s*/g;
  let r,chain=0,last=0;
  while((r=re.exec(s))&&r.index<limit){
    chain+=((s.slice(last,r.index).match(/(?:^|\s)(?:عن|حدثنا|أخبرنا|اخبرنا|حدثني|أخبرني|اخبرني|روى|رفعه)(?=\s)/g))||[]).length;
    last=r.index;
    const after=s.slice(re.lastIndex,re.lastIndex+44);
    if(LINK.test(after))continue;
    if(chain<2)continue;
    const idx=re.lastIndex>=m.length?t.length:m[re.lastIndex];
    const matn=t.slice(idx).replace(/^[\s:،]+/,'').trim();
    if(matn.length<30)return{isnad:'',matn:t.trim()};
    return{isnad:t.slice(0,idx).trim(),matn};
  }
  return{isnad:'',matn:t.trim()};
}
/* إبراز الكلمات المبحوث عنها في نص مُشكَّل: نطابق على نسخة مطبّعة ونعيد الفهارس إلى الأصل */
function highlight(t,words,esc){
  if(!words||!words.length)return esc(t);
  const map=[];let n='';
  for(let i=0;i<t.length;i++){const c=t[i];if(DIA.test(c)){DIA.lastIndex=0;continue}DIA.lastIndex=0;
    let x=c.replace(/[أإآٱ]/,'ا').replace('ى','ي').replace('ة','ه').replace('ؤ','و').replace('ئ','ي');n+=x;map.push(i)}
  const ranges=[];
  words.forEach(w=>{if(!w)return;let p=0;while((p=n.indexOf(w,p))>=0){ranges.push([map[p],map[p+w.length-1]+1]);p+=w.length}});
  if(!ranges.length)return esc(t);
  ranges.sort((a,b)=>a[0]-b[0]);
  const merged=[ranges[0].slice()];
  for(let i=1;i<ranges.length;i++){const l=merged[merged.length-1];if(ranges[i][0]<=l[1])l[1]=Math.max(l[1],ranges[i][1]);else merged.push(ranges[i].slice())}
  let out='',last=0;
  merged.forEach(([a,b])=>{out+=esc(t.slice(last,a))+'<mark>'+esc(t.slice(a,b))+'</mark>';last=b});
  return out+esc(t.slice(last));
}
const api={nz,strip,splitIsnad,highlight};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else g.TU=api;
})(typeof window!=='undefined'?window:globalThis);
