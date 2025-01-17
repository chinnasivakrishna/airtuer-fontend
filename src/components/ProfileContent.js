import { StyledSection, ProfileSection } from './enhanced-dashboard-components';

const ProfileContent = () => {
  const profileData = {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    avatar: 'https://via.placeholder.com/150'
  };

  return (
    <StyledSection title="Profile">
      <ProfileSection profile={profileData} />
    </StyledSection>
  );
};

export default ProfileContent;