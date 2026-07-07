import axios from 'axios';
import type { RelatorioTotais, Pessoa, Transacao, NovaPessoa, NovaTransacao } from './types';

const api = axios.create({ baseURL: 'http://localhost:5231/api' });

// ---------- PESSOA ----------

export const fetchPessoas = async (): Promise<Pessoa[]> => {
    const response = await api.get<Pessoa[]>('/pessoa');
    return response.data;
};

export const criarPessoa = async (pessoa: NovaPessoa): Promise<Pessoa> => {
    const response = await api.post<Pessoa>('/pessoa', pessoa);
    return response.data;
};

export const deletarPessoa = async (id: string): Promise<void> => {
    await api.delete(`/pessoa/${id}`);
};

// ---------- TRANSAÇÃO ----------

export const fetchTransacoes = async (): Promise<Transacao[]> => {
    const response = await api.get<Transacao[]>('/transacao');
    return response.data;
};

export const criarTransacao = async (transacao: NovaTransacao): Promise<Transacao> => {
    const response = await api.post<Transacao>('/transacao', transacao);
    return response.data;
};

// ---------- RELATÓRIO ----------

export const fetchRelatorio = async (): Promise<RelatorioTotais> => {
    const response = await api.get<RelatorioTotais>('/transacao/relatorio');
    return response.data;
};