(this["webpackJsonpedit.volt.link"]=this["webpackJsonpedit.volt.link"]||[]).push([[4],{143:function(e,t,n){},154:function(e,t,n){var a={"./de.ftl":[173,12],"./en.ftl":[174,13]};function r(e){if(!n.o(a,e))return Promise.resolve().then((function(){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}));var t=a[e],r=t[0];return n.e(t[1]).then((function(){return n(r)}))}r.keys=function(){return Object.keys(a)},r.id=154,e.exports=r},155:function(e,t,n){"use strict";n.r(t);var a=n(14),r=n(7),c=n(0),o=n.n(c),i=n(118),s=(n(143),n(43)),u=n.n(s),l=n(95),b=n.n(l),d=n(10),j=n(66),f=n(105),p=n(4),h=Object(c.lazy)((function(){return Promise.all([n.e(0),n.e(3),n.e(2),n.e(10)]).then(n.bind(null,413))})),O=Object(c.lazy)((function(){return Promise.all([n.e(0),n.e(3),n.e(1),n.e(8),n.e(7)]).then(n.bind(null,468))}));var v=function(){var e=Object(d.f)("/"),t=Object(d.e)(),n=Object(c.useState)({}),a=Object(r.a)(n,2),o=a[0],i=a[1];Object(c.useEffect)((function(){var e=t.pathname.match(/^\/([^=/]*)(?:=?)([^=/]*)(.*)/),n=e[1],a=e[2],r=e[3];!a&&n&&(a=n),""!==a&&"/edit"!==r&&"/view"!==r&&(r="/view");var c="/".concat(a).concat(r);o.pathname!==c&&i({pathname:c})}),[t,o,i]);var s="VoltLink",u="VoltLink is an information-hub about Volt Europa.";return Object(p.jsx)(p.Fragment,{children:Object(p.jsx)("div",{className:"".concat(b.a.app," ").concat(e?b.a.isStartpage:""),children:Object(p.jsxs)(j.d,{children:[e?null:Object(p.jsx)(j.b,{}),Object(p.jsx)(j.a,{children:Object(p.jsxs)(d.c,{location:o,children:[Object(p.jsx)(d.a,{path:"/:id/view",element:Object(p.jsx)(c.Suspense,{children:Object(p.jsx)(h,{})})}),Object(p.jsx)(d.a,{path:"/:id/edit",element:Object(p.jsx)(c.Suspense,{children:Object(p.jsx)(O,{})})}),Object(p.jsx)(d.a,{path:"/",element:Object(p.jsxs)(p.Fragment,{children:[Object(p.jsxs)(f.a,{children:[Object(p.jsx)("title",{children:s}),Object(p.jsx)("meta",{name:"title",content:s}),Object(p.jsx)("meta",{name:"og:title",content:s}),Object(p.jsx)("meta",{name:"twitter:title",content:s}),Object(p.jsx)("meta",{name:"description",content:u}),Object(p.jsx)("meta",{name:"og:description",content:u}),Object(p.jsx)("meta",{name:"twitter:description",content:u})]}),Object(p.jsx)(j.c,{})]})})]})})]})})})},x=n(77),m=(n(149),n(12)),w=n(39),g=n(22),k=n.n(g),_=n(83),y=n(76),S=n(102),L={de:"Deutsch",en:"English",fr:"Fran\xe7ais"},E=Object.keys(L),P="en";function C(e){return z.apply(this,arguments)}function z(){return(z=Object(w.a)(k.a.mark((function e(t){var a,r,c;return k.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,n(154)("./"+t+".ftl");case 2:return a=e.sent,e.next=5,fetch(a.default);case 5:return r=e.sent,e.next=8,r.text();case 8:return c=e.sent,e.abrupt("return",Object(m.a)({},t,new y.b(c)));case 10:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function A(e){return D.apply(this,arguments)}function D(){return(D=Object(w.a)(k.a.mark((function e(t){var n,r;return k.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Promise.all(t.map(C));case 2:return n=e.sent,r=n.reduce((function(e,t){return Object.assign(e,t)})),e.abrupt("return",k.a.mark((function e(){var n,c,o,i;return k.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:n=Object(a.a)(t),e.prev=1,n.s();case 3:if((c=n.n()).done){e.next=11;break}return o=c.value,(i=new y.a(o)).addResource(r[o]),e.next=9,i;case 9:e.next=3;break;case 11:e.next=16;break;case 13:e.prev=13,e.t0=e.catch(1),n.e(e.t0);case 16:return e.prev=16,n.f(),e.finish(16);case 19:case"end":return e.stop()}}),e,null,[[1,13,16,19]])})));case 5:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function B(e){var t=e.userLocales,n=e.children,a=e.onLocaleChange,o=Object(c.useState)(function(){var e=new y.a("");return e.addResource(new y.b("")),new _.c([e])}()),i=Object(r.a)(o,2),s=i[0],u=i[1];return Object(c.useEffect)((function(){function e(){return(e=Object(w.a)(k.a.mark((function e(){var n,r,c;return k.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=Object(S.negotiateLanguages)(t,E,{defaultLocale:P}),a&&a(n),e.next=4,A(n);case 4:r=e.sent,(c=new _.c(r())).userLocales=t,c.defaultLocale=P,c.supportedLocales=E,u(c);case 10:case"end":return e.stop()}}),e)})))).apply(this,arguments)}!function(){e.apply(this,arguments)}()}),[t,a]),s?Object(p.jsx)(_.a,{l10n:s,children:n}):Object(p.jsx)("div",{children:"Loading texts\u2026"})}var F=n(216),M=n(126),N=n(222),I=n(103),R=n(218),V=n(219),W=n(217);window.process={},window.env="prod",window.domains={frontend:"https://volt.link/",backend:"https://api.volt.link/"};var Q=new R.a({uri:window.domains.backend+"graphql/v1/",cache:new V.a,credentials:"include",defaultOptions:{watchQuery:{fetchPolicy:"no-cache",errorPolicy:"ignore"},query:{fetchPolicy:"no-cache",errorPolicy:"all"}}});function T(){var e=Object(c.useState)(navigator.languages),t=Object(r.a)(e,2),n=t[0],i=t[1],s=Object(c.useState)(null),l=Object(r.a)(s,2),b=l[0],d=l[1];Object(c.useEffect)((function(){if(window.umami){var e=navigator.languages;if(e||Array.isArray(e)){var t,n=Object(a.a)(e);try{for(n.s();!(t=n.n()).done;){var r=t.value,c=(r=r.toLowerCase()).split("-")[0];c!==r&&window.umami.trackEvent("L: "+c),window.umami.trackEvent("L: "+r)}}catch(o){n.e(o)}finally{n.f()}}}}),[]);var j=Object(c.useCallback)((function(e){i([e.target.dataset.locale])}),[i]),f=Object(c.useCallback)((function(e){d(e.length>0?e[0]:"")}),[d]),h=Object(F.a)("(prefers-color-scheme: dark)"),O=o.a.useMemo((function(){return Object(M.a)({palette:{mode:h?"dark":"light"}})}),[h]);return Object(p.jsxs)(p.Fragment,{children:[Object(p.jsx)("div",{id:"react-notification",style:{zIndex:"10000"}},"react-notification"),Object(p.jsx)(B,{userLocales:n,onLocaleChange:f,children:Object(p.jsx)(W.a,{client:Q,children:Object(p.jsx)(N.a,{theme:O,children:Object(p.jsx)(I.a,{anchorOrigin:{vertical:"bottom",horizontal:"right"},style:{minWidth:"unset"},classes:{variantSuccess:"".concat(u.a.snackbar," ").concat(u.a.success),variantError:"".concat(u.a.snackbar," ").concat(u.a.error),variantWarning:"".concat(u.a.snackbar," ").concat(u.a.warning),variantInfo:"".concat(u.a.snackbar," ").concat(u.a.info)},domRoot:document.getElementById("react-notification"),children:Object(p.jsx)(x.a,{children:Object(p.jsx)(v,{locales:L,currentLocale:b,onLanguageChange:j})})})})})},"AppLocalizationProvider")]})}var U=document.getElementById("root");Object(i.createRoot)(U).render(Object(p.jsx)(T,{}))},43:function(e,t,n){e.exports={snackbar:"Snackbar_snackbar__119_w",default:"Snackbar_default__31-eU",success:"Snackbar_success__zvTW8",error:"Snackbar_error__3XeD6",warning:"Snackbar_warning__2CBXt",info:"Snackbar_info__EuVSN"}},66:function(e,t,n){"use strict";n.d(t,"e",(function(){return f})),n.d(t,"d",(function(){return p})),n.d(t,"c",(function(){return O})),n.d(t,"b",(function(){return h})),n.d(t,"a",(function(){return v}));var a=n(12),r=n(7),c=n(0),o=n(221),i=n(10),s=function(e){var t=Object(c.useState)(!1),n=Object(r.a)(t,2),a=n[0],o=n[1];return Object(c.useEffect)((function(){var t=window.matchMedia(e);t.matches!==a&&o(t.matches);var n=function(){return o(t.matches)};return window.addEventListener("resize",n),function(){return window.removeEventListener("resize",n)}}),[a,e]),a},u=n(96),l=n.n(u),b=n(4),d=Object(c.lazy)((function(){return Promise.all([n.e(0),n.e(1),n.e(9),n.e(2),n.e(11)]).then(n.bind(null,477))})),j=Object(c.createContext)({});function f(){return Object(c.useContext)(j)}function p(e){var t=e.children,n=Object(c.useState)(!1),a=Object(r.a)(n,2),o=a[0],s=a[1],u=!Object(i.f)("/")&&o,l=Object(c.useCallback)((function(){s((function(e){return!e}))}),[s]);return Object(b.jsx)(j.Provider,{value:{open:u,setOpen:s,toggleSidebar:l},children:t})}function h(){var e=f(),t=e.open,n=e.toggleSidebar,r="undefined"!==typeof navigator&&/iPad|iPhone|iPod/.test(navigator.userAgent),i=s("(min-width: 960px)");return t?Object(b.jsx)(o.a,{variant:i?"permanent":"temporary",anchor:"left",open:t,onOpen:n,onClose:n,disableBackdropTransition:!r,disableDiscovery:r,sx:Object(a.a)({width:320,flexShrink:0},"& .MuiDrawer-paper",{width:320,boxSizing:"border-box",backgroundColor:"var(--background-contrast)",color:"var(--on-background)",border:"none"}),PaperProps:{sx:{background:"var(--background-contrast)",color:"var(--on-background)"}},children:Object(b.jsx)(c.Suspense,{children:Object(b.jsx)(O,{})})}):null}function O(){return Object(b.jsx)(c.Suspense,{children:Object(b.jsx)(d,{})})}function v(e){var t=e.children,n=f().open;return Object(b.jsx)("main",{className:"".concat(l.a.main," ").concat(n?l.a.open:""),style:{"--sidebarWidth":"320px"},children:t})}},95:function(e,t,n){e.exports={app:"App_app__3hbGO",isStartpage:"App_isStartpage__1Q6rs"}},96:function(e,t,n){e.exports={main:"Sidebar_main__1MCX5",open:"Sidebar_open__gnBQb"}}},[[155,5,6]]]);
//# sourceMappingURL=main.235a8e24.chunk.js.map