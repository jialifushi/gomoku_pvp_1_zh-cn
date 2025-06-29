FROM node:6.17.1-alpine

WORKDIR /app

COPY . .
RUN npm config set registry https://registry.npmmirror.com && \
    npm install --only=production

# 设置端口
ENV PORT=5124
# 暴露端口
EXPOSE 5124

ENTRYPOINT ["npm","start"]

# docker build -t firfe/gomoku_pvp_1_zh-cn:2025.06.28 .
