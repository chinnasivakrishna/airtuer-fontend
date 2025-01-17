import React from 'react';

const HelpContent = () => {
  const helpData = {
    title: 'How can we assist you?',
    faq: [
      { id: 1, question: 'How do I update my profile information?', answer: 'Go to the Settings page and click on the "Edit Profile" button.' },
      { id: 2, question: 'What if I have trouble with the AI interview process?', answer: 'Please contact our support team for assistance.' },
      { id: 3, question: 'Can I access the course materials offline?', answer: 'Yes, you can download the course materials for offline access.' }
    ]
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{helpData.title}</h2>
      <div className="space-y-4">
        {helpData.faq.map((faq) => (
          <div key={faq.id} className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">{faq.question}</h3>
            <p className="text-gray-500">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HelpContent;