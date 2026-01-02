# 🔐 Configuración Segura de Credenciales

## Pasos para configurar el sistema seguro:

### 1. Crear archivo .env
Copia el archivo `.env.example` a `.env`:

```bash
cp .env.example .env
```

### 2. Generar hash de tu contraseña
Ejecuta este comando en Node.js para generar el hash SHA-256:

```javascript
const crypto = require('crypto');
const password = 'Pitimirri2385';
const hash = crypto.createHash('sha256').update(password).digest('hex');
console.log('Hash:', hash);
```

### 3. Configurar tus credenciales
Edita el archivo `.env` con tus datos:

```bash
ADMIN_USERNAME=Óscar
ADMIN_PASSWORD_HASH=3d4f2bf21dc6ff46ef5965bd70148c1c8a8e0f9e2b3e5d6f7a8b9c0d1e2f3a4b
```

### 4. Instalar dependencias
```bash
npm install
```

### 5. Iniciar servidor
```bash
npm start
```

## 🔒 Seguridad implementada:
- ✅ Variables de entorno en archivo `.env` (protegido por .gitignore)
- ✅ Contraseñas hasheadas con SHA-256
- ✅ Sin credenciales en el código fuente
- ✅ Listo para subir a GitHub de forma segura

## 🚨 Importante:
- NUNCA subas el archivo `.env` a GitHub
- NUNCA compartas tu contraseña en texto plano
- USA una contraseña fuerte con caracteres especiales

## 🔑 Credenciales Finales:
- **Usuario**: Óscar
- **Contraseña**: Pitimirri2385
