/* app.js — 고향봉투 작동형 클릭 프로토타입(데모모드).
   전부 클라이언트(localStorage) · 실제 결제/서버/개인정보 수집 없음.
   i18n: 신규 문자열은 NEW_I18N에 7개국어(ko/en/ne/km/vi/id/fil) 전부 등록 → Object.assign(I18N,...) 후 재적용.
   규제: 저렴함=집화밀도 절감만 · 면세/절세 소구 금지 · 금지품/재판매 실검증. */
(function(){
"use strict";

/* ============================================================
   1) 신규 다국어 사전 (동적 문자열 포함 → ko 필드 필수)
   ============================================================ */
var NEW_I18N = {
 /* 네비/계정 */
 "nav.myorders":{ko:"내 주문",en:"My orders",ne:"मेरा अर्डर",km:"ការបញ្ជាទិញរបស់ខ្ញុំ",vi:"Đơn của tôi",id:"Pesanan saya",fil:"Mga order ko"},
 "acct.loginNav":{ko:"로그인",en:"Log in",ne:"लगइन",km:"ចូល",vi:"Đăng nhập",id:"Masuk",fil:"Mag-log in"},
 "acct.loginTitle":{ko:"로그인",en:"Log in",ne:"लगइन",km:"ចូល",vi:"Đăng nhập",id:"Masuk",fil:"Mag-log in"},
 "acct.myTitle":{ko:"내 정보",en:"My account",ne:"मेरो खाता",km:"គណនីរបស់ខ្ញុំ",vi:"Tài khoản",id:"Akun saya",fil:"Aking account"},
 "acct.loginLead":{ko:"전화번호와 이름만 있으면 됩니다. 시연용 데모라 서버에 저장되지 않습니다.",en:"Just your name and phone. This is a demo — nothing is stored on a server.",ne:"नाम र फोन नम्बर मात्र चाहिन्छ। यो डेमो हो — सर्भरमा केही सुरक्षित हुँदैन।",km:"គ្រាន់តែឈ្មោះ និងលេខទូរស័ព្ទ។ នេះជាការសាកល្បង — គ្មានរក្សាទុកលើម៉ាស៊ីនមេទេ។",vi:"Chỉ cần tên và số điện thoại. Đây là bản demo — không lưu trên máy chủ.",id:"Cukup nama dan nomor telepon. Ini demo — tidak disimpan di server.",fil:"Pangalan at telepono lang. Demo ito — walang naka-imbak sa server."},
 "acct.name":{ko:"이름",en:"Name",ne:"नाम",km:"ឈ្មោះ",vi:"Tên",id:"Nama",fil:"Pangalan"},
 "acct.phone":{ko:"전화번호",en:"Phone",ne:"फोन नम्बर",km:"លេខទូរស័ព្ទ",vi:"Số điện thoại",id:"Nomor telepon",fil:"Numero ng telepono"},
 "acct.loginBtn":{ko:"로그인 (데모)",en:"Log in (demo)",ne:"लगइन (डेमो)",km:"ចូល (សាកល្បង)",vi:"Đăng nhập (demo)",id:"Masuk (demo)",fil:"Mag-log in (demo)"},
 "acct.logout":{ko:"로그아웃",en:"Log out",ne:"लगआउट",km:"ចាកចេញ",vi:"Đăng xuất",id:"Keluar",fil:"Mag-log out"},
 "acct.myOrdersBtn":{ko:"내 주문 보기",en:"View my orders",ne:"मेरा अर्डर हेर्नुहोस्",km:"មើលការបញ្ជាទិញ",vi:"Xem đơn của tôi",id:"Lihat pesanan saya",fil:"Tingnan ang mga order"},
 "acct.welcome":{ko:"환영합니다",en:"Welcome",ne:"स्वागत छ",km:"សូមស្វាគមន៍",vi:"Chào mừng",id:"Selamat datang",fil:"Maligayang pagdating"},
 "acct.demoNote":{ko:"데모 로그인입니다. 실제 인증이나 개인정보 수집은 없습니다.",en:"Demo login. No real authentication or data collection.",ne:"डेमो लगइन। वास्तविक प्रमाणीकरण वा व्यक्तिगत डेटा सङ्कलन छैन।",km:"ការចូលសាកល្បង។ គ្មានការផ្ទៀងផ្ទាត់ ឬប្រមូលទិន្នន័យពិតទេ។",vi:"Đăng nhập demo. Không xác thực thật hay thu thập dữ liệu.",id:"Login demo. Tanpa autentikasi nyata atau pengumpulan data.",fil:"Demo login. Walang tunay na authentication o pangongolekta ng data."},
 "acct.err.name":{ko:"이름을 입력하세요.",en:"Please enter your name.",ne:"कृपया नाम लेख्नुहोस्।",km:"សូមបញ្ចូលឈ្មោះ។",vi:"Vui lòng nhập tên.",id:"Masukkan nama Anda.",fil:"Ilagay ang pangalan."},
 "acct.err.phone":{ko:"전화번호를 입력하세요.",en:"Please enter your phone.",ne:"कृपया फोन नम्बर लेख्नुहोस्।",km:"សូមបញ្ចូលលេខទូរស័ព្ទ។",vi:"Vui lòng nhập số điện thoại.",id:"Masukkan nomor telepon.",fil:"Ilagay ang numero."},

 /* 국가명 */
 "c.np":{ko:"네팔",en:"Nepal",ne:"नेपाल",km:"នេប៉ាល់",vi:"Nepal",id:"Nepal",fil:"Nepal"},
 "c.kh":{ko:"캄보디아",en:"Cambodia",ne:"कम्बोडिया",km:"កម្ពុជា",vi:"Campuchia",id:"Kamboja",fil:"Cambodia"},
 "c.vn":{ko:"베트남",en:"Vietnam",ne:"भियतनाम",km:"វៀតណាម",vi:"Việt Nam",id:"Vietnam",fil:"Vietnam"},
 "c.id":{ko:"인도네시아",en:"Indonesia",ne:"इन्डोनेसिया",km:"ឥណ្ឌូនេស៊ី",vi:"Indonesia",id:"Indonesia",fil:"Indonesia"},
 "c.ph":{ko:"필리핀",en:"Philippines",ne:"फिलिपिन्स",km:"ហ្វីលីពីន",vi:"Philippines",id:"Filipina",fil:"Pilipinas"},

 /* 위저드 공통 */
 "wiz.title":{ko:"소포 보내기",en:"Send a parcel",ne:"पार्सल पठाउनुहोस्",km:"ផ្ញើកញ្ចប់",vi:"Gửi bưu kiện",id:"Kirim paket",fil:"Magpadala ng parcel"},
 "wiz.step.dest":{ko:"받는 곳",en:"Recipient",ne:"पाउने ठाउँ",km:"អ្នកទទួល",vi:"Người nhận",id:"Penerima",fil:"Tatanggap"},
 "wiz.step.items":{ko:"물품",en:"Items",ne:"सामान",km:"ទំនិញ",vi:"Món hàng",id:"Barang",fil:"Mga item"},
 "wiz.step.quote":{ko:"배송비",en:"Cost",ne:"ढुवानी",km:"ថ្លៃដឹក",vi:"Cước phí",id:"Biaya",fil:"Gastos"},
 "wiz.step.pay":{ko:"안전결제",en:"Escrow pay",ne:"सुरक्षित भुक्तानी",km:"ទូទាត់សុវត្ថិភាព",vi:"Ký quỹ",id:"Bayar aman",fil:"Ligtas na bayad"},
 "wiz.step.done":{ko:"완료",en:"Done",ne:"सम्पन्न",km:"រួចរាល់",vi:"Hoàn tất",id:"Selesai",fil:"Tapos"},
 "wiz.stepOf":{ko:"단계",en:"Step",ne:"चरण",km:"ជំហាន",vi:"Bước",id:"Langkah",fil:"Hakbang"},
 "btn.next":{ko:"다음",en:"Next",ne:"अर्को",km:"បន្ទាប់",vi:"Tiếp",id:"Lanjut",fil:"Susunod"},
 "btn.back":{ko:"이전",en:"Back",ne:"पछाडि",km:"ថយក្រោយ",vi:"Quay lại",id:"Kembali",fil:"Bumalik"},

 /* 스텝1 받는 사람 */
 "w1.pickCountry":{ko:"어느 나라로 보내나요?",en:"Which country are you sending to?",ne:"कुन देश पठाउने?",km:"ផ្ញើទៅប្រទេសណា?",vi:"Gửi đến nước nào?",id:"Kirim ke negara mana?",fil:"Saang bansa ipapadala?"},
 "w1.recipient":{ko:"받는 사람",en:"Recipient",ne:"पाउने व्यक्ति",km:"អ្នកទទួល",vi:"Người nhận",id:"Penerima",fil:"Tatanggap"},
 "w1.name":{ko:"받는 사람 이름",en:"Recipient name",ne:"पाउने व्यक्तिको नाम",km:"ឈ្មោះអ្នកទទួល",vi:"Tên người nhận",id:"Nama penerima",fil:"Pangalan ng tatanggap"},
 "w1.name.ph":{ko:"고향의 받는 사람 이름",en:"Name of the person back home",ne:"घरको पाउने व्यक्तिको नाम",km:"ឈ្មោះអ្នកទទួលនៅស្រុក",vi:"Tên người nhận ở quê",id:"Nama penerima di kampung",fil:"Pangalan ng tatanggap sa bayan"},
 "w1.phone":{ko:"받는 사람 전화번호",en:"Recipient phone",ne:"पाउने व्यक्तिको फोन",km:"ទូរស័ព្ទអ្នកទទួល",vi:"SĐT người nhận",id:"Telepon penerima",fil:"Telepono ng tatanggap"},
 "w1.phone.ph":{ko:"현지 전화번호",en:"Local phone number",ne:"स्थानीय फोन नम्बर",km:"លេខទូរស័ព្ទក្នុងស្រុក",vi:"Số điện thoại địa phương",id:"Nomor telepon setempat",fil:"Lokal na numero"},
 "w1.addr":{ko:"받는 주소",en:"Delivery address",ne:"पाउने ठेगाना",km:"អាសយដ្ឋានទទួល",vi:"Địa chỉ nhận",id:"Alamat penerima",fil:"Address ng padala"},
 "w1.addr.ph":{ko:"도시 · 구/군 · 상세 주소",en:"City · district · street address",ne:"सहर · जिल्ला · विस्तृत ठेगाना",km:"ក្រុង · ស្រុក · អាសយដ្ឋានលម្អិត",vi:"Thành phố · quận · địa chỉ chi tiết",id:"Kota · distrik · alamat lengkap",fil:"Lungsod · distrito · detalyadong address"},
 "w1.err.country":{ko:"보낼 나라를 선택하세요.",en:"Please choose a country.",ne:"कृपया देश छान्नुहोस्।",km:"សូមជ្រើសប្រទេស។",vi:"Vui lòng chọn nước.",id:"Pilih negara.",fil:"Pumili ng bansa."},
 "w1.err.name":{ko:"받는 사람 이름을 입력하세요.",en:"Enter the recipient's name.",ne:"पाउने व्यक्तिको नाम लेख्नुहोस्।",km:"បញ្ចូលឈ្មោះអ្នកទទួល។",vi:"Nhập tên người nhận.",id:"Isi nama penerima.",fil:"Ilagay ang pangalan ng tatanggap."},
 "w1.err.phone":{ko:"전화번호를 입력하세요.",en:"Enter a phone number.",ne:"फोन नम्बर लेख्नुहोस्।",km:"បញ្ចូលលេខទូរស័ព្ទ។",vi:"Nhập số điện thoại.",id:"Isi nomor telepon.",fil:"Ilagay ang numero."},
 "w1.err.addr":{ko:"주소를 입력하세요.",en:"Enter the address.",ne:"ठेगाना लेख्नुहोस्।",km:"បញ្ចូលអាសយដ្ឋាន។",vi:"Nhập địa chỉ.",id:"Isi alamat.",fil:"Ilagay ang address."},

 /* 스텝2 물품 */
 "w2.title":{ko:"무엇을 보내나요?",en:"What are you sending?",ne:"के पठाउँदै हुनुहुन्छ?",km:"អ្នកផ្ញើអ្វី?",vi:"Bạn gửi gì?",id:"Apa yang dikirim?",fil:"Ano ang ipapadala?"},
 "w2.hint":{ko:"품목마다 이름·무게·개수를 적으면 보낼 수 없는 물건을 자동으로 걸러 드립니다.",en:"Enter each item's name, weight and quantity — we automatically screen out items that can't ship.",ne:"प्रत्येक वस्तुको नाम, तौल र संख्या लेख्नुहोस् — पठाउन नमिल्ने वस्तु स्वतः छानिन्छ।",km:"បញ្ចូលឈ្មោះ ទម្ងន់ និងចំនួនរបស់វត្ថុនីមួយៗ — យើងច្រោះវត្ថុដែលផ្ញើមិនបានដោយស្វ័យប្រវត្តិ។",vi:"Nhập tên, cân nặng và số lượng từng món — chúng tôi tự động lọc món không gửi được.",id:"Isi nama, berat, dan jumlah tiap barang — kami otomatis menyaring yang tak boleh dikirim.",fil:"Ilagay ang pangalan, timbang at dami ng bawat item — awtomatiko naming sinasala ang bawal."},
 "w2.itemName":{ko:"품목",en:"Item",ne:"वस्तु",km:"ទំនិញ",vi:"Món hàng",id:"Barang",fil:"Item"},
 "w2.itemName.ph":{ko:"예: 옷, 신발, 과자, 화장품",en:"e.g. clothes, shoes, snacks, cosmetics",ne:"जस्तै: लुगा, जुत्ता, खाजा, कस्मेटिक",km:"ឧ. សម្លៀកបំពាក់ ស្បែកជើង នំ គ្រឿងសំអាង",vi:"vd: quần áo, giày, bánh, mỹ phẩm",id:"cth: baju, sepatu, camilan, kosmetik",fil:"hal. damit, sapatos, meryenda, kosmetiko"},
 "w2.weight":{ko:"무게(kg)",en:"Weight (kg)",ne:"तौल (kg)",km:"ទម្ងន់ (kg)",vi:"Cân nặng (kg)",id:"Berat (kg)",fil:"Timbang (kg)"},
 "w2.qty":{ko:"개수",en:"Qty",ne:"संख्या",km:"ចំនួន",vi:"Số lượng",id:"Jumlah",fil:"Dami"},
 "w2.value":{ko:"가치(₩)",en:"Value (₩)",ne:"मूल्य (₩)",km:"តម្លៃ (₩)",vi:"Giá trị (₩)",id:"Nilai (₩)",fil:"Halaga (₩)"},
 "w2.addItem":{ko:"품목 추가",en:"Add item",ne:"वस्तु थप्नुहोस्",km:"បន្ថែមទំនិញ",vi:"Thêm món",id:"Tambah barang",fil:"Magdagdag ng item"},
 "w2.total":{ko:"총 무게",en:"Total weight",ne:"कुल तौल",km:"ទម្ងន់សរុប",vi:"Tổng cân nặng",id:"Total berat",fil:"Kabuuang timbang"},
 "w2.err.item":{ko:"품목 이름과 무게를 입력하세요.",en:"Enter an item name and weight.",ne:"वस्तुको नाम र तौल लेख्नुहोस्।",km:"បញ្ចូលឈ្មោះ និងទម្ងន់ទំនិញ។",vi:"Nhập tên và cân nặng món hàng.",id:"Isi nama dan berat barang.",fil:"Ilagay ang pangalan at timbang."},
 "w2.err.blocked":{ko:"보낼 수 없는 물품이 있습니다. 빨간 표시를 확인해 수정하세요.",en:"Some items can't be sent. Check the items marked in red.",ne:"पठाउन नमिल्ने वस्तु छ। रातो चिन्ह हेरेर सच्याउनुहोस्।",km:"មានវត្ថុមួយចំនួនផ្ញើមិនបាន។ សូមពិនិត្យវត្ថុសម្គាល់ពណ៌ក្រហម។",vi:"Có món không gửi được. Kiểm tra các mục đánh dấu đỏ.",id:"Ada barang yang tak bisa dikirim. Periksa yang bertanda merah.",fil:"May item na bawal. Tingnan ang nakapula."},
 "w2.blockedTitle":{ko:"보낼 수 없는 물품",en:"Cannot be sent",ne:"पठाउन मिल्दैन",km:"ផ្ញើមិនបាន",vi:"Không thể gửi",id:"Tidak bisa dikirim",fil:"Hindi maipapadala"},
 "prohibited.meat":{ko:"육류·돼지고기 포함 식품은 항공 반입이 금지되어 보낼 수 없습니다.",en:"Meat and pork-containing foods are prohibited from air shipping.",ne:"मासु र सुँगुरको मासु भएको खानेकुरा हवाई ढुवानीमा निषेध छ।",km:"សាច់ និងអាហារមានសាច់ជ្រូក ត្រូវហាមឃាត់ពីការដឹកតាមអាកាស។",vi:"Thịt và thực phẩm có thịt heo bị cấm vận chuyển hàng không.",id:"Daging dan makanan berbabi dilarang dikirim lewat udara.",fil:"Bawal sa air shipping ang karne at pagkaing may baboy."},
 "prohibited.fresh":{ko:"신선 과일·채소는 검역 대상이라 보낼 수 없습니다.",en:"Fresh fruit and vegetables are quarantine-restricted and can't be sent.",ne:"ताजा फलफूल र तरकारी क्वारेन्टाइनका कारण पठाउन मिल्दैन।",km:"ផ្លែឈើ និងបន្លែស្រស់ ស្ថិតក្រោមការត្រួតពិនិត្យ មិនអាចផ្ញើបាន។",vi:"Trái cây và rau tươi thuộc diện kiểm dịch, không thể gửi.",id:"Buah dan sayur segar terkena karantina, tak bisa dikirim.",fil:"Ang sariwang prutas at gulay ay saklaw ng quarantine, hindi maipapadala."},
 "prohibited.battery":{ko:"리튬·보조배터리는 항공 안전 규정상 보낼 수 없습니다.",en:"Lithium batteries and power banks are barred by air-safety rules.",ne:"लिथियम र पावर बैंक हवाई सुरक्षा नियमले पठाउन मिल्दैन।",km:"ថ្មលីច្យូម និងថ្មបម្រុង ត្រូវហាមតាមច្បាប់សុវត្ថិភាពអាកាស។",vi:"Pin lithium và sạc dự phòng bị cấm theo quy định an toàn hàng không.",id:"Baterai litium dan power bank dilarang oleh aturan keselamatan udara.",fil:"Bawal ang lithium battery at power bank sa air-safety rules."},
 "prohibited.medicine":{ko:"의약품·건강기능식품은 통관 규제 대상이라 보낼 수 없습니다.",en:"Medicines and supplements are customs-restricted and can't be sent.",ne:"औषधि र स्वास्थ्य पूरक भन्सार नियमले पठाउन मिल्दैन।",km:"ឱសថ និងអាហារបំប៉ន ស្ថិតក្រោមការរឹតបន្តឹងគយ មិនអាចផ្ញើ។",vi:"Thuốc và thực phẩm chức năng bị hạn chế hải quan, không thể gửi.",id:"Obat dan suplemen dibatasi bea cukai, tak bisa dikirim.",fil:"Ang gamot at supplement ay restricted sa customs, hindi maipapadala."},
 "prohibited.alcohol":{ko:"주류·담배는 보낼 수 없습니다.",en:"Alcohol and tobacco cannot be sent.",ne:"रक्सी र चुरोट पठाउन मिल्दैन।",km:"គ្រឿងស្រវឹង និងថ្នាំជក់ ផ្ញើមិនបាន។",vi:"Rượu bia và thuốc lá không thể gửi.",id:"Alkohol dan tembakau tak bisa dikirim.",fil:"Bawal ang alak at tabako."},
 "prohibited.cash":{ko:"현금·귀금속은 보낼 수 없습니다. 돈은 송금 서비스를 이용하세요.",en:"Cash and precious metals can't be sent. Use a remittance service for money.",ne:"नगद र बहुमूल्य धातु पठाउन मिल्दैन। पैसाका लागि रेमिट्यान्स सेवा प्रयोग गर्नुहोस्।",km:"សាច់ប្រាក់ និងលោហៈមានតម្លៃ ផ្ញើមិនបាន។ សម្រាប់ប្រាក់ សូមប្រើសេវាផ្ញើប្រាក់។",vi:"Không thể gửi tiền mặt và kim loại quý. Hãy dùng dịch vụ chuyển tiền.",id:"Uang tunai dan logam mulia tak bisa dikirim. Gunakan layanan remitansi untuk uang.",fil:"Bawal ang cash at mahalagang metal. Gamitin ang remittance para sa pera."},
 "prohibited.commercial":{ko:"상업 판매·재판매 목적 물품은 보낼 수 없습니다. (같은 품목 다량 포함)",en:"Goods for commercial sale or resale can't be sent (including large quantities of one item).",ne:"व्यापारिक बिक्री वा पुनर्बिक्रीका सामान पठाउन मिल्दैन (एउटै वस्तु धेरै संख्या समेत)।",km:"ទំនិញសម្រាប់លក់ ឬលក់បន្ត ផ្ញើមិនបាន (រួមទាំងបរិមាណច្រើននៃវត្ថុតែមួយ)។",vi:"Hàng để bán hoặc bán lại không thể gửi (kể cả số lượng lớn một món).",id:"Barang untuk dijual atau dijual kembali tak bisa dikirim (termasuk satu barang jumlah besar).",fil:"Bawal ang paninda o ibinebentang muli (kasama ang maraming piraso ng iisang item)."},

 /* 스텝3 견적 */
 "w3.title":{ko:"배송비를 비교했어요",en:"Here's the cost comparison",ne:"ढुवानी तुलना गरियो",km:"នេះជាការប្រៀបធៀបថ្លៃ",vi:"So sánh cước phí",id:"Ini perbandingan biayanya",fil:"Narito ang paghahambing ng gastos"},
 "w3.solo":{ko:"혼자 보낼 때",en:"Sending alone",ne:"एक्लै पठाउँदा",km:"ផ្ញើម្នាក់ឯង",vi:"Gửi một mình",id:"Kirim sendiri",fil:"Mag-isang magpadala"},
 "w3.solo.sub":{ko:"개별 국제특송",en:"Individual express",ne:"व्यक्तिगत विशेष सेवा",km:"សេវាបញ្ជូនផ្ទាល់ខ្លួន",vi:"Chuyển phát riêng",id:"Ekspres perorangan",fil:"Indibidwal na express"},
 "w3.pooled":{ko:"함께 보낼 때 (합배송)",en:"Sending together (pooled)",ne:"सँगै पठाउँदा (सामूहिक)",km:"ផ្ញើជាមួយគ្នា (បញ្ចូលគ្នា)",vi:"Gửi cùng nhau (gộp)",id:"Kirim bersama (digabung)",fil:"Sabay magpadala (pinagsama)"},
 "w3.pooled.sub":{ko:"이번 공동구매에 합류",en:"Joining this group send",ne:"यो समूहमा सामेल",km:"ចូលរួមក្រុមផ្ញើនេះ",vi:"Tham gia nhóm gửi này",id:"Ikut kirim grup ini",fil:"Sumali sa group send na ito"},
 "w3.save":{ko:"함께 보내 아끼는 금액",en:"You save by sending together",ne:"सँगै पठाएर बचत",km:"អ្នកសន្សំបានដោយផ្ញើរួម",vi:"Bạn tiết kiệm khi gửi chung",id:"Hemat karena kirim bersama",fil:"Tipid sa sabay na padala"},
 "w3.why":{ko:"저렴한 이유는 하나입니다 — 같은 목적지 소포를 한 거점에 모아 한 번에 실어 집하·운송 단가를 낮춥니다. 세금·면세와는 무관합니다.",en:"There is one reason it's cheaper — we pool parcels to the same destination at one hub and ship at once, lowering the per-box handling and transport cost. Nothing to do with tax or duty-free.",ne:"सस्तो हुनुको कारण एउटै हो — उही गन्तव्यका पार्सल एउटै केन्द्रमा जम्मा गरी एकैचोटि पठाउँदा प्रति बाकस खर्च घट्छ। करसँग सम्बन्ध छैन।",km:"ហេតុផលថោកមានតែមួយ — យើងប្រមូលកញ្ចប់ទៅទិសដៅដដែលនៅមជ្ឈមណ្ឌលមួយ រួចផ្ញើម្តង ធ្វើឲ្យថ្លៃក្នុងមួយប្រអប់ថយចុះ។ មិនពាក់ព័ន្ធនឹងពន្ធទេ។",vi:"Chỉ có một lý do rẻ hơn — chúng tôi gom bưu kiện cùng điểm đến về một hub và gửi một lần, hạ chi phí xử lý và vận chuyển mỗi thùng. Không liên quan đến thuế.",id:"Hanya satu alasannya lebih murah — kami menggabungkan paket ke tujuan yang sama di satu hub lalu mengirim sekaligus, menurunkan biaya per kotak. Tak ada kaitan dengan pajak.",fil:"Isa lang ang dahilan kung bakit mas mura — tinitipon namin ang mga parcel papunta sa iisang destinasyon sa isang hub at isang beses ipinapadala, kaya bumababa ang gastos kada kahon. Walang kinalaman sa buwis."},
 "w3.breakdown":{ko:"데모 예시 요율입니다. 실제 요율은 공단 파일럿에서 실측해 확정·공개합니다.",en:"Demo example rates. Actual rates will be measured and published from the industrial-town pilot.",ne:"डेमो उदाहरण दर। वास्तविक दर पाइलटमा नापेर तय गरिन्छ।",km:"អត្រាគំរូសាកល្បង។ អត្រាពិតនឹងវាស់ និងផ្សព្វផ្សាយពីការសាកល្បង។",vi:"Mức cước ví dụ demo. Cước thật sẽ được đo và công bố từ chương trình thử nghiệm.",id:"Tarif contoh demo. Tarif asli diukur dan diumumkan dari pilot.",fil:"Demo na halimbawang singil. Ang tunay ay susukatin at ilalabas mula sa pilot."},
 "w3.pickBatch":{ko:"합류할 공동구매",en:"Group send to join",ne:"सामेल हुने समूह",km:"ក្រុមផ្ញើដែលត្រូវចូលរួម",vi:"Nhóm gửi để tham gia",id:"Grup kirim untuk diikuti",fil:"Group send na sasalihan"},
 "w3.batchNote":{ko:"마감 전에 참여하면 이번 합배송에 함께 실립니다.",en:"Join before the deadline to ride along on this shipment.",ne:"समय अगावै सामेल भए यही ढुवानीमा जान्छ।",km:"ចូលរួមមុនផុតកំណត់ ដើម្បីជាប់ក្នុងការដឹកនេះ។",vi:"Tham gia trước hạn để đi cùng chuyến này.",id:"Ikut sebelum tenggat agar masuk pengiriman ini.",fil:"Sumali bago ang deadline para makasabay dito."},
 "w3.newBatch":{ko:"이 목적지는 새 공동구매를 열어 이웃을 모읍니다. 합배송 요율이 적용됩니다.",en:"For this destination we open a new group send and gather neighbors. Pooled rates apply.",ne:"यो गन्तव्यका लागि नयाँ समूह खोलेर छिमेकी जम्मा गर्छौं। सामूहिक दर लागू हुन्छ।",km:"សម្រាប់ទិសដៅនេះ យើងបើកក្រុមថ្មី ហើយប្រមូលអ្នកជិតខាង។ អត្រាបញ្ចូលគ្នាត្រូវអនុវត្ត។",vi:"Với điểm đến này, chúng tôi mở nhóm mới và gom hàng xóm. Áp dụng cước gộp.",id:"Untuk tujuan ini kami buka grup baru dan mengumpulkan tetangga. Berlaku tarif gabungan.",fil:"Para sa destinasyong ito, magbubukas kami ng bagong grupo at magtitipon ng kapitbahay. Group rate ang gagamitin."},
 "w3.baseFee":{ko:"기본 취급료",en:"Base handling",ne:"आधार शुल्क",km:"ថ្លៃចាត់ចែងមូលដ្ឋាន",vi:"Phí xử lý cơ bản",id:"Biaya dasar",fil:"Batayang handling"},
 "w3.weightFee":{ko:"무게 요금",en:"Weight charge",ne:"तौल शुल्क",km:"ថ្លៃទម្ងន់",vi:"Phí theo cân",id:"Biaya berat",fil:"Singil sa timbang"},

 /* 스텝4 결제 */
 "w4.title":{ko:"안전결제 (에스크로)",en:"Escrow payment",ne:"सुरक्षित भुक्तानी (एस्क्रो)",km:"ការទូទាត់ Escrow",vi:"Thanh toán ký quỹ",id:"Pembayaran escrow",fil:"Escrow na bayad"},
 "w4.demoBadge":{ko:"시연용 데모 · 실제 결제는 이뤄지지 않습니다",en:"Demo only · no real payment is made",ne:"डेमो मात्र · वास्तविक भुक्तानी हुँदैन",km:"សាកល្បងតែប៉ុណ្ណោះ · គ្មានការទូទាត់ពិត",vi:"Chỉ demo · không thanh toán thật",id:"Hanya demo · tidak ada pembayaran nyata",fil:"Demo lang · walang tunay na bayad"},
 "w4.method":{ko:"결제 수단",en:"Payment method",ne:"भुक्तानी माध्यम",km:"មធ្យោបាយទូទាត់",vi:"Phương thức thanh toán",id:"Metode pembayaran",fil:"Paraan ng bayad"},
 "w4.card":{ko:"카드 결제",en:"Card",ne:"कार्ड",km:"កាត",vi:"Thẻ",id:"Kartu",fil:"Card"},
 "w4.bank":{ko:"계좌이체",en:"Bank transfer",ne:"बैंक ट्रान्सफर",km:"ផ្ទេរតាមធនាគារ",vi:"Chuyển khoản",id:"Transfer bank",fil:"Bank transfer"},
 "w4.easypay":{ko:"간편결제",en:"Easy pay",ne:"सजिलो भुक्तानी",km:"ទូទាត់រហ័ស",vi:"Thanh toán nhanh",id:"Bayar cepat",fil:"Easy pay"},
 "w4.total":{ko:"결제 금액 (합배송)",en:"Amount to pay (pooled)",ne:"भुक्तानी रकम (सामूहिक)",km:"ចំនួនទូទាត់ (បញ្ចូលគ្នា)",vi:"Số tiền (gộp)",id:"Jumlah bayar (gabungan)",fil:"Babayaran (pinagsama)"},
 "w4.escrowNote":{ko:"결제금은 라이선스 PG가 안전하게 보관하고, 소포 도착·수령이 확인되면 파트너에게 정산됩니다. 고향봉투는 돈을 직접 걷거나 보관하지 않습니다.",en:"Your payment is safely held by a licensed PG and released to partners only after the parcel arrives and receipt is confirmed. Gohyang never collects or holds money itself.",ne:"रकम दर्ता PG ले सुरक्षित राख्छ, पार्सल पुगेर प्राप्ति पुष्टि भएपछि मात्र साझेदारलाई भुक्तानी हुन्छ। गोहयाङले पैसा आफैँ राख्दैन।",km:"ប្រាក់ត្រូវរក្សាដោយ PG មានអាជ្ញាប័ណ្ណ ហើយបញ្ចេញទៅដៃគូតែក្រោយកញ្ចប់មកដល់ និងបញ្ជាក់ការទទួល។ Gohyang មិនកាន់ប្រាក់ដោយខ្លួនឯងទេ។",vi:"Tiền được PG có phép giữ an toàn và chỉ chuyển cho đối tác sau khi bưu kiện đến và xác nhận nhận. Gohyang không tự giữ tiền.",id:"Uang disimpan aman oleh PG berlisensi dan dicairkan ke mitra hanya setelah paket tiba dan diterima. Gohyang tidak pernah menyimpan uang.",fil:"Ligtas na hawak ng lisensyadong PG ang bayad at ibibigay sa partner pagkatapos dumating at matanggap ang parcel. Hindi humahawak ng pera ang Gohyang."},
 "w4.demoPay":{ko:"결제하기 (데모)",en:"Pay now (demo)",ne:"भुक्तानी गर्नुहोस् (डेमो)",km:"ទូទាត់ឥឡូវ (សាកល្បង)",vi:"Thanh toán (demo)",id:"Bayar (demo)",fil:"Magbayad (demo)"},
 "w4.processing":{ko:"결제 처리 중… (데모)",en:"Processing… (demo)",ne:"प्रक्रिया हुँदै… (डेमो)",km:"កំពុងដំណើរការ… (សាកល្បង)",vi:"Đang xử lý… (demo)",id:"Memproses… (demo)",fil:"Pinoproseso… (demo)"},
 "escrow.pay":{ko:"결제",en:"Pay",ne:"भुक्तानी",km:"ទូទាត់",vi:"Trả",id:"Bayar",fil:"Bayad"},
 "escrow.hold":{ko:"에스크로 보관",en:"Escrow hold",ne:"एस्क्रो भण्डारण",km:"រក្សា Escrow",vi:"Giữ ký quỹ",id:"Tahan escrow",fil:"Escrow hold"},
 "escrow.release":{ko:"수령 후 정산",en:"Release on receipt",ne:"प्राप्तिपछि भुक्तानी",km:"បញ្ចេញពេលទទួល",vi:"Trả khi nhận",id:"Cairkan saat diterima",fil:"Bayad pagtanggap"},

 /* 스텝5 완료 */
 "w5.title":{ko:"접수가 완료됐어요",en:"Your parcel is booked",ne:"बुकिङ सम्पन्न भयो",km:"កញ្ចប់បានកក់រួច",vi:"Đã đặt bưu kiện",id:"Paket sudah dipesan",fil:"Naka-book na ang parcel"},
 "w5.sub":{ko:"공동구매 마감일에 거점에서 함께 발송됩니다. 진행 상황은 배송추적에서 확인하세요.",en:"It ships from the hub on the group deadline. Follow progress in tracking.",ne:"समूहको अन्तिम मितिमा केन्द्रबाट सँगै पठाइन्छ। प्रगति ट्र्याकिङमा हेर्नुहोस्।",km:"វានឹងផ្ញើពីមជ្ឈមណ្ឌលនៅថ្ងៃផុតកំណត់ក្រុម។ តាមដានវឌ្ឍនភាពក្នុងការតាមដាន។",vi:"Sẽ gửi từ hub vào hạn chót của nhóm. Theo dõi ở mục tra cứu.",id:"Dikirim dari hub pada tenggat grup. Pantau di pelacakan.",fil:"Ipapadala mula sa hub sa deadline ng grupo. Subaybayan sa tracking."},
 "w5.orderNo":{ko:"주문번호",en:"Order no.",ne:"अर्डर नम्बर",km:"លេខបញ្ជាទិញ",vi:"Mã đơn",id:"No. pesanan",fil:"Order no."},
 "w5.tracking":{ko:"송장번호",en:"Tracking no.",ne:"ट्र्याकिङ नम्बर",km:"លេខតាមដាន",vi:"Mã vận đơn",id:"No. pelacakan",fil:"Tracking no."},
 "w5.route":{ko:"배송 구간",en:"Route",ne:"मार्ग",km:"ផ្លូវ",vi:"Tuyến",id:"Rute",fil:"Ruta"},
 "w5.copy":{ko:"복사",en:"Copy",ne:"कपी",km:"ចម្លង",vi:"Sao chép",id:"Salin",fil:"Kopyahin"},
 "w5.copied":{ko:"복사했습니다",en:"Copied",ne:"कपी भयो",km:"បានចម្លង",vi:"Đã sao chép",id:"Tersalin",fil:"Nakopya"},
 "w5.trackBtn":{ko:"배송 추적하기",en:"Track this parcel",ne:"पार्सल ट्र्याक गर्नुहोस्",km:"តាមដានកញ្ចប់នេះ",vi:"Theo dõi bưu kiện",id:"Lacak paket ini",fil:"Subaybayan ito"},
 "w5.myOrders":{ko:"내 주문 보기",en:"View my orders",ne:"मेरा अर्डर हेर्नुहोस्",km:"មើលការបញ្ជាទិញ",vi:"Xem đơn của tôi",id:"Lihat pesanan saya",fil:"Tingnan ang mga order"},
 "w5.shareTitle":{ko:"이웃에게 공유하기",en:"Share with a neighbor",ne:"छिमेकीलाई सेयर गर्नुहोस्",km:"ចែករំលែកជាមួយអ្នកជិតខាង",vi:"Chia sẻ với hàng xóm",id:"Bagikan ke tetangga",fil:"Ibahagi sa kapitbahay"},
 "w5.shareDesc":{ko:"QR을 찍으면 고향봉투가 열립니다.",en:"Scan the QR to open Gohyang.",ne:"QR स्क्यान गर्दा गोहयाङ खुल्छ।",km:"ស្កេន QR ដើម្បីបើក Gohyang។",vi:"Quét QR để mở Gohyang.",id:"Pindai QR untuk membuka Gohyang.",fil:"I-scan ang QR para buksan ang Gohyang."},
 "w5.demoSaved":{ko:"이 주문은 이 기기에만 저장된 데모 데이터입니다.",en:"This order is demo data saved only on this device.",ne:"यो अर्डर यही यन्त्रमा मात्र सुरक्षित डेमो डेटा हो।",km:"ការបញ្ជាទិញនេះជាទិន្នន័យសាកល្បង រក្សាទុកតែលើឧបករណ៍នេះ។",vi:"Đơn này là dữ liệu demo chỉ lưu trên thiết bị này.",id:"Pesanan ini data demo yang tersimpan hanya di perangkat ini.",fil:"Demo data ang order na ito, naka-imbak lang sa device na ito."},

 /* 배송추적 */
 "trk.formLabel":{ko:"송장번호로 조회",en:"Look up by tracking number",ne:"ट्र्याकिङ नम्बरले खोज्नुहोस्",km:"ស្វែងរកតាមលេខតាមដាន",vi:"Tra theo mã vận đơn",id:"Cari dengan nomor pelacakan",fil:"Hanapin sa tracking number"},
 "trk.ph":{ko:"예: GH-2609-NP-04821",en:"e.g. GH-2609-NP-04821",ne:"जस्तै: GH-2609-NP-04821",km:"ឧ. GH-2609-NP-04821",vi:"vd: GH-2609-NP-04821",id:"cth: GH-2609-NP-04821",fil:"hal. GH-2609-NP-04821"},
 "trk.btn":{ko:"조회하기",en:"Track",ne:"खोज्नुहोस्",km:"តាមដាន",vi:"Tra cứu",id:"Lacak",fil:"Subaybayan"},
 "trk.sampleLead":{ko:"번호가 없으면 예시로 확인해 보세요:",en:"No number? Try a sample:",ne:"नम्बर छैन? नमूना प्रयोग गर्नुहोस्:",km:"គ្មានលេខ? សាកគំរូ៖",vi:"Chưa có mã? Thử mẫu:",id:"Belum ada nomor? Coba contoh:",fil:"Walang number? Subukan ang sample:"},
 "trk.notFound":{ko:"해당 번호의 소포를 찾을 수 없습니다. 번호를 다시 확인해 주세요. 내가 보낸 소포는 '내 주문'에서도 볼 수 있습니다.",en:"No parcel found for that number. Please check it again. Parcels you sent also appear in 'My orders'.",ne:"त्यो नम्बरको पार्सल भेटिएन। कृपया नम्बर पुनः जाँच्नुहोस्। तपाईंले पठाएका पार्सल 'मेरा अर्डर' मा पनि देखिन्छ।",km:"រកមិនឃើញកញ្ចប់សម្រាប់លេខនោះ។ សូមពិនិត្យម្តងទៀត។ កញ្ចប់ដែលអ្នកផ្ញើ ក៏មាននៅ 'ការបញ្ជាទិញរបស់ខ្ញុំ' ដែរ។",vi:"Không tìm thấy bưu kiện cho mã đó. Vui lòng kiểm tra lại. Bưu kiện bạn gửi cũng có ở 'Đơn của tôi'.",id:"Paket untuk nomor itu tidak ditemukan. Periksa lagi. Paket yang Anda kirim juga ada di 'Pesanan saya'.",fil:"Walang parcel para sa numerong iyon. Suriin muli. Nasa 'Mga order ko' din ang mga ipinadala mo."},
 "trk.resultFor":{ko:"조회한 소포",en:"Parcel",ne:"पार्सल",km:"កញ្ចប់",vi:"Bưu kiện",id:"Paket",fil:"Parcel"},
 "trk.demoState":{ko:"데모 진행 상태입니다.",en:"Demo progress state.",ne:"डेमो प्रगति अवस्था।",km:"ស្ថានភាពវឌ្ឍនភាពសាកល្បង។",vi:"Trạng thái demo.",id:"Status kemajuan demo.",fil:"Demo na estado ng progreso."},

 /* 마이페이지 */
 "my.title":{ko:"내 주문",en:"My orders",ne:"मेरा अर्डर",km:"ការបញ្ជាទិញរបស់ខ្ញុំ",vi:"Đơn của tôi",id:"Pesanan saya",fil:"Mga order ko"},
 "my.empty.t":{ko:"아직 보낸 소포가 없어요",en:"No parcels yet",ne:"अहिलेसम्म पार्सल छैन",km:"មិនទាន់មានកញ្ចប់",vi:"Chưa có bưu kiện",id:"Belum ada paket",fil:"Wala pang parcel"},
 "my.empty.d":{ko:"첫 소포를 보내면 여기에서 주문내역과 배송상태를 볼 수 있습니다.",en:"Send your first parcel and your orders and delivery status will show here.",ne:"पहिलो पार्सल पठाएपछि यहाँ अर्डर र ढुवानी अवस्था देखिन्छ।",km:"ផ្ញើកញ្ចប់ដំបូង នោះការបញ្ជាទិញ និងស្ថានភាពដឹកនឹងបង្ហាញនៅទីនេះ។",vi:"Gửi bưu kiện đầu tiên, đơn và trạng thái giao sẽ hiện ở đây.",id:"Kirim paket pertama, pesanan dan status pengiriman muncul di sini.",fil:"Magpadala ng unang parcel at lalabas dito ang order at status."},
 "my.empty.cta":{ko:"소포 보내기",en:"Send a parcel",ne:"पार्सल पठाउनुहोस्",km:"ផ្ញើកញ្ចប់",vi:"Gửi bưu kiện",id:"Kirim paket",fil:"Magpadala ng parcel"},
 "my.detailTitle":{ko:"주문 상세",en:"Order details",ne:"अर्डर विवरण",km:"ព័ត៌មានលម្អិត",vi:"Chi tiết đơn",id:"Detail pesanan",fil:"Detalye ng order"},
 "my.recipient":{ko:"받는 사람",en:"Recipient",ne:"पाउने व्यक्ति",km:"អ្នកទទួល",vi:"Người nhận",id:"Penerima",fil:"Tatanggap"},
 "my.items":{ko:"보내는 물품",en:"Items",ne:"सामान",km:"ទំនិញ",vi:"Món hàng",id:"Barang",fil:"Mga item"},
 "my.paid":{ko:"결제 금액",en:"Paid",ne:"भुक्तानी",km:"បានទូទាត់",vi:"Đã trả",id:"Dibayar",fil:"Nabayaran"},
 "my.saved":{ko:"아낀 금액",en:"Saved",ne:"बचत",km:"បានសន្សំ",vi:"Tiết kiệm",id:"Hemat",fil:"Natipid"},

 /* 리더 신청 */
 "ld.applyBtn":{ko:"동네 리더 신청하기",en:"Apply as a community leader",ne:"स्थानीय लिडर बन्न आवेदन",km:"ដាក់ពាក្យជាមេដឹកនាំសហគមន៍",vi:"Đăng ký làm trưởng nhóm",id:"Daftar jadi pemimpin komunitas",fil:"Mag-apply bilang lider"},
 "ld.formTitle":{ko:"동네 리더 신청",en:"Community leader application",ne:"स्थानीय लिडर आवेदन",km:"ពាក្យសុំមេដឹកនាំសហគមន៍",vi:"Đăng ký trưởng nhóm",id:"Pendaftaran pemimpin komunitas",fil:"Aplikasyon bilang lider"},
 "ld.formLead":{ko:"이웃의 공동구매를 돕는 동네 리더를 신청합니다. 시연용 데모입니다.",en:"Apply to be a community leader who helps neighbors send together. This is a demo.",ne:"छिमेकीको समूह पठाउने काममा सहयोग गर्ने लिडरका लागि आवेदन। डेमो हो।",km:"ដាក់ពាក្យធ្វើមេដឹកនាំជួយអ្នកជិតខាងផ្ញើរួម។ នេះជាការសាកល្បង។",vi:"Đăng ký làm trưởng nhóm giúp hàng xóm gửi chung. Đây là bản demo.",id:"Daftar jadi pemimpin yang membantu tetangga kirim bersama. Ini demo.",fil:"Mag-apply bilang lider na tumutulong sa kapitbahay. Demo ito."},
 "ld.fRegion":{ko:"활동 지역",en:"Area you serve",ne:"क्षेत्र",km:"តំបន់សកម្មភាព",vi:"Khu vực hoạt động",id:"Wilayah",fil:"Lugar na sineserbisyuhan"},
 "ld.fRegion.ph":{ko:"예: 화성 향남, 안산 원곡동",en:"e.g. Hwaseong Hyangnam, Ansan Wongok",ne:"जस्तै: ह्वासोङ ह्याङनाम",km:"ឧ. ហ្វាសុង ហ្យ៉ាងណាម",vi:"vd: Hwaseong Hyangnam",id:"cth: Hwaseong Hyangnam",fil:"hal. Hwaseong Hyangnam"},
 "ld.fLang":{ko:"도와줄 수 있는 언어",en:"Language you can help in",ne:"सहयोग गर्न सक्ने भाषा",km:"ភាសាដែលអ្នកអាចជួយ",vi:"Ngôn ngữ hỗ trợ",id:"Bahasa yang bisa dibantu",fil:"Wikang matutulong mo"},
 "ld.fContact":{ko:"연락처 (전화)",en:"Contact (phone)",ne:"सम्पर्क (फोन)",km:"ទំនាក់ទំនង (ទូរស័ព្ទ)",vi:"Liên hệ (điện thoại)",id:"Kontak (telepon)",fil:"Kontak (telepono)"},
 "ld.submit":{ko:"신청하기 (데모)",en:"Apply (demo)",ne:"आवेदन गर्नुहोस् (डेमो)",km:"ដាក់ពាក្យ (សាកល្បង)",vi:"Đăng ký (demo)",id:"Daftar (demo)",fil:"Mag-apply (demo)"},
 "ld.successT":{ko:"신청이 접수됐어요",en:"Application received",ne:"आवेदन प्राप्त भयो",km:"បានទទួលពាក្យសុំ",vi:"Đã nhận đăng ký",id:"Pendaftaran diterima",fil:"Natanggap ang aplikasyon"},
 "ld.successD":{ko:"검토 후 연락드리겠습니다. 이 신청은 이 기기에만 저장된 데모입니다.",en:"We'll review and get in touch. This application is a demo saved only on this device.",ne:"समीक्षा गरी सम्पर्क गर्नेछौं। यो आवेदन यही यन्त्रमा मात्र सुरक्षित डेमो हो।",km:"យើងនឹងពិនិត្យ ហើយទាក់ទង។ ពាក្យនេះជាការសាកល្បង រក្សាទុកតែលើឧបករណ៍នេះ។",vi:"Chúng tôi sẽ xem xét và liên hệ. Đăng ký này là demo chỉ lưu trên thiết bị này.",id:"Kami akan tinjau dan menghubungi. Pendaftaran ini demo tersimpan di perangkat ini.",fil:"Susuriin namin at makikipag-ugnayan. Demo ito na naka-imbak dito."},
 "ld.err.region":{ko:"활동 지역을 입력하세요.",en:"Enter the area you serve.",ne:"क्षेत्र लेख्नुहोस्।",km:"បញ្ចូលតំបន់សកម្មភាព។",vi:"Nhập khu vực hoạt động.",id:"Isi wilayah Anda.",fil:"Ilagay ang lugar mo."},
 "ld.err.contact":{ko:"연락처를 입력하세요.",en:"Enter a contact number.",ne:"सम्पर्क नम्बर लेख्नुहोस्।",km:"បញ្ចូលលេខទំនាក់ទំនង។",vi:"Nhập số liên hệ.",id:"Isi nomor kontak.",fil:"Ilagay ang kontak."},

 /* 지도 팝업 */
 "map.activeBatches":{ko:"진행 중 공동구매",en:"Open group sends",ne:"चलिरहेका समूह",km:"ក្រុមផ្ញើកំពុងបើក",vi:"Nhóm đang mở",id:"Grup terbuka",fil:"Bukás na grupo"},
 "map.joinFromHub":{ko:"함께 보내기",en:"Join & send",ne:"सँगै पठाउनुहोस्",km:"ចូលរួម & ផ្ញើ",vi:"Tham gia & gửi",id:"Gabung & kirim",fil:"Sumali"},
 "map.noBatch":{ko:"이 거점은 새 공동구매를 준비 중입니다.",en:"This hub is preparing a new group send.",ne:"यो केन्द्र नयाँ समूह तयारी गर्दैछ।",km:"មជ្ឈមណ្ឌលនេះកំពុងរៀបចំក្រុមថ្មី។",vi:"Điểm này đang chuẩn bị nhóm mới.",id:"Hub ini menyiapkan grup baru.",fil:"Naghahanda ng bagong grupo ang hub na ito."},

 /* 공통 */
 "common.demo":{ko:"데모",en:"DEMO",ne:"डेमो",km:"សាកល្បង",vi:"DEMO",id:"DEMO",fil:"DEMO"},
 "common.perkg":{ko:"/kg",en:"/kg",ne:"/kg",km:"/kg",vi:"/kg",id:"/kg",fil:"/kg"},
 "common.people":{ko:"명 참여",en:" joined",ne:" जना सहभागी",km:" នាក់ចូលរួម",vi:" người tham gia",id:" bergabung",fil:" sumali"},
 "common.closingSoon":{ko:"마감 임박",en:"Closing soon",ne:"समय सकिँदै",km:"ជិតបិទ",vi:"Sắp đóng",id:"Segera tutup",fil:"Malapit magsara"},

 /* 기존 키에 ko 보강(동적 t() 사용) */
 "t1":{ko:"접수 완료",en:"Booked",ne:"बुकिङ भयो",km:"បានកក់",vi:"Đã đặt",id:"Dipesan",fil:"Na-book"},
 "t2":{ko:"거점 집하",en:"Collected at hub",ne:"केन्द्रमा सङ्कलन",km:"ប្រមូលនៅមជ្ឈមណ្ឌល",vi:"Đã gom tại điểm",id:"Terkumpul di hub",fil:"Natipon sa hub"},
 "t3":{ko:"정식 통관",en:"Customs cleared",ne:"आधिकारिक भन्सार",km:"ឆ្លងគយរួច",vi:"Đã thông quan",id:"Lolos bea cukai",fil:"Nakalusot sa customs"},
 "t4":{ko:"항공 운송",en:"In air transit",ne:"हवाई ढुवानी",km:"កំពុងដឹកតាមអាកាស",vi:"Đang vận chuyển hàng không",id:"Dalam transit udara",fil:"Nasa air transit"},
 "t5":{ko:"목적국 도착",en:"Arrived in country",ne:"गन्तव्य देश आइपुग्यो",km:"មកដល់ប្រទេស",vi:"Đã đến nước nhận",id:"Tiba di negara",fil:"Nakarating sa bansa"},
 "t6":{ko:"집앞 배송",en:"Delivered to door",ne:"घरमा पुर्‍याइयो",km:"ដឹកដល់ផ្ទះ",vi:"Đã giao tận nhà",id:"Diantar ke pintu",fil:"Naihatid sa pinto"},
 "tr.status.done":{ko:"완료",en:"Done",ne:"सम्पन्न",km:"រួចរាល់",vi:"Xong",id:"Selesai",fil:"Tapos"},
 "tr.status.now":{ko:"진행 중",en:"In progress",ne:"चलिरहेको",km:"កំពុងដំណើរការ",vi:"Đang xử lý",id:"Berlangsung",fil:"Isinasagawa"},
 "tr.status.wait":{ko:"대기",en:"Pending",ne:"पर्खँदै",km:"កំពុងរង់ចាំ",vi:"Chờ",id:"Menunggu",fil:"Naghihintay"},
 "gb.deadline":{ko:"마감까지",en:"Closes in",ne:"समय बाँकी",km:"បិទក្នុង",vi:"Đóng sau",id:"Tutup dalam",fil:"Magsasara sa"}
};
Object.assign(I18N, NEW_I18N);

/* ============================================================
   2) 데이터 모델 (데모)
   ============================================================ */
var COUNTRIES = [
 {code:"np", cc:"NP", flag:"🇳🇵"},
 {code:"kh", cc:"KH", flag:"🇰🇭"},
 {code:"vn", cc:"VN", flag:"🇻🇳"},
 {code:"id", cc:"ID", flag:"🇮🇩"},
 {code:"ph", cc:"PH", flag:"🇵🇭"}
];
function countryByCode(c){for(var i=0;i<COUNTRIES.length;i++)if(COUNTRIES[i].code===c)return COUNTRIES[i];return null;}
function countryName(c){var m={np:"c.np",kh:"c.kh",vn:"c.vn",id:"c.id",ph:"c.ph"};return t(m[c]||"c.np");}

var BATCHES = [
 {id:"np-hyangnam", country:"np", flag:"🇳🇵", hubKo:"화성 향남공단", hubEn:"Hwaseong Hyangnam", routeKo:"화성 향남공단 → 카트만두", routeEn:"Hwaseong Hyangnam → Kathmandu", deadlineH:52, people:12, closing:false},
 {id:"kh-wongok", country:"kh", flag:"🇰🇭", hubKo:"안산 원곡동", hubEn:"Ansan Wongok", routeKo:"안산 원곡동 → 프놈펜", routeEn:"Ansan Wongok → Phnom Penh", deadlineH:99, people:8, closing:false},
 {id:"np-gimhae", country:"np", flag:"🇳🇵", hubKo:"김해", hubEn:"Gimhae", routeKo:"김해 → 카트만두", routeEn:"Gimhae → Kathmandu", deadlineH:20, people:17, closing:true},
 {id:"kh-jeongwang", country:"kh", flag:"🇰🇭", hubKo:"시흥 정왕동", hubEn:"Siheung Jeongwang", routeKo:"시흥 정왕동 → 프놈펜", routeEn:"Siheung Jeongwang → Phnom Penh", deadlineH:140, people:5, closing:false}
];
function batchById(id){for(var i=0;i<BATCHES.length;i++)if(BATCHES[i].id===id)return BATCHES[i];return null;}
function batchesForCountry(c){return BATCHES.filter(function(b){return b.country===c;});}
function isKo(){return (document.documentElement.lang||"ko")==="ko";}
function batchRoute(b){return isKo()?b.routeKo:b.routeEn;}
function batchHub(b){return isKo()?b.hubKo:b.hubEn;}

/* 데모 요율(원). 저렴함=집화밀도(합배송) 절감만 · 세금/면세 무관 */
var RATES = {
 np:{solo:9000, pooled:6300, hSolo:8000, hPooled:4000},
 kh:{solo:8500, pooled:6000, hSolo:7500, hPooled:3800},
 vn:{solo:7500, pooled:5400, hSolo:7000, hPooled:3500},
 id:{solo:9000, pooled:6300, hSolo:8000, hPooled:4200},
 ph:{solo:8200, pooled:5800, hSolo:7200, hPooled:3600}
};
function chargeableWeight(kg){var w=Math.max(1, Math.ceil(kg*2)/2); return w;}
function quoteFor(country, kg){
 var r=RATES[country]||RATES.np; var w=chargeableWeight(kg);
 var solo=r.hSolo + r.solo*w;
 var pooled=r.hPooled + r.pooled*w;
 var saved=Math.max(0, solo-pooled);
 var pct=solo>0?Math.round(saved/solo*100):0;
 return {w:w, solo:solo, pooled:pooled, saved:saved, pct:pct, r:r};
}

/* 금지품/재판매 자동 검증 키워드(라틴+원어 스크립트). 소문자 부분일치 */
var PROHIBITED = [
 {reason:"prohibited.meat", kw:["pork","beef","sausage","bacon","salami","meatball","고기","돼지","소시지","육류","햄","베이컨","मासु","सुँगुर","सुंगुर","សាច់","សាច់ជ្រូក","thịt","thit","heo","xúc xích","xuc xich","daging","babi","sosis","karne","baboy","longganisa"]},
 {reason:"prohibited.fresh", kw:["fresh fruit","vegetable","veggie","과일","채소","야채","신선","फलफूल","तरकारी","साग","ផ្លែឈើ","បន្លែ","trái cây","trai cay","rau tươi","rau tuoi","buah","sayur","prutas","gulay","mangga","mango","망고","바나나","banana"]},
 {reason:"prohibited.battery", kw:["battery","batteries","powerbank","power bank","lithium","배터리","보조배터리","건전지","पावर बैंक","ब्याट्री","ब्याटरी","ថ្ម","ថ្មបម្រុង","pin sạc","sạc dự phòng","sac du phong","baterai","litium","baterya"]},
 {reason:"prohibited.medicine", kw:["medicine","medication","tablet","capsule","supplement","vitamin","약품","의약품","영양제","건강기능","비타민","औषधि","औषधी","ឱសថ","thuốc","thuoc","obat","suplemen","gamot","bitamina"]},
 {reason:"prohibited.alcohol", kw:["alcohol","wine","beer","soju","whisky","whiskey","liquor","cigarette","tobacco","vape","술","주류","소주","맥주","와인","담배","रक्सी","चुरोट","बियर","ស្រា","ស្រាបៀរ","ថ្នាំជក់","rượu","ruou","bia","thuốc lá","thuoc la","minuman keras","rokok","alak","sigarilyo"]},
 {reason:"prohibited.cash", kw:["cash","gold bar","silver bar","jewel","jewelry","jewellery","현금","귀금속","금괴","보석","नगद","सुन","सुनचाँदी","गहना","សាច់ប្រាក់","លុយ","មាស","tiền mặt","tien mat","vàng","vang","uang tunai","emas","perhiasan","ginto","alahas"]},
 {reason:"prohibited.commercial", kw:["for sale","for resale","resale","resell","wholesale","판매용","도매","재판매","상업용","납품용","बिक्री","थोक","पुनर्बिक्री","លក់","លក់បន្ត","លក់ដុំ","bán lại","ban lai","bán buôn","ban buon","để bán","de ban","dijual","grosir","untuk dijual","paninda","pakyawan","benta"]}
];
function checkProhibited(name, qty){
 var hay=(name||"").toLowerCase();
 if(hay){
   for(var i=0;i<PROHIBITED.length;i++){
     var c=PROHIBITED[i];
     for(var j=0;j<c.kw.length;j++){ if(hay.indexOf(c.kw[j])>=0) return {blocked:true, reason:c.reason}; }
   }
 }
 if((qty||0)>=10) return {blocked:true, reason:"prohibited.commercial"};
 return {blocked:false};
}

/* 데모 샘플 송장 */
var SAMPLES = {
 "GH-2609-NP-04821":{country:"np", routeKo:"화성 향남공단 → 카트만두", routeEn:"Hwaseong Hyangnam → Kathmandu", stage:2},
 "GH-2609-KH-01337":{country:"kh", routeKo:"안산 원곡동 → 프놈펜", routeEn:"Ansan Wongok → Phnom Penh", stage:4}
};

/* ============================================================
   3) 저장소(localStorage) · 유틸
   ============================================================ */
var ORD_KEY="gh_orders", USER_KEY="gh_user", LEAD_KEY="gh_leaders";
function lsGet(k,def){try{var v=localStorage.getItem(k);return v?JSON.parse(v):def;}catch(e){return def;}}
function lsSet(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
function getOrders(){return lsGet(ORD_KEY,[]);}
function saveOrder(o){var a=getOrders();a.unshift(o);lsSet(ORD_KEY,a);}
function findOrder(no){var a=getOrders();for(var i=0;i<a.length;i++)if(a[i].orderNo===no||a[i].tracking===no)return a[i];return null;}
function getUser(){return lsGet(USER_KEY,null);}
function setUser(u){lsSet(USER_KEY,u);}
function getLeaders(){return lsGet(LEAD_KEY,[]);}
function saveLeader(l){var a=getLeaders();a.unshift(l);lsSet(LEAD_KEY,a);}

function won(n){return "₩"+Math.round(n||0).toLocaleString("en-US");}
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(m){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m];});}
function pad2(n){return String(n).padStart(2,"0");}
function genOrderNo(country){
 var cc=(countryByCode(country)||{cc:"NP"}).cc;
 var d=new Date(); var yy=String(d.getFullYear()).slice(2); var mm=pad2(d.getMonth()+1);
 var rnd=Math.floor(10000+Math.random()*89999);
 return "GH-"+yy+mm+"-"+cc+"-"+String(rnd);
}
function fmtDeadline(h){
 var s=h*3600; var d=Math.floor(s/86400); s-=d*86400; var hh=Math.floor(s/3600); s-=hh*3600; var m=Math.floor(s/60);
 return (d>0?d+"d ":"")+pad2(hh)+":"+pad2(m);
}
function el(html){var t=document.createElement("template"); t.innerHTML=html.trim(); return t.content.firstElementChild;}
function toast(msg){var el=document.getElementById("toast"); if(!el)return; el.textContent=msg; el.classList.add("show"); clearTimeout(el._t); el._t=setTimeout(function(){el.classList.remove("show");},1900);}

/* ============================================================
   4) 오버레이(모달) 공통 · 포커스/키보드/접근성
   ============================================================ */
var openStack=[]; var lastFocus=null;
function focusables(root){return Array.prototype.slice.call(root.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')).filter(function(e){return e.offsetParent!==null;});}
function openOverlay(ov){
 if(openStack.indexOf(ov)<0) openStack.push(ov);
 lastFocus=document.activeElement;
 ov.classList.add("open"); ov.setAttribute("aria-hidden","false"); document.body.classList.add("modal-open");
 var sheet=ov.querySelector(".sheet"); if(sheet) sheet.classList.add("open");
 setTimeout(function(){var f=focusables(ov); if(f.length){ (f.find(function(e){return e.tagName==="INPUT"||e.tagName==="SELECT"||e.tagName==="TEXTAREA";})||f[0]).focus(); }},60);
}
function closeOverlay(ov){
 ov.classList.remove("open"); ov.setAttribute("aria-hidden","true");
 var i=openStack.indexOf(ov); if(i>=0) openStack.splice(i,1);
 if(openStack.length===0) document.body.classList.remove("modal-open");
 if(lastFocus&&lastFocus.focus){try{lastFocus.focus();}catch(e){}}
}
document.addEventListener("keydown",function(e){
 if(e.key==="Escape"&&openStack.length){ e.preventDefault(); closeOverlay(openStack[openStack.length-1]); return; }
 if(e.key==="Tab"&&openStack.length){
   var ov=openStack[openStack.length-1]; var f=focusables(ov); if(!f.length) return;
   var first=f[0], last=f[f.length-1];
   if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
   else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
 }
});
[ "wizardOverlay","panelOverlay" ].forEach(function(id){
 var ov=document.getElementById(id); if(!ov) return;
 ov.addEventListener("mousedown",function(e){ if(e.target===ov) closeOverlay(ov); });
});

/* ============================================================
   5) 위저드 — 소포 보내기 (핵심 플로우)
   ============================================================ */
var WZ=null;
function newWizardState(prefill){
 prefill=prefill||{};
 return { step:1, country:prefill.country||"", batchId:prefill.batchId||"", recipient:{name:"",phone:"",addr:""}, items:[{name:"",weight:"",qty:"1",value:""}], payMethod:"card", order:null };
}
function openWizard(prefill){
 WZ=newWizardState(prefill);
 // 배치 프리필 시 국가 자동 세팅
 if(WZ.batchId){var b=batchById(WZ.batchId); if(b) WZ.country=b.country;}
 renderWizard();
 openOverlay(document.getElementById("wizardOverlay"));
}
var STEP_KEYS=["wiz.step.dest","wiz.step.items","wiz.step.quote","wiz.step.pay","wiz.step.done"];
function renderStepbar(){
 var sb=document.getElementById("wizStepbar"); var lab=document.getElementById("wizStepLabel");
 var html=""; for(var i=1;i<=5;i++){ html+='<i class="'+(i<WZ.step?"done":(i===WZ.step?"on":""))+'"></i>'; }
 sb.innerHTML=html;
 lab.textContent=t("wiz.stepOf")+" "+WZ.step+" / 5 · "+t(STEP_KEYS[WZ.step-1]);
}
function renderWizard(){
 renderStepbar();
 var body=document.getElementById("wizBody"); var foot=document.getElementById("wizFoot");
 if(WZ.step===1){ body.innerHTML=step1HTML(); foot.innerHTML=footHTML(false,true); wireStep1(); }
 else if(WZ.step===2){ body.innerHTML=step2HTML(); foot.innerHTML=footHTML(true,true); wireStep2(); }
 else if(WZ.step===3){ body.innerHTML=step3HTML(); foot.innerHTML=footHTML(true,true); wireStep3(); }
 else if(WZ.step===4){ body.innerHTML=step4HTML(); foot.innerHTML=footHTML(true,false)+payFootHTML(); wireStep4(); }
 else if(WZ.step===5){ body.innerHTML=step5HTML(); foot.innerHTML=doneFootHTML(); wireStep5(); }
 document.getElementById("wizBody").scrollTop=0;
}
function footHTML(back,next){
 var h="";
 if(back) h+='<button class="btn btn-ghost btn-back" data-wiz="back"><span class="t-button" style="color:var(--color-seed)">'+esc(t("btn.back"))+'</span></button>';
 if(next) h+='<button class="btn btn-primary" data-wiz="next"><span class="t-button">'+esc(t("btn.next"))+'</span></button>';
 return h;
}
function payFootHTML(){ return '<button class="btn btn-primary" data-wiz="pay"><span class="t-button">'+esc(t("w4.demoPay"))+'</span></button>'; }
function doneFootHTML(){
 return '<button class="btn btn-ghost btn-back" data-wiz="close"><span class="t-button" style="color:var(--color-seed)">'+esc(t("w5.myOrders"))+'</span></button>'+
        '<button class="btn btn-primary" data-wiz="track"><span class="t-button">'+esc(t("w5.trackBtn"))+'</span></button>';
}

/* 스텝1 */
function step1HTML(){
 var opts=COUNTRIES.map(function(c){
   return '<button type="button" class="country-opt'+(WZ.country===c.code?" on":"")+'" data-country="'+c.code+'"><span class="fl">'+c.flag+'</span><span class="nm">'+esc(countryName(c.code))+'</span></button>';
 }).join("");
 var r=WZ.recipient;
 return ''+
 '<div class="field"><label>'+esc(t("w1.pickCountry"))+'<span class="req">*</span></label><div class="country-grid" id="countryGrid">'+opts+'</div><div class="err" id="err-country">'+esc(t("w1.err.country"))+'</div></div>'+
 '<div class="sec-label">'+esc(t("w1.recipient"))+'</div>'+
 '<div class="field" id="f-name"><label for="rc-name">'+esc(t("w1.name"))+'<span class="req">*</span></label><input id="rc-name" type="text" value="'+esc(r.name)+'" placeholder="'+esc(t("w1.name.ph"))+'"><div class="err">'+esc(t("w1.err.name"))+'</div></div>'+
 '<div class="field" id="f-phone"><label for="rc-phone">'+esc(t("w1.phone"))+'<span class="req">*</span></label><input id="rc-phone" type="tel" inputmode="tel" value="'+esc(r.phone)+'" placeholder="'+esc(t("w1.phone.ph"))+'"><div class="err">'+esc(t("w1.err.phone"))+'</div></div>'+
 '<div class="field" id="f-addr"><label for="rc-addr">'+esc(t("w1.addr"))+'<span class="req">*</span></label><textarea id="rc-addr" placeholder="'+esc(t("w1.addr.ph"))+'">'+esc(r.addr)+'</textarea><div class="err">'+esc(t("w1.err.addr"))+'</div></div>';
}
function wireStep1(){
 var grid=document.getElementById("countryGrid");
 grid.querySelectorAll(".country-opt").forEach(function(b){
   b.addEventListener("click",function(){ grid.querySelectorAll(".country-opt").forEach(function(x){x.classList.remove("on");}); b.classList.add("on"); WZ.country=b.getAttribute("data-country"); document.querySelector("#f-name") && document.getElementById("err-country").parentElement.classList.remove("invalid"); });
 });
}
function persistStep1(){
 var n=document.getElementById("rc-name"), p=document.getElementById("rc-phone"), a=document.getElementById("rc-addr");
 if(n) WZ.recipient.name=n.value; if(p) WZ.recipient.phone=p.value; if(a) WZ.recipient.addr=a.value;
}
function validateStep1(){
 persistStep1(); var ok=true;
 var cf=document.getElementById("err-country").parentElement;
 if(!WZ.country){cf.classList.add("invalid");ok=false;} else cf.classList.remove("invalid");
 [["rc-name","f-name"],["rc-phone","f-phone"],["rc-addr","f-addr"]].forEach(function(p){
   var inp=document.getElementById(p[0]); var f=document.getElementById(p[1]);
   if(!inp.value.trim()){f.classList.add("invalid");ok=false;} else f.classList.remove("invalid");
 });
 return ok;
}

/* 스텝2 물품 */
function step2HTML(){
 return ''+
 '<div class="sec-label">'+esc(t("w2.title"))+'</div>'+
 '<p class="field" style="margin-bottom:14px;color:var(--color-body);font-size:13px;line-height:1.6">'+esc(t("w2.hint"))+'</p>'+
 '<div class="items-wrap" id="itemsWrap"></div>'+
 '<button type="button" class="add-item" id="addItem"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>'+esc(t("w2.addItem"))+'</button>'+
 '<div class="weight-total"><span class="wl">'+esc(t("w2.total"))+'</span><span class="wv" id="weightTotal">0.0 kg</span></div>';
}
function itemRowHTML(it,idx){
 var chk=checkProhibited(it.name, parseInt(it.qty||"0",10));
 return '<div class="item-row'+(chk.blocked?" blocked":"")+'" data-idx="'+idx+'">'+
   '<div class="ir-top">'+
     '<div class="ir-name field" style="margin-bottom:0"><label>'+esc(t("w2.itemName"))+'</label><input type="text" class="it-name" value="'+esc(it.name)+'" placeholder="'+esc(t("w2.itemName.ph"))+'"></div>'+
     (idx>0?'<button type="button" class="ir-del" aria-label="'+esc(t("w2.itemName"))+' ✕"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>':'')+
   '</div>'+
   '<div class="ir-nums">'+
     '<div class="field"><label>'+esc(t("w2.weight"))+'</label><input type="text" inputmode="decimal" class="it-weight" value="'+esc(it.weight)+'" placeholder="0.0"></div>'+
     '<div class="field"><label>'+esc(t("w2.qty"))+'</label><input type="text" inputmode="numeric" class="it-qty" value="'+esc(it.qty)+'" placeholder="1"></div>'+
     '<div class="field"><label>'+esc(t("w2.value"))+'</label><input type="text" inputmode="numeric" class="it-value" value="'+esc(it.value)+'" placeholder="0"></div>'+
   '</div>'+
   '<div class="ir-block"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l10 18H2L12 2z"/><path d="M12 9v5"/><path d="M12 17h.01"/></svg><div><div class="bt">'+esc(t("w2.blockedTitle"))+'</div><div class="bd">'+esc(chk.blocked?t(chk.reason):"")+'</div></div></div>'+
 '</div>';
}
function renderItems(){
 var wrap=document.getElementById("itemsWrap"); if(!wrap) return;
 wrap.innerHTML=WZ.items.map(function(it,i){return itemRowHTML(it,i);}).join("");
 wrap.querySelectorAll(".item-row").forEach(function(row){
   var idx=parseInt(row.getAttribute("data-idx"),10);
   var nm=row.querySelector(".it-name"), wt=row.querySelector(".it-weight"), qt=row.querySelector(".it-qty"), vl=row.querySelector(".it-value");
   function sync(){ WZ.items[idx]={name:nm.value, weight:wt.value, qty:qt.value, value:vl.value}; }
   nm.addEventListener("input",function(){ sync(); var chk=checkProhibited(nm.value, parseInt(qt.value||"0",10)); toggleBlock(row,chk); });
   qt.addEventListener("input",function(){ sync(); var chk=checkProhibited(nm.value, parseInt(qt.value||"0",10)); toggleBlock(row,chk); updateWeight(); });
   wt.addEventListener("input",function(){ sync(); updateWeight(); });
   vl.addEventListener("input",sync);
   var del=row.querySelector(".ir-del"); if(del) del.addEventListener("click",function(){ WZ.items.splice(idx,1); renderItems(); updateWeight(); });
 });
 updateWeight();
}
function toggleBlock(row,chk){
 if(chk.blocked){ row.classList.add("blocked"); row.querySelector(".bd").textContent=t(chk.reason); }
 else row.classList.remove("blocked");
}
function totalWeight(){ var s=0; WZ.items.forEach(function(it){ var w=parseFloat(it.weight||"0")||0; var q=parseInt(it.qty||"1",10)||1; s+=w*q; }); return s; }
function updateWeight(){ var elw=document.getElementById("weightTotal"); if(elw) elw.textContent=totalWeight().toFixed(1)+" kg"; }
function wireStep2(){
 renderItems();
 document.getElementById("addItem").addEventListener("click",function(){ WZ.items.push({name:"",weight:"",qty:"1",value:""}); renderItems(); var rows=document.querySelectorAll("#itemsWrap .it-name"); if(rows.length) rows[rows.length-1].focus(); });
}
function validateStep2(){
 // 값 최신화
 var rows=document.querySelectorAll("#itemsWrap .item-row");
 rows.forEach(function(row){ var idx=parseInt(row.getAttribute("data-idx"),10); WZ.items[idx]={name:row.querySelector(".it-name").value, weight:row.querySelector(".it-weight").value, qty:row.querySelector(".it-qty").value, value:row.querySelector(".it-value").value}; });
 // 유효 품목 최소 1개(이름+무게)
 var valid=WZ.items.filter(function(it){return it.name.trim() && (parseFloat(it.weight)||0)>0;});
 if(!valid.length){ toast(t("w2.err.item")); var f=document.querySelector("#itemsWrap .it-name"); if(f) f.focus(); return false; }
 // 금지품 차단
 var blocked=false;
 rows.forEach(function(row){ var idx=parseInt(row.getAttribute("data-idx"),10); var it=WZ.items[idx]; var chk=checkProhibited(it.name, parseInt(it.qty||"0",10)); if(it.name.trim()&&chk.blocked){ blocked=true; row.classList.add("blocked"); row.querySelector(".bd").textContent=t(chk.reason); } });
 if(blocked){ toast(t("w2.err.blocked")); return false; }
 return true;
}

/* 스텝3 견적 */
function step3HTML(){
 var q=quoteFor(WZ.country, totalWeight());
 var batches=batchesForCountry(WZ.country);
 var batchHtml="";
 if(batches.length){
   if(!WZ.batchId || !batchById(WZ.batchId) || batchById(WZ.batchId).country!==WZ.country){ WZ.batchId=batches[0].id; }
   batchHtml='<div class="sec-label" style="margin-top:22px">'+esc(t("w3.pickBatch"))+'</div>'+
     '<div class="batch-list" id="batchList">'+batches.map(function(b){
       return '<button type="button" class="batch-opt'+(WZ.batchId===b.id?" on":"")+'" data-batch="'+b.id+'">'+
         '<span class="bfl">'+b.flag+'</span>'+
         '<span class="bmain"><span class="brt">'+esc(batchRoute(b))+'</span><span class="bsub">'+b.people+esc(t("common.people"))+(b.closing?' · '+esc(t("common.closingSoon")):'')+'</span></span>'+
         '<span class="bdl"><span class="bt">'+esc(t("gb.deadline"))+'</span><span class="clk" data-deadline="'+b.deadlineH+'">'+fmtDeadline(b.deadlineH)+'</span></span>'+
         '<span class="radio"></span></button>';
     }).join("")+'</div>'+
     '<p class="quote-breakdown" style="margin-top:8px">'+esc(t("w3.batchNote"))+'</p>';
 } else {
   batchHtml='<div class="demo-banner" style="margin-top:20px"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v5"/><path d="M12 16h.01"/></svg><span>'+esc(t("w3.newBatch"))+'</span></div>';
 }
 return ''+
 '<div class="sec-label">'+esc(t("w3.title"))+'</div>'+
 '<div class="quote-panel">'+
   '<div class="quote-row solo"><span class="ql">'+esc(t("w3.solo"))+'<small>'+esc(t("w3.solo.sub"))+' · '+q.w.toFixed(1)+'kg</small></span><span class="qv">'+won(q.solo)+'</span></div>'+
   '<div class="quote-row pooled"><span class="ql">'+esc(t("w3.pooled"))+'<small>'+esc(t("w3.pooled.sub"))+'</small></span><span class="qv">'+won(q.pooled)+'</span></div>'+
   '<div class="quote-save"><span class="sl">'+esc(t("w3.save"))+'</span><span class="sv">-'+won(q.saved)+' ('+q.pct+'%)</span></div>'+
 '</div>'+
 '<div class="quote-why"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7l9-4 9 4v10l-9 4-9-4V7z"/><path d="M3 7l9 4 9-4"/></svg><span>'+esc(t("w3.why"))+'</span></div>'+
 '<div class="quote-breakdown">'+esc(t("w3.baseFee"))+' '+won(q.r.hPooled)+' + '+esc(t("w3.weightFee"))+' '+won(q.r.pooled)+esc(t("common.perkg"))+' × '+q.w.toFixed(1)+'kg</div>'+
 '<div class="quote-breakdown">'+esc(t("w3.breakdown"))+'</div>'+
 batchHtml;
}
function wireStep3(){
 var list=document.getElementById("batchList");
 if(list){ list.querySelectorAll(".batch-opt").forEach(function(b){ b.addEventListener("click",function(){ list.querySelectorAll(".batch-opt").forEach(function(x){x.classList.remove("on");}); b.classList.add("on"); WZ.batchId=b.getAttribute("data-batch"); }); }); }
}

/* 스텝4 결제(데모) */
function step4HTML(){
 var q=quoteFor(WZ.country, totalWeight());
 var methods=[["card","w4.card","M4 8h16M6 5h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"],
              ["bank","w4.bank","M4 10h16M4 10l8-6 8 6M6 10v7M18 10v7M4 19h16"],
              ["easypay","w4.easypay","M7 4h10a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zM10 18h4"]];
 var mh=methods.map(function(m){
   return '<button type="button" class="pay-opt'+(WZ.payMethod===m[0]?" on":"")+'" data-pay="'+m[0]+'"><span class="pic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="'+m[2]+'"/></svg></span><span class="pnm">'+esc(t(m[1]))+'</span><span class="radio"></span></button>';
 }).join("");
 return ''+
 '<div class="demo-banner"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v5"/><path d="M12 16h.01"/></svg><span>'+esc(t("w4.demoBadge"))+'</span></div>'+
 '<div class="pay-total"><span class="ptl">'+esc(t("w4.total"))+'</span><span class="ptv">'+won(q.pooled)+'</span></div>'+
 '<div class="sec-label" style="margin-top:18px">'+esc(t("w4.method"))+'</div>'+
 '<div class="pay-methods" id="payMethods">'+mh+'</div>'+
 '<div class="escrow-mini" aria-hidden="true">'+
   '<div class="en hl"><div class="eic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h16M6 5h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/></svg></div><div class="elab">'+esc(t("escrow.pay"))+'</div></div>'+
   '<span class="arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>'+
   '<div class="en"><div class="eic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg></div><div class="elab">'+esc(t("escrow.hold"))+'</div></div>'+
   '<span class="arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>'+
   '<div class="en"><div class="eic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l4 4 10-10"/></svg></div><div class="elab">'+esc(t("escrow.release"))+'</div></div>'+
 '</div>'+
 '<p class="quote-why" style="margin-top:14px"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l7 4v6c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6l7-4z"/><path d="M9 12l2 2 4-4"/></svg><span>'+esc(t("w4.escrowNote"))+'</span></p>';
}
function wireStep4(){
 var pm=document.getElementById("payMethods");
 pm.querySelectorAll(".pay-opt").forEach(function(b){ b.addEventListener("click",function(){ pm.querySelectorAll(".pay-opt").forEach(function(x){x.classList.remove("on");}); b.classList.add("on"); WZ.payMethod=b.getAttribute("data-pay"); }); });
}
function doPay(){
 var payBtn=document.querySelector('#wizFoot [data-wiz="pay"]'); if(payBtn){ payBtn.setAttribute("disabled","disabled"); payBtn.querySelector(".t-button").textContent=t("w4.processing"); }
 toast(t("w4.processing"));
 setTimeout(function(){ WZ.step=5; buildOrder(); renderWizard(); },850);
}
function buildOrder(){
 var q=quoteFor(WZ.country, totalWeight());
 var b=WZ.batchId?batchById(WZ.batchId):null;
 var nmRec=I18N["c."+WZ.country]||{ko:WZ.country,en:WZ.country};
 var routeKo=b?b.routeKo:nmRec.ko;
 var routeEn=b?b.routeEn:nmRec.en;
 var items=WZ.items.filter(function(it){return it.name.trim();}).map(function(it){return {name:it.name.trim(), weight:parseFloat(it.weight)||0, qty:parseInt(it.qty||"1",10)||1, value:parseInt((it.value||"0").replace(/[^0-9]/g,""),10)||0};});
 var no=genOrderNo(WZ.country);
 var order={ orderNo:no, tracking:no, country:WZ.country, batchId:WZ.batchId, hubKo:b?b.hubKo:"", hubEn:b?b.hubEn:"", routeKo:routeKo, routeEn:routeEn, recipient:{name:WZ.recipient.name.trim(), phone:WZ.recipient.phone.trim(), addr:WZ.recipient.addr.trim()}, items:items, weight:q.w, quote:{solo:q.solo,pooled:q.pooled,saved:q.saved,pct:q.pct}, payMethod:WZ.payMethod, stage:0, demo:true, createdAt:Date.now() };
 saveOrder(order); WZ.order=order; updateAcctBtn();
}
function orderRoute(o){return isKo()?(o.routeKo||countryName(o.country)):(o.routeEn||o.routeKo||"");}

/* 스텝5 완료 */
function step5HTML(){
 var o=WZ.order;
 return ''+
 '<div class="receipt">'+
   '<div class="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12l5 5 11-11"/></svg></div>'+
   '<div class="rtitle">'+esc(t("w5.title"))+'</div>'+
   '<div class="rsub">'+esc(t("w5.sub"))+'</div>'+
 '</div>'+
 '<div class="receipt-box">'+
   '<div class="rb-row"><span class="rb-k">'+esc(t("w5.orderNo"))+'</span><span class="rb-v big">'+esc(o.orderNo)+' <button type="button" class="copy-btn" data-copy="'+esc(o.orderNo)+'"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>'+esc(t("w5.copy"))+'</button></span></div>'+
   '<div class="rb-row"><span class="rb-k">'+esc(t("w5.route"))+'</span><span class="rb-v">'+esc(orderRoute(o))+'</span></div>'+
   '<div class="rb-row"><span class="rb-k">'+esc(t("my.recipient"))+'</span><span class="rb-v">'+esc(o.recipient.name)+'</span></div>'+
   '<div class="rb-row"><span class="rb-k">'+esc(t("w2.total"))+'</span><span class="rb-v">'+o.weight.toFixed(1)+' kg</span></div>'+
   '<div class="rb-row"><span class="rb-k">'+esc(t("my.paid"))+'</span><span class="rb-v">'+won(o.quote.pooled)+'</span></div>'+
 '</div>'+
 '<div class="receipt-share"><img src="images/qr.svg" alt="'+esc(t("w5.shareTitle"))+' QR" width="96" height="96"><div class="rs-t"><div class="h">'+esc(t("w5.shareTitle"))+'</div><div class="d">'+esc(t("w5.shareDesc"))+'</div></div></div>'+
 '<p class="quote-breakdown" style="text-align:center;margin-top:14px">'+esc(t("w5.demoSaved"))+'</p>';
}
function wireStep5(){ /* copy 처리 위임 */ }

/* 위저드 버튼 위임 */
document.getElementById("wizFoot").addEventListener("click",function(e){
 var b=e.target.closest("[data-wiz]"); if(!b) return;
 var a=b.getAttribute("data-wiz");
 if(a==="back"){ persistCurrentWizStep(); WZ.step=Math.max(1,WZ.step-1); renderWizard(); }
 else if(a==="next"){ handleNext(); }
 else if(a==="pay"){ doPay(); }
 else if(a==="close"){ closeOverlay(document.getElementById("wizardOverlay")); openMyOrders(); }
 else if(a==="track"){ var no=WZ.order?WZ.order.tracking:""; closeOverlay(document.getElementById("wizardOverlay")); runTrack(no,true); }
});
document.getElementById("wizBody").addEventListener("click",function(e){
 var cp=e.target.closest("[data-copy]"); if(cp){ copyText(cp.getAttribute("data-copy")); }
});
function handleNext(){
 if(WZ.step===1){ if(!validateStep1()) return; WZ.step=2; renderWizard(); }
 else if(WZ.step===2){ if(!validateStep2()) return; WZ.step=3; renderWizard(); }
 else if(WZ.step===3){ WZ.step=4; renderWizard(); }
}
function persistCurrentWizStep(){
 if(!WZ) return;
 if(WZ.step===1){ persistStep1(); }
 else if(WZ.step===2){ var rows=document.querySelectorAll("#itemsWrap .item-row"); rows.forEach(function(row){ var idx=parseInt(row.getAttribute("data-idx"),10); WZ.items[idx]={name:row.querySelector(".it-name").value, weight:row.querySelector(".it-weight").value, qty:row.querySelector(".it-qty").value, value:row.querySelector(".it-value").value}; }); }
}
function copyText(txt){
 function done(){ toast(t("w5.copied")); }
 try{ if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(txt).then(done,function(){fallbackCopy(txt);done();}); } else { fallbackCopy(txt); done(); } }catch(e){ fallbackCopy(txt); done(); }
}
function fallbackCopy(txt){ var ta=document.createElement("textarea"); ta.value=txt; ta.style.position="fixed"; ta.style.opacity="0"; document.body.appendChild(ta); ta.select(); try{document.execCommand("copy");}catch(e){} document.body.removeChild(ta); }

/* ============================================================
   6) 배송추적
   ============================================================ */
var STAGE_KEYS=["t1","t2","t3","t4","t5","t6"];
function timelineHTML(stage){
 var h='<div class="vtimeline">';
 for(var i=0;i<6;i++){
   var cls=i<stage?"done":(i===stage?(stage>=5?"done":"now"):"wait");
   if(stage>=5) cls="done";
   var stat=cls==="done"?t("tr.status.done"):(cls==="now"?t("tr.status.now"):t("tr.status.wait"));
   var ic=cls==="done"?'<path d="M5 12l4 4 10-10"/>':'<circle cx="12" cy="12" r="3.4"/>';
   h+='<div class="vt-node '+cls+'"><div class="vdot"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">'+ic+'</svg></div><div class="vmain"><div class="vtt">'+esc(t(STAGE_KEYS[i]))+'</div><div class="vts">'+esc(stat)+'</div></div></div>';
 }
 return h+'</div>';
}
function trackResultHTML(no, route, stage){
 return '<div class="track-meta"><span class="t-caption">'+esc(t("trk.resultFor"))+'</span> <span class="no">'+esc(no)+'</span></div>'+
   (route?'<p class="track-hint" style="margin:-10px 0 18px">'+esc(route)+' · '+esc(t("trk.demoState"))+'</p>':'')+
   timelineHTML(stage);
}
function runTrack(raw, scroll){
 var no=(raw||"").trim().toUpperCase();
 var alertBox=document.getElementById("trackAlert"); var result=document.getElementById("trackResult"); var input=document.getElementById("trackInput");
 if(input) input.value=no;
 alertBox.classList.remove("show");
 if(!no){ result.innerHTML=""; return; }
 var o=findOrder(no);
 if(o){ result.innerHTML=trackResultHTML(o.orderNo, orderRoute(o), o.stage||0); }
 else if(SAMPLES[no]){ var s=SAMPLES[no]; result.innerHTML=trackResultHTML(no, isKo()?s.routeKo:s.routeEn, s.stage); }
 else { result.innerHTML=""; alertBox.classList.add("show"); }
 if(scroll){ var sec=document.getElementById("track"); if(sec) sec.scrollIntoView({behavior:"smooth",block:"start"}); }
}
(function initTrack(){
 var form=document.getElementById("trackForm");
 if(form){ form.addEventListener("submit",function(e){ e.preventDefault(); runTrack(document.getElementById("trackInput").value,false); }); }
 document.querySelectorAll("[data-sample]").forEach(function(s){ s.addEventListener("click",function(){ runTrack(s.textContent,false); }); });
})();

/* ============================================================
   7) 마이페이지(주문내역) · 주문상세
   ============================================================ */
function openPanel(titleKey, bodyHTML){
 document.getElementById("panelTitle").textContent=t(titleKey);
 document.getElementById("panelTitle").setAttribute("data-title-key",titleKey);
 document.getElementById("panelBody").innerHTML=bodyHTML;
 openOverlay(document.getElementById("panelOverlay"));
}
var PANEL=null; // {kind, data}
function openMyOrders(){
 PANEL={kind:"orders"};
 var orders=getOrders();
 var body;
 if(!orders.length){
   body='<div class="empty-state"><div class="eic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7l9-4 9 4v10l-9 4-9-4V7z"/><path d="M3 7l9 4 9-4"/><path d="M12 11v10"/></svg></div><div class="et">'+esc(t("my.empty.t"))+'</div><div class="ed">'+esc(t("my.empty.d"))+'</div><button class="btn btn-primary" data-panelact="send"><span class="t-button">'+esc(t("my.empty.cta"))+'</span></button></div>';
 } else {
   body='<div class="orders-list">'+orders.map(function(o){
     var st=Math.min(5,o.stage||0); var stName=t(STAGE_KEYS[st]);
     return '<button type="button" class="order-item" data-order="'+esc(o.orderNo)+'"><span class="ofl">'+((countryByCode(o.country)||{flag:"📦"}).flag)+'</span><span class="omain"><span class="ono">'+esc(o.orderNo)+'</span><span class="oroute">'+esc(orderRoute(o))+'</span></span><span class="ostat"><span class="d"></span>'+esc(stName)+'</span><span class="ochev"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg></span></button>';
   }).join("")+'</div>';
 }
 openPanel("my.title", body);
}
function openOrderDetail(no){
 var o=findOrder(no); if(!o){ openMyOrders(); return; }
 PANEL={kind:"orderDetail", data:no};
 var itemsHtml=o.items.map(function(it){ return '<div class="quote-row"><span class="ql">'+esc(it.name)+(it.qty>1?' ×'+it.qty:'')+'</span><span class="qv">'+it.weight.toFixed(1)+' kg</span></div>'; }).join("");
 var body=''+
   timelineHTML(Math.min(5,o.stage||0))+
   '<div class="sec-label" style="margin-top:20px">'+esc(t("my.recipient"))+'</div>'+
   '<div class="receipt-box"><div class="rb-row"><span class="rb-k">'+esc(t("w5.tracking"))+'</span><span class="rb-v big">'+esc(o.tracking)+' <button type="button" class="copy-btn" data-copy="'+esc(o.tracking)+'"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>'+esc(t("w5.copy"))+'</button></span></div>'+
   '<div class="rb-row"><span class="rb-k">'+esc(t("w5.route"))+'</span><span class="rb-v">'+esc(orderRoute(o))+'</span></div>'+
   '<div class="rb-row"><span class="rb-k">'+esc(t("acct.name"))+'</span><span class="rb-v">'+esc(o.recipient.name)+'</span></div>'+
   '<div class="rb-row"><span class="rb-k">'+esc(t("acct.phone"))+'</span><span class="rb-v">'+esc(o.recipient.phone)+'</span></div>'+
   '<div class="rb-row"><span class="rb-k">'+esc(t("w1.addr"))+'</span><span class="rb-v" style="max-width:60%">'+esc(o.recipient.addr)+'</span></div>'+
   '</div>'+
   '<div class="sec-label" style="margin-top:20px">'+esc(t("my.items"))+'</div>'+
   '<div class="quote-panel">'+itemsHtml+'<div class="quote-row"><span class="ql"><b>'+esc(t("my.paid"))+'</b></span><span class="qv"><b>'+won(o.quote.pooled)+'</b></span></div><div class="quote-row"><span class="ql">'+esc(t("my.saved"))+'</span><span class="qv" style="color:var(--color-seed)">-'+won(o.quote.saved)+'</span></div></div>'+
   '<button class="btn btn-primary" style="width:100%;margin-top:20px" data-panelact="track" data-no="'+esc(o.tracking)+'"><span class="t-button">'+esc(t("w5.trackBtn"))+'</span></button>';
 openPanel("my.detailTitle", body);
}

/* ============================================================
   8) 계정 / 로그인 (데모)
   ============================================================ */
function openAccount(){
 var u=getUser();
 if(u){
   PANEL={kind:"account"};
   var init=(u.name||"?").trim().charAt(0).toUpperCase();
   var body='<div class="acct-user"><div class="av">'+esc(init)+'</div><div><div class="un">'+esc(u.name)+'</div><div class="up">'+esc(u.phone)+'</div></div></div>'+
     '<button class="btn btn-primary" style="width:100%;margin-bottom:10px" data-panelact="myorders"><span class="t-button">'+esc(t("acct.myOrdersBtn"))+'</span></button>'+
     '<button class="btn btn-ghost" style="width:100%;margin-bottom:16px" data-panelact="leader"><span class="t-button" style="color:var(--color-seed)">'+esc(t("ld.applyBtn"))+'</span></button>'+
     '<button class="btn btn-ghost" style="width:100%" data-panelact="logout"><span class="t-button" style="color:var(--color-accentStrong)">'+esc(t("acct.logout"))+'</span></button>'+
     '<p class="quote-breakdown" style="text-align:center;margin-top:16px">'+esc(t("acct.demoNote"))+'</p>';
   openPanel("acct.myTitle", body);
 } else {
   PANEL={kind:"login", data:{name:"",phone:""}};
   renderLogin();
 }
}
function renderLogin(){
 var d=PANEL.data||{name:"",phone:""};
 var body='<p class="acct-lead">'+esc(t("acct.loginLead"))+'</p>'+
   '<div class="field" id="lg-fname"><label for="lg-name">'+esc(t("acct.name"))+'<span class="req">*</span></label><input id="lg-name" type="text" value="'+esc(d.name)+'"><div class="err">'+esc(t("acct.err.name"))+'</div></div>'+
   '<div class="field" id="lg-fphone"><label for="lg-phone">'+esc(t("acct.phone"))+'<span class="req">*</span></label><input id="lg-phone" type="tel" inputmode="tel" value="'+esc(d.phone)+'"><div class="err">'+esc(t("acct.err.phone"))+'</div></div>'+
   '<button class="btn btn-primary" style="width:100%;margin-top:6px" data-panelact="dologin"><span class="t-button">'+esc(t("acct.loginBtn"))+'</span></button>'+
   '<button class="btn btn-ghost" style="width:100%;margin-top:10px" data-panelact="myorders"><span class="t-button" style="color:var(--color-seed)">'+esc(t("acct.myOrdersBtn"))+'</span></button>'+
   '<p class="quote-breakdown" style="text-align:center;margin-top:16px">'+esc(t("acct.demoNote"))+'</p>';
 openPanel("acct.loginTitle", body);
 var n=document.getElementById("lg-name"), p=document.getElementById("lg-phone");
 if(n) n.addEventListener("input",function(){PANEL.data.name=n.value;});
 if(p) p.addEventListener("input",function(){PANEL.data.phone=p.value;});
}
function doLogin(){
 var n=document.getElementById("lg-name"), p=document.getElementById("lg-phone"); var ok=true;
 if(!n.value.trim()){document.getElementById("lg-fname").classList.add("invalid");ok=false;} else document.getElementById("lg-fname").classList.remove("invalid");
 if(!p.value.trim()){document.getElementById("lg-fphone").classList.add("invalid");ok=false;} else document.getElementById("lg-fphone").classList.remove("invalid");
 if(!ok) return;
 setUser({name:n.value.trim(), phone:p.value.trim()}); updateAcctBtn();
 toast(t("acct.welcome")+", "+n.value.trim());
 openAccount();
}
function doLogout(){ setUser(null); updateAcctBtn(); closeOverlay(document.getElementById("panelOverlay")); toast(t("acct.logout")); }
function updateAcctBtn(){
 var who=document.getElementById("acctWho"); if(!who) return;
 var u=getUser();
 who.textContent=u?u.name:t("acct.loginNav");
}

/* ============================================================
   9) 동네 리더 신청 (데모)
   ============================================================ */
function openLeader(){
 PANEL={kind:"leader", data:{name:(getUser()||{}).name||"", region:"", lang:"", contact:(getUser()||{}).phone||""}};
 renderLeader();
}
function renderLeader(){
 var d=PANEL.data;
 var langs=[["ne","c.np"],["km","c.kh"],["vi","c.vn"],["id","c.id"],["fil","c.ph"],["en","nav.faq"]];
 // 언어 옵션은 스크립트 언어명으로 — 간단히 국가/언어 라벨 재사용
 var langOpts='<option value=""></option>'+
   '<option value="ne">नेपाली</option><option value="km">ខ្មែរ</option><option value="vi">Tiếng Việt</option><option value="id">Bahasa Indonesia</option><option value="fil">Filipino</option><option value="en">English</option>';
 var body='<p class="acct-lead">'+esc(t("ld.formLead"))+'</p>'+
   '<div class="field" id="ld-fname"><label for="ld-name">'+esc(t("acct.name"))+'<span class="req">*</span></label><input id="ld-name" type="text" value="'+esc(d.name)+'"><div class="err">'+esc(t("acct.err.name"))+'</div></div>'+
   '<div class="field" id="ld-fregion"><label for="ld-region">'+esc(t("ld.fRegion"))+'<span class="req">*</span></label><input id="ld-region" type="text" value="'+esc(d.region)+'" placeholder="'+esc(t("ld.fRegion.ph"))+'"><div class="err">'+esc(t("ld.err.region"))+'</div></div>'+
   '<div class="field"><label for="ld-lang">'+esc(t("ld.fLang"))+'</label><select id="ld-lang">'+langOpts+'</select></div>'+
   '<div class="field" id="ld-fcontact"><label for="ld-contact">'+esc(t("ld.fContact"))+'<span class="req">*</span></label><input id="ld-contact" type="tel" inputmode="tel" value="'+esc(d.contact)+'"><div class="err">'+esc(t("ld.err.contact"))+'</div></div>'+
   '<button class="btn btn-primary" style="width:100%;margin-top:4px" data-panelact="dolead"><span class="t-button">'+esc(t("ld.submit"))+'</span></button>';
 openPanel("ld.formTitle", body);
 var n=document.getElementById("ld-name"), r=document.getElementById("ld-region"), l=document.getElementById("ld-lang"), c=document.getElementById("ld-contact");
 if(l) l.value=d.lang||"";
 n&&n.addEventListener("input",function(){d.name=n.value;});
 r&&r.addEventListener("input",function(){d.region=r.value;});
 l&&l.addEventListener("change",function(){d.lang=l.value;});
 c&&c.addEventListener("input",function(){d.contact=c.value;});
}
function doLeader(){
 var d=PANEL.data; var ok=true;
 if(!document.getElementById("ld-name").value.trim()){document.getElementById("ld-fname").classList.add("invalid");ok=false;} else document.getElementById("ld-fname").classList.remove("invalid");
 if(!document.getElementById("ld-region").value.trim()){document.getElementById("ld-fregion").classList.add("invalid");ok=false;} else document.getElementById("ld-fregion").classList.remove("invalid");
 if(!document.getElementById("ld-contact").value.trim()){document.getElementById("ld-fcontact").classList.add("invalid");ok=false;} else document.getElementById("ld-fcontact").classList.remove("invalid");
 if(!ok) return;
 saveLeader({name:document.getElementById("ld-name").value.trim(), region:document.getElementById("ld-region").value.trim(), lang:document.getElementById("ld-lang").value, contact:document.getElementById("ld-contact").value.trim(), createdAt:Date.now()});
 PANEL={kind:"leaderDone"};
 var body='<div class="mini-success"><div class="ms-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12l5 5 11-11"/></svg></div><div class="ms-t">'+esc(t("ld.successT"))+'</div><div class="ms-d">'+esc(t("ld.successD"))+'</div></div>';
 openPanel("ld.formTitle", body);
}

/* ============================================================
   10) 패널 내부 액션 위임
   ============================================================ */
document.getElementById("panelBody").addEventListener("click",function(e){
 var cp=e.target.closest("[data-copy]"); if(cp){ copyText(cp.getAttribute("data-copy")); return; }
 var od=e.target.closest("[data-order]"); if(od){ openOrderDetail(od.getAttribute("data-order")); return; }
 var b=e.target.closest("[data-panelact]"); if(!b) return;
 var a=b.getAttribute("data-panelact");
 if(a==="send"){ closeOverlay(document.getElementById("panelOverlay")); openWizard({}); }
 else if(a==="myorders"){ openMyOrders(); }
 else if(a==="leader"){ openLeader(); }
 else if(a==="logout"){ doLogout(); }
 else if(a==="dologin"){ doLogin(); }
 else if(a==="dolead"){ doLeader(); }
 else if(a==="track"){ var no=b.getAttribute("data-no"); closeOverlay(document.getElementById("panelOverlay")); runTrack(no,true); }
});

/* ============================================================
   11) 전역 data-action 위임(랜딩 CTA/헤더/카드/지도)
   ============================================================ */
document.addEventListener("click",function(e){
 var a=e.target.closest("[data-action]"); if(!a) return;
 var act=a.getAttribute("data-action");
 if(act==="send"){ e.preventDefault(); openWizard({}); }
 else if(act==="join"){ e.preventDefault(); var card=a.closest("[data-batch-id]"); openWizard({batchId: card?card.getAttribute("data-batch-id"):""}); }
 else if(act==="myorders"){ e.preventDefault(); openMyOrders(); }
 else if(act==="account"){ e.preventDefault(); openAccount(); }
 else if(act==="leader"){ e.preventDefault(); openLeader(); }
 else if(act==="close-wizard"){ e.preventDefault(); closeOverlay(document.getElementById("wizardOverlay")); }
 else if(act==="close-panel"){ e.preventDefault(); closeOverlay(document.getElementById("panelOverlay")); }
});

/* ============================================================
   12) 지도 팝업(거점→활성 공동구매→위저드)
   ============================================================ */
function hubPopupHTML(hubName){
 var bs=BATCHES.filter(function(b){return b.hubKo===hubName;});
 var h='<div class="pop-hub">'+esc(hubName)+'</div>';
 if(!bs.length){ h+='<div class="pop-none">'+esc(t("map.noBatch"))+'</div>'; return h; }
 h+=bs.map(function(b){
   return '<span class="pop-batch"><span class="pr">'+esc(batchRoute(b))+'</span><span class="ps">'+esc(t("gb.deadline"))+' '+fmtDeadline(b.deadlineH)+' · '+b.people+esc(t("common.people"))+'</span><button type="button" class="pop-join" data-batch="'+b.id+'">'+esc(t("map.joinFromHub"))+'</button></span>';
 }).join("");
 return h;
}
window.__bindHubPopups=function(){
 var mk=window.__hubMarkers; if(!mk||!window.L) return;
 Object.keys(mk).forEach(function(name){ try{ mk[name].bindPopup(hubPopupHTML(name),{maxWidth:260}); }catch(e){} });
};
if(window.__hubMarkers) window.__bindHubPopups();
// 지도 팝업 내 조인 버튼(위임)
document.addEventListener("click",function(e){
 var j=e.target.closest(".pop-join"); if(!j) return;
 e.preventDefault(); openWizard({batchId:j.getAttribute("data-batch")});
});

/* ============================================================
   13) 언어 변경 시 동적 화면 재렌더 + 계정버튼 갱신
   ============================================================ */
window.__langHooks.push(function(){
 updateAcctBtn();
 // 위저드 열려 있으면 현재 스텝 재렌더(입력값 보존)
 var wo=document.getElementById("wizardOverlay");
 if(wo.classList.contains("open") && WZ){ persistCurrentWizStep(); renderWizard(); }
 // 패널 재렌더
 var po=document.getElementById("panelOverlay");
 if(po.classList.contains("open") && PANEL){
   if(PANEL.kind==="orders") openMyOrders();
   else if(PANEL.kind==="orderDetail") openOrderDetail(PANEL.data);
   else if(PANEL.kind==="account"||PANEL.kind==="login") openAccount();
   else if(PANEL.kind==="leader") renderLeader();
   else if(PANEL.kind==="leaderDone"){ var tk=document.getElementById("panelTitle").getAttribute("data-title-key"); document.getElementById("panelTitle").textContent=t(tk||"ld.formTitle"); }
 }
 // 추적 결과 재렌더(현재 입력 기준)
 var input=document.getElementById("trackInput");
 if(input && input.value.trim() && document.getElementById("trackResult").innerHTML){ runTrack(input.value,false); }
 // 지도 팝업 다시 바인딩
 if(window.__bindHubPopups) try{window.__bindHubPopups();}catch(e){}
});

/* ============================================================
   14) 초기화: 신규 키 반영 재적용 + 딥링크(?track=)
   ============================================================ */
applyLang(document.documentElement.lang||"ko");
updateAcctBtn();
(function initDeep(){
 try{ var q=new URLSearchParams(location.search).get("track"); if(q){ setTimeout(function(){ runTrack(q,true); },300); } }catch(e){}
})();

})();
