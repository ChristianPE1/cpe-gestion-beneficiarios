using Microsoft.AspNetCore.Mvc;
using PowerMas.API.Repositories;

namespace PowerMas.API.Controllers;

/// <summary>
/// Controlador para gestionar Documentos de Identidad
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class DocumentosController : ControllerBase
{
    private readonly IDocumentoIdentidadRepository _repository;
    private readonly ILogger<DocumentosController> _logger;

    public DocumentosController(
        IDocumentoIdentidadRepository repository,
        ILogger<DocumentosController> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    /// <summary>
    /// Obtiene todos los documentos de identidad activos
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetActivos()
    {
        try
        {
            var documentos = await _repository.GetActivosAsync();
            return Ok(documentos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener documentos de identidad activos");
            return StatusCode(500, new { message = "Error interno del servidor" });
        }
    }

    /// <summary>
    /// Obtiene todos los documentos de identidad (incluidos inactivos)
    /// </summary>
    [HttpGet("all")]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var documentos = await _repository.GetAllAsync();
            return Ok(documentos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener todos los documentos de identidad");
            return StatusCode(500, new { message = "Error interno del servidor" });
        }
    }

    /// <summary>
    /// Obtiene un documento de identidad por su ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            var documento = await _repository.GetByIdAsync(id);
            if (documento == null)
            {
                return NotFound(new { message = "Documento de identidad no encontrado" });
            }
            return Ok(documento);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener documento de identidad con ID {Id}", id);
            return StatusCode(500, new { message = "Error interno del servidor" });
        }
    }
}
