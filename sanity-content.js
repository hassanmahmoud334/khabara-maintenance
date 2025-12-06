const projectId = 'y7i10luq';
const dataset = 'production';

// Utility to fetch from Sanity
async function fetchSanity(query) {
  const url = `https://${projectId}.api.sanity.io/v2023-01-01/data/query/${dataset}?query=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  const data = await res.json();
  console.log(data)
  return data.result || [];
}

// Render Sanity block content to HTML
function renderContent(blocks) {
  if (!blocks || !Array.isArray(blocks)) return '';

  return blocks.map(block => {
    if (block._type !== 'block') return '';

    // Determine HTML tag based on block style
    const tag = block.style === 'h1' ? 'h1' :
                block.style === 'h2' ? 'h2' :
                block.style === 'h3' ? 'h3' :
                block.style === 'blockquote' ? 'blockquote' :
                'p';

    // Render children with marks (bold, italic)
    const innerHTML = block.children.map(child => {
      let text = child.text || '';
      if (child.marks && child.marks.includes('strong')) text = `<strong>${text}</strong>`;
      if (child.marks && child.marks.includes('em')) text = `<em>${text}</em>`;
      return text;
    }).join('');

    return `<${tag}>${innerHTML}</${tag}>`;
  }).join('');
}

// Load articles
async function loadArticles() {
  const query = '*[_type=="article"]{title, content, "imageUrl": image.asset->url, _createdAt}';
  const articles = await fetchSanity(query);

  const container = document.getElementById('articles');
  container.innerHTML = '';

  articles.forEach(a => {
    const div = document.createElement('div');
    div.className = 'article';
    div.innerHTML = `
      <h2>${a.title}</h2>
      ${a.imageUrl ? `<img src="${a.imageUrl}" alt="${a.title}">` : ''}
      ${renderContent(a.content)}
      <small>${a._createdAt ? new Date(a._createdAt).toLocaleDateString() : ''}</small>
      <hr>
    `;
    container.appendChild(div);
  });
}

// Load staff
async function loadStaff() {
  const query = '*[_type=="staff"]{name, role, bio, "photoUrl": photo.asset->url}';
  const staff = await fetchSanity(query);

  const container = document.getElementById('staff');
  container.innerHTML = '';

  staff.forEach(s => {
    const div = document.createElement('div');
    div.className = 'staff';
    div.innerHTML = `
      ${s.photoUrl ? `<img src="${s.photoUrl}" alt="${s.name}">` : ''}
      <h3>${s.name}</h3>
      <p>${s.role}</p>
      <p>${s.bio}</p>
      <hr>
    `;
    container.appendChild(div);
  });
}

// Load everything after page loads
document.addEventListener('DOMContentLoaded', () => {
  loadArticles();
  loadStaff();
});
