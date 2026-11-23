const DETAIL_HEADERS = [
  'STT',
  'Tên địa điểm / quán',
  'Phân loại',
  'Địa chỉ',
  'Khu vực',
  'Đánh giá ★',
  'Tầm giá (VNĐ/người)',
  'Giờ mở cửa',
  'Món nổi bật / Menu gợi ý',
  'Ghi chú & Tip',
  'Google Maps (bấm để mở)',
  'Phù hợp với / Đi khi nào / Bao lâu / Cách trung tâm',
] as const;

const ACTIVITY_HEADERS = [...DETAIL_HEADERS.slice(0, 8), 'Món nổi bật / Hoạt động gợi ý', ...DETAIL_HEADERS.slice(9)];

export const DETAIL_SHEETS = [
  { name: '1_Du_Lich_Tham_Quan', category: 'sightseeing-nature', headers: DETAIL_HEADERS },
  { name: '2_Bien_Thien_Nhien', category: 'sightseeing-nature', headers: DETAIL_HEADERS },
  { name: '3_An_Dac_San', category: 'food-dining', headers: DETAIL_HEADERS },
  { name: '4_Hai_San_Nha_Hang', category: 'food-dining', headers: DETAIL_HEADERS },
  { name: '5_Cafe_Checkin', category: 'cafe-checkin', headers: DETAIL_HEADERS },
  { name: '6_Cho_An_Vat_Dem', category: 'food-dining', headers: DETAIL_HEADERS },
  { name: '7_Vui_Choi_Giai_Tri', category: 'entertainment', headers: DETAIL_HEADERS },
  {
    name: '8_An_Vat_Sinh_Vien',
    category: 'food-dining',
    headers: [
      ...DETAIL_HEADERS.slice(0, 1),
      'Tên quán / món',
      ...DETAIL_HEADERS.slice(2, 6),
      'Tầm giá (VNĐ/phần)',
      ...DETAIL_HEADERS.slice(7),
    ],
  },
  {
    name: '9_Khach_San_Homestay',
    category: 'accommodation',
    headers: [
      ...DETAIL_HEADERS.slice(0, 1),
      'Tên khách sạn / homestay',
      ...DETAIL_HEADERS.slice(2, 6),
      'Tầm giá (VNĐ/đêm)',
      'Check-in / Giờ',
      'Tiện ích nổi bật',
      ...DETAIL_HEADERS.slice(9),
    ],
  },
  { name: '10_GenZ_Game_Giai_Tri', category: 'entertainment', headers: ACTIVITY_HEADERS },
  { name: '11_Hoa_Bac_Lang_Ngam_Canh', category: 'sightseeing-nature', headers: ACTIVITY_HEADERS },
] as const;

export const COVER_SHEET = 'TRANG BIA';
export const LOC_SHEET = 'LOC_THEO_KHU_VUC';
export const EDITORIAL_SHEET = 'TOP_PICKS_LICH_TRINH';

export const LOC_HEADER_ROW = 14;
export const LOC_HEADERS = [
  'STT',
  'Khu vực',
  'Tên địa điểm / quán',
  'Sheet gốc',
  'Phân loại',
  'Đánh giá ★',
  'Tầm giá',
  'Địa chỉ',
  'Trạng thái',
];

export const AREA_IDS = {
  'Sơn Trà': 'son-tra',
  'Hải Châu': 'hai-chau',
  'Thanh Khê': 'thanh-khe',
  'Liên Chiểu': 'lien-chieu',
  'Ngũ Hành Sơn': 'ngu-hanh-son',
  'Cẩm Lệ': 'cam-le',
  'Hòa Vang': 'hoa-vang',
  'Gần Đà Nẵng': 'near-da-nang',
} as const;

export const STATUSES = {
  'Đang hoạt động': 'ACTIVE',
  'KHÔNG XÁC MINH ĐƯỢC': 'UNVERIFIED',
  'TẠM DỪNG/CẢNH BÁO': 'WARNING',
  'ĐÃ ĐÓNG/CẤM': 'CLOSED_BANNED',
} as const;

export const EDITORIAL_RANGES = {
  quickTripIdeas: [2, 6],
  topPicks: [8, 18],
  itinerary: [20, 22],
  travelTips: [23, 24],
} as const;
