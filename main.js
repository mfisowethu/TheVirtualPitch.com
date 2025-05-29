// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navMenu = document.querySelector('header nav');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Form validation for contact and comment forms
    const forms = document.querySelectorAll('form:not(.subscribe-form)');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            let isValid = true;
            const inputs = form.querySelectorAll('input[required], textarea[required]');
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                } else {
                    input.classList.remove('error');
                }
            });

            if (!isValid) {
                e.preventDefault();
                alert('Please fill in all required fields.');
            }
        });
    });

    // Like button functionality
    const likeButtons = document.querySelectorAll('.like-btn');
    likeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const postId = this.dataset.postId;
            const likeCount = this.querySelector('.like-count');
            let count = parseInt(likeCount.textContent);
            
            if (this.classList.contains('liked')) {
                count--;
                this.classList.remove('liked');
            } else {
                count++;
                this.classList.add('liked');
            }
            
            likeCount.textContent = count;
            
            // In a real app, you would send this to the backend
            console.log(`Post ${postId} like updated to ${count}`);
        });
    });

    // Dark mode toggle
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
        });

        // Check for saved user preference
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
        }
    }
});

// Simulated database functions (to be replaced with real backend)
const db = {
    posts: JSON.parse(localStorage.getItem('blogPosts')) || [],
    users: JSON.parse(localStorage.getItem('blogUsers')) || [
        { id: 1, username: 'admin', password: 'admin123', role: 'admin' }
    ],
    currentUser: null,

    // Post functions
    getPosts: function() {
        return this.posts;
    },
    getPost: function(id) {
        return this.posts.find(post => post.id == id);
    },
    addPost: function(post) {
        post.id = this.posts.length > 0 ? Math.max(...this.posts.map(p => p.id)) + 1 : 1;
        post.createdAt = new Date().toISOString();
        this.posts.push(post);
        this.savePosts();
        return post;
    },
    updatePost: function(id, updatedPost) {
        const index = this.posts.findIndex(post => post.id == id);
        if (index !== -1) {
            this.posts[index] = { ...this.posts[index], ...updatedPost };
            this.savePosts();
            return true;
        }
        return false;
    },
    deletePost: function(id) {
        const index = this.posts.findIndex(post => post.id == id);
        if (index !== -1) {
            this.posts.splice(index, 1);
            this.savePosts();
            return true;
        }
        return false;
    },
    savePosts: function() {
        localStorage.setItem('blogPosts', JSON.stringify(this.posts));
    },

    // User functions
    login: function(username, password) {
        const user = this.users.find(u => u.username === username && u.password === password);
        if (user) {
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            return user;
        }
        return null;
    },
    logout: function() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
    },
    getCurrentUser: function() {
        if (!this.currentUser) {
            const user = localStorage.getItem('currentUser');
            if (user) {
                this.currentUser = JSON.parse(user);
            }
        }
        return this.currentUser;
    },
    isAuthenticated: function() {
        return !!this.getCurrentUser();
    },
    isAdmin: function() {
        const user = this.getCurrentUser();
        return user && user.role === 'admin';
    }
};

// Initialize with some sample posts if empty
if (db.posts.length === 0) {
    db.addPost({
        title: 'Getting Started with JavaScript',
        content: 'JavaScript is a powerful programming language...',
        excerpt: 'Learn the basics of JavaScript programming.',
        category: 'Technology',
        tags: ['javascript', 'web development'],
        featured: true,
        image: 'images/post1.jpg'
    });
    db.addPost({
        title: 'Responsive Design Principles',
        content: 'Responsive design ensures your website looks good on all devices...',
        excerpt: 'Key principles for creating responsive websites.',
        category: 'Design',
        tags: ['css', 'responsive'],
        featured: false,
        image: 'images/post2.jpg'
    });
}