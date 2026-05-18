function setLocal(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function getLocal(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

// Initialize default data
if (!localStorage.getItem('users')) {
    setLocal('users', [
        { id: 1, name: 'أدمن', email: 'admin@alizk.com', password: 'admin123', role: 'admin', date: new Date().toISOString() }
    ]);
}

if (!localStorage.getItem('files')) {
    setLocal('files', [
        { id: 1, name: 'مشروع React كامل', desc: 'مشروع متكامل لتعلم React', category: 'code', downloads: 15, date: new Date().toISOString() }
    ]);
}

if (!localStorage.getItem('botToken')) {
    setLocal('botToken', '8781090807:AAFYq2a6SnJ5TBcLDF-gmIBZfez1gcPJEyg');
}

function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser && !window.location.pathname.includes('login.html')) {
        window.location.href = 'login.html';
    }
}

if (document.querySelector('.typing-text')) {
    new Typed('#typed', {
        strings: ['PHP', 'JavaScript', 'Python', 'Java', 'React', 'Node.js'],
        typeSpeed: 50,
        backSpeed: 30,
        loop: true
    });
}

const themeBtn = document.querySelector('.theme-switch');
if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
    });
}

// Login/Register handlers
if (document.getElementById('loginForm')) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const tabs = document.querySelectorAll('.tab-btn');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
            document.getElementById(`${tab.dataset.tab}Form`).classList.add('active');
        });
    });
    
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const users = getLocal('users');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            if (user.role === 'admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'index.html';
            }
        } else {
            document.getElementById('authMessage').innerHTML = '<div class="alert alert-danger">بيانات دخول غير صحيحة</div>';
        }
    });
    
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const confirm = document.getElementById('regConfirmPassword').value;
        
        if (password !== confirm) {
            document.getElementById('authMessage').innerHTML = '<div class="alert alert-danger">كلمة السر غير متطابقة</div>';
            return;
        }
        
        const users = getLocal('users');
        if (users.find(u => u.email === email)) {
            document.getElementById('authMessage').innerHTML = '<div class="alert alert-danger">البريد الإلكتروني موجود مسبقاً</div>';
            return;
        }
        
        const newUser = {
            id: users.length + 1,
            name, email, password,
            role: 'user',
            date: new Date().toISOString()
        };
        users.push(newUser);
        setLocal('users', users);
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        window.location.href = 'index.html';
    });
}

document.getElementById('logoutBtn')?.addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
});