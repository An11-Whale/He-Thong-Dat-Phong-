# YÊU CẦU PHI CHỨC NĂNG
## Nền tảng IoT hỗ trợ UAV giám sát nông trại và thu thập dữ liệu cảm biến

## 1. Mục đích

Tài liệu này quy định các yêu cầu về chất lượng và điều kiện vận hành của hệ thống, bao gồm hiệu năng, bảo mật, độ tin cậy, khả năng đồng bộ dữ liệu, khả năng mở rộng, tính tương thích và tính dễ sử dụng.

Các yêu cầu phi chức năng bổ sung cho yêu cầu chức năng, nhằm xác định hệ thống phải hoạt động ở mức chất lượng nào.

## 2. Yêu cầu phi chức năng

### NFR01 — Hiệu năng giao diện và API

- Các thao tác Web thông thường phải phản hồi trong khoảng 3 giây trong điều kiện tải và môi trường kiểm thử đã thống nhất.
- Các API truy vấn dữ liệu cảm biến và trạng thái thiết bị phải đáp ứng thời gian phản hồi đã xác định trong kế hoạch kiểm thử.
- Thời gian phản hồi được đo trong điều kiện mạng, dữ liệu và tải thử nghiệm được ghi nhận rõ ràng.

**Tiêu chí đánh giá:** Thực hiện các thao tác đại diện nhiều lần và ghi nhận thời gian phản hồi; báo cáo kết quả theo điều kiện thử nghiệm.

### NFR02 — Tính kịp thời của dữ liệu

- Sau khi máy chủ nhận và lưu thành công dữ liệu mới, giao diện giám sát phải cập nhật dữ liệu trong vòng 10 giây trong điều kiện vận hành bình thường đã thống nhất.
- Giao diện phải phân biệt thời điểm cảm biến đo với thời điểm máy chủ nhận dữ liệu.
- Dữ liệu vượt quá thời gian cập nhật cho phép phải được đánh dấu là dữ liệu cũ hoặc mất cập nhật.

**Tiêu chí đánh giá:** Ghi nhận thời điểm máy chủ lưu dữ liệu và thời điểm dữ liệu mới xuất hiện trên giao diện trong môi trường kiểm thử.

### NFR03 — Bảo mật và kiểm soát truy cập

- Hệ thống phải yêu cầu xác thực đối với các chức năng được bảo vệ.
- Quyền truy cập phải được kiểm tra tại Backend theo vai trò và phạm vi dữ liệu được phép truy cập.
- Mật khẩu không được lưu dưới dạng văn bản thuần.
- Thông tin bí mật như khóa API và thông tin kết nối cơ sở dữ liệu không được đưa trực tiếp vào mã nguồn công khai.
- Kết nối mạng giữa các thành phần phải sử dụng cơ chế bảo vệ phù hợp với môi trường triển khai; HTTPS được sử dụng khi triển khai qua mạng.
- Các lỗi xác thực và truy cập trái phép phải được xử lý mà không làm lộ thông tin nhạy cảm.

**Tiêu chí đánh giá:** Kiểm thử truy cập trái phép, truy cập sai vai trò, cấu hình bí mật và xử lý lỗi xác thực.

### NFR04 — Độ tin cậy và tính toàn vẹn dữ liệu

- Dữ liệu đã được xác nhận lưu thành công phải được duy trì theo chính sách lưu trữ và sao lưu của hệ thống.
- Quá trình đồng bộ phải hạn chế mất dữ liệu và không tạo bản ghi trùng khi một bản ghi được gửi lại.
- Các bản ghi lỗi phải được xử lý theo quy tắc đã xác định, không được âm thầm coi là dữ liệu hợp lệ.
- Các lỗi đồng bộ phải có thông tin đủ để xác định và thử lại khi phù hợp.

**Tiêu chí đánh giá:** Mô phỏng mất kết nối, gửi lại dữ liệu, gửi dữ liệu lỗi và kiểm tra số lượng, nội dung bản ghi sau đồng bộ.

### NFR05 — Khả năng hoạt động khi mất Internet

- Gateway phải lưu được dữ liệu thu thập trong thời gian mất Internet, trong giới hạn dung lượng lưu trữ thực tế.
- Gateway phải có cơ chế thử đồng bộ lại khi kết nối được khôi phục.
- Dữ liệu chưa đồng bộ phải được phân biệt với dữ liệu đã đồng bộ.
- Chính sách xử lý khi bộ nhớ Gateway gần đầy phải được xác định trước khi triển khai thực tế.

**Tiêu chí đánh giá:** Ngắt kết nối mạng, tiếp tục thu thập dữ liệu, khôi phục kết nối và xác nhận dữ liệu được đồng bộ đầy đủ trong giới hạn môi trường thử nghiệm.

### NFR06 — Tính sẵn sàng và khôi phục

- Mục tiêu sẵn sàng của hệ thống là 99% trong điều kiện vận hành bình thường, nếu môi trường triển khai cho phép đo lường và đáp ứng mục tiêu này.
- Cơ sở dữ liệu phải có phương án sao lưu và khôi phục phù hợp.
- Quy trình khôi phục phải được kiểm thử trước khi bàn giao.
- Các lỗi dịch vụ phải được ghi nhận để hỗ trợ chẩn đoán.

**Tiêu chí đánh giá:** Ghi nhận thời gian hoạt động, thời gian gián đoạn và kết quả thử khôi phục dữ liệu.

### NFR07 — Khả năng mở rộng và bảo trì

- Kiến trúc phải cho phép bổ sung trang trại, phân khu, cảm biến, Gateway và nhiệm vụ mà không phải thiết kế lại toàn bộ hệ thống.
- Các thành phần quản lý người dùng, cảm biến, dữ liệu đo, nhiệm vụ và cảnh báo phải được tổ chức rõ ràng.
- API và cấu trúc dữ liệu phải được tài liệu hóa.
- Mã nguồn phải có cấu trúc nhất quán, dễ kiểm thử và bảo trì.

**Tiêu chí đánh giá:** Có thể bổ sung một cảm biến và gán vào phân khu thông qua các chức năng đã thiết kế mà không cần thay đổi cấu trúc cốt lõi của hệ thống.

### NFR08 — Tính tương thích

- Giao diện Web phải hoạt động trên các phiên bản trình duyệt Chrome, Edge và Firefox được nhóm lựa chọn để kiểm thử.
- Các thành phần Backend, cơ sở dữ liệu và Gateway phải giao tiếp theo giao thức và định dạng dữ liệu đã thống nhất.
- Môi trường chạy và các phiên bản phụ thuộc quan trọng phải được ghi nhận trong tài liệu triển khai.

**Tiêu chí đánh giá:** Thực hiện các thao tác chính trên những trình duyệt và môi trường nằm trong phạm vi kiểm thử.

### NFR09 — Tính dễ sử dụng

- Giao diện phải thể hiện rõ trạng thái cảm biến, trạng thái nhiệm vụ và mức độ cảnh báo.
- Dữ liệu lịch sử phải có cách lọc và trình bày dễ hiểu.
- Thông báo lỗi phải cho người dùng biết vấn đề xảy ra và hành động tiếp theo nếu có thể.
- Bản đồ, biểu đồ và bảng dữ liệu phải có nhãn, đơn vị đo và chú giải phù hợp.

**Tiêu chí đánh giá:** Người dùng thử nghiệm có thể thực hiện các tác vụ chính như xem dữ liệu cảm biến, tìm cảnh báo và xem kết quả nhiệm vụ theo hướng dẫn.

## 3. Nguyên tắc nghiệm thu

- Mỗi yêu cầu phi chức năng phải có cách đo hoặc kiểm thử tương ứng.
- Các mục tiêu định lượng phải được đánh giá trong điều kiện thử nghiệm được ghi rõ.
- Các yêu cầu phụ thuộc phần cứng, hạ tầng mạng hoặc dịch vụ bên ngoài phải được đánh giá theo môi trường thực tế mà nhóm có thể triển khai.
- Kết quả kiểm thử phải được ghi nhận để làm căn cứ xác nhận mức độ đáp ứng của hệ thống.
