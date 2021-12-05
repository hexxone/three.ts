import {
	CircleGeometry,
	ConeGeometry,
	CylinderGeometry,
	DodecahedronGeometry,
	EdgesGeometry,
	ExtrudeGeometry,
	IcosahedronGeometry,
	LatheGeometry,
	OctahedronGeometry,
	ParametricGeometry,
	PlaneGeometry,
	PolyhedronGeometry,
	RingGeometry,
	ShapeGeometry,
	SphereGeometry,
	TetrahedronGeometry,
	TextGeometry,
	TorusGeometry,
	TorusKnotGeometry,
	TubeGeometry,
	WireframeGeometry,
	BoxGeometry,
} from ".";

const Geometries = {
	BoxGeometry: BoxGeometry,
	CircleGeometry: CircleGeometry,
	ConeGeometry: ConeGeometry,
	CylinderGeometry: CylinderGeometry,
	DodecahedronGeometry: DodecahedronGeometry,
	EdgesGeometry: EdgesGeometry,
	ExtrudeGeometry: ExtrudeGeometry,
	IcosahedronGeometry: IcosahedronGeometry,
	LatheGeometry: LatheGeometry,
	OctahedronGeometry: OctahedronGeometry,
	ParametricGeometry: ParametricGeometry,
	PlaneGeometry: PlaneGeometry,
	PolyhedronGeometry: PolyhedronGeometry,
	RingGeometry: RingGeometry,
	ShapeGeometry: ShapeGeometry,
	SphereGeometry: SphereGeometry,
	TetrahedronGeometry: TetrahedronGeometry,
	TextGeometry: TextGeometry,
	TorusGeometry: TorusGeometry,
	TorusKnotGeometry: TorusKnotGeometry,
	TubeGeometry: TubeGeometry,
	WireframeGeometry: WireframeGeometry,
};

export * from "./BoxGeometry";
export * from "./CircleGeometry";
export * from "./ConeGeometry";
export * from "./CylinderGeometry";
export * from "./DodecahedronGeometry";
export * from "./EdgesGeometry";
export * from "./ExtrudeGeometry";
export * from "./IcosahedronGeometry";
export * from "./LatheGeometry";
export * from "./OctahedronGeometry";
export * from "./ParametricGeometry";
export * from "./PlaneGeometry";
export * from "./PolyhedronGeometry";
export * from "./RingGeometry";
export * from "./ShapeGeometry";
export * from "./SphereGeometry";
export * from "./TetrahedronGeometry";
export * from "./TextGeometry";
export * from "./TorusGeometry";
export * from "./TorusKnotGeometry";
export * from "./TubeGeometry";
export * from "./WireframeGeometry";

export { Geometries };
