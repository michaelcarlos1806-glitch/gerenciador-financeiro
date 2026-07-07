using System;
using System.Collections.Generic;

namespace API.Models
{
    public class Pessoa
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Nome { get; set; } = string.Empty;
        public int Idade { get; set; }

        // Esta palavra 'virtual' é CRUCIAL para o Include funcionar
        public virtual ICollection<Transacao> Transacoes { get; set; } = new List<Transacao>();
    }
}