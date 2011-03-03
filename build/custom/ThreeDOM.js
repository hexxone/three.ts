// ThreeDOM.js r34 - http://github.com/mrdoob/three.js
var THREE=THREE||{};THREE.Color=function(a){this.setHex(a)};
THREE.Color.prototype={autoUpdate:!0,setRGB:function(a,b,c){this.r=a;this.g=b;this.b=c;if(this.autoUpdate){this.updateHex();this.updateStyleString()}},setHSV:function(a,b,c){var d,e,f,g,i,h;if(c==0)d=e=f=0;else{g=Math.floor(a*6);i=a*6-g;a=c*(1-b);h=c*(1-b*i);b=c*(1-b*(1-i));switch(g){case 1:d=h;e=c;f=a;break;case 2:d=a;e=c;f=b;break;case 3:d=a;e=h;f=c;break;case 4:d=b;e=a;f=c;break;case 5:d=c;e=a;f=h;break;case 6:case 0:d=c;e=b;f=a}}this.r=d;this.g=e;this.b=f;if(this.autoUpdate){this.updateHex();
this.updateStyleString()}},setHex:function(a){this.hex=~~a&16777215;if(this.autoUpdate){this.updateRGB();this.updateStyleString()}},updateHex:function(){this.hex=~~(this.r*255)<<16^~~(this.g*255)<<8^~~(this.b*255)},updateRGB:function(){this.r=(this.hex>>16&255)/255;this.g=(this.hex>>8&255)/255;this.b=(this.hex&255)/255},updateStyleString:function(){this.__styleString="rgb("+~~(this.r*255)+","+~~(this.g*255)+","+~~(this.b*255)+")"},clone:function(){return new THREE.Color(this.hex)}};
THREE.Vector2=function(a,b){this.set(a||0,b||0)};
THREE.Vector2.prototype={set:function(a,b){this.x=a;this.y=b;return this},copy:function(a){this.set(a.x,a.y);return this},addSelf:function(a){this.set(this.x+a.x,this.y+a.y);return this},add:function(a,b){this.set(a.x+b.x,a.y+b.y);return this},subSelf:function(a){this.set(this.x-a.x,this.y-a.y);return this},sub:function(a,b){this.set(a.x-b.x,a.y-b.y);return this},multiplyScalar:function(a){this.set(this.x*a,this.y*a);return this},negate:function(){this.set(-this.x,-this.y);return this},unit:function(){this.multiplyScalar(1/
this.length());return this},length:function(){return Math.sqrt(this.lengthSq())},lengthSq:function(){return this.x*this.x+this.y*this.y},clone:function(){return new THREE.Vector2(this.x,this.y)}};THREE.Vector3=function(a,b,c){this.set(a||0,b||0,c||0)};
THREE.Vector3.prototype={set:function(a,b,c){this.x=a;this.y=b;this.z=c;return this},copy:function(a){this.set(a.x,a.y,a.z);return this},add:function(a,b){this.set(a.x+b.x,a.y+b.y,a.z+b.z);return this},addSelf:function(a){this.set(this.x+a.x,this.y+a.y,this.z+a.z);return this},addScalar:function(a){this.set(this.x+a,this.y+a,this.z+a);return this},sub:function(a,b){this.set(a.x-b.x,a.y-b.y,a.z-b.z);return this},subSelf:function(a){this.set(this.x-a.x,this.y-a.y,this.z-a.z);return this},cross:function(a,
b){this.set(a.y*b.z-a.z*b.y,a.z*b.x-a.x*b.z,a.x*b.y-a.y*b.x);return this},crossSelf:function(a){var b=this.x,c=this.y,d=this.z;this.set(c*a.z-d*a.y,d*a.x-b*a.z,b*a.y-c*a.x);return this},multiply:function(a,b){this.set(a.x*b.x,a.y*b.y,a.z*b.z);return this},multiplySelf:function(a){this.set(this.x*a.x,this.y*a.y,this.z*a.z);return this},multiplyScalar:function(a){this.set(this.x*a,this.y*a,this.z*a);return this},divideSelf:function(a){this.set(this.x/a.x,this.y/a.y,this.z/a.z);return this},divideScalar:function(a){this.set(this.x/
a,this.y/a,this.z/a);return this},negate:function(){this.set(-this.x,-this.y,-this.z);return this},dot:function(a){return this.x*a.x+this.y*a.y+this.z*a.z},distanceTo:function(a){return Math.sqrt(this.distanceToSquared(a))},distanceToSquared:function(a){var b=this.x-a.x,c=this.y-a.y;a=this.z-a.z;return b*b+c*c+a*a},length:function(){return Math.sqrt(this.lengthSq())},lengthSq:function(){return this.x*this.x+this.y*this.y+this.z*this.z},lengthManhattan:function(){return this.x+this.y+this.z},normalize:function(){var a=
this.length();a>0?this.multiplyScalar(1/a):this.set(0,0,0);return this},setLength:function(a){return this.normalize().multiplyScalar(a)},isZero:function(){return Math.abs(this.x)<1.0E-4&&Math.abs(this.y)<1.0E-4&&Math.abs(this.z)<1.0E-4},clone:function(){return new THREE.Vector3(this.x,this.y,this.z)}};THREE.Vector4=function(a,b,c,d){this.set(a||0,b||0,c||0,d||1)};
THREE.Vector4.prototype={set:function(a,b,c,d){this.x=a;this.y=b;this.z=c;this.w=d;return this},copy:function(a){this.set(a.x,a.y,a.z,a.w||1);return this},add:function(a,b){this.set(a.x+b.x,a.y+b.y,a.z+b.z,a.w+b.w);return this},addSelf:function(a){this.set(this.x+a.x,this.y+a.y,this.z+a.z,this.w+a.w);return this},sub:function(a,b){this.set(a.x-b.x,a.y-b.y,a.z-b.z,a.w-b.w);return this},subSelf:function(a){this.set(this.x-a.x,this.y-a.y,this.z-a.z,this.w-a.w);return this},multiplyScalar:function(a){this.set(this.x*
a,this.y*a,this.z*a,this.w*a);return this},divideScalar:function(a){this.set(this.x/a,this.y/a,this.z/a,this.w/a);return this},lerpSelf:function(a,b){this.set(this.x+(a.x-this.x)*b,this.y+(a.y-this.y)*b,this.z+(a.z-this.z)*b,this.w+(a.w-this.w)*b)},clone:function(){return new THREE.Vector4(this.x,this.y,this.z,this.w)}};THREE.Ray=function(a,b){this.origin=a||new THREE.Vector3;this.direction=b||new THREE.Vector3};
THREE.Ray.prototype={intersectScene:function(a){var b,c,d=a.objects,e=[];a=0;for(b=d.length;a<b;a++){c=d[a];c instanceof THREE.Mesh&&(e=e.concat(this.intersectObject(c)))}e.sort(function(f,g){return f.distance-g.distance});return e},intersectObject:function(a){function b(r,k,B,w){w=w.clone().subSelf(k);B=B.clone().subSelf(k);var F=r.clone().subSelf(k);r=w.dot(w);k=w.dot(B);w=w.dot(F);var G=B.dot(B);B=B.dot(F);F=1/(r*G-k*k);G=(G*w-k*B)*F;r=(r*B-k*w)*F;return G>0&&r>0&&G+r<1}var c,d,e,f,g,i,h,j,n,l,
m,o=a.geometry,p=o.vertices,q=[];c=0;for(d=o.faces.length;c<d;c++){e=o.faces[c];l=this.origin.clone();m=this.direction.clone();h=a.matrixWorld;f=h.multiplyVector3(p[e.a].position.clone());g=h.multiplyVector3(p[e.b].position.clone());i=h.multiplyVector3(p[e.c].position.clone());h=e instanceof THREE.Face4?h.multiplyVector3(p[e.d].position.clone()):null;j=a.matrixRotationWorld.multiplyVector3(e.normal.clone());n=m.dot(j);if(n<0){j=j.dot((new THREE.Vector3).sub(f,l))/n;l=l.addSelf(m.multiplyScalar(j));
if(e instanceof THREE.Face3){if(b(l,f,g,i)){e={distance:this.origin.distanceTo(l),point:l,face:e,object:a};q.push(e)}}else if(e instanceof THREE.Face4&&(b(l,f,g,h)||b(l,g,i,h))){e={distance:this.origin.distanceTo(l),point:l,face:e,object:a};q.push(e)}}}return q}};
THREE.Rectangle=function(){function a(){f=d-b;g=e-c}var b,c,d,e,f,g,i=!0;this.getX=function(){return b};this.getY=function(){return c};this.getWidth=function(){return f};this.getHeight=function(){return g};this.getLeft=function(){return b};this.getTop=function(){return c};this.getRight=function(){return d};this.getBottom=function(){return e};this.set=function(h,j,n,l){i=!1;b=h;c=j;d=n;e=l;a()};this.addPoint=function(h,j){if(i){i=!1;b=h;c=j;d=h;e=j}else{b=b<h?b:h;c=c<j?c:j;d=d>h?d:h;e=e>j?e:j}a()};
this.add3Points=function(h,j,n,l,m,o){if(i){i=!1;b=h<n?h<m?h:m:n<m?n:m;c=j<l?j<o?j:o:l<o?l:o;d=h>n?h>m?h:m:n>m?n:m;e=j>l?j>o?j:o:l>o?l:o}else{b=h<n?h<m?h<b?h:b:m<b?m:b:n<m?n<b?n:b:m<b?m:b;c=j<l?j<o?j<c?j:c:o<c?o:c:l<o?l<c?l:c:o<c?o:c;d=h>n?h>m?h>d?h:d:m>d?m:d:n>m?n>d?n:d:m>d?m:d;e=j>l?j>o?j>e?j:e:o>e?o:e:l>o?l>e?l:e:o>e?o:e}a()};this.addRectangle=function(h){if(i){i=!1;b=h.getLeft();c=h.getTop();d=h.getRight();e=h.getBottom()}else{b=b<h.getLeft()?b:h.getLeft();c=c<h.getTop()?c:h.getTop();d=d>h.getRight()?
d:h.getRight();e=e>h.getBottom()?e:h.getBottom()}a()};this.inflate=function(h){b-=h;c-=h;d+=h;e+=h;a()};this.minSelf=function(h){b=b>h.getLeft()?b:h.getLeft();c=c>h.getTop()?c:h.getTop();d=d<h.getRight()?d:h.getRight();e=e<h.getBottom()?e:h.getBottom();a()};this.instersects=function(h){return Math.min(d,h.getRight())-Math.max(b,h.getLeft())>=0&&Math.min(e,h.getBottom())-Math.max(c,h.getTop())>=0};this.empty=function(){i=!0;e=d=c=b=0;a()};this.isEmpty=function(){return i}};
THREE.Matrix3=function(){this.m=[]};THREE.Matrix3.prototype={transpose:function(){var a,b=this.m;a=b[1];b[1]=b[3];b[3]=a;a=b[2];b[2]=b[6];b[6]=a;a=b[5];b[5]=b[7];b[7]=a;return this},transposeIntoArray:function(a){var b=this.m;a[0]=b[0];a[1]=b[3];a[2]=b[6];a[3]=b[1];a[4]=b[4];a[5]=b[7];a[6]=b[2];a[7]=b[5];a[8]=b[8];return this}};
THREE.Matrix4=function(a,b,c,d,e,f,g,i,h,j,n,l,m,o,p,q){this.set(a||1,b||0,c||0,d||0,e||0,f||1,g||0,i||0,h||0,j||0,n||1,l||0,m||0,o||0,p||0,q||1);this.flat=Array(16);this.m33=new THREE.Matrix3};
THREE.Matrix4.prototype={set:function(a,b,c,d,e,f,g,i,h,j,n,l,m,o,p,q){this.n11=a;this.n12=b;this.n13=c;this.n14=d;this.n21=e;this.n22=f;this.n23=g;this.n24=i;this.n31=h;this.n32=j;this.n33=n;this.n34=l;this.n41=m;this.n42=o;this.n43=p;this.n44=q;return this},identity:function(){this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1);return this},copy:function(a){this.set(a.n11,a.n12,a.n13,a.n14,a.n21,a.n22,a.n23,a.n24,a.n31,a.n32,a.n33,a.n34,a.n41,a.n42,a.n43,a.n44);return this},lookAt:function(a,b,c){var d=THREE.Matrix4.__tmpVec1,
e=THREE.Matrix4.__tmpVec2,f=THREE.Matrix4.__tmpVec3;f.sub(a,b).normalize();d.cross(c,f).normalize();e.cross(f,d).normalize();this.n11=d.x;this.n12=e.x;this.n13=f.x;this.n14=a.x;this.n21=d.y;this.n22=e.y;this.n23=f.y;this.n24=a.y;this.n31=d.z;this.n32=e.z;this.n33=f.z;this.n34=a.z;return this},multiplyVector3:function(a){var b=a.x,c=a.y,d=a.z,e=1/(this.n41*b+this.n42*c+this.n43*d+this.n44);a.x=(this.n11*b+this.n12*c+this.n13*d+this.n14)*e;a.y=(this.n21*b+this.n22*c+this.n23*d+this.n24)*e;a.z=(this.n31*
b+this.n32*c+this.n33*d+this.n34)*e;return a},multiplyVector3OnlyZ:function(a){var b=a.x,c=a.y;a=a.z;return(this.n31*b+this.n32*c+this.n33*a+this.n34)*(1/(this.n41*b+this.n42*c+this.n43*a+this.n44))},multiplyVector4:function(a){var b=a.x,c=a.y,d=a.z,e=a.w;a.x=this.n11*b+this.n12*c+this.n13*d+this.n14*e;a.y=this.n21*b+this.n22*c+this.n23*d+this.n24*e;a.z=this.n31*b+this.n32*c+this.n33*d+this.n34*e;a.w=this.n41*b+this.n42*c+this.n43*d+this.n44*e;return a},crossVector:function(a){var b=new THREE.Vector4;
b.x=this.n11*a.x+this.n12*a.y+this.n13*a.z+this.n14*a.w;b.y=this.n21*a.x+this.n22*a.y+this.n23*a.z+this.n24*a.w;b.z=this.n31*a.x+this.n32*a.y+this.n33*a.z+this.n34*a.w;b.w=a.w?this.n41*a.x+this.n42*a.y+this.n43*a.z+this.n44*a.w:1;return b},multiply:function(a,b){var c=a.n11,d=a.n12,e=a.n13,f=a.n14,g=a.n21,i=a.n22,h=a.n23,j=a.n24,n=a.n31,l=a.n32,m=a.n33,o=a.n34,p=a.n41,q=a.n42,r=a.n43,k=a.n44,B=b.n11,w=b.n12,F=b.n13,G=b.n14,I=b.n21,v=b.n22,t=b.n23,C=b.n24,z=b.n31,D=b.n32,E=b.n33,x=b.n34;this.n11=c*
B+d*I+e*z;this.n12=c*w+d*v+e*D;this.n13=c*F+d*t+e*E;this.n14=c*G+d*C+e*x+f;this.n21=g*B+i*I+h*z;this.n22=g*w+i*v+h*D;this.n23=g*F+i*t+h*E;this.n24=g*G+i*C+h*x+j;this.n31=n*B+l*I+m*z;this.n32=n*w+l*v+m*D;this.n33=n*F+l*t+m*E;this.n34=n*G+l*C+m*x+o;this.n41=p*B+q*I+r*z;this.n42=p*w+q*v+r*D;this.n43=p*F+q*t+r*E;this.n44=p*G+q*C+r*x+k;return this},multiplyToArray:function(a,b,c){var d=a.n11,e=a.n12,f=a.n13,g=a.n14,i=a.n21,h=a.n22,j=a.n23,n=a.n24,l=a.n31,m=a.n32,o=a.n33,p=a.n34,q=a.n41,r=a.n42,k=a.n43;
a=a.n44;var B=b.n11,w=b.n12,F=b.n13,G=b.n14,I=b.n21,v=b.n22,t=b.n23,C=b.n24,z=b.n31,D=b.n32,E=b.n33,x=b.n34,u=b.n41,L=b.n42,s=b.n43;b=b.n44;this.n11=d*B+e*I+f*z+g*u;this.n12=d*w+e*v+f*D+g*L;this.n13=d*F+e*t+f*E+g*s;this.n14=d*G+e*C+f*x+g*b;this.n21=i*B+h*I+j*z+n*u;this.n22=i*w+h*v+j*D+n*L;this.n23=i*F+h*t+j*E+n*s;this.n24=i*G+h*C+j*x+n*b;this.n31=l*B+m*I+o*z+p*u;this.n32=l*w+m*v+o*D+p*L;this.n33=l*F+m*t+o*E+p*s;this.n34=l*G+m*C+o*x+p*b;this.n41=q*B+r*I+k*z+a*u;this.n42=q*w+r*v+k*D+a*L;this.n43=q*
F+r*t+k*E+a*s;this.n44=q*G+r*C+k*x+a*b;c[0]=this.n11;c[1]=this.n21;c[2]=this.n31;c[3]=this.n41;c[4]=this.n12;c[5]=this.n22;c[6]=this.n32;c[7]=this.n42;c[8]=this.n13;c[9]=this.n23;c[10]=this.n33;c[11]=this.n43;c[12]=this.n14;c[13]=this.n24;c[14]=this.n34;c[15]=this.n44;return this},multiplySelf:function(a){var b=this.n11,c=this.n12,d=this.n13,e=this.n14,f=this.n21,g=this.n22,i=this.n23,h=this.n24,j=this.n31,n=this.n32,l=this.n33,m=this.n34,o=this.n41,p=this.n42,q=this.n43,r=this.n44,k=a.n11,B=a.n21,
w=a.n31,F=a.n12,G=a.n22,I=a.n32,v=a.n13,t=a.n23,C=a.n33,z=a.n14,D=a.n24;a=a.n34;this.n11=b*k+c*B+d*w;this.n12=b*F+c*G+d*I;this.n13=b*v+c*t+d*C;this.n14=b*z+c*D+d*a+e;this.n21=f*k+g*B+i*w;this.n22=f*F+g*G+i*I;this.n23=f*v+g*t+i*C;this.n24=f*z+g*D+i*a+h;this.n31=j*k+n*B+l*w;this.n32=j*F+n*G+l*I;this.n33=j*v+n*t+l*C;this.n34=j*z+n*D+l*a+m;this.n41=o*k+p*B+q*w;this.n42=o*F+p*G+q*I;this.n43=o*v+p*t+q*C;this.n44=o*z+p*D+q*a+r;return this},multiplyScalar:function(a){this.n11*=a;this.n12*=a;this.n13*=a;this.n14*=
a;this.n21*=a;this.n22*=a;this.n23*=a;this.n24*=a;this.n31*=a;this.n32*=a;this.n33*=a;this.n34*=a;this.n41*=a;this.n42*=a;this.n43*=a;this.n44*=a;return this},determinant:function(){var a=this.n11,b=this.n12,c=this.n13,d=this.n14,e=this.n21,f=this.n22,g=this.n23,i=this.n24,h=this.n31,j=this.n32,n=this.n33,l=this.n34,m=this.n41,o=this.n42,p=this.n43,q=this.n44;return d*g*j*m-c*i*j*m-d*f*n*m+b*i*n*m+c*f*l*m-b*g*l*m-d*g*h*o+c*i*h*o+d*e*n*o-a*i*n*o-c*e*l*o+a*g*l*o+d*f*h*p-b*i*h*p-d*e*j*p+a*i*j*p+b*e*
l*p-a*f*l*p-c*f*h*q+b*g*h*q+c*e*j*q-a*g*j*q-b*e*n*q+a*f*n*q},transpose:function(){var a;a=this.n21;this.n21=this.n12;this.n12=a;a=this.n31;this.n31=this.n13;this.n13=a;a=this.n32;this.n32=this.n23;this.n23=a;a=this.n41;this.n41=this.n14;this.n14=a;a=this.n42;this.n42=this.n24;this.n24=a;a=this.n43;this.n43=this.n34;this.n43=a;return this},clone:function(){var a=new THREE.Matrix4;a.n11=this.n11;a.n12=this.n12;a.n13=this.n13;a.n14=this.n14;a.n21=this.n21;a.n22=this.n22;a.n23=this.n23;a.n24=this.n24;
a.n31=this.n31;a.n32=this.n32;a.n33=this.n33;a.n34=this.n34;a.n41=this.n41;a.n42=this.n42;a.n43=this.n43;a.n44=this.n44;return a},flatten:function(){this.flattenToArray(this.flat);return this.flat},flattenToArray:function(a){a[0]=this.n11;a[1]=this.n21;a[2]=this.n31;a[3]=this.n41;a[4]=this.n12;a[5]=this.n22;a[6]=this.n32;a[7]=this.n42;a[8]=this.n13;a[9]=this.n23;a[10]=this.n33;a[11]=this.n43;a[12]=this.n14;a[13]=this.n24;a[14]=this.n34;a[15]=this.n44;return a},flattenToArrayOffset:function(a,b){a[b]=
this.n11;a[b+1]=this.n21;a[b+2]=this.n31;a[b+3]=this.n41;a[b+4]=this.n12;a[b+5]=this.n22;a[b+6]=this.n32;a[b+7]=this.n42;a[b+8]=this.n13;a[b+9]=this.n23;a[b+10]=this.n33;a[b+11]=this.n43;a[b+12]=this.n14;a[b+13]=this.n24;a[b+14]=this.n34;a[b+15]=this.n44;return a},setTranslation:function(a,b,c){this.set(1,0,0,a,0,1,0,b,0,0,1,c,0,0,0,1);return this},setScale:function(a,b,c){this.set(a,0,0,0,0,b,0,0,0,0,c,0,0,0,0,1);return this},setRotX:function(a){var b=Math.cos(a);a=Math.sin(a);this.set(1,0,0,0,0,
b,-a,0,0,a,b,0,0,0,0,1);return this},setRotY:function(a){var b=Math.cos(a);a=Math.sin(a);this.set(b,0,a,0,0,1,0,0,-a,0,b,0,0,0,0,1);return this},setRotZ:function(a){var b=Math.cos(a);a=Math.sin(a);this.set(b,-a,0,0,a,b,0,0,0,0,1,0,0,0,0,1);return this},setRotAxis:function(a,b){var c=Math.cos(b),d=Math.sin(b),e=1-c,f=a.x,g=a.y,i=a.z,h=e*f,j=e*g;this.set(h*f+c,h*g-d*i,h*i+d*g,0,h*g+d*i,j*g+c,j*i-d*f,0,h*i-d*g,j*i+d*f,e*i*i+c,0,0,0,0,1);return this},setPosition:function(a){this.n14=a.x;this.n24=a.y;
this.n34=a.z;return this},setRotationFromEuler:function(a){var b=a.x,c=a.y,d=a.z;a=Math.cos(b);b=Math.sin(b);var e=Math.cos(c);c=Math.sin(c);var f=Math.cos(d);d=Math.sin(d);var g=a*c,i=b*c;this.n11=e*f;this.n12=-e*d;this.n13=c;this.n21=i*f+a*d;this.n22=-i*d+a*f;this.n23=-b*e;this.n31=-g*f+b*d;this.n32=g*d+b*f;this.n33=a*e},setRotationFromQuaternion:function(a){var b=a.x,c=a.y,d=a.z,e=a.w,f=b+b,g=c+c,i=d+d;a=b*f;var h=b*g;b*=i;var j=c*g;c*=i;d*=i;f*=e;g*=e;e*=i;this.n11=1-(j+d);this.n12=h-e;this.n13=
b+g;this.n21=h+e;this.n22=1-(a+d);this.n23=c-f;this.n31=b-g;this.n32=c+f;this.n33=1-(a+j)},scale:function(a){var b=a.x,c=a.y;a=a.z;this.n11*=b;this.n12*=c;this.n13*=a;this.n21*=b;this.n22*=c;this.n23*=a;this.n31*=b;this.n32*=c;this.n33*=a;this.n41*=b;this.n42*=c;this.n43*=a;return this}};THREE.Matrix4.translationMatrix=function(a,b,c){var d=new THREE.Matrix4;d.setTranslation(a,b,c);return d};THREE.Matrix4.scaleMatrix=function(a,b,c){var d=new THREE.Matrix4;d.setScale(a,b,c);return d};
THREE.Matrix4.rotationXMatrix=function(a){var b=new THREE.Matrix4;b.setRotX(a);return b};THREE.Matrix4.rotationYMatrix=function(a){var b=new THREE.Matrix4;b.setRotY(a);return b};THREE.Matrix4.rotationZMatrix=function(a){var b=new THREE.Matrix4;b.setRotZ(a);return b};THREE.Matrix4.rotationAxisAngleMatrix=function(a,b){var c=new THREE.Matrix4;c.setRotAxis(a,b);return c};
THREE.Matrix4.makeInvert=function(a,b){var c=a.n11,d=a.n12,e=a.n13,f=a.n14,g=a.n21,i=a.n22,h=a.n23,j=a.n24,n=a.n31,l=a.n32,m=a.n33,o=a.n34,p=a.n41,q=a.n42,r=a.n43,k=a.n44;b===undefined&&(b=new THREE.Matrix4);b.n11=h*o*q-j*m*q+j*l*r-i*o*r-h*l*k+i*m*k;b.n12=f*m*q-e*o*q-f*l*r+d*o*r+e*l*k-d*m*k;b.n13=e*j*q-f*h*q+f*i*r-d*j*r-e*i*k+d*h*k;b.n14=f*h*l-e*j*l-f*i*m+d*j*m+e*i*o-d*h*o;b.n21=j*m*p-h*o*p-j*n*r+g*o*r+h*n*k-g*m*k;b.n22=e*o*p-f*m*p+f*n*r-c*o*r-e*n*k+c*m*k;b.n23=f*h*p-e*j*p-f*g*r+c*j*r+e*g*k-c*h*k;
b.n24=e*j*n-f*h*n+f*g*m-c*j*m-e*g*o+c*h*o;b.n31=i*o*p-j*l*p+j*n*q-g*o*q-i*n*k+g*l*k;b.n32=f*l*p-d*o*p-f*n*q+c*o*q+d*n*k-c*l*k;b.n33=e*j*p-f*i*p+f*g*q-c*j*q-d*g*k+c*i*k;b.n34=f*i*n-d*j*n-f*g*l+c*j*l+d*g*o-c*i*o;b.n41=h*l*p-i*m*p-h*n*q+g*m*q+i*n*r-g*l*r;b.n42=d*m*p-e*l*p+e*n*q-c*m*q-d*n*r+c*l*r;b.n43=e*i*p-d*h*p-e*g*q+c*h*q+d*g*r-c*i*r;b.n44=d*h*n-e*i*n+e*g*l-c*h*l-d*g*m+c*i*m;b.multiplyScalar(1/a.determinant());return b};
THREE.Matrix4.makeInvert3x3=function(a){var b=a.m33,c=b.m,d=a.n33*a.n22-a.n32*a.n23,e=-a.n33*a.n21+a.n31*a.n23,f=a.n32*a.n21-a.n31*a.n22,g=-a.n33*a.n12+a.n32*a.n13,i=a.n33*a.n11-a.n31*a.n13,h=-a.n32*a.n11+a.n31*a.n12,j=a.n23*a.n12-a.n22*a.n13,n=-a.n23*a.n11+a.n21*a.n13,l=a.n22*a.n11-a.n21*a.n12;a=a.n11*d+a.n21*g+a.n31*j;if(a==0)throw"matrix not invertible";a=1/a;c[0]=a*d;c[1]=a*e;c[2]=a*f;c[3]=a*g;c[4]=a*i;c[5]=a*h;c[6]=a*j;c[7]=a*n;c[8]=a*l;return b};
THREE.Matrix4.makeFrustum=function(a,b,c,d,e,f){var g;g=new THREE.Matrix4;g.n11=2*e/(b-a);g.n12=0;g.n13=(b+a)/(b-a);g.n14=0;g.n21=0;g.n22=2*e/(d-c);g.n23=(d+c)/(d-c);g.n24=0;g.n31=0;g.n32=0;g.n33=-(f+e)/(f-e);g.n34=-2*f*e/(f-e);g.n41=0;g.n42=0;g.n43=-1;g.n44=0;return g};THREE.Matrix4.makePerspective=function(a,b,c,d){var e;a=c*Math.tan(a*Math.PI/360);e=-a;return THREE.Matrix4.makeFrustum(e*b,a*b,e,a,c,d)};
THREE.Matrix4.makeOrtho=function(a,b,c,d,e,f){var g,i,h,j;g=new THREE.Matrix4;i=b-a;h=c-d;j=f-e;g.n11=2/i;g.n12=0;g.n13=0;g.n14=-((b+a)/i);g.n21=0;g.n22=2/h;g.n23=0;g.n24=-((c+d)/h);g.n31=0;g.n32=0;g.n33=-2/j;g.n34=-((f+e)/j);g.n41=0;g.n42=0;g.n43=0;g.n44=1;return g};THREE.Matrix4.__tmpVec1=new THREE.Vector3;THREE.Matrix4.__tmpVec2=new THREE.Vector3;THREE.Matrix4.__tmpVec3=new THREE.Vector3;
THREE.Object3D=function(){this.id=THREE.Object3DCounter.value++;this.parent=undefined;this.children=[];this.position=new THREE.Vector3;this.positionScreen=new THREE.Vector4;this.rotation=new THREE.Vector3;this.scale=new THREE.Vector3(1,1,1);this.matrix=new THREE.Matrix4;this.matrixWorld=new THREE.Matrix4;this.matrixRotationWorld=new THREE.Matrix4;this.matrixNeedsUpdate=!0;this.matrixAutoUpdate=!0;this.quaternion=new THREE.Quaternion;this.useQuaternion=!1;this.boundRadius=0;this.boundRadiusScale=1;
this.visible=!0};
THREE.Object3D.prototype={addChild:function(a){if(this.children.indexOf(a)===-1){a.parent!==undefined&&a.parent.removeChild(a);a.parent=this;this.children.push(a);for(var b=this;b instanceof THREE.Scene===!1&&b!==undefined;)b=b.parent;b!==undefined&&b.addChildRecurse(a)}},removeChild:function(a){var b=this.children.indexOf(a);if(b!==-1){a.parent=undefined;this.children.splice(b,1)}},updateMatrix:function(){this.matrix.setPosition(this.position);this.useQuaternion?this.matrix.setRotationFromQuaternion(this.quaternion):this.matrix.setRotationFromEuler(this.rotation);
if(this.scale.x!==1||this.scale.y!==1||this.scale.z!==1){this.matrix.scale(this.scale);this.boundRadiusScale=Math.max(this.scale.x,Math.max(this.scale.y,this.scale.z))}return!0},update:function(a,b,c){if(this.visible){this.matrixAutoUpdate&&(b|=this.updateMatrix());if(b||this.matrixNeedsUpdate){a?this.matrixWorld.multiply(a,this.matrix):this.matrixWorld.copy(this.matrix);b=1/this.scale.x;a=1/this.scale.y;var d=1/this.scale.z;this.matrixRotationWorld.n11=this.matrixWorld.n11*b;this.matrixRotationWorld.n21=
this.matrixWorld.n21*b;this.matrixRotationWorld.n31=this.matrixWorld.n31*b;this.matrixRotationWorld.n12=this.matrixWorld.n12*a;this.matrixRotationWorld.n22=this.matrixWorld.n22*a;this.matrixRotationWorld.n32=this.matrixWorld.n32*a;this.matrixRotationWorld.n13=this.matrixWorld.n13*d;this.matrixRotationWorld.n23=this.matrixWorld.n23*d;this.matrixRotationWorld.n33=this.matrixWorld.n33*d;this.matrixNeedsUpdate=!1;b=!0}a=0;for(d=this.children.length;a<d;a++)this.children[a].update(this.matrixWorld,b,c)}}};
THREE.Object3DCounter={value:0};THREE.Quaternion=function(a,b,c,d){this.set(a||0,b||0,c||0,d!==undefined?d:1)};
THREE.Quaternion.prototype={set:function(a,b,c,d){this.x=a;this.y=b;this.z=c;this.w=d;return this},setFromEuler:function(a){var b=0.5*Math.PI/360,c=a.x*b,d=a.y*b,e=a.z*b;a=Math.cos(d);d=Math.sin(d);b=Math.cos(-e);e=Math.sin(-e);var f=Math.cos(c);c=Math.sin(c);var g=a*b,i=d*e;this.w=g*f-i*c;this.x=g*c+i*f;this.y=d*b*f+a*e*c;this.z=a*e*f-d*b*c;return this},calculateW:function(){this.w=-Math.sqrt(Math.abs(1-this.x*this.x-this.y*this.y-this.z*this.z));return this},inverse:function(){this.x*=-1;this.y*=
-1;this.z*=-1;return this},length:function(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)},normalize:function(){var a=Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w);if(a==0)this.w=this.z=this.y=this.x=0;else{a=1/a;this.x*=a;this.y*=a;this.z*=a;this.w*=a}return this},multiplySelf:function(a){var b=this.x,c=this.y,d=this.z,e=this.w,f=a.x,g=a.y,i=a.z;a=a.w;this.x=b*a+e*f+c*i-d*g;this.y=c*a+e*g+d*f-b*i;this.z=d*a+e*i+b*g-c*f;this.w=e*a-b*f-c*g-d*i;return this},
multiplyVector3:function(a,b){b||(b=a);var c=a.x,d=a.y,e=a.z,f=this.x,g=this.y,i=this.z,h=this.w,j=h*c+g*e-i*d,n=h*d+i*c-f*e,l=h*e+f*d-g*c;c=-f*c-g*d-i*e;b.x=j*h+c*-f+n*-i-l*-g;b.y=n*h+c*-g+l*-f-j*-i;b.z=l*h+c*-i+j*-g-n*-f;return b}};
THREE.Quaternion.slerp=function(a,b,c,d){var e=a.w*b.w+a.x*b.x+a.y*b.y+a.z*b.z;if(Math.abs(e)>=1){c.w=a.w;c.x=a.x;c.y=a.y;c.z=a.z;return c}var f=Math.acos(e),g=Math.sqrt(1-e*e);if(Math.abs(g)<0.001){c.w=0.5*(a.w+b.w);c.x=0.5*(a.x+b.x);c.y=0.5*(a.y+b.y);c.z=0.5*(a.z+b.z);return c}e=Math.sin((1-d)*f)/g;d=Math.sin(d*f)/g;c.w=a.w*e+b.w*d;c.x=a.x*e+b.x*d;c.y=a.y*e+b.y*d;c.z=a.z*e+b.z*d;return c};
THREE.Vertex=function(a,b){this.position=a||new THREE.Vector3;this.positionWorld=new THREE.Vector3;this.positionScreen=new THREE.Vector4;this.normal=b||new THREE.Vector3;this.normalWorld=new THREE.Vector3;this.normalScreen=new THREE.Vector3;this.tangent=new THREE.Vector4;this.__visible=!0};
THREE.Face3=function(a,b,c,d,e){this.a=a;this.b=b;this.c=c;this.centroid=new THREE.Vector3;this.normal=d instanceof THREE.Vector3?d:new THREE.Vector3;this.vertexNormals=d instanceof Array?d:[];this.materials=e instanceof Array?e:[e]};THREE.Face4=function(a,b,c,d,e,f){this.a=a;this.b=b;this.c=c;this.d=d;this.centroid=new THREE.Vector3;this.normal=e instanceof THREE.Vector3?e:new THREE.Vector3;this.vertexNormals=e instanceof Array?e:[];this.materials=f instanceof Array?f:[f]};
THREE.UV=function(a,b){this.set(a||0,b||0)};THREE.UV.prototype={set:function(a,b){this.u=a;this.v=b;return this},copy:function(a){this.set(a.u,a.v);return this}};
THREE.Camera=function(a,b,c,d,e){THREE.Object3D.call(this);this.fov=a||50;this.aspect=b||1;this.near=c||0.1;this.far=d||2E3;this.target=e||new THREE.Object3D;this.useTarget=!0;this.up=new THREE.Vector3(0,1,0);this.matrixWorldInverse=new THREE.Matrix4;this.projectionMatrix=null;this.tmpVec=new THREE.Vector3;this.translateX=function(f,g){this.tmpVec.sub(this.target.position,this.position).normalize().multiplyScalar(f);this.tmpVec.crossSelf(this.up);if(g)this.tmpVec.y=0;this.position.addSelf(this.tmpVec);
this.target.position.addSelf(this.tmpVec)};this.translateZ=function(f,g){this.tmpVec.sub(this.target.position,this.position).normalize().multiplyScalar(f);if(g)this.tmpVec.y=0;this.position.subSelf(this.tmpVec);this.target.position.subSelf(this.tmpVec)};this.updateProjectionMatrix()};THREE.Camera.prototype=new THREE.Object3D;THREE.Camera.prototype.constructor=THREE.Camera;THREE.Camera.prototype.supr=THREE.Object3D.prototype;
THREE.Camera.prototype.updateProjectionMatrix=function(){this.projectionMatrix=THREE.Matrix4.makePerspective(this.fov,this.aspect,this.near,this.far)};
THREE.Camera.prototype.update=function(a,b,c){if(this.useTarget){this.matrix.lookAt(this.position,this.target.position,this.up);a?this.matrixWorld.multiply(a,this.matrix):this.matrixWorld.copy(this.matrix);THREE.Matrix4.makeInvert(this.matrixWorld,this.matrixWorldInverse);b=!0}else{this.matrixAutoUpdate&&(b|=this.updateMatrix());if(b||this.matrixNeedsUpdate){a?this.matrixWorld.multiply(a,this.matrix):this.matrixWorld.copy(this.matrix);this.matrixNeedsUpdate=!1;b=!0;THREE.Matrix4.makeInvert(this.matrixWorld,
this.matrixWorldInverse)}}for(a=0;a<this.children.length;a++)this.children[a].update(this.matrixWorld,b,c)};THREE.ParticleDOMMaterial=function(a){this.id=THREE.MaterialCounter.value++;this.domElement=a};THREE.Particle=function(a){THREE.Object3D.call(this);this.materials=a instanceof Array?a:[a];this.matrixAutoUpdate=!1};THREE.Particle.prototype=new THREE.Object3D;THREE.Particle.prototype.constructor=THREE.Particle;
THREE.Bone=function(a){THREE.Object3D.call(this);this.skin=a;this.skinMatrix=new THREE.Matrix4;this.hasNoneBoneChildren=!1};THREE.Bone.prototype=new THREE.Object3D;THREE.Bone.prototype.constructor=THREE.Bone;THREE.Bone.prototype.supr=THREE.Object3D.prototype;
THREE.Bone.prototype.update=function(a,b,c){this.matrixAutoUpdate&&(b|=this.updateMatrix());if(b||this.matrixNeedsUpdate){a?this.skinMatrix.multiply(a,this.matrix):this.skinMatrix.copy(this.matrix);this.matrixNeedsUpdate=!1;b=!0}var d,e=this.children.length;if(this.hasNoneBoneChildren){this.matrixWorld.multiply(this.skin.matrixWorld,this.skinMatrix);for(d=0;d<e;d++){a=this.children[d];a instanceof THREE.Bone?a.update(this.skinMatrix,b,c):a.update(this.matrixWorld,!0,c)}}else for(d=0;d<e;d++)this.children[d].update(this.skinMatrix,
b,c)};THREE.Bone.prototype.addChild=function(a){if(this.children.indexOf(a)===-1){a.parent!==undefined&&a.parent.removeChild(a);a.parent=this;this.children.push(a);if(!(a instanceof THREE.Bone))this.hasNoneBoneChildren=!0}};
THREE.Sound=function(a,b,c,d){THREE.Object3D.call(this);this.isLoaded=!1;this.isAddedToDOM=!1;this.isPlaying=!1;this.duration=-1;this.radius=b!==undefined?Math.abs(b):100;this.volume=Math.min(1,Math.max(0,c!==undefined?c:1));this.domElement=document.createElement("audio");this.domElement.volume=0;this.domElement.pan=0;this.domElement.loop=d!==undefined?d:!0;this.sources=a instanceof Array?a:[a];var e;c=this.sources.length;for(a=0;a<c;a++){b=this.sources[a];b.toLowerCase();if(b.indexOf(".mp3")!==-1)e=
"audio/mpeg";else if(b.indexOf(".ogg")!==-1)e="audio/ogg";else b.indexOf(".wav")!==-1&&(e="audio/wav");if(this.domElement.canPlayType(e)){e=document.createElement("source");e.src=this.sources[a];this.domElement.THREESound=this;this.domElement.appendChild(e);this.domElement.addEventListener("canplay",this.onLoad,!0);this.domElement.load();break}}};THREE.Sound.prototype=new THREE.Object3D;THREE.Sound.prototype.constructor=THREE.Sound;THREE.Sound.prototype.supr=THREE.Object3D.prototype;
THREE.Sound.prototype.onLoad=function(){var a=this.THREESound;if(!a.isLoaded){this.removeEventListener("canplay",this.onLoad,!0);a.isLoaded=!0;a.duration=this.duration;a.isPlaying&&a.play()}};THREE.Sound.prototype.addToDOM=function(a){this.isAddedToDOM=!0;a.appendChild(this.domElement)};THREE.Sound.prototype.play=function(a){this.isPlaying=!0;if(this.isLoaded){this.domElement.play();if(a)this.domElement.currentTime=a%this.duration}};THREE.Sound.prototype.pause=function(){this.isPlaying=!1;this.domElement.pause()};
THREE.Sound.prototype.stop=function(){this.isPlaying=!1;this.domElement.pause();this.domElement.currentTime=0};THREE.Sound.prototype.calculateVolumeAndPan=function(a){a=a.length();this.domElement.volume=a<=this.radius?this.volume*(1-a/this.radius):0};
THREE.Sound.prototype.update=function(a,b,c){if(this.matrixAutoUpdate){this.matrix.setPosition(this.position);b=!0}if(b||this.matrixNeedsUpdate){a?this.matrixWorld.multiply(a,this.matrix):this.matrixWorld.copy(this.matrix);this.matrixNeedsUpdate=!1;b=!0}var d=this.children.length;for(a=0;a<d;a++)this.children[a].update(this.matrixWorld,b,c)};
THREE.Scene=function(){THREE.Object3D.call(this);this.matrixAutoUpdate=!1;this.fog=null;this.objects=[];this.lights=[];this.sounds=[];this.__objectsAdded=[];this.__objectsRemoved=[]};THREE.Scene.prototype=new THREE.Object3D;THREE.Scene.prototype.constructor=THREE.Scene;THREE.Scene.prototype.supr=THREE.Object3D.prototype;THREE.Scene.prototype.addChild=function(a){this.supr.addChild.call(this,a);this.addChildRecurse(a)};
THREE.Scene.prototype.addChildRecurse=function(a){if(a instanceof THREE.Light)this.lights.indexOf(a)===-1&&this.lights.push(a);else if(a instanceof THREE.Sound)this.sounds.indexOf(a)===-1&&this.sounds.push(a);else if(!(a instanceof THREE.Camera||a instanceof THREE.Bone)&&this.objects.indexOf(a)===-1){this.objects.push(a);this.__objectsAdded.push(a)}for(var b=0;b<a.children.length;b++)this.addChildRecurse(a.children[b])};
THREE.Scene.prototype.removeChild=function(a){this.supr.removeChild.call(this,a);this.removeChildRecurse(a)};THREE.Scene.prototype.removeChildRecurse=function(a){if(a instanceof THREE.Light){var b=this.lights.indexOf(a);b!==-1&&this.lights.splice(b,1)}else if(a instanceof THREE.Sound){b=this.sounds.indexOf(a);b!==-1&&this.sounds.splice(b,1)}else if(!(a instanceof THREE.Camera)){b=this.objects.indexOf(a);if(b!==-1){this.objects.splice(b,1);this.__objectsRemoved.push(a)}}for(b=0;b<a.children.length;b++)this.removeChildRecurse(a.children[b])};
THREE.Scene.prototype.addObject=THREE.Scene.prototype.addChild;THREE.Scene.prototype.removeObject=THREE.Scene.prototype.removeChild;THREE.Scene.prototype.addLight=THREE.Scene.prototype.addChild;THREE.Scene.prototype.removeLight=THREE.Scene.prototype.removeChild;
THREE.Projector=function(){function a(v,t){return t.z-v.z}function b(v,t){var C=0,z=1,D=v.z+v.w,E=t.z+t.w,x=-v.z+v.w,u=-t.z+t.w;if(D>=0&&E>=0&&x>=0&&u>=0)return!0;else if(D<0&&E<0||x<0&&u<0)return!1;else{if(D<0)C=Math.max(C,D/(D-E));else E<0&&(z=Math.min(z,D/(D-E)));if(x<0)C=Math.max(C,x/(x-u));else u<0&&(z=Math.min(z,x/(x-u)));if(z<C)return!1;else{v.lerpSelf(t,C);t.lerpSelf(v,1-z);return!0}}}var c,d,e=[],f,g,i,h=[],j,n,l=[],m,o,p=[],q=new THREE.Vector4,r=new THREE.Vector4,k=new THREE.Matrix4,B=new THREE.Matrix4,
w=[new THREE.Vector4,new THREE.Vector4,new THREE.Vector4,new THREE.Vector4,new THREE.Vector4,new THREE.Vector4],F=new THREE.Vector4,G=new THREE.Vector4,I;this.projectObjects=function(v,t,C){t=[];var z,D,E;d=0;D=v.objects;v=0;for(z=D.length;v<z;v++){E=D[v];var x;if(!(x=!E.visible))if(x=E instanceof THREE.Mesh){a:{x=void 0;for(var u=E.matrixWorld,L=-E.geometry.boundingSphere.radius*Math.max(E.scale.x,Math.max(E.scale.y,E.scale.z)),s=0;s<6;s++){x=w[s].x*u.n14+w[s].y*u.n24+w[s].z*u.n34+w[s].w;if(x<=L){x=
!1;break a}}x=!0}x=!x}if(!x){c=e[d]=e[d]||new THREE.RenderableObject;q.copy(E.position);k.multiplyVector3(q);c.object=E;c.z=q.z;t.push(c);d++}}C&&t.sort(a);return t};this.projectScene=function(v,t,C){var z=[],D=t.near,E=t.far,x,u,L,s,H,N,y,P,Q,R,S,O,K,A,J,M;i=n=o=0;t.matrixAutoUpdate&&t.update();k.multiply(t.projectionMatrix,t.matrixWorldInverse);w[0].set(k.n41-k.n11,k.n42-k.n12,k.n43-k.n13,k.n44-k.n14);w[1].set(k.n41+k.n11,k.n42+k.n12,k.n43+k.n13,k.n44+k.n14);w[2].set(k.n41+k.n21,k.n42+k.n22,k.n43+
k.n23,k.n44+k.n24);w[3].set(k.n41-k.n21,k.n42-k.n22,k.n43-k.n23,k.n44-k.n24);w[4].set(k.n41-k.n31,k.n42-k.n32,k.n43-k.n33,k.n44-k.n34);w[5].set(k.n41+k.n31,k.n42+k.n32,k.n43+k.n33,k.n44+k.n34);for(x=0;x<6;x++){N=w[x];N.divideScalar(Math.sqrt(N.x*N.x+N.y*N.y+N.z*N.z))}v.update(undefined,!1,t);N=this.projectObjects(v,t,!0);v=0;for(x=N.length;v<x;v++){y=N[v].object;if(y.visible){P=y.matrixWorld;S=y.matrixRotationWorld;Q=y.materials;R=y.overdraw;if(y instanceof THREE.Mesh){O=y.geometry;K=O.vertices;u=
0;for(L=K.length;u<L;u++){A=K[u];A.positionWorld.copy(A.position);P.multiplyVector3(A.positionWorld);s=A.positionScreen;s.copy(A.positionWorld);k.multiplyVector4(s);s.x/=s.w;s.y/=s.w;A.__visible=s.z>D&&s.z<E}O=O.faces;u=0;for(L=O.length;u<L;u++){A=O[u];if(A instanceof THREE.Face3){s=K[A.a];H=K[A.b];J=K[A.c];if(s.__visible&&H.__visible&&J.__visible&&(y.doubleSided||y.flipSided!=(J.positionScreen.x-s.positionScreen.x)*(H.positionScreen.y-s.positionScreen.y)-(J.positionScreen.y-s.positionScreen.y)*(H.positionScreen.x-
s.positionScreen.x)<0)){f=h[i]=h[i]||new THREE.RenderableFace3;f.v1.positionWorld.copy(s.positionWorld);f.v2.positionWorld.copy(H.positionWorld);f.v3.positionWorld.copy(J.positionWorld);f.v1.positionScreen.copy(s.positionScreen);f.v2.positionScreen.copy(H.positionScreen);f.v3.positionScreen.copy(J.positionScreen);f.normalWorld.copy(A.normal);S.multiplyVector3(f.normalWorld);f.centroidWorld.copy(A.centroid);P.multiplyVector3(f.centroidWorld);f.centroidScreen.copy(f.centroidWorld);k.multiplyVector3(f.centroidScreen);
J=A.vertexNormals;I=f.vertexNormalsWorld;s=0;for(H=J.length;s<H;s++){M=I[s]=I[s]||new THREE.Vector3;M.copy(J[s]);S.multiplyVector3(M)}f.z=f.centroidScreen.z;f.meshMaterials=Q;f.faceMaterials=A.materials;f.overdraw=R;if(y.geometry.uvs[u]){f.uvs[0]=y.geometry.uvs[u][0];f.uvs[1]=y.geometry.uvs[u][1];f.uvs[2]=y.geometry.uvs[u][2]}z.push(f);i++}}else if(A instanceof THREE.Face4){s=K[A.a];H=K[A.b];J=K[A.c];M=K[A.d];if(s.__visible&&H.__visible&&J.__visible&&M.__visible&&(y.doubleSided||y.flipSided!=((M.positionScreen.x-
s.positionScreen.x)*(H.positionScreen.y-s.positionScreen.y)-(M.positionScreen.y-s.positionScreen.y)*(H.positionScreen.x-s.positionScreen.x)<0||(H.positionScreen.x-J.positionScreen.x)*(M.positionScreen.y-J.positionScreen.y)-(H.positionScreen.y-J.positionScreen.y)*(M.positionScreen.x-J.positionScreen.x)<0))){f=h[i]=h[i]||new THREE.RenderableFace3;f.v1.positionWorld.copy(s.positionWorld);f.v2.positionWorld.copy(H.positionWorld);f.v3.positionWorld.copy(M.positionWorld);f.v1.positionScreen.copy(s.positionScreen);
f.v2.positionScreen.copy(H.positionScreen);f.v3.positionScreen.copy(M.positionScreen);f.normalWorld.copy(A.normal);S.multiplyVector3(f.normalWorld);f.centroidWorld.copy(A.centroid);P.multiplyVector3(f.centroidWorld);f.centroidScreen.copy(f.centroidWorld);k.multiplyVector3(f.centroidScreen);f.z=f.centroidScreen.z;f.meshMaterials=Q;f.faceMaterials=A.materials;f.overdraw=R;if(y.geometry.uvs[u]){f.uvs[0]=y.geometry.uvs[u][0];f.uvs[1]=y.geometry.uvs[u][1];f.uvs[2]=y.geometry.uvs[u][3]}z.push(f);i++;g=
h[i]=h[i]||new THREE.RenderableFace3;g.v1.positionWorld.copy(H.positionWorld);g.v2.positionWorld.copy(J.positionWorld);g.v3.positionWorld.copy(M.positionWorld);g.v1.positionScreen.copy(H.positionScreen);g.v2.positionScreen.copy(J.positionScreen);g.v3.positionScreen.copy(M.positionScreen);g.normalWorld.copy(f.normalWorld);g.centroidWorld.copy(f.centroidWorld);g.centroidScreen.copy(f.centroidScreen);g.z=g.centroidScreen.z;g.meshMaterials=Q;g.faceMaterials=A.materials;g.overdraw=R;if(y.geometry.uvs[u]){g.uvs[0]=
y.geometry.uvs[u][1];g.uvs[1]=y.geometry.uvs[u][2];g.uvs[2]=y.geometry.uvs[u][3]}z.push(g);i++}}}}else if(y instanceof THREE.Line){B.multiply(k,P);K=y.geometry.vertices;A=K[0];A.positionScreen.copy(A.position);B.multiplyVector4(A.positionScreen);u=1;for(L=K.length;u<L;u++){s=K[u];s.positionScreen.copy(s.position);B.multiplyVector4(s.positionScreen);H=K[u-1];F.copy(s.positionScreen);G.copy(H.positionScreen);if(b(F,G)){F.multiplyScalar(1/F.w);G.multiplyScalar(1/G.w);j=l[n]=l[n]||new THREE.RenderableLine;
j.v1.positionScreen.copy(F);j.v2.positionScreen.copy(G);j.z=Math.max(F.z,G.z);j.materials=y.materials;z.push(j);n++}}}else if(y instanceof THREE.Particle){r.set(y.position.x,y.position.y,y.position.z,1);k.multiplyVector4(r);r.z/=r.w;if(r.z>0&&r.z<1){m=p[o]=p[o]||new THREE.RenderableParticle;m.x=r.x/r.w;m.y=r.y/r.w;m.z=r.z;m.rotation=y.rotation.z;m.scale.x=y.scale.x*Math.abs(m.x-(r.x+t.projectionMatrix.n11)/(r.w+t.projectionMatrix.n14));m.scale.y=y.scale.y*Math.abs(m.y-(r.y+t.projectionMatrix.n22)/
(r.w+t.projectionMatrix.n24));m.materials=y.materials;z.push(m);o++}}}}C&&z.sort(a);return z};this.unprojectVector=function(v,t){var C=t.matrixWorld.clone();C.multiplySelf(THREE.Matrix4.makeInvert(t.projectionMatrix));C.multiplyVector3(v);return v}};
THREE.DOMRenderer=function(){THREE.Renderer.call(this);var a=null,b=new THREE.Projector,c,d,e,f;this.domElement=document.createElement("div");this.setSize=function(g,i){c=g;d=i;e=c/2;f=d/2};this.render=function(g,i){var h,j,n,l,m,o,p,q;a=b.projectScene(g,i);h=0;for(j=a.length;h<j;h++){m=a[h];if(m instanceof THREE.RenderableParticle){p=m.x*e+e;q=m.y*f+f;n=0;for(l=m.material.length;n<l;n++){o=m.material[n];if(o instanceof THREE.ParticleDOMMaterial){o=o.domElement;o.style.left=p+"px";o.style.top=q+"px"}}}}}};
THREE.SoundRenderer=function(){this.volume=1;this.domElement=document.createElement("div");this.domElement.id="THREESound";this.cameraPosition=new THREE.Vector3;this.soundPosition=new THREE.Vector3;this.render=function(a,b,c){c&&a.update(undefined,!1,b);c=a.sounds;var d,e=c.length;for(d=0;d<e;d++){a=c[d];this.soundPosition.set(a.matrixWorld.n14,a.matrixWorld.n24,a.matrixWorld.n34);this.soundPosition.subSelf(b.position);if(a.isPlaying&&a.isLoaded){a.isAddedToDOM||a.addToDOM(this.domElement);a.calculateVolumeAndPan(this.soundPosition)}}}};
THREE.RenderableParticle=function(){this.rotation=this.z=this.y=this.x=null;this.scale=new THREE.Vector2;this.materials=null};
