/* BÀI B — VIẾT CODE: Giỏ hàng của xưởng in
   Hoàn thiện class GioHang và hàm napGioHang.
   Không đổi tên class, tên phương thức, tên hàm; không sửa phần "DỮ LIỆU ĐÃ CHO". */

// ---------- DỮ LIỆU ĐÃ CHO (không sửa) ----------
const DANH_MUC = [
	{ id: "TC01", ten: "Thiệp cưới cotton", loai: "thiep cuoi", gia: 1500 },
	{ id: "TC02", ten: "Thiệp cưới kraft", loai: "thiep cuoi", gia: 900 },
	{ id: "DT01", ten: "Danh thiếp ép kim", loai: "danh thiep", gia: 1200 },
	{ id: "PB01", ten: "Phong bì lót lụa", loai: "phu kien", gia: 500 }
];

// ---------- PHẦN BẠN VIẾT ----------
class GioHang {
	constructor() {
		// Mỗi dòng của giỏ là một object { id, ten, loai, gia, soLuong }.
		this.dsDong = [];
	}

	// 1. Thêm sản phẩm; trả về true nếu thêm được, false nếu soLuong không hợp lệ.
	them(sanPham, soLuong) {
		if (typeof soLuong !== "number" || !Number.isInteger(soLuong) || soLuong <= 0) {
			return false;
		}
		if (!sanPham || typeof sanPham !== "object" || !sanPham.id) {
			return false;
		}

		const dongTonTai = this.dsDong.find(d => d.id === sanPham.id);
		if (dongTonTai) {
			dongTonTai.soLuong += soLuong;
		} else {
			this.dsDong.push({
				id: sanPham.id,
				ten: sanPham.ten,
				loai: sanPham.loai,
				gia: sanPham.gia,
				soLuong: soLuong
			});
		}
		return true;
	}

	// 2. Xoá dòng có id tương ứng; trả về true nếu có xoá, false nếu không tìm thấy.
	xoa(id) {
		const viTri = this.dsDong.findIndex(d => d.id === id);
		if (viTri !== -1) {
			this.dsDong.splice(viTri, 1);
			return true;
		}
		return false;
	}

	// 3. Tổng tiền cả giỏ.
	tongTien() {
		return this.dsDong.reduce((tong, d) => tong + d.gia * d.soLuong, 0);
	}

	// 4. Object thống kê: { "<loai>": tổng tiền của loại đó, ... }.
	thongKeTheoLoai() {
		const ketQua = {};
		for (const d of this.dsDong) {
			ketQua[d.loai] = (ketQua[d.loai] || 0) + d.gia * d.soLuong;
		}
		return ketQua;
	}

	// 5. Dòng có thành tiền lớn nhất (bản sao, có thêm thanhTien); null nếu giỏ rỗng.
	dongDatNhat() {
		if (this.dsDong.length === 0) {
			return null;
		}
		let maxDong = this.dsDong[0];
		let maxTien = maxDong.gia * maxDong.soLuong;
		for (let i = 1; i < this.dsDong.length; i++) {
			const thanhTien = this.dsDong[i].gia * this.dsDong[i].soLuong;
			if (thanhTien > maxTien) {
				maxDong = this.dsDong[i];
				maxTien = thanhTien;
			}
		}
		return {
			id: maxDong.id,
			ten: maxDong.ten,
			loai: maxDong.loai,
			gia: maxDong.gia,
			soLuong: maxDong.soLuong,
			thanhTien: maxTien
		};
	}

	// 6. Mảng BẢN SAO các dòng, mỗi dòng có thêm thuộc tính thanhTien.
	layDanhSach() {
		return this.dsDong.map(d => ({
			id: d.id,
			ten: d.ten,
			loai: d.loai,
			gia: d.gia,
			soLuong: d.soLuong,
			thanhTien: d.gia * d.soLuong
		}));
	}

	// 7. Chuỗi JSON của mảng các dòng.
	xuatJSON() {
		const danhSachThuan = this.dsDong.map(d => ({
			id: d.id,
			ten: d.ten,
			loai: d.loai,
			gia: d.gia,
			soLuong: d.soLuong
		}));
		return JSON.stringify(danhSachThuan);
	}
}

// 8. Tạo lại một GioHang từ chuỗi JSON do xuatJSON() sinh ra.
function napGioHang(chuoiJSON) {
	const gioMoi = new GioHang();
	if (typeof chuoiJSON === "string") {
		try {
			const danhSach = JSON.parse(chuoiJSON);
			if (Array.isArray(danhSach)) {
				for (const d of danhSach) {
					gioMoi.them({
						id: d.id,
						ten: d.ten,
						loai: d.loai,
						gia: d.gia
					}, d.soLuong);
				}
			}
		} catch (e) {
			console.error("Lỗi parse JSON khi nạp giỏ hàng:", e);
		}
	}
	return gioMoi;
}

// ---------- CHẠY THỬ (không sửa) ----------
const gio = new GioHang();
gio.them(DANH_MUC[0], 100);
gio.them(DANH_MUC[3], 200);
gio.them(DANH_MUC[0], 50);
if (typeof veGioHang === "function") {
	veGioHang(gio.layDanhSach(), gio.tongTien());
}
console.table(gio.layDanhSach());
if (typeof hienThi === "function") {
	hienThi(`JSON gửi lên máy chủ: ${gio.xuatJSON()}`);
}
