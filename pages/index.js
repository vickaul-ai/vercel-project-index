import { useState } from 'react';
import Head from 'next/head';
import ProjectCard from '../components/ProjectCard';
import FilterBar from '../components/FilterBar';
import projectsData from '../projects.json';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = projectsData.projects.filter((project) => {
    const matchesCategory = !selectedCategory || project.category === selectedCategory;
    const matchesSearch = !searchTerm ||
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const stats = {
    total: projectsData.projects.length,
    byCategory: projectsData.categories.reduce((acc, cat) => {
      acc[cat] = projectsData.projects.filter(p => p.category === cat).length;
      return acc;
    }, {}),
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
                <ProjectCard key={project.name} project={project} />
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
