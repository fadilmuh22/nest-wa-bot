FROM oven/bun:alpine

# We don't need the standalone Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

RUN apk add --no-cache \
    udev \
    ttf-freefont \
    chromium

WORKDIR /app

COPY . .

RUN bun install && bun run build

CMD [ "bun", "./dist/main.js" ]
