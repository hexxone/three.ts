import { ArcCurve, CatmullRomCurve3, CubicBezierCurve, CubicBezierCurve3, EllipseCurve, LineCurve, LineCurve3, QuadraticBezierCurve, QuadraticBezierCurve3, SplineCurve } from "./";

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
