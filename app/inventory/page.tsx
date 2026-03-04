'use client';

import { useState, useEffect } from 'react';
import { PlusCircle, Filter, Eye, Edit, History, TrendingUp, CheckCircle, Clock, DollarSign, Car, Trash2, Download } from 'lucide-react';
import Image from 'next/image';
import Modal from '@/components/Modal';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { supabase } from '@/lib/supabase';

export default function Inventory() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    year: '',
    km: '',
    price: '',
    status: 'Disponível',
    img_src: 'https://picsum.photos/seed/car/400/300'
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const { data, error } = await supabase.from('vehicles').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      
      const formattedData = (data || []).map(v => {
        let statusColor = "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400";
        if (v.status === 'Reservado') statusColor = "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400";
        if (v.status === 'Vendido') statusColor = "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 line-through";
        
        return {
          ...v,
          statusColor
        };
      });
      
      setVehicles(formattedData);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (vehicle?: any) => {
    if (vehicle) {
      setEditingVehicle(vehicle);
      setFormData({
        title: vehicle.title,
        subtitle: vehicle.subtitle || '',
        year: vehicle.year || '',
        km: vehicle.km || '',
        price: vehicle.price || '',
        status: vehicle.status,
        img_src: vehicle.img_src || 'https://picsum.photos/seed/car/400/300'
      });
    } else {
      setEditingVehicle(null);
      setFormData({
        title: '',
        subtitle: '',
        year: '',
        km: '',
        price: '',
        status: 'Disponível',
        img_src: 'https://picsum.photos/seed/car/400/300'
      });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este veículo?')) {
      try {
        const { error } = await supabase.from('vehicles').delete().eq('id', id);
        if (error) throw error;
        setVehicles(vehicles.filter((v: any) => v.id !== id));
      } catch (error) {
        console.error('Error deleting vehicle:', error);
        alert('Erro ao excluir veículo.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingVehicle) {
        const { error } = await supabase.from('vehicles').update(formData).eq('id', editingVehicle.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('vehicles').insert([formData]);
        if (error) throw error;
      }
      
      setIsModalOpen(false);
      fetchVehicles();
    } catch (error) {
      console.error('Error saving vehicle:', error);
      alert('Erro ao salvar veículo.');
    }
  };


  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text('Relatório de Estoque de Veículos', 14, 22);
    
    // Add date
    doc.setFontSize(11);
    doc.setTextColor(100);
    const date = new Date().toLocaleDateString('pt-BR');
    doc.text(`Gerado em: ${date}`, 14, 30);
    
    // Create table data
    const tableColumn = ["Veículo", "Ano", "Quilometragem", "Preço", "Status"];
    const tableRows = vehicles.map((vehicle: any) => [
      `${vehicle.title} ${vehicle.subtitle}`,
      vehicle.year,
      vehicle.km,
      vehicle.price,
      vehicle.status
    ]);
    
    // Add table
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [15, 23, 42], textColor: 255 }, // slate-900
      alternateRowStyles: { fillColor: [248, 250, 252] } // slate-50
    });
    
    // Save PDF
    doc.save('relatorio-estoque-veiculos.pdf');
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Estoque de Veículos</h1>
          <p className="text-slate-500 mt-1">Controle de estoque em tempo real e acompanhamento de desempenho.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={generatePDF}
            className="flex items-center justify-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-lg font-bold transition-all shadow-sm"
          >
            <Download className="size-5" />
            <span className="hidden sm:inline">Gerar Relatório PDF</span>
          </button>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-lg shadow-primary/20"
          >
            <PlusCircle className="size-5" />
            <span className="hidden sm:inline">Adicionar Novo Veículo</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-wrap gap-4 items-center">
        <FilterSelect label="Marca" options={['Todas as Marcas', 'Tesla', 'BMW', 'Mercedes-Benz', 'Audi']} />
        <FilterSelect label="Modelo" options={['Todos os Modelos', 'Model 3', 'X5', 'C-Class']} />
        <FilterSelect label="Ano" options={['Qualquer Ano', '2024', '2023', '2022']} />
        <FilterSelect label="Status" options={['Todos os Status', 'Disponível', 'Reservado', 'Vendido']} />
        <div className="flex items-end h-full pt-5">
          <button className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg hover:text-primary transition-colors">
            <Filter className="size-5" />
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Veículo</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Ano</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Quilometragem</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Preço</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {vehicles.map((vehicle: any) => (
                <VehicleRow 
                  key={vehicle.id}
                  {...vehicle}
                  onEdit={() => handleOpenModal(vehicle)}
                  onDelete={() => handleDelete(vehicle.id)}
                />
              ))}
              {vehicles.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    Nenhum veículo encontrado no estoque.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
          <span className="text-sm text-slate-600 dark:text-slate-400">Exibindo <span className="font-bold text-slate-900 dark:text-slate-100">{vehicles.length > 0 ? 1 : 0} a {vehicles.length}</span> de <span className="font-bold text-slate-900 dark:text-slate-100">{vehicles.length}</span> veículos</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50" disabled>Anterior</button>
            <button className="px-3 py-1 text-sm bg-primary text-white rounded-lg font-bold">1</button>
            <button className="px-3 py-1 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50" disabled>Próximo</button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard title="Estoque Total" value={vehicles.length.toString()} icon={<Car className="size-5 text-primary" />} trend="+2 este mês" />
        <SummaryCard title="Disponível" value={vehicles.filter((v:any) => v.status === 'Disponível').length.toString()} icon={<CheckCircle className="size-5 text-emerald-500" />} subtitle="Pronto para venda" />
        <SummaryCard title="Reservado" value={vehicles.filter((v:any) => v.status === 'Reservado').length.toString()} icon={<Clock className="size-5 text-amber-500" />} subtitle="Sob contrato" />
        <SummaryCard title="Vendido (Mês)" value={vehicles.filter((v:any) => v.status === 'Vendido').length.toString()} icon={<DollarSign className="size-5 text-slate-400" />} subtitle="Meta: 12" subtitleColor="text-primary font-bold" />
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingVehicle ? "Editar Veículo" : "Adicionar Novo Veículo"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Modelo / Título</label>
              <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent" placeholder="Ex: Tesla Model 3" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Versão / Subtítulo</label>
              <input required type="text" value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent" placeholder="Ex: Long Range Dual Motor" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Ano</label>
              <input required type="text" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent" placeholder="Ex: 2023" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Quilometragem</label>
              <input required type="text" value={formData.km} onChange={e => setFormData({...formData, km: e.target.value})} className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent" placeholder="Ex: 15.000 km" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Preço</label>
              <input required type="text" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent" placeholder="Ex: R$ 250.000" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent">
                <option value="Disponível">Disponível</option>
                <option value="Reservado">Reservado</option>
                <option value="Vendido">Vendido</option>
              </select>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg font-medium hover:bg-slate-100 dark:hover:bg-slate-800">Cancelar</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-white font-bold">{editingVehicle ? 'Salvar Alterações' : 'Adicionar Veículo'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function FilterSelect({ label, options }: { label: string, options: string[] }) {
  return (
    <div className="flex-1 min-w-[150px]">
      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 px-1">{label}</label>
      <select className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-primary py-2 px-3 outline-none">
        {options.map(opt => <option key={opt}>{opt}</option>)}
      </select>
    </div>
  );
}

function VehicleRow({ img_src, title, subtitle, year, km, price, status, statusColor, onEdit, onDelete }: any) {
  return (
    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-4">
          <div className="h-12 w-16 rounded-lg bg-slate-200 dark:bg-slate-700 overflow-hidden shrink-0 relative">
            <Image src={img_src || 'https://picsum.photos/seed/car/400/300'} alt="Car" fill className="object-cover" referrerPolicy="no-referrer" />
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-slate-100">{title}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{year}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">{km}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-primary">{price}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${statusColor}`}>
          {status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
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

function SummaryCard({ title, value, icon, trend, subtitle, subtitleColor }: any) {
  return (
    <div className="bg-white dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <span className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">{title}</span>
        {icon}
      </div>
      <div className="text-3xl font-black">{value}</div>
      {trend && (
        <div className="mt-2 text-xs text-emerald-500 font-bold flex items-center gap-1">
          <TrendingUp className="size-3" />
          {trend}
        </div>
      )}
      {subtitle && (
        <div className={`mt-2 text-xs ${subtitleColor || 'text-slate-500 dark:text-slate-400'}`}>{subtitle}</div>
      )}
    </div>
  );
}
