"use strict";var flatpickr=function e(t,n){var a=void 0,i=void 0,r=function(t){return t._flatpickr&&t._flatpickr.destroy(),t._flatpickr=new e.init(t,n),t._flatpickr};return t.nodeName?r(t):/^\#[a-zA-Z0-9\-\_]*$/.test(t)?r(document.getElementById(t.slice(1))):(a=/^\.[a-zA-Z0-9\-\_]*$/.test(t)?document.getElementsByClassName(t.slice(1)):document.querySelectorAll(t),i=[].slice.call(a).map(r),{calendars:i,byID:function(e){for(var t=0;t<i.length;t++)if(i[t].element.id===e)return i[t]}})};flatpickr.init=function(e,t){var n=function(e,t,n){var a=document.createElement(e);return n&&(a.innerHTML=n),t&&(a.className=t),a};function a(e,t){var n=!1;return function(){n||(e.call(),n=!0,setTimeout(function(){n=!1},t))}}var i,r,o,l,c,u,d,s,p,f,g,m,h,v,D,b,y,k,M,w,L,C,O,j,T,E,I,H,_,S,Y,x,N,F,A,q,W,B,P,J,U=this,z=new Date;i=function(){t=t||{},U.config={},U.element=e;for(var n in U.defaultConfig)U.config[n]=t[n]||U.element.dataset&&U.element.dataset[n.toLowerCase()]||U.element.getAttribute("data-"+n)||U.defaultConfig[n];U.input=U.config.wrap?e.querySelector("[data-input]"):e,U.input.classList.add("flatpickr-input"),U.config.defaultDate&&(U.config.defaultDate=o(U.config.defaultDate)),(U.input.value||U.config.defaultDate)&&(U.selectedDateObj=o(U.config.defaultDate||U.input.value)),r(),g(),T(),U.uDate=o,U.jumpToDate(),y()},j=function(){var e=void 0,t=void 0;do e=Math.round(Math.random()*Math.pow(10,10)),t="flatpickr-"+e;while(null!==document.getElementById(t));return t},o=function(e,t){if(t=t||!1,"today"===e)e=new Date,t=!0;else if("string"==typeof e)if(e=e.trim(),/^\d\d\d\d\-\d\d\-\d\d/.test(e))e=new Date(e.replace(/(\d)-(\d)/g,"$1/$2"));else if(/^(\d?\d):(\d\d)/.test(e)){var n=e.match(/(\d?\d):(\d\d)/);e=new Date,e.setHours(n[1],n[2],0,0)}else Date.parse(e)?e=new Date(e):(console.error("flatpickr: invalid date string "+e),console.info(U.element));return t&&e&&e.setHours(0,0,0,0),"true"===String(U.config.utc)&&e&&!e.fp_isUTC&&(e=e.fp_toUTC()),e},l=function(e,t){return e.getFullYear()===t.getFullYear()&&e.getMonth()===t.getMonth()&&e.getDate()===t.getDate()},r=function(){q=n("div","flatpickr-wrapper"),U.config.inline?(U.element.parentNode.insertBefore(q,U.element),q.appendChild(U.element),q.classList.add("inline")):document.body.appendChild(q),U.config.altInput&&(U.altInput=n(U.input.nodeName,"flatpickr-input"),U.altInput.placeholder=U.input.placeholder,U.altInput.type=U.input.type||"text",U.input.type="hidden",U.input.parentNode.insertBefore(U.altInput,U.input.nextSibling))},L=function(e){var t=U.currentYear,n=e||U.currentMonth;return 1===n&&t%4===0&&t%100!==0||t%400===0?29:U.l10n.daysInMonth[n]},y=function(){var e=void 0;if(U.selectedDateObj&&U.config.enableTime){e=U.selectedDateObj.getTime();var t=parseInt(W.value,10),n=(60+parseInt(B.value,10))%60;U.config.time_24hr||(t=t%12+12*("PM"===P.innerHTML)),U.selectedDateObj.setHours(t,n),W.value=c(U.config.time_24hr?t:(12+t)%12+12*(t%12===0)),B.value=c(n)}U.altInput&&U.selectedDateObj&&(U.altInput.value=u(U.config.altFormat)),U.selectedDateObj&&(U.input.value=u(U.config.dateFormat)),e&&U.selectedDateObj.getTime()!==e&&E()},c=function(e){return("0"+e).slice(-2)},u=function(e){U.config.noCalendar&&(e=""),U.config.enableTime&&(e+=" "+U.config.timeFormat);for(var t="",n={D:function(){return U.l10n.weekdays.shorthand[n.w()]},F:function(){return d(n.n()-1,!1)},H:function(){return c(U.selectedDateObj.getHours())},K:function(){return U.selectedDateObj.getHours()>11?"PM":"AM"},M:function(){return d(n.n()-1,!0)},U:function(){return U.selectedDateObj.getTime()/1e3},Y:function(){return U.selectedDateObj.getFullYear()},d:function(){return c(n.j())},h:function(){return U.selectedDateObj.getHours()%12?U.selectedDateObj.getHours()%12:12},i:function(){return c(U.selectedDateObj.getMinutes())},j:function(){return U.selectedDateObj.getDate()},l:function(){return U.l10n.weekdays.longhand[n.w()]},m:function(){return c(n.n())},n:function(){return U.selectedDateObj.getMonth()+1},w:function(){return U.selectedDateObj.getDay()},y:function(){return String(n.Y()).substring(2)}},a=e.split(""),i=0;i<a.length;i++){var r=a[i];n[r]&&"\\"!==a[i-1]?t+=n[r]():"\\"!==r&&(t+=r)}return t},d=function(e,t){return t||U.config.shorthandCurrentMonth?U.l10n.months.shorthand[e]:U.l10n.months.longhand[e]},s=function(e){e=o(e,!0);for(var t=void 0,n=0;n<U.config.disable.length;n++){if(t=U.config.disable[n],t instanceof Date||"string"==typeof t)return o(t,!0).getTime()==e.getTime();if(e>=o(t.from)&&e<=o(t.to))return!0}return!1},b=function(e){e.preventDefault();var t=Math.max(-1,Math.min(1,e.wheelDelta||-e.deltaY));U.currentYear=e.target.value=parseInt(e.target.value,10)+t,U.redraw()},D=function(e){e.preventDefault();var t=parseInt(e.target.min),n=parseInt(e.target.max),a=parseInt(e.target.step),i=a*Math.max(-1,Math.min(1,e.wheelDelta||-e.deltaY)),r=(parseInt(e.target.value)+i)%(n+(0===t));t>r&&(r=n+(0===t)-a*(0===t)),e.target.value=c(r)},k=function(){x.innerHTML=d(U.currentMonth)+" ",Y.value=U.currentYear},M=function(){(U.currentMonth<0||U.currentMonth>11)&&(U.currentYear+=U.currentMonth%11,U.currentMonth=(U.currentMonth+12)%12)},C=function(e){q.classList.contains("open")&&!q.contains(e.target)&&e.target!==U.element&&e.target!==U.altInput&&U.close()},w=function(e){U.currentMonth+=e,M(),k(),m()},O=function(e){e.preventDefault(),e.target.classList.contains("slot")&&(U.selectedDateObj=new Date(U.currentYear,U.currentMonth,e.target.innerHTML),y(),E(),m(),U.config.inline||U.config.enableTime||U.close())},g=function(){I=n("div","flatpickr-calendar"),I.id=j(),F=n("div","flatpickr-days"),U.config.noCalendar||(p(),f(),U.config.weekNumbers&&h(),m(),I.appendChild(F)),q.appendChild(I),U.config.enableTime&&v()},p=function(){_=n("div","flatpickr-month"),S=n("span","flatpickr-prev-month",U.config.prevArrow),x=n("span","cur_month"),Y=n("input","cur_year"),Y.type="",Y.title="Scroll to increment",N=n("span","flatpickr-next-month",U.config.nextArrow),H=n("span","flatpickr-current-month"),H.appendChild(x),H.appendChild(Y),_.appendChild(S),_.appendChild(H),_.appendChild(N),k(),I.appendChild(_)},f=function(){var e=n("div","flatpickr-weekdays"),t=U.l10n.firstDayOfWeek,a=U.l10n.weekdays.shorthand.slice();t>0&&t<a.length&&(a=[].concat(a.splice(t,a.length),a.splice(0,t))),e.innerHTML=U.config.weekNumbers?"<span>Wk</span>":"",e.innerHTML+="<span>"+a.join("</span><span>")+"</span>",I.appendChild(e)},h=function(){I.classList.add("hasWeeks"),A=n("div","flatpickr-weeks"),I.appendChild(A)},m=function(){var e=(new Date(U.currentYear,U.currentMonth,1).getDay()-U.l10n.firstDayOfWeek+7)%7,t=L(),a=L((U.currentMonth-1+12)%12),i=a+1-e,r=void 0,c=void 0,u=void 0,d=void 0;for(U.config.weekNumbers&&A&&(A.innerHTML=""),F.innerHTML="",U.config.minDate=o(U.config.minDate,!0),U.config.maxDate=o(U.config.maxDate,!0);a>=i;i++)F.appendChild(n("span","disabled flatpickr-day",i));for(i=1;42-e>=i;i++)(t>=i||i%7===1)&&(c=new Date(U.currentYear,U.currentMonth,i,0,0,0,0)),U.config.weekNumbers&&A&&i%7===1&&A.appendChild(n("span","disabled flatpickr-day",c.fp_getWeek())),d=U.config.minDate&&c<U.config.minDate||U.config.maxDate&&c>U.config.maxDate,u=i>t||d||s(c),r=u?"disabled flatpickr-day":"slot flatpickr-day",!u&&l(c,z)&&(r+=" today"),!u&&U.selectedDateObj&&l(c,U.selectedDateObj)&&(r+=" selected"),F.appendChild(n("span",r,i>t?i%t:i))},v=function(){var e=n("div","flatpickr-time"),t=n("span","flatpickr-time-separator",":");W=n("input","flatpickr-hour"),B=n("input","flatpickr-minute"),W.type=B.type="number",W.value=U.selectedDateObj?c(U.selectedDateObj.getHours()):12,B.value=U.selectedDateObj?c(U.selectedDateObj.getMinutes()):"00",W.step=U.config.hourIncrement,B.step=U.config.minuteIncrement,W.min=+!U.config.time_24hr,W.max=U.config.time_24hr?23:12,B.min=0,B.max=59,W.title=B.title="Scroll to increment",e.appendChild(W),e.appendChild(t),e.appendChild(B),U.config.time_24hr||(P=n("span","flatpickr-am-pm",["AM","PM"][W.value>11|0]),P.title="Click to toggle",e.appendChild(P)),U.config.noCalendar&&!U.selectedDateObj&&(U.selectedDateObj=new Date),I.appendChild(e)},T=function(){function e(e){e.preventDefault(),P.innerHTML=["AM","PM"]["AM"===P.innerHTML|0]}"true"===String(U.config.clickOpens)&&(U.input.addEventListener("focus",U.open),U.altInput&&U.altInput.addEventListener("focus",U.open)),U.config.wrap&&U.element.querySelector("[data-open]")&&U.element.querySelector("[data-open]").addEventListener("click",U.open),U.config.wrap&&U.element.querySelector("[data-close]")&&U.element.querySelector("[data-close]").addEventListener("click",U.close),U.config.wrap&&U.element.querySelector("[data-toggle]")&&U.element.querySelector("[data-toggle]").addEventListener("click",U.toggle),U.config.wrap&&U.element.querySelector("[data-clear]")&&U.element.querySelector("[data-clear]").addEventListener("click",U.clear),U.config.noCalendar||(S.addEventListener("click",function(){w(-1)}),N.addEventListener("click",function(){w(1)}),Y.addEventListener("wheel",b),Y.addEventListener("focus",Y.select),Y.addEventListener("change",function(e){Y.blur(),U.currentYear=parseInt(e.target.value,10),U.redraw()}),F.addEventListener("click",O)),document.addEventListener("click",C,!0),U.config.enableTime&&(W.addEventListener("wheel",D),B.addEventListener("wheel",D),W.addEventListener("mouseout",y),B.addEventListener("mouseout",y),W.addEventListener("change",y),B.addEventListener("change",y),W.addEventListener("click",W.select),B.addEventListener("click",B.select),U.config.time_24hr||(P.addEventListener("focus",P.blur),P.addEventListener("click",e),P.addEventListener("wheel",e),P.addEventListener("mouseout",y))),document.createEvent?(J=document.createEvent("MouseEvent"),J.initMouseEvent("click",!0,!0,window,0,0,0,0,0,!1,!1,!1,!1,0,null)):J=new MouseEvent("click",{view:window,bubbles:!0,cancelable:!0}),window.addEventListener("resize",a(function(){q.classList.contains("open")&&U.positionCalendar()},150))},U.open=function(){U.input.disabled||U.config.inline||(U.positionCalendar(),q.classList.add("open"),U.altInput?(U.altInput.blur(),U.altInput.classList.add("active")):(U.input.blur(),U.input.classList.add("active")),U.config.onOpen&&U.config.onOpen(U.selectedDateObj,U.input.value))},U.positionCalendar=function(){var e=U.altInput?U.altInput:U.input,t=e.getBoundingClientRect(),n=window.pageYOffset+e.offsetHeight+t.top,a=window.pageXOffset+t.left;q.style.top=n+"px",q.style.left=a+"px"},U.toggle=function(){U.input.disabled||(q.classList.toggle("open"),U.positionCalendar(),U.altInput&&U.altInput.classList.toggle("active"),U.input.classList.toggle("active"))},U.close=function(){q.classList.remove("open"),U.input.classList.remove("active"),U.altInput&&U.altInput.classList.remove("active"),U.config.onClose&&U.config.onClose(U.selectedDateObj,U.input.value)},U.clear=function(){U.input.value="",U.selectedDateObj=null,U.jumpToDate()},E=function(){U.input.dispatchEvent(J),U.config.onChange&&U.config.onChange(U.selectedDateObj,U.input.value)},U.destroy=function(){if(document.removeEventListener("click",C,!1),U.config.inline){var e=U.element.parentNode,t=e.removeChild(U.element);e.removeChild(I),e.parentNode.replaceChild(t,e)}else document.getElementsByTagName("body")[0].removeChild(q)},U.redraw=function(){U.config.noCalendar||(k(),m())},U.jumpToDate=function(e){e=o(e||U.selectedDateObj||U.config.defaultDate||U.config.minDate||z),U.currentYear=e.getFullYear(),U.currentMonth=e.getMonth(),U.redraw()},U.setDate=function(e,t){return o(e)instanceof Date?(U.selectedDateObj=o(e),U.jumpToDate(U.selectedDateObj),y(),void(t&&E())):(console.error("flatpickr: setDate() - invalid date: "+e),void console.info(U.element))},U.setTime=function(e,t,n){U.selectedDateObj&&(W.value=parseInt(e,10)%24,B.value=parseInt(t||0,10)%60,U.config.time_24hr||(P.innerHTML=e>11?"PM":"AM"),y(),n&&E())},U.set=function(e,t){e in U.config&&(U.config[e]=t,U.jumpToDate())};try{i()}catch($){console.error($),console.info(U.element)}return U},flatpickr.init.prototype={l10n:{weekdays:{shorthand:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],longhand:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},months:{shorthand:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],longhand:["January","February","March","April","May","June","July","August","September","October","November","December"]},daysInMonth:[31,28,31,30,31,30,31,31,30,31,30,31],firstDayOfWeek:0},defaultConfig:{utc:!1,noCalendar:!1,wrap:!1,weekNumbers:!1,clickOpens:!0,dateFormat:"Y-m-d",altInput:!1,altFormat:"F j, Y",defaultDate:null,minDate:null,maxDate:null,disable:[],shorthandCurrentMonth:!1,inline:!1,prevArrow:"&lt;",nextArrow:"&gt;",enableTime:!1,timeFormat:"h:i K",time_24hr:!1,hourIncrement:1,minuteIncrement:5,onChange:null,onOpen:null,onClose:null}},Date.prototype.fp_incr=function(e){return new Date(this.getFullYear(),this.getMonth(),this.getDate()+parseInt(e,10))},Date.prototype.fp_isUTC=!1,Date.prototype.fp_toUTC=function(){var e=new Date(this.getTime()+6e4*this.getTimezoneOffset());return e.fp_isUTC=!0,e},Date.prototype.fp_getWeek=function(){var e=new Date(this.getTime());e.setHours(0,0,0,0),e.setDate(e.getDate()+3-(e.getDay()+6)%7);var t=new Date(e.getFullYear(),0,4);return 1+Math.round(((e.getTime()-t.getTime())/864e5-3+(t.getDay()+6)%7)/7)},"classList"in document.documentElement||!Object.defineProperty||"undefined"==typeof HTMLElement||Object.defineProperty(HTMLElement.prototype,"classList",{get:function(){var e=this;function t(t){return function(n){var a=e.className.split(/\s+/),i=a.indexOf(n);t(a,i,n),e.className=a.join(" ")}}var n={add:t(function(e,t,n){return~t||e.push(n)}),remove:t(function(e,t){return~t&&e.splice(t,1)}),toggle:t(function(e,t,n){return~t?e.splice(t,1):e.push(n)}),contains:function(t){return!!~e.className.split(/\s+/).indexOf(t)}};return n}}),"undefined"!=typeof module&&(module.exports=flatpickr);