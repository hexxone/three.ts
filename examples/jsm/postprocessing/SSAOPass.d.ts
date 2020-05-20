import {
	Camera,
	Color,
	DataTexture,
	Material,
	MeshNormalMaterial,
	Scene,
	ShaderMaterial,
	Vector3,
	WebGLRenderer,
	WebGLRenderTarget
} from '../../../src/Three';

import { Pass } from './Pass';

export class SSAOPass extends Pass {

	constructor( scene: Scene, camera: Camera, width?: number, height?: number );
	scene: Scene;
	camera: Camera;
	width: number;
	height: boolean;
	clear: boolean;
	kernelRadius: number;
	kernelSize: number;
	kernel: Vector3[];
	noiseTexture: DataTexture;
	output: number;
	minDistance: number;
	maxDistance: number;
	beautyRenderTarget: WebGLRenderTarget;
	normalRenderTarget: WebGLRenderTarget;
	ssaoRenderTarget: WebGLRenderTarget;
	blurRenderTarget: WebGLRenderTarget;
	ssaoMaterial: ShaderMaterial;
	normalMaterial: MeshNormalMaterial;
	blurMaterial: ShaderMaterial;
	depthRenderMaterial: ShaderMaterial;
	copyMaterial: ShaderMaterial;
	fsQuad: object;
	originalClearColor: Color;

	static OUTPUT: {
		Default: number;
		SSAO: number;
		Blur: number;
		Beauty: number;
		Depth: number;
		Normal: number;
	};

	dipose(): void;
	generateSampleKernel(): Vector3[];
	generateRandomKernelRotations(): void;
	renderPass( renderer: WebGLRenderer, passMaterial: Material, renderTarget: WebGLRenderTarget, clearColor?: Color | string | number, clearAlpha?: number ): void;
	renderOverride( renderer: WebGLRenderer, overrideMaterial: Material, renderTarget: WebGLRenderTarget, clearColor?: Color | string | number, clearAlpha?: number ): void;

}
