import { SphereGeometry } from '../geometries/SphereGeometry';
import { Light } from '../lights/Light';
import { MeshBasicMaterial } from '../materials/MeshBasicMaterial';
import { Color } from '../math/Color';
import { Mesh } from '../objects/Mesh';

/**
 * @public
 */
class PointLightHelper extends Mesh {

    light: Light;
    color: Color;

    constructor(light: Light, sphereSize, color: Color) {
        const geometry = new SphereGeometry(sphereSize, 4, 2);
        const material = new MeshBasicMaterial();

        material.wireframe = true;
        material.fog = false;
        material.toneMapped = false;

        super(geometry, material);

        this.light = light;
        this.light.updateMatrixWorld();

        this.color = color;

        this.type = 'PointLightHelper';

        this.matrix = this.light.matrixWorld;
        this.matrixAutoUpdate = false;

        this.update();

        /*
    // TODO: delete this comment?
    const distanceGeometry = new IcosahedronBufferGeometry( 1, 2 );
    const distanceMaterial = new MeshBasicMaterial( { color: hexColor, fog: false, wireframe: true, opacity: 0.1, transparent: true } );

    this.lightSphere = new Mesh( bulbGeometry, bulbMaterial );
    this.lightDistance = new Mesh( distanceGeometry, distanceMaterial );

    const d = light.distance;

    if ( d === 0.0 ) {

        this.lightDistance.visible = false;

    } else {

        this.lightDistance.scale.set( d, d, d );

    }

    this.add( this.lightDistance );
    */
    }

    dispose() {
        this.geometry.dispose();
        this.material.dispose();
    }

    update() {
        if (this.color !== undefined) {
            this.material.color.set(this.color);
        } else {
            this.material.color.copy(this.light.color);
        }

        /*
        const d = this.light.distance;

        if ( d === 0.0 ) {

            this.lightDistance.visible = false;

        } else {

            this.lightDistance.visible = true;
            this.lightDistance.scale.set( d, d, d );

        }
        */
    }

}

export { PointLightHelper };
