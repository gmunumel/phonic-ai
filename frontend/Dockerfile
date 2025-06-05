# Build stage
FROM node:18 AS builder

WORKDIR /phonic-ai/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/. .

# Start production build
RUN npm run build

# Production stage
FROM nginx:alpine

COPY frontend/nginx/default.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /phonic-ai/frontend/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
# End production stage

# Development stage
# EXPOSE 3000

# CMD ["npm", "start"]