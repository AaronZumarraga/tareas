-- SELECT básicos para cada tabla

USE bdd_prueba1;
GO

-- 1. Obtener todos los usuarios
SELECT * FROM Usuarios;

-- 2. Obtener todos los estados
SELECT * FROM Estados;

-- 3. Obtener todas las prioridades
SELECT * FROM Prioridades;

-- 4. Obtener todas las tareas
SELECT * FROM Tareas;

-- 5. Obtener tareas con información completa (JOIN)
SELECT 
    t.id,
    t.titulo,
    t.descripcion,
    u.nombre + ' ' + u.apellido AS usuario,
    e.nombre AS estado,
    p.nombre AS prioridad,
    t.fechaCreacion,
    t.fechaVencimiento,
    t.fechaCompletacion
FROM Tareas t
INNER JOIN Usuarios u ON t.usuarioId = u.id
INNER JOIN Estados e ON t.estadoId = e.id
INNER JOIN Prioridades p ON t.prioridadId = p.id;

-- 6. Obtener tareas por usuario específico
SELECT 
    t.id,
    t.titulo,
    e.nombre AS estado,
    p.nombre AS prioridad,
    t.fechaVencimiento
FROM Tareas t
INNER JOIN Estados e ON t.estadoId = e.id
INNER JOIN Prioridades p ON t.prioridadId = p.id
WHERE t.usuarioId = 1; -- Cambiar el ID según sea necesario

-- 7. Obtener tareas pendientes
SELECT 
    t.id,
    t.titulo,
    u.nombre + ' ' + u.apellido AS usuario,
    p.nombre AS prioridad,
    t.fechaVencimiento
FROM Tareas t
INNER JOIN Usuarios u ON t.usuarioId = u.id
INNER JOIN Estados e ON t.estadoId = e.id
INNER JOIN Prioridades p ON t.prioridadId = p.id
WHERE e.nombre = 'Pendiente'
ORDER BY p.nivel DESC, t.fechaVencimiento ASC;

-- 8. Obtener tareas por prioridad
SELECT 
    t.id,
    t.titulo,
    u.nombre + ' ' + u.apellido AS usuario,
    e.nombre AS estado,
    t.fechaVencimiento
FROM Tareas t
INNER JOIN Usuarios u ON t.usuarioId = u.id
INNER JOIN Estados e ON t.estadoId = e.id
INNER JOIN Prioridades p ON t.prioridadId = p.id
WHERE p.nombre = 'Alta' -- Cambiar según sea necesario
ORDER BY t.fechaVencimiento ASC;

-- 9. Contar tareas por estado
SELECT 
    e.nombre AS estado,
    COUNT(t.id) AS cantidad
FROM Estados e
LEFT JOIN Tareas t ON e.id = t.estadoId
GROUP BY e.id, e.nombre;

-- 10. Tareas vencidas (fecha de vencimiento menor a hoy)
SELECT 
    t.id,
    t.titulo,
    u.nombre + ' ' + u.apellido AS usuario,
    e.nombre AS estado,
    p.nombre AS prioridad,
    t.fechaVencimiento,
    DATEDIFF(DAY, t.fechaVencimiento, GETDATE()) AS diasVencido
FROM Tareas t
INNER JOIN Usuarios u ON t.usuarioId = u.id
INNER JOIN Estados e ON t.estadoId = e.id
INNER JOIN Prioridades p ON t.prioridadId = p.id
WHERE t.fechaVencimiento < CAST(GETDATE() AS DATE)
  AND e.nombre != 'Completada'
ORDER BY diasVencido DESC;