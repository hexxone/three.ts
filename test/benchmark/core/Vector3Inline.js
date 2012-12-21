THREE = {};
    
THREE.Vector3 = function ( x, y, z ) {

    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;

};

THREE.Vector3.prototype = {

    constructor: THREE.Vector3,
    
    lengthSq: function () {

            return this.x * this.x + this.y * this.y + this.z * this.z;

    },

    length: function () {

            return Math.sqrt( this.lengthSq() );

    },

    length2: function () {

            return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z );

    }
    
};

var a = [];

for ( var i = 0; i < 100000; i ++ ) {
    
    var x = Math.random(); 
    var y = Math.random();
    var z = Math.random();
    
    a[ i ] = new THREE.Vector3( x, y, z );
    
}


var suite = new Benchmark.Suite;

suite.add('InlineCallTest', function() {

    var result = 0;

    for ( var i = 0; i < 100000; i ++ ) {

        result += a[ i ].length2();

    }

});

suite.add('FunctionCallTest', function() {
    var result = 0;

    for ( var i = 0; i < 100000; i ++ ) {

        result += a[ i ].length();

    }
});

suite.on('cycle', function(event, bench) {
  console.log(String(event.target));
});

suite.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
  console.log( "Done" );
});

suite.run(true);