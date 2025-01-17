import { StyledSection, JobCard } from './enhanced-dashboard-components';

const JobsContent = () => {
  const jobsData = [
    { id: 1, title: 'Software Engineer', company: 'ABC Inc.', location: 'New York', status: 'done' },
    { id: 2, title: 'UI/UX Designer', company: 'XYZ Corp.', location: 'San Francisco', status: 'in-progress' },
    { id: 3, title: 'Data Analyst', company: 'DEF LLC', location: 'Chicago', status: 'not-attended' }
  ];

  return (
    <StyledSection title="Jobs">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobsData.map(job => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </StyledSection>
  );
};

export default JobsContent;