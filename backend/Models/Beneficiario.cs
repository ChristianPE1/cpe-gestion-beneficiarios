namespace PowerMas.API.Models;

/// <summary>
/// Representa un beneficiario del programa social
/// </summary>
public class Beneficiario
{
    public int Id { get; set; }
    public string Nombres { get; set; } = string.Empty;
    public string Apellidos { get; set; } = string.Empty;
    public int DocumentoIdentidadId { get; set; }
    public string NumeroDocumento { get; set; } = string.Empty;
    public DateTime FechaNacimiento { get; set; }
    public char Sexo { get; set; }
    
    // Propiedades de navegación (para JOINs)
    public string? TipoDocumento { get; set; }
    public string? AbreviaturaDocumento { get; set; }
    public string? Pais { get; set; }
}
