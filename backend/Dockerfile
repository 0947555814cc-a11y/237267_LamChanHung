# 1. Sử dụng Node.js LTS làm base image
FROM node:18-alpine

# 2. Thiết lập thư mục làm việc trong container
WORKDIR /app

# 3. Sao chép package.json và package-lock.json
COPY package*.json ./

# 4. Cài đặt các dependencies
RUN npm install --production

# 5. Sao chép toàn bộ mã nguồn backend vào container
COPY . .

# 6. Khai báo cổng ứng dụng chạy
EXPOSE 5000

# 7. Lệnh khởi chạy ứng dụng
CMD ["node", "server.js"]
