FROM node:26.7.0-slim

RUN set -x \
  && apt update -y \
  && apt install -y --no-install-recommends ca-certificates curl git \
  && rm -rf /var/lib/apt/lists/*

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /home/node
USER node

COPY --chown=node:node requirements.txt ./
RUN set -x \
  && uv venv --python=3.12 \
  && uv pip install --no-cache-dir -r requirements.txt \
  && rm requirements.txt

COPY --chown=node:node .next/standalone ./
COPY --chown=node:node .next/static ./.next/static
COPY --chown=node:node src ./src
COPY --chown=node:node public ./public
COPY --chown=node:node ensure-model.sh ./
RUN chmod +x ensure-model.sh

ENV DATABASE_URL=""
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV PYTHON_BIN=/home/node/.venv/bin/python
VOLUME ["/home/node/data/model"]
ENTRYPOINT ["/bin/sh"]
CMD ["ensure-model.sh", "node", "server.js"]