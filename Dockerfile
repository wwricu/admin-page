FROM caddy:alpine

WORKDIR /data

ADD https://github.com/wwricu/admin-page/releases/download/snapshot/dist.tar.gz .
COPY Caddyfile /etc/caddy/Caddyfile

RUN rm dist.tar.gz && ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo 'Asia/Shanghai' > /etc/timezone
