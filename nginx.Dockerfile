# Use an official Nginx runtime as a parent image
FROM nginx:1.21.0-alpine

# Copy template files
COPY conf.d/*.template /etc/nginx/templates/

# Replace environment variables in templates and output to nginx config files
RUN envsubst < /etc/nginx/templates/nginx-http.conf.template > /etc/nginx/conf.d/default.conf \
  && envsubst < /etc/nginx/templates/nginx-stream.conf.template > /etc/nginx/conf.d/stream.conf

# Expose port 80 for Nginx
EXPOSE 80

# Start Nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]