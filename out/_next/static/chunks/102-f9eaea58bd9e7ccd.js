"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[102],{9401:function(e,a,t){t.d(a,{z:function(){return b}});var r=t(7437),s=t(2549),l=t(6020),d=t(2265),n=t(9314),i=t(3023),o=t(6110),c=t(1908),m=t(6694),f=t(9311);let u=d.forwardRef((e,a)=>{let{className:t,...s}=e;return(0,r.jsx)(m.fC,{ref:a,className:(0,f.cn)("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",t),...s})});u.displayName=m.fC.displayName;let p=d.forwardRef((e,a)=>{let{className:t,...s}=e;return(0,r.jsx)(m.Ee,{ref:a,className:(0,f.cn)("aspect-square h-full w-full",t),...s})});p.displayName=m.Ee.displayName;let x=d.forwardRef((e,a)=>{let{className:t,...s}=e;return(0,r.jsx)(m.NY,{ref:a,className:(0,f.cn)("flex h-full w-full items-center justify-center rounded-full bg-muted",t),...s})});x.displayName=m.NY.displayName;var h=t(5331);let g=d.forwardRef((e,a)=>{let{className:t,children:s,...l}=e;return(0,r.jsxs)(h.fC,{ref:a,className:(0,f.cn)("relative overflow-hidden",t),...l,children:[(0,r.jsx)(h.l_,{className:"h-full w-full rounded-[inherit]",children:s}),(0,r.jsx)(N,{}),(0,r.jsx)(h.Ns,{})]})});g.displayName=h.fC.displayName;let N=d.forwardRef((e,a)=>{let{className:t,orientation:s="vertical",...l}=e;return(0,r.jsx)(h.gb,{ref:a,orientation:s,className:(0,f.cn)("flex touch-none select-none transition-colors","vertical"===s&&"h-full w-2.5 border-l border-l-transparent p-[1px]","horizontal"===s&&"h-2.5 flex-col border-t border-t-transparent p-[1px]",t),...l,children:(0,r.jsx)(h.q4,{className:"relative flex-1 rounded-full bg-border"})})});N.displayName=h.gb.displayName;var _=t(2621),w=t(6763);function b(e){let{specialistId:a,caregiverId:t,caregiverName:m,onClose:f}=e,[p,h]=(0,d.useState)(""),[N,b]=(0,d.useState)(!1),[j,y]=(0,d.useState)([]),[v,k]=(0,d.useState)(!0),[R,z]=(0,d.useState)(null),{toast:E}=(0,_.pm)();(0,d.useEffect)(()=>{let e=!0,r=null,s=async()=>{try{let{data:s,error:l}=await w.OQ.rpc("get_or_create_chat_room",{p_specialist_id:a,p_caregiver_id:t});if(l)throw l;r=w.OQ.channel("room:".concat(s)).on("postgres_changes",{event:"INSERT",schema:"public",table:"messages",filter:"room_id=eq.".concat(s)},e=>{let t=e.new,r={id:t.message_id,room_id:t.room_id,sender_id:t.sender_id,content:t.content,created_at:t.created_at,updated_at:t.updated_at,edited:t.edited,deleted:t.deleted,read:t.read};r.sender_id!==a&&y(e=>[...e,r])}).subscribe(),z(r);let{data:d,error:n}=await w.OQ.rpc("chat_get_messages",{p_room_id:s});if(n)throw n;if(e){let e=(d||[]).map(e=>({id:e.message_id,room_id:e.room_id,sender_id:e.sender_id,content:e.content,created_at:e.created_at,updated_at:e.updated_at,edited:e.edited,deleted:e.deleted,read:e.read}));y(e),k(!1)}await w.OQ.rpc("chat_mark_messages_read",{p_room_id:s})}catch(a){console.error("Error loading messages:",a),e&&(E({variant:"destructive",title:"Error",description:"Failed to load messages"}),k(!1))}};return s(),()=>{e=!1,r&&r.unsubscribe()}},[a,t,E]);let C=async()=>{if(p.trim()){b(!0);try{let{data:e,error:r}=await w.OQ.rpc("get_or_create_chat_room",{p_specialist_id:a,p_caregiver_id:t});if(r)throw r;let{data:s,error:l}=await w.OQ.rpc("chat_save_message",{p_room_id:e,p_content:p.trim()});if(l)throw l;let d={id:s,room_id:e,sender_id:a,content:p.trim(),created_at:new Date().toISOString(),updated_at:new Date().toISOString(),edited:!1,deleted:!1,read:!1};y(e=>[...e,d]),h("")}catch(e){console.error("Error sending message:",e),E({variant:"destructive",title:"Error",description:"Failed to send message. Please try again."})}finally{b(!1)}}};return(0,r.jsx)("div",{className:"fixed inset-0 bg-background/80 backdrop-blur-sm z-50",children:(0,r.jsx)("div",{className:"fixed inset-4 bg-background rounded-lg shadow-lg border flex flex-col",children:(0,r.jsxs)(o.Zb,{className:"flex-1 flex flex-col relative",children:[(0,r.jsxs)(o.Ol,{className:"flex flex-row items-center justify-between pb-4 border-b",children:[(0,r.jsxs)("div",{className:"flex items-center gap-3",children:[(0,r.jsx)(u,{className:"h-10 w-10 border-2 border-primary",children:(0,r.jsx)(x,{children:m[0]})}),(0,r.jsx)(o.ll,{className:"text-lg",children:m})]}),(0,r.jsx)(i.z,{variant:"ghost",size:"icon",onClick:f,children:(0,r.jsx)(s.Z,{className:"h-4 w-4"})})]}),(0,r.jsxs)(o.aY,{className:"flex-1 flex flex-col",children:[(0,r.jsx)(g,{className:"flex-1 p-4",children:v?(0,r.jsx)("div",{className:"text-center",children:"Loading messages..."}):0===j.length?(0,r.jsx)("div",{className:"text-center text-muted-foreground",children:"No messages yet."}):(0,r.jsx)("div",{className:"flex flex-col gap-4",children:j.map(e=>{let t=e.sender_id===a;return(0,r.jsxs)("div",{className:"flex items-start gap-2 ".concat(t?"flex-row-reverse":""," group"),children:[(0,r.jsx)(u,{className:"h-8 w-8",children:(0,r.jsx)(x,{children:t?"ME":m[0]})}),(0,r.jsxs)("div",{className:"flex flex-col ".concat(t?"items-end":""," gap-1 max-w-[80%] relative"),children:[(0,r.jsx)("div",{className:"\n                              px-4 py-2 rounded-2xl text-sm\n                              ".concat(t?"bg-primary text-primary-foreground rounded-tr-sm":"bg-muted rounded-tl-sm","\n                              group-hover:shadow-sm transition-shadow\n                            "),children:e.content}),(0,r.jsx)("span",{className:"text-xs text-muted-foreground",children:(0,n.ZP)(new Date(e.created_at),"h:mm a")})]})]},e.id)})})}),(0,r.jsxs)("div",{className:"p-4 border-t flex items-center gap-2 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/75",children:[(0,r.jsx)(c.I,{placeholder:"Type your message...",value:p,onChange:e=>h(e.target.value),onKeyDown:e=>{"Enter"!==e.key||e.shiftKey||(e.preventDefault(),C())},disabled:N,className:"bg-background"}),(0,r.jsx)(i.z,{size:"icon",variant:"default",onClick:C,disabled:N||!p.trim(),children:(0,r.jsx)(l.Z,{className:"h-4 w-4"})})]})]})]})})})}},8094:function(e,a,t){t.d(a,{Bw:function(){return x},Ph:function(){return c},Ql:function(){return g},i4:function(){return f},ki:function(){return m}});var r=t(7437),s=t(2265),l=t(8010),d=t(3523),n=t(9224),i=t(2442),o=t(9311);let c=l.fC;l.ZA;let m=l.B4,f=s.forwardRef((e,a)=>{let{className:t,children:s,...n}=e;return(0,r.jsxs)(l.xz,{ref:a,className:(0,o.cn)("flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",t),...n,children:[s,(0,r.jsx)(l.JO,{asChild:!0,children:(0,r.jsx)(d.Z,{className:"h-4 w-4 opacity-50"})})]})});f.displayName=l.xz.displayName;let u=s.forwardRef((e,a)=>{let{className:t,...s}=e;return(0,r.jsx)(l.u_,{ref:a,className:(0,o.cn)("flex cursor-default items-center justify-center py-1",t),...s,children:(0,r.jsx)(n.Z,{className:"h-4 w-4"})})});u.displayName=l.u_.displayName;let p=s.forwardRef((e,a)=>{let{className:t,...s}=e;return(0,r.jsx)(l.$G,{ref:a,className:(0,o.cn)("flex cursor-default items-center justify-center py-1",t),...s,children:(0,r.jsx)(d.Z,{className:"h-4 w-4"})})});p.displayName=l.$G.displayName;let x=s.forwardRef((e,a)=>{let{className:t,children:s,position:d="popper",...n}=e;return(0,r.jsx)(l.h_,{children:(0,r.jsxs)(l.VY,{ref:a,className:(0,o.cn)("relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2","popper"===d&&"data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",t),position:d,...n,children:[(0,r.jsx)(u,{}),(0,r.jsx)(l.l_,{className:(0,o.cn)("p-1","popper"===d&&"h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),children:s}),(0,r.jsx)(p,{})]})})});x.displayName=l.VY.displayName;let h=s.forwardRef((e,a)=>{let{className:t,...s}=e;return(0,r.jsx)(l.__,{ref:a,className:(0,o.cn)("py-1.5 pl-8 pr-2 text-sm font-semibold",t),...s})});h.displayName=l.__.displayName;let g=s.forwardRef((e,a)=>{let{className:t,children:s,...d}=e;return(0,r.jsxs)(l.ck,{ref:a,className:(0,o.cn)("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",t),...d,children:[(0,r.jsx)("span",{className:"absolute left-2 flex h-3.5 w-3.5 items-center justify-center",children:(0,r.jsx)(l.wU,{children:(0,r.jsx)(i.Z,{className:"h-4 w-4"})})}),(0,r.jsx)(l.eT,{children:s})]})});g.displayName=l.ck.displayName;let N=s.forwardRef((e,a)=>{let{className:t,...s}=e;return(0,r.jsx)(l.Z0,{ref:a,className:(0,o.cn)("-mx-1 my-1 h-px bg-muted",t),...s})});N.displayName=l.Z0.displayName}}]);