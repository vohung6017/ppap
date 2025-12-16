# Hướng dẫn Flexbox và Grid CSS

## Mục lục
1. [Flexbox cơ bản](#1-flexbox-cơ-bản)
2. [Grid cơ bản](#2-grid-cơ-bản)
3. [Khi nào dùng Flexbox vs Grid](#3-khi-nào-dùng-flexbox-vs-grid)
4. [Layout bình thường (page có thể scroll)](#4-layout-bình-thường-page-có-thể-scroll)
5. [Layout full-page (không scroll page)](#5-layout-full-page-không-scroll-page)
6. [Bootstrap Flex Utilities](#6-bootstrap-flex-utilities)

---

## 1. Flexbox cơ bản

### Bật Flexbox
```css
.container {
    display: flex;
}
```

### Hướng sắp xếp (flex-direction)
```css
flex-direction: row;      /* Ngang → (mặc định) */
flex-direction: column;   /* Dọc ↓ */
```

```
row:                    column:
┌───┬───┬───┐           ┌───┐
│ 1 │ 2 │ 3 │           │ 1 │
└───┴───┴───┘           ├───┤
                        │ 2 │
                        ├───┤
                        │ 3 │
                        └───┘
```

### Thuộc tính flex (trên item con)

| Thuộc tính | Ý nghĩa |
|------------|---------|
| `flex-grow` | Tỷ lệ **giãn ra** khi có không gian thừa |
| `flex-shrink` | Tỷ lệ **co lại** khi không đủ chỗ |
| `flex-basis` | Kích thước **ban đầu** trước khi grow/shrink |

**Shorthand:**
```css
flex: <grow> <shrink> <basis>;
flex: 1;        /* = flex: 1 1 0% */
flex: 1 1 auto; /* Grow, shrink, basis = auto */
flex: 0 0 auto; /* Không grow, không shrink = kích thước cố định */
```

### Ví dụ tỷ lệ
```css
.item-1 { flex: 1; }  /* 1/3 = 33.3% */
.item-2 { flex: 2; }  /* 2/3 = 66.7% */
```

```
┌─────────────┬───────────────────────────┐
│  flex: 1    │         flex: 2           │
│   33.3%     │          66.7%            │
└─────────────┴───────────────────────────┘
```

---

## 2. Grid cơ bản

### Bật Grid
```css
.container {
    display: grid;
    grid-template-columns: repeat(3, 1fr); /* 3 cột bằng nhau */
    gap: 10px;
}
```

```
┌─────────┬─────────┬─────────┐
│  1fr    │  1fr    │  1fr    │
├─────────┼─────────┼─────────┤
│         │         │         │
└─────────┴─────────┴─────────┘
```

### Responsive Grid
```css
grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
/* Tự động tạo cột, mỗi cột tối thiểu 200px, tối đa 1fr */
```

---

## 3. Khi nào dùng Flexbox vs Grid

| Tình huống | Dùng |
|------------|------|
| Layout **1 chiều** (chỉ ngang HOẶC dọc) | **Flexbox** |
| Layout **2 chiều** (cả ngang VÀ dọc) | **Grid** |
| Phân chia **tỷ lệ** giữa các phần | **Flexbox** |
| Tạo **grid đều đặn** (cards, gallery) | **Grid** |
| Căn chỉnh nội dung trong container | **Flexbox** |
| Layout phức tạp với rows và columns | **Grid** |

### Minh họa: FLEXBOX - Layout 1 chiều

```
FLEXBOX ROW (navbar, button group, header):
┌──────────────────────────────────────────────────────────┐
│  ┌──────┐  ┌──────┐  ┌──────┐           ┌──────────────┐ │
│  │ Logo │  │ Menu │  │ Menu │    ←→     │    Search    │ │
│  └──────┘  └──────┘  └──────┘           └──────────────┘ │
└──────────────────────────────────────────────────────────┘
     ↑ Items xếp theo 1 hàng, tự động căn chỉnh

FLEXBOX COLUMN (page layout, sidebar):
┌─────────────────────┐
│ ┌─────────────────┐ │
│ │     Header      │ │ ← flex-shrink: 0
│ └─────────────────┘ │
│ ┌─────────────────┐ │
│ │     Filter      │ │ ← flex-shrink: 0
│ └─────────────────┘ │
│ ┌─────────────────┐ │
│ │                 │ │
│ │     Table       │ │ ← flex: 1 (fill remaining)
│ │                 │ │
│ └─────────────────┘ │
└─────────────────────┘
  ↑ Items xếp theo 1 cột, phân chia không gian dọc
```

### Minh họa: GRID - Layout 2 chiều

```
GRID - Cards/Gallery (đều đặn):
┌─────────┬─────────┬─────────┬─────────┐
│  Card   │  Card   │  Card   │  Card   │
│   1     │   2     │   3     │   4     │
├─────────┼─────────┼─────────┼─────────┤
│  Card   │  Card   │  Card   │  Card   │
│   5     │   6     │   7     │   8     │
└─────────┴─────────┴─────────┴─────────┘
  ↑ Các ô cùng kích thước, tự động wrap

GRID - Dashboard layout phức tạp:
┌─────────────────────┬───────────┐
│                     │           │
│      Chart 1        │  Stats    │
│                     │           │
├──────────┬──────────┼───────────┤
│  Chart 2 │ Chart 3  │   List    │
│          │          │           │
└──────────┴──────────┴───────────┘
  ↑ Định nghĩa cả rows VÀ columns, span nhiều ô
```

### Khi nào dùng cái nào?

```
Navigation bar?        → FLEXBOX (1 hàng)
Page layout dọc?       → FLEXBOX (1 cột)  
Phân chia tỷ lệ?       → FLEXBOX (flex: 1, flex: 2)
Cards gallery?         → GRID (repeat, auto-fill)
Dashboard phức tạp?    → GRID (grid-template-areas)
Form inputs?           → GRID (2 cột: label + input)
```

---

## 4. Layout bình thường (page có thể scroll)

Khi **không cần giữ page cố định**, chỉ cần:

```css
.container {
    display: flex;
    flex-direction: column;
    /* KHÔNG cần height cố định */
    /* KHÔNG cần overflow: hidden */
}

.section {
    /* Kích thước tự động theo nội dung */
    /* Hoặc dùng min-height nếu muốn tối thiểu */
    min-height: 300px;
}
```

```html
<div class="container">
    <div class="section">Section 1 - tự giãn theo content</div>
    <div class="section">Section 2 - tự giãn theo content</div>
</div>
<!-- Page sẽ scroll nếu tổng content > viewport -->
```

---

## 5. Layout full-page (không scroll page)

Khi cần **page không scroll, content fit viewport**:

### Bước 1: Container = viewport height
```css
.wrapper {
    height: 100vh;           /* Chiếm toàn bộ viewport */
    display: flex;
    flex-direction: column;
    overflow: hidden;        /* Ngăn scroll page */
}
```

### Bước 2: Section cố định (header, filter)
```css
.header, .filter {
    flex-shrink: 0;  /* KHÔNG co lại */
    /* Hoặc dùng flex: 0 0 auto; */
}
```

### Bước 3: Section fill remaining (main content)
```css
.main-content {
    flex: 1 1 auto;  /* Grow để fill */
    min-height: 0;   /* QUAN TRỌNG: cho phép shrink < content */
    overflow: hidden;
}
```

### Bước 4: Scroll nội bộ
```css
.scrollable-area {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;  /* Scroll khi content tràn */
}
```

### Ví dụ hoàn chỉnh
```css
.page-wrapper {
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.page-header {
    flex-shrink: 0;      /* Cố định theo content */
}

.filter-section {
    flex-shrink: 0;      /* Cố định theo content */
}

/* HOẶC dùng tỷ lệ cố định */
.filter-section {
    flex: 1;             /* 1/3 không gian */
}

.table-section {
    flex: 2;             /* 2/3 không gian */
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.table-section .table-box {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;    /* Scroll nội bộ */
}
```

---

## 6. Bootstrap Flex Utilities

### ⚠️ LƯU Ý QUAN TRỌNG: Bootstrap responsive làm gì và KHÔNG làm gì

| Bootstrap LÀM được (tự động) | Bootstrap KHÔNG làm (bạn phải tự code) |
|------------------------------|----------------------------------------|
| ✅ Chia cột theo width (col-6, col-md-4) | ❌ Giữ page không scroll |
| ✅ Hide/show theo breakpoint (d-none d-md-block) | ❌ Chia không gian theo HEIGHT |
| ✅ Wrap columns khi hẹp | ❌ Scale content khi browser zoom |
| ✅ Responsive direction (flex-column flex-md-row) | ❌ Internal scroll cho section |

**Kết luận:** Bootstrap giúp responsive **theo chiều ngang**. Để responsive **theo chiều dọc** (phân chia header-filter-table), cần kết hợp thêm `flex-shrink-0`, `flex-grow-1`, `overflow-hidden`.

### 🔧 Cách làm những thứ Bootstrap KHÔNG tự động làm

**1. Giữ page không scroll:**
```html
<!-- Container chiếm toàn bộ viewport -->
<div class="d-flex flex-column overflow-hidden" style="height: 100vh;">
    ...
</div>
```

**2. Chia không gian theo HEIGHT (chiều dọc):**
```html
<div class="d-flex flex-column" style="height: 100vh;">
    <!-- Section cố định - không co lại -->
    <div class="flex-shrink-0">Header</div>
    <div class="flex-shrink-0">Filter</div>
    
    <!-- Section fill remaining - chiếm phần còn lại -->
    <div class="flex-grow-1 overflow-hidden">Table</div>
</div>
```

**3. Chia theo tỷ lệ (30%-70%, 1:2...):**
```html
<!-- Cần tự tạo class vì Bootstrap không có -->
<style>
    .flex-1 { flex: 1; }
    .flex-2 { flex: 2; }
</style>

<div class="d-flex flex-column" style="height: 100vh;">
    <div class="flex-1">30% height</div>  <!-- 1/3 -->
    <div class="flex-2">70% height</div>  <!-- 2/3 -->
</div>
```

**4. Internal scroll cho section (table scroll, không scroll page):**
```html
<div class="flex-grow-1 d-flex flex-column overflow-hidden">
    <div class="section-header flex-shrink-0">Title</div>
    <!-- QUAN TRỌNG: min-height: 0 cho phép shrink -->
    <div class="flex-grow-1 overflow-auto" style="min-height: 0;">
        <table>...</table>
    </div>
</div>
```

### Display
| Class | CSS |
|-------|-----|
| `d-flex` | `display: flex` |
| `d-inline-flex` | `display: inline-flex` |

### Direction
| Class | CSS |
|-------|-----|
| `flex-row` | `flex-direction: row` |
| `flex-column` | `flex-direction: column` |

### Grow & Shrink
| Class | CSS |
|-------|-----|
| `flex-grow-0` | `flex-grow: 0` |
| `flex-grow-1` | `flex-grow: 1` |
| `flex-shrink-0` | `flex-shrink: 0` |
| `flex-shrink-1` | `flex-shrink: 1` |

> **Lưu ý:** Bootstrap không có `flex-grow-2`, `flex-2`, etc. Cần tự tạo nếu muốn tỷ lệ khác.

### Overflow
| Class | CSS |
|-------|-----|
| `overflow-hidden` | `overflow: hidden` |
| `overflow-auto` | `overflow: auto` |

### Kết hợp thông dụng

**Section cố định (header, filter):**
```html
<div class="flex-shrink-0">...</div>
```

**Section fill remaining:**
```html
<div class="flex-grow-1 d-flex flex-column overflow-hidden">...</div>
```

**Scrollable container:**
```html
<div class="flex-grow-1 overflow-auto" style="min-height: 0;">...</div>
```

---

## 7. Thuộc tính min-height: 0 - Tại sao quan trọng?

### Vấn đề
Mặc định, flex item có `min-height: auto` = chiều cao tối thiểu = content height.

Nếu table có 1000 dòng:
- `min-height: auto` = 1000 dòng height
- Flex item không thể shrink nhỏ hơn
- → **Tràn container!**

### Giải pháp
```css
.scrollable {
    min-height: 0;    /* Cho phép shrink < content */
    overflow-y: auto; /* Scroll khi cần */
}
```

---

## 8. Tóm tắt nhanh

### Layout bình thường
```css
.container { display: flex; flex-direction: column; }
.section { /* tự động */ }
/* Page scroll tự nhiên */
```

### Layout full-page không scroll
```css
.container { 
    height: 100vh; 
    display: flex; 
    flex-direction: column; 
    overflow: hidden; 
}
.fixed-section { flex-shrink: 0; }
.fill-section { 
    flex: 1; 
    min-height: 0; 
    overflow: hidden; 
}
.scrollable { 
    flex: 1; 
    min-height: 0; 
    overflow-y: auto; 
}
```

### Tỷ lệ cố định
```css
.section-1 { flex: 1; }  /* 33.3% */
.section-2 { flex: 2; }  /* 66.7% */
```

---

## 9. Lưu ý quan trọng khi dựng giao diện (2024-2025)

### ⚠️ Những lỗi thường gặp

| Lỗi | Giải pháp |
|-----|-----------|
| Dùng `height: 100vh` trên mobile | iOS Safari trừ thanh địa chỉ → dùng `min-height: 100dvh` |
| Quên `min-height: 0` trong flex | Flex item không thể shrink < content → thêm `min-height: 0` |
| Lạm dụng `!important` | Tăng specificity thay vì dùng `!important` |
| Nest quá nhiều flex container | Gây phức tạp, khó debug → flatten structure |
| Dùng px cho font-size | Không accessible → dùng `rem` hoặc `em` |

### 🆕 CSS Features mới nên dùng (2024-2025)

```css
/* 1. Container Queries - responsive theo parent, không phải viewport */
@container sidebar (min-width: 300px) {
    .card { flex-direction: row; }
}

/* 2. clamp() - responsive không cần media queries */
font-size: clamp(1rem, 2.5vw, 2rem);  /* min, preferred, max */
padding: clamp(0.5rem, 2vw, 2rem);

/* 3. dvh/svh/lvh - dynamic viewport height (fix iOS) */
min-height: 100dvh;  /* Dynamic - tự điều chỉnh theo thanh địa chỉ */

/* 4. aspect-ratio - giữ tỷ lệ hình */
.video-container {
    aspect-ratio: 16 / 9;
    width: 100%;
}

/* 5. gap - spacing đều, hoạt động cả flex và grid */
gap: 1rem;          /* Thay thế margin phức tạp */
```

### 🎯 Best Practices từ cộng đồng

1. **Mobile-First Approach**
   ```css
   /* Viết CSS cho mobile trước */
   .container { flex-direction: column; }
   
   /* Sau đó override cho desktop */
   @media (min-width: 768px) {
       .container { flex-direction: row; }
   }
   ```

2. **Dùng `gap` thay vì margin**
   ```css
   /* ❌ Cũ - phức tạp */
   .item { margin-right: 10px; }
   .item:last-child { margin-right: 0; }
   
   /* ✅ Mới - sạch sẽ */
   .container { gap: 10px; }
   ```

3. **Fluid Typography với clamp()**
   ```css
   h1 { font-size: clamp(1.5rem, 4vw, 3rem); }
   p  { font-size: clamp(0.875rem, 1.5vw, 1rem); }
   ```

4. **Grid cho layout phức tạp + Flex cho components**
   ```css
   /* Page layout - Grid */
   .page { display: grid; grid-template-areas: "header header" "sidebar main"; }
   
   /* Component bên trong - Flex */
   .card { display: flex; flex-direction: column; }
   ```

---

## 10. Mẹo tiết kiệm thời gian

### 🚀 Utility Classes tự tạo

```css
/* Thêm vào CSS của bạn - dùng lại nhiều lần */
.flex-1 { flex: 1; }
.flex-2 { flex: 2; }
.flex-3 { flex: 3; }

.min-h-0 { min-height: 0; }  /* Quan trọng cho scroll */

.gap-sm { gap: 0.5rem; }
.gap-md { gap: 1rem; }
.gap-lg { gap: 1.5rem; }
```

### ⚡ Snippets hay dùng

**1. Căn giữa hoàn hảo:**
```css
.center-all {
    display: flex;
    justify-content: center;
    align-items: center;
}
```

**2. Sticky header trong scroll container:**
```css
.sticky-header {
    position: sticky;
    top: 0;
    z-index: 10;
    background: inherit;
}
```

**3. Responsive grid tự động:**
```css
.auto-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
}
```

**4. Full-page layout template:**
```css
.full-page {
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}
.full-page > .header { flex-shrink: 0; }
.full-page > .main { flex: 1; min-height: 0; overflow: auto; }
```

### 🔧 Dev Tools Tips

1. **Chrome DevTools** → Elements → chọn element → click **flex** hoặc **grid** badge để visualize
2. **Firefox DevTools** có Grid/Flex inspector tốt nhất → hiển thị line numbers, areas
3. Dùng `outline: 1px solid red;` thay `border` để debug (không ảnh hưởng layout)

### 📋 Checklist trước khi ship

- [ ] Test responsive: 320px, 768px, 1024px, 1440px
- [ ] Test zoom: 150%, 200%
- [ ] Check overflow - không có horizontal scroll bất ngờ
- [ ] Verify touch targets ≥ 48x48px trên mobile
- [ ] Test với nội dung thực tế (không chỉ lorem ipsum)
