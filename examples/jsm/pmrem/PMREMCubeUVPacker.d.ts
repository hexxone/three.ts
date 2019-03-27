import {
  CubeTexture,
  Renderer,
  ShaderMaterial,
  WebGLRenderTarget
} from '../../../src/Three';

export class PMREMCubeUVPacker {
  CubeUVRenderTarget:WebGLRenderTarget;

  constructor(cubeTextureLods: CubeTexture[]);
  update(renderer:Renderer): void;
  dispose(): void;
}
