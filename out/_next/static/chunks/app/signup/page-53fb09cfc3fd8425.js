(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[966],{5531:function(e,t,r){"use strict";r.d(t,{Z:function(){return l}});var n=r(2265);/**
 * @license lucide-react v0.446.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let i=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),a=(...e)=>e.filter((e,t,r)=>!!e&&r.indexOf(e)===t).join(" ");/**
 * @license lucide-react v0.446.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var s={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.446.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let o=(0,n.forwardRef)(({color:e="currentColor",size:t=24,strokeWidth:r=2,absoluteStrokeWidth:i,className:o="",children:l,iconNode:c,...u},d)=>(0,n.createElement)("svg",{ref:d,...s,width:t,height:t,stroke:e,strokeWidth:i?24*Number(r)/Number(t):r,className:a("lucide",o),...u},[...c.map(([e,t])=>(0,n.createElement)(e,t)),...Array.isArray(l)?l:[l]])),l=(e,t)=>{let r=(0,n.forwardRef)(({className:r,...s},l)=>(0,n.createElement)(o,{ref:l,iconNode:t,className:a(`lucide-${i(e)}`,r),...s}));return r.displayName=`${e}`,r}},3067:function(e,t,r){"use strict";r.d(t,{Z:function(){return i}});var n=r(5531);/**
 * @license lucide-react v0.446.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let i=(0,n.Z)("ArrowLeft",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]])},2700:function(e,t,r){"use strict";r.d(t,{Z:function(){return i}});var n=r(5531);/**
 * @license lucide-react v0.446.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let i=(0,n.Z)("Baby",[["path",{d:"M9 12h.01",key:"157uk2"}],["path",{d:"M15 12h.01",key:"1k8ypt"}],["path",{d:"M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5",key:"1u7htd"}],["path",{d:"M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1",key:"5yv0yz"}]])},3715:function(e,t,r){"use strict";r.d(t,{Z:function(){return i}});var n=r(5531);/**
 * @license lucide-react v0.446.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let i=(0,n.Z)("LoaderCircle",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]])},4162:function(e,t,r){Promise.resolve().then(r.bind(r,9961))},9961:function(e,t,r){"use strict";r.r(t),r.d(t,{default:function(){return j}});var n=r(7437),i=r(2265),a=r(4033),s=r(9303),o=r(8110),l=r(1865),c=r(4578),u=r(3715),d=r(3067),f=r(2700),m=r(3023),p=r(1315),h=r(1908),v=r(2621),x=r(6763),g=r(9311),w=r(4566);let y=(0,w.eI)("https://xuqkgeusasosxtcfhbwj.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1cWtnZXVzYXNvc3h0Y2ZoYndqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNjMwODU5NSwiZXhwIjoyMDUxODg0NTk1fQ.mDgADwthCJGMesU6F6-ui9XfLw7DGoA06k66mGEAGKU",{auth:{autoRefreshToken:!0,persistSession:!1},db:{schema:"public"}}),b=c.Ry({name:c.Z_().min(2,"Name must be at least 2 characters"),email:c.Z_().email("Please enter a valid email address"),password:c.Z_().min(8,"Password must be at least 8 characters").regex(/[A-Z]/,"Password must contain at least one uppercase letter").regex(/[a-z]/,"Password must contain at least one lowercase letter").regex(/[0-9]/,"Password must contain at least one number"),confirmPassword:c.Z_()}).refine(e=>e.password===e.confirmPassword,{message:"Passwords don't match",path:["confirmPassword"]});function j(){let e=(0,a.useRouter)(),t=(0,a.useSearchParams)(),{toast:r}=(0,v.pm)(),[c,w]=(0,i.useState)(!1),[j,I]=(0,i.useState)(!0),[N,E]=(0,i.useState)(null),[S,A]=(0,i.useState)(null),[C,k]=(0,i.useState)(""),_=t.get("invitation_id"),R=_&&(0,g.z)(_)?_:null,O=t.get("email");(0,i.useEffect)(()=>{k(window.location.href)},[]),(0,i.useEffect)(()=>(g.f.info("CaregiverSignupPage mounted",{invitationId:R,invitedEmail:O,url:C,searchParams:Object.fromEntries(t.entries())}),()=>{g.f.info("CaregiverSignupPage unmounted")}),[R,O,C,t]),g.f.info("URL parameters:",{rawInvitationId:_,invitationId:R,invitedEmail:O,url:C,searchParams:Object.fromEntries(t.entries())});let T=(0,l.cI)({resolver:(0,o.F)(b),defaultValues:{name:"",email:O?decodeURIComponent(O):"",password:"",confirmPassword:""}});(0,i.useEffect)(()=>{!async function(){if(g.f.info("Starting invitation validation",{invitationId:R,invitedEmail:O}),!R||!O){g.f.warn("Missing invitation parameters",{invitationId:R,invitedEmail:O}),E("Invalid invitation format"),I(!1);return}try{var e,t;g.f.info("Validating invitation:",{invitationId:R,invitedEmail:O}),g.f.info("Invitation query details:",{invitationId:R,invitedEmail:O,decodedEmail:decodeURIComponent(O),isValidUUID:(0,g.z)(R)});let{data:r,error:n}=await y.from("caregiver_invitations").select("\n            id,\n            email,\n            name,\n            status,\n            expires_at,\n            specialists (\n              name,\n              business_name\n            )\n          ").eq("id",R).eq("email",O).single();if(g.f.info("Query result:",{hasData:!!r,data:r,error:n}),n)throw g.f.error("Invitation query failed",{error:n,invitationId:R,status:n.code,message:n.message,details:n.details}),Error("Invitation not found");if(r.email!==decodeURIComponent(O))throw g.f.warn("Email mismatch in invitation",{invitationEmail:r.email,providedEmail:decodeURIComponent(O)}),Error("Invalid invitation email");g.f.info("Raw invitation data received:",r);let i={...r,specialists:Array.isArray(r.specialists)?r.specialists[0]:r.specialists};if("accepted"===i.status)throw g.f.warn("Attempt to use already accepted invitation",{invitationId:R,status:i.status}),Error("This invitation has already been used");if(i.expires_at&&new Date(i.expires_at)<new Date)throw g.f.warn("Attempt to use expired invitation",{invitationId:R,expiresAt:i.expires_at}),Error("This invitation has expired");g.f.info("Invitation is valid:",i),A((null===(e=i.specialists)||void 0===e?void 0:e.business_name)||(null===(t=i.specialists)||void 0===t?void 0:t.name)||null),i.name&&T.setValue("name",i.name),I(!1)}catch(e){g.f.error("Invitation validation failed",{error:e,invitationId:R,invitedEmail:O}),E(e instanceof Error?e.message:"Invalid invitation"),I(!1)}}()},[R,O,T]);let Z=async t=>{if(g.f.info("Starting form submission",{email:t.email,name:t.name,invitationId:R}),!R){g.f.error("Missing invitationId during form submission"),r({variant:"destructive",title:"Error",description:"Invalid invitation"});return}w(!0);try{let{data:n,error:i}=await x.OQ.rpc("check_user_exists",{p_email:t.email});if(i)throw g.f.error("User lookup failed",{error:i}),i;if(n)throw g.f.info("User already exists"),Error("An account with this email already exists");g.f.info("Creating new auth account");let{data:a,error:s}=await x.OQ.auth.signUp({email:t.email,password:t.password,options:{data:{name:t.name,role:"caregiver"}}});if(s)throw g.f.error("Auth signup failed",{error:s}),s;if(!a.user)throw g.f.error("Auth signup returned no user"),Error("Failed to create account");g.f.info("Calling handle_caregiver_signup RPC",{userId:a.user.id,invitationId:R});let{error:o}=await x.OQ.rpc("handle_caregiver_signup",{p_user_id:a.user.id,p_invitation_id:R});if(o)throw g.f.error("RPC call failed",{error:o}),o;g.f.info("Signup process completed successfully"),r({title:"Account created",description:"Your caregiver account has been created successfully. Please check your email to verify your account."}),e.push("/login/caregiver")}catch(e){g.f.error("Signup process failed",{error:e,email:t.email,invitationId:R}),r({variant:"destructive",title:"Error",description:e instanceof Error?e.message:"Failed to create account"})}finally{w(!1)}};return j?(0,n.jsx)("div",{className:"min-h-screen bg-background flex items-center justify-center",children:(0,n.jsxs)("div",{className:"flex flex-col items-center gap-4",children:[(0,n.jsx)(u.Z,{className:"h-8 w-8 animate-spin text-primary"}),(0,n.jsx)("p",{className:"text-muted-foreground",children:"Validating your invitation..."})]})}):N?(0,n.jsx)("div",{className:"min-h-screen bg-background flex items-center justify-center",children:(0,n.jsx)("div",{className:"max-w-md w-full px-4",children:(0,n.jsxs)(s.E.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.3},className:"bg-card rounded-lg shadow-lg p-6 text-center",children:[(0,n.jsx)("h1",{className:"text-2xl font-bold text-destructive mb-4",children:"Invalid Invitation"}),(0,n.jsx)("p",{className:"text-muted-foreground mb-6",children:N}),(0,n.jsx)(m.z,{onClick:()=>e.push("/"),children:"Return Home"})]})})}):(0,n.jsx)("div",{className:"min-h-screen bg-background",children:(0,n.jsx)("div",{className:"max-w-md mx-auto pt-16 px-4",children:(0,n.jsxs)(s.E.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.3},className:"w-full overflow-hidden rounded-xl shadow-xl p-6 bg-card",children:[(0,n.jsxs)("div",{className:"mb-8",children:[(0,n.jsxs)(m.z,{variant:"ghost",onClick:()=>e.push("/"),className:"inline-flex items-center text-sm mb-6 text-muted-foreground hover:text-foreground",children:[(0,n.jsx)(d.Z,{className:"mr-2 h-4 w-4"}),"Back to Home"]}),(0,n.jsxs)("div",{className:"text-center",children:[(0,n.jsx)("div",{className:"inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4",children:(0,n.jsx)(f.Z,{className:"h-6 w-6 text-primary"})}),(0,n.jsx)("h1",{className:"text-2xl font-bold text-foreground",children:"Create Your Caregiver Account"}),S&&(0,n.jsxs)("p",{className:"mt-2 text-muted-foreground",children:["Join ",S,"'s sleep consultation practice"]})]})]}),(0,n.jsx)(p.l0,{...T,children:(0,n.jsxs)("form",{onSubmit:T.handleSubmit(Z),className:"space-y-6",children:[(0,n.jsx)(p.Wi,{control:T.control,name:"name",render:e=>{let{field:t}=e;return(0,n.jsxs)(p.xJ,{children:[(0,n.jsx)(p.lX,{children:"Full Name"}),(0,n.jsx)(p.NI,{children:(0,n.jsx)(h.I,{placeholder:"Enter your name",...t})}),(0,n.jsx)(p.pf,{children:"This is how you'll appear to your sleep specialist"}),(0,n.jsx)(p.zG,{})]})}}),(0,n.jsx)(p.Wi,{control:T.control,name:"email",render:e=>{let{field:t}=e;return(0,n.jsxs)(p.xJ,{children:[(0,n.jsx)(p.lX,{children:"Email"}),(0,n.jsx)(p.NI,{children:(0,n.jsx)(h.I,{type:"email",placeholder:"Enter your email",disabled:!0,...t})}),(0,n.jsx)(p.pf,{children:"This is the email where you received the invitation"}),(0,n.jsx)(p.zG,{})]})}}),(0,n.jsx)(p.Wi,{control:T.control,name:"password",render:e=>{let{field:t}=e;return(0,n.jsxs)(p.xJ,{children:[(0,n.jsx)(p.lX,{children:"Password"}),(0,n.jsx)(p.NI,{children:(0,n.jsx)(h.I,{type:"password",placeholder:"Create a password",...t})}),(0,n.jsx)(p.pf,{children:"Must be at least 8 characters with uppercase, lowercase, and numbers"}),(0,n.jsx)(p.zG,{})]})}}),(0,n.jsx)(p.Wi,{control:T.control,name:"confirmPassword",render:e=>{let{field:t}=e;return(0,n.jsxs)(p.xJ,{children:[(0,n.jsx)(p.lX,{children:"Confirm Password"}),(0,n.jsx)(p.NI,{children:(0,n.jsx)(h.I,{type:"password",placeholder:"Confirm your password",...t})}),(0,n.jsx)(p.zG,{})]})}}),(0,n.jsx)(m.z,{type:"submit",className:"w-full",disabled:c,children:c?(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(u.Z,{className:"mr-2 h-4 w-4 animate-spin"}),"Creating Account..."]}):"Create Caregiver Account"})]})})]})})})}},3023:function(e,t,r){"use strict";r.d(t,{d:function(){return l},z:function(){return c}});var n=r(7437),i=r(2265),a=r(7256),s=r(6061),o=r(9311);let l=(0,s.j)("inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",{variants:{variant:{default:"bg-primary text-primary-foreground hover:bg-primary/90",destructive:"bg-destructive text-destructive-foreground hover:bg-destructive/90",outline:"border border-input bg-background hover:bg-accent hover:text-accent-foreground",secondary:"bg-secondary text-secondary-foreground hover:bg-secondary/80",ghost:"hover:bg-accent hover:text-accent-foreground",link:"text-primary underline-offset-4 hover:underline"},size:{default:"h-10 px-4 py-2",sm:"h-9 rounded-md px-3",lg:"h-11 rounded-md px-8",icon:"h-10 w-10"}},defaultVariants:{variant:"default",size:"default"}}),c=i.forwardRef((e,t)=>{let{className:r,variant:i,size:s,asChild:c=!1,...u}=e,d=c?a.g7:"button";return(0,n.jsx)(d,{className:(0,o.cn)(l({variant:i,size:s,className:r})),ref:t,...u})});c.displayName="Button"},1315:function(e,t,r){"use strict";r.d(t,{NI:function(){return v},Wi:function(){return d},l0:function(){return c},lX:function(){return h},pf:function(){return x},xJ:function(){return p},zG:function(){return g}});var n=r(7437),i=r(2265),a=r(7256),s=r(1865),o=r(9311),l=r(6672);let c=s.RV,u=i.createContext({}),d=e=>{let{...t}=e;return(0,n.jsx)(u.Provider,{value:{name:t.name},children:(0,n.jsx)(s.Qr,{...t})})},f=()=>{let e=i.useContext(u),t=i.useContext(m),{getFieldState:r,formState:n}=(0,s.Gc)(),a=r(e.name,n);if(!e)throw Error("useFormField should be used within <FormField>");let{id:o}=t;return{id:o,name:e.name,formItemId:"".concat(o,"-form-item"),formDescriptionId:"".concat(o,"-form-item-description"),formMessageId:"".concat(o,"-form-item-message"),...a}},m=i.createContext({}),p=i.forwardRef((e,t)=>{let{className:r,...a}=e,s=i.useId();return(0,n.jsx)(m.Provider,{value:{id:s},children:(0,n.jsx)("div",{ref:t,className:(0,o.cn)("space-y-2",r),...a})})});p.displayName="FormItem";let h=i.forwardRef((e,t)=>{let{className:r,...i}=e,{error:a,formItemId:s}=f();return(0,n.jsx)(l._,{ref:t,className:(0,o.cn)(a&&"text-destructive",r),htmlFor:s,...i})});h.displayName="FormLabel";let v=i.forwardRef((e,t)=>{let{...r}=e,{error:i,formItemId:s,formDescriptionId:o,formMessageId:l}=f();return(0,n.jsx)(a.g7,{ref:t,id:s,"aria-describedby":i?"".concat(o," ").concat(l):"".concat(o),"aria-invalid":!!i,...r})});v.displayName="FormControl";let x=i.forwardRef((e,t)=>{let{className:r,...i}=e,{formDescriptionId:a}=f();return(0,n.jsx)("p",{ref:t,id:a,className:(0,o.cn)("text-sm text-muted-foreground",r),...i})});x.displayName="FormDescription";let g=i.forwardRef((e,t)=>{let{className:r,children:i,...a}=e,{error:s,formMessageId:l}=f(),c=s?String(null==s?void 0:s.message):i;return c?(0,n.jsx)("p",{ref:t,id:l,className:(0,o.cn)("text-sm font-medium text-destructive",r),...a,children:c}):null});g.displayName="FormMessage"},1908:function(e,t,r){"use strict";r.d(t,{I:function(){return s}});var n=r(7437),i=r(2265),a=r(9311);let s=i.forwardRef((e,t)=>{let{className:r,type:i,...s}=e;return(0,n.jsx)("input",{type:i,className:(0,a.cn)("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",r),ref:t,...s})});s.displayName="Input"},6672:function(e,t,r){"use strict";r.d(t,{_:function(){return c}});var n=r(7437),i=r(2265),a=r(6743),s=r(6061),o=r(9311);let l=(0,s.j)("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"),c=i.forwardRef((e,t)=>{let{className:r,...i}=e;return(0,n.jsx)(a.f,{ref:t,className:(0,o.cn)(l(),r),...i})});c.displayName=a.f.displayName},2621:function(e,t,r){"use strict";r.d(t,{pm:function(){return f}});var n=r(2265);let i=0,a=new Map,s=e=>{if(a.has(e))return;let t=setTimeout(()=>{a.delete(e),u({type:"REMOVE_TOAST",toastId:e})},1e6);a.set(e,t)},o=(e,t)=>{switch(t.type){case"ADD_TOAST":return{...e,toasts:[t.toast,...e.toasts].slice(0,1)};case"UPDATE_TOAST":return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case"DISMISS_TOAST":{let{toastId:r}=t;return r?s(r):e.toasts.forEach(e=>{s(e.id)}),{...e,toasts:e.toasts.map(e=>e.id===r||void 0===r?{...e,open:!1}:e)}}case"REMOVE_TOAST":if(void 0===t.toastId)return{...e,toasts:[]};return{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)}}},l=[],c={toasts:[]};function u(e){c=o(c,e),l.forEach(e=>{e(c)})}function d(e){let{...t}=e,r=(i=(i+1)%Number.MAX_SAFE_INTEGER).toString(),n=()=>u({type:"DISMISS_TOAST",toastId:r});return u({type:"ADD_TOAST",toast:{...t,id:r,open:!0,onOpenChange:e=>{e||n()}}}),{id:r,dismiss:n,update:e=>u({type:"UPDATE_TOAST",toast:{...e,id:r}})}}function f(){let[e,t]=n.useState(c);return n.useEffect(()=>(l.push(t),()=>{let e=l.indexOf(t);e>-1&&l.splice(e,1)}),[e]),{...e,toast:d,dismiss:e=>u({type:"DISMISS_TOAST",toastId:e})}}},6763:function(e,t,r){"use strict";r.d(t,{OQ:function(){return i},dx:function(){return s},z6:function(){return a}});var n=r(4566);let i=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,t=(0,n.eI)("https://xuqkgeusasosxtcfhbwj.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1cWtnZXVzYXNvc3h0Y2ZoYndqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNjMwODU5NSwiZXhwIjoyMDUxODg0NTk1fQ.mDgADwthCJGMesU6F6-ui9XfLw7DGoA06k66mGEAGKU",{auth:{autoRefreshToken:!0,persistSession:!0,detectSessionInUrl:!0,storage:{getItem:e=>{try{let t=window.localStorage.getItem(e);return t}catch(e){return console.error("Error reading session:",e),null}},setItem:(e,t)=>{try{window.localStorage.setItem(e,t)}catch(e){console.error("Error storing session:",e)}},removeItem:e=>{try{window.localStorage.removeItem(e)}catch(e){console.error("Error removing session:",e)}}}},db:{schema:"public"},global:{fetch:async function(){for(var t=arguments.length,r=Array(t),n=0;n<t;n++)r[n]=arguments[n];try{let e=await fetch(...r);return e}catch(t){if(e<3)return await new Promise(e=>setTimeout(e,1e3)),fetch(...r);throw t}}}});return t}(),a=async()=>{try{let{data:{session:e},error:t}=await i.auth.getSession();if(t)throw t;if(null==e?void 0:e.expires_at){let t=new Date(1e3*e.expires_at),r=new Date;return t>r}return!1}catch(e){return console.error("Error checking session:",e),!1}},s=async()=>{try{let{data:{session:e},error:t}=await i.auth.getSession();if(t)throw t;if(e){let t=new Date(1e3*e.expires_at),r=new Date;if(t.getTime()-r.getTime()<3e5){let{data:{session:e},error:t}=await i.auth.refreshSession();if(t)throw t;return e}return e}return null}catch(e){return console.error("Error refreshing session:",e),null}}},9311:function(e,t,r){"use strict";r.d(t,{cn:function(){return a},f:function(){return o},z:function(){return s}});var n=r(7042),i=r(4769);function a(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];return(0,i.m6)((0,n.W)(t))}function s(e){return/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(e)}let o={info:function(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];return console.log("[INFO]",...t)},error:function(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];return console.error("[ERROR]",...t)},warn:function(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];return console.warn("[WARN]",...t)}}},4033:function(e,t,r){e.exports=r(290)},2210:function(e,t,r){"use strict";r.d(t,{F:function(){return a},e:function(){return s}});var n=r(2265);function i(e,t){if("function"==typeof e)return e(t);null!=e&&(e.current=t)}function a(...e){return t=>{let r=!1,n=e.map(e=>{let n=i(e,t);return r||"function"!=typeof n||(r=!0),n});if(r)return()=>{for(let t=0;t<n.length;t++){let r=n[t];"function"==typeof r?r():i(e[t],null)}}}}function s(...e){return n.useCallback(a(...e),e)}},9381:function(e,t,r){"use strict";r.d(t,{WV:function(){return o},jH:function(){return l}});var n=r(2265),i=r(4887),a=r(7256),s=r(7437),o=["a","button","div","form","h2","h3","img","input","label","li","nav","ol","p","span","svg","ul"].reduce((e,t)=>{let r=n.forwardRef((e,r)=>{let{asChild:n,...i}=e,o=n?a.g7:t;return"undefined"!=typeof window&&(window[Symbol.for("radix-ui")]=!0),(0,s.jsx)(o,{...i,ref:r})});return r.displayName=`Primitive.${t}`,{...e,[t]:r}},{});function l(e,t){e&&i.flushSync(()=>e.dispatchEvent(t))}},7256:function(e,t,r){"use strict";r.d(t,{A4:function(){return l},g7:function(){return s}});var n=r(2265),i=r(2210),a=r(7437),s=n.forwardRef((e,t)=>{let{children:r,...i}=e,s=n.Children.toArray(r),l=s.find(c);if(l){let e=l.props.children,r=s.map(t=>t!==l?t:n.Children.count(e)>1?n.Children.only(null):n.isValidElement(e)?e.props.children:null);return(0,a.jsx)(o,{...i,ref:t,children:n.isValidElement(e)?n.cloneElement(e,void 0,r):null})}return(0,a.jsx)(o,{...i,ref:t,children:r})});s.displayName="Slot";var o=n.forwardRef((e,t)=>{let{children:r,...a}=e;if(n.isValidElement(r)){let e,s;let o=(e=Object.getOwnPropertyDescriptor(r.props,"ref")?.get)&&"isReactWarning"in e&&e.isReactWarning?r.ref:(e=Object.getOwnPropertyDescriptor(r,"ref")?.get)&&"isReactWarning"in e&&e.isReactWarning?r.props.ref:r.props.ref||r.ref;return n.cloneElement(r,{...function(e,t){let r={...t};for(let n in t){let i=e[n],a=t[n],s=/^on[A-Z]/.test(n);s?i&&a?r[n]=(...e)=>{a(...e),i(...e)}:i&&(r[n]=i):"style"===n?r[n]={...i,...a}:"className"===n&&(r[n]=[i,a].filter(Boolean).join(" "))}return{...e,...r}}(a,r.props),ref:t?(0,i.F)(t,o):o})}return n.Children.count(r)>1?n.Children.only(null):null});o.displayName="SlotClone";var l=({children:e})=>(0,a.jsx)(a.Fragment,{children:e});function c(e){return n.isValidElement(e)&&e.type===l}},6061:function(e,t,r){"use strict";r.d(t,{j:function(){return s}});var n=r(7042);let i=e=>"boolean"==typeof e?`${e}`:0===e?"0":e,a=n.W,s=(e,t)=>r=>{var n;if((null==t?void 0:t.variants)==null)return a(e,null==r?void 0:r.class,null==r?void 0:r.className);let{variants:s,defaultVariants:o}=t,l=Object.keys(s).map(e=>{let t=null==r?void 0:r[e],n=null==o?void 0:o[e];if(null===t)return null;let a=i(t)||i(n);return s[e][a]}),c=r&&Object.entries(r).reduce((e,t)=>{let[r,n]=t;return void 0===n||(e[r]=n),e},{}),u=null==t?void 0:null===(n=t.compoundVariants)||void 0===n?void 0:n.reduce((e,t)=>{let{class:r,className:n,...i}=t;return Object.entries(i).every(e=>{let[t,r]=e;return Array.isArray(r)?r.includes({...o,...c}[t]):({...o,...c})[t]===r})?[...e,r,n]:e},[]);return a(e,l,u,null==r?void 0:r.class,null==r?void 0:r.className)}}},function(e){e.O(0,[985,566,303,233,971,864,744],function(){return e(e.s=4162)}),_N_E=e.O()}]);