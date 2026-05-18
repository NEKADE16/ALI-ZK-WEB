const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser || currentUser.role !== 'admin') {
    window.location.href = 'login.html';
}

document.getElementById('adminName').innerText = currentUser.name;

function setLocal(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function getLocal(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

// تحديث الإحصائيات
function updateStats() {
    const users = getLocal('users');
    const files = getLocal('files');
    const securityLogs = getLocal('securityLogs');
    document.getElementById('totalUsers').innerText = users.length;
    document.getElementById('totalFiles').innerText = files.length;
    const totalDownloads = files.reduce((sum, f) => sum + (f.downloads || 0), 0);
    document.getElementById('totalDownloads').innerText = totalDownloads;
    const blockedAttempts = securityLogs.filter(log => log.type === 'failed').length;
    document.getElementById('blockedAttempts').innerText = blockedAttempts;
}

// عرض المستخدمين
function renderUsers() {
    const users = getLocal('users');
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;
    tbody.innerHTML = users.filter(u => u.role !== 'admin').map(user => `
        <tr>
            <td>${user.name}</td>
            <td>${user.email}${user.provider === 'google' ? ' <span style="color:#4285f4;"><i class="fab fa-google"></i></span>' : ''}</td>
            <td>${user.role === 'admin' ? 'أدمن' : 'مستخدم'}</td>
            <td>${new Date(user.date).toLocaleDateString('ar-EG')}</td>
            <td><button onclick="deleteUser(${user.id})" class="btn-sm btn-danger"><i class="fas fa-trash"></i></button>${user.role !== 'admin' ? ` <button onclick="blockUser(${user.id})" class="btn-sm btn-warning"><i class="fas fa-ban"></i></button>` : ''}</td>
        </tr>
    `).join('');
}

window.deleteUser = function(id) {
    if (confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
        let users = getLocal('users');
        users = users.filter(u => u.id !== id);
        setLocal('users', users);
        renderUsers();
        updateStats();
    }
};

window.blockUser = function(id) {
    alert('تم حظر المستخدم (سيتم تطبيق هذه الميزة في التحديث القادم)');
};

// عرض الملفات
function renderFiles() {
    const files = getLocal('files');
    const container = document.getElementById('allFilesGrid');
    if (!container) return;
    container.innerHTML = files.map(file => `
        <div class="file-card">
            <i class="fas ${file.category === 'code' ? 'fa-file-code' : file.category === 'pdf' ? 'fa-file-pdf' : 'fa-file-alt'}" style="font-size: 3rem; color: var(--primary);"></i>
            <h4>${file.name}</h4>
            <p>${file.desc || 'لا يوجد وصف'}</p>
            <small>📥 ${file.downloads || 0} تحميل</small>
            <div class="file-actions">
                <button onclick="downloadFile(${file.id})" class="btn-sm btn-success"><i class="fas fa-download"></i></button>
                <button onclick="deleteFile(${file.id})" class="btn-sm btn-danger"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

window.downloadFile = function(id) {
    let files = getLocal('files');
    const file = files.find(f => f.id === id);
    if (file) {
        file.downloads = (file.downloads || 0) + 1;
        setLocal('files', files);
        alert(`جاري تحميل: ${file.name}`);
        renderFiles();
        updateStats();
    }
};

window.deleteFile = function(id) {
    if (confirm('هل أنت متأكد من حذف هذا الملف؟')) {
        let files = getLocal('files');
        files = files.filter(f => f.id !== id);
        setLocal('files', files);
        renderFiles();
        updateStats();
    }
};

// رفع الملفات
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileUploadInput');

if (uploadArea) {
    uploadArea.addEventListener('click', () => fileInput.click());
    uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.style.background = '#f0f0f0'; });
    uploadArea.addEventListener('dragleave', () => uploadArea.style.background = '');
    uploadArea.addEventListener('drop', (e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); });
    fileInput.addEventListener('change', (e) => handleFiles(e.target.files));
}

function handleFiles(files) {
    if (files.length > 0) {
        const file = files[0];
        document.getElementById('uploadFileName').value = file.name;
        document.getElementById('uploadFileDesc').focus();
    }
}

document.getElementById('confirmUploadBtn')?.addEventListener('click', () => {
    const name = document.getElementById('uploadFileName').value;
    const desc = document.getElementById('uploadFileDesc').value;
    const category = document.getElementById('uploadFileCategory').value;
    if (!name) {
        alert('الرجاء إدخال اسم الملف');
        return;
    }
    const files = getLocal('files');
    const newFile = {
        id: files.length + 1,
        name: name,
        desc: desc,
        category: category,
        downloads: 0,
        date: new Date().toISOString()
    };
    files.push(newFile);
    setLocal('files', files);
    alert('تم رفع الملف بنجاح');
    document.getElementById('uploadFileName').value = '';
    document.getElementById('uploadFileDesc').value = '';
    renderFiles();
    updateStats();
    document.querySelector('[data-tab="files"]').click();
});

// إرسال الإيميلات
document.getElementById('bulkEmailForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const subject = document.getElementById('emailSubject').value;
    const body = document.getElementById('emailBody').value;
    const recipient = document.getElementById('emailRecipient').value;
    
    if (recipient === 'all') {
        const users = getLocal('users');
        alert(`✅ تم إرسال الإيميل إلى ${users.length} مستخدم\nالموضوع: ${subject}\n(محاكاة - سيتم ربطه بخدمة إيميل حقيقية لاحقاً)`);
    }
    document.getElementById('emailSubject').value = '';
    document.getElementById('emailBody').value = '';
});

// دوال التليجرام
async function sendTelegramMessage(chatId, message) {
    const botToken = getLocal('botToken');
    if (!botToken) {
        console.error('لا يوجد توكن بوت');
        return false;
    }
    
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML'
            })
        });
        const result = await response.json();
        return result.ok;
    } catch (error) {
        console.error('خطأ في إرسال رسالة تليجرام:', error);
        return false;
    }
}

function generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

let tempVerificationCode = null;
let tempNewData = null;

function displayCurrentAdmin() {
    const users = getLocal('users');
    const admin = users.find(u => u.role === 'admin');
    if (admin && document.getElementById('currentAdminEmail')) {
        document.getElementById('currentAdminEmail').innerText = admin.email;
    }
}

function startCodeTimer() {
    let timeLeft = 300;
    const timerElement = document.getElementById('codeTimer');
    
    const timer = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerElement.innerHTML = `⏱️ يبقى ${minutes}:${seconds.toString().padStart(2, '0')} لإدخال الكود`;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            timerElement.innerHTML = '⏰ انتهت صلاحية الكود';
            document.getElementById('verifyCodeSection').style.display = 'none';
            document.getElementById('requestCodeBtn').disabled = false;
            document.getElementById('requestCodeBtn').innerHTML = '<i class="fas fa-paper-plane"></i> طلب كود التأكيد';
            tempVerificationCode = null;
            tempNewData = null;
        }
        timeLeft--;
    }, 1000);
}

document.getElementById('changeAdminForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const newEmail = document.getElementById('newAdminEmail').value;
    const newPassword = document.getElementById('newAdminPassword').value;
    const telegramChatId = document.getElementById('telegramChatId').value;
    
    if (!newEmail || !newPassword) {
        alert('❌ الرجاء إدخال البريد الإلكتروني وكلمة السر الجديدة');
        return;
    }
    
    if (!telegramChatId) {
        alert('❌ الرجاء إدخال معرف تليجرام (Chat ID)');
        return;
    }
    
    tempNewData = { email: newEmail, password: newPassword, chatId: telegramChatId };
    tempVerificationCode = generateCode();
    
    const message = `🔐 <b>تغيير بيانات حساب الأدمن</b> 🔐\n\nتم طلب تغيير بيانات حساب الأدمن.\n\n📧 البريد الجديد: ${newEmail}\n🔑 كلمة السر الجديدة: ${newPassword}\n\n🔢 <b>كود التأكيد:</b> <code>${tempVerificationCode}</code>\n\n⚠️ إذا لم تكن أنت من قام بهذا الطلب، يرجى تغيير كلمة السر فوراً.`;
    
    const sent = await sendTelegramMessage(telegramChatId, message);
    
    if (sent) {
        alert('✅ تم إرسال كود التأكيد إلى تليجرام');
        document.getElementById('verifyCodeSection').style.display = 'block';
        document.getElementById('requestCodeBtn').disabled = true;
        document.getElementById('requestCodeBtn').innerHTML = '<i class="fas fa-clock"></i> تم إرسال الكود';
        startCodeTimer();
    } else {
        alert('❌ فشل إرسال الكود إلى تليجرام. تأكد من التوكن و Chat ID');
    }
});

document.getElementById('confirmChangeBtn')?.addEventListener('click', () => {
    const enteredCode = document.getElementById('verificationCode').value;
    
    if (!tempVerificationCode || !tempNewData) {
        alert('❌ يرجى طلب كود جديد أولاً');
        return;
    }
    
    if (enteredCode !== tempVerificationCode) {
        alert('❌ الكود غير صحيح!');
        return;
    }
    
    let users = getLocal('users');
    const adminIndex = users.findIndex(u => u.role === 'admin');
    
    if (adminIndex !== -1) {
        users[adminIndex].email = tempNewData.email;
        users[adminIndex].password = tempNewData.password;
        setLocal('users', users);
        
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.role === 'admin') {
            currentUser.email = tempNewData.email;
            currentUser.password = tempNewData.password;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            document.getElementById('adminName').innerText = currentUser.name;
        }
        
        sendTelegramMessage(tempNewData.chatId, `✅ <b>تم تغيير بيانات الأدمن بنجاح!</b>\n\n📧 البريد الجديد: ${tempNewData.email}\n🔑 كلمة السر الجديدة: ${tempNewData.password}\n\n⚠️ احتفظ بهذه المعلومات في مكان آمن.`);
        
        alert('✅ تم تغيير بيانات الأدمن بنجاح!');
        
        tempVerificationCode = null;
        tempNewData = null;
        document.getElementById('verifyCodeSection').style.display = 'none';
        document.getElementById('requestCodeBtn').disabled = false;
        document.getElementById('requestCodeBtn').innerHTML = '<i class="fas fa-paper-plane"></i> طلب كود التأكيد';
        document.getElementById('changeAdminForm').reset();
        displayCurrentAdmin();
    }
});

// إعدادات البوت
function displayCurrentBotToken() {
    const botToken = getLocal('botToken');
    const currentBotTokenSpan = document.getElementById('currentBotToken');
    if (currentBotTokenSpan && botToken) {
        const maskedToken = botToken.substring(0, 10) + '•••••••••••••••';
        currentBotTokenSpan.innerText = maskedToken;
    }
}

document.getElementById('showBotTokenFormBtn')?.addEventListener('click', () => {
    document.getElementById('botTokenForm').style.display = 'block';
});

document.getElementById('saveBotTokenBtn')?.addEventListener('click', () => {
    const adminPassword = document.getElementById('adminPasswordVerify').value;
    const users = getLocal('users');
    const admin = users.find(u => u.role === 'admin');
    
    if (admin && admin.password !== adminPassword) {
        document.getElementById('botTokenMessage').innerHTML = '<div class="alert alert-danger">❌ كلمة المرور غير صحيحة</div>';
        return;
    }
    
    const newToken = document.getElementById('newBotToken').value;
    if (!newToken) {
        document.getElementById('botTokenMessage').innerHTML = '<div class="alert alert-danger">❌ الرجاء إدخال التوكن الجديد</div>';
        return;
    }
    
    setLocal('botToken', newToken);
    document.getElementById('botTokenMessage').innerHTML = '<div class="alert alert-success">✅ تم تغيير توكن البوت بنجاح!</div>';
    document.getElementById('botTokenForm').style.display = 'none';
    document.getElementById('adminPasswordVerify').value = '';
    document.getElementById('newBotToken').value = '';
    displayCurrentBotToken();
    
    setTimeout(() => {
        document.getElementById('botTokenMessage').innerHTML = '';
    }, 3000);
});

// إعدادات الأمان
document.getElementById('captchaEnabled')?.addEventListener('change', (e) => {
    setLocal('captchaEnabled', e.target.checked);
});

document.getElementById('twoFactorEnabled')?.addEventListener('change', (e) => {
    alert(e.target.checked ? 'تم تفعيل التحقق بخطوتين' : 'تم إلغاء تفعيل التحقق بخطوتين');
});

// عرض سجل الأمان
function displaySecurityLogs() {
    const logs = getLocal('securityLogs');
    const container = document.getElementById('securityLogs');
    if (container) {
        container.innerHTML = logs.slice(0, 20).map(log => `
            <div class="log-entry ${log.type}">
                <i class="fas ${log.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i>
                <span>${log.email}</span>
                <small>${new Date(log.time).toLocaleString('ar-EG')}</small>
            </div>
        `).join('');
        if (logs.length === 0) container.innerHTML = '<p>لا توجد سجلات أمان</p>';
    }
}

// تبديل التبويبات
document.querySelectorAll('.sidebar-menu li').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('.sidebar-menu li').forEach(li => li.classList.remove('active'));
        item.classList.add('active');
        const tab = item.dataset.tab;
        document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
        document.getElementById(tab).classList.add('active');
    });
});

// الرسم البياني
if (document.getElementById('statsChart')) {
    const ctx = document.getElementById('statsChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: { labels: ['الأسبوع 1', 'الأسبوع 2', 'الأسبوع 3', 'الأسبوع 4'], datasets: [{ label: 'المستخدمين الجدد', data: [5, 12, 8, 15], borderColor: '#6c5ce7', backgroundColor: 'rgba(108, 92, 231, 0.1)', tension: 0.4, fill: true }] },
        options: { responsive: true, maintainAspectRatio: true }
    });
}

// تسجيل الخروج
document.getElementById('adminLogout')?.addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
});

// تهيئة الصفحة
updateStats();
renderUsers();
renderFiles();
displayCurrentAdmin();
displayCurrentBotToken();
displaySecurityLogs();