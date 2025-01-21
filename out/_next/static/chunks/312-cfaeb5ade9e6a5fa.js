"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[312],{5750:function(e,t,r){r.d(t,{Z:function(){return o}});var n=r(5531);/**
 * @license lucide-react v0.446.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let o=(0,n.Z)("Users",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["path",{d:"M16 3.13a4 4 0 0 1 0 7.75",key:"1da9ce"}]])},2506:function(e,t,r){r.d(t,{$j:function(){return P},Dx:function(){return $},VY:function(){return F},aU:function(){return V},aV:function(){return E},dk:function(){return W},fC:function(){return O},h_:function(){return M},xz:function(){return _}});var n=r(2265),o=r(6989),a=r(2210),i=r(8712),l=r(5744),s=r(7256),u=r(7437),d="AlertDialog",[c,f]=(0,o.b)(d,[i.p8]),p=(0,i.p8)(),g=e=>{let{__scopeAlertDialog:t,...r}=e,n=p(t);return(0,u.jsx)(i.fC,{...n,...r,modal:!0})};g.displayName=d;var m=n.forwardRef((e,t)=>{let{__scopeAlertDialog:r,...n}=e,o=p(r);return(0,u.jsx)(i.xz,{...o,...n,ref:t})});m.displayName="AlertDialogTrigger";var y=e=>{let{__scopeAlertDialog:t,...r}=e,n=p(t);return(0,u.jsx)(i.h_,{...n,...r})};y.displayName="AlertDialogPortal";var h=n.forwardRef((e,t)=>{let{__scopeAlertDialog:r,...n}=e,o=p(r);return(0,u.jsx)(i.aV,{...o,...n,ref:t})});h.displayName="AlertDialogOverlay";var v="AlertDialogContent",[x,D]=c(v),j=n.forwardRef((e,t)=>{let{__scopeAlertDialog:r,children:o,...d}=e,c=p(r),f=n.useRef(null),g=(0,a.e)(t,f),m=n.useRef(null);return(0,u.jsx)(i.jm,{contentName:v,titleName:b,docsSlug:"alert-dialog",children:(0,u.jsx)(x,{scope:r,cancelRef:m,children:(0,u.jsxs)(i.VY,{role:"alertdialog",...c,...d,ref:g,onOpenAutoFocus:(0,l.M)(d.onOpenAutoFocus,e=>{e.preventDefault(),m.current?.focus({preventScroll:!0})}),onPointerDownOutside:e=>e.preventDefault(),onInteractOutside:e=>e.preventDefault(),children:[(0,u.jsx)(s.A4,{children:o}),(0,u.jsx)(k,{contentRef:f})]})})})});j.displayName=v;var b="AlertDialogTitle",w=n.forwardRef((e,t)=>{let{__scopeAlertDialog:r,...n}=e,o=p(r);return(0,u.jsx)(i.Dx,{...o,...n,ref:t})});w.displayName=b;var R="AlertDialogDescription",N=n.forwardRef((e,t)=>{let{__scopeAlertDialog:r,...n}=e,o=p(r);return(0,u.jsx)(i.dk,{...o,...n,ref:t})});N.displayName=R;var C=n.forwardRef((e,t)=>{let{__scopeAlertDialog:r,...n}=e,o=p(r);return(0,u.jsx)(i.x8,{...o,...n,ref:t})});C.displayName="AlertDialogAction";var A="AlertDialogCancel",I=n.forwardRef((e,t)=>{let{__scopeAlertDialog:r,...n}=e,{cancelRef:o}=D(A,r),l=p(r),s=(0,a.e)(t,o);return(0,u.jsx)(i.x8,{...l,...n,ref:s})});I.displayName=A;var k=({contentRef:e})=>{let t=`\`${v}\` requires a description for the component to be accessible for screen reader users.

You can add a description to the \`${v}\` by passing a \`${R}\` component as a child, which also benefits sighted users by adding visible context to the dialog.

Alternatively, you can use your own component as a description by assigning it an \`id\` and passing the same value to the \`aria-describedby\` prop in \`${v}\`. If the description is confusing or duplicative for sighted users, you can use the \`@radix-ui/react-visually-hidden\` primitive as a wrapper around your description component.

For more information, see https://radix-ui.com/primitives/docs/components/alert-dialog`;return n.useEffect(()=>{let r=document.getElementById(e.current?.getAttribute("aria-describedby"));r||console.warn(t)},[t,e]),null},O=g,_=m,M=y,E=h,F=j,V=C,P=I,$=w,W=N},8712:function(e,t,r){r.d(t,{Dx:function(){return er},VY:function(){return et},aV:function(){return ee},dk:function(){return en},fC:function(){return J},h_:function(){return Q},jm:function(){return H},p8:function(){return j},x8:function(){return eo},xz:function(){return L}});var n=r(2265),o=r(5744),a=r(2210),i=r(6989),l=r(966),s=r(3763),u=r(9249),d=r(2759),c=r(2730),f=r(5606),p=r(9381),g=r(1244),m=r(3386),y=r(5859),h=r(7256),v=r(7437),x="Dialog",[D,j]=(0,i.b)(x),[b,w]=D(x),R=e=>{let{__scopeDialog:t,children:r,open:o,defaultOpen:a,onOpenChange:i,modal:u=!0}=e,d=n.useRef(null),c=n.useRef(null),[f=!1,p]=(0,s.T)({prop:o,defaultProp:a,onChange:i});return(0,v.jsx)(b,{scope:t,triggerRef:d,contentRef:c,contentId:(0,l.M)(),titleId:(0,l.M)(),descriptionId:(0,l.M)(),open:f,onOpenChange:p,onOpenToggle:n.useCallback(()=>p(e=>!e),[p]),modal:u,children:r})};R.displayName=x;var N="DialogTrigger",C=n.forwardRef((e,t)=>{let{__scopeDialog:r,...n}=e,i=w(N,r),l=(0,a.e)(t,i.triggerRef);return(0,v.jsx)(p.WV.button,{type:"button","aria-haspopup":"dialog","aria-expanded":i.open,"aria-controls":i.contentId,"data-state":q(i.open),...n,ref:l,onClick:(0,o.M)(e.onClick,i.onOpenToggle)})});C.displayName=N;var A="DialogPortal",[I,k]=D(A,{forceMount:void 0}),O=e=>{let{__scopeDialog:t,forceMount:r,children:o,container:a}=e,i=w(A,t);return(0,v.jsx)(I,{scope:t,forceMount:r,children:n.Children.map(o,e=>(0,v.jsx)(f.z,{present:r||i.open,children:(0,v.jsx)(c.h,{asChild:!0,container:a,children:e})}))})};O.displayName=A;var _="DialogOverlay",M=n.forwardRef((e,t)=>{let r=k(_,e.__scopeDialog),{forceMount:n=r.forceMount,...o}=e,a=w(_,e.__scopeDialog);return a.modal?(0,v.jsx)(f.z,{present:n||a.open,children:(0,v.jsx)(E,{...o,ref:t})}):null});M.displayName=_;var E=n.forwardRef((e,t)=>{let{__scopeDialog:r,...n}=e,o=w(_,r);return(0,v.jsx)(m.Z,{as:h.g7,allowPinchZoom:!0,shards:[o.contentRef],children:(0,v.jsx)(p.WV.div,{"data-state":q(o.open),...n,ref:t,style:{pointerEvents:"auto",...n.style}})})}),F="DialogContent",V=n.forwardRef((e,t)=>{let r=k(F,e.__scopeDialog),{forceMount:n=r.forceMount,...o}=e,a=w(F,e.__scopeDialog);return(0,v.jsx)(f.z,{present:n||a.open,children:a.modal?(0,v.jsx)(P,{...o,ref:t}):(0,v.jsx)($,{...o,ref:t})})});V.displayName=F;var P=n.forwardRef((e,t)=>{let r=w(F,e.__scopeDialog),i=n.useRef(null),l=(0,a.e)(t,r.contentRef,i);return n.useEffect(()=>{let e=i.current;if(e)return(0,y.Ry)(e)},[]),(0,v.jsx)(W,{...e,ref:l,trapFocus:r.open,disableOutsidePointerEvents:!0,onCloseAutoFocus:(0,o.M)(e.onCloseAutoFocus,e=>{e.preventDefault(),r.triggerRef.current?.focus()}),onPointerDownOutside:(0,o.M)(e.onPointerDownOutside,e=>{let t=e.detail.originalEvent,r=0===t.button&&!0===t.ctrlKey,n=2===t.button||r;n&&e.preventDefault()}),onFocusOutside:(0,o.M)(e.onFocusOutside,e=>e.preventDefault())})}),$=n.forwardRef((e,t)=>{let r=w(F,e.__scopeDialog),o=n.useRef(!1),a=n.useRef(!1);return(0,v.jsx)(W,{...e,ref:t,trapFocus:!1,disableOutsidePointerEvents:!1,onCloseAutoFocus:t=>{e.onCloseAutoFocus?.(t),t.defaultPrevented||(o.current||r.triggerRef.current?.focus(),t.preventDefault()),o.current=!1,a.current=!1},onInteractOutside:t=>{e.onInteractOutside?.(t),t.defaultPrevented||(o.current=!0,"pointerdown"!==t.detail.originalEvent.type||(a.current=!0));let n=t.target,i=r.triggerRef.current?.contains(n);i&&t.preventDefault(),"focusin"===t.detail.originalEvent.type&&a.current&&t.preventDefault()}})}),W=n.forwardRef((e,t)=>{let{__scopeDialog:r,trapFocus:o,onOpenAutoFocus:i,onCloseAutoFocus:l,...s}=e,c=w(F,r),f=n.useRef(null),p=(0,a.e)(t,f);return(0,g.EW)(),(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)(d.M,{asChild:!0,loop:!0,trapped:o,onMountAutoFocus:i,onUnmountAutoFocus:l,children:(0,v.jsx)(u.XB,{role:"dialog",id:c.contentId,"aria-describedby":c.descriptionId,"aria-labelledby":c.titleId,"data-state":q(c.open),...s,ref:p,onDismiss:()=>c.onOpenChange(!1)})}),(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)(X,{titleId:c.titleId}),(0,v.jsx)(G,{contentRef:f,descriptionId:c.descriptionId})]})]})}),T="DialogTitle",z=n.forwardRef((e,t)=>{let{__scopeDialog:r,...n}=e,o=w(T,r);return(0,v.jsx)(p.WV.h2,{id:o.titleId,...n,ref:t})});z.displayName=T;var B="DialogDescription",S=n.forwardRef((e,t)=>{let{__scopeDialog:r,...n}=e,o=w(B,r);return(0,v.jsx)(p.WV.p,{id:o.descriptionId,...n,ref:t})});S.displayName=B;var Y="DialogClose",Z=n.forwardRef((e,t)=>{let{__scopeDialog:r,...n}=e,a=w(Y,r);return(0,v.jsx)(p.WV.button,{type:"button",...n,ref:t,onClick:(0,o.M)(e.onClick,()=>a.onOpenChange(!1))})});function q(e){return e?"open":"closed"}Z.displayName=Y;var U="DialogTitleWarning",[H,K]=(0,i.k)(U,{contentName:F,titleName:T,docsSlug:"dialog"}),X=({titleId:e})=>{let t=K(U),r=`\`${t.contentName}\` requires a \`${t.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${t.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${t.docsSlug}`;return n.useEffect(()=>{if(e){let t=document.getElementById(e);t||console.error(r)}},[r,e]),null},G=({contentRef:e,descriptionId:t})=>{let r=K("DialogDescriptionWarning"),o=`Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${r.contentName}}.`;return n.useEffect(()=>{let r=e.current?.getAttribute("aria-describedby");if(t&&r){let e=document.getElementById(t);e||console.warn(o)}},[o,e,t]),null},J=R,L=C,Q=O,ee=M,et=V,er=z,en=S,eo=Z}}]);