export interface ResumoPessoa {
    id: string;
    nome: string;
    totalReceitas: number;
    totalDespesas: number;
    saldo: number;
}

export interface RelatorioTotais {
    resumoPorPessoa: ResumoPessoa[];
    totalGeralReceitas: number;
    totalGeralDespesas: number;
    saldoLiquidoGeral: number;
}