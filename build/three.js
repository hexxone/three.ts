// three.js r8 - http://github.com/mrdoob/three.js
var THREE=THREE||{};THREE.Color=function(c){var f,e,a,b,d;this.__styleString;this.__svgStyleString;this.setHex=function(g){d=g;this.updateRGBA();this.updateStyleString()};this.setRGBA=function(k,j,h,i){f=k;e=j;a=h;b=i;this.updateHex();this.updateStyleString()};this.updateHex=function(){d=b<<24|f<<16|e<<8|a};this.updateRGBA=function(){f=d>>16&255;e=d>>8&255;a=d&255;b=d>>24&255};this.updateStyleString=function(){this.__styleString="rgba("+f+","+e+","+a+","+(b/255)+")";this.__svgStyleString="rgb("+f+","+e+","+a+"); opacity: "+(b/255)};this.toString=function(){return"THREE.Color ( r: "+f+", g: "+e+", b: "+a+", a: "+b+", hex: "+d+", style: "+this.styleString+" )"};this.setHex(c)};THREE.Vector2=function(a,b){this.x=a||0;this.y=b||0;this.set=function(c,d){this.x=c;this.y=d};this.copy=function(c){this.x=c.x;this.y=c.y};this.addSelf=function(c){this.x+=c.x;this.y+=c.y};this.add=function(d,c){this.x=d.x+c.x;this.y=d.y+c.y};this.subSelf=function(c){this.x-=c.x;this.y-=c.y};this.sub=function(d,c){this.x=d.x-c.x;this.y=d.y-c.y};this.multiplyScalar=function(c){this.x*=c;this.y*=c};this.unit=function(){this.multiplyScalar(1/this.length())};this.length=function(){return Math.sqrt(this.x*this.x+this.y*this.y)};this.lengthSq=function(){return this.x*this.x+this.y*this.y};this.negate=function(){this.x=-this.x;this.y=-this.y};this.clone=function(){return new THREE.Vector2(this.x,this.y)};this.toString=function(){return"THREE.Vector2 ("+this.x+", "+this.y+")"}};THREE.Vector3=function(a,c,b){this.x=a||0;this.y=c||0;this.z=b||0;this.set=function(d,f,e){this.x=d;this.y=f;this.z=e};this.copy=function(d){this.x=d.x;this.y=d.y;this.z=d.z};this.add=function(e,d){this.x=e.x+d.x;this.y=e.y+d.y;this.z=e.z+d.z};this.addSelf=function(d){this.x+=d.x;this.y+=d.y;this.z+=d.z};this.addScalar=function(d){this.x+=d;this.y+=d;this.z+=d};this.sub=function(e,d){this.x=e.x-d.x;this.y=e.y-d.y;this.z=e.z-d.z};this.subSelf=function(d){this.x-=d.x;this.y-=d.y;this.z-=d.z};this.crossSelf=function(f){var e=this.x,d=this.y,g=this.z;this.x=d*f.z-g*f.y;this.y=g*f.x-e*f.z;this.z=e*f.y-d*f.x};this.multiplySelf=function(d){this.x*=d.x;this.y*=d.y;this.z*=d.z};this.multiplyScalar=function(d){this.x*=d;this.y*=d;this.z*=d};this.dot=function(d){return this.x*d.x+this.y*d.y+this.z*d.z};this.distanceTo=function(d){return Math.sqrt(this.distanceToSquared(d))};this.distanceToSquared=function(g){var f=this.x-g.x,e=this.y-g.y,d=this.z-g.z;return f*f+e*e+d*d};this.length=function(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)};this.lengthSq=function(){return this.x*this.x+this.y*this.y+this.z*this.z};this.negate=function(){this.x=-this.x;this.y=-this.y;this.z=-this.z};this.normalize=function(){if(this.length()>0){this.multiplyScalar(1/this.length())}else{this.multiplyScalar(0)}};this.clone=function(){return new THREE.Vector3(this.x,this.y,this.z)};this.toString=function(){return"THREE.Vector3 ("+this.x+", "+this.y+", "+this.z+")"}};THREE.Vector4=function(a,d,c,b){this.x=a||0;this.y=d||0;this.z=c||0;this.w=b||1;this.set=function(e,h,g,f){this.x=e;this.y=h;this.z=g;this.w=f};this.copy=function(e){this.x=e.x;this.y=e.y;this.z=e.z;this.w=e.w};this.add=function(f,e){this.x=f.x+e.x;this.y=f.y+e.y;this.z=f.z+e.z;this.w=f.w+e.w};this.addSelf=function(e){this.x+=e.x;this.y+=e.y;this.z+=e.z;this.w+=e.w};this.sub=function(f,e){this.x=f.x-e.x;this.y=f.y-e.y;this.z=f.z-e.z;this.w=f.w-e.w};this.subSelf=function(e){this.x-=e.x;this.y-=e.y;this.z-=e.z;this.w-=e.w};this.clone=function(){return new THREE.Vector4(this.x,this.y,this.z,this.w)};this.toVector3=function(){return new THREE.Vector3(this.x/this.w,this.y/this.w,this.z/this.w)};this.toString=function(){return"THREE.Vector4 ("+this.x+", "+this.y+", "+this.z+", "+this.w+")"}};THREE.Rectangle=function(b,l,a,j){var k=b,g=l,i=a,f=j,d=i-k,e=f-g,h=false;function c(){d=i-k;e=f-g}this.getX=function(){return k};this.getY=function(){return g};this.getWidth=function(){return d};this.getHeight=function(){return e};this.getX1=function(){return k};this.getY1=function(){return g};this.getX2=function(){return i};this.getY2=function(){return f};this.set=function(n,p,m,o){h=false;k=n;g=p;i=m;f=o;c()};this.addPoint=function(m,n){if(h){h=false;k=m;g=n;i=m;f=n}else{k=Math.min(k,m);g=Math.min(g,n);i=Math.max(i,m);f=Math.max(f,n)}c()};this.addRectangle=function(m){if(h){h=false;k=m.getX1();g=m.getY1();i=m.getX2();f=m.getY2()}else{k=Math.min(k,m.getX1());g=Math.min(g,m.getY1());i=Math.max(i,m.getX2());f=Math.max(f,m.getY2())}c()};this.inflate=function(m){k-=m;g-=m;i+=m;f+=m;c()};this.minSelf=function(m){k=Math.max(k,m.getX1());g=Math.max(g,m.getY1());i=Math.min(i,m.getX2());f=Math.min(f,m.getY2());c()};this.instersects=function(m){return Math.min(i,m.getX2())-Math.max(k,m.getX1())>0&&Math.min(f,m.getY2())-Math.max(g,m.getY1())>0};this.empty=function(){h=true;k=0;g=0;i=0,f=0;c()};this.toString=function(){return"THREE.Rectangle (x1: "+k+", y1: "+f+", x2: "+i+", y1: "+g+", width: "+d+", height: "+e+")"}};THREE.Matrix4=function(){var a,c,b;a=new THREE.Vector3();c=new THREE.Vector3();b=new THREE.Vector3();this.n11=1;this.n12=0;this.n13=0;this.n14=0;this.n21=0;this.n22=1;this.n23=0;this.n24=0;this.n31=0;this.n32=0;this.n33=1;this.n34=0;this.n41=0;this.n42=0;this.n43=0;this.n44=1;this.identity=function(){this.n11=1;this.n12=0;this.n13=0;this.n14=0;this.n21=0;this.n22=1;this.n23=0;this.n24=0;this.n31=0;this.n32=0;this.n33=1;this.n34=0;this.n41=0;this.n42=0;this.n43=0;this.n44=1};this.lookAt=function(f,e,d){b.sub(e,f);b.normalize();a.copy(b);a.crossSelf(d);a.normalize();c.copy(a);c.crossSelf(b);c.normalize();c.negate();this.n11=a.x;this.n12=a.y;this.n13=a.z;this.n14=-a.dot(f);this.n21=c.x;this.n22=c.y;this.n23=c.z;this.n24=-c.dot(f);this.n31=b.x;this.n32=b.y;this.n33=b.z;this.n34=-b.dot(f)};this.transform=function(d){var g=d.x,f=d.y,e=d.z,h=(d.w?d.w:1);d.x=this.n11*g+this.n12*f+this.n13*e+this.n14*h;d.y=this.n21*g+this.n22*f+this.n23*e+this.n24*h;d.z=this.n31*g+this.n32*f+this.n33*e+this.n34*h;h=this.n41*g+this.n42*f+this.n43*e+this.n44*h;if(d.w){d.w=h}else{d.x=d.x/h;d.y=d.y/h;d.z=d.z/h}};this.crossVector=function(d){var e=new THREE.Vector4();e.x=this.n11*d.x+this.n12*d.y+this.n13*d.z+this.n14*d.w;e.y=this.n21*d.x+this.n22*d.y+this.n23*d.z+this.n24*d.w;e.z=this.n31*d.x+this.n32*d.y+this.n33*d.z+this.n34*d.w;e.w=(d.w)?this.n41*d.x+this.n42*d.y+this.n43*d.z+this.n44*d.w:1;return e};this.multiply=function(e,d){this.n11=e.n11*d.n11+e.n12*d.n21+e.n13*d.n31+e.n14*d.n41;this.n12=e.n11*d.n12+e.n12*d.n22+e.n13*d.n32+e.n14*d.n42;this.n13=e.n11*d.n13+e.n12*d.n23+e.n13*d.n33+e.n14*d.n43;this.n14=e.n11*d.n14+e.n12*d.n24+e.n13*d.n34+e.n14*d.n44;this.n21=e.n21*d.n11+e.n22*d.n21+e.n23*d.n31+e.n24*d.n41;this.n22=e.n21*d.n12+e.n22*d.n22+e.n23*d.n32+e.n24*d.n42;this.n23=e.n21*d.n13+e.n22*d.n23+e.n23*d.n33+e.n24*d.n34;this.n24=e.n21*d.n14+e.n22*d.n24+e.n23*d.n34+e.n24*d.n44;this.n31=e.n31*d.n11+e.n32*d.n21+e.n33*d.n31+e.n34*d.n41;this.n32=e.n31*d.n12+e.n32*d.n22+e.n33*d.n32+e.n34*d.n42;this.n33=e.n31*d.n13+e.n32*d.n23+e.n33*d.n33+e.n34*d.n43;this.n34=e.n31*d.n14+e.n32*d.n24+e.n33*d.n34+e.n34*d.n44;this.n41=e.n41*d.n11+e.n42*d.n21+e.n43*d.n31+e.n44*d.n41;this.n42=e.n41*d.n12+e.n42*d.n22+e.n43*d.n32+e.n44*d.n42;this.n43=e.n41*d.n13+e.n42*d.n23+e.n43*d.n33+e.n44*d.n43;this.n44=e.n41*d.n14+e.n42*d.n24+e.n43*d.n34+e.n44*d.n44};this.multiplySelf=function(f){var r=this.n11,q=this.n12,o=this.n13,l=this.n14,i=this.n21,h=this.n22,g=this.n23,e=this.n24,d=this.n31,u=this.n32,t=this.n33,s=this.n34,p=this.n41,n=this.n42,k=this.n43,j=this.n44;this.n11=r*f.n11+q*f.n21+o*f.n31+l*f.n41;this.n12=r*f.n12+q*f.n22+o*f.n32+l*f.n42;this.n13=r*f.n13+q*f.n23+o*f.n33+l*f.n43;this.n14=r*f.n14+q*f.n24+o*f.n34+l*f.n44;this.n21=i*f.n11+h*f.n21+g*f.n31+e*f.n41;this.n22=i*f.n12+h*f.n22+g*f.n32+e*f.n42;this.n23=i*f.n13+h*f.n23+g*f.n33+e*f.n43;this.n24=i*f.n14+h*f.n24+g*f.n34+e*f.n44;this.n31=d*f.n11+u*f.n21+t*f.n31+s*f.n41;this.n32=d*f.n12+u*f.n22+t*f.n32+s*f.n42;this.n33=d*f.n13+u*f.n23+t*f.n33+s*f.n43;this.n34=d*f.n14+u*f.n24+t*f.n34+s*f.n44;this.n41=p*f.n11+n*f.n21+k*f.n31+j*f.n41;this.n42=p*f.n12+n*f.n22+k*f.n32+j*f.n42;this.n43=p*f.n13+n*f.n23+k*f.n33+j*f.n43;this.n44=p*f.n14+n*f.n24+k*f.n34+j*f.n44};this.clone=function(){var d=new THREE.Matrix4();d.n11=this.n11;d.n12=this.n12;d.n13=this.n13;d.n14=this.n14;d.n21=this.n21;d.n22=this.n22;d.n23=this.n23;d.n24=this.n24;d.n31=this.n31;d.n32=this.n32;d.n33=this.n33;d.n34=this.n34;d.n41=this.n41;d.n42=this.n42;d.n43=this.n43;d.n44=this.n44;return d};this.toString=function(){return"| "+this.n11+" "+this.n12+" "+this.n13+" "+this.n14+" |\n| "+this.n21+" "+this.n22+" "+this.n23+" "+this.n24+" |\n| "+this.n31+" "+this.n32+" "+this.n33+" "+this.n34+" |\n| "+this.n41+" "+this.n42+" "+this.n43+" "+this.n44+" |"}};THREE.Matrix4.translationMatrix=function(b,d,c){var a=new THREE.Matrix4();a.n14=b;a.n24=d;a.n34=c;return a};THREE.Matrix4.scaleMatrix=function(b,d,c){var a=new THREE.Matrix4();a.n11=b;a.n22=d;a.n33=c;return a};THREE.Matrix4.rotationXMatrix=function(b){var a=new THREE.Matrix4();a.n22=a.n33=Math.cos(b);a.n32=Math.sin(b);a.n23=-a.n32;return a};THREE.Matrix4.rotationYMatrix=function(b){var a=new THREE.Matrix4();a.n11=a.n33=Math.cos(b);a.n13=Math.sin(b);a.n31=-a.n13;return a};THREE.Matrix4.rotationZMatrix=function(b){var a=new THREE.Matrix4();a.n11=a.n22=Math.cos(b);a.n21=Math.sin(b);a.n12=-a.n21;return a};THREE.Matrix4.makeFrustum=function(f,r,e,o,i,h){var g=new THREE.Matrix4(),q=2*i/(r-f),n=2*i/(o-e),p=(r+f)/(r-f),l=(o+e)/(o-e),k=-(h+i)/(h-i),j=-2*h*i/(h-i);g.n11=q;g.n13=p;g.n22=n;g.n23=l;g.n33=k;g.n34=j;g.n43=-1;g.n44=0;return g};THREE.Matrix4.makePerspective=function(d,c,g,b){var a=g*Math.tan(d*0.00872664625972),f=-a,h=f*c,e=a*c;return THREE.Matrix4.makeFrustum(h,e,f,a,g,b)};THREE.Vertex=function(a,b){this.position=a||new THREE.Vector3();this.normal=b||new THREE.Vector3();this.screen=new THREE.Vector3();this.__visible=true;this.toString=function(){return"THREE.Vertex ( position: "+this.position+", normal: "+this.normal+" )"}};THREE.Face3=function(e,d,h,g,f){this.a=e;this.b=d;this.c=h;this.normal=g||new THREE.Vector3();this.screen=new THREE.Vector3();this.color=f||new THREE.Color();this.toString=function(){return"THREE.Face3 ( "+this.a+", "+this.b+", "+this.c+" )"}};THREE.Face4=function(f,e,j,i,h,g){this.a=f;this.b=e;this.c=j;this.d=i;this.normal=h||new THREE.Vector3();this.screen=new THREE.Vector3();this.color=g||new THREE.Color();this.toString=function(){return"THREE.Face4 ( "+this.a+", "+this.b+", "+this.c+" "+this.d+" )"}};THREE.Geometry=function(){this.vertices=[];this.faces=[];this.uvs=[];this.computeNormals=function(){var b,h,e,d,c,a,g,i;for(b=0;b<this.vertices.length;b++){this.vertices[b].normal.set(0,0,0)}for(h=0;h<this.faces.length;h++){e=this.vertices[this.faces[h].a],d=this.vertices[this.faces[h].b],c=this.vertices[this.faces[h].c],a=new THREE.Vector3(),g=new THREE.Vector3(),i=new THREE.Vector3();a.sub(c.position,d.position);g.sub(e.position,d.position);a.cross(g);if(!a.isZero()){a.normalize()}this.faces[h].normal=a;e.normal.addSelf(i);d.normal.addSelf(i);c.normal.addSelf(i);if(this.faces[h] instanceof THREE.Face4){this.vertices[this.faces[h].d].normal.addSelf(i)}}}};THREE.Camera=function(a,c,b){this.position=new THREE.Vector3(a,c,b);this.target={position:new THREE.Vector3(0,0,0)};this.matrix=new THREE.Matrix4();this.projectionMatrix=THREE.Matrix4.makePerspective(45,1,0.001,1000);this.up=new THREE.Vector3(0,1,0);this.roll=0;this.zoom=3;this.focus=500;this.autoUpdateMatrix=true;this.updateMatrix=function(){this.matrix.lookAt(this.position,this.target.position,this.up)};this.toString=function(){return"THREE.Camera ( "+this.position+", "+this.target.position+" )"};this.updateMatrix()};THREE.Object3D=function(a){this.position=new THREE.Vector3();this.rotation=new THREE.Vector3();this.scale=new THREE.Vector3(1,1,1);this.matrix=new THREE.Matrix4();this.screen=new THREE.Vector3();this.material=a instanceof Array?a:[a];this.autoUpdateMatrix=true;this.updateMatrix=function(){this.matrix.identity();this.matrix.multiplySelf(THREE.Matrix4.translationMatrix(this.position.x,this.position.y,this.position.z));this.matrix.multiplySelf(THREE.Matrix4.rotationXMatrix(this.rotation.x));this.matrix.multiplySelf(THREE.Matrix4.rotationYMatrix(this.rotation.y));this.matrix.multiplySelf(THREE.Matrix4.rotationZMatrix(this.rotation.z));this.matrix.multiplySelf(THREE.Matrix4.scaleMatrix(this.scale.x,this.scale.y,this.scale.z))}};THREE.Line=function(b,a){THREE.Object3D.call(this,a);this.geometry=b};THREE.Line.prototype=new THREE.Object3D();THREE.Line.prototype.constructor=THREE.Line;THREE.Mesh=function(b,a){THREE.Object3D.call(this,a);this.geometry=b;this.doubleSided=false};THREE.Mesh.prototype=new THREE.Object3D();THREE.Mesh.prototype.constructor=THREE.Mesh;THREE.Particle=function(a){THREE.Object3D.call(this,a);this.size=1;this.autoUpdateMatrix=false};THREE.Particle.prototype=new THREE.Object3D();THREE.Particle.prototype.constructor=THREE.Particle;THREE.BitmapUVMappingMaterial=function(a){this.bitmap=a;this.toString=function(){return"THREE.BitmapUVMappingMaterial ( bitmap: "+this.bitmap+" )"}};THREE.ColorFillMaterial=function(b,a){this.color=new THREE.Color((a?(a*255)<<24:4278190080)|b);this.toString=function(){return"THREE.ColorFillMaterial ( color: "+this.color+" )"}};THREE.ColorStrokeMaterial=function(a,c,b){this.lineWidth=a||1;this.color=new THREE.Color((b?(b*255)<<24:4278190080)|c);this.toString=function(){return"THREE.ColorStrokeMaterial ( lineWidth: "+this.lineWidth+", color: "+this.color+" )"}};THREE.FaceColorFillMaterial=function(){this.toString=function(){return"THREE.FaceColorFillMaterial ( )"}};THREE.FaceColorStrokeMaterial=function(a){this.lineWidth=a||1;this.toString=function(){return"THREE.FaceColorStrokeMaterial ( lineWidth: "+this.lineWidth+" )"}};THREE.Scene=function(){this.objects=[];this.add=function(a){this.objects.push(a)};this.toString=function(){return"THREE.Scene ( "+this.objects+" )"}};THREE.Renderer=function(){var f=[],c=[],e=[],a=[],b=new THREE.Matrix4();this.renderList;function d(h,g){return h.screenZ-g.screenZ}this.project=function(A,y){var v,t,z,q,o,B,n,l,k,h,r=0,x=0,s=0,u=0,w=y.focus,p=y.focus*y.zoom,m=0,g=0;this.renderList=[];if(y.autoUpdateMatrix){y.updateMatrix()}for(v=0;v<A.objects.length;v++){B=A.objects[v];if(B.autoUpdateMatrix){B.updateMatrix()}if(B instanceof THREE.Mesh){b.multiply(y.matrix,B.matrix);m=B.geometry.vertices.length;for(t=0;t<m;t++){z=B.geometry.vertices[t];z.screen.copy(z.position);b.transform(z.screen);z.screen.z=p/(w+z.screen.z);z.__visible=z.screen.z>0;z.screen.x*=z.screen.z;z.screen.y*=z.screen.z}g=B.geometry.faces.length;for(t=0;t<g;t++){o=B.geometry.faces[t];if(o instanceof THREE.Face3){n=B.geometry.vertices[o.a];l=B.geometry.vertices[o.b];k=B.geometry.vertices[o.c];if(n.__visible&&l.__visible&&k.__visible&&(B.doubleSided||(k.screen.x-n.screen.x)*(l.screen.y-n.screen.y)-(k.screen.y-n.screen.y)*(l.screen.x-n.screen.x)>0)){o.screen.z=(n.screen.z+l.screen.z+k.screen.z)*0.3;if(!f[r]){f[r]=new THREE.RenderableFace3()}f[r].v1.x=n.screen.x;f[r].v1.y=n.screen.y;f[r].v2.x=l.screen.x;f[r].v2.y=l.screen.y;f[r].v3.x=k.screen.x;f[r].v3.y=k.screen.y;f[r].screenZ=o.screen.z;f[r].material=B.material;f[r].uvs=B.geometry.uvs[t];f[r].color=o.color;this.renderList.push(f[r]);r++}}else{if(o instanceof THREE.Face4){n=B.geometry.vertices[o.a];l=B.geometry.vertices[o.b];k=B.geometry.vertices[o.c];h=B.geometry.vertices[o.d];if(n.__visible&&l.__visible&&k.__visible&&h.__visible&&(B.doubleSided||((h.screen.x-n.screen.x)*(l.screen.y-n.screen.y)-(h.screen.y-n.screen.y)*(l.screen.x-n.screen.x)>0||(l.screen.x-k.screen.x)*(h.screen.y-k.screen.y)-(l.screen.y-k.screen.y)*(h.screen.x-k.screen.x)>0))){o.screen.z=(n.screen.z+l.screen.z+k.screen.z+h.screen.z)*0.25;if(!c[x]){c[x]=new THREE.RenderableFace4()}c[x].v1.x=n.screen.x;c[x].v1.y=n.screen.y;c[x].v2.x=l.screen.x;c[x].v2.y=l.screen.y;c[x].v3.x=k.screen.x;c[x].v3.y=k.screen.y;c[x].v4.x=h.screen.x;c[x].v4.y=h.screen.y;c[x].screenZ=o.screen.z;c[x].material=B.material;c[x].uvs=B.geometry.uvs[t];c[x].color=o.color;this.renderList.push(c[x]);x++}}}}}else{if(B instanceof THREE.Line){b.multiply(y.matrix,B.matrix);m=B.geometry.vertices.length;for(t=0;t<m;t++){z=B.geometry.vertices[t];z.screen.copy(z.position);b.transform(z.screen);z.screen.z=p/(w+z.screen.z);z.visible=z.screen.z>0;z.screen.x*=z.screen.z;z.screen.y*=z.screen.z;if(t>0){q=B.geometry.vertices[t-1];if(!z.visible||!q.visible){continue}if(!e[s]){e[s]=new THREE.RenderableLine()}e[s].v1.x=z.screen.x;e[s].v1.y=z.screen.y;e[s].v2.x=q.screen.x;e[s].v2.y=q.screen.y;e[s].screenZ=(z.screen.z+q.screen.z)*0.5;e[s].material=B.material;this.renderList.push(e[s]);s++}}}else{if(B instanceof THREE.Particle){B.screen.copy(B.position);y.matrix.transform(B.screen);B.screen.z=p/(w+B.screen.z);if(B.screen.z<0){continue}B.screen.x*=B.screen.z;B.screen.y*=B.screen.z;if(!a[u]){a[u]=new THREE.RenderableParticle()}a[u].x=B.screen.x;a[u].y=B.screen.y;a[u].screenZ=B.screen.z;a[u].size=B.size;a[u].material=B.material;a[u].color=B.color;this.renderList.push(a[u]);u++}}}}this.renderList.sort(d)}};THREE.CanvasRenderer=function(){THREE.Renderer.call(this);var b=document.createElement("canvas"),a=b.getContext("2d"),e=new THREE.Rectangle(),h=new THREE.Rectangle(0,0,0,0),f=new THREE.Rectangle(),c=new THREE.Vector2();this.setSize=function(j,i){b.width=j;b.height=i;a.setTransform(1,0,0,1,j/2,i/2);e.set(-j/2,-i/2,j/2,i/2)};this.domElement=b;this.render=function(E,z){var y,w,m,u=Math.PI*2,K,s,J,p,o,x,v,l,k,r,q,C=new THREE.Vector2(),B=new THREE.Vector2(),A=new THREE.Vector2(),I=new THREE.Vector2(),H=new THREE.Vector2(),F=new THREE.Vector2(),G,D,n,t;h.inflate(1);h.minSelf(e);a.clearRect(h.getX(),h.getY(),h.getWidth(),h.getHeight());h.empty();this.project(E,z);K=this.renderList.length;for(y=0;y<K;y++){m=this.renderList[y];f.empty();a.beginPath();if(m instanceof THREE.RenderableParticle){t=m.size*m.screenZ;f.set(m.x-t,m.y-t,m.x+t,m.y+t);if(!e.instersects(f)){continue}a.arc(m.x,m.y,t,0,u,true)}else{if(m instanceof THREE.RenderableLine){p=m.v1.x;o=m.v1.y;x=m.v2.x;v=m.v2.y;f.addPoint(p,o);f.addPoint(x,v);if(!e.instersects(f)){continue}a.moveTo(p,o);a.lineTo(x,v)}else{if(m instanceof THREE.RenderableFace3){d(m.v1,m.v2);d(m.v2,m.v3);d(m.v3,m.v1);p=m.v1.x;o=m.v1.y;x=m.v2.x;v=m.v2.y;l=m.v3.x;k=m.v3.y;f.addPoint(p,o);f.addPoint(x,v);f.addPoint(l,k);if(!e.instersects(f)){continue}h.addRectangle(f);a.moveTo(p,o);a.lineTo(x,v);a.lineTo(l,k);a.lineTo(p,o)}else{if(m instanceof THREE.RenderableFace4){d(m.v1,m.v2);d(m.v2,m.v3);d(m.v3,m.v4);d(m.v4,m.v1);p=m.v1.x;o=m.v1.y;x=m.v2.x;v=m.v2.y;l=m.v3.x;k=m.v3.y;r=m.v4.x;q=m.v4.y;f.addPoint(p,o);f.addPoint(x,v);f.addPoint(l,k);f.addPoint(r,q);if(!e.instersects(f)){continue}a.moveTo(p,o);a.lineTo(x,v);a.lineTo(l,k);a.lineTo(r,q);a.lineTo(p,o)}}}}a.closePath();J=m.material.length;for(w=0;w<J;w++){s=m.material[w];if(s instanceof THREE.ColorFillMaterial){a.fillStyle=s.color.__styleString;a.fill()}else{if(s instanceof THREE.FaceColorFillMaterial){a.fillStyle=m.color.__styleString;a.fill()}else{if(s instanceof THREE.ColorStrokeMaterial){a.lineWidth=s.lineWidth;a.lineJoin="round";a.lineCap="round";a.strokeStyle=s.color.__styleString;a.stroke();f.inflate(a.lineWidth)}else{if(s instanceof THREE.FaceColorStrokeMaterial){a.lineWidth=s.lineWidth;a.lineJoin="round";a.lineCap="round";a.strokeStyle=m.color.__styleString;a.stroke();f.inflate(a.lineWidth)}else{if(s instanceof THREE.BitmapUVMappingMaterial){C.copy(m.uvs[0]),B.copy(m.uvs[1]),A.copy(m.uvs[2]),I.copy(C),H.copy(B),F.copy(A),G=s.bitmap,D=G.width,n=G.height;I.x*=D;I.y*=n;H.x*=D;H.y*=n;F.x*=D;F.y*=n;d(I,H);d(H,F);d(F,I);I.x=C.x==0?0:I.x;I.x=C.x==1?D:I.x;I.y=C.y==0?0:I.y;I.y=C.y==1?n:I.y;H.x=B.x==0?0:H.x;H.x=B.x==1?D:H.x;H.y=B.y==0?0:H.y;H.y=B.y==1?n:H.y;F.x=A.x==0?0:F.x;F.x=A.x==1?D:F.x;F.y=A.y==0?0:F.y;F.y=A.y==1?n:F.y;g(G,f,p,o,x,v,l,k,I.x,I.y,H.x,H.y,F.x,F.y)}}}}}}h.addRectangle(f)}};function g(u,i,A,m,z,l,y,k,r,x,q,w,p,v){var j,C,B,o,n,t,s;a.save();a.clip();j=r*(v-w)-q*v+p*w+(q-p)*x;C=-(x*(y-z)-w*y+v*z+(w-v)*A)/j;B=(w*k+x*(l-k)-v*l+(v-w)*m)/j;o=(r*(y-z)-q*y+p*z+(q-p)*A)/j;n=-(q*k+r*(l-k)-p*l+(p-q)*m)/j;t=(r*(v*z-w*y)+x*(q*y-p*z)+(p*w-q*v)*A)/j;s=(r*(v*l-w*k)+x*(q*k-p*l)+(p*w-q*v)*m)/j;a.transform(C,B,o,n,t,s);a.drawImage(u,0,0);a.restore()}function d(j,i){c.sub(i,j);c.unit();i.addSelf(c);j.subSelf(c)}};THREE.CanvasRenderer.prototype=new THREE.Renderer();THREE.CanvasRenderer.prototype.constructor=THREE.CanvasRenderer;THREE.SVGRenderer=function(){THREE.Renderer.call(this);var a=document.createElementNS("http://www.w3.org/2000/svg","svg"),e=new THREE.Rectangle(),h=new THREE.Rectangle(),d=[],b=[],g=1;this.setQuality=function(i){switch(i){case"high":g=1;break;case"low":g=0;break}};this.setSize=function(j,i){a.setAttribute("viewBox",(-j/2)+" "+(-i/2)+" "+j+" "+i);a.setAttribute("width",j);a.setAttribute("height",i);e.set(-j/2,-i/2,j/2,i/2)};this.domElement=a;this.render=function(B,A){var z,x,m,D,s,C,v=0,n=0,t,q,o,y,w,l,k,r,p,u;this.project(B,A);while(a.childNodes.length>0){a.removeChild(a.childNodes[0])}D=this.renderList.length;for(z=0;z<D;z++){m=this.renderList[z];C=m.material.length;for(x=0;x<C;x++){s=m.material[x];h.empty();if(m instanceof THREE.RenderableFace3){q=m.v1.x;o=m.v1.y;y=m.v2.x;w=m.v2.y;l=m.v3.x;k=m.v3.y;h.addPoint(q,o);h.addPoint(y,w);h.addPoint(l,k);if(!e.instersects(h)){continue}t=c(v++);t.setAttribute("d","M "+q+" "+o+" L "+y+" "+w+" L "+l+","+k+"z")}else{if(m instanceof THREE.RenderableFace4){q=m.v1.x;o=m.v1.y;y=m.v2.x;w=m.v2.y;l=m.v3.x;k=m.v3.y;r=m.v4.x;p=m.v4.y;h.addPoint(q,o);h.addPoint(y,w);h.addPoint(l,k);h.addPoint(r,p);if(!e.instersects(h)){continue}t=c(v++);t.setAttribute("d","M "+q+" "+o+" L "+y+" "+w+" L "+l+","+k+" L "+r+","+p+"z")}else{if(m instanceof THREE.RenderableParticle){u=m.size*m.screenZ;h.set(m.x-u,m.y-u,m.x+u,m.y+u);if(!e.instersects(h)){continue}t=f(n++);t.setAttribute("cx",m.x);t.setAttribute("cy",m.y);t.setAttribute("r",u)}}}if(s instanceof THREE.ColorFillMaterial){t.setAttribute("style","fill: "+s.color.__svgStyleString)}else{if(s instanceof THREE.FaceColorFillMaterial){t.setAttribute("style","fill: "+m.color.__svgStyleString)}else{if(s instanceof THREE.ColorStrokeMaterial){t.setAttribute("style","fill: none; stroke: "+s.color.__svgStyleString+"; stroke-width: "+s.lineWidth+"; stroke-linecap: round; stroke-linejoin: round")}else{if(s instanceof THREE.FaceColorStrokeMaterial){t.setAttribute("style","fill: none; stroke: "+m.color.__svgStyleString+"; stroke-width: "+s.lineWidth+"; stroke-linecap: round; stroke-linejoin: round")}}}}a.appendChild(t)}}};function c(i){if(d[i]==null){d[i]=document.createElementNS("http://www.w3.org/2000/svg","path");if(g==0){d[i].setAttribute("shape-rendering","crispEdges")}return d[i]}return d[i]}function f(i){if(b[i]==null){b[i]=document.createElementNS("http://www.w3.org/2000/svg","circle");if(g==0){b[i].setAttribute("shape-rendering","crispEdges")}return b[i]}return b[i]}};THREE.SVGRenderer.prototype=new THREE.Renderer();THREE.SVGRenderer.prototype.constructor=THREE.CanvasRenderer;THREE.RenderableFace3=function(){this.v1=new THREE.Vector2();this.v2=new THREE.Vector2();this.v3=new THREE.Vector2();this.screenZ;this.color;this.material};THREE.RenderableFace4=function(){this.v1=new THREE.Vector2();this.v2=new THREE.Vector2();this.v3=new THREE.Vector2();this.v4=new THREE.Vector2();this.screenZ;this.color;this.material};THREE.RenderableParticle=function(){this.x;this.y;this.screenZ;this.color;this.material};THREE.RenderableLine=function(){this.v1=new THREE.Vector2();this.v2=new THREE.Vector2();this.screenZ;this.color;this.material};