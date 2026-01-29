using System.ComponentModel.DataAnnotations;

namespace PowerMas.API.Models.DTOs;

/// <summary>
/// DTO para crear o actualizar un beneficiario
/// </summary>
public class BeneficiarioCreateDto
{
    [Required(ErrorMessage = "Los nombres son requeridos")]
    [MaxLength(100, ErrorMessage = "Los nombres no pueden exceder 100 caracteres")]
    public string Nombres { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Los apellidos son requeridos")]
    [MaxLength(100, ErrorMessage = "Los apellidos no pueden exceder 100 caracteres")]
    public string Apellidos { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "El tipo de documento es requerido")]
    public int DocumentoIdentidadId { get; set; }
    
    [Required(ErrorMessage = "El número de documento es requerido")]
    [MaxLength(20, ErrorMessage = "El número de documento no puede exceder 20 caracteres")]
    public string NumeroDocumento { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "La fecha de nacimiento es requerida")]
    public DateTime FechaNacimiento { get; set; }
    
    [Required(ErrorMessage = "El sexo es requerido")]
    [RegularExpression("^[MF]$", ErrorMessage = "El sexo debe ser M o F")]
    public char Sexo { get; set; }
}
