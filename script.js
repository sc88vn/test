// ================== CONFIG ==================
const WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbzJw-KZkH4qmCI0zxLWIuW7yvpUoM4QHQ8y9DfkFwZy4DNFJeS8WS0eBj3RdZRsOvVK/exec";

// ================== POPUP ==================
function closePopup(name) {
  if (!name) {
    document.getElementById("popup").style.display = "none";
  } else {
    const popup = document.getElementById("popup-" + name);
    if (popup) popup.style.display = "none";
  }
}

function showPopup(name) {
  document.querySelectorAll(".popup-overlay").forEach(p => {
    p.style.display = "none";
  });

  const popup = document.getElementById("popup-" + name);
  if (popup) {
    popup.style.display = "flex";
    if (name === "thongke") loadThongKeTable();
  }
}

function openReportPopup(name) {
  closePopup("baocao");
  showPopup(name);
}

// ================== SEND MONTH STATS ==================
function sendMonthStats() {
  const input = document.getElementById("input-monthYear");
  const monthYear = input.value.trim();

  const regex = /^(0[1-9]|1[0-2])\/\d{4}$/;
  if (!regex.test(monthYear)) {
    alert(
      "Vui lòng nhập đúng định dạng tháng/năm, ví dụ: 05/2025"
    );
    return;
  }

  fetch(WEB_APP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "monthYear=" + encodeURIComponent(monthYear),
  })
    .then(res => res.json())
    .then(data => {
      if (data.status === "success") {
        loadThongKeTable(monthYear);
      }
    })
    .catch(err => {
      alert("Lỗi khi gửi dữ liệu thống kê.");
      console.error(err);
    });
}

// ================== LOAD TABLE ==================
function loadThongKeTable(monthYear) {
  const title = document.getElementById("thongKeTitle");
  if (title && monthYear) {
    title.textContent = "Hiệu suất kiểm tra tháng " + monthYear;
  }

  fetch(WEB_APP_URL)
    .then(res => res.json())
    .then(data => {
      const tbody = document
        .getElementById("thongKeTable")
        .querySelector("tbody");

      tbody.innerHTML = "";

      data.forEach(row => {
        const name = row.name || "";
        const pass = parseInt(row.pass) || 0;
        const total = parseInt(row.total) || 0;
        const note = parseInt(row.note) || 0;

        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${name}</td>
          <td>${pass}/${total}</td>
          <td>${note}</td>
        `;
        tbody.appendChild(tr);
      });
    })
    .catch(err => {
      console.error("Lỗi tải dữ liệu thống kê:", err);
      alert("Không thể tải dữ liệu thống kê.");
    });
}
