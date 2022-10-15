
/**
 * Shorthand for Typed array stuff
 * @public
 */
type NumberTypedArray =
	| Uint32Array
	| Float32Array
	| Float64Array
	| Uint8Array
	| Int8Array
	| Uint16Array
	| Int16Array
	| Int32Array;

type BigTypedArray =
	| BigUint64Array
	| BigInt64Array;

type AnyTypedArray = NumberTypedArray | BigTypedArray;
