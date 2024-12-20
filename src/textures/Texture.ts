import { ClampToEdgeWrapping,
    LinearEncoding,
    LinearFilter,
    LinearMipmapLinearFilter,
    MirroredRepeatWrapping,
    RepeatWrapping,
    RGBAFormat,
    UnsignedByteType,
    UVMapping } from '../constants';
import { EventDispatcher } from '../core/EventDispatcher';
import { ImageUtils } from '../extras/ImageUtils';
import { generateUUID } from '../math/MathUtils';
import { Matrix3 } from '../math/Matrix3';
import { Vector2 } from '../math/Vector2';
import { DataTexture } from './DataTexture';

let textureId = 0;

/**
 * @public
 */
export type IImage = {
    data?: ArrayBufferView | ArrayBufferLike | number[];
    width?: number;
    height?: number;
    depth?: number;

    length?: number;

    complete?: boolean;
    readyState?: number;
    HAVE_CURRENT_DATA?: number;
};

/**
 * @public
 */
export class Texture extends EventDispatcher {

    static DEFAULT_IMAGE: any;
    static DEFAULT_MAPPING: any;

    uuid: string;
    name: string;
    image: Partial<TexImageSource & IImage>;

    mipmaps: any[];
    mapping: any;
    wrapS: number;
    wrapT: number;
    magFilter: number;
    minFilter: number;
    anisotropy: number;
    format: number;
    internalFormat: any;
    type: number;
    offset: Vector2;
    repeat: Vector2;
    center: Vector2;
    rotation: number;
    matrixAutoUpdate: boolean;
    matrix: Matrix3;
    generateMipmaps: boolean;
    premultiplyAlpha: boolean;
    flipY: boolean;
    unpackAlignment: number;
    encoding: number;
    version: number;
    onUpdate: any;

    isTexture = true;
    isCubeTexture: boolean;
    isDepthTexture: boolean;
    isCanvasTexture: boolean;
    isVideoTexture: boolean;

    isDataTexture: boolean;
    isDataTexture3D: boolean;
    isDataTexture2DArray: boolean;
    isCompressedTexture: boolean;
    isRenderTargetTexture: boolean;

    constructor(
        image = Texture.DEFAULT_IMAGE,
        mapping = Texture.DEFAULT_MAPPING,
        wrapS = ClampToEdgeWrapping,
        wrapT = ClampToEdgeWrapping,
        magFilter = LinearFilter,
        minFilter = LinearMipmapLinearFilter,
        format = RGBAFormat,
        type = UnsignedByteType,
        anisotropy = 1,
        encoding = LinearEncoding
    ) {
        super();

        Object.defineProperty(this, 'id', {
            value: textureId++
        });

        this.uuid = generateUUID();

        this.name = '';

        this.image = image;
        this.mipmaps = [];

        this.mapping = mapping;

        this.wrapS = wrapS;
        this.wrapT = wrapT;

        this.magFilter = magFilter;
        this.minFilter = minFilter;

        this.anisotropy = anisotropy;

        this.format = format;
        this.internalFormat = null;
        this.type = type;

        this.offset = new Vector2(0, 0);
        this.repeat = new Vector2(1, 1);
        this.center = new Vector2(0, 0);
        this.rotation = 0;

        this.matrixAutoUpdate = true;
        this.matrix = new Matrix3();

        this.generateMipmaps = true;
        this.premultiplyAlpha = false;
        this.flipY = true;
        this.unpackAlignment = 4; // valid values: 1, 2, 4, 8 (see http://www.khronos.org/opengles/sdk/docs/man/xhtml/glPixelStorei.xml)

        // Values of encoding !== LinearEncoding only supported on map, envMap and emissiveMap.
        //
        // Also changing the encoding after already used by a Material will not automatically make the Material
        // update. You need to explicitly call Material.needsUpdate to trigger it to recompile.
        this.encoding = encoding;

        this.version = 0;
        this.onUpdate = null;

        this.isRenderTargetTexture = false;
    }

    updateMatrix() {
        this.matrix.setUvTransform(
            this.offset.x,
            this.offset.y,
            this.repeat.x,
            this.repeat.y,
            this.rotation,
            this.center.x,
            this.center.y
        );
    }

    clone() {
        return new Texture().copy(this);
    }

    copy(source: Texture) {
        this.name = source.name;

        this.image = source.image;
        this.mipmaps = source.mipmaps.slice(0);

        this.mapping = source.mapping;

        this.wrapS = source.wrapS;
        this.wrapT = source.wrapT;

        this.magFilter = source.magFilter;
        this.minFilter = source.minFilter;

        this.anisotropy = source.anisotropy;

        this.format = source.format;
        this.internalFormat = source.internalFormat;
        this.type = source.type;

        this.offset.copy(source.offset);
        this.repeat.copy(source.repeat);
        this.center.copy(source.center);
        this.rotation = source.rotation;

        this.matrixAutoUpdate = source.matrixAutoUpdate;
        this.matrix.copy(source.matrix);

        this.generateMipmaps = source.generateMipmaps;
        this.premultiplyAlpha = source.premultiplyAlpha;
        this.flipY = source.flipY;
        this.unpackAlignment = source.unpackAlignment;
        this.encoding = source.encoding;

        return this;
    }

    dispose() {
        this.dispatchEvent({
            type: 'dispose'
        });
    }

    dispatchEvent(_arg0: { type: string }) {
        throw new Error('Method not implemented.');
    }

    transformUv(uv) {
        if (this.mapping !== UVMapping) {
            return uv;
        }

        uv.applyMatrix3(this.matrix);

        if (uv.x < 0 || uv.x > 1) {
            switch (this.wrapS) {
                case RepeatWrapping:
                    uv.x -= Math.floor(uv.x);
                    break;

                case ClampToEdgeWrapping:
                    uv.x = uv.x < 0 ? 0 : 1;
                    break;

                case MirroredRepeatWrapping:
                    if (Math.abs(Math.floor(uv.x) % 2) === 1) {
                        uv.x = Math.ceil(uv.x) - uv.x;
                    } else {
                        uv.x -= Math.floor(uv.x);
                    }

                    break;
            }
        }

        if (uv.y < 0 || uv.y > 1) {
            switch (this.wrapT) {
                case RepeatWrapping:
                    uv.y -= Math.floor(uv.y);
                    break;

                case ClampToEdgeWrapping:
                    uv.y = uv.y < 0 ? 0 : 1;
                    break;

                case MirroredRepeatWrapping:
                    if (Math.abs(Math.floor(uv.y) % 2) === 1) {
                        uv.y = Math.ceil(uv.y) - uv.y;
                    } else {
                        uv.y -= Math.floor(uv.y);
                    }

                    break;
            }
        }

        if (this.flipY) {
            uv.y = 1 - uv.y;
        }

        return uv;
    }

    set needsUpdate(value) {
        if (value === true) {
            this.version++;
        }
    }

}

Texture.DEFAULT_IMAGE = undefined;
Texture.DEFAULT_MAPPING = UVMapping;

export function serializeImage(image: HTMLImageElement | HTMLCanvasElement | ImageBitmap | DataTexture) {
    if (
        (typeof HTMLImageElement !== 'undefined'
            && image instanceof HTMLImageElement)
        || (typeof HTMLCanvasElement !== 'undefined'
            && image instanceof HTMLCanvasElement)
        || (typeof ImageBitmap !== 'undefined' && image instanceof ImageBitmap)
    ) {
        // default images

        return ImageUtils.getDataURL(image);
    }

    if (image instanceof DataTexture) {
        // images of DataTexture

        return {
            data: Array.prototype.slice.call(image.image.data),
            width: image.image.width,
            height: image.image.height,
            type: image.image.data.constructor.name
        };
    }

    console.warn('Texture: Unable to serialize Texture.');

    return {};
}
