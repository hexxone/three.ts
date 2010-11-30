// Converted from: Nano.obj
//  vertices: 418
//  faces: 190 
//  materials: 1
//
//  Generated with OBJ -> Three.js converter
//  http://github.com/alteredq/three.js/blob/master/utils/exporters/convert_obj_threejs.py

var Nano = function ( urlbase ) {
    var scope = this;

    THREE.Geometry.call(this);

    var materials = [	{
	"a_dbg_color" : 0xffeeeeee,
	"a_dbg_index" : 0,
	"a_dbg_name" : "Mat"
	}];

    init_materials();
    
    var normals = [];

	v(60.188229,126.000000,66.000000);
	v(60.188229,156.000000,29.999998);
	v(60.188229,156.000000,29.999998);
	v(60.188229,72.000000,48.000000);
	v(60.188229,72.000000,66.000000);
	v(60.188229,126.000000,66.000000);
	v(60.188229,156.000000,29.999998);
	v(60.188229,-84.000000,66.000000);
	v(60.188229,-132.000000,23.999998);
	v(60.188229,-156.000000,66.000000);
	v(60.188229,-156.000000,-66.000000);
	v(60.188229,-84.000000,48.000000);
	v(60.188229,72.000000,48.000000);
	v(60.188229,-132.000000,-18.000002);
	v(60.188229,-108.000000,-18.000002);
	v(60.188229,156.000000,-66.000000);
	v(60.188229,-108.000000,23.999998);
	v(60.188229,72.000000,66.000000);
	v(60.188229,-84.000000,48.000000);
	v(60.188229,72.000000,48.000000);
	v(60.188229,-84.000000,66.000000);
	v(60.188229,-84.000000,48.000000);
	v(60.188229,-156.000000,66.000000);
	v(60.188229,72.000000,66.000000);
	v(60.188229,-84.000000,66.000000);
	v(60.188229,126.000000,66.000000);
	v(60.188229,126.000000,66.000000);
	v(60.188229,156.000000,29.999998);
	v(60.188229,156.000000,29.999998);
	v(30.188229,72.000000,66.000000);
	v(18.188229,72.000000,66.000000);
	v(24.188229,-132.000000,23.999998);
	v(24.188229,-156.000000,-66.000000);
	v(24.188229,-132.000000,-18.000002);
	v(24.188229,-108.000000,-18.000002);
	v(24.188229,-84.000000,48.000000);
	v(24.188229,-108.000000,23.999998);
	v(18.188229,102.000000,66.000000);
	v(24.188229,-84.000000,48.000000);
	v(24.188229,-156.000000,66.000000);
	v(24.188229,-84.000000,66.000000);
	v(30.188229,102.000000,66.000000);
	v(24.188229,-84.000000,-66.000000);
	v(-29.811771,102.000000,66.000000);
	v(-23.811771,-84.000000,-66.000000);
	v(-29.811771,72.000000,48.000000);
	v(-17.811771,72.000000,48.000000);
	v(-17.811771,102.000000,48.000000);
	v(-29.811771,102.000000,48.000000);
	v(30.188229,72.000000,48.000000);
	v(18.188229,72.000000,48.000000);
	v(18.188229,102.000000,48.000000);
	v(30.188229,102.000000,48.000000);
	v(-23.811771,-41.999996,48.000000);
	v(24.188229,-41.999996,48.000000);
	v(-23.811771,-41.999996,-66.000000);
	v(24.188229,-41.999996,-66.000000);
	v(-23.811771,30.000004,35.999998);
	v(-23.811771,48.000004,35.999998);
	v(-23.811771,6.000004,35.999998);
	v(-23.811771,-5.999996,35.999998);
	v(-23.811771,-5.999996,48.000000);
	v(24.188229,30.000004,35.999998);
	v(24.188229,48.000004,35.999998);
	v(-23.811771,6.000004,48.000000);
	v(-23.811771,30.000004,48.000000);
	v(-23.811771,48.000004,48.000000);
	v(24.188229,6.000004,35.999998);
	v(24.188229,-5.999996,35.999998);
	v(24.188229,-5.999996,48.000000);
	v(24.188229,6.000004,48.000000);
	v(24.188229,30.000004,48.000000);
	v(24.188229,48.000004,48.000000);
	v(-59.811771,126.000000,66.000000);
	v(-59.811771,156.000000,29.999998);
	v(-59.811771,156.000000,29.999998);
	v(-59.811771,72.000000,66.000000);
	v(-59.811771,156.000000,29.999998);
	v(-59.811771,-132.000000,23.999998);
	v(-59.811771,-156.000000,-66.000000);
	v(-59.811771,-132.000000,-18.000002);
	v(-59.811771,-108.000000,-18.000002);
	v(-59.811771,156.000000,-66.000000);
	v(-59.811771,-108.000000,23.999998);
	v(-59.811771,72.000000,48.000000);
	v(-59.811771,-84.000000,48.000000);
	v(-59.811771,-156.000000,66.000000);
	v(-59.811771,72.000000,66.000000);
	v(-59.811771,-84.000000,66.000000);
	v(-59.811771,126.000000,66.000000);
	v(-59.811771,126.000000,66.000000);
	v(-59.811771,156.000000,29.999998);
	v(-59.811771,156.000000,29.999998);
	v(-29.811771,72.000000,66.000000);
	v(-17.811771,72.000000,66.000000);
	v(-23.811771,-132.000000,23.999998);
	v(-23.811771,-156.000000,-66.000000);
	v(-23.811771,-132.000000,-18.000002);
	v(-23.811771,-108.000000,-18.000002);
	v(-23.811771,-84.000000,48.000000);
	v(-23.811771,-108.000000,23.999998);
	v(-17.811771,102.000000,66.000000);
	v(-23.811771,-84.000000,48.000000);
	v(-23.811771,-156.000000,66.000000);
	v(-23.811771,-84.000000,66.000000);
	v(-29.811771,102.000000,66.000000);
	v(-23.811771,-84.000000,-66.000000);
	v(-29.811771,72.000000,48.000000);
	v(-17.811771,72.000000,48.000000);
	v(-17.811771,102.000000,48.000000);
	v(-29.811771,102.000000,48.000000);
	v(-23.811771,-41.999996,48.000000);
	v(-23.811771,-41.999996,-66.000000);
	v(-23.811771,30.000004,35.999998);
	v(-23.811771,48.000004,35.999998);
	v(-23.811771,6.000004,35.999998);
	v(-23.811771,-5.999996,35.999998);
	v(-23.811771,-5.999996,48.000000);
	v(-23.811771,6.000004,48.000000);
	v(-23.811771,30.000004,48.000000);
	v(-23.811771,48.000004,48.000000);
	v(-59.811771,126.000000,66.000000);
	v(-59.811771,156.000000,29.999998);
	v(-59.811771,156.000000,29.999998);
	v(-59.811771,72.000000,66.000000);
	v(-59.811771,156.000000,29.999998);
	v(-59.811771,-132.000000,23.999998);
	v(-59.811771,-156.000000,-66.000000);
	v(-59.811771,-132.000000,-18.000002);
	v(-59.811771,-108.000000,-18.000002);
	v(-59.811771,156.000000,-66.000000);
	v(-59.811771,-108.000000,23.999998);
	v(-59.811771,72.000000,48.000000);
	v(-59.811771,-84.000000,48.000000);
	v(-59.811771,-156.000000,66.000000);
	v(-59.811771,72.000000,66.000000);
	v(-59.811771,-84.000000,66.000000);
	v(-59.811771,126.000000,66.000000);
	v(-59.811771,126.000000,66.000000);
	v(-59.811771,156.000000,29.999998);
	v(-59.811771,156.000000,29.999998);
	v(-29.811771,72.000000,66.000000);
	v(-17.811771,72.000000,66.000000);
	v(-23.811771,-132.000000,23.999998);
	v(-23.811771,-156.000000,-66.000000);
	v(-23.811771,-132.000000,-18.000002);
	v(-23.811771,-108.000000,-18.000002);
	v(-23.811771,-84.000000,48.000000);
	v(-23.811771,-108.000000,23.999998);
	v(-17.811771,102.000000,66.000000);
	v(-23.811771,-84.000000,48.000000);
	v(-23.811771,-156.000000,66.000000);
	v(-23.811771,-84.000000,66.000000);
	v(-29.811771,102.000000,66.000000);
	v(-23.811771,-84.000000,-66.000000);
	v(-29.811771,72.000000,48.000000);
	v(-17.811771,72.000000,48.000000);
	v(-17.811771,102.000000,48.000000);
	v(-29.811771,102.000000,48.000000);
	v(-23.811771,-41.999996,48.000000);
	v(-23.811771,-41.999996,-66.000000);
	v(-23.811771,30.000004,35.999998);
	v(-23.811771,48.000004,35.999998);
	v(-23.811771,6.000004,35.999998);
	v(-23.811771,-5.999996,35.999998);
	v(-23.811771,-5.999996,48.000000);
	v(-23.811771,6.000004,48.000000);
	v(-23.811771,30.000004,48.000000);
	v(-23.811771,48.000004,48.000000);
	v(-59.811771,126.000000,66.000000);
	v(-59.811771,156.000000,29.999998);
	v(-59.811771,156.000000,29.999998);
	v(-59.811771,72.000000,66.000000);
	v(-59.811771,156.000000,29.999998);
	v(-59.811771,-132.000000,23.999998);
	v(-59.811771,-156.000000,-66.000000);
	v(-59.811771,-132.000000,-18.000002);
	v(-59.811771,-108.000000,-18.000002);
	v(-59.811771,156.000000,-66.000000);
	v(-59.811771,-108.000000,23.999998);
	v(-59.811771,72.000000,48.000000);
	v(-59.811771,-84.000000,48.000000);
	v(-59.811771,-156.000000,66.000000);
	v(-59.811771,72.000000,66.000000);
	v(-59.811771,-84.000000,66.000000);
	v(-59.811771,126.000000,66.000000);
	v(-59.811771,126.000000,66.000000);
	v(-59.811771,156.000000,29.999998);
	v(-59.811771,156.000000,29.999998);
	v(-29.811771,72.000000,66.000000);
	v(-17.811771,72.000000,66.000000);
	v(-23.811771,-132.000000,23.999998);
	v(-23.811771,-156.000000,-66.000000);
	v(-23.811771,-132.000000,-18.000002);
	v(-23.811771,-108.000000,-18.000002);
	v(-23.811771,-84.000000,48.000000);
	v(-23.811771,-108.000000,23.999998);
	v(-17.811771,102.000000,66.000000);
	v(-23.811771,-84.000000,48.000000);
	v(-23.811771,-156.000000,66.000000);
	v(-23.811771,-84.000000,66.000000);
	v(-83.753887,-54.327301,-0.821590);
	v(-83.753887,103.172699,-0.821590);
	v(-61.253887,-54.327301,-0.821590);
	v(-61.253887,103.172699,-0.821590);
	v(-61.253887,-54.327301,-53.321590);
	v(-61.253887,103.172699,-53.321590);
	v(-83.753887,-54.327301,-53.321590);
	v(-83.753887,103.172699,-53.321590);
	v(61.253887,-54.327301,-0.821590);
	v(61.253887,103.172699,-0.821590);
	v(83.753887,-54.327301,-0.821590);
	v(83.753887,103.172699,-0.821590);
	v(83.753887,-54.327301,-53.321590);
	v(83.753887,103.172699,-53.321590);
	v(61.253887,-54.327301,-53.321590);
	v(61.253887,103.172699,-53.321590);
	v(60.188229,126.000000,66.000000);
	v(60.188229,156.000000,29.999998);
	v(60.188229,156.000000,29.999998);
	v(60.188229,72.000000,48.000000);
	v(60.188229,72.000000,66.000000);
	v(60.188229,126.000000,66.000000);
	v(60.188229,156.000000,29.999998);
	v(60.188229,-84.000000,66.000000);
	v(60.188229,-132.000000,23.999998);
	v(60.188229,-156.000000,66.000000);
	v(60.188229,-156.000000,-66.000000);
	v(60.188229,-84.000000,48.000000);
	v(60.188229,72.000000,48.000000);
	v(60.188229,-132.000000,-18.000002);
	v(60.188229,-108.000000,-18.000002);
	v(60.188229,156.000000,-66.000000);
	v(60.188229,-108.000000,23.999998);
	v(60.188229,72.000000,66.000000);
	v(60.188229,-84.000000,48.000000);
	v(60.188229,72.000000,48.000000);
	v(60.188229,-84.000000,66.000000);
	v(60.188229,-84.000000,48.000000);
	v(60.188229,-156.000000,66.000000);
	v(60.188229,72.000000,66.000000);
	v(60.188229,-84.000000,66.000000);
	v(60.188229,126.000000,66.000000);
	v(60.188229,126.000000,66.000000);
	v(60.188229,156.000000,29.999998);
	v(60.188229,156.000000,29.999998);
	v(30.188229,72.000000,66.000000);
	v(18.188229,72.000000,66.000000);
	v(24.188229,-132.000000,23.999998);
	v(24.188229,-156.000000,-66.000000);
	v(24.188229,-132.000000,-18.000002);
	v(24.188229,-108.000000,-18.000002);
	v(24.188229,-84.000000,48.000000);
	v(24.188229,-108.000000,23.999998);
	v(18.188229,102.000000,66.000000);
	v(24.188229,-84.000000,48.000000);
	v(24.188229,-156.000000,66.000000);
	v(24.188229,-84.000000,66.000000);
	v(30.188229,102.000000,66.000000);
	v(24.188229,-84.000000,-66.000000);
	v(-29.811771,102.000000,66.000000);
	v(-23.811771,-84.000000,-66.000000);
	v(-29.811771,72.000000,48.000000);
	v(-17.811771,72.000000,48.000000);
	v(-17.811771,102.000000,48.000000);
	v(-29.811771,102.000000,48.000000);
	v(30.188229,72.000000,48.000000);
	v(18.188229,72.000000,48.000000);
	v(18.188229,102.000000,48.000000);
	v(30.188229,102.000000,48.000000);
	v(-23.811771,-41.999996,48.000000);
	v(24.188229,-41.999996,48.000000);
	v(-23.811771,-41.999996,-66.000000);
	v(24.188229,-41.999996,-66.000000);
	v(-23.811771,30.000004,35.999998);
	v(-23.811771,48.000004,35.999998);
	v(-23.811771,6.000004,35.999998);
	v(-23.811771,-5.999996,35.999998);
	v(-23.811771,-5.999996,48.000000);
	v(24.188229,30.000004,35.999998);
	v(24.188229,48.000004,35.999998);
	v(-23.811771,6.000004,48.000000);
	v(-23.811771,30.000004,48.000000);
	v(-23.811771,48.000004,48.000000);
	v(24.188229,6.000004,35.999998);
	v(24.188229,-5.999996,35.999998);
	v(24.188229,-5.999996,48.000000);
	v(24.188229,6.000004,48.000000);
	v(24.188229,30.000004,48.000000);
	v(24.188229,48.000004,48.000000);
	v(-59.811771,126.000000,66.000000);
	v(-59.811771,156.000000,29.999998);
	v(-59.811771,156.000000,29.999998);
	v(-59.811771,72.000000,66.000000);
	v(-59.811771,156.000000,29.999998);
	v(-59.811771,-132.000000,23.999998);
	v(-59.811771,-156.000000,-66.000000);
	v(-59.811771,-132.000000,-18.000002);
	v(-59.811771,-108.000000,-18.000002);
	v(-59.811771,156.000000,-66.000000);
	v(-59.811771,-108.000000,23.999998);
	v(-59.811771,72.000000,48.000000);
	v(-59.811771,-84.000000,48.000000);
	v(-59.811771,-156.000000,66.000000);
	v(-59.811771,72.000000,66.000000);
	v(-59.811771,-84.000000,66.000000);
	v(-59.811771,126.000000,66.000000);
	v(-59.811771,126.000000,66.000000);
	v(-59.811771,156.000000,29.999998);
	v(-59.811771,156.000000,29.999998);
	v(-29.811771,72.000000,66.000000);
	v(-17.811771,72.000000,66.000000);
	v(-23.811771,-132.000000,23.999998);
	v(-23.811771,-156.000000,-66.000000);
	v(-23.811771,-132.000000,-18.000002);
	v(-23.811771,-108.000000,-18.000002);
	v(-23.811771,-84.000000,48.000000);
	v(-23.811771,-108.000000,23.999998);
	v(-17.811771,102.000000,66.000000);
	v(-23.811771,-84.000000,48.000000);
	v(-23.811771,-156.000000,66.000000);
	v(-23.811771,-84.000000,66.000000);
	v(-29.811771,102.000000,66.000000);
	v(-23.811771,-84.000000,-66.000000);
	v(-29.811771,72.000000,48.000000);
	v(-17.811771,72.000000,48.000000);
	v(-17.811771,102.000000,48.000000);
	v(-29.811771,102.000000,48.000000);
	v(-23.811771,-41.999996,48.000000);
	v(-23.811771,-41.999996,-66.000000);
	v(-23.811771,30.000004,35.999998);
	v(-23.811771,48.000004,35.999998);
	v(-23.811771,6.000004,35.999998);
	v(-23.811771,-5.999996,35.999998);
	v(-23.811771,-5.999996,48.000000);
	v(-23.811771,6.000004,48.000000);
	v(-23.811771,30.000004,48.000000);
	v(-23.811771,48.000004,48.000000);
	v(-59.811771,126.000000,66.000000);
	v(-59.811771,156.000000,29.999998);
	v(-59.811771,156.000000,29.999998);
	v(-59.811771,72.000000,66.000000);
	v(-59.811771,156.000000,29.999998);
	v(-59.811771,-132.000000,23.999998);
	v(-59.811771,-156.000000,-66.000000);
	v(-59.811771,-132.000000,-18.000002);
	v(-59.811771,-108.000000,-18.000002);
	v(-59.811771,156.000000,-66.000000);
	v(-59.811771,-108.000000,23.999998);
	v(-59.811771,72.000000,48.000000);
	v(-59.811771,-84.000000,48.000000);
	v(-59.811771,-156.000000,66.000000);
	v(-59.811771,72.000000,66.000000);
	v(-59.811771,-84.000000,66.000000);
	v(-59.811771,126.000000,66.000000);
	v(-59.811771,126.000000,66.000000);
	v(-59.811771,156.000000,29.999998);
	v(-59.811771,156.000000,29.999998);
	v(-29.811771,72.000000,66.000000);
	v(-17.811771,72.000000,66.000000);
	v(-23.811771,-132.000000,23.999998);
	v(-23.811771,-156.000000,-66.000000);
	v(-23.811771,-132.000000,-18.000002);
	v(-23.811771,-108.000000,-18.000002);
	v(-23.811771,-84.000000,48.000000);
	v(-23.811771,-108.000000,23.999998);
	v(-17.811771,102.000000,66.000000);
	v(-23.811771,-84.000000,48.000000);
	v(-23.811771,-156.000000,66.000000);
	v(-23.811771,-84.000000,66.000000);
	v(-29.811771,102.000000,66.000000);
	v(-23.811771,-84.000000,-66.000000);
	v(-29.811771,72.000000,48.000000);
	v(-17.811771,72.000000,48.000000);
	v(-17.811771,102.000000,48.000000);
	v(-29.811771,102.000000,48.000000);
	v(-23.811771,-41.999996,48.000000);
	v(-23.811771,-41.999996,-66.000000);
	v(-23.811771,30.000004,35.999998);
	v(-23.811771,48.000004,35.999998);
	v(-23.811771,6.000004,35.999998);
	v(-23.811771,-5.999996,35.999998);
	v(-23.811771,-5.999996,48.000000);
	v(-23.811771,6.000004,48.000000);
	v(-23.811771,30.000004,48.000000);
	v(-23.811771,48.000004,48.000000);
	v(-59.811771,126.000000,66.000000);
	v(-59.811771,156.000000,29.999998);
	v(-59.811771,156.000000,29.999998);
	v(-59.811771,72.000000,66.000000);
	v(-59.811771,156.000000,29.999998);
	v(-59.811771,-132.000000,23.999998);
	v(-59.811771,-156.000000,-66.000000);
	v(-59.811771,-132.000000,-18.000002);
	v(-59.811771,-108.000000,-18.000002);
	v(-59.811771,156.000000,-66.000000);
	v(-59.811771,-108.000000,23.999998);
	v(-59.811771,72.000000,48.000000);
	v(-59.811771,-84.000000,48.000000);
	v(-59.811771,-156.000000,66.000000);
	v(-59.811771,72.000000,66.000000);
	v(-59.811771,-84.000000,66.000000);
	v(-59.811771,126.000000,66.000000);
	v(-59.811771,126.000000,66.000000);
	v(-59.811771,156.000000,29.999998);
	v(-59.811771,156.000000,29.999998);
	v(-29.811771,72.000000,66.000000);
	v(-17.811771,72.000000,66.000000);
	v(-23.811771,-132.000000,23.999998);
	v(-23.811771,-156.000000,-66.000000);
	v(-23.811771,-132.000000,-18.000002);
	v(-23.811771,-108.000000,-18.000002);
	v(-23.811771,-84.000000,48.000000);
	v(-23.811771,-108.000000,23.999998);
	v(-17.811771,102.000000,66.000000);
	v(-23.811771,-84.000000,48.000000);
	v(-23.811771,-156.000000,66.000000);
	v(-23.811771,-84.000000,66.000000);
    /*
	uv(0.000000,1.000000,0.996643,0.000000,1.000000,0.000000);
	uv(1.000000,1.000000,1.000000,0.000000,0.000000,0.000000,0.000000,1.000000);
	uv(0.000000,1.000000,1.000000,1.000000,1.000000,0.000000,0.000000,0.000000);
	uv(1.000000,1.000000,1.000000,1.000000,1.000000,0.000000,1.000000,0.000000);
	uv(0.000000,0.000000,1.000000,0.000000,1.000000,1.000000);
	uv(0.000000,1.000000,1.000000,1.000000,1.000000,0.000000,0.000000,0.000000);
	uv(0.000000,0.000000,0.000000,0.000000,1.000000,1.000000,1.000000,1.000000);
	uv(1.000000,0.000000,0.000000,0.000000,1.000000,1.000000);
	uv(1.000000,1.000000,1.000000,0.000000,0.000000,0.000000);
	uv(0.000000,1.000000,0.000000,1.000000,1.000000,0.000000,1.000000,0.000000);
	uv(0.996643,0.000000,0.996643,0.000000,0.000000,1.000000,0.000000,1.000000);
	uv(1.000000,0.000000,1.000000,0.000000,0.996643,0.000000,0.996643,0.000000);
	uv(0.000000,0.000000,1.000000,0.000000,1.000000,1.000000,0.000000,1.000000);
	uv(0.000000,0.000000,1.000000,0.000000,1.000000,1.000000,0.000000,1.000000);
	uv(1.000000,0.000000,1.000000,1.000000,0.000000,1.000000,0.000000,0.000000);
	uv(0.000000,0.000000,1.000000,0.000000,1.000000,1.000000,0.000000,1.000000);
	uv(0.000000,0.000000,1.000000,0.000000,1.000000,1.000000,0.000000,1.000000);
	uv(0.000000,0.000000,1.000000,0.000000,1.000000,1.000000,0.000000,1.000000);
	uv(0.000000,0.000000,1.000000,0.000000,1.000000,1.000000);
	uv(0.000000,1.000000,0.000000,1.000000,1.000000,1.000000,1.000000,1.000000);
	uv(1.000000,0.000000,1.000000,0.000000,0.000000,0.000000,0.000000,0.000000);
	uv(0.000000,0.000000,0.000000,0.000000,1.000000,0.000000,1.000000,0.000000);
	uv(1.000000,1.000000,1.000000,1.000000,0.000000,1.000000,0.000000,1.000000);
	uv(1.000000,1.000000,1.000000,0.000000,0.000000,0.000000,0.000000,1.000000);
	uv(1.000000,0.000000,1.000000,0.000000,0.000000,0.000000,0.000000,0.000000);
	uv(0.000000,1.000000,1.000000,1.000000,1.000000,0.000000,0.000000,0.000000);
	uv(0.167026,0.832973,0.832974,0.832973,0.832974,0.167026,0.167026,0.167026);
	uv(1.000000,0.000000,1.000000,1.000000,0.000000,1.000000,0.000000,0.000000);
	uv(0.000000,1.000000,1.000000,1.000000,1.000000,0.000000,0.000000,0.000000);
	uv(0.000000,1.000000,1.000000,1.000000,1.000000,0.000000,0.000000,0.000000);
	uv(0.000000,1.000000,1.000000,1.000000,1.000000,0.000000,0.000000,0.000000);
	uv(1.000000,0.000000,1.000000,1.000000,0.000000,1.000000,0.000000,0.000000);
	uv(0.000000,1.000000,1.000000,1.000000,1.000000,0.000000,0.000000,0.000000);
	uv(0.000000,1.000000,1.000000,1.000000,1.000000,0.000000,0.000000,0.000000);
	uv(0.000000,1.000000,1.000000,1.000000,1.000000,0.000000,0.000000,0.000000);
	uv(0.000000,1.000000,1.000000,1.000000,1.000000,0.000000,0.000000,0.000000);
	uv(0.000000,1.000000,1.000000,1.000000,1.000000,0.000000,0.000000,0.000000);
	uv(1.000000,1.000000,1.000000,0.000000,0.000000,0.000000,0.000000,1.000000);
	uv(0.000000,1.000000,1.000000,1.000000,1.000000,0.000000,0.000000,0.000000);
	uv(0.000000,1.000000,1.000000,1.000000,1.000000,0.000000,0.000000,0.000000);
	uv(1.000000,0.000000,1.000000,1.000000,0.000000,1.000000,0.000000,0.000000);
	uv(0.000000,0.000000,1.000000,0.000000,1.000000,1.000000,0.000000,1.000000);
	uv(0.000000,0.000000,1.000000,0.000000,1.000000,1.000000,0.000000,1.000000);
	uv(1.000000,0.000000,1.000000,1.000000,0.000000,1.000000);
	uv(0.000000,1.000000,1.000000,1.000000,1.000000,0.000000,0.000000,0.000000);
	uv(0.000000,1.000000,1.000000,1.000000,1.000000,0.000000,0.000000,0.000000);
	uv(1.000000,1.000000,1.000000,0.000000,0.000000,0.000000,0.000000,1.000000);
	uv(0.000000,1.000000,1.000000,1.000000,1.000000,0.000000,0.000000,0.000000);
	uv(0.000000,0.000000,1.000000,0.000000,1.000000,1.000000,0.000000,1.000000);
	uv(0.000000,0.000000,1.000000,0.000000,1.000000,1.000000,0.000000,1.000000);
	uv(0.000000,0.000000,1.000000,0.000000,1.000000,1.000000);
	uv(0.000000,1.000000,1.000000,1.000000,1.000000,0.000000,0.000000,0.000000);
	uv(0.996643,0.000000,0.000000,1.000000,1.000000,0.000000);
	uv(0.000000,1.000000,1.000000,1.000000,1.000000,0.000000,0.000000,0.000000);
	uv(1.000000,0.000000,1.000000,1.000000,0.000000,1.000000,0.000000,0.000000);
	uv(1.000000,0.000000,1.000000,1.000000,1.000000,1.000000,1.000000,0.000000);
	uv(1.000000,0.000000,0.000000,0.000000,1.000000,1.000000);
	uv(0.000000,1.000000,1.000000,1.000000,1.000000,0.000000,0.000000,0.000000);
	uv(1.000000,1.000000,0.000000,0.000000,0.000000,0.000000,1.000000,1.000000);
	uv(0.000000,0.000000,1.000000,0.000000,1.000000,1.000000,0.000000,1.000000);
	uv(1.000000,0.000000,1.000000,1.000000,0.000000,0.000000);
	uv(1.000000,0.000000,0.000000,1.000000,0.000000,1.000000,1.000000,0.000000);
	uv(0.000000,1.000000,0.996643,0.000000,0.996643,0.000000,0.000000,1.000000);
	uv(0.996643,0.000000,1.000000,0.000000,1.000000,0.000000,0.996643,0.000000);
	uv(1.000000,1.000000,1.000000,0.000000,0.000000,0.000000,0.000000,1.000000);
	uv(1.000000,1.000000,1.000000,0.000000,0.000000,0.000000,0.000000,1.000000);
	uv(1.000000,1.000000,1.000000,0.000000,0.000000,1.000000);
	uv(1.000000,1.000000,1.000000,0.000000,0.000000,0.000000,0.000000,1.000000);
	uv(1.000000,1.000000,1.000000,0.000000,0.000000,0.000000,0.000000,1.000000);
	uv(1.000000,1.000000,1.000000,0.000000,0.000000,0.000000,0.000000,1.000000);
	uv(1.000000,0.000000,0.000000,0.000000,1.000000,1.000000);
	uv(1.000000,1.000000,0.000000,1.000000,0.000000,1.000000,1.000000,1.000000);
	uv(0.000000,0.000000,1.000000,0.000000,1.000000,0.000000,0.000000,0.000000);
	uv(1.000000,0.000000,0.000000,0.000000,0.000000,0.000000,1.000000,0.000000);
	uv(0.000000,1.000000,1.000000,1.000000,1.000000,1.000000,0.000000,1.000000);
	uv(0.000000,0.000000,1.000000,0.000000,1.000000,1.000000,0.000000,1.000000);
	uv(0.000000,0.000000,1.000000,0.000000,1.000000,0.000000,0.000000,0.000000);
	uv(0.000000,1.000000,1.000000,1.000000,1.000000,0.000000,0.000000,0.000000);
	uv(0.832974,0.167026,0.832974,0.832973,0.167026,0.832973,0.167026,0.167026);
	uv(0.000000,0.000000,1.000000,0.000000,1.000000,1.000000);
	uv(1.000000,0.000000,1.000000,1.000000,0.000000,1.000000,0.000000,0.000000);
	uv(1.000000,0.000000,1.000000,1.000000,0.000000,1.000000,0.000000,0.000000);
	uv(1.000000,0.000000,1.000000,1.000000,0.000000,1.000000,0.000000,0.000000);
	uv(0.000000,1.000000,1.000000,1.000000,1.000000,0.000000,0.000000,0.000000);
	uv(0.000000,1.000000,1.000000,1.000000,1.000000,0.000000,0.000000,0.000000);
	uv(0.000000,1.000000,1.000000,1.000000,1.000000,0.000000,0.000000,0.000000);
	uv(0.000000,0.000000,1.000000,0.000000,1.000000,1.000000,0.000000,1.000000);
	uv(0.000000,0.000000,1.000000,0.000000,1.000000,1.000000,0.000000,1.000000);
	uv(0.000000,1.000000,1.000000,1.000000,1.000000,0.000000,0.000000,0.000000);
	uv(1.000000,1.000000,1.000000,0.000000,0.000000,0.000000);
	uv(1.000000,1.000000,1.000000,0.000000,0.000000,0.000000,0.000000,1.000000);
	uv(1.000000,1.000000,1.000000,0.000000,0.000000,0.000000,0.000000,1.000000);
	uv(1.000000,1.000000,1.000000,0.000000,0.000000,0.000000,0.000000,1.000000);
	uv(1.000000,1.000000,1.000000,0.000000,0.000000,0.000000,0.000000,1.000000);
	uv(1.000000,1.000000,1.000000,0.000000,0.000000,0.000000,0.000000,1.000000);
	uv(1.000000,1.000000,1.000000,0.000000,0.000000,0.000000,0.000000,1.000000);
	uv(1.000000,1.000000,1.000000,0.000000,0.000000,0.000000,0.000000,1.000000);
	uv(1.000000,1.000000,1.000000,0.000000,0.000000,0.000000,0.000000,1.000000);
	uv(1.000000,1.000000,1.000000,0.000000,0.000000,0.000000,0.000000,1.000000);
	uv(1.000000,1.000000,1.000000,0.000000,0.000000,0.000000,0.000000,1.000000);
	uv(1.000000,1.000000,1.000000,0.000000,0.000000,0.000000,0.000000,1.000000);
	uv(1.000000,1.000000,1.000000,0.000000,0.000000,0.000000,0.000000,1.000000);
	uv(0.000000,1.000000,0.996643,0.000000,1.000000,0.000000);
	uv(1.000000,1.000000,1.000000,0.000000,0.000000,0.000000,0.000000,1.000000);
	uv(0.000000,1.000000,1.000000,1.000000,1.000000,0.000000,0.000000,0.000000);
	uv(1.000000,1.000000,1.000000,1.000000,1.000000,0.000000,1.000000,0.000000);
	uv(0.000000,0.000000,1.000000,0.000000,1.000000,1.000000);
	uv(0.000000,1.000000,1.000000,1.000000,1.000000,0.000000,0.000000,0.000000);
	uv(0.000000,0.000000,0.000000,0.000000,1.000000,1.000000,1.000000,1.000000);
	uv(1.000000,0.000000,0.000000,0.000000,1.000000,1.000000);
	uv(1.000000,1.000000,1.000000,0.000000,0.000000,0.000000);
	uv(0.000000,1.000000,0.000000,1.000000,1.000000,0.000000,1.000000,0.000000);
	uv(0.996643,0.000000,0.996643,0.000000,0.000000,1.000000,0.000000,1.000000);
	uv(1.000000,0.000000,1.000000,0.000000,0.996643,0.000000,0.996643,0.000000);
	uv(0.000000,0.000000,1.000000,0.000000,1.000000,1.000000,0.000000,1.000000);
	uv(0.000000,0.000000,1.000000,0.000000,1.000000,1.000000,0.000000,1.000000);
	uv(1.000000,0.000000,1.000000,1.000000,0.000000,1.000000,0.000000,0.000000);
	uv(0.000000,0.000000,1.000000,0.000000,1.000000,1.000000,0.000000,1.000000);
	uv(0.000000,0.000000,1.000000,0.000000,1.000000,1.000000,0.000000,1.000000);
	uv(0.000000,0.000000,1.000000,0.000000,1.000000,1.000000,0.000000,1.000000);
	uv(0.000000,0.000000,1.000000,0.000000,1.000000,1.000000);
	uv(0.000000,1.000000,0.000000,1.000000,1.000000,1.000000,1.000000,1.000000);
	uv(1.000000,0.000000,1.000000,0.000000,0.000000,0.000000,0.000000,0.000000);
	uv(0.000000,0.000000,0.000000,0.000000,1.000000,0.000000,1.000000,0.000000);
	uv(1.000000,1.000000,1.000000,1.000000,0.000000,1.000000,0.000000,1.000000);
	uv(1.000000,1.000000,1.000000,0.000000,0.000000,0.000000,0.000000,1.000000);
	uv(1.000000,0.000000,1.000000,0.000000,0.000000,0.000000,0.000000,0.000000);
	uv(0.000000,1.000000,1.000000,1.000000,1.000000,0.000000,0.000000,0.000000);
	uv(0.167026,0.832973,0.832974,0.832973,0.832974,0.167026,0.167026,0.167026);
	uv(0.000000,1.000000,1.000000,1.000000,1.000000,0.000000,0.000000,0.000000);
	uv(0.000000,1.000000,1.000000,1.000000,1.000000,0.000000,0.000000,0.000000);
	uv(0.000000,1.000000,1.000000,1.000000,1.000000,0.000000,0.000000,0.000000);
	uv(0.000000,1.000000,1.000000,1.000000,1.000000,0.000000,0.000000,0.000000);
	uv(1.000000,0.000000,1.000000,1.000000,0.000000,1.000000,0.000000,0.000000);
	uv(0.000000,1.000000,1.000000,1.000000,1.000000,0.000000,0.000000,0.000000);
	uv(0.000000,1.000000,1.000000,1.000000,1.000000,0.000000,0.000000,0.000000);
	uv(0.000000,1.000000,1.000000,1.000000,1.000000,0.000000,0.000000,0.000000);
	uv(0.000000,1.000000,1.000000,1.000000,1.000000,0.000000,0.000000,0.000000);
	uv(0.000000,1.000000,1.000000,1.000000,1.000000,0.000000,0.000000,0.000000);
	uv(1.000000,1.000000,1.000000,0.000000,0.000000,0.000000,0.000000,1.000000);
	uv(0.000000,1.000000,1.000000,1.000000,1.000000,0.000000,0.000000,0.000000);
	uv(0.000000,1.000000,1.000000,1.000000,1.000000,0.000000,0.000000,0.000000);
	uv(1.000000,0.000000,1.000000,1.000000,0.000000,1.000000,0.000000,0.000000);
	uv(0.000000,0.000000,1.000000,0.000000,1.000000,1.000000,0.000000,1.000000);
	uv(0.000000,0.000000,1.000000,0.000000,1.000000,1.000000,0.000000,1.000000);
	uv(1.000000,0.000000,1.000000,1.000000,0.000000,1.000000);
	uv(0.000000,1.000000,1.000000,1.000000,1.000000,0.000000,0.000000,0.000000);
	uv(0.000000,1.000000,1.000000,1.000000,1.000000,0.000000,0.000000,0.000000);
	uv(1.000000,1.000000,1.000000,0.000000,0.000000,0.000000,0.000000,1.000000);
	uv(0.000000,1.000000,1.000000,1.000000,1.000000,0.000000,0.000000,0.000000);
	uv(0.000000,0.000000,1.000000,0.000000,1.000000,1.000000,0.000000,1.000000);
	uv(0.000000,0.000000,1.000000,0.000000,1.000000,1.000000,0.000000,1.000000);
	uv(0.000000,0.000000,1.000000,0.000000,1.000000,1.000000);
	uv(0.000000,1.000000,1.000000,1.000000,1.000000,0.000000,0.000000,0.000000);
	uv(0.996643,0.000000,0.000000,1.000000,1.000000,0.000000);
	uv(0.000000,1.000000,1.000000,1.000000,1.000000,0.000000,0.000000,0.000000);
	uv(1.000000,0.000000,1.000000,1.000000,0.000000,1.000000,0.000000,0.000000);
	uv(1.000000,0.000000,1.000000,1.000000,1.000000,1.000000,1.000000,0.000000);
	uv(1.000000,0.000000,0.000000,0.000000,1.000000,1.000000);
	uv(0.000000,1.000000,1.000000,1.000000,1.000000,0.000000,0.000000,0.000000);
	uv(1.000000,1.000000,0.000000,0.000000,0.000000,0.000000,1.000000,1.000000);
	uv(1.000000,0.000000,1.000000,1.000000,0.000000,1.000000,0.000000,0.000000);
	uv(1.000000,0.000000,1.000000,1.000000,0.000000,0.000000);
	uv(1.000000,0.000000,0.000000,1.000000,0.000000,1.000000,1.000000,0.000000);
	uv(0.000000,1.000000,0.996643,0.000000,0.996643,0.000000,0.000000,1.000000);
	uv(0.996643,0.000000,1.000000,0.000000,1.000000,0.000000,0.996643,0.000000);
	uv(1.000000,1.000000,1.000000,0.000000,0.000000,0.000000,0.000000,1.000000);
	uv(1.000000,1.000000,1.000000,0.000000,0.000000,0.000000,0.000000,1.000000);
	uv(1.000000,1.000000,1.000000,0.000000,0.000000,1.000000);
	uv(1.000000,1.000000,1.000000,0.000000,0.000000,0.000000,0.000000,1.000000);
	uv(1.000000,1.000000,1.000000,0.000000,0.000000,0.000000,0.000000,1.000000);
	uv(1.000000,1.000000,1.000000,0.000000,0.000000,0.000000,0.000000,1.000000);
	uv(1.000000,0.000000,0.000000,0.000000,1.000000,1.000000);
	uv(1.000000,1.000000,0.000000,1.000000,0.000000,1.000000,1.000000,1.000000);
	uv(0.000000,0.000000,1.000000,0.000000,1.000000,0.000000,0.000000,0.000000);
	uv(1.000000,0.000000,0.000000,0.000000,0.000000,0.000000,1.000000,0.000000);
	uv(0.000000,1.000000,1.000000,1.000000,1.000000,1.000000,0.000000,1.000000);
	uv(0.000000,0.000000,1.000000,0.000000,1.000000,1.000000,0.000000,1.000000);
	uv(0.000000,0.000000,1.000000,0.000000,1.000000,0.000000,0.000000,0.000000);
	uv(0.000000,1.000000,1.000000,1.000000,1.000000,0.000000,0.000000,0.000000);
	uv(0.832974,0.167026,0.832974,0.832973,0.167026,0.832973,0.167026,0.167026);
	uv(1.000000,0.000000,1.000000,1.000000,0.000000,1.000000,0.000000,0.000000);
	uv(1.000000,0.000000,1.000000,1.000000,0.000000,1.000000,0.000000,0.000000);
	uv(1.000000,0.000000,1.000000,1.000000,0.000000,1.000000,0.000000,0.000000);
	uv(1.000000,0.000000,1.000000,1.000000,0.000000,1.000000,0.000000,0.000000);
	uv(0.000000,1.000000,1.000000,1.000000,1.000000,0.000000,0.000000,0.000000);
	uv(0.000000,1.000000,1.000000,1.000000,1.000000,0.000000,0.000000,0.000000);
	uv(0.000000,1.000000,1.000000,1.000000,1.000000,0.000000,0.000000,0.000000);
	uv(1.000000,0.000000,1.000000,1.000000,0.000000,1.000000,0.000000,0.000000);
	uv(0.000000,1.000000,1.000000,1.000000,1.000000,0.000000,0.000000,0.000000);
    */
	f3(26,27,28,0);
	f4(180,173,178,177,0);
	f4(68,67,59,60,0);
	f4(14,34,33,13,0);
	f3(21,14,19,0);
	f4(59,67,70,64,0);
	f4(24,40,39,22,0);
	f3(55,175,178,0);
	f3(2,1,0,0);
	f4(0,26,28,2,0);
	f4(1,27,26,0,0);
	f4(2,28,27,1,0);
	f4(8,16,21,24,0);
	f4(22,10,13,8,0);
	f4(189,183,180,45,0);
	f4(6,25,4,19,0);
	f4(15,14,13,10,0);
	f4(70,67,68,69,0);
	f3(22,8,24,0);
	f4(8,31,36,16,0);
	f4(21,38,40,24,0);
	f4(22,39,32,10,0);
	f4(13,33,31,8,0);
	f4(44,192,175,55,0);
	f4(16,36,34,14,0);
	f4(58,63,72,66,0);
	f4(49,52,51,50,0);
	f4(45,48,43,189,0);
	f4(31,39,40,36,0);
	f4(32,39,31,33,0);
	f4(32,33,34,42,0);
	f4(48,47,197,43,0);
	f4(62,63,58,57,0);
	f4(30,37,197,190,0);
	f4(41,52,49,29,0);
	f4(37,51,52,41,0);
	f4(26,41,29,23,0);
	f4(57,58,66,65,0);
	f4(30,50,51,37,0);
	f4(19,23,29,49,0);
	f4(189,43,186,183,0);
	f4(72,63,62,71,0);
	f4(19,72,35,21,0);
	f3(21,16,14,0);
	f4(71,62,57,65,0);
	f4(69,68,60,61,0);
	f4(195,66,180,181,0);
	f4(26,28,188,186,0);
	f4(15,6,19,14,0);
	f4(10,32,42,56,0);
	f3(10,56,15,0);
	f4(56,54,53,55,0);
	f3(187,186,188,0);
	f4(15,178,188,28,0);
	f4(47,46,190,197,0);
	f4(193,194,177,176,0);
	f3(177,181,180,0);
	f4(54,69,61,53,0);
	f4(199,200,184,182,0);
	f4(34,38,54,56,0);
	f3(170,171,169,0);
	f4(188,186,169,171,0);
	f4(186,187,170,169,0);
	f4(187,188,171,170,0);
	f4(181,179,174,184,0);
	f4(176,175,182,174,0);
	f3(179,181,177,0);
	f4(172,185,173,180,0);
	f4(176,177,178,175,0);
	f4(60,59,64,61,0);
	f3(174,182,184,0);
	f4(196,191,174,179,0);
	f4(200,198,181,184,0);
	f4(192,199,182,175,0);
	f4(191,193,176,174,0);
	f4(56,55,178,15,0);
	f4(194,196,179,177,0);
	f4(70,71,65,64,0);
	f4(47,48,45,46,0);
	f3(34,56,42,0);
	f4(200,199,191,196,0);
	f4(191,199,192,193,0);
	f4(194,193,192,44,0);
	f4(72,19,180,66,0);
	f4(50,30,190,46,0);
	f4(43,41,26,186,0);
	f4(36,40,38,34,0);
	f4(198,200,196,194,0);
	f4(55,159,198,194,0);
	f3(154,55,194,0);
	f4(203,204,202,201,0);
	f4(205,206,204,203,0);
	f4(207,208,206,205,0);
	f4(201,202,208,207,0);
	f4(204,206,208,202,0);
	f4(205,203,201,207,0);
	f4(211,212,210,209,0);
	f4(213,214,212,211,0);
	f4(215,216,214,213,0);
	f4(209,210,216,215,0);
	f4(212,214,216,210,0);
	f4(213,211,209,215,0);
	f3(243,244,245,0);
	f4(397,390,395,394,0);
	f4(285,284,276,277,0);
	f4(231,251,250,230,0);
	f3(238,231,236,0);
	f4(276,284,287,281,0);
	f4(241,257,256,239,0);
	f3(272,392,395,0);
	f3(219,218,217,0);
	f4(217,243,245,219,0);
	f4(218,244,243,217,0);
	f4(219,245,244,218,0);
	f4(225,233,238,241,0);
	f4(239,227,230,225,0);
	f4(406,400,397,262,0);
	f4(223,242,221,236,0);
	f4(232,231,230,227,0);
	f4(287,284,285,286,0);
	f3(239,225,241,0);
	f4(225,248,253,233,0);
	f4(238,255,257,241,0);
	f4(239,256,249,227,0);
	f4(230,250,248,225,0);
	f4(261,409,392,272,0);
	f4(233,253,251,231,0);
	f4(275,280,289,283,0);
	f4(266,269,268,267,0);
	f4(253,257,259,251,0);
	f4(248,256,257,253,0);
	f4(249,256,248,250,0);
	f4(249,250,251,259,0);
	f4(265,264,414,260,0);
	f4(279,280,275,274,0);
	f4(247,254,414,407,0);
	f4(258,269,266,246,0);
	f4(254,268,269,258,0);
	f4(243,258,246,240,0);
	f4(274,275,283,282,0);
	f4(247,267,268,254,0);
	f4(236,240,246,266,0);
	f4(406,260,403,400,0);
	f4(289,280,279,288,0);
	f4(236,289,252,238,0);
	f3(238,233,231,0);
	f4(288,279,274,282,0);
	f4(286,285,277,278,0);
	f4(412,283,397,398,0);
	f4(243,245,405,403,0);
	f4(232,223,236,231,0);
	f4(227,249,259,273,0);
	f3(227,273,232,0);
	f4(252,271,273,259,0);
	f3(404,403,405,0);
	f4(232,395,405,245,0);
	f4(264,263,407,414,0);
	f4(410,411,394,393,0);
	f3(394,398,397,0);
	f4(271,286,278,270,0);
	f4(416,417,401,399,0);
	f4(272,270,412,261,0);
	f3(387,388,386,0);
	f4(405,403,386,388,0);
	f4(403,404,387,386,0);
	f4(404,405,388,387,0);
	f4(398,396,391,401,0);
	f4(393,392,399,391,0);
	f3(396,398,394,0);
	f4(389,402,390,397,0);
	f4(393,394,395,392,0);
	f4(277,276,281,278,0);
	f3(391,399,401,0);
	f4(413,408,391,396,0);
	f4(417,415,398,401,0);
	f4(409,416,399,392,0);
	f4(408,410,393,391,0);
	f4(273,272,395,232,0);
	f4(411,413,396,394,0);
	f4(287,288,282,281,0);
	f4(264,265,262,263,0);
	f4(261,417,413,411,0);
	f4(417,416,408,413,0);
	f4(408,416,409,410,0);
	f4(411,410,409,261,0);
	f4(289,236,397,283,0);
	f4(267,247,407,263,0);
	f4(260,258,243,403,0);
	f4(262,265,260,406,0);
	f4(273,271,270,272,0);

    this.computeCentroids();
    this.computeNormals();
    
    function material_color( mi ) {
        var m = materials[mi];
        if( m.col_diffuse )
            return (m.col_diffuse[0]*255 << 16) + (m.col_diffuse[1]*255 << 8) + m.col_diffuse[2]*255;
        else if ( m.a_dbg_color )
            return  m.a_dbg_color;
        else 
            return 0xffeeeeee;
    }
    
    function v( x, y, z ) {
        scope.vertices.push( new THREE.Vertex( new THREE.Vector3( x, y, z ) ) );
    }

    function f3( a, b, c, mi ) {
        var material = scope.materials[ mi ];
        scope.faces.push( new THREE.Face3( a, b, c, null, material ) );
    }

    function f4( a, b, c, d, mi ) {
        var material = scope.materials[ mi ];
        scope.faces.push( new THREE.Face4( a, b, c, d, null, material ) );
    }

    function f3n( a, b, c, mi, n1, n2, n3 ) {
        var material = scope.materials[ mi ];
        var n1x = normals[n1][0];
        var n1y = normals[n1][1];
        var n1z = normals[n1][2];
        var n2x = normals[n2][0];
        var n2y = normals[n2][1];
        var n2z = normals[n2][2];
        var n3x = normals[n3][0];
        var n3y = normals[n3][1];
        var n3z = normals[n3][2];
        scope.faces.push( new THREE.Face3( a, b, c, 
                          [new THREE.Vector3( n1x, n1y, n1z ), new THREE.Vector3( n2x, n2y, n2z ), new THREE.Vector3( n3x, n3y, n3z )], 
                          material ) );
    }

    function f4n( a, b, c, d, mi, n1, n2, n3, n4 ) {
        var material = scope.materials[ mi ];
        var n1x = normals[n1][0];
        var n1y = normals[n1][1];
        var n1z = normals[n1][2];
        var n2x = normals[n2][0];
        var n2y = normals[n2][1];
        var n2z = normals[n2][2];
        var n3x = normals[n3][0];
        var n3y = normals[n3][1];
        var n3z = normals[n3][2];
        var n4x = normals[n4][0];
        var n4y = normals[n4][1];
        var n4z = normals[n4][2];
        scope.faces.push( new THREE.Face4( a, b, c, d,
                          [new THREE.Vector3( n1x, n1y, n1z ), new THREE.Vector3( n2x, n2y, n2z ), new THREE.Vector3( n3x, n3y, n3z ), new THREE.Vector3( n4x, n4y, n4z )], 
                          material ) );
    }

    function uv( u1, v1, u2, v2, u3, v3, u4, v4 ) {
        var uv = [];
        uv.push( new THREE.UV( u1, v1 ) );
        uv.push( new THREE.UV( u2, v2 ) );
        uv.push( new THREE.UV( u3, v3 ) );
        if ( u4 && v4 ) uv.push( new THREE.UV( u4, v4 ) );
        scope.uvs.push( uv );
    }

    function init_materials() {
        scope.materials = [];
        for(var i=0; i<materials.length; ++i) {
            scope.materials[i] = [ create_material( materials[i], urlbase ) ];
        }
    }
    
    function is_pow2( n ) {
        var l = Math.log(n) / Math.LN2;
        return Math.floor(l) == l;
    }
    
    function nearest_pow2(n) {
        var l = Math.log(n) / Math.LN2;
        return Math.pow( 2, Math.round(l) );
    }
    
    function create_material( m ) {
        var material;
        /*
        if( m.map_diffuse && urlbase ) {
            var texture = document.createElement( 'canvas' );
            
            // material = new THREE.MeshBitmapMaterial( texture );
            material = new THREE.MeshBasicMaterial( { map: loadImage( urlbase ) }
            
            function loadImage( path ) {

        		var image = document.createElement( 'img' );
        		var texture = new THREE.Texture( image, THREE.UVMapping )

        		image.onload = function () { texture.loaded = true; };
        		image.src = path;

        		return texture;

        	}
            
        }
        else */
        if( m.col_diffuse ) {
            var color = (m.col_diffuse[0]*255 << 16) + (m.col_diffuse[1]*255 << 8) + m.col_diffuse[2]*255;
            material = new THREE.MeshBasicMaterial( {color:color, opacity:m.transparency} );
        }
        else if( m.a_dbg_color ) {
            material = new THREE.MeshBasicMaterial( {color:m.a_dbg_color} );
        }
        else {
            material = new THREE.MeshBasicMaterial( {color:0xffeeeeee} );
        }

        return material;
    }
    
}

Nano.prototype = new THREE.Geometry();
Nano.prototype.constructor = Nano;
