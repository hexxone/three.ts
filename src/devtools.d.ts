declare let __THREE_DEVTOOLS__: {
    dispatchEvent(event: Event): void;
};

interface Window {
    __THREE__?: string;
    webkitAudioContext?: typeof AudioContext;
}
