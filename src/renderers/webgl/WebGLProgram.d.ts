import { WebGLRenderer } from './../WebGLRenderer';
import { WebGLShader } from './WebGLShader';
import { WebGLUniforms } from './WebGLUniforms';

export class WebGLProgram {

	constructor(
		renderer: WebGLRenderer,
		cacheKey: string,
		parameters: object
	);

	name: string;
	id: number;
	cacheKey: string; // unique identifier for this program, used for looking up compiled programs from cache.
	usedTimes: number;
	program: any;
	vertexShader: string;
	fragmentShader: string;
	numMultiviewViews: number;
	/**
	 * @deprecated Use {@link WebGLProgram#getUniforms getUniforms()} instead.
	 */
	uniforms: any;
	/**
	 * @deprecated Use {@link WebGLProgram#getAttributes getAttributes()} instead.
	 */
	attributes: any;

	getUniforms(): WebGLUniforms;
	getAttributes(): any;
	destroy(): void;

}
