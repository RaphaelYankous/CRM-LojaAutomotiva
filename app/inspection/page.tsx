'use client';

import { useState } from 'react';
import { CheckSquare, Camera, DollarSign, Save } from 'lucide-react';
import Image from 'next/image';
import { useLocalStorage } from '@/hooks/use-local-storage';

const initialInspection = {
  carModel: "Corolla Altis 2.0",
  carDetails: "2022/2022 • 34.000 km",
  carImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBmaaCscC-VfTsG1VFtgWTozxdPeTDElLppzR61dsX77SWGU7M8CCue2aa0pYZp_yVgJ0akPVcvdJYtxZa7fSqtB_QBfhvs3oZAWbcs8TK2A2v1yrrOiHiOvLHBiULzLNO0UNY6odkWWM7ZIIEOTvFJJuvQW-Jm2icUrs_Livx3rnDsrElXD1V-lQo3vblV5yUFhFk2FBYAwIY0aFqH60_xlUstpytnjOgzN7dsSMc1DhHOZURIj0xqgQObo80iq7zmiFjQjvLJrlA",
  fipeValue: "84.500,00",
  suggestedValue: "76.200,00",
  notes: "",
  checklist: {
    motor: [
      { label: "Nível e estado do óleo", checked: true },
      { label: "Ruídos anômalos", checked: false },
      { label: "Troca de marchas (suavidade)", checked: true }
    ],
    pintura: [
      { label: "Retoques perceptíveis", checked: false },
      { label: "Riscos e amassados", checked: true },
      { label: "Alinhamento de painéis", checked: true }
    ],
    pneus: [
      { label: "Sulco dos pneus (> 1.6mm)", checked: true },
      { label: "Estado das rodas (riscos)", checked: false }
    ]
  },
  photos: [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDCqNv6tW_KXK-t6yeMYr-f4D8lc4ZE5a4dY04dYTrq6FdxXHjRPR2OD90w3vbc5-7opLywyRzvGNIdI0VKCazeuJux31wqHwR0_lMj0zml_H8-W1O7Bns-Sh5q_raCgFYKK1SkHnjlp20NJYogkUccps7OQ3vmjKua86MKrzYpzjOydcZjEZEZYjG6f16KovWuZT0NFb0YMIZAh00T1QA_jjyY55tLWdkHaMnYxC0DagbYDjX6_2XIw8IUa3iBEiiHpOPESKfB5cw",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCN2ap4pDRyZl2kVKvGtCgXg0azDX77ypywlJk2fG0OYIhhExUyydVrNcJAMNGsv3stoioog5htFvKS6YO6nwu6nzJ_TR1SP7e3zxCo6QBnD5Ww1unEeioGsCDM2oJDkLu0FPkrZbplYm-_Zfk0oh7EWk_b1R5Lk7qLIdm4eOZxlT7xbtBD6s4MPCQs_mqYy48CfgTFvNwVs6QW4m_oMZLbHojBxglImJFaJBjdAWVqHxKVi58n1JCRaOIzbVfhNMJ3Cqx9wO-zpGc"
  ]
};

export default function Inspection() {
  const [inspectionData, setInspectionData] = useLocalStorage('crm-inspection', initialInspection);
  const [isSaved, setIsSaved] = useState(false);

  const handleChecklistChange = (category: string, index: number, checked: boolean) => {
    setInspectionData({
      ...inspectionData,
      checklist: {
        ...inspectionData.checklist,
        [category]: inspectionData.checklist[category as keyof typeof inspectionData.checklist].map((item: any, i: number) => 
          i === index ? { ...item, checked } : item
        )
      }
    });
  };

  const handleRemovePhoto = (index: number) => {
    setInspectionData({
      ...inspectionData,
      photos: inspectionData.photos.filter((_: any, i: number) => i !== index)
    });
  };

  const handleAddPhoto = () => {
    const newPhoto = prompt("Insira a URL da imagem:");
    if (newPhoto) {
      setInspectionData({
        ...inspectionData,
        photos: [...inspectionData.photos, newPhoto]
      });
    }
  };

  const calculateMargin = () => {
    const fipe = parseFloat(inspectionData.fipeValue.replace(/\./g, '').replace(',', '.'));
    const suggested = parseFloat(inspectionData.suggestedValue.replace(/\./g, '').replace(',', '.'));
    if (isNaN(fipe) || isNaN(suggested) || fipe === 0) return 0;
    return (((fipe - suggested) / fipe) * 100).toFixed(1);
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="p-8 flex justify-center">
      <div className="flex flex-col max-w-[1024px] flex-1 gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-slate-900 dark:text-slate-100 text-4xl font-extrabold tracking-tight">Vistoria Técnica</h1>
          <p className="text-slate-600 dark:text-slate-400 text-base font-normal">Inspeção detalhada para precificação de mercado e entrada no estoque.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <section className="bg-primary/5 border border-primary/10 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <CheckSquare className="size-6 text-primary" />
                Checklist de Inspeção
              </h3>
              <div className="space-y-4">
                <ChecklistCategory 
                  title="Motor e Transmissão" 
                  items={inspectionData.checklist.motor} 
                  onChange={(idx, checked) => handleChecklistChange('motor', idx, checked)}
                />
                <ChecklistCategory 
                  title="Pintura e Funilaria" 
                  items={inspectionData.checklist.pintura} 
                  onChange={(idx, checked) => handleChecklistChange('pintura', idx, checked)}
                />
                <ChecklistCategory 
                  title="Pneus e Rodas" 
                  items={inspectionData.checklist.pneus} 
                  onChange={(idx, checked) => handleChecklistChange('pneus', idx, checked)}
                />
              </div>
            </section>

            <section className="bg-primary/5 border border-primary/10 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Camera className="size-6 text-primary" />
                Fotos da Vistoria
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="aspect-square rounded-lg border-2 border-dashed border-primary/30 flex flex-col items-center justify-center gap-2 hover:border-primary transition-colors cursor-pointer bg-background-light dark:bg-background-dark/40">
                  <Camera className="size-6 text-primary" />
                  <span className="text-xs font-medium">Frente</span>
                </div>
                {inspectionData.photos.map((src: string, idx: number) => (
                  <PhotoItem key={idx} src={src} onRemove={() => handleRemovePhoto(idx)} />
                ))}
                <div onClick={handleAddPhoto} className="aspect-square rounded-lg border-2 border-dashed border-primary/30 flex flex-col items-center justify-center gap-2 hover:border-primary transition-colors cursor-pointer bg-background-light dark:bg-background-dark/40">
                  <span className="text-primary text-3xl font-light">+</span>
                </div>
              </div>
            </section>
          </div>

          <div className="flex flex-col gap-6">
            <section className="bg-primary/5 border border-primary/10 rounded-xl p-6 h-fit sticky top-8">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <DollarSign className="size-6 text-primary" />
                Precificação
              </h3>
              <div className="space-y-6">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-slate-500 uppercase font-bold">Valor de Mercado (FIPE)</span>
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">R$ {inspectionData.fipeValue}</div>
                </div>

                <div className="space-y-4 pt-4 border-t border-primary/10">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Sugestão de Compra</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">R$</span>
                      <input 
                        type="text" 
                        value={inspectionData.suggestedValue}
                        onChange={(e) => setInspectionData({...inspectionData, suggestedValue: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-background-light dark:bg-background-dark border border-primary/20 focus:ring-2 focus:ring-primary focus:border-transparent outline-none font-bold text-lg" 
                      />
                    </div>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <div className="flex justify-between items-center text-sm mb-1">
                      <span className="text-slate-500">Margem Estimada</span>
                      <span className="text-primary font-bold">{calculateMargin()}%</span>
                    </div>
                    <div className="w-full bg-primary/20 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-primary h-full transition-all duration-500" style={{ width: `${Math.min(Math.max(parseFloat(calculateMargin() as string) * 5, 0), 100)}%` }}></div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-4">
                  <label className="text-sm font-medium">Observações do Avaliador</label>
                  <textarea 
                    value={inspectionData.notes}
                    onChange={(e) => setInspectionData({...inspectionData, notes: e.target.value})}
                    className="w-full p-3 rounded-lg bg-background-light dark:bg-background-dark border border-primary/20 focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm resize-none" 
                    placeholder="Detalhes sobre a conservação ou reparos necessários..." 
                    rows={4}
                  ></textarea>
                </div>

                <div className="flex flex-col gap-3 pt-4">
                  <button 
                    onClick={handleSave}
                    className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                  >
                    <Save className="size-5" />
                    {isSaved ? 'Salvo com sucesso!' : 'Finalizar Avaliação'}
                  </button>
                  <button className="w-full py-3 bg-transparent border border-primary/40 text-primary hover:bg-primary/10 font-bold rounded-lg transition-all">
                    Salvar Rascunho
                  </button>
                </div>
              </div>
            </section>

            <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex gap-4 items-center">
              <div className="h-16 w-16 rounded-lg bg-background-dark flex items-center justify-center overflow-hidden relative">
                <Image src={inspectionData.carImage} alt="Car" fill className="object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold">{inspectionData.carModel}</span>
                <span className="text-xs text-slate-500">{inspectionData.carDetails}</span>
                <div className="flex gap-1 mt-1">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/20 text-primary font-bold">AUTOMÁTICO</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/20 text-primary font-bold">FLEX</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChecklistCategory({ title, items, onChange }: { title: string, items: any[], onChange: (idx: number, checked: boolean) => void }) {
  return (
    <div className="p-4 rounded-lg bg-background-light dark:bg-background-dark/50 border border-primary/10">
      <p className="font-semibold text-primary mb-3 text-sm uppercase tracking-wider">{title}</p>
      <div className="space-y-3">
        {items.map((item, i) => (
          <label key={i} className="flex items-center justify-between cursor-pointer group">
            <span className="text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">{item.label}</span>
            <input 
              type="checkbox" 
              checked={item.checked}
              onChange={(e) => onChange(i, e.target.checked)}
              className="h-6 w-6 rounded border-primary/30 bg-transparent text-primary focus:ring-primary focus:ring-offset-background-dark" 
            />
          </label>
        ))}
      </div>
    </div>
  );
}

function PhotoItem({ src, onRemove }: { src: string, onRemove: () => void }) {
  return (
    <div className="aspect-square rounded-lg overflow-hidden relative group">
      <Image src={src} alt="Vistoria" fill className="object-cover" referrerPolicy="no-referrer" />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
        <span onClick={onRemove} className="text-white cursor-pointer font-bold text-sm">Remover</span>
      </div>
    </div>
  );
}
