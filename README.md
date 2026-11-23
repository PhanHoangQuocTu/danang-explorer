# Cẩm nang Đà Nẵng · Đà Nẵng Travel Guide

Cẩm nang song ngữ để khám phá địa điểm ăn uống, tham quan, vui chơi và lưu trú ở Đà Nẵng và vùng lân cận. Giao diện mặc định là tiếng Việt. Người dùng có thể chuyển sang tiếng Anh, còn nội dung từ workbook giữ nguyên văn.

[Website](https://dn-explorer.phanhoangquoctu.io.vn) · [Mã nguồn](https://github.com/PhanHoangQuocTu/danang-explorer) · [Báo lỗi](https://github.com/PhanHoangQuocTu/danang-explorer/issues)

## Chức năng

| Tiếng Việt | Tiếng Anh | Chức năng |
| --- | --- | --- |
| `/` | `/en` | Giới thiệu, tìm kiếm nhanh, danh mục và khu vực |
| `/explore` | `/en/explore` | Tìm kiếm bỏ dấu, lọc và phân trang 24 địa điểm. Chuyển Grid, List hoặc Table và chia sẻ URL đã lọc |
| `/places/[id]` | `/en/places/[id]` | Chi tiết theo ID, thông tin gốc và liên kết Google Maps hợp lệ nếu có |
| `/areas`, `/areas/[areaId]` | `/en/areas`, `/en/areas/[areaId]` | Tám khu vực chuẩn, mô tả gốc và số địa điểm tính từ dữ liệu hiện tại |
| `/trip-ideas` | `/en/trip-ideas` | Gợi ý chuyến đi, nhóm đề xuất, lịch trình và lưu ý từ workbook |
| `/insights` | `/en/insights` | Số liệu theo danh mục, khu vực, trạng thái và điểm đánh giá. Có bảng dữ liệu đi kèm biểu đồ |

**Cập nhật dữ liệu** yêu cầu server tải lại workbook cho trang hiện tại, giữ URL, bộ lọc và lịch sử điều hướng. Nút có thời gian chờ 60 giây trong trình duyệt. Khi nguồn lỗi, trang hiển thị trạng thái lỗi và cho phép thử lại.

## Chạy local

Dùng Node **26.13.1** theo [.nvmrc](.nvmrc) và pnpm **12.23.0** theo [package.json](package.json).

```bash
npm install --global corepack@0.36.0
corepack enable
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm dev
```

Trong PowerShell, dùng `Copy-Item .env.example .env.local` để tạo file môi trường. Dev server chạy tại <http://localhost:3000>. Chạy `pnpm storybook` để mở Storybook tại <http://localhost:6006>.

| Biến | Mục đích |
| --- | --- |
| `NEXT_PUBLIC_APP_ENV` | `development`, `staging` hoặc `production`. Local và Preview dùng noindex |
| `NEXT_PUBLIC_APP_URL` | Origin công khai, không có dấu slash cuối. Dùng cho canonical, hreflang, sitemap và metadata chia sẻ |
| `NEXT_PUBLIC_API_URL` | Origin cho mẫu BFF `/api/posts` và rewrite `/proxy/*`. Mặc định là JSONPlaceholder |

Các biến `NEXT_PUBLIC_*` được đưa vào bản build. Dùng [.env.example](.env.example) để cấu hình local và giữ bí mật ngoài các biến công khai.

## Dữ liệu và kiến trúc

- Next.js App Router, React, TypeScript, Tailwind CSS, shadcn/ui, next-intl và Recharts. Luồng dữ liệu du lịch chạy trong một ứng dụng Next.js trên Vercel.
- `src/lib/travel-data/source/` tải XLSX công khai từ Google Sheets bằng `no-store`. Parser và chuẩn hóa chạy phía server, cung cấp dữ liệu cho các module trang qua loader dùng chung. Các trang xử lý riêng lỗi nguồn, dữ liệu rỗng và ID không tồn tại.
- `src/app/[locale]/` khai báo route và metadata. `src/modules/` chứa giao diện theo trang. `src/components/` chứa layout, provider và UI dùng chung. `src/messages/` lưu bản dịch giao diện với key được kiểm tra kiểu.
- `/api/health` là liveness probe, không gọi upstream. `/health` và `/en/health` hiển thị trạng thái app và ví dụ BFF. Danh sách ví dụ phụ thuộc API đã cấu hình. Các route du lịch sử dụng nguồn workbook riêng.
- `src/config/site.ts` dùng tên và mô tả mặc định từ tiếng Việt cho manifest và ảnh chia sẻ. Metadata của trang lấy bản dịch theo locale.
- Các phase, hợp đồng nghiệp vụ và bằng chứng triển khai được ghi trong [phase map](docs/implementation/phase-map.md).

## Kiểm tra và production build

```bash
pnpm lint
pnpm format:check
pnpm type-check
pnpm test
pnpm build
pnpm build-storybook
```

`pnpm check` chạy lint, type-check và test. `pnpm test:coverage` tạo báo cáo coverage. Test workbook dùng fixture hoặc mock và chạy offline. Khi kiểm tra release, dùng thêm browser và smoke test riêng với nguồn Google.

- **Windows** dùng `pnpm build` rồi `pnpm start` để phục vụ bản build.
- **Docker** dùng `docker compose up --build` để chạy app sau nginx tại <http://localhost:8080>. Image Linux dùng Next.js standalone, chạy non-root và health check qua `/api/health`.
- **CI và Vercel** dùng GitHub Actions để kiểm tra chất lượng, app, Storybook và Docker. GitLab CI có quy trình build registry riêng. Dùng [release runbook](docs/implementation/phase-08-release-runbook.md) để xác minh Preview, SEO production, nguồn dữ liệu và rollback.

## Đóng góp

Xem [CONTRIBUTING.md](CONTRIBUTING.md) và [AGENTS.md](AGENTS.md) để biết quy ước code, dịch, Storybook và Git hooks. Frozen lockfile, chính sách tuổi package tối thiểu 24 giờ và allowlist install script được duy trì trong pnpm. [Mã nguồn MIT](LICENSE) · [Giấy phép font Geist](src/assets/fonts/LICENSE.txt).
