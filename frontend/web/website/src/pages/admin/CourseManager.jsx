import React, { useState, useEffect } from "react";
import CourseEditor from "../../components/admin/CourseEditor";

const API_BASE_URL = "http://localhost:3001/api";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch courses when component mounts
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/courses`);
      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }
      const data = await response.json();
      setCourses(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("Failed to load courses. " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (course) => {
    setSelectedCourse(course);
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setSelectedCourse(null);
  };

  const handleSaveCourse = async (courseData) => {
    try {
      let response;
      const requestBody = {
        module_code: courseData.module_code,
        module_name: courseData.module_name,
        description: courseData.description,
        difficulty: courseData.difficulty,
        aspect: courseData.aspect,
        video_url: courseData.video_url,
        course_content: courseData.course_content,
        quiz_id: courseData.quiz_id,
      };

      if (courseData.module_id) {
        // Update existing course
        response = await fetch(
          `${API_BASE_URL}/courses/${courseData.module_id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          }
        );
      } else {
        // Create new course
        response = await fetch(`${API_BASE_URL}/courses`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save course");
      }

      await fetchCourses(); // Refresh the courses list
      setIsEditorOpen(false);
      setSelectedCourse(null);
    } catch (err) {
      console.error("Error saving course:", err);
      alert("Error: " + err.message);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete course");
        }

        await fetchCourses(); // Refresh the courses list
      } catch (err) {
        console.error("Error deleting course:", err);
        alert("Error: " + err.message);
      }
    }
  };

  if (loading) {
    return <div className="p-4 text-green-950">Loading courses...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  return (
    <div className="p-4 text-green-950">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-green-900 font-bold text-lg mb-4">Course List</h1>

        <button
          onClick={() => {
            setSelectedCourse(null); // Reset selected course
            setIsEditorOpen(true); // Open editor in create mode
          }}
          className="px-4 py-2 bg-green-100 text-green-800 hover:bg-green-200 transition-colors rounded flex items-center gap-2"
        >
          Create New Course
        </button>
      </div>
      <div className="overflow-x-auto">
        <div className="overflow-hidden rounded-lg">
          <table className="w-full border-collapse rounded">
            <thead>
              <tr className="border-b-2 border-green-800 bg-green-50">
                <th className="text-left py-3 px-4 text-green-800">CourseID</th>
                <th className="text-left py-3 px-4 text-green-800">Title</th>
                <th className="text-left py-3 px-4 text-green-800">
                  Description
                </th>
                <th className="text-left py-3 px-4 text-green-800">
                  Difficulty
                </th>
                <th className="text-left py-3 px-4 text-green-800">Aspect</th>
                <th className="text-left py-3 px-4 text-green-800">
                  Associated Quiz
                </th>
                <th className="text-left py-3 px-4 text-green-800">
                  YouTube Link
                </th>
                <th className="text-left py-3 px-4 text-green-800">Action</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.module_id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">{course.module_code}</td>
                  <td className="py-3 px-4">{course.module_name}</td>
                  <td className="py-3 px-4">{course.description}</td>
                  <td className="py-3 px-4">{course.difficulty}</td>
                  <td className="py-3 px-4">{course.aspect}</td>
                  <td className="py-3 px-4">{course.quiz_name || "No quiz"}</td>
                  <td className="py-3 px-4">
                    <a
                      href={course.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      {course.video_url.length > 30
                        ? course.video_url.substring(0, 30) + "..."
                        : course.video_url}
                    </a>
                  </td>
                  <td className="py-3 px-4 flex gap-2">
                    <button
                      onClick={() => handleEditClick(course)}
                      className="px-4 py-2 text-green-800 hover:text-green-600 bg-green-100 hover:bg-green-200 transition-colors rounded "
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course.module_id)}
                      className="px-4 py-2 text-red-800 hover:text-red-600 bg-red-100 hover:bg-red-200 transition-colors rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CourseEditor
        open={isEditorOpen}
        onClose={handleCloseEditor}
        courseData={selectedCourse}
        onSave={handleSaveCourse}
      />
    </div>
  );
}
