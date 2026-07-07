using System;

namespace API.Models
{
    public class Transacao
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        
        public string Descricao { get; set; } = string.Empty;
        
        public decimal Valor { get; set; }
        
        // "despesa" ou "receita"
        public string Tipo { get; set; } = string.Empty;
        
        public Guid PessoaId { get; set; }
        
        public Pessoa? Pessoa { get; set; }
    }
}