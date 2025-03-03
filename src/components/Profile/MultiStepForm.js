import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Plus, X } from 'lucide-react';
import Cookies from 'js-cookie';

const MultiStepForm = ({ onBack }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    
    // Professional Summary
    title: '',
    summary: '',
    yearsOfExperience: '',
    
    // Education
    education: [{
      degree: '',
      institution: '',
      yearOfCompletion: '',
      field: ''
    }],
    
    // Work Experience
    experience: [{
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: ''
    }],
    
    // Skills
    skills: [''],
    
    // Additional Information
    languages: [''],
    certifications: [''],
    achievements: ['']
  });

  const addArrayField = (field) => {
    setFormData({
      ...formData,
      [field]: [...formData[field], '']
    });
  };

  const removeArrayField = (field, index) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((_, i) => i !== index)
    });
  };

  const updateArrayField = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({
      ...formData,
      [field]: newArray
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/profile/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('token')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        window.location.href = '/dashboard';
      }
    } catch (error) {
      console.error('Profile creation error:', error);
    }
  };

  const renderFormFields = () => {
    switch (step) {
      case 0: // Personal Information
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
          </div>
        );

      case 1: // Professional Summary
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Professional Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years of Experience
              </label>
              <input
                type="number"
                value={formData.yearsOfExperience}
                onChange={(e) => setFormData({...formData, yearsOfExperience: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Professional Summary
              </label>
              <textarea
                value={formData.summary}
                onChange={(e) => setFormData({...formData, summary: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                rows={4}
                required
              />
            </div>
          </div>
        );

      case 2: // Education
        return (
          <div className="space-y-6">
            {formData.education.map((edu, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Education #{index + 1}</h3>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeArrayField('education', index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Degree
                    </label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => {
                        const newEducation = [...formData.education];
                        newEducation[index] = { ...edu, degree: e.target.value };
                        setFormData({ ...formData, education: newEducation });
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Field of Study
                    </label>
                    <input
                      type="text"
                      value={edu.field}
                      onChange={(e) => {
                        const newEducation = [...formData.education];
                        newEducation[index] = { ...edu, field: e.target.value };
                        setFormData({ ...formData, education: newEducation });
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Institution
                  </label>
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => {
                      const newEducation = [...formData.education];
                      newEducation[index] = { ...edu, institution: e.target.value };
                      setFormData({ ...formData, education: newEducation });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year of Completion
                  </label>
                  <input
                    type="number"
                    value={edu.yearOfCompletion}
                    onChange={(e) => {
                      const newEducation = [...formData.education];
                      newEducation[index] = { ...edu, yearOfCompletion: e.target.value };
                      setFormData({ ...formData, education: newEducation });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayField('education')}
              className="flex items-center text-purple-600 hover:text-purple-700"
            >
              <Plus size={20} className="mr-2" />
              Add Education
            </button>
          </div>
        );

      case 3: // Work Experience
        return (
          <div className="space-y-6">
            {formData.experience.map((exp, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Experience #{index + 1}</h3>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeArrayField('experience', index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => {
                      const newExperience = [...formData.experience];
                      newExperience[index] = { ...exp, company: e.target.value };
                      setFormData({ ...formData, experience: newExperience });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position
                  </label>
                  <input
                    type="text"
                    value={exp.position}
                    onChange={(e) => {
                      const newExperience = [...formData.experience];
                      newExperience[index] = { ...exp, position: e.target.value };
                      setFormData({ ...formData, experience: newExperience });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={exp.startDate}
                      onChange={(e) => {
                        const newExperience = [...formData.experience];
                        newExperience[index] = { ...exp, startDate: e.target.value };
                        setFormData({ ...formData, experience: newExperience });
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={exp.endDate}
                      onChange={(e) => {
                        const newExperience = [...formData.experience];
                        newExperience[index] = { ...exp, endDate: e.target.value };
                        setFormData({ ...formData, experience: newExperience });
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={exp.description}
                    onChange={(e) => {
                      const newExperience = [...formData.experience];
                      newExperience[index] = { ...exp, description: e.target.value };
                      setFormData({ ...formData, experience: newExperience });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    rows={4}
                    required
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayField('experience')}
              className="flex items-center text-purple-600 hover:text-purple-700"
            >
              <Plus size={20} className="mr-2" />
              Add Experience
            </button>
          </div>
        );

      case 4: // Skills
        return (
          <div className="space-y-4">
            {formData.skills.map((skill, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => updateArrayField('skills', index, e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Enter a skill"
                  required
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeArrayField('skills', index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayField('skills')}
              className="flex items-center text-purple-600 hover:text-purple-700"
            >
              <Plus size={20} className="mr-2" />
              Add Skill
            </button>
          </div>
        );

      case 5: // Additional Information
        return (
          <div className="space-y-6">
            {/* Languages */}
            <div className="space-y-4">
              <h3 className="font-medium">Languages</h3>
              {formData.languages.map((language, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={language}
                    onChange={(e) => updateArrayField('languages', index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Enter a language"
                    required
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeArrayField('languages', index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayField('languages')}
                className="flex items-center text-purple-600 hover:text-purple-700"
              >
                <Plus size={20} className="mr-2" />
                Add Language
              </button>
            </div>

            {/* Certifications */}
            <div className="space-y-4">
              <h3 className="font-medium">Certifications</h3>
              {formData.certifications.map((cert, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={cert}
                    onChange={(e) => updateArrayField('certifications', index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Enter a certification"
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeArrayField('certifications', index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayField('certifications')}
                className="flex items-center text-purple-600 hover:text-purple-700"
              >
                <Plus size={20} className="mr-2" />
                Add Certification
              </button>
            </div>

            {/* Achievements */}
            <div className="space-y-4">
              <h3 className="font-medium">Achievements</h3>
              {formData.achievements.map((achievement, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={achievement}
                    onChange={(e) => updateArrayField('achievements', index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Enter an achievement"
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeArrayField('achievements', index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayField('achievements')}
                className="flex items-center text-purple-600 hover:text-purple-700"
              >
                <Plus size={20} className="mr-2" />
                Add Achievement
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const steps = [
    'Personal Information',
    'Professional Summary',
    'Education',
    'Work Experience',
    'Skills',
    'Additional Information'
  ];

  return (
    <div className="max-w-2xl mx-auto p-8">
      <button
        onClick={onBack}
        className="flex items-center text-gray-600 mb-8 hover:text-gray-800"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to options
      </button>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">{steps[step]}</h2>
        <div className="flex gap-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 flex-1 rounded-full ${
                index <= step ? 'bg-purple-600' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        {renderFormFields()}

        <div className="flex justify-between mt-8">
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft size={20} className="mr-2" />
              Previous
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              if (step === steps.length - 1) {
                handleSubmit();
              } else {
                setStep(step + 1);
              }
            }}
            className="flex items-center bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 ml-auto"
          >
            {step === steps.length - 1 ? 'Submit' : 'Next'}
            {step !== steps.length - 1 && <ArrowRight size={20} className="ml-2" />}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MultiStepForm;