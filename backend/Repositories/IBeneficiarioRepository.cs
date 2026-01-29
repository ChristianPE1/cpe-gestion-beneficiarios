using PowerMas.API.Models;
using PowerMas.API.Models.DTOs;

namespace PowerMas.API.Repositories;

/// <summary>
/// Interfaz para el repositorio de Beneficiario
/// </summary>
public interface IBeneficiarioRepository
{
    Task<IEnumerable<Beneficiario>> GetAllAsync();
    Task<Beneficiario?> GetByIdAsync(int id);
    Task<int> CreateAsync(BeneficiarioCreateDto beneficiario);
    Task<int> UpdateAsync(BeneficiarioUpdateDto beneficiario);
    Task<int> DeleteAsync(int id);
}
