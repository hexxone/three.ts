/** ************************************************************
 *    Curved Path - a curve path is simply a array of connected
 *  curves, but retains the api of a curve
 **************************************************************/

import { Vector2 } from '../../math/Vector2';
import { ArcCurve } from '../curves/ArcCurve';
import { CatmullRomCurve3 } from '../curves/CatmullRomCurve3';
import { CubicBezierCurve } from '../curves/CubicBezierCurve';
import { CubicBezierCurve3 } from '../curves/CubicBezierCurve3';
import { EllipseCurve } from '../curves/EllipseCurve';
import { LineCurve } from '../curves/LineCurve';
import { LineCurve3 } from '../curves/LineCurve3';
import { QuadraticBezierCurve } from '../curves/QuadraticBezierCurve';
import { QuadraticBezierCurve3 } from '../curves/QuadraticBezierCurve3';
import { SplineCurve } from '../curves/SplineCurve';
import { Curve } from './Curve';

class CurvePath extends Curve {

    curves: Curve[];
    autoClose: boolean;
    cacheLengths: any;

    constructor() {
        super();

        this.isCurvePath = true;
        this.type = 'CurvePath';

        this.curves = [];
        this.autoClose = false; // Automatically closes the path
    }

    add(curve) {
        this.curves.push(curve);
    }

    closePath() {
        // Add a line curve if start and end of lines are not connected
        const startPoint = this.curves[0].getPoint(0) as Vector2;
        const endPoint = this.curves[this.curves.length - 1].getPoint(
            1
        ) as Vector2;

        if (!startPoint.equals(endPoint)) {
            this.curves.push(new LineCurve(endPoint, startPoint));
        }
    }

    // To get accurate point with reference to
    // entire path distance at time t,
    // following has to be done:

    // 1. Length of each sub path have to be known
    // 2. Locate and identify type of curve
    // 3. Get t for the curve
    // 4. Return curve.getPointAt(t')

    getPoint(t: number) {
        const d = t * this.getLength();
        const curveLengths = this.getCurveLengths();
        let i = 0;

        // To think about boundaries points.

        while (i < curveLengths.length) {
            if (curveLengths[i] >= d) {
                const diff = curveLengths[i] - d;
                const curve = this.curves[i];

                const segmentLength = curve.getLength();
                const u = segmentLength === 0 ? 0 : 1 - diff / segmentLength;

                return curve.getPointAt(u);
            }

            i++;
        }

        return null;

        // loop where sum != 0, sum > d , sum+1 <d
    }

    // We cannot use the default Curve getPoint() with getLength() because in
    // Curve, getLength() depends on getPoint() but in CurvePath
    // getPoint() depends on getLength

    getLength() {
        const lens = this.getCurveLengths();

        return lens[lens.length - 1];
    }

    // cacheLengths must be recalculated.
    updateArcLengths() {
        this.needsUpdate = true;
        this.cacheLengths = null;
        this.getCurveLengths();
    }

    // Compute lengths and cache them
    // We cannot overwrite getLengths() because UtoT mapping uses it.

    getCurveLengths() {
        // We use cache values if curves and cache array are same length

        if (
            this.cacheLengths
            && this.cacheLengths.length === this.curves.length
        ) {
            return this.cacheLengths;
        }

        // Get length of sub-curve
        // Push sums into cached array

        const lengths = [];
        let sums = 0;

        for (let i = 0, l = this.curves.length; i < l; i++) {
            sums += this.curves[i].getLength();
            lengths.push(sums);
        }

        this.cacheLengths = lengths;

        return lengths;
    }

    getSpacedPoints(divisions = 40) {
        const points = [];

        for (let i = 0; i <= divisions; i++) {
            points.push(this.getPoint(i / divisions));
        }

        if (this.autoClose) {
            points.push(points[0]);
        }

        return points;
    }

    getPoints(divisions = 12) {
        const points = [];
        let last;

        for (let i = 0, { curves } = this; i < curves.length; i++) {
            const curve = curves[i];
            const resolution
                = curve && curve.isEllipseCurve
                    ? divisions * 2
                    : curve && (curve.isLineCurve || curve.isLineCurve3)
                        ? 1
                        : curve && curve.isSplineCurve
                            ? divisions * (curve as SplineCurve).points.length
                            : divisions;

            const pts = curve.getPoints(resolution);

            for (let j = 0; j < pts.length; j++) {
                const point = pts[j];

                if (last && last.equals(point)) { continue; } // ensures no consecutive points are duplicates

                points.push(point);
                last = point;
            }
        }

        if (
            this.autoClose
            && points.length > 1
            && !points[points.length - 1].equals(points[0])
        ) {
            points.push(points[0]);
        }

        return points;
    }

    copy(source: CurvePath) {
        super.copy(source);

        this.curves = [];

        for (let i = 0, l = source.curves.length; i < l; i++) {
            const curve = source.curves[i];

            this.curves.push(curve.clone());
        }

        this.autoClose = source.autoClose;

        return this;
    }

    fromJSON(json) {
        super.fromJSON(json);

        this.autoClose = json.autoClose;
        this.curves = [];

        for (let i = 0, l = json.curves.length; i < l; i++) {
            const curve = json.curves[i];

            switch (curve.type) {
                case 'catmullrom':
                    this.curves.push(new CatmullRomCurve3().fromJSON(curve));
                    break;
                case 'cubicbezier':
                    this.curves.push(new CubicBezierCurve().fromJSON(curve));
                    break;
                case 'quadraticbezier':
                    this.curves.push(
                        new QuadraticBezierCurve().fromJSON(curve)
                    );
                    break;
                case 'line':
                    this.curves.push(new LineCurve().fromJSON(curve));
                    break;
                case 'line3':
                    this.curves.push(new LineCurve3().fromJSON(curve));
                    break;
                case 'quadraticbezier3':
                    this.curves.push(
                        new QuadraticBezierCurve3().fromJSON(curve)
                    );
                    break;
                case 'cubicbezier3':
                    this.curves.push(new CubicBezierCurve3().fromJSON(curve));
                    break;
                case 'arc':
                    this.curves.push(new ArcCurve().fromJSON(curve));
                    break;
                case 'ellipse':
                    this.curves.push(new EllipseCurve().fromJSON(curve));
                    break;
                default:
                    console.warn(
                        `CurvePath: Unsupported curve type ${curve.type}`
                    );
            }
        }

        return this;
    }

}

export { CurvePath };
