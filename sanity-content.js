const projectId = 'y7i10luq';
const dataset = 'production';

// Utility to fetch from Sanity
async function fetchSanity(query) {
  const url = `https://${projectId}.api.sanity.io/v2023-01-01/data/query/${dataset}?query=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.result || [];
}

// Load articles
async function loadArticles() {
  const query = '*[_type=="article"]{title, body, "imageUrl": image.asset->url, publishedAt}';
  const articles = await fetchSanity(query);

  const container = document.getElementById('articles');
  container.innerHTML = '';
  
  articles.forEach(a => {
    const div = document.createElement('div');
    div.className = 'article';
    div.innerHTML = `
      <h2>${a.title}</h2>
      ${a.imageUrl ? `<img src="${a.imageUrl}" alt="${a.title}">` : ''}
      <p>${a.body}</p>
      <small>${a.publishedAt ? new Date(a.publishedAt).toLocaleDateString() : ''}</small>
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
