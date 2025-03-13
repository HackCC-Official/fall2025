# Use an official Nginx runtime as a parent image
FROM nginx:1.21.0-alpine

# Copy the base nginx.conf file (that separates stream from http)
COPY conf.d/nginx.conf /etc/nginx/nginx.conf

# Copy template files into /etc/nginx/templates (for dynamic config generation if needed)
COPY conf.d/*.template /etc/nginx/templates/

COPY conf.d/cloudflare-ips.conf /etc/nginx/cloudflare-ips.conf

# Expose port 80 for Nginx
EXPOSE 80

# Start Nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]