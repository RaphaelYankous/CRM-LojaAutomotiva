'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Car, Edit, Trash2 } from 'lucide-react';
import Modal from '@/components/Modal';
import { useLocalStorage } from '@/hooks/use-local-storage';

const initialAppointments = [
  {
    id: '1',
    time: "09:00", type: "Manutenção", typeColor: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300",
    name: "James Wilson", vehicle: "BMW M4 Competition 2024", desc: "Primeira troca de óleo e inspeção de freios",
    date: "2023-10-05"
  },
  {
    id: '2',
    time: "10:30", type: "Test Drive", typeColor: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300",
    name: "Sarah Chen", vehicle: "Porsche 911 GT3 2023", desc: "",
    date: "2023-10-05"
  },
  {
    id: '3',
    time: "13:15", type: "Estética", typeColor: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300",
    name: "Michael Ross", vehicle: "Audi RS6 Avant 2021", desc: "Aplicação completa de vitrificação cerâmica",
    date: "2023-10-05"
  }
];

export default function Schedule() {
  const [appointments, setAppointments] = useLocalStorage('crm-appointments', initialAppointments);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: '',
    vehicle: '',
    type: 'Test Drive',
    time: '09:00',
    date: '2023-10-05',
    desc: ''
  });

  const handleOpenModal = (appointment?: any) => {
    if (appointment) {
      setEditingAppointment(appointment);
      setFormData({
        name: appointment.name,
        vehicle: appointment.vehicle,
        type: appointment.type,
        time: appointment.time,
        date: appointment.date,
        desc: appointment.desc || ''
      });
    } else {
      setEditingAppointment(null);
      setFormData({
        name: '',
        vehicle: '',
        type: 'Test Drive',
        time: '09:00',
        date: '2023-10-05',
        desc: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este agendamento?')) {
      setAppointments(appointments.filter((a: any) => a.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let typeColor = "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300";
    if (formData.type === 'Manutenção') typeColor = "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300";
    if (formData.type === 'Estética') typeColor = "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300";

    const newAppointment = {
      ...formData,
      typeColor
    };

    if (editingAppointment) {
      setAppointments(appointments.map((a: any) => a.id === editingAppointment.id ? { ...newAppointment, id: a.id } : a));
    } else {
      setAppointments([...appointments, { ...newAppointment, id: Date.now().toString() }].sort((a, b) => a.time.localeCompare(b.time)));
    }
    setIsModalOpen(false);
  };

  const todaysAppointments = appointments.filter((a: any) => a.date === '2023-10-05');

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Agenda</h2>
          <p className="text-slate-500 dark:text-primary/60">Gerencie test drives e manutenções</p>
        </div>
        <div className="flex bg-slate-100 dark:bg-primary/10 p-1 rounded-lg self-start">
          <button className="px-4 py-1.5 rounded-md text-sm font-medium transition-all text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Dia</button>
          <button className="px-4 py-1.5 rounded-md text-sm font-medium transition-all text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Semana</button>
          <button className="px-4 py-1.5 rounded-md text-sm font-medium transition-all bg-white dark:bg-primary text-primary dark:text-white shadow-sm">Mês</button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 flex flex-col gap-6">
          <div className="bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/10 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-primary/10">
              <div className="flex items-center gap-4">
                <h3 className="text-xl font-bold">Outubro 2023</h3>
                <div className="flex gap-1">
                  <button className="p-1 rounded hover:bg-slate-100 dark:hover:bg-primary/10">
                    <ChevronLeft className="size-5" />
                  </button>
                  <button className="p-1 rounded hover:bg-slate-100 dark:hover:bg-primary/10">
                    <ChevronRight className="size-5" />
                  </button>
                </div>
              </div>
              <button 
                onClick={() => handleOpenModal()}
                className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity"
              >
                <Plus className="size-4" />
                Novo Agendamento
              </button>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-7 border-b border-slate-100 dark:border-primary/5 mb-2">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                  <p key={day} className="text-center text-xs font-bold text-slate-400 uppercase py-2">{day}</p>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-px bg-slate-100 dark:bg-primary/5 rounded-lg overflow-hidden border border-slate-100 dark:border-primary/5">
                <CalendarDay day="27" disabled />
                <CalendarDay day="28" disabled />
                <CalendarDay day="29" disabled />
                <CalendarDay day="30" disabled />
                <CalendarDay day="1">
                  <Event label="Test Drive" color="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300" />
                </CalendarDay>
                <CalendarDay day="2" />
                <CalendarDay day="3">
                  <Event label="Troca de Óleo" color="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300" />
                  <Event label="Estética" color="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300" />
                </CalendarDay>
                <CalendarDay day="4" />
                <CalendarDay day="5" active>
                  <Event label={`${todaysAppointments.length} Serviços`} color="bg-primary/10 text-primary font-bold" />
                </CalendarDay>
                <CalendarDay day="6" />
                <CalendarDay day="7" />
                <CalendarDay day="8" />
                <CalendarDay day="9" />
                <CalendarDay day="10" />
                <CalendarDay day="11" />
                <CalendarDay day="12" />
                <CalendarDay day="13" />
                <CalendarDay day="14" />
                <CalendarDay day="15" />
                <CalendarDay day="16" />
                <CalendarDay day="17" />
                <CalendarDay day="18" />
                <CalendarDay day="19" />
                <CalendarDay day="20" />
                <CalendarDay day="21" />
                <CalendarDay day="22" />
                <CalendarDay day="23" />
                <CalendarDay day="24" />
                <CalendarDay day="25" />
                <CalendarDay day="26" />
                <CalendarDay day="27" />
                <CalendarDay day="28" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <LegendItem color="bg-blue-500" label="Test Drive" />
            <LegendItem color="bg-emerald-500" label="Manutenção" />
            <LegendItem color="bg-amber-500" label="Estética" />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/10 rounded-xl overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-slate-200 dark:border-primary/10 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Lista de Hoje</h3>
                <p className="text-xs text-slate-500 dark:text-primary/60">Quinta, 5 Out</p>
              </div>
              <span className="bg-primary/10 text-primary text-xs font-bold px-2.5 py-1 rounded-full">{todaysAppointments.length} Total</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {todaysAppointments.map((appointment: any) => (
                <AppointmentItem 
                  key={appointment.id}
                  {...appointment}
                  onEdit={() => handleOpenModal(appointment)}
                  onDelete={() => handleDelete(appointment.id)}
                />
              ))}
              {todaysAppointments.length === 0 && (
                <p className="text-center text-slate-500 py-8">Nenhum agendamento para hoje.</p>
              )}
            </div>
            <div className="p-4 bg-slate-50 dark:bg-primary/5">
              <button className="w-full py-2.5 rounded-lg border border-primary/20 text-primary text-sm font-bold hover:bg-primary hover:text-white transition-all">
                Ver Agenda Completa
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingAppointment ? "Editar Agendamento" : "Novo Agendamento"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nome do Cliente</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent" placeholder="Ex: James Wilson" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Veículo</label>
              <input required type="text" value={formData.vehicle} onChange={e => setFormData({...formData, vehicle: e.target.value})} className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent" placeholder="Ex: BMW M4 Competition 2024" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tipo de Serviço</label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent">
                  <option value="Test Drive">Test Drive</option>
                  <option value="Manutenção">Manutenção</option>
                  <option value="Estética">Estética</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Data</label>
                <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Horário</label>
                <input required type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Descrição (Opcional)</label>
              <textarea value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent resize-none" rows={3} placeholder="Detalhes do agendamento..."></textarea>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg font-medium hover:bg-slate-100 dark:hover:bg-slate-800">Cancelar</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-white font-bold">{editingAppointment ? 'Salvar Alterações' : 'Agendar'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function CalendarDay({ day, disabled, active, children }: any) {
  return (
    <div className={`bg-white dark:bg-background-dark min-h-[100px] p-2 ${disabled ? 'opacity-40' : ''} ${active ? 'ring-2 ring-primary ring-inset z-10' : ''}`}>
      <p className={`text-sm ${active ? 'font-bold text-primary' : 'font-medium'}`}>{day}</p>
      <div className="mt-1 space-y-1">
        {children}
      </div>
    </div>
  );
}

function Event({ label, color }: any) {
  return (
    <div className={`px-1.5 py-0.5 rounded text-[10px] truncate ${color}`}>
      {label}
    </div>
  );
}

function LegendItem({ color, label }: any) {
  return (
    <div className="flex items-center gap-2">
      <div className={`size-3 rounded-full ${color}`}></div>
      <span className="text-slate-600 dark:text-slate-400">{label}</span>
    </div>
  );
}

function AppointmentItem({ time, type, typeColor, name, vehicle, desc, onEdit, onDelete }: any) {
  return (
    <div className="group p-4 rounded-xl border border-slate-100 dark:border-primary/5 hover:bg-slate-50 dark:hover:bg-primary/5 transition-all">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-primary">{time}</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${typeColor}`}>{type}</span>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onEdit} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-500" title="Editar">
            <Edit className="size-4" />
          </button>
          <button onClick={onDelete} className="p-1 hover:bg-rose-100 dark:hover:bg-rose-900/30 rounded text-rose-500" title="Excluir">
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>
      <h4 className="font-bold text-slate-900 dark:text-slate-100">{name}</h4>
      <div className="flex items-center gap-2 mt-1 text-slate-500 dark:text-slate-400 text-sm">
        <Car className="size-4" />
        <span>{vehicle}</span>
      </div>
      {desc && <p className="text-xs mt-2 italic text-slate-400">{desc}</p>}
    </div>
  );
}
