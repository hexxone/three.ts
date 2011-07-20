/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 * Creates extruded geometry form path.
 **/

THREE.ExtrudeGeometry = function( shape, options ) {

	var amount = options.amount !== undefined ? options.amount : 100;

	// todo: bevel
	var bevelThickness = options.bevelThickness !== undefined ? options.bevelThickness : 4; // 10
	var bevelSize = options.bevelSize !== undefined ? options.bevelSize : 6; // 8 
	var bevelEnabled = options.bevelEnabled !== undefined ? options.bevelEnabled : false;
	var bevelSegments = 4;

	var steps = options.steps !== undefined ? options.steps : 1;
	var extrudePath = options.path !== undefined ? options.path : null;

	var extrudePts, extrudeByPath = false;

	if ( extrudePath ) {

		extrudePts = extrudePath.getPoints();
		steps = extrudePts.length;
		extrudeByPath = true;

	}
	
	bevelEnabled = true;

	// TODO, extrude by path's tangents? also via 3d path?

	THREE.Geometry.call( this );

	
	// Variables initalization
	var ahole, h, hl; // looping of holes
	var scope = this;
	var bevelPoints = [];


	// getPoints
	var shapePoints = shape.extractAllPoints(true);
	// getPoints | getSpacedPoints() you can get variable divisions by dividing by total length
	
    var vertices = shapePoints.shape; 
	var holes =  shapePoints.holes;
	

	var reverse = THREE.FontUtils.Triangulate.area( vertices ) > 0 ;


	if (reverse) {

		vertices = vertices.reverse();
		
		// Maybe we should also check if holes are in the opposite direction...
		
		for (h = 0, hl = holes.length;  h < hl; h++ ) {
			
			ahole = holes[h];
			if (THREE.FontUtils.Triangulate.area(ahole) < 0 ) {
				
				holes[h] = ahole.reverse();
				
			}
		}
		
		reverse = false; // If vertices are in order now, we shouldn't need to worry about them again (hopefully)!
	}
	
	
	
	//var faces = THREE.Shape.Utils.triangulateShape(vertices, holes);
    
	var faces = THREE.Shape.Utils.triangulate2(vertices, holes);


	//console.log(faces);
	
	////
	///   Handle Vertices
	////
	
	var contour = vertices; // vertices has all points but contour has only points of circumference
	
	for (h = 0, hl = holes.length;  h < hl; h++ ) {

		ahole = holes[h];

		vertices = vertices.concat(ahole);

	}
	
	console.log("same?", contour.length == vertices.length);
	
	


	var i,
		vert, vlen = vertices.length,
		face, flen = faces.length,
		cont, clen = contour.length,
		hol, hlen;
		
	var	bevelPt, blen = bevelPoints.length;
	
	// Back facing vertices

	for ( i = 0; i < vlen; i++ ) {

		vert = vertices[ i ];
		v( vert.x, vert.y, 0 );

	}

	// Add steped vertices...
	
	// Including front facing vertices

	var s = 1;
	for ( ; s <= steps; s++ ) {

		for ( i = 0; i < vlen; i ++ ) {

			vert = vertices[ i ];

			if ( !extrudeByPath ) {

				v( vert.x, vert.y, amount/steps * s );

			} else {

				v( vert.x, vert.y + extrudePts[ s - 1 ].y, extrudePts[ s - 1 ].x );

			}

		}

	}
	
	
	// Add bevel planes
	
	// Loop bevelSegments, 1 for the front, 1 for the back
	
	var b;
	
	// Find all centroids of shapes and holes
	var sum = new THREE.Vector2();
	var contourCentroid, holesCentroids;
	
	for (i=0, il = contour.length; i<il; i++) {
		sum.addSelf(contour[i]);
	}
	
	contourCentroid = sum.divideScalar( contour.length ) ;
	
	holesCentroids = [];
	
	
	for (h=0, hl = holes.length; h<hl; h++) {
		sum = new THREE.Vector2();
		ahole = holes[h];
		
		for (i=0, il = ahole.length; i<il; i++) {
			sum.addSelf(ahole[i]);
		}
		
		holesCentroids[h] = sum.divideScalar( ahole.length ) ;
		
	}
	
	function scalePt (pt, centroid, size, expandOutwards /* Boolean */ ) {
		vectorFromCentroid = pt.clone().subSelf( centroid );
		adj = size / vectorFromCentroid.length();

		if ( expandOutwards ) {

			adj += 1;

		}  else {

			adj = 1 - adj;

		}

		return vectorFromCentroid.multiplyScalar( adj ).addSelf( centroid );
	}
	
	var bs;
	
	for (b=bevelSegments; b > 0; b--) {
		//   z
		// ****
		t =  b / bevelSegments;
		z = bevelThickness * t;
		bs = bevelSize * (1-Math.sin ((1-t) * Math.PI/2 )); //bevelSize * t ;
		

		//bs = Math.sqrt(- (t* t) - 2 * t * bevelThickness);
		
		// contract shape
		for ( i = 0, il = contour.length; i < il; i++ ) {
			
			vert = scalePt(contour[i], contourCentroid, bs , false);
			v( vert.x, vert.y,  -z);
			
		}
		
		// expand holes
		for ( h = 0, hl = holes.length; h < hl; h++ ) {
			
			ahole = holes[h];
			for ( i = 0, il = ahole.length; i < il; i++ ) {
				vert = scalePt(ahole[i], holesCentroids[h] , bs , true);	
				v( vert.x, vert.y,  -z);
			}
			
		}
		
	}
	
	for (b=1; b <= bevelSegments; b++) {
		
			t =  b / bevelSegments;
			z = bevelThickness * t;
			bs = bevelSize * (1-Math.sin ((1-t) * Math.PI/2 )); 
			
			// contract shape
			for ( i = 0, il = contour.length; i < il; i++ ) {

				vert = scalePt(contour[i], contourCentroid, bs , false);
				v( vert.x, vert.y,  amount + z);

			}

			// expand holes
			for ( h = 0, hl = holes.length; h < hl; h++ ) {

				ahole = holes[h];
				for ( i = 0, il = ahole.length; i < il; i++ ) {
						vert = scalePt(ahole[i], holesCentroids[h] , bs , true);
					v( vert.x, vert.y,  amount + z);
				}

			}
		
	}
	



	
	////
	///   Handle Faces
	////
	

	// Bottom faces
	if ( bevelEnabled ) {
		
		
		var layer = steps + 1;
		var offset = vlen * layer;
		
		for ( i = 0; i < flen; i++ ) {

			face = faces[ i ];
			f3( face[ 2 ]+ offset, face[ 1 ]+ offset, face[ 0 ] + offset);

		}

		layer = bevelSegments* 2;
		offset = vlen * layer;
		
		// Top faces
		var layers = (steps + bevelSegments * 2)  * vlen; 
		for ( i = 0; i < flen; i++ ) {

			face = faces[ i ];
			f3( face[ 0 ] + offset, face[ 1 ] + offset, face[ 2 ] + offset );

		}

	} else {

		for ( i = 0; i < flen; i++ ) {

			face = faces[ i ];
			f3( face[ 2 ], face[ 1 ], face[ 0 ] );

		}

		// Top faces
		var layers = (steps + bevelSegments * 2)  * vlen; 
		for ( i = 0; i < flen; i++ ) {

			face = faces[ i ];
			f3( face[ 0 ] + vlen* steps, face[ 1 ] + vlen * steps, face[ 2 ] + vlen * steps );

		}
	}

	var tmpPt;
	var j, k, l, m;

	var layeroffset = 0;
	
	// Sides faces
	
	sidewalls(contour);
	layeroffset += contour.length;
	
	for (h = 0, hl = holes.length;  h < hl; h++ ) {
		ahole = holes[h];
		sidewalls(ahole); 
		//, true
		layeroffset += ahole.length;
	}
	
	function sidewalls(contour) {
	
		i = contour.length;

		while ( --i >= 0 ) {

			tmpPt = contour[ i ];

			j = i;
		
			k = i - 1;

			//TOREMOVE

			if ( k < 0 ) k = contour.length - 1;

			//console.log('b', i,j, i-1, k,vertices.length);

			// Create faces for the z-sides of the text

			//f4( j, k, k + vlen, j + vlen );

	
			var s = 0;

			for ( ; s < (steps + bevelSegments* 2) ; s++ ) {

				var slen1 = vlen * s;
				var slen2 = vlen * ( s + 1 );

				f4( layeroffset + j + slen1, layeroffset + k + slen1, layeroffset + k + slen2, layeroffset + j + slen2 );
				

			}

			//

		}
	}
	
	// UVs to be added

	this.computeCentroids();
	this.computeFaceNormals();
	//this.computeVertexNormals();

	function v( x, y, z ) {

		scope.vertices.push( new THREE.Vertex( new THREE.Vector3( x, y, z ) ) );

	}

	function f3( a, b, c ) {

		// if ( reverse ) { // Can now be removed
		// 
		// 		scope.faces.push( new THREE.Face3( c, b, a ) );
		// 
		// 	} else {
		// 
		 		scope.faces.push( new THREE.Face3( a, b, c ) );
		// 
		// 	}

	}

	function f4( a, b, c, d ) {

		// if ( reverse ) {
		// 
		// 		scope.faces.push( new THREE.Face4( d, c, b, a ) );
		// 
		// 	} else {
		// 
		 		scope.faces.push( new THREE.Face4( a, b, c, d ) );
		// 
		// 	}

	}

};


THREE.ExtrudeGeometry.prototype = new THREE.Geometry();
THREE.ExtrudeGeometry.prototype.constructor = THREE.ExtrudeGeometry;
