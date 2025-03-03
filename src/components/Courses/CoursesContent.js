import { StyledSection, CourseCard } from '../Dashboard/enhanced-dashboard-components';

const CoursesContent = () => {
  const coursesData = [
    { id: 1, title: 'Introduction to React', duration: '2 hours', status: 'done' },
    { id: 2, title: 'Advanced JavaScript Concepts', duration: '4 hours', status: 'in-progress' },
    { id: 3, title: 'Data Structures and Algorithms', duration: '6 hours', status: 'not-attended' }
  ];

  return (
    <StyledSection title="Courses">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coursesData.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </StyledSection>
  );
};

export default CoursesContent;