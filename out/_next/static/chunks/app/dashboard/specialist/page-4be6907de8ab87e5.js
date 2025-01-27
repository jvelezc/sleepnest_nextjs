(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[893],{8203:function(e,s,a){"use strict";a.d(s,{Z:function(){return r}});var t=a(5531);/**
 * @license lucide-react v0.446.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let r=(0,t.Z)("Calendar",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]])},6538:function(e,s,a){"use strict";a.d(s,{Z:function(){return r}});var t=a(5531);/**
 * @license lucide-react v0.446.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let r=(0,t.Z)("CircleUser",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}],["path",{d:"M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662",key:"154egf"}]])},1827:function(e,s,a){"use strict";a.d(s,{Z:function(){return r}});var t=a(5531);/**
 * @license lucide-react v0.446.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let r=(0,t.Z)("Search",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]])},5416:function(e,s,a){Promise.resolve().then(a.bind(a,2624))},2624:function(e,s,a){"use strict";a.r(s),a.d(s,{default:function(){return y}});var t=a(7437),r=a(2265),i=a(1827),c=a(6538),l=a(1295),n=a(8203),d=a(6141),o=a(2176),u=a(7918),m=a(4863),x=a(6763),h=a(6110),v=a(1908),f=a(3023),g=a(9401),p=a(9155),j=a(8094);function y(){let{user:e}=(0,m.a)(),[s,a]=(0,r.useState)([]),[y,N]=(0,r.useState)([]),[_,w]=(0,r.useState)(!0),[b,k]=(0,r.useState)(null),[C,Z]=(0,r.useState)(null),[S,z]=(0,r.useState)(null),[M,E]=(0,r.useState)(""),[I,O]=(0,r.useState)("name"),[P,D]=(0,r.useState)(1);(0,r.useEffect)(()=>{(async function(){if(!e){w(!1);return}try{k(null);let{data:s,error:a}=await x.OQ.from("specialists").select("id").eq("auth_user_id",e.id).single();if(a)throw a;s&&Z(s.id)}catch(e){console.error("Error fetching specialist ID:",e),k("Failed to fetch specialist data")}})()},[e]),(0,r.useEffect)(()=>{(async function(){if(C)try{w(!0),k(null);let{data:e,error:s}=await x.OQ.rpc("get_specialist_caregivers",{p_specialist_id:C,p_sort_field:"last_activity",p_sort_order:"desc",p_limit:50,p_offset:0});if(s)throw s;a(e||[])}catch(e){console.error("Error loading caregivers:",e),k("Failed to load caregivers")}finally{w(!1)}})()},[C]),(0,r.useEffect)(()=>{let e=[...s];M&&(e=e.filter(e=>e.caregiver_name.toLowerCase().includes(M.toLowerCase())||e.caregiver_email.toLowerCase().includes(M.toLowerCase()))),e.sort((e,s)=>{switch(I){case"name":return e.caregiver_name.localeCompare(s.caregiver_name);case"recent":return new Date(s.last_activity).getTime()-new Date(e.last_activity).getTime();case"status":return("active"===s.status?1:-1)-("active"===e.status?1:-1);default:return 0}}),N(e)},[s,M,I]);let L=y.slice((P-1)*9,9*P),Q=Math.ceil(y.length/9);return _?(0,t.jsx)("div",{className:"flex-1 p-8",children:(0,t.jsx)("div",{className:"space-y-6",children:(0,t.jsx)("div",{className:"grid gap-4 md:grid-cols-2 lg:grid-cols-3",children:[...Array(6)].map((e,s)=>(0,t.jsxs)(h.Zb,{className:"animate-pulse",children:[(0,t.jsxs)(h.Ol,{className:"space-y-4",children:[(0,t.jsx)("div",{className:"h-4 bg-muted rounded w-3/4"}),(0,t.jsx)("div",{className:"h-3 bg-muted rounded w-1/2"})]}),(0,t.jsx)(h.aY,{children:(0,t.jsxs)("div",{className:"space-y-3",children:[(0,t.jsx)("div",{className:"h-3 bg-muted rounded"}),(0,t.jsx)("div",{className:"h-3 bg-muted rounded w-5/6"})]})})]},s))})})}):(0,t.jsxs)("div",{className:"flex-1 p-8",children:[(0,t.jsxs)("div",{className:"flex flex-col space-y-6",children:[(0,t.jsxs)("div",{className:"flex items-center gap-4",children:[(0,t.jsxs)("div",{className:"relative flex-1",children:[(0,t.jsx)(i.Z,{className:"absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"}),(0,t.jsx)(v.I,{placeholder:"Search caregivers...",value:M,onChange:e=>E(e.target.value),className:"pl-10"})]}),(0,t.jsxs)(j.Ph,{value:I,onValueChange:O,children:[(0,t.jsx)(j.i4,{className:"w-[180px]",children:(0,t.jsx)(j.ki,{placeholder:"Sort by..."})}),(0,t.jsxs)(j.Bw,{children:[(0,t.jsx)(j.Ql,{value:"name",children:"Sort by Name"}),(0,t.jsx)(j.Ql,{value:"recent",children:"Sort by Recent"}),(0,t.jsx)(j.Ql,{value:"status",children:"Sort by Status"})]})]})]}),(0,t.jsx)("div",{className:"grid gap-4 md:grid-cols-2 lg:grid-cols-3",children:L.map(e=>(0,t.jsxs)(h.Zb,{className:"relative",children:[(0,t.jsx)(h.Ol,{children:(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsxs)("div",{className:"flex items-center gap-3",children:[(0,t.jsx)("div",{className:"h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center",children:(0,t.jsx)(c.Z,{className:"h-6 w-6 text-primary"})}),(0,t.jsxs)("div",{children:[(0,t.jsx)(h.ll,{className:"text-lg",children:e.caregiver_name}),(0,t.jsxs)(h.SZ,{className:"flex items-center gap-2",children:[(0,t.jsx)(l.Z,{className:"h-3 w-3"}),(0,t.jsx)("span",{className:"text-xs",children:e.caregiver_email})]})]})]}),(0,t.jsx)(p.C,{variant:"active"===e.status?"default":"secondary",children:e.status})]})}),(0,t.jsx)(h.aY,{children:(0,t.jsxs)("div",{className:"space-y-2 text-sm text-muted-foreground",children:[(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)(n.Z,{className:"h-4 w-4"}),(0,t.jsxs)("span",{children:["Joined ",(0,u.ZP)(new Date(e.last_activity),"MMM d, yyyy")]})]}),(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)(d.Z,{className:"h-4 w-4"}),(0,t.jsxs)("span",{children:["Last active ",(0,u.ZP)(new Date(e.last_activity),"h:mm a")]})]}),(0,t.jsxs)("div",{className:"mt-4 flex justify-end gap-2",children:[(0,t.jsxs)(f.z,{variant:"outline",size:"sm",className:"flex items-center gap-2",onClick:()=>{},children:[(0,t.jsx)(c.Z,{className:"h-4 w-4"}),"Profile"]}),(0,t.jsxs)(f.z,{variant:"secondary",size:"sm",className:"flex items-center gap-2",onClick:()=>{C&&z({specialistId:C,caregiverId:e.caregiver_id,caregiverName:e.caregiver_name})},children:[(0,t.jsx)(o.Z,{className:"h-4 w-4"}),"Chat"]})]})]})})]},e.caregiver_id))}),Q>1&&(0,t.jsxs)("div",{className:"flex justify-center gap-2 mt-6",children:[(0,t.jsx)(f.z,{variant:"outline",size:"sm",onClick:()=>D(e=>Math.max(1,e-1)),disabled:1===P,children:"Previous"}),[...Array(Q)].map((e,s)=>(0,t.jsx)(f.z,{variant:P===s+1?"default":"outline",size:"sm",onClick:()=>D(s+1),children:s+1},s+1)),(0,t.jsx)(f.z,{variant:"outline",size:"sm",onClick:()=>D(e=>Math.min(Q,e+1)),disabled:P===Q,children:"Next"})]})]}),S&&(0,t.jsx)(g.z,{specialistId:S.specialistId,caregiverId:S.caregiverId,caregiverName:S.caregiverName,onClose:()=>z(null)})]})}},9155:function(e,s,a){"use strict";a.d(s,{C:function(){return l}});var t=a(7437);a(2265);var r=a(9213),i=a(9311);let c=(0,r.j)("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",{variants:{variant:{default:"border-transparent bg-primary text-primary-foreground hover:bg-primary/80",secondary:"border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",destructive:"border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",outline:"text-foreground"}},defaultVariants:{variant:"default"}});function l(e){let{className:s,variant:a,...r}=e;return(0,t.jsx)("div",{className:(0,i.cn)(c({variant:a}),s),...r})}}},function(e){e.O(0,[566,237,436,0,747,375,102,971,864,744],function(){return e(e.s=5416)}),_N_E=e.O()}]);