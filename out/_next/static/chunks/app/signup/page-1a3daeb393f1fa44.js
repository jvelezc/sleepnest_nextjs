(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[966],{3067:function(e,t,r){"use strict";r.d(t,{Z:function(){return n}});var i=r(5531);/**
 * @license lucide-react v0.446.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let n=(0,i.Z)("ArrowLeft",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]])},3715:function(e,t,r){"use strict";r.d(t,{Z:function(){return n}});var i=r(5531);/**
 * @license lucide-react v0.446.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let n=(0,i.Z)("LoaderCircle",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]])},3206:function(e,t,r){Promise.resolve().then(r.bind(r,7569))},7569:function(e,t,r){"use strict";r.r(t),r.d(t,{default:function(){return j}});var i=r(7437),n=r(2265),s=r(4033),a=r(7430),o=r(8110),c=r(1865),l=r(4578),d=r(3715),u=r(3067),f=r(5531);/**
 * @license lucide-react v0.446.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let m=(0,f.Z)("Baby",[["path",{d:"M9 12h.01",key:"157uk2"}],["path",{d:"M15 12h.01",key:"1k8ypt"}],["path",{d:"M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5",key:"1u7htd"}],["path",{d:"M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1",key:"5yv0yz"}]]);var p=r(3023),h=r(459),x=r(1908),v=r(2621),g=r(6763),w=r(9311),I=r(4566);let y=(0,I.eI)("https://xuqkgeusasosxtcfhbwj.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1cWtnZXVzYXNvc3h0Y2ZoYndqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNjMwODU5NSwiZXhwIjoyMDUxODg0NTk1fQ.mDgADwthCJGMesU6F6-ui9XfLw7DGoA06k66mGEAGKU",{auth:{autoRefreshToken:!0,persistSession:!1},db:{schema:"public"}}),b=l.Ry({name:l.Z_().min(2,"Name must be at least 2 characters"),email:l.Z_().email("Please enter a valid email address"),password:l.Z_().min(8,"Password must be at least 8 characters").regex(/[A-Z]/,"Password must contain at least one uppercase letter").regex(/[a-z]/,"Password must contain at least one lowercase letter").regex(/[0-9]/,"Password must contain at least one number"),confirmPassword:l.Z_()}).refine(e=>e.password===e.confirmPassword,{message:"Passwords don't match",path:["confirmPassword"]});function j(){let e=(0,s.useRouter)(),t=(0,s.useSearchParams)(),{toast:r}=(0,v.pm)(),[l,f]=(0,n.useState)(!1),[I,j]=(0,n.useState)(!0),[N,S]=(0,n.useState)(null),[E,A]=(0,n.useState)(null),[C,k]=(0,n.useState)(""),_=t.get("invitation_id"),O=_&&(0,w.z)(_)?_:null,T=t.get("email");(0,n.useEffect)(()=>{k(window.location.href)},[]),(0,n.useEffect)(()=>(w.f.info("CaregiverSignupPage mounted",{invitationId:O,invitedEmail:T,url:C,searchParams:Object.fromEntries(t.entries())}),()=>{w.f.info("CaregiverSignupPage unmounted")}),[O,T,C,t]),w.f.info("URL parameters:",{rawInvitationId:_,invitationId:O,invitedEmail:T,url:C,searchParams:Object.fromEntries(t.entries())});let z=(0,c.cI)({resolver:(0,o.F)(b),defaultValues:{name:"",email:T?decodeURIComponent(T):"",password:"",confirmPassword:""}});(0,n.useEffect)(()=>{!async function(){if(w.f.info("Starting invitation validation",{invitationId:O,invitedEmail:T}),!O||!T){w.f.warn("Missing invitation parameters",{invitationId:O,invitedEmail:T}),S("Invalid invitation format"),j(!1);return}try{var e,t;w.f.info("Validating invitation:",{invitationId:O,invitedEmail:T}),w.f.info("Invitation query details:",{invitationId:O,invitedEmail:T,decodedEmail:decodeURIComponent(T),isValidUUID:(0,w.z)(O)});let{data:r,error:i}=await y.from("caregiver_invitations").select("\n            id,\n            email,\n            name,\n            status,\n            expires_at,\n            specialists (\n              name,\n              business_name\n            )\n          ").eq("id",O).eq("email",T).single();if(w.f.info("Query result:",{hasData:!!r,data:r,error:i}),i)throw w.f.error("Invitation query failed",{error:i,invitationId:O,status:i.code,message:i.message,details:i.details}),Error("Invitation not found");if(r.email!==decodeURIComponent(T))throw w.f.warn("Email mismatch in invitation",{invitationEmail:r.email,providedEmail:decodeURIComponent(T)}),Error("Invalid invitation email");w.f.info("Raw invitation data received:",r);let n={...r,specialists:Array.isArray(r.specialists)?r.specialists[0]:r.specialists};if("accepted"===n.status)throw w.f.warn("Attempt to use already accepted invitation",{invitationId:O,status:n.status}),Error("This invitation has already been used");if(n.expires_at&&new Date(n.expires_at)<new Date)throw w.f.warn("Attempt to use expired invitation",{invitationId:O,expiresAt:n.expires_at}),Error("This invitation has expired");w.f.info("Invitation is valid:",n),A((null===(e=n.specialists)||void 0===e?void 0:e.business_name)||(null===(t=n.specialists)||void 0===t?void 0:t.name)||null),n.name&&z.setValue("name",n.name),j(!1)}catch(e){w.f.error("Invitation validation failed",{error:e,invitationId:O,invitedEmail:T}),S(e instanceof Error?e.message:"Invalid invitation"),j(!1)}}()},[O,T,z]);let Z=async t=>{if(w.f.info("Starting form submission",{email:t.email,name:t.name,invitationId:O}),!O){w.f.error("Missing invitationId during form submission"),r({variant:"destructive",title:"Error",description:"Invalid invitation"});return}f(!0);try{let{data:i,error:n}=await g.OQ.rpc("check_user_exists",{p_email:t.email});if(n)throw w.f.error("User lookup failed",{error:n}),n;if(i)throw w.f.info("User already exists"),Error("An account with this email already exists");w.f.info("Creating new auth account");let{data:s,error:a}=await g.OQ.auth.signUp({email:t.email,password:t.password,options:{data:{name:t.name,role:"caregiver"}}});if(a)throw w.f.error("Auth signup failed",{error:a}),a;if(!s.user)throw w.f.error("Auth signup returned no user"),Error("Failed to create account");w.f.info("Calling handle_caregiver_signup RPC",{userId:s.user.id,invitationId:O});let{error:o}=await g.OQ.rpc("handle_caregiver_signup",{p_user_id:s.user.id,p_invitation_id:O});if(o)throw w.f.error("RPC call failed",{error:o}),o;w.f.info("Signup process completed successfully"),r({title:"Account created",description:"Your caregiver account has been created successfully. Please check your email to verify your account."}),e.push("/login/caregiver")}catch(e){w.f.error("Signup process failed",{error:e,email:t.email,invitationId:O}),r({variant:"destructive",title:"Error",description:e instanceof Error?e.message:"Failed to create account"})}finally{f(!1)}};return I?(0,i.jsx)("div",{className:"min-h-screen bg-background flex items-center justify-center",children:(0,i.jsxs)("div",{className:"flex flex-col items-center gap-4",children:[(0,i.jsx)(d.Z,{className:"h-8 w-8 animate-spin text-primary"}),(0,i.jsx)("p",{className:"text-muted-foreground",children:"Validating your invitation..."})]})}):N?(0,i.jsx)("div",{className:"min-h-screen bg-background flex items-center justify-center",children:(0,i.jsx)("div",{className:"max-w-md w-full px-4",children:(0,i.jsxs)(a.E.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.3},className:"bg-card rounded-lg shadow-lg p-6 text-center",children:[(0,i.jsx)("h1",{className:"text-2xl font-bold text-destructive mb-4",children:"Invalid Invitation"}),(0,i.jsx)("p",{className:"text-muted-foreground mb-6",children:N}),(0,i.jsx)(p.z,{onClick:()=>e.push("/"),children:"Return Home"})]})})}):(0,i.jsx)("div",{className:"min-h-screen bg-background",children:(0,i.jsx)("div",{className:"max-w-md mx-auto pt-16 px-4",children:(0,i.jsxs)(a.E.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.3},className:"w-full overflow-hidden rounded-xl shadow-xl p-6 bg-card",children:[(0,i.jsxs)("div",{className:"mb-8",children:[(0,i.jsxs)(p.z,{variant:"ghost",onClick:()=>e.push("/"),className:"inline-flex items-center text-sm mb-6 text-muted-foreground hover:text-foreground",children:[(0,i.jsx)(u.Z,{className:"mr-2 h-4 w-4"}),"Back to Home"]}),(0,i.jsxs)("div",{className:"text-center",children:[(0,i.jsx)("div",{className:"inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4",children:(0,i.jsx)(m,{className:"h-6 w-6 text-primary"})}),(0,i.jsx)("h1",{className:"text-2xl font-bold text-foreground",children:"Create Your Caregiver Account"}),E&&(0,i.jsxs)("p",{className:"mt-2 text-muted-foreground",children:["Join ",E,"'s sleep consultation practice"]})]})]}),(0,i.jsx)(h.l0,{...z,children:(0,i.jsxs)("form",{onSubmit:z.handleSubmit(Z),className:"space-y-6",children:[(0,i.jsx)(h.Wi,{control:z.control,name:"name",render:e=>{let{field:t}=e;return(0,i.jsxs)(h.xJ,{children:[(0,i.jsx)(h.lX,{children:"Full Name"}),(0,i.jsx)(h.NI,{children:(0,i.jsx)(x.I,{placeholder:"Enter your name",...t})}),(0,i.jsx)(h.pf,{children:"This is how you'll appear to your sleep specialist"}),(0,i.jsx)(h.zG,{})]})}}),(0,i.jsx)(h.Wi,{control:z.control,name:"email",render:e=>{let{field:t}=e;return(0,i.jsxs)(h.xJ,{children:[(0,i.jsx)(h.lX,{children:"Email"}),(0,i.jsx)(h.NI,{children:(0,i.jsx)(x.I,{type:"email",placeholder:"Enter your email",disabled:!0,...t})}),(0,i.jsx)(h.pf,{children:"This is the email where you received the invitation"}),(0,i.jsx)(h.zG,{})]})}}),(0,i.jsx)(h.Wi,{control:z.control,name:"password",render:e=>{let{field:t}=e;return(0,i.jsxs)(h.xJ,{children:[(0,i.jsx)(h.lX,{children:"Password"}),(0,i.jsx)(h.NI,{children:(0,i.jsx)(x.I,{type:"password",placeholder:"Create a password",...t})}),(0,i.jsx)(h.pf,{children:"Must be at least 8 characters with uppercase, lowercase, and numbers"}),(0,i.jsx)(h.zG,{})]})}}),(0,i.jsx)(h.Wi,{control:z.control,name:"confirmPassword",render:e=>{let{field:t}=e;return(0,i.jsxs)(h.xJ,{children:[(0,i.jsx)(h.lX,{children:"Confirm Password"}),(0,i.jsx)(h.NI,{children:(0,i.jsx)(x.I,{type:"password",placeholder:"Confirm your password",...t})}),(0,i.jsx)(h.zG,{})]})}}),(0,i.jsx)(p.z,{type:"submit",className:"w-full",disabled:l,children:l?(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(d.Z,{className:"mr-2 h-4 w-4 animate-spin"}),"Creating Account..."]}):"Create Caregiver Account"})]})})]})})})}},3023:function(e,t,r){"use strict";r.d(t,{d:function(){return c},z:function(){return l}});var i=r(7437),n=r(2265),s=r(7256),a=r(9213),o=r(9311);let c=(0,a.j)("inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",{variants:{variant:{default:"bg-primary text-primary-foreground hover:bg-primary/90",destructive:"bg-destructive text-destructive-foreground hover:bg-destructive/90",outline:"border border-input bg-background hover:bg-accent hover:text-accent-foreground",secondary:"bg-secondary text-secondary-foreground hover:bg-secondary/80",ghost:"hover:bg-accent hover:text-accent-foreground",link:"text-primary underline-offset-4 hover:underline"},size:{default:"h-10 px-4 py-2",sm:"h-9 rounded-md px-3",lg:"h-11 rounded-md px-8",icon:"h-10 w-10"}},defaultVariants:{variant:"default",size:"default"}}),l=n.forwardRef((e,t)=>{let{className:r,variant:n,size:a,asChild:l=!1,...d}=e,u=l?s.g7:"button";return(0,i.jsx)(u,{className:(0,o.cn)(c({variant:n,size:a,className:r})),ref:t,...d})});l.displayName="Button"},459:function(e,t,r){"use strict";r.d(t,{l0:function(){return f},NI:function(){return w},pf:function(){return I},Wi:function(){return p},xJ:function(){return v},lX:function(){return g},zG:function(){return y}});var i=r(7437),n=r(2265),s=r(7256),a=r(1865),o=r(9311),c=r(6743),l=r(9213);let d=(0,l.j)("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"),u=n.forwardRef((e,t)=>{let{className:r,...n}=e;return(0,i.jsx)(c.f,{ref:t,className:(0,o.cn)(d(),r),...n})});u.displayName=c.f.displayName;let f=a.RV,m=n.createContext({}),p=e=>{let{...t}=e;return(0,i.jsx)(m.Provider,{value:{name:t.name},children:(0,i.jsx)(a.Qr,{...t})})},h=()=>{let e=n.useContext(m),t=n.useContext(x),{getFieldState:r,formState:i}=(0,a.Gc)(),s=r(e.name,i);if(!e)throw Error("useFormField should be used within <FormField>");let{id:o}=t;return{id:o,name:e.name,formItemId:"".concat(o,"-form-item"),formDescriptionId:"".concat(o,"-form-item-description"),formMessageId:"".concat(o,"-form-item-message"),...s}},x=n.createContext({}),v=n.forwardRef((e,t)=>{let{className:r,...s}=e,a=n.useId();return(0,i.jsx)(x.Provider,{value:{id:a},children:(0,i.jsx)("div",{ref:t,className:(0,o.cn)("space-y-2",r),...s})})});v.displayName="FormItem";let g=n.forwardRef((e,t)=>{let{className:r,...n}=e,{error:s,formItemId:a}=h();return(0,i.jsx)(u,{ref:t,className:(0,o.cn)(s&&"text-destructive",r),htmlFor:a,...n})});g.displayName="FormLabel";let w=n.forwardRef((e,t)=>{let{...r}=e,{error:n,formItemId:a,formDescriptionId:o,formMessageId:c}=h();return(0,i.jsx)(s.g7,{ref:t,id:a,"aria-describedby":n?"".concat(o," ").concat(c):"".concat(o),"aria-invalid":!!n,...r})});w.displayName="FormControl";let I=n.forwardRef((e,t)=>{let{className:r,...n}=e,{formDescriptionId:s}=h();return(0,i.jsx)("p",{ref:t,id:s,className:(0,o.cn)("text-sm text-muted-foreground",r),...n})});I.displayName="FormDescription";let y=n.forwardRef((e,t)=>{let{className:r,children:n,...s}=e,{error:a,formMessageId:c}=h(),l=a?String(null==a?void 0:a.message):n;return l?(0,i.jsx)("p",{ref:t,id:c,className:(0,o.cn)("text-sm font-medium text-destructive",r),...s,children:l}):null});y.displayName="FormMessage"},1908:function(e,t,r){"use strict";r.d(t,{I:function(){return a}});var i=r(7437),n=r(2265),s=r(9311);let a=n.forwardRef((e,t)=>{let{className:r,type:n,...a}=e;return(0,i.jsx)("input",{type:n,className:(0,s.cn)("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",r),ref:t,...a})});a.displayName="Input"},2621:function(e,t,r){"use strict";r.d(t,{pm:function(){return f}});var i=r(2265);let n=0,s=new Map,a=e=>{if(s.has(e))return;let t=setTimeout(()=>{s.delete(e),d({type:"REMOVE_TOAST",toastId:e})},1e6);s.set(e,t)},o=(e,t)=>{switch(t.type){case"ADD_TOAST":return{...e,toasts:[t.toast,...e.toasts].slice(0,1)};case"UPDATE_TOAST":return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case"DISMISS_TOAST":{let{toastId:r}=t;return r?a(r):e.toasts.forEach(e=>{a(e.id)}),{...e,toasts:e.toasts.map(e=>e.id===r||void 0===r?{...e,open:!1}:e)}}case"REMOVE_TOAST":if(void 0===t.toastId)return{...e,toasts:[]};return{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)}}},c=[],l={toasts:[]};function d(e){l=o(l,e),c.forEach(e=>{e(l)})}function u(e){let{...t}=e,r=(n=(n+1)%Number.MAX_SAFE_INTEGER).toString(),i=()=>d({type:"DISMISS_TOAST",toastId:r});return d({type:"ADD_TOAST",toast:{...t,id:r,open:!0,onOpenChange:e=>{e||i()}}}),{id:r,dismiss:i,update:e=>d({type:"UPDATE_TOAST",toast:{...e,id:r}})}}function f(){let[e,t]=i.useState(l);return i.useEffect(()=>(c.push(t),()=>{let e=c.indexOf(t);e>-1&&c.splice(e,1)}),[e]),{...e,toast:u,dismiss:e=>d({type:"DISMISS_TOAST",toastId:e})}}},6763:function(e,t,r){"use strict";r.d(t,{OQ:function(){return n}});var i=r(4566);let n=(0,i.eI)("https://xuqkgeusasosxtcfhbwj.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1cWtnZXVzYXNvc3h0Y2ZoYndqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYzMDg1OTUsImV4cCI6MjA1MTg4NDU5NX0.HF4gYNKUEct3xetUJ3NwB1pxgBGBSE2V6CY20iF1Ivs",{auth:{autoRefreshToken:!0,persistSession:!0,detectSessionInUrl:!0,storage:window.localStorage},db:{schema:"public"}});(0,i.eI)("https://xuqkgeusasosxtcfhbwj.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1cWtnZXVzYXNvc3h0Y2ZoYndqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNjMwODU5NSwiZXhwIjoyMDUxODg0NTk1fQ.mDgADwthCJGMesU6F6-ui9XfLw7DGoA06k66mGEAGKU",{auth:{autoRefreshToken:!1,persistSession:!1},db:{schema:"public"}})},9311:function(e,t,r){"use strict";r.d(t,{cn:function(){return s},f:function(){return o},z:function(){return a}});var i=r(7042),n=r(4769);function s(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];return(0,n.m6)((0,i.W)(t))}function a(e){return/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(e)}let o={info:function(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];return console.log("[INFO]",...t)},error:function(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];return console.error("[ERROR]",...t)},warn:function(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];return console.warn("[WARN]",...t)}}}},function(e){e.O(0,[586,892,233,971,864,744],function(){return e(e.s=3206)}),_N_E=e.O()}]);