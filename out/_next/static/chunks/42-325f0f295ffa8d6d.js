"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[42],{6042:function(e,t,a){a.d(t,{W:function(){return N}});var n=a(7437),r=a(2265),s=a(1865),i=a(8110),l=a(4578),o=a(1295),d=a(3023),c=a(2609),m=a(7516),u=a(1315),f=a(1908),x=a(2621),p=a(6763),h=a(4863);let j=l.Ry({name:l.Z_().min(2,"Name must be at least 2 characters"),email:l.Z_().email("Please enter a valid email address")});function N(){let[e,t]=(0,r.useState)(!1),[a,l]=(0,r.useState)(!1),[N,g]=(0,r.useState)(!1),[y,v]=(0,r.useState)(null),{toast:w}=(0,x.pm)(),{user:b}=(0,h.a)(),I=(0,s.cI)({resolver:(0,i.F)(j),defaultValues:{name:"",email:""}}),C=e=>{e||(I.reset(),v(null),g(!1)),t(e)},R=async(e,t)=>{let a=await fetch("".concat("https://xuqkgeusasosxtcfhbwj.supabase.co","/functions/v1/invite_caregiver"),{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer ".concat("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1cWtnZXVzYXNvc3h0Y2ZoYndqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNjMwODU5NSwiZXhwIjoyMDUxODg0NTk1fQ.mDgADwthCJGMesU6F6-ui9XfLw7DGoA06k66mGEAGKU")},body:JSON.stringify({to:t.email,name:t.name,specialist_name:null==b?void 0:b.email,invitation_id:e})});if(!a.ok){let e=await a.json();throw Error(e.message||"Failed to send invitation email")}return a.json()},k=async function(e){let n=arguments.length>1&&void 0!==arguments[1]&&arguments[1];if(!a){l(!0);try{let{data:a,error:r}=await p.OQ.rpc("invite_caregiver",{caregiver_email:e.email,caregiver_name:e.name,resend:n});if(r){if(r.message.includes("already been sent")&&!n){v(e),g(!0),l(!1);return}throw r}if(!a)throw Error("Failed to create invitation");await R(a,e),w({title:n?"Invitation Resent":"Invitation Sent",description:"Successfully ".concat(n?"resent":"sent"," invitation to ").concat(e.email)}),g(!1),v(null),I.reset(),t(!1)}catch(t){console.error("Invitation error:",t);let e="Failed to send invitation";t instanceof Error&&(e=t.message.includes("Invalid JWT")?"Authentication error. Please try again or contact support.":t.message.includes("already been sent")?"An invitation has already been sent to this email.":t.message),w({variant:"destructive",title:"Error",description:e})}finally{l(!1)}}},z=async e=>{await k(e)};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(m.aR,{open:N,onOpenChange:e=>{e||(g(!1),v(null))},children:(0,n.jsxs)(m._T,{children:[(0,n.jsxs)(m.fY,{children:[(0,n.jsx)(m.f$,{children:"Resend Invitation?"}),(0,n.jsx)(m.yT,{children:"An invitation has already been sent to this email. Would you like to resend it?"})]}),(0,n.jsxs)(m.xo,{children:[(0,n.jsx)(m.le,{children:"Cancel"}),(0,n.jsx)(m.OL,{onClick:async()=>{y&&await k(y,!0)},children:"Yes, Resend"})]})]})}),(0,n.jsxs)(c.Vq,{open:e,onOpenChange:C,children:[(0,n.jsx)(c.hg,{asChild:!0,children:(0,n.jsxs)(d.z,{children:[(0,n.jsx)(o.Z,{className:"mr-2 h-4 w-4"}),"Invite Caregiver"]})}),(0,n.jsxs)(c.cZ,{className:"sm:max-w-[425px]",children:[(0,n.jsxs)(c.fK,{children:[(0,n.jsx)("div",{className:"flex justify-between items-center",children:(0,n.jsx)(c.$N,{children:"Invite Caregiver"})}),(0,n.jsx)(c.Be,{children:"Send an invitation to a caregiver to join your practice."})]}),(0,n.jsx)(u.l0,{...I,children:(0,n.jsxs)("form",{onSubmit:I.handleSubmit(z),className:"space-y-4",children:[(0,n.jsx)(u.Wi,{control:I.control,name:"name",render:e=>{let{field:t}=e;return(0,n.jsxs)(u.xJ,{children:[(0,n.jsx)(u.lX,{children:"Caregiver's Name"}),(0,n.jsx)(u.NI,{children:(0,n.jsx)(f.I,{placeholder:"Enter name",...t})}),(0,n.jsx)(u.zG,{})]})}}),(0,n.jsx)(u.Wi,{control:I.control,name:"email",render:e=>{let{field:t}=e;return(0,n.jsxs)(u.xJ,{children:[(0,n.jsx)(u.lX,{children:"Caregiver's Email"}),(0,n.jsx)(u.NI,{children:(0,n.jsx)(f.I,{type:"email",placeholder:"Enter email",...t})}),(0,n.jsx)(u.zG,{})]})}}),(0,n.jsx)("div",{className:"bg-muted/50 rounded-lg p-4",children:(0,n.jsx)("p",{className:"text-sm text-muted-foreground",children:"An invitation email will be sent to the caregiver with instructions to create their account."})}),(0,n.jsxs)(c.cN,{children:[(0,n.jsx)(d.z,{type:"button",variant:"outline",onClick:()=>C(!1),disabled:a,children:"Cancel"}),(0,n.jsx)(d.z,{type:"submit",disabled:a,children:a?"Sending...":"Send Invitation"})]})]})})]})]})]})}},7516:function(e,t,a){a.d(t,{OL:function(){return h},_T:function(){return m},aR:function(){return o},f$:function(){return x},fY:function(){return u},le:function(){return j},xo:function(){return f},yT:function(){return p}});var n=a(7437),r=a(2265),s=a(2506),i=a(9311),l=a(3023);let o=s.fC;s.xz;let d=s.h_,c=r.forwardRef((e,t)=>{let{className:a,...r}=e;return(0,n.jsx)(s.aV,{className:(0,i.cn)("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",a),...r,ref:t})});c.displayName=s.aV.displayName;let m=r.forwardRef((e,t)=>{let{className:a,...r}=e;return(0,n.jsxs)(d,{children:[(0,n.jsx)(c,{}),(0,n.jsx)(s.VY,{ref:t,className:(0,i.cn)("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",a),...r})]})});m.displayName=s.VY.displayName;let u=e=>{let{className:t,...a}=e;return(0,n.jsx)("div",{className:(0,i.cn)("flex flex-col space-y-2 text-center sm:text-left",t),...a})};u.displayName="AlertDialogHeader";let f=e=>{let{className:t,...a}=e;return(0,n.jsx)("div",{className:(0,i.cn)("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",t),...a})};f.displayName="AlertDialogFooter";let x=r.forwardRef((e,t)=>{let{className:a,...r}=e;return(0,n.jsx)(s.Dx,{ref:t,className:(0,i.cn)("text-lg font-semibold",a),...r})});x.displayName=s.Dx.displayName;let p=r.forwardRef((e,t)=>{let{className:a,...r}=e;return(0,n.jsx)(s.dk,{ref:t,className:(0,i.cn)("text-sm text-muted-foreground",a),...r})});p.displayName=s.dk.displayName;let h=r.forwardRef((e,t)=>{let{className:a,...r}=e;return(0,n.jsx)(s.aU,{ref:t,className:(0,i.cn)((0,l.d)(),a),...r})});h.displayName=s.aU.displayName;let j=r.forwardRef((e,t)=>{let{className:a,...r}=e;return(0,n.jsx)(s.$j,{ref:t,className:(0,i.cn)((0,l.d)({variant:"outline"}),"mt-2 sm:mt-0",a),...r})});j.displayName=s.$j.displayName},2609:function(e,t,a){a.d(t,{$N:function(){return p},Be:function(){return h},Vq:function(){return o},cN:function(){return x},cZ:function(){return u},fK:function(){return f},hg:function(){return d}});var n=a(7437),r=a(2265),s=a(8712),i=a(2549),l=a(9311);let o=s.fC,d=s.xz,c=s.h_;s.x8;let m=r.forwardRef((e,t)=>{let{className:a,...r}=e;return(0,n.jsx)(s.aV,{ref:t,className:(0,l.cn)("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",a),...r})});m.displayName=s.aV.displayName;let u=r.forwardRef((e,t)=>{let{className:a,children:r,...o}=e;return(0,n.jsxs)(c,{children:[(0,n.jsx)(m,{}),(0,n.jsxs)(s.VY,{ref:t,className:(0,l.cn)("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",a),...o,children:[r,(0,n.jsxs)(s.x8,{className:"absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",children:[(0,n.jsx)(i.Z,{className:"h-4 w-4"}),(0,n.jsx)("span",{className:"sr-only",children:"Close"})]})]})]})});u.displayName=s.VY.displayName;let f=e=>{let{className:t,...a}=e;return(0,n.jsx)("div",{className:(0,l.cn)("flex flex-col space-y-1.5 text-center sm:text-left",t),...a})};f.displayName="DialogHeader";let x=e=>{let{className:t,...a}=e;return(0,n.jsx)("div",{className:(0,l.cn)("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",t),...a})};x.displayName="DialogFooter";let p=r.forwardRef((e,t)=>{let{className:a,...r}=e;return(0,n.jsx)(s.Dx,{ref:t,className:(0,l.cn)("text-lg font-semibold leading-none tracking-tight",a),...r})});p.displayName=s.Dx.displayName;let h=r.forwardRef((e,t)=>{let{className:a,...r}=e;return(0,n.jsx)(s.dk,{ref:t,className:(0,l.cn)("text-sm text-muted-foreground",a),...r})});h.displayName=s.dk.displayName},1315:function(e,t,a){a.d(t,{NI:function(){return h},Wi:function(){return m},l0:function(){return d},lX:function(){return p},pf:function(){return j},xJ:function(){return x},zG:function(){return N}});var n=a(7437),r=a(2265),s=a(7256),i=a(1865),l=a(9311),o=a(6672);let d=i.RV,c=r.createContext({}),m=e=>{let{...t}=e;return(0,n.jsx)(c.Provider,{value:{name:t.name},children:(0,n.jsx)(i.Qr,{...t})})},u=()=>{let e=r.useContext(c),t=r.useContext(f),{getFieldState:a,formState:n}=(0,i.Gc)(),s=a(e.name,n);if(!e)throw Error("useFormField should be used within <FormField>");let{id:l}=t;return{id:l,name:e.name,formItemId:"".concat(l,"-form-item"),formDescriptionId:"".concat(l,"-form-item-description"),formMessageId:"".concat(l,"-form-item-message"),...s}},f=r.createContext({}),x=r.forwardRef((e,t)=>{let{className:a,...s}=e,i=r.useId();return(0,n.jsx)(f.Provider,{value:{id:i},children:(0,n.jsx)("div",{ref:t,className:(0,l.cn)("space-y-2",a),...s})})});x.displayName="FormItem";let p=r.forwardRef((e,t)=>{let{className:a,...r}=e,{error:s,formItemId:i}=u();return(0,n.jsx)(o._,{ref:t,className:(0,l.cn)(s&&"text-destructive",a),htmlFor:i,...r})});p.displayName="FormLabel";let h=r.forwardRef((e,t)=>{let{...a}=e,{error:r,formItemId:i,formDescriptionId:l,formMessageId:o}=u();return(0,n.jsx)(s.g7,{ref:t,id:i,"aria-describedby":r?"".concat(l," ").concat(o):"".concat(l),"aria-invalid":!!r,...a})});h.displayName="FormControl";let j=r.forwardRef((e,t)=>{let{className:a,...r}=e,{formDescriptionId:s}=u();return(0,n.jsx)("p",{ref:t,id:s,className:(0,l.cn)("text-sm text-muted-foreground",a),...r})});j.displayName="FormDescription";let N=r.forwardRef((e,t)=>{let{className:a,children:r,...s}=e,{error:i,formMessageId:o}=u(),d=i?String(null==i?void 0:i.message):r;return d?(0,n.jsx)("p",{ref:t,id:o,className:(0,l.cn)("text-sm font-medium text-destructive",a),...s,children:d}):null});N.displayName="FormMessage"},6672:function(e,t,a){a.d(t,{_:function(){return d}});var n=a(7437),r=a(2265),s=a(6743),i=a(6061),l=a(9311);let o=(0,i.j)("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"),d=r.forwardRef((e,t)=>{let{className:a,...r}=e;return(0,n.jsx)(s.f,{ref:t,className:(0,l.cn)(o(),a),...r})});d.displayName=s.f.displayName}}]);