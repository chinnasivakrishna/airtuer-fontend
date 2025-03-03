// deepgramStreaming.js
const WebSocket = require('ws');

class DeepgramStreamingClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.ws = null;
    this.onTranscript = null;
  }

  connect() {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket('wss://api.deepgram.com/v1/listen', {
          headers: {
            Authorization: `Token ${this.apiKey}`
          }
        });

        this.ws.onopen = () => {
          console.log('Connected to Deepgram WebSocket server');
          resolve();
        };

        this.ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.channel && this.onTranscript) {
            const transcript = data.channel.alternatives[0].transcript;
            if (transcript.trim()) {
              this.onTranscript(transcript);
            }
          }
        };

        this.ws.onerror = (error) => {
          console.error('Deepgram WebSocket error:', error);
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('Deepgram WebSocket connection closed');
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  sendAudio(audioData) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(audioData);
    }
  }

  close() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

module.exports = { DeepgramStreamingClient };