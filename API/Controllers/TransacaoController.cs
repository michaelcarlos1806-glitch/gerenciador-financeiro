using API.Data;
using API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransacaoController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TransacaoController(AppDbContext context)
        {
            _context = context;
        }

        // 1. CADASTRAR UMA TRANSAÇÃO
        // Regra de negócio: se a pessoa for menor de idade (< 18 anos),
        // só é permitido cadastrar transações do tipo "despesa".
        [HttpPost]
        public async Task<ActionResult<Transacao>> Cadastrar([FromBody] Transacao transacao)
        {
            var pessoa = await _context.Pessoas.FindAsync(transacao.PessoaId);
            if (pessoa == null)
            {
                return BadRequest("Pessoa não encontrada. Verifique o PessoaId informado.");
            }

            if (pessoa.Idade < 18 && transacao.Tipo?.ToLower() != "despesa")
            {
                return BadRequest("Pessoas menores de 18 anos só podem cadastrar transações do tipo 'despesa'.");
            }

            _context.Transacoes.Add(transacao);
            await _context.SaveChangesAsync();
            return Ok(transacao);
        }

        // 2. LISTAR TODAS AS TRANSAÇÕES
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Transacao>>> Listar()
        {
            return await _context.Transacoes.ToListAsync();
        }

        // 3. RELATÓRIO DE TOTAIS
        // Retorna o resumo de receitas, despesas e saldo por pessoa,
        // além dos totais gerais. Busca listas separadas (pessoas e transações)
        // e faz o cálculo em memória, evitando problemas de navegação do EF.
        [HttpGet("relatorio")]
        public async Task<IActionResult> ObterTotais()
        {
            var pessoas = await _context.Pessoas.ToListAsync();
            var transacoes = await _context.Transacoes.ToListAsync();

            var resumo = pessoas.Select(p => {
                var transacoesPessoa = transacoes.Where(t => t.PessoaId == p.Id).ToList();

                decimal receitas = transacoesPessoa.Where(t => t.Tipo == "receita").Sum(t => t.Valor);
                decimal despesas = transacoesPessoa.Where(t => t.Tipo == "despesa").Sum(t => t.Valor);

                return new {
                    p.Id,
                    p.Nome,
                    TotalReceitas = receitas,
                    TotalDespesas = despesas,
                    Saldo = receitas - despesas
                };
            }).ToList();

            return Ok(new {
                ResumoPorPessoa = resumo,
                TotalGeralReceitas = resumo.Sum(r => r.TotalReceitas),
                TotalGeralDespesas = resumo.Sum(r => r.TotalDespesas),
                SaldoLiquidoGeral = resumo.Sum(r => r.TotalReceitas - r.TotalDespesas)
            });
        }
    }
}