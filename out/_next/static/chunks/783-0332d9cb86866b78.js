"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[783],{3995:function(t,e,n){n.d(e,{ee:function(){return tK},Eh:function(){return tU},VY:function(){return tQ},fC:function(){return tJ},D7:function(){return tD}});var r=n(2265);let i=["top","right","bottom","left"],o=Math.min,l=Math.max,a=Math.round,f=Math.floor,s=t=>({x:t,y:t}),u={left:"right",right:"left",bottom:"top",top:"bottom"},c={start:"end",end:"start"};function d(t,e){return"function"==typeof t?t(e):t}function p(t){return t.split("-")[0]}function h(t){return t.split("-")[1]}function m(t){return"x"===t?"y":"x"}function g(t){return"y"===t?"height":"width"}function y(t){return["top","bottom"].includes(p(t))?"y":"x"}function w(t){return t.replace(/start|end/g,t=>c[t])}function x(t){return t.replace(/left|right|bottom|top/g,t=>u[t])}function v(t){return"number"!=typeof t?{top:0,right:0,bottom:0,left:0,...t}:{top:t,right:t,bottom:t,left:t}}function b(t){let{x:e,y:n,width:r,height:i}=t;return{width:r,height:i,top:n,left:e,right:e+r,bottom:n+i,x:e,y:n}}function R(t,e,n){let r,{reference:i,floating:o}=t,l=y(e),a=m(y(e)),f=g(a),s=p(e),u="y"===l,c=i.x+i.width/2-o.width/2,d=i.y+i.height/2-o.height/2,w=i[f]/2-o[f]/2;switch(s){case"top":r={x:c,y:i.y-o.height};break;case"bottom":r={x:c,y:i.y+i.height};break;case"right":r={x:i.x+i.width,y:d};break;case"left":r={x:i.x-o.width,y:d};break;default:r={x:i.x,y:i.y}}switch(h(e)){case"start":r[a]-=w*(n&&u?-1:1);break;case"end":r[a]+=w*(n&&u?-1:1)}return r}let A=async(t,e,n)=>{let{placement:r="bottom",strategy:i="absolute",middleware:o=[],platform:l}=n,a=o.filter(Boolean),f=await (null==l.isRTL?void 0:l.isRTL(e)),s=await l.getElementRects({reference:t,floating:e,strategy:i}),{x:u,y:c}=R(s,r,f),d=r,p={},h=0;for(let n=0;n<a.length;n++){let{name:o,fn:m}=a[n],{x:g,y:y,data:w,reset:x}=await m({x:u,y:c,initialPlacement:r,placement:d,strategy:i,middlewareData:p,rects:s,platform:l,elements:{reference:t,floating:e}});u=null!=g?g:u,c=null!=y?y:c,p={...p,[o]:{...p[o],...w}},x&&h<=50&&(h++,"object"==typeof x&&(x.placement&&(d=x.placement),x.rects&&(s=!0===x.rects?await l.getElementRects({reference:t,floating:e,strategy:i}):x.rects),{x:u,y:c}=R(s,d,f)),n=-1)}return{x:u,y:c,placement:d,strategy:i,middlewareData:p}};async function T(t,e){var n;void 0===e&&(e={});let{x:r,y:i,platform:o,rects:l,elements:a,strategy:f}=t,{boundary:s="clippingAncestors",rootBoundary:u="viewport",elementContext:c="floating",altBoundary:p=!1,padding:h=0}=d(e,t),m=v(h),g=a[p?"floating"===c?"reference":"floating":c],y=b(await o.getClippingRect({element:null==(n=await (null==o.isElement?void 0:o.isElement(g)))||n?g:g.contextElement||await (null==o.getDocumentElement?void 0:o.getDocumentElement(a.floating)),boundary:s,rootBoundary:u,strategy:f})),w="floating"===c?{x:r,y:i,width:l.floating.width,height:l.floating.height}:l.reference,x=await (null==o.getOffsetParent?void 0:o.getOffsetParent(a.floating)),R=await (null==o.isElement?void 0:o.isElement(x))&&await (null==o.getScale?void 0:o.getScale(x))||{x:1,y:1},A=b(o.convertOffsetParentRelativeRectToViewportRelativeRect?await o.convertOffsetParentRelativeRectToViewportRelativeRect({elements:a,rect:w,offsetParent:x,strategy:f}):w);return{top:(y.top-A.top+m.top)/R.y,bottom:(A.bottom-y.bottom+m.bottom)/R.y,left:(y.left-A.left+m.left)/R.x,right:(A.right-y.right+m.right)/R.x}}function E(t,e){return{top:t.top-e.height,right:t.right-e.width,bottom:t.bottom-e.height,left:t.left-e.width}}function L(t){return i.some(e=>t[e]>=0)}async function S(t,e){let{placement:n,platform:r,elements:i}=t,o=await (null==r.isRTL?void 0:r.isRTL(i.floating)),l=p(n),a=h(n),f="y"===y(n),s=["left","top"].includes(l)?-1:1,u=o&&f?-1:1,c=d(e,t),{mainAxis:m,crossAxis:g,alignmentAxis:w}="number"==typeof c?{mainAxis:c,crossAxis:0,alignmentAxis:null}:{mainAxis:c.mainAxis||0,crossAxis:c.crossAxis||0,alignmentAxis:c.alignmentAxis};return a&&"number"==typeof w&&(g="end"===a?-1*w:w),f?{x:g*u,y:m*s}:{x:m*s,y:g*u}}function C(){return"undefined"!=typeof window}function O(t){return H(t)?(t.nodeName||"").toLowerCase():"#document"}function P(t){var e;return(null==t||null==(e=t.ownerDocument)?void 0:e.defaultView)||window}function k(t){var e;return null==(e=(H(t)?t.ownerDocument:t.document)||window.document)?void 0:e.documentElement}function H(t){return!!C()&&(t instanceof Node||t instanceof P(t).Node)}function D(t){return!!C()&&(t instanceof Element||t instanceof P(t).Element)}function W(t){return!!C()&&(t instanceof HTMLElement||t instanceof P(t).HTMLElement)}function j(t){return!!C()&&"undefined"!=typeof ShadowRoot&&(t instanceof ShadowRoot||t instanceof P(t).ShadowRoot)}function F(t){let{overflow:e,overflowX:n,overflowY:r,display:i}=z(t);return/auto|scroll|overlay|hidden|clip/.test(e+r+n)&&!["inline","contents"].includes(i)}function V(t){return[":popover-open",":modal"].some(e=>{try{return t.matches(e)}catch(t){return!1}})}function $(t){let e=M(),n=D(t)?z(t):t;return["transform","translate","scale","rotate","perspective"].some(t=>!!n[t]&&"none"!==n[t])||!!n.containerType&&"normal"!==n.containerType||!e&&!!n.backdropFilter&&"none"!==n.backdropFilter||!e&&!!n.filter&&"none"!==n.filter||["transform","translate","scale","rotate","perspective","filter"].some(t=>(n.willChange||"").includes(t))||["paint","layout","strict","content"].some(t=>(n.contain||"").includes(t))}function M(){return"undefined"!=typeof CSS&&!!CSS.supports&&CSS.supports("-webkit-backdrop-filter","none")}function N(t){return["html","body","#document"].includes(O(t))}function z(t){return P(t).getComputedStyle(t)}function B(t){return D(t)?{scrollLeft:t.scrollLeft,scrollTop:t.scrollTop}:{scrollLeft:t.scrollX,scrollTop:t.scrollY}}function _(t){if("html"===O(t))return t;let e=t.assignedSlot||t.parentNode||j(t)&&t.host||k(t);return j(e)?e.host:e}function Y(t,e,n){var r;void 0===e&&(e=[]),void 0===n&&(n=!0);let i=function t(e){let n=_(e);return N(n)?e.ownerDocument?e.ownerDocument.body:e.body:W(n)&&F(n)?n:t(n)}(t),o=i===(null==(r=t.ownerDocument)?void 0:r.body),l=P(i);if(o){let t=I(l);return e.concat(l,l.visualViewport||[],F(i)?i:[],t&&n?Y(t):[])}return e.concat(i,Y(i,[],n))}function I(t){return t.parent&&Object.getPrototypeOf(t.parent)?t.frameElement:null}function X(t){let e=z(t),n=parseFloat(e.width)||0,r=parseFloat(e.height)||0,i=W(t),o=i?t.offsetWidth:n,l=i?t.offsetHeight:r,f=a(n)!==o||a(r)!==l;return f&&(n=o,r=l),{width:n,height:r,$:f}}function q(t){return D(t)?t:t.contextElement}function G(t){let e=q(t);if(!W(e))return s(1);let n=e.getBoundingClientRect(),{width:r,height:i,$:o}=X(e),l=(o?a(n.width):n.width)/r,f=(o?a(n.height):n.height)/i;return l&&Number.isFinite(l)||(l=1),f&&Number.isFinite(f)||(f=1),{x:l,y:f}}let J=s(0);function K(t){let e=P(t);return M()&&e.visualViewport?{x:e.visualViewport.offsetLeft,y:e.visualViewport.offsetTop}:J}function Q(t,e,n,r){var i;void 0===e&&(e=!1),void 0===n&&(n=!1);let o=t.getBoundingClientRect(),l=q(t),a=s(1);e&&(r?D(r)&&(a=G(r)):a=G(t));let f=(void 0===(i=n)&&(i=!1),r&&(!i||r===P(l))&&i)?K(l):s(0),u=(o.left+f.x)/a.x,c=(o.top+f.y)/a.y,d=o.width/a.x,p=o.height/a.y;if(l){let t=P(l),e=r&&D(r)?P(r):r,n=t,i=I(n);for(;i&&r&&e!==n;){let t=G(i),e=i.getBoundingClientRect(),r=z(i),o=e.left+(i.clientLeft+parseFloat(r.paddingLeft))*t.x,l=e.top+(i.clientTop+parseFloat(r.paddingTop))*t.y;u*=t.x,c*=t.y,d*=t.x,p*=t.y,u+=o,c+=l,i=I(n=P(i))}}return b({width:d,height:p,x:u,y:c})}function U(t,e){let n=B(t).scrollLeft;return e?e.left+n:Q(k(t)).left+n}function Z(t,e,n){void 0===n&&(n=!1);let r=t.getBoundingClientRect(),i=r.left+e.scrollLeft-(n?0:U(t,r)),o=r.top+e.scrollTop;return{x:i,y:o}}function tt(t,e,n){let r;if("viewport"===e)r=function(t,e){let n=P(t),r=k(t),i=n.visualViewport,o=r.clientWidth,l=r.clientHeight,a=0,f=0;if(i){o=i.width,l=i.height;let t=M();(!t||t&&"fixed"===e)&&(a=i.offsetLeft,f=i.offsetTop)}return{width:o,height:l,x:a,y:f}}(t,n);else if("document"===e)r=function(t){let e=k(t),n=B(t),r=t.ownerDocument.body,i=l(e.scrollWidth,e.clientWidth,r.scrollWidth,r.clientWidth),o=l(e.scrollHeight,e.clientHeight,r.scrollHeight,r.clientHeight),a=-n.scrollLeft+U(t),f=-n.scrollTop;return"rtl"===z(r).direction&&(a+=l(e.clientWidth,r.clientWidth)-i),{width:i,height:o,x:a,y:f}}(k(t));else if(D(e))r=function(t,e){let n=Q(t,!0,"fixed"===e),r=n.top+t.clientTop,i=n.left+t.clientLeft,o=W(t)?G(t):s(1),l=t.clientWidth*o.x,a=t.clientHeight*o.y,f=i*o.x,u=r*o.y;return{width:l,height:a,x:f,y:u}}(e,n);else{let n=K(t);r={x:e.x-n.x,y:e.y-n.y,width:e.width,height:e.height}}return b(r)}function te(t){return"static"===z(t).position}function tn(t,e){if(!W(t)||"fixed"===z(t).position)return null;if(e)return e(t);let n=t.offsetParent;return k(t)===n&&(n=n.ownerDocument.body),n}function tr(t,e){let n=P(t);if(V(t))return n;if(!W(t)){let e=_(t);for(;e&&!N(e);){if(D(e)&&!te(e))return e;e=_(e)}return n}let r=tn(t,e);for(;r&&["table","td","th"].includes(O(r))&&te(r);)r=tn(r,e);return r&&N(r)&&te(r)&&!$(r)?n:r||function(t){let e=_(t);for(;W(e)&&!N(e);){if($(e))return e;if(V(e))break;e=_(e)}return null}(t)||n}let ti=async function(t){let e=this.getOffsetParent||tr,n=this.getDimensions,r=await n(t.floating);return{reference:function(t,e,n){let r=W(e),i=k(e),o="fixed"===n,l=Q(t,!0,o,e),a={scrollLeft:0,scrollTop:0},f=s(0);if(r||!r&&!o){if(("body"!==O(e)||F(i))&&(a=B(e)),r){let t=Q(e,!0,o,e);f.x=t.x+e.clientLeft,f.y=t.y+e.clientTop}else i&&(f.x=U(i))}let u=!i||r||o?s(0):Z(i,a),c=l.left+a.scrollLeft-f.x-u.x,d=l.top+a.scrollTop-f.y-u.y;return{x:c,y:d,width:l.width,height:l.height}}(t.reference,await e(t.floating),t.strategy),floating:{x:0,y:0,width:r.width,height:r.height}}},to={convertOffsetParentRelativeRectToViewportRelativeRect:function(t){let{elements:e,rect:n,offsetParent:r,strategy:i}=t,o="fixed"===i,l=k(r),a=!!e&&V(e.floating);if(r===l||a&&o)return n;let f={scrollLeft:0,scrollTop:0},u=s(1),c=s(0),d=W(r);if((d||!d&&!o)&&(("body"!==O(r)||F(l))&&(f=B(r)),W(r))){let t=Q(r);u=G(r),c.x=t.x+r.clientLeft,c.y=t.y+r.clientTop}let p=!l||d||o?s(0):Z(l,f,!0);return{width:n.width*u.x,height:n.height*u.y,x:n.x*u.x-f.scrollLeft*u.x+c.x+p.x,y:n.y*u.y-f.scrollTop*u.y+c.y+p.y}},getDocumentElement:k,getClippingRect:function(t){let{element:e,boundary:n,rootBoundary:r,strategy:i}=t,a="clippingAncestors"===n?V(e)?[]:function(t,e){let n=e.get(t);if(n)return n;let r=Y(t,[],!1).filter(t=>D(t)&&"body"!==O(t)),i=null,o="fixed"===z(t).position,l=o?_(t):t;for(;D(l)&&!N(l);){let e=z(l),n=$(l);n||"fixed"!==e.position||(i=null);let a=o?!n&&!i:!n&&"static"===e.position&&!!i&&["absolute","fixed"].includes(i.position)||F(l)&&!n&&function t(e,n){let r=_(e);return!(r===n||!D(r)||N(r))&&("fixed"===z(r).position||t(r,n))}(t,l);a?r=r.filter(t=>t!==l):i=e,l=_(l)}return e.set(t,r),r}(e,this._c):[].concat(n),f=[...a,r],s=f[0],u=f.reduce((t,n)=>{let r=tt(e,n,i);return t.top=l(r.top,t.top),t.right=o(r.right,t.right),t.bottom=o(r.bottom,t.bottom),t.left=l(r.left,t.left),t},tt(e,s,i));return{width:u.right-u.left,height:u.bottom-u.top,x:u.left,y:u.top}},getOffsetParent:tr,getElementRects:ti,getClientRects:function(t){return Array.from(t.getClientRects())},getDimensions:function(t){let{width:e,height:n}=X(t);return{width:e,height:n}},getScale:G,isElement:D,isRTL:function(t){return"rtl"===z(t).direction}};function tl(t,e){return t.x===e.x&&t.y===e.y&&t.width===e.width&&t.height===e.height}let ta=t=>({name:"arrow",options:t,async fn(e){let{x:n,y:r,placement:i,rects:a,platform:f,elements:s,middlewareData:u}=e,{element:c,padding:p=0}=d(t,e)||{};if(null==c)return{};let w=v(p),x={x:n,y:r},b=m(y(i)),R=g(b),A=await f.getDimensions(c),T="y"===b,E=T?"clientHeight":"clientWidth",L=a.reference[R]+a.reference[b]-x[b]-a.floating[R],S=x[b]-a.reference[b],C=await (null==f.getOffsetParent?void 0:f.getOffsetParent(c)),O=C?C[E]:0;O&&await (null==f.isElement?void 0:f.isElement(C))||(O=s.floating[E]||a.floating[R]);let P=O/2-A[R]/2-1,k=o(w[T?"top":"left"],P),H=o(w[T?"bottom":"right"],P),D=O-A[R]-H,W=O/2-A[R]/2+(L/2-S/2),j=l(k,o(W,D)),F=!u.arrow&&null!=h(i)&&W!==j&&a.reference[R]/2-(W<k?k:H)-A[R]/2<0,V=F?W<k?W-k:W-D:0;return{[b]:x[b]+V,data:{[b]:j,centerOffset:W-j-V,...F&&{alignmentOffset:V}},reset:F}}}),tf=(t,e,n)=>{let r=new Map,i={platform:to,...n},o={...i.platform,_c:r};return A(t,e,{...i,platform:o})};var ts=n(4887),tu="undefined"!=typeof document?r.useLayoutEffect:r.useEffect;function tc(t,e){let n,r,i;if(t===e)return!0;if(typeof t!=typeof e)return!1;if("function"==typeof t&&t.toString()===e.toString())return!0;if(t&&e&&"object"==typeof t){if(Array.isArray(t)){if((n=t.length)!==e.length)return!1;for(r=n;0!=r--;)if(!tc(t[r],e[r]))return!1;return!0}if((n=(i=Object.keys(t)).length)!==Object.keys(e).length)return!1;for(r=n;0!=r--;)if(!({}).hasOwnProperty.call(e,i[r]))return!1;for(r=n;0!=r--;){let n=i[r];if(("_owner"!==n||!t.$$typeof)&&!tc(t[n],e[n]))return!1}return!0}return t!=t&&e!=e}function td(t){if("undefined"==typeof window)return 1;let e=t.ownerDocument.defaultView||window;return e.devicePixelRatio||1}function tp(t,e){let n=td(t);return Math.round(e*n)/n}function th(t){let e=r.useRef(t);return tu(()=>{e.current=t}),e}let tm=t=>({name:"arrow",options:t,fn(e){let{element:n,padding:r}="function"==typeof t?t(e):t;return n&&({}).hasOwnProperty.call(n,"current")?null!=n.current?ta({element:n.current,padding:r}).fn(e):{}:n?ta({element:n,padding:r}).fn(e):{}}}),tg=(t,e)=>{var n;return{...(void 0===(n=t)&&(n=0),{name:"offset",options:n,async fn(t){var e,r;let{x:i,y:o,placement:l,middlewareData:a}=t,f=await S(t,n);return l===(null==(e=a.offset)?void 0:e.placement)&&null!=(r=a.arrow)&&r.alignmentOffset?{}:{x:i+f.x,y:o+f.y,data:{...f,placement:l}}}}),options:[t,e]}},ty=(t,e)=>{var n;return{...(void 0===(n=t)&&(n={}),{name:"shift",options:n,async fn(t){let{x:e,y:r,placement:i}=t,{mainAxis:a=!0,crossAxis:f=!1,limiter:s={fn:t=>{let{x:e,y:n}=t;return{x:e,y:n}}},...u}=d(n,t),c={x:e,y:r},h=await T(t,u),g=y(p(i)),w=m(g),x=c[w],v=c[g];if(a){let t=x+h["y"===w?"top":"left"],e=x-h["y"===w?"bottom":"right"];x=l(t,o(x,e))}if(f){let t="y"===g?"top":"left",e="y"===g?"bottom":"right",n=v+h[t],r=v-h[e];v=l(n,o(v,r))}let b=s.fn({...t,[w]:x,[g]:v});return{...b,data:{x:b.x-e,y:b.y-r,enabled:{[w]:a,[g]:f}}}}}),options:[t,e]}},tw=(t,e)=>{var n;return{...(void 0===(n=t)&&(n={}),{options:n,fn(t){let{x:e,y:r,placement:i,rects:o,middlewareData:l}=t,{offset:a=0,mainAxis:f=!0,crossAxis:s=!0}=d(n,t),u={x:e,y:r},c=y(i),h=m(c),g=u[h],w=u[c],x=d(a,t),v="number"==typeof x?{mainAxis:x,crossAxis:0}:{mainAxis:0,crossAxis:0,...x};if(f){let t="y"===h?"height":"width",e=o.reference[h]-o.floating[t]+v.mainAxis,n=o.reference[h]+o.reference[t]-v.mainAxis;g<e?g=e:g>n&&(g=n)}if(s){var b,R;let t="y"===h?"width":"height",e=["top","left"].includes(p(i)),n=o.reference[c]-o.floating[t]+(e&&(null==(b=l.offset)?void 0:b[c])||0)+(e?0:v.crossAxis),r=o.reference[c]+o.reference[t]+(e?0:(null==(R=l.offset)?void 0:R[c])||0)-(e?v.crossAxis:0);w<n?w=n:w>r&&(w=r)}return{[h]:g,[c]:w}}}),options:[t,e]}},tx=(t,e)=>{var n;return{...(void 0===(n=t)&&(n={}),{name:"flip",options:n,async fn(t){var e,r,i,o,l;let{placement:a,middlewareData:f,rects:s,initialPlacement:u,platform:c,elements:v}=t,{mainAxis:b=!0,crossAxis:R=!0,fallbackPlacements:A,fallbackStrategy:E="bestFit",fallbackAxisSideDirection:L="none",flipAlignment:S=!0,...C}=d(n,t);if(null!=(e=f.arrow)&&e.alignmentOffset)return{};let O=p(a),P=y(u),k=p(u)===u,H=await (null==c.isRTL?void 0:c.isRTL(v.floating)),D=A||(k||!S?[x(u)]:function(t){let e=x(t);return[w(t),e,w(e)]}(u)),W="none"!==L;!A&&W&&D.push(...function(t,e,n,r){let i=h(t),o=function(t,e,n){let r=["left","right"],i=["right","left"];switch(t){case"top":case"bottom":if(n)return e?i:r;return e?r:i;case"left":case"right":return e?["top","bottom"]:["bottom","top"];default:return[]}}(p(t),"start"===n,r);return i&&(o=o.map(t=>t+"-"+i),e&&(o=o.concat(o.map(w)))),o}(u,S,L,H));let j=[u,...D],F=await T(t,C),V=[],$=(null==(r=f.flip)?void 0:r.overflows)||[];if(b&&V.push(F[O]),R){let t=function(t,e,n){void 0===n&&(n=!1);let r=h(t),i=m(y(t)),o=g(i),l="x"===i?r===(n?"end":"start")?"right":"left":"start"===r?"bottom":"top";return e.reference[o]>e.floating[o]&&(l=x(l)),[l,x(l)]}(a,s,H);V.push(F[t[0]],F[t[1]])}if($=[...$,{placement:a,overflows:V}],!V.every(t=>t<=0)){let t=((null==(i=f.flip)?void 0:i.index)||0)+1,e=j[t];if(e)return{data:{index:t,overflows:$},reset:{placement:e}};let n=null==(o=$.filter(t=>t.overflows[0]<=0).sort((t,e)=>t.overflows[1]-e.overflows[1])[0])?void 0:o.placement;if(!n)switch(E){case"bestFit":{let t=null==(l=$.filter(t=>{if(W){let e=y(t.placement);return e===P||"y"===e}return!0}).map(t=>[t.placement,t.overflows.filter(t=>t>0).reduce((t,e)=>t+e,0)]).sort((t,e)=>t[1]-e[1])[0])?void 0:l[0];t&&(n=t);break}case"initialPlacement":n=u}if(a!==n)return{reset:{placement:n}}}return{}}}),options:[t,e]}},tv=(t,e)=>{var n;return{...(void 0===(n=t)&&(n={}),{name:"size",options:n,async fn(t){var e,r;let i,a;let{placement:f,rects:s,platform:u,elements:c}=t,{apply:m=()=>{},...g}=d(n,t),w=await T(t,g),x=p(f),v=h(f),b="y"===y(f),{width:R,height:A}=s.floating;"top"===x||"bottom"===x?(i=x,a=v===(await (null==u.isRTL?void 0:u.isRTL(c.floating))?"start":"end")?"left":"right"):(a=x,i="end"===v?"top":"bottom");let E=A-w.top-w.bottom,L=R-w.left-w.right,S=o(A-w[i],E),C=o(R-w[a],L),O=!t.middlewareData.shift,P=S,k=C;if(null!=(e=t.middlewareData.shift)&&e.enabled.x&&(k=L),null!=(r=t.middlewareData.shift)&&r.enabled.y&&(P=E),O&&!v){let t=l(w.left,0),e=l(w.right,0),n=l(w.top,0),r=l(w.bottom,0);b?k=R-2*(0!==t||0!==e?t+e:l(w.left,w.right)):P=A-2*(0!==n||0!==r?n+r:l(w.top,w.bottom))}await m({...t,availableWidth:k,availableHeight:P});let H=await u.getDimensions(c.floating);return R!==H.width||A!==H.height?{reset:{rects:!0}}:{}}}),options:[t,e]}},tb=(t,e)=>{var n;return{...(void 0===(n=t)&&(n={}),{name:"hide",options:n,async fn(t){let{rects:e}=t,{strategy:r="referenceHidden",...i}=d(n,t);switch(r){case"referenceHidden":{let n=await T(t,{...i,elementContext:"reference"}),r=E(n,e.reference);return{data:{referenceHiddenOffsets:r,referenceHidden:L(r)}}}case"escaped":{let n=await T(t,{...i,altBoundary:!0}),r=E(n,e.floating);return{data:{escapedOffsets:r,escaped:L(r)}}}default:return{}}}}),options:[t,e]}},tR=(t,e)=>({...tm(t),options:[t,e]});var tA=n(9381),tT=n(7437),tE=r.forwardRef((t,e)=>{let{children:n,width:r=10,height:i=5,...o}=t;return(0,tT.jsx)(tA.WV.svg,{...o,ref:e,width:r,height:i,viewBox:"0 0 30 10",preserveAspectRatio:"none",children:t.asChild?n:(0,tT.jsx)("polygon",{points:"0,0 30,0 15,10"})})});tE.displayName="Arrow";var tL=n(2210),tS=n(6989),tC=n(6459),tO=n(1030),tP=n(4977),tk="Popper",[tH,tD]=(0,tS.b)(tk),[tW,tj]=tH(tk),tF=t=>{let{__scopePopper:e,children:n}=t,[i,o]=r.useState(null);return(0,tT.jsx)(tW,{scope:e,anchor:i,onAnchorChange:o,children:n})};tF.displayName=tk;var tV="PopperAnchor",t$=r.forwardRef((t,e)=>{let{__scopePopper:n,virtualRef:i,...o}=t,l=tj(tV,n),a=r.useRef(null),f=(0,tL.e)(e,a);return r.useEffect(()=>{l.onAnchorChange(i?.current||a.current)}),i?null:(0,tT.jsx)(tA.WV.div,{...o,ref:f})});t$.displayName=tV;var tM="PopperContent",[tN,tz]=tH(tM),tB=r.forwardRef((t,e)=>{let{__scopePopper:n,side:i="bottom",sideOffset:a=0,align:s="center",alignOffset:u=0,arrowPadding:c=0,avoidCollisions:d=!0,collisionBoundary:p=[],collisionPadding:h=0,sticky:m="partial",hideWhenDetached:g=!1,updatePositionStrategy:y="optimized",onPlaced:w,...x}=t,v=tj(tM,n),[b,R]=r.useState(null),A=(0,tL.e)(e,t=>R(t)),[T,E]=r.useState(null),L=(0,tP.t)(T),S=L?.width??0,C=L?.height??0,O="number"==typeof h?h:{top:0,right:0,bottom:0,left:0,...h},P=Array.isArray(p)?p:[p],H=P.length>0,D={padding:O,boundary:P.filter(tX),altBoundary:H},{refs:W,floatingStyles:j,placement:F,isPositioned:V,middlewareData:$}=function(t){void 0===t&&(t={});let{placement:e="bottom",strategy:n="absolute",middleware:i=[],platform:o,elements:{reference:l,floating:a}={},transform:f=!0,whileElementsMounted:s,open:u}=t,[c,d]=r.useState({x:0,y:0,strategy:n,placement:e,middlewareData:{},isPositioned:!1}),[p,h]=r.useState(i);tc(p,i)||h(i);let[m,g]=r.useState(null),[y,w]=r.useState(null),x=r.useCallback(t=>{t!==A.current&&(A.current=t,g(t))},[]),v=r.useCallback(t=>{t!==T.current&&(T.current=t,w(t))},[]),b=l||m,R=a||y,A=r.useRef(null),T=r.useRef(null),E=r.useRef(c),L=null!=s,S=th(s),C=th(o),O=th(u),P=r.useCallback(()=>{if(!A.current||!T.current)return;let t={placement:e,strategy:n,middleware:p};C.current&&(t.platform=C.current),tf(A.current,T.current,t).then(t=>{let e={...t,isPositioned:!1!==O.current};k.current&&!tc(E.current,e)&&(E.current=e,ts.flushSync(()=>{d(e)}))})},[p,e,n,C,O]);tu(()=>{!1===u&&E.current.isPositioned&&(E.current.isPositioned=!1,d(t=>({...t,isPositioned:!1})))},[u]);let k=r.useRef(!1);tu(()=>(k.current=!0,()=>{k.current=!1}),[]),tu(()=>{if(b&&(A.current=b),R&&(T.current=R),b&&R){if(S.current)return S.current(b,R,P);P()}},[b,R,P,S,L]);let H=r.useMemo(()=>({reference:A,floating:T,setReference:x,setFloating:v}),[x,v]),D=r.useMemo(()=>({reference:b,floating:R}),[b,R]),W=r.useMemo(()=>{let t={position:n,left:0,top:0};if(!D.floating)return t;let e=tp(D.floating,c.x),r=tp(D.floating,c.y);return f?{...t,transform:"translate("+e+"px, "+r+"px)",...td(D.floating)>=1.5&&{willChange:"transform"}}:{position:n,left:e,top:r}},[n,f,D.floating,c.x,c.y]);return r.useMemo(()=>({...c,update:P,refs:H,elements:D,floatingStyles:W}),[c,P,H,D,W])}({strategy:"fixed",placement:i+("center"!==s?"-"+s:""),whileElementsMounted:(...t)=>{let e=function(t,e,n,r){let i;void 0===r&&(r={});let{ancestorScroll:a=!0,ancestorResize:s=!0,elementResize:u="function"==typeof ResizeObserver,layoutShift:c="function"==typeof IntersectionObserver,animationFrame:d=!1}=r,p=q(t),h=a||s?[...p?Y(p):[],...Y(e)]:[];h.forEach(t=>{a&&t.addEventListener("scroll",n,{passive:!0}),s&&t.addEventListener("resize",n)});let m=p&&c?function(t,e){let n,r=null,i=k(t);function a(){var t;clearTimeout(n),null==(t=r)||t.disconnect(),r=null}return!function s(u,c){void 0===u&&(u=!1),void 0===c&&(c=1),a();let d=t.getBoundingClientRect(),{left:p,top:h,width:m,height:g}=d;if(u||e(),!m||!g)return;let y=f(h),w=f(i.clientWidth-(p+m)),x=f(i.clientHeight-(h+g)),v=f(p),b={rootMargin:-y+"px "+-w+"px "+-x+"px "+-v+"px",threshold:l(0,o(1,c))||1},R=!0;function A(e){let r=e[0].intersectionRatio;if(r!==c){if(!R)return s();r?s(!1,r):n=setTimeout(()=>{s(!1,1e-7)},1e3)}1!==r||tl(d,t.getBoundingClientRect())||s(),R=!1}try{r=new IntersectionObserver(A,{...b,root:i.ownerDocument})}catch(t){r=new IntersectionObserver(A,b)}r.observe(t)}(!0),a}(p,n):null,g=-1,y=null;u&&(y=new ResizeObserver(t=>{let[r]=t;r&&r.target===p&&y&&(y.unobserve(e),cancelAnimationFrame(g),g=requestAnimationFrame(()=>{var t;null==(t=y)||t.observe(e)})),n()}),p&&!d&&y.observe(p),y.observe(e));let w=d?Q(t):null;return d&&function e(){let r=Q(t);w&&!tl(w,r)&&n(),w=r,i=requestAnimationFrame(e)}(),n(),()=>{var t;h.forEach(t=>{a&&t.removeEventListener("scroll",n),s&&t.removeEventListener("resize",n)}),null==m||m(),null==(t=y)||t.disconnect(),y=null,d&&cancelAnimationFrame(i)}}(...t,{animationFrame:"always"===y});return e},elements:{reference:v.anchor},middleware:[tg({mainAxis:a+C,alignmentAxis:u}),d&&ty({mainAxis:!0,crossAxis:!1,limiter:"partial"===m?tw():void 0,...D}),d&&tx({...D}),tv({...D,apply:({elements:t,rects:e,availableWidth:n,availableHeight:r})=>{let{width:i,height:o}=e.reference,l=t.floating.style;l.setProperty("--radix-popper-available-width",`${n}px`),l.setProperty("--radix-popper-available-height",`${r}px`),l.setProperty("--radix-popper-anchor-width",`${i}px`),l.setProperty("--radix-popper-anchor-height",`${o}px`)}}),T&&tR({element:T,padding:c}),tq({arrowWidth:S,arrowHeight:C}),g&&tb({strategy:"referenceHidden",...D})]}),[M,N]=tG(F),z=(0,tC.W)(w);(0,tO.b)(()=>{V&&z?.()},[V,z]);let B=$.arrow?.x,_=$.arrow?.y,I=$.arrow?.centerOffset!==0,[X,G]=r.useState();return(0,tO.b)(()=>{b&&G(window.getComputedStyle(b).zIndex)},[b]),(0,tT.jsx)("div",{ref:W.setFloating,"data-radix-popper-content-wrapper":"",style:{...j,transform:V?j.transform:"translate(0, -200%)",minWidth:"max-content",zIndex:X,"--radix-popper-transform-origin":[$.transformOrigin?.x,$.transformOrigin?.y].join(" "),...$.hide?.referenceHidden&&{visibility:"hidden",pointerEvents:"none"}},dir:t.dir,children:(0,tT.jsx)(tN,{scope:n,placedSide:M,onArrowChange:E,arrowX:B,arrowY:_,shouldHideArrow:I,children:(0,tT.jsx)(tA.WV.div,{"data-side":M,"data-align":N,...x,ref:A,style:{...x.style,animation:V?void 0:"none"}})})})});tB.displayName=tM;var t_="PopperArrow",tY={top:"bottom",right:"left",bottom:"top",left:"right"},tI=r.forwardRef(function(t,e){let{__scopePopper:n,...r}=t,i=tz(t_,n),o=tY[i.placedSide];return(0,tT.jsx)("span",{ref:i.onArrowChange,style:{position:"absolute",left:i.arrowX,top:i.arrowY,[o]:0,transformOrigin:{top:"",right:"0 0",bottom:"center 0",left:"100% 0"}[i.placedSide],transform:{top:"translateY(100%)",right:"translateY(50%) rotate(90deg) translateX(-50%)",bottom:"rotate(180deg)",left:"translateY(50%) rotate(-90deg) translateX(50%)"}[i.placedSide],visibility:i.shouldHideArrow?"hidden":void 0},children:(0,tT.jsx)(tE,{...r,ref:e,style:{...r.style,display:"block"}})})});function tX(t){return null!==t}tI.displayName=t_;var tq=t=>({name:"transformOrigin",options:t,fn(e){let{placement:n,rects:r,middlewareData:i}=e,o=i.arrow?.centerOffset!==0,l=o?0:t.arrowWidth,a=o?0:t.arrowHeight,[f,s]=tG(n),u={start:"0%",center:"50%",end:"100%"}[s],c=(i.arrow?.x??0)+l/2,d=(i.arrow?.y??0)+a/2,p="",h="";return"bottom"===f?(p=o?u:`${c}px`,h=`${-a}px`):"top"===f?(p=o?u:`${c}px`,h=`${r.floating.height+a}px`):"right"===f?(p=`${-a}px`,h=o?u:`${d}px`):"left"===f&&(p=`${r.floating.width+a}px`,h=o?u:`${d}px`),{data:{x:p,y:h}}}});function tG(t){let[e,n="center"]=t.split("-");return[e,n]}var tJ=tF,tK=t$,tQ=tB,tU=tI},4977:function(t,e,n){n.d(e,{t:function(){return o}});var r=n(2265),i=n(1030);function o(t){let[e,n]=r.useState(void 0);return(0,i.b)(()=>{if(t){n({width:t.offsetWidth,height:t.offsetHeight});let e=new ResizeObserver(e=>{let r,i;if(!Array.isArray(e)||!e.length)return;let o=e[0];if("borderBoxSize"in o){let t=o.borderBoxSize,e=Array.isArray(t)?t[0]:t;r=e.inlineSize,i=e.blockSize}else r=t.offsetWidth,i=t.offsetHeight;n({width:r,height:i})});return e.observe(t,{box:"border-box"}),()=>e.unobserve(t)}n(void 0)},[t]),e}},8281:function(t,e,n){n.d(e,{T:function(){return l},f:function(){return a}});var r=n(2265),i=n(9381),o=n(7437),l=r.forwardRef((t,e)=>(0,o.jsx)(i.WV.span,{...t,ref:e,style:{position:"absolute",border:0,width:1,height:1,padding:0,margin:-1,overflow:"hidden",clip:"rect(0, 0, 0, 0)",whiteSpace:"nowrap",wordWrap:"normal",...t.style}}));l.displayName="VisuallyHidden";var a=l}}]);