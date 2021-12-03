import {
	BufferAttribute,
	Color,
	Mesh,
	MeshBasicMaterial,
	Object3D,
	OctahedronGeometry,
	Vector3,
} from "../";

const _vector = /* @__PURE__*/ new Vector3();
const _color1 = /* @__PURE__*/ new Color(0);
const _color2 = /* @__PURE__*/ new Color(0);

class HemisphereLightHelper extends Object3D {
	light: any;
	color: any;

	constructor(light, size, color) {
		super();
		this.light = light;
		this.light.updateMatrixWorld();

		this.matrix = light.matrixWorld;
		this.matrixAutoUpdate = false;

		this.color = color;

		const geometry = new OctahedronGeometry(size);
		geometry.rotateY(Math.PI * 0.5);

		this.material = new MeshBasicMaterial();
		this.material.wireframe = true;
		this.material.fog = false;
		this.material.toneMapped = false;

		if (this.color === undefined) this.material.vertexColors = true;

		const position = geometry.getAttribute("position");
		const colors = new Float32Array(position.count * 3);

		geometry.setAttribute("color", new BufferAttribute(colors, 3));

		this.add(new Mesh(geometry, this.material));

		this.update();
	}

	dispose() {
		this.children[0].geometry.dispose();
		this.children[0].material.dispose();
	}

	update() {
		const mesh = this.children[0];

		if (this.color !== undefined) {
			this.material.color.set(this.color);
		} else {
			const colors = mesh.geometry.getAttribute("color");

			_color1.copy(this.light.color);
			_color2.copy(this.light.groundColor);

			for (let i = 0, l = colors.count; i < l; i++) {
				const color = i < l / 2 ? _color1 : _color2;

				colors.setXYZ(i, color.r, color.g, color.b);
			}

			colors.needsUpdate = true;
		}

		mesh.lookAt(_vector.setFromMatrixPosition(this.light.matrixWorld).negate());
	}
}

export { HemisphereLightHelper };
