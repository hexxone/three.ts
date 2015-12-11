/**
 * @author sunag / http://www.sunag.com.br/
 */

THREE.ConstNode = function( name, useDefine ) {

	name = name || THREE.ConstNode.PI;

	var rDeclaration = /^([a-z_0-9]+)\s([a-z_0-9]+)\s?\=(.*?)\;/i;
	var type = 'fv1';

	var match = name.match( rDeclaration );

	if ( match && match.length > 1 ) {

		type = match[ 1 ];
		name = match[ 2 ];

		if ( useDefine ) {

			this.src = '#define ' + name + ' ' + match[ 3 ];

		}
		else {

			this.src = 'const ' + type + ' ' + name + ' = ' + match[ 3 ] + ';';

		}

	}

	this.name = name;

	THREE.TempNode.call( this, type );

};

THREE.ConstNode.prototype = Object.create( THREE.TempNode.prototype );
THREE.ConstNode.prototype.constructor = THREE.ConstNode;

THREE.ConstNode.PI = 'PI';
THREE.ConstNode.PI2 = 'PI2';
THREE.ConstNode.RECIPROCAL_PI = 'RECIPROCAL_PI';
THREE.ConstNode.RECIPROCAL_PI2 = 'RECIPROCAL_PI2';
THREE.ConstNode.LOG2 = 'LOG2';
THREE.ConstNode.EPSILON = 'EPSILON';

THREE.ConstNode.prototype.generate = function( builder, output ) {

	return builder.format( this.name, this.getType( builder ), output );

};
