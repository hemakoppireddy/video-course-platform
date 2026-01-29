import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../styles/videoPlayer.css";

export default function VideoPlayer() {
  const { courseId, lessonId } = useParams();
  const [course, setCourse] = useState(null);
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState("");
  const videoRef = useRef(null);

  const progressKey = `progress-${courseId}-${lessonId}`;
  const notesKey = `notes-${courseId}-${lessonId}`;

  useEffect(() => {
    fetch(`/api/course_${courseId}.json`)
      .then(res => res.json())
      .then(data => {
        setCourse(data);
        loadNotes();
      });
  }, [courseId, lessonId]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const savedTime = Number(localStorage.getItem(progressKey) || 0);
    video.currentTime = savedTime;

    window.getInitialPlaybackTime = () => savedTime;

    const interval = setInterval(() => {
      localStorage.setItem(progressKey, video.currentTime);
    }, 5000);

    window.videoPlayer = {
      togglePlay: () => {
        video.paused ? video.play() : video.pause();
      },
      toggleMute: () => {
        video.muted = !video.muted;
      },
      isPlaying: () => {
        return !video.paused;
      },
      isMuted: () => {
        return video.muted;
      }
    };

    function handleKeys(e) {
      if (e.code === "Space") {
        e.preventDefault();
        window.videoPlayer.togglePlay();
      }
      if (e.key === "m") {
        window.videoPlayer.toggleMute();
      }
    }

    window.addEventListener("keydown", handleKeys);

    return () => {
      clearInterval(interval);
      delete window.videoPlayer;
      delete window.getInitialPlaybackTime;
      window.removeEventListener("keydown", handleKeys);
    };
  }, [lessonId]);

  function loadNotes() {
    const saved = localStorage.getItem(notesKey);
    if (saved) {
      setNotes(JSON.parse(saved));
    } else {
      setNotes([]);
    }
  }

  function addNote() {
    const video = videoRef.current;
    if (!noteText.trim()) return;

    const newNote = {
      time: Math.floor(video.currentTime),
      text: noteText
    };

    const updated = [...notes, newNote];
    setNotes(updated);
    localStorage.setItem(notesKey, JSON.stringify(updated));
    setNoteText("");
  }

  if (!course) return <p>Loading...</p>;

  const lesson = course.lessons.find(
    l => l.id === Number(lessonId)
  );

  return (
    <div className="video-page" data-testid="video-player-page">
      <div className="sidebar">
        <h3>Lessons</h3>
        <ul>
          {course.lessons.map(l => (
            <li
              key={l.id}
              data-testid={
                l.id === Number(lessonId)
                  ? "current-lesson-item"
                  : undefined
              }
            >
              <Link to={`/courses/${courseId}/lessons/${l.id}`}>
                {l.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div
        className="player-container"
        data-testid="video-player-container"
      >
        <h2>{lesson.title}</h2>

        <video
          ref={videoRef}
          src={lesson.video_url}
          controls
          width="100%"
        />

        <div className="notes-section">
          <h3>Notes</h3>

          <input
            data-testid="note-input"
            placeholder="Write a note..."
            value={noteText}
            onChange={e => setNoteText(e.target.value)}
          />

          <button
            data-testid="add-note-button"
            onClick={addNote}
          >
            Add Note
          </button>

          <div data-testid="notes-list">
            {notes.map((note, index) => (
              <div key={index} className="note-item">
                <strong>{note.time}s:</strong> {note.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
