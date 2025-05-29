// Admin functions
const Admin = {
    init: function() {
        if (!db.isAdmin()) {
            window.location.href = '../admin/login.html';
            return;
        }

        this.loadPosts();
        this.bindAdminEvents();
    },

    loadPosts: function() {
        const postsTable = document.getElementById('posts-table');
        const postsList = document.getElementById('posts-list');
        const posts = db.getPosts();

        if (postsTable) {
            const tbody = postsTable.querySelector('tbody');
            tbody.innerHTML = posts.map(post => `
                <tr>
                    <td>${post.id}</td>
                    <td>${post.title}</td>
                    <td>${post.category}</td>
                    <td>${new Date(post.createdAt).toLocaleDateString()}</td>
                    <td>
                        <a href="edit-post.html?id=${post.id}" class="btn btn-edit">Edit</a>
                        <button data-id="${post.id}" class="btn btn-delete">Delete</button>
                    </td>
                </tr>
            `).join('');
        }

        if (postsList) {
            postsList.innerHTML = posts.map(post => `
                <li>
                    <h3>${post.title}</h3>
                    <p>${post.excerpt}</p>
                    <div class="post-actions">
                        <a href="edit-post.html?id=${post.id}" class="btn btn-edit">Edit</a>
                        <button data-id="${post.id}" class="btn btn-delete">Delete</button>
                    </div>
                </li>
            `).join('');
        }
    },

    bindAdminEvents: function() {
        // Delete post
        document.addEventListener('click', function(e) {
            if (e.target && e.target.classList.contains('btn-delete')) {
                if (confirm('Are you sure you want to delete this post?')) {
                    const postId = e.target.dataset.id;
                    if (db.deletePost(postId)) {
                        alert('Post deleted successfully');
                        window.location.reload();
                    } else {
                        alert('Error deleting post');
                    }
                }
            }
        });

        // Save post form
        const postForm = document.getElementById('post-form');
        if (postForm) {
            const urlParams = new URLSearchParams(window.location.search);
            const postId = urlParams.get('id');

            // If editing, load the post data
            if (postId) {
                const post = db.getPost(postId);
                if (post) {
                    document.getElementById('title').value = post.title;
                    document.getElementById('content').value = post.content;
                    document.getElementById('excerpt').value = post.excerpt;
                    document.getElementById('category').value = post.category;
                    document.getElementById('tags').value = post.tags.join(', ');
                    document.getElementById('featured').checked = post.featured;
                }
            }

            postForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const postData = {
                    title: document.getElementById('title').value,
                    content: document.getElementById('content').value,
                    excerpt: document.getElementById('excerpt').value,
                    category: document.getElementById('category').value,
                    tags: document.getElementById('tags').value.split(',').map(tag => tag.trim()),
                    featured: document.getElementById('featured').checked,
                    image: document.getElementById('image').value || 'images/default-post.jpg'
                };

                if (postId) {
                    // Update existing post
                    if (db.updatePost(postId, postData)) {
                        alert('Post updated successfully');
                        window.location.href = 'dashboard.html';
                    } else {
                        alert('Error updating post');
                    }
                } else {
                    // Create new post
                    const post = db.addPost(postData);
                    if (post) {
                        alert('Post created successfully');
                        window.location.href = 'dashboard.html';
                    } else {
                        alert('Error creating post');
                    }
                }
            });
        }
    }
};

// Initialize admin when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize on admin pages
    if (window.location.pathname.includes('/admin/')) {
        Admin.init();
    }
});