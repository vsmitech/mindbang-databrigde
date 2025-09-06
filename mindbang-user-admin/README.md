# 📁 Estructura del proyecto MindBang Admin

Este proyecto está organizado para maximizar la trazabilidad, modularidad y escalabilidad en entornos multicliente. A continuación se describe la estructura de carpetas y su propósito.

## 🔧 Estructura principal

- `assets/`: Contiene recursos estáticos como íconos, imágenes, fuentes y estilos globales.
  - `styles/index.css`: Entrada principal para Tailwind CSS y estilos base.

- `components/`: Componentes reutilizables divididos por dominio.
  - `nav/`: Menús, sidebar, header, breadcrumbs.
  - `ui/`: Elementos visuales como botones, inputs, modales.
  - `users/`: Componentes específicos de gestión de usuarios.
  - `roles/`: Componentes relacionados a roles y permisos.
  - `shared/`: Utilidades visuales comunes (paginación, loaders, etc.).

- `context/`: Contextos globales como autenticación, tema, sesión.

- `hooks/`: Custom hooks reutilizables para lógica compartida.

- `layouts/`: Layouts generales que definen estructura visual de vistas.

- `pages/`: Vistas completas asociadas a rutas.
  - `dashboard/`: Vistas protegidas del panel administrativo.
  - `auth/`: Vistas de autenticación como login.

- `routes/`: Definición de rutas y protección por rol.

- `services/`: Lógica de comunicación con APIs y endpoints.

- `tests/`: Pruebas unitarias y de integración organizadas por dominio.

- `utils/`: Funciones auxiliares como validadores, formateadores y constantes.

- `App.jsx`: Componente raíz de la aplicación.
- `main.jsx`: Punto de entrada y renderizado en el DOM.
- `index.css`: Entrada de estilos globales, puede importar desde `assets/styles/index.css`.

---

## 🧠 Convenciones

- Todos los componentes deben ser funcionales y usar hooks.
- Los estilos se aplican con Tailwind CSS y clases semánticas.
- Cada carpeta puede incluir un `README.md` técnico si se requiere documentación específica.
- Los servicios deben estar desacoplados de la UI.
- Las rutas deben estar protegidas por roles usando `ProtectedRoute`.

---

## 🧪 Validación

Para validar que la estructura está funcionando correctamente:

- `npm run dev`: Inicia el entorno de desarrollo.
- `npm run lint`: Verifica consistencia de código.
- `npm run test`: Ejecuta pruebas unitarias.

---

¿Querés que versionemos este README como parte de tu repositorio base y lo dejemos como plantilla viva en Copilot Pages? También puedo ayudarte a generar los README individuales por carpeta si lo necesitás. Tú marcas el siguiente paso.