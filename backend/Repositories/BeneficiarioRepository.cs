using Dapper;
using PowerMas.API.Data;
using PowerMas.API.Models;
using PowerMas.API.Models.DTOs;
using System.Data;

namespace PowerMas.API.Repositories;

/// <summary>
/// Repositorio para Beneficiario usando Dapper y Stored Procedures
/// </summary>
public class BeneficiarioRepository : IBeneficiarioRepository
{
    private readonly DbContext _context;

    public BeneficiarioRepository(DbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Beneficiario>> GetAllAsync()
    {
        using var connection = _context.CreateConnection();
        return await connection.QueryAsync<Beneficiario>(
            "sp_Beneficiario_GetAll",
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<Beneficiario?> GetByIdAsync(int id)
    {
        using var connection = _context.CreateConnection();
        return await connection.QueryFirstOrDefaultAsync<Beneficiario>(
            "sp_Beneficiario_GetById",
            new { Id = id },
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<int> CreateAsync(BeneficiarioCreateDto beneficiario)
    {
        using var connection = _context.CreateConnection();
        var result = await connection.QueryFirstOrDefaultAsync<int>(
            "sp_Beneficiario_Create",
            new
            {
                beneficiario.Nombres,
                beneficiario.Apellidos,
                beneficiario.DocumentoIdentidadId,
                beneficiario.NumeroDocumento,
                beneficiario.FechaNacimiento,
                Sexo = beneficiario.Sexo.ToString()
            },
            commandType: CommandType.StoredProcedure
        );
        return result;
    }

    public async Task<int> UpdateAsync(BeneficiarioUpdateDto beneficiario)
    {
        using var connection = _context.CreateConnection();
        var result = await connection.QueryFirstOrDefaultAsync<int>(
            "sp_Beneficiario_Update",
            new
            {
                beneficiario.Id,
                beneficiario.Nombres,
                beneficiario.Apellidos,
                beneficiario.DocumentoIdentidadId,
                beneficiario.NumeroDocumento,
                beneficiario.FechaNacimiento,
                Sexo = beneficiario.Sexo.ToString()
            },
            commandType: CommandType.StoredProcedure
        );
        return result;
    }

    public async Task<int> DeleteAsync(int id)
    {
        using var connection = _context.CreateConnection();
        var result = await connection.QueryFirstOrDefaultAsync<int>(
            "sp_Beneficiario_Delete",
            new { Id = id },
            commandType: CommandType.StoredProcedure
        );
        return result;
    }
}
