-- ====================
-- STORED PROCEDURES
-- ====================

USE PowerMasDB;
GO

-- =============================================
-- SP: Obtener todos los documentos de identidad activos
-- =============================================
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_DocumentoIdentidad_GetActivos')
    DROP PROCEDURE sp_DocumentoIdentidad_GetActivos;
GO

CREATE PROCEDURE sp_DocumentoIdentidad_GetActivos
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        Id,
        Nombre,
        Abreviatura,
        Pais,
        Longitud,
        SoloNumeros,
        Activo
    FROM DocumentoIdentidad
    WHERE Activo = 1
    ORDER BY Pais, Nombre;
END
GO

-- =============================================
-- SP: Obtener todos los documentos de identidad
-- =============================================
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_DocumentoIdentidad_GetAll')
    DROP PROCEDURE sp_DocumentoIdentidad_GetAll;
GO

CREATE PROCEDURE sp_DocumentoIdentidad_GetAll
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        Id,
        Nombre,
        Abreviatura,
        Pais,
        Longitud,
        SoloNumeros,
        Activo
    FROM DocumentoIdentidad
    ORDER BY Pais, Nombre;
END
GO

-- =============================================
-- SP: Obtener documento de identidad por ID
-- =============================================
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_DocumentoIdentidad_GetById')
    DROP PROCEDURE sp_DocumentoIdentidad_GetById;
GO

CREATE PROCEDURE sp_DocumentoIdentidad_GetById
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        Id,
        Nombre,
        Abreviatura,
        Pais,
        Longitud,
        SoloNumeros,
        Activo
    FROM DocumentoIdentidad
    WHERE Id = @Id;
END
GO

-- =============================================
-- SP: Obtener todos los beneficiarios
-- =============================================
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_Beneficiario_GetAll')
    DROP PROCEDURE sp_Beneficiario_GetAll;
GO

CREATE PROCEDURE sp_Beneficiario_GetAll
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        b.Id,
        b.Nombres,
        b.Apellidos,
        b.DocumentoIdentidadId,
        b.NumeroDocumento,
        b.FechaNacimiento,
        b.Sexo,
        d.Nombre AS TipoDocumento,
        d.Abreviatura AS AbreviaturaDocumento,
        d.Pais
    FROM Beneficiario b
    INNER JOIN DocumentoIdentidad d ON b.DocumentoIdentidadId = d.Id
    ORDER BY b.Apellidos, b.Nombres;
END
GO

-- =============================================
-- SP: Obtener beneficiario por ID
-- =============================================
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_Beneficiario_GetById')
    DROP PROCEDURE sp_Beneficiario_GetById;
GO

CREATE PROCEDURE sp_Beneficiario_GetById
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        b.Id,
        b.Nombres,
        b.Apellidos,
        b.DocumentoIdentidadId,
        b.NumeroDocumento,
        b.FechaNacimiento,
        b.Sexo,
        d.Nombre AS TipoDocumento,
        d.Abreviatura AS AbreviaturaDocumento,
        d.Pais
    FROM Beneficiario b
    INNER JOIN DocumentoIdentidad d ON b.DocumentoIdentidadId = d.Id
    WHERE b.Id = @Id;
END
GO

-- =============================================
-- SP: Crear nuevo beneficiario
-- =============================================
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_Beneficiario_Create')
    DROP PROCEDURE sp_Beneficiario_Create;
GO

CREATE PROCEDURE sp_Beneficiario_Create
    @Nombres VARCHAR(100),
    @Apellidos VARCHAR(100),
    @DocumentoIdentidadId INT,
    @NumeroDocumento VARCHAR(20),
    @FechaNacimiento DATE,
    @Sexo CHAR(1)
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Validar que el documento de identidad exista y esté activo
    IF NOT EXISTS (SELECT 1 FROM DocumentoIdentidad WHERE Id = @DocumentoIdentidadId AND Activo = 1)
    BEGIN
        RAISERROR('El tipo de documento de identidad no es válido o no está activo.', 16, 1);
        RETURN;
    END
    
    -- Validar que no exista otro beneficiario con el mismo número de documento
    IF EXISTS (SELECT 1 FROM Beneficiario WHERE NumeroDocumento = @NumeroDocumento AND DocumentoIdentidadId = @DocumentoIdentidadId)
    BEGIN
        RAISERROR('Ya existe un beneficiario con este número de documento.', 16, 1);
        RETURN;
    END
    
    INSERT INTO Beneficiario (Nombres, Apellidos, DocumentoIdentidadId, NumeroDocumento, FechaNacimiento, Sexo)
    VALUES (@Nombres, @Apellidos, @DocumentoIdentidadId, @NumeroDocumento, @FechaNacimiento, @Sexo);
    
    -- Retornar el ID del nuevo registro
    SELECT SCOPE_IDENTITY() AS Id;
END
GO

-- =============================================
-- SP: Actualizar beneficiario
-- =============================================
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_Beneficiario_Update')
    DROP PROCEDURE sp_Beneficiario_Update;
GO

CREATE PROCEDURE sp_Beneficiario_Update
    @Id INT,
    @Nombres VARCHAR(100),
    @Apellidos VARCHAR(100),
    @DocumentoIdentidadId INT,
    @NumeroDocumento VARCHAR(20),
    @FechaNacimiento DATE,
    @Sexo CHAR(1)
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Validar que el beneficiario exista
    IF NOT EXISTS (SELECT 1 FROM Beneficiario WHERE Id = @Id)
    BEGIN
        RAISERROR('El beneficiario no existe.', 16, 1);
        RETURN;
    END
    
    -- Validar que el documento de identidad exista y esté activo
    IF NOT EXISTS (SELECT 1 FROM DocumentoIdentidad WHERE Id = @DocumentoIdentidadId AND Activo = 1)
    BEGIN
        RAISERROR('El tipo de documento de identidad no es válido o no está activo.', 16, 1);
        RETURN;
    END
    
    -- Validar que no exista otro beneficiario con el mismo número de documento (excluyendo el actual)
    IF EXISTS (SELECT 1 FROM Beneficiario WHERE NumeroDocumento = @NumeroDocumento AND DocumentoIdentidadId = @DocumentoIdentidadId AND Id != @Id)
    BEGIN
        RAISERROR('Ya existe otro beneficiario con este número de documento.', 16, 1);
        RETURN;
    END
    
    UPDATE Beneficiario
    SET 
        Nombres = @Nombres,
        Apellidos = @Apellidos,
        DocumentoIdentidadId = @DocumentoIdentidadId,
        NumeroDocumento = @NumeroDocumento,
        FechaNacimiento = @FechaNacimiento,
        Sexo = @Sexo
    WHERE Id = @Id;
    
    SELECT @Id AS Id;
END
GO

-- =============================================
-- SP: Eliminar beneficiario
-- =============================================
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_Beneficiario_Delete')
    DROP PROCEDURE sp_Beneficiario_Delete;
GO

CREATE PROCEDURE sp_Beneficiario_Delete
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Validar que el beneficiario exista
    IF NOT EXISTS (SELECT 1 FROM Beneficiario WHERE Id = @Id)
    BEGIN
        RAISERROR('El beneficiario no existe.', 16, 1);
        RETURN;
    END
    
    DELETE FROM Beneficiario WHERE Id = @Id;
    
    SELECT @Id AS Id;
END
GO

PRINT 'Stored Procedures creados exitosamente';
GO
