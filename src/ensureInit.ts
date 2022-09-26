import { REVISION } from "./constants";

export let wasCalled = false;

export function ensureInit() {
	if (wasCalled)
		return;
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
