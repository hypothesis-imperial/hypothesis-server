(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{16:function(e,t,a){e.exports=a(31)},21:function(e,t,a){},23:function(e,t,a){},27:function(e,t,a){},31:function(e,t,a){"use strict";a.r(t);var n=a(1),r=a.n(n),l=a(3),c=a.n(l),o=(a(21),a(10)),s=a(11),i=a(14),u=a(12),m=a(15),v=a(4),f=(a(23),function(e){var t=e.variables.map(function(e,t){return r.a.createElement(E,{key:t,v_name:e.v_name,v_value:e.v_value})});return r.a.createElement("div",null,t)}),E=function(e){return r.a.createElement("div",{className:"Variable"},r.a.createElement("table",null,r.a.createElement("tr",null,r.a.createElement("td",null,"Variable Name: "),r.a.createElement("td",null,e.v_name)),r.a.createElement("tr",null,r.a.createElement("td",null,"Variable Value: "),r.a.createElement("td",null,e.v_value))))},d=function(e){var t=e.errors.map(function(e,t){return r.a.createElement("div",null,r.a.createElement(v.a,{className:"Error"},r.a.createElement(v.b,null,"Error ",t),r.a.createElement(f,{key:t,variables:e})))});return r.a.createElement("div",{className:"Test"},r.a.createElement(v.a,null,r.a.createElement(v.b,{className:"TestName"},"Test Name: ",e.test_name),t))},h=(a(27),function(e){function t(){var e,a;Object(o.a)(this,t);for(var n=arguments.length,r=new Array(n),l=0;l<n;l++)r[l]=arguments[l];return(a=Object(i.a)(this,(e=Object(u.a)(t)).call.apply(e,[this].concat(r)))).state={falsifyTestCase:{test_name:"",errors:[]}},a}return Object(m.a)(t,e),Object(s.a)(t,[{key:"componentDidMount",value:function(){var e=this;fetch("http://ec2-18-130-116-158.eu-west-2.compute.amazonaws.com/get_errors").then(function(e){return e.json()}).then(function(t){console.log(t),e.setState({falsifyTestCase:t})})}},{key:"render",value:function(){var e=this.state.falsifyTestCase,t=e.test_name,a=e.errors;return r.a.createElement("div",{className:"App"},r.a.createElement(d,{test_name:t,errors:a}))}}]),t}(n.Component));Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));a(29);c.a.render(r.a.createElement(h,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[16,2,1]]]);
//# sourceMappingURL=main.5543f318.chunk.js.map