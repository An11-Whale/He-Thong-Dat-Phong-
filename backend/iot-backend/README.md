# IoT Backend (UAV-Assisted IoT Platform)

API nhận dữ liệu cảm biến từ Gateway, kiểm tra hợp lệ, chống trùng và lưu vào MySQL.

## Yêu cầu
JDK 21+ (đã thử với JDK 25), MySQL 8 (đã chạy backend/database/schema.sql)

## Cách chạy
1. Tạo file `src/main/resources/application-local.properties`:
   ```
   spring.datasource.username=root
   spring.datasource.password=MAT_KHAU_MYSQL_CUA_BAN
   ```
2. Chạy: `.\mvnw.cmd spring-boot:run`
3. Mở http://localhost:8080/swagger-ui.html

## API
| Method | Đường dẫn | Mô tả |
|---|---|---|
| POST | /api/v1/readings | Nhận 1 bản ghi đo |
| POST | /api/v1/readings/batch | Nhận nhiều bản ghi (đồng bộ dữ liệu offline) |
| GET | /api/v1/readings | Xem dữ liệu đã lưu |

## Mẫu JSON
```json
{
  "measurementId": "M002",
  "deviceCode": "SENSOR-001",
  "metricType": "TEMPERATURE",
  "value": 31.5,
  "unit": "C",
  "measuredAt": "2026-10-28T08:30:00+07:00"
}
```
metricType: TEMPERATURE, HUMIDITY, LIGHT, PH, SOIL_MOISTURE, WATER_LEVEL

## Mã phản hồi
201 tạo mới | 200 trùng (duplicate) | 400 dữ liệu sai | 404 không có thiết bị

## Ảnh kiểm thử
Xem thư mục `docs/`.