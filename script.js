// =======================================================
// A. قراءة البيانات من ملف JSON خارجي
// =======================================================

let products = []; // سنقوم بتخزين قائمة المنتجات المجلوبة هنا
let cart = JSON.parse(localStorage.getItem('darfidda_cart')) || []; // السلة الحالية

/**
 * دالة جلب المنتجات من products.json
 * نستخدم 'fetch' لقراءة الملفات الخارجية
 */
async function fetchProducts() {
    try {
        const response = await fetch('products.json');
        
        // التحقق من أن القراءة كانت ناجحة (HTTP Status 200)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // تحويل البيانات النصية إلى مصفوفة (Array) من المنتجات
        products = await response.json();
        
        // بعد جلب المنتجات، نبدأ بإنشاء واجهة المستخدم
        initializeStore(); 
        
    } catch (error) {
        console.error("Could not fetch products:", error);
        // عرض رسالة خطأ للمستخدم إذا لم يتم تحميل المنتجات
        document.querySelector('main').innerHTML = `
            <section style="text-align: center; color: red;">
                <h2>⚠️ عذراً! لم نتمكن من تحميل قائمة المنتجات.</h2>
                <p>يرجى التأكد من وجود ملف products.json في المجلد الصحيح.</p>
            </section>
        `;
    }
}

// =======================================================
// B. تهيئة المتجر وبدء العرض (بعد جلب المنتجات)
// =======================================================

function initializeStore() {
    console.log("المنتجات تم تحميلها بنجاح. عدد المنتجات: " + products.length);
    
    // الآن، يمكنك استدعاء الدوال الرئيسية مثل عرض المنتجات والتخفيضات
    renderAllProductSections(); // <== سنقوم ببناء هذه الدالة لاحقاً
    updateCartSummary(); // <== سنقوم ببناء هذه الدالة لاحقاً
    
    // إضافة المستمعات للأحداث (مثل النقر على أزرار الإضافة)
    setupEventListeners(); // <== سنقوم ببناء هذه الدالة لاحقاً
}


// استدعاء دالة الجلب عند تحميل الصفحة
fetchProducts();


// =======================================================
// C. الهياكل الأساسية (سنكملها في الخطوات التالية)
// =======================================================

// سنضع هنا الدوال:
function renderAllProductSections() {
    // هذه الدالة ستفلتر المنتجات وتعرضها في أقسامها
    // بناءً على megaCategory و category
}

function updateCartSummary() {
    // هذه الدالة ستقوم بتحديث عدد عناصر السلة وحساب الإجمالي
}

function setupEventListeners() {
    // هذه الدالة ستضيف مستمعات الأحداث لأزرار السلة وناقلة الدفع
}

// ... إلخ
