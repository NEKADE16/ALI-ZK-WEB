// محاكاة تسجيل الدخول عبر Google
document.getElementById('googleLoginBtn')?.addEventListener('click', () => {
    // في الإصدار الحقيقي، سيتم الاتصال بـ Google API
    // هذا محاكاة للتجربة
    
    const googleEmail = prompt('للتجربة، أدخل بريد Google الخاص بك (محاكاة):', 'user@gmail.com');
    
    if (googleEmail && googleEmail.includes('@')) {
        const users = getLocal('users');
        let user = users.find(u => u.email === googleEmail);
        
        if (!user) {
            // إنشاء حساب جديد تلقائياً من Google
            const name = googleEmail.split('@')[0];
            const newUser = {
                id: users.length + 1,
                name: name,
                email: googleEmail,
                password: 'google-auth-no-password',
                role: 'user',
                date: new Date().toISOString(),
                provider: 'google'
            };
            users.push(newUser);
            setLocal('users', users);
            user = newUser;
            alert(`✅ تم إنشاء حساب جديد باستخدام Google: ${name}`);
        }
        
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        if (user.role === 'admin') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'index.html';
        }
    } else if (googleEmail) {
        alert('❌ البريد الإلكتروني غير صالح');
    }
});

// ملاحظة: للتكامل الحقيقي مع Google، يجب:
// 1. الذهاب إلى Google Cloud Console
// 2. إنشاء مشروع جديد
// 3. تفعيل Google+ API
// 4. إنشاء Client ID و Client Secret
// 5. إضافة مكتبة Google API إلى الموقع