import { Object3D } from '../core/Object3D';
import { Vector2 } from '../math/Vector2';
import { Vector3 } from '../math/Vector3';

export type IIntersection = {
    distance: number;
    point: Vector3;
    object: Object3D;
    index?: number;
    face?: {
        a: number;
        b: number;
        c: number;
        normal: Vector3;
        materialIndex: number;
    };
    faceIndex?: number;
    uv2?: Vector2;
    uv?: Vector2;
}
