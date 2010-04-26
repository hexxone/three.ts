// three.js r4 - http://github.com/mrdoob/three.js
(function(){var a=false,b=/xyz/.test(function(){xyz})?/\b_super\b/:/.*/;this.Class=function(){};Class.extend=function(g){var f=this.prototype;a=true;var e=new this();a=false;for(var d in g){e[d]=typeof g[d]=="function"&&typeof f[d]=="function"&&b.test(g[d])?(function(h,i){return function(){var l=this._super;this._super=f[h];var k=i.apply(this,arguments);this._super=l;return k}})(d,g[d]):g[d]}function c(){if(!a&&this.init){this.init.apply(this,arguments)}}c.prototype=e;c.constructor=c;c.extend=arguments.callee;return c}})();var Color=Class.extend({r:null,g:null,b:null,a:null,hex:null,styleString:null,init:function(a){this.setHex(a?a:4278190080)},setHex:function(a){this.hex=a;this.updateRGBA();this.updateStyleString()},setRGBA:function(f,e,c,d){this.r=f;this.g=e;this.b=c;this.a=d;this.updateHex();this.updateStyleString()},updateHex:function(){this.hex=this.a<<24|this.r<<16|this.g<<8|this.b},updateRGBA:function(){this.r=this.hex>>16&255;this.g=this.hex>>8&255;this.b=this.hex&255;this.a=this.hex>>24&255},updateStyleString:function(){this.styleString="rgba("+this.r+","+this.g+","+this.b+","+(this.a/255)+")"},toString:function(){return"Color ( r: "+this.r+", g: "+this.g+", b: "+this.b+", a: "+this.a+", hex: "+this.hex+", style: "+this.styleString+" )"}});var Vector3=Class.extend({x:null,y:null,z:null,dx:null,dy:null,dz:null,tx:null,ty:null,tz:null,init:function(a,c,b){this.x=a?a:0;this.y=c?c:0;this.z=b?b:0},copy:function(a){this.x=a.x;this.y=a.y;this.z=a.z},addSelf:function(a){this.x+=a.x;this.y+=a.y;this.z+=a.z},add:function(b,a){this.x=b.x+a.x;this.y=b.y+a.y;this.z=b.z+a.z},subSelf:function(a){this.x-=a.x;this.y-=a.y;this.z-=a.z},sub:function(b,a){this.x=b.x-a.x;this.y=b.y-a.y;this.z=b.z-a.z},cross:function(a){this.tx=this.x;this.ty=this.y;this.tz=this.z;this.x=this.ty*a.z-this.tz*a.y;this.y=this.tz*a.x-this.tx*a.z;this.z=this.tx*a.y-this.ty*a.x},multiply:function(a){this.x*=a;this.y*=a;this.z*=a},distanceTo:function(a){this.dx=this.x-a.x;this.dy=this.y-a.y;this.dz=this.z-a.z;return Math.sqrt(this.dx*this.dx+this.dy*this.dy+this.dz*this.dz)},distanceToSquared:function(a){this.dx=this.x-a.x;this.dy=this.y-a.y;this.dz=this.z-a.z;return this.dx*this.dx+this.dy*this.dy+this.dz*this.dz},length:function(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)},lengthSq:function(){return this.x*this.x+this.y*this.y+this.z*this.z},negate:function(){this.x=-this.x;this.y=-this.y;this.z=-this.z},normalize:function(){if(this.length()>0){this.ool=1/this.length()}else{this.ool=0}this.x*=this.ool;this.y*=this.ool;this.z*=this.ool;return this},dot:function(a){return this.x*a.x+this.y*a.y+this.z*a.z},clone:function(){return new Vector3(this.x,this.y,this.z)},toString:function(){return"Vector3 ("+this.x+", "+this.y+", "+this.z+")"}});Vector3.add=function(d,c){return new Vector3(d.x+c.x,d.y+c.y,d.z+c.z)};Vector3.sub=function(d,c){return new Vector3(d.x-c.x,d.y-c.y,d.z-c.z)};Vector3.multiply=function(b,c){return new Vector3(b.x*c,b.y*c,b.z*c)};Vector3.cross=function(d,c){return new Vector3(d.y*c.z-d.z*c.y,d.z*c.x-d.x*c.z,d.x*c.y-d.y*c.x)};Vector3.dot=function(d,c){return d.x*c.x+d.y*c.y+d.z*c.z};var Matrix4=Class.extend({n11:null,n12:null,n13:null,n14:null,n21:null,n22:null,n23:null,n24:null,n31:null,n32:null,n33:null,n34:null,x:null,y:null,z:null,init:function(){this.identity()},identity:function(){this.n11=1;this.n12=0;this.n13=0;this.n14=0;this.n21=0;this.n22=1;this.n23=0;this.n24=0;this.n31=0;this.n32=0;this.n33=1;this.n34=0;this.x=new Vector3(0,0,0);this.y=new Vector3(0,0,0);this.z=new Vector3(0,0,0)},lookAt:function(c,b,a){this.z.sub(b,c);this.z.normalize();this.x.copy(this.z);this.x.cross(a);this.x.normalize();this.y.copy(this.x);this.y.cross(this.z);this.y.normalize();this.y.negate();this.n11=this.x.x;this.n12=this.x.y;this.n13=this.x.z;this.n14=-this.x.dot(c);this.n21=this.y.x;this.n22=this.y.y;this.n23=this.y.z;this.n24=-this.y.dot(c);this.n31=this.z.x;this.n32=this.z.y;this.n33=this.z.z;this.n34=-this.z.dot(c)},transform:function(a){var d=a.x,c=a.y,b=a.z;a.x=this.n11*d+this.n12*c+this.n13*b+this.n14;a.y=this.n21*d+this.n22*c+this.n23*b+this.n24;a.z=this.n31*d+this.n32*c+this.n33*b+this.n34},multiply:function(d,c){this.n11=d.n11*c.n11+d.n12*c.n21+d.n13*c.n31;this.n12=d.n11*c.n12+d.n12*c.n22+d.n13*c.n32;this.n13=d.n11*c.n13+d.n12*c.n23+d.n13*c.n33;this.n14=d.n11*c.n14+d.n12*c.n24+d.n13*c.n34+d.n14;this.n21=d.n21*c.n11+d.n22*c.n21+d.n23*c.n31;this.n22=d.n21*c.n12+d.n22*c.n22+d.n23*c.n32;this.n23=d.n21*c.n13+d.n22*c.n23+d.n23*c.n33;this.n24=d.n21*c.n14+d.n22*c.n24+d.n23*c.n34+d.n24;this.n31=d.n31*c.n11+d.n32*c.n21+d.n33*c.n31;this.n32=d.n31*c.n12+d.n32*c.n22+d.n33*c.n32;this.n33=d.n31*c.n13+d.n32*c.n23+d.n33*c.n33;this.n34=d.n31*c.n14+d.n32*c.n24+d.n33*c.n34+d.n34},multiplySelf:function(c){var k=this.n11,i=this.n12,h=this.n13,g=this.n14;var f=this.n21,e=this.n22,d=this.n23,b=this.n24;var a=this.n31,o=this.n32,n=this.n33,l=this.n34;this.n11=k*c.n11+i*c.n21+h*c.n31;this.n12=k*c.n12+i*c.n22+h*c.n32;this.n13=k*c.n13+i*c.n23+h*c.n33;this.n14=k*c.n14+i*c.n24+h*c.n34+g;this.n21=f*c.n11+e*c.n21+d*c.n31;this.n22=f*c.n12+e*c.n22+d*c.n32;this.n23=f*c.n13+e*c.n23+d*c.n33;this.n24=f*c.n14+e*c.n24+d*c.n34+b;this.n31=a*c.n11+o*c.n21+n*c.n31;this.n32=a*c.n12+o*c.n22+n*c.n32;this.n33=a*c.n13+o*c.n23+n*c.n33;this.n34=a*c.n14+o*c.n24+n*c.n34+l},clone:function(){var a=new Matrix4();a.n11=this.n11;a.n12=this.n12;a.n13=this.n13;a.n14=this.n14;a.n21=this.n21;a.n22=this.n22;a.n23=this.n23;a.n24=this.n24;a.n31=this.n31;a.n32=this.n32;a.n33=this.n33;a.n34=this.n34;return a},toString:function(){return"| "+this.n11+" "+this.n12+" "+this.n13+" "+this.n14+" |\n| "+this.n21+" "+this.n22+" "+this.n23+" "+this.n24+" |\n| "+this.n31+" "+this.n32+" "+this.n33+" "+this.n34+" |"}});Matrix4.translationMatrix=function(b,d,c){var a=new Matrix4();a.n14=b;a.n24=d;a.n34=c;return a};Matrix4.scaleMatrix=function(b,d,c){var a=new Matrix4();a.n11=b;a.n22=d;a.n33=c;return a};Matrix4.rotationXMatrix=function(b){var a=new Matrix4();a.n22=a.n33=Math.cos(b);a.n32=Math.sin(b);a.n23=-a.n32;return a};Matrix4.rotationYMatrix=function(b){var a=new Matrix4();a.n11=a.n33=Math.cos(b);a.n13=Math.sin(b);a.n31=-a.n13;return a};Matrix4.rotationZMatrix=function(b){var a=new Matrix4();a.n11=a.n22=Math.cos(b);a.n21=Math.sin(b);a.n12=-a.n21;return a};var Vertex=Vector3.extend({u:null,v:null,screen:null,normal:null,visible:null,init:function(a,c,b){this._super(a,c,b);this.screen=new Vector3()},toString:function(){return"Vertex ( "+this.x+", "+this.y+", "+this.z+" )"}});var Face3=Vector3.extend({a:null,b:null,c:null,screen:null,uv:null,normal:null,color:null,init:function(e,d,i,g,h,f){this._super((e.x+d.x+i.x)/3,(e.y+d.y+i.y)/3,(e.z+d.z+i.z)/3);this.a=e;this.b=d;this.c=i;this.screen=new Vector3();this.uv=g?g:[[0,0],[0,0],[0,0]];this.normal=h?h:new Vector3();this.color=f?f:new Color()},toString:function(){return"Face3 ( "+this.a+", "+this.b+", "+this.c+" )"}});var Face4=Vector3.extend({a:null,b:null,c:null,d:null,normal:null,screen:null,color:null,init:function(f,e,l,k,h,i,g){this._super((f.x+e.x+l.x+k.x)/4,(f.y+e.y+l.y+k.y)/4,(f.z+e.z+l.z+k.z)/4);this.a=f;this.b=e;this.c=l;this.d=k;this.screen=new Vector3();this.color=g?g:new Color()},toString:function(){return"Face4 ( "+this.a+", "+this.b+", "+this.c+", "+this.d+" )"}});var Geometry=Class.extend({vertices:null,faces:null,init:function(){this.vertices=new Array();this.faces=new Array()}});var Camera=Vector3.extend({up:null,target:null,zoom:null,focus:null,roll:null,matrix:null,init:function(a,c,b){this._super(a,c,b);this.up=new Vector3(0,1,0);this.target=new Vector3(0,0,0);this.zoom=3;this.focus=500;this.roll=0;this.matrix=new Matrix4();this.updateMatrix()},updateMatrix:function(){this.matrix.lookAt(this,this.target,this.up)},toString:function(){return"Camera ( "+this.x+", "+this.y+", "+this.z+" )"}});var Object3D=Class.extend({position:null,rotation:null,scale:null,matrix:null,screen:null,init:function(){this.position=new Vector3(0,0,0);this.rotation=new Vector3(0,0,0);this.scale=new Vector3(1,1,1);this.matrix=new Matrix4();this.screen=new Vector3(0,0,0)},updateMatrix:function(){this.matrix.identity();this.matrix.multiplySelf(Matrix4.translationMatrix(this.position.x,this.position.y,this.position.z));this.matrix.multiplySelf(Matrix4.rotationXMatrix(this.rotation.x));this.matrix.multiplySelf(Matrix4.rotationYMatrix(this.rotation.y));this.matrix.multiplySelf(Matrix4.rotationZMatrix(this.rotation.z));this.matrix.multiplySelf(Matrix4.scaleMatrix(this.scale.x,this.scale.y,this.scale.z))}});var Mesh=Object3D.extend({geometry:null,material:null,doubleSide:null,init:function(b,a){this._super();this.geometry=b;this.material=a}});var Particle=Object3D.extend({size:1,material:null,init:function(a){this._super();this.material=a}});var Plane=Geometry.extend({init:function(b,a){this._super();var d=b/2;var c=a/2;this.v(-d,c,0);this.v(d,c,0);this.v(d,-c,0);this.v(-d,-c,0);this.f4(0,1,2,3)},v:function(a,c,b){this.vertices.push(new Vertex(a,c,b))},f4:function(f,e,h,g){this.faces.push(new Face4(this.vertices[f],this.vertices[e],this.vertices[h],this.vertices[g]))}});var Cube=Geometry.extend({init:function(c,a,e){this._super();var f=c/2;var d=a/2;var b=e/2;this.v(f,d,-b);this.v(f,-d,-b);this.v(-f,-d,-b);this.v(-f,d,-b);this.v(f,d,b);this.v(f,-d,b);this.v(-f,-d,b);this.v(-f,d,b);this.f4(0,1,2,3);this.f4(4,7,6,5);this.f4(0,4,5,1);this.f4(1,5,6,2);this.f4(2,6,7,3);this.f4(4,0,3,7)},v:function(a,c,b){this.vertices.push(new Vertex(a,c,b))},f4:function(f,e,h,g){this.faces.push(new Face4(this.vertices[f],this.vertices[e],this.vertices[h],this.vertices[g]))}});var ColorMaterial=Class.extend({color:null,init:function(b,a){this.color=new Color((a?(a*255)<<24:4278190080)|b)}});var FaceColorMaterial=Class.extend({});var Scene=Class.extend({objects:null,init:function(){this.objects=new Array()},add:function(a){this.objects.push(a)},remove:function(a){for(var b=0;b<this.objects.length;b++){if(a==this.objects[b]){alert("yay")}}},toString:function(){return"Scene ( "+this.objects+" )"}});var Renderer=Class.extend({matrix:null,viewport:null,renderList:null,face3Pool:null,face4Pool:null,width:null,height:null,widthHalf:null,heightHalf:null,init:function(){this.matrix=new Matrix4();this.face3Pool=new Array();this.face4Pool=new Array()},setSize:function(b,a){this.width=b;this.height=a;this.widthHalf=this.width/2;this.heightHalf=this.height/2},sort:function(d,c){return d.screen.z-c.screen.z},render:function(e,g){var f,h,b;var l=0,a=0;var k=g.focus*g.zoom;this.renderList=new Array();for(var d=0;d<e.objects.length;d++){b=e.objects[d];if(b instanceof Mesh){this.matrix.multiply(g.matrix,b.matrix);for(var c=0;c<b.geometry.vertices.length;c++){f=b.geometry.vertices[c];f.screen.copy(f);this.matrix.transform(f.screen);f.screen.z=k/(g.focus+f.screen.z);f.visible=f.screen.z>0;f.screen.x*=f.screen.z;f.screen.y*=f.screen.z}for(c=0;c<b.geometry.faces.length;c++){h=b.geometry.faces[c];if(h instanceof Face3){if(h.a.visible&&h.b.visible&&h.c.visible&&(b.doubleSided||(h.c.screen.x-h.a.screen.x)*(h.b.screen.y-h.a.screen.y)-(h.c.screen.y-h.a.screen.y)*(h.b.screen.x-h.a.screen.x)>0)){h.screen.z=(h.a.screen.z+h.b.screen.z+h.c.screen.z)*0.3;if(this.face3Pool[l]==null){this.face3Pool[l]=new Face3(new Vertex(),new Vertex(),new Vertex())}this.face3Pool[l].a.screen.copy(h.a.screen);this.face3Pool[l].b.screen.copy(h.b.screen);this.face3Pool[l].c.screen.copy(h.c.screen);this.face3Pool[l].screen.z=h.screen.z;this.face3Pool[l].color=h.color;this.face3Pool[l].material=b.material;this.renderList.push(this.face3Pool[l]);l++}}else{if(h instanceof Face4){if(h.a.visible&&h.b.visible&&h.c.visible&&(b.doubleSided||((h.d.screen.x-h.a.screen.x)*(h.b.screen.y-h.a.screen.y)-(h.d.screen.y-h.a.screen.y)*(h.b.screen.x-h.a.screen.x)>0||(h.b.screen.x-h.c.screen.x)*(h.d.screen.y-h.c.screen.y)-(h.b.screen.y-h.c.screen.y)*(h.d.screen.x-h.c.screen.x)>0))){h.screen.z=(h.a.screen.z+h.b.screen.z+h.c.screen.z+h.d.screen.z)*0.25;if(this.face4Pool[a]==null){this.face4Pool[a]=new Face4(new Vertex(),new Vertex(),new Vertex(),new Vertex())}this.face4Pool[a].a.screen.copy(h.a.screen);this.face4Pool[a].b.screen.copy(h.b.screen);this.face4Pool[a].c.screen.copy(h.c.screen);this.face4Pool[a].d.screen.copy(h.d.screen);this.face4Pool[a].screen.z=h.screen.z;this.face4Pool[a].color=h.color;this.face4Pool[a].material=b.material;this.renderList.push(this.face4Pool[a]);a++}}}}}else{if(b instanceof Particle){b.screen.copy(b.position);g.matrix.transform(b.screen);b.screen.z=k/(g.focus+b.screen.z);if(b.screen.z<0){continue}b.screen.x*=b.screen.z;b.screen.y*=b.screen.z;this.renderList.push(b)}}}this.renderList.sort(this.sort)}});var CanvasRenderer=Renderer.extend({context:null,init:function(){this._super();this.viewport=document.createElement("canvas");this.viewport.style.position="absolute";this.context=this.viewport.getContext("2d")},setSize:function(b,a){this._super(b,a);this.viewport.width=this.width;this.viewport.height=this.height;this.context.setTransform(1,0,0,1,this.widthHalf,this.heightHalf)},render:function(d,b){this._super(d,b);var a,c=Math.PI*2;this.context.clearRect(-this.widthHalf,-this.heightHalf,this.width,this.height);for(j=0;j<this.renderList.length;j++){a=this.renderList[j];if(a.material instanceof ColorMaterial){this.context.fillStyle=a.material.color.styleString}else{if(a.material instanceof FaceColorMaterial){this.context.fillStyle=a.color.styleString}}if(a instanceof Face3){this.context.beginPath();this.context.moveTo(a.a.screen.x,a.a.screen.y);this.context.lineTo(a.b.screen.x,a.b.screen.y);this.context.lineTo(a.c.screen.x,a.c.screen.y);this.context.fill();this.context.closePath()}else{if(a instanceof Face4){this.context.beginPath();this.context.moveTo(a.a.screen.x,a.a.screen.y);this.context.lineTo(a.b.screen.x,a.b.screen.y);this.context.lineTo(a.c.screen.x,a.c.screen.y);this.context.lineTo(a.d.screen.x,a.d.screen.y);this.context.fill();this.context.closePath()}else{if(a instanceof Particle){this.context.beginPath();this.context.arc(a.screen.x,a.screen.y,a.size*a.screen.z,0,c,true);this.context.fill();this.context.closePath()}}}}}});var SVGRenderer=Renderer.extend({svgPathPool:null,svgCirclePool:null,init:function(){this._super();this.viewport=document.createElementNS("http://www.w3.org/2000/svg","svg");this.viewport.style.position="absolute";this.svgPathPool=new Array();this.svgCirclePool=new Array()},setSize:function(b,a){this.viewport.setAttribute("viewBox",(-b/2)+" "+(-a/2)+" "+b+" "+a);this.viewport.setAttribute("width",b);this.viewport.setAttribute("height",a)},render:function(e,c){this._super(e,c);while(this.viewport.childNodes.length>0){this.viewport.removeChild(this.viewport.childNodes[0])}var b=0,a=0,d;for(j=0;j<this.renderList.length;j++){element=this.renderList[j];if(element instanceof Face3){d=this.getPathNode(b++);d.setAttribute("d","M "+element.a.screen.x+" "+element.a.screen.y+" L "+element.b.screen.x+" "+element.b.screen.y+" L "+element.c.screen.x+","+element.c.screen.y+"z")}else{if(element instanceof Face4){d=this.getPathNode(b++);d.setAttribute("d","M "+element.a.screen.x+" "+element.a.screen.y+" L "+element.b.screen.x+" "+element.b.screen.y+" L "+element.c.screen.x+","+element.c.screen.y+" L "+element.d.screen.x+","+element.d.screen.y+"z")}else{if(element instanceof Particle){d=this.getCircleNode(a++);d.setAttribute("cx",element.screen.x);d.setAttribute("cy",element.screen.y);d.setAttribute("r",element.size*element.screen.z)}}}if(element.material instanceof ColorMaterial){d.setAttribute("style","fill: rgb("+element.material.color.r+","+element.material.color.g+","+element.material.color.b+")")}else{if(element.material instanceof FaceColorMaterial){d.setAttribute("style","fill: rgb("+element.color.r+","+element.color.g+","+element.color.b+")")}}this.viewport.appendChild(d)}},getPathNode:function(a){if(this.svgPathPool[a]==null){this.svgPathPool[a]=document.createElementNS("http://www.w3.org/2000/svg","path");return this.svgPathPool[a]}return this.svgPathPool[a]},getCircleNode:function(a){if(this.svgCirclePool[a]==null){this.svgCirclePool[a]=document.createElementNS("http://www.w3.org/2000/svg","circle");this.svgCirclePool[a].setAttribute("fill","red");return this.svgCirclePool[a]}return this.svgCirclePool[a]}});