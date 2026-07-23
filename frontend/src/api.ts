import axios from 'axios';
import type { RelatorioTotais, Pessoa, Transacao, NovaPessoa, NovaTransacao } from './types';

const isGitHubPages = window.location.hostname.includes('github.io');

const api = axios.create({ baseURL: 'http://localhost:5231/api' });

const getStorageData = <T>(key: string, defaultValue: T): T => {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch {
        return defaultValue;
    }
};

const setStorageData = <T>(key: string, data: T): void => {
    localStorage.setItem(key, JSON.stringify(data));
};

// ---------- PESSOA ----------

export const fetchPessoas = async (): Promise<Pessoa[]> => {
    if (isGitHubPages) {
        return getStorageData<Pessoa[]>('pessoas', []);
    }
    const response = await api.get<Pessoa[]>('/pessoa');
    return response.data || [];
};

export const criarPessoa = async (pessoa: NovaPessoa): Promise<Pessoa> => {
    if (isGitHubPages) {
        const pessoas = getStorageData<Pessoa[]>('pessoas', []);
        const novaPessoa: Pessoa = {
            id: crypto.randomUUID(),
            ...pessoa
        };
        pessoas.push(novaPessoa);
        setStorageData('pessoas', pessoas);
        return novaPessoa;
    }
    const response = await api.post<Pessoa>('/pessoa', pessoa);
    return response.data;
};

export const deletarPessoa = async (id: string): Promise<void> => {
    if (isGitHubPages) {
        let pessoas = getStorageData<Pessoa[]>('pessoas', []);
        pessoas = pessoas.filter(p => p.id !== id);
        setStorageData('pessoas', pessoas);
        
        let transacoes = getStorageData<Transacao[]>('transacoes', []);
        transacoes = transacoes.filter(t => t.pessoaId !== id);
        setStorageData('transacoes', transacoes);
        return;
    }
    await api.delete(`/pessoa/${id}`);
};

// ---------- TRANSAÇÃO ----------

export const fetchTransacoes = async (): Promise<Transacao[]> => {
    if (isGitHubPages) {
        return getStorageData<Transacao[]>('transacoes', []);
    }
    const response = await api.get<Transacao[]>('/transacao');
    return response.data || [];
};

export const criarTransacao = async (transacao: NovaTransacao): Promise<Transacao> => {
    if (isGitHubPages) {
        const pessoas = getStorageData<Pessoa[]>('pessoas', []);
        const pessoa = pessoas.find(p => p.id === transacao.pessoaId);

        if (pessoa && pessoa.idade < 18 && transacao.tipo.toLowerCase() === 'receita') {
            throw new Error('Pessoas menores de 18 anos só podem ter transações do tipo despesa.');
        }

        const transacoes = getStorageData<Transacao[]>('transacoes', []);
        const novaTransacao: Transacao = {
            id: crypto.randomUUID(),
            ...transacao
        };
        transacoes.push(novaTransacao);
        setStorageData('transacoes', transacoes);
        return novaTransacao;
    }
    const response = await api.post<Transacao>('/transacao', transacao);
    return response.data;
};

// ---------- RELATÓRIO ----------

export const fetchRelatorio = async (): Promise<RelatorioTotais> => {
    if (isGitHubPages) {
        const pessoas = getStorageData<Pessoa[]>('pessoas', []);
        const transacoes = getStorageData<Transacao[]>('transacoes', []);

        let totalGeralReceitas = 0;
        let totalGeralDespesas = 0;

        const itens = pessoas.map(pessoa => {
            const transPessoa = transacoes.filter(t => t.pessoaId === pessoa.id);
            const totalReceitas = transPessoa
                .filter(t => t.tipo.toLowerCase() === 'receita')
                .reduce((acc: number, t: Transacao) => acc + t.valor, 0);

            const totalDespesas = transPessoa
                .filter(t => t.tipo.toLowerCase() === 'despesa')
                .reduce((acc: number, t: Transacao) => acc + t.valor, 0);

            const saldo = totalReceitas - totalDespesas;

            totalGeralReceitas += totalReceitas;
            totalGeralDespesas += totalDespesas;

            return {
                pessoaId: pessoa.id,
                nomePessoa: pessoa.nome,
                totalReceitas,
                totalDespesas,
                saldo
            };
        });

        return {
            itens,
            totalGeralReceitas,
            totalGeralDespesas,
            saldoGeral: totalGeralReceitas - totalGeralDespesas
        };
    }
    const response = await api.get<RelatorioTotais>('/transacao/relatorio');
    return response.data;
};