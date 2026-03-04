'use client';

import { useState, useEffect } from 'react';
import { Download, Plus, TrendingUp, TrendingDown, Wallet, Users, MoreVertical, AlertTriangle, Edit, Trash2 } from 'lucide-react';
import Modal from '@/components/Modal';
import { supabase } from '@/lib/supabase';

export default function Finance() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);

  const [formData, setFormData] = useState({
    description: '',
    sub_description: '',
    category: 'Venda',
    amount: '',
    type: 'Receita',
    status: 'Compensado'
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase.from('transactions').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      
      const formattedData = (data || []).map(t => {
        let catColor = "bg-primary/10 text-primary";
        if (t.category === 'Venda') catColor = "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400";
        if (t.category === 'Custo Oficina') catColor = "bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400";

        const amountColor = t.type === 'Receita' ? "text-emerald-500" : "text-rose-500";
        const formattedAmount = `${t.type === 'Receita' ? '+' : '-'}${t.amount}`;
        const statusDot = t.status === 'Compensado' ? "bg-emerald-500" : "bg-amber-500";

        return {
          ...t,
          formattedAmount,
          amountColor,
          catColor,
          statusDot
        };
      });
      
      setTransactions(formattedData);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (transaction?: any) => {
    if (transaction) {
      setEditingTransaction(transaction);
      setFormData({
        description: transaction.description,
        sub_description: transaction.sub_description || '',
        category: transaction.category,
        amount: transaction.amount,
        type: transaction.type,
        status: transaction.status
      });
    } else {
      setEditingTransaction(null);
      setFormData({
        description: '',
        sub_description: '',
        category: 'Venda',
        amount: '',
        type: 'Receita',
        status: 'Compensado'
      });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
      try {
        const { error } = await supabase.from('transactions').delete().eq('id', id);
        if (error) throw error;
        setTransactions(transactions.filter((t: any) => t.id !== id));
      } catch (error) {
        console.error('Error deleting transaction:', error);
        alert('Erro ao excluir transação.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const payload = {
        ...formData,
        date: editingTransaction ? editingTransaction.date : new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
      };

      if (editingTransaction) {
        const { error } = await supabase.from('transactions').update(payload).eq('id', editingTransaction.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('transactions').insert([payload]);
        if (error) throw error;
      }
      
      setIsModalOpen(false);
      fetchTransactions();
    } catch (error) {
      console.error('Error saving transaction:', error);
      alert('Erro ao salvar transação.');
    }
  };

  return (
    <div className="p-4 lg:p-8 space-y-8 overflow-y-auto">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Visão Financeira</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Visão geral em tempo real da saúde da concessionária DriveWay Motors.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-primary/20 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-primary/5">
            <Download className="size-5" /> Exportar PDF
          </button>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 shadow-lg shadow-primary/20"
          >
            <Plus className="size-5" /> Novo Lançamento
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <MetricCard 
          title="Receita Mensal" icon={<TrendingUp className="size-5 text-emerald-500" />}
          value="R$ 4.890.200" trend="+8.2%" trendColor="text-emerald-500" trendText="vs. mês passado"
        />
        <MetricCard 
          title="Despesas Operacionais" icon={<TrendingDown className="size-5 text-rose-500" />}
          value="R$ 3.747.700" trend="-3.1%" trendColor="text-rose-500" trendText="vs. mês passado"
        />
        <MetricCard 
          title="Lucro Líquido" icon={<Wallet className="size-5 text-emerald-500" />}
          value="R$ 1.142.500" trend="+12.5%" trendColor="text-emerald-500" trendText="vs. projeção"
        />
        <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-primary/5 border border-slate-200 dark:border-primary/10 hover:border-primary/30 transition-colors border-l-4 border-l-primary">
          <div className="flex justify-between items-start">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Comissões de Vendas</p>
            <Users className="size-5 text-primary" />
          </div>
          <p className="text-slate-900 dark:text-slate-100 text-3xl font-bold">R$ 112.400</p>
          <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">8 Pagamentos pendentes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-4 rounded-xl p-6 bg-white dark:bg-primary/5 border border-slate-200 dark:border-primary/10">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold">Receita vs Despesas</h3>
            <select className="bg-transparent border-none text-sm font-medium text-slate-500 focus:ring-0 cursor-pointer outline-none">
              <option>Últimos 6 Meses</option>
              <option>Últimos 12 Meses</option>
            </select>
          </div>
          <div className="grid h-64 grid-cols-6 items-end gap-4 px-2 pt-4">
            <BarColumn month="JAN" rev={60} exp={40} />
            <BarColumn month="FEV" rev={75} exp={35} />
            <BarColumn month="MAR" rev={65} exp={50} />
            <BarColumn month="ABR" rev={90} exp={30} />
            <BarColumn month="MAI" rev={80} exp={45} />
            <BarColumn month="JUN" rev={100} exp={40} />
          </div>
          <div className="flex gap-4 mt-2 justify-center">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span className="size-2 rounded-full bg-primary"></span> Receita
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span className="size-2 rounded-full bg-primary/20"></span> Despesas
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-xl p-6 bg-white dark:bg-primary/5 border border-slate-200 dark:border-primary/10">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold">Tendência de Fluxo de Caixa</h3>
            <button className="text-primary text-sm font-semibold">Ver Detalhes</button>
          </div>
          <div className="flex flex-1 items-center justify-center min-h-[220px]">
            <svg className="w-full" fill="none" viewBox="0 0 500 150" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 120C50 110 80 50 120 70C160 90 190 130 250 100C310 70 340 20 400 40C460 60 480 90 500 80V150H0V120Z" fill="url(#chartGradient)"></path>
              <path d="M0 120C50 110 80 50 120 70C160 90 190 130 250 100C310 70 340 20 400 40C460 60 480 90 500 80" stroke="#f46e1a" strokeLinecap="round" strokeWidth="3"></path>
              <defs>
                <linearGradient gradientUnits="userSpaceOnUse" id="chartGradient" x1="250" x2="250" y1="20" y2="150">
                  <stop stopColor="#f46e1a" stopOpacity="0.3"></stop>
                  <stop offset="1" stopColor="#f46e1a" stopOpacity="0"></stop>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="flex justify-between px-2">
            <span className="text-xs font-bold text-slate-500">SEM 1</span>
            <span className="text-xs font-bold text-slate-500">SEM 2</span>
            <span className="text-xs font-bold text-slate-500">SEM 3</span>
            <span className="text-xs font-bold text-slate-500">SEM 4</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-primary/5 border border-slate-200 dark:border-primary/10 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-primary/10 flex flex-wrap justify-between items-center gap-4">
          <h3 className="text-lg font-bold">Transações Recentes</h3>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-xs font-bold rounded-full bg-slate-100 dark:bg-primary/10 text-slate-600 dark:text-slate-300">Todas</button>
            <button className="px-3 py-1.5 text-xs font-bold rounded-full text-slate-400 hover:text-primary transition-colors">Vendas</button>
            <button className="px-3 py-1.5 text-xs font-bold rounded-full text-slate-400 hover:text-primary transition-colors">Oficina</button>
            <button className="px-3 py-1.5 text-xs font-bold rounded-full text-slate-400 hover:text-primary transition-colors">Comissões</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-primary/5 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Data</th>
                <th className="px-6 py-4 font-semibold">Descrição</th>
                <th className="px-6 py-4 font-semibold">Categoria</th>
                <th className="px-6 py-4 font-semibold">Valor</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-primary/10">
              {transactions.map((transaction: any) => (
                <TransactionRow 
                  key={transaction.id}
                  {...transaction}
                  onEdit={() => handleOpenModal(transaction)}
                  onDelete={() => handleDelete(transaction.id)}
                />
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    Nenhuma transação encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-200 dark:border-primary/10 flex justify-center">
          <button className="text-primary text-sm font-bold hover:underline">Ver Todas as Transações</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 rounded-xl bg-white dark:bg-primary/5 border border-slate-200 dark:border-primary/10 p-6">
          <h3 className="font-bold mb-4">Maiores Comissões</h3>
          <div className="space-y-4">
            <CommissionItem initials="AR" name="Alex Rivera" amount="R$ 14.850" />
            <CommissionItem initials="SC" name="Sarah Chen" amount="R$ 14.120" />
            <CommissionItem initials="MB" name="Mike Brown" amount="R$ 13.900" />
          </div>
        </div>

        <div className="md:col-span-2 rounded-xl bg-primary dark:bg-primary/10 border border-primary/20 p-6 flex items-center gap-6 overflow-hidden relative">
          <div className="flex-1 space-y-2 relative z-10">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Atenção: Custos da Oficina</h3>
            <p className="text-slate-700 dark:text-slate-300">Os custos de manutenção da oficina em outubro excederam o orçamento em 12%. Revise a aquisição de estoque para o 4º trimestre.</p>
            <button className="mt-2 px-6 py-2 rounded-lg bg-white dark:bg-primary text-primary dark:text-white font-bold shadow-lg">Revisar Relatórios</button>
          </div>
          <div className="hidden sm:block opacity-20 transform translate-x-1/4">
            <AlertTriangle className="size-32" />
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingTransaction ? "Editar Transação" : "Novo Lançamento"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Descrição</label>
              <input required type="text" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent" placeholder="Ex: Venda Toyota Camry 2023" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Sub-descrição / Detalhes</label>
              <input required type="text" value={formData.sub_description} onChange={e => setFormData({...formData, sub_description: e.target.value})} className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent" placeholder="Ex: Comprador: J. Smith" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Categoria</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent">
                  <option value="Venda">Venda</option>
                  <option value="Custo Oficina">Custo Oficina</option>
                  <option value="Comissão">Comissão</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tipo</label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent">
                  <option value="Receita">Receita (+)</option>
                  <option value="Despesa">Despesa (-)</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Valor (R$)</label>
                <input required type="text" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent" placeholder="Ex: R$ 10.000,00" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent">
                  <option value="Compensado">Compensado</option>
                  <option value="Pendente">Pendente</option>
                </select>
              </div>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg font-medium hover:bg-slate-100 dark:hover:bg-slate-800">Cancelar</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-white font-bold">{editingTransaction ? 'Salvar Alterações' : 'Lançar Transação'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function MetricCard({ title, icon, value, trend, trendColor, trendText }: any) {
  return (
    <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-primary/5 border border-slate-200 dark:border-primary/10 hover:border-primary/30 transition-colors">
      <div className="flex justify-between items-start">
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{title}</p>
        {icon}
      </div>
      <p className="text-slate-900 dark:text-slate-100 text-3xl font-bold">{value}</p>
      <p className={`${trendColor} text-sm font-medium flex items-center gap-1`}>
        {trend} <span className="text-slate-400 dark:text-slate-500 font-normal">{trendText}</span>
      </p>
    </div>
  );
}

function BarColumn({ month, rev, exp }: any) {
  return (
    <div className="flex flex-col items-center gap-2 h-full justify-end">
      <div className="w-full space-y-1 flex flex-col justify-end" style={{ height: `${rev}%` }}>
        <div className="bg-primary w-full rounded-t" style={{ height: '100%' }}></div>
        <div className="bg-primary/20 w-full" style={{ height: `${exp}%` }}></div>
      </div>
      <span className="text-xs font-bold text-slate-500">{month}</span>
    </div>
  );
}

function TransactionRow({ date, description, sub_description, category, catColor, formattedAmount, amountColor, status, statusDot, onEdit, onDelete }: any) {
  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-primary/5 transition-colors">
      <td className="px-6 py-4 text-sm">{date}</td>
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="font-medium text-slate-900 dark:text-slate-100">{description}</span>
          <span className="text-xs text-slate-400">{sub_description}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${catColor}`}>{category}</span>
      </td>
      <td className={`px-6 py-4 text-sm font-bold ${amountColor}`}>{formattedAmount}</td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <span className={`size-2 rounded-full ${statusDot}`}></span>
          <span className="text-sm">{status}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex justify-end gap-2">
          <button onClick={onEdit} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-600 dark:text-slate-400" title="Editar">
            <Edit className="size-5" />
          </button>
          <button onClick={onDelete} className="p-2 hover:bg-rose-100 dark:hover:bg-rose-900/30 rounded-lg transition-colors text-rose-500" title="Excluir">
            <Trash2 className="size-5" />
          </button>
        </div>
      </td>
    </tr>
  );
}

function CommissionItem({ initials, name, amount }: any) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">{initials}</div>
        <span className="text-sm font-medium">{name}</span>
      </div>
      <span className="text-sm font-bold">{amount}</span>
    </div>
  );
}
