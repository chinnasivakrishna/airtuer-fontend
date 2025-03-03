import { StyledSection, NotificationCard } from '../Dashboard/enhanced-dashboard-components';

const NotificationsContent = () => {
  const notificationsData = [
    { id: 1, title: 'New job posting', message: 'A new job posting has been added for Software Engineer.', date: '2023-06-01' },
    { id: 2, title: 'Interview scheduled', message: 'Your AI Video interview has been scheduled for June 15th.', date: '2023-06-05' },
    { id: 3, title: 'Course update', message: 'The "Advanced JavaScript Concepts" course has been updated.', date: '2023-06-10' }
  ];

  return (
    <StyledSection title="Notifications">
      <div className="space-y-4">
        {notificationsData.map(notification => (
          <NotificationCard key={notification.id} notification={notification} />
        ))}
      </div>
    </StyledSection>
  );
};

export default NotificationsContent;