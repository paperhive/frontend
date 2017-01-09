FROM nginx
ENV \
  PRERENDER_TOKEN="missing_token" \
  PAPERHIVE_BASE_HREF="/" \
  PAPERHIVE_API_URL="https://dev.paperhive.org/backend/master"
COPY build /frontend/html
COPY docker-start.sh /frontend/start.sh
RUN chmod +x /frontend/start.sh
COPY build/index.html /frontend/templates/index.html
COPY docker-nginx.conf /frontend/templates/default.conf
CMD ["/frontend/start.sh"]
