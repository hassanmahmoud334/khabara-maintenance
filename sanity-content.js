// sanity-content.js
import sanityClient from 'https://cdn.jsdelivr.net/npm/@sanity/client@3.0.0/dist/sanityClient.min.js'

// Configure the Sanity client
const client = sanityClient({
  projectId: '9arwwqhy', // replace with your Sanity project ID
  dataset: 'production',
  useCdn: true, // fast, cached
  apiVersion: '2025-12-05',
})

// Fetch and render articles
async function loadArticles() {
  const query = '*[_type=="article"]{title, body, "imageUrl": image.asset->url}'
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
    `
    container.appendChild(div)
  })
}

// Fetch and render staff
async function loadStaff() {
  const query = '*[_type=="staff"]{name, role, "photoUrl": photo.asset->url, bio}'
  const staffMembers = await client.fetch(query)
  const container = document.getElementById('staff')
  if (!container) return
  staffMembers.forEach(s => {
    const div = document.createElement('div')
    div.className = 'staff'
    div.innerHTML = `
      ${s.photoUrl ? `<img src="${s.photoUrl}" alt="${s.name}" />` : ''}
      <h3>${s.name}</h3>
      <p>${s.role}</p>
      <p>${s.bio}</p>
    `
    container.appendChild(div)
  })
}

// Run both functions
loadArticles()
loadStaff()
