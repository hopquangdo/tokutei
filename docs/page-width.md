# Chiều ngang nội dung page (full width mặc định)

## Quy ước

- Vùng nội dung chính dùng **`.app-page-shell`** (trong `AppShell`): `width: 100%`, `max-width: 100%`, `min-width: 0`, padding ngang theo `--app-content-pad` (hiện **0** — tràn full chiều ngang cột main; thêm lề cục bộ bằng `px-*` nếu cần).
- **Gốc nội dung từng route** nên dùng **`.app-page-body`** trên phần tử bọc ngoài cùng của page: `w-full` + `max-width: 100%` + `min-width: 0` (không tự thêm `max-w-5xl`, `max-w-2xl`, … trừ trường hợp dưới).

## Khi nào được dùng `max-w-*`?

- **Form đăng nhập / card một cột** (ví dụ `max-w-md` quanh form).
- **Đoạn mô tả dễ đọc** (ví dụ `max-w-2xl` trên `p` mô tả hero, `PageHeader` description) — giới hạn **khối chữ**, không phải toàn page.
- **Bong bóng chat / cột nội dung** bên trong layout — giới hạn theo từng thành phần, không cắt cả màn hình trái phải.

## CSS liên quan

- `src/styles/willtec-theme.css`: `.app-page-shell`, `.app-page-body`

## Cập nhật thủ công

Nếu thêm page mới: bọc bằng `className="app-page-body ..."` (kèm `w-full` nếu dùng Tailwind). Tránh `max-w-*` ở root page trừ ngoại lệ trên.
