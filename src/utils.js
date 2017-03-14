function arrayMin( array ) {

	if ( array.length === 0 ) {

		return Infinity;

	}

	var min = array[ 0 ];

	for ( var i = 1; i < array.length; ++ i ) {

		if ( array[ i ] < min ) {

			min = array[ i ];

		}

	}

	return min;

}

function arrayMax( array ) {

	if ( array.length === 0 ) {

		return - Infinity;

	}

	var max = array[ 0 ];

	for ( var i = 1; i < array.length; ++ i ) {

		if ( array[ i ] > max ) {

			max = array[ i ];

		}

	}

	return max;

}

export { arrayMin, arrayMax };
