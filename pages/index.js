import { useState } from 'react';
import Head from 'next/head';
import ProjectCard from '../components/ProjectCard';
import FilterBar from '../components/FilterBar';

export default function Home({ projectsData }) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [projects, setProjects] = useState(projectsData.projects);

  const filteredProjects = projects.filter((project) => {
    const matchesCategory = !selectedCategory || project.category === selectedCategory;
    const matchesSearch = !searchTerm ||
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.title && project.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      project.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const stats = {
    total: projects.length,
    byCategory: projectsData.categories.reduce((acc, cat) => {
      acc[cat] = projects.filter(p => p.category === cat).length;
      return acc;
    }, {}),
  };

  const handleTitleUpdate = (name, newTitle) => {
    setProjects(prev => prev.map(p =>
      p.name === name ? { ...p, title: newTitle } : p
    ));
  };

  return (
    <>
      <Head>
        <title>Vercel Project Index</title>
        <meta name="description" content="Dashboard of all deployed Vercel projects" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Vercel Project Index</h1>
            <p className="text-gray-600 mt-1">
              {stats.total} project{stats.total !== 1 ? 's' : ''} deployed
            </p>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-8">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {projectsData.categories.map((cat) => (
              <div
                key={cat}
                className="bg-white rounded-lg p-4 border border-gray-200 cursor-pointer hover:border-blue-500 transition-colors"
                onClick={() => setSelectedCategory(selectedCategory === cat ? '' : cat)}
              >
                <div className="text-2xl font-bold text-gray-900">{stats.byCategory[cat] || 0}</div>
                <div className="text-sm text-gray-600 capitalize">{cat}</div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <FilterBar
            categories={projectsData.categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          {/* Projects Grid */}
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.name}
                  project={project}
                  onTitleUpdate={handleTitleUpdate}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No projects found matching your criteria.
            </div>
          )}
        </main>

        <footer className="border-t border-gray-200 mt-12">
          <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
            Last updated: {new Date().toISOString().split('T')[0]}
          </div>
        </footer>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const OWNER = 'vickaul-ai';
  const REPO = 'vercel-project-index';
  const BRANCH = 'main';

  try {
    // Use raw.githubusercontent.com with cache-busting timestamp
    const timestamp = Date.now();
    const response = await fetch(
      `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/projects.json?t=${timestamp}`,
      {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }

    const projectsData = await response.json();

    return {
      props: {
        projectsData,
      },
      // Required for on-demand revalidation to work
      revalidate: 60, // Also revalidate every 60s as fallback
    };
  } catch (error) {
    console.error('Error fetching projects:', error);
    // Fallback to local file if fetch fails
    const projectsData = require('../projects.json');
    return {
      props: {
        projectsData,
      },
      revalidate: 60,
    };
  }
}
