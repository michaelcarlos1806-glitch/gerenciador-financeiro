using API.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Configuração do Banco de Dados
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=banco.db"));

// Configuração do CORS (Resolve o erro de bloqueio de origem)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Configura os controllers e evita erro de ciclo de referência ao serializar JSON
// (Pessoa -> Transacoes -> Pessoa -> ...)
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

var app = builder.Build();

// Aplica o CORS antes de qualquer outra coisa
app.UseCors("AllowAll");

app.UseAuthorization();
app.MapControllers();
app.Run();