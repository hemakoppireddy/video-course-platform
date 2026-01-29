import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../styles/courseDetail.css";

export default function CourseDetail() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [completion, setCompletion] = useState(0);

  useEffect(() => {
    fetch(`/api/course_${courseId}.json`)
      .then(res => res.json())
      .then(data => {
        setCourse(data);
        calculateCompletion(data);
      });
  }, [courseId]);

  function calculateCompletion(courseData) {
    let completed = 0;

    courseData.lessons.forEach(lesson => {
      const key = `progress-${courseData.id}-${lesson.id}`;
      const progress = Number(localStorage.getItem(key) || 0);

      if (progress >= 57) {
        completed++;
      }
    });

    const percent = Math.round(
      (completed / courseData.lessons.length) * 100
    );

    setCompletion(percent);
  }

  function handleCertificate() {
    if (window.generateCertificate) {
      window.generateCertificate(course.title, "Test User");
    }
  }

  if (!course) return <p>Loading...</p>;

  return (
    <div className="course-detail" data-testid="course-detail-page">
      <h1 data-testid="course-title">{course.title}</h1>
      <p>{course.description}</p>

      <h3>Completion: {completion}%</h3>

      {completion === 100 && (
        <button
          data-testid="generate-certificate-button"
          className="certificate-btn"
          onClick={handleCertificate}
        >
          Generate Certificate
        </button>
      )}

      <h2>Lessons</h2>
      <ul className="lesson-list">
        {course.lessons.map(lesson => (
          <li key={lesson.id}>
            <Link
              to={`/courses/${course.id}/lessons/${lesson.id}`}
              data-testid={`lesson-link-${lesson.id}`}
            >
              {lesson.title} ({lesson.duration})
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
