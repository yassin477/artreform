# Guía de Despliegue - ArtReform

## 📋 Requisitos
- VPS Contabo con Ubuntu 20.04 o superior
- Dominio en Nominalia
- Acceso SSH al servidor
- Repositorio GitHub: https://github.com/yassin477/artreform.git

---

## 🚀 Paso 1: Conexión inicial al servidor

Conéctate a tu VPS desde tu terminal:

```bash
ssh root@TU_IP_DEL_SERVIDOR
```

---

## 🔧 Paso 2: Actualizar el sistema e instalar software necesario

```bash
# Actualizar paquetes
apt update && apt upgrade -y

# Instalar Nginx (servidor web)
apt install nginx -y

# Instalar Git
apt install git -y

# Instalar Certbot (para SSL gratuito)
apt install certbot python3-certbot-nginx -y

# Habilitar firewall
ufw allow 'Nginx Full'
ufw allow OpenSSH
ufw enable
```

---

## 📁 Paso 3: Clonar el proyecto desde GitHub

```bash
# Crear directorio para el sitio
mkdir -p /var/www/artreform

# Clonar el repositorio
cd /var/www
git clone https://github.com/yassin477/artreform.git artreform

# Dar permisos correctos
chown -R www-data:www-data /var/www/artreform
chmod -R 755 /var/www/artreform
```

---

## ⚙️ Paso 4: Configurar Nginx

```bash
# Crear archivo de configuración
nano /etc/nginx/sites-available/artreform
```

**Copia y pega esta configuración** (reemplaza `tudominio.com` con tu dominio real):

```nginx
server {
    listen 80;
    listen [::]:80;

    server_name tudominio.com www.tudominio.com;

    root /var/www/artreform;
    index index.html;

    # Logs
    access_log /var/log/nginx/artreform-access.log;
    error_log /var/log/nginx/artreform-error.log;

    # Comprimir archivos
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Cache para imágenes y assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|webp)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Ruta principal
    location / {
        try_files $uri $uri/ =404;
    }

    # Seguridad
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

**Guardar**: Ctrl+X → Y → Enter

**Activar la configuración:**

```bash
# Crear enlace simbólico
ln -s /etc/nginx/sites-available/artreform /etc/nginx/sites-enabled/

# Eliminar configuración por defecto
rm /etc/nginx/sites-enabled/default

# Verificar configuración
nginx -t

# Reiniciar Nginx
systemctl restart nginx
systemctl enable nginx
```

---

## 🌐 Paso 5: Configurar DNS en Nominalia

Ve a tu panel de Nominalia y configura estos registros DNS:

| Tipo | Nombre | Valor | TTL |
|------|--------|-------|-----|
| A | @ | IP_DE_TU_SERVIDOR | 3600 |
| A | www | IP_DE_TU_SERVIDOR | 3600 |

**Ejemplo:**
- Si tu IP es `45.67.89.123` y tu dominio es `art-reform.com`:
  - **Registro A**: `@` → `45.67.89.123`
  - **Registro A**: `www` → `45.67.89.123`

⏰ **Nota**: Los cambios DNS pueden tardar hasta 24 horas en propagarse (usualmente 15-30 minutos).

---

## 🔒 Paso 6: Instalar certificado SSL (HTTPS)

**Espera** a que el DNS esté propagado (comprueba con `ping tudominio.com`), luego:

```bash
# Obtener certificado SSL gratuito
certbot --nginx -d art-reform.com -d www.art-reform.com
```

Certbot te hará algunas preguntas:
1. **Email**: Tu correo electrónico
2. **Terms of Service**: Yes (A)
3. **Share email**: No (N)
4. **Redirect HTTP to HTTPS**: Yes (2) ← **IMPORTANTE**: Elige esta opción

---

## 🎉 Paso 7: Verificar que todo funciona

Abre tu navegador y visita:
- `http://tudominio.com` (debería redirigir a HTTPS)
- `https://tudominio.com` (debería cargar la web con candado verde)

---

## 🔄 Futuras actualizaciones

Cuando necesites actualizar el sitio:

```bash
# Conectarse al servidor
ssh root@TU_IP_DEL_SERVIDOR

# Ir al directorio del proyecto
cd /var/www/artreform

# Descargar cambios de GitHub
git pull origin main

# Reiniciar Nginx (opcional)
systemctl restart nginx
```

---

## 🐛 Troubleshooting

### No carga la web
```bash
# Ver logs de Nginx
tail -f /var/log/nginx/artreform-error.log

# Ver estado de Nginx
systemctl status nginx

# Reiniciar Nginx
systemctl restart nginx
```

### DNS no resuelve
```bash
# Comprobar si el DNS está propagado
ping tudominio.com
nslookup tudominio.com
```

### Error de permisos
```bash
# Arreglar permisos
chown -R www-data:www-data /var/www/artreform
chmod -R 755 /var/www/artreform
```

---

## 📞 Checklist Final

- [ ] Servidor actualizado e instalado Nginx
- [ ] Proyecto clonado desde GitHub
- [ ] Nginx configurado con el dominio correcto
- [ ] DNS configurado en Nominalia (A records)
- [ ] DNS propagado (ping funciona)
- [ ] Certificado SSL instalado
- [ ] Web carga correctamente en HTTPS

---

## 💡 Mejoras Opcionales

### Auto-renovación SSL
Certbot ya configura auto-renovación, pero puedes verificar:
```bash
certbot renew --dry-run
```

### Reinicio automático de Nginx al arrancar
```bash
systemctl enable nginx
```

### Optimización de imágenes (opcional)
```bash
apt install optipng jpegoptim -y
find /var/www/artreform/images -name "*.jpg" -exec jpegoptim --strip-all --max=85 {} \;
find /var/www/artreform/images -name "*.png" -exec optipng -o5 {} \;
```
