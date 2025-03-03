import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Paperclip, Mic, Volume2, VolumeX, Loader, Clock, Search } from 'lucide-react';
import { AudioStream } from '../Audio/AudioStream';

const ChatContent = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentPlayingId, setCurrentPlayingId] = useState(null);

  const transcriptWsRef = useRef(null);
  const speechWsRef = useRef(null);
  const streamRef = useRef(null);
  const audioStreamRef = useRef(null);
  const processingRef = useRef(false);
  const messagesEndRef = useRef(null);
  const audioChunksRef = useRef([]);
  const userId = "user123";

  useEffect(() => {
    audioStreamRef.current = new AudioStream();
    fetchChatHistory();
    return () => {
      stopMediaTracks();
      if (audioStreamRef.current) {
        audioStreamRef.current.reset();
      }
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchChatHistory = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/chat/history/${userId}`, {
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      if (data.length > 0) {
        setMessages(data[0].messages);
      }
    } catch (error) {
      setError('Failed to load chat history. Please refresh the page.');
    }
  };

  const connectWebSockets = async () => {
    try {
      if (transcriptWsRef.current) transcriptWsRef.current.close();
      if (speechWsRef.current) speechWsRef.current.close();

      setError(null);
      setIsPlaying(false);

      transcriptWsRef.current = new WebSocket(
        'ws://localhost:5000/ws/transcribe?language=en&model=nova-2'
      );

      await new Promise((resolve, reject) => {
        transcriptWsRef.current.onopen = resolve;
        transcriptWsRef.current.onerror = reject;
      });

      transcriptWsRef.current.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'transcript' && data.data.trim()) {
            await handleTranscriptMessage(data.data);
          }
        } catch (error) {
          console.error('Transcript WebSocket Message Error:', error);
        }
      };
    } catch (error) {
      setError('Failed to connect WebSockets');
    }
  };

  const handleTranscriptMessage = async (transcript) => {
    if (processingRef.current) return;
    processingRef.current = true;

    try {
      await handleSend(transcript);
    } catch (error) {
      setError('Failed to process transcript');
    } finally {
      processingRef.current = false;
    }
  };

  const speakText = async (text, messageId) => {
    try {
      if (currentPlayingId === messageId && isPlaying) {
        audioStreamRef.current.reset();
        setIsPlaying(false);
        setCurrentPlayingId(null);
        return;
      }

      setIsPlaying(true);
      setCurrentPlayingId(messageId);
      setError(null);

      if (!audioStreamRef.current) {
        audioStreamRef.current = new AudioStream();
      }
      
      await audioStreamRef.current.resume();

      const ws = new WebSocket('ws://localhost:5000/ws/speech');
      
      ws.onopen = () => {
        const request = {
          text,
          voice: 'lily',
          language: 'en',
          speed: 1.0
        };
        ws.send(JSON.stringify(request));
      };

      ws.onmessage = async (event) => {
        try {
          if (event.data instanceof Blob) {
            const arrayBuffer = await event.data.arrayBuffer();
            await audioStreamRef.current.playAudio(arrayBuffer);
          } else {
            const data = JSON.parse(event.data);
            if (data.type === 'end') {
              setIsPlaying(false);
              setCurrentPlayingId(null);
              ws.close();
            } else if (data.type === 'error') {
              throw new Error(data.error);
            }
          }
        } catch (error) {
          setError('Failed to play audio');
          setIsPlaying(false);
          setCurrentPlayingId(null);
          ws.close();
        }
      };

      ws.onerror = () => {
        setError('Connection error occurred');
        setIsPlaying(false);
        setCurrentPlayingId(null);
      };

      ws.onclose = () => {
        if (isPlaying) {
          setIsPlaying(false);
          setCurrentPlayingId(null);
        }
      };
    } catch (error) {
      setError(`Failed to synthesize speech: ${error.message}`);
      setIsPlaying(false);
      setCurrentPlayingId(null);
    }
  };

  const startRecording = async () => {
    try {
      await connectWebSockets();
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: 48000,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0 && transcriptWsRef.current?.readyState === WebSocket.OPEN) {
          transcriptWsRef.current.send(event.data);
        }
      };

      recorder.onstop = () => {
        stopMediaTracks();
      };

      setMediaRecorder(recorder);
      setIsRecording(true);
      setError(null);
      audioStreamRef.current.reset();
      recorder.start(250);
    } catch (err) {
      setError('Failed to start recording. Please check microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      setIsRecording(false);
    }
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
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = async (voiceInput) => {
    const messageText = voiceInput || input;
    if ((!messageText.trim() && !voiceInput) || loading) return;

    setLoading(true);
    setError(null);
    
    const userMessage = {
      content: messageText,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const response = await fetch('http://localhost:5000/api/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          userId,
          message: messageText,
          isVoiceInteraction: Boolean(voiceInput)
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.chatHistory) {
        setMessages(data.chatHistory);
        if (voiceInput && data.chatHistory.length > 0) {
          const lastMessage = data.chatHistory[data.chatHistory.length - 1];
          if (!lastMessage.isUser) {
            await speakText(lastMessage.content, data.chatHistory.length - 1);
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
      setMessages(prev => prev.filter(msg => msg !== userMessage));
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const MessageComponent = ({ message, index }) => (
    <div className={`mb-6 flex ${message.isUser ? 'justify-end' : 'justify-start'} group`}>
      <div className={`max-w-[70%] rounded-2xl p-4 shadow-sm transition-all duration-200 ${
        message.isUser
          ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:shadow-md'
          : 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 hover:shadow-md'
      }`}>
        <div className="break-words whitespace-pre-wrap text-[15px] leading-relaxed">
          {message.content}
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <Clock size={14} className={message.isUser ? 'text-purple-200' : 'text-gray-400'} />
            <span className={`text-xs ${message.isUser ? 'text-purple-200' : 'text-gray-500'}`}>
              {formatTimestamp(message.timestamp)}
            </span>
          </div>
          {!message.isUser && (
            <button
              onClick={() => speakText(message.content, index)}
              className="text-gray-400 hover:text-purple-600 transition-all duration-200 flex items-center gap-1"
              disabled={isPlaying && currentPlayingId !== index}
            >
              {isPlaying && currentPlayingId === index ? (
                <>
                  <VolumeX size={16} className="animate-pulse" />
                  <span className="text-xs">Stop</span>
                </>
              ) : (
                <>
                  <Volume2 size={16} className="hover:scale-110" />
                  <span className="text-xs">Listen</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-full gap-6 p-4 bg-gray-50">
      <div className="flex-1 flex flex-col bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="border-b bg-white p-4">
          <div className="flex items-center gap-3">
            <MessageSquare className="text-purple-600" size={24} />
            <h2 className="text-xl font-semibold">Chat Assistant</h2>
          </div>
        </div>

        {error && (
          <div className="p-4 mx-4 mt-4 text-red-700 bg-red-100 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6">
          {messages.map((message, index) => (
            <MessageComponent 
              key={index} 
              message={message} 
              index={index} 
            />
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t p-4 bg-white">
          <div className="flex items-center gap-3">
            <button className="p-2.5 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-110">
              <Paperclip size={20} className="text-gray-500" />
            </button>
            
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 p-3 border rounded-xl focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 max-h-32 resize-y transition-shadow duration-200"
              disabled={loading}
              rows={1}
            />
            
            <button
              onClick={() => isRecording ? stopRecording() : startRecording()}
              className={`p-2.5 rounded-full transition-all duration-200 hover:scale-110 ${
                isRecording ? 'bg-red-500 hover:bg-red-600' : 'hover:bg-gray-100'
              }`}
              disabled={loading}
            >
              <Mic size={20} className={isRecording ? 'text-white' : 'text-gray-500'} />
            </button>
            
            <button
              onClick={() => handleSend()}
              disabled={loading || (!input.trim() && !isRecording)}
              className={`p-2.5 rounded-full transition-all duration-200 ${
                loading || (!input.trim() && !isRecording)
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700 hover:scale-110 text-white'
              }`}
            >
              {loading ? (
                <Loader className="animate-spin" size={20} />
              ) : (
                <Send size={20} />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="w-80 bg-white rounded-xl shadow-lg flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Chat History</h2>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {messages.filter(m => !m.isUser).map((message, index) => (
              <div
                key={index}
                className="group p-4 bg-gray-50 rounded-xl hover:bg-white hover:shadow-md cursor-pointer transition-all duration-200"
              >
                <p className="text-sm text-gray-800 line-clamp-2 leading-relaxed">
                  {message.content}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {formatTimestamp(message.timestamp)}
                    </span>
                  </div>
                  <button
                    onClick={() => speakText(message.content, `history-${index}`)}
                    className="text-gray-400 hover:text-purple-600 transition-all duration-200 flex items-center gap-1"
                    disabled={isPlaying && currentPlayingId !== `history-${index}`}
                    title={isPlaying && currentPlayingId === `history-${index}` ? "Stop" : "Listen"}
                  >
                    {isPlaying && currentPlayingId === `history-${index}` ? (
                      <>
                        <VolumeX size={16} className="animate-pulse" />
                        <span className="text-xs">Stop</span>
                      </>
                    ) : (
                      <>
                        <Volume2 size={16} className="hover:scale-110" />
                        <span className="text-xs">Listen</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatContent;