import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  useHMSActions,
  useHMSStore,
  selectIsConnectedToRoom,
  selectPeers,
  selectLocalPeer,
  selectIsLocalAudioEnabled,
  selectIsLocalVideoEnabled,
  HMSRoomProvider
} from '@100mslive/react-sdk';
import { 
  Mic, MicOff, Video, VideoOff, PhoneOff, 
  MessageCircle
} from 'lucide-react';

const InterviewRoom = ({ roomDetails, language, difficulty, onEnd }) => {
  const hmsActions = useHMSActions();
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const peers = useHMSStore(selectPeers);
  const localPeer = useHMSStore(selectLocalPeer);
  const isLocalAudioEnabled = useHMSStore(selectIsLocalAudioEnabled);
  const isLocalVideoEnabled = useHMSStore(selectIsLocalVideoEnabled);

  const [joinError, setJoinError] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const isInitialized = useRef(false);
  const isCleaningUp = useRef(false);

  const initializeHMS = useCallback(async () => {
    if (!roomDetails?.token || isInitialized.current) {
      return;
    }

    try {
      isInitialized.current = true;
      await hmsActions.join({
        authToken: roomDetails.token,
        userName: 'Candidate',
        settings: {
          isAudioMuted: false,
          isVideoMuted: false
        },
        rememberDeviceSelection: true
      });
    } catch (error) {
      console.error('Error initializing HMS:', error);
      setJoinError(error.message || 'Failed to join interview room');
      isInitialized.current = false;
    }
  }, [hmsActions, roomDetails]);

  const cleanup = useCallback(async () => {
    if (isCleaningUp.current) {
      return;
    }

    try {
      isCleaningUp.current = true;
      if (isConnected) {
        await hmsActions.leave();
      }
    } catch (error) {
      console.error('Error during cleanup:', error);
    } finally {
      isCleaningUp.current = false;
      isInitialized.current = false;
    }
  }, [hmsActions, isConnected]);

  useEffect(() => {
    if (roomDetails?.token && !isInitialized.current) {
      initializeHMS();
    }

    return () => {
      cleanup();
    };
  }, [initializeHMS, cleanup, roomDetails]);

  const toggleAudio = async () => {
    try {
      await hmsActions.setLocalAudioEnabled(!isLocalAudioEnabled);
    } catch (error) {
      console.error('Error toggling audio:', error);
    }
  };

  const toggleVideo = async () => {
    try {
      await hmsActions.setLocalVideoEnabled(!isLocalVideoEnabled);
    } catch (error) {
      console.error('Error toggling video:', error);
    }
  };

  const handleLeaveRoom = useCallback(async () => {
    if (isCleaningUp.current) {
      return;
    }
    
    await cleanup();
    onEnd();
  }, [cleanup, onEnd]);

  const sendMessage = async () => {
    if (!message.trim() || !isConnected) return;

    try {
      await hmsActions.sendBroadcastMessage(message);
      setMessages(prev => [...prev, { sender: 'You', content: message }]);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const generateQuestions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/interview/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language,
          difficulty
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate questions');
      }

      setQuestions(data.questions);
      setCurrentQuestionIndex(0);
    } catch (error) {
      console.error('Error generating questions:', error);
      setJoinError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const submitAnswer = async (answer) => {
    setAnswers(prev => [...prev, answer]);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      analyzeAnswers();
    }
  };

  const analyzeAnswers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/interview/analyze-answers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questions,
          answers
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze answers');
      }

      setAnalysis(data.analysis);
    } catch (error) {
      console.error('Error analyzing answers:', error);
      setJoinError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (joinError) {
    return (
      <div className="h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="bg-red-500 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-2">Failed to join interview</h3>
          <p>{joinError}</p>
          <button
            onClick={onEnd}
            className="mt-4 px-4 py-2 bg-white text-red-500 rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-900 text-white">
      <div className="flex h-full">
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-4">
            <div className="grid grid-cols-2 gap-4 h-full">
              {localPeer && (
                <div className="relative bg-gray-800 rounded-lg overflow-hidden">
                  <video
                    className="w-full h-full object-cover"
                    ref={videoRef => {
                      if (videoRef && localPeer.videoTrack) {
                        hmsActions.attachVideo(localPeer.videoTrack, videoRef);
                      }
                    }}
                    autoPlay
                    muted
                    playsInline
                  />
                  <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 px-3 py-1 rounded-full">
                    You (Candidate)
                  </div>
                </div>
              )}

              {peers.filter(peer => !peer.isLocal).map(peer => (
                <div key={peer.id} className="relative bg-gray-800 rounded-lg overflow-hidden">
                  <video
                    className="w-full h-full object-cover"
                    ref={videoRef => {
                      if (videoRef && peer.videoTrack) {
                        hmsActions.attachVideo(peer.videoTrack, videoRef);
                      }
                    }}
                    autoPlay
                    playsInline
                  />
                  <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 px-3 py-1 rounded-full">
                    {peer.name} (Interviewer)
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="h-20 bg-gray-800 flex items-center justify-center gap-6">
            <button
              onClick={toggleAudio}
              className={`p-4 rounded-full ${!isLocalAudioEnabled ? 'bg-red-500' : 'bg-gray-600'}`}
            >
              {!isLocalAudioEnabled ? <MicOff size={24} /> : <Mic size={24} />}
            </button>
            <button
              onClick={toggleVideo}
              className={`p-4 rounded-full ${!isLocalVideoEnabled ? 'bg-red-500' : 'bg-gray-600'}`}
            >
              {!isLocalVideoEnabled ? <VideoOff size={24} /> : <Video size={24} />}
            </button>
            <button
              onClick={() => setShowChat(!showChat)}
              className="p-4 rounded-full bg-gray-600"
            >
              <MessageCircle size={24} />
            </button>
            <button
              onClick={handleLeaveRoom}
              className="p-4 rounded-full bg-red-500"
            >
              <PhoneOff size={24} />
            </button>
          </div>
        </div>

        {showChat && (
          <div className="w-80 bg-gray-800 p-4 flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-3">
                  <div className="font-semibold">{msg.sender}</div>
                  <div>{msg.content}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-gray-700 rounded-lg px-4 py-2 text-white"
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button
                onClick={sendMessage}
                className="px-4 py-2 bg-purple-600 rounded-lg"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="absolute top-4 left-4 bg-gray-800 rounded-lg p-4">
        <div className="text-sm opacity-80">Interview Details</div>
        <div className="font-semibold">{language} - {difficulty} Level</div>
      </div>

      {!questions.length && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 p-6 rounded-lg">
          <button
            onClick={generateQuestions}
            className="px-4 py-2 bg-blue-600 rounded-lg"
            disabled={isLoading}
          >
            {isLoading ? 'Generating Questions...' : 'Start Interview'}
          </button>
        </div>
      )}

      {questions.length > 0 && currentQuestionIndex < questions.length && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 p-6 rounded-lg">
          <div className="text-lg font-semibold mb-4">{questions[currentQuestionIndex]}</div>
          <textarea
            className="w-full p-2 bg-gray-700 rounded-lg mb-4"
            placeholder="Type your answer here..."
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            onClick={() => submitAnswer(message)}
            className="px-4 py-2 bg-blue-600 rounded-lg"
          >
            {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Submit Answers'}
          </button>
        </div>
      )}

      {analysis && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 p-6 rounded-lg">
          <div className="text-lg font-semibold mb-4">Interview Analysis</div>
          <div className="whitespace-pre-wrap">{analysis}</div>
          <button
            onClick={handleLeaveRoom}
            className="mt-4 px-4 py-2 bg-red-500 rounded-lg"
          >
            End Interview
          </button>
        </div>
      )}
    </div>
  );
};

export default function WrappedInterviewRoom(props) {
  return (
    <HMSRoomProvider>
      <InterviewRoom {...props} />
    </HMSRoomProvider>
  );
}