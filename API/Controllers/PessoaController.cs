using API.Data;
using API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PessoaController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PessoaController(AppDbContext context)
        {
            _context = context;
        }

        // 1. CADASTRAR UMA PESSOA
        // Valida dados básicos antes de persistir, garantindo integridade dos registros.
        [HttpPost]
        public async Task<ActionResult<Pessoa>> Cadastrar([FromBody] Pessoa pessoa)
        {
            if (string.IsNullOrWhiteSpace(pessoa.Nome))
            {
                return BadRequest("O nome da pessoa é obrigatório.");
            }

            if (pessoa.Idade < 0)
            {
                return BadRequest("A idade não pode ser negativa.");
            }

            _context.Pessoas.Add(pessoa);
            await _context.SaveChangesAsync();
            return Ok(pessoa);
        }

        // 2. LISTAR TODAS AS PESSOAS
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Pessoa>>> Listar()
        {
            return await _context.Pessoas.ToListAsync();
        }

        // 3. DELETAR UMA PESSOA (Regra: Apaga a pessoa e suas transações em cascata)
        [HttpDelete("{id}")]
        public async Task<IActionResult> Deletar(Guid id)
        {
            var pessoa = await _context.Pessoas.FindAsync(id);
            if (pessoa == null)
            {
                return NotFound("Pessoa não encontrada.");
            }

            _context.Pessoas.Remove(pessoa);
            await _context.SaveChangesAsync();
            return Ok("Pessoa e todas as suas transações vinculadas foram removidas com sucesso.");
        }
    }
}