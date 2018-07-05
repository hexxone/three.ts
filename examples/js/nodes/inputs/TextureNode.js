/**
 * @author sunag / http://www.sunag.com.br/
 */

import { InputNode } from '../core/InputNode.js';
import { NodeBuilder } from '../core/NodeBuilder.js';
import { UVNode } from '../accessors/UVNode.js';

function TextureNode( value, coord, bias, project ) {

	InputNode.call( this, 'v4', { shared: true } );

	this.value = value;
	this.coord = coord || new UVNode();
	this.bias = bias;
	this.project = project !== undefined ? project : false;

};

TextureNode.prototype = Object.create( InputNode.prototype );
TextureNode.prototype.constructor = TextureNode;
TextureNode.prototype.nodeType = "Texture";

TextureNode.prototype.getTexture = function ( builder, output ) {

	return InputNode.prototype.generate.call( this, builder, output, this.value.uuid, 't' );

};

TextureNode.prototype.generate = function ( builder, output ) {

	if ( output === 'sampler2D' ) {

		return this.getTexture( builder, output );

	}

	var tex = this.getTexture( builder, output );
	var coord = this.coord.build( builder, this.project ? 'v4' : 'v2' );
	var bias = this.bias ? this.bias.build( builder, 'fv1' ) : undefined;

	if ( bias == undefined && builder.context.bias ) {

		bias = new builder.context.bias( this ).build( builder, 'fv1' );

	}

	var method, code;

	if ( this.project ) method = 'texture2DProj';
	else method = bias ? 'tex2DBias' : 'tex2D';

	if ( bias ) code = method + '( ' + tex + ', ' + coord + ', ' + bias + ' )';
	else code = method + '( ' + tex + ', ' + coord + ' )';

	code = builder.getTexelDecodingFunctionFromTexture( code, this.value );

	return builder.format( code, this.type, output );

};

TextureNode.prototype.copy = function ( source ) {
			
	InputNode.prototype.copy.call( this, source );
	
	if ( source.value ) this.value = source.value;

	this.coord = source.coord;

	if ( source.bias ) this.bias = source.bias;
	if ( source.project !== undefined ) this.project = source.project;
	
};

TextureNode.prototype.toJSON = function ( meta ) {

	var data = this.getJSONNode( meta );

	if ( ! data ) {

		data = this.createJSONNode( meta );

		if ( this.value ) data.value = this.value.uuid;

		data.coord = this.coord.toJSON( meta ).uuid;
		data.project = this.project;

		if ( this.bias ) data.bias = this.bias.toJSON( meta ).uuid;

	}

	return data;

};

export { TextureNode };
