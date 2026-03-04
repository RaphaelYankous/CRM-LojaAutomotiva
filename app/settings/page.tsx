'use client';

import React, { useState, useEffect } from 'react';
import { Building2, Save, CheckCircle2 } from 'lucide-react';
import { useAppContext, CompanyData } from '../context/AppContext';

export default function SettingsPage() {
  const { companyData, updateCompanyData } = useAppContext();
  const [formData, setFormData] = useState<CompanyData>(companyData);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setFormData(companyData);
  }, [companyData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompanyData(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Configurações</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Gerencie os dados da sua empresa que aparecerão nos contratos.
        </p>
      </div>

      <div className="bg-white dark:bg-[#141414] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
            <Building2 className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-semibold">Dados da Empresa</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Razão Social / Nome Fantasia
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0a0a0a] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Ex: Concessionária Premium Ltda"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                CNPJ
              </label>
              <input
                type="text"
                required
                value={formData.cnpj}
                onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0a0a0a] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Ex: 12.345.678/0001-90"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Endereço Completo
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0a0a0a] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Ex: Av. das Américas, 1000 - Barra da Tijuca, Rio de Janeiro - RJ"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Telefone de Contato
              </label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0a0a0a] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Ex: (21) 99999-9999"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                E-mail de Contato
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0a0a0a] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Ex: contato@empresa.com.br"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            {isSaved ? (
              <div className="flex items-center text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-5 h-5 mr-2" />
                <span>Dados salvos com sucesso!</span>
              </div>
            ) : (
              <div></div>
            )}
            
            <button
              type="submit"
              className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
            >
              <Save className="w-5 h-5 mr-2" />
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
