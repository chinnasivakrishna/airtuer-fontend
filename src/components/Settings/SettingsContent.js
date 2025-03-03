import { StyledSection, StyledCard } from '../Dashboard/enhanced-dashboard-components';

const SettingsContent = () => {
  const settingsData = {
    title: 'Account Settings',
    sections: [
      { title: 'Personal Information', fields: ['Name', 'Email', 'Phone'] },
      { title: 'Security', fields: ['Password', 'Two-Factor Authentication'] },
      { title: 'Notifications', fields: ['Email Notifications', 'Push Notifications'] }
    ]
  };

  return (
    <StyledSection title={settingsData.title}>
      <div className="space-y-6">
        {settingsData.sections.map((section, index) => (
          <StyledCard key={index}>
            <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
            <ul className="space-y-2">
              {section.fields.map((field, fieldIndex) => (
                <li key={fieldIndex} className="text-gray-600">{field}</li>
              ))}
            </ul>
          </StyledCard>
        ))}
      </div>
    </StyledSection>
  );
};

export default SettingsContent;