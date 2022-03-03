import { EventDispatcher, LinearFilter, Texture, Vector4 } from "../";

/**
 * In options, we can specify:
 * Texture parameters for an auto-generated target texture
 * depthBuffer/stencilBuffer: Booleans to indicate if we should generate these buffers
 * @public
 */
class WebGLRenderTarget extends EventDispatcher {
	width: any;
	height: any;
	depth: number;
	scissor: Vector4;
	scissorTest: boolean;
	viewport: Vector4;
	texture: Texture;
	depthBuffer: any;
	stencilBuffer: any;
	depthTexture: any;

	options: any;

	isWebGLCubeRenderTarget: boolean;
	isWebGLMultipleRenderTargets: boolean;
	isWebGLMultisampleRenderTarget: boolean;

	constructor(width: number, height: number, options?) {
		super();

		this.isWebGLRenderTarget = true;

		this.width = width;
		this.height = height;
		this.depth = 1;

		this.scissor = new Vector4(0, 0, width, height);
		this.scissorTest = false;

		this.viewport = new Vector4(0, 0, width, height);

		this.options = options = options || {};

		this.texture = new Texture(
			undefined,
			options.mapping,
			options.wrapS,
			options.wrapT,
			options.magFilter,
			options.minFilter,
			options.format,
			options.type,
			options.anisotropy,
			options.encoding
		);
		this.texture.isRenderTargetTexture = true;

		this.texture.image = {
			width,
			height,
			depth: 1,
		};

		this.texture.generateMipmaps =
			options.generateMipmaps !== undefined ? options.generateMipmaps : false;
		this.texture.minFilter =
			options.minFilter !== undefined ? options.minFilter : LinearFilter;

		this.depthBuffer =
			options.depthBuffer !== undefined ? options.depthBuffer : true;
		this.stencilBuffer =
			options.stencilBuffer !== undefined ? options.stencilBuffer : false;
		this.depthTexture =
			options.depthTexture !== undefined ? options.depthTexture : null;
	}

	setTexture(texture: Texture) {
		texture.image = {
			width: this.width,
			height: this.height,
			depth: this.depth,
		};

		this.texture = texture;
	}

	setSize(width, height, depth = 1) {
		if (
			this.width !== width ||
			this.height !== height ||
			this.depth !== depth
		) {
			this.width = width;
			this.height = height;
			this.depth = depth;

			this.texture.image.width = width;
			this.texture.image.height = height;
			this.texture.image.depth = depth;

			this.dispose();
		}

		this.viewport.set(0, 0, width, height);
		this.scissor.set(0, 0, width, height);
	}

	clone() {
		return new WebGLRenderTarget(this.width, this.height, this.options).copy(
			this
		);
	}

	copy(source: WebGLRenderTarget) {
		this.width = source.width;
		this.height = source.height;
		this.depth = source.depth;

		this.viewport.copy(source.viewport);

		this.texture = source.texture.clone();

		this.depthBuffer = source.depthBuffer;
		this.stencilBuffer = source.stencilBuffer;
		this.depthTexture = source.depthTexture;

		return this;
	}

	dispose() {
		this.dispatchEvent({ type: "dispose" });
	}
}

export { WebGLRenderTarget };
