/**
 * @author aleeper / http://adamleeper.com/
 * @author mrdoob / http://mrdoob.com/
 *
 * Description: A THREE loader for STL ASCII files, as created
 *              by Solidworks and other CAD programs.
 *
 * Limitations: Currently supports ASCII format only
 *
 * Usage:
 *    var loader = new THREE.STLLoader();
 *    loader.addEventListener( 'load', function ( event ) {
 *        var object = event.content;
 *        // Optionally apply some sort of material...
 *        if(material instanceof THREE.Material){
 *            for ( var i = 0; i < object.children.length; i ++ ) {
 *                object.children[ i ].material = material;
 *            }
 *        }
 *        object.updateMatrix(); // Not sure if this is needed.
 *        stl = object;
 *        init();
 *        animate();
 *    } );
 *    loader.load( './models/stl/slotted_disk.stl' );
 *
 */


THREE.STLLoader = function () {

	THREE.EventTarget.call( this );

};

THREE.STLLoader.prototype = {

  constructor: THREE.STLLoader,

  load: function ( url ) {

	  var scope = this;
	  var xhr = new XMLHttpRequest();

		xhr.addEventListener( 'load', function ( event ) {

			scope.dispatchEvent( { type: 'load', content: scope.parse( event.target.responseText ) } );

		}, false );

		xhr.addEventListener( 'progress', function ( event ) {

			scope.dispatchEvent( { type: 'progress', loaded: event.loaded, total: event.total } );

		}, false );

		xhr.addEventListener( 'error', function () {

			scope.dispatchEvent( { type: 'error', message: 'Couldn\'t load URL [' + url + ']' } );

		}, false );

		xhr.open( 'GET', url, true );
		xhr.send( null );

  },

  parse: function ( data ) {

    function face3( a, b, c, normals ) {
      return new THREE.Face3( a, b, c, normals );
    }


  	var group = new THREE.Object3D();
    var geometry = new THREE.Geometry();

	  var pattern, result;

    facet_pattern = /facet([\s\S]*?)endfacet/g;
    while ( ( facet_result = facet_pattern.exec( data ) ) != null ) {
        facet_text = facet_result[0];

        var face_normal = new THREE.Vector3();

        // Find the normal info
        normal_pattern = /normal[\s]+([-+]?[0-9]+\.?[0-9]*([eE][-+]?[0-9]+)?)+[\s]+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)+[\s]+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)+/g;
        while( (normal_result = normal_pattern.exec(facet_text)) != null )
        {
            //console.log(vsprintf("normal: %f %f %f", [+(normal_result[1]), +(normal_result[3]), +(normal_result[5])]));
            var face_normal = new THREE.Vector3( +(normal_result[1]), +(normal_result[3]), +(normal_result[5]) );
            //geometry.normals.push(new THREE.Vector3( +(normal_result[1]), +(normal_result[3]), +(normal_result[5])));
        }

        // Find the vertex info
        vertex_pattern = /vertex[\s]+([-+]?[0-9]+\.?[0-9]*([eE][-+]?[0-9]+)?)+[\s]+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)+[\s]+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)+/g;
        while( (vertex_result = vertex_pattern.exec(facet_text)) != null )
        {
            //console.log(vsprintf("vertex: %f %f %f", [+(vertex_result[1]), +(vertex_result[3]), +(vertex_result[5])]));
            geometry.vertices.push(new THREE.Vector3(+(vertex_result[1]), +(vertex_result[3]), +(vertex_result[5])));
        }

        var len = geometry.vertices.length;
        geometry.faces.push( face3(len-3, len-2, len-1, face_normal) );

    }
    geometry.computeCentroids();
    group.add( new THREE.Mesh( geometry, new THREE.MeshLambertMaterial() ) );
	  return group;
  }
};
