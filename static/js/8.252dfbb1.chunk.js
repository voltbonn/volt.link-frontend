(this["webpackJsonpedit.volt.link"]=this["webpackJsonpedit.volt.link"]||[]).push([[8,17],{471:function(e,t,n){"use strict";n.r(t);var c=n(5),a=n(6),r=n(0),i=n(232),s=n(98),o=n(472),l=n.n(o),u=n(473),b=n(1),j={_:"??",en:"English",de:"Deutsch (German)",es:"Espa\xf1ol (Spanish)",pt:"Portugu\xeas (Portuguese)",fr:"Fran\xe7ais (French)",it:"Italiano (Italian)",nl:"Dutch (Nederlands)",da:"Dansk (Danish)",sv:"Svenska (Swedish)",nb:"Norsk bokm\xe5l (Norwegian)",fi:"Suomi (Finish)",se:"Davvis\xe1megiella (Northern S\xe1mi)",lt:"Lietuvi\u0161kai (Lithuanian)",mt:"Malti (Maltese)",pl:"J\u0119zyk polski (Polish)",uk:"\u0443\u043a\u0440\u0430\u0457\u0301\u043d\u0441\u044c\u043a\u0430 \u043c\u043e\u0301\u0432\u0430 (Ukrainian)",ru:"\u0440\u0443\u0441\u0441\u043a\u0438\u0439 \u044f\u0437\u044b\u043a (Russian)",bg:"\u0431\u044a\u043b\u0433\u0430\u0440\u0441\u043a\u0438 \u0435\u0437\u0438\u043a (Bulgarian)",tr:"T\xfcrk\xe7e (Turkish)",ar:"\u0627\u064e\u0644\u0652\u0639\u064e\u0631\u064e\u0628\u0650\u064a\u064e\u0651\u0629 (Arabic)",el:"\u03b5\u03bb\u03bb\u03b7\u03bd\u03b9\u03ba\u03ac (Greek)",ro:"limba rom\xe2n\u0103 (Romanian)",sl:"sloven\u0161\u010dina (Slovenian)",cy:"Cymraeg (Welsh)"},d=Object.entries(j).map((function(e){var t=Object(a.a)(e,2);return{code:t[0],nativeName:t[1]}})),f=Object.keys(j);t.default=function(e){var t=e.defaultValue,n=e.onChange,o=e.options,O=void 0===o?f:o,p=e.style;null!==t&&void 0!==t&&""!==t&&!1!==j.hasOwnProperty(t)||(t=O.length>0?O[0]:"_");var h=Object(r.useState)(t),v=Object(a.a)(h,2),x=v[0],m=v[1],g=Object(r.useCallback)((function(e){m(e),"_"===e&&(e=null),n&&n(e)}),[m,n]);return Object(b.jsx)(s.a,{trigger:function(e,t){var n=t.isOpen;return Object(b.jsxs)("button",Object(c.a)(Object(c.a)({},e),{},{className:"default hasIcon",style:Object(c.a)({margin:"0",flexShrink:"0"},p),children:[Object(b.jsx)("span",{style:{width:"100%",textAlign:"start"},children:"_"===x?Object(b.jsx)(l.a,{path:u.d,className:"icon"}):x.toUpperCase()}),Object(b.jsx)("span",{style:{marginLeft:"var(--basis)",lineHeight:"1",verticalAlign:"text-top"},children:n?"\u25b4":"\u25be"})]}))},paperProps:{sx:{maxHeight:"300px"}},children:function(e){var t=e.close;return Object(b.jsx)("div",{style:{padding:"var(--basis_x2) 0"},children:d.filter((function(e){var t=e.code;return O.includes(t)})).map((function(e){var n=e.code,c=e.nativeName;return Object(b.jsx)(i.a,{onClick:function(){g(n),t()},className:"roundMenuItem",selected:n===x,children:"_"===n?c:"".concat(n.toUpperCase()," \u2014 ").concat(c)},n)}))})}})}},500:function(e,t,n){e.exports={content:"SidebarContent_content__RAi8X",header:"SidebarContent_header__1pYRG",headerBar:"SidebarContent_headerBar__2xkje",scrollContainer:"SidebarContent_scrollContainer__2eS9U",emoji:"SidebarContent_emoji__3twKX"}},504:function(e,t,n){e.exports={blockRow:"BlockTree_blockRow__80Vim",blockRowActions:"BlockTree_blockRowActions__GDOGf",fakeHover:"BlockTree_fakeHover__TKaWl"}},532:function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return je}));var c=n(5),a=n(15),r=n(19),i=n(6),s=n(8),o=n.n(s),l=n(0),u=n.n(l),b=n(500),j=n.n(b),d=n(371),f=n(232),O=n(229),p=n(231),h=n(349),v=n(525),x=n(499),m=n(454),g=n(526),k=n(506),y=n(527),_=n(174),w=n(21),C=n(17),S=n(80),R=n(127),N=n(94),B=n(234),I=n(13),A=n(16),E=n(505),L=n(501),T=n(175),M=n(79),F=n(178),D=n(504),z=n.n(D),H=n(356),P=n(357),V=n(230),G=n(453),U=n(522),W=n(523),J=n(524),K=n(445),X=n(98),Y=n(1),q=o.a.mark($),Q={page:Object(Y.jsx)(H.a,{}),person:Object(Y.jsx)(P.a,{}),redirect:Object(Y.jsx)(V.a,{})},Z=function(){return Math.max(document.documentElement.clientHeight||0,window.innerHeight||0)};function $(e){var t,n,r,i,s,l,u,b,j,d,f,O,p,h,v,x;return o.a.wrap((function(o){for(;;)switch(o.prev=o.next){case 0:t=[],n=e.sort((function(e,t){return t.block.metadata.modified>e.block.metadata.modified?1:-1})),r=n.findIndex((function(e){var t,n;return"europa"===(null===e||void 0===e||null===(t=e.block)||void 0===t||null===(n=t.properties)||void 0===n?void 0:n.slug)})),r>-1&&(n[r]=Object(c.a)(Object(c.a)({},n[r]),{},{isOpen:!0}),n=[n[r]].concat(Object(a.a)(n.slice(0,r)),Object(a.a)(n.slice(r+1)))),i=Object(A.a)(n);try{for(i.s();!(s=i.n()).done;)l=s.value,t.unshift({nestingLevel:0,node:l})}catch(m){i.e(m)}finally{i.f()}case 6:if(0===t.length){o.next=13;break}return u=t.pop(),b=u.node,j=b.children,d=void 0===j?[]:j,f=b._id,O=b.block,p=b.isOpen,h=u.nestingLevel,o.next=10,{_id:f,isLeaf:0===d.length,isOpen:p,block:O,nestingLevel:h};case 10:if(0!==d.length&&p)for(v=d.sort((function(e,t){return t.block.metadata.modified>e.block.metadata.modified?1:-1})),x=v.length-1;x>=0;x--)t.push({nestingLevel:h+1,node:v[x]});o.next=6;break;case 13:case"end":return o.stop()}}),q)}var ee=function(e){var t=e.index,n=e.style,a=e.data||[],r=a.items,s=a.props||{},o=s.createBlock,u=s.toggleOpenById,b=s.refetchData,j=s.showBlockMenu,d=s.setItemSize,f=r[t]||{},O=f._id,p=f.isLeaf,h=f.isOpen,v=f.block,x=f.nestingLevel,m=Object(l.useRef)();Object(l.useEffect)((function(){if("function"===typeof d&&m.current){var e=m.current.getBoundingClientRect().height;e>0&&d(t,~~e)}}),[t,v,d]);var g=Object(l.useState)(!1),k=Object(i.a)(g,2),y=k[0],_=k[1],w=Object(l.useCallback)((function(e){!1===e?setTimeout((function(){_(e)}),200):_(e)}),[_]),C=Object(l.useCallback)((function(){"function"===typeof u&&u(O)}),[u,O]),S=Object(l.useCallback)((function(){"function"===typeof b&&setTimeout((function(){b({force:!0})}),200)}),[b]),R=Object(Y.jsxs)(Y.Fragment,{children:[Object(Y.jsx)(M.a,{dragable:!0,size:"line",block:v,style:{flexGrow:"1",width:"100%"}}),!0===j&&Object(Y.jsx)("div",{className:z.a.blockRowActions,children:Object(Y.jsx)(T.a,{onToogle:w,onReloadContext:S,block:v,createBlock:o,trigger:function(e){return Object(Y.jsx)("button",Object(c.a)(Object(c.a)({},e),{},{className:"text hasIcon ".concat(y?"fakeHover":""),style:{margin:"0",padding:"var(--basis) 0",flexShrink:"0"},children:Object(Y.jsx)(G.a,{className:"icon"})}))}})})]}),N=~~(25*x+(p?24:0));return Object(Y.jsxs)("div",{ref:m,style:Object(c.a)(Object(c.a)({display:"flex",alignItems:"center",flexDirection:"row"},n),{},{height:"auto",marginLeft:N,minWidth:"calc(100% - ".concat(p?24:0,"px)"),width:"calc(100% - ".concat(N,"px)")}),className:"".concat(z.a.blockRow," ").concat(y?z.a.fakeHover:""),children:[!p&&Object(Y.jsx)("button",{onClick:C,className:"text hasIcon",style:{margin:"0",padding:"var(--basis) 0",flexShrink:"0"},children:h?Object(Y.jsx)(U.a,{style:{verticalAlign:"middle"}}):Object(Y.jsx)(W.a,{style:{verticalAlign:"middle"}})}),R]},v._id)},te=function(e){return Object.entries(e).filter((function(e){return!0===Object(i.a)(e,2)[1]})).map((function(e){return Object(i.a)(e,1)[0]}))};var ne=function(e){var t=e.createBlock,n=void 0===t?function(){}:t,a=e.scrollContainer,s=void 0===a?window:a,b=e.showBlockMenu,j=void 0===b||b,d=Object(C.c)().getString,v=Object(S.a)().loggedIn,x=Object(l.useRef)(null),m=Object(l.useRef)(null),g=Object(l.useState)(41),k=Object(i.a)(g,2),y=k[0],_=k[1],w=Object(l.useState)(0),N=Object(i.a)(w,2),B=N[0],T=N[1],M=Object(l.useState)([]),D=Object(i.a)(M,2),z=D[0],H=D[1],P=Object(l.useState)({}),V=Object(i.a)(P,2),G=V[0],U=V[1],W=Object(l.useState)([]),q=Object(i.a)(W,2),ne=q[0],ce=q[1],ae=Object(l.useRef)({}),re=Object(l.useState)("europa"),ie=Object(i.a)(re,2),se=ie[0],oe=ie[1],le=Object(l.useState)({person:!0,page:!0,redirect:!0}),ue=Object(i.a)(le,2),be=ue[0],je=ue[1],de=te(be),fe=Object(l.useState)(!1),Oe=Object(i.a)(fe,2),pe=Oe[0],he=Oe[1],ve=function(){var e=Object(l.useState)(Z()),t=Object(i.a)(e,2),n=t[0],c=t[1];return Object(l.useEffect)((function(){var e=null,t=function(){clearTimeout(e),e=setTimeout((function(){c(Z())}),150)};return window.addEventListener("resize",t),function(){window.removeEventListener("resize",t)}}),[]),{height:n}}().height,xe=Object(l.useCallback)((function(){m.current&&x.current&&setTimeout((function(){var e=x.current.getBoundingClientRect(),t=ve-e.top,n=m.current.getBoundingClientRect().height;if("number"===typeof n&&!isNaN(n)&&n>41){var c=Math.min(t,n);_(~~c),T(~~Math.max(n-c,0))}}),100)}),[ve,m,x,_,T]);Object(L.useScrollPosition)(xe,[xe],null,!1,300,s);var me=Object(l.useCallback)((function(e){if(e.length>0){e=e.map((function(e){return Object(c.a)(Object(c.a)({},e),{},{isOpen:!!G.hasOwnProperty(e._id)&&G[e._id]})}));var t=function(e){var t,n=[],c=Object(A.a)(e);try{var a=function(){var c=t.value,a=null;c.block.parent&&(a=e.find((function(e){return e._id===c.block.parent}))),a?(a.children||(a.children=[]),a.children.push(c)):n.push(c)};for(c.s();!(t=c.n()).done;)a()}catch(r){c.e(r)}finally{c.f()}return n}(JSON.parse(JSON.stringify(e))),n=function(e){for(var t=[],n=$(e),c=!1;!c;){var a=n.next(),r=a.done,i=a.value;(c=r)||t.push(i)}return t}(t);ce(n)}else ce([]);xe()}),[ce,xe,G]),ge=Object(R.a)(),ke=Object(l.useCallback)((function(e){var t=e||{},n=t.force,c=void 0!==n&&n,a=t.filteredTypes,i=t.archived,s=null,l=["viewer","editor","owner"];"europa"===se?(s=["6249c879fcaf12b124914396"],a=["page","redirect"],i=!1):"people"===se?(a=["person"],i=!1):"own_blocks"===se&&(l=["editor","owner"]),!0!==c&&ae.current.archived===i&&ae.current.types===a||(ae.current.types=a,ae.current.archived=i,ge({types:a,archived:i,roots:s,roles:l}).then(function(){var e=Object(r.a)(o.a.mark((function e(t){var n;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:n=t.map((function(e){return{_id:e._id,block:e,children:[],isOpen:!1}})),H(n),me(n);case 3:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()).catch((function(e){return console.error(e)})))}),[se,ge,H,me]),ye=Object(l.useCallback)((function(e){var t=Object(c.a)({},be);t[e]=!t[e],Object.values(t).every((function(e){return!1===e}))||je(t)}),[be,je]);Object(l.useEffect)((function(){ke({filteredTypes:te(be),archived:pe})}),[be,pe,ke]);var _e=Object(l.useRef)(null),we=u.a.useState([]),Ce=Object(i.a)(we,2),Se=Ce[0],Re=Ce[1],Ne=u.a.useCallback((function(e,t){"function"===typeof Re&&(Re((function(n){return Object(c.a)(Object(c.a)({},n),{},Object(I.a)({},e,t))})),_e.current&&"function"===typeof _e.current.resetAfterIndex&&_e.current.resetAfterIndex(e,!1))}),[]),Be=u.a.useCallback((function(e){return Se[e]||41}),[Se]),Ie=Object(l.useCallback)((function(e){G[e]=!G[e],U(G),me(z)}),[U,G,me,z]),Ae=Object(l.useCallback)((function(e){ke(Object(c.a)(Object(c.a)({},e),{},{filteredTypes:te(be),archived:pe}))}),[be,pe,ke]);return Object(Y.jsxs)(Y.Fragment,{children:[Object(Y.jsx)("div",{children:Object(Y.jsx)(F.a,{defaultValue:se,items:v?[{value:"europa",title:"Volt Europa"},{value:"people",title:d("block_menu_type_label_plural_person")},{value:"own_blocks",title:d("block_tree_own_blocks")}]:[{value:"europa",title:"Volt Europa"},{value:"people",title:d("block_menu_type_label_plural_person")}],onChange:oe,style:{display:"flex",alignItems:"center",margin:"calc(-2 * var(--basis)) 0 var(--basis_x4) 0",justifyContent:"stretch",flexWrap:"wrap",gap:"var(--basis_x2)"},buttonProps:{style:{flexGrow:1,justifyContent:"center",flexShrink:0,margin:0}}})}),Object(Y.jsx)("div",{style:{display:"flex",alignItems:"center",margin:"0 0 var(--basis_x2) 0",gap:"var(--basis)"},children:v&&"own_blocks"===se?Object(Y.jsxs)(X.a,{trigger:function(e){return Object(Y.jsxs)("button",Object(c.a)(Object(c.a)({},e),{},{className:"text hasIcon",style:{flexShrink:"0",margin:"0"},children:[Object(Y.jsx)(J.a,{className:"icon"}),Object(Y.jsx)("span",{style:{verticalAlign:"middle"},children:"Filter"})]}))},children:[Object(Y.jsx)("div",{style:{marginTop:"8px"}}),Object.keys(be).map((function(e){return Object(Y.jsxs)(f.a,{className:"roundMenuItem",onClick:function(){return ye(e)},selected:de.includes(e),sx:{marginTop:"2px !important",marginBottom:"2px !important"},children:[Object(Y.jsx)(O.a,{children:Q[e]}),Object(Y.jsx)(p.a,{children:Object(Y.jsx)(C.a,{id:"block_menu_type_label_plural_"+e})})]},e)})),Object(Y.jsx)(h.a,{style:{opacity:"var(--alpha-less)"}}),Object(Y.jsxs)(f.a,{className:"roundMenuItem",onClick:function(){he((function(e){return!e}))},selected:!0===pe,sx:{marginBottom:"2px !important"},children:[Object(Y.jsx)(O.a,{children:Object(Y.jsx)(K.a,{className:"icon"})}),Object(Y.jsx)(p.a,{children:Object(Y.jsx)(C.a,{id:!0===pe?"filter_menu_showing_archiv":"filter_menu_show_archiv"})})]})]}):null}),Object(Y.jsxs)("div",{style:{height:y,marginRight:"-12px",marginLeft:"-12px",marginBottom:B,overflowY:"visible",overflowX:"auto"},ref:x,children:[Object(Y.jsx)(E.a,{ref:_e,itemSize:Be,itemData:{items:ne,props:{createBlock:n,toggleOpenById:Ie,refetchData:Ae,showBlockMenu:j,setItemSize:Ne}},itemCount:ne.length,innerRef:m,height:y,width:"auto",style:{overflowY:"hidden",overflowX:"visible"},estimatedItemSize:41,itemKey:function(e,t){return t.items[e]._id},children:ee}),0===ne.length?Object(Y.jsx)("p",{style:{textAlign:"center",fontWeight:"bold"},children:Object(Y.jsx)(C.a,{id:"blocktree_no_nodes_to_show"})}):null]})]})},ce=n(24),ae=n(87),re=n(53),ie=["slugs","children"];function se(e){var t=e.slugs,n=void 0===t?[]:t,a=e.children,s=Object(ce.a)(e,ie),u=Object(l.useRef)(!1);Object(l.useEffect)((function(){return u.current=!0,function(){u.current=!1}}),[]);var b=Object(l.useState)([]),j=Object(i.a)(b,2),d=j[0],f=j[1],O=Object(ae.a)();return Object(l.useEffect)((function(){Array.isArray(n)&&n.length>0?O.query({query:re.d,variables:{slugs:n}}).then(function(){var e=Object(r.a)(o.a.mark((function e(t){var n,c;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(n=t.errors,c=t.data,!0!==u.current){e.next=7;break}if(!Array.isArray(n)&&Array.isArray(c.blocks)){e.next=6;break}throw new Error(n.map((function(e){return e.message})).join("\n"));case 6:f(c.blocks);case 7:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()).catch(function(){var e=Object(r.a)(o.a.mark((function e(t){return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:console.error("error",t),f([]);case 2:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()):f([])}),[n,O]),null===d||0===d.length||"function"!==typeof a?null:a(Object(c.a)(Object(c.a)({},s),{},{blocks:d,slugs:n}))}var oe=n(101),le=n(471),ue=n(157),be=n(207);function je(){var e=Object(l.useRef)(!1);Object(l.useEffect)((function(){return e.current=!0,function(){e.current=!1}}),[]);var t=Object(l.useState)([]),n=Object(i.a)(t,2),s=n[0],b=n[1],I=Object(R.a)();Object(l.useEffect)((function(){if(e.current){var t=function(){var e=Object(r.a)(o.a.mark((function e(){var t,n;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,I({types:["reaction"],roles:["owner"],archived:!1});case 2:return t=e.sent.filter((function(e){var t,n;return"\u2b50\ufe0f"===(null===(t=e.properties)||void 0===t||null===(n=t.icon)||void 0===n?void 0:n.emoji)})).map((function(e){return e.properties.reactionFor})),console.log("loadFavoriteBlockIds",t),e.next=6,I({ids:t});case 6:n=e.sent,console.log("favoriteBlocks",n),b(n);case 9:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();t()}}),[I]);var A=Object(C.c)(),E=A.getString,L=A.userLocales,T=void 0===L?[]:L,F=Object(l.useState)(!1),D=Object(i.a)(F,2),z=D[0],H=D[1],P=Object(l.useCallback)((function(){e.current&&function(e,t,n){var c;return function(){var a=this,r=arguments,i=function(){c=null,n||e.apply(a,r)},s=n&&!c;clearTimeout(c),c=setTimeout(i,t),s&&e.apply(a,r)}}((function(){e.current&&H(!0)}),10)()}),[H,e]);Object(l.useEffect)((function(){P()}),[P]);var V=Object(S.a)().loggedIn,G=Object(N.e)().toggleSidebar,U=Object(w.f)("/"),W=Object(_.a)(),J=Object(w.g)(),K=Object(l.useCallback)((function(e){var t=e.type;"string"===typeof t&&t.length>0&&W({type:t}).then((function(e){J("/".concat(e._id,"/edit"))})).catch((function(e){console.error(e)}))}),[W,J]),X=Object(l.useRef)(null),q=Object(l.useCallback)((function(e){var t=new CustomEvent("change_locale",{detail:{locale:e},bubbles:!0,cancelable:!1});document.dispatchEvent(t)}),[]),Q=Object(l.useRef)(null),Z=function(e){var t=u.a.useRef(!1);Object(l.useEffect)((function(){return t.current=!0,function(){t.current=!1}}),[]);var n=u.a.useState(),c=Object(i.a)(n,2),a=c[0],r=c[1];return u.a.useLayoutEffect((function(){!0===t.current&&r(e.current.getBoundingClientRect())}),[e]),Object(be.a)(e,(function(e){!0===t.current&&r(e.contentRect)})),a}(Q),$=/(macintosh|macintel|macppc|mac68k|macos|iphone|ipad|ipod)/i.test(window.navigator.userAgent.toLowerCase()),ee=["_"].concat(Object(a.a)(Object.keys(ue.b))),te=E("choose_locale_information");return Object(Y.jsx)("div",{ref:X,className:j.a.scrollContainer,children:Object(Y.jsxs)("div",{className:j.a.content,children:[Object(Y.jsx)("header",{className:j.a.header,children:Object(Y.jsxs)("div",{className:j.a.headerBar,children:[U?null:Object(Y.jsx)("button",{onClick:G,className:"text hasIcon",style:{margin:"0"},children:Object(Y.jsx)(v.a,{className:"icon"})}),U?Object(Y.jsx)("h1",{children:"Volt.Link"}):Object(Y.jsx)("h2",{style:{margin:0},children:"Volt.Link"}),Object(Y.jsx)(B.a,{trigger:function(e){return Object(Y.jsx)("button",Object(c.a)(Object(c.a)({className:"default hasIcon"},e),{},{children:Object(Y.jsx)(x.a,{className:"icon"})}))},createBlock:K})]})}),Object(Y.jsxs)(d.a,{style:{maxWidth:"100%"},children:[Object(Y.jsxs)(f.a,{ref:Q,onClick:function(){var e=new CustomEvent("open_search");window.dispatchEvent(e)},style:{width:"100%",justifyContent:"space-between",boxShadow:"0 0 0 1px var(--background)",background:"var(--background)",borderRadius:"var(--basis)",margin:"0",padding:"var(--basis) var(--basis_x2)"},children:[Object(Y.jsx)(O.a,{children:Object(Y.jsx)(m.a,{})}),Object(Y.jsx)(p.a,{secondary:Object(Y.jsxs)("span",{style:{display:"flex",justifyContent:"space-between"},children:[Object(Y.jsx)(C.a,{id:"search"}),(null===Z||void 0===Z?void 0:Z.width)>500?$?Object(Y.jsx)("kbd",{children:"\u2318 K"}):Object(Y.jsx)("kbd",{children:"Ctrl+K"}):null]})})]}),Object(Y.jsx)("br",{}),V?Object(Y.jsx)("a",{href:"".concat(window.domains.backend,"logout?redirect_to=").concat(encodeURIComponent(window.location.toString())),children:Object(Y.jsxs)(f.a,{className:"clickable_card",style:{borderRadius:"var(--basis)",margin:"0",padding:"var(--basis) var(--basis_x2)"},children:[Object(Y.jsx)(O.a,{children:Object(Y.jsx)(g.a,{})}),Object(Y.jsx)(p.a,{primary:Object(Y.jsx)(C.a,{id:"logout"})})]})}):Object(Y.jsx)("a",{href:"".concat(window.domains.backend,"login?redirect_to=").concat(encodeURIComponent(window.location.toString())),children:Object(Y.jsxs)(f.a,{className:"clickable_card",style:{borderRadius:"var(--basis)",margin:"0",padding:"var(--basis) var(--basis_x2)"},children:[Object(Y.jsx)(O.a,{children:Object(Y.jsx)(k.a,{})}),Object(Y.jsx)(p.a,{primary:Object(Y.jsx)(C.a,{id:"login"})})]})}),Object(Y.jsxs)(f.a,{className:"clickable_card",style:{borderRadius:"var(--basis)",margin:"0",padding:"var(--basis) var(--basis_x2)"},children:[Object(Y.jsx)(O.a,{children:Object(Y.jsx)(y.a,{})}),Object(Y.jsx)(p.a,{primary:Object(Y.jsxs)(Y.Fragment,{children:[Object(Y.jsx)("span",{style:{marginRight:"var(--basis_x2)",verticalAlign:"middle"},children:Object(Y.jsx)(C.a,{id:"choose_locale"})}),Object(Y.jsx)(le.default,{onChange:q,defaultValue:T[0],options:ee,style:{fontSize:"inherit",padding:"4px 8px",verticalAlign:"middle"}})]}),secondary:Object(Y.jsx)(Y.Fragment,{children:"string"===typeof te&&""!==te?Object(Y.jsx)("span",{style:{marginBottom:"0",whiteSpace:"normal"},children:Object(Y.jsx)(C.a,{id:"choose_locale_information"})}):null})})]}),Object(Y.jsx)("br",{}),Object(Y.jsx)(se,{slugs:["glossary","vip","tools"],children:function(e){var t=e.blocks;return e.slugs.map((function(e){var n=t.find((function(t){var n;return(null===t||void 0===t||null===(n=t.properties)||void 0===n?void 0:n.slug)===e}));return n?Object(Y.jsx)(M.a,{block:n},n._id):null})).filter(Boolean)}}),Object(Y.jsx)("br",{}),Object(Y.jsx)(se,{slugs:["volt_link_workplace_group","stats","volt_link_source_code","volt_link_contact","imprint","privacy_policy"],children:function(e){var t=e.blocks;return e.slugs.map((function(e){var n=t.find((function(t){var n;return(null===t||void 0===t||null===(n=t.properties)||void 0===n?void 0:n.slug)===e}));return n?Object(Y.jsx)(M.a,{block:n},n._id):null})).filter(Boolean)}})]}),V?Object(Y.jsxs)(Y.Fragment,{children:[Object(Y.jsx)("br",{}),Object(Y.jsx)(h.a,{style:{opacity:.2,borderRadius:"10px"}}),Object(Y.jsx)("br",{}),Object(Y.jsxs)("h2",{style:{margin:"0 calc(1.85 * var(--basis)) var(--basis_x2) calc(1.85 * var(--basis))"},children:[Object(Y.jsx)(oe.a,{emojiClassName:j.a.emoji,emoji:"\u2b50\ufe0f"})," ",Object(Y.jsx)(C.a,{id:"favorites_heading"})]}),Object(Y.jsx)("p",{className:"body2",style:{opacity:.8,margin:"0 calc(1.85 * var(--basis)) var(--basis_x2) calc(1.85 * var(--basis))"},children:Object(Y.jsx)(C.a,{id:"favorites_description"})}),s.length>0?s.map((function(e){return e?Object(Y.jsx)(M.a,{block:e},e._id):null})).filter(Boolean):null]}):null,Object(Y.jsx)("br",{}),Object(Y.jsx)(h.a,{style:{opacity:.2,borderRadius:"10px"}}),Object(Y.jsx)("br",{}),Object(Y.jsx)("br",{}),z?Object(Y.jsx)(ne,{showBlockMenu:!0,scrollContainer:X}):null]})})}}}]);
//# sourceMappingURL=8.252dfbb1.chunk.js.map