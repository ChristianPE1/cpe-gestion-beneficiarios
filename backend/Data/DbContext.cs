using Microsoft.Data.SqlClient;
using System.Data;

namespace PowerMas.API.Data;

/// <summary>
/// Contexto de base de datos para conexiones SQL Server
/// </summary>
public class DbContext
{
    private readonly string _connectionString;

    public DbContext(IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection") 
            ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
        
        // Support environment variable substitution for production (AWS RDS)
        _connectionString = connectionString
            .Replace("${DB_HOST}", Environment.GetEnvironmentVariable("DB_HOST") ?? "localhost")
            .Replace("${DB_NAME}", Environment.GetEnvironmentVariable("DB_NAME") ?? "PowerMasDB")
            .Replace("${DB_USER}", Environment.GetEnvironmentVariable("DB_USER") ?? "sa")
            .Replace("${DB_PASSWORD}", Environment.GetEnvironmentVariable("DB_PASSWORD") ?? "");
    }

    public IDbConnection CreateConnection()
    {
        return new SqlConnection(_connectionString);
    }
}
