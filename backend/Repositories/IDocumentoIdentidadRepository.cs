using PowerMas.API.Models;

namespace PowerMas.API.Repositories;

/// <summary>
/// Interfaz para el repositorio de DocumentoIdentidad
/// </summary>
public interface IDocumentoIdentidadRepository
{
    Task<IEnumerable<DocumentoIdentidad>> GetActivosAsync();
    Task<IEnumerable<DocumentoIdentidad>> GetAllAsync();
    Task<DocumentoIdentidad?> GetByIdAsync(int id);
}
