# SPDX-FileCopyrightText: 2019-2020 Magenta ApS
# SPDX-License-Identifier: MPL-2.0

FROM node:10@sha256:59531d2835edd5161c8f9512f9e095b1836f7a1fcb0ab73e005ec46047384911 AS frontend

WORKDIR /app/frontend

COPY frontend/package.json .
COPY frontend/yarn.lock .
# We fail hard if the yaml.lock is outdated.
RUN yarn install --frozen-lockfile && yarn cache clean

COPY frontend .
RUN yarn build

# script for `vue-cli-service serve` from frontend/package.json
CMD ["yarn", "dev"]

FROM nginx:1.23@sha256:63b44e8ddb83d5dd8020327c1f40436e37a6fffd3ef2498a6204df23be6e7e94
LABEL org.opencontainers.image.title="OS2mo Frontend" \
      org.opencontainers.image.vendor="Magenta ApS" \
      org.opencontainers.image.licenses="MPL-2.0" \
      org.opencontainers.image.url="https://git.magenta.dk/rammearkitektur/OS2mo-Frontend" \
      org.opencontainers.image.source="https://git.magenta.dk/rammearkitektur/OS2mo-Frontend"

COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=frontend /app/frontend/package.json /usr/share/nginx/html/
COPY --from=frontend /app/frontend/dist /usr/share/nginx/html/
