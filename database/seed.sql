-- =============================================
-- Datos iniciales para DocumentoIdentidad
-- =============================================

USE PowerMasDB;
GO

-- Limpiar datos existentes (para desarrollo)
DELETE FROM Beneficiario;
DELETE FROM DocumentoIdentidad;
GO

-- Resetear identity
DBCC CHECKIDENT ('DocumentoIdentidad', RESEED, 0);
DBCC CHECKIDENT ('Beneficiario', RESEED, 0);
GO

-- =============================================
-- Insertar tipos de documentos por país
-- =============================================

-- Perú
INSERT INTO DocumentoIdentidad (Nombre, Abreviatura, Pais, Longitud, SoloNumeros, Activo)
VALUES 
    ('Documento Nacional de Identidad', 'DNI', 'Perú', 8, 1, 1),
    ('Carné de Extranjería', 'CE', 'Perú', 12, 0, 1),
    ('Pasaporte', 'PAS', 'Perú', 12, 0, 1);

-- Colombia
INSERT INTO DocumentoIdentidad (Nombre, Abreviatura, Pais, Longitud, SoloNumeros, Activo)
VALUES 
    ('Cédula de Ciudadanía', 'CC', 'Colombia', 10, 1, 1),
    ('Tarjeta de Identidad', 'TI', 'Colombia', 11, 1, 1),
    ('Cédula de Extranjería', 'CE', 'Colombia', 10, 0, 1);

-- Ecuador
INSERT INTO DocumentoIdentidad (Nombre, Abreviatura, Pais, Longitud, SoloNumeros, Activo)
VALUES 
    ('Cédula de Identidad', 'CI', 'Ecuador', 10, 1, 1),
    ('Pasaporte', 'PAS', 'Ecuador', 9, 0, 1);

-- Chile
INSERT INTO DocumentoIdentidad (Nombre, Abreviatura, Pais, Longitud, SoloNumeros, Activo)
VALUES 
    ('Rol Único Nacional', 'RUN', 'Chile', 9, 0, 1),
    ('Pasaporte', 'PAS', 'Chile', 9, 0, 1);

-- México
INSERT INTO DocumentoIdentidad (Nombre, Abreviatura, Pais, Longitud, SoloNumeros, Activo)
VALUES 
    ('Clave Única de Registro de Población', 'CURP', 'México', 18, 0, 1),
    ('Instituto Nacional Electoral', 'INE', 'México', 13, 1, 1);

-- Documento inactivo para pruebas
INSERT INTO DocumentoIdentidad (Nombre, Abreviatura, Pais, Longitud, SoloNumeros, Activo)
VALUES 
    ('Libreta Electoral (Obsoleto)', 'LE', 'Perú', 8, 1, 0);

-- ====================================
-- Insertar beneficiarios de ejemplo
-- ====================================

INSERT INTO Beneficiario (Nombres, Apellidos, DocumentoIdentidadId, NumeroDocumento, FechaNacimiento, Sexo)
VALUES 
    ('Juan Carlos', 'García López', 1, '12345678', '1990-05-15', 'M'),       -- DNI Perú (8 digitos)
    ('María Elena', 'Rodríguez Pérez', 1, '87654321', '1985-08-22', 'F'),    -- DNI Perú (8 digitos)
    ('Carlos Alberto', 'Martínez Soto', 4, '1234567890', '1978-03-10', 'M'), -- CC Colombia (10 digitos)
    ('Ana Lucía', 'Fernández Díaz', 8, '098765432', '1992-11-30', 'F'),      -- PAS Ecuador (9 caracteres)
    ('Pedro José', 'Sánchez Vargas', 10, '12345678K', '1988-07-18', 'M');    -- PAS Chile (9 caracteres)

GO

-- Verificar datos insertados
SELECT 'DocumentoIdentidad' AS Tabla, COUNT(*) AS Total FROM DocumentoIdentidad;
SELECT 'Beneficiario' AS Tabla, COUNT(*) AS Total FROM Beneficiario;
GO
