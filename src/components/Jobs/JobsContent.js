import {Routes, Route} from 'react-router-dom';
import JobDetail from './JobDetail';
import JobListings from './JobListings';
const JobsContent = () => {
  return (
    <Routes>
      <Route path="/" element={<JobListings />} />
      <Route path="/detail/:id" element={<JobDetail />} />
    </Routes>
  );
};
export default JobsContent;