# Use an official Nginx runtime as a parent image
FROM nginx:1.21.0-alpine

# Copy template files
COPY conf.d/*.template /etc/nginx/templates/

# Expose port 80 for Nginx
EXPOSE 80

# Start Nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]