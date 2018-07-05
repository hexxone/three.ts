/**
 * @author sunag / http://www.sunag.com.br/
 */

import { NodeBuilder } from '../core/NodeBuilder.js';
import { ColorNode } from '../inputs/ColorNode.js';
import { PositionNode } from '../accessors/PositionNode.js';
import { RawNode } from './nodes/RawNode.js';
 
function NodeMaterial( vertex, fragment ) {

	THREE.ShaderMaterial.call( this );

	// prevent code share conflict, remove in future
	
	this.defines.UUID = this.uuid;

	this.vertex = vertex || new RawNode( new PositionNode( PositionNode.PROJECTION ) );
	this.fragment = fragment || new RawNode( new ColorNode( 0xFF0000 ) );

	this.updaters = [];

};

NodeMaterial.prototype = Object.create( THREE.ShaderMaterial.prototype );
NodeMaterial.prototype.constructor = NodeMaterial;
NodeMaterial.prototype.type = "NodeMaterial";

NodeMaterial.prototype.isNodeMaterial = true;

Object.defineProperties( NodeMaterial.prototype, {

	properties: {
		
		get: function () {

			return this.fragment.properties;

		}
		
	}

} );

NodeMaterial.prototype.updateFrame = function ( frame ) {

	for ( var i = 0; i < this.updaters.length; ++ i ) {

		frame.updateNode( this.updaters[ i ] );

	}

};

NodeMaterial.prototype.onBeforeCompile = function ( shader, renderer ) {

	if ( this.needsUpdate ) {

		this.build( { dispose: false, renderer: renderer } );

		shader.uniforms = this.uniforms;
		shader.vertexShader = this.vertexShader;
		shader.fragmentShader = this.fragmentShader;

	}

};

NodeMaterial.prototype.build = function ( params ) {

	params = params || {};
	params.dispose = params.dispose !== undefined ? params.dispose : true;

	var builder = new NodeBuilder().setMaterial( this, params.renderer );
	
	builder.build( this.vertex, this.fragment );
	
	this.vertexShader = builder.getCode('vertex');
	this.fragmentShader = builder.getCode('fragment');
	
	this.defines = builder.defines;
	this.uniforms = builder.uniforms;
	this.extensions = builder.extensions;
	this.nodes = builder.nodes;
	this.updaters = builder.updaters;
	
	this.fog = builder.requires.fog;
	this.lights = builder.requires.lights;

	this.transparent = builder.requires.transparent || this.blending > THREE.NormalBlending;

	if ( params.dispose ) {

		// force update

		this.dispose();

	}

	return this;

};

NodeMaterial.prototype.copy = function ( source ) {
	
	var uuid = this.uuid;
	
	for (var name in source) {
		
		this[name] = source[name];
		
	}
	
	this.uuid = uuid;
	
	if ( source.userData !== undefined) {
		
		this.userData = JSON.parse( JSON.stringify( source.userData ) );
		
	}
	
};

NodeMaterial.prototype.toJSON = function ( meta ) {

	var isRootObject = ( meta === undefined || typeof meta === 'string' );

	if ( isRootObject ) {

		meta = {
			nodes: {}
		};

	}

	if ( meta && ! meta.materials ) meta.materials = {};

	if ( ! meta.materials[ this.uuid ] ) {

		var data = {};

		data.uuid = this.uuid;
		data.type = this.type;

		meta.materials[ data.uuid ] = data;

		if ( this.name !== "" ) data.name = this.name;

		if ( this.size !== undefined ) data.size = this.size;
		if ( this.sizeAttenuation !== undefined ) data.sizeAttenuation = this.sizeAttenuation;

		if ( this.blending !== THREE.NormalBlending ) data.blending = this.blending;
		if ( this.flatShading === true ) data.flatShading = this.flatShading;
		if ( this.side !== THREE.FrontSide ) data.side = this.side;
		if ( this.vertexColors !== THREE.NoColors ) data.vertexColors = this.vertexColors;

		if ( this.depthFunc !== THREE.LessEqualDepth ) data.depthFunc = this.depthFunc;
		if ( this.depthTest === false ) data.depthTest = this.depthTest;
		if ( this.depthWrite === false ) data.depthWrite = this.depthWrite;

		if ( this.linewidth !== 1 ) data.linewidth = this.linewidth;
		if ( this.dashSize !== undefined ) data.dashSize = this.dashSize;
		if ( this.gapSize !== undefined ) data.gapSize = this.gapSize;
		if ( this.scale !== undefined ) data.scale = this.scale;

		if ( this.dithering === true ) data.dithering = true;
		
		if ( this.wireframe === true ) data.wireframe = this.wireframe;
		if ( this.wireframeLinewidth > 1 ) data.wireframeLinewidth = this.wireframeLinewidth;
		if ( this.wireframeLinecap !== 'round' ) data.wireframeLinecap = this.wireframeLinecap;
		if ( this.wireframeLinejoin !== 'round' ) data.wireframeLinejoin = this.wireframeLinejoin;

		if ( this.alphaTest > 0 ) data.alphaTest = this.alphaTest;
		if ( this.premultipliedAlpha === true ) data.premultipliedAlpha = this.premultipliedAlpha;
		
		if ( this.morphTargets === true ) data.morphTargets = true;
		if ( this.skinning === true ) data.skinning = true;

		if ( this.visible === false ) data.visible = false;
		if ( JSON.stringify( this.userData ) !== '{}' ) data.userData = this.userData;

		data.fog = this.fog;
		data.lights = this.lights;
		
		data.vertex = this.vertex.toJSON( meta ).uuid;
		data.fragment = this.fragment.toJSON( meta ).uuid;

	}

	meta.material = this.uuid;

	return meta;

};

export { NodeMaterial };
