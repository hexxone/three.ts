import { FileLoader } from "./FileLoader";
import { Loader } from "./Loader";
import { AudioContext } from "../audio/AudioContext";

class AudioLoader extends Loader {
	constructor(manager) {
		super(manager);
	}

	load(url, onLoad, onProgress, onError) {
		const scope = this;

		const loader = new FileLoader(this.manager);
		loader.setResponseType("arraybuffer");
		loader.setPath(this.path);
		loader.setRequestHeader(this.requestHeader);
		loader.setWithCredentials(this.withCredentials);
		loader.load(
			url,
			function (buffer) {
				try {
					// Create a copy of the buffer. The `decodeAudioData` method
					// detaches the buffer when complete, preventing reuse.
					const bufferCopy = buffer.slice(0);

					const context = AudioContext.getContext();
					context.decodeAudioData(bufferCopy, function (audioBuffer) {
						onLoad(audioBuffer);
					});
				} catch (e) {
					if (onError) {
						onError(e);
					} else {
						console.error(e);
					}

					scope.manager.itemError(url);
				}
			},
			onProgress,
			onError
		);
	}
}

export { AudioLoader };
