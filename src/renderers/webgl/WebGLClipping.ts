import { Camera, Material, Matrix3, Plane } from '../../';
import { WebGLProperties } from './WebGLProperties';

class WebGLClipping {
	_properties: WebGLProperties;

	globalState = null;
	numGlobalPlanes = 0;
	localClippingEnabled = false;
	renderingShadows = false;

	plane = new Plane();
	viewNormalMatrix = new Matrix3();

	uniform = { value: null, needsUpdate: false };

	numPlanes = 0;
	numIntersection = 0;

	constructor( properties: WebGLProperties ) {
		this._properties = properties;
	}

	init( planes: Plane[], enableLocalClipping: boolean, camera: Camera ): boolean {
		const enabled =
			planes.length !== 0 ||
			enableLocalClipping ||
			// enable state of previous frame - the clipping code has to
			// run another frame in order to reset the state:
			this.numGlobalPlanes !== 0 ||
			this.localClippingEnabled;

		this.localClippingEnabled = enableLocalClipping;

		this.globalState = this.projectPlanes( planes, camera, 0 );
		this.numGlobalPlanes = planes.length;

		return enabled;
	}

	beginShadows() {
		this.renderingShadows = true;
		this.projectPlanes( null );
	}

	endShadows() {
		this.renderingShadows = false;
		this.resetGlobalState();
	}

	setState( material: Material, camera: Camera, useCache: boolean ) {
		const planes = material.clippingPlanes;
		const clipIntersection = material.clipIntersection;
		const clipShadows = material.clipShadows;

		const materialProperties = this._properties.get( material );

		if ( ! this.localClippingEnabled || planes === null || planes.length === 0 || this.renderingShadows && ! clipShadows ) {
			// there's no local clipping

			if ( this.renderingShadows ) {
				// there's no global clipping

				this.projectPlanes( null );
			} else {
				this.resetGlobalState();
			}
		} else {
			const nGlobal = this.renderingShadows ? 0 : this.numGlobalPlanes;
			const lGlobal = nGlobal * 4;

			let dstArray = materialProperties.clippingState || null;

			this.uniform.value = dstArray; // ensure unique state

			dstArray = this.projectPlanes( planes, camera, lGlobal, useCache );

			for ( let i = 0; i !== lGlobal; ++ i ) {
				dstArray[ i ] = this.globalState[ i ];
			}

			materialProperties.clippingState = dstArray;
			this.numIntersection = clipIntersection ? this.numPlanes : 0;
			this.numPlanes += nGlobal;
		}
	}

	resetGlobalState() {
		if ( this.uniform.value !== this.globalState ) {
			this.uniform.value = this.globalState;
			this.uniform.needsUpdate = this.numGlobalPlanes > 0;
		}

		this.numPlanes = this.numGlobalPlanes;
		this.numIntersection = 0;
	}

	projectPlanes( planes: Plane[], camera?, dstOffset?, skipTransform? ) {
		const nPlanes = planes !== null ? planes.length : 0;
		let dstArray = null;

		if ( nPlanes !== 0 ) {
			dstArray = this.uniform.value;

			if ( skipTransform !== true || dstArray === null ) {
				const flatSize = dstOffset + nPlanes * 4;
				const viewMatrix = camera.matrixWorldInverse;

				this.viewNormalMatrix.getNormalMatrix( viewMatrix );

				if ( dstArray === null || dstArray.length < flatSize ) {
					dstArray = new Float32Array( flatSize );
				}

				for ( let i = 0, i4 = dstOffset; i !== nPlanes; ++ i, i4 += 4 ) {
					this.plane.copy( planes[ i ] ).applyMatrix4( viewMatrix, this.viewNormalMatrix );

					this.plane.normal.toArray( dstArray, i4 );
					dstArray[ i4 + 3 ] = this.plane.constant;
				}
			}

			this.uniform.value = dstArray;
			this.uniform.needsUpdate = true;
		}

		this.numPlanes = nPlanes;
		this.numIntersection = 0;

		return dstArray;
	}
}

export { WebGLClipping };
