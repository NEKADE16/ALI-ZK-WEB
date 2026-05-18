// دوال مساعدة
function setLocal(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function getLocal(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

// تهيئة البيانات الافتراضية
if (!localStorage.getItem('users')) {
    setLocal('users', [
        { id: 1, name: 'علي الزين', email: 'samartaleb90@gmail.com', password: '12344321', role: 'admin', date: new Date().toISOString(), provider: 'local' }
    ]);
}

if (!localStorage.getItem('files')) {
    setLocal('files', [
        { id: 1, name: 'مشروع React كامل', desc: 'مشروع متكامل لتعلم React مع شرح', category: 'code', downloads: 15, date: new Date().toISOString() },
        { id: 2, name: 'دورة JavaScript', desc: 'ملاحظات ودروس شاملة', category: 'pdf', downloads: 32, date: new Date().toISOString() }
    ]);
}

if (!localStorage.getItem('botToken')) {
    setLocal('botToken', '8781090807:AAFYq2a6SnJ5TBcLDF-gmIBZfez1gcPJEyg');
}

if (!localStorage.getItem('securityLogs')) {
    setLocal('securityLogs', []);
}

if (!localStorage.getItem('captchaEnabled')) {
    setLocal('captchaEnabled', true);
}

// التحقق من تسجيل الدخول
function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser && !window.location.pathname.includes('login.html') && !window.location.pathname.includes('index.html')) {
        window.location.href = 'login.html';
    }
    if (currentUser && currentUser.role === 'admin' && window.location.pathname.includes('admin.html')) {
        document.getElementById('adminLink')?.setAttribute('href', 'admin.html');
        document.getElementById('adminLink')?.style.display = 'block';
        document.getElementById('logoutBtn')?.style.display = 'block';
    }
}

// تأثير الكتابة التلقائية
if (document.querySelector('.typing-text')) {
    new Typed('#typed', {
        strings: ['PHP', 'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'Full Stack'],
        typeSpeed: 50,
        backSpeed: 30,
        loop: true
    });
}

// الوضع الليلي
const themeBtn = document.querySelector('.theme-switch');
if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
    });
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
    }
}

// شريط التنقل المتجاوب
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// تأثير التمرير للشريط
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// تمرير سلس
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// تسجيل الخروج
document.getElementById('logoutBtn')?.addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
});

// دوال CAPTCHA
function generateCaptcha() {
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);
    const operation = Math.random() > 0.5 ? '+' : '-';
    let answer;
    if (operation === '+') {
        answer = num1 + num2;
    } else {
        answer = num1 - num2;
    }
    return { question: `${num1} ${operation} ${num2} = ?`, answer: answer.toString() };
}

function initCaptchas() {
    const loginCaptcha = generateCaptcha();
    const registerCaptcha = generateCaptcha();
    const forgotCaptcha = generateCaptcha();
    
    const loginQuestion = document.getElementById('captchaQuestion');
    const registerQuestion = document.getElementById('captchaQuestionReg');
    const forgotQuestion = document.getElementById('captchaQuestionForgot');
    
    if (loginQuestion) {
        loginQuestion.textContent = loginCaptcha.question;
        loginQuestion.dataset.answer = loginCaptcha.answer;
    }
    if (registerQuestion) {
        registerQuestion.textContent = registerCaptcha.question;
        registerQuestion.dataset.answer = registerCaptcha.answer;
    }
    if (forgotQuestion) {
        forgotQuestion.textContent = forgotCaptcha.question;
        forgotQuestion.dataset.answer = forgotCaptcha.answer;
    }
}

// تحديث CAPTCHA
document.getElementById('refreshCaptcha')?.addEventListener('click', () => {
    const newCaptcha = generateCaptcha();
    const questionSpan = document.getElementById('captchaQuestion');
    questionSpan.textContent = newCaptcha.question;
    questionSpan.dataset.answer = newCaptcha.answer;
    document.getElementById('captchaInput').value = '';
});

document.getElementById('refreshCaptchaReg')?.addEventListener('click', () => {
    const newCaptcha = generateCaptcha();
    const questionSpan = document.getElementById('captchaQuestionReg');
    questionSpan.textContent = newCaptcha.question;
    questionSpan.dataset.answer = newCaptcha.answer;
    document.getElementById('captchaInputReg').value = '';
});

document.getElementById('refreshCaptchaForgot')?.addEventListener('click', () => {
    const newCaptcha = generateCaptcha();
    const questionSpan = document.getElementById('captchaQuestionForgot');
    questionSpan.textContent = newCaptcha.question;
    questionSpan.dataset.answer = newCaptcha.answer;
    document.getElementById('captchaInputForgot').value = '';
});

// تسجيل الدخول
if (document.getElementById('loginForm')) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const forgotForm = document.getElementById('forgotForm');
    const tabs = document.querySelectorAll('.tab-btn');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
            document.getElementById(`${tab.dataset.tab}Form`).classList.add('active');
        });
    });
    
    // إظهار/إخفاء كلمة السر
    document.querySelectorAll('.toggle-password').forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            if (input.type === 'password') {
                input.type = 'text';
                this.classList.remove('fa-eye');
                this.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                this.classList.remove('fa-eye-slash');
                this.classList.add('fa-eye');
            }
        });
    });
    
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // التحقق من CAPTCHA
        const captchaEnabled = getLocal('captchaEnabled');
        if (captchaEnabled) {
            const captchaAnswer = document.getElementById('captchaQuestion').dataset.answer;
            const userAnswer = document.getElementById('captchaInput').value;
            if (userAnswer !== captchaAnswer) {
                document.getElementById('authMessage').innerHTML = '<div class="alert alert-danger">❌ إجابة CAPTCHA غير صحيحة</div>';
                initCaptchas();
                return;
            }
        }
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const users = getLocal('users');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // تسجيل محاولة ناجحة
            const logs = getLocal('securityLogs');
            logs.unshift({ type: 'success', email: email, time: new Date().toISOString(), ip: 'local' });
            setLocal('securityLogs', logs.slice(0, 50));
            
            localStorage.setItem('currentUser', JSON.stringify(user));
            if (user.role === 'admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'index.html';
            }
        } else {
            // تسجيل محاولة فاشلة
            const logs = getLocal('securityLogs');
            logs.unshift({ type: 'failed', email: email, time: new Date().toISOString(), ip: 'local' });
            setLocal('securityLogs', logs.slice(0, 50));
            
            document.getElementById('authMessage').innerHTML = '<div class="alert alert-danger">❌ البريد الإلكتروني أو كلمة السر غير صحيحة</div>';
        }
    });
    
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const captchaEnabled = getLocal('captchaEnabled');
        if (captchaEnabled) {
            const captchaAnswer = document.getElementById('captchaQuestionReg').dataset.answer;
            const userAnswer = document.getElementById('captchaInputReg').value;
            if (userAnswer !== captchaAnswer) {
                document.getElementById('authMessage').innerHTML = '<div class="alert alert-danger">❌ إجابة CAPTCHA غير صحيحة</div>';
                initCaptchas();
                return;
            }
        }
        
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const confirm = document.getElementById('regConfirmPassword').value;
        
        if (password !== confirm) {
            document.getElementById('authMessage').innerHTML = '<div class="alert alert-danger">❌ كلمة السر غير متطابقة</div>';
            return;
        }
        
        if (password.length < 6) {
            document.getElementById('authMessage').innerHTML = '<div class="alert alert-danger">❌ كلمة السر يجب أن تكون 6 أحرف على الأقل</div>';
            return;
        }
        
        const users = getLocal('users');
        if (users.find(u => u.email === email)) {
            document.getElementById('authMessage').innerHTML = '<div class="alert alert-danger">❌ البريد الإلكتروني موجود مسبقاً</div>';
            return;
        }
        
        const newUser = {
            id: users.length + 1,
            name, email, password,
            role: 'user',
            date: new Date().toISOString(),
            provider: 'local'
        };
        users.push(newUser);
        setLocal('users', users);
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        window.location.href = 'index.html';
    });
    
    forgotForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const captchaEnabled = getLocal('captchaEnabled');
        if (captchaEnabled) {
            const captchaAnswer = document.getElementById('captchaQuestionForgot').dataset.answer;
            const userAnswer = document.getElementById('captchaInputForgot').value;
            if (userAnswer !== captchaAnswer) {
                document.getElementById('forgotMessage').innerHTML = '<div class="alert alert-danger">❌ إجابة CAPTCHA غير صحيحة</div>';
                initCaptchas();
                return;
            }
        }
        
        const email = document.getElementById('forgotEmail').value;
        const users = getLocal('users');
        const user = users.find(u => u.email === email);
        
        if (user) {
            // محاكاة إرسال رابط استعادة
            const resetLink = window.location.origin + '/login.html';
            alert(`✅ تم إرسال رابط استعادة كلمة المرور إلى ${email}\nالرابط: ${resetLink}\n(هذه محاكاة، في الإصدار الحقيقي سيتم إرسال إيميل حقيقي)`);
            document.getElementById('forgotMessage').innerHTML = '<div class="alert alert-success">✅ تم إرسال رابط الاستعادة إلى بريدك الإلكتروني</div>';
        } else {
            document.getElementById('forgotMessage').innerHTML = '<div class="alert alert-danger">❌ لا يوجد حساب مرتبط بهذا البريد الإلكتروني</div>';
        }
    });
    
    initCaptchas();
}

// إظهار/إخفاء روابط الأدمن حسب تسجيل الدخول
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (currentUser && currentUser.role === 'admin') {
    const adminLink = document.getElementById('adminLink');
    const logoutBtn = document.getElementById('logoutBtn');
    if (adminLink) adminLink.style.display = 'block';
    if (logoutBtn) logoutBtn.style.display = 'block';
}