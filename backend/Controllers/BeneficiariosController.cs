using Microsoft.AspNetCore.Mvc;
using PowerMas.API.Models.DTOs;
using PowerMas.API.Repositories;

namespace PowerMas.API.Controllers;

/// <summary>
/// Controlador para gestionar Beneficiarios
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class BeneficiariosController : ControllerBase
{
    private readonly IBeneficiarioRepository _repository;
    private readonly IDocumentoIdentidadRepository _documentoRepository;
    private readonly ILogger<BeneficiariosController> _logger;

    public BeneficiariosController(
        IBeneficiarioRepository repository,
        IDocumentoIdentidadRepository documentoRepository,
        ILogger<BeneficiariosController> logger)
    {
        _repository = repository;
        _documentoRepository = documentoRepository;
        _logger = logger;
    }

    /// <summary>
    /// Obtiene todos los beneficiarios
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var beneficiarios = await _repository.GetAllAsync();
            return Ok(beneficiarios);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener beneficiarios");
            return StatusCode(500, new { message = "Error interno del servidor" });
        }
    }

    /// <summary>
    /// Obtiene un beneficiario por su ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            var beneficiario = await _repository.GetByIdAsync(id);
            if (beneficiario == null)
            {
                return NotFound(new { message = "Beneficiario no encontrado" });
            }
            return Ok(beneficiario);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener beneficiario con ID {Id}", id);
            return StatusCode(500, new { message = "Error interno del servidor" });
        }
    }

    /// <summary>
    /// Crea un nuevo beneficiario
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] BeneficiarioCreateDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Validar que el documento de identidad existe y está activo
            var documento = await _documentoRepository.GetByIdAsync(dto.DocumentoIdentidadId);
            if (documento == null || !documento.Activo)
            {
                return BadRequest(new { message = "El tipo de documento de identidad no es válido o no está activo" });
            }

            // Validar longitud del número de documento
            if (dto.NumeroDocumento.Length != documento.Longitud)
            {
                return BadRequest(new { message = $"El número de documento debe tener exactamente {documento.Longitud} caracteres" });
            }

            // Validar si solo acepta números
            if (documento.SoloNumeros && !dto.NumeroDocumento.All(char.IsDigit))
            {
                return BadRequest(new { message = "El número de documento solo debe contener números" });
            }

            var id = await _repository.CreateAsync(dto);
            var beneficiario = await _repository.GetByIdAsync(id);
            
            return CreatedAtAction(nameof(GetById), new { id }, beneficiario);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al crear beneficiario");
            
            // Verificar si es un error de duplicado
            if (ex.Message.Contains("Ya existe"))
            {
                return Conflict(new { message = ex.Message });
            }
            
            return StatusCode(500, new { message = "Error interno del servidor" });
        }
    }

    /// <summary>
    /// Actualiza un beneficiario existente
    /// </summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] BeneficiarioUpdateDto dto)
    {
        try
        {
            if (id != dto.Id)
            {
                return BadRequest(new { message = "El ID de la URL no coincide con el ID del cuerpo" });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Verificar que el beneficiario existe
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null)
            {
                return NotFound(new { message = "Beneficiario no encontrado" });
            }

            // Validar que el documento de identidad existe y está activo
            var documento = await _documentoRepository.GetByIdAsync(dto.DocumentoIdentidadId);
            if (documento == null || !documento.Activo)
            {
                return BadRequest(new { message = "El tipo de documento de identidad no es válido o no está activo" });
            }

            // Validar longitud del número de documento
            if (dto.NumeroDocumento.Length != documento.Longitud)
            {
                return BadRequest(new { message = $"El número de documento debe tener exactamente {documento.Longitud} caracteres" });
            }

            // Validar si solo acepta números
            if (documento.SoloNumeros && !dto.NumeroDocumento.All(char.IsDigit))
            {
                return BadRequest(new { message = "El número de documento solo debe contener números" });
            }

            await _repository.UpdateAsync(dto);
            var beneficiario = await _repository.GetByIdAsync(id);
            
            return Ok(beneficiario);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al actualizar beneficiario con ID {Id}", id);
            
            if (ex.Message.Contains("Ya existe"))
            {
                return Conflict(new { message = ex.Message });
            }
            
            return StatusCode(500, new { message = "Error interno del servidor" });
        }
    }

    /// <summary>
    /// Elimina un beneficiario
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null)
            {
                return NotFound(new { message = "Beneficiario no encontrado" });
            }

            await _repository.DeleteAsync(id);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al eliminar beneficiario con ID {Id}", id);
            return StatusCode(500, new { message = "Error interno del servidor" });
        }
    }
}
