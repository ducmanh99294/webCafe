# Build React (dùng Node.js)
FROM node:18-alpine AS build
WORKDIR /app

# Cài đặt dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy source code và build
COPY . .
RUN npm run build

# Phục vụ file (dùng Nginx)
FROM nginx:1.25-alpine

# Copy các file static đã build từ stage 1
# (Nếu bạn dùng Create React App, đổi /app/dist thành /app/build)
COPY --from=build /app/dist /usr/share/nginx/html

# Copy file cấu hình Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 (cổng mặc định của Nginx)
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]