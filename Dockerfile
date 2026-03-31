FROM node:21

WORKDIR /app

RUN set -x \
  && apt update -y \
  && apt install -y git curl python3 python3-pip \
  && pip install --no-cache-dir --break-system-packages uv \
  && rm -rf /var/lib/apt/lists/*

ADD requirements.txt ./
RUN set -x \
  && uv venv \
  && uv pip install --no-cache-dir -r requirements.txt \
  && rm requirements.txt

ADD .next/standalone ./
ADD .next/static ./.next/static
ADD src ./src
ADD public ./public
ADD ensure-model.sh ./
RUN chmod +x ensure-model.sh

ENV DATABASE_URL ""
EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"
ENV PYTHON_BIN /app/.venv/bin/python
VOLUME ["/app/model"]
ENTRYPOINT ["/bin/sh"]
CMD ["ensure-model.sh", "node", "server.js"]