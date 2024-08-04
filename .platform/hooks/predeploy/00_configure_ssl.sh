#!/bin/bash

# Create the Nginx SSL configuration file
cat << 'EOF' > /etc/nginx/conf.d/ssl.conf
server {
    listen 443 ssl;
    server_name edukona.com *.edukona.com;

    ssl_certificate /etc/letsencrypt/live/edukona.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/edukona.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
EOF

# Reload Nginx to apply the new configuration
service nginx reload
