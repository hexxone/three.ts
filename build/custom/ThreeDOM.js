// ThreeDOM.js r32 - http://github.com/mrdoob/three.js
var THREE=THREE||{};THREE.Color=function(a){this.setHex(a)};
THREE.Color.prototype={autoUpdate:!0,setRGB:function(a,b,c){this.r=a;this.g=b;this.b=c;if(this.autoUpdate){this.updateHex();this.updateStyleString()}},setHSV:function(a,b,c){var e,d,f,g,i,h;if(c==0)e=d=f=0;else{g=Math.floor(a*6);i=a*6-g;a=c*(1-b);h=c*(1-b*i);b=c*(1-b*(1-i));switch(g){case 1:e=h;d=c;f=a;break;case 2:e=a;d=c;f=b;break;case 3:e=a;d=h;f=c;break;case 4:e=b;d=a;f=c;break;case 5:e=c;d=a;f=h;break;case 6:case 0:e=c;d=b;f=a}}this.r=e;this.g=d;this.b=f;if(this.autoUpdate){this.updateHex();
this.updateStyleString()}},setHex:function(a){this.hex=~~a&16777215;if(this.autoUpdate){this.updateRGBA();this.updateStyleString()}},updateHex:function(){this.hex=~~(this.r*255)<<16^~~(this.g*255)<<8^~~(this.b*255)},updateRGBA:function(){this.r=(this.hex>>16&255)/255;this.g=(this.hex>>8&255)/255;this.b=(this.hex&255)/255},updateStyleString:function(){this.__styleString="rgb("+~~(this.r*255)+","+~~(this.g*255)+","+~~(this.b*255)+")"},clone:function(){return new THREE.Color(this.hex)},toString:function(){return"THREE.Color ( r: "+
this.r+", g: "+this.g+", b: "+this.b+", hex: "+this.hex+" )"}};THREE.Vector2=function(a,b){this.x=a||0;this.y=b||0};
THREE.Vector2.prototype={set:function(a,b){this.x=a;this.y=b;return this},copy:function(a){this.x=a.x;this.y=a.y;return this},addSelf:function(a){this.x+=a.x;this.y+=a.y;return this},add:function(a,b){this.x=a.x+b.x;this.y=a.y+b.y;return this},subSelf:function(a){this.x-=a.x;this.y-=a.y;return this},sub:function(a,b){this.x=a.x-b.x;this.y=a.y-b.y;return this},multiplyScalar:function(a){this.x*=a;this.y*=a;return this},unit:function(){this.multiplyScalar(1/this.length());return this},length:function(){return Math.sqrt(this.x*
this.x+this.y*this.y)},lengthSq:function(){return this.x*this.x+this.y*this.y},negate:function(){this.x=-this.x;this.y=-this.y;return this},clone:function(){return new THREE.Vector2(this.x,this.y)},toString:function(){return"THREE.Vector2 ("+this.x+", "+this.y+")"}};THREE.Vector3=function(a,b,c){this.x=a||0;this.y=b||0;this.z=c||0};
THREE.Vector3.prototype={set:function(a,b,c){this.x=a;this.y=b;this.z=c;return this},copy:function(a){this.x=a.x;this.y=a.y;this.z=a.z;return this},add:function(a,b){this.x=a.x+b.x;this.y=a.y+b.y;this.z=a.z+b.z;return this},addSelf:function(a){this.x+=a.x;this.y+=a.y;this.z+=a.z;return this},addScalar:function(a){this.x+=a;this.y+=a;this.z+=a;return this},sub:function(a,b){this.x=a.x-b.x;this.y=a.y-b.y;this.z=a.z-b.z;return this},subSelf:function(a){this.x-=a.x;this.y-=a.y;this.z-=a.z;return this},
cross:function(a,b){this.x=a.y*b.z-a.z*b.y;this.y=a.z*b.x-a.x*b.z;this.z=a.x*b.y-a.y*b.x;return this},crossSelf:function(a){var b=this.x,c=this.y,e=this.z;this.x=c*a.z-e*a.y;this.y=e*a.x-b*a.z;this.z=b*a.y-c*a.x;return this},multiply:function(a,b){this.x=a.x*b.x;this.y=a.y*b.y;this.z=a.z*b.z;return this},multiplySelf:function(a){this.x*=a.x;this.y*=a.y;this.z*=a.z;return this},multiplyScalar:function(a){this.x*=a;this.y*=a;this.z*=a;return this},divideSelf:function(a){this.x/=a.x;this.y/=a.y;this.z/=
a.z;return this},divideScalar:function(a){this.x/=a;this.y/=a;this.z/=a;return this},dot:function(a){return this.x*a.x+this.y*a.y+this.z*a.z},distanceTo:function(a){var b=this.x-a.x,c=this.y-a.y;a=this.z-a.z;return Math.sqrt(b*b+c*c+a*a)},distanceToSquared:function(a){var b=this.x-a.x,c=this.y-a.y;a=this.z-a.z;return b*b+c*c+a*a},length:function(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)},lengthSq:function(){return this.x*this.x+this.y*this.y+this.z*this.z},lengthManhattan:function(){return this.x+
this.y+this.z},negate:function(){this.x=-this.x;this.y=-this.y;this.z=-this.z;return this},normalize:function(){var a=Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z);a>0?this.multiplyScalar(1/a):this.set(0,0,0);return this},setLength:function(a){return this.normalize().multiplyScalar(a)},isZero:function(){return Math.abs(this.x)<1.0E-4&&Math.abs(this.y)<1.0E-4&&Math.abs(this.z)<1.0E-4},clone:function(){return new THREE.Vector3(this.x,this.y,this.z)},toString:function(){return"THREE.Vector3 ( "+
this.x+", "+this.y+", "+this.z+" )"}};THREE.Vector4=function(a,b,c,e){this.x=a||0;this.y=b||0;this.z=c||0;this.w=e||1};
THREE.Vector4.prototype={set:function(a,b,c,e){this.x=a;this.y=b;this.z=c;this.w=e;return this},copy:function(a){this.x=a.x;this.y=a.y;this.z=a.z;this.w=a.w||1;return this},add:function(a,b){this.x=a.x+b.x;this.y=a.y+b.y;this.z=a.z+b.z;this.w=a.w+b.w;return this},addSelf:function(a){this.x+=a.x;this.y+=a.y;this.z+=a.z;this.w+=a.w;return this},sub:function(a,b){this.x=a.x-b.x;this.y=a.y-b.y;this.z=a.z-b.z;this.w=a.w-b.w;return this},subSelf:function(a){this.x-=a.x;this.y-=a.y;this.z-=a.z;this.w-=a.w;
return this},multiplyScalar:function(a){this.x*=a;this.y*=a;this.z*=a;this.w*=a;return this},divideScalar:function(a){this.x/=a;this.y/=a;this.z/=a;this.w/=a;return this},lerpSelf:function(a,b){this.x+=(a.x-this.x)*b;this.y+=(a.y-this.y)*b;this.z+=(a.z-this.z)*b;this.w+=(a.w-this.w)*b},clone:function(){return new THREE.Vector4(this.x,this.y,this.z,this.w)},toString:function(){return"THREE.Vector4 ("+this.x+", "+this.y+", "+this.z+", "+this.w+")"}};
THREE.Ray=function(a,b){this.origin=a||new THREE.Vector3;this.direction=b||new THREE.Vector3};
THREE.Ray.prototype={intersectScene:function(a){var b,c,e=a.objects,d=[];a=0;for(b=e.length;a<b;a++){c=e[a];c instanceof THREE.Mesh&&(d=d.concat(this.intersectObject(c)))}d.sort(function(f,g){return f.distance-g.distance});return d},intersectObject:function(a){function b(p,k,C,y){y=y.clone().subSelf(k);C=C.clone().subSelf(k);var F=p.clone().subSelf(k);p=y.dot(y);k=y.dot(C);y=y.dot(F);var G=C.dot(C);C=C.dot(F);F=1/(p*G-k*k);G=(G*y-k*C)*F;p=(p*C-k*y)*F;return G>0&&p>0&&G+p<1}var c,e,d,f,g,i,h,j,m,n,
l,o=a.geometry,q=o.vertices,r=[];c=0;for(e=o.faces.length;c<e;c++){d=o.faces[c];n=this.origin.clone();l=this.direction.clone();h=a.globalMatrix;h.extractRotationMatrix(a.matrixRotation);f=h.multiplyVector3(q[d.a].position.clone());g=h.multiplyVector3(q[d.b].position.clone());i=h.multiplyVector3(q[d.c].position.clone());h=d instanceof THREE.Face4?h.multiplyVector3(q[d.d].position.clone()):null;j=a.matrixRotation.multiplyVector3(d.normal.clone());m=l.dot(j);if(m<0){j=j.dot((new THREE.Vector3).sub(f,
n))/m;n=n.addSelf(l.multiplyScalar(j));if(d instanceof THREE.Face3){if(b(n,f,g,i)){d={distance:this.origin.distanceTo(n),point:n,face:d,object:a};r.push(d)}}else if(d instanceof THREE.Face4&&(b(n,f,g,h)||b(n,g,i,h))){d={distance:this.origin.distanceTo(n),point:n,face:d,object:a};r.push(d)}}}return r}};
THREE.Rectangle=function(){function a(){f=e-b;g=d-c}var b,c,e,d,f,g,i=!0;this.getX=function(){return b};this.getY=function(){return c};this.getWidth=function(){return f};this.getHeight=function(){return g};this.getLeft=function(){return b};this.getTop=function(){return c};this.getRight=function(){return e};this.getBottom=function(){return d};this.set=function(h,j,m,n){i=!1;b=h;c=j;e=m;d=n;a()};this.addPoint=function(h,j){if(i){i=!1;b=h;c=j;e=h;d=j}else{b=b<h?b:h;c=c<j?c:j;e=e>h?e:h;d=d>j?d:j}a()};
this.add3Points=function(h,j,m,n,l,o){if(i){i=!1;b=h<m?h<l?h:l:m<l?m:l;c=j<n?j<o?j:o:n<o?n:o;e=h>m?h>l?h:l:m>l?m:l;d=j>n?j>o?j:o:n>o?n:o}else{b=h<m?h<l?h<b?h:b:l<b?l:b:m<l?m<b?m:b:l<b?l:b;c=j<n?j<o?j<c?j:c:o<c?o:c:n<o?n<c?n:c:o<c?o:c;e=h>m?h>l?h>e?h:e:l>e?l:e:m>l?m>e?m:e:l>e?l:e;d=j>n?j>o?j>d?j:d:o>d?o:d:n>o?n>d?n:d:o>d?o:d}a()};this.addRectangle=function(h){if(i){i=!1;b=h.getLeft();c=h.getTop();e=h.getRight();d=h.getBottom()}else{b=b<h.getLeft()?b:h.getLeft();c=c<h.getTop()?c:h.getTop();e=e>h.getRight()?
e:h.getRight();d=d>h.getBottom()?d:h.getBottom()}a()};this.inflate=function(h){b-=h;c-=h;e+=h;d+=h;a()};this.minSelf=function(h){b=b>h.getLeft()?b:h.getLeft();c=c>h.getTop()?c:h.getTop();e=e<h.getRight()?e:h.getRight();d=d<h.getBottom()?d:h.getBottom();a()};this.instersects=function(h){return Math.min(e,h.getRight())-Math.max(b,h.getLeft())>=0&&Math.min(d,h.getBottom())-Math.max(c,h.getTop())>=0};this.empty=function(){i=!0;d=e=c=b=0;a()};this.isEmpty=function(){return i};this.toString=function(){return"THREE.Rectangle ( left: "+
b+", right: "+e+", top: "+c+", bottom: "+d+", width: "+f+", height: "+g+" )"}};THREE.Matrix3=function(){this.m=[]};THREE.Matrix3.prototype={transpose:function(){var a,b=this.m;a=b[1];b[1]=b[3];b[3]=a;a=b[2];b[2]=b[6];b[6]=a;a=b[5];b[5]=b[7];b[7]=a;return this},transposeIntoArray:function(a){var b=this.m;a[0]=b[0];a[1]=b[3];a[2]=b[6];a[3]=b[1];a[4]=b[4];a[5]=b[7];a[6]=b[2];a[7]=b[5];a[8]=b[8];return this}};
THREE.Matrix4=function(a,b,c,e,d,f,g,i,h,j,m,n,l,o,q,r){this.n11=a||1;this.n12=b||0;this.n13=c||0;this.n14=e||0;this.n21=d||0;this.n22=f||1;this.n23=g||0;this.n24=i||0;this.n31=h||0;this.n32=j||0;this.n33=m||1;this.n34=n||0;this.n41=l||0;this.n42=o||0;this.n43=q||0;this.n44=r||1;this.flat=Array(16);this.m33=new THREE.Matrix3};
THREE.Matrix4.prototype={identity:function(){this.n11=1;this.n21=this.n14=this.n13=this.n12=0;this.n22=1;this.n32=this.n31=this.n24=this.n23=0;this.n33=1;this.n43=this.n42=this.n41=this.n34=0;this.n44=1;return this},set:function(a,b,c,e,d,f,g,i,h,j,m,n,l,o,q,r){this.n11=a;this.n12=b;this.n13=c;this.n14=e;this.n21=d;this.n22=f;this.n23=g;this.n24=i;this.n31=h;this.n32=j;this.n33=m;this.n34=n;this.n41=l;this.n42=o;this.n43=q;this.n44=r;return this},copy:function(a){this.n11=a.n11;this.n12=a.n12;this.n13=
a.n13;this.n14=a.n14;this.n21=a.n21;this.n22=a.n22;this.n23=a.n23;this.n24=a.n24;this.n31=a.n31;this.n32=a.n32;this.n33=a.n33;this.n34=a.n34;this.n41=a.n41;this.n42=a.n42;this.n43=a.n43;this.n44=a.n44;return this},lookAt:function(a,b,c){var e=THREE.Matrix4.__tmpVec1,d=THREE.Matrix4.__tmpVec2,f=THREE.Matrix4.__tmpVec3;f.sub(a,b).normalize();e.cross(c,f).normalize();d.cross(f,e).normalize();this.n11=e.x;this.n12=e.y;this.n13=e.z;this.n14=-e.dot(a);this.n21=d.x;this.n22=d.y;this.n23=d.z;this.n24=-d.dot(a);
this.n31=f.x;this.n32=f.y;this.n33=f.z;this.n34=-f.dot(a);this.n43=this.n42=this.n41=0;this.n44=1;return this},multiplyVector3:function(a){var b=a.x,c=a.y,e=a.z,d=1/(this.n41*b+this.n42*c+this.n43*e+this.n44);a.x=(this.n11*b+this.n12*c+this.n13*e+this.n14)*d;a.y=(this.n21*b+this.n22*c+this.n23*e+this.n24)*d;a.z=(this.n31*b+this.n32*c+this.n33*e+this.n34)*d;return a},multiplyVector3OnlyZ:function(a){var b=a.x,c=a.y;a=a.z;return(this.n31*b+this.n32*c+this.n33*a+this.n34)*(1/(this.n41*b+this.n42*c+this.n43*
a+this.n44))},multiplyVector4:function(a){var b=a.x,c=a.y,e=a.z,d=a.w;a.x=this.n11*b+this.n12*c+this.n13*e+this.n14*d;a.y=this.n21*b+this.n22*c+this.n23*e+this.n24*d;a.z=this.n31*b+this.n32*c+this.n33*e+this.n34*d;a.w=this.n41*b+this.n42*c+this.n43*e+this.n44*d;return a},crossVector:function(a){var b=new THREE.Vector4;b.x=this.n11*a.x+this.n12*a.y+this.n13*a.z+this.n14*a.w;b.y=this.n21*a.x+this.n22*a.y+this.n23*a.z+this.n24*a.w;b.z=this.n31*a.x+this.n32*a.y+this.n33*a.z+this.n34*a.w;b.w=a.w?this.n41*
a.x+this.n42*a.y+this.n43*a.z+this.n44*a.w:1;return b},multiply:function(a,b){var c=a.n11,e=a.n12,d=a.n13,f=a.n14,g=a.n21,i=a.n22,h=a.n23,j=a.n24,m=a.n31,n=a.n32,l=a.n33,o=a.n34,q=a.n41,r=a.n42,p=a.n43,k=a.n44,C=b.n11,y=b.n12,F=b.n13,G=b.n14,J=b.n21,w=b.n22,u=b.n23,D=b.n24,A=b.n31,E=b.n32,z=b.n33,v=b.n34,t=b.n41,I=b.n42,s=b.n43,H=b.n44;this.n11=c*C+e*J+d*A+f*t;this.n12=c*y+e*w+d*E+f*I;this.n13=c*F+e*u+d*z+f*s;this.n14=c*G+e*D+d*v+f*H;this.n21=g*C+i*J+h*A+j*t;this.n22=g*y+i*w+h*E+j*I;this.n23=g*F+
i*u+h*z+j*s;this.n24=g*G+i*D+h*v+j*H;this.n31=m*C+n*J+l*A+o*t;this.n32=m*y+n*w+l*E+o*I;this.n33=m*F+n*u+l*z+o*s;this.n34=m*G+n*D+l*v+o*H;this.n41=q*C+r*J+p*A+k*t;this.n42=q*y+r*w+p*E+k*I;this.n43=q*F+r*u+p*z+k*s;this.n44=q*G+r*D+p*v+k*H;return this},multiplyToArray:function(a,b,c){var e=a.n11,d=a.n12,f=a.n13,g=a.n14,i=a.n21,h=a.n22,j=a.n23,m=a.n24,n=a.n31,l=a.n32,o=a.n33,q=a.n34,r=a.n41,p=a.n42,k=a.n43;a=a.n44;var C=b.n11,y=b.n12,F=b.n13,G=b.n14,J=b.n21,w=b.n22,u=b.n23,D=b.n24,A=b.n31,E=b.n32,z=b.n33,
v=b.n34,t=b.n41,I=b.n42,s=b.n43;b=b.n44;this.n11=e*C+d*J+f*A+g*t;this.n12=e*y+d*w+f*E+g*I;this.n13=e*F+d*u+f*z+g*s;this.n14=e*G+d*D+f*v+g*b;this.n21=i*C+h*J+j*A+m*t;this.n22=i*y+h*w+j*E+m*I;this.n23=i*F+h*u+j*z+m*s;this.n24=i*G+h*D+j*v+m*b;this.n31=n*C+l*J+o*A+q*t;this.n32=n*y+l*w+o*E+q*I;this.n33=n*F+l*u+o*z+q*s;this.n34=n*G+l*D+o*v+q*b;this.n41=r*C+p*J+k*A+a*t;this.n42=r*y+p*w+k*E+a*I;this.n43=r*F+p*u+k*z+a*s;this.n44=r*G+p*D+k*v+a*b;c[0]=this.n11;c[1]=this.n21;c[2]=this.n31;c[3]=this.n41;c[4]=
this.n12;c[5]=this.n22;c[6]=this.n32;c[7]=this.n42;c[8]=this.n13;c[9]=this.n23;c[10]=this.n33;c[11]=this.n43;c[12]=this.n14;c[13]=this.n24;c[14]=this.n34;c[15]=this.n44;return this},multiplySelf:function(a){var b=this.n11,c=this.n12,e=this.n13,d=this.n14,f=this.n21,g=this.n22,i=this.n23,h=this.n24,j=this.n31,m=this.n32,n=this.n33,l=this.n34,o=this.n41,q=this.n42,r=this.n43,p=this.n44,k=a.n11,C=a.n21,y=a.n31,F=a.n41,G=a.n12,J=a.n22,w=a.n32,u=a.n42,D=a.n13,A=a.n23,E=a.n33,z=a.n43,v=a.n14,t=a.n24,I=
a.n34;a=a.n44;this.n11=b*k+c*C+e*y+d*F;this.n12=b*G+c*J+e*w+d*u;this.n13=b*D+c*A+e*E+d*z;this.n14=b*v+c*t+e*I+d*a;this.n21=f*k+g*C+i*y+h*F;this.n22=f*G+g*J+i*w+h*u;this.n23=f*D+g*A+i*E+h*z;this.n24=f*v+g*t+i*I+h*a;this.n31=j*k+m*C+n*y+l*F;this.n32=j*G+m*J+n*w+l*u;this.n33=j*D+m*A+n*E+l*z;this.n34=j*v+m*t+n*I+l*a;this.n41=o*k+q*C+r*y+p*F;this.n42=o*G+q*J+r*w+p*u;this.n43=o*D+q*A+r*E+p*z;this.n44=o*v+q*t+r*I+p*a;return this},multiplyScalar:function(a){this.n11*=a;this.n12*=a;this.n13*=a;this.n14*=a;
this.n21*=a;this.n22*=a;this.n23*=a;this.n24*=a;this.n31*=a;this.n32*=a;this.n33*=a;this.n34*=a;this.n41*=a;this.n42*=a;this.n43*=a;this.n44*=a;return this},determinant:function(){var a=this.n11,b=this.n12,c=this.n13,e=this.n14,d=this.n21,f=this.n22,g=this.n23,i=this.n24,h=this.n31,j=this.n32,m=this.n33,n=this.n34,l=this.n41,o=this.n42,q=this.n43,r=this.n44;return e*g*j*l-c*i*j*l-e*f*m*l+b*i*m*l+c*f*n*l-b*g*n*l-e*g*h*o+c*i*h*o+e*d*m*o-a*i*m*o-c*d*n*o+a*g*n*o+e*f*h*q-b*i*h*q-e*d*j*q+a*i*j*q+b*d*n*
q-a*f*n*q-c*f*h*r+b*g*h*r+c*d*j*r-a*g*j*r-b*d*m*r+a*f*m*r},transpose:function(){function a(b,c,e){var d=b[c];b[c]=b[e];b[e]=d}a(this,"n21","n12");a(this,"n31","n13");a(this,"n32","n23");a(this,"n41","n14");a(this,"n42","n24");a(this,"n43","n34");return this},clone:function(){var a=new THREE.Matrix4;a.n11=this.n11;a.n12=this.n12;a.n13=this.n13;a.n14=this.n14;a.n21=this.n21;a.n22=this.n22;a.n23=this.n23;a.n24=this.n24;a.n31=this.n31;a.n32=this.n32;a.n33=this.n33;a.n34=this.n34;a.n41=this.n41;a.n42=
this.n42;a.n43=this.n43;a.n44=this.n44;return a},flatten:function(){var a=this.flat;a[0]=this.n11;a[1]=this.n21;a[2]=this.n31;a[3]=this.n41;a[4]=this.n12;a[5]=this.n22;a[6]=this.n32;a[7]=this.n42;a[8]=this.n13;a[9]=this.n23;a[10]=this.n33;a[11]=this.n43;a[12]=this.n14;a[13]=this.n24;a[14]=this.n34;a[15]=this.n44;return a},flattenToArray:function(a){a[0]=this.n11;a[1]=this.n21;a[2]=this.n31;a[3]=this.n41;a[4]=this.n12;a[5]=this.n22;a[6]=this.n32;a[7]=this.n42;a[8]=this.n13;a[9]=this.n23;a[10]=this.n33;
a[11]=this.n43;a[12]=this.n14;a[13]=this.n24;a[14]=this.n34;a[15]=this.n44;return a},flattenToArrayOffset:function(a,b){a[b]=this.n11;a[b+1]=this.n21;a[b+2]=this.n31;a[b+3]=this.n41;a[b+4]=this.n12;a[b+5]=this.n22;a[b+6]=this.n32;a[b+7]=this.n42;a[b+8]=this.n13;a[b+9]=this.n23;a[b+10]=this.n33;a[b+11]=this.n43;a[b+12]=this.n14;a[b+13]=this.n24;a[b+14]=this.n34;a[b+15]=this.n44;return a},setTranslation:function(a,b,c){this.set(1,0,0,a,0,1,0,b,0,0,1,c,0,0,0,1);return this},setScale:function(a,b,c){this.set(a,
0,0,0,0,b,0,0,0,0,c,0,0,0,0,1);return this},setRotX:function(a){var b=Math.cos(a);a=Math.sin(a);this.set(1,0,0,0,0,b,-a,0,0,a,b,0,0,0,0,1);return this},setRotY:function(a){var b=Math.cos(a);a=Math.sin(a);this.set(b,0,a,0,0,1,0,0,-a,0,b,0,0,0,0,1);return this},setRotZ:function(a){var b=Math.cos(a);a=Math.sin(a);this.set(b,-a,0,0,a,b,0,0,0,0,1,0,0,0,0,1);return this},setRotAxis:function(a,b){var c=Math.cos(b),e=Math.sin(b),d=1-c,f=a.x,g=a.y,i=a.z,h=d*f,j=d*g;this.set(h*f+c,h*g-e*i,h*i+e*g,0,h*g+e*i,
j*g+c,j*i-e*f,0,h*i-e*g,j*i+e*f,d*i*i+c,0,0,0,0,1);return this},setPosition:function(a){this.n14=a.x;this.n24=a.y;this.n34=a.z;return this},setRotationFromEuler:function(a){var b=a.x,c=a.y,e=a.z;a=Math.cos(b);b=Math.sin(b);var d=Math.cos(c);c=Math.sin(c);var f=Math.cos(e);e=Math.sin(e);var g=a*c,i=b*c;this.n11=d*f;this.n12=-d*e;this.n13=c;this.n21=i*f+a*e;this.n22=-i*e+a*f;this.n23=-b*d;this.n31=-g*f+b*e;this.n32=g*e+b*f;this.n33=a*d},setRotationFromQuaternion:function(a){var b=a.x,c=a.y,e=a.z,d=
a.w,f=b+b,g=c+c,i=e+e;a=b*f;var h=b*g;b*=i;var j=c*g;c*=i;e*=i;f*=d;g*=d;d*=i;this.n11=1-(j+e);this.n12=h-d;this.n13=b+g;this.n21=h+d;this.n22=1-(a+e);this.n23=c-f;this.n31=b-g;this.n32=c+f;this.n33=1-(a+j)},scale:function(a){var b=a.x,c=a.y;a=a.z;this.n11*=b;this.n12*=b;this.n13*=b;this.n21*=c;this.n22*=c;this.n23*=c;this.n31*=a;this.n32*=a;this.n33*=a;return this},extractRotationMatrix:function(a){a.n11=this.n11;a.n12=this.n12;a.n13=this.n13;a.n14=0;a.n21=this.n21;a.n22=this.n22;a.n23=this.n23;
a.n24=0;a.n31=this.n31;a.n32=this.n32;a.n33=this.n33;a.n34=0;a.n41=0;a.n42=0;a.n43=0;a.n44=1},extractPositionVector:function(a){a.x=this.n14;a.y=this.n24;a.z=this.n34},toString:function(){return"| "+this.n11+" "+this.n12+" "+this.n13+" "+this.n14+" |\n| "+this.n21+" "+this.n22+" "+this.n23+" "+this.n24+" |\n| "+this.n31+" "+this.n32+" "+this.n33+" "+this.n34+" |\n| "+this.n41+" "+this.n42+" "+this.n43+" "+this.n44+" |"}};
THREE.Matrix4.translationMatrix=function(a,b,c){var e=new THREE.Matrix4;e.setTranslation(a,b,c);return e};THREE.Matrix4.scaleMatrix=function(a,b,c){var e=new THREE.Matrix4;e.setScale(a,b,c);return e};THREE.Matrix4.rotationXMatrix=function(a){var b=new THREE.Matrix4;b.setRotX(a);return b};THREE.Matrix4.rotationYMatrix=function(a){var b=new THREE.Matrix4;b.setRotY(a);return b};THREE.Matrix4.rotationZMatrix=function(a){var b=new THREE.Matrix4;b.setRotZ(a);return b};
THREE.Matrix4.rotationAxisAngleMatrix=function(a,b){var c=new THREE.Matrix4;c.setRotAxis(a,b);return c};
THREE.Matrix4.makeInvert=function(a,b){var c=a.n11,e=a.n12,d=a.n13,f=a.n14,g=a.n21,i=a.n22,h=a.n23,j=a.n24,m=a.n31,n=a.n32,l=a.n33,o=a.n34,q=a.n41,r=a.n42,p=a.n43,k=a.n44;b===undefined&&(b=new THREE.Matrix4);b.n11=h*o*r-j*l*r+j*n*p-i*o*p-h*n*k+i*l*k;b.n12=f*l*r-d*o*r-f*n*p+e*o*p+d*n*k-e*l*k;b.n13=d*j*r-f*h*r+f*i*p-e*j*p-d*i*k+e*h*k;b.n14=f*h*n-d*j*n-f*i*l+e*j*l+d*i*o-e*h*o;b.n21=j*l*q-h*o*q-j*m*p+g*o*p+h*m*k-g*l*k;b.n22=d*o*q-f*l*q+f*m*p-c*o*p-d*m*k+c*l*k;b.n23=f*h*q-d*j*q-f*g*p+c*j*p+d*g*k-c*h*k;
b.n24=d*j*m-f*h*m+f*g*l-c*j*l-d*g*o+c*h*o;b.n31=i*o*q-j*n*q+j*m*r-g*o*r-i*m*k+g*n*k;b.n32=f*n*q-e*o*q-f*m*r+c*o*r+e*m*k-c*n*k;b.n33=d*j*q-f*i*q+f*g*r-c*j*r-e*g*k+c*i*k;b.n34=f*i*m-e*j*m-f*g*n+c*j*n+e*g*o-c*i*o;b.n41=h*n*q-i*l*q-h*m*r+g*l*r+i*m*p-g*n*p;b.n42=e*l*q-d*n*q+d*m*r-c*l*r-e*m*p+c*n*p;b.n43=d*i*q-e*h*q-d*g*r+c*h*r+e*g*p-c*i*p;b.n44=e*h*m-d*i*m+d*g*n-c*h*n-e*g*l+c*i*l;b.multiplyScalar(1/a.determinant());return b};
THREE.Matrix4.makeInvert3x3=function(a){var b=a.m33,c=b.m,e=a.n33*a.n22-a.n32*a.n23,d=-a.n33*a.n21+a.n31*a.n23,f=a.n32*a.n21-a.n31*a.n22,g=-a.n33*a.n12+a.n32*a.n13,i=a.n33*a.n11-a.n31*a.n13,h=-a.n32*a.n11+a.n31*a.n12,j=a.n23*a.n12-a.n22*a.n13,m=-a.n23*a.n11+a.n21*a.n13,n=a.n22*a.n11-a.n21*a.n12;a=a.n11*e+a.n21*g+a.n31*j;if(a==0)throw"matrix not invertible";a=1/a;c[0]=a*e;c[1]=a*d;c[2]=a*f;c[3]=a*g;c[4]=a*i;c[5]=a*h;c[6]=a*j;c[7]=a*m;c[8]=a*n;return b};
THREE.Matrix4.makeFrustum=function(a,b,c,e,d,f){var g;g=new THREE.Matrix4;g.n11=2*d/(b-a);g.n12=0;g.n13=(b+a)/(b-a);g.n14=0;g.n21=0;g.n22=2*d/(e-c);g.n23=(e+c)/(e-c);g.n24=0;g.n31=0;g.n32=0;g.n33=-(f+d)/(f-d);g.n34=-2*f*d/(f-d);g.n41=0;g.n42=0;g.n43=-1;g.n44=0;return g};THREE.Matrix4.makePerspective=function(a,b,c,e){var d;a=c*Math.tan(a*Math.PI/360);d=-a;return THREE.Matrix4.makeFrustum(d*b,a*b,d,a,c,e)};
THREE.Matrix4.makeOrtho=function(a,b,c,e,d,f){var g,i,h,j;g=new THREE.Matrix4;i=b-a;h=c-e;j=f-d;g.n11=2/i;g.n12=0;g.n13=0;g.n14=-((b+a)/i);g.n21=0;g.n22=2/h;g.n23=0;g.n24=-((c+e)/h);g.n31=0;g.n32=0;g.n33=-2/j;g.n34=-((f+d)/j);g.n41=0;g.n42=0;g.n43=0;g.n44=1;return g};THREE.Matrix4.__tmpVec1=new THREE.Vector3;THREE.Matrix4.__tmpVec2=new THREE.Vector3;THREE.Matrix4.__tmpVec3=new THREE.Vector3;
THREE.Object3D=function(){this.id=THREE.Object3DCounter.value++;this.parent=undefined;this.children=[];this.position=new THREE.Vector3;this.rotation=new THREE.Vector3;this.scale=new THREE.Vector3(1,1,1);this.matrixRotation=new THREE.Matrix4;this.localMatrix=new THREE.Matrix4;this.globalMatrix=new THREE.Matrix4;this.matrixAutoUpdate=!0;this.matrixNeedsUpdate=!0;this.quaternion=new THREE.Quaternion;this.useQuaternion=!1;this.screenPosition=new THREE.Vector4;this.boundRadius=0;this.boundRadiusScale=
1;this.visible=!0};
THREE.Object3D.prototype={update:function(a,b,c){if(this.visible){this.matrixAutoUpdate&&(b|=this.updateMatrix());if(b||this.matrixNeedsUpdate){a?this.globalMatrix.multiply(a,this.localMatrix):this.globalMatrix.copy(this.localMatrix);this.matrixNeedsUpdate=!1;b=!0}var e=this.children.length;for(a=0;a<e;a++)this.children[a].update(this.globalMatrix,b,c)}},updateMatrix:function(){this.localMatrix.setPosition(this.position);this.useQuaternion?this.localMatrix.setRotationFromQuaternion(this.quaternion):this.localMatrix.setRotationFromEuler(this.rotation);
if(this.scale.x!==1||this.scale.y!==1||this.scale.z!==1){this.localMatrix.scale(this.scale);this.boundRadiusScale=Math.max(this.scale.x,Math.max(this.scale.y,this.scale.z))}return!0},addChild:function(a){if(this.children.indexOf(a)===-1){a.parent!==undefined&&a.parent.removeChild(a);a.parent=this;this.children.push(a)}},removeChild:function(a){var b=this.children.indexOf(a);if(b!==-1){this.children.splice(b,1);a.parent=undefined}}};THREE.Object3DCounter={value:0};
THREE.Vertex=function(a,b){this.position=a||new THREE.Vector3;this.positionWorld=new THREE.Vector3;this.positionScreen=new THREE.Vector4;this.normal=b||new THREE.Vector3;this.normalWorld=new THREE.Vector3;this.normalScreen=new THREE.Vector3;this.tangent=new THREE.Vector4;this.__visible=!0};THREE.Vertex.prototype={toString:function(){return"THREE.Vertex ( position: "+this.position+", normal: "+this.normal+" )"}};
THREE.Face3=function(a,b,c,e,d){this.a=a;this.b=b;this.c=c;this.centroid=new THREE.Vector3;this.normal=e instanceof THREE.Vector3?e:new THREE.Vector3;this.vertexNormals=e instanceof Array?e:[];this.materials=d instanceof Array?d:[d]};THREE.Face3.prototype={toString:function(){return"THREE.Face3 ( "+this.a+", "+this.b+", "+this.c+" )"}};
THREE.Face4=function(a,b,c,e,d,f){this.a=a;this.b=b;this.c=c;this.d=e;this.centroid=new THREE.Vector3;this.normal=d instanceof THREE.Vector3?d:new THREE.Vector3;this.vertexNormals=d instanceof Array?d:[];this.materials=f instanceof Array?f:[f]};THREE.Face4.prototype={toString:function(){return"THREE.Face4 ( "+this.a+", "+this.b+", "+this.c+" "+this.d+" )"}};THREE.UV=function(a,b){this.u=a||0;this.v=b||0};
THREE.UV.prototype={copy:function(a){this.u=a.u;this.v=a.v},toString:function(){return"THREE.UV ("+this.u+", "+this.v+")"}};
THREE.Camera=function(a,b,c,e,d,f){THREE.Object3D.call(this);this.FOV=a||50;this.aspect=b||1;this.zNear=c||0.1;this.zFar=e||2E3;this.screenCenterY=this.screenCenterX=0;this.target=f||new THREE.Object3D;this.useTarget=!0;this.up=new THREE.Vector3(0,1,0);this.inverseMatrix=new THREE.Matrix4;this.projectionMatrix=null;this.tmpVec=new THREE.Vector3;this.translateX=function(g,i){this.tmpVec.sub(this.target.position,this.position).normalize().multiplyScalar(g);this.tmpVec.crossSelf(this.up);if(i)this.tmpVec.y=
0;this.position.addSelf(this.tmpVec);this.target.position.addSelf(this.tmpVec)};this.translateZ=function(g,i){this.tmpVec.sub(this.target.position,this.position).normalize().multiplyScalar(g);if(i)this.tmpVec.y=0;this.position.subSelf(this.tmpVec);this.target.position.subSelf(this.tmpVec)};this.updateProjectionMatrix()};THREE.Camera.prototype=new THREE.Object3D;THREE.Camera.prototype.constructor=THREE.Camera;THREE.Camera.prototype.supr=THREE.Object3D.prototype;
THREE.Camera.prototype.updateProjectionMatrix=function(){this.projectionMatrix=THREE.Matrix4.makePerspective(this.FOV,this.aspect,this.zNear,this.zFar)};
THREE.Camera.prototype.update=function(a,b,c){if(this.useTarget){this.localMatrix.lookAt(this.position,this.target.position,this.up);a?this.globalMatrix.multiply(a,this.localMatrix):this.globalMatrix.copy(this.localMatrix);THREE.Matrix4.makeInvert(this.globalMatrix,this.inverseMatrix);b=!0}else{this.matrixAutoUpdate&&(b|=this.updateMatrix());if(b||this.matrixNeedsUpdate){a?this.globalMatrix.multiply(a,this.localMatrix):this.globalMatrix.copy(this.localMatrix);this.matrixNeedsUpdate=!1;b=!0;THREE.Matrix4.makeInvert(this.globalMatrix,
this.inverseMatrix)}}for(a=0;a<this.children.length;a++)this.children[a].update(this.globalMatrix,b,c)};
THREE.Camera.prototype.frustumContains=function(a){var b=a.globalMatrix.n14,c=a.globalMatrix.n24,e=a.globalMatrix.n34,d=this.inverseMatrix,f=a.boundRadius*a.boundRadiusScale,g=d.n31*b+d.n32*c+d.n33*e+d.n34;if(g-f>-this.zNear)return!1;if(g+f<-this.zFar)return!1;g-=f;var i=this.projectionMatrix,h=1/(i.n43*g),j=h*this.screenCenterX,m=(d.n11*b+d.n12*c+d.n13*e+d.n14)*i.n11*j;f=i.n11*f*j;if(m+f<-this.screenCenterX)return!1;if(m-f>this.screenCenterX)return!1;b=(d.n21*b+d.n22*c+d.n23*e+d.n24)*i.n22*h*this.screenCenterY;
if(b+f<-this.screenCenterY)return!1;if(b-f>this.screenCenterY)return!1;a.screenPosition.set(m,b,g,f);return!0};THREE.ParticleDOMMaterial=function(a){this.id=THREE.MaterialCounter.value++;this.domElement=a};THREE.ParticleDOMMaterial.prototype={toString:function(){return"THREE.ParticleDOMMaterial ( domElement: "+this.domElement+" )"}};THREE.Particle=function(a){THREE.Object3D.call(this);this.materials=a instanceof Array?a:[a];this.matrixAutoUpdate=!1};THREE.Particle.prototype=new THREE.Object3D;
THREE.Particle.prototype.constructor=THREE.Particle;THREE.Scene=function(){THREE.Object3D.call(this);this.objects=[];this.lights=[];this.sounds=[];this.fog=null};THREE.Scene.prototype=new THREE.Object3D;THREE.Scene.prototype.constructor=THREE.Scene;THREE.Scene.prototype.supr=THREE.Object3D.prototype;THREE.Scene.prototype.addChild=function(a){this.supr.addChild.call(this,a);this.addChildRecurse(a)};
THREE.Scene.prototype.addChildRecurse=function(a){if(a instanceof THREE.Light)this.lights.indexOf(a)===-1&&this.lights.push(a);else if(a instanceof THREE.Sound3D)this.sounds.indexOf(a)===-1&&this.sounds.push(a);else a instanceof THREE.Camera||a instanceof THREE.Bone||this.objects.indexOf(a)===-1&&this.objects.push(a);for(var b=0;b<a.children.length;b++)this.addChildRecurse(a.children[b])};THREE.Scene.prototype.removeChild=function(a){this.supr.removeChild.call(this,a);this.removeChildRecurse(a)};
THREE.Scene.prototype.removeChildRecurse=function(a){if(a instanceof THREE.Light){var b=this.lights.indexOf(a);b!==-1&&this.lights.splice(b,1)}else if(a instanceof THREE.Sound3D){b=this.sounds.indexOf(a);b!==-1&&this.sounds.splice(b,1)}else if(!(a instanceof THREE.Camera)){b=this.objects.indexOf(a);b!==-1&&this.objects.splice(b,1)}for(b=0;b<a.children.length;b++)this.removeChildRecurse(a.children[b])};THREE.Scene.prototype.addObject=THREE.Scene.prototype.addChild;
THREE.Scene.prototype.removeObject=THREE.Scene.prototype.removeChild;THREE.Scene.prototype.addLight=THREE.Scene.prototype.addChild;THREE.Scene.prototype.removeLight=THREE.Scene.prototype.removeChild;
THREE.Projector=function(){function a(w,u){return u.z-w.z}function b(w,u){var D=0,A=1,E=w.z+w.w,z=u.z+u.w,v=-w.z+w.w,t=-u.z+u.w;if(E>=0&&z>=0&&v>=0&&t>=0)return!0;else if(E<0&&z<0||v<0&&t<0)return!1;else{if(E<0)D=Math.max(D,E/(E-z));else z<0&&(A=Math.min(A,E/(E-z)));if(v<0)D=Math.max(D,v/(v-t));else t<0&&(A=Math.min(A,v/(v-t)));if(A<D)return!1;else{w.lerpSelf(u,D);u.lerpSelf(w,1-A);return!0}}}var c,e,d=[],f,g,i,h=[],j,m,n=[],l,o,q=[],r=new THREE.Vector4,p=new THREE.Vector4,k=new THREE.Matrix4,C=new THREE.Matrix4,
y=[new THREE.Vector4,new THREE.Vector4,new THREE.Vector4,new THREE.Vector4,new THREE.Vector4,new THREE.Vector4],F=new THREE.Vector4,G=new THREE.Vector4,J;this.projectObjects=function(w,u,D){u=[];var A,E,z;e=0;E=w.objects;w=0;for(A=E.length;w<A;w++){z=E[w];var v;if(!(v=!z.visible))if(v=z instanceof THREE.Mesh){a:{v=void 0;for(var t=z.globalMatrix,I=-z.geometry.boundingSphere.radius*Math.max(z.scale.x,Math.max(z.scale.y,z.scale.z)),s=0;s<6;s++){v=y[s].x*t.n14+y[s].y*t.n24+y[s].z*t.n34+y[s].w;if(v<=
I){v=!1;break a}}v=!0}v=!v}if(!v){c=d[e]=d[e]||new THREE.RenderableObject;r.copy(z.position);k.multiplyVector3(r);c.object=z;c.z=r.z;u.push(c);e++}}D&&u.sort(a);return u};this.projectScene=function(w,u,D){var A=[],E=u.zNear,z=u.zFar,v,t,I,s,H,N,x,O,Q,R,S,P,L,B,K,M;i=m=o=0;u.matrixAutoUpdate&&u.update();k.multiply(u.projectionMatrix,u.globalMatrix);y[0].set(k.n41-k.n11,k.n42-k.n12,k.n43-k.n13,k.n44-k.n14);y[1].set(k.n41+k.n11,k.n42+k.n12,k.n43+k.n13,k.n44+k.n14);y[2].set(k.n41+k.n21,k.n42+k.n22,k.n43+
k.n23,k.n44+k.n24);y[3].set(k.n41-k.n21,k.n42-k.n22,k.n43-k.n23,k.n44-k.n24);y[4].set(k.n41-k.n31,k.n42-k.n32,k.n43-k.n33,k.n44-k.n34);y[5].set(k.n41+k.n31,k.n42+k.n32,k.n43+k.n33,k.n44+k.n34);for(v=0;v<6;v++){N=y[v];N.divideScalar(Math.sqrt(N.x*N.x+N.y*N.y+N.z*N.z))}w.update(undefined,!1,u);N=this.projectObjects(w,u,!0);w=0;for(v=N.length;w<v;w++){x=N[w].object;if(x.visible){x.matrixAutoUpdate&&x.updateMatrix();O=x.globalMatrix;O.extractRotationMatrix(x.matrixRotation);S=x.matrixRotation;Q=x.materials;
R=x.overdraw;if(x instanceof THREE.Mesh){P=x.geometry;L=P.vertices;t=0;for(I=L.length;t<I;t++){B=L[t];B.positionWorld.copy(B.position);O.multiplyVector3(B.positionWorld);s=B.positionScreen;s.copy(B.positionWorld);k.multiplyVector4(s);s.x/=s.w;s.y/=s.w;B.__visible=s.z>E&&s.z<z}P=P.faces;t=0;for(I=P.length;t<I;t++){B=P[t];if(B instanceof THREE.Face3){s=L[B.a];H=L[B.b];K=L[B.c];if(s.__visible&&H.__visible&&K.__visible&&(x.doubleSided||x.flipSided!=(K.positionScreen.x-s.positionScreen.x)*(H.positionScreen.y-
s.positionScreen.y)-(K.positionScreen.y-s.positionScreen.y)*(H.positionScreen.x-s.positionScreen.x)<0)){f=h[i]=h[i]||new THREE.RenderableFace3;f.v1.positionWorld.copy(s.positionWorld);f.v2.positionWorld.copy(H.positionWorld);f.v3.positionWorld.copy(K.positionWorld);f.v1.positionScreen.copy(s.positionScreen);f.v2.positionScreen.copy(H.positionScreen);f.v3.positionScreen.copy(K.positionScreen);f.normalWorld.copy(B.normal);S.multiplyVector3(f.normalWorld);f.centroidWorld.copy(B.centroid);O.multiplyVector3(f.centroidWorld);
f.centroidScreen.copy(f.centroidWorld);k.multiplyVector3(f.centroidScreen);K=B.vertexNormals;J=f.vertexNormalsWorld;s=0;for(H=K.length;s<H;s++){M=J[s]=J[s]||new THREE.Vector3;M.copy(K[s]);S.multiplyVector3(M)}f.z=f.centroidScreen.z;f.meshMaterials=Q;f.faceMaterials=B.materials;f.overdraw=R;if(x.geometry.uvs[t]){f.uvs[0]=x.geometry.uvs[t][0];f.uvs[1]=x.geometry.uvs[t][1];f.uvs[2]=x.geometry.uvs[t][2]}A.push(f);i++}}else if(B instanceof THREE.Face4){s=L[B.a];H=L[B.b];K=L[B.c];M=L[B.d];if(s.__visible&&
H.__visible&&K.__visible&&M.__visible&&(x.doubleSided||x.flipSided!=((M.positionScreen.x-s.positionScreen.x)*(H.positionScreen.y-s.positionScreen.y)-(M.positionScreen.y-s.positionScreen.y)*(H.positionScreen.x-s.positionScreen.x)<0||(H.positionScreen.x-K.positionScreen.x)*(M.positionScreen.y-K.positionScreen.y)-(H.positionScreen.y-K.positionScreen.y)*(M.positionScreen.x-K.positionScreen.x)<0))){f=h[i]=h[i]||new THREE.RenderableFace3;f.v1.positionWorld.copy(s.positionWorld);f.v2.positionWorld.copy(H.positionWorld);
f.v3.positionWorld.copy(M.positionWorld);f.v1.positionScreen.copy(s.positionScreen);f.v2.positionScreen.copy(H.positionScreen);f.v3.positionScreen.copy(M.positionScreen);f.normalWorld.copy(B.normal);S.multiplyVector3(f.normalWorld);f.centroidWorld.copy(B.centroid);O.multiplyVector3(f.centroidWorld);f.centroidScreen.copy(f.centroidWorld);k.multiplyVector3(f.centroidScreen);f.z=f.centroidScreen.z;f.meshMaterials=Q;f.faceMaterials=B.materials;f.overdraw=R;if(x.geometry.uvs[t]){f.uvs[0]=x.geometry.uvs[t][0];
f.uvs[1]=x.geometry.uvs[t][1];f.uvs[2]=x.geometry.uvs[t][3]}A.push(f);i++;g=h[i]=h[i]||new THREE.RenderableFace3;g.v1.positionWorld.copy(H.positionWorld);g.v2.positionWorld.copy(K.positionWorld);g.v3.positionWorld.copy(M.positionWorld);g.v1.positionScreen.copy(H.positionScreen);g.v2.positionScreen.copy(K.positionScreen);g.v3.positionScreen.copy(M.positionScreen);g.normalWorld.copy(f.normalWorld);g.centroidWorld.copy(f.centroidWorld);g.centroidScreen.copy(f.centroidScreen);g.z=g.centroidScreen.z;g.meshMaterials=
Q;g.faceMaterials=B.materials;g.overdraw=R;if(x.geometry.uvs[t]){g.uvs[0]=x.geometry.uvs[t][1];g.uvs[1]=x.geometry.uvs[t][2];g.uvs[2]=x.geometry.uvs[t][3]}A.push(g);i++}}}}else if(x instanceof THREE.Line){C.multiply(k,O);L=x.geometry.vertices;B=L[0];B.positionScreen.copy(B.position);C.multiplyVector4(B.positionScreen);t=1;for(I=L.length;t<I;t++){s=L[t];s.positionScreen.copy(s.position);C.multiplyVector4(s.positionScreen);H=L[t-1];F.copy(s.positionScreen);G.copy(H.positionScreen);if(b(F,G)){F.multiplyScalar(1/
F.w);G.multiplyScalar(1/G.w);j=n[m]=n[m]||new THREE.RenderableLine;j.v1.positionScreen.copy(F);j.v2.positionScreen.copy(G);j.z=Math.max(F.z,G.z);j.materials=x.materials;A.push(j);m++}}}else if(x instanceof THREE.Particle){p.set(x.position.x,x.position.y,x.position.z,1);k.multiplyVector4(p);p.z/=p.w;if(p.z>0&&p.z<1){l=q[o]=q[o]||new THREE.RenderableParticle;l.x=p.x/p.w;l.y=p.y/p.w;l.z=p.z;l.rotation=x.rotation.z;l.scale.x=x.scale.x*Math.abs(l.x-(p.x+u.projectionMatrix.n11)/(p.w+u.projectionMatrix.n14));
l.scale.y=x.scale.y*Math.abs(l.y-(p.y+u.projectionMatrix.n22)/(p.w+u.projectionMatrix.n24));l.materials=x.materials;A.push(l);o++}}}}D&&A.sort(a);return A};this.unprojectVector=function(w,u){var D=THREE.Matrix4.makeInvert(u.globalMatrix);D.multiplySelf(THREE.Matrix4.makeInvert(u.projectionMatrix));D.multiplyVector3(w);return w}};
THREE.DOMRenderer=function(){THREE.Renderer.call(this);var a=null,b=new THREE.Projector,c,e,d,f;this.domElement=document.createElement("div");this.setSize=function(g,i){c=g;e=i;d=c/2;f=e/2};this.render=function(g,i){var h,j,m,n,l,o,q,r;a=b.projectScene(g,i);h=0;for(j=a.length;h<j;h++){l=a[h];if(l instanceof THREE.RenderableParticle){q=l.x*d+d;r=l.y*f+f;m=0;for(n=l.material.length;m<n;m++){o=l.material[m];if(o instanceof THREE.ParticleDOMMaterial){o=o.domElement;o.style.left=q+"px";o.style.top=r+"px"}}}}}};
THREE.RenderableParticle=function(){this.rotation=this.z=this.y=this.x=null;this.scale=new THREE.Vector2;this.materials=null};
