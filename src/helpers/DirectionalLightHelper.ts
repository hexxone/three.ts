import { BufferGeometry, Float32BufferAttribute, Line, LineBasicMaterial, Object3D, Vector3 } from '../';

const _v1 = /* @__PURE__*/ new Vector3();
const _v2 = /* @__PURE__*/ new Vector3();
const _v3 = /* @__PURE__*/ new Vector3();

class DirectionalLightHelper extends Object3D {
	light: any;
	color: any;
	lightPlane: Line;
	targetLine: Line;

	constructor( light, size, color ) {
		super();
		this.light = light;
		this.light.updateMatrixWorld();

		this.matrix = light.matrixWorld;
		this.matrixAutoUpdate = false;

		this.color = color;

		if ( size === undefined ) size = 1;

		let geometry = new BufferGeometry();
		geometry.setAttribute( 'position', new Float32BufferAttribute( [
			- size, size, 0,
			size, size, 0,
			size, - size, 0,
			- size, - size, 0,
			- size, size, 0,
		], 3 ) );

		const material = new LineBasicMaterial();
		material.fog = false;
		material.toneMapped = false;

		this.lightPlane = new Line( geometry, material );
		this.add( this.lightPlane );

		geometry = new BufferGeometry();
		geometry.setAttribute( 'position', new Float32BufferAttribute( [0, 0, 0, 0, 0, 1], 3 ) );

		this.targetLine = new Line( geometry, material );
		this.add( this.targetLine );

		this.update();
	}

	dispose() {
		this.lightPlane.geometry.dispose();
		this.lightPlane.material.dispose();
		this.targetLine.geometry.dispose();
		this.targetLine.material.dispose();
	}

	update() {
		_v1.setFromMatrixPosition( this.light.matrixWorld );
		_v2.setFromMatrixPosition( this.light.target.matrixWorld );
		_v3.subVectors( _v2, _v1 );

		this.lightPlane.lookAt( _v2 );

		if ( this.color !== undefined ) {
			this.lightPlane.material.color.set( this.color );
			this.targetLine.material.color.set( this.color );
		} else {
			this.lightPlane.material.color.copy( this.light.color );
			this.targetLine.material.color.copy( this.light.color );
		}

		this.targetLine.lookAt( _v2 );
		this.targetLine.scale.z = _v3.length();
	}
}


export { DirectionalLightHelper };
