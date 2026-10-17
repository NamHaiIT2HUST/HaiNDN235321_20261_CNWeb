/* BÀI B — VIẾT CODE: Lọc tin và đăng tin nhanh (news.html)
   Viết code theo đặc tả.
   Không sửa news.html, không sửa css; chỉ viết JavaScript trong file này. */

// ---------- ĐÃ CHO SẴN (không sửa) ----------
// Chặn việc gửi form tìm kiếm khi nhấn Enter, để trang không bị tải lại.
document.querySelector("#searchbar form").addEventListener("submit", (e) => e.preventDefault());

// ---------- PHẦN BẠN VIẾT ----------

const oTimKiem = document.getElementById("o-tim-kiem");
const list = document.getElementById("list");
const boDem = document.getElementById("bo-dem");
const khongThay = document.getElementById("khong-thay");
const oTieuDe = document.getElementById("tin-tieu-de");
const oNoiDung = document.getElementById("tin-noi-dung");
const nutDang = document.getElementById("nut-dang");
const baoLoi = document.getElementById("bao-loi");

// Hàm đồng bộ trạng thái: Lọc tin theo từ khóa và cập nhật bộ đếm
function capNhatLocVaBoDem() {
	const tuKhoa = (oTimKiem ? oTimKiem.value : "").toLowerCase();
	const cacMuc = Array.from(list ? list.querySelectorAll("li") : []);
	let soHien = 0;

	cacMuc.forEach((muc) => {
		const h3 = muc.querySelector("h3");
		const p = muc.querySelector("p");
		const tieuDe = h3 ? h3.textContent : "";
		const noiDung = p ? p.textContent : "";
		const vanBan = (tieuDe + " " + noiDung).toLowerCase();

		// So khớp không phân biệt hoa thường trong cả tiêu đề và nội dung
		if (tuKhoa === "" || vanBan.includes(tuKhoa)) {
			muc.classList.remove("an");
			soHien++;
		} else {
			muc.classList.add("an");
		}
	});

	// F1. Cập nhật bộ đếm hiển thị x/y tin
	if (boDem) {
		boDem.textContent = `Đang hiển thị ${soHien}/${cacMuc.length} tin`;
	}

	// F3. Xử lý thông báo không tìm thấy
	if (khongThay) {
		if (soHien === 0 && cacMuc.length > 0) {
			khongThay.textContent = `Không tìm thấy tin nào cho "${oTimKiem ? oTimKiem.value : ""}"`;
			khongThay.classList.remove("an");
		} else {
			khongThay.classList.add("an");
		}
	}
}

// F1. Bộ đếm khởi tạo đúng ngay khi tải trang
capNhatLocVaBoDem();

// F2 + F3. Lọc tin khi gõ vào #o-tim-kiem (sự kiện keyup và input để mượt mà khi dán chuột)
if (oTimKiem) {
	oTimKiem.addEventListener("keyup", capNhatLocVaBoDem);
	oTimKiem.addEventListener("input", capNhatLocVaBoDem);
}

// Bắt thêm sự kiện submit của form tìm kiếm để cập nhật bộ lọc nếu người dùng bấm Search
const formTimKiem = document.querySelector("#searchbar form");
if (formTimKiem) {
	formTimKiem.addEventListener("submit", (e) => {
		e.preventDefault();
		capNhatLocVaBoDem();
	});
}

// F4. Nút "Read more >>" / "Thu gọn <<" — MỘT trình lắng nghe đặt trên #list (Event Delegation)
if (list) {
	list.addEventListener("click", (e) => {
		const nut = e.target.closest("button.more");
		if (nut && list.contains(nut)) {
			const muc = nut.closest("li");
			if (muc) {
				const doan = muc.querySelector("p");
				if (doan) {
					if (doan.classList.contains("day-du")) {
						doan.classList.remove("day-du");
						nut.textContent = "Read more >>";
					} else {
						doan.classList.add("day-du");
						nut.textContent = "Thu gọn <<";
					}
				}
			}
		}
	});
}

// F5. Nút #nut-dang: kiểm tra dữ liệu, tạo <li> mới, chèn vào đầu #list
if (nutDang) {
	nutDang.addEventListener("click", () => {
		const tieuDe = oTieuDe ? oTieuDe.value : "";
		const noiDung = oNoiDung ? oNoiDung.value : "";

		// Kiểm tra chuỗi rỗng
		if (tieuDe.trim() === "" || noiDung.trim() === "") {
			if (baoLoi) {
				baoLoi.textContent = "Vui lòng nhập đủ tiêu đề và nội dung.";
			}
			return;
		}

		// Tạo <li> mới có cấu trúc chuẩn giống các tin có sẵn
		const mucMoi = document.createElement("li");

		const spanTime = document.createElement("span");
		spanTime.className = "time";
		spanTime.textContent = typeof homNay === "function" ? homNay() : "";

		const h3 = document.createElement("h3");
		h3.textContent = tieuDe; // textContent chống XSS và giữ nguyên văn bản

		const p = document.createElement("p");
		p.textContent = noiDung;

		const btnMore = document.createElement("button");
		btnMore.type = "button";
		btnMore.className = "more";
		btnMore.textContent = "Read more >>";

		mucMoi.append(spanTime, h3, p, btnMore);
		list.prepend(mucMoi);

		// Xóa trắng ô nhập và xóa báo lỗi
		if (oTieuDe) oTieuDe.value = "";
		if (oNoiDung) oNoiDung.value = "";
		if (baoLoi) baoLoi.textContent = "";

		// Cập nhật lại bộ lọc và bộ đếm (tuân theo từ khoá đang gõ)
		capNhatLocVaBoDem();
	});
}
