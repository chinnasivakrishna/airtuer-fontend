export class AudioStream {
    constructor() {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.queue = [];
      this.isPlaying = false;
    }
  
    async playAudio(arrayBuffer) {
      try {
        const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer.slice(0));
        const source = this.audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(this.audioContext.destination);
        
        if (this.isPlaying) {
          this.queue.push(source);
        } else {
          this.playSource(source);
        }
      } catch (error) {
        console.error('Error playing audio:', error);
      }
    }
  
    playSource(source) {
      this.isPlaying = true;
      
      source.onended = () => {
        this.isPlaying = false;
        if (this.queue.length > 0) {
          this.playSource(this.queue.shift());
        }
      };
  
      try {
        source.start(0);
      } catch (error) {
        console.error('Error starting audio source:', error);
        this.isPlaying = false;
        if (this.queue.length > 0) {
          this.playSource(this.queue.shift());
        }
      }
    }
  
    reset() {
      this.queue = [];
      this.isPlaying = false;
    }
  
    async resume() {
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
    }
  }
  