/**
 * Bezier Curves formulas obtained from
 * http://en.wikipedia.org/wiki/Bézier_curve
 */

function catmullRom( t, p0, p1, p2, p3 ) {
	const v0 = ( p2 - p0 ) * 0.5;
	const v1 = ( p3 - p1 ) * 0.5;
	const t2 = t * t;
	const t3 = t * t2;
	return ( 2 * p1 - 2 * p2 + v0 + v1 ) * t3 + ( - 3 * p1 + 3 * p2 - 2 * v0 - v1 ) * t2 + v0 * t + p1;
}

//

function quadraticBezierP0( t, p ) {
	const k = 1 - t;
	return k * k * p;
}

function quadraticBezierP1( t, p ) {
	return 2 * ( 1 - t ) * t * p;
}

function quadraticBezierP2( t, p ) {
	return t * t * p;
}

function quadraticBezier( t, p0, p1, p2 ) {
	return quadraticBezierP0( t, p0 ) + quadraticBezierP1( t, p1 ) +
		quadraticBezierP2( t, p2 );
}

//

function cubicBezierP0( t, p ) {
	const k = 1 - t;
	return k * k * k * p;
}

function cubicBezierP1( t, p ) {
	const k = 1 - t;
	return 3 * k * k * t * p;
}

function cubicBezierP2( t, p ) {
	return 3 * ( 1 - t ) * t * t * p;
}

function cubicBezierP3( t, p ) {
	return t * t * t * p;
}

function cubicBezier( t, p0, p1, p2, p3 ) {
	return cubicBezierP0( t, p0 ) +
		cubicBezierP1( t, p1 ) +
		cubicBezierP2( t, p2 ) +
		cubicBezierP3( t, p3 );
}

export { catmullRom, quadraticBezier, cubicBezier };
