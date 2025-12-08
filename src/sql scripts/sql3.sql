-- Script para insertar datos de ejemplo

USE bdd_prueba1;
GO

-- Insertar usuarios adicionales (si no existen)
IF NOT EXISTS (SELECT * FROM Usuarios WHERE email = 'maria.garcia@example.com')
BEGIN
    INSERT INTO Usuarios (nombre, apellido, email, password, fechaCreacion, activo) VALUES
    ('María', 'García', 'maria.garcia@example.com', 'hashed_password_2', GETDATE(), 1),
    ('Carlos', 'López', 'carlos.lopez@example.com', 'hashed_password_3', GETDATE(), 1),
    ('Ana', 'Martínez', 'ana.martinez@example.com', 'hashed_password_4', GETDATE(), 1),
    ('Juan', 'Rodríguez', 'juan.rodriguez@example.com', 'hashed_password_5', GETDATE(), 1);
END
GO

-- Insertar tareas de ejemplo (mínimo 10 tareas)
IF NOT EXISTS (SELECT * FROM Tareas WHERE titulo = 'Diseñar interfaz de login')
BEGIN
    INSERT INTO Tareas (titulo, descripcion, usuarioId, estadoId, prioridadId, fechaCreacion, fechaVencimiento, fechaCompletacion, completed) VALUES
    -- Tareas para usuario 1 (id=1)
    ('Diseñar interfaz de login', 'Crear mockups y diseño de la página de autenticación', 1, 1, 3, DATEADD(DAY, -5, GETDATE()), DATEADD(DAY, 2, GETDATE()), NULL, 0),
    ('Implementar validación de formularios', 'Agregar validaciones en cliente y servidor', 1, 2, 2, DATEADD(DAY, -3, GETDATE()), DATEADD(DAY, 5, GETDATE()), NULL, 0),
    ('Corregir bug en reportes', 'El reporte mensual no suma correctamente', 1, 1, 4, DATEADD(DAY, -7, GETDATE()), DATEADD(DAY, -1, GETDATE()), NULL, 0),
    
    -- Tareas para usuario 2 (id=2 - María)
    ('Documentar API REST', 'Crear documentación completa de endpoints', 2, 3, 2, DATEADD(DAY, -10, GETDATE()), DATEADD(DAY, -2, GETDATE()), DATEADD(DAY, -1, GETDATE()), 1),
    ('Testing de módulo de usuarios', 'Ejecutar pruebas unitarias e integración', 2, 2, 3, DATEADD(DAY, -4, GETDATE()), DATEADD(DAY, 1, GETDATE()), NULL, 0),
    
    -- Tareas para usuario 3 (id=3 - Carlos)
    ('Optimizar queries de base de datos', 'Revisar índices y mejorar performance', 3, 2, 3, DATEADD(DAY, -6, GETDATE()), DATEADD(DAY, 3, GETDATE()), NULL, 0),
    ('Implementar autenticación OAuth', 'Integrar login con Google y GitHub', 3, 1, 4, DATEADD(DAY, -2, GETDATE()), DATEADD(DAY, 7, GETDATE()), NULL, 0),
    
    -- Tareas para usuario 4 (id=4 - Ana)
    ('Diseñar dashboard principal', 'Crear layout y componentes del dashboard', 4, 1, 2, DATEADD(DAY, -8, GETDATE()), DATEADD(DAY, 4, GETDATE()), NULL, 0),
    ('Revisar código del equipo', 'Code review de pull requests pendientes', 4, 3, 1, DATEADD(DAY, -15, GETDATE()), DATEADD(DAY, -5, GETDATE()), DATEADD(DAY, -4, GETDATE()), 1),
    
    -- Tareas para usuario 5 (id=5 - Juan)
    ('Migrar datos a nuevo servidor', 'Backup y migración de base de datos', 5, 4, 4, DATEADD(DAY, -1, GETDATE()), DATEADD(DAY, 0, GETDATE()), NULL, 0),
    ('Capacitación a nuevos desarrolladores', 'Sesión de onboarding y setup', 5, 1, 1, DATEADD(DAY, -3, GETDATE()), DATEADD(DAY, 10, GETDATE()), NULL, 0);
END
GO

PRINT '✓ Datos de ejemplo insertados exitosamente';
SELECT 'Total de Usuarios:' AS Descripcion, COUNT(*) AS Cantidad FROM Usuarios;
SELECT 'Total de Tareas:' AS Descripcion, COUNT(*) AS Cantidad FROM Tareas;
