# Use an official Nginx runtime as a parent image
FROM nginx:1.21.0-alpine

# Accept build argument
ARG IS_PRODUCTION=false

# Copy the base nginx.conf file (that separates stream from http)
COPY conf.d/nginx.conf /etc/nginx/nginx.conf

# Copy template files into /etc/nginx/templates (for dynamic config generation if needed)
COPY conf.d/*.template /etc/nginx/templates/

# Remove planka config if not production
RUN if [ "$IS_PRODUCTION" != "true" ]; then \
  rm -f /etc/nginx/templates/planka-site.conf.template; \
  # Also remove the include line from nginx.conf
  sed -i '/planka-site.conf/d' /etc/nginx/nginx.conf; \
  fi

# Expose port 80 for Nginx
EXPOSE 80

# Start Nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]