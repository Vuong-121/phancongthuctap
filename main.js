let giangViens = JSON.parse(localStorage.getItem('giangViens')) || [];
let sinhViens = JSON.parse(localStorage.getItem('sinhViens')) || [];

const tinhThanhVN = [
    "An Giang", "Bà Rịa - Vũng Tàu", "Bắc Giang", "Bắc Kạn", "Bạc Liêu", "Bắc Ninh", "Bến Tre", "Bình Định", "Bình Dương", "Bình Phước", "Bình Thuận", "Cà Mau", "Cần Thơ", "Cao Bằng", "Đà Nẵng", "Đắc Lắc", "Đắc Nông", "Điện Biên", "Đồng Nai", "Đồng Tháp", "Gia Lai", "Hà Giang", "Hà Nam", "Hà Nội", "Hà Tĩnh", "Hải Dương", "Hải Phòng", "Hậu Giang", "Hòa Bình", "Hưng Yên", "Khánh Hòa", "Kiên Giang", "Kon Tum", "Lai Châu", "Lâm Đồng", "Lạng Sơn", "Lào Cai", "Long An", "Nam Định", "Nghệ An", "Ninh Bình", "Ninh Thuận", "Phú Thọ", "Phú Yên", "Quảng Bình", "Quảng Nam", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sóc Trăng", "Sơn La", "Tây Ninh", "Thái Bình", "Thái Nguyên", "Thanh Hóa", "Thừa Thiên Huế", "Tiền Giang", "TP. Hồ Chí Minh", "Trà Vinh", "Tuyên Quang", "Vĩnh Long", "Vĩnh Phúc", "Yên Bái"
];

function loadTinhThanh() {
    const datalist = document.getElementById('danhsach-tinhthanh');
    if (!datalist) return;
    datalist.innerHTML = '';
    tinhThanhVN.forEach(tinh => {
        let option = document.createElement('option');
        option.value = tinh;
        datalist.appendChild(option);
    });
}

function saveToLocalStorage() {
    localStorage.setItem('giangViens', JSON.stringify(giangViens));
    localStorage.setItem('sinhViens', JSON.stringify(sinhViens));
}

function showView(viewId) {
    document.getElementById('view-menu').classList.add('hidden');
    document.getElementById('view-giangvien').classList.add('hidden');
    document.getElementById('view-sinhvien').classList.add('hidden');
    document.getElementById('view-baocao').classList.add('hidden');
    
    document.getElementById(viewId).classList.remove('hidden');
    
    if(viewId === 'view-giangvien') renderTableGV();
    if(viewId === 'view-sinhvien') {
        loadDropdownGV();
        renderTableSV();
    }
    if(viewId === 'view-baocao') document.getElementById('ketqua-baocao').innerHTML = '';
}

function renderTableGV() {
    const tbody = document.getElementById('table-gv');
    tbody.innerHTML = '';
    giangViens.forEach(gv => {
        let tr = `<tr onclick="dienFormGV('${gv.ma}')">
            <td>${gv.ma}</td><td>${gv.ten}</td><td>${gv.namSinh}</td><td>${gv.soNamKN}</td>
        </tr>`;
        tbody.innerHTML += tr;
    });
}

function dienFormGV(ma) {
    const gv = giangViens.find(g => g.ma === ma);
    if(gv) {
        document.getElementById('gv-ma').value = gv.ma;
        document.getElementById('gv-ten').value = gv.ten;
        document.getElementById('gv-namsinh').value = gv.namSinh;
        document.getElementById('gv-sonamkn').value = gv.soNamKN;
    }
}

function themGV() {
    let ma = document.getElementById('gv-ma').value.trim();
    let ten = document.getElementById('gv-ten').value.trim();
    let namsinh = document.getElementById('gv-namsinh').value;
    let sonamkn = document.getElementById('gv-sonamkn').value;

    if(!ma || !ten) return alert("Vui lòng nhập Mã và Tên Giảng viên!");
    if(giangViens.find(g => g.ma === ma)) return alert("Mã Giảng viên đã tồn tại!");

    giangViens.push({ ma, ten, namSinh: namsinh, soNamKN: sonamkn });
    saveToLocalStorage(); renderTableGV(); alert("Thêm thành công!");
}

function suaGV() {
    let ma = document.getElementById('gv-ma').value.trim();
    let index = giangViens.findIndex(g => g.ma === ma);
    if(index === -1) return alert("Không tìm thấy mã Giảng viên để sửa!");

    giangViens[index].ten = document.getElementById('gv-ten').value.trim();
    giangViens[index].namSinh = document.getElementById('gv-namsinh').value;
    giangViens[index].soNamKN = document.getElementById('gv-sonamkn').value;
    
    saveToLocalStorage(); renderTableGV(); alert("Sửa thành công!");
}

function xoaGV() {
    let ma = document.getElementById('gv-ma').value.trim();
    if(confirm("Bạn có chắc muốn xóa giảng viên này? Các sinh viên thuộc GV này sẽ bị trống GV phụ trách.")) {
        giangViens = giangViens.filter(g => g.ma !== ma);
        sinhViens.forEach(sv => { if(sv.maGV === ma) sv.maGV = ''; });
        saveToLocalStorage(); renderTableGV(); alert("Xóa thành công!");
    }
}

function timGV() {
    let ma = document.getElementById('gv-ma').value.trim();
    let gv = giangViens.find(g => g.ma === ma);
    if(gv) dienFormGV(ma);
    else alert("Không tìm thấy Giảng viên!");
}

function loadDropdownGV() {
    const select = document.getElementById('sv-magv');
    select.innerHTML = '<option value="">-- Chọn Giảng viên --</option>';
    giangViens.forEach(gv => {
        select.innerHTML += `<option value="${gv.ma}">${gv.ma} - ${gv.ten}</option>`;
    });
}

function renderTableSV() {
    const tbody = document.getElementById('table-sv');
    tbody.innerHTML = '';
    sinhViens.forEach(sv => {
        let tr = `<tr onclick="dienFormSV('${sv.ma}')">
            <td>${sv.ma}</td><td>${sv.ten}</td><td>${sv.ngaySinh}</td><td>${sv.queQuan}</td><td>${sv.maGV}</td>
        </tr>`;
        tbody.innerHTML += tr;
    });
}

function dienFormSV(ma) {
    const sv = sinhViens.find(s => s.ma === ma);
    if(sv) {
        document.getElementById('sv-ma').value = sv.ma;
        document.getElementById('sv-ten').value = sv.ten;
        document.getElementById('sv-ngaysinh').value = sv.ngaySinh;
        document.getElementById('sv-quequan').value = sv.queQuan;
        document.getElementById('sv-magv').value = sv.maGV;
    }
}

function themSV() {
    let ma = document.getElementById('sv-ma').value.trim();
    let ten = document.getElementById('sv-ten').value.trim();
    let ngaysinh = document.getElementById('sv-ngaysinh').value;
    let quequan = document.getElementById('sv-quequan').value.trim();
    let maGV = document.getElementById('sv-magv').value;

    if(!ma || !ten) return alert("Vui lòng nhập Mã và Tên Sinh viên!");
    if(sinhViens.find(s => s.ma === ma)) return alert("Mã Sinh viên đã tồn tại!");

    sinhViens.push({ ma, ten, ngaySinh: ngaysinh, queQuan: quequan, maGV });
    saveToLocalStorage(); renderTableSV(); alert("Thêm thành công!");
}

function suaSV() {
    let ma = document.getElementById('sv-ma').value.trim();
    let index = sinhViens.findIndex(s => s.ma === ma);
    if(index === -1) return alert("Không tìm thấy mã Sinh viên để sửa!");

    sinhViens[index].ten = document.getElementById('sv-ten').value.trim();
    sinhViens[index].ngaySinh = document.getElementById('sv-ngaysinh').value;
    sinhViens[index].queQuan = document.getElementById('sv-quequan').value.trim();
    sinhViens[index].maGV = document.getElementById('sv-magv').value;
    
    saveToLocalStorage(); renderTableSV(); alert("Sửa thành công!");
}

function xoaSV() {
    let ma = document.getElementById('sv-ma').value.trim();
    if(confirm("Bạn có chắc muốn xóa sinh viên này?")) {
        sinhViens = sinhViens.filter(s => s.ma !== ma);
        saveToLocalStorage(); renderTableSV(); alert("Xóa thành công!");
    }
}

function timSV() {
    let ma = document.getElementById('sv-ma').value.trim();
    let sv = sinhViens.find(s => s.ma === ma);
    if(sv) dienFormSV(ma);
    else alert("Không tìm thấy Sinh viên!");
}

function lietKeSVTheoGV() {
    let maGV = document.getElementById('bc-magv').value.trim();
    if(!maGV) return alert("Vui lòng nhập Mã Giảng viên!");
    
    let ds = sinhViens.filter(s => s.maGV === maGV);
    let html = `<h3>Sinh viên do GV ${maGV} phụ trách</h3><table><thead><tr><th>Mã SV</th><th>Tên SV</th><th>Quê Quán</th></tr></thead><tbody>`;
    if(ds.length === 0) html += `<tr><td colspan="3">Không có sinh viên nào.</td></tr>`;
    ds.forEach(s => { html += `<tr><td>${s.ma}</td><td>${s.ten}</td><td>${s.queQuan}</td></tr>`; });
    html += `</tbody></table>`;
    document.getElementById('ketqua-baocao').innerHTML = html;
}

function timGVDacBiet() {
    if(giangViens.length === 0) return document.getElementById('ketqua-baocao').innerHTML = "<p>Chưa có dữ liệu giảng viên.</p>";
    
    let maxKN = Math.max(...giangViens.map(g => Number(g.soNamKN) || 0));
    let ds = giangViens.filter(g => (Number(g.soNamKN) || 0) === maxKN);
    
    let html = `<h3>Giảng viên có kinh nghiệm cao nhất (${maxKN} năm)</h3><table><thead><tr><th>Mã GV</th><th>Tên GV</th><th>Năm KN</th></tr></thead><tbody>`;
    ds.forEach(g => { html += `<tr><td>${g.ma}</td><td>${g.ten}</td><td>${g.soNamKN}</td></tr>`; });
    html += `</tbody></table>`;
    document.getElementById('ketqua-baocao').innerHTML = html;
}

function gvTren10Nam() {
    let ds = giangViens.filter(g => (Number(g.soNamKN) || 0) > 10);
    let html = `<h3>Giảng viên trên 10 năm kinh nghiệm</h3><table><thead><tr><th>Mã GV</th><th>Tên GV</th><th>Năm KN</th></tr></thead><tbody>`;
    if(ds.length === 0) html += `<tr><td colspan="3">Không có giảng viên nào trên 10 năm kinh nghiệm.</td></tr>`;
    ds.forEach(g => { html += `<tr><td>${g.ma}</td><td>${g.ten}</td><td>${g.soNamKN}</td></tr>`; });
    html += `</tbody></table>`;
    document.getElementById('ketqua-baocao').innerHTML = html;
}

document.addEventListener('DOMContentLoaded', () => {
    loadTinhThanh();
});