# IoT Backend (UAV-Assisted IoT Platform)

API nhận dữ liệu cảm biến từ Gateway, kiểm tra hợp lệ, chống trùng và lưu vào MySQL.

## Yêu cầu
JDK 21+ (đã thử với JDK 25), MySQL 8 (đã chạy `backend/database/schema.sql`)

## Cách chạy
1. Tạo file `src/main/resources/application-local.properties` (file này không đưa lên GitHub):
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
  "measurementId": "M300",
  "deviceCode": "SENSOR-001",
  "metricType": "TEMPERATURE",
  "value": 31.5,
  "unit": "C",
  "measuredAt": "2026-11-04T09:00:00+07:00"
}
```
metricType: TEMPERATURE, HUMIDITY, LIGHT, PH, SOIL_MOISTURE, WATER_LEVEL

## Luật kiểm tra dữ liệu
Các luật được gom trong `ReadingValidator`.

| Kiểm tra | Luật | Lỗi |
|---|---|---|
| Thiết bị | Phải tồn tại trong bảng `devices` | 404 |
| Thiết bị | `type` phải là `SENSOR` (UAV, gateway không gửi số đo) | 400 |
| Thiết bị | `status` phải là `ACTIVE` | 400 |
| Giá trị | Nằm trong khoảng hợp lý (bảng bên dưới) | 400 |
| Đơn vị | Đúng với loại chỉ số (bảng bên dưới), không gửi thì dùng đơn vị mặc định | 400 |
| Thời gian | `measuredAt` không ở tương lai quá 5 phút | 400 |
| Thời gian | `measuredAt` không quá cũ (quá 30 ngày) | 400 |

| metricType | Khoảng hợp lệ | Đơn vị |
|---|---|---|
| TEMPERATURE | -40 đến 80 | C |
| HUMIDITY | 0 đến 100 | % |
| LIGHT | 0 đến 200000 | lux |
| PH | 0 đến 14 | pH |
| SOIL_MOISTURE | 0 đến 100 | % |
| WATER_LEVEL | 0 đến 1000 | cm |

## Chống trùng theo measurementId
`measurementId` là mã duy nhất do gateway tạo cho mỗi lần đo (cột `measurement_id` UNIQUE trong bảng `readings`).

| Tình huống | Kết quả |
|---|---|
| `measurementId` chưa có | Lưu mới, trả **201** `created` |
| Đã có, nội dung **giống hệt** (gateway gửi lại sau khi mất mạng) | Không lưu lại, trả **200** `duplicate` |
| Đã có, nội dung **khác** (hai nguồn dùng trùng mã) | Không lưu, trả **409** để lộ lỗi, tránh mất dữ liệu âm thầm |

Hai request cùng `measurementId` đến đúng cùng lúc vẫn an toàn nhờ ràng buộc UNIQUE của MySQL.

## Mã phản hồi
| Mã | Ý nghĩa |
|---|---|
| 201 | Tạo mới |
| 200 | Trùng (`duplicate`) |
| 400 | Dữ liệu sai (thiếu trường, giá trị, đơn vị, thời gian, thiết bị không phải cảm biến) |
| 404 | Không có thiết bị |
| 409 | Trùng `measurementId` nhưng nội dung khác |

Với `/batch`, mỗi bản ghi được xử lý riêng, bản lỗi nằm trong mảng `failed` và không làm hỏng cả lô.

## Kiểm thử tự động
```
.\mvnw.cmd test "-Dtest=ReadingValidatorTest,ReadingServiceTest"
```
Kết quả: 16 test (12 cho luật kiểm tra, 4 cho chống trùng), 0 lỗi.

## Ảnh kiểm thử
Ảnh minh chứng nằm trong thư mục `docs/`.

**Ngày 3-4:** `test-api-created*`, `test-api-duplicate`, `test-invalid-value*`, `test-device-notfound*`, `test-batch*`, `test-database`.

**Ngày 5-6:**
| Ảnh | Nội dung |
|---|---|
| `test-d56-1-created.jpg` | 201 tạo mới |
| `test-d56-2-duplicate.jpg` | 200 gửi lại, báo `duplicate` |
| `test-d56-3-conflict.jpg` | 409 cùng mã, nội dung khác |
| `test-d56-4-uav.jpg` | 400 thiết bị là UAV |
| `test-d56-5-unit.jpg` | 400 sai đơn vị |
| `test-d56-6-future.jpg` | 400 thời gian ở tương lai |
| `test-d56-7-old.jpg` | 400 thời gian quá cũ |
| `test-d56-database.jpg` | Mỗi `measurementId` đúng một dòng trong MySQL |
| `test-unit-16-passed.jpg` | 16 test tự động đều qua |