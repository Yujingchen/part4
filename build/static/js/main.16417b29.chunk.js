(this["webpackJsonpbloglist-frontend"]=this["webpackJsonpbloglist-frontend"]||[]).push([[0],{16:function(e,t,n){e.exports=n(40)},39:function(e,t,n){},40:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),l=n(15),u=n.n(l),c=n(4),o=n.n(c),i=n(5),s=n(2),m=function(e){var t=e.blog;return r.a.createElement("div",null,t.title," ",t.author)},b=n(3),p=n.n(b),g=null,f=function(){return p.a.get("/api/blogs").then((function(e){return e.data}))},E=function(e){var t={headers:{Authorization:g}};return p.a.post("/api/blogs",e,t).then((function(e){return e.data}))},h=function(e){g="bearer ".concat(e)},v=function(e){return p.a.post("/api/login",e).then((function(e){return e.data}))},d=(n(39),function(){var e=Object(a.useState)([]),t=Object(s.a)(e,2),n=t[0],l=t[1],u=Object(a.useState)(""),c=Object(s.a)(u,2),b=c[0],p=c[1],g=Object(a.useState)(""),d=Object(s.a)(g,2),w=d[0],O=d[1],j=Object(a.useState)(""),S=Object(s.a)(j,2),k=S[0],y=S[1],x=Object(a.useState)(null),C=Object(s.a)(x,2),I=C[0],F=C[1],B=Object(a.useState)(""),J=Object(s.a)(B,2),N=J[0],T=J[1],D=Object(a.useState)(""),U=Object(s.a)(D,2),z=U[0],A=U[1],M=Object(a.useState)(""),W=Object(s.a)(M,2),q=W[0],G=W[1],H=Object(a.useState)(""),K=Object(s.a)(H,2),L=K[0],P=K[1];Object(a.useEffect)((function(){var e=window.localStorage.getItem("loggedBlogappUser");if(e){var t=JSON.parse(e);F(t),h(t.token)}f().then((function(e){return l(e)}))}),[]);var Q=function(){var e=Object(i.a)(o.a.mark((function e(t){var a,r,u;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.preventDefault(),a={title:b,author:k,url:w},e.prev=2,e.next=5,E(a);case 5:r=e.sent,u=n.concat(r),console.log(u),l(u),p(""),y(""),O(""),P("a new blog ".concat(b," by ").concat(k," added")),setTimeout((function(){P("")}),5e3),e.next=20;break;case 16:e.prev=16,e.t0=e.catch(2),setTimeout((function(){G("")}),5e3),G("something went wrong when saving the new blog, please enter again");case 20:case"end":return e.stop()}}),e,null,[[2,16]])})));return function(t){return e.apply(this,arguments)}}(),R=function(){var e=Object(i.a)(o.a.mark((function e(t){var n,a;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.preventDefault(),n={username:N,password:z},e.prev=2,e.next=5,v(n);case 5:a=e.sent,window.localStorage.setItem("loggedBlogappUser",JSON.stringify(a)),window.localStorage.setItem("loggedIn",!0),F(a),h(a.token),T(""),A(""),e.next=18;break;case 14:e.prev=14,e.t0=e.catch(2),G("Wrong credentials"),setTimeout((function(){G(null)}),5e3);case 18:case"end":return e.stop()}}),e,null,[[2,14]])})));return function(t){return e.apply(this,arguments)}}(),V=function(e){switch(e.target.name){case"title":p(e.target.value);break;case"url":O(e.target.value);break;case"author":y(e.target.value);break;case"username":T(e.target.value);break;case"password":A(e.target.value)}};return r.a.createElement("div",null,q&&r.a.createElement("div",{className:"errorMessage"},q),L&&r.a.createElement("div",{className:"notification"},L),null===I&&r.a.createElement("form",{onSubmit:function(e){return R(e)}},r.a.createElement("ul",null,r.a.createElement("li",null,r.a.createElement("label",{htmlFor:"username"},"username: "),r.a.createElement("input",{value:N,name:"username",onChange:function(e){return V(e)}})),r.a.createElement("li",null,r.a.createElement("label",{htmlFor:"password"},"password: "),r.a.createElement("input",{value:z,name:"password",onChange:function(e){return V(e)}})),r.a.createElement("li",null,r.a.createElement("button",{type:"submit"},"login"))),r.a.createElement("ul",null)),null!==I&&r.a.createElement("div",null,r.a.createElement("h1",null,"blogs"),r.a.createElement("p",null,I.username," logged in ",r.a.createElement("span",null,r.a.createElement("button",{onClick:function(e){return function(e){e.preventDefault(),F(null),window.localStorage.removeItem("loggedBlogappUser")}(e)}},"logout"))),r.a.createElement("h1",null,"create new"),r.a.createElement("form",{onSubmit:function(e){return Q(e)}},r.a.createElement("ul",{style:{listStyleType:"none"}},r.a.createElement("li",null,r.a.createElement("label",{htmlFor:"title"},"title: "),r.a.createElement("input",{value:b,name:"title",onChange:function(e){return V(e)}})),r.a.createElement("li",null,r.a.createElement("label",{htmlFor:"author"},"author: "),r.a.createElement("input",{value:k,name:"author",onChange:function(e){return V(e)}})),r.a.createElement("li",null,r.a.createElement("label",{htmlFor:"url"},"url: "),r.a.createElement("input",{value:w,name:"url",onChange:function(e){return V(e)}})),r.a.createElement("li",null,r.a.createElement("button",{type:"submit"},"create")))),n.map((function(e){return r.a.createElement(m,{key:e.id,blog:e})}))))});u.a.render(r.a.createElement(d,null),document.getElementById("root"))}},[[16,1,2]]]);
//# sourceMappingURL=main.16417b29.chunk.js.map