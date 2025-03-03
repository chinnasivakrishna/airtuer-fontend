import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const InterviewRoom = () => {
  const { roomId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [userResponse, setUserResponse] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [interviewTime, setInterviewTime] = useState(null);
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    const fetchInterviewDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/interview/details/${roomId}`);
        const { date, time } = response.data;
  
        const interviewDateTime = new Date(`${date}T${time}`);
        setInterviewTime(interviewDateTime);
  
        const currentTime = new Date();
        if (currentTime >= interviewDateTime) {
          setIsInterviewActive(true);
          fetchQuestions();
        } else {
          setIsInterviewActive(false);
        }
      } catch (error) {
        console.error('Error fetching interview details:', error);
      }
    };
  
    fetchInterviewDetails();
  }, [roomId]);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/interview/questions/${roomId}`);
      setQuestions(response.data.questions);
      setCurrentQuestion(response.data.questions[0]);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleNextQuestion = () => {
    const nextIndex = questions.indexOf(currentQuestion) + 1;
    if (nextIndex < questions.length) {
      setCurrentQuestion(questions[nextIndex]);
    } else {
      alert('Interview completed!');
      analyzeResponses();
    }
  };

  const handleSubmitResponse = async () => {
    try {
      await axios.post(`http://localhost:5000/api/interview/response/${roomId}`, {
        question: currentQuestion,
        response: userResponse,
      });
      alert('Response submitted successfully!');
      setUserResponse('');
      handleNextQuestion();
    } catch (error) {
      console.error('Error submitting response:', error);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const formData = new FormData();
        formData.append('file', audioBlob, 'recording.wav');
        const response = await axios.post('http://localhost:5000/api/transcribe', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setTranscript(response.data.transcript);
        setUserResponse(response.data.transcript);
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const analyzeResponses = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/analyze', {
        questions,
        answers: questions.map((q, i) => userResponse),
      });
      setAnalysis(response.data.analysis);
    } catch (error) {
      console.error('Error analyzing responses:', error);
    }
  };

  if (!isInterviewActive) {
    return (
      <div style={{ width: '100%', height: '100vh', padding: '20px' }}>
        <h1>Interview Not Active</h1>
        <p>The interview is scheduled for {interviewTime?.toLocaleString()}.</p>
      </div>
    );
  }

  if (isLoading) {
    return <div>Loading interview questions...</div>;
  }

  if (analysis) {
    const data = {
      labels: questions,
      datasets: [
        {
          label: 'Performance',
          data: analysis.scores,
          borderColor: 'rgba(75,192,192,1)',
          fill: false,
        },
      ],
    };

    return (
      <div style={{ width: '100%', height: '100vh', padding: '20px' }}>
        <h1>Interview Results</h1>
        <Line data={data} />
        <h2>Detailed Analysis</h2>
        <ul>
          {analysis.details.map((detail, index) => (
            <li key={index}>{detail}</li>
          ))}
        </ul>
        <h2>Skill Improvement Suggestions</h2>
        <ul>
          {analysis.suggestions.map((suggestion, index) => (
            <li key={index}>{suggestion}</li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100vh', padding: '20px' }}>
      <h1>Mock Interview</h1>
      <div>
        <h2>Question:</h2>
        <p>{currentQuestion}</p>
      </div>
      <div>
        <h2>Your Response:</h2>
        <textarea
          value={userResponse}
          onChange={(e) => setUserResponse(e.target.value)}
          rows={5}
          style={{ width: '100%' }}
        />
        <button onClick={isRecording ? stopRecording : startRecording}>
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
      </div>
      <button onClick={handleSubmitResponse}>Submit Response</button>
      <button onClick={handleNextQuestion}>Next Question</button>
    </div>
  );
};

export default InterviewRoom;