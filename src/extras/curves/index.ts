
export * from "./ArcCurve";
export * from "./CatmullRomCurve3";
export * from "./CubicBezierCurve";
export * from "./CubicBezierCurve3";
export * from "./EllipseCurve";
export * from "./LineCurve";
export * from "./LineCurve3";
export * from "./QuadraticBezierCurve";
export * from "./QuadraticBezierCurve3";
export * from "./SplineCurve";

import { ArcCurve } from "./ArcCurve";
import { CatmullRomCurve3 } from "./CatmullRomCurve3";
import { CubicBezierCurve } from "./CubicBezierCurve";
import { CubicBezierCurve3 } from "./CubicBezierCurve3";
import { EllipseCurve } from "./EllipseCurve";
import { LineCurve } from "./LineCurve";
import { LineCurve3 } from "./LineCurve3";
import { QuadraticBezierCurve } from "./QuadraticBezierCurve";
import { QuadraticBezierCurve3 } from "./QuadraticBezierCurve3";
import { SplineCurve } from "./SplineCurve";

const Curves = {
	"ArcCurve": ArcCurve,
	"CatmullRomCurve3": CatmullRomCurve3,
	"CubicBezierCurve": CubicBezierCurve,
	"CubicBezierCurve3": CubicBezierCurve3,
	"EllipseCurve": EllipseCurve,
	"LineCurve": LineCurve,
	"LineCurve3": LineCurve3,
	"QuadraticBezierCurve": QuadraticBezierCurve,
	"QuadraticBezierCurve3": QuadraticBezierCurve3,
	"SplineCurve": SplineCurve,
};

export { Curves };
