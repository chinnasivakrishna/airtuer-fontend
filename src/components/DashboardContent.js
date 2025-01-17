import { StyledSection, StyledStatCard } from './enhanced-dashboard-components';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DashboardContent = () => {
  const dashboardData = {
    totalJobs: 25,
    completedJobs: 18,
    inProgressJobs: 5,
    notAttendedJobs: 2,
    jobsHistory: [
      { date: '2023-04-01', completed: 4, inProgress: 1, notAttended: 0 },
      { date: '2023-05-01', completed: 6, inProgress: 2, notAttended: 1 },
      { date: '2023-06-01', completed: 5, inProgress: 1, notAttended: 1 },
      { date: '2023-07-01', completed: 3, inProgress: 1, notAttended: 0 }
    ]
  };

  return (
    <div className="space-y-8">
      <StyledSection title="Dashboard">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StyledStatCard title="Total Jobs" value={dashboardData.totalJobs} />
          <StyledStatCard title="Completed Jobs" value={dashboardData.completedJobs} />
          <StyledStatCard title="In Progress Jobs" value={dashboardData.inProgressJobs} />
          <StyledStatCard title="Not Attended Jobs" value={dashboardData.notAttendedJobs} />
        </div>
      </StyledSection>

      <StyledSection title="Jobs History">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={dashboardData.jobsHistory}>
              <XAxis dataKey="date" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="completed" stroke="#8884d8" />
              <Line type="monotone" dataKey="inProgress" stroke="#82ca9d" />
              <Line type="monotone" dataKey="notAttended" stroke="#ffc658" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </StyledSection>
    </div>
  );
};

export default DashboardContent;