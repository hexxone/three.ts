export * from "./animation";
export * from "./audio";
export * from "./cameras";
export * from "./core";
export * from "./extras";
export * from "./geometries";
export * from "./helpers";
export * from "./lights";
export * from "./loaders";
export * from "./materials";
export * from "./math";
export * from "./objects";
export * from "./renderers";
export * from "./scenes";
export * from "./textures";
export * from "./constants";
export * from "./utils";

import { REVISION } from "./constants";

let wasCalled = false;

export function ensureInit() {
	if (wasCalled) return;
	if (typeof window !== "undefined") {
		if (typeof __THREE_DEVTOOLS__ !== "undefined") {
			__THREE_DEVTOOLS__.dispatchEvent(
				new CustomEvent("register", {
					detail: {
						revision: REVISION,
					},
				})
			);
		}

		if (window["__THREE__"]) {
			console.warn("WARNING: Multiple instances of Three.js being imported.");
		} else {
			window["__THREE__"] = REVISION;
		}
	}
	wasCalled = true;
}
