FROM caddy:alpine

WORKDIR /root

ADD https://github.com/wwricu/admin-page/releases/latest/download/dist.tar.gz .
COPY Caddyfile /etc/caddy/Caddyfile

RUN tar xzf dist.tar.gz && rm dist.tar.gz && ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo 'Asia/Shanghai' > /etc/timezone
