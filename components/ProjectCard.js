import { useState } from 'react';

const categoryColors = {
  research: 'bg-purple-100 text-purple-800',
  client: 'bg-blue-100 text-blue-800',
  internal: 'bg-green-100 text-green-800',
  experiment: 'bg-orange-100 text-orange-800',
};

export default function ProjectCard({ project }) {
  const [copied, setCopied] = useState(false);

  const daysSinceUpdate = Math.floor(
    (new Date() - new Date(project.lastUpdated)) / (1000 * 60 * 60 * 24)
  );

  const copyUrl = () => {
    navigator.clipboard.writeText(project.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
        <span className={`text-xs px-2 py-1 rounded-full ${categoryColors[project.category] || 'bg-gray-100 text-gray-800'}`}>
          {project.category}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-4">{project.purpose}</p>

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
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center bg-gray-900 text-white text-sm py-2 px-4 rounded hover:bg-gray-700 transition-colors"
        >
          Visit Site
        </a>
        <button
          onClick={copyUrl}
          className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm"
        >
          {copied ? 'Copied!' : 'Copy URL'}
        </button>
      </div>
    </div>
  );
}
