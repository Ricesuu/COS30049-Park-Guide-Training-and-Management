import React, { useState, useEffect } from "react";
import CourseEditor from "../../components/admin/CourseEditor";

const API_BASE_URL = "http://localhost:3000/api";

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
            console.log("Fetching courses from:", `${API_BASE_URL}/courses`);
            const response = await fetch(`${API_BASE_URL}/courses`);
            console.log("Response status:", response.status);

            if (!response.ok) {
                throw new Error(
                    `Failed to fetch courses: ${response.status} ${response.statusText}`
                );
            }            const data = await response.json();
            console.log("Courses data received:", data);
            
            // Sort courses by creation date (newest first)
            const sortedCourses = [...data].sort((a, b) => {
                // If created_at is available, use it for sorting
                if (a.created_at && b.created_at) {
                    return new Date(b.created_at) - new Date(a.created_at);
                }
                // Fall back to module_id for sorting if created_at is not available
                return b.module_id - a.module_id;
            });
            
            setCourses(sortedCourses);
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
                const response = await fetch(
                    `${API_BASE_URL}/courses/${courseId}`,
                    {
                        method: "DELETE",
                    }
                );

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
    }    return (
        <div className="p-4 text-green-950 w-full">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-green-900 font-bold text-lg mb-4">
                    Course List
                </h1>

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
              {/* Course Information Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">                {/* Course Count Card */}
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg shadow-sm border border-green-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-green-800 text-xl font-semibold mb-1">Total Courses</h2>
                            <p className="text-green-600 text-sm">Available training modules</p>
                        </div>
                        <div className="bg-white p-4 rounded-full shadow-md flex items-center justify-center h-16 w-16">
                            <span className="text-3xl font-bold text-green-700">{courses.length}</span>
                        </div>
                    </div>
                </div>
                
                {/* Most Recent Course Card */}
                {courses.length > 0 && (
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg shadow-sm border border-purple-200">
                        <div className="flex items-center justify-between">
                            <div className="pr-2">
                                <h2 className="text-purple-800 text-xl font-semibold mb-1">Latest Course</h2>
                                <p className="text-purple-700 font-medium truncate">{courses[0].module_name}</p>
                                <p className="text-purple-600 text-sm">
                                    <span className="bg-purple-200 px-2 py-0.5 rounded-full text-purple-800 text-xs capitalize">
                                        {courses[0].difficulty || "beginner"}
                                    </span>
                                    {courses[0].aspect && (
                                        <span className="ml-2 bg-purple-200 px-2 py-0.5 rounded-full text-purple-800 text-xs capitalize">
                                            {courses[0].aspect}
                                        </span>
                                    )}
                                </p>
                            </div>
                            <div className="bg-white py-2 px-3 rounded-md shadow-md h-14 flex items-center justify-center font-mono font-bold text-purple-600">
                                {courses[0].module_code}
                            </div>
                        </div>
                    </div>
                )}

                {/* Difficulty Breakdown Card */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg shadow-sm border border-blue-200">
                    <div className="flex flex-col">
                        <h2 className="text-blue-800 text-xl font-semibold mb-1">Difficulty Levels</h2>
                        <p className="text-blue-600 text-sm mb-2">Course complexity distribution</p>
                        <div className="mt-1">
                            {(() => {
                                // Count courses by difficulty
                                const difficultyCount = courses.reduce((acc, course) => {
                                    const difficulty = course.difficulty || "unknown";
                                    acc[difficulty] = (acc[difficulty] || 0) + 1;
                                    return acc;
                                }, {});
                                
                                // Display difficulty counts
                                return ['beginner', 'intermediate', 'advanced'].map(level => (
                                    <div key={level} className="flex justify-between items-center mb-1">
                                        <span className="text-blue-700 font-medium capitalize">{level}</span>
                                        <span className="bg-blue-200 px-2 py-0.5 rounded-full text-blue-800 text-sm">
                                            {difficultyCount[level] || 0} courses
                                        </span>
                                    </div>
                                ));
                            })()}
                        </div>
                    </div>
                </div>
                
                {/* Aspect Distribution Card */}
                {courses.length > 0 && (
                    <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg shadow-sm border border-amber-200">
                        <div className="flex flex-col">
                            <h2 className="text-amber-800 text-xl font-semibold mb-1">Course Aspects</h2>
                            <p className="text-amber-600 text-sm mb-2">Training focus areas</p>
                            <div className="mt-1">
                                {(() => {
                                    // Count courses by aspect
                                    const aspectCounts = courses.reduce((acc, course) => {
                                        const aspect = course.aspect || "other";
                                        acc[aspect] = (acc[aspect] || 0) + 1;
                                        return acc;
                                    }, {});
                                    
                                    // Get top 3 aspects
                                    const topAspects = Object.entries(aspectCounts)
                                        .sort((a, b) => b[1] - a[1])
                                        .slice(0, 3);
                                    
                                    return topAspects.map(([aspect, count], index) => (
                                        <div key={index} className="flex justify-between items-center mb-1">
                                            <span className="text-amber-700 font-medium capitalize">{aspect}</span>
                                            <span className="bg-amber-200 px-2 py-0.5 rounded-full text-amber-800 text-sm">
                                                {count} courses
                                            </span>
                                        </div>
                                    ));
                                })()}
                                {Object.keys(courses.reduce((acc, course) => {
                                    if (course.aspect) acc[course.aspect] = true;
                                    return acc;
                                }, {})).length > 3 && (
                                    <div className="text-amber-600 text-xs mt-1 italic">
                                        +{Object.keys(courses.reduce((acc, course) => {
                                            if (course.aspect) acc[course.aspect] = true;
                                            return acc;
                                        }, {})).length - 3} more aspects
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            <div className="overflow-x-auto w-full">
                <div className="rounded-lg">
                    <table className="border-collapse rounded w-full table-auto">
                        <thead>
                            <tr className="border-b-2 border-green-800 bg-green-50">
                                <th className="text-left py-3 px-4 text-green-800">
                                    CourseID
                                </th>
                                <th className="text-left py-3 px-4 text-green-800">
                                    Title
                                </th>
                                <th className="text-left py-3 px-4 text-green-800">
                                    Description
                                </th>
                                <th className="text-left py-3 px-4 text-green-800">
                                    Difficulty
                                </th>
                                <th className="text-left py-3 px-4 text-green-800">
                                    Aspect
                                </th>
                                <th className="text-left py-3 px-4 text-green-800">
                                    Associated Quiz
                                </th>
                                <th className="text-left py-3 px-4 text-green-800">
                                    YouTube Link
                                </th>
                                <th className="text-left py-3 px-4 text-green-800 whitespace-nowrap">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map((course) => (
                                <tr
                                    key={course.module_id}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="py-3 px-4">
                                        {course.module_code}
                                    </td>
                                    <td className="py-3 px-4">
                                        {course.module_name}
                                    </td>
                                    <td className="py-3 px-4 max-w-xs truncate">
                                        {course.description}
                                    </td>
                                    <td className="py-3 px-4">
                                        {course.difficulty}
                                    </td>
                                    <td className="py-3 px-4">
                                        {course.aspect}
                                    </td>
                                    <td className="py-3 px-4">
                                        {course.quiz_name || "No quiz"}
                                    </td>
                                    <td className="py-3 px-4">
                                        {" "}
                                        {course.video_url ? (
                                            <a
                                                href={course.video_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800 underline"
                                            >
                                                {course.video_url.length > 30
                                                    ? course.video_url.substring(
                                                          0,
                                                          30
                                                      ) + "..."
                                                    : course.video_url}
                                            </a>
                                        ) : (
                                            <span className="text-gray-400">
                                                No video URL
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4 whitespace-nowrap">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() =>
                                                    handleEditClick(course)
                                                }
                                                className="px-4 py-2 text-green-800 hover:text-green-600 bg-green-100 hover:bg-green-200 transition-colors rounded"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDeleteCourse(
                                                        course.module_id
                                                    )
                                                }
                                                className="px-4 py-2 text-red-800 hover:text-red-600 bg-red-100 hover:bg-red-200 transition-colors rounded"
                                            >
                                                Delete
                                            </button>
                                        </div>
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
