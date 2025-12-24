export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, title } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Project name is required' });
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const OWNER = 'vickaul-ai';
  const REPO = 'vercel-project-index';
  const PATH = 'projects.json';

  if (!GITHUB_TOKEN) {
    return res.status(500).json({ error: 'GitHub token not configured' });
  }

  try {
    // Fetch current file from GitHub
    const getResponse = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    if (!getResponse.ok) {
      throw new Error('Failed to fetch projects.json from GitHub');
    }

    const fileData = await getResponse.json();
    const content = Buffer.from(fileData.content, 'base64').toString('utf8');
    const projectsData = JSON.parse(content);

    // Find and update the project
    const projectIndex = projectsData.projects.findIndex(p => p.name === name);
    if (projectIndex === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }

    projectsData.projects[projectIndex].title = title || null;

    // Commit updated file back to GitHub
    const newContent = Buffer.from(JSON.stringify(projectsData, null, 2) + '\n').toString('base64');

    const updateResponse = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Update title for ${name}`,
          content: newContent,
          sha: fileData.sha,
        }),
      }
    );

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json();
      throw new Error(errorData.message || 'Failed to update file');
    }

    res.status(200).json({ success: true, title: title || null });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: error.message });
  }
}
