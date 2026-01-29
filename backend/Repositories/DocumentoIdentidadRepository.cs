using Dapper;
using PowerMas.API.Data;
using PowerMas.API.Models;
using System.Data;

namespace PowerMas.API.Repositories;

/// <summary>
/// Repositorio para DocumentoIdentidad usando Dapper y Stored Procedures
/// </summary>
public class DocumentoIdentidadRepository : IDocumentoIdentidadRepository
{
    private readonly DbContext _context;

    public DocumentoIdentidadRepository(DbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<DocumentoIdentidad>> GetActivosAsync()
    {
        using var connection = _context.CreateConnection();
        return await connection.QueryAsync<DocumentoIdentidad>(
            "sp_DocumentoIdentidad_GetActivos",
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<IEnumerable<DocumentoIdentidad>> GetAllAsync()
    {
        using var connection = _context.CreateConnection();
        return await connection.QueryAsync<DocumentoIdentidad>(
            "sp_DocumentoIdentidad_GetAll",
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<DocumentoIdentidad?> GetByIdAsync(int id)
    {
        using var connection = _context.CreateConnection();
        return await connection.QueryFirstOrDefaultAsync<DocumentoIdentidad>(
            "sp_DocumentoIdentidad_GetById",
            new { Id = id },
            commandType: CommandType.StoredProcedure
        );
    }
}
