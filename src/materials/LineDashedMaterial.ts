import { LineBasicMaterial } from './LineBasicMaterial';

/**
 * parameters = {
 *  color: <hex>,
 *  opacity: <float>,
 *
 *  linewidth: <float>,
 *
 *  scale: <float>,
 *  dashSize: <float>,
 *  gapSize: <float>
 * }
 */

class LineDashedMaterial extends LineBasicMaterial {
	constructor(parameters) {
		super(parameters);

		Object.defineProperty(this, 'isLineDashedMaterial', { value: true })

		this.type = 'LineDashedMaterial';

		this.scale = 1;
		this.dashSize = 3;
		this.gapSize = 1;

		this.setValues(parameters);
	}

	copy(source) {
		super.copy(source);

		this.scale = source.scale;
		this.dashSize = source.dashSize;
		this.gapSize = source.gapSize;

		return this;
	}
}

export { LineDashedMaterial };
