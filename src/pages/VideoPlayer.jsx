import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import LessonList from "../components/LessonList";
import { useProgressStore } from "../store/useProgressStore";
import "../styles/videoPlayer.css";

export default function VideoPlayer() {
  const { courseId, lessonId } = useParams();
  const [course, setCourse] = useState(null);
  const [noteText, setNoteText] = useState("");
  const videoRef = useRef(null);

  const {
    getNotes,
    saveNote,
    getProgress,
    setProgress
  } = useProgressStore();

  const progressKey = `progress-${courseId}-${lessonId}`;
  const notesKey = `notes-${courseId}-${lessonId}`;

  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetch(`/api/course_${courseId}.json`)
      .then(res => res.json())
      .then(data => {
        setCourse(data);
        setNotes(getNotes(notesKey));
      });
  }, [courseId, lessonId]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const savedTime = getProgress(progressKey);
    video.currentTime = savedTime;

    window.getInitialPlaybackTime = () => savedTime;

    const interval = setInterval(() => {
      setProgress(progressKey, video.currentTime);
    }, 5000);

    window.videoPlayer = {
      togglePlay: () => {
        video.paused ? video.play() : video.pause();
      },
      toggleMute: () => {
        video.muted = !video.muted;
      },
      isPlaying: () => !video.paused,
      isMuted: () => video.muted
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

  function addNote() {
    if (!noteText.trim()) return;

    const note = {
      time: Math.floor(videoRef.current.currentTime),
      text: noteText
    };

    saveNote(notesKey, note);
    setNotes(getNotes(notesKey));
    setNoteText("");
  }

  if (!course) return <p>Loading...</p>;

  const lesson = course.lessons.find(
    l => l.id === Number(lessonId)
  );

  return (
    <div
      className="video-page"
      data-testid="video-player-page"
    >
      <LessonList
        lessons={course.lessons}
        courseId={courseId}
        currentLessonId={lessonId}
      />

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
