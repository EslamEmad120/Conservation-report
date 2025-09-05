const oneInput = document.getElementById('one');
const twoInput = document.getElementById('two');
const threeInput = document.getElementById('three');
const fourInput = document.getElementById('four');
const fiveInput = document.getElementById('five');

let productContainer = [];
let studentResult = 0;

// ==================
// رندر الأيام حسب النوع (خاتم / غير خاتم)
// ==================
// ==================
// رندر الأيام حسب النوع (خاتم / غير خاتم)
// ==================
function renderDays() {
  const type = document.getElementById('studentType').value;
  const container = document.getElementById('daysContainer');
  container.innerHTML = ''; // امسح القديم

  if (type === "khatm") {
    // خاتم: 8 أيام + يوم إضافي
    for (let i = 1; i <= 8; i++) {
      container.innerHTML += `
        <div class="col-6 col-md-3">
          <label class="form-label">اليوم ${i}</label>
          <input type="number" class="form-control day-input" id="day${i}">
        </div>
      `;
    }
    // يوم إضافي اختياري
    container.innerHTML += `
      <div class="col-6 col-md-3">
        <label class="form-label">اليوم الإضافي (اختياري)</label>
        <input type="number" class="form-control day-input" id="extraDay1">
      </div>
    `;
  } else {
    // غير خاتم: 8 أيام × (جديد + مراجعة)
    for (let i = 1; i <= 8; i++) {
      container.innerHTML += `
        <div class="col-6 col-md-3">
          <label class="form-label">اليوم ${i} (جديد)</label>
          <input type="number" class="form-control day-input" id="day${i}_new">
        </div>
        <div class="col-6 col-md-3">
          <label class="form-label">اليوم ${i} (مراجعة)</label>
          <input type="number" class="form-control day-input" id="day${i}_rev">
        </div>
      `;
    }

    // يومين إضافيين اختياريين
    for (let j = 1; j <= 2; j++) {
      container.innerHTML += `
        <div class="col-6 col-md-3">
          <label class="form-label">اليوم الإضافي ${j} (اختياري)</label>
          <input type="number" class="form-control day-input" id="extraDay${j}">
        </div>
      `;
    }
  }
}


// ==================
// حساب درجة الحفظ
// ==================
function calculateMemory() {
  let totalDays = 0;
  let filledCount = 0; // 👈 عدد الأيام اللي الطالب كتب فيها

  const inputs = document.querySelectorAll(".day-input");

  inputs.forEach(inp => {
    const val = Number(inp.value);
    if (!isNaN(val) && val > 0) {
      totalDays += val;
      filledCount++; // 👈 زود العدّاد بس لو الطالب كتب قيمة
    }
  });

  if (filledCount === 0) return 0; // 👈 لو ما كتبش ولا يوم تبقى صفر

  // 👈 كل يوم من 10 درجات ويتحوّل إلى 60
  const memory = (totalDays / (filledCount * 10)) * 60;
  return memory;
}

function Result() {
  studentResult = calculateMemory();
  document.getElementById('result').textContent = studentResult.toFixed(2) + " / 60";
}

// ==================
// إضافة طالب للتقرير
// ==================
function addProduct() {
  const memory = calculateMemory();
  studentResult = memory;

  const product = {
    one: oneInput.value.trim(),
    two: Number(twoInput.value) || 0,   // الحضور (20)
    three: Number(threeInput.value) || 0, // السلوك (10)
    four: Number(fourInput.value) || 0, // الأنشطة (5)
    five: Number(fiveInput.value) || 0, // التجويد (5)
    memory: Number(memory.toFixed(2))
  };

  productContainer.push(product);
  displayProducts();
  clearProduct();
}

// ==================
// عرض البيانات في الجدول
// ==================
function displayProducts() {
  let cartona = '';
  for (let i = 0; i < productContainer.length; i++) {
    const p = productContainer[i];
    const total = p.two + p.three + p.four + p.five + p.memory;

    cartona += `
      <tr>
        <td>${p.one}</td>        
        <td>${p.three}</td>      
        <td>${p.two}</td>        
        <td>${p.five}</td>       
        <td>${p.four}</td>       
        <td>${p.memory.toFixed(2)}</td> 
        <td>${total.toFixed(2)} / 100</td>    
      </tr>
    `;
  }
  document.getElementById('tableBody').innerHTML = cartona;
}

// ==================
// مسح بيانات الطالب (من غير الأيام)
// ==================
function clearProduct() {
  oneInput.value = '';
  twoInput.value = '';
  threeInput.value = '';
  fourInput.value = '';
  fiveInput.value = '';

  studentResult = 0;
  document.getElementById('result').textContent = '';
}

// ==================
// ترتيب الجدول
// ==================
let sortAsc = false;
function sortProducts() {
  productContainer.sort((a, b) => {
    const totalA = a.two + a.three + a.four + a.five + a.memory;
    const totalB = b.two + b.three + b.four + b.five + b.memory;
    return sortAsc ? totalA - totalB : totalB - totalA;
  });
  sortAsc = !sortAsc;
  displayProducts();
}

// ==================
// تحميل الجدول كصورة PDF
// ==================
function downloadTableAsPDF() {
  const table = document.querySelector(".table");
  html2canvas(table, {
    scale: 2,
    useCORS: true,
    logging: false
  }).then(canvas => {
    const imgData = canvas.toDataURL("image/png");
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgWidth = pageWidth - 20; 
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
    pdf.save("جدول_الطلاب.pdf");
  });
}

// ==================
// تشغيل افتراضي: خليه يرندر كـ خاتم أول ما يفتح
// ==================
window.onload = () => {
  renderDays();
};
function clearProduct() {
  oneInput.value = '';
  twoInput.value = '';
  threeInput.value = '';
  fourInput.value = '';
  fiveInput.value = '';

  // امسح قيم الأيام كلها
  const inputs = document.querySelectorAll(".day-input");
  inputs.forEach(inp => inp.value = '');

  studentResult = 0;
  document.getElementById('result').textContent = '';
}