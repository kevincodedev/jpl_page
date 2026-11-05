# Sistema de Registro Web - JPL y Asociados

Página web corporativa simple, moderna y elegante para la captura de datos de personal/contactos de **JPL y Asociados**, conectada con un backend sin servidor en **Google Apps Script (`Code.gs`)** que almacena las entradas directamente en una hoja de cálculo de **Google Sheets**.

---

## 📁 Estructura del Proyecto

```
FormularioRegistro/
├── index.html     # Estructura de la interfaz web corporativa
├── styles.css     # Sistema de diseño, estética ejecutiva y responsividad
├── app.js         # Lógica cliente, validaciones y conexión HTTP
├── Code.gs        # Código backend para Google Apps Script
└── README.md      # Guía de uso e integración
```

---

## 📋 Campos Capturados

1. **Nombre y Apellido** (`nombre`)
2. **Teléfono de Contacto** (`telefono`)
3. **Correo Electrónico** (`email`)
4. **Cargo / Puesto de Trabajo** (`cargo`)
5. **Fecha y Hora** (Generado automáticamente por el servidor `Code.gs` al guardar).

---

## 🚀 Guía de Configuración Paso a Paso

### Paso 1: Crear la Hoja de Cálculo en Google Sheets
1. Ingresa a [Google Sheets](https://sheets.google.com) e inicia sesión con tu cuenta de Google.
2. Crea una nueva Hoja de Cálculo y nómbrala (por ejemplo: `Registros - JPL y Asociados`).

### Paso 2: Configurar Google Apps Script (`Code.gs`)
1. En el menú superior de tu Hoja de Cálculo, haz clic en **Extensiones** ➔ **Apps Script**.
2. Elimina cualquier código por defecto en el editor.
3. Copia y pega el contenido completo del archivo [`Code.gs`](file:///Users/kevinmendoza/Documents/Proyectos/PAFAR_JPL/FormularioRegistro/Code.gs).
4. Haz clic en el icono de **Guardar** (o presiona `Ctrl + S` / `Cmd + S`).

### Paso 3: Desplegar la Aplicación Web (Web App)
1. En la esquina superior derecha del editor de Apps Script, haz clic en **Desplegar** ➔ **Nuevo despliegue**.
2. En el menú lateral izquierdo (icono de engranaje ⚙️), selecciona el tipo **Aplicación web**.
3. Completa los siguientes campos:
   - **Descripción**: `Backend Registro JPL y Asociados`
   - **Ejecutar como**: `Yo` (`tu_cuenta@gmail.com`)
   - **Quién tiene acceso**: `Cualquier persona` (*Anyone*) **⚠️ ¡Muy importante!**
4. Haz clic en **Desplegar**.
5. Si Google te solicita autorizar permisos:
   - Haz clic en *Revisar permisos*.
   - Elige tu cuenta.
   - Haz clic en *Configuración avanzada* ➔ *Ir a Proyecto (no seguro)* ➔ *Permitir*.
6. Al finalizar, copia la **URL de la aplicación web** generada (tendrá un formato similar a: `https://script.google.com/macros/s/AKfycb.../exec`).

### Paso 4: Vincular la URL con la Página Web
Tienes **dos opciones** para vincular la URL generada:

- **Opción A (Recomendada en código)**:
  Abre el archivo [`app.js`](file:///Users/kevinmendoza/Documents/Proyectos/PAFAR_JPL/FormularioRegistro/app.js) y pega la URL en la constante `DEFAULT_SCRIPT_URL`:
  ```javascript
  const DEFAULT_SCRIPT_URL = "https://script.google.com/macros/s/TU_SCRIPT_ID/exec";
  ```

- **Opción B (Desde la interfaz web)**:
  Abre `index.html` en tu navegador. Aparecerá un aviso en la parte superior. Haz clic en **Configurar URL Web App**, pega la URL en el campo de texto y presiona **Guardar URL**. Se guardará automáticamente en tu navegador.

---

## 💻 Ejecución Local de la Página Web

Puedes abrir el archivo `index.html` directamente en cualquier navegador o servirlo mediante un servidor local como:

```bash
npx serve .
```
o con la extensión *Live Server* en VS Code.

---

## 🛡️ Seguridad y Consideraciones
- **Google Apps Script** maneja la concurrencia utilizando `LockService`, lo que evita que varios registros simultáneos sobrescriban filas.
- Si la hoja de cálculo está totalmente vacía al recibir el primer registro, `Code.gs` creará automáticamente la fila de encabezados formateada con el estilo corporativo de JPL y Asociados.
