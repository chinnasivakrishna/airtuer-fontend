export class ConversationRecorder {
    constructor() {
      this.mediaRecorder = null;
      this.audioChunks = [];
      this.startTime = null;
      this.stream = null;
      this.recordingBlob = null;
    }
  
    async startRecording() {
      this.audioChunks = [];
      this.startTime = new Date();
      
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 48000,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
  
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(audioStream);
      const destination = audioContext.createMediaStreamDestination();
      source.connect(destination);
  
      this.stream = destination.stream;
      this.mediaRecorder = new MediaRecorder(this.stream);
  
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };
  
      this.mediaRecorder.start();
      return audioStream;
    }
  
    async stopRecording() {
      return new Promise((resolve) => {
        this.mediaRecorder.onstop = async () => {
          this.recordingBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
          this.stream.getTracks().forEach(track => track.stop());
          resolve(this.recordingBlob);
        };
        
        this.mediaRecorder.stop();
      });
    }
  
    getRecordingData() {
      return {
        blob: this.recordingBlob,
        startTime: this.startTime,
        duration: this.startTime ? new Date() - this.startTime : 0
      };
    }
  }