import React, { useState, useRef, useEffect } from 'react';
import { Mic, Loader, AlertCircle, StopCircle, Sparkles, MessageSquare } from 'lucide-react';
import { AudioStream } from './AudioStream';

const VoiceInteraction = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [lastResponse, setLastResponse] = useState(null);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [showWelcome, setShowWelcome] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const transcriptWsRef = useRef(null);
  const speechWsRef = useRef(null);
  const streamRef = useRef(null);
  const audioStreamRef = useRef(null);
  const processingRef = useRef(false);
  const silenceTimeoutRef = useRef(null);
  const lastTranscriptRef = useRef('');
  const audioQueueRef = useRef([]);
  const isPlayingRef = useRef(false);

  useEffect(() => {
    audioStreamRef.current = new AudioStream();
    const timer = setTimeout(() => setShowWelcome(false), 3000);
    
    return () => {
      stopMediaTracks();
      clearTimeout(timer);
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
    };
  }, []);

  const playNextInQueue = async () => {
    if (audioQueueRef.current.length > 0 && !isPlayingRef.current) {
      isPlayingRef.current = true;
      const nextAudio = audioQueueRef.current.shift();
      try {
        await audioStreamRef.current.playAudio(nextAudio);
        isPlayingRef.current = false;
        await playNextInQueue();
      } catch (error) {
        console.error('Error playing audio:', error);
        isPlayingRef.current = false;
      }
    } else if (audioQueueRef.current.length === 0) {
      setIsSpeaking(false);
    }
  };

  const resetSilenceTimeout = () => {
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
    }
    silenceTimeoutRef.current = setTimeout(async () => {
      if (lastTranscriptRef.current.trim()) {
        await processTranscript(lastTranscriptRef.current);
        lastTranscriptRef.current = '';
      }
    }, 2000); // 2 seconds of silence
  };

  const stopMediaTracks = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (transcriptWsRef.current) {
      transcriptWsRef.current.close();
    }
    if (speechWsRef.current) {
      speechWsRef.current.close();
    }
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
    }
  };

  const connectWebSockets = async () => {
    transcriptWsRef.current = new WebSocket('wss://auriter-backend.onrender.com/ws/transcribe');
    speechWsRef.current = new WebSocket('wss://auriter-backend.onrender.com/ws/speech');
    
    transcriptWsRef.current.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'transcript' && data.data.trim()) {
        lastTranscriptRef.current = data.data;
        setLiveTranscript(prev => `${prev}\nYou: ${data.data}`);
        resetSilenceTimeout();
      }
    };
  
    speechWsRef.current.onmessage = async (event) => {
      if (event.data instanceof Blob) {
        const arrayBuffer = await event.data.arrayBuffer();
        audioQueueRef.current.push(arrayBuffer);
        setIsSpeaking(true);
        if (!isPlayingRef.current) {
          await playNextInQueue();
        }
      } else {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'error') {
            setError(data.error);
            setIsSpeaking(false);
          }
        } catch (error) {
          console.error('Error parsing speech websocket message:', error);
        }
      }
    };
  
    return new Promise((resolve) => {
      const checkConnections = () => {
        if (transcriptWsRef.current?.readyState === WebSocket.OPEN &&
            speechWsRef.current?.readyState === WebSocket.OPEN) {
          resolve();
        } else {
          setTimeout(checkConnections, 100);
        }
      };
      checkConnections();
    });
  };
  

  const initializeAudioRecording = async () => {
    try {
      stopMediaTracks();
      await connectWebSockets();

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      streamRef.current = stream;
      
      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0 && transcriptWsRef.current?.readyState === WebSocket.OPEN) {
          transcriptWsRef.current.send(event.data);
        }
      };

      setMediaRecorder(recorder);
      return recorder;
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Please enable microphone access to use voice input');
      return null;
    }
  };

  const processTranscript = async (transcript) => {
    if (processingRef.current) return;
    processingRef.current = true;

    try {
      setLoading(true);
      setError(null);

      const chatResponse = await fetch('https://auriter-backend.onrender.com/api/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          userId: 'user123',
          message: transcript
        })
      });

      if (!chatResponse.ok) {
        throw new Error(`Chat error! status: ${chatResponse.status}`);
      }

      const chatData = await chatResponse.json();
      setLastResponse(chatData.message);
      setLiveTranscript(prev => `${prev}\nAI: ${chatData.message}`);

      // Send text for speech synthesis
      if (speechWsRef.current?.readyState === WebSocket.OPEN) {
        speechWsRef.current.send(JSON.stringify({
          text: chatData.message,
          voice: 'lily', // or any other LMNT voice
          model: 'aurora',
          format: 'mp3',
          language: 'en',
          sample_rate: 24000,
          conversational: true
        }));
      }

    } catch (error) {
      console.error('Error in voice interaction:', error);
      setError('Failed to process voice interaction. Please try again.');
    } finally {
      setLoading(false);
      processingRef.current = false;
    }
  };

  const startRecording = async () => {
    try {
      const recorder = await initializeAudioRecording();
      if (recorder && recorder.state === 'inactive') {
        setIsRecording(true);
        setError(null);
        setLiveTranscript('');
        audioStreamRef.current.reset();
        recorder.start(1000);
      }
    } catch (error) {
      console.error('Error starting recording:', error);
      setError('Failed to start recording. Please try again.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      setIsRecording(false);
      mediaRecorder.stop();
      stopMediaTracks();
    }
  };

  const MessageBubble = ({ isUser, text }) => (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[80%] p-4 rounded-2xl ${
          isUser
            ? 'bg-purple-600 text-white rounded-tr-none'
            : 'bg-white text-gray-800 rounded-tl-none'
        } shadow-md`}
      >
        <div className="flex items-center gap-2 mb-1">
          <div className={`text-sm font-medium ${isUser ? 'text-purple-100' : 'text-purple-600'}`}>
            {isUser ? 'You' : 'AI Assistant'}
          </div>
        </div>
        <div className="text-sm leading-relaxed">{text}</div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Welcome Banner */}
      <div
        className={`
          fixed top-0 left-0 right-0 z-50
          transition-transform duration-700 ease-in-out
          ${showWelcome ? 'translate-y-0' : '-translate-y-full'}
        `}
      >
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4">
          <div className="flex items-center justify-center gap-2 max-w-4xl mx-auto">
            <Sparkles size={20} className="animate-pulse" />
            <span className="font-medium">Voice AI Assistant</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-4xl mx-auto w-full p-4 mt-16">
        {/* Chat Container */}
        <div className="bg-gray-100 rounded-2xl p-6 h-[calc(100vh-180px)] flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto mb-6 space-y-4">
            {liveTranscript.split('\n').map((message, index) => {
              if (message.startsWith('You: ')) {
                return (
                  <MessageBubble
                    key={index}
                    isUser={true}
                    text={message.replace('You: ', '')}
                  />
                );
              } else if (message.startsWith('AI: ')) {
                return (
                  <MessageBubble
                    key={index}
                    isUser={false}
                    text={message.replace('AI: ', '')}
                  />
                );
              }
              return null;
            })}
          </div>

          {/* Control Area */}
          <div className="flex justify-center items-center gap-4">
            {error && (
              <div className="absolute bottom-full mb-4 left-1/2 transform -translate-x-1/2 w-80 p-4 bg-red-50 text-red-700 rounded-xl text-sm flex items-center gap-2 shadow-lg border border-red-100">
                <AlertCircle size={16} />
                <span className="flex-1">{error}</span>
              </div>
            )}

            {isRecording && (
              <div className="flex items-center gap-2 bg-red-50 px-6 py-3 rounded-full text-red-600 animate-pulse">
                <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                <span className="text-sm font-medium">Recording...</span>
              </div>
            )}

            <button
              onClick={() => isRecording ? stopRecording() : startRecording()}
              className={`
                relative w-16 h-16 rounded-full 
                transition-all duration-300 transform
                flex items-center justify-center shadow-lg
                ${isRecording 
                  ? 'bg-red-500 hover:bg-red-600 scale-110' 
                  : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600'
                }
                ${loading ? 'opacity-70' : 'hover:scale-105'}
              `}
              disabled={loading}
            >
              {loading ? (
                <Loader className="animate-spin text-white" size={24} />
              ) : isRecording ? (
                <StopCircle size={24} className="text-white" />
              ) : (
                <Mic size={24} className="text-white" />
              )}

              {isRecording && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceInteraction;