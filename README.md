# ArtReform - Website de Pladur en Mallorca

Sitio web profesional para ArtReform, especialista en instalación de pladur en Palma de Mallorca.

## 🌟 Características

- **Diseño Responsive**: Se adapta perfectamente a móviles, tablets y escritorio
- **Galería de Proyectos**: 52 imágenes con paginación y modal de visualización
- **Formulario de Contacto**: Integrado con EmailJS para recibir consultas
- **SEO Optimizado**: Meta tags, Open Graph para redes sociales
- **Logo Watermark**: Marca de agua automática en imágenes de galería
- **Animaciones Suaves**: Efectos de scroll y transiciones profesionales

## 📁 Estructura del Proyecto

```
artreform/
├── index.html              # Página principal
├── styles.css              # Estilos globales
├── script.js               # JavaScript principal
├── data.json              # Datos de la galería
├── web-logo.png           # Logo para watermark
├── images/                # Imágenes del proyecto
│   ├── IMG-*.jpg          # Galería de proyectos
│   ├── cliente*.jpg       # Testimonios
│   └── *.jpg              # Otras imágenes
├── deploy-guide.md        # Guía detallada de despliegue
├── nginx-config.conf      # Configuración de Nginx
└── server-setup.sh        # Script de instalación automática
```

## 🚀 Despliegue Rápido

### Método 1: Script Automático (Recomendado)

1. **Conecta a tu servidor VPS:**
   ```bash
   ssh root@TU_IP_DEL_SERVIDOR
   ```

2. **Descarga y ejecuta el script:**
   ```bash
   wget https://raw.githubusercontent.com/yassin477/artreform/main/server-setup.sh
   chmod +x server-setup.sh
   ./server-setup.sh
   ```

3. **Sigue las instrucciones** que aparecen en pantalla

### Método 2: Instalación Manual

Consulta [deploy-guide.md](deploy-guide.md) para instrucciones detalladas paso a paso.

## 🌐 Configuración DNS en Nominalia

Después de ejecutar el script, configura estos registros en tu panel de Nominalia:

| Tipo | Nombre | Valor | TTL |
|------|--------|-------|-----|
| A | @ | TU_IP_DEL_SERVIDOR | 3600 |
| A | www | TU_IP_DEL_SERVIDOR | 3600 |

**Ejemplo**: Si tu IP es `45.67.89.123`:
- Registro A: `@` → `45.67.89.123`
- Registro A: `www` → `45.67.89.123`

## 🔒 Certificado SSL (HTTPS)

Una vez el DNS esté propagado (15-30 minutos):

```bash
certbot --nginx -d tudominio.com -d www.tudominio.com
```

## 🔄 Actualizar el Sitio

Cuando hagas cambios en el código:

```bash
# En tu computadora
git add .
git commit -m "Descripción de cambios"
git push origin main

# En el servidor
ssh root@TU_IP_DEL_SERVIDOR
cd /var/www/artreform
git pull origin main
```

## 🛠️ Desarrollo Local

Para trabajar en el proyecto localmente:

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/yassin477/artreform.git
   cd artreform
   ```

2. **Abrir con Live Server** (extensión de VS Code) o cualquier servidor local

3. **Hacer cambios** en los archivos HTML, CSS o JavaScript

4. **Probar** en el navegador antes de hacer push

## 📧 Configuración de EmailJS

El formulario de contacto está configurado con EmailJS. Credenciales actuales:

- **Service ID**: `service_o0pqgxg`
- **Template ID**: `template_c94gqnm`
- **Public Key**: `IcwFbsNbH4KUAq1MF`

**Importante**: Estos son datos sensibles. No los compartas públicamente.

## 🐛 Troubleshooting

### La web no carga
```bash
# Ver logs de errores
ssh root@TU_IP_DEL_SERVIDOR
tail -f /var/log/nginx/artreform-error.log
```

### El formulario no envía emails
- Verifica la configuración de EmailJS en [script.js](script.js)
- Comprueba la cuota de emails en tu cuenta de EmailJS

### Las imágenes no cargan
```bash
# Verificar permisos
chown -R www-data:www-data /var/www/artreform
chmod -R 755 /var/www/artreform
```

## 📞 Soporte

Para reportar problemas o sugerencias, contacta al desarrollador.

## 📄 Licencia

Proyecto privado para ArtReform - Todos los derechos reservados

---

**Desarrollado con ❤️ para ArtReform**
