const oneInput = document.getElementById('one');
const twoInput = document.getElementById('two');
const threeInput = document.getElementById('three');
const fourInput = document.getElementById('four');
const fiveInput = document.getElementById('five');

const dayIds = ['day1','day2','day3','day4','day5','day6','day7','day8'];
const dayInputs = dayIds.map(id => document.getElementById(id));

let productContainer = [];
let studentResult = 0;

// حساب درجة الحفظ
function calculateMemory() {
  let totalDays = 0;
  dayInputs.forEach(inp => {
    totalDays += Number(inp.value) || 0;
  });
  const memory = totalDays * 0.75;
  return memory;
}

function Result() {
  studentResult = calculateMemory();
  document.getElementById('result').textContent = studentResult.toFixed(2);
}

function addProduct() {
  const memory = calculateMemory();
  studentResult = memory;

  const product = {
    one: oneInput.value.trim(),
    two: Number(twoInput.value) || 0,
    three: Number(threeInput.value) || 0,
    four: Number(fourInput.value) || 0,
    five: Number(fiveInput.value) || 0,
    memory: Number(memory.toFixed(2))
  };

  productContainer.push(product);
  displayProducts();
  clearProduct();
}

function displayProducts() {
  let cartona = '';
  for (let i = 0; i < productContainer.length; i++) {
    const p = productContainer[i];
    const total = p.two + p.three + p.four + p.five + p.memory;

    cartona += `
      <tr>
        <td>${total.toFixed(2)}</td>
        <td>${p.memory.toFixed(2)}</td>
        <td>${p.four}</td>
        <td>${p.five}</td>
        <td>${p.two}</td>
        <td>${p.three}</td>
        <td>${p.one}</td>
      </tr>
    `;
  }
  document.getElementById('tableBody').innerHTML = cartona;
}

function clearProduct() {
  oneInput.value = '';
  twoInput.value = '';
  threeInput.value = '';
  fourInput.value = '';
  fiveInput.value = '';

  dayInputs.forEach(inp => inp.value = '');

  studentResult = 0;
  document.getElementById('result').textContent = '';
}

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

// ✅ دالة تحميل PDF تدعم العربي
function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: "p", unit: "pt", format: "a4" });

  // عنوان التقرير
  doc.setFontSize(16);
  doc.text("تقرير الطلاب الشهري", 300, 40, { align: "center" });

  const headers = [["الدرجة النهائية", "الحفظ(60)", "الأنشطة(5)", "التجويد(5)", "الحضور(20)", "السلوك(10)", "اسم الطالب"]];

  const data = productContainer.map(p => {
    const total = p.two + p.three + p.four + p.five + p.memory;
    return [
      total.toFixed(2),
      p.memory.toFixed(2),
      p.four,
      p.five,
      p.two,
      p.three,
      p.one
    ];
  });

  // الجدول
  doc.autoTable({
    head: headers,
    body: data,
    startY: 60,
    styles: { halign: 'right', font: "helvetica" },
    headStyles: { fillColor: [41, 128, 185], halign: 'center' }
  });

  doc.save("تقرير_الطلاب.pdf");
}
function downloadTableAsPDF() {
  const table = document.querySelector(".table"); // حدد الجدول
  html2canvas(table, { scale: 2 }).then(canvas => {
    const imgData = canvas.toDataURL("image/png");
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("p", "mm", "a4");

    // حساب العرض والارتفاع
    const imgWidth = 190; // عرض الصفحة A4 - هوامش
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let position = 10; // بداية الجدول في الصفحة
    pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);

    pdf.save("جدول_الطلاب.pdf");
  });
}
