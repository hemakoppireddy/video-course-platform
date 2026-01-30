import { Link } from "react-router-dom";

export default function LessonList({
  lessons,
  courseId,
  currentLessonId
}) {
  return (
    <div className="sidebar">
      <h3>Lessons</h3>
      <ul>
        {lessons.map(lesson => (
          <li
            key={lesson.id}
            data-testid={
              lesson.id === Number(currentLessonId)
                ? "current-lesson-item"
                : undefined
            }
          >
            <Link
              to={`/courses/${courseId}/lessons/${lesson.id}`}
            >
              {lesson.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
