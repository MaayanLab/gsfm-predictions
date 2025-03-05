FROM node:21
WORKDIR /app

ADD .next/standalone ./
ADD .next/static ./.next/static
ADD public ./public

ENV DATABASE_URL ""
EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"
CMD ["node", "server.js"]