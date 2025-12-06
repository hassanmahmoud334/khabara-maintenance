// Use the global sanityClient provided by the UMD script
const client = sanityClient({
  projectId: 'y7i10luq',    // your Sanity project ID
  dataset: 'production',     // your dataset
  useCdn: true,              // use CDN for faster responses
  apiVersion: '2023-01-01'   // API version
});

// Load articles
async function loadArticles() {
  try {
    const query = '*[_type=="article"]{title, body, "imageUrl": image.asset->url, publishedAt}';
    const articles = await client.fetch(query);

    const container = document.getElementById('articles');
    if (!container) return;

    container.innerHTML = ''; // clear previous content

    articles.forEach(a => {
      const div = document.createElement('div');
      div.className = 'article';
      div.innerHTML = `
        <h2>${a.title}</h2>
        ${a.imageUrl ? `<img src="${a.imageUrl}" alt="${a.title}" />` : ''}
        <p>${a.body}</p>
        <small>${a.publishedAt ? new Date(a.publishedAt).toLocaleDateString() : ''}</small>
        <hr>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    console.error('Error loading articles:', err);
  }
}

// Load staff
async function loadStaff() {
  try {
    const query = '*[_type=="staff"]{name, role, bio, "photoUrl": photo.asset->url}';
    const staff = await client.fetch(query);

    const container = document.getElementById('staff');
    if (!container) return;

    container.innerHTML = ''; // clear previous content

    staff.forEach(s => {
      const div = document.createElement('div');
      div.className = 'staff';
      div.innerHTML = `
        ${s.photoUrl ? `<img src="${s.photoUrl}" alt="${s.name}" />` : ''}
        <h3>${s.name}</h3>
        <p>${s.role}</p>
        <p>${s.bio}</p>
        <hr>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    console.error('Error loading staff:', err);
  }
}

// Load everything after the page is ready
document.addEventListener('DOMContentLoaded', () => {
  loadArticles();
  loadStaff();
});
