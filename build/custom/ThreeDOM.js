// ThreeDOM.js r35 - http://github.com/mrdoob/three.js
var THREE=THREE||{};THREE.Color=function(a){this.setHex(a)};
THREE.Color.prototype={autoUpdate:!0,setRGB:function(a,b,c){this.r=a;this.g=b;this.b=c;if(this.autoUpdate){this.updateHex();this.updateStyleString()}},setHSV:function(a,b,c){var d,e,f,g,i,h;if(c==0)d=e=f=0;else{g=Math.floor(a*6);i=a*6-g;a=c*(1-b);h=c*(1-b*i);b=c*(1-b*(1-i));switch(g){case 1:d=h;e=c;f=a;break;case 2:d=a;e=c;f=b;break;case 3:d=a;e=h;f=c;break;case 4:d=b;e=a;f=c;break;case 5:d=c;e=a;f=h;break;case 6:case 0:d=c;e=b;f=a}}this.r=d;this.g=e;this.b=f;if(this.autoUpdate){this.updateHex();
this.updateStyleString()}},setHex:function(a){this.hex=~~a&16777215;if(this.autoUpdate){this.updateRGB();this.updateStyleString()}},updateHex:function(){this.hex=~~(this.r*255)<<16^~~(this.g*255)<<8^~~(this.b*255)},updateRGB:function(){this.r=(this.hex>>16&255)/255;this.g=(this.hex>>8&255)/255;this.b=(this.hex&255)/255},updateStyleString:function(){this.__styleString="rgb("+~~(this.r*255)+","+~~(this.g*255)+","+~~(this.b*255)+")"},clone:function(){return new THREE.Color(this.hex)}};
THREE.Vector2=function(a,b){this.set(a||0,b||0)};
THREE.Vector2.prototype={set:function(a,b){this.x=a;this.y=b;return this},copy:function(a){this.set(a.x,a.y);return this},addSelf:function(a){this.set(this.x+a.x,this.y+a.y);return this},add:function(a,b){this.set(a.x+b.x,a.y+b.y);return this},subSelf:function(a){this.set(this.x-a.x,this.y-a.y);return this},sub:function(a,b){this.set(a.x-b.x,a.y-b.y);return this},multiplyScalar:function(a){this.set(this.x*a,this.y*a);return this},negate:function(){this.set(-this.x,-this.y);return this},unit:function(){this.multiplyScalar(1/
this.length());return this},length:function(){return Math.sqrt(this.lengthSq())},lengthSq:function(){return this.x*this.x+this.y*this.y},clone:function(){return new THREE.Vector2(this.x,this.y)}};THREE.Vector3=function(a,b,c){this.set(a||0,b||0,c||0)};
THREE.Vector3.prototype={set:function(a,b,c){this.x=a;this.y=b;this.z=c;return this},copy:function(a){this.set(a.x,a.y,a.z);return this},add:function(a,b){this.set(a.x+b.x,a.y+b.y,a.z+b.z);return this},addSelf:function(a){this.set(this.x+a.x,this.y+a.y,this.z+a.z);return this},addScalar:function(a){this.set(this.x+a,this.y+a,this.z+a);return this},sub:function(a,b){this.set(a.x-b.x,a.y-b.y,a.z-b.z);return this},subSelf:function(a){this.set(this.x-a.x,this.y-a.y,this.z-a.z);return this},cross:function(a,
b){this.set(a.y*b.z-a.z*b.y,a.z*b.x-a.x*b.z,a.x*b.y-a.y*b.x);return this},crossSelf:function(a){var b=this.x,c=this.y,d=this.z;this.set(c*a.z-d*a.y,d*a.x-b*a.z,b*a.y-c*a.x);return this},multiply:function(a,b){this.set(a.x*b.x,a.y*b.y,a.z*b.z);return this},multiplySelf:function(a){this.set(this.x*a.x,this.y*a.y,this.z*a.z);return this},multiplyScalar:function(a){this.set(this.x*a,this.y*a,this.z*a);return this},divideSelf:function(a){this.set(this.x/a.x,this.y/a.y,this.z/a.z);return this},divideScalar:function(a){this.set(this.x/
a,this.y/a,this.z/a);return this},negate:function(){this.set(-this.x,-this.y,-this.z);return this},dot:function(a){return this.x*a.x+this.y*a.y+this.z*a.z},distanceTo:function(a){return Math.sqrt(this.distanceToSquared(a))},distanceToSquared:function(a){var b=this.x-a.x,c=this.y-a.y;a=this.z-a.z;return b*b+c*c+a*a},length:function(){return Math.sqrt(this.lengthSq())},lengthSq:function(){return this.x*this.x+this.y*this.y+this.z*this.z},lengthManhattan:function(){return this.x+this.y+this.z},normalize:function(){var a=
this.length();a>0?this.multiplyScalar(1/a):this.set(0,0,0);return this},setPositionFromMatrix:function(a){this.x=a.n14;this.y=a.n24;this.z=a.n34},setRotationFromMatrix:function(a){this.y=Math.asin(a.n13);var b=Math.cos(this.y);if(Math.abs(b)>1.0E-5){this.x=Math.atan2(-a.n23/b,a.n33/b);this.z=Math.atan2(-a.n13/b,a.n11/b)}else{this.x=0;this.z=Math.atan2(a.n21,a.n22)}},setLength:function(a){return this.normalize().multiplyScalar(a)},isZero:function(){return Math.abs(this.x)<1.0E-4&&Math.abs(this.y)<
1.0E-4&&Math.abs(this.z)<1.0E-4},clone:function(){return new THREE.Vector3(this.x,this.y,this.z)}};THREE.Vector4=function(a,b,c,d){this.set(a||0,b||0,c||0,d||1)};
THREE.Vector4.prototype={set:function(a,b,c,d){this.x=a;this.y=b;this.z=c;this.w=d;return this},copy:function(a){this.set(a.x,a.y,a.z,a.w||1);return this},add:function(a,b){this.set(a.x+b.x,a.y+b.y,a.z+b.z,a.w+b.w);return this},addSelf:function(a){this.set(this.x+a.x,this.y+a.y,this.z+a.z,this.w+a.w);return this},sub:function(a,b){this.set(a.x-b.x,a.y-b.y,a.z-b.z,a.w-b.w);return this},subSelf:function(a){this.set(this.x-a.x,this.y-a.y,this.z-a.z,this.w-a.w);return this},multiplyScalar:function(a){this.set(this.x*
a,this.y*a,this.z*a,this.w*a);return this},divideScalar:function(a){this.set(this.x/a,this.y/a,this.z/a,this.w/a);return this},lerpSelf:function(a,b){this.set(this.x+(a.x-this.x)*b,this.y+(a.y-this.y)*b,this.z+(a.z-this.z)*b,this.w+(a.w-this.w)*b)},clone:function(){return new THREE.Vector4(this.x,this.y,this.z,this.w)}};THREE.Ray=function(a,b){this.origin=a||new THREE.Vector3;this.direction=b||new THREE.Vector3};
THREE.Ray.prototype={intersectScene:function(a){var b,c,d=a.objects,e=[];a=0;for(b=d.length;a<b;a++){c=d[a];c instanceof THREE.Mesh&&(e=e.concat(this.intersectObject(c)))}e.sort(function(f,g){return f.distance-g.distance});return e},intersectObject:function(a){function b(p,k,D,z){z=z.clone().subSelf(k);D=D.clone().subSelf(k);var G=p.clone().subSelf(k);p=z.dot(z);k=z.dot(D);z=z.dot(G);var H=D.dot(D);D=D.dot(G);G=1/(p*H-k*k);H=(H*z-k*D)*G;p=(p*D-k*z)*G;return H>0&&p>0&&H+p<1}var c,d,e,f,g,i,h,j,n,m,
l,o=a.geometry,q=o.vertices,r=[];c=0;for(d=o.faces.length;c<d;c++){e=o.faces[c];m=this.origin.clone();l=this.direction.clone();h=a.matrixWorld;f=h.multiplyVector3(q[e.a].position.clone());g=h.multiplyVector3(q[e.b].position.clone());i=h.multiplyVector3(q[e.c].position.clone());h=e instanceof THREE.Face4?h.multiplyVector3(q[e.d].position.clone()):null;j=a.matrixRotationWorld.multiplyVector3(e.normal.clone());n=l.dot(j);if(n<0){j=j.dot((new THREE.Vector3).sub(f,m))/n;m=m.addSelf(l.multiplyScalar(j));
if(e instanceof THREE.Face3){if(b(m,f,g,i)){e={distance:this.origin.distanceTo(m),point:m,face:e,object:a};r.push(e)}}else if(e instanceof THREE.Face4&&(b(m,f,g,h)||b(m,g,i,h))){e={distance:this.origin.distanceTo(m),point:m,face:e,object:a};r.push(e)}}}return r}};
THREE.Rectangle=function(){function a(){f=d-b;g=e-c}var b,c,d,e,f,g,i=!0;this.getX=function(){return b};this.getY=function(){return c};this.getWidth=function(){return f};this.getHeight=function(){return g};this.getLeft=function(){return b};this.getTop=function(){return c};this.getRight=function(){return d};this.getBottom=function(){return e};this.set=function(h,j,n,m){i=!1;b=h;c=j;d=n;e=m;a()};this.addPoint=function(h,j){if(i){i=!1;b=h;c=j;d=h;e=j}else{b=b<h?b:h;c=c<j?c:j;d=d>h?d:h;e=e>j?e:j}a()};
this.add3Points=function(h,j,n,m,l,o){if(i){i=!1;b=h<n?h<l?h:l:n<l?n:l;c=j<m?j<o?j:o:m<o?m:o;d=h>n?h>l?h:l:n>l?n:l;e=j>m?j>o?j:o:m>o?m:o}else{b=h<n?h<l?h<b?h:b:l<b?l:b:n<l?n<b?n:b:l<b?l:b;c=j<m?j<o?j<c?j:c:o<c?o:c:m<o?m<c?m:c:o<c?o:c;d=h>n?h>l?h>d?h:d:l>d?l:d:n>l?n>d?n:d:l>d?l:d;e=j>m?j>o?j>e?j:e:o>e?o:e:m>o?m>e?m:e:o>e?o:e}a()};this.addRectangle=function(h){if(i){i=!1;b=h.getLeft();c=h.getTop();d=h.getRight();e=h.getBottom()}else{b=b<h.getLeft()?b:h.getLeft();c=c<h.getTop()?c:h.getTop();d=d>h.getRight()?
d:h.getRight();e=e>h.getBottom()?e:h.getBottom()}a()};this.inflate=function(h){b-=h;c-=h;d+=h;e+=h;a()};this.minSelf=function(h){b=b>h.getLeft()?b:h.getLeft();c=c>h.getTop()?c:h.getTop();d=d<h.getRight()?d:h.getRight();e=e<h.getBottom()?e:h.getBottom();a()};this.instersects=function(h){return Math.min(d,h.getRight())-Math.max(b,h.getLeft())>=0&&Math.min(e,h.getBottom())-Math.max(c,h.getTop())>=0};this.empty=function(){i=!0;e=d=c=b=0;a()};this.isEmpty=function(){return i}};
THREE.Matrix3=function(){this.m=[]};THREE.Matrix3.prototype={transpose:function(){var a,b=this.m;a=b[1];b[1]=b[3];b[3]=a;a=b[2];b[2]=b[6];b[6]=a;a=b[5];b[5]=b[7];b[7]=a;return this},transposeIntoArray:function(a){var b=this.m;a[0]=b[0];a[1]=b[3];a[2]=b[6];a[3]=b[1];a[4]=b[4];a[5]=b[7];a[6]=b[2];a[7]=b[5];a[8]=b[8];return this}};
THREE.Matrix4=function(a,b,c,d,e,f,g,i,h,j,n,m,l,o,q,r){this.set(a||1,b||0,c||0,d||0,e||0,f||1,g||0,i||0,h||0,j||0,n||1,m||0,l||0,o||0,q||0,r||1);this.flat=Array(16);this.m33=new THREE.Matrix3};
THREE.Matrix4.prototype={set:function(a,b,c,d,e,f,g,i,h,j,n,m,l,o,q,r){this.n11=a;this.n12=b;this.n13=c;this.n14=d;this.n21=e;this.n22=f;this.n23=g;this.n24=i;this.n31=h;this.n32=j;this.n33=n;this.n34=m;this.n41=l;this.n42=o;this.n43=q;this.n44=r;return this},identity:function(){this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1);return this},copy:function(a){this.set(a.n11,a.n12,a.n13,a.n14,a.n21,a.n22,a.n23,a.n24,a.n31,a.n32,a.n33,a.n34,a.n41,a.n42,a.n43,a.n44);return this},lookAt:function(a,b,c){var d=THREE.Matrix4.__v1,
e=THREE.Matrix4.__v2,f=THREE.Matrix4.__v3;f.sub(a,b).normalize();d.cross(c,f).normalize();e.cross(f,d).normalize();this.n11=d.x;this.n12=e.x;this.n13=f.x;this.n21=d.y;this.n22=e.y;this.n23=f.y;this.n31=d.z;this.n32=e.z;this.n33=f.z;return this},multiplyVector3:function(a){var b=a.x,c=a.y,d=a.z,e=1/(this.n41*b+this.n42*c+this.n43*d+this.n44);a.x=(this.n11*b+this.n12*c+this.n13*d+this.n14)*e;a.y=(this.n21*b+this.n22*c+this.n23*d+this.n24)*e;a.z=(this.n31*b+this.n32*c+this.n33*d+this.n34)*e;return a},
multiplyVector3OnlyZ:function(a){var b=a.x,c=a.y;a=a.z;return(this.n31*b+this.n32*c+this.n33*a+this.n34)*(1/(this.n41*b+this.n42*c+this.n43*a+this.n44))},multiplyVector4:function(a){var b=a.x,c=a.y,d=a.z,e=a.w;a.x=this.n11*b+this.n12*c+this.n13*d+this.n14*e;a.y=this.n21*b+this.n22*c+this.n23*d+this.n24*e;a.z=this.n31*b+this.n32*c+this.n33*d+this.n34*e;a.w=this.n41*b+this.n42*c+this.n43*d+this.n44*e;return a},rotateAxis:function(a){var b=a.x,c=a.y,d=a.z;a.x=b*this.n11+c*this.n12+d*this.n13;a.y=b*this.n21+
c*this.n22+d*this.n23;a.z=b*this.n31+c*this.n32+d*this.n33;a.normalize();return a},crossVector:function(a){var b=new THREE.Vector4;b.x=this.n11*a.x+this.n12*a.y+this.n13*a.z+this.n14*a.w;b.y=this.n21*a.x+this.n22*a.y+this.n23*a.z+this.n24*a.w;b.z=this.n31*a.x+this.n32*a.y+this.n33*a.z+this.n34*a.w;b.w=a.w?this.n41*a.x+this.n42*a.y+this.n43*a.z+this.n44*a.w:1;return b},multiply:function(a,b){var c=a.n11,d=a.n12,e=a.n13,f=a.n14,g=a.n21,i=a.n22,h=a.n23,j=a.n24,n=a.n31,m=a.n32,l=a.n33,o=a.n34,q=a.n41,
r=a.n42,p=a.n43,k=a.n44,D=b.n11,z=b.n12,G=b.n13,H=b.n14,M=b.n21,x=b.n22,v=b.n23,E=b.n24,B=b.n31,F=b.n32,A=b.n33,w=b.n34;this.n11=c*D+d*M+e*B;this.n12=c*z+d*x+e*F;this.n13=c*G+d*v+e*A;this.n14=c*H+d*E+e*w+f;this.n21=g*D+i*M+h*B;this.n22=g*z+i*x+h*F;this.n23=g*G+i*v+h*A;this.n24=g*H+i*E+h*w+j;this.n31=n*D+m*M+l*B;this.n32=n*z+m*x+l*F;this.n33=n*G+m*v+l*A;this.n34=n*H+m*E+l*w+o;this.n41=q*D+r*M+p*B;this.n42=q*z+r*x+p*F;this.n43=q*G+r*v+p*A;this.n44=q*H+r*E+p*w+k;return this},multiplyToArray:function(a,
b,c){this.multiply(a,b);c[0]=this.n11;c[1]=this.n21;c[2]=this.n31;c[3]=this.n41;c[4]=this.n12;c[5]=this.n22;c[6]=this.n32;c[7]=this.n42;c[8]=this.n13;c[9]=this.n23;c[10]=this.n33;c[11]=this.n43;c[12]=this.n14;c[13]=this.n24;c[14]=this.n34;c[15]=this.n44;return this},multiplySelf:function(a){this.multiply(this,a);return this},multiplyScalar:function(a){this.n11*=a;this.n12*=a;this.n13*=a;this.n14*=a;this.n21*=a;this.n22*=a;this.n23*=a;this.n24*=a;this.n31*=a;this.n32*=a;this.n33*=a;this.n34*=a;this.n41*=
a;this.n42*=a;this.n43*=a;this.n44*=a;return this},determinant:function(){var a=this.n11,b=this.n12,c=this.n13,d=this.n14,e=this.n21,f=this.n22,g=this.n23,i=this.n24,h=this.n31,j=this.n32,n=this.n33,m=this.n34,l=this.n41,o=this.n42,q=this.n43,r=this.n44;return d*g*j*l-c*i*j*l-d*f*n*l+b*i*n*l+c*f*m*l-b*g*m*l-d*g*h*o+c*i*h*o+d*e*n*o-a*i*n*o-c*e*m*o+a*g*m*o+d*f*h*q-b*i*h*q-d*e*j*q+a*i*j*q+b*e*m*q-a*f*m*q-c*f*h*r+b*g*h*r+c*e*j*r-a*g*j*r-b*e*n*r+a*f*n*r},transpose:function(){var a;a=this.n21;this.n21=
this.n12;this.n12=a;a=this.n31;this.n31=this.n13;this.n13=a;a=this.n32;this.n32=this.n23;this.n23=a;a=this.n41;this.n41=this.n14;this.n14=a;a=this.n42;this.n42=this.n24;this.n24=a;a=this.n43;this.n43=this.n34;this.n43=a;return this},clone:function(){var a=new THREE.Matrix4;a.n11=this.n11;a.n12=this.n12;a.n13=this.n13;a.n14=this.n14;a.n21=this.n21;a.n22=this.n22;a.n23=this.n23;a.n24=this.n24;a.n31=this.n31;a.n32=this.n32;a.n33=this.n33;a.n34=this.n34;a.n41=this.n41;a.n42=this.n42;a.n43=this.n43;a.n44=
this.n44;return a},flatten:function(){this.flat[0]=this.n11;this.flat[1]=this.n21;this.flat[2]=this.n31;this.flat[3]=this.n41;this.flat[4]=this.n12;this.flat[5]=this.n22;this.flat[6]=this.n32;this.flat[7]=this.n42;this.flat[8]=this.n13;this.flat[9]=this.n23;this.flat[10]=this.n33;this.flat[11]=this.n43;this.flat[12]=this.n14;this.flat[13]=this.n24;this.flat[14]=this.n34;this.flat[15]=this.n44;return this.flat},flattenToArray:function(a){a[0]=this.n11;a[1]=this.n21;a[2]=this.n31;a[3]=this.n41;a[4]=
this.n12;a[5]=this.n22;a[6]=this.n32;a[7]=this.n42;a[8]=this.n13;a[9]=this.n23;a[10]=this.n33;a[11]=this.n43;a[12]=this.n14;a[13]=this.n24;a[14]=this.n34;a[15]=this.n44;return a},flattenToArrayOffset:function(a,b){a[b]=this.n11;a[b+1]=this.n21;a[b+2]=this.n31;a[b+3]=this.n41;a[b+4]=this.n12;a[b+5]=this.n22;a[b+6]=this.n32;a[b+7]=this.n42;a[b+8]=this.n13;a[b+9]=this.n23;a[b+10]=this.n33;a[b+11]=this.n43;a[b+12]=this.n14;a[b+13]=this.n24;a[b+14]=this.n34;a[b+15]=this.n44;return a},setTranslation:function(a,
b,c){this.set(1,0,0,a,0,1,0,b,0,0,1,c,0,0,0,1);return this},setScale:function(a,b,c){this.set(a,0,0,0,0,b,0,0,0,0,c,0,0,0,0,1);return this},setRotationX:function(a){var b=Math.cos(a);a=Math.sin(a);this.set(1,0,0,0,0,b,-a,0,0,a,b,0,0,0,0,1);return this},setRotationY:function(a){var b=Math.cos(a);a=Math.sin(a);this.set(b,0,a,0,0,1,0,0,-a,0,b,0,0,0,0,1);return this},setRotationZ:function(a){var b=Math.cos(a);a=Math.sin(a);this.set(b,-a,0,0,a,b,0,0,0,0,1,0,0,0,0,1);return this},setRotationAxis:function(a,
b){var c=Math.cos(b),d=Math.sin(b),e=1-c,f=a.x,g=a.y,i=a.z,h=e*f,j=e*g;this.set(h*f+c,h*g-d*i,h*i+d*g,0,h*g+d*i,j*g+c,j*i-d*f,0,h*i-d*g,j*i+d*f,e*i*i+c,0,0,0,0,1);return this},setPosition:function(a){this.n14=a.x;this.n24=a.y;this.n34=a.z;return this},setRotationFromEuler:function(a){var b=a.x,c=a.y,d=a.z;a=Math.cos(b);b=Math.sin(b);var e=Math.cos(c);c=Math.sin(c);var f=Math.cos(d);d=Math.sin(d);var g=a*c,i=b*c;this.n11=e*f;this.n12=-e*d;this.n13=c;this.n21=i*f+a*d;this.n22=-i*d+a*f;this.n23=-b*e;
this.n31=-g*f+b*d;this.n32=g*d+b*f;this.n33=a*e;return this},setRotationFromQuaternion:function(a){var b=a.x,c=a.y,d=a.z,e=a.w,f=b+b,g=c+c,i=d+d;a=b*f;var h=b*g;b*=i;var j=c*g;c*=i;d*=i;f*=e;g*=e;e*=i;this.n11=1-(j+d);this.n12=h-e;this.n13=b+g;this.n21=h+e;this.n22=1-(a+d);this.n23=c-f;this.n31=b-g;this.n32=c+f;this.n33=1-(a+j);return this},scale:function(a){var b=a.x,c=a.y;a=a.z;this.n11*=b;this.n12*=c;this.n13*=a;this.n21*=b;this.n22*=c;this.n23*=a;this.n31*=b;this.n32*=c;this.n33*=a;this.n41*=
b;this.n42*=c;this.n43*=a;return this},extractPosition:function(a){this.n14=a.n14;this.n24=a.n24;this.n34=a.n34},extractRotation:function(a,b){var c=1/b.x,d=1/b.y,e=1/b.z;this.n11=a.n11*c;this.n21=a.n21*c;this.n31=a.n31*c;this.n12=a.n12*d;this.n22=a.n22*d;this.n32=a.n32*d;this.n13=a.n13*e;this.n23=a.n23*e;this.n33=a.n33*e}};
THREE.Matrix4.makeInvert=function(a,b){var c=a.n11,d=a.n12,e=a.n13,f=a.n14,g=a.n21,i=a.n22,h=a.n23,j=a.n24,n=a.n31,m=a.n32,l=a.n33,o=a.n34,q=a.n41,r=a.n42,p=a.n43,k=a.n44;b===undefined&&(b=new THREE.Matrix4);b.n11=h*o*r-j*l*r+j*m*p-i*o*p-h*m*k+i*l*k;b.n12=f*l*r-e*o*r-f*m*p+d*o*p+e*m*k-d*l*k;b.n13=e*j*r-f*h*r+f*i*p-d*j*p-e*i*k+d*h*k;b.n14=f*h*m-e*j*m-f*i*l+d*j*l+e*i*o-d*h*o;b.n21=j*l*q-h*o*q-j*n*p+g*o*p+h*n*k-g*l*k;b.n22=e*o*q-f*l*q+f*n*p-c*o*p-e*n*k+c*l*k;b.n23=f*h*q-e*j*q-f*g*p+c*j*p+e*g*k-c*h*k;
b.n24=e*j*n-f*h*n+f*g*l-c*j*l-e*g*o+c*h*o;b.n31=i*o*q-j*m*q+j*n*r-g*o*r-i*n*k+g*m*k;b.n32=f*m*q-d*o*q-f*n*r+c*o*r+d*n*k-c*m*k;b.n33=e*j*q-f*i*q+f*g*r-c*j*r-d*g*k+c*i*k;b.n34=f*i*n-d*j*n-f*g*m+c*j*m+d*g*o-c*i*o;b.n41=h*m*q-i*l*q-h*n*r+g*l*r+i*n*p-g*m*p;b.n42=d*l*q-e*m*q+e*n*r-c*l*r-d*n*p+c*m*p;b.n43=e*i*q-d*h*q-e*g*r+c*h*r+d*g*p-c*i*p;b.n44=d*h*n-e*i*n+e*g*m-c*h*m-d*g*l+c*i*l;b.multiplyScalar(1/a.determinant());return b};
THREE.Matrix4.makeInvert3x3=function(a){var b=a.m33,c=b.m,d=a.n33*a.n22-a.n32*a.n23,e=-a.n33*a.n21+a.n31*a.n23,f=a.n32*a.n21-a.n31*a.n22,g=-a.n33*a.n12+a.n32*a.n13,i=a.n33*a.n11-a.n31*a.n13,h=-a.n32*a.n11+a.n31*a.n12,j=a.n23*a.n12-a.n22*a.n13,n=-a.n23*a.n11+a.n21*a.n13,m=a.n22*a.n11-a.n21*a.n12;a=a.n11*d+a.n21*g+a.n31*j;if(a==0)throw"matrix not invertible";a=1/a;c[0]=a*d;c[1]=a*e;c[2]=a*f;c[3]=a*g;c[4]=a*i;c[5]=a*h;c[6]=a*j;c[7]=a*n;c[8]=a*m;return b};
THREE.Matrix4.makeFrustum=function(a,b,c,d,e,f){var g;g=new THREE.Matrix4;g.n11=2*e/(b-a);g.n12=0;g.n13=(b+a)/(b-a);g.n14=0;g.n21=0;g.n22=2*e/(d-c);g.n23=(d+c)/(d-c);g.n24=0;g.n31=0;g.n32=0;g.n33=-(f+e)/(f-e);g.n34=-2*f*e/(f-e);g.n41=0;g.n42=0;g.n43=-1;g.n44=0;return g};THREE.Matrix4.makePerspective=function(a,b,c,d){var e;a=c*Math.tan(a*Math.PI/360);e=-a;return THREE.Matrix4.makeFrustum(e*b,a*b,e,a,c,d)};
THREE.Matrix4.makeOrtho=function(a,b,c,d,e,f){var g,i,h,j;g=new THREE.Matrix4;i=b-a;h=c-d;j=f-e;g.n11=2/i;g.n12=0;g.n13=0;g.n14=-((b+a)/i);g.n21=0;g.n22=2/h;g.n23=0;g.n24=-((c+d)/h);g.n31=0;g.n32=0;g.n33=-2/j;g.n34=-((f+e)/j);g.n41=0;g.n42=0;g.n43=0;g.n44=1;return g};THREE.Matrix4.__v1=new THREE.Vector3;THREE.Matrix4.__v2=new THREE.Vector3;THREE.Matrix4.__v3=new THREE.Vector3;
THREE.Object3D=function(){this.parent=undefined;this.children=[];this.up=new THREE.Vector3(0,1,0);this.position=new THREE.Vector3;this.rotation=new THREE.Vector3;this.scale=new THREE.Vector3(1,1,1);this.rotationAutoUpdate=!0;this.matrix=new THREE.Matrix4;this.matrixWorld=new THREE.Matrix4;this.matrixRotationWorld=new THREE.Matrix4;this.matrixAutoUpdate=!0;this.matrixWorldNeedsUpdate=!0;this.quaternion=new THREE.Quaternion;this.useQuaternion=!1;this.boundRadius=0;this.boundRadiusScale=1;this.visible=
!0;this._vector=new THREE.Vector3};
THREE.Object3D.prototype={translate:function(a,b){this.matrix.rotateAxis(b);this.position.addSelf(b.multiplyScalar(a))},translateX:function(a){this.translate(a,this._vector.set(1,0,0))},translateY:function(a){this.translate(a,this._vector.set(0,1,0))},translateZ:function(a){this.translate(a,this._vector.set(0,0,1))},lookAt:function(a){this.matrix.lookAt(this.position,a,this.up);this.rotationAutoUpdate&&this.rotation.setRotationFromMatrix(this.matrix)},addChild:function(a){if(this.children.indexOf(a)===-1){a.parent!==
undefined&&a.parent.removeChild(a);a.parent=this;this.children.push(a);for(var b=this;b instanceof THREE.Scene===!1&&b!==undefined;)b=b.parent;b!==undefined&&b.addChildRecurse(a)}},removeChild:function(a){var b=this.children.indexOf(a);if(b!==-1){a.parent=undefined;this.children.splice(b,1)}},updateMatrix:function(){this.matrix.setPosition(this.position);this.useQuaternion?this.matrix.setRotationFromQuaternion(this.quaternion):this.matrix.setRotationFromEuler(this.rotation);if(this.scale.x!==1||this.scale.y!==
1||this.scale.z!==1){this.matrix.scale(this.scale);this.boundRadiusScale=Math.max(this.scale.x,Math.max(this.scale.y,this.scale.z))}return!0},update:function(a,b,c){if(this.visible){this.matrixAutoUpdate&&(b|=this.updateMatrix());if(b||this.matrixWorldNeedsUpdate){a?this.matrixWorld.multiply(a,this.matrix):this.matrixWorld.copy(this.matrix);this.matrixRotationWorld.extractRotation(this.matrixWorld,this.scale);this.matrixWorldNeedsUpdate=!1;b=!0}a=0;for(var d=this.children.length;a<d;a++)this.children[a].update(this.matrixWorld,
b,c)}}};THREE.Quaternion=function(a,b,c,d){this.set(a||0,b||0,c||0,d!==undefined?d:1)};
THREE.Quaternion.prototype={set:function(a,b,c,d){this.x=a;this.y=b;this.z=c;this.w=d;return this},setFromEuler:function(a){var b=0.5*Math.PI/360,c=a.x*b,d=a.y*b,e=a.z*b;a=Math.cos(d);d=Math.sin(d);b=Math.cos(-e);e=Math.sin(-e);var f=Math.cos(c);c=Math.sin(c);var g=a*b,i=d*e;this.w=g*f-i*c;this.x=g*c+i*f;this.y=d*b*f+a*e*c;this.z=a*e*f-d*b*c;return this},calculateW:function(){this.w=-Math.sqrt(Math.abs(1-this.x*this.x-this.y*this.y-this.z*this.z));return this},inverse:function(){this.x*=-1;this.y*=
-1;this.z*=-1;return this},length:function(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)},normalize:function(){var a=Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w);if(a==0)this.w=this.z=this.y=this.x=0;else{a=1/a;this.x*=a;this.y*=a;this.z*=a;this.w*=a}return this},multiplySelf:function(a){var b=this.x,c=this.y,d=this.z,e=this.w,f=a.x,g=a.y,i=a.z;a=a.w;this.x=b*a+e*f+c*i-d*g;this.y=c*a+e*g+d*f-b*i;this.z=d*a+e*i+b*g-c*f;this.w=e*a-b*f-c*g-d*i;return this},
multiplyVector3:function(a,b){b||(b=a);var c=a.x,d=a.y,e=a.z,f=this.x,g=this.y,i=this.z,h=this.w,j=h*c+g*e-i*d,n=h*d+i*c-f*e,m=h*e+f*d-g*c;c=-f*c-g*d-i*e;b.x=j*h+c*-f+n*-i-m*-g;b.y=n*h+c*-g+m*-f-j*-i;b.z=m*h+c*-i+j*-g-n*-f;return b}};
THREE.Quaternion.slerp=function(a,b,c,d){var e=a.w*b.w+a.x*b.x+a.y*b.y+a.z*b.z;if(Math.abs(e)>=1){c.w=a.w;c.x=a.x;c.y=a.y;c.z=a.z;return c}var f=Math.acos(e),g=Math.sqrt(1-e*e);if(Math.abs(g)<0.001){c.w=0.5*(a.w+b.w);c.x=0.5*(a.x+b.x);c.y=0.5*(a.y+b.y);c.z=0.5*(a.z+b.z);return c}e=Math.sin((1-d)*f)/g;d=Math.sin(d*f)/g;c.w=a.w*e+b.w*d;c.x=a.x*e+b.x*d;c.y=a.y*e+b.y*d;c.z=a.z*e+b.z*d;return c};
THREE.Vertex=function(a,b){this.position=a||new THREE.Vector3;this.positionWorld=new THREE.Vector3;this.positionScreen=new THREE.Vector4;this.normal=b||new THREE.Vector3;this.normalWorld=new THREE.Vector3;this.normalScreen=new THREE.Vector3;this.tangent=new THREE.Vector4;this.__visible=!0};
THREE.Face3=function(a,b,c,d,e){this.a=a;this.b=b;this.c=c;this.centroid=new THREE.Vector3;this.normal=d instanceof THREE.Vector3?d:new THREE.Vector3;this.vertexNormals=d instanceof Array?d:[];this.materials=e instanceof Array?e:[e]};THREE.Face4=function(a,b,c,d,e,f){this.a=a;this.b=b;this.c=c;this.d=d;this.centroid=new THREE.Vector3;this.normal=e instanceof THREE.Vector3?e:new THREE.Vector3;this.vertexNormals=e instanceof Array?e:[];this.materials=f instanceof Array?f:[f]};
THREE.UV=function(a,b){this.set(a||0,b||0)};THREE.UV.prototype={set:function(a,b){this.u=a;this.v=b;return this},copy:function(a){this.set(a.u,a.v);return this}};THREE.Camera=function(a,b,c,d,e){THREE.Object3D.call(this);this.fov=a||50;this.aspect=b||1;this.near=c||0.1;this.far=d||2E3;this.target=e||new THREE.Object3D;this.useTarget=!0;this.matrixWorldInverse=new THREE.Matrix4;this.projectionMatrix=null;this.updateProjectionMatrix()};THREE.Camera.prototype=new THREE.Object3D;
THREE.Camera.prototype.constructor=THREE.Camera;THREE.Camera.prototype.supr=THREE.Object3D.prototype;THREE.Camera.prototype.translate=function(a,b){this.matrix.rotateAxis(b);this.position.addSelf(b.multiplyScalar(a));this.target.position.addSelf(b.multiplyScalar(a))};THREE.Camera.prototype.updateProjectionMatrix=function(){this.projectionMatrix=THREE.Matrix4.makePerspective(this.fov,this.aspect,this.near,this.far)};
THREE.Camera.prototype.update=function(a,b,c){if(this.useTarget){this.matrix.lookAt(this.position,this.target.position,this.up);this.matrix.setPosition(this.position);a?this.matrixWorld.multiply(a,this.matrix):this.matrixWorld.copy(this.matrix);THREE.Matrix4.makeInvert(this.matrixWorld,this.matrixWorldInverse);b=!0}else{this.matrixAutoUpdate&&(b|=this.updateMatrix());if(b||this.matrixWorldNeedsUpdate){a?this.matrixWorld.multiply(a,this.matrix):this.matrixWorld.copy(this.matrix);this.matrixWorldNeedsUpdate=
!1;b=!0;THREE.Matrix4.makeInvert(this.matrixWorld,this.matrixWorldInverse)}}for(a=0;a<this.children.length;a++)this.children[a].update(this.matrixWorld,b,c)};THREE.ParticleDOMMaterial=function(a){this.id=THREE.MaterialCounter.value++;this.domElement=a};THREE.Particle=function(a){THREE.Object3D.call(this);this.materials=a instanceof Array?a:[a];this.matrixAutoUpdate=!1};THREE.Particle.prototype=new THREE.Object3D;THREE.Particle.prototype.constructor=THREE.Particle;
THREE.Bone=function(a){THREE.Object3D.call(this);this.skin=a;this.skinMatrix=new THREE.Matrix4;this.hasNoneBoneChildren=!1};THREE.Bone.prototype=new THREE.Object3D;THREE.Bone.prototype.constructor=THREE.Bone;THREE.Bone.prototype.supr=THREE.Object3D.prototype;
THREE.Bone.prototype.update=function(a,b,c){this.matrixAutoUpdate&&(b|=this.updateMatrix());if(b||this.matrixWorldNeedsUpdate){a?this.skinMatrix.multiply(a,this.matrix):this.skinMatrix.copy(this.matrix);this.matrixWorldNeedsUpdate=!1;b=!0}var d,e=this.children.length;if(this.hasNoneBoneChildren){this.matrixWorld.multiply(this.skin.matrixWorld,this.skinMatrix);for(d=0;d<e;d++){a=this.children[d];a instanceof THREE.Bone?a.update(this.skinMatrix,b,c):a.update(this.matrixWorld,!0,c)}}else for(d=0;d<e;d++)this.children[d].update(this.skinMatrix,
b,c)};THREE.Bone.prototype.addChild=function(a){if(this.children.indexOf(a)===-1){a.parent!==undefined&&a.parent.removeChild(a);a.parent=this;this.children.push(a);if(!(a instanceof THREE.Bone))this.hasNoneBoneChildren=!0}};
THREE.Sound=function(a,b,c,d){THREE.Object3D.call(this);this.isLoaded=!1;this.isAddedToDOM=!1;this.isPlaying=!1;this.duration=-1;this.radius=b!==undefined?Math.abs(b):100;this.volume=Math.min(1,Math.max(0,c!==undefined?c:1));this.domElement=document.createElement("audio");this.domElement.volume=0;this.domElement.pan=0;this.domElement.loop=d!==undefined?d:!0;this.sources=a instanceof Array?a:[a];var e;c=this.sources.length;for(a=0;a<c;a++){b=this.sources[a];b.toLowerCase();if(b.indexOf(".mp3")!==-1)e=
"audio/mpeg";else if(b.indexOf(".ogg")!==-1)e="audio/ogg";else b.indexOf(".wav")!==-1&&(e="audio/wav");if(this.domElement.canPlayType(e)){e=document.createElement("source");e.src=this.sources[a];this.domElement.THREESound=this;this.domElement.appendChild(e);this.domElement.addEventListener("canplay",this.onLoad,!0);this.domElement.load();break}}};THREE.Sound.prototype=new THREE.Object3D;THREE.Sound.prototype.constructor=THREE.Sound;THREE.Sound.prototype.supr=THREE.Object3D.prototype;
THREE.Sound.prototype.onLoad=function(){var a=this.THREESound;if(!a.isLoaded){this.removeEventListener("canplay",this.onLoad,!0);a.isLoaded=!0;a.duration=this.duration;a.isPlaying&&a.play()}};THREE.Sound.prototype.addToDOM=function(a){this.isAddedToDOM=!0;a.appendChild(this.domElement)};THREE.Sound.prototype.play=function(a){this.isPlaying=!0;if(this.isLoaded){this.domElement.play();if(a)this.domElement.currentTime=a%this.duration}};THREE.Sound.prototype.pause=function(){this.isPlaying=!1;this.domElement.pause()};
THREE.Sound.prototype.stop=function(){this.isPlaying=!1;this.domElement.pause();this.domElement.currentTime=0};THREE.Sound.prototype.calculateVolumeAndPan=function(a){a=a.length();this.domElement.volume=a<=this.radius?this.volume*(1-a/this.radius):0};
THREE.Sound.prototype.update=function(a,b,c){if(this.matrixAutoUpdate){this.matrix.setPosition(this.position);b=!0}if(b||this.matrixWorldNeedsUpdate){a?this.matrixWorld.multiply(a,this.matrix):this.matrixWorld.copy(this.matrix);this.matrixWorldNeedsUpdate=!1;b=!0}var d=this.children.length;for(a=0;a<d;a++)this.children[a].update(this.matrixWorld,b,c)};
THREE.Scene=function(){THREE.Object3D.call(this);this.matrixAutoUpdate=!1;this.fog=null;this.objects=[];this.lights=[];this.sounds=[];this.__objectsAdded=[];this.__objectsRemoved=[]};THREE.Scene.prototype=new THREE.Object3D;THREE.Scene.prototype.constructor=THREE.Scene;THREE.Scene.prototype.supr=THREE.Object3D.prototype;THREE.Scene.prototype.addChild=function(a){this.supr.addChild.call(this,a);this.addChildRecurse(a)};
THREE.Scene.prototype.addChildRecurse=function(a){if(a instanceof THREE.Light)this.lights.indexOf(a)===-1&&this.lights.push(a);else if(a instanceof THREE.Sound)this.sounds.indexOf(a)===-1&&this.sounds.push(a);else if(!(a instanceof THREE.Camera||a instanceof THREE.Bone)&&this.objects.indexOf(a)===-1){this.objects.push(a);this.__objectsAdded.push(a)}for(var b=0;b<a.children.length;b++)this.addChildRecurse(a.children[b])};
THREE.Scene.prototype.removeChild=function(a){this.supr.removeChild.call(this,a);this.removeChildRecurse(a)};THREE.Scene.prototype.removeChildRecurse=function(a){if(a instanceof THREE.Light){var b=this.lights.indexOf(a);b!==-1&&this.lights.splice(b,1)}else if(a instanceof THREE.Sound){b=this.sounds.indexOf(a);b!==-1&&this.sounds.splice(b,1)}else if(!(a instanceof THREE.Camera)){b=this.objects.indexOf(a);if(b!==-1){this.objects.splice(b,1);this.__objectsRemoved.push(a)}}for(b=0;b<a.children.length;b++)this.removeChildRecurse(a.children[b])};
THREE.Scene.prototype.addObject=THREE.Scene.prototype.addChild;THREE.Scene.prototype.removeObject=THREE.Scene.prototype.removeChild;THREE.Scene.prototype.addLight=THREE.Scene.prototype.addChild;THREE.Scene.prototype.removeLight=THREE.Scene.prototype.removeChild;
THREE.Projector=function(){function a(x,v){return v.z-x.z}function b(x,v){var E=0,B=1,F=x.z+x.w,A=v.z+v.w,w=-x.z+x.w,t=-v.z+v.w;if(F>=0&&A>=0&&w>=0&&t>=0)return!0;else if(F<0&&A<0||w<0&&t<0)return!1;else{if(F<0)E=Math.max(E,F/(F-A));else A<0&&(B=Math.min(B,F/(F-A)));if(w<0)E=Math.max(E,w/(w-t));else t<0&&(B=Math.min(B,w/(w-t)));if(B<E)return!1;else{x.lerpSelf(v,E);v.lerpSelf(x,1-B);return!0}}}var c,d,e=[],f,g,i,h=[],j,n,m=[],l,o,q=[],r=new THREE.Vector4,p=new THREE.Vector4,k=new THREE.Matrix4,D=new THREE.Matrix4,
z=[new THREE.Vector4,new THREE.Vector4,new THREE.Vector4,new THREE.Vector4,new THREE.Vector4,new THREE.Vector4],G=new THREE.Vector4,H=new THREE.Vector4,M;this.projectObjects=function(x,v,E){v=[];var B,F,A;d=0;F=x.objects;x=0;for(B=F.length;x<B;x++){A=F[x];var w;if(!(w=!A.visible))if(w=A instanceof THREE.Mesh){a:{w=void 0;for(var t=A.matrixWorld,N=-A.geometry.boundingSphere.radius*Math.max(A.scale.x,Math.max(A.scale.y,A.scale.z)),s=0;s<6;s++){w=z[s].x*t.n14+z[s].y*t.n24+z[s].z*t.n34+z[s].w;if(w<=N){w=
!1;break a}}w=!0}w=!w}if(!w){c=e[d]=e[d]||new THREE.RenderableObject;r.copy(A.position);k.multiplyVector3(r);c.object=A;c.z=r.z;v.push(c);d++}}E&&v.sort(a);return v};this.projectScene=function(x,v,E){var B=[],F=v.near,A=v.far,w,t,N,s,C,L,u,P,Q,R,S,O,J,y,I,K;i=n=o=0;v.matrixAutoUpdate&&v.update();k.multiply(v.projectionMatrix,v.matrixWorldInverse);z[0].set(k.n41-k.n11,k.n42-k.n12,k.n43-k.n13,k.n44-k.n14);z[1].set(k.n41+k.n11,k.n42+k.n12,k.n43+k.n13,k.n44+k.n14);z[2].set(k.n41+k.n21,k.n42+k.n22,k.n43+
k.n23,k.n44+k.n24);z[3].set(k.n41-k.n21,k.n42-k.n22,k.n43-k.n23,k.n44-k.n24);z[4].set(k.n41-k.n31,k.n42-k.n32,k.n43-k.n33,k.n44-k.n34);z[5].set(k.n41+k.n31,k.n42+k.n32,k.n43+k.n33,k.n44+k.n34);for(w=0;w<6;w++){L=z[w];L.divideScalar(Math.sqrt(L.x*L.x+L.y*L.y+L.z*L.z))}x.update(undefined,!1,v);L=this.projectObjects(x,v,!0);x=0;for(w=L.length;x<w;x++){u=L[x].object;if(u.visible){P=u.matrixWorld;S=u.matrixRotationWorld;Q=u.materials;R=u.overdraw;if(u instanceof THREE.Mesh){O=u.geometry;J=O.vertices;t=
0;for(N=J.length;t<N;t++){y=J[t];y.positionWorld.copy(y.position);P.multiplyVector3(y.positionWorld);s=y.positionScreen;s.copy(y.positionWorld);k.multiplyVector4(s);s.x/=s.w;s.y/=s.w;y.__visible=s.z>F&&s.z<A}O=O.faces;t=0;for(N=O.length;t<N;t++){y=O[t];if(y instanceof THREE.Face3){s=J[y.a];C=J[y.b];I=J[y.c];if(s.__visible&&C.__visible&&I.__visible&&(u.doubleSided||u.flipSided!=(I.positionScreen.x-s.positionScreen.x)*(C.positionScreen.y-s.positionScreen.y)-(I.positionScreen.y-s.positionScreen.y)*(C.positionScreen.x-
s.positionScreen.x)<0)){f=h[i]=h[i]||new THREE.RenderableFace3;f.v1.positionWorld.copy(s.positionWorld);f.v2.positionWorld.copy(C.positionWorld);f.v3.positionWorld.copy(I.positionWorld);f.v1.positionScreen.copy(s.positionScreen);f.v2.positionScreen.copy(C.positionScreen);f.v3.positionScreen.copy(I.positionScreen);f.normalWorld.copy(y.normal);S.multiplyVector3(f.normalWorld);f.centroidWorld.copy(y.centroid);P.multiplyVector3(f.centroidWorld);f.centroidScreen.copy(f.centroidWorld);k.multiplyVector3(f.centroidScreen);
I=y.vertexNormals;M=f.vertexNormalsWorld;s=0;for(C=I.length;s<C;s++){K=M[s]=M[s]||new THREE.Vector3;K.copy(I[s]);S.multiplyVector3(K)}f.z=f.centroidScreen.z;f.meshMaterials=Q;f.faceMaterials=y.materials;f.overdraw=R;if(u.geometry.uvs[t]){f.uvs[0]=u.geometry.uvs[t][0];f.uvs[1]=u.geometry.uvs[t][1];f.uvs[2]=u.geometry.uvs[t][2]}B.push(f);i++}}else if(y instanceof THREE.Face4){s=J[y.a];C=J[y.b];I=J[y.c];K=J[y.d];if(s.__visible&&C.__visible&&I.__visible&&K.__visible&&(u.doubleSided||u.flipSided!=((K.positionScreen.x-
s.positionScreen.x)*(C.positionScreen.y-s.positionScreen.y)-(K.positionScreen.y-s.positionScreen.y)*(C.positionScreen.x-s.positionScreen.x)<0||(C.positionScreen.x-I.positionScreen.x)*(K.positionScreen.y-I.positionScreen.y)-(C.positionScreen.y-I.positionScreen.y)*(K.positionScreen.x-I.positionScreen.x)<0))){f=h[i]=h[i]||new THREE.RenderableFace3;f.v1.positionWorld.copy(s.positionWorld);f.v2.positionWorld.copy(C.positionWorld);f.v3.positionWorld.copy(K.positionWorld);f.v1.positionScreen.copy(s.positionScreen);
f.v2.positionScreen.copy(C.positionScreen);f.v3.positionScreen.copy(K.positionScreen);f.normalWorld.copy(y.normal);S.multiplyVector3(f.normalWorld);f.centroidWorld.copy(y.centroid);P.multiplyVector3(f.centroidWorld);f.centroidScreen.copy(f.centroidWorld);k.multiplyVector3(f.centroidScreen);f.z=f.centroidScreen.z;f.meshMaterials=Q;f.faceMaterials=y.materials;f.overdraw=R;if(u.geometry.uvs[t]){f.uvs[0]=u.geometry.uvs[t][0];f.uvs[1]=u.geometry.uvs[t][1];f.uvs[2]=u.geometry.uvs[t][3]}B.push(f);i++;g=
h[i]=h[i]||new THREE.RenderableFace3;g.v1.positionWorld.copy(C.positionWorld);g.v2.positionWorld.copy(I.positionWorld);g.v3.positionWorld.copy(K.positionWorld);g.v1.positionScreen.copy(C.positionScreen);g.v2.positionScreen.copy(I.positionScreen);g.v3.positionScreen.copy(K.positionScreen);g.normalWorld.copy(f.normalWorld);g.centroidWorld.copy(f.centroidWorld);g.centroidScreen.copy(f.centroidScreen);g.z=g.centroidScreen.z;g.meshMaterials=Q;g.faceMaterials=y.materials;g.overdraw=R;if(u.geometry.uvs[t]){g.uvs[0]=
u.geometry.uvs[t][1];g.uvs[1]=u.geometry.uvs[t][2];g.uvs[2]=u.geometry.uvs[t][3]}B.push(g);i++}}}}else if(u instanceof THREE.Line){D.multiply(k,P);J=u.geometry.vertices;y=J[0];y.positionScreen.copy(y.position);D.multiplyVector4(y.positionScreen);t=1;for(N=J.length;t<N;t++){s=J[t];s.positionScreen.copy(s.position);D.multiplyVector4(s.positionScreen);C=J[t-1];G.copy(s.positionScreen);H.copy(C.positionScreen);if(b(G,H)){G.multiplyScalar(1/G.w);H.multiplyScalar(1/H.w);j=m[n]=m[n]||new THREE.RenderableLine;
j.v1.positionScreen.copy(G);j.v2.positionScreen.copy(H);j.z=Math.max(G.z,H.z);j.materials=u.materials;B.push(j);n++}}}else if(u instanceof THREE.Particle){p.set(u.position.x,u.position.y,u.position.z,1);k.multiplyVector4(p);p.z/=p.w;if(p.z>0&&p.z<1){l=q[o]=q[o]||new THREE.RenderableParticle;l.x=p.x/p.w;l.y=p.y/p.w;l.z=p.z;l.rotation=u.rotation.z;l.scale.x=u.scale.x*Math.abs(l.x-(p.x+v.projectionMatrix.n11)/(p.w+v.projectionMatrix.n14));l.scale.y=u.scale.y*Math.abs(l.y-(p.y+v.projectionMatrix.n22)/
(p.w+v.projectionMatrix.n24));l.materials=u.materials;B.push(l);o++}}}}E&&B.sort(a);return B};this.unprojectVector=function(x,v){var E=v.matrixWorld.clone();E.multiplySelf(THREE.Matrix4.makeInvert(v.projectionMatrix));E.multiplyVector3(x);return x}};
THREE.DOMRenderer=function(){THREE.Renderer.call(this);var a=null,b=new THREE.Projector,c,d,e,f;this.domElement=document.createElement("div");this.setSize=function(g,i){c=g;d=i;e=c/2;f=d/2};this.render=function(g,i){var h,j,n,m,l,o,q,r;a=b.projectScene(g,i);h=0;for(j=a.length;h<j;h++){l=a[h];if(l instanceof THREE.RenderableParticle){q=l.x*e+e;r=l.y*f+f;n=0;for(m=l.material.length;n<m;n++){o=l.material[n];if(o instanceof THREE.ParticleDOMMaterial){o=o.domElement;o.style.left=q+"px";o.style.top=r+"px"}}}}}};
THREE.SoundRenderer=function(){this.volume=1;this.domElement=document.createElement("div");this.domElement.id="THREESound";this.cameraPosition=new THREE.Vector3;this.soundPosition=new THREE.Vector3;this.render=function(a,b,c){c&&a.update(undefined,!1,b);c=a.sounds;var d,e=c.length;for(d=0;d<e;d++){a=c[d];this.soundPosition.set(a.matrixWorld.n14,a.matrixWorld.n24,a.matrixWorld.n34);this.soundPosition.subSelf(b.position);if(a.isPlaying&&a.isLoaded){a.isAddedToDOM||a.addToDOM(this.domElement);a.calculateVolumeAndPan(this.soundPosition)}}}};
THREE.RenderableParticle=function(){this.rotation=this.z=this.y=this.x=null;this.scale=new THREE.Vector2;this.materials=null};
