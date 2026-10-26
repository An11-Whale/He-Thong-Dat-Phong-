# 🧪 Test Scenarios - Sensor Simulator Module

Tài liệu mô tả các kịch bản kiểm thử dữ liệu đầu vào cho hệ thống UAV Farm Monitoring (Người 4).

## 1. Kịch bản vận hành bình thường (Normal Operation)
- **Mô tả:** Các node cảm biến gửi dữ liệu định kỳ mỗi 1.5s - 3s.
- **Định dạng dữ liệu:** Chuẩn JSON, trạng thái `"status": "NORMAL"`.
- **Mục đích:** Kiểm thử khả năng thu thập dữ liệu liên tục của Gateway.

## 2. Kịch bản tiêm dữ liệu bất thường (Anomaly Injection)
- **Mô tả:** Tự động kích hoạt dựa trên cấu hình `SIMULATION_ANOMALY_RATE` trong `.env`.
- **Dấu hiệu:** 
  - Giá trị vượt ngưỡng (Ví dụ: Nhiệt độ > 50°C, Độ ẩm đất < 5%).
  - Trạng thái ghi nhận: `"status": "WARNING_ANOMALY"`.
- **Mục đích:** Kiểm thử tính năng cảnh báo sớm F18/F19 trên Dashboard.

## 3. Kịch bản Mất kết nối / Mất gói tin (Node Offline)
- **Mô tả:** Giả lập thiết bị dừng gửi dữ liệu ngẫu nhiên hoặc timeout khi hết thời gian chạy.
- **Mục đích:** Kiểm thử cơ chế phát hiện thiết bị không phản hồi của Gateway.

> **Lưu ý:** Toàn bộ dữ liệu phát ra từ module này là dữ liệu giả lập (Simulation Data), phục vụ mục đích kiểm thử hệ thống khi chưa lắp đặt phần cứng cảm biến thực tế.