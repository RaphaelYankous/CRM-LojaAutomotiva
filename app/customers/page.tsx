'use client';

import { useState, useEffect } from 'react';
import { Plus, Users, TrendingUp, Handshake, ChevronRight, ChevronLeft, Edit, Trash2 } from 'lucide-react';
import Modal from '@/components/Modal';
import { supabase } from '@/lib/supabase';

export default function Customers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'Prospecto',
    vehicle: '',
    score: 50
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase.from('customers').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      
      // Transform data to match UI needs
      const formattedData = (data || []).map(c => {
        let statusColor = "bg-primary/20 text-primary border-primary/30";
        let dotColor = "bg-primary";
        let scoreColor = "bg-primary";
        let scoreLabel = undefined;

        if (c.status === 'Em Negociação') {
          statusColor = "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-500 border-amber-200 dark:border-amber-500/30";
          dotColor = "bg-amber-500";
        } else if (c.status === 'Fechado' || c.status === 'Pós-venda') {
          statusColor = "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600";
          dotColor = "bg-slate-400";
          scoreColor = "bg-emerald-500";
          if (c.status === 'Pós-venda') scoreLabel = "Fechado";
        }

        const initials = c.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();

        return {
          ...c,
          initials,
          statusColor,
          dotColor,
          scoreColor,
          scoreLabel
        };
      });
      
      setCustomers(formattedData);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (customer?: any) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData({
        name: customer.name,
        email: customer.email,
        phone: customer.phone || '',
        status: customer.status,
        vehicle: customer.vehicle,
        score: customer.score
      });
    } else {
      setEditingCustomer(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        status: 'Prospecto',
        vehicle: '',
        score: 50
      });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        const { error } = await supabase.from('customers').delete().eq('id', id);
        if (error) throw error;
        setCustomers(customers.filter((c: any) => c.id !== id));
      } catch (error) {
        console.error('Error deleting customer:', error);
        alert('Erro ao excluir cliente.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingCustomer) {
        const { error } = await supabase.from('customers').update(formData).eq('id', editingCustomer.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('customers').insert([formData]);
        if (error) throw error;
      }
      
      setIsModalOpen(false);
      fetchCustomers();
    } catch (error) {
      console.error('Error saving customer:', error);
      alert('Erro ao salvar cliente.');
    }
  };


  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-tight">Gestão de Clientes</h1>
          <p className="text-slate-500 dark:text-primary/60 text-base font-normal">Gerencie seu funil de vendas de luxo e conversão</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex min-w-[120px] cursor-pointer items-center justify-center gap-2 rounded-lg h-12 px-6 bg-primary text-white text-sm font-bold transition-all hover:bg-primary/90 shadow-lg shadow-primary/20"
        >
          <Plus className="size-5" />
          <span>Novo Lead</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total de Leads" value={customers.length.toString()} trend="+5.2%" trendUp={true} subtext="vs. 30 dias anteriores" icon={<Users className="size-5 text-primary" />} />
        <StatCard title="Taxa de Conversão" value="12.5%" trend="+1.1%" trendUp={true} subtext="Média do mercado: 8.4%" icon={<TrendingUp className="size-5 text-primary" />} />
        <StatCard title="Negociações Ativas" value={customers.filter((c:any) => c.status === 'Em Negociação').length.toString()} trend="-2.4%" trendUp={false} subtext="Receita esperada: R$ 2.4M" icon={<Handshake className="size-5 text-primary" />} />
      </div>

      <div className="flex flex-col">
        <div className="flex border-b border-slate-200 dark:border-primary/20 gap-8 overflow-x-auto no-scrollbar">
          <Tab label="Prospecto" active={false} />
          <Tab label="Em Negociação" active={true} />
          <Tab label="Fechado" active={false} />
          <Tab label="Pós-venda" active={false} />
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 dark:border-primary/10 bg-white dark:bg-primary/5 shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-primary/10 border-b border-slate-200 dark:border-primary/20">
                  <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-primary/70">Cliente</th>
                  <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-primary/70">Status</th>
                  <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-primary/70">Veículo de Interesse</th>
                  <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-primary/70">Score do Lead</th>
                  <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-primary/70 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-primary/10">
                {customers.map((customer: any) => (
                  <CustomerRow 
                    key={customer.id}
                    {...customer}
                    onEdit={() => handleOpenModal(customer)}
                    onDelete={() => handleDelete(customer.id)}
                  />
                ))}
                {customers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                      Nenhum cliente encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 bg-slate-50 dark:bg-primary/10 border-t border-slate-200 dark:border-primary/20 flex items-center justify-between">
            <p className="text-xs text-slate-500 dark:text-primary/60">Exibindo {customers.length > 0 ? 1 : 0} a {customers.length} de {customers.length} clientes</p>
            <div className="flex gap-2">
              <button className="size-8 flex items-center justify-center rounded border border-slate-300 dark:border-primary/30 text-slate-500 dark:text-primary/60 hover:border-primary hover:text-primary transition-all disabled:opacity-50" disabled>
                <ChevronLeft className="size-4" />
              </button>
              <button className="size-8 flex items-center justify-center rounded border border-primary bg-primary text-white text-xs font-bold">1</button>
              <button className="size-8 flex items-center justify-center rounded border border-slate-300 dark:border-primary/30 text-slate-500 dark:text-primary/60 hover:border-primary hover:text-primary transition-all disabled:opacity-50" disabled>
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingCustomer ? "Editar Cliente" : "Adicionar Novo Lead"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nome Completo</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent" placeholder="Ex: João Silva" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">E-mail</label>
              <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent" placeholder="Ex: joao@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Telefone</label>
              <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent" placeholder="Ex: (11) 99999-9999" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Veículo de Interesse</label>
              <input required type="text" value={formData.vehicle} onChange={e => setFormData({...formData, vehicle: e.target.value})} className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent" placeholder="Ex: Porsche 911 Carrera" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent">
                  <option value="Prospecto">Prospecto</option>
                  <option value="Em Negociação">Em Negociação</option>
                  <option value="Fechado">Fechado</option>
                  <option value="Pós-venda">Pós-venda</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Score do Lead (0-100)</label>
                <input required type="number" min="0" max="100" value={formData.score} onChange={e => setFormData({...formData, score: parseInt(e.target.value)})} className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent" />
              </div>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg font-medium hover:bg-slate-100 dark:hover:bg-slate-800">Cancelar</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-white font-bold">{editingCustomer ? 'Salvar Alterações' : 'Adicionar Lead'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function StatCard({ title, value, trend, trendUp, subtext, icon }: any) {
  return (
    <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-primary/5 border border-slate-200 dark:border-primary/10 shadow-sm">
      <div className="flex justify-between items-start">
        <p className="text-slate-600 dark:text-primary/80 text-sm font-semibold uppercase tracking-wider">{title}</p>
        {icon}
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-slate-900 dark:text-white tracking-tight text-3xl font-bold">{value}</p>
        <span className={`${trendUp ? 'text-emerald-500' : 'text-red-500'} text-sm font-medium flex items-center`}>
          {trend}
        </span>
      </div>
      <p className="text-slate-400 text-xs mt-1">{subtext}</p>
    </div>
  );
}

function Tab({ label, active }: any) {
  return (
    <button className={`flex items-center gap-2 border-b-2 pb-4 px-2 whitespace-nowrap transition-colors ${active ? 'border-primary text-primary' : 'border-transparent text-slate-500 dark:text-primary/60 hover:text-primary'}`}>
      <span className="text-sm font-bold uppercase tracking-widest">{label}</span>
    </button>
  );
}

function CustomerRow({ initials, name, email, phone, initialsColor, status, statusColor, dotColor, vehicle, score, scoreLabel, scoreColor, onEdit, onDelete }: any) {
  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-primary/10 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className={`size-10 rounded-full flex items-center justify-center font-bold ${initialsColor || 'bg-primary/20 text-primary'}`}>{initials}</div>
          <div className="flex flex-col">
            <span className="font-semibold text-slate-900 dark:text-white">{name}</span>
            <span className="text-xs text-slate-400">{email}</span>
            {phone && <span className="text-xs text-slate-400">{phone}</span>}
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusColor}`}>
          <span className={`size-1.5 rounded-full ${dotColor}`}></span>
          {status}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2 group cursor-pointer">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300 group-hover:text-primary underline decoration-primary/30">{vehicle}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className={`h-full ${scoreColor}`} style={{ width: `${score}%` }}></div>
          </div>
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{scoreLabel || `${score}%`}</span>
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
