import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/catalog.css";

export default function Catalog() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/courses.json")
      .then(res => res.json())
      .then(data => setCourses(data));
  }, []);

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="catalog" data-testid="catalog-page">
      <h1>Video Courses</h1>

      <input
        className="search-box"
        data-testid="search-input"
        placeholder="Search courses..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div className="course-grid">
        {filteredCourses.map(course => (
          <Link
            key={course.id}
            to={`/courses/${course.id}`}
            className="course-card"
            data-testid={`course-card-${course.id}`}
          >
            <h2>{course.title}</h2>
            <p>{course.instructor}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
