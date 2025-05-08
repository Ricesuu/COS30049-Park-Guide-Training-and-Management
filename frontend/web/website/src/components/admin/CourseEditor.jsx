import React, { useState, useEffect } from 'react';

export default function CourseEditor({ open, onClose, courseData, onSave }) {
    const [courseid, setID] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [diff, setDiff] = useState('');
    const [aspect, setAspect] = useState('');
    const [youtubeLink, setYoutubeLink] = useState('');
    const [courseContent, setCourseContent] = useState('');
    const [quizzes, setQuizzes] = useState([]);
    const [selectedQuizId, setSelectedQuizId] = useState('');

    useEffect(() => {
        // Fetch quizzes when component mounts
        const fetchQuizzes = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/quizzes');
                if (!response.ok) {
                    throw new Error('Failed to fetch quizzes');
                }
                const data = await response.json();
                setQuizzes(data);
            } catch (error) {
                console.error('Error fetching quizzes:', error);
            }
        };

        fetchQuizzes();
    }, []);
  
    useEffect(() => {
        if (courseData) {
          // Editing mode - populate fields with course data
          setID(courseData.module_code || '');
          setTitle(courseData.module_name || '');
          setDescription(courseData.description || '');
          setDiff(courseData.difficulty || '');
          setAspect(courseData.aspect || '');
          setYoutubeLink(courseData.video_url || '');
          setCourseContent(courseData.course_content || '');
          setSelectedQuizId(courseData.quiz_id || '');
        } else {
          // Create mode - reset all fields
          setID('');
          setTitle('');
          setDescription('');
          setDiff('');
          setAspect('');
          setYoutubeLink('');
          setCourseContent('');
          setSelectedQuizId('');
        }
    }, [courseData]);
  
    if (!open) return null;
  
    const handleSave = () => {
        const updatedCourse = {
          ...(courseData?.module_id && { module_id: courseData.module_id }),
          module_code: courseid,
          module_name: title,
          description: description,
          difficulty: diff,
          aspect: aspect,
          video_url: youtubeLink,
          course_content: courseContent,
          quiz_id: selectedQuizId || null
        };
        onSave && onSave(updatedCourse);
    };

    const isValidYoutubeUrl = (url) => {
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=)?([a-zA-Z0-9_-]+)/;
        return youtubeRegex.test(url);
    };
  
    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center p-4">
            <div className="bg-white p-6 rounded-lg w-full max-w-[600px] max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">
                    {courseData ? 'Edit Course' : 'Create New Course'}
                </h2>
                
                <label className="block mb-4">
                    <span className="block text-sm font-medium mb-1">Course ID:</span>
                    <input
                        value={courseid}
                        onChange={(e) => setID(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded mb-2"
                        placeholder="Enter course ID (e.g., CS101)"
                        required
                    />
                </label>

                <label className="block mb-4">
                    <span className="block text-sm font-medium mb-1">Title:</span>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded mb-2"
                        placeholder="Enter course title"
                        required
                    />
                </label>

                <label className="block mb-4">
                    <span className="block text-sm font-medium mb-1">Description:</span>
                    <textarea
                        rows="4"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded mb-2"
                        placeholder="Enter course description"
                    />
                </label>

                <label className="block mb-4">
                    <span className="block text-sm font-medium mb-1">Difficulty:</span>
                    <select
                        value={diff}
                        onChange={(e) => setDiff(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded mb-2"
                        required
                    >
                        <option value="">Choose difficulty</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                    </select>
                </label>
                
                <label className="block mb-4">
                    <span className="block text-sm font-medium mb-1">Aspect:</span>
                    <select
                        value={aspect}
                        onChange={(e) => setAspect(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded mb-2"
                        required
                    >
                        <option value="">Choose course aspect</option>
                        <option value="language">Language</option>
                        <option value="knowledge">Knowledge</option>
                        <option value="organization">Organization</option>         
                        <option value="engagement">Engagement</option>
                        <option value="safety">Safety</option>
                    </select>
                </label>

                <label className="block mb-4">
                    <span className="block text-sm font-medium mb-1">YouTube Link:</span>
                    <input
                        type="url"
                        value={youtubeLink}
                        onChange={(e) => {
                            const url = e.target.value;
                            if (url === '' || isValidYoutubeUrl(url)) {
                                setYoutubeLink(url);
                            } else {
                                alert('Please enter a valid YouTube URL');
                            }
                        }}
                        placeholder="https://youtube.com/watch?v=..."
                        className="w-full p-2 border border-gray-300 rounded mb-2"
                    />
                </label>

                <label className="block mb-4">
                    <span className="block text-sm font-medium mb-1">Course Content:</span>
                    <textarea
                        rows="8"
                        value={courseContent}
                        onChange={(e) => setCourseContent(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded mb-2"
                        placeholder="Enter detailed course content here..."
                    />
                </label>

                <label className="block mb-4">
                    <span className="block text-sm font-medium mb-1">Associated Quiz:</span>
                    <select
                        value={selectedQuizId}
                        onChange={(e) => setSelectedQuizId(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded mb-2"
                    >
                        <option value="">No quiz</option>
                        {quizzes.map((quiz) => (
                            <option key={quiz.id} value={quiz.id}>
                                {quiz.name}
                            </option>
                        ))}
                    </select>
                </label>

                <div className="flex justify-end gap-2 mt-6">
                    <button
                        onClick={handleSave}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        {courseData ? 'Save Changes' : 'Create Course'}
                    </button>

                    <button
                        onClick={onClose}
                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}