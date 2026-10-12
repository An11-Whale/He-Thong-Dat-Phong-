# YÊU CẦU CHỨC NĂNG
## Nền tảng IoT hỗ trợ UAV giám sát nông trại và thu thập dữ liệu cảm biến

## 1. Mục đích

Tài liệu này xác định các chức năng mà hệ thống phải cung cấp, cùng những chức năng không thuộc phạm vi triển khai của phiên bản đầu tiên.

Đây là căn cứ để nhóm thiết kế kiến trúc, cơ sở dữ liệu, API, giao diện, phân chia công việc và kiểm thử hệ thống.

## 2. Mục tiêu hệ thống

Hệ thống được xây dựng nhằm thu thập dữ liệu từ các cảm biến phân bố tại nhiều khu vực trong nông trại, sử dụng UAV hỗ trợ Gateway di động để thu thập và lưu trữ dữ liệu khi không có Internet.

Khi kết nối mạng được khôi phục, Gateway đồng bộ dữ liệu lên máy chủ trung tâm. Người quản lý có thể theo dõi dữ liệu cảm biến, trạng thái thiết bị, nhiệm vụ thu thập và các cảnh báo thông qua giao diện Web.

## 3. Phạm vi chức năng

### 3.1. Chức năng hệ thống PHẢI LÀM (In-Scope)

#### 3.1.1. Quản lý tài khoản và phân quyền

- **F01 — Xác thực người dùng:** Hệ thống cho phép người dùng đăng nhập và đăng xuất. Người dùng phải được xác thực trước khi truy cập các chức năng được bảo vệ.
- **F02 — Quản lý người dùng:** Quản trị viên có thể tạo, xem, cập nhật, vô hiệu hóa tài khoản và cấp vai trò theo quyền hạn được quy định.

#### 3.1.2. Quản lý trang trại và phân khu

- **F03 — Quản lý trang trại và phân khu:** Hệ thống cho phép người có quyền tạo, xem, cập nhật và quản lý thông tin trang trại, các phân khu thuộc trang trại.

#### 3.1.3. Quản lý và giám sát cảm biến, thiết bị

- **F12 — Quản lý cảm biến:** Kỹ thuật viên có thể đăng ký, cập nhật thông tin và gán nút cảm biến vào phân khu tương ứng.
- **F13 — Quản lý UAV và Gateway:** Hệ thống cho phép quản lý danh mục UAV và Gateway di động, bao gồm thông tin định danh và trạng thái thiết bị.
- **F05 — Hiển thị vị trí và trạng thái cảm biến:** Hệ thống hiển thị vị trí và trạng thái cảm biến trên bản đồ hoặc giao diện vị trí tương ứng khi có dữ liệu vị trí hợp lệ.

#### 3.1.4. Giám sát dữ liệu và bảng điều khiển

- **F04 — Bảng điều khiển tổng quan:** Hệ thống hiển thị thông tin tổng quan về cảm biến, thiết bị, cảnh báo và nhiệm vụ UAV.
- **F06 — Theo dõi dữ liệu cảm biến:** Hệ thống hiển thị giá trị cảm biến mới nhất mà máy chủ đã nhận được và lịch sử đo đạc. Các loại dữ liệu gồm nhiệt độ, độ ẩm, độ ẩm đất, pH, cường độ ánh sáng và mực nước tùy theo cảm biến được triển khai.
- **F07 — So sánh dữ liệu giữa các phân khu:** Người dùng có thể chọn và so sánh các chỉ số cảm biến giữa những phân khu được phép truy cập.

#### 3.1.5. Cấu hình và xử lý cảnh báo

- **F09 — Cấu hình cảnh báo:** Người có quyền có thể thiết lập ngưỡng dữ liệu cảm biến, thời gian xác định dữ liệu mất cập nhật và ngưỡng pin yếu.
- **F10 — Tạo và gửi thông báo:** Hệ thống tạo cảnh báo khi điều kiện đã cấu hình được thỏa mãn, hiển thị cảnh báo trên Web và gửi email khi dịch vụ email được cấu hình.
- **F08 — Quản lý cảnh báo:** Người có quyền có thể xem danh sách cảnh báo, ghi chú quá trình xử lý và đóng cảnh báo. Lịch sử xử lý phải được lưu lại.

#### 3.1.6. Quản lý nhiệm vụ thu thập dữ liệu

- **F14 — Tạo nhiệm vụ:** Người vận hành có thể tạo nhiệm vụ bằng cách chọn trang trại, các cảm biến mục tiêu và danh sách waypoint dự kiến.
- **F15 — Giám sát nhiệm vụ:** Hệ thống hiển thị trạng thái và tiến độ nhiệm vụ. Vị trí UAV, mức pin và tiến độ waypoint chỉ được hiển thị khi có nguồn telemetry tương thích cung cấp dữ liệu.
- **F16 — Cập nhật trạng thái thủ công:** Người vận hành có thể cập nhật trạng thái nhiệm vụ và ghi chú vận hành.
- **F17 — Xem kết quả nhiệm vụ:** Hệ thống hiển thị kết quả thu thập, bao gồm các điểm thành công, điểm thất bại và nguyên nhân thất bại nếu có thông tin.

#### 3.1.7. Báo cáo và thống kê

- **F11 — Báo cáo:** Hệ thống cung cấp báo cáo về dữ liệu cảm biến, trạng thái thiết bị, lịch sử cảnh báo và kết quả nhiệm vụ. Người dùng có thể lọc dữ liệu theo các tiêu chí được hỗ trợ và xuất báo cáo theo định dạng đã thống nhất.

#### 3.1.8. Thu thập và đồng bộ dữ liệu

- **F18 — Phát hiện và xác thực cảm biến:** Gateway phát hiện các nút cảm biến đã đăng ký và thực hiện xác thực theo cơ chế giao tiếp được lựa chọn.
- **F19 — Kiểm tra dữ liệu thu thập:** Hệ thống kiểm tra trường bắt buộc, kiểu dữ liệu, thời điểm đo và các giá trị nằm ngoài phạm vi cho phép. Hệ thống phát hiện bản ghi trùng dựa trên mã định danh hoặc khóa chống trùng đã thống nhất.
- **F20 — Lưu trữ ngoại tuyến và đồng bộ:** Khi mất Internet, Gateway lưu dữ liệu chưa đồng bộ vào bộ nhớ cục bộ. Khi kết nối được khôi phục, Gateway tự động thử đồng bộ dữ liệu lên máy chủ. Việc gửi lại cùng một bản ghi không được tạo thêm bản ghi trùng trên máy chủ.

### 3.2. Chức năng hệ thống KHÔNG LÀM (Out-of-Scope)

Phiên bản đầu tiên không bao gồm các chức năng sau:

1. Điều khiển trực tiếp hướng bay, động cơ, độ cao hoặc chuyển động của UAV từ giao diện Web.
2. Tự động lập kế hoạch bay tối ưu, điều hướng tự động hoặc tránh vật cản cho UAV.
3. Phân tích hình ảnh nông nghiệp từ camera UAV.
4. Sử dụng AI nâng cao để dự báo thời tiết, dự đoán sức khỏe cây trồng hoặc tự động đưa ra quyết định canh tác.
5. Xây dựng ứng dụng di động riêng; giao diện quản lý trong phiên bản đầu tiên là ứng dụng Web.
6. Tích hợp các loại cảm biến, giao thức hoặc hệ thống bên ngoài chưa được nhóm thống nhất.

### 3.3. Nguyên tắc xác định phạm vi

- Hệ thống quản lý nhiệm vụ và dữ liệu thu thập, không thay thế bộ điều khiển bay chuyên dụng.
- Việc tạo nhiệm vụ và lưu waypoint không đồng nghĩa với việc gửi lệnh điều khiển UAV.
- Dữ liệu được hiển thị theo thông tin máy chủ đã nhận; hệ thống không cam kết dữ liệu luôn được cập nhật tức thời khi Gateway chưa kết nối.
- Các chức năng phụ thuộc phần cứng chỉ được nghiệm thu khi phần cứng hoặc môi trường mô phỏng tương ứng đã được xác định.

## 4. Căn cứ kiểm thử

Mỗi chức năng từ F01 đến F20 phải được kiểm thử bằng các trường hợp phù hợp.

Ví dụ đối với F20:
- Khi mất Internet, Gateway vẫn lưu được dữ liệu thu thập vào bộ nhớ cục bộ.
- Khi kết nối được khôi phục, dữ liệu chưa đồng bộ được gửi lại lên máy chủ.
- Khi cùng một bản ghi được gửi nhiều lần, máy chủ không tạo thêm bản ghi trùng.
- Kết quả đồng bộ thành công hoặc thất bại phải có thể xác định được.

Chi tiết các trường hợp kiểm thử được xác định trong kế hoạch kiểm thử của dự án.
