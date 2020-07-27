import {
	SphereBufferGeometry,
	MeshStandardMaterial,
	Mesh,
	Group
} from "../../../build/three.module.js";

class XRHandSpheresModel {

	constructor( controller/*, handedness */ ) {

		this.controller = controller;

	  this.envMap = null;

		this.handMesh = new Group();
		this.controller.add(this.handMesh);

		if ( window.XRHand ) {

			var geometry = new SphereBufferGeometry( 1, 10, 10 );
			var jointMaterial = new MeshStandardMaterial( { color: 0x000000, roughness: 0.2, metalness: 0.8 } );
			var tipMaterial = new MeshStandardMaterial( { color: 0x333333, roughness: 0.2, metalness: 0.8 } );

			const tipIndexes = [
				XRHand.THUMB_PHALANX_TIP,
				XRHand.INDEX_PHALANX_TIP,
				XRHand.MIDDLE_PHALANX_TIP,
				XRHand.RING_PHALANX_TIP,
				XRHand.LITTLE_PHALANX_TIP
			];
			for ( let i = 0; i <= XRHand.LITTLE_PHALANX_TIP; i ++ ) {

				var cube = new Mesh( geometry, tipIndexes.indexOf( i ) !== - 1 ? tipMaterial : jointMaterial );
				cube.castShadow = true;
				this.handMesh.add( cube );

			}

		}

	}

	updateMesh() {

		const defaultRadius = 0.008;
		const objects = this.handMesh.children;

		// XR Joints
		const XRJoints = this.controller.joints;
		for ( var i = 0; i < objects.length; i ++ ) {

			const jointMesh = objects[ i ];
			const XRJoint = XRJoints[ i ];

			if ( XRJoint.visible ) {

				jointMesh.position.copy( XRJoint.position );
				jointMesh.quaternion.copy( XRJoint.quaternion );
				jointMesh.scale.setScalar( XRJoint.jointRadius || defaultRadius );

			}

			jointMesh.visible = XRJoint.visible;

		}

	}

}

export { XRHandSpheresModel };
