-- =============================================
-- SCHEMA: Sistema de Gestión de Beneficiarios
-- =============================================

-- Crear base de datos si no existe
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'PowerMasDB')
BEGIN
    CREATE DATABASE PowerMasDB;
END
GO

USE PowerMasDB;
GO

-- =============================================
-- Tabla: DocumentoIdentidad
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DocumentoIdentidad]') AND type in (N'U'))
BEGIN
    CREATE TABLE DocumentoIdentidad (
        Id INT PRIMARY KEY IDENTITY(1,1),
        Nombre VARCHAR(50) NOT NULL,
        Abreviatura VARCHAR(10) NOT NULL,
        Pais VARCHAR(50) NOT NULL,
        Longitud INT NOT NULL,
        SoloNumeros BIT NOT NULL DEFAULT 1,
        Activo BIT NOT NULL DEFAULT 1
    );
END
GO

-- =============================================
-- Tabla: Beneficiario
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Beneficiario]') AND type in (N'U'))
BEGIN
    CREATE TABLE Beneficiario (
        Id INT PRIMARY KEY IDENTITY(1,1),
        Nombres VARCHAR(100) NOT NULL,
        Apellidos VARCHAR(100) NOT NULL,
        DocumentoIdentidadId INT NOT NULL,
        NumeroDocumento VARCHAR(20) NOT NULL,
        FechaNacimiento DATE NOT NULL,
        Sexo CHAR(1) NOT NULL CHECK (Sexo IN ('M', 'F')),
        CONSTRAINT FK_Beneficiario_DocumentoIdentidad 
            FOREIGN KEY (DocumentoIdentidadId) 
            REFERENCES DocumentoIdentidad(Id)
    );
END
GO

-- Índice para búsquedas por documento
CREATE INDEX IX_Beneficiario_NumeroDocumento 
ON Beneficiario(NumeroDocumento);
GO

PRINT 'Schema creado exitosamente';
GO
