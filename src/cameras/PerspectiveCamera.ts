import { DEG2RAD, RAD2DEG } from '../math/MathUtils';
import { Vector4 } from '../math/Vector4';
import { Camera } from './Camera';

export class PerspectiveCamera extends Camera {

    fov: number;
    focus: number;
    aspect: number;

    filmGauge: number;
    filmOffset: number;

    // TODO ???? where used wtf
    viewport: Vector4;

    constructor(fov = 50, aspect = 1, near = 0.1, far = 2000) {
        super();

        this.isPerspectiveCamera = true;
        this.type = 'PerspectiveCamera';

        this.fov = fov;
        this.zoom = 1;

        this.near = near;
        this.far = far;
        this.focus = 10;

        this.aspect = aspect;
        this.view = null;

        this.filmGauge = 35; // width of the film (default in millimeters)
        this.filmOffset = 0; // horizontal film offset (same unit as gauge)

        this.updateProjectionMatrix();
    }

    copy(source: PerspectiveCamera, recursive) {
        super.copy(source, recursive);

        this.fov = source.fov;
        this.zoom = source.zoom;

        this.near = source.near;
        this.far = source.far;
        this.focus = source.focus;

        this.aspect = source.aspect;
        this.view
            = source.view === null ? null : ({
                ...source.view
            });

        this.filmGauge = source.filmGauge;
        this.filmOffset = source.filmOffset;

        return this;
    }

    /**
     * Sets the FOV by focal length in respect to the current .filmGauge.
     *
     * The default film gauge is 35, so that the focal length can be specified for
     * a 35mm (full frame) camera.
     *
     * Values for focal length and film gauge must have the same unit.
     * see {@link http://www.bobatkins.com/photography/technical/field_of_view.html}
     *
     * @param {number} focalLength FOV by local length
     * @returns {void} nothing
     */
    setFocalLength(focalLength) {
        const vExtentSlope = (0.5 * this.getFilmHeight()) / focalLength;

        this.fov = RAD2DEG * 2 * Math.atan(vExtentSlope);
        this.updateProjectionMatrix();
    }


    /**
     * Calculates the focal length from the current .fov and .filmGauge.
     * @returns {number}
     * @returns {void}
     */
    getFocalLength() {
        const vExtentSlope = Math.tan(DEG2RAD * 0.5 * this.fov);

        return (0.5 * this.getFilmHeight()) / vExtentSlope;
    }

    getEffectiveFOV() {
        return (
            RAD2DEG
            * 2
            * Math.atan(Math.tan(DEG2RAD * 0.5 * this.fov) / this.zoom)
        );
    }

    getFilmWidth() {
        // film not completely covered in portrait format (aspect < 1)
        return this.filmGauge * Math.min(this.aspect, 1);
    }

    getFilmHeight() {
        // film not completely covered in landscape format (aspect > 1)
        return this.filmGauge / Math.max(this.aspect, 1);
    }

    /*
     * Sets an offset in a larger frustum. This is useful for multi-window or
     * multi-monitor/multi-machine setups.
     *
     * For example, if you have 3x2 monitors and each monitor is 1920x1080 and
     * the monitors are in grid like this
     *
     *   +---+---+---+
     *   | A | B | C |
     *   +---+---+---+
     *   | D | E | F |
     *   +---+---+---+
     *
     * then for each monitor you would call it like this
     *
     *   const w = 1920;
     *   const h = 1080;
     *   const fullWidth = w * 3;
     *   const fullHeight = h * 2;
     *
     *   --A--
     *   camera.setViewOffset( fullWidth, fullHeight, w * 0, h * 0, w, h );
     *   --B--
     *   camera.setViewOffset( fullWidth, fullHeight, w * 1, h * 0, w, h );
     *   --C--
     *   camera.setViewOffset( fullWidth, fullHeight, w * 2, h * 0, w, h );
     *   --D--
     *   camera.setViewOffset( fullWidth, fullHeight, w * 0, h * 1, w, h );
     *   --E--
     *   camera.setViewOffset( fullWidth, fullHeight, w * 1, h * 1, w, h );
     *   --F--
     *   camera.setViewOffset( fullWidth, fullHeight, w * 2, h * 1, w, h );
     *
     *   Note there is no reason monitors have to be the same size or in a grid.
     */

    setViewOffset(fullWidth, fullHeight, x, y, width, height) {
        this.aspect = fullWidth / fullHeight;

        if (this.view === null) {
            this.view = {
                enabled: true,
                fullWidth: 1,
                fullHeight: 1,
                offsetX: 0,
                offsetY: 0,
                width: 1,
                height: 1
            };
        }

        this.view.enabled = true;
        this.view.fullWidth = fullWidth;
        this.view.fullHeight = fullHeight;
        this.view.offsetX = x;
        this.view.offsetY = y;
        this.view.width = width;
        this.view.height = height;

        this.updateProjectionMatrix();
    }

    clearViewOffset() {
        if (this.view !== null) {
            this.view.enabled = false;
        }

        this.updateProjectionMatrix();
    }

    updateProjectionMatrix() {
        const { near } = this;
        let top = (near * Math.tan(DEG2RAD * 0.5 * this.fov)) / this.zoom;
        let height = 2 * top;
        let width = this.aspect * height;
        let left = -0.5 * width;
        const { view } = this;

        if (this.view !== null && this.view.enabled) {
            const { fullWidth } = view;
            const { fullHeight } = view;

            left += (view.offsetX * width) / fullWidth;
            top -= (view.offsetY * height) / fullHeight;
            width *= view.width / fullWidth;
            height *= view.height / fullHeight;
        }

        const skew = this.filmOffset;

        if (skew !== 0) { left += (near * skew) / this.getFilmWidth(); }

        this.projectionMatrix.makePerspective(
            left,
            left + width,
            top,
            top - height,
            near,
            this.far
        );

        this.projectionMatrixInverse.copy(this.projectionMatrix).invert();
    }

}
