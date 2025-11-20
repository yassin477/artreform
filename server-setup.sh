#!/bin/bash

###############################################
# Script de instalación automática - ArtReform
# Para Ubuntu 20.04+ en Contabo VPS
###############################################

set -e  # Salir si hay algún error

# Colores para mensajes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # Sin color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Instalación Automática - ArtReform${NC}"
echo -e "${GREEN}========================================${NC}\n"

# Pedir dominio
echo -e "${YELLOW}Introduce tu dominio (ej: art-reform.com):${NC}"
read DOMAIN

if [ -z "$DOMAIN" ]; then
    echo -e "${RED}Error: Debes introducir un dominio${NC}"
    exit 1
fi

echo -e "\n${GREEN}[1/7] Actualizando sistema...${NC}"
apt update && apt upgrade -y

echo -e "\n${GREEN}[2/7] Instalando Nginx...${NC}"
apt install nginx -y

echo -e "\n${GREEN}[3/7] Instalando Git...${NC}"
apt install git -y

echo -e "\n${GREEN}[4/7] Instalando Certbot para SSL...${NC}"
apt install certbot python3-certbot-nginx -y

echo -e "\n${GREEN}[5/7] Configurando Firewall...${NC}"
ufw allow 'Nginx Full'
ufw allow OpenSSH
ufw --force enable

echo -e "\n${GREEN}[6/7] Clonando proyecto desde GitHub...${NC}"
mkdir -p /var/www
cd /var/www
if [ -d "artreform" ]; then
    echo -e "${YELLOW}El directorio artreform ya existe. Eliminando...${NC}"
    rm -rf artreform
fi
git clone https://github.com/yassin477/artreform.git artreform

echo -e "\n${GREEN}[7/7] Configurando permisos...${NC}"
chown -R www-data:www-data /var/www/artreform
chmod -R 755 /var/www/artreform

# Crear configuración de Nginx
echo -e "\n${GREEN}Creando configuración de Nginx...${NC}"
cat > /etc/nginx/sites-available/artreform << EOF
server {
    listen 80;
    listen [::]:80;

    server_name $DOMAIN www.$DOMAIN;

    root /var/www/artreform;
    index index.html;

    access_log /var/log/nginx/artreform-access.log;
    error_log /var/log/nginx/artreform-error.log;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json image/svg+xml;

    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|webp|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    location ~* \.json$ {
        expires 1d;
        add_header Cache-Control "public";
    }

    location / {
        try_files \$uri \$uri/ =404;
    }

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    server_tokens off;

    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
}
EOF

# Activar sitio
ln -sf /etc/nginx/sites-available/artreform /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Verificar configuración
echo -e "\n${GREEN}Verificando configuración de Nginx...${NC}"
nginx -t

# Reiniciar Nginx
echo -e "\n${GREEN}Reiniciando Nginx...${NC}"
systemctl restart nginx
systemctl enable nginx

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}  ¡Instalación completada!${NC}"
echo -e "${GREEN}========================================${NC}\n"

echo -e "${YELLOW}SIGUIENTES PASOS:${NC}\n"
echo -e "1. Configura estos registros DNS en Nominalia:"
echo -e "   ${GREEN}Tipo A:${NC} @ → $(curl -s ifconfig.me)"
echo -e "   ${GREEN}Tipo A:${NC} www → $(curl -s ifconfig.me)\n"
echo -e "2. Espera 15-30 minutos a que el DNS se propague\n"
echo -e "3. Verifica con: ${GREEN}ping $DOMAIN${NC}\n"
echo -e "4. Instala SSL con:"
echo -e "   ${GREEN}certbot --nginx -d $DOMAIN -d www.$DOMAIN${NC}\n"
echo -e "5. Visita: ${GREEN}https://$DOMAIN${NC}\n"

echo -e "${YELLOW}Para actualizar el sitio en el futuro:${NC}"
echo -e "   ${GREEN}cd /var/www/artreform && git pull origin main${NC}\n"
