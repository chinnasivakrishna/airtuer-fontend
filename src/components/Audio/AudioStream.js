export class AudioStream {
  constructor() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.isPlaying = false;
    this.onStateChange = null;
    this.currentSource = null;
    this.currentMessageId = null;
    this.messageBuffers = new Map();
  }

  async playAudio(arrayBuffer, messageId) {
    try {
      const newBuffer = await this.audioContext.decodeAudioData(arrayBuffer.slice(0));
      
      if (!this.messageBuffers.has(messageId)) {
        this.messageBuffers.set(messageId, newBuffer);
      } else {
        const existingBuffer = this.messageBuffers.get(messageId);
        const combinedBuffer = this.combineAudioBuffers([existingBuffer, newBuffer]);
        this.messageBuffers.set(messageId, combinedBuffer);
      }

      if (!this.isPlaying) {
        this.playMessage(messageId);
      } else if (this.currentMessageId === messageId) {
        this.updateCurrentPlayback(messageId);
      }
    } catch (error) {
      console.error('Error in playAudio:', error);
    }
  }

  updateCurrentPlayback(messageId) {
    if (!this.currentSource || this.currentMessageId !== messageId) return;
    
    const currentTime = this.currentSource.context.currentTime;
    const playbackTime = currentTime - this.currentSource.startTime;
    
    const newSource = this.audioContext.createBufferSource();
    newSource.buffer = this.messageBuffers.get(messageId);
    newSource.connect(this.audioContext.destination);
    
    this.currentSource.stop();
    
    newSource.startTime = this.audioContext.currentTime - playbackTime;
    newSource.start(0, playbackTime);
    
    this.currentSource = newSource;
    this.setupSourceEndedHandler(newSource, messageId);
  }

  playMessage(messageId) {
    const buffer = this.messageBuffers.get(messageId);
    if (!buffer) return;

    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(this.audioContext.destination);
    
    this.currentSource = source;
    this.currentMessageId = messageId;
    this.isPlaying = true;
    source.startTime = this.audioContext.currentTime;
    
    if (this.onStateChange) {
      this.onStateChange({ isPlaying: true, messageId });
    }

    this.setupSourceEndedHandler(source, messageId);
    source.start(0);
  }

  setupSourceEndedHandler(source, messageId) {
    source.onended = () => {
      if (this.currentSource === source) {
        this.isPlaying = false;
        this.currentSource = null;
        this.currentMessageId = null;
        this.messageBuffers.delete(messageId);
        
        if (this.onStateChange) {
          this.onStateChange({ isPlaying: false, messageId: null });
        }
      }
    };
  }

  reset() {
    if (this.currentSource) {
      try {
        this.currentSource.stop();
      } catch (e) {}
    }
    
    this.isPlaying = false;
    this.currentSource = null;
    this.currentMessageId = null;
    this.messageBuffers.clear();
    
    if (this.onStateChange) {
      this.onStateChange({ isPlaying: false, messageId: null });
    }
  }

  async resume() {
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
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
}

