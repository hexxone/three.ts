import { Material, Object3D } from "../../";

/**
 * @public
 */
class ImmediateRenderObject extends Object3D {
	render: (...args) => void;

	hasPositions: boolean;
	hasNormals: boolean;
	hasColors: boolean;
	hasUvs: boolean;
	positionArray: any;
	normalArray: any;
	colorArray: any;
	uvArray: any;

	constructor(material: Material) {
		super();

		this.material = material;
		this.render = function (/* renderCallback */) {};

		this.hasPositions = false;
		this.hasNormals = false;
		this.hasColors = false;
		this.hasUvs = false;

		this.positionArray = null;
		this.normalArray = null;
		this.colorArray = null;
		this.uvArray = null;

		this.count = 0;
	}
}

export { ImmediateRenderObject };
