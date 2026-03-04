import { Calendar, Plus, Tag, UserPlus, Car, DollarSign, ChevronRight, MoreVertical, ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function Dashboard() {
  return (
    <div className="p-8 space-y-8">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Visão Executiva</h2>
          <p className="text-slate-500">Métricas de desempenho da sua rede de concessionárias</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-primary/20 text-sm font-medium hover:bg-primary/5 transition-colors">
            <Calendar className="size-4" />
            Últimos 30 Dias
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus className="size-4" />
            Novo Anúncio
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          icon={<Tag className="size-5" />} 
          iconBg="bg-emerald-500/10" 
          iconColor="text-emerald-500"
          trend="+12.5%" 
          trendColor="text-emerald-500 bg-emerald-500/10"
          label="Total de Vendas" 
          value="124" 
        />
        <MetricCard 
          icon={<UserPlus className="size-5" />} 
          iconBg="bg-blue-500/10" 
          iconColor="text-blue-500"
          trend="+5.2%" 
          trendColor="text-emerald-500 bg-emerald-500/10"
          label="Novos Leads" 
          value="48" 
        />
        <MetricCard 
          icon={<Car className="size-5" />} 
          iconBg="bg-primary/10" 
          iconColor="text-primary"
          trend="-2.1%" 
          trendColor="text-rose-500 bg-rose-500/10"
          label="Veículos em Estoque" 
          value="156" 
        />
        <MetricCard 
          icon={<DollarSign className="size-5" />} 
          iconBg="bg-amber-500/10" 
          iconColor="text-amber-500"
          trend="+18.3%" 
          trendColor="text-emerald-500 bg-emerald-500/10"
          label="Receita" 
          value="R$ 3.2M" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart Placeholder */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800/40 p-6 rounded-xl border border-primary/5 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-lg font-bold">Desempenho de Vendas (Últimos 6 Meses)</h4>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-primary"></div>
                <span className="text-xs text-slate-500">Receita</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                <span className="text-xs text-slate-500">Meta</span>
              </div>
            </div>
          </div>
          <div className="relative h-64 w-full">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
              <line x1="0" y1="20" x2="100" y2="20" className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="0.1"></line>
              <line x1="0" y1="40" x2="100" y2="40" className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="0.1"></line>
              <line x1="0" y1="60" x2="100" y2="60" className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="0.1"></line>
              <line x1="0" y1="80" x2="100" y2="80" className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="0.1"></line>
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f46e1a" stopOpacity="0.2"></stop>
                  <stop offset="100%" stopColor="#f46e1a" stopOpacity="0"></stop>
                </linearGradient>
              </defs>
              <path d="M0,80 Q15,40 30,60 T60,20 T100,40 V100 H0 Z" fill="url(#areaGradient)"></path>
              <path d="M0,80 Q15,40 30,60 T60,20 T100,40" fill="none" className="stroke-primary" strokeWidth="2"></path>
              <path d="M0,70 L100,30" fill="none" className="stroke-slate-300 dark:stroke-slate-600" strokeDasharray="2" strokeWidth="1"></path>
            </svg>
            <div className="flex justify-between mt-4">
              <span className="text-[10px] text-slate-500 font-medium">JAN</span>
              <span className="text-[10px] text-slate-500 font-medium">FEV</span>
              <span className="text-[10px] text-slate-500 font-medium">MAR</span>
              <span className="text-[10px] text-slate-500 font-medium">ABR</span>
              <span className="text-[10px] text-slate-500 font-medium">MAI</span>
              <span className="text-[10px] text-slate-500 font-medium">JUN</span>
            </div>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white dark:bg-slate-800/40 p-6 rounded-xl border border-primary/5 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-bold">Compromissos</h4>
            <button className="text-primary text-sm font-medium hover:underline">Ver todos</button>
          </div>
          <div className="space-y-4">
            <AppointmentItem initials="JD" name="Jane Doe" desc="Test Drive - SUV 2024" time="Hoje, 14:30" timeColor="text-primary" />
            <AppointmentItem initials="MS" name="Marcus Smith" desc="Assinatura de Contrato" time="Hoje, 16:00" timeColor="text-primary" />
            <AppointmentItem initials="RL" name="Robert Lewis" desc="Avaliação de Serviço" time="Amanhã, 09:00" timeColor="text-slate-500" />
          </div>
        </div>
      </div>

      {/* Critical Inventory */}
      <div className="bg-white dark:bg-slate-800/40 p-6 rounded-xl border border-primary/5 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h4 className="text-lg font-bold">Estoque Crítico</h4>
            <span className="bg-rose-500/10 text-rose-500 text-xs px-2 py-0.5 rounded-full font-bold">8 Veículos</span>
          </div>
          <p className="text-sm text-slate-500">Unidades em estoque há mais de 45 dias</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-primary/10 text-slate-500 text-xs uppercase tracking-wider">
                <th className="pb-3 font-semibold">Detalhes do Veículo</th>
                <th className="pb-3 font-semibold">Chassi</th>
                <th className="pb-3 font-semibold">Dias no Pátio</th>
                <th className="pb-3 font-semibold">Preço Atual</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/10">
              <InventoryRow 
                imgSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuCivcTZgvtqVgoaGWzgPwT4O-yLGAMtArrPaHNOuF7HAw5i_oVFzWTLY6HUaFrZTV5ycONKGApFZl4vJO0JjD3lj9B7cEfTuWXHAlRKD2iOtxw9_6tcQClqogwqcALI9coFryIyWMuI8LdkQzmmezvKjbZeT3xACMybtQnmDhMmqL-Kd1QS1YIgy0bLQIdNU6ZUtY799LsO3lZybNcvKq8o6DrO8H2zCGG-UP3yE55VTwgSnShL3iTpaFbNoLY9Z_mkhIpbBBsFbpE"
                title="BMW Série 3 2023"
                subtitle="Branco Alpino | M Sport"
                vin="WBA53AK0XPF..."
                days="58 Dias"
                progress={85}
                price="R$ 242.500"
                status="Rec. Redução Preço"
                statusColor="bg-amber-500/10 text-amber-500"
              />
              <InventoryRow 
                imgSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuBcygi7FUYKHEHiYvquBF815Sm32-55R2OkzFzXVyKafw41Drdt5YdhpbiMTJwE0HIftv5AtNJgVAxSEdjOM9XguY3gQLFXKMJxvt9lI8rri2IfMoJp3ONxbHf2_X6bT3CgaWpQH-L2-N6v3zIO6xWTaScYX3g-d6Gou6oLEQqoDZcKyKTXxbRAzQH4gtAL11Y29UWdKmn45_07ExoLeZRPlLRswPAsGQWqu1LahngSzQTmtD5kznIGLuWFE6cPl67XIwI4RZ7ff0s"
                title="Audi Q7 2022"
                subtitle="Preto Mito | Premium Plus"
                vin="WA1LAAAF3ND..."
                days="47 Dias"
                progress={70}
                price="R$ 354.900"
                status="Sem Ação"
                statusColor="bg-slate-500/10 text-slate-500"
              />
            </tbody>
          </table>
        </div>
        <div className="mt-6 flex items-center justify-center">
          <button className="text-sm font-medium text-primary flex items-center gap-1 hover:gap-2 transition-all">
            Ver Relatório de Estoque Antigo
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, iconBg, iconColor, trend, trendColor, label, value }: any) {
  return (
    <div className="bg-white dark:bg-slate-800/40 p-6 rounded-xl border border-primary/5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${iconBg} ${iconColor}`}>
          {icon}
        </div>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${trendColor}`}>{trend}</span>
      </div>
      <p className="text-slate-500 text-sm font-medium">{label}</p>
      <h3 className="text-2xl font-bold mt-1">{value}</h3>
    </div>
  );
}

function AppointmentItem({ initials, name, desc, time, timeColor }: any) {
  return (
    <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-primary/10">
      <div className="size-10 flex-shrink-0 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-500">{initials}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate">{name}</p>
        <p className="text-xs text-slate-500">{desc}</p>
        <p className={`text-[11px] font-medium mt-1 ${timeColor}`}>{time}</p>
      </div>
      <ChevronRight className="size-5 text-slate-300" />
    </div>
  );
}

function InventoryRow({ imgSrc, title, subtitle, vin, days, progress, price, status, statusColor }: any) {
  return (
    <tr className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
      <td className="py-4">
        <div className="flex items-center gap-3">
          <div className="size-12 rounded bg-slate-100 dark:bg-slate-700 overflow-hidden relative">
            <Image src={imgSrc} alt="Car" fill className="object-cover" referrerPolicy="no-referrer" />
          </div>
          <div>
            <p className="text-sm font-semibold">{title}</p>
            <p className="text-xs text-slate-500">{subtitle}</p>
          </div>
        </div>
      </td>
      <td className="py-4 text-xs font-mono text-slate-500 uppercase">{vin}</td>
      <td className="py-4">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-bold text-rose-500">{days}</span>
          <div className="w-24 h-1 bg-slate-200 dark:bg-slate-700 rounded-full">
            <div className="h-full bg-rose-500 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </td>
      <td className="py-4 text-sm font-semibold">{price}</td>
      <td className="py-4">
        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${statusColor}`}>{status}</span>
      </td>
      <td className="py-4 text-right">
        <button className="p-1 hover:text-primary transition-colors">
          <MoreVertical className="size-5" />
        </button>
      </td>
    </tr>
  );
}
