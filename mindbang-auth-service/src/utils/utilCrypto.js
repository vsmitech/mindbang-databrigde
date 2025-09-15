import  crypto from 'node:crypto';
/**
 * Genera una API Key única y segura para una aplicación.
 * La API Key tiene el formato: {application-name}-{timestamp}-{random-string}
 * - application-name: Nombre de la aplicación en minúsculas y sin espacios.
 * - timestamp: Marca de tiempo en base36 para mayor compacidad.
 * - random-string: Cadena aleatoria de 48 caracteres hexadecimales (24 bytes).
 **/
export function generateApiKey(applicationName) {
    const prefix = applicationName.toLowerCase().replace(/\s+/g, '-'); // ej: "MindBang Admin" → "mindbang-admin"
    const randomPart = crypto.randomBytes(24).toString('hex'); // 48 caracteres hex
    const timestamp = Date.now().toString(36); // base36 para compacidad
    return `${prefix}-${timestamp}-${randomPart}`;
}