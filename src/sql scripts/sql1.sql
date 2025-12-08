-- Crear base de datos si no existe
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'bdd_prueba1')
BEGIN
    CREATE DATABASE bdd_prueba1;
END
GO

USE bdd_prueba1;
GO

-- Tabla de Usuarios
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Usuarios')
BEGIN
    CREATE TABLE Usuarios (
        id INT PRIMARY KEY IDENTITY(1,1),
        nombre NVARCHAR(100) NOT NULL,
        apellido NVARCHAR(100) NOT NULL,
        email NVARCHAR(150) UNIQUE NOT NULL,
        password NVARCHAR(255) NOT NULL,
        fechaCreacion DATETIME DEFAULT GETDATE(),
        activo BIT DEFAULT 1
    );
END
GO

-- Tabla de Estados
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Estados')
BEGIN
    CREATE TABLE Estados (
        id INT PRIMARY KEY IDENTITY(1,1),
        nombre NVARCHAR(50) UNIQUE NOT NULL,
        descripcion NVARCHAR(255)
    );
    
    -- Insertar estados predefinidos
    INSERT INTO Estados (nombre, descripcion) VALUES
    ('Pendiente', 'Tarea pendiente de realizar'),
    ('En Progreso', 'Tarea en ejecución'),
    ('Completada', 'Tarea finalizada'),
    ('Cancelada', 'Tarea cancelada');
END
GO

-- Tabla de Prioridades
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Prioridades')
BEGIN
    CREATE TABLE Prioridades (
        id INT PRIMARY KEY IDENTITY(1,1),
        nombre NVARCHAR(50) UNIQUE NOT NULL,
        nivel INT NOT NULL
    );
    
    -- Insertar prioridades predefinidas
    INSERT INTO Prioridades (nombre, nivel) VALUES
    ('Baja', 1),
    ('Media', 2),
    ('Alta', 3),
    ('Urgente', 4);
END
GO

-- Tabla de Tareas
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Tareas')
BEGIN
    CREATE TABLE Tareas (
        id INT PRIMARY KEY IDENTITY(1,1),
        titulo NVARCHAR(255) NOT NULL,
        descripcion NVARCHAR(500),
        usuarioId INT NOT NULL,
        estadoId INT NOT NULL DEFAULT 1,
        prioridadId INT NOT NULL DEFAULT 2,
        completed BIT DEFAULT 0,
        fechaCreacion DATETIME DEFAULT GETDATE(),
        fechaVencimiento DATETIME,
        fechaCompletacion DATETIME,
        fechaModificacion DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (usuarioId) REFERENCES Usuarios(id),
        FOREIGN KEY (estadoId) REFERENCES Estados(id),
        FOREIGN KEY (prioridadId) REFERENCES Prioridades(id)
    );
END
ELSE
BEGIN
    -- Agregar columna completed si no existe
    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Tareas') AND name = 'completed')
    BEGIN
        ALTER TABLE Tareas ADD completed BIT DEFAULT 0;
    END
END
GO

-- Crear índices para mejores búsquedas
IF NOT EXISTS (SELECT name FROM sys.indexes WHERE name = 'idx_tareas_usuario' AND object_id = OBJECT_ID('Tareas'))
BEGIN
    CREATE INDEX idx_tareas_usuario ON Tareas(usuarioId);
END

IF NOT EXISTS (SELECT name FROM sys.indexes WHERE name = 'idx_tareas_estado' AND object_id = OBJECT_ID('Tareas'))
BEGIN
    CREATE INDEX idx_tareas_estado ON Tareas(estadoId);
END

IF NOT EXISTS (SELECT name FROM sys.indexes WHERE name = 'idx_tareas_prioridad' AND object_id = OBJECT_ID('Tareas'))
BEGIN
    CREATE INDEX idx_tareas_prioridad ON Tareas(prioridadId);
END

IF NOT EXISTS (SELECT name FROM sys.indexes WHERE name = 'idx_tareas_fechaVencimiento' AND object_id = OBJECT_ID('Tareas'))
BEGIN
    CREATE INDEX idx_tareas_fechaVencimiento ON Tareas(fechaVencimiento);
END
GO

PRINT '✓ Base de datos y tablas creadas exitosamente';

-- (Se retira la inserción de usuario de ejemplo para evitar contraseñas sin hash)