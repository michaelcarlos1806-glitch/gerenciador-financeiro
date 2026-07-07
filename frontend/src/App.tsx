import { useState, useEffect } from 'react';
import {
  fetchRelatorio,
  fetchPessoas,
  criarPessoa,
  deletarPessoa,
  criarTransacao,
} from './api';
import type { RelatorioTotais, Pessoa } from './types';

function App() {
  const [relatorio, setRelatorio] = useState<RelatorioTotais | null>(null);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState<string | null>(null);

  const [nomePessoa, setNomePessoa] = useState('');
  const [idadePessoa, setIdadePessoa] = useState('');

  const [descricaoTransacao, setDescricaoTransacao] = useState('');
  const [valorTransacao, setValorTransacao] = useState('');
  const [tipoTransacao, setTipoTransacao] = useState<'receita' | 'despesa'>('receita');
  const [pessoaIdTransacao, setPessoaIdTransacao] = useState('');

  const carregarDados = async () => {
    try {
      const [dadosRelatorio, dadosPessoas] = await Promise.all([
        fetchRelatorio(),
        fetchPessoas(),
      ]);
      setRelatorio(dadosRelatorio);
      setPessoas(dadosPessoas);
    } catch (e) {
      console.error('Erro ao carregar dados:', e);
      setErro('Não foi possível conectar à API. Verifique se o back-end está rodando.');
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const notificar = (texto: string, isErro = false) => {
    if (isErro) {
      setErro(texto);
      setMensagem(null);
    } else {
      setMensagem(texto);
      setErro(null);
    }
    setTimeout(() => {
      setErro(null);
      setMensagem(null);
    }, 4000);
  };

  const handleCadastrarPessoa = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await criarPessoa({ nome: nomePessoa, idade: Number(idadePessoa) });
      setNomePessoa('');
      setIdadePessoa('');
      notificar('Pessoa cadastrada com sucesso!');
      await carregarDados();
    } catch (e: any) {
      const msg = e?.response?.data ?? 'Erro ao cadastrar pessoa.';
      notificar(typeof msg === 'string' ? msg : 'Erro ao cadastrar pessoa.', true);
    }
  };

  const handleDeletarPessoa = async (id: string, nome: string) => {
    if (!confirm(`Remover ${nome}? Todas as transações dessa pessoa também serão apagadas.`)) {
      return;
    }
    try {
      await deletarPessoa(id);
      notificar('Pessoa removida com sucesso!');
      await carregarDados();
    } catch (e: any) {
      const msg = e?.response?.data ?? 'Erro ao remover pessoa.';
      notificar(typeof msg === 'string' ? msg : 'Erro ao remover pessoa.', true);
    }
  };

  const handleCadastrarTransacao = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await criarTransacao({
        descricao: descricaoTransacao,
        valor: Number(valorTransacao),
        tipo: tipoTransacao,
        pessoaId: pessoaIdTransacao,
      });
      setDescricaoTransacao('');
      setValorTransacao('');
      setTipoTransacao('receita');
      setPessoaIdTransacao('');
      notificar('Transação cadastrada com sucesso!');
      await carregarDados();
    } catch (e: any) {
      const msg = e?.response?.data ?? 'Erro ao cadastrar transação.';
      notificar(typeof msg === 'string' ? msg : 'Erro ao cadastrar transação.', true);
    }
  };

  const estilos = {
    pagina: {
      padding: '40px 20px',
      backgroundColor: '#121214',
      color: '#fff',
      minHeight: '100vh',
      fontFamily: 'sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    } as React.CSSProperties,
    titulo: {
      color: '#00b37e',
      textAlign: 'center',
    } as React.CSSProperties,
    card: {
      background: '#1a1a1e',
      border: '1px solid #29292e',
      borderRadius: '8px',
      padding: '24px',
      marginBottom: '24px',
      width: '100%',
      maxWidth: '500px',
    } as React.CSSProperties,
    input: {
      width: '100%',
      padding: '8px',
      marginTop: '4px',
      marginBottom: '12px',
      borderRadius: '4px',
      border: '1px solid #333',
      background: '#0d0d0f',
      color: '#fff',
      boxSizing: 'border-box',
    } as React.CSSProperties,
    label: { fontSize: '14px', color: '#ccc' } as React.CSSProperties,
    botao: {
      padding: '10px 20px',
      background: '#00b37e',
      border: 'none',
      borderRadius: '6px',
      color: '#fff',
      fontWeight: 'bold' as const,
      cursor: 'pointer',
    } as React.CSSProperties,
    botaoRemover: {
      background: 'transparent',
      border: '1px solid #f75a68',
      color: '#f75a68',
      borderRadius: '4px',
      padding: '4px 10px',
      cursor: 'pointer',
      fontSize: '12px',
    } as React.CSSProperties,
  };

  return (
    <div style={estilos.pagina}>
      <h1 style={estilos.titulo}>Gerenciador Financeiro</h1>

      {erro && (
        <div style={{ background: '#3a1a1e', border: '1px solid #f75a68', color: '#f75a68', padding: '12px', borderRadius: '6px', marginBottom: '20px', width: '100%', maxWidth: '500px', boxSizing: 'border-box' }}>
          {erro}
        </div>
      )}
      {mensagem && (
        <div style={{ background: '#0f2e22', border: '1px solid #00b37e', color: '#00b37e', padding: '12px', borderRadius: '6px', marginBottom: '20px', width: '100%', maxWidth: '500px', boxSizing: 'border-box' }}>
          {mensagem}
        </div>
      )}

      <div style={estilos.card}>
        <h2 style={{ marginTop: 0, textAlign: 'center' }}>Cadastrar Pessoa</h2>
        <form onSubmit={handleCadastrarPessoa}>
          <label style={estilos.label}>Nome</label>
          <input
            style={estilos.input}
            value={nomePessoa}
            onChange={(e) => setNomePessoa(e.target.value)}
            required
          />
          <label style={estilos.label}>Idade</label>
          <input
            style={estilos.input}
            type="number"
            min={0}
            value={idadePessoa}
            onChange={(e) => setIdadePessoa(e.target.value)}
            required
          />
          <button style={estilos.botao} type="submit">Cadastrar Pessoa</button>
        </form>
      </div>

      <div style={estilos.card}>
        <h2 style={{ marginTop: 0, textAlign: 'center' }}>Pessoas Cadastradas</h2>
        {pessoas.length === 0 ? (
          <p style={{ color: '#888', textAlign: 'center' }}>Nenhuma pessoa cadastrada ainda.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {pessoas.map((p) => (
              <li
                key={p.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: '1px solid #29292e',
                }}
              >
                <span>{p.nome} ({p.idade} anos)</span>
                <button style={estilos.botaoRemover} onClick={() => handleDeletarPessoa(p.id, p.nome)}>
                  Remover
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={estilos.card}>
        <h2 style={{ marginTop: 0, textAlign: 'center' }}>Cadastrar Transação</h2>
        <form onSubmit={handleCadastrarTransacao}>
          <label style={estilos.label}>Descrição</label>
          <input
            style={estilos.input}
            value={descricaoTransacao}
            onChange={(e) => setDescricaoTransacao(e.target.value)}
            required
          />
          <label style={estilos.label}>Valor</label>
          <input
            style={estilos.input}
            type="number"
            step="0.01"
            min={0}
            value={valorTransacao}
            onChange={(e) => setValorTransacao(e.target.value)}
            required
          />
          <label style={estilos.label}>Tipo</label>
          <select
            style={estilos.input}
            value={tipoTransacao}
            onChange={(e) => setTipoTransacao(e.target.value as 'receita' | 'despesa')}
          >
            <option value="receita">receita</option>
            <option value="despesa">despesa</option>
          </select>
          <label style={estilos.label}>Pessoa</label>
          <select
            style={estilos.input}
            value={pessoaIdTransacao}
            onChange={(e) => setPessoaIdTransacao(e.target.value)}
            required
          >
            <option value="" disabled>Selecione uma pessoa</option>
            {pessoas.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome} ({p.idade} anos)
              </option>
            ))}
          </select>
          <button style={estilos.botao} type="submit">Cadastrar Transação</button>
        </form>
      </div>

      {relatorio && (
        <div style={estilos.card}>
          <h2 style={{ marginTop: 0, textAlign: 'center' }}>Resumo Geral</h2>
          <p style={{ textAlign: 'center' }}>Total Receitas: R$ {relatorio.totalGeralReceitas}</p>
          <p style={{ textAlign: 'center' }}>Total Despesas: R$ {relatorio.totalGeralDespesas}</p>
          <p style={{ textAlign: 'center', color: relatorio.saldoLiquidoGeral >= 0 ? '#00b37e' : '#f75a68' }}>
            Saldo Líquido: R$ {relatorio.saldoLiquidoGeral}
          </p>

          <h2 style={{ marginTop: '30px', textAlign: 'center' }}>Resumo por Pessoa</h2>
          {relatorio.resumoPorPessoa.length === 0 ? (
            <p style={{ color: '#888', textAlign: 'center' }}>Nenhuma transação cadastrada ainda.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid #29292e' }}>
                  <th style={{ padding: '12px' }}>Nome</th>
                  <th style={{ padding: '12px' }}>Receitas</th>
                  <th style={{ padding: '12px' }}>Despesas</th>
                  <th style={{ padding: '12px' }}>Saldo</th>
                </tr>
              </thead>
              <tbody>
                {relatorio.resumoPorPessoa.map((pessoa) => (
                  <tr key={pessoa.id} style={{ borderBottom: '1px solid #29292e' }}>
                    <td style={{ padding: '12px' }}>{pessoa.nome}</td>
                    <td style={{ padding: '12px', color: '#00b37e' }}>R$ {pessoa.totalReceitas}</td>
                    <td style={{ padding: '12px', color: '#f75a68' }}>R$ {pessoa.totalDespesas}</td>
                    <td style={{ padding: '12px', color: pessoa.saldo >= 0 ? '#00b37e' : '#f75a68' }}>
                      R$ {pessoa.saldo}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default App;