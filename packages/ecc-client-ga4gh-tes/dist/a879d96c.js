const ze=function(){if(typeof globalThis<"u")return globalThis;if(typeof global<"u")return global;if(typeof self<"u")return self;if(typeof window<"u")return window;try{return new Function("return this")()}catch(i){return{}}}();ze.trustedTypes===void 0&&(ze.trustedTypes={createPolicy:(i,t)=>t});const or={configurable:!1,enumerable:!1,writable:!1};ze.FAST===void 0&&Reflect.defineProperty(ze,"FAST",Object.assign({value:Object.create(null)},or));const Bi=ze.FAST;if(Bi.getById===void 0){const i=Object.create(null);Reflect.defineProperty(Bi,"getById",Object.assign({value(t,e){let s=i[t];return s===void 0&&(s=e?i[t]=e():null),s}},or))}const Ni=Object.freeze([]);function nr(){const i=new WeakMap;return function(t){let e=i.get(t);if(e===void 0){let s=Reflect.getPrototypeOf(t);for(;e===void 0&&s!==null;)e=i.get(s),s=Reflect.getPrototypeOf(s);e=e===void 0?[]:e.slice(0),i.set(t,e)}return e}}const Io=ze.FAST.getById(1,()=>{const i=[],t=[];function e(){if(t.length)throw t.shift()}function s(r){try{r.call()}catch(a){t.push(a),setTimeout(e,0)}}function o(){let a=0;for(;a<i.length;)if(s(i[a]),a++,a>1024){for(let l=0,h=i.length-a;l<h;l++)i[l]=i[l+a];i.length-=a,a=0}i.length=0}function n(r){i.length<1&&ze.requestAnimationFrame(o),i.push(r)}return Object.freeze({enqueue:n,process:o})}),rr=ze.trustedTypes.createPolicy("fast-html",{createHTML:i=>i});let So=rr;const ji=`fast-${Math.random().toString(36).substring(2,8)}`,ar=`${ji}{`,Fo=`}${ji}`,Y=Object.freeze({supportsAdoptedStyleSheets:Array.isArray(document.adoptedStyleSheets)&&"replace"in CSSStyleSheet.prototype,setHTMLPolicy(i){if(So!==rr)throw new Error("The HTML policy can only be set once.");So=i},createHTML(i){return So.createHTML(i)},isMarker(i){return i&&i.nodeType===8&&i.data.startsWith(ji)},extractDirectiveIndexFromMarker(i){return parseInt(i.data.replace(`${ji}:`,""))},createInterpolationPlaceholder(i){return`${ar}${i}${Fo}`},createCustomAttributePlaceholder(i,t){return`${i}="${this.createInterpolationPlaceholder(t)}"`},createBlockPlaceholder(i){return`<!--${ji}:${i}-->`},queueUpdate:Io.enqueue,processUpdates:Io.process,nextUpdate(){return new Promise(Io.enqueue)},setAttribute(i,t,e){e==null?i.removeAttribute(t):i.setAttribute(t,e)},setBooleanAttribute(i,t,e){e?i.setAttribute(t,""):i.removeAttribute(t)},removeChildNodes(i){for(let t=i.firstChild;t!==null;t=i.firstChild)i.removeChild(t)},createTemplateWalker(i){return document.createTreeWalker(i,133,null,!1)}});class Fs{constructor(t,e){this.sub1=void 0,this.sub2=void 0,this.spillover=void 0,this.source=t,this.sub1=e}has(t){return this.spillover===void 0?this.sub1===t||this.sub2===t:this.spillover.indexOf(t)!==-1}subscribe(t){const e=this.spillover;if(e===void 0){if(this.has(t))return;if(this.sub1===void 0){this.sub1=t;return}if(this.sub2===void 0){this.sub2=t;return}this.spillover=[this.sub1,this.sub2,t],this.sub1=void 0,this.sub2=void 0}else e.indexOf(t)===-1&&e.push(t)}unsubscribe(t){const e=this.spillover;if(e===void 0)this.sub1===t?this.sub1=void 0:this.sub2===t&&(this.sub2=void 0);else{const s=e.indexOf(t);s!==-1&&e.splice(s,1)}}notify(t){const e=this.spillover,s=this.source;if(e===void 0){const o=this.sub1,n=this.sub2;o!==void 0&&o.handleChange(s,t),n!==void 0&&n.handleChange(s,t)}else for(let o=0,n=e.length;o<n;++o)e[o].handleChange(s,t)}}class lr{constructor(t){this.subscribers={},this.sourceSubscribers=null,this.source=t}notify(t){var e;const s=this.subscribers[t];s!==void 0&&s.notify(t),(e=this.sourceSubscribers)===null||e===void 0||e.notify(t)}subscribe(t,e){var s;if(e){let o=this.subscribers[e];o===void 0&&(this.subscribers[e]=o=new Fs(this.source)),o.subscribe(t)}else this.sourceSubscribers=(s=this.sourceSubscribers)!==null&&s!==void 0?s:new Fs(this.source),this.sourceSubscribers.subscribe(t)}unsubscribe(t,e){var s;if(e){const o=this.subscribers[e];o!==void 0&&o.unsubscribe(t)}else(s=this.sourceSubscribers)===null||s===void 0||s.unsubscribe(t)}}const it=Bi.getById(2,()=>{const i=/(:|&&|\|\||if)/,t=new WeakMap,e=Y.queueUpdate;let s,o=h=>{throw new Error("Must call enableArrayObservation before observing arrays.")};function n(h){let p=h.$fastController||t.get(h);return p===void 0&&(Array.isArray(h)?p=o(h):t.set(h,p=new lr(h))),p}const r=nr();class a{constructor(p){this.name=p,this.field=`_${p}`,this.callback=`${p}Changed`}getValue(p){return s!==void 0&&s.watch(p,this.name),p[this.field]}setValue(p,f){const m=this.field,w=p[m];if(w!==f){p[m]=f;const k=p[this.callback];typeof k=="function"&&k.call(p,w,f),n(p).notify(this.name)}}}class l extends Fs{constructor(p,f,m=!1){super(p,f),this.binding=p,this.isVolatileBinding=m,this.needsRefresh=!0,this.needsQueue=!0,this.first=this,this.last=null,this.propertySource=void 0,this.propertyName=void 0,this.notifier=void 0,this.next=void 0}observe(p,f){this.needsRefresh&&this.last!==null&&this.disconnect();const m=s;s=this.needsRefresh?this:void 0,this.needsRefresh=this.isVolatileBinding;const w=this.binding(p,f);return s=m,w}disconnect(){if(this.last!==null){let p=this.first;for(;p!==void 0;)p.notifier.unsubscribe(this,p.propertyName),p=p.next;this.last=null,this.needsRefresh=this.needsQueue=!0}}watch(p,f){const m=this.last,w=n(p),k=m===null?this.first:{};if(k.propertySource=p,k.propertyName=f,k.notifier=w,w.subscribe(this,f),m!==null){if(!this.needsRefresh){let F;s=void 0,F=m.propertySource[m.propertyName],s=this,p===F&&(this.needsRefresh=!0)}m.next=k}this.last=k}handleChange(){this.needsQueue&&(this.needsQueue=!1,e(this))}call(){this.last!==null&&(this.needsQueue=!0,this.notify(this))}records(){let p=this.first;return{next:()=>{const f=p;return f===void 0?{value:void 0,done:!0}:(p=p.next,{value:f,done:!1})},[Symbol.iterator]:function(){return this}}}}return Object.freeze({setArrayObserverFactory(h){o=h},getNotifier:n,track(h,p){s!==void 0&&s.watch(h,p)},trackVolatile(){s!==void 0&&(s.needsRefresh=!0)},notify(h,p){n(h).notify(p)},defineProperty(h,p){typeof p=="string"&&(p=new a(p)),r(h).push(p),Reflect.defineProperty(h,p.name,{enumerable:!0,get:function(){return p.getValue(this)},set:function(f){p.setValue(this,f)}})},getAccessors:r,binding(h,p,f=this.isVolatileBinding(h)){return new l(h,p,f)},isVolatileBinding(h){return i.test(h.toString())}})});function Ft(i,t){it.defineProperty(i,t)}const cr=Bi.getById(3,()=>{let i=null;return{get(){return i},set(t){i=t}}});class _i{constructor(){this.index=0,this.length=0,this.parent=null,this.parentContext=null}get event(){return cr.get()}get isEven(){return this.index%2===0}get isOdd(){return this.index%2!==0}get isFirst(){return this.index===0}get isInMiddle(){return!this.isFirst&&!this.isLast}get isLast(){return this.index===this.length-1}static setEvent(t){cr.set(t)}}it.defineProperty(_i.prototype,"index"),it.defineProperty(_i.prototype,"length");const Ui=Object.seal(new _i);class Oo{constructor(){this.targetIndex=0}}class hr extends Oo{constructor(){super(...arguments),this.createPlaceholder=Y.createInterpolationPlaceholder}}function Mc(i,t){this.source=i,this.context=t,this.bindingObserver===null&&(this.bindingObserver=it.binding(this.binding,this,this.isBindingVolatile)),this.updateTarget(this.bindingObserver.observe(i,t))}function zc(i,t){this.source=i,this.context=t,this.target.addEventListener(this.targetName,this)}function Hc(){this.bindingObserver.disconnect(),this.source=null,this.context=null}function Bc(){this.bindingObserver.disconnect(),this.source=null,this.context=null;const i=this.target.$fastView;i!==void 0&&i.isComposed&&(i.unbind(),i.needsBindOnly=!0)}function Nc(){this.target.removeEventListener(this.targetName,this),this.source=null,this.context=null}function jc(i){Y.setAttribute(this.target,this.targetName,i)}function _c(i){Y.setBooleanAttribute(this.target,this.targetName,i)}function Uc(i){if(i==null&&(i=""),i.create){this.target.textContent="";let t=this.target.$fastView;t===void 0?t=i.create():this.target.$fastTemplate!==i&&(t.isComposed&&(t.remove(),t.unbind()),t=i.create()),t.isComposed?t.needsBindOnly&&(t.needsBindOnly=!1,t.bind(this.source,this.context)):(t.isComposed=!0,t.bind(this.source,this.context),t.insertBefore(this.target),this.target.$fastView=t,this.target.$fastTemplate=i)}else{const t=this.target.$fastView;t!==void 0&&t.isComposed&&(t.isComposed=!1,t.remove(),t.needsBindOnly?t.needsBindOnly=!1:t.unbind()),this.target.textContent=i}}function qc(i){this.target[this.targetName]=i}function Gc(i){const t=this.classVersions||Object.create(null),e=this.target;let s=this.version||0;if(i!=null&&i.length){const o=i.split(/\s+/);for(let n=0,r=o.length;n<r;++n){const a=o[n];a!==""&&(t[a]=s,e.classList.add(a))}}if(this.classVersions=t,this.version=s+1,s!==0){s-=1;for(const o in t)t[o]===s&&e.classList.remove(o)}}class Ro extends hr{constructor(t){super(),this.binding=t,this.bind=Mc,this.unbind=Hc,this.updateTarget=jc,this.isBindingVolatile=it.isVolatileBinding(this.binding)}get targetName(){return this.originalTargetName}set targetName(t){if(this.originalTargetName=t,t!==void 0)switch(t[0]){case":":if(this.cleanedTargetName=t.substr(1),this.updateTarget=qc,this.cleanedTargetName==="innerHTML"){const e=this.binding;this.binding=(s,o)=>Y.createHTML(e(s,o))}break;case"?":this.cleanedTargetName=t.substr(1),this.updateTarget=_c;break;case"@":this.cleanedTargetName=t.substr(1),this.bind=zc,this.unbind=Nc;break;default:this.cleanedTargetName=t,t==="class"&&(this.updateTarget=Gc);break}}targetAtContent(){this.updateTarget=Uc,this.unbind=Bc}createBehavior(t){return new Wc(t,this.binding,this.isBindingVolatile,this.bind,this.unbind,this.updateTarget,this.cleanedTargetName)}}class Wc{constructor(t,e,s,o,n,r,a){this.source=null,this.context=null,this.bindingObserver=null,this.target=t,this.binding=e,this.isBindingVolatile=s,this.bind=o,this.unbind=n,this.updateTarget=r,this.targetName=a}handleChange(){this.updateTarget(this.bindingObserver.observe(this.source,this.context))}handleEvent(t){_i.setEvent(t);const e=this.binding(this.source,this.context);_i.setEvent(null),e!==!0&&t.preventDefault()}}let Do=null;class tr{addFactory(t){t.targetIndex=this.targetIndex,this.behaviorFactories.push(t)}captureContentBinding(t){t.targetAtContent(),this.addFactory(t)}reset(){this.behaviorFactories=[],this.targetIndex=-1}release(){Do=this}static borrow(t){const e=Do||new tr;return e.directives=t,e.reset(),Do=null,e}}function Xc(i){if(i.length===1)return i[0];let t;const e=i.length,s=i.map(r=>typeof r=="string"?()=>r:(t=r.targetName||t,r.binding)),o=(r,a)=>{let l="";for(let h=0;h<e;++h)l+=s[h](r,a);return l},n=new Ro(o);return n.targetName=t,n}const Yc=Fo.length;function dr(i,t){const e=t.split(ar);if(e.length===1)return null;const s=[];for(let o=0,n=e.length;o<n;++o){const r=e[o],a=r.indexOf(Fo);let l;if(a===-1)l=r;else{const h=parseInt(r.substring(0,a));s.push(i.directives[h]),l=r.substring(a+Yc)}l!==""&&s.push(l)}return s}function ur(i,t,e=!1){const s=t.attributes;for(let o=0,n=s.length;o<n;++o){const r=s[o],a=r.value,l=dr(i,a);let h=null;l===null?e&&(h=new Ro(()=>a),h.targetName=r.name):h=Xc(l),h!==null&&(t.removeAttributeNode(r),o--,n--,i.addFactory(h))}}function Qc(i,t,e){const s=dr(i,t.textContent);if(s!==null){let o=t;for(let n=0,r=s.length;n<r;++n){const a=s[n],l=n===0?t:o.parentNode.insertBefore(document.createTextNode(""),o.nextSibling);typeof a=="string"?l.textContent=a:(l.textContent=" ",i.captureContentBinding(a)),o=l,i.targetIndex++,l!==t&&e.nextNode()}i.targetIndex--}}function Zc(i,t){const e=i.content;document.adoptNode(e);const s=tr.borrow(t);ur(s,i,!0);const o=s.behaviorFactories;s.reset();const n=Y.createTemplateWalker(e);let r;for(;r=n.nextNode();)switch(s.targetIndex++,r.nodeType){case 1:ur(s,r);break;case 3:Qc(s,r,n);break;case 8:Y.isMarker(r)&&s.addFactory(t[Y.extractDirectiveIndexFromMarker(r)])}let a=0;(Y.isMarker(e.firstChild)||e.childNodes.length===1&&t.length)&&(e.insertBefore(document.createComment(""),e.firstChild),a=-1);const l=s.behaviorFactories;return s.release(),{fragment:e,viewBehaviorFactories:l,hostBehaviorFactories:o,targetOffset:a}}const Eo=document.createRange();class pr{constructor(t,e){this.fragment=t,this.behaviors=e,this.source=null,this.context=null,this.firstChild=t.firstChild,this.lastChild=t.lastChild}appendTo(t){t.appendChild(this.fragment)}insertBefore(t){if(this.fragment.hasChildNodes())t.parentNode.insertBefore(this.fragment,t);else{const e=this.lastChild;if(t.previousSibling===e)return;const s=t.parentNode;let o=this.firstChild,n;for(;o!==e;)n=o.nextSibling,s.insertBefore(o,t),o=n;s.insertBefore(e,t)}}remove(){const t=this.fragment,e=this.lastChild;let s=this.firstChild,o;for(;s!==e;)o=s.nextSibling,t.appendChild(s),s=o;t.appendChild(e)}dispose(){const t=this.firstChild.parentNode,e=this.lastChild;let s=this.firstChild,o;for(;s!==e;)o=s.nextSibling,t.removeChild(s),s=o;t.removeChild(e);const n=this.behaviors,r=this.source;for(let a=0,l=n.length;a<l;++a)n[a].unbind(r)}bind(t,e){const s=this.behaviors;if(this.source!==t)if(this.source!==null){const o=this.source;this.source=t,this.context=e;for(let n=0,r=s.length;n<r;++n){const a=s[n];a.unbind(o),a.bind(t,e)}}else{this.source=t,this.context=e;for(let o=0,n=s.length;o<n;++o)s[o].bind(t,e)}}unbind(){if(this.source===null)return;const t=this.behaviors,e=this.source;for(let s=0,o=t.length;s<o;++s)t[s].unbind(e);this.source=null}static disposeContiguousBatch(t){if(t.length!==0){Eo.setStartBefore(t[0].firstChild),Eo.setEndAfter(t[t.length-1].lastChild),Eo.deleteContents();for(let e=0,s=t.length;e<s;++e){const o=t[e],n=o.behaviors,r=o.source;for(let a=0,l=n.length;a<l;++a)n[a].unbind(r)}}}}class fr{constructor(t,e){this.behaviorCount=0,this.hasHostBehaviors=!1,this.fragment=null,this.targetOffset=0,this.viewBehaviorFactories=null,this.hostBehaviorFactories=null,this.html=t,this.directives=e}create(t){if(this.fragment===null){let h;const p=this.html;if(typeof p=="string"){h=document.createElement("template"),h.innerHTML=Y.createHTML(p);const m=h.content.firstElementChild;m!==null&&m.tagName==="TEMPLATE"&&(h=m)}else h=p;const f=Zc(h,this.directives);this.fragment=f.fragment,this.viewBehaviorFactories=f.viewBehaviorFactories,this.hostBehaviorFactories=f.hostBehaviorFactories,this.targetOffset=f.targetOffset,this.behaviorCount=this.viewBehaviorFactories.length+this.hostBehaviorFactories.length,this.hasHostBehaviors=this.hostBehaviorFactories.length>0}const e=this.fragment.cloneNode(!0),s=this.viewBehaviorFactories,o=new Array(this.behaviorCount),n=Y.createTemplateWalker(e);let r=0,a=this.targetOffset,l=n.nextNode();for(let h=s.length;r<h;++r){const p=s[r],f=p.targetIndex;for(;l!==null;)if(a===f){o[r]=p.createBehavior(l);break}else l=n.nextNode(),a++}if(this.hasHostBehaviors){const h=this.hostBehaviorFactories;for(let p=0,f=h.length;p<f;++p,++r)o[r]=h[p].createBehavior(t)}return new pr(e,o)}render(t,e,s){typeof e=="string"&&(e=document.getElementById(e)),s===void 0&&(s=e);const o=this.create(s);return o.bind(t,Ui),o.appendTo(e),o}}const Jc=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;function st(i,...t){const e=[];let s="";for(let o=0,n=i.length-1;o<n;++o){const r=i[o];let a=t[o];if(s+=r,a instanceof fr){const l=a;a=()=>l}if(typeof a=="function"&&(a=new Ro(a)),a instanceof hr){const l=Jc.exec(r);l!==null&&(a.targetName=l[2])}a instanceof Oo?(s+=a.createPlaceholder(e.length),e.push(a)):s+=a}return s+=i[i.length-1],new fr(s,e)}class Et{constructor(){this.targets=new WeakSet}addStylesTo(t){this.targets.add(t)}removeStylesFrom(t){this.targets.delete(t)}isAttachedTo(t){return this.targets.has(t)}withBehaviors(...t){return this.behaviors=this.behaviors===null?t:this.behaviors.concat(t),this}}Et.create=(()=>{if(Y.supportsAdoptedStyleSheets){const i=new Map;return t=>new Kc(t,i)}return i=>new ih(i)})();function Lo(i){return i.map(t=>t instanceof Et?Lo(t.styles):[t]).reduce((t,e)=>t.concat(e),[])}function gr(i){return i.map(t=>t instanceof Et?t.behaviors:null).reduce((t,e)=>e===null?t:(t===null&&(t=[]),t.concat(e)),null)}let mr=(i,t)=>{i.adoptedStyleSheets=[...i.adoptedStyleSheets,...t]},br=(i,t)=>{i.adoptedStyleSheets=i.adoptedStyleSheets.filter(e=>t.indexOf(e)===-1)};if(Y.supportsAdoptedStyleSheets)try{document.adoptedStyleSheets.push(),document.adoptedStyleSheets.splice(),mr=(i,t)=>{i.adoptedStyleSheets.push(...t)},br=(i,t)=>{for(const e of t){const s=i.adoptedStyleSheets.indexOf(e);s!==-1&&i.adoptedStyleSheets.splice(s,1)}}}catch(i){}class Kc extends Et{constructor(t,e){super(),this.styles=t,this.styleSheetCache=e,this._styleSheets=void 0,this.behaviors=gr(t)}get styleSheets(){if(this._styleSheets===void 0){const t=this.styles,e=this.styleSheetCache;this._styleSheets=Lo(t).map(s=>{if(s instanceof CSSStyleSheet)return s;let o=e.get(s);return o===void 0&&(o=new CSSStyleSheet,o.replaceSync(s),e.set(s,o)),o})}return this._styleSheets}addStylesTo(t){mr(t,this.styleSheets),super.addStylesTo(t)}removeStylesFrom(t){br(t,this.styleSheets),super.removeStylesFrom(t)}}let th=0;function eh(){return`fast-style-class-${++th}`}class ih extends Et{constructor(t){super(),this.styles=t,this.behaviors=null,this.behaviors=gr(t),this.styleSheets=Lo(t),this.styleClass=eh()}addStylesTo(t){const e=this.styleSheets,s=this.styleClass;t=this.normalizeTarget(t);for(let o=0;o<e.length;o++){const n=document.createElement("style");n.innerHTML=e[o],n.className=s,t.append(n)}super.addStylesTo(t)}removeStylesFrom(t){t=this.normalizeTarget(t);const e=t.querySelectorAll(`.${this.styleClass}`);for(let s=0,o=e.length;s<o;++s)t.removeChild(e[s]);super.removeStylesFrom(t)}isAttachedTo(t){return super.isAttachedTo(this.normalizeTarget(t))}normalizeTarget(t){return t===document?document.body:t}}const vr=Object.freeze({locate:nr()}),sh={toView(i){return i?"true":"false"},fromView(i){return!(i==null||i==="false"||i===!1||i===0)}};class $o{constructor(t,e,s=e.toLowerCase(),o="reflect",n){this.guards=new Set,this.Owner=t,this.name=e,this.attribute=s,this.mode=o,this.converter=n,this.fieldName=`_${e}`,this.callbackName=`${e}Changed`,this.hasCallback=this.callbackName in t.prototype,o==="boolean"&&n===void 0&&(this.converter=sh)}setValue(t,e){const s=t[this.fieldName],o=this.converter;o!==void 0&&(e=o.fromView(e)),s!==e&&(t[this.fieldName]=e,this.tryReflectToAttribute(t),this.hasCallback&&t[this.callbackName](s,e),t.$fastController.notify(this.name))}getValue(t){return it.track(t,this.name),t[this.fieldName]}onAttributeChangedCallback(t,e){this.guards.has(t)||(this.guards.add(t),this.setValue(t,e),this.guards.delete(t))}tryReflectToAttribute(t){const e=this.mode,s=this.guards;s.has(t)||e==="fromView"||Y.queueUpdate(()=>{s.add(t);const o=t[this.fieldName];switch(e){case"reflect":const n=this.converter;Y.setAttribute(t,this.attribute,n!==void 0?n.toView(o):o);break;case"boolean":Y.setBooleanAttribute(t,this.attribute,o);break}s.delete(t)})}static collect(t,...e){const s=[];e.push(vr.locate(t));for(let o=0,n=e.length;o<n;++o){const r=e[o];if(r!==void 0)for(let a=0,l=r.length;a<l;++a){const h=r[a];typeof h=="string"?s.push(new $o(t,h)):s.push(new $o(t,h.property,h.attribute,h.mode,h.converter))}}return s}}function Ao(i,t){let e;function s(o,n){arguments.length>1&&(e.property=n),vr.locate(o.constructor).push(e)}if(arguments.length>1){e={},s(i,t);return}return e=i===void 0?{}:i,s}const yr={mode:"open"},xr={},Po=Bi.getById(4,()=>{const i=new Map;return Object.freeze({register(t){return i.has(t.type)?!1:(i.set(t.type,t),!0)},getByType(t){return i.get(t)}})});class qi{constructor(t,e=t.definition){typeof e=="string"&&(e={name:e}),this.type=t,this.name=e.name,this.template=e.template;const s=$o.collect(t,e.attributes),o=new Array(s.length),n={},r={};for(let a=0,l=s.length;a<l;++a){const h=s[a];o[a]=h.attribute,n[h.name]=h,r[h.attribute]=h}this.attributes=s,this.observedAttributes=o,this.propertyLookup=n,this.attributeLookup=r,this.shadowOptions=e.shadowOptions===void 0?yr:e.shadowOptions===null?void 0:Object.assign(Object.assign({},yr),e.shadowOptions),this.elementOptions=e.elementOptions===void 0?xr:Object.assign(Object.assign({},xr),e.elementOptions),this.styles=e.styles===void 0?void 0:Array.isArray(e.styles)?Et.create(e.styles):e.styles instanceof Et?e.styles:Et.create([e.styles])}get isDefined(){return!!Po.getByType(this.type)}define(t=customElements){const e=this.type;if(Po.register(this)){const s=this.attributes,o=e.prototype;for(let n=0,r=s.length;n<r;++n)it.defineProperty(o,s[n]);Reflect.defineProperty(e,"observedAttributes",{value:this.observedAttributes,enumerable:!0})}return t.get(this.name)||t.define(this.name,e,this.elementOptions),this}}qi.forType=Po.getByType;const $r=new WeakMap,oh={bubbles:!0,composed:!0,cancelable:!0};function Vo(i){return i.shadowRoot||$r.get(i)||null}class er extends lr{constructor(t,e){super(t),this.boundObservables=null,this.behaviors=null,this.needsInitialization=!0,this._template=null,this._styles=null,this._isConnected=!1,this.$fastController=this,this.view=null,this.element=t,this.definition=e;const s=e.shadowOptions;if(s!==void 0){const n=t.attachShadow(s);s.mode==="closed"&&$r.set(t,n)}const o=it.getAccessors(t);if(o.length>0){const n=this.boundObservables=Object.create(null);for(let r=0,a=o.length;r<a;++r){const l=o[r].name,h=t[l];h!==void 0&&(delete t[l],n[l]=h)}}}get isConnected(){return it.track(this,"isConnected"),this._isConnected}setIsConnected(t){this._isConnected=t,it.notify(this,"isConnected")}get template(){return this._template}set template(t){this._template!==t&&(this._template=t,this.needsInitialization||this.renderTemplate(t))}get styles(){return this._styles}set styles(t){this._styles!==t&&(this._styles!==null&&this.removeStyles(this._styles),this._styles=t,!this.needsInitialization&&t!==null&&this.addStyles(t))}addStyles(t){const e=Vo(this.element)||this.element.getRootNode();if(t instanceof HTMLStyleElement)e.append(t);else if(!t.isAttachedTo(e)){const s=t.behaviors;t.addStylesTo(e),s!==null&&this.addBehaviors(s)}}removeStyles(t){const e=Vo(this.element)||this.element.getRootNode();if(t instanceof HTMLStyleElement)e.removeChild(t);else if(t.isAttachedTo(e)){const s=t.behaviors;t.removeStylesFrom(e),s!==null&&this.removeBehaviors(s)}}addBehaviors(t){const e=this.behaviors||(this.behaviors=new Map),s=t.length,o=[];for(let n=0;n<s;++n){const r=t[n];e.has(r)?e.set(r,e.get(r)+1):(e.set(r,1),o.push(r))}if(this._isConnected){const n=this.element;for(let r=0;r<o.length;++r)o[r].bind(n,Ui)}}removeBehaviors(t,e=!1){const s=this.behaviors;if(s===null)return;const o=t.length,n=[];for(let r=0;r<o;++r){const a=t[r];if(s.has(a)){const l=s.get(a)-1;l===0||e?s.delete(a)&&n.push(a):s.set(a,l)}}if(this._isConnected){const r=this.element;for(let a=0;a<n.length;++a)n[a].unbind(r)}}onConnectedCallback(){if(this._isConnected)return;const t=this.element;this.needsInitialization?this.finishInitialization():this.view!==null&&this.view.bind(t,Ui);const e=this.behaviors;if(e!==null)for(const[s]of e)s.bind(t,Ui);this.setIsConnected(!0)}onDisconnectedCallback(){if(!this._isConnected)return;this.setIsConnected(!1);const t=this.view;t!==null&&t.unbind();const e=this.behaviors;if(e!==null){const s=this.element;for(const[o]of e)o.unbind(s)}}onAttributeChangedCallback(t,e,s){const o=this.definition.attributeLookup[t];o!==void 0&&o.onAttributeChangedCallback(this.element,s)}emit(t,e,s){return this._isConnected?this.element.dispatchEvent(new CustomEvent(t,Object.assign(Object.assign({detail:e},oh),s))):!1}finishInitialization(){const t=this.element,e=this.boundObservables;if(e!==null){const o=Object.keys(e);for(let n=0,r=o.length;n<r;++n){const a=o[n];t[a]=e[a]}this.boundObservables=null}const s=this.definition;this._template===null&&(this.element.resolveTemplate?this._template=this.element.resolveTemplate():s.template&&(this._template=s.template||null)),this._template!==null&&this.renderTemplate(this._template),this._styles===null&&(this.element.resolveStyles?this._styles=this.element.resolveStyles():s.styles&&(this._styles=s.styles||null)),this._styles!==null&&this.addStyles(this._styles),this.needsInitialization=!1}renderTemplate(t){const e=this.element,s=Vo(e)||e;this.view!==null?(this.view.dispose(),this.view=null):this.needsInitialization||Y.removeChildNodes(s),t&&(this.view=t.render(e,s,e))}static forCustomElement(t){const e=t.$fastController;if(e!==void 0)return e;const s=qi.forType(t.constructor);if(s===void 0)throw new Error("Missing FASTElement definition.");return t.$fastController=new er(t,s)}}function wr(i){return class extends i{constructor(){super(),er.forCustomElement(this)}$emit(t,e,s){return this.$fastController.emit(t,e,s)}connectedCallback(){this.$fastController.onConnectedCallback()}disconnectedCallback(){this.$fastController.onDisconnectedCallback()}attributeChangedCallback(t,e,s){this.$fastController.onAttributeChangedCallback(t,e,s)}}}const xi=Object.assign(wr(HTMLElement),{from(i){return wr(i)},define(i,t){return new qi(i,t).define().type}});function kr(i){return function(t){new qi(t,i).define()}}class Mo{createCSS(){return""}createBehavior(){}}function nh(i,t){const e=[];let s="";const o=[];for(let n=0,r=i.length-1;n<r;++n){s+=i[n];let a=t[n];if(a instanceof Mo){const l=a.createBehavior();a=a.createCSS(),l&&o.push(l)}a instanceof Et||a instanceof CSSStyleSheet?(s.trim()!==""&&(e.push(s),s=""),e.push(a)):s+=a}return s+=i[i.length-1],s.trim()!==""&&e.push(s),{styles:e,behaviors:o}}function Cr(i,...t){const{styles:e,behaviors:s}=nh(i,t),o=Et.create(e);return s.length&&o.withBehaviors(...s),o}class hv extends Mo{constructor(t,e){super(),this.behaviors=e,this.css="";const s=t.reduce((o,n)=>(typeof n=="string"?this.css+=n:o.push(n),o),[]);s.length&&(this.styles=Et.create(s))}createBehavior(){return this}createCSS(){return this.css}bind(t){this.styles&&t.$fastController.addStyles(this.styles),this.behaviors.length&&t.$fastController.addBehaviors(this.behaviors)}unbind(t){this.styles&&t.$fastController.removeStyles(this.styles),this.behaviors.length&&t.$fastController.removeBehaviors(this.behaviors)}}function ce(i,t,e){return{index:i,removed:t,addedCount:e}}const Tr=0,Ir=1,zo=2,Ho=3;function rh(i,t,e,s,o,n){const r=n-o+1,a=e-t+1,l=new Array(r);let h,p;for(let f=0;f<r;++f)l[f]=new Array(a),l[f][0]=f;for(let f=0;f<a;++f)l[0][f]=f;for(let f=1;f<r;++f)for(let m=1;m<a;++m)i[t+m-1]===s[o+f-1]?l[f][m]=l[f-1][m-1]:(h=l[f-1][m]+1,p=l[f][m-1]+1,l[f][m]=h<p?h:p);return l}function ah(i){let t=i.length-1,e=i[0].length-1,s=i[t][e];const o=[];for(;t>0||e>0;){if(t===0){o.push(zo),e--;continue}if(e===0){o.push(Ho),t--;continue}const n=i[t-1][e-1],r=i[t-1][e],a=i[t][e-1];let l;r<a?l=r<n?r:n:l=a<n?a:n,l===n?(n===s?o.push(Tr):(o.push(Ir),s=n),t--,e--):l===r?(o.push(Ho),t--,s=r):(o.push(zo),e--,s=a)}return o.reverse(),o}function lh(i,t,e){for(let s=0;s<e;++s)if(i[s]!==t[s])return s;return e}function ch(i,t,e){let s=i.length,o=t.length,n=0;for(;n<e&&i[--s]===t[--o];)n++;return n}function hh(i,t,e,s){return t<e||s<i?-1:t===e||s===i?0:i<e?t<s?t-e:s-e:s<t?s-i:t-i}function Sr(i,t,e,s,o,n){let r=0,a=0;const l=Math.min(e-t,n-o);if(t===0&&o===0&&(r=lh(i,s,l)),e===i.length&&n===s.length&&(a=ch(i,s,l-r)),t+=r,o+=r,e-=a,n-=a,e-t===0&&n-o===0)return Ni;if(t===e){const k=ce(t,[],0);for(;o<n;)k.removed.push(s[o++]);return[k]}else if(o===n)return[ce(t,[],e-t)];const h=ah(rh(i,t,e,s,o,n)),p=[];let f,m=t,w=o;for(let k=0;k<h.length;++k)switch(h[k]){case Tr:f!==void 0&&(p.push(f),f=void 0),m++,w++;break;case Ir:f===void 0&&(f=ce(m,[],0)),f.addedCount++,m++,f.removed.push(s[w]),w++;break;case zo:f===void 0&&(f=ce(m,[],0)),f.addedCount++,m++;break;case Ho:f===void 0&&(f=ce(m,[],0)),f.removed.push(s[w]),w++;break}return f!==void 0&&p.push(f),p}const Fr=Array.prototype.push;function dh(i,t,e,s){const o=ce(t,e,s);let n=!1,r=0;for(let a=0;a<i.length;a++){const l=i[a];if(l.index+=r,n)continue;const h=hh(o.index,o.index+o.removed.length,l.index,l.index+l.addedCount);if(h>=0){i.splice(a,1),a--,r-=l.addedCount-l.removed.length,o.addedCount+=l.addedCount-h;const p=o.removed.length+l.removed.length-h;if(!o.addedCount&&!p)n=!0;else{let f=l.removed;if(o.index<l.index){const m=o.removed.slice(0,l.index-o.index);Fr.apply(m,f),f=m}if(o.index+o.removed.length>l.index+l.addedCount){const m=o.removed.slice(l.index+l.addedCount-o.index);Fr.apply(f,m)}o.removed=f,l.index<o.index&&(o.index=l.index)}}else if(o.index<l.index){n=!0,i.splice(a,0,o),a++;const p=o.addedCount-o.removed.length;l.index+=p,r+=p}}n||i.push(o)}function uh(i){const t=[];for(let e=0,s=i.length;e<s;e++){const o=i[e];dh(t,o.index,o.removed,o.addedCount)}return t}function ph(i,t){let e=[];const s=uh(t);for(let o=0,n=s.length;o<n;++o){const r=s[o];if(r.addedCount===1&&r.removed.length===1){r.removed[0]!==i[r.index]&&e.push(r);continue}e=e.concat(Sr(i,r.index,r.index+r.addedCount,r.removed,0,r.removed.length))}return e}let Or=!1;function Bo(i,t){let e=i.index;const s=t.length;return e>s?e=s-i.addedCount:e<0&&(e=s+i.removed.length+e-i.addedCount),e<0&&(e=0),i.index=e,i}class fh extends Fs{constructor(t){super(t),this.oldCollection=void 0,this.splices=void 0,this.needsQueue=!0,this.call=this.flush,Reflect.defineProperty(t,"$fastController",{value:this,enumerable:!1})}subscribe(t){this.flush(),super.subscribe(t)}addSplice(t){this.splices===void 0?this.splices=[t]:this.splices.push(t),this.needsQueue&&(this.needsQueue=!1,Y.queueUpdate(this))}reset(t){this.oldCollection=t,this.needsQueue&&(this.needsQueue=!1,Y.queueUpdate(this))}flush(){const t=this.splices,e=this.oldCollection;if(t===void 0&&e===void 0)return;this.needsQueue=!0,this.splices=void 0,this.oldCollection=void 0;const s=e===void 0?ph(this.source,t):Sr(this.source,0,this.source.length,e,0,e.length);this.notify(s)}}function gh(){if(Or)return;Or=!0,it.setArrayObserverFactory(l=>new fh(l));const i=Array.prototype;if(i.$fastPatch)return;Reflect.defineProperty(i,"$fastPatch",{value:1,enumerable:!1});const t=i.pop,e=i.push,s=i.reverse,o=i.shift,n=i.sort,r=i.splice,a=i.unshift;i.pop=function(){const l=this.length>0,h=t.apply(this,arguments),p=this.$fastController;return p!==void 0&&l&&p.addSplice(ce(this.length,[h],0)),h},i.push=function(){const l=e.apply(this,arguments),h=this.$fastController;return h!==void 0&&h.addSplice(Bo(ce(this.length-arguments.length,[],arguments.length),this)),l},i.reverse=function(){let l;const h=this.$fastController;h!==void 0&&(h.flush(),l=this.slice());const p=s.apply(this,arguments);return h!==void 0&&h.reset(l),p},i.shift=function(){const l=this.length>0,h=o.apply(this,arguments),p=this.$fastController;return p!==void 0&&l&&p.addSplice(ce(0,[h],0)),h},i.sort=function(){let l;const h=this.$fastController;h!==void 0&&(h.flush(),l=this.slice());const p=n.apply(this,arguments);return h!==void 0&&h.reset(l),p},i.splice=function(){const l=r.apply(this,arguments),h=this.$fastController;return h!==void 0&&h.addSplice(Bo(ce(+arguments[0],l,arguments.length>2?arguments.length-2:0),this)),l},i.unshift=function(){const l=a.apply(this,arguments),h=this.$fastController;return h!==void 0&&h.addSplice(Bo(ce(0,[],arguments.length),this)),l}}const Rr=i=>typeof i=="function",mh=()=>null;function Dr(i){return i===void 0?mh:Rr(i)?i:()=>i}function Gt(i,t,e){const s=Rr(i)?i:()=>i,o=Dr(t),n=Dr(e);return(r,a)=>s(r,a)?o(r,a):n(r,a)}const Er=Object.freeze({positioning:!1,recycle:!0});function bh(i,t,e,s){i.bind(t[e],s)}function vh(i,t,e,s){const o=Object.create(s);o.index=e,o.length=t.length,i.bind(t[e],o)}class yh{constructor(t,e,s,o,n,r){this.location=t,this.itemsBinding=e,this.templateBinding=o,this.options=r,this.source=null,this.views=[],this.items=null,this.itemsObserver=null,this.originalContext=void 0,this.childContext=void 0,this.bindView=bh,this.itemsBindingObserver=it.binding(e,this,s),this.templateBindingObserver=it.binding(o,this,n),r.positioning&&(this.bindView=vh)}bind(t,e){this.source=t,this.originalContext=e,this.childContext=Object.create(e),this.childContext.parent=t,this.childContext.parentContext=this.originalContext,this.items=this.itemsBindingObserver.observe(t,this.originalContext),this.template=this.templateBindingObserver.observe(t,this.originalContext),this.observeItems(!0),this.refreshAllViews()}unbind(){this.source=null,this.items=null,this.itemsObserver!==null&&this.itemsObserver.unsubscribe(this),this.unbindAllViews(),this.itemsBindingObserver.disconnect(),this.templateBindingObserver.disconnect()}handleChange(t,e){t===this.itemsBinding?(this.items=this.itemsBindingObserver.observe(this.source,this.originalContext),this.observeItems(),this.refreshAllViews()):t===this.templateBinding?(this.template=this.templateBindingObserver.observe(this.source,this.originalContext),this.refreshAllViews(!0)):this.updateViews(e)}observeItems(t=!1){if(!this.items){this.items=Ni;return}const e=this.itemsObserver,s=this.itemsObserver=it.getNotifier(this.items),o=e!==s;o&&e!==null&&e.unsubscribe(this),(o||t)&&s.subscribe(this)}updateViews(t){const e=this.childContext,s=this.views,o=this.bindView,n=this.items,r=this.template,a=this.options.recycle,l=[];let h=0,p=0;for(let f=0,m=t.length;f<m;++f){const w=t[f],k=w.removed;let F=0,V=w.index;const vt=V+w.addedCount,et=s.splice(w.index,k.length),zi=p=l.length+et.length;for(;V<vt;++V){const ge=s[V],Hi=ge?ge.firstChild:this.location;let qt;a&&p>0?(F<=zi&&et.length>0?(qt=et[F],F++):(qt=l[h],h++),p--):qt=r.create(),s.splice(V,0,qt),o(qt,n,V,e),qt.insertBefore(Hi)}et[F]&&l.push(...et.slice(F))}for(let f=h,m=l.length;f<m;++f)l[f].dispose();if(this.options.positioning)for(let f=0,m=s.length;f<m;++f){const w=s[f].context;w.length=m,w.index=f}}refreshAllViews(t=!1){const e=this.items,s=this.childContext,o=this.template,n=this.location,r=this.bindView;let a=e.length,l=this.views,h=l.length;if((a===0||t||!this.options.recycle)&&(pr.disposeContiguousBatch(l),h=0),h===0){this.views=l=new Array(a);for(let p=0;p<a;++p){const f=o.create();r(f,e,p,s),l[p]=f,f.insertBefore(n)}}else{let p=0;for(;p<a;++p)if(p<h){const m=l[p];r(m,e,p,s)}else{const m=o.create();r(m,e,p,s),l.push(m),m.insertBefore(n)}const f=l.splice(p,h-p);for(p=0,a=f.length;p<a;++p)f[p].dispose()}}unbindAllViews(){const t=this.views;for(let e=0,s=t.length;e<s;++e)t[e].unbind()}}class xh extends Oo{constructor(t,e,s){super(),this.itemsBinding=t,this.templateBinding=e,this.options=s,this.createPlaceholder=Y.createBlockPlaceholder,gh(),this.isItemsBindingVolatile=it.isVolatileBinding(t),this.isTemplateBindingVolatile=it.isVolatileBinding(e)}createBehavior(t){return new yh(t,this.itemsBinding,this.isItemsBindingVolatile,this.templateBinding,this.isTemplateBindingVolatile,this.options)}}function Xe(i,t,e=Er){const s=typeof t=="function"?t:()=>t;return new xh(i,s,Object.assign(Object.assign({},Er),e))}/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */function Os(i,t,e,s){var o=arguments.length,n=o<3?t:s===null?s=Object.getOwnPropertyDescriptor(t,e):s,r;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(i,t,e,s);else for(var a=i.length-1;a>=0;a--)(r=i[a])&&(n=(o<3?r(n):o>3?r(t,e,n):r(t,e))||n);return o>3&&n&&Object.defineProperty(t,e,n),n}const No=new Map;"metadata"in Reflect||(Reflect.metadata=function(i,t){return function(e){Reflect.defineMetadata(i,t,e)}},Reflect.defineMetadata=function(i,t,e){let s=No.get(e);s===void 0&&No.set(e,s=new Map),s.set(i,t)},Reflect.getOwnMetadata=function(i,t){const e=No.get(t);if(e!==void 0)return e.get(i)});class $h{constructor(t,e){this.container=t,this.key=e}instance(t){return this.registerResolver(0,t)}singleton(t){return this.registerResolver(1,t)}transient(t){return this.registerResolver(2,t)}callback(t){return this.registerResolver(3,t)}cachedCallback(t){return this.registerResolver(3,Hr(t))}aliasTo(t){return this.registerResolver(5,t)}registerResolver(t,e){const{container:s,key:o}=this;return this.container=this.key=void 0,s.registerResolver(o,new Kt(o,t,e))}}function Gi(i){const t=i.slice(),e=Object.keys(i),s=e.length;let o;for(let n=0;n<s;++n)o=e[n],_r(o)||(t[o]=i[o]);return t}const wh=Object.freeze({none(i){throw Error(`${i.toString()} not registered, did you forget to add @singleton()?`)},singleton(i){return new Kt(i,1,i)},transient(i){return new Kt(i,2,i)}}),jo=Object.freeze({default:Object.freeze({parentLocator:()=>null,responsibleForOwnerRequests:!1,defaultResolver:wh.singleton})}),Lr=new Map;function Ar(i){return t=>Reflect.getOwnMetadata(i,t)}let Pr=null;const ot=Object.freeze({createContainer(i){return new ks(null,Object.assign({},jo.default,i))},findResponsibleContainer(i){const t=i.$$container$$;return t&&t.responsibleForOwnerRequests?t:ot.findParentContainer(i)},findParentContainer(i){const t=new CustomEvent(zr,{bubbles:!0,composed:!0,cancelable:!0,detail:{container:void 0}});return i.dispatchEvent(t),t.detail.container||ot.getOrCreateDOMContainer()},getOrCreateDOMContainer(i,t){return i?i.$$container$$||new ks(i,Object.assign({},jo.default,t,{parentLocator:ot.findParentContainer})):Pr||(Pr=new ks(null,Object.assign({},jo.default,t,{parentLocator:()=>null})))},getDesignParamtypes:Ar("design:paramtypes"),getAnnotationParamtypes:Ar("di:paramtypes"),getOrCreateAnnotationParamTypes(i){let t=this.getAnnotationParamtypes(i);return t===void 0&&Reflect.defineMetadata("di:paramtypes",t=[],i),t},getDependencies(i){let t=Lr.get(i);if(t===void 0){const e=i.inject;if(e===void 0){const s=ot.getDesignParamtypes(i),o=ot.getAnnotationParamtypes(i);if(s===void 0)if(o===void 0){const n=Object.getPrototypeOf(i);typeof n=="function"&&n!==Function.prototype?t=Gi(ot.getDependencies(n)):t=[]}else t=Gi(o);else if(o===void 0)t=Gi(s);else{t=Gi(s);let n=o.length,r;for(let h=0;h<n;++h)r=o[h],r!==void 0&&(t[h]=r);const a=Object.keys(o);n=a.length;let l;for(let h=0;h<n;++h)l=a[h],_r(l)||(t[l]=o[l])}}else t=Gi(e);Lr.set(i,t)}return t},defineProperty(i,t,e,s=!1){const o=`$di_${t}`;Reflect.defineProperty(i,t,{get:function(){let n=this[o];if(n===void 0&&(n=(this instanceof HTMLElement?ot.findResponsibleContainer(this):ot.getOrCreateDOMContainer()).get(e),this[o]=n,s&&this instanceof xi)){const a=this.$fastController,l=()=>{const p=ot.findResponsibleContainer(this).get(e),f=this[o];p!==f&&(this[o]=n,a.notify(t))};a.subscribe({handleChange:l},"isConnected")}return n}})},createInterface(i,t){const e=typeof i=="function"?i:t,s=typeof i=="string"?i:i&&"friendlyName"in i&&i.friendlyName||Nr,o=typeof i=="string"?!1:i&&"respectConnection"in i&&i.respectConnection||!1,n=function(r,a,l){if(r==null||new.target!==void 0)throw new Error(`No registration for interface: '${n.friendlyName}'`);if(a)ot.defineProperty(r,a,n,o);else{const h=ot.getOrCreateAnnotationParamTypes(r);h[l]=n}};return n.$isInterface=!0,n.friendlyName=s==null?"(anonymous)":s,e!=null&&(n.register=function(r,a){return e(new $h(r,a!=null?a:n))}),n.toString=function(){return`InterfaceSymbol<${n.friendlyName}>`},n},inject(...i){return function(t,e,s){if(typeof s=="number"){const o=ot.getOrCreateAnnotationParamTypes(t),n=i[0];n!==void 0&&(o[s]=n)}else if(e)ot.defineProperty(t,e,i[0]);else{const o=s?ot.getOrCreateAnnotationParamTypes(s.value):ot.getOrCreateAnnotationParamTypes(t);let n;for(let r=0;r<i.length;++r)n=i[r],n!==void 0&&(o[r]=n)}}},transient(i){return i.register=function(e){return Wi.transient(i,i).register(e)},i.registerInRequestor=!1,i},singleton(i,t=Ch){return i.register=function(s){return Wi.singleton(i,i).register(s)},i.registerInRequestor=t.scoped,i}}),kh=ot.createInterface("Container");ot.inject;const Ch={scoped:!1};class Kt{constructor(t,e,s){this.key=t,this.strategy=e,this.state=s,this.resolving=!1}get $isResolver(){return!0}register(t){return t.registerResolver(this.key,this)}resolve(t,e){switch(this.strategy){case 0:return this.state;case 1:{if(this.resolving)throw new Error(`Cyclic dependency found: ${this.state.name}`);return this.resolving=!0,this.state=t.getFactory(this.state).construct(e),this.strategy=0,this.resolving=!1,this.state}case 2:{const s=t.getFactory(this.state);if(s===null)throw new Error(`Resolver for ${String(this.key)} returned a null factory`);return s.construct(e)}case 3:return this.state(t,e,this);case 4:return this.state[0].resolve(t,e);case 5:return e.get(this.state);default:throw new Error(`Invalid resolver strategy specified: ${this.strategy}.`)}}getFactory(t){var e,s,o;switch(this.strategy){case 1:case 2:return t.getFactory(this.state);case 5:return(o=(s=(e=t.getResolver(this.state))===null||e===void 0?void 0:e.getFactory)===null||s===void 0?void 0:s.call(e,t))!==null&&o!==void 0?o:null;default:return null}}}function Vr(i){return this.get(i)}function Th(i,t){return t(i)}class Ih{constructor(t,e){this.Type=t,this.dependencies=e,this.transformers=null}construct(t,e){let s;return e===void 0?s=new this.Type(...this.dependencies.map(Vr,t)):s=new this.Type(...this.dependencies.map(Vr,t),...e),this.transformers==null?s:this.transformers.reduce(Th,s)}registerTransformer(t){(this.transformers||(this.transformers=[])).push(t)}}const Sh={$isResolver:!0,resolve(i,t){return t}};function Rs(i){return typeof i.register=="function"}function Fh(i){return Rs(i)&&typeof i.registerInRequestor=="boolean"}function Mr(i){return Fh(i)&&i.registerInRequestor}function Oh(i){return i.prototype!==void 0}const Rh=new Set(["Array","ArrayBuffer","Boolean","DataView","Date","Error","EvalError","Float32Array","Float64Array","Function","Int8Array","Int16Array","Int32Array","Map","Number","Object","Promise","RangeError","ReferenceError","RegExp","Set","SharedArrayBuffer","String","SyntaxError","TypeError","Uint8Array","Uint8ClampedArray","Uint16Array","Uint32Array","URIError","WeakMap","WeakSet"]),zr="__DI_LOCATE_PARENT__",_o=new Map;class ks{constructor(t,e){this.owner=t,this.config=e,this._parent=void 0,this.registerDepth=0,this.context=null,t!==null&&(t.$$container$$=this),this.resolvers=new Map,this.resolvers.set(kh,Sh),t instanceof Node&&t.addEventListener(zr,s=>{s.composedPath()[0]!==this.owner&&(s.detail.container=this,s.stopImmediatePropagation())})}get parent(){return this._parent===void 0&&(this._parent=this.config.parentLocator(this.owner)),this._parent}get depth(){return this.parent===null?0:this.parent.depth+1}get responsibleForOwnerRequests(){return this.config.responsibleForOwnerRequests}registerWithContext(t,...e){return this.context=t,this.register(...e),this.context=null,this}register(...t){if(++this.registerDepth===100)throw new Error("Unable to autoregister dependency");let e,s,o,n,r;const a=this.context;for(let l=0,h=t.length;l<h;++l)if(e=t[l],!!jr(e))if(Rs(e))e.register(this,a);else if(Oh(e))Wi.singleton(e,e).register(this);else for(s=Object.keys(e),n=0,r=s.length;n<r;++n)o=e[s[n]],jr(o)&&(Rs(o)?o.register(this,a):this.register(o));return--this.registerDepth,this}registerResolver(t,e){Ds(t);const s=this.resolvers,o=s.get(t);return o==null?s.set(t,e):o instanceof Kt&&o.strategy===4?o.state.push(e):s.set(t,new Kt(t,4,[o,e])),e}registerTransformer(t,e){const s=this.getResolver(t);if(s==null)return!1;if(s.getFactory){const o=s.getFactory(this);return o==null?!1:(o.registerTransformer(e),!0)}return!1}getResolver(t,e=!0){if(Ds(t),t.resolve!==void 0)return t;let s=this,o;for(;s!=null;)if(o=s.resolvers.get(t),o==null){if(s.parent==null){const n=Mr(t)?this:s;return e?this.jitRegister(t,n):null}s=s.parent}else return o;return null}has(t,e=!1){return this.resolvers.has(t)?!0:e&&this.parent!=null?this.parent.has(t,!0):!1}get(t){if(Ds(t),t.$isResolver)return t.resolve(this,this);let e=this,s;for(;e!=null;)if(s=e.resolvers.get(t),s==null){if(e.parent==null){const o=Mr(t)?this:e;return s=this.jitRegister(t,o),s.resolve(e,this)}e=e.parent}else return s.resolve(e,this);throw new Error(`Unable to resolve key: ${t}`)}getAll(t,e=!1){Ds(t);const s=this;let o=s,n;if(e){let r=Ni;for(;o!=null;)n=o.resolvers.get(t),n!=null&&(r=r.concat(Br(n,o,s))),o=o.parent;return r}else for(;o!=null;)if(n=o.resolvers.get(t),n==null){if(o=o.parent,o==null)return Ni}else return Br(n,o,s);return Ni}getFactory(t){let e=_o.get(t);if(e===void 0){if(Dh(t))throw new Error(`${t.name} is a native function and therefore cannot be safely constructed by DI. If this is intentional, please use a callback or cachedCallback resolver.`);_o.set(t,e=new Ih(t,ot.getDependencies(t)))}return e}registerFactory(t,e){_o.set(t,e)}createChild(t){return new ks(null,Object.assign({},this.config,t,{parentLocator:()=>this}))}jitRegister(t,e){if(typeof t!="function")throw new Error(`Attempted to jitRegister something that is not a constructor: '${t}'. Did you forget to register this dependency?`);if(Rh.has(t.name))throw new Error(`Attempted to jitRegister an intrinsic type: ${t.name}. Did you forget to add @inject(Key)`);if(Rs(t)){const s=t.register(e);if(!(s instanceof Object)||s.resolve==null){const o=e.resolvers.get(t);if(o!=null)return o;throw new Error("A valid resolver was not returned from the static register method")}return s}else{if(t.$isInterface)throw new Error(`Attempted to jitRegister an interface: ${t.friendlyName}`);{const s=this.config.defaultResolver(t,e);return e.resolvers.set(t,s),s}}}}const Uo=new WeakMap;function Hr(i){return function(t,e,s){if(Uo.has(s))return Uo.get(s);const o=i(t,e,s);return Uo.set(s,o),o}}const Wi=Object.freeze({instance(i,t){return new Kt(i,0,t)},singleton(i,t){return new Kt(i,1,t)},transient(i,t){return new Kt(i,2,t)},callback(i,t){return new Kt(i,3,t)},cachedCallback(i,t){return new Kt(i,3,Hr(t))},aliasTo(i,t){return new Kt(t,5,i)}});function Ds(i){if(i==null)throw new Error("key/value cannot be null or undefined. Are you trying to inject/register something that doesn't exist with DI?")}function Br(i,t,e){if(i instanceof Kt&&i.strategy===4){const s=i.state;let o=s.length;const n=new Array(o);for(;o--;)n[o]=s[o].resolve(t,e);return n}return[i.resolve(t,e)]}const Nr="(anonymous)";function jr(i){return typeof i=="object"&&i!==null||typeof i=="function"}const Dh=function(){const i=new WeakMap;let t=!1,e="",s=0;return function(o){return t=i.get(o),t===void 0&&(e=o.toString(),s=e.length,t=s>=29&&s<=100&&e.charCodeAt(s-1)===125&&e.charCodeAt(s-2)<=32&&e.charCodeAt(s-3)===93&&e.charCodeAt(s-4)===101&&e.charCodeAt(s-5)===100&&e.charCodeAt(s-6)===111&&e.charCodeAt(s-7)===99&&e.charCodeAt(s-8)===32&&e.charCodeAt(s-9)===101&&e.charCodeAt(s-10)===118&&e.charCodeAt(s-11)===105&&e.charCodeAt(s-12)===116&&e.charCodeAt(s-13)===97&&e.charCodeAt(s-14)===110&&e.charCodeAt(s-15)===88,i.set(o,t)),t}}(),Es={};function _r(i){switch(typeof i){case"number":return i>=0&&(i|0)===i;case"string":{const t=Es[i];if(t!==void 0)return t;const e=i.length;if(e===0)return Es[i]=!1;let s=0;for(let o=0;o<e;++o)if(s=i.charCodeAt(o),o===0&&s===48&&e>1||s<48||s>57)return Es[i]=!1;return Es[i]=!0}default:return!1}}function Ur(i){return`${i.toLowerCase()}:presentation`}const Ls=new Map,qr=Object.freeze({define(i,t,e){const s=Ur(i);Ls.get(s)===void 0?Ls.set(s,t):Ls.set(s,!1),e.register(Wi.instance(s,t))},forTag(i,t){const e=Ur(i),s=Ls.get(e);return s===!1?ot.findResponsibleContainer(t).get(e):s||null}});class Eh{constructor(t,e){this.template=t||null,this.styles=e===void 0?null:Array.isArray(e)?Et.create(e):e instanceof Et?e:Et.create([e])}applyTo(t){const e=t.$fastController;e.template===null&&(e.template=this.template),e.styles===null&&(e.styles=this.styles)}}class Vi extends xi{constructor(){super(...arguments),this._presentation=void 0}get $presentation(){return this._presentation===void 0&&(this._presentation=qr.forTag(this.tagName,this)),this._presentation}templateChanged(){this.template!==void 0&&(this.$fastController.template=this.template)}stylesChanged(){this.styles!==void 0&&(this.$fastController.styles=this.styles)}connectedCallback(){this.$presentation!==null&&this.$presentation.applyTo(this),super.connectedCallback()}static compose(t){return(e={})=>new Lh(this===Vi?class extends Vi{}:this,t,e)}}Os([Ft],Vi.prototype,"template",void 0),Os([Ft],Vi.prototype,"styles",void 0);function Xi(i,t,e){return typeof i=="function"?i(t,e):i}class Lh{constructor(t,e,s){this.type=t,this.elementDefinition=e,this.overrideDefinition=s,this.definition=Object.assign(Object.assign({},this.elementDefinition),this.overrideDefinition)}register(t,e){const s=this.definition,o=this.overrideDefinition,r=`${s.prefix||e.elementPrefix}-${s.baseName}`;e.tryDefineElement({name:r,type:this.type,baseClass:this.elementDefinition.baseClass,callback:a=>{const l=new Eh(Xi(s.template,a,s),Xi(s.styles,a,s));a.definePresentation(l);let h=Xi(s.shadowOptions,a,s);a.shadowRootMode&&(h?o.shadowOptions||(h.mode=a.shadowRootMode):h!==null&&(h={mode:a.shadowRootMode})),a.defineElement({elementOptions:Xi(s.elementOptions,a,s),shadowOptions:h,attributes:Xi(s.attributes,a,s)})}})}}function Ah(){return!!(typeof window<"u"&&window.document&&window.document.createElement)}function qo(i){const t=i.parentElement;if(t)return t;{const e=i.getRootNode();if(e.host instanceof HTMLElement)return e.host}return null}function Ph(i,t){let e=t;for(;e!==null;){if(e===i)return!0;e=qo(e)}return!1}const Ce=document.createElement("div");function Vh(i){return i instanceof xi}class Go{setProperty(t,e){Y.queueUpdate(()=>this.target.setProperty(t,e))}removeProperty(t){Y.queueUpdate(()=>this.target.removeProperty(t))}}class Mh extends Go{constructor(t){super();const e=new CSSStyleSheet;this.target=e.cssRules[e.insertRule(":host{}")].style,t.$fastController.addStyles(Et.create([e]))}}class zh extends Go{constructor(){super();const t=new CSSStyleSheet;this.target=t.cssRules[t.insertRule(":root{}")].style,document.adoptedStyleSheets=[...document.adoptedStyleSheets,t]}}class Hh extends Go{constructor(){super(),this.style=document.createElement("style"),document.head.appendChild(this.style);const{sheet:t}=this.style;if(t){const e=t.insertRule(":root{}",t.cssRules.length);this.target=t.cssRules[e].style}}}class Gr{constructor(t){this.store=new Map,this.target=null;const e=t.$fastController;this.style=document.createElement("style"),e.addStyles(this.style),it.getNotifier(e).subscribe(this,"isConnected"),this.handleChange(e,"isConnected")}targetChanged(){if(this.target!==null)for(const[t,e]of this.store.entries())this.target.setProperty(t,e)}setProperty(t,e){this.store.set(t,e),Y.queueUpdate(()=>{this.target!==null&&this.target.setProperty(t,e)})}removeProperty(t){this.store.delete(t),Y.queueUpdate(()=>{this.target!==null&&this.target.removeProperty(t)})}handleChange(t,e){const{sheet:s}=this.style;if(s){const o=s.insertRule(":host{}",s.cssRules.length);this.target=s.cssRules[o].style}else this.target=null}}Os([Ft],Gr.prototype,"target",void 0);class Bh{constructor(t){this.target=t.style}setProperty(t,e){Y.queueUpdate(()=>this.target.setProperty(t,e))}removeProperty(t){Y.queueUpdate(()=>this.target.removeProperty(t))}}class yt{setProperty(t,e){yt.properties[t]=e;for(const s of yt.roots.values())$i.getOrCreate(yt.normalizeRoot(s)).setProperty(t,e)}removeProperty(t){delete yt.properties[t];for(const e of yt.roots.values())$i.getOrCreate(yt.normalizeRoot(e)).removeProperty(t)}static registerRoot(t){const{roots:e}=yt;if(!e.has(t)){e.add(t);const s=$i.getOrCreate(this.normalizeRoot(t));for(const o in yt.properties)s.setProperty(o,yt.properties[o])}}static unregisterRoot(t){const{roots:e}=yt;if(e.has(t)){e.delete(t);const s=$i.getOrCreate(yt.normalizeRoot(t));for(const o in yt.properties)s.removeProperty(o)}}static normalizeRoot(t){return t===Ce?document:t}}yt.roots=new Set,yt.properties={};const Wo=new WeakMap,Nh=Y.supportsAdoptedStyleSheets?Mh:Gr,$i=Object.freeze({getOrCreate(i){if(Wo.has(i))return Wo.get(i);let t;return i===Ce?t=new yt:i instanceof Document?t=Y.supportsAdoptedStyleSheets?new zh:new Hh:Vh(i)?t=new Nh(i):t=new Bh(i),Wo.set(i,t),t}});class zt extends Mo{constructor(t){super(),this.subscribers=new WeakMap,this._appliedTo=new Set,this.name=t.name,t.cssCustomPropertyName!==null&&(this.cssCustomProperty=`--${t.cssCustomPropertyName}`,this.cssVar=`var(${this.cssCustomProperty})`),this.id=zt.uniqueId(),zt.tokensById.set(this.id,this)}get appliedTo(){return[...this._appliedTo]}static from(t){return new zt({name:typeof t=="string"?t:t.name,cssCustomPropertyName:typeof t=="string"?t:t.cssCustomPropertyName===void 0?t.name:t.cssCustomPropertyName})}static isCSSDesignToken(t){return typeof t.cssCustomProperty=="string"}static isDerivedDesignTokenValue(t){return typeof t=="function"}static getTokenById(t){return zt.tokensById.get(t)}getOrCreateSubscriberSet(t=this){return this.subscribers.get(t)||this.subscribers.set(t,new Set)&&this.subscribers.get(t)}createCSS(){return this.cssVar||""}getValueFor(t){const e=dt.getOrCreate(t).get(this);if(e!==void 0)return e;throw new Error(`Value could not be retrieved for token named "${this.name}". Ensure the value is set for ${t} or an ancestor of ${t}.`)}setValueFor(t,e){return this._appliedTo.add(t),e instanceof zt&&(e=this.alias(e)),dt.getOrCreate(t).set(this,e),this}deleteValueFor(t){return this._appliedTo.delete(t),dt.existsFor(t)&&dt.getOrCreate(t).delete(this),this}withDefault(t){return this.setValueFor(Ce,t),this}subscribe(t,e){const s=this.getOrCreateSubscriberSet(e);e&&!dt.existsFor(e)&&dt.getOrCreate(e),s.has(t)||s.add(t)}unsubscribe(t,e){const s=this.subscribers.get(e||this);s&&s.has(t)&&s.delete(t)}notify(t){const e=Object.freeze({token:this,target:t});this.subscribers.has(this)&&this.subscribers.get(this).forEach(s=>s.handleChange(e)),this.subscribers.has(t)&&this.subscribers.get(t).forEach(s=>s.handleChange(e))}alias(t){return e=>t.getValueFor(e)}}zt.uniqueId=(()=>{let i=0;return()=>(i++,i.toString(16))})(),zt.tokensById=new Map;class jh{startReflection(t,e){t.subscribe(this,e),this.handleChange({token:t,target:e})}stopReflection(t,e){t.unsubscribe(this,e),this.remove(t,e)}handleChange(t){const{token:e,target:s}=t;this.add(e,s)}add(t,e){$i.getOrCreate(e).setProperty(t.cssCustomProperty,this.resolveCSSValue(dt.getOrCreate(e).get(t)))}remove(t,e){$i.getOrCreate(e).removeProperty(t.cssCustomProperty)}resolveCSSValue(t){return t&&typeof t.createCSS=="function"?t.createCSS():t}}class _h{constructor(t,e,s){this.source=t,this.token=e,this.node=s,this.dependencies=new Set,this.observer=it.binding(t,this,!1),this.observer.handleChange=this.observer.call,this.handleChange()}disconnect(){this.observer.disconnect()}handleChange(){this.node.store.set(this.token,this.observer.observe(this.node.target,Ui))}}class Uh{constructor(){this.values=new Map}set(t,e){this.values.get(t)!==e&&(this.values.set(t,e),it.getNotifier(this).notify(t.id))}get(t){return it.track(this,t.id),this.values.get(t)}delete(t){this.values.delete(t)}all(){return this.values.entries()}}const Yi=new WeakMap,Qi=new WeakMap;class dt{constructor(t){this.target=t,this.store=new Uh,this.children=[],this.assignedValues=new Map,this.reflecting=new Set,this.bindingObservers=new Map,this.tokenValueChangeHandler={handleChange:(e,s)=>{const o=zt.getTokenById(s);if(o&&(o.notify(this.target),zt.isCSSDesignToken(o))){const n=this.parent,r=this.isReflecting(o);if(n){const a=n.get(o),l=e.get(o);a!==l&&!r?this.reflectToCSS(o):a===l&&r&&this.stopReflectToCSS(o)}else r||this.reflectToCSS(o)}}},Yi.set(t,this),it.getNotifier(this.store).subscribe(this.tokenValueChangeHandler),t instanceof xi?t.$fastController.addBehaviors([this]):t.isConnected&&this.bind()}static getOrCreate(t){return Yi.get(t)||new dt(t)}static existsFor(t){return Yi.has(t)}static findParent(t){if(Ce!==t.target){let e=qo(t.target);for(;e!==null;){if(Yi.has(e))return Yi.get(e);e=qo(e)}return dt.getOrCreate(Ce)}return null}static findClosestAssignedNode(t,e){let s=e;do{if(s.has(t))return s;s=s.parent?s.parent:s.target!==Ce?dt.getOrCreate(Ce):null}while(s!==null);return null}get parent(){return Qi.get(this)||null}has(t){return this.assignedValues.has(t)}get(t){const e=this.store.get(t);if(e!==void 0)return e;const s=this.getRaw(t);if(s!==void 0)return this.hydrate(t,s),this.get(t)}getRaw(t){var e;return this.assignedValues.has(t)?this.assignedValues.get(t):(e=dt.findClosestAssignedNode(t,this))===null||e===void 0?void 0:e.getRaw(t)}set(t,e){zt.isDerivedDesignTokenValue(this.assignedValues.get(t))&&this.tearDownBindingObserver(t),this.assignedValues.set(t,e),zt.isDerivedDesignTokenValue(e)?this.setupBindingObserver(t,e):this.store.set(t,e)}delete(t){this.assignedValues.delete(t),this.tearDownBindingObserver(t);const e=this.getRaw(t);e?this.hydrate(t,e):this.store.delete(t)}bind(){const t=dt.findParent(this);t&&t.appendChild(this);for(const e of this.assignedValues.keys())e.notify(this.target)}unbind(){this.parent&&Qi.get(this).removeChild(this)}appendChild(t){t.parent&&Qi.get(t).removeChild(t);const e=this.children.filter(s=>t.contains(s));Qi.set(t,this),this.children.push(t),e.forEach(s=>t.appendChild(s)),it.getNotifier(this.store).subscribe(t);for(const[s,o]of this.store.all())t.hydrate(s,this.bindingObservers.has(s)?this.getRaw(s):o)}removeChild(t){const e=this.children.indexOf(t);return e!==-1&&this.children.splice(e,1),it.getNotifier(this.store).unsubscribe(t),t.parent===this?Qi.delete(t):!1}contains(t){return Ph(this.target,t.target)}reflectToCSS(t){this.isReflecting(t)||(this.reflecting.add(t),dt.cssCustomPropertyReflector.startReflection(t,this.target))}stopReflectToCSS(t){this.isReflecting(t)&&(this.reflecting.delete(t),dt.cssCustomPropertyReflector.stopReflection(t,this.target))}isReflecting(t){return this.reflecting.has(t)}handleChange(t,e){const s=zt.getTokenById(e);s&&this.hydrate(s,this.getRaw(s))}hydrate(t,e){if(!this.has(t)){const s=this.bindingObservers.get(t);zt.isDerivedDesignTokenValue(e)?s?s.source!==e&&(this.tearDownBindingObserver(t),this.setupBindingObserver(t,e)):this.setupBindingObserver(t,e):(s&&this.tearDownBindingObserver(t),this.store.set(t,e))}}setupBindingObserver(t,e){const s=new _h(e,t,this);return this.bindingObservers.set(t,s),s}tearDownBindingObserver(t){return this.bindingObservers.has(t)?(this.bindingObservers.get(t).disconnect(),this.bindingObservers.delete(t),!0):!1}}dt.cssCustomPropertyReflector=new jh,Os([Ft],dt.prototype,"children",void 0);function qh(i){return zt.from(i)}const Gh=Object.freeze({create:qh,notifyConnection(i){return!i.isConnected||!dt.existsFor(i)?!1:(dt.getOrCreate(i).bind(),!0)},notifyDisconnection(i){return i.isConnected||!dt.existsFor(i)?!1:(dt.getOrCreate(i).unbind(),!0)},registerRoot(i=Ce){yt.registerRoot(i)},unregisterRoot(i=Ce){yt.unregisterRoot(i)}}),Xo=Object.freeze({definitionCallbackOnly:null,ignoreDuplicate:Symbol()}),Yo=new Map,As=new Map;let wi=null;const Zi=ot.createInterface(i=>i.cachedCallback(t=>(wi===null&&(wi=new Xr(null,t)),wi))),Wr=Object.freeze({tagFor(i){return As.get(i)},responsibleFor(i){const t=i.$$designSystem$$;return t||ot.findResponsibleContainer(i).get(Zi)},getOrCreate(i){if(!i)return wi===null&&(wi=ot.getOrCreateDOMContainer().get(Zi)),wi;const t=i.$$designSystem$$;if(t)return t;const e=ot.getOrCreateDOMContainer(i);if(e.has(Zi,!1))return e.get(Zi);{const s=new Xr(i,e);return e.register(Wi.instance(Zi,s)),s}}});function Wh(i,t,e){return typeof i=="string"?{name:i,type:t,callback:e}:i}class Xr{constructor(t,e){this.owner=t,this.container=e,this.designTokensInitialized=!1,this.prefix="fast",this.shadowRootMode=void 0,this.disambiguate=()=>Xo.definitionCallbackOnly,t!==null&&(t.$$designSystem$$=this)}withPrefix(t){return this.prefix=t,this}withShadowRootMode(t){return this.shadowRootMode=t,this}withElementDisambiguation(t){return this.disambiguate=t,this}withDesignTokenRoot(t){return this.designTokenRoot=t,this}register(...t){const e=this.container,s=[],o=this.disambiguate,n=this.shadowRootMode,r={elementPrefix:this.prefix,tryDefineElement(a,l,h){const p=Wh(a,l,h),{name:f,callback:m,baseClass:w}=p;let{type:k}=p,F=f,V=Yo.get(F),vt=!0;for(;V;){const et=o(F,k,V);switch(et){case Xo.ignoreDuplicate:return;case Xo.definitionCallbackOnly:vt=!1,V=void 0;break;default:F=et,V=Yo.get(F);break}}vt&&((As.has(k)||k===Vi)&&(k=class extends k{}),Yo.set(F,k),As.set(k,F),w&&As.set(w,F)),s.push(new Xh(e,F,k,n,m,vt))}};this.designTokensInitialized||(this.designTokensInitialized=!0,this.designTokenRoot!==null&&Gh.registerRoot(this.designTokenRoot)),e.registerWithContext(r,...t);for(const a of s)a.callback(a),a.willDefine&&a.definition!==null&&a.definition.define();return this}}class Xh{constructor(t,e,s,o,n,r){this.container=t,this.name=e,this.type=s,this.shadowRootMode=o,this.callback=n,this.willDefine=r,this.definition=null}definePresentation(t){qr.define(this.name,t,this.container)}defineElement(t){this.definition=new qi(this.type,Object.assign(Object.assign({},t),{name:this.name}))}tagFor(t){return Wr.tagFor(t)}}/*!
* tabbable 5.3.3
* @license MIT, https://github.com/focus-trap/tabbable/blob/master/LICENSE
*/var Yr=["input","select","textarea","a[href]","button","[tabindex]:not(slot)","audio[controls]","video[controls]",'[contenteditable]:not([contenteditable="false"])',"details>summary:first-of-type","details"],Yh=Yr.join(","),Qr=typeof Element>"u",Ji=Qr?function(){}:Element.prototype.matches||Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector,Qo=!Qr&&Element.prototype.getRootNode?function(i){return i.getRootNode()}:function(i){return i.ownerDocument},Qh=function(t,e){return t.tabIndex<0&&(e||/^(AUDIO|VIDEO|DETAILS)$/.test(t.tagName)||t.isContentEditable)&&isNaN(parseInt(t.getAttribute("tabindex"),10))?0:t.tabIndex},Zr=function(t){return t.tagName==="INPUT"},Zh=function(t){return Zr(t)&&t.type==="hidden"},Jh=function(t){var e=t.tagName==="DETAILS"&&Array.prototype.slice.apply(t.children).some(function(s){return s.tagName==="SUMMARY"});return e},Kh=function(t,e){for(var s=0;s<t.length;s++)if(t[s].checked&&t[s].form===e)return t[s]},td=function(t){if(!t.name)return!0;var e=t.form||Qo(t),s=function(a){return e.querySelectorAll('input[type="radio"][name="'+a+'"]')},o;if(typeof window<"u"&&typeof window.CSS<"u"&&typeof window.CSS.escape=="function")o=s(window.CSS.escape(t.name));else try{o=s(t.name)}catch(r){return console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s",r.message),!1}var n=Kh(o,t.form);return!n||n===t},ed=function(t){return Zr(t)&&t.type==="radio"},id=function(t){return ed(t)&&!td(t)},Jr=function(t){var e=t.getBoundingClientRect(),s=e.width,o=e.height;return s===0&&o===0},sd=function(t,e){var s=e.displayCheck,o=e.getShadowRoot;if(getComputedStyle(t).visibility==="hidden")return!0;var n=Ji.call(t,"details>summary:first-of-type"),r=n?t.parentElement:t;if(Ji.call(r,"details:not([open]) *"))return!0;var a=Qo(t).host,l=(a==null?void 0:a.ownerDocument.contains(a))||t.ownerDocument.contains(t);if(!s||s==="full"){if(typeof o=="function"){for(var h=t;t;){var p=t.parentElement,f=Qo(t);if(p&&!p.shadowRoot&&o(p)===!0)return Jr(t);t.assignedSlot?t=t.assignedSlot:!p&&f!==t.ownerDocument?t=f.host:t=p}t=h}if(l)return!t.getClientRects().length}else if(s==="non-zero-area")return Jr(t);return!1},od=function(t){if(/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(t.tagName))for(var e=t.parentElement;e;){if(e.tagName==="FIELDSET"&&e.disabled){for(var s=0;s<e.children.length;s++){var o=e.children.item(s);if(o.tagName==="LEGEND")return Ji.call(e,"fieldset[disabled] *")?!0:!o.contains(t)}return!0}e=e.parentElement}return!1},Kr=function(t,e){return!(e.disabled||Zh(e)||sd(e,t)||Jh(e)||od(e))},nd=function(t,e){return!(id(e)||Qh(e)<0||!Kr(t,e))},ta=function(t,e){if(e=e||{},!t)throw new Error("No node provided");return Ji.call(t,Yh)===!1?!1:nd(e,t)},rd=Yr.concat("iframe").join(","),ea=function(t,e){if(e=e||{},!t)throw new Error("No node provided");return Ji.call(t,rd)===!1?!1:Kr(e,t)};function $t(i,t,e,s){var o=arguments.length,n=o<3?t:s===null?s=Object.getOwnPropertyDescriptor(t,e):s,r;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(i,t,e,s);else for(var a=i.length-1;a>=0;a--)(r=i[a])&&(n=(o<3?r(n):o>3?r(t,e,n):r(t,e))||n);return o>3&&n&&Object.defineProperty(t,e,n),n}const Te=function(){if(typeof globalThis<"u")return globalThis;if(typeof global<"u")return global;if(typeof self<"u")return self;if(typeof window<"u")return window;try{return new Function("return this")()}catch(i){return{}}}();Te.trustedTypes===void 0&&(Te.trustedTypes={createPolicy:(i,t)=>t});const ia={configurable:!1,enumerable:!1,writable:!1};Te.FAST===void 0&&Reflect.defineProperty(Te,"FAST",Object.assign({value:Object.create(null)},ia));const Ki=Te.FAST;if(Ki.getById===void 0){const i=Object.create(null);Reflect.defineProperty(Ki,"getById",Object.assign({value(t,e){let s=i[t];return s===void 0&&(s=e?i[t]=e():null),s}},ia))}const Ye=Object.freeze([]);function sa(){const i=new WeakMap;return function(t){let e=i.get(t);if(e===void 0){let s=Reflect.getPrototypeOf(t);for(;e===void 0&&s!==null;)e=i.get(s),s=Reflect.getPrototypeOf(s);e=e===void 0?[]:e.slice(0),i.set(t,e)}return e}}const Zo=Te.FAST.getById(1,()=>{const i=[],t=[];function e(){if(t.length)throw t.shift()}function s(r){try{r.call()}catch(a){t.push(a),setTimeout(e,0)}}function o(){let a=0;for(;a<i.length;)if(s(i[a]),a++,a>1024){for(let l=0,h=i.length-a;l<h;l++)i[l]=i[l+a];i.length-=a,a=0}i.length=0}function n(r){i.length<1&&Te.requestAnimationFrame(o),i.push(r)}return Object.freeze({enqueue:n,process:o})}),oa=Te.trustedTypes.createPolicy("fast-html",{createHTML:i=>i});let Jo=oa;const ts=`fast-${Math.random().toString(36).substring(2,8)}`,na=`${ts}{`,Ko=`}${ts}`,O=Object.freeze({supportsAdoptedStyleSheets:Array.isArray(document.adoptedStyleSheets)&&"replace"in CSSStyleSheet.prototype,setHTMLPolicy(i){if(Jo!==oa)throw new Error("The HTML policy can only be set once.");Jo=i},createHTML(i){return Jo.createHTML(i)},isMarker(i){return i&&i.nodeType===8&&i.data.startsWith(ts)},extractDirectiveIndexFromMarker(i){return parseInt(i.data.replace(`${ts}:`,""))},createInterpolationPlaceholder(i){return`${na}${i}${Ko}`},createCustomAttributePlaceholder(i,t){return`${i}="${this.createInterpolationPlaceholder(t)}"`},createBlockPlaceholder(i){return`<!--${ts}:${i}-->`},queueUpdate:Zo.enqueue,processUpdates:Zo.process,nextUpdate(){return new Promise(Zo.enqueue)},setAttribute(i,t,e){e==null?i.removeAttribute(t):i.setAttribute(t,e)},setBooleanAttribute(i,t,e){e?i.setAttribute(t,""):i.removeAttribute(t)},removeChildNodes(i){for(let t=i.firstChild;t!==null;t=i.firstChild)i.removeChild(t)},createTemplateWalker(i){return document.createTreeWalker(i,133,null,!1)}});class Ps{constructor(t,e){this.sub1=void 0,this.sub2=void 0,this.spillover=void 0,this.source=t,this.sub1=e}has(t){return this.spillover===void 0?this.sub1===t||this.sub2===t:this.spillover.indexOf(t)!==-1}subscribe(t){const e=this.spillover;if(e===void 0){if(this.has(t))return;if(this.sub1===void 0){this.sub1=t;return}if(this.sub2===void 0){this.sub2=t;return}this.spillover=[this.sub1,this.sub2,t],this.sub1=void 0,this.sub2=void 0}else e.indexOf(t)===-1&&e.push(t)}unsubscribe(t){const e=this.spillover;if(e===void 0)this.sub1===t?this.sub1=void 0:this.sub2===t&&(this.sub2=void 0);else{const s=e.indexOf(t);s!==-1&&e.splice(s,1)}}notify(t){const e=this.spillover,s=this.source;if(e===void 0){const o=this.sub1,n=this.sub2;o!==void 0&&o.handleChange(s,t),n!==void 0&&n.handleChange(s,t)}else for(let o=0,n=e.length;o<n;++o)e[o].handleChange(s,t)}}class ra{constructor(t){this.subscribers={},this.sourceSubscribers=null,this.source=t}notify(t){var e;const s=this.subscribers[t];s!==void 0&&s.notify(t),(e=this.sourceSubscribers)===null||e===void 0||e.notify(t)}subscribe(t,e){var s;if(e){let o=this.subscribers[e];o===void 0&&(this.subscribers[e]=o=new Ps(this.source)),o.subscribe(t)}else this.sourceSubscribers=(s=this.sourceSubscribers)!==null&&s!==void 0?s:new Ps(this.source),this.sourceSubscribers.subscribe(t)}unsubscribe(t,e){var s;if(e){const o=this.subscribers[e];o!==void 0&&o.unsubscribe(t)}else(s=this.sourceSubscribers)===null||s===void 0||s.unsubscribe(t)}}const L=Ki.getById(2,()=>{const i=/(:|&&|\|\||if)/,t=new WeakMap,e=O.queueUpdate;let s,o=h=>{throw new Error("Must call enableArrayObservation before observing arrays.")};function n(h){let p=h.$fastController||t.get(h);return p===void 0&&(Array.isArray(h)?p=o(h):t.set(h,p=new ra(h))),p}const r=sa();class a{constructor(p){this.name=p,this.field=`_${p}`,this.callback=`${p}Changed`}getValue(p){return s!==void 0&&s.watch(p,this.name),p[this.field]}setValue(p,f){const m=this.field,w=p[m];if(w!==f){p[m]=f;const k=p[this.callback];typeof k=="function"&&k.call(p,w,f),n(p).notify(this.name)}}}class l extends Ps{constructor(p,f,m=!1){super(p,f),this.binding=p,this.isVolatileBinding=m,this.needsRefresh=!0,this.needsQueue=!0,this.first=this,this.last=null,this.propertySource=void 0,this.propertyName=void 0,this.notifier=void 0,this.next=void 0}observe(p,f){this.needsRefresh&&this.last!==null&&this.disconnect();const m=s;s=this.needsRefresh?this:void 0,this.needsRefresh=this.isVolatileBinding;const w=this.binding(p,f);return s=m,w}disconnect(){if(this.last!==null){let p=this.first;for(;p!==void 0;)p.notifier.unsubscribe(this,p.propertyName),p=p.next;this.last=null,this.needsRefresh=this.needsQueue=!0}}watch(p,f){const m=this.last,w=n(p),k=m===null?this.first:{};if(k.propertySource=p,k.propertyName=f,k.notifier=w,w.subscribe(this,f),m!==null){if(!this.needsRefresh){let F;s=void 0,F=m.propertySource[m.propertyName],s=this,p===F&&(this.needsRefresh=!0)}m.next=k}this.last=k}handleChange(){this.needsQueue&&(this.needsQueue=!1,e(this))}call(){this.last!==null&&(this.needsQueue=!0,this.notify(this))}records(){let p=this.first;return{next:()=>{const f=p;return f===void 0?{value:void 0,done:!0}:(p=p.next,{value:f,done:!1})},[Symbol.iterator]:function(){return this}}}}return Object.freeze({setArrayObserverFactory(h){o=h},getNotifier:n,track(h,p){s!==void 0&&s.watch(h,p)},trackVolatile(){s!==void 0&&(s.needsRefresh=!0)},notify(h,p){n(h).notify(p)},defineProperty(h,p){typeof p=="string"&&(p=new a(p)),r(h).push(p),Reflect.defineProperty(h,p.name,{enumerable:!0,get:function(){return p.getValue(this)},set:function(f){p.setValue(this,f)}})},getAccessors:r,binding(h,p,f=this.isVolatileBinding(h)){return new l(h,p,f)},isVolatileBinding(h){return i.test(h.toString())}})});function g(i,t){L.defineProperty(i,t)}function ad(i,t,e){return Object.assign({},e,{get:function(){return L.trackVolatile(),e.get.apply(this)}})}const aa=Ki.getById(3,()=>{let i=null;return{get(){return i},set(t){i=t}}});class es{constructor(){this.index=0,this.length=0,this.parent=null,this.parentContext=null}get event(){return aa.get()}get isEven(){return this.index%2===0}get isOdd(){return this.index%2!==0}get isFirst(){return this.index===0}get isInMiddle(){return!this.isFirst&&!this.isLast}get isLast(){return this.index===this.length-1}static setEvent(t){aa.set(t)}}L.defineProperty(es.prototype,"index"),L.defineProperty(es.prototype,"length");const is=Object.seal(new es);class Vs{constructor(){this.targetIndex=0}}class la extends Vs{constructor(){super(...arguments),this.createPlaceholder=O.createInterpolationPlaceholder}}class tn extends Vs{constructor(t,e,s){super(),this.name=t,this.behavior=e,this.options=s}createPlaceholder(t){return O.createCustomAttributePlaceholder(this.name,t)}createBehavior(t){return new this.behavior(t,this.options)}}function ld(i,t){this.source=i,this.context=t,this.bindingObserver===null&&(this.bindingObserver=L.binding(this.binding,this,this.isBindingVolatile)),this.updateTarget(this.bindingObserver.observe(i,t))}function cd(i,t){this.source=i,this.context=t,this.target.addEventListener(this.targetName,this)}function hd(){this.bindingObserver.disconnect(),this.source=null,this.context=null}function dd(){this.bindingObserver.disconnect(),this.source=null,this.context=null;const i=this.target.$fastView;i!==void 0&&i.isComposed&&(i.unbind(),i.needsBindOnly=!0)}function ud(){this.target.removeEventListener(this.targetName,this),this.source=null,this.context=null}function pd(i){O.setAttribute(this.target,this.targetName,i)}function fd(i){O.setBooleanAttribute(this.target,this.targetName,i)}function gd(i){if(i==null&&(i=""),i.create){this.target.textContent="";let t=this.target.$fastView;t===void 0?t=i.create():this.target.$fastTemplate!==i&&(t.isComposed&&(t.remove(),t.unbind()),t=i.create()),t.isComposed?t.needsBindOnly&&(t.needsBindOnly=!1,t.bind(this.source,this.context)):(t.isComposed=!0,t.bind(this.source,this.context),t.insertBefore(this.target),this.target.$fastView=t,this.target.$fastTemplate=i)}else{const t=this.target.$fastView;t!==void 0&&t.isComposed&&(t.isComposed=!1,t.remove(),t.needsBindOnly?t.needsBindOnly=!1:t.unbind()),this.target.textContent=i}}function md(i){this.target[this.targetName]=i}function bd(i){const t=this.classVersions||Object.create(null),e=this.target;let s=this.version||0;if(i!=null&&i.length){const o=i.split(/\s+/);for(let n=0,r=o.length;n<r;++n){const a=o[n];a!==""&&(t[a]=s,e.classList.add(a))}}if(this.classVersions=t,this.version=s+1,s!==0){s-=1;for(const o in t)t[o]===s&&e.classList.remove(o)}}class en extends la{constructor(t){super(),this.binding=t,this.bind=ld,this.unbind=hd,this.updateTarget=pd,this.isBindingVolatile=L.isVolatileBinding(this.binding)}get targetName(){return this.originalTargetName}set targetName(t){if(this.originalTargetName=t,t!==void 0)switch(t[0]){case":":if(this.cleanedTargetName=t.substr(1),this.updateTarget=md,this.cleanedTargetName==="innerHTML"){const e=this.binding;this.binding=(s,o)=>O.createHTML(e(s,o))}break;case"?":this.cleanedTargetName=t.substr(1),this.updateTarget=fd;break;case"@":this.cleanedTargetName=t.substr(1),this.bind=cd,this.unbind=ud;break;default:this.cleanedTargetName=t,t==="class"&&(this.updateTarget=bd);break}}targetAtContent(){this.updateTarget=gd,this.unbind=dd}createBehavior(t){return new vd(t,this.binding,this.isBindingVolatile,this.bind,this.unbind,this.updateTarget,this.cleanedTargetName)}}class vd{constructor(t,e,s,o,n,r,a){this.source=null,this.context=null,this.bindingObserver=null,this.target=t,this.binding=e,this.isBindingVolatile=s,this.bind=o,this.unbind=n,this.updateTarget=r,this.targetName=a}handleChange(){this.updateTarget(this.bindingObserver.observe(this.source,this.context))}handleEvent(t){es.setEvent(t);const e=this.binding(this.source,this.context);es.setEvent(null),e!==!0&&t.preventDefault()}}let sn=null;class ir{addFactory(t){t.targetIndex=this.targetIndex,this.behaviorFactories.push(t)}captureContentBinding(t){t.targetAtContent(),this.addFactory(t)}reset(){this.behaviorFactories=[],this.targetIndex=-1}release(){sn=this}static borrow(t){const e=sn||new ir;return e.directives=t,e.reset(),sn=null,e}}function yd(i){if(i.length===1)return i[0];let t;const e=i.length,s=i.map(r=>typeof r=="string"?()=>r:(t=r.targetName||t,r.binding)),o=(r,a)=>{let l="";for(let h=0;h<e;++h)l+=s[h](r,a);return l},n=new en(o);return n.targetName=t,n}const xd=Ko.length;function ca(i,t){const e=t.split(na);if(e.length===1)return null;const s=[];for(let o=0,n=e.length;o<n;++o){const r=e[o],a=r.indexOf(Ko);let l;if(a===-1)l=r;else{const h=parseInt(r.substring(0,a));s.push(i.directives[h]),l=r.substring(a+xd)}l!==""&&s.push(l)}return s}function ha(i,t,e=!1){const s=t.attributes;for(let o=0,n=s.length;o<n;++o){const r=s[o],a=r.value,l=ca(i,a);let h=null;l===null?e&&(h=new en(()=>a),h.targetName=r.name):h=yd(l),h!==null&&(t.removeAttributeNode(r),o--,n--,i.addFactory(h))}}function $d(i,t,e){const s=ca(i,t.textContent);if(s!==null){let o=t;for(let n=0,r=s.length;n<r;++n){const a=s[n],l=n===0?t:o.parentNode.insertBefore(document.createTextNode(""),o.nextSibling);typeof a=="string"?l.textContent=a:(l.textContent=" ",i.captureContentBinding(a)),o=l,i.targetIndex++,l!==t&&e.nextNode()}i.targetIndex--}}function wd(i,t){const e=i.content;document.adoptNode(e);const s=ir.borrow(t);ha(s,i,!0);const o=s.behaviorFactories;s.reset();const n=O.createTemplateWalker(e);let r;for(;r=n.nextNode();)switch(s.targetIndex++,r.nodeType){case 1:ha(s,r);break;case 3:$d(s,r,n);break;case 8:O.isMarker(r)&&s.addFactory(t[O.extractDirectiveIndexFromMarker(r)])}let a=0;(O.isMarker(e.firstChild)||e.childNodes.length===1&&t.length)&&(e.insertBefore(document.createComment(""),e.firstChild),a=-1);const l=s.behaviorFactories;return s.release(),{fragment:e,viewBehaviorFactories:l,hostBehaviorFactories:o,targetOffset:a}}const on=document.createRange();class da{constructor(t,e){this.fragment=t,this.behaviors=e,this.source=null,this.context=null,this.firstChild=t.firstChild,this.lastChild=t.lastChild}appendTo(t){t.appendChild(this.fragment)}insertBefore(t){if(this.fragment.hasChildNodes())t.parentNode.insertBefore(this.fragment,t);else{const e=this.lastChild;if(t.previousSibling===e)return;const s=t.parentNode;let o=this.firstChild,n;for(;o!==e;)n=o.nextSibling,s.insertBefore(o,t),o=n;s.insertBefore(e,t)}}remove(){const t=this.fragment,e=this.lastChild;let s=this.firstChild,o;for(;s!==e;)o=s.nextSibling,t.appendChild(s),s=o;t.appendChild(e)}dispose(){const t=this.firstChild.parentNode,e=this.lastChild;let s=this.firstChild,o;for(;s!==e;)o=s.nextSibling,t.removeChild(s),s=o;t.removeChild(e);const n=this.behaviors,r=this.source;for(let a=0,l=n.length;a<l;++a)n[a].unbind(r)}bind(t,e){const s=this.behaviors;if(this.source!==t)if(this.source!==null){const o=this.source;this.source=t,this.context=e;for(let n=0,r=s.length;n<r;++n){const a=s[n];a.unbind(o),a.bind(t,e)}}else{this.source=t,this.context=e;for(let o=0,n=s.length;o<n;++o)s[o].bind(t,e)}}unbind(){if(this.source===null)return;const t=this.behaviors,e=this.source;for(let s=0,o=t.length;s<o;++s)t[s].unbind(e);this.source=null}static disposeContiguousBatch(t){if(t.length!==0){on.setStartBefore(t[0].firstChild),on.setEndAfter(t[t.length-1].lastChild),on.deleteContents();for(let e=0,s=t.length;e<s;++e){const o=t[e],n=o.behaviors,r=o.source;for(let a=0,l=n.length;a<l;++a)n[a].unbind(r)}}}}class ua{constructor(t,e){this.behaviorCount=0,this.hasHostBehaviors=!1,this.fragment=null,this.targetOffset=0,this.viewBehaviorFactories=null,this.hostBehaviorFactories=null,this.html=t,this.directives=e}create(t){if(this.fragment===null){let h;const p=this.html;if(typeof p=="string"){h=document.createElement("template"),h.innerHTML=O.createHTML(p);const m=h.content.firstElementChild;m!==null&&m.tagName==="TEMPLATE"&&(h=m)}else h=p;const f=wd(h,this.directives);this.fragment=f.fragment,this.viewBehaviorFactories=f.viewBehaviorFactories,this.hostBehaviorFactories=f.hostBehaviorFactories,this.targetOffset=f.targetOffset,this.behaviorCount=this.viewBehaviorFactories.length+this.hostBehaviorFactories.length,this.hasHostBehaviors=this.hostBehaviorFactories.length>0}const e=this.fragment.cloneNode(!0),s=this.viewBehaviorFactories,o=new Array(this.behaviorCount),n=O.createTemplateWalker(e);let r=0,a=this.targetOffset,l=n.nextNode();for(let h=s.length;r<h;++r){const p=s[r],f=p.targetIndex;for(;l!==null;)if(a===f){o[r]=p.createBehavior(l);break}else l=n.nextNode(),a++}if(this.hasHostBehaviors){const h=this.hostBehaviorFactories;for(let p=0,f=h.length;p<f;++p,++r)o[r]=h[p].createBehavior(t)}return new da(e,o)}render(t,e,s){typeof e=="string"&&(e=document.getElementById(e)),s===void 0&&(s=e);const o=this.create(s);return o.bind(t,is),o.appendTo(e),o}}const kd=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;function v(i,...t){const e=[];let s="";for(let o=0,n=i.length-1;o<n;++o){const r=i[o];let a=t[o];if(s+=r,a instanceof ua){const l=a;a=()=>l}if(typeof a=="function"&&(a=new en(a)),a instanceof la){const l=kd.exec(r);l!==null&&(a.targetName=l[2])}a instanceof Vs?(s+=a.createPlaceholder(e.length),e.push(a)):s+=a}return s+=i[i.length-1],new ua(s,e)}class Lt{constructor(){this.targets=new WeakSet}addStylesTo(t){this.targets.add(t)}removeStylesFrom(t){this.targets.delete(t)}isAttachedTo(t){return this.targets.has(t)}withBehaviors(...t){return this.behaviors=this.behaviors===null?t:this.behaviors.concat(t),this}}Lt.create=(()=>{if(O.supportsAdoptedStyleSheets){const i=new Map;return t=>new Cd(t,i)}return i=>new Sd(i)})();function nn(i){return i.map(t=>t instanceof Lt?nn(t.styles):[t]).reduce((t,e)=>t.concat(e),[])}function pa(i){return i.map(t=>t instanceof Lt?t.behaviors:null).reduce((t,e)=>e===null?t:(t===null&&(t=[]),t.concat(e)),null)}let fa=(i,t)=>{i.adoptedStyleSheets=[...i.adoptedStyleSheets,...t]},ga=(i,t)=>{i.adoptedStyleSheets=i.adoptedStyleSheets.filter(e=>t.indexOf(e)===-1)};if(O.supportsAdoptedStyleSheets)try{document.adoptedStyleSheets.push(),document.adoptedStyleSheets.splice(),fa=(i,t)=>{i.adoptedStyleSheets.push(...t)},ga=(i,t)=>{for(const e of t){const s=i.adoptedStyleSheets.indexOf(e);s!==-1&&i.adoptedStyleSheets.splice(s,1)}}}catch(i){}class Cd extends Lt{constructor(t,e){super(),this.styles=t,this.styleSheetCache=e,this._styleSheets=void 0,this.behaviors=pa(t)}get styleSheets(){if(this._styleSheets===void 0){const t=this.styles,e=this.styleSheetCache;this._styleSheets=nn(t).map(s=>{if(s instanceof CSSStyleSheet)return s;let o=e.get(s);return o===void 0&&(o=new CSSStyleSheet,o.replaceSync(s),e.set(s,o)),o})}return this._styleSheets}addStylesTo(t){fa(t,this.styleSheets),super.addStylesTo(t)}removeStylesFrom(t){ga(t,this.styleSheets),super.removeStylesFrom(t)}}let Td=0;function Id(){return`fast-style-class-${++Td}`}class Sd extends Lt{constructor(t){super(),this.styles=t,this.behaviors=null,this.behaviors=pa(t),this.styleSheets=nn(t),this.styleClass=Id()}addStylesTo(t){const e=this.styleSheets,s=this.styleClass;t=this.normalizeTarget(t);for(let o=0;o<e.length;o++){const n=document.createElement("style");n.innerHTML=e[o],n.className=s,t.append(n)}super.addStylesTo(t)}removeStylesFrom(t){t=this.normalizeTarget(t);const e=t.querySelectorAll(`.${this.styleClass}`);for(let s=0,o=e.length;s<o;++s)t.removeChild(e[s]);super.removeStylesFrom(t)}isAttachedTo(t){return super.isAttachedTo(this.normalizeTarget(t))}normalizeTarget(t){return t===document?document.body:t}}const Ms=Object.freeze({locate:sa()}),zs={toView(i){return i?"true":"false"},fromView(i){return!(i==null||i==="false"||i===!1||i===0)}},C={toView(i){if(i==null)return null;const t=i*1;return isNaN(t)?null:t.toString()},fromView(i){if(i==null)return null;const t=i*1;return isNaN(t)?null:t}};class wo{constructor(t,e,s=e.toLowerCase(),o="reflect",n){this.guards=new Set,this.Owner=t,this.name=e,this.attribute=s,this.mode=o,this.converter=n,this.fieldName=`_${e}`,this.callbackName=`${e}Changed`,this.hasCallback=this.callbackName in t.prototype,o==="boolean"&&n===void 0&&(this.converter=zs)}setValue(t,e){const s=t[this.fieldName],o=this.converter;o!==void 0&&(e=o.fromView(e)),s!==e&&(t[this.fieldName]=e,this.tryReflectToAttribute(t),this.hasCallback&&t[this.callbackName](s,e),t.$fastController.notify(this.name))}getValue(t){return L.track(t,this.name),t[this.fieldName]}onAttributeChangedCallback(t,e){this.guards.has(t)||(this.guards.add(t),this.setValue(t,e),this.guards.delete(t))}tryReflectToAttribute(t){const e=this.mode,s=this.guards;s.has(t)||e==="fromView"||O.queueUpdate(()=>{s.add(t);const o=t[this.fieldName];switch(e){case"reflect":const n=this.converter;O.setAttribute(t,this.attribute,n!==void 0?n.toView(o):o);break;case"boolean":O.setBooleanAttribute(t,this.attribute,o);break}s.delete(t)})}static collect(t,...e){const s=[];e.push(Ms.locate(t));for(let o=0,n=e.length;o<n;++o){const r=e[o];if(r!==void 0)for(let a=0,l=r.length;a<l;++a){const h=r[a];typeof h=="string"?s.push(new wo(t,h)):s.push(new wo(t,h.property,h.attribute,h.mode,h.converter))}}return s}}function u(i,t){let e;function s(o,n){arguments.length>1&&(e.property=n),Ms.locate(o.constructor).push(e)}if(arguments.length>1){e={},s(i,t);return}return e=i===void 0?{}:i,s}const ma={mode:"open"},ba={},rn=Ki.getById(4,()=>{const i=new Map;return Object.freeze({register(t){return i.has(t.type)?!1:(i.set(t.type,t),!0)},getByType(t){return i.get(t)}})});class Hs{constructor(t,e=t.definition){typeof e=="string"&&(e={name:e}),this.type=t,this.name=e.name,this.template=e.template;const s=wo.collect(t,e.attributes),o=new Array(s.length),n={},r={};for(let a=0,l=s.length;a<l;++a){const h=s[a];o[a]=h.attribute,n[h.name]=h,r[h.attribute]=h}this.attributes=s,this.observedAttributes=o,this.propertyLookup=n,this.attributeLookup=r,this.shadowOptions=e.shadowOptions===void 0?ma:e.shadowOptions===null?void 0:Object.assign(Object.assign({},ma),e.shadowOptions),this.elementOptions=e.elementOptions===void 0?ba:Object.assign(Object.assign({},ba),e.elementOptions),this.styles=e.styles===void 0?void 0:Array.isArray(e.styles)?Lt.create(e.styles):e.styles instanceof Lt?e.styles:Lt.create([e.styles])}get isDefined(){return!!rn.getByType(this.type)}define(t=customElements){const e=this.type;if(rn.register(this)){const s=this.attributes,o=e.prototype;for(let n=0,r=s.length;n<r;++n)L.defineProperty(o,s[n]);Reflect.defineProperty(e,"observedAttributes",{value:this.observedAttributes,enumerable:!0})}return t.get(this.name)||t.define(this.name,e,this.elementOptions),this}}Hs.forType=rn.getByType;const va=new WeakMap,Fd={bubbles:!0,composed:!0,cancelable:!0};function an(i){return i.shadowRoot||va.get(i)||null}class sr extends ra{constructor(t,e){super(t),this.boundObservables=null,this.behaviors=null,this.needsInitialization=!0,this._template=null,this._styles=null,this._isConnected=!1,this.$fastController=this,this.view=null,this.element=t,this.definition=e;const s=e.shadowOptions;if(s!==void 0){const n=t.attachShadow(s);s.mode==="closed"&&va.set(t,n)}const o=L.getAccessors(t);if(o.length>0){const n=this.boundObservables=Object.create(null);for(let r=0,a=o.length;r<a;++r){const l=o[r].name,h=t[l];h!==void 0&&(delete t[l],n[l]=h)}}}get isConnected(){return L.track(this,"isConnected"),this._isConnected}setIsConnected(t){this._isConnected=t,L.notify(this,"isConnected")}get template(){return this._template}set template(t){this._template!==t&&(this._template=t,this.needsInitialization||this.renderTemplate(t))}get styles(){return this._styles}set styles(t){this._styles!==t&&(this._styles!==null&&this.removeStyles(this._styles),this._styles=t,!this.needsInitialization&&t!==null&&this.addStyles(t))}addStyles(t){const e=an(this.element)||this.element.getRootNode();if(t instanceof HTMLStyleElement)e.append(t);else if(!t.isAttachedTo(e)){const s=t.behaviors;t.addStylesTo(e),s!==null&&this.addBehaviors(s)}}removeStyles(t){const e=an(this.element)||this.element.getRootNode();if(t instanceof HTMLStyleElement)e.removeChild(t);else if(t.isAttachedTo(e)){const s=t.behaviors;t.removeStylesFrom(e),s!==null&&this.removeBehaviors(s)}}addBehaviors(t){const e=this.behaviors||(this.behaviors=new Map),s=t.length,o=[];for(let n=0;n<s;++n){const r=t[n];e.has(r)?e.set(r,e.get(r)+1):(e.set(r,1),o.push(r))}if(this._isConnected){const n=this.element;for(let r=0;r<o.length;++r)o[r].bind(n,is)}}removeBehaviors(t,e=!1){const s=this.behaviors;if(s===null)return;const o=t.length,n=[];for(let r=0;r<o;++r){const a=t[r];if(s.has(a)){const l=s.get(a)-1;l===0||e?s.delete(a)&&n.push(a):s.set(a,l)}}if(this._isConnected){const r=this.element;for(let a=0;a<n.length;++a)n[a].unbind(r)}}onConnectedCallback(){if(this._isConnected)return;const t=this.element;this.needsInitialization?this.finishInitialization():this.view!==null&&this.view.bind(t,is);const e=this.behaviors;if(e!==null)for(const[s]of e)s.bind(t,is);this.setIsConnected(!0)}onDisconnectedCallback(){if(!this._isConnected)return;this.setIsConnected(!1);const t=this.view;t!==null&&t.unbind();const e=this.behaviors;if(e!==null){const s=this.element;for(const[o]of e)o.unbind(s)}}onAttributeChangedCallback(t,e,s){const o=this.definition.attributeLookup[t];o!==void 0&&o.onAttributeChangedCallback(this.element,s)}emit(t,e,s){return this._isConnected?this.element.dispatchEvent(new CustomEvent(t,Object.assign(Object.assign({detail:e},Fd),s))):!1}finishInitialization(){const t=this.element,e=this.boundObservables;if(e!==null){const o=Object.keys(e);for(let n=0,r=o.length;n<r;++n){const a=o[n];t[a]=e[a]}this.boundObservables=null}const s=this.definition;this._template===null&&(this.element.resolveTemplate?this._template=this.element.resolveTemplate():s.template&&(this._template=s.template||null)),this._template!==null&&this.renderTemplate(this._template),this._styles===null&&(this.element.resolveStyles?this._styles=this.element.resolveStyles():s.styles&&(this._styles=s.styles||null)),this._styles!==null&&this.addStyles(this._styles),this.needsInitialization=!1}renderTemplate(t){const e=this.element,s=an(e)||e;this.view!==null?(this.view.dispose(),this.view=null):this.needsInitialization||O.removeChildNodes(s),t&&(this.view=t.render(e,s,e))}static forCustomElement(t){const e=t.$fastController;if(e!==void 0)return e;const s=Hs.forType(t.constructor);if(s===void 0)throw new Error("Missing FASTElement definition.");return t.$fastController=new sr(t,s)}}function ya(i){return class extends i{constructor(){super(),sr.forCustomElement(this)}$emit(t,e,s){return this.$fastController.emit(t,e,s)}connectedCallback(){this.$fastController.onConnectedCallback()}disconnectedCallback(){this.$fastController.onDisconnectedCallback()}attributeChangedCallback(t,e,s){this.$fastController.onAttributeChangedCallback(t,e,s)}}}const Bs=Object.assign(ya(HTMLElement),{from(i){return ya(i)},define(i,t){return new Hs(i,t).define().type}});class ln{createCSS(){return""}createBehavior(){}}function xa(i,t){const e=[];let s="";const o=[];for(let n=0,r=i.length-1;n<r;++n){s+=i[n];let a=t[n];if(a instanceof ln){const l=a.createBehavior();a=a.createCSS(),l&&o.push(l)}a instanceof Lt||a instanceof CSSStyleSheet?(s.trim()!==""&&(e.push(s),s=""),e.push(a)):s+=a}return s+=i[i.length-1],s.trim()!==""&&e.push(s),{styles:e,behaviors:o}}function b(i,...t){const{styles:e,behaviors:s}=xa(i,t),o=Lt.create(e);return s.length&&o.withBehaviors(...s),o}class Od extends ln{constructor(t,e){super(),this.behaviors=e,this.css="";const s=t.reduce((o,n)=>(typeof n=="string"?this.css+=n:o.push(n),o),[]);s.length&&(this.styles=Lt.create(s))}createBehavior(){return this}createCSS(){return this.css}bind(t){this.styles&&t.$fastController.addStyles(this.styles),this.behaviors.length&&t.$fastController.addBehaviors(this.behaviors)}unbind(t){this.styles&&t.$fastController.removeStyles(this.styles),this.behaviors.length&&t.$fastController.removeBehaviors(this.behaviors)}}function $a(i,...t){const{styles:e,behaviors:s}=xa(i,t);return new Od(e,s)}function he(i,t,e){return{index:i,removed:t,addedCount:e}}const wa=0,ka=1,cn=2,hn=3;function Rd(i,t,e,s,o,n){const r=n-o+1,a=e-t+1,l=new Array(r);let h,p;for(let f=0;f<r;++f)l[f]=new Array(a),l[f][0]=f;for(let f=0;f<a;++f)l[0][f]=f;for(let f=1;f<r;++f)for(let m=1;m<a;++m)i[t+m-1]===s[o+f-1]?l[f][m]=l[f-1][m-1]:(h=l[f-1][m]+1,p=l[f][m-1]+1,l[f][m]=h<p?h:p);return l}function Dd(i){let t=i.length-1,e=i[0].length-1,s=i[t][e];const o=[];for(;t>0||e>0;){if(t===0){o.push(cn),e--;continue}if(e===0){o.push(hn),t--;continue}const n=i[t-1][e-1],r=i[t-1][e],a=i[t][e-1];let l;r<a?l=r<n?r:n:l=a<n?a:n,l===n?(n===s?o.push(wa):(o.push(ka),s=n),t--,e--):l===r?(o.push(hn),t--,s=r):(o.push(cn),e--,s=a)}return o.reverse(),o}function Ed(i,t,e){for(let s=0;s<e;++s)if(i[s]!==t[s])return s;return e}function Ld(i,t,e){let s=i.length,o=t.length,n=0;for(;n<e&&i[--s]===t[--o];)n++;return n}function Ad(i,t,e,s){return t<e||s<i?-1:t===e||s===i?0:i<e?t<s?t-e:s-e:s<t?s-i:t-i}function Ca(i,t,e,s,o,n){let r=0,a=0;const l=Math.min(e-t,n-o);if(t===0&&o===0&&(r=Ed(i,s,l)),e===i.length&&n===s.length&&(a=Ld(i,s,l-r)),t+=r,o+=r,e-=a,n-=a,e-t===0&&n-o===0)return Ye;if(t===e){const k=he(t,[],0);for(;o<n;)k.removed.push(s[o++]);return[k]}else if(o===n)return[he(t,[],e-t)];const h=Dd(Rd(i,t,e,s,o,n)),p=[];let f,m=t,w=o;for(let k=0;k<h.length;++k)switch(h[k]){case wa:f!==void 0&&(p.push(f),f=void 0),m++,w++;break;case ka:f===void 0&&(f=he(m,[],0)),f.addedCount++,m++,f.removed.push(s[w]),w++;break;case cn:f===void 0&&(f=he(m,[],0)),f.addedCount++,m++;break;case hn:f===void 0&&(f=he(m,[],0)),f.removed.push(s[w]),w++;break}return f!==void 0&&p.push(f),p}const Ta=Array.prototype.push;function Pd(i,t,e,s){const o=he(t,e,s);let n=!1,r=0;for(let a=0;a<i.length;a++){const l=i[a];if(l.index+=r,n)continue;const h=Ad(o.index,o.index+o.removed.length,l.index,l.index+l.addedCount);if(h>=0){i.splice(a,1),a--,r-=l.addedCount-l.removed.length,o.addedCount+=l.addedCount-h;const p=o.removed.length+l.removed.length-h;if(!o.addedCount&&!p)n=!0;else{let f=l.removed;if(o.index<l.index){const m=o.removed.slice(0,l.index-o.index);Ta.apply(m,f),f=m}if(o.index+o.removed.length>l.index+l.addedCount){const m=o.removed.slice(l.index+l.addedCount-o.index);Ta.apply(f,m)}o.removed=f,l.index<o.index&&(o.index=l.index)}}else if(o.index<l.index){n=!0,i.splice(a,0,o),a++;const p=o.addedCount-o.removed.length;l.index+=p,r+=p}}n||i.push(o)}function Vd(i){const t=[];for(let e=0,s=i.length;e<s;e++){const o=i[e];Pd(t,o.index,o.removed,o.addedCount)}return t}function Md(i,t){let e=[];const s=Vd(t);for(let o=0,n=s.length;o<n;++o){const r=s[o];if(r.addedCount===1&&r.removed.length===1){r.removed[0]!==i[r.index]&&e.push(r);continue}e=e.concat(Ca(i,r.index,r.index+r.addedCount,r.removed,0,r.removed.length))}return e}let Ia=!1;function dn(i,t){let e=i.index;const s=t.length;return e>s?e=s-i.addedCount:e<0&&(e=s+i.removed.length+e-i.addedCount),e<0&&(e=0),i.index=e,i}class zd extends Ps{constructor(t){super(t),this.oldCollection=void 0,this.splices=void 0,this.needsQueue=!0,this.call=this.flush,Reflect.defineProperty(t,"$fastController",{value:this,enumerable:!1})}subscribe(t){this.flush(),super.subscribe(t)}addSplice(t){this.splices===void 0?this.splices=[t]:this.splices.push(t),this.needsQueue&&(this.needsQueue=!1,O.queueUpdate(this))}reset(t){this.oldCollection=t,this.needsQueue&&(this.needsQueue=!1,O.queueUpdate(this))}flush(){const t=this.splices,e=this.oldCollection;if(t===void 0&&e===void 0)return;this.needsQueue=!0,this.splices=void 0,this.oldCollection=void 0;const s=e===void 0?Md(this.source,t):Ca(this.source,0,this.source.length,e,0,e.length);this.notify(s)}}function Hd(){if(Ia)return;Ia=!0,L.setArrayObserverFactory(l=>new zd(l));const i=Array.prototype;if(i.$fastPatch)return;Reflect.defineProperty(i,"$fastPatch",{value:1,enumerable:!1});const t=i.pop,e=i.push,s=i.reverse,o=i.shift,n=i.sort,r=i.splice,a=i.unshift;i.pop=function(){const l=this.length>0,h=t.apply(this,arguments),p=this.$fastController;return p!==void 0&&l&&p.addSplice(he(this.length,[h],0)),h},i.push=function(){const l=e.apply(this,arguments),h=this.$fastController;return h!==void 0&&h.addSplice(dn(he(this.length-arguments.length,[],arguments.length),this)),l},i.reverse=function(){let l;const h=this.$fastController;h!==void 0&&(h.flush(),l=this.slice());const p=s.apply(this,arguments);return h!==void 0&&h.reset(l),p},i.shift=function(){const l=this.length>0,h=o.apply(this,arguments),p=this.$fastController;return p!==void 0&&l&&p.addSplice(he(0,[h],0)),h},i.sort=function(){let l;const h=this.$fastController;h!==void 0&&(h.flush(),l=this.slice());const p=n.apply(this,arguments);return h!==void 0&&h.reset(l),p},i.splice=function(){const l=r.apply(this,arguments),h=this.$fastController;return h!==void 0&&h.addSplice(dn(he(+arguments[0],l,arguments.length>2?arguments.length-2:0),this)),l},i.unshift=function(){const l=a.apply(this,arguments),h=this.$fastController;return h!==void 0&&h.addSplice(dn(he(0,[],arguments.length),this)),l}}class Bd{constructor(t,e){this.target=t,this.propertyName=e}bind(t){t[this.propertyName]=this.target}unbind(){}}function j(i){return new tn("fast-ref",Bd,i)}const Sa=i=>typeof i=="function",Nd=()=>null;function Fa(i){return i===void 0?Nd:Sa(i)?i:()=>i}function Q(i,t,e){const s=Sa(i)?i:()=>i,o=Fa(t),n=Fa(e);return(r,a)=>s(r,a)?o(r,a):n(r,a)}const Oa=Object.freeze({positioning:!1,recycle:!0});function jd(i,t,e,s){i.bind(t[e],s)}function _d(i,t,e,s){const o=Object.create(s);o.index=e,o.length=t.length,i.bind(t[e],o)}class Ud{constructor(t,e,s,o,n,r){this.location=t,this.itemsBinding=e,this.templateBinding=o,this.options=r,this.source=null,this.views=[],this.items=null,this.itemsObserver=null,this.originalContext=void 0,this.childContext=void 0,this.bindView=jd,this.itemsBindingObserver=L.binding(e,this,s),this.templateBindingObserver=L.binding(o,this,n),r.positioning&&(this.bindView=_d)}bind(t,e){this.source=t,this.originalContext=e,this.childContext=Object.create(e),this.childContext.parent=t,this.childContext.parentContext=this.originalContext,this.items=this.itemsBindingObserver.observe(t,this.originalContext),this.template=this.templateBindingObserver.observe(t,this.originalContext),this.observeItems(!0),this.refreshAllViews()}unbind(){this.source=null,this.items=null,this.itemsObserver!==null&&this.itemsObserver.unsubscribe(this),this.unbindAllViews(),this.itemsBindingObserver.disconnect(),this.templateBindingObserver.disconnect()}handleChange(t,e){t===this.itemsBinding?(this.items=this.itemsBindingObserver.observe(this.source,this.originalContext),this.observeItems(),this.refreshAllViews()):t===this.templateBinding?(this.template=this.templateBindingObserver.observe(this.source,this.originalContext),this.refreshAllViews(!0)):this.updateViews(e)}observeItems(t=!1){if(!this.items){this.items=Ye;return}const e=this.itemsObserver,s=this.itemsObserver=L.getNotifier(this.items),o=e!==s;o&&e!==null&&e.unsubscribe(this),(o||t)&&s.subscribe(this)}updateViews(t){const e=this.childContext,s=this.views,o=this.bindView,n=this.items,r=this.template,a=this.options.recycle,l=[];let h=0,p=0;for(let f=0,m=t.length;f<m;++f){const w=t[f],k=w.removed;let F=0,V=w.index;const vt=V+w.addedCount,et=s.splice(w.index,k.length),zi=p=l.length+et.length;for(;V<vt;++V){const ge=s[V],Hi=ge?ge.firstChild:this.location;let qt;a&&p>0?(F<=zi&&et.length>0?(qt=et[F],F++):(qt=l[h],h++),p--):qt=r.create(),s.splice(V,0,qt),o(qt,n,V,e),qt.insertBefore(Hi)}et[F]&&l.push(...et.slice(F))}for(let f=h,m=l.length;f<m;++f)l[f].dispose();if(this.options.positioning)for(let f=0,m=s.length;f<m;++f){const w=s[f].context;w.length=m,w.index=f}}refreshAllViews(t=!1){const e=this.items,s=this.childContext,o=this.template,n=this.location,r=this.bindView;let a=e.length,l=this.views,h=l.length;if((a===0||t||!this.options.recycle)&&(da.disposeContiguousBatch(l),h=0),h===0){this.views=l=new Array(a);for(let p=0;p<a;++p){const f=o.create();r(f,e,p,s),l[p]=f,f.insertBefore(n)}}else{let p=0;for(;p<a;++p)if(p<h){const m=l[p];r(m,e,p,s)}else{const m=o.create();r(m,e,p,s),l.push(m),m.insertBefore(n)}const f=l.splice(p,h-p);for(p=0,a=f.length;p<a;++p)f[p].dispose()}}unbindAllViews(){const t=this.views;for(let e=0,s=t.length;e<s;++e)t[e].unbind()}}class ss extends Vs{constructor(t,e,s){super(),this.itemsBinding=t,this.templateBinding=e,this.options=s,this.createPlaceholder=O.createBlockPlaceholder,Hd(),this.isItemsBindingVolatile=L.isVolatileBinding(t),this.isTemplateBindingVolatile=L.isVolatileBinding(e)}createBehavior(t){return new Ud(t,this.itemsBinding,this.isItemsBindingVolatile,this.templateBinding,this.isTemplateBindingVolatile,this.options)}}function ki(i,t,e=Oa){const s=typeof t=="function"?t:()=>t;return new ss(i,s,Object.assign(Object.assign({},Oa),e))}function Ie(i){return i?function(t,e,s){return t.nodeType===1&&t.matches(i)}:function(t,e,s){return t.nodeType===1}}class Ra{constructor(t,e){this.target=t,this.options=e,this.source=null}bind(t){const e=this.options.property;this.shouldUpdate=L.getAccessors(t).some(s=>s.name===e),this.source=t,this.updateTarget(this.computeNodes()),this.shouldUpdate&&this.observe()}unbind(){this.updateTarget(Ye),this.source=null,this.shouldUpdate&&this.disconnect()}handleEvent(){this.updateTarget(this.computeNodes())}computeNodes(){let t=this.getNodes();return this.options.filter!==void 0&&(t=t.filter(this.options.filter)),t}updateTarget(t){this.source[this.options.property]=t}}class qd extends Ra{constructor(t,e){super(t,e)}observe(){this.target.addEventListener("slotchange",this)}disconnect(){this.target.removeEventListener("slotchange",this)}getNodes(){return this.target.assignedNodes(this.options)}}function Z(i){return typeof i=="string"&&(i={property:i}),new tn("fast-slotted",qd,i)}class Gd extends Ra{constructor(t,e){super(t,e),this.observer=null,e.childList=!0}observe(){this.observer===null&&(this.observer=new MutationObserver(this.handleEvent.bind(this))),this.observer.observe(this.target,this.options)}disconnect(){this.observer.disconnect()}getNodes(){return"subtree"in this.options?Array.from(this.target.querySelectorAll(this.options.selector)):Array.from(this.target.childNodes)}}function Ns(i){return typeof i=="string"&&(i={property:i}),new tn("fast-children",Gd,i)}class Bt{handleStartContentChange(){this.startContainer.classList.toggle("start",this.start.assignedNodes().length>0)}handleEndContentChange(){this.endContainer.classList.toggle("end",this.end.assignedNodes().length>0)}}const At=(i,t)=>v`
    <span
        part="end"
        ${j("endContainer")}
        class=${e=>t.end?"end":void 0}
    >
        <slot name="end" ${j("end")} @slotchange="${e=>e.handleEndContentChange()}">
            ${t.end||""}
        </slot>
    </span>
`,Pt=(i,t)=>v`
    <span
        part="start"
        ${j("startContainer")}
        class="${e=>t.start?"start":void 0}"
    >
        <slot
            name="start"
            ${j("start")}
            @slotchange="${e=>e.handleStartContentChange()}"
        >
            ${t.start||""}
        </slot>
    </span>
`,Wd=v`
    <span part="end" ${j("endContainer")}>
        <slot
            name="end"
            ${j("end")}
            @slotchange="${i=>i.handleEndContentChange()}"
        ></slot>
    </span>
`,Xd=v`
    <span part="start" ${j("startContainer")}>
        <slot
            name="start"
            ${j("start")}
            @slotchange="${i=>i.handleStartContentChange()}"
        ></slot>
    </span>
`,Yd=(i,t)=>v`
    <template class="${e=>e.expanded?"expanded":""}">
        <div
            class="heading"
            part="heading"
            role="heading"
            aria-level="${e=>e.headinglevel}"
        >
            <button
                class="button"
                part="button"
                ${j("expandbutton")}
                aria-expanded="${e=>e.expanded}"
                aria-controls="${e=>e.id}-panel"
                id="${e=>e.id}"
                @click="${(e,s)=>e.clickHandler(s.event)}"
            >
                <span class="heading-content" part="heading-content">
                    <slot name="heading"></slot>
                </span>
            </button>
            ${Pt(i,t)}
            ${At(i,t)}
            <span class="icon" part="icon" aria-hidden="true">
                <slot name="expanded-icon" part="expanded-icon">
                    ${t.expandedIcon||""}
                </slot>
                <slot name="collapsed-icon" part="collapsed-icon">
                    ${t.collapsedIcon||""}
                </slot>
            <span>
        </div>
        <div
            class="region"
            part="region"
            id="${e=>e.id}-panel"
            role="region"
            aria-labelledby="${e=>e.id}"
        >
            <slot></slot>
        </div>
    </template>
`;/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */function c(i,t,e,s){var o=arguments.length,n=o<3?t:s===null?s=Object.getOwnPropertyDescriptor(t,e):s,r;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(i,t,e,s);else for(var a=i.length-1;a>=0;a--)(r=i[a])&&(n=(o<3?r(n):o>3?r(t,e,n):r(t,e))||n);return o>3&&n&&Object.defineProperty(t,e,n),n}const un=new Map;"metadata"in Reflect||(Reflect.metadata=function(i,t){return function(e){Reflect.defineMetadata(i,t,e)}},Reflect.defineMetadata=function(i,t,e){let s=un.get(e);s===void 0&&un.set(e,s=new Map),s.set(i,t)},Reflect.getOwnMetadata=function(i,t){const e=un.get(t);if(e!==void 0)return e.get(i)});class Qd{constructor(t,e){this.container=t,this.key=e}instance(t){return this.registerResolver(0,t)}singleton(t){return this.registerResolver(1,t)}transient(t){return this.registerResolver(2,t)}callback(t){return this.registerResolver(3,t)}cachedCallback(t){return this.registerResolver(3,Ma(t))}aliasTo(t){return this.registerResolver(5,t)}registerResolver(t,e){const{container:s,key:o}=this;return this.container=this.key=void 0,s.registerResolver(o,new te(o,t,e))}}function os(i){const t=i.slice(),e=Object.keys(i),s=e.length;let o;for(let n=0;n<s;++n)o=e[n],Na(o)||(t[o]=i[o]);return t}const Zd=Object.freeze({none(i){throw Error(`${i.toString()} not registered, did you forget to add @singleton()?`)},singleton(i){return new te(i,1,i)},transient(i){return new te(i,2,i)}}),pn=Object.freeze({default:Object.freeze({parentLocator:()=>null,responsibleForOwnerRequests:!1,defaultResolver:Zd.singleton})}),Da=new Map;function Ea(i){return t=>Reflect.getOwnMetadata(i,t)}let La=null;const nt=Object.freeze({createContainer(i){return new Cs(null,Object.assign({},pn.default,i))},findResponsibleContainer(i){const t=i.$$container$$;return t&&t.responsibleForOwnerRequests?t:nt.findParentContainer(i)},findParentContainer(i){const t=new CustomEvent(Va,{bubbles:!0,composed:!0,cancelable:!0,detail:{container:void 0}});return i.dispatchEvent(t),t.detail.container||nt.getOrCreateDOMContainer()},getOrCreateDOMContainer(i,t){return i?i.$$container$$||new Cs(i,Object.assign({},pn.default,t,{parentLocator:nt.findParentContainer})):La||(La=new Cs(null,Object.assign({},pn.default,t,{parentLocator:()=>null})))},getDesignParamtypes:Ea("design:paramtypes"),getAnnotationParamtypes:Ea("di:paramtypes"),getOrCreateAnnotationParamTypes(i){let t=this.getAnnotationParamtypes(i);return t===void 0&&Reflect.defineMetadata("di:paramtypes",t=[],i),t},getDependencies(i){let t=Da.get(i);if(t===void 0){const e=i.inject;if(e===void 0){const s=nt.getDesignParamtypes(i),o=nt.getAnnotationParamtypes(i);if(s===void 0)if(o===void 0){const n=Object.getPrototypeOf(i);typeof n=="function"&&n!==Function.prototype?t=os(nt.getDependencies(n)):t=[]}else t=os(o);else if(o===void 0)t=os(s);else{t=os(s);let n=o.length,r;for(let h=0;h<n;++h)r=o[h],r!==void 0&&(t[h]=r);const a=Object.keys(o);n=a.length;let l;for(let h=0;h<n;++h)l=a[h],Na(l)||(t[l]=o[l])}}else t=os(e);Da.set(i,t)}return t},defineProperty(i,t,e,s=!1){const o=`$di_${t}`;Reflect.defineProperty(i,t,{get:function(){let n=this[o];if(n===void 0&&(n=(this instanceof HTMLElement?nt.findResponsibleContainer(this):nt.getOrCreateDOMContainer()).get(e),this[o]=n,s&&this instanceof Bs)){const a=this.$fastController,l=()=>{const p=nt.findResponsibleContainer(this).get(e),f=this[o];p!==f&&(this[o]=n,a.notify(t))};a.subscribe({handleChange:l},"isConnected")}return n}})},createInterface(i,t){const e=typeof i=="function"?i:t,s=typeof i=="string"?i:i&&"friendlyName"in i&&i.friendlyName||Ha,o=typeof i=="string"?!1:i&&"respectConnection"in i&&i.respectConnection||!1,n=function(r,a,l){if(r==null||new.target!==void 0)throw new Error(`No registration for interface: '${n.friendlyName}'`);if(a)nt.defineProperty(r,a,n,o);else{const h=nt.getOrCreateAnnotationParamTypes(r);h[l]=n}};return n.$isInterface=!0,n.friendlyName=s==null?"(anonymous)":s,e!=null&&(n.register=function(r,a){return e(new Qd(r,a!=null?a:n))}),n.toString=function(){return`InterfaceSymbol<${n.friendlyName}>`},n},inject(...i){return function(t,e,s){if(typeof s=="number"){const o=nt.getOrCreateAnnotationParamTypes(t),n=i[0];n!==void 0&&(o[s]=n)}else if(e)nt.defineProperty(t,e,i[0]);else{const o=s?nt.getOrCreateAnnotationParamTypes(s.value):nt.getOrCreateAnnotationParamTypes(t);let n;for(let r=0;r<i.length;++r)n=i[r],n!==void 0&&(o[r]=n)}}},transient(i){return i.register=function(e){return ns.transient(i,i).register(e)},i.registerInRequestor=!1,i},singleton(i,t=Kd){return i.register=function(s){return ns.singleton(i,i).register(s)},i.registerInRequestor=t.scoped,i}}),Jd=nt.createInterface("Container");nt.inject;const Kd={scoped:!1};class te{constructor(t,e,s){this.key=t,this.strategy=e,this.state=s,this.resolving=!1}get $isResolver(){return!0}register(t){return t.registerResolver(this.key,this)}resolve(t,e){switch(this.strategy){case 0:return this.state;case 1:{if(this.resolving)throw new Error(`Cyclic dependency found: ${this.state.name}`);return this.resolving=!0,this.state=t.getFactory(this.state).construct(e),this.strategy=0,this.resolving=!1,this.state}case 2:{const s=t.getFactory(this.state);if(s===null)throw new Error(`Resolver for ${String(this.key)} returned a null factory`);return s.construct(e)}case 3:return this.state(t,e,this);case 4:return this.state[0].resolve(t,e);case 5:return e.get(this.state);default:throw new Error(`Invalid resolver strategy specified: ${this.strategy}.`)}}getFactory(t){var e,s,o;switch(this.strategy){case 1:case 2:return t.getFactory(this.state);case 5:return(o=(s=(e=t.getResolver(this.state))===null||e===void 0?void 0:e.getFactory)===null||s===void 0?void 0:s.call(e,t))!==null&&o!==void 0?o:null;default:return null}}}function Aa(i){return this.get(i)}function tu(i,t){return t(i)}class eu{constructor(t,e){this.Type=t,this.dependencies=e,this.transformers=null}construct(t,e){let s;return e===void 0?s=new this.Type(...this.dependencies.map(Aa,t)):s=new this.Type(...this.dependencies.map(Aa,t),...e),this.transformers==null?s:this.transformers.reduce(tu,s)}registerTransformer(t){(this.transformers||(this.transformers=[])).push(t)}}const iu={$isResolver:!0,resolve(i,t){return t}};function js(i){return typeof i.register=="function"}function su(i){return js(i)&&typeof i.registerInRequestor=="boolean"}function Pa(i){return su(i)&&i.registerInRequestor}function ou(i){return i.prototype!==void 0}const nu=new Set(["Array","ArrayBuffer","Boolean","DataView","Date","Error","EvalError","Float32Array","Float64Array","Function","Int8Array","Int16Array","Int32Array","Map","Number","Object","Promise","RangeError","ReferenceError","RegExp","Set","SharedArrayBuffer","String","SyntaxError","TypeError","Uint8Array","Uint8ClampedArray","Uint16Array","Uint32Array","URIError","WeakMap","WeakSet"]),Va="__DI_LOCATE_PARENT__",fn=new Map;class Cs{constructor(t,e){this.owner=t,this.config=e,this._parent=void 0,this.registerDepth=0,this.context=null,t!==null&&(t.$$container$$=this),this.resolvers=new Map,this.resolvers.set(Jd,iu),t instanceof Node&&t.addEventListener(Va,s=>{s.composedPath()[0]!==this.owner&&(s.detail.container=this,s.stopImmediatePropagation())})}get parent(){return this._parent===void 0&&(this._parent=this.config.parentLocator(this.owner)),this._parent}get depth(){return this.parent===null?0:this.parent.depth+1}get responsibleForOwnerRequests(){return this.config.responsibleForOwnerRequests}registerWithContext(t,...e){return this.context=t,this.register(...e),this.context=null,this}register(...t){if(++this.registerDepth===100)throw new Error("Unable to autoregister dependency");let e,s,o,n,r;const a=this.context;for(let l=0,h=t.length;l<h;++l)if(e=t[l],!!Ba(e))if(js(e))e.register(this,a);else if(ou(e))ns.singleton(e,e).register(this);else for(s=Object.keys(e),n=0,r=s.length;n<r;++n)o=e[s[n]],Ba(o)&&(js(o)?o.register(this,a):this.register(o));return--this.registerDepth,this}registerResolver(t,e){_s(t);const s=this.resolvers,o=s.get(t);return o==null?s.set(t,e):o instanceof te&&o.strategy===4?o.state.push(e):s.set(t,new te(t,4,[o,e])),e}registerTransformer(t,e){const s=this.getResolver(t);if(s==null)return!1;if(s.getFactory){const o=s.getFactory(this);return o==null?!1:(o.registerTransformer(e),!0)}return!1}getResolver(t,e=!0){if(_s(t),t.resolve!==void 0)return t;let s=this,o;for(;s!=null;)if(o=s.resolvers.get(t),o==null){if(s.parent==null){const n=Pa(t)?this:s;return e?this.jitRegister(t,n):null}s=s.parent}else return o;return null}has(t,e=!1){return this.resolvers.has(t)?!0:e&&this.parent!=null?this.parent.has(t,!0):!1}get(t){if(_s(t),t.$isResolver)return t.resolve(this,this);let e=this,s;for(;e!=null;)if(s=e.resolvers.get(t),s==null){if(e.parent==null){const o=Pa(t)?this:e;return s=this.jitRegister(t,o),s.resolve(e,this)}e=e.parent}else return s.resolve(e,this);throw new Error(`Unable to resolve key: ${t}`)}getAll(t,e=!1){_s(t);const s=this;let o=s,n;if(e){let r=Ye;for(;o!=null;)n=o.resolvers.get(t),n!=null&&(r=r.concat(za(n,o,s))),o=o.parent;return r}else for(;o!=null;)if(n=o.resolvers.get(t),n==null){if(o=o.parent,o==null)return Ye}else return za(n,o,s);return Ye}getFactory(t){let e=fn.get(t);if(e===void 0){if(ru(t))throw new Error(`${t.name} is a native function and therefore cannot be safely constructed by DI. If this is intentional, please use a callback or cachedCallback resolver.`);fn.set(t,e=new eu(t,nt.getDependencies(t)))}return e}registerFactory(t,e){fn.set(t,e)}createChild(t){return new Cs(null,Object.assign({},this.config,t,{parentLocator:()=>this}))}jitRegister(t,e){if(typeof t!="function")throw new Error(`Attempted to jitRegister something that is not a constructor: '${t}'. Did you forget to register this dependency?`);if(nu.has(t.name))throw new Error(`Attempted to jitRegister an intrinsic type: ${t.name}. Did you forget to add @inject(Key)`);if(js(t)){const s=t.register(e);if(!(s instanceof Object)||s.resolve==null){const o=e.resolvers.get(t);if(o!=null)return o;throw new Error("A valid resolver was not returned from the static register method")}return s}else{if(t.$isInterface)throw new Error(`Attempted to jitRegister an interface: ${t.friendlyName}`);{const s=this.config.defaultResolver(t,e);return e.resolvers.set(t,s),s}}}}const gn=new WeakMap;function Ma(i){return function(t,e,s){if(gn.has(s))return gn.get(s);const o=i(t,e,s);return gn.set(s,o),o}}const ns=Object.freeze({instance(i,t){return new te(i,0,t)},singleton(i,t){return new te(i,1,t)},transient(i,t){return new te(i,2,t)},callback(i,t){return new te(i,3,t)},cachedCallback(i,t){return new te(i,3,Ma(t))},aliasTo(i,t){return new te(t,5,i)}});function _s(i){if(i==null)throw new Error("key/value cannot be null or undefined. Are you trying to inject/register something that doesn't exist with DI?")}function za(i,t,e){if(i instanceof te&&i.strategy===4){const s=i.state;let o=s.length;const n=new Array(o);for(;o--;)n[o]=s[o].resolve(t,e);return n}return[i.resolve(t,e)]}const Ha="(anonymous)";function Ba(i){return typeof i=="object"&&i!==null||typeof i=="function"}const ru=function(){const i=new WeakMap;let t=!1,e="",s=0;return function(o){return t=i.get(o),t===void 0&&(e=o.toString(),s=e.length,t=s>=29&&s<=100&&e.charCodeAt(s-1)===125&&e.charCodeAt(s-2)<=32&&e.charCodeAt(s-3)===93&&e.charCodeAt(s-4)===101&&e.charCodeAt(s-5)===100&&e.charCodeAt(s-6)===111&&e.charCodeAt(s-7)===99&&e.charCodeAt(s-8)===32&&e.charCodeAt(s-9)===101&&e.charCodeAt(s-10)===118&&e.charCodeAt(s-11)===105&&e.charCodeAt(s-12)===116&&e.charCodeAt(s-13)===97&&e.charCodeAt(s-14)===110&&e.charCodeAt(s-15)===88,i.set(o,t)),t}}(),Us={};function Na(i){switch(typeof i){case"number":return i>=0&&(i|0)===i;case"string":{const t=Us[i];if(t!==void 0)return t;const e=i.length;if(e===0)return Us[i]=!1;let s=0;for(let o=0;o<e;++o)if(s=i.charCodeAt(o),o===0&&s===48&&e>1||s<48||s>57)return Us[i]=!1;return Us[i]=!0}default:return!1}}function ja(i){return`${i.toLowerCase()}:presentation`}const qs=new Map,_a=Object.freeze({define(i,t,e){const s=ja(i);qs.get(s)===void 0?qs.set(s,t):qs.set(s,!1),e.register(ns.instance(s,t))},forTag(i,t){const e=ja(i),s=qs.get(e);return s===!1?nt.findResponsibleContainer(t).get(e):s||null}});class au{constructor(t,e){this.template=t||null,this.styles=e===void 0?null:Array.isArray(e)?Lt.create(e):e instanceof Lt?e:Lt.create([e])}applyTo(t){const e=t.$fastController;e.template===null&&(e.template=this.template),e.styles===null&&(e.styles=this.styles)}}class E extends Bs{constructor(){super(...arguments),this._presentation=void 0}get $presentation(){return this._presentation===void 0&&(this._presentation=_a.forTag(this.tagName,this)),this._presentation}templateChanged(){this.template!==void 0&&(this.$fastController.template=this.template)}stylesChanged(){this.styles!==void 0&&(this.$fastController.styles=this.styles)}connectedCallback(){this.$presentation!==null&&this.$presentation.applyTo(this),super.connectedCallback()}static compose(t){return(e={})=>new lu(this===E?class extends E{}:this,t,e)}}c([g],E.prototype,"template",void 0),c([g],E.prototype,"styles",void 0);function rs(i,t,e){return typeof i=="function"?i(t,e):i}class lu{constructor(t,e,s){this.type=t,this.elementDefinition=e,this.overrideDefinition=s,this.definition=Object.assign(Object.assign({},this.elementDefinition),this.overrideDefinition)}register(t,e){const s=this.definition,o=this.overrideDefinition,r=`${s.prefix||e.elementPrefix}-${s.baseName}`;e.tryDefineElement({name:r,type:this.type,baseClass:this.elementDefinition.baseClass,callback:a=>{const l=new au(rs(s.template,a,s),rs(s.styles,a,s));a.definePresentation(l);let h=rs(s.shadowOptions,a,s);a.shadowRootMode&&(h?o.shadowOptions||(h.mode=a.shadowRootMode):h!==null&&(h={mode:a.shadowRootMode})),a.defineElement({elementOptions:rs(s.elementOptions,a,s),shadowOptions:h,attributes:rs(s.attributes,a,s)})}})}}function tt(i,...t){const e=Ms.locate(i);t.forEach(s=>{Object.getOwnPropertyNames(s.prototype).forEach(n=>{n!=="constructor"&&Object.defineProperty(i.prototype,n,Object.getOwnPropertyDescriptor(s.prototype,n))}),Ms.locate(s).forEach(n=>e.push(n))})}class Qe extends E{constructor(){super(...arguments),this.headinglevel=2,this.expanded=!1,this.clickHandler=t=>{this.expanded=!this.expanded,this.change()},this.change=()=>{this.$emit("change")}}}c([u({attribute:"heading-level",mode:"fromView",converter:C})],Qe.prototype,"headinglevel",void 0),c([u({mode:"boolean"})],Qe.prototype,"expanded",void 0),c([u],Qe.prototype,"id",void 0),tt(Qe,Bt);const cu=(i,t)=>v`
    <template>
        <slot ${Z({property:"accordionItems",filter:Ie()})}></slot>
        <slot name="item" part="item" ${Z("accordionItems")}></slot>
    </template>
`,rt={horizontal:"horizontal",vertical:"vertical"};function hu(i,t){let e=i.length;for(;e--;)if(t(i[e],e,i))return e;return-1}function Ci(...i){return i.every(t=>t instanceof HTMLElement)}function du(i,t){return!i||!t||!Ci(i)?void 0:Array.from(i.querySelectorAll(t)).filter(s=>s.offsetParent!==null)}function uu(){const i=document.querySelector('meta[property="csp-nonce"]');return i?i.getAttribute("content"):null}let Ze;function pu(){if(typeof Ze=="boolean")return Ze;if(!Ah())return Ze=!1,Ze;const i=document.createElement("style"),t=uu();t!==null&&i.setAttribute("nonce",t),document.head.appendChild(i);try{i.sheet.insertRule("foo:focus-visible {color:inherit}",0),Ze=!0}catch(e){Ze=!1}finally{document.head.removeChild(i)}return Ze}const Ua="focus",qa="focusin",Ti="focusout",Ii="keydown",Ga="resize",Wa="scroll";var Xa;(function(i){i[i.alt=18]="alt",i[i.arrowDown=40]="arrowDown",i[i.arrowLeft=37]="arrowLeft",i[i.arrowRight=39]="arrowRight",i[i.arrowUp=38]="arrowUp",i[i.back=8]="back",i[i.backSlash=220]="backSlash",i[i.break=19]="break",i[i.capsLock=20]="capsLock",i[i.closeBracket=221]="closeBracket",i[i.colon=186]="colon",i[i.colon2=59]="colon2",i[i.comma=188]="comma",i[i.ctrl=17]="ctrl",i[i.delete=46]="delete",i[i.end=35]="end",i[i.enter=13]="enter",i[i.equals=187]="equals",i[i.equals2=61]="equals2",i[i.equals3=107]="equals3",i[i.escape=27]="escape",i[i.forwardSlash=191]="forwardSlash",i[i.function1=112]="function1",i[i.function10=121]="function10",i[i.function11=122]="function11",i[i.function12=123]="function12",i[i.function2=113]="function2",i[i.function3=114]="function3",i[i.function4=115]="function4",i[i.function5=116]="function5",i[i.function6=117]="function6",i[i.function7=118]="function7",i[i.function8=119]="function8",i[i.function9=120]="function9",i[i.home=36]="home",i[i.insert=45]="insert",i[i.menu=93]="menu",i[i.minus=189]="minus",i[i.minus2=109]="minus2",i[i.numLock=144]="numLock",i[i.numPad0=96]="numPad0",i[i.numPad1=97]="numPad1",i[i.numPad2=98]="numPad2",i[i.numPad3=99]="numPad3",i[i.numPad4=100]="numPad4",i[i.numPad5=101]="numPad5",i[i.numPad6=102]="numPad6",i[i.numPad7=103]="numPad7",i[i.numPad8=104]="numPad8",i[i.numPad9=105]="numPad9",i[i.numPadDivide=111]="numPadDivide",i[i.numPadDot=110]="numPadDot",i[i.numPadMinus=109]="numPadMinus",i[i.numPadMultiply=106]="numPadMultiply",i[i.numPadPlus=107]="numPadPlus",i[i.openBracket=219]="openBracket",i[i.pageDown=34]="pageDown",i[i.pageUp=33]="pageUp",i[i.period=190]="period",i[i.print=44]="print",i[i.quote=222]="quote",i[i.scrollLock=145]="scrollLock",i[i.shift=16]="shift",i[i.space=32]="space",i[i.tab=9]="tab",i[i.tilde=192]="tilde",i[i.windowsLeft=91]="windowsLeft",i[i.windowsOpera=219]="windowsOpera",i[i.windowsRight=92]="windowsRight"})(Xa||(Xa={}));const Wt="ArrowDown",Se="ArrowLeft",Fe="ArrowRight",Xt="ArrowUp",de="Enter",Je="Escape",me="Home",be="End",fu="F2",gu="PageDown",mu="PageUp",Ke=" ",Gs="Tab",bu="Backspace",vu="Delete",Si={ArrowDown:Wt,ArrowLeft:Se,ArrowRight:Fe,ArrowUp:Xt};var J;(function(i){i.ltr="ltr",i.rtl="rtl"})(J||(J={}));function Ya(i,t,e){return e<i?t:e>t?i:e}function mn(i,t,e){return Math.min(Math.max(e,i),t)}function Ws(i,t,e=0){return[t,e]=[t,e].sort((s,o)=>s-o),t<=i&&i<e}let yu=0;function ti(i=""){return`${i}${yu++}`}var d;(function(i){i.Canvas="Canvas",i.CanvasText="CanvasText",i.LinkText="LinkText",i.VisitedText="VisitedText",i.ActiveText="ActiveText",i.ButtonFace="ButtonFace",i.ButtonText="ButtonText",i.Field="Field",i.FieldText="FieldText",i.Highlight="Highlight",i.HighlightText="HighlightText",i.GrayText="GrayText"})(d||(d={}));const Qa={single:"single",multi:"multi"};class bn extends E{constructor(){super(...arguments),this.expandmode=Qa.multi,this.activeItemIndex=0,this.change=()=>{this.$emit("change",this.activeid)},this.setItems=()=>{var t;this.accordionItems.length!==0&&(this.accordionIds=this.getItemIds(),this.accordionItems.forEach((e,s)=>{e instanceof Qe&&(e.addEventListener("change",this.activeItemChange),this.isSingleExpandMode()&&(this.activeItemIndex!==s?e.expanded=!1:e.expanded=!0));const o=this.accordionIds[s];e.setAttribute("id",typeof o!="string"?`accordion-${s+1}`:o),this.activeid=this.accordionIds[this.activeItemIndex],e.addEventListener("keydown",this.handleItemKeyDown),e.addEventListener("focus",this.handleItemFocus)}),this.isSingleExpandMode()&&((t=this.findExpandedItem())!==null&&t!==void 0?t:this.accordionItems[0]).setAttribute("aria-disabled","true"))},this.removeItemListeners=t=>{t.forEach((e,s)=>{e.removeEventListener("change",this.activeItemChange),e.removeEventListener("keydown",this.handleItemKeyDown),e.removeEventListener("focus",this.handleItemFocus)})},this.activeItemChange=t=>{if(t.defaultPrevented||t.target!==t.currentTarget)return;t.preventDefault();const e=t.target;this.activeid=e.getAttribute("id"),this.isSingleExpandMode()&&(this.resetItems(),e.expanded=!0,e.setAttribute("aria-disabled","true"),this.accordionItems.forEach(s=>{!s.hasAttribute("disabled")&&s.id!==this.activeid&&s.removeAttribute("aria-disabled")})),this.activeItemIndex=Array.from(this.accordionItems).indexOf(e),this.change()},this.handleItemKeyDown=t=>{if(t.target===t.currentTarget)switch(this.accordionIds=this.getItemIds(),t.key){case Xt:t.preventDefault(),this.adjust(-1);break;case Wt:t.preventDefault(),this.adjust(1);break;case me:this.activeItemIndex=0,this.focusItem();break;case be:this.activeItemIndex=this.accordionItems.length-1,this.focusItem();break}},this.handleItemFocus=t=>{if(t.target===t.currentTarget){const e=t.target,s=this.activeItemIndex=Array.from(this.accordionItems).indexOf(e);this.activeItemIndex!==s&&s!==-1&&(this.activeItemIndex=s,this.activeid=this.accordionIds[this.activeItemIndex])}}}accordionItemsChanged(t,e){this.$fastController.isConnected&&(this.removeItemListeners(t),this.setItems())}findExpandedItem(){for(let t=0;t<this.accordionItems.length;t++)if(this.accordionItems[t].getAttribute("expanded")==="true")return this.accordionItems[t];return null}resetItems(){this.accordionItems.forEach((t,e)=>{t.expanded=!1})}getItemIds(){return this.accordionItems.map(t=>t.getAttribute("id"))}isSingleExpandMode(){return this.expandmode===Qa.single}adjust(t){this.activeItemIndex=Ya(0,this.accordionItems.length-1,this.activeItemIndex+t),this.focusItem()}focusItem(){const t=this.accordionItems[this.activeItemIndex];t instanceof Qe&&t.expandbutton.focus()}}c([u({attribute:"expand-mode"})],bn.prototype,"expandmode",void 0),c([g],bn.prototype,"accordionItems",void 0);const Za=(i,t)=>v`
    <a
        class="control"
        part="control"
        download="${e=>e.download}"
        href="${e=>e.href}"
        hreflang="${e=>e.hreflang}"
        ping="${e=>e.ping}"
        referrerpolicy="${e=>e.referrerpolicy}"
        rel="${e=>e.rel}"
        target="${e=>e.target}"
        type="${e=>e.type}"
        aria-atomic="${e=>e.ariaAtomic}"
        aria-busy="${e=>e.ariaBusy}"
        aria-controls="${e=>e.ariaControls}"
        aria-current="${e=>e.ariaCurrent}"
        aria-describedby="${e=>e.ariaDescribedby}"
        aria-details="${e=>e.ariaDetails}"
        aria-disabled="${e=>e.ariaDisabled}"
        aria-errormessage="${e=>e.ariaErrormessage}"
        aria-expanded="${e=>e.ariaExpanded}"
        aria-flowto="${e=>e.ariaFlowto}"
        aria-haspopup="${e=>e.ariaHaspopup}"
        aria-hidden="${e=>e.ariaHidden}"
        aria-invalid="${e=>e.ariaInvalid}"
        aria-keyshortcuts="${e=>e.ariaKeyshortcuts}"
        aria-label="${e=>e.ariaLabel}"
        aria-labelledby="${e=>e.ariaLabelledby}"
        aria-live="${e=>e.ariaLive}"
        aria-owns="${e=>e.ariaOwns}"
        aria-relevant="${e=>e.ariaRelevant}"
        aria-roledescription="${e=>e.ariaRoledescription}"
        ${j("control")}
    >
        ${Pt(i,t)}
        <span class="content" part="content">
            <slot ${Z("defaultSlottedContent")}></slot>
        </span>
        ${At(i,t)}
    </a>
`;class K{}c([u({attribute:"aria-atomic"})],K.prototype,"ariaAtomic",void 0),c([u({attribute:"aria-busy"})],K.prototype,"ariaBusy",void 0),c([u({attribute:"aria-controls"})],K.prototype,"ariaControls",void 0),c([u({attribute:"aria-current"})],K.prototype,"ariaCurrent",void 0),c([u({attribute:"aria-describedby"})],K.prototype,"ariaDescribedby",void 0),c([u({attribute:"aria-details"})],K.prototype,"ariaDetails",void 0),c([u({attribute:"aria-disabled"})],K.prototype,"ariaDisabled",void 0),c([u({attribute:"aria-errormessage"})],K.prototype,"ariaErrormessage",void 0),c([u({attribute:"aria-flowto"})],K.prototype,"ariaFlowto",void 0),c([u({attribute:"aria-haspopup"})],K.prototype,"ariaHaspopup",void 0),c([u({attribute:"aria-hidden"})],K.prototype,"ariaHidden",void 0),c([u({attribute:"aria-invalid"})],K.prototype,"ariaInvalid",void 0),c([u({attribute:"aria-keyshortcuts"})],K.prototype,"ariaKeyshortcuts",void 0),c([u({attribute:"aria-label"})],K.prototype,"ariaLabel",void 0),c([u({attribute:"aria-labelledby"})],K.prototype,"ariaLabelledby",void 0),c([u({attribute:"aria-live"})],K.prototype,"ariaLive",void 0),c([u({attribute:"aria-owns"})],K.prototype,"ariaOwns",void 0),c([u({attribute:"aria-relevant"})],K.prototype,"ariaRelevant",void 0),c([u({attribute:"aria-roledescription"})],K.prototype,"ariaRoledescription",void 0);class Yt extends E{constructor(){super(...arguments),this.handleUnsupportedDelegatesFocus=()=>{var t;window.ShadowRoot&&!window.ShadowRoot.prototype.hasOwnProperty("delegatesFocus")&&(!((t=this.$fastController.definition.shadowOptions)===null||t===void 0)&&t.delegatesFocus)&&(this.focus=()=>{var e;(e=this.control)===null||e===void 0||e.focus()})}}connectedCallback(){super.connectedCallback(),this.handleUnsupportedDelegatesFocus()}}c([u],Yt.prototype,"download",void 0),c([u],Yt.prototype,"href",void 0),c([u],Yt.prototype,"hreflang",void 0),c([u],Yt.prototype,"ping",void 0),c([u],Yt.prototype,"referrerpolicy",void 0),c([u],Yt.prototype,"rel",void 0),c([u],Yt.prototype,"target",void 0),c([u],Yt.prototype,"type",void 0),c([g],Yt.prototype,"defaultSlottedContent",void 0);class Xs{}c([u({attribute:"aria-expanded"})],Xs.prototype,"ariaExpanded",void 0),tt(Xs,K),tt(Yt,Bt,Xs);const xu=(i,t)=>v`
    <template class="${e=>e.initialLayoutComplete?"loaded":""}">
        ${Q(e=>e.initialLayoutComplete,v`
                <slot></slot>
            `)}
    </template>
`,ei=i=>{const t=i.closest("[dir]");return t!==null&&t.dir==="rtl"?J.rtl:J.ltr};class $u{constructor(){this.intersectionDetector=null,this.observedElements=new Map,this.requestPosition=(t,e)=>{var s;if(this.intersectionDetector!==null){if(this.observedElements.has(t)){(s=this.observedElements.get(t))===null||s===void 0||s.push(e);return}this.observedElements.set(t,[e]),this.intersectionDetector.observe(t)}},this.cancelRequestPosition=(t,e)=>{const s=this.observedElements.get(t);if(s!==void 0){const o=s.indexOf(e);o!==-1&&s.splice(o,1)}},this.initializeIntersectionDetector=()=>{Te.IntersectionObserver&&(this.intersectionDetector=new IntersectionObserver(this.handleIntersection,{root:null,rootMargin:"0px",threshold:[0,1]}))},this.handleIntersection=t=>{if(this.intersectionDetector===null)return;const e=[],s=[];t.forEach(o=>{var n;(n=this.intersectionDetector)===null||n===void 0||n.unobserve(o.target);const r=this.observedElements.get(o.target);r!==void 0&&(r.forEach(a=>{let l=e.indexOf(a);l===-1&&(l=e.length,e.push(a),s.push([])),s[l].push(o)}),this.observedElements.delete(o.target))}),e.forEach((o,n)=>{o(s[n])})},this.initializeIntersectionDetector()}}class q extends E{constructor(){super(...arguments),this.anchor="",this.viewport="",this.horizontalPositioningMode="uncontrolled",this.horizontalDefaultPosition="unset",this.horizontalViewportLock=!1,this.horizontalInset=!1,this.horizontalScaling="content",this.verticalPositioningMode="uncontrolled",this.verticalDefaultPosition="unset",this.verticalViewportLock=!1,this.verticalInset=!1,this.verticalScaling="content",this.fixedPlacement=!1,this.autoUpdateMode="anchor",this.anchorElement=null,this.viewportElement=null,this.initialLayoutComplete=!1,this.resizeDetector=null,this.baseHorizontalOffset=0,this.baseVerticalOffset=0,this.pendingPositioningUpdate=!1,this.pendingReset=!1,this.currentDirection=J.ltr,this.regionVisible=!1,this.forceUpdate=!1,this.updateThreshold=.5,this.update=()=>{this.pendingPositioningUpdate||this.requestPositionUpdates()},this.startObservers=()=>{this.stopObservers(),this.anchorElement!==null&&(this.requestPositionUpdates(),this.resizeDetector!==null&&(this.resizeDetector.observe(this.anchorElement),this.resizeDetector.observe(this)))},this.requestPositionUpdates=()=>{this.anchorElement===null||this.pendingPositioningUpdate||(q.intersectionService.requestPosition(this,this.handleIntersection),q.intersectionService.requestPosition(this.anchorElement,this.handleIntersection),this.viewportElement!==null&&q.intersectionService.requestPosition(this.viewportElement,this.handleIntersection),this.pendingPositioningUpdate=!0)},this.stopObservers=()=>{this.pendingPositioningUpdate&&(this.pendingPositioningUpdate=!1,q.intersectionService.cancelRequestPosition(this,this.handleIntersection),this.anchorElement!==null&&q.intersectionService.cancelRequestPosition(this.anchorElement,this.handleIntersection),this.viewportElement!==null&&q.intersectionService.cancelRequestPosition(this.viewportElement,this.handleIntersection)),this.resizeDetector!==null&&this.resizeDetector.disconnect()},this.getViewport=()=>typeof this.viewport!="string"||this.viewport===""?document.documentElement:document.getElementById(this.viewport),this.getAnchor=()=>document.getElementById(this.anchor),this.handleIntersection=t=>{this.pendingPositioningUpdate&&(this.pendingPositioningUpdate=!1,this.applyIntersectionEntries(t)&&this.updateLayout())},this.applyIntersectionEntries=t=>{const e=t.find(n=>n.target===this),s=t.find(n=>n.target===this.anchorElement),o=t.find(n=>n.target===this.viewportElement);return e===void 0||o===void 0||s===void 0?!1:!this.regionVisible||this.forceUpdate||this.regionRect===void 0||this.anchorRect===void 0||this.viewportRect===void 0||this.isRectDifferent(this.anchorRect,s.boundingClientRect)||this.isRectDifferent(this.viewportRect,o.boundingClientRect)||this.isRectDifferent(this.regionRect,e.boundingClientRect)?(this.regionRect=e.boundingClientRect,this.anchorRect=s.boundingClientRect,this.viewportElement===document.documentElement?this.viewportRect=new DOMRectReadOnly(o.boundingClientRect.x+document.documentElement.scrollLeft,o.boundingClientRect.y+document.documentElement.scrollTop,o.boundingClientRect.width,o.boundingClientRect.height):this.viewportRect=o.boundingClientRect,this.updateRegionOffset(),this.forceUpdate=!1,!0):!1},this.updateRegionOffset=()=>{this.anchorRect&&this.regionRect&&(this.baseHorizontalOffset=this.baseHorizontalOffset+(this.anchorRect.left-this.regionRect.left)+(this.translateX-this.baseHorizontalOffset),this.baseVerticalOffset=this.baseVerticalOffset+(this.anchorRect.top-this.regionRect.top)+(this.translateY-this.baseVerticalOffset))},this.isRectDifferent=(t,e)=>Math.abs(t.top-e.top)>this.updateThreshold||Math.abs(t.right-e.right)>this.updateThreshold||Math.abs(t.bottom-e.bottom)>this.updateThreshold||Math.abs(t.left-e.left)>this.updateThreshold,this.handleResize=t=>{this.update()},this.reset=()=>{this.pendingReset&&(this.pendingReset=!1,this.anchorElement===null&&(this.anchorElement=this.getAnchor()),this.viewportElement===null&&(this.viewportElement=this.getViewport()),this.currentDirection=ei(this),this.startObservers())},this.updateLayout=()=>{let t,e;if(this.horizontalPositioningMode!=="uncontrolled"){const n=this.getPositioningOptions(this.horizontalInset);if(this.horizontalDefaultPosition==="center")e="center";else if(this.horizontalDefaultPosition!=="unset"){let m=this.horizontalDefaultPosition;if(m==="start"||m==="end"){const w=ei(this);if(w!==this.currentDirection){this.currentDirection=w,this.initialize();return}this.currentDirection===J.ltr?m=m==="start"?"left":"right":m=m==="start"?"right":"left"}switch(m){case"left":e=this.horizontalInset?"insetStart":"start";break;case"right":e=this.horizontalInset?"insetEnd":"end";break}}const r=this.horizontalThreshold!==void 0?this.horizontalThreshold:this.regionRect!==void 0?this.regionRect.width:0,a=this.anchorRect!==void 0?this.anchorRect.left:0,l=this.anchorRect!==void 0?this.anchorRect.right:0,h=this.anchorRect!==void 0?this.anchorRect.width:0,p=this.viewportRect!==void 0?this.viewportRect.left:0,f=this.viewportRect!==void 0?this.viewportRect.right:0;(e===void 0||this.horizontalPositioningMode!=="locktodefault"&&this.getAvailableSpace(e,a,l,h,p,f)<r)&&(e=this.getAvailableSpace(n[0],a,l,h,p,f)>this.getAvailableSpace(n[1],a,l,h,p,f)?n[0]:n[1])}if(this.verticalPositioningMode!=="uncontrolled"){const n=this.getPositioningOptions(this.verticalInset);if(this.verticalDefaultPosition==="center")t="center";else if(this.verticalDefaultPosition!=="unset")switch(this.verticalDefaultPosition){case"top":t=this.verticalInset?"insetStart":"start";break;case"bottom":t=this.verticalInset?"insetEnd":"end";break}const r=this.verticalThreshold!==void 0?this.verticalThreshold:this.regionRect!==void 0?this.regionRect.height:0,a=this.anchorRect!==void 0?this.anchorRect.top:0,l=this.anchorRect!==void 0?this.anchorRect.bottom:0,h=this.anchorRect!==void 0?this.anchorRect.height:0,p=this.viewportRect!==void 0?this.viewportRect.top:0,f=this.viewportRect!==void 0?this.viewportRect.bottom:0;(t===void 0||this.verticalPositioningMode!=="locktodefault"&&this.getAvailableSpace(t,a,l,h,p,f)<r)&&(t=this.getAvailableSpace(n[0],a,l,h,p,f)>this.getAvailableSpace(n[1],a,l,h,p,f)?n[0]:n[1])}const s=this.getNextRegionDimension(e,t),o=this.horizontalPosition!==e||this.verticalPosition!==t;if(this.setHorizontalPosition(e,s),this.setVerticalPosition(t,s),this.updateRegionStyle(),!this.initialLayoutComplete){this.initialLayoutComplete=!0,this.requestPositionUpdates();return}this.regionVisible||(this.regionVisible=!0,this.style.removeProperty("pointer-events"),this.style.removeProperty("opacity"),this.classList.toggle("loaded",!0),this.$emit("loaded",this,{bubbles:!1})),this.updatePositionClasses(),o&&this.$emit("positionchange",this,{bubbles:!1})},this.updateRegionStyle=()=>{this.style.width=this.regionWidth,this.style.height=this.regionHeight,this.style.transform=`translate(${this.translateX}px, ${this.translateY}px)`},this.updatePositionClasses=()=>{this.classList.toggle("top",this.verticalPosition==="start"),this.classList.toggle("bottom",this.verticalPosition==="end"),this.classList.toggle("inset-top",this.verticalPosition==="insetStart"),this.classList.toggle("inset-bottom",this.verticalPosition==="insetEnd"),this.classList.toggle("vertical-center",this.verticalPosition==="center"),this.classList.toggle("left",this.horizontalPosition==="start"),this.classList.toggle("right",this.horizontalPosition==="end"),this.classList.toggle("inset-left",this.horizontalPosition==="insetStart"),this.classList.toggle("inset-right",this.horizontalPosition==="insetEnd"),this.classList.toggle("horizontal-center",this.horizontalPosition==="center")},this.setHorizontalPosition=(t,e)=>{if(t===void 0||this.regionRect===void 0||this.anchorRect===void 0||this.viewportRect===void 0)return;let s=0;switch(this.horizontalScaling){case"anchor":case"fill":s=this.horizontalViewportLock?this.viewportRect.width:e.width,this.regionWidth=`${s}px`;break;case"content":s=this.regionRect.width,this.regionWidth="unset";break}let o=0;switch(t){case"start":this.translateX=this.baseHorizontalOffset-s,this.horizontalViewportLock&&this.anchorRect.left>this.viewportRect.right&&(this.translateX=this.translateX-(this.anchorRect.left-this.viewportRect.right));break;case"insetStart":this.translateX=this.baseHorizontalOffset-s+this.anchorRect.width,this.horizontalViewportLock&&this.anchorRect.right>this.viewportRect.right&&(this.translateX=this.translateX-(this.anchorRect.right-this.viewportRect.right));break;case"insetEnd":this.translateX=this.baseHorizontalOffset,this.horizontalViewportLock&&this.anchorRect.left<this.viewportRect.left&&(this.translateX=this.translateX-(this.anchorRect.left-this.viewportRect.left));break;case"end":this.translateX=this.baseHorizontalOffset+this.anchorRect.width,this.horizontalViewportLock&&this.anchorRect.right<this.viewportRect.left&&(this.translateX=this.translateX-(this.anchorRect.right-this.viewportRect.left));break;case"center":if(o=(this.anchorRect.width-s)/2,this.translateX=this.baseHorizontalOffset+o,this.horizontalViewportLock){const n=this.anchorRect.left+o,r=this.anchorRect.right-o;n<this.viewportRect.left&&!(r>this.viewportRect.right)?this.translateX=this.translateX-(n-this.viewportRect.left):r>this.viewportRect.right&&!(n<this.viewportRect.left)&&(this.translateX=this.translateX-(r-this.viewportRect.right))}break}this.horizontalPosition=t},this.setVerticalPosition=(t,e)=>{if(t===void 0||this.regionRect===void 0||this.anchorRect===void 0||this.viewportRect===void 0)return;let s=0;switch(this.verticalScaling){case"anchor":case"fill":s=this.verticalViewportLock?this.viewportRect.height:e.height,this.regionHeight=`${s}px`;break;case"content":s=this.regionRect.height,this.regionHeight="unset";break}let o=0;switch(t){case"start":this.translateY=this.baseVerticalOffset-s,this.verticalViewportLock&&this.anchorRect.top>this.viewportRect.bottom&&(this.translateY=this.translateY-(this.anchorRect.top-this.viewportRect.bottom));break;case"insetStart":this.translateY=this.baseVerticalOffset-s+this.anchorRect.height,this.verticalViewportLock&&this.anchorRect.bottom>this.viewportRect.bottom&&(this.translateY=this.translateY-(this.anchorRect.bottom-this.viewportRect.bottom));break;case"insetEnd":this.translateY=this.baseVerticalOffset,this.verticalViewportLock&&this.anchorRect.top<this.viewportRect.top&&(this.translateY=this.translateY-(this.anchorRect.top-this.viewportRect.top));break;case"end":this.translateY=this.baseVerticalOffset+this.anchorRect.height,this.verticalViewportLock&&this.anchorRect.bottom<this.viewportRect.top&&(this.translateY=this.translateY-(this.anchorRect.bottom-this.viewportRect.top));break;case"center":if(o=(this.anchorRect.height-s)/2,this.translateY=this.baseVerticalOffset+o,this.verticalViewportLock){const n=this.anchorRect.top+o,r=this.anchorRect.bottom-o;n<this.viewportRect.top&&!(r>this.viewportRect.bottom)?this.translateY=this.translateY-(n-this.viewportRect.top):r>this.viewportRect.bottom&&!(n<this.viewportRect.top)&&(this.translateY=this.translateY-(r-this.viewportRect.bottom))}}this.verticalPosition=t},this.getPositioningOptions=t=>t?["insetStart","insetEnd"]:["start","end"],this.getAvailableSpace=(t,e,s,o,n,r)=>{const a=e-n,l=r-(e+o);switch(t){case"start":return a;case"insetStart":return a+o;case"insetEnd":return l+o;case"end":return l;case"center":return Math.min(a,l)*2+o}},this.getNextRegionDimension=(t,e)=>{const s={height:this.regionRect!==void 0?this.regionRect.height:0,width:this.regionRect!==void 0?this.regionRect.width:0};return t!==void 0&&this.horizontalScaling==="fill"?s.width=this.getAvailableSpace(t,this.anchorRect!==void 0?this.anchorRect.left:0,this.anchorRect!==void 0?this.anchorRect.right:0,this.anchorRect!==void 0?this.anchorRect.width:0,this.viewportRect!==void 0?this.viewportRect.left:0,this.viewportRect!==void 0?this.viewportRect.right:0):this.horizontalScaling==="anchor"&&(s.width=this.anchorRect!==void 0?this.anchorRect.width:0),e!==void 0&&this.verticalScaling==="fill"?s.height=this.getAvailableSpace(e,this.anchorRect!==void 0?this.anchorRect.top:0,this.anchorRect!==void 0?this.anchorRect.bottom:0,this.anchorRect!==void 0?this.anchorRect.height:0,this.viewportRect!==void 0?this.viewportRect.top:0,this.viewportRect!==void 0?this.viewportRect.bottom:0):this.verticalScaling==="anchor"&&(s.height=this.anchorRect!==void 0?this.anchorRect.height:0),s},this.startAutoUpdateEventListeners=()=>{window.addEventListener(Ga,this.update,{passive:!0}),window.addEventListener(Wa,this.update,{passive:!0,capture:!0}),this.resizeDetector!==null&&this.viewportElement!==null&&this.resizeDetector.observe(this.viewportElement)},this.stopAutoUpdateEventListeners=()=>{window.removeEventListener(Ga,this.update),window.removeEventListener(Wa,this.update),this.resizeDetector!==null&&this.viewportElement!==null&&this.resizeDetector.unobserve(this.viewportElement)}}anchorChanged(){this.initialLayoutComplete&&(this.anchorElement=this.getAnchor())}viewportChanged(){this.initialLayoutComplete&&(this.viewportElement=this.getViewport())}horizontalPositioningModeChanged(){this.requestReset()}horizontalDefaultPositionChanged(){this.updateForAttributeChange()}horizontalViewportLockChanged(){this.updateForAttributeChange()}horizontalInsetChanged(){this.updateForAttributeChange()}horizontalThresholdChanged(){this.updateForAttributeChange()}horizontalScalingChanged(){this.updateForAttributeChange()}verticalPositioningModeChanged(){this.requestReset()}verticalDefaultPositionChanged(){this.updateForAttributeChange()}verticalViewportLockChanged(){this.updateForAttributeChange()}verticalInsetChanged(){this.updateForAttributeChange()}verticalThresholdChanged(){this.updateForAttributeChange()}verticalScalingChanged(){this.updateForAttributeChange()}fixedPlacementChanged(){this.$fastController.isConnected&&this.initialLayoutComplete&&this.initialize()}autoUpdateModeChanged(t,e){this.$fastController.isConnected&&this.initialLayoutComplete&&(t==="auto"&&this.stopAutoUpdateEventListeners(),e==="auto"&&this.startAutoUpdateEventListeners())}anchorElementChanged(){this.requestReset()}viewportElementChanged(){this.$fastController.isConnected&&this.initialLayoutComplete&&this.initialize()}connectedCallback(){super.connectedCallback(),this.autoUpdateMode==="auto"&&this.startAutoUpdateEventListeners(),this.initialize()}disconnectedCallback(){super.disconnectedCallback(),this.autoUpdateMode==="auto"&&this.stopAutoUpdateEventListeners(),this.stopObservers(),this.disconnectResizeDetector()}adoptedCallback(){this.initialize()}disconnectResizeDetector(){this.resizeDetector!==null&&(this.resizeDetector.disconnect(),this.resizeDetector=null)}initializeResizeDetector(){this.disconnectResizeDetector(),this.resizeDetector=new window.ResizeObserver(this.handleResize)}updateForAttributeChange(){this.$fastController.isConnected&&this.initialLayoutComplete&&(this.forceUpdate=!0,this.update())}initialize(){this.initializeResizeDetector(),this.anchorElement===null&&(this.anchorElement=this.getAnchor()),this.requestReset()}requestReset(){this.$fastController.isConnected&&this.pendingReset===!1&&(this.setInitialState(),O.queueUpdate(()=>this.reset()),this.pendingReset=!0)}setInitialState(){this.initialLayoutComplete=!1,this.regionVisible=!1,this.translateX=0,this.translateY=0,this.baseHorizontalOffset=0,this.baseVerticalOffset=0,this.viewportRect=void 0,this.regionRect=void 0,this.anchorRect=void 0,this.verticalPosition=void 0,this.horizontalPosition=void 0,this.style.opacity="0",this.style.pointerEvents="none",this.forceUpdate=!1,this.style.position=this.fixedPlacement?"fixed":"absolute",this.updatePositionClasses(),this.updateRegionStyle()}}q.intersectionService=new $u,c([u],q.prototype,"anchor",void 0),c([u],q.prototype,"viewport",void 0),c([u({attribute:"horizontal-positioning-mode"})],q.prototype,"horizontalPositioningMode",void 0),c([u({attribute:"horizontal-default-position"})],q.prototype,"horizontalDefaultPosition",void 0),c([u({attribute:"horizontal-viewport-lock",mode:"boolean"})],q.prototype,"horizontalViewportLock",void 0),c([u({attribute:"horizontal-inset",mode:"boolean"})],q.prototype,"horizontalInset",void 0),c([u({attribute:"horizontal-threshold"})],q.prototype,"horizontalThreshold",void 0),c([u({attribute:"horizontal-scaling"})],q.prototype,"horizontalScaling",void 0),c([u({attribute:"vertical-positioning-mode"})],q.prototype,"verticalPositioningMode",void 0),c([u({attribute:"vertical-default-position"})],q.prototype,"verticalDefaultPosition",void 0),c([u({attribute:"vertical-viewport-lock",mode:"boolean"})],q.prototype,"verticalViewportLock",void 0),c([u({attribute:"vertical-inset",mode:"boolean"})],q.prototype,"verticalInset",void 0),c([u({attribute:"vertical-threshold"})],q.prototype,"verticalThreshold",void 0),c([u({attribute:"vertical-scaling"})],q.prototype,"verticalScaling",void 0),c([u({attribute:"fixed-placement",mode:"boolean"})],q.prototype,"fixedPlacement",void 0),c([u({attribute:"auto-update-mode"})],q.prototype,"autoUpdateMode",void 0),c([g],q.prototype,"anchorElement",void 0),c([g],q.prototype,"viewportElement",void 0),c([g],q.prototype,"initialLayoutComplete",void 0);const vn={horizontalDefaultPosition:"center",horizontalPositioningMode:"locktodefault",horizontalInset:!1,horizontalScaling:"anchor"},Ja=Object.assign(Object.assign({},vn),{verticalDefaultPosition:"top",verticalPositioningMode:"locktodefault",verticalInset:!1,verticalScaling:"content"}),Ka=Object.assign(Object.assign({},vn),{verticalDefaultPosition:"bottom",verticalPositioningMode:"locktodefault",verticalInset:!1,verticalScaling:"content"}),tl=Object.assign(Object.assign({},vn),{verticalPositioningMode:"dynamic",verticalInset:!1,verticalScaling:"content"}),wu=Object.assign(Object.assign({},Ja),{verticalScaling:"fill"}),el=Object.assign(Object.assign({},Ka),{verticalScaling:"fill"}),ku=Object.assign(Object.assign({},tl),{verticalScaling:"fill"}),Cu=(i,t)=>v`
    <div
        class="backplate ${e=>e.shape}"
        part="backplate"
        style="${e=>e.fill?`background-color: var(--avatar-fill-${e.fill});`:void 0}"
    >
        <a
            class="link"
            part="link"
            href="${e=>e.link?e.link:void 0}"
            style="${e=>e.color?`color: var(--avatar-color-${e.color});`:void 0}"
        >
            <slot name="media" part="media">${t.media||""}</slot>
            <slot class="content" part="content"><slot>
        </a>
    </div>
    <slot name="badge" part="badge"></slot>
`;class Fi extends E{connectedCallback(){super.connectedCallback(),this.shape||(this.shape="circle")}}c([u],Fi.prototype,"fill",void 0),c([u],Fi.prototype,"color",void 0),c([u],Fi.prototype,"link",void 0),c([u],Fi.prototype,"shape",void 0);const Tu=(i,t)=>v`
    <template class="${e=>e.circular?"circular":""}">
        <div class="control" part="control" style="${e=>e.generateBadgeStyle()}">
            <slot></slot>
        </div>
    </template>
`;class ii extends E{constructor(){super(...arguments),this.generateBadgeStyle=()=>{if(!this.fill&&!this.color)return;const t=`background-color: var(--badge-fill-${this.fill});`,e=`color: var(--badge-color-${this.color});`;return this.fill&&!this.color?t:this.color&&!this.fill?e:`${e} ${t}`}}}c([u({attribute:"fill"})],ii.prototype,"fill",void 0),c([u({attribute:"color"})],ii.prototype,"color",void 0),c([u({mode:"boolean"})],ii.prototype,"circular",void 0);const Iu=(i,t)=>v`
    <div role="listitem" class="listitem" part="listitem">
        ${Q(e=>e.href&&e.href.length>0,v`
                ${Za(i,t)}
            `)}
        ${Q(e=>!e.href,v`
                ${Pt(i,t)}
                <slot></slot>
                ${At(i,t)}
            `)}
        ${Q(e=>e.separator,v`
                <span class="separator" part="separator" aria-hidden="true">
                    <slot name="separator">${t.separator||""}</slot>
                </span>
            `)}
    </div>
`;class as extends Yt{constructor(){super(...arguments),this.separator=!0}}c([g],as.prototype,"separator",void 0),tt(as,Bt,Xs);const Su=(i,t)=>v`
    <template role="navigation">
        <div role="list" class="list" part="list">
            <slot
                ${Z({property:"slottedBreadcrumbItems",filter:Ie()})}
            ></slot>
        </div>
    </template>
`;class il extends E{slottedBreadcrumbItemsChanged(){if(this.$fastController.isConnected){if(this.slottedBreadcrumbItems===void 0||this.slottedBreadcrumbItems.length===0)return;const t=this.slottedBreadcrumbItems[this.slottedBreadcrumbItems.length-1];this.slottedBreadcrumbItems.forEach(e=>{const s=e===t;this.setItemSeparator(e,s),this.setAriaCurrent(e,s)})}}setItemSeparator(t,e){t instanceof as&&(t.separator=!e)}findChildWithHref(t){var e,s;return t.childElementCount>0?t.querySelector("a[href]"):!((e=t.shadowRoot)===null||e===void 0)&&e.childElementCount?(s=t.shadowRoot)===null||s===void 0?void 0:s.querySelector("a[href]"):null}setAriaCurrent(t,e){const s=this.findChildWithHref(t);s===null&&t.hasAttribute("href")&&t instanceof as?e?t.setAttribute("aria-current","page"):t.removeAttribute("aria-current"):s!==null&&(e?s.setAttribute("aria-current","page"):s.removeAttribute("aria-current"))}}c([g],il.prototype,"slottedBreadcrumbItems",void 0);const Fu=(i,t)=>v`
    <button
        class="control"
        part="control"
        ?autofocus="${e=>e.autofocus}"
        ?disabled="${e=>e.disabled}"
        form="${e=>e.formId}"
        formaction="${e=>e.formaction}"
        formenctype="${e=>e.formenctype}"
        formmethod="${e=>e.formmethod}"
        formnovalidate="${e=>e.formnovalidate}"
        formtarget="${e=>e.formtarget}"
        name="${e=>e.name}"
        type="${e=>e.type}"
        value="${e=>e.value}"
        aria-atomic="${e=>e.ariaAtomic}"
        aria-busy="${e=>e.ariaBusy}"
        aria-controls="${e=>e.ariaControls}"
        aria-current="${e=>e.ariaCurrent}"
        aria-describedby="${e=>e.ariaDescribedby}"
        aria-details="${e=>e.ariaDetails}"
        aria-disabled="${e=>e.ariaDisabled}"
        aria-errormessage="${e=>e.ariaErrormessage}"
        aria-expanded="${e=>e.ariaExpanded}"
        aria-flowto="${e=>e.ariaFlowto}"
        aria-haspopup="${e=>e.ariaHaspopup}"
        aria-hidden="${e=>e.ariaHidden}"
        aria-invalid="${e=>e.ariaInvalid}"
        aria-keyshortcuts="${e=>e.ariaKeyshortcuts}"
        aria-label="${e=>e.ariaLabel}"
        aria-labelledby="${e=>e.ariaLabelledby}"
        aria-live="${e=>e.ariaLive}"
        aria-owns="${e=>e.ariaOwns}"
        aria-pressed="${e=>e.ariaPressed}"
        aria-relevant="${e=>e.ariaRelevant}"
        aria-roledescription="${e=>e.ariaRoledescription}"
        ${j("control")}
    >
        ${Pt(i,t)}
        <span class="content" part="content">
            <slot ${Z("defaultSlottedContent")}></slot>
        </span>
        ${At(i,t)}
    </button>
`,sl="form-associated-proxy",ol="ElementInternals",nl=ol in window&&"setFormValue"in window[ol].prototype,rl=new WeakMap;function ve(i){const t=class extends i{constructor(...e){super(...e),this.dirtyValue=!1,this.disabled=!1,this.proxyEventsToBlock=["change","click"],this.proxyInitialized=!1,this.required=!1,this.initialValue=this.initialValue||"",this.elementInternals||(this.formResetCallback=this.formResetCallback.bind(this))}static get formAssociated(){return nl}get validity(){return this.elementInternals?this.elementInternals.validity:this.proxy.validity}get form(){return this.elementInternals?this.elementInternals.form:this.proxy.form}get validationMessage(){return this.elementInternals?this.elementInternals.validationMessage:this.proxy.validationMessage}get willValidate(){return this.elementInternals?this.elementInternals.willValidate:this.proxy.willValidate}get labels(){if(this.elementInternals)return Object.freeze(Array.from(this.elementInternals.labels));if(this.proxy instanceof HTMLElement&&this.proxy.ownerDocument&&this.id){const e=this.proxy.labels,s=Array.from(this.proxy.getRootNode().querySelectorAll(`[for='${this.id}']`)),o=e?s.concat(Array.from(e)):s;return Object.freeze(o)}else return Ye}valueChanged(e,s){this.dirtyValue=!0,this.proxy instanceof HTMLElement&&(this.proxy.value=this.value),this.currentValue=this.value,this.setFormValue(this.value),this.validate()}currentValueChanged(){this.value=this.currentValue}initialValueChanged(e,s){this.dirtyValue||(this.value=this.initialValue,this.dirtyValue=!1)}disabledChanged(e,s){this.proxy instanceof HTMLElement&&(this.proxy.disabled=this.disabled),O.queueUpdate(()=>this.classList.toggle("disabled",this.disabled))}nameChanged(e,s){this.proxy instanceof HTMLElement&&(this.proxy.name=this.name)}requiredChanged(e,s){this.proxy instanceof HTMLElement&&(this.proxy.required=this.required),O.queueUpdate(()=>this.classList.toggle("required",this.required)),this.validate()}get elementInternals(){if(!nl)return null;let e=rl.get(this);return e||(e=this.attachInternals(),rl.set(this,e)),e}connectedCallback(){super.connectedCallback(),this.addEventListener("keypress",this._keypressHandler),this.value||(this.value=this.initialValue,this.dirtyValue=!1),this.elementInternals||(this.attachProxy(),this.form&&this.form.addEventListener("reset",this.formResetCallback))}disconnectedCallback(){this.proxyEventsToBlock.forEach(e=>this.proxy.removeEventListener(e,this.stopPropagation)),!this.elementInternals&&this.form&&this.form.removeEventListener("reset",this.formResetCallback)}checkValidity(){return this.elementInternals?this.elementInternals.checkValidity():this.proxy.checkValidity()}reportValidity(){return this.elementInternals?this.elementInternals.reportValidity():this.proxy.reportValidity()}setValidity(e,s,o){this.elementInternals?this.elementInternals.setValidity(e,s,o):typeof s=="string"&&this.proxy.setCustomValidity(s)}formDisabledCallback(e){this.disabled=e}formResetCallback(){this.value=this.initialValue,this.dirtyValue=!1}attachProxy(){var e;this.proxyInitialized||(this.proxyInitialized=!0,this.proxy.style.display="none",this.proxyEventsToBlock.forEach(s=>this.proxy.addEventListener(s,this.stopPropagation)),this.proxy.disabled=this.disabled,this.proxy.required=this.required,typeof this.name=="string"&&(this.proxy.name=this.name),typeof this.value=="string"&&(this.proxy.value=this.value),this.proxy.setAttribute("slot",sl),this.proxySlot=document.createElement("slot"),this.proxySlot.setAttribute("name",sl)),(e=this.shadowRoot)===null||e===void 0||e.appendChild(this.proxySlot),this.appendChild(this.proxy)}detachProxy(){var e;this.removeChild(this.proxy),(e=this.shadowRoot)===null||e===void 0||e.removeChild(this.proxySlot)}validate(e){this.proxy instanceof HTMLElement&&this.setValidity(this.proxy.validity,this.proxy.validationMessage,e)}setFormValue(e,s){this.elementInternals&&this.elementInternals.setFormValue(e,s||e)}_keypressHandler(e){switch(e.key){case de:if(this.form instanceof HTMLFormElement){const s=this.form.querySelector("[type=submit]");s==null||s.click()}break}}stopPropagation(e){e.stopPropagation()}};return u({mode:"boolean"})(t.prototype,"disabled"),u({mode:"fromView",attribute:"value"})(t.prototype,"initialValue"),u({attribute:"current-value"})(t.prototype,"currentValue"),u(t.prototype,"name"),u({mode:"boolean"})(t.prototype,"required"),g(t.prototype,"value"),t}function yn(i){class t extends ve(i){}class e extends t{constructor(...o){super(o),this.dirtyChecked=!1,this.checkedAttribute=!1,this.checked=!1,this.dirtyChecked=!1}checkedAttributeChanged(){this.defaultChecked=this.checkedAttribute}defaultCheckedChanged(){this.dirtyChecked||(this.checked=this.defaultChecked,this.dirtyChecked=!1)}checkedChanged(o,n){this.dirtyChecked||(this.dirtyChecked=!0),this.currentChecked=this.checked,this.updateForm(),this.proxy instanceof HTMLInputElement&&(this.proxy.checked=this.checked),o!==void 0&&this.$emit("change"),this.validate()}currentCheckedChanged(o,n){this.checked=this.currentChecked}updateForm(){const o=this.checked?this.value:null;this.setFormValue(o,o)}connectedCallback(){super.connectedCallback(),this.updateForm()}formResetCallback(){super.formResetCallback(),this.checked=!!this.checkedAttribute,this.dirtyChecked=!1}}return u({attribute:"checked",mode:"boolean"})(e.prototype,"checkedAttribute"),u({attribute:"current-checked",converter:zs})(e.prototype,"currentChecked"),g(e.prototype,"defaultChecked"),g(e.prototype,"checked"),e}class Ou extends E{}class Ru extends ve(Ou){constructor(){super(...arguments),this.proxy=document.createElement("input")}}class ee extends Ru{constructor(){super(...arguments),this.handleClick=t=>{var e;this.disabled&&((e=this.defaultSlottedContent)===null||e===void 0?void 0:e.length)<=1&&t.stopPropagation()},this.handleSubmission=()=>{if(!this.form)return;const t=this.proxy.isConnected;t||this.attachProxy(),typeof this.form.requestSubmit=="function"?this.form.requestSubmit(this.proxy):this.proxy.click(),t||this.detachProxy()},this.handleFormReset=()=>{var t;(t=this.form)===null||t===void 0||t.reset()},this.handleUnsupportedDelegatesFocus=()=>{var t;window.ShadowRoot&&!window.ShadowRoot.prototype.hasOwnProperty("delegatesFocus")&&(!((t=this.$fastController.definition.shadowOptions)===null||t===void 0)&&t.delegatesFocus)&&(this.focus=()=>{this.control.focus()})}}formactionChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.formAction=this.formaction)}formenctypeChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.formEnctype=this.formenctype)}formmethodChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.formMethod=this.formmethod)}formnovalidateChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.formNoValidate=this.formnovalidate)}formtargetChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.formTarget=this.formtarget)}typeChanged(t,e){this.proxy instanceof HTMLInputElement&&(this.proxy.type=this.type),e==="submit"&&this.addEventListener("click",this.handleSubmission),t==="submit"&&this.removeEventListener("click",this.handleSubmission),e==="reset"&&this.addEventListener("click",this.handleFormReset),t==="reset"&&this.removeEventListener("click",this.handleFormReset)}validate(){super.validate(this.control)}connectedCallback(){var t;super.connectedCallback(),this.proxy.setAttribute("type",this.type),this.handleUnsupportedDelegatesFocus();const e=Array.from((t=this.control)===null||t===void 0?void 0:t.children);e&&e.forEach(s=>{s.addEventListener("click",this.handleClick)})}disconnectedCallback(){var t;super.disconnectedCallback();const e=Array.from((t=this.control)===null||t===void 0?void 0:t.children);e&&e.forEach(s=>{s.removeEventListener("click",this.handleClick)})}}c([u({mode:"boolean"})],ee.prototype,"autofocus",void 0),c([u({attribute:"form"})],ee.prototype,"formId",void 0),c([u],ee.prototype,"formaction",void 0),c([u],ee.prototype,"formenctype",void 0),c([u],ee.prototype,"formmethod",void 0),c([u({mode:"boolean"})],ee.prototype,"formnovalidate",void 0),c([u],ee.prototype,"formtarget",void 0),c([u],ee.prototype,"type",void 0),c([g],ee.prototype,"defaultSlottedContent",void 0);class Ys{}c([u({attribute:"aria-expanded"})],Ys.prototype,"ariaExpanded",void 0),c([u({attribute:"aria-pressed"})],Ys.prototype,"ariaPressed",void 0),tt(Ys,K),tt(ee,Bt,Ys);class Du{constructor(t){if(this.dayFormat="numeric",this.weekdayFormat="long",this.monthFormat="long",this.yearFormat="numeric",this.date=new Date,t)for(const e in t){const s=t[e];e==="date"?this.date=this.getDateObject(s):this[e]=s}}getDateObject(t){if(typeof t=="string"){const e=t.split(/[/-]/);return e.length<3?new Date:new Date(parseInt(e[2],10),parseInt(e[0],10)-1,parseInt(e[1],10))}else if("day"in t&&"month"in t&&"year"in t){const{day:e,month:s,year:o}=t;return new Date(o,s-1,e)}return t}getDate(t=this.date,e={weekday:this.weekdayFormat,month:this.monthFormat,day:this.dayFormat,year:this.yearFormat},s=this.locale){const o=this.getDateObject(t);if(!o.getTime())return"";const n=Object.assign({timeZone:Intl.DateTimeFormat().resolvedOptions().timeZone},e);return new Intl.DateTimeFormat(s,n).format(o)}getDay(t=this.date.getDate(),e=this.dayFormat,s=this.locale){return this.getDate({month:1,day:t,year:2020},{day:e},s)}getMonth(t=this.date.getMonth()+1,e=this.monthFormat,s=this.locale){return this.getDate({month:t,day:2,year:2020},{month:e},s)}getYear(t=this.date.getFullYear(),e=this.yearFormat,s=this.locale){return this.getDate({month:2,day:2,year:t},{year:e},s)}getWeekday(t=0,e=this.weekdayFormat,s=this.locale){const o=`1-${t+1}-2017`;return this.getDate(o,{weekday:e},s)}getWeekdays(t=this.weekdayFormat,e=this.locale){return Array(7).fill(null).map((s,o)=>this.getWeekday(o,t,e))}}class ie extends E{constructor(){super(...arguments),this.dateFormatter=new Du,this.readonly=!1,this.locale="en-US",this.month=new Date().getMonth()+1,this.year=new Date().getFullYear(),this.dayFormat="numeric",this.weekdayFormat="short",this.monthFormat="long",this.yearFormat="numeric",this.minWeeks=0,this.disabledDates="",this.selectedDates="",this.oneDayInMs=864e5}localeChanged(){this.dateFormatter.locale=this.locale}dayFormatChanged(){this.dateFormatter.dayFormat=this.dayFormat}weekdayFormatChanged(){this.dateFormatter.weekdayFormat=this.weekdayFormat}monthFormatChanged(){this.dateFormatter.monthFormat=this.monthFormat}yearFormatChanged(){this.dateFormatter.yearFormat=this.yearFormat}getMonthInfo(t=this.month,e=this.year){const s=l=>new Date(l.getFullYear(),l.getMonth(),1).getDay(),o=l=>{const h=new Date(l.getFullYear(),l.getMonth()+1,1);return new Date(h.getTime()-this.oneDayInMs).getDate()},n=new Date(e,t-1),r=new Date(e,t),a=new Date(e,t-2);return{length:o(n),month:t,start:s(n),year:e,previous:{length:o(a),month:a.getMonth()+1,start:s(a),year:a.getFullYear()},next:{length:o(r),month:r.getMonth()+1,start:s(r),year:r.getFullYear()}}}getDays(t=this.getMonthInfo(),e=this.minWeeks){e=e>10?10:e;const{start:s,length:o,previous:n,next:r}=t,a=[];let l=1-s;for(;l<o+1||a.length<e||a[a.length-1].length%7!==0;){const{month:h,year:p}=l<1?n:l>o?r:t,f=l<1?n.length+l:l>o?l-o:l,m=`${h}-${f}-${p}`,w=this.dateInString(m,this.disabledDates),k=this.dateInString(m,this.selectedDates),F={day:f,month:h,year:p,disabled:w,selected:k},V=a[a.length-1];a.length===0||V.length%7===0?a.push([F]):V.push(F),l++}return a}dateInString(t,e){const s=e.split(",").map(o=>o.trim());return t=typeof t=="string"?t:`${t.getMonth()+1}-${t.getDate()}-${t.getFullYear()}`,s.some(o=>o===t)}getDayClassNames(t,e){const{day:s,month:o,year:n,disabled:r,selected:a}=t,l=e===`${o}-${s}-${n}`,h=this.month!==o;return["day",l&&"today",h&&"inactive",r&&"disabled",a&&"selected"].filter(Boolean).join(" ")}getWeekdayText(){const t=this.dateFormatter.getWeekdays().map(e=>({text:e}));if(this.weekdayFormat!=="long"){const e=this.dateFormatter.getWeekdays("long");t.forEach((s,o)=>{s.abbr=e[o]})}return t}handleDateSelect(t,e){t.preventDefault,this.$emit("dateselected",e)}handleKeydown(t,e){return t.key===de&&this.handleDateSelect(t,e),!0}}c([u({mode:"boolean"})],ie.prototype,"readonly",void 0),c([u],ie.prototype,"locale",void 0),c([u({converter:C})],ie.prototype,"month",void 0),c([u({converter:C})],ie.prototype,"year",void 0),c([u({attribute:"day-format",mode:"fromView"})],ie.prototype,"dayFormat",void 0),c([u({attribute:"weekday-format",mode:"fromView"})],ie.prototype,"weekdayFormat",void 0),c([u({attribute:"month-format",mode:"fromView"})],ie.prototype,"monthFormat",void 0),c([u({attribute:"year-format",mode:"fromView"})],ie.prototype,"yearFormat",void 0),c([u({attribute:"min-weeks",converter:C})],ie.prototype,"minWeeks",void 0),c([u({attribute:"disabled-dates"})],ie.prototype,"disabledDates",void 0),c([u({attribute:"selected-dates"})],ie.prototype,"selectedDates",void 0);const Qs={none:"none",default:"default",sticky:"sticky"},He={default:"default",columnHeader:"columnheader",rowHeader:"rowheader"},ls={default:"default",header:"header",stickyHeader:"sticky-header"};class wt extends E{constructor(){super(...arguments),this.rowType=ls.default,this.rowData=null,this.columnDefinitions=null,this.isActiveRow=!1,this.cellsRepeatBehavior=null,this.cellsPlaceholder=null,this.focusColumnIndex=0,this.refocusOnLoad=!1,this.updateRowStyle=()=>{this.style.gridTemplateColumns=this.gridTemplateColumns}}gridTemplateColumnsChanged(){this.$fastController.isConnected&&this.updateRowStyle()}rowTypeChanged(){this.$fastController.isConnected&&this.updateItemTemplate()}rowDataChanged(){if(this.rowData!==null&&this.isActiveRow){this.refocusOnLoad=!0;return}}cellItemTemplateChanged(){this.updateItemTemplate()}headerCellItemTemplateChanged(){this.updateItemTemplate()}connectedCallback(){super.connectedCallback(),this.cellsRepeatBehavior===null&&(this.cellsPlaceholder=document.createComment(""),this.appendChild(this.cellsPlaceholder),this.updateItemTemplate(),this.cellsRepeatBehavior=new ss(t=>t.columnDefinitions,t=>t.activeCellItemTemplate,{positioning:!0}).createBehavior(this.cellsPlaceholder),this.$fastController.addBehaviors([this.cellsRepeatBehavior])),this.addEventListener("cell-focused",this.handleCellFocus),this.addEventListener(Ti,this.handleFocusout),this.addEventListener(Ii,this.handleKeydown),this.updateRowStyle(),this.refocusOnLoad&&(this.refocusOnLoad=!1,this.cellElements.length>this.focusColumnIndex&&this.cellElements[this.focusColumnIndex].focus())}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("cell-focused",this.handleCellFocus),this.removeEventListener(Ti,this.handleFocusout),this.removeEventListener(Ii,this.handleKeydown)}handleFocusout(t){this.contains(t.target)||(this.isActiveRow=!1,this.focusColumnIndex=0)}handleCellFocus(t){this.isActiveRow=!0,this.focusColumnIndex=this.cellElements.indexOf(t.target),this.$emit("row-focused",this)}handleKeydown(t){if(t.defaultPrevented)return;let e=0;switch(t.key){case Se:e=Math.max(0,this.focusColumnIndex-1),this.cellElements[e].focus(),t.preventDefault();break;case Fe:e=Math.min(this.cellElements.length-1,this.focusColumnIndex+1),this.cellElements[e].focus(),t.preventDefault();break;case me:t.ctrlKey||(this.cellElements[0].focus(),t.preventDefault());break;case be:t.ctrlKey||(this.cellElements[this.cellElements.length-1].focus(),t.preventDefault());break}}updateItemTemplate(){this.activeCellItemTemplate=this.rowType===ls.default&&this.cellItemTemplate!==void 0?this.cellItemTemplate:this.rowType===ls.default&&this.cellItemTemplate===void 0?this.defaultCellItemTemplate:this.headerCellItemTemplate!==void 0?this.headerCellItemTemplate:this.defaultHeaderCellItemTemplate}}c([u({attribute:"grid-template-columns"})],wt.prototype,"gridTemplateColumns",void 0),c([u({attribute:"row-type"})],wt.prototype,"rowType",void 0),c([g],wt.prototype,"rowData",void 0),c([g],wt.prototype,"columnDefinitions",void 0),c([g],wt.prototype,"cellItemTemplate",void 0),c([g],wt.prototype,"headerCellItemTemplate",void 0),c([g],wt.prototype,"rowIndex",void 0),c([g],wt.prototype,"isActiveRow",void 0),c([g],wt.prototype,"activeCellItemTemplate",void 0),c([g],wt.prototype,"defaultCellItemTemplate",void 0),c([g],wt.prototype,"defaultHeaderCellItemTemplate",void 0),c([g],wt.prototype,"cellElements",void 0);function Eu(i){const t=i.tagFor(wt);return v`
    <${t}
        :rowData="${e=>e}"
        :cellItemTemplate="${(e,s)=>s.parent.cellItemTemplate}"
        :headerCellItemTemplate="${(e,s)=>s.parent.headerCellItemTemplate}"
    ></${t}>
`}const Lu=(i,t)=>{const e=Eu(i),s=i.tagFor(wt);return v`
        <template
            role="grid"
            tabindex="0"
            :rowElementTag="${()=>s}"
            :defaultRowItemTemplate="${e}"
            ${Ns({property:"rowElements",filter:Ie("[role=row]")})}
        >
            <slot></slot>
        </template>
    `};class bt extends E{constructor(){super(),this.noTabbing=!1,this.generateHeader=Qs.default,this.rowsData=[],this.columnDefinitions=null,this.focusRowIndex=0,this.focusColumnIndex=0,this.rowsPlaceholder=null,this.generatedHeader=null,this.isUpdatingFocus=!1,this.pendingFocusUpdate=!1,this.rowindexUpdateQueued=!1,this.columnDefinitionsStale=!0,this.generatedGridTemplateColumns="",this.focusOnCell=(t,e,s)=>{if(this.rowElements.length===0){this.focusRowIndex=0,this.focusColumnIndex=0;return}const o=Math.max(0,Math.min(this.rowElements.length-1,t)),r=this.rowElements[o].querySelectorAll('[role="cell"], [role="gridcell"], [role="columnheader"], [role="rowheader"]'),a=Math.max(0,Math.min(r.length-1,e)),l=r[a];s&&this.scrollHeight!==this.clientHeight&&(o<this.focusRowIndex&&this.scrollTop>0||o>this.focusRowIndex&&this.scrollTop<this.scrollHeight-this.clientHeight)&&l.scrollIntoView({block:"center",inline:"center"}),l.focus()},this.onChildListChange=(t,e)=>{t&&t.length&&(t.forEach(s=>{s.addedNodes.forEach(o=>{o.nodeType===1&&o.getAttribute("role")==="row"&&(o.columnDefinitions=this.columnDefinitions)})}),this.queueRowIndexUpdate())},this.queueRowIndexUpdate=()=>{this.rowindexUpdateQueued||(this.rowindexUpdateQueued=!0,O.queueUpdate(this.updateRowIndexes))},this.updateRowIndexes=()=>{let t=this.gridTemplateColumns;if(t===void 0){if(this.generatedGridTemplateColumns===""&&this.rowElements.length>0){const e=this.rowElements[0];this.generatedGridTemplateColumns=new Array(e.cellElements.length).fill("1fr").join(" ")}t=this.generatedGridTemplateColumns}this.rowElements.forEach((e,s)=>{const o=e;o.rowIndex=s,o.gridTemplateColumns=t,this.columnDefinitionsStale&&(o.columnDefinitions=this.columnDefinitions)}),this.rowindexUpdateQueued=!1,this.columnDefinitionsStale=!1}}static generateTemplateColumns(t){let e="";return t.forEach(s=>{e=`${e}${e===""?"":" "}1fr`}),e}noTabbingChanged(){this.$fastController.isConnected&&(this.noTabbing?this.setAttribute("tabIndex","-1"):this.setAttribute("tabIndex",this.contains(document.activeElement)||this===document.activeElement?"-1":"0"))}generateHeaderChanged(){this.$fastController.isConnected&&this.toggleGeneratedHeader()}gridTemplateColumnsChanged(){this.$fastController.isConnected&&this.updateRowIndexes()}rowsDataChanged(){this.columnDefinitions===null&&this.rowsData.length>0&&(this.columnDefinitions=bt.generateColumns(this.rowsData[0])),this.$fastController.isConnected&&this.toggleGeneratedHeader()}columnDefinitionsChanged(){if(this.columnDefinitions===null){this.generatedGridTemplateColumns="";return}this.generatedGridTemplateColumns=bt.generateTemplateColumns(this.columnDefinitions),this.$fastController.isConnected&&(this.columnDefinitionsStale=!0,this.queueRowIndexUpdate())}headerCellItemTemplateChanged(){this.$fastController.isConnected&&this.generatedHeader!==null&&(this.generatedHeader.headerCellItemTemplate=this.headerCellItemTemplate)}focusRowIndexChanged(){this.$fastController.isConnected&&this.queueFocusUpdate()}focusColumnIndexChanged(){this.$fastController.isConnected&&this.queueFocusUpdate()}connectedCallback(){super.connectedCallback(),this.rowItemTemplate===void 0&&(this.rowItemTemplate=this.defaultRowItemTemplate),this.rowsPlaceholder=document.createComment(""),this.appendChild(this.rowsPlaceholder),this.toggleGeneratedHeader(),this.rowsRepeatBehavior=new ss(t=>t.rowsData,t=>t.rowItemTemplate,{positioning:!0}).createBehavior(this.rowsPlaceholder),this.$fastController.addBehaviors([this.rowsRepeatBehavior]),this.addEventListener("row-focused",this.handleRowFocus),this.addEventListener(Ua,this.handleFocus),this.addEventListener(Ii,this.handleKeydown),this.addEventListener(Ti,this.handleFocusOut),this.observer=new MutationObserver(this.onChildListChange),this.observer.observe(this,{childList:!0}),this.noTabbing&&this.setAttribute("tabindex","-1"),O.queueUpdate(this.queueRowIndexUpdate)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("row-focused",this.handleRowFocus),this.removeEventListener(Ua,this.handleFocus),this.removeEventListener(Ii,this.handleKeydown),this.removeEventListener(Ti,this.handleFocusOut),this.observer.disconnect(),this.rowsPlaceholder=null,this.generatedHeader=null}handleRowFocus(t){this.isUpdatingFocus=!0;const e=t.target;this.focusRowIndex=this.rowElements.indexOf(e),this.focusColumnIndex=e.focusColumnIndex,this.setAttribute("tabIndex","-1"),this.isUpdatingFocus=!1}handleFocus(t){this.focusOnCell(this.focusRowIndex,this.focusColumnIndex,!0)}handleFocusOut(t){(t.relatedTarget===null||!this.contains(t.relatedTarget))&&this.setAttribute("tabIndex",this.noTabbing?"-1":"0")}handleKeydown(t){if(t.defaultPrevented)return;let e;const s=this.rowElements.length-1,o=this.offsetHeight+this.scrollTop,n=this.rowElements[s];switch(t.key){case Xt:t.preventDefault(),this.focusOnCell(this.focusRowIndex-1,this.focusColumnIndex,!0);break;case Wt:t.preventDefault(),this.focusOnCell(this.focusRowIndex+1,this.focusColumnIndex,!0);break;case mu:if(t.preventDefault(),this.rowElements.length===0){this.focusOnCell(0,0,!1);break}if(this.focusRowIndex===0){this.focusOnCell(0,this.focusColumnIndex,!1);return}for(e=this.focusRowIndex-1,e;e>=0;e--){const r=this.rowElements[e];if(r.offsetTop<this.scrollTop){this.scrollTop=r.offsetTop+r.clientHeight-this.clientHeight;break}}this.focusOnCell(e,this.focusColumnIndex,!1);break;case gu:if(t.preventDefault(),this.rowElements.length===0){this.focusOnCell(0,0,!1);break}if(this.focusRowIndex>=s||n.offsetTop+n.offsetHeight<=o){this.focusOnCell(s,this.focusColumnIndex,!1);return}for(e=this.focusRowIndex+1,e;e<=s;e++){const r=this.rowElements[e];if(r.offsetTop+r.offsetHeight>o){let a=0;this.generateHeader===Qs.sticky&&this.generatedHeader!==null&&(a=this.generatedHeader.clientHeight),this.scrollTop=r.offsetTop-a;break}}this.focusOnCell(e,this.focusColumnIndex,!1);break;case me:t.ctrlKey&&(t.preventDefault(),this.focusOnCell(0,0,!0));break;case be:t.ctrlKey&&this.columnDefinitions!==null&&(t.preventDefault(),this.focusOnCell(this.rowElements.length-1,this.columnDefinitions.length-1,!0));break}}queueFocusUpdate(){this.isUpdatingFocus&&(this.contains(document.activeElement)||this===document.activeElement)||this.pendingFocusUpdate===!1&&(this.pendingFocusUpdate=!0,O.queueUpdate(()=>this.updateFocus()))}updateFocus(){this.pendingFocusUpdate=!1,this.focusOnCell(this.focusRowIndex,this.focusColumnIndex,!0)}toggleGeneratedHeader(){if(this.generatedHeader!==null&&(this.removeChild(this.generatedHeader),this.generatedHeader=null),this.generateHeader!==Qs.none&&this.rowsData.length>0){const t=document.createElement(this.rowElementTag);this.generatedHeader=t,this.generatedHeader.columnDefinitions=this.columnDefinitions,this.generatedHeader.gridTemplateColumns=this.gridTemplateColumns,this.generatedHeader.rowType=this.generateHeader===Qs.sticky?ls.stickyHeader:ls.header,(this.firstChild!==null||this.rowsPlaceholder!==null)&&this.insertBefore(t,this.firstChild!==null?this.firstChild:this.rowsPlaceholder);return}}}bt.generateColumns=i=>Object.getOwnPropertyNames(i).map((t,e)=>({columnDataKey:t,gridColumn:`${e}`})),c([u({attribute:"no-tabbing",mode:"boolean"})],bt.prototype,"noTabbing",void 0),c([u({attribute:"generate-header"})],bt.prototype,"generateHeader",void 0),c([u({attribute:"grid-template-columns"})],bt.prototype,"gridTemplateColumns",void 0),c([g],bt.prototype,"rowsData",void 0),c([g],bt.prototype,"columnDefinitions",void 0),c([g],bt.prototype,"rowItemTemplate",void 0),c([g],bt.prototype,"cellItemTemplate",void 0),c([g],bt.prototype,"headerCellItemTemplate",void 0),c([g],bt.prototype,"focusRowIndex",void 0),c([g],bt.prototype,"focusColumnIndex",void 0),c([g],bt.prototype,"defaultRowItemTemplate",void 0),c([g],bt.prototype,"rowElementTag",void 0),c([g],bt.prototype,"rowElements",void 0);const Au=v`
    <template>
        ${i=>i.rowData===null||i.columnDefinition===null||i.columnDefinition.columnDataKey===null?null:i.rowData[i.columnDefinition.columnDataKey]}
    </template>
`,Pu=v`
    <template>
        ${i=>i.columnDefinition===null?null:i.columnDefinition.title===void 0?i.columnDefinition.columnDataKey:i.columnDefinition.title}
    </template>
`;class Oe extends E{constructor(){super(...arguments),this.cellType=He.default,this.rowData=null,this.columnDefinition=null,this.isActiveCell=!1,this.customCellView=null,this.updateCellStyle=()=>{this.style.gridColumn=this.gridColumn}}cellTypeChanged(){this.$fastController.isConnected&&this.updateCellView()}gridColumnChanged(){this.$fastController.isConnected&&this.updateCellStyle()}columnDefinitionChanged(t,e){this.$fastController.isConnected&&this.updateCellView()}connectedCallback(){var t;super.connectedCallback(),this.addEventListener(qa,this.handleFocusin),this.addEventListener(Ti,this.handleFocusout),this.addEventListener(Ii,this.handleKeydown),this.style.gridColumn=`${((t=this.columnDefinition)===null||t===void 0?void 0:t.gridColumn)===void 0?0:this.columnDefinition.gridColumn}`,this.updateCellView(),this.updateCellStyle()}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener(qa,this.handleFocusin),this.removeEventListener(Ti,this.handleFocusout),this.removeEventListener(Ii,this.handleKeydown),this.disconnectCellView()}handleFocusin(t){if(!this.isActiveCell){switch(this.isActiveCell=!0,this.cellType){case He.columnHeader:if(this.columnDefinition!==null&&this.columnDefinition.headerCellInternalFocusQueue!==!0&&typeof this.columnDefinition.headerCellFocusTargetCallback=="function"){const e=this.columnDefinition.headerCellFocusTargetCallback(this);e!==null&&e.focus()}break;default:if(this.columnDefinition!==null&&this.columnDefinition.cellInternalFocusQueue!==!0&&typeof this.columnDefinition.cellFocusTargetCallback=="function"){const e=this.columnDefinition.cellFocusTargetCallback(this);e!==null&&e.focus()}break}this.$emit("cell-focused",this)}}handleFocusout(t){this!==document.activeElement&&!this.contains(document.activeElement)&&(this.isActiveCell=!1)}handleKeydown(t){if(!(t.defaultPrevented||this.columnDefinition===null||this.cellType===He.default&&this.columnDefinition.cellInternalFocusQueue!==!0||this.cellType===He.columnHeader&&this.columnDefinition.headerCellInternalFocusQueue!==!0))switch(t.key){case de:case fu:if(this.contains(document.activeElement)&&document.activeElement!==this)return;switch(this.cellType){case He.columnHeader:if(this.columnDefinition.headerCellFocusTargetCallback!==void 0){const e=this.columnDefinition.headerCellFocusTargetCallback(this);e!==null&&e.focus(),t.preventDefault()}break;default:if(this.columnDefinition.cellFocusTargetCallback!==void 0){const e=this.columnDefinition.cellFocusTargetCallback(this);e!==null&&e.focus(),t.preventDefault()}break}break;case Je:this.contains(document.activeElement)&&document.activeElement!==this&&(this.focus(),t.preventDefault());break}}updateCellView(){if(this.disconnectCellView(),this.columnDefinition!==null)switch(this.cellType){case He.columnHeader:this.columnDefinition.headerCellTemplate!==void 0?this.customCellView=this.columnDefinition.headerCellTemplate.render(this,this):this.customCellView=Pu.render(this,this);break;case void 0:case He.rowHeader:case He.default:this.columnDefinition.cellTemplate!==void 0?this.customCellView=this.columnDefinition.cellTemplate.render(this,this):this.customCellView=Au.render(this,this);break}}disconnectCellView(){this.customCellView!==null&&(this.customCellView.dispose(),this.customCellView=null)}}c([u({attribute:"cell-type"})],Oe.prototype,"cellType",void 0),c([u({attribute:"grid-column"})],Oe.prototype,"gridColumn",void 0),c([g],Oe.prototype,"rowData",void 0),c([g],Oe.prototype,"columnDefinition",void 0);function Vu(i){const t=i.tagFor(Oe);return v`
    <${t}
        cell-type="${e=>e.isRowHeader?"rowheader":void 0}"
        grid-column="${(e,s)=>s.index+1}"
        :rowData="${(e,s)=>s.parent.rowData}"
        :columnDefinition="${e=>e}"
    ></${t}>
`}function Mu(i){const t=i.tagFor(Oe);return v`
    <${t}
        cell-type="columnheader"
        grid-column="${(e,s)=>s.index+1}"
        :columnDefinition="${e=>e}"
    ></${t}>
`}const zu=(i,t)=>{const e=Vu(i),s=Mu(i);return v`
        <template
            role="row"
            class="${o=>o.rowType!=="default"?o.rowType:""}"
            :defaultCellItemTemplate="${e}"
            :defaultHeaderCellItemTemplate="${s}"
            ${Ns({property:"cellElements",filter:Ie('[role="cell"],[role="gridcell"],[role="columnheader"],[role="rowheader"]')})}
        >
            <slot ${Z("slottedCellElements")}></slot>
        </template>
    `},Hu=(i,t)=>v`
        <template
            tabindex="-1"
            role="${e=>!e.cellType||e.cellType==="default"?"gridcell":e.cellType}"
            class="
            ${e=>e.cellType==="columnheader"?"column-header":e.cellType==="rowheader"?"row-header":""}
            "
        >
            <slot></slot>
        </template>
    `,Bu=v`
    <div
        class="title"
        part="title"
        aria-label="${i=>i.dateFormatter.getDate(`${i.month}-2-${i.year}`,{month:"long",year:"numeric"})}"
    >
        <span part="month">
            ${i=>i.dateFormatter.getMonth(i.month)}
        </span>
        <span part="year">${i=>i.dateFormatter.getYear(i.year)}</span>
    </div>
`,Nu=i=>{const t=i.tagFor(Oe);return v`
        <${t}
            class="week-day"
            part="week-day"
            tabindex="-1"
            grid-column="${(e,s)=>s.index+1}"
            abbr="${e=>e.abbr}"
        >
            ${e=>e.text}
        </${t}>
    `},ju=(i,t)=>{const e=i.tagFor(Oe);return v`
        <${e}
            class="${(s,o)=>o.parentContext.parent.getDayClassNames(s,t)}"
            part="day"
            tabindex="-1"
            role="gridcell"
            grid-column="${(s,o)=>o.index+1}"
            @click="${(s,o)=>o.parentContext.parent.handleDateSelect(o.event,s)}"
            @keydown="${(s,o)=>o.parentContext.parent.handleKeydown(o.event,s)}"
            aria-label="${(s,o)=>o.parentContext.parent.dateFormatter.getDate(`${s.month}-${s.day}-${s.year}`,{month:"long",day:"numeric"})}"
        >
            <div
                class="date"
                part="${s=>t===`${s.month}-${s.day}-${s.year}`?"today":"date"}"
            >
                ${(s,o)=>o.parentContext.parent.dateFormatter.getDay(s.day)}
            </div>
            <slot name="${s=>s.month}-${s=>s.day}-${s=>s.year}"></slot>
        </${e}>
    `},_u=(i,t)=>{const e=i.tagFor(wt);return v`
        <${e}
            class="week"
            part="week"
            role="row"
            role-type="default"
            grid-template-columns="1fr 1fr 1fr 1fr 1fr 1fr 1fr"
        >
        ${ki(s=>s,ju(i,t),{positioning:!0})}
        </${e}>
    `},Uu=(i,t)=>{const e=i.tagFor(bt),s=i.tagFor(wt);return v`
    <${e} class="days interact" part="days" generate-header="none">
        <${s}
            class="week-days"
            part="week-days"
            role="row"
            row-type="header"
            grid-template-columns="1fr 1fr 1fr 1fr 1fr 1fr 1fr"
        >
            ${ki(o=>o.getWeekdayText(),Nu(i),{positioning:!0})}
        </${s}>
        ${ki(o=>o.getDays(),_u(i,t))}
    </${e}>
`},qu=i=>v`
        <div class="days" part="days">
            <div class="week-days" part="week-days">
                ${ki(t=>t.getWeekdayText(),v`
                        <div class="week-day" part="week-day" abbr="${t=>t.abbr}">
                            ${t=>t.text}
                        </div>
                    `)}
            </div>
            ${ki(t=>t.getDays(),v`
                    <div class="week">
                        ${ki(t=>t,v`
                                <div
                                    class="${(t,e)=>e.parentContext.parent.getDayClassNames(t,i)}"
                                    part="day"
                                    aria-label="${(t,e)=>e.parentContext.parent.dateFormatter.getDate(`${t.month}-${t.day}-${t.year}`,{month:"long",day:"numeric"})}"
                                >
                                    <div
                                        class="date"
                                        part="${t=>i===`${t.month}-${t.day}-${t.year}`?"today":"date"}"
                                    >
                                        ${(t,e)=>e.parentContext.parent.dateFormatter.getDay(t.day)}
                                    </div>
                                    <slot
                                        name="${t=>t.month}-${t=>t.day}-${t=>t.year}"
                                    ></slot>
                                </div>
                            `)}
                    </div>
                `)}
        </div>
    `,Gu=(i,t)=>{var e;const s=new Date,o=`${s.getMonth()+1}-${s.getDate()}-${s.getFullYear()}`;return v`
        <template>
            ${Xd}
            ${t.title instanceof Function?t.title(i,t):(e=t.title)!==null&&e!==void 0?e:""}
            <slot></slot>
            ${Q(n=>n.readonly,qu(o),Uu(i,o))}
            ${Wd}
        </template>
    `},Wu=(i,t)=>v`
    <slot></slot>
`;class al extends E{}const Xu=(i,t)=>v`
    <template
        role="checkbox"
        aria-checked="${e=>e.checked}"
        aria-required="${e=>e.required}"
        aria-disabled="${e=>e.disabled}"
        aria-readonly="${e=>e.readOnly}"
        tabindex="${e=>e.disabled?null:0}"
        @keypress="${(e,s)=>e.keypressHandler(s.event)}"
        @click="${(e,s)=>e.clickHandler(s.event)}"
        class="${e=>e.readOnly?"readonly":""} ${e=>e.checked?"checked":""} ${e=>e.indeterminate?"indeterminate":""}"
    >
        <div part="control" class="control">
            <slot name="checked-indicator">
                ${t.checkedIndicator||""}
            </slot>
            <slot name="indeterminate-indicator">
                ${t.indeterminateIndicator||""}
            </slot>
        </div>
        <label
            part="label"
            class="${e=>e.defaultSlottedNodes&&e.defaultSlottedNodes.length?"label":"label label__hidden"}"
        >
            <slot ${Z("defaultSlottedNodes")}></slot>
        </label>
    </template>
`;class Yu extends E{}class Qu extends yn(Yu){constructor(){super(...arguments),this.proxy=document.createElement("input")}}class Zs extends Qu{constructor(){super(),this.initialValue="on",this.indeterminate=!1,this.keypressHandler=t=>{if(!this.readOnly)switch(t.key){case Ke:this.indeterminate&&(this.indeterminate=!1),this.checked=!this.checked;break}},this.clickHandler=t=>{!this.disabled&&!this.readOnly&&(this.indeterminate&&(this.indeterminate=!1),this.checked=!this.checked)},this.proxy.setAttribute("type","checkbox")}readOnlyChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.readOnly=this.readOnly)}}c([u({attribute:"readonly",mode:"boolean"})],Zs.prototype,"readOnly",void 0),c([g],Zs.prototype,"defaultSlottedNodes",void 0),c([g],Zs.prototype,"indeterminate",void 0);function ll(i){return Ci(i)&&(i.getAttribute("role")==="option"||i instanceof HTMLOptionElement)}class ue extends E{constructor(t,e,s,o){super(),this.defaultSelected=!1,this.dirtySelected=!1,this.selected=this.defaultSelected,this.dirtyValue=!1,t&&(this.textContent=t),e&&(this.initialValue=e),s&&(this.defaultSelected=s),o&&(this.selected=o),this.proxy=new Option(`${this.textContent}`,this.initialValue,this.defaultSelected,this.selected),this.proxy.disabled=this.disabled}checkedChanged(t,e){if(typeof e=="boolean"){this.ariaChecked=e?"true":"false";return}this.ariaChecked=null}contentChanged(t,e){this.proxy instanceof HTMLOptionElement&&(this.proxy.textContent=this.textContent),this.$emit("contentchange",null,{bubbles:!0})}defaultSelectedChanged(){this.dirtySelected||(this.selected=this.defaultSelected,this.proxy instanceof HTMLOptionElement&&(this.proxy.selected=this.defaultSelected))}disabledChanged(t,e){this.ariaDisabled=this.disabled?"true":"false",this.proxy instanceof HTMLOptionElement&&(this.proxy.disabled=this.disabled)}selectedAttributeChanged(){this.defaultSelected=this.selectedAttribute,this.proxy instanceof HTMLOptionElement&&(this.proxy.defaultSelected=this.defaultSelected)}selectedChanged(){this.ariaSelected=this.selected?"true":"false",this.dirtySelected||(this.dirtySelected=!0),this.proxy instanceof HTMLOptionElement&&(this.proxy.selected=this.selected)}initialValueChanged(t,e){this.dirtyValue||(this.value=this.initialValue,this.dirtyValue=!1)}get label(){var t;return(t=this.value)!==null&&t!==void 0?t:this.text}get text(){var t,e;return(e=(t=this.textContent)===null||t===void 0?void 0:t.replace(/\s+/g," ").trim())!==null&&e!==void 0?e:""}set value(t){const e=`${t!=null?t:""}`;this._value=e,this.dirtyValue=!0,this.proxy instanceof HTMLOptionElement&&(this.proxy.value=e),L.notify(this,"value")}get value(){var t;return L.track(this,"value"),(t=this._value)!==null&&t!==void 0?t:this.text}get form(){return this.proxy?this.proxy.form:null}}c([g],ue.prototype,"checked",void 0),c([g],ue.prototype,"content",void 0),c([g],ue.prototype,"defaultSelected",void 0),c([u({mode:"boolean"})],ue.prototype,"disabled",void 0),c([u({attribute:"selected",mode:"boolean"})],ue.prototype,"selectedAttribute",void 0),c([g],ue.prototype,"selected",void 0),c([u({attribute:"value",mode:"fromView"})],ue.prototype,"initialValue",void 0);class Oi{}c([g],Oi.prototype,"ariaChecked",void 0),c([g],Oi.prototype,"ariaPosInSet",void 0),c([g],Oi.prototype,"ariaSelected",void 0),c([g],Oi.prototype,"ariaSetSize",void 0),tt(Oi,K),tt(ue,Bt,Oi);class St extends E{constructor(){super(...arguments),this._options=[],this.selectedIndex=-1,this.selectedOptions=[],this.shouldSkipFocus=!1,this.typeaheadBuffer="",this.typeaheadExpired=!0,this.typeaheadTimeout=-1}get firstSelectedOption(){var t;return(t=this.selectedOptions[0])!==null&&t!==void 0?t:null}get hasSelectableOptions(){return this.options.length>0&&!this.options.every(t=>t.disabled)}get length(){var t,e;return(e=(t=this.options)===null||t===void 0?void 0:t.length)!==null&&e!==void 0?e:0}get options(){return L.track(this,"options"),this._options}set options(t){this._options=t,L.notify(this,"options")}get typeAheadExpired(){return this.typeaheadExpired}set typeAheadExpired(t){this.typeaheadExpired=t}clickHandler(t){const e=t.target.closest("option,[role=option]");if(e&&!e.disabled)return this.selectedIndex=this.options.indexOf(e),!0}focusAndScrollOptionIntoView(t=this.firstSelectedOption){this.contains(document.activeElement)&&t!==null&&(t.focus(),requestAnimationFrame(()=>{t.scrollIntoView({block:"nearest"})}))}focusinHandler(t){!this.shouldSkipFocus&&t.target===t.currentTarget&&(this.setSelectedOptions(),this.focusAndScrollOptionIntoView()),this.shouldSkipFocus=!1}getTypeaheadMatches(){const t=this.typeaheadBuffer.replace(/[.*+\-?^${}()|[\]\\]/g,"\\$&"),e=new RegExp(`^${t}`,"gi");return this.options.filter(s=>s.text.trim().match(e))}getSelectableIndex(t=this.selectedIndex,e){const s=t>e?-1:t<e?1:0,o=t+s;let n=null;switch(s){case-1:{n=this.options.reduceRight((r,a,l)=>!r&&!a.disabled&&l<o?a:r,n);break}case 1:{n=this.options.reduce((r,a,l)=>!r&&!a.disabled&&l>o?a:r,n);break}}return this.options.indexOf(n)}handleChange(t,e){switch(e){case"selected":{St.slottedOptionFilter(t)&&(this.selectedIndex=this.options.indexOf(t)),this.setSelectedOptions();break}}}handleTypeAhead(t){this.typeaheadTimeout&&window.clearTimeout(this.typeaheadTimeout),this.typeaheadTimeout=window.setTimeout(()=>this.typeaheadExpired=!0,St.TYPE_AHEAD_TIMEOUT_MS),!(t.length>1)&&(this.typeaheadBuffer=`${this.typeaheadExpired?"":this.typeaheadBuffer}${t}`)}keydownHandler(t){if(this.disabled)return!0;this.shouldSkipFocus=!1;const e=t.key;switch(e){case me:{t.shiftKey||(t.preventDefault(),this.selectFirstOption());break}case Wt:{t.shiftKey||(t.preventDefault(),this.selectNextOption());break}case Xt:{t.shiftKey||(t.preventDefault(),this.selectPreviousOption());break}case be:{t.preventDefault(),this.selectLastOption();break}case Gs:return this.focusAndScrollOptionIntoView(),!0;case de:case Je:return!0;case Ke:if(this.typeaheadExpired)return!0;default:return e.length===1&&this.handleTypeAhead(`${e}`),!0}}mousedownHandler(t){return this.shouldSkipFocus=!this.contains(document.activeElement),!0}multipleChanged(t,e){this.ariaMultiSelectable=e?"true":null}selectedIndexChanged(t,e){var s;if(!this.hasSelectableOptions){this.selectedIndex=-1;return}if(!((s=this.options[this.selectedIndex])===null||s===void 0)&&s.disabled&&typeof t=="number"){const o=this.getSelectableIndex(t,e),n=o>-1?o:t;this.selectedIndex=n,e===n&&this.selectedIndexChanged(e,n);return}this.setSelectedOptions()}selectedOptionsChanged(t,e){var s;const o=e.filter(St.slottedOptionFilter);(s=this.options)===null||s===void 0||s.forEach(n=>{const r=L.getNotifier(n);r.unsubscribe(this,"selected"),n.selected=o.includes(n),r.subscribe(this,"selected")})}selectFirstOption(){var t,e;this.disabled||(this.selectedIndex=(e=(t=this.options)===null||t===void 0?void 0:t.findIndex(s=>!s.disabled))!==null&&e!==void 0?e:-1)}selectLastOption(){this.disabled||(this.selectedIndex=hu(this.options,t=>!t.disabled))}selectNextOption(){!this.disabled&&this.selectedIndex<this.options.length-1&&(this.selectedIndex+=1)}selectPreviousOption(){!this.disabled&&this.selectedIndex>0&&(this.selectedIndex=this.selectedIndex-1)}setDefaultSelectedOption(){var t,e;this.selectedIndex=(e=(t=this.options)===null||t===void 0?void 0:t.findIndex(s=>s.defaultSelected))!==null&&e!==void 0?e:-1}setSelectedOptions(){var t,e,s;!((t=this.options)===null||t===void 0)&&t.length&&(this.selectedOptions=[this.options[this.selectedIndex]],this.ariaActiveDescendant=(s=(e=this.firstSelectedOption)===null||e===void 0?void 0:e.id)!==null&&s!==void 0?s:"",this.focusAndScrollOptionIntoView())}slottedOptionsChanged(t,e){this.options=e.reduce((o,n)=>(ll(n)&&o.push(n),o),[]);const s=`${this.options.length}`;this.options.forEach((o,n)=>{o.id||(o.id=ti("option-")),o.ariaPosInSet=`${n+1}`,o.ariaSetSize=s}),this.$fastController.isConnected&&(this.setSelectedOptions(),this.setDefaultSelectedOption())}typeaheadBufferChanged(t,e){if(this.$fastController.isConnected){const s=this.getTypeaheadMatches();if(s.length){const o=this.options.indexOf(s[0]);o>-1&&(this.selectedIndex=o)}this.typeaheadExpired=!1}}}St.slottedOptionFilter=i=>ll(i)&&!i.hidden,St.TYPE_AHEAD_TIMEOUT_MS=1e3,c([u({mode:"boolean"})],St.prototype,"disabled",void 0),c([g],St.prototype,"selectedIndex",void 0),c([g],St.prototype,"selectedOptions",void 0),c([g],St.prototype,"slottedOptions",void 0),c([g],St.prototype,"typeaheadBuffer",void 0);class Be{}c([g],Be.prototype,"ariaActiveDescendant",void 0),c([g],Be.prototype,"ariaDisabled",void 0),c([g],Be.prototype,"ariaExpanded",void 0),c([g],Be.prototype,"ariaMultiSelectable",void 0),tt(Be,K),tt(St,Be);const Ri={above:"above",below:"below"};class Zu extends St{}class Ju extends ve(Zu){constructor(){super(...arguments),this.proxy=document.createElement("input")}}const Js={inline:"inline",list:"list",both:"both",none:"none"};class Re extends Ju{constructor(){super(...arguments),this._value="",this.filteredOptions=[],this.filter="",this.forcedPosition=!1,this.listboxId=ti("listbox-"),this.maxHeight=0,this.open=!1}formResetCallback(){super.formResetCallback(),this.setDefaultSelectedOption(),this.updateValue()}validate(){super.validate(this.control)}get isAutocompleteInline(){return this.autocomplete===Js.inline||this.isAutocompleteBoth}get isAutocompleteList(){return this.autocomplete===Js.list||this.isAutocompleteBoth}get isAutocompleteBoth(){return this.autocomplete===Js.both}openChanged(){if(this.open){this.ariaControls=this.listboxId,this.ariaExpanded="true",this.setPositioning(),this.focusAndScrollOptionIntoView(),O.queueUpdate(()=>this.focus());return}this.ariaControls="",this.ariaExpanded="false"}get options(){return L.track(this,"options"),this.filteredOptions.length?this.filteredOptions:this._options}set options(t){this._options=t,L.notify(this,"options")}placeholderChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.placeholder=this.placeholder)}positionChanged(t,e){this.positionAttribute=e,this.setPositioning()}get value(){return L.track(this,"value"),this._value}set value(t){var e,s,o;const n=`${this._value}`;if(this.$fastController.isConnected&&this.options){const r=this.options.findIndex(h=>h.text.toLowerCase()===t.toLowerCase()),a=(e=this.options[this.selectedIndex])===null||e===void 0?void 0:e.text,l=(s=this.options[r])===null||s===void 0?void 0:s.text;this.selectedIndex=a!==l?r:this.selectedIndex,t=((o=this.firstSelectedOption)===null||o===void 0?void 0:o.text)||t}n!==t&&(this._value=t,super.valueChanged(n,t),L.notify(this,"value"))}clickHandler(t){if(!this.disabled){if(this.open){const e=t.target.closest("option,[role=option]");if(!e||e.disabled)return;this.selectedOptions=[e],this.control.value=e.text,this.clearSelectionRange(),this.updateValue(!0)}return this.open=!this.open,this.open&&this.control.focus(),!0}}connectedCallback(){super.connectedCallback(),this.forcedPosition=!!this.positionAttribute,this.value&&(this.initialValue=this.value)}disabledChanged(t,e){super.disabledChanged&&super.disabledChanged(t,e),this.ariaDisabled=this.disabled?"true":"false"}filterOptions(){(!this.autocomplete||this.autocomplete===Js.none)&&(this.filter="");const t=this.filter.toLowerCase();this.filteredOptions=this._options.filter(e=>e.text.toLowerCase().startsWith(this.filter.toLowerCase())),this.isAutocompleteList&&(!this.filteredOptions.length&&!t&&(this.filteredOptions=this._options),this._options.forEach(e=>{e.hidden=!this.filteredOptions.includes(e)}))}focusAndScrollOptionIntoView(){this.contains(document.activeElement)&&(this.control.focus(),this.firstSelectedOption&&requestAnimationFrame(()=>{var t;(t=this.firstSelectedOption)===null||t===void 0||t.scrollIntoView({block:"nearest"})}))}focusoutHandler(t){if(this.syncValue(),!this.open)return!0;const e=t.relatedTarget;if(this.isSameNode(e)){this.focus();return}(!this.options||!this.options.includes(e))&&(this.open=!1)}inputHandler(t){if(this.filter=this.control.value,this.filterOptions(),this.isAutocompleteInline||(this.selectedIndex=this.options.map(e=>e.text).indexOf(this.control.value)),t.inputType.includes("deleteContent")||!this.filter.length)return!0;this.isAutocompleteList&&!this.open&&(this.open=!0),this.isAutocompleteInline&&(this.filteredOptions.length?(this.selectedOptions=[this.filteredOptions[0]],this.selectedIndex=this.options.indexOf(this.firstSelectedOption),this.setInlineSelection()):this.selectedIndex=-1)}keydownHandler(t){const e=t.key;if(t.ctrlKey||t.shiftKey)return!0;switch(e){case"Enter":{this.syncValue(),this.isAutocompleteInline&&(this.filter=this.value),this.open=!1,this.clearSelectionRange();break}case"Escape":{if(this.isAutocompleteInline||(this.selectedIndex=-1),this.open){this.open=!1;break}this.value="",this.control.value="",this.filter="",this.filterOptions();break}case"Tab":{if(this.setInputToSelection(),!this.open)return!0;t.preventDefault(),this.open=!1;break}case"ArrowUp":case"ArrowDown":{if(this.filterOptions(),!this.open){this.open=!0;break}this.filteredOptions.length>0&&super.keydownHandler(t),this.isAutocompleteInline&&this.setInlineSelection();break}default:return!0}}keyupHandler(t){switch(t.key){case"ArrowLeft":case"ArrowRight":case"Backspace":case"Delete":case"Home":case"End":{this.filter=this.control.value,this.selectedIndex=-1,this.filterOptions();break}}}selectedIndexChanged(t,e){if(this.$fastController.isConnected){if(e=mn(-1,this.options.length-1,e),e!==this.selectedIndex){this.selectedIndex=e;return}super.selectedIndexChanged(t,e)}}selectPreviousOption(){!this.disabled&&this.selectedIndex>=0&&(this.selectedIndex=this.selectedIndex-1)}setDefaultSelectedOption(){if(this.$fastController.isConnected&&this.options){const t=this.options.findIndex(e=>e.getAttribute("selected")!==null||e.selected);this.selectedIndex=t,!this.dirtyValue&&this.firstSelectedOption&&(this.value=this.firstSelectedOption.text),this.setSelectedOptions()}}setInputToSelection(){this.firstSelectedOption&&(this.control.value=this.firstSelectedOption.text,this.control.focus())}setInlineSelection(){this.firstSelectedOption&&(this.setInputToSelection(),this.control.setSelectionRange(this.filter.length,this.control.value.length,"backward"))}syncValue(){var t;const e=this.selectedIndex>-1?(t=this.firstSelectedOption)===null||t===void 0?void 0:t.text:this.control.value;this.updateValue(this.value!==e)}setPositioning(){const t=this.getBoundingClientRect(),s=window.innerHeight-t.bottom;this.position=this.forcedPosition?this.positionAttribute:t.top>s?Ri.above:Ri.below,this.positionAttribute=this.forcedPosition?this.positionAttribute:this.position,this.maxHeight=this.position===Ri.above?~~t.top:~~s}selectedOptionsChanged(t,e){this.$fastController.isConnected&&this._options.forEach(s=>{s.selected=e.includes(s)})}slottedOptionsChanged(t,e){super.slottedOptionsChanged(t,e),this.updateValue()}updateValue(t){var e;this.$fastController.isConnected&&(this.value=((e=this.firstSelectedOption)===null||e===void 0?void 0:e.text)||this.control.value,this.control.value=this.value),t&&this.$emit("change")}clearSelectionRange(){const t=this.control.value.length;this.control.setSelectionRange(t,t)}}c([u({attribute:"autocomplete",mode:"fromView"})],Re.prototype,"autocomplete",void 0),c([g],Re.prototype,"maxHeight",void 0),c([u({attribute:"open",mode:"boolean"})],Re.prototype,"open",void 0),c([u],Re.prototype,"placeholder",void 0),c([u({attribute:"position"})],Re.prototype,"positionAttribute",void 0),c([g],Re.prototype,"position",void 0);class Ks{}c([g],Ks.prototype,"ariaAutoComplete",void 0),c([g],Ks.prototype,"ariaControls",void 0),tt(Ks,Be),tt(Re,Bt,Ks);const Ku=(i,t)=>v`
    <template
        aria-disabled="${e=>e.ariaDisabled}"
        autocomplete="${e=>e.autocomplete}"
        class="${e=>e.open?"open":""} ${e=>e.disabled?"disabled":""} ${e=>e.position}"
        ?open="${e=>e.open}"
        tabindex="${e=>e.disabled?null:"0"}"
        @click="${(e,s)=>e.clickHandler(s.event)}"
        @focusout="${(e,s)=>e.focusoutHandler(s.event)}"
        @keydown="${(e,s)=>e.keydownHandler(s.event)}"
    >
        <div class="control" part="control">
            ${Pt(i,t)}
            <slot name="control">
                <input
                    aria-activedescendant="${e=>e.open?e.ariaActiveDescendant:null}"
                    aria-autocomplete="${e=>e.ariaAutoComplete}"
                    aria-controls="${e=>e.ariaControls}"
                    aria-disabled="${e=>e.ariaDisabled}"
                    aria-expanded="${e=>e.ariaExpanded}"
                    aria-haspopup="listbox"
                    class="selected-value"
                    part="selected-value"
                    placeholder="${e=>e.placeholder}"
                    role="combobox"
                    type="text"
                    ?disabled="${e=>e.disabled}"
                    :value="${e=>e.value}"
                    @input="${(e,s)=>e.inputHandler(s.event)}"
                    @keyup="${(e,s)=>e.keyupHandler(s.event)}"
                    ${j("control")}
                />
                <div class="indicator" part="indicator" aria-hidden="true">
                    <slot name="indicator">
                        ${t.indicator||""}
                    </slot>
                </div>
            </slot>
            ${At(i,t)}
        </div>
        <div
            class="listbox"
            id="${e=>e.listboxId}"
            part="listbox"
            role="listbox"
            ?disabled="${e=>e.disabled}"
            ?hidden="${e=>!e.open}"
            ${j("listbox")}
        >
            <slot
                ${Z({filter:St.slottedOptionFilter,flatten:!0,property:"slottedOptions"})}
            ></slot>
        </div>
    </template>
`;function cs(i){const t=i.parentElement;if(t)return t;{const e=i.getRootNode();if(e.host instanceof HTMLElement)return e.host}return null}function tp(i,t){let e=t;for(;e!==null;){if(e===i)return!0;e=cs(e)}return!1}const De=document.createElement("div");function ep(i){return i instanceof Bs}class xn{setProperty(t,e){O.queueUpdate(()=>this.target.setProperty(t,e))}removeProperty(t){O.queueUpdate(()=>this.target.removeProperty(t))}}class ip extends xn{constructor(t){super();const e=new CSSStyleSheet;this.target=e.cssRules[e.insertRule(":host{}")].style,t.$fastController.addStyles(Lt.create([e]))}}class sp extends xn{constructor(){super();const t=new CSSStyleSheet;this.target=t.cssRules[t.insertRule(":root{}")].style,document.adoptedStyleSheets=[...document.adoptedStyleSheets,t]}}class op extends xn{constructor(){super(),this.style=document.createElement("style"),document.head.appendChild(this.style);const{sheet:t}=this.style;if(t){const e=t.insertRule(":root{}",t.cssRules.length);this.target=t.cssRules[e].style}}}class cl{constructor(t){this.store=new Map,this.target=null;const e=t.$fastController;this.style=document.createElement("style"),e.addStyles(this.style),L.getNotifier(e).subscribe(this,"isConnected"),this.handleChange(e,"isConnected")}targetChanged(){if(this.target!==null)for(const[t,e]of this.store.entries())this.target.setProperty(t,e)}setProperty(t,e){this.store.set(t,e),O.queueUpdate(()=>{this.target!==null&&this.target.setProperty(t,e)})}removeProperty(t){this.store.delete(t),O.queueUpdate(()=>{this.target!==null&&this.target.removeProperty(t)})}handleChange(t,e){const{sheet:s}=this.style;if(s){const o=s.insertRule(":host{}",s.cssRules.length);this.target=s.cssRules[o].style}else this.target=null}}c([g],cl.prototype,"target",void 0);class np{constructor(t){this.target=t.style}setProperty(t,e){O.queueUpdate(()=>this.target.setProperty(t,e))}removeProperty(t){O.queueUpdate(()=>this.target.removeProperty(t))}}class xt{setProperty(t,e){xt.properties[t]=e;for(const s of xt.roots.values())Di.getOrCreate(xt.normalizeRoot(s)).setProperty(t,e)}removeProperty(t){delete xt.properties[t];for(const e of xt.roots.values())Di.getOrCreate(xt.normalizeRoot(e)).removeProperty(t)}static registerRoot(t){const{roots:e}=xt;if(!e.has(t)){e.add(t);const s=Di.getOrCreate(this.normalizeRoot(t));for(const o in xt.properties)s.setProperty(o,xt.properties[o])}}static unregisterRoot(t){const{roots:e}=xt;if(e.has(t)){e.delete(t);const s=Di.getOrCreate(xt.normalizeRoot(t));for(const o in xt.properties)s.removeProperty(o)}}static normalizeRoot(t){return t===De?document:t}}xt.roots=new Set,xt.properties={};const $n=new WeakMap,rp=O.supportsAdoptedStyleSheets?ip:cl,Di=Object.freeze({getOrCreate(i){if($n.has(i))return $n.get(i);let t;return i===De?t=new xt:i instanceof Document?t=O.supportsAdoptedStyleSheets?new sp:new op:ep(i)?t=new rp(i):t=new np(i),$n.set(i,t),t}});class Ht extends ln{constructor(t){super(),this.subscribers=new WeakMap,this._appliedTo=new Set,this.name=t.name,t.cssCustomPropertyName!==null&&(this.cssCustomProperty=`--${t.cssCustomPropertyName}`,this.cssVar=`var(${this.cssCustomProperty})`),this.id=Ht.uniqueId(),Ht.tokensById.set(this.id,this)}get appliedTo(){return[...this._appliedTo]}static from(t){return new Ht({name:typeof t=="string"?t:t.name,cssCustomPropertyName:typeof t=="string"?t:t.cssCustomPropertyName===void 0?t.name:t.cssCustomPropertyName})}static isCSSDesignToken(t){return typeof t.cssCustomProperty=="string"}static isDerivedDesignTokenValue(t){return typeof t=="function"}static getTokenById(t){return Ht.tokensById.get(t)}getOrCreateSubscriberSet(t=this){return this.subscribers.get(t)||this.subscribers.set(t,new Set)&&this.subscribers.get(t)}createCSS(){return this.cssVar||""}getValueFor(t){const e=ut.getOrCreate(t).get(this);if(e!==void 0)return e;throw new Error(`Value could not be retrieved for token named "${this.name}". Ensure the value is set for ${t} or an ancestor of ${t}.`)}setValueFor(t,e){return this._appliedTo.add(t),e instanceof Ht&&(e=this.alias(e)),ut.getOrCreate(t).set(this,e),this}deleteValueFor(t){return this._appliedTo.delete(t),ut.existsFor(t)&&ut.getOrCreate(t).delete(this),this}withDefault(t){return this.setValueFor(De,t),this}subscribe(t,e){const s=this.getOrCreateSubscriberSet(e);e&&!ut.existsFor(e)&&ut.getOrCreate(e),s.has(t)||s.add(t)}unsubscribe(t,e){const s=this.subscribers.get(e||this);s&&s.has(t)&&s.delete(t)}notify(t){const e=Object.freeze({token:this,target:t});this.subscribers.has(this)&&this.subscribers.get(this).forEach(s=>s.handleChange(e)),this.subscribers.has(t)&&this.subscribers.get(t).forEach(s=>s.handleChange(e))}alias(t){return e=>t.getValueFor(e)}}Ht.uniqueId=(()=>{let i=0;return()=>(i++,i.toString(16))})(),Ht.tokensById=new Map;class ap{startReflection(t,e){t.subscribe(this,e),this.handleChange({token:t,target:e})}stopReflection(t,e){t.unsubscribe(this,e),this.remove(t,e)}handleChange(t){const{token:e,target:s}=t;this.add(e,s)}add(t,e){Di.getOrCreate(e).setProperty(t.cssCustomProperty,this.resolveCSSValue(ut.getOrCreate(e).get(t)))}remove(t,e){Di.getOrCreate(e).removeProperty(t.cssCustomProperty)}resolveCSSValue(t){return t&&typeof t.createCSS=="function"?t.createCSS():t}}class lp{constructor(t,e,s){this.source=t,this.token=e,this.node=s,this.dependencies=new Set,this.observer=L.binding(t,this,!1),this.observer.handleChange=this.observer.call,this.handleChange()}disconnect(){this.observer.disconnect()}handleChange(){this.node.store.set(this.token,this.observer.observe(this.node.target,is))}}class cp{constructor(){this.values=new Map}set(t,e){this.values.get(t)!==e&&(this.values.set(t,e),L.getNotifier(this).notify(t.id))}get(t){return L.track(this,t.id),this.values.get(t)}delete(t){this.values.delete(t)}all(){return this.values.entries()}}const hs=new WeakMap,ds=new WeakMap;class ut{constructor(t){this.target=t,this.store=new cp,this.children=[],this.assignedValues=new Map,this.reflecting=new Set,this.bindingObservers=new Map,this.tokenValueChangeHandler={handleChange:(e,s)=>{const o=Ht.getTokenById(s);if(o&&(o.notify(this.target),Ht.isCSSDesignToken(o))){const n=this.parent,r=this.isReflecting(o);if(n){const a=n.get(o),l=e.get(o);a!==l&&!r?this.reflectToCSS(o):a===l&&r&&this.stopReflectToCSS(o)}else r||this.reflectToCSS(o)}}},hs.set(t,this),L.getNotifier(this.store).subscribe(this.tokenValueChangeHandler),t instanceof Bs?t.$fastController.addBehaviors([this]):t.isConnected&&this.bind()}static getOrCreate(t){return hs.get(t)||new ut(t)}static existsFor(t){return hs.has(t)}static findParent(t){if(De!==t.target){let e=cs(t.target);for(;e!==null;){if(hs.has(e))return hs.get(e);e=cs(e)}return ut.getOrCreate(De)}return null}static findClosestAssignedNode(t,e){let s=e;do{if(s.has(t))return s;s=s.parent?s.parent:s.target!==De?ut.getOrCreate(De):null}while(s!==null);return null}get parent(){return ds.get(this)||null}has(t){return this.assignedValues.has(t)}get(t){const e=this.store.get(t);if(e!==void 0)return e;const s=this.getRaw(t);if(s!==void 0)return this.hydrate(t,s),this.get(t)}getRaw(t){var e;return this.assignedValues.has(t)?this.assignedValues.get(t):(e=ut.findClosestAssignedNode(t,this))===null||e===void 0?void 0:e.getRaw(t)}set(t,e){Ht.isDerivedDesignTokenValue(this.assignedValues.get(t))&&this.tearDownBindingObserver(t),this.assignedValues.set(t,e),Ht.isDerivedDesignTokenValue(e)?this.setupBindingObserver(t,e):this.store.set(t,e)}delete(t){this.assignedValues.delete(t),this.tearDownBindingObserver(t);const e=this.getRaw(t);e?this.hydrate(t,e):this.store.delete(t)}bind(){const t=ut.findParent(this);t&&t.appendChild(this);for(const e of this.assignedValues.keys())e.notify(this.target)}unbind(){this.parent&&ds.get(this).removeChild(this)}appendChild(t){t.parent&&ds.get(t).removeChild(t);const e=this.children.filter(s=>t.contains(s));ds.set(t,this),this.children.push(t),e.forEach(s=>t.appendChild(s)),L.getNotifier(this.store).subscribe(t);for(const[s,o]of this.store.all())t.hydrate(s,this.bindingObservers.has(s)?this.getRaw(s):o)}removeChild(t){const e=this.children.indexOf(t);return e!==-1&&this.children.splice(e,1),L.getNotifier(this.store).unsubscribe(t),t.parent===this?ds.delete(t):!1}contains(t){return tp(this.target,t.target)}reflectToCSS(t){this.isReflecting(t)||(this.reflecting.add(t),ut.cssCustomPropertyReflector.startReflection(t,this.target))}stopReflectToCSS(t){this.isReflecting(t)&&(this.reflecting.delete(t),ut.cssCustomPropertyReflector.stopReflection(t,this.target))}isReflecting(t){return this.reflecting.has(t)}handleChange(t,e){const s=Ht.getTokenById(e);s&&this.hydrate(s,this.getRaw(s))}hydrate(t,e){if(!this.has(t)){const s=this.bindingObservers.get(t);Ht.isDerivedDesignTokenValue(e)?s?s.source!==e&&(this.tearDownBindingObserver(t),this.setupBindingObserver(t,e)):this.setupBindingObserver(t,e):(s&&this.tearDownBindingObserver(t),this.store.set(t,e))}}setupBindingObserver(t,e){const s=new lp(e,t,this);return this.bindingObservers.set(t,s),s}tearDownBindingObserver(t){return this.bindingObservers.has(t)?(this.bindingObservers.get(t).disconnect(),this.bindingObservers.delete(t),!0):!1}}ut.cssCustomPropertyReflector=new ap,c([g],ut.prototype,"children",void 0);function hp(i){return Ht.from(i)}const Ne=Object.freeze({create:hp,notifyConnection(i){return!i.isConnected||!ut.existsFor(i)?!1:(ut.getOrCreate(i).bind(),!0)},notifyDisconnection(i){return i.isConnected||!ut.existsFor(i)?!1:(ut.getOrCreate(i).unbind(),!0)},registerRoot(i=De){xt.registerRoot(i)},unregisterRoot(i=De){xt.unregisterRoot(i)}}),wn=Object.freeze({definitionCallbackOnly:null,ignoreDuplicate:Symbol()}),kn=new Map,to=new Map;let Ei=null;const us=nt.createInterface(i=>i.cachedCallback(t=>(Ei===null&&(Ei=new dl(null,t)),Ei))),hl=Object.freeze({tagFor(i){return to.get(i)},responsibleFor(i){const t=i.$$designSystem$$;return t||nt.findResponsibleContainer(i).get(us)},getOrCreate(i){if(!i)return Ei===null&&(Ei=nt.getOrCreateDOMContainer().get(us)),Ei;const t=i.$$designSystem$$;if(t)return t;const e=nt.getOrCreateDOMContainer(i);if(e.has(us,!1))return e.get(us);{const s=new dl(i,e);return e.register(ns.instance(us,s)),s}}});function dp(i,t,e){return typeof i=="string"?{name:i,type:t,callback:e}:i}class dl{constructor(t,e){this.owner=t,this.container=e,this.designTokensInitialized=!1,this.prefix="fast",this.shadowRootMode=void 0,this.disambiguate=()=>wn.definitionCallbackOnly,t!==null&&(t.$$designSystem$$=this)}withPrefix(t){return this.prefix=t,this}withShadowRootMode(t){return this.shadowRootMode=t,this}withElementDisambiguation(t){return this.disambiguate=t,this}withDesignTokenRoot(t){return this.designTokenRoot=t,this}register(...t){const e=this.container,s=[],o=this.disambiguate,n=this.shadowRootMode,r={elementPrefix:this.prefix,tryDefineElement(a,l,h){const p=dp(a,l,h),{name:f,callback:m,baseClass:w}=p;let{type:k}=p,F=f,V=kn.get(F),vt=!0;for(;V;){const et=o(F,k,V);switch(et){case wn.ignoreDuplicate:return;case wn.definitionCallbackOnly:vt=!1,V=void 0;break;default:F=et,V=kn.get(F);break}}vt&&((to.has(k)||k===E)&&(k=class extends k{}),kn.set(F,k),to.set(k,F),w&&to.set(w,F)),s.push(new up(e,F,k,n,m,vt))}};this.designTokensInitialized||(this.designTokensInitialized=!0,this.designTokenRoot!==null&&Ne.registerRoot(this.designTokenRoot)),e.registerWithContext(r,...t);for(const a of s)a.callback(a),a.willDefine&&a.definition!==null&&a.definition.define();return this}}class up{constructor(t,e,s,o,n,r){this.container=t,this.name=e,this.type=s,this.shadowRootMode=o,this.callback=n,this.willDefine=r,this.definition=null}definePresentation(t){_a.define(this.name,t,this.container)}defineElement(t){this.definition=new Hs(this.type,Object.assign(Object.assign({},t),{name:this.name}))}tagFor(t){return hl.tagFor(t)}}const pp=(i,t)=>v`
    <div class="positioning-region" part="positioning-region">
        ${Q(e=>e.modal,v`
                <div
                    class="overlay"
                    part="overlay"
                    role="presentation"
                    @click="${e=>e.dismiss()}"
                ></div>
            `)}
        <div
            role="dialog"
            tabindex="-1"
            class="control"
            part="control"
            aria-modal="${e=>e.modal}"
            aria-describedby="${e=>e.ariaDescribedby}"
            aria-labelledby="${e=>e.ariaLabelledby}"
            aria-label="${e=>e.ariaLabel}"
            ${j("dialog")}
        >
            <slot></slot>
        </div>
    </div>
`;class ae extends E{constructor(){super(...arguments),this.modal=!0,this.hidden=!1,this.trapFocus=!0,this.trapFocusChanged=()=>{this.$fastController.isConnected&&this.updateTrapFocus()},this.isTrappingFocus=!1,this.handleDocumentKeydown=t=>{if(!t.defaultPrevented&&!this.hidden)switch(t.key){case Je:this.dismiss(),t.preventDefault();break;case Gs:this.handleTabKeyDown(t);break}},this.handleDocumentFocus=t=>{!t.defaultPrevented&&this.shouldForceFocus(t.target)&&(this.focusFirstElement(),t.preventDefault())},this.handleTabKeyDown=t=>{if(!this.trapFocus||this.hidden)return;const e=this.getTabQueueBounds();if(e.length!==0){if(e.length===1){e[0].focus(),t.preventDefault();return}t.shiftKey&&t.target===e[0]?(e[e.length-1].focus(),t.preventDefault()):!t.shiftKey&&t.target===e[e.length-1]&&(e[0].focus(),t.preventDefault())}},this.getTabQueueBounds=()=>{const t=[];return ae.reduceTabbableItems(t,this)},this.focusFirstElement=()=>{const t=this.getTabQueueBounds();t.length>0?t[0].focus():this.dialog instanceof HTMLElement&&this.dialog.focus()},this.shouldForceFocus=t=>this.isTrappingFocus&&!this.contains(t),this.shouldTrapFocus=()=>this.trapFocus&&!this.hidden,this.updateTrapFocus=t=>{const e=t===void 0?this.shouldTrapFocus():t;e&&!this.isTrappingFocus?(this.isTrappingFocus=!0,document.addEventListener("focusin",this.handleDocumentFocus),O.queueUpdate(()=>{this.shouldForceFocus(document.activeElement)&&this.focusFirstElement()})):!e&&this.isTrappingFocus&&(this.isTrappingFocus=!1,document.removeEventListener("focusin",this.handleDocumentFocus))}}dismiss(){this.$emit("dismiss"),this.$emit("cancel")}show(){this.hidden=!1}hide(){this.hidden=!0,this.$emit("close")}connectedCallback(){super.connectedCallback(),document.addEventListener("keydown",this.handleDocumentKeydown),this.notifier=L.getNotifier(this),this.notifier.subscribe(this,"hidden"),this.updateTrapFocus()}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("keydown",this.handleDocumentKeydown),this.updateTrapFocus(!1),this.notifier.unsubscribe(this,"hidden")}handleChange(t,e){switch(e){case"hidden":this.updateTrapFocus();break}}static reduceTabbableItems(t,e){return e.getAttribute("tabindex")==="-1"?t:ta(e)||ae.isFocusableFastElement(e)&&ae.hasTabbableShadow(e)?(t.push(e),t):e.childElementCount?t.concat(Array.from(e.children).reduce(ae.reduceTabbableItems,[])):t}static isFocusableFastElement(t){var e,s;return!!(!((s=(e=t.$fastController)===null||e===void 0?void 0:e.definition.shadowOptions)===null||s===void 0)&&s.delegatesFocus)}static hasTabbableShadow(t){var e,s;return Array.from((s=(e=t.shadowRoot)===null||e===void 0?void 0:e.querySelectorAll("*"))!==null&&s!==void 0?s:[]).some(o=>ta(o))}}c([u({mode:"boolean"})],ae.prototype,"modal",void 0),c([u({mode:"boolean"})],ae.prototype,"hidden",void 0),c([u({attribute:"trap-focus",mode:"boolean"})],ae.prototype,"trapFocus",void 0),c([u({attribute:"aria-describedby"})],ae.prototype,"ariaDescribedby",void 0),c([u({attribute:"aria-labelledby"})],ae.prototype,"ariaLabelledby",void 0),c([u({attribute:"aria-label"})],ae.prototype,"ariaLabel",void 0);const fp=(i,t)=>v`
    <details class="disclosure" ${j("details")}>
        <summary
            class="invoker"
            role="button"
            aria-controls="disclosure-content"
            aria-expanded="${e=>e.expanded}"
        >
            <slot name="start"></slot>
            <slot name="title">${e=>e.title}</slot>
            <slot name="end"></slot>
        </summary>
        <div id="disclosure-content"><slot></slot></div>
    </details>
`;class eo extends E{connectedCallback(){super.connectedCallback(),this.setup()}disconnectedCallback(){super.disconnectedCallback(),this.details.removeEventListener("toggle",this.onToggle)}show(){this.details.open=!0}hide(){this.details.open=!1}toggle(){this.details.open=!this.details.open}setup(){this.onToggle=this.onToggle.bind(this),this.details.addEventListener("toggle",this.onToggle),this.expanded&&this.show()}onToggle(){this.expanded=this.details.open,this.$emit("toggle")}}c([u({mode:"boolean"})],eo.prototype,"expanded",void 0),c([u],eo.prototype,"title",void 0);const gp=(i,t)=>v`
    <template role="${e=>e.role}" aria-orientation="${e=>e.orientation}"></template>
`,mp={separator:"separator",presentation:"presentation"};class Cn extends E{constructor(){super(...arguments),this.role=mp.separator,this.orientation=rt.horizontal}}c([u],Cn.prototype,"role",void 0),c([u],Cn.prototype,"orientation",void 0);const Tn={next:"next",previous:"previous"},bp=(i,t)=>v`
    <template
        role="button"
        aria-disabled="${e=>e.disabled?!0:void 0}"
        tabindex="${e=>e.hiddenFromAT?-1:0}"
        class="${e=>e.direction} ${e=>e.disabled?"disabled":""}"
        @keyup="${(e,s)=>e.keyupHandler(s.event)}"
    >
        ${Q(e=>e.direction===Tn.next,v`
                <span part="next" class="next">
                    <slot name="next">
                        ${t.next||""}
                    </slot>
                </span>
            `)}
        ${Q(e=>e.direction===Tn.previous,v`
                <span part="previous" class="previous">
                    <slot name="previous">
                        ${t.previous||""}
                    </slot>
                </span>
            `)}
    </template>
`;class je extends E{constructor(){super(...arguments),this.hiddenFromAT=!0,this.direction=Tn.next}keyupHandler(t){if(!this.hiddenFromAT){const e=t.key;(e==="Enter"||e==="Space")&&this.$emit("click",t),e==="Escape"&&this.blur()}}}c([u({mode:"boolean"})],je.prototype,"disabled",void 0),c([u({attribute:"aria-hidden",converter:zs})],je.prototype,"hiddenFromAT",void 0),c([u],je.prototype,"direction",void 0);const vp=(i,t)=>v`
    <template
        aria-checked="${e=>e.ariaChecked}"
        aria-disabled="${e=>e.ariaDisabled}"
        aria-posinset="${e=>e.ariaPosInSet}"
        aria-selected="${e=>e.ariaSelected}"
        aria-setsize="${e=>e.ariaSetSize}"
        class="${e=>[e.checked&&"checked",e.selected&&"selected",e.disabled&&"disabled"].filter(Boolean).join(" ")}"
        role="option"
    >
        ${Pt(i,t)}
        <span class="content" part="content">
            <slot ${Z("content")}></slot>
        </span>
        ${At(i,t)}
    </template>
`;class _e extends St{constructor(){super(...arguments),this.activeIndex=-1,this.rangeStartIndex=-1}get activeOption(){return this.options[this.activeIndex]}get checkedOptions(){var t;return(t=this.options)===null||t===void 0?void 0:t.filter(e=>e.checked)}get firstSelectedOptionIndex(){return this.options.indexOf(this.firstSelectedOption)}activeIndexChanged(t,e){var s,o;this.ariaActiveDescendant=(o=(s=this.options[e])===null||s===void 0?void 0:s.id)!==null&&o!==void 0?o:"",this.focusAndScrollOptionIntoView()}checkActiveIndex(){if(!this.multiple)return;const t=this.activeOption;t&&(t.checked=!0)}checkFirstOption(t=!1){t?(this.rangeStartIndex===-1&&(this.rangeStartIndex=this.activeIndex+1),this.options.forEach((e,s)=>{e.checked=Ws(s,this.rangeStartIndex)})):this.uncheckAllOptions(),this.activeIndex=0,this.checkActiveIndex()}checkLastOption(t=!1){t?(this.rangeStartIndex===-1&&(this.rangeStartIndex=this.activeIndex),this.options.forEach((e,s)=>{e.checked=Ws(s,this.rangeStartIndex,this.options.length)})):this.uncheckAllOptions(),this.activeIndex=this.options.length-1,this.checkActiveIndex()}connectedCallback(){super.connectedCallback(),this.addEventListener("focusout",this.focusoutHandler)}disconnectedCallback(){this.removeEventListener("focusout",this.focusoutHandler),super.disconnectedCallback()}checkNextOption(t=!1){t?(this.rangeStartIndex===-1&&(this.rangeStartIndex=this.activeIndex),this.options.forEach((e,s)=>{e.checked=Ws(s,this.rangeStartIndex,this.activeIndex+1)})):this.uncheckAllOptions(),this.activeIndex+=this.activeIndex<this.options.length-1?1:0,this.checkActiveIndex()}checkPreviousOption(t=!1){t?(this.rangeStartIndex===-1&&(this.rangeStartIndex=this.activeIndex),this.checkedOptions.length===1&&(this.rangeStartIndex+=1),this.options.forEach((e,s)=>{e.checked=Ws(s,this.activeIndex,this.rangeStartIndex)})):this.uncheckAllOptions(),this.activeIndex-=this.activeIndex>0?1:0,this.checkActiveIndex()}clickHandler(t){var e;if(!this.multiple)return super.clickHandler(t);const s=(e=t.target)===null||e===void 0?void 0:e.closest("[role=option]");if(!(!s||s.disabled))return this.uncheckAllOptions(),this.activeIndex=this.options.indexOf(s),this.checkActiveIndex(),this.toggleSelectedForAllCheckedOptions(),!0}focusAndScrollOptionIntoView(){super.focusAndScrollOptionIntoView(this.activeOption)}focusinHandler(t){if(!this.multiple)return super.focusinHandler(t);!this.shouldSkipFocus&&t.target===t.currentTarget&&(this.uncheckAllOptions(),this.activeIndex===-1&&(this.activeIndex=this.firstSelectedOptionIndex!==-1?this.firstSelectedOptionIndex:0),this.checkActiveIndex(),this.setSelectedOptions(),this.focusAndScrollOptionIntoView()),this.shouldSkipFocus=!1}focusoutHandler(t){this.multiple&&this.uncheckAllOptions()}keydownHandler(t){if(!this.multiple)return super.keydownHandler(t);if(this.disabled)return!0;const{key:e,shiftKey:s}=t;switch(this.shouldSkipFocus=!1,e){case me:{this.checkFirstOption(s);return}case Wt:{this.checkNextOption(s);return}case Xt:{this.checkPreviousOption(s);return}case be:{this.checkLastOption(s);return}case Gs:return this.focusAndScrollOptionIntoView(),!0;case Je:return this.uncheckAllOptions(),this.checkActiveIndex(),!0;case Ke:if(t.preventDefault(),this.typeAheadExpired){this.toggleSelectedForAllCheckedOptions();return}default:return e.length===1&&this.handleTypeAhead(`${e}`),!0}}mousedownHandler(t){if(t.offsetX>=0&&t.offsetX<=this.scrollWidth)return super.mousedownHandler(t)}multipleChanged(t,e){var s;this.ariaMultiSelectable=e?"true":null,(s=this.options)===null||s===void 0||s.forEach(o=>{o.checked=e?!1:void 0}),this.setSelectedOptions()}setSelectedOptions(){if(!this.multiple){super.setSelectedOptions();return}this.$fastController.isConnected&&this.options&&(this.selectedOptions=this.options.filter(t=>t.selected),this.focusAndScrollOptionIntoView())}sizeChanged(t,e){var s;const o=Math.max(0,parseInt((s=e==null?void 0:e.toFixed())!==null&&s!==void 0?s:"",10));o!==e&&O.queueUpdate(()=>{this.size=o})}toggleSelectedForAllCheckedOptions(){const t=this.checkedOptions.filter(s=>!s.disabled),e=!t.every(s=>s.selected);t.forEach(s=>s.selected=e),this.selectedIndex=this.options.indexOf(t[t.length-1]),this.setSelectedOptions()}typeaheadBufferChanged(t,e){if(!this.multiple){super.typeaheadBufferChanged(t,e);return}if(this.$fastController.isConnected){const s=this.getTypeaheadMatches(),o=this.options.indexOf(s[0]);o>-1&&(this.activeIndex=o,this.uncheckAllOptions(),this.checkActiveIndex()),this.typeAheadExpired=!1}}uncheckAllOptions(t=!1){this.options.forEach(e=>e.checked=this.multiple?!1:void 0),t||(this.rangeStartIndex=-1)}}c([g],_e.prototype,"activeIndex",void 0),c([u({mode:"boolean"})],_e.prototype,"multiple",void 0),c([u({converter:C})],_e.prototype,"size",void 0);const yp=(i,t)=>v`
    <template
        aria-activedescendant="${e=>e.ariaActiveDescendant}"
        aria-multiselectable="${e=>e.ariaMultiSelectable}"
        class="listbox"
        role="listbox"
        tabindex="${e=>e.disabled?null:"0"}"
        @click="${(e,s)=>e.clickHandler(s.event)}"
        @focusin="${(e,s)=>e.focusinHandler(s.event)}"
        @keydown="${(e,s)=>e.keydownHandler(s.event)}"
        @mousedown="${(e,s)=>e.mousedownHandler(s.event)}"
    >
        <slot
            ${Z({filter:_e.slottedOptionFilter,flatten:!0,property:"slottedOptions"})}
        ></slot>
    </template>
`;class si extends E{constructor(){super(...arguments),this.optionElements=[]}menuElementsChanged(){this.updateOptions()}headerElementsChanged(){this.updateOptions()}footerElementsChanged(){this.updateOptions()}updateOptions(){this.optionElements.splice(0,this.optionElements.length),this.addSlottedListItems(this.headerElements),this.addSlottedListItems(this.menuElements),this.addSlottedListItems(this.footerElements),this.$emit("optionsupdated",{bubbles:!1})}addSlottedListItems(t){t!==void 0&&t.forEach(e=>{e.nodeType===1&&e.getAttribute("role")==="listitem"&&(e.id=e.id||ti("option-"),this.optionElements.push(e))})}}c([g],si.prototype,"menuElements",void 0),c([g],si.prototype,"headerElements",void 0),c([g],si.prototype,"footerElements",void 0),c([g],si.prototype,"suggestionsAvailableText",void 0);const xp=v`
    <template>
        ${i=>i.value}
    </template>
`;class ps extends E{contentsTemplateChanged(){this.$fastController.isConnected&&this.updateView()}connectedCallback(){super.connectedCallback(),this.updateView()}disconnectedCallback(){super.disconnectedCallback(),this.disconnectView()}handleClick(t){return t.defaultPrevented||this.handleInvoked(),!1}handleInvoked(){this.$emit("pickeroptioninvoked")}updateView(){var t,e;this.disconnectView(),this.customView=(e=(t=this.contentsTemplate)===null||t===void 0?void 0:t.render(this,this))!==null&&e!==void 0?e:xp.render(this,this)}disconnectView(){var t;(t=this.customView)===null||t===void 0||t.dispose(),this.customView=void 0}}c([u({attribute:"value"})],ps.prototype,"value",void 0),c([g],ps.prototype,"contentsTemplate",void 0);class In extends E{}const $p=v`
    <template>
        ${i=>i.value}
    </template>
`;class fs extends E{contentsTemplateChanged(){this.$fastController.isConnected&&this.updateView()}connectedCallback(){super.connectedCallback(),this.updateView()}disconnectedCallback(){this.disconnectView(),super.disconnectedCallback()}handleKeyDown(t){return t.defaultPrevented?!1:t.key===de?(this.handleInvoke(),!1):!0}handleClick(t){return t.defaultPrevented||this.handleInvoke(),!1}handleInvoke(){this.$emit("pickeriteminvoked")}updateView(){var t,e;this.disconnectView(),this.customView=(e=(t=this.contentsTemplate)===null||t===void 0?void 0:t.render(this,this))!==null&&e!==void 0?e:$p.render(this,this)}disconnectView(){var t;(t=this.customView)===null||t===void 0||t.dispose(),this.customView=void 0}}c([u({attribute:"value"})],fs.prototype,"value",void 0),c([g],fs.prototype,"contentsTemplate",void 0);function wp(i){const t=i.tagFor(fs);return v`
    <${t}
        value="${e=>e}"
        :contentsTemplate="${(e,s)=>s.parent.listItemContentsTemplate}"
    >
    </${t}>
    `}function kp(i){const t=i.tagFor(ps);return v`
    <${t}
        value="${e=>e}"
        :contentsTemplate="${(e,s)=>s.parent.menuOptionContentsTemplate}"
    >
    </${t}>
    `}const Cp=(i,t)=>{const e=i.tagFor(q),s=i.tagFor(si),o=i.tagFor(In),n=i.tagFor(In),r=wp(i),a=kp(i);return v`
        <template
            :selectedListTag="${()=>o}"
            :menuTag="${()=>s}"
            :defaultListItemTemplate="${r}"
            :defaultMenuOptionTemplate="${a}"
            @focusin="${(l,h)=>l.handleFocusIn(h.event)}"
            @focusout="${(l,h)=>l.handleFocusOut(h.event)}"
            @keydown="${(l,h)=>l.handleKeyDown(h.event)}"
            @pickeriteminvoked="${(l,h)=>l.handleItemInvoke(h.event)}"
            @pickeroptioninvoked="${(l,h)=>l.handleOptionInvoke(h.event)}"
        >
            <slot name="list-region"></slot>

            ${Q(l=>l.flyoutOpen,v`
                <${e}
                    class="region"
                    part="region"
                    auto-update-mode="${l=>l.menuConfig.autoUpdateMode}"
                    fixed-placement="${l=>l.menuConfig.fixedPlacement}"
                    vertical-positioning-mode="${l=>l.menuConfig.verticalPositioningMode}"
                    vertical-default-position="${l=>l.menuConfig.verticalDefaultPosition}"
                    vertical-scaling="${l=>l.menuConfig.verticalScaling}"
                    vertical-inset="${l=>l.menuConfig.verticalInset}"
                    vertical-viewport-lock="${l=>l.menuConfig.verticalViewportLock}"
                    horizontal-positioning-mode="${l=>l.menuConfig.horizontalPositioningMode}"
                    horizontal-default-position="${l=>l.menuConfig.horizontalDefaultPosition}"
                    horizontal-scaling="${l=>l.menuConfig.horizontalScaling}"
                    horizontal-inset="${l=>l.menuConfig.horizontalInset}"
                    horizontal-viewport-lock="${l=>l.menuConfig.horizontalViewportLock}"
                    @loaded="${(l,h)=>l.handleRegionLoaded(h.event)}"
                    ${j("region")}
                >
                    ${Q(l=>!l.showNoOptions&&!l.showLoading,v`
                            <slot name="menu-region"></slot>
                        `)}
                    ${Q(l=>l.showNoOptions&&!l.showLoading,v`
                            <div class="no-options-display" part="no-options-display">
                                <slot name="no-options-region">
                                    ${l=>l.noSuggestionsText}
                                </slot>
                            </div>
                        `)}
                    ${Q(l=>l.showLoading,v`
                            <div class="loading-display" part="loading-display">
                                <slot name="loading-region">
                                    <${n}
                                        part="loading-progress"
                                        class="loading-progress
                                        slot="loading-region"
                                    ></${n}>
                                        ${l=>l.loadingText}
                                </slot>
                            </div>
                        `)}
                </${e}>
            `)}
        </template>
    `};class Tp extends E{}class Ip extends ve(Tp){constructor(){super(...arguments),this.proxy=document.createElement("input")}}const Sp=v`
    <input
        slot="input-region"
        role="combobox"
        type="text"
        autocapitalize="off"
        autocomplete="off"
        haspopup="list"
        aria-label="${i=>i.label}"
        aria-labelledby="${i=>i.labelledBy}"
        placeholder="${i=>i.placeholder}"
        ${j("inputElement")}
    ></input>
`;class _ extends Ip{constructor(){super(...arguments),this.selection="",this.filterSelected=!0,this.filterQuery=!0,this.noSuggestionsText="No suggestions available",this.suggestionsAvailableText="Suggestions available",this.loadingText="Loading suggestions",this.menuPlacement="bottom-fill",this.showLoading=!1,this.optionsList=[],this.filteredOptionsList=[],this.flyoutOpen=!1,this.menuFocusIndex=-1,this.showNoOptions=!1,this.selectedItems=[],this.inputElementView=null,this.handleTextInput=t=>{this.query=this.inputElement.value},this.handleInputClick=t=>{t.preventDefault(),this.toggleFlyout(!0)},this.setRegionProps=()=>{if(this.flyoutOpen){if(this.region===null||this.region===void 0){O.queueUpdate(this.setRegionProps);return}this.region.anchorElement=this.inputElement}},this.configLookup={top:Ja,bottom:Ka,tallest:tl,"top-fill":wu,"bottom-fill":el,"tallest-fill":ku}}selectionChanged(){this.$fastController.isConnected&&(this.handleSelectionChange(),this.proxy instanceof HTMLInputElement&&(this.proxy.value=this.selection,this.validate()))}optionsChanged(){this.optionsList=this.options.split(",").map(t=>t.trim()).filter(t=>t!=="")}menuPlacementChanged(){this.$fastController.isConnected&&this.updateMenuConfig()}showLoadingChanged(){this.$fastController.isConnected&&O.queueUpdate(()=>{this.setFocusedOption(0)})}listItemTemplateChanged(){this.updateListItemTemplate()}defaultListItemTemplateChanged(){this.updateListItemTemplate()}menuOptionTemplateChanged(){this.updateOptionTemplate()}defaultMenuOptionTemplateChanged(){this.updateOptionTemplate()}optionsListChanged(){this.updateFilteredOptions()}queryChanged(){this.$fastController.isConnected&&(this.inputElement.value!==this.query&&(this.inputElement.value=this.query),this.updateFilteredOptions(),this.$emit("querychange",{bubbles:!1}))}filteredOptionsListChanged(){this.$fastController.isConnected&&(this.showNoOptions=this.filteredOptionsList.length===0&&this.menuElement.querySelectorAll('[role="listitem"]').length===0,this.setFocusedOption(this.showNoOptions?-1:0))}flyoutOpenChanged(){this.flyoutOpen?(O.queueUpdate(this.setRegionProps),this.$emit("menuopening",{bubbles:!1})):this.$emit("menuclosing",{bubbles:!1})}showNoOptionsChanged(){this.$fastController.isConnected&&O.queueUpdate(()=>{this.setFocusedOption(0)})}connectedCallback(){super.connectedCallback(),this.listElement=document.createElement(this.selectedListTag),this.appendChild(this.listElement),this.itemsPlaceholderElement=document.createComment(""),this.listElement.append(this.itemsPlaceholderElement),this.inputElementView=Sp.render(this,this.listElement);const t=this.menuTag.toUpperCase();this.menuElement=Array.from(this.children).find(e=>e.tagName===t),this.menuElement===void 0&&(this.menuElement=document.createElement(this.menuTag),this.appendChild(this.menuElement)),this.menuElement.id===""&&(this.menuElement.id=ti("listbox-")),this.menuId=this.menuElement.id,this.optionsPlaceholder=document.createComment(""),this.menuElement.append(this.optionsPlaceholder),this.updateMenuConfig(),O.queueUpdate(()=>this.initialize())}disconnectedCallback(){super.disconnectedCallback(),this.toggleFlyout(!1),this.inputElement.removeEventListener("input",this.handleTextInput),this.inputElement.removeEventListener("click",this.handleInputClick),this.inputElementView!==null&&(this.inputElementView.dispose(),this.inputElementView=null)}focus(){this.inputElement.focus()}initialize(){this.updateListItemTemplate(),this.updateOptionTemplate(),this.itemsRepeatBehavior=new ss(t=>t.selectedItems,t=>t.activeListItemTemplate,{positioning:!0}).createBehavior(this.itemsPlaceholderElement),this.inputElement.addEventListener("input",this.handleTextInput),this.inputElement.addEventListener("click",this.handleInputClick),this.$fastController.addBehaviors([this.itemsRepeatBehavior]),this.menuElement.suggestionsAvailableText=this.suggestionsAvailableText,this.menuElement.addEventListener("optionsupdated",this.handleMenuOptionsUpdated),this.optionsRepeatBehavior=new ss(t=>t.filteredOptionsList,t=>t.activeMenuOptionTemplate,{positioning:!0}).createBehavior(this.optionsPlaceholder),this.$fastController.addBehaviors([this.optionsRepeatBehavior]),this.handleSelectionChange()}toggleFlyout(t){if(this.flyoutOpen!==t){if(t&&document.activeElement===this.inputElement){this.flyoutOpen=t,O.queueUpdate(()=>{this.menuElement!==void 0?this.setFocusedOption(0):this.disableMenu()});return}this.flyoutOpen=!1,this.disableMenu()}}handleMenuOptionsUpdated(t){t.preventDefault(),this.flyoutOpen&&this.setFocusedOption(0)}handleKeyDown(t){if(t.defaultPrevented)return!1;switch(t.key){case Wt:{if(!this.flyoutOpen)this.toggleFlyout(!0);else{const e=this.flyoutOpen?Math.min(this.menuFocusIndex+1,this.menuElement.optionElements.length-1):0;this.setFocusedOption(e)}return!1}case Xt:{if(!this.flyoutOpen)this.toggleFlyout(!0);else{const e=this.flyoutOpen?Math.max(this.menuFocusIndex-1,0):0;this.setFocusedOption(e)}return!1}case Je:return this.toggleFlyout(!1),!1;case de:return this.menuFocusIndex!==-1&&this.menuElement.optionElements.length>this.menuFocusIndex&&this.menuElement.optionElements[this.menuFocusIndex].click(),!1;case Fe:return document.activeElement!==this.inputElement?(this.incrementFocusedItem(1),!1):!0;case Se:return this.inputElement.selectionStart===0?(this.incrementFocusedItem(-1),!1):!0;case vu:case bu:{if(document.activeElement===null)return!0;if(document.activeElement===this.inputElement)return this.inputElement.selectionStart===0?(this.selection=this.selectedItems.slice(0,this.selectedItems.length-1).toString(),this.toggleFlyout(!1),!1):!0;const e=Array.from(this.listElement.children),s=e.indexOf(document.activeElement);return s>-1?(this.selection=this.selectedItems.splice(s,1).toString(),O.queueUpdate(()=>{e[Math.min(e.length,s)].focus()}),!1):!0}}return this.toggleFlyout(!0),!0}handleFocusIn(t){return!1}handleFocusOut(t){return(this.menuElement===void 0||!this.menuElement.contains(t.relatedTarget))&&this.toggleFlyout(!1),!1}handleSelectionChange(){this.selectedItems.toString()!==this.selection&&(this.selectedItems=this.selection===""?[]:this.selection.split(","),this.updateFilteredOptions(),O.queueUpdate(()=>{this.checkMaxItems()}),this.$emit("selectionchange",{bubbles:!1}))}handleRegionLoaded(t){O.queueUpdate(()=>{this.setFocusedOption(0),this.$emit("menuloaded",{bubbles:!1})})}checkMaxItems(){if(this.inputElement!==void 0)if(this.maxSelected!==void 0&&this.selectedItems.length>=this.maxSelected){if(document.activeElement===this.inputElement){const t=Array.from(this.listElement.querySelectorAll("[role='listitem']"));t[t.length-1].focus()}this.inputElement.hidden=!0}else this.inputElement.hidden=!1}handleItemInvoke(t){if(t.defaultPrevented)return!1;if(t.target instanceof fs){const s=Array.from(this.listElement.querySelectorAll("[role='listitem']")).indexOf(t.target);if(s!==-1){const o=this.selectedItems.slice();o.splice(s,1),this.selection=o.toString(),O.queueUpdate(()=>this.incrementFocusedItem(0))}return!1}return!0}handleOptionInvoke(t){return t.defaultPrevented?!1:t.target instanceof ps?(t.target.value!==void 0&&(this.selection=`${this.selection}${this.selection===""?"":","}${t.target.value}`),this.inputElement.value="",this.query="",this.inputElement.focus(),this.toggleFlyout(!1),!1):!0}incrementFocusedItem(t){if(this.selectedItems.length===0){this.inputElement.focus();return}const e=Array.from(this.listElement.querySelectorAll("[role='listitem']"));if(document.activeElement!==null){let s=e.indexOf(document.activeElement);s===-1&&(s=e.length);const o=Math.min(e.length,Math.max(0,s+t));o===e.length?this.maxSelected!==void 0&&this.selectedItems.length>=this.maxSelected?e[o-1].focus():this.inputElement.focus():e[o].focus()}}disableMenu(){var t,e,s;this.menuFocusIndex=-1,this.menuFocusOptionId=void 0,(t=this.inputElement)===null||t===void 0||t.removeAttribute("aria-activedescendant"),(e=this.inputElement)===null||e===void 0||e.removeAttribute("aria-owns"),(s=this.inputElement)===null||s===void 0||s.removeAttribute("aria-expanded")}setFocusedOption(t){if(!this.flyoutOpen||t===-1||this.showNoOptions||this.showLoading){this.disableMenu();return}if(this.menuElement.optionElements.length===0)return;this.menuElement.optionElements.forEach(s=>{s.setAttribute("aria-selected","false")}),this.menuFocusIndex=t,this.menuFocusIndex>this.menuElement.optionElements.length-1&&(this.menuFocusIndex=this.menuElement.optionElements.length-1),this.menuFocusOptionId=this.menuElement.optionElements[this.menuFocusIndex].id,this.inputElement.setAttribute("aria-owns",this.menuId),this.inputElement.setAttribute("aria-expanded","true"),this.inputElement.setAttribute("aria-activedescendant",this.menuFocusOptionId);const e=this.menuElement.optionElements[this.menuFocusIndex];e.setAttribute("aria-selected","true"),this.menuElement.scrollTo(0,e.offsetTop)}updateListItemTemplate(){var t;this.activeListItemTemplate=(t=this.listItemTemplate)!==null&&t!==void 0?t:this.defaultListItemTemplate}updateOptionTemplate(){var t;this.activeMenuOptionTemplate=(t=this.menuOptionTemplate)!==null&&t!==void 0?t:this.defaultMenuOptionTemplate}updateFilteredOptions(){this.filteredOptionsList=this.optionsList.slice(0),this.filterSelected&&(this.filteredOptionsList=this.filteredOptionsList.filter(t=>this.selectedItems.indexOf(t)===-1)),this.filterQuery&&this.query!==""&&this.query!==void 0&&(this.filteredOptionsList=this.filteredOptionsList.filter(t=>t.indexOf(this.query)!==-1))}updateMenuConfig(){let t=this.configLookup[this.menuPlacement];t===null&&(t=el),this.menuConfig=Object.assign(Object.assign({},t),{autoUpdateMode:"auto",fixedPlacement:!0,horizontalViewportLock:!1,verticalViewportLock:!1})}}c([u({attribute:"selection"})],_.prototype,"selection",void 0),c([u({attribute:"options"})],_.prototype,"options",void 0),c([u({attribute:"filter-selected",mode:"boolean"})],_.prototype,"filterSelected",void 0),c([u({attribute:"filter-query",mode:"boolean"})],_.prototype,"filterQuery",void 0),c([u({attribute:"max-selected"})],_.prototype,"maxSelected",void 0),c([u({attribute:"no-suggestions-text"})],_.prototype,"noSuggestionsText",void 0),c([u({attribute:"suggestions-available-text"})],_.prototype,"suggestionsAvailableText",void 0),c([u({attribute:"loading-text"})],_.prototype,"loadingText",void 0),c([u({attribute:"label"})],_.prototype,"label",void 0),c([u({attribute:"labelledby"})],_.prototype,"labelledBy",void 0),c([u({attribute:"placeholder"})],_.prototype,"placeholder",void 0),c([u({attribute:"menu-placement"})],_.prototype,"menuPlacement",void 0),c([g],_.prototype,"showLoading",void 0),c([g],_.prototype,"listItemTemplate",void 0),c([g],_.prototype,"defaultListItemTemplate",void 0),c([g],_.prototype,"activeListItemTemplate",void 0),c([g],_.prototype,"menuOptionTemplate",void 0),c([g],_.prototype,"defaultMenuOptionTemplate",void 0),c([g],_.prototype,"activeMenuOptionTemplate",void 0),c([g],_.prototype,"listItemContentsTemplate",void 0),c([g],_.prototype,"menuOptionContentsTemplate",void 0),c([g],_.prototype,"optionsList",void 0),c([g],_.prototype,"query",void 0),c([g],_.prototype,"filteredOptionsList",void 0),c([g],_.prototype,"flyoutOpen",void 0),c([g],_.prototype,"menuId",void 0),c([g],_.prototype,"selectedListTag",void 0),c([g],_.prototype,"menuTag",void 0),c([g],_.prototype,"menuFocusIndex",void 0),c([g],_.prototype,"menuFocusOptionId",void 0),c([g],_.prototype,"showNoOptions",void 0),c([g],_.prototype,"menuConfig",void 0),c([g],_.prototype,"selectedItems",void 0);const Fp=(i,t)=>v`
        <template role="list" slot="menu-region">
            <div class="options-display" part="options-display">
                <div class="header-region" part="header-region">
                    <slot name="header-region" ${Z("headerElements")}></slot>
                </div>

                <slot ${Z("menuElements")}></slot>
                <div class="footer-region" part="footer-region">
                    <slot name="footer-region" ${Z("footerElements")}></slot>
                </div>
                <div
                    role="alert"
                    aria-live="polite"
                    part="suggestions-available-alert"
                    class="suggestions-available-alert"
                >
                    ${e=>e.suggestionsAvailableText}
                </div>
            </div>
        </template>
    `,Op=(i,t)=>v`
        <template
            role="listitem"
            tabindex="-1"
            @click="${(e,s)=>e.handleClick(s.event)}"
        >
            <slot></slot>
        </template>
    `,Rp=(i,t)=>v`
        <template slot="list-region" role="list" class="picker-list">
            <slot></slot>
            <slot name="input-region"></slot>
        </template>
    `,Dp=(i,t)=>v`
        <template
            role="listitem"
            tabindex="0"
            @click="${(e,s)=>e.handleClick(s.event)}"
            @keydown="${(e,s)=>e.handleKeyDown(s.event)}"
        >
            <slot></slot>
        </template>
    `,Vt={menuitem:"menuitem",menuitemcheckbox:"menuitemcheckbox",menuitemradio:"menuitemradio"},Ep={[Vt.menuitem]:"menuitem",[Vt.menuitemcheckbox]:"menuitemcheckbox",[Vt.menuitemradio]:"menuitemradio"};class se extends E{constructor(){super(...arguments),this.role=Vt.menuitem,this.hasSubmenu=!1,this.currentDirection=J.ltr,this.focusSubmenuOnLoad=!1,this.handleMenuItemKeyDown=t=>{if(t.defaultPrevented)return!1;switch(t.key){case de:case Ke:return this.invoke(),!1;case Fe:return this.expandAndFocus(),!1;case Se:if(this.expanded)return this.expanded=!1,this.focus(),!1}return!0},this.handleMenuItemClick=t=>(t.defaultPrevented||this.disabled||this.invoke(),!1),this.submenuLoaded=()=>{this.focusSubmenuOnLoad&&(this.focusSubmenuOnLoad=!1,this.hasSubmenu&&(this.submenu.focus(),this.setAttribute("tabindex","-1")))},this.handleMouseOver=t=>(this.disabled||!this.hasSubmenu||this.expanded||(this.expanded=!0),!1),this.handleMouseOut=t=>(!this.expanded||this.contains(document.activeElement)||(this.expanded=!1),!1),this.expandAndFocus=()=>{this.hasSubmenu&&(this.focusSubmenuOnLoad=!0,this.expanded=!0)},this.invoke=()=>{if(!this.disabled)switch(this.role){case Vt.menuitemcheckbox:this.checked=!this.checked;break;case Vt.menuitem:this.updateSubmenu(),this.hasSubmenu?this.expandAndFocus():this.$emit("change");break;case Vt.menuitemradio:this.checked||(this.checked=!0);break}},this.updateSubmenu=()=>{this.submenu=this.domChildren().find(t=>t.getAttribute("role")==="menu"),this.hasSubmenu=this.submenu!==void 0}}expandedChanged(t){if(this.$fastController.isConnected){if(this.submenu===void 0)return;this.expanded===!1?this.submenu.collapseExpandedItem():this.currentDirection=ei(this),this.$emit("expanded-change",this,{bubbles:!1})}}checkedChanged(t,e){this.$fastController.isConnected&&this.$emit("change")}connectedCallback(){super.connectedCallback(),O.queueUpdate(()=>{this.updateSubmenu()}),this.startColumnCount||(this.startColumnCount=1),this.observer=new MutationObserver(this.updateSubmenu)}disconnectedCallback(){super.disconnectedCallback(),this.submenu=void 0,this.observer!==void 0&&(this.observer.disconnect(),this.observer=void 0)}domChildren(){return Array.from(this.children).filter(t=>!t.hasAttribute("hidden"))}}c([u({mode:"boolean"})],se.prototype,"disabled",void 0),c([u({mode:"boolean"})],se.prototype,"expanded",void 0),c([g],se.prototype,"startColumnCount",void 0),c([u],se.prototype,"role",void 0),c([u({mode:"boolean"})],se.prototype,"checked",void 0),c([g],se.prototype,"submenuRegion",void 0),c([g],se.prototype,"hasSubmenu",void 0),c([g],se.prototype,"currentDirection",void 0),c([g],se.prototype,"submenu",void 0),tt(se,Bt);const Lp=(i,t)=>v`
    <template
        role="${e=>e.role}"
        aria-haspopup="${e=>e.hasSubmenu?"menu":void 0}"
        aria-checked="${e=>e.role!==Vt.menuitem?e.checked:void 0}"
        aria-disabled="${e=>e.disabled}"
        aria-expanded="${e=>e.expanded}"
        @keydown="${(e,s)=>e.handleMenuItemKeyDown(s.event)}"
        @click="${(e,s)=>e.handleMenuItemClick(s.event)}"
        @mouseover="${(e,s)=>e.handleMouseOver(s.event)}"
        @mouseout="${(e,s)=>e.handleMouseOut(s.event)}"
        class="${e=>e.disabled?"disabled":""} ${e=>e.expanded?"expanded":""} ${e=>`indent-${e.startColumnCount}`}"
    >
            ${Q(e=>e.role===Vt.menuitemcheckbox,v`
                    <div part="input-container" class="input-container">
                        <span part="checkbox" class="checkbox">
                            <slot name="checkbox-indicator">
                                ${t.checkboxIndicator||""}
                            </slot>
                        </span>
                    </div>
                `)}
            ${Q(e=>e.role===Vt.menuitemradio,v`
                    <div part="input-container" class="input-container">
                        <span part="radio" class="radio">
                            <slot name="radio-indicator">
                                ${t.radioIndicator||""}
                            </slot>
                        </span>
                    </div>
                `)}
        </div>
        ${Pt(i,t)}
        <span class="content" part="content">
            <slot></slot>
        </span>
        ${At(i,t)}
        ${Q(e=>e.hasSubmenu,v`
                <div
                    part="expand-collapse-glyph-container"
                    class="expand-collapse-glyph-container"
                >
                    <span part="expand-collapse" class="expand-collapse">
                        <slot name="expand-collapse-indicator">
                            ${t.expandCollapseGlyph||""}
                        </slot>
                    </span>
                </div>
            `)}
        ${Q(e=>e.expanded,v`
                <${i.tagFor(q)}
                    :anchorElement="${e=>e}"
                    vertical-positioning-mode="dynamic"
                    vertical-default-position="bottom"
                    vertical-inset="true"
                    horizontal-positioning-mode="dynamic"
                    horizontal-default-position="end"
                    class="submenu-region"
                    dir="${e=>e.currentDirection}"
                    @loaded="${e=>e.submenuLoaded()}"
                    ${j("submenuRegion")}
                    part="submenu-region"
                >
                    <slot name="submenu"></slot>
                </${i.tagFor(q)}>
            `)}
    </template>
`,Ap=(i,t)=>v`
    <template
        slot="${e=>e.slot?e.slot:e.isNestedMenu()?"submenu":void 0}"
        role="menu"
        @keydown="${(e,s)=>e.handleMenuKeyDown(s.event)}"
        @focusout="${(e,s)=>e.handleFocusOut(s.event)}"
    >
        <slot ${Z("items")}></slot>
    </template>
`;class Ts extends E{constructor(){super(...arguments),this.expandedItem=null,this.focusIndex=-1,this.isNestedMenu=()=>this.parentElement!==null&&Ci(this.parentElement)&&this.parentElement.getAttribute("role")==="menuitem",this.handleFocusOut=t=>{if(!this.contains(t.relatedTarget)&&this.menuItems!==void 0){this.collapseExpandedItem();const e=this.menuItems.findIndex(this.isFocusableElement);this.menuItems[this.focusIndex].setAttribute("tabindex","-1"),this.menuItems[e].setAttribute("tabindex","0"),this.focusIndex=e}},this.handleItemFocus=t=>{const e=t.target;this.menuItems!==void 0&&e!==this.menuItems[this.focusIndex]&&(this.menuItems[this.focusIndex].setAttribute("tabindex","-1"),this.focusIndex=this.menuItems.indexOf(e),e.setAttribute("tabindex","0"))},this.handleExpandedChanged=t=>{if(t.defaultPrevented||t.target===null||this.menuItems===void 0||this.menuItems.indexOf(t.target)<0)return;t.preventDefault();const e=t.target;if(this.expandedItem!==null&&e===this.expandedItem&&e.expanded===!1){this.expandedItem=null;return}e.expanded&&(this.expandedItem!==null&&this.expandedItem!==e&&(this.expandedItem.expanded=!1),this.menuItems[this.focusIndex].setAttribute("tabindex","-1"),this.expandedItem=e,this.focusIndex=this.menuItems.indexOf(e),e.setAttribute("tabindex","0"))},this.removeItemListeners=()=>{this.menuItems!==void 0&&this.menuItems.forEach(t=>{t.removeEventListener("expanded-change",this.handleExpandedChanged),t.removeEventListener("focus",this.handleItemFocus)})},this.setItems=()=>{const t=this.domChildren();this.removeItemListeners(),this.menuItems=t;const e=this.menuItems.filter(this.isMenuItemElement);e.length&&(this.focusIndex=0);function s(n){const r=n.getAttribute("role"),a=n.querySelector("[slot=start]");return r!==Vt.menuitem&&a===null||r===Vt.menuitem&&a!==null?1:r!==Vt.menuitem&&a!==null?2:0}const o=e.reduce((n,r)=>{const a=s(r);return n>a?n:a},0);e.forEach((n,r)=>{n.setAttribute("tabindex",r===0?"0":"-1"),n.addEventListener("expanded-change",this.handleExpandedChanged),n.addEventListener("focus",this.handleItemFocus),n instanceof se&&(n.startColumnCount=o)})},this.changeHandler=t=>{if(this.menuItems===void 0)return;const e=t.target,s=this.menuItems.indexOf(e);if(s!==-1&&e.role==="menuitemradio"&&e.checked===!0){for(let n=s-1;n>=0;--n){const r=this.menuItems[n],a=r.getAttribute("role");if(a===Vt.menuitemradio&&(r.checked=!1),a==="separator")break}const o=this.menuItems.length-1;for(let n=s+1;n<=o;++n){const r=this.menuItems[n],a=r.getAttribute("role");if(a===Vt.menuitemradio&&(r.checked=!1),a==="separator")break}}},this.isMenuItemElement=t=>Ci(t)&&Ts.focusableElementRoles.hasOwnProperty(t.getAttribute("role")),this.isFocusableElement=t=>this.isMenuItemElement(t)}itemsChanged(t,e){this.$fastController.isConnected&&this.menuItems!==void 0&&this.setItems()}connectedCallback(){super.connectedCallback(),O.queueUpdate(()=>{this.setItems()}),this.addEventListener("change",this.changeHandler)}disconnectedCallback(){super.disconnectedCallback(),this.removeItemListeners(),this.menuItems=void 0,this.removeEventListener("change",this.changeHandler)}focus(){this.setFocus(0,1)}collapseExpandedItem(){this.expandedItem!==null&&(this.expandedItem.expanded=!1,this.expandedItem=null)}handleMenuKeyDown(t){if(!(t.defaultPrevented||this.menuItems===void 0))switch(t.key){case Wt:this.setFocus(this.focusIndex+1,1);return;case Xt:this.setFocus(this.focusIndex-1,-1);return;case be:this.setFocus(this.menuItems.length-1,-1);return;case me:this.setFocus(0,1);return;default:return!0}}domChildren(){return Array.from(this.children).filter(t=>!t.hasAttribute("hidden"))}setFocus(t,e){if(this.menuItems!==void 0)for(;t>=0&&t<this.menuItems.length;){const s=this.menuItems[t];if(this.isFocusableElement(s)){this.focusIndex>-1&&this.menuItems.length>=this.focusIndex-1&&this.menuItems[this.focusIndex].setAttribute("tabindex","-1"),this.focusIndex=t,s.setAttribute("tabindex","0"),s.focus();break}t+=e}}}Ts.focusableElementRoles=Ep,c([g],Ts.prototype,"items",void 0);const Pp=(i,t)=>v`
    <template class="${e=>e.readOnly?"readonly":""}">
        <label
            part="label"
            for="control"
            class="${e=>e.defaultSlottedNodes&&e.defaultSlottedNodes.length?"label":"label label__hidden"}"
        >
            <slot ${Z("defaultSlottedNodes")}></slot>
        </label>
        <div class="root" part="root">
            ${Pt(i,t)}
            <input
                class="control"
                part="control"
                id="control"
                @input="${e=>e.handleTextInput()}"
                @change="${e=>e.handleChange()}"
                @keydown="${(e,s)=>e.handleKeyDown(s.event)}"
                @blur="${(e,s)=>e.handleBlur()}"
                ?autofocus="${e=>e.autofocus}"
                ?disabled="${e=>e.disabled}"
                list="${e=>e.list}"
                maxlength="${e=>e.maxlength}"
                minlength="${e=>e.minlength}"
                placeholder="${e=>e.placeholder}"
                ?readonly="${e=>e.readOnly}"
                ?required="${e=>e.required}"
                size="${e=>e.size}"
                type="text"
                inputmode="numeric"
                min="${e=>e.min}"
                max="${e=>e.max}"
                step="${e=>e.step}"
                aria-atomic="${e=>e.ariaAtomic}"
                aria-busy="${e=>e.ariaBusy}"
                aria-controls="${e=>e.ariaControls}"
                aria-current="${e=>e.ariaCurrent}"
                aria-describedby="${e=>e.ariaDescribedby}"
                aria-details="${e=>e.ariaDetails}"
                aria-disabled="${e=>e.ariaDisabled}"
                aria-errormessage="${e=>e.ariaErrormessage}"
                aria-flowto="${e=>e.ariaFlowto}"
                aria-haspopup="${e=>e.ariaHaspopup}"
                aria-hidden="${e=>e.ariaHidden}"
                aria-invalid="${e=>e.ariaInvalid}"
                aria-keyshortcuts="${e=>e.ariaKeyshortcuts}"
                aria-label="${e=>e.ariaLabel}"
                aria-labelledby="${e=>e.ariaLabelledby}"
                aria-live="${e=>e.ariaLive}"
                aria-owns="${e=>e.ariaOwns}"
                aria-relevant="${e=>e.ariaRelevant}"
                aria-roledescription="${e=>e.ariaRoledescription}"
                ${j("control")}
            />
            ${Q(e=>!e.hideStep&&!e.readOnly&&!e.disabled,v`
                    <div class="controls" part="controls">
                        <div class="step-up" part="step-up" @click="${e=>e.stepUp()}">
                            <slot name="step-up-glyph">
                                ${t.stepUpGlyph||""}
                            </slot>
                        </div>
                        <div
                            class="step-down"
                            part="step-down"
                            @click="${e=>e.stepDown()}"
                        >
                            <slot name="step-down-glyph">
                                ${t.stepDownGlyph||""}
                            </slot>
                        </div>
                    </div>
                `)}
            ${At(i,t)}
        </div>
    </template>
`;class Vp extends E{}class Mp extends ve(Vp){constructor(){super(...arguments),this.proxy=document.createElement("input")}}const zp={email:"email",password:"password",tel:"tel",text:"text",url:"url"};class Nt extends Mp{constructor(){super(...arguments),this.type=zp.text}readOnlyChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.readOnly=this.readOnly,this.validate())}autofocusChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.autofocus=this.autofocus,this.validate())}placeholderChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.placeholder=this.placeholder)}typeChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.type=this.type,this.validate())}listChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.setAttribute("list",this.list),this.validate())}maxlengthChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.maxLength=this.maxlength,this.validate())}minlengthChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.minLength=this.minlength,this.validate())}patternChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.pattern=this.pattern,this.validate())}sizeChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.size=this.size)}spellcheckChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.spellcheck=this.spellcheck)}connectedCallback(){super.connectedCallback(),this.proxy.setAttribute("type",this.type),this.validate(),this.autofocus&&O.queueUpdate(()=>{this.focus()})}select(){this.control.select(),this.$emit("select")}handleTextInput(){this.value=this.control.value}handleChange(){this.$emit("change")}validate(){super.validate(this.control)}}c([u({attribute:"readonly",mode:"boolean"})],Nt.prototype,"readOnly",void 0),c([u({mode:"boolean"})],Nt.prototype,"autofocus",void 0),c([u],Nt.prototype,"placeholder",void 0),c([u],Nt.prototype,"type",void 0),c([u],Nt.prototype,"list",void 0),c([u({converter:C})],Nt.prototype,"maxlength",void 0),c([u({converter:C})],Nt.prototype,"minlength",void 0),c([u],Nt.prototype,"pattern",void 0),c([u({converter:C})],Nt.prototype,"size",void 0),c([u({mode:"boolean"})],Nt.prototype,"spellcheck",void 0),c([g],Nt.prototype,"defaultSlottedNodes",void 0);class io{}tt(io,K),tt(Nt,Bt,io);class Hp extends E{}class Bp extends ve(Hp){constructor(){super(...arguments),this.proxy=document.createElement("input")}}class Mt extends Bp{constructor(){super(...arguments),this.hideStep=!1,this.step=1,this.isUserInput=!1}maxChanged(t,e){var s;this.max=Math.max(e,(s=this.min)!==null&&s!==void 0?s:e);const o=Math.min(this.min,this.max);this.min!==void 0&&this.min!==o&&(this.min=o),this.value=this.getValidValue(this.value)}minChanged(t,e){var s;this.min=Math.min(e,(s=this.max)!==null&&s!==void 0?s:e);const o=Math.max(this.min,this.max);this.max!==void 0&&this.max!==o&&(this.max=o),this.value=this.getValidValue(this.value)}get valueAsNumber(){return parseFloat(super.value)}set valueAsNumber(t){this.value=t.toString()}valueChanged(t,e){this.value=this.getValidValue(e),e===this.value&&(this.control&&!this.isUserInput&&(this.control.value=this.value),super.valueChanged(t,this.value),t!==void 0&&!this.isUserInput&&(this.$emit("input"),this.$emit("change")),this.isUserInput=!1)}validate(){super.validate(this.control)}getValidValue(t){var e,s;let o=parseFloat(parseFloat(t).toPrecision(12));return isNaN(o)?o="":(o=Math.min(o,(e=this.max)!==null&&e!==void 0?e:o),o=Math.max(o,(s=this.min)!==null&&s!==void 0?s:o).toString()),o}stepUp(){const t=parseFloat(this.value),e=isNaN(t)?this.min>0?this.min:this.max<0?this.max:this.min?0:this.step:t+this.step;this.value=e.toString()}stepDown(){const t=parseFloat(this.value),e=isNaN(t)?this.min>0?this.min:this.max<0?this.max:this.min?0:0-this.step:t-this.step;this.value=e.toString()}connectedCallback(){super.connectedCallback(),this.proxy.setAttribute("type","number"),this.validate(),this.control.value=this.value,this.autofocus&&O.queueUpdate(()=>{this.focus()})}select(){this.control.select(),this.$emit("select")}handleTextInput(){this.control.value=this.control.value.replace(/[^0-9\-+e.]/g,""),this.isUserInput=!0,this.value=this.control.value}handleChange(){this.$emit("change")}handleKeyDown(t){switch(t.key){case Xt:return this.stepUp(),!1;case Wt:return this.stepDown(),!1}return!0}handleBlur(){this.control.value=this.value}}c([u({attribute:"readonly",mode:"boolean"})],Mt.prototype,"readOnly",void 0),c([u({mode:"boolean"})],Mt.prototype,"autofocus",void 0),c([u({attribute:"hide-step",mode:"boolean"})],Mt.prototype,"hideStep",void 0),c([u],Mt.prototype,"placeholder",void 0),c([u],Mt.prototype,"list",void 0),c([u({converter:C})],Mt.prototype,"maxlength",void 0),c([u({converter:C})],Mt.prototype,"minlength",void 0),c([u({converter:C})],Mt.prototype,"size",void 0),c([u({converter:C})],Mt.prototype,"step",void 0),c([u({converter:C})],Mt.prototype,"max",void 0),c([u({converter:C})],Mt.prototype,"min",void 0),c([g],Mt.prototype,"defaultSlottedNodes",void 0),tt(Mt,Bt,io);const ul=44,Np=(i,t)=>v`
    <template
        role="progressbar"
        aria-valuenow="${e=>e.value}"
        aria-valuemin="${e=>e.min}"
        aria-valuemax="${e=>e.max}"
        class="${e=>e.paused?"paused":""}"
    >
        ${Q(e=>typeof e.value=="number",v`
                <svg
                    class="progress"
                    part="progress"
                    viewBox="0 0 16 16"
                    slot="determinate"
                >
                    <circle
                        class="background"
                        part="background"
                        cx="8px"
                        cy="8px"
                        r="7px"
                    ></circle>
                    <circle
                        class="determinate"
                        part="determinate"
                        style="stroke-dasharray: ${e=>ul*e.percentComplete/100}px ${ul}px"
                        cx="8px"
                        cy="8px"
                        r="7px"
                    ></circle>
                </svg>
            `,v`
                <slot name="indeterminate" slot="indeterminate">
                    ${t.indeterminateIndicator||""}
                </slot>
            `)}
    </template>
`;class oi extends E{constructor(){super(...arguments),this.percentComplete=0}valueChanged(){this.$fastController.isConnected&&this.updatePercentComplete()}minChanged(){this.$fastController.isConnected&&this.updatePercentComplete()}maxChanged(){this.$fastController.isConnected&&this.updatePercentComplete()}connectedCallback(){super.connectedCallback(),this.updatePercentComplete()}updatePercentComplete(){const t=typeof this.min=="number"?this.min:0,e=typeof this.max=="number"?this.max:100,s=typeof this.value=="number"?this.value:0,o=e-t;this.percentComplete=o===0?0:Math.fround((s-t)/o*100)}}c([u({converter:C})],oi.prototype,"value",void 0),c([u({converter:C})],oi.prototype,"min",void 0),c([u({converter:C})],oi.prototype,"max",void 0),c([u({mode:"boolean"})],oi.prototype,"paused",void 0),c([g],oi.prototype,"percentComplete",void 0);const jp=(i,t)=>v`
    <template
        role="progressbar"
        aria-valuenow="${e=>e.value}"
        aria-valuemin="${e=>e.min}"
        aria-valuemax="${e=>e.max}"
        class="${e=>e.paused?"paused":""}"
    >
        ${Q(e=>typeof e.value=="number",v`
                <div class="progress" part="progress" slot="determinate">
                    <div
                        class="determinate"
                        part="determinate"
                        style="width: ${e=>e.percentComplete}%"
                    ></div>
                </div>
            `,v`
                <div class="progress" part="progress" slot="indeterminate">
                    <slot class="indeterminate" name="indeterminate">
                        ${t.indeterminateIndicator1||""}
                        ${t.indeterminateIndicator2||""}
                    </slot>
                </div>
            `)}
    </template>
`,_p=(i,t)=>v`
    <template
        role="radiogroup"
        aria-disabled="${e=>e.disabled}"
        aria-readonly="${e=>e.readOnly}"
        @click="${(e,s)=>e.clickHandler(s.event)}"
        @keydown="${(e,s)=>e.keydownHandler(s.event)}"
        @focusout="${(e,s)=>e.focusOutHandler(s.event)}"
    >
        <slot name="label"></slot>
        <div
            class="positioning-region ${e=>e.orientation===rt.horizontal?"horizontal":"vertical"}"
            part="positioning-region"
        >
            <slot
                ${Z({property:"slottedRadioButtons",filter:Ie("[role=radio]")})}
            ></slot>
        </div>
    </template>
`;class Ue extends E{constructor(){super(...arguments),this.orientation=rt.horizontal,this.radioChangeHandler=t=>{const e=t.target;e.checked&&(this.slottedRadioButtons.forEach(s=>{s!==e&&(s.checked=!1,this.isInsideFoundationToolbar||s.setAttribute("tabindex","-1"))}),this.selectedRadio=e,this.value=e.value,e.setAttribute("tabindex","0"),this.focusedRadio=e),t.stopPropagation()},this.moveToRadioByIndex=(t,e)=>{const s=t[e];this.isInsideToolbar||(s.setAttribute("tabindex","0"),s.readOnly?this.slottedRadioButtons.forEach(o=>{o!==s&&o.setAttribute("tabindex","-1")}):(s.checked=!0,this.selectedRadio=s)),this.focusedRadio=s,s.focus()},this.moveRightOffGroup=()=>{var t;(t=this.nextElementSibling)===null||t===void 0||t.focus()},this.moveLeftOffGroup=()=>{var t;(t=this.previousElementSibling)===null||t===void 0||t.focus()},this.focusOutHandler=t=>{const e=this.slottedRadioButtons,s=t.target,o=s!==null?e.indexOf(s):0,n=this.focusedRadio?e.indexOf(this.focusedRadio):-1;return(n===0&&o===n||n===e.length-1&&n===o)&&(this.selectedRadio?(this.focusedRadio=this.selectedRadio,this.isInsideFoundationToolbar||(this.selectedRadio.setAttribute("tabindex","0"),e.forEach(r=>{r!==this.selectedRadio&&r.setAttribute("tabindex","-1")}))):(this.focusedRadio=e[0],this.focusedRadio.setAttribute("tabindex","0"),e.forEach(r=>{r!==this.focusedRadio&&r.setAttribute("tabindex","-1")}))),!0},this.clickHandler=t=>{const e=t.target;if(e){const s=this.slottedRadioButtons;e.checked||s.indexOf(e)===0?(e.setAttribute("tabindex","0"),this.selectedRadio=e):(e.setAttribute("tabindex","-1"),this.selectedRadio=null),this.focusedRadio=e}t.preventDefault()},this.shouldMoveOffGroupToTheRight=(t,e,s)=>t===e.length&&this.isInsideToolbar&&s===Fe,this.shouldMoveOffGroupToTheLeft=(t,e)=>(this.focusedRadio?t.indexOf(this.focusedRadio)-1:0)<0&&this.isInsideToolbar&&e===Se,this.checkFocusedRadio=()=>{this.focusedRadio!==null&&!this.focusedRadio.readOnly&&!this.focusedRadio.checked&&(this.focusedRadio.checked=!0,this.focusedRadio.setAttribute("tabindex","0"),this.focusedRadio.focus(),this.selectedRadio=this.focusedRadio)},this.moveRight=t=>{const e=this.slottedRadioButtons;let s=0;if(s=this.focusedRadio?e.indexOf(this.focusedRadio)+1:1,this.shouldMoveOffGroupToTheRight(s,e,t.key)){this.moveRightOffGroup();return}else s===e.length&&(s=0);for(;s<e.length&&e.length>1;)if(e[s].disabled){if(this.focusedRadio&&s===e.indexOf(this.focusedRadio))break;if(s+1>=e.length){if(this.isInsideToolbar)break;s=0}else s+=1}else{this.moveToRadioByIndex(e,s);break}},this.moveLeft=t=>{const e=this.slottedRadioButtons;let s=0;if(s=this.focusedRadio?e.indexOf(this.focusedRadio)-1:0,s=s<0?e.length-1:s,this.shouldMoveOffGroupToTheLeft(e,t.key)){this.moveLeftOffGroup();return}for(;s>=0&&e.length>1;)if(e[s].disabled){if(this.focusedRadio&&s===e.indexOf(this.focusedRadio))break;s-1<0?s=e.length-1:s-=1}else{this.moveToRadioByIndex(e,s);break}},this.keydownHandler=t=>{const e=t.key;if(e in Si&&this.isInsideFoundationToolbar)return!0;switch(e){case de:{this.checkFocusedRadio();break}case Fe:case Wt:{this.direction===J.ltr?this.moveRight(t):this.moveLeft(t);break}case Se:case Xt:{this.direction===J.ltr?this.moveLeft(t):this.moveRight(t);break}default:return!0}}}readOnlyChanged(){this.slottedRadioButtons!==void 0&&this.slottedRadioButtons.forEach(t=>{this.readOnly?t.readOnly=!0:t.readOnly=!1})}disabledChanged(){this.slottedRadioButtons!==void 0&&this.slottedRadioButtons.forEach(t=>{this.disabled?t.disabled=!0:t.disabled=!1})}nameChanged(){this.slottedRadioButtons&&this.slottedRadioButtons.forEach(t=>{t.setAttribute("name",this.name)})}valueChanged(){this.slottedRadioButtons&&this.slottedRadioButtons.forEach(t=>{t.value===this.value&&(t.checked=!0,this.selectedRadio=t)}),this.$emit("change")}slottedRadioButtonsChanged(t,e){this.slottedRadioButtons&&this.slottedRadioButtons.length>0&&this.setupRadioButtons()}get parentToolbar(){return this.closest('[role="toolbar"]')}get isInsideToolbar(){var t;return(t=this.parentToolbar)!==null&&t!==void 0?t:!1}get isInsideFoundationToolbar(){var t;return!!(!((t=this.parentToolbar)===null||t===void 0)&&t.$fastController)}connectedCallback(){super.connectedCallback(),this.direction=ei(this),this.setupRadioButtons()}disconnectedCallback(){this.slottedRadioButtons.forEach(t=>{t.removeEventListener("change",this.radioChangeHandler)})}setupRadioButtons(){const t=this.slottedRadioButtons.filter(o=>o.hasAttribute("checked")),e=t?t.length:0;if(e>1){const o=t[e-1];o.checked=!0}let s=!1;if(this.slottedRadioButtons.forEach(o=>{this.name!==void 0&&o.setAttribute("name",this.name),this.disabled&&(o.disabled=!0),this.readOnly&&(o.readOnly=!0),this.value&&this.value===o.value?(this.selectedRadio=o,this.focusedRadio=o,o.checked=!0,o.setAttribute("tabindex","0"),s=!0):(this.isInsideFoundationToolbar||o.setAttribute("tabindex","-1"),o.checked=!1),o.addEventListener("change",this.radioChangeHandler)}),this.value===void 0&&this.slottedRadioButtons.length>0){const o=this.slottedRadioButtons.filter(r=>r.hasAttribute("checked")),n=o!==null?o.length:0;if(n>0&&!s){const r=o[n-1];r.checked=!0,this.focusedRadio=r,r.setAttribute("tabindex","0")}else this.slottedRadioButtons[0].setAttribute("tabindex","0"),this.focusedRadio=this.slottedRadioButtons[0]}}}c([u({attribute:"readonly",mode:"boolean"})],Ue.prototype,"readOnly",void 0),c([u({attribute:"disabled",mode:"boolean"})],Ue.prototype,"disabled",void 0),c([u],Ue.prototype,"name",void 0),c([u],Ue.prototype,"value",void 0),c([u],Ue.prototype,"orientation",void 0),c([g],Ue.prototype,"childItems",void 0),c([g],Ue.prototype,"slottedRadioButtons",void 0);const Up=(i,t)=>v`
    <template
        role="radio"
        class="${e=>e.checked?"checked":""} ${e=>e.readOnly?"readonly":""}"
        aria-checked="${e=>e.checked}"
        aria-required="${e=>e.required}"
        aria-disabled="${e=>e.disabled}"
        aria-readonly="${e=>e.readOnly}"
        @keypress="${(e,s)=>e.keypressHandler(s.event)}"
        @click="${(e,s)=>e.clickHandler(s.event)}"
    >
        <div part="control" class="control">
            <slot name="checked-indicator">
                ${t.checkedIndicator||""}
            </slot>
        </div>
        <label
            part="label"
            class="${e=>e.defaultSlottedNodes&&e.defaultSlottedNodes.length?"label":"label label__hidden"}"
        >
            <slot ${Z("defaultSlottedNodes")}></slot>
        </label>
    </template>
`;class qp extends E{}class Gp extends yn(qp){constructor(){super(...arguments),this.proxy=document.createElement("input")}}class so extends Gp{constructor(){super(),this.initialValue="on",this.keypressHandler=t=>{switch(t.key){case Ke:!this.checked&&!this.readOnly&&(this.checked=!0);return}return!0},this.proxy.setAttribute("type","radio")}readOnlyChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.readOnly=this.readOnly)}defaultCheckedChanged(){var t;this.$fastController.isConnected&&!this.dirtyChecked&&(this.isInsideRadioGroup()||(this.checked=(t=this.defaultChecked)!==null&&t!==void 0?t:!1,this.dirtyChecked=!1))}connectedCallback(){var t,e;super.connectedCallback(),this.validate(),((t=this.parentElement)===null||t===void 0?void 0:t.getAttribute("role"))!=="radiogroup"&&this.getAttribute("tabindex")===null&&(this.disabled||this.setAttribute("tabindex","0")),this.checkedAttribute&&(this.dirtyChecked||this.isInsideRadioGroup()||(this.checked=(e=this.defaultChecked)!==null&&e!==void 0?e:!1,this.dirtyChecked=!1))}isInsideRadioGroup(){return this.closest("[role=radiogroup]")!==null}clickHandler(t){!this.disabled&&!this.readOnly&&!this.checked&&(this.checked=!0)}}c([u({attribute:"readonly",mode:"boolean"})],so.prototype,"readOnly",void 0),c([g],so.prototype,"name",void 0),c([g],so.prototype,"defaultSlottedNodes",void 0);class Ee extends E{constructor(){super(...arguments),this.framesPerSecond=60,this.updatingItems=!1,this.speed=600,this.easing="ease-in-out",this.flippersHiddenFromAT=!1,this.scrolling=!1,this.resizeDetector=null}get frameTime(){return 1e3/this.framesPerSecond}scrollingChanged(t,e){if(this.scrollContainer){const s=this.scrolling==!0?"scrollstart":"scrollend";this.$emit(s,this.scrollContainer.scrollLeft)}}get isRtl(){return this.scrollItems.length>1&&this.scrollItems[0].offsetLeft>this.scrollItems[1].offsetLeft}connectedCallback(){super.connectedCallback(),this.initializeResizeDetector()}disconnectedCallback(){this.disconnectResizeDetector(),super.disconnectedCallback()}scrollItemsChanged(t,e){e&&!this.updatingItems&&O.queueUpdate(()=>this.setStops())}disconnectResizeDetector(){this.resizeDetector&&(this.resizeDetector.disconnect(),this.resizeDetector=null)}initializeResizeDetector(){this.disconnectResizeDetector(),this.resizeDetector=new window.ResizeObserver(this.resized.bind(this)),this.resizeDetector.observe(this)}updateScrollStops(){this.updatingItems=!0;const t=this.scrollItems.reduce((e,s)=>s instanceof HTMLSlotElement?e.concat(s.assignedElements()):(e.push(s),e),[]);this.scrollItems=t,this.updatingItems=!1}setStops(){this.updateScrollStops();const{scrollContainer:t}=this,{scrollLeft:e}=t,{width:s,left:o}=t.getBoundingClientRect();this.width=s;let n=0,r=this.scrollItems.map((a,l)=>{const{left:h,width:p}=a.getBoundingClientRect(),f=Math.round(h+e-o),m=Math.round(f+p);return this.isRtl?-m:(n=m,l===0?0:f)}).concat(n);r=this.fixScrollMisalign(r),r.sort((a,l)=>Math.abs(a)-Math.abs(l)),this.scrollStops=r,this.setFlippers()}validateStops(t=!0){const e=()=>!!this.scrollStops.find(s=>s>0);return!e()&&t&&this.setStops(),e()}fixScrollMisalign(t){if(this.isRtl&&t.some(e=>e>0)){t.sort((s,o)=>o-s);const e=t[0];t=t.map(s=>s-e)}return t}setFlippers(){var t,e;const s=this.scrollContainer.scrollLeft;if((t=this.previousFlipperContainer)===null||t===void 0||t.classList.toggle("disabled",s===0),this.scrollStops){const o=Math.abs(this.scrollStops[this.scrollStops.length-1]);(e=this.nextFlipperContainer)===null||e===void 0||e.classList.toggle("disabled",this.validateStops(!1)&&Math.abs(s)+this.width>=o)}}scrollInView(t,e=0,s){var o;if(typeof t!="number"&&t&&(t=this.scrollItems.findIndex(n=>n===t||n.contains(t))),t!==void 0){s=s!=null?s:e;const{scrollContainer:n,scrollStops:r,scrollItems:a}=this,{scrollLeft:l}=this.scrollContainer,{width:h}=n.getBoundingClientRect(),p=r[t],{width:f}=a[t].getBoundingClientRect(),m=p+f,w=l+e>p;if(w||l+h-s<m){const F=(o=[...r].sort((V,vt)=>w?vt-V:V-vt).find(V=>w?V+e<p:V+h-(s!=null?s:0)>m))!==null&&o!==void 0?o:0;this.scrollToPosition(F)}}}keyupHandler(t){switch(t.key){case"ArrowLeft":this.scrollToPrevious();break;case"ArrowRight":this.scrollToNext();break}}scrollToPrevious(){this.validateStops();const t=this.scrollContainer.scrollLeft,e=this.scrollStops.findIndex((n,r)=>n>=t&&(this.isRtl||r===this.scrollStops.length-1||this.scrollStops[r+1]>t)),s=Math.abs(this.scrollStops[e+1]);let o=this.scrollStops.findIndex(n=>Math.abs(n)+this.width>s);(o>=e||o===-1)&&(o=e>0?e-1:0),this.scrollToPosition(this.scrollStops[o],t)}scrollToNext(){this.validateStops();const t=this.scrollContainer.scrollLeft,e=this.scrollStops.findIndex(n=>Math.abs(n)>=Math.abs(t)),s=this.scrollStops.findIndex(n=>Math.abs(t)+this.width<=Math.abs(n));let o=e;s>e+2?o=s-2:e<this.scrollStops.length-2&&(o=e+1),this.scrollToPosition(this.scrollStops[o],t)}scrollToPosition(t,e=this.scrollContainer.scrollLeft){var s;if(this.scrolling)return;this.scrolling=!0;const o=(s=this.duration)!==null&&s!==void 0?s:`${Math.abs(t-e)/this.speed}s`;this.content.style.setProperty("transition-duration",o);const n=parseFloat(getComputedStyle(this.content).getPropertyValue("transition-duration")),r=h=>{h&&h.target!==h.currentTarget||(this.content.style.setProperty("transition-duration","0s"),this.content.style.removeProperty("transform"),this.scrollContainer.style.setProperty("scroll-behavior","auto"),this.scrollContainer.scrollLeft=t,this.setFlippers(),this.content.removeEventListener("transitionend",r),this.scrolling=!1)};if(n===0){r();return}this.content.addEventListener("transitionend",r);const a=this.scrollContainer.scrollWidth-this.scrollContainer.clientWidth;let l=this.scrollContainer.scrollLeft-Math.min(t,a);this.isRtl&&(l=this.scrollContainer.scrollLeft+Math.min(Math.abs(t),a)),this.content.style.setProperty("transition-property","transform"),this.content.style.setProperty("transition-timing-function",this.easing),this.content.style.setProperty("transform",`translateX(${l}px)`)}resized(){this.resizeTimeout&&(this.resizeTimeout=clearTimeout(this.resizeTimeout)),this.resizeTimeout=setTimeout(()=>{this.width=this.scrollContainer.offsetWidth,this.setFlippers()},this.frameTime)}scrolled(){this.scrollTimeout&&(this.scrollTimeout=clearTimeout(this.scrollTimeout)),this.scrollTimeout=setTimeout(()=>{this.setFlippers()},this.frameTime)}}c([u({converter:C})],Ee.prototype,"speed",void 0),c([u],Ee.prototype,"duration",void 0),c([u],Ee.prototype,"easing",void 0),c([u({attribute:"flippers-hidden-from-at",converter:zs})],Ee.prototype,"flippersHiddenFromAT",void 0),c([g],Ee.prototype,"scrolling",void 0),c([g],Ee.prototype,"scrollItems",void 0),c([u({attribute:"view"})],Ee.prototype,"view",void 0);const Wp=(i,t)=>{var e,s;return v`
    <template
        class="horizontal-scroll"
        @keyup="${(o,n)=>o.keyupHandler(n.event)}"
    >
        ${Pt(i,t)}
        <div class="scroll-area" part="scroll-area">
            <div
                class="scroll-view"
                part="scroll-view"
                @scroll="${o=>o.scrolled()}"
                ${j("scrollContainer")}
            >
                <div class="content-container" part="content-container" ${j("content")}>
                    <slot
                        ${Z({property:"scrollItems",filter:Ie()})}
                    ></slot>
                </div>
            </div>
            ${Q(o=>o.view!=="mobile",v`
                    <div
                        class="scroll scroll-prev"
                        part="scroll-prev"
                        ${j("previousFlipperContainer")}
                    >
                        <div class="scroll-action" part="scroll-action-previous">
                            <slot name="previous-flipper">
                                ${t.previousFlipper instanceof Function?t.previousFlipper(i,t):(e=t.previousFlipper)!==null&&e!==void 0?e:""}
                            </slot>
                        </div>
                    </div>
                    <div
                        class="scroll scroll-next"
                        part="scroll-next"
                        ${j("nextFlipperContainer")}
                    >
                        <div class="scroll-action" part="scroll-action-next">
                            <slot name="next-flipper">
                                ${t.nextFlipper instanceof Function?t.nextFlipper(i,t):(s=t.nextFlipper)!==null&&s!==void 0?s:""}
                            </slot>
                        </div>
                    </div>
                `)}
        </div>
        ${At(i,t)}
    </template>
`};function pl(i,t,e){return i.nodeType!==Node.TEXT_NODE?!0:typeof i.nodeValue=="string"&&!!i.nodeValue.trim().length}const Xp=(i,t)=>v`
    <template
        class="
            ${e=>e.readOnly?"readonly":""}
        "
    >
        <label
            part="label"
            for="control"
            class="${e=>e.defaultSlottedNodes&&e.defaultSlottedNodes.length?"label":"label label__hidden"}"
        >
            <slot
                ${Z({property:"defaultSlottedNodes",filter:pl})}
            ></slot>
        </label>
        <div class="root" part="root" ${j("root")}>
            ${Pt(i,t)}
            <div class="input-wrapper" part="input-wrapper">
                <input
                    class="control"
                    part="control"
                    id="control"
                    @input="${e=>e.handleTextInput()}"
                    @change="${e=>e.handleChange()}"
                    ?autofocus="${e=>e.autofocus}"
                    ?disabled="${e=>e.disabled}"
                    list="${e=>e.list}"
                    maxlength="${e=>e.maxlength}"
                    minlength="${e=>e.minlength}"
                    pattern="${e=>e.pattern}"
                    placeholder="${e=>e.placeholder}"
                    ?readonly="${e=>e.readOnly}"
                    ?required="${e=>e.required}"
                    size="${e=>e.size}"
                    ?spellcheck="${e=>e.spellcheck}"
                    :value="${e=>e.value}"
                    type="search"
                    aria-atomic="${e=>e.ariaAtomic}"
                    aria-busy="${e=>e.ariaBusy}"
                    aria-controls="${e=>e.ariaControls}"
                    aria-current="${e=>e.ariaCurrent}"
                    aria-describedby="${e=>e.ariaDescribedby}"
                    aria-details="${e=>e.ariaDetails}"
                    aria-disabled="${e=>e.ariaDisabled}"
                    aria-errormessage="${e=>e.ariaErrormessage}"
                    aria-flowto="${e=>e.ariaFlowto}"
                    aria-haspopup="${e=>e.ariaHaspopup}"
                    aria-hidden="${e=>e.ariaHidden}"
                    aria-invalid="${e=>e.ariaInvalid}"
                    aria-keyshortcuts="${e=>e.ariaKeyshortcuts}"
                    aria-label="${e=>e.ariaLabel}"
                    aria-labelledby="${e=>e.ariaLabelledby}"
                    aria-live="${e=>e.ariaLive}"
                    aria-owns="${e=>e.ariaOwns}"
                    aria-relevant="${e=>e.ariaRelevant}"
                    aria-roledescription="${e=>e.ariaRoledescription}"
                    ${j("control")}
                />
                <slot name="close-button">
                    <button
                        class="clear-button ${e=>e.value?"":"clear-button__hidden"}"
                        part="clear-button"
                        tabindex="-1"
                        @click=${e=>e.handleClearInput()}
                    >
                        <slot name="close-glyph">
                            <svg
                                width="9"
                                height="9"
                                viewBox="0 0 9 9"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M0.146447 0.146447C0.338683 -0.0478972 0.645911 -0.0270359 0.853553 0.146447L4.5 3.793L8.14645 0.146447C8.34171 -0.0488155 8.65829 -0.0488155 8.85355 0.146447C9.04882 0.341709 9.04882 0.658291 8.85355 0.853553L5.207 4.5L8.85355 8.14645C9.05934 8.35223 9.03129 8.67582 8.85355 8.85355C8.67582 9.03129 8.35409 9.02703 8.14645 8.85355L4.5 5.207L0.853553 8.85355C0.658291 9.04882 0.341709 9.04882 0.146447 8.85355C-0.0488155 8.65829 -0.0488155 8.34171 0.146447 8.14645L3.793 4.5L0.146447 0.853553C-0.0268697 0.680237 -0.0457894 0.34079 0.146447 0.146447Z"
                                />
                            </svg>
                        </slot>
                    </button>
                </slot>
            </div>
            ${At(i,t)}
        </div>
    </template>
`;class Yp extends E{}class Qp extends ve(Yp){constructor(){super(...arguments),this.proxy=document.createElement("input")}}class Qt extends Qp{readOnlyChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.readOnly=this.readOnly,this.validate())}autofocusChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.autofocus=this.autofocus,this.validate())}placeholderChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.placeholder=this.placeholder)}listChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.setAttribute("list",this.list),this.validate())}maxlengthChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.maxLength=this.maxlength,this.validate())}minlengthChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.minLength=this.minlength,this.validate())}patternChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.pattern=this.pattern,this.validate())}sizeChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.size=this.size)}spellcheckChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.spellcheck=this.spellcheck)}connectedCallback(){super.connectedCallback(),this.validate(),this.autofocus&&O.queueUpdate(()=>{this.focus()})}validate(){super.validate(this.control)}handleTextInput(){this.value=this.control.value}handleClearInput(){this.value="",this.control.focus(),this.handleChange()}handleChange(){this.$emit("change")}}c([u({attribute:"readonly",mode:"boolean"})],Qt.prototype,"readOnly",void 0),c([u({mode:"boolean"})],Qt.prototype,"autofocus",void 0),c([u],Qt.prototype,"placeholder",void 0),c([u],Qt.prototype,"list",void 0),c([u({converter:C})],Qt.prototype,"maxlength",void 0),c([u({converter:C})],Qt.prototype,"minlength",void 0),c([u],Qt.prototype,"pattern",void 0),c([u({converter:C})],Qt.prototype,"size",void 0),c([u({mode:"boolean"})],Qt.prototype,"spellcheck",void 0),c([g],Qt.prototype,"defaultSlottedNodes",void 0);class fl{}tt(fl,K),tt(Qt,Bt,fl);class Zp extends _e{}class Jp extends ve(Zp){constructor(){super(...arguments),this.proxy=document.createElement("select")}}class ye extends Jp{constructor(){super(...arguments),this.open=!1,this.forcedPosition=!1,this.listboxId=ti("listbox-"),this.maxHeight=0}openChanged(t,e){if(this.collapsible){if(this.open){this.ariaControls=this.listboxId,this.ariaExpanded="true",this.setPositioning(),this.focusAndScrollOptionIntoView(),this.indexWhenOpened=this.selectedIndex,O.queueUpdate(()=>this.focus());return}this.ariaControls="",this.ariaExpanded="false"}}get collapsible(){return!(this.multiple||typeof this.size=="number")}get value(){return L.track(this,"value"),this._value}set value(t){var e,s,o,n,r,a,l;const h=`${this._value}`;if(!((e=this._options)===null||e===void 0)&&e.length){const p=this._options.findIndex(w=>w.value===t),f=(o=(s=this._options[this.selectedIndex])===null||s===void 0?void 0:s.value)!==null&&o!==void 0?o:null,m=(r=(n=this._options[p])===null||n===void 0?void 0:n.value)!==null&&r!==void 0?r:null;(p===-1||f!==m)&&(t="",this.selectedIndex=p),t=(l=(a=this.firstSelectedOption)===null||a===void 0?void 0:a.value)!==null&&l!==void 0?l:t}h!==t&&(this._value=t,super.valueChanged(h,t),L.notify(this,"value"),this.updateDisplayValue())}updateValue(t){var e,s;this.$fastController.isConnected&&(this.value=(s=(e=this.firstSelectedOption)===null||e===void 0?void 0:e.value)!==null&&s!==void 0?s:""),t&&(this.$emit("input"),this.$emit("change",this,{bubbles:!0,composed:void 0}))}selectedIndexChanged(t,e){super.selectedIndexChanged(t,e),this.updateValue()}positionChanged(t,e){this.positionAttribute=e,this.setPositioning()}setPositioning(){const t=this.getBoundingClientRect(),s=window.innerHeight-t.bottom;this.position=this.forcedPosition?this.positionAttribute:t.top>s?Ri.above:Ri.below,this.positionAttribute=this.forcedPosition?this.positionAttribute:this.position,this.maxHeight=this.position===Ri.above?~~t.top:~~s}get displayValue(){var t,e;return L.track(this,"displayValue"),(e=(t=this.firstSelectedOption)===null||t===void 0?void 0:t.text)!==null&&e!==void 0?e:""}disabledChanged(t,e){super.disabledChanged&&super.disabledChanged(t,e),this.ariaDisabled=this.disabled?"true":"false"}formResetCallback(){this.setProxyOptions(),super.setDefaultSelectedOption(),this.selectedIndex===-1&&(this.selectedIndex=0)}clickHandler(t){if(!this.disabled){if(this.open){const e=t.target.closest("option,[role=option]");if(e&&e.disabled)return}return super.clickHandler(t),this.open=this.collapsible&&!this.open,!this.open&&this.indexWhenOpened!==this.selectedIndex&&this.updateValue(!0),!0}}focusoutHandler(t){var e;if(super.focusoutHandler(t),!this.open)return!0;const s=t.relatedTarget;if(this.isSameNode(s)){this.focus();return}!((e=this.options)===null||e===void 0)&&e.includes(s)||(this.open=!1,this.indexWhenOpened!==this.selectedIndex&&this.updateValue(!0))}handleChange(t,e){super.handleChange(t,e),e==="value"&&this.updateValue()}slottedOptionsChanged(t,e){this.options.forEach(s=>{L.getNotifier(s).unsubscribe(this,"value")}),super.slottedOptionsChanged(t,e),this.options.forEach(s=>{L.getNotifier(s).subscribe(this,"value")}),this.setProxyOptions(),this.updateValue()}mousedownHandler(t){var e;return t.offsetX>=0&&t.offsetX<=((e=this.listbox)===null||e===void 0?void 0:e.scrollWidth)?super.mousedownHandler(t):this.collapsible}multipleChanged(t,e){super.multipleChanged(t,e),this.proxy&&(this.proxy.multiple=e)}selectedOptionsChanged(t,e){var s;super.selectedOptionsChanged(t,e),(s=this.options)===null||s===void 0||s.forEach((o,n)=>{var r;const a=(r=this.proxy)===null||r===void 0?void 0:r.options.item(n);a&&(a.selected=o.selected)})}setDefaultSelectedOption(){var t;const e=(t=this.options)!==null&&t!==void 0?t:Array.from(this.children).filter(St.slottedOptionFilter),s=e==null?void 0:e.findIndex(o=>o.hasAttribute("selected")||o.selected||o.value===this.value);if(s!==-1){this.selectedIndex=s;return}this.selectedIndex=0}setProxyOptions(){this.proxy instanceof HTMLSelectElement&&this.options&&(this.proxy.options.length=0,this.options.forEach(t=>{const e=t.proxy||(t instanceof HTMLOptionElement?t.cloneNode():null);e&&this.proxy.options.add(e)}))}keydownHandler(t){super.keydownHandler(t);const e=t.key||t.key.charCodeAt(0);switch(e){case Ke:{t.preventDefault(),this.collapsible&&this.typeAheadExpired&&(this.open=!this.open);break}case me:case be:{t.preventDefault();break}case de:{t.preventDefault(),this.open=!this.open;break}case Je:{this.collapsible&&this.open&&(t.preventDefault(),this.open=!1);break}case Gs:return this.collapsible&&this.open&&(t.preventDefault(),this.open=!1),!0}return!this.open&&this.indexWhenOpened!==this.selectedIndex&&(this.updateValue(!0),this.indexWhenOpened=this.selectedIndex),!(e===Wt||e===Xt)}connectedCallback(){super.connectedCallback(),this.forcedPosition=!!this.positionAttribute,this.addEventListener("contentchange",this.updateDisplayValue)}disconnectedCallback(){this.removeEventListener("contentchange",this.updateDisplayValue),super.disconnectedCallback()}sizeChanged(t,e){super.sizeChanged(t,e),this.proxy&&(this.proxy.size=e)}updateDisplayValue(){this.collapsible&&L.notify(this,"displayValue")}}c([u({attribute:"open",mode:"boolean"})],ye.prototype,"open",void 0),c([ad],ye.prototype,"collapsible",null),c([g],ye.prototype,"control",void 0),c([u({attribute:"position"})],ye.prototype,"positionAttribute",void 0),c([g],ye.prototype,"position",void 0),c([g],ye.prototype,"maxHeight",void 0);class Sn{}c([g],Sn.prototype,"ariaControls",void 0),tt(Sn,Be),tt(ye,Bt,Sn);const Kp=(i,t)=>v`
    <template
        class="${e=>[e.collapsible&&"collapsible",e.collapsible&&e.open&&"open",e.disabled&&"disabled",e.collapsible&&e.position].filter(Boolean).join(" ")}"
        aria-activedescendant="${e=>e.ariaActiveDescendant}"
        aria-controls="${e=>e.ariaControls}"
        aria-disabled="${e=>e.ariaDisabled}"
        aria-expanded="${e=>e.ariaExpanded}"
        aria-haspopup="${e=>e.collapsible?"listbox":null}"
        aria-multiselectable="${e=>e.ariaMultiSelectable}"
        ?open="${e=>e.open}"
        role="combobox"
        tabindex="${e=>e.disabled?null:"0"}"
        @click="${(e,s)=>e.clickHandler(s.event)}"
        @focusin="${(e,s)=>e.focusinHandler(s.event)}"
        @focusout="${(e,s)=>e.focusoutHandler(s.event)}"
        @keydown="${(e,s)=>e.keydownHandler(s.event)}"
        @mousedown="${(e,s)=>e.mousedownHandler(s.event)}"
    >
        ${Q(e=>e.collapsible,v`
                <div
                    class="control"
                    part="control"
                    ?disabled="${e=>e.disabled}"
                    ${j("control")}
                >
                    ${Pt(i,t)}
                    <slot name="button-container">
                        <div class="selected-value" part="selected-value">
                            <slot name="selected-value">${e=>e.displayValue}</slot>
                        </div>
                        <div aria-hidden="true" class="indicator" part="indicator">
                            <slot name="indicator">
                                ${t.indicator||""}
                            </slot>
                        </div>
                    </slot>
                    ${At(i,t)}
                </div>
            `)}
        <div
            class="listbox"
            id="${e=>e.listboxId}"
            part="listbox"
            role="listbox"
            ?disabled="${e=>e.disabled}"
            ?hidden="${e=>e.collapsible?!e.open:!1}"
            ${j("listbox")}
        >
            <slot
                ${Z({filter:St.slottedOptionFilter,flatten:!0,property:"slottedOptions"})}
            ></slot>
        </div>
    </template>
`,tf=(i,t)=>v`
    <template
        class="${e=>e.shape==="circle"?"circle":"rect"}"
        pattern="${e=>e.pattern}"
        ?shimmer="${e=>e.shimmer}"
    >
        ${Q(e=>e.shimmer===!0,v`
                <span class="shimmer"></span>
            `)}
        <object type="image/svg+xml" data="${e=>e.pattern}" role="presentation">
            <img class="pattern" src="${e=>e.pattern}" />
        </object>
        <slot></slot>
    </template>
`;class gs extends E{constructor(){super(...arguments),this.shape="rect"}}c([u],gs.prototype,"fill",void 0),c([u],gs.prototype,"shape",void 0),c([u],gs.prototype,"pattern",void 0),c([u({mode:"boolean"})],gs.prototype,"shimmer",void 0);const ef=(i,t)=>v`
    <template
        aria-disabled="${e=>e.disabled}"
        class="${e=>e.sliderOrientation||rt.horizontal}
            ${e=>e.disabled?"disabled":""}"
    >
        <div ${j("root")} part="root" class="root" style="${e=>e.positionStyle}">
            <div class="container">
                ${Q(e=>!e.hideMark,v`
                        <div class="mark"></div>
                    `)}
                <div class="label">
                    <slot></slot>
                </div>
            </div>
        </div>
    </template>
`;function Fn(i,t,e,s){let o=mn(0,1,(i-t)/(e-t));return s===J.rtl&&(o=1-o),o}const oo={min:0,max:0,direction:J.ltr,orientation:rt.horizontal,disabled:!1};class xe extends E{constructor(){super(...arguments),this.hideMark=!1,this.sliderDirection=J.ltr,this.getSliderConfiguration=()=>{if(!this.isSliderConfig(this.parentNode))this.sliderDirection=oo.direction||J.ltr,this.sliderOrientation=oo.orientation,this.sliderMaxPosition=oo.max,this.sliderMinPosition=oo.min;else{const t=this.parentNode,{min:e,max:s,direction:o,orientation:n,disabled:r}=t;r!==void 0&&(this.disabled=r),this.sliderDirection=o||J.ltr,this.sliderOrientation=n||rt.horizontal,this.sliderMaxPosition=s,this.sliderMinPosition=e}},this.positionAsStyle=()=>{const t=this.sliderDirection?this.sliderDirection:J.ltr,e=Fn(Number(this.position),Number(this.sliderMinPosition),Number(this.sliderMaxPosition));let s=Math.round((1-e)*100),o=Math.round(e*100);return Number.isNaN(o)&&Number.isNaN(s)&&(s=50,o=50),this.sliderOrientation===rt.horizontal?t===J.rtl?`right: ${o}%; left: ${s}%;`:`left: ${o}%; right: ${s}%;`:`top: ${o}%; bottom: ${s}%;`}}positionChanged(){this.positionStyle=this.positionAsStyle()}sliderOrientationChanged(){}connectedCallback(){super.connectedCallback(),this.getSliderConfiguration(),this.positionStyle=this.positionAsStyle(),this.notifier=L.getNotifier(this.parentNode),this.notifier.subscribe(this,"orientation"),this.notifier.subscribe(this,"direction"),this.notifier.subscribe(this,"max"),this.notifier.subscribe(this,"min")}disconnectedCallback(){super.disconnectedCallback(),this.notifier.unsubscribe(this,"orientation"),this.notifier.unsubscribe(this,"direction"),this.notifier.unsubscribe(this,"max"),this.notifier.unsubscribe(this,"min")}handleChange(t,e){switch(e){case"direction":this.sliderDirection=t.direction;break;case"orientation":this.sliderOrientation=t.orientation;break;case"max":this.sliderMaxPosition=t.max;break;case"min":this.sliderMinPosition=t.min;break}this.positionStyle=this.positionAsStyle()}isSliderConfig(t){return t.max!==void 0&&t.min!==void 0}}c([g],xe.prototype,"positionStyle",void 0),c([u],xe.prototype,"position",void 0),c([u({attribute:"hide-mark",mode:"boolean"})],xe.prototype,"hideMark",void 0),c([u({attribute:"disabled",mode:"boolean"})],xe.prototype,"disabled",void 0),c([g],xe.prototype,"sliderOrientation",void 0),c([g],xe.prototype,"sliderMinPosition",void 0),c([g],xe.prototype,"sliderMaxPosition",void 0),c([g],xe.prototype,"sliderDirection",void 0);const sf=(i,t)=>v`
    <template
        role="slider"
        class="${e=>e.readOnly?"readonly":""}
        ${e=>e.orientation||rt.horizontal}"
        tabindex="${e=>e.disabled?null:0}"
        aria-valuetext="${e=>e.valueTextFormatter(e.value)}"
        aria-valuenow="${e=>e.value}"
        aria-valuemin="${e=>e.min}"
        aria-valuemax="${e=>e.max}"
        aria-disabled="${e=>e.disabled?!0:void 0}"
        aria-readonly="${e=>e.readOnly?!0:void 0}"
        aria-orientation="${e=>e.orientation}"
        class="${e=>e.orientation}"
    >
        <div part="positioning-region" class="positioning-region">
            <div ${j("track")} part="track-container" class="track">
                <slot name="track"></slot>
                <div part="track-start" class="track-start" style="${e=>e.position}">
                    <slot name="track-start"></slot>
                </div>
            </div>
            <slot></slot>
            <div
                ${j("thumb")}
                part="thumb-container"
                class="thumb-container"
                style="${e=>e.position}"
            >
                <slot name="thumb">${t.thumb||""}</slot>
            </div>
        </div>
    </template>
`;class of extends E{}class nf extends ve(of){constructor(){super(...arguments),this.proxy=document.createElement("input")}}const rf={singleValue:"single-value"};class Ot extends nf{constructor(){super(...arguments),this.direction=J.ltr,this.isDragging=!1,this.trackWidth=0,this.trackMinWidth=0,this.trackHeight=0,this.trackLeft=0,this.trackMinHeight=0,this.valueTextFormatter=()=>null,this.min=0,this.max=10,this.step=1,this.orientation=rt.horizontal,this.mode=rf.singleValue,this.keypressHandler=t=>{if(!this.readOnly){if(t.key===me)t.preventDefault(),this.value=`${this.min}`;else if(t.key===be)t.preventDefault(),this.value=`${this.max}`;else if(!t.shiftKey)switch(t.key){case Fe:case Xt:t.preventDefault(),this.increment();break;case Se:case Wt:t.preventDefault(),this.decrement();break}}},this.setupTrackConstraints=()=>{const t=this.track.getBoundingClientRect();this.trackWidth=this.track.clientWidth,this.trackMinWidth=this.track.clientLeft,this.trackHeight=t.bottom,this.trackMinHeight=t.top,this.trackLeft=this.getBoundingClientRect().left,this.trackWidth===0&&(this.trackWidth=1)},this.setupListeners=(t=!1)=>{const e=`${t?"remove":"add"}EventListener`;this[e]("keydown",this.keypressHandler),this[e]("mousedown",this.handleMouseDown),this.thumb[e]("mousedown",this.handleThumbMouseDown,{passive:!0}),this.thumb[e]("touchstart",this.handleThumbMouseDown,{passive:!0}),t&&(this.handleMouseDown(null),this.handleThumbMouseDown(null))},this.initialValue="",this.handleThumbMouseDown=t=>{if(t){if(this.readOnly||this.disabled||t.defaultPrevented)return;t.target.focus()}const e=`${t!==null?"add":"remove"}EventListener`;window[e]("mouseup",this.handleWindowMouseUp),window[e]("mousemove",this.handleMouseMove,{passive:!0}),window[e]("touchmove",this.handleMouseMove,{passive:!0}),window[e]("touchend",this.handleWindowMouseUp),this.isDragging=t!==null},this.handleMouseMove=t=>{if(this.readOnly||this.disabled||t.defaultPrevented)return;const e=window.TouchEvent&&t instanceof TouchEvent?t.touches[0]:t,s=this.orientation===rt.horizontal?e.pageX-document.documentElement.scrollLeft-this.trackLeft:e.pageY-document.documentElement.scrollTop;this.value=`${this.calculateNewValue(s)}`},this.calculateNewValue=t=>{const e=Fn(t,this.orientation===rt.horizontal?this.trackMinWidth:this.trackMinHeight,this.orientation===rt.horizontal?this.trackWidth:this.trackHeight,this.direction),s=(this.max-this.min)*e+this.min;return this.convertToConstrainedValue(s)},this.handleWindowMouseUp=t=>{this.stopDragging()},this.stopDragging=()=>{this.isDragging=!1,this.handleMouseDown(null),this.handleThumbMouseDown(null)},this.handleMouseDown=t=>{const e=`${t!==null?"add":"remove"}EventListener`;if((t===null||!this.disabled&&!this.readOnly)&&(window[e]("mouseup",this.handleWindowMouseUp),window.document[e]("mouseleave",this.handleWindowMouseUp),window[e]("mousemove",this.handleMouseMove),t)){t.preventDefault(),this.setupTrackConstraints(),t.target.focus();const s=this.orientation===rt.horizontal?t.pageX-document.documentElement.scrollLeft-this.trackLeft:t.pageY-document.documentElement.scrollTop;this.value=`${this.calculateNewValue(s)}`}},this.convertToConstrainedValue=t=>{isNaN(t)&&(t=this.min);let e=t-this.min;const s=Math.round(e/this.step),o=e-s*(this.stepMultiplier*this.step)/this.stepMultiplier;return e=o>=Number(this.step)/2?e-o+Number(this.step):e-o,e+this.min}}readOnlyChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.readOnly=this.readOnly)}get valueAsNumber(){return parseFloat(super.value)}set valueAsNumber(t){this.value=t.toString()}valueChanged(t,e){super.valueChanged(t,e),this.$fastController.isConnected&&this.setThumbPositionForOrientation(this.direction),this.$emit("change")}minChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.min=`${this.min}`),this.validate()}maxChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.max=`${this.max}`),this.validate()}stepChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.step=`${this.step}`),this.updateStepMultiplier(),this.validate()}orientationChanged(){this.$fastController.isConnected&&this.setThumbPositionForOrientation(this.direction)}connectedCallback(){super.connectedCallback(),this.proxy.setAttribute("type","range"),this.direction=ei(this),this.updateStepMultiplier(),this.setupTrackConstraints(),this.setupListeners(),this.setupDefaultValue(),this.setThumbPositionForOrientation(this.direction)}disconnectedCallback(){this.setupListeners(!0)}increment(){const t=this.direction!==J.rtl&&this.orientation!==rt.vertical?Number(this.value)+Number(this.step):Number(this.value)-Number(this.step),e=this.convertToConstrainedValue(t),s=e<Number(this.max)?`${e}`:`${this.max}`;this.value=s}decrement(){const t=this.direction!==J.rtl&&this.orientation!==rt.vertical?Number(this.value)-Number(this.step):Number(this.value)+Number(this.step),e=this.convertToConstrainedValue(t),s=e>Number(this.min)?`${e}`:`${this.min}`;this.value=s}setThumbPositionForOrientation(t){const s=(1-Fn(Number(this.value),Number(this.min),Number(this.max),t))*100;this.orientation===rt.horizontal?this.position=this.isDragging?`right: ${s}%; transition: none;`:`right: ${s}%; transition: all 0.2s ease;`:this.position=this.isDragging?`bottom: ${s}%; transition: none;`:`bottom: ${s}%; transition: all 0.2s ease;`}updateStepMultiplier(){const t=this.step+"",e=this.step%1?t.length-t.indexOf(".")-1:0;this.stepMultiplier=Math.pow(10,e)}get midpoint(){return`${this.convertToConstrainedValue((this.max+this.min)/2)}`}setupDefaultValue(){if(typeof this.value=="string")if(this.value.length===0)this.initialValue=this.midpoint;else{const t=parseFloat(this.value);!Number.isNaN(t)&&(t<this.min||t>this.max)&&(this.value=this.midpoint)}}}c([u({attribute:"readonly",mode:"boolean"})],Ot.prototype,"readOnly",void 0),c([g],Ot.prototype,"direction",void 0),c([g],Ot.prototype,"isDragging",void 0),c([g],Ot.prototype,"position",void 0),c([g],Ot.prototype,"trackWidth",void 0),c([g],Ot.prototype,"trackMinWidth",void 0),c([g],Ot.prototype,"trackHeight",void 0),c([g],Ot.prototype,"trackLeft",void 0),c([g],Ot.prototype,"trackMinHeight",void 0),c([g],Ot.prototype,"valueTextFormatter",void 0),c([u({converter:C})],Ot.prototype,"min",void 0),c([u({converter:C})],Ot.prototype,"max",void 0),c([u({converter:C})],Ot.prototype,"step",void 0),c([u],Ot.prototype,"orientation",void 0),c([u],Ot.prototype,"mode",void 0);const af=(i,t)=>v`
    <template
        role="switch"
        aria-checked="${e=>e.checked}"
        aria-disabled="${e=>e.disabled}"
        aria-readonly="${e=>e.readOnly}"
        tabindex="${e=>e.disabled?null:0}"
        @keypress="${(e,s)=>e.keypressHandler(s.event)}"
        @click="${(e,s)=>e.clickHandler(s.event)}"
        class="${e=>e.checked?"checked":""}"
    >
        <label
            part="label"
            class="${e=>e.defaultSlottedNodes&&e.defaultSlottedNodes.length?"label":"label label__hidden"}"
        >
            <slot ${Z("defaultSlottedNodes")}></slot>
        </label>
        <div part="switch" class="switch">
            <slot name="switch">${t.switch||""}</slot>
        </div>
        <span class="status-message" part="status-message">
            <span class="checked-message" part="checked-message">
                <slot name="checked-message"></slot>
            </span>
            <span class="unchecked-message" part="unchecked-message">
                <slot name="unchecked-message"></slot>
            </span>
        </span>
    </template>
`;class lf extends E{}class cf extends yn(lf){constructor(){super(...arguments),this.proxy=document.createElement("input")}}class On extends cf{constructor(){super(),this.initialValue="on",this.keypressHandler=t=>{if(!this.readOnly)switch(t.key){case de:case Ke:this.checked=!this.checked;break}},this.clickHandler=t=>{!this.disabled&&!this.readOnly&&(this.checked=!this.checked)},this.proxy.setAttribute("type","checkbox")}readOnlyChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.readOnly=this.readOnly),this.readOnly?this.classList.add("readonly"):this.classList.remove("readonly")}checkedChanged(t,e){super.checkedChanged(t,e),this.checked?this.classList.add("checked"):this.classList.remove("checked")}}c([u({attribute:"readonly",mode:"boolean"})],On.prototype,"readOnly",void 0),c([g],On.prototype,"defaultSlottedNodes",void 0);const hf=(i,t)=>v`
    <template slot="tabpanel" role="tabpanel">
        <slot></slot>
    </template>
`;class df extends E{}const uf=(i,t)=>v`
    <template slot="tab" role="tab" aria-disabled="${e=>e.disabled}">
        <slot></slot>
    </template>
`;class gl extends E{}c([u({mode:"boolean"})],gl.prototype,"disabled",void 0);const pf=(i,t)=>v`
    <template class="${e=>e.orientation}">
        ${Pt(i,t)}
        <div class="tablist" part="tablist" role="tablist">
            <slot class="tab" name="tab" part="tab" ${Z("tabs")}></slot>

            ${Q(e=>e.showActiveIndicator,v`
                    <div
                        ${j("activeIndicatorRef")}
                        class="activeIndicator"
                        part="activeIndicator"
                    ></div>
                `)}
        </div>
        ${At(i,t)}
        <div class="tabpanel" part="tabpanel">
            <slot name="tabpanel" ${Z("tabpanels")}></slot>
        </div>
    </template>
`,ml={vertical:"vertical",horizontal:"horizontal"};class Le extends E{constructor(){super(...arguments),this.orientation=ml.horizontal,this.activeindicator=!0,this.showActiveIndicator=!0,this.prevActiveTabIndex=0,this.activeTabIndex=0,this.ticking=!1,this.change=()=>{this.$emit("change",this.activetab)},this.isDisabledElement=t=>t.getAttribute("aria-disabled")==="true",this.isFocusableElement=t=>!this.isDisabledElement(t),this.setTabs=()=>{const t="gridColumn",e="gridRow",s=this.isHorizontal()?t:e;this.activeTabIndex=this.getActiveIndex(),this.showActiveIndicator=!1,this.tabs.forEach((o,n)=>{if(o.slot==="tab"){const r=this.activeTabIndex===n&&this.isFocusableElement(o);this.activeindicator&&this.isFocusableElement(o)&&(this.showActiveIndicator=!0);const a=this.tabIds[n],l=this.tabpanelIds[n];o.setAttribute("id",a),o.setAttribute("aria-selected",r?"true":"false"),o.setAttribute("aria-controls",l),o.addEventListener("click",this.handleTabClick),o.addEventListener("keydown",this.handleTabKeyDown),o.setAttribute("tabindex",r?"0":"-1"),r&&(this.activetab=o)}o.style[t]="",o.style[e]="",o.style[s]=`${n+1}`,this.isHorizontal()?o.classList.remove("vertical"):o.classList.add("vertical")})},this.setTabPanels=()=>{this.tabpanels.forEach((t,e)=>{const s=this.tabIds[e],o=this.tabpanelIds[e];t.setAttribute("id",o),t.setAttribute("aria-labelledby",s),this.activeTabIndex!==e?t.setAttribute("hidden",""):t.removeAttribute("hidden")})},this.handleTabClick=t=>{const e=t.currentTarget;e.nodeType===1&&this.isFocusableElement(e)&&(this.prevActiveTabIndex=this.activeTabIndex,this.activeTabIndex=this.tabs.indexOf(e),this.setComponent())},this.handleTabKeyDown=t=>{if(this.isHorizontal())switch(t.key){case Se:t.preventDefault(),this.adjustBackward(t);break;case Fe:t.preventDefault(),this.adjustForward(t);break}else switch(t.key){case Xt:t.preventDefault(),this.adjustBackward(t);break;case Wt:t.preventDefault(),this.adjustForward(t);break}switch(t.key){case me:t.preventDefault(),this.adjust(-this.activeTabIndex);break;case be:t.preventDefault(),this.adjust(this.tabs.length-this.activeTabIndex-1);break}},this.adjustForward=t=>{const e=this.tabs;let s=0;for(s=this.activetab?e.indexOf(this.activetab)+1:1,s===e.length&&(s=0);s<e.length&&e.length>1;)if(this.isFocusableElement(e[s])){this.moveToTabByIndex(e,s);break}else{if(this.activetab&&s===e.indexOf(this.activetab))break;s+1>=e.length?s=0:s+=1}},this.adjustBackward=t=>{const e=this.tabs;let s=0;for(s=this.activetab?e.indexOf(this.activetab)-1:0,s=s<0?e.length-1:s;s>=0&&e.length>1;)if(this.isFocusableElement(e[s])){this.moveToTabByIndex(e,s);break}else s-1<0?s=e.length-1:s-=1},this.moveToTabByIndex=(t,e)=>{const s=t[e];this.activetab=s,this.prevActiveTabIndex=this.activeTabIndex,this.activeTabIndex=e,s.focus(),this.setComponent()}}orientationChanged(){this.$fastController.isConnected&&(this.setTabs(),this.setTabPanels(),this.handleActiveIndicatorPosition())}activeidChanged(t,e){this.$fastController.isConnected&&this.tabs.length<=this.tabpanels.length&&(this.prevActiveTabIndex=this.tabs.findIndex(s=>s.id===t),this.setTabs(),this.setTabPanels(),this.handleActiveIndicatorPosition())}tabsChanged(){this.$fastController.isConnected&&this.tabs.length<=this.tabpanels.length&&(this.tabIds=this.getTabIds(),this.tabpanelIds=this.getTabPanelIds(),this.setTabs(),this.setTabPanels(),this.handleActiveIndicatorPosition())}tabpanelsChanged(){this.$fastController.isConnected&&this.tabpanels.length<=this.tabs.length&&(this.tabIds=this.getTabIds(),this.tabpanelIds=this.getTabPanelIds(),this.setTabs(),this.setTabPanels(),this.handleActiveIndicatorPosition())}getActiveIndex(){return this.activeid!==void 0?this.tabIds.indexOf(this.activeid)===-1?0:this.tabIds.indexOf(this.activeid):0}getTabIds(){return this.tabs.map(t=>{var e;return(e=t.getAttribute("id"))!==null&&e!==void 0?e:`tab-${ti()}`})}getTabPanelIds(){return this.tabpanels.map(t=>{var e;return(e=t.getAttribute("id"))!==null&&e!==void 0?e:`panel-${ti()}`})}setComponent(){this.activeTabIndex!==this.prevActiveTabIndex&&(this.activeid=this.tabIds[this.activeTabIndex],this.focusTab(),this.change())}isHorizontal(){return this.orientation===ml.horizontal}handleActiveIndicatorPosition(){this.showActiveIndicator&&this.activeindicator&&this.activeTabIndex!==this.prevActiveTabIndex&&(this.ticking?this.ticking=!1:(this.ticking=!0,this.animateActiveIndicator()))}animateActiveIndicator(){this.ticking=!0;const t=this.isHorizontal()?"gridColumn":"gridRow",e=this.isHorizontal()?"translateX":"translateY",s=this.isHorizontal()?"offsetLeft":"offsetTop",o=this.activeIndicatorRef[s];this.activeIndicatorRef.style[t]=`${this.activeTabIndex+1}`;const n=this.activeIndicatorRef[s];this.activeIndicatorRef.style[t]=`${this.prevActiveTabIndex+1}`;const r=n-o;this.activeIndicatorRef.style.transform=`${e}(${r}px)`,this.activeIndicatorRef.classList.add("activeIndicatorTransition"),this.activeIndicatorRef.addEventListener("transitionend",()=>{this.ticking=!1,this.activeIndicatorRef.style[t]=`${this.activeTabIndex+1}`,this.activeIndicatorRef.style.transform=`${e}(0px)`,this.activeIndicatorRef.classList.remove("activeIndicatorTransition")})}adjust(t){this.prevActiveTabIndex=this.activeTabIndex,this.activeTabIndex=Ya(0,this.tabs.length-1,this.activeTabIndex+t),this.setComponent()}focusTab(){this.tabs[this.activeTabIndex].focus()}connectedCallback(){super.connectedCallback(),this.tabIds=this.getTabIds(),this.tabpanelIds=this.getTabPanelIds(),this.activeTabIndex=this.getActiveIndex()}}c([u],Le.prototype,"orientation",void 0),c([u],Le.prototype,"activeid",void 0),c([g],Le.prototype,"tabs",void 0),c([g],Le.prototype,"tabpanels",void 0),c([u({mode:"boolean"})],Le.prototype,"activeindicator",void 0),c([g],Le.prototype,"activeIndicatorRef",void 0),c([g],Le.prototype,"showActiveIndicator",void 0),tt(Le,Bt);class ff extends E{}class gf extends ve(ff){constructor(){super(...arguments),this.proxy=document.createElement("textarea")}}const bl={none:"none",both:"both",horizontal:"horizontal",vertical:"vertical"};class Rt extends gf{constructor(){super(...arguments),this.resize=bl.none,this.cols=20,this.handleTextInput=()=>{this.value=this.control.value}}readOnlyChanged(){this.proxy instanceof HTMLTextAreaElement&&(this.proxy.readOnly=this.readOnly)}autofocusChanged(){this.proxy instanceof HTMLTextAreaElement&&(this.proxy.autofocus=this.autofocus)}listChanged(){this.proxy instanceof HTMLTextAreaElement&&this.proxy.setAttribute("list",this.list)}maxlengthChanged(){this.proxy instanceof HTMLTextAreaElement&&(this.proxy.maxLength=this.maxlength)}minlengthChanged(){this.proxy instanceof HTMLTextAreaElement&&(this.proxy.minLength=this.minlength)}spellcheckChanged(){this.proxy instanceof HTMLTextAreaElement&&(this.proxy.spellcheck=this.spellcheck)}select(){this.control.select(),this.$emit("select")}handleChange(){this.$emit("change")}validate(){super.validate(this.control)}}c([u({mode:"boolean"})],Rt.prototype,"readOnly",void 0),c([u],Rt.prototype,"resize",void 0),c([u({mode:"boolean"})],Rt.prototype,"autofocus",void 0),c([u({attribute:"form"})],Rt.prototype,"formId",void 0),c([u],Rt.prototype,"list",void 0),c([u({converter:C})],Rt.prototype,"maxlength",void 0),c([u({converter:C})],Rt.prototype,"minlength",void 0),c([u],Rt.prototype,"name",void 0),c([u],Rt.prototype,"placeholder",void 0),c([u({converter:C,mode:"fromView"})],Rt.prototype,"cols",void 0),c([u({converter:C,mode:"fromView"})],Rt.prototype,"rows",void 0),c([u({mode:"boolean"})],Rt.prototype,"spellcheck",void 0),c([g],Rt.prototype,"defaultSlottedNodes",void 0),tt(Rt,io);const mf=(i,t)=>v`
    <template
        class="
            ${e=>e.readOnly?"readonly":""}
            ${e=>e.resize!==bl.none?`resize-${e.resize}`:""}"
    >
        <label
            part="label"
            for="control"
            class="${e=>e.defaultSlottedNodes&&e.defaultSlottedNodes.length?"label":"label label__hidden"}"
        >
            <slot ${Z("defaultSlottedNodes")}></slot>
        </label>
        <textarea
            part="control"
            class="control"
            id="control"
            ?autofocus="${e=>e.autofocus}"
            cols="${e=>e.cols}"
            ?disabled="${e=>e.disabled}"
            form="${e=>e.form}"
            list="${e=>e.list}"
            maxlength="${e=>e.maxlength}"
            minlength="${e=>e.minlength}"
            name="${e=>e.name}"
            placeholder="${e=>e.placeholder}"
            ?readonly="${e=>e.readOnly}"
            ?required="${e=>e.required}"
            rows="${e=>e.rows}"
            ?spellcheck="${e=>e.spellcheck}"
            :value="${e=>e.value}"
            aria-atomic="${e=>e.ariaAtomic}"
            aria-busy="${e=>e.ariaBusy}"
            aria-controls="${e=>e.ariaControls}"
            aria-current="${e=>e.ariaCurrent}"
            aria-describedby="${e=>e.ariaDescribedby}"
            aria-details="${e=>e.ariaDetails}"
            aria-disabled="${e=>e.ariaDisabled}"
            aria-errormessage="${e=>e.ariaErrormessage}"
            aria-flowto="${e=>e.ariaFlowto}"
            aria-haspopup="${e=>e.ariaHaspopup}"
            aria-hidden="${e=>e.ariaHidden}"
            aria-invalid="${e=>e.ariaInvalid}"
            aria-keyshortcuts="${e=>e.ariaKeyshortcuts}"
            aria-label="${e=>e.ariaLabel}"
            aria-labelledby="${e=>e.ariaLabelledby}"
            aria-live="${e=>e.ariaLive}"
            aria-owns="${e=>e.ariaOwns}"
            aria-relevant="${e=>e.ariaRelevant}"
            aria-roledescription="${e=>e.ariaRoledescription}"
            @input="${(e,s)=>e.handleTextInput()}"
            @change="${e=>e.handleChange()}"
            ${j("control")}
        ></textarea>
    </template>
`,bf=(i,t)=>v`
    <template
        class="
            ${e=>e.readOnly?"readonly":""}
        "
    >
        <label
            part="label"
            for="control"
            class="${e=>e.defaultSlottedNodes&&e.defaultSlottedNodes.length?"label":"label label__hidden"}"
        >
            <slot
                ${Z({property:"defaultSlottedNodes",filter:pl})}
            ></slot>
        </label>
        <div class="root" part="root">
            ${Pt(i,t)}
            <input
                class="control"
                part="control"
                id="control"
                @input="${e=>e.handleTextInput()}"
                @change="${e=>e.handleChange()}"
                ?autofocus="${e=>e.autofocus}"
                ?disabled="${e=>e.disabled}"
                list="${e=>e.list}"
                maxlength="${e=>e.maxlength}"
                minlength="${e=>e.minlength}"
                pattern="${e=>e.pattern}"
                placeholder="${e=>e.placeholder}"
                ?readonly="${e=>e.readOnly}"
                ?required="${e=>e.required}"
                size="${e=>e.size}"
                ?spellcheck="${e=>e.spellcheck}"
                :value="${e=>e.value}"
                type="${e=>e.type}"
                aria-atomic="${e=>e.ariaAtomic}"
                aria-busy="${e=>e.ariaBusy}"
                aria-controls="${e=>e.ariaControls}"
                aria-current="${e=>e.ariaCurrent}"
                aria-describedby="${e=>e.ariaDescribedby}"
                aria-details="${e=>e.ariaDetails}"
                aria-disabled="${e=>e.ariaDisabled}"
                aria-errormessage="${e=>e.ariaErrormessage}"
                aria-flowto="${e=>e.ariaFlowto}"
                aria-haspopup="${e=>e.ariaHaspopup}"
                aria-hidden="${e=>e.ariaHidden}"
                aria-invalid="${e=>e.ariaInvalid}"
                aria-keyshortcuts="${e=>e.ariaKeyshortcuts}"
                aria-label="${e=>e.ariaLabel}"
                aria-labelledby="${e=>e.ariaLabelledby}"
                aria-live="${e=>e.ariaLive}"
                aria-owns="${e=>e.ariaOwns}"
                aria-relevant="${e=>e.ariaRelevant}"
                aria-roledescription="${e=>e.ariaRoledescription}"
                ${j("control")}
            />
            ${At(i,t)}
        </div>
    </template>
`,vf=(i,t)=>v`
    <template
        aria-label="${e=>e.ariaLabel}"
        aria-labelledby="${e=>e.ariaLabelledby}"
        aria-orientation="${e=>e.orientation}"
        orientation="${e=>e.orientation}"
        role="toolbar"
        @click="${(e,s)=>e.clickHandler(s.event)}"
        @focusin="${(e,s)=>e.focusinHandler(s.event)}"
        @keydown="${(e,s)=>e.keydownHandler(s.event)}"
        ${Ns({property:"childItems",attributeFilter:["disabled","hidden"],filter:Ie(),subtree:!0})}
    >
        <slot name="label"></slot>
        <div class="positioning-region" part="positioning-region">
            ${Pt(i,t)}
            <slot
                ${Z({filter:Ie(),property:"slottedItems"})}
            ></slot>
            ${At(i,t)}
        </div>
    </template>
`,vl=Object.freeze({[Si.ArrowUp]:{[rt.vertical]:-1},[Si.ArrowDown]:{[rt.vertical]:1},[Si.ArrowLeft]:{[rt.horizontal]:{[J.ltr]:-1,[J.rtl]:1}},[Si.ArrowRight]:{[rt.horizontal]:{[J.ltr]:1,[J.rtl]:-1}}});class fe extends E{constructor(){super(...arguments),this._activeIndex=0,this.direction=J.ltr,this.orientation=rt.horizontal}get activeIndex(){return L.track(this,"activeIndex"),this._activeIndex}set activeIndex(t){this.$fastController.isConnected&&(this._activeIndex=mn(0,this.focusableElements.length-1,t),L.notify(this,"activeIndex"))}slottedItemsChanged(){this.$fastController.isConnected&&this.reduceFocusableElements()}clickHandler(t){var e;const s=(e=this.focusableElements)===null||e===void 0?void 0:e.indexOf(t.target);return s>-1&&this.activeIndex!==s&&this.setFocusedElement(s),!0}childItemsChanged(t,e){this.$fastController.isConnected&&this.reduceFocusableElements()}connectedCallback(){super.connectedCallback(),this.direction=ei(this)}focusinHandler(t){const e=t.relatedTarget;!e||this.contains(e)||this.setFocusedElement()}getDirectionalIncrementer(t){var e,s,o,n,r;return(r=(o=(s=(e=vl[t])===null||e===void 0?void 0:e[this.orientation])===null||s===void 0?void 0:s[this.direction])!==null&&o!==void 0?o:(n=vl[t])===null||n===void 0?void 0:n[this.orientation])!==null&&r!==void 0?r:0}keydownHandler(t){const e=t.key;if(!(e in Si)||t.defaultPrevented||t.shiftKey)return!0;const s=this.getDirectionalIncrementer(e);if(!s)return!t.target.closest("[role=radiogroup]");const o=this.activeIndex+s;return this.focusableElements[o]&&t.preventDefault(),this.setFocusedElement(o),!0}get allSlottedItems(){return[...this.start.assignedElements(),...this.slottedItems,...this.end.assignedElements()]}reduceFocusableElements(){var t;const e=(t=this.focusableElements)===null||t===void 0?void 0:t[this.activeIndex];this.focusableElements=this.allSlottedItems.reduce(fe.reduceFocusableItems,[]);const s=this.focusableElements.indexOf(e);this.activeIndex=Math.max(0,s),this.setFocusableElements()}setFocusedElement(t=this.activeIndex){var e;this.activeIndex=t,this.setFocusableElements(),(e=this.focusableElements[this.activeIndex])===null||e===void 0||e.focus()}static reduceFocusableItems(t,e){var s,o,n,r;const a=e.getAttribute("role")==="radio",l=(o=(s=e.$fastController)===null||s===void 0?void 0:s.definition.shadowOptions)===null||o===void 0?void 0:o.delegatesFocus,h=Array.from((r=(n=e.shadowRoot)===null||n===void 0?void 0:n.querySelectorAll("*"))!==null&&r!==void 0?r:[]).some(p=>ea(p));return!e.hasAttribute("disabled")&&!e.hasAttribute("hidden")&&(ea(e)||a||l||h)?(t.push(e),t):e.childElementCount?t.concat(Array.from(e.children).reduce(fe.reduceFocusableItems,[])):t}setFocusableElements(){this.$fastController.isConnected&&this.focusableElements.length>0&&this.focusableElements.forEach((t,e)=>{t.tabIndex=this.activeIndex===e?0:-1})}}c([g],fe.prototype,"direction",void 0),c([u],fe.prototype,"orientation",void 0),c([g],fe.prototype,"slottedItems",void 0),c([g],fe.prototype,"slottedLabel",void 0),c([g],fe.prototype,"childItems",void 0);class no{}c([u({attribute:"aria-labelledby"})],no.prototype,"ariaLabelledby",void 0),c([u({attribute:"aria-label"})],no.prototype,"ariaLabel",void 0),tt(no,K),tt(fe,Bt,no);const yf=(i,t)=>v`
        ${Q(e=>e.tooltipVisible,v`
            <${i.tagFor(q)}
                fixed-placement="true"
                auto-update-mode="${e=>e.autoUpdateMode}"
                vertical-positioning-mode="${e=>e.verticalPositioningMode}"
                vertical-default-position="${e=>e.verticalDefaultPosition}"
                vertical-inset="${e=>e.verticalInset}"
                vertical-scaling="${e=>e.verticalScaling}"
                horizontal-positioning-mode="${e=>e.horizontalPositioningMode}"
                horizontal-default-position="${e=>e.horizontalDefaultPosition}"
                horizontal-scaling="${e=>e.horizontalScaling}"
                horizontal-inset="${e=>e.horizontalInset}"
                vertical-viewport-lock="${e=>e.horizontalViewportLock}"
                horizontal-viewport-lock="${e=>e.verticalViewportLock}"
                dir="${e=>e.currentDirection}"
                ${j("region")}
            >
                <div class="tooltip" part="tooltip" role="tooltip">
                    <slot></slot>
                </div>
            </${i.tagFor(q)}>
        `)}
    `,jt={top:"top",right:"right",bottom:"bottom",left:"left",start:"start",end:"end",topLeft:"top-left",topRight:"top-right",bottomLeft:"bottom-left",bottomRight:"bottom-right",topStart:"top-start",topEnd:"top-end",bottomStart:"bottom-start",bottomEnd:"bottom-end"};class pt extends E{constructor(){super(...arguments),this.anchor="",this.delay=300,this.autoUpdateMode="anchor",this.anchorElement=null,this.viewportElement=null,this.verticalPositioningMode="dynamic",this.horizontalPositioningMode="dynamic",this.horizontalInset="false",this.verticalInset="false",this.horizontalScaling="content",this.verticalScaling="content",this.verticalDefaultPosition=void 0,this.horizontalDefaultPosition=void 0,this.tooltipVisible=!1,this.currentDirection=J.ltr,this.showDelayTimer=null,this.hideDelayTimer=null,this.isAnchorHoveredFocused=!1,this.isRegionHovered=!1,this.handlePositionChange=t=>{this.classList.toggle("top",this.region.verticalPosition==="start"),this.classList.toggle("bottom",this.region.verticalPosition==="end"),this.classList.toggle("inset-top",this.region.verticalPosition==="insetStart"),this.classList.toggle("inset-bottom",this.region.verticalPosition==="insetEnd"),this.classList.toggle("center-vertical",this.region.verticalPosition==="center"),this.classList.toggle("left",this.region.horizontalPosition==="start"),this.classList.toggle("right",this.region.horizontalPosition==="end"),this.classList.toggle("inset-left",this.region.horizontalPosition==="insetStart"),this.classList.toggle("inset-right",this.region.horizontalPosition==="insetEnd"),this.classList.toggle("center-horizontal",this.region.horizontalPosition==="center")},this.handleRegionMouseOver=t=>{this.isRegionHovered=!0},this.handleRegionMouseOut=t=>{this.isRegionHovered=!1,this.startHideDelayTimer()},this.handleAnchorMouseOver=t=>{if(this.tooltipVisible){this.isAnchorHoveredFocused=!0;return}this.startShowDelayTimer()},this.handleAnchorMouseOut=t=>{this.isAnchorHoveredFocused=!1,this.clearShowDelayTimer(),this.startHideDelayTimer()},this.handleAnchorFocusIn=t=>{this.startShowDelayTimer()},this.handleAnchorFocusOut=t=>{this.isAnchorHoveredFocused=!1,this.clearShowDelayTimer(),this.startHideDelayTimer()},this.startHideDelayTimer=()=>{this.clearHideDelayTimer(),this.tooltipVisible&&(this.hideDelayTimer=window.setTimeout(()=>{this.updateTooltipVisibility()},60))},this.clearHideDelayTimer=()=>{this.hideDelayTimer!==null&&(clearTimeout(this.hideDelayTimer),this.hideDelayTimer=null)},this.startShowDelayTimer=()=>{if(!this.isAnchorHoveredFocused){if(this.delay>1){this.showDelayTimer===null&&(this.showDelayTimer=window.setTimeout(()=>{this.startHover()},this.delay));return}this.startHover()}},this.startHover=()=>{this.isAnchorHoveredFocused=!0,this.updateTooltipVisibility()},this.clearShowDelayTimer=()=>{this.showDelayTimer!==null&&(clearTimeout(this.showDelayTimer),this.showDelayTimer=null)},this.getAnchor=()=>{const t=this.getRootNode();return t instanceof ShadowRoot?t.getElementById(this.anchor):document.getElementById(this.anchor)},this.handleDocumentKeydown=t=>{if(!t.defaultPrevented&&this.tooltipVisible)switch(t.key){case Je:this.isAnchorHoveredFocused=!1,this.updateTooltipVisibility(),this.$emit("dismiss");break}},this.updateTooltipVisibility=()=>{if(this.visible===!1)this.hideTooltip();else if(this.visible===!0){this.showTooltip();return}else{if(this.isAnchorHoveredFocused||this.isRegionHovered){this.showTooltip();return}this.hideTooltip()}},this.showTooltip=()=>{this.tooltipVisible||(this.currentDirection=ei(this),this.tooltipVisible=!0,document.addEventListener("keydown",this.handleDocumentKeydown),O.queueUpdate(this.setRegionProps))},this.hideTooltip=()=>{this.tooltipVisible&&(this.clearHideDelayTimer(),this.region!==null&&this.region!==void 0&&(this.region.removeEventListener("positionchange",this.handlePositionChange),this.region.viewportElement=null,this.region.anchorElement=null,this.region.removeEventListener("mouseover",this.handleRegionMouseOver),this.region.removeEventListener("mouseout",this.handleRegionMouseOut)),document.removeEventListener("keydown",this.handleDocumentKeydown),this.tooltipVisible=!1)},this.setRegionProps=()=>{this.tooltipVisible&&(this.region.viewportElement=this.viewportElement,this.region.anchorElement=this.anchorElement,this.region.addEventListener("positionchange",this.handlePositionChange),this.region.addEventListener("mouseover",this.handleRegionMouseOver,{passive:!0}),this.region.addEventListener("mouseout",this.handleRegionMouseOut,{passive:!0}))}}visibleChanged(){this.$fastController.isConnected&&(this.updateTooltipVisibility(),this.updateLayout())}anchorChanged(){this.$fastController.isConnected&&(this.anchorElement=this.getAnchor())}positionChanged(){this.$fastController.isConnected&&this.updateLayout()}anchorElementChanged(t){if(this.$fastController.isConnected){if(t!=null&&(t.removeEventListener("mouseover",this.handleAnchorMouseOver),t.removeEventListener("mouseout",this.handleAnchorMouseOut),t.removeEventListener("focusin",this.handleAnchorFocusIn),t.removeEventListener("focusout",this.handleAnchorFocusOut)),this.anchorElement!==null&&this.anchorElement!==void 0){this.anchorElement.addEventListener("mouseover",this.handleAnchorMouseOver,{passive:!0}),this.anchorElement.addEventListener("mouseout",this.handleAnchorMouseOut,{passive:!0}),this.anchorElement.addEventListener("focusin",this.handleAnchorFocusIn,{passive:!0}),this.anchorElement.addEventListener("focusout",this.handleAnchorFocusOut,{passive:!0});const e=this.anchorElement.id;this.anchorElement.parentElement!==null&&this.anchorElement.parentElement.querySelectorAll(":hover").forEach(s=>{s.id===e&&this.startShowDelayTimer()})}this.region!==null&&this.region!==void 0&&this.tooltipVisible&&(this.region.anchorElement=this.anchorElement),this.updateLayout()}}viewportElementChanged(){this.region!==null&&this.region!==void 0&&(this.region.viewportElement=this.viewportElement),this.updateLayout()}connectedCallback(){super.connectedCallback(),this.anchorElement=this.getAnchor(),this.updateTooltipVisibility()}disconnectedCallback(){this.hideTooltip(),this.clearShowDelayTimer(),this.clearHideDelayTimer(),super.disconnectedCallback()}updateLayout(){switch(this.verticalPositioningMode="locktodefault",this.horizontalPositioningMode="locktodefault",this.position){case jt.top:case jt.bottom:this.verticalDefaultPosition=this.position,this.horizontalDefaultPosition="center";break;case jt.right:case jt.left:case jt.start:case jt.end:this.verticalDefaultPosition="center",this.horizontalDefaultPosition=this.position;break;case jt.topLeft:this.verticalDefaultPosition="top",this.horizontalDefaultPosition="left";break;case jt.topRight:this.verticalDefaultPosition="top",this.horizontalDefaultPosition="right";break;case jt.bottomLeft:this.verticalDefaultPosition="bottom",this.horizontalDefaultPosition="left";break;case jt.bottomRight:this.verticalDefaultPosition="bottom",this.horizontalDefaultPosition="right";break;case jt.topStart:this.verticalDefaultPosition="top",this.horizontalDefaultPosition="start";break;case jt.topEnd:this.verticalDefaultPosition="top",this.horizontalDefaultPosition="end";break;case jt.bottomStart:this.verticalDefaultPosition="bottom",this.horizontalDefaultPosition="start";break;case jt.bottomEnd:this.verticalDefaultPosition="bottom",this.horizontalDefaultPosition="end";break;default:this.verticalPositioningMode="dynamic",this.horizontalPositioningMode="dynamic",this.verticalDefaultPosition=void 0,this.horizontalDefaultPosition="center";break}}}c([u({mode:"boolean"})],pt.prototype,"visible",void 0),c([u],pt.prototype,"anchor",void 0),c([u],pt.prototype,"delay",void 0),c([u],pt.prototype,"position",void 0),c([u({attribute:"auto-update-mode"})],pt.prototype,"autoUpdateMode",void 0),c([u({attribute:"horizontal-viewport-lock"})],pt.prototype,"horizontalViewportLock",void 0),c([u({attribute:"vertical-viewport-lock"})],pt.prototype,"verticalViewportLock",void 0),c([g],pt.prototype,"anchorElement",void 0),c([g],pt.prototype,"viewportElement",void 0),c([g],pt.prototype,"verticalPositioningMode",void 0),c([g],pt.prototype,"horizontalPositioningMode",void 0),c([g],pt.prototype,"horizontalInset",void 0),c([g],pt.prototype,"verticalInset",void 0),c([g],pt.prototype,"horizontalScaling",void 0),c([g],pt.prototype,"verticalScaling",void 0),c([g],pt.prototype,"verticalDefaultPosition",void 0),c([g],pt.prototype,"horizontalDefaultPosition",void 0),c([g],pt.prototype,"tooltipVisible",void 0),c([g],pt.prototype,"currentDirection",void 0);const xf=(i,t)=>v`
    <template
        role="treeitem"
        slot="${e=>e.isNestedItem()?"item":void 0}"
        tabindex="-1"
        class="${e=>e.expanded?"expanded":""} ${e=>e.selected?"selected":""} ${e=>e.nested?"nested":""}
            ${e=>e.disabled?"disabled":""}"
        aria-expanded="${e=>e.childItems&&e.childItemLength()>0?e.expanded:void 0}"
        aria-selected="${e=>e.selected}"
        aria-disabled="${e=>e.disabled}"
        @focusin="${(e,s)=>e.handleFocus(s.event)}"
        @focusout="${(e,s)=>e.handleBlur(s.event)}"
        ${Ns({property:"childItems",filter:Ie()})}
    >
        <div class="positioning-region" part="positioning-region">
            <div class="content-region" part="content-region">
                ${Q(e=>e.childItems&&e.childItemLength()>0,v`
                        <div
                            aria-hidden="true"
                            class="expand-collapse-button"
                            part="expand-collapse-button"
                            @click="${(e,s)=>e.handleExpandCollapseButtonClick(s.event)}"
                            ${j("expandCollapseButton")}
                        >
                            <slot name="expand-collapse-glyph">
                                ${t.expandCollapseGlyph||""}
                            </slot>
                        </div>
                    `)}
                ${Pt(i,t)}
                <slot></slot>
                ${At(i,t)}
            </div>
        </div>
        ${Q(e=>e.childItems&&e.childItemLength()>0&&(e.expanded||e.renderCollapsedChildren),v`
                <div role="group" class="items" part="items">
                    <slot name="item" ${Z("items")}></slot>
                </div>
            `)}
    </template>
`;function qe(i){return Ci(i)&&i.getAttribute("role")==="treeitem"}class lt extends E{constructor(){super(...arguments),this.expanded=!1,this.focusable=!1,this.isNestedItem=()=>qe(this.parentElement),this.handleExpandCollapseButtonClick=t=>{!this.disabled&&!t.defaultPrevented&&(this.expanded=!this.expanded)},this.handleFocus=t=>{this.setAttribute("tabindex","0")},this.handleBlur=t=>{this.setAttribute("tabindex","-1")}}expandedChanged(){this.$fastController.isConnected&&this.$emit("expanded-change",this)}selectedChanged(){this.$fastController.isConnected&&this.$emit("selected-change",this)}itemsChanged(t,e){this.$fastController.isConnected&&this.items.forEach(s=>{qe(s)&&(s.nested=!0)})}static focusItem(t){t.focusable=!0,t.focus()}childItemLength(){const t=this.childItems.filter(e=>qe(e));return t?t.length:0}}c([u({mode:"boolean"})],lt.prototype,"expanded",void 0),c([u({mode:"boolean"})],lt.prototype,"selected",void 0),c([u({mode:"boolean"})],lt.prototype,"disabled",void 0),c([g],lt.prototype,"focusable",void 0),c([g],lt.prototype,"childItems",void 0),c([g],lt.prototype,"items",void 0),c([g],lt.prototype,"nested",void 0),c([g],lt.prototype,"renderCollapsedChildren",void 0),tt(lt,Bt);const $f=(i,t)=>v`
    <template
        role="tree"
        ${j("treeView")}
        @keydown="${(e,s)=>e.handleKeyDown(s.event)}"
        @focusin="${(e,s)=>e.handleFocus(s.event)}"
        @focusout="${(e,s)=>e.handleBlur(s.event)}"
        @click="${(e,s)=>e.handleClick(s.event)}"
        @selected-change="${(e,s)=>e.handleSelectedChange(s.event)}"
    >
        <slot ${Z("slottedTreeItems")}></slot>
    </template>
`;class ro extends E{constructor(){super(...arguments),this.currentFocused=null,this.handleFocus=t=>{if(!(this.slottedTreeItems.length<1)){if(t.target===this){this.currentFocused===null&&(this.currentFocused=this.getValidFocusableItem()),this.currentFocused!==null&&lt.focusItem(this.currentFocused);return}this.contains(t.target)&&(this.setAttribute("tabindex","-1"),this.currentFocused=t.target)}},this.handleBlur=t=>{t.target instanceof HTMLElement&&(t.relatedTarget===null||!this.contains(t.relatedTarget))&&this.setAttribute("tabindex","0")},this.handleKeyDown=t=>{if(t.defaultPrevented)return;if(this.slottedTreeItems.length<1)return!0;const e=this.getVisibleNodes();switch(t.key){case me:e.length&&lt.focusItem(e[0]);return;case be:e.length&&lt.focusItem(e[e.length-1]);return;case Se:if(t.target&&this.isFocusableElement(t.target)){const s=t.target;s instanceof lt&&s.childItemLength()>0&&s.expanded?s.expanded=!1:s instanceof lt&&s.parentElement instanceof lt&&lt.focusItem(s.parentElement)}return!1;case Fe:if(t.target&&this.isFocusableElement(t.target)){const s=t.target;s instanceof lt&&s.childItemLength()>0&&!s.expanded?s.expanded=!0:s instanceof lt&&s.childItemLength()>0&&this.focusNextNode(1,t.target)}return;case Wt:t.target&&this.isFocusableElement(t.target)&&this.focusNextNode(1,t.target);return;case Xt:t.target&&this.isFocusableElement(t.target)&&this.focusNextNode(-1,t.target);return;case de:this.handleClick(t);return}return!0},this.handleSelectedChange=t=>{if(t.defaultPrevented)return;if(!(t.target instanceof Element)||!qe(t.target))return!0;const e=t.target;e.selected?(this.currentSelected&&this.currentSelected!==e&&(this.currentSelected.selected=!1),this.currentSelected=e):!e.selected&&this.currentSelected===e&&(this.currentSelected=null)},this.setItems=()=>{const t=this.treeView.querySelector("[aria-selected='true']");this.currentSelected=t,(this.currentFocused===null||!this.contains(this.currentFocused))&&(this.currentFocused=this.getValidFocusableItem()),this.nested=this.checkForNestedItems(),this.getVisibleNodes().forEach(s=>{qe(s)&&(s.nested=this.nested)})},this.isFocusableElement=t=>qe(t),this.isSelectedElement=t=>t.selected}slottedTreeItemsChanged(){this.$fastController.isConnected&&this.setItems()}connectedCallback(){super.connectedCallback(),this.setAttribute("tabindex","0"),O.queueUpdate(()=>{this.setItems()})}handleClick(t){if(t.defaultPrevented)return;if(!(t.target instanceof Element)||!qe(t.target))return!0;const e=t.target;e.disabled||(e.selected=!e.selected)}focusNextNode(t,e){const s=this.getVisibleNodes();if(!s)return;const o=s[s.indexOf(e)+t];Ci(o)&&lt.focusItem(o)}getValidFocusableItem(){const t=this.getVisibleNodes();let e=t.findIndex(this.isSelectedElement);return e===-1&&(e=t.findIndex(this.isFocusableElement)),e!==-1?t[e]:null}checkForNestedItems(){return this.slottedTreeItems.some(t=>qe(t)&&t.querySelector("[role='treeitem']"))}getVisibleNodes(){return du(this,"[role='treeitem']")||[]}}c([u({attribute:"render-collapsed-nodes"})],ro.prototype,"renderCollapsedNodes",void 0),c([g],ro.prototype,"currentSelected",void 0),c([g],ro.prototype,"slottedTreeItems",void 0);class wf{constructor(t){this.listenerCache=new WeakMap,this.query=t}bind(t){const{query:e}=this,s=this.constructListener(t);s.bind(e)(),e.addListener(s),this.listenerCache.set(t,s)}unbind(t){const e=this.listenerCache.get(t);e&&(this.query.removeListener(e),this.listenerCache.delete(t))}}class Is extends wf{constructor(t,e){super(t),this.styles=e}static with(t){return e=>new Is(t,e)}constructListener(t){let e=!1;const s=this.styles;return function(){const{matches:n}=this;n&&!e?(t.$fastController.addStyles(s),e=n):!n&&e&&(t.$fastController.removeStyles(s),e=n)}}unbind(t){super.unbind(t),t.$fastController.removeStyles(this.styles)}}const P=Is.with(window.matchMedia("(forced-colors)"));Is.with(window.matchMedia("(prefers-color-scheme: dark)")),Is.with(window.matchMedia("(prefers-color-scheme: light)"));class kf{constructor(t,e,s){this.propertyName=t,this.value=e,this.styles=s}bind(t){L.getNotifier(t).subscribe(this,this.propertyName),this.handleChange(t,this.propertyName)}unbind(t){L.getNotifier(t).unsubscribe(this,this.propertyName),t.$fastController.removeStyles(this.styles)}handleChange(t,e){t[e]===this.value?t.$fastController.addStyles(this.styles):t.$fastController.removeStyles(this.styles)}}const at="not-allowed",Cf=":host([hidden]){display:none}";function H(i){return`${Cf}:host{display:${i}}`}const $=pu()?"focus-visible":"focus";function Ae(i,t,e){return isNaN(i)||i<=t?t:i>=e?e:i}function Rn(i,t,e){return isNaN(i)||i<=t?0:i>=e?1:i/(e-t)}function ni(i,t,e){return isNaN(i)?t:t+i*(e-t)}function yl(i){return i*(Math.PI/180)}function Tf(i){return i*(180/Math.PI)}function If(i){const t=Math.round(Ae(i,0,255)).toString(16);return t.length===1?"0"+t:t}function Dt(i,t,e){return isNaN(i)||i<=0?t:i>=1?e:t+i*(e-t)}function Dn(i,t,e){if(i<=0)return t%360;if(i>=1)return e%360;const s=(t-e+360)%360,o=(e-t+360)%360;return s<=o?(t-s*i+360)%360:(t+s*i+360)%360}function mt(i,t){const e=Math.pow(10,t);return Math.round(i*e)/e}class yi{constructor(t,e,s){this.h=t,this.s=e,this.l=s}static fromObject(t){return t&&!isNaN(t.h)&&!isNaN(t.s)&&!isNaN(t.l)?new yi(t.h,t.s,t.l):null}equalValue(t){return this.h===t.h&&this.s===t.s&&this.l===t.l}roundToPrecision(t){return new yi(mt(this.h,t),mt(this.s,t),mt(this.l,t))}toObject(){return{h:this.h,s:this.s,l:this.l}}}class Ss{constructor(t,e,s){this.h=t,this.s=e,this.v=s}static fromObject(t){return t&&!isNaN(t.h)&&!isNaN(t.s)&&!isNaN(t.v)?new Ss(t.h,t.s,t.v):null}equalValue(t){return this.h===t.h&&this.s===t.s&&this.v===t.v}roundToPrecision(t){return new Ss(mt(this.h,t),mt(this.s,t),mt(this.v,t))}toObject(){return{h:this.h,s:this.s,v:this.v}}}class It{constructor(t,e,s){this.l=t,this.a=e,this.b=s}static fromObject(t){return t&&!isNaN(t.l)&&!isNaN(t.a)&&!isNaN(t.b)?new It(t.l,t.a,t.b):null}equalValue(t){return this.l===t.l&&this.a===t.a&&this.b===t.b}roundToPrecision(t){return new It(mt(this.l,t),mt(this.a,t),mt(this.b,t))}toObject(){return{l:this.l,a:this.a,b:this.b}}}It.epsilon=216/24389,It.kappa=24389/27;class Mi{constructor(t,e,s){this.l=t,this.c=e,this.h=s}static fromObject(t){return t&&!isNaN(t.l)&&!isNaN(t.c)&&!isNaN(t.h)?new Mi(t.l,t.c,t.h):null}equalValue(t){return this.l===t.l&&this.c===t.c&&this.h===t.h}roundToPrecision(t){return new Mi(mt(this.l,t),mt(this.c,t),mt(this.h,t))}toObject(){return{l:this.l,c:this.c,h:this.h}}}class ht{constructor(t,e,s,o){this.r=t,this.g=e,this.b=s,this.a=typeof o=="number"&&!isNaN(o)?o:1}static fromObject(t){return t&&!isNaN(t.r)&&!isNaN(t.g)&&!isNaN(t.b)?new ht(t.r,t.g,t.b,t.a):null}equalValue(t){return this.r===t.r&&this.g===t.g&&this.b===t.b&&this.a===t.a}toStringHexRGB(){return"#"+[this.r,this.g,this.b].map(this.formatHexValue).join("")}toStringHexRGBA(){return this.toStringHexRGB()+this.formatHexValue(this.a)}toStringHexARGB(){return"#"+[this.a,this.r,this.g,this.b].map(this.formatHexValue).join("")}toStringWebRGB(){return`rgb(${Math.round(ni(this.r,0,255))},${Math.round(ni(this.g,0,255))},${Math.round(ni(this.b,0,255))})`}toStringWebRGBA(){return`rgba(${Math.round(ni(this.r,0,255))},${Math.round(ni(this.g,0,255))},${Math.round(ni(this.b,0,255))},${Ae(this.a,0,1)})`}roundToPrecision(t){return new ht(mt(this.r,t),mt(this.g,t),mt(this.b,t),mt(this.a,t))}clamp(){return new ht(Ae(this.r,0,1),Ae(this.g,0,1),Ae(this.b,0,1),Ae(this.a,0,1))}toObject(){return{r:this.r,g:this.g,b:this.b,a:this.a}}formatHexValue(t){return If(ni(t,0,255))}}class Ut{constructor(t,e,s){this.x=t,this.y=e,this.z=s}static fromObject(t){return t&&!isNaN(t.x)&&!isNaN(t.y)&&!isNaN(t.z)?new Ut(t.x,t.y,t.z):null}equalValue(t){return this.x===t.x&&this.y===t.y&&this.z===t.z}roundToPrecision(t){return new Ut(mt(this.x,t),mt(this.y,t),mt(this.z,t))}toObject(){return{x:this.x,y:this.y,z:this.z}}}Ut.whitePoint=new Ut(.95047,1,1.08883);function En(i){return i.r*.2126+i.g*.7152+i.b*.0722}function Ln(i){function t(e){return e<=.03928?e/12.92:Math.pow((e+.055)/1.055,2.4)}return En(new ht(t(i.r),t(i.g),t(i.b),1))}const xl=(i,t)=>(i+.05)/(t+.05);function $l(i,t){const e=Ln(i),s=Ln(t);return e>s?xl(e,s):xl(s,e)}function ms(i){const t=Math.max(i.r,i.g,i.b),e=Math.min(i.r,i.g,i.b),s=t-e;let o=0;s!==0&&(t===i.r?o=60*((i.g-i.b)/s%6):t===i.g?o=60*((i.b-i.r)/s+2):o=60*((i.r-i.g)/s+4)),o<0&&(o+=360);const n=(t+e)/2;let r=0;return s!==0&&(r=s/(1-Math.abs(2*n-1))),new yi(o,r,n)}function An(i,t=1){const e=(1-Math.abs(2*i.l-1))*i.s,s=e*(1-Math.abs(i.h/60%2-1)),o=i.l-e/2;let n=0,r=0,a=0;return i.h<60?(n=e,r=s,a=0):i.h<120?(n=s,r=e,a=0):i.h<180?(n=0,r=e,a=s):i.h<240?(n=0,r=s,a=e):i.h<300?(n=s,r=0,a=e):i.h<360&&(n=e,r=0,a=s),new ht(n+o,r+o,a+o,t)}function wl(i){const t=Math.max(i.r,i.g,i.b),e=Math.min(i.r,i.g,i.b),s=t-e;let o=0;s!==0&&(t===i.r?o=60*((i.g-i.b)/s%6):t===i.g?o=60*((i.b-i.r)/s+2):o=60*((i.r-i.g)/s+4)),o<0&&(o+=360);let n=0;return t!==0&&(n=s/t),new Ss(o,n,t)}function Sf(i,t=1){const e=i.s*i.v,s=e*(1-Math.abs(i.h/60%2-1)),o=i.v-e;let n=0,r=0,a=0;return i.h<60?(n=e,r=s,a=0):i.h<120?(n=s,r=e,a=0):i.h<180?(n=0,r=e,a=s):i.h<240?(n=0,r=s,a=e):i.h<300?(n=s,r=0,a=e):i.h<360&&(n=e,r=0,a=s),new ht(n+o,r+o,a+o,t)}function Ff(i){let t=0,e=0;return i.h!==0&&(t=Math.cos(yl(i.h))*i.c,e=Math.sin(yl(i.h))*i.c),new It(i.l,t,e)}function Of(i){let t=0;(Math.abs(i.b)>.001||Math.abs(i.a)>.001)&&(t=Tf(Math.atan2(i.b,i.a))),t<0&&(t+=360);const e=Math.sqrt(i.a*i.a+i.b*i.b);return new Mi(i.l,e,t)}function Rf(i){const t=(i.l+16)/116,e=t+i.a/500,s=t-i.b/200,o=Math.pow(e,3),n=Math.pow(t,3),r=Math.pow(s,3);let a=0;o>It.epsilon?a=o:a=(116*e-16)/It.kappa;let l=0;i.l>It.epsilon*It.kappa?l=n:l=i.l/It.kappa;let h=0;return r>It.epsilon?h=r:h=(116*s-16)/It.kappa,a=Ut.whitePoint.x*a,l=Ut.whitePoint.y*l,h=Ut.whitePoint.z*h,new Ut(a,l,h)}function Df(i){function t(l){return l>It.epsilon?Math.pow(l,1/3):(It.kappa*l+16)/116}const e=t(i.x/Ut.whitePoint.x),s=t(i.y/Ut.whitePoint.y),o=t(i.z/Ut.whitePoint.z),n=116*s-16,r=500*(e-s),a=200*(s-o);return new It(n,r,a)}function Pn(i){function t(l){return l<=.04045?l/12.92:Math.pow((l+.055)/1.055,2.4)}const e=t(i.r),s=t(i.g),o=t(i.b),n=e*.4124564+s*.3575761+o*.1804375,r=e*.2126729+s*.7151522+o*.072175,a=e*.0193339+s*.119192+o*.9503041;return new Ut(n,r,a)}function kl(i,t=1){function e(r){return r<=.0031308?r*12.92:1.055*Math.pow(r,1/2.4)-.055}const s=e(i.x*3.2404542-i.y*1.5371385-i.z*.4985314),o=e(i.x*-.969266+i.y*1.8760108+i.z*.041556),n=e(i.x*.0556434-i.y*.2040259+i.z*1.0572252);return new ht(s,o,n,t)}function Vn(i){return Df(Pn(i))}function Cl(i,t=1){return kl(Rf(i),t)}function Mn(i){return Of(Vn(i))}function Tl(i,t=1){return Cl(Ff(i),t)}function Il(i,t,e=18){const s=Mn(i);let o=s.c+t*e;return o<0&&(o=0),Tl(new Mi(s.l,o,s.h))}function zn(i,t){return i*t}function Sl(i,t){return new ht(zn(i.r,t.r),zn(i.g,t.g),zn(i.b,t.b),1)}function Hn(i,t){return i<.5?Ae(2*t*i,0,1):Ae(1-2*(1-t)*(1-i),0,1)}function Fl(i,t){return new ht(Hn(i.r,t.r),Hn(i.g,t.g),Hn(i.b,t.b),1)}var Ol;(function(i){i[i.Burn=0]="Burn",i[i.Color=1]="Color",i[i.Darken=2]="Darken",i[i.Dodge=3]="Dodge",i[i.Lighten=4]="Lighten",i[i.Multiply=5]="Multiply",i[i.Overlay=6]="Overlay",i[i.Screen=7]="Screen"})(Ol||(Ol={}));function Ef(i,t,e){return isNaN(i)||i<=0?t:i>=1?e:new ht(Dt(i,t.r,e.r),Dt(i,t.g,e.g),Dt(i,t.b,e.b),Dt(i,t.a,e.a))}function Lf(i,t,e){return isNaN(i)||i<=0?t:i>=1?e:new yi(Dn(i,t.h,e.h),Dt(i,t.s,e.s),Dt(i,t.l,e.l))}function Af(i,t,e){return isNaN(i)||i<=0?t:i>=1?e:new Ss(Dn(i,t.h,e.h),Dt(i,t.s,e.s),Dt(i,t.v,e.v))}function Pf(i,t,e){return isNaN(i)||i<=0?t:i>=1?e:new Ut(Dt(i,t.x,e.x),Dt(i,t.y,e.y),Dt(i,t.z,e.z))}function Vf(i,t,e){return isNaN(i)||i<=0?t:i>=1?e:new It(Dt(i,t.l,e.l),Dt(i,t.a,e.a),Dt(i,t.b,e.b))}function Mf(i,t,e){return isNaN(i)||i<=0?t:i>=1?e:new Mi(Dt(i,t.l,e.l),Dt(i,t.c,e.c),Dn(i,t.h,e.h))}var Zt;(function(i){i[i.RGB=0]="RGB",i[i.HSL=1]="HSL",i[i.HSV=2]="HSV",i[i.XYZ=3]="XYZ",i[i.LAB=4]="LAB",i[i.LCH=5]="LCH"})(Zt||(Zt={}));function bs(i,t,e,s){if(isNaN(i)||i<=0)return e;if(i>=1)return s;switch(t){case Zt.HSL:return An(Lf(i,ms(e),ms(s)));case Zt.HSV:return Sf(Af(i,wl(e),wl(s)));case Zt.XYZ:return kl(Pf(i,Pn(e),Pn(s)));case Zt.LAB:return Cl(Vf(i,Vn(e),Vn(s)));case Zt.LCH:return Tl(Mf(i,Mn(e),Mn(s)));default:return Ef(i,e,s)}}class le{constructor(t){if(t==null||t.length===0)throw new Error("The stops argument must be non-empty");this.stops=this.sortColorScaleStops(t)}static createBalancedColorScale(t){if(t==null||t.length===0)throw new Error("The colors argument must be non-empty");const e=new Array(t.length);for(let s=0;s<t.length;s++)s===0?e[s]={color:t[s],position:0}:s===t.length-1?e[s]={color:t[s],position:1}:e[s]={color:t[s],position:s*(1/(t.length-1))};return new le(e)}getColor(t,e=Zt.RGB){if(this.stops.length===1)return this.stops[0].color;if(t<=0)return this.stops[0].color;if(t>=1)return this.stops[this.stops.length-1].color;let s=0;for(let r=0;r<this.stops.length;r++)this.stops[r].position<=t&&(s=r);let o=s+1;o>=this.stops.length&&(o=this.stops.length-1);const n=(t-this.stops[s].position)*(1/(this.stops[o].position-this.stops[s].position));return bs(n,e,this.stops[s].color,this.stops[o].color)}trim(t,e,s=Zt.RGB){if(t<0||e>1||e<t)throw new Error("Invalid bounds");if(t===e)return new le([{color:this.getColor(t,s),position:0}]);const o=[];for(let a=0;a<this.stops.length;a++)this.stops[a].position>=t&&this.stops[a].position<=e&&o.push(this.stops[a]);if(o.length===0)return new le([{color:this.getColor(t),position:t},{color:this.getColor(e),position:e}]);o[0].position!==t&&o.unshift({color:this.getColor(t),position:t}),o[o.length-1].position!==e&&o.push({color:this.getColor(e),position:e});const n=e-t,r=new Array(o.length);for(let a=0;a<o.length;a++)r[a]={color:o[a].color,position:(o[a].position-t)/n};return new le(r)}findNextColor(t,e,s=!1,o=Zt.RGB,n=.005,r=32){isNaN(t)||t<=0?t=0:t>=1&&(t=1);const a=this.getColor(t,o),l=s?0:1,h=this.getColor(l,o);if($l(a,h)<=e)return l;let f=s?0:t,m=s?t:0,w=l,k=0;for(;k<=r;){w=Math.abs(m-f)/2+f;const F=this.getColor(w,o),V=$l(a,F);if(Math.abs(V-e)<=n)return w;V>e?s?f=w:m=w:s?m=w:f=w,k++}return w}clone(){const t=new Array(this.stops.length);for(let e=0;e<t.length;e++)t[e]={color:this.stops[e].color,position:this.stops[e].position};return new le(t)}sortColorScaleStops(t){return t.sort((e,s)=>{const o=e.position,n=s.position;return o<n?-1:o>n?1:0})}}const zf=/^#((?:[0-9a-f]{6}|[0-9a-f]{3}))$/i;function ri(i){const t=zf.exec(i);if(t===null)return null;let e=t[1];if(e.length===3){const o=e.charAt(0),n=e.charAt(1),r=e.charAt(2);e=o.concat(o,n,n,r,r)}const s=parseInt(e,16);return isNaN(s)?null:new ht(Rn((s&16711680)>>>16,0,255),Rn((s&65280)>>>8,0,255),Rn(s&255,0,255),1)}class We{constructor(t){this.config=Object.assign({},We.defaultPaletteConfig,t),this.palette=[],this.updatePaletteColors()}updatePaletteGenerationValues(t){let e=!1;for(const s in t)this.config[s]&&(this.config[s].equalValue?this.config[s].equalValue(t[s])||(this.config[s]=t[s],e=!0):t[s]!==this.config[s]&&(this.config[s]=t[s],e=!0));return e&&this.updatePaletteColors(),e}updatePaletteColors(){const t=this.generatePaletteColorScale();for(let e=0;e<this.config.steps;e++)this.palette[e]=t.getColor(e/(this.config.steps-1),this.config.interpolationMode)}generatePaletteColorScale(){const t=ms(this.config.baseColor),s=new le([{position:0,color:this.config.scaleColorLight},{position:.5,color:this.config.baseColor},{position:1,color:this.config.scaleColorDark}]).trim(this.config.clipLight,1-this.config.clipDark),o=s.getColor(0),n=s.getColor(1);let r=o,a=n;if(t.s>=this.config.saturationAdjustmentCutoff&&(r=Il(r,this.config.saturationLight),a=Il(a,this.config.saturationDark)),this.config.multiplyLight!==0){const l=Sl(this.config.baseColor,r);r=bs(this.config.multiplyLight,this.config.interpolationMode,r,l)}if(this.config.multiplyDark!==0){const l=Sl(this.config.baseColor,a);a=bs(this.config.multiplyDark,this.config.interpolationMode,a,l)}if(this.config.overlayLight!==0){const l=Fl(this.config.baseColor,r);r=bs(this.config.overlayLight,this.config.interpolationMode,r,l)}if(this.config.overlayDark!==0){const l=Fl(this.config.baseColor,a);a=bs(this.config.overlayDark,this.config.interpolationMode,a,l)}return this.config.baseScalePosition?this.config.baseScalePosition<=0?new le([{position:0,color:this.config.baseColor},{position:1,color:a.clamp()}]):this.config.baseScalePosition>=1?new le([{position:0,color:r.clamp()},{position:1,color:this.config.baseColor}]):new le([{position:0,color:r.clamp()},{position:this.config.baseScalePosition,color:this.config.baseColor},{position:1,color:a.clamp()}]):new le([{position:0,color:r.clamp()},{position:.5,color:this.config.baseColor},{position:1,color:a.clamp()}])}}We.defaultPaletteConfig={baseColor:ri("#808080"),steps:11,interpolationMode:Zt.RGB,scaleColorLight:new ht(1,1,1,1),scaleColorDark:new ht(0,0,0,1),clipLight:.185,clipDark:.16,saturationAdjustmentCutoff:.05,saturationLight:.35,saturationDark:1.25,overlayLight:0,overlayDark:.25,multiplyLight:0,multiplyDark:0,baseScalePosition:.5},We.greyscalePaletteConfig={baseColor:ri("#808080"),steps:11,interpolationMode:Zt.RGB,scaleColorLight:new ht(1,1,1,1),scaleColorDark:new ht(0,0,0,1),clipLight:0,clipDark:0,saturationAdjustmentCutoff:0,saturationLight:0,saturationDark:0,overlayLight:0,overlayDark:0,multiplyLight:0,multiplyDark:0,baseScalePosition:.5},We.defaultPaletteConfig.scaleColorLight,We.defaultPaletteConfig.scaleColorDark;class ko{constructor(t){this.palette=[],this.config=Object.assign({},ko.defaultPaletteConfig,t),this.regenPalettes()}regenPalettes(){let t=this.config.steps;(isNaN(t)||t<3)&&(t=3);const e=.14,s=.06,o=new ht(e,e,e,1),n=94,a=new We(Object.assign(Object.assign({},We.greyscalePaletteConfig),{baseColor:o,baseScalePosition:(1-e)*100/n,steps:t})).palette,l=En(this.config.baseColor),h=ms(this.config.baseColor).l,p=(l+h)/2,m=this.matchRelativeLuminanceIndex(p,a)/(t-1),k=this.matchRelativeLuminanceIndex(e,a)/(t-1),F=ms(this.config.baseColor),V=An(yi.fromObject({h:F.h,s:F.s,l:e})),vt=An(yi.fromObject({h:F.h,s:F.s,l:s})),et=new Array(5);et[0]={position:0,color:new ht(1,1,1,1)},et[1]={position:m,color:this.config.baseColor},et[2]={position:k,color:V},et[3]={position:.99,color:vt},et[4]={position:1,color:new ht(0,0,0,1)};const zi=new le(et);this.palette=new Array(t);for(let ge=0;ge<t;ge++){const Hi=zi.getColor(ge/(t-1),Zt.RGB);this.palette[ge]=Hi}}matchRelativeLuminanceIndex(t,e){let s=Number.MAX_VALUE,o=0,n=0;const r=e.length;for(;n<r;n++){const a=Math.abs(En(e[n])-t);a<s&&(s=a,o=n)}return o}}ko.defaultPaletteConfig={baseColor:ri("#808080"),steps:94};function Rl(i,t){const e=i.relativeLuminance>t.relativeLuminance?i:t,s=i.relativeLuminance>t.relativeLuminance?t:i;return(e.relativeLuminance+.05)/(s.relativeLuminance+.05)}const Pe=Object.freeze({create(i,t,e){return new Co(i,t,e)},from(i){return new Co(i.r,i.g,i.b)}});function Hf(i){const t={r:0,g:0,b:0,toColorString:()=>"",contrast:()=>0,relativeLuminance:0};for(const e in t)if(typeof t[e]!=typeof i[e])return!1;return!0}class Co extends ht{constructor(t,e,s){super(t,e,s,1),this.toColorString=this.toStringHexRGB,this.contrast=Rl.bind(null,this),this.createCSS=this.toColorString,this.relativeLuminance=Ln(this)}static fromObject(t){return new Co(t.r,t.g,t.b)}}function Bn(i,t,e=0,s=i.length-1){if(s===e)return i[e];const o=Math.floor((s-e)/2)+e;return t(i[o])?Bn(i,t,e,o):Bn(i,t,o+1,s)}const Bf=(-.1+Math.sqrt(.21))/2;function Nf(i){return i.relativeLuminance<=Bf}function ai(i){return Nf(i)?-1:1}function jf(i,t,e){return typeof i=="number"?ao.from(Pe.create(i,t,e)):ao.from(i)}function _f(i){return Hf(i)?To.from(i):To.from(Pe.create(i.r,i.g,i.b))}const ao=Object.freeze({create:jf,from:_f});class To{constructor(t,e){this.closestIndexCache=new Map,this.source=t,this.swatches=e,this.reversedSwatches=Object.freeze([...this.swatches].reverse()),this.lastIndex=this.swatches.length-1}colorContrast(t,e,s,o){s===void 0&&(s=this.closestIndexOf(t));let n=this.swatches;const r=this.lastIndex;let a=s;o===void 0&&(o=ai(t));const l=h=>Rl(t,h)>=e;return o===-1&&(n=this.reversedSwatches,a=r-a),Bn(n,l,a,r)}get(t){return this.swatches[t]||this.swatches[Ae(t,0,this.lastIndex)]}closestIndexOf(t){if(this.closestIndexCache.has(t.relativeLuminance))return this.closestIndexCache.get(t.relativeLuminance);let e=this.swatches.indexOf(t);if(e!==-1)return this.closestIndexCache.set(t.relativeLuminance,e),e;const s=this.swatches.reduce((o,n)=>Math.abs(n.relativeLuminance-t.relativeLuminance)<Math.abs(o.relativeLuminance-t.relativeLuminance)?n:o);return e=this.swatches.indexOf(s),this.closestIndexCache.set(t.relativeLuminance,e),e}static from(t){return new To(t,Object.freeze(new ko({baseColor:ht.fromObject(t)}).palette.map(e=>{const s=ri(e.toStringHexRGB());return Pe.create(s.r,s.g,s.b)})))}}function Uf(i,t,e,s,o,n,r,a,l){const h=i.source,p=t.closestIndexOf(e),f=Math.max(r,a,l),m=p>=f?-1:1,k=i.closestIndexOf(h),F=k+m*-1*s,V=F+m*o,vt=F+m*n;return{rest:i.get(F),hover:i.get(k),active:i.get(V),focus:i.get(vt)}}function qf(i,t,e,s,o,n,r){const a=i.source,l=i.closestIndexOf(a),h=ai(t),p=l+(h===1?Math.min(s,o):Math.max(h*s,h*o)),f=i.colorContrast(t,e,p,h),m=i.closestIndexOf(f),w=m+h*Math.abs(s-o),k=h===1?s<o:h*s>h*o;let F,V;return k?(F=m,V=w):(F=w,V=m),{rest:i.get(F),hover:i.get(V),active:i.get(F+h*n),focus:i.get(F+h*r)}}const Dl=Pe.create(1,1,1),Gf=Pe.create(0,0,0),Wf=Pe.from(ri("#808080")),Xf=Pe.from(ri("#DA1A5F"));function Yf(i,t){return i.contrast(Dl)>=t?Dl:Gf}function Qf(i,t,e,s,o,n){const r=i.closestIndexOf(t),a=Math.max(e,s,o,n),l=r>=a?-1:1;return{rest:i.get(r+l*e),hover:i.get(r+l*s),active:i.get(r+l*o),focus:i.get(r+l*n)}}function Zf(i,t,e,s,o,n){const r=ai(t),a=i.closestIndexOf(t);return{rest:i.get(a-r*e),hover:i.get(a-r*s),active:i.get(a-r*o),focus:i.get(a-r*n)}}function Jf(i,t,e){const s=i.closestIndexOf(t);return i.get(s-(s<e?e*-1:e))}function Kf(i,t,e,s,o,n,r,a,l,h){const p=Math.max(e,s,o,n,r,a,l,h),f=i.closestIndexOf(t),m=f>=p?-1:1;return{rest:i.get(f+m*e),hover:i.get(f+m*s),active:i.get(f+m*o),focus:i.get(f+m*n)}}function tg(i,t,e,s,o,n){const r=ai(t),a=i.closestIndexOf(i.colorContrast(t,4.5)),l=a+r*Math.abs(e-s),h=r===1?e<s:r*e>r*s;let p,f;return h?(p=a,f=l):(p=l,f=a),{rest:i.get(p),hover:i.get(f),active:i.get(p+r*o),focus:i.get(p+r*n)}}function eg(i,t){return i.colorContrast(t,3.5)}function ig(i,t,e){return i.colorContrast(e,3.5,i.closestIndexOf(i.source),ai(t)*-1)}function sg(i,t){return i.colorContrast(t,14)}function og(i,t){return i.colorContrast(t,4.5)}function lo(i){return Pe.create(i,i,i)}const ng={LightMode:1,DarkMode:.23};function rg(i,t,e){return i.get(i.closestIndexOf(lo(t))+e)}function ag(i,t,e){const s=i.closestIndexOf(lo(t))-e;return i.get(s-e)}function lg(i,t){return i.get(i.closestIndexOf(lo(t)))}function Nn(i,t,e,s,o,n){return Math.max(i.closestIndexOf(lo(t))+e,s,o,n)}function cg(i,t,e,s,o,n){return i.get(Nn(i,t,e,s,o,n))}function hg(i,t,e,s,o,n){return i.get(Nn(i,t,e,s,o,n)+e)}function dg(i,t,e,s,o,n){return i.get(Nn(i,t,e,s,o,n)+e*2)}function ug(i,t,e,s,o,n){const r=i.closestIndexOf(t),a=ai(t),l=r+a*e,h=l+a*(s-e),p=l+a*(o-e),f=l+a*(n-e);return{rest:i.get(l),hover:i.get(h),active:i.get(p),focus:i.get(f)}}function pg(i,t,e){return i.get(i.closestIndexOf(t)+ai(t)*e)}const{create:x}=Ne;function A(i){return Ne.create({name:i,cssCustomPropertyName:null})}const W=x("body-font").withDefault('aktiv-grotesk, "Segoe UI", Arial, Helvetica, sans-serif'),vs=x("base-height-multiplier").withDefault(10),fg=x("base-horizontal-spacing-multiplier").withDefault(3),li=x("base-layer-luminance").withDefault(ng.DarkMode),M=x("control-corner-radius").withDefault(4),$e=x("density").withDefault(0),y=x("design-unit").withDefault(4),co=x("direction").withDefault(J.ltr),ft=x("disabled-opacity").withDefault(.3),R=x("stroke-width").withDefault(1),B=x("focus-stroke-width").withDefault(2),U=x("type-ramp-base-font-size").withDefault("14px"),G=x("type-ramp-base-line-height").withDefault("20px"),ho=x("type-ramp-minus-1-font-size").withDefault("12px"),uo=x("type-ramp-minus-1-line-height").withDefault("16px"),gg=x("type-ramp-minus-2-font-size").withDefault("10px"),mg=x("type-ramp-minus-2-line-height").withDefault("16px"),bg=x("type-ramp-plus-1-font-size").withDefault("16px"),vg=x("type-ramp-plus-1-line-height").withDefault("24px"),yg=x("type-ramp-plus-2-font-size").withDefault("20px"),xg=x("type-ramp-plus-2-line-height").withDefault("28px"),El=x("type-ramp-plus-3-font-size").withDefault("28px"),Ll=x("type-ramp-plus-3-line-height").withDefault("36px"),$g=x("type-ramp-plus-4-font-size").withDefault("34px"),wg=x("type-ramp-plus-4-line-height").withDefault("44px"),kg=x("type-ramp-plus-5-font-size").withDefault("46px"),Cg=x("type-ramp-plus-5-line-height").withDefault("56px"),Tg=x("type-ramp-plus-6-font-size").withDefault("60px"),Ig=x("type-ramp-plus-6-line-height").withDefault("72px"),Sg=A("accent-fill-rest-delta").withDefault(0),Al=A("accent-fill-hover-delta").withDefault(4),Pl=A("accent-fill-active-delta").withDefault(-5),Vl=A("accent-fill-focus-delta").withDefault(0),Ml=A("accent-foreground-rest-delta").withDefault(0),zl=A("accent-foreground-hover-delta").withDefault(6),Hl=A("accent-foreground-active-delta").withDefault(-4),Bl=A("accent-foreground-focus-delta").withDefault(0),ci=A("neutral-fill-rest-delta").withDefault(7),hi=A("neutral-fill-hover-delta").withDefault(10),di=A("neutral-fill-active-delta").withDefault(5),jn=A("neutral-fill-focus-delta").withDefault(0),Nl=A("neutral-fill-input-rest-delta").withDefault(0),jl=A("neutral-fill-input-hover-delta").withDefault(0),_l=A("neutral-fill-input-active-delta").withDefault(0),Ul=A("neutral-fill-input-focus-delta").withDefault(0),ql=A("neutral-fill-stealth-rest-delta").withDefault(0),Gl=A("neutral-fill-stealth-hover-delta").withDefault(5),Wl=A("neutral-fill-stealth-active-delta").withDefault(3),Xl=A("neutral-fill-stealth-focus-delta").withDefault(0),Fg=A("neutral-fill-strong-rest-delta").withDefault(0),Yl=A("neutral-fill-strong-hover-delta").withDefault(8),Ql=A("neutral-fill-strong-active-delta").withDefault(-5),Zl=A("neutral-fill-strong-focus-delta").withDefault(0),ui=A("neutral-fill-layer-rest-delta").withDefault(3),Jl=A("neutral-stroke-rest-delta").withDefault(25),Kl=A("neutral-stroke-hover-delta").withDefault(40),tc=A("neutral-stroke-active-delta").withDefault(16),ec=A("neutral-stroke-focus-delta").withDefault(25),ic=A("neutral-stroke-divider-rest-delta").withDefault(8),sc=x("neutral-color").withDefault(Wf),kt=A("neutral-palette").withDefault(i=>ao.from(sc.getValueFor(i))),oc=x("accent-color").withDefault(Xf),_n=A("accent-palette").withDefault(i=>ao.from(oc.getValueFor(i))),Og=A("neutral-layer-card-container-recipe").withDefault({evaluate:i=>rg(kt.getValueFor(i),li.getValueFor(i),ui.getValueFor(i))});x("neutral-layer-card-container").withDefault(i=>Og.getValueFor(i).evaluate(i));const Rg=A("neutral-layer-floating-recipe").withDefault({evaluate:i=>ag(kt.getValueFor(i),li.getValueFor(i),ui.getValueFor(i))}),Un=x("neutral-layer-floating").withDefault(i=>Rg.getValueFor(i).evaluate(i)),Dg=A("neutral-layer-1-recipe").withDefault({evaluate:i=>lg(kt.getValueFor(i),li.getValueFor(i))}),Eg=x("neutral-layer-1").withDefault(i=>Dg.getValueFor(i).evaluate(i)),Lg=A("neutral-layer-2-recipe").withDefault({evaluate:i=>cg(kt.getValueFor(i),li.getValueFor(i),ui.getValueFor(i),ci.getValueFor(i),hi.getValueFor(i),di.getValueFor(i))});x("neutral-layer-2").withDefault(i=>Lg.getValueFor(i).evaluate(i));const Ag=A("neutral-layer-3-recipe").withDefault({evaluate:i=>hg(kt.getValueFor(i),li.getValueFor(i),ui.getValueFor(i),ci.getValueFor(i),hi.getValueFor(i),di.getValueFor(i))});x("neutral-layer-3").withDefault(i=>Ag.getValueFor(i).evaluate(i));const Pg=A("neutral-layer-4-recipe").withDefault({evaluate:i=>dg(kt.getValueFor(i),li.getValueFor(i),ui.getValueFor(i),ci.getValueFor(i),hi.getValueFor(i),di.getValueFor(i))});x("neutral-layer-4").withDefault(i=>Pg.getValueFor(i).evaluate(i));const N=x("fill-color").withDefault(i=>Eg.getValueFor(i));var ys;(function(i){i[i.normal=4.5]="normal",i[i.large=7]="large"})(ys||(ys={}));const po=x({name:"accent-fill-recipe",cssCustomPropertyName:null}).withDefault({evaluate:(i,t)=>Uf(_n.getValueFor(i),kt.getValueFor(i),t||N.getValueFor(i),Al.getValueFor(i),Pl.getValueFor(i),Vl.getValueFor(i),ci.getValueFor(i),hi.getValueFor(i),di.getValueFor(i))}),X=x("accent-fill-rest").withDefault(i=>po.getValueFor(i).evaluate(i).rest),gt=x("accent-fill-hover").withDefault(i=>po.getValueFor(i).evaluate(i).hover),ct=x("accent-fill-active").withDefault(i=>po.getValueFor(i).evaluate(i).active),qn=x("accent-fill-focus").withDefault(i=>po.getValueFor(i).evaluate(i).focus),nc=i=>(t,e)=>Yf(e||X.getValueFor(t),i),fo=A("foreground-on-accent-recipe").withDefault({evaluate:(i,t)=>nc(ys.normal)(i,t)}),oe=x("foreground-on-accent-rest").withDefault(i=>fo.getValueFor(i).evaluate(i,X.getValueFor(i))),we=x("foreground-on-accent-hover").withDefault(i=>fo.getValueFor(i).evaluate(i,gt.getValueFor(i))),ne=x("foreground-on-accent-active").withDefault(i=>fo.getValueFor(i).evaluate(i,ct.getValueFor(i))),Vg=x("foreground-on-accent-focus").withDefault(i=>fo.getValueFor(i).evaluate(i,qn.getValueFor(i))),go=A("foreground-on-accent-large-recipe").withDefault({evaluate:(i,t)=>nc(ys.large)(i,t)});x("foreground-on-accent-rest-large").withDefault(i=>go.getValueFor(i).evaluate(i,X.getValueFor(i))),x("foreground-on-accent-hover-large").withDefault(i=>go.getValueFor(i).evaluate(i,gt.getValueFor(i))),x("foreground-on-accent-active-large").withDefault(i=>go.getValueFor(i).evaluate(i,ct.getValueFor(i))),x("foreground-on-accent-focus-large").withDefault(i=>go.getValueFor(i).evaluate(i,qn.getValueFor(i)));const Mg=i=>(t,e)=>qf(_n.getValueFor(t),e||N.getValueFor(t),i,Ml.getValueFor(t),zl.getValueFor(t),Hl.getValueFor(t),Bl.getValueFor(t)),mo=x({name:"accent-foreground-recipe",cssCustomPropertyName:null}).withDefault({evaluate:(i,t)=>Mg(ys.normal)(i,t)}),Ct=x("accent-foreground-rest").withDefault(i=>mo.getValueFor(i).evaluate(i).rest),pi=x("accent-foreground-hover").withDefault(i=>mo.getValueFor(i).evaluate(i).hover),ke=x("accent-foreground-active").withDefault(i=>mo.getValueFor(i).evaluate(i).active);x("accent-foreground-focus").withDefault(i=>mo.getValueFor(i).evaluate(i).focus);const fi=x({name:"neutral-fill-recipe",cssCustomPropertyName:null}).withDefault({evaluate:(i,t)=>Qf(kt.getValueFor(i),t||N.getValueFor(i),ci.getValueFor(i),hi.getValueFor(i),di.getValueFor(i),jn.getValueFor(i))}),Tt=x("neutral-fill-rest").withDefault(i=>fi.getValueFor(i).evaluate(i).rest),gi=x("neutral-fill-hover").withDefault(i=>fi.getValueFor(i).evaluate(i).hover),Gn=x("neutral-fill-active").withDefault(i=>fi.getValueFor(i).evaluate(i).active);x("neutral-fill-focus").withDefault(i=>fi.getValueFor(i).evaluate(i).focus);const bo=x({name:"neutral-fill-input-recipe",cssCustomPropertyName:null}).withDefault({evaluate:(i,t)=>Zf(kt.getValueFor(i),t||N.getValueFor(i),Nl.getValueFor(i),jl.getValueFor(i),_l.getValueFor(i),Ul.getValueFor(i))}),Ve=x("neutral-fill-input-rest").withDefault(i=>bo.getValueFor(i).evaluate(i).rest),Jt=x("neutral-fill-input-hover").withDefault(i=>bo.getValueFor(i).evaluate(i).hover),xs=x("neutral-fill-input-active").withDefault(i=>bo.getValueFor(i).evaluate(i).active);x("neutral-fill-input-focus").withDefault(i=>bo.getValueFor(i).evaluate(i).focus);const Ge=x({name:"neutral-fill-stealth-recipe",cssCustomPropertyName:null}).withDefault({evaluate:(i,t)=>Kf(kt.getValueFor(i),t||N.getValueFor(i),ql.getValueFor(i),Gl.getValueFor(i),Wl.getValueFor(i),Xl.getValueFor(i),ci.getValueFor(i),hi.getValueFor(i),di.getValueFor(i),jn.getValueFor(i))}),re=x("neutral-fill-stealth-rest").withDefault(i=>Ge.getValueFor(i).evaluate(i).rest),mi=x("neutral-fill-stealth-hover").withDefault(i=>Ge.getValueFor(i).evaluate(i).hover),bi=x("neutral-fill-stealth-active").withDefault(i=>Ge.getValueFor(i).evaluate(i).active),Wn=x("neutral-fill-stealth-focus").withDefault(i=>Ge.getValueFor(i).evaluate(i).focus),vo=x({name:"neutral-fill-strong-recipe",cssCustomPropertyName:null}).withDefault({evaluate:(i,t)=>tg(kt.getValueFor(i),t||N.getValueFor(i),Fg.getValueFor(i),Yl.getValueFor(i),Ql.getValueFor(i),Zl.getValueFor(i))});x("neutral-fill-strong-rest").withDefault(i=>vo.getValueFor(i).evaluate(i).rest),x("neutral-fill-strong-hover").withDefault(i=>vo.getValueFor(i).evaluate(i).hover),x("neutral-fill-strong-active").withDefault(i=>vo.getValueFor(i).evaluate(i).active),x("neutral-fill-strong-focus").withDefault(i=>vo.getValueFor(i).evaluate(i).focus);const Xn=A("neutral-fill-layer-recipe").withDefault({evaluate:(i,t)=>Jf(kt.getValueFor(i),t||N.getValueFor(i),ui.getValueFor(i))});x("neutral-fill-layer-rest").withDefault(i=>Xn.getValueFor(i).evaluate(i));const zg=A("focus-stroke-outer-recipe").withDefault({evaluate:i=>eg(kt.getValueFor(i),N.getValueFor(i))}),z=x("focus-stroke-outer").withDefault(i=>zg.getValueFor(i).evaluate(i)),Hg=A("focus-stroke-inner-recipe").withDefault({evaluate:i=>ig(_n.getValueFor(i),N.getValueFor(i),z.getValueFor(i))}),yo=x("focus-stroke-inner").withDefault(i=>Hg.getValueFor(i).evaluate(i)),Bg=A("neutral-foreground-hint-recipe").withDefault({evaluate:i=>og(kt.getValueFor(i),N.getValueFor(i))}),$s=x("neutral-foreground-hint").withDefault(i=>Bg.getValueFor(i).evaluate(i)),Ng=A("neutral-foreground-recipe").withDefault({evaluate:i=>sg(kt.getValueFor(i),N.getValueFor(i))}),S=x("neutral-foreground-rest").withDefault(i=>Ng.getValueFor(i).evaluate(i)),xo=x({name:"neutral-stroke-recipe",cssCustomPropertyName:null}).withDefault({evaluate:i=>ug(kt.getValueFor(i),N.getValueFor(i),Jl.getValueFor(i),Kl.getValueFor(i),tc.getValueFor(i),ec.getValueFor(i))}),pe=x("neutral-stroke-rest").withDefault(i=>xo.getValueFor(i).evaluate(i).rest),ws=x("neutral-stroke-hover").withDefault(i=>xo.getValueFor(i).evaluate(i).hover),Yn=x("neutral-stroke-active").withDefault(i=>xo.getValueFor(i).evaluate(i).active),jg=x("neutral-stroke-focus").withDefault(i=>xo.getValueFor(i).evaluate(i).focus),_g=A("neutral-stroke-divider-recipe").withDefault({evaluate:(i,t)=>pg(kt.getValueFor(i),t||N.getValueFor(i),ic.getValueFor(i))}),Li=x("neutral-stroke-divider-rest").withDefault(i=>_g.getValueFor(i).evaluate(i)),rc=Ne.create({name:"height-number",cssCustomPropertyName:null}).withDefault(i=>(vs.getValueFor(i)+$e.getValueFor(i))*y.getValueFor(i)),Ug=(i,t)=>b`
        ${H("flex")} :host {
            box-sizing: border-box;
            flex-direction: column;
            font-family: ${W};
            font-size: ${ho};
            line-height: ${uo};
            color: ${S};
            border-top: calc(${R} * 1px) solid ${Li};
        }
    `,D=$a`(${vs} + ${$e}) * ${y}`,qg=(i,t)=>b`
        ${H("flex")} :host {
            box-sizing: border-box;
            font-family: ${W};
            flex-direction: column;
            font-size: ${ho};
            line-height: ${uo};
            border-bottom: calc(${R} * 1px) solid ${Li};
        }

        .region {
            display: none;
            padding: calc((6 + (${y} * 2 * ${$e})) * 1px);
        }

        .heading {
            display: grid;
            position: relative;
            grid-template-columns: auto 1fr auto calc(${D} * 1px);
        }

        .button {
            appearance: none;
            border: none;
            background: none;
            grid-column: 2;
            grid-row: 1;
            outline: none;
            padding: 0 calc((6 + (${y} * 2 * ${$e})) * 1px);
            text-align: left;
            height: calc(${D} * 1px);
            color: ${S};
            cursor: pointer;
            font-family: inherit;
        }

        .button:hover {
            color: ${S};
        }

        .button:active {
            color: ${S};
        }

        .button::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            cursor: pointer;
        }

        .button:${$}::before {
            outline: none;
            border: calc(${B} * 1px) solid ${z};
            border-radius: calc(${M} * 1px);
        }

        :host([expanded]) .region {
            display: block;
        }

        .icon {
            display: flex;
            align-items: center;
            justify-content: center;
            grid-column: 4;
            pointer-events: none;
            position: relative;
        }

        slot[name="expanded-icon"],
        slot[name="collapsed-icon"] {
            fill: ${Ct};
        }

        slot[name="collapsed-icon"] {
            display: flex;
        }

        :host([expanded]) slot[name="collapsed-icon"] {
            display: none;
        }

        slot[name="expanded-icon"] {
            display: none;
        }

        :host([expanded]) slot[name="expanded-icon"] {
            display: flex;
        }

        .start {
            display: flex;
            align-items: center;
            padding-inline-start: calc(${y} * 1px);
            justify-content: center;
            grid-column: 1;
            position: relative;
        }

        .end {
            display: flex;
            align-items: center;
            justify-content: center;
            grid-column: 3;
            position: relative;
        }
    `.withBehaviors(P(b`
            .button:${$}::before {
                border-color: ${d.Highlight};
            }
            :host slot[name="collapsed-icon"],
            :host([expanded]) slot[name="expanded-icon"] {
                fill: ${d.ButtonText};
            }
        `)),Qn=Qe.compose({baseName:"accordion-item",template:Yd,styles:qg,collapsedIcon:`
        <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M16.22 3H3.78a.78.78 0 00-.78.78v12.44c0 .43.35.78.78.78h12.44c.43 0 .78-.35.78-.78V3.78a.78.78 0 00-.78-.78zM3.78 2h12.44C17.2 2 18 2.8 18 3.78v12.44c0 .98-.8 1.78-1.78 1.78H3.78C2.8 18 2 17.2 2 16.22V3.78C2 2.8 2.8 2 3.78 2zM11 9h3v2h-3v3H9v-3H6V9h3V6h2v3z"
            />
        </svg>
    `,expandedIcon:`
        <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M3.78 3h12.44c.43 0 .78.35.78.78v12.44c0 .43-.35.78-.78.78H3.78a.78.78 0 01-.78-.78V3.78c0-.43.35-.78.78-.78zm12.44-1H3.78C2.8 2 2 2.8 2 3.78v12.44C2 17.2 2.8 18 3.78 18h12.44c.98 0 1.78-.8 1.78-1.78V3.78C18 2.8 17.2 2 16.22 2zM14 9H6v2h8V9z"
            />
        </svg>
    `}),ac=bn.compose({baseName:"accordion",template:cu,styles:Ug}),Gg="0 0 calc((var(--elevation) * 0.225px) + 2px) rgba(0, 0, 0, calc(.11 * (2 - var(--background-luminance, 1))))",Wg="0 calc(var(--elevation) * 0.4px) calc((var(--elevation) * 0.9px)) rgba(0, 0, 0, calc(.13 * (2 - var(--background-luminance, 1))))",Ai=`box-shadow: ${Gg}, ${Wg};`,lc=b`
    ${H("inline-flex")} :host {
        font-family: ${W};
        outline: none;
        font-size: ${U};
        line-height: ${G};
        height: calc(${D} * 1px);
        min-width: calc(${D} * 1px);
        background-color: ${Tt};
        color: ${S};
        border-radius: calc(${M} * 1px);
        fill: currentcolor;
        cursor: pointer;
    }

    .control {
        background: transparent;
        height: inherit;
        flex-grow: 1;
        box-sizing: border-box;
        display: inline-flex;
        justify-content: center;
        align-items: baseline;
        padding: 0 calc((10 + (${y} * 2 * ${$e})) * 1px);
        white-space: nowrap;
        outline: none;
        text-decoration: none;
        border: calc(${R} * 1px) solid transparent;
        color: inherit;
        border-radius: inherit;
        fill: inherit;
        cursor: inherit;
        font-weight: inherit;
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
    }

    :host(:hover) {
        background-color: ${gi};
    }

    :host(:active) {
        background-color: ${Gn};
    }

    .control:${$} {
        border-color: ${z};
        box-shadow: 0 0 0 calc((${B} - ${R}) * 1px) ${z} inset;
    }

    .control::-moz-focus-inner {
        border: 0;
    }

    .start,
    .content,
    .end {
        align-self: center;
    }

    .start,
    .end {
        display: flex;
    }

    .control.icon-only {
        padding: 0;
        line-height: 0;
    }

    ::slotted(svg) {
        ${""} width: 16px;
        height: 16px;
        pointer-events: none;
    }

    .start {
        margin-inline-end: 11px;
    }

    .end {
        margin-inline-start: 11px;
    }
`.withBehaviors(P(b`
            :host .control {
              background-color: ${d.ButtonFace};
              border-color: ${d.ButtonText};
              color: ${d.ButtonText};
              fill: currentColor;
            }

            :host(:hover) .control {
              forced-color-adjust: none;
              background-color: ${d.Highlight};
              color: ${d.HighlightText};
            }

            .control:${$} {
              forced-color-adjust: none;
              background-color: ${d.Highlight};
              border-color: ${d.ButtonText};
              box-shadow: 0 0 0 calc((${B} - ${R}) * 1px) ${d.ButtonText} inset;
              color: ${d.HighlightText};
            }

            .control:hover,
            :host([appearance="outline"]) .control:hover {
              border-color: ${d.ButtonText};
            }

            :host([href]) .control {
                border-color: ${d.LinkText};
                color: ${d.LinkText};
            }

            :host([href]) .control:hover,
            :host([href]) .control:${$}{
              forced-color-adjust: none;
              background: ${d.ButtonFace};
              border-color: ${d.LinkText};
              box-shadow: 0 0 0 1px ${d.LinkText} inset;
              color: ${d.LinkText};
              fill: currentColor;
            }
        `)),cc=b`
    :host([appearance="accent"]) {
        background: ${X};
        color: ${oe};
    }

    :host([appearance="accent"]:hover) {
        background: ${gt};
        color: ${we};
    }

    :host([appearance="accent"]:active) .control:active {
        background: ${ct};
        color: ${ne};
    }

    :host([appearance="accent"]) .control:${$} {
        box-shadow: 0 0 0 calc((${B} - ${R}) * 1px) ${z} inset,
            0 0 0 calc((${B} + ${R}) * 1px) ${yo} inset;
    }
`.withBehaviors(P(b`
            :host([appearance="accent"]) .control {
                forced-color-adjust: none;
                background: ${d.Highlight};
                color: ${d.HighlightText};
            }

            :host([appearance="accent"]) .control:hover,
            :host([appearance="accent"]:active) .control:active {
                background: ${d.HighlightText};
                border-color: ${d.Highlight};
                color: ${d.Highlight};
            }

            :host([appearance="accent"]) .control:${$} {
                border-color: ${d.Highlight};
                box-shadow: 0 0 0 calc(${B} * 1px) ${d.HighlightText} inset;
            }

            :host([appearance="accent"][href]) .control{
                background: ${d.LinkText};
                color: ${d.HighlightText};
            }

            :host([appearance="accent"][href]) .control:hover {
                background: ${d.ButtonFace};
                border-color: ${d.LinkText};
                box-shadow: none;
                color: ${d.LinkText};
                fill: currentColor;
            }

            :host([appearance="accent"][href]) .control:${$} {
                border-color: ${d.LinkText};
                box-shadow: 0 0 0 calc(${B} * 1px) ${d.HighlightText} inset;
            }
        `)),Xg=b`
    :host([appearance="hypertext"]) {
        font-size: inherit;
        line-height: inherit;
        height: auto;
        min-width: 0;
        background: transparent;
    }

    :host([appearance="hypertext"]) .control {
        display: inline;
        padding: 0;
        border: none;
        box-shadow: none;
        border-radius: 0;
        line-height: 1;
    }

    :host a.control:not(:link) {
        background-color: transparent;
        cursor: default;
    }
    :host([appearance="hypertext"]) .control:link,
    :host([appearance="hypertext"]) .control:visited {
        background: transparent;
        color: ${Ct};
        border-bottom: calc(${R} * 1px) solid ${Ct};
    }

    :host([appearance="hypertext"]:hover),
    :host([appearance="hypertext"]) .control:hover {
        background: transparent;
        border-bottom-color: ${pi};
    }

    :host([appearance="hypertext"]:active),
    :host([appearance="hypertext"]) .control:active {
        background: transparent;
        border-bottom-color: ${ke};
    }

    :host([appearance="hypertext"]) .control:${$} {
        border-bottom: calc(${B} * 1px) solid ${z};
        margin-bottom: calc(calc(${R} - ${B}) * 1px);
    }
`.withBehaviors(P(b`
            :host([appearance="hypertext"]:hover) {
                background-color: ${d.ButtonFace};
                color: ${d.ButtonText};
            }
            :host([appearance="hypertext"][href]) .control:hover,
            :host([appearance="hypertext"][href]) .control:active,
            :host([appearance="hypertext"][href]) .control:${$} {
                color: ${d.LinkText};
                border-bottom-color: ${d.LinkText};
                box-shadow: none;
            }
        `)),hc=b`
    :host([appearance="lightweight"]) {
        background: transparent;
        color: ${Ct};
    }

    :host([appearance="lightweight"]) .control {
        padding: 0;
        height: initial;
        border: none;
        box-shadow: none;
        border-radius: 0;
    }

    :host([appearance="lightweight"]:hover) {
        background: transparent;
        color: ${pi};
    }

    :host([appearance="lightweight"]:active) {
        background: transparent;
        color: ${ke};
    }

    :host([appearance="lightweight"]) .content {
        position: relative;
    }

    :host([appearance="lightweight"]) .content::before {
        content: "";
        display: block;
        height: calc(${R} * 1px);
        position: absolute;
        top: calc(1em + 4px);
        width: 100%;
    }

    :host([appearance="lightweight"]:hover) .content::before {
        background: ${pi};
    }

    :host([appearance="lightweight"]:active) .content::before {
        background: ${ke};
    }

    :host([appearance="lightweight"]) .control:${$} .content::before {
        background: ${S};
        height: calc(${B} * 1px);
    }
`.withBehaviors(P(b`
            :host([appearance="lightweight"]) .control:hover,
            :host([appearance="lightweight"]) .control:${$} {
                forced-color-adjust: none;
                background: ${d.ButtonFace};
                color: ${d.Highlight};
            }
            :host([appearance="lightweight"]) .control:hover .content::before,
            :host([appearance="lightweight"]) .control:${$} .content::before {
                background: ${d.Highlight};
            }

            :host([appearance="lightweight"][href]) .control:hover,
            :host([appearance="lightweight"][href]) .control:${$} {
                background: ${d.ButtonFace};
                box-shadow: none;
                color: ${d.LinkText};
            }

            :host([appearance="lightweight"][href]) .control:hover .content::before,
            :host([appearance="lightweight"][href]) .control:${$} .content::before {
                background: ${d.LinkText};
            }
        `)),dc=b`
    :host([appearance="outline"]) {
        background: transparent;
        border-color: ${X};
    }

    :host([appearance="outline"]:hover) {
        border-color: ${gt};
    }

    :host([appearance="outline"]:active) {
        border-color: ${ct};
    }

    :host([appearance="outline"]) .control {
        border-color: inherit;
    }

    :host([appearance="outline"]) .control:${$} {
        box-shadow: 0 0 0 calc((${B} - ${R}) * 1px) ${z} inset;
        border-color: ${z};
    }
`.withBehaviors(P(b`
            :host([appearance="outline"]) .control {
                border-color: ${d.ButtonText};
            }
            :host([appearance="outline"]) .control:${$} {
              forced-color-adjust: none;
              background-color: ${d.Highlight};
              border-color: ${d.ButtonText};
              box-shadow: 0 0 0 calc((${B} - ${R}) * 1px) ${d.ButtonText} inset;
              color: ${d.HighlightText};
              fill: currentColor;
            }
            :host([appearance="outline"][href]) .control {
                background: ${d.ButtonFace};
                border-color: ${d.LinkText};
                color: ${d.LinkText};
                fill: currentColor;
            }
            :host([appearance="outline"][href]) .control:hover,
            :host([appearance="outline"][href]) .control:${$} {
              forced-color-adjust: none;
              border-color: ${d.LinkText};
              box-shadow: 0 0 0 1px ${d.LinkText} inset;
            }
        `)),uc=b`
    :host([appearance="stealth"]) {
        background: ${re};
    }

    :host([appearance="stealth"]:hover) {
        background: ${mi};
    }

    :host([appearance="stealth"]:active) {
        background: ${bi};
    }
`.withBehaviors(P(b`
            :host([appearance="stealth"]),
            :host([appearance="stealth"]) .control {
                forced-color-adjust: none;
                background: ${d.ButtonFace};
                border-color: transparent;
                color: ${d.ButtonText};
                fill: currentColor;
            }

            :host([appearance="stealth"]:hover) .control {
                background: ${d.Highlight};
                border-color: ${d.Highlight};
                color: ${d.HighlightText};
                fill: currentColor;
            }

            :host([appearance="stealth"]:${$}) .control {
                background: ${d.Highlight};
                box-shadow: 0 0 0 1px ${d.Highlight};
                color: ${d.HighlightText};
                fill: currentColor;
            }

            :host([appearance="stealth"][href]) .control {
                color: ${d.LinkText};
            }

            :host([appearance="stealth"][href]:hover) .control,
            :host([appearance="stealth"][href]:${$}) .control {
                background: ${d.LinkText};
                border-color: ${d.LinkText};
                color: ${d.HighlightText};
                fill: currentColor;
            }

            :host([appearance="stealth"][href]:${$}) .control {
                forced-color-adjust: none;
                box-shadow: 0 0 0 1px ${d.LinkText};
            }
        `));class Pi{constructor(t,e){this.cache=new WeakMap,this.ltr=t,this.rtl=e}bind(t){this.attach(t)}unbind(t){const e=this.cache.get(t);e&&co.unsubscribe(e)}attach(t){const e=this.cache.get(t)||new Yg(this.ltr,this.rtl,t),s=co.getValueFor(t);co.subscribe(e),e.attach(s),this.cache.set(t,e)}}class Yg{constructor(t,e,s){this.ltr=t,this.rtl=e,this.source=s,this.attached=null}handleChange({target:t,token:e}){this.attach(e.getValueFor(t))}attach(t){this.attached!==this[t]&&(this.attached!==null&&this.source.$fastController.removeStyles(this.attached),this.attached=this[t],this.attached!==null&&this.source.$fastController.addStyles(this.attached))}}function Me(i,t){return new kf("appearance",i,t)}const Qg=(i,t)=>b`
        ${lc}
    `.withBehaviors(Me("accent",cc),Me("hypertext",Xg),Me("lightweight",hc),Me("outline",dc),Me("stealth",uc));class pc extends Yt{appearanceChanged(t,e){this.$fastController.isConnected&&(this.classList.remove(t),this.classList.add(e))}connectedCallback(){super.connectedCallback(),this.appearance||(this.appearance="neutral")}defaultSlottedContentChanged(t,e){const s=this.defaultSlottedContent.filter(o=>o.nodeType===Node.ELEMENT_NODE);s.length===1&&s[0]instanceof SVGElement?this.control.classList.add("icon-only"):this.control.classList.remove("icon-only")}}c([u],pc.prototype,"appearance",void 0);const Zg=pc.compose({baseName:"anchor",baseClass:Yt,template:Za,styles:Qg,shadowOptions:{delegatesFocus:!0}}),Jg=(i,t)=>b`
    :host {
        contain: layout;
        display: block;
    }
`,Kg=q.compose({baseName:"anchored-region",template:xu,styles:Jg}),tm=(i,t)=>b`
    ::slotted(${i.tagFor(ii)}) {
        left: 0;
    }
`,em=(i,t)=>b`
    ::slotted(${i.tagFor(ii)}) {
        right: 0;
    }
`,im=(i,t)=>b`
        ${H("flex")} :host {
            position: relative;
            height: var(--avatar-size, var(--avatar-size-default));
            max-width: var(--avatar-size, var(--avatar-size-default));
            --avatar-size-default: calc(
                (
                        (${vs} + ${$e}) * ${y} +
                            ((${y} * 8) - 40)
                    ) * 1px
            );
            --avatar-text-size: ${U};
            --avatar-text-ratio: ${y};
        }

        .link {
            text-decoration: none;
            color: ${S};
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            min-width: 100%;
        }

        .square {
            border-radius: calc(${M} * 1px);
            min-width: 100%;
            overflow: hidden;
        }

        .circle {
            border-radius: 100%;
            min-width: 100%;
            overflow: hidden;
        }

        .backplate {
            position: relative;
            display: flex;
        }

        .media,
        ::slotted(img) {
            max-width: 100%;
            position: absolute;
            display: block;
        }

        .content {
            font-size: calc(
                (var(--avatar-text-size) + var(--avatar-size, var(--avatar-size-default))) /
                    var(--avatar-text-ratio)
            );
            line-height: var(--avatar-size, var(--avatar-size-default));
            display: block;
            min-height: var(--avatar-size, var(--avatar-size-default));
        }

        ::slotted(${i.tagFor(ii)}) {
            position: absolute;
            display: block;
        }
    `.withBehaviors(new Pi(em(i),tm(i)));class Zn extends Fi{}c([u({attribute:"src"})],Zn.prototype,"imgSrc",void 0),c([u],Zn.prototype,"alt",void 0);const sm=v`
    ${Q(i=>i.imgSrc,v`
            <img
                src="${i=>i.imgSrc}"
                alt="${i=>i.alt}"
                slot="media"
                class="media"
                part="media"
            />
        `)}
`,om=Zn.compose({baseName:"avatar",baseClass:Fi,template:Cu,styles:im,media:sm,shadowOptions:{delegatesFocus:!0}}),nm=(i,t)=>b`
        ${H("inline-block")} :host {
            box-sizing: border-box;
            font-family: ${W};
            font-size: ${ho};
            line-height: ${uo};
        }

        .control {
            border-radius: calc(${M} * 1px);
            padding: calc(((${y} * 0.5) - ${R}) * 1px)
                calc((${y} - ${R}) * 1px);
            color: ${Ct};
            font-weight: 600;
            border: calc(${R} * 1px) solid transparent;
        }

        .control[style] {
            font-weight: 400;
        }

        :host([circular]) .control {
            border-radius: 100px;
            padding: 0 calc(${y} * 1px);
            height: calc((${D} - (${y} * 3)) * 1px);
            min-width: calc((${D} - (${y} * 3)) * 1px);
            display: flex;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
        }
    `,fc=ii.compose({baseName:"badge",template:Tu,styles:nm}),rm=(i,t)=>b`
    ${H("inline-flex")} :host {
        background: transparent;
        box-sizing: border-box;
        font-family: ${W};
        font-size: ${U};
        fill: currentColor;
        line-height: ${G};
        min-width: calc(${D} * 1px);
        outline: none;
        color: ${S}
    }

    .listitem {
        display: flex;
        align-items: center;
        width: max-content;
    }

    .separator {
        margin: 0 6px;
        display: flex;
    }

    .control {
        align-items: center;
        box-sizing: border-box;
        color: ${Ct};
        cursor: pointer;
        display: flex;
        fill: inherit;
        outline: none;
        text-decoration: none;
        white-space: nowrap;
    }

    .control:hover {
        color: ${pi};
    }

    .control:active {
        color: ${ke};
    }

    .control .content {
        position: relative;
    }

    .control .content::before {
        content: "";
        display: block;
        height: calc(${R} * 1px);
        left: 0;
        position: absolute;
        right: 0;
        top: calc(1em + 4px);
        width: 100%;
    }

    .control:hover .content::before {
        background: ${pi};
    }

    .control:active .content::before {
        background: ${ke};
    }

    .control:${$} .content::before {
        background: ${S};
        height: calc(${B} * 1px);
    }

    .control:not([href]) {
        color: ${S};
        cursor: default;
    }

    .control:not([href]) .content::before {
        background: none;
    }

    .start,
    .end {
        display: flex;
    }

    ::slotted(svg) {
        /* TODO: adaptive typography https://github.com/microsoft/fast/issues/2432 */
        width: 16px;
        height: 16px;
    }

    .start {
        margin-inline-end: 6px;
    }

    .end {
        margin-inline-start: 6px;
    }
`.withBehaviors(P(b`
                .control:hover .content::before,
                .control:${$} .content::before {
                    background: ${d.LinkText};
                }
                .start,
                .end {
                    fill: ${d.ButtonText};
                }
            `)),am=as.compose({baseName:"breadcrumb-item",template:Iu,styles:rm,separator:"/",shadowOptions:{delegatesFocus:!0}}),lm=(i,t)=>b`
    ${H("inline-block")} :host {
        box-sizing: border-box;
        font-family: ${W};
        font-size: ${U};
        line-height: ${G};
    }

    .list {
        display: flex;
        flex-wrap: wrap;
    }
`,cm=il.compose({baseName:"breadcrumb",template:Su,styles:lm}),hm=(i,t)=>b`
        :host([disabled]),
        :host([disabled]:hover),
        :host([disabled]:active) {
            opacity: ${ft};
            background-color: ${Tt};
            cursor: ${at};
        }

        ${lc}
    `.withBehaviors(P(b`
                :host([disabled]),
                :host([disabled]) .control,
                :host([disabled]:hover),
                :host([disabled]:active) {
                    forced-color-adjust: none;
                    background-color: ${d.ButtonFace};
                    border-color: ${d.GrayText};
                    color: ${d.GrayText};
                    cursor: ${at};
                    opacity: 1;
                }
            `),Me("accent",b`
                :host([appearance="accent"][disabled]),
                :host([appearance="accent"][disabled]:hover),
                :host([appearance="accent"][disabled]:active) {
                    background: ${X};
                }

                ${cc}
            `.withBehaviors(P(b`
                        :host([appearance="accent"][disabled]) .control,
                        :host([appearance="accent"][disabled]) .control:hover {
                            background: ${d.ButtonFace};
                            border-color: ${d.GrayText};
                            color: ${d.GrayText};
                        }
                    `))),Me("lightweight",b`
                :host([appearance="lightweight"][disabled]:hover),
                :host([appearance="lightweight"][disabled]:active) {
                    background-color: transparent;
                    color: ${Ct};
                }

                :host([appearance="lightweight"][disabled]) .content::before,
                :host([appearance="lightweight"][disabled]:hover) .content::before,
                :host([appearance="lightweight"][disabled]:active) .content::before {
                    background: transparent;
                }

                ${hc}
            `.withBehaviors(P(b`
                        :host([appearance="lightweight"].disabled) .control {
                            forced-color-adjust: none;
                            color: ${d.GrayText};
                        }

                        :host([appearance="lightweight"].disabled)
                            .control:hover
                            .content::before {
                            background: none;
                        }
                    `))),Me("outline",b`
                :host([appearance="outline"][disabled]),
                :host([appearance="outline"][disabled]:hover),
                :host([appearance="outline"][disabled]:active) {
                    background: transparent;
                    border-color: ${X};
                }

                ${dc}
            `.withBehaviors(P(b`
                        :host([appearance="outline"][disabled]) .control {
                            border-color: ${d.GrayText};
                        }
                    `))),Me("stealth",b`
                :host([appearance="stealth"][disabled]),
                :host([appearance="stealth"][disabled]:hover),
                :host([appearance="stealth"][disabled]:active) {
                    background: ${re};
                }

                ${uc}
            `.withBehaviors(P(b`
                        :host([appearance="stealth"][disabled]) {
                            background: ${d.ButtonFace};
                        }

                        :host([appearance="stealth"][disabled]) .control {
                            background: ${d.ButtonFace};
                            border-color: transparent;
                            color: ${d.GrayText};
                        }
                    `))));class gc extends ee{constructor(){super(...arguments),this.appearance="neutral"}defaultSlottedContentChanged(t,e){const s=this.defaultSlottedContent.filter(o=>o.nodeType===Node.ELEMENT_NODE);s.length===1&&s[0]instanceof SVGElement?this.control.classList.add("icon-only"):this.control.classList.remove("icon-only")}}c([u],gc.prototype,"appearance",void 0);const mc=gc.compose({baseName:"button",baseClass:ee,template:Fu,styles:hm,shadowOptions:{delegatesFocus:!0}}),dm=b`
    ${H("block")} :host {
        --cell-border: none;
        --cell-height: calc(${D} * 1px);
        --selected-day-outline: 1px solid ${ke};
        --selected-day-color: ${ke};
        --selected-day-background: ${Tt};
        --cell-padding: calc(${y} * 1px);
        --disabled-day-opacity: ${ft};
        --inactive-day-opacity: ${ft};
        font-family: ${W};
        font-size: ${U};
        line-height: ${G};
        color: ${S};
    }

    .title {
        font-size: ${El};
        line-height: ${Ll};
        padding: var(--cell-padding);
        text-align: center;
    }

    .week-days,
    .week {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        border-left: var(--cell-border, none);
        border-bottom: none;
        padding: 0;
    }

    .interact .week {
        grid-gap: calc(${y} * 1px);
        margin-top: calc(${y} * 1px);
    }

    .day,
    .week-day {
        border-bottom: var(--cell-border);
        border-right: var(--cell-border);
        padding: var(--cell-padding);
    }

    .week-day {
        text-align: center;
        border-radius: 0;
        border-top: var(--cell-border);
    }

    .day {
        box-sizing: border-box;
        vertical-align: top;
        outline-offset: -1px;
        line-height: var(--cell-line-height);
        white-space: normal;
    }

    .interact .day {
        background: ${Tt};
        cursor: pointer;
    }

    .day.inactive {
        background: var(--inactive-day-background);
        color: var(--inactive-day-color);
        opacity: var(--inactive-day-opacity);
        outline: var(--inactive-day-outline);
    }

    .day.disabled {
        background: var(--disabled-day-background);
        color: var(--disabled-day-color);
        cursor: ${at};
        opacity: var(--disabled-day-opacity);
        outline: var(--disabled-day-outline);
    }

    .day.selected {
        color: var(--selected-day-color);
        background: var(--selected-day-background);
        outline: var(--selected-day-outline);
    }

    .date {
        padding: var(--cell-padding);
        text-align: center;
    }

    .interact .today,
    .today {
        color: ${ne};
        background: ${ke};
    }

    .today.inactive .date {
        background: transparent;
        color: inherit;
        width: auto;
    }
`.withBehaviors(P(b`
            :host {
                --selected-day-outline: 1px solid ${d.Highlight};
            }

            .day,
            .week-day {
                background: ${d.Canvas};
                color: ${d.CanvasText};
                fill: currentcolor;
            }

            .day.selected {
                color: ${d.Highlight};
            }

            .today .date {
                background: ${d.Highlight};
                color: ${d.HighlightText};
            }
        `)),um=ie.compose({baseName:"calendar",template:Gu,styles:dm,title:Bu}),pm=(i,t)=>b`
        ${H("block")} :host {
            --elevation: 4;
            display: block;
            contain: content;
            height: var(--card-height, 100%);
            width: var(--card-width, 100%);
            box-sizing: border-box;
            background: ${N};
            border-radius: calc(${M} * 1px);
            ${Ai}
        }
    `.withBehaviors(P(b`
                :host {
                    forced-color-adjust: none;
                    background: ${d.Canvas};
                    box-shadow: 0 0 0 1px ${d.CanvasText};
                }
            `));class fm extends al{connectedCallback(){super.connectedCallback();const t=cs(this);t&&N.setValueFor(this,e=>Xn.getValueFor(e).evaluate(e,N.getValueFor(t)))}}const gm=fm.compose({baseName:"card",baseClass:al,template:Wu,styles:pm}),mm=(i,t)=>b`
        ${H("inline-flex")} :host {
            align-items: center;
            outline: none;
            margin: calc(${y} * 1px) 0;
            /* Chromium likes to select label text or the default slot when the checkbox is
                clicked. Maybe there is a better solution here? */
            user-select: none;
        }

        .control {
            position: relative;
            width: calc((${D} / 2 + ${y}) * 1px);
            height: calc((${D} / 2 + ${y}) * 1px);
            box-sizing: border-box;
            border-radius: calc(${M} * 1px);
            border: calc(${R} * 1px) solid ${pe};
            background: ${Ve};
            outline: none;
            cursor: pointer;
        }

        .label {
            font-family: ${W};
            color: ${S};
            padding-inline-start: calc(${y} * 2px + 2px);
            margin-inline-end: calc(${y} * 2px + 2px);
            cursor: pointer;
            font-size: ${U};
            line-height: ${G};
        }

        .label__hidden {
            display: none;
            visibility: hidden;
        }

        .checked-indicator {
            width: 100%;
            height: 100%;
            display: block;
            fill: ${oe};
            opacity: 0;
            pointer-events: none;
        }

        .indeterminate-indicator {
            border-radius: calc(${M} * 1px);
            background: ${oe};
            position: absolute;
            top: 50%;
            left: 50%;
            width: 50%;
            height: 50%;
            transform: translate(-50%, -50%);
            opacity: 0;
        }

        :host(:not([disabled])) .control:hover {
            background: ${Jt};
            border-color: ${ws};
        }

        :host(:not([disabled])) .control:active {
            background: ${xs};
            border-color: ${Yn};
        }

        :host(:${$}) .control {
            box-shadow: 0 0 0 2px ${N}, 0 0 0 4px ${z};
        }

        :host([aria-checked="true"]) .control {
            background: ${X};
            border: calc(${R} * 1px) solid ${X};
        }

        :host([aria-checked="true"]:not([disabled])) .control:hover {
            background: ${gt};
            border: calc(${R} * 1px) solid ${gt};
        }

        :host([aria-checked="true"]:not([disabled])) .control:hover .checked-indicator {
            fill: ${we};
        }

        :host([aria-checked="true"]:not([disabled])) .control:hover .indeterminate-indicator {
            background: ${we};
        }

        :host([aria-checked="true"]:not([disabled])) .control:active {
            background: ${ct};
            border: calc(${R} * 1px) solid ${ct};
        }

        :host([aria-checked="true"]:not([disabled])) .control:active .checked-indicator {
            fill: ${ne};
        }

        :host([aria-checked="true"]:not([disabled])) .control:active .indeterminate-indicator {
            background: ${ne};
        }

        :host([aria-checked="true"]:${$}:not([disabled])) .control {
            box-shadow: 0 0 0 2px ${N}, 0 0 0 4px ${z};
        }


        :host([disabled]) .label,
        :host([readonly]) .label,
        :host([readonly]) .control,
        :host([disabled]) .control {
            cursor: ${at};
        }

        :host([aria-checked="true"]:not(.indeterminate)) .checked-indicator,
        :host(.indeterminate) .indeterminate-indicator {
            opacity: 1;
        }

        :host([disabled]) {
            opacity: ${ft};
        }
    `.withBehaviors(P(b`
            .control {
                forced-color-adjust: none;
                border-color: ${d.FieldText};
                background: ${d.Field};
            }
            .checked-indicator {
                fill: ${d.FieldText};
            }
            .indeterminate-indicator {
                background: ${d.FieldText};
            }
            :host(:not([disabled])) .control:hover, .control:active {
                border-color: ${d.Highlight};
                background: ${d.Field};
            }
            :host(:${$}) .control {
                box-shadow: 0 0 0 2px ${d.Field}, 0 0 0 4px ${d.FieldText};
            }
            :host([aria-checked="true"]:${$}:not([disabled])) .control {
                box-shadow: 0 0 0 2px ${d.Field}, 0 0 0 4px ${d.FieldText};
            }
            :host([aria-checked="true"]) .control {
                background: ${d.Highlight};
                border-color: ${d.Highlight};
            }
            :host([aria-checked="true"]:not([disabled])) .control:hover, .control:active {
                border-color: ${d.Highlight};
                background: ${d.HighlightText};
            }
            :host([aria-checked="true"]) .checked-indicator {
                fill: ${d.HighlightText};
            }
            :host([aria-checked="true"]:not([disabled])) .control:hover .checked-indicator {
                fill: ${d.Highlight}
            }
            :host([aria-checked="true"]) .indeterminate-indicator {
                background: ${d.HighlightText};
            }
            :host([aria-checked="true"]) .control:hover .indeterminate-indicator {
                background: ${d.Highlight}
            }
            :host([disabled]) {
                opacity: 1;
            }
            :host([disabled]) .control {
                forced-color-adjust: none;
                border-color: ${d.GrayText};
                background: ${d.Field};
            }
            :host([disabled]) .indeterminate-indicator,
            :host([aria-checked="true"][disabled]) .control:hover .indeterminate-indicator {
                forced-color-adjust: none;
                background: ${d.GrayText};
            }
            :host([disabled]) .checked-indicator,
            :host([aria-checked="true"][disabled]) .control:hover .checked-indicator {
                forced-color-adjust: none;
                fill: ${d.GrayText};
            }
        `)),bm=Zs.compose({baseName:"checkbox",template:Xu,styles:mm,checkedIndicator:`
        <svg
            part="checked-indicator"
            class="checked-indicator"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M8.143 12.6697L15.235 4.5L16.8 5.90363L8.23812 15.7667L3.80005 11.2556L5.27591 9.7555L8.143 12.6697Z"
            />
        </svg>
    `,indeterminateIndicator:`
        <div part="indeterminate-indicator" class="indeterminate-indicator"></div>
    `}),bc=(i,t)=>{const e=i.tagFor(ue),s=i.name===i.tagFor(_e)?"":".listbox";return b`
        ${s?"":H("inline-flex")}

        :host ${s} {
            background: ${N};
            border: calc(${R} * 1px) solid ${pe};
            border-radius: calc(${M} * 1px);
            box-sizing: border-box;
            flex-direction: column;
            padding: calc(${y} * 1px) 0;
        }

        ${s?"":b`
            :host(:focus-within:not([disabled])) {
                border-color: ${z};
                box-shadow: 0 0 0
                    calc((${B} - ${R}) * 1px)
                    ${z} inset;
            }

            :host([disabled]) ::slotted(*) {
                cursor: ${at};
                opacity: ${ft};
                pointer-events: none;
            }
        `}

        ${s||":host([size])"} {
            max-height: calc(
                (var(--size) * ${D} + (${y} * ${R} * 2)) * 1px
            );
            overflow-y: auto;
        }

        :host([size="0"]) ${s} {
            max-height: none;
        }
    `.withBehaviors(P(b`
                :host(:not([multiple]):${$}) ::slotted(${e}[aria-selected="true"]),
                :host([multiple]:${$}) ::slotted(${e}[aria-checked="true"]) {
                    border-color: ${d.ButtonText};
                    box-shadow: 0 0 0 calc(${B} * 1px) inset ${d.HighlightText};
                }

                :host(:not([multiple]):${$}) ::slotted(${e}[aria-selected="true"]) {
                    background: ${d.Highlight};
                    color: ${d.HighlightText};
                    fill: currentcolor;
                }

                ::slotted(${e}[aria-selected="true"]:not([aria-checked="true"])) {
                    background: ${d.Highlight};
                    border-color: ${d.HighlightText};
                    color: ${d.HighlightText};
                }
            `))},vc=(i,t)=>{const e=i.name===i.tagFor(ye);return b`
        ${H("inline-flex")}

        :host {
            --elevation: 14;
            background: ${Ve};
            border-radius: calc(${M} * 1px);
            border: calc(${R} * 1px) solid ${X};
            box-sizing: border-box;
            color: ${S};
            font-family: ${W};
            height: calc(${D} * 1px);
            position: relative;
            user-select: none;
            min-width: 250px;
            outline: none;
            vertical-align: top;
        }

        ${e?b`
            :host(:not([aria-haspopup])) {
                --elevation: 0;
                border: 0;
                height: auto;
                min-width: 0;
            }
        `:""}

        ${bc(i)}

        :host .listbox {
            ${Ai}
            border: none;
            display: flex;
            left: 0;
            position: absolute;
            width: 100%;
            z-index: 1;
        }

        .control + .listbox {
            --stroke-size: calc(${y} * ${R} * 2);
            max-height: calc(
                (var(--listbox-max-height) * ${D} + var(--stroke-size)) * 1px
            );
        }

        ${e?b`
            :host(:not([aria-haspopup])) .listbox {
                left: auto;
                position: static;
                z-index: auto;
            }
        `:""}

        .listbox[hidden] {
            display: none;
        }

        .control {
            align-items: center;
            box-sizing: border-box;
            cursor: pointer;
            display: flex;
            font-size: ${U};
            font-family: inherit;
            line-height: ${G};
            min-height: 100%;
            padding: 0 calc(${y} * 2.25px);
            width: 100%;
        }

        :host(:not([disabled]):hover) {
            background: ${Jt};
            border-color: ${gt};
        }

        :host(:${$}) {
            border-color: ${z};
        }

        :host(:not([size]):not([multiple]):not([open]):${$}),
        :host([multiple]:${$}),
        :host([size]:${$}) {
            box-shadow: 0 0 0 calc(${B} * 1px) ${z};
        }

        :host(:not([multiple]):not([size]):${$}) ::slotted(${i.tagFor(ue)}[aria-selected="true"]:not([disabled])) {
            box-shadow: 0 0 0 calc(${B} * 1px) inset ${yo};
            border-color: ${z};
            background: ${qn};
            color: ${Vg};
        }

        :host([disabled]) {
            cursor: ${at};
            opacity: ${ft};
        }

        :host([disabled]) .control {
            cursor: ${at};
            user-select: none;
        }

        :host([disabled]:hover) {
            background: ${re};
            color: ${S};
            fill: currentcolor;
        }

        :host(:not([disabled])) .control:active {
            background: ${xs};
            border-color: ${ct};
            border-radius: calc(${M} * 1px);
        }

        :host([open][position="above"]) .listbox {
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
            border-bottom: 0;
            bottom: calc(${D} * 1px);
        }

        :host([open][position="below"]) .listbox {
            border-top-left-radius: 0;
            border-top-right-radius: 0;
            border-top: 0;
            top: calc(${D} * 1px);
        }

        .selected-value {
            flex: 1 1 auto;
            font-family: inherit;
            min-width: calc(var(--listbox-scroll-width, 0) - (${y} * 4) * 1px);
            overflow: hidden;
            text-align: start;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .indicator {
            flex: 0 0 auto;
            margin-inline-start: 1em;
        }

        slot[name="listbox"] {
            display: none;
            width: 100%;
        }

        :host([open]) slot[name="listbox"] {
            display: flex;
            position: absolute;
            ${Ai}
        }

        .end {
            margin-inline-start: auto;
        }

        .start,
        .end,
        .indicator,
        .select-indicator,
        ::slotted(svg) {
            /* TODO: adaptive typography https://github.com/microsoft/fast/issues/2432 */
            fill: currentcolor;
            height: 1em;
            min-height: calc(${y} * 4px);
            min-width: calc(${y} * 4px);
            width: 1em;
        }

        ::slotted([role="option"]),
        ::slotted(option) {
            flex: 0 0 auto;
        }
    `.withBehaviors(P(b`
                :host(:not([disabled]):hover),
                :host(:not([disabled]):active) {
                    border-color: ${d.Highlight};
                }

                :host(:not([disabled]):${$}) {
                    background-color: ${d.ButtonFace};
                    box-shadow: 0 0 0 calc(${B} * 1px) ${d.Highlight};
                    color: ${d.ButtonText};
                    fill: currentcolor;
                    forced-color-adjust: none;
                }

                :host(:not([disabled]):${$}) .listbox {
                    background: ${d.ButtonFace};
                }

                :host([disabled]) {
                    border-color: ${d.GrayText};
                    background-color: ${d.ButtonFace};
                    color: ${d.GrayText};
                    fill: currentcolor;
                    opacity: 1;
                    forced-color-adjust: none;
                }

                :host([disabled]:hover) {
                    background: ${d.ButtonFace};
                }

                :host([disabled]) .control {
                    color: ${d.GrayText};
                    border-color: ${d.GrayText};
                }

                :host([disabled]) .control .select-indicator {
                    fill: ${d.GrayText};
                }

                :host(:${$}) ::slotted([aria-selected="true"][role="option"]),
                :host(:${$}) ::slotted(option[aria-selected="true"]),
                :host(:${$}) ::slotted([aria-selected="true"][role="option"]:not([disabled])) {
                    background: ${d.Highlight};
                    border-color: ${d.ButtonText};
                    box-shadow: 0 0 0 calc(${B} * 1px) inset ${d.HighlightText};
                    color: ${d.HighlightText};
                    fill: currentcolor;
                }

                .start,
                .end,
                .indicator,
                .select-indicator,
                ::slotted(svg) {
                    color: ${d.ButtonText};
                    fill: currentcolor;
                }
            `))},vm=(i,t)=>b`
    ${vc(i)}

    :host(:empty) .listbox {
        display: none;
    }

    :host([disabled]) *,
    :host([disabled]) {
        cursor: ${at};
        user-select: none;
    }

    .selected-value {
        -webkit-appearance: none;
        background: transparent;
        border: none;
        color: inherit;
        font-size: ${U};
        line-height: ${G};
        height: calc(100% - (${R} * 1px));
        margin: auto 0;
        width: 100%;
    }

    .selected-value:hover,
    .selected-value:${$},
    .selected-value:disabled,
    .selected-value:active {
        outline: none;
    }
`;class ym extends Re{maxHeightChanged(t,e){this.updateComputedStylesheet()}updateComputedStylesheet(){this.computedStylesheet&&this.$fastController.removeStyles(this.computedStylesheet);const t=Math.floor(this.maxHeight/rc.getValueFor(this)).toString();this.computedStylesheet=b`
            :host {
                --listbox-max-height: ${t};
            }
        `,this.$fastController.addStyles(this.computedStylesheet)}}const xm=ym.compose({baseName:"combobox",baseClass:Re,template:Ku,styles:vm,shadowOptions:{delegatesFocus:!0},indicator:`
        <svg
            class="select-indicator"
            part="select-indicator"
            viewBox="0 0 12 7"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M11.85.65c.2.2.2.5 0 .7L6.4 6.84a.55.55 0 01-.78 0L.14 1.35a.5.5 0 11.71-.7L6 5.8 11.15.65c.2-.2.5-.2.7 0z"
            />
        </svg>
    `}),$m=(i,t)=>b`
    :host {
        display: flex;
        position: relative;
        flex-direction: column;
    }
`,wm=(i,t)=>b`
    :host {
        display: grid;
        padding: 1px 0;
        box-sizing: border-box;
        width: 100%;
        border-bottom: calc(${R} * 1px) solid ${Li};
    }

    :host(.header) {
    }

    :host(.sticky-header) {
        background: ${Tt};
        position: sticky;
        top: 0;
    }
`,km=(i,t)=>b`
        :host {
            padding: calc(${y} * 1px) calc(${y} * 3px);
            color: ${S};
            box-sizing: border-box;
            font-family: ${W};
            font-size: ${U};
            line-height: ${G};
            font-weight: 400;
            border: transparent calc(${B} * 1px) solid;
            overflow: hidden;
            white-space: nowrap;
            border-radius: calc(${M} * 1px);
        }

        :host(.column-header) {
            font-weight: 600;
        }

        :host(:${$}) {
            border: ${z} calc(${B} * 1px) solid;
            outline: none;
            color: ${S};
        }
    `.withBehaviors(P(b`
        :host {
            forced-color-adjust: none;
            border-color: transparent;
            background: ${d.Field};
            color: ${d.FieldText};
        }

        :host(:${$}) {
            border-color: ${d.FieldText};
            box-shadow: 0 0 0 2px inset ${d.Field};
            color: ${d.FieldText};
        }
        `)),Cm=Oe.compose({baseName:"data-grid-cell",template:Hu,styles:km}),Tm=wt.compose({baseName:"data-grid-row",template:zu,styles:wm}),Im=bt.compose({baseName:"data-grid",template:Lu,styles:$m}),Jn={toView(i){return i==null?null:i==null?void 0:i.toColorString()},fromView(i){if(i==null)return null;const t=ri(i);return t?Pe.create(t.r,t.g,t.b):null}},yc=b`
    :host {
        background-color: ${N};
        color: ${S};
    }
`.withBehaviors(P(b`
            :host {
                background-color: ${d.ButtonFace};
                box-shadow: 0 0 0 1px ${d.CanvasText};
                color: ${d.ButtonText};
            }
        `));function I(i){return(t,e)=>{t[e+"Changed"]=function(s,o){o!=null?i.setValueFor(this,o):i.deleteValueFor(this)}}}class T extends E{constructor(){super(),this.noPaint=!1;const t={handleChange:this.noPaintChanged.bind(this)};L.getNotifier(this).subscribe(t,"fillColor"),L.getNotifier(this).subscribe(t,"baseLayerLuminance")}noPaintChanged(){!this.noPaint&&(this.fillColor!==void 0||this.baseLayerLuminance)?this.$fastController.addStyles(yc):this.$fastController.removeStyles(yc)}}c([u({attribute:"no-paint",mode:"boolean"})],T.prototype,"noPaint",void 0),c([u({attribute:"fill-color",converter:Jn}),I(N)],T.prototype,"fillColor",void 0),c([u({attribute:"accent-color",converter:Jn,mode:"fromView"}),I(oc)],T.prototype,"accentColor",void 0),c([u({attribute:"neutral-color",converter:Jn,mode:"fromView"}),I(sc)],T.prototype,"neutralColor",void 0),c([u({converter:C}),I($e)],T.prototype,"density",void 0),c([u({attribute:"design-unit",converter:C}),I(y)],T.prototype,"designUnit",void 0),c([u({attribute:"direction"}),I(co)],T.prototype,"direction",void 0),c([u({attribute:"base-height-multiplier",converter:C}),I(vs)],T.prototype,"baseHeightMultiplier",void 0),c([u({attribute:"base-horizontal-spacing-multiplier",converter:C}),I(fg)],T.prototype,"baseHorizontalSpacingMultiplier",void 0),c([u({attribute:"control-corner-radius",converter:C}),I(M)],T.prototype,"controlCornerRadius",void 0),c([u({attribute:"stroke-width",converter:C}),I(R)],T.prototype,"strokeWidth",void 0),c([u({attribute:"focus-stroke-width",converter:C}),I(B)],T.prototype,"focusStrokeWidth",void 0),c([u({attribute:"disabled-opacity",converter:C}),I(ft)],T.prototype,"disabledOpacity",void 0),c([u({attribute:"type-ramp-minus-2-font-size"}),I(gg)],T.prototype,"typeRampMinus2FontSize",void 0),c([u({attribute:"type-ramp-minus-2-line-height"}),I(mg)],T.prototype,"typeRampMinus2LineHeight",void 0),c([u({attribute:"type-ramp-minus-1-font-size"}),I(ho)],T.prototype,"typeRampMinus1FontSize",void 0),c([u({attribute:"type-ramp-minus-1-line-height"}),I(uo)],T.prototype,"typeRampMinus1LineHeight",void 0),c([u({attribute:"type-ramp-base-font-size"}),I(U)],T.prototype,"typeRampBaseFontSize",void 0),c([u({attribute:"type-ramp-base-line-height"}),I(G)],T.prototype,"typeRampBaseLineHeight",void 0),c([u({attribute:"type-ramp-plus-1-font-size"}),I(bg)],T.prototype,"typeRampPlus1FontSize",void 0),c([u({attribute:"type-ramp-plus-1-line-height"}),I(vg)],T.prototype,"typeRampPlus1LineHeight",void 0),c([u({attribute:"type-ramp-plus-2-font-size"}),I(yg)],T.prototype,"typeRampPlus2FontSize",void 0),c([u({attribute:"type-ramp-plus-2-line-height"}),I(xg)],T.prototype,"typeRampPlus2LineHeight",void 0),c([u({attribute:"type-ramp-plus-3-font-size"}),I(El)],T.prototype,"typeRampPlus3FontSize",void 0),c([u({attribute:"type-ramp-plus-3-line-height"}),I(Ll)],T.prototype,"typeRampPlus3LineHeight",void 0),c([u({attribute:"type-ramp-plus-4-font-size"}),I($g)],T.prototype,"typeRampPlus4FontSize",void 0),c([u({attribute:"type-ramp-plus-4-line-height"}),I(wg)],T.prototype,"typeRampPlus4LineHeight",void 0),c([u({attribute:"type-ramp-plus-5-font-size"}),I(kg)],T.prototype,"typeRampPlus5FontSize",void 0),c([u({attribute:"type-ramp-plus-5-line-height"}),I(Cg)],T.prototype,"typeRampPlus5LineHeight",void 0),c([u({attribute:"type-ramp-plus-6-font-size"}),I(Tg)],T.prototype,"typeRampPlus6FontSize",void 0),c([u({attribute:"type-ramp-plus-6-line-height"}),I(Ig)],T.prototype,"typeRampPlus6LineHeight",void 0),c([u({attribute:"accent-fill-rest-delta",converter:C}),I(Sg)],T.prototype,"accentFillRestDelta",void 0),c([u({attribute:"accent-fill-hover-delta",converter:C}),I(Al)],T.prototype,"accentFillHoverDelta",void 0),c([u({attribute:"accent-fill-active-delta",converter:C}),I(Pl)],T.prototype,"accentFillActiveDelta",void 0),c([u({attribute:"accent-fill-focus-delta",converter:C}),I(Vl)],T.prototype,"accentFillFocusDelta",void 0),c([u({attribute:"accent-foreground-rest-delta",converter:C}),I(Ml)],T.prototype,"accentForegroundRestDelta",void 0),c([u({attribute:"accent-foreground-hover-delta",converter:C}),I(zl)],T.prototype,"accentForegroundHoverDelta",void 0),c([u({attribute:"accent-foreground-active-delta",converter:C}),I(Hl)],T.prototype,"accentForegroundActiveDelta",void 0),c([u({attribute:"accent-foreground-focus-delta",converter:C}),I(Bl)],T.prototype,"accentForegroundFocusDelta",void 0),c([u({attribute:"neutral-fill-rest-delta",converter:C}),I(ci)],T.prototype,"neutralFillRestDelta",void 0),c([u({attribute:"neutral-fill-hover-delta",converter:C}),I(hi)],T.prototype,"neutralFillHoverDelta",void 0),c([u({attribute:"neutral-fill-active-delta",converter:C}),I(di)],T.prototype,"neutralFillActiveDelta",void 0),c([u({attribute:"neutral-fill-focus-delta",converter:C}),I(jn)],T.prototype,"neutralFillFocusDelta",void 0),c([u({attribute:"neutral-fill-input-rest-delta",converter:C}),I(Nl)],T.prototype,"neutralFillInputRestDelta",void 0),c([u({attribute:"neutral-fill-input-hover-delta",converter:C}),I(jl)],T.prototype,"neutralFillInputHoverDelta",void 0),c([u({attribute:"neutral-fill-input-active-delta",converter:C}),I(_l)],T.prototype,"neutralFillInputActiveDelta",void 0),c([u({attribute:"neutral-fill-input-focus-delta",converter:C}),I(Ul)],T.prototype,"neutralFillInputFocusDelta",void 0),c([u({attribute:"neutral-fill-stealth-rest-delta",converter:C}),I(ql)],T.prototype,"neutralFillStealthRestDelta",void 0),c([u({attribute:"neutral-fill-stealth-hover-delta",converter:C}),I(Gl)],T.prototype,"neutralFillStealthHoverDelta",void 0),c([u({attribute:"neutral-fill-stealth-active-delta",converter:C}),I(Wl)],T.prototype,"neutralFillStealthActiveDelta",void 0),c([u({attribute:"neutral-fill-stealth-focus-delta",converter:C}),I(Xl)],T.prototype,"neutralFillStealthFocusDelta",void 0),c([u({attribute:"neutral-fill-strong-hover-delta",converter:C}),I(Yl)],T.prototype,"neutralFillStrongHoverDelta",void 0),c([u({attribute:"neutral-fill-strong-active-delta",converter:C}),I(Ql)],T.prototype,"neutralFillStrongActiveDelta",void 0),c([u({attribute:"neutral-fill-strong-focus-delta",converter:C}),I(Zl)],T.prototype,"neutralFillStrongFocusDelta",void 0),c([u({attribute:"base-layer-luminance",converter:C}),I(li)],T.prototype,"baseLayerLuminance",void 0),c([u({attribute:"neutral-fill-layer-rest-delta",converter:C}),I(ui)],T.prototype,"neutralFillLayerRestDelta",void 0),c([u({attribute:"neutral-stroke-divider-rest-delta",converter:C}),I(ic)],T.prototype,"neutralStrokeDividerRestDelta",void 0),c([u({attribute:"neutral-stroke-rest-delta",converter:C}),I(Jl)],T.prototype,"neutralStrokeRestDelta",void 0),c([u({attribute:"neutral-stroke-hover-delta",converter:C}),I(Kl)],T.prototype,"neutralStrokeHoverDelta",void 0),c([u({attribute:"neutral-stroke-active-delta",converter:C}),I(tc)],T.prototype,"neutralStrokeActiveDelta",void 0),c([u({attribute:"neutral-stroke-focus-delta",converter:C}),I(ec)],T.prototype,"neutralStrokeFocusDelta",void 0);const Sm=(i,t)=>v`
    <slot></slot>
`,Fm=(i,t)=>b`
    ${H("block")}
`,Om=T.compose({baseName:"design-system-provider",template:Sm,styles:Fm}),Rm=(i,t)=>b`
    :host([hidden]) {
        display: none;
    }

    :host {
        --elevation: 14;
        --dialog-height: 480px;
        --dialog-width: 640px;
        display: block;
    }

    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.3);
        touch-action: none;
    }

    .positioning-region {
        display: flex;
        justify-content: center;
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        overflow: auto;
    }

    .control {
        ${Ai}
        margin-top: auto;
        margin-bottom: auto;
        width: var(--dialog-width);
        height: var(--dialog-height);
        background-color: ${N};
        z-index: 1;
        border-radius: calc(${M} * 1px);
        border: calc(${R} * 1px) solid transparent;
    }
`,Dm=ae.compose({baseName:"dialog",template:pp,styles:Rm}),Em=(i,t)=>b`
    .disclosure {
        transition: height 0.35s;
    }

    .disclosure .invoker::-webkit-details-marker {
        display: none;
    }

    .disclosure .invoker {
        list-style-type: none;
    }

    :host([appearance="accent"]) .invoker {
        background: ${X};
        color: ${oe};
        font-family: ${W};
        font-size: ${U};
        border-radius: calc(${M} * 1px);
        outline: none;
        cursor: pointer;
        margin: 16px 0;
        padding: 12px;
        max-width: max-content;
    }

    :host([appearance="accent"]) .invoker:active {
        background: ${ct};
        color: ${ne};
    }

    :host([appearance="accent"]) .invoker:hover {
        background: ${gt};
        color: ${we};
    }

    :host([appearance="lightweight"]) .invoker {
        background: transparent;
        color: ${Ct};
        border-bottom: calc(${R} * 1px) solid ${Ct};
        cursor: pointer;
        width: max-content;
        margin: 16px 0;
    }

    :host([appearance="lightweight"]) .invoker:active {
        border-bottom-color: ${ke};
    }

    :host([appearance="lightweight"]) .invoker:hover {
        border-bottom-color: ${pi};
    }

    .disclosure[open] .invoker ~ * {
        animation: fadeIn 0.5s ease-in-out;
    }

    @keyframes fadeIn {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }
`;class xc extends eo{constructor(){super(...arguments),this.height=0,this.totalHeight=0}connectedCallback(){super.connectedCallback(),this.appearance||(this.appearance="accent")}appearanceChanged(t,e){t!==e&&(this.classList.add(e),this.classList.remove(t))}onToggle(){super.onToggle(),this.details.style.setProperty("height",`${this.disclosureHeight}px`)}setup(){super.setup();const t=()=>this.details.getBoundingClientRect().height;this.show(),this.totalHeight=t(),this.hide(),this.height=t(),this.expanded&&this.show()}get disclosureHeight(){return this.expanded?this.totalHeight:this.height}}c([u],xc.prototype,"appearance",void 0);const Lm=xc.compose({baseName:"disclosure",baseClass:eo,template:fp,styles:Em}),Am=(i,t)=>b`
        ${H("block")} :host {
            box-sizing: content-box;
            height: 0;
            margin: calc(${y} * 1px) 0;
            border-top: calc(${R} * 1px) solid ${Li};
            border-left: none;
        }

        :host([orientation="vertical"]) {
            height: 100%;
            margin: 0 calc(${y} * 1px);
            border-top: none;
            border-left: calc(${R} * 1px) solid ${Li};
        }
    `,Pm=Cn.compose({baseName:"divider",template:gp,styles:Am}),Vm=(i,t)=>b`
    ${H("inline-flex")} :host {
        width: calc(${D} * 1px);
        height: calc(${D} * 1px);
        justify-content: center;
        align-items: center;
        margin: 0;
        position: relative;
        fill: currentcolor;
        color: ${oe};
        background: transparent;
        outline: none;
        border: none;
        padding: 0;
    }

    :host::before {
        content: "";
        background: ${X};
        border: calc(${R} * 1px) solid ${X};
        border-radius: 50%;
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        transition: all 0.1s ease-in-out;
    }

    .next,
    .previous {
        position: relative;
        /* TODO: adaptive typography https://github.com/microsoft/fast/issues/2432 */
        width: 16px;
        height: 16px;
        display: grid;
    }

    :host([disabled]) {
        opacity: ${ft};
        cursor: ${at};
        fill: currentcolor;
        color: ${S};
        pointer-events: none;
    }

    :host([disabled])::before,
    :host([disabled]:hover)::before,
    :host([disabled]:active)::before {
        background: ${re};
        border-color: ${pe};
    }

    :host(:hover) {
        color: ${we};
    }

    :host(:hover)::before {
        background: ${gt};
        border-color: ${gt};
    }

    :host(:active) {
        color: ${ne};
    }

    :host(:active)::before {
        background: ${ct};
        border-color: ${ct};
    }

    :host(:${$}) {
        outline: none;
    }

    :host(:${$})::before {
        box-shadow: 0 0 0 calc((${B} - ${R}) * 1px) ${z} inset,
            0 0 0 calc((${B} + ${R}) * 1px) ${yo} inset;
        border-color: ${z};
    }

    :host::-moz-focus-inner {
        border: 0;
    }
`.withBehaviors(P(b`
            :host {
                background: ${d.Canvas};
            }
            :host .next,
            :host .previous {
                color: ${d.ButtonText};
                fill: currentcolor;
            }
            :host::before {
                background: ${d.Canvas};
                border-color: ${d.ButtonText};
            }
            :host(:hover)::before {
                forced-color-adjust: none;
                background: ${d.Highlight};
                border-color: ${d.ButtonText};
                opacity: 1;
            }
            :host(:hover) .next,
            :host(:hover) .previous  {
                forced-color-adjust: none;
                color: ${d.HighlightText};
                fill: currentcolor;
            }
            :host([disabled]) {
                opacity: 1;
            }
            :host([disabled])::before,
            :host([disabled]:hover)::before,
            :host([disabled]) .next,
            :host([disabled]) .previous {
                forced-color-adjust: none;
                background: ${d.Canvas};
                border-color: ${d.GrayText};
                color: ${d.GrayText};
                fill: ${d.GrayText};
            }
            :host(:${$})::before {
                forced-color-adjust: none;
                border-color: ${d.Highlight};
                box-shadow: 0 0 0 calc((${B} - ${R}) * 1px) ${d.Highlight} inset;
            }
        `)),Mm=je.compose({baseName:"flipper",template:bp,styles:Vm,next:`
        <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M4.023 15.273L11.29 8 4.023.727l.704-.704L12.71 8l-7.984 7.977-.704-.704z"
            />
        </svg>
    `,previous:`
        <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M11.273 15.977L3.29 8 11.273.023l.704.704L4.71 8l7.266 7.273-.704.704z"
            />
        </svg>
    `}),zm=b`
    .scroll-prev {
        right: auto;
        left: 0;
    }

    .scroll.scroll-next::before,
    .scroll-next .scroll-action {
        left: auto;
        right: 0;
    }

    .scroll.scroll-next::before {
        background: linear-gradient(to right, transparent, var(--scroll-fade-next));
    }

    .scroll-next .scroll-action {
        transform: translate(50%, -50%);
    }
`,Hm=b`
    .scroll.scroll-next {
        right: auto;
        left: 0;
    }

    .scroll.scroll-next::before {
        background: linear-gradient(to right, var(--scroll-fade-next), transparent);
        left: auto;
        right: 0;
    }

    .scroll.scroll-prev::before {
        background: linear-gradient(to right, transparent, var(--scroll-fade-previous));
    }

    .scroll-prev .scroll-action {
        left: auto;
        right: 0;
        transform: translate(50%, -50%);
    }
`,Bm=b`
    .scroll-area {
        position: relative;
    }

    div.scroll-view {
        overflow-x: hidden;
    }

    .scroll {
        bottom: 0;
        pointer-events: none;
        position: absolute;
        right: 0;
        top: 0;
        user-select: none;
        width: 100px;
    }

    .scroll.disabled {
        display: none;
    }

    .scroll::before,
    .scroll-action {
        left: 0;
        position: absolute;
    }

    .scroll::before {
        background: linear-gradient(to right, var(--scroll-fade-previous), transparent);
        content: "";
        display: block;
        height: 100%;
        width: 100%;
    }

    .scroll-action {
        pointer-events: auto;
        right: auto;
        top: 50%;
        transform: translate(-50%, -50%);
    }
`.withBehaviors(new Pi(zm,Hm)),Nm=(i,t)=>b`
    ${H("block")} :host {
        --scroll-align: center;
        --scroll-item-spacing: 5px;
        contain: layout;
        position: relative;
    }

    .scroll-view {
        overflow-x: auto;
        scrollbar-width: none;
    }

    ::-webkit-scrollbar {
        display: none;
    }

    .content-container {
        align-items: var(--scroll-align);
        display: inline-flex;
        flex-wrap: nowrap;
        position: relative;
    }

    .content-container ::slotted(*) {
        margin-right: var(--scroll-item-spacing);
    }

    .content-container ::slotted(*:last-child) {
        margin-right: 0;
    }
`;class jm extends Ee{connectedCallback(){super.connectedCallback(),this.view!=="mobile"&&this.$fastController.addStyles(Bm)}}const _m=jm.compose({baseName:"horizontal-scroll",baseClass:Ee,template:Wp,styles:Nm,nextFlipper:i=>v`
        <${i.tagFor(je)}
            @click="${t=>t.scrollToNext()}"
            aria-hidden="${t=>t.flippersHiddenFromAT}"
        ></${i.tagFor(je)}>
    `,previousFlipper:i=>v`
        <${i.tagFor(je)}
            @click="${t=>t.scrollToPrevious()}"
            direction="previous"
            aria-hidden="${t=>t.flippersHiddenFromAT}"
        ></${i.tagFor(je)}>
    `}),Um=(i,t)=>b`
        ${H("inline-flex")} :host {
            align-items: center;
            font-family: ${W};
            border-radius: calc(${M} * 1px);
            border: calc(${B} * 1px) solid transparent;
            box-sizing: border-box;
            background: ${re};
            color: ${S};
            cursor: pointer;
            flex: 0 0 auto;
            fill: currentcolor;
            font-size: ${U};
            height: calc(${D} * 1px);
            line-height: ${G};
            margin: 0 calc((${y} - ${B}) * 1px);
            outline: none;
            overflow: hidden;
            padding: 0 1ch;
            user-select: none;
            white-space: nowrap;
        }

        :host(:not([disabled]):not([aria-selected="true"]):hover) {
            background: ${mi};
        }

        :host(:not([disabled]):not([aria-selected="true"]):active) {
            background: ${bi};
        }

        :host([aria-selected="true"]) {
            background: ${X};
            color: ${oe};
        }

        :host(:not([disabled])[aria-selected="true"]:hover) {
            background: ${gt};
            color: ${we};
        }

        :host(:not([disabled])[aria-selected="true"]:active) {
            background: ${ct};
            color: ${ne};
        }

        :host([disabled]) {
            cursor: ${at};
            opacity: ${ft};
        }

        .content {
            grid-column-start: 2;
            justify-self: start;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .start,
        .end,
        ::slotted(svg) {
            display: flex;
        }

        ::slotted(svg) {
            /* TODO: adaptive typography https://github.com/microsoft/fast/issues/2432 */
            height: calc(${y} * 4px);
            width: calc(${y} * 4px);
        }

        ::slotted([slot="end"]) {
            margin-inline-start: 1ch;
        }

        ::slotted([slot="start"]) {
            margin-inline-end: 1ch;
        }

        :host([aria-checked="true"][aria-selected="false"]) {
            border-color: ${z};
        }

        :host([aria-checked="true"][aria-selected="true"]) {
            border-color: ${z};
            box-shadow: 0 0 0 calc(${B} * 2 * 1px) inset
                ${yo};
        }
    `.withBehaviors(P(b`
                :host {
                    border-color: transparent;
                    forced-color-adjust: none;
                    color: ${d.ButtonText};
                    fill: currentcolor;
                }

                :host(:not([aria-selected="true"]):hover),
                :host([aria-selected="true"]) {
                    background: ${d.Highlight};
                    color: ${d.HighlightText};
                }

                :host([disabled]),
                :host([disabled][aria-selected="false"]:hover) {
                    background: ${d.Canvas};
                    color: ${d.GrayText};
                    fill: currentcolor;
                    opacity: 1;
                }

                :host([aria-checked="true"][aria-selected="false"]) {
                    background: ${d.ButtonFace};
                    color: ${d.ButtonText};
                    border-color: ${d.ButtonText};
                }

                :host([aria-checked="true"][aria-selected="true"]),
                :host([aria-checked="true"][aria-selected="true"]:hover) {
                    background: ${d.Highlight};
                    color: ${d.HighlightText};
                    border-color: ${d.ButtonText};
                }
            `)),$c=ue.compose({baseName:"option",template:vp,styles:Um});class qm extends _e{sizeChanged(t,e){super.sizeChanged(t,e),this.updateComputedStylesheet()}updateComputedStylesheet(){this.computedStylesheet&&this.$fastController.removeStyles(this.computedStylesheet);const t=`${this.size}`;this.computedStylesheet=b`
            :host {
                --size: ${t};
            }
        `,this.$fastController.addStyles(this.computedStylesheet)}}const Gm=qm.compose({baseName:"listbox",baseClass:_e,template:yp,styles:bc}),Wm=(i,t)=>b`
        ${H("grid")} :host {
            contain: layout;
            overflow: visible;
            font-family: ${W};
            outline: none;
            box-sizing: border-box;
            height: calc(${D} * 1px);
            grid-template-columns: minmax(42px, auto) 1fr minmax(42px, auto);
            grid-template-rows: auto;
            justify-items: center;
            align-items: center;
            padding: 0;
            margin: 0 calc(${y} * 1px);
            white-space: nowrap;
            background: ${re};
            color: ${S};
            fill: currentcolor;
            cursor: pointer;
            font-size: ${U};
            line-height: ${G};
            border-radius: calc(${M} * 1px);
            border: calc(${B} * 1px) solid transparent;
        }

        :host(:hover) {
            position: relative;
            z-index: 1;
        }

        :host(.indent-0) {
            grid-template-columns: auto 1fr minmax(42px, auto);
        }
        :host(.indent-0) .content {
            grid-column: 1;
            grid-row: 1;
            margin-inline-start: 10px;
        }
        :host(.indent-0) .expand-collapse-glyph-container {
            grid-column: 5;
            grid-row: 1;
        }
        :host(.indent-2) {
            grid-template-columns: minmax(42px, auto) minmax(42px, auto) 1fr minmax(42px, auto) minmax(42px, auto);
        }
        :host(.indent-2) .content {
            grid-column: 3;
            grid-row: 1;
            margin-inline-start: 10px;
        }
        :host(.indent-2) .expand-collapse-glyph-container {
            grid-column: 5;
            grid-row: 1;
        }
        :host(.indent-2) .start {
            grid-column: 2;
        }
        :host(.indent-2) .end {
            grid-column: 4;
        }

        :host(:${$}) {
            border-color: ${z};
            background: ${Wn};
            color: ${S};
        }

        :host(:hover) {
            background: ${mi};
            color: ${S};
        }

        :host(:active) {
            background: ${bi};
        }

        :host([aria-checked="true"]),
        :host(.expanded) {
            background: ${Tt};
            color: ${S};
        }

        :host([disabled]) {
            cursor: ${at};
            opacity: ${ft};
        }

        :host([disabled]:hover) {
            color: ${S};
            fill: currentcolor;
            background: ${re};
        }

        :host([disabled]:hover) .start,
        :host([disabled]:hover) .end,
        :host([disabled]:hover)::slotted(svg) {
            fill: ${S};
        }

        .expand-collapse-glyph {
            /* TODO: adaptive typography https://github.com/microsoft/fast/issues/2432 */
            width: 16px;
            height: 16px;
            fill: currentcolor;
        }

        .content {
            grid-column-start: 2;
            justify-self: start;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .start,
        .end {
            display: flex;
            justify-content: center;
        }

        ::slotted(svg) {
            /* TODO: adaptive typography https://github.com/microsoft/fast/issues/2432 */
            width: 16px;
            height: 16px;
        }

        :host(:hover) .start,
        :host(:hover) .end,
        :host(:hover)::slotted(svg),
        :host(:active) .start,
        :host(:active) .end,
        :host(:active)::slotted(svg) {
            fill: ${S};
        }

        :host(.indent-0[aria-haspopup="menu"]) {
            display: grid;
            grid-template-columns: minmax(42px, auto) auto 1fr minmax(42px, auto) minmax(42px, auto);
            align-items: center;
            min-height: 32px;
        }

        :host(.indent-1[aria-haspopup="menu"]),
        :host(.indent-1[role="menuitemcheckbox"]),
        :host(.indent-1[role="menuitemradio"]) {
            display: grid;
            grid-template-columns: minmax(42px, auto) auto 1fr minmax(42px, auto) minmax(42px, auto);
            align-items: center;
            min-height: 32px;
        }

        :host(.indent-2:not([aria-haspopup="menu"])) .end {
            grid-column: 5;
        }

        :host .input-container,
        :host .expand-collapse-glyph-container {
            display: none;
        }

        :host([aria-haspopup="menu"]) .expand-collapse-glyph-container,
        :host([role="menuitemcheckbox"]) .input-container,
        :host([role="menuitemradio"]) .input-container {
            display: grid;
            margin-inline-end: 10px;
        }

        :host([aria-haspopup="menu"]) .content,
        :host([role="menuitemcheckbox"]) .content,
        :host([role="menuitemradio"]) .content {
            grid-column-start: 3;
        }

        :host([aria-haspopup="menu"].indent-0) .content {
            grid-column-start: 1;
        }

        :host([aria-haspopup="menu"]) .end,
        :host([role="menuitemcheckbox"]) .end,
        :host([role="menuitemradio"]) .end {
            grid-column-start: 4;
        }

        :host .expand-collapse,
        :host .checkbox,
        :host .radio {
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            width: 20px;
            height: 20px;
            box-sizing: border-box;
            outline: none;
            margin-inline-start: 10px;
        }

        :host .checkbox,
        :host .radio {
            border: calc(${R} * 1px) solid ${S};
        }

        :host([aria-checked="true"]) .checkbox,
        :host([aria-checked="true"]) .radio {
            background: ${X};
            border-color: ${X};
        }

        :host .checkbox {
            border-radius: calc(${M} * 1px);
        }

        :host .radio {
            border-radius: 999px;
        }

        :host .checkbox-indicator,
        :host .radio-indicator,
        :host .expand-collapse-indicator,
        ::slotted([slot="checkbox-indicator"]),
        ::slotted([slot="radio-indicator"]),
        ::slotted([slot="expand-collapse-indicator"]) {
            display: none;
        }

        ::slotted([slot="end"]:not(svg)) {
            margin-inline-end: 10px;
            color: ${$s}
        }

        :host([aria-checked="true"]) .checkbox-indicator,
        :host([aria-checked="true"]) ::slotted([slot="checkbox-indicator"]) {
            width: 100%;
            height: 100%;
            display: block;
            fill: ${oe};
            pointer-events: none;
        }

        :host([aria-checked="true"]) .radio-indicator {
            position: absolute;
            top: 4px;
            left: 4px;
            right: 4px;
            bottom: 4px;
            border-radius: 999px;
            display: block;
            background: ${oe};
            pointer-events: none;
        }

        :host([aria-checked="true"]) ::slotted([slot="radio-indicator"]) {
            display: block;
            pointer-events: none;
        }
    `.withBehaviors(P(b`
            :host {
                border-color: transparent;
                color: ${d.ButtonText};
                forced-color-adjust: none;
            }

            :host(:hover) {
                background: ${d.Highlight};
                color: ${d.HighlightText};
            }

            :host(:hover) .start,
            :host(:hover) .end,
            :host(:hover)::slotted(svg),
            :host(:active) .start,
            :host(:active) .end,
            :host(:active)::slotted(svg) {
                fill: ${d.HighlightText};
            }

            :host(.expanded) {
                background: ${d.Highlight};
                border-color: ${d.Highlight};
                color: ${d.HighlightText};
            }

            :host(:${$}) {
                background: ${d.Highlight};
                border-color: ${d.ButtonText};
                box-shadow: 0 0 0 calc(${B} * 1px) inset ${d.HighlightText};
                color: ${d.HighlightText};
                fill: currentcolor;
            }

            :host([disabled]),
            :host([disabled]:hover),
            :host([disabled]:hover) .start,
            :host([disabled]:hover) .end,
            :host([disabled]:hover)::slotted(svg) {
                background: ${d.Canvas};
                color: ${d.GrayText};
                fill: currentcolor;
                opacity: 1;
            }

            :host .expanded-toggle,
            :host .checkbox,
            :host .radio{
                border-color: ${d.ButtonText};
                background: ${d.HighlightText};
            }

            :host([checked="true"]) .checkbox,
            :host([checked="true"]) .radio {
                background: ${d.HighlightText};
                border-color: ${d.HighlightText};
            }

            :host(:hover) .expanded-toggle,
            :host(:hover) .checkbox,
            :host(:hover) .radio,
            :host(:${$}) .expanded-toggle,
            :host(:${$}) .checkbox,
            :host(:${$}) .radio,
            :host([checked="true"]:hover) .checkbox,
            :host([checked="true"]:hover) .radio,
            :host([checked="true"]:${$}) .checkbox,
            :host([checked="true"]:${$}) .radio {
                border-color: ${d.HighlightText};
            }

            :host([aria-checked="true"]) {
                background: ${d.Highlight};
                color: ${d.HighlightText};
            }

            :host([aria-checked="true"]) .checkbox-indicator,
            :host([aria-checked="true"]) ::slotted([slot="checkbox-indicator"]),
            :host([aria-checked="true"]) ::slotted([slot="radio-indicator"]) {
                fill: ${d.Highlight};
            }

            :host([aria-checked="true"]) .radio-indicator {
                background: ${d.Highlight};
            }

            ::slotted([slot="end"]:not(svg)) {
                color: ${d.ButtonText};
            }

            :host(:hover) ::slotted([slot="end"]:not(svg)),
            :host(:${$}) ::slotted([slot="end"]:not(svg)) {
                color: ${d.HighlightText};
            }
        `),new Pi(b`
                .expand-collapse-glyph {
                    transform: rotate(0deg);
                }
            `,b`
                .expand-collapse-glyph {
                    transform: rotate(180deg);
                }
            `)),Xm=se.compose({baseName:"menu-item",template:Lp,styles:Wm,checkboxIndicator:`
        <svg
            part="checkbox-indicator"
            class="checkbox-indicator"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M8.143 12.6697L15.235 4.5L16.8 5.90363L8.23812 15.7667L3.80005 11.2556L5.27591 9.7555L8.143 12.6697Z"
            />
        </svg>
    `,expandCollapseGlyph:`
        <svg
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
            class="expand-collapse-glyph"
            part="expand-collapse-glyph"
        >
            <path
                d="M5.00001 12.3263C5.00124 12.5147 5.05566 12.699 5.15699 12.8578C5.25831 13.0167 5.40243 13.1437 5.57273 13.2242C5.74304 13.3047 5.9326 13.3354 6.11959 13.3128C6.30659 13.2902 6.4834 13.2152 6.62967 13.0965L10.8988 8.83532C11.0739 8.69473 11.2153 8.51658 11.3124 8.31402C11.4096 8.11146 11.46 7.88966 11.46 7.66499C11.46 7.44033 11.4096 7.21853 11.3124 7.01597C11.2153 6.81341 11.0739 6.63526 10.8988 6.49467L6.62967 2.22347C6.48274 2.10422 6.30501 2.02912 6.11712 2.00691C5.92923 1.9847 5.73889 2.01628 5.56823 2.09799C5.39757 2.17969 5.25358 2.30817 5.153 2.46849C5.05241 2.62882 4.99936 2.8144 5.00001 3.00369V12.3263Z"
            />
        </svg>
    `,radioIndicator:`
        <span part="radio-indicator" class="radio-indicator"></span>
    `}),Ym=(i,t)=>b`
        ${H("block")} :host {
            --elevation: 11;
            background: ${N};
            border: calc(${R} * 1px) solid transparent;
            ${Ai}
            margin: 0;
            border-radius: calc(${M} * 1px);
            padding: calc(${y} * 1px) 0;
            max-width: 368px;
            min-width: 64px;
        }

        :host([slot="submenu"]) {
            width: max-content;
            margin: 0 calc(${y} * 1px);
        }

        ::slotted(hr) {
            box-sizing: content-box;
            height: 0;
            margin: 0;
            border: none;
            border-top: calc(${R} * 1px) solid ${Li};
        }
    `.withBehaviors(P(b`
                :host {
                    background: ${d.Canvas};
                    border-color: ${d.CanvasText};
                }
            `));class Qm extends Ts{connectedCallback(){super.connectedCallback(),N.setValueFor(this,Un)}}const Zm=Qm.compose({baseName:"menu",template:Ap,styles:Ym}),Jm=(i,t)=>b`
    ${H("inline-block")} :host {
        font-family: ${W};
        outline: none;
        user-select: none;
    }

    .root {
        box-sizing: border-box;
        position: relative;
        display: flex;
        flex-direction: row;
        color: ${S};
        background: ${Ve};
        border-radius: calc(${M} * 1px);
        border: calc(${R} * 1px) solid ${X};
        height: calc(${D} * 1px);
        align-items: baseline;
    }

    .control {
        -webkit-appearance: none;
        font: inherit;
        background: transparent;
        border: 0;
        color: inherit;
        height: calc(100% - 4px);
        width: 100%;
        margin-top: auto;
        margin-bottom: auto;
        border: none;
        padding: 0 calc(${y} * 2px + 1px);
        font-size: ${U};
        line-height: ${G};
    }

    .control:hover,
    .control:${$},
    .control:disabled,
    .control:active {
        outline: none;
    }

    .controls {
        opacity: 0;
    }

    .label {
        display: block;
        color: ${S};
        cursor: pointer;
        font-size: ${U};
        line-height: ${G};
        margin-bottom: 4px;
    }

    .label__hidden {
        display: none;
        visibility: hidden;
    }

    .start,
    .control,
    .controls,
    .end {
        align-self: center;
    }

    .start,
    .end {
        margin: auto;
        fill: currentcolor;
    }

    .step-up-glyph,
    .step-down-glyph {
        display: block;
        padding: 4px 10px;
        cursor: pointer;
    }

    .step-up-glyph:before,
    .step-down-glyph:before {
        content: '';
        display: block;
        border: solid transparent 6px;
    }

    .step-up-glyph:before {
        border-bottom-color: ${S};
    }

    .step-down-glyph:before {
        border-top-color: ${S};
    }

    ::slotted(svg) {
        /* TODO: adaptive typography https://github.com/microsoft/fast/issues/2432 */
        width: 16px;
        height: 16px;
    }

    .start {
        margin-inline-start: 11px;
    }

    .end {
        margin-inline-end: 11px;
    }

    :host(:hover:not([disabled])) .root {
        background: ${Jt};
        border-color: ${gt};
    }

    :host(:active:not([disabled])) .root {
        background: ${Jt};
        border-color: ${ct};
    }

    :host(:focus-within:not([disabled])) .root {
        border-color: ${z};
        box-shadow: 0 0 0 calc(${B} * 1px) ${z} inset;
    }

    :host(:hover:not([disabled])) .controls,
    :host(:focus-within:not([disabled])) .controls {
        opacity: 1;
    }

    :host([appearance="filled"]) .root {
        background: ${Tt};
    }

    :host([appearance="filled"]:hover:not([disabled])) .root {
        background: ${gi};
    }

    :host([disabled]) .label,
    :host([readonly]) .label,
    :host([readonly]) .control,
    :host([disabled]) .control {
        cursor: ${at};
    }

    :host([disabled]) {
        opacity: ${ft};
    }

    :host([disabled]) .control {
        border-color: ${pe};
    }
`.withBehaviors(P(b`
                .root,
                :host([appearance="filled"]) .root {
                    forced-color-adjust: none;
                    background: ${d.Field};
                    border-color: ${d.FieldText};
                }
                :host(:hover:not([disabled])) .root,
                :host([appearance="filled"]:hover:not([disabled])) .root,
                :host([appearance="filled"]:hover) .root {
                    background: ${d.Field};
                    border-color: ${d.Highlight};
                }
                .start,
                .end {
                    fill: currentcolor;
                }
                :host([disabled]) {
                    opacity: 1;
                }
                :host([disabled]) .root,
                :host([appearance="filled"]:hover[disabled]) .root {
                    border-color: ${d.GrayText};
                    background: ${d.Field};
                }
                :host(:focus-within:enabled) .root {
                    border-color: ${d.Highlight};
                    box-shadow: 0 0 0 1px ${d.Highlight} inset;
                }
                input::placeholder {
                    color: ${d.GrayText};
                }
            `));class wc extends Mt{constructor(){super(...arguments),this.appearance="outline"}}c([u],wc.prototype,"appearance",void 0);const Km=wc.compose({baseName:"number-field",baseClass:Mt,styles:Jm,template:Pp,shadowOptions:{delegatesFocus:!0},stepDownGlyph:`
        <span class="step-down-glyph" part="step-down-glyph"></span>
    `,stepUpGlyph:`
        <span class="step-up-glyph" part="step-up-glyph"></span>
    `}),tb=(i,t)=>b`
        .region {
            z-index: 1000;
            overflow: hidden;
            display: flex;
            font-family: ${W};
            font-size: ${U};
        }

        .loaded {
            opacity: 1;
            pointer-events: none;
        }

        .loading-display,
        .no-options-display {
            background: ${N};
            width: 100%;
            min-height: calc(${D} * 1px);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-items: center;
            padding: calc(${y} * 1px);
        }

        .loading-progress {
            width: 42px;
            height: 42px;
        }

        .bottom {
            flex-direction: column;
        }

        .top {
            flex-direction: column-reverse;
        }
    `,eb=(i,t)=>b`
        :host {
            background: ${N};
            --elevation: 11;
            /* TODO: a mechanism to manage z-index across components
            https://github.com/microsoft/fast/issues/3813 */
            z-index: 1000;
            display: flex;
            width: 100%;
            max-height: 100%;
            min-height: 58px;
            box-sizing: border-box;
            flex-direction: column;
            overflow-y: auto;
            overflow-x: hidden;
            pointer-events: auto;
            border-radius: calc(${M} * 1px);
            padding: calc(${y} * 1px) 0;
            border: calc(${R} * 1px) solid transparent;
            ${Ai}
        }

        .suggestions-available-alert {
            height: 0;
            opacity: 0;
            overflow: hidden;
        }
    `.withBehaviors(P(b`
                :host {
                    background: ${d.Canvas};
                    border-color: ${d.CanvasText};
                }
            `)),ib=(i,t)=>b`
        :host {
            display: flex;
            align-items: center;
            justify-items: center;
            font-family: ${W};
            border-radius: calc(${M} * 1px);
            border: calc(${B} * 1px) solid transparent;
            box-sizing: border-box;
            background: ${re};
            color: ${S};
            cursor: pointer;
            fill: currentcolor;
            font-size: ${U};
            min-height: calc(${D} * 1px);
            line-height: ${G};
            margin: 0 calc(${y} * 1px);
            outline: none;
            overflow: hidden;
            padding: 0 calc(${y} * 2.25px);
            user-select: none;
            white-space: nowrap;
        }

        :host(:${$}[role="listitem"]) {
            border-color: ${z};
            background: ${Wn};
        }

        :host(:hover) {
            background: ${mi};
        }

        :host(:active) {
            background: ${bi};
        }

        :host([aria-selected="true"]) {
            background: ${X};
            color: ${oe};
        }

        :host([aria-selected="true"]:hover) {
            background: ${gt};
            color: ${we};
        }

        :host([aria-selected="true"]:active) {
            background: ${ct};
            color: ${ne};
        }
    `.withBehaviors(P(b`
                :host {
                    border-color: transparent;
                    forced-color-adjust: none;
                    color: ${d.ButtonText};
                    fill: currentcolor;
                }

                :host(:not([aria-selected="true"]):hover),
                :host([aria-selected="true"]) {
                    background: ${d.Highlight};
                    color: ${d.HighlightText};
                }

                :host([disabled]),
                :host([disabled]:not([aria-selected="true"]):hover) {
                    background: ${d.Canvas};
                    color: ${d.GrayText};
                    fill: currentcolor;
                    opacity: 1;
                }
            `)),sb=(i,t)=>b`
        :host {
            display: flex;
            flex-direction: row;
            column-gap: calc(${y} * 1px);
            row-gap: calc(${y} * 1px);
            flex-wrap: wrap;
        }

        ::slotted([role="combobox"]) {
            min-width: 260px;
            width: auto;
            box-sizing: border-box;
            color: ${S};
            background: ${Ve};
            border-radius: calc(${M} * 1px);
            border: calc(${R} * 1px) solid ${X};
            height: calc(${D} * 1px);
            font-family: ${W};
            outline: none;
            user-select: none;
            font-size: ${U};
            line-height: ${G};
            padding: 0 calc(${y} * 2px + 1px);
        }

        ::slotted([role="combobox"]:active) { {
            background: ${Jt};
            border-color: ${ct};
        }

        ::slotted([role="combobox"]:focus-within) {
            border-color: ${z};
            box-shadow: 0 0 0 1px ${z} inset;
        }
    `.withBehaviors(P(b`
                ::slotted([role="combobox"]:active) {
                    background: ${d.Field};
                    border-color: ${d.Highlight};
                }
                ::slotted([role="combobox"]:focus-within) {
                    border-color: ${d.Highlight};
                    box-shadow: 0 0 0 1px ${d.Highlight} inset;
                }
                ::slotted(input:placeholder) {
                    color: ${d.GrayText};
                }
            `)),ob=(i,t)=>b`
        :host {
            display: flex;
            align-items: center;
            justify-items: center;
            font-family: ${W};
            border-radius: calc(${M} * 1px);
            border: calc(${B} * 1px) solid transparent;
            box-sizing: border-box;
            background: ${re};
            color: ${S};
            cursor: pointer;
            fill: currentcolor;
            font-size: ${U};
            height: calc(${D} * 1px);
            line-height: ${G};
            outline: none;
            overflow: hidden;
            padding: 0 calc(${y} * 2.25px);
            user-select: none;
            white-space: nowrap;
        }

        :host(:hover) {
            background: ${mi};
        }

        :host(:active) {
            background: ${bi};
        }

        :host(:${$}) {
            background: ${Wn};
            border-color: ${z};
        }

        :host([aria-selected="true"]) {
            background: ${X};
            color: ${ne};
        }
    `.withBehaviors(P(b`
                :host {
                    border-color: transparent;
                    forced-color-adjust: none;
                    color: ${d.ButtonText};
                    fill: currentcolor;
                }

                :host(:not([aria-selected="true"]):hover),
                :host([aria-selected="true"]) {
                    background: ${d.Highlight};
                    color: ${d.HighlightText};
                }

                :host([disabled]),
                :host([disabled]:not([aria-selected="true"]):hover) {
                    background: ${d.Canvas};
                    color: ${d.GrayText};
                    fill: currentcolor;
                    opacity: 1;
                }
            `)),nb=_.compose({baseName:"picker",template:Cp,styles:tb,shadowOptions:{}});class rb extends si{connectedCallback(){N.setValueFor(this,Un),super.connectedCallback()}}const ab=rb.compose({baseName:"picker-menu",baseClass:si,template:Fp,styles:eb}),lb=ps.compose({baseName:"picker-menu-option",template:Op,styles:ib}),cb=In.compose({baseName:"picker-list",template:Rp,styles:sb}),hb=fs.compose({baseName:"picker-list-item",template:Dp,styles:ob}),db=(i,t)=>b`
        ${H("flex")} :host {
            align-items: center;
            outline: none;
            height: calc(${D} * 1px);
            width: calc(${D} * 1px);
            margin: calc(${D} * 1px) 0;
        }

        .progress {
            height: 100%;
            width: 100%;
        }

        .background {
            stroke: ${Tt};
            fill: none;
            stroke-width: 2px;
        }

        .determinate {
            stroke: ${Ct};
            fill: none;
            stroke-width: 2px;
            stroke-linecap: round;
            transform-origin: 50% 50%;
            transform: rotate(-90deg);
            transition: all 0.2s ease-in-out;
        }

        .indeterminate-indicator-1 {
            stroke: ${Ct};
            fill: none;
            stroke-width: 2px;
            stroke-linecap: round;
            transform-origin: 50% 50%;
            transform: rotate(-90deg);
            transition: all 0.2s ease-in-out;
            animation: spin-infinite 2s linear infinite;
        }

        :host([paused]) .indeterminate-indicator-1 {
            animation-play-state: paused;
            stroke: ${Tt};
        }

        :host([paused]) .determinate {
            stroke: ${$s};
        }

        @keyframes spin-infinite {
            0% {
                stroke-dasharray: 0.01px 43.97px;
                transform: rotate(0deg);
            }
            50% {
                stroke-dasharray: 21.99px 21.99px;
                transform: rotate(450deg);
            }
            100% {
                stroke-dasharray: 0.01px 43.97px;
                transform: rotate(1080deg);
            }
        }
    `.withBehaviors(P(b`
                .indeterminate-indicator-1,
                .determinate {
                    stroke: ${d.FieldText};
                }
                .background {
                    stroke: ${d.Field};
                }
                :host([paused]) .indeterminate-indicator-1 {
                    stroke: ${d.Field};
                }
                :host([paused]) .determinate {
                    stroke: ${d.GrayText};
                }
            `)),ub=oi.compose({baseName:"progress-ring",template:Np,styles:db,indeterminateIndicator:`
        <svg class="progress" part="progress" viewBox="0 0 16 16">
            <circle
                class="background"
                part="background"
                cx="8px"
                cy="8px"
                r="7px"
            ></circle>
            <circle
                class="indeterminate-indicator-1"
                part="indeterminate-indicator-1"
                cx="8px"
                cy="8px"
                r="7px"
            ></circle>
        </svg>
    `}),pb=(i,t)=>b`
        ${H("flex")} :host {
            align-items: center;
            outline: none;
            height: calc(${y} * 1px);
            margin: calc(${y} * 1px) 0;
        }

        .progress {
            background-color: ${Tt};
            border-radius: calc(${y} * 1px);
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            position: relative;
        }

        .determinate {
            background-color: ${Ct};
            border-radius: calc(${y} * 1px);
            height: 100%;
            transition: all 0.2s ease-in-out;
            display: flex;
        }

        .indeterminate {
            height: 100%;
            border-radius: calc(${y} * 1px);
            display: flex;
            width: 100%;
            position: relative;
            overflow: hidden;
        }

        .indeterminate-indicator-1 {
            position: absolute;
            opacity: 0;
            height: 100%;
            background-color: ${Ct};
            border-radius: calc(${y} * 1px);
            animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
            width: 40%;
            animation: indeterminate-1 2s infinite;
        }

        .indeterminate-indicator-2 {
            position: absolute;
            opacity: 0;
            height: 100%;
            background-color: ${Ct};
            border-radius: calc(${y} * 1px);
            animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
            width: 60%;
            animation: indeterminate-2 2s infinite;
        }

        :host([paused]) .indeterminate-indicator-1,
        :host([paused]) .indeterminate-indicator-2 {
            animation-play-state: paused;
            background-color: ${Tt};
        }

        :host([paused]) .determinate {
            background-color: ${$s};
        }

        @keyframes indeterminate-1 {
            0% {
                opacity: 1;
                transform: translateX(-100%);
            }
            70% {
                opacity: 1;
                transform: translateX(300%);
            }
            70.01% {
                opacity: 0;
            }
            100% {
                opacity: 0;
                transform: translateX(300%);
            }
        }

        @keyframes indeterminate-2 {
            0% {
                opacity: 0;
                transform: translateX(-150%);
            }
            29.99% {
                opacity: 0;
            }
            30% {
                opacity: 1;
                transform: translateX(-150%);
            }
            100% {
                transform: translateX(166.66%);
                opacity: 1;
            }
        }
    `.withBehaviors(P(b`
                .progress {
                    forced-color-adjust: none;
                    background-color: ${d.Field};
                    box-shadow: 0 0 0 1px inset ${d.FieldText};
                }
                .determinate,
                .indeterminate-indicator-1,
                .indeterminate-indicator-2 {
                    forced-color-adjust: none;
                    background-color: ${d.FieldText};
                }
                :host([paused]) .determinate,
                :host([paused]) .indeterminate-indicator-1,
                :host([paused]) .indeterminate-indicator-2 {
                    background-color: ${d.GrayText};
                }
            `)),fb=oi.compose({baseName:"progress",template:jp,styles:pb,indeterminateIndicator1:`
        <span class="indeterminate-indicator-1" part="indeterminate-indicator-1"></span>
    `,indeterminateIndicator2:`
        <span class="indeterminate-indicator-1" part="indeterminate-indicator-1"></span>
    `}),gb=(i,t)=>b`
    ${H("flex")} :host {
        align-items: flex-start;
        margin: calc(${y} * 1px) 0;
        flex-direction: column;
    }
    .positioning-region {
        display: flex;
        flex-wrap: wrap;
    }
    :host([orientation="vertical"]) .positioning-region {
        flex-direction: column;
    }
    :host([orientation="horizontal"]) .positioning-region {
        flex-direction: row;
    }
`,mb=Ue.compose({baseName:"radio-group",template:_p,styles:gb}),bb=(i,t)=>b`
        ${H("inline-flex")} :host {
            --input-size: calc((${D} / 2) + ${y});
            align-items: center;
            outline: none;
            margin: calc(${y} * 1px) 0;
            /* Chromium likes to select label text or the default slot when
                the radio is clicked. Maybe there is a better solution here? */
            user-select: none;
            position: relative;
            flex-direction: row;
            transition: all 0.2s ease-in-out;
        }

        .control {
            position: relative;
            width: calc((${D} / 2 + ${y}) * 1px);
            height: calc((${D} / 2 + ${y}) * 1px);
            box-sizing: border-box;
            border-radius: 999px;
            border: calc(${R} * 1px) solid ${pe};
            background: ${Ve};
            outline: none;
            cursor: pointer;
        }

        .label {
            font-family: ${W};
            color: ${S};
            padding-inline-start: calc(${y} * 2px + 2px);
            margin-inline-end: calc(${y} * 2px + 2px);
            cursor: pointer;
            font-size: ${U};
            line-height: ${G};
        }

        .label__hidden {
            display: none;
            visibility: hidden;
        }

        .control, .checked-indicator {
            flex-shrink: 0;
        }

        .checked-indicator {
            position: absolute;
            top: 5px;
            left: 5px;
            right: 5px;
            bottom: 5px;
            border-radius: 999px;
            display: inline-block;
            background: ${oe};
            fill: ${oe};
            opacity: 0;
            pointer-events: none;
        }

        :host(:not([disabled])) .control:hover{
            background: ${Jt};
            border-color: ${ws};
        }

        :host(:not([disabled])) .control:active {
            background: ${xs};
            border-color: ${Yn};
        }

        :host(:${$}) .control {
            box-shadow: 0 0 0 2px ${N}, 0 0 0 4px ${z};
        }

        :host([aria-checked="true"]) .control {
            background: ${X};
            border: calc(${R} * 1px) solid ${X};
        }

        :host([aria-checked="true"]:not([disabled])) .control:hover {
            background: ${gt};
            border: calc(${R} * 1px) solid ${gt};
        }

        :host([aria-checked="true"]:not([disabled])) .control:hover .checked-indicator {
            background: ${we};
            fill: ${we};
        }

        :host([aria-checked="true"]:not([disabled])) .control:active {
            background: ${ct};
            border: calc(${R} * 1px) solid ${ct};
        }

        :host([aria-checked="true"]:not([disabled])) .control:active .checked-indicator {
            background: ${ne};
            fill: ${ne};
        }

        :host([aria-checked="true"]:${$}:not([disabled])) .control {
            box-shadow: 0 0 0 2px ${N}, 0 0 0 4px ${z};
        }

        :host([disabled]) .label,
        :host([readonly]) .label,
        :host([readonly]) .control,
        :host([disabled]) .control {
            cursor: ${at};
        }

        :host([aria-checked="true"]) .checked-indicator {
            opacity: 1;
        }

        :host([disabled]) {
            opacity: ${ft};
        }
    `.withBehaviors(P(b`
            .control,
            :host([aria-checked="true"]:not([disabled])) .control {
                forced-color-adjust: none;
                border-color: ${d.FieldText};
                background: ${d.Field};
            }
            :host(:not([disabled])) .control:hover {
                border-color: ${d.Highlight};
                background: ${d.Field};
            }
            :host([aria-checked="true"]:not([disabled])) .control:hover,
            :host([aria-checked="true"]:not([disabled])) .control:active {
                border-color: ${d.Highlight};
                background: ${d.Highlight};
            }
            :host([aria-checked="true"]) .checked-indicator {
                background: ${d.Highlight};
                fill: ${d.Highlight};
            }
            :host([aria-checked="true"]:not([disabled])) .control:hover .checked-indicator,
            :host([aria-checked="true"]:not([disabled])) .control:active .checked-indicator {
                background: ${d.HighlightText};
                fill: ${d.HighlightText};
            }
            :host(:${$}) .control {
                border-color: ${d.Highlight};
                box-shadow: 0 0 0 2px ${d.Field}, 0 0 0 4px ${d.FieldText};
            }
            :host([aria-checked="true"]:${$}:not([disabled])) .control {
                border-color: ${d.Highlight};
                box-shadow: 0 0 0 2px ${d.Field}, 0 0 0 4px ${d.FieldText};
            }
            :host([disabled]) {
                forced-color-adjust: none;
                opacity: 1;
            }
            :host([disabled]) .label {
                color: ${d.GrayText};
            }
            :host([disabled]) .control,
            :host([aria-checked="true"][disabled]) .control:hover, .control:active {
                background: ${d.Field};
                border-color: ${d.GrayText};
            }
            :host([disabled]) .checked-indicator,
            :host([aria-checked="true"][disabled]) .control:hover .checked-indicator {
                fill: ${d.GrayText};
                background: ${d.GrayText};
            }
        `)),vb=so.compose({baseName:"radio",template:Up,styles:bb,checkedIndicator:`
        <div part="checked-indicator" class="checked-indicator"></div>
    `}),yb=Ne.create("clear-button-hover").withDefault(i=>{const t=Ge.getValueFor(i),e=fi.getValueFor(i);return t.evaluate(i,e.evaluate(i).hover).hover}),xb=Ne.create("clear-button-active").withDefault(i=>{const t=Ge.getValueFor(i),e=fi.getValueFor(i);return t.evaluate(i,e.evaluate(i).hover).active}),kc=(i,t)=>b`
    ${H("inline-block")} :host {
        font-family: ${W};
        outline: none;
        user-select: none;
    }

    .root {
        box-sizing: border-box;
        position: relative;
        display: flex;
        flex-direction: row;
        color: ${S};
        background: ${Ve};
        border-radius: calc(${M} * 1px);
        border: calc(${R} * 1px) solid ${X};
        height: calc(${D} * 1px);
        align-items: baseline;
    }

    .control {
        -webkit-appearance: none;
        font: inherit;
        background: transparent;
        border: 0;
        color: inherit;
        height: calc(100% - 4px);
        width: 100%;
        margin-top: auto;
        margin-bottom: auto;
        border: none;
        padding: 0 calc(${y} * 2px + 1px);
        font-size: ${U};
        line-height: ${G};
    }

    .control::-webkit-search-cancel-button {
        -webkit-appearance: none;
    }

    .control:hover,
    .control:${$},
    .control:disabled,
    .control:active {
        outline: none;
    }

    .clear-button {
        height: calc(100% - 2px);
        opacity: 0;
        margin: 1px;
        background: transparent;
        color: ${S};
        fill: currentcolor;
        border: none;
        border-radius: calc(${M} * 1px);
        min-width: calc(${D} * 1px);
        font-size: ${U};
        line-height: ${G};
        outline: none;
        font-family: ${W};
        padding: 0 calc((10 + (${y} * 2 * ${$e})) * 1px);
    }

    .clear-button:hover {
        background: ${mi};
    }

    .clear-button:active {
        background: ${bi};
    }

    :host([appearance="filled"]) .clear-button:hover {
        background: ${yb};
    }

    :host([appearance="filled"]) .clear-button:active {
        background: ${xb};
    }

    .input-wrapper {
        display: flex;
        position: relative;
        width: 100%;
        height: 100%;
    }

    .label {
        display: block;
        color: ${S};
        cursor: pointer;
        font-size: ${U};
        line-height: ${G};
        margin-bottom: 4px;
    }

    .label__hidden {
        display: none;
        visibility: hidden;
    }

    .input-wrapper,
    .start,
    .end {
        align-self: center;
    }

    .start,
    .end {
        display: flex;
        margin: 1px;
        fill: currentcolor;
    }

    ::slotted([slot="end"]) {
        height: 100%
    }

    .end {
        margin-inline-end: 1px;
        height: calc(100% - 2px);
    }

    ::slotted(svg) {
        /* TODO: adaptive typography https://github.com/microsoft/fast/issues/2432 */
        width: 16px;
        height: 16px;
        margin-inline-end: 11px;
        margin-inline-start: 11px;
        margin-top: auto;
        margin-bottom: auto;
    }

    :host(:hover:not([disabled])) .root {
        background: ${Jt};
        border-color: ${gt};
    }

    :host(:active:not([disabled])) .root {
        background: ${Jt};
        border-color: ${ct};
    }

    :host(:focus-within:not([disabled])) .root {
        border-color: ${z};
        box-shadow: 0 0 0 1px ${z} inset;
    }

    .clear-button__hidden {
        opacity: 0;
    }

    :host(:hover:not([disabled], [readOnly])) .clear-button,
    :host(:active:not([disabled], [readOnly])) .clear-button,
    :host(:focus-within:not([disabled], [readOnly])) .clear-button {
        opacity: 1;
    }

    :host(:hover:not([disabled], [readOnly])) .clear-button__hidden,
    :host(:active:not([disabled], [readOnly])) .clear-button__hidden,
    :host(:focus-within:not([disabled], [readOnly])) .clear-button__hidden {
        opacity: 0;
    }

    :host([appearance="filled"]) .root {
        background: ${N};
    }

    :host([appearance="filled"]:hover:not([disabled])) .root {
        background: ${gi};
    }

    :host([disabled]) .label,
    :host([readonly]) .label,
    :host([readonly]) .control,
    :host([disabled]) .control {
        cursor: ${at};
    }

    :host([disabled]) {
        opacity: ${ft};
    }

    :host([disabled]) .control {
        border-color: ${pe};
    }
`.withBehaviors(P(b`
                .root,
                :host([appearance="filled"]) .root {
                    forced-color-adjust: none;
                    background: ${d.Field};
                    border-color: ${d.FieldText};
                }
                :host(:hover:not([disabled])) .root,
                :host([appearance="filled"]:hover:not([disabled])) .root,
                :host([appearance="filled"]:hover) .root {
                    background: ${d.Field};
                    border-color: ${d.Highlight};
                }
                .start,
                .end {
                    fill: currentcolor;
                }
                :host([disabled]) {
                    opacity: 1;
                }
                :host([disabled]) .root,
                :host([appearance="filled"]:hover[disabled]) .root {
                    border-color: ${d.GrayText};
                    background: ${d.Field};
                }
                :host(:focus-within:enabled) .root {
                    border-color: ${d.Highlight};
                    box-shadow: 0 0 0 1px ${d.Highlight} inset;
                }
                input::placeholder {
                    color: ${d.GrayText};
                }
            `));class Cc extends Qt{constructor(){super(...arguments),this.appearance="outline"}}c([u],Cc.prototype,"appearance",void 0);const $b=Cc.compose({baseName:"search",baseClass:Qt,template:Xp,styles:kc,shadowOptions:{delegatesFocus:!0}});class Tc extends ye{constructor(){super(...arguments),this.listboxScrollWidth=""}connectedCallback(){super.connectedCallback(),this.listbox&&N.setValueFor(this.listbox,Un)}get listboxMaxHeight(){return Math.floor(this.maxHeight/rc.getValueFor(this)).toString()}listboxScrollWidthChanged(){this.updateComputedStylesheet()}get selectSize(){var t;return`${(t=this.size)!==null&&t!==void 0?t:this.multiple?4:0}`}multipleChanged(t,e){super.multipleChanged(t,e),this.updateComputedStylesheet()}maxHeightChanged(t,e){this.collapsible&&this.updateComputedStylesheet()}setPositioning(){super.setPositioning(),this.updateComputedStylesheet()}sizeChanged(t,e){if(super.sizeChanged(t,e),this.updateComputedStylesheet(),this.collapsible){requestAnimationFrame(()=>{this.listbox.style.setProperty("display","flex"),this.listbox.style.setProperty("overflow","visible"),this.listbox.style.setProperty("visibility","hidden"),this.listbox.style.setProperty("width","auto"),this.listbox.hidden=!1,this.listboxScrollWidth=`${this.listbox.scrollWidth}`,this.listbox.hidden=!0,this.listbox.style.removeProperty("display"),this.listbox.style.removeProperty("overflow"),this.listbox.style.removeProperty("visibility"),this.listbox.style.removeProperty("width")});return}this.listboxScrollWidth=""}updateComputedStylesheet(){this.computedStylesheet&&this.$fastController.removeStyles(this.computedStylesheet),this.computedStylesheet=b`
            :host {
                --listbox-max-height: ${this.listboxMaxHeight};
                --listbox-scroll-width: ${this.listboxScrollWidth};
                --size: ${this.selectSize};
            }
        `,this.$fastController.addStyles(this.computedStylesheet)}}c([g],Tc.prototype,"listboxScrollWidth",void 0);const Ic=Tc.compose({baseName:"select",baseClass:ye,template:Kp,styles:vc,indicator:`
        <svg
            class="select-indicator"
            part="select-indicator"
            viewBox="0 0 12 7"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M11.85.65c.2.2.2.5 0 .7L6.4 6.84a.55.55 0 01-.78 0L.14 1.35a.5.5 0 11.71-.7L6 5.8 11.15.65c.2-.2.5-.2.7 0z"
            />
        </svg>
    `}),wb=(i,t)=>b`
        ${H("block")} :host {
            --skeleton-fill-default: #e1dfdd;
            overflow: hidden;
            width: 100%;
            position: relative;
            background-color: var(--skeleton-fill, var(--skeleton-fill-default));
            --skeleton-animation-gradient-default: linear-gradient(
                270deg,
                var(--skeleton-fill, var(--skeleton-fill-default)) 0%,
                #f3f2f1 51.13%,
                var(--skeleton-fill, var(--skeleton-fill-default)) 100%
            );
            --skeleton-animation-timing-default: ease-in-out;
        }

        :host([shape="rect"]) {
            border-radius: calc(${M} * 1px);
        }

        :host([shape="circle"]) {
            border-radius: 100%;
            overflow: hidden;
        }

        object {
            position: absolute;
            width: 100%;
            height: auto;
            z-index: 2;
        }

        object img {
            width: 100%;
            height: auto;
        }

        ${H("block")} span.shimmer {
            position: absolute;
            width: 100%;
            height: 100%;
            background-image: var(
                --skeleton-animation-gradient,
                var(--skeleton-animation-gradient-default)
            );
            background-size: 0px 0px / 90% 100%;
            background-repeat: no-repeat;
            background-color: var(--skeleton-animation-fill, ${Tt});
            animation: shimmer 2s infinite;
            animation-timing-function: var(
                --skeleton-animation-timing,
                var(--skeleton-timing-default)
            );
            animation-direction: normal;
            z-index: 1;
        }

        ::slotted(svg) {
            z-index: 2;
        }

        ::slotted(.pattern) {
            width: 100%;
            height: 100%;
        }

        @keyframes shimmer {
            0% {
                transform: translateX(-100%);
            }
            100% {
                transform: translateX(100%);
            }
        }
    `.withBehaviors(P(b`
                :host {
                    forced-color-adjust: none;
                    background-color: ${d.ButtonFace};
                    box-shadow: 0 0 0 1px ${d.ButtonText};
                }

                ${H("block")} span.shimmer {
                    display: none;
                }
            `)),Kn=gs.compose({baseName:"skeleton",template:tf,styles:wb}),Sc=b`
    :host {
        align-self: start;
        grid-row: 2;
        margin-top: -2px;
        height: calc((${D} / 2 + ${y}) * 1px);
        width: auto;
    }
    .container {
        grid-template-rows: auto auto;
        grid-template-columns: 0;
    }
    .label {
        margin: 2px 0;
    }
`,Fc=b`
    :host {
        justify-self: start;
        grid-column: 2;
        margin-left: 2px;
        height: auto;
        width: calc((${D} / 2 + ${y}) * 1px);
    }
    .container {
        grid-template-columns: auto auto;
        grid-template-rows: 0;
        min-width: calc(var(--thumb-size) * 1px);
        height: calc(var(--thumb-size) * 1px);
    }
    .mark {
        transform: rotate(90deg);
        align-self: center;
    }
    .label {
        margin-left: calc((${y} / 2) * 3px);
        align-self: center;
    }
`,kb=(i,t)=>b`
        ${H("block")} :host {
            font-family: ${W};
            color: ${S};
            fill: currentcolor;
        }
        .root {
            position: absolute;
            display: grid;
        }
        .container {
            display: grid;
            justify-self: center;
        }
        .label {
            justify-self: center;
            align-self: center;
            white-space: nowrap;
            max-width: 30px;
        }
        .mark {
            width: calc((${y} / 4) * 1px);
            height: calc(${D} * 0.25 * 1px);
            background: ${pe};
            justify-self: center;
        }
        :host(.disabled) {
            opacity: ${ft};
        }
    `.withBehaviors(P(b`
                .mark {
                    forced-color-adjust: none;
                    background: ${d.FieldText};
                }
                :host(.disabled) {
                    forced-color-adjust: none;
                    opacity: 1;
                }
                :host(.disabled) .label {
                    color: ${d.GrayText};
                }
                :host(.disabled) .mark {
                    background: ${d.GrayText};
                }
            `));class Cb extends xe{sliderOrientationChanged(){this.sliderOrientation===rt.horizontal?(this.$fastController.addStyles(Sc),this.$fastController.removeStyles(Fc)):(this.$fastController.addStyles(Fc),this.$fastController.removeStyles(Sc))}}const Tb=Cb.compose({baseName:"slider-label",baseClass:xe,template:ef,styles:kb}),Ib=b`
    .track-start {
        left: 0;
    }
`,Sb=b`
    .track-start {
        right: 0;
    }
`,Fb=(i,t)=>b`
        :host([hidden]) {
            display: none;
        }

        ${H("inline-grid")} :host {
            --thumb-size: calc(${D} * 0.5 - ${y});
            --thumb-translate: calc(var(--thumb-size) * -0.5 + var(--track-width) / 2);
            --track-overhang: calc((${y} / 2) * -1);
            --track-width: ${y};
            --fast-slider-height: calc(var(--thumb-size) * 10);
            align-items: center;
            width: 100%;
            margin: calc(${y} * 1px) 0;
            user-select: none;
            box-sizing: border-box;
            border-radius: calc(${M} * 1px);
            outline: none;
            cursor: pointer;
        }
        :host([orientation="horizontal"]) .positioning-region {
            position: relative;
            margin: 0 8px;
            display: grid;
            grid-template-rows: calc(var(--thumb-size) * 1px) 1fr;
        }
        :host([orientation="vertical"]) .positioning-region {
            position: relative;
            margin: 0 8px;
            display: grid;
            height: 100%;
            grid-template-columns: calc(var(--thumb-size) * 1px) 1fr;
        }

        :host(:${$}) .thumb-cursor {
            box-shadow: 0 0 0 2px ${N}, 0 0 0 4px ${z};
        }

        .thumb-container {
            position: absolute;
            height: calc(var(--thumb-size) * 1px);
            width: calc(var(--thumb-size) * 1px);
            transition: all 0.2s ease;
            color: ${S};
            fill: currentcolor;
        }
        .thumb-cursor {
            border: none;
            width: calc(var(--thumb-size) * 1px);
            height: calc(var(--thumb-size) * 1px);
            background: ${S};
            border-radius: calc(${M} * 1px);
        }
        .thumb-cursor:hover {
            background: ${S};
            border-color: ${ws};
        }
        .thumb-cursor:active {
            background: ${S};
        }
        .track-start {
            background: ${Ct};
            position: absolute;
            height: 100%;
            left: 0;
            border-radius: calc(${M} * 1px);
        }
        :host([orientation="horizontal"]) .thumb-container {
            transform: translateX(calc(var(--thumb-size) * 0.5px)) translateY(calc(var(--thumb-translate) * 1px));
        }
        :host([orientation="vertical"]) .thumb-container {
            transform: translateX(calc(var(--thumb-translate) * 1px)) translateY(calc(var(--thumb-size) * 0.5px));
        }
        :host([orientation="horizontal"]) {
            min-width: calc(var(--thumb-size) * 1px);
        }
        :host([orientation="horizontal"]) .track {
            right: calc(var(--track-overhang) * 1px);
            left: calc(var(--track-overhang) * 1px);
            align-self: start;
            height: calc(var(--track-width) * 1px);
        }
        :host([orientation="vertical"]) .track {
            top: calc(var(--track-overhang) * 1px);
            bottom: calc(var(--track-overhang) * 1px);
            width: calc(var(--track-width) * 1px);
            height: 100%;
        }
        .track {
            background: ${pe};
            position: absolute;
            border-radius: calc(${M} * 1px);
        }
        :host([orientation="vertical"]) {
            height: calc(var(--fast-slider-height) * 1px);
            min-height: calc(var(--thumb-size) * 1px);
            min-width: calc(${y} * 20px);
        }
        :host([orientation="vertical"]) .track-start {
            height: auto;
            width: 100%;
            top: 0;
        }
        :host([disabled]), :host([readonly]) {
            cursor: ${at};
        }
        :host([disabled]) {
            opacity: ${ft};
        }
    `.withBehaviors(new Pi(Ib,Sb),P(b`
                .thumb-cursor {
                    forced-color-adjust: none;
                    border-color: ${d.FieldText};
                    background: ${d.FieldText};
                }
                .thumb-cursor:hover,
                .thumb-cursor:active {
                    background: ${d.Highlight};
                }
                .track {
                    forced-color-adjust: none;
                    background: ${d.FieldText};
                }
                :host(:${$}) .thumb-cursor {
                    border-color: ${d.Highlight};
                }
                :host([disabled]) {
                    opacity: 1;
                }
                :host([disabled]) .track,
                :host([disabled]) .thumb-cursor {
                    forced-color-adjust: none;
                    background: ${d.GrayText};
                }

                :host(:${$}) .thumb-cursor {
                    background: ${d.Highlight};
                    border-color: ${d.Highlight};
                    box-shadow: 0 0 0 2px ${d.Field}, 0 0 0 4px ${d.FieldText};
                }
            `)),Ob=Ot.compose({baseName:"slider",template:sf,styles:Fb,thumb:`
        <div class="thumb-cursor"></div>
    `}),Rb=(i,t)=>b`
        :host([hidden]) {
            display: none;
        }

        ${H("inline-flex")} :host {
            align-items: center;
            outline: none;
            font-family: ${W};
            margin: calc(${y} * 1px) 0;
            ${""} user-select: none;
        }

        :host([disabled]) {
            opacity: ${ft};
        }

        :host([disabled]) .label,
        :host([readonly]) .label,
        :host([readonly]) .switch,
        :host([disabled]) .switch {
            cursor: ${at};
        }

        .switch {
            position: relative;
            outline: none;
            box-sizing: border-box;
            width: calc(${D} * 1px);
            height: calc((${D} / 2 + ${y}) * 1px);
            background: ${Ve};
            border-radius: calc(${M} * 1px);
            border: calc(${R} * 1px) solid ${pe};
        }

        .switch:hover {
            background: ${Jt};
            border-color: ${ws};
            cursor: pointer;
        }

        host([disabled]) .switch:hover,
        host([readonly]) .switch:hover {
            background: ${Jt};
            border-color: ${ws};
            cursor: ${at};
        }

        :host(:not([disabled])) .switch:active {
            background: ${xs};
            border-color: ${Yn};
        }

        :host(:${$}) .switch {
            box-shadow: 0 0 0 2px ${N}, 0 0 0 4px ${z};
        }

        .checked-indicator {
            position: absolute;
            top: 5px;
            bottom: 5px;
            background: ${S};
            border-radius: calc(${M} * 1px);
            transition: all 0.2s ease-in-out;
        }

        .status-message {
            color: ${S};
            cursor: pointer;
            font-size: ${U};
            line-height: ${G};
        }

        :host([disabled]) .status-message,
        :host([readonly]) .status-message {
            cursor: ${at};
        }

        .label {
            color: ${S};
            margin-inline-end: calc(${y} * 2px + 2px);
            font-size: ${U};
            line-height: ${G};
            cursor: pointer;
        }

        .label__hidden {
            display: none;
            visibility: hidden;
        }

        ::slotted([slot="checked-message"]),
        ::slotted([slot="unchecked-message"]) {
            margin-inline-start: calc(${y} * 2px + 2px);
        }

        :host([aria-checked="true"]) .checked-indicator {
            background: ${oe};
        }

        :host([aria-checked="true"]) .switch {
            background: ${X};
            border-color: ${X};
        }

        :host([aria-checked="true"]:not([disabled])) .switch:hover {
            background: ${gt};
            border-color: ${gt};
        }

        :host([aria-checked="true"]:not([disabled])) .switch:hover .checked-indicator {
            background: ${we};
        }

        :host([aria-checked="true"]:not([disabled])) .switch:active {
            background: ${ct};
            border-color: ${ct};
        }

        :host([aria-checked="true"]:not([disabled])) .switch:active .checked-indicator {
            background: ${ne};
        }

        :host([aria-checked="true"]:${$}:not([disabled])) .switch {
            box-shadow: 0 0 0 2px ${N}, 0 0 0 4px ${z};
        }

        .unchecked-message {
            display: block;
        }

        .checked-message {
            display: none;
        }

        :host([aria-checked="true"]) .unchecked-message {
            display: none;
        }

        :host([aria-checked="true"]) .checked-message {
            display: block;
        }
    `.withBehaviors(P(b`
            .checked-indicator,
            :host(:not([disabled])) .switch:active .checked-indicator {
                forced-color-adjust: none;
                background: ${d.FieldText};
            }
            .switch {
                forced-color-adjust: none;
                background: ${d.Field};
                border-color: ${d.FieldText};
            }
            :host(:not([disabled])) .switch:hover {
                background: ${d.HighlightText};
                border-color: ${d.Highlight};
            }
            :host([aria-checked="true"]) .switch {
                background: ${d.Highlight};
                border-color: ${d.Highlight};
            }
            :host([aria-checked="true"]:not([disabled])) .switch:hover,
            :host(:not([disabled])) .switch:active {
                background: ${d.HighlightText};
                border-color: ${d.Highlight};
            }
            :host([aria-checked="true"]) .checked-indicator {
                background: ${d.HighlightText};
            }
            :host([aria-checked="true"]:not([disabled])) .switch:hover .checked-indicator {
                background: ${d.Highlight};
            }
            :host([disabled]) {
                opacity: 1;
            }
            :host(:${$}) .switch {
                border-color: ${d.Highlight};
                box-shadow: 0 0 0 2px ${d.Field}, 0 0 0 4px ${d.FieldText};
            }
            :host([aria-checked="true"]:${$}:not([disabled])) .switch {
                box-shadow: 0 0 0 2px ${d.Field}, 0 0 0 4px ${d.FieldText};
            }
            :host([disabled]) .checked-indicator {
                background: ${d.GrayText};
            }
            :host([disabled]) .switch {
                background: ${d.Field};
                border-color: ${d.GrayText};
            }
        `),new Pi(b`
                .checked-indicator {
                    left: 5px;
                    right: calc(((${D} / 2) + 1) * 1px);
                }

                :host([aria-checked="true"]) .checked-indicator {
                    left: calc(((${D} / 2) + 1) * 1px);
                    right: 5px;
                }
            `,b`
                .checked-indicator {
                    right: 5px;
                    left: calc(((${D} / 2) + 1) * 1px);
                }

                :host([aria-checked="true"]) .checked-indicator {
                    right: calc(((${D} / 2) + 1) * 1px);
                    left: 5px;
                }
            `)),Db=On.compose({baseName:"switch",template:af,styles:Rb,switch:`
        <span class="checked-indicator" part="checked-indicator"></span>
    `}),Eb=(i,t)=>b`
        ${H("grid")} :host {
            box-sizing: border-box;
            font-family: ${W};
            font-size: ${U};
            line-height: ${G};
            color: ${S};
            grid-template-columns: auto 1fr auto;
            grid-template-rows: auto 1fr;
        }

        .tablist {
            display: grid;
            grid-template-rows: auto auto;
            grid-template-columns: auto;
            position: relative;
            width: max-content;
            align-self: end;
            padding: calc(${y} * 4px) calc(${y} * 4px) 0;
            box-sizing: border-box;
        }

        .start,
        .end {
            align-self: center;
        }

        .activeIndicator {
            grid-row: 2;
            grid-column: 1;
            width: 100%;
            height: 5px;
            justify-self: center;
            background: ${X};
            margin-top: 10px;
            border-radius: calc(${M} * 1px)
                calc(${M} * 1px) 0 0;
        }

        .activeIndicatorTransition {
            transition: transform 0.2s ease-in-out;
        }

        .tabpanel {
            grid-row: 2;
            grid-column-start: 1;
            grid-column-end: 4;
            position: relative;
        }

        :host([orientation="vertical"]) {
            grid-template-rows: auto 1fr auto;
            grid-template-columns: auto 1fr;
        }

        :host([orientation="vertical"]) .tablist {
            grid-row-start: 2;
            grid-row-end: 2;
            display: grid;
            grid-template-rows: auto;
            grid-template-columns: auto 1fr;
            position: relative;
            width: max-content;
            justify-self: end;
            align-self: flex-start;
            width: 100%;
            padding: 0 calc(${y} * 4px)
                calc((${D} - ${y}) * 1px) 0;
        }

        :host([orientation="vertical"]) .tabpanel {
            grid-column: 2;
            grid-row-start: 1;
            grid-row-end: 4;
        }

        :host([orientation="vertical"]) .end {
            grid-row: 3;
        }

        :host([orientation="vertical"]) .activeIndicator {
            grid-column: 1;
            grid-row: 1;
            width: 5px;
            height: 100%;
            margin-inline-end: 10px;
            align-self: center;
            background: ${X};
            margin-top: 0;
            border-radius: 0 calc(${M} * 1px)
                calc(${M} * 1px) 0;
        }

        :host([orientation="vertical"]) .activeIndicatorTransition {
            transition: transform 0.2s linear;
        }
    `.withBehaviors(P(b`
                .activeIndicator,
                :host([orientation="vertical"]) .activeIndicator {
                    forced-color-adjust: none;
                    background: ${d.Highlight};
                }
            `)),Lb=(i,t)=>b`
    ${H("inline-flex")} :host {
        box-sizing: border-box;
        font-family: ${W};
        font-size: ${U};
        line-height: ${G};
        height: calc(${D} * 1px);
        padding: calc(${y} * 5px) calc(${y} * 4px);
        color: ${$s};
        fill: currentcolor;
        border-radius: calc(${M} * 1px);
        border: calc(${R} * 1px) solid transparent;
        align-items: center;
        justify-content: center;
        grid-row: 1;
        cursor: pointer;
    }

    :host(:hover) {
        color: ${S};
        fill: currentcolor;
    }

    :host(:active) {
        color: ${S};
        fill: currentcolor;
    }

    :host([disabled]) {
        cursor: ${at};
        opacity: ${ft};
    }

    :host([disabled]:hover) {
        color: ${$s};
        background: ${re};
    }

    :host([aria-selected="true"]) {
        background: ${Tt};
        color: ${Ct};
        fill: currentcolor;
    }

    :host([aria-selected="true"]:hover) {
        background: ${gi};
        color: ${pi};
        fill: currentcolor;
    }

    :host([aria-selected="true"]:active) {
        background: ${Gn};
        color: ${ke};
        fill: currentcolor;
    }

    :host(:${$}) {
        outline: none;
        border: calc(${R} * 1px) solid ${z};
        box-shadow: 0 0 0 calc((${B} - ${R}) * 1px)
            ${z};
    }

    :host(:focus) {
        outline: none;
    }

    :host(.vertical) {
        justify-content: end;
        grid-column: 2;
    }

    :host(.vertical[aria-selected="true"]) {
        z-index: 2;
    }

    :host(.vertical:hover) {
        color: ${S};
    }

    :host(.vertical:active) {
        color: ${S};
    }

    :host(.vertical:hover[aria-selected="true"]) {
    }
`.withBehaviors(P(b`
            :host {
                forced-color-adjust: none;
                border-color: transparent;
                color: ${d.ButtonText};
                fill: currentcolor;
            }
            :host(:hover),
            :host(.vertical:hover),
            :host([aria-selected="true"]:hover) {
                background: ${d.Highlight};
                color: ${d.HighlightText};
                fill: currentcolor;
            }
            :host([aria-selected="true"]) {
                background: ${d.HighlightText};
                color: ${d.Highlight};
                fill: currentcolor;
            }
            :host(:${$}) {
                border-color: ${d.ButtonText};
                box-shadow: none;
            }
            :host([disabled]),
            :host([disabled]:hover) {
                opacity: 1;
                color: ${d.GrayText};
                background: ${d.ButtonFace};
            }
        `)),Ab=gl.compose({baseName:"tab",template:uf,styles:Lb}),Pb=(i,t)=>b`
    ${H("block")} :host {
        box-sizing: border-box;
        font-size: ${U};
        line-height: ${G};
        padding: 0 calc((6 + (${y} * 2 * ${$e})) * 1px);
    }
`,Vb=df.compose({baseName:"tab-panel",template:hf,styles:Pb}),Mb=Le.compose({baseName:"tabs",template:pf,styles:Eb}),zb=(i,t)=>b`
    ${H("inline-block")} :host {
        font-family: ${W};
        outline: none;
        user-select: none;
    }

    .control {
        box-sizing: border-box;
        position: relative;
        color: ${S};
        background: ${Ve};
        border-radius: calc(${M} * 1px);
        border: calc(${R} * 1px) solid ${X};
        height: calc(${D} * 2px);
        font: inherit;
        font-size: ${U};
        line-height: ${G};
        padding: calc(${y} * 2px + 1px);
        width: 100%;
        resize: none;
    }

    .control:hover:enabled {
        background: ${Jt};
        border-color: ${gt};
    }

    .control:active:enabled {
        background: ${xs};
        border-color: ${ct};
    }

    .control:hover,
    .control:${$},
    .control:disabled,
    .control:active {
        outline: none;
    }

    :host(:focus-within) .control {
        border-color: ${z};
        box-shadow: 0 0 0 1px ${z} inset;
    }

    :host([appearance="filled"]) .control {
        background: ${Tt};
    }

    :host([appearance="filled"]:hover:not([disabled])) .control {
        background: ${gi};
    }

    :host([resize="both"]) .control {
        resize: both;
    }

    :host([resize="horizontal"]) .control {
        resize: horizontal;
    }

    :host([resize="vertical"]) .control {
        resize: vertical;
    }

    .label {
        display: block;
        color: ${S};
        cursor: pointer;
        font-size: ${U};
        line-height: ${G};
        margin-bottom: 4px;
    }

    .label__hidden {
        display: none;
        visibility: hidden;
    }

    :host([disabled]) .label,
    :host([readonly]) .label,
    :host([readonly]) .control,
    :host([disabled]) .control {
        cursor: ${at};
    }
    :host([disabled]) {
        opacity: ${ft};
    }
    :host([disabled]) .control {
        border-color: ${pe};
    }

    :host([cols]){
        width: initial;
    }

    :host([rows]) .control {
        height: initial;
    }
 `.withBehaviors(P(b`
                :host([disabled]) {
                    opacity: 1;
                }
            `));class Oc extends Rt{constructor(){super(...arguments),this.appearance="outline"}}c([u],Oc.prototype,"appearance",void 0);const Hb=Oc.compose({baseName:"text-area",baseClass:Rt,template:mf,styles:zb,shadowOptions:{delegatesFocus:!0}}),Bb=(i,t)=>b`
    ${H("inline-block")} :host {
        font-family: ${W};
        outline: none;
        user-select: none;
    }

    .root {
        box-sizing: border-box;
        position: relative;
        display: flex;
        flex-direction: row;
        color: ${S};
        background: ${Ve};
        border-radius: calc(${M} * 1px);
        border: calc(${R} * 1px) solid ${X};
        height: calc(${D} * 1px);
        align-items: baseline;
    }

    .control {
        -webkit-appearance: none;
        font: inherit;
        background: transparent;
        border: 0;
        color: inherit;
        height: calc(100% - 4px);
        width: 100%;
        margin-top: auto;
        margin-bottom: auto;
        border: none;
        padding: 0 calc(${y} * 2px + 1px);
        font-size: ${U};
        line-height: ${G};
    }

    .control:hover,
    .control:${$},
    .control:disabled,
    .control:active {
        outline: none;
    }

    .label {
        display: block;
        color: ${S};
        cursor: pointer;
        font-size: ${U};
        line-height: ${G};
        margin-bottom: 4px;
    }

    .label__hidden {
        display: none;
        visibility: hidden;
    }

    .start,
    .control,
    .end {
        align-self: center;
    }

    .start,
    .end {
        display: flex;
        margin: auto;
        fill: currentcolor;
    }

    ::slotted(svg) {
        /* TODO: adaptive typography https://github.com/microsoft/fast/issues/2432 */
        width: 16px;
        height: 16px;
    }

    .start {
        margin-inline-start: 11px;
    }

    .end {
        margin-inline-end: 11px;
    }

    :host(:hover:not([disabled])) .root {
        background: ${Jt};
        border-color: ${gt};
    }

    :host(:active:not([disabled])) .root {
        background: ${Jt};
        border-color: ${ct};
    }

    :host(:focus-within:not([disabled])) .root {
        border-color: ${z};
        box-shadow: 0 0 0 calc(${B} * 1px) ${z} inset;
    }

    :host([appearance="filled"]) .root {
        background: ${Tt};
    }

    :host([appearance="filled"]:hover:not([disabled])) .root {
        background: ${gi};
    }

    :host([disabled]) .label,
    :host([readonly]) .label,
    :host([readonly]) .control,
    :host([disabled]) .control {
        cursor: ${at};
    }

    :host([disabled]) {
        opacity: ${ft};
    }

    :host([disabled]) .control {
        border-color: ${pe};
    }
`.withBehaviors(P(b`
                .root,
                :host([appearance="filled"]) .root {
                    forced-color-adjust: none;
                    background: ${d.Field};
                    border-color: ${d.FieldText};
                }
                :host(:hover:not([disabled])) .root,
                :host([appearance="filled"]:hover:not([disabled])) .root,
                :host([appearance="filled"]:hover) .root {
                    background: ${d.Field};
                    border-color: ${d.Highlight};
                }
                .start,
                .end {
                    fill: currentcolor;
                }
                :host([disabled]) {
                    opacity: 1;
                }
                :host([disabled]) .root,
                :host([appearance="filled"]:hover[disabled]) .root {
                    border-color: ${d.GrayText};
                    background: ${d.Field};
                }
                :host(:focus-within:enabled) .root {
                    border-color: ${d.Highlight};
                    box-shadow: 0 0 0 1px ${d.Highlight} inset;
                }
                input::placeholder {
                    color: ${d.GrayText};
                }
            `));class Rc extends Nt{constructor(){super(...arguments),this.appearance="outline"}}c([u],Rc.prototype,"appearance",void 0);const Dc=Rc.compose({baseName:"text-field",baseClass:Nt,template:bf,styles:Bb,shadowOptions:{delegatesFocus:!0}}),Nb=(i,t)=>b`
        ${H("inline-flex")} :host {
            --toolbar-item-gap: calc(
                (var(--design-unit) + calc(var(--density) + 2)) * 1px
            );
            background-color: ${N};
            border-radius: calc(${M} * 1px);
            fill: currentcolor;
            padding: var(--toolbar-item-gap);
        }

        :host(${$}) {
            outline: calc(${R} * 1px) solid ${jg};
        }

        .positioning-region {
            align-items: flex-start;
            display: inline-flex;
            flex-flow: row wrap;
            justify-content: flex-start;
        }

        :host([orientation="vertical"]) .positioning-region {
            flex-direction: column;
        }

        ::slotted(:not([slot])) {
            flex: 0 0 auto;
            margin: 0 var(--toolbar-item-gap);
        }

        :host([orientation="vertical"]) ::slotted(:not([slot])) {
            margin: var(--toolbar-item-gap) 0;
        }

        .start,
        .end {
            display: flex;
            margin: auto;
            margin-inline: 0;
        }

        ::slotted(svg) {
            /* TODO: adaptive typography https://github.com/microsoft/fast/issues/2432 */
            width: 16px;
            height: 16px;
        }
    `.withBehaviors(P(b`
            :host(:${$}) {
                box-shadow: 0 0 0 calc(${B} * 1px) ${d.Highlight};
                color: ${d.ButtonText};
                forced-color-adjust: none;
            }
        `));class jb extends fe{connectedCallback(){super.connectedCallback();const t=cs(this);t&&N.setValueFor(this,e=>Xn.getValueFor(e).evaluate(e,N.getValueFor(t)))}}const _b=jb.compose({baseName:"toolbar",baseClass:fe,template:vf,styles:Nb,shadowOptions:{delegatesFocus:!0}}),Ub=(i,t)=>{const e=i.tagFor(q);return b`
            :host {
                contain: size;
                overflow: visible;
                height: 0;
                width: 0;
            }

            .tooltip {
                box-sizing: border-box;
                border-radius: calc(${M} * 1px);
                border: calc(${R} * 1px) solid ${z};
                box-shadow: 0 0 0 1px ${z} inset;
                background: ${Tt};
                color: ${S};
                padding: 4px;
                height: fit-content;
                width: fit-content;
                font-family: ${W};
                font-size: ${U};
                line-height: ${G};
                white-space: nowrap;
                /* TODO: a mechanism to manage z-index across components
                    https://github.com/microsoft/fast/issues/3813 */
                z-index: 10000;
            }

            ${e} {
                display: flex;
                justify-content: center;
                align-items: center;
                overflow: visible;
                flex-direction: row;
            }

            ${e}.right,
            ${e}.left {
                flex-direction: column;
            }

            ${e}.top .tooltip {
                margin-bottom: 4px;
            }

            ${e}.bottom .tooltip {
                margin-top: 4px;
            }

            ${e}.left .tooltip {
                margin-right: 4px;
            }

            ${e}.right .tooltip {
                margin-left: 4px;
            }

            ${e}.top.left .tooltip,
            ${e}.top.right .tooltip {
                margin-bottom: 0px;
            }

            ${e}.bottom.left .tooltip,
            ${e}.bottom.right .tooltip {
                margin-top: 0px;
            }

            ${e}.top.left .tooltip,
            ${e}.bottom.left .tooltip {
                margin-right: 0px;
            }

            ${e}.top.right .tooltip,
            ${e}.bottom.right .tooltip {
                margin-left: 0px;
            }

        `.withBehaviors(P(b`
                :host([disabled]) {
                    opacity: 1;
                }
            `))},qb=pt.compose({baseName:"tooltip",template:yf,styles:Ub}),Gb=b`
    .expand-collapse-glyph {
        transform: rotate(0deg);
    }
    :host(.nested) .expand-collapse-button {
        left: var(--expand-collapse-button-nested-width, calc(${D} * -1px));
    }
    :host([selected])::after {
        left: calc(${B} * 1px);
    }
    :host([expanded]) > .positioning-region .expand-collapse-glyph {
        transform: rotate(45deg);
    }
`,Wb=b`
    .expand-collapse-glyph {
        transform: rotate(180deg);
    }
    :host(.nested) .expand-collapse-button {
        right: var(--expand-collapse-button-nested-width, calc(${D} * -1px));
    }
    :host([selected])::after {
        right: calc(${B} * 1px);
    }
    :host([expanded]) > .positioning-region .expand-collapse-glyph {
        transform: rotate(135deg);
    }
`,Ec=$a`((${vs} / 2) * ${y}) + ((${y} * ${$e}) / 2)`,Xb=Ne.create("tree-item-expand-collapse-hover").withDefault(i=>{const t=Ge.getValueFor(i);return t.evaluate(i,t.evaluate(i).hover).hover}),Yb=Ne.create("tree-item-expand-collapse-selected-hover").withDefault(i=>{const t=fi.getValueFor(i);return Ge.getValueFor(i).evaluate(i,t.evaluate(i).rest).hover}),Qb=(i,t)=>b`
    /**
     * This animation exists because when tree item children are conditionally loaded
     * there is a visual bug where the DOM exists but styles have not yet been applied (essentially FOUC).
     * This subtle animation provides a ever so slight timing adjustment for loading that solves the issue.
     */
    @keyframes treeItemLoading {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
         }
    }

    ${H("block")} :host {
        contain: content;
        position: relative;
        outline: none;
        color: ${S};
        background: ${re};
        cursor: pointer;
        font-family: ${W};
        --expand-collapse-button-size: calc(${D} * 1px);
        --tree-item-nested-width: 0;
    }

        :host(:focus) > .positioning-region {
            outline: none;
        }

        :host(:focus) .content-region {
            outline: none;
        }

        :host(:${$}) .positioning-region {
            border: ${z} calc(${R} * 1px) solid;
            border-radius: calc(${M} * 1px);
            color: ${S};
        }

        .positioning-region {
            display: flex;
            position: relative;
            box-sizing: border-box;
            background: ${re};
            border: transparent calc(${R} * 1px) solid;
            height: calc((${D} + 1) * 1px);
        }

        .positioning-region::before {
            content: "";
            display: block;
            width: var(--tree-item-nested-width);
            flex-shrink: 0;
        }

        :host(:not([disabled])) .positioning-region:hover {
            background: ${mi};
        }

        :host(:not([disabled])) .positioning-region:active {
            background: ${bi};
        }

        .content-region {
            display: inline-flex;
            align-items: center;
            white-space: nowrap;
            width: 100%;
            height: calc(${D} * 1px);
            margin-inline-start: calc(${y} * 2px + 8px);
            font-size: ${U};
            line-height: ${G};
            font-weight: 400;
        }

        .items {
            /* TODO: adaptive typography https://github.com/microsoft/fast/issues/2432 */
            font-size: calc(1em + (${y} + 16) * 1px);
        }

        .expand-collapse-button {
            background: none;
            border: none;
            outline: none;
            /* TODO: adaptive typography https://github.com/microsoft/fast/issues/2432 */
            width: calc((${Ec} + (${y} * 2)) * 1px);
            height: calc((${Ec} + (${y} * 2)) * 1px);
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            margin-left: 6px;
            margin-right: 6px;
        }

        .expand-collapse-glyph {
            /* TODO: adaptive typography https://github.com/microsoft/fast/issues/2432 */
            width: 16px;
            height: 16px;
            transition: transform 0.1s linear;

            pointer-events: none;
            fill: currentcolor;
        }

        .start,
        .end {
            display: flex;
            fill: currentcolor;
        }

        ::slotted(svg) {
            /* TODO: adaptive typography https://github.com/microsoft/fast/issues/2432 */
            width: 16px;
            height: 16px;
        }

        .start {
            /* TODO: horizontalSpacing https://github.com/microsoft/fast/issues/2766 */
            margin-inline-end: calc(${y} * 2px + 2px);
        }

        .end {
            /* TODO: horizontalSpacing https://github.com/microsoft/fast/issues/2766 */
            margin-inline-start: calc(${y} * 2px + 2px);
        }

        :host([expanded]) > .items {
            animation: treeItemLoading ease-in 10ms;
            animation-iteration-count: 1;
            animation-fill-mode: forwards;
        }

        :host([disabled]) .content-region {
            opacity: ${ft};
            cursor: ${at};
        }

        :host(.nested) .content-region {
            position: relative;
            margin-inline-start: var(--expand-collapse-button-size);
        }

        :host(.nested) .expand-collapse-button {
            position: absolute;
        }

        :host(.nested:not([disabled])) .expand-collapse-button:hover {
            background: ${Xb};
        }

        :host([selected]) .positioning-region {
            background: ${Tt};
        }

        :host([selected]:not([disabled])) .positioning-region:hover {
            background: ${gi};
        }

        :host([selected]:not([disabled])) .positioning-region:active {
            background: ${Gn};
        }

        :host([selected]:not([disabled])) .expand-collapse-button:hover {
            background: ${Yb};
        }

        :host([selected])::after {
            /* The background needs to be calculated based on the selected background state
                for this control. We currently have no way of changing that, so setting to
                accent-foreground-rest for the time being */
            background: ${Ct};
            border-radius: calc(${M} * 1px);
            content: "";
            display: block;
            position: absolute;
            top: calc((${D} / 4) * 1px);
            width: 3px;
            height: calc((${D} / 2) * 1px);
        }

        ::slotted(${i.tagFor(lt)}) {
            --tree-item-nested-width: 1em;
            --expand-collapse-button-nested-width: calc(${D} * -1px);
        }
    `.withBehaviors(new Pi(Gb,Wb),P(b`
            :host {
                forced-color-adjust: none;
                border-color: transparent;
                background: ${d.Field};
                color: ${d.FieldText};
            }
            :host .content-region .expand-collapse-glyph {
                fill: ${d.FieldText};
            }
            :host .positioning-region:hover,
            :host([selected]) .positioning-region {
                background: ${d.Highlight};
            }
            :host .positioning-region:hover .content-region,
            :host([selected]) .positioning-region .content-region {
                color: ${d.HighlightText};
            }
            :host .positioning-region:hover .content-region .expand-collapse-glyph,
            :host .positioning-region:hover .content-region .start,
            :host .positioning-region:hover .content-region .end,
            :host([selected]) .content-region .expand-collapse-glyph,
            :host([selected]) .content-region .start,
            :host([selected]) .content-region .end {
                fill: ${d.HighlightText};
            }
            :host([selected])::after {
                background: ${d.Field};
            }
            :host(:${$}) .positioning-region {
                border-color: ${d.FieldText};
                box-shadow: 0 0 0 2px inset ${d.Field};
                color: ${d.FieldText};
            }
            :host([disabled]) .content-region,
            :host([disabled]) .positioning-region:hover .content-region {
                opacity: 1;
                color: ${d.GrayText};
            }
            :host([disabled]) .content-region .expand-collapse-glyph,
            :host([disabled]) .content-region .start,
            :host([disabled]) .content-region .end,
            :host([disabled]) .positioning-region:hover .content-region .expand-collapse-glyph,
            :host([disabled]) .positioning-region:hover .content-region .start,
            :host([disabled]) .positioning-region:hover .content-region .end {
                fill: ${d.GrayText};
            }
            :host([disabled]) .positioning-region:hover {
                background: ${d.Field};
            }
            .expand-collapse-glyph,
            .start,
            .end {
                fill: ${d.FieldText};
            }
            :host(.nested) .expand-collapse-button:hover {
                background: ${d.Field};
            }
            :host(.nested) .expand-collapse-button:hover .expand-collapse-glyph {
                fill: ${d.FieldText};
            }
        `)),Zb=lt.compose({baseName:"tree-item",template:xf,styles:Qb,expandCollapseGlyph:`
        <svg
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
            class="expand-collapse-glyph"
        >
            <path
                d="M5.00001 12.3263C5.00124 12.5147 5.05566 12.699 5.15699 12.8578C5.25831 13.0167 5.40243 13.1437 5.57273 13.2242C5.74304 13.3047 5.9326 13.3354 6.11959 13.3128C6.30659 13.2902 6.4834 13.2152 6.62967 13.0965L10.8988 8.83532C11.0739 8.69473 11.2153 8.51658 11.3124 8.31402C11.4096 8.11146 11.46 7.88966 11.46 7.66499C11.46 7.44033 11.4096 7.21853 11.3124 7.01597C11.2153 6.81341 11.0739 6.63526 10.8988 6.49467L6.62967 2.22347C6.48274 2.10422 6.30501 2.02912 6.11712 2.00691C5.92923 1.9847 5.73889 2.01628 5.56823 2.09799C5.39757 2.17969 5.25358 2.30817 5.153 2.46849C5.05241 2.62882 4.99936 2.8144 5.00001 3.00369V12.3263Z"
            />
        </svg>
    `}),Jb=(i,t)=>b`
    ${H("flex")} :host {
        flex-direction: column;
        align-items: stretch;
        min-width: fit-content;
        font-size: 0;
    }

    :host:focus-visible {
        outline: none;
    }
`,Kb=ro.compose({baseName:"tree-view",template:$f,styles:Jb});function Lc(i){return hl.getOrCreate(i).withPrefix("fast")}Lc().register(Kn(),mc(),fc(),Qn({collapsedIcon:`<svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="16"
      fill="black"
      class="bi bi-arrows-expand"
      viewBox="0 0 16 16"
    >
      <path
        fill-rule="evenodd"
        d="M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8ZM7.646.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 1.707V5.5a.5.5 0 0 1-1 0V1.707L6.354 2.854a.5.5 0 1 1-.708-.708l2-2ZM8 10a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 14.293V10.5A.5.5 0 0 1 8 10Z"
      />
    </svg>`,expandedIcon:`<svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="100%"
      fill="black"
      class="bi bi-arrows-collapse"
      viewBox="0 0 16 16"
    >
      <path
        fill-rule="evenodd"
        d="M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8Zm7-8a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 4.293V.5A.5.5 0 0 1 8 0Zm-.5 11.707-1.146 1.147a.5.5 0 0 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 11.707V15.5a.5.5 0 0 1-1 0v-3.793Z"
      />
    </svg>`}));const tv=st`
  <fast-accordion-item>
    <span slot="heading" class="slot-heading">
      ${i=>st`
        <div class="collapsed-container">
          <div class="right">
            <span class="id">
              <span class="title">RUN ID:</span>
              <span>${i.id}</span>
            </span>
          </div>
          <div class="left">
            <div class="status-badge">
              <div>
                <style>
                  /* For example purposes only. App authors needs to define */
                  fast-badge {
                    --badge-fill-error: #d32f2f;
                    --badge-fill-processing: #ffc107;
                    --badge-fill-cancelled: #cccccc;
                    --badge-fill-complete: #4caf50;
                    --badge-fill-transparent: transparent;
                    --badge-color-black: #000000;
                    --badge-color-white: #ffffff;
                  }
                </style>
                ${Gt(()=>(i==null?void 0:i.state)==="COMPLETE",st`
                    <fast-badge fill="complete" color="white"
                      >${i.state}</fast-badge
                    >
                  `)}
                ${Gt(()=>(i==null?void 0:i.state)==="SYSTEM_ERROR",st`
                    <fast-badge fill="error" color="white"
                      >${i.state}</fast-badge
                    >
                  `)}
                ${Gt(()=>(i==null?void 0:i.state)==="PROCESSING",st`
                    <fast-badge fill="processing" color="white"
                      >${i.state}</fast-badge
                    >
                  `)}
                ${Gt(()=>(i==null?void 0:i.state)==="CANCELED",st`
                    <fast-badge fill="cancelled" color="white"
                      >${i.state}</fast-badge
                    >
                  `)}
              </div>
            </div>
          </div>
        </div>
      `}
    </span>
    ${Gt(i=>i.isLoading,st` <fast-skeleton
          style="border-radius: 4px; margin-top: 10px; height: 20px; width: 20%"
          shape="rect"
        ></fast-skeleton>
        <fast-skeleton
          style="border-radius: 4px; margin-top: 10px; height: 20px; width: 40%"
          shape="rect"
        ></fast-skeleton>
        <fast-skeleton
          style="border-radius: 4px; margin-top: 10px; height: 20px; width:25%"
          shape="rect"
        ></fast-skeleton>
        <fast-skeleton
          style="border-radius: 4px;height: 80px;margin-top: 20px;margin-bottom: 10px;"
          shape="rect"
        ></fast-skeleton>
        <fast-skeleton
          style="border-radius: 4px;height: 80px;margin-top: 20px;margin-bottom: 10px;"
          shape="rect"
        ></fast-skeleton>`)}
    ${Gt(i=>!i.isLoading,st`
        <div class="expanded-container">
          <div class="meta-data">
            <div class="meta-data-left">
              <div class="name">
                <span class="title"> Name: </span>
                ${i=>i.data.name}
              </div>
              <div class="description">
                <span class="title"> Description: </span>
                ${i=>i.data.description}
              </div>
              <div class="creation-time">
                <span class="title"> Creation Time: </span>
                ${i=>i.data.creation_time}
              </div>
            </div>
            ${Gt(i=>i.state==="RUNNING",st`<div class="meta-data-right">
                <fast-button
                  class="delete-button"
                  @click=${i=>i.handleDelete()}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-trash"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"
                    />
                    <path
                      d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"
                    />
                  </svg>
                </fast-button>
              </div>`)}
          </div>
          <div class="executors">
            <div class="section-heading">
              <span class="title">Executors: </span>
            </div>
            ${Xe(i=>i.data.executors,st`
                <div class="executor">
                  <div class="image">
                    <span class="title">Image: </span>
                    ${i=>i.image}
                  </div>
                  <div class="command-list">
                    <span class="title">Commands: </span>

                    ${Xe(i=>i.command,st`<li class="command">${i=>i}</li>`)}
                  </div>
                </div>
              `)}
          </div>
          <div class="logs">
            <div class="section-heading">
              <span class="title"> Logs </span>
            </div>
            ${Gt(i=>i.data.logs&&i.data.logs.length>0,st`
                ${Xe(i=>i.data.logs,st`
                    <div class="log-entry">
                      <div class="start-time">
                        <span class="title">Start Time:</span> ${i=>i.start_time}
                      </div>
                      <div class="end-time">
                        <span class="title">End Time:</span>
                        ${i=>i.end_time}
                      </div>
                      ${Gt(i=>i.logs&&i.logs.length>0,st`
                          <div class="stdout">
                            <span class="title">Stdout:</span>
                            ${i=>i.logs[0].stdout}
                          </div>
                          <div class="exit-code">
                            <span class="title">Exit Code: </span>
                            ${i=>i.logs[0].exit_code}
                          </div>
                        `)}
                      ${Gt(i=>i.metadata&&i.metadata.USER_ID,st`
                          <div class="user-id">
                            <span class="title">Metadata User ID: </span>
                            ${i=>i.metadata.USER_ID}
                          </div>
                        `)}
                    </div>
                  `)}
              `)}
          </div>
        </div>
      `)}
  </fast-accordion-item>
`,ev=Cr`
  .slot-heading {
    color: black;
  }

  .collapsed-container {
    display: flex;
    border: none;
    width: 100%;
    height: 100%;
    justify-content: space-between;
    align-items: center;
  }

  .right {
    margin-right: 10px;
  }

  .left {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .id {
    display: flex;
    align-items: center;
  }

  .title {
    margin-right: 5px;
    font-weight: bold;
    font-size: 0.8rem;
  }

  .delete-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin: 10px;
    transition: color 0.2s ease, transform 0.2s ease;
  }

  .delete-icon:hover {
    transform: scale(1.1);
  }

  .expanded-container {
    padding: 1rem;
    color: black;
  }

  .meta-data {
    margin-bottom: 1rem;
    display: flex;
    justify-content: space-between;
  }

  .name,
  .description,
  .creation-time {
    margin-bottom: 0.5rem;
    font-weight: bold;
  }

  .section-heading {
    margin-bottom: 0.5rem;
    font-weight: bold;
  }

  .executor {
    padding: 0.5rem;
    margin-bottom: 1rem;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .image {
    margin-bottom: 0.5rem;
  }

  .command-list {
    margin-top: 0.5rem;
  }

  .command {
    padding: 0.2rem 1rem;
  }

  .log-entry {
    padding: 0.5rem;
    margin-bottom: 1rem;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .start-time,
  .end-time {
    margin-bottom: 0.5rem;
    font-weight: bold;
  }

  .stdout,
  .exit-code,
  .user-id {
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
  }
`,Ac="https://csc-tesk-noauth.rahtiapp.fi/v1",Pc=`${Ac}/tasks`,iv=`${Ac}/tasks`,Vc=async(i=5,t="",e="MINIMAL",s="")=>{let o=`${Pc}?`;i&&(o+=`page_size=${i}&`),e&&(o+=`view=${e}&`),t.length>0&&(o+=`page_token=${t}&`),s.length>0&&(o+=`name_prefix=${s}&`);try{const n=await fetch(o);if(!n.ok)throw new Error(`HTTP error! Status: ${n.status}`);return await n.json()}catch(n){throw new Error(`Error: ${n}`)}},sv=async i=>{const t=`${Pc}/${i}?view=FULL`;try{const e=await fetch(t);if(!e.ok)throw new Error(`HTTP error! Status: ${e.status}`);return await e.json()}catch(e){throw new Error(`Error: ${e}`)}},ov=async i=>{const t=`${iv}/${i}:cancel`;try{return await fetch(t,{method:"DELETE"})}catch(e){throw new Error(`Error: ${e}`)}};let vi=class extends xi{constructor(){super(...arguments),this.id="",this.state="",this.isLoading=!0,this.data={id:this.id,state:this.state,name:"",description:"",creation_time:"",executors:[],logs:[]},this.handleDelete=async()=>{await ov(this.id)},this.handleFetch=async()=>{this.isLoading&&(this.data=await sv(this.id),this.isLoading=!1)}}connectedCallback(){var i;super.connectedCallback(),this.addEventListener("change",this.handleFetch);const t=(i=this.shadowRoot)===null||i===void 0?void 0:i.querySelector("fast-button");!this.isLoading&&t&&t.addEventListener("click",this.handleDelete.bind(this))}disconnectedCallback(){var i;super.disconnectedCallback(),this.removeEventListener("change",this.handleFetch);const t=(i=this.shadowRoot)===null||i===void 0?void 0:i.querySelector("fast-button");!this.isLoading&&t&&t.addEventListener("click",this.handleDelete.bind(this))}};$t([Ao],vi.prototype,"id",void 0),$t([Ao],vi.prototype,"state",void 0),$t([Ft],vi.prototype,"isLoading",void 0),$t([Ft],vi.prototype,"data",void 0),vi=$t([kr({name:"ecc-tes-get-run",template:tv,styles:ev,shadowOptions:{mode:"open"}})],vi);var nv=vi;Lc().register(ac(),Qn(),Kn(),Ic(),$c(),Dc());const rv=st`
  <div class="container">
    <div class="search">
      <fast-text-field
        placeholder="Search by name_prefix"
        :value=${i=>i.searchInput}
        @input=${(i,t)=>i.handleNameInput(t.event)}
      >
      </fast-text-field>
      <fast-select
        :value=${i=>i.stateInput}
        @input=${(i,t)=>i.handleStateInput(t.event)}
      >
        <fast-option value="ALL">All</fast-option>
        <fast-option value="COMPLETE">Completed</fast-option>
        <fast-option value="PROCESSING">Processing</fast-option>
        <fast-option value="SYSTEM_ERROR">Error</fast-option>
        <fast-option value="CANCELED">Cancelled</fast-option>
      </fast-select>
    </div>
    <div class="list">
      <fast-accordion>
        ${Gt(i=>i.isLoading,st` ${Xe(i=>Array.from(Array(parseInt(i.pageSize,10))),st`
              <fast-accordion-item>
                <fast-skeleton
                  style="border-radius: 4px;height: 100%;margin-bottom: 10px;"
                  shape="rect"
                  slot="heading"
                ></fast-skeleton>
              </fast-accordion-item>
            `)}`)}
        ${Xe(i=>i.data,st`
            <ecc-tes-get-run
              class="run-item"
              id=${i=>i.id}
              state=${i=>i.state}
            >
            </ecc-tes-get-run>
          `)}
      </fast-accordion>
    </div>
    <div class="pagination">
      ${Gt(i=>i.isLoading,st` ${Xe(()=>Array.from(Array(4)),st`
            <fast-button appearance="outline">
              <fast-skeleton
                style="border-radius: 4px;height: 100%;margin-bottom: 10px;"
                shape="rect"
                slot="heading"
              ></fast-skeleton>
            </fast-button>
          `)}`)}
      ${Gt(i=>!i.isLoading,st`
          ${Xe(i=>Array.from({length:i.pageNumberOffset},(t,e)=>e+i.firstPageNumber),st`<fast-button
              appearance="outline"
              style="color:black"
              @click=${(i,t)=>t.parent.handleClick(i)}
              >${i=>i}</fast-button
            >`)}
          <fast-button
            appearance="neutral"
            ?disabled=${i=>i.nextPageToken===void 0}
            @click=${i=>i.handleNext()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="w-6 h-6"
            >
              <path
                d="M5.055 7.06c-1.25-.714-2.805.189-2.805 1.628v8.123c0 1.44 1.555 2.342 2.805 1.628L12 14.471v2.34c0 1.44 1.555 2.342 2.805 1.628l7.108-4.061c1.26-.72 1.26-2.536 0-3.256L14.805 7.06C13.555 6.346 12 7.25 12 8.688v2.34L5.055 7.06z"
              />
            </svg>
          </fast-button>
        `)}
    </div>
  </div>
`,av=Cr`
  .container {
    display: block;
  }

  .search {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  fast-text-field {
    width: 100%;
  }

  fast-select {
    width: 25%;
  }

  .list {
    padding-bottom: 1rem;
  }

  .pagination {
    display: flex;
    justify-content: center;
    gap: 10px;
    width: 100%;
    align-items: center;
  }

  @media (max-width: 450px) {
    .search {
      flex-direction: column;
    }
    fast-select {
      width: 100%;
    }
  }
`;let _t=class extends xi{constructor(){super(...arguments),this.pageSize=5,this.nextPageToken=null,this.data=[],this.cachedData=[],this.firstPageNumber=1,this.pageNumberOffset=0,this.pageNumberArray=[],this.searchInput="",this.stateInput="ALL",this.unfilterdData=[],this.isLoading=!0,this.fetchData=async(i,t=null)=>{this.isLoading=!0,this.data=[],i!==""&&(this.firstPageNumber+=this.pageNumberOffset);let e=[];if(t?e=await Vc(this.pageSize*3,i,"MINIMAL",t):e=await Vc(this.pageSize*3,i),e&&e.tasks){this.cachedData=e.tasks,this.data=this.cachedData.slice(0,this.pageSize),this.unfilterdData=this.data,this.nextPageToken=e.next_page_token,this.pageNumberOffset=Math.ceil(this.cachedData.length/this.pageSize);const s=[];for(let o=0;o<this.pageNumberOffset;o+=1)s.push(o+this.firstPageNumber);this.pageNumberArray=s}this.isLoading=!1},this.handleNext=async()=>{this.searchInput!==""?await this.fetchData(this.nextPageToken,this.searchInput):await this.fetchData(this.nextPageToken,this.searchInput)},this.handleClick=i=>{const t=i-this.firstPageNumber,e=t*this.pageSize,s=(t+1)*this.pageSize;this.data=this.cachedData.slice(e,s),this.unfilterdData=this.data,this.stateInput="ALL"}}async connectedCallback(){super.connectedCallback(),await this.fetchData("")}handleNameInput(i){this.searchInput=i.target.value,this.firstPageNumber=1,this.pageNumberOffset=0,this.fetchData("",this.searchInput)}handleStateInput(i){this.stateInput=i.target.value,this.stateInput==="ALL"?this.data=this.unfilterdData:this.data=this.unfilterdData.filter(t=>t.state===this.stateInput)}};$t([Ao],_t.prototype,"pageSize",void 0),$t([Ft],_t.prototype,"nextPageToken",void 0),$t([Ft],_t.prototype,"data",void 0),$t([Ft],_t.prototype,"cachedData",void 0),$t([Ft],_t.prototype,"firstPageNumber",void 0),$t([Ft],_t.prototype,"pageNumberOffset",void 0),$t([Ft],_t.prototype,"pageNumberArray",void 0),$t([Ft],_t.prototype,"searchInput",void 0),$t([Ft],_t.prototype,"stateInput",void 0),$t([Ft],_t.prototype,"unfilterdData",void 0),$t([Ft],_t.prototype,"isLoading",void 0),_t=$t([kr({name:"ecc-tes-get-runs",template:rv,styles:av})],_t);var lv=_t;const cv=[lv,nv];cv.forEach(i=>{Wr.getOrCreate().withShadowRootMode("open").register(i)});
