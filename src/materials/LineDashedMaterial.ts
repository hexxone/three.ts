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

import { LineBasicMaterial } from './LineBasicMaterial';

class LineDashedMaterial extends LineBasicMaterial {

    constructor() {
        super();

        this.isLineDashedMaterial = true;
        this.type = 'LineDashedMaterial';

        this.scale = 1;
        this.dashSize = 3;
        this.gapSize = 1;
    }

    copy(source: LineDashedMaterial) {
        super.copy(source);

        this.scale = source.scale;
        this.dashSize = source.dashSize;
        this.gapSize = source.gapSize;

        return this;
    }

}

export { LineDashedMaterial };
