import { useState } from 'react';

const categoryColors = {
  research: 'bg-purple-100 text-purple-800',
  client: 'bg-blue-100 text-blue-800',
  internal: 'bg-green-100 text-green-800',
  experiment: 'bg-orange-100 text-orange-800',
};

export default function ProjectCard({ project, onTitleUpdate }) {
  const [copied, setCopied] = useState(false);
  const [deleteCopied, setDeleteCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(project.title || '');
  const [saving, setSaving] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(project.title);

  const daysSinceUpdate = Math.floor(
    (new Date() - new Date(project.lastUpdated)) / (1000 * 60 * 60 * 24)
  );

  const copyUrl = () => {
    navigator.clipboard.writeText(project.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyDeleteCommand = () => {
    navigator.clipboard.writeText(`delete project ${project.name}`);
    setDeleteCopied(true);
    setTimeout(() => setDeleteCopied(false), 2000);
  };

  const handleEditClick = () => {
    setEditTitle(currentTitle || '');
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditTitle(currentTitle || '');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/projects/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: project.name,
          title: editTitle.trim() || null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save');
      }

      setCurrentTitle(editTitle.trim() || null);
      setIsEditing(false);
      if (onTitleUpdate) {
        onTitleUpdate(project.name, editTitle.trim() || null);
      }
    } catch (error) {
      alert('Failed to save: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const displayTitle = currentTitle || 'Untitled';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-1">
        {isEditing ? (
          <div className="flex-1 mr-2">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Enter title..."
              className="w-full px-2 py-1 text-lg font-semibold border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') handleCancel();
              }}
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleCancel}
                disabled={saving}
                className="px-3 py-1 border border-gray-300 text-xs rounded hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 group">
            <div className="flex items-center gap-2">
              <h3 className={`text-lg font-semibold ${currentTitle ? 'text-gray-900' : 'text-gray-400 italic'}`}>
                {displayTitle}
              </h3>
              <button
                onClick={handleEditClick}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition-opacity"
                title="Edit title"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-gray-400 font-mono">{project.name}</p>
          </div>
        )}
        <span className={`text-xs px-2 py-1 rounded-full ${categoryColors[project.category] || 'bg-gray-100 text-gray-800'}`}>
          {project.category}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-4 mt-3">{project.purpose}</p>

      <div className="flex flex-wrap gap-1 mb-4">
        {project.tags?.map((tag, i) => (
          <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
            {tag}
          </span>
        ))}
      </div>

      <div className="text-xs text-gray-500 mb-4 space-y-1">
        <div>Created: {project.created}</div>
        <div className="flex items-center gap-2">
          Updated: {project.lastUpdated}
          {daysSinceUpdate > 0 && (
            <span className={`px-1.5 py-0.5 rounded ${daysSinceUpdate > 30 ? 'bg-red-100 text-red-700' : daysSinceUpdate > 7 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
              {daysSinceUpdate}d ago
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        {project.url ? (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center bg-gray-900 text-white text-sm py-2 px-4 rounded hover:bg-gray-700 transition-colors"
          >
            Visit Site
          </a>
        ) : (
          <span className="flex-1 text-center bg-gray-200 text-gray-500 text-sm py-2 px-4 rounded cursor-not-allowed">
            No URL
          </span>
        )}
        <button
          onClick={copyUrl}
          disabled={!project.url}
          className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {copied ? 'Copied!' : 'Copy URL'}
        </button>
        <button
          onClick={copyDeleteCommand}
          className="px-3 py-2 border border-red-200 text-red-600 rounded hover:bg-red-50 transition-colors text-sm"
          title="Copy delete command for Claude"
        >
          {deleteCopied ? 'Copied!' : 'Delete'}
        </button>
      </div>
    </div>
  );
}
