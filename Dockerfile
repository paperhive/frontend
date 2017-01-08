FROM nginx
ENV PRERENDER_TOKEN missin_token
COPY build /usr/share/nginx/html
COPY docker-nginx.conf /etc/nginx/conf.d/default.conf.template
CMD envsubst '\$PRERENDER_TOKEN' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'
