export class AudioStream {
  constructor() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.isPlaying = false;
    this.onStateChange = null;
    this.currentSource = null;
    this.audioBuffer = null;
    this.audioQueue = [];
  }

  async playAudio(arrayBuffer) {
    try {
      const newBuffer = await this.audioContext.decodeAudioData(arrayBuffer.slice(0));
      if (!this.audioBuffer) {
        this.audioBuffer = newBuffer;
      } else {
        const combinedBuffer = this.combineAudioBuffers([this.audioBuffer, newBuffer]);
        this.audioBuffer = combinedBuffer;
      }

      if (!this.isPlaying) {
        this.playBuffer();
      }
    } catch (error) {
      console.error('Error processing audio:', error);
    }
  }

  combineAudioBuffers(buffers) {
    const totalLength = buffers.reduce((total, buffer) => total + buffer.length, 0);
    const combinedBuffer = this.audioContext.createBuffer(
      1,
      totalLength,
      this.audioContext.sampleRate
    );
    const channelData = combinedBuffer.getChannelData(0);

    let offset = 0;
    buffers.forEach(buffer => {
      channelData.set(buffer.getChannelData(0), offset);
      offset += buffer.length;
    });

    return combinedBuffer;
  }

  playBuffer() {
    if (!this.audioBuffer || this.isPlaying) return;

    const source = this.audioContext.createBufferSource();
    source.buffer = this.audioBuffer;
    source.connect(this.audioContext.destination);
    
    this.currentSource = source;
    this.isPlaying = true;
    
    if (this.onStateChange) {
      this.onStateChange({ isPlaying: true });
    }

    source.onended = () => {
      this.isPlaying = false;
      this.currentSource = null;
      this.audioBuffer = null;
      
      if (this.onStateChange) {
        this.onStateChange({ isPlaying: false });
      }
    };
    
    source.start(0);
  }

  reset() {
    if (this.currentSource) {
      try {
        this.currentSource.stop();
      } catch (e) {}
    }
    
    this.audioBuffer = null;
    this.isPlaying = false;
    this.currentSource = null;
    
    if (this.onStateChange) {
      this.onStateChange({ isPlaying: false });
    }
  }

  async resume() {
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }
}