// A. مصفوفة السلة والتعريفات الأساسية
let cart = []; 
const deliveryCharge = 10.00; // تكلفة التوصيل
const checkoutModal = document.getElementById('checkout-modal');
const closeBtn = document.querySelector('.close-btn');

// الثوابت الجديدة لنافذة المقاس
const sizeModal = document.getElementById('size-modal');
const sizeCloseBtn = document.querySelector('.size-close-btn');
const sizeSelect = document.getElementById('size-select');
const confirmSizeBtn = document.getElementById('confirm-size-add');

// متغير مؤقت لحفظ بيانات المنتج المراد إضافته 
let productToAdd = {}; 

// قائمة المنتجات التي تتطلب اختيار مقاس (جميع العباءات)
const productsRequiringSize = [
    'عباءة كتّان (A1)', 'عباءة مطرزة (A2)', 'عباءة كلاسيكية (A3)', 
    'عباءة رسمية (A4)', 'عباءة خامة مميزة (A5)', 'عباءة بسيطة (A6)'
];

// المقاسات المتوفرة (يمكنك تعديلها)
const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

// **تعريف كوبونات الخصم (Promo Codes)**
const promoCodes = {
    'SALE10': { type: 'percentage', value: 0.10, message: '✅ تم تطبيق خصم 10% على الإجمالي.' },
    'DARFIDDA': { type: 'fixed', value: 20.00, message: '✅ تم تطبيق خصم ثابت بقيمة 20.00$.' },
    'FREEABAYA': { type: 'percentage', value: 0.15, message: '✅ خصم خاص 15% بمناسبة وصول العباءات الجديدة!' }
};

// متغير لحفظ الكوبون النشط
let activePromo = null; 

// قائمة كاملة بجميع المنتجات المتاحة (المصدر الوحيد للبيانات)
const allProducts = [
    // --- قسم العباءات (requiresSize: true) ---
    { id: 'A1', name: 'عباءة كتّان (A1)', price: 120.00, desc: 'عباءة من أجود أنواع الكتان، تصميم كلاسيكي ومريح.', img: 'itemimages/abaya/abaya1.jpeg', section: 'abaya', requiresSize: true, stock: 15 },
    { id: 'A2', name: 'عباءة مطرزة (A2)', price: 150.00, desc: 'تطريز يدوي دقيق يضيف لمسة من الفخامة والتميز.', img: 'itemimages/abaya/abaya2.jpeg', section: 'abaya', requiresSize: true, stock: 5 }, 
    { id: 'A3', name: 'عباءة كلاسيكية (A3)', price: 110.00, desc: 'تصميم يومي عملي بقصة مريحة وأنيقة.', img: 'itemimages/abaya/abaya3.jpeg', section: 'abaya', requiresSize: true, stock: 25 },
    { id: 'A4', name: 'عباءة رسمية (A4)', price: 135.00, desc: 'مثالية للمناسبات الرسمية، خامة ثقيلة وراقية.', img: 'itemimages/abaya/abaya4.jpeg', section: 'abaya', requiresSize: true, stock: 0 }, 
    { id: 'A5', name: 'عباءة خامة مميزة (A5)', price: 160.00, desc: 'قماش فاخر، تصميم عصري بأكمام واسعة.', img: 'itemimages/abaya/abaya5.jpeg', section: 'abaya', requiresSize: true, stock: 18 },
    { id: 'A6', name: 'عباءة بسيطة (A6)', price: 95.00, desc: 'عباءة سوداء سادة، لا غنى عنها في خزانة كل سيدة.', img: 'itemimages/abaya/abaya6.jpeg', section: 'abaya', requiresSize: true, stock: 12 },
    
    // --- قسم الإيشاربات (requiresSize: false) ---
    { id: 'I1', name: 'إيشارب حرير ناعم (I1)', price: 45.00, desc: 'حرير طبيعي 100%، لمسة فائقة النعومة.', img: 'itemimages/isharb/isharb1.jpeg', section: 'isharbat', requiresSize: false, stock: 50 },
    { id: 'I2', name: 'إيشارب قطني (I2)', price: 35.00, desc: 'خفيف ومناسب للصيف، يمتص الرطوبة.', img: 'itemimages/isharb/isharb2.jpeg', section: 'isharbat', requiresSize: false, stock: 0 }, 
    { id: 'I3', name: 'إيشارب منقوش (I3)', price: 50.00, desc: 'نقوش هندسية عصرية، تصميم مميز.', img: 'itemimages/isharb/isharb3.jpeg', section: 'isharbat', requiresSize: false, stock: 30 },
    { id: 'I4', name: 'إيشارب شيفون (I4)', price: 40.00, desc: 'شفاف وخفيف جداً، لطلة مسائية أنيقة.', img: 'itemimages/isharb/isharb4.jpeg', section: 'isharbat', requiresSize: false, stock: 22 },
    
    // --- قسم الحقائب (requiresSize: false) ---
    { id: 'B1', name: 'حقيبة جلدية كلاسيكية (B1)', price: 85.00, desc: 'جلد صناعي فاخر، حجم مثالي للاستخدام اليومي.', img: 'itemimages/bags/bag1.jpeg', section: 'bags', requiresSize: false, stock: 10 },
    { id: 'B2', name: 'حقيبة يد عصرية (B2)', price: 75.00, desc: 'تصميم حديث، حزام كتف قابل للتعديل.', img: 'itemimages/bags/bag2.jpeg', section: 'bags', requiresSize: false, stock: 8 },
    
    // --- قسم هدايا التكليف (requiresSize: false) ---
    { id: 'G1', name: 'طقم سجادة ومصحف (G1)', price: 70.00, desc: 'هدية فاخرة لتكليف البنات، مع صندوق أنيق.', img: 'itemimages/gifts/gift1.jpeg', section: 'gifts', requiresSize: false, stock: 15 },
    { id: 'G2', name: 'بوكس هدايا تكليف (G2)', price: 60.00, desc: 'يشمل مسبحة وكتيب أدعية وتذكار.', img: 'itemimages/gifts/gift2.jpeg', section: 'gifts', requiresSize: false, stock: 5 },
    
    // --- قسم الإضافيات (requiresSize: false) ---
    { id: 'E1', name: 'بنطال كلاسيكي (E1)', price: 40.00, desc: 'بنطال قطني مريح، يتناسق مع العباءات.', img: 'itemimages/extra/extra1.jpeg', section: 'extra', requiresSize: false, stock: 100 },
    { id: 'E2', name: 'اكسسوار شعر (E2)', price: 20.00, desc: 'ربطة شعر حريرية أنيقة.', img: 'itemimages/extra/extra2.jpeg', section: 'extra', requiresSize: false, stock: 30 },
];


// B. وظيفة تحديث عرض السلة في صفحة HTML
function renderCart() {
    const cartSummaryDiv = document.querySelector('#cart .cart-summary');
    let cartHTML = '';
    let total = 0;

    // تحديث العداد في الأيقونة الثابتة
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-item-count').textContent = totalItems;

    if (cart.length === 0) {
        cartHTML = '<p>سلتك فارغة حالياً.</p>';
        total = 0;
        
        cartHTML += `
            <button class="cta-button continue-shopping" style="margin-top: 20px;">
                العودة للتسوق
            </button>
        `;
    } else {
        // إنشاء قائمة بالمنتجات
        cartHTML = '<h3>المنتجات في السلة:</h3><ul class="cart-items" style="list-style: none; padding: 0;">';
        
        cart.forEach((item, index) => {
            total += item.price * item.quantity; 
            
            cartHTML += `
                <li data-index="${index}" style="display: grid; grid-template-columns: 2fr 1fr 1fr 50px; align-items: center; gap: 10px; padding: 10px 0; border-bottom: 1px dashed #A5C189;">
                    <span>${item.name}</span>
                    
                    <div class="quantity-control" style="display: flex; align-items: center; justify-content: center;">
                        <button class="quantity-btn decrease" data-index="${index}" style="padding: 5px; background: none; border: 1px solid #44563C;">-</button>
                        <span style="padding: 0 10px;">${item.quantity}</span>
                        <button class="quantity-btn increase" data-index="${index}" style="padding: 5px; background: none; border: 1px solid #44563C;">+</button>
                    </div>

                    <span style="font-weight: bold;">${(item.price * item.quantity).toFixed(2)} $</span>
                    
                    <button class="remove-item-btn" data-index="${index}" style="background: #e74c3c; color: white; border: none; padding: 5px; border-radius: 3px; cursor: pointer;">X</button>
                </li>
            `;
        });
        
        cartHTML += '</ul>';
        
        // إضافة الإجمالي وأزرار الإجراءات
        cartHTML += `
            <div style="margin-top: 25px; font-size: 1.5em; font-weight: bold; color: #44563C; border-top: 2px solid #44563C; padding-top: 15px;">
                الإجمالي الكلي: ${total.toFixed(2)} $
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 20px;">
                <button class="cta-button" id="confirm-checkout" style="width: 48%;">إتمام الشراء</button>
                <button class="cta-button continue-shopping" style="width: 48%;">
                    العودة للتسوق
                </button>
            </div>
        `;
    }
    
    // وضع المحتوى الجديد داخل قسم السلة
    cartSummaryDiv.innerHTML = cartHTML;
    
    // إعادة ربط أحداث الأزرار بعد تحديث الـ HTML
    addCartEventListeners(); 
}


// C. وظيفة فرعية للإضافة للسلة
function addItemToCart(name, price, size) {
    const uniqueName = size ? `${name} (مقاس: ${size})` : name;
    
    const existingItem = cart.find(item => item.name === uniqueName);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: uniqueName,
            price: price,
            quantity: 1,
            size: size
        });
    }

    renderCart();
    // تأكد من عدم ظهور التنبيه إذا تم استدعاؤه من نافذة المقاس
    if (sizeModal.style.display !== 'block') {
         alert(`تمت إضافة المنتج: "${uniqueName}" إلى السلة بنجاح!`);
    }
}

// D. وظيفة إضافة المنتج إلى السلة (مع خيار المقاس عبر Modal)
function handleAddToCart(event) {
    event.preventDefault(); 
    
    const card = event.target.closest('.product-card');
    const productName = card.querySelector('h3').textContent;
    const productPriceText = card.querySelector('.price').textContent.replace('$', '').trim();
    const productPrice = parseFloat(productPriceText);

    // التحقق من الحاجة للمقاس
    if (productsRequiringSize.includes(productName)) {
        
        // حفظ بيانات المنتج مؤقتاً
        productToAdd = {
            name: productName,
            price: productPrice
        };
        
        // تحديث محتوى النافذة المنبثقة للمقاسات
        document.getElementById('size-modal-product-name').textContent = `اختر مقاس ${productName}`;
        sizeSelect.innerHTML = availableSizes.map(size => 
            `<option value="${size}">${size}</option>`
        ).join('');

        // إظهار النافذة
        sizeModal.style.display = 'block';

    } else {
        // للمنتجات التي لا تحتاج مقاس
        addItemToCart(productName, productPrice, null);
    }
}


// E. وظيفة حذف منتج من السلة
function removeItem(index) {
    cart.splice(index, 1);
    renderCart();
}

// F. وظيفة تعديل كمية المنتج
function updateQuantity(index, delta) {
    const item = cart[index];
    item.quantity += delta; 

    if (item.quantity <= 0) {
        removeItem(index);
    } else {
        renderCart();
    }
}

// G. وظيفة ربط أحداث أزرار السلة
function addCartEventListeners() {
    // ربط أزرار الحذف والكمية
    document.querySelectorAll('.remove-item-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            removeItem(index);
        });
    });

    document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            const delta = e.target.classList.contains('increase') ? 1 : -1;
            updateQuantity(index, delta);
        });
    });
    
    // ربط زر "متابعة التسوق"
    document.querySelectorAll('.continue-shopping').forEach(button => {
        button.addEventListener('click', (e) => {
            goBackToShopping();
        });
    });
    
    // ربط زر "إتمام الشراء"
    const checkoutButton = document.getElementById('confirm-checkout');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', openCheckoutModal);
    }
}


// H. وظيفة إظهار/إخفاء الأقسام (مُعدَّلة لـ DOM Manipulation)
function handleCategoryToggle(event) {
    event.preventDefault();
    const targetId = event.target.getAttribute('href'); 

    const targetSection = document.querySelector(targetId);
    const suggestionSection = document.querySelector('#suggestions');
    const mainContainer = document.querySelector('main');

    // 1. إخفاء جميع الأقسام (بما في ذلك المقترحات والسلة)
    document.querySelectorAll('.category-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // 2. إظهار القسم المطلوب
    if (targetSection) {
        targetSection.style.display = 'block'; 
    }
    
    // 3. إذا لم يكن القسم هو "السلة"، نظهر المقترحات وننقلها إلى أسفل القسم
    if (targetId !== '#cart' && suggestionSection && targetSection) {
        
        // نقل المقترحات لتظهر بعد القسم المطلوب مباشرة (في الأسفل)
        mainContainer.insertBefore(suggestionSection, targetSection.nextSibling);

        // إظهار المقترحات
        suggestionSection.style.display = 'block';
        
        // إعادة عرض المقترحات لضمان تحديثها
        renderSuggestions(); 
    }
}

// I. وظيفة العودة إلى قسم العباءات (الصفحة الرئيسية) - مُعدَّلة
function goBackToShopping() {
    const defaultSection = document.querySelector('#abaya');
    const suggestionSection = document.querySelector('#suggestions');
    const mainContainer = document.querySelector('main');


    // إخفاء جميع الأقسام
    document.querySelectorAll('.category-section').forEach(section => {
        section.style.display = 'none';
    });

    // إظهار القسم الافتراضي (العباءات)
    if (defaultSection) {
        defaultSection.style.display = 'block';
    }
    
    // إظهار المقترحات ونقلها لأسفل قسم العباءات
    if (suggestionSection && defaultSection) {
         mainContainer.insertBefore(suggestionSection, defaultSection.nextSibling);
         suggestionSection.style.display = 'block';
    }
}

// J. وظيفة فتح نافذة إنهاء الطلب (مُحدَّثة للخصم)
function openCheckoutModal() {
    if (cart.length === 0) {
        alert('سلتك فارغة ولا يمكن إتمام الطلب.');
        return;
    }
    
    // 1. حساب الإجمالي قبل الخصم
    const orderTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let discountedTotal = orderTotal;
    let discountAmount = 0;
    
    // 2. تطبيق الخصم إذا كان هناك كوبون نشط
    if (activePromo) {
        if (activePromo.type === 'percentage') {
            discountAmount = orderTotal * activePromo.value;
        } else if (activePromo.type === 'fixed') {
            discountAmount = activePromo.value;
        }
        // لا يمكن أن يكون الخصم أكبر من إجمالي الطلب
        discountAmount = Math.min(discountAmount, orderTotal); 
        discountedTotal = orderTotal - discountAmount;
    }
    
    const finalTotal = discountedTotal + deliveryCharge;
    
    // 3. تحديث تفاصيل الطلب داخل النافذة
    let detailsHTML = '<h4>المنتجات المطلوبة:</h4><ul style="list-style: none; padding-right: 0; text-align: right;">';
    cart.forEach(item => {
        detailsHTML += `<li>- ${item.name} (x${item.quantity})</li>`;
    });
    detailsHTML += '</ul>';
    document.getElementById('checkout-details').innerHTML = detailsHTML;
    
    // 4. تحديث حقول الإجمالي
    document.getElementById('modal-order-total').textContent = `${orderTotal.toFixed(2)} $`;
    
    // إضافة سطر الخصم ديناميكياً
    const discountLine = discountAmount > 0 
        ? `<p class="final-total-line" style="color: #27ae60;">الخصم المطبق: <span style="font-weight: bold;">-${discountAmount.toFixed(2)} $</span></p>`
        : '';
        
    // إزالة أي سطر خصم موجود مسبقاً قبل الإضافة
    const existingDiscountLine = document.querySelector('#checkout-details + .final-total-line[style*="color: #27ae60"]');
    if(existingDiscountLine) existingDiscountLine.remove();
    
    // إضافة سطر الخصم بعد تفاصيل الطلب إذا كان هناك خصم
    if (discountAmount > 0) {
        document.getElementById('checkout-details').insertAdjacentHTML('afterend', discountLine);
    }
    
    document.getElementById('modal-delivery-charge').textContent = `${deliveryCharge.toFixed(2)} $`;
    document.getElementById('modal-final-total').textContent = `${finalTotal.toFixed(2)} $`;
    
    // تحديث رسالة الكوبون
    const promoMessage = document.getElementById('promo-message');
    const promoCodeInput = document.getElementById('promo-code');
    
    if (activePromo) {
        promoMessage.textContent = activePromo.message;
        promoMessage.style.color = '#27ae60'; // أخضر للنجاح
        promoCodeInput.value = ''; // مسح الحقل بعد العرض
    } else {
        promoMessage.textContent = 'لم يتم تطبيق خصم.';
        promoMessage.style.color = '#44563C';
    }


    // 5. إظهار النافذة
    checkoutModal.style.display = 'block';
    
    // 6. 🛑 إعداد الحقل المخفي قبل الإرسال 🛑
    prepareOrderSummary(orderTotal, discountAmount, finalTotal);

}

// K. وظيفة إغلاق النافذة
function closeCheckoutModal() {
    checkoutModal.style.display = 'none';
}

// L. وظيفة تجهيز ملخص الطلب في الحقل المخفي لـ Formspree
function prepareOrderSummary(orderTotal, discountAmount, finalTotal) {
    let cartDetails = '';
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        // تنسيق الإرسال لسطر واحد مفصول بـ ;
        cartDetails += `${item.name} (${item.quantity} حبة) بسعر: ${itemTotal.toFixed(2)}$; `;
    });
    
    const summaryValue = 
        `المنتجات: ${cartDetails.trim()} | ` +
        `الإجمالي الفرعي: ${orderTotal.toFixed(2)}$ | ` +
        `الخصم المطبق: ${discountAmount.toFixed(2)}$ | ` +
        `تكلفة التوصيل: ${deliveryCharge.toFixed(2)}$ | ` +
        `الإجمالي النهائي: ${finalTotal.toFixed(2)}$`;

    // ملء الحقل المخفي للسلة
    document.getElementById('order-summary-hidden').value = summaryValue;
    document.getElementById('applied-promo-code').value = activePromo ? activePromo.code : 'None';
}


// M. وظيفة لاختيار منتجات عشوائية
function getRandomProducts(count) {
    const shuffled = allProducts.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// N. وظيفة لإنشاء وعرض بطاقات المقترحات
function renderSuggestions() {
    const carousel = document.getElementById('suggestion-carousel');
    const products = getRandomProducts(6); 

    let html = products.map(product => {
        let stockStatus = '';
        let buttonDisabled = false;
        
        if (product.stock === 0) {
            stockStatus = '<span class="stock-status out-of-stock">⛔ نفذت الكمية</span>';
            buttonDisabled = true;
        } else if (product.stock <= 5 && product.stock > 0) {
            stockStatus = '<span class="stock-status low-stock">⚠️ آخر قطع!</span>';
        }
        
        return `
            <div class="product-card" data-product-id="${product.id}">
                <img src="${product.img}" alt="${product.name}" style="height: 120px;">
                <h3>${product.name}</h3>
                <p class="description">${product.desc}</p>
                <p class="price">${product.price.toFixed(2)} $</p> 
                ${stockStatus}
                <button 
                    class="cta-button add-to-cart" 
                    data-name="${product.name}" 
                    data-price="${product.price}" 
                    data-size-required="${product.requiresSize}"
                    ${buttonDisabled ? 'disabled' : ''}
                    style="${buttonDisabled ? 'background-color: #aaa; cursor: not-allowed;' : ''}"
                >
                    ${buttonDisabled ? 'غير متاح حالياً' : 'أضف للسلة'}
                </button>
            </div>
        `;
    }).join('');
    
    carousel.innerHTML = html;
    rebindAddToCartButtons(); 
}

// O. وظيفة لربط جميع أزرار "أضف للسلة"
function rebindAddToCartButtons() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.removeEventListener('click', handleAddToCart); 
        button.addEventListener('click', handleAddToCart);
    });
}

// P. دالة عرض المنتجات حسب القسم بشكل ديناميكي
function renderProductsBySection(sectionId) {
    const container = document.querySelector(`#${sectionId} .products-grid`);
    if (!container) return;

    const sectionProducts = allProducts.filter(p => p.section === sectionId);
    
    let html = sectionProducts.map(product => {
        let stockStatus = '';
        let buttonDisabled = false;
        
        if (product.stock === 0) {
            stockStatus = '<span class="stock-status out-of-stock">⛔ نفذت الكمية</span>';
            buttonDisabled = true;
        } else if (product.stock <= 5 && product.stock > 0) {
            stockStatus = '<span class="stock-status low-stock">⚠️ آخر قطع!</span>';
        }

        return `
            <div class="product-card" data-product-id="${product.id}">
                <img src="${product.img}" alt="${product.name}" style="height: ${sectionId === 'abaya' ? '350px' : '250px'};">
                <h3>${product.name}</h3>
                <p class="description">${product.desc}</p>
                <p class="price">${product.price.toFixed(2)} $</p>
                ${stockStatus}
                <button 
                    class="cta-button add-to-cart" 
                    data-name="${product.name}" 
                    data-price="${product.price}" 
                    data-size-required="${product.requiresSize}"
                    ${buttonDisabled ? 'disabled' : ''}
                    style="${buttonDisabled ? 'background-color: #aaa; cursor: not-allowed;' : ''}"
                >
                    ${buttonDisabled ? 'غير متاح حالياً' : 'أضف للسلة'}
                </button>
            </div>
        `;
    }).join('');
    
    container.innerHTML = html;
}

// Q. دالة تطبيق كوبون الخصم
function applyPromoCode() {
    const inputField = document.getElementById('promo-code');
    const code = inputField.value.toUpperCase().trim();
    const messageDisplay = document.getElementById('promo-message');
    
    if (promoCodes[code]) {
        activePromo = { ...promoCodes[code], code: code }; // حفظ الكود
        messageDisplay.textContent = activePromo.message;
        messageDisplay.style.color = '#27ae60'; 
    } else {
        activePromo = null; 
        messageDisplay.textContent = '❌ رمز خصم غير صحيح أو منتهي الصلاحية.';
        messageDisplay.style.color = '#e74c3c'; 
    }
    
    closeCheckoutModal(); 
    openCheckoutModal();
}


// -------------------------------------------------------------
// R. تفعيل الأزرار عند تحميل الصفحة 
// -------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    // 1. عرض السلة وعرض القسم الافتراضي
    renderCart();
    goBackToShopping(); 

    // 2. ربط وظيفة الإظهار/الإخفاء (Toggle) بروابط القائمة
    const categoryLinks = document.querySelectorAll('.main-nav a, .fixed-cart-icon');
    categoryLinks.forEach(link => {
        if (link.getAttribute('href').startsWith('#')) {
            link.addEventListener('click', handleCategoryToggle);
        }
    });

    // 3. عرض المنتجات ديناميكياً
    renderProductsBySection('abaya');
    renderProductsBySection('isharbat');
    renderProductsBySection('bags');
    renderProductsBySection('gifts');
    renderProductsBySection('extra');
    
    rebindAddToCartButtons(); 

    // 4. ربط أحداث إغلاق نافذة إنهاء الطلب
    closeBtn.addEventListener('click', closeCheckoutModal);

    // 5. ربط أحداث نافذة اختيار المقاس
    confirmSizeBtn.addEventListener('click', () => {
        const selectedSize = sizeSelect.value;
        if (selectedSize) {
            addItemToCart(productToAdd.name, productToAdd.price, selectedSize);
            sizeModal.style.display = 'none';
        } else {
            alert('الرجاء اختيار مقاس.');
        }
    });

    // إغلاق نافذة المقاس بزر الإغلاق X
    sizeCloseBtn.addEventListener('click', () => {
        sizeModal.style.display = 'none';
    });


    // 6. إغلاق النوافذ عند الضغط خارجها
    window.addEventListener('click', (event) => {
        if (event.target === checkoutModal) {
            closeCheckoutModal();
        }
        if (event.target === sizeModal) {
            sizeModal.style.display = 'none';
        }
    });

    // 7. معالجة إرسال طلب (الآن يعتمد على Formspree/Email)
    document.getElementById('checkout-form').addEventListener('submit', (e) => {
        
        const form = e.target;
        if (!form.checkValidity()) {
             // إذا كانت البيانات غير صحيحة، يتوقف ويُظهر تنبيه المتصفح
             return; 
        }
        
        // 🛑 عند النجاح، تظهر رسالة شكر ثم يتم الإرسال التقليدي 
        alert('✅ تم تسجيل طلبك بنجاح! سيتم إرسال ملخص الطلب إلى بريدك الإلكتروني، وسنتواصل معك لتأكيد الشحن.');
        
        // 8. مسح السلة وإغلاق النافذة بعد الإرسال
        // Formspree سيتعامل مع الإرسال، ونحن نمسح السلة لنعود لواجهة نظيفة
        cart = [];
        activePromo = null; 
        renderCart();
        closeCheckoutModal(); 
        goBackToShopping();
        
        // لا نستخدم e.preventDefault() هنا، Formspree يتولى الإرسال
    });

    // 7.5. ربط زر تطبيق الكوبون
    document.getElementById('apply-promo').addEventListener('click', applyPromoCode);

    
    // 8. 🌟 تفعيل المقترحات والدوران التلقائي 🌟
    renderSuggestions(); 
    
    const carousel = document.getElementById('suggestion-carousel');
    const scrollAmount = 165; 

    function autoScroll() {
        if (carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth) {
            carousel.scrollTo({
                left: 0,
                behavior: 'smooth'
            });
        } else {
            carousel.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    }
    
    setInterval(autoScroll, 3000); 
});