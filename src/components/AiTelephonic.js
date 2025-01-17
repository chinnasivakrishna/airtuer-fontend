import { StyledSection, InterviewCard } from './enhanced-dashboard-components';
import InterviewComponent from './InterviewComponent';

const AiTelephonic = () => {
  const aiTelephonic = {
    title: 'AI Telephonic Interview',
    instructions: 'Please follow the instructions and answer the questions during the interview.',
    duration: '30 minutes',
    previousDone: [
      { id: 1, date: '2023-04-01', score: 85 },
      { id: 2, date: '2023-05-15', score: 92 }
    ],
    inProgress: [
      { id: 3, date: '2023-06-10', score: null }
    ],
    notAttended: [
      { id: 4, date: '2023-07-01' },
      { id: 5, date: '2023-08-20' }
    ]
  };

  return <InterviewComponent type="AI Telephonic" />;
};

export default AiTelephonic;