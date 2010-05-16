// three.js r5 - http://github.com/mrdoob/three.js
var THREE=THREE||{};THREE.Color=function(c){var f,e,a,b,d;this.styleString;this.setHex=function(g){d=g;this.updateRGBA();this.updateStyleString()};this.setRGBA=function(k,j,h,i){f=k;e=j;a=h;b=i;this.updateHex();this.updateStyleString()};this.updateHex=function(){d=b<<24|f<<16|e<<8|a};this.updateRGBA=function(){f=d>>16&255;e=d>>8&255;a=d&255;b=d>>24&255};this.updateStyleString=function(){this.styleString="rgba("+f+","+e+","+a+","+(b/255)+")"};this.toString=function(){return"THREE.Color ( r: "+f+", g: "+e+", b: "+a+", a: "+b+", hex: "+d+", style: "+this.styleString+" )"};this.setHex(c)};THREE.Vector2=function(a,b){this.x=a||0;this.y=b||0;this.set=function(c,d){this.x=c;this.y=d};this.copy=function(c){this.x=c.x;this.y=c.y};this.addSelf=function(c){this.x+=c.x;this.y+=c.y};this.add=function(d,c){this.x=d.x+c.x;this.y=d.y+c.y};this.subSelf=function(c){this.x-=c.x;this.y-=c.y};this.sub=function(d,c){this.x=d.x-c.x;this.y=d.y-c.y};this.multiplyScalar=function(c){this.x*=c;this.y*=c};this.unit=function(){this.multiply(1/this.length())};this.expand=function(d,c){this.unit(this.sub(c,d));c.addSelf(this)};this.length=function(){return Math.sqrt(this.x*this.x+this.y*this.y)};this.lengthSq=function(){return this.x*this.x+this.y*this.y};this.negate=function(){this.x=-this.x;this.y=-this.y};this.clone=function(){return new THREE.Vector2(this.x,this.y)};this.toString=function(){return"THREE.Vector2 ("+this.x+", "+this.y+")"}};THREE.Vector3=function(a,c,b){this.x=a||0;this.y=c||0;this.z=b||0;this.set=function(d,f,e){this.x=d;this.y=f;this.z=e};this.copy=function(d){this.x=d.x;this.y=d.y;this.z=d.z};this.add=function(e,d){this.x=e.x+d.x;this.y=e.y+d.y;this.z=e.z+d.z};this.addSelf=function(d){this.x+=d.x;this.y+=d.y;this.z+=d.z};this.addScalar=function(d){this.x+=d;this.y+=d;this.z+=d};this.sub=function(e,d){this.x=e.x-d.x;this.y=e.y-d.y;this.z=e.z-d.z};this.subSelf=function(d){this.x-=d.x;this.y-=d.y;this.z-=d.z};this.crossSelf=function(f){var e=this.x,d=this.y,g=this.z;this.x=d*f.z-g*f.y;this.y=g*f.x-e*f.z;this.z=e*f.y-d*f.x};this.multiplySelf=function(d){this.x*=d.x;this.y*=d.y;this.z*=d.z};this.multiplyScalar=function(d){this.x*=d;this.y*=d;this.z*=d};this.dot=function(d){return this.x*d.x+this.y*d.y+this.z*d.z};this.distanceTo=function(g){var f=this.x-g.x,e=this.y-g.y,d=this.z-g.z;return Math.sqrt(f*f+e*e+d*d)};this.distanceToSquared=function(g){var f=this.x-g.x,e=this.y-g.y,d=this.z-g.z;return f*f+e*e+d*d};this.length=function(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)};this.lengthSq=function(){return this.x*this.x+this.y*this.y+this.z*this.z};this.negate=function(){this.x=-this.x;this.y=-this.y;this.z=-this.z};this.normalize=function(){if(this.length()>0){this.multiplyScalar(1/this.length())}else{this.multiplyScalar(0)}};this.isZero=function(){var d=0.0001;return(Math.abs(this.x)<d)&&(Math.abs(this.y)<d)&&(Math.abs(this.z)<d)};this.clone=function(){return new THREE.Vector3(this.x,this.y,this.z)};this.toString=function(){return"THREE.Vector3 ("+this.x+", "+this.y+", "+this.z+")"}};THREE.Vector4=function(a,d,c,b){this.x=a||0;this.y=d||0;this.z=c||0;this.w=b||1;this.set=function(e,h,g,f){this.x=e;this.y=h;this.z=g;this.w=f};this.copy=function(e){this.x=e.x;this.y=e.y;this.z=e.z;this.w=e.w};this.add=function(f,e){this.x=f.x+e.x;this.y=f.y+e.y;this.z=f.z+e.z;this.w=f.w+e.w};this.addSelf=function(e){this.x+=e.x;this.y+=e.y;this.z+=e.z;this.w+=e.w};this.sub=function(f,e){this.x=f.x-e.x;this.y=f.y-e.y;this.z=f.z-e.z;this.w=f.w-e.w};this.subSelf=function(e){this.x-=e.x;this.y-=e.y;this.z-=e.z;this.w-=e.w};this.clone=function(){return new THREE.Vector4(this.x,this.y,this.z,this.w)};this.toVector3=function(){return new THREE.Vector3(this.x/this.w,this.y/this.w,this.z/this.w)};this.toString=function(){return"THREE.Vector4 ("+this.x+", "+this.y+", "+this.z+", "+this.w+")"}};THREE.Matrix4=function(){var a,c,b;a=new THREE.Vector3();c=new THREE.Vector3();b=new THREE.Vector3();this.n11=1;this.n12=0;this.n13=0;this.n14=0;this.n21=0;this.n22=1;this.n23=0;this.n24=0;this.n31=0;this.n32=0;this.n33=1;this.n34=0;this.n41=0;this.n42=0;this.n43=0;this.n44=1;this.identity=function(){this.n11=1;this.n12=0;this.n13=0;this.n14=0;this.n21=0;this.n22=1;this.n23=0;this.n24=0;this.n31=0;this.n32=0;this.n33=1;this.n34=0;this.n41=0;this.n42=0;this.n43=0;this.n44=1};this.lookAt=function(f,e,d){b.sub(e,f);b.normalize();a.copy(b);a.crossSelf(d);a.normalize();c.copy(a);c.crossSelf(b);c.normalize();c.negate();this.n11=a.x;this.n12=a.y;this.n13=a.z;this.n14=-a.dot(f);this.n21=c.x;this.n22=c.y;this.n23=c.z;this.n24=-c.dot(f);this.n31=b.x;this.n32=b.y;this.n33=b.z;this.n34=-b.dot(f)};this.transform=function(d){var g=d.x,f=d.y,e=d.z,h=(d.w?d.w:1);d.x=this.n11*g+this.n12*f+this.n13*e+this.n14*h;d.y=this.n21*g+this.n22*f+this.n23*e+this.n24*h;d.z=this.n31*g+this.n32*f+this.n33*e+this.n34*h;h=this.n41*g+this.n42*f+this.n43*e+this.n44*h;if(d.w){d.w=h}else{d.x=d.x/h;d.y=d.y/h;d.z=d.z/h}};this.crossVector=function(d){var e=new THREE.Vector4();e.x=this.n11*d.x+this.n12*d.y+this.n13*d.z+this.n14*d.w;e.y=this.n21*d.x+this.n22*d.y+this.n23*d.z+this.n24*d.w;e.z=this.n31*d.x+this.n32*d.y+this.n33*d.z+this.n34*d.w;e.w=(d.w)?this.n41*d.x+this.n42*d.y+this.n43*d.z+this.n44*d.w:1;return e};this.multiply=function(e,d){this.n11=e.n11*d.n11+e.n12*d.n21+e.n13*d.n31+e.n14*d.n41;this.n12=e.n11*d.n12+e.n12*d.n22+e.n13*d.n32+e.n14*d.n42;this.n13=e.n11*d.n13+e.n12*d.n23+e.n13*d.n33+e.n14*d.n43;this.n14=e.n11*d.n14+e.n12*d.n24+e.n13*d.n34+e.n14*d.n44;this.n21=e.n21*d.n11+e.n22*d.n21+e.n23*d.n31+e.n24*d.n41;this.n22=e.n21*d.n12+e.n22*d.n22+e.n23*d.n32+e.n24*d.n42;this.n23=e.n21*d.n13+e.n22*d.n23+e.n23*d.n33+e.n24*d.n34;this.n24=e.n21*d.n14+e.n22*d.n24+e.n23*d.n34+e.n24*d.n44;this.n31=e.n31*d.n11+e.n32*d.n21+e.n33*d.n31+e.n34*d.n41;this.n32=e.n31*d.n12+e.n32*d.n22+e.n33*d.n32+e.n34*d.n42;this.n33=e.n31*d.n13+e.n32*d.n23+e.n33*d.n33+e.n34*d.n43;this.n34=e.n31*d.n14+e.n32*d.n24+e.n33*d.n34+e.n34*d.n44;this.n41=e.n41*d.n11+e.n42*d.n21+e.n43*d.n31+e.n44*d.n41;this.n42=e.n41*d.n12+e.n42*d.n22+e.n43*d.n32+e.n44*d.n42;this.n43=e.n41*d.n13+e.n42*d.n23+e.n43*d.n33+e.n44*d.n43;this.n44=e.n41*d.n14+e.n42*d.n24+e.n43*d.n34+e.n44*d.n44};this.multiplySelf=function(f){var r=this.n11,q=this.n12,o=this.n13,l=this.n14,i=this.n21,h=this.n22,g=this.n23,e=this.n24,d=this.n31,u=this.n32,t=this.n33,s=this.n34,p=this.n41,n=this.n42,k=this.n43,j=this.n44;this.n11=r*f.n11+q*f.n21+o*f.n31+l*f.n41;this.n12=r*f.n12+q*f.n22+o*f.n32+l*f.n42;this.n13=r*f.n13+q*f.n23+o*f.n33+l*f.n43;this.n14=r*f.n14+q*f.n24+o*f.n34+l*f.n44;this.n21=i*f.n11+h*f.n21+g*f.n31+e*f.n41;this.n22=i*f.n12+h*f.n22+g*f.n32+e*f.n42;this.n23=i*f.n13+h*f.n23+g*f.n33+e*f.n43;this.n24=i*f.n14+h*f.n24+g*f.n34+e*f.n44;this.n31=d*f.n11+u*f.n21+t*f.n31+s*f.n41;this.n32=d*f.n12+u*f.n22+t*f.n32+s*f.n42;this.n33=d*f.n13+u*f.n23+t*f.n33+s*f.n43;this.n34=d*f.n14+u*f.n24+t*f.n34+s*f.n44;this.n41=p*f.n11+n*f.n21+k*f.n31+j*f.n41;this.n42=p*f.n12+n*f.n22+k*f.n32+j*f.n42;this.n43=p*f.n13+n*f.n23+k*f.n33+j*f.n43;this.n44=p*f.n14+n*f.n24+k*f.n34+j*f.n44};this.clone=function(){var d=new THREE.Matrix4();d.n11=this.n11;d.n12=this.n12;d.n13=this.n13;d.n14=this.n14;d.n21=this.n21;d.n22=this.n22;d.n23=this.n23;d.n24=this.n24;d.n31=this.n31;d.n32=this.n32;d.n33=this.n33;d.n34=this.n34;d.n41=this.n41;d.n42=this.n42;d.n43=this.n43;d.n44=this.n44;return d};this.toString=function(){return"| "+this.n11+" "+this.n12+" "+this.n13+" "+this.n14+" |\n| "+this.n21+" "+this.n22+" "+this.n23+" "+this.n24+" |\n| "+this.n31+" "+this.n32+" "+this.n33+" "+this.n34+" |\n| "+this.n41+" "+this.n42+" "+this.n43+" "+this.n44+" |"}};THREE.Matrix4.translationMatrix=function(b,d,c){var a=new THREE.Matrix4();a.n14=b;a.n24=d;a.n34=c;return a};THREE.Matrix4.scaleMatrix=function(b,d,c){var a=new THREE.Matrix4();a.n11=b;a.n22=d;a.n33=c;return a};THREE.Matrix4.rotationXMatrix=function(b){var a=new THREE.Matrix4();a.n22=a.n33=Math.cos(b);a.n32=Math.sin(b);a.n23=-a.n32;return a};THREE.Matrix4.rotationYMatrix=function(b){var a=new THREE.Matrix4();a.n11=a.n33=Math.cos(b);a.n13=Math.sin(b);a.n31=-a.n13;return a};THREE.Matrix4.rotationZMatrix=function(b){var a=new THREE.Matrix4();a.n11=a.n22=Math.cos(b);a.n21=Math.sin(b);a.n12=-a.n21;return a};THREE.Matrix4.makeFrustum=function(f,r,e,o,i,h){var g=new THREE.Matrix4(),q=2*i/(r-f),n=2*i/(o-e),p=(r+f)/(r-f),l=(o+e)/(o-e),k=-(h+i)/(h-i),j=-2*h*i/(h-i);g.n11=q;g.n13=p;g.n22=n;g.n23=l;g.n33=k;g.n34=j;g.n43=-1;g.n44=0;return g};THREE.Matrix4.makePerspective=function(d,c,g,b){var a=g*Math.tan(d*0.00872664625972),f=-a,h=f*c,e=a*c;return THREE.Matrix4.makeFrustum(h,e,f,a,g,b)};THREE.Vertex=function(a,b){this.position=a||new THREE.Vector3();this.normal=b||new THREE.Vector3();this.screen=new THREE.Vector3();this.visible=true;this.toString=function(){return"THREE.Vertex ( position: "+this.position+", normal: "+this.normal+" )"}};THREE.Face3=function(e,d,i,g,h,f){this.a=e;this.b=d;this.c=i;this.normal=h||new THREE.Vector3();this.screen=new THREE.Vector3();this.uv=g||[[0,0],[0,0],[0,0]];this.color=f||new THREE.Color();this.toString=function(){return"THREE.Face3 ( "+this.a+", "+this.b+", "+this.c+" )"}};THREE.Face4=function(f,e,k,j,h,i,g){this.a=f;this.b=e;this.c=k;this.d=j;this.normal=i||new THREE.Vector3();this.screen=new THREE.Vector3();this.uv=h||[[0,0],[0,0],[0,0],[0,0]];this.color=g||new THREE.Color();this.toString=function(){return"THREE.Face4 ( "+this.a+", "+this.b+", "+this.c+" "+this.d+" )"}};THREE.Geometry=function(){this.vertices=[];this.faces=[];this.computeNormals=function(){var b,h,e,d,c,a,g,i;for(b=0;b<this.vertices.length;b++){this.vertices[b].normal.set(0,0,0)}for(h=0;h<this.faces.length;h++){e=this.vertices[this.faces[h].a],d=this.vertices[this.faces[h].b],c=this.vertices[this.faces[h].c],a=new THREE.Vector3(),g=new THREE.Vector3(),i=new THREE.Vector3();a.sub(c.position,d.position);g.sub(e.position,d.position);a.cross(g);if(!a.isZero()){a.normalize()}this.faces[h].normal=a;e.normal.addSelf(i);d.normal.addSelf(i);c.normal.addSelf(i);if(this.faces[h] instanceof THREE.Face4){this.vertices[this.faces[h].d].normal.addSelf(i)}}}};THREE.Camera=function(a,c,b){this.position=new THREE.Vector3(a,c,b);this.target={position:new THREE.Vector3(0,0,0)};this.matrix=new THREE.Matrix4();this.projectionMatrix=THREE.Matrix4.makePerspective(45,1,0.001,1000);this.up=new THREE.Vector3(0,1,0);this.roll=0;this.zoom=3;this.focus=500;this.updateMatrix=function(){this.matrix.lookAt(this.position,this.target.position,this.up)};this.toString=function(){return"THREE.Camera ( "+this.position+", "+this.target.position+" )"};this.updateMatrix()};THREE.Object3D=function(a){this.position=new THREE.Vector3(0,0,0);this.rotation=new THREE.Vector3(0,0,0);this.scale=new THREE.Vector3(1,1,1);this.matrix=new THREE.Matrix4();this.screen=new THREE.Vector3(0,0,0);this.material=a instanceof Array?a:[a];this.updateMatrix=function(){this.matrix.identity();this.matrix.multiplySelf(THREE.Matrix4.translationMatrix(this.position.x,this.position.y,this.position.z));this.matrix.multiplySelf(THREE.Matrix4.rotationXMatrix(this.rotation.x));this.matrix.multiplySelf(THREE.Matrix4.rotationYMatrix(this.rotation.y));this.matrix.multiplySelf(THREE.Matrix4.rotationZMatrix(this.rotation.z));this.matrix.multiplySelf(THREE.Matrix4.scaleMatrix(this.scale.x,this.scale.y,this.scale.z))}};THREE.Line=function(b,a){THREE.Object3D.call(this,a);this.geometry=b};THREE.Line.prototype=new THREE.Object3D();THREE.Line.prototype.constructor=THREE.Line;THREE.Mesh=function(b,a){THREE.Object3D.call(this,a);this.geometry=b;this.doubleSided=false};THREE.Mesh.prototype=new THREE.Object3D();THREE.Mesh.prototype.constructor=THREE.Mesh;THREE.Particle=function(a){THREE.Object3D.call(this,a);this.size=1};THREE.Particle.prototype=new THREE.Object3D();THREE.Particle.prototype.constructor=THREE.Particle;THREE.ColorFillMaterial=function(b,a){this.color=new THREE.Color((a?(a*255)<<24:4278190080)|b);this.toString=function(){return"THREE.ColorFillMaterial ( color: "+this.color+" )"}};THREE.ColorStrokeMaterial=function(c,b,a){this.lineWidth=a||1;this.color=new THREE.Color((b?(b*255)<<24:4278190080)|c);this.toString=function(){return"THREE.ColorStrokeMaterial ( lineWidth: "+this.lineWidth+", color: "+this.color+" )"}};THREE.FaceColorFillMaterial=function(){this.toString=function(){return"THREE.FaceColorFillMaterial ( )"}};THREE.FaceColorStrokeMaterial=function(a){this.lineWidth=a||1;this.toString=function(){return"THREE.FaceColorStrokeMaterial ( lineWidth: "+this.lineWidth+" )"}};THREE.Scene=function(){this.objects=[];this.add=function(a){this.objects.push(a)};this.toString=function(){return"THREE.Scene ( "+this.objects+" )"}};THREE.Renderer=function(){var e=[],c=[],a=[],b=new THREE.Matrix4();this.renderList;function d(g,f){return g.screenZ-f.screenZ}this.project=function(x,v){var s,q,w,n,y,l,k,h,g,p=0,u=0,r=0,t=v.focus,o=v.focus*v.zoom,m=0,f=0;this.renderList=[];for(s=0;s<x.objects.length;s++){y=x.objects[s];if(y instanceof THREE.Mesh){b.multiply(v.matrix,y.matrix);m=y.geometry.vertices.length;for(q=0;q<m;q++){w=y.geometry.vertices[q];w.screen.copy(w.position);b.transform(w.screen);w.screen.z=o/(t+w.screen.z);w.visible=w.screen.z>0;w.screen.x*=w.screen.z;w.screen.y*=w.screen.z}f=y.geometry.faces.length;for(q=0;q<f;q++){n=y.geometry.faces[q];if(n instanceof THREE.Face3){l=y.geometry.vertices[n.a];k=y.geometry.vertices[n.b];h=y.geometry.vertices[n.c];if(l.visible&&k.visible&&h.visible&&(y.doubleSided||(h.screen.x-l.screen.x)*(k.screen.y-l.screen.y)-(h.screen.y-l.screen.y)*(k.screen.x-l.screen.x)>0)){n.screen.z=(l.screen.z+k.screen.z+h.screen.z)*0.3;if(e[p]==null){e[p]=new THREE.RenderableFace3()}e[p].v1.x=l.screen.x;e[p].v1.y=l.screen.y;e[p].v2.x=k.screen.x;e[p].v2.y=k.screen.y;e[p].v3.x=h.screen.x;e[p].v3.y=h.screen.y;e[p].screenZ=n.screen.z;e[p].color=n.color;e[p].material=y.material;this.renderList.push(e[p]);p++}}else{if(n instanceof THREE.Face4){l=y.geometry.vertices[n.a];k=y.geometry.vertices[n.b];h=y.geometry.vertices[n.c];g=y.geometry.vertices[n.d];if(l.visible&&k.visible&&h.visible&&g.visible&&(y.doubleSided||((g.screen.x-l.screen.x)*(k.screen.y-l.screen.y)-(g.screen.y-l.screen.y)*(k.screen.x-l.screen.x)>0||(k.screen.x-h.screen.x)*(g.screen.y-h.screen.y)-(k.screen.y-h.screen.y)*(g.screen.x-h.screen.x)>0))){n.screen.z=(l.screen.z+k.screen.z+h.screen.z+g.screen.z)*0.25;if(c[u]==null){c[u]=new THREE.RenderableFace4()}c[u].v1.x=l.screen.x;c[u].v1.y=l.screen.y;c[u].v2.x=k.screen.x;c[u].v2.y=k.screen.y;c[u].v3.x=h.screen.x;c[u].v3.y=h.screen.y;c[u].v4.x=g.screen.x;c[u].v4.y=g.screen.y;c[u].screenZ=n.screen.z;c[u].color=n.color;c[u].material=y.material;this.renderList.push(c[u]);u++}}}}}else{if(y instanceof THREE.Particle){y.screen.copy(y.position);v.matrix.transform(y.screen);y.screen.z=o/(t+y.screen.z);if(y.screen.z<0){continue}y.screen.x*=y.screen.z;y.screen.y*=y.screen.z;if(a[r]==null){a[r]=new THREE.RenderableParticle()}a[r].x=y.screen.x;a[r].y=y.screen.y;a[r].screenZ=y.screen.z;a[r].size=y.size;a[r].material=y.material;a[r].color=y.color;this.renderList.push(a[r]);r++}}}this.renderList.sort(d)}};THREE.CanvasRenderer=function(){THREE.Renderer.call(this);var a=document.createElement("canvas"),b=a.getContext("2d");this.setSize=function(d,c){a.width=d;a.height=c;b.setTransform(1,0,0,1,d/2,c/2)};this.domElement=a;this.render=function(f,h){var d,c,e,m=Math.PI*2,g,k,l;b.clearRect(-a.width/2,-a.height/2,a.width,a.height);this.project(f,h);g=this.renderList.length;for(d=0;d<g;d++){e=this.renderList[d];l=e.material.length;for(c=0;c<l;c++){k=e.material[c];b.beginPath();if(e instanceof THREE.RenderableFace3){b.moveTo(e.v1.x,e.v1.y);b.lineTo(e.v2.x,e.v2.y);b.lineTo(e.v3.x,e.v3.y);b.lineTo(e.v1.x,e.v1.y)}else{if(e instanceof THREE.RenderableFace4){b.moveTo(e.v1.x,e.v1.y);b.lineTo(e.v2.x,e.v2.y);b.lineTo(e.v3.x,e.v3.y);b.lineTo(e.v4.x,e.v4.y);b.lineTo(e.v1.x,e.v1.y)}else{if(e instanceof THREE.RenderableParticle){b.arc(e.x,e.y,e.size*e.screenZ,0,m,true)}}}if(k instanceof THREE.ColorFillMaterial){b.fillStyle=k.color.styleString;b.fill()}else{if(k instanceof THREE.FaceColorFillMaterial){b.fillStyle=e.color.styleString;b.fill()}else{if(k instanceof THREE.ColorStrokeMaterial){b.lineWidth=k.lineWidth;b.lineJoin="round";b.lineCap="round";b.strokeStyle=k.color.styleString;b.stroke()}else{if(k instanceof THREE.FaceColorStrokeMaterial){b.lineWidth=k.lineWidth;b.lineJoin="round";b.lineCap="round";b.strokeStyle=e.color.styleString;b.stroke()}}}}b.closePath()}}}};THREE.CanvasRenderer.prototype=new THREE.Renderer();THREE.CanvasRenderer.prototype.constructor=THREE.CanvasRenderer;THREE.SVGRenderer=function(){THREE.Renderer.call(this);var a=document.createElementNS("http://www.w3.org/2000/svg","svg"),e=[],b=[];this.setSize=function(g,f){a.setAttribute("viewBox",(-g/2)+" "+(-f/2)+" "+g+" "+f);a.setAttribute("width",g);a.setAttribute("height",f)};this.domElement=a;this.render=function(m,p){var k,h,l,o,q,r,f=0,n=0,g;this.project(m,p);while(a.childNodes.length>0){a.removeChild(a.childNodes[0])}o=this.renderList.length;for(k=0;k<o;k++){l=this.renderList[k];r=l.material.length;for(h=0;h<r;h++){q=l.material[h];if(l instanceof THREE.RenderableFace3){g=c(f++);g.setAttribute("d","M "+l.v1.x+" "+l.v1.y+" L "+l.v2.x+" "+l.v2.y+" L "+l.v3.x+","+l.v3.y+"z")}else{if(l instanceof THREE.RenderableFace4){g=c(f++);g.setAttribute("d","M "+l.v1.x+" "+l.v1.y+" L "+l.v2.x+" "+l.v2.y+" L "+l.v3.x+","+l.v3.y+" L "+l.v4.x+","+l.v4.y+"z")}else{if(l instanceof THREE.RenderableParticle){g=d(n++);g.setAttribute("cx",l.x);g.setAttribute("cy",l.y);g.setAttribute("r",l.size*l.screenZ)}}}if(q instanceof THREE.ColorFillMaterial){g.setAttribute("style","fill: "+q.color.styleString+"; stroke-width:10")}else{if(q instanceof THREE.FaceColorFillMaterial){g.setAttribute("style","fill: "+l.color.styleString+"; stroke-width:10")}else{if(q instanceof THREE.ColorStrokeMaterial){g.setAttribute("style","fill: none; stroke: "+q.color.styleString+"; stroke-width: "+q.lineWidth+"; stroke-linecap: round; stroke-linejoin: round")}else{if(q instanceof THREE.FaceColorStrokeMaterial){g.setAttribute("style","fill: none; stroke: "+l.color.styleString+"; stroke-width: "+q.lineWidth+"; stroke-linecap: round; stroke-linejoin: round")}}}}a.appendChild(g)}}};function c(f){if(e[f]==null){e[f]=document.createElementNS("http://www.w3.org/2000/svg","path");return e[f]}return e[f]}function d(f){if(b[f]==null){b[f]=document.createElementNS("http://www.w3.org/2000/svg","circle");return b[f]}return b[f]}};THREE.SVGRenderer.prototype=new THREE.Renderer();THREE.SVGRenderer.prototype.constructor=THREE.CanvasRenderer;THREE.RenderableFace3=function(){this.v1=new THREE.Vector2();this.v2=new THREE.Vector2();this.v3=new THREE.Vector2();this.screenZ;this.color;this.material};THREE.RenderableFace4=function(){this.v1=new THREE.Vector2();this.v2=new THREE.Vector2();this.v3=new THREE.Vector2();this.v4=new THREE.Vector2();this.screenZ;this.color;this.material};THREE.RenderableParticle=function(){this.x;this.y;this.screenZ;this.color;this.material};