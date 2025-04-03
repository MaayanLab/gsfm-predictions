FROM node:21
WORKDIR /app

ADD .next/standalone ./
ADD .next/static ./.next/static
ADD public ./public
ADD ensure-model.sh ./
RUN chmod +x ensure-model.sh

ENV DATABASE_URL ""
EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"
VOLUME ["/app/model"]
ENTRYPOINT ["/bin/sh"]
CMD ["ensure-model.sh", "node", "server.js"]