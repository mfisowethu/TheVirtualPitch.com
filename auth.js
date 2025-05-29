// Authentication functions
const Auth = {
    init: function() {
        this.checkLoginStatus();
        this.bindAuthEvents();
    },

    checkLoginStatus: function() {
        const currentUser = db.getCurrentUser();
        const authLinks = document.getElementById('auth-links');
        const adminLinks = document.getElementById('admin-links');
        
        if (authLinks) {
            if (currentUser) {
                authLinks.innerHTML = `
                    <li><a href="#" id="logout-link">Logout</a></li>
                    <li><a href="admin/dashboard.html">Dashboard</a></li>
                `;
                
                if (adminLinks && db.isAdmin()) {
                    adminLinks.style.display = 'block';
                }
            } else {
                authLinks.innerHTML = '<li><a href="admin/login.html">Login</a></li>';
                if (adminLinks) {
                    adminLinks.style.display = 'none';
                }
            }
        }
    },

    bindAuthEvents: function() {
        // Login form submission
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;
                
                const user = db.login(username, password);
                if (user) {
                    alert('Login successful!');
                    window.location.href = 'dashboard.html';
                } else {
                    alert('Invalid credentials');
                }
            });
        }

        // Logout link
        document.addEventListener('click', function(e) {
            if (e.target && e.target.id === 'logout-link') {
                e.preventDefault();
                db.logout();
                window.location.href = '../index.html';
            }
        });
    }
};

// Initialize auth when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    Auth.init();
});