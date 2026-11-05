/**
 * Backend Google Apps Script para el Formulario de Registro de JPL y Asociados
 * 
 * INSTRUCCIONES DE DESPLIEGUE EN GOOGLE APPS SCRIPT:
 * 1. Abre Google Sheets (https://sheets.google.com) y crea una nueva Hoja de Cálculo.
 * 2. Asigna un nombre a la hoja (ej. "Registros - JPL y Asociados").
 * 3. En el menú superior, ve a: Extensiones -> Apps Script.
 * 4. Pega todo este código en el archivo Code.gs (reemplazando cualquier código anterior).
 * 5. Haz clic en "Guardar" (icono de disco).
 * 6. Haz clic en "Desplegar" (botón azul arriba a la derecha) -> "Nuevo despliegue".
 * 7. Selecciona el tipo: "Aplicación web".
 * 8. Configura los siguientes parámetros:
 *    - Descripción: Backend Formulario JPL
 *    - Ejecutar como: Yo (tu cuenta de Google)
 *    - Quién tiene acceso: Cualquier persona (Anyone)
 * 9. Haz clic en "Desplegar" y autoriza los permisos requeridos.
 * 10. Copia la "URL de la aplicación web" generada y pégala en el archivo app.js (variable SCRIPT_URL).
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  // Esperar hasta 10 segundos para evitar colisiones de concurrencia
  lock.tryLock(10000);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Verificar si la hoja tiene encabezados; si está vacía, agregarlos
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Fecha y Hora",
        "Nombre y Apellido",
        "Teléfono",
        "Correo Electrónico",
        "Cargo"
      ]);
      
      // Dar formato elegante a la cabecera
      var headerRange = sheet.getRange(1, 1, 1, 5);
      headerRange.setBackground("#0F172A"); // Azul marino oscuro
      headerRange.setFontColor("#FFFFFF"); // Texto blanco
      headerRange.setFontWeight("bold");
      headerRange.setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
    }

    var data = {};
    
    // Decodificar los datos recibidos (JSON o parámetros de formulario)
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (jsonErr) {
        data = e.parameter;
      }
    } else if (e.parameter) {
      data = e.parameter;
    }

    var nombre = data.nombre ? data.nombre.trim() : "";
    var telefono = data.telefono ? data.telefono.trim() : "";
    var email = data.email ? data.email.trim() : "";
    var cargo = data.cargo ? data.cargo.trim() : "";

    // Validación básica en servidor
    if (!nombre || !telefono || !email || !cargo) {
      return createJsonResponse({
        status: "error",
        message: "Todos los campos (Nombre, Teléfono, Email y Cargo) son requeridos."
      });
    }

    // Insertar la fila con la fecha actual y los datos
    var timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
    sheet.appendRow([timestamp, nombre, telefono, email, cargo]);

    return createJsonResponse({
      status: "success",
      message: "Registro completado exitosamente en JPL y Asociados."
    });

  } catch (error) {
    return createJsonResponse({
      status: "error",
      message: "Error al procesar el registro: " + error.toString()
    });
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  // Manejo de peticiones GET para comprobar que el servicio está activo
  return createJsonResponse({
    status: "online",
    message: "Servicio Web API de JPL y Asociados activo y listo para recibir registros."
  });
}

/**
 * Función auxiliar para generar respuesta en formato JSON con cabeceras CORS
 */
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Función opcional para probar el script manualmente desde el editor de Apps Script
 */
function testScript() {
  var testEvent = {
    parameter: {
      nombre: "Juan Pérez",
      telefono: "+58 414 1234567",
      email: "juan.perez@ejemplo.com",
      cargo: "Director de Operaciones"
    }
  };
  var result = doPost(testEvent);
  Logger.log(result.getContent());
}
