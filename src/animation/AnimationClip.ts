import { NormalAnimationBlendMode } from '../constants';
import { generateUUID } from '../math/MathUtils';
import { AnimationUtils } from './AnimationUtils';
import { KeyframeTrack } from './KeyframeTrack';
import { BooleanKeyframeTrack } from './tracks/BooleanKeyframeTrack';
import { ColorKeyframeTrack } from './tracks/ColorKeyframeTrack';
import { NumberKeyframeTrack } from './tracks/NumberKeyframeTrack';
import { QuaternionKeyframeTrack } from './tracks/QuaternionKeyframeTrack';
import { StringKeyframeTrack } from './tracks/StringKeyframeTrack';
import { VectorKeyframeTrack } from './tracks/VectorKeyframeTrack';

class AnimationClip {

    name: string;
    tracks: NumberKeyframeTrack[];
    duration: number;
    blendMode: number;
    uuid: string;

    constructor(
        name,
        duration = -1,
        tracks,
        blendMode = NormalAnimationBlendMode
    ) {
        this.name = name;
        this.tracks = tracks;
        this.duration = duration;
        this.blendMode = blendMode;

        this.uuid = generateUUID();

        // this means it should figure out its duration by scanning the tracks
        if (this.duration < 0) {
            this.resetDuration();
        }
    }

    static parse(json) {
        const tracks = [];
        const jsonTracks = json.tracks;
        const frameTime = 1.0 / (json.fps || 1.0);

        for (let i = 0, n = jsonTracks.length; i !== n; ++i) {
            tracks.push(parseKeyframeTrack(jsonTracks[i]).scale(frameTime));
        }

        const clip = new this(json.name, json.duration, tracks, json.blendMode);

        clip.uuid = json.uuid;

        return clip;
    }

    static createFromMorphTargetSequence(
        name,
        morphTargetSequence,
        fps,
        noLoop
    ) {
        const numMorphTargets = morphTargetSequence.length;
        const tracks = [];

        for (let i = 0; i < numMorphTargets; i++) {
            let times = [];
            let values = [];

            times.push(
                (i + numMorphTargets - 1) % numMorphTargets,
                i,
                (i + 1) % numMorphTargets
            );

            values.push(0, 1, 0);

            const order = AnimationUtils.getKeyframeOrder(times);

            times = AnimationUtils.sortedArray(times, 1, order);
            values = AnimationUtils.sortedArray(values, 1, order);

            // if there is a key at the first frame, duplicate it as the
            // last frame as well for perfect loop.
            if (!noLoop && times[0] === 0) {
                times.push(numMorphTargets);
                values.push(values[0]);
            }

            tracks.push(
                new NumberKeyframeTrack(
                    `.morphTargetInfluences[${
                        morphTargetSequence[i].name
                    }]`,
                    times,
                    values
                ).scale(1.0 / fps)
            );
        }

        return new this(name, -1, tracks);
    }

    static findByName(objectOrClipArray, name) {
        let clipArray = objectOrClipArray;

        if (!Array.isArray(objectOrClipArray)) {
            const o = objectOrClipArray;

            clipArray = (o.geometry && o.geometry.animations) || o.animations;
        }

        for (let i = 0; i < clipArray.length; i++) {
            if (clipArray[i].name === name) {
                return clipArray[i];
            }
        }

        return null;
    }

    static CreateClipsFromMorphTargetSequences(morphTargets, fps, noLoop) {
        const animationToMorphTargets = {};

        // tested with https://regex101.com/ on trick sequences
        // such flamingo_flyA_003, flamingo_run1_003, crdeath0059
        const pattern = /^([\w-]*?)([\d]+)$/;

        // sort morph target names into animation groups based
        // patterns like Walk_001, Walk_002, Run_001, Run_002
        for (let i = 0, il = morphTargets.length; i < il; i++) {
            const morphTarget = morphTargets[i];
            const parts = morphTarget.name.match(pattern);

            if (parts && parts.length > 1) {
                const name = parts[1];

                let animationMorphTargets = animationToMorphTargets[name];

                if (!animationMorphTargets) {
                    animationToMorphTargets[name] = animationMorphTargets = [];
                }

                animationMorphTargets.push(morphTarget);
            }
        }

        const clips = [];

        for (const name in animationToMorphTargets) {
            clips.push(
                this.createFromMorphTargetSequence(
                    name,
                    animationToMorphTargets[name],
                    fps,
                    noLoop
                )
            );
        }

        return clips;
    }

    // parse the animation.hierarchy format
    static parseAnimation(animation, bones) {
        if (!animation) {
            console.error('AnimationClip: No animation in JSONLoader data.');

            return null;
        }

        const addNonemptyTrack = function(
            TrackType,
            trackName,
            animationKeys,
            propertyName,
            destTracks
        ) {
            // only return track if there are actually keys.
            if (animationKeys.length !== 0) {
                const times = [];
                const values = [];

                AnimationUtils.flattenJSON(
                    animationKeys,
                    times,
                    values,
                    propertyName
                );

                // empty keys are filtered out, so check again
                if (times.length !== 0) {
                    destTracks.push(new TrackType(trackName, times, values));
                }
            }
        };

        const tracks = [];

        const clipName = animation.name || 'default';
        const fps = animation.fps || 30;
        const { blendMode } = animation;

        // automatic length determination in AnimationClip.
        let duration = animation.length || -1;

        const hierarchyTracks = animation.hierarchy || [];

        for (let h = 0; h < hierarchyTracks.length; h++) {
            const animationKeys = hierarchyTracks[h].keys;

            // skip empty tracks
            if (!animationKeys || animationKeys.length === 0) { continue; }

            // process morph targets
            if (animationKeys[0].morphTargets) {
                // figure out all morph targets used in this track
                const morphTargetNames = {};

                let k;

                for (k = 0; k < animationKeys.length; k++) {
                    if (animationKeys[k].morphTargets) {
                        for (
                            let m = 0;
                            m < animationKeys[k].morphTargets.length;
                            m++
                        ) {
                            morphTargetNames[animationKeys[k].morphTargets[m]]
                                = -1;
                        }
                    }
                }

                // create a track for each morph target with all zero
                // morphTargetInfluences except for the keys in which
                // the morphTarget is named.
                for (const morphTargetName in morphTargetNames) {
                    const times = [];
                    const values = [];

                    for (
                        let m = 0;
                        m !== animationKeys[k].morphTargets.length;
                        ++m
                    ) {
                        const animationKey = animationKeys[k];

                        times.push(animationKey.time);
                        values.push(
                            animationKey.morphTarget === morphTargetName ? 1 : 0
                        );
                    }

                    tracks.push(
                        new NumberKeyframeTrack(
                            `.morphTargetInfluence[${morphTargetName}]`,
                            times,
                            values,
                            null
                        )
                    );
                }

                duration = Object.keys(morphTargetNames).length * (fps || 1.0);
            } else {
                // ...assume skeletal animation

                const boneName = `.bones[${bones[h].name}]`;

                addNonemptyTrack(
                    VectorKeyframeTrack,
                    `${boneName}.position`,
                    animationKeys,
                    'pos',
                    tracks
                );

                addNonemptyTrack(
                    QuaternionKeyframeTrack,
                    `${boneName}.quaternion`,
                    animationKeys,
                    'rot',
                    tracks
                );

                addNonemptyTrack(
                    VectorKeyframeTrack,
                    `${boneName}.scale`,
                    animationKeys,
                    'scl',
                    tracks
                );
            }
        }

        if (tracks.length === 0) {
            return null;
        }

        const clip = new this(clipName, duration, tracks, blendMode);

        return clip;
    }

    resetDuration() {
        const { tracks } = this;
        let duration = 0;

        for (let i = 0, n = tracks.length; i !== n; ++i) {
            const track = this.tracks[i];

            duration = Math.max(duration, track.times[track.times.length - 1]);
        }

        this.duration = duration;

        return this;
    }

    trim() {
        for (let i = 0; i < this.tracks.length; i++) {
            this.tracks[i].trim(0, this.duration);
        }

        return this;
    }

    validate() {
        let valid = true;

        for (let i = 0; i < this.tracks.length; i++) {
            valid = valid && this.tracks[i].validate();
        }

        return valid;
    }

    optimize() {
        for (let i = 0; i < this.tracks.length; i++) {
            this.tracks[i].optimize();
        }

        return this;
    }

    clone() {
        const tracks = [];

        for (let i = 0; i < this.tracks.length; i++) {
            tracks.push(this.tracks[i].clone());
        }

        return new AnimationClip(
            this.name,
            this.duration,
            tracks,
            this.blendMode
        );
    }

}

function getTrackTypeForValueTypeName(typeName): KeyframeTrack & any {
    switch (typeName.toLowerCase()) {
        case 'scalar':
        case 'double':
        case 'float':
        case 'number':
        case 'integer':
            return NumberKeyframeTrack;

        case 'vector':
        case 'vector2':
        case 'vector3':
        case 'vector4':
            return VectorKeyframeTrack;

        case 'color':
            return ColorKeyframeTrack;

        case 'quaternion':
            return QuaternionKeyframeTrack;

        case 'bool':
        case 'boolean':
            return BooleanKeyframeTrack;

        case 'string':
            return StringKeyframeTrack;
    }

    throw new Error(`KeyframeTrack: Unsupported typeName: ${typeName}`);
}

function parseKeyframeTrack(json) {
    if (json.type === undefined) {
        throw new Error('KeyframeTrack: track type undefined, can not parse');
    }

    const TrackType = getTrackTypeForValueTypeName(json.type);

    if (json.times === undefined) {
        const times = [];
        const values = [];

        AnimationUtils.flattenJSON(json.keys, times, values, 'value');

        json.times = times;
        json.values = values;
    }

    // derived classes can define a static parse method
    if (TrackType.parse !== undefined) {
        return TrackType.parse(json);
    }

    // by default, we assume a constructor compatible with the base
    return new TrackType(
        json.name,
        json.times,
        json.values,
        json.interpolation
    );
}

export { AnimationClip };
