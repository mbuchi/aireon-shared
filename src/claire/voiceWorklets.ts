// AudioWorkletProcessor source strings, shipped inline. Consumers don't need
// to expose a separate static asset path — the transport materialises a Blob
// URL at runtime and registers each module against its AudioContext.
//
// The mic processor runs on a 16 kHz AudioContext and converts each Float32
// sample to signed 16-bit PCM, then posts ~100 ms buffers up to the main
// thread to forward over the WebSocket. The speaker processor runs on a
// 24 kHz AudioContext, holds a queue of Int16 buffers received from the
// server, and outputs Float32 samples one at a time. Both processors are
// intentionally tiny — no resampling, no buffering policy — so they stay
// well under the 2 ms render quantum on any modern device.

export const MIC_WORKLET_SOURCE = `
class ClaireMicProcessor extends AudioWorkletProcessor {
    constructor(options) {
        super();
        const opts = (options && options.processorOptions) || {};
        // 1600 samples at 16 kHz = 100 ms. Smaller buffers raise mic-to-cloud
        // latency; larger buffers raise WebSocket framing overhead.
        this.bufferSize = opts.bufferSize || 1600;
        this.buffer = new Int16Array(this.bufferSize);
        this.index = 0;
    }
    process(inputs) {
        const input = inputs[0];
        if (!input || input.length === 0) return true;
        const channel = input[0];
        if (!channel) return true;
        for (let i = 0; i < channel.length; i++) {
            let s = channel[i];
            if (s > 1) s = 1; else if (s < -1) s = -1;
            this.buffer[this.index++] = s < 0 ? s * 0x8000 : s * 0x7fff;
            if (this.index >= this.bufferSize) {
                this.port.postMessage(this.buffer.slice(0, this.index));
                this.index = 0;
            }
        }
        return true;
    }
}
registerProcessor('claire-mic-processor', ClaireMicProcessor);
`;

export const SPEAKER_WORKLET_SOURCE = `
class ClaireSpeakerProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.queue = [];
        this.current = null;
        this.idx = 0;
        this.port.onmessage = (event) => {
            const d = event.data;
            if (!d) return;
            if (d.type === 'audio' && d.samples) {
                this.queue.push(d.samples);
            } else if (d.type === 'clear') {
                this.queue = [];
                this.current = null;
                this.idx = 0;
            }
        };
    }
    process(_inputs, outputs) {
        const output = outputs[0];
        if (!output || output.length === 0) return true;
        const channel = output[0];
        for (let i = 0; i < channel.length; i++) {
            while (!this.current || this.idx >= this.current.length) {
                if (this.queue.length === 0) {
                    this.current = null;
                    break;
                }
                this.current = this.queue.shift();
                this.idx = 0;
            }
            channel[i] = this.current ? this.current[this.idx++] / 0x8000 : 0;
        }
        return true;
    }
}
registerProcessor('claire-speaker-processor', ClaireSpeakerProcessor);
`;
