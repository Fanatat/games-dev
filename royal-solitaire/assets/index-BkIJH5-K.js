(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=1e3,t=1001,n=1002,r=1003,i=1004,a=1005,o=1006,s=1007,c=1008,l=1009,u=1010,d=1011,f=1012,p=1013,m=1014,h=1015,g=1016,_=1017,v=1018,y=1020,b=35902,x=35899,S=1021,C=1022,w=1023,T=1026,E=1027,D=1028,ee=1029,te=1030,O=1031,ne=1033,k=33776,A=33777,re=33778,ie=33779,j=35840,ae=35841,oe=35842,se=35843,ce=36196,le=37492,ue=37496,de=37488,M=37489,fe=37490,pe=37491,me=37808,he=37809,ge=37810,_e=37811,ve=37812,ye=37813,be=37814,xe=37815,Se=37816,Ce=37817,we=37818,Te=37819,Ee=37820,De=37821,Oe=36492,ke=36494,Ae=36495,je=36283,Me=36284,Ne=36285,Pe=36286,Fe=2300,N=2301,Ie=2302,Le=2303,Re=2400,P=2401,ze=2402,F=3200,Be=`srgb`,I=`srgb-linear`,Ve=`linear`,He=`srgb`,Ue=7680,We=35044,Ge=2e3;function Ke(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}function qe(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function Je(e){return document.createElementNS(`http://www.w3.org/1999/xhtml`,e)}function Ye(){let e=Je(`canvas`);return e.style.display=`block`,e}var Xe={};function Ze(...e){let t=`THREE.`+e.shift();console.log(t,...e)}function Qe(e){let t=e[0];if(typeof t==`string`&&t.startsWith(`TSL:`)){let t=e[1];t&&t.isStackTrace?e[0]+=` `+t.getLocation():e[1]=`Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.`}return e}function L(...e){e=Qe(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.warn(n.getError(t)):console.warn(t,...e)}}function R(...e){e=Qe(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.error(n.getError(t)):console.error(t,...e)}}function $e(...e){let t=e.join(` `);t in Xe||(Xe[t]=!0,L(...e))}function et(e,t,n){return new Promise(function(r,i){function a(){switch(e.clientWaitSync(t,e.SYNC_FLUSH_COMMANDS_BIT,0)){case e.WAIT_FAILED:i();break;case e.TIMEOUT_EXPIRED:setTimeout(a,n);break;default:r()}}setTimeout(a,n)})}var tt={0:1,2:6,4:7,3:5,1:0,6:2,7:4,5:3},nt=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n!==void 0&&n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let r=n[e];if(r!==void 0){let e=r.indexOf(t);e!==-1&&r.splice(e,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let t=n.slice(0);for(let n=0,r=t.length;n<r;n++)t[n].call(this,e);e.target=null}}},rt=`00.01.02.03.04.05.06.07.08.09.0a.0b.0c.0d.0e.0f.10.11.12.13.14.15.16.17.18.19.1a.1b.1c.1d.1e.1f.20.21.22.23.24.25.26.27.28.29.2a.2b.2c.2d.2e.2f.30.31.32.33.34.35.36.37.38.39.3a.3b.3c.3d.3e.3f.40.41.42.43.44.45.46.47.48.49.4a.4b.4c.4d.4e.4f.50.51.52.53.54.55.56.57.58.59.5a.5b.5c.5d.5e.5f.60.61.62.63.64.65.66.67.68.69.6a.6b.6c.6d.6e.6f.70.71.72.73.74.75.76.77.78.79.7a.7b.7c.7d.7e.7f.80.81.82.83.84.85.86.87.88.89.8a.8b.8c.8d.8e.8f.90.91.92.93.94.95.96.97.98.99.9a.9b.9c.9d.9e.9f.a0.a1.a2.a3.a4.a5.a6.a7.a8.a9.aa.ab.ac.ad.ae.af.b0.b1.b2.b3.b4.b5.b6.b7.b8.b9.ba.bb.bc.bd.be.bf.c0.c1.c2.c3.c4.c5.c6.c7.c8.c9.ca.cb.cc.cd.ce.cf.d0.d1.d2.d3.d4.d5.d6.d7.d8.d9.da.db.dc.dd.de.df.e0.e1.e2.e3.e4.e5.e6.e7.e8.e9.ea.eb.ec.ed.ee.ef.f0.f1.f2.f3.f4.f5.f6.f7.f8.f9.fa.fb.fc.fd.fe.ff`.split(`.`),it=Math.PI/180,at=180/Math.PI;function ot(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(rt[e&255]+rt[e>>8&255]+rt[e>>16&255]+rt[e>>24&255]+`-`+rt[t&255]+rt[t>>8&255]+`-`+rt[t>>16&15|64]+rt[t>>24&255]+`-`+rt[n&63|128]+rt[n>>8&255]+`-`+rt[n>>16&255]+rt[n>>24&255]+rt[r&255]+rt[r>>8&255]+rt[r>>16&255]+rt[r>>24&255]).toLowerCase()}function z(e,t,n){return Math.max(t,Math.min(n,e))}function st(e,t){return(e%t+t)%t}function ct(e,t,n){return(1-n)*e+n*t}function lt(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return e/4294967295;case Uint16Array:return e/65535;case Uint8Array:return e/255;case Int32Array:return Math.max(e/2147483647,-1);case Int16Array:return Math.max(e/32767,-1);case Int8Array:return Math.max(e/127,-1);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}function ut(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return Math.round(e*4294967295);case Uint16Array:return Math.round(e*65535);case Uint8Array:return Math.round(e*255);case Int32Array:return Math.round(e*2147483647);case Int16Array:return Math.round(e*32767);case Int8Array:return Math.round(e*127);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}var B=class e{static{e.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw Error(`THREE.Vector2: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw Error(`THREE.Vector2: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=z(this.x,e.x,t.x),this.y=z(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=z(this.x,e,t),this.y=z(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(z(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(z(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),r=Math.sin(t),i=this.x-e.x,a=this.y-e.y;return this.x=i*n-a*r+e.x,this.y=i*r+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},dt=class{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,i,a,o){let s=n[r+0],c=n[r+1],l=n[r+2],u=n[r+3],d=i[a+0],f=i[a+1],p=i[a+2],m=i[a+3];if(u!==m||s!==d||c!==f||l!==p){let e=s*d+c*f+l*p+u*m;e<0&&(d=-d,f=-f,p=-p,m=-m,e=-e);let t=1-o;if(e<.9995){let n=Math.acos(e),r=Math.sin(n);t=Math.sin(t*n)/r,o=Math.sin(o*n)/r,s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o}else{s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o;let e=1/Math.sqrt(s*s+c*c+l*l+u*u);s*=e,c*=e,l*=e,u*=e}}e[t]=s,e[t+1]=c,e[t+2]=l,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,r,i,a){let o=n[r],s=n[r+1],c=n[r+2],l=n[r+3],u=i[a],d=i[a+1],f=i[a+2],p=i[a+3];return e[t]=o*p+l*u+s*f-c*d,e[t+1]=s*p+l*d+c*u-o*f,e[t+2]=c*p+l*f+o*d-s*u,e[t+3]=l*p-o*u-s*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,r=e._y,i=e._z,a=e._order,o=Math.cos,s=Math.sin,c=o(n/2),l=o(r/2),u=o(i/2),d=s(n/2),f=s(r/2),p=s(i/2);switch(a){case`XYZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`YXZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`ZXY`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`ZYX`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`YZX`:this._x=d*l*u+c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u-d*f*p;break;case`XZY`:this._x=d*l*u-c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u+d*f*p;break;default:L(`Quaternion: .setFromEuler() encountered an unknown order: `+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],r=t[4],i=t[8],a=t[1],o=t[5],s=t[9],c=t[2],l=t[6],u=t[10],d=n+o+u;if(d>0){let e=.5/Math.sqrt(d+1);this._w=.25/e,this._x=(l-s)*e,this._y=(i-c)*e,this._z=(a-r)*e}else if(n>o&&n>u){let e=2*Math.sqrt(1+n-o-u);this._w=(l-s)/e,this._x=.25*e,this._y=(r+a)/e,this._z=(i+c)/e}else if(o>u){let e=2*Math.sqrt(1+o-n-u);this._w=(i-c)/e,this._x=(r+a)/e,this._y=.25*e,this._z=(s+l)/e}else{let e=2*Math.sqrt(1+u-n-o);this._w=(a-r)/e,this._x=(i+c)/e,this._y=(s+l)/e,this._z=.25*e}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(z(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x*=e,this._y*=e,this._z*=e,this._w*=e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=t._x,s=t._y,c=t._z,l=t._w;return this._x=n*l+a*o+r*c-i*s,this._y=r*l+a*s+i*o-n*c,this._z=i*l+a*c+n*s-r*o,this._w=a*l-n*o-r*s-i*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,r=-r,i=-i,a=-a,o=-o);let s=1-t;if(o<.9995){let e=Math.acos(o),c=Math.sin(e);s=Math.sin(s*e)/c,t=Math.sin(t*e)/c,this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this._onChangeCallback()}else this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),i=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),i*Math.sin(t),i*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},V=class e{static{e.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw Error(`THREE.Vector3: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw Error(`THREE.Vector3: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(pt.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(pt.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6]*r,this.y=i[1]*t+i[4]*n+i[7]*r,this.z=i[2]*t+i[5]*n+i[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=e.elements,a=1/(i[3]*t+i[7]*n+i[11]*r+i[15]);return this.x=(i[0]*t+i[4]*n+i[8]*r+i[12])*a,this.y=(i[1]*t+i[5]*n+i[9]*r+i[13])*a,this.z=(i[2]*t+i[6]*n+i[10]*r+i[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,r=this.z,i=e.x,a=e.y,o=e.z,s=e.w,c=2*(a*r-o*n),l=2*(o*t-i*r),u=2*(i*n-a*t);return this.x=t+s*c+a*u-o*l,this.y=n+s*l+o*c-i*u,this.z=r+s*u+i*l-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[4]*n+i[8]*r,this.y=i[1]*t+i[5]*n+i[9]*r,this.z=i[2]*t+i[6]*n+i[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=z(this.x,e.x,t.x),this.y=z(this.y,e.y,t.y),this.z=z(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=z(this.x,e,t),this.y=z(this.y,e,t),this.z=z(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(z(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,r=e.y,i=e.z,a=t.x,o=t.y,s=t.z;return this.x=r*s-i*o,this.y=i*a-n*s,this.z=n*o-r*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return ft.copy(this).projectOnVector(e),this.sub(ft)}reflect(e){return this.sub(ft.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(z(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},ft=new V,pt=new dt,H=class e{static{e.prototype.isMatrix3=!0}constructor(e,t,n,r,i,a,o,s,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c)}set(e,t,n,r,i,a,o,s,c){let l=this.elements;return l[0]=e,l[1]=r,l[2]=o,l[3]=t,l[4]=i,l[5]=s,l[6]=n,l[7]=a,l[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[3],s=n[6],c=n[1],l=n[4],u=n[7],d=n[2],f=n[5],p=n[8],m=r[0],h=r[3],g=r[6],_=r[1],v=r[4],y=r[7],b=r[2],x=r[5],S=r[8];return i[0]=a*m+o*_+s*b,i[3]=a*h+o*v+s*x,i[6]=a*g+o*y+s*S,i[1]=c*m+l*_+u*b,i[4]=c*h+l*v+u*x,i[7]=c*g+l*y+u*S,i[2]=d*m+f*_+p*b,i[5]=d*h+f*v+p*x,i[8]=d*g+f*y+p*S,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8];return t*a*l-t*o*c-n*i*l+n*o*s+r*i*c-r*a*s}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=l*a-o*c,d=o*s-l*i,f=c*i-a*s,p=t*u+n*d+r*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let m=1/p;return e[0]=u*m,e[1]=(r*c-l*n)*m,e[2]=(o*n-r*a)*m,e[3]=d*m,e[4]=(l*t-r*s)*m,e[5]=(r*i-o*t)*m,e[6]=f*m,e[7]=(n*s-c*t)*m,e[8]=(a*t-n*i)*m,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,i,a,o){let s=Math.cos(i),c=Math.sin(i);return this.set(n*s,n*c,-n*(s*a+c*o)+a+e,-r*c,r*s,-r*(-c*a+s*o)+o+t,0,0,1),this}scale(e,t){return $e(`Matrix3: .scale() is deprecated. Use .makeScale() instead.`),this.premultiply(mt.makeScale(e,t)),this}rotate(e){return $e(`Matrix3: .rotate() is deprecated. Use .makeRotation() instead.`),this.premultiply(mt.makeRotation(-e)),this}translate(e,t){return $e(`Matrix3: .translate() is deprecated. Use .makeTranslation() instead.`),this.premultiply(mt.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<9;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},mt=new H,ht=new H().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),gt=new H().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function _t(){let e={enabled:!0,workingColorSpace:I,spaces:{},convert:function(e,t,n){return this.enabled===!1||t===n||!t||!n?e:(this.spaces[t].transfer===`srgb`&&(e.r=vt(e.r),e.g=vt(e.g),e.b=vt(e.b)),this.spaces[t].primaries!==this.spaces[n].primaries&&(e.applyMatrix3(this.spaces[t].toXYZ),e.applyMatrix3(this.spaces[n].fromXYZ)),this.spaces[n].transfer===`srgb`&&(e.r=yt(e.r),e.g=yt(e.g),e.b=yt(e.b)),e)},workingToColorSpace:function(e,t){return this.convert(e,this.workingColorSpace,t)},colorSpaceToWorking:function(e,t){return this.convert(e,t,this.workingColorSpace)},getPrimaries:function(e){return this.spaces[e].primaries},getTransfer:function(e){return e===``?Ve:this.spaces[e].transfer},getToneMappingMode:function(e){return this.spaces[e].outputColorSpaceConfig.toneMappingMode||`standard`},getLuminanceCoefficients:function(e,t=this.workingColorSpace){return e.fromArray(this.spaces[t].luminanceCoefficients)},define:function(e){Object.assign(this.spaces,e)},_getMatrix:function(e,t,n){return e.copy(this.spaces[t].toXYZ).multiply(this.spaces[n].fromXYZ)},_getDrawingBufferColorSpace:function(e){return this.spaces[e].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(e=this.workingColorSpace){return this.spaces[e].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(t,n){return $e(`ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace().`),e.workingToColorSpace(t,n)},toWorkingColorSpace:function(t,n){return $e(`ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking().`),e.colorSpaceToWorking(t,n)}},t=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],r=[.3127,.329];return e.define({[I]:{primaries:t,whitePoint:r,transfer:Ve,toXYZ:ht,fromXYZ:gt,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:Be},outputColorSpaceConfig:{drawingBufferColorSpace:Be}},[Be]:{primaries:t,whitePoint:r,transfer:He,toXYZ:ht,fromXYZ:gt,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:Be}}}),e}var U=_t();function vt(e){return e<.04045?e*.0773993808:(e*.9478672986+.0521327014)**2.4}function yt(e){return e<.0031308?e*12.92:1.055*e**.41666-.055}var bt,xt=class{static getDataURL(e,t=`image/png`){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>`u`)return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{bt===void 0&&(bt=Je(`canvas`)),bt.width=e.width,bt.height=e.height;let t=bt.getContext(`2d`);e instanceof ImageData?t.putImageData(e,0,0):t.drawImage(e,0,0,e.width,e.height),n=bt}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap){let t=Je(`canvas`);t.width=e.width,t.height=e.height;let n=t.getContext(`2d`);n.drawImage(e,0,0,e.width,e.height);let r=n.getImageData(0,0,e.width,e.height),i=r.data;for(let e=0;e<i.length;e++)i[e]=vt(i[e]/255)*255;return n.putImageData(r,0,0),t}if(e.data){let t=e.data.slice(0);for(let e=0;e<t.length;e++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[e]=Math.floor(vt(t[e]/255)*255):t[e]=vt(t[e]);return{data:t,width:e.width,height:e.height}}return L(`ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied.`),e}},St=0,Ct=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:St++}),this.uuid=ot(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<`u`&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<`u`&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t===null?e.set(0,0,0):e.set(t.width,t.height,t.depth||0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:``},r=this.data;if(r!==null){let e;if(Array.isArray(r)){e=[];for(let t=0,n=r.length;t<n;t++)r[t].isDataTexture?e.push(wt(r[t].image)):e.push(wt(r[t]))}else e=wt(r);n.url=e}return t||(e.images[this.uuid]=n),n}};function wt(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap?xt.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(L(`Texture: Unable to serialize Texture.`),{})}var Tt=0,Et=new V,Dt=class r extends nt{constructor(e=r.DEFAULT_IMAGE,n=r.DEFAULT_MAPPING,i=t,a=t,s=o,u=c,d=w,f=l,p=r.DEFAULT_ANISOTROPY,m=``){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Tt++}),this.uuid=ot(),this.name=``,this.source=new Ct(e),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=i,this.wrapT=a,this.magFilter=s,this.minFilter=u,this.anisotropy=p,this.format=d,this.internalFormat=null,this.type=f,this.offset=new B(0,0),this.repeat=new B(1,1),this.center=new B(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new H,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=m,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Et).x}get height(){return this.source.getSize(Et).y}get depth(){return this.source.getSize(Et).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){L(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let r=this[t];if(r===void 0){L(`Texture.setValues(): property '${t}' does not exist.`);continue}r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:`Texture`,generator:`Texture.toJSON`},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:`dispose`})}transformUv(r){if(this.mapping!==300)return r;if(r.applyMatrix3(this.matrix),r.x<0||r.x>1)switch(this.wrapS){case e:r.x-=Math.floor(r.x);break;case t:r.x=r.x<0?0:1;break;case n:Math.abs(Math.floor(r.x)%2)===1?r.x=Math.ceil(r.x)-r.x:r.x-=Math.floor(r.x)}if(r.y<0||r.y>1)switch(this.wrapT){case e:r.y-=Math.floor(r.y);break;case t:r.y=r.y<0?0:1;break;case n:Math.abs(Math.floor(r.y)%2)===1?r.y=Math.ceil(r.y)-r.y:r.y-=Math.floor(r.y)}return this.flipY&&(r.y=1-r.y),r}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Dt.DEFAULT_IMAGE=null,Dt.DEFAULT_MAPPING=300,Dt.DEFAULT_ANISOTROPY=1;var Ot=class e{static{e.prototype.isVector4=!0}constructor(e=0,t=0,n=0,r=1){this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw Error(`THREE.Vector4: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw Error(`THREE.Vector4: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w===void 0?1:e.w,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*i,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*i,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*i,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*i,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,i,a=.01,o=.1,s=e.elements,c=s[0],l=s[4],u=s[8],d=s[1],f=s[5],p=s[9],m=s[2],h=s[6],g=s[10];if(Math.abs(l-d)<a&&Math.abs(u-m)<a&&Math.abs(p-h)<a){if(Math.abs(l+d)<o&&Math.abs(u+m)<o&&Math.abs(p+h)<o&&Math.abs(c+f+g-3)<o)return this.set(1,0,0,0),this;t=Math.PI;let e=(c+1)/2,s=(f+1)/2,_=(g+1)/2,v=(l+d)/4,y=(u+m)/4,b=(p+h)/4;return e>s&&e>_?e<a?(n=0,r=.707106781,i=.707106781):(n=Math.sqrt(e),r=v/n,i=y/n):s>_?s<a?(n=.707106781,r=0,i=.707106781):(r=Math.sqrt(s),n=v/r,i=b/r):_<a?(n=.707106781,r=.707106781,i=0):(i=Math.sqrt(_),n=y/i,r=b/i),this.set(n,r,i,t),this}let _=Math.sqrt((h-p)*(h-p)+(u-m)*(u-m)+(d-l)*(d-l));return Math.abs(_)<.001&&(_=1),this.x=(h-p)/_,this.y=(u-m)/_,this.z=(d-l)/_,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=z(this.x,e.x,t.x),this.y=z(this.y,e.y,t.y),this.z=z(this.z,e.z,t.z),this.w=z(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=z(this.x,e,t),this.y=z(this.y,e,t),this.z=z(this.z,e,t),this.w=z(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(z(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},kt=class extends nt{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:o,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Ot(0,0,e,t),this.scissorTest=!1,this.viewport=new Ot(0,0,e,t),this.textures=[];let r=new Dt({width:e,height:t,depth:n.depth}),i=n.count;for(let e=0;e<i;e++)this.textures[e]=r.clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:o,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let e=0;e<this.textures.length;e++)this.textures[e].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,i=this.textures.length;r<i;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let n=Object.assign({},e.textures[t].image);this.textures[t].source=new Ct(n)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:`dispose`})}},At=class extends kt{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},jt=class extends Dt{constructor(e=null,n=1,i=1,a=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:n,height:i,depth:a},this.magFilter=r,this.minFilter=r,this.wrapR=t,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},Mt=class extends Dt{constructor(e=null,n=1,i=1,a=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:n,height:i,depth:a},this.magFilter=r,this.minFilter=r,this.wrapR=t,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Nt=class e{static{e.prototype.isMatrix4=!0}constructor(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h)}set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){let g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=r,g[1]=i,g[5]=a,g[9]=o,g[13]=s,g[2]=c,g[6]=l,g[10]=u,g[14]=d,g[3]=f,g[7]=p,g[11]=m,g[15]=h,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new e().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,r=1/Pt.setFromMatrixColumn(e,0).length(),i=1/Pt.setFromMatrixColumn(e,1).length(),a=1/Pt.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*i,t[5]=n[5]*i,t[6]=n[6]*i,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,r=e.y,i=e.z,a=Math.cos(n),o=Math.sin(n),s=Math.cos(r),c=Math.sin(r),l=Math.cos(i),u=Math.sin(i);if(e.order===`XYZ`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=-s*u,t[8]=c,t[1]=n+r*c,t[5]=e-i*c,t[9]=-o*s,t[2]=i-e*c,t[6]=r+n*c,t[10]=a*s}else if(e.order===`YXZ`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e+i*o,t[4]=r*o-n,t[8]=a*c,t[1]=a*u,t[5]=a*l,t[9]=-o,t[2]=n*o-r,t[6]=i+e*o,t[10]=a*s}else if(e.order===`ZXY`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e-i*o,t[4]=-a*u,t[8]=r+n*o,t[1]=n+r*o,t[5]=a*l,t[9]=i-e*o,t[2]=-a*c,t[6]=o,t[10]=a*s}else if(e.order===`ZYX`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=r*c-n,t[8]=e*c+i,t[1]=s*u,t[5]=i*c+e,t[9]=n*c-r,t[2]=-c,t[6]=o*s,t[10]=a*s}else if(e.order===`YZX`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=i-e*u,t[8]=r*u+n,t[1]=u,t[5]=a*l,t[9]=-o*l,t[2]=-c*l,t[6]=n*u+r,t[10]=e-i*u}else if(e.order===`XZY`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=-u,t[8]=c*l,t[1]=e*u+i,t[5]=a*l,t[9]=n*u-r,t[2]=r*u-n,t[6]=o*l,t[10]=i*u+e}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(It,e,Lt)}lookAt(e,t,n){let r=this.elements;return Bt.subVectors(e,t),Bt.lengthSq()===0&&(Bt.z=1),Bt.normalize(),Rt.crossVectors(n,Bt),Rt.lengthSq()===0&&(Math.abs(n.z)===1?Bt.x+=1e-4:Bt.z+=1e-4,Bt.normalize(),Rt.crossVectors(n,Bt)),Rt.normalize(),zt.crossVectors(Bt,Rt),r[0]=Rt.x,r[4]=zt.x,r[8]=Bt.x,r[1]=Rt.y,r[5]=zt.y,r[9]=Bt.y,r[2]=Rt.z,r[6]=zt.z,r[10]=Bt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[4],s=n[8],c=n[12],l=n[1],u=n[5],d=n[9],f=n[13],p=n[2],m=n[6],h=n[10],g=n[14],_=n[3],v=n[7],y=n[11],b=n[15],x=r[0],S=r[4],C=r[8],w=r[12],T=r[1],E=r[5],D=r[9],ee=r[13],te=r[2],O=r[6],ne=r[10],k=r[14],A=r[3],re=r[7],ie=r[11],j=r[15];return i[0]=a*x+o*T+s*te+c*A,i[4]=a*S+o*E+s*O+c*re,i[8]=a*C+o*D+s*ne+c*ie,i[12]=a*w+o*ee+s*k+c*j,i[1]=l*x+u*T+d*te+f*A,i[5]=l*S+u*E+d*O+f*re,i[9]=l*C+u*D+d*ne+f*ie,i[13]=l*w+u*ee+d*k+f*j,i[2]=p*x+m*T+h*te+g*A,i[6]=p*S+m*E+h*O+g*re,i[10]=p*C+m*D+h*ne+g*ie,i[14]=p*w+m*ee+h*k+g*j,i[3]=_*x+v*T+y*te+b*A,i[7]=_*S+v*E+y*O+b*re,i[11]=_*C+v*D+y*ne+b*ie,i[15]=_*w+v*ee+y*k+b*j,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[12],a=e[1],o=e[5],s=e[9],c=e[13],l=e[2],u=e[6],d=e[10],f=e[14],p=e[3],m=e[7],h=e[11],g=e[15],_=s*f-c*d,v=o*f-c*u,y=o*d-s*u,b=a*f-c*l,x=a*d-s*l,S=a*u-o*l;return t*(m*_-h*v+g*y)-n*(p*_-h*b+g*x)+r*(p*v-m*b+g*S)-i*(p*y-m*x+h*S)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[1],a=e[5],o=e[9],s=e[2],c=e[6],l=e[10];return t*(a*l-o*c)-n*(i*l-o*s)+r*(i*c-a*s)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=e[9],d=e[10],f=e[11],p=e[12],m=e[13],h=e[14],g=e[15],_=t*o-n*a,v=t*s-r*a,y=t*c-i*a,b=n*s-r*o,x=n*c-i*o,S=r*c-i*s,C=l*m-u*p,w=l*h-d*p,T=l*g-f*p,E=u*h-d*m,D=u*g-f*m,ee=d*g-f*h,te=_*ee-v*D+y*E+b*T-x*w+S*C;if(te===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let O=1/te;return e[0]=(o*ee-s*D+c*E)*O,e[1]=(r*D-n*ee-i*E)*O,e[2]=(m*S-h*x+g*b)*O,e[3]=(d*x-u*S-f*b)*O,e[4]=(s*T-a*ee-c*w)*O,e[5]=(t*ee-r*T+i*w)*O,e[6]=(h*y-p*S-g*v)*O,e[7]=(l*S-d*y+f*v)*O,e[8]=(a*D-o*T+c*C)*O,e[9]=(n*T-t*D-i*C)*O,e[10]=(p*x-m*y+g*_)*O,e[11]=(u*y-l*x-f*_)*O,e[12]=(o*w-a*E-s*C)*O,e[13]=(t*E-n*w+r*C)*O,e[14]=(m*v-p*b-h*_)*O,e[15]=(l*b-u*v+d*_)*O,this}scale(e){let t=this.elements,n=e.x,r=e.y,i=e.z;return t[0]*=n,t[4]*=r,t[8]*=i,t[1]*=n,t[5]*=r,t[9]*=i,t[2]*=n,t[6]*=r,t[10]*=i,t[3]*=n,t[7]*=r,t[11]*=i,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),r=Math.sin(t),i=1-n,a=e.x,o=e.y,s=e.z,c=i*a,l=i*o;return this.set(c*a+n,c*o-r*s,c*s+r*o,0,c*o+r*s,l*o+n,l*s-r*a,0,c*s-r*o,l*s+r*a,i*s*s+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,i,a){return this.set(1,n,i,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){let r=this.elements,i=t._x,a=t._y,o=t._z,s=t._w,c=i+i,l=a+a,u=o+o,d=i*c,f=i*l,p=i*u,m=a*l,h=a*u,g=o*u,_=s*c,v=s*l,y=s*u,b=n.x,x=n.y,S=n.z;return r[0]=(1-(m+g))*b,r[1]=(f+y)*b,r[2]=(p-v)*b,r[3]=0,r[4]=(f-y)*x,r[5]=(1-(d+g))*x,r[6]=(h+_)*x,r[7]=0,r[8]=(p+v)*S,r[9]=(h-_)*S,r[10]=(1-(d+m))*S,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){let r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];let i=this.determinantAffine();if(i===0)return n.set(1,1,1),t.identity(),this;let a=Pt.set(r[0],r[1],r[2]).length(),o=Pt.set(r[4],r[5],r[6]).length(),s=Pt.set(r[8],r[9],r[10]).length();i<0&&(a=-a),Ft.copy(this);let c=1/a,l=1/o,u=1/s;return Ft.elements[0]*=c,Ft.elements[1]*=c,Ft.elements[2]*=c,Ft.elements[4]*=l,Ft.elements[5]*=l,Ft.elements[6]*=l,Ft.elements[8]*=u,Ft.elements[9]*=u,Ft.elements[10]*=u,t.setFromRotationMatrix(Ft),n.x=a,n.y=o,n.z=s,this}makePerspective(e,t,n,r,i,a,o=Ge,s=!1){let c=this.elements,l=2*i/(t-e),u=2*i/(n-r),d=(t+e)/(t-e),f=(n+r)/(n-r),p,m;if(s)p=i/(a-i),m=a*i/(a-i);else if(o===2e3)p=-(a+i)/(a-i),m=-2*a*i/(a-i);else if(o===2001)p=-a/(a-i),m=-a*i/(a-i);else throw Error(`THREE.Matrix4.makePerspective(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,r,i,a,o=Ge,s=!1){let c=this.elements,l=2/(t-e),u=2/(n-r),d=-(t+e)/(t-e),f=-(n+r)/(n-r),p,m;if(s)p=1/(a-i),m=a/(a-i);else if(o===2e3)p=-2/(a-i),m=-(a+i)/(a-i);else if(o===2001)p=-1/(a-i),m=-i/(a-i);else throw Error(`THREE.Matrix4.makeOrthographic(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<16;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},Pt=new V,Ft=new Nt,It=new V(0,0,0),Lt=new V(1,1,1),Rt=new V,zt=new V,Bt=new V,Vt=new Nt,Ht=new dt,Ut=class e{constructor(t=0,n=0,r=0,i=e.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=n,this._z=r,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let r=e.elements,i=r[0],a=r[4],o=r[8],s=r[1],c=r[5],l=r[9],u=r[2],d=r[6],f=r[10];switch(t){case`XYZ`:this._y=Math.asin(z(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-l,f),this._z=Math.atan2(-a,i)):(this._x=Math.atan2(d,c),this._z=0);break;case`YXZ`:this._x=Math.asin(-z(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(s,c)):(this._y=Math.atan2(-u,i),this._z=0);break;case`ZXY`:this._x=Math.asin(z(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(s,i));break;case`ZYX`:this._y=Math.asin(-z(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(s,i)):(this._x=0,this._z=Math.atan2(-a,c));break;case`YZX`:this._z=Math.asin(z(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(-l,c),this._y=Math.atan2(-u,i)):(this._x=0,this._y=Math.atan2(o,f));break;case`XZY`:this._z=Math.asin(-z(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,i)):(this._x=Math.atan2(-l,f),this._y=0);break;default:L(`Euler: .setFromRotationMatrix() encountered an unknown order: `+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Vt.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Vt,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Ht.setFromEuler(this),this.setFromQuaternion(Ht,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Ut.DEFAULT_ORDER=`XYZ`;var Wt=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return!!(this.mask&(1<<e|0))}},Gt=0,Kt=new V,qt=new dt,Jt=new Nt,Yt=new V,Xt=new V,Zt=new V,Qt=new dt,$t=new V(1,0,0),en=new V(0,1,0),tn=new V(0,0,1),nn={type:`added`},rn={type:`removed`},an={type:`childadded`,child:null},on={type:`childremoved`,child:null},sn=class e extends nt{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Gt++}),this.uuid=ot(),this.name=``,this.type=`Object3D`,this.parent=null,this.children=[],this.up=e.DEFAULT_UP.clone();let t=new V,n=new Ut,r=new dt,i=new V(1,1,1);function a(){r.setFromEuler(n,!1)}function o(){n.setFromQuaternion(r,void 0,!1)}n._onChange(a),r._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Nt},normalMatrix:{value:new H}}),this.matrix=new Nt,this.matrixWorld=new Nt,this.matrixAutoUpdate=e.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Wt,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return qt.setFromAxisAngle(e,t),this.quaternion.multiply(qt),this}rotateOnWorldAxis(e,t){return qt.setFromAxisAngle(e,t),this.quaternion.premultiply(qt),this}rotateX(e){return this.rotateOnAxis($t,e)}rotateY(e){return this.rotateOnAxis(en,e)}rotateZ(e){return this.rotateOnAxis(tn,e)}translateOnAxis(e,t){return Kt.copy(e).applyQuaternion(this.quaternion),this.position.add(Kt.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis($t,e)}translateY(e){return this.translateOnAxis(en,e)}translateZ(e){return this.translateOnAxis(tn,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Jt.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Yt.copy(e):Yt.set(e,t,n);let r=this.parent;this.updateWorldMatrix(!0,!1),Xt.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Jt.lookAt(Xt,Yt,this.up):Jt.lookAt(Yt,Xt,this.up),this.quaternion.setFromRotationMatrix(Jt),r&&(Jt.extractRotation(r.matrixWorld),qt.setFromRotationMatrix(Jt),this.quaternion.premultiply(qt.invert()))}add(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return e===this?(R(`Object3D.add: object can't be added as a child of itself.`,e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(nn),an.child=e,this.dispatchEvent(an),an.child=null):R(`Object3D.add: object not an instance of THREE.Object3D.`,e),this)}remove(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.remove(arguments[e]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(rn),on.child=e,this.dispatchEvent(on),on.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Jt.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Jt.multiply(e.parent.matrixWorld)),e.applyMatrix4(Jt),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(nn),an.child=e,this.dispatchEvent(an),an.child=null,this}getObjectById(e){return this.getObjectByProperty(`id`,e)}getObjectByName(e){return this.getObjectByProperty(`name`,e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){let r=this.children[n].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let r=this.children;for(let i=0,a=r.length;i<a;i++)r[i].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Xt,e,Zt),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Xt,Qt,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,r=e.z,i=this.matrix.elements;i[12]+=t-i[0]*t-i[4]*n-i[8]*r,i[13]+=n-i[1]*t-i[5]*n-i[9]*r,i[14]+=r-i[2]*t-i[6]*n-i[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let e=this.children;for(let t=0,r=e.length;t<r;t++)e[t].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e==`string`,n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:`Object`,generator:`Object3D.toJSON`});let r={};r.uuid=this.uuid,r.type=this.type,this.name!==``&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),this.static!==!1&&(r.static=this.static),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type=`InstancedMesh`,r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type=`BatchedMesh`,r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(e=>({...e,boundingBox:e.boundingBox?e.boundingBox.toJSON():void 0,boundingSphere:e.boundingSphere?e.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(e=>({...e})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function i(t,n){return t[n.uuid]===void 0&&(t[n.uuid]=n.toJSON(e)),n.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=i(e.geometries,this.geometry);let t=this.geometry.parameters;if(t!==void 0&&t.shapes!==void 0){let n=t.shapes;if(Array.isArray(n))for(let t=0,r=n.length;t<r;t++){let r=n[t];i(e.shapes,r)}else i(e.shapes,n)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(i(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0){if(Array.isArray(this.material)){let t=[];for(let n=0,r=this.material.length;n<r;n++)t.push(i(e.materials,this.material[n]));r.material=t}else r.material=i(e.materials,this.material)}if(this.children.length>0){r.children=[];for(let t=0;t<this.children.length;t++)r.children.push(this.children[t].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let t=0;t<this.animations.length;t++){let n=this.animations[t];r.animations.push(i(e.animations,n))}}if(t){let t=a(e.geometries),r=a(e.materials),i=a(e.textures),o=a(e.images),s=a(e.shapes),c=a(e.skeletons),l=a(e.animations),u=a(e.nodes);t.length>0&&(n.geometries=t),r.length>0&&(n.materials=r),i.length>0&&(n.textures=i),o.length>0&&(n.images=o),s.length>0&&(n.shapes=s),c.length>0&&(n.skeletons=c),l.length>0&&(n.animations=l),u.length>0&&(n.nodes=u)}return n.object=r,n;function a(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot===null?null:e.pivot.clone(),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let t=0;t<e.children.length;t++){let n=e.children[t];this.add(n.clone())}return this}};sn.DEFAULT_UP=new V(0,1,0),sn.DEFAULT_MATRIX_AUTO_UPDATE=!0,sn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var cn=class extends sn{constructor(){super(),this.isGroup=!0,this.type=`Group`}},ln={type:`move`},un=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new cn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new cn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new V,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new V),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new cn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new V,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new V,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:`connected`,data:e}),this}disconnect(e){return this.dispatchEvent({type:`disconnected`,data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,i=null,a=null,o=this._targetRay,s=this._grip,c=this._hand;if(e&&t.session.visibilityState!==`visible-blurred`){if(c&&e.hand){a=!0;for(let r of e.hand.values()){let e=t.getJointPose(r,n),i=this._getHandJoint(c,r);e!==null&&(i.matrix.fromArray(e.transform.matrix),i.matrix.decompose(i.position,i.rotation,i.scale),i.matrixWorldNeedsUpdate=!0,i.jointRadius=e.radius),i.visible=e!==null}let r=c.joints[`index-finger-tip`],i=c.joints[`thumb-tip`],o=r.position.distanceTo(i.position);c.inputState.pinching&&o>.025?(c.inputState.pinching=!1,this.dispatchEvent({type:`pinchend`,handedness:e.handedness,target:this})):!c.inputState.pinching&&o<=.015&&(c.inputState.pinching=!0,this.dispatchEvent({type:`pinchstart`,handedness:e.handedness,target:this}))}else s!==null&&e.gripSpace&&(i=t.getPose(e.gripSpace,n),i!==null&&(s.matrix.fromArray(i.transform.matrix),s.matrix.decompose(s.position,s.rotation,s.scale),s.matrixWorldNeedsUpdate=!0,i.linearVelocity?(s.hasLinearVelocity=!0,s.linearVelocity.copy(i.linearVelocity)):s.hasLinearVelocity=!1,i.angularVelocity?(s.hasAngularVelocity=!0,s.angularVelocity.copy(i.angularVelocity)):s.hasAngularVelocity=!1,s.eventsEnabled&&s.dispatchEvent({type:`gripUpdated`,data:e,target:this})));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&i!==null&&(r=i),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(ln)))}return o!==null&&(o.visible=r!==null),s!==null&&(s.visible=i!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new cn;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},dn={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},fn={h:0,s:0,l:0},pn={h:0,s:0,l:0};function mn(e,t,n){return n<0&&(n+=1),n>1&&--n,n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*6*(2/3-n):e}var W=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let t=e;t&&t.isColor?this.copy(t):typeof t==`number`?this.setHex(t):typeof t==`string`&&this.setStyle(t)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Be){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,U.colorSpaceToWorking(this,t),this}setRGB(e,t,n,r=U.workingColorSpace){return this.r=e,this.g=t,this.b=n,U.colorSpaceToWorking(this,r),this}setHSL(e,t,n,r=U.workingColorSpace){if(e=st(e,1),t=z(t,0,1),n=z(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,i=2*n-r;this.r=mn(i,r,e+1/3),this.g=mn(i,r,e),this.b=mn(i,r,e-1/3)}return U.colorSpaceToWorking(this,r),this}setStyle(e,t=Be){function n(t){t!==void 0&&parseFloat(t)<1&&L(`Color: Alpha component of `+e+` will be ignored.`)}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let i,a=r[1],o=r[2];switch(a){case`rgb`:case`rgba`:if(i=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(255,parseInt(i[1],10))/255,Math.min(255,parseInt(i[2],10))/255,Math.min(255,parseInt(i[3],10))/255,t);if(i=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(100,parseInt(i[1],10))/100,Math.min(100,parseInt(i[2],10))/100,Math.min(100,parseInt(i[3],10))/100,t);break;case`hsl`:case`hsla`:if(i=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setHSL(parseFloat(i[1])/360,parseFloat(i[2])/100,parseFloat(i[3])/100,t);break;default:L(`Color: Unknown color model `+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let n=r[1],i=n.length;if(i===3)return this.setRGB(parseInt(n.charAt(0),16)/15,parseInt(n.charAt(1),16)/15,parseInt(n.charAt(2),16)/15,t);if(i===6)return this.setHex(parseInt(n,16),t);L(`Color: Invalid hex color `+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Be){let n=dn[e.toLowerCase()];return n===void 0?L(`Color: Unknown color `+e):this.setHex(n,t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=vt(e.r),this.g=vt(e.g),this.b=vt(e.b),this}copyLinearToSRGB(e){return this.r=yt(e.r),this.g=yt(e.g),this.b=yt(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Be){return U.workingToColorSpace(hn.copy(this),e),Math.round(z(hn.r*255,0,255))*65536+Math.round(z(hn.g*255,0,255))*256+Math.round(z(hn.b*255,0,255))}getHexString(e=Be){return(`000000`+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=U.workingColorSpace){U.workingToColorSpace(hn.copy(this),t);let n=hn.r,r=hn.g,i=hn.b,a=Math.max(n,r,i),o=Math.min(n,r,i),s,c,l=(o+a)/2;if(o===a)s=0,c=0;else{let e=a-o;switch(c=l<=.5?e/(a+o):e/(2-a-o),a){case n:s=(r-i)/e+(r<i?6:0);break;case r:s=(i-n)/e+2;break;case i:s=(n-r)/e+4}s/=6}return e.h=s,e.s=c,e.l=l,e}getRGB(e,t=U.workingColorSpace){return U.workingToColorSpace(hn.copy(this),t),e.r=hn.r,e.g=hn.g,e.b=hn.b,e}getStyle(e=Be){U.workingToColorSpace(hn.copy(this),e);let t=hn.r,n=hn.g,r=hn.b;return e===`srgb`?`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`:`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`}offsetHSL(e,t,n){return this.getHSL(fn),this.setHSL(fn.h+e,fn.s+t,fn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(fn),e.getHSL(pn);let n=ct(fn.h,pn.h,t),r=ct(fn.s,pn.s,t),i=ct(fn.l,pn.l,t);return this.setHSL(n,r,i),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,r=this.b,i=e.elements;return this.r=i[0]*t+i[3]*n+i[6]*r,this.g=i[1]*t+i[4]*n+i[7]*r,this.b=i[2]*t+i[5]*n+i[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},hn=new W;W.NAMES=dn;var gn=class e{constructor(e,t=1,n=1e3){this.isFog=!0,this.name=``,this.color=new W(e),this.near=t,this.far=n}clone(){return new e(this.color,this.near,this.far)}toJSON(){return{type:`Fog`,name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},_n=class extends sn{constructor(){super(),this.isScene=!0,this.type=`Scene`,this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Ut,this.environmentIntensity=1,this.environmentRotation=new Ut,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}},vn=new V,yn=new V,bn=new V,xn=new V,Sn=new V,Cn=new V,wn=new V,Tn=new V,En=new V,Dn=new V,On=new Ot,kn=new Ot,An=new Ot,jn=class e{constructor(e=new V,t=new V,n=new V){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),vn.subVectors(e,t),r.cross(vn);let i=r.lengthSq();return i>0?r.multiplyScalar(1/Math.sqrt(i)):r.set(0,0,0)}static getBarycoord(e,t,n,r,i){vn.subVectors(r,t),yn.subVectors(n,t),bn.subVectors(e,t);let a=vn.dot(vn),o=vn.dot(yn),s=vn.dot(bn),c=yn.dot(yn),l=yn.dot(bn),u=a*c-o*o;if(u===0)return i.set(0,0,0),null;let d=1/u,f=(c*s-o*l)*d,p=(a*l-o*s)*d;return i.set(1-f-p,p,f)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,xn)!==null&&xn.x>=0&&xn.y>=0&&xn.x+xn.y<=1}static getInterpolation(e,t,n,r,i,a,o,s){return this.getBarycoord(e,t,n,r,xn)===null?(s.x=0,s.y=0,`z`in s&&(s.z=0),`w`in s&&(s.w=0),null):(s.setScalar(0),s.addScaledVector(i,xn.x),s.addScaledVector(a,xn.y),s.addScaledVector(o,xn.z),s)}static getInterpolatedAttribute(e,t,n,r,i,a){return On.setScalar(0),kn.setScalar(0),An.setScalar(0),On.fromBufferAttribute(e,t),kn.fromBufferAttribute(e,n),An.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(On,i.x),a.addScaledVector(kn,i.y),a.addScaledVector(An,i.z),a}static isFrontFacing(e,t,n,r){return vn.subVectors(n,t),yn.subVectors(e,t),vn.cross(yn).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return vn.subVectors(this.c,this.b),yn.subVectors(this.a,this.b),vn.cross(yn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return e.getNormal(this.a,this.b,this.c,t)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,n){return e.getBarycoord(t,this.a,this.b,this.c,n)}getInterpolation(t,n,r,i,a){return e.getInterpolation(t,this.a,this.b,this.c,n,r,i,a)}containsPoint(t){return e.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return e.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,r=this.b,i=this.c,a,o;Sn.subVectors(r,n),Cn.subVectors(i,n),Tn.subVectors(e,n);let s=Sn.dot(Tn),c=Cn.dot(Tn);if(s<=0&&c<=0)return t.copy(n);En.subVectors(e,r);let l=Sn.dot(En),u=Cn.dot(En);if(l>=0&&u<=l)return t.copy(r);let d=s*u-l*c;if(d<=0&&s>=0&&l<=0)return a=s/(s-l),t.copy(n).addScaledVector(Sn,a);Dn.subVectors(e,i);let f=Sn.dot(Dn),p=Cn.dot(Dn);if(p>=0&&f<=p)return t.copy(i);let m=f*c-s*p;if(m<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(n).addScaledVector(Cn,o);let h=l*p-f*u;if(h<=0&&u-l>=0&&f-p>=0)return wn.subVectors(i,r),o=(u-l)/(u-l+(f-p)),t.copy(r).addScaledVector(wn,o);let g=1/(h+m+d);return a=m*g,o=d*g,t.copy(n).addScaledVector(Sn,a).addScaledVector(Cn,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Mn=class{constructor(e=new V(1/0,1/0,1/0),t=new V(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Pn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Pn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=Pn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute(`position`);if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let t=0,n=r.count;t<n;t++)e.isMesh===!0?e.getVertexPosition(t,Pn):Pn.fromBufferAttribute(r,t),Pn.applyMatrix4(e.matrixWorld),this.expandByPoint(Pn);else e.boundingBox===void 0?(n.boundingBox===null&&n.computeBoundingBox(),Fn.copy(n.boundingBox)):(e.boundingBox===null&&e.computeBoundingBox(),Fn.copy(e.boundingBox)),Fn.applyMatrix4(e.matrixWorld),this.union(Fn)}let r=e.children;for(let e=0,n=r.length;e<n;e++)this.expandByObject(r[e],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Pn),Pn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Hn),Un.subVectors(this.max,Hn),In.subVectors(e.a,Hn),Ln.subVectors(e.b,Hn),Rn.subVectors(e.c,Hn),zn.subVectors(Ln,In),Bn.subVectors(Rn,Ln),Vn.subVectors(In,Rn);let t=[0,-zn.z,zn.y,0,-Bn.z,Bn.y,0,-Vn.z,Vn.y,zn.z,0,-zn.x,Bn.z,0,-Bn.x,Vn.z,0,-Vn.x,-zn.y,zn.x,0,-Bn.y,Bn.x,0,-Vn.y,Vn.x,0];return!Kn(t,In,Ln,Rn,Un)||(t=[1,0,0,0,1,0,0,0,1],!Kn(t,In,Ln,Rn,Un))?!1:(Wn.crossVectors(zn,Bn),t=[Wn.x,Wn.y,Wn.z],Kn(t,In,Ln,Rn,Un))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Pn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Pn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Nn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Nn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Nn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Nn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Nn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Nn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Nn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Nn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Nn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Nn=[new V,new V,new V,new V,new V,new V,new V,new V],Pn=new V,Fn=new Mn,In=new V,Ln=new V,Rn=new V,zn=new V,Bn=new V,Vn=new V,Hn=new V,Un=new V,Wn=new V,Gn=new V;function Kn(e,t,n,r,i){for(let a=0,o=e.length-3;a<=o;a+=3){Gn.fromArray(e,a);let o=i.x*Math.abs(Gn.x)+i.y*Math.abs(Gn.y)+i.z*Math.abs(Gn.z),s=t.dot(Gn),c=n.dot(Gn),l=r.dot(Gn);if(Math.max(-Math.max(s,c,l),Math.min(s,c,l))>o)return!1}return!0}var qn=new V,Jn=new B,Yn=0,Xn=class extends nt{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw TypeError(`THREE.BufferAttribute: array should be a Typed Array.`);this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Yn++}),this.name=``,this.array=e,this.itemSize=t,this.count=e===void 0?0:e.length/t,this.normalized=n,this.usage=We,this.updateRanges=[],this.gpuType=h,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,i=this.itemSize;r<i;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Jn.fromBufferAttribute(this,t),Jn.applyMatrix3(e),this.setXY(t,Jn.x,Jn.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)qn.fromBufferAttribute(this,t),qn.applyMatrix3(e),this.setXYZ(t,qn.x,qn.y,qn.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)qn.fromBufferAttribute(this,t),qn.applyMatrix4(e),this.setXYZ(t,qn.x,qn.y,qn.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)qn.fromBufferAttribute(this,t),qn.applyNormalMatrix(e),this.setXYZ(t,qn.x,qn.y,qn.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)qn.fromBufferAttribute(this,t),qn.transformDirection(e),this.setXYZ(t,qn.x,qn.y,qn.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=lt(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=ut(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=lt(t,this.array)),t}setX(e,t){return this.normalized&&(t=ut(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=lt(t,this.array)),t}setY(e,t){return this.normalized&&(t=ut(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=lt(t,this.array)),t}setZ(e,t){return this.normalized&&(t=ut(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=lt(t,this.array)),t}setW(e,t){return this.normalized&&(t=ut(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=ut(t,this.array),n=ut(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=ut(t,this.array),n=ut(n,this.array),r=ut(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e*=this.itemSize,this.normalized&&(t=ut(t,this.array),n=ut(n,this.array),r=ut(r,this.array),i=ut(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=i,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==``&&(e.name=this.name),this.usage!==35044&&(e.usage=this.usage),e}dispose(){this.dispatchEvent({type:`dispose`})}},Zn=class extends Xn{constructor(e,t,n){super(new Uint16Array(e),t,n)}},Qn=class extends Xn{constructor(e,t,n){super(new Uint32Array(e),t,n)}},$n=class extends Xn{constructor(e,t,n){super(new Float32Array(e),t,n)}},er=new Mn,tr=new V,nr=new V,rr=class{constructor(e=new V,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t===void 0?er.setFromPoints(e).getCenter(n):n.copy(t);let r=0;for(let t=0,i=e.length;t<i;t++)r=Math.max(r,n.distanceToSquared(e[t]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius*=e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;tr.subVectors(e,this.center);let t=tr.lengthSq();if(t>this.radius*this.radius){let e=Math.sqrt(t),n=(e-this.radius)*.5;this.center.addScaledVector(tr,n/e),this.radius+=n}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(nr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(tr.copy(e.center).add(nr)),this.expandByPoint(tr.copy(e.center).sub(nr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},ir=0,ar=new Nt,or=new sn,sr=new V,cr=new Mn,lr=new Mn,ur=new V,dr=class e extends nt{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:ir++}),this.uuid=ot(),this.name=``,this.type=`BufferGeometry`,this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return this.index=Array.isArray(e)?new(Ke(e)?Qn:Zn)(e,1):e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let t=new H().getNormalMatrix(e);n.applyNormalMatrix(t),n.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return ar.makeRotationFromQuaternion(e),this.applyMatrix4(ar),this}rotateX(e){return ar.makeRotationX(e),this.applyMatrix4(ar),this}rotateY(e){return ar.makeRotationY(e),this.applyMatrix4(ar),this}rotateZ(e){return ar.makeRotationZ(e),this.applyMatrix4(ar),this}translate(e,t,n){return ar.makeTranslation(e,t,n),this.applyMatrix4(ar),this}scale(e,t,n){return ar.makeScale(e,t,n),this.applyMatrix4(ar),this}lookAt(e){return or.lookAt(e),or.updateMatrix(),this.applyMatrix4(or.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(sr).negate(),this.translate(sr.x,sr.y,sr.z),this}setFromPoints(e){let t=this.getAttribute(`position`);if(t===void 0){let t=[];for(let n=0,r=e.length;n<r;n++){let r=e[n];t.push(r.x,r.y,r.z||0)}this.setAttribute(`position`,new $n(t,3))}else{let n=Math.min(e.length,t.count);for(let r=0;r<n;r++){let n=e[r];t.setXYZ(r,n.x,n.y,n.z||0)}e.length>t.count&&L(`BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry.`),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Mn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){R(`BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.`,this),this.boundingBox.set(new V(-1/0,-1/0,-1/0),new V(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];cr.setFromBufferAttribute(n),this.morphTargetsRelative?(ur.addVectors(this.boundingBox.min,cr.min),this.boundingBox.expandByPoint(ur),ur.addVectors(this.boundingBox.max,cr.max),this.boundingBox.expandByPoint(ur)):(this.boundingBox.expandByPoint(cr.min),this.boundingBox.expandByPoint(cr.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&R(`BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.`,this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new rr);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){R(`BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.`,this),this.boundingSphere.set(new V,1/0);return}if(e){let n=this.boundingSphere.center;if(cr.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];lr.setFromBufferAttribute(n),this.morphTargetsRelative?(ur.addVectors(cr.min,lr.min),cr.expandByPoint(ur),ur.addVectors(cr.max,lr.max),cr.expandByPoint(ur)):(cr.expandByPoint(lr.min),cr.expandByPoint(lr.max))}cr.getCenter(n);let r=0;for(let t=0,i=e.count;t<i;t++)ur.fromBufferAttribute(e,t),r=Math.max(r,n.distanceToSquared(ur));if(t)for(let i=0,a=t.length;i<a;i++){let a=t[i],o=this.morphTargetsRelative;for(let t=0,i=a.count;t<i;t++)ur.fromBufferAttribute(a,t),o&&(sr.fromBufferAttribute(e,t),ur.add(sr)),r=Math.max(r,n.distanceToSquared(ur))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&R(`BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.`,this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){R(`BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)`);return}let n=t.position,r=t.normal,i=t.uv,a=this.getAttribute(`tangent`);(a===void 0||a.count!==n.count)&&(a=new Xn(new Float32Array(4*n.count),4),this.setAttribute(`tangent`,a));let o=[],s=[];for(let e=0;e<n.count;e++)o[e]=new V,s[e]=new V;let c=new V,l=new V,u=new V,d=new B,f=new B,p=new B,m=new V,h=new V;function g(e,t,r){c.fromBufferAttribute(n,e),l.fromBufferAttribute(n,t),u.fromBufferAttribute(n,r),d.fromBufferAttribute(i,e),f.fromBufferAttribute(i,t),p.fromBufferAttribute(i,r),l.sub(c),u.sub(c),f.sub(d),p.sub(d);let a=1/(f.x*p.y-p.x*f.y);isFinite(a)&&(m.copy(l).multiplyScalar(p.y).addScaledVector(u,-f.y).multiplyScalar(a),h.copy(u).multiplyScalar(f.x).addScaledVector(l,-p.x).multiplyScalar(a),o[e].add(m),o[t].add(m),o[r].add(m),s[e].add(h),s[t].add(h),s[r].add(h))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)g(e.getX(t+0),e.getX(t+1),e.getX(t+2))}let v=new V,y=new V,b=new V,x=new V;function S(e){b.fromBufferAttribute(r,e),x.copy(b);let t=o[e];v.copy(t),v.sub(b.multiplyScalar(b.dot(t))).normalize(),y.crossVectors(x,t);let n=y.dot(s[e])<0?-1:1;a.setXYZW(e,v.x,v.y,v.z,n)}for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)S(e.getX(t+0)),S(e.getX(t+1)),S(e.getX(t+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute(`position`);if(t!==void 0){let n=this.getAttribute(`normal`);if(n===void 0||n.count!==t.count)n=new Xn(new Float32Array(t.count*3),3),this.setAttribute(`normal`,n);else for(let e=0,t=n.count;e<t;e++)n.setXYZ(e,0,0,0);let r=new V,i=new V,a=new V,o=new V,s=new V,c=new V,l=new V,u=new V;if(e)for(let d=0,f=e.count;d<f;d+=3){let f=e.getX(d+0),p=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,f),i.fromBufferAttribute(t,p),a.fromBufferAttribute(t,m),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),o.fromBufferAttribute(n,f),s.fromBufferAttribute(n,p),c.fromBufferAttribute(n,m),o.add(l),s.add(l),c.add(l),n.setXYZ(f,o.x,o.y,o.z),n.setXYZ(p,s.x,s.y,s.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let e=0,o=t.count;e<o;e+=3)r.fromBufferAttribute(t,e+0),i.fromBufferAttribute(t,e+1),a.fromBufferAttribute(t,e+2),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),n.setXYZ(e+0,l.x,l.y,l.z),n.setXYZ(e+1,l.x,l.y,l.z),n.setXYZ(e+2,l.x,l.y,l.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)ur.fromBufferAttribute(e,t),ur.normalize(),e.setXYZ(t,ur.x,ur.y,ur.z)}toNonIndexed(){function t(e,t){let n=e.array,r=e.itemSize,i=e.normalized,a=new n.constructor(t.length*r),o=0,s=0;for(let i=0,c=t.length;i<c;i++){o=e.isInterleavedBufferAttribute?t[i]*e.data.stride+e.offset:t[i]*r;for(let e=0;e<r;e++)a[s++]=n[o++]}return new Xn(a,r,i)}if(this.index===null)return L(`BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.`),this;let n=new e,r=this.index.array,i=this.attributes;for(let e in i){let a=i[e],o=t(a,r);n.setAttribute(e,o)}let a=this.morphAttributes;for(let e in a){let i=[],o=a[e];for(let e=0,n=o.length;e<n;e++){let n=o[e],a=t(n,r);i.push(a)}n.morphAttributes[e]=i}n.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let e=0,t=o.length;e<t;e++){let t=o[e];n.addGroup(t.start,t.count,t.materialIndex)}return n}toJSON(){let e={metadata:{version:4.7,type:`BufferGeometry`,generator:`BufferGeometry.toJSON`}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?`BufferGeometry`:this.type,this.name!==``&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let t=this.parameters;for(let n in t)t[n]!==void 0&&(e[n]=t[n]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let t in n){let r=n[t];e.data.attributes[t]=r.toJSON(e.data)}let r={},i=!1;for(let t in this.morphAttributes){let n=this.morphAttributes[t],a=[];for(let t=0,r=n.length;t<r;t++){let r=n[t];a.push(r.toJSON(e.data))}a.length>0&&(r[t]=a,i=!0)}i&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let r=e.attributes;for(let e in r){let n=r[e];this.setAttribute(e,n.clone(t))}let i=e.morphAttributes;for(let e in i){let n=[],r=i[e];for(let e=0,i=r.length;e<i;e++)n.push(r[e].clone(t));this.morphAttributes[e]=n}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let e=0,t=a.length;e<t;e++){let t=a[e];this.addGroup(t.start,t.count,t.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let s=e.boundingSphere;return s!==null&&(this.boundingSphere=s.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:`dispose`})}},fr=0,pr=class extends nt{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:fr++}),this.uuid=ot(),this.name=``,this.type=`Material`,this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new W(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ue,this.stencilZFail=Ue,this.stencilZPass=Ue,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){L(`Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];if(r===void 0){L(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector2&&n&&n.isVector2||r&&r.isEuler&&n&&n.isEuler||r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:`Material`,generator:`Material.toJSON`}};n.uuid=this.uuid,n.type=this.type,this.name!==``&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==1&&(n.blending=this.blending),this.side!==0&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==204&&(n.blendSrc=this.blendSrc),this.blendDst!==205&&(n.blendDst=this.blendDst),this.blendEquation!==100&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==3&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==519&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==7680&&(n.stencilFail=this.stencilFail),this.stencilZFail!==7680&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==7680&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.allowOverride===!1&&(n.allowOverride=!1),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==`round`&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==`round`&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}if(t){let t=r(e.textures),i=r(e.images);t.length>0&&(n.textures=t),i.length>0&&(n.images=i)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new W().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(this.vertexColors=typeof e.vertexColors==`number`?e.vertexColors>0:e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let t=e.normalScale;Array.isArray(t)===!1&&(t=[t,t]),this.normalScale=new B().fromArray(t)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new B().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let e=t.length;n=Array(e);for(let r=0;r!==e;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:`dispose`})}set needsUpdate(e){e===!0&&this.version++}},mr=new V,hr=new V,gr=new V,_r=new V,vr=new V,yr=new V,br=new V,xr=class{constructor(e=new V,t=new V(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,mr)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=mr.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(mr.copy(this.origin).addScaledVector(this.direction,t),mr.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){hr.copy(e).add(t).multiplyScalar(.5),gr.copy(t).sub(e).normalize(),_r.copy(this.origin).sub(hr);let i=e.distanceTo(t)*.5,a=-this.direction.dot(gr),o=_r.dot(this.direction),s=-_r.dot(gr),c=_r.lengthSq(),l=Math.abs(1-a*a),u,d,f,p;if(l>0){if(u=a*s-o,d=a*o-s,p=i*l,u>=0){if(d>=-p){if(d<=p){let e=1/l;u*=e,d*=e,f=u*(u+a*d+2*o)+d*(a*u+d+2*s)+c}else d=i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d=-i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d<=-p?(u=Math.max(0,-(-a*i+o)),d=u>0?-i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c):d<=p?(u=0,d=Math.min(Math.max(-i,-s),i),f=d*(d+2*s)+c):(u=Math.max(0,-(a*i+o)),d=u>0?i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c)}else d=a>0?-i:i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(hr).addScaledVector(gr,d),f}intersectSphere(e,t){mr.subVectors(e.center,this.origin);let n=mr.dot(this.direction),r=mr.dot(mr)-n*n,i=e.radius*e.radius;if(r>i)return null;let a=Math.sqrt(i-r),o=n-a,s=n+a;return s<0?null:o<0?this.at(s,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,i,a,o,s,c=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),l>=0?(i=(e.min.y-d.y)*l,a=(e.max.y-d.y)*l):(i=(e.max.y-d.y)*l,a=(e.min.y-d.y)*l),n>a||i>r||((i>n||isNaN(n))&&(n=i),(a<r||isNaN(r))&&(r=a),u>=0?(o=(e.min.z-d.z)*u,s=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,s=(e.min.z-d.z)*u),n>s||o>r)||((o>n||n!==n)&&(n=o),(s<r||r!==r)&&(r=s),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,mr)!==null}intersectTriangle(e,t,n,r,i){vr.subVectors(t,e),yr.subVectors(n,e),br.crossVectors(vr,yr);let a=this.direction.dot(br),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;_r.subVectors(this.origin,e);let s=o*this.direction.dot(yr.crossVectors(_r,yr));if(s<0)return null;let c=o*this.direction.dot(vr.cross(_r));if(c<0||s+c>a)return null;let l=-o*_r.dot(br);return l<0?null:this.at(l/a,i)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Sr=class extends pr{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type=`MeshBasicMaterial`,this.color=new W(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ut,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},Cr=new Nt,wr=new xr,Tr=new rr,Er=new V,Dr=new V,Or=new V,kr=new V,Ar=new V,jr=new V,Mr=new V,Nr=new V,G=class extends sn{constructor(e=new dr,t=new Sr){super(),this.isMesh=!0,this.type=`Mesh`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}getVertexPosition(e,t){let n=this.geometry,r=n.attributes.position,i=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);let o=this.morphTargetInfluences;if(i&&o){jr.set(0,0,0);for(let n=0,r=i.length;n<r;n++){let r=o[n],s=i[n];r!==0&&(Ar.fromBufferAttribute(s,e),a?jr.addScaledVector(Ar,r):jr.addScaledVector(Ar.sub(t),r))}t.add(jr)}return t}raycast(e,t){let n=this.geometry,r=this.material,i=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Tr.copy(n.boundingSphere),Tr.applyMatrix4(i),wr.copy(e.ray).recast(e.near),!(Tr.containsPoint(wr.origin)===!1&&(wr.intersectSphere(Tr,Er)===null||wr.origin.distanceToSquared(Er)>(e.far-e.near)**2))&&(Cr.copy(i).invert(),wr.copy(e.ray).applyMatrix4(Cr),(n.boundingBox===null||wr.intersectsBox(n.boundingBox)!==!1)&&this._computeIntersections(e,t,wr)))}_computeIntersections(e,t,n){let r,i=this.geometry,a=this.material,o=i.index,s=i.attributes.position,c=i.attributes.uv,l=i.attributes.uv1,u=i.attributes.normal,d=i.groups,f=i.drawRange;if(o!==null){if(Array.isArray(a))for(let i=0,s=d.length;i<s;i++){let s=d[i],p=a[s.materialIndex],m=Math.max(s.start,f.start),h=Math.min(o.count,Math.min(s.start+s.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=o.getX(i),d=o.getX(i+1),f=o.getX(i+2);r=Fr(this,p,e,n,c,l,u,a,d,f),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=s.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),s=Math.min(o.count,f.start+f.count);for(let d=i,f=s;d<f;d+=3){let i=o.getX(d),s=o.getX(d+1),f=o.getX(d+2);r=Fr(this,a,e,n,c,l,u,i,s,f),r&&(r.faceIndex=Math.floor(d/3),t.push(r))}}}else if(s!==void 0){if(Array.isArray(a))for(let i=0,o=d.length;i<o;i++){let o=d[i],p=a[o.materialIndex],m=Math.max(o.start,f.start),h=Math.min(s.count,Math.min(o.start+o.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=i,s=i+1,d=i+2;r=Fr(this,p,e,n,c,l,u,a,s,d),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=o.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),o=Math.min(s.count,f.start+f.count);for(let s=i,d=o;s<d;s+=3){let i=s,o=s+1,d=s+2;r=Fr(this,a,e,n,c,l,u,i,o,d),r&&(r.faceIndex=Math.floor(s/3),t.push(r))}}}}};function Pr(e,t,n,r,i,a,o,s){let c;if(c=t.side===1?r.intersectTriangle(o,a,i,!0,s):r.intersectTriangle(i,a,o,t.side===0,s),c===null)return null;Nr.copy(s),Nr.applyMatrix4(e.matrixWorld);let l=n.ray.origin.distanceTo(Nr);return l<n.near||l>n.far?null:{distance:l,point:Nr.clone(),object:e}}function Fr(e,t,n,r,i,a,o,s,c,l){e.getVertexPosition(s,Dr),e.getVertexPosition(c,Or),e.getVertexPosition(l,kr);let u=Pr(e,t,n,r,Dr,Or,kr,Mr);if(u){let e=new V;jn.getBarycoord(Mr,Dr,Or,kr,e),i&&(u.uv=jn.getInterpolatedAttribute(i,s,c,l,e,new B)),a&&(u.uv1=jn.getInterpolatedAttribute(a,s,c,l,e,new B)),o&&(u.normal=jn.getInterpolatedAttribute(o,s,c,l,e,new V),u.normal.dot(r.direction)>0&&u.normal.multiplyScalar(-1));let t={a:s,b:c,c:l,normal:new V,materialIndex:0};jn.getNormal(Dr,Or,kr,t.normal),u.face=t,u.barycoord=e}return u}var Ir=class extends Dt{constructor(e=null,t=1,n=1,i,a,o,s,c,l=r,u=r,d,f){super(null,o,s,c,l,u,i,a,d,f),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Lr=new V,Rr=new V,zr=new H,Br=class{constructor(e=new V(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let r=Lr.subVectors(n,t).cross(Rr.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let r=e.delta(Lr),i=this.normal.dot(r);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/i;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(r,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||zr.getNormalMatrix(e),r=this.coplanarPoint(Lr).applyMatrix4(e),i=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(i),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},Vr=new rr,Hr=new B(.5,.5),Ur=new V,Wr=class{constructor(e=new Br,t=new Br,n=new Br,r=new Br,i=new Br,a=new Br){this.planes=[e,t,n,r,i,a]}set(e,t,n,r,i,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(i),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Ge,n=!1){let r=this.planes,i=e.elements,a=i[0],o=i[1],s=i[2],c=i[3],l=i[4],u=i[5],d=i[6],f=i[7],p=i[8],m=i[9],h=i[10],g=i[11],_=i[12],v=i[13],y=i[14],b=i[15];if(r[0].setComponents(c-a,f-l,g-p,b-_).normalize(),r[1].setComponents(c+a,f+l,g+p,b+_).normalize(),r[2].setComponents(c+o,f+u,g+m,b+v).normalize(),r[3].setComponents(c-o,f-u,g-m,b-v).normalize(),n)r[4].setComponents(s,d,h,y).normalize(),r[5].setComponents(c-s,f-d,g-h,b-y).normalize();else if(r[4].setComponents(c-s,f-d,g-h,b-y).normalize(),t===2e3)r[5].setComponents(c+s,f+d,g+h,b+y).normalize();else if(t===2001)r[5].setComponents(s,d,h,y).normalize();else throw Error(`THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: `+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Vr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Vr.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Vr)}intersectsSprite(e){return Vr.center.set(0,0,0),Vr.radius=.7071067811865476+Hr.distanceTo(e.center),Vr.applyMatrix4(e.matrixWorld),this.intersectsSphere(Vr)}intersectsSphere(e){let t=this.planes,n=e.center,r=-e.radius;for(let e=0;e<6;e++)if(t[e].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let r=t[n];if(Ur.x=r.normal.x>0?e.max.x:e.min.x,Ur.y=r.normal.y>0?e.max.y:e.min.y,Ur.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Ur)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},Gr=class extends pr{constructor(e){super(),this.isPointsMaterial=!0,this.type=`PointsMaterial`,this.color=new W(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Kr=new Nt,qr=new xr,Jr=new rr,Yr=new V,Xr=class extends sn{constructor(e=new dr,t=new Gr){super(),this.isPoints=!0,this.type=`Points`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){let n=this.geometry,r=this.matrixWorld,i=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Jr.copy(n.boundingSphere),Jr.applyMatrix4(r),Jr.radius+=i,e.ray.intersectsSphere(Jr)===!1)return;Kr.copy(r).invert(),qr.copy(e.ray).applyMatrix4(Kr);let o=i/((this.scale.x+this.scale.y+this.scale.z)/3),s=o*o,c=n.index,l=n.attributes.position;if(c!==null){let n=Math.max(0,a.start),i=Math.min(c.count,a.start+a.count);for(let a=n,o=i;a<o;a++){let n=c.getX(a);Yr.fromBufferAttribute(l,n),Zr(Yr,n,s,r,e,t,this)}}else{let n=Math.max(0,a.start),i=Math.min(l.count,a.start+a.count);for(let a=n,o=i;a<o;a++)Yr.fromBufferAttribute(l,a),Zr(Yr,a,s,r,e,t,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}};function Zr(e,t,n,r,i,a,o){let s=qr.distanceSqToPoint(e);if(s<n){let n=new V;qr.closestPointToPoint(e,n),n.applyMatrix4(r);let c=i.ray.origin.distanceTo(n);if(c<i.near||c>i.far)return;a.push({distance:c,distanceToRay:Math.sqrt(s),point:n,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}var Qr=class extends Dt{constructor(e=[],t=301,n,r,i,a,o,s,c,l){super(e,t,n,r,i,a,o,s,c,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},$r=class extends Dt{constructor(e,t,n,r,i,a,o,s,c){super(e,t,n,r,i,a,o,s,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},ei=class extends Dt{constructor(e,t,n=m,i,a,o,s=r,c=r,l,u=T,d=1){if(u!==1026&&u!==1027)throw Error(`THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat`);super({width:e,height:t,depth:d},i,a,o,s,c,u,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Ct(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},ti=class extends ei{constructor(e,t=m,n=301,i,a,o=r,s=r,c,l=T){let u={width:e,height:e,depth:1},d=[u,u,u,u,u,u];super(e,e,t,n,i,a,o,s,c,l),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},ni=class extends Dt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},ri=class e extends dr{constructor(e=1,t=1,n=1,r=1,i=1,a=1){super(),this.type=`BoxGeometry`,this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:i,depthSegments:a};let o=this;r=Math.floor(r),i=Math.floor(i),a=Math.floor(a);let s=[],c=[],l=[],u=[],d=0,f=0;p(`z`,`y`,`x`,-1,-1,n,t,e,a,i,0),p(`z`,`y`,`x`,1,-1,n,t,-e,a,i,1),p(`x`,`z`,`y`,1,1,e,n,t,r,a,2),p(`x`,`z`,`y`,1,-1,e,n,-t,r,a,3),p(`x`,`y`,`z`,1,-1,e,t,n,r,i,4),p(`x`,`y`,`z`,-1,-1,e,t,-n,r,i,5),this.setIndex(s),this.setAttribute(`position`,new $n(c,3)),this.setAttribute(`normal`,new $n(l,3)),this.setAttribute(`uv`,new $n(u,2));function p(e,t,n,r,i,a,p,m,h,g,_){let v=a/h,y=p/g,b=a/2,x=p/2,S=m/2,C=h+1,w=g+1,T=0,E=0,D=new V;for(let a=0;a<w;a++){let o=a*y-x;for(let s=0;s<C;s++)D[e]=(s*v-b)*r,D[t]=o*i,D[n]=S,c.push(D.x,D.y,D.z),D[e]=0,D[t]=0,D[n]=m>0?1:-1,l.push(D.x,D.y,D.z),u.push(s/h),u.push(1-a/g),T+=1}for(let e=0;e<g;e++)for(let t=0;t<h;t++){let n=d+t+C*e,r=d+t+C*(e+1),i=d+(t+1)+C*(e+1),a=d+(t+1)+C*e;s.push(n,r,a),s.push(r,i,a),E+=6}o.addGroup(f,E,_),f+=E,d+=T}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}},ii=class e extends dr{constructor(e=1,t=32,n=0,r=Math.PI*2){super(),this.type=`CircleGeometry`,this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:r},t=Math.max(3,t);let i=[],a=[],o=[],s=[],c=new V,l=new B;a.push(0,0,0),o.push(0,0,1),s.push(.5,.5);for(let i=0,u=3;i<=t;i++,u+=3){let d=n+i/t*r;c.x=e*Math.cos(d),c.y=e*Math.sin(d),a.push(c.x,c.y,c.z),o.push(0,0,1),l.x=(a[u]/e+1)/2,l.y=(a[u+1]/e+1)/2,s.push(l.x,l.y)}for(let e=1;e<=t;e++)i.push(e,e+1,0);this.setIndex(i),this.setAttribute(`position`,new $n(a,3)),this.setAttribute(`normal`,new $n(o,3)),this.setAttribute(`uv`,new $n(s,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.segments,t.thetaStart,t.thetaLength)}},ai=class e extends dr{constructor(e=1,t=1,n=1,r=32,i=1,a=!1,o=0,s=Math.PI*2){super(),this.type=`CylinderGeometry`,this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:r,heightSegments:i,openEnded:a,thetaStart:o,thetaLength:s};let c=this;r=Math.floor(r),i=Math.floor(i);let l=[],u=[],d=[],f=[],p=0,m=[],h=n/2,g=0;_(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(l),this.setAttribute(`position`,new $n(u,3)),this.setAttribute(`normal`,new $n(d,3)),this.setAttribute(`uv`,new $n(f,2));function _(){let a=new V,_=new V,v=0,y=(t-e)/n;for(let c=0;c<=i;c++){let l=[],g=c/i,v=g*(t-e)+e;for(let e=0;e<=r;e++){let t=e/r,i=t*s+o,c=Math.sin(i),m=Math.cos(i);_.x=v*c,_.y=-g*n+h,_.z=v*m,u.push(_.x,_.y,_.z),a.set(c,y,m).normalize(),d.push(a.x,a.y,a.z),f.push(t,1-g),l.push(p++)}m.push(l)}for(let n=0;n<r;n++)for(let r=0;r<i;r++){let a=m[r][n],o=m[r+1][n],s=m[r+1][n+1],c=m[r][n+1];(e>0||r!==0)&&(l.push(a,o,c),v+=3),(t>0||r!==i-1)&&(l.push(o,s,c),v+=3)}c.addGroup(g,v,0),g+=v}function v(n){let i=p,a=new B,m=new V,_=0,v=n===!0?e:t,y=n===!0?1:-1;for(let e=1;e<=r;e++)u.push(0,h*y,0),d.push(0,y,0),f.push(.5,.5),p++;let b=p;for(let e=0;e<=r;e++){let t=e/r*s+o,n=Math.cos(t),i=Math.sin(t);m.x=v*i,m.y=h*y,m.z=v*n,u.push(m.x,m.y,m.z),d.push(0,y,0),a.x=n*.5+.5,a.y=i*.5*y+.5,f.push(a.x,a.y),p++}for(let e=0;e<r;e++){let t=i+e,r=b+e;n===!0?l.push(r,r+1,t):l.push(r+1,r,t),_+=3}c.addGroup(g,_,n===!0?1:2),g+=_}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},oi=class e extends ai{constructor(e=1,t=1,n=32,r=1,i=!1,a=0,o=Math.PI*2){super(0,e,t,n,r,i,a,o),this.type=`ConeGeometry`,this.parameters={radius:e,height:t,radialSegments:n,heightSegments:r,openEnded:i,thetaStart:a,thetaLength:o}}static fromJSON(t){return new e(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},si=class e extends dr{constructor(e=1,t=1,n=1,r=1){super(),this.type=`PlaneGeometry`,this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};let i=e/2,a=t/2,o=Math.floor(n),s=Math.floor(r),c=o+1,l=s+1,u=e/o,d=t/s,f=[],p=[],m=[],h=[];for(let e=0;e<l;e++){let t=e*d-a;for(let n=0;n<c;n++){let r=n*u-i;p.push(r,-t,0),m.push(0,0,1),h.push(n/o),h.push(1-e/s)}}for(let e=0;e<s;e++)for(let t=0;t<o;t++){let n=t+c*e,r=t+c*(e+1),i=t+1+c*(e+1),a=t+1+c*e;f.push(n,r,a),f.push(r,i,a)}this.setIndex(f),this.setAttribute(`position`,new $n(p,3)),this.setAttribute(`normal`,new $n(m,3)),this.setAttribute(`uv`,new $n(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.widthSegments,t.heightSegments)}},ci=class e extends dr{constructor(e=1,t=32,n=16,r=0,i=Math.PI*2,a=0,o=Math.PI){super(),this.type=`SphereGeometry`,this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:r,phiLength:i,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let s=Math.min(a+o,Math.PI),c=0,l=[],u=new V,d=new V,f=[],p=[],m=[],h=[];for(let f=0;f<=n;f++){let g=[],_=f/n,v=a+_*o,y=e*Math.cos(v),b=Math.sqrt(e*e-y*y),x=0;f===0&&a===0?x=.5/t:f===n&&s===Math.PI&&(x=-.5/t);for(let e=0;e<=t;e++){let n=e/t,a=r+n*i;u.x=-b*Math.cos(a),u.y=y,u.z=b*Math.sin(a),p.push(u.x,u.y,u.z),d.copy(u).normalize(),m.push(d.x,d.y,d.z),h.push(n+x,1-_),g.push(c++)}l.push(g)}for(let e=0;e<n;e++)for(let r=0;r<t;r++){let t=l[e][r+1],i=l[e][r],o=l[e+1][r],c=l[e+1][r+1];(e!==0||a>0)&&f.push(t,i,c),(e!==n-1||s<Math.PI)&&f.push(i,o,c)}this.setIndex(f),this.setAttribute(`position`,new $n(p,3)),this.setAttribute(`normal`,new $n(m,3)),this.setAttribute(`uv`,new $n(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}},li=class e extends dr{constructor(e=1,t=.4,n=12,r=48,i=Math.PI*2,a=0,o=Math.PI*2){super(),this.type=`TorusGeometry`,this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:r,arc:i,thetaStart:a,thetaLength:o},n=Math.floor(n),r=Math.floor(r);let s=[],c=[],l=[],u=[],d=new V,f=new V,p=new V;for(let s=0;s<=n;s++){let m=a+s/n*o;for(let a=0;a<=r;a++){let o=a/r*i;f.x=(e+t*Math.cos(m))*Math.cos(o),f.y=(e+t*Math.cos(m))*Math.sin(o),f.z=t*Math.sin(m),c.push(f.x,f.y,f.z),d.x=e*Math.cos(o),d.y=e*Math.sin(o),p.subVectors(f,d).normalize(),l.push(p.x,p.y,p.z),u.push(a/r),u.push(s/n)}}for(let e=1;e<=n;e++)for(let t=1;t<=r;t++){let n=(r+1)*e+t-1,i=(r+1)*(e-1)+t-1,a=(r+1)*(e-1)+t,o=(r+1)*e+t;s.push(n,i,o),s.push(i,a,o)}this.setIndex(s),this.setAttribute(`position`,new $n(c,3)),this.setAttribute(`normal`,new $n(l,3)),this.setAttribute(`uv`,new $n(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}};function ui(e){let t={};for(let n in e){t[n]={};for(let r in e[n]){let i=e[n][r];if(fi(i))i.isRenderTargetTexture?(L(`UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms().`),t[n][r]=null):t[n][r]=i.clone();else if(Array.isArray(i)){if(fi(i[0])){let e=[];for(let t=0,n=i.length;t<n;t++)e[t]=i[t].clone();t[n][r]=e}else t[n][r]=i.slice()}else t[n][r]=i}}return t}function di(e){let t={};for(let n=0;n<e.length;n++){let r=ui(e[n]);for(let e in r)t[e]=r[e]}return t}function fi(e){return e&&(e.isColor||e.isMatrix3||e.isMatrix4||e.isVector2||e.isVector3||e.isVector4||e.isTexture||e.isQuaternion)}function pi(e){let t=[];for(let n=0;n<e.length;n++)t.push(e[n].clone());return t}function mi(e){let t=e.getRenderTarget();return t===null?e.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:U.workingColorSpace}var hi={clone:ui,merge:di},gi=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,_i=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,vi=class extends pr{constructor(e){super(),this.isShaderMaterial=!0,this.type=`ShaderMaterial`,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=gi,this.fragmentShader=_i,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ui(e.uniforms),this.uniformsGroups=pi(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let n in this.uniforms){let r=this.uniforms[n].value;r&&r.isTexture?t.uniforms[n]={type:`t`,value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[n]={type:`c`,value:r.getHex()}:r&&r.isVector2?t.uniforms[n]={type:`v2`,value:r.toArray()}:r&&r.isVector3?t.uniforms[n]={type:`v3`,value:r.toArray()}:r&&r.isVector4?t.uniforms[n]={type:`v4`,value:r.toArray()}:r&&r.isMatrix3?t.uniforms[n]={type:`m3`,value:r.toArray()}:r&&r.isMatrix4?t.uniforms[n]={type:`m4`,value:r.toArray()}:t.uniforms[n]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let e in this.extensions)this.extensions[e]===!0&&(n[e]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let r=e.uniforms[n];switch(this.uniforms[n]={},r.type){case`t`:this.uniforms[n].value=t[r.value]||null;break;case`c`:this.uniforms[n].value=new W().setHex(r.value);break;case`v2`:this.uniforms[n].value=new B().fromArray(r.value);break;case`v3`:this.uniforms[n].value=new V().fromArray(r.value);break;case`v4`:this.uniforms[n].value=new Ot().fromArray(r.value);break;case`m3`:this.uniforms[n].value=new H().fromArray(r.value);break;case`m4`:this.uniforms[n].value=new Nt().fromArray(r.value);break;default:this.uniforms[n].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let t in e.extensions)this.extensions[t]=e.extensions[t];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},yi=class extends vi{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type=`RawShaderMaterial`}},bi=class extends pr{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type=`MeshStandardMaterial`,this.defines={STANDARD:``},this.color=new W(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new W(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new B(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ut,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:``},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},xi=class extends pr{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type=`MeshDepthMaterial`,this.depthPacking=F,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Si=class extends pr{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type=`MeshDistanceMaterial`,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function Ci(e,t){return!e||e.constructor===t?e:typeof t.BYTES_PER_ELEMENT==`number`?new t(e):Array.prototype.slice.call(e)}var wi=class{constructor(e,t,n,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r===void 0?new t.constructor(n):r,this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,r=t[n],i=t[n-1];validate_interval:{seek:{let a;linear_scan:{forward_scan:if(!(e<r)){for(let a=n+2;;){if(r===void 0){if(e<i)break forward_scan;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(i=r,r=t[++n],e<r)break seek}a=t.length;break linear_scan}if(!(e>=i)){let o=t[1];e<o&&(n=2,i=o);for(let a=n-2;;){if(i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===a)break;if(r=i,i=t[--n-1],e>=i)break seek}a=n,n=0;break linear_scan}break validate_interval}for(;n<a;){let r=n+a>>>1;e<t[r]?a=r:n=r+1}if(r=t[n],i=t[n-1],i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,i,r)}return this.interpolate_(n,i,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,i=e*r;for(let e=0;e!==r;++e)t[e]=n[i+e];return t}interpolate_(){throw Error(`THREE.Interpolant: Call to abstract method.`)}intervalChanged_(){}},Ti=class extends wi{constructor(e,t,n,r){super(e,t,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Re,endingEnd:Re}}intervalChanged_(e,t,n){let r=this.parameterPositions,i=e-2,a=e+1,o=r[i],s=r[a];if(o===void 0)switch(this.getSettings_().endingStart){case P:i=e,o=2*t-n;break;case ze:i=r.length-2,o=t+r[i]-r[i+1];break;default:i=e,o=n}if(s===void 0)switch(this.getSettings_().endingEnd){case P:a=e,s=2*n-t;break;case ze:a=1,s=n+r[1]-r[0];break;default:a=e-1,s=t}let c=(n-t)*.5,l=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(s-n),this._offsetPrev=i*l,this._offsetNext=a*l}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(r-t),m=p*p,h=m*p,g=-d*h+2*d*m-d*p,_=(1+d)*h+(-1.5-2*d)*m+(-.5+d)*p+1,v=(-1-f)*h+(1.5+f)*m+.5*p,y=f*h-f*m;for(let e=0;e!==o;++e)i[e]=g*a[l+e]+_*a[c+e]+v*a[s+e]+y*a[u+e];return i}},Ei=class extends wi{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=(n-t)/(r-t),u=1-l;for(let e=0;e!==o;++e)i[e]=a[c+e]*u+a[s+e]*l;return i}},Di=class extends wi{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e){return this.copySampleValue_(e-1)}},Oi=class extends wi{interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this.inTangents,u=this.outTangents;if(!l||!u){let e=(n-t)/(r-t),l=1-e;for(let t=0;t!==o;++t)i[t]=a[c+t]*l+a[s+t]*e;return i}let d=o*2,f=e-1;for(let p=0;p!==o;++p){let o=a[c+p],m=a[s+p],h=f*d+p*2,g=u[h],_=u[h+1],v=e*d+p*2,y=l[v],b=l[v+1],x=(n-t)/(r-t),S,C,w,T,E;for(let e=0;e<8;e++){S=x*x,C=S*x,w=1-x,T=w*w,E=T*w;let e=E*t+3*T*x*g+3*w*S*y+C*r-n;if(Math.abs(e)<1e-10)break;let i=3*T*(g-t)+6*w*x*(y-g)+3*S*(r-y);if(Math.abs(i)<1e-10)break;x-=e/i,x=Math.max(0,Math.min(1,x))}i[p]=E*o+3*T*x*_+3*w*S*b+C*m}return i}},ki=class{constructor(e,t,n,r){if(e===void 0)throw Error(`THREE.KeyframeTrack: track name is undefined`);if(t===void 0||t.length===0)throw Error(`THREE.KeyframeTrack: no keyframes in track named `+e);this.name=e,this.times=Ci(t,this.TimeBufferType),this.values=Ci(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Ci(e.times,Array),values:Ci(e.values,Array)};let t=e.getInterpolation();t!==e.DefaultInterpolation&&(n.interpolation=t)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Di(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Ei(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Ti(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new Oi(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case Fe:t=this.InterpolantFactoryMethodDiscrete;break;case N:t=this.InterpolantFactoryMethodLinear;break;case Ie:t=this.InterpolantFactoryMethodSmooth;break;case Le:t=this.InterpolantFactoryMethodBezier}if(t===void 0){let t=`unsupported interpolation for `+this.ValueTypeName+` keyframe track named `+this.name;if(this.createInterpolant===void 0){if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw Error(t)}return L(`KeyframeTrack:`,t),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Fe;case this.InterpolantFactoryMethodLinear:return N;case this.InterpolantFactoryMethodSmooth:return Ie;case this.InterpolantFactoryMethodBezier:return Le}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]*=e}return this}trim(e,t){let n=this.times,r=n.length,i=0,a=r-1;for(;i!==r&&n[i]<e;)++i;for(;a!==-1&&n[a]>t;)--a;if(++a,i!==0||a!==r){i>=a&&(a=Math.max(a,1),i=a-1);let e=this.getValueSize();this.times=n.slice(i,a),this.values=this.values.slice(i*e,a*e)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(R(`KeyframeTrack: Invalid value size in track.`,this),e=!1);let n=this.times,r=this.values,i=n.length;i===0&&(R(`KeyframeTrack: Track is empty.`,this),e=!1);let a=null;for(let t=0;t!==i;t++){let r=n[t];if(typeof r==`number`&&isNaN(r)){R(`KeyframeTrack: Time is not a valid number.`,this,t,r),e=!1;break}if(a!==null&&a>r){R(`KeyframeTrack: Out of order keys.`,this,t,r,a),e=!1;break}a=r}if(r!==void 0&&qe(r))for(let t=0,n=r.length;t!==n;++t){let n=r[t];if(isNaN(n)){R(`KeyframeTrack: Value is not a valid number.`,this,t,n),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===Ie,i=e.length-1,a=1;for(let o=1;o<i;++o){let i=!1,s=e[o];if(s!==e[o+1]&&(o!==1||s!==e[0])){if(r)i=!0;else{let e=o*n,r=e-n,a=e+n;for(let o=0;o!==n;++o){let n=t[e+o];if(n!==t[r+o]||n!==t[a+o]){i=!0;break}}}}if(i){if(o!==a){e[a]=e[o];let r=o*n,i=a*n;for(let e=0;e!==n;++e)t[i+e]=t[r+e]}++a}}if(i>0){e[a]=e[i];for(let e=i*n,r=a*n,o=0;o!==n;++o)t[r+o]=t[e+o];++a}return a===e.length?(this.times=e,this.values=t):(this.times=e.slice(0,a),this.values=t.slice(0,a*n)),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,r=new n(this.name,e,t);return r.createInterpolant=this.createInterpolant,r}};ki.prototype.ValueTypeName=``,ki.prototype.TimeBufferType=Float32Array,ki.prototype.ValueBufferType=Float32Array,ki.prototype.DefaultInterpolation=N;var Ai=class extends ki{constructor(e,t,n){super(e,t,n)}};Ai.prototype.ValueTypeName=`bool`,Ai.prototype.ValueBufferType=Array,Ai.prototype.DefaultInterpolation=Fe,Ai.prototype.InterpolantFactoryMethodLinear=void 0,Ai.prototype.InterpolantFactoryMethodSmooth=void 0;var ji=class extends ki{constructor(e,t,n,r){super(e,t,n,r)}};ji.prototype.ValueTypeName=`color`;var Mi=class extends ki{constructor(e,t,n,r){super(e,t,n,r)}};Mi.prototype.ValueTypeName=`number`;var Ni=class extends wi{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=(n-t)/(r-t),c=e*o;for(let e=c+o;c!==e;c+=4)dt.slerpFlat(i,0,a,c-o,a,c,s);return i}},Pi=class extends ki{constructor(e,t,n,r){super(e,t,n,r)}InterpolantFactoryMethodLinear(e){return new Ni(this.times,this.values,this.getValueSize(),e)}};Pi.prototype.ValueTypeName=`quaternion`,Pi.prototype.InterpolantFactoryMethodSmooth=void 0;var Fi=class extends ki{constructor(e,t,n){super(e,t,n)}};Fi.prototype.ValueTypeName=`string`,Fi.prototype.ValueBufferType=Array,Fi.prototype.DefaultInterpolation=Fe,Fi.prototype.InterpolantFactoryMethodLinear=void 0,Fi.prototype.InterpolantFactoryMethodSmooth=void 0;var Ii=class extends ki{constructor(e,t,n,r){super(e,t,n,r)}};Ii.prototype.ValueTypeName=`vector`;var Li=class extends sn{constructor(e,t=1){super(),this.isLight=!0,this.type=`Light`,this.color=new W(e),this.intensity=t}dispose(){this.dispatchEvent({type:`dispose`})}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},Ri=class extends Li{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type=`HemisphereLight`,this.position.copy(sn.DEFAULT_UP),this.updateMatrix(),this.groundColor=new W(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},zi=new Nt,Bi=new V,Vi=new V,Hi=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new B(512,512),this.mapType=l,this.map=null,this.mapPass=null,this.matrix=new Nt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Wr,this._frameExtents=new B(1,1),this._viewportCount=1,this._viewports=[new Ot(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,n=this.matrix;Bi.setFromMatrixPosition(e.matrixWorld),t.position.copy(Bi),Vi.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Vi),t.updateMatrixWorld(),zi.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(zi,t.coordinateSystem,t.reversedDepth),t.coordinateSystem===2001||t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(zi)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},Ui=new V,Wi=new dt,Gi=new V,Ki=class extends sn{constructor(){super(),this.isCamera=!0,this.type=`Camera`,this.matrixWorldInverse=new Nt,this.projectionMatrix=new Nt,this.projectionMatrixInverse=new Nt,this.coordinateSystem=Ge,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Ui,Wi,Gi),Gi.x===1&&Gi.y===1&&Gi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Ui,Wi,Gi.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(Ui,Wi,Gi),Gi.x===1&&Gi.y===1&&Gi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Ui,Wi,Gi.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},qi=new V,Ji=new B,Yi=new B,Xi=class extends Ki{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type=`PerspectiveCamera`,this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=at*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(it*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return at*2*Math.atan(Math.tan(it*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){qi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(qi.x,qi.y).multiplyScalar(-e/qi.z),qi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(qi.x,qi.y).multiplyScalar(-e/qi.z)}getViewSize(e,t){return this.getViewBounds(e,Ji,Yi),t.subVectors(Yi,Ji)}setViewOffset(e,t,n,r,i,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(it*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,i=-.5*r,a=this.view;if(this.view!==null&&this.view.enabled){let e=a.fullWidth,o=a.fullHeight;i+=a.offsetX*r/e,t-=a.offsetY*n/o,r*=a.width/e,n*=a.height/o}let o=this.filmOffset;o!==0&&(i+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(i,i+r,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Zi=class extends Hi{constructor(){super(new Xi(90,1,.5,500)),this.isPointLightShadow=!0}},Qi=class extends Li{constructor(e,t,n=0,r=2){super(e,t),this.isPointLight=!0,this.type=`PointLight`,this.distance=n,this.decay=r,this.shadow=new Zi}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}},$i=class extends Ki{constructor(e=-1,t=1,n=1,r=-1,i=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type=`OrthographicCamera`,this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=i,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,i,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2,i=n-e,a=n+e,o=r+t,s=r-t;if(this.view!==null&&this.view.enabled){let e=(this.right-this.left)/this.view.fullWidth/this.zoom,t=(this.top-this.bottom)/this.view.fullHeight/this.zoom;i+=e*this.view.offsetX,a=i+e*this.view.width,o-=t*this.view.offsetY,s=o-t*this.view.height}this.projectionMatrix.makeOrthographic(i,a,o,s,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},ea=class extends Hi{constructor(){super(new $i(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},ta=class extends Li{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type=`DirectionalLight`,this.position.copy(sn.DEFAULT_UP),this.updateMatrix(),this.target=new sn,this.shadow=new ea}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}},na=class extends Li{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type=`AmbientLight`}},ra=-90,ia=1,aa=class extends sn{constructor(e,t,n){super(),this.type=`CubeCamera`,this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new Xi(ra,ia,e,t);r.layers=this.layers,this.add(r);let i=new Xi(ra,ia,e,t);i.layers=this.layers,this.add(i);let a=new Xi(ra,ia,e,t);a.layers=this.layers,this.add(a);let o=new Xi(ra,ia,e,t);o.layers=this.layers,this.add(o);let s=new Xi(ra,ia,e,t);s.layers=this.layers,this.add(s);let c=new Xi(ra,ia,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,r,i,a,o,s]=t;for(let e of t)this.remove(e);if(e===2e3)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),i.up.set(0,0,-1),i.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),s.up.set(0,1,0),s.lookAt(0,0,-1);else if(e===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),i.up.set(0,0,1),i.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),s.up.set(0,-1,0),s.lookAt(0,0,-1);else throw Error(`THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: `+e);for(let e of t)this.add(e),e.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[i,a,o,s,c,l]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let m=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let h=!1;h=e.isWebGLRenderer===!0?e.state.buffers.depth.getReversed():e.reversedDepthBuffer,e.setRenderTarget(n,0,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,i),e.setRenderTarget(n,1,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(n,4,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=m,e.setRenderTarget(n,5,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(u,d,f),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},oa=class extends Xi{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},sa=class{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(e){this._document=e,e.hidden!==void 0&&(this._pageVisibilityHandler=ca.bind(this),e.addEventListener(`visibilitychange`,this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener(`visibilitychange`,this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(e){return this._timescale=e,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(e){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(e===void 0?performance.now():e)-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}};function ca(){this._document.hidden===!1&&this.reset()}var la=`\\[\\]\\.:\\/`,ua=RegExp(`[\\[\\]\\.:\\/]`,`g`),da=`[^\\[\\]\\.:\\/]`,fa=`[^`+la.replace(`\\.`,``)+`]`,pa=`((?:WC+[\\/:])*)`.replace(`WC`,da),ma=`(WCOD+)?`.replace(`WCOD`,fa),ha=`(?:\\.(WC+)(?:\\[(.+)\\])?)?`.replace(`WC`,da),ga=`\\.(WC+)(?:\\[(.+)\\])?`.replace(`WC`,da),_a=RegExp(`^`+pa+ma+ha+ga+`$`),va=[`material`,`materials`,`bones`,`map`],ya=class{constructor(e,t,n){let r=n||ba.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,r=this._bindings[n];r!==void 0&&r.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let r=this._targetGroup.nCachedObjects_,i=n.length;r!==i;++r)n[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},ba=class e{constructor(t,n,r){this.path=n,this.parsedPath=r||e.parseTrackName(n),this.node=e.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,n,r){return t&&t.isAnimationObjectGroup?new e.Composite(t,n,r):new e(t,n,r)}static sanitizeNodeName(e){return e.replace(/\s/g,`_`).replace(ua,``)}static parseTrackName(e){let t=_a.exec(e);if(t===null)throw Error(`THREE.PropertyBinding: Cannot parse trackName: `+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=n.nodeName&&n.nodeName.lastIndexOf(`.`);if(r!==void 0&&r!==-1){let e=n.nodeName.substring(r+1);va.indexOf(e)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=e)}if(n.propertyName===null||n.propertyName.length===0)throw Error(`THREE.PropertyBinding: can not parse propertyName from trackName: `+e);return n}static findNode(e,t){if(t===void 0||t===``||t===`.`||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(e){for(let r=0;r<e.length;r++){let i=e[r];if(i.name===t||i.uuid===t)return i;let a=n(i.children);if(a)return a}return null},r=n(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)e[t++]=n[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let t=this.node,n=this.parsedPath,r=n.objectName,i=n.propertyName,a=n.propertyIndex;if(t||(t=e.findNode(this.rootNode,n.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){L(`PropertyBinding: No target node found for track: `+this.path+`.`);return}if(r){let e=n.objectIndex;switch(r){case`materials`:if(!t.material){R(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.materials){R(`PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.`,this);return}t=t.material.materials;break;case`bones`:if(!t.skeleton){R(`PropertyBinding: Can not bind to bones as node does not have a skeleton.`,this);return}t=t.skeleton.bones;for(let n=0;n<t.length;n++)if(t[n].name===e){e=n;break}break;case`map`:if(`map`in t){t=t.map;break}if(!t.material){R(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.map){R(`PropertyBinding: Can not bind to material.map as node.material does not have a map.`,this);return}t=t.material.map;break;default:if(t[r]===void 0){R(`PropertyBinding: Can not bind to objectName of node undefined.`,this);return}t=t[r]}if(e!==void 0){if(t[e]===void 0){R(`PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.`,this,t);return}t=t[e]}}let o=t[i];if(o===void 0){let e=n.nodeName;R(`PropertyBinding: Trying to update property for track: `+e+`.`+i+` but it wasn't found.`,t);return}let s=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?s=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(s=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(a!==void 0){if(i===`morphTargetInfluences`){if(!t.geometry){R(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.`,this);return}if(!t.geometry.morphAttributes){R(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.`,this);return}t.morphTargetDictionary[a]!==void 0&&(a=t.morphTargetDictionary[a])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=a}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][s]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};ba.Composite=ya,ba.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},ba.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},ba.prototype.GetterByBindingType=[ba.prototype._getValue_direct,ba.prototype._getValue_array,ba.prototype._getValue_arrayElement,ba.prototype._getValue_toArray],ba.prototype.SetterByBindingTypeAndVersioning=[[ba.prototype._setValue_direct,ba.prototype._setValue_direct_setNeedsUpdate,ba.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ba.prototype._setValue_array,ba.prototype._setValue_array_setNeedsUpdate,ba.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ba.prototype._setValue_arrayElement,ba.prototype._setValue_arrayElement_setNeedsUpdate,ba.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ba.prototype._setValue_fromArray,ba.prototype._setValue_fromArray_setNeedsUpdate,ba.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var xa=new Nt,Sa=class{constructor(e,t,n=0,r=1/0){this.ray=new xr(e,t),this.near=n,this.far=r,this.camera=null,this.layers=new Wt,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,t.projectionMatrix.elements[14]).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):R(`Raycaster: Unsupported camera type: `+t.type)}setFromXRController(e){return xa.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(xa),this}intersectObject(e,t=!0,n=[]){return wa(e,this,n,t),n.sort(Ca),n}intersectObjects(e,t=!0,n=[]){for(let r=0,i=e.length;r<i;r++)wa(e[r],this,n,t);return n.sort(Ca),n}};function Ca(e,t){return e.distance-t.distance}function wa(e,t,n,r){let i=!0;if(e.layers.test(t.layers)&&e.raycast(t,n)===!1&&(i=!1),i===!0&&r===!0){let r=e.children;for(let e=0,i=r.length;e<i;e++)wa(r[e],t,n,!0)}}(class e{static{e.prototype.isMatrix2=!0}constructor(e,t,n,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,r){let i=this.elements;return i[0]=e,i[2]=t,i[1]=n,i[3]=r,this}});function Ta(e,t,n,r){let i=Ea(r);switch(n){case S:return e*t;case D:return e*t/i.components*i.byteLength;case ee:return e*t/i.components*i.byteLength;case te:return e*t*2/i.components*i.byteLength;case O:return e*t*2/i.components*i.byteLength;case C:return e*t*3/i.components*i.byteLength;case w:return e*t*4/i.components*i.byteLength;case ne:return e*t*4/i.components*i.byteLength;case k:case A:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case re:case ie:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case ae:case se:return Math.max(e,16)*Math.max(t,8)/4;case j:case oe:return Math.max(e,8)*Math.max(t,8)/2;case ce:case le:case de:case M:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case ue:case fe:case pe:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case me:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case he:return Math.floor((e+4)/5)*Math.floor((t+3)/4)*16;case ge:return Math.floor((e+4)/5)*Math.floor((t+4)/5)*16;case _e:return Math.floor((e+5)/6)*Math.floor((t+4)/5)*16;case ve:return Math.floor((e+5)/6)*Math.floor((t+5)/6)*16;case ye:return Math.floor((e+7)/8)*Math.floor((t+4)/5)*16;case be:return Math.floor((e+7)/8)*Math.floor((t+5)/6)*16;case xe:return Math.floor((e+7)/8)*Math.floor((t+7)/8)*16;case Se:return Math.floor((e+9)/10)*Math.floor((t+4)/5)*16;case Ce:return Math.floor((e+9)/10)*Math.floor((t+5)/6)*16;case we:return Math.floor((e+9)/10)*Math.floor((t+7)/8)*16;case Te:return Math.floor((e+9)/10)*Math.floor((t+9)/10)*16;case Ee:return Math.floor((e+11)/12)*Math.floor((t+9)/10)*16;case De:return Math.floor((e+11)/12)*Math.floor((t+11)/12)*16;case Oe:case ke:case Ae:return Math.ceil(e/4)*Math.ceil(t/4)*16;case je:case Me:return Math.ceil(e/4)*Math.ceil(t/4)*8;case Ne:case Pe:return Math.ceil(e/4)*Math.ceil(t/4)*16}throw Error(`Unable to determine texture byte length for ${n} format.`)}function Ea(e){switch(e){case l:case u:return{byteLength:1,components:1};case f:case d:case g:return{byteLength:2,components:1};case _:case v:return{byteLength:2,components:4};case m:case p:case h:return{byteLength:4,components:1};case b:case x:return{byteLength:4,components:3}}throw Error(`THREE.TextureUtils: Unknown texture type ${e}.`)}typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`register`,{detail:{revision:`185`}})),typeof window<`u`&&(window.__THREE__?L(`WARNING: Multiple instances of Three.js being imported.`):window.__THREE__=`185`);function Da(){let e=null,t=!1,n=null,r=null;function i(t,a){n(t,a),r=e.requestAnimationFrame(i)}return{start:function(){t!==!0&&n!==null&&e!==null&&(r=e.requestAnimationFrame(i),t=!0)},stop:function(){e!==null&&e.cancelAnimationFrame(r),t=!1},setAnimationLoop:function(e){n=e},setContext:function(t){e=t}}}function Oa(e){let t=new WeakMap;function n(t,n){let r=t.array,i=t.usage,a=r.byteLength,o=e.createBuffer();e.bindBuffer(n,o),e.bufferData(n,r,i),t.onUploadCallback();let s;if(r instanceof Float32Array)s=e.FLOAT;else if(typeof Float16Array<`u`&&r instanceof Float16Array)s=e.HALF_FLOAT;else if(r instanceof Uint16Array)s=t.isFloat16BufferAttribute?e.HALF_FLOAT:e.UNSIGNED_SHORT;else if(r instanceof Int16Array)s=e.SHORT;else if(r instanceof Uint32Array)s=e.UNSIGNED_INT;else if(r instanceof Int32Array)s=e.INT;else if(r instanceof Int8Array)s=e.BYTE;else if(r instanceof Uint8Array)s=e.UNSIGNED_BYTE;else if(r instanceof Uint8ClampedArray)s=e.UNSIGNED_BYTE;else throw Error(`THREE.WebGLAttributes: Unsupported buffer data format: `+r);return{buffer:o,type:s,bytesPerElement:r.BYTES_PER_ELEMENT,version:t.version,size:a}}function r(t,n,r){let i=n.array,a=n.updateRanges;if(e.bindBuffer(r,t),a.length===0)e.bufferSubData(r,0,i);else{a.sort((e,t)=>e.start-t.start);let t=0;for(let e=1;e<a.length;e++){let n=a[t],r=a[e];r.start<=n.start+n.count+1?n.count=Math.max(n.count,r.start+r.count-n.start):(++t,a[t]=r)}a.length=t+1;for(let t=0,n=a.length;t<n;t++){let n=a[t];e.bufferSubData(r,n.start*i.BYTES_PER_ELEMENT,i,n.start,n.count)}n.clearUpdateRanges()}n.onUploadCallback()}function i(e){return e.isInterleavedBufferAttribute&&(e=e.data),t.get(e)}function a(n){n.isInterleavedBufferAttribute&&(n=n.data);let r=t.get(n);r&&(e.deleteBuffer(r.buffer),t.delete(n))}function o(e,i){if(e.isInterleavedBufferAttribute&&(e=e.data),e.isGLBufferAttribute){let n=t.get(e);(!n||n.version<e.version)&&t.set(e,{buffer:e.buffer,type:e.type,bytesPerElement:e.elementSize,version:e.version});return}let a=t.get(e);if(a===void 0)t.set(e,n(e,i));else if(a.version<e.version){if(a.size!==e.array.byteLength)throw Error(`THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.`);r(a.buffer,e,i),a.version=e.version}}return{get:i,remove:a,update:o}}var K={alphahash_fragment:`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,alphahash_pars_fragment:`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,alphamap_fragment:`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,alphamap_pars_fragment:`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment:`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,alphatest_pars_fragment:`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aomap_fragment:`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,aomap_pars_fragment:`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,batching_pars_vertex:`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,batching_vertex:`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,begin_vertex:`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,beginnormal_vertex:`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs:`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,iridescence_fragment:`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,bumpmap_pars_fragment:`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,clipping_planes_fragment:`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,clipping_planes_pars_fragment:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex:`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,color_pars_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,color_pars_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,color_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,common:`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,cube_uv_reflection_fragment:`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,defaultnormal_vertex:`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,displacementmap_pars_vertex:`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex:`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment:`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment:`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,colorspace_fragment:`gl_FragColor = linearToOutputTexel( gl_FragColor );`,colorspace_pars_fragment:`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,envmap_fragment:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,envmap_common_pars_fragment:`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,envmap_pars_fragment:`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,envmap_pars_vertex:`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_physical_pars_fragment:`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,envmap_vertex:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fog_vertex:`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex:`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment:`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment:`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment:`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,lightmap_pars_fragment:`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_fragment:`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lights_lambert_pars_fragment:`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lights_pars_begin:`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,lights_toon_fragment:`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment:`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lights_phong_fragment:`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment:`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lights_physical_fragment:`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,lights_physical_pars_fragment:`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lights_fragment_begin:`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lights_fragment_maps:`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lights_fragment_end:`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,lightprobes_pars_fragment:`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,logdepthbuf_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,map_fragment:`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,map_pars_fragment:`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment:`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,map_particle_pars_fragment:`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,metalnessmap_fragment:`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment:`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphinstance_vertex:`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,morphcolor_vertex:`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,morphnormal_vertex:`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,morphtarget_pars_vertex:`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,morphtarget_vertex:`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,normal_fragment_begin:`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,normal_fragment_maps:`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,normal_pars_fragment:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_pars_vertex:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_vertex:`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,normalmap_pars_fragment:`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,clearcoat_normal_fragment_begin:`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,clearcoat_normal_fragment_maps:`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,clearcoat_pars_fragment:`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iridescence_pars_fragment:`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,opaque_fragment:`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing:`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,premultiplied_alpha_fragment:`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex:`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment:`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment:`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment:`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment:`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment:`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,shadowmap_pars_vertex:`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,shadowmap_vertex:`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,shadowmask_pars_fragment:`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,skinbase_vertex:`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex:`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,skinning_vertex:`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex:`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,specularmap_fragment:`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment:`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment:`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment:`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmission_fragment:`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,transmission_pars_fragment:`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,uv_pars_fragment:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_pars_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,worldpos_vertex:`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,depth_frag:`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,distance_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,distance_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,linedashed_frag:`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,meshbasic_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,meshbasic_frag:`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshlambert_vert:`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,meshmatcap_frag:`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshnormal_vert:`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,meshphysical_frag:`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshtoon_vert:`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,points_vert:`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,points_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,shadow_vert:`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sprite_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`},q={common:{diffuse:{value:new W(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new H},alphaMap:{value:null},alphaMapTransform:{value:new H},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new H}},envmap:{envMap:{value:null},envMapRotation:{value:new H},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new H}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new H}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new H},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new H},normalScale:{value:new B(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new H},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new H}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new H}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new H}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new W(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new V},probesMax:{value:new V},probesResolution:{value:new V}},points:{diffuse:{value:new W(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new H},alphaTest:{value:0},uvTransform:{value:new H}},sprite:{diffuse:{value:new W(16777215)},opacity:{value:1},center:{value:new B(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new H},alphaMap:{value:null},alphaMapTransform:{value:new H},alphaTest:{value:0}}},ka={basic:{uniforms:di([q.common,q.specularmap,q.envmap,q.aomap,q.lightmap,q.fog]),vertexShader:K.meshbasic_vert,fragmentShader:K.meshbasic_frag},lambert:{uniforms:di([q.common,q.specularmap,q.envmap,q.aomap,q.lightmap,q.emissivemap,q.bumpmap,q.normalmap,q.displacementmap,q.fog,q.lights,{emissive:{value:new W(0)},envMapIntensity:{value:1}}]),vertexShader:K.meshlambert_vert,fragmentShader:K.meshlambert_frag},phong:{uniforms:di([q.common,q.specularmap,q.envmap,q.aomap,q.lightmap,q.emissivemap,q.bumpmap,q.normalmap,q.displacementmap,q.fog,q.lights,{emissive:{value:new W(0)},specular:{value:new W(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:K.meshphong_vert,fragmentShader:K.meshphong_frag},standard:{uniforms:di([q.common,q.envmap,q.aomap,q.lightmap,q.emissivemap,q.bumpmap,q.normalmap,q.displacementmap,q.roughnessmap,q.metalnessmap,q.fog,q.lights,{emissive:{value:new W(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:K.meshphysical_vert,fragmentShader:K.meshphysical_frag},toon:{uniforms:di([q.common,q.aomap,q.lightmap,q.emissivemap,q.bumpmap,q.normalmap,q.displacementmap,q.gradientmap,q.fog,q.lights,{emissive:{value:new W(0)}}]),vertexShader:K.meshtoon_vert,fragmentShader:K.meshtoon_frag},matcap:{uniforms:di([q.common,q.bumpmap,q.normalmap,q.displacementmap,q.fog,{matcap:{value:null}}]),vertexShader:K.meshmatcap_vert,fragmentShader:K.meshmatcap_frag},points:{uniforms:di([q.points,q.fog]),vertexShader:K.points_vert,fragmentShader:K.points_frag},dashed:{uniforms:di([q.common,q.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:K.linedashed_vert,fragmentShader:K.linedashed_frag},depth:{uniforms:di([q.common,q.displacementmap]),vertexShader:K.depth_vert,fragmentShader:K.depth_frag},normal:{uniforms:di([q.common,q.bumpmap,q.normalmap,q.displacementmap,{opacity:{value:1}}]),vertexShader:K.meshnormal_vert,fragmentShader:K.meshnormal_frag},sprite:{uniforms:di([q.sprite,q.fog]),vertexShader:K.sprite_vert,fragmentShader:K.sprite_frag},background:{uniforms:{uvTransform:{value:new H},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:K.background_vert,fragmentShader:K.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new H}},vertexShader:K.backgroundCube_vert,fragmentShader:K.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:K.cube_vert,fragmentShader:K.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:K.equirect_vert,fragmentShader:K.equirect_frag},distance:{uniforms:di([q.common,q.displacementmap,{referencePosition:{value:new V},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:K.distance_vert,fragmentShader:K.distance_frag},shadow:{uniforms:di([q.lights,q.fog,{color:{value:new W(0)},opacity:{value:1}}]),vertexShader:K.shadow_vert,fragmentShader:K.shadow_frag}};ka.physical={uniforms:di([ka.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new H},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new H},clearcoatNormalScale:{value:new B(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new H},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new H},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new H},sheen:{value:0},sheenColor:{value:new W(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new H},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new H},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new H},transmissionSamplerSize:{value:new B},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new H},attenuationDistance:{value:0},attenuationColor:{value:new W(0)},specularColor:{value:new W(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new H},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new H},anisotropyVector:{value:new B},anisotropyMap:{value:null},anisotropyMapTransform:{value:new H}}]),vertexShader:K.meshphysical_vert,fragmentShader:K.meshphysical_frag};var Aa={r:0,b:0,g:0},ja=new Nt,Ma=new H;Ma.set(-1,0,0,0,1,0,0,0,1);function Na(e,t,n,r,i,a){let o=new W(0),s=i===!0?0:1,c,l,u=null,d=0,f=null;function p(e){let n=e.isScene===!0?e.background:null;if(n&&n.isTexture){let r=e.backgroundBlurriness>0;n=t.get(n,r)}return n}function m(t){let r=!1,i=p(t);i===null?g(o,s):i&&i.isColor&&(g(i,1),r=!0);let c=e.xr.getEnvironmentBlendMode();c===`additive`?n.buffers.color.setClear(0,0,0,1,a):c===`alpha-blend`&&n.buffers.color.setClear(0,0,0,0,a),(e.autoClear||r)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function h(t,n){let i=p(n);i&&(i.isCubeTexture||i.mapping===306)?(l===void 0&&(l=new G(new ri(1,1,1),new vi({name:`BackgroundCubeMaterial`,uniforms:ui(ka.backgroundCube.uniforms),vertexShader:ka.backgroundCube.vertexShader,fragmentShader:ka.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute(`normal`),l.geometry.deleteAttribute(`uv`),l.onBeforeRender=function(e,t,n){this.matrixWorld.copyPosition(n.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(l)),l.material.uniforms.envMap.value=i,l.material.uniforms.backgroundBlurriness.value=n.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(ja.makeRotationFromEuler(n.backgroundRotation)).transpose(),i.isCubeTexture&&i.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(Ma),l.material.toneMapped=U.getTransfer(i.colorSpace)!==He,(u!==i||d!==i.version||f!==e.toneMapping)&&(l.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),l.layers.enableAll(),t.unshift(l,l.geometry,l.material,0,0,null)):i&&i.isTexture&&(c===void 0&&(c=new G(new si(2,2),new vi({name:`BackgroundMaterial`,uniforms:ui(ka.background.uniforms),vertexShader:ka.background.vertexShader,fragmentShader:ka.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute(`normal`),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=i,c.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,c.material.toneMapped=U.getTransfer(i.colorSpace)!==He,i.matrixAutoUpdate===!0&&i.updateMatrix(),c.material.uniforms.uvTransform.value.copy(i.matrix),(u!==i||d!==i.version||f!==e.toneMapping)&&(c.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),c.layers.enableAll(),t.unshift(c,c.geometry,c.material,0,0,null))}function g(t,r){t.getRGB(Aa,mi(e)),n.buffers.color.setClear(Aa.r,Aa.g,Aa.b,r,a)}function _(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(e,t=1){o.set(e),s=t,g(o,s)},getClearAlpha:function(){return s},setClearAlpha:function(e){s=e,g(o,s)},render:m,addToRenderList:h,dispose:_}}function Pa(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),r={},i=f(null),a=i,o=!1;function s(n,r,i,s,c){let u=!1,f=d(n,s,i,r);a!==f&&(a=f,l(a.object)),u=p(n,s,i,c),u&&m(n,s,i,c),c!==null&&t.update(c,e.ELEMENT_ARRAY_BUFFER),(u||o)&&(o=!1,b(n,r,i,s),c!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(c).buffer))}function c(){return e.createVertexArray()}function l(t){return e.bindVertexArray(t)}function u(t){return e.deleteVertexArray(t)}function d(e,t,n,i){let a=i.wireframe===!0,o=r[t.id];o===void 0&&(o={},r[t.id]=o);let s=e.isInstancedMesh===!0?e.id:0,l=o[s];l===void 0&&(l={},o[s]=l);let u=l[n.id];u===void 0&&(u={},l[n.id]=u);let d=u[a];return d===void 0&&(d=f(c()),u[a]=d),d}function f(e){let t=[],r=[],i=[];for(let e=0;e<n;e++)t[e]=0,r[e]=0,i[e]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:t,enabledAttributes:r,attributeDivisors:i,object:e,attributes:{},index:null}}function p(e,t,n,r){let i=a.attributes,o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=i[t],r=o[t];if(r===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(r=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(r=e.instanceColor)),n===void 0||n.attribute!==r||r&&n.data!==r.data)return!0;s++}return a.attributesNum!==s||a.index!==r}function m(e,t,n,r){let i={},o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=o[t];n===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(n=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(n=e.instanceColor));let r={};r.attribute=n,n&&n.data&&(r.data=n.data),i[t]=r,s++}a.attributes=i,a.attributesNum=s,a.index=r}function h(){let e=a.newAttributes;for(let t=0,n=e.length;t<n;t++)e[t]=0}function g(e){_(e,0)}function _(t,n){let r=a.newAttributes,i=a.enabledAttributes,o=a.attributeDivisors;r[t]=1,i[t]===0&&(e.enableVertexAttribArray(t),i[t]=1),o[t]!==n&&(e.vertexAttribDivisor(t,n),o[t]=n)}function v(){let t=a.newAttributes,n=a.enabledAttributes;for(let r=0,i=n.length;r<i;r++)n[r]!==t[r]&&(e.disableVertexAttribArray(r),n[r]=0)}function y(t,n,r,i,a,o,s){s===!0?e.vertexAttribIPointer(t,n,r,a,o):e.vertexAttribPointer(t,n,r,i,a,o)}function b(n,r,i,a){h();let o=a.attributes,s=i.getAttributes(),c=r.defaultAttributeValues;for(let r in s){let i=s[r];if(i.location>=0){let s=o[r];if(s===void 0&&(r===`instanceMatrix`&&n.instanceMatrix&&(s=n.instanceMatrix),r===`instanceColor`&&n.instanceColor&&(s=n.instanceColor)),s!==void 0){let r=s.normalized,o=s.itemSize,c=t.get(s);if(c===void 0)continue;let l=c.buffer,u=c.type,d=c.bytesPerElement,f=u===e.INT||u===e.UNSIGNED_INT||s.gpuType===1013;if(s.isInterleavedBufferAttribute){let t=s.data,c=t.stride,p=s.offset;if(t.isInstancedInterleavedBuffer){for(let e=0;e<i.locationSize;e++)_(i.location+e,t.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=t.meshPerAttribute*t.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,c*d,(p+o/i.locationSize*e)*d,f)}else{if(s.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,s.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=s.meshPerAttribute*s.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,o*d,o/i.locationSize*e*d,f)}}else if(c!==void 0){let t=c[r];if(t!==void 0)switch(t.length){case 2:e.vertexAttrib2fv(i.location,t);break;case 3:e.vertexAttrib3fv(i.location,t);break;case 4:e.vertexAttrib4fv(i.location,t);break;default:e.vertexAttrib1fv(i.location,t)}}}}v()}function x(){T();for(let e in r){let t=r[e];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e]}}function S(e){if(r[e.id]===void 0)return;let t=r[e.id];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e.id]}function C(e){for(let t in r){let n=r[t];for(let t in n){let r=n[t];if(r[e.id]===void 0)continue;let i=r[e.id];for(let e in i)u(i[e].object),delete i[e];delete r[e.id]}}}function w(e){for(let t in r){let n=r[t],i=e.isInstancedMesh===!0?e.id:0,a=n[i];if(a!==void 0){for(let e in a){let t=a[e];for(let e in t)u(t[e].object),delete t[e];delete a[e]}delete n[i],Object.keys(n).length===0&&delete r[t]}}}function T(){E(),o=!0,a!==i&&(a=i,l(a.object))}function E(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:s,reset:T,resetDefaultState:E,dispose:x,releaseStatesOfGeometry:S,releaseStatesOfObject:w,releaseStatesOfProgram:C,initAttributes:h,enableAttribute:g,disableUnusedAttributes:v}}function Fa(e,t,n){let r;function i(e){r=e}function a(t,i){e.drawArrays(r,t,i),n.update(i,r,1)}function o(t,i,a){a!==0&&(e.drawArraysInstanced(r,t,i,a),n.update(i,r,a))}function s(e,i,a){if(a===0)return;t.get(`WEBGL_multi_draw`).multiDrawArraysWEBGL(r,e,0,i,0,a);let o=0;for(let e=0;e<a;e++)o+=i[e];n.update(o,r,1)}this.setMode=i,this.render=a,this.renderInstances=o,this.renderMultiDraw=s}function Ia(e,t,n,r){let i;function a(){if(i!==void 0)return i;if(t.has(`EXT_texture_filter_anisotropic`)===!0){let n=t.get(`EXT_texture_filter_anisotropic`);i=e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(t){return t===1023||r.convert(t)===e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT)}function s(n){let i=n===1016&&(t.has(`EXT_color_buffer_half_float`)||t.has(`EXT_color_buffer_float`));return!(n!==1009&&r.convert(n)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE)&&n!==1015&&!i)}function c(t){if(t===`highp`){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return`highp`;t=`mediump`}return t===`mediump`&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?`mediump`:`lowp`}let l=n.precision===void 0?`highp`:n.precision,u=c(l);u!==l&&(L(`WebGLRenderer:`,l,`not supported, using`,u,`instead.`),l=u);let d=n.logarithmicDepthBuffer===!0,f=n.reversedDepthBuffer===!0&&t.has(`EXT_clip_control`);n.reversedDepthBuffer===!0&&f===!1&&L(`WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.`);let p=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),m=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),h=e.getParameter(e.MAX_TEXTURE_SIZE),g=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),_=e.getParameter(e.MAX_VERTEX_ATTRIBS),v=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),y=e.getParameter(e.MAX_VARYING_VECTORS),b=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),x=e.getParameter(e.MAX_SAMPLES),S=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:s,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:f,maxTextures:p,maxVertexTextures:m,maxTextureSize:h,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:v,maxVaryings:y,maxFragmentUniforms:b,maxSamples:x,samples:S}}function La(e){let t=this,n=null,r=0,i=!1,a=!1,o=new Br,s=new H,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(e,t){let n=e.length!==0||t||r!==0||i;return i=t,r=e.length,n},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(e,t){n=u(e,t,0)},this.setState=function(t,o,s){let d=t.clippingPlanes,f=t.clipIntersection,p=t.clipShadows,m=e.get(t);if(!i||d===null||d.length===0||a&&!p)a?u(null):l();else{let e=a?0:r,t=e*4,i=m.clippingState||null;c.value=i,i=u(d,o,t,s);for(let e=0;e!==t;++e)i[e]=n[e];m.clippingState=i,this.numIntersection=f?this.numPlanes:0,this.numPlanes+=e}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=r>0),t.numPlanes=r,t.numIntersection=0}function u(e,n,r,i){let a=e===null?0:e.length,l=null;if(a!==0){if(l=c.value,i!==!0||l===null){let t=r+a*4,i=n.matrixWorldInverse;s.getNormalMatrix(i),(l===null||l.length<t)&&(l=new Float32Array(t));for(let t=0,n=r;t!==a;++t,n+=4)o.copy(e[t]).applyMatrix4(i,s),o.normal.toArray(l,n),l[n+3]=o.constant}c.value=l,c.needsUpdate=!0}return t.numPlanes=a,t.numIntersection=0,l}}var Ra=4,za=[.125,.215,.35,.446,.526,.582],Ba=20,Va=256,Ha=new $i,Ua=new W,Wa=null,Ga=0,Ka=0,qa=!1,Ja=new V,Ya=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,r=100,i={}){let{size:a=256,position:o=Ja}=i;Wa=this._renderer.getRenderTarget(),Ga=this._renderer.getActiveCubeFace(),Ka=this._renderer.getActiveMipmapLevel(),qa=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,r,s,o),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=no(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=to(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=2**this._lodMax}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Wa,Ga,Ka),this._renderer.xr.enabled=qa,e.scissorTest=!1,Qa(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Wa=this._renderer.getRenderTarget(),Ga=this._renderer.getActiveCubeFace(),Ka=this._renderer.getActiveMipmapLevel(),qa=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:o,minFilter:o,generateMipmaps:!1,type:g,format:w,colorSpace:I,depthBuffer:!1},r=Za(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Za(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=Xa(r)),this._blurMaterial=eo(r,e,t),this._ggxMaterial=$a(r,e,t)}return r}_compileMaterial(e){let t=new G(new dr,e);this._renderer.compile(t,Ha)}_sceneToCubeUV(e,t,n,r,i){let a=new Xi(90,1,t,n),o=[1,-1,1,1,1,1],s=[1,1,1,-1,-1,-1],c=this._renderer,l=c.autoClear,u=c.toneMapping;c.getClearColor(Ua),c.toneMapping=0,c.autoClear=!1,c.state.buffers.depth.getReversed()&&(c.setRenderTarget(r),c.clearDepth(),c.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new G(new ri,new Sr({name:`PMREM.Background`,side:1,depthWrite:!1,depthTest:!1})));let d=this._backgroundBox,f=d.material,p=!1,m=e.background;m?m.isColor&&(f.color.copy(m),e.background=null,p=!0):(f.color.copy(Ua),p=!0);for(let t=0;t<6;t++){let n=t%3;n===0?(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x+s[t],i.y,i.z)):n===1?(a.up.set(0,0,o[t]),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y+s[t],i.z)):(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y,i.z+s[t]));let l=this._cubeSize;Qa(r,n*l,t>2?l:0,l,l),c.setRenderTarget(r),p&&c.render(d,a),c.render(e,a)}c.toneMapping=u,c.autoClear=l,e.background=m}_textureToCubeUV(e,t){let n=this._renderer,r=e.mapping===301||e.mapping===302;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=no()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=to());let i=r?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=i;let o=i.uniforms;o.envMap.value=e;let s=this._cubeSize;Qa(t,0,0,3*s,2*s),n.setRenderTarget(t),n.render(a,Ha)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let r=this._lodMeshes.length;for(let t=1;t<r;t++)this._applyGGXFilter(e,t-1,t);t.autoClear=n}_applyGGXFilter(e,t,n){let r=this._renderer,i=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let s=a.uniforms,c=n/(this._lodMeshes.length-1),l=t/(this._lodMeshes.length-1),u=Math.sqrt(c*c-l*l)*(0+c*1.25),{_lodMax:d}=this,f=this._sizeLods[n],p=3*f*(n>d-Ra?n-d+Ra:0),m=4*(this._cubeSize-f);s.envMap.value=e.texture,s.roughness.value=u,s.mipInt.value=d-t,Qa(i,p,m,3*f,2*f),r.setRenderTarget(i),r.render(o,Ha),s.envMap.value=i.texture,s.roughness.value=0,s.mipInt.value=d-n,Qa(e,p,m,3*f,2*f),r.setRenderTarget(e),r.render(o,Ha)}_blur(e,t,n,r,i){let a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,r,`latitudinal`,i),this._halfBlur(a,e,n,n,r,`longitudinal`,i)}_halfBlur(e,t,n,r,i,a,o){let s=this._renderer,c=this._blurMaterial;a!==`latitudinal`&&a!==`longitudinal`&&R(`blur direction must be either latitudinal or longitudinal!`);let l=this._lodMeshes[r];l.material=c;let u=c.uniforms,d=this._sizeLods[n]-1,f=isFinite(i)?Math.PI/(2*d):2*Math.PI/39,p=i/f,m=isFinite(i)?1+Math.floor(3*p):Ba;m>Ba&&L(`sigmaRadians, ${i}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Ba}`);let h=[],g=0;for(let e=0;e<Ba;++e){let t=e/p,n=Math.exp(-t*t/2);h.push(n),e===0?g+=n:e<m&&(g+=2*n)}for(let e=0;e<h.length;e++)h[e]=h[e]/g;u.envMap.value=e.texture,u.samples.value=m,u.weights.value=h,u.latitudinal.value=a===`latitudinal`,o&&(u.poleAxis.value=o);let{_lodMax:_}=this;u.dTheta.value=f,u.mipInt.value=_-n;let v=this._sizeLods[r];Qa(t,3*v*(r>_-Ra?r-_+Ra:0),4*(this._cubeSize-v),3*v,2*v),s.setRenderTarget(t),s.render(l,Ha)}};function Xa(e){let t=[],n=[],r=[],i=e,a=e-Ra+1+za.length;for(let o=0;o<a;o++){let a=2**i;t.push(a);let s=1/a;o>e-Ra?s=za[o-e+Ra-1]:o===0&&(s=0),n.push(s);let c=1/(a-2),l=-c,u=1+c,d=[l,l,u,l,u,u,l,l,u,u,l,u],f=new Float32Array(108),p=new Float32Array(72),m=new Float32Array(36);for(let e=0;e<6;e++){let t=e%3*2/3-1,n=e>2?0:-1,r=[t,n,0,t+2/3,n,0,t+2/3,n+1,0,t,n,0,t+2/3,n+1,0,t,n+1,0];f.set(r,18*e),p.set(d,12*e);let i=[e,e,e,e,e,e];m.set(i,6*e)}let h=new dr;h.setAttribute(`position`,new Xn(f,3)),h.setAttribute(`uv`,new Xn(p,2)),h.setAttribute(`faceIndex`,new Xn(m,1)),r.push(new G(h,null)),i>Ra&&i--}return{lodMeshes:r,sizeLods:t,sigmas:n}}function Za(e,t,n){let r=new At(e,t,n);return r.texture.mapping=306,r.texture.name=`PMREM.cubeUv`,r.scissorTest=!0,r}function Qa(e,t,n,r,i){e.viewport.set(t,n,r,i),e.scissor.set(t,n,r,i)}function $a(e,t,n){return new vi({name:`PMREMGGXConvolution`,defines:{GGX_SAMPLES:Va,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:ro(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function eo(e,t,n){let r=new Float32Array(Ba),i=new V(0,1,0);return new vi({name:`SphericalGaussianBlur`,defines:{n:Ba,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:r},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:ro(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function to(){return new vi({name:`EquirectangularToCubeUV`,uniforms:{envMap:{value:null}},vertexShader:ro(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function no(){return new vi({name:`CubemapToCubeUV`,uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ro(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function ro(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}var io=class extends At{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new Qr(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new ri(5,5,5),i=new vi({name:`CubemapFromEquirect`,uniforms:ui(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});i.uniforms.tEquirect.value=t;let a=new G(r,i),s=t.minFilter;return t.minFilter===1008&&(t.minFilter=o),new aa(1,10,this).update(e,a),t.minFilter=s,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){let i=e.getRenderTarget();for(let i=0;i<6;i++)e.setRenderTarget(this,i),e.clear(t,n,r);e.setRenderTarget(i)}};function ao(e){let t=new WeakMap,n=new WeakMap,r=null;function i(e,t=!1){return e==null?null:t?o(e):a(e)}function a(n){if(n&&n.isTexture){let r=n.mapping;if(r===303||r===304){if(t.has(n)){let e=t.get(n).texture;return s(e,n.mapping)}{let r=n.image;if(r&&r.height>0){let i=new io(r.height);return i.fromEquirectangularTexture(e,n),t.set(n,i),n.addEventListener(`dispose`,l),s(i.texture,n.mapping)}return null}}}return n}function o(t){if(t&&t.isTexture){let i=t.mapping,a=i===303||i===304,o=i===301||i===302;if(a||o){let i=n.get(t),s=i===void 0?0:i.texture.pmremVersion;if(t.isRenderTargetTexture&&t.pmremVersion!==s)return r===null&&(r=new Ya(e)),i=a?r.fromEquirectangular(t,i):r.fromCubemap(t,i),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),i.texture;if(i!==void 0)return i.texture;{let s=t.image;return a&&s&&s.height>0||o&&s&&c(s)?(r===null&&(r=new Ya(e)),i=a?r.fromEquirectangular(t):r.fromCubemap(t),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),t.addEventListener(`dispose`,u),i.texture):null}}}return t}function s(e,t){return t===303?e.mapping=301:t===304&&(e.mapping=302),e}function c(e){let t=0;for(let n=0;n<6;n++)e[n]!==void 0&&t++;return t===6}function l(e){let n=e.target;n.removeEventListener(`dispose`,l);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function u(e){let t=e.target;t.removeEventListener(`dispose`,u);let r=n.get(t);r!==void 0&&(n.delete(t),r.dispose())}function d(){t=new WeakMap,n=new WeakMap,r!==null&&(r.dispose(),r=null)}return{get:i,dispose:d}}function oo(e){let t={};function n(n){if(t[n]!==void 0)return t[n];let r=e.getExtension(n);return t[n]=r,r}return{has:function(e){return n(e)!==null},init:function(){n(`EXT_color_buffer_float`),n(`WEBGL_clip_cull_distance`),n(`OES_texture_float_linear`),n(`EXT_color_buffer_half_float`),n(`WEBGL_multisampled_render_to_texture`),n(`WEBGL_render_shared_exponent`)},get:function(e){let t=n(e);return t===null&&$e(`WebGLRenderer: `+e+` extension not supported.`),t}}}function so(e,t,n,r){let i={},a=new WeakMap;function o(e){let s=e.target;s.index!==null&&t.remove(s.index);for(let e in s.attributes)t.remove(s.attributes[e]);s.removeEventListener(`dispose`,o),delete i[s.id];let c=a.get(s);c&&(t.remove(c),a.delete(s)),r.releaseStatesOfGeometry(s),s.isInstancedBufferGeometry===!0&&delete s._maxInstanceCount,n.memory.geometries--}function s(e,t){return i[t.id]===!0?t:(t.addEventListener(`dispose`,o),i[t.id]=!0,n.memory.geometries++,t)}function c(n){let r=n.attributes;for(let n in r)t.update(r[n],e.ARRAY_BUFFER)}function l(e){let n=[],r=e.index,i=e.attributes.position,o=0;if(i===void 0)return;if(r!==null){let e=r.array;o=r.version;for(let t=0,r=e.length;t<r;t+=3){let r=e[t+0],i=e[t+1],a=e[t+2];n.push(r,i,i,a,a,r)}}else{let e=i.array;o=i.version;for(let t=0,r=e.length/3-1;t<r;t+=3){let e=t+0,r=t+1,i=t+2;n.push(e,r,r,i,i,e)}}let s=new(i.count>=65535?Qn:Zn)(n,1);s.version=o;let c=a.get(e);c&&t.remove(c),a.set(e,s)}function u(e){let t=a.get(e);if(t){let n=e.index;n!==null&&t.version<n.version&&l(e)}else l(e);return a.get(e)}return{get:s,update:c,getWireframeAttribute:u}}function co(e,t,n){let r;function i(e){r=e}let a,o;function s(e){a=e.type,o=e.bytesPerElement}function c(t,i){e.drawElements(r,i,a,t*o),n.update(i,r,1)}function l(t,i,s){s!==0&&(e.drawElementsInstanced(r,i,a,t*o,s),n.update(i,r,s))}function u(e,i,o){if(o===0)return;t.get(`WEBGL_multi_draw`).multiDrawElementsWEBGL(r,i,0,a,e,0,o);let s=0;for(let e=0;e<o;e++)s+=i[e];n.update(s,r,1)}this.setMode=i,this.setIndex=s,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function lo(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function r(t,r,i){switch(n.calls++,r){case e.TRIANGLES:n.triangles+=t/3*i;break;case e.LINES:n.lines+=t/2*i;break;case e.LINE_STRIP:n.lines+=i*(t-1);break;case e.LINE_LOOP:n.lines+=i*t;break;case e.POINTS:n.points+=i*t;break;default:R(`WebGLInfo: Unknown draw mode:`,r)}}function i(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:i,update:r}}function uo(e,t,n){let r=new WeakMap,i=new Ot;function a(a,o,s){let c=a.morphTargetInfluences,l=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=l===void 0?0:l.length,d=r.get(o);if(d===void 0||d.count!==u){d!==void 0&&d.texture.dispose();let e=o.morphAttributes.position!==void 0,n=o.morphAttributes.normal!==void 0,a=o.morphAttributes.color!==void 0,s=o.morphAttributes.position||[],c=o.morphAttributes.normal||[],l=o.morphAttributes.color||[],f=0;e===!0&&(f=1),n===!0&&(f=2),a===!0&&(f=3);let p=o.attributes.position.count*f,m=1;p>t.maxTextureSize&&(m=Math.ceil(p/t.maxTextureSize),p=t.maxTextureSize);let g=new Float32Array(p*m*4*u),_=new jt(g,p,m,u);_.type=h,_.needsUpdate=!0;let v=f*4;for(let t=0;t<u;t++){let r=s[t],o=c[t],u=l[t],d=p*m*4*t;for(let t=0;t<r.count;t++){let s=t*v;e===!0&&(i.fromBufferAttribute(r,t),g[d+s+0]=i.x,g[d+s+1]=i.y,g[d+s+2]=i.z,g[d+s+3]=0),n===!0&&(i.fromBufferAttribute(o,t),g[d+s+4]=i.x,g[d+s+5]=i.y,g[d+s+6]=i.z,g[d+s+7]=0),a===!0&&(i.fromBufferAttribute(u,t),g[d+s+8]=i.x,g[d+s+9]=i.y,g[d+s+10]=i.z,g[d+s+11]=u.itemSize===4?i.w:1)}}d={count:u,texture:_,size:new B(p,m)},r.set(o,d);function y(){_.dispose(),r.delete(o),o.removeEventListener(`dispose`,y)}o.addEventListener(`dispose`,y)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)s.getUniforms().setValue(e,`morphTexture`,a.morphTexture,n);else{let t=0;for(let e=0;e<c.length;e++)t+=c[e];let n=o.morphTargetsRelative?1:1-t;s.getUniforms().setValue(e,`morphTargetBaseInfluence`,n),s.getUniforms().setValue(e,`morphTargetInfluences`,c)}s.getUniforms().setValue(e,`morphTargetsTexture`,d.texture,n),s.getUniforms().setValue(e,`morphTargetsTextureSize`,d.size)}return{update:a}}function fo(e,t,n,r,i){let a=new WeakMap;function o(r){let o=i.render.frame,s=r.geometry,l=t.get(r,s);if(a.get(l)!==o&&(t.update(l),a.set(l,o)),r.isInstancedMesh&&(r.hasEventListener(`dispose`,c)===!1&&r.addEventListener(`dispose`,c),a.get(r)!==o&&(n.update(r.instanceMatrix,e.ARRAY_BUFFER),r.instanceColor!==null&&n.update(r.instanceColor,e.ARRAY_BUFFER),a.set(r,o))),r.isSkinnedMesh){let e=r.skeleton;a.get(e)!==o&&(e.update(),a.set(e,o))}return l}function s(){a=new WeakMap}function c(e){let t=e.target;t.removeEventListener(`dispose`,c),r.releaseStatesOfObject(t),n.remove(t.instanceMatrix),t.instanceColor!==null&&n.remove(t.instanceColor)}return{update:o,dispose:s}}var po={1:`LINEAR_TONE_MAPPING`,2:`REINHARD_TONE_MAPPING`,3:`CINEON_TONE_MAPPING`,4:`ACES_FILMIC_TONE_MAPPING`,6:`AGX_TONE_MAPPING`,7:`NEUTRAL_TONE_MAPPING`,5:`CUSTOM_TONE_MAPPING`};function mo(e,t,n,r,i,a){let o=new At(t,n,{type:e,depthBuffer:i,stencilBuffer:a,samples:r?4:0,depthTexture:i?new ei(t,n):void 0}),s=new At(t,n,{type:g,depthBuffer:!1,stencilBuffer:!1}),c=new dr;c.setAttribute(`position`,new $n([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute(`uv`,new $n([0,2,0,0,2,0],2));let l=new yi({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),u=new G(c,l),d=new $i(-1,1,1,-1,0,1),f=null,p=null,m=!1,h,_=null,v=[],y=!1;this.setSize=function(e,t){o.setSize(e,t),s.setSize(e,t);for(let n=0;n<v.length;n++){let r=v[n];r.setSize&&r.setSize(e,t)}},this.setEffects=function(e){v=e,y=v.length>0&&v[0].isRenderPass===!0;let t=o.width,n=o.height;for(let e=0;e<v.length;e++){let r=v[e];r.setSize&&r.setSize(t,n)}},this.begin=function(e,t){if(m||e.toneMapping===0&&v.length===0)return!1;if(_=t,t!==null){let e=t.width,n=t.height;(o.width!==e||o.height!==n)&&this.setSize(e,n)}return y===!1&&e.setRenderTarget(o),h=e.toneMapping,e.toneMapping=0,!0},this.hasRenderPass=function(){return y},this.end=function(e,t){e.toneMapping=h,m=!0;let n=o,r=s;for(let i=0;i<v.length;i++){let a=v[i];if(a.enabled!==!1&&(a.render(e,r,n,t),a.needsSwap!==!1)){let e=n;n=r,r=e}}if(f!==e.outputColorSpace||p!==e.toneMapping){f=e.outputColorSpace,p=e.toneMapping,l.defines={},U.getTransfer(f)===`srgb`&&(l.defines.SRGB_TRANSFER=``);let t=po[p];t&&(l.defines[t]=``),l.needsUpdate=!0}l.uniforms.tDiffuse.value=n.texture,e.setRenderTarget(_),e.render(u,d),_=null,m=!1},this.isCompositing=function(){return m},this.dispose=function(){o.depthTexture&&o.depthTexture.dispose(),o.dispose(),s.dispose(),c.dispose(),l.dispose()}}var ho=new Dt,go=new ei(1,1),_o=new jt,vo=new Mt,yo=new Qr,bo=[],xo=[],So=new Float32Array(16),Co=new Float32Array(9),wo=new Float32Array(4);function To(e,t,n){let r=e[0];if(r<=0||r>0)return e;let i=t*n,a=bo[i];if(a===void 0&&(a=new Float32Array(i),bo[i]=a),t!==0){r.toArray(a,0);for(let r=1,i=0;r!==t;++r)i+=n,e[r].toArray(a,i)}return a}function Eo(e,t){if(e.length!==t.length)return!1;for(let n=0,r=e.length;n<r;n++)if(e[n]!==t[n])return!1;return!0}function Do(e,t){for(let n=0,r=t.length;n<r;n++)e[n]=t[n]}function Oo(e,t){let n=xo[t];n===void 0&&(n=new Int32Array(t),xo[t]=n);for(let r=0;r!==t;++r)n[r]=e.allocateTextureUnit();return n}function ko(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function Ao(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Eo(n,t))return;e.uniform2fv(this.addr,t),Do(n,t)}}function jo(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(Eo(n,t))return;e.uniform3fv(this.addr,t),Do(n,t)}}function Mo(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Eo(n,t))return;e.uniform4fv(this.addr,t),Do(n,t)}}function No(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Eo(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),Do(n,t)}else{if(Eo(n,r))return;wo.set(r),e.uniformMatrix2fv(this.addr,!1,wo),Do(n,r)}}function Po(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Eo(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),Do(n,t)}else{if(Eo(n,r))return;Co.set(r),e.uniformMatrix3fv(this.addr,!1,Co),Do(n,r)}}function Fo(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Eo(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),Do(n,t)}else{if(Eo(n,r))return;So.set(r),e.uniformMatrix4fv(this.addr,!1,So),Do(n,r)}}function Io(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function Lo(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Eo(n,t))return;e.uniform2iv(this.addr,t),Do(n,t)}}function Ro(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Eo(n,t))return;e.uniform3iv(this.addr,t),Do(n,t)}}function zo(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Eo(n,t))return;e.uniform4iv(this.addr,t),Do(n,t)}}function Bo(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function Vo(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Eo(n,t))return;e.uniform2uiv(this.addr,t),Do(n,t)}}function Ho(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Eo(n,t))return;e.uniform3uiv(this.addr,t),Do(n,t)}}function Uo(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Eo(n,t))return;e.uniform4uiv(this.addr,t),Do(n,t)}}function Wo(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;this.type===e.SAMPLER_2D_SHADOW?(go.compareFunction=n.isReversedDepthBuffer()?518:515,a=go):a=ho,n.setTexture2D(t||a,i)}function Go(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture3D(t||vo,i)}function Ko(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTextureCube(t||yo,i)}function qo(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture2DArray(t||_o,i)}function Jo(e){switch(e){case 5126:return ko;case 35664:return Ao;case 35665:return jo;case 35666:return Mo;case 35674:return No;case 35675:return Po;case 35676:return Fo;case 5124:case 35670:return Io;case 35667:case 35671:return Lo;case 35668:case 35672:return Ro;case 35669:case 35673:return zo;case 5125:return Bo;case 36294:return Vo;case 36295:return Ho;case 36296:return Uo;case 35678:case 36198:case 36298:case 36306:case 35682:return Wo;case 35679:case 36299:case 36307:return Go;case 35680:case 36300:case 36308:case 36293:return Ko;case 36289:case 36303:case 36311:case 36292:return qo}}function Yo(e,t){e.uniform1fv(this.addr,t)}function Xo(e,t){let n=To(t,this.size,2);e.uniform2fv(this.addr,n)}function Zo(e,t){let n=To(t,this.size,3);e.uniform3fv(this.addr,n)}function Qo(e,t){let n=To(t,this.size,4);e.uniform4fv(this.addr,n)}function $o(e,t){let n=To(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function es(e,t){let n=To(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function ts(e,t){let n=To(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function ns(e,t){e.uniform1iv(this.addr,t)}function rs(e,t){e.uniform2iv(this.addr,t)}function is(e,t){e.uniform3iv(this.addr,t)}function as(e,t){e.uniform4iv(this.addr,t)}function os(e,t){e.uniform1uiv(this.addr,t)}function ss(e,t){e.uniform2uiv(this.addr,t)}function cs(e,t){e.uniform3uiv(this.addr,t)}function ls(e,t){e.uniform4uiv(this.addr,t)}function us(e,t,n){let r=this.cache,i=t.length,a=Oo(n,i);Eo(r,a)||(e.uniform1iv(this.addr,a),Do(r,a));let o;o=this.type===e.SAMPLER_2D_SHADOW?go:ho;for(let e=0;e!==i;++e)n.setTexture2D(t[e]||o,a[e])}function ds(e,t,n){let r=this.cache,i=t.length,a=Oo(n,i);Eo(r,a)||(e.uniform1iv(this.addr,a),Do(r,a));for(let e=0;e!==i;++e)n.setTexture3D(t[e]||vo,a[e])}function fs(e,t,n){let r=this.cache,i=t.length,a=Oo(n,i);Eo(r,a)||(e.uniform1iv(this.addr,a),Do(r,a));for(let e=0;e!==i;++e)n.setTextureCube(t[e]||yo,a[e])}function ps(e,t,n){let r=this.cache,i=t.length,a=Oo(n,i);Eo(r,a)||(e.uniform1iv(this.addr,a),Do(r,a));for(let e=0;e!==i;++e)n.setTexture2DArray(t[e]||_o,a[e])}function ms(e){switch(e){case 5126:return Yo;case 35664:return Xo;case 35665:return Zo;case 35666:return Qo;case 35674:return $o;case 35675:return es;case 35676:return ts;case 5124:case 35670:return ns;case 35667:case 35671:return rs;case 35668:case 35672:return is;case 35669:case 35673:return as;case 5125:return os;case 36294:return ss;case 36295:return cs;case 36296:return ls;case 35678:case 36198:case 36298:case 36306:case 35682:return us;case 35679:case 36299:case 36307:return ds;case 35680:case 36300:case 36308:case 36293:return fs;case 36289:case 36303:case 36311:case 36292:return ps}}var hs=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Jo(t.type)}},gs=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=ms(t.type)}},_s=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let i=0,a=r.length;i!==a;++i){let a=r[i];a.setValue(e,t[a.id],n)}}},vs=/(\w+)(\])?(\[|\.)?/g;function ys(e,t){e.seq.push(t),e.map[t.id]=t}function bs(e,t,n){let r=e.name,i=r.length;for(vs.lastIndex=0;;){let a=vs.exec(r),o=vs.lastIndex,s=a[1],c=a[2]===`]`,l=a[3];if(c&&(s|=0),l===void 0||l===`[`&&o+2===i){ys(n,l===void 0?new hs(s,e,t):new gs(s,e,t));break}{let e=n.map[s];e===void 0&&(e=new _s(s),ys(n,e)),n=e}}}var xs=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let n=e.getActiveUniform(t,r);bs(n,e.getUniformLocation(t,n.name),this)}let r=[],i=[];for(let t of this.seq)t.type===e.SAMPLER_2D_SHADOW||t.type===e.SAMPLER_CUBE_SHADOW||t.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(t):i.push(t);r.length>0&&(this.seq=r.concat(i))}setValue(e,t,n,r){let i=this.map[t];i!==void 0&&i.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let i=0,a=t.length;i!==a;++i){let a=t[i],o=n[a.id];o.needsUpdate!==!1&&a.setValue(e,o.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,i=e.length;r!==i;++r){let i=e[r];i.id in t&&n.push(i)}return n}};function Ss(e,t,n){let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),r}var Cs=37297,ws=0;function Ts(e,t){let n=e.split(`
`),r=[],i=Math.max(t-6,0),a=Math.min(t+6,n.length);for(let e=i;e<a;e++){let i=e+1;r.push(`${i===t?`>`:` `} ${i}: ${n[e]}`)}return r.join(`
`)}var Es=new H;function Ds(e){U._getMatrix(Es,U.workingColorSpace,e);let t=`mat3( ${Es.elements.map(e=>e.toFixed(4))} )`;switch(U.getTransfer(e)){case Ve:return[t,`LinearTransferOETF`];case He:return[t,`sRGBTransferOETF`];default:return L(`WebGLProgram: Unsupported color space: `,e),[t,`LinearTransferOETF`]}}function Os(e,t,n){let r=e.getShaderParameter(t,e.COMPILE_STATUS),i=(e.getShaderInfoLog(t)||``).trim();if(r&&i===``)return``;let a=/ERROR: 0:(\d+)/.exec(i);if(a){let r=parseInt(a[1]);return n.toUpperCase()+`

`+i+`

`+Ts(e.getShaderSource(t),r)}return i}function ks(e,t){let n=Ds(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,`}`].join(`
`)}var As={1:`Linear`,2:`Reinhard`,3:`Cineon`,4:`ACESFilmic`,6:`AgX`,7:`Neutral`,5:`Custom`};function js(e,t){let n=As[t];return n===void 0?(L(`WebGLProgram: Unsupported toneMapping:`,t),`vec3 `+e+`( vec3 color ) { return LinearToneMapping( color ); }`):`vec3 `+e+`( vec3 color ) { return `+n+`ToneMapping( color ); }`}var Ms=new V;function Ns(){return U.getLuminanceCoefficients(Ms),[`float luminance( const in vec3 rgb ) {`,`	const vec3 weights = vec3( ${Ms.x.toFixed(4)}, ${Ms.y.toFixed(4)}, ${Ms.z.toFixed(4)} );`,`	return dot( weights, rgb );`,`}`].join(`
`)}function Ps(e){return[e.extensionClipCullDistance?`#extension GL_ANGLE_clip_cull_distance : require`:``,e.extensionMultiDraw?`#extension GL_ANGLE_multi_draw : require`:``].filter(Ls).join(`
`)}function Fs(e){let t=[];for(let n in e){let r=e[n];r!==!1&&t.push(`#define `+n+` `+r)}return t.join(`
`)}function Is(e,t){let n={},r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let i=0;i<r;i++){let r=e.getActiveAttrib(t,i),a=r.name,o=1;r.type===e.FLOAT_MAT2&&(o=2),r.type===e.FLOAT_MAT3&&(o=3),r.type===e.FLOAT_MAT4&&(o=4),n[a]={type:r.type,location:e.getAttribLocation(t,a),locationSize:o}}return n}function Ls(e){return e!==``}function Rs(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function zs(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var Bs=/^[ \t]*#include +<([\w\d./]+)>/gm;function Vs(e){return e.replace(Bs,Us)}var Hs=new Map;function Us(e,t){let n=K[t];if(n===void 0){let e=Hs.get(t);if(e!==void 0)n=K[e],L(`WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.`,t,e);else throw Error(`THREE.WebGLProgram: Can not resolve #include <`+t+`>`)}return Vs(n)}var Ws=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Gs(e){return e.replace(Ws,Ks)}function Ks(e,t,n,r){let i=``;for(let e=parseInt(t);e<parseInt(n);e++)i+=r.replace(/\[\s*i\s*\]/g,`[ `+e+` ]`).replace(/UNROLLED_LOOP_INDEX/g,e);return i}function qs(e){let t=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision===`highp`?t+=`
#define HIGH_PRECISION`:e.precision===`mediump`?t+=`
#define MEDIUM_PRECISION`:e.precision===`lowp`&&(t+=`
#define LOW_PRECISION`),t}var Js={1:`SHADOWMAP_TYPE_PCF`,3:`SHADOWMAP_TYPE_VSM`};function Ys(e){return Js[e.shadowMapType]||`SHADOWMAP_TYPE_BASIC`}var Xs={301:`ENVMAP_TYPE_CUBE`,302:`ENVMAP_TYPE_CUBE`,306:`ENVMAP_TYPE_CUBE_UV`};function Zs(e){return e.envMap===!1?`ENVMAP_TYPE_CUBE`:Xs[e.envMapMode]||`ENVMAP_TYPE_CUBE`}var Qs={302:`ENVMAP_MODE_REFRACTION`};function $s(e){return e.envMap===!1?`ENVMAP_MODE_REFLECTION`:Qs[e.envMapMode]||`ENVMAP_MODE_REFLECTION`}var ec={0:`ENVMAP_BLENDING_MULTIPLY`,1:`ENVMAP_BLENDING_MIX`,2:`ENVMAP_BLENDING_ADD`};function tc(e){return e.envMap===!1?`ENVMAP_BLENDING_NONE`:ec[e.combine]||`ENVMAP_BLENDING_NONE`}function nc(e){let t=e.envMapCubeUVHeight;if(t===null)return null;let n=Math.log2(t)-2,r=1/t;return{texelWidth:1/(3*Math.max(2**n,112)),texelHeight:r,maxMip:n}}function rc(e,t,n,r){let i=e.getContext(),a=n.defines,o=n.vertexShader,s=n.fragmentShader,c=Ys(n),l=Zs(n),u=$s(n),d=tc(n),f=nc(n),p=Ps(n),m=Fs(a),h=i.createProgram(),g,_,v=n.glslVersion?`#version `+n.glslVersion+`
`:``;n.isRawShaderMaterial?(g=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(Ls).join(`
`),g.length>0&&(g+=`
`),_=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(Ls).join(`
`),_.length>0&&(_+=`
`)):(g=[qs(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.extensionClipCullDistance?`#define USE_CLIP_DISTANCE`:``,n.batching?`#define USE_BATCHING`:``,n.batchingColor?`#define USE_BATCHING_COLOR`:``,n.instancing?`#define USE_INSTANCING`:``,n.instancingColor?`#define USE_INSTANCING_COLOR`:``,n.instancingMorph?`#define USE_INSTANCING_MORPH`:``,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.map?`#define USE_MAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+u:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.displacementMap?`#define USE_DISPLACEMENTMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.mapUv?`#define MAP_UV `+n.mapUv:``,n.alphaMapUv?`#define ALPHAMAP_UV `+n.alphaMapUv:``,n.lightMapUv?`#define LIGHTMAP_UV `+n.lightMapUv:``,n.aoMapUv?`#define AOMAP_UV `+n.aoMapUv:``,n.emissiveMapUv?`#define EMISSIVEMAP_UV `+n.emissiveMapUv:``,n.bumpMapUv?`#define BUMPMAP_UV `+n.bumpMapUv:``,n.normalMapUv?`#define NORMALMAP_UV `+n.normalMapUv:``,n.displacementMapUv?`#define DISPLACEMENTMAP_UV `+n.displacementMapUv:``,n.metalnessMapUv?`#define METALNESSMAP_UV `+n.metalnessMapUv:``,n.roughnessMapUv?`#define ROUGHNESSMAP_UV `+n.roughnessMapUv:``,n.anisotropyMapUv?`#define ANISOTROPYMAP_UV `+n.anisotropyMapUv:``,n.clearcoatMapUv?`#define CLEARCOATMAP_UV `+n.clearcoatMapUv:``,n.clearcoatNormalMapUv?`#define CLEARCOAT_NORMALMAP_UV `+n.clearcoatNormalMapUv:``,n.clearcoatRoughnessMapUv?`#define CLEARCOAT_ROUGHNESSMAP_UV `+n.clearcoatRoughnessMapUv:``,n.iridescenceMapUv?`#define IRIDESCENCEMAP_UV `+n.iridescenceMapUv:``,n.iridescenceThicknessMapUv?`#define IRIDESCENCE_THICKNESSMAP_UV `+n.iridescenceThicknessMapUv:``,n.sheenColorMapUv?`#define SHEEN_COLORMAP_UV `+n.sheenColorMapUv:``,n.sheenRoughnessMapUv?`#define SHEEN_ROUGHNESSMAP_UV `+n.sheenRoughnessMapUv:``,n.specularMapUv?`#define SPECULARMAP_UV `+n.specularMapUv:``,n.specularColorMapUv?`#define SPECULAR_COLORMAP_UV `+n.specularColorMapUv:``,n.specularIntensityMapUv?`#define SPECULAR_INTENSITYMAP_UV `+n.specularIntensityMapUv:``,n.transmissionMapUv?`#define TRANSMISSIONMAP_UV `+n.transmissionMapUv:``,n.thicknessMapUv?`#define THICKNESSMAP_UV `+n.thicknessMapUv:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexNormals?`#define HAS_NORMAL`:``,n.vertexColors?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.flatShading?`#define FLAT_SHADED`:``,n.skinning?`#define USE_SKINNING`:``,n.morphTargets?`#define USE_MORPHTARGETS`:``,n.morphNormals&&n.flatShading===!1?`#define USE_MORPHNORMALS`:``,n.morphColors?`#define USE_MORPHCOLORS`:``,n.morphTargetsCount>0?`#define MORPHTARGETS_TEXTURE_STRIDE `+n.morphTextureStride:``,n.morphTargetsCount>0?`#define MORPHTARGETS_COUNT `+n.morphTargetsCount:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.sizeAttenuation?`#define USE_SIZEATTENUATION`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 modelMatrix;`,`uniform mat4 modelViewMatrix;`,`uniform mat4 projectionMatrix;`,`uniform mat4 viewMatrix;`,`uniform mat3 normalMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,`#ifdef USE_INSTANCING`,`	attribute mat4 instanceMatrix;`,`#endif`,`#ifdef USE_INSTANCING_COLOR`,`	attribute vec3 instanceColor;`,`#endif`,`#ifdef USE_INSTANCING_MORPH`,`	uniform sampler2D morphTexture;`,`#endif`,`attribute vec3 position;`,`attribute vec3 normal;`,`attribute vec2 uv;`,`#ifdef USE_UV1`,`	attribute vec2 uv1;`,`#endif`,`#ifdef USE_UV2`,`	attribute vec2 uv2;`,`#endif`,`#ifdef USE_UV3`,`	attribute vec2 uv3;`,`#endif`,`#ifdef USE_TANGENT`,`	attribute vec4 tangent;`,`#endif`,`#if defined( USE_COLOR_ALPHA )`,`	attribute vec4 color;`,`#elif defined( USE_COLOR )`,`	attribute vec3 color;`,`#endif`,`#ifdef USE_SKINNING`,`	attribute vec4 skinIndex;`,`	attribute vec4 skinWeight;`,`#endif`,`
`].filter(Ls).join(`
`),_=[qs(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.alphaToCoverage?`#define ALPHA_TO_COVERAGE`:``,n.map?`#define USE_MAP`:``,n.matcap?`#define USE_MATCAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+l:``,n.envMap?`#define `+u:``,n.envMap?`#define `+d:``,f?`#define CUBEUV_TEXEL_WIDTH `+f.texelWidth:``,f?`#define CUBEUV_TEXEL_HEIGHT `+f.texelHeight:``,f?`#define CUBEUV_MAX_MIP `+f.maxMip+`.0`:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.packedNormalMap?`#define USE_PACKED_NORMALMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoat?`#define USE_CLEARCOAT`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.dispersion?`#define USE_DISPERSION`:``,n.iridescence?`#define USE_IRIDESCENCE`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaTest?`#define USE_ALPHATEST`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.sheen?`#define USE_SHEEN`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexColors||n.instancingColor?`#define USE_COLOR`:``,n.vertexAlphas||n.batchingColor?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.gradientMap?`#define USE_GRADIENTMAP`:``,n.flatShading?`#define FLAT_SHADED`:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.premultipliedAlpha?`#define PREMULTIPLIED_ALPHA`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.numLightProbeGrids>0?`#define USE_LIGHT_PROBES_GRID`:``,n.decodeVideoTexture?`#define DECODE_VIDEO_TEXTURE`:``,n.decodeVideoTextureEmissive?`#define DECODE_VIDEO_TEXTURE_EMISSIVE`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 viewMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,n.toneMapping===0?``:`#define TONE_MAPPING`,n.toneMapping===0?``:K.tonemapping_pars_fragment,n.toneMapping===0?``:js(`toneMapping`,n.toneMapping),n.dithering?`#define DITHERING`:``,n.opaque?`#define OPAQUE`:``,K.colorspace_pars_fragment,ks(`linearToOutputTexel`,n.outputColorSpace),Ns(),n.useDepthPacking?`#define DEPTH_PACKING `+n.depthPacking:``,`
`].filter(Ls).join(`
`)),o=Vs(o),o=Rs(o,n),o=zs(o,n),s=Vs(s),s=Rs(s,n),s=zs(s,n),o=Gs(o),s=Gs(s),n.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,g=[p,`#define attribute in`,`#define varying out`,`#define texture2D texture`].join(`
`)+`
`+g,_=[`#define varying in`,n.glslVersion===`300 es`?``:`layout(location = 0) out highp vec4 pc_fragColor;`,n.glslVersion===`300 es`?``:`#define gl_FragColor pc_fragColor`,`#define gl_FragDepthEXT gl_FragDepth`,`#define texture2D texture`,`#define textureCube texture`,`#define texture2DProj textureProj`,`#define texture2DLodEXT textureLod`,`#define texture2DProjLodEXT textureProjLod`,`#define textureCubeLodEXT textureLod`,`#define texture2DGradEXT textureGrad`,`#define texture2DProjGradEXT textureProjGrad`,`#define textureCubeGradEXT textureGrad`].join(`
`)+`
`+_);let y=v+g+o,b=v+_+s,x=Ss(i,i.VERTEX_SHADER,y),S=Ss(i,i.FRAGMENT_SHADER,b);i.attachShader(h,x),i.attachShader(h,S),n.index0AttributeName===void 0?n.hasPositionAttribute===!0&&i.bindAttribLocation(h,0,`position`):i.bindAttribLocation(h,0,n.index0AttributeName),i.linkProgram(h);function C(t){if(e.debug.checkShaderErrors){let n=i.getProgramInfoLog(h)||``,r=i.getShaderInfoLog(x)||``,a=i.getShaderInfoLog(S)||``,o=n.trim(),s=r.trim(),c=a.trim(),l=!0,u=!0;if(i.getProgramParameter(h,i.LINK_STATUS)===!1){if(l=!1,typeof e.debug.onShaderError==`function`)e.debug.onShaderError(i,h,x,S);else{let e=Os(i,x,`vertex`),n=Os(i,S,`fragment`);R(`WebGLProgram: Shader Error `+i.getError()+` - VALIDATE_STATUS `+i.getProgramParameter(h,i.VALIDATE_STATUS)+`

Material Name: `+t.name+`
Material Type: `+t.type+`

Program Info Log: `+o+`
`+e+`
`+n)}}else o===``?(s===``||c===``)&&(u=!1):L(`WebGLProgram: Program Info Log:`,o);u&&(t.diagnostics={runnable:l,programLog:o,vertexShader:{log:s,prefix:g},fragmentShader:{log:c,prefix:_}})}i.deleteShader(x),i.deleteShader(S),w=new xs(i,h),T=Is(i,h)}let w;this.getUniforms=function(){return w===void 0&&C(this),w};let T;this.getAttributes=function(){return T===void 0&&C(this),T};let E=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return E===!1&&(E=i.getProgramParameter(h,Cs)),E},this.destroy=function(){r.releaseStatesOfProgram(this),i.deleteProgram(h),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=ws++,this.cacheKey=t,this.usedTimes=1,this.program=h,this.vertexShader=x,this.fragmentShader=S,this}var ic=0,ac=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(n)===!1&&(r.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let e of t)e.usedTimes--,e.usedTimes===0&&this.shaderCache.delete(e.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new oc(e),t.set(e,n)),n}},oc=class{constructor(e){this.id=ic++,this.code=e,this.usedTimes=0}};function sc(e){return e===1030||e===37490||e===36285}function cc(e,t,n,r,i,a){let o=new Wt,s=new ac,c=new Set,l=[],u=new Map,d=r.logarithmicDepthBuffer,f=r.precision,p={MeshDepthMaterial:`depth`,MeshDistanceMaterial:`distance`,MeshNormalMaterial:`normal`,MeshBasicMaterial:`basic`,MeshLambertMaterial:`lambert`,MeshPhongMaterial:`phong`,MeshToonMaterial:`toon`,MeshStandardMaterial:`physical`,MeshPhysicalMaterial:`physical`,MeshMatcapMaterial:`matcap`,LineBasicMaterial:`basic`,LineDashedMaterial:`dashed`,PointsMaterial:`points`,ShadowMaterial:`shadow`,SpriteMaterial:`sprite`};function m(e){return c.add(e),e===0?`uv`:`uv${e}`}function h(i,o,l,u,h,g){let _=u.fog,v=h.geometry,y=i.isMeshStandardMaterial||i.isMeshLambertMaterial||i.isMeshPhongMaterial?u.environment:null,b=i.isMeshStandardMaterial||i.isMeshLambertMaterial&&!i.envMap||i.isMeshPhongMaterial&&!i.envMap,x=t.get(i.envMap||y,b),S=x&&x.mapping===306?x.image.height:null,C=p[i.type];i.precision!==null&&(f=r.getMaxPrecision(i.precision),f!==i.precision&&L(`WebGLProgram.getParameters:`,i.precision,`not supported, using`,f,`instead.`));let w=v.morphAttributes.position||v.morphAttributes.normal||v.morphAttributes.color,T=w===void 0?0:w.length,E=0;v.morphAttributes.position!==void 0&&(E=1),v.morphAttributes.normal!==void 0&&(E=2),v.morphAttributes.color!==void 0&&(E=3);let D,ee,te,O;if(C){let e=ka[C];D=e.vertexShader,ee=e.fragmentShader}else{D=i.vertexShader,ee=i.fragmentShader;let e=s.getVertexShaderStage(i),t=s.getFragmentShaderStage(i);s.update(i,e,t),te=e.id,O=t.id}let ne=e.getRenderTarget(),k=e.state.buffers.depth.getReversed(),A=h.isInstancedMesh===!0,re=h.isBatchedMesh===!0,ie=!!i.map,j=!!i.matcap,ae=!!x,oe=!!i.aoMap,se=!!i.lightMap,ce=!!i.bumpMap&&i.wireframe===!1,le=!!i.normalMap,ue=!!i.displacementMap,de=!!i.emissiveMap,M=!!i.metalnessMap,fe=!!i.roughnessMap,pe=i.anisotropy>0,me=i.clearcoat>0,he=i.dispersion>0,ge=i.iridescence>0,_e=i.sheen>0,ve=i.transmission>0,ye=pe&&!!i.anisotropyMap,be=me&&!!i.clearcoatMap,xe=me&&!!i.clearcoatNormalMap,Se=me&&!!i.clearcoatRoughnessMap,Ce=ge&&!!i.iridescenceMap,we=ge&&!!i.iridescenceThicknessMap,Te=_e&&!!i.sheenColorMap,Ee=_e&&!!i.sheenRoughnessMap,De=!!i.specularMap,Oe=!!i.specularColorMap,ke=!!i.specularIntensityMap,Ae=ve&&!!i.transmissionMap,je=ve&&!!i.thicknessMap,Me=!!i.gradientMap,Ne=!!i.alphaMap,Pe=i.alphaTest>0,Fe=!!i.alphaHash,N=!!i.extensions,Ie=0;i.toneMapped&&(ne===null||ne.isXRRenderTarget===!0)&&(Ie=e.toneMapping);let Le={shaderID:C,shaderType:i.type,shaderName:i.name,vertexShader:D,fragmentShader:ee,defines:i.defines,customVertexShaderID:te,customFragmentShaderID:O,isRawShaderMaterial:i.isRawShaderMaterial===!0,glslVersion:i.glslVersion,precision:f,batching:re,batchingColor:re&&h._colorsTexture!==null,instancing:A,instancingColor:A&&h.instanceColor!==null,instancingMorph:A&&h.morphTexture!==null,outputColorSpace:ne===null?e.outputColorSpace:ne.isXRRenderTarget===!0?ne.texture.colorSpace:U.workingColorSpace,alphaToCoverage:!!i.alphaToCoverage,map:ie,matcap:j,envMap:ae,envMapMode:ae&&x.mapping,envMapCubeUVHeight:S,aoMap:oe,lightMap:se,bumpMap:ce,normalMap:le,displacementMap:ue,emissiveMap:de,normalMapObjectSpace:le&&i.normalMapType===1,normalMapTangentSpace:le&&i.normalMapType===0,packedNormalMap:le&&i.normalMapType===0&&sc(i.normalMap.format),metalnessMap:M,roughnessMap:fe,anisotropy:pe,anisotropyMap:ye,clearcoat:me,clearcoatMap:be,clearcoatNormalMap:xe,clearcoatRoughnessMap:Se,dispersion:he,iridescence:ge,iridescenceMap:Ce,iridescenceThicknessMap:we,sheen:_e,sheenColorMap:Te,sheenRoughnessMap:Ee,specularMap:De,specularColorMap:Oe,specularIntensityMap:ke,transmission:ve,transmissionMap:Ae,thicknessMap:je,gradientMap:Me,opaque:i.transparent===!1&&i.blending===1&&i.alphaToCoverage===!1,alphaMap:Ne,alphaTest:Pe,alphaHash:Fe,combine:i.combine,mapUv:ie&&m(i.map.channel),aoMapUv:oe&&m(i.aoMap.channel),lightMapUv:se&&m(i.lightMap.channel),bumpMapUv:ce&&m(i.bumpMap.channel),normalMapUv:le&&m(i.normalMap.channel),displacementMapUv:ue&&m(i.displacementMap.channel),emissiveMapUv:de&&m(i.emissiveMap.channel),metalnessMapUv:M&&m(i.metalnessMap.channel),roughnessMapUv:fe&&m(i.roughnessMap.channel),anisotropyMapUv:ye&&m(i.anisotropyMap.channel),clearcoatMapUv:be&&m(i.clearcoatMap.channel),clearcoatNormalMapUv:xe&&m(i.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Se&&m(i.clearcoatRoughnessMap.channel),iridescenceMapUv:Ce&&m(i.iridescenceMap.channel),iridescenceThicknessMapUv:we&&m(i.iridescenceThicknessMap.channel),sheenColorMapUv:Te&&m(i.sheenColorMap.channel),sheenRoughnessMapUv:Ee&&m(i.sheenRoughnessMap.channel),specularMapUv:De&&m(i.specularMap.channel),specularColorMapUv:Oe&&m(i.specularColorMap.channel),specularIntensityMapUv:ke&&m(i.specularIntensityMap.channel),transmissionMapUv:Ae&&m(i.transmissionMap.channel),thicknessMapUv:je&&m(i.thicknessMap.channel),alphaMapUv:Ne&&m(i.alphaMap.channel),vertexTangents:!!v.attributes.tangent&&(le||pe),vertexNormals:!!v.attributes.normal,vertexColors:i.vertexColors,vertexAlphas:i.vertexColors===!0&&!!v.attributes.color&&v.attributes.color.itemSize===4,pointsUvs:h.isPoints===!0&&!!v.attributes.uv&&(ie||Ne),fog:!!_,useFog:i.fog===!0,fogExp2:!!_&&_.isFogExp2,flatShading:i.wireframe===!1&&(i.flatShading===!0||v.attributes.normal===void 0&&le===!1&&(i.isMeshLambertMaterial||i.isMeshPhongMaterial||i.isMeshStandardMaterial||i.isMeshPhysicalMaterial)),sizeAttenuation:i.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:k,skinning:h.isSkinnedMesh===!0,hasPositionAttribute:v.attributes.position!==void 0,morphTargets:v.morphAttributes.position!==void 0,morphNormals:v.morphAttributes.normal!==void 0,morphColors:v.morphAttributes.color!==void 0,morphTargetsCount:T,morphTextureStride:E,numDirLights:o.directional.length,numPointLights:o.point.length,numSpotLights:o.spot.length,numSpotLightMaps:o.spotLightMap.length,numRectAreaLights:o.rectArea.length,numHemiLights:o.hemi.length,numDirLightShadows:o.directionalShadowMap.length,numPointLightShadows:o.pointShadowMap.length,numSpotLightShadows:o.spotShadowMap.length,numSpotLightShadowsWithMaps:o.numSpotLightShadowsWithMaps,numLightProbes:o.numLightProbes,numLightProbeGrids:g.length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:i.dithering,shadowMapEnabled:e.shadowMap.enabled&&l.length>0,shadowMapType:e.shadowMap.type,toneMapping:Ie,decodeVideoTexture:ie&&i.map.isVideoTexture===!0&&U.getTransfer(i.map.colorSpace)===`srgb`,decodeVideoTextureEmissive:de&&i.emissiveMap.isVideoTexture===!0&&U.getTransfer(i.emissiveMap.colorSpace)===`srgb`,premultipliedAlpha:i.premultipliedAlpha,doubleSided:i.side===2,flipSided:i.side===1,useDepthPacking:i.depthPacking>=0,depthPacking:i.depthPacking||0,index0AttributeName:i.index0AttributeName,extensionClipCullDistance:N&&i.extensions.clipCullDistance===!0&&n.has(`WEBGL_clip_cull_distance`),extensionMultiDraw:(N&&i.extensions.multiDraw===!0||re)&&n.has(`WEBGL_multi_draw`),rendererExtensionParallelShaderCompile:n.has(`KHR_parallel_shader_compile`),customProgramCacheKey:i.customProgramCacheKey()};return Le.vertexUv1s=c.has(1),Le.vertexUv2s=c.has(2),Le.vertexUv3s=c.has(3),c.clear(),Le}function g(t){let n=[];if(t.shaderID?n.push(t.shaderID):(n.push(t.customVertexShaderID),n.push(t.customFragmentShaderID)),t.defines!==void 0)for(let e in t.defines)n.push(e),n.push(t.defines[e]);return t.isRawShaderMaterial===!1&&(_(n,t),v(n,t),n.push(e.outputColorSpace)),n.push(t.customProgramCacheKey),n.join()}function _(e,t){e.push(t.precision),e.push(t.outputColorSpace),e.push(t.envMapMode),e.push(t.envMapCubeUVHeight),e.push(t.mapUv),e.push(t.alphaMapUv),e.push(t.lightMapUv),e.push(t.aoMapUv),e.push(t.bumpMapUv),e.push(t.normalMapUv),e.push(t.displacementMapUv),e.push(t.emissiveMapUv),e.push(t.metalnessMapUv),e.push(t.roughnessMapUv),e.push(t.anisotropyMapUv),e.push(t.clearcoatMapUv),e.push(t.clearcoatNormalMapUv),e.push(t.clearcoatRoughnessMapUv),e.push(t.iridescenceMapUv),e.push(t.iridescenceThicknessMapUv),e.push(t.sheenColorMapUv),e.push(t.sheenRoughnessMapUv),e.push(t.specularMapUv),e.push(t.specularColorMapUv),e.push(t.specularIntensityMapUv),e.push(t.transmissionMapUv),e.push(t.thicknessMapUv),e.push(t.combine),e.push(t.fogExp2),e.push(t.sizeAttenuation),e.push(t.morphTargetsCount),e.push(t.morphAttributeCount),e.push(t.numDirLights),e.push(t.numPointLights),e.push(t.numSpotLights),e.push(t.numSpotLightMaps),e.push(t.numHemiLights),e.push(t.numRectAreaLights),e.push(t.numDirLightShadows),e.push(t.numPointLightShadows),e.push(t.numSpotLightShadows),e.push(t.numSpotLightShadowsWithMaps),e.push(t.numLightProbes),e.push(t.shadowMapType),e.push(t.toneMapping),e.push(t.numClippingPlanes),e.push(t.numClipIntersection),e.push(t.depthPacking)}function v(e,t){o.disableAll(),t.instancing&&o.enable(0),t.instancingColor&&o.enable(1),t.instancingMorph&&o.enable(2),t.matcap&&o.enable(3),t.envMap&&o.enable(4),t.normalMapObjectSpace&&o.enable(5),t.normalMapTangentSpace&&o.enable(6),t.clearcoat&&o.enable(7),t.iridescence&&o.enable(8),t.alphaTest&&o.enable(9),t.vertexColors&&o.enable(10),t.vertexAlphas&&o.enable(11),t.vertexUv1s&&o.enable(12),t.vertexUv2s&&o.enable(13),t.vertexUv3s&&o.enable(14),t.vertexTangents&&o.enable(15),t.anisotropy&&o.enable(16),t.alphaHash&&o.enable(17),t.batching&&o.enable(18),t.dispersion&&o.enable(19),t.batchingColor&&o.enable(20),t.gradientMap&&o.enable(21),t.packedNormalMap&&o.enable(22),t.vertexNormals&&o.enable(23),e.push(o.mask),o.disableAll(),t.fog&&o.enable(0),t.useFog&&o.enable(1),t.flatShading&&o.enable(2),t.logarithmicDepthBuffer&&o.enable(3),t.reversedDepthBuffer&&o.enable(4),t.skinning&&o.enable(5),t.morphTargets&&o.enable(6),t.morphNormals&&o.enable(7),t.morphColors&&o.enable(8),t.premultipliedAlpha&&o.enable(9),t.shadowMapEnabled&&o.enable(10),t.doubleSided&&o.enable(11),t.flipSided&&o.enable(12),t.useDepthPacking&&o.enable(13),t.dithering&&o.enable(14),t.transmission&&o.enable(15),t.sheen&&o.enable(16),t.opaque&&o.enable(17),t.pointsUvs&&o.enable(18),t.decodeVideoTexture&&o.enable(19),t.decodeVideoTextureEmissive&&o.enable(20),t.alphaToCoverage&&o.enable(21),t.numLightProbeGrids>0&&o.enable(22),t.hasPositionAttribute&&o.enable(23),e.push(o.mask)}function y(e){let t=p[e.type],n;if(t){let e=ka[t];n=hi.clone(e.uniforms)}else n=e.uniforms;return n}function b(t,n){let r=u.get(n);return r===void 0?(r=new rc(e,n,t,i),l.push(r),u.set(n,r)):++r.usedTimes,r}function x(e){if(--e.usedTimes===0){let t=l.indexOf(e);l[t]=l[l.length-1],l.pop(),u.delete(e.cacheKey),e.destroy()}}function S(e){s.remove(e)}function C(){s.dispose()}return{getParameters:h,getProgramCacheKey:g,getUniforms:y,acquireProgram:b,releaseProgram:x,releaseShaderCache:S,programs:l,dispose:C}}function lc(){let e=new WeakMap;function t(t){return e.has(t)}function n(t){let n=e.get(t);return n===void 0&&(n={},e.set(t,n)),n}function r(t){e.delete(t)}function i(t,n,r){e.get(t)[n]=r}function a(){e=new WeakMap}return{has:t,get:n,remove:r,update:i,dispose:a}}function uc(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.material.id===t.material.id?e.materialVariant===t.materialVariant?e.z===t.z?e.id-t.id:e.z-t.z:e.materialVariant-t.materialVariant:e.material.id-t.material.id:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function dc(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.z===t.z?e.id-t.id:t.z-e.z:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function fc(){let e=[],t=0,n=[],r=[],i=[];function a(){t=0,n.length=0,r.length=0,i.length=0}function o(e){let t=0;return e.isInstancedMesh&&(t+=2),e.isSkinnedMesh&&(t+=1),t}function s(n,r,i,a,s,c){let l=e[t];return l===void 0?(l={id:n.id,object:n,geometry:r,material:i,materialVariant:o(n),groupOrder:a,renderOrder:n.renderOrder,z:s,group:c},e[t]=l):(l.id=n.id,l.object=n,l.geometry=r,l.material=i,l.materialVariant=o(n),l.groupOrder=a,l.renderOrder=n.renderOrder,l.z=s,l.group=c),t++,l}function c(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.push(u):a.transparent===!0?i.push(u):n.push(u)}function l(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.unshift(u):a.transparent===!0?i.unshift(u):n.unshift(u)}function u(e,t,a){n.length>1&&n.sort(e||uc),r.length>1&&r.sort(t||dc),i.length>1&&i.sort(t||dc),a&&(n.reverse(),r.reverse(),i.reverse())}function d(){for(let n=t,r=e.length;n<r;n++){let t=e[n];if(t.id===null)break;t.id=null,t.object=null,t.geometry=null,t.material=null,t.group=null}}return{opaque:n,transmissive:r,transparent:i,init:a,push:c,unshift:l,finish:d,sort:u}}function pc(){let e=new WeakMap;function t(t,n){let r=e.get(t),i;return r===void 0?(i=new fc,e.set(t,[i])):n>=r.length?(i=new fc,r.push(i)):i=r[n],i}function n(){e=new WeakMap}return{get:t,dispose:n}}function mc(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`DirectionalLight`:n={direction:new V,color:new W};break;case`SpotLight`:n={position:new V,direction:new V,color:new W,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case`PointLight`:n={position:new V,color:new W,distance:0,decay:0};break;case`HemisphereLight`:n={direction:new V,skyColor:new W,groundColor:new W};break;case`RectAreaLight`:n={color:new W,position:new V,halfWidth:new V,halfHeight:new V}}return e[t.id]=n,n}}}function hc(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`DirectionalLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new B};break;case`SpotLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new B};break;case`PointLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new B,shadowCameraNear:1,shadowCameraFar:1e3}}return e[t.id]=n,n}}}var gc=0;function _c(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+ +!!t.map-!!e.map}function vc(e){let t=new mc,n=hc(),r={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let e=0;e<9;e++)r.probe.push(new V);let i=new V,a=new Nt,o=new Nt;function s(i){let a=0,o=0,s=0;for(let e=0;e<9;e++)r.probe[e].set(0,0,0);let c=0,l=0,u=0,d=0,f=0,p=0,m=0,h=0,g=0,_=0,v=0;i.sort(_c);for(let e=0,y=i.length;e<y;e++){let y=i[e],b=y.color,x=y.intensity,S=y.distance,C=null;if(y.shadow&&y.shadow.map&&(C=y.shadow.map.texture.format===1030?y.shadow.map.texture:y.shadow.map.depthTexture||y.shadow.map.texture),y.isAmbientLight)a+=b.r*x,o+=b.g*x,s+=b.b*x;else if(y.isLightProbe){for(let e=0;e<9;e++)r.probe[e].addScaledVector(y.sh.coefficients[e],x);v++}else if(y.isDirectionalLight){let e=t.get(y);if(e.color.copy(y.color).multiplyScalar(y.intensity),y.castShadow){let e=y.shadow,t=n.get(y);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,r.directionalShadow[c]=t,r.directionalShadowMap[c]=C,r.directionalShadowMatrix[c]=y.shadow.matrix,p++}r.directional[c]=e,c++}else if(y.isSpotLight){let e=t.get(y);e.position.setFromMatrixPosition(y.matrixWorld),e.color.copy(b).multiplyScalar(x),e.distance=S,e.coneCos=Math.cos(y.angle),e.penumbraCos=Math.cos(y.angle*(1-y.penumbra)),e.decay=y.decay,r.spot[u]=e;let i=y.shadow;if(y.map&&(r.spotLightMap[g]=y.map,g++,i.updateMatrices(y),y.castShadow&&_++),r.spotLightMatrix[u]=i.matrix,y.castShadow){let e=n.get(y);e.shadowIntensity=i.intensity,e.shadowBias=i.bias,e.shadowNormalBias=i.normalBias,e.shadowRadius=i.radius,e.shadowMapSize=i.mapSize,r.spotShadow[u]=e,r.spotShadowMap[u]=C,h++}u++}else if(y.isRectAreaLight){let e=t.get(y);e.color.copy(b).multiplyScalar(x),e.halfWidth.set(y.width*.5,0,0),e.halfHeight.set(0,y.height*.5,0),r.rectArea[d]=e,d++}else if(y.isPointLight){let e=t.get(y);if(e.color.copy(y.color).multiplyScalar(y.intensity),e.distance=y.distance,e.decay=y.decay,y.castShadow){let e=y.shadow,t=n.get(y);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,t.shadowCameraNear=e.camera.near,t.shadowCameraFar=e.camera.far,r.pointShadow[l]=t,r.pointShadowMap[l]=C,r.pointShadowMatrix[l]=y.shadow.matrix,m++}r.point[l]=e,l++}else if(y.isHemisphereLight){let e=t.get(y);e.skyColor.copy(y.color).multiplyScalar(x),e.groundColor.copy(y.groundColor).multiplyScalar(x),r.hemi[f]=e,f++}}d>0&&(e.has(`OES_texture_float_linear`)===!0?(r.rectAreaLTC1=q.LTC_FLOAT_1,r.rectAreaLTC2=q.LTC_FLOAT_2):(r.rectAreaLTC1=q.LTC_HALF_1,r.rectAreaLTC2=q.LTC_HALF_2)),r.ambient[0]=a,r.ambient[1]=o,r.ambient[2]=s;let y=r.hash;(y.directionalLength!==c||y.pointLength!==l||y.spotLength!==u||y.rectAreaLength!==d||y.hemiLength!==f||y.numDirectionalShadows!==p||y.numPointShadows!==m||y.numSpotShadows!==h||y.numSpotMaps!==g||y.numLightProbes!==v)&&(r.directional.length=c,r.spot.length=u,r.rectArea.length=d,r.point.length=l,r.hemi.length=f,r.directionalShadow.length=p,r.directionalShadowMap.length=p,r.pointShadow.length=m,r.pointShadowMap.length=m,r.spotShadow.length=h,r.spotShadowMap.length=h,r.directionalShadowMatrix.length=p,r.pointShadowMatrix.length=m,r.spotLightMatrix.length=h+g-_,r.spotLightMap.length=g,r.numSpotLightShadowsWithMaps=_,r.numLightProbes=v,y.directionalLength=c,y.pointLength=l,y.spotLength=u,y.rectAreaLength=d,y.hemiLength=f,y.numDirectionalShadows=p,y.numPointShadows=m,y.numSpotShadows=h,y.numSpotMaps=g,y.numLightProbes=v,r.version=gc++)}function c(e,t){let n=0,s=0,c=0,l=0,u=0,d=t.matrixWorldInverse;for(let t=0,f=e.length;t<f;t++){let f=e[t];if(f.isDirectionalLight){let e=r.directional[n];e.direction.setFromMatrixPosition(f.matrixWorld),i.setFromMatrixPosition(f.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(d),n++}else if(f.isSpotLight){let e=r.spot[c];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),e.direction.setFromMatrixPosition(f.matrixWorld),i.setFromMatrixPosition(f.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(d),c++}else if(f.isRectAreaLight){let e=r.rectArea[l];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),o.identity(),a.copy(f.matrixWorld),a.premultiply(d),o.extractRotation(a),e.halfWidth.set(f.width*.5,0,0),e.halfHeight.set(0,f.height*.5,0),e.halfWidth.applyMatrix4(o),e.halfHeight.applyMatrix4(o),l++}else if(f.isPointLight){let e=r.point[s];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),s++}else if(f.isHemisphereLight){let e=r.hemi[u];e.direction.setFromMatrixPosition(f.matrixWorld),e.direction.transformDirection(d),u++}}}return{setup:s,setupView:c,state:r}}function yc(e){let t=new vc(e),n=[],r=[],i=[];function a(e){d.camera=e,n.length=0,r.length=0,i.length=0}function o(e){n.push(e)}function s(e){r.push(e)}function c(e){i.push(e)}function l(){t.setup(n)}function u(e){t.setupView(n,e)}let d={lightsArray:n,shadowsArray:r,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:d,setupLights:l,setupLightsView:u,pushLight:o,pushShadow:s,pushLightProbeGrid:c}}function bc(e){let t=new WeakMap;function n(n,r=0){let i=t.get(n),a;return i===void 0?(a=new yc(e),t.set(n,[a])):r>=i.length?(a=new yc(e),i.push(a)):a=i[r],a}function r(){t=new WeakMap}return{get:n,dispose:r}}var xc=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Sc=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,Cc=[new V(1,0,0),new V(-1,0,0),new V(0,1,0),new V(0,-1,0),new V(0,0,1),new V(0,0,-1)],wc=[new V(0,-1,0),new V(0,-1,0),new V(0,0,1),new V(0,0,-1),new V(0,-1,0),new V(0,-1,0)],Tc=new Nt,Ec=new V,Dc=new V;function Oc(e,t,n){let i=new Wr,a=new B,s=new B,c=new Ot,l=new xi,u=new Si,d={},f=n.maxTextureSize,p={0:1,1:0,2:2},_=new vi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new B},radius:{value:4}},vertexShader:xc,fragmentShader:Sc}),v=_.clone();v.defines.HORIZONTAL_PASS=1;let y=new dr;y.setAttribute(`position`,new Xn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let b=new G(y,_),x=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let S=this.type;this.render=function(t,n,l){if(x.enabled===!1||x.autoUpdate===!1&&x.needsUpdate===!1||t.length===0)return;this.type===2&&(L(`WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead.`),this.type=1);let u=e.getRenderTarget(),d=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),_=e.state;_.setBlending(0),_.buffers.depth.getReversed()===!0?_.buffers.color.setClear(0,0,0,0):_.buffers.color.setClear(1,1,1,1),_.buffers.depth.setTest(!0),_.setScissorTest(!1);let v=S!==this.type;v&&n.traverse(function(e){e.material&&(Array.isArray(e.material)?e.material.forEach(e=>e.needsUpdate=!0):e.material.needsUpdate=!0)});for(let u=0,d=t.length;u<d;u++){let d=t[u],p=d.shadow;if(p===void 0){L(`WebGLShadowMap:`,d,`has no shadow.`);continue}if(p.autoUpdate===!1&&p.needsUpdate===!1)continue;a.copy(p.mapSize);let y=p.getFrameExtents();a.multiply(y),s.copy(p.mapSize),(a.x>f||a.y>f)&&(a.x>f&&(s.x=Math.floor(f/y.x),a.x=s.x*y.x,p.mapSize.x=s.x),a.y>f&&(s.y=Math.floor(f/y.y),a.y=s.y*y.y,p.mapSize.y=s.y));let b=e.state.buffers.depth.getReversed();if(p.camera._reversedDepth=b,p.map===null||v===!0){if(p.map!==null&&(p.map.depthTexture!==null&&(p.map.depthTexture.dispose(),p.map.depthTexture=null),p.map.dispose()),this.type===3){if(d.isPointLight){L(`WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.`);continue}p.map=new At(a.x,a.y,{format:te,type:g,minFilter:o,magFilter:o,generateMipmaps:!1}),p.map.texture.name=d.name+`.shadowMap`,p.map.depthTexture=new ei(a.x,a.y,h),p.map.depthTexture.name=d.name+`.shadowMapDepth`,p.map.depthTexture.format=T,p.map.depthTexture.compareFunction=null,p.map.depthTexture.minFilter=r,p.map.depthTexture.magFilter=r}else d.isPointLight?(p.map=new io(a.x),p.map.depthTexture=new ti(a.x,m)):(p.map=new At(a.x,a.y),p.map.depthTexture=new ei(a.x,a.y,m)),p.map.depthTexture.name=d.name+`.shadowMap`,p.map.depthTexture.format=T,this.type===1?(p.map.depthTexture.compareFunction=b?518:515,p.map.depthTexture.minFilter=o,p.map.depthTexture.magFilter=o):(p.map.depthTexture.compareFunction=null,p.map.depthTexture.minFilter=r,p.map.depthTexture.magFilter=r);p.camera.updateProjectionMatrix()}let x=p.map.isWebGLCubeRenderTarget?6:1;for(let t=0;t<x;t++){if(p.map.isWebGLCubeRenderTarget)e.setRenderTarget(p.map,t),e.clear();else{t===0&&(e.setRenderTarget(p.map),e.clear());let n=p.getViewport(t);c.set(s.x*n.x,s.y*n.y,s.x*n.z,s.y*n.w),_.viewport(c)}if(d.isPointLight){let e=p.camera,n=p.matrix,r=d.distance||e.far;r!==e.far&&(e.far=r,e.updateProjectionMatrix()),Ec.setFromMatrixPosition(d.matrixWorld),e.position.copy(Ec),Dc.copy(e.position),Dc.add(Cc[t]),e.up.copy(wc[t]),e.lookAt(Dc),e.updateMatrixWorld(),n.makeTranslation(-Ec.x,-Ec.y,-Ec.z),Tc.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),p._frustum.setFromProjectionMatrix(Tc,e.coordinateSystem,e.reversedDepth)}else p.updateMatrices(d);i=p.getFrustum(),E(n,l,p.camera,d,this.type)}p.isPointLightShadow!==!0&&this.type===3&&C(p,l),p.needsUpdate=!1}S=this.type,x.needsUpdate=!1,e.setRenderTarget(u,d,p)};function C(n,r){let i=t.update(b);_.defines.VSM_SAMPLES!==n.blurSamples&&(_.defines.VSM_SAMPLES=n.blurSamples,v.defines.VSM_SAMPLES=n.blurSamples,_.needsUpdate=!0,v.needsUpdate=!0),n.mapPass===null&&(n.mapPass=new At(a.x,a.y,{format:te,type:g})),_.uniforms.shadow_pass.value=n.map.depthTexture,_.uniforms.resolution.value=n.mapSize,_.uniforms.radius.value=n.radius,e.setRenderTarget(n.mapPass),e.clear(),e.renderBufferDirect(r,null,i,_,b,null),v.uniforms.shadow_pass.value=n.mapPass.texture,v.uniforms.resolution.value=n.mapSize,v.uniforms.radius.value=n.radius,e.setRenderTarget(n.map),e.clear(),e.renderBufferDirect(r,null,i,v,b,null)}function w(t,n,r,i){let a=null,o=r.isPointLight===!0?t.customDistanceMaterial:t.customDepthMaterial;if(o!==void 0)a=o;else if(a=r.isPointLight===!0?u:l,e.localClippingEnabled&&n.clipShadows===!0&&Array.isArray(n.clippingPlanes)&&n.clippingPlanes.length!==0||n.displacementMap&&n.displacementScale!==0||n.alphaMap&&n.alphaTest>0||n.map&&n.alphaTest>0||n.alphaToCoverage===!0){let e=a.uuid,t=n.uuid,r=d[e];r===void 0&&(r={},d[e]=r);let i=r[t];i===void 0&&(i=a.clone(),r[t]=i,n.addEventListener(`dispose`,D)),a=i}if(a.visible=n.visible,a.wireframe=n.wireframe,i===3?a.side=n.shadowSide===null?n.side:n.shadowSide:a.side=n.shadowSide===null?p[n.side]:n.shadowSide,a.alphaMap=n.alphaMap,a.alphaTest=n.alphaToCoverage===!0?.5:n.alphaTest,a.map=n.map,a.clipShadows=n.clipShadows,a.clippingPlanes=n.clippingPlanes,a.clipIntersection=n.clipIntersection,a.displacementMap=n.displacementMap,a.displacementScale=n.displacementScale,a.displacementBias=n.displacementBias,a.wireframeLinewidth=n.wireframeLinewidth,a.linewidth=n.linewidth,r.isPointLight===!0&&a.isMeshDistanceMaterial===!0){let t=e.properties.get(a);t.light=r}return a}function E(n,r,a,o,s){if(n.visible===!1)return;if(n.layers.test(r.layers)&&(n.isMesh||n.isLine||n.isPoints)&&(n.castShadow||n.receiveShadow&&s===3)&&(!n.frustumCulled||i.intersectsObject(n))){n.modelViewMatrix.multiplyMatrices(a.matrixWorldInverse,n.matrixWorld);let i=t.update(n),c=n.material;if(Array.isArray(c)){let t=i.groups;for(let l=0,u=t.length;l<u;l++){let u=t[l],d=c[u.materialIndex];if(d&&d.visible){let t=w(n,d,o,s);n.onBeforeShadow(e,n,r,a,i,t,u),e.renderBufferDirect(a,null,i,t,n,u),n.onAfterShadow(e,n,r,a,i,t,u)}}}else if(c.visible){let t=w(n,c,o,s);n.onBeforeShadow(e,n,r,a,i,t,null),e.renderBufferDirect(a,null,i,t,n,null),n.onAfterShadow(e,n,r,a,i,t,null)}}let c=n.children;for(let e=0,t=c.length;e<t;e++)E(c[e],r,a,o,s)}function D(e){e.target.removeEventListener(`dispose`,D);for(let t in d){let n=d[t],r=e.target.uuid;r in n&&(n[r].dispose(),delete n[r])}}}function kc(e,t){function n(){let t=!1,n=new Ot,r=null,i=new Ot(0,0,0,0);return{setMask:function(n){r!==n&&!t&&(e.colorMask(n,n,n,n),r=n)},setLocked:function(e){t=e},setClear:function(t,r,a,o,s){s===!0&&(t*=o,r*=o,a*=o),n.set(t,r,a,o),i.equals(n)===!1&&(e.clearColor(t,r,a,o),i.copy(n))},reset:function(){t=!1,r=null,i.set(-1,0,0,0)}}}function r(){let n=!1,r=!1,i=null,a=null,o=null;return{setReversed:function(e){if(r!==e){let n=t.get(`EXT_clip_control`);e?n.clipControlEXT(n.LOWER_LEFT_EXT,n.ZERO_TO_ONE_EXT):n.clipControlEXT(n.LOWER_LEFT_EXT,n.NEGATIVE_ONE_TO_ONE_EXT),r=e;let i=o;o=null,this.setClear(i)}},getReversed:function(){return r},setTest:function(t){t?M(e.DEPTH_TEST):fe(e.DEPTH_TEST)},setMask:function(t){i!==t&&!n&&(e.depthMask(t),i=t)},setFunc:function(t){if(r&&(t=tt[t]),a!==t){switch(t){case 0:e.depthFunc(e.NEVER);break;case 1:e.depthFunc(e.ALWAYS);break;case 2:e.depthFunc(e.LESS);break;case 3:e.depthFunc(e.LEQUAL);break;case 4:e.depthFunc(e.EQUAL);break;case 5:e.depthFunc(e.GEQUAL);break;case 6:e.depthFunc(e.GREATER);break;case 7:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}a=t}},setLocked:function(e){n=e},setClear:function(t){o!==t&&(o=t,r&&(t=1-t),e.clearDepth(t))},reset:function(){n=!1,i=null,a=null,o=null,r=!1}}}function i(){let t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null;return{setTest:function(n){t||(n?M(e.STENCIL_TEST):fe(e.STENCIL_TEST))},setMask:function(r){n!==r&&!t&&(e.stencilMask(r),n=r)},setFunc:function(t,n,o){(r!==t||i!==n||a!==o)&&(e.stencilFunc(t,n,o),r=t,i=n,a=o)},setOp:function(t,n,r){(o!==t||s!==n||c!==r)&&(e.stencilOp(t,n,r),o=t,s=n,c=r)},setLocked:function(e){t=e},setClear:function(t){l!==t&&(e.clearStencil(t),l=t)},reset:function(){t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null}}}let a=new n,o=new r,s=new i,c=new WeakMap,l=new WeakMap,u={},d={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new W(0,0,0),T=0,E=!1,D=null,ee=null,te=null,O=null,ne=null,k=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),A=!1,re=0,ie=e.getParameter(e.VERSION);ie.indexOf(`WebGL`)===-1?ie.indexOf(`OpenGL ES`)!==-1&&(re=parseFloat(/^OpenGL ES (\d)/.exec(ie)[1]),A=re>=2):(re=parseFloat(/^WebGL (\d)/.exec(ie)[1]),A=re>=1);let j=null,ae={},oe=e.getParameter(e.SCISSOR_BOX),se=e.getParameter(e.VIEWPORT),ce=new Ot().fromArray(oe),le=new Ot().fromArray(se);function ue(t,n,r,i){let a=new Uint8Array(4),o=e.createTexture();e.bindTexture(t,o),e.texParameteri(t,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(t,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let o=0;o<r;o++)t===e.TEXTURE_3D||t===e.TEXTURE_2D_ARRAY?e.texImage3D(n,0,e.RGBA,1,1,i,0,e.RGBA,e.UNSIGNED_BYTE,a):e.texImage2D(n+o,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,a);return o}let de={};de[e.TEXTURE_2D]=ue(e.TEXTURE_2D,e.TEXTURE_2D,1),de[e.TEXTURE_CUBE_MAP]=ue(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),de[e.TEXTURE_2D_ARRAY]=ue(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),de[e.TEXTURE_3D]=ue(e.TEXTURE_3D,e.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),s.setClear(0),M(e.DEPTH_TEST),o.setFunc(3),be(!1),xe(1),M(e.CULL_FACE),ve(0);function M(t){u[t]!==!0&&(e.enable(t),u[t]=!0)}function fe(t){u[t]!==!1&&(e.disable(t),u[t]=!1)}function pe(t,n){return f[t]!==n&&(e.bindFramebuffer(t,n),f[t]=n,t===e.DRAW_FRAMEBUFFER&&(f[e.FRAMEBUFFER]=n),t===e.FRAMEBUFFER&&(f[e.DRAW_FRAMEBUFFER]=n),!0)}function me(t,n){let r=m,i=!1;if(t){r=p.get(n),r===void 0&&(r=[],p.set(n,r));let a=t.textures;if(r.length!==a.length||r[0]!==e.COLOR_ATTACHMENT0){for(let t=0,n=a.length;t<n;t++)r[t]=e.COLOR_ATTACHMENT0+t;r.length=a.length,i=!0}}else r[0]!==e.BACK&&(r[0]=e.BACK,i=!0);i&&e.drawBuffers(r)}function he(t){return h!==t&&(e.useProgram(t),h=t,!0)}let ge={100:e.FUNC_ADD,101:e.FUNC_SUBTRACT,102:e.FUNC_REVERSE_SUBTRACT};ge[103]=e.MIN,ge[104]=e.MAX;let _e={200:e.ZERO,201:e.ONE,202:e.SRC_COLOR,204:e.SRC_ALPHA,210:e.SRC_ALPHA_SATURATE,208:e.DST_COLOR,206:e.DST_ALPHA,203:e.ONE_MINUS_SRC_COLOR,205:e.ONE_MINUS_SRC_ALPHA,209:e.ONE_MINUS_DST_COLOR,207:e.ONE_MINUS_DST_ALPHA,211:e.CONSTANT_COLOR,212:e.ONE_MINUS_CONSTANT_COLOR,213:e.CONSTANT_ALPHA,214:e.ONE_MINUS_CONSTANT_ALPHA};function ve(t,n,r,i,a,o,s,c,l,u){if(t===0){g===!0&&(fe(e.BLEND),g=!1);return}if(g===!1&&(M(e.BLEND),g=!0),t!==5){if(t!==_||u!==E){if((v!==100||x!==100)&&(e.blendEquation(e.FUNC_ADD),v=100,x=100),u)switch(t){case 1:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFunc(e.ONE,e.ONE);break;case 3:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case 4:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:R(`WebGLState: Invalid blending: `,t)}else switch(t){case 1:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case 3:R(`WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true`);break;case 4:R(`WebGLState: MultiplyBlending requires material.premultipliedAlpha = true`);break;default:R(`WebGLState: Invalid blending: `,t)}y=null,b=null,S=null,C=null,w.set(0,0,0),T=0,_=t,E=u}return}a||=n,o||=r,s||=i,(n!==v||a!==x)&&(e.blendEquationSeparate(ge[n],ge[a]),v=n,x=a),(r!==y||i!==b||o!==S||s!==C)&&(e.blendFuncSeparate(_e[r],_e[i],_e[o],_e[s]),y=r,b=i,S=o,C=s),(c.equals(w)===!1||l!==T)&&(e.blendColor(c.r,c.g,c.b,l),w.copy(c),T=l),_=t,E=!1}function ye(t,n){t.side===2?fe(e.CULL_FACE):M(e.CULL_FACE);let r=t.side===1;n&&(r=!r),be(r),t.blending===1&&t.transparent===!1?ve(0):ve(t.blending,t.blendEquation,t.blendSrc,t.blendDst,t.blendEquationAlpha,t.blendSrcAlpha,t.blendDstAlpha,t.blendColor,t.blendAlpha,t.premultipliedAlpha),o.setFunc(t.depthFunc),o.setTest(t.depthTest),o.setMask(t.depthWrite),a.setMask(t.colorWrite);let i=t.stencilWrite;s.setTest(i),i&&(s.setMask(t.stencilWriteMask),s.setFunc(t.stencilFunc,t.stencilRef,t.stencilFuncMask),s.setOp(t.stencilFail,t.stencilZFail,t.stencilZPass)),Ce(t.polygonOffset,t.polygonOffsetFactor,t.polygonOffsetUnits),t.alphaToCoverage===!0?M(e.SAMPLE_ALPHA_TO_COVERAGE):fe(e.SAMPLE_ALPHA_TO_COVERAGE)}function be(t){D!==t&&(t?e.frontFace(e.CW):e.frontFace(e.CCW),D=t)}function xe(t){t===0?fe(e.CULL_FACE):(M(e.CULL_FACE),t!==ee&&(t===1?e.cullFace(e.BACK):t===2?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))),ee=t}function Se(t){t!==te&&(A&&e.lineWidth(t),te=t)}function Ce(t,n,r){t?(M(e.POLYGON_OFFSET_FILL),(O!==n||ne!==r)&&(O=n,ne=r,o.getReversed()&&(n=-n),e.polygonOffset(n,r))):fe(e.POLYGON_OFFSET_FILL)}function we(t){t?M(e.SCISSOR_TEST):fe(e.SCISSOR_TEST)}function Te(t){t===void 0&&(t=e.TEXTURE0+k-1),j!==t&&(e.activeTexture(t),j=t)}function Ee(t,n,r){r===void 0&&(r=j===null?e.TEXTURE0+k-1:j);let i=ae[r];i===void 0&&(i={type:void 0,texture:void 0},ae[r]=i),(i.type!==t||i.texture!==n)&&(j!==r&&(e.activeTexture(r),j=r),e.bindTexture(t,n||de[t]),i.type=t,i.texture=n)}function De(){let t=ae[j];t!==void 0&&t.type!==void 0&&(e.bindTexture(t.type,null),t.type=void 0,t.texture=void 0)}function Oe(){try{e.compressedTexImage2D(...arguments)}catch(e){R(`WebGLState:`,e)}}function ke(){try{e.compressedTexImage3D(...arguments)}catch(e){R(`WebGLState:`,e)}}function Ae(){try{e.texSubImage2D(...arguments)}catch(e){R(`WebGLState:`,e)}}function je(){try{e.texSubImage3D(...arguments)}catch(e){R(`WebGLState:`,e)}}function Me(){try{e.compressedTexSubImage2D(...arguments)}catch(e){R(`WebGLState:`,e)}}function Ne(){try{e.compressedTexSubImage3D(...arguments)}catch(e){R(`WebGLState:`,e)}}function Pe(){try{e.texStorage2D(...arguments)}catch(e){R(`WebGLState:`,e)}}function Fe(){try{e.texStorage3D(...arguments)}catch(e){R(`WebGLState:`,e)}}function N(){try{e.texImage2D(...arguments)}catch(e){R(`WebGLState:`,e)}}function Ie(){try{e.texImage3D(...arguments)}catch(e){R(`WebGLState:`,e)}}function Le(t){return d[t]===void 0?e.getParameter(t):d[t]}function Re(t,n){d[t]!==n&&(e.pixelStorei(t,n),d[t]=n)}function P(t){ce.equals(t)===!1&&(e.scissor(t.x,t.y,t.z,t.w),ce.copy(t))}function ze(t){le.equals(t)===!1&&(e.viewport(t.x,t.y,t.z,t.w),le.copy(t))}function F(t,n){let r=l.get(n);r===void 0&&(r=new WeakMap,l.set(n,r));let i=r.get(t);i===void 0&&(i=e.getUniformBlockIndex(n,t.name),r.set(t,i))}function Be(t,n){let r=l.get(n).get(t);c.get(n)!==r&&(e.uniformBlockBinding(n,r,t.__bindingPointIndex),c.set(n,r))}function I(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),o.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),u={},d={},j=null,ae={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new W(0,0,0),T=0,E=!1,D=null,ee=null,te=null,O=null,ne=null,ce.set(0,0,e.canvas.width,e.canvas.height),le.set(0,0,e.canvas.width,e.canvas.height),a.reset(),o.reset(),s.reset()}return{buffers:{color:a,depth:o,stencil:s},enable:M,disable:fe,bindFramebuffer:pe,drawBuffers:me,useProgram:he,setBlending:ve,setMaterial:ye,setFlipSided:be,setCullFace:xe,setLineWidth:Se,setPolygonOffset:Ce,setScissorTest:we,activeTexture:Te,bindTexture:Ee,unbindTexture:De,compressedTexImage2D:Oe,compressedTexImage3D:ke,texImage2D:N,texImage3D:Ie,pixelStorei:Re,getParameter:Le,updateUBOMapping:F,uniformBlockBinding:Be,texStorage2D:Pe,texStorage3D:Fe,texSubImage2D:Ae,texSubImage3D:je,compressedTexSubImage2D:Me,compressedTexSubImage3D:Ne,scissor:P,viewport:ze,reset:I}}function Ac(l,u,d,f,p,m,h){let g=u.has(`WEBGL_multisampled_render_to_texture`)?u.get(`WEBGL_multisampled_render_to_texture`):null,_=typeof navigator>`u`?!1:/OculusBrowser/g.test(navigator.userAgent),v=new B,y=new WeakMap,b=new Set,x,S=new WeakMap,C=!1;try{C=typeof OffscreenCanvas<`u`&&new OffscreenCanvas(1,1).getContext(`2d`)!==null}catch{}function w(e,t){return C?new OffscreenCanvas(e,t):Je(`canvas`)}function T(e,t,n){let r=1,i=Le(e);if((i.width>n||i.height>n)&&(r=n/Math.max(i.width,i.height)),r<1){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap||typeof VideoFrame<`u`&&e instanceof VideoFrame){let n=Math.floor(r*i.width),a=Math.floor(r*i.height);x===void 0&&(x=w(n,a));let o=t?w(n,a):x;return o.width=n,o.height=a,o.getContext(`2d`).drawImage(e,0,0,n,a),L(`WebGLRenderer: Texture has been resized from (`+i.width+`x`+i.height+`) to (`+n+`x`+a+`).`),o}return`data`in e&&L(`WebGLRenderer: Image in DataTexture is too big (`+i.width+`x`+i.height+`).`),e}return e}function D(e){return e.generateMipmaps}function ee(e){l.generateMipmap(e)}function te(e){return e.isWebGLCubeRenderTarget?l.TEXTURE_CUBE_MAP:e.isWebGL3DRenderTarget?l.TEXTURE_3D:e.isWebGLArrayRenderTarget||e.isCompressedArrayTexture?l.TEXTURE_2D_ARRAY:l.TEXTURE_2D}function O(e,t,n,r,i,a=!1){if(e!==null){if(l[e]!==void 0)return l[e];L(`WebGLRenderer: Attempt to use non-existing WebGL internal format '`+e+`'`)}let o;r&&(o=u.get(`EXT_texture_norm16`),o||L(`WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension`));let s=t;if(t===l.RED&&(n===l.FLOAT&&(s=l.R32F),n===l.HALF_FLOAT&&(s=l.R16F),n===l.UNSIGNED_BYTE&&(s=l.R8),n===l.UNSIGNED_SHORT&&o&&(s=o.R16_EXT),n===l.SHORT&&o&&(s=o.R16_SNORM_EXT)),t===l.RED_INTEGER&&(n===l.UNSIGNED_BYTE&&(s=l.R8UI),n===l.UNSIGNED_SHORT&&(s=l.R16UI),n===l.UNSIGNED_INT&&(s=l.R32UI),n===l.BYTE&&(s=l.R8I),n===l.SHORT&&(s=l.R16I),n===l.INT&&(s=l.R32I)),t===l.RG&&(n===l.FLOAT&&(s=l.RG32F),n===l.HALF_FLOAT&&(s=l.RG16F),n===l.UNSIGNED_BYTE&&(s=l.RG8),n===l.UNSIGNED_SHORT&&o&&(s=o.RG16_EXT),n===l.SHORT&&o&&(s=o.RG16_SNORM_EXT)),t===l.RG_INTEGER&&(n===l.UNSIGNED_BYTE&&(s=l.RG8UI),n===l.UNSIGNED_SHORT&&(s=l.RG16UI),n===l.UNSIGNED_INT&&(s=l.RG32UI),n===l.BYTE&&(s=l.RG8I),n===l.SHORT&&(s=l.RG16I),n===l.INT&&(s=l.RG32I)),t===l.RGB_INTEGER&&(n===l.UNSIGNED_BYTE&&(s=l.RGB8UI),n===l.UNSIGNED_SHORT&&(s=l.RGB16UI),n===l.UNSIGNED_INT&&(s=l.RGB32UI),n===l.BYTE&&(s=l.RGB8I),n===l.SHORT&&(s=l.RGB16I),n===l.INT&&(s=l.RGB32I)),t===l.RGBA_INTEGER&&(n===l.UNSIGNED_BYTE&&(s=l.RGBA8UI),n===l.UNSIGNED_SHORT&&(s=l.RGBA16UI),n===l.UNSIGNED_INT&&(s=l.RGBA32UI),n===l.BYTE&&(s=l.RGBA8I),n===l.SHORT&&(s=l.RGBA16I),n===l.INT&&(s=l.RGBA32I)),t===l.RGB&&(n===l.UNSIGNED_SHORT&&o&&(s=o.RGB16_EXT),n===l.SHORT&&o&&(s=o.RGB16_SNORM_EXT),n===l.UNSIGNED_INT_5_9_9_9_REV&&(s=l.RGB9_E5),n===l.UNSIGNED_INT_10F_11F_11F_REV&&(s=l.R11F_G11F_B10F)),t===l.RGBA){let e=a?Ve:U.getTransfer(i);n===l.FLOAT&&(s=l.RGBA32F),n===l.HALF_FLOAT&&(s=l.RGBA16F),n===l.UNSIGNED_BYTE&&(s=e===`srgb`?l.SRGB8_ALPHA8:l.RGBA8),n===l.UNSIGNED_SHORT&&o&&(s=o.RGBA16_EXT),n===l.SHORT&&o&&(s=o.RGBA16_SNORM_EXT),n===l.UNSIGNED_SHORT_4_4_4_4&&(s=l.RGBA4),n===l.UNSIGNED_SHORT_5_5_5_1&&(s=l.RGB5_A1)}return(s===l.R16F||s===l.R32F||s===l.RG16F||s===l.RG32F||s===l.RGBA16F||s===l.RGBA32F)&&u.get(`EXT_color_buffer_float`),s}function ne(e,t){let n;return e?t===null||t===1014||t===1020?n=l.DEPTH24_STENCIL8:t===1015?n=l.DEPTH32F_STENCIL8:t===1012&&(n=l.DEPTH24_STENCIL8,L(`DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.`)):t===null||t===1014||t===1020?n=l.DEPTH_COMPONENT24:t===1015?n=l.DEPTH_COMPONENT32F:t===1012&&(n=l.DEPTH_COMPONENT16),n}function k(e,t){return D(e)===!0||e.isFramebufferTexture&&e.minFilter!==1003&&e.minFilter!==1006?Math.log2(Math.max(t.width,t.height))+1:e.mipmaps!==void 0&&e.mipmaps.length>0?e.mipmaps.length:e.isCompressedTexture&&Array.isArray(e.image)?t.mipmaps.length:1}function A(e){let t=e.target;t.removeEventListener(`dispose`,A),ie(t),t.isVideoTexture&&y.delete(t),t.isHTMLTexture&&b.delete(t)}function re(e){let t=e.target;t.removeEventListener(`dispose`,re),ae(t)}function ie(e){let t=f.get(e);if(t.__webglInit===void 0)return;let n=e.source,r=S.get(n);if(r){let i=r[t.__cacheKey];i.usedTimes--,i.usedTimes===0&&j(e),Object.keys(r).length===0&&S.delete(n)}f.remove(e)}function j(e){let t=f.get(e);l.deleteTexture(t.__webglTexture);let n=e.source,r=S.get(n);delete r[t.__cacheKey],h.memory.textures--}function ae(e){let t=f.get(e);if(e.depthTexture&&(e.depthTexture.dispose(),f.remove(e.depthTexture)),e.isWebGLCubeRenderTarget)for(let e=0;e<6;e++){if(Array.isArray(t.__webglFramebuffer[e]))for(let n=0;n<t.__webglFramebuffer[e].length;n++)l.deleteFramebuffer(t.__webglFramebuffer[e][n]);else l.deleteFramebuffer(t.__webglFramebuffer[e]);t.__webglDepthbuffer&&l.deleteRenderbuffer(t.__webglDepthbuffer[e])}else{if(Array.isArray(t.__webglFramebuffer))for(let e=0;e<t.__webglFramebuffer.length;e++)l.deleteFramebuffer(t.__webglFramebuffer[e]);else l.deleteFramebuffer(t.__webglFramebuffer);if(t.__webglDepthbuffer&&l.deleteRenderbuffer(t.__webglDepthbuffer),t.__webglMultisampledFramebuffer&&l.deleteFramebuffer(t.__webglMultisampledFramebuffer),t.__webglColorRenderbuffer)for(let e=0;e<t.__webglColorRenderbuffer.length;e++)t.__webglColorRenderbuffer[e]&&l.deleteRenderbuffer(t.__webglColorRenderbuffer[e]);t.__webglDepthRenderbuffer&&l.deleteRenderbuffer(t.__webglDepthRenderbuffer)}let n=e.textures;for(let e=0,t=n.length;e<t;e++){let t=f.get(n[e]);t.__webglTexture&&(l.deleteTexture(t.__webglTexture),h.memory.textures--),f.remove(n[e])}f.remove(e)}let oe=0;function se(){oe=0}function ce(){return oe}function le(e){oe=e}function ue(){let e=oe;return e>=p.maxTextures&&L(`WebGLTextures: Trying to use `+e+` texture units while this GPU supports only `+p.maxTextures),oe+=1,e}function de(e){let t=[];return t.push(e.wrapS),t.push(e.wrapT),t.push(e.wrapR||0),t.push(e.magFilter),t.push(e.minFilter),t.push(e.anisotropy),t.push(e.internalFormat),t.push(e.format),t.push(e.type),t.push(e.generateMipmaps),t.push(e.premultiplyAlpha),t.push(e.flipY),t.push(e.unpackAlignment),t.push(e.colorSpace),t.join()}function M(e,t){let n=f.get(e);if(e.isVideoTexture&&N(e),e.isRenderTargetTexture===!1&&e.isExternalTexture!==!0&&e.version>0&&n.__version!==e.version){let r=e.image;if(r===null)L(`WebGLRenderer: Texture marked for update but no image data found.`);else if(r.complete===!1)L(`WebGLRenderer: Texture marked for update but image is incomplete`);else{Se(n,e,t);return}}else e.isExternalTexture&&(n.__webglTexture=e.sourceTexture?e.sourceTexture:null);d.bindTexture(l.TEXTURE_2D,n.__webglTexture,l.TEXTURE0+t)}function fe(e,t){let n=f.get(e);if(e.isRenderTargetTexture===!1&&e.version>0&&n.__version!==e.version){Se(n,e,t);return}e.isExternalTexture&&(n.__webglTexture=e.sourceTexture?e.sourceTexture:null),d.bindTexture(l.TEXTURE_2D_ARRAY,n.__webglTexture,l.TEXTURE0+t)}function pe(e,t){let n=f.get(e);if(e.isRenderTargetTexture===!1&&e.version>0&&n.__version!==e.version){Se(n,e,t);return}d.bindTexture(l.TEXTURE_3D,n.__webglTexture,l.TEXTURE0+t)}function me(e,t){let n=f.get(e);if(e.isCubeDepthTexture!==!0&&e.version>0&&n.__version!==e.version){Ce(n,e,t);return}d.bindTexture(l.TEXTURE_CUBE_MAP,n.__webglTexture,l.TEXTURE0+t)}let he={[e]:l.REPEAT,[t]:l.CLAMP_TO_EDGE,[n]:l.MIRRORED_REPEAT},ge={[r]:l.NEAREST,[i]:l.NEAREST_MIPMAP_NEAREST,[a]:l.NEAREST_MIPMAP_LINEAR,[o]:l.LINEAR,[s]:l.LINEAR_MIPMAP_NEAREST,[c]:l.LINEAR_MIPMAP_LINEAR},_e={512:l.NEVER,519:l.ALWAYS,513:l.LESS,515:l.LEQUAL,514:l.EQUAL,518:l.GEQUAL,516:l.GREATER,517:l.NOTEQUAL};function ve(e,t){if(t.type===1015&&u.has(`OES_texture_float_linear`)===!1&&(t.magFilter===1006||t.magFilter===1007||t.magFilter===1005||t.magFilter===1008||t.minFilter===1006||t.minFilter===1007||t.minFilter===1005||t.minFilter===1008)&&L(`WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.`),l.texParameteri(e,l.TEXTURE_WRAP_S,he[t.wrapS]),l.texParameteri(e,l.TEXTURE_WRAP_T,he[t.wrapT]),(e===l.TEXTURE_3D||e===l.TEXTURE_2D_ARRAY)&&l.texParameteri(e,l.TEXTURE_WRAP_R,he[t.wrapR]),l.texParameteri(e,l.TEXTURE_MAG_FILTER,ge[t.magFilter]),l.texParameteri(e,l.TEXTURE_MIN_FILTER,ge[t.minFilter]),t.compareFunction&&(l.texParameteri(e,l.TEXTURE_COMPARE_MODE,l.COMPARE_REF_TO_TEXTURE),l.texParameteri(e,l.TEXTURE_COMPARE_FUNC,_e[t.compareFunction])),u.has(`EXT_texture_filter_anisotropic`)===!0){if(t.magFilter===1003||t.minFilter!==1005&&t.minFilter!==1008||t.type===1015&&u.has(`OES_texture_float_linear`)===!1)return;if(t.anisotropy>1||f.get(t).__currentAnisotropy){let n=u.get(`EXT_texture_filter_anisotropic`);l.texParameterf(e,n.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(t.anisotropy,p.getMaxAnisotropy())),f.get(t).__currentAnisotropy=t.anisotropy}}}function ye(e,t){let n=!1;e.__webglInit===void 0&&(e.__webglInit=!0,t.addEventListener(`dispose`,A));let r=t.source,i=S.get(r);i===void 0&&(i={},S.set(r,i));let a=de(t);if(a!==e.__cacheKey){i[a]===void 0&&(i[a]={texture:l.createTexture(),usedTimes:0},h.memory.textures++,n=!0),i[a].usedTimes++;let r=i[e.__cacheKey];r!==void 0&&(i[e.__cacheKey].usedTimes--,r.usedTimes===0&&j(t)),e.__cacheKey=a,e.__webglTexture=i[a].texture}return n}function be(e,t,n){return Math.floor(Math.floor(e/n)/t)}function xe(e,t,n,r){let i=e.updateRanges;if(i.length===0)d.texSubImage2D(l.TEXTURE_2D,0,0,0,t.width,t.height,n,r,t.data);else{i.sort((e,t)=>e.start-t.start);let a=0;for(let e=1;e<i.length;e++){let n=i[a],r=i[e],o=n.start+n.count,s=be(r.start,t.width,4),c=be(n.start,t.width,4);r.start<=o+1&&s===c&&be(r.start+r.count-1,t.width,4)===s?n.count=Math.max(n.count,r.start+r.count-n.start):(++a,i[a]=r)}i.length=a+1;let o=d.getParameter(l.UNPACK_ROW_LENGTH),s=d.getParameter(l.UNPACK_SKIP_PIXELS),c=d.getParameter(l.UNPACK_SKIP_ROWS);d.pixelStorei(l.UNPACK_ROW_LENGTH,t.width);for(let e=0,a=i.length;e<a;e++){let a=i[e],o=Math.floor(a.start/4),s=Math.ceil(a.count/4),c=o%t.width,u=Math.floor(o/t.width),f=s;d.pixelStorei(l.UNPACK_SKIP_PIXELS,c),d.pixelStorei(l.UNPACK_SKIP_ROWS,u),d.texSubImage2D(l.TEXTURE_2D,0,c,u,f,1,n,r,t.data)}e.clearUpdateRanges(),d.pixelStorei(l.UNPACK_ROW_LENGTH,o),d.pixelStorei(l.UNPACK_SKIP_PIXELS,s),d.pixelStorei(l.UNPACK_SKIP_ROWS,c)}}function Se(e,t,n){let r=l.TEXTURE_2D;(t.isDataArrayTexture||t.isCompressedArrayTexture)&&(r=l.TEXTURE_2D_ARRAY),t.isData3DTexture&&(r=l.TEXTURE_3D);let i=ye(e,t),a=t.source;d.bindTexture(r,e.__webglTexture,l.TEXTURE0+n);let o=f.get(a);if(a.version!==o.__version||i===!0){if(d.activeTexture(l.TEXTURE0+n),!(typeof ImageBitmap<`u`&&t.image instanceof ImageBitmap)){let e=U.getPrimaries(U.workingColorSpace),n=t.colorSpace===``?null:U.getPrimaries(t.colorSpace),r=t.colorSpace===``||e===n?l.NONE:l.BROWSER_DEFAULT_WEBGL;d.pixelStorei(l.UNPACK_FLIP_Y_WEBGL,t.flipY),d.pixelStorei(l.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),d.pixelStorei(l.UNPACK_COLORSPACE_CONVERSION_WEBGL,r)}d.pixelStorei(l.UNPACK_ALIGNMENT,t.unpackAlignment);let e=T(t.image,!1,p.maxTextureSize);e=Ie(t,e);let s=m.convert(t.format,t.colorSpace),c=m.convert(t.type),u=O(t.internalFormat,s,c,t.normalized,t.colorSpace,t.isVideoTexture);ve(r,t);let f,h=t.mipmaps,g=t.isVideoTexture!==!0,_=o.__version===void 0||i===!0,v=a.dataReady,y=k(t,e);if(t.isDepthTexture)u=ne(t.format===E,t.type),_&&(g?d.texStorage2D(l.TEXTURE_2D,1,u,e.width,e.height):d.texImage2D(l.TEXTURE_2D,0,u,e.width,e.height,0,s,c,null));else if(t.isDataTexture){if(h.length>0){g&&_&&d.texStorage2D(l.TEXTURE_2D,y,u,h[0].width,h[0].height);for(let e=0,t=h.length;e<t;e++)f=h[e],g?v&&d.texSubImage2D(l.TEXTURE_2D,e,0,0,f.width,f.height,s,c,f.data):d.texImage2D(l.TEXTURE_2D,e,u,f.width,f.height,0,s,c,f.data);t.generateMipmaps=!1}else g?(_&&d.texStorage2D(l.TEXTURE_2D,y,u,e.width,e.height),v&&xe(t,e,s,c)):d.texImage2D(l.TEXTURE_2D,0,u,e.width,e.height,0,s,c,e.data)}else if(t.isCompressedTexture){if(t.isCompressedArrayTexture){g&&_&&d.texStorage3D(l.TEXTURE_2D_ARRAY,y,u,h[0].width,h[0].height,e.depth);for(let n=0,r=h.length;n<r;n++)if(f=h[n],t.format!==1023){if(s!==null){if(g){if(v){if(t.layerUpdates.size>0){let e=Ta(f.width,f.height,t.format,t.type);for(let r of t.layerUpdates){let t=f.data.subarray(r*e/f.data.BYTES_PER_ELEMENT,(r+1)*e/f.data.BYTES_PER_ELEMENT);d.compressedTexSubImage3D(l.TEXTURE_2D_ARRAY,n,0,0,r,f.width,f.height,1,s,t)}t.clearLayerUpdates()}else d.compressedTexSubImage3D(l.TEXTURE_2D_ARRAY,n,0,0,0,f.width,f.height,e.depth,s,f.data)}}else d.compressedTexImage3D(l.TEXTURE_2D_ARRAY,n,u,f.width,f.height,e.depth,0,f.data,0,0)}else L(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`)}else g?v&&d.texSubImage3D(l.TEXTURE_2D_ARRAY,n,0,0,0,f.width,f.height,e.depth,s,c,f.data):d.texImage3D(l.TEXTURE_2D_ARRAY,n,u,f.width,f.height,e.depth,0,s,c,f.data)}else{g&&_&&d.texStorage2D(l.TEXTURE_2D,y,u,h[0].width,h[0].height);for(let e=0,n=h.length;e<n;e++)f=h[e],t.format===1023?g?v&&d.texSubImage2D(l.TEXTURE_2D,e,0,0,f.width,f.height,s,c,f.data):d.texImage2D(l.TEXTURE_2D,e,u,f.width,f.height,0,s,c,f.data):s===null?L(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`):g?v&&d.compressedTexSubImage2D(l.TEXTURE_2D,e,0,0,f.width,f.height,s,f.data):d.compressedTexImage2D(l.TEXTURE_2D,e,u,f.width,f.height,0,f.data)}}else if(t.isDataArrayTexture){if(g){if(_&&d.texStorage3D(l.TEXTURE_2D_ARRAY,y,u,e.width,e.height,e.depth),v){if(t.layerUpdates.size>0){let n=Ta(e.width,e.height,t.format,t.type);for(let r of t.layerUpdates){let t=e.data.subarray(r*n/e.data.BYTES_PER_ELEMENT,(r+1)*n/e.data.BYTES_PER_ELEMENT);d.texSubImage3D(l.TEXTURE_2D_ARRAY,0,0,0,r,e.width,e.height,1,s,c,t)}t.clearLayerUpdates()}else d.texSubImage3D(l.TEXTURE_2D_ARRAY,0,0,0,0,e.width,e.height,e.depth,s,c,e.data)}}else d.texImage3D(l.TEXTURE_2D_ARRAY,0,u,e.width,e.height,e.depth,0,s,c,e.data)}else if(t.isData3DTexture)g?(_&&d.texStorage3D(l.TEXTURE_3D,y,u,e.width,e.height,e.depth),v&&d.texSubImage3D(l.TEXTURE_3D,0,0,0,0,e.width,e.height,e.depth,s,c,e.data)):d.texImage3D(l.TEXTURE_3D,0,u,e.width,e.height,e.depth,0,s,c,e.data);else if(t.isFramebufferTexture){if(_){if(g)d.texStorage2D(l.TEXTURE_2D,y,u,e.width,e.height);else{let t=e.width,n=e.height;for(let e=0;e<y;e++)d.texImage2D(l.TEXTURE_2D,e,u,t,n,0,s,c,null),t>>=1,n>>=1}}}else if(t.isHTMLTexture){if(`texElementImage2D`in l){let n=l.canvas;if(n.hasAttribute(`layoutsubtree`)||n.setAttribute(`layoutsubtree`,`true`),e.parentNode!==n){n.appendChild(e),b.add(t),n.onpaint=e=>{let t=e.changedElements;for(let e of b)t.includes(e.image)&&(e.needsUpdate=!0)},n.requestPaint();return}if(l.texElementImage2D.length===3)l.texElementImage2D(l.TEXTURE_2D,l.RGBA8,e);else{let t=l.RGBA,n=l.RGBA,r=l.UNSIGNED_BYTE;l.texElementImage2D(l.TEXTURE_2D,0,t,n,r,e)}l.texParameteri(l.TEXTURE_2D,l.TEXTURE_MIN_FILTER,l.LINEAR),l.texParameteri(l.TEXTURE_2D,l.TEXTURE_WRAP_S,l.CLAMP_TO_EDGE),l.texParameteri(l.TEXTURE_2D,l.TEXTURE_WRAP_T,l.CLAMP_TO_EDGE)}}else if(h.length>0){if(g&&_){let e=Le(h[0]);d.texStorage2D(l.TEXTURE_2D,y,u,e.width,e.height)}for(let e=0,t=h.length;e<t;e++)f=h[e],g?v&&d.texSubImage2D(l.TEXTURE_2D,e,0,0,s,c,f):d.texImage2D(l.TEXTURE_2D,e,u,s,c,f);t.generateMipmaps=!1}else if(g){if(_){let t=Le(e);d.texStorage2D(l.TEXTURE_2D,y,u,t.width,t.height)}v&&d.texSubImage2D(l.TEXTURE_2D,0,0,0,s,c,e)}else d.texImage2D(l.TEXTURE_2D,0,u,s,c,e);D(t)&&ee(r),o.__version=a.version,t.onUpdate&&t.onUpdate(t)}e.__version=t.version}function Ce(e,t,n){if(t.image.length!==6)return;let r=ye(e,t),i=t.source;d.bindTexture(l.TEXTURE_CUBE_MAP,e.__webglTexture,l.TEXTURE0+n);let a=f.get(i);if(i.version!==a.__version||r===!0){d.activeTexture(l.TEXTURE0+n);let e=U.getPrimaries(U.workingColorSpace),o=t.colorSpace===``?null:U.getPrimaries(t.colorSpace),s=t.colorSpace===``||e===o?l.NONE:l.BROWSER_DEFAULT_WEBGL;d.pixelStorei(l.UNPACK_FLIP_Y_WEBGL,t.flipY),d.pixelStorei(l.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),d.pixelStorei(l.UNPACK_ALIGNMENT,t.unpackAlignment),d.pixelStorei(l.UNPACK_COLORSPACE_CONVERSION_WEBGL,s);let c=t.isCompressedTexture||t.image[0].isCompressedTexture,u=t.image[0]&&t.image[0].isDataTexture,f=[];for(let e=0;e<6;e++)!c&&!u?f[e]=T(t.image[e],!0,p.maxCubemapSize):f[e]=u?t.image[e].image:t.image[e],f[e]=Ie(t,f[e]);let h=f[0],g=m.convert(t.format,t.colorSpace),_=m.convert(t.type),v=O(t.internalFormat,g,_,t.normalized,t.colorSpace),y=t.isVideoTexture!==!0,b=a.__version===void 0||r===!0,x=i.dataReady,S=k(t,h);ve(l.TEXTURE_CUBE_MAP,t);let C;if(c){y&&b&&d.texStorage2D(l.TEXTURE_CUBE_MAP,S,v,h.width,h.height);for(let e=0;e<6;e++){C=f[e].mipmaps;for(let n=0;n<C.length;n++){let r=C[n];t.format===1023?y?x&&d.texSubImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,n,0,0,r.width,r.height,g,_,r.data):d.texImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,n,v,r.width,r.height,0,g,_,r.data):g===null?L(`WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()`):y?x&&d.compressedTexSubImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,n,0,0,r.width,r.height,g,r.data):d.compressedTexImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,n,v,r.width,r.height,0,r.data)}}}else{if(C=t.mipmaps,y&&b){C.length>0&&S++;let e=Le(f[0]);d.texStorage2D(l.TEXTURE_CUBE_MAP,S,v,e.width,e.height)}for(let e=0;e<6;e++)if(u){y?x&&d.texSubImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,0,0,0,f[e].width,f[e].height,g,_,f[e].data):d.texImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,0,v,f[e].width,f[e].height,0,g,_,f[e].data);for(let t=0;t<C.length;t++){let n=C[t].image[e].image;y?x&&d.texSubImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,t+1,0,0,n.width,n.height,g,_,n.data):d.texImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,t+1,v,n.width,n.height,0,g,_,n.data)}}else{y?x&&d.texSubImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,0,0,0,g,_,f[e]):d.texImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,0,v,g,_,f[e]);for(let t=0;t<C.length;t++){let n=C[t];y?x&&d.texSubImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,t+1,0,0,g,_,n.image[e]):d.texImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,t+1,v,g,_,n.image[e])}}}D(t)&&ee(l.TEXTURE_CUBE_MAP),a.__version=i.version,t.onUpdate&&t.onUpdate(t)}e.__version=t.version}function we(e,t,n,r,i,a){let o=m.convert(n.format,n.colorSpace),s=m.convert(n.type),c=O(n.internalFormat,o,s,n.normalized,n.colorSpace),u=f.get(t),p=f.get(n);if(p.__renderTarget=t,!u.__hasExternalTextures){let e=Math.max(1,t.width>>a),n=Math.max(1,t.height>>a);i===l.TEXTURE_3D||i===l.TEXTURE_2D_ARRAY?d.texImage3D(i,a,c,e,n,t.depth,0,o,s,null):d.texImage2D(i,a,c,e,n,0,o,s,null)}d.bindFramebuffer(l.FRAMEBUFFER,e),Fe(t)?g.framebufferTexture2DMultisampleEXT(l.FRAMEBUFFER,r,i,p.__webglTexture,0,Pe(t)):(i===l.TEXTURE_2D||i>=l.TEXTURE_CUBE_MAP_POSITIVE_X&&i<=l.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&l.framebufferTexture2D(l.FRAMEBUFFER,r,i,p.__webglTexture,a),d.bindFramebuffer(l.FRAMEBUFFER,null)}function Te(e,t,n){if(l.bindRenderbuffer(l.RENDERBUFFER,e),t.depthBuffer){let r=t.depthTexture,i=r&&r.isDepthTexture?r.type:null,a=ne(t.stencilBuffer,i),o=t.stencilBuffer?l.DEPTH_STENCIL_ATTACHMENT:l.DEPTH_ATTACHMENT;Fe(t)?g.renderbufferStorageMultisampleEXT(l.RENDERBUFFER,Pe(t),a,t.width,t.height):n?l.renderbufferStorageMultisample(l.RENDERBUFFER,Pe(t),a,t.width,t.height):l.renderbufferStorage(l.RENDERBUFFER,a,t.width,t.height),l.framebufferRenderbuffer(l.FRAMEBUFFER,o,l.RENDERBUFFER,e)}else{let e=t.textures;for(let r=0;r<e.length;r++){let i=e[r],a=m.convert(i.format,i.colorSpace),o=m.convert(i.type),s=O(i.internalFormat,a,o,i.normalized,i.colorSpace);Fe(t)?g.renderbufferStorageMultisampleEXT(l.RENDERBUFFER,Pe(t),s,t.width,t.height):n?l.renderbufferStorageMultisample(l.RENDERBUFFER,Pe(t),s,t.width,t.height):l.renderbufferStorage(l.RENDERBUFFER,s,t.width,t.height)}}l.bindRenderbuffer(l.RENDERBUFFER,null)}function Ee(e,t,n){let r=t.isWebGLCubeRenderTarget===!0;if(d.bindFramebuffer(l.FRAMEBUFFER,e),!(t.depthTexture&&t.depthTexture.isDepthTexture))throw Error(`THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.`);let i=f.get(t.depthTexture);if(i.__renderTarget=t,(!i.__webglTexture||t.depthTexture.image.width!==t.width||t.depthTexture.image.height!==t.height)&&(t.depthTexture.image.width=t.width,t.depthTexture.image.height=t.height,t.depthTexture.needsUpdate=!0),r){if(i.__webglInit===void 0&&(i.__webglInit=!0,t.depthTexture.addEventListener(`dispose`,A)),i.__webglTexture===void 0){i.__webglTexture=l.createTexture(),d.bindTexture(l.TEXTURE_CUBE_MAP,i.__webglTexture),ve(l.TEXTURE_CUBE_MAP,t.depthTexture);let e=m.convert(t.depthTexture.format),n=m.convert(t.depthTexture.type),r;t.depthTexture.format===1026?r=l.DEPTH_COMPONENT24:t.depthTexture.format===1027&&(r=l.DEPTH24_STENCIL8);for(let i=0;i<6;i++)l.texImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+i,0,r,t.width,t.height,0,e,n,null)}}else M(t.depthTexture,0);let a=i.__webglTexture,o=Pe(t),s=r?l.TEXTURE_CUBE_MAP_POSITIVE_X+n:l.TEXTURE_2D,c=t.depthTexture.format===1027?l.DEPTH_STENCIL_ATTACHMENT:l.DEPTH_ATTACHMENT;if(t.depthTexture.format===1026)Fe(t)?g.framebufferTexture2DMultisampleEXT(l.FRAMEBUFFER,c,s,a,0,o):l.framebufferTexture2D(l.FRAMEBUFFER,c,s,a,0);else if(t.depthTexture.format===1027)Fe(t)?g.framebufferTexture2DMultisampleEXT(l.FRAMEBUFFER,c,s,a,0,o):l.framebufferTexture2D(l.FRAMEBUFFER,c,s,a,0);else throw Error(`THREE.WebGLTextures: Unknown depthTexture format.`)}function De(e){let t=f.get(e),n=e.isWebGLCubeRenderTarget===!0;if(t.__boundDepthTexture!==e.depthTexture){let n=e.depthTexture;if(t.__depthDisposeCallback&&t.__depthDisposeCallback(),n){let e=()=>{delete t.__boundDepthTexture,delete t.__depthDisposeCallback,n.removeEventListener(`dispose`,e)};n.addEventListener(`dispose`,e),t.__depthDisposeCallback=e}t.__boundDepthTexture=n}if(e.depthTexture&&!t.__autoAllocateDepthBuffer){if(n)for(let n=0;n<6;n++)Ee(t.__webglFramebuffer[n],e,n);else{let n=e.texture.mipmaps;n&&n.length>0?Ee(t.__webglFramebuffer[0],e,0):Ee(t.__webglFramebuffer,e,0)}}else if(n){t.__webglDepthbuffer=[];for(let n=0;n<6;n++)if(d.bindFramebuffer(l.FRAMEBUFFER,t.__webglFramebuffer[n]),t.__webglDepthbuffer[n]===void 0)t.__webglDepthbuffer[n]=l.createRenderbuffer(),Te(t.__webglDepthbuffer[n],e,!1);else{let r=e.stencilBuffer?l.DEPTH_STENCIL_ATTACHMENT:l.DEPTH_ATTACHMENT,i=t.__webglDepthbuffer[n];l.bindRenderbuffer(l.RENDERBUFFER,i),l.framebufferRenderbuffer(l.FRAMEBUFFER,r,l.RENDERBUFFER,i)}}else{let n=e.texture.mipmaps;if(n&&n.length>0?d.bindFramebuffer(l.FRAMEBUFFER,t.__webglFramebuffer[0]):d.bindFramebuffer(l.FRAMEBUFFER,t.__webglFramebuffer),t.__webglDepthbuffer===void 0)t.__webglDepthbuffer=l.createRenderbuffer(),Te(t.__webglDepthbuffer,e,!1);else{let n=e.stencilBuffer?l.DEPTH_STENCIL_ATTACHMENT:l.DEPTH_ATTACHMENT,r=t.__webglDepthbuffer;l.bindRenderbuffer(l.RENDERBUFFER,r),l.framebufferRenderbuffer(l.FRAMEBUFFER,n,l.RENDERBUFFER,r)}}d.bindFramebuffer(l.FRAMEBUFFER,null)}function Oe(e,t,n){let r=f.get(e);t!==void 0&&we(r.__webglFramebuffer,e,e.texture,l.COLOR_ATTACHMENT0,l.TEXTURE_2D,0),n!==void 0&&De(e)}function ke(e){let t=e.texture,n=f.get(e),r=f.get(t);e.addEventListener(`dispose`,re);let i=e.textures,a=e.isWebGLCubeRenderTarget===!0,o=i.length>1;if(o||(r.__webglTexture===void 0&&(r.__webglTexture=l.createTexture()),r.__version=t.version,h.memory.textures++),a){n.__webglFramebuffer=[];for(let e=0;e<6;e++)if(t.mipmaps&&t.mipmaps.length>0){n.__webglFramebuffer[e]=[];for(let r=0;r<t.mipmaps.length;r++)n.__webglFramebuffer[e][r]=l.createFramebuffer()}else n.__webglFramebuffer[e]=l.createFramebuffer()}else{if(t.mipmaps&&t.mipmaps.length>0){n.__webglFramebuffer=[];for(let e=0;e<t.mipmaps.length;e++)n.__webglFramebuffer[e]=l.createFramebuffer()}else n.__webglFramebuffer=l.createFramebuffer();if(o)for(let e=0,t=i.length;e<t;e++){let t=f.get(i[e]);t.__webglTexture===void 0&&(t.__webglTexture=l.createTexture(),h.memory.textures++)}if(e.samples>0&&Fe(e)===!1){n.__webglMultisampledFramebuffer=l.createFramebuffer(),n.__webglColorRenderbuffer=[],d.bindFramebuffer(l.FRAMEBUFFER,n.__webglMultisampledFramebuffer);for(let t=0;t<i.length;t++){let r=i[t];n.__webglColorRenderbuffer[t]=l.createRenderbuffer(),l.bindRenderbuffer(l.RENDERBUFFER,n.__webglColorRenderbuffer[t]);let a=m.convert(r.format,r.colorSpace),o=m.convert(r.type),s=O(r.internalFormat,a,o,r.normalized,r.colorSpace,e.isXRRenderTarget===!0),c=Pe(e);l.renderbufferStorageMultisample(l.RENDERBUFFER,c,s,e.width,e.height),l.framebufferRenderbuffer(l.FRAMEBUFFER,l.COLOR_ATTACHMENT0+t,l.RENDERBUFFER,n.__webglColorRenderbuffer[t])}l.bindRenderbuffer(l.RENDERBUFFER,null),e.depthBuffer&&(n.__webglDepthRenderbuffer=l.createRenderbuffer(),Te(n.__webglDepthRenderbuffer,e,!0)),d.bindFramebuffer(l.FRAMEBUFFER,null)}}if(a){d.bindTexture(l.TEXTURE_CUBE_MAP,r.__webglTexture),ve(l.TEXTURE_CUBE_MAP,t);for(let r=0;r<6;r++)if(t.mipmaps&&t.mipmaps.length>0)for(let i=0;i<t.mipmaps.length;i++)we(n.__webglFramebuffer[r][i],e,t,l.COLOR_ATTACHMENT0,l.TEXTURE_CUBE_MAP_POSITIVE_X+r,i);else we(n.__webglFramebuffer[r],e,t,l.COLOR_ATTACHMENT0,l.TEXTURE_CUBE_MAP_POSITIVE_X+r,0);D(t)&&ee(l.TEXTURE_CUBE_MAP),d.unbindTexture()}else if(o){for(let t=0,r=i.length;t<r;t++){let r=i[t],a=f.get(r),o=l.TEXTURE_2D;(e.isWebGL3DRenderTarget||e.isWebGLArrayRenderTarget)&&(o=e.isWebGL3DRenderTarget?l.TEXTURE_3D:l.TEXTURE_2D_ARRAY),d.bindTexture(o,a.__webglTexture),ve(o,r),we(n.__webglFramebuffer,e,r,l.COLOR_ATTACHMENT0+t,o,0),D(r)&&ee(o)}d.unbindTexture()}else{let i=l.TEXTURE_2D;if((e.isWebGL3DRenderTarget||e.isWebGLArrayRenderTarget)&&(i=e.isWebGL3DRenderTarget?l.TEXTURE_3D:l.TEXTURE_2D_ARRAY),d.bindTexture(i,r.__webglTexture),ve(i,t),t.mipmaps&&t.mipmaps.length>0)for(let r=0;r<t.mipmaps.length;r++)we(n.__webglFramebuffer[r],e,t,l.COLOR_ATTACHMENT0,i,r);else we(n.__webglFramebuffer,e,t,l.COLOR_ATTACHMENT0,i,0);D(t)&&ee(i),d.unbindTexture()}e.depthBuffer&&De(e)}function Ae(e){let t=e.textures;for(let n=0,r=t.length;n<r;n++){let r=t[n];if(D(r)){let t=te(e),n=f.get(r).__webglTexture;d.bindTexture(t,n),ee(t),d.unbindTexture()}}}let je=[],Me=[];function Ne(e){if(e.samples>0){if(Fe(e)===!1){let t=e.textures,n=e.width,r=e.height,i=l.COLOR_BUFFER_BIT,a=e.stencilBuffer?l.DEPTH_STENCIL_ATTACHMENT:l.DEPTH_ATTACHMENT,o=f.get(e),s=t.length>1;if(s)for(let e=0;e<t.length;e++)d.bindFramebuffer(l.FRAMEBUFFER,o.__webglMultisampledFramebuffer),l.framebufferRenderbuffer(l.FRAMEBUFFER,l.COLOR_ATTACHMENT0+e,l.RENDERBUFFER,null),d.bindFramebuffer(l.FRAMEBUFFER,o.__webglFramebuffer),l.framebufferTexture2D(l.DRAW_FRAMEBUFFER,l.COLOR_ATTACHMENT0+e,l.TEXTURE_2D,null,0);d.bindFramebuffer(l.READ_FRAMEBUFFER,o.__webglMultisampledFramebuffer);let c=e.texture.mipmaps;c&&c.length>0?d.bindFramebuffer(l.DRAW_FRAMEBUFFER,o.__webglFramebuffer[0]):d.bindFramebuffer(l.DRAW_FRAMEBUFFER,o.__webglFramebuffer);for(let c=0;c<t.length;c++){if(e.resolveDepthBuffer&&(e.depthBuffer&&(i|=l.DEPTH_BUFFER_BIT),e.stencilBuffer&&e.resolveStencilBuffer&&(i|=l.STENCIL_BUFFER_BIT)),s){l.framebufferRenderbuffer(l.READ_FRAMEBUFFER,l.COLOR_ATTACHMENT0,l.RENDERBUFFER,o.__webglColorRenderbuffer[c]);let e=f.get(t[c]).__webglTexture;l.framebufferTexture2D(l.DRAW_FRAMEBUFFER,l.COLOR_ATTACHMENT0,l.TEXTURE_2D,e,0)}l.blitFramebuffer(0,0,n,r,0,0,n,r,i,l.NEAREST),_===!0&&(je.length=0,Me.length=0,je.push(l.COLOR_ATTACHMENT0+c),e.depthBuffer&&e.resolveDepthBuffer===!1&&(je.push(a),Me.push(a),l.invalidateFramebuffer(l.DRAW_FRAMEBUFFER,Me)),l.invalidateFramebuffer(l.READ_FRAMEBUFFER,je))}if(d.bindFramebuffer(l.READ_FRAMEBUFFER,null),d.bindFramebuffer(l.DRAW_FRAMEBUFFER,null),s)for(let e=0;e<t.length;e++){d.bindFramebuffer(l.FRAMEBUFFER,o.__webglMultisampledFramebuffer),l.framebufferRenderbuffer(l.FRAMEBUFFER,l.COLOR_ATTACHMENT0+e,l.RENDERBUFFER,o.__webglColorRenderbuffer[e]);let n=f.get(t[e]).__webglTexture;d.bindFramebuffer(l.FRAMEBUFFER,o.__webglFramebuffer),l.framebufferTexture2D(l.DRAW_FRAMEBUFFER,l.COLOR_ATTACHMENT0+e,l.TEXTURE_2D,n,0)}d.bindFramebuffer(l.DRAW_FRAMEBUFFER,o.__webglMultisampledFramebuffer)}else if(e.depthBuffer&&e.resolveDepthBuffer===!1&&_){let t=e.stencilBuffer?l.DEPTH_STENCIL_ATTACHMENT:l.DEPTH_ATTACHMENT;l.invalidateFramebuffer(l.DRAW_FRAMEBUFFER,[t])}}}function Pe(e){return Math.min(p.maxSamples,e.samples)}function Fe(e){let t=f.get(e);return e.samples>0&&u.has(`WEBGL_multisampled_render_to_texture`)===!0&&t.__useRenderToTexture!==!1}function N(e){let t=h.render.frame;y.get(e)!==t&&(y.set(e,t),e.update())}function Ie(e,t){let n=e.colorSpace,r=e.format,i=e.type;return e.isCompressedTexture===!0||e.isVideoTexture===!0||n!==`srgb-linear`&&n!==``&&(U.getTransfer(n)===`srgb`?(r!==1023||i!==1009)&&L(`WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.`):R(`WebGLTextures: Unsupported texture color space:`,n)),t}function Le(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement?(v.width=e.naturalWidth||e.width,v.height=e.naturalHeight||e.height):typeof VideoFrame<`u`&&e instanceof VideoFrame?(v.width=e.displayWidth,v.height=e.displayHeight):(v.width=e.width,v.height=e.height),v}this.allocateTextureUnit=ue,this.resetTextureUnits=se,this.getTextureUnits=ce,this.setTextureUnits=le,this.setTexture2D=M,this.setTexture2DArray=fe,this.setTexture3D=pe,this.setTextureCube=me,this.rebindTextures=Oe,this.setupRenderTarget=ke,this.updateRenderTargetMipmap=Ae,this.updateMultisampleRenderTarget=Ne,this.setupDepthRenderbuffer=De,this.setupFrameBufferTexture=we,this.useMultisampledRTT=Fe,this.isReversedDepthBuffer=function(){return d.buffers.depth.getReversed()}}function jc(e,t){function n(n,r=``){let i,a=U.getTransfer(r);if(n===1009)return e.UNSIGNED_BYTE;if(n===1017)return e.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return e.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return e.UNSIGNED_INT_5_9_9_9_REV;if(n===35899)return e.UNSIGNED_INT_10F_11F_11F_REV;if(n===1010)return e.BYTE;if(n===1011)return e.SHORT;if(n===1012)return e.UNSIGNED_SHORT;if(n===1013)return e.INT;if(n===1014)return e.UNSIGNED_INT;if(n===1015)return e.FLOAT;if(n===1016)return e.HALF_FLOAT;if(n===1021)return e.ALPHA;if(n===1022)return e.RGB;if(n===1023)return e.RGBA;if(n===1026)return e.DEPTH_COMPONENT;if(n===1027)return e.DEPTH_STENCIL;if(n===1028)return e.RED;if(n===1029)return e.RED_INTEGER;if(n===1030)return e.RG;if(n===1031)return e.RG_INTEGER;if(n===1033)return e.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779){if(a===`srgb`){if(i=t.get(`WEBGL_compressed_texture_s3tc_srgb`),i!==null){if(n===33776)return i.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null}else if(i=t.get(`WEBGL_compressed_texture_s3tc`),i!==null){if(n===33776)return i.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null}if(n===35840||n===35841||n===35842||n===35843){if(i=t.get(`WEBGL_compressed_texture_pvrtc`),i!==null){if(n===35840)return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null}if(n===36196||n===37492||n===37496||n===37488||n===37489||n===37490||n===37491){if(i=t.get(`WEBGL_compressed_texture_etc`),i!==null){if(n===36196||n===37492)return a===`srgb`?i.COMPRESSED_SRGB8_ETC2:i.COMPRESSED_RGB8_ETC2;if(n===37496)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:i.COMPRESSED_RGBA8_ETC2_EAC;if(n===37488)return i.COMPRESSED_R11_EAC;if(n===37489)return i.COMPRESSED_SIGNED_R11_EAC;if(n===37490)return i.COMPRESSED_RG11_EAC;if(n===37491)return i.COMPRESSED_SIGNED_RG11_EAC}else return null}if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821){if(i=t.get(`WEBGL_compressed_texture_astc`),i!==null){if(n===37808)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:i.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:i.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:i.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:i.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:i.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:i.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:i.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:i.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:i.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:i.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:i.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:i.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:i.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:i.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null}if(n===36492||n===36494||n===36495){if(i=t.get(`EXT_texture_compression_bptc`),i!==null){if(n===36492)return a===`srgb`?i.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:i.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return i.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return i.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null}if(n===36283||n===36284||n===36285||n===36286){if(i=t.get(`EXT_texture_compression_rgtc`),i!==null){if(n===36283)return i.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return i.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return i.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return i.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null}return n===1020?e.UNSIGNED_INT_24_8:e[n]===void 0?null:e[n]}return{convert:n}}var Mc=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Nc=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Pc=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new ni(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new vi({vertexShader:Mc,fragmentShader:Nc,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new G(new si(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Fc=class extends nt{constructor(e,t){super();let n=this,r=null,i=1,a=null,o=`local-floor`,s=1,c=null,u=null,d=null,f=null,p=null,h=null,g=typeof XRWebGLBinding<`u`,_=new Pc,v={},b=t.getContextAttributes(),x=null,S=null,C=[],D=[],ee=new B,te=null,O=new Xi;O.viewport=new Ot;let ne=new Xi;ne.viewport=new Ot;let k=[O,ne],A=new oa,re=null,ie=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(e){let t=C[e];return t===void 0&&(t=new un,C[e]=t),t.getTargetRaySpace()},this.getControllerGrip=function(e){let t=C[e];return t===void 0&&(t=new un,C[e]=t),t.getGripSpace()},this.getHand=function(e){let t=C[e];return t===void 0&&(t=new un,C[e]=t),t.getHandSpace()};function j(e){let t=D.indexOf(e.inputSource);if(t===-1)return;let n=C[t];n!==void 0&&(n.update(e.inputSource,e.frame,c||a),n.dispatchEvent({type:e.type,data:e.inputSource}))}function ae(){r.removeEventListener(`select`,j),r.removeEventListener(`selectstart`,j),r.removeEventListener(`selectend`,j),r.removeEventListener(`squeeze`,j),r.removeEventListener(`squeezestart`,j),r.removeEventListener(`squeezeend`,j),r.removeEventListener(`end`,ae),r.removeEventListener(`inputsourceschange`,oe);for(let e=0;e<C.length;e++){let t=D[e];t!==null&&(D[e]=null,C[e].disconnect(t))}re=null,ie=null,_.reset();for(let e in v)delete v[e];e.setRenderTarget(x),p=null,f=null,d=null,r=null,S=null,pe.stop(),n.isPresenting=!1,e.setPixelRatio(te),e.setSize(ee.width,ee.height,!1),n.dispatchEvent({type:`sessionend`})}this.setFramebufferScaleFactor=function(e){i=e,n.isPresenting===!0&&L(`WebXRManager: Cannot change framebuffer scale while presenting.`)},this.setReferenceSpaceType=function(e){o=e,n.isPresenting===!0&&L(`WebXRManager: Cannot change reference space type while presenting.`)},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(e){c=e},this.getBaseLayer=function(){return f===null?p:f},this.getBinding=function(){return d===null&&g&&(d=new XRWebGLBinding(r,t)),d},this.getFrame=function(){return h},this.getSession=function(){return r},this.setSession=async function(u){if(r=u,r!==null){if(x=e.getRenderTarget(),r.addEventListener(`select`,j),r.addEventListener(`selectstart`,j),r.addEventListener(`selectend`,j),r.addEventListener(`squeeze`,j),r.addEventListener(`squeezestart`,j),r.addEventListener(`squeezeend`,j),r.addEventListener(`end`,ae),r.addEventListener(`inputsourceschange`,oe),b.xrCompatible!==!0&&await t.makeXRCompatible(),te=e.getPixelRatio(),e.getSize(ee),g&&`createProjectionLayer`in XRWebGLBinding.prototype){let n=null,a=null,o=null;b.depth&&(o=b.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,n=b.stencil?E:T,a=b.stencil?y:m);let s={colorFormat:t.RGBA8,depthFormat:o,scaleFactor:i};d=this.getBinding(),f=d.createProjectionLayer(s),r.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),S=new At(f.textureWidth,f.textureHeight,{format:w,type:l,depthTexture:new ei(f.textureWidth,f.textureHeight,a,void 0,void 0,void 0,void 0,void 0,void 0,n),stencilBuffer:b.stencil,colorSpace:e.outputColorSpace,samples:b.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{let n={antialias:b.antialias,alpha:!0,depth:b.depth,stencil:b.stencil,framebufferScaleFactor:i};p=new XRWebGLLayer(r,t,n),r.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),S=new At(p.framebufferWidth,p.framebufferHeight,{format:w,type:l,colorSpace:e.outputColorSpace,stencilBuffer:b.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(s),c=null,a=await r.requestReferenceSpace(o),pe.setContext(r),pe.start(),n.isPresenting=!0,n.dispatchEvent({type:`sessionstart`})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function oe(e){for(let t=0;t<e.removed.length;t++){let n=e.removed[t],r=D.indexOf(n);r>=0&&(D[r]=null,C[r].disconnect(n))}for(let t=0;t<e.added.length;t++){let n=e.added[t],r=D.indexOf(n);if(r===-1){for(let e=0;e<C.length;e++)if(e>=D.length){D.push(n),r=e;break}else if(D[e]===null){D[e]=n,r=e;break}if(r===-1)break}let i=C[r];i&&i.connect(n)}}let se=new V,ce=new V;function le(e,t,n){se.setFromMatrixPosition(t.matrixWorld),ce.setFromMatrixPosition(n.matrixWorld);let r=se.distanceTo(ce),i=t.projectionMatrix.elements,a=n.projectionMatrix.elements,o=i[14]/(i[10]-1),s=i[14]/(i[10]+1),c=(i[9]+1)/i[5],l=(i[9]-1)/i[5],u=(i[8]-1)/i[0],d=(a[8]+1)/a[0],f=o*u,p=o*d,m=r/(-u+d),h=m*-u;if(t.matrixWorld.decompose(e.position,e.quaternion,e.scale),e.translateX(h),e.translateZ(m),e.matrixWorld.compose(e.position,e.quaternion,e.scale),e.matrixWorldInverse.copy(e.matrixWorld).invert(),i[10]===-1)e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse);else{let t=o+m,n=s+m,i=f-h,a=p+(r-h),u=c*s/n*t,d=l*s/n*t;e.projectionMatrix.makePerspective(i,a,u,d,t,n),e.projectionMatrixInverse.copy(e.projectionMatrix).invert()}}function ue(e,t){t===null?e.matrixWorld.copy(e.matrix):e.matrixWorld.multiplyMatrices(t.matrixWorld,e.matrix),e.matrixWorldInverse.copy(e.matrixWorld).invert()}this.updateCamera=function(e){if(r===null)return;let t=e.near,n=e.far;_.texture!==null&&(_.depthNear>0&&(t=_.depthNear),_.depthFar>0&&(n=_.depthFar)),A.near=ne.near=O.near=t,A.far=ne.far=O.far=n,(re!==A.near||ie!==A.far)&&(r.updateRenderState({depthNear:A.near,depthFar:A.far}),re=A.near,ie=A.far),A.layers.mask=e.layers.mask|6,O.layers.mask=A.layers.mask&-5,ne.layers.mask=A.layers.mask&-3;let i=e.parent,a=A.cameras;ue(A,i);for(let e=0;e<a.length;e++)ue(a[e],i);a.length===2?le(A,O,ne):A.projectionMatrix.copy(O.projectionMatrix),de(e,A,i)};function de(e,t,n){n===null?e.matrix.copy(t.matrixWorld):(e.matrix.copy(n.matrixWorld),e.matrix.invert(),e.matrix.multiply(t.matrixWorld)),e.matrix.decompose(e.position,e.quaternion,e.scale),e.updateMatrixWorld(!0),e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse),e.isPerspectiveCamera&&(e.fov=at*2*Math.atan(1/e.projectionMatrix.elements[5]),e.zoom=1)}this.getCamera=function(){return A},this.getFoveation=function(){if(f!==null||p!==null)return s},this.setFoveation=function(e){s=e,f!==null&&(f.fixedFoveation=e),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=e)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(A)},this.getCameraTexture=function(e){return v[e]};let M=null;function fe(t,i){if(u=i.getViewerPose(c||a),h=i,u!==null){let t=u.views;p!==null&&(e.setRenderTargetFramebuffer(S,p.framebuffer),e.setRenderTarget(S));let i=!1;t.length!==A.cameras.length&&(A.cameras.length=0,i=!0);for(let n=0;n<t.length;n++){let r=t[n],a=null;if(p!==null)a=p.getViewport(r);else{let t=d.getViewSubImage(f,r);a=t.viewport,n===0&&(e.setRenderTargetTextures(S,t.colorTexture,t.depthStencilTexture),e.setRenderTarget(S))}let o=k[n];o===void 0&&(o=new Xi,o.layers.enable(n),o.viewport=new Ot,k[n]=o),o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.projectionMatrix.fromArray(r.projectionMatrix),o.projectionMatrixInverse.copy(o.projectionMatrix).invert(),o.viewport.set(a.x,a.y,a.width,a.height),n===0&&(A.matrix.copy(o.matrix),A.matrix.decompose(A.position,A.quaternion,A.scale)),i===!0&&A.cameras.push(o)}let a=r.enabledFeatures;if(a&&a.includes(`depth-sensing`)&&r.depthUsage==`gpu-optimized`&&g){d=n.getBinding();let e=d.getDepthInformation(t[0]);e&&e.isValid&&e.texture&&_.init(e,r.renderState)}if(a&&a.includes(`camera-access`)&&g){e.state.unbindTexture(),d=n.getBinding();for(let e=0;e<t.length;e++){let n=t[e].camera;if(n){let e=v[n];e||(e=new ni,v[n]=e);let t=d.getCameraImage(n);e.sourceTexture=t}}}}for(let e=0;e<C.length;e++){let t=D[e],n=C[e];t!==null&&n!==void 0&&n.update(t,i,c||a)}M&&M(t,i),i.detectedPlanes&&n.dispatchEvent({type:`planesdetected`,data:i}),h=null}let pe=new Da;pe.setAnimationLoop(fe),this.setAnimationLoop=function(e){M=e},this.dispose=function(){}}},Ic=new Nt,Lc=new H;Lc.set(-1,0,0,0,1,0,0,0,1);function Rc(e,t){function n(e,t){e.matrixAutoUpdate===!0&&e.updateMatrix(),t.value.copy(e.matrix)}function r(t,n){n.color.getRGB(t.fogColor.value,mi(e)),n.isFog?(t.fogNear.value=n.near,t.fogFar.value=n.far):n.isFogExp2&&(t.fogDensity.value=n.density)}function i(e,t,n,r,i){t.isNodeMaterial?t.uniformsNeedUpdate=!1:t.isMeshBasicMaterial?a(e,t):t.isMeshLambertMaterial?(a(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshToonMaterial?(a(e,t),d(e,t)):t.isMeshPhongMaterial?(a(e,t),u(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshStandardMaterial?(a(e,t),f(e,t),t.isMeshPhysicalMaterial&&p(e,t,i)):t.isMeshMatcapMaterial?(a(e,t),m(e,t)):t.isMeshDepthMaterial?a(e,t):t.isMeshDistanceMaterial?(a(e,t),h(e,t)):t.isMeshNormalMaterial?a(e,t):t.isLineBasicMaterial?(o(e,t),t.isLineDashedMaterial&&s(e,t)):t.isPointsMaterial?c(e,t,n,r):t.isSpriteMaterial?l(e,t):t.isShadowMaterial?(e.color.value.copy(t.color),e.opacity.value=t.opacity):t.isShaderMaterial&&(t.uniformsNeedUpdate=!1)}function a(e,r){e.opacity.value=r.opacity,r.color&&e.diffuse.value.copy(r.color),r.emissive&&e.emissive.value.copy(r.emissive).multiplyScalar(r.emissiveIntensity),r.map&&(e.map.value=r.map,n(r.map,e.mapTransform)),r.alphaMap&&(e.alphaMap.value=r.alphaMap,n(r.alphaMap,e.alphaMapTransform)),r.bumpMap&&(e.bumpMap.value=r.bumpMap,n(r.bumpMap,e.bumpMapTransform),e.bumpScale.value=r.bumpScale,r.side===1&&(e.bumpScale.value*=-1)),r.normalMap&&(e.normalMap.value=r.normalMap,n(r.normalMap,e.normalMapTransform),e.normalScale.value.copy(r.normalScale),r.side===1&&e.normalScale.value.negate()),r.displacementMap&&(e.displacementMap.value=r.displacementMap,n(r.displacementMap,e.displacementMapTransform),e.displacementScale.value=r.displacementScale,e.displacementBias.value=r.displacementBias),r.emissiveMap&&(e.emissiveMap.value=r.emissiveMap,n(r.emissiveMap,e.emissiveMapTransform)),r.specularMap&&(e.specularMap.value=r.specularMap,n(r.specularMap,e.specularMapTransform)),r.alphaTest>0&&(e.alphaTest.value=r.alphaTest);let i=t.get(r),a=i.envMap,o=i.envMapRotation;a&&(e.envMap.value=a,e.envMapRotation.value.setFromMatrix4(Ic.makeRotationFromEuler(o)).transpose(),a.isCubeTexture&&a.isRenderTargetTexture===!1&&e.envMapRotation.value.premultiply(Lc),e.reflectivity.value=r.reflectivity,e.ior.value=r.ior,e.refractionRatio.value=r.refractionRatio),r.lightMap&&(e.lightMap.value=r.lightMap,e.lightMapIntensity.value=r.lightMapIntensity,n(r.lightMap,e.lightMapTransform)),r.aoMap&&(e.aoMap.value=r.aoMap,e.aoMapIntensity.value=r.aoMapIntensity,n(r.aoMap,e.aoMapTransform))}function o(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform))}function s(e,t){e.dashSize.value=t.dashSize,e.totalSize.value=t.dashSize+t.gapSize,e.scale.value=t.scale}function c(e,t,r,i){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.size.value=t.size*r,e.scale.value=i*.5,t.map&&(e.map.value=t.map,n(t.map,e.uvTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function l(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.rotation.value=t.rotation,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function u(e,t){e.specular.value.copy(t.specular),e.shininess.value=Math.max(t.shininess,1e-4)}function d(e,t){t.gradientMap&&(e.gradientMap.value=t.gradientMap)}function f(e,t){e.metalness.value=t.metalness,t.metalnessMap&&(e.metalnessMap.value=t.metalnessMap,n(t.metalnessMap,e.metalnessMapTransform)),e.roughness.value=t.roughness,t.roughnessMap&&(e.roughnessMap.value=t.roughnessMap,n(t.roughnessMap,e.roughnessMapTransform)),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)}function p(e,t,r){e.ior.value=t.ior,t.sheen>0&&(e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen),e.sheenRoughness.value=t.sheenRoughness,t.sheenColorMap&&(e.sheenColorMap.value=t.sheenColorMap,n(t.sheenColorMap,e.sheenColorMapTransform)),t.sheenRoughnessMap&&(e.sheenRoughnessMap.value=t.sheenRoughnessMap,n(t.sheenRoughnessMap,e.sheenRoughnessMapTransform))),t.clearcoat>0&&(e.clearcoat.value=t.clearcoat,e.clearcoatRoughness.value=t.clearcoatRoughness,t.clearcoatMap&&(e.clearcoatMap.value=t.clearcoatMap,n(t.clearcoatMap,e.clearcoatMapTransform)),t.clearcoatRoughnessMap&&(e.clearcoatRoughnessMap.value=t.clearcoatRoughnessMap,n(t.clearcoatRoughnessMap,e.clearcoatRoughnessMapTransform)),t.clearcoatNormalMap&&(e.clearcoatNormalMap.value=t.clearcoatNormalMap,n(t.clearcoatNormalMap,e.clearcoatNormalMapTransform),e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale),t.side===1&&e.clearcoatNormalScale.value.negate())),t.dispersion>0&&(e.dispersion.value=t.dispersion),t.iridescence>0&&(e.iridescence.value=t.iridescence,e.iridescenceIOR.value=t.iridescenceIOR,e.iridescenceThicknessMinimum.value=t.iridescenceThicknessRange[0],e.iridescenceThicknessMaximum.value=t.iridescenceThicknessRange[1],t.iridescenceMap&&(e.iridescenceMap.value=t.iridescenceMap,n(t.iridescenceMap,e.iridescenceMapTransform)),t.iridescenceThicknessMap&&(e.iridescenceThicknessMap.value=t.iridescenceThicknessMap,n(t.iridescenceThicknessMap,e.iridescenceThicknessMapTransform))),t.transmission>0&&(e.transmission.value=t.transmission,e.transmissionSamplerMap.value=r.texture,e.transmissionSamplerSize.value.set(r.width,r.height),t.transmissionMap&&(e.transmissionMap.value=t.transmissionMap,n(t.transmissionMap,e.transmissionMapTransform)),e.thickness.value=t.thickness,t.thicknessMap&&(e.thicknessMap.value=t.thicknessMap,n(t.thicknessMap,e.thicknessMapTransform)),e.attenuationDistance.value=t.attenuationDistance,e.attenuationColor.value.copy(t.attenuationColor)),t.anisotropy>0&&(e.anisotropyVector.value.set(t.anisotropy*Math.cos(t.anisotropyRotation),t.anisotropy*Math.sin(t.anisotropyRotation)),t.anisotropyMap&&(e.anisotropyMap.value=t.anisotropyMap,n(t.anisotropyMap,e.anisotropyMapTransform))),e.specularIntensity.value=t.specularIntensity,e.specularColor.value.copy(t.specularColor),t.specularColorMap&&(e.specularColorMap.value=t.specularColorMap,n(t.specularColorMap,e.specularColorMapTransform)),t.specularIntensityMap&&(e.specularIntensityMap.value=t.specularIntensityMap,n(t.specularIntensityMap,e.specularIntensityMapTransform))}function m(e,t){t.matcap&&(e.matcap.value=t.matcap)}function h(e,n){let r=t.get(n).light;e.referencePosition.value.setFromMatrixPosition(r.matrixWorld),e.nearDistance.value=r.shadow.camera.near,e.farDistance.value=r.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:i}}function zc(e,t,n,r){let i={},a={},o=[],s=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function c(e,t){let n=t.program;r.uniformBlockBinding(e,n)}function l(e,n){let o=i[e.id];o===void 0&&(g(e),o=u(e),i[e.id]=o,e.addEventListener(`dispose`,v));let s=n.program;r.updateUBOMapping(e,s);let c=t.render.frame;a[e.id]!==c&&(f(e),a[e.id]=c)}function u(t){let n=d();t.__bindingPointIndex=n;let r=e.createBuffer(),i=t.__size,a=t.usage;return e.bindBuffer(e.UNIFORM_BUFFER,r),e.bufferData(e.UNIFORM_BUFFER,i,a),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,n,r),r}function d(){for(let e=0;e<s;e++)if(o.indexOf(e)===-1)return o.push(e),e;return R(`WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached.`),0}function f(t){let n=i[t.id],r=t.uniforms,a=t.__cache;e.bindBuffer(e.UNIFORM_BUFFER,n);for(let e=0,t=r.length;e<t;e++){let t=r[e];if(Array.isArray(t))for(let n=0,r=t.length;n<r;n++)p(t[n],e,n,a);else p(t,e,0,a)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function p(t,n,r,i){if(h(t,n,r,i)===!0){let n=t.__offset,r=t.value;if(Array.isArray(r)){let e=0;for(let n=0;n<r.length;n++){let i=r[n],a=_(i);m(i,t.__data,e),typeof i!=`number`&&typeof i!=`boolean`&&!i.isMatrix3&&!ArrayBuffer.isView(i)&&(e+=a.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(r,t.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,n,t.__data)}}function m(e,t,n){typeof e==`number`||typeof e==`boolean`?t[0]=e:e.isMatrix3?(t[0]=e.elements[0],t[1]=e.elements[1],t[2]=e.elements[2],t[3]=0,t[4]=e.elements[3],t[5]=e.elements[4],t[6]=e.elements[5],t[7]=0,t[8]=e.elements[6],t[9]=e.elements[7],t[10]=e.elements[8],t[11]=0):ArrayBuffer.isView(e)?t.set(new e.constructor(e.buffer,e.byteOffset,t.length)):e.toArray(t,n)}function h(e,t,n,r){let i=e.value,a=t+`_`+n;if(r[a]===void 0)return r[a]=typeof i==`number`||typeof i==`boolean`?i:ArrayBuffer.isView(i)?i.slice():i.clone(),!0;{let e=r[a];if(typeof i==`number`||typeof i==`boolean`){if(e!==i)return r[a]=i,!0}else if(ArrayBuffer.isView(i))return!0;else if(e.equals(i)===!1)return e.copy(i),!0}return!1}function g(e){let t=e.uniforms,n=0;for(let e=0,r=t.length;e<r;e++){let r=Array.isArray(t[e])?t[e]:[t[e]];for(let e=0,t=r.length;e<t;e++){let t=r[e],i=Array.isArray(t.value)?t.value:[t.value];for(let e=0,r=i.length;e<r;e++){let r=i[e],a=_(r),o=n%16,s=o%a.boundary,c=o+s;n+=s,c!==0&&16-c<a.storage&&(n+=16-c),t.__data=new Float32Array(a.storage/Float32Array.BYTES_PER_ELEMENT),t.__offset=n,n+=a.storage}}}let r=n%16;return r>0&&(n+=16-r),e.__size=n,e.__cache={},this}function _(e){let t={boundary:0,storage:0};return typeof e==`number`||typeof e==`boolean`?(t.boundary=4,t.storage=4):e.isVector2?(t.boundary=8,t.storage=8):e.isVector3||e.isColor?(t.boundary=16,t.storage=12):e.isVector4?(t.boundary=16,t.storage=16):e.isMatrix3?(t.boundary=48,t.storage=48):e.isMatrix4?(t.boundary=64,t.storage=64):e.isTexture?L(`WebGLRenderer: Texture samplers can not be part of an uniforms group.`):ArrayBuffer.isView(e)?(t.boundary=16,t.storage=e.byteLength):L(`WebGLRenderer: Unsupported uniform value type.`,e),t}function v(t){let n=t.target;n.removeEventListener(`dispose`,v);let r=o.indexOf(n.__bindingPointIndex);o.splice(r,1),e.deleteBuffer(i[n.id]),delete i[n.id],delete a[n.id]}function y(){for(let t in i)e.deleteBuffer(i[t]);o=[],i={},a={}}return{bind:c,update:l,dispose:y}}var Bc=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Vc=null;function Hc(){return Vc===null&&(Vc=new Ir(Bc,16,16,te,g),Vc.name=`DFG_LUT`,Vc.minFilter=o,Vc.magFilter=o,Vc.wrapS=t,Vc.wrapT=t,Vc.generateMipmaps=!1,Vc.needsUpdate=!0),Vc}var Uc=class{constructor(e={}){let{canvas:t=Ye(),context:n=null,depth:r=!0,stencil:i=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:s=!0,preserveDrawingBuffer:u=!1,powerPreference:d=`default`,failIfMajorPerformanceCaveat:p=!1,reversedDepthBuffer:h=!1,outputBufferType:b=l}=e;this.isWebGLRenderer=!0;let x;if(n!==null){if(typeof WebGLRenderingContext<`u`&&n instanceof WebGLRenderingContext)throw Error(`THREE.WebGLRenderer: WebGL 1 is not supported since r163.`);x=n.getContextAttributes().alpha}else x=a;let S=b,C=new Set([ne,O,ee]),w=new Set([l,m,f,y,_,v]),T=new Uint32Array(4),E=new Int32Array(4),D=new V,te=null,k=null,A=[],re=[],ie=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let j=this,ae=!1,oe=null,se=null,ce=null,le=null;this._outputColorSpace=Be;let ue=0,de=0,M=null,fe=-1,pe=null,me=new Ot,he=new Ot,ge=null,_e=new W(0),ve=0,ye=t.width,be=t.height,xe=1,Se=null,Ce=null,we=new Ot(0,0,ye,be),Te=new Ot(0,0,ye,be),Ee=!1,De=new Wr,Oe=!1,ke=!1,Ae=new Nt,je=new V,Me=new Ot,Ne={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Pe=!1;function Fe(){return M===null?xe:1}let N=n;function Ie(e,n){return t.getContext(e,n)}try{let e={alpha:!0,depth:r,stencil:i,antialias:o,premultipliedAlpha:s,preserveDrawingBuffer:u,powerPreference:d,failIfMajorPerformanceCaveat:p};if(`setAttribute`in t&&t.setAttribute(`data-engine`,`three.js r185`),t.addEventListener(`webglcontextlost`,lt,!1),t.addEventListener(`webglcontextrestored`,ut,!1),t.addEventListener(`webglcontextcreationerror`,B,!1),N===null){let t=`webgl2`;if(N=Ie(t,e),N===null)throw Ie(t)?Error(`THREE.WebGLRenderer: Error creating WebGL context with your selected attributes.`):Error(`THREE.WebGLRenderer: Error creating WebGL context.`)}}catch(e){throw R(`WebGLRenderer: `+e.message),e}let Le,Re,P,ze,F,I,Ve,He,Ue,We,Ke,qe,Je,Xe,Qe,$e,tt,nt,rt,it,at,ot,z;function st(){Le=new oo(N),Le.init(),at=new jc(N,Le),Re=new Ia(N,Le,e,at),P=new kc(N,Le),Re.reversedDepthBuffer&&h&&P.buffers.depth.setReversed(!0),se=N.createFramebuffer(),ce=N.createFramebuffer(),le=N.createFramebuffer(),ze=new lo(N),F=new lc,I=new Ac(N,Le,P,F,Re,at,ze),Ve=new ao(j),He=new Oa(N),ot=new Pa(N,He),Ue=new so(N,He,ze,ot),We=new fo(N,Ue,He,ot,ze),nt=new uo(N,Re,I),Qe=new La(F),Ke=new cc(j,Ve,Le,Re,ot,Qe),qe=new Rc(j,F),Je=new pc,Xe=new bc(Le),tt=new Na(j,Ve,P,We,x,s),$e=new Oc(j,We,Re),z=new zc(N,ze,Re,P),rt=new Fa(N,Le,ze),it=new co(N,Le,ze),ze.programs=Ke.programs,j.capabilities=Re,j.extensions=Le,j.properties=F,j.renderLists=Je,j.shadowMap=$e,j.state=P,j.info=ze}st(),S!==1009&&(ie=new mo(S,t.width,t.height,o,r,i));let ct=new Fc(j,N);this.xr=ct,this.getContext=function(){return N},this.getContextAttributes=function(){return N.getContextAttributes()},this.forceContextLoss=function(){let e=Le.get(`WEBGL_lose_context`);e&&e.loseContext()},this.forceContextRestore=function(){let e=Le.get(`WEBGL_lose_context`);e&&e.restoreContext()},this.getPixelRatio=function(){return xe},this.setPixelRatio=function(e){e!==void 0&&(xe=e,this.setSize(ye,be,!1))},this.getSize=function(e){return e.set(ye,be)},this.setSize=function(e,n,r=!0){if(ct.isPresenting){L(`WebGLRenderer: Can't change size while VR device is presenting.`);return}ye=e,be=n,t.width=Math.floor(e*xe),t.height=Math.floor(n*xe),r===!0&&(t.style.width=e+`px`,t.style.height=n+`px`),ie!==null&&ie.setSize(t.width,t.height),this.setViewport(0,0,e,n)},this.getDrawingBufferSize=function(e){return e.set(ye*xe,be*xe).floor()},this.setDrawingBufferSize=function(e,n,r){ye=e,be=n,xe=r,t.width=Math.floor(e*r),t.height=Math.floor(n*r),this.setViewport(0,0,e,n)},this.setEffects=function(e){if(S===1009){R(`WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.`);return}if(e){for(let t=0;t<e.length;t++)if(e[t].isOutputPass===!0){L(`WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.`);break}}ie.setEffects(e||[])},this.getCurrentViewport=function(e){return e.copy(me)},this.getViewport=function(e){return e.copy(we)},this.setViewport=function(e,t,n,r){e.isVector4?we.set(e.x,e.y,e.z,e.w):we.set(e,t,n,r),P.viewport(me.copy(we).multiplyScalar(xe).round())},this.getScissor=function(e){return e.copy(Te)},this.setScissor=function(e,t,n,r){e.isVector4?Te.set(e.x,e.y,e.z,e.w):Te.set(e,t,n,r),P.scissor(he.copy(Te).multiplyScalar(xe).round())},this.getScissorTest=function(){return Ee},this.setScissorTest=function(e){P.setScissorTest(Ee=e)},this.setOpaqueSort=function(e){Se=e},this.setTransparentSort=function(e){Ce=e},this.getClearColor=function(e){return e.copy(tt.getClearColor())},this.setClearColor=function(){tt.setClearColor(...arguments)},this.getClearAlpha=function(){return tt.getClearAlpha()},this.setClearAlpha=function(){tt.setClearAlpha(...arguments)},this.clear=function(e=!0,t=!0,n=!0){let r=0;if(e){let e=!1;if(M!==null){let t=M.texture.format;e=C.has(t)}if(e){let e=M.texture.type,t=w.has(e),n=tt.getClearColor(),r=tt.getClearAlpha(),i=n.r,a=n.g,o=n.b;t?(T[0]=i,T[1]=a,T[2]=o,T[3]=r,N.clearBufferuiv(N.COLOR,0,T)):(E[0]=i,E[1]=a,E[2]=o,E[3]=r,N.clearBufferiv(N.COLOR,0,E))}else r|=N.COLOR_BUFFER_BIT}t&&(r|=N.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),n&&(r|=N.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),r!==0&&N.clear(r)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(e){e.setRenderer(this),oe=e},this.dispose=function(){t.removeEventListener(`webglcontextlost`,lt,!1),t.removeEventListener(`webglcontextrestored`,ut,!1),t.removeEventListener(`webglcontextcreationerror`,B,!1),tt.dispose(),Je.dispose(),Xe.dispose(),F.dispose(),Ve.dispose(),We.dispose(),ot.dispose(),z.dispose(),Ke.dispose(),ct.dispose(),ct.removeEventListener(`sessionstart`,gt),ct.removeEventListener(`sessionend`,_t),vt.stop()};function lt(e){e.preventDefault(),Ze(`WebGLRenderer: Context Lost.`),ae=!0}function ut(){Ze(`WebGLRenderer: Context Restored.`),ae=!1;let e=ze.autoReset,t=$e.enabled,n=$e.autoUpdate,r=$e.needsUpdate,i=$e.type;st(),ze.autoReset=e,$e.enabled=t,$e.autoUpdate=n,$e.needsUpdate=r,$e.type=i}function B(e){R(`WebGLRenderer: A WebGL context could not be created. Reason: `,e.statusMessage)}function dt(e){let t=e.target;t.removeEventListener(`dispose`,dt),ft(t)}function ft(e){pt(e),F.remove(e)}function pt(e){let t=F.get(e).programs;t!==void 0&&(t.forEach(function(e){Ke.releaseProgram(e)}),e.isShaderMaterial&&Ke.releaseShaderCache(e))}this.renderBufferDirect=function(e,t,n,r,i,a){t===null&&(t=Ne);let o=i.isMesh&&i.matrixWorld.determinantAffine()<0,s=kt(e,t,n,r,i);P.setMaterial(r,o);let c=n.index,l=1;if(r.wireframe===!0){if(c=Ue.getWireframeAttribute(n),c===void 0)return;l=2}let u=n.drawRange,d=n.attributes.position,f=u.start*l,p=(u.start+u.count)*l;a!==null&&(f=Math.max(f,a.start*l),p=Math.min(p,(a.start+a.count)*l)),c===null?d!=null&&(f=Math.max(f,0),p=Math.min(p,d.count)):(f=Math.max(f,0),p=Math.min(p,c.count));let m=p-f;if(m<0||m===1/0)return;ot.setup(i,r,s,n,c);let h,g=rt;if(c!==null&&(h=He.get(c),g=it,g.setIndex(h)),i.isMesh)r.wireframe===!0?(P.setLineWidth(r.wireframeLinewidth*Fe()),g.setMode(N.LINES)):g.setMode(N.TRIANGLES);else if(i.isLine){let e=r.linewidth;e===void 0&&(e=1),P.setLineWidth(e*Fe()),i.isLineSegments?g.setMode(N.LINES):i.isLineLoop?g.setMode(N.LINE_LOOP):g.setMode(N.LINE_STRIP)}else i.isPoints?g.setMode(N.POINTS):i.isSprite&&g.setMode(N.TRIANGLES);if(i.isBatchedMesh){if(Le.get(`WEBGL_multi_draw`))g.renderMultiDraw(i._multiDrawStarts,i._multiDrawCounts,i._multiDrawCount);else{let e=i._multiDrawStarts,t=i._multiDrawCounts,n=i._multiDrawCount,a=c?He.get(c).bytesPerElement:1,o=F.get(r).currentProgram.getUniforms();for(let r=0;r<n;r++)o.setValue(N,`_gl_DrawID`,r),g.render(e[r]/a,t[r])}}else if(i.isInstancedMesh)g.renderInstances(f,m,i.count);else if(n.isInstancedBufferGeometry){let e=n._maxInstanceCount===void 0?1/0:n._maxInstanceCount,t=Math.min(n.instanceCount,e);g.renderInstances(f,m,t)}else g.render(f,m)};function H(e,t,n){e.transparent===!0&&e.side===2&&e.forceSinglePass===!1?(e.side=1,e.needsUpdate=!0,wt(e,t,n),e.side=0,e.needsUpdate=!0,wt(e,t,n),e.side=2):wt(e,t,n)}this.compile=function(e,t,n=null){n===null&&(n=e),k=Xe.get(n),k.init(t),re.push(k),n.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(k.pushLight(e),e.castShadow&&k.pushShadow(e))}),e!==n&&e.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(k.pushLight(e),e.castShadow&&k.pushShadow(e))}),k.setupLights();let r=new Set;return e.traverse(function(e){if(!(e.isMesh||e.isPoints||e.isLine||e.isSprite))return;let t=e.material;if(t){if(Array.isArray(t))for(let i=0;i<t.length;i++){let a=t[i];H(a,n,e),r.add(a)}else H(t,n,e),r.add(t)}}),k=re.pop(),r},this.compileAsync=function(e,t,n=null){let r=this.compile(e,t,n);return new Promise(t=>{function n(){if(r.forEach(function(e){F.get(e).currentProgram.isReady()&&r.delete(e)}),r.size===0){t(e);return}setTimeout(n,10)}Le.get(`KHR_parallel_shader_compile`)===null?setTimeout(n,10):n()})};let mt=null;function ht(e){mt&&mt(e)}function gt(){vt.stop()}function _t(){vt.start()}let vt=new Da;vt.setAnimationLoop(ht),typeof self<`u`&&vt.setContext(self),this.setAnimationLoop=function(e){mt=e,ct.setAnimationLoop(e),e===null?vt.stop():vt.start()},ct.addEventListener(`sessionstart`,gt),ct.addEventListener(`sessionend`,_t),this.render=function(e,t){if(t!==void 0&&t.isCamera!==!0){R(`WebGLRenderer.render: camera is not an instance of THREE.Camera.`);return}if(ae===!0)return;oe!==null&&oe.renderStart(e,t);let n=ct.enabled===!0&&ct.isPresenting===!0,r=ie!==null&&(M===null||n)&&ie.begin(j,M);if(e.matrixWorldAutoUpdate===!0&&e.updateMatrixWorld(),t.parent===null&&t.matrixWorldAutoUpdate===!0&&t.updateMatrixWorld(),ct.enabled===!0&&ct.isPresenting===!0&&(ie===null||ie.isCompositing()===!1)&&(ct.cameraAutoUpdate===!0&&ct.updateCamera(t),t=ct.getCamera()),e.isScene===!0&&e.onBeforeRender(j,e,t,M),k=Xe.get(e,re.length),k.init(t),k.state.textureUnits=I.getTextureUnits(),re.push(k),Ae.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),De.setFromProjectionMatrix(Ae,Ge,t.reversedDepth),ke=this.localClippingEnabled,Oe=Qe.init(this.clippingPlanes,ke),te=Je.get(e,A.length),te.init(),A.push(te),ct.enabled===!0&&ct.isPresenting===!0){let e=j.xr.getDepthSensingMesh();e!==null&&yt(e,t,-1/0,j.sortObjects)}yt(e,t,0,j.sortObjects),te.finish(),j.sortObjects===!0&&te.sort(Se,Ce,t.reversedDepth),Pe=ct.enabled===!1||ct.isPresenting===!1||ct.hasDepthSensing()===!1,Pe&&tt.addToRenderList(te,e),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),Oe===!0&&Qe.beginShadows();let i=k.state.shadowsArray;if($e.render(i,e,t),Oe===!0&&Qe.endShadows(),(r&&ie.hasRenderPass())===!1){let n=te.opaque,r=te.transmissive;if(k.setupLights(),t.isArrayCamera){let i=t.cameras;if(r.length>0)for(let t=0,a=i.length;t<a;t++){let a=i[t];xt(n,r,e,a)}Pe&&tt.render(e);for(let t=0,n=i.length;t<n;t++){let n=i[t];bt(te,e,n,n.viewport)}}else r.length>0&&xt(n,r,e,t),Pe&&tt.render(e),bt(te,e,t)}M!==null&&de===0&&(I.updateMultisampleRenderTarget(M),I.updateRenderTargetMipmap(M)),r&&ie.end(j),e.isScene===!0&&e.onAfterRender(j,e,t),ot.resetDefaultState(),fe=-1,pe=null,re.pop(),re.length>0?(k=re[re.length-1],I.setTextureUnits(k.state.textureUnits),Oe===!0&&Qe.setGlobalState(j.clippingPlanes,k.state.camera)):k=null,A.pop(),te=A.length>0?A[A.length-1]:null,oe!==null&&oe.renderEnd()};function yt(e,t,n,r){if(e.visible===!1)return;if(e.layers.test(t.layers)){if(e.isGroup)n=e.renderOrder;else if(e.isLOD)e.autoUpdate===!0&&e.update(t);else if(e.isLightProbeGrid)k.pushLightProbeGrid(e);else if(e.isLight)k.pushLight(e),e.castShadow&&k.pushShadow(e);else if(e.isSprite){if(!e.frustumCulled||De.intersectsSprite(e)){r&&Me.setFromMatrixPosition(e.matrixWorld).applyMatrix4(Ae);let t=We.update(e),i=e.material;i.visible&&te.push(e,t,i,n,Me.z,null)}}else if((e.isMesh||e.isLine||e.isPoints)&&(!e.frustumCulled||De.intersectsObject(e))){let t=We.update(e),i=e.material;if(r&&(e.boundingSphere===void 0?(t.boundingSphere===null&&t.computeBoundingSphere(),Me.copy(t.boundingSphere.center)):(e.boundingSphere===null&&e.computeBoundingSphere(),Me.copy(e.boundingSphere.center)),Me.applyMatrix4(e.matrixWorld).applyMatrix4(Ae)),Array.isArray(i)){let r=t.groups;for(let a=0,o=r.length;a<o;a++){let o=r[a],s=i[o.materialIndex];s&&s.visible&&te.push(e,t,s,n,Me.z,o)}}else i.visible&&te.push(e,t,i,n,Me.z,null)}}let i=e.children;for(let e=0,a=i.length;e<a;e++)yt(i[e],t,n,r)}function bt(e,t,n,r){let{opaque:i,transmissive:a,transparent:o}=e;k.setupLightsView(n),Oe===!0&&Qe.setGlobalState(j.clippingPlanes,n),r&&P.viewport(me.copy(r)),i.length>0&&St(i,t,n),a.length>0&&St(a,t,n),o.length>0&&St(o,t,n),P.buffers.depth.setTest(!0),P.buffers.depth.setMask(!0),P.buffers.color.setMask(!0),P.setPolygonOffset(!1)}function xt(e,t,n,r){if((n.isScene===!0?n.overrideMaterial:null)!==null)return;if(k.state.transmissionRenderTarget[r.id]===void 0){let e=Le.has(`EXT_color_buffer_half_float`)||Le.has(`EXT_color_buffer_float`);k.state.transmissionRenderTarget[r.id]=new At(1,1,{generateMipmaps:!0,type:e?g:l,minFilter:c,samples:Math.max(4,Re.samples),stencilBuffer:i,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:U.workingColorSpace})}let a=k.state.transmissionRenderTarget[r.id],o=r.viewport||me;a.setSize(o.z*j.transmissionResolutionScale,o.w*j.transmissionResolutionScale);let s=j.getRenderTarget(),u=j.getActiveCubeFace(),d=j.getActiveMipmapLevel();j.setRenderTarget(a),j.getClearColor(_e),ve=j.getClearAlpha(),ve<1&&j.setClearColor(16777215,.5),j.clear(),Pe&&tt.render(n);let f=j.toneMapping;j.toneMapping=0;let p=r.viewport;if(r.viewport!==void 0&&(r.viewport=void 0),k.setupLightsView(r),Oe===!0&&Qe.setGlobalState(j.clippingPlanes,r),St(e,n,r),I.updateMultisampleRenderTarget(a),I.updateRenderTargetMipmap(a),Le.has(`WEBGL_multisampled_render_to_texture`)===!1){let e=!1;for(let i=0,a=t.length;i<a;i++){let{object:a,geometry:o,material:s,group:c}=t[i];if(s.side===2&&a.layers.test(r.layers)){let t=s.side;s.side=1,s.needsUpdate=!0,Ct(a,n,r,o,s,c),s.side=t,s.needsUpdate=!0,e=!0}}e===!0&&(I.updateMultisampleRenderTarget(a),I.updateRenderTargetMipmap(a))}j.setRenderTarget(s,u,d),j.setClearColor(_e,ve),p!==void 0&&(r.viewport=p),j.toneMapping=f}function St(e,t,n){let r=t.isScene===!0?t.overrideMaterial:null;for(let i=0,a=e.length;i<a;i++){let a=e[i],{object:o,geometry:s,group:c}=a,l=a.material;l.allowOverride===!0&&r!==null&&(l=r),o.layers.test(n.layers)&&Ct(o,t,n,s,l,c)}}function Ct(e,t,n,r,i,a){e.onBeforeRender(j,t,n,r,i,a),e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse,e.matrixWorld),e.normalMatrix.getNormalMatrix(e.modelViewMatrix),i.onBeforeRender(j,t,n,r,e,a),i.transparent===!0&&i.side===2&&i.forceSinglePass===!1?(i.side=1,i.needsUpdate=!0,j.renderBufferDirect(n,t,r,i,e,a),i.side=0,i.needsUpdate=!0,j.renderBufferDirect(n,t,r,i,e,a),i.side=2):j.renderBufferDirect(n,t,r,i,e,a),e.onAfterRender(j,t,n,r,i,a)}function wt(e,t,n){t.isScene!==!0&&(t=Ne);let r=F.get(e),i=k.state.lights,a=k.state.shadowsArray,o=i.state.version,s=Ke.getParameters(e,i.state,a,t,n,k.state.lightProbeGridArray),c=Ke.getProgramCacheKey(s),l=r.programs;r.environment=e.isMeshStandardMaterial||e.isMeshLambertMaterial||e.isMeshPhongMaterial?t.environment:null,r.fog=t.fog;let u=e.isMeshStandardMaterial||e.isMeshLambertMaterial&&!e.envMap||e.isMeshPhongMaterial&&!e.envMap;r.envMap=Ve.get(e.envMap||r.environment,u),r.envMapRotation=r.environment!==null&&e.envMap===null?t.environmentRotation:e.envMapRotation,l===void 0&&(e.addEventListener(`dispose`,dt),l=new Map,r.programs=l);let d=l.get(c);if(d!==void 0){if(r.currentProgram===d&&r.lightsStateVersion===o)return Et(e,s),d}else s.uniforms=Ke.getUniforms(e),oe!==null&&e.isNodeMaterial&&oe.build(e,n,s),e.onBeforeCompile(s,j),d=Ke.acquireProgram(s,c),l.set(c,d),r.uniforms=s.uniforms;let f=r.uniforms;return(!e.isShaderMaterial&&!e.isRawShaderMaterial||e.clipping===!0)&&(f.clippingPlanes=Qe.uniform),Et(e,s),r.needsLights=Mt(e),r.lightsStateVersion=o,r.needsLights&&(f.ambientLightColor.value=i.state.ambient,f.lightProbe.value=i.state.probe,f.directionalLights.value=i.state.directional,f.directionalLightShadows.value=i.state.directionalShadow,f.spotLights.value=i.state.spot,f.spotLightShadows.value=i.state.spotShadow,f.rectAreaLights.value=i.state.rectArea,f.ltc_1.value=i.state.rectAreaLTC1,f.ltc_2.value=i.state.rectAreaLTC2,f.pointLights.value=i.state.point,f.pointLightShadows.value=i.state.pointShadow,f.hemisphereLights.value=i.state.hemi,f.directionalShadowMatrix.value=i.state.directionalShadowMatrix,f.spotLightMatrix.value=i.state.spotLightMatrix,f.spotLightMap.value=i.state.spotLightMap,f.pointShadowMatrix.value=i.state.pointShadowMatrix),r.lightProbeGrid=k.state.lightProbeGridArray.length>0,r.currentProgram=d,r.uniformsList=null,d}function Tt(e){if(e.uniformsList===null){let t=e.currentProgram.getUniforms();e.uniformsList=xs.seqWithValue(t.seq,e.uniforms)}return e.uniformsList}function Et(e,t){let n=F.get(e);n.outputColorSpace=t.outputColorSpace,n.batching=t.batching,n.batchingColor=t.batchingColor,n.instancing=t.instancing,n.instancingColor=t.instancingColor,n.instancingMorph=t.instancingMorph,n.skinning=t.skinning,n.morphTargets=t.morphTargets,n.morphNormals=t.morphNormals,n.morphColors=t.morphColors,n.morphTargetsCount=t.morphTargetsCount,n.numClippingPlanes=t.numClippingPlanes,n.numIntersection=t.numClipIntersection,n.vertexAlphas=t.vertexAlphas,n.vertexTangents=t.vertexTangents,n.toneMapping=t.toneMapping}function Dt(e,t){if(e.length===0)return null;if(e.length===1)return e[0].texture===null?null:e[0];D.setFromMatrixPosition(t.matrixWorld);for(let t=0,n=e.length;t<n;t++){let n=e[t];if(n.texture!==null&&n.boundingBox.containsPoint(D))return n}return null}function kt(e,t,n,r,i){t.isScene!==!0&&(t=Ne),I.resetTextureUnits();let a=t.fog,o=r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial?t.environment:null,s=M===null?j.outputColorSpace:M.isXRRenderTarget===!0?M.texture.colorSpace:U.workingColorSpace,c=r.isMeshStandardMaterial||r.isMeshLambertMaterial&&!r.envMap||r.isMeshPhongMaterial&&!r.envMap,l=Ve.get(r.envMap||o,c),u=r.vertexColors===!0&&!!n.attributes.color&&n.attributes.color.itemSize===4,d=!!n.attributes.tangent&&(!!r.normalMap||r.anisotropy>0),f=!!n.morphAttributes.position,p=!!n.morphAttributes.normal,m=!!n.morphAttributes.color,h=0;r.toneMapped&&(M===null||M.isXRRenderTarget===!0)&&(h=j.toneMapping);let g=n.morphAttributes.position||n.morphAttributes.normal||n.morphAttributes.color,_=g===void 0?0:g.length,v=F.get(r),y=k.state.lights;if(Oe===!0&&(ke===!0||e!==pe)){let t=e===pe&&r.id===fe;Qe.setState(r,e,t)}let b=!1;r.version===v.__version?v.needsLights&&v.lightsStateVersion!==y.state.version?b=!0:v.outputColorSpace===s?i.isBatchedMesh&&v.batching===!1||!i.isBatchedMesh&&v.batching===!0||i.isBatchedMesh&&v.batchingColor===!0&&i.colorTexture===null||i.isBatchedMesh&&v.batchingColor===!1&&i.colorTexture!==null||i.isInstancedMesh&&v.instancing===!1||!i.isInstancedMesh&&v.instancing===!0||i.isSkinnedMesh&&v.skinning===!1||!i.isSkinnedMesh&&v.skinning===!0||i.isInstancedMesh&&v.instancingColor===!0&&i.instanceColor===null||i.isInstancedMesh&&v.instancingColor===!1&&i.instanceColor!==null||i.isInstancedMesh&&v.instancingMorph===!0&&i.morphTexture===null||i.isInstancedMesh&&v.instancingMorph===!1&&i.morphTexture!==null?b=!0:v.envMap===l?r.fog===!0&&v.fog!==a||v.numClippingPlanes!==void 0&&(v.numClippingPlanes!==Qe.numPlanes||v.numIntersection!==Qe.numIntersection)?b=!0:v.vertexAlphas===u&&v.vertexTangents===d&&v.morphTargets===f&&v.morphNormals===p&&v.morphColors===m&&v.toneMapping===h&&v.morphTargetsCount===_?!!v.lightProbeGrid!=k.state.lightProbeGridArray.length>0&&(b=!0):b=!0:b=!0:b=!0:(b=!0,v.__version=r.version);let x=v.currentProgram;b===!0&&(x=wt(r,t,i),oe&&r.isNodeMaterial&&oe.onUpdateProgram(r,x,v));let S=!1,C=!1,w=!1,T=x.getUniforms(),E=v.uniforms;if(P.useProgram(x.program)&&(S=!0,C=!0,w=!0),r.id!==fe&&(fe=r.id,C=!0),v.needsLights){let e=Dt(k.state.lightProbeGridArray,i);v.lightProbeGrid!==e&&(v.lightProbeGrid=e,C=!0)}if(S||pe!==e){P.buffers.depth.getReversed()&&e.reversedDepth!==!0&&(e._reversedDepth=!0,e.updateProjectionMatrix()),T.setValue(N,`projectionMatrix`,e.projectionMatrix),T.setValue(N,`viewMatrix`,e.matrixWorldInverse);let t=T.map.cameraPosition;t!==void 0&&t.setValue(N,je.setFromMatrixPosition(e.matrixWorld)),Re.logarithmicDepthBuffer&&T.setValue(N,`logDepthBufFC`,2/(Math.log(e.far+1)/Math.LN2)),(r.isMeshPhongMaterial||r.isMeshToonMaterial||r.isMeshLambertMaterial||r.isMeshBasicMaterial||r.isMeshStandardMaterial||r.isShaderMaterial)&&T.setValue(N,`isOrthographic`,e.isOrthographicCamera===!0),pe!==e&&(pe=e,C=!0,w=!0)}if(v.needsLights&&(y.state.directionalShadowMap.length>0&&T.setValue(N,`directionalShadowMap`,y.state.directionalShadowMap,I),y.state.spotShadowMap.length>0&&T.setValue(N,`spotShadowMap`,y.state.spotShadowMap,I),y.state.pointShadowMap.length>0&&T.setValue(N,`pointShadowMap`,y.state.pointShadowMap,I)),i.isSkinnedMesh){T.setOptional(N,i,`bindMatrix`),T.setOptional(N,i,`bindMatrixInverse`);let e=i.skeleton;e&&(e.boneTexture===null&&e.computeBoneTexture(),T.setValue(N,`boneTexture`,e.boneTexture,I))}i.isBatchedMesh&&(T.setOptional(N,i,`batchingTexture`),T.setValue(N,`batchingTexture`,i._matricesTexture,I),T.setOptional(N,i,`batchingIdTexture`),T.setValue(N,`batchingIdTexture`,i._indirectTexture,I),T.setOptional(N,i,`batchingColorTexture`),i._colorsTexture!==null&&T.setValue(N,`batchingColorTexture`,i._colorsTexture,I));let D=n.morphAttributes;if((D.position!==void 0||D.normal!==void 0||D.color!==void 0)&&nt.update(i,n,x),(C||v.receiveShadow!==i.receiveShadow)&&(v.receiveShadow=i.receiveShadow,T.setValue(N,`receiveShadow`,i.receiveShadow)),(r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial)&&r.envMap===null&&t.environment!==null&&(E.envMapIntensity.value=t.environmentIntensity),E.dfgLUT!==void 0&&(E.dfgLUT.value=Hc()),C){if(T.setValue(N,`toneMappingExposure`,j.toneMappingExposure),v.needsLights&&jt(E,w),a&&r.fog===!0&&qe.refreshFogUniforms(E,a),qe.refreshMaterialUniforms(E,r,xe,be,k.state.transmissionRenderTarget[e.id]),v.needsLights&&v.lightProbeGrid){let e=v.lightProbeGrid;E.probesSH.value=e.texture,E.probesMin.value.copy(e.boundingBox.min),E.probesMax.value.copy(e.boundingBox.max),E.probesResolution.value.copy(e.resolution)}xs.upload(N,Tt(v),E,I)}if(r.isShaderMaterial&&r.uniformsNeedUpdate===!0&&(xs.upload(N,Tt(v),E,I),r.uniformsNeedUpdate=!1),r.isSpriteMaterial&&T.setValue(N,`center`,i.center),T.setValue(N,`modelViewMatrix`,i.modelViewMatrix),T.setValue(N,`normalMatrix`,i.normalMatrix),T.setValue(N,`modelMatrix`,i.matrixWorld),r.uniformsGroups!==void 0){let e=r.uniformsGroups;for(let t=0,n=e.length;t<n;t++){let n=e[t];z.update(n,x),z.bind(n,x)}}return x}function jt(e,t){e.ambientLightColor.needsUpdate=t,e.lightProbe.needsUpdate=t,e.directionalLights.needsUpdate=t,e.directionalLightShadows.needsUpdate=t,e.pointLights.needsUpdate=t,e.pointLightShadows.needsUpdate=t,e.spotLights.needsUpdate=t,e.spotLightShadows.needsUpdate=t,e.rectAreaLights.needsUpdate=t,e.hemisphereLights.needsUpdate=t}function Mt(e){return e.isMeshLambertMaterial||e.isMeshToonMaterial||e.isMeshPhongMaterial||e.isMeshStandardMaterial||e.isShadowMaterial||e.isShaderMaterial&&e.lights===!0}this.getActiveCubeFace=function(){return ue},this.getActiveMipmapLevel=function(){return de},this.getRenderTarget=function(){return M},this.setRenderTargetTextures=function(e,t,n){let r=F.get(e);r.__autoAllocateDepthBuffer=e.resolveDepthBuffer===!1,r.__autoAllocateDepthBuffer===!1&&(r.__useRenderToTexture=!1),F.get(e.texture).__webglTexture=t,F.get(e.depthTexture).__webglTexture=r.__autoAllocateDepthBuffer?void 0:n,r.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(e,t){let n=F.get(e);n.__webglFramebuffer=t,n.__useDefaultFramebuffer=t===void 0},this.setRenderTarget=function(e,t=0,n=0){M=e,ue=t,de=n;let r=null,i=!1,a=!1;if(e){let o=F.get(e);if(o.__useDefaultFramebuffer!==void 0){P.bindFramebuffer(N.FRAMEBUFFER,o.__webglFramebuffer),me.copy(e.viewport),he.copy(e.scissor),ge=e.scissorTest,P.viewport(me),P.scissor(he),P.setScissorTest(ge),fe=-1;return}if(o.__webglFramebuffer===void 0)I.setupRenderTarget(e);else if(o.__hasExternalTextures)I.rebindTextures(e,F.get(e.texture).__webglTexture,F.get(e.depthTexture).__webglTexture);else if(e.depthBuffer){let t=e.depthTexture;if(o.__boundDepthTexture!==t){if(t!==null&&F.has(t)&&(e.width!==t.image.width||e.height!==t.image.height))throw Error(`THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.`);I.setupDepthRenderbuffer(e)}}let s=e.texture;(s.isData3DTexture||s.isDataArrayTexture||s.isCompressedArrayTexture)&&(a=!0);let c=F.get(e).__webglFramebuffer;e.isWebGLCubeRenderTarget?(r=Array.isArray(c[t])?c[t][n]:c[t],i=!0):r=e.samples>0&&I.useMultisampledRTT(e)===!1?F.get(e).__webglMultisampledFramebuffer:Array.isArray(c)?c[n]:c,me.copy(e.viewport),he.copy(e.scissor),ge=e.scissorTest}else me.copy(we).multiplyScalar(xe).floor(),he.copy(Te).multiplyScalar(xe).floor(),ge=Ee;if(n!==0&&(r=se),P.bindFramebuffer(N.FRAMEBUFFER,r)&&P.drawBuffers(e,r),P.viewport(me),P.scissor(he),P.setScissorTest(ge),i){let r=F.get(e.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_CUBE_MAP_POSITIVE_X+t,r.__webglTexture,n)}else if(a){let r=t;for(let t=0;t<e.textures.length;t++){let i=F.get(e.textures[t]);N.framebufferTextureLayer(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0+t,i.__webglTexture,n,r)}}else if(e!==null&&n!==0){let t=F.get(e.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,t.__webglTexture,n)}fe=-1},this.readRenderTargetPixels=function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget)){R(`WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);return}let c=F.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){P.bindFramebuffer(N.FRAMEBUFFER,c);try{let o=e.textures[s],c=o.format,l=o.type;if(e.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+s),!Re.textureFormatReadable(c)){R(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.`);return}if(!Re.textureTypeReadable(l)){R(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.`);return}t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i&&N.readPixels(t,n,r,i,at.convert(c),at.convert(l),a)}finally{let e=M===null?null:F.get(M).__webglFramebuffer;P.bindFramebuffer(N.FRAMEBUFFER,e)}}},this.readRenderTargetPixelsAsync=async function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget))throw Error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);let c=F.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){if(t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i){P.bindFramebuffer(N.FRAMEBUFFER,c);let o=e.textures[s],l=o.format,u=o.type;if(e.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+s),!Re.textureFormatReadable(l))throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.`);if(!Re.textureTypeReadable(u))throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.`);let d=N.createBuffer();N.bindBuffer(N.PIXEL_PACK_BUFFER,d),N.bufferData(N.PIXEL_PACK_BUFFER,a.byteLength,N.STREAM_READ),N.readPixels(t,n,r,i,at.convert(l),at.convert(u),0);let f=M===null?null:F.get(M).__webglFramebuffer;P.bindFramebuffer(N.FRAMEBUFFER,f);let p=N.fenceSync(N.SYNC_GPU_COMMANDS_COMPLETE,0);return N.flush(),await et(N,p,4),N.bindBuffer(N.PIXEL_PACK_BUFFER,d),N.getBufferSubData(N.PIXEL_PACK_BUFFER,0,a),N.deleteBuffer(d),N.deleteSync(p),a}throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.`)}},this.copyFramebufferToTexture=function(e,t=null,n=0){let r=2**-n,i=Math.floor(e.image.width*r),a=Math.floor(e.image.height*r),o=t===null?0:t.x,s=t===null?0:t.y;I.setTexture2D(e,0),N.copyTexSubImage2D(N.TEXTURE_2D,n,0,0,o,s,i,a),P.unbindTexture()},this.copyTextureToTexture=function(e,t,n=null,r=null,i=0,a=0){let o,s,c,l,u,d,f,p,m,h=e.isCompressedTexture?e.mipmaps[a]:e.image;if(n!==null)o=n.max.x-n.min.x,s=n.max.y-n.min.y,c=n.isBox3?n.max.z-n.min.z:1,l=n.min.x,u=n.min.y,d=n.isBox3?n.min.z:0;else{let t=2**-i;o=Math.floor(h.width*t),s=Math.floor(h.height*t),c=e.isDataArrayTexture?h.depth:e.isData3DTexture?Math.floor(h.depth*t):1,l=0,u=0,d=0}r===null?(f=0,p=0,m=0):(f=r.x,p=r.y,m=r.z);let g=at.convert(t.format),_=at.convert(t.type),v;t.isData3DTexture?(I.setTexture3D(t,0),v=N.TEXTURE_3D):t.isDataArrayTexture||t.isCompressedArrayTexture?(I.setTexture2DArray(t,0),v=N.TEXTURE_2D_ARRAY):(I.setTexture2D(t,0),v=N.TEXTURE_2D),P.activeTexture(N.TEXTURE0),P.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,t.flipY),P.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),P.pixelStorei(N.UNPACK_ALIGNMENT,t.unpackAlignment);let y=P.getParameter(N.UNPACK_ROW_LENGTH),b=P.getParameter(N.UNPACK_IMAGE_HEIGHT),x=P.getParameter(N.UNPACK_SKIP_PIXELS),S=P.getParameter(N.UNPACK_SKIP_ROWS),C=P.getParameter(N.UNPACK_SKIP_IMAGES);P.pixelStorei(N.UNPACK_ROW_LENGTH,h.width),P.pixelStorei(N.UNPACK_IMAGE_HEIGHT,h.height),P.pixelStorei(N.UNPACK_SKIP_PIXELS,l),P.pixelStorei(N.UNPACK_SKIP_ROWS,u),P.pixelStorei(N.UNPACK_SKIP_IMAGES,d);let w=e.isDataArrayTexture||e.isData3DTexture,T=t.isDataArrayTexture||t.isData3DTexture;if(e.isDepthTexture){let n=F.get(e),r=F.get(t),h=F.get(n.__renderTarget),g=F.get(r.__renderTarget);P.bindFramebuffer(N.READ_FRAMEBUFFER,h.__webglFramebuffer),P.bindFramebuffer(N.DRAW_FRAMEBUFFER,g.__webglFramebuffer);for(let n=0;n<c;n++)w&&(N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,F.get(e).__webglTexture,i,d+n),N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,F.get(t).__webglTexture,a,m+n)),N.blitFramebuffer(l,u,o,s,f,p,o,s,N.DEPTH_BUFFER_BIT,N.NEAREST);P.bindFramebuffer(N.READ_FRAMEBUFFER,null),P.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else if(i!==0||e.isRenderTargetTexture||F.has(e)){let n=F.get(e),r=F.get(t);P.bindFramebuffer(N.READ_FRAMEBUFFER,ce),P.bindFramebuffer(N.DRAW_FRAMEBUFFER,le);for(let e=0;e<c;e++)w?N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,n.__webglTexture,i,d+e):N.framebufferTexture2D(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,n.__webglTexture,i),T?N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,r.__webglTexture,a,m+e):N.framebufferTexture2D(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,r.__webglTexture,a),i===0?T?N.copyTexSubImage3D(v,a,f,p,m+e,l,u,o,s):N.copyTexSubImage2D(v,a,f,p,l,u,o,s):N.blitFramebuffer(l,u,o,s,f,p,o,s,N.COLOR_BUFFER_BIT,N.NEAREST);P.bindFramebuffer(N.READ_FRAMEBUFFER,null),P.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else T?e.isDataTexture||e.isData3DTexture?N.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h.data):t.isCompressedArrayTexture?N.compressedTexSubImage3D(v,a,f,p,m,o,s,c,g,h.data):N.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h):e.isDataTexture?N.texSubImage2D(N.TEXTURE_2D,a,f,p,o,s,g,_,h.data):e.isCompressedTexture?N.compressedTexSubImage2D(N.TEXTURE_2D,a,f,p,h.width,h.height,g,h.data):N.texSubImage2D(N.TEXTURE_2D,a,f,p,o,s,g,_,h);P.pixelStorei(N.UNPACK_ROW_LENGTH,y),P.pixelStorei(N.UNPACK_IMAGE_HEIGHT,b),P.pixelStorei(N.UNPACK_SKIP_PIXELS,x),P.pixelStorei(N.UNPACK_SKIP_ROWS,S),P.pixelStorei(N.UNPACK_SKIP_IMAGES,C),a===0&&t.generateMipmaps&&N.generateMipmap(v),P.unbindTexture()},this.initRenderTarget=function(e){F.get(e).__webglFramebuffer===void 0&&I.setupRenderTarget(e)},this.initTexture=function(e){e.isCubeTexture?I.setTextureCube(e,0):e.isData3DTexture?I.setTexture3D(e,0):e.isDataArrayTexture||e.isCompressedArrayTexture?I.setTexture2DArray(e,0):I.setTexture2D(e,0),P.unbindTexture()},this.resetState=function(){ue=0,de=0,M=null,P.reset(),ot.reset()},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}get coordinateSystem(){return Ge}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=U._getDrawingBufferColorSpace(e),t.unpackColorSpace=U._getUnpackColorSpace()}},Wc=class{clock=0;entries=[];after(e,t,n){this.entries.push({time:this.clock+Math.max(0,e),fn:t,tag:n})}sequence(e,t){let n=0;for(let[r,i]of e)n+=r,this.after(n,i,t)}update(e){if(this.entries.length===0)return;this.clock+=e;let t=0,n=this.entries.length,r=[];for(let e=0;e<n;e++){let n=this.entries[e];n.time<=this.clock?r.push(n):this.entries[t++]=n}for(let e=n;e<this.entries.length;e++)this.entries[t++]=this.entries[e];this.entries.length=t;for(let e of r)e.fn()}cancel(e){this.entries=this.entries.filter(t=>t.tag!==e)}clear(){this.entries.length=0}get pending(){return this.entries.length}},Gc=e=>1-(1-e)**3,Kc=e=>-(Math.cos(Math.PI*e)-1)/2;function qc(e=1.7){let t=e,n=t+1;return e=>1+n*(e-1)**3+t*(e-1)**2}function Jc(e=1,t=.35){return n=>{if(n<=0)return 0;if(n>=1)return 1;let r=t/(2*Math.PI)*Math.asin(1/Math.max(1,e));return e*2**(-10*n)*Math.sin((n-r)*(2*Math.PI)/t)+1}}var Yc=e=>e<0?0:e>1?1:e,Xc=(e,t,n)=>e+(t-e)*n;function Zc(e,t,n,r){return Xc(e,t,1-Math.exp(-n*r))}var Qc=class{duration;ease;tag;elapsed=0;delay;onUpdate;onComplete;dead=!1;constructor(e){this.duration=Math.max(1e-4,e.duration),this.ease=e.ease??Gc,this.delay=e.delay??0,this.onUpdate=e.onUpdate,this.onComplete=e.onComplete,this.tag=e.tag}get finished(){return this.dead}kill(){this.dead=!0}finish(){this.dead||(this.onUpdate?.(this.ease(1),1),this.dead=!0,this.onComplete?.())}update(e){if(this.dead)return!0;if(this.delay>0){if(this.delay-=e,this.delay>0)return!1;e=-this.delay,this.delay=0}this.elapsed+=e;let t=Yc(this.elapsed/this.duration);return this.onUpdate?.(this.ease(t),t),t>=1&&(this.dead=!0,this.onComplete?.(),!0)}},$c=class{list=[];timeScale=1;add(e){let t=new Qc(e);return this.list.push(t),t}killByTag(e){for(let t of this.list)t.tag===e&&t.kill()}hasTag(e){return this.list.some(t=>t.tag===e&&!t.finished)}update(e){let t=e*this.timeScale,n=0,r=this.list.length;for(let e=0;e<r;e++){let r=this.list[e];r.update(t)||(this.list[n++]=r)}for(let e=r;e<this.list.length;e++)this.list[n++]=this.list[e];this.list.length=n}get count(){return this.list.length}killAll(){for(let e of this.list)e.kill();this.list.length=0}},J={blue:`#2F6BFF`,blueDeep:`#123C9E`,blueNight:`#0B2566`,red:`#FF3B3B`,redDeep:`#C41F2E`,gold:`#FFC93C`,goldDeep:`#B8860B`,goldLight:`#FFF0A8`,green:`#4CBB3F`,greenDeep:`#2E7D28`,purple:`#9B4DFF`,purpleDeep:`#5B21B6`,sand:`#D9A066`,wood:`#8C5A2B`,woodDark:`#5C3A1A`,cream:`#FFF6DF`,creamDeep:`#F0DFB4`,ink:`#1B2450`,inkSoft:`#2C3670`,bark:`#43230C`,white:`#FFFFFF`,shadow:`rgba(28, 32, 90, 0.35)`},el={hearts:{main:`#FF3B3B`,deep:`#B21226`,light:`#FF9A9A`},diamonds:{main:`#FF5A2E`,deep:`#B03310`,light:`#FFC0A0`},clubs:{main:`#243A8F`,deep:`#0E1B54`,light:`#8FA6FF`},spades:{main:`#1B2450`,deep:`#080D2E`,light:`#7E8FE0`}};function tl(e,t){let n=e.replace(`#`,``),r=parseInt(n.length===3?n.replace(/(.)/g,`$1$1`):n,16);return`rgba(${r>>16&255}, ${r>>8&255}, ${r&255}, ${t})`}function nl(e,t,n){let r=parseInt(e.replace(`#`,``),16),i=parseInt(t.replace(`#`,``),16),a=e=>{let t=r>>e&255,a=i>>e&255;return Math.round(t+(a-t)*n)},o=e=>e.toString(16).padStart(2,`0`);return`#${o(a(16))}${o(a(8))}${o(a(0))}`}function rl(e,t){return t>=0?nl(e,`#ffffff`,t):nl(e,`#000000`,-t)}var il=(e,t)=>{let n=document.createElement(`canvas`);n.width=e,n.height=t;let r=n.getContext(`2d`,{willReadFrequently:!0});if(!r)throw Error(`Canvas 2D недоступен`);return{canvas:n,ctx:r}};function al(e,t,n){try{let r=e.getImageData(Math.floor(t),Math.floor(n),1,1)?.data;return!r||r.length<4?null:r[3]>0}catch{return null}}function ol(e){let t=e>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function sl(e,t,n,r,i,a){let o=Math.min(a,r/2,i/2);e.beginPath(),e.moveTo(t+o,n),e.lineTo(t+r-o,n),e.quadraticCurveTo(t+r,n,t+r,n+o),e.lineTo(t+r,n+i-o),e.quadraticCurveTo(t+r,n+i,t+r-o,n+i),e.lineTo(t+o,n+i),e.quadraticCurveTo(t,n+i,t,n+i-o),e.lineTo(t,n+o),e.quadraticCurveTo(t,n,t+o,n),e.closePath()}function cl(e,t,n,r,i,a=0){e.beginPath(),e.ellipse(t,n,Math.abs(r),Math.abs(i),a,0,Math.PI*2)}function ll(e,t,n,r){e.beginPath(),e.arc(t,n,Math.abs(r),0,Math.PI*2)}function ul(e,t){e.beginPath(),t.forEach(([t,n],r)=>r===0?e.moveTo(t,n):e.lineTo(t,n)),e.closePath()}function dl(e,t,n,r,i,a){let o=e.createLinearGradient(t,n,r,i);for(let[e,t]of a)o.addColorStop(e,t);return o}function fl(e,t,n,r,i,a,o=0,s=0){let c=e.createRadialGradient(t+o,n+s,Math.max(0,r),t,n,Math.max(.01,i));for(let[e,t]of a)c.addColorStop(e,t);return c}function Y(e,t,n){e.save(),n.shadow&&(e.shadowColor=n.shadow,e.shadowBlur=n.shadowBlur??8,e.shadowOffsetY=n.shadowOffset??4),t(),n.fill&&(e.fillStyle=n.fill,e.fill()),e.restore(),n.outline&&(e.save(),t(),e.lineJoin=`round`,e.lineCap=`round`,e.strokeStyle=n.outline,e.lineWidth=n.outlineWidth??6,e.stroke(),e.restore())}function pl(e,t,n){e.save(),t(),e.clip(),n(),e.restore()}function ml(e,t,n,r,i){e.save(),e.font=i.font,e.textAlign=i.align??`center`,e.textBaseline=i.baseline??`middle`,e.lineJoin=`round`,e.miterLimit=2,i.letterSpacing&&`letterSpacing`in e&&(e.letterSpacing=i.letterSpacing),i.shadow&&(e.shadowColor=i.shadow,e.shadowBlur=i.shadowBlur??6,e.shadowOffsetY=i.shadowOffset??3),i.outerStroke&&(e.strokeStyle=i.outerStroke,e.lineWidth=i.outerWidth??(i.lineWidth??6)+6,e.strokeText(t,n,r)),e.shadowColor=`transparent`,i.stroke&&(e.strokeStyle=i.stroke,e.lineWidth=i.lineWidth??6,e.strokeText(t,n,r)),i.fill&&(e.fillStyle=i.fill,e.fillText(t,n,r)),e.restore()}function hl(e,t,n,r,i,a=5,o=-Math.PI/2){e.beginPath();for(let s=0;s<a*2;s++){let c=s%2==0?r:i,l=o+s*Math.PI/a,u=t+Math.cos(l)*c,d=n+Math.sin(l)*c;s===0?e.moveTo(u,d):e.lineTo(u,d)}e.closePath()}function gl(e,t,n,r,i,a=3){let o=r/2,s=r/a;e.beginPath(),e.moveTo(t-o,n+i*.5),e.lineTo(t-o,n-i*.1);for(let r=0;r<a;r++){let c=t-o+r*s,l=r===(a-1)/2?i*.75:i*.55;e.lineTo(c+s*.5,n-l),e.lineTo(c+s,n-i*.1)}e.lineTo(t+o,n+i*.5),e.closePath()}function _l(e,t,n,r,i,a=.45){e.save(),e.globalAlpha=a,e.fillStyle=`#ffffff`,cl(e,t,n,r,i,-.35),e.fill(),e.restore()}function vl(e,t,n,r,i,a=7,o=320,s=.05){let c=ol(a);e.save(),e.globalAlpha=s;for(let a=0;a<o;a++){let a=t+c()*r,o=n+c()*i,s=.5+c()*1.6;e.fillStyle=c()>.5?`#8a6a3a`:`#ffffff`,e.beginPath(),e.arc(a,o,s,0,Math.PI*2),e.fill()}e.restore()}function yl(e,t,n,r,i,a,o=.35,s=0){e.save(),e.globalAlpha=o,e.fillStyle=a,e.translate(t,n),e.rotate(s);let c=Math.PI*2/i;for(let t=0;t<i;t++)e.beginPath(),e.moveTo(0,0),e.arc(0,0,r,t*c,t*c+c*.45),e.closePath(),e.fill();e.restore()}Math.PI*2;function bl(e,t){switch(t){case`hearts`:e.beginPath(),e.moveTo(0,.48),e.bezierCurveTo(-.92,-.12,-.52,-.66,0,-.24),e.bezierCurveTo(.52,-.66,.92,-.12,0,.48),e.closePath();break;case`diamonds`:e.beginPath(),e.moveTo(0,-.5),e.bezierCurveTo(.16,-.24,.34,-.1,.42,0),e.bezierCurveTo(.34,.1,.16,.24,0,.5),e.bezierCurveTo(-.16,.24,-.34,.1,-.42,0),e.bezierCurveTo(-.34,-.1,-.16,-.24,0,-.5),e.closePath();break;case`spades`:e.beginPath(),e.moveTo(0,-.5),e.bezierCurveTo(.92,.1,.52,.6,.06,.2),e.bezierCurveTo(.12,.34,.2,.42,.3,.5),e.lineTo(-.3,.5),e.bezierCurveTo(-.2,.42,-.12,.34,-.06,.2),e.bezierCurveTo(-.52,.6,-.92,.1,0,-.5),e.closePath();break;case`clubs`:{let t=.27;e.beginPath(),e.arc(0,-.21,t,0,Math.PI*2),e.closePath(),e.moveTo(-.010000000000000009,.1),e.arc(-.28,.1,t,0,Math.PI*2),e.moveTo(.55,.1),e.arc(.28,.1,t,0,Math.PI*2),e.moveTo(-.05,.1),e.bezierCurveTo(-.06,.3,-.16,.42,-.26,.5),e.lineTo(.26,.5),e.bezierCurveTo(.16,.42,.06,.3,.05,.1),e.closePath();break}}}function xl(e,t,n,r,i){let a=i.size,o=i.colors??el[t],s=i.outline??`#1B2450`,c=i.outlineWidth??Math.max(1.5,a*.085),l=()=>{e.save(),e.translate(n,r),e.scale(a,a),bl(e,t),e.restore()};i.shadow&&(e.save(),e.shadowColor=`rgba(27, 36, 80, 0.35)`,e.shadowBlur=a*.2,e.shadowOffsetY=a*.08,l(),e.fillStyle=o.deep,e.fill(),e.restore()),l(),e.fillStyle=fl(e,n,r,a*.05,a*.8,[[0,o.light],[.42,o.main],[1,o.deep]],-a*.18,-a*.22),e.fill(),i.gloss!==!1&&a>14&&pl(e,l,()=>{_l(e,n-a*.17,r-a*.24,a*.2,a*.11,.5),e.save(),e.globalAlpha=.22,e.fillStyle=o.deep,ll(e,n,r+a*.62,a*.5),e.fill(),e.restore()}),e.save(),l(),e.lineJoin=`round`,e.strokeStyle=s,e.lineWidth=c,e.stroke(),e.restore()}var Sl={cloak:`#FF4A4A`,cloakDeep:`#B4162A`,cloakLight:`#FF8A7A`,trim:J.gold,trimDeep:J.goldDeep,skin:`#FFD9B0`,skinShade:`#E9A97C`,hair:`#8C4A1F`,hairDeep:`#5A2C0E`,ink:J.ink},Cl={cloak:`#3F79FF`,cloakDeep:`#12328C`,cloakLight:`#8FB6FF`,trim:J.gold,trimDeep:J.goldDeep,skin:`#FFD9B0`,skinShade:`#E9A97C`,hair:`#3B2A56`,hairDeep:`#221537`,ink:J.ink},wl=e=>e===`hearts`||e===`diamonds`?Sl:Cl,Tl=(e,t=.02)=>Math.max(1.5,e*t);function El(e,t,n,r){let{cx:i,cy:a,h:o}=t,s=Tl(o),c=a+o*.14,l=a+o*.52,u=o*.44;if(Y(e,()=>{e.beginPath(),e.moveTo(i-u,l),e.bezierCurveTo(i-u*.98,c+o*.02,i-o*.17,c,i,c),e.bezierCurveTo(i+o*.17,c,i+u*.98,c+o*.02,i+u,l),e.closePath()},{fill:dl(e,i,c,i,l,[[0,n.cloakLight],[.35,n.cloak],[1,n.cloakDeep]]),outline:n.ink,outlineWidth:s*1.2}),Y(e,()=>sl(e,i-o*.045,c+o*.05,o*.09,o*.34,o*.03),{fill:dl(e,i,c,i,l,[[0,n.trim],[1,n.trimDeep]]),outline:n.ink,outlineWidth:s}),r.fur){let t=o*.062;for(let r=-3;r<=3;r++){let a=i+r*t*1.55,l=c+o*.045+Math.abs(r)*o*.012;Y(e,()=>ll(e,a,l,t),{fill:`#FFF6DF`,outline:n.ink,outlineWidth:s*.8})}}if(r.pauldrons)for(let t of[-1,1]){let r=i+t*o*.37,a=c+o*.21;Y(e,()=>cl(e,r,a,o*.13,o*.115),{fill:fl(e,r,a,o*.02,o*.2,[[0,`#FFF3C0`],[.5,n.trim],[1,n.trimDeep]]),outline:n.ink,outlineWidth:s*1.1}),_l(e,r-o*.035,a-o*.045,o*.055,o*.026,.55)}}function Dl(e,t,n,r){let{cx:i,cy:a,h:o}=t,s=(r.rx??.26)*o,c=(r.ry??.27)*o,l=a-o*.08,u=Tl(o);Y(e,()=>{e.beginPath(),r.jaw?(e.moveTo(i-s,l-c*.15),e.bezierCurveTo(i-s,l-c*1.15,i+s,l-c*1.15,i+s,l-c*.15),e.bezierCurveTo(i+s*1.02,l+c*.75,i+s*.5,l+c*1.1,i,l+c*1.1),e.bezierCurveTo(i-s*.5,l+c*1.1,i-s*1.02,l+c*.75,i-s,l-c*.15)):e.ellipse(i,l,s,c,0,0,Math.PI*2),e.closePath()},{fill:fl(e,i,l,s*.1,s*1.5,[[0,`#FFEBD2`],[.6,n.skin],[1,n.skinShade]],-s*.2,-c*.25),outline:n.ink,outlineWidth:u*1.15});for(let t of[-1,1])e.save(),e.globalAlpha=.35,e.fillStyle=`#FF8B7A`,cl(e,i+t*s*.58,l+c*.28,s*.22,c*.14),e.fill(),e.restore();return{hx:i,hy:l,rx:s,ry:c}}function Ol(e,t,n,r,i){let a=(i.spread??.1)*r,o=(i.size??.045)*r,s=Tl(r,.014);for(let r of[-1,1]){let c=t+r*a;if(i.happy){e.save(),e.strokeStyle=J.ink,e.lineWidth=s*1.6,e.lineCap=`round`,e.beginPath(),e.arc(c,n+o*.4,o,Math.PI*1.15,Math.PI*1.85),e.stroke(),e.restore();continue}Y(e,()=>cl(e,c,n,o,o*(i.sly?.78:1.1)),{fill:`#FFFFFF`,outline:J.ink,outlineWidth:s}),Y(e,()=>ll(e,c+r*o*.18,n+o*.12,o*.5),{fill:`#25306B`}),e.save(),e.fillStyle=`#FFFFFF`,ll(e,c+r*o*.05,n-o*.2,o*.2),e.fill(),e.restore(),i.lashes&&(e.save(),e.strokeStyle=J.ink,e.lineWidth=s,e.lineCap=`round`,e.beginPath(),e.moveTo(c+r*o*1.1,n-o*.75),e.lineTo(c+r*o*1.7,n-o*1.15),e.stroke(),e.restore())}}function kl(e,t,n,r,i,a=.1){e.save(),e.strokeStyle=J.ink,e.lineWidth=Tl(r,.022),e.lineCap=`round`;for(let o of[-1,1]){let s=t+o*a*r;e.beginPath(),e.moveTo(s-o*r*.045,n-r*.085+o*i*r),e.lineTo(s+o*r*.045,n-r*.1-o*i*r),e.stroke()}e.restore()}function Al(e,t,n,r,i){let a=(i.width??.13)*r,o=n+(i.y??.11)*r,s=Tl(r,.018);i.open?(Y(e,()=>{e.beginPath(),e.moveTo(t-a,o-r*.01),e.quadraticCurveTo(t,o+r*.13,t+a,o-r*.01),e.quadraticCurveTo(t,o+r*.03,t-a,o-r*.01),e.closePath()},{fill:`#8C2338`,outline:J.ink,outlineWidth:s}),e.save(),e.fillStyle=`#FF7A8A`,cl(e,t,o+r*.055,a*.45,r*.028),e.fill(),e.restore(),i.tooth&&Y(e,()=>sl(e,t-a*.32,o-r*.012,a*.3,r*.035,r*.008),{fill:`#FFFFFF`})):(e.save(),e.strokeStyle=J.ink,e.lineWidth=s*1.3,e.lineCap=`round`,e.beginPath(),e.moveTo(t-a,o),e.quadraticCurveTo(t,o+r*.075,t+a,o),e.stroke(),e.restore())}function jl(e,t,n,r,i=.035){Y(e,()=>cl(e,t,n+r*.045,r*i,r*i*.8),{fill:`#F2B98E`,outline:J.ink,outlineWidth:Tl(r,.013)})}function Ml(e,t,n,r,i,a,o=5){let s=Tl(i*2,.011)+1;Y(e,()=>gl(e,t,n,r,i,o),{fill:dl(e,t,n-i,t,n+i*.5,[[0,`#FFF3B0`],[.45,a.trim],[1,a.trimDeep]]),outline:J.ink,outlineWidth:s,shadow:`rgba(27,36,80,0.3)`,shadowBlur:i*.4,shadowOffset:i*.12});let c=r/o;for(let a=0;a<o;a++){let o=t-r/2+c*(a+.5);Y(e,()=>ll(e,o,n-i*.05,i*.13),{fill:a%2==0?`#FF3B3B`:`#4CBB3F`,outline:J.ink,outlineWidth:s*.7})}Y(e,()=>sl(e,t-r/2,n+i*.16,r,i*.3,i*.1),{fill:dl(e,t,n,t,n+i*.5,[[0,`#FFE58A`],[1,a.trimDeep]]),outline:J.ink,outlineWidth:s})}function Nl(e,t){let n=wl(t.suit),{cx:r,cy:i,h:a}=t,o=Tl(a);e.save(),e.translate(r+a*.34,i+a*.04),e.rotate(-.42),Y(e,()=>sl(e,-a*.035,-a*.44,a*.07,a*.5,a*.02),{fill:dl(e,0,-a*.4,0,a*.1,[[0,`#FFFFFF`],[.5,`#CBD6F5`],[1,`#8C9BC9`]]),outline:J.ink,outlineWidth:o*.9}),Y(e,()=>sl(e,-a*.09,a*.03,a*.18,a*.05,a*.02),{fill:n.trim,outline:J.ink,outlineWidth:o*.9}),e.restore(),El(e,t,n,{pauldrons:!0});let s=Dl(e,t,n,{rx:.245,ry:.25,jaw:!0}),c=(t,n,r,i)=>dl(e,t,n,r,i,[[0,`#F2F6FF`],[.4,`#AFC0EE`],[1,`#63769F`]]);Y(e,()=>{e.beginPath(),e.moveTo(s.hx-a*.02,s.hy-s.ry*1.32),e.bezierCurveTo(s.hx+a*.1,s.hy-s.ry*2.1,s.hx+a*.34,s.hy-s.ry*1.85,s.hx+a*.31,s.hy-s.ry*1.05),e.bezierCurveTo(s.hx+a*.22,s.hy-s.ry*1.5,s.hx+a*.1,s.hy-s.ry*1.5,s.hx-a*.02,s.hy-s.ry*1.32),e.closePath()},{fill:dl(e,s.hx,s.hy-s.ry*2.1,s.hx+a*.3,s.hy-s.ry,[[0,n.cloakLight],[.55,n.cloak],[1,n.cloakDeep]]),outline:J.ink,outlineWidth:o}),Y(e,()=>{e.beginPath(),e.moveTo(s.hx-s.rx*1.06,s.hy-s.ry*.28),e.bezierCurveTo(s.hx-s.rx*1.14,s.hy-s.ry*1.55,s.hx+s.rx*1.14,s.hy-s.ry*1.55,s.hx+s.rx*1.06,s.hy-s.ry*.28),e.closePath()},{fill:c(s.hx,s.hy-s.ry*1.4,s.hx,s.hy),outline:J.ink,outlineWidth:o*1.15}),_l(e,s.hx-s.rx*.42,s.hy-s.ry*.85,s.rx*.3,s.ry*.13,.65),Y(e,()=>sl(e,s.hx-s.rx*1.16,s.hy-s.ry*.42,s.rx*2.32,s.ry*.3,s.ry*.14),{fill:dl(e,s.hx,s.hy-s.ry*.42,s.hx,s.hy-s.ry*.12,[[0,`#D7E1FA`],[1,`#4E6091`]]),outline:J.ink,outlineWidth:o*1.1});for(let t of[-1,1])Y(e,()=>ll(e,s.hx+t*s.rx*.85,s.hy-s.ry*.27,a*.014),{fill:n.trim,outline:J.ink,outlineWidth:o*.5});Y(e,()=>sl(e,s.hx-a*.026,s.hy-s.ry*.2,a*.052,s.ry*.62,a*.02),{fill:c(s.hx,s.hy-s.ry*.2,s.hx,s.hy+s.ry*.4),outline:J.ink,outlineWidth:o*.85});for(let t of[-1,1])Y(e,()=>sl(e,s.hx+t*s.rx*.98-a*.035,s.hy-s.ry*.18,a*.07,s.ry*.85,a*.03),{fill:c(s.hx,s.hy,s.hx,s.hy+s.ry),outline:J.ink,outlineWidth:o*.9});Ol(e,s.hx,s.hy+a*.015,a,{spread:.098,size:.042}),jl(e,s.hx,s.hy+a*.02,a,.03),Al(e,s.hx,s.hy+a*.02,a,{width:.125,open:!0,tooth:!0,y:.13})}function Pl(e,t){let n=wl(t.suit),{cx:r,cy:i,h:a}=t,o=Tl(a);Y(e,()=>cl(e,r,i-a*.04,a*.34,a*.34),{fill:dl(e,r,i-a*.3,r,i+a*.2,[[0,n.hair],[1,n.hairDeep]]),outline:J.ink,outlineWidth:o*1.1}),El(e,t,n,{fur:!0});let s=Dl(e,t,n,{rx:.235,ry:.26});for(let t of[-1,1]){let s=r+t*a*.27;Y(e,()=>cl(e,s,i+a*.05,a*.1,a*.17,t*.2),{fill:dl(e,s,i-a*.1,s,i+a*.22,[[0,n.hair],[1,n.hairDeep]]),outline:J.ink,outlineWidth:o})}Y(e,()=>{e.beginPath(),e.moveTo(s.hx-s.rx*1.02,s.hy-s.ry*.28),e.bezierCurveTo(s.hx-s.rx*.9,s.hy-s.ry*1.25,s.hx+s.rx*.9,s.hy-s.ry*1.25,s.hx+s.rx*1.02,s.hy-s.ry*.28),e.bezierCurveTo(s.hx+s.rx*.5,s.hy-s.ry*.62,s.hx-s.rx*.5,s.hy-s.ry*.62,s.hx-s.rx*1.02,s.hy-s.ry*.28),e.closePath()},{fill:dl(e,s.hx,s.hy-s.ry,s.hx,s.hy,[[0,n.hair],[1,n.hairDeep]]),outline:J.ink,outlineWidth:o*1.05}),Ml(e,s.hx,s.hy-s.ry*1.12,a*.36,a*.19,n,3),Ol(e,s.hx,s.hy+a*.01,a,{spread:.09,size:.04,lashes:!0,sly:!0}),jl(e,s.hx,s.hy,a,.026),Al(e,s.hx,s.hy,a,{width:.075,y:.12});let c=i+a*.19;e.save(),e.strokeStyle=n.trimDeep,e.lineWidth=o,e.beginPath(),e.arc(r,i+a*.06,a*.16,Math.PI*.15,Math.PI*.85),e.stroke(),e.restore(),xl(e,t.suit,r,c,{size:a*.11,gloss:!0})}function Fl(e,t){let n=wl(t.suit),{h:r}=t,i=Tl(r);El(e,t,n,{fur:!0});let a=Dl(e,t,n,{rx:.27,ry:.255});Y(e,()=>{e.beginPath(),e.moveTo(a.hx-a.rx*.82,a.hy+a.ry*.3),e.bezierCurveTo(a.hx-a.rx*.95,a.hy+a.ry*1.55,a.hx+a.rx*.95,a.hy+a.ry*1.55,a.hx+a.rx*.82,a.hy+a.ry*.3),e.bezierCurveTo(a.hx+a.rx*.5,a.hy+a.ry*.62,a.hx-a.rx*.5,a.hy+a.ry*.62,a.hx-a.rx*.82,a.hy+a.ry*.3),e.closePath()},{fill:dl(e,a.hx,a.hy+a.ry*.3,a.hx,a.hy+a.ry*1.6,[[0,`#FFFFFF`],[1,`#D3D8F0`]]),outline:J.ink,outlineWidth:i*1.1}),kl(e,a.hx,a.hy-r*.045,r,.02,.105),Ol(e,a.hx,a.hy-r*.03,r,{spread:.105,size:.045}),jl(e,a.hx,a.hy-r*.015,r,.045),Y(e,()=>{e.beginPath(),e.moveTo(a.hx-r*.085,a.hy+r*.085),e.quadraticCurveTo(a.hx,a.hy+r*.215,a.hx+r*.085,a.hy+r*.085),e.quadraticCurveTo(a.hx,a.hy+r*.115,a.hx-r*.085,a.hy+r*.085),e.closePath()},{fill:`#8C2338`,outline:J.ink,outlineWidth:i*.9}),Y(e,()=>sl(e,a.hx-r*.055,a.hy+r*.086,r*.11,r*.028,r*.008),{fill:`#FFFFFF`}),e.save(),e.fillStyle=`#FF7A8A`,cl(e,a.hx,a.hy+r*.16,r*.045,r*.026),e.fill(),e.restore();for(let t of[-1,1])Y(e,()=>{e.beginPath(),e.moveTo(a.hx,a.hy+r*.045),e.bezierCurveTo(a.hx+t*r*.07,a.hy+r*.025,a.hx+t*r*.17,a.hy+r*.03,a.hx+t*r*.175,a.hy+r*.1),e.bezierCurveTo(a.hx+t*r*.14,a.hy+r*.06,a.hx+t*r*.07,a.hy+r*.07,a.hx,a.hy+r*.075),e.closePath()},{fill:`#FFFFFF`,outline:J.ink,outlineWidth:i*.9});Ml(e,a.hx,a.hy-a.ry*1.05,r*.46,r*.22,n,5)}function Il(e,t){let{cx:n,cy:r,h:i}=t,a=wl(t.suit),o=el[t.suit];yl(e,n,r+i*.02,i*.62,12,o.light,.28,.2),e.save(),e.globalAlpha=.5,e.fillStyle=fl(e,n,r,i*.05,i*.5,[[0,`#FFFFFF`],[.5,o.light],[1,`rgba(255,255,255,0)`]]),ll(e,n,r,i*.5),e.fill(),e.restore(),xl(e,t.suit,n,r+i*.05,{size:i*.62,gloss:!0,shadow:!0}),Ml(e,n,r-i*.34,i*.3,i*.16,a,3);for(let[t,a,o]of[[-.36,-.18,.05],[.38,-.1,.042],[-.3,.3,.038],[.32,.32,.05]])Y(e,()=>hl(e,n+t*i,r+a*i,o*i,o*i*.38,4),{fill:`#FFFFFF`})}function Ll(e,t,n,r,i,a){let o=el[a],s=()=>sl(e,t,n,r,i,Math.min(r,i)*.16);Y(e,s,{fill:dl(e,t,n,t,n+i,[[0,`#FFFDF4`],[.5,`#FFF1CE`],[1,`#F5DFAF`]])}),pl(e,s,()=>{yl(e,t+r/2,n+i*.42,i*.75,16,o.light,.16,.12),e.save(),e.globalAlpha=.1,e.strokeStyle=o.main,e.lineWidth=Math.max(1,i*.006);let a=i*.09;for(let o=-i;o<r+i;o+=a)e.beginPath(),e.moveTo(t+o,n),e.lineTo(t+o+i,n+i),e.stroke(),e.beginPath(),e.moveTo(t+o,n+i),e.lineTo(t+o+i,n),e.stroke();e.restore()}),e.save(),s(),e.strokeStyle=J.goldDeep,e.lineWidth=Math.max(1.5,i*.014),e.stroke(),e.restore()}var Rl=[``,`Т`,`2`,`3`,`4`,`5`,`6`,`7`,`8`,`9`,`10`,`В`,`Д`,`К`],zl=[``,`A`,`2`,`3`,`4`,`5`,`6`,`7`,`8`,`9`,`10`,`J`,`Q`,`K`],Bl=`"Lilita One", "Baloo 2", "Arial Black", "Trebuchet MS", system-ui, sans-serif`,Vl=`"Baloo 2", "Nunito", "Lilita One", "Arial Black", "Trebuchet MS", system-ui, sans-serif`,Hl={2:[[.5,.1],[.5,.9]],3:[[.5,.1],[.5,.5],[.5,.9]],4:[[.27,.1],[.73,.1],[.27,.9],[.73,.9]],5:[[.27,.1],[.73,.1],[.5,.5],[.27,.9],[.73,.9]],6:[[.27,.1],[.73,.1],[.27,.5],[.73,.5],[.27,.9],[.73,.9]],7:[[.27,.1],[.73,.1],[.5,.3],[.27,.5],[.73,.5],[.27,.9],[.73,.9]],8:[[.27,.1],[.73,.1],[.5,.3],[.27,.5],[.73,.5],[.5,.7],[.27,.9],[.73,.9]],9:[[.27,.1],[.73,.1],[.27,.37],[.73,.37],[.5,.5],[.27,.63],[.73,.63],[.27,.9],[.73,.9]],10:[[.27,.1],[.73,.1],[.5,.22],[.27,.37],[.73,.37],[.27,.63],[.73,.63],[.5,.78],[.27,.9],[.73,.9]]};function Ul(e,t,n,r,i,a){let o=r*.1,s=Math.max(2,r*.032),c=()=>sl(e,t+s/2,n+s/2,r-s,i-s,o);e.save(),c(),e.fillStyle=dl(e,t,n,t,n+i,[[0,`#FFFDF2`],[.55,a.paperTint??J.cream],[1,J.creamDeep]]),e.fill(),e.restore(),pl(e,c,()=>{vl(e,t,n,r,i,a.seed??3,Math.round(r*1.2),.05),e.save(),e.fillStyle=dl(e,t,n+i*.72,t,n+i,[[0,`rgba(120, 90, 40, 0)`],[1,`rgba(120, 90, 40, 0.16)`]]),e.fillRect(t,n+i*.72,r,i*.28),e.fillStyle=dl(e,t,n,t,n+i*.18,[[0,`rgba(255,255,255,0.55)`],[1,`rgba(255,255,255,0)`]]),e.fillRect(t,n,r,i*.18),e.restore()}),e.save(),c(),e.strokeStyle=J.ink,e.lineWidth=s,e.stroke(),e.restore(),e.save(),sl(e,t+s*1.6,n+s*1.6,r-s*3.2,i-s*3.2,o*.78),e.strokeStyle=tl(J.goldDeep,.75),e.lineWidth=Math.max(1,r*.011),e.stroke(),e.restore()}function Wl(e,t,n,r,i,a,o,s){let c=(s===`en`?zl:Rl)[o],l=el[a],u=c.length>1,d=!/^\d+$/.test(c),f=i*(u?.15:d?.2:.215),p=t+r*(u?.18:.165),m=n+i*.145,h=r*(u?.2:.165),g=i*.09,_=n+i*.273,v=e=>`800 ${Math.round(e)}px ${Vl}`;e.save(),e.font=v(f);let y=Math.min(1,h/Math.max(1,e.measureText(c).width));y<.75&&(f*=y/.75,y=.75),e.restore(),e.save(),e.translate(p,m),e.scale(y,1),ml(e,c,0,0,{font:v(f),fill:l.main,stroke:l.deep,lineWidth:Math.max(1,r*.008),align:`center`,baseline:`middle`}),e.restore(),xl(e,a,p,_,{size:g,gloss:!1,outlineWidth:Math.max(1,g*.06)})}function Gl(e,t,n,r,i,a,o,s={}){let c=s.lang??`ru`;Ul(e,t,n,r,i,s);let l=t+r*.2,u=n+i*.165,d=r*.6,f=i*.67;if(o>=11){let t=l+d*.05,n=u+f*.04,r=d*.9,i=f*.92;Ll(e,t,n,r,i,a);let s={cx:t+r/2,cy:n+i*.52,h:i*.86,suit:a};o===11?Nl(e,s):o===12?Pl(e,s):Fl(e,s)}else if(o===1)Il(e,{cx:l+d/2,cy:u+f/2,h:f*.78,suit:a});else{let t=Hl[o]??[],n=i*(o>=9?.108:.125);for(let[r,i]of t){let t=.5+(r-.5)*.78,o=.5+(i-.5)*.925,s=l+d*t,c=u+f*o;o>.55?(e.save(),e.translate(s,c),e.rotate(Math.PI),xl(e,a,0,0,{size:n,gloss:!0}),e.restore()):xl(e,a,s,c,{size:n,gloss:!0})}}Wl(e,t,n,r,i,a,o,c),e.save(),e.translate(t+r,n+i),e.rotate(Math.PI),Wl(e,0,0,r,i,a,o,c),e.restore(),pl(e,()=>sl(e,t+r*.02,n+i*.014,r*.96,i*.972,r*.09),()=>_l(e,t+r*.3,n+i*.04,r*.42,i*.035,.28))}var Kl=[{id:`royal`,name:`Королевская`,base:`#2F6BFF`,deep:`#0E2E86`,light:`#7EA6FF`,accent:J.gold,pattern:`lattice`,emblem:`crown`,rarity:`common`},{id:`forest`,name:`Гоблинская роща`,base:`#4CBB3F`,deep:`#1F6B22`,light:`#A6E86B`,accent:`#FFE07A`,pattern:`scales`,emblem:`shield`,rarity:`common`},{id:`ember`,name:`Уголёк`,base:`#FF6A2B`,deep:`#A31D12`,light:`#FFC46B`,accent:`#FFF1B8`,pattern:`rays`,emblem:`flame`,rarity:`rare`},{id:`frost`,name:`Ледяная`,base:`#5FD2FF`,deep:`#12558F`,light:`#DFF6FF`,accent:`#FFFFFF`,pattern:`waves`,emblem:`flake`,rarity:`rare`},{id:`bone`,name:`Костяная яма`,base:`#8C7BA6`,deep:`#3B2C55`,light:`#E4DCEF`,accent:`#FFE9A8`,pattern:`scales`,emblem:`skull`,rarity:`rare`},{id:`legend`,name:`Легендарная`,base:`#9B4DFF`,deep:`#46158F`,light:`#E0B6FF`,accent:J.gold,pattern:`stars`,emblem:`star`,rarity:`legendary`}];function ql(e,t,n,r,i,a){switch(e.save(),e.lineWidth=Math.max(1,r*.016),e.strokeStyle=tl(a.accent,.5),e.fillStyle=tl(a.light,.35),a.pattern){case`lattice`:{let a=r*.19;for(let o=-i;o<r+i;o+=a)e.beginPath(),e.moveTo(t+o,n),e.lineTo(t+o+i,n+i),e.stroke(),e.beginPath(),e.moveTo(t+o,n+i),e.lineTo(t+o+i,n),e.stroke();break}case`scales`:{let a=r*.13;for(let o=0;o*a*1.2<i+a;o++)for(let i=-1;i*a*1.7<r+a;i++){let r=t+i*a*1.7+(o%2?a*.85:0),s=n+o*a*1.2;e.beginPath(),e.arc(r,s,a,0,Math.PI),e.stroke()}break}case`stars`:{let a=e=>(Math.sin(e*12.9898)*43758.5453%1+1)%1;for(let o=0;o<26;o++){let s=t+a(o+1)*r,c=n+a(o+51)*i,l=r*(.02+a(o+91)*.035);hl(e,s,c,l,l*.4,4),e.fill()}break}case`rays`:yl(e,t+r/2,n+i/2,Math.max(r,i),18,a.light,.22,.1);break;case`waves`:{let a=i*.08;for(let o=0;o<i/a+2;o++){let i=n+o*a;e.beginPath(),e.moveTo(t,i);for(let n=0;n<=6;n++)e.quadraticCurveTo(t+r/6*(n+.5),i+(n%2?a*.7:-a*.7),t+r/6*(n+1),i);e.stroke()}break}}e.restore()}function Jl(e,t,n,r,i){let a=Math.max(2,r*.07),o=dl(e,t,n-r,t,n+r,[[0,`#FFF6C0`],[.45,i.accent],[1,rl(i.accent,-.35)]]);switch(Y(e,()=>ll(e,t,n,r*.92),{fill:fl(e,t,n,r*.1,r,[[0,tl(i.light,.95)],[.7,tl(i.base,.9)],[1,tl(i.deep,.95)]]),outline:J.ink,outlineWidth:a}),e.save(),e.globalAlpha=.5,e.strokeStyle=i.accent,e.lineWidth=a*.7,ll(e,t,n,r*.72),e.stroke(),e.restore(),i.emblem){case`crown`:Y(e,()=>gl(e,t,n+r*.12,r*1.05,r*.72,3),{fill:o,outline:J.ink,outlineWidth:a});break;case`shield`:Y(e,()=>ul(e,[[t,n-r*.62],[t+r*.52,n-r*.26],[t+r*.34,n+r*.5],[t,n+r*.68],[t-r*.34,n+r*.5],[t-r*.52,n-r*.26]]),{fill:o,outline:J.ink,outlineWidth:a});break;case`star`:Y(e,()=>hl(e,t,n,r*.78,r*.34,5),{fill:o,outline:J.ink,outlineWidth:a});break;case`flake`:e.save(),e.strokeStyle=J.ink,e.lineWidth=a*1.9,e.lineCap=`round`;for(let i=0;i<6;i++){let a=i*Math.PI/3;e.beginPath(),e.moveTo(t,n),e.lineTo(t+Math.cos(a)*r*.72,n+Math.sin(a)*r*.72),e.moveTo(t+Math.cos(a)*r*.42,n+Math.sin(a)*r*.42),e.lineTo(t+Math.cos(a)*r*.62+Math.cos(a+1)*r*.18,n+Math.sin(a)*r*.62+Math.sin(a+1)*r*.18),e.stroke()}e.strokeStyle=`#FFFFFF`,e.lineWidth=a;for(let i=0;i<6;i++){let a=i*Math.PI/3;e.beginPath(),e.moveTo(t,n),e.lineTo(t+Math.cos(a)*r*.72,n+Math.sin(a)*r*.72),e.stroke()}e.restore();break;case`flame`:Y(e,()=>{e.beginPath(),e.moveTo(t,n-r*.72),e.bezierCurveTo(t+r*.6,n-r*.1,t+r*.38,n+r*.62,t,n+r*.62),e.bezierCurveTo(t-r*.38,n+r*.62,t-r*.6,n-r*.1,t,n-r*.72),e.closePath()},{fill:o,outline:J.ink,outlineWidth:a}),Y(e,()=>{e.beginPath(),e.moveTo(t,n-r*.28),e.bezierCurveTo(t+r*.28,n+r*.05,t+r*.18,n+r*.44,t,n+r*.44),e.bezierCurveTo(t-r*.18,n+r*.44,t-r*.28,n+r*.05,t,n-r*.28),e.closePath()},{fill:`#FFF3C0`});break;case`skull`:Y(e,()=>cl(e,t,n-r*.1,r*.52,r*.48),{fill:`#FFF6DF`,outline:J.ink,outlineWidth:a}),Y(e,()=>sl(e,t-r*.26,n+r*.24,r*.52,r*.3,r*.1),{fill:`#FFF6DF`,outline:J.ink,outlineWidth:a});for(let i of[-1,1])Y(e,()=>cl(e,t+i*r*.2,n-r*.12,r*.15,r*.17),{fill:J.ink})}}function Yl(e,t,n,r,i,a){let o=Math.max(2,r*.032),s=r*.1;e.save(),sl(e,t+o/2,n+o/2,r-o,i-o,s),e.fillStyle=J.cream,e.fill(),e.strokeStyle=J.ink,e.lineWidth=o,e.stroke(),e.restore();let c=r*.075,l=t+c,u=n+r/i*c*(i/r),d=r-c*2,f=i-c*2*(r/i)*(i/r),p=()=>sl(e,l,u,d,f,s*.7);e.save(),p(),e.fillStyle=dl(e,l,u,l+d*.3,u+f,[[0,a.light],[.4,a.base],[1,a.deep]]),e.fill(),e.restore(),pl(e,p,()=>{ql(e,l,u,d,f,a),e.save(),e.globalAlpha=.4,e.fillStyle=dl(e,l,u,l,u+f*.35,[[0,`rgba(255,255,255,0.75)`],[1,`rgba(255,255,255,0)`]]),e.fillRect(l,u,d,f*.35),e.restore()}),e.save(),p(),e.strokeStyle=tl(a.accent,.85),e.lineWidth=Math.max(1.5,r*.018),e.stroke(),e.restore(),Jl(e,t+r/2,n+i/2,r*.27,a)}var Xl=[`spades`,`hearts`,`diamonds`,`clubs`];function Zl(e,t,n){return{x:e%8*t,y:Math.floor(e/8)*n}}function Ql(e,t,n,r,i,a=.5){let{x:o,y:s}=Zl(e,t,n);return{u0:(o+a)/r,u1:(o+t-a)/r,vTop:1-(s+a)/i,vBot:1-(s+n-a)/i}}async function $l(e=2500){let t=document.fonts;if(!t)return;let n=Promise.all([t.load(`400 60px "Lilita One"`),t.load(`800 40px "Baloo 2"`),t.load(`800 40px "Nunito"`,`ВДКТ`)]).then(()=>t.ready);await Promise.race([n,new Promise(t=>setTimeout(t,e))]).catch(()=>void 0)}function eu(e={}){let t=e.factory??il,n=e.scale??1,r=Math.round(240*n),i=Math.round(336*n),a=r*8,o=i*8,{canvas:s,ctx:c}=t(a,o);c.fillStyle=J.cream,c.fillRect(0,0,a,o);for(let t=0;t<52;t++){let n=Xl[Math.floor(t/13)],a=t%13+1,{x:o,y:s}=Zl(t,r,i);c.save(),c.translate(o,s),Gl(c,0,0,r,i,n,a,{lang:e.lang??`ru`,seed:t*17+5}),c.restore()}let l=[];Kl.forEach((e,t)=>{let n=52+t;if(n>=63)return;let{x:a,y:o}=Zl(n,r,i);c.save(),c.translate(a,o),Yl(c,0,0,r,i,e),c.restore(),l.push(e.id)});let u=52+l.length,d=Zl(u,r,i);c.save(),c.fillStyle=dl(c,d.x,d.y,d.x,d.y+i,[[0,`#FFFBEC`],[.5,J.cream],[1,J.creamDeep]]),c.fillRect(d.x,d.y,r,i),c.restore();let f=new Map;l.forEach((e,t)=>f.set(e,52+t));let p=Math.max(1,Math.round(3*n));return{canvas:s,width:a,height:o,backs:l,alive:al(c,d.x+r/2,d.y+i/2),faceUV:e=>Ql(e,r,i,a,o,p),backUV:e=>Ql(f.get(e)??52,r,i,a,o,p),edgeUV:()=>{let e=Zl(u,r,i),t=(e.x+r*.5)/a,n=1-(e.y+i*.5)/o;return{u0:t,u1:t,vTop:n,vBot:n}}}}var tu=[`foundation-spades`,`foundation-hearts`,`foundation-diamonds`,`foundation-clubs`,`tableau`,`stock-refresh`,`stock-empty`,`target`];function nu(e,t,n,r,i=!0){let a=t*.06;e.save(),sl(e,a,a,t-a*2,n-a*2,t*.1),e.fillStyle=tl(`#0B2566`,.22),e.fill(),e.strokeStyle=r,e.lineWidth=Math.max(3,t*.035),i&&e.setLineDash([t*.12,t*.08]),e.stroke(),e.restore()}function ru(e={}){let t=e.factory??il,n=e.scale??1,r=Math.round(180*n),i=Math.round(252*n),a=r*4,o=i*2,{canvas:s,ctx:c}=t(a,o);c.clearRect(0,0,a,o),tu.forEach((e,t)=>{let n=t%4*r,a=Math.floor(t/4)*i;switch(c.save(),c.translate(n,a),e){case`foundation-spades`:case`foundation-hearts`:case`foundation-diamonds`:case`foundation-clubs`:{let t=e.split(`-`)[1];nu(c,r,i,tl(J.gold,.75),!1),c.save(),c.globalAlpha=.5,xl(c,t,r/2,i/2,{size:i*.44,gloss:!1,colors:{main:tl(el[t].main,.85),deep:tl(el[t].deep,.85),light:tl(el[t].light,.85)},outline:tl(J.cream,.8)}),c.restore();break}case`tableau`:nu(c,r,i,tl(J.cream,.55)),ml(c,`К`,r/2,i/2,{font:`${Math.round(i*.34)}px ${Bl}`,fill:tl(J.cream,.4),stroke:tl(J.ink,.35),lineWidth:Math.max(2,r*.02)});break;case`stock-refresh`:{nu(c,r,i,tl(J.gold,.8),!1);let e=r/2,t=i/2,n=i*.22;c.save(),c.strokeStyle=J.gold,c.lineWidth=Math.max(4,r*.07),c.lineCap=`round`,c.beginPath(),c.arc(e,t,n,Math.PI*.35,Math.PI*1.75),c.stroke(),c.restore(),Y(c,()=>{c.beginPath(),c.moveTo(e+n*1.35,t-n*.25),c.lineTo(e+n*.5,t-n*.35),c.lineTo(e+n*1,t+n*.5),c.closePath()},{fill:J.gold});break}case`stock-empty`:nu(c,r,i,tl(J.cream,.35));break;case`target`:{c.save();let e=r*.04;sl(c,e,e,r-e*2,i-e*2,r*.11),c.fillStyle=tl(J.gold,.28),c.fill(),c.strokeStyle=tl(`#FFF3B0`,.95),c.lineWidth=Math.max(4,r*.045),c.stroke(),c.restore();for(let e=0;e<4;e++){let t=e*Math.PI/2+Math.PI/4;Y(c,()=>ll(c,r/2+Math.cos(t)*r*.32,i/2+Math.sin(t)*i*.3,r*.035),{fill:tl(`#FFFFFF`,.85)})}break}}c.restore()});let l=tu.indexOf(`target`);return{canvas:s,width:a,height:o,alive:al(c,l%4*r+r/2,Math.floor(l/4)*i+i/2),uv:e=>{let t=Math.max(0,tu.indexOf(e)),n=t%4*r,s=Math.floor(t/4)*i;return{u0:(n+.5)/a,u1:(n+r-.5)/a,vTop:1-(s+.5)/o,vBot:1-(s+i-.5)/o}}}}var iu=class{ctx=null;master=null;sfxBus=null;musicBus=null;noiseBuffer=null;volumes={master:.85,sfx:.9,music:.45};unlocked=!1;comboPitch=0;init(){if(this.ctx){this.ctx.resume();return}let e=window.AudioContext??window.webkitAudioContext;if(!e)return;let t=new e;this.ctx=t,this.master=t.createGain(),this.master.gain.value=this.volumes.master,this.master.connect(t.destination),this.sfxBus=t.createGain(),this.sfxBus.gain.value=this.volumes.sfx,this.sfxBus.connect(this.master),this.musicBus=t.createGain(),this.musicBus.gain.value=this.volumes.music,this.musicBus.connect(this.master);let n=Math.floor(t.sampleRate*1.2),r=t.createBuffer(1,n,t.sampleRate),i=r.getChannelData(0);for(let e=0;e<n;e++)i[e]=Math.random()*2-1;this.noiseBuffer=r,this.unlocked=!0}get ready(){return this.unlocked&&!!this.ctx}get musicOutput(){return this.musicBus}setVolumes(e){this.volumes={...this.volumes,...e},this.master&&(this.master.gain.value=this.volumes.master),this.sfxBus&&(this.sfxBus.gain.value=this.volumes.sfx),this.musicBus&&(this.musicBus.gain.value=this.volumes.music)}getVolumes(){return{...this.volumes}}duckMusic(e){if(!this.musicBus||!this.ctx)return;let t=e?this.volumes.music*.28:this.volumes.music;this.musicBus.gain.cancelScheduledValues(this.ctx.currentTime),this.musicBus.gain.linearRampToValueAtTime(t,this.ctx.currentTime+.35)}suspend(){this.ctx?.suspend()}resume(){this.ctx?.resume()}env(e,t,n,r,i,a=0,o=.05){e.setValueAtTime(1e-4,t),e.exponentialRampToValueAtTime(Math.max(2e-4,n),t+r);let s=Math.max(2e-4,n*a);return e.exponentialRampToValueAtTime(s,t+r+i),e.exponentialRampToValueAtTime(1e-4,t+r+i+o),t+r+i+o}tone(e,t={}){let n=this.ctx,r=this.sfxBus;if(!n||!r)return;let i=n.currentTime+(t.delay??0),a=n.createOscillator();a.type=t.type??`triangle`,a.frequency.setValueAtTime(e,i),t.glideTo&&a.frequency.exponentialRampToValueAtTime(Math.max(20,t.glideTo),i+(t.glideTime??.18)),t.detune&&a.detune.setValueAtTime(t.detune,i);let o=n.createGain(),s=this.env(o.gain,i,t.gain??.22,t.attack??.006,t.decay??.12,t.sustain??1e-4,t.release??.08),c=o;if(t.filter){let e=n.createBiquadFilter();e.type=`lowpass`,e.frequency.value=t.filter,o.connect(e),c=e}a.connect(o),c.connect(r),a.start(i),a.stop(s+.05)}noise(e={}){let t=this.ctx,n=this.sfxBus;if(!t||!n||!this.noiseBuffer)return;let r=t.currentTime+(e.delay??0),i=t.createBufferSource();i.buffer=this.noiseBuffer,i.loop=!0;let a=t.createBiquadFilter();a.type=e.type??`bandpass`,a.frequency.setValueAtTime(e.filterFrom??1800,r),e.filterTo&&a.frequency.exponentialRampToValueAtTime(Math.max(60,e.filterTo),r+(e.decay??.14)+(e.attack??.005)),a.Q.value=e.q??1.2;let o=t.createGain(),s=this.env(o.gain,r,e.gain??.2,e.attack??.004,e.decay??.12,1e-4,e.release??.05);i.connect(a),a.connect(o),o.connect(n),i.start(r),i.stop(s+.05)}play(e,t=0){if(this.ready)switch(e){case`pick`:this.noise({gain:.1,filterFrom:2600,filterTo:1200,decay:.06,q:.9}),this.tone(520,{type:`sine`,gain:.07,decay:.05,release:.04});break;case`slap`:this.noise({gain:.26,filterFrom:3200,filterTo:700,decay:.1,q:.8}),this.tone(180,{type:`sine`,gain:.2,decay:.09,glideTo:90,glideTime:.1});break;case`flip`:this.noise({gain:.16,filterFrom:1400,filterTo:3600,decay:.11,q:1.4}),this.tone(720,{type:`triangle`,gain:.08,decay:.08,glideTo:1180,glideTime:.1});break;case`draw`:this.noise({gain:.2,filterFrom:900,filterTo:2600,decay:.13,q:.7});break;case`foundation`:{this.comboPitch=Math.min(12,t);let e=660*2**(this.comboPitch/12);this.tone(e,{type:`triangle`,gain:.2,attack:.004,decay:.22,release:.2}),this.tone(e*2,{type:`sine`,gain:.12,decay:.18,release:.16,delay:.012}),this.tone(e*3,{type:`sine`,gain:.05,decay:.14,release:.12,delay:.02});break}case`error`:this.tone(150,{type:`sawtooth`,gain:.16,decay:.14,glideTo:80,glideTime:.16,filter:700}),this.tone(96,{type:`sine`,gain:.2,decay:.16});break;case`undo`:this.tone(420,{type:`triangle`,gain:.14,decay:.14,glideTo:240,glideTime:.16}),this.noise({gain:.08,filterFrom:2200,filterTo:900,decay:.1});break;case`hint`:this.tone(880,{type:`sine`,gain:.12,decay:.12,release:.12}),this.tone(1320,{type:`sine`,gain:.08,decay:.12,delay:.08});break;case`ui`:this.tone(560,{type:`square`,gain:.1,decay:.05,release:.04,filter:2400}),this.tone(840,{type:`sine`,gain:.06,decay:.05,delay:.02});break;case`uiBack`:this.tone(420,{type:`square`,gain:.09,decay:.06,glideTo:300,glideTime:.07,filter:1800});break;case`coin`:this.tone(1180,{type:`square`,gain:.09,decay:.05,filter:4200}),this.tone(1560,{type:`square`,gain:.08,decay:.09,delay:.05,filter:4200});break;case`crown`:this.tone(784,{type:`triangle`,gain:.16,decay:.3,release:.25}),this.tone(1175,{type:`sine`,gain:.12,decay:.3,delay:.06}),this.tone(1568,{type:`sine`,gain:.08,decay:.35,delay:.12});break;case`chest`:this.noise({gain:.22,filterFrom:400,filterTo:3e3,decay:.5,q:.6});for(let e=0;e<6;e++)this.tone(523*2**(e/12),{type:`triangle`,gain:.12,decay:.16,delay:.06*e});break;case`whoosh`:this.noise({gain:.16,filterFrom:600,filterTo:2800,decay:.24,q:.5});break;case`fanfare`:[523.25,659.25,783.99,1046.5,783.99,1046.5,1318.5].forEach((e,t)=>{this.tone(e,{type:`square`,gain:.14,decay:.22,release:.2,delay:t*.13,filter:3600}),this.tone(e/2,{type:`triangle`,gain:.1,decay:.24,delay:t*.13})}),this.noise({gain:.1,filterFrom:5e3,filterTo:1200,decay:.5,delay:.6});break;case`lose`:[392,349.23,293.66].forEach((e,t)=>{this.tone(e,{type:`triangle`,gain:.13,decay:.3,delay:t*.16,filter:1400})})}}},au=440,ou=e=>au*2**(e/12),su=[[-7,-3,0],[0,4,7],[-3,0,4],[-2,2,5],[-7,-3,0],[0,4,7],[-3,0,4],[-2,2,5]],cu=[-19,-12,-15,-14,-19,-12,-15,-14],lu=[[0,0,5],[0,1,9],[0,2,12],[0,3,9],[1,0,16],[1,1.5,12],[1,2.5,9],[2,0,11],[2,1,14],[2,2,18],[2,3,14],[3,0,12],[3,2,7],[4,0,5],[4,1,9],[4,2,12],[4,3,16],[5,0,19],[5,1.5,16],[5,2.5,12],[6,0,14],[6,1,18],[6,2,21],[7,0,19],[7,2,12]],uu=class{engine;timer=null;nextNoteTime=0;currentBar=0;tempo=118;playing=!1;intensity=1;constructor(e){this.engine=e}get isPlaying(){return this.playing}start(){!this.playing&&this.engine.ready&&this.engine.ctx&&(this.playing=!0,this.nextNoteTime=this.engine.ctx.currentTime+.12,this.currentBar=0,this.timer=window.setInterval(()=>this.schedule(),40))}stop(){this.playing=!1,this.timer!==null&&window.clearInterval(this.timer),this.timer=null}setIntensity(e){this.intensity=Math.max(.4,Math.min(1.4,e))}barDuration(){return 60/this.tempo*4}schedule(){let e=this.engine.ctx,t=this.engine.musicOutput;if(e&&t&&this.playing)for(;this.nextNoteTime<e.currentTime+.4;)this.scheduleBar(this.currentBar%su.length,this.nextNoteTime,e,t),this.nextNoteTime+=this.barDuration(),this.currentBar++}voice(e,t,n,r,i,a){let o=r+n.beat*i,s=e.createOscillator();s.type=n.type,s.frequency.setValueAtTime(n.freq,o);let c=e.createGain(),l=n.gain*this.intensity;c.gain.setValueAtTime(1e-4,o),c.gain.exponentialRampToValueAtTime(l,o+.02),c.gain.exponentialRampToValueAtTime(l*.6,o+n.dur*.5),c.gain.exponentialRampToValueAtTime(1e-4,o+n.dur);let u=c;if(a){let t=e.createBiquadFilter();t.type=`lowpass`,t.frequency.value=a,c.connect(t),u=t}s.connect(c),u.connect(t),s.start(o),s.stop(o+n.dur+.05)}percussion(e,t,n,r){if(r===`kick`){let r=e.createOscillator();r.type=`sine`,r.frequency.setValueAtTime(150,n),r.frequency.exponentialRampToValueAtTime(48,n+.14);let i=e.createGain();i.gain.setValueAtTime(1e-4,n),i.gain.exponentialRampToValueAtTime(.25*this.intensity,n+.01),i.gain.exponentialRampToValueAtTime(1e-4,n+.2),r.connect(i),i.connect(t),r.start(n),r.stop(n+.25)}else{let r=Math.floor(e.sampleRate*.05),i=e.createBuffer(1,r,e.sampleRate),a=i.getChannelData(0);for(let e=0;e<r;e++)a[e]=(Math.random()*2-1)*(1-e/r);let o=e.createBufferSource();o.buffer=i;let s=e.createBiquadFilter();s.type=`highpass`,s.frequency.value=6e3;let c=e.createGain();c.gain.value=.07*this.intensity,o.connect(s),s.connect(c),c.connect(t),o.start(n)}}scheduleBar(e,t,n,r){let i=60/this.tempo,a=su[e],o=cu[e];for(let e=0;e<4;e++){let a=e%2==0?o:o+7;this.voice(n,r,{beat:e,freq:ou(a),dur:i*.6,gain:.16,type:`triangle`},t,i,900)}for(let e of[.5,1.5,2.5,3.5])for(let o of a)this.voice(n,r,{beat:e,freq:ou(o),dur:i*.32,gain:.05,type:`square`},t,i,1800);for(let[a,o,s]of lu)a===e&&this.voice(n,r,{beat:o,freq:ou(s),dur:i*.55,gain:.09,type:`square`},t,i,3200);this.percussion(n,r,t,`kick`),this.percussion(n,r,t+i*2,`kick`);for(let e=0;e<4;e++)this.percussion(n,r,t+i*(e+.5),`hat`)}},du={menu:[`music/menu-1.mp3`,`music/menu-2.mp3`],play:[`music/play-1.mp3`,`music/play-2.mp3`],tense:[`music/tense-1.mp3`,`music/tense-2.mp3`],win:[`music/win-1.mp3`,`music/win-2.mp3`]},fu={menu:[`play`],play:[`tense`,`win`],tense:[`play`,`win`]},pu={menu:[`menu`,`play`],play:[`play`,`tense`,`win`],tense:[`play`,`tense`,`win`]},mu={menu:.75,play:1,tense:1.25};function hu(e,t,n=Math.random){if(e<=1)return 0;if(t===null||t<0||t>=e)return Math.min(e-1,Math.floor(n()*e));let r=Math.min(e-2,Math.floor(n()*(e-1)));return r>=t?r+1:r}function gu(e,t,n=.002){let r=0;for(;r<e.length&&Math.abs(e[r])<n;)r++;let i=e.length;for(;i>r&&Math.abs(e[i-1])<n;)i--;return i-r<t*.5?{start:0,end:e.length/t}:{start:r/t,end:i/t}}var _u=class{engine;mood=`menu`;wanted=!1;layer=null;buffers=new Map;bounds=new Map;loading=new Map;lastVariant={};queued={};generation=0;stingerUntil=0;filesBroken=!1;synth;base;lowMemory;constructor(e,t={}){this.engine=e,this.synth=new uu(e),this.base=t.base??``,this.lowMemory=t.lowMemory??!1}get isPlaying(){return this.wanted}get currentMood(){return this.mood}get usingFiles(){return!this.filesBroken}start(){this.wanted||(this.wanted=!0,this.engine.ready&&this.engine.ctx&&this.play(this.mood,.8))}stop(){this.wanted=!1,this.generation++,this.fadeOutLayer(.3),this.synth.stop()}setMood(e){if(this.mood!==e&&(this.mood=e,this.wanted)){if(this.filesBroken){this.startSynth(e);return}this.play(e,1.5)}}stinger(e){let t=this.engine.ctx,n=this.engine.musicOutput;if(!this.wanted||this.filesBroken||!t||!n)return!1;let r=this.pick(e),i=this.buffers.get(r);if(!i)return this.load(r),!1;this.generation++,this.fadeOutLayer(.5);let a=t.createBufferSource();a.buffer=i,a.connect(n);let o=t.currentTime+.05;return a.start(o),this.stingerUntil=o+i.duration,!0}play(e,t){if(!this.engine.ctx)return;let n=++this.generation,r=this.pick(e);this.load(r).then(i=>{if(n===this.generation&&this.wanted){if(!i){this.filesBroken=!0,this.startSynth(e);return}if(this.swapLayer(e,r,i,t),this.release(e),!this.lowMemory)for(let t of fu[e])this.load(this.pick(t,!0))}})}startSynth(e){this.fadeOutLayer(.3),this.synth.setIntensity(mu[e]),this.synth.start()}pick(e,t=!1){let n=this.queued[e];if(n)return t||delete this.queued[e],n;let r=du[e],i=hu(r.length,this.lastVariant[e]??null);this.lastVariant[e]=i;let a=r[i];return t&&(this.queued[e]=a),a}swapLayer(e,t,n,r){let i=this.engine.ctx,a=this.engine.musicOutput;if(!i||!a)return;let o=i.currentTime,s=Math.max(o,this.stingerUntil-.4);this.fadeOutLayer(r,o);let c=this.bounds.get(t);c||(c=gu(n.getChannelData(0),n.sampleRate),this.bounds.set(t,c));let l=i.createBufferSource();l.buffer=n,l.loop=!0,l.loopStart=c.start,l.loopEnd=c.end;let u=i.createGain();u.gain.setValueAtTime(1e-4,s),u.gain.exponentialRampToValueAtTime(1,s+Math.max(.05,r)),l.connect(u),u.connect(a),l.start(s,c.start),this.layer={role:e,source:l,gain:u}}fadeOutLayer(e,t){let n=this.layer,r=this.engine.ctx;if(this.layer=null,!n||!r)return;let i=t??r.currentTime;n.gain.gain.cancelScheduledValues(i),n.gain.gain.setValueAtTime(Math.max(1e-4,n.gain.gain.value),i),n.gain.gain.exponentialRampToValueAtTime(1e-4,i+Math.max(.05,e));try{n.source.stop(i+e+.1)}catch{}}release(e){let t=new Set;for(let n of pu[e])if(!(this.lowMemory&&n!==e&&n!==`win`))for(let e of du[n])t.add(e);for(let e of[...this.buffers.keys()])t.has(e)||this.buffers.delete(e)}load(e){let t=this.buffers.get(e);if(t)return Promise.resolve(t);let n=this.loading.get(e);if(n)return n;let r=this.engine.ctx;if(!r)return Promise.resolve(null);let i=fetch(this.base+e).then(e=>{if(!e.ok)throw Error(`HTTP ${e.status}`);return e.arrayBuffer()}).then(e=>vu(r,e)).then(t=>(this.buffers.set(e,t),t)).catch(t=>(console.warn(`[music] не загрузился ${e}:`,t),null)).finally(()=>this.loading.delete(e));return this.loading.set(e,i),i}};function vu(e,t){return new Promise((n,r)=>{let i=e.decodeAudioData(t,n,r);i&&typeof i.then==`function`&&i.then(n,r)})}var yu=[`spades`,`hearts`,`diamonds`,`clubs`],bu=e=>e/13|0,xu=e=>e%13+1,Su=e=>{let t=e/13|0;return t===1||t===2};function Cu(e){let t=e>>>0;return function(){t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function wu(e){let t=String(e).trim();if(/^\d+$/.test(t)){let e=Number(t);if(Number.isSafeInteger(e))return e>>>0}let n=2166136261;for(let e=0;e<t.length;e++)n^=t.charCodeAt(e),n=Math.imul(n,16777619);return n>>>0}function Tu(e,t){for(let n=e.length-1;n>0;n--){let r=Math.floor(t()*(n+1)),i=e[n];e[n]=e[r],e[r]=i}return e}function Eu(){let e=Array(52);for(let t=0;t<52;t++)e[t]=t;return e}function Du(){return{stock:[],waste:[],foundations:[[],[],[],[]],tableau:Array.from({length:7},()=>[]),faceUp:Array(52).fill(!1)}}function Ou(e){let t=Du(),n=0;for(let r=0;r<7;r++)for(let i=0;i<=r;i++){let a=e[n++];t.tableau[r].push(a),t.faceUp[a]=i===r}for(;n<e.length;n++){let r=e[n];t.stock.push(r),t.faceUp[r]=!1}return t.stock.reverse(),t}function ku(e){return Ou(Tu(Eu(),Cu(e)))}function Au(e){return{stock:e.stock.slice(),waste:e.waste.slice(),foundations:e.foundations.map(e=>e.slice()),tableau:e.tableau.map(e=>e.slice()),faceUp:e.faceUp.slice()}}var ju=e=>{let t=e/13|0;return t===1||t===2};function Mu(e){let t=e.tableau.map(e=>e.slice()),n=e.tableau.map(t=>{let n=0;for(;n<t.length&&!e.faceUp[t[n]];)n++;return n});return{stock:e.stock.slice(),waste:e.waste.slice(),found:e.foundations.map(e=>e.length),cols:t,hidden:n,redeals:0}}var Nu=48;function Pu(e){let t=``;for(let n=0;n<7;n++){t+=String.fromCharCode(Nu+e.hidden[n]);let r=e.cols[n];for(let e=0;e<r.length;e++)t+=String.fromCharCode(Nu+r[e]);t+=`|`}for(let n=0;n<4;n++)t+=String.fromCharCode(Nu+e.found[n]);t+=`#`;for(let n=0;n<e.stock.length;n++)t+=String.fromCharCode(Nu+e.stock[n]);t+=`@`;for(let n=0;n<e.waste.length;n++)t+=String.fromCharCode(Nu+e.waste[n]);return t}var Fu=(e,t)=>xu(e)===xu(t)-1&&ju(e)!==ju(t);function Iu(e,t){return e.found[bu(t)]===xu(t)-1}function Lu(e,t){let n=xu(t);if(n<=2)return!0;let r=ju(t),i=r?e.found[0]:e.found[1],a=r?e.found[3]:e.found[2];return Math.min(i,a)>=n-1}function Ru(e,t,n){let r={move:t,drawn:0,flipped:!1,card:-1};switch(t.t){case 0:{let t=Math.min(n,e.stock.length);for(let n=0;n<t;n++)e.waste.push(e.stock.pop());r.drawn=t;break}case 1:for(r.drawn=e.waste.length;e.waste.length;)e.stock.push(e.waste.pop());e.redeals++;break;case 2:{let n=e.cols[t.col],i=n.pop();e.found[bu(i)]++,r.card=i,n.length===e.hidden[t.col]&&e.hidden[t.col]>0&&(e.hidden[t.col]--,r.flipped=!0);break}case 3:{let t=e.waste.pop();e.found[bu(t)]++,r.card=t;break}case 4:{let n=e.cols[t.col],i=n.splice(n.length-t.n,t.n);for(let n=0;n<i.length;n++)e.cols[t.dst].push(i[n]);n.length===e.hidden[t.col]&&e.hidden[t.col]>0&&(e.hidden[t.col]--,r.flipped=!0);break}case 5:e.cols[t.dst].push(e.waste.pop())}return r}function zu(e,t){let n=t.move;switch(n.t){case 0:for(let n=0;n<t.drawn;n++)e.stock.push(e.waste.pop());break;case 1:for(;e.stock.length;)e.waste.push(e.stock.pop());e.redeals--;break;case 2:t.flipped&&e.hidden[n.col]++,e.found[bu(t.card)]--,e.cols[n.col].push(t.card);break;case 3:e.found[bu(t.card)]--,e.waste.push(t.card);break;case 4:{t.flipped&&e.hidden[n.col]++;let r=e.cols[n.dst],i=r.splice(r.length-n.n,n.n);for(let t=0;t<i.length;t++)e.cols[n.col].push(i[t]);break}case 5:e.waste.push(e.cols[n.dst].pop())}}function Bu(e,t){let n=t.drawCount,r=t.maxNodes??12e4,i=t.maxRedeals??(n===1?3:12),a=Mu(e),o=new Set,s=0,c=!1,l=0,u=()=>a.found[0]+a.found[1]+a.found[2]+a.found[3],d=()=>{let e=[];for(let t=0;t<7;t++){let n=a.cols[t];if(n.length===0)continue;let r=n[n.length-1];Iu(a,r)&&e.push({t:2,col:t})}a.waste.length&&Iu(a,a.waste[a.waste.length-1])&&e.push({t:3});for(let t=0;t<7;t++){let n=a.cols[t],r=a.hidden[t],i=n.length-r;if(!(i<=0))for(let o=1;o<=i;o++){let i=n.length-o,s=n[i];if(o>1&&!Fu(n[i+1],s))break;let c=i===r;for(let n=0;n<7;n++){if(n===t)continue;let i=a.cols[n];if(i.length===0){if(xu(s)!==13||c&&r===0)continue;e.push({t:4,col:t,n:o,dst:n})}else if(Fu(s,i[i.length-1])){if(c&&r===0)continue;e.push({t:4,col:t,n:o,dst:n})}}}}if(a.waste.length){let t=a.waste[a.waste.length-1];for(let n=0;n<7;n++){let r=a.cols[n];r.length===0?xu(t)===13&&e.push({t:5,dst:n}):Fu(t,r[r.length-1])&&e.push({t:5,dst:n})}}return a.stock.length>0?e.push({t:0}):a.waste.length>0&&a.redeals<i&&e.push({t:1}),e},f=e=>{if(u()===52)return!0;if(s>=r)return c=!0,!1;if(s++,e>400)return!1;let t=Pu(a);if(o.has(t))return!1;o.add(t);for(let t=0;t<7;t++){let r=a.cols[t];if(!r.length)continue;let i=r[r.length-1];if(Iu(a,i)&&Lu(a,i)){let r=Ru(a,{t:2,col:t},n);return f(e+1)?(l++,!0):(zu(a,r),!1)}}if(a.waste.length){let t=a.waste[a.waste.length-1];if(Iu(a,t)&&Lu(a,t)){let t=Ru(a,{t:3},n);return f(e+1)?(l++,!0):(zu(a,t),!1)}}let i=d();for(let t=0;t<i.length;t++){let o=Ru(a,i[t],n);if(f(e+1))return l++,!0;if(zu(a,o),s>=r)return c=!0,!1}return!1},p=f(0);return{solved:p,nodes:s,exhausted:c&&!p,moveCount:l}}var Vu=9e4;function Hu(e,t,n=Vu){let r=Date.now(),i=Bu(ku(e),{drawCount:t,maxNodes:n});return{seed:e,solvable:i.solved,unknown:!i.solved&&i.exhausted,nodes:i.nodes,ms:Date.now()-r}}function Uu(e,t,n={}){let r=n.maxSeeds??12,i=Cu(e),a=e>>>0;for(let e=0;e<r;e++){if(Hu(a,t,n.maxNodes??9e4).solvable)return{seed:a,verified:!0,attempts:e+1};a=Math.floor(i()*4294967295)>>>0}return{seed:a,verified:!1,attempts:r}}var Wu=class{pools=new Map;cursor;target;constructor(e=Date.now(),t=6){this.cursor=e>>>0,this.target=t,this.pools.set(1,[]),this.pools.set(3,[])}load(e,t){this.pools.set(1,e.slice(0,32)),this.pools.set(3,t.slice(0,32))}export(){return{draw1:(this.pools.get(1)??[]).slice(),draw3:(this.pools.get(3)??[]).slice()}}size(e){return(this.pools.get(e)??[]).length}needsWork(){return this.size(1)<this.target||this.size(3)<this.target}take(e){let t=this.pools.get(e).shift();if(t!==void 0)return{seed:t,verified:!0};let n=Uu(this.nextSeed(),e,{maxSeeds:3,maxNodes:25e3});return{seed:n.seed,verified:n.verified}}work(e=12){let t=Date.now()+e;for(;Date.now()<t&&this.needsWork();){let e=this.size(1)<=this.size(3)?1:3,t=this.nextSeed();Hu(t,e,2e4).solvable&&this.pools.get(e).push(t)}}nextSeed(){return this.cursor=Math.imul(this.cursor^this.cursor>>>15,739982445)+2654435769>>>0,this.cursor}},Gu=e=>e.length?e[e.length-1]:null;function Ku(e,t){switch(t.type){case`stock`:return e.stock;case`waste`:return e.waste;case`foundation`:return e.foundations[t.index];case`tableau`:return e.tableau[t.index]}}var qu=(e,t)=>xu(e)===xu(t)-1&&Su(e)!==Su(t);function Ju(e,t,n){let r=e.tableau[n];if(r.length===0)return xu(t)===13;let i=r[r.length-1];return e.faceUp[i]?qu(t,i):!1}function Yu(e,t,n){if(bu(t)!==n)return!1;let r=e.foundations[n];return xu(t)===r.length+1}function Xu(e,t){let n=bu(t);return Yu(e,t,n)?n:-1}function Zu(e,t){for(let n=0;n<t.length;n++)if(!e.faceUp[t[n]]||n>0&&!qu(t[n],t[n-1]))return!1;return!0}function Qu(e,t){let n=e.tableau[t],r=0;for(let t=n.length-1;t>=0;t--){let i=n[t];if(!e.faceUp[i]||t<n.length-1&&!qu(n[t+1],i))break;r++}return r}function $u(e,t,n){if(t.type===`tableau`){let r=e.tableau[t.index];return n<0||n>=r.length?!1:Zu(e,r.slice(n))}if(t.type===`waste`)return n===e.waste.length-1&&e.waste.length>0;if(t.type===`foundation`){let r=e.foundations[t.index];return n===r.length-1&&r.length>0}return!1}function ed(e,t,n){if(t.kind===`draw`)return e.stock.length>0&&n>0;if(t.kind===`redeal`)return e.stock.length===0&&e.waste.length>0;let{from:r,to:i,count:a}=t;if(a<=0||r.type===`stock`)return!1;let o=Ku(e,r);if(o.length<a)return!1;let s=o.slice(o.length-a);return r.type!==`tableau`&&a!==1||!Zu(e,s)?!1:i.type===`foundation`?a===1&&Yu(e,s[0],i.index):i.type===`tableau`?r.type===`tableau`&&r.index===i.index?!1:Ju(e,s[0],i.index):!1}function td(e,t){let n=[],r=(t,r)=>{let i=Xu(e,r);i>=0&&n.push({kind:`move`,from:t,to:{type:`foundation`,index:i},count:1})},i=Gu(e.waste);if(i!==null){r({type:`waste`,index:0},i);for(let t=0;t<7;t++)Ju(e,i,t)&&n.push({kind:`move`,from:{type:`waste`,index:0},to:{type:`tableau`,index:t},count:1})}for(let t=0;t<7;t++){let i=e.tableau[t];if(i.length===0)continue;let a=Qu(e,t),o=i[i.length-1];e.faceUp[o]&&r({type:`tableau`,index:t},o);for(let r=1;r<=a;r++){let a=i[i.length-r];for(let o=0;o<7;o++)o!==t&&Ju(e,a,o)&&(e.tableau[o].length!==0||i.length!==r)&&n.push({kind:`move`,from:{type:`tableau`,index:t},to:{type:`tableau`,index:o},count:r})}}for(let t=0;t<4;t++){let r=Gu(e.foundations[t]);if(r!==null)for(let i=0;i<7;i++)Ju(e,r,i)&&n.push({kind:`move`,from:{type:`foundation`,index:t},to:{type:`tableau`,index:i},count:1})}return e.stock.length>0?n.push({kind:`draw`}):e.waste.length>0&&n.push({kind:`redeal`}),n}var nd=e=>e.foundations.every(e=>e.length===13),rd=e=>e.tableau.every(t=>t.every(t=>e.faceUp[t]));function id(e,t){let n=xu(t);if(n<=2)return!0;let r=e.foundations,i=Su(t),a=i?r[0].length:r[1].length,o=i?r[3].length:r[2].length;return Math.min(a,o)>=n-1}var ad={toFoundation:10,wasteToTableau:5,revealCard:5,fromFoundation:-15,recycleDraw1:-100,recycleDraw3:-20},od=[1,1.5,2,2.5,3,4,5],sd=e=>od[Math.min(e,od.length-1)],cd=e=>e>30?Math.min(1200,Math.floor(1e5/e)):0,ld=e=>e>=2?e*25:0,ud=()=>({level:0,lastAtMs:-1e9,best:0});function dd(e,t){return t-e.lastAtMs<=3200?e.level+=1:e.level=0,e.lastAtMs=t,e.level+1>e.best&&(e.best=e.level+1),sd(e.level)}function fd(e){e.level=0,e.lastAtMs=-1e9}var pd=class{seed;vegas;drawCount;state;score;moves=0;elapsedMs=0;undoUsed=0;recycles=0;combo=ud();bestCombo=0;cardsToFoundation=0;won=!1;history=[];constructor(e){this.seed=e.seed,this.drawCount=e.drawCount,this.vegas=e.vegas??!1,this.state=ku(e.seed),this.score=this.vegas?-52:0}tick(e){this.won||(this.elapsedMs+=e)}get seconds(){return Math.floor(this.elapsedMs/1e3)}get canUndo(){return this.history.length>0}get historyLength(){return this.history.length}get foundationCount(){return this.state.foundations.reduce((e,t)=>e+t.length,0)}legalMoves(){return td(this.state,this.drawCount)}canGrab(e,t){return $u(this.state,e,t)}runLength(e){return Qu(this.state,e)}canRoyalHelp(e){if(e.kind!==`move`)return!1;let{from:t,to:n,count:r}=e;if(n.type!==`tableau`||this.state.tableau[n.index].length>0||r<=0||t.type===`stock`||t.type===`tableau`&&t.index===n.index)return!1;let i=Ku(this.state,t);if(i.length<r)return!1;let a=i.slice(i.length-r);return t.type!==`tableau`&&r!==1||!Zu(this.state,a)?!1:xu(a[0])!==13}apply(e,t={}){if(!(t.royalHelp?this.canRoyalHelp(e):ed(this.state,e,this.drawCount)))return null;let n=this.state,r={move:e,drawn:0,flipped:null,scoreBefore:this.score,recyclesBefore:this.recycles,comboBefore:{...this.combo}},i=[],a={type:`stock`,index:0},o={type:`waste`,index:0},s=0,c=1,l=!1;if(e.kind===`draw`){let e=Math.min(this.drawCount,n.stock.length);for(let t=0;t<e;t++){let e=n.stock.pop();n.faceUp[e]=!0,n.waste.push(e),i.push(e)}r.drawn=e,fd(this.combo)}else if(e.kind===`redeal`){for(i=n.waste.slice();n.waste.length;){let e=n.waste.pop();n.faceUp[e]=!1,n.stock.push(e)}this.recycles++,this.vegas||(s=this.drawCount===1?ad.recycleDraw1:ad.recycleDraw3),a={type:`waste`,index:0},o={type:`stock`,index:0},fd(this.combo)}else{a=e.from,o=e.to;let t=Ku(n,a),u=Ku(n,o);i=t.splice(t.length-e.count,e.count);for(let e of i)u.push(e);if(o.type===`foundation`?(l=!0,this.cardsToFoundation++,c=dd(this.combo,this.elapsedMs),this.bestCombo=this.combo.best,s+=this.vegas?5:Math.round(ad.toFoundation*c)):a.type===`foundation`?(this.cardsToFoundation--,this.vegas?s-=5:s+=ad.fromFoundation,fd(this.combo)):a.type===`waste`&&o.type===`tableau`&&(this.vegas||(s+=ad.wasteToTableau)),a.type===`tableau`&&t.length>0){let e=t[t.length-1];n.faceUp[e]||(n.faceUp[e]=!0,r.flipped=e,this.vegas||(s+=ad.revealCard))}}this.score=Math.max(this.vegas?-999:0,this.score+s),this.moves++,this.history.push(r);let u=nd(n);return u&&!this.won&&(this.won=!0),{move:e,cards:i,from:a,to:o,flipped:r.flipped,scoreDelta:s,combo:c,comboLevel:l?this.combo.level:0,toFoundation:l,won:u}}undo(){let e=this.history.pop();if(!e)return null;let t=this.state,n=e.move,r=[],i={type:`stock`,index:0},a={type:`waste`,index:0};if(n.kind===`draw`){for(let n=0;n<e.drawn;n++){let e=t.waste.pop();t.faceUp[e]=!1,t.stock.push(e),r.push(e)}i={type:`waste`,index:0},a={type:`stock`,index:0}}else if(n.kind===`redeal`){for(;t.stock.length;){let e=t.stock.pop();t.faceUp[e]=!0,t.waste.push(e),r.push(e)}i={type:`stock`,index:0},a={type:`waste`,index:0}}else{let o=Ku(t,n.from),s=Ku(t,n.to);e.flipped!==null&&(t.faceUp[e.flipped]=!1),r=s.splice(s.length-n.count,n.count);for(let e of r)o.push(e);n.to.type===`foundation`&&this.cardsToFoundation--,n.from.type===`foundation`&&this.cardsToFoundation++,i=n.to,a=n.from}return this.score=e.scoreBefore,this.recycles=e.recyclesBefore,this.combo={...e.comboBefore},this.moves++,this.undoUsed++,this.won=nd(t),{move:n,cards:r,from:i,to:a,flipped:e.flipped,scoreDelta:0,combo:1,comboLevel:0,toFoundation:!1,won:this.won}}autoTarget(e,t){let n=Ku(this.state,e);if(t!==n.length-1){if(e.type!==`tableau`)return null;let r=n.length-t;if(!$u(this.state,e,t))return null;for(let t=0;t<7;t++){if(t===e.index)continue;let n={kind:`move`,from:e,to:{type:`tableau`,index:t},count:r};if(ed(this.state,n,this.drawCount))return n}return null}let r=n[t];if(r===void 0)return null;let i=Xu(this.state,r);if(i>=0){let t={kind:`move`,from:e,to:{type:`foundation`,index:i},count:1};if(ed(this.state,t,this.drawCount))return t}if(e.type===`foundation`)return null;let a=[];for(let t=0;t<7;t++){if(e.type===`tableau`&&t===e.index)continue;let n={kind:`move`,from:e,to:{type:`tableau`,index:t},count:1};ed(this.state,n,this.drawCount)&&a.push(n)}return a.length===0?null:a.find(e=>this.state.tableau[e.kind===`move`?e.to.index:0].length>0)??a[0]}canAutoComplete(){return!this.won&&rd(this.state)}nextAutoCompleteMove(){if(this.won)return null;let e=this.state,t=null,n=99,r=(r,i)=>{if(i===null)return;let a=Xu(e,i);if(a<0)return;let o=xu(i);o<n&&(n=o,t={kind:`move`,from:r,to:{type:`foundation`,index:a},count:1})};for(let t=0;t<7;t++){let n=Gu(e.tableau[t]);n!==null&&e.faceUp[n]&&r({type:`tableau`,index:t},n)}return r({type:`waste`,index:0},Gu(e.waste)),t||(e.stock.length>0?{kind:`draw`}:e.waste.length>0?{kind:`redeal`}:null)}isReverseOfLast(e){let t=this.history[this.history.length-1]?.move;return!t||t.kind!==`move`||e.kind!==`move`||t.count!==e.count?!1:t.from.type===e.to.type&&t.from.index===e.to.index&&t.to.type===e.from.type&&t.to.index===e.from.index}toHint(e,t){let n=this.state;if(e.kind!==`move`){let r={type:`stock`,index:0},i=Gu(n.stock);return{cards:i===null?[]:[i],from:r,to:r,weight:t,move:e}}let r=Ku(n,e.from);return{cards:r.slice(r.length-e.count),from:e.from,to:e.to,weight:t,move:e}}hint(e=0){let t=typeof e==`number`?{skip:e}:e,n=t.skip??0,r=this.state,i=[];for(let e of this.legalMoves()){let t;if(e.kind===`draw`)t=30;else if(e.kind===`redeal`)t=24;else{let n=Ku(r,e.from),i=n.slice(n.length-e.count)[0];if(e.to.type===`foundation`){if(t=id(r,i)?90+xu(i):34,e.from.type===`tableau`){let i=n.length-e.count-1;i>=0&&!r.faceUp[n[i]]&&(t+=40)}}else if(e.from.type===`foundation`)t=5;else if(e.from.type===`tableau`){let i=n.length-e.count-1;t=i>=0&&!r.faceUp[n[i]]?80+e.count:n.length===e.count?55:18}else t=60+(xu(i)===13?5:0);e.to.type===`tableau`&&r.tableau[e.to.index].length===0&&(t+=xu(i)===13?8:0),this.isReverseOfLast(e)&&(t=1)}i.push(this.toHint(e,t))}if(i.length===0)return null;if(i.sort((e,t)=>t.weight-e.weight),t.solver&&n===0){let e=this.bestProvenMove(i,t.solverNodes??45e3);if(e)return e}return i[n%i.length]}bestProvenMove(e,t){let n=e.filter(e=>e.weight>1).slice(0,5);if(n.length===0)return null;let r=Math.max(6e3,Math.floor(t/n.length));for(let e of n){let t=this.stateAfter(e.move);if(t&&Bu(t,{drawCount:this.drawCount,maxNodes:r}).solved)return{...e,proven:!0}}return null}stateAfter(e){let t={score:this.score,moves:this.moves,undoUsed:this.undoUsed,recycles:this.recycles,bestCombo:this.bestCombo,cardsToFoundation:this.cardsToFoundation,won:this.won},n={...this.combo};if(!this.apply(e))return null;let r=Au(this.state);return this.undo(),Object.assign(this,t),this.combo=n,r}finalScore(){let e=this.score,t=this.vegas?0:cd(this.seconds),n=this.vegas?0:ld(this.bestCombo);return{base:e,time:t,combo:n,total:e+t+n}}snapshot(){return Au(this.state)}restore(e){this.state=e.state,this.score=e.score,this.moves=e.moves,this.elapsedMs=e.elapsedMs,this.undoUsed=e.undoUsed,this.recycles=e.recycles,this.bestCombo=e.bestCombo,this.cardsToFoundation=e.cardsToFoundation,this.combo=ud(),this.history=[],this.won=nd(this.state)}},md=330,hd=36,gd=class{el;handlers;active=!1;startX=0;startY=0;startTime=0;maxDist=0;lastTapTime=0;lastTapX=0;lastTapY=0;pointerId=null;constructor(e,t){this.el=e,this.handlers=t,e.addEventListener(`pointerdown`,this.down),e.addEventListener(`pointermove`,this.move),window.addEventListener(`pointerup`,this.up),window.addEventListener(`pointercancel`,this.cancel),e.addEventListener(`contextmenu`,this.prevent)}prevent=e=>e.preventDefault();sample(e){let t=this.el.getBoundingClientRect(),n=e.clientX-t.left,r=e.clientY-t.top;return{x:n,y:r,ndcX:n/Math.max(1,t.width)*2-1,ndcY:-(r/Math.max(1,t.height))*2+1,time:performance.now(),touch:e.pointerType!==`mouse`}}down=e=>{if(e.button!==void 0&&e.button!==0||this.active)return;let t=this.sample(e);this.active=!0,this.pointerId=e.pointerId,this.startX=t.x,this.startY=t.y,this.startTime=t.time,this.maxDist=0;try{this.el.setPointerCapture(e.pointerId)}catch{}if(t.time-this.lastTapTime<md&&Math.hypot(t.x-this.lastTapX,t.y-this.lastTapY)<hd){this.lastTapTime=0,this.handlers.onDoubleTap?.(t),this.active=!1;return}this.lastTapTime=t.time,this.lastTapX=t.x,this.lastTapY=t.y,this.handlers.onDown?.(t)};move=e=>{let t=this.sample(e);if(!this.active){this.handlers.onHover?.(t);return}this.maxDist=Math.max(this.maxDist,Math.hypot(t.x-this.startX,t.y-this.startY)),this.handlers.onMove?.(t)};up=e=>{if(!this.active||this.pointerId!==null&&e.pointerId!==this.pointerId)return;this.active=!1;let t=this.sample(e);this.handlers.onUp?.(t,this.maxDist,t.time-this.startTime),this.pointerId=null};cancel=e=>{if(!this.active)return;this.active=!1;let t=this.sample(e);this.handlers.onUp?.(t,this.maxDist,t.time-this.startTime),this.pointerId=null};dispose(){this.el.removeEventListener(`pointerdown`,this.down),this.el.removeEventListener(`pointermove`,this.move),window.removeEventListener(`pointerup`,this.up),window.removeEventListener(`pointercancel`,this.cancel),this.el.removeEventListener(`contextmenu`,this.prevent)}},_d=.62,vd=-.42,yd=class{deps;pointer=null;cards=[];from=null;targets=[];base=new V;prev=new V;tilt={x:0,z:0};touchMode=!1;snapRef=null;constructor(e){this.deps=e}attach(e){this.pointer=new gd(e,{onDown:e=>this.onDown(e),onMove:e=>this.onMove(e),onUp:(e,t,n)=>this.onUp(e,t,n),onDoubleTap:e=>this.onDoubleTap(e),onHover:e=>this.onHover(e)})}get dragging(){return this.cards.length>0}onDown(e){this.deps.onPointerActivity?.();let t=this.deps.game();if(!t||!this.deps.enabled())return;this.touchMode=e.touch;let n=this.deps.stage.raycastFrom(e.ndcX,e.ndcY),r=this.deps.board().pick(n);if(r&&t.canGrab(r.slot.ref,r.slot.index)){let n=Ku(t.state,r.slot.ref);this.cards=n.slice(r.slot.index),this.from=r.slot.ref,this.deps.board().beginDrag(this.cards),this.targets=this.computeTargets(t,this.cards,r.slot.ref),this.deps.board().showTargets(t.state,this.targets),this.deps.onPickup(this.cards),this.updateDragPosition(e,!0);return}let i=this.deps.stage.pickTable(e.ndcX,e.ndcY,.02);if(this.deps.board().pileAt(t.state,i)?.type===`stock`){let e=t.state.stock.length>0?{kind:`draw`}:{kind:`redeal`};ed(t.state,e,t.drawCount)&&this.deps.onMove(e,`tap`)}}computeTargets(e,t,n){let r=[],i=t.length;for(let t=0;t<4;t++){let a={type:`foundation`,index:t};ed(e.state,{kind:`move`,from:n,to:a,count:i},e.drawCount)&&r.push(a)}for(let t=0;t<7;t++){let a={type:`tableau`,index:t};ed(e.state,{kind:`move`,from:n,to:a,count:i},e.drawCount)&&r.push(a)}return r}updateDragPosition(e,t=!1){let n=this.deps.game();if(!n||this.cards.length===0)return;let r=this.deps.stage.pickTable(e.ndcX,e.ndcY,_d);if(this.touchMode&&(r.z+=vd),this.snapRef=this.deps.board().nearestPile(n.state,r,this.targets),this.snapRef){let e=this.deps.board().dropPosition(n.state,this.snapRef,new V);r.x+=(e.x-r.x)*.22,r.z+=(e.z-r.z)*.22}t?(this.prev.copy(r),this.tilt.x=0,this.tilt.z=0):(this.tilt.x=(r.x-this.prev.x)*6,this.tilt.z=(r.z-this.prev.z)*6,this.tilt.x=Math.max(-1,Math.min(1,this.tilt.x)),this.tilt.z=Math.max(-1,Math.min(1,this.tilt.z)),this.prev.copy(r)),this.base.copy(r),this.deps.board().updateDrag(this.cards,this.base,this.tilt)}onMove(e){this.cards.length!==0&&this.updateDragPosition(e)}onHover(e){let t=this.deps.game();if(!t||!this.deps.enabled())return;let n=this.deps.stage.raycastFrom(e.ndcX,e.ndcY),r=this.deps.board().pick(n),i=!!r&&t.canGrab(r.slot.ref,r.slot.index);this.deps.onHoverChange?.(i)}onUp(e,t,n){if(this.cards.length===0)return;let r=this.deps.game(),i=this.cards,a=this.from;if(this.cards=[],this.from=null,this.deps.board().clearHighlights(),this.deps.board().endDrag(i),!r||!a)return;let o=this.deps.stage.pickTable(e.ndcX,e.ndcY,.02);this.touchMode&&(o.z+=vd);let s=this.deps.board().nearestPile(r.state,o,this.targets)??this.snapRef;if(this.targets=[],this.snapRef=null,s){let e={kind:`move`,from:a,to:s,count:i.length};if(ed(r.state,e,r.drawCount)){this.deps.onMove(e,`drag`);return}}let c=this.deps.board().pileAt(r.state,o);if(c?.type===`tableau`&&r.state.tableau[c.index].length===0){let e={kind:`move`,from:a,to:c,count:i.length};if(r.canRoyalHelp(e)&&this.deps.onEmptyColumn?.(e,this.base.clone())){this.deps.board().returnCards(i,r.state);return}}this.deps.onIllegal(i,this.base.clone()),this.deps.board().returnCards(i,r.state)}onDoubleTap(e){this.deps.onPointerActivity?.();let t=this.deps.game();if(!t||!this.deps.enabled())return;if(this.cards.length){let e=this.cards;this.cards=[],this.deps.board().clearHighlights(),this.deps.board().endDrag(e),this.deps.board().returnCards(e,t.state);return}let n=this.deps.stage.raycastFrom(e.ndcX,e.ndcY),r=this.deps.board().pick(n);if(!r){let n=this.deps.stage.pickTable(e.ndcX,e.ndcY,.02);if(this.deps.board().pileAt(t.state,n)?.type===`stock`){let e=t.state.stock.length>0?{kind:`draw`}:{kind:`redeal`};ed(t.state,e,t.drawCount)&&this.deps.onMove(e,`tap`)}return}let i=t.autoTarget(r.slot.ref,r.slot.index);i?this.deps.onMove(i,`double`):this.deps.onIllegal([r.card],this.deps.board().cardPosition(r.card,new V))}cancel(){let e=this.deps.game();if(this.cards.length&&e){let t=this.cards;this.cards=[],this.deps.board().clearHighlights(),this.deps.board().endDrag(t),this.deps.board().returnCards(t,e.state)}this.cards=[],this.from=null,this.targets=[]}dispose(){this.pointer?.dispose(),this.pointer=null}},bd=1.4,xd=.05,Sd=.11,Cd=.02,wd=.34,Td=.46,Ed=1.04,Dd=1.12,Od=1.05;function kd(e){return e>=1.95?Od:Ad}var Ad=1.3;function jd(e){let t=Math.tan(36*Math.PI/180/2),n=e.depth/2*(Math.cos(e.tilt)/t+Math.sin(e.tilt))*e.marginV,r=e.width*e.marginW/(2*t*Math.max(.05,e.aspect));return Math.max(n,r)}function Md(e,t,n,r){let i=Math.tan(36*Math.PI/180/2);return 2*(e*n/(2*i*Math.max(.05,t)))/(r*(Math.cos(Td)/i+Math.sin(Td)))}var Nd=class{cfg;metrics;constructor(e){this.cfg={aspect:16/9,...e},this.metrics=this.computeMetrics()}update(e){this.cfg={...this.cfg,...e},this.metrics=this.computeMetrics()}computeMetrics(){return this.cfg.portrait?this.portraitMetrics():this.landscapeMetrics()}landscapeMetrics(){let e=-2.6975;return{columnGap:1.22,fanDown:.19,fanUp:.34,topZ:e,tableauZ:-1.0735,minX:-4.16,maxX:4.16,minZ:e-bd/2,maxZ:1.7735000000000003,wasteStep:.34,sideMargin:.6}}portraitMetrics(){let e=Md(7.619999999999999,Math.max(.28,Math.min(1,this.cfg.aspect??.5)),Ed,Dd),t=8.569999999999999,n=Math.max(bd*.45,Math.min(bd*1.6,e-t)),r=-(t+n)/2+bd*.65,i=r+bd+n;return{columnGap:1.045,fanDown:.3,fanUp:.7,topZ:r,tableauZ:i,minX:-3.635,maxX:3.635,minZ:r-bd/2,maxZ:i+bd/2+5.35,wasteStep:.26,sideMargin:.35}}columnX(e){let t=(e-3)*this.metrics.columnGap;return this.cfg.leftHanded?-t:t}anchor(e){let t=this.metrics;return e.type===`tableau`?{x:this.columnX(e.index),z:t.tableauZ}:e.type===`stock`?{x:this.columnX(0),z:t.topZ}:e.type===`waste`?{x:this.columnX(1),z:t.topZ}:{x:this.columnX(3+e.index),z:t.topZ}}tableauOffset(e,t,n){let r=this.metrics,i=r.maxZ-r.tableauZ-bd*.5,a=r.fanDown,o=r.fanUp,s=e*a+Math.max(0,n-1)*o;if(s>i&&s>0){let e=i/s;a*=e,o*=e}return e*a+t*o}wasteFanX(e){let t=this.metrics.wasteStep,n=this.cfg.leftHanded?-1:1;return(2-Math.min(e,2))*t*n}get wasteFanWidth(){return this.metrics.wasteStep*2}stackLift(e,t){return t<=1?0:e*Math.min(Cd*1.6,wd/(t-1))}bounds(){let e=this.metrics;return{width:e.maxX-e.minX+e.sideMargin,depth:e.maxZ-e.minZ+bd*.3,centerZ:(e.minZ+e.maxZ)/2}}};function Pd(e,t,n,r=4){let i=e/2,a=t/2,o=Math.min(n,i,a),s=[[i-o,-(a-o)],[-(i-o),-(a-o)],[-(i-o),a-o],[i-o,a-o]],c=[];for(let e=0;e<4;e++){let[t,n]=s[e],i=e*Math.PI/2;for(let e=0;e<=r;e++){let a=i+e/r*(Math.PI/2),s=Math.cos(a),l=-Math.sin(a);c.push({x:t+o*s,z:n+o*l,nx:s,nz:l})}}return c}var Fd=(e,t,n)=>e+(t-e)*n;function Id(e,t,n,r={}){let i=r.width??1,a=r.height??1.4,o=r.thickness??.05,s=Pd(i,a,r.radius??.11,r.segments??4),c=s.length,l=o/2,u=[],d=[],f=[],p=t=>Fd(e.u0,e.u1,(t+i/2)/i),m=t=>Fd(e.vTop,e.vBot,(t+a/2)/a),h=e=>Fd(t.u0,t.u1,(e+i/2)/i),g=e=>Fd(t.vTop,t.vBot,(a/2-e)/a);for(let e=0;e<c;e++){let t=s[e],n=s[(e+1)%c];u.push(0,l,0,t.x,l,t.z,n.x,l,n.z),d.push(0,1,0,0,1,0,0,1,0),f.push(p(0),m(0),p(t.x),m(t.z),p(n.x),m(n.z))}for(let e=0;e<c;e++){let t=s[e],n=s[(e+1)%c];u.push(0,-l,0,n.x,-l,n.z,t.x,-l,t.z),d.push(0,-1,0,0,-1,0,0,-1,0),f.push(h(0),g(0),h(n.x),g(n.z),h(t.x),g(t.z))}let _=n.u0,v=n.vTop;for(let e=0;e<c;e++){let t=s[e],n=s[(e+1)%c];u.push(t.x,l,t.z,t.x,-l,t.z,n.x,-l,n.z,t.x,l,t.z,n.x,-l,n.z,n.x,l,n.z),d.push(t.nx,0,t.nz,t.nx,0,t.nz,n.nx,0,n.nz,t.nx,0,t.nz,n.nx,0,n.nz,n.nx,0,n.nz);for(let e=0;e<6;e++)f.push(_,v)}let y=new dr;return y.setAttribute(`position`,new Xn(new Float32Array(u),3)),y.setAttribute(`normal`,new Xn(new Float32Array(d),3)),y.setAttribute(`uv`,new Xn(new Float32Array(f),2)),y.computeBoundingSphere(),y}function Ld(e,t,n={}){let r=n.width??1,i=n.height??1.4,a=Pd(r,i,n.radius??.11,n.segments??4),o=a.length,s=e.getAttribute(`uv`),c=e=>Fd(t.u0,t.u1,(e+r/2)/r),l=e=>Fd(t.vTop,t.vBot,(i/2-e)/i),u=o*3;for(let e=0;e<o;e++){let t=a[e],n=a[(e+1)%o];s.setXY(u++,c(0),l(0)),s.setXY(u++,c(n.x),l(n.z)),s.setXY(u++,c(t.x),l(t.z))}s.needsUpdate=!0}function Rd(e,t,n,r,i=5){let a=Pd(e,t,n,i),o=a.length,s=[],c=[],l=[],u=t=>r?Fd(r.u0,r.u1,(t+e/2)/e):(t+e/2)/e,d=e=>r?Fd(r.vTop,r.vBot,(e+t/2)/t):1-(e+t/2)/t;for(let e=0;e<o;e++){let t=a[e],n=a[(e+1)%o];s.push(0,0,0,t.x,0,t.z,n.x,0,n.z),c.push(0,1,0,0,1,0,0,1,0),l.push(u(0),d(0),u(t.x),d(t.z),u(n.x),d(n.z))}let f=new dr;return f.setAttribute(`position`,new Xn(new Float32Array(s),3)),f.setAttribute(`normal`,new Xn(new Float32Array(c),3)),f.setAttribute(`uv`,new Xn(new Float32Array(l),2)),f.computeBoundingSphere(),f}var zd=.02,Bd=.03;function Vd(e,t,n){let r=Math.min(1,Math.max(0,n));return e+(t-e)*r+Math.sin(Math.PI*r)*.3}var Hd=class e{atlas;decals;layout;tweens;group=new cn;cardsGroup=new cn;slotsGroup=new cn;glowGroup=new cn;geometries=[];meshes=[];material;atlasTexture;decalTexture;slotMeshes=new Map;glowPool=[];activeGlows=[];hintGlow=null;hintLift=null;glowTime=0;glowGeom;glowMaterial;slotOf=new Map;targets=new Map;dragging=new Set;jitter=[];hintTag=`hint`;backSkinId;animSpeed=1;constructor(t,n,r,i,a=`royal`){this.atlas=t,this.decals=n,this.layout=r,this.tweens=i,this.backSkinId=a,this.atlasTexture=e.makeAtlasTexture(t),this.decalTexture=new $r(n.canvas),this.decalTexture.colorSpace=Be,this.decalTexture.anisotropy=4,this.material=new bi({map:this.atlasTexture,roughness:.62,metalness:.04});let o=t.edgeUV(),s=t.backUV(a);for(let e=0;e<52;e++){let n=Id(t.faceUV(e),s,o),r=new G(n,this.material);r.castShadow=!0,r.receiveShadow=!0,r.userData.cardId=e,r.frustumCulled=!1,this.geometries.push(n),this.meshes.push(r),this.cardsGroup.add(r),this.jitter.push((e*2654435761%1e3/1e3-.5)*.05)}this.glowGeom=Rd(1.16,bd*1.13,Sd*1.3,void 0,5),this.glowMaterial=new Sr({color:16769146,transparent:!0,opacity:.5,blending:2,depthWrite:!1}),this.group.add(this.slotsGroup),this.group.add(this.glowGroup),this.group.add(this.cardsGroup),this.buildSlots()}static maxAnisotropy=8;static makeAtlasTexture(t){let n=new $r(t.canvas);return n.colorSpace=Be,n.anisotropy=e.maxAnisotropy,n.minFilter=c,n.magFilter=o,n.generateMipmaps=!0,n}setAtlas(t,n=this.backSkinId){this.atlas=t;let r=this.atlasTexture;this.atlasTexture=e.makeAtlasTexture(t),this.material.map=this.atlasTexture,this.material.needsUpdate=!0,r.dispose(),this.setBackSkin(n)}setDecals(e,t){this.decals=e;let n=this.decalTexture;this.decalTexture=new $r(e.canvas),this.decalTexture.colorSpace=Be,this.decalTexture.anisotropy=4,n.dispose(),this.buildSlots(),t&&this.applyState(t,!1)}slotDecal(e){return e.type===`foundation`?`foundation-${yu[e.index]}`:e.type===`stock`?`stock-refresh`:e.type===`waste`?`stock-empty`:`tableau`}buildSlots(){for(let e of this.slotMeshes.values())e.geometry.dispose(),e.material.dispose(),this.slotsGroup.remove(e);this.slotMeshes.clear();let e=[{type:`stock`,index:0},{type:`waste`,index:0}];for(let t=0;t<4;t++)e.push({type:`foundation`,index:t});for(let t=0;t<7;t++)e.push({type:`tableau`,index:t});for(let t of e){let e=new G(Rd(1,bd,Sd,this.decals.uv(this.slotDecal(t)),5),new Sr({map:this.decalTexture,transparent:!0,opacity:.9,depthWrite:!1})),n=this.layout.anchor(t);e.position.set(n.x,zd,n.z),e.renderOrder=-1,this.slotMeshes.set(`${t.type}:${t.index}`,e),this.slotsGroup.add(e)}}relayout(e){this.buildSlots(),this.applyState(e,!1)}setBackSkin(e){this.backSkinId=e;let t=this.atlas.backUV(e);for(let e of this.geometries)Ld(e,t)}computeTargets(e){let t=new Map,n=(e,n,r,i,a,o)=>t.set(e,{x:n,y:r,z:i,faceUp:a,spin:o}),r=this.layout.anchor({type:`stock`,index:0}),i=e.stock.length;e.stock.forEach((e,t)=>{let a=t===i-1?this.jitter[e]:0;n(e,r.x,zd+this.layout.stackLift(t,i),r.z,!1,a)});let a=this.layout.anchor({type:`waste`,index:0}),o=e.waste.length;e.waste.forEach((e,t)=>{let r=o-1-t;n(e,a.x+this.layout.wasteFanX(r),zd+this.layout.stackLift(t,o),a.z,!0,r<=2?this.jitter[e]*.5:0)});for(let t=0;t<4;t++){let r=this.layout.anchor({type:`foundation`,index:t}),i=e.foundations[t];i.forEach((e,t)=>{let a=t===i.length-1?this.jitter[e]:0;n(e,r.x,zd+this.layout.stackLift(t,i.length),r.z,!0,a)})}for(let t=0;t<7;t++){let r=this.layout.anchor({type:`tableau`,index:t}),i=e.tableau[t],a=i.filter(t=>!e.faceUp[t]).length,o=i.length-a,s=0,c=0;i.forEach((t,l)=>{let u=e.faceUp[t],d=this.layout.tableauOffset(u?a:s,u?c:0,o);u?c++:s++,n(t,r.x,zd+this.layout.stackLift(l,i.length),r.z+d,u,this.jitter[t])})}return t}rebuildSlotMap(e){this.slotOf.clear();let t=(e,t)=>{e.forEach((e,n)=>this.slotOf.set(e,{ref:t,index:n}))};t(e.stock,{type:`stock`,index:0}),t(e.waste,{type:`waste`,index:0}),e.foundations.forEach((e,n)=>t(e,{type:`foundation`,index:n})),e.tableau.forEach((e,n)=>t(e,{type:`tableau`,index:n}))}applyState(e,t=!1,n=0){this.clearHighlights();let r=this.computeTargets(e);this.targets=r,this.rebuildSlotMap(e);let i=0;for(let[e,a]of r){let r=this.meshes[e];this.dragging.has(e)||(t?this.tweenTo(e,a,{duration:.32,delay:n*i++,arc:.25}):(r.position.set(a.x,a.y,a.z),r.rotation.set(a.faceUp?0:Math.PI,a.spin,0),r.scale.setScalar(1)))}this.updateSlotVisibility(e)}dealIntro(e,t){this.clearHighlights();let n=this.computeTargets(e);this.targets=n,this.rebuildSlotMap(e);let r=this.layout.anchor({type:`stock`,index:0}),i=[];for(let e=0;e<52;e++)i.push(e);i.forEach((e,t)=>{let n=this.meshes[e];this.tweens.killByTag(`card:${e}`),n.position.set(r.x,zd+this.layout.stackLift(t,52),r.z),n.rotation.set(Math.PI,t===51?this.jitter[e]:0,0),n.scale.setScalar(1)});let a=[];for(let t=0;t<7;t++)for(let n=t;n<7;n++){let r=e.tableau[n][t];r!==void 0&&a.push(r)}let o=a.length,s=0;a.forEach((e,r)=>{let i=n.get(e);if(!i)return;let a=.115-r/o*.075;s+=a,this.tweenTo(e,i,{duration:.34,delay:s,arc:.75,squash:!0}),t&&this.tweens.add({duration:Math.max(.001,s+.3),onComplete:()=>t(e,r,o)})});for(let[e,t]of n)a.includes(e)||this.tweenTo(e,t,{duration:.3,delay:s*.5});return this.updateSlotVisibility(e),s+.5}updateSlotVisibility(e){let t=(e,t)=>{let n=this.slotMeshes.get(`${e.type}:${e.index}`);n&&(n.visible=t)};t({type:`stock`,index:0},e.stock.length===0),t({type:`waste`,index:0},e.waste.length===0);for(let n=0;n<4;n++)t({type:`foundation`,index:n},e.foundations[n].length===0);for(let n=0;n<7;n++)t({type:`tableau`,index:n},e.tableau[n].length===0)}tweenTo(e,t,n={}){let r=this.meshes[e],i=`card:${e}`;this.tweens.killByTag(i);let a=r.position.clone(),o=r.rotation.x,s=t.faceUp?0:Math.PI,c=(n.duration??.3)/Math.max(.2,this.animSpeed),l=n.arc??0,u=Math.abs((o%(Math.PI*2)+Math.PI*2)%(Math.PI*2)-(s%(Math.PI*2)+Math.PI*2)%(Math.PI*2))>.01;this.tweens.add({duration:c,delay:n.delay??0,ease:Gc,tag:i,onUpdate:e=>{r.position.x=a.x+(t.x-a.x)*e,r.position.z=a.z+(t.z-a.z)*e;let n=Math.sin(Math.PI*Math.min(1,Math.max(0,e)))*l;r.position.y=a.y+(t.y-a.y)*e+n,u&&(r.rotation.x=o+(s-o)*Kc(Math.min(1,e))),r.rotation.y=t.spin*e},onComplete:()=>{r.position.set(t.x,t.y,t.z),r.rotation.set(s,t.spin,0),n.squash&&this.squash(e,.14)}})}squash(e,t=.18){let n=this.meshes[e],r=`squash:${e}`;this.tweens.killByTag(r),this.tweens.add({duration:.42/Math.max(.2,this.animSpeed),ease:Jc(1,.4),tag:r,onUpdate:e=>{let r=1-e;n.scale.set(1+r*t,1,1-r*t*.8)},onComplete:()=>n.scale.setScalar(1)})}flipCard(e,t,n=0){let r=this.meshes[e],i=`card:${e}`;this.tweens.killByTag(i);let a=r.rotation.x,o=t?0:Math.PI,s=r.position.y;this.tweens.add({duration:.34/Math.max(.2,this.animSpeed),delay:n,ease:Kc,tag:i,onUpdate:e=>{r.rotation.x=a+(o-a)*e,r.position.y=s+Math.sin(Math.PI*e)*.22},onComplete:()=>{r.rotation.x=o,r.position.y=s,this.squash(e,.12)}})}playMove(e,t){this.clearHighlights();let n=this.computeTargets(e);this.targets=n,this.rebuildSlotMap(e);let r=new Set(t.cards),i=t.move.kind===`draw`||t.move.kind===`redeal`,a=0;for(let e of t.cards){let r=n.get(e);r&&(this.tweenTo(e,r,{duration:i?.3:.26,delay:i?a*.07:a*.03,arc:t.toFoundation?.55:i?.3:.35,squash:!0}),a++)}for(let[e,t]of n){if(r.has(e)||this.dragging.has(e))continue;let n=this.meshes[e];(Math.abs(n.position.x-t.x)>.001||Math.abs(n.position.y-t.y)>.001||Math.abs(n.position.z-t.z)>.001||Math.abs(n.rotation.x-(t.faceUp?0:Math.PI))>.01)&&this.tweenTo(e,t,{duration:.2})}t.flipped!==null&&this.flipCard(t.flipped,!0,.12),this.updateSlotVisibility(e)}returnCards(e,t){let n=this.computeTargets(t);this.targets=n,e.forEach((e,t)=>{let r=n.get(e);if(!r)return;let i=this.meshes[e],a=i.position.clone(),o=`card:${e}`;this.tweens.killByTag(o),this.tweens.add({duration:.36/Math.max(.2,this.animSpeed),delay:t*.02,ease:qc(1.4),tag:o,onUpdate:e=>{i.position.x=a.x+(r.x-a.x)*e,i.position.z=a.z+(r.z-a.z)*e,i.position.y=Vd(a.y,r.y,e),i.rotation.y=r.spin+Math.sin(e*Math.PI*3)*.14*(1-e)},onComplete:()=>{i.position.set(r.x,r.y,r.z),i.rotation.set(r.faceUp?0:Math.PI,r.spin,0)}})})}beginDrag(e){this.clearHint();for(let t of e){this.dragging.add(t),this.tweens.killByTag(`card:${t}`);let e=this.meshes[t];e.renderOrder=10,this.cardsGroup.remove(e),this.cardsGroup.add(e)}}updateDrag(e,t,n){e.forEach((e,r)=>{let i=this.meshes[e];i.position.set(t.x,t.y+r*Bd,t.z+r*this.layout.metrics.fanUp),i.rotation.set(0,this.jitter[e]*.6,0),i.rotation.z=-n.x*.16,i.rotation.x=n.z*.12})}endDrag(e){for(let t of e)this.dragging.delete(t),this.meshes[t].renderOrder=0,this.meshes[t].rotation.z=0}isDragging(e){return this.dragging.has(e)}acquireGlow(){let e=this.glowPool.find(e=>!e.visible);if(e)return e.visible=!0,e;let t=new G(this.glowGeom,this.glowMaterial.clone());return t.renderOrder=2,this.glowGroup.add(t),this.glowPool.push(t),t}clearHighlights(){this.clearHint();for(let e of this.glowPool)e.visible=!1;this.activeGlows.length=0}clearHint(){this.tweens.killByTag(this.hintTag),this.hintGlow&&=(this.hintGlow.visible=!1,this.hintGlow.material.color.set(16769146),null),this.hintLift&&=(this.hintLift.meshes.forEach((e,t)=>{this.dragging.has(e.userData.cardId)||(e.position.y=this.hintLift.baseY[t])}),null)}showTargets(e,t){this.clearHighlights();for(let n of t){let t=this.dropPosition(e,n),r=this.acquireGlow();r.position.set(t.x,t.y+.014,t.z),r.material.color.set(16769146),this.activeGlows.push(r)}}update(e){this.glowTime+=e;let t=Math.sin(this.glowTime*3.4);for(let e of this.activeGlows)e.material.opacity=.26+t*.07,e.scale.setScalar(1+t*.02)}pulseHint(e,t,n){this.clearHint();let r=this.topPosition(e,n),i=this.acquireGlow();this.hintGlow=i,i.position.set(r.x,r.y+.012,r.z);let a=i.material;a.color.set(10217727);let o=t.map(e=>this.meshes[e]),s=o.map(e=>e.position.y);this.hintLift={meshes:o,baseY:s},this.tweens.add({duration:1.8,tag:this.hintTag,ease:e=>e,onUpdate:e=>{let t=Math.sin(e*Math.PI*6);a.opacity=.18+Math.abs(t)*.26,o.forEach((e,n)=>{e.position.y=s[n]+Math.abs(t)*.14})},onComplete:()=>this.clearHint()})}breathe(e){let t=`idle-breathe`;this.tweens.killByTag(t);let n=e.map(e=>this.meshes[e]),r=n.map(e=>e.position.y);this.tweens.add({duration:2.2,tag:t,ease:e=>e,onUpdate:e=>{let t=Math.sin(e*Math.PI*4);n.forEach((e,n)=>e.position.y=r[n]+Math.abs(t)*.05)},onComplete:()=>n.forEach((e,t)=>e.position.y=r[t])})}topPosition(e,t,n=new V){let r=this.layout.anchor(t);if(t.type===`tableau`){let i=e.tableau[t.index];if(i.length===0)return n.set(r.x,zd,r.z);let a=i[i.length-1],o=this.targets.get(a);return o?n.set(o.x,o.y+Cd,o.z+this.layout.metrics.fanUp*0):n.set(r.x,zd,r.z)}if(t.type===`foundation`){let i=e.foundations[t.index].length;return n.set(r.x,zd+this.layout.stackLift(i,i+1),r.z)}if(t.type===`waste`){let t=e.waste.length;return n.set(r.x+this.layout.wasteFanX(0),zd+this.layout.stackLift(t,t+1),r.z)}let i=e.stock.length;return n.set(r.x,zd+this.layout.stackLift(i,i+1),r.z)}dropPosition(e,t,n=new V){let r=this.topPosition(e,t,n);return t.type===`tableau`&&e.tableau[t.index].length>0&&(r.z+=this.layout.metrics.fanUp),r}mesh(e){return this.meshes[e]}cardPosition(e,t=new V){return t.copy(this.meshes[e].position)}slotFor(e){return this.slotOf.get(e)}pick(e){this.cardsGroup.updateMatrixWorld(!0);let t=e.intersectObjects(this.cardsGroup.children,!1);for(let e of t){let t=e.object.userData.cardId;if(t===void 0)continue;let n=this.slotOf.get(t);if(n)return{card:t,slot:n}}return null}nearestPile(e,t,n){let r=null,i=1/0,a=new V;for(let o of n){let n=this.dropPosition(e,o,a),s=n.x-t.x,c=n.z-t.z,l=s*s+c*c*.7;l<i&&(i=l,r=o)}return i<2.6?r:null}pileAt(e,t){let n=.62,r=(e,n,r,i)=>t.x>=e&&t.x<=n&&t.z>=r&&t.z<=i;for(let t=0;t<7;t++){let i={type:`tableau`,index:t},a=this.layout.anchor(i),o=e.tableau[t],s=a.z-bd*.55,c=a.z+bd*.55;if(o.length){let e=this.targets.get(o[o.length-1]);e&&(c=e.z+bd*.55)}if(r(a.x-n,a.x+n,s,c))return i}for(let e of[{type:`stock`,index:0},{type:`waste`,index:0},{type:`foundation`,index:0},{type:`foundation`,index:1},{type:`foundation`,index:2},{type:`foundation`,index:3}]){let t=this.layout.anchor(e),i=e.type===`waste`?this.layout.wasteFanX(0):0;if(r(Math.min(t.x,t.x+i)-n,Math.max(t.x,t.x+i)+n,t.z-.77,t.z+.77))return e}return null}get cardThickness(){return xd}dispose(){for(let e of this.geometries)e.dispose();this.material.dispose(),this.atlasTexture.dispose(),this.decalTexture.dispose(),this.glowGeom.dispose(),this.glowMaterial.dispose();for(let e of this.slotMeshes.values())e.geometry.dispose(),e.material.dispose();for(let e of this.glowPool)e.material.dispose();this.glowPool.length=0}},Ud=.03,Wd=.05,Gd=.5,Kd=.86,qd=class{board;queue=[];flying=[];timer=0;running=!1;opts;bounds={x:9,zMin:-8,zMax:8};grid=new Float32Array;cols=0;rows=0;settled=0;constructor(e){this.board=e,this.opts={interval:.13,gravity:12,restitution:.62},this.setBounds(this.bounds.x,this.bounds.zMin,this.bounds.zMax)}start(e,t={}){this.opts={interval:t.interval??.13,gravity:t.gravity??12,restitution:t.restitution??.62,onLaunch:t.onLaunch},this.queue=[],this.flying=[],this.settled=0,this.grid.fill(0);for(let t=12;t>=0;t--)for(let n=0;n<4;n++){let r=e.foundations[n];r[t]!==void 0&&this.queue.push(r[t])}this.timer=0,this.running=!0}get active(){return this.running}update(e){if(!this.running)return!1;if(this.timer-=e,this.timer<=0&&this.queue.length){this.timer=this.opts.interval;let e=this.queue.shift(),t=Math.random()>.5?1:-1;this.flying.push({id:e,vx:t*(2.6+Math.random()*3.4),vy:3.4+Math.random()*2.6,vz:1.4+Math.random()*2.4,spin:(Math.random()-.5)*7,tilt:(Math.random()-.5)*5,bounces:0});let n=this.board.mesh(e);n.renderOrder=12,this.opts.onLaunch?.(e,n.position)}for(let t=this.flying.length-1;t>=0;t--){let n=this.flying[t],r=this.board.mesh(n.id);n.vy-=this.opts.gravity*e,r.position.x+=n.vx*e,r.position.y+=n.vy*e,r.position.z+=n.vz*e,r.rotation.y+=n.spin*e,r.rotation.z+=n.tilt*e,(r.position.x>this.bounds.x||r.position.x<-this.bounds.x)&&(r.position.x=Math.max(-this.bounds.x,Math.min(this.bounds.x,r.position.x)),n.vx=-n.vx*.55),(r.position.z>this.bounds.zMax||r.position.z<this.bounds.zMin)&&(r.position.z=Math.max(this.bounds.zMin,Math.min(this.bounds.zMax,r.position.z)),n.vz=-n.vz*.55);let i=this.restY(r.position.x,r.position.z);if(r.position.y<=i&&(r.position.y=i,n.vy<0&&(n.vy=-n.vy*this.opts.restitution,n.vx*=.82,n.vz*=.82,n.spin*=.7,n.tilt*=.5,n.bounces++,n.bounces>6||Math.abs(n.vy)<.6))){this.settled++,this.occupy(r.position.x,r.position.z,i),r.rotation.x=0,r.rotation.z=0,r.renderOrder=12+this.settled,this.flying.splice(t,1);continue}}return!this.queue.length&&!this.flying.length&&(this.running=!1),this.running}stop(){this.running=!1,this.queue=[],this.flying=[],this.settled=0,this.grid.fill(0)}setBounds(e,t,n){this.bounds={x:e,zMin:t,zMax:n},this.cols=Math.ceil(2*e/Gd)+1,this.rows=Math.ceil((n-t)/Gd)+1,this.grid=new Float32Array(this.cols*this.rows)}eachCellUnder(e,t,n){let r=Math.max(0,Math.floor((e-Kd+this.bounds.x)/Gd)),i=Math.min(this.cols-1,Math.floor((e+Kd+this.bounds.x)/Gd)),a=Math.max(0,Math.floor((t-Kd-this.bounds.zMin)/Gd)),o=Math.min(this.rows-1,Math.floor((t+Kd-this.bounds.zMin)/Gd));for(let e=a;e<=o;e++)for(let t=r;t<=i;t++)n(e*this.cols+t)}restY(e,t){let n=0;return this.eachCellUnder(e,t,e=>{this.grid[e]>n&&(n=this.grid[e])}),n<.05?Wd:n+Ud}occupy(e,t,n){this.eachCellUnder(e,t,e=>{this.grid[e]<n&&(this.grid[e]=n)})}},Jd=[`badger`,`fox`,`dragon`],Yd=new Map;function Xd(e,t={}){let n=`${e}|${t.rough??.75}|${t.metal??0}|${t.flat??!1}`,r=Yd.get(n);return r||(r=new bi({color:e,roughness:t.rough??.75,metalness:t.metal??0,flatShading:t.flat??!1}),Yd.set(n,r)),r}function Zd(e,t,n=14){let r=new G(new ci(e,n,n-4),Xd(t));return r.castShadow=!0,r}var Qd={badger:{body:`#8E9BC4`,belly:`#F1F3FF`,accent:`#FFC93C`,dark:`#2C3670`},fox:{body:`#FF8A3C`,belly:`#FFE9C7`,accent:`#FF3B3B`,dark:`#8A3A0E`},dragon:{body:`#4CBB3F`,belly:`#D8F5B6`,accent:`#9B4DFF`,dark:`#1F5C1A`}},$d=class{kind;group=new cn;parts;time=Math.random()*10;mood=`idle`;moodTime=0;moodDuration=0;constructor(e){this.kind=e,this.parts=this.build(e),this.group.add(this.parts.root)}build(e){let t=Qd[e],n=new cn,r=new cn,i=Zd(.52,t.body);i.scale.set(1,1.12,.95),i.position.y=.55,r.add(i);let a=Zd(.34,t.belly);a.scale.set(1,1.05,.6),a.position.set(0,.48,.3),r.add(a);for(let e of[-1,1]){let n=Zd(.17,t.dark,10);n.scale.set(1,.7,1.3),n.position.set(e*.24,.12,.1),r.add(n)}n.add(r);let o=new cn,s=Zd(.44,t.body);s.scale.set(1.05,1,.98),o.add(s);let c=Zd(.2,t.belly,12);c.scale.set(1.1,.8,1),c.position.set(0,-.1,.36),o.add(c);let l=Zd(.075,t.dark,8);l.position.set(0,-.03,.55),o.add(l);for(let e of[-1,1]){let t=Zd(.13,`#FFFFFF`,12);t.scale.set(1,1.15,.7),t.position.set(e*.17,.08,.35),o.add(t);let n=Zd(.06,`#1B2450`,10);n.position.set(e*.18,.07,.44),o.add(n)}let u=new G(new ai(.035,.035,.2,6),Xd(t.dark));u.rotation.z=Math.PI/2,u.position.set(-.17,.25,.36),o.add(u);let d=u.clone();d.position.x=.17,o.add(d);let f=new G(new li(.1,.03,6,12,Math.PI),Xd(t.dark));if(f.rotation.set(0,0,Math.PI),f.position.set(0,-.19,.52),o.add(f),e===`badger`){for(let e of[-1,1]){let n=Zd(.12,t.dark,10);n.position.set(e*.3,.34,0),o.add(n)}let e=Zd(.1,t.belly,10);e.scale.set(.5,1.6,1.2),e.position.set(0,.18,.34),o.add(e);let n=new G(new ci(.46,14,8,0,Math.PI*2,0,Math.PI/2),Xd(`#C9D3F5`,{metal:.35,rough:.4}));n.position.y=.06,n.castShadow=!0,o.add(n);let r=new G(new oi(.1,.4,8),Xd(t.accent,{metal:.3,rough:.35}));r.position.set(0,.56,0),o.add(r)}else if(e===`fox`){for(let e of[-1,1]){let n=new G(new oi(.16,.4,8),Xd(t.body));n.position.set(e*.27,.44,-.02),n.rotation.z=e*-.3,n.castShadow=!0,o.add(n);let r=new G(new oi(.09,.24,8),Xd(t.accent));r.position.set(e*.27,.42,.05),r.rotation.z=e*-.3,o.add(r)}let e=new G(new ai(.3,.32,.14,12),Xd(t.accent));e.position.y=.42,o.add(e)}else{for(let e of[-1,1]){let n=new G(new oi(.09,.3,7),Xd(t.accent));n.position.set(e*.22,.48,-.05),n.rotation.z=e*-.25,o.add(n)}for(let e=0;e<3;e++){let n=new G(new oi(.08,.2,6),Xd(t.accent));n.position.set(0,.44-e*.14,-.32-e*.1),n.rotation.x=-.4,o.add(n)}}o.position.set(0,1.28,0),n.add(o);let p=Zd(.16,t.body,10);p.position.set(-.55,.72,.12),n.add(p);let m=Zd(.16,t.body,10);m.position.set(.55,.72,.12),n.add(m);let h=null;if(e===`fox`){let e=new G(new ai(.03,.03,1.1,6),Xd(`#8C5A2B`)),r=new G(new ci(.22,10,8),Xd(t.accent));r.scale.set(1.2,.7,.12),r.position.set(.22,.35,0);let i=new cn;i.add(e),i.add(r),i.position.set(.62,1,.16),i.rotation.z=-.25,n.add(i),h=i}else if(e===`dragon`){let e=new G(new ai(.2,.2,.05,14),Xd(`#FFC93C`,{metal:.6,rough:.3}));e.rotation.x=Math.PI/2,e.position.set(.66,.9,.24),n.add(e),h=e}else{let e=new G(new ai(.035,.035,1.9,6),Xd(`#8C5A2B`)),t=new G(new oi(.1,.28,7),Xd(`#D7DEF7`,{metal:.5,rough:.3}));t.position.y=1.05;let r=new cn;r.add(e),r.add(t),r.position.set(.66,.95,.1),n.add(r),h=r}return{root:n,body:r,head:o,armL:p,armR:m,browL:u,browR:d,mouth:f,prop:h}}setMood(e,t=1.6){this.mood=e,this.moodTime=0,this.moodDuration=t}update(e){this.time+=e;let{root:t,head:n,armL:r,armR:i,browL:a,browR:o,mouth:s,prop:c}=this.parts,l=Math.sin(this.time*1.8);if(t.position.y=l*.035,n.rotation.z=Math.sin(this.time*.9)*.05,n.rotation.x=0,n.scale.setScalar(1),r.position.y=.72+l*.03,i.position.y=.72-l*.03,a.position.y=.25,o.position.y=.25,s.rotation.z=Math.PI,s.scale.setScalar(1),c&&(c.rotation.z=(this.kind===`fox`?-.25:0)+l*.05),this.mood!==`idle`){this.moodTime+=e;let c=Math.min(1,this.moodTime/this.moodDuration),l=Math.sin(c*Math.PI);switch(this.mood){case`cheer`:{let e=Math.abs(Math.sin(this.moodTime*9))*l;t.position.y=e*.42,r.position.set(-.5,1.05+e*.25,.2),i.position.set(.5,1.05+e*.25,.2),n.rotation.z=Math.sin(this.moodTime*14)*.14*l,s.scale.set(1.5,1.6,1.5),a.position.y=.32,o.position.y=.32;break}case`wave`:i.position.set(.58,1+Math.sin(this.moodTime*10)*.1,.25),n.rotation.z=Math.sin(this.moodTime*3)*.1,s.scale.set(1.3,1.3,1.3);break;case`yawn`:{let e=Math.sin(c*Math.PI);n.rotation.x=-.28*e,s.scale.set(1+e*1.5,1+e*2.4,1),r.position.set(-.62,.9+e*.3,.05),a.position.y=.22-e*.05,o.position.y=.22-e*.05;break}case`sad`:n.rotation.x=.2*l,t.position.y=-.06*l,a.position.y=.2,o.position.y=.2,s.rotation.z=0}c>=1&&(this.mood=`idle`)}}},ef=class{group=new cn;mascots=[];constructor(e=[`badger`,`fox`,`dragon`]){for(let t of e){let e=new $d(t);this.mascots.push(e),this.group.add(e.group)}}place(e){e.length&&this.mascots.forEach((t,n)=>{let r=e[n%e.length];t.group.position.set(r.x,r.y,r.z),t.group.rotation.y=r.ry,t.group.scale.setScalar(r.scale)})}get kinds(){return this.mascots.map(e=>e.kind)}dispose(){for(let e of this.mascots)e.group.traverse(e=>{e instanceof G&&e.geometry.dispose()});this.mascots.length=0,this.group.clear()}cheer(){this.mascots.forEach((e,t)=>e.setMood(`cheer`,1.4+t*.12))}yawn(){this.mascots[Math.random()*this.mascots.length|0]?.setMood(`yawn`,1.8)}wave(){this.mascots.forEach((e,t)=>e.setMood(`wave`,1.8+t*.2))}sad(){this.mascots.forEach(e=>e.setMood(`sad`,1.1))}celebrate(e=5){this.mascots.forEach((t,n)=>t.setMood(`cheer`,e+n*.3))}update(e){for(let t of this.mascots)t.update(e)}},tf=2.05,nf=.8,rf=.6,af=.55,of=[{h:0,halfW:.35},{h:.35,halfW:.8},{h:.62,halfW:.55},{h:1,halfW:.45}],sf=.8,cf=.42,lf=.2,uf=.97,df=.96,ff=.35;function pf(){return Math.tan(36*Math.PI/180/2)}function mf(e,t,n,r){let i=Math.cos(Td),a=Math.sin(Td),o=e.dist*i,s=e.centerZ+e.dist*a,c=n-o,l=r-s,u=-c*i-l*a,d=c*a-l*i,f=pf()*Math.max(.001,u);return{x:t/(f*e.aspect),y:d/f}}function hf(e,t,n,r){let i=rf*r,a=-1/0,o=1/0,s=0;for(let c of of){let l=e.groundY+tf*r*c.h,u=c.halfW*r;for(let r of[t-u,t+u])for(let t of[n-i,n+i]){let n=mf(e,r,l,t);a=Math.max(a,n.y),o=Math.min(o,n.y),s=Math.max(s,Math.abs(n.x))}}return{top:a,feet:o,edgeX:s}}function gf(e,t,n,r){let i=hf(e,t,n,r),a=Math.min(df,e.topLimit??df),o=e.bottomLimit??-1;return Math.max(i.edgeX-uf,i.top-a,o-i.feet)}function _f(e,t,n,r){return gf(e,t,n,r)<=0}function vf(e,t){let n=e.dist*Math.cos(Td),r=e.groundY+tf*t*ff;return e.halfW*((n-r)/(n-e.rimY))}function yf(e,t){let n=e.dist*Math.cos(Td),r=e.centerZ+e.dist*Math.sin(Td),i=e.groundY+tf*t*ff;return r-(r-(e.centerZ-e.halfD))*((n-i)/(n-e.rimY))}function bf(e,t){let n=Math.min(yf(e,t),e.centerZ-e.halfD-lf)-rf*t,r=e.groundY,i=Math.max(nf*t*2.4,e.halfW*.6),a=Math.min(3,Math.max(1,e.count));return a===1?[{x:0,y:r,z:n,ry:0,scale:t}]:a===2?[{x:-i*.7,y:r,z:n,ry:.18,scale:t},{x:i*.7,y:r,z:n,ry:-.18,scale:t}]:[{x:-i,y:r,z:n,ry:.22,scale:t},{x:i,y:r,z:n,ry:-.22,scale:t},{x:0,y:r,z:n-rf*t*.6,ry:0,scale:t}]}function xf(e,t){let n=e.halfW+lf+nf*t,r=vf(e,t)+af*t,i=Math.max(n,r),a=e.groundY,o=Math.min(3,Math.max(1,e.count)),s=o===3?[0,rf*t*2.8]:[0],c=e.centerZ-e.halfD+rf*t+.1,l=e.centerZ+e.halfD*.6,u=Math.min(df,e.topLimit??df),d=e.bottomLimit??-1,f=c,p=1/0,m=-1/0;for(let n=c;n<=l;n+=.2){let r=-1/0,a=1/0;for(let o of s){r=Math.max(r,gf(e,i,n+o,t));let s=hf(e,i,n+o,t);a=Math.min(a,u-s.top,s.feet-d)}r<=0?a>m&&(m=a,f=n):m===-1/0&&r<p&&(p=r,f=n)}let h=(e,n=0)=>({x:-i,y:a,z:f+e,ry:Math.PI/2+n,scale:t}),g=(e,n=0)=>({x:i,y:a,z:f+e,ry:-Math.PI/2-n,scale:t});return o===1?[h(0)]:o===2?[h(0),g(0)]:[h(0),g(0),h(s[1],.25)]}function Sf(e,t){for(let n=sf;n>=.41999999899999996;n-=.02){let r=Math.round(n*100)/100;if(t(r).every(t=>_f(e,t.x,t.z,r)))return r}return 0}function Cf(e,t){return Math.max(...t.map(t=>gf(e,t.x,t.z,t.scale)))}function wf(e){let t=Sf(e,t=>bf(e,t)),n=Sf(e,t=>xf(e,t));if(t===0&&n===0){let t=bf(e,cf),n=xf(e,cf);return Cf(e,n)<Cf(e,t)?n:t}return n>t?xf(e,n):bf(e,t)}var Tf=`
attribute float aSize;
attribute float aKind;
attribute float aAlpha;
attribute vec3 aColor;
varying vec3 vColor;
varying float vKind;
varying float vAlpha;
void main() {
  vColor = aColor;
  vKind = aKind;
  vAlpha = aAlpha;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = aSize * (260.0 / max(0.001, -mvPosition.z));
  gl_Position = projectionMatrix * mvPosition;
}
`,Ef=`
varying vec3 vColor;
varying float vKind;
varying float vAlpha;
void main() {
  vec2 uv = gl_PointCoord - vec2(0.5);
  float d = length(uv);
  float alpha;
  if (vKind < 0.5) {
    // Круглая искра с мягким краем и ярким ядром.
    alpha = smoothstep(0.5, 0.08, d);
    alpha *= 0.55 + 0.45 * smoothstep(0.32, 0.0, d);
  } else if (vKind < 1.5) {
    // Конфетти: квадратик с мягкими краями.
    vec2 a = abs(uv);
    alpha = smoothstep(0.5, 0.42, max(a.x, a.y));
  } else {
    // Звёздочка: четыре луча.
    float star = 1.0 - smoothstep(0.0, 0.5, min(abs(uv.x), abs(uv.y)) * 3.4 + d * 0.7);
    alpha = clamp(star, 0.0, 1.0);
  }
  alpha *= vAlpha;
  if (alpha < 0.01) discard;
  gl_FragColor = vec4(vColor, alpha);
}
`,Df={spark:0,confetti:1,star:2},Of=class{points;geometry=new dr;material;capacity;positions;colors;sizes;kinds;alphas;velocities;life;maxLife;gravity;drag;baseSize;cursor=0;alive=0;tmpColor=new W;constructor(e=1400){this.capacity=e,this.positions=new Float32Array(e*3),this.colors=new Float32Array(e*3),this.sizes=new Float32Array(e),this.kinds=new Float32Array(e),this.alphas=new Float32Array(e),this.velocities=new Float32Array(e*3),this.life=new Float32Array(e),this.maxLife=new Float32Array(e),this.gravity=new Float32Array(e),this.drag=new Float32Array(e),this.baseSize=new Float32Array(e);for(let t=0;t<e;t++)this.positions[t*3+1]=-999;this.geometry.setAttribute(`position`,new Xn(this.positions,3)),this.geometry.setAttribute(`aColor`,new Xn(this.colors,3)),this.geometry.setAttribute(`aSize`,new Xn(this.sizes,1)),this.geometry.setAttribute(`aKind`,new Xn(this.kinds,1)),this.geometry.setAttribute(`aAlpha`,new Xn(this.alphas,1)),this.geometry.boundingSphere=null,this.material=new vi({vertexShader:Tf,fragmentShader:Ef,transparent:!0,depthWrite:!1,blending:2}),this.points=new Xr(this.geometry,this.material),this.points.frustumCulled=!1,this.points.renderOrder=20}burst(e,t={}){let n=t.count??18,r=t.speed??2.4,i=t.spread??1,a=t.gravity??4.5,o=t.size??.5,s=t.life??.85,c=Df[t.kind??`spark`],l=t.upward??1,u=t.drag??1.2,d=Array.isArray(t.color)?t.color:[t.color??`#FFD84C`];for(let t=0;t<n;t++){let t=this.cursor;this.cursor=(this.cursor+1)%this.capacity;let n=Math.random()*Math.PI*2,f=Math.random(),p=Math.cos(n)*i*r*f,m=Math.sin(n)*i*r*f,h=(.5+Math.random())*r*l;this.positions[t*3]=e.x+(Math.random()-.5)*.1,this.positions[t*3+1]=e.y+Math.random()*.08,this.positions[t*3+2]=e.z+(Math.random()-.5)*.1,this.velocities[t*3]=p,this.velocities[t*3+1]=h,this.velocities[t*3+2]=m,this.tmpColor.set(d[Math.random()*d.length|0]),this.colors[t*3]=this.tmpColor.r,this.colors[t*3+1]=this.tmpColor.g,this.colors[t*3+2]=this.tmpColor.b;let g=o*(.65+Math.random()*.7);this.baseSize[t]=g,this.sizes[t]=g,this.kinds[t]=c,this.alphas[t]=1,this.life[t]=s*(.75+Math.random()*.5),this.maxLife[t]=this.life[t],this.gravity[t]=a,this.drag[t]=u,this.alive++}}puff(e,t=`#FFF3C0`){this.burst(e,{count:12,color:t,speed:1.5,spread:1.4,gravity:1.5,size:.32,life:.4,upward:.25,drag:3.5})}goldBurst(e,t=1){this.burst(e,{count:Math.round(16+t*10),color:[`#FFD84C`,`#FFF3B0`,`#FFAE2B`,`#FFFFFF`],speed:2.6*t,spread:1,gravity:5.5,size:.45+t*.1,life:.9,kind:`star`,drag:1.4})}confetti(e,t=160,n=5,r=7){for(let i=0;i<t;i++){let t=this.cursor;this.cursor=(this.cursor+1)%this.capacity,this.positions[t*3]=e.x+(Math.random()-.5)*n*2,this.positions[t*3+1]=e.y+r*(.6+Math.random()*.6),this.positions[t*3+2]=e.z+(Math.random()-.5)*n,this.velocities[t*3]=(Math.random()-.5)*1.6,this.velocities[t*3+1]=-.8-Math.random()*1.4,this.velocities[t*3+2]=(Math.random()-.5)*1.2;let i=[`#FF3B3B`,`#FFC93C`,`#4CBB3F`,`#2F6BFF`,`#9B4DFF`,`#FFFFFF`];this.tmpColor.set(i[Math.random()*i.length|0]),this.colors[t*3]=this.tmpColor.r,this.colors[t*3+1]=this.tmpColor.g,this.colors[t*3+2]=this.tmpColor.b;let a=.42+Math.random()*.3;this.baseSize[t]=a,this.sizes[t]=a,this.kinds[t]=Df.confetti,this.alphas[t]=1,this.life[t]=3.4+Math.random()*2.2,this.maxLife[t]=this.life[t],this.gravity[t]=1.1+Math.random()*.6,this.drag[t]=.9,this.alive++}}update(e){if(this.alive<=0)return;let t=this.positions,n=this.velocities,r=0;for(let i=0;i<this.capacity;i++){let a=this.life[i];if(a<=0)continue;let o=a-e;if(this.life[i]=o,o<=0){this.alphas[i]=0,t[i*3+1]=-999;continue}r++;let s=Math.max(0,1-this.drag[i]*e);n[i*3]*=s,n[i*3+2]*=s,n[i*3+1]=n[i*3+1]*s-this.gravity[i]*e,t[i*3]+=n[i*3]*e,t[i*3+1]+=n[i*3+1]*e,t[i*3+2]+=n[i*3+2]*e,t[i*3+1]<.03&&n[i*3+1]<0&&(t[i*3+1]=.03,n[i*3+1]*=-.35,n[i*3]*=.6,n[i*3+2]*=.6);let c=o/this.maxLife[i];this.alphas[i]=c>.7?1:c/.7,this.sizes[i]=this.baseSize[i]*(.6+c*.4)}this.alive=r,this.geometry.getAttribute(`position`).needsUpdate=!0,this.geometry.getAttribute(`aColor`).needsUpdate=!0,this.geometry.getAttribute(`aSize`).needsUpdate=!0,this.geometry.getAttribute(`aKind`).needsUpdate=!0,this.geometry.getAttribute(`aAlpha`).needsUpdate=!0}clear(){for(let e=0;e<this.capacity;e++)this.life[e]=0,this.alphas[e]=0,this.positions[e*3+1]=-999;this.alive=0,this.geometry.getAttribute(`position`).needsUpdate=!0,this.geometry.getAttribute(`aAlpha`).needsUpdate=!0}get activeCount(){return this.alive}dispose(){this.geometry.dispose(),this.material.dispose()}},kf={name:`CopyShader`,uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`},Af=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error(`THREE.Pass: .render() must be implemented in derived pass.`)}dispose(){}},jf=new $i(-1,1,1,-1,0,1),Mf=new class extends dr{constructor(){super(),this.setAttribute(`position`,new $n([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute(`uv`,new $n([0,2,0,0,2,0],2))}},Nf=class{constructor(e){this._mesh=new G(Mf,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,jf)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}},Pf=class extends Af{constructor(e,t=`tDiffuse`){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof vi?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=hi.clone(e.uniforms),this.material=new vi({name:e.name===void 0?`unspecified`:e.name,defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new Nf(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},Ff=class extends Af{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){let r=e.getContext(),i=e.state;i.buffers.color.setMask(!1),i.buffers.depth.setMask(!1),i.buffers.color.setLocked(!0),i.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),i.buffers.stencil.setTest(!0),i.buffers.stencil.setOp(r.REPLACE,r.REPLACE,r.REPLACE),i.buffers.stencil.setFunc(r.ALWAYS,a,4294967295),i.buffers.stencil.setClear(o),i.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),i.buffers.color.setLocked(!1),i.buffers.depth.setLocked(!1),i.buffers.color.setMask(!0),i.buffers.depth.setMask(!0),i.buffers.stencil.setLocked(!1),i.buffers.stencil.setFunc(r.EQUAL,1,4294967295),i.buffers.stencil.setOp(r.KEEP,r.KEEP,r.KEEP),i.buffers.stencil.setLocked(!0)}},If=class extends Af{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}},Lf=class{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){let n=e.getSize(new B);this._width=n.width,this._height=n.height,t=new At(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:g}),t.texture.name=`EffectComposer.rt1`}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name=`EffectComposer.rt2`,this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Pf(kf),this.copyPass.material.blending=0,this.timer=new sa}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());let t=this.renderer.getRenderTarget(),n=!1;for(let t=0,r=this.passes.length;t<r;t++){let r=this.passes[t];if(r.enabled!==!1){if(r.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(t),r.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),r.needsSwap){if(n){let t=this.renderer.getContext(),n=this.renderer.state.buffers.stencil;n.setFunc(t.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),n.setFunc(t.EQUAL,1,4294967295)}this.swapBuffers()}Ff!==void 0&&(r instanceof Ff?n=!0:r instanceof If&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){let t=this.renderer.getSize(new B);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let n=this._width*this._pixelRatio,r=this._height*this._pixelRatio;this.renderTarget1.setSize(n,r),this.renderTarget2.setSize(n,r);for(let e=0;e<this.passes.length;e++)this.passes[e].setSize(n,r)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}},Rf=class extends Af{constructor(e,t,n=null,r=null,i=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=r,this.clearAlpha=i,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new W}render(e,t,n){let r=e.autoClear;e.autoClear=!1;let i,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(i=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==1&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(i),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=r}},zf={name:`LuminosityHighPassShader`,uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new W(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`},Bf=class e extends Af{constructor(e,t=1,n,r){super(),this.strength=t,this.radius=n,this.threshold=r,this.resolution=e===void 0?new B(256,256):new B(e.x,e.y),this.clearColor=new W(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let i=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new At(i,a,{type:g}),this.renderTargetBright.texture.name=`UnrealBloomPass.bright`,this.renderTargetBright.texture.generateMipmaps=!1;for(let e=0;e<this.nMips;e++){let t=new At(i,a,{type:g});t.texture.name=`UnrealBloomPass.h`+e,t.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(t);let n=new At(i,a,{type:g});n.texture.name=`UnrealBloomPass.v`+e,n.texture.generateMipmaps=!1,this.renderTargetsVertical.push(n),i=Math.round(i/2),a=Math.round(a/2)}let o=zf;this.highPassUniforms=hi.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=r,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new vi({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];let s=[6,10,14,18,22];i=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let e=0;e<this.nMips;e++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(s[e])),this.separableBlurMaterials[e].uniforms.invSize.value=new B(1/i,1/a),i=Math.round(i/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;let c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new V(1,1,1),new V(1,1,1),new V(1,1,1),new V(1,1,1),new V(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=hi.clone(kf.uniforms),this.blendMaterial=new vi({uniforms:this.copyUniforms,vertexShader:kf.vertexShader,fragmentShader:kf.fragmentShader,premultipliedAlpha:!0,blending:2,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new W,this._oldClearAlpha=1,this._basic=new Sr,this._fsQuad=new Nf(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),r=Math.round(t/2);this.renderTargetBright.setSize(n,r);for(let e=0;e<this.nMips;e++)this.renderTargetsHorizontal[e].setSize(n,r),this.renderTargetsVertical[e].setSize(n,r),this.separableBlurMaterials[e].uniforms.invSize.value=new B(1/n,1/r),n=Math.round(n/2),r=Math.round(r/2)}render(t,n,r,i,a){t.getClearColor(this._oldClearColor),this._oldClearAlpha=t.getClearAlpha();let o=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),a&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=r.texture,t.setRenderTarget(null),t.clear(),this._fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=r.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this._fsQuad.render(t);let s=this.renderTargetBright;for(let n=0;n<this.nMips;n++)this._fsQuad.material=this.separableBlurMaterials[n],this.separableBlurMaterials[n].uniforms.colorTexture.value=s.texture,this.separableBlurMaterials[n].uniforms.direction.value=e.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[n]),t.clear(),this._fsQuad.render(t),this.separableBlurMaterials[n].uniforms.colorTexture.value=this.renderTargetsHorizontal[n].texture,this.separableBlurMaterials[n].uniforms.direction.value=e.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[n]),t.clear(),this._fsQuad.render(t),s=this.renderTargetsVertical[n];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this._fsQuad.render(t),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,a&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(r),this._fsQuad.render(t)),t.setClearColor(this._oldClearColor,this._oldClearAlpha),t.autoClear=o}_getSeparableBlurMaterial(e){let t=[],n=e/3;for(let r=0;r<e;r++)t.push(.39894*Math.exp(-.5*r*r/(n*n))/n);return new vi({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new B(.5,.5)},direction:{value:new B(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {

					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;

					for ( int i = 1; i < KERNEL_RADIUS; i ++ ) {

						float x = float( i );
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * w;

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(e){return new vi({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`})}};Bf.BlurDirectionX=new B(1,0),Bf.BlurDirectionY=new B(0,1);var Vf={name:`OutputShader`,uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`},Hf=class extends Af{constructor(){super(),this.isOutputPass=!0,this.uniforms=hi.clone(Vf.uniforms),this.material=new yi({name:Vf.name,uniforms:this.uniforms,vertexShader:Vf.vertexShader,fragmentShader:Vf.fragmentShader}),this._fsQuad=new Nf(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},U.getTransfer(this._outputColorSpace)===`srgb`&&(this.material.defines.SRGB_TRANSFER=``),this._toneMapping===1?this.material.defines.LINEAR_TONE_MAPPING=``:this._toneMapping===2?this.material.defines.REINHARD_TONE_MAPPING=``:this._toneMapping===3?this.material.defines.CINEON_TONE_MAPPING=``:this._toneMapping===4?this.material.defines.ACES_FILMIC_TONE_MAPPING=``:this._toneMapping===6?this.material.defines.AGX_TONE_MAPPING=``:this._toneMapping===7?this.material.defines.NEUTRAL_TONE_MAPPING=``:this._toneMapping===5&&(this.material.defines.CUSTOM_TONE_MAPPING=``),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},Uf=[{id:`green-felt`,name:`Тренировочное сукно`,base:`#3E9E4A`,deep:`#1E6B32`,light:`#7DD37A`,accent:`#FFE07A`,pattern:`cloth`},{id:`grove`,name:`Гоблинская роща`,base:`#5AA83C`,deep:`#2C6B1F`,light:`#A8E070`,accent:`#FFD166`,pattern:`runes`},{id:`bone-pit`,name:`Костяная яма`,base:`#6C6484`,deep:`#332B4A`,light:`#B6ADD2`,accent:`#FFE9A8`,pattern:`stone`},{id:`royal-carpet`,name:`Королевский ковёр`,base:`#2F6BFF`,deep:`#12328C`,light:`#87B0FF`,accent:`#FFC93C`,pattern:`cloth`},{id:`frost`,name:`Ледяная крепость`,base:`#63C6F2`,deep:`#1F5C93`,light:`#D9F4FF`,accent:`#FFFFFF`,pattern:`ice`},{id:`desert`,name:`Песчаный двор`,base:`#D9A066`,deep:`#96632E`,light:`#FFDCA8`,accent:`#FF9C3C`,pattern:`sand`},{id:`oak`,name:`Дубовый стол`,base:`#B87A3C`,deep:`#6B4114`,light:`#E4B274`,accent:`#FFD98A`,pattern:`wood`},{id:`legend`,name:`Легендарная арена`,base:`#7B3FE4`,deep:`#3A1273`,light:`#C79BFF`,accent:`#FFC93C`,pattern:`runes`}],Wf=e=>Uf.find(t=>t.id===e)??Uf[0];function Gf(e,t,n){let r=ol(t+n.id.length*31);switch(e.save(),n.pattern){case`cloth`:e.globalAlpha=.2,e.strokeStyle=n.light,e.lineWidth=2;for(let n=0;n<t;n+=9)e.beginPath(),e.moveTo(n,0),e.lineTo(n,t),e.stroke();e.globalAlpha=.16,e.strokeStyle=n.deep;for(let n=0;n<t;n+=9)e.beginPath(),e.moveTo(0,n),e.lineTo(t,n),e.stroke();break;case`wood`:{let i=t/9;for(let a=0;a<9;a++){e.globalAlpha=.5,e.fillStyle=a%2?rl(n.base,-.06):rl(n.base,.05),e.fillRect(0,a*i,t,i),e.globalAlpha=.3,e.strokeStyle=n.deep,e.lineWidth=3,e.beginPath(),e.moveTo(0,a*i),e.lineTo(t,a*i),e.stroke(),e.globalAlpha=.14,e.lineWidth=1.5;for(let n=0;n<8;n++){let o=a*i+r()*i;e.beginPath(),e.moveTo(0,o);for(let r=0;r<=t;r+=t/8)e.lineTo(r,o+Math.sin(r*.02+n)*3);e.stroke()}}break}case`stone`:e.globalAlpha=.35;for(let i=0;i<60;i++){let i=r()*t,a=r()*t,o=20+r()*70;e.fillStyle=r()>.5?rl(n.base,.08):rl(n.base,-.08),ll(e,i,a,o),e.fill()}e.globalAlpha=.25,e.strokeStyle=n.deep,e.lineWidth=3;for(let n=0;n<14;n++){e.beginPath();let n=r()*t,i=r()*t;e.moveTo(n,i);for(let t=0;t<5;t++)n+=(r()-.5)*120,i+=(r()-.5)*120,e.lineTo(n,i);e.stroke()}break;case`ice`:e.globalAlpha=.3,e.strokeStyle=`#FFFFFF`,e.lineWidth=2.5;for(let n=0;n<22;n++){let n=r()*t,i=r()*t,a=40+r()*120,o=r()*Math.PI;e.beginPath(),e.moveTo(n,i),e.lineTo(n+Math.cos(o)*a,i+Math.sin(o)*a),e.stroke()}e.globalAlpha=.2;for(let n=0;n<30;n++)e.fillStyle=`#FFFFFF`,ll(e,r()*t,r()*t,4+r()*16),e.fill();break;case`sand`:e.globalAlpha=.16,e.strokeStyle=rl(n.base,-.2),e.lineWidth=3;for(let n=0;n<26;n++){let i=r()*t;e.beginPath(),e.moveTo(0,i);for(let r=0;r<=t;r+=40)e.lineTo(r,i+Math.sin(r*.01+n)*12);e.stroke()}break;case`runes`:e.globalAlpha=.16,e.strokeStyle=n.accent,e.lineWidth=5;for(let n=0;n<16;n++){let n=r()*t,i=r()*t,a=20+r()*45;e.beginPath(),e.arc(n,i,a,0,Math.PI*2),e.stroke(),e.beginPath(),e.moveTo(n-a*.6,i),e.lineTo(n+a*.6,i),e.moveTo(n,i-a*.6),e.lineTo(n,i+a*.6),e.stroke()}}e.restore()}function Kf(e,t={}){let n=t.factory??il,r=t.size??1024,{canvas:i,ctx:a}=n(r,r);a.fillStyle=e.base,a.fillRect(0,0,r,r),a.fillStyle=fl(a,r/2,r*.44,r*.05,r*.72,[[0,tl(e.light,.55)],[.55,tl(e.base,.1)],[1,tl(e.deep,.55)]]),a.fillRect(0,0,r,r),Gf(a,r,e);let o=r*.055;a.save(),a.strokeStyle=tl(e.accent,.5),a.lineWidth=r*.012,a.strokeRect(o,o,r-o*2,r-o*2),a.strokeStyle=tl(e.light,.35),a.lineWidth=r*.005,a.strokeRect(o*1.55,o*1.55,r-o*3.1,r-o*3.1),a.fillStyle=tl(e.accent,.55);for(let[e,t]of[[o,o],[r-o,o],[o,r-o],[r-o,r-o]])a.save(),a.translate(e,t),a.rotate(Math.PI/4),a.fillRect(-r*.016,-r*.016,r*.032,r*.032),a.restore();return a.restore(),a.fillStyle=fl(a,r/2,r/2,r*.32,r*.78,[[0,`rgba(0,0,0,0)`],[1,tl(e.deep,.62)]]),a.fillRect(0,0,r,r),i}function qf(e,t={}){let n=t.factory??il,r=t.height??512,{canvas:i,ctx:a}=n(8,r);return a.fillStyle=dl(a,0,0,0,r,[[0,rl(nl(e.light,`#FFFFFF`,.35),.1)],[.45,e.light],[.75,e.base],[1,e.deep]]),a.fillRect(0,0,8,r),i}var Jf={shadows:!0,bloom:!0,pixelRatioCap:2,msaa:4};function Yf(){return/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)}function Xf(e){for(let t of[{antialias:!0,powerPreference:`high-performance`},{antialias:!0,powerPreference:`default`},{antialias:!1,powerPreference:`default`}])try{return new Uc({canvas:e,alpha:!1,...t})}catch{}throw Error(Zf())}function Zf(){let e=document.createElement(`canvas`),t=!1,n=!1;try{t=!!e.getContext(`webgl2`),n=t||!!e.getContext(`webgl`)}catch{}return t?`браузер не дал создать WebGL-контекст, хотя WebGL 2 в нём есть. Обычно так бывает, когда браузер временно заблокировал WebGL после сбоя видеодрайвера: закройте браузер полностью (не только вкладку) и откройте игру заново.`:n?`в этом браузере только WebGL 1, а игре нужен WebGL 2. Обновите браузер или откройте игру в другом.`:`в браузере выключен WebGL или он временно заблокирован после сбоя видеодрайвера. Закройте браузер полностью (не только вкладку) и откройте игру заново; если не поможет — попробуйте другой браузер.`}var Qf=class{renderer;scene=new _n;camera;composer=null;bloom=null;sun;hemi;ambient;quality;tilt=Td;baseDistance=14;target=new V(0,0,0);parallax=new B(0,0);parallaxTarget=new B(0,0);clockT=0;mode=`match`;orbit=0;zoom=1;shake=0;raycaster=new Sa;tablePlane=new Br(new V(0,1,0),0);skyTexture=null;diag={};contextLosses=0;onRestored=null;framesToCheck=0;constructor(e,t=Jf){this.quality={...t},this.renderer=Xf(e),this.collectGpuFacts(),e.addEventListener(`webglcontextlost`,this.onContextLost,!1),e.addEventListener(`webglcontextrestored`,this.onContextRestored,!1),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,t.pixelRatioCap)),this.renderer.outputColorSpace=Be,this.renderer.toneMapping=0,this.renderer.shadowMap.enabled=t.shadows,this.renderer.shadowMap.type=2,this.camera=new Xi(36,1,2.5,120),this.camera.position.set(0,12,6),this.camera.lookAt(0,0,0),this.hemi=new Ri(16773328,4873656,.93),this.scene.add(this.hemi),this.ambient=new na(10466559,.26),this.scene.add(this.ambient),this.sun=new ta(16774876,1.9),this.sun.position.set(-6.5,13,5.5),this.sun.castShadow=t.shadows;let n=Yf()?1024:1536;this.sun.shadow.mapSize.set(n,n),this.diag.shadowMap=n,this.sun.shadow.camera.near=1,this.sun.shadow.camera.far=40,this.sun.shadow.camera.left=-9,this.sun.shadow.camera.right=9,this.sun.shadow.camera.top=9,this.sun.shadow.camera.bottom=-9,this.sun.shadow.bias=-.0012,this.sun.shadow.normalBias=.02,this.scene.add(this.sun),this.scene.add(this.sun.target),this.scene.fog=new gn(10471167,26,62),this.setupComposer()}onContextLost=e=>{e.preventDefault(),this.contextLosses++,this.diag.contextLost=this.contextLosses};onContextRestored=()=>{this.contextLosses>=2?this.quality.bloom=!1:this.quality.msaa=0,this.setupComposer(),this.resize(this.width,this.height),this.onRestored?.(this.contextLosses)};collectGpuFacts(){let e=this.renderer.getContext(),t=this.renderer.capabilities,n=e.getExtension(`WEBGL_debug_renderer_info`);this.diag.gpu=String(e.getParameter(n?n.UNMASKED_RENDERER_WEBGL:e.RENDERER)),this.diag.maxTexture=t.maxTextureSize,this.diag.maxSamples=t.maxSamples,this.diag.floatBuffers=this.floatRenderable(e),this.diag.halfSamples=this.samplesFor(1016).join(`,`)||`-`,this.diag.byteSamples=this.samplesFor(1009).join(`,`)||`-`}floatRenderable(e){return!!(e.getExtension(`EXT_color_buffer_float`)||e.getExtension(`EXT_color_buffer_half_float`))}samplesFor(e){let t=this.renderer.getContext();if(typeof WebGL2RenderingContext>`u`||!(t instanceof WebGL2RenderingContext)||e===1016&&!this.floatRenderable(t))return[];try{let n=e===1016?t.RGBA16F:t.RGBA8,r=t.getInternalformatParameter(t.RENDERBUFFER,n,t.SAMPLES);return r?Array.from(r).filter(e=>e>0):[]}catch{return[]}}probe(e){let t=this.renderer.getContext();try{for(let e=0;e<8&&t.getError()!==t.NO_ERROR;e++);this.renderer.setRenderTarget(e);let n=t.checkFramebufferStatus(t.FRAMEBUFFER),r=t.getError();return this.renderer.setRenderTarget(null),n===t.FRAMEBUFFER_COMPLETE&&r===t.NO_ERROR}catch{try{this.renderer.setRenderTarget(null)}catch{}return!1}}makeSceneTarget(e,t){let n=this.renderer.getContext();if(!this.floatRenderable(n))return this.diag.sceneTarget=`none (no float buffers)`,null;let r=Math.max(0,this.quality.msaa),i=e=>{if(!r||!e.length)return 0;let t=e.filter(e=>e<=r);return t.length?Math.max(...t):Math.min(...e)},a={type:g,samples:i(this.samplesFor(g))},o={type:l,samples:i(this.samplesFor(l))},s={type:g,samples:0},c={type:l,samples:0},u=Yf();this.diag.mobilePlan=u;let d=u?[o,s,c]:[a,o,s,c],f=[];for(let n of d){let r=`${n.type===1016?`half`:`byte`}x${n.samples}`;if(f.includes(r))continue;f.push(r);let i=new At(e,t,{type:n.type,samples:n.samples});if(this.probe(i))return this.diag.sceneTarget=r,this.diag.targetsTried=f.join(` `),i;i.dispose()}return this.diag.sceneTarget=`none (all probes failed)`,this.diag.targetsTried=f.join(` `),null}setupComposer(){if(this.composer?.dispose(),this.composer=null,this.bloom=null,this.framesToCheck=3,!this.quality.bloom){this.diag.sceneTarget=`off (bloom disabled)`;return}let e=this.renderer.getSize(new B),t=this.renderer.getDrawingBufferSize(new B),n=this.makeSceneTarget(t.x,t.y);if(!n)return;let r=new Lf(this.renderer,n);r.addPass(new Rf(this.scene,this.camera));let i=new Bf(e,.3,.4,.92);r.addPass(i),r.addPass(new Hf),this.composer=r,this.bloom=i,r.setPixelRatio(this.renderer.getPixelRatio()),r.setSize(e.x,e.y)}setQuality(e){this.quality={...this.quality,...e},this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,this.quality.pixelRatioCap)),this.renderer.shadowMap.enabled=this.quality.shadows,this.sun.castShadow=this.quality.shadows,this.renderer.shadowMap.needsUpdate=!0,this.setupComposer(),this.resize(this.width,this.height)}width=1;height=1;resize(e,t){this.width=Math.max(1,e),this.height=Math.max(1,t),this.renderer.setSize(this.width,this.height,!1),this.camera.aspect=this.width/this.height,this.camera.updateProjectionMatrix(),this.composer?.setSize(this.width,this.height),this.composer?.setPixelRatio(this.renderer.getPixelRatio())}fitCamera(e){let{width:t,depth:n,centerZ:r}=e.bounds(),i=e.cfg.portrait?Dd:kd(this.camera.aspect);this.baseDistance=jd({width:t,depth:n,aspect:this.camera.aspect,tilt:this.tilt,marginW:Ed,marginV:i}),this.target.set(0,0,r)}setArena(e){this.skyTexture?.dispose();let t=new $r(qf(e));t.colorSpace=Be,this.scene.background=t,this.skyTexture=t;let n=new W(e.light),r=new W(e.deep);this.hemi.color.copy(n).lerp(new W(16774370),.82),this.hemi.groundColor.copy(r).lerp(new W(8952285),.55),this.scene.fog.color.copy(n).lerp(new W(16777215),.25)}setCameraMode(e){this.mode=e}setParallax(e,t){this.parallaxTarget.set(e,t)}addShake(e){this.shake=Math.min(1.2,this.shake+e)}update(e){this.clockT+=e,this.parallax.x=Zc(this.parallax.x,this.parallaxTarget.x,4,e),this.parallax.y=Zc(this.parallax.y,this.parallaxTarget.y,4,e),this.shake=Math.max(0,this.shake-e*1.6),this.mode===`menu`?this.orbit+=e*.12:this.orbit=Zc(this.orbit,0,2.2,e);let t=this.mode===`menu`?.12:.04,n=Math.sin(this.clockT*.45)*t,r=this.baseDistance*this.zoom+n,i=this.mode===`menu`?this.tilt+.22:this.tilt,a=Math.sin(i),o=Math.cos(i),s=Math.sin(this.orbit)*r*a+this.parallax.x*.55,c=Math.cos(this.orbit)*r*a+this.parallax.y*.35,l=this.shake>0?Math.sin(this.clockT*42)*this.shake*.16:0,u=this.shake>0?Math.cos(this.clockT*37)*this.shake*.12:0;this.camera.position.set(this.target.x+s+l,this.target.y+r*o+u,this.target.z+c),this.camera.lookAt(this.target.x+this.parallax.x*.12,this.target.y,this.target.z+this.parallax.y*.08),this.sun.target.position.copy(this.target),this.sun.position.set(this.target.x-6.5,13,this.target.z+5.5)}render(){if(!this.composer){this.renderer.render(this.scene,this.camera);return}if(this.composer.render(),this.framesToCheck>0){this.framesToCheck--;let e=this.renderer.getContext(),t=e.getError();t!==e.NO_ERROR&&t!==e.CONTEXT_LOST_WEBGL&&(this.diag.renderError=`0x${t.toString(16)} (${this.diag.sceneTarget})`,this.degrade())}}degrade(){this.quality.msaa>0?this.quality.msaa=0:this.quality.bloom=!1,this.setupComposer(),this.resize(this.width,this.height)}get distance(){return this.baseDistance}get targetZ(){return this.target.z}pickTable(e,t,n=0,r=new V){return this.raycaster.setFromCamera(new B(e,t),this.camera),this.tablePlane.constant=-n,this.raycaster.ray.intersectPlane(this.tablePlane,r)??r.set(0,n,0)}raycastFrom(e,t){return this.raycaster.setFromCamera(new B(e,t),this.camera),this.raycaster}projectToScreen(e){let t=e.clone().project(this.camera);return{x:(t.x+1)/2*this.width,y:(1-t.y)/2*this.height}}setToneMappingCinematic(e){this.renderer.toneMapping=e?4:0}get bloomPass(){return this.bloom}get size(){return{width:this.width,height:this.height}}dispose(){let e=this.renderer.domElement;e.removeEventListener(`webglcontextlost`,this.onContextLost),e.removeEventListener(`webglcontextrestored`,this.onContextRestored),this.composer?.dispose(),this.renderer.dispose(),this.skyTexture?.dispose()}},$f=-.78,ep=-.11,tp=new Map;function X(e,t={}){let n=`${e}|${t.rough??.8}|${t.metal??0}|${t.emissive??``}|${t.flat!==!1}`,r=tp.get(n);return r||(r=new bi({color:e,roughness:t.rough??.8,metalness:t.metal??0,flatShading:t.flat!==!1}),t.emissive&&(r.emissive.set(t.emissive),r.emissiveIntensity=.9),tp.set(n,r)),r}function np(e,t,n=!0){let r=new G(e,t);return r.castShadow=n,r.receiveShadow=!1,r}function rp(e){let t=new cn,n=np(new ai(.42,.5,1.5,8),X(e.frame));n.position.y=.75,t.add(n);let r=np(new ai(.54,.54,.16,8),X(e.frameDeep));r.position.y=1.35,t.add(r);let i=np(new oi(.62,.85,8),X(e.skin.accent,{rough:.5,metal:.25}));i.position.y=1.85,t.add(i);let a=np(new ci(.13,8,6),X(`#FFC93C`,{rough:.35,metal:.5}));a.position.y=2.34,t.add(a);for(let e=0;e<3;e++){let n=np(new ri(.16,.24,.1),X(`#1B2450`)),r=e/3*Math.PI*2+.4;n.position.set(Math.cos(r)*.44,1,Math.sin(r)*.44),n.lookAt(new V(Math.cos(r)*2,1,Math.sin(r)*2)),t.add(n)}return t}function ip(e){let t=new cn,n=np(new ai(.34,.3,.72,10),X(e.frame));n.position.y=.36,t.add(n);for(let e of[.16,.56]){let n=np(new li(.34,.045,6,12),X(`#8C5A2B`,{rough:.5,metal:.4}));n.rotation.x=Math.PI/2,n.position.y=e,t.add(n)}let r=np(new ai(.31,.31,.06,10),X(e.frameDeep));return r.position.y=.73,t.add(r),t}function ap(e){let t=new cn,n=np(new ai(.06,.07,2.4,6),X(`#8C5A2B`));n.position.y=1.2,t.add(n);let r=new G(new ri(.9,.55,.05),X(e.skin.accent,{flat:!1}));r.position.set(.5,2,0),r.castShadow=!0,r.name=`flag-cloth`,t.add(r);let i=np(new oi(.1,.24,6),X(`#FFC93C`,{rough:.3,metal:.6}));return i.position.y=2.5,t.add(i),t}function op(e){let t=new cn,n=np(new ri(.8,.45,.55),X(e.frame));n.position.y=.22,t.add(n);let r=np(new ai(.28,.28,.8,10,1,!1,0,Math.PI),X(e.frameDeep));r.rotation.z=Math.PI/2,r.position.y=.45,t.add(r);let i=np(new ri(.16,.2,.1),X(`#FFC93C`,{rough:.3,metal:.7}));i.position.set(0,.4,.3),t.add(i);for(let e of[-.3,.3]){let n=np(new ri(.08,.5,.58),X(`#FFC93C`,{rough:.35,metal:.6}));n.position.set(e,.25,0),t.add(n)}return t}function sp(e){let t=new cn,n=np(new ai(.07,.09,1.7,6),X(`#6B4114`));n.position.y=.85,t.add(n);let r=np(new ai(.22,.13,.28,8),X(`#5C3A1A`));r.position.y=1.78,t.add(r);let i=np(new oi(.2,.55,7),X(`#FFB43C`,{emissive:`#FF8A1E`,rough:.4}));i.position.y=2.15,i.name=`torch-flame`,t.add(i);let a=np(new oi(.1,.3,6),X(`#FFF3B0`,{emissive:`#FFE07A`}));if(a.position.y=2.1,t.add(a),e.torches){let e=new Qi(16757335,6,9,2);e.position.set(0,2.2,0),e.name=`torch-light`,t.add(e)}return t}function cp(e){let t=new cn,n=np(new ai(.16,.22,.9,6),X(`#8C5A2B`));n.position.y=.45,t.add(n);let r=[`#4CBB3F`,`#3EA637`,`#6BD45C`],i=[.62,.5,.38],a=1;for(let e=0;e<3;e++){let n=np(new ci(i[e],7,5),X(r[e%r.length]));n.position.set((e%2?.14:-.12)*(1-e*.2),a,e%2?-.1:.1),t.add(n),a+=i[e]*.72}return t}function lp(e){let t=new cn;for(let n=0;n<3;n++){let r=.7+n*.45,i=np(new oi(.22-n*.03,r,5),X(n%2?e.skin.light:e.skin.accent,{rough:.25,metal:.2,emissive:e.skin.light}));i.position.set((n-1)*.3,r/2,n%2?.14:-.1),i.rotation.z=(n-1)*.16,t.add(i)}return t}function up(e){let t=new cn,n=np(new ci(.34,8,6),X(`#F3ECDC`));n.scale.set(1,.9,1.15),n.position.y=.34,t.add(n);let r=np(new ri(.44,.16,.34),X(`#E3DAC6`));r.position.set(0,.12,.1),t.add(r);for(let e of[-.14,.14]){let n=np(new ci(.1,6,5),X(`#2C3670`));n.position.set(e,.38,.28),t.add(n)}return t}function dp(e){let t=new cn,n=np(new ai(.13,.18,.5,7),X(`#F2E3C6`));n.position.y=.25,t.add(n);let r=np(new ci(.38,9,6,0,Math.PI*2,0,Math.PI/2),X(e.skin.accent));r.position.y=.5,r.scale.set(1,.8,1),t.add(r);for(let e=0;e<3;e++){let n=np(new ci(.07,6,5),X(`#FFF6DF`)),r=e/3*Math.PI*2;n.position.set(Math.cos(r)*.2,.63,Math.sin(r)*.2),t.add(n)}return t}function fp(e){let t=new cn,n=np(new ai(.05,.05,1.1,6),X(`#8C5A2B`));n.rotation.z=Math.PI/2,n.position.y=1.9,t.add(n);let r=new G(new ri(.95,1.3,.06),X(e.skin.base,{flat:!1}));r.position.y=1.25,r.castShadow=!0,t.add(r);let i=np(new ci(.22,8,6),X(e.skin.accent,{rough:.35,metal:.4}));i.scale.set(1,1,.4),i.position.set(0,1.35,.06),t.add(i);for(let e of[-.32,.32]){let n=np(new ai(.06,.07,2.2,6),X(`#6B4114`));n.position.set(e,1.1,-.05),t.add(n)}return t}var pp={tower:rp,barrel:ip,flag:ap,chest:op,torch:sp,tree:cp,crystal:lp,bone:up,mushroom:dp,banner:fp},mp=class{layout;group=new cn;cloth=null;clothTexture=null;frame=null;ground=null;decor=new cn;flags=[];torchFlames=[];torchLights=[];time=0;visual=null;size={w:10,d:8};constructor(e){this.layout=e,this.group.add(this.decor)}computeSize(){let e=this.layout.bounds(),t=this.layout.cfg.portrait;return{w:e.width+(t?.7:1.4),d:e.depth+(t?.8:1.2)}}build(t){this.visual=t,this.dispose(!1);let{w:n,d:r}=this.computeSize();this.size={w:n,d:r};let i=new $r(Kf(t.skin,{size:1024}));i.colorSpace=Be,i.wrapS=i.wrapT=e,i.anisotropy=8,this.clothTexture=i;let a=new G(Id({u0:.02,u1:.98,vTop:.98,vBot:.02},{u0:.02,u1:.98,vTop:.98,vBot:.02},{u0:.5,u1:.5,vTop:.08,vBot:.08},{width:n,height:r,thickness:.5,radius:.7,segments:5}),new bi({map:i,roughness:.95,metalness:0}));a.position.y=-.25,a.receiveShadow=!0,this.cloth=a,this.group.add(a);let o=new G(Id({u0:0,u1:1,vTop:1,vBot:0},{u0:0,u1:1,vTop:1,vBot:0},{u0:.5,u1:.5,vTop:.5,vBot:.5},{width:n+.85,height:r+.85,thickness:.62,radius:.95,segments:5}),X(t.frame,{rough:.7,flat:!1}));o.position.y=-.42,o.receiveShadow=!0,this.frame=o,this.group.add(o);let s=new G(Id({u0:0,u1:1,vTop:1,vBot:0},{u0:0,u1:1,vTop:1,vBot:0},{u0:.5,u1:.5,vTop:.5,vBot:.5},{width:n+.42,height:r+.42,thickness:.5,radius:.82,segments:5}),X(t.skin.accent,{rough:.35,metal:.55,flat:!1}));s.position.y=-.33,s.receiveShadow=!0,this.group.add(s);let c=new G(new ii(34,40),X(t.ground,{rough:1,flat:!1}));c.rotation.x=-Math.PI/2,c.position.y=$f,c.receiveShadow=!0,this.ground=c,this.group.add(c);let l=new G(new li(15,3.2,6,40),X(t.groundDeep,{rough:1}));l.rotation.x=-Math.PI/2,l.position.y=-2.0300000000000002,this.group.add(l),this.placeProps(t)}placeProps(e){let t=ol(e.skin.id.length*977+e.props.length*31),{w:n,d:r}=this.size,i=n/2+1.5,a=r/2+1.4,o=[];for(let e=0;e<5;e++){let r=(e+.5)/5;o.push({x:-i+r*n,z:-a-.4-t()*.9,s:1})}for(let e=0;e<3;e++){let n=(e+.5)/3;o.push({x:-i-.6-t()*.8,z:-a+n*(r+1.6),s:1}),o.push({x:i+.6+t()*.8,z:-a+n*(r+1.6),s:1})}o.push({x:-i-.9,z:a+.7,s:1.1}),o.push({x:i+.9,z:a+.7,s:1.1}),this.flags=[],this.torchFlames=[],this.torchLights=[],o.forEach((n,r)=>{let i=pp[e.props[r%e.props.length]](e),a=n.s*(.85+t()*.4);i.position.set(n.x,$f,n.z),i.scale.setScalar(a),i.rotation.y=t()*Math.PI*2,this.decor.add(i);let o=i.getObjectByName(`flag-cloth`);o&&this.flags.push(o);let s=i.getObjectByName(`torch-flame`);s&&this.torchFlames.push(s);let c=i.getObjectByName(`torch-light`);c instanceof Qi&&this.torchLights.push(c)})}relayout(){this.visual&&this.build(this.visual)}update(e){this.time+=e;for(let e=0;e<this.flags.length;e++){let t=this.flags[e];t.rotation.y=Math.sin(this.time*2.2+e)*.25,t.rotation.z=Math.sin(this.time*3.1+e*.7)*.08}for(let e=0;e<this.torchFlames.length;e++){let t=this.torchFlames[e],n=1+Math.sin(this.time*9+e*2.1)*.14+Math.sin(this.time*21+e)*.05;t.scale.set(1/n,n,1/n)}for(let e=0;e<this.torchLights.length;e++)this.torchLights[e].intensity=5+Math.sin(this.time*11+e*3)*1.4}dispose(e=!0){let t=e=>{e&&(this.group.remove(e),e.traverse(e=>{e instanceof G&&e.geometry.dispose()}))};this.cloth&&this.cloth.material.dispose(),t(this.cloth),t(this.frame),t(this.ground),this.decor.traverse(e=>{e instanceof G&&e.geometry.dispose()}),this.decor.clear();for(let e of[...this.group.children])e!==this.decor&&(this.group.remove(e),e.traverse(e=>{e instanceof G&&e.geometry.dispose()}));this.group.add(this.decor),this.clothTexture?.dispose(),this.clothTexture=null,this.cloth=null,this.frame=null,this.ground=null,e&&(this.visual=null)}get surfaceY(){return 0}get rim(){return{halfW:(this.size.w+.85)/2,halfD:(this.size.d+.85)/2,y:ep}}get doubleSided(){return 2}},hp=(e,t,n,r,i,a,o=!1)=>({skin:Wf(e),ground:t,groundDeep:n,frame:r,frameDeep:i,props:a,torches:o}),gp=[{id:`yard`,drawCount:1,unlockCrowns:0,undoLimit:1/0,backSkin:`royal`,visual:hp(`green-felt`,`#5FBF52`,`#3C8E36`,`#B87A3C`,`#6B4114`,[`barrel`,`tree`,`flag`,`banner`,`chest`]),matches:[{id:`yard-1`,goal:{kind:`win`},bonus:[{kind:`time`,seconds:420},{kind:`score`,value:300}]},{id:`yard-2`,goal:{kind:`win`},bonus:[{kind:`time`,seconds:300},{kind:`noUndo`}]},{id:`yard-3`,goal:{kind:`win`},bonus:[{kind:`score`,value:500},{kind:`combo`,value:3}]}],reward:{coins:60,chest:`wood`}},{id:`grove`,drawCount:1,unlockCrowns:4,undoLimit:1/0,backSkin:`forest`,visual:hp(`grove`,`#4FA83E`,`#2E6B22`,`#7A5C2E`,`#4A3312`,[`mushroom`,`tree`,`flag`,`barrel`,`mushroom`]),matches:[{id:`grove-1`,goal:{kind:`score`,value:350},bonus:[{kind:`win`},{kind:`time`,seconds:360}]},{id:`grove-2`,goal:{kind:`win`},bonus:[{kind:`combo`,value:4},{kind:`noUndo`}]},{id:`grove-3`,goal:{kind:`win`},bonus:[{kind:`time`,seconds:260},{kind:`score`,value:620}]},{id:`grove-4`,goal:{kind:`score`,value:700},bonus:[{kind:`win`},{kind:`combo`,value:5}]}],reward:{coins:90,chest:`wood`}},{id:`bazaar`,drawCount:1,unlockCrowns:10,undoLimit:1/0,backSkin:`ember`,visual:hp(`desert`,`#E0BC7E`,`#B08344`,`#C08A44`,`#7A501F`,[`barrel`,`chest`,`banner`,`tower`,`barrel`]),matches:[{id:`bazaar-1`,goal:{kind:`win`},bonus:[{kind:`time`,seconds:300},{kind:`moves`,value:180}]},{id:`bazaar-2`,goal:{kind:`win`},bonus:[{kind:`score`,value:700},{kind:`noUndo`}]},{id:`bazaar-3`,goal:{kind:`score`,value:800},bonus:[{kind:`win`},{kind:`time`,seconds:240}]},{id:`bazaar-4`,goal:{kind:`win`},bonus:[{kind:`combo`,value:5},{kind:`moves`,value:150}]}],reward:{coins:130,chest:`gold`}},{id:`bones`,drawCount:3,unlockCrowns:18,undoLimit:1/0,backSkin:`bone`,visual:hp(`bone-pit`,`#6F6689`,`#3A3154`,`#5A4E75`,`#332B4A`,[`bone`,`torch`,`crystal`,`banner`,`bone`],!0),matches:[{id:`bones-1`,goal:{kind:`win`},bonus:[{kind:`time`,seconds:420},{kind:`score`,value:500}]},{id:`bones-2`,goal:{kind:`foundation`,value:40},bonus:[{kind:`win`},{kind:`noUndo`}]},{id:`bones-3`,goal:{kind:`win`},bonus:[{kind:`combo`,value:4},{kind:`time`,seconds:330}]},{id:`bones-4`,goal:{kind:`win`},bonus:[{kind:`score`,value:900},{kind:`moves`,value:200}]}],reward:{coins:170,chest:`gold`}},{id:`royal`,drawCount:3,unlockCrowns:28,undoLimit:1/0,backSkin:`royal`,visual:hp(`royal-carpet`,`#3F79FF`,`#12328C`,`#B87A3C`,`#6B4114`,[`tower`,`flag`,`banner`,`chest`,`tower`]),matches:[{id:`royal-1`,goal:{kind:`time`,seconds:480},bonus:[{kind:`win`},{kind:`score`,value:700}]},{id:`royal-2`,goal:{kind:`win`},bonus:[{kind:`time`,seconds:300},{kind:`combo`,value:5}]},{id:`royal-3`,goal:{kind:`time`,seconds:360},bonus:[{kind:`win`},{kind:`noUndo`}]},{id:`royal-4`,goal:{kind:`win`},bonus:[{kind:`score`,value:1100},{kind:`time`,seconds:240}]},{id:`royal-5`,goal:{kind:`score`,value:1e3},bonus:[{kind:`win`},{kind:`combo`,value:6}]}],reward:{coins:220,chest:`gold`}},{id:`frost`,drawCount:1,unlockCrowns:40,undoLimit:3,backSkin:`frost`,visual:hp(`frost`,`#A9E4F7`,`#5C9CC4`,`#8FC3DF`,`#3F7BA0`,[`crystal`,`tower`,`torch`,`flag`,`crystal`],!0),matches:[{id:`frost-1`,goal:{kind:`win`},bonus:[{kind:`noUndo`},{kind:`time`,seconds:400}]},{id:`frost-2`,goal:{kind:`win`},bonus:[{kind:`score`,value:800},{kind:`combo`,value:4}]},{id:`frost-3`,goal:{kind:`win`},bonus:[{kind:`noUndo`},{kind:`time`,seconds:280}]},{id:`frost-4`,goal:{kind:`score`,value:950},bonus:[{kind:`win`},{kind:`moves`,value:170}]}],reward:{coins:260,chest:`gold`}},{id:`guild`,drawCount:3,unlockCrowns:52,undoLimit:5,backSkin:`ember`,visual:hp(`oak`,`#8C6B3F`,`#5A4118`,`#A9793F`,`#6B4114`,[`barrel`,`chest`,`banner`,`tower`,`barrel`]),matches:[{id:`guild-1`,goal:{kind:`win`},bonus:[{kind:`moves`,value:190},{kind:`time`,seconds:380}]},{id:`guild-2`,goal:{kind:`moves`,value:200},bonus:[{kind:`win`},{kind:`score`,value:900}]},{id:`guild-3`,goal:{kind:`win`},bonus:[{kind:`noUndo`},{kind:`combo`,value:5}]},{id:`guild-4`,goal:{kind:`score`,value:1100},bonus:[{kind:`win`},{kind:`time`,seconds:300}]}],reward:{coins:300,chest:`legendary`}},{id:`legend`,drawCount:3,unlockCrowns:66,undoLimit:1,backSkin:`legend`,visual:hp(`legend`,`#7B3FE4`,`#3A1273`,`#5B21B6`,`#2E0B5E`,[`crystal`,`torch`,`tower`,`banner`,`crystal`],!0),matches:[{id:`legend-1`,goal:{kind:`win`},bonus:[{kind:`time`,seconds:360},{kind:`noUndo`}]},{id:`legend-2`,goal:{kind:`score`,value:1200},bonus:[{kind:`win`},{kind:`combo`,value:6}]},{id:`legend-3`,goal:{kind:`time`,seconds:300},bonus:[{kind:`win`},{kind:`moves`,value:160}]},{id:`legend-4`,goal:{kind:`win`},bonus:[{kind:`noUndo`},{kind:`score`,value:1300}]},{id:`legend-5`,goal:{kind:`win`},bonus:[{kind:`time`,seconds:240},{kind:`combo`,value:7}]}],reward:{coins:400,chest:`legendary`}}],_p=e=>gp.find(t=>t.id===e)??gp[0];function vp(e){switch(e.kind){case`win`:return{key:`goal.win`,vars:{}};case`score`:return{key:`goal.score`,vars:{n:e.value}};case`time`:return{key:`goal.time`,vars:{t:`${Math.floor(e.seconds/60)}:${String(e.seconds%60).padStart(2,`0`)}`}};case`noUndo`:return{key:`goal.noUndo`,vars:{}};case`combo`:return{key:`goal.combo`,vars:{n:e.value}};case`moves`:return{key:`goal.moves`,vars:{n:e.value}};case`foundation`:return{key:`goal.foundation`,vars:{n:e.value}}}}function yp(e,t){switch(e.kind){case`win`:return t.won;case`score`:return t.score>=e.value;case`time`:return t.won&&t.seconds<=e.seconds;case`noUndo`:return t.won&&t.undoUsed===0;case`combo`:return t.bestCombo>=e.value;case`moves`:return t.won&&t.moves<=e.value;case`foundation`:return t.foundationCards>=e.value}}function bp(e,t){let n=yp(e.goal,t);return[{goal:e.goal,done:n,main:!0},...e.bonus.map(e=>({goal:e,done:n&&yp(e,t),main:!1}))]}var xp=class{canvas;stage;layout;tweens=new $c;timeline=new Wc;seedPool=new Wu(Date.now());audio=new iu;music;board;tableScene;particles;mascots;fountain;drag;atlas;decals;game=null;arena=gp[0];matchId=null;quality={...Jf};undoLimit=1/0;dealVerified=!0;paused=!1;interactive=!1;inCutscene=!1;cardLang=`ru`;initialMascots=[`badger`];idleTime=0;lastFrame=0;hudTick=0;listeners=new Map;hintCursor=0;autoCompleting=!1;backSkin=`royal`;tableSkinOverride=null;booted=!1;atlasScale=1;cutsceneSkip=null;parallaxEnabled=!0;perfFrames=0;perfTime=0;perfWarmup=3;onQualityDowngrade=null;onRoyalHelpOffer=null;constructor(e){this.canvas=e,this.music=new _u(this.audio,{base:`./`,lowMemory:this.lowMemoryDevice()}),this.quality.msaa=(window.devicePixelRatio||1)>=2?2:4,this.stage=new Qf(e,this.quality),this.layout=new Nd({portrait:window.innerHeight>window.innerWidth*1.05,leftHanded:!1,aspect:window.innerWidth/Math.max(1,window.innerHeight)})}on(e,t){let n=this.listeners.get(e)??[];return n.push(t),this.listeners.set(e,n),()=>{let n=this.listeners.get(e);n&&this.listeners.set(e,n.filter(e=>e!==t))}}emit(e,t){let n=this.listeners.get(e);if(n)for(let e of n)e(t)}async boot(){this.booted||=(await $l(),Hd.maxAnisotropy=this.stage.renderer.capabilities.getMaxAnisotropy(),this.atlasScale=this.atlasScaleFor(),this.atlas=this.bakeAtlas(this.cardLang),this.decals=this.bakeDecals(),this.board=new Hd(this.atlas,this.decals,this.layout,this.tweens,this.backSkin),this.stage.onRestored=()=>this.rebakeTextures(),this.tableScene=new mp(this.layout),this.particles=new Of(this.lowMemoryDevice()?700:1500),this.mascots=new ef(this.initialMascots),this.fountain=new qd(this.board),this.stage.scene.add(this.tableScene.group),this.stage.scene.add(this.board.group),this.stage.scene.add(this.particles.points),this.stage.scene.add(this.mascots.group),this.setArena(this.arena),this.drag=new yd({stage:this.stage,board:()=>this.board,game:()=>this.game,enabled:()=>this.interactive&&!this.paused&&!this.autoCompleting&&!this.inCutscene,onMove:(e,t)=>void this.applyMove(e,t),onIllegal:(e,t)=>this.onIllegal(e,t),onEmptyColumn:(e,t)=>this.onRoyalHelpOffer?.(e,t)??!1,onPickup:e=>this.onPickup(e),onPointerActivity:()=>this.resetIdle(),onHoverChange:e=>{this.canvas.style.cursor=e?`grab`:`default`}}),this.drag.attach(this.canvas),this.canvas.addEventListener(`pointermove`,this.onPointerParallax),this.resize(),window.addEventListener(`resize`,this.resize),window.addEventListener(`orientationchange`,this.resize),!0)}onPointerParallax=e=>{if(!this.parallaxEnabled)return;let t=e.clientX/window.innerWidth*2-1,n=e.clientY/window.innerHeight*2-1;this.stage.setParallax(t,n)};setCameraParallax(e){this.parallaxEnabled=e,e||this.stage.setParallax(0,0)}lowMemoryDevice(){let e=navigator.deviceMemory;return e!==void 0&&e<=4||Math.min(window.innerWidth,window.innerHeight)<500}atlasScaleFor(){let e=navigator.deviceMemory,t=window.devicePixelRatio||1,n=1;e!==void 0&&e<=2?n=.75:t>=2&&(e===void 0||e>=6)&&(n=1.2);let r=this.stage.renderer.capabilities.maxTextureSize||4096;for(;n>.5&&Math.round(2688*n)>r;)n-=.25;return n}bakeLog=[];bakeAtlas(e){let t=eu({scale:this.atlasScale,lang:e});return t.alive===!1&&(this.bakeLog.push(`atlas blank → retry`),t=eu({scale:this.atlasScale,lang:e})),this.bakeLog.push(`atlas ${t.alive===null?`?`:t.alive?`ok`:`BLANK`}`),this.bakeLog.length>6&&this.bakeLog.shift(),t}bakeDecals(){let e=ru({scale:1});return e.alive===!1&&(this.bakeLog.push(`decals blank → retry`),e=ru({scale:1})),this.bakeLog.push(`decals ${e.alive===null?`?`:e.alive?`ok`:`BLANK`}`),this.bakeLog.length>6&&this.bakeLog.shift(),e}rebakeTextures(){this.booted&&(this.bakeLog.push(`rebake after context loss`),this.atlas=this.bakeAtlas(this.cardLang),this.board.setAtlas(this.atlas,this.backSkin),this.decals=this.bakeDecals(),this.board.setDecals(this.decals,this.game?.state??null),this.setArena(this.arena))}rebuildAtlas(e){if(e===this.cardLang||!this.booted){this.cardLang=e;return}this.cardLang=e,this.atlas=this.bakeAtlas(e),this.board.setAtlas(this.atlas,this.backSkin)}setArena(e){this.arena=e,this.undoLimit=e.undoLimit;let t=this.tableSkinOverride?{...e.visual,skin:Wf(this.tableSkinOverride)}:e.visual;this.stage.setArena(t.skin),this.tableScene.build(t),this.placeMascots(),this.setBackSkin(e.backSkin)}placeMascots(){if(!this.mascots||!this.tableScene)return;let e=this.tableScene.rim,t=144/Math.max(1,this.stage.size.height);this.mascots.place(wf({halfW:e.halfW,halfD:e.halfD,rimY:e.y,groundY:$f,dist:this.stage.distance,centerZ:this.stage.targetZ,aspect:this.stage.camera.aspect,count:this.mascots.kinds.length,topLimit:Math.max(.35,1-t),bottomLimit:Math.min(-.35,-1+t)}))}diagnostics(){return{...this.stage.diag,quality:`bloom ${this.quality.bloom?`on`:`off`} · shadows ${this.quality.shadows?`on`:`off`} · msaa ${this.quality.msaa}`,atlas:this.atlas?`${this.atlas.width}×${this.atlas.height} (×${this.atlasScale})`:`-`,bake:this.bakeLog.join(` · `)||`-`,mobile:Yf(),layout:`${this.layout.cfg.portrait?`portrait`:`landscape`} aspect ${(this.layout.cfg.aspect??0).toFixed(2)}`,camera:`dist ${this.stage.distance.toFixed(1)}`}}setTableSkin(e){this.tableSkinOverride=e,this.booted&&this.setArena(this.arena)}setBackSkin(e){this.backSkin=e,this.board?.setBackSkin(e)}setMascots(e){this.booted&&e.length!==0&&(e.length===this.mascots.kinds.length&&e.every((e,t)=>e===this.mascots.kinds[t])||(this.stage.scene.remove(this.mascots.group),this.mascots.dispose(),this.mascots=new ef(e),this.stage.scene.add(this.mascots.group),this.placeMascots(),this.mascots.wave()))}startMatch(e={}){let t=e.arenaId?_p(e.arenaId):this.arena;t.id!==this.arena.id&&this.setArena(t),this.matchId=e.matchId??null;let n=e.drawCount??t.drawCount,r;if(e.seed!==void 0)r=e.seed,this.dealVerified=e.trustSeed||Hu(r,n,12e3).solvable;else{let e=this.seedPool.take(n);r=e.seed,this.dealVerified=e.verified}return this.game=new pd({seed:r,drawCount:n,vegas:e.vegas??!1}),this.autoCompleting=!1,this.hintCursor=0,this.resetIdle(),this.fountain.stop(),this.particles.clear(),this.stage.setCameraMode(`match`),this.emit(`match-start`,{seed:r,arena:t.id,matchId:this.matchId}),this.emit(`state`),e.skipIntro?(this.board.applyState(this.game.state,!1),this.interactive=!0,this.emit(`cutscene-end`)):this.playIntro(),this.game}playIntro(){let e=this.game;if(!e)return;this.inCutscene=!0,this.interactive=!1,this.stage.zoom=1.45,this.audio.play(`whoosh`),this.mascots.wave(),this.tweens.add({duration:1.5,ease:e=>1-(1-e)**3,onUpdate:e=>{this.stage.zoom=1.45+(1-1.45)*e}});let t=this.board.dealIntro(e.state,e=>{this.audio.play(`slap`);let t=this.board.cardPosition(e,new V);this.particles.puff(t,`#FFF3C0`)}),n=()=>{this.inCutscene&&(this.inCutscene=!1,this.cutsceneSkip=null,this.stage.zoom=1,this.interactive=!0,this.stage.addShake(.35),this.particles.burst(new V(0,.2,this.layout.metrics.tableauZ),{count:26,color:[`#FFD84C`,`#FFFFFF`],speed:3.4,size:.5,life:.7,kind:`star`}),this.emit(`cutscene-end`))};this.cutsceneSkip=()=>{this.tweens.killAll(),this.timeline.cancel(`intro`),this.game&&this.board.applyState(this.game.state,!1),n()},this.timeline.after(t,n,`intro`)}skipCutscene(){this.cutsceneSkip?.()}resumeGame(e,t,n){t.id!==this.arena.id&&this.setArena(t),this.game=e,this.matchId=n,this.autoCompleting=!1,this.inCutscene=!1,this.dealVerified=!0,this.resetIdle(),this.fountain.stop(),this.board.applyState(e.state,!0,.012),this.interactive=!0,this.stage.setCameraMode(`match`),this.emit(`match-start`,{seed:e.seed,arena:t.id,matchId:n,resumed:!0}),this.emit(`state`),this.emit(`cutscene-end`)}applyMove(e,t,n={}){let r=this.game;if(!r)return!1;let i=r.apply(e,n);if(!i)return!1;this.hintCursor=0,this.resetIdle(),this.board.playMove(r.state,i),this.playMoveFeedback(i,t);let a={effect:i,source:t,worldPos:i.cards.length?this.board.cardPosition(i.cards[i.cards.length-1],new V):new V};return this.emit(`move`,a),i.scoreDelta!==0&&this.emit(`score`,a),i.comboLevel>0&&this.emit(`combo`,a),this.emit(`state`),i.won&&this.onWin(),!0}playMoveFeedback(e,t){let n=e.cards[e.cards.length-1],r=n===void 0?new V:this.board.cardPosition(n,new V);if(e.move.kind===`draw`){this.audio.play(`draw`);return}if(e.move.kind===`redeal`){this.audio.play(`whoosh`);return}if(e.toFoundation?(this.audio.play(`foundation`,e.comboLevel*2),this.particles.goldBurst(r,1+Math.min(1.2,e.comboLevel*.25)),e.comboLevel>=2&&(this.stage.addShake(.12+e.comboLevel*.03),this.mascots.cheer())):(this.audio.play(`slap`),this.particles.puff(r)),e.flipped!==null){let t=this.board.cardPosition(e.flipped,new V);this.timeline.after(.16,()=>{this.audio.play(`flip`),this.particles.burst(t,{count:8,color:[`#FFFFFF`,`#FFF3C0`],speed:1.4,size:.3,life:.5,kind:`star`})})}t===`auto`&&this.stage.addShake(.04)}undo(){let e=this.game;if(!e||!e.canUndo||e.undoUsed>=this.undoLimit)return!1;let t=e.undo();return t?(this.hintCursor=0,this.resetIdle(),this.board.playMove(e.state,t),this.audio.play(`undo`),this.emit(`state`),!0):!1}hint(){let e=this.game;if(!e)return!1;let t=e.hint({skip:this.hintCursor,solver:this.hintCursor===0});return this.hintCursor++,this.resetIdle(),t?(this.board.pulseHint(e.state,t.cards,t.to),this.audio.play(`hint`),(t.move.kind===`draw`||t.move.kind===`redeal`)&&this.emit(`idle`,{reason:`draw-stock`}),!0):(this.emit(`idle`,{reason:`no-moves`}),this.audio.play(`error`),!1)}canAutoComplete(){return!!this.game&&this.game.canAutoComplete()&&!this.autoCompleting&&!this.game.won}autoComplete(){let e=this.game;if(!e||this.autoCompleting)return;this.autoCompleting=!0,this.interactive=!1;let t=()=>{if(!this.game||this.game!==e){this.autoCompleting=!1;return}let n=e.nextAutoCompleteMove();if(!n){this.autoCompleting=!1,this.interactive=!0;return}if(this.applyMove(n,`auto`),e.won){this.autoCompleting=!1;return}this.timeline.after(.08,t,`auto`)};t()}onWin(){this.interactive=!1,this.autoCompleting=!1;let e=this.game;if(!e)return;this.music.stinger(`win`)||this.audio.play(`fanfare`),this.mascots.celebrate(6),this.stage.addShake(.6);let t=new V(0,.2,this.layout.metrics.tableauZ);this.particles.confetti(t,180,this.layout.bounds().width*.45,6),this.timeline.after(.6,()=>this.particles.confetti(t,120,4,7));let n=this.layout.metrics;this.fountain.setBounds(n.maxX+.4,n.minZ-bd*.2,n.maxZ+bd*.2),this.fountain.start(e.state,{onLaunch:(e,t)=>{this.audio.play(`slap`),this.particles.burst(t.clone(),{count:6,color:[`#FFD84C`,`#FFFFFF`],speed:2,size:.35,life:.5,kind:`star`})}}),this.emit(`win`,{game:e})}stopFountain(){this.fountain.stop(),this.game&&this.board.applyState(this.game.state,!0,.006)}onIllegal(e,t){this.audio.play(`error`),this.particles.burst(t,{count:8,color:[`#FF8080`,`#FFC0C0`],speed:1.2,size:.3,life:.4}),this.emit(`illegal`,{cards:e,worldPos:t})}onPickup(e){this.audio.play(`pick`)}resetIdle(){this.idleTime=0}tickIdle(e){if(this.interactive&&!this.paused&&this.game&&!this.inCutscene&&(this.idleTime+=e,this.idleTime>20)){this.idleTime=0;let e=this.game.hint(0);e&&this.board.breathe(e.cards),this.mascots.yawn(),this.emit(`idle`,{reason:`timeout`,hint:e})}}frame=e=>{let t=this.lastFrame?Math.min(.05,(e-this.lastFrame)/1e3):.016;this.lastFrame=e,this.update(t),this.stage.render()};update(e){this.tweens.update(e),this.timeline.update(e),this.board?.update(e),this.tableScene?.update(e),this.mascots?.update(e),this.particles?.update(e),this.fountain?.active&&(this.fountain.update(e)||this.emit(`fountain-end`)),this.stage.update(e),this.game&&!this.paused&&this.interactive&&!this.inCutscene&&(this.game.tick(e*1e3),this.hudTick+=e,this.hudTick>=.25&&(this.hudTick=0,this.emit(`tick`))),this.tickIdle(e),this.trackPerformance(e),!this.interactive&&this.seedPool.needsWork()&&this.seedPool.work(3)}trackPerformance(e){if(this.inCutscene)return;if(this.perfWarmup>0){this.perfWarmup-=e,this.perfFrames=0,this.perfTime=0;return}if(this.perfFrames++,this.perfTime+=e,this.perfFrames<150)return;let t=this.perfTime/this.perfFrames*1e3;if(this.perfFrames=0,this.perfTime=0,t>26&&this.quality.bloom){this.setQuality({bloom:!1}),this.onQualityDowngrade?.(`bloom`);return}t>34&&this.quality.shadows&&(this.setQuality({shadows:!1}),this.onQualityDowngrade?.(`shadows`))}pause(e){this.paused=e,this.audio.duckMusic(e),e&&this.drag?.cancel()}resize=()=>{let e=window.innerWidth,t=window.innerHeight,n=t>e*1.05,r=e/Math.max(1,t),i=Math.abs(r-(this.layout.cfg.aspect??r))>.04;(n!==this.layout.cfg.portrait||i)&&(this.layout.update({portrait:n,aspect:r}),this.tableScene?.relayout(),this.game&&this.board?.relayout(this.game.state)),this.stage.resize(e,t),this.stage.fitCamera(this.layout),this.placeMascots()};setLeftHanded(e){this.layout.cfg.leftHanded!==e&&(this.layout.update({leftHanded:e}),this.tableScene?.relayout(),this.game&&this.board?.relayout(this.game.state),this.stage.fitCamera(this.layout),this.placeMascots())}setAnimationSpeed(e){this.tweens.timeScale=e,this.board&&(this.board.animSpeed=e)}setQuality(e){this.quality={...this.quality,...e},this.stage.setQuality(this.quality),this.perfWarmup=3}showMenuDemo(){if(!this.booted)return;let e=new pd({seed:Math.random()*4294967295>>>0,drawCount:1});for(let t=0;t<20;t++){let t=e.hint(0);if(t){e.apply(t.move);continue}if(!e.apply({kind:`draw`}))break}this.game=null,this.matchId=null,this.interactive=!1,this.board.applyState(e.state,!0,.008),this.mascots.wave()}screenPosOf(e){return this.stage.projectToScreen(this.board.cardPosition(e,new V))}screenPosOfWorld(e){return this.stage.projectToScreen(e)}};function Sp(e){let t=``;for(let n=0;n<52;n+=4){let r=0;for(let t=0;t<4;t++)e[n+t]&&(r|=1<<t);t+=r.toString(16)}return t}function Cp(e){let t=Array(52).fill(!1);for(let n=0;n<e.length;n++){let r=parseInt(e[n],16);if(!Number.isNaN(r))for(let e=0;e<4;e++)t[n*4+e]=!!(r&1<<e)}return t}function wp(e){let t=e.state;return{v:1,seed:e.seed,draw:e.drawCount,vegas:e.vegas,score:e.score,moves:e.moves,ms:Math.round(e.elapsedMs),undoUsed:e.undoUsed,recycles:e.recycles,bestCombo:e.bestCombo,stock:t.stock.slice(),waste:t.waste.slice(),foundations:t.foundations.map(e=>e.slice()),tableau:t.tableau.map(e=>e.slice()),up:Sp(t.faceUp)}}function Tp(e){let t=new Set,n=e=>{for(let n of e){if(!Number.isInteger(n)||n<0||n>=52||t.has(n))return!1;t.add(n)}return!0};if(!n(e.stock)||!n(e.waste))return!1;for(let t of e.foundations)if(!n(t))return!1;for(let t of e.tableau)if(!n(t))return!1;if(t.size!==52)return!1;for(let t=0;t<e.foundations.length;t++){let n=e.foundations[t];for(let e=0;e<n.length;e++)if(n[e]!==t*13+e)return!1}return!0}function Ep(e){if(!e||typeof e!=`object`)return null;let t=e;if(t.v!==1||!Array.isArray(t.stock)||!Array.isArray(t.waste)||!Array.isArray(t.foundations)||!Array.isArray(t.tableau)||typeof t.up!=`string`||t.foundations.length!==4||t.tableau.length!==7)return null;let n={stock:t.stock.slice(),waste:t.waste.slice(),foundations:t.foundations.map(e=>Array.isArray(e)?e.slice():[]),tableau:t.tableau.map(e=>Array.isArray(e)?e.slice():[]),faceUp:Cp(t.up)};if(!Tp(n))return null;let r=new pd({seed:typeof t.seed==`number`?t.seed:1,drawCount:t.draw===3?3:1,vegas:!!t.vegas});return r.restore({state:n,score:Number(t.score)||0,moves:Number(t.moves)||0,elapsedMs:Number(t.ms)||0,undoUsed:Number(t.undoUsed)||0,recycles:Number(t.recycles)||0,bestCombo:Number(t.bestCombo)||0,cardsToFoundation:n.foundations.reduce((e,t)=>e+t.length,0)}),r}var Dp=[{id:`badger`,kind:`mascot`,rarity:`common`,icon:`🛡️`},{id:`fox`,kind:`mascot`,rarity:`rare`,icon:`🦊`,price:350},{id:`dragon`,kind:`mascot`,rarity:`legendary`,icon:`🐲`,price:800,premium:`mascot_dragon`}],Op=[{id:`crown`,kind:`emote`,rarity:`common`,icon:`👑`},{id:`laugh`,kind:`emote`,rarity:`common`,icon:`😆`},{id:`wow`,kind:`emote`,rarity:`rare`,icon:`🤩`,price:200},{id:`sleep`,kind:`emote`,rarity:`rare`,icon:`😴`,price:200},{id:`fire`,kind:`emote`,rarity:`legendary`,icon:`🔥`,price:450,premium:`emote_fire`}],kp={royal:`👑`,forest:`🍄`,ember:`🔥`,frost:`❄️`,bone:`💀`,legend:`✨`},Ap={"green-felt":`🟩`,grove:`🌳`,"bone-pit":`🦴`,"royal-carpet":`🟦`,frost:`🧊`,desert:`🏜️`,oak:`🪵`,legend:`🌌`},jp=Kl.map(e=>({id:e.id,kind:`back`,rarity:e.rarity,icon:kp[e.id]??`🂠`,price:e.rarity===`common`?150:e.rarity===`rare`?400:900,...e.id===`legend`?{premium:`back_legend`}:{}})),Mp=Uf.map((e,t)=>({id:e.id,kind:`table`,rarity:t<3?`common`:t<6?`rare`:`legendary`,icon:Ap[e.id]??`🟫`,price:t<3?180:t<6?420:950,...e.id===`legend`?{premium:`table_legend`}:{}})),Np=[...jp,...Mp,...Dp,...Op],Pp=(e,t)=>Np.find(n=>n.kind===e&&n.id===t),Fp=Np.filter(e=>e.premium),Ip=Fp.map(e=>e.premium),Lp=e=>Fp.find(t=>t.premium===e),Rp={backs:[`royal`],tables:[`green-felt`],mascots:[`badger`],emotes:[`crown`,`laugh`]},zp={common:`#8FB6FF`,rare:`#4CBB3F`,legendary:`#9B4DFF`},Bp={wood:{kind:`wood`,icon:`📦`,color:`#B87A3C`,coins:[25,60],items:1,odds:{common:.8,rare:.19,legendary:.01}},gold:{kind:`gold`,icon:`🧰`,color:`#FFC93C`,coins:[70,150],items:2,odds:{common:.55,rare:.38,legendary:.07}},legendary:{kind:`legendary`,icon:`🎁`,color:`#9B4DFF`,coins:[180,320],items:3,odds:{common:.25,rare:.5,legendary:.25}}},Vp=[jp,Mp,Dp,Op];function Hp(e,t){let n=e();return n<t.legendary?`legendary`:n<t.legendary+t.rare?`rare`:`common`}function Up(e,t,n=Date.now()){let r=Bp[e],i=Cu(n>>>0),a=Math.round(r.coins[0]+i()*(r.coins[1]-r.coins[0])),o=[],s=0,c=new Set([...t.backs.map(e=>`back:${e}`),...t.tables.map(e=>`table:${e}`),...t.mascots.map(e=>`mascot:${e}`),...t.emotes.map(e=>`emote:${e}`)]);for(let e=0;e<r.items;e++){let e=Hp(i,r.odds),t=Vp[Math.floor(i()*Vp.length)].filter(t=>t.rarity===e&&!c.has(`${t.kind}:${t.id}`)&&!o.includes(t)),n=Np.filter(e=>!c.has(`${e.kind}:${e.id}`)&&!o.includes(e)),a=t.length?t:n;if(!a.length){s+=e===`legendary`?300:e===`rare`?120:40;continue}let l=a[Math.floor(i()*a.length)];o.push(l),c.add(`${l.kind}:${l.id}`)}return{coins:a,crowns:0,items:o,duplicateCoins:s,chest:e}}function Wp(e,t){return e<=0?null:e>=3?t===`wood`?`gold`:`legendary`:e===2?t:t===`legendary`?`gold`:`wood`}function Gp(e,t,n){return Math.round((n?40:8)+e*25+Math.max(0,t)*.02)}var Kp=[1,3,6,10,15,21,28,36],qp=e=>{let t=Kp[0];for(let n of Kp)e>=n&&(t=n);return t},Jp=e=>120+(e-1)*90;function Yp(e,t,n){let r=e,i=t+n,a=0;for(;i>=Jp(r)&&(i-=Jp(r),r++,a++,!(a>50)););return{level:r,xp:i,levelUps:a}}var Xp=[{id:`bestScore`,titleKey:`leaderboard.bestScore`,value:e=>Math.max(0,e.stats.bestScore)},{id:`crowns`,titleKey:`leaderboard.crowns`,value:e=>{let t=0;for(let n of Object.values(e.arenas))for(let e of Object.values(n))t+=e.crowns;return t}}];Xp.map(e=>e.id);function Zp(e){return Xp.map(t=>({id:t.id,score:t.value(e)})).filter(t=>t.score>0&&t.score>(e.leaderboards[t.id]??-1))}var Qp=`royal-klondike.save.v1`,$p=9900;function em(){return{version:6,profile:{name:``,level:1,xp:0,coins:100,createdAt:Date.now()},stats:{played:0,wins:0,losses:0,bestTimeSec:0,bestScore:0,longestCombo:0,winStreak:0,bestStreak:0,totalTimeSec:0,cardsToFoundation:0,chestsOpened:0},arenas:{},inventory:{backs:[...Rp.backs],tables:[...Rp.tables],mascots:[...Rp.mascots],emotes:[...Rp.emotes],equipped:{back:`royal`,table:`green-felt`,emote:`crown`,mascots:[...Rp.mascots]}},settings:{drawCount:1,vegas:!1,sfx:.9,music:.4,muted:!1,shadows:!0,bloom:!0,qualityByPlayer:!1,animSpeed:1,leftHanded:!1,cameraParallax:!0,cardLang:`ru`,lang:`ru`},current:null,seeds:{draw1:[],draw3:[]},leaderboards:{},updatedAt:Date.now()}}var tm=(e,t)=>typeof e==`number`&&Number.isFinite(e)?e:t,nm=(e,t)=>typeof e==`boolean`?e:t,rm=(e,t)=>typeof e==`string`&&e.length>0?e:t,im=(e,t)=>Array.isArray(e)?e.filter(e=>typeof e==`string`):t;function am(e){let t=em();if(!e||typeof e!=`object`)return t;let n=e,r=n.profile??{},i=n.stats??{},a=n.settings??{},o=n.inventory??{},s=o.equipped??{},c={};if(n.arenas&&typeof n.arenas==`object`){for(let[e,t]of Object.entries(n.arenas))if(t&&typeof t==`object`){c[e]={};for(let[n,r]of Object.entries(t)){let t=r??{};c[e][n]={crowns:Math.max(0,Math.min(3,Math.round(tm(t.crowns,0)))),bestScore:Math.max(0,Math.round(tm(t.bestScore,0))),bestTimeSec:Math.max(0,Math.round(tm(t.bestTimeSec,0))),plays:Math.max(0,Math.round(tm(t.plays,0)))}}}}return{version:6,profile:{name:(typeof r.name==`string`?r.name:``).slice(0,24),level:Math.max(1,Math.round(tm(r.level,1))),xp:Math.max(0,tm(r.xp,0)),coins:Math.max(0,Math.round(tm(r.coins,t.profile.coins))),createdAt:tm(r.createdAt,Date.now())},stats:{played:Math.max(0,Math.round(tm(i.played,0))),wins:Math.max(0,Math.round(tm(i.wins,0))),losses:Math.max(0,Math.round(tm(i.losses,0))),bestTimeSec:Math.max(0,Math.round(tm(i.bestTimeSec,0))),bestScore:Math.max(0,Math.round(tm(i.bestScore,0))),longestCombo:Math.max(0,Math.round(tm(i.longestCombo,0))),winStreak:Math.max(0,Math.round(tm(i.winStreak,0))),bestStreak:Math.max(0,Math.round(tm(i.bestStreak,0))),totalTimeSec:Math.max(0,Math.round(tm(i.totalTimeSec,0))),cardsToFoundation:Math.max(0,Math.round(tm(i.cardsToFoundation,0))),chestsOpened:Math.max(0,Math.round(tm(i.chestsOpened,0)))},arenas:c,inventory:{backs:im(o.backs,t.inventory.backs),tables:im(o.tables,t.inventory.tables),mascots:im(o.mascots,t.inventory.mascots),emotes:im(o.emotes,t.inventory.emotes),equipped:{back:rm(s.back,t.inventory.equipped.back),table:rm(s.table,t.inventory.equipped.table),emote:rm(s.emote,t.inventory.equipped.emote),mascots:(()=>{let e=im(s.mascots,t.inventory.equipped.mascots).slice(0,3);return e.length?e:[...t.inventory.equipped.mascots]})()}},settings:{drawCount:a.drawCount===3?3:1,vegas:nm(a.vegas,!1),sfx:Math.min(1,Math.max(0,tm(a.sfx,t.settings.sfx))),music:Math.min(1,Math.max(0,tm(a.music,t.settings.music))),muted:nm(a.muted,!1),shadows:nm(a.shadows,!0),bloom:nm(a.bloom,!0),qualityByPlayer:nm(a.qualityByPlayer,!1),animSpeed:Math.min(2,Math.max(.5,tm(a.animSpeed,1))),leftHanded:nm(a.leftHanded,!1),cameraParallax:nm(a.cameraParallax,!0),cardLang:a.cardLang===`en`?`en`:`ru`,lang:rm(a.lang,t.settings.lang).slice(0,8)},current:n.current??null,seeds:{draw1:Array.isArray(n.seeds?.draw1)?n.seeds.draw1.filter(e=>typeof e==`number`):[],draw3:Array.isArray(n.seeds?.draw3)?n.seeds.draw3.filter(e=>typeof e==`number`):[]},leaderboards:(()=>{let e={};if(n.leaderboards&&typeof n.leaderboards==`object`)for(let[t,r]of Object.entries(n.leaderboards))typeof r==`number`&&Number.isFinite(r)&&(e[t]=r);return e})(),updatedAt:tm(n.updatedAt,Date.now())}}var om=100+$p,sm={1:e=>{let t=e.inventory??{},n=t.equipped??{};return{...e,version:2,inventory:{...t,emotes:Array.isArray(t.emotes)?t.emotes:[`crown`,`laugh`],equipped:{...n,emote:typeof n.emote==`string`?n.emote:`crown`}},seeds:e.seeds??{draw1:[],draw3:[]}}},2:e=>{let t=e.inventory??{},n=t.equipped??{},r=Array.isArray(t.mascots)?t.mascots.filter(e=>typeof e==`string`):[];return{...e,version:3,inventory:{...t,equipped:{...n,mascots:Array.isArray(n.mascots)?n.mascots:r.length?r.slice(0,3):[`badger`]}}}},3:e=>{let t=e.settings??{},n=e.profile??{},{master:r,hints:i,...a}=t,o=typeof n.coins==`number`?n.coins:0;return{...e,version:4,profile:{...n,coins:Math.max(o,om)},settings:{...a,muted:typeof t.muted==`boolean`&&t.muted}}},4:e=>{let{best_score:t,...n}=e.leaderboards??{},r={...n};if(typeof t==`number`){let e=r.bestScore;r.bestScore=typeof e==`number`?Math.max(e,t):t}return{...e,version:5,leaderboards:r}},5:e=>{let t=e.profile??{},n=typeof t.coins==`number`&&Number.isFinite(t.coins)?t.coins:100;return{...e,version:6,profile:{...t,coins:Math.max(0,Math.round(n-$p))}}}};function cm(e){if(!e||typeof e!=`object`)return{data:am(null),migratedFrom:null,repaired:!0};let t={...e},n=typeof t.version==`number`?t.version:1,r=n,i=0;for(;r<6&&i++<20;){let e=sm[r];if(!e){r=6;break}t=e(t),r=typeof t.version==`number`?t.version:r+1}return{data:am(t),migratedFrom:n<6?n:null,repaired:n>6}}var lm=()=>{let e=new Map;return{getItem:t=>e.get(t)??null,setItem:(t,n)=>void e.set(t,n),removeItem:t=>void e.delete(t)}};function um(){try{if(typeof window>`u`||!window.localStorage)return lm();let e=`__rk_probe__`;return window.localStorage.setItem(e,`1`),window.localStorage.removeItem(e),window.localStorage}catch{return lm()}}var dm=class{storage;data;dirty=!1;lastWrite=0;timer=null;lastLoad={migratedFrom:null,existed:!1};constructor(e){this.storage=e??um(),this.data=this.read()}read(){try{let e=this.storage.getItem(Qp);if(!e)return this.lastLoad={migratedFrom:null,existed:!1},em();let t=cm(JSON.parse(e));return this.lastLoad={migratedFrom:t.migratedFrom,existed:!0},t.data}catch{return this.lastLoad={migratedFrom:null,existed:!1},em()}}get state(){return this.data}update(e,t=!1){e(this.data),this.data.updatedAt=Date.now(),this.dirty=!0,t?this.flush():this.scheduleFlush()}scheduleFlush(){this.timer===null&&(this.timer=setTimeout(()=>{this.timer=null,this.flush()},400))}writeFailures=0;onWriteError=null;onFlushed=null;flush(){if(this.dirty)try{this.storage.setItem(Qp,JSON.stringify(this.data)),this.dirty=!1,this.writeFailures=0,this.lastWrite=Date.now(),this.onFlushed?.(this.data)}catch(e){this.writeFailures++,this.writeFailures===1&&this.onWriteError?.(e),this.writeFailures<=5&&this.scheduleFlush()}}get lastWriteTime(){return this.lastWrite}reset(){return this.data=em(),this.dirty=!0,this.writeFailures=0,this.flush(),this.data}adopt(e){this.data=e,this.dirty=!0,this.flush()}export(){return JSON.stringify(this.data,null,2)}import(e){try{let t=JSON.parse(e);if(!t||typeof t!=`object`)return!1;let n=cm(t);return this.data=am(n.data),this.dirty=!0,this.flush(),!0}catch{return!1}}},fm=(e,t)=>[...new Set([...e,...t])];function pm(e,t){if(!t||typeof t!=`object`)return{data:e,cloudWon:!1};let n=am(t),r=n.updatedAt>e.updatedAt,i=r?n:e,a=r?e:n,o={};for(let e of[a.arenas,i.arenas])for(let[t,n]of Object.entries(e)){let e=o[t]??={};for(let[t,r]of Object.entries(n)){let n=e[t];e[t]=n?{crowns:Math.max(n.crowns,r.crowns),bestScore:Math.max(n.bestScore,r.bestScore),bestTimeSec:n.bestTimeSec&&r.bestTimeSec?Math.min(n.bestTimeSec,r.bestTimeSec):n.bestTimeSec||r.bestTimeSec,plays:Math.max(n.plays,r.plays)}:{...r}}}let s=i.stats,c=a.stats,l=i.profile.level>=a.profile.level?i.profile:a.profile;return{data:{...i,profile:{...i.profile,level:l.level,xp:l.xp,createdAt:Math.min(i.profile.createdAt,a.profile.createdAt)},stats:{played:Math.max(s.played,c.played),wins:Math.max(s.wins,c.wins),losses:Math.max(s.losses,c.losses),bestTimeSec:s.bestTimeSec&&c.bestTimeSec?Math.min(s.bestTimeSec,c.bestTimeSec):s.bestTimeSec||c.bestTimeSec,bestScore:Math.max(s.bestScore,c.bestScore),longestCombo:Math.max(s.longestCombo,c.longestCombo),winStreak:s.winStreak,bestStreak:Math.max(s.bestStreak,c.bestStreak),totalTimeSec:Math.max(s.totalTimeSec,c.totalTimeSec),cardsToFoundation:Math.max(s.cardsToFoundation,c.cardsToFoundation),chestsOpened:Math.max(s.chestsOpened,c.chestsOpened)},arenas:o,inventory:{backs:fm(i.inventory.backs,a.inventory.backs),tables:fm(i.inventory.tables,a.inventory.tables),mascots:fm(i.inventory.mascots,a.inventory.mascots),emotes:fm(i.inventory.emotes,a.inventory.emotes),equipped:{...i.inventory.equipped,mascots:[...i.inventory.equipped.mascots]}},settings:{...e.settings},leaderboards:(()=>{let e={...a.leaderboards};for(let[t,n]of Object.entries(i.leaderboards))e[t]=Math.max(e[t]??-1,n);return e})(),updatedAt:Math.max(i.updatedAt,a.updatedAt)},cloudWon:r}}function Z(e,t={},n=[]){let r=document.createElement(e);if(t.class&&(r.className=t.class),t.id&&(r.id=t.id),t.text!==void 0&&(r.textContent=t.text),t.html!==void 0&&(r.innerHTML=t.html),t.title&&(r.title=t.title),t.style&&Object.assign(r.style,t.style),t.dataset)for(let[e,n]of Object.entries(t.dataset))r.dataset[e]=n;if(t.attrs)for(let[e,n]of Object.entries(t.attrs))r.setAttribute(e,n);t.onClick&&r.addEventListener(`click`,t.onClick);for(let e of n)e!=null&&e!==!1&&r.append(typeof e==`object`?e:String(e));return r}function Q(e,t={}){let n=[`btn`];t.variant&&t.variant!==`green`&&n.push(`btn--${t.variant}`),t.size===`small`&&n.push(`btn--small`),t.size===`icon`&&n.push(`icon-btn`),t.wide&&n.push(`btn--wide`),t.class&&n.push(t.class);let r=Z(`button`,{...t,class:n.join(` `)},[t.icon?Z(`span`,{text:t.icon}):null,e?Z(`span`,{text:e}):null]);return t.disabled&&(r.disabled=!0,r.classList.add(`is-disabled`)),r}function mm(e,t,n){return Z(`div`,{class:`panel${n?` panel--blue`:``}`},[e?Z(`h2`,{class:`panel__title`,text:e}):null,...t])}function hm(e){for(;e.firstChild;)e.removeChild(e.firstChild)}function gm(e,t){let n=Z(`div`,{class:`switch${e?` is-on`:``}`},[Z(`i`,{})]),r=e;return n.addEventListener(`click`,()=>{r=!r,n.classList.toggle(`is-on`,r),t(r)}),n}function _m(e,t,n){let r=Z(`div`,{class:`seg`}),i=[];for(let a of e){let e=Z(`button`,{text:a.label,class:a.value===t?`is-active`:``,onClick:()=>{for(let e of i)e.classList.remove(`is-active`);e.classList.add(`is-active`),n(a.value)}});i.push(e),r.append(e)}return r}function vm(e,t,n={}){let r=Z(`input`,{attrs:{type:`range`,min:String(n.min??0),max:String(n.max??1),step:String(n.step??.05),value:String(e)},style:{width:`150px`,accentColor:`#FFC93C`}});return r.addEventListener(`input`,()=>t(Number(r.value))),r}function ym(e,t=3){let n=[];for(let r=0;r<t;r++)n.push(Z(`span`,{text:`♛`,class:r<e?``:`dim`}));return Z(`span`,{class:`crowns`},n)}function bm(e,t={}){let n=Z(`div`,{class:`help__bubble`},[t.label?Z(`b`,{text:t.label}):null,Z(`span`,{text:e})]),r=Z(`span`,{class:`help`},[Z(`button`,{class:`help__dot`,text:`?`,attrs:{type:`button`,"aria-label":e}}),n]),i=()=>{r.classList.remove(`is-open`),document.removeEventListener(`pointerdown`,a,!0),document.removeEventListener(`keydown`,o,!0)},a=e=>{r.contains(e.target)||i()},o=e=>{e.key===`Escape`&&(e.stopPropagation(),i())};return r.addEventListener(`click`,e=>{if(e.stopPropagation(),r.classList.contains(`is-open`)){i();return}for(let e of document.querySelectorAll(`.help.is-open`))e.classList.remove(`is-open`);r.classList.add(`is-open`),document.addEventListener(`pointerdown`,a,!0),document.addEventListener(`keydown`,o,!0)}),r}var xm=(e,t,n)=>Z(`div`,{class:`settings-row`},[Z(`span`,{class:`settings-row__label`},[document.createTextNode(e),n?bm(n):null]),t]),Sm={"game.title":`Королевская`,"game.title2":`Косынка`,"menu.play":`Играть`,"menu.continue":`Продолжить`,"menu.arenas":`Арены`,"menu.profile":`Профиль`,"menu.settings":`Настройки`,"menu.shop":`Лавка`,"menu.quickPlay":`Быстрая партия`,"common.back":`Назад`,"common.close":`Закрыть`,"common.ok":`Хорошо`,"common.cancel":`Отмена`,"common.locked":`Закрыто`,"common.crowns":`короны`,"common.coins":`монеты`,"common.seed":`Раздача`,"common.yes":`Да`,"common.no":`Нет`,"hud.score":`Очки`,"hud.time":`Время`,"hud.moves":`Ходы`,"hud.undo":`Отмена`,"hud.hint":`Подсказка`,"hud.newDeal":`Новая`,"hud.collect":`Собрать!`,"hud.menu":`Меню`,"hud.goal":`Цель`,"hud.finish":`Завершить`,"hud.combo":`Комбо ×{n}`,"pause.title":`Пауза`,"pause.resume":`Продолжить`,"pause.restart":`Заново`,"pause.newDeal":`Новая раздача`,"pause.toMenu":`В меню`,"result.win":`Победа!`,"result.lose":`Партия окончена`,"result.score":`Очки`,"result.timeBonus":`Бонус за время`,"result.comboBonus":`Бонус за комбо`,"result.total":`Итого`,"result.crowns":`Короны`,"result.coins":`Монеты`,"result.again":`Ещё раз`,"result.next":`Дальше`,"result.toArenas":`К аренам`,"chest.title":`Награда`,"chest.tap":`Нажми, чтобы открыть`,"chest.duplicate":`Повтор → монеты`,"chest.wood":`Деревянный сундук`,"chest.gold":`Золотой сундук`,"chest.legendary":`Легендарный сундук`,"arenas.title":`Арены`,"arenas.needCrowns":`Нужно корон: {n}`,"arenas.matches":`Матчи`,"arenas.drawMode":`сдача по {n}`,"profile.title":`Профиль`,"profile.defaultName":`Игрок`,"profile.level":`Уровень`,"profile.wins":`Победы`,"profile.losses":`Поражения`,"profile.bestTime":`Лучшее время`,"profile.bestScore":`Лучший счёт`,"profile.longestCombo":`Длинное комбо`,"profile.streak":`Серия побед`,"profile.played":`Партий`,"profile.cards":`Карт в фундаменты`,"profile.cosmetics":`Косметика`,"settings.title":`Настройки`,"settings.draw":`Сдача из колоды`,"settings.draw1":`1 карта`,"settings.draw3":`3 карты`,"settings.music":`Музыка`,"settings.sfx":`Звуки`,"settings.shadows":`Тени`,"settings.bloom":`Свечение`,"settings.animSpeed":`Скорость анимаций`,"settings.leftHanded":`Режим левши`,"settings.parallax":`Покачивание камеры`,"settings.vegas":`Режим «Вегас»`,"settings.drawLocked":`В матче арены режим сдачи задаёт сама арена`,"toast.noMoves":`Ходов нет — переберите сток`,"toast.drawStock":`На столе полезных ходов нет — берите карту из колоды`,"toast.undoLimit":`В этой арене отмены закончились`,"toast.noHint":`Подсказок больше нет`,"toast.saved":`Партия сохранена`,"toast.newRecord":`Новый рекорд!`,"toast.levelUp":`Уровень {n}!`,"toast.unlocked":`Открыта арена «{name}»`,"toast.goalDone":`Цель достигнута! Можно закончить матч`,"toast.bloomOff":`Свечение выключено — устройству было тяжело. Вернуть можно в настройках`,"toast.shadowsOff":`Тени выключены — устройству было тяжело. Вернуть можно в настройках`,"toast.drawApplied":`Сдача по {n} — раздача началась заново`,"toast.drawNextDeal":`Сдача по {n} — со следующей раздачи`,"toast.unverifiedSeed":`Раздача #{n} задана вручную — она может и не сойтись`,"toast.saveFailed":`Не удаётся сохранить прогресс — хранилище браузера переполнено`,"toast.mascotEquipped":`Талисман {name} вышел к столу`,"toast.cloudSync":`Прогресс подтянут из облака`,"seed.enter":`Номер раздачи`,"seed.play":`Играть по номеру`,"shop.title":`Лавка`,"shop.buy":`Купить`,"shop.owned":`Есть`,"shop.equip":`Надеть`,"shop.equipped":`Надето`,"shop.notEnough":`Не хватает монет`,"shop.mascotHint":`Талисман садится за стол рядом с раскладкой`,"shop.cat.back":`Рубашки карт`,"shop.cat.backDesc":`Меняют картинку на обороте карт — видно на закрытых картах и в колоде.`,"shop.cat.table":`Сукно стола`,"shop.cat.tableDesc":`Меняет цвет и узор стола под всеми картами.`,"shop.cat.mascot":`Талисманы`,"shop.cat.mascotDesc":`Зверята-болельщики у стола. Мест три — можно посадить сразу троих.`,"shop.cat.emote":`Эмоции победы`,"shop.cat.emoteDesc":`Большой стикер, который вылетает на экран, когда пасьянс сошёлся.`,"shop.premiumHint":`Особый предмет за деньги: становится вашим навсегда, цена — в валюте площадки`,"shop.unavailableTitle":`Покупка недоступна`,"shop.unavailable":`Лавка не смогла получить список товаров у площадки: покупки ещё не подключены или нет связи. Попробуйте позже.`,"shop.purchased":`Покупка прошла: {name} теперь ваш`,"shop.purchaseFailed":`Покупка не завершена — ничего не списано`,"shop.restored":`Возвращена оплаченная покупка: {name}`,"cosmetics.backs":`Рубашки`,"cosmetics.tables":`Столы`,"cosmetics.mascots":`Талисманы`,"cosmetics.emotes":`Эмоции`,"rarity.common":`обычная`,"rarity.rare":`редкая`,"rarity.legendary":`легендарная`,"goal.win":`Собрать пасьянс`,"goal.score":`Набрать {n} очков`,"goal.time":`Уложиться в {t}`,"goal.noUndo":`Без отмен`,"goal.combo":`Комбо ×{n}`,"goal.moves":`Не больше {n} ходов`,"goal.foundation":`{n} карт в фундаментах`,"confirm.title":`Точно?`,"confirm.restart":`Начать эту же раздачу заново? Текущий прогресс партии пропадёт.`,"confirm.newDeal":`Взять новую раздачу? Текущая партия не сохранится.`,"confirm.drawRestart":`Сдача по {n} применяется к новой раздаче.

Начать текущую партию заново с этим режимом?
(Отмена — режим включится со следующей раздачи)`,"help.title":`Что это?`,"help.draw":`Сколько карт открывается из колоды за одно нажатие. По одной — легче: доступна каждая карта. По три — сложнее и по-классически: играть можно только верхнюю из тройки.`,"help.vegas":`Счёт по-казиношному: старт с −52 (как будто купил колоду по доллару за карту), +5 за каждую карту, доехавшую до фундамента. Бонусы за время и комбо отключаются. Задача — выйти в плюс.`,"help.seed":`У каждой раздачи есть номер — он виден на паузе. Введите номер, чтобы сыграть ровно тот же расклад ещё раз или поделиться им с другом.`,"help.leftHanded":`Зеркалит стол: колода и сброс переезжают под левую руку.`,"help.parallax":`Стол слегка покачивается вслед за курсором. Можно выключить, если это отвлекает или тяжело слабому устройству.`,"help.bloom":`Мягкое свечение вокруг ярких мест. Красиво, но нагружает слабые устройства.`,"help.vegasChip":`Идёт партия в режиме «Вегас»`,"hud.mute":`Выключить звук`,"hud.unmute":`Включить звук`,"royal.title":`Пустая клетка ждёт короля`,"royal.body":`По правилам на пустую клетку встаёт только король. Но королевская стража может расчистить место для любой карты — за просмотр рекламы.`,"royal.watch":`Смотреть рекламу — расчистить клетку`,"royal.later":`Не сейчас`,"royal.left":`Осталось помощей: {n}`,"royal.spent":`Стража расчистила клетку`,"royal.none":`Помощь в этой партии закончилась`,"royal.failed":`Ролик не показался — помощь не потрачена`,"title.1":`Новобранец`,"title.3":`Оруженосец`,"title.6":`Рыцарь колоды`,"title.10":`Барон масти`,"title.15":`Граф фундаментов`,"title.21":`Герцог косынки`,"title.28":`Хранитель короны`,"title.36":`Легенда арены`,"arena.yard.name":`Тренировочный двор`,"arena.yard.sub":`Тут учат держать карту крепко`,"arena.grove.name":`Гоблинская роща`,"arena.grove.sub":`Мелкие пакостники считают ваши очки`,"arena.bazaar.name":`Песчаный базар`,"arena.bazaar.sub":`Здесь торгуются даже за туза`,"arena.bones.name":`Костяная яма`,"arena.bones.sub":`Три карты за раз — и ни одной лишней`,"arena.royal.name":`Королевская арена`,"arena.royal.sub":`Тут смотрит сам двор — и часы тикают`,"arena.frost.name":`Ледяная крепость`,"arena.frost.sub":`Отмен мало — думай до хода`,"arena.guild.name":`Дубовая гильдия`,"arena.guild.sub":`Считают каждый ход, как медяк`,"arena.legend.name":`Легендарная арена`,"arena.legend.sub":`Всё сразу: три карты, часы и ни одной отмены`,"match.yard-1":`Первый разогрев`,"match.yard-2":`Ровный строй`,"match.yard-3":`Смотр гвардии`,"match.grove-1":`Грибной дозор`,"match.grove-2":`Тропа плутов`,"match.grove-3":`Роща шумит`,"match.grove-4":`Королева грибов`,"match.bazaar-1":`Утренний торг`,"match.bazaar-2":`Караван идёт`,"match.bazaar-3":`Золото под навесом`,"match.bazaar-4":`Ночная сделка`,"match.bones-1":`Скрип костей`,"match.bones-2":`Три черепа`,"match.bones-3":`Эхо ямы`,"match.bones-4":`Хозяин ямы`,"match.royal-1":`Выход ко двору`,"match.royal-2":`Танец мастей`,"match.royal-3":`Королевский темп`,"match.royal-4":`Аплодисменты`,"match.royal-5":`Коронный ход`,"match.frost-1":`Первый мороз`,"match.frost-2":`Трещины во льду`,"match.frost-3":`Стужа`,"match.frost-4":`Ледяной трон`,"match.guild-1":`Приёмный день`,"match.guild-2":`Счётная палата`,"match.guild-3":`Ревизия`,"match.guild-4":`Печать гильдии`,"match.legend-1":`Испытание светом`,"match.legend-2":`Испытание счётом`,"match.legend-3":`Испытание временем`,"match.legend-4":`Испытание волей`,"match.legend-5":`Корона легенды`,"cosmetic.back.royal":`Королевская`,"cosmetic.back.forest":`Гоблинская роща`,"cosmetic.back.ember":`Уголёк`,"cosmetic.back.frost":`Ледяная`,"cosmetic.back.bone":`Костяная яма`,"cosmetic.back.legend":`Легендарная`,"cosmetic.table.green-felt":`Тренировочное сукно`,"cosmetic.table.grove":`Гоблинская роща`,"cosmetic.table.bone-pit":`Костяная яма`,"cosmetic.table.royal-carpet":`Королевский ковёр`,"cosmetic.table.frost":`Ледяная крепость`,"cosmetic.table.desert":`Песчаный двор`,"cosmetic.table.oak":`Дубовый стол`,"cosmetic.table.legend":`Легендарная арена`,"cosmetic.mascot.badger":`Барсук-Гвардеец`,"cosmetic.mascot.fox":`Лисёнок-Герольд`,"cosmetic.mascot.dragon":`Дракончик-Казначей`,"cosmetic.emote.crown":`Корона`,"cosmetic.emote.laugh":`Хохот`,"cosmetic.emote.wow":`Ого!`,"cosmetic.emote.sleep":`Скукота`,"cosmetic.emote.fire":`Огонь`,"menu.leaderboard":`Рейтинг`,"leaderboard.title":`Таблица лидеров`,"leaderboard.bestScore":`Лучший счёт`,"leaderboard.crowns":`Короны`,"leaderboard.you":`Вы`,"leaderboard.loading":`Загружаем…`,"leaderboard.empty":`Пока пусто — сыграйте партию, и ваш результат появится здесь`,"leaderboard.unavailable":`Таблица сейчас недоступна — попробуйте позже`,"leaderboard.loginHint":`Чтобы попасть в таблицу и видеть своё место, нужно войти через Яндекс`,"leaderboard.login":`Войти через Яндекс`,"leaderboard.hidden":`Игрок скрыт`,"leaderboard.yourRank":`Ваше место: {n}`},Cm={"game.title":`Royal`,"game.title2":`Klondike`,"menu.play":`Play`,"menu.continue":`Continue`,"menu.arenas":`Arenas`,"menu.profile":`Profile`,"menu.settings":`Settings`,"menu.shop":`Shop`,"menu.quickPlay":`Quick game`,"common.back":`Back`,"common.close":`Close`,"common.ok":`OK`,"common.cancel":`Cancel`,"common.locked":`Locked`,"common.crowns":`crowns`,"common.coins":`coins`,"common.seed":`Deal`,"common.yes":`Yes`,"common.no":`No`,"hud.score":`Score`,"hud.time":`Time`,"hud.moves":`Moves`,"hud.undo":`Undo`,"hud.hint":`Hint`,"hud.newDeal":`New`,"hud.collect":`Collect!`,"hud.menu":`Menu`,"hud.goal":`Goal`,"hud.finish":`Finish`,"hud.combo":`Combo ×{n}`,"pause.title":`Paused`,"pause.resume":`Resume`,"pause.restart":`Restart`,"pause.newDeal":`New deal`,"pause.toMenu":`Main menu`,"result.win":`Victory!`,"result.lose":`Game over`,"result.score":`Score`,"result.timeBonus":`Time bonus`,"result.comboBonus":`Combo bonus`,"result.total":`Total`,"result.crowns":`Crowns`,"result.coins":`Coins`,"result.again":`Again`,"result.next":`Next`,"result.toArenas":`Arenas`,"chest.title":`Reward`,"chest.tap":`Tap to open`,"chest.duplicate":`Duplicate → coins`,"chest.wood":`Wooden chest`,"chest.gold":`Golden chest`,"chest.legendary":`Legendary chest`,"arenas.title":`Arenas`,"arenas.needCrowns":`Crowns needed: {n}`,"arenas.matches":`Matches`,"arenas.drawMode":`draw {n}`,"profile.title":`Profile`,"profile.defaultName":`Player`,"profile.level":`Level`,"profile.wins":`Wins`,"profile.losses":`Losses`,"profile.bestTime":`Best time`,"profile.bestScore":`Best score`,"profile.longestCombo":`Longest combo`,"profile.streak":`Win streak`,"profile.played":`Games`,"profile.cards":`Cards to foundations`,"profile.cosmetics":`Cosmetics`,"settings.title":`Settings`,"settings.draw":`Draw from stock`,"settings.draw1":`1 card`,"settings.draw3":`3 cards`,"settings.music":`Music`,"settings.sfx":`Sound`,"settings.shadows":`Shadows`,"settings.bloom":`Glow`,"settings.animSpeed":`Animation speed`,"settings.leftHanded":`Left-handed`,"settings.parallax":`Camera parallax`,"settings.vegas":`Vegas mode`,"settings.drawLocked":`In an arena match the draw mode is fixed by the arena`,"toast.noMoves":`No moves — recycle the stock`,"toast.drawStock":`Nothing useful on the table — turn a card from the stock`,"toast.undoLimit":`No undos left in this arena`,"toast.noHint":`No more hints`,"toast.saved":`Game saved`,"toast.newRecord":`New record!`,"toast.levelUp":`Level {n}!`,"toast.unlocked":`Arena "{name}" unlocked`,"toast.goalDone":`Goal reached! You may finish the match`,"toast.bloomOff":`Glow turned off — the device was struggling. You can turn it back on in Settings`,"toast.shadowsOff":`Shadows turned off — the device was struggling. You can turn them back on in Settings`,"toast.drawApplied":`Draw {n} — the deal restarted`,"toast.drawNextDeal":`Draw {n} — from the next deal on`,"toast.unverifiedSeed":`Deal #{n} was entered by hand — it may not be solvable`,"toast.saveFailed":`Cannot save progress — the browser storage is full`,"toast.mascotEquipped":`{name} joined the table`,"toast.cloudSync":`Progress restored from the cloud`,"seed.enter":`Deal number`,"seed.play":`Play this deal`,"shop.title":`Shop`,"shop.buy":`Buy`,"shop.owned":`Owned`,"shop.equip":`Equip`,"shop.equipped":`Equipped`,"shop.notEnough":`Not enough coins`,"shop.mascotHint":`The mascot takes a seat beside the table`,"shop.cat.back":`Card backs`,"shop.cat.backDesc":`Change the picture on the back of the cards — seen on face-down cards and the stock.`,"shop.cat.table":`Table cloth`,"shop.cat.tableDesc":`Changes the colour and pattern of the table under the cards.`,"shop.cat.mascot":`Mascots`,"shop.cat.mascotDesc":`Little supporters beside the table. There are three seats — all three can be filled.`,"shop.cat.emote":`Victory emotes`,"shop.cat.emoteDesc":`The big sticker that flies onto the screen when the game is won.`,"shop.premiumHint":`Special item for real money: yours forever, priced in the platform currency`,"shop.unavailableTitle":`Purchase unavailable`,"shop.unavailable":`The shop could not get the product list from the platform: purchases are not connected yet or there is no connection. Please try again later.`,"shop.purchased":`Purchase complete: {name} is now yours`,"shop.purchaseFailed":`Purchase not completed — nothing was charged`,"shop.restored":`Paid purchase restored: {name}`,"cosmetics.backs":`Card backs`,"cosmetics.tables":`Tables`,"cosmetics.mascots":`Mascots`,"cosmetics.emotes":`Emotes`,"rarity.common":`common`,"rarity.rare":`rare`,"rarity.legendary":`legendary`,"goal.win":`Clear the tableau`,"goal.score":`Score {n} points`,"goal.time":`Finish within {t}`,"goal.noUndo":`No undos`,"goal.combo":`Combo ×{n}`,"goal.moves":`At most {n} moves`,"goal.foundation":`{n} cards on foundations`,"confirm.title":`Are you sure?`,"confirm.restart":`Restart this same deal? The current progress will be lost.`,"confirm.newDeal":`Take a new deal? The current game will not be saved.`,"confirm.drawRestart":`Draw {n} applies to a new deal.

Restart the current game with this mode?
(Cancel — it will apply from the next deal)`,"help.title":`What is this?`,"help.draw":`How many cards the stock turns over at once. Draw 1 is easier — every card is reachable. Draw 3 is the classic, harder mode: only the top of each triple is playable.`,"help.vegas":`Casino scoring: you start at −52 (as if you bought the deck at a dollar a card) and get +5 for every card that reaches a foundation. Time and combo bonuses are off. The goal is to end up in the black.`,"help.seed":`Every deal has a number — you can see it on the pause screen. Type a number to replay exactly that layout or share it with a friend.`,"help.leftHanded":`Mirrors the table: stock and waste move under your left hand.`,"help.parallax":`The table tilts slightly as you move the cursor. Turn it off if it distracts you or is heavy for a weak device.`,"help.bloom":`Soft glow around bright spots. Pretty, but heavy on weak devices.`,"help.vegasChip":`This game is running in Vegas mode`,"hud.mute":`Mute`,"hud.unmute":`Unmute`,"royal.title":`The empty slot awaits a king`,"royal.body":`By the rules only a king may take an empty slot. But the royal guard can clear the way for any card — for watching an ad.`,"royal.watch":`Watch an ad — clear the slot`,"royal.later":`Not now`,"royal.left":`Royal help left: {n}`,"royal.spent":`The guard cleared the slot`,"royal.none":`No royal help left in this game`,"royal.failed":`The video did not play — nothing was spent`,"title.1":`Recruit`,"title.3":`Squire`,"title.6":`Knight of the Deck`,"title.10":`Baron of Suits`,"title.15":`Count of Foundations`,"title.21":`Duke of Klondike`,"title.28":`Keeper of the Crown`,"title.36":`Legend of the Arena`,"arena.yard.name":`Training Yard`,"arena.yard.sub":`Where you learn to hold a card tight`,"arena.grove.name":`Goblin Grove`,"arena.grove.sub":`Little pests are counting your points`,"arena.bazaar.name":`Sandy Bazaar`,"arena.bazaar.sub":`They haggle even over an ace here`,"arena.bones.name":`Bone Pit`,"arena.bones.sub":`Three cards at a time — and not one to spare`,"arena.royal.name":`Royal Arena`,"arena.royal.sub":`The court is watching — and the clock is ticking`,"arena.frost.name":`Ice Fortress`,"arena.frost.sub":`Few undos — think before you move`,"arena.guild.name":`Oak Guild`,"arena.guild.sub":`Every move is counted like a copper coin`,"arena.legend.name":`Legendary Arena`,"arena.legend.sub":`All at once: three cards, the clock and no undos`,"match.yard-1":`First Warm-up`,"match.yard-2":`Straight Ranks`,"match.yard-3":`Guard Parade`,"match.grove-1":`Mushroom Watch`,"match.grove-2":`Tricksters' Trail`,"match.grove-3":`The Grove Rustles`,"match.grove-4":`Queen of Mushrooms`,"match.bazaar-1":`Morning Bargain`,"match.bazaar-2":`The Caravan Moves`,"match.bazaar-3":`Gold Under the Awning`,"match.bazaar-4":`Night Deal`,"match.bones-1":`Creaking Bones`,"match.bones-2":`Three Skulls`,"match.bones-3":`Echo of the Pit`,"match.bones-4":`Master of the Pit`,"match.royal-1":`Presented at Court`,"match.royal-2":`Dance of Suits`,"match.royal-3":`Royal Tempo`,"match.royal-4":`Applause`,"match.royal-5":`The Crowning Move`,"match.frost-1":`First Frost`,"match.frost-2":`Cracks in the Ice`,"match.frost-3":`Bitter Cold`,"match.frost-4":`Ice Throne`,"match.guild-1":`Open Day`,"match.guild-2":`Counting House`,"match.guild-3":`The Audit`,"match.guild-4":`Seal of the Guild`,"match.legend-1":`Trial of Light`,"match.legend-2":`Trial of Score`,"match.legend-3":`Trial of Time`,"match.legend-4":`Trial of Will`,"match.legend-5":`Crown of Legend`,"cosmetic.back.royal":`Royal`,"cosmetic.back.forest":`Goblin Grove`,"cosmetic.back.ember":`Ember`,"cosmetic.back.frost":`Frost`,"cosmetic.back.bone":`Bone Pit`,"cosmetic.back.legend":`Legendary`,"cosmetic.table.green-felt":`Training felt`,"cosmetic.table.grove":`Goblin Grove`,"cosmetic.table.bone-pit":`Bone Pit`,"cosmetic.table.royal-carpet":`Royal carpet`,"cosmetic.table.frost":`Ice Fortress`,"cosmetic.table.desert":`Sandy yard`,"cosmetic.table.oak":`Oak table`,"cosmetic.table.legend":`Legendary Arena`,"cosmetic.mascot.badger":`Badger the Guard`,"cosmetic.mascot.fox":`Fox the Herald`,"cosmetic.mascot.dragon":`Dragon the Treasurer`,"cosmetic.emote.crown":`Crown`,"cosmetic.emote.laugh":`Laughter`,"cosmetic.emote.wow":`Wow!`,"cosmetic.emote.sleep":`Boring`,"cosmetic.emote.fire":`Fire`,"menu.leaderboard":`Ranking`,"leaderboard.title":`Leaderboard`,"leaderboard.bestScore":`Best score`,"leaderboard.crowns":`Crowns`,"leaderboard.you":`You`,"leaderboard.loading":`Loading…`,"leaderboard.empty":`Nothing here yet — play a game and your result will appear`,"leaderboard.unavailable":`The leaderboard is unavailable right now — try again later`,"leaderboard.loginHint":`To get on the leaderboard and see your rank, sign in with Yandex`,"leaderboard.login":`Sign in with Yandex`,"leaderboard.hidden":`Hidden player`,"leaderboard.yourRank":`Your rank: {n}`},wm={"game.title":`Royal`,"game.title2":`Klondike`,"menu.play":`Oyna`,"menu.continue":`Devam et`,"menu.arenas":`Arenalar`,"menu.profile":`Profil`,"menu.settings":`Ayarlar`,"menu.shop":`Dükkân`,"menu.quickPlay":`Hızlı oyun`,"common.back":`Geri`,"common.close":`Kapat`,"common.ok":`Tamam`,"common.cancel":`İptal`,"common.locked":`Kilitli`,"common.crowns":`taç`,"common.coins":`altın`,"common.seed":`Dağıtım`,"common.yes":`Evet`,"common.no":`Hayır`,"hud.score":`Puan`,"hud.time":`Süre`,"hud.moves":`Hamle`,"hud.undo":`Geri al`,"hud.hint":`İpucu`,"hud.newDeal":`Yeni`,"hud.collect":`Topla!`,"hud.menu":`Menü`,"hud.goal":`Hedef`,"hud.finish":`Bitir`,"hud.combo":`Kombo ×{n}`,"pause.title":`Duraklatıldı`,"pause.resume":`Devam`,"pause.restart":`Yeniden başlat`,"pause.newDeal":`Yeni dağıtım`,"pause.toMenu":`Ana menü`,"result.win":`Zafer!`,"result.lose":`Oyun bitti`,"result.score":`Puan`,"result.timeBonus":`Süre bonusu`,"result.comboBonus":`Kombo bonusu`,"result.total":`Toplam`,"result.crowns":`Taçlar`,"result.coins":`Altın`,"result.again":`Tekrar`,"result.next":`İleri`,"result.toArenas":`Arenalar`,"chest.title":`Ödül`,"chest.tap":`Açmak için dokun`,"chest.duplicate":`Tekrar → altın`,"chest.wood":`Tahta sandık`,"chest.gold":`Altın sandık`,"chest.legendary":`Efsanevi sandık`,"arenas.title":`Arenalar`,"arenas.needCrowns":`Gereken taç: {n}`,"arenas.matches":`Maçlar`,"arenas.drawMode":`{n} kart çek`,"profile.title":`Profil`,"profile.defaultName":`Oyuncu`,"profile.level":`Seviye`,"profile.wins":`Galibiyet`,"profile.losses":`Mağlubiyet`,"profile.bestTime":`En iyi süre`,"profile.bestScore":`En iyi puan`,"profile.longestCombo":`En uzun kombo`,"profile.streak":`Galibiyet serisi`,"profile.played":`Oyun`,"profile.cards":`Temele giden kart`,"profile.cosmetics":`Kozmetik`,"settings.title":`Ayarlar`,"settings.draw":`Desteden çekme`,"settings.draw1":`1 kart`,"settings.draw3":`3 kart`,"settings.music":`Müzik`,"settings.sfx":`Sesler`,"settings.shadows":`Gölgeler`,"settings.bloom":`Parıltı`,"settings.animSpeed":`Animasyon hızı`,"settings.leftHanded":`Solak modu`,"settings.parallax":`Kamera paralaksı`,"settings.vegas":`Vegas modu`,"settings.drawLocked":`Arena maçında çekme modunu arena belirler`,"toast.noMoves":`Hamle yok — desteyi yeniden çevirin`,"toast.drawStock":`Masada işe yarar hamle yok — desteden kart çekin`,"toast.undoLimit":`Bu arenada geri alma hakkı kalmadı`,"toast.noHint":`İpucu kalmadı`,"toast.saved":`Oyun kaydedildi`,"toast.newRecord":`Yeni rekor!`,"toast.levelUp":`Seviye {n}!`,"toast.unlocked":`“{name}” arenası açıldı`,"toast.goalDone":`Hedefe ulaşıldı! Maçı bitirebilirsiniz`,"toast.bloomOff":`Parıltı kapatıldı — cihaz zorlanıyordu. Ayarlardan geri açabilirsiniz`,"toast.shadowsOff":`Gölgeler kapatıldı — cihaz zorlanıyordu. Ayarlardan geri açabilirsiniz`,"toast.drawApplied":`{n} kart çekme — dağıtım yeniden başladı`,"toast.drawNextDeal":`{n} kart çekme — bir sonraki dağıtımdan itibaren`,"toast.unverifiedSeed":`#{n} dağıtımı elle girildi — çözülemeyebilir`,"toast.saveFailed":`İlerleme kaydedilemiyor — tarayıcı depolama alanı dolu`,"toast.mascotEquipped":`{name} masaya oturdu`,"toast.cloudSync":`İlerleme buluttan alındı`,"seed.enter":`Dağıtım numarası`,"seed.play":`Bu dağıtımı oyna`,"shop.title":`Dükkân`,"shop.buy":`Satın al`,"shop.owned":`Sizin`,"shop.equip":`Kuşan`,"shop.equipped":`Kuşanıldı`,"shop.notEnough":`Yeterli altın yok`,"shop.mascotHint":`Maskot masanın yanına oturur`,"shop.cat.back":`Kart arkaları`,"shop.cat.backDesc":`Kartların arkasındaki resmi değiştirir — kapalı kartlarda ve destede görünür.`,"shop.cat.table":`Masa örtüsü`,"shop.cat.tableDesc":`Kartların altındaki masanın rengini ve desenini değiştirir.`,"shop.cat.mascot":`Maskotlar`,"shop.cat.mascotDesc":`Masanın yanındaki küçük taraftarlar. Üç yer var — üçü de dolabilir.`,"shop.cat.emote":`Zafer ifadeleri`,"shop.cat.emoteDesc":`Oyun kazanıldığında ekrana uçan büyük çıkartma.`,"shop.premiumHint":`Gerçek parayla özel eşya: sonsuza dek sizin, fiyat platform para birimiyle`,"shop.unavailableTitle":`Satın alma kullanılamıyor`,"shop.unavailable":`Dükkân platformdan ürün listesini alamadı: satın almalar henüz bağlı değil ya da bağlantı yok. Lütfen daha sonra tekrar deneyin.`,"shop.purchased":`Satın alma tamamlandı: {name} artık sizin`,"shop.purchaseFailed":`Satın alma tamamlanmadı — ücret alınmadı`,"shop.restored":`Ödenmiş satın alma geri yüklendi: {name}`,"cosmetics.backs":`Kart arkaları`,"cosmetics.tables":`Masalar`,"cosmetics.mascots":`Maskotlar`,"cosmetics.emotes":`İfadeler`,"rarity.common":`sıradan`,"rarity.rare":`nadir`,"rarity.legendary":`efsanevi`,"goal.win":`Oyunu tamamla`,"goal.score":`{n} puan topla`,"goal.time":`{t} içinde bitir`,"goal.noUndo":`Geri almadan`,"goal.combo":`Kombo ×{n}`,"goal.moves":`En fazla {n} hamle`,"goal.foundation":`Temellerde {n} kart`,"confirm.title":`Emin misiniz?`,"confirm.restart":`Aynı dağıtıma yeniden başlansın mı? Mevcut ilerleme kaybolacak.`,"confirm.newDeal":`Yeni dağıtım alınsın mı? Mevcut oyun kaydedilmeyecek.`,"confirm.drawRestart":`{n} kart çekme yeni dağıtımda geçerli olur.

Mevcut oyun bu modla yeniden başlatılsın mı?
(İptal — bir sonraki dağıtımdan itibaren geçerli olur)`,"help.title":`Bu ne?`,"help.draw":`Desteden bir seferde kaç kart açılacağı. 1 kart daha kolaydır: her karta ulaşılabilir. 3 kart klasik ve daha zor moddur: üçlünün yalnızca üstteki kartı oynanabilir.`,"help.vegas":`Kumarhane puanlaması: −52 ile başlarsınız (desteyi kart başına bir dolara almış gibi), temele giden her kart +5 verir. Süre ve kombo bonusları kapalıdır. Amaç: artıya çıkmak.`,"help.seed":`Her dağıtımın bir numarası vardır — duraklatma ekranında görünür. Aynı dizilimi tekrar oynamak ya da bir arkadaşınızla paylaşmak için numarayı girin.`,"help.leftHanded":`Masayı aynalar: deste ve atma yığını sol elin altına geçer.`,"help.parallax":`İmleci hareket ettirdikçe masa hafifçe eğilir. Dikkat dağıtıyorsa veya zayıf bir cihazı zorluyorsa kapatabilirsiniz.`,"help.bloom":`Parlak noktaların çevresinde yumuşak parıltı. Güzel ama zayıf cihazları zorlar.`,"help.vegasChip":`Bu oyun Vegas modunda`,"hud.mute":`Sesi kapat`,"hud.unmute":`Sesi aç`,"royal.title":`Boş yer bir papaz bekliyor`,"royal.body":`Kurallara göre boş yere yalnızca papaz gelebilir. Ama kraliyet muhafızları, bir reklam izlemeniz karşılığında herhangi bir kart için yer açabilir.`,"royal.watch":`Reklam izle — yeri aç`,"royal.later":`Şimdi değil`,"royal.left":`Kalan yardım: {n}`,"royal.spent":`Muhafızlar yeri açtı`,"royal.none":`Bu oyunda yardım kalmadı`,"royal.failed":`Video oynatılamadı — hiçbir şey harcanmadı`,"title.1":`Acemi`,"title.3":`Silahtar`,"title.6":`Deste Şövalyesi`,"title.10":`Renklerin Baronu`,"title.15":`Temellerin Kontu`,"title.21":`Klondike Dükü`,"title.28":`Tacın Koruyucusu`,"title.36":`Arena Efsanesi`,"arena.yard.name":`Talim avlusu`,"arena.yard.sub":`Burada kartı sıkı tutmayı öğrenirsiniz`,"arena.grove.name":`Goblin korusu`,"arena.grove.sub":`Küçük yaramazlar puanınızı sayıyor`,"arena.bazaar.name":`Kum pazarı`,"arena.bazaar.sub":`Burada as için bile pazarlık edilir`,"arena.bones.name":`Kemik çukuru`,"arena.bones.sub":`Bir seferde üç kart — bir tane bile fazla değil`,"arena.royal.name":`Kraliyet arenası`,"arena.royal.sub":`Saray izliyor — ve saat işliyor`,"arena.frost.name":`Buz kalesi`,"arena.frost.sub":`Geri alma az — hamleden önce düşün`,"arena.guild.name":`Meşe loncası`,"arena.guild.sub":`Her hamleyi bakır para gibi sayarlar`,"arena.legend.name":`Efsanevi arena`,"arena.legend.sub":`Hepsi bir arada: üç kart, saat ve sıfır geri alma`,"match.yard-1":`İlk ısınma`,"match.yard-2":`Düzgün saflar`,"match.yard-3":`Muhafız geçidi`,"match.grove-1":`Mantar nöbeti`,"match.grove-2":`Düzenbazlar yolu`,"match.grove-3":`Koru hışırdıyor`,"match.grove-4":`Mantar kraliçesi`,"match.bazaar-1":`Sabah pazarlığı`,"match.bazaar-2":`Kervan geçiyor`,"match.bazaar-3":`Tente altında altın`,"match.bazaar-4":`Gece anlaşması`,"match.bones-1":`Kemik gıcırtısı`,"match.bones-2":`Üç kurukafa`,"match.bones-3":`Çukurun yankısı`,"match.bones-4":`Çukurun efendisi`,"match.royal-1":`Saraya takdim`,"match.royal-2":`Renklerin dansı`,"match.royal-3":`Kraliyet temposu`,"match.royal-4":`Alkış`,"match.royal-5":`Taç hamlesi`,"match.frost-1":`İlk ayaz`,"match.frost-2":`Buzdaki çatlaklar`,"match.frost-3":`Dondurucu soğuk`,"match.frost-4":`Buz tahtı`,"match.guild-1":`Kabul günü`,"match.guild-2":`Hesap odası`,"match.guild-3":`Denetim`,"match.guild-4":`Lonca mührü`,"match.legend-1":`Işık sınavı`,"match.legend-2":`Puan sınavı`,"match.legend-3":`Zaman sınavı`,"match.legend-4":`İrade sınavı`,"match.legend-5":`Efsanenin tacı`,"cosmetic.back.royal":`Kraliyet`,"cosmetic.back.forest":`Goblin korusu`,"cosmetic.back.ember":`Kor`,"cosmetic.back.frost":`Ayaz`,"cosmetic.back.bone":`Kemik çukuru`,"cosmetic.back.legend":`Efsanevi`,"cosmetic.table.green-felt":`Talim çuhası`,"cosmetic.table.grove":`Goblin korusu`,"cosmetic.table.bone-pit":`Kemik çukuru`,"cosmetic.table.royal-carpet":`Kraliyet halısı`,"cosmetic.table.frost":`Buz kalesi`,"cosmetic.table.desert":`Kum avlusu`,"cosmetic.table.oak":`Meşe masa`,"cosmetic.table.legend":`Efsanevi arena`,"cosmetic.mascot.badger":`Muhafız Porsuk`,"cosmetic.mascot.fox":`Haberci Tilki`,"cosmetic.mascot.dragon":`Hazineci Ejder`,"cosmetic.emote.crown":`Taç`,"cosmetic.emote.laugh":`Kahkaha`,"cosmetic.emote.wow":`Vay!`,"cosmetic.emote.sleep":`Sıkıcı`,"cosmetic.emote.fire":`Ateş`,"menu.leaderboard":`Sıralama`,"leaderboard.title":`Liderlik tablosu`,"leaderboard.bestScore":`En iyi puan`,"leaderboard.crowns":`Taçlar`,"leaderboard.you":`Siz`,"leaderboard.loading":`Yükleniyor…`,"leaderboard.empty":`Henüz boş — bir oyun oynayın, sonucunuz burada görünecek`,"leaderboard.unavailable":`Tablo şu anda kullanılamıyor — daha sonra tekrar deneyin`,"leaderboard.loginHint":`Tabloya girmek ve yerinizi görmek için Yandex ile giriş yapın`,"leaderboard.login":`Yandex ile giriş yap`,"leaderboard.hidden":`Gizli oyuncu`,"leaderboard.yourRank":`Yeriniz: {n}`},Tm={"game.title":`Королевская`,"game.title2":`Косынка`,"menu.play":`Ойнау`,"menu.continue":`Жалғастыру`,"menu.arenas":`Арена`,"menu.profile":`Профиль`,"menu.settings":`Баптаулар`,"menu.shop":`Дүкен`,"menu.quickPlay":`Жылдам ойын`,"common.back":`Артқа`,"common.close":`Жабу`,"common.ok":`Жарайды`,"common.cancel":`Болдырмау`,"common.locked":`Жабық`,"common.crowns":`тәж`,"common.coins":`тиын`,"common.seed":`Тарату`,"common.yes":`Иә`,"common.no":`Жоқ`,"hud.score":`Ұпай`,"hud.time":`Уақыт`,"hud.moves":`Жүріс`,"hud.undo":`Қайтару`,"hud.hint":`Кеңес`,"hud.newDeal":`Жаңа`,"hud.collect":`Жинау!`,"hud.menu":`Мәзір`,"hud.goal":`Мақсат`,"hud.finish":`Аяқтау`,"hud.combo":`Комбо ×{n}`,"pause.title":`Үзіліс`,"pause.resume":`Жалғастыру`,"pause.restart":`Қайта бастау`,"pause.newDeal":`Жаңа тарату`,"pause.toMenu":`Мәзірге`,"result.win":`Жеңіс!`,"result.lose":`Ойын аяқталды`,"result.score":`Ұпай`,"result.timeBonus":`Уақыт бонусы`,"result.comboBonus":`Комбо бонусы`,"result.total":`Барлығы`,"result.crowns":`Тәждер`,"result.coins":`Тиындар`,"result.again":`Тағы`,"result.next":`Әрі қарай`,"result.toArenas":`Аренаға`,"chest.title":`Сыйлық`,"chest.tap":`Ашу үшін бас`,"chest.duplicate":`Қайталау → тиын`,"chest.wood":`Ағаш сандық`,"chest.gold":`Алтын сандық`,"chest.legendary":`Аңызға айналған сандық`,"arenas.title":`Арена`,"arenas.needCrowns":`Керек тәж: {n}`,"arenas.matches":`Матчтар`,"arenas.drawMode":`{n} картадан тарату`,"profile.title":`Профиль`,"profile.defaultName":`Ойыншы`,"profile.level":`Деңгей`,"profile.wins":`Жеңіс`,"profile.losses":`Жеңіліс`,"profile.bestTime":`Үздік уақыт`,"profile.bestScore":`Үздік ұпай`,"profile.longestCombo":`Ең ұзақ комбо`,"profile.streak":`Жеңіс сериясы`,"profile.played":`Ойындар`,"profile.cards":`Негізге барған карта`,"profile.cosmetics":`Косметика`,"settings.title":`Баптаулар`,"settings.draw":`Колодадан тарату`,"settings.draw1":`1 карта`,"settings.draw3":`3 карта`,"settings.music":`Музыка`,"settings.sfx":`Дыбыстар`,"settings.shadows":`Көлеңке`,"settings.bloom":`Жарқырау`,"settings.animSpeed":`Анимация жылдамдығы`,"settings.leftHanded":`Солақай режимі`,"settings.parallax":`Камера тербелісі`,"settings.vegas":`«Вегас» режимі`,"settings.drawLocked":`Арена матчында тарату режимін арена өзі белгілейді`,"toast.noMoves":`Жүріс жоқ — колоданы қайта аударыңыз`,"toast.drawStock":`Үстелде пайдалы жүріс жоқ — колодадан карта алыңыз`,"toast.undoLimit":`Бұл аренада қайтару таусылды`,"toast.noHint":`Кеңестер таусылды`,"toast.saved":`Ойын сақталды`,"toast.newRecord":`Жаңа рекорд!`,"toast.levelUp":`{n}-деңгей!`,"toast.unlocked":`«{name}» аренасы ашылды`,"toast.goalDone":`Мақсатқа жеттіңіз! Матчты аяқтауға болады`,"toast.bloomOff":`Жарқырау өшірілді — құрылғыға ауыр болды. Баптаулардан қайта қосуға болады`,"toast.shadowsOff":`Көлеңке өшірілді — құрылғыға ауыр болды. Баптаулардан қайта қосуға болады`,"toast.drawApplied":`{n} картадан тарату — тарату қайта басталды`,"toast.drawNextDeal":`{n} картадан тарату — келесі таратудан бастап`,"toast.unverifiedSeed":`#{n} таратуы қолмен енгізілді — шешілмеуі мүмкін`,"toast.saveFailed":`Прогресс сақталмайды — браузер қоймасы толып кетті`,"toast.mascotEquipped":`{name} үстелге келді`,"toast.cloudSync":`Прогресс бұлттан алынды`,"seed.enter":`Тарату нөмірі`,"seed.play":`Нөмірмен ойнау`,"shop.title":`Дүкен`,"shop.buy":`Сатып алу`,"shop.owned":`Бар`,"shop.equip":`Кию`,"shop.equipped":`Киілген`,"shop.notEnough":`Тиын жетпейді`,"shop.mascotHint":`Тұмар үстелдің жанына отырады`,"shop.cat.back":`Карта сырты`,"shop.cat.backDesc":`Карта сыртындағы суретті өзгертеді — жабық карталарда және колодада көрінеді.`,"shop.cat.table":`Үстел шұғасы`,"shop.cat.tableDesc":`Карталар астындағы үстелдің түсі мен өрнегін өзгертеді.`,"shop.cat.mascot":`Тұмарлар`,"shop.cat.mascotDesc":`Үстел жанындағы кішкентай жанкүйерлер. Үш орын бар — үшеуін де отырғызуға болады.`,"shop.cat.emote":`Жеңіс эмоциялары`,"shop.cat.emoteDesc":`Пасьянс шыққанда экранға ұшып шығатын үлкен стикер.`,"shop.premiumHint":`Ақшаға сатылатын ерекше зат: мәңгі сіздікі, бағасы — алаң валютасында`,"shop.unavailableTitle":`Сатып алу қолжетімсіз`,"shop.unavailable":`Дүкен алаңнан тауар тізімін ала алмады: сатып алулар әлі қосылмаған немесе байланыс жоқ. Кейінірек қайталап көріңіз.`,"shop.purchased":`Сатып алу өтті: {name} енді сіздікі`,"shop.purchaseFailed":`Сатып алу аяқталмады — ештеңе алынған жоқ`,"shop.restored":`Төленген сатып алу қайтарылды: {name}`,"cosmetics.backs":`Карта сырты`,"cosmetics.tables":`Үстелдер`,"cosmetics.mascots":`Тұмарлар`,"cosmetics.emotes":`Эмоциялар`,"rarity.common":`қарапайым`,"rarity.rare":`сирек`,"rarity.legendary":`аңызға айналған`,"goal.win":`Пасьянсты жинау`,"goal.score":`{n} ұпай жинау`,"goal.time":`{t} ішінде үлгеру`,"goal.noUndo":`Қайтарусыз`,"goal.combo":`Комбо ×{n}`,"goal.moves":`Ең көбі {n} жүріс`,"goal.foundation":`Негіздерде {n} карта`,"confirm.title":`Сенімдісіз бе?`,"confirm.restart":`Осы таратуды қайта бастайсыз ба? Ойынның ағымдағы прогресі жоғалады.`,"confirm.newDeal":`Жаңа тарату аласыз ба? Ағымдағы ойын сақталмайды.`,"confirm.drawRestart":`{n} картадан тарату жаңа таратуға қолданылады.

Ағымдағы ойынды осы режиммен қайта бастау керек пе?
(Болдырмау — режим келесі таратудан қосылады)`,"help.title":`Бұл не?`,"help.draw":`Бір басқанда колодадан неше карта ашылады. Біреуден — оңайырақ: әр карта қолжетімді. Үшеуден — қиынырақ және классикалық: үшеудің тек үстіңгісін ойнауға болады.`,"help.vegas":`Казино есебі: −52-ден бастау (колоданы әр картасына бір доллардан сатып алғандай), негізге жеткен әр картаға +5. Уақыт пен комбо бонустары өшіріледі. Мақсат — плюске шығу.`,"help.seed":`Әр таратудың нөмірі бар — ол үзілісте көрінеді. Дәл сол таратуды тағы ойнау немесе досыңызбен бөлісу үшін нөмірді енгізіңіз.`,"help.leftHanded":`Үстелді айналы етеді: колода мен тастама сол қолдың астына көшеді.`,"help.parallax":`Курсорды жылжытқанда үстел сәл тербеледі. Назарды бөлсе немесе әлсіз құрылғыда ауырлатса, өшіруге болады.`,"help.bloom":`Жарық жерлердің айналасындағы жұмсақ жарқырау. Әдемі, бірақ әлсіз құрылғыларға ауыр.`,"help.vegasChip":`Ойын «Вегас» режимінде жүріп жатыр`,"hud.mute":`Дыбысты өшіру`,"hud.unmute":`Дыбысты қосу`,"royal.title":`Бос ұяшық корольді күтеді`,"royal.body":`Ережеге сай бос ұяшыққа тек король тұрады. Бірақ король күзеті жарнама көргеніңіз үшін кез келген картаға орын босата алады.`,"royal.watch":`Жарнама көру — ұяшықты босату`,"royal.later":`Қазір емес`,"royal.left":`Қалған көмек: {n}`,"royal.spent":`Күзет ұяшықты босатты`,"royal.none":`Бұл ойында көмек таусылды`,"royal.failed":`Ролик көрсетілмеді — көмек жұмсалған жоқ`,"title.1":`Жаңа сарбаз`,"title.3":`Қаруланушы`,"title.6":`Колода рыцары`,"title.10":`Масть бароны`,"title.15":`Негіздер графы`,"title.21":`Косынка герцогы`,"title.28":`Тәж сақшысы`,"title.36":`Арена аңызы`,"arena.yard.name":`Жаттығу ауласы`,"arena.yard.sub":`Мұнда картаны берік ұстауды үйретеді`,"arena.grove.name":`Гоблин тоғайы`,"arena.grove.sub":`Ұсақ бұзықтар ұпайыңызды санап отыр`,"arena.bazaar.name":`Құм базары`,"arena.bazaar.sub":`Мұнда тұз үшін де саудаласады`,"arena.bones.name":`Сүйек шұңқыры`,"arena.bones.sub":`Бірден үш карта — біреуі де артық емес`,"arena.royal.name":`Король аренасы`,"arena.royal.sub":`Мұнда сарайдың өзі қарап отыр — сағат та жүріп жатыр`,"arena.frost.name":`Мұз қамалы`,"arena.frost.sub":`Қайтару аз — жүрістен бұрын ойлан`,"arena.guild.name":`Емен гильдиясы`,"arena.guild.sub":`Әр жүрісті мыс тиындай санайды`,"arena.legend.name":`Аңызға айналған арена`,"arena.legend.sub":`Бәрі бірден: үш карта, сағат және бірде-бір қайтару жоқ`,"match.yard-1":`Алғашқы жаттығу`,"match.yard-2":`Тегіс сап`,"match.yard-3":`Гвардия шеруі`,"match.grove-1":`Саңырауқұлақ күзеті`,"match.grove-2":`Қулар соқпағы`,"match.grove-3":`Тоғай сыбдырлайды`,"match.grove-4":`Саңырауқұлақ ханшайымы`,"match.bazaar-1":`Таңғы сауда`,"match.bazaar-2":`Керуен келе жатыр`,"match.bazaar-3":`Шатыр астындағы алтын`,"match.bazaar-4":`Түнгі келісім`,"match.bones-1":`Сүйек сықыры`,"match.bones-2":`Үш бас сүйек`,"match.bones-3":`Шұңқыр жаңғырығы`,"match.bones-4":`Шұңқыр иесі`,"match.royal-1":`Сарайға шығу`,"match.royal-2":`Мастьтер биі`,"match.royal-3":`Король қарқыны`,"match.royal-4":`Қол шапалақтау`,"match.royal-5":`Тәж жүрісі`,"match.frost-1":`Алғашқы аяз`,"match.frost-2":`Мұздағы жарықтар`,"match.frost-3":`Қақаған суық`,"match.frost-4":`Мұз тағы`,"match.guild-1":`Қабылдау күні`,"match.guild-2":`Есеп палатасы`,"match.guild-3":`Тексеріс`,"match.guild-4":`Гильдия мөрі`,"match.legend-1":`Жарық сынағы`,"match.legend-2":`Ұпай сынағы`,"match.legend-3":`Уақыт сынағы`,"match.legend-4":`Ерік сынағы`,"match.legend-5":`Аңыз тәжі`,"cosmetic.back.royal":`Корольдік`,"cosmetic.back.forest":`Гоблин тоғайы`,"cosmetic.back.ember":`Шоқ`,"cosmetic.back.frost":`Мұзды`,"cosmetic.back.bone":`Сүйек шұңқыры`,"cosmetic.back.legend":`Аңызға айналған`,"cosmetic.table.green-felt":`Жаттығу шұғасы`,"cosmetic.table.grove":`Гоблин тоғайы`,"cosmetic.table.bone-pit":`Сүйек шұңқыры`,"cosmetic.table.royal-carpet":`Король кілемі`,"cosmetic.table.frost":`Мұз қамалы`,"cosmetic.table.desert":`Құм ауласы`,"cosmetic.table.oak":`Емен үстел`,"cosmetic.table.legend":`Аңызға айналған арена`,"cosmetic.mascot.badger":`Борсық-Гвардияшы`,"cosmetic.mascot.fox":`Түлкі-Жаршы`,"cosmetic.mascot.dragon":`Айдаһар-Қазынашы`,"cosmetic.emote.crown":`Тәж`,"cosmetic.emote.laugh":`Күлкі`,"cosmetic.emote.wow":`Мәссаған!`,"cosmetic.emote.sleep":`Іш пысады`,"cosmetic.emote.fire":`От`,"menu.leaderboard":`Рейтинг`,"leaderboard.title":`Көшбасшылар кестесі`,"leaderboard.bestScore":`Үздік ұпай`,"leaderboard.crowns":`Тәждер`,"leaderboard.you":`Сіз`,"leaderboard.loading":`Жүктелуде…`,"leaderboard.empty":`Әзірге бос — бір ойын ойнаңыз, нәтижеңіз осында шығады`,"leaderboard.unavailable":`Кесте қазір қолжетімсіз — кейінірек қайталап көріңіз`,"leaderboard.loginHint":`Кестеге кіру және орныңызды көру үшін Яндекс арқылы кіріңіз`,"leaderboard.login":`Яндекс арқылы кіру`,"leaderboard.hidden":`Ойыншы жасырын`,"leaderboard.yourRank":`Сіздің орныңыз: {n}`},Em={"game.title":`Royal`,"game.title2":`Klondike`,"menu.play":`Jogar`,"menu.continue":`Continuar`,"menu.arenas":`Arenas`,"menu.profile":`Perfil`,"menu.settings":`Opções`,"menu.shop":`Loja`,"menu.quickPlay":`Partida rápida`,"common.back":`Voltar`,"common.close":`Fechar`,"common.ok":`OK`,"common.cancel":`Cancelar`,"common.locked":`Bloqueado`,"common.crowns":`coroas`,"common.coins":`moedas`,"common.seed":`Distribuição`,"common.yes":`Sim`,"common.no":`Não`,"hud.score":`Pontos`,"hud.time":`Tempo`,"hud.moves":`Jogadas`,"hud.undo":`Desfazer`,"hud.hint":`Dica`,"hud.newDeal":`Nova`,"hud.collect":`Recolher!`,"hud.menu":`Menu`,"hud.goal":`Objetivo`,"hud.finish":`Terminar`,"hud.combo":`Combo ×{n}`,"pause.title":`Pausa`,"pause.resume":`Continuar`,"pause.restart":`Recomeçar`,"pause.newDeal":`Nova distribuição`,"pause.toMenu":`Menu principal`,"result.win":`Vitória!`,"result.lose":`Fim de jogo`,"result.score":`Pontos`,"result.timeBonus":`Bónus de tempo`,"result.comboBonus":`Bónus de combo`,"result.total":`Total`,"result.crowns":`Coroas`,"result.coins":`Moedas`,"result.again":`De novo`,"result.next":`Seguinte`,"result.toArenas":`Arenas`,"chest.title":`Recompensa`,"chest.tap":`Toque para abrir`,"chest.duplicate":`Repetido → moedas`,"chest.wood":`Baú de madeira`,"chest.gold":`Baú dourado`,"chest.legendary":`Baú lendário`,"arenas.title":`Arenas`,"arenas.needCrowns":`Coroas necessárias: {n}`,"arenas.matches":`Partidas`,"arenas.drawMode":`virar {n}`,"profile.title":`Perfil`,"profile.defaultName":`Jogador`,"profile.level":`Nível`,"profile.wins":`Vitórias`,"profile.losses":`Derrotas`,"profile.bestTime":`Melhor tempo`,"profile.bestScore":`Melhor pontuação`,"profile.longestCombo":`Maior combo`,"profile.streak":`Sequência de vitórias`,"profile.played":`Partidas`,"profile.cards":`Cartas nas fundações`,"profile.cosmetics":`Cosméticos`,"settings.title":`Opções`,"settings.draw":`Virar do monte`,"settings.draw1":`1 carta`,"settings.draw3":`3 cartas`,"settings.music":`Música`,"settings.sfx":`Sons`,"settings.shadows":`Sombras`,"settings.bloom":`Brilho`,"settings.animSpeed":`Velocidade das animações`,"settings.leftHanded":`Modo canhoto`,"settings.parallax":`Paralaxe da câmera`,"settings.vegas":`Modo Vegas`,"settings.drawLocked":`Numa partida de arena, o modo de virar é definido pela arena`,"toast.noMoves":`Sem jogadas — passe o monte de novo`,"toast.drawStock":`Nada útil na mesa — vire uma carta do monte`,"toast.undoLimit":`Já não há desfazer nesta arena`,"toast.noHint":`Não há mais dicas`,"toast.saved":`Partida guardada`,"toast.newRecord":`Novo recorde!`,"toast.levelUp":`Nível {n}!`,"toast.unlocked":`Arena «{name}» desbloqueada`,"toast.goalDone":`Objetivo cumprido! Pode terminar a partida`,"toast.bloomOff":`Brilho desligado — o dispositivo estava a sofrer. Pode voltar a ligar nas opções`,"toast.shadowsOff":`Sombras desligadas — o dispositivo estava a sofrer. Pode voltar a ligar nas opções`,"toast.drawApplied":`Virar {n} — a distribuição recomeçou`,"toast.drawNextDeal":`Virar {n} — a partir da próxima distribuição`,"toast.unverifiedSeed":`Distribuição #{n} inserida à mão — pode não ter solução`,"toast.saveFailed":`Não é possível guardar — o armazenamento do navegador está cheio`,"toast.mascotEquipped":`{name} sentou-se à mesa`,"toast.cloudSync":`Progresso recuperado da nuvem`,"seed.enter":`Número da distribuição`,"seed.play":`Jogar esta distribuição`,"shop.title":`Loja`,"shop.buy":`Comprar`,"shop.owned":`Seu`,"shop.equip":`Equipar`,"shop.equipped":`Equipado`,"shop.notEnough":`Moedas insuficientes`,"shop.mascotHint":`O mascote senta-se ao lado da mesa`,"shop.cat.back":`Versos das cartas`,"shop.cat.backDesc":`Mudam a imagem no verso das cartas — visível nas cartas viradas e no monte.`,"shop.cat.table":`Pano da mesa`,"shop.cat.tableDesc":`Muda a cor e o padrão da mesa sob as cartas.`,"shop.cat.mascot":`Mascotes`,"shop.cat.mascotDesc":`Pequenos adeptos ao lado da mesa. Há três lugares — todos podem ser ocupados.`,"shop.cat.emote":`Emotes de vitória`,"shop.cat.emoteDesc":`O autocolante grande que salta para o ecrã quando a paciência sai.`,"shop.premiumHint":`Item especial por dinheiro real: seu para sempre, preço na moeda da plataforma`,"shop.unavailableTitle":`Compra indisponível`,"shop.unavailable":`A loja não conseguiu obter a lista de produtos da plataforma: as compras ainda não estão ligadas ou não há ligação. Tente mais tarde.`,"shop.purchased":`Compra concluída: {name} agora é seu`,"shop.purchaseFailed":`Compra não concluída — nada foi cobrado`,"shop.restored":`Compra paga recuperada: {name}`,"cosmetics.backs":`Versos`,"cosmetics.tables":`Mesas`,"cosmetics.mascots":`Mascotes`,"cosmetics.emotes":`Emotes`,"rarity.common":`comum`,"rarity.rare":`raro`,"rarity.legendary":`lendário`,"goal.win":`Completar a paciência`,"goal.score":`Fazer {n} pontos`,"goal.time":`Terminar em {t}`,"goal.noUndo":`Sem desfazer`,"goal.combo":`Combo ×{n}`,"goal.moves":`No máximo {n} jogadas`,"goal.foundation":`{n} cartas nas fundações`,"confirm.title":`Tem a certeza?`,"confirm.restart":`Recomeçar esta mesma distribuição? O progresso atual será perdido.`,"confirm.newDeal":`Pegar uma nova distribuição? A partida atual não será guardada.`,"confirm.drawRestart":`Virar {n} aplica-se a uma nova distribuição.

Recomeçar a partida atual com este modo?
(Cancelar — aplica-se a partir da próxima distribuição)`,"help.title":`O que é isto?`,"help.draw":`Quantas cartas o monte vira de cada vez. Virar 1 é mais fácil: todas as cartas ficam ao alcance. Virar 3 é o modo clássico, mais difícil: só a carta de cima de cada trio pode ser jogada.`,"help.vegas":`Pontuação de casino: começa em −52 (como se comprasse o baralho a um dólar por carta) e ganha +5 por cada carta que chega a uma fundação. Bónus de tempo e combo desligados. O objetivo: acabar no positivo.`,"help.seed":`Cada distribuição tem um número — visível na pausa. Escreva um número para jogar exatamente a mesma distribuição ou partilhá-la com um amigo.`,"help.leftHanded":`Espelha a mesa: o monte e o descarte passam para a mão esquerda.`,"help.parallax":`A mesa se inclina levemente ao mover o cursor. Desative se isso distrair ou pesar em um dispositivo fraco.`,"help.bloom":`Brilho suave à volta das zonas claras. Bonito, mas pesado para dispositivos fracos.`,"help.vegasChip":`Esta partida decorre no modo Vegas`,"hud.mute":`Silenciar`,"hud.unmute":`Ligar o som`,"royal.title":`O lugar vazio espera por um rei`,"royal.body":`Pelas regras, só um rei pode ocupar um lugar vazio. Mas a guarda real pode abrir caminho para qualquer carta — em troca de ver um anúncio.`,"royal.watch":`Ver um anúncio — libertar o lugar`,"royal.later":`Agora não`,"royal.left":`Ajudas restantes: {n}`,"royal.spent":`A guarda libertou o lugar`,"royal.none":`Já não há ajuda nesta partida`,"royal.failed":`O vídeo não foi reproduzido — nada foi gasto`,"title.1":`Recruta`,"title.3":`Escudeiro`,"title.6":`Cavaleiro do baralho`,"title.10":`Barão dos naipes`,"title.15":`Conde das fundações`,"title.21":`Duque do Klondike`,"title.28":`Guardião da coroa`,"title.36":`Lenda da arena`,"arena.yard.name":`Pátio de treino`,"arena.yard.sub":`Aqui aprende-se a segurar bem a carta`,"arena.grove.name":`Bosque dos goblins`,"arena.grove.sub":`Uns malandros pequeninos contam os seus pontos`,"arena.bazaar.name":`Bazar de areia`,"arena.bazaar.sub":`Aqui regateia-se até por um ás`,"arena.bones.name":`Fosso de ossos`,"arena.bones.sub":`Três cartas de cada vez — e nenhuma a mais`,"arena.royal.name":`Arena real`,"arena.royal.sub":`A corte está a ver — e o relógio corre`,"arena.frost.name":`Fortaleza de gelo`,"arena.frost.sub":`Poucos desfazer — pense antes de jogar`,"arena.guild.name":`Guilda do carvalho`,"arena.guild.sub":`Contam cada jogada como uma moeda de cobre`,"arena.legend.name":`Arena lendária`,"arena.legend.sub":`Tudo ao mesmo tempo: três cartas, o relógio e nenhum desfazer`,"match.yard-1":`Primeiro aquecimento`,"match.yard-2":`Fileiras direitas`,"match.yard-3":`Parada da guarda`,"match.grove-1":`Vigia dos cogumelos`,"match.grove-2":`Trilho dos trapaceiros`,"match.grove-3":`O bosque sussurra`,"match.grove-4":`Rainha dos cogumelos`,"match.bazaar-1":`Regateio da manhã`,"match.bazaar-2":`A caravana passa`,"match.bazaar-3":`Ouro sob o toldo`,"match.bazaar-4":`Negócio noturno`,"match.bones-1":`Ranger de ossos`,"match.bones-2":`Três caveiras`,"match.bones-3":`Eco do fosso`,"match.bones-4":`Senhor do fosso`,"match.royal-1":`Apresentação na corte`,"match.royal-2":`Dança dos naipes`,"match.royal-3":`Ritmo real`,"match.royal-4":`Aplausos`,"match.royal-5":`A jogada da coroa`,"match.frost-1":`Primeira geada`,"match.frost-2":`Fendas no gelo`,"match.frost-3":`Frio cortante`,"match.frost-4":`Trono de gelo`,"match.guild-1":`Dia aberto`,"match.guild-2":`Câmara das contas`,"match.guild-3":`A auditoria`,"match.guild-4":`Selo da guilda`,"match.legend-1":`Prova da luz`,"match.legend-2":`Prova dos pontos`,"match.legend-3":`Prova do tempo`,"match.legend-4":`Prova da vontade`,"match.legend-5":`Coroa da lenda`,"cosmetic.back.royal":`Real`,"cosmetic.back.forest":`Bosque dos goblins`,"cosmetic.back.ember":`Brasa`,"cosmetic.back.frost":`Geada`,"cosmetic.back.bone":`Fosso de ossos`,"cosmetic.back.legend":`Lendário`,"cosmetic.table.green-felt":`Feltro de treino`,"cosmetic.table.grove":`Bosque dos goblins`,"cosmetic.table.bone-pit":`Fosso de ossos`,"cosmetic.table.royal-carpet":`Tapete real`,"cosmetic.table.frost":`Fortaleza de gelo`,"cosmetic.table.desert":`Pátio de areia`,"cosmetic.table.oak":`Mesa de carvalho`,"cosmetic.table.legend":`Arena lendária`,"cosmetic.mascot.badger":`Texugo, o Guarda`,"cosmetic.mascot.fox":`Raposa, o Arauto`,"cosmetic.mascot.dragon":`Dragão, o Tesoureiro`,"cosmetic.emote.crown":`Coroa`,"cosmetic.emote.laugh":`Gargalhada`,"cosmetic.emote.wow":`Uau!`,"cosmetic.emote.sleep":`Que seca`,"cosmetic.emote.fire":`Fogo`,"menu.leaderboard":`Classificação`,"leaderboard.title":`Classificação`,"leaderboard.bestScore":`Melhor pontuação`,"leaderboard.crowns":`Coroas`,"leaderboard.you":`Você`,"leaderboard.loading":`A carregar…`,"leaderboard.empty":`Ainda vazio — jogue uma partida e o seu resultado aparecerá aqui`,"leaderboard.unavailable":`A classificação não está disponível agora — tente mais tarde`,"leaderboard.loginHint":`Para entrar na classificação e ver a sua posição, inicie sessão com o Yandex`,"leaderboard.login":`Iniciar sessão com o Yandex`,"leaderboard.hidden":`Jogador oculto`,"leaderboard.yourRank":`A sua posição: {n}`},Dm={"game.title":`Royal`,"game.title2":`Klondike`,"menu.play":`Jugar`,"menu.continue":`Continuar`,"menu.arenas":`Arenas`,"menu.profile":`Perfil`,"menu.settings":`Ajustes`,"menu.shop":`Tienda`,"menu.quickPlay":`Partida rápida`,"common.back":`Atrás`,"common.close":`Cerrar`,"common.ok":`Vale`,"common.cancel":`Cancelar`,"common.locked":`Bloqueado`,"common.crowns":`coronas`,"common.coins":`monedas`,"common.seed":`Reparto`,"common.yes":`Sí`,"common.no":`No`,"hud.score":`Puntos`,"hud.time":`Tiempo`,"hud.moves":`Jugadas`,"hud.undo":`Deshacer`,"hud.hint":`Pista`,"hud.newDeal":`Nuevo`,"hud.collect":`¡Recoger!`,"hud.menu":`Menú`,"hud.goal":`Objetivo`,"hud.finish":`Terminar`,"hud.combo":`Combo ×{n}`,"pause.title":`Pausa`,"pause.resume":`Reanudar`,"pause.restart":`Reiniciar`,"pause.newDeal":`Nuevo reparto`,"pause.toMenu":`Menú principal`,"result.win":`¡Victoria!`,"result.lose":`Fin de la partida`,"result.score":`Puntos`,"result.timeBonus":`Bono de tiempo`,"result.comboBonus":`Bono de combo`,"result.total":`Total`,"result.crowns":`Coronas`,"result.coins":`Monedas`,"result.again":`Otra vez`,"result.next":`Siguiente`,"result.toArenas":`Arenas`,"chest.title":`Recompensa`,"chest.tap":`Toca para abrir`,"chest.duplicate":`Repetido → monedas`,"chest.wood":`Cofre de madera`,"chest.gold":`Cofre dorado`,"chest.legendary":`Cofre legendario`,"arenas.title":`Arenas`,"arenas.needCrowns":`Coronas necesarias: {n}`,"arenas.matches":`Partidas`,"arenas.drawMode":`robar {n}`,"profile.title":`Perfil`,"profile.defaultName":`Jugador`,"profile.level":`Nivel`,"profile.wins":`Victorias`,"profile.losses":`Derrotas`,"profile.bestTime":`Mejor tiempo`,"profile.bestScore":`Mejor puntuación`,"profile.longestCombo":`Combo más largo`,"profile.streak":`Racha de victorias`,"profile.played":`Partidas`,"profile.cards":`Cartas en las bases`,"profile.cosmetics":`Cosméticos`,"settings.title":`Ajustes`,"settings.draw":`Robar del mazo`,"settings.draw1":`1 carta`,"settings.draw3":`3 cartas`,"settings.music":`Música`,"settings.sfx":`Sonidos`,"settings.shadows":`Sombras`,"settings.bloom":`Brillo`,"settings.animSpeed":`Velocidad de animación`,"settings.leftHanded":`Modo zurdo`,"settings.parallax":`Paralaje de cámara`,"settings.vegas":`Modo Vegas`,"settings.drawLocked":`En una partida de arena, el modo de robo lo fija la arena`,"toast.noMoves":`No hay jugadas — vuelve a pasar el mazo`,"toast.drawStock":`Nada útil en la mesa — roba una carta del mazo`,"toast.undoLimit":`No quedan deshacer en esta arena`,"toast.noHint":`No quedan pistas`,"toast.saved":`Partida guardada`,"toast.newRecord":`¡Nuevo récord!`,"toast.levelUp":`¡Nivel {n}!`,"toast.unlocked":`Arena «{name}» desbloqueada`,"toast.goalDone":`¡Objetivo cumplido! Puedes terminar la partida`,"toast.bloomOff":`Brillo desactivado — al dispositivo le costaba. Puedes activarlo en Ajustes`,"toast.shadowsOff":`Sombras desactivadas — al dispositivo le costaba. Puedes activarlas en Ajustes`,"toast.drawApplied":`Robar {n} — el reparto empezó de nuevo`,"toast.drawNextDeal":`Robar {n} — desde el próximo reparto`,"toast.unverifiedSeed":`Reparto #{n} introducido a mano — puede no tener solución`,"toast.saveFailed":`No se puede guardar — el almacenamiento del navegador está lleno`,"toast.mascotEquipped":`{name} se sentó a la mesa`,"toast.cloudSync":`Progreso recuperado de la nube`,"seed.enter":`Número de reparto`,"seed.play":`Jugar este reparto`,"shop.title":`Tienda`,"shop.buy":`Comprar`,"shop.owned":`Tuyo`,"shop.equip":`Equipar`,"shop.equipped":`Equipado`,"shop.notEnough":`No hay monedas suficientes`,"shop.mascotHint":`La mascota se sienta junto a la mesa`,"shop.cat.back":`Dorsos de cartas`,"shop.cat.backDesc":`Cambian la imagen del dorso de las cartas — se ve en las cartas boca abajo y en el mazo.`,"shop.cat.table":`Tapete de mesa`,"shop.cat.tableDesc":`Cambia el color y el dibujo de la mesa bajo las cartas.`,"shop.cat.mascot":`Mascotas`,"shop.cat.mascotDesc":`Pequeños animadores junto a la mesa. Hay tres sitios — se pueden ocupar los tres.`,"shop.cat.emote":`Gestos de victoria`,"shop.cat.emoteDesc":`La pegatina grande que salta a la pantalla cuando el solitario sale.`,"shop.premiumHint":`Objeto especial por dinero real: tuyo para siempre, precio en la moneda de la plataforma`,"shop.unavailableTitle":`Compra no disponible`,"shop.unavailable":`La tienda no pudo obtener la lista de productos de la plataforma: las compras aún no están conectadas o no hay conexión. Inténtalo más tarde.`,"shop.purchased":`Compra realizada: {name} ya es tuyo`,"shop.purchaseFailed":`Compra no completada — no se ha cobrado nada`,"shop.restored":`Compra pagada restaurada: {name}`,"cosmetics.backs":`Dorsos`,"cosmetics.tables":`Mesas`,"cosmetics.mascots":`Mascotas`,"cosmetics.emotes":`Gestos`,"rarity.common":`común`,"rarity.rare":`raro`,"rarity.legendary":`legendario`,"goal.win":`Completar el solitario`,"goal.score":`Conseguir {n} puntos`,"goal.time":`Terminar en {t}`,"goal.noUndo":`Sin deshacer`,"goal.combo":`Combo ×{n}`,"goal.moves":`Como máximo {n} jugadas`,"goal.foundation":`{n} cartas en las bases`,"confirm.title":`¿Seguro?`,"confirm.restart":`¿Empezar de nuevo este mismo reparto? Se perderá el progreso actual.`,"confirm.newDeal":`¿Tomar un nuevo reparto? La partida actual no se guardará.`,"confirm.drawRestart":`Robar {n} se aplica a un nuevo reparto.

¿Reiniciar la partida actual con este modo?
(Cancelar — se aplicará desde el próximo reparto)`,"help.title":`¿Qué es esto?`,"help.draw":`Cuántas cartas voltea el mazo de una vez. Robar 1 es más fácil: cada carta está al alcance. Robar 3 es el modo clásico y más difícil: solo se puede jugar la carta superior de cada trío.`,"help.vegas":`Puntuación de casino: empiezas en −52 (como si compraras la baraja a un dólar por carta) y ganas +5 por cada carta que llega a una base. Los bonos de tiempo y combo se desactivan. El objetivo: acabar en positivo.`,"help.seed":`Cada reparto tiene un número — se ve en la pausa. Escribe un número para jugar exactamente ese mismo reparto o compartirlo con un amigo.`,"help.leftHanded":`Refleja la mesa: el mazo y el descarte pasan bajo la mano izquierda.`,"help.parallax":`La mesa se inclina levemente al mover el cursor. Desactívalo si distrae o pesa en un dispositivo débil.`,"help.bloom":`Brillo suave alrededor de las zonas claras. Bonito, pero pesado para dispositivos modestos.`,"help.vegasChip":`Esta partida va en modo Vegas`,"hud.mute":`Silenciar`,"hud.unmute":`Activar sonido`,"royal.title":`El hueco vacío espera a un rey`,"royal.body":`Según las reglas, solo un rey puede ocupar un hueco vacío. Pero la guardia real puede despejar el sitio para cualquier carta — a cambio de ver un anuncio.`,"royal.watch":`Ver un anuncio — despejar el hueco`,"royal.later":`Ahora no`,"royal.left":`Ayudas restantes: {n}`,"royal.spent":`La guardia despejó el hueco`,"royal.none":`No queda ayuda en esta partida`,"royal.failed":`El vídeo no se reprodujo — no se gastó nada`,"title.1":`Recluta`,"title.3":`Escudero`,"title.6":`Caballero de la baraja`,"title.10":`Barón de los palos`,"title.15":`Conde de las bases`,"title.21":`Duque del Klondike`,"title.28":`Guardián de la corona`,"title.36":`Leyenda de la arena`,"arena.yard.name":`Patio de entrenamiento`,"arena.yard.sub":`Aquí se aprende a sujetar bien la carta`,"arena.grove.name":`Bosquecillo goblin`,"arena.grove.sub":`Unos pillos diminutos cuentan tus puntos`,"arena.bazaar.name":`Bazar de arena`,"arena.bazaar.sub":`Aquí se regatea hasta por un as`,"arena.bones.name":`Foso de huesos`,"arena.bones.sub":`Tres cartas de una vez — y ninguna de más`,"arena.royal.name":`Arena real`,"arena.royal.sub":`La corte mira — y el reloj corre`,"arena.frost.name":`Fortaleza de hielo`,"arena.frost.sub":`Pocos deshacer — piensa antes de mover`,"arena.guild.name":`Gremio del roble`,"arena.guild.sub":`Cuentan cada jugada como una moneda de cobre`,"arena.legend.name":`Arena legendaria`,"arena.legend.sub":`Todo a la vez: tres cartas, el reloj y ni un deshacer`,"match.yard-1":`Primer calentamiento`,"match.yard-2":`Filas rectas`,"match.yard-3":`Revista de la guardia`,"match.grove-1":`Guardia de las setas`,"match.grove-2":`Senda de los pícaros`,"match.grove-3":`El bosque susurra`,"match.grove-4":`Reina de las setas`,"match.bazaar-1":`Regateo matutino`,"match.bazaar-2":`Pasa la caravana`,"match.bazaar-3":`Oro bajo el toldo`,"match.bazaar-4":`Trato nocturno`,"match.bones-1":`Crujir de huesos`,"match.bones-2":`Tres calaveras`,"match.bones-3":`Eco del foso`,"match.bones-4":`Amo del foso`,"match.royal-1":`Presentación en la corte`,"match.royal-2":`Danza de los palos`,"match.royal-3":`Ritmo real`,"match.royal-4":`Aplausos`,"match.royal-5":`La jugada de la corona`,"match.frost-1":`Primera helada`,"match.frost-2":`Grietas en el hielo`,"match.frost-3":`Frío glacial`,"match.frost-4":`Trono de hielo`,"match.guild-1":`Día de puertas abiertas`,"match.guild-2":`Cámara de cuentas`,"match.guild-3":`La auditoría`,"match.guild-4":`Sello del gremio`,"match.legend-1":`Prueba de luz`,"match.legend-2":`Prueba de puntos`,"match.legend-3":`Prueba de tiempo`,"match.legend-4":`Prueba de voluntad`,"match.legend-5":`Corona de la leyenda`,"cosmetic.back.royal":`Real`,"cosmetic.back.forest":`Bosquecillo goblin`,"cosmetic.back.ember":`Brasa`,"cosmetic.back.frost":`Escarcha`,"cosmetic.back.bone":`Foso de huesos`,"cosmetic.back.legend":`Legendario`,"cosmetic.table.green-felt":`Tapete de entrenamiento`,"cosmetic.table.grove":`Bosquecillo goblin`,"cosmetic.table.bone-pit":`Foso de huesos`,"cosmetic.table.royal-carpet":`Alfombra real`,"cosmetic.table.frost":`Fortaleza de hielo`,"cosmetic.table.desert":`Patio de arena`,"cosmetic.table.oak":`Mesa de roble`,"cosmetic.table.legend":`Arena legendaria`,"cosmetic.mascot.badger":`Tejón el Guardia`,"cosmetic.mascot.fox":`Zorro el Heraldo`,"cosmetic.mascot.dragon":`Dragón el Tesorero`,"cosmetic.emote.crown":`Corona`,"cosmetic.emote.laugh":`Carcajada`,"cosmetic.emote.wow":`¡Guau!`,"cosmetic.emote.sleep":`Aburrido`,"cosmetic.emote.fire":`Fuego`,"menu.leaderboard":`Clasificación`,"leaderboard.title":`Clasificación`,"leaderboard.bestScore":`Mejor puntuación`,"leaderboard.crowns":`Coronas`,"leaderboard.you":`Tú`,"leaderboard.loading":`Cargando…`,"leaderboard.empty":`Aún no hay nada — juega una partida y tu resultado aparecerá aquí`,"leaderboard.unavailable":`La clasificación no está disponible ahora — inténtalo más tarde`,"leaderboard.loginHint":`Para entrar en la clasificación y ver tu puesto, inicia sesión con Yandex`,"leaderboard.login":`Iniciar sesión con Yandex`,"leaderboard.hidden":`Jugador oculto`,"leaderboard.yourRank":`Tu puesto: {n}`},Om={"game.title":`Royal`,"game.title2":`Klondike`,"menu.play":`Main`,"menu.continue":`Lanjutkan`,"menu.arenas":`Arena`,"menu.profile":`Profil`,"menu.settings":`Pengaturan`,"menu.shop":`Toko`,"menu.quickPlay":`Main cepat`,"common.back":`Kembali`,"common.close":`Tutup`,"common.ok":`Oke`,"common.cancel":`Batal`,"common.locked":`Terkunci`,"common.crowns":`mahkota`,"common.coins":`koin`,"common.seed":`Bagian`,"common.yes":`Ya`,"common.no":`Tidak`,"hud.score":`Skor`,"hud.time":`Waktu`,"hud.moves":`Langkah`,"hud.undo":`Urungkan`,"hud.hint":`Petunjuk`,"hud.newDeal":`Baru`,"hud.collect":`Kumpulkan!`,"hud.menu":`Menu`,"hud.goal":`Tujuan`,"hud.finish":`Selesai`,"hud.combo":`Kombo ×{n}`,"pause.title":`Jeda`,"pause.resume":`Lanjutkan`,"pause.restart":`Ulangi`,"pause.newDeal":`Bagian baru`,"pause.toMenu":`Menu utama`,"result.win":`Menang!`,"result.lose":`Permainan selesai`,"result.score":`Skor`,"result.timeBonus":`Bonus waktu`,"result.comboBonus":`Bonus kombo`,"result.total":`Total`,"result.crowns":`Mahkota`,"result.coins":`Koin`,"result.again":`Lagi`,"result.next":`Berikutnya`,"result.toArenas":`Arena`,"chest.title":`Hadiah`,"chest.tap":`Ketuk untuk membuka`,"chest.duplicate":`Duplikat → koin`,"chest.wood":`Peti kayu`,"chest.gold":`Peti emas`,"chest.legendary":`Peti legendaris`,"arenas.title":`Arena`,"arenas.needCrowns":`Mahkota dibutuhkan: {n}`,"arenas.matches":`Pertandingan`,"arenas.drawMode":`ambil {n}`,"profile.title":`Profil`,"profile.defaultName":`Pemain`,"profile.level":`Level`,"profile.wins":`Menang`,"profile.losses":`Kalah`,"profile.bestTime":`Waktu terbaik`,"profile.bestScore":`Skor terbaik`,"profile.longestCombo":`Kombo terpanjang`,"profile.streak":`Rentetan kemenangan`,"profile.played":`Permainan`,"profile.cards":`Kartu ke fondasi`,"profile.cosmetics":`Kosmetik`,"settings.title":`Pengaturan`,"settings.draw":`Ambil dari tumpukan`,"settings.draw1":`1 kartu`,"settings.draw3":`3 kartu`,"settings.music":`Musik`,"settings.sfx":`Suara`,"settings.shadows":`Bayangan`,"settings.bloom":`Cahaya`,"settings.animSpeed":`Kecepatan animasi`,"settings.leftHanded":`Mode kidal`,"settings.parallax":`Paralaks kamera`,"settings.vegas":`Mode Vegas`,"settings.drawLocked":`Dalam pertandingan arena, mode ambil ditentukan oleh arena`,"toast.noMoves":`Tidak ada langkah — putar ulang tumpukan`,"toast.drawStock":`Tidak ada langkah berguna di meja — ambil kartu dari tumpukan`,"toast.undoLimit":`Tidak ada urungkan tersisa di arena ini`,"toast.noHint":`Petunjuk habis`,"toast.saved":`Permainan disimpan`,"toast.newRecord":`Rekor baru!`,"toast.levelUp":`Level {n}!`,"toast.unlocked":`Arena “{name}” terbuka`,"toast.goalDone":`Tujuan tercapai! Anda boleh mengakhiri pertandingan`,"toast.bloomOff":`Cahaya dimatikan — perangkat kewalahan. Bisa dinyalakan lagi di Pengaturan`,"toast.shadowsOff":`Bayangan dimatikan — perangkat kewalahan. Bisa dinyalakan lagi di Pengaturan`,"toast.drawApplied":`Ambil {n} — bagian dimulai ulang`,"toast.drawNextDeal":`Ambil {n} — mulai bagian berikutnya`,"toast.unverifiedSeed":`Bagian #{n} dimasukkan manual — mungkin tidak bisa diselesaikan`,"toast.saveFailed":`Tidak bisa menyimpan — penyimpanan peramban penuh`,"toast.mascotEquipped":`{name} bergabung ke meja`,"toast.cloudSync":`Progres dipulihkan dari cloud`,"seed.enter":`Nomor bagian`,"seed.play":`Mainkan bagian ini`,"shop.title":`Toko`,"shop.buy":`Beli`,"shop.owned":`Dimiliki`,"shop.equip":`Pakai`,"shop.equipped":`Dipakai`,"shop.notEnough":`Koin tidak cukup`,"shop.mascotHint":`Maskot duduk di samping meja`,"shop.cat.back":`Punggung kartu`,"shop.cat.backDesc":`Mengubah gambar di punggung kartu — terlihat pada kartu tertutup dan tumpukan.`,"shop.cat.table":`Kain meja`,"shop.cat.tableDesc":`Mengubah warna dan corak meja di bawah kartu.`,"shop.cat.mascot":`Maskot`,"shop.cat.mascotDesc":`Pendukung kecil di samping meja. Ada tiga kursi — semuanya bisa terisi.`,"shop.cat.emote":`Emote kemenangan`,"shop.cat.emoteDesc":`Stiker besar yang melesat ke layar saat permainan dimenangkan.`,"shop.premiumHint":`Item spesial dengan uang sungguhan: milik Anda selamanya, harga dalam mata uang platform`,"shop.unavailableTitle":`Pembelian tidak tersedia`,"shop.unavailable":`Toko tidak bisa mengambil daftar produk dari platform: pembelian belum terhubung atau tidak ada koneksi. Coba lagi nanti.`,"shop.purchased":`Pembelian berhasil: {name} kini milik Anda`,"shop.purchaseFailed":`Pembelian tidak selesai — tidak ada yang ditagih`,"shop.restored":`Pembelian yang sudah dibayar dipulihkan: {name}`,"cosmetics.backs":`Punggung kartu`,"cosmetics.tables":`Meja`,"cosmetics.mascots":`Maskot`,"cosmetics.emotes":`Emote`,"rarity.common":`biasa`,"rarity.rare":`langka`,"rarity.legendary":`legendaris`,"goal.win":`Selesaikan solitaire`,"goal.score":`Raih {n} poin`,"goal.time":`Selesai dalam {t}`,"goal.noUndo":`Tanpa urungkan`,"goal.combo":`Kombo ×{n}`,"goal.moves":`Paling banyak {n} langkah`,"goal.foundation":`{n} kartu di fondasi`,"confirm.title":`Yakin?`,"confirm.restart":`Ulangi bagian yang sama? Progres saat ini akan hilang.`,"confirm.newDeal":`Ambil bagian baru? Permainan saat ini tidak akan disimpan.`,"confirm.drawRestart":`Ambil {n} berlaku untuk bagian baru.

Mulai ulang permainan ini dengan mode tersebut?
(Batal — berlaku mulai bagian berikutnya)`,"help.title":`Apa ini?`,"help.draw":`Berapa kartu yang dibuka dari tumpukan sekali ambil. Ambil 1 lebih mudah: setiap kartu bisa dijangkau. Ambil 3 adalah mode klasik yang lebih sulit: hanya kartu teratas dari tiga yang bisa dimainkan.`,"help.vegas":`Skor ala kasino: mulai dari −52 (seolah membeli dek satu dolar per kartu), +5 untuk setiap kartu yang sampai ke fondasi. Bonus waktu dan kombo dimatikan. Tujuannya: berakhir positif.`,"help.seed":`Setiap bagian punya nomor — terlihat di layar jeda. Masukkan nomor untuk memainkan susunan yang persis sama lagi atau membagikannya ke teman.`,"help.leftHanded":`Mencerminkan meja: tumpukan dan buangan pindah ke bawah tangan kiri.`,"help.parallax":`Meja sedikit miring saat kursor digerakkan. Matikan jika mengganggu atau berat untuk perangkat lemah.`,"help.bloom":`Cahaya lembut di sekitar area terang. Cantik, tapi berat untuk perangkat lemah.`,"help.vegasChip":`Permainan ini berjalan dalam mode Vegas`,"hud.mute":`Bisukan`,"hud.unmute":`Nyalakan suara`,"royal.title":`Slot kosong menunggu raja`,"royal.body":`Menurut aturan, hanya raja yang boleh menempati slot kosong. Tetapi pengawal kerajaan bisa membuka jalan untuk kartu apa pun — dengan menonton iklan.`,"royal.watch":`Tonton iklan — kosongkan slot`,"royal.later":`Nanti saja`,"royal.left":`Bantuan tersisa: {n}`,"royal.spent":`Pengawal telah mengosongkan slot`,"royal.none":`Bantuan di permainan ini sudah habis`,"royal.failed":`Video tidak diputar — tidak ada yang terpakai`,"title.1":`Rekrutan`,"title.3":`Pengawal muda`,"title.6":`Kesatria Dek`,"title.10":`Baron Jenis Kartu`,"title.15":`Bangsawan Fondasi`,"title.21":`Adipati Klondike`,"title.28":`Penjaga Mahkota`,"title.36":`Legenda Arena`,"arena.yard.name":`Halaman latihan`,"arena.yard.sub":`Di sini belajar memegang kartu dengan erat`,"arena.grove.name":`Hutan goblin`,"arena.grove.sub":`Makhluk usil kecil menghitung poin Anda`,"arena.bazaar.name":`Pasar pasir`,"arena.bazaar.sub":`Di sini kartu as pun ditawar`,"arena.bones.name":`Lubang tulang`,"arena.bones.sub":`Tiga kartu sekaligus — tidak ada yang berlebih`,"arena.royal.name":`Arena kerajaan`,"arena.royal.sub":`Istana menonton — dan waktu berdetak`,"arena.frost.name":`Benteng es`,"arena.frost.sub":`Urungkan terbatas — pikir sebelum melangkah`,"arena.guild.name":`Serikat pohon ek`,"arena.guild.sub":`Setiap langkah dihitung seperti uang tembaga`,"arena.legend.name":`Arena legendaris`,"arena.legend.sub":`Semua sekaligus: tiga kartu, waktu, dan tanpa urungkan`,"match.yard-1":`Pemanasan pertama`,"match.yard-2":`Barisan rapi`,"match.yard-3":`Parade pengawal`,"match.grove-1":`Jaga jamur`,"match.grove-2":`Jalur penipu`,"match.grove-3":`Hutan berdesir`,"match.grove-4":`Ratu jamur`,"match.bazaar-1":`Tawar-menawar pagi`,"match.bazaar-2":`Kafilah berjalan`,"match.bazaar-3":`Emas di bawah tenda`,"match.bazaar-4":`Kesepakatan malam`,"match.bones-1":`Derit tulang`,"match.bones-2":`Tiga tengkorak`,"match.bones-3":`Gema lubang`,"match.bones-4":`Penguasa lubang`,"match.royal-1":`Menghadap istana`,"match.royal-2":`Tarian jenis kartu`,"match.royal-3":`Tempo kerajaan`,"match.royal-4":`Tepuk tangan`,"match.royal-5":`Langkah mahkota`,"match.frost-1":`Embun beku pertama`,"match.frost-2":`Retakan di es`,"match.frost-3":`Dingin menusuk`,"match.frost-4":`Takhta es`,"match.guild-1":`Hari terbuka`,"match.guild-2":`Ruang hitung`,"match.guild-3":`Audit`,"match.guild-4":`Segel serikat`,"match.legend-1":`Ujian cahaya`,"match.legend-2":`Ujian skor`,"match.legend-3":`Ujian waktu`,"match.legend-4":`Ujian tekad`,"match.legend-5":`Mahkota legenda`,"cosmetic.back.royal":`Kerajaan`,"cosmetic.back.forest":`Hutan goblin`,"cosmetic.back.ember":`Bara`,"cosmetic.back.frost":`Beku`,"cosmetic.back.bone":`Lubang tulang`,"cosmetic.back.legend":`Legendaris`,"cosmetic.table.green-felt":`Kain latihan`,"cosmetic.table.grove":`Hutan goblin`,"cosmetic.table.bone-pit":`Lubang tulang`,"cosmetic.table.royal-carpet":`Karpet kerajaan`,"cosmetic.table.frost":`Benteng es`,"cosmetic.table.desert":`Halaman pasir`,"cosmetic.table.oak":`Meja ek`,"cosmetic.table.legend":`Arena legendaris`,"cosmetic.mascot.badger":`Luak si Pengawal`,"cosmetic.mascot.fox":`Rubah si Pembawa Berita`,"cosmetic.mascot.dragon":`Naga si Bendahara`,"cosmetic.emote.crown":`Mahkota`,"cosmetic.emote.laugh":`Tawa`,"cosmetic.emote.wow":`Wah!`,"cosmetic.emote.sleep":`Membosankan`,"cosmetic.emote.fire":`Api`,"menu.leaderboard":`Peringkat`,"leaderboard.title":`Papan peringkat`,"leaderboard.bestScore":`Skor terbaik`,"leaderboard.crowns":`Mahkota`,"leaderboard.you":`Anda`,"leaderboard.loading":`Memuat…`,"leaderboard.empty":`Masih kosong — mainkan satu permainan dan hasil Anda akan muncul di sini`,"leaderboard.unavailable":`Papan peringkat sedang tidak tersedia — coba lagi nanti`,"leaderboard.loginHint":`Untuk masuk papan peringkat dan melihat posisi Anda, masuk dengan Yandex`,"leaderboard.login":`Masuk dengan Yandex`,"leaderboard.hidden":`Pemain tersembunyi`,"leaderboard.yourRank":`Posisi Anda: {n}`},km={"game.title":`Royal`,"game.title2":`Klondike`,"menu.play":`العب`,"menu.continue":`متابعة`,"menu.arenas":`الساحات`,"menu.profile":`الملف الشخصي`,"menu.settings":`الإعدادات`,"menu.shop":`المتجر`,"menu.quickPlay":`لعبة سريعة`,"common.back":`رجوع`,"common.close":`إغلاق`,"common.ok":`حسنًا`,"common.cancel":`إلغاء`,"common.locked":`مغلق`,"common.crowns":`تيجان`,"common.coins":`عملات`,"common.seed":`التوزيعة`,"common.yes":`نعم`,"common.no":`لا`,"hud.score":`النقاط`,"hud.time":`الوقت`,"hud.moves":`الحركات`,"hud.undo":`تراجع`,"hud.hint":`تلميح`,"hud.newDeal":`جديدة`,"hud.collect":`اجمع!`,"hud.menu":`القائمة`,"hud.goal":`الهدف`,"hud.finish":`إنهاء`,"hud.combo":`كومبو ×{n}`,"pause.title":`إيقاف مؤقت`,"pause.resume":`استئناف`,"pause.restart":`إعادة`,"pause.newDeal":`توزيعة جديدة`,"pause.toMenu":`القائمة الرئيسية`,"result.win":`فوز!`,"result.lose":`انتهت اللعبة`,"result.score":`النقاط`,"result.timeBonus":`مكافأة الوقت`,"result.comboBonus":`مكافأة الكومبو`,"result.total":`المجموع`,"result.crowns":`التيجان`,"result.coins":`العملات`,"result.again":`مرة أخرى`,"result.next":`التالي`,"result.toArenas":`الساحات`,"chest.title":`المكافأة`,"chest.tap":`انقر للفتح`,"chest.duplicate":`مكرر → عملات`,"chest.wood":`صندوق خشبي`,"chest.gold":`صندوق ذهبي`,"chest.legendary":`صندوق أسطوري`,"arenas.title":`الساحات`,"arenas.needCrowns":`التيجان المطلوبة: {n}`,"arenas.matches":`المباريات`,"arenas.drawMode":`سحب {n}`,"profile.title":`الملف الشخصي`,"profile.defaultName":`لاعب`,"profile.level":`المستوى`,"profile.wins":`انتصارات`,"profile.losses":`هزائم`,"profile.bestTime":`أفضل وقت`,"profile.bestScore":`أفضل نتيجة`,"profile.longestCombo":`أطول كومبو`,"profile.streak":`سلسلة انتصارات`,"profile.played":`ألعاب`,"profile.cards":`بطاقات إلى الأساسات`,"profile.cosmetics":`التجميل`,"settings.title":`الإعدادات`,"settings.draw":`السحب من الرصة`,"settings.draw1":`بطاقة واحدة`,"settings.draw3":`3 بطاقات`,"settings.music":`الموسيقى`,"settings.sfx":`الأصوات`,"settings.shadows":`الظلال`,"settings.bloom":`التوهج`,"settings.animSpeed":`سرعة الحركة`,"settings.leftHanded":`وضع اليد اليسرى`,"settings.parallax":`تمايل الكاميرا`,"settings.vegas":`وضع فيغاس`,"settings.drawLocked":`في مباراة الساحة تحدد الساحة وضع السحب`,"toast.noMoves":`لا حركات — أعد تدوير الرصة`,"toast.drawStock":`لا حركة مفيدة على الطاولة — اسحب بطاقة من الرصة`,"toast.undoLimit":`لم يتبقَّ تراجع في هذه الساحة`,"toast.noHint":`لم تتبقَّ تلميحات`,"toast.saved":`تم حفظ اللعبة`,"toast.newRecord":`رقم قياسي جديد!`,"toast.levelUp":`المستوى {n}!`,"toast.unlocked":`فُتحت ساحة «{name}»`,"toast.goalDone":`تحقق الهدف! يمكنك إنهاء المباراة`,"toast.bloomOff":`أُوقف التوهج — كان الجهاز يعاني. يمكن إعادته من الإعدادات`,"toast.shadowsOff":`أُوقفت الظلال — كان الجهاز يعاني. يمكن إعادتها من الإعدادات`,"toast.drawApplied":`سحب {n} — بدأت التوزيعة من جديد`,"toast.drawNextDeal":`سحب {n} — من التوزيعة التالية`,"toast.unverifiedSeed":`أُدخلت التوزيعة #{n} يدويًا — قد لا يكون لها حل`,"toast.saveFailed":`تعذر حفظ التقدم — ذاكرة المتصفح ممتلئة`,"toast.mascotEquipped":`انضم {name} إلى الطاولة`,"toast.cloudSync":`استُعيد التقدم من السحابة`,"seed.enter":`رقم التوزيعة`,"seed.play":`العب هذه التوزيعة`,"shop.title":`المتجر`,"shop.buy":`شراء`,"shop.owned":`لديك`,"shop.equip":`استخدام`,"shop.equipped":`مستخدم`,"shop.notEnough":`العملات غير كافية`,"shop.mascotHint":`يجلس التميمة بجانب الطاولة`,"shop.cat.back":`ظهور البطاقات`,"shop.cat.backDesc":`تغيّر صورة ظهر البطاقات — تظهر على البطاقات المقلوبة وفي الرصة.`,"shop.cat.table":`قماش الطاولة`,"shop.cat.tableDesc":`يغيّر لون الطاولة ونقشها تحت البطاقات.`,"shop.cat.mascot":`التمائم`,"shop.cat.mascotDesc":`مشجعون صغار بجانب الطاولة. ثلاثة مقاعد — يمكن شغلها كلها.`,"shop.cat.emote":`تعابير الفوز`,"shop.cat.emoteDesc":`الملصق الكبير الذي يقفز على الشاشة عند الفوز.`,"shop.premiumHint":`عنصر خاص بمال حقيقي: ملكك للأبد، والسعر بعملة المنصة`,"shop.unavailableTitle":`الشراء غير متاح`,"shop.unavailable":`لم يتمكن المتجر من الحصول على قائمة المنتجات من المنصة: المشتريات غير مفعّلة بعد أو لا يوجد اتصال. حاول لاحقًا.`,"shop.purchased":`تم الشراء: {name} أصبح ملكك`,"shop.purchaseFailed":`لم يكتمل الشراء — لم يُخصم شيء`,"shop.restored":`استُعيد شراء مدفوع: {name}`,"cosmetics.backs":`ظهور البطاقات`,"cosmetics.tables":`الطاولات`,"cosmetics.mascots":`التمائم`,"cosmetics.emotes":`التعابير`,"rarity.common":`عادي`,"rarity.rare":`نادر`,"rarity.legendary":`أسطوري`,"goal.win":`أكمل السوليتير`,"goal.score":`اجمع {n} نقطة`,"goal.time":`أنهِ خلال {t}`,"goal.noUndo":`بدون تراجع`,"goal.combo":`كومبو ×{n}`,"goal.moves":`بحد أقصى {n} حركة`,"goal.foundation":`{n} بطاقة في الأساسات`,"confirm.title":`هل أنت متأكد؟`,"confirm.restart":`إعادة نفس التوزيعة من البداية؟ سيضيع التقدم الحالي.`,"confirm.newDeal":`أخذ توزيعة جديدة؟ لن تُحفظ اللعبة الحالية.`,"confirm.drawRestart":`سحب {n} ينطبق على توزيعة جديدة.

إعادة اللعبة الحالية بهذا الوضع؟
(إلغاء — سيُطبق من التوزيعة التالية)`,"help.title":`ما هذا؟`,"help.draw":`عدد البطاقات التي تُقلب من الرصة في كل مرة. سحب بطاقة واحدة أسهل: كل بطاقة في المتناول. سحب ثلاث هو الوضع الكلاسيكي الأصعب: لا تُلعب إلا البطاقة العلوية من كل ثلاثية.`,"help.vegas":`حساب على طريقة الكازينو: تبدأ من −52 (كأنك اشتريت المجموعة بدولار للبطاقة)، و+5 لكل بطاقة تصل إلى أساس. مكافآت الوقت والكومبو معطّلة. الهدف: أن تنتهي بالرصيد الموجب.`,"help.seed":`لكل توزيعة رقم — يظهر في شاشة الإيقاف. أدخل الرقم لتلعب نفس الترتيب مرة أخرى أو تشاركه مع صديق.`,"help.leftHanded":`يعكس الطاولة: تنتقل الرصة والمهملات تحت اليد اليسرى.`,"help.parallax":`تميل الطاولة قليلاً عند تحريك المؤشر. أوقفها إذا كانت مشتتة للانتباه أو ثقيلة على جهاز ضعيف.`,"help.bloom":`توهج ناعم حول المناطق الساطعة. جميل، لكنه ثقيل على الأجهزة الضعيفة.`,"help.vegasChip":`هذه اللعبة تجري في وضع فيغاس`,"hud.mute":`كتم الصوت`,"hud.unmute":`تشغيل الصوت`,"royal.title":`الخانة الفارغة تنتظر ملكًا`,"royal.body":`حسب القواعد لا يشغل الخانة الفارغة إلا الملك. لكن الحرس الملكي يستطيع إخلاء المكان لأي بطاقة — مقابل مشاهدة إعلان.`,"royal.watch":`شاهد إعلانًا — أخلِ الخانة`,"royal.later":`ليس الآن`,"royal.left":`المساعدات المتبقية: {n}`,"royal.spent":`أخلى الحرس الخانة`,"royal.none":`نفدت المساعدة في هذه اللعبة`,"royal.failed":`لم يُعرض الفيديو — لم يُستهلك شيء`,"title.1":`مجنّد`,"title.3":`حامل السلاح`,"title.6":`فارس المجموعة`,"title.10":`بارون الأنواع`,"title.15":`كونت الأساسات`,"title.21":`دوق كلوندايك`,"title.28":`حارس التاج`,"title.36":`أسطورة الساحة`,"arena.yard.name":`ساحة التدريب`,"arena.yard.sub":`هنا تتعلم إمساك البطاقة بإحكام`,"arena.grove.name":`أيكة العفاريت`,"arena.grove.sub":`مشاغبون صغار يعدّون نقاطك`,"arena.bazaar.name":`بازار الرمال`,"arena.bazaar.sub":`هنا يساومون حتى على الآس`,"arena.bones.name":`حفرة العظام`,"arena.bones.sub":`ثلاث بطاقات دفعة واحدة — ولا واحدة زائدة`,"arena.royal.name":`الساحة الملكية`,"arena.royal.sub":`البلاط يراقب — والساعة تدق`,"arena.frost.name":`قلعة الجليد`,"arena.frost.sub":`التراجع قليل — فكّر قبل أن تتحرك`,"arena.guild.name":`نقابة البلوط`,"arena.guild.sub":`يحسبون كل حركة كقطعة نحاس`,"arena.legend.name":`الساحة الأسطورية`,"arena.legend.sub":`كل شيء دفعة واحدة: ثلاث بطاقات والساعة وبلا تراجع`,"match.yard-1":`الإحماء الأول`,"match.yard-2":`صفوف مستقيمة`,"match.yard-3":`استعراض الحرس`,"match.grove-1":`حراسة الفطر`,"match.grove-2":`درب المحتالين`,"match.grove-3":`الأيكة تهمس`,"match.grove-4":`ملكة الفطر`,"match.bazaar-1":`مساومة الصباح`,"match.bazaar-2":`القافلة تمضي`,"match.bazaar-3":`ذهب تحت المظلة`,"match.bazaar-4":`صفقة الليل`,"match.bones-1":`صرير العظام`,"match.bones-2":`ثلاث جماجم`,"match.bones-3":`صدى الحفرة`,"match.bones-4":`سيد الحفرة`,"match.royal-1":`المثول أمام البلاط`,"match.royal-2":`رقصة الأنواع`,"match.royal-3":`الإيقاع الملكي`,"match.royal-4":`تصفيق`,"match.royal-5":`حركة التاج`,"match.frost-1":`الصقيع الأول`,"match.frost-2":`شقوق في الجليد`,"match.frost-3":`برد قارس`,"match.frost-4":`عرش الجليد`,"match.guild-1":`يوم الاستقبال`,"match.guild-2":`غرفة الحسابات`,"match.guild-3":`التدقيق`,"match.guild-4":`ختم النقابة`,"match.legend-1":`اختبار النور`,"match.legend-2":`اختبار النقاط`,"match.legend-3":`اختبار الوقت`,"match.legend-4":`اختبار الإرادة`,"match.legend-5":`تاج الأسطورة`,"cosmetic.back.royal":`ملكي`,"cosmetic.back.forest":`أيكة العفاريت`,"cosmetic.back.ember":`جمرة`,"cosmetic.back.frost":`صقيع`,"cosmetic.back.bone":`حفرة العظام`,"cosmetic.back.legend":`أسطوري`,"cosmetic.table.green-felt":`جوخ التدريب`,"cosmetic.table.grove":`أيكة العفاريت`,"cosmetic.table.bone-pit":`حفرة العظام`,"cosmetic.table.royal-carpet":`السجادة الملكية`,"cosmetic.table.frost":`قلعة الجليد`,"cosmetic.table.desert":`ساحة الرمال`,"cosmetic.table.oak":`طاولة البلوط`,"cosmetic.table.legend":`الساحة الأسطورية`,"cosmetic.mascot.badger":`الغرير الحارس`,"cosmetic.mascot.fox":`الثعلب المنادي`,"cosmetic.mascot.dragon":`التنين أمين الخزانة`,"cosmetic.emote.crown":`تاج`,"cosmetic.emote.laugh":`ضحك`,"cosmetic.emote.wow":`واو!`,"cosmetic.emote.sleep":`ممل`,"cosmetic.emote.fire":`نار`,"menu.leaderboard":`الترتيب`,"leaderboard.title":`لوحة المتصدرين`,"leaderboard.bestScore":`أفضل نتيجة`,"leaderboard.crowns":`التيجان`,"leaderboard.you":`أنت`,"leaderboard.loading":`جارٍ التحميل…`,"leaderboard.empty":`لا شيء بعد — العب جولة وستظهر نتيجتك هنا`,"leaderboard.unavailable":`لوحة المتصدرين غير متاحة الآن — حاول لاحقًا`,"leaderboard.loginHint":`للدخول إلى اللوحة ورؤية ترتيبك، سجّل الدخول عبر ياندكس`,"leaderboard.login":`تسجيل الدخول عبر ياندكس`,"leaderboard.hidden":`لاعب مخفي`,"leaderboard.yourRank":`ترتيبك: {n}`},Am={"game.title":`Royal`,"game.title2":`Klondike`,"menu.play":`Spielen`,"menu.continue":`Weiter`,"menu.arenas":`Arenen`,"menu.profile":`Profil`,"menu.settings":`Einstellungen`,"menu.shop":`Laden`,"menu.quickPlay":`Schnelles Spiel`,"common.back":`Zurück`,"common.close":`Schließen`,"common.ok":`OK`,"common.cancel":`Abbrechen`,"common.locked":`Gesperrt`,"common.crowns":`Kronen`,"common.coins":`Münzen`,"common.seed":`Blatt`,"common.yes":`Ja`,"common.no":`Nein`,"hud.score":`Punkte`,"hud.time":`Zeit`,"hud.moves":`Züge`,"hud.undo":`Zurück`,"hud.hint":`Tipp`,"hud.newDeal":`Neu`,"hud.collect":`Einsammeln!`,"hud.menu":`Menü`,"hud.goal":`Ziel`,"hud.finish":`Beenden`,"hud.combo":`Kombo ×{n}`,"pause.title":`Pause`,"pause.resume":`Weiter`,"pause.restart":`Neustart`,"pause.newDeal":`Neues Blatt`,"pause.toMenu":`Hauptmenü`,"result.win":`Sieg!`,"result.lose":`Spiel vorbei`,"result.score":`Punkte`,"result.timeBonus":`Zeitbonus`,"result.comboBonus":`Kombobonus`,"result.total":`Gesamt`,"result.crowns":`Kronen`,"result.coins":`Münzen`,"result.again":`Nochmal`,"result.next":`Weiter`,"result.toArenas":`Arenen`,"chest.title":`Belohnung`,"chest.tap":`Tippen zum Öffnen`,"chest.duplicate":`Doppelt → Münzen`,"chest.wood":`Holztruhe`,"chest.gold":`Goldtruhe`,"chest.legendary":`Legendäre Truhe`,"arenas.title":`Arenen`,"arenas.needCrowns":`Benötigte Kronen: {n}`,"arenas.matches":`Partien`,"arenas.drawMode":`{n} ziehen`,"profile.title":`Profil`,"profile.defaultName":`Spieler`,"profile.level":`Stufe`,"profile.wins":`Siege`,"profile.losses":`Niederlagen`,"profile.bestTime":`Beste Zeit`,"profile.bestScore":`Bester Punktestand`,"profile.longestCombo":`Längste Kombo`,"profile.streak":`Siegesserie`,"profile.played":`Spiele`,"profile.cards":`Karten auf Ablagen`,"profile.cosmetics":`Kosmetik`,"settings.title":`Einstellungen`,"settings.draw":`Vom Talon ziehen`,"settings.draw1":`1 Karte`,"settings.draw3":`3 Karten`,"settings.music":`Musik`,"settings.sfx":`Geräusche`,"settings.shadows":`Schatten`,"settings.bloom":`Leuchten`,"settings.animSpeed":`Animationstempo`,"settings.leftHanded":`Linkshänder`,"settings.parallax":`Kamera-Parallaxe`,"settings.vegas":`Vegas-Modus`,"settings.drawLocked":`In einer Arena-Partie legt die Arena den Ziehmodus fest`,"toast.noMoves":`Keine Züge — Talon neu durchgehen`,"toast.drawStock":`Auf dem Tisch geht nichts — eine Karte vom Talon ziehen`,"toast.undoLimit":`In dieser Arena sind keine Rücknahmen mehr übrig`,"toast.noHint":`Keine Tipps mehr`,"toast.saved":`Spiel gespeichert`,"toast.newRecord":`Neuer Rekord!`,"toast.levelUp":`Stufe {n}!`,"toast.unlocked":`Arena „{name}“ freigeschaltet`,"toast.goalDone":`Ziel erreicht! Die Partie kann beendet werden`,"toast.bloomOff":`Leuchten ausgeschaltet — das Gerät kam nicht mit. In den Einstellungen wieder einschaltbar`,"toast.shadowsOff":`Schatten ausgeschaltet — das Gerät kam nicht mit. In den Einstellungen wieder einschaltbar`,"toast.drawApplied":`{n} ziehen — das Blatt wurde neu gegeben`,"toast.drawNextDeal":`{n} ziehen — ab dem nächsten Blatt`,"toast.unverifiedSeed":`Blatt #{n} wurde von Hand eingegeben — es ist vielleicht nicht lösbar`,"toast.saveFailed":`Fortschritt kann nicht gespeichert werden — der Browserspeicher ist voll`,"toast.mascotEquipped":`{name} sitzt jetzt am Tisch`,"toast.cloudSync":`Fortschritt aus der Cloud geladen`,"seed.enter":`Blattnummer`,"seed.play":`Dieses Blatt spielen`,"shop.title":`Laden`,"shop.buy":`Kaufen`,"shop.owned":`Vorhanden`,"shop.equip":`Anlegen`,"shop.equipped":`Angelegt`,"shop.notEnough":`Nicht genug Münzen`,"shop.mascotHint":`Das Maskottchen setzt sich neben den Tisch`,"shop.cat.back":`Kartenrücken`,"shop.cat.backDesc":`Ändert das Bild auf der Kartenrückseite — sichtbar bei verdeckten Karten und im Talon.`,"shop.cat.table":`Tischtuch`,"shop.cat.tableDesc":`Ändert Farbe und Muster des Tisches unter den Karten.`,"shop.cat.mascot":`Maskottchen`,"shop.cat.mascotDesc":`Kleine Fans neben dem Tisch. Drei Plätze — alle drei können besetzt werden.`,"shop.cat.emote":`Sieges-Emotes`,"shop.cat.emoteDesc":`Der große Sticker, der beim Gewinn über den Bildschirm fliegt.`,"shop.premiumHint":`Besonderer Gegenstand für echtes Geld: gehört dir für immer, Preis in der Plattformwährung`,"shop.unavailableTitle":`Kauf nicht verfügbar`,"shop.unavailable":`Der Laden konnte die Produktliste der Plattform nicht laden: Käufe sind noch nicht angeschlossen oder es gibt keine Verbindung. Bitte später erneut versuchen.`,"shop.purchased":`Kauf abgeschlossen: {name} gehört jetzt dir`,"shop.purchaseFailed":`Kauf nicht abgeschlossen — nichts wurde abgebucht`,"shop.restored":`Bezahlter Kauf wiederhergestellt: {name}`,"cosmetics.backs":`Kartenrücken`,"cosmetics.tables":`Tische`,"cosmetics.mascots":`Maskottchen`,"cosmetics.emotes":`Emotes`,"rarity.common":`gewöhnlich`,"rarity.rare":`selten`,"rarity.legendary":`legendär`,"goal.win":`Die Patience lösen`,"goal.score":`{n} Punkte erreichen`,"goal.time":`In {t} schaffen`,"goal.noUndo":`Ohne Rücknahmen`,"goal.combo":`Kombo ×{n}`,"goal.moves":`Höchstens {n} Züge`,"goal.foundation":`{n} Karten auf den Ablagen`,"confirm.title":`Sicher?`,"confirm.restart":`Dasselbe Blatt neu beginnen? Der aktuelle Fortschritt geht verloren.`,"confirm.newDeal":`Ein neues Blatt nehmen? Das aktuelle Spiel wird nicht gespeichert.`,"confirm.drawRestart":`{n} ziehen gilt für ein neues Blatt.

Das aktuelle Spiel mit diesem Modus neu starten?
(Abbrechen — gilt ab dem nächsten Blatt)`,"help.title":`Was ist das?`,"help.draw":`Wie viele Karten der Talon auf einmal aufdeckt. 1 Karte ist leichter — jede Karte ist erreichbar. 3 Karten ist der klassische, schwerere Modus: nur die oberste des Dreierpacks ist spielbar.`,"help.vegas":`Zählweise wie im Casino: Start bei −52 (als hättest du das Deck für einen Dollar pro Karte gekauft), +5 für jede Karte auf einer Ablage. Zeit- und Kombobonus sind aus. Ziel: am Ende im Plus sein.`,"help.seed":`Jedes Blatt hat eine Nummer — zu sehen im Pausenmenü. Gib eine Nummer ein, um genau dieses Blatt noch einmal zu spielen oder es mit Freunden zu teilen.`,"help.leftHanded":`Spiegelt den Tisch: Talon und Ablagestapel wandern unter die linke Hand.`,"help.parallax":`Der Tisch neigt sich leicht, wenn du den Zeiger bewegst. Schalte es aus, wenn es ablenkt oder ein schwaches Gerät belastet.`,"help.bloom":`Weiches Leuchten um helle Stellen. Hübsch, aber schwer für schwache Geräte.`,"help.vegasChip":`Diese Partie läuft im Vegas-Modus`,"hud.mute":`Ton aus`,"hud.unmute":`Ton an`,"royal.title":`Der leere Platz wartet auf einen König`,"royal.body":`Laut Regeln darf nur ein König auf einen leeren Platz. Doch die königliche Garde kann den Weg für jede Karte freimachen — gegen das Ansehen einer Werbung.`,"royal.watch":`Werbung ansehen — Platz freimachen`,"royal.later":`Nicht jetzt`,"royal.left":`Verbleibende Hilfen: {n}`,"royal.spent":`Die Garde hat den Platz freigemacht`,"royal.none":`In diesem Spiel ist keine Hilfe mehr übrig`,"royal.failed":`Das Video lief nicht — nichts wurde verbraucht`,"title.1":`Rekrut`,"title.3":`Knappe`,"title.6":`Ritter des Decks`,"title.10":`Baron der Farben`,"title.15":`Graf der Ablagen`,"title.21":`Herzog von Klondike`,"title.28":`Hüter der Krone`,"title.36":`Legende der Arena`,"arena.yard.name":`Übungshof`,"arena.yard.sub":`Hier lernt man, die Karte festzuhalten`,"arena.grove.name":`Goblinhain`,"arena.grove.sub":`Kleine Plagegeister zählen deine Punkte`,"arena.bazaar.name":`Sandbasar`,"arena.bazaar.sub":`Hier wird sogar um ein Ass gefeilscht`,"arena.bones.name":`Knochengrube`,"arena.bones.sub":`Drei Karten auf einmal — und keine zu viel`,"arena.royal.name":`Königliche Arena`,"arena.royal.sub":`Der Hof schaut zu — und die Uhr tickt`,"arena.frost.name":`Eisfestung`,"arena.frost.sub":`Wenige Rücknahmen — erst denken, dann ziehen`,"arena.guild.name":`Eichengilde`,"arena.guild.sub":`Jeder Zug wird gezählt wie ein Kupferstück`,"arena.legend.name":`Legendäre Arena`,"arena.legend.sub":`Alles auf einmal: drei Karten, die Uhr und keine Rücknahme`,"match.yard-1":`Erstes Aufwärmen`,"match.yard-2":`Gerade Reihen`,"match.yard-3":`Gardeparade`,"match.grove-1":`Pilzwache`,"match.grove-2":`Pfad der Schelme`,"match.grove-3":`Der Hain rauscht`,"match.grove-4":`Pilzkönigin`,"match.bazaar-1":`Morgenhandel`,"match.bazaar-2":`Die Karawane zieht`,"match.bazaar-3":`Gold unterm Sonnendach`,"match.bazaar-4":`Nächtlicher Handel`,"match.bones-1":`Knochenknarren`,"match.bones-2":`Drei Schädel`,"match.bones-3":`Echo der Grube`,"match.bones-4":`Herr der Grube`,"match.royal-1":`Auftritt bei Hofe`,"match.royal-2":`Tanz der Farben`,"match.royal-3":`Königliches Tempo`,"match.royal-4":`Applaus`,"match.royal-5":`Der Kronzug`,"match.frost-1":`Erster Frost`,"match.frost-2":`Risse im Eis`,"match.frost-3":`Klirrende Kälte`,"match.frost-4":`Eisthron`,"match.guild-1":`Tag der offenen Tür`,"match.guild-2":`Rechenkammer`,"match.guild-3":`Die Prüfung`,"match.guild-4":`Siegel der Gilde`,"match.legend-1":`Prüfung des Lichts`,"match.legend-2":`Prüfung der Punkte`,"match.legend-3":`Prüfung der Zeit`,"match.legend-4":`Prüfung des Willens`,"match.legend-5":`Krone der Legende`,"cosmetic.back.royal":`Königlich`,"cosmetic.back.forest":`Goblinhain`,"cosmetic.back.ember":`Glut`,"cosmetic.back.frost":`Frost`,"cosmetic.back.bone":`Knochengrube`,"cosmetic.back.legend":`Legendär`,"cosmetic.table.green-felt":`Übungsfilz`,"cosmetic.table.grove":`Goblinhain`,"cosmetic.table.bone-pit":`Knochengrube`,"cosmetic.table.royal-carpet":`Königsteppich`,"cosmetic.table.frost":`Eisfestung`,"cosmetic.table.desert":`Sandhof`,"cosmetic.table.oak":`Eichentisch`,"cosmetic.table.legend":`Legendäre Arena`,"cosmetic.mascot.badger":`Dachs der Gardist`,"cosmetic.mascot.fox":`Fuchs der Herold`,"cosmetic.mascot.dragon":`Drache der Schatzmeister`,"cosmetic.emote.crown":`Krone`,"cosmetic.emote.laugh":`Gelächter`,"cosmetic.emote.wow":`Wow!`,"cosmetic.emote.sleep":`Langweilig`,"cosmetic.emote.fire":`Feuer`,"menu.leaderboard":`Rangliste`,"leaderboard.title":`Rangliste`,"leaderboard.bestScore":`Beste Punktzahl`,"leaderboard.crowns":`Kronen`,"leaderboard.you":`Du`,"leaderboard.loading":`Wird geladen…`,"leaderboard.empty":`Noch leer — spiel eine Partie, dann erscheint dein Ergebnis hier`,"leaderboard.unavailable":`Die Rangliste ist gerade nicht verfügbar — versuch es später noch einmal`,"leaderboard.loginHint":`Um in die Rangliste zu kommen und deinen Platz zu sehen, melde dich mit Yandex an`,"leaderboard.login":`Mit Yandex anmelden`,"leaderboard.hidden":`Verborgener Spieler`,"leaderboard.yourRank":`Dein Platz: {n}`},jm={"game.title":`Royal`,"game.title2":`Klondike`,"menu.play":`Jouer`,"menu.continue":`Continuer`,"menu.arenas":`Arènes`,"menu.profile":`Profil`,"menu.settings":`Réglages`,"menu.shop":`Boutique`,"menu.quickPlay":`Partie rapide`,"common.back":`Retour`,"common.close":`Fermer`,"common.ok":`OK`,"common.cancel":`Annuler`,"common.locked":`Verrouillé`,"common.crowns":`couronnes`,"common.coins":`pièces`,"common.seed":`Donne`,"common.yes":`Oui`,"common.no":`Non`,"hud.score":`Score`,"hud.time":`Temps`,"hud.moves":`Coups`,"hud.undo":`Annuler`,"hud.hint":`Indice`,"hud.newDeal":`Nouvelle`,"hud.collect":`Ramasser !`,"hud.menu":`Menu`,"hud.goal":`Objectif`,"hud.finish":`Terminer`,"hud.combo":`Combo ×{n}`,"pause.title":`Pause`,"pause.resume":`Reprendre`,"pause.restart":`Recommencer`,"pause.newDeal":`Nouvelle donne`,"pause.toMenu":`Menu principal`,"result.win":`Victoire !`,"result.lose":`Partie terminée`,"result.score":`Score`,"result.timeBonus":`Bonus de temps`,"result.comboBonus":`Bonus de combo`,"result.total":`Total`,"result.crowns":`Couronnes`,"result.coins":`Pièces`,"result.again":`Encore`,"result.next":`Suivant`,"result.toArenas":`Arènes`,"chest.title":`Récompense`,"chest.tap":`Touchez pour ouvrir`,"chest.duplicate":`Doublon → pièces`,"chest.wood":`Coffre en bois`,"chest.gold":`Coffre doré`,"chest.legendary":`Coffre légendaire`,"arenas.title":`Arènes`,"arenas.needCrowns":`Couronnes requises : {n}`,"arenas.matches":`Manches`,"arenas.drawMode":`pioche {n}`,"profile.title":`Profil`,"profile.defaultName":`Joueur`,"profile.level":`Niveau`,"profile.wins":`Victoires`,"profile.losses":`Défaites`,"profile.bestTime":`Meilleur temps`,"profile.bestScore":`Meilleur score`,"profile.longestCombo":`Plus long combo`,"profile.streak":`Série de victoires`,"profile.played":`Parties`,"profile.cards":`Cartes aux fondations`,"profile.cosmetics":`Cosmétiques`,"settings.title":`Réglages`,"settings.draw":`Pioche`,"settings.draw1":`1 carte`,"settings.draw3":`3 cartes`,"settings.music":`Musique`,"settings.sfx":`Sons`,"settings.shadows":`Ombres`,"settings.bloom":`Halo`,"settings.animSpeed":`Vitesse des animations`,"settings.leftHanded":`Mode gaucher`,"settings.parallax":`Parallaxe de la caméra`,"settings.vegas":`Mode Vegas`,"settings.drawLocked":`Dans une manche d’arène, le mode de pioche est fixé par l’arène`,"toast.noMoves":`Aucun coup — repassez le talon`,"toast.drawStock":`Rien d’utile sur la table — piochez une carte`,"toast.undoLimit":`Plus d’annulations dans cette arène`,"toast.noHint":`Plus d’indices`,"toast.saved":`Partie sauvegardée`,"toast.newRecord":`Nouveau record !`,"toast.levelUp":`Niveau {n} !`,"toast.unlocked":`Arène « {name} » débloquée`,"toast.goalDone":`Objectif atteint ! Vous pouvez terminer la manche`,"toast.bloomOff":`Halo désactivé — l’appareil peinait. Réactivable dans les réglages`,"toast.shadowsOff":`Ombres désactivées — l’appareil peinait. Réactivables dans les réglages`,"toast.drawApplied":`Pioche {n} — la donne a été redistribuée`,"toast.drawNextDeal":`Pioche {n} — à partir de la prochaine donne`,"toast.unverifiedSeed":`Donne #{n} saisie à la main — elle n’est peut-être pas résoluble`,"toast.saveFailed":`Impossible de sauvegarder — le stockage du navigateur est plein`,"toast.mascotEquipped":`{name} a rejoint la table`,"toast.cloudSync":`Progression récupérée depuis le cloud`,"seed.enter":`Numéro de donne`,"seed.play":`Jouer cette donne`,"shop.title":`Boutique`,"shop.buy":`Acheter`,"shop.owned":`Acquis`,"shop.equip":`Équiper`,"shop.equipped":`Équipé`,"shop.notEnough":`Pas assez de pièces`,"shop.mascotHint":`La mascotte s’installe à côté de la table`,"shop.cat.back":`Dos de cartes`,"shop.cat.backDesc":`Change l’image au dos des cartes — visible sur les cartes retournées et le talon.`,"shop.cat.table":`Tapis de table`,"shop.cat.tableDesc":`Change la couleur et le motif de la table sous les cartes.`,"shop.cat.mascot":`Mascottes`,"shop.cat.mascotDesc":`Petits supporters à côté de la table. Trois places — toutes peuvent être occupées.`,"shop.cat.emote":`Émotes de victoire`,"shop.cat.emoteDesc":`Le grand autocollant qui surgit à l’écran quand la réussite est terminée.`,"shop.premiumHint":`Objet spécial payant : à vous pour toujours, prix dans la monnaie de la plateforme`,"shop.unavailableTitle":`Achat indisponible`,"shop.unavailable":`La boutique n’a pas pu obtenir la liste des produits de la plateforme : les achats ne sont pas encore connectés ou il n’y a pas de connexion. Réessayez plus tard.`,"shop.purchased":`Achat effectué : {name} est à vous`,"shop.purchaseFailed":`Achat non terminé — rien n’a été débité`,"shop.restored":`Achat payé restauré : {name}`,"cosmetics.backs":`Dos de cartes`,"cosmetics.tables":`Tables`,"cosmetics.mascots":`Mascottes`,"cosmetics.emotes":`Émotes`,"rarity.common":`commun`,"rarity.rare":`rare`,"rarity.legendary":`légendaire`,"goal.win":`Terminer la réussite`,"goal.score":`Marquer {n} points`,"goal.time":`Finir en moins de {t}`,"goal.noUndo":`Sans annulation`,"goal.combo":`Combo ×{n}`,"goal.moves":`Au plus {n} coups`,"goal.foundation":`{n} cartes aux fondations`,"confirm.title":`Vraiment ?`,"confirm.restart":`Recommencer cette même donne ? La progression actuelle sera perdue.`,"confirm.newDeal":`Prendre une nouvelle donne ? La partie en cours ne sera pas sauvegardée.`,"confirm.drawRestart":`La pioche {n} s’applique à une nouvelle donne.

Recommencer la partie en cours avec ce mode ?
(Annuler — il s’appliquera à la prochaine donne)`,"help.title":`Qu’est-ce que c’est ?`,"help.draw":`Combien de cartes le talon retourne à la fois. Pioche 1, c’est plus facile : chaque carte est accessible. Pioche 3, c’est le mode classique, plus dur : seule la carte du dessus de chaque trio est jouable.`,"help.vegas":`Score façon casino : départ à −52 (comme si vous aviez acheté le paquet un dollar la carte), +5 pour chaque carte arrivée à une fondation. Bonus de temps et de combo désactivés. Le but : finir dans le vert.`,"help.seed":`Chaque donne a un numéro — visible en pause. Saisissez un numéro pour rejouer exactement la même donne ou la partager avec un ami.`,"help.leftHanded":`Inverse la table : le talon et la défausse passent sous la main gauche.`,"help.parallax":`La table s'incline légèrement quand vous déplacez le curseur. Désactivez si cela distrait ou pèse sur un appareil faible.`,"help.bloom":`Halo doux autour des zones claires. Joli, mais lourd pour les appareils modestes.`,"help.vegasChip":`Cette partie se joue en mode Vegas`,"hud.mute":`Couper le son`,"hud.unmute":`Remettre le son`,"royal.title":`La case vide attend un roi`,"royal.body":`Selon les règles, seul un roi peut prendre une case vide. Mais la garde royale peut libérer la place pour n’importe quelle carte — contre le visionnage d’une publicité.`,"royal.watch":`Regarder une publicité — libérer la case`,"royal.later":`Pas maintenant`,"royal.left":`Aides restantes : {n}`,"royal.spent":`La garde a libéré la case`,"royal.none":`Plus d’aide dans cette partie`,"royal.failed":`La vidéo n’a pas été lue — rien n’a été dépensé`,"title.1":`Recrue`,"title.3":`Écuyer`,"title.6":`Chevalier du paquet`,"title.10":`Baron des couleurs`,"title.15":`Comte des fondations`,"title.21":`Duc du Klondike`,"title.28":`Gardien de la couronne`,"title.36":`Légende de l’arène`,"arena.yard.name":`Cour d’entraînement`,"arena.yard.sub":`Ici on apprend à bien tenir sa carte`,"arena.grove.name":`Bosquet des gobelins`,"arena.grove.sub":`De petits chenapans comptent vos points`,"arena.bazaar.name":`Bazar des sables`,"arena.bazaar.sub":`Ici on marchande même un as`,"arena.bones.name":`Fosse aux os`,"arena.bones.sub":`Trois cartes à la fois — et pas une de trop`,"arena.royal.name":`Arène royale`,"arena.royal.sub":`La cour regarde — et l’horloge tourne`,"arena.frost.name":`Forteresse de glace`,"arena.frost.sub":`Peu d’annulations — réfléchissez avant de jouer`,"arena.guild.name":`Guilde du chêne`,"arena.guild.sub":`Chaque coup est compté comme un sou`,"arena.legend.name":`Arène légendaire`,"arena.legend.sub":`Tout à la fois : trois cartes, l’horloge et aucune annulation`,"match.yard-1":`Premier échauffement`,"match.yard-2":`Rangs serrés`,"match.yard-3":`Revue de la garde`,"match.grove-1":`Ronde des champignons`,"match.grove-2":`Sentier des filous`,"match.grove-3":`Le bosquet bruisse`,"match.grove-4":`Reine des champignons`,"match.bazaar-1":`Marché du matin`,"match.bazaar-2":`La caravane passe`,"match.bazaar-3":`L’or sous l’auvent`,"match.bazaar-4":`Marché de nuit`,"match.bones-1":`Craquement d’os`,"match.bones-2":`Trois crânes`,"match.bones-3":`Écho de la fosse`,"match.bones-4":`Maître de la fosse`,"match.royal-1":`Présentation à la cour`,"match.royal-2":`Danse des couleurs`,"match.royal-3":`Tempo royal`,"match.royal-4":`Applaudissements`,"match.royal-5":`Le coup de la couronne`,"match.frost-1":`Premier gel`,"match.frost-2":`Fissures dans la glace`,"match.frost-3":`Grand froid`,"match.frost-4":`Trône de glace`,"match.guild-1":`Journée d’accueil`,"match.guild-2":`Chambre des comptes`,"match.guild-3":`L’audit`,"match.guild-4":`Sceau de la guilde`,"match.legend-1":`Épreuve de lumière`,"match.legend-2":`Épreuve du score`,"match.legend-3":`Épreuve du temps`,"match.legend-4":`Épreuve de volonté`,"match.legend-5":`Couronne de la légende`,"cosmetic.back.royal":`Royal`,"cosmetic.back.forest":`Bosquet des gobelins`,"cosmetic.back.ember":`Braise`,"cosmetic.back.frost":`Givre`,"cosmetic.back.bone":`Fosse aux os`,"cosmetic.back.legend":`Légendaire`,"cosmetic.table.green-felt":`Feutre d’entraînement`,"cosmetic.table.grove":`Bosquet des gobelins`,"cosmetic.table.bone-pit":`Fosse aux os`,"cosmetic.table.royal-carpet":`Tapis royal`,"cosmetic.table.frost":`Forteresse de glace`,"cosmetic.table.desert":`Cour de sable`,"cosmetic.table.oak":`Table en chêne`,"cosmetic.table.legend":`Arène légendaire`,"cosmetic.mascot.badger":`Blaireau le Garde`,"cosmetic.mascot.fox":`Renard le Héraut`,"cosmetic.mascot.dragon":`Dragon le Trésorier`,"cosmetic.emote.crown":`Couronne`,"cosmetic.emote.laugh":`Fou rire`,"cosmetic.emote.wow":`Waouh !`,"cosmetic.emote.sleep":`Ennui`,"cosmetic.emote.fire":`Feu`,"menu.leaderboard":`Classement`,"leaderboard.title":`Classement`,"leaderboard.bestScore":`Meilleur score`,"leaderboard.crowns":`Couronnes`,"leaderboard.you":`Vous`,"leaderboard.loading":`Chargement…`,"leaderboard.empty":`Rien pour l’instant — jouez une partie et votre résultat apparaîtra ici`,"leaderboard.unavailable":`Le classement est indisponible pour le moment — réessayez plus tard`,"leaderboard.loginHint":`Pour figurer au classement et voir votre place, connectez-vous avec Yandex`,"leaderboard.login":`Se connecter avec Yandex`,"leaderboard.hidden":`Joueur masqué`,"leaderboard.yourRank":`Votre place : {n}`},Mm={"game.title":`Royal`,"game.title2":`Klondike`,"menu.play":`Gioca`,"menu.continue":`Continua`,"menu.arenas":`Arene`,"menu.profile":`Profilo`,"menu.settings":`Impostazioni`,"menu.shop":`Bottega`,"menu.quickPlay":`Partita rapida`,"common.back":`Indietro`,"common.close":`Chiudi`,"common.ok":`OK`,"common.cancel":`Annulla`,"common.locked":`Bloccato`,"common.crowns":`corone`,"common.coins":`monete`,"common.seed":`Smazzata`,"common.yes":`Sì`,"common.no":`No`,"hud.score":`Punti`,"hud.time":`Tempo`,"hud.moves":`Mosse`,"hud.undo":`Annulla`,"hud.hint":`Aiuto`,"hud.newDeal":`Nuova`,"hud.collect":`Raccogli!`,"hud.menu":`Menu`,"hud.goal":`Obiettivo`,"hud.finish":`Termina`,"hud.combo":`Combo ×{n}`,"pause.title":`Pausa`,"pause.resume":`Riprendi`,"pause.restart":`Ricomincia`,"pause.newDeal":`Nuova smazzata`,"pause.toMenu":`Menu principale`,"result.win":`Vittoria!`,"result.lose":`Partita finita`,"result.score":`Punti`,"result.timeBonus":`Bonus tempo`,"result.comboBonus":`Bonus combo`,"result.total":`Totale`,"result.crowns":`Corone`,"result.coins":`Monete`,"result.again":`Ancora`,"result.next":`Avanti`,"result.toArenas":`Arene`,"chest.title":`Ricompensa`,"chest.tap":`Tocca per aprire`,"chest.duplicate":`Doppione → monete`,"chest.wood":`Forziere di legno`,"chest.gold":`Forziere d’oro`,"chest.legendary":`Forziere leggendario`,"arenas.title":`Arene`,"arenas.needCrowns":`Corone necessarie: {n}`,"arenas.matches":`Partite`,"arenas.drawMode":`pesca {n}`,"profile.title":`Profilo`,"profile.defaultName":`Giocatore`,"profile.level":`Livello`,"profile.wins":`Vittorie`,"profile.losses":`Sconfitte`,"profile.bestTime":`Miglior tempo`,"profile.bestScore":`Miglior punteggio`,"profile.longestCombo":`Combo più lunga`,"profile.streak":`Serie di vittorie`,"profile.played":`Partite`,"profile.cards":`Carte nelle basi`,"profile.cosmetics":`Cosmetici`,"settings.title":`Impostazioni`,"settings.draw":`Pesca dal tallone`,"settings.draw1":`1 carta`,"settings.draw3":`3 carte`,"settings.music":`Musica`,"settings.sfx":`Suoni`,"settings.shadows":`Ombre`,"settings.bloom":`Bagliore`,"settings.animSpeed":`Velocità animazioni`,"settings.leftHanded":`Modalità mancini`,"settings.parallax":`Parallasse della fotocamera`,"settings.vegas":`Modalità Vegas`,"settings.drawLocked":`In una partita d’arena la modalità di pesca è decisa dall’arena`,"toast.noMoves":`Nessuna mossa — ripassa il tallone`,"toast.drawStock":`Niente di utile sul tavolo — pesca una carta dal tallone`,"toast.undoLimit":`Annullamenti finiti in questa arena`,"toast.noHint":`Aiuti finiti`,"toast.saved":`Partita salvata`,"toast.newRecord":`Nuovo record!`,"toast.levelUp":`Livello {n}!`,"toast.unlocked":`Arena «{name}» sbloccata`,"toast.goalDone":`Obiettivo raggiunto! Puoi terminare la partita`,"toast.bloomOff":`Bagliore disattivato — il dispositivo faceva fatica. Puoi riattivarlo nelle impostazioni`,"toast.shadowsOff":`Ombre disattivate — il dispositivo faceva fatica. Puoi riattivarle nelle impostazioni`,"toast.drawApplied":`Pesca {n} — la smazzata è ricominciata`,"toast.drawNextDeal":`Pesca {n} — dalla prossima smazzata`,"toast.unverifiedSeed":`Smazzata #{n} inserita a mano — potrebbe non essere risolvibile`,"toast.saveFailed":`Impossibile salvare — la memoria del browser è piena`,"toast.mascotEquipped":`{name} si è seduto al tavolo`,"toast.cloudSync":`Progressi recuperati dal cloud`,"seed.enter":`Numero smazzata`,"seed.play":`Gioca questa smazzata`,"shop.title":`Bottega`,"shop.buy":`Compra`,"shop.owned":`Tuo`,"shop.equip":`Usa`,"shop.equipped":`In uso`,"shop.notEnough":`Monete insufficienti`,"shop.mascotHint":`La mascotte si siede accanto al tavolo`,"shop.cat.back":`Dorsi delle carte`,"shop.cat.backDesc":`Cambiano l’immagine sul dorso delle carte — visibile sulle carte coperte e nel tallone.`,"shop.cat.table":`Panno del tavolo`,"shop.cat.tableDesc":`Cambia colore e motivo del tavolo sotto le carte.`,"shop.cat.mascot":`Mascotte`,"shop.cat.mascotDesc":`Piccoli tifosi accanto al tavolo. Tre posti — si possono occupare tutti e tre.`,"shop.cat.emote":`Emote di vittoria`,"shop.cat.emoteDesc":`Il grande adesivo che vola sullo schermo quando il solitario riesce.`,"shop.premiumHint":`Oggetto speciale a pagamento: tuo per sempre, prezzo nella valuta della piattaforma`,"shop.unavailableTitle":`Acquisto non disponibile`,"shop.unavailable":`La bottega non è riuscita a ottenere l’elenco dei prodotti dalla piattaforma: gli acquisti non sono ancora collegati o manca la connessione. Riprova più tardi.`,"shop.purchased":`Acquisto riuscito: {name} ora è tuo`,"shop.purchaseFailed":`Acquisto non completato — nessun addebito`,"shop.restored":`Acquisto pagato ripristinato: {name}`,"cosmetics.backs":`Dorsi`,"cosmetics.tables":`Tavoli`,"cosmetics.mascots":`Mascotte`,"cosmetics.emotes":`Emote`,"rarity.common":`comune`,"rarity.rare":`rara`,"rarity.legendary":`leggendaria`,"goal.win":`Completa il solitario`,"goal.score":`Fai {n} punti`,"goal.time":`Finisci entro {t}`,"goal.noUndo":`Senza annullamenti`,"goal.combo":`Combo ×{n}`,"goal.moves":`Al massimo {n} mosse`,"goal.foundation":`{n} carte nelle basi`,"confirm.title":`Sicuro?`,"confirm.restart":`Ricominciare questa stessa smazzata? I progressi attuali andranno persi.`,"confirm.newDeal":`Prendere una nuova smazzata? La partita in corso non sarà salvata.`,"confirm.drawRestart":`Pesca {n} vale per una nuova smazzata.

Ricominciare la partita in corso con questa modalità?
(Annulla — varrà dalla prossima smazzata)`,"help.title":`Che cos’è?`,"help.draw":`Quante carte scopre il tallone per volta. Pesca 1 è più facile: ogni carta è raggiungibile. Pesca 3 è la modalità classica, più difficile: si gioca solo la carta in cima a ogni terzetto.`,"help.vegas":`Punteggio da casinò: si parte da −52 (come se avessi comprato il mazzo a un dollaro a carta) e si guadagna +5 per ogni carta che arriva a una base. Bonus tempo e combo disattivati. L’obiettivo: chiudere in attivo.`,"help.seed":`Ogni smazzata ha un numero — lo vedi in pausa. Inserisci un numero per rigiocare esattamente quella disposizione o condividerla con un amico.`,"help.leftHanded":`Specchia il tavolo: tallone e scarti passano sotto la mano sinistra.`,"help.parallax":`Il tavolo si inclina leggermente quando muovi il cursore. Disattivalo se distrae o appesantisce un dispositivo debole.`,"help.bloom":`Bagliore morbido attorno alle zone chiare. Bello, ma pesante per i dispositivi deboli.`,"help.vegasChip":`Questa partita è in modalità Vegas`,"hud.mute":`Silenzia`,"hud.unmute":`Riattiva audio`,"royal.title":`La casella vuota aspetta un re`,"royal.body":`Per le regole, solo un re può occupare una casella vuota. Ma la guardia reale può liberare il posto per qualsiasi carta — in cambio della visione di una pubblicità.`,"royal.watch":`Guarda una pubblicità — libera la casella`,"royal.later":`Non ora`,"royal.left":`Aiuti rimasti: {n}`,"royal.spent":`La guardia ha liberato la casella`,"royal.none":`Aiuto esaurito in questa partita`,"royal.failed":`Il video non è partito — nulla è stato speso`,"title.1":`Recluta`,"title.3":`Scudiero`,"title.6":`Cavaliere del mazzo`,"title.10":`Barone dei semi`,"title.15":`Conte delle basi`,"title.21":`Duca del Klondike`,"title.28":`Custode della corona`,"title.36":`Leggenda dell’arena`,"arena.yard.name":`Cortile d’allenamento`,"arena.yard.sub":`Qui si impara a tenere stretta la carta`,"arena.grove.name":`Boschetto dei goblin`,"arena.grove.sub":`Piccoli dispettosi contano i tuoi punti`,"arena.bazaar.name":`Bazar di sabbia`,"arena.bazaar.sub":`Qui si contratta perfino per un asso`,"arena.bones.name":`Fossa delle ossa`,"arena.bones.sub":`Tre carte per volta — e nessuna di troppo`,"arena.royal.name":`Arena reale`,"arena.royal.sub":`La corte osserva — e l’orologio corre`,"arena.frost.name":`Fortezza di ghiaccio`,"arena.frost.sub":`Pochi annullamenti — pensa prima di muovere`,"arena.guild.name":`Gilda della quercia`,"arena.guild.sub":`Contano ogni mossa come un soldo`,"arena.legend.name":`Arena leggendaria`,"arena.legend.sub":`Tutto insieme: tre carte, l’orologio e nessun annullamento`,"match.yard-1":`Primo riscaldamento`,"match.yard-2":`File ordinate`,"match.yard-3":`Rivista della guardia`,"match.grove-1":`Ronda dei funghi`,"match.grove-2":`Sentiero dei furfanti`,"match.grove-3":`Il boschetto fruscia`,"match.grove-4":`Regina dei funghi`,"match.bazaar-1":`Mercato del mattino`,"match.bazaar-2":`Passa la carovana`,"match.bazaar-3":`Oro sotto la tenda`,"match.bazaar-4":`Affare notturno`,"match.bones-1":`Scricchiolio d’ossa`,"match.bones-2":`Tre teschi`,"match.bones-3":`Eco della fossa`,"match.bones-4":`Padrone della fossa`,"match.royal-1":`Presentazione a corte`,"match.royal-2":`Danza dei semi`,"match.royal-3":`Ritmo reale`,"match.royal-4":`Applausi`,"match.royal-5":`La mossa della corona`,"match.frost-1":`Prima gelata`,"match.frost-2":`Crepe nel ghiaccio`,"match.frost-3":`Gelo`,"match.frost-4":`Trono di ghiaccio`,"match.guild-1":`Giornata aperta`,"match.guild-2":`Camera dei conti`,"match.guild-3":`La revisione`,"match.guild-4":`Sigillo della gilda`,"match.legend-1":`Prova della luce`,"match.legend-2":`Prova del punteggio`,"match.legend-3":`Prova del tempo`,"match.legend-4":`Prova della volontà`,"match.legend-5":`Corona della leggenda`,"cosmetic.back.royal":`Reale`,"cosmetic.back.forest":`Boschetto dei goblin`,"cosmetic.back.ember":`Brace`,"cosmetic.back.frost":`Brina`,"cosmetic.back.bone":`Fossa delle ossa`,"cosmetic.back.legend":`Leggendario`,"cosmetic.table.green-felt":`Panno d’allenamento`,"cosmetic.table.grove":`Boschetto dei goblin`,"cosmetic.table.bone-pit":`Fossa delle ossa`,"cosmetic.table.royal-carpet":`Tappeto reale`,"cosmetic.table.frost":`Fortezza di ghiaccio`,"cosmetic.table.desert":`Cortile di sabbia`,"cosmetic.table.oak":`Tavolo di quercia`,"cosmetic.table.legend":`Arena leggendaria`,"cosmetic.mascot.badger":`Tasso la Guardia`,"cosmetic.mascot.fox":`Volpe l’Araldo`,"cosmetic.mascot.dragon":`Drago il Tesoriere`,"cosmetic.emote.crown":`Corona`,"cosmetic.emote.laugh":`Risata`,"cosmetic.emote.wow":`Wow!`,"cosmetic.emote.sleep":`Che noia`,"cosmetic.emote.fire":`Fuoco`,"menu.leaderboard":`Classifica`,"leaderboard.title":`Classifica`,"leaderboard.bestScore":`Miglior punteggio`,"leaderboard.crowns":`Corone`,"leaderboard.you":`Tu`,"leaderboard.loading":`Caricamento…`,"leaderboard.empty":`Ancora vuota — gioca una partita e il tuo risultato apparirà qui`,"leaderboard.unavailable":`La classifica non è disponibile al momento — riprova più tardi`,"leaderboard.loginHint":`Per entrare in classifica e vedere la tua posizione, accedi con Yandex`,"leaderboard.login":`Accedi con Yandex`,"leaderboard.hidden":`Giocatore nascosto`,"leaderboard.yourRank":`La tua posizione: {n}`},Nm=[`ru`,`en`,`tr`,`kk`,`pt`,`es`,`id`,`ar`,`de`,`fr`,`it`],Pm={ru:Sm,en:Cm,tr:wm,kk:Tm,pt:Em,es:Dm,id:Om,ar:km,de:Am,fr:jm,it:Mm},Fm=new Set([`be`,`uk`,`uz`,`ky`,`tg`,`az`,`hy`]);function Im(e){let t=String(e??``).trim().toLowerCase().split(/[-_]/)[0];return t?Nm.includes(t)?t:t===`in`?`id`:Fm.has(t)?`ru`:`en`:`en`}var Lm=e=>e===`ar`,Rm=e=>e===`ru`||e===`kk`?`ru`:`en`,zm=`ru`;function Bm(e){zm=e}function Vm(){return zm}function $(e,t){let n=(Pm[zm]??Sm)[e]??Cm[e]??Sm[e]??e;if(t)for(let[e,r]of Object.entries(t))n=n.replace(`{${e}}`,String(r));return n}function Hm(e){let{key:t,vars:n}=vp(e);return $(t,n)}var Um=e=>$(`arena.${e.id}.name`),Wm=e=>$(`arena.${e.id}.sub`),Gm=e=>$(`match.${e.id}`),Km=e=>$(`cosmetic.${e.kind}.${e.id}`),qm=e=>$(`chest.${e}`),Jm=e=>$(`rarity.${e}`),Ym=e=>$(`title.${qp(e)}`),Xm=e=>{let t=Math.floor(Math.max(0,e)/60),n=Math.floor(Math.max(0,e)%60);return`${t}:${String(n).padStart(2,`0`)}`},Zm=class{parent;root;scoreValue;timeValue;movesValue;undoBtn;collectBtn;finishBtn;goalBox;floaterLayer;scoreChip;scoreIcon;vegasHelp;muteBtn;restartBtn;newDealBtn;lastScore=0;lastSeconds=-1;visible=!1;blocked=!1;constructor(e,t){this.parent=e,this.scoreValue=Z(`span`,{class:`chip__value`,text:`0`}),this.timeValue=Z(`span`,{class:`chip__value`,text:`0:00`}),this.movesValue=Z(`span`,{class:`chip__value`,text:`0`}),this.scoreIcon=Z(`span`,{class:`chip__icon`,text:`★`}),this.vegasHelp=bm($(`help.vegas`),{label:$(`settings.vegas`)}),this.vegasHelp.style.display=`none`,this.undoBtn=Q($(`hud.undo`),{variant:`blue`,size:`small`,icon:`↶`,onClick:t.onUndo}),this.collectBtn=Q($(`hud.collect`),{variant:`gold`,icon:`✨`,onClick:t.onCollect,class:`hud__collect`}),this.collectBtn.style.display=`none`,this.finishBtn=Q($(`hud.finish`),{variant:`red`,size:`small`,icon:`🏁`,onClick:t.onFinish}),this.finishBtn.style.display=`none`,this.goalBox=Z(`div`,{class:`hud__goal`}),this.goalBox.style.display=`none`,this.muteBtn=Q(``,{variant:`blue`,size:`icon`,icon:`🔊`,onClick:t.onMute,title:$(`hud.mute`)}),this.restartBtn=Q($(`pause.restart`),{variant:`blue`,size:`small`,icon:`↻`,onClick:t.onRestart,title:$(`pause.restart`),class:`btn--collapsible`}),this.newDealBtn=Q($(`pause.newDeal`),{variant:`purple`,size:`small`,icon:`🂠`,onClick:t.onNewDeal,title:$(`pause.newDeal`),class:`btn--collapsible`}),this.floaterLayer=Z(`div`,{style:{position:`absolute`,inset:`0`,pointerEvents:`none`,zIndex:`25`}}),this.root=Z(`div`,{class:`hud`},[Z(`div`,{class:`hud__top`},[Z(`div`,{class:`hud__stats`},[this.scoreChip=Z(`div`,{class:`chip chip--gold`},[this.scoreIcon,this.scoreValue,this.vegasHelp]),Z(`div`,{class:`chip`},[Z(`span`,{class:`chip__icon`,text:`⏱`}),this.timeValue]),Z(`div`,{class:`chip chip--moves`},[Z(`span`,{class:`chip__icon`,text:`♟`}),this.movesValue])]),Z(`div`,{class:`hud__buttons`},[this.muteBtn,Q(``,{variant:`blue`,size:`icon`,icon:`☰`,onClick:t.onMenu,title:$(`hud.menu`)})])]),Z(`div`,{class:`hud__bottom`},[this.goalBox,Z(`div`,{class:`hud__actionbar`},[Z(`div`,{class:`hud__actions`},[this.finishBtn,this.collectBtn,Q($(`hud.hint`),{variant:`purple`,size:`small`,icon:`💡`,onClick:t.onHint}),this.undoBtn]),Z(`div`,{class:`hud__actions hud__actions--right`},[this.restartBtn,this.newDealBtn])])]),this.floaterLayer]),e.append(this.root),this.hide()}show(){this.visible=!0,this.applyVisibility()}hide(){this.visible=!1,this.applyVisibility()}setBlocked(e){this.blocked=e,this.applyVisibility()}applyVisibility(){this.root.style.display=this.visible?`flex`:`none`,this.visible&&!this.blocked?(this.root.removeAttribute(`aria-hidden`),this.root.removeAttribute(`inert`)):(this.root.setAttribute(`aria-hidden`,`true`),this.root.setAttribute(`inert`,``))}setTime(e){let t=Math.floor(e);t!==this.lastSeconds&&(this.lastSeconds=t,this.timeValue.textContent=Xm(t))}setMuted(e){let t=this.muteBtn.querySelector(`span`);t&&(t.textContent=e?`🔇`:`🔊`),this.muteBtn.classList.toggle(`is-muted`,e),this.muteBtn.title=$(e?`hud.unmute`:`hud.mute`)}setVegas(e){this.scoreIcon.textContent=e?`💰`:`★`,this.scoreChip.classList.toggle(`chip--vegas`,e),this.vegasHelp.style.display=e?`inline-flex`:`none`}setStats(e){e.score!==this.lastScore&&(this.scoreValue.textContent=String(Math.round(e.score)),this.bump(this.scoreValue),this.lastScore=e.score),this.setTime(e.seconds),this.movesValue.textContent=String(e.moves);let t=Number.isFinite(e.undoLeft);this.undoBtn.classList.toggle(`is-disabled`,e.undoLeft<=0),this.undoBtn.disabled=e.undoLeft<=0;let n=this.undoBtn.querySelector(`span:last-child`);n&&(n.textContent=t?`${$(`hud.undo`)} ${e.undoLeft}`:$(`hud.undo`))}bump(e){e.classList.remove(`bump`),e.offsetWidth,e.classList.add(`bump`)}setGoal(e){if(!e){this.goalBox.style.display=`none`;return}this.goalBox.style.display=`block`,this.goalBox.innerHTML=``,this.goalBox.append(Z(`span`,{text:`${$(`hud.goal`)}: `}),Z(`b`,{text:e}))}setCollectVisible(e){this.collectBtn.style.display=e?`inline-flex`:`none`}setFinishVisible(e){this.finishBtn.style.display=e?`inline-flex`:`none`}floater(e,t,n,r=`score`){let i=Z(`div`,{class:`floater${r===`combo`?` floater--combo`:``}`,text:n,style:{left:`${e}px`,top:`${t}px`}});this.floaterLayer.append(i),i.addEventListener(`animationend`,()=>i.remove()),window.setTimeout(()=>i.remove(),1600)}sticker(e){let t=Z(`div`,{class:`sticker`,text:e});this.parent.append(t),window.setTimeout(()=>t.remove(),2600)}toast(e){let t=Z(`div`,{class:`toast`,text:e});t.dir=Lm(Vm())?`rtl`:`ltr`,this.parent.append(t),t.addEventListener(`animationend`,()=>t.remove()),window.setTimeout(()=>t.remove(),2800)}},Qm=class{host;node=null;nameValue=null;onVisibility=null;constructor(e){this.host=e}show(e,t,n={}){this.hide();let r=Z(`div`,{class:`screen${n.clear?` screen--clear`:``}`},[Z(`div`,{class:`screen__inner`},[t])]);r.dir=Lm(Vm())?`rtl`:`ltr`,this.host.append(r),this.node=r,this.nameValue=e,this.onVisibility?.(!0)}hide(){let e=this.node!==null;this.node?.remove(),this.node=null,this.nameValue=null,e&&this.onVisibility?.(!1)}get name(){return this.nameValue}get isOpen(){return this.node!==null}},$m=e=>Z(`div`,{class:`chip chip--gold`},[Z(`span`,{text:`🪙`}),Z(`span`,{text:String(e)})]),eh=e=>Z(`div`,{class:`chip`},[Z(`span`,{text:`♛`}),Z(`span`,{text:String(e)})]),th=e=>{let t=0;for(let n of Object.values(e.arenas))for(let e of Object.values(n))t+=e.crowns;return t};function nh(e){let t=Z(`input`,{class:`seed-input`,attrs:{type:`text`,placeholder:`#`,maxlength:`12`,title:$(`seed.enter`)},style:{width:`110px`,padding:`10px 12px`,borderRadius:`14px`,border:`4px solid #1B2450`,fontFamily:`inherit`,fontWeight:`800`,fontSize:`16px`,background:`#FFF6DF`,color:`#1B2450`}});return Z(`div`,{class:`menu`},[Z(`div`,{style:{display:`flex`,gap:`10px`,justifyContent:`center`}},[$m(e.save.profile.coins),eh(th(e.save))]),Z(`h1`,{class:`menu__logo`},[document.createTextNode($(`game.title`)),Z(`small`,{text:$(`game.title2`)})]),Z(`div`,{class:`menu__buttons`},[e.hasSavedGame?Q($(`menu.continue`),{variant:`gold`,icon:`▶`,wide:!0,onClick:e.onContinue}):Q($(`menu.play`),{icon:`🂡`,wide:!0,onClick:e.onPlay}),Q($(`menu.arenas`),{variant:`blue`,icon:`🏰`,wide:!0,onClick:e.onArenas}),e.onLeaderboard?Q($(`menu.leaderboard`),{variant:`purple`,icon:`🏆`,wide:!0,onClick:e.onLeaderboard}):null,Z(`div`,{class:`menu__row`},[Q($(`menu.profile`),{variant:`purple`,size:`small`,icon:`👤`,onClick:e.onProfile}),Q($(`menu.shop`),{variant:`purple`,size:`small`,icon:`🛍`,onClick:e.onShop}),Q($(`menu.settings`),{variant:`blue`,size:`small`,icon:`⚙`,onClick:e.onSettings})]),Z(`div`,{class:`menu__row`,style:{alignItems:`center`}},[t,Q($(`seed.play`),{variant:`gold`,size:`small`,onClick:()=>e.onSeed(t.value.trim())}),bm($(`help.seed`),{label:$(`seed.play`)})])])])}function rh(e,t){let n=e.arenas[t.id]??{};return t.matches.reduce((e,t)=>e+(n[t.id]?.crowns??0),0)}function ih(e){let t=th(e.save),n=Z(`div`,{class:`arena-list`}),r=Q($(`common.back`),{variant:`blue`,wide:!0,onClick:e.onBack}),i=mm($(`arenas.title`),[n,r],`blue`),a=(e,t)=>{let n=r.querySelector(`span:last-child`);n&&(n.textContent=e),r.onclick=t},o=()=>{hm(n),a($(`common.back`),e.onBack);for(let r of gp){let i=t<r.unlockCrowns,a=rh(e.save,r),o=r.matches.length*3,c=Z(`div`,{class:`arena-card${i?` is-locked`:``}`,style:{background:`linear-gradient(180deg, ${r.visual.skin.light}55, ${r.visual.skin.deep}aa)`},onClick:()=>{i||s(r)}},[Z(`div`,{class:`arena-card__badge`,text:i?`🔒`:`⚔`,style:{background:`linear-gradient(180deg, ${r.visual.skin.base}, ${r.visual.skin.deep})`}}),Z(`div`,{class:`arena-card__body`},[Z(`div`,{class:`arena-card__name`,text:Um(r)}),Z(`div`,{class:`arena-card__sub`,text:i?$(`arenas.needCrowns`,{n:r.unlockCrowns}):Wm(r)})]),Z(`div`,{class:`arena-card__crowns`,text:`♛ ${a}/${o}`})]);n.append(c)}},s=t=>{hm(n),a($(`result.toArenas`),o);let r=e.save.arenas[t.id]??{};n.append(Z(`div`,{class:`arena-card__name`,text:Um(t)}),Z(`div`,{class:`arena-card__sub`,text:`${Wm(t)} · ${$(`arenas.drawMode`,{n:t.drawCount})}`})),t.matches.forEach((i,a)=>{let o=a===0?1:r[t.matches[a-1].id]?.crowns??0,s=a>0&&o===0,c=Z(`div`,{class:`match-row${s?` is-locked`:``}`,onClick:()=>{s||e.onStart(t,i)}},[Z(`div`,{style:{flex:`1 1 auto`}},[Z(`div`,{class:`match-row__title`,text:`${a+1}. ${Gm(i)}`}),i.goal.kind===`win`?null:Z(`div`,{class:`match-row__goal`,text:Hm(i.goal)})]),ym(r[i.id]?.crowns??0)]);n.append(c)})};return o(),i}function ah(e){let t=[Z(`div`,{class:`result__line`},[Z(`span`,{text:$(`result.score`)}),Z(`b`,{text:String(e.breakdown.base)})])];return e.breakdown.time>0&&t.push(Z(`div`,{class:`result__line`},[Z(`span`,{text:$(`result.timeBonus`)}),Z(`b`,{text:`+${e.breakdown.time}`})])),e.breakdown.combo>0&&t.push(Z(`div`,{class:`result__line`},[Z(`span`,{text:$(`result.comboBonus`)}),Z(`b`,{text:`+${e.breakdown.combo}`})])),t.push(Z(`div`,{class:`result__line`},[Z(`span`,{text:`${$(`hud.time`)} · ${$(`hud.moves`)}`}),Z(`b`,{text:`${Xm(e.result.seconds)} · ${e.result.moves}`})]),Z(`div`,{class:`result__line`,style:{background:`rgba(255,201,60,0.55)`}},[Z(`span`,{text:$(`result.coins`)}),Z(`b`,{text:`+${e.coins} 🪙`})])),mm(e.won?$(`result.win`):$(`result.lose`),[e.match?Z(`div`,{style:{textAlign:`center`,marginBottom:`4px`,fontSize:`34px`}},[ym(e.crowns)]):null,Z(`div`,{class:`result__score`,text:String(e.breakdown.total)}),e.isRecord?Z(`div`,{style:{textAlign:`center`,margin:`10px 0 4px`}},[Z(`span`,{class:`ribbon`,text:$(`toast.newRecord`)})]):null,Z(`div`,{class:`result__lines`},t),e.match?Z(`div`,{class:`result__goals`},e.flags.map(e=>Z(`div`,{class:`result__goal${e.done?` is-done`:``}${e.main?` result__goal--main`:``}`,text:`${e.done?`★`:`☆`} ${Hm(e.goal)}`}))):null,Z(`div`,{style:{display:`flex`,gap:`10px`,flexWrap:`wrap`,justifyContent:`center`}},[e.onNext?Q($(`result.next`),{variant:`gold`,icon:`▶`,onClick:e.onNext}):null,Q($(`result.again`),{icon:`↻`,onClick:e.onAgain}),Q($(`hud.menu`),{variant:`blue`,icon:`☰`,onClick:e.onMenu})])])}function oh(e){let t=Bp[e.kind],n=Z(`div`,{style:{textAlign:`center`}}),r=Z(`div`,{class:`chest`,style:{fontSize:`120px`,lineHeight:`150px`,filter:`drop-shadow(0 10px 0 rgba(11,37,102,0.35))`},text:t.icon}),i=Z(`div`,{style:{fontWeight:`800`,marginBottom:`10px`},text:$(`chest.tap`)}),a=Z(`div`,{class:`reward-list`}),o=!1,s=()=>{if(o)return;o=!0,e.onOpen?.(),r.classList.add(`is-open`),r.style.transform=`scale(1.15)`,i.textContent=``;let t=e.reward.items,s=[{icon:`🪙`,label:`+${e.reward.coins}`,color:`#FFC93C`},...t.map(e=>({icon:e.icon,label:Km(e),color:zp[e.rarity]}))];e.reward.duplicateCoins>0&&s.push({icon:`♻️`,label:`+${e.reward.duplicateCoins} 🪙`,color:`#8FB6FF`}),s.forEach((e,t)=>{let n=Z(`div`,{class:`reward`,style:{borderColor:`#1B2450`,background:`linear-gradient(180deg, ${e.color}, rgba(0,0,0,0.15))`}},[Z(`div`,{class:`reward__icon`,text:e.icon}),Z(`div`,{text:e.label})]);window.setTimeout(()=>a.append(n),t*150)}),n.append(Q($(`common.ok`),{variant:`gold`,wide:!0,onClick:e.onDone}))};return r.addEventListener(`click`,s),n.append(r,i,a),window.setTimeout(s,2600),mm(`${$(`chest.title`)}: ${qm(e.kind)}`,[n])}function sh(e){let t=e.save.stats,n=e.save.profile,r=Z(`input`,{attrs:{type:`text`,value:n.name,maxlength:`18`,placeholder:$(`profile.defaultName`)},style:{padding:`8px 12px`,borderRadius:`12px`,border:`4px solid #1B2450`,fontFamily:`inherit`,fontWeight:`800`,fontSize:`18px`,background:`#FFF6DF`,color:`#1B2450`,width:`170px`}});r.addEventListener(`change`,()=>e.onRename(r.value.trim()));let i=(e,t)=>Z(`div`,{class:`stat`},[Z(`b`,{text:t}),Z(`span`,{text:e})]),a=t=>Np.filter(e=>e.kind===t).filter(n=>{let r=e.save.inventory;return(t===`back`?r.backs:t===`table`?r.tables:t===`mascot`?r.mascots:r.emotes).includes(n.id)}).length,o=e=>Np.filter(t=>t.kind===e).length,s=Jp(n.level);return mm($(`profile.title`),[Z(`div`,{style:{display:`flex`,gap:`12px`,alignItems:`center`,justifyContent:`center`,marginBottom:`10px`,flexWrap:`wrap`}},[Z(`div`,{style:{fontSize:`46px`},text:`👑`}),Z(`div`,{},[r,Z(`div`,{style:{fontWeight:`800`,marginTop:`4px`},text:`${$(`profile.level`)} ${n.level} · ${Ym(n.level)}`})])]),Z(`div`,{style:{height:`18px`,border:`4px solid #1B2450`,borderRadius:`10px`,background:`rgba(11,37,102,0.35)`,overflow:`hidden`,marginBottom:`12px`}},[Z(`div`,{style:{height:`100%`,width:`${Math.min(100,n.xp/s*100)}%`,background:`linear-gradient(180deg, #FFF0A8, #B8860B)`}})]),Z(`div`,{class:`stat-grid`},[i($(`profile.wins`),String(t.wins)),i($(`profile.losses`),String(t.losses)),i($(`profile.played`),String(t.played)),i($(`profile.bestScore`),String(t.bestScore)),i($(`profile.bestTime`),t.bestTimeSec?Xm(t.bestTimeSec):`—`),i($(`profile.longestCombo`),`×${t.longestCombo}`),i($(`profile.streak`),`${t.winStreak} / ${t.bestStreak}`),i($(`profile.cards`),String(t.cardsToFoundation)),i($(`common.coins`),String(n.coins)),i($(`common.crowns`),String(th(e.save)))]),Z(`div`,{style:{marginTop:`12px`,fontWeight:`800`,color:`#1B2450`},text:$(`profile.cosmetics`)}),Z(`div`,{class:`stat-grid`},[i($(`cosmetics.backs`),`${a(`back`)}/${o(`back`)}`),i($(`cosmetics.tables`),`${a(`table`)}/${o(`table`)}`),i($(`cosmetics.mascots`),`${a(`mascot`)}/${o(`mascot`)}`),i($(`cosmetics.emotes`),`${a(`emote`)}/${o(`emote`)}`)]),Z(`div`,{style:{marginTop:`14px`}},[Q($(`common.back`),{variant:`blue`,wide:!0,onClick:e.onBack})])])}function ch(e){let t=e.save.settings,n=_m([{label:$(`settings.draw1`),value:`1`},{label:$(`settings.draw3`),value:`3`}],String(t.drawCount),t=>e.onChange({drawCount:t===`3`?3:1}));return e.drawLockedByArena&&(n.classList.add(`is-locked`),n.title=$(`settings.drawLocked`)),mm($(`settings.title`),[xm($(`settings.draw`),n,$(`help.draw`)),e.drawLockedByArena?Z(`div`,{class:`settings-note`,text:$(`settings.drawLocked`)}):null,xm($(`settings.vegas`),gm(t.vegas,t=>e.onChange({vegas:t})),$(`help.vegas`)),xm($(`settings.music`),vm(t.music,t=>e.onChange({music:t}))),xm($(`settings.sfx`),vm(t.sfx,t=>e.onChange({sfx:t}))),xm($(`settings.shadows`),gm(t.shadows,t=>e.onChange({shadows:t}))),xm($(`settings.bloom`),gm(t.bloom,t=>e.onChange({bloom:t})),$(`help.bloom`)),xm($(`settings.animSpeed`),_m([{label:`0.7×`,value:`0.7`},{label:`1×`,value:`1`},{label:`1.5×`,value:`1.5`}],String(t.animSpeed),t=>e.onChange({animSpeed:Number(t)}))),xm($(`settings.leftHanded`),gm(t.leftHanded,t=>e.onChange({leftHanded:t})),$(`help.leftHanded`)),xm($(`settings.parallax`),gm(t.cameraParallax,t=>e.onChange({cameraParallax:t})),$(`help.parallax`)),Z(`div`,{style:{marginTop:`12px`}},[Q($(`common.back`),{variant:`blue`,wide:!0,onClick:e.onBack})])])}function lh(e){return mm($(`confirm.title`),[Z(`div`,{style:{fontWeight:`800`,color:`#1B2450`,marginBottom:`14px`},text:e.text}),Z(`div`,{style:{display:`flex`,gap:`10px`,justifyContent:`center`,flexWrap:`wrap`}},[Q(e.confirmLabel,{variant:`gold`,onClick:e.onConfirm}),Q($(`common.cancel`),{variant:`blue`,onClick:e.onCancel})])])}function uh(e){return mm($(`royal.title`),[Z(`div`,{style:{fontSize:`54px`,textAlign:`center`,lineHeight:`1.1`},text:`🛡️`}),Z(`div`,{style:{fontWeight:`800`,color:`#1B2450`,margin:`10px 0`},text:$(`royal.body`)}),Z(`div`,{style:{fontWeight:`800`,opacity:`0.75`,marginBottom:`12px`,color:`#1B2450`},text:$(`royal.left`,{n:e.left})}),Z(`div`,{style:{display:`flex`,gap:`10px`,justifyContent:`center`,flexWrap:`wrap`}},[Q($(`royal.watch`),{variant:`gold`,icon:`▶`,onClick:e.onWatch}),Q($(`royal.later`),{variant:`blue`,onClick:e.onCancel})])])}function dh(e){return mm($(`pause.title`),[Z(`div`,{style:{textAlign:`center`,fontWeight:`800`,marginBottom:`10px`},text:`${$(`common.seed`)} #${e.seed}`}),Z(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`10px`}},[Q($(`pause.resume`),{variant:`gold`,icon:`▶`,wide:!0,onClick:e.onResume}),Q($(`pause.restart`),{icon:`↻`,wide:!0,onClick:e.onRestart}),Q($(`pause.newDeal`),{variant:`purple`,icon:`🂠`,wide:!0,onClick:e.onNewDeal}),Q($(`menu.settings`),{variant:`blue`,icon:`⚙`,wide:!0,onClick:e.onSettings}),Q($(`pause.toMenu`),{variant:`red`,icon:`⌂`,wide:!0,onClick:e.onMenu})])])}function fh(e){if(!e)return Z(`span`,{text:`—`});let t=[Z(`span`,{text:e.priceValue})];return e.currencyImage?t.push(Z(`img`,{class:`currency-icon`,attrs:{src:e.currencyImage,alt:e.priceCurrencyCode,width:`18`,height:`18`}})):t.push(Z(`span`,{text:` ${e.priceCurrencyCode}`})),Z(`span`,{class:`price`},t)}var ph=[`back`,`table`,`mascot`,`emote`];function mh(e){let t=Z(`div`),n=Z(`div`,{style:{textAlign:`center`,marginBottom:`10px`}},[$m(e.save.profile.coins)]),r=t=>{let n=e.save.inventory;return t===`back`?n.backs:t===`table`?n.tables:t===`mascot`?n.mascots:n.emotes},i=(t,n)=>{let i=r(t.kind).includes(t.id),a=e.save.inventory.equipped,o=t.kind===`back`&&a.back===t.id||t.kind===`table`&&a.table===t.id||t.kind===`emote`&&a.emote===t.id||t.kind===`mascot`&&a.mascots.includes(t.id),s=!!t.premium&&!!e.store,c;if(i)c=Q($(o?`shop.equipped`:`shop.equip`),{size:`small`,variant:o?`blue`:`gold`,disabled:o,onClick:()=>{e.onEquip(t),n()}});else if(s){let n=e.store?.catalog?.find(e=>e.id===t.premium);c=Q(``,{size:`small`,variant:`purple`,class:`btn--premium`,title:$(`shop.premiumHint`),onClick:()=>e.store?.onBuyPremium(t)}),c.append(fh(n))}else c=Q(`${t.price} 🪙`,{size:`small`,variant:`gold`,onClick:()=>{e.onBuy(t)?n():e.onToast($(`shop.notEnough`))}});return Z(`div`,{class:`stat${s?` stat--premium`:``}`,style:{textAlign:`center`,borderColor:zp[t.rarity]}},[Z(`div`,{style:{fontSize:`30px`},text:t.icon}),Z(`div`,{style:{fontWeight:`800`},text:Km(t)}),Z(`div`,{style:{fontSize:`12px`,opacity:`0.8`},text:Jm(t.rarity)}),c])},a=()=>{hm(t),hm(n),n.append($m(e.save.profile.coins));for(let e of ph){let n=Np.filter(t=>t.kind===e&&t.price);if(n.length===0)continue;let r=Z(`div`,{class:`stat-grid`});for(let e of n)r.append(i(e,a));t.append(Z(`div`,{class:`shop-section`},[Z(`div`,{class:`shop-section__title`,text:$(`shop.cat.${e}`)}),Z(`div`,{class:`shop-section__desc`,text:$(`shop.cat.${e}Desc`)}),r]))}};return a(),mm($(`shop.title`),[n,e.store?Z(`div`,{class:`shop-premium-note`,text:`★ ${$(`shop.premiumHint`)}`}):null,t,Z(`div`,{style:{marginTop:`12px`}},[Q($(`common.back`),{variant:`blue`,wide:!0,onClick:e.onBack})])])}function hh(e){let t=e.boards[0]?.id??``,n=0,r=Z(`div`,{class:`lb`}),i=Z(`div`,{class:`lb__login`}),a=e=>Z(`div`,{class:`lb__status`,text:e}),o=e=>Z(`div`,{class:`lb__row${e.me?` is-me`:``}`},[Z(`span`,{class:`lb__rank`,text:String(e.rank)}),e.avatar?Z(`img`,{class:`lb__avatar`,attrs:{src:e.avatar,alt:``,width:`32`,height:`32`}}):Z(`span`,{class:`lb__avatar lb__avatar--empty`,text:`👤`}),Z(`span`,{class:`lb__name`,text:e.me?$(`leaderboard.you`):e.name||$(`leaderboard.hidden`)}),Z(`span`,{class:`lb__score`,text:String(e.score)})]),s=async()=>{let c=++n;hm(r),r.append(a($(`leaderboard.loading`)));let[l,u]=await Promise.all([e.load(t),e.authorized()]);if(c===n){if(hm(r),!l)r.append(a($(`leaderboard.unavailable`)));else if(l.entries.length===0)r.append(a($(`leaderboard.empty`)));else{for(let e of l.entries)r.append(o(e));l.userRank>0&&r.append(a($(`leaderboard.yourRank`,{n:l.userRank})))}hm(i),u||i.append(Z(`div`,{class:`lb__hint`,text:$(`leaderboard.loginHint`)}),Q($(`leaderboard.login`),{variant:`gold`,wide:!0,icon:`🔑`,onClick:async()=>{await e.onLogin()&&s()}}))}},c=e.boards.length>1?_m(e.boards.map(e=>({label:e.title,value:e.id})),t,e=>{t=e,s()}):null;return s(),mm($(`leaderboard.title`),[c?Z(`div`,{style:{display:`flex`,justifyContent:`center`,marginBottom:`10px`}},[c]):null,r,i,Z(`div`,{style:{marginTop:`12px`}},[Q($(`common.back`),{variant:`blue`,wide:!0,onClick:e.onBack})])])}function gh(e){return mm(e.title,[Z(`div`,{style:{fontWeight:`800`,color:`#1B2450`,marginBottom:`14px`},text:e.text}),Q($(`common.ok`),{variant:`gold`,wide:!0,onClick:e.onClose})])}var _h=61e3,vh=class{cooldownMs;last=-1/0;constructor(e=_h){this.cooldownMs=e}take(e=Date.now()){return e-this.last<this.cooldownMs?!1:(this.last=e,!0)}};function yh(e,t,n){return new Promise(r=>{let i=!1,a=e=>{i||(i=!0,r(e))},o=window.setTimeout(()=>a(n),t);e.then(e=>{window.clearTimeout(o),a(e)},()=>{window.clearTimeout(o),a(n)})})}var bh=e=>e===`yandex`||e===`vk`||e===`local`;function xh(e){if(bh(e.forced))return e.forced;let t=new URLSearchParams(e.search);if(t.has(`vk_app_id`))return`vk`;let n=t.get(`platform`);return bh(n)?n:e.hasVk?`vk`:e.hasYa?`yandex`:`local`}var Sh=(e,t,n)=>new Promise(r=>{let i=document.createElement(`div`);i.className=`ad-stub`;let a=document.createElement(`div`);a.className=`ad-stub__box`;let o=document.createElement(`div`);o.className=`ad-stub__label`,o.textContent=e;let s=document.createElement(`div`);s.className=`ad-stub__timer`;let c=document.createElement(`button`);c.className=`ad-stub__close`,c.type=`button`,c.textContent=`✕`,a.append(o,s,c),i.append(a),document.body.append(i);let l=t,u=e=>{window.clearInterval(f),i.remove(),r(e)},d=()=>{s.textContent=l>0?`${l}`:``,c.style.visibility=n||l<=0?`visible`:`hidden`,l<=0&&u(!0),--l},f=window.setInterval(d,1e3);d(),c.addEventListener(`click`,()=>u(!n&&l<=0))}),Ch=(e,t)=>{let n=/^ru/i.test(e);return t===`ad`?n?`Реклама`:`Advertisement`:n?`Ролик за награду`:`Rewarded video`},wh=class{products;granted=new Set;constructor(e){this.products=e}async catalog(){return this.products.map((e,t)=>({id:e,title:e,description:``,price:`${49+t*50} YAN`,priceValue:String(49+t*50),priceCurrencyCode:`YAN`,currencyImage:null}))}async purchase(e){let t=await Sh(`Покупка ${e}`,2,!0);return t&&this.granted.add(e),t?`ok`:`cancelled`}async restore(){return[]}},Th=class{auth=!1;mine=new Map;async authorized(){return this.auth}async requestAuth(){return this.auth=await Sh(`Вход площадки`,2,!0),this.auth}async submit(e,t){return this.auth?(this.mine.set(e,Math.max(t,this.mine.get(e)??0)),!0):!1}async entries(e){let t=[`Барсук`,`Лисёнок`,`Дракончик`,`Гоблин`,`Рыцарь`].map((e,t)=>({rank:t+1,score:5e3-t*700,name:t===3?``:e,avatar:null,me:!1})),n=this.mine.get(e);return this.auth&&n!==void 0&&t.push({rank:t.length+1,score:n,name:`Вы`,avatar:null,me:!0}),{board:e,entries:t,userRank:this.auth&&n!==void 0?t.length:0}}},Eh=class{debug;id=`local`;lang;payments;cloud=null;leaderboards;gate=new vh;constructor(e,t,n=!1){this.debug=n,this.lang=e,this.payments=t?new wh(t):null,this.leaderboards=t?new Th:null}ready(){}gameplayStart(){}gameplayStop(){}canReward(){return!0}showBanner(){}async interstitial(){return this.debug||!this.gate.take()?!1:Sh(Ch(this.lang,`ad`),2,!0)}async rewarded(){return Sh(Ch(this.lang,`reward`),4,!1)}},Dh=class{sdk;player=null;methods=new Map;cache=new Map;constructor(e){this.sdk=e}connect(e=!1){if(e||!this.player){let e=this.sdk.getPlayer;this.player=e?yh(e.call(this.sdk,{scopes:!1}),6e3,null).catch(()=>null):Promise.resolve(null)}return this.player}available(e){let t=this.methods.get(e);if(!t){let n=this.sdk.isAvailableMethod;t=n?yh(n.call(this.sdk,e),4e3,!1).catch(()=>!1):Promise.resolve(!1),this.methods.set(e,t)}return t}async authorized(){let e=await this.connect();try{return!!e?.isAuthorized?.()}catch{return!1}}async requestAuth(){return this.sdk.auth?(await yh(this.sdk.auth.openAuthDialog().then(()=>!0),12e4,!1).catch(()=>!1),this.cache.clear(),this.methods.clear(),await this.connect(!0),this.authorized()):!1}async submit(e,t){let n=this.sdk.leaderboards;if(!n||!await this.available(`leaderboards.setScore`)||!await this.authorized())return!1;let r=await yh(n.setScore(e,Math.max(0,Math.round(t))).then(()=>!0),8e3,!1).catch(()=>!1);return r&&this.cache.delete(e),r}async entries(e){let t=this.sdk.leaderboards;if(!t)return null;let n=this.cache.get(e);if(n&&Date.now()-n.at<6e4)return n.table;let r=await this.connect(),i=null;try{i=r?.getUniqueID?.()??null}catch{i=null}let a=await yh(t.getEntries(e,{quantityTop:10,includeUser:!0,quantityAround:2}),8e3,null).catch(()=>null),o=a?{board:e,userRank:a.userRank??0,entries:(a.entries??[]).map(e=>({rank:e.rank,score:e.score,name:e.player?.publicName??``,avatar:Oh(e),me:!!i&&e.player?.uniqueID===i}))}:null;return this.cache.set(e,{at:Date.now(),table:o}),o}};function Oh(e){try{return e.player?.getAvatarSrc&&e.player.getAvatarSrc(`small`)||null}catch{return null}}var kh=class{sdk;api=null;products=null;constructor(e){this.sdk=e}connect(){if(!this.api){let e=this.sdk.getPayments;this.api=e?yh(e.call(this.sdk,{signed:!1}),8e3,null).catch(()=>null):Promise.resolve(null)}return this.api}async catalog(){if(this.products)return this.products;let e=await this.connect();if(!e)return null;let t=await yh(e.getCatalog(),8e3,null).catch(()=>null);return t?(this.products=t.map(e=>({id:e.id,title:e.title,description:e.description,price:e.price,priceValue:e.priceValue,priceCurrencyCode:e.priceCurrencyCode,currencyImage:Ah(e)})),this.products):null}async purchase(e){let t=await this.connect();if(!t)return`unavailable`;let n=await this.catalog();if(!n||!n.some(t=>t.id===e))return`unavailable`;try{let n=await t.purchase({id:e});return await yh(t.consumePurchase(n.purchaseToken),8e3,void 0).catch(e=>{console.warn(`[payments] consumePurchase не подтвердился:`,e)}),`ok`}catch{return`cancelled`}}async restore(){let e=await this.connect();if(!e)return[];let t=await yh(e.getPurchases(),8e3,null).catch(()=>null);if(!t)return[];let n=[];for(let r of t)n.push(r.productID),await yh(e.consumePurchase(r.purchaseToken),8e3,void 0).catch(e=>{console.warn(`[payments] consumePurchase (restore) не подтвердился:`,e)});return n}};function Ah(e){try{return e.getPriceCurrencyImage?e.getPriceCurrencyImage(`small`):null}catch{return null}}var jh=class{sdk;player=null;constructor(e){this.sdk=e}connect(){if(!this.player){let e=this.sdk.getPlayer;this.player=e?yh(e.call(this.sdk,{scopes:!1}),6e3,null).catch(()=>null):Promise.resolve(null)}return this.player}async load(){let e=await this.connect();if(!e)return null;let t=await yh(e.getData([`save`]),6e3,null).catch(()=>null);return t&&typeof t==`object`?t.save??null:null}async save(e){let t=await this.connect();return t?yh(t.setData({save:e},!0).then(()=>!0),8e3,!1).catch(()=>!1):!1}},Mh=class{sdk;id=`yandex`;lang;payments;cloud;leaderboards;gate=new vh;constructor(e){this.sdk=e,this.lang=e.environment?.i18n?.lang||`en`,this.payments=new kh(e),this.cloud=new jh(e),this.leaderboards=new Dh(e)}ready(){this.sdk.features?.LoadingAPI?.ready?.()}gameplayStart(){this.sdk.features?.GameplayAPI?.start?.()}gameplayStop(){this.sdk.features?.GameplayAPI?.stop?.()}canReward(){return!0}showBanner(){let e=this.sdk.adv;e.getBannerAdvStatus&&e.showBannerAdv&&e.getBannerAdvStatus().then(t=>t.stickyAdvIsShowing||t.reason===`ADV_IS_NOT_CONNECTED`?null:e.showBannerAdv?.()).catch(()=>null)}interstitial(){return this.gate.take()?new Promise(e=>{let t=!1,n=n=>{t||(t=!0,e(n))};window.setTimeout(()=>n(!1),8e3);try{this.sdk.adv.showFullscreenAdv({callbacks:{onClose:e=>n(e!==!1),onError:()=>n(!1)}})}catch{n(!1)}}):Promise.resolve(!1)}rewarded(){return new Promise(e=>{let t=!1,n=!1,r=()=>{n||(n=!0,e(t))};window.setTimeout(r,6e4);try{this.sdk.adv.showRewardedVideo({callbacks:{onRewarded:()=>{t=!0},onClose:r,onError:r}})}catch{r()}})}},Nh=class{bridge;id=`vk`;lang=`ru`;payments=null;cloud=null;leaderboards=null;gate=new vh;rewardAvailable=!0;constructor(e){this.bridge=e,yh(this.bridge.send(`VKWebAppInit`),4e3,null).catch(()=>null)}send(e,t,n){return yh(this.bridge.send(e,t).then(e=>e?.result===!0),n,!1)}ready(){this.send(`VKWebAppCheckNativeAds`,{ad_format:`reward`},5e3).then(e=>{this.rewardAvailable=e})}gameplayStart(){}gameplayStop(){}canReward(){return this.rewardAvailable}showBanner(){this.send(`VKWebAppShowBannerAd`,{banner_location:`bottom`,layout_type:`resize`},1e4)}async interstitial(){return!this.gate.take()||!await this.send(`VKWebAppCheckNativeAds`,{ad_format:`interstitial`},5e3)?!1:this.send(`VKWebAppShowNativeAds`,{ad_format:`interstitial`},15e3)}async rewarded(){let e=await this.send(`VKWebAppCheckNativeAds`,{ad_format:`reward`},5e3);if(this.rewardAvailable=e,!e)return!1;let t=await this.send(`VKWebAppShowNativeAds`,{ad_format:`reward`},6e4);return this.send(`VKWebAppCheckNativeAds`,{ad_format:`reward`},5e3).then(e=>{this.rewardAvailable=e}),t}},Ph=()=>typeof navigator>`u`?`en`:navigator.language||`en`;async function Fh(e={}){let t=window,n=e.timeoutMs??7e3,r=new URLSearchParams(window.location.search).has(`debug`),i=new Eh(Ph(),r?e.stubProducts??null:null,r),a=xh({forced:t.GAME_PLATFORM,search:window.location.search,hasVk:!!t.vkBridge,hasYa:!!t.YaGames});if(a===`vk`)return t.vkBridge?new Nh(t.vkBridge):(console.warn(`[platform] сборка для ВК, но vkBridge не загрузился — играем без площадки`),i);if(a===`yandex`){if(!t.YaGames)return console.warn(`[platform] сборка для Яндекса, но YaGames не загрузился — играем без площадки`),i;try{let e=await yh(t.YaGames.init(),n,null);return e?new Mh(e):i}catch{return i}}return i}var Ih=3,Lh=class{uiRoot;app;store=new dm;screens;hud;phase=`menu`;currentMatch=null;audioUnlocked=!1;goalReached=!1;matchBanked=!1;platform=null;royalHelpLeft=Ih;adBusy=!1;gameplayActive=!1;catalog=null;cloudTimer=null;cloudBusy=!1;cloudDirty=!1;pendingToast=null;diagnostics(){let e=this.app.music;return{...this.app.diagnostics(),phase:this.phase,platform:this.platform?`${this.platform.id} (${this.platform.lang})`:`detecting…`,lang:this.save.settings.lang,music:`${e.currentMood} · ${e.usingFiles?`files`:`synth`} · ${e.isPlaying?`on`:`off`}`,shop:this.platform?.payments?this.catalog?`catalog ${this.catalog.length}`:`catalog —`:`coins only`,cloud:this.platform?.cloud?this.cloudDirty?`pending`:`synced`:`none`}}constructor(e,t){this.uiRoot=t,this.app=new xp(e),this.screens=new Qm(t),this.screens.onVisibility=e=>this.hud?.setBlocked(e)}buildHud(){this.hud=new Zm(this.uiRoot,{onUndo:()=>this.undo(),onHint:()=>this.app.hint(),onMenu:()=>this.openPause(),onCollect:()=>this.app.autoComplete(),onFinish:()=>this.finishMatchEarly(),onRestart:()=>this.askRestart(),onNewDeal:()=>this.askNewDeal(),onMute:()=>this.toggleMute()})}get game(){return this.app}get save(){return this.store.state}async boot(){this.platform=await Fh({stubProducts:Ip});let e=this.resolveLanguage(this.platform.lang);this.store.update(t=>{t.settings.lang=e,t.settings.cardLang=Rm(e)}),Bm(e),document.documentElement.lang=e,await this.syncFromCloud(),this.buildHud(),this.app.cardLang=Rm(e),this.app.initialMascots=this.equippedMascots(),await this.app.boot(),this.applyDeviceQuality(),this.applySettings(),this.app.seedPool.load(this.save.seeds.draw1,this.save.seeds.draw3),this.app.on(`score`,e=>this.onScoreEvent(e)),this.app.on(`state`,()=>this.onStateChanged()),this.app.on(`tick`,()=>{let e=this.app.game;e&&this.phase===`match`&&(this.hud.setTime(e.seconds),this.updateMood(e))}),this.app.on(`win`,()=>this.onWin()),this.app.on(`idle`,e=>{e?.reason===`no-moves`&&this.hud.toast($(`toast.noMoves`)),e?.reason===`draw-stock`&&this.hud.toast($(`toast.drawStock`))}),this.app.on(`fountain-end`,()=>{this.phase===`match`&&this.showResults(!0)}),this.app.onQualityDowngrade=e=>{this.updateSettings(e===`bloom`?{bloom:!1}:{shadows:!1}),this.hud.toast($(e===`bloom`?`toast.bloomOff`:`toast.shadowsOff`))},this.store.onWriteError=()=>{console.warn(`[save] запись в localStorage не удалась — прогресс может не сохраниться`),this.hud.toast($(`toast.saveFailed`))},this.app.onRoyalHelpOffer=e=>this.offerRoyalHelp(e),window.addEventListener(`keydown`,this.onKeyDown),window.addEventListener(`pointerdown`,this.unlockAudio,{once:!1}),document.addEventListener(`visibilitychange`,this.onVisibility),window.addEventListener(`beforeunload`,()=>{this.persistGame(!0),this.flushCloud()}),this.store.onFlushed=()=>this.scheduleCloudSave(),this.scheduleCloudSave(),this.openMenu(),this.pendingToast&&=(this.hud.toast(this.pendingToast),null),this.platform.ready(),this.platform.showBanner(),this.restorePurchases().then(()=>this.loadCatalog()).then(()=>this.submitScores())}submitting=!1;async submitScores(){let e=this.platform?.leaderboards;if(!e||this.submitting)return;let t=Zp(this.save);if(t.length!==0){this.submitting=!0;try{if(!await e.authorized())return;for(let n of t)await e.submit(n.id,n.score)&&this.store.update(e=>void(e.leaderboards[n.id]=n.score)),await new Promise(e=>window.setTimeout(e,1100))}finally{this.submitting=!1}}}openLeaderboard(){let e=this.platform?.leaderboards;e&&(this.app.audio.play(`ui`),this.screens.show(`leaderboard`,hh({boards:Xp.map(e=>({id:e.id,title:$(e.titleKey)})),authorized:()=>e.authorized(),load:t=>e.entries(t),onLogin:async()=>{let t=await e.requestAuth();return t&&await this.submitScores(),t},onBack:()=>this.openMenu()})))}resolveLanguage(e){return Im(new URLSearchParams(window.location.search).get(`lang`)||e)}async syncFromCloud(){let e=this.platform?.cloud;if(!e)return;let t=await e.load().catch(()=>null);if(!t)return;let{data:n,cloudWon:r}=pm(this.save,t);this.store.adopt(n),r&&(this.pendingToast=$(`toast.cloudSync`))}scheduleCloudSave(){this.platform?.cloud&&(this.cloudDirty=!0,this.cloudTimer===null&&(this.cloudTimer=window.setTimeout(()=>{this.cloudTimer=null,this.flushCloud()},5e3)))}async flushCloud(){let e=this.platform?.cloud;if(!e||!this.cloudDirty||this.cloudBusy)return;this.cloudTimer!==null&&(window.clearTimeout(this.cloudTimer),this.cloudTimer=null),this.cloudBusy=!0,this.cloudDirty=!1;let t=await e.save(this.save).catch(()=>!1);this.cloudBusy=!1,t||(this.cloudDirty=!0)}async loadCatalog(){let e=this.platform?.payments;e&&(this.catalog=await e.catalog().catch(()=>null),this.screens.name===`shop`&&this.openShop(!0))}async restorePurchases(){let e=this.platform?.payments;if(!e)return;let t=await e.restore().catch(()=>[]);for(let e of t){let t=Lp(e);t&&(this.grant(t),this.hud.toast($(`shop.restored`,{name:Km(t)})))}}grant(e){this.store.update(t=>{let n=e.kind===`back`?t.inventory.backs:e.kind===`table`?t.inventory.tables:e.kind===`mascot`?t.inventory.mascots:t.inventory.emotes;n.includes(e.id)||n.push(e.id)},!0)}async buyPremium(e){let t=this.platform?.payments;if(!t||!e.premium)return;if(this.catalog||=await t.catalog().catch(()=>null),!this.catalog?.find(t=>t.id===e.premium)){this.showNotice($(`shop.unavailableTitle`),$(`shop.unavailable`));return}this.app.audio.play(`ui`);let n=await t.purchase(e.premium);n===`ok`?(this.grant(e),this.app.audio.play(`chest`),this.hud.toast($(`shop.purchased`,{name:Km(e)})),this.openShop(!0)):n===`unavailable`?this.showNotice($(`shop.unavailableTitle`),$(`shop.unavailable`)):this.hud.toast($(`shop.purchaseFailed`))}showNotice(e,t){this.app.audio.play(`error`),this.screens.show(`notice`,gh({title:e,text:t,onClose:()=>this.openShop(!0)}))}setGameplay(e){this.gameplayActive!==e&&(this.gameplayActive=e,e?this.platform?.gameplayStart():this.platform?.gameplayStop())}masterVolume(){return+!this.save.settings.muted}applyDeviceQuality(){let e=this.save.settings;Yf()&&!e.qualityByPlayer&&e.bloom&&this.store.update(e=>{e.settings.bloom=!1})}applySettings(){let e=this.save.settings;Bm(Im(e.lang)),this.app.audio.setVolumes({master:this.masterVolume(),sfx:e.sfx,music:e.music}),this.hud.setMuted(e.muted),this.app.setQuality({shadows:e.shadows,bloom:e.bloom}),this.app.setAnimationSpeed(e.animSpeed),this.app.setLeftHanded(e.leftHanded),this.app.setCameraParallax(e.cameraParallax),this.app.setBackSkin(this.save.inventory.equipped.back),this.app.setTableSkin(this.save.inventory.equipped.table===`green-felt`?null:this.save.inventory.equipped.table),this.applyMascots()}equippedMascots(){let e=this.save.inventory.mascots,t=this.save.inventory.equipped.mascots.filter(t=>Jd.includes(t)&&e.includes(t)).slice(0,3);return t.length?t:[`badger`]}applyMascots(){this.app.initialMascots=this.equippedMascots(),this.app.setMascots(this.app.initialMascots)}updateSettings(e){this.store.update(t=>{t.settings={...t.settings,...e}});let t=this.save.settings;this.app.audio.setVolumes({master:this.masterVolume(),sfx:t.sfx,music:t.music}),(e.shadows!==void 0||e.bloom!==void 0)&&this.app.setQuality({shadows:t.shadows,bloom:t.bloom}),e.animSpeed!==void 0&&this.app.setAnimationSpeed(t.animSpeed),e.leftHanded!==void 0&&this.app.setLeftHanded(t.leftHanded),e.cameraParallax!==void 0&&this.app.setCameraParallax(t.cameraParallax),e.drawCount!==void 0&&this.applyDrawCount(e.drawCount),e.vegas!==void 0&&this.hud.setVegas(t.vegas),e.muted!==void 0&&this.hud.setMuted(t.muted),e.music!==void 0&&t.music<=.001?this.app.music.stop():e.music!==void 0&&this.audioUnlocked&&!this.app.music.isPlaying&&this.app.music.start()}toggleMute(){this.unlockAudio(),this.updateSettings({muted:!this.save.settings.muted})}applyDrawCount(e){let t=this.app.game;if(this.phase===`match`&&t){if(this.currentMatch){this.hud.toast($(`settings.drawLocked`));return}if(t.drawCount!==e){if(t.moves===0){this.startMatch({arena:this.app.arena,match:null,drawCount:e}),this.hud.toast($(`toast.drawApplied`,{n:e}));return}window.confirm($(`confirm.drawRestart`,{n:e}))?(this.screens.hide(),this.app.pause(!1),this.startMatch({arena:this.app.arena,match:null,drawCount:e}),this.hud.toast($(`toast.drawApplied`,{n:e}))):this.hud.toast($(`toast.drawNextDeal`,{n:e}))}}}unlockAudio=()=>{this.audioUnlocked||(this.audioUnlocked=!0,this.app.audio.init(),this.app.audio.setVolumes({master:this.masterVolume(),sfx:this.save.settings.sfx,music:this.save.settings.music}),this.app.music.setMood(this.phase===`match`?`play`:`menu`),this.save.settings.music>.001&&this.app.music.start())};onVisibility=()=>{document.hidden?(this.persistGame(!0),this.app.audio.suspend(),this.flushCloud()):this.app.audio.resume()};openMenu(){this.phase=`menu`,this.setGameplay(!1),this.app.interactive=!1,this.app.pause(!1),this.hud.hide(),this.app.stage.setCameraMode(`menu`),this.app.music.setMood(`menu`),this.app.showMenuDemo(),this.screens.show(`menu`,nh({save:this.save,hasSavedGame:!!this.save.current,onPlay:()=>this.startQuickMatch(),onContinue:()=>this.continueSaved(),onArenas:()=>this.openArenas(),onProfile:()=>this.openProfile(),onSettings:()=>this.openSettings(()=>this.openMenu()),onShop:()=>this.openShop(),onSeed:e=>this.startSeedMatch(e),onLeaderboard:this.platform?.leaderboards?()=>this.openLeaderboard():null}))}openArenas(){this.app.audio.play(`ui`),this.screens.show(`arenas`,ih({save:this.save,onBack:()=>this.openMenu(),onStart:(e,t)=>this.startArenaMatch(e,t)}))}openProfile(){this.app.audio.play(`ui`),this.screens.show(`profile`,sh({save:this.save,onBack:()=>this.openMenu(),onRename:e=>this.store.update(t=>void(t.profile.name=e))}))}openShop(e=!1){e||this.app.audio.play(`ui`),this.screens.show(`shop`,mh({save:this.save,onBack:()=>this.openMenu(),onToast:e=>this.hud.toast(e),onBuy:e=>this.buyItem(e),onEquip:e=>this.equipItem(e),store:this.platform?.payments?{catalog:this.catalog,onBuyPremium:e=>void this.buyPremium(e)}:null}))}openSettings(e){this.app.audio.play(`ui`),this.screens.show(`settings`,ch({save:this.save,drawLockedByArena:this.phase===`match`&&!!this.currentMatch,onChange:e=>this.updateSettings(e.shadows!==void 0||e.bloom!==void 0?{...e,qualityByPlayer:!0}:e),onBack:e,onToast:e=>this.hud.toast(e)}))}openPause(){this.phase===`match`&&(this.app.audio.play(`uiBack`),this.app.pause(!0),this.setGameplay(!1),this.persistGame(!0),this.screens.show(`pause`,dh({seed:this.app.game?.seed??0,onResume:()=>this.closePause(),onRestart:()=>this.askRestart(),onNewDeal:()=>this.askNewDeal(),onSettings:()=>this.openSettings(()=>this.openPause()),onMenu:()=>{this.abandonMatch(),this.openMenu()}})))}closePause(){this.app.audio.play(`ui`),this.screens.hide(),this.app.pause(!1),this.phase===`match`&&this.setGameplay(!0)}async beginPlay(e){if(this.adBusy)return;this.screens.hide();let t=this.phase===`match`;t&&this.app.pause(!0),await this.showInterstitial(),t&&this.app.pause(!1),e()}async showInterstitial(){let e=this.platform;if(!e||this.adBusy)return;this.adBusy=!0;let t=this.phase===`match`;t&&this.setGameplay(!1),this.app.audio.suspend();try{await e.interstitial(`deal`)}catch{}document.hidden||this.app.audio.resume(),t&&this.setGameplay(!0),this.adBusy=!1}askRestart(){let e=this.app.game;if(e&&this.phase===`match`){if(e.moves===0){this.restartMatch();return}this.app.audio.play(`uiBack`),this.app.pause(!0),this.setGameplay(!1),this.screens.show(`confirm`,lh({text:$(`confirm.restart`),confirmLabel:$(`pause.restart`),onConfirm:()=>void this.restartMatch(),onCancel:()=>this.closePause()}))}}askNewDeal(){let e=this.app.game;if(e&&this.phase===`match`){if(e.moves===0){this.newDeal();return}this.app.audio.play(`uiBack`),this.app.pause(!0),this.setGameplay(!1),this.screens.show(`confirm`,lh({text:$(`confirm.newDeal`),confirmLabel:$(`pause.newDeal`),onConfirm:()=>void this.newDeal(),onCancel:()=>this.closePause()}))}}restartMatch(){let e=this.app.game;if(!e)return Promise.resolve();let t=e.seed,n=e.drawCount,r=this.app.dealVerified;return this.beginPlay(()=>this.startMatch({seed:t,drawCount:n,arena:this.app.arena,match:this.currentMatch,trustSeed:r}))}newDeal(){return this.beginPlay(()=>this.startMatch({arena:this.app.arena,match:this.currentMatch}))}offerRoyalHelp(e){let t=this.platform;return!t||!t.canReward()||this.phase!==`match`||this.screens.isOpen?!1:this.royalHelpLeft<=0?(this.hud.toast($(`royal.none`)),!1):(this.app.audio.play(`ui`),this.app.pause(!0),this.setGameplay(!1),this.screens.show(`royal`,uh({left:this.royalHelpLeft,onWatch:()=>void this.watchRoyalHelp(e),onCancel:()=>this.closePause()})),!0)}async watchRoyalHelp(e){let t=this.platform;if(!t)return;this.screens.hide(),this.setGameplay(!1),this.app.audio.suspend();let n=await t.rewarded(`royal-help`).catch(()=>!1);if(document.hidden||this.app.audio.resume(),this.app.pause(!1),this.setGameplay(!0),!n){this.hud.toast($(`royal.failed`));return}if(!this.app.applyMove(e,`royal`,{royalHelp:!0})){this.hud.toast($(`royal.failed`));return}--this.royalHelpLeft,this.hud.toast($(`royal.spent`))}startQuickMatch(){this.app.audio.play(`ui`),this.beginPlay(()=>this.startMatch({arena:this.app.arena,match:null,drawCount:this.save.settings.drawCount}))}startSeedMatch(e){if(!e){this.startQuickMatch();return}this.app.audio.play(`ui`),this.beginPlay(()=>this.startMatch({arena:this.app.arena,match:null,seed:wu(e),drawCount:this.save.settings.drawCount}))}startArenaMatch(e,t){this.app.audio.play(`ui`),this.beginPlay(()=>this.startMatch({arena:e,match:t}))}startMatch(e){this.screens.hide(),this.currentMatch=e.match,this.goalReached=!1,this.matchBanked=!1,this.royalHelpLeft=Ih,this.phase=`match`,this.setGameplay(!0),this.app.music.setMood(`play`),this.hud.show(),this.hud.setCollectVisible(!1),this.hud.setFinishVisible(!1),this.hud.setVegas(this.save.settings.vegas),this.hud.setGoal(e.match&&e.match.goal.kind!==`win`?Hm(e.match.goal):null),this.app.startMatch({arenaId:e.arena.id,matchId:e.match?.id,seed:e.seed,trustSeed:e.trustSeed,drawCount:e.drawCount??(e.match?e.arena.drawCount:this.save.settings.drawCount),vegas:this.save.settings.vegas}),this.store.update(e=>{e.stats.played+=1}),this.app.dealVerified||this.hud.toast($(`toast.unverifiedSeed`,{n:this.app.game?.seed??0})),this.onStateChanged()}continueSaved(){let e=this.save.current;if(!e){this.startQuickMatch();return}let t=Ep(e.game);if(!t){this.store.update(e=>void(e.current=null)),this.startQuickMatch();return}let n=_p(e.arenaId),r=e.matchId?n.matches.find(t=>t.id===e.matchId)??null:null;this.currentMatch=r,this.goalReached=!1,this.matchBanked=!1,this.royalHelpLeft=Ih,this.phase=`match`,this.setGameplay(!0),this.screens.hide(),this.hud.show(),this.hud.setVegas(t.vegas),this.hud.setGoal(r&&r.goal.kind!==`win`?Hm(r.goal):null),this.app.audio.play(`ui`),this.app.music.setMood(`play`),this.app.resumeGame(t,n,r?.id??null),this.onStateChanged()}undo(){let e=this.app.game;if(e){if(e.undoUsed>=this.app.undoLimit){this.hud.toast($(`toast.undoLimit`)),this.app.audio.play(`error`);return}this.app.undo()}}onStateChanged(){let e=this.app.game;if(!e)return;let t=this.app.undoLimit===1/0?1/0:Math.max(0,this.app.undoLimit-e.undoUsed);if(this.hud.setStats({score:e.score,seconds:e.seconds,moves:e.moves,undoLeft:e.canUndo?t:0}),this.hud.setCollectVisible(this.app.canAutoComplete()),this.persistGame(!1),this.updateMood(e),this.currentMatch&&!this.goalReached&&!e.won){let t=this.buildResult(e,!1);yp(this.currentMatch.goal,t)&&this.currentMatch.goal.kind!==`win`&&(this.goalReached=!0,this.hud.setFinishVisible(!0),this.hud.toast($(`toast.goalDone`)),this.app.audio.play(`crown`))}!e.won&&this.phase===`match`&&e.legalMoves().length===0&&this.showResults(!1)}onScoreEvent(e){if(!e?.effect)return;let t=this.app.screenPosOfWorld(e.worldPos),n=e.effect.scoreDelta;n>0&&(this.hud.floater(t.x,t.y,`+${n}`,`score`),e.effect.comboLevel>=1&&this.hud.floater(t.x,t.y-34,$(`hud.combo`,{n:e.effect.combo}),`combo`))}onWin(){if(!this.app.game)return;this.hud.setCollectVisible(!1),this.hud.setFinishVisible(!1),this.store.update(e=>void(e.current=null),!0);let e=Pp(`emote`,this.save.inventory.equipped.emote);e&&this.hud.sticker(e.icon),this.app.timeline.after(9,()=>{this.phase===`match`&&this.showResults(!0)},`win-fallback`)}buildResult(e,t){return{won:t,score:e.score,seconds:e.seconds,moves:e.moves,undoUsed:e.undoUsed,bestCombo:e.bestCombo,foundationCards:e.foundationCount}}finishMatchEarly(){this.phase===`match`&&this.showResults(!1)}abandonMatch(){let e=this.app.game;e&&!this.matchBanked&&(e.moves>15&&!e.won&&this.store.update(e=>{e.stats.losses+=1,e.stats.winStreak=0}),this.persistGame(!0))}updateMood(e){this.phase!==`match`||e.won||this.app.music.currentMood!==`tense`&&Rh(this.currentMatch,e.seconds,e.moves)&&this.app.music.setMood(`tense`)}showResults(e){let t=this.app.game;if(!t||this.matchBanked)return;this.matchBanked=!0,this.phase=`results`,this.setGameplay(!1),this.app.interactive=!1,this.app.stopFountain(),this.hud.hide(),this.app.music.setMood(`menu`);let n=this.buildResult(t,e||t.won),r=t.finalScore(),i=this.currentMatch,a=i?bp(i,n):[],o=a.filter(e=>e.done).length,s=Gp(o,r.total,n.won),c=this.app.arena,l=!1,u=th(this.save);this.store.update(e=>{e.current=null;let t=e.stats;n.won?(t.wins+=1,t.winStreak+=1,t.bestStreak=Math.max(t.bestStreak,t.winStreak),(!t.bestTimeSec||n.seconds<t.bestTimeSec)&&(t.bestTimeSec=n.seconds,l=!0)):(t.losses+=1,t.winStreak=0),r.total>t.bestScore&&(t.bestScore=r.total,l=!0),t.longestCombo=Math.max(t.longestCombo,n.bestCombo),t.totalTimeSec+=n.seconds,t.cardsToFoundation+=n.foundationCards,e.profile.coins+=s;let a=Math.round(20+o*25+r.total*.05+(n.won?40:0)),u=Yp(e.profile.level,e.profile.xp,a);if(e.profile.level=u.level,e.profile.xp=u.xp,u.levelUps>0&&this.hud.toast($(`toast.levelUp`,{n:u.level})),i){let t=e.arenas[c.id]??{},a=t[i.id]??{crowns:0,bestScore:0,bestTimeSec:0,plays:0};t[i.id]={crowns:Math.max(a.crowns,o),bestScore:Math.max(a.bestScore,r.total),bestTimeSec:a.bestTimeSec&&n.won?Math.min(a.bestTimeSec,n.seconds):n.won?n.seconds:a.bestTimeSec,plays:a.plays+1},e.arenas[c.id]=t}let d=this.app.seedPool.export();e.seeds={draw1:d.draw1,draw3:d.draw3}},!0),this.submitScores();let d=th(this.save);for(let e of gp)e.unlockCrowns>u&&e.unlockCrowns<=d&&(this.hud.toast($(`toast.unlocked`,{name:Um(e)})),this.app.audio.play(`crown`));n.won?this.app.audio.play(`crown`):this.app.audio.play(`lose`);let f=i?this.nextMatchOf(c,i):null;this.screens.show(`results`,ah({won:n.won,result:n,breakdown:r,match:i,flags:a,crowns:o,coins:s,isRecord:l,onAgain:()=>void this.beginPlay(()=>this.startMatch({arena:c,match:i,drawCount:t.drawCount})),onNext:f?()=>void this.beginPlay(()=>this.startMatch({arena:c,match:f})):null,onMenu:()=>{let e=i?Wp(o,c.reward.chest):null;e?this.openChest(e):this.openMenu()}}))}nextMatchOf(e,t){let n=e.matches.findIndex(e=>e.id===t.id);return n>=0&&n+1<e.matches.length?e.matches[n+1]:null}openChest(e){let t=Up(e,this.save.inventory,Date.now());this.store.update(e=>{e.profile.coins+=t.coins+t.duplicateCoins,e.stats.chestsOpened+=1;for(let n of t.items){let t=n.kind===`back`?e.inventory.backs:n.kind===`table`?e.inventory.tables:n.kind===`mascot`?e.inventory.mascots:e.inventory.emotes;t.includes(n.id)||t.push(n.id)}},!0),this.screens.show(`chest`,oh({kind:e,reward:t,onOpen:()=>{this.app.audio.play(`chest`),this.app.particles.confetti(this.app.board.group.position.clone().setY(2),90,3,4)},onDone:()=>this.openMenu()}))}buyItem(e){return!e.price||this.save.profile.coins<e.price?!1:(this.store.update(t=>{t.profile.coins-=e.price;let n=e.kind===`back`?t.inventory.backs:e.kind===`table`?t.inventory.tables:e.kind===`mascot`?t.inventory.mascots:t.inventory.emotes;n.includes(e.id)||n.push(e.id)},!0),this.app.audio.play(`coin`),!0)}equipItem(e){this.store.update(t=>{if(e.kind===`back`&&(t.inventory.equipped.back=e.id),e.kind===`table`&&(t.inventory.equipped.table=e.id),e.kind===`emote`&&(t.inventory.equipped.emote=e.id),e.kind===`mascot`){let n=t.inventory.equipped.mascots,r=n.indexOf(e.id);r>=0?n.length>1&&n.splice(r,1):(n.length>=3&&n.shift(),n.push(e.id))}},!0),e.kind===`back`&&this.app.setBackSkin(e.id),e.kind===`table`&&this.app.setTableSkin(e.id===`green-felt`?null:e.id),e.kind===`mascot`&&(this.applyMascots(),this.save.inventory.equipped.mascots.includes(e.id)&&this.hud.toast($(`toast.mascotEquipped`,{name:Km(e)}))),this.app.audio.play(`ui`)}persistGame(e){let t=this.app.game;t&&this.phase===`match`&&!t.won&&this.store.update(e=>{e.current={game:wp(t),arenaId:this.app.arena.id,matchId:this.currentMatch?.id??null}},e)}onKeyDown=e=>{let t=e.target?.tagName;if(t===`INPUT`||t===`TEXTAREA`)return;if(this.unlockAudio(),e.key===`Escape`){e.preventDefault(),this.screens.name===`pause`?this.closePause():this.phase===`match`?this.openPause():this.screens.name&&this.screens.name!==`menu`&&this.openMenu();return}if(this.app.inCutscene){this.app.skipCutscene();return}if(this.phase!==`match`||this.screens.isOpen)return;let n=e.key.toLowerCase();(e.ctrlKey||e.metaKey)&&n===`z`?(e.preventDefault(),this.undo()):n===`z`||n===`я`?this.undo():n===`h`||n===`р`?this.app.hint():n===`n`||n===`т`?this.newDeal():n===` `&&(e.preventDefault(),this.app.canAutoComplete()&&this.app.autoComplete())};handleCanvasTap(){if(this.unlockAudio(),this.app.inCutscene){this.app.skipCutscene();return}this.phase===`match`&&this.app.game?.won&&this.showResults(!0)}start(){let e=t=>{this.app.frame(t),requestAnimationFrame(e)};requestAnimationFrame(e)}};function Rh(e,t,n){if(!e)return!1;for(let r of[e.goal,...e.bonus])if(r.kind===`time`&&t>=r.seconds-75||r.kind===`moves`&&n>=r.value-25)return!0;return!1}function zh(e,t){let n=document.createElement(`pre`);n.className=`diag`,e.appendChild(n);let r=[],i=e=>{r.push(e),r.length>6&&r.shift()};window.addEventListener(`error`,e=>{let t=(e.filename||``).split(`/`).pop()??``;i(`${e.message} @ ${t}:${e.lineno}`)}),window.addEventListener(`unhandledrejection`,e=>{i(`promise: ${String(e.reason)}`)});let a=()=>{let e=[navigator.userAgent,`dpr ${window.devicePixelRatio} · ${window.innerWidth}×${window.innerHeight}`,...Object.entries(t()).map(([e,t])=>`${e}: ${String(t)}`),...r.map(e=>`! ${e}`)];n.textContent=e.join(`
`)};a(),window.setInterval(a,1e3)}var Bh=document.getElementById(`scene`),Vh=document.getElementById(`ui-root`),Hh=document.getElementById(`boot`),Uh=()=>({});new URLSearchParams(window.location.search).has(`diag`)&&zh(document.body,()=>Uh());async function Wh(){let e=new Lh(Bh,Vh);Uh=()=>e.diagnostics(),await e.boot(),Bh.addEventListener(`pointerdown`,()=>e.handleCanvasTap()),Hh?.classList.add(`hidden`),window.setTimeout(()=>Hh?.remove(),600),e.start(),new URLSearchParams(window.location.search).has(`debug`)&&(window.shell=e)}Wh().catch(e=>{let t=e instanceof Error?e.message:String(e);if(Hh){Hh.classList.remove(`hidden`);let e=Hh.querySelector(`.boot__hint`);e&&(e.textContent=`Не удалось запустить игру / Failed to start: ${t}`)}console.error(e)});