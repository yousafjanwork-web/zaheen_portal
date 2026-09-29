import{u as K,c as Q,a as Z,b as X,d as ss,g as D,e as es,r as h,f as is,j as s,L as H,C as $,Z as as,F as rs,B as ns,G as ts,h as os,i as ls,k as cs,P as ds,l as I,S as ms,A as ps,m as hs,n as gs,o as us,p as xs,q as fs,s as bs,t as js,v as V,w as Y}from"./index-DTaZXaa2.js";const vs="https://cdn.zaheen.com.pk/zaheen-web-img/lab2.png",ws=()=>{const[n,a]=h.useState(()=>I());return h.useEffect(()=>{const o=()=>a(I());return window.addEventListener("storage",o),window.addEventListener("languageChange",o),()=>{window.removeEventListener("storage",o),window.removeEventListener("languageChange",o)}},[]),n},z=(n,a)=>{var o,b;try{const j=(b=(o=n.classSubjectsView)==null?void 0:o.subjects)==null?void 0:b[a];return typeof(j==null?void 0:j.description)=="string"?j.description:""}catch{return""}},d=n=>({en:z(Y,n)||z(Y,"default"),ur:z(V,n)||z(V,"default")}),B=n=>{const a=n.toLowerCase();return a.includes("math")||a.includes("ریاضی")?{isMath:!0,color:"#1E3A5F",iconBg:"#2563EB",iconColor:"#fff",tag:null,desc:d("math"),units:[{n:"Unit 1",t:{en:"Numbers",ur:"اعداد"}},{n:"Unit 2",t:{en:"Shapes",ur:"شکلیں"}},{n:"Unit 3",t:{en:"Ratios",ur:"تناسب"}},{n:"Unit 4",t:{en:"Algebra",ur:"الجبرا"}}],icon:s.jsx(ms,{size:26})}:a.includes("physic")?{isMath:!1,color:"#1d4ed8",iconBg:"#EFF6FF",iconColor:"#1d4ed8",tag:{en:"Core",ur:"بنیادی"},desc:d("physics"),units:[],icon:s.jsx(ps,{size:22})}:a.includes("chem")?{isMath:!1,color:"#059669",iconBg:"#ECFDF5",iconColor:"#059669",tag:{en:"Core",ur:"بنیادی"},desc:d("chemistry"),units:[],icon:s.jsx(hs,{size:22})}:a.includes("bio")?{isMath:!1,color:"#16a34a",iconBg:"#F0FDF4",iconColor:"#16a34a",tag:{en:"Core",ur:"بنیادی"},desc:d("biology"),units:[],icon:s.jsx(gs,{size:22})}:a.includes("english")||a.includes("انگریزی")?{isMath:!1,color:"#2563EB",iconBg:"#EEF3FF",iconColor:"#2563EB",tag:{en:"Core",ur:"بنیادی"},desc:d("english"),units:[],icon:s.jsxs("svg",{width:"22",height:"22",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round",children:[s.jsx("path",{d:"M4 19.5A2.5 2.5 0 0 1 6.5 17H20"}),s.jsx("path",{d:"M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"})]})}:a.includes("urdu")||a.includes("اردو")?{isMath:!1,color:"#374151",iconBg:"#F3F4F6",iconColor:"#374151",tag:{en:"Regional",ur:"علاقائی"},desc:d("urdu"),units:[],icon:s.jsx(us,{size:22})}:a.includes("science")||a.includes("سائنس")?{isMath:!1,color:"#374151",iconBg:"#F3F4F6",iconColor:"#374151",tag:{en:"Core",ur:"بنیادی"},desc:d("biology"),units:[],icon:s.jsx("svg",{width:"22",height:"22",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round",children:s.jsx("path",{d:"M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v11l-4 7h14l-4-7V3"})})}:a.includes("computer")||a.includes("cs")||a.includes("کمپیوٹر")?{isMath:!1,color:"#065F46",iconBg:"#ECFDF5",iconColor:"#065F46",tag:{en:"Core",ur:"بنیادی"},desc:d("computer"),units:[],icon:s.jsx(xs,{size:22})}:a.includes("islamic")||a.includes("اسلام")?{isMath:!1,color:"#92400E",iconBg:"#FEF3E2",iconColor:"#92400E",tag:{en:"Regional",ur:"علاقائی"},desc:d("islamic"),units:[],icon:s.jsxs("svg",{width:"22",height:"22",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round",children:[s.jsx("path",{d:"M4 19.5A2.5 2.5 0 0 1 6.5 17H20"}),s.jsx("path",{d:"M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"}),s.jsx("path",{d:"M9 7h6"}),s.jsx("path",{d:"M9 11h4"})]})}:a.includes("pakistan")?{isMath:!1,color:"#c2410c",iconBg:"#FFF7ED",iconColor:"#c2410c",tag:{en:"Regional",ur:"علاقائی"},desc:d("pakistan"),units:[],icon:s.jsx(fs,{size:22})}:{isMath:!1,color:"#2563EB",iconBg:"#EEF3FF",iconColor:"#2563EB",tag:{en:"Core",ur:"بنیادی"},desc:d("default"),units:[],icon:s.jsx(bs,{size:22})}},_={6:{title:{en:"Grade 6: Your Academic Journey",ur:"جماعت ۶: آپ کا تعلیمی سفر"},sub:{en:"Transition into higher learning with focused investigation and independent discovery. Master the fundamentals of core disciplines and develop your intellectual voice.",ur:"اعلیٰ تعلیم میں قدم رکھیں۔ بنیادی مضامین میں مہارت حاصل کریں اور اپنی علمی آواز پیدا کریں۔"}},7:{title:{en:"Grade 7: Expand Your Horizons",ur:"جماعت ۷: اپنے افق کو وسعت دیں"},sub:{en:"Deepen analytical skills and explore complex ideas. Build confidence in problem-solving and creative expression across all disciplines.",ur:"تجزیاتی مہارتوں کو گہرا کریں۔ تمام مضامین میں مسئلہ حل کرنے کی صلاحیت پیدا کریں۔"}},8:{title:{en:"Grade 8: Prepare for Excellence",ur:"جماعت ۸: عمدگی کی تیاری کریں"},sub:{en:"Rigorous preparation for secondary education. Master advanced concepts and develop the critical thinking skills required for future success.",ur:"ثانوی تعلیم کی مضبوط تیاری۔ جدید تصورات میں مہارت اور تنقیدی سوچ کی صلاحیت پیدا کریں۔"}}},Fs=[{day:{en:"Mon",ur:"پیر"},time:"09:00 AM",topic:{en:"Advanced Arithmetic",ur:"جدید حساب"},active:!1},{day:{en:"Tue",ur:"منگل"},time:"10:30 AM",topic:{en:"Literature Review",ur:"ادب کا جائزہ"},active:!0},{day:{en:"Wed",ur:"بدھ"},time:"11:00 AM",topic:{en:"Biology Basics",ur:"حیاتیات کی بنیادیں"},active:!1},{day:{en:"Thu",ur:"جمعرات"},time:"09:00 AM",topic:{en:"Urdu Linguistics",ur:"اردو لسانیات"},active:!1}],C=()=>s.jsxs("div",{style:{background:"#fff",border:"1px solid #E5E9F0",borderRadius:14,padding:22,display:"flex",flexDirection:"column",gap:12,animation:"msPulse 1.4s ease-in-out infinite"},children:[s.jsx("div",{style:{width:48,height:48,borderRadius:10,background:"#F1F5F9"}}),s.jsx("div",{style:{height:14,width:"55%",background:"#F1F5F9",borderRadius:6}}),s.jsx("div",{style:{height:13,width:"90%",background:"#F1F5F9",borderRadius:6}}),s.jsx("div",{style:{height:13,width:"70%",background:"#F1F5F9",borderRadius:6}}),s.jsx("div",{style:{height:3,width:"100%",background:"#F1F5F9",borderRadius:100,marginTop:8}}),s.jsx("div",{style:{height:38,width:"100%",background:"#F1F5F9",borderRadius:8}})]}),Ns=()=>{var T,G;const{classSlug:n}=K(),a=Q(n??""),o=Z(),b=X(),i=ws()==="ur",{isLoggedIn:W}=ss(),F=((T=b.state)==null?void 0:T.classTitle)||((G=b.state)==null?void 0:G.gradeType)||`Grade ${D(n??"")??a}`,{classInfo:g,subjects:t,chapters:x,chapterVideos:u,loading:A}=es(a??0),O=h.useMemo(()=>D(n??"")??6,[n]),y=_[O]||_[6],M=h.useMemo(()=>{var p;const e=D(n??"");if(!g)return e?`Grade ${e}`:F||"";if(!i)return e?`Grade ${e}`:g.name||F;const r=(p=g.urdu_name)==null?void 0:p.trim();return r||(e?`جماعت ${e}`:g.name||F)},[g,i,n,F]);g==null||g.id;const N=e=>o(`/${n}/${js(e.name)}`,{state:{gradeType:M,selectedSubject:e,classTitle:M}}),c=h.useMemo(()=>(t==null?void 0:t.find(e=>B(e.name).isMath))??null,[t]),S=h.useMemo(()=>(t==null?void 0:t.filter(e=>!B(e.name).isMath))??[],[t]),L=S.slice(0,2),R=S.slice(2),k=h.useMemo(()=>!x||!u?[]:x.flatMap(e=>(u[e.id]||[]).map(r=>r.id)),[x,u]),{watchedSet:E}=is(k,W),U=h.useMemo(()=>{const e={};return!t||!x||t.forEach(r=>{const m=x.filter(w=>String(w.subject_id)===String(r.id)).flatMap(w=>(u==null?void 0:u[w.id])||[]),l=m.length,f=m.filter(w=>E.has(w.id)).length,J=l>0?Math.round(f/l*100):0;e[String(r.id)]={pct:J,watched:f,total:l}}),e},[t,x,u,E]),v=h.useMemo(()=>{const e=k.length,r=k.filter(m=>E.has(m)).length;return{pct:e>0?Math.round(r/e*100):0,watched:r,total:e}},[k,E]),q=e=>{var l;const r=B(e.name),p=i&&((l=e.urdu_name)==null?void 0:l.trim())||e.name,m=U[String(e.id)]||{pct:0};return s.jsxs("div",{className:"ms-subj-card",onClick:()=>N(e),children:[s.jsxs("div",{className:"ms-subj-card-top",children:[s.jsx("div",{className:"ms-subj-icon-box",style:{background:r.iconBg,color:r.iconColor},children:r.icon}),r.tag&&s.jsx("span",{className:"ms-subj-tag",children:i?r.tag.ur:r.tag.en})]}),s.jsx("h3",{className:"ms-subj-name",children:p}),s.jsx("p",{className:"ms-subj-desc",children:i?e.urdu_desc||r.desc.ur:e.desc||r.desc.en}),s.jsxs("div",{children:[s.jsxs("div",{className:"ms-prog-row",children:[s.jsx("span",{children:i?"تکمیل":"Completion Progress"}),s.jsxs("span",{children:[m.pct,"%"]})]}),s.jsx("div",{className:"ms-prog-bar",children:s.jsx("div",{className:"ms-prog-fill",style:{width:`${m.pct}%`}})})]}),s.jsx("button",{className:"ms-continue-btn",onClick:f=>{f.stopPropagation(),N(e)},children:i?"جاری رکھیں":"Continue"})]},e.id)},P=()=>{var m;if(!c)return null;const e=B(c.name),r=i&&((m=c.urdu_name)==null?void 0:m.trim())||c.name,p=U[String(c.id)]||{pct:0};return s.jsxs("div",{className:"ms-math-card",onClick:()=>N(c),children:[s.jsxs("div",{className:"ms-math-top",children:[s.jsx("div",{className:"ms-math-icon",children:e.icon}),s.jsxs("div",{children:[s.jsxs("h3",{className:"ms-math-name",children:[r,i?": جدید حساب اور جیومیٹری":": Advanced Arithmetic & Geometry"]}),s.jsx("p",{className:"ms-math-desc",children:i?c.urdu_desc||e.desc.ur:c.desc||e.desc.en})]})]}),e.units.length>0&&s.jsx("div",{className:"ms-units-grid",children:e.units.map((l,f)=>s.jsxs("div",{className:"ms-unit-box",children:[s.jsx("p",{className:"ms-unit-lbl",children:l.n}),s.jsx("p",{className:"ms-unit-name",children:i?l.t.ur:l.t.en})]},f))}),s.jsxs("div",{className:"ms-math-footer",children:[s.jsxs("div",{className:"ms-math-prog-wrap",children:[s.jsxs("div",{className:"ms-math-prog-row",children:[s.jsx("span",{children:i?"کورس کی پیشرفت":"Course Progress"}),s.jsxs("span",{children:[p.pct,"%"]})]}),s.jsx("div",{className:"ms-math-prog-bar",children:s.jsx("div",{className:"ms-math-prog-fill",style:{width:`${p.pct}%`}})})]}),s.jsx("button",{className:"ms-start-btn",onClick:l=>{l.stopPropagation(),N(c)},children:i?"ابھی شروع کریں":"Start Now"})]})]})};return s.jsxs("div",{style:{minHeight:"100vh",background:"#F1F5F9",fontFamily:"'DM Sans','Nunito','Segoe UI',sans-serif",direction:i?"rtl":"ltr"},children:[s.jsx("style",{children:`
       
        @keyframes msPulse  { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes msFadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }

        .ms-wrap { max-width:1280px;margin:0 auto;padding:clamp(24px,4vw,48px) clamp(14px,3vw,28px) 72px; }

        .ms-hero {
          background:linear-gradient(120deg,#0F172A 0%,#1E3A5F 55%,#134E4A 100%);
          border-radius:18px;padding:clamp(36px,5vw,56px) clamp(24px,5vw,52px);
          margin-bottom:20px;animation:msFadeUp .45s ease both;
        }
        .ms-hero-title { font-size:clamp(1.8rem,4.5vw,3rem);font-weight:800;color:#fff;margin:0 0 14px;line-height:1.15;letter-spacing:-.3px; }
        .ms-hero-sub   { font-size:clamp(.85rem,1.6vw,.98rem);color:rgba(255,255,255,.65);margin:0;line-height:1.75;max-width:640px; }

        .ms-qr-bar {
          background:#fff;border:1px solid #E2E8F0;border-radius:14px;
          padding:14px 20px;margin-bottom:24px;display:flex;align-items:center;
          gap:16px;flex-wrap:wrap;animation:msFadeUp .5s ease both;
        }
        .ms-qr-label { font-size:.7rem;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#64748B;display:flex;align-items:center;gap:6px; }
        .ms-qr-div   { width:1px;height:22px;background:#E2E8F0; }
        .ms-qr-btn-solid    { display:inline-flex;align-items:center;gap:7px;background:#2563EB;color:#fff;font-weight:700;font-size:.82rem;padding:9px 18px;border-radius:9px;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;transition:background .15s; }
        .ms-qr-btn-solid:hover { background:#1D4ED8; }
        .ms-qr-btn-outline  { display:inline-flex;align-items:center;gap:7px;background:#fff;color:#1E293B;font-weight:700;font-size:.82rem;padding:9px 18px;border-radius:9px;border:1.5px solid #E2E8F0;cursor:pointer;font-family:'DM Sans',sans-serif;transition:border-color .15s; }
        .ms-qr-btn-outline:hover { border-color:#94A3B8; }

        .ms-layout { display:grid;grid-template-columns:1fr 360px;gap:22px;align-items:start; }

        .ms-sec-hd       { display:flex;align-items:center;gap:9px;margin-bottom:16px; }
        .ms-sec-hd-icon  { color:#2563EB; }
        .ms-sec-title    { font-size:1.2rem;font-weight:800;color:#0F172A;margin:0; }

        .ms-subj-grid { display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px; }
        .ms-subj-card {
          background:#fff;border:1px solid #E5E9F0;border-radius:14px;
          padding:20px 18px 18px;display:flex;flex-direction:column;gap:10px;
          cursor:pointer;transition:box-shadow .18s ease,transform .18s cubic-bezier(.34,1.56,.64,1),border-color .15s;
          position:relative;overflow:hidden;
        }
        .ms-subj-card:hover { box-shadow:0 10px 30px rgba(30,64,175,.1);transform:translateY(-3px);border-color:#BFDBFE; }
        .ms-subj-card-top   { display:flex;align-items:flex-start;justify-content:space-between; }
        .ms-subj-icon-box   { width:48px;height:48px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
        .ms-subj-tag        { font-size:.65rem;font-weight:700;letter-spacing:.5px;padding:3px 9px;border-radius:100px;border:1px solid #E2E8F0;color:#64748B;background:#F8FAFC; }
        .ms-subj-name       { font-size:1.1rem;font-weight:800;color:#0F172A;margin:0; }
        .ms-subj-desc       { font-size:.78rem;color:#64748B;line-height:1.55;margin:0;flex:1; }
        .ms-prog-row        { display:flex;align-items:center;justify-content:space-between;font-size:.72rem;color:#94A3B8;font-weight:600; }
        .ms-prog-bar        { height:3px;background:#F1F5F9;border-radius:100px;overflow:hidden;margin:2px 0 0; }
        .ms-prog-fill       { height:100%;background:#2563EB;border-radius:100px;transition:width .5s ease; }
        .ms-continue-btn    { width:100%;background:#2563EB;color:#fff;font-weight:700;font-size:.82rem;padding:10px;border:none;border-radius:9px;cursor:pointer;font-family:'DM Sans',sans-serif;transition:background .15s; }
        .ms-continue-btn:hover { background:#1D4ED8; }

        .ms-math-card {
          background:linear-gradient(120deg,#0F172A 0%,#1E3A5F 80%,#1E293B 100%);
          border-radius:14px;padding:24px 22px;cursor:pointer;margin-bottom:16px;
          transition:box-shadow .2s ease,transform .2s ease;
        }
        .ms-math-card:hover { box-shadow:0 14px 40px rgba(30,64,175,.22);transform:translateY(-2px); }
        .ms-math-top  { display:flex;align-items:center;gap:14px;margin-bottom:14px; }
        .ms-math-icon { width:56px;height:56px;background:#2563EB;border-radius:12px;display:flex;align-items:center;justify-content:center;color:#fff;flex-shrink:0; }
        .ms-math-name { font-size:1.25rem;font-weight:800;color:#fff;margin:0 0 4px; }
        .ms-math-desc { font-size:.78rem;color:rgba(255,255,255,.6);margin:0;line-height:1.55; }
        .ms-units-grid { display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:18px; }
        .ms-unit-box  { background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:10px 12px; }
        .ms-unit-lbl  { font-size:.62rem;color:rgba(255,255,255,.45);font-weight:600;margin:0 0 2px; }
        .ms-unit-name { font-size:.82rem;color:#fff;font-weight:700;margin:0; }
        .ms-math-footer { display:flex;align-items:center;justify-content:space-between;gap:16px; }
        .ms-math-prog-wrap { flex:1; }
        .ms-math-prog-row  { display:flex;justify-content:space-between;font-size:.72rem;color:rgba(255,255,255,.45);margin-bottom:4px; }
        .ms-math-prog-bar  { height:3px;background:rgba(255,255,255,.12);border-radius:100px;overflow:hidden; }
        .ms-math-prog-fill { height:100%;background:#22C55E;border-radius:100px;transition:width .5s ease; }
        .ms-start-btn  { background:#fff;color:#2563EB;font-weight:800;font-size:.88rem;padding:11px 22px;border:none;border-radius:9px;cursor:pointer;font-family:'DM Sans',sans-serif;white-space:nowrap;transition:background .15s; }
        .ms-start-btn:hover { background:#F0F4FF; }

        .ms-sidebar { display:flex;flex-direction:column;gap:18px; }

        .ms-analytics { background:#fff;border:1px solid #E5E9F0;border-radius:16px;padding:22px 20px;animation:msFadeUp .55s ease both; }
        .ms-an-hd     { display:flex;align-items:center;gap:8px;margin-bottom:18px; }
        .ms-an-title  { font-size:1.05rem;font-weight:800;color:#0F172A;margin:0; }
        .ms-an-prog-box { background:#F8FAFC;border:1px solid #E5E9F0;border-radius:12px;padding:14px 16px;display:flex;align-items:center;gap:14px;margin-bottom:18px; }
        .ms-an-pct        { font-size:1.3rem;font-weight:800;color:#0F172A;min-width:46px;text-align:center; }
        .ms-an-prog-title { font-size:.88rem;font-weight:700;color:#0F172A;margin:0 0 2px; }
        .ms-an-prog-sub   { font-size:.72rem;color:#94A3B8;margin:0;font-style:italic; }
        .ms-an-row  { display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-top:1px solid #F1F5F9;font-size:.82rem; }
        .ms-an-lbl  { color:#64748B; }
        .ms-an-val  { font-weight:700;color:#0F172A; }
        .ms-an-empty { background:#F8FAFC;border-radius:10px;padding:16px;text-align:center;font-size:.78rem;color:#94A3B8;line-height:1.5;margin-top:6px; }

        .ms-schedule { background:#fff;border:1px solid #E5E9F0;border-radius:16px;padding:20px;animation:msFadeUp .6s ease both; }
        .ms-sch-hd   { display:flex;align-items:center;justify-content:space-between;margin-bottom:14px; }
        .ms-sch-title { display:flex;align-items:center;gap:8px;font-size:1rem;font-weight:800;color:#0F172A;margin:0; }
        .ms-sch-full  { font-size:.78rem;font-weight:700;color:#2563EB;text-decoration:none;transition:opacity .15s; }
        .ms-sch-full:hover { opacity:.7; }
        .ms-sch-row  { display:flex;align-items:center;gap:0;border:1px solid #F1F5F9;border-radius:10px;overflow:hidden;margin-bottom:8px; }
        .ms-sch-row.active { border-color:#BFDBFE;background:#F0F6FF; }
        .ms-sch-day  { width:52px;text-align:center;padding:12px 0;font-size:.78rem;font-weight:700;color:#64748B;border-right:1px solid #F1F5F9;flex-shrink:0; }
        .ms-sch-row.active .ms-sch-day { color:#2563EB; }
        .ms-sch-info  { flex:1;padding:10px 12px; }
        .ms-sch-time  { font-size:.68rem;color:#94A3B8;margin:0 0 2px; }
        .ms-sch-topic { font-size:.82rem;font-weight:700;color:#0F172A;margin:0; }
        .ms-sch-play  { padding:0 12px;color:#2563EB; }

        .ms-lab-card { border-radius:16px;overflow:hidden;position:relative;height:220px;cursor:pointer;animation:msFadeUp .65s ease both; }
        .ms-lab-card img { position:absolute;inset:0;width:100%;height:100%;object-fit:cover; }
        .ms-lab-overlay { position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.78) 0%,rgba(0,0,0,.15) 55%); }
        .ms-lab-content { position:absolute;bottom:0;left:0;right:0;padding:18px 20px;z-index:1; }
        .ms-lab-tag   { display:inline-block;background:#10B981;color:#fff;font-size:.62rem;font-weight:800;letter-spacing:.5px;padding:4px 10px;border-radius:100px;margin-bottom:8px; }
        .ms-lab-title { font-size:1.1rem;font-weight:800;color:#fff;margin:0 0 4px;line-height:1.25; }
        .ms-lab-sub   { font-size:.74rem;color:rgba(255,255,255,.75);margin:0; }

        .ms-bc  { display:flex;align-items:center;gap:5px;font-size:.76rem;color:#94A3B8;margin-bottom:20px;animation:msFadeUp .38s ease both;flex-wrap:wrap; }
        .ms-bc a { color:#94A3B8;text-decoration:none;font-weight:600;transition:color .14s; }
        .ms-bc a:hover { color:#2563EB; }
        .ms-bc-cur { color:#475569;font-weight:700; }

        @media(max-width:1024px) {
          .ms-layout { grid-template-columns:1fr; }
          .ms-sidebar { flex-direction:row;flex-wrap:wrap; }
          .ms-analytics,.ms-schedule { flex:1;min-width:280px; }
          .ms-lab-card { flex:1;min-width:280px; }
        }
        @media(max-width:640px) {
          .ms-subj-grid  { grid-template-columns:1fr; }
          .ms-units-grid { grid-template-columns:repeat(2,1fr); }
          .ms-math-footer { flex-direction:column;align-items:stretch; }
          .ms-start-btn   { width:100%; }
          .ms-sidebar     { flex-direction:column; }
        }
      `}),s.jsxs("div",{className:"ms-wrap",children:[s.jsxs("nav",{className:"ms-bc",children:[s.jsx(H,{to:"/",children:i?"ہوم":"Home"}),s.jsx($,{size:12,style:{transform:i?"rotate(180deg)":"none"}}),s.jsx(H,{to:"/grade-view/6-8",children:i?"جماعت ۶-۸":"Grade 6-8"}),s.jsx($,{size:12,style:{transform:i?"rotate(180deg)":"none"}}),s.jsx("span",{className:"ms-bc-cur",children:M})]}),s.jsxs("div",{className:"ms-hero",children:[s.jsx("h1",{className:"ms-hero-title",children:i?y.title.ur:y.title.en}),s.jsx("p",{className:"ms-hero-sub",children:i?y.sub.ur:y.sub.en})]}),s.jsxs("div",{className:"ms-qr-bar",children:[s.jsxs("span",{className:"ms-qr-label",children:[s.jsx(as,{size:13})," ",i?"فوری وسائل":"QUICK RESOURCES"]}),s.jsx("div",{className:"ms-qr-div"}),s.jsxs("button",{className:"ms-qr-btn-solid",onClick:()=>o("/worksheets/0"),children:[s.jsx(rs,{size:14})," ",i?"ورک شیٹس":"Worksheets"]}),s.jsxs("button",{className:"ms-qr-btn-outline",onClick:()=>o(`/${n}/quiz`),children:[s.jsx(ns,{size:14})," ",i?"باب کے کوئز":"Chapter Quizzes"]}),s.jsxs("button",{className:"ms-qr-btn-outline",onClick:()=>o("/games/6-8"),children:[s.jsx(ts,{size:14})," ",i?"کھیل":"Games"]})]}),s.jsxs("div",{className:"ms-layout",children:[s.jsxs("div",{children:[s.jsxs("div",{className:"ms-sec-hd",children:[s.jsx(os,{size:20,className:"ms-sec-hd-icon",color:"#2563EB"}),s.jsx("h2",{className:"ms-sec-title",children:i?"بنیادی مضامین":"Core Subjects"})]}),A&&s.jsxs(s.Fragment,{children:[s.jsxs("div",{className:"ms-subj-grid",children:[s.jsx(C,{}),s.jsx(C,{})]}),s.jsx("div",{style:{background:"#1E3A5F",borderRadius:14,height:220,animation:"msPulse 1.4s ease-in-out infinite",marginBottom:16}}),s.jsxs("div",{className:"ms-subj-grid",children:[s.jsx(C,{}),s.jsx(C,{})]})]}),!A&&(!t||t.length===0)&&s.jsx("div",{style:{background:"#fff",borderRadius:14,border:"2px dashed #E2E8F0",padding:"48px 20px",textAlign:"center",color:"#94A3B8",fontSize:".88rem"},children:i?"فی الحال کوئی مضمون دستیاب نہیں":"No subjects available right now"}),!A&&t&&t.length>0&&s.jsxs(s.Fragment,{children:[L.length>0&&s.jsx("div",{className:"ms-subj-grid",children:L.map(q)}),P(),R.length>0&&s.jsx("div",{className:"ms-subj-grid",children:R.map(q)}),S.length===0&&c&&P()]})]}),s.jsxs("aside",{className:"ms-sidebar",children:[s.jsxs("div",{className:"ms-analytics",children:[s.jsxs("div",{className:"ms-an-hd",children:[s.jsx(ls,{size:20,color:"#2563EB"}),s.jsx("h3",{className:"ms-an-title",children:i?"مطالعہ تجزیات":"Study Analytics"})]}),s.jsxs("div",{className:"ms-an-prog-box",children:[s.jsxs("div",{className:"ms-an-pct",children:[v.pct,"%"]}),s.jsxs("div",{children:[s.jsx("p",{className:"ms-an-prog-title",children:i?"مجموعی پیشرفت":"Overall Progress"}),s.jsx("p",{className:"ms-an-prog-sub",children:v.watched===0?i?"نئے دریافت کار کا سفر":"New explorer journey":i?"بہترین کام جاری رکھیں!":"Keep up the great work!"})]})]}),s.jsxs("div",{className:"ms-an-row",children:[s.jsx("span",{className:"ms-an-lbl",children:i?"مکمل اسائنمنٹس":"Assignments Done"}),s.jsxs("span",{className:"ms-an-val",children:[v.watched," / ",v.total]})]}),s.jsxs("div",{className:"ms-an-row",children:[s.jsx("span",{className:"ms-an-lbl",children:i?"ٹیسٹ اسکور اوسط":"Test Score Avg."}),s.jsx("span",{className:"ms-an-val",children:"--"})]}),s.jsxs("div",{className:"ms-an-row",children:[s.jsx("span",{className:"ms-an-lbl",children:i?"گھنٹے لاگ کیے":"Hours Logged"}),s.jsx("span",{className:"ms-an-val",children:"0h"})]}),v.watched===0&&s.jsx("div",{className:"ms-an-empty",children:i?"ابھی تک کوئی ڈیٹا نہیں۔ بصیرت دیکھنے کے لیے پہلا سبق شروع کریں!":"No data to display yet. Start your first lesson to see insights!"})]}),s.jsxs("div",{className:"ms-schedule",children:[s.jsxs("div",{className:"ms-sch-hd",children:[s.jsxs("h3",{className:"ms-sch-title",children:[s.jsx(cs,{size:18,color:"#2563EB"}),i?"ہفتہ وار شیڈول":"Weekly Schedule"]}),s.jsx("a",{href:"#",className:"ms-sch-full",children:i?"مکمل دیکھیں":"Full View"})]}),Fs.map((e,r)=>s.jsxs("div",{className:`ms-sch-row${e.active?" active":""}`,children:[s.jsx("div",{className:"ms-sch-day",children:i?e.day.ur:e.day.en}),s.jsxs("div",{className:"ms-sch-info",children:[s.jsx("p",{className:"ms-sch-time",children:e.time}),s.jsx("p",{className:"ms-sch-topic",children:i?e.topic.ur:e.topic.en})]}),e.active&&s.jsx("div",{className:"ms-sch-play",children:s.jsx(ds,{size:16,fill:"#2563EB",stroke:"none"})})]},r))]}),s.jsxs("div",{className:"ms-lab-card",onClick:()=>o("/resources"),children:[s.jsx("img",{src:vs,alt:"Virtual Lab Discovery"}),s.jsx("div",{className:"ms-lab-overlay"}),s.jsxs("div",{className:"ms-lab-content",children:[s.jsx("span",{className:"ms-lab-tag",children:i?"خصوصی پروجیکٹ":"Special Project"}),s.jsx("p",{className:"ms-lab-title",children:i?"ورچوئل لیب دریافت میں شامل ہوں":"Join the Virtual Lab Discovery"}),s.jsx("p",{className:"ms-lab-sub",children:i?"انٹرایکٹو 3D تجربات اس جمعہ سے۔":"Interactive 3D experiments starting this Friday."})]})]})]})]})]})]})};export{Ns as default};
