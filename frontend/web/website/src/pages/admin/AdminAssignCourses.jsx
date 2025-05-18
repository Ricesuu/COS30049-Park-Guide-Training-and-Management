import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminAssignCourses() {
  
  const [viewMode, setViewMode] = useState('assign'); // 'assign' | 'details'
  const [detailTab, setDetailTab] = useState('aspects'); // 'aspects' | 'comments' | 'recommend'
  const [feedbackData, setFeedbackData] = useState([]);
  const [guides, setGuides] = useState([]);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [modules, setModules] = useState([]);
  const [selectedModules, setSelectedModules] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assigning, setAssigning] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [deleting, setDeleting] = useState(false);
  const aspects = ['language', 'knowledge', 'organization', 'engagement', 'safety'];
  const handleDetails = async (guide) => {
    setSelectedGuide(guide);
    setViewMode('details');
    setDetailTab('aspects');
    
    try {
      // Process two request separately
      const fetchFeedback = axios.get(`/api/course_feedback?guide_id=${guide.guide_id}`)
        .then(res => {
          if (res.data.success) {
            setFeedbackData(res.data.data);
          } else {
            setFeedbackData(createDefaultFeedbackData(guide));
          }
          return true; 
        })
        .catch(err => {
          console.error('Failed to fetch recommend data:', err);
          setFeedbackData(createDefaultFeedbackData(guide));
          return false; 
        });
  
      const fetchRecommendations = axios.get(`/api/recommendations?guide_id=${guide.guide_id}`)
        .then(res => {
          if (res.data?.success) {
            setRecommendations(res.data.data);
          } else {
            setRecommendations([]);
          }
          return true;
        })
        .catch(err => {
          console.error('Fail to fetch recommend data:', err);
          setRecommendations([]);
          return false;
        });
  
   
      const [feedbackSuccess, recommendationSuccess] = 
        await Promise.all([fetchFeedback, fetchRecommendations]);
  

      if (!feedbackSuccess && !recommendationSuccess) {
        setError('Fail to fetch guide data');
        setTimeout(() => setError(null), 3000);
      }
  
    } catch (err) {
      console.error('Error occurs during processing data:', err);
      setError('error');
      setTimeout(() => setError(null), 3000);
    }
  };
  const handleDeleteInProgressCourses = async () => {
    if (!selectedGuide || !window.confirm(`Do you sure to delete ${selectedGuide.first_name} in progress courses? Completed courses will be remain`)) {
      return;
    }
  
    try {
      setDeleting(true);
      const response = await axios.delete('/api/assign_course', {
        data: { guide_id: selectedGuide.guide_id }
      });
  
      if (response.data.success) {
        setGuides(guides.map(guide => 
          guide.guide_id === selectedGuide.guide_id
            ? { 
                ...guide, 
                assigned_modules: [] 
              }
            : guide
        ));
        setSelectedModules({});
        alert(response.data.message);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      console.error('Fail to delete:', errorMsg);
      alert(`Fail to delete: ${errorMsg}`);
    } finally {
      setDeleting(false);
    }
  };
  
  const createDefaultFeedbackData = (guide) => ({
    guide_info: guide,
    feedbacks: [],
    averages: {
      language: 0,
      knowledge: 0,
      organization: 0,
      engagement: 0,
      safety: 0,
      total: 0
    },
    feedback_count: 0
  });
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [guidesRes, modulesRes] = await Promise.all([
          axios.get('/api/assign_course?type=guides'),
          axios.get('/api/assign_course?type=modules')
        ]);

        setGuides(guidesRes.data || []);
        setModules(modulesRes.data || []);
      } catch (err) {
        console.error('Fail to fetch data:', err);
        setError(err.response?.data?.error || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

 
  useEffect(() => {
    if (selectedGuide && selectedGuide.assigned_modules) {
      const initialSelections = {};
      
      // Find out the modules that had assigned to the park guide
      const assigned = modules.filter(m => 
        selectedGuide.assigned_modules.includes(m.module_id)
      );
      
      //group by aspects
      assigned.forEach(module => {
        initialSelections[module.aspect] = module.module_id;
      });
      
      setSelectedModules(initialSelections);
    } else {
      setSelectedModules({});
    }
  }, [selectedGuide, modules]);

  const handleAssign = async () => {
    if (!selectedGuide) return alert('Please select a guide first');
    
    const moduleIds = Object.values(selectedModules)
      .filter(id => id != null && id !== '');
      
    if (!moduleIds.length) return alert('Please select at least one course');

    try {
      setAssigning(true);
      const response = await axios.post('/api/assign_course', {
        guide_id: selectedGuide.guide_id,
        module_ids: moduleIds
      });
      
      if (response.data.success) {
     
        setGuides(guides.map(guide => 
          guide.guide_id === selectedGuide.guide_id
            ? { ...guide, assigned_modules: moduleIds }
            : guide
        ));
        
        alert('Courses assigned successfully!');
        setSelectedGuide(null);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      console.error('Assignment failed:', errorMsg);
      alert(`Failed to assign: ${errorMsg}`);
    } finally {
      setAssigning(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 bg-red-500 text-white px-3 py-1 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Pending Park Guides</h2>
      
      {/* Park Guide Table */}
      <div className="overflow-x-auto mb-6 max-h-96 overflow-y-auto">
        <table className="min-w-full border">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Courses</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {guides.length > 0 ? (
              guides.map(guide => (
                <tr 
                  key={guide.guide_id} 
                  className={`hover:bg-gray-50 ${
                    selectedGuide?.guide_id === guide.guide_id ? 'bg-blue-50' : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {guide.first_name} {guide.last_name}
                    <div className="text-sm text-gray-500">{guide.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      guide.certification_status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {guide.certification_status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                  {guide.assigned_modules?.length > 0 ? (
  <div className="flex flex-wrap gap-1">
    {guide.assigned_modules.map(id => {
      const module = modules.find(m => m.module_id === id);
      const aspectColorMap = {
        language: 'bg-green-100 text-green-800 border border-green-200',
        knowledge: 'bg-amber-100 text-amber-800 border border-amber-200',
        organization: 'bg-blue-100 text-blue-800 border border-blue-200',
        engagement: 'bg-purple-100 text-purple-800 border border-purple-200',
        safety: 'bg-red-100 text-red-800 border border-red-200'
      };
      const colors = module?.aspect 
        ? aspectColorMap[module.aspect] 
        : 'bg-gray-100 text-gray-800 border border-gray-200';

      return (
        <span 
          key={id} 
          className={`text-xs px-2 py-1 rounded ${colors}`}
        >
          {module?.module_name || `Course ${id}`}
        </span>
      );
    })}
  </div>
) : (
  <span className="text-gray-400 text-sm">No courses assigned</span>
)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleDetails(guide)}
                      className={`px-3 py-1 rounded text-sm ${
                        guide.assigned_modules?.length > 0
                          ? 'bg-teal-100 text-teal-600 border border-teal-300'
                          : 'bg-blue-100 text-blue-800 border border-blue-300'
                      } hover:bg-opacity-80`}
                    >
                      {guide.assigned_modules?.length > 0 ? 'Modify' : 'Assign'}
                    </button>
                   
                  </td>
                  
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                  No pending guides found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {viewMode === 'details' && selectedGuide && (
  <div className="bg-white shadow rounded-lg p-6 mt-6 border border-gray-200">
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-lg font-semibold">
        {selectedGuide.first_name} Details
      </h3>
      <button
        onClick={() => setViewMode('assign')}
        className="text-gray-500 hover:text-gray-700"
      >
        ✕
      </button>
    </div>

    {/* Park Guide Info */}
    <div className="flex border-b mb-4">
  <button
    className={`px-4 py-2 font-medium ${detailTab === 'aspects' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
    onClick={() => setDetailTab('aspects')}
  >
    Overview
  </button>
  <button
    className={`px-4 py-2 font-medium ${detailTab === 'comments' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
    onClick={() => setDetailTab('comments')}
  >
    Visitors Feedback ({feedbackData?.feedback_count || 0})
  </button>
  <button
    className={`px-4 py-2 font-medium ${detailTab === 'recommend' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
    onClick={() => setDetailTab('recommend')}
  >
    Recommended Course
  </button>
</div>

{detailTab === 'aspects' && (
  <div className="mb-6 p-4 bg-blue-50 rounded-lg">
    <h4 className="font-bold text-lg mb-2">Overall Rating</h4>
    <div className="text-3xl font-bold text-blue-600">
      {feedbackData?.averages?.total?.toFixed(1) || '0.0'}
    </div>
    <p className="text-gray-600 mt-2">
      Based on {feedbackData?.feedback_count || 0} feedbacks
    </p>
    <ul className="mt-4 space-y-3">
      {aspects.map(aspect => {
        const rating = feedbackData?.averages?.[aspect] || 0;
        const percentage = (rating / 5) * 100;
        return (
          <li key={aspect}>
            <div className="flex justify-between mb-1">
              <span className="capitalize">{aspect}</span>
              <span>{rating.toFixed(1)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded h-3">
              <div
                className="bg-blue-500 h-3 rounded"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </li>
        );
      })}
    </ul>
  </div>
)}
{detailTab === 'comments' && (
  <div className="space-y-4 max-h-96 overflow-y-auto">
    <h4 className="font-bold text-lg mb-2">Visitor Feedback ({feedbackData?.feedback_count || 0})</h4>
    
    {feedbackData?.feedbacks?.length > 0 ? (
      feedbackData.feedbacks.map(feedback => (
        <div key={feedback.feedback_id} className="border-b pb-4">
          {/* Visitors Feedback */}
          <div className="flex justify-between items-start mb-2">
            <div>
              {feedback.visitor_name && (
                <p className="font-medium text-gray-800">
                  {feedback.visitor_name}
                </p>
              )}
              <p className="text-xs text-gray-500">
                {new Date(feedback.submitted_at).toLocaleString()}
              </p>
            </div>
            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
              Feedback #{feedback.feedback_id}
            </span>
          </div>

          {/* Rating section */}
          <div className="grid grid-cols-5 gap-2 mb-3 bg-gray-50 p-2 rounded">
            {['language', 'knowledge', 'organization', 'engagement', 'safety'].map(aspect => (
              <div key={aspect} className="text-center">
                <div className="text-xs text-gray-500 mb-1">
                  {aspect === 'language' ? 'Language' :
                   aspect === 'knowledge' ? 'Knowledge' :
                   aspect === 'organization' ? 'Organization' :
                   aspect === 'engagement' ? 'Engagement' : 'Safety'}
                </div>
                <div className="flex items-center justify-center">
                  <span className="font-bold text-lg mr-1">
                    {feedback[`${aspect}_rating`]}
                  </span>
                  <span className="text-xs text-gray-400">/5</span>
                </div>
              </div>
            ))}
          </div>

          {/* Comment content */}
          {feedback.comment && (
            <div className="mt-2">
              <p className="text-sm font-medium text-gray-700 mb-1">Comment:</p>
              <p className="text-gray-800 whitespace-pre-wrap bg-gray-50 p-3 rounded">
                {feedback.comment}
              </p>
            </div>
          )}
        </div>
      ))
    ) : (
      <div className="text-center py-6">
        <p className="text-gray-500">No feedback yet</p>
        <p className="text-sm text-gray-400 mt-1">Visitors haven't left any feedback</p>
      </div>
    )}
  </div>
)}{detailTab === 'recommend' && (
    <div className="bg-white p-4 rounded-lg shadow">
      <h4 className="font-bold text-xl mb-4 text-teal-800 border-b pb-2">
        <span className="flex items-center">
          <svg className="w-5 h-5 mr-2 text-green-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Recommended Courses
        </span>
        <span className="block text-sm font-normal text-gray-500 mt-1">
          Based on analysis of {selectedGuide?.first_name}'s performance
        </span>
      </h4>
      {recommendations.length > 0 ? (
        <div className="space-y-6">
          {recommendations.map((rec, index) => (
            <div key={`${rec.aspect}-${index}`} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-wrap items-center justify-between mb-3">
                <h5 className="text-lg font-semibold capitalize text-gray-800">
                  {rec.aspect === 'language' ? 'Language Skills' :
                   rec.aspect === 'knowledge' ? 'Knowledge' :
                   rec.aspect === 'organization' ? 'Organizational Skills' :
                   rec.aspect === 'engagement' ? 'Engagement Skills' : 'Safety Awareness'}
                </h5>
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-teal-600 mr-1">
                    {typeof rec.score === 'number' ? rec.score.toFixed(1) : '0.0'}
                  </span>
                  <span className="text-gray-400 text-sm">/5</span>
                  <span className={`ml-3 px-2 py-1 text-xs rounded-full ${
                    rec.level === 'beginner' ? 'bg-emerald-50 text-emerald-600' :
                    rec.level === 'intermediate' ? 'bg-teal-50 text-teal-600' :
                    'bg-lime-50 text-lime-600'
                  }`}>
                    {rec.level === 'beginner' ? 'Beginner' : 
                     rec.level === 'intermediate' ? 'Intermediate' : 'Advanced'}
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className="h-2 rounded-full bg-gradient-to-r from-teal-600 to-green-500" 
                  style={{ width: `${((typeof rec.score === 'number' ? rec.score : 0) / 5) * 100}%` }}
                ></div>
              </div>
              {rec.modules && rec.modules.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {rec.modules.map(module => (
                    <div key={module.module_id} className="border rounded p-3 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between">
                        <h6 className="font-medium">{module.module_name}</h6>
                        <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                          {module.module_code}
                        </span>
                      </div>
                      {module.description && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {module.description}
                        </p>
                      )}
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-xs text-gray-500">
                          Difficulty:
                          <span className={`ml-1 px-1.5 py-0.5 rounded ${
                            module.difficulty === 'beginner' ? 'bg-emerald-50 text-emerald-600' :
                            module.difficulty === 'intermediate' ? 'bg-teal-50 text-teal-600' :
                            'bg-lime-50 text-lime-600'
                          }`}>
                            {module.difficulty}
                          </span>
                        </span>
                        <button
                          onClick={() => {
                            setSelectedModules(prev => ({
                              ...prev,
                              [rec.aspect]: module.module_id
                            }));                      
                          }}
                          className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100 transition-colors"
                        >
                          Assign Course
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-yellow-50 p-3 rounded-lg text-center">
                  <p className="text-yellow-700 flex items-center justify-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    No suitable {rec.level} level courses available at the moment
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h5 className="mt-2 text-lg font-medium text-gray-700">
            {feedbackData?.feedback_count > 0 
              ? "No recommended courses found" 
              : "Not enough feedback collected yet"}
          </h5>
          <p className="mt-1 text-gray-500">
            {feedbackData?.feedback_count > 0
              ? "The guide is performing well and currently doesn't need extra training!"
              : "Please check back after more visitor feedback is collected."}
          </p>
        </div>
      )}
    </div>
  )}
  {/* error handling */}
  {!['aspects', 'comments', 'recommend'].includes(detailTab) && (
    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
      <p className="text-red-600 flex items-center">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Error: Unknown label type
      </p>
    </div>
  )}
  </div>
)}
      {/* Assign Course Section */}
      {selectedGuide && (
        <div className="bg-white shadow rounded-lg p-6 mt-6 border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold">
                Assigning courses to: {selectedGuide.first_name} {selectedGuide.last_name}
              </h3>
              <p className="text-sm text-gray-600">
                {selectedGuide.assigned_modules?.length > 0 
                  ? `${selectedGuide.assigned_modules.length} courses already assigned`
                  : 'No courses assigned yet'}
              </p>
            </div>
            <button
          onClick={handleDeleteInProgressCourses}
          disabled={deleting || !selectedGuide.assigned_modules?.length}
          className={`px-3 py-1 rounded text-sm ${
            deleting ? 'bg-gray-300' :
            !selectedGuide.assigned_modules?.length ? 'bg-gray-200 cursor-not-allowed' :
            'bg-red-100 text-red-800 hover:bg-red-200'
          }`}
        >
          {deleting ? 'Deleting...' : 'Delete Course In progress'}
        </button>
            <button
              onClick={() => setSelectedGuide(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>         
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {aspects.map(aspect => (
              <div key={aspect} className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {aspect.charAt(0).toUpperCase() + aspect.slice(1)} Training:
                </label>
                <select
                  value={selectedModules[aspect] || ''}
                  onChange={(e) => setSelectedModules({ 
                    ...selectedModules, 
                    [aspect]: e.target.value ? parseInt(e.target.value) : null 
                  })}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
                >
                  <option value="">-- Select course --</option>
                  {modules
                    .filter(m => m.aspect === aspect)
                    .map(m => (
                <option 
                    key={m.module_id} 
                    value={m.module_id}
                    className={selectedGuide.assigned_modules?.includes(m.module_id) ? 'bg-blue-50' : ''}
                    >
                    {m.difficulty.charAt(0).toUpperCase() + m.difficulty.slice(1)} - {m.module_name}
                    {selectedGuide.assigned_modules?.includes(m.module_id) && ' ✓'}
                </option>

                    ))}
                </select>
              </div>
            ))}
          </div>
          <div className="flex justify-end space-x-3 border-t pt-4">
            <button
              onClick={() => {
                setSelectedGuide(null);
                setSelectedModules({});
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAssign}
              disabled={assigning}
              className={`px-4 py-2 rounded-md text-sm font-medium text-black ${
                assigning ? 'bg-blue-300 text-black'  : 'bg-blue-300 text-black'
              }`}
            >              
              {assigning ? (
                <>
                  <span className="inline-block animate-spin mr-2">↻</span>
                  {selectedGuide.assigned_modules?.length > 0 
                    ? 'Updating...' 
                    : 'Assigning...'}
                </>
              ) : selectedGuide.assigned_modules?.length > 0 
                ? 'Update Assignment' 
                : 'Confirm Assignment'}
        
            </button>
          </div>
        </div>
      )}
    </div>
  );
}