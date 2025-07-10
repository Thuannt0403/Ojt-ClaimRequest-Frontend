# Hệ Thống Quản Lý Yêu Cầu Thanh Toán

Ứng dụng web sử dụng React để quản lý yêu cầu thanh toán với phân quyền người dùng và giao diện hiện đại.

## 🚀 Công Nghệ Sử Dụng

- **Frontend Framework:** React với TypeScript
- **Build Tool:** Vite
- **Quản Lý State:** Redux Toolkit với Redux Persist
- **CSS Framework:** Tailwind CSS
- **Thư Viện UI:** 
  - Material-UI
  - Radix UI
  - Ant Design
- **Kiểm Tra Kiểu Dữ Liệu:** TypeScript
- **Định Tuyến:** React Router v6

## 📁 Cấu Trúc Dự Án

```plaintext
team2-claimrequest-reactjs/
├── src/                  # Mã nguồn
│   ├── apps/             # Mã nguồn chính của ứng dụng
│   ├── assets/           # Tài nguyên tĩnh (hình ảnh, font chữ)
│   ├── components/       # Components React có thể tái sử dụng
│   │   ├── ui/           # Components giao diện
│   │   ├── auth/         # Components xác thực
│   │   ├── Sidebar/      # Thanh điều hướng bên
│   │   ├── Navbar/       # Thanh điều hướng trên
│   │   └── Footer/       # Chân trang
│   ├── hooks/            # Custom React hooks
│   ├── interfaces/       # Định nghĩa kiểu dữ liệu TypeScript
│   ├── layouts/          # Các layout
│   ├── lib/              # Cấu hình thư viện
│   ├── page/             # Các trang
│   ├── routers/          # Cấu hình định tuyến
│   ├── services/         # Dịch vụ API và store
│   │   ├── store/        # Cấu hình Redux store
│   │   ├── features/     # Redux slices
│   │   └── constant/     # Hằng số và enums
│   └── utils/            # Hàm tiện ích
├── public/               # Tài nguyên công khai
└── config files          # Các file cấu hình
```

## 🏃‍♂️ Quy Trình Chạy Code (`npm run dev`)

Khi chạy lệnh `npm run dev`, các bước sau sẽ diễn ra:

1. **Khởi Động Vite Development Server**
   - Vite đọc cấu hình từ `vite.config.ts`
   - Server phát triển khởi động (mặc định: http://localhost:5173)

2. **Tải Điểm Khởi Đầu**
   ```typescript
   // src/main.tsx
   import React from 'react';
   import ReactDOM from 'react-dom';
   import App from './apps/App';
   import { Provider } from 'react-redux';
   import { store, persistor } from './services/store/store';
   
   ReactDOM.render(
     <React.StrictMode>
       <Provider store={store}>
         <PersistGate loading={null} persistor={persistor}>
           <App />
         </PersistGate>
       </Provider>
     </React.StrictMode>,
     document.getElementById('root')
   );
   ```

3. **Khởi Tạo Redux Store**
   - Store được cấu hình với các reducers
   - Redux Persist thiết lập đồng bộ với local storage

4. **Khởi Tạo Router**
   - React Router thiết lập các routes
   - AuthGuard kiểm tra xác thực người dùng

5. **Render Cây Component**
   - Components layout được tải dựa trên vai trò người dùng
   - Components trang được render trong layout

## 🔄 Tương Tác Giữa File TypeScript (.ts) và React (.tsx)

### File TypeScript (.ts)
- **Mục đích:** Logic nghiệp vụ, tiện ích và định nghĩa kiểu
- **Vị trí:** Thường trong `services/`, `utils/`, và `interfaces/`
- **Ví dụ:**
  ```typescript
  // interfaces/auth.interface.ts
  export interface User {
    id: string;
    name: string;
    role: UserRole;
  }
  
  // services/api.ts
  export const fetchUser = async (id: string): Promise<User> => {
    // Logic API
  }
  ```

### File React TypeScript (.tsx)
- **Mục đích:** Components UI và trang
- **Vị trí:** Trong `components/`, `pages/`, và `layouts/`
- **Ví dụ:**
  ```typescript
  // components/auth/Login.tsx
  const Login: React.FC = () => {
    return (
      <form>
        {/* Giao diện form đăng nhập */}
      </form>
    );
  }
  ```

### Cách Chúng Hoạt Động Cùng Nhau
1. **Định Nghĩa Kiểu → Components**
   ```typescript
   // interfaces/claim.interface.ts
   interface Claim {
     id: string;
     amount: number;
     status: ClaimStatus;
   }
   
   // components/claims/ClaimCard.tsx
   const ClaimCard: React.FC<Claim> = ({ id, amount, status }) => {
     // Component sử dụng interface Claim
   }
   ```

2. **Services → Components**
   ```typescript
   // services/claimService.ts
   export const fetchClaims = async (): Promise<Claim[]> => {
     // Logic API
   }
   
   // pages/ClaimList.tsx
   const ClaimList: React.FC = () => {
     const claims = useQuery('claims', fetchClaims);
     // Render danh sách claims
   }
   ```

## 🔐 Phân Quyền Người Dùng

Ứng dụng hỗ trợ nhiều vai trò người dùng:
- **Nhân viên:** Gửi và xem yêu cầu thanh toán của họ
- **Người duyệt:** Xem xét và phê duyệt yêu cầu
- **Tài chính:** Xử lý các yêu cầu đã được phê duyệt
- **Quản trị viên:** Quản lý người dùng và cài đặt hệ thống

## 🛠 Phát Triển

1. Cài đặt dependencies:
   ```bash
   npm install
   ```

2. Khởi động server phát triển:
   ```bash
   npm run dev
   ```

3. Build cho production:
   ```bash
   npm run build
   ```

## 🧪 Cấu Hình TypeScript

Dự án sử dụng nhiều file cấu hình TypeScript:
- `tsconfig.json`: Cấu hình cơ bản
- `tsconfig.app.json`: Cài đặt cho ứng dụng
- `tsconfig.node.json`: Cài đặt cho môi trường Node.js

## 📚 Tài Liệu Tham Khảo

- [Tài liệu React](https://reactjs.org/)
- [Tài liệu TypeScript](https://www.typescriptlang.org/)
- [Tài liệu Vite](https://vitejs.dev/)
- [Tài liệu Redux Toolkit](https://redux-toolkit.js.org/)

## 💡 Lưu Ý Quan Trọng

1. **Quản Lý State:**
   - Sử dụng Redux cho state toàn cục
   - Sử dụng local state cho UI components
   - Redux Persist lưu trữ dữ liệu quan trọng

2. **Xử Lý API:**
   - Tập trung xử lý API trong thư mục `services`
   - Sử dụng Axios cho HTTP requests
   - Xử lý lỗi thống nhất

3. **Bảo Mật:**
   - Kiểm tra xác thực ở mỗi route bảo vệ
   - Không lưu trữ thông tin nhạy cảm ở client
   - Sử dụng HTTPS cho môi trường production
