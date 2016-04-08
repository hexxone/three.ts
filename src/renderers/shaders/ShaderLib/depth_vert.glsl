#include <common>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

#if DEPTH_FORMAT != 3100

	varying float vViewZDepth;

#endif

void main() {

	#include <skinbase_vertex>

	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>

	#if DEPTH_FORMAT != 3100

		vViewZDepth = mvPosition.z;

	#endif

}
