export interface Pessoa {
  id: string;
  nome: string;
  idade: number;
}

export interface Transacao {
  id: string;
  descricao: string;
  valor: number;
  tipo: 'receita' | 'despesa';
  pessoaId: string;
}

export interface NovaPessoa {
  nome: string;
  idade: number;
}

export interface NovaTransacao {
  descricao: string;
  valor: number;
  tipo: 'receita' | 'despesa';
  pessoaId: string;
}

export interface RelatorioTotais {
  totalGeralReceitas: number;
  totalGeralDespesas: number;
  saldoGeral?: number;
  saldoLiquidoGeral?: number;
  itens?: any[];
  resumoPorPessoa?: any[];
}