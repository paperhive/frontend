FROM nginx
ENV \
  PRERENDER_TOKEN="missing_token" \
  PAPERHIVE_BASE_HREF="/" \
  PAPERHIVE_API_URL="https://dev.paperhive.org/master/api"

COPY build /frontend/html
COPY build/index.html /frontend/templates/index.html
COPY docker-nginx.conf /frontend/templates/default.conf
COPY docker-start.sh /frontend/start.sh

CMD ["/frontend/start.sh"]
