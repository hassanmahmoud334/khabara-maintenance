import sanityClient from 'https://cdn.jsdelivr.net/npm/@sanity/client@3.0.0/dist/sanityClient.min.js'

const client = sanityClient({
  projectId: 'y7i10luq',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2023-01-01',
})

// Load custom articles
async function loadArticles() {
  const query = '*[_type=="article"]{title, body, "imageUrl": image.asset->url, publishedAt}'
  const articles = await client.fetch(query)

  const container = document.getElementById('articles')
  if (!container) return

  articles.forEach(a => {
    const div = document.createElement('div')
    div.className = 'article'

    div.innerHTML = `
      <h2>${a.title}</h2>
      ${a.imageUrl ? `<img src="${a.imageUrl}" alt="${a.title}" />` : ''}
      <p>${a.body}</p>
      <small>${a.publishedAt ? new Date(a.publishedAt).toLocaleDateString() : ''}</small>
      <hr>
    `
    container.appendChild(div)
  })
}

// Load custom staff
async function loadStaff() {
  const query = '*[_type=="staff"]{name, role, bio, "photoUrl": photo.asset->url}'
  const staff = await client.fetch(query)

  const container = document.getElementById('staff')
  if (!container) return

  staff.forEach(s => {
    const div = document.createElement('div')
    div.className = 'staff'

    div.innerHTML = `
      ${s.photoUrl ? `<img src="${s.photoUrl}" alt="${s.name}" />` : ''}
      <h3>${s.name}</h3>
      <p>${s.role}</p>
      <p>${s.bio}</p>
      <hr>
    `
    container.appendChild(div)
  })
}

loadArticles()
loadStaff()
