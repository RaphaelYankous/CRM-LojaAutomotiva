'use client';

import { useState } from 'react';
import { Plus, ChevronDown, Filter, MoreVertical, ChevronLeft, ChevronRight, Edit, Trash2, Printer } from 'lucide-react';
import Modal from '@/components/Modal';
import { useAppContext } from '@/app/context/AppContext';
import { useLocalStorage } from '@/hooks/use-local-storage';

const initialContracts = [
  {
    id: '1',
    contractId: "#COM-8291", date: "12 OUT, 2023",
    customerName: "Robert Chambers", customerEmail: "chambers.r@email.com",
    customerCpf: "111.222.333-44", customerRg: "MG-12.345.678", customerPhone: "(31) 99999-1111", customerAddress: "Rua A, 123, Belo Horizonte - MG",
    vehicle: "Porsche 911 GT3 2023", stockType: "Estoque Próprio", stockColor: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    type: "Compra", value: "R$ 1.182.400,00",
    status: "Concluído", statusColor: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", dotColor: "bg-green-500"
  },
  {
    id: '2',
    contractId: "#VEN-9102", date: "14 OUT, 2023",
    customerName: "Elena Rodriguez", customerEmail: "elena.rod@web.com",
    customerCpf: "222.333.444-55", customerRg: "MG-23.456.789", customerPhone: "(31) 98888-2222", customerAddress: "Av. B, 456, Nova Lima - MG",
    vehicle: "BMW M4 Competition 2021", stockType: "Consignado", stockColor: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    type: "Venda", value: "R$ 574.500,00",
    status: "Assinado", statusColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", dotColor: "bg-amber-500"
  },
  {
    id: '3',
    contractId: "#CON-3321", date: "15 OUT, 2023",
    customerName: "Marcus Webb", customerEmail: "mwebb.luxury@mail.com",
    customerCpf: "333.444.555-66", customerRg: "MG-34.567.890", customerPhone: "(31) 97777-3333", customerAddress: "Rua C, 789, Contagem - MG",
    vehicle: "Mercedes-Benz G63 AMG 2019", stockType: "Consignado", stockColor: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    type: "Consignação", value: "R$ 1.155.000,00",
    status: "Rascunho", statusColor: "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400", dotColor: "bg-slate-500"
  }
];

export default function Contracts() {
  const { companyData } = useAppContext();
  const [contracts, setContracts] = useLocalStorage<any[]>('crm-contracts', initialContracts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<any>(null);

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerCpf: '',
    customerRg: '',
    customerPhone: '',
    customerAddress: '',
    vehicle: '',
    vehiclePlate: '',
    vehicleChassi: '',
    vehicleRenavam: '',
    vehicleYear: '',
    vehicleColor: '',
    vehicleFuel: '',
    vehicleKm: '',
    type: 'Venda',
    value: '',
    status: 'Rascunho',
    stockType: 'Estoque Próprio'
  });

  const handleOpenModal = (contract?: any) => {
    if (contract) {
      setEditingContract(contract);
      setFormData({
        customerName: contract.customerName || '',
        customerEmail: contract.customerEmail || '',
        customerCpf: contract.customerCpf || '',
        customerRg: contract.customerRg || '',
        customerPhone: contract.customerPhone || '',
        customerAddress: contract.customerAddress || '',
        vehicle: contract.vehicle || '',
        vehiclePlate: contract.vehiclePlate || '',
        vehicleChassi: contract.vehicleChassi || '',
        vehicleRenavam: contract.vehicleRenavam || '',
        vehicleYear: contract.vehicleYear || '',
        vehicleColor: contract.vehicleColor || '',
        vehicleFuel: contract.vehicleFuel || '',
        vehicleKm: contract.vehicleKm || '',
        type: contract.type || 'Venda',
        value: contract.value || '',
        status: contract.status || 'Rascunho',
        stockType: contract.stockType || 'Estoque Próprio'
      });
    } else {
      setEditingContract(null);
      setFormData({
        customerName: '',
        customerEmail: '',
        customerCpf: '',
        customerRg: '',
        customerPhone: '',
        customerAddress: '',
        vehicle: '',
        vehiclePlate: '',
        vehicleChassi: '',
        vehicleRenavam: '',
        vehicleYear: '',
        vehicleColor: '',
        vehicleFuel: '',
        vehicleKm: '',
        type: 'Venda',
        value: '',
        status: 'Rascunho',
        stockType: 'Estoque Próprio'
      });
    }
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este contrato?')) {
      setContracts(contracts.filter((c: any) => c.id !== id));
    }
  };

  const handlePrintContract = (contract: any) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const dateStr = contract.date || new Date().toLocaleDateString('pt-BR');
    const typeText = contract.type === 'Compra' ? 'COMPRA' : contract.type === 'Venda' ? 'VENDA' : 'CONSIGNAÇÃO';
    
    // Determine roles based on contract type
    const isCompra = contract.type === 'Compra';
    const isVenda = contract.type === 'Venda';
    
    const agenciaRole = isCompra ? 'COMPRADORA' : isVenda ? 'VENDEDORA' : 'CONSIGNATÁRIA';
    const clienteRole = isCompra ? 'VENDEDOR(A)' : isVenda ? 'COMPRADOR(A)' : 'CONSIGNANTE';

    const html = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>Contrato de ${typeText} - ${contract.contractId}</title>
        <style>
          @page {
            margin: 2.5cm;
            size: A4 portrait;
          }
          body { 
            font-family: 'Times New Roman', Times, serif; 
            line-height: 1.5; 
            color: #000; 
            font-size: 11pt;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 2px solid #000;
            padding-bottom: 20px;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 10px;
          }
          .header-info {
            font-size: 10pt;
            color: #444;
          }
          h1 { 
            text-align: center; 
            font-size: 14pt; 
            text-transform: uppercase; 
            margin-bottom: 30px; 
            font-weight: bold;
          }
          h2 {
            font-size: 12pt;
            font-weight: bold;
            margin-top: 25px;
            margin-bottom: 10px;
            text-transform: uppercase;
          }
          p { 
            text-align: justify; 
            margin-bottom: 12px; 
            text-indent: 2cm;
          }
          .no-indent {
            text-indent: 0;
          }
          .parties {
            margin-bottom: 30px;
          }
          .parties p {
            text-indent: 0;
          }
          .clause-title {
            font-weight: bold;
            text-decoration: underline;
          }
          .signatures { 
            margin-top: 80px; 
            display: flex; 
            justify-content: space-between; 
            flex-wrap: wrap;
            gap: 40px;
          }
          .signature-block { 
            width: 45%; 
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .signature-line { 
            width: 100%; 
            border-top: 1px solid #000; 
            margin-bottom: 10px;
          }
          .signature-name {
            font-weight: bold;
            text-align: center;
          }
          .signature-role {
            font-size: 10pt;
            text-align: center;
          }
          .date-location { 
            text-align: right; 
            margin-top: 50px; 
            margin-bottom: 50px; 
            font-weight: bold;
          }
          .witnesses {
            margin-top: 60px;
            width: 100%;
            display: flex;
            justify-content: space-between;
          }
          .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 8pt;
            color: #666;
            border-top: 1px solid #ccc;
            padding-top: 10px;
          }
          
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="text-align: center; margin-bottom: 20px;">
          <button onclick="window.print()" style="padding: 10px 20px; background: #0f172a; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">Imprimir Contrato</button>
        </div>

        <div class="header">
          <div class="logo">${companyData.name.toUpperCase()}</div>
          <div class="header-info">
            CNPJ: ${companyData.cnpj} | IE: Isento<br>
            ${companyData.address}<br>
            Telefone: ${companyData.phone} | E-mail: ${companyData.email}
          </div>
        </div>

        <h1>INSTRUMENTO PARTICULAR DE CONTRATO DE ${typeText} DE VEÍCULO AUTOMOTOR</h1>
        
        <div class="parties">
          <p class="no-indent">Pelo presente instrumento particular, e na melhor forma de direito, as partes abaixo qualificadas:</p>
          
          <p class="no-indent" style="margin-top: 15px;">
            <strong>DE UM LADO, COMO ${agenciaRole}:</strong><br>
            <strong>${companyData.name.toUpperCase()}</strong>, pessoa jurídica de direito privado, inscrita no CNPJ sob o nº ${companyData.cnpj}, com sede em ${companyData.address}, neste ato representada por seu sócio administrador.
          </p>

          <p class="no-indent" style="margin-top: 15px;">
            <strong>E DE OUTRO LADO, COMO ${clienteRole}:</strong><br>
            <strong>${contract.customerName.toUpperCase()}</strong>, inscrito(a) no CPF sob o nº ${contract.customerCpf || '___.___.___-__'}, portador(a) da Cédula de Identidade RG nº ${contract.customerRg || '____________________'}, residente e domiciliado(a) em ${contract.customerAddress || '_________________________________________________________________________________'}, telefone ${contract.customerPhone || '(  ) _____-____'}, e-mail ${contract.customerEmail || '____________________'}.
          </p>
        </div>

        <p class="no-indent">As partes acima identificadas têm, entre si, justo e acertado o presente Contrato de ${typeText} de Veículo Automotor, que se regerá pelas cláusulas seguintes e pelas condições descritas no presente.</p>

        <h2>CLÁUSULA PRIMEIRA - DO OBJETO</h2>
        <p>O presente contrato tem como objeto a ${contract.type.toLowerCase()} do veículo automotor de propriedade ${isCompra ? 'do(a) VENDEDOR(A)' : 'da VENDEDORA'}, livre e desembaraçado de quaisquer ônus, dívidas, restrições financeiras, tributárias ou judiciais, com as seguintes características:</p>
        <ul style="margin-left: 2cm; margin-bottom: 15px;">
          <li><strong>Veículo/Modelo:</strong> ${contract.vehicle}</li>
          <li><strong>Placa:</strong> ${contract.vehiclePlate || '_________________'}</li>
          <li><strong>Chassi:</strong> ${contract.vehicleChassi || '___________________________________'}</li>
          <li><strong>Renavam:</strong> ${contract.vehicleRenavam || '_________________'}</li>
          <li><strong>Ano Fabricação/Modelo:</strong> ${contract.vehicleYear || '______/______'}</li>
          <li><strong>Cor:</strong> ${contract.vehicleColor || '_________________'}</li>
          <li><strong>Combustível:</strong> ${contract.vehicleFuel || '_________________'}</li>
          <li><strong>Quilometragem:</strong> ${contract.vehicleKm || '_________________'} km</li>
        </ul>

        <h2>CLÁUSULA SEGUNDA - DO VALOR E FORMA DE PAGAMENTO</h2>
        <p>Pela ${contract.type.toLowerCase()} do veículo objeto deste contrato, a parte ${isCompra ? 'COMPRADORA' : 'COMPRADOR(A)'} pagará à parte ${isCompra ? 'VENDEDOR(A)' : 'VENDEDORA'} a quantia certa e ajustada de <strong>${contract.value}</strong>, que será paga da seguinte forma:</p>
        <p class="no-indent" style="margin-left: 2cm;">
          (  ) À vista, através de transferência bancária (PIX/TED).<br>
          (  ) Financiamento bancário através da instituição ____________________.<br>
          (  ) Veículo dado como parte do pagamento: ________________________________.<br>
          (  ) Outros: ________________________________________________________.
        </p>
        <p><strong>Parágrafo Primeiro:</strong> O pagamento por meio de cheque ou transferência bancária só será considerado quitado após a efetiva compensação ou crédito na conta da parte ${isCompra ? 'VENDEDOR(A)' : 'VENDEDORA'}.</p>
        <p><strong>Parágrafo Segundo:</strong> A quitação total do valor acordado é condição indispensável para a transferência definitiva da propriedade do veículo.</p>

        <h2>CLÁUSULA TERCEIRA - DA TRANSFERÊNCIA E TRADIÇÃO</h2>
        <p>A posse do veículo é transmitida neste ato, assumindo a parte ${isCompra ? 'COMPRADORA' : 'COMPRADOR(A)'} toda e qualquer responsabilidade civil e criminal por atos praticados com o veículo a partir da data e hora da assinatura deste instrumento.</p>
        <p><strong>Parágrafo Primeiro:</strong> A transferência de propriedade junto ao Departamento de Trânsito (DETRAN/MG) deverá ser efetuada no prazo máximo e improrrogável de 30 (trinta) dias, conforme determina o art. 123, § 1º do Código de Trânsito Brasileiro (CTB), correndo todas as despesas (taxas, vistorias, emplacamento) por conta exclusiva da parte ${isCompra ? 'COMPRADORA' : 'COMPRADOR(A)'}.</p>
        <p><strong>Parágrafo Segundo:</strong> A parte ${isCompra ? 'VENDEDOR(A)' : 'VENDEDORA'} compromete-se a entregar o Certificado de Registro de Veículo (CRV) devidamente preenchido, assinado e com firma reconhecida por autenticidade no ato da confirmação do pagamento integral.</p>
        <p><strong>Parágrafo Terceiro:</strong> O descumprimento do prazo estipulado no Parágrafo Primeiro isenta a parte ${isCompra ? 'VENDEDOR(A)' : 'VENDEDORA'} de qualquer responsabilidade sobre multas, impostos ou infrações cometidas após a tradição do veículo, autorizando-a a realizar a Comunicação de Venda junto ao DETRAN/MG.</p>

        <h2>CLÁUSULA QUARTA - DAS RESPONSABILIDADES E MULTAS</h2>
        <p>A parte ${isCompra ? 'VENDEDOR(A)' : 'VENDEDORA'} declara expressamente que o veículo encontra-se livre de quaisquer débitos de IPVA, DPVAT, Taxa de Licenciamento e multas de trânsito até a presente data. Caso surjam débitos cujo fato gerador seja anterior à data deste contrato, a responsabilidade pelo pagamento será exclusiva da parte ${isCompra ? 'VENDEDOR(A)' : 'VENDEDORA'}.</p>
        <p><strong>Parágrafo Único:</strong> A partir da data e hora da assinatura deste contrato, todas as despesas, impostos, taxas e multas de trânsito que vierem a incidir sobre o veículo passarão a ser de inteira e exclusiva responsabilidade da parte ${isCompra ? 'COMPRADORA' : 'COMPRADOR(A)'}.</p>

        <h2>CLÁUSULA QUINTA - DO ESTADO DO VEÍCULO (GARANTIA)</h2>
        <p>O veículo é negociado no estado de conservação em que se encontra. A parte ${isCompra ? 'COMPRADORA' : 'COMPRADOR(A)'} declara ter vistoriado minuciosamente o veículo, testado seu funcionamento e verificado suas condições de mecânica, funilaria, pintura e estofamento, aceitando-o nas exatas condições em que se apresenta.</p>
        ${isVenda ? `<p><strong>Parágrafo Primeiro:</strong> Tratando-se de relação de consumo, a VENDEDORA concede garantia legal de 90 (noventa) dias para motor e caixa de câmbio, conforme preceitua o art. 26, inciso II do Código de Defesa do Consumidor (Lei 8.078/90).</p>
        <p><strong>Parágrafo Segundo:</strong> A garantia estipulada no parágrafo anterior não cobre itens de desgaste natural (pastilhas de freio, pneus, correias, filtros, óleos, etc.), nem danos causados por mau uso, negligência, acidentes ou manutenção inadequada por parte do COMPRADOR(A).</p>` : ''}

        <h2>CLÁUSULA SEXTA - DA RESCISÃO E PENALIDADES</h2>
        <p>Em caso de arrependimento ou descumprimento de qualquer cláusula deste contrato por qualquer das partes, a parte infratora estará sujeita ao pagamento de multa penal compensatória equivalente a 10% (dez por cento) do valor total do veículo, sem prejuízo de eventuais perdas e danos.</p>

        <h2>CLÁUSULA SÉTIMA - DAS DISPOSIÇÕES GERAIS E FORO</h2>
        <p>Este contrato é celebrado em caráter irrevogável e irretratável, obrigando as partes, seus herdeiros e sucessores a qualquer título.</p>
        <p>Para dirimir quaisquer controvérsias oriundas do presente contrato, as partes elegem o foro da Comarca de Belo Horizonte, Estado de Minas Gerais, renunciando a qualquer outro, por mais privilegiado que seja.</p>

        <p class="no-indent" style="margin-top: 30px;">E, por estarem assim justos e contratados, firmam o presente instrumento em 02 (duas) vias de igual teor e forma, na presença de 02 (duas) testemunhas abaixo assinadas.</p>

        <div class="date-location">
          Belo Horizonte - MG, ${dateStr}.
        </div>

        <div class="signatures">
          <div class="signature-block">
            <div class="signature-line"></div>
            <div class="signature-name">${companyData.name.toUpperCase()}</div>
            <div class="signature-role">${agenciaRole}</div>
            <div class="signature-role">CNPJ: ${companyData.cnpj}</div>
          </div>
          
          <div class="signature-block">
            <div class="signature-line"></div>
            <div class="signature-name">${contract.customerName.toUpperCase()}</div>
            <div class="signature-role">${clienteRole}</div>
            <div class="signature-role">CPF: ${contract.customerCpf || '___.___.___-__'}</div>
          </div>
        </div>

        <div class="witnesses">
          <div class="signature-block">
            <div class="signature-line"></div>
            <div class="signature-name">Testemunha 1</div>
            <div class="signature-role">CPF: _______________________</div>
          </div>
          
          <div class="signature-block">
            <div class="signature-line"></div>
            <div class="signature-name">Testemunha 2</div>
            <div class="signature-role">CPF: _______________________</div>
          </div>
        </div>

        <div class="footer">
          Documento gerado pelo Sistema de Gestão - ID: ${contract.contractId}
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    // Auto print removed to allow user to see the template first, they can use the button
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let statusColor = "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400";
    let dotColor = "bg-slate-500";
    if (formData.status === 'Assinado') {
      statusColor = "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      dotColor = "bg-amber-500";
    } else if (formData.status === 'Concluído') {
      statusColor = "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      dotColor = "bg-green-500";
    }

    let stockColor = "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
    if (formData.stockType === 'Consignado') {
      stockColor = "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400";
    }

    const newContract = {
      ...formData,
      statusColor,
      dotColor,
      stockColor,
      date: editingContract ? editingContract.date : new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(),
      contractId: editingContract ? editingContract.contractId : `#${formData.type.substring(0,3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`
    };

    if (editingContract) {
      setContracts(contracts.map((c: any) => c.id === editingContract.id ? { ...newContract, id: c.id } : c));
    } else {
      setContracts([...contracts, { ...newContract, id: Date.now().toString() }]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-slate-900 dark:text-slate-100 text-3xl font-black leading-tight tracking-tight">Contratos</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Crie e gerencie os acordos da sua concessionária</p>
        </div>
        <div className="relative group">
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center gap-2 rounded-lg h-11 px-6 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/30 hover:brightness-110 transition-all"
          >
            <Plus className="size-5" />
            <span>Gerar Novo Contrato</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col bg-white dark:bg-slate-900/50 rounded-xl border border-primary/10 overflow-hidden shadow-sm">
        <div className="flex border-b border-primary/10 px-4">
          <Tab label="Todos os Contratos" active={true} />
          <Tab label="Compra" active={false} />
          <Tab label="Venda" active={false} />
          <Tab label="Consignação" active={false} />
        </div>

        <div className="flex flex-wrap items-center gap-3 p-4">
          <div className="flex bg-primary/5 rounded-lg p-1">
            <button className="px-4 py-1.5 rounded-md bg-white dark:bg-slate-800 text-primary text-xs font-bold shadow-sm">Todo o Estoque</button>
            <button className="px-4 py-1.5 rounded-md text-slate-500 text-xs font-bold hover:text-primary transition-colors">Estoque Próprio</button>
            <button className="px-4 py-1.5 rounded-md text-slate-500 text-xs font-bold hover:text-primary transition-colors">Consignado</button>
          </div>
          <div className="h-8 w-px bg-primary/10 mx-2"></div>
          <button className="flex items-center gap-2 h-9 px-4 rounded-lg bg-primary/10 text-primary text-xs font-bold">
            <span>Status: Todos</span>
            <Filter className="size-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary/5 text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                <th className="px-6 py-4">ID do Contrato</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Detalhes do Veículo</th>
                <th className="px-6 py-4">Tipo de Contrato</th>
                <th className="px-6 py-4 text-right">Valor</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {contracts.map((contract: any) => (
                <ContractRow 
                  key={contract.id}
                  {...contract}
                  onEdit={() => handleOpenModal(contract)}
                  onDelete={() => handleDelete(contract.id)}
                  onPrint={() => handlePrintContract(contract)}
                />
              ))}
              {contracts.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                    Nenhum contrato encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="flex items-center justify-between px-6 py-4 bg-primary/5 border-t border-primary/10">
          <p className="text-xs text-slate-500 font-medium">Exibindo {contracts.length > 0 ? 1 : 0} a {contracts.length} de {contracts.length} contratos</p>
          <div className="flex gap-2">
            <button className="size-8 flex items-center justify-center rounded border border-primary/20 text-slate-500 hover:bg-primary hover:text-white transition-all disabled:opacity-50" disabled>
              <ChevronLeft className="size-4" />
            </button>
            <button className="size-8 flex items-center justify-center rounded bg-primary text-white text-xs font-bold shadow-sm">1</button>
            <button className="size-8 flex items-center justify-center rounded border border-primary/20 text-slate-500 hover:bg-primary hover:text-white transition-all text-xs font-bold disabled:opacity-50" disabled>
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingContract ? "Editar Contrato" : "Gerar Novo Contrato"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome do Cliente</label>
                <input required type="text" value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent" placeholder="Ex: Robert Chambers" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">E-mail do Cliente</label>
                <input required type="email" value={formData.customerEmail} onChange={e => setFormData({...formData, customerEmail: e.target.value})} className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent" placeholder="Ex: email@exemplo.com" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">CPF do Cliente</label>
                <input type="text" value={formData.customerCpf} onChange={e => setFormData({...formData, customerCpf: e.target.value})} className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent" placeholder="Ex: 111.222.333-44" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">RG do Cliente</label>
                <input type="text" value={formData.customerRg} onChange={e => setFormData({...formData, customerRg: e.target.value})} className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent" placeholder="Ex: MG-12.345.678" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Telefone do Cliente</label>
                <input type="text" value={formData.customerPhone} onChange={e => setFormData({...formData, customerPhone: e.target.value})} className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent" placeholder="Ex: (31) 99999-9999" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Endereço do Cliente</label>
                <input type="text" value={formData.customerAddress} onChange={e => setFormData({...formData, customerAddress: e.target.value})} className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent" placeholder="Ex: Rua A, 123, BH - MG" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Veículo (Marca/Modelo)</label>
              <input required type="text" value={formData.vehicle} onChange={e => setFormData({...formData, vehicle: e.target.value})} className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent" placeholder="Ex: Porsche 911 GT3" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Placa</label>
                <input type="text" value={formData.vehiclePlate} onChange={e => setFormData({...formData, vehiclePlate: e.target.value})} className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent" placeholder="Ex: ABC-1234" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ano (Fab/Mod)</label>
                <input type="text" value={formData.vehicleYear} onChange={e => setFormData({...formData, vehicleYear: e.target.value})} className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent" placeholder="Ex: 2023/2023" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Cor</label>
                <input type="text" value={formData.vehicleColor} onChange={e => setFormData({...formData, vehicleColor: e.target.value})} className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent" placeholder="Ex: Azul" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Chassi</label>
                <input type="text" value={formData.vehicleChassi} onChange={e => setFormData({...formData, vehicleChassi: e.target.value})} className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent" placeholder="Ex: 9BW ZZZ..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Renavam</label>
                <input type="text" value={formData.vehicleRenavam} onChange={e => setFormData({...formData, vehicleRenavam: e.target.value})} className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent" placeholder="Ex: 12345678901" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Combustível</label>
                <input type="text" value={formData.vehicleFuel} onChange={e => setFormData({...formData, vehicleFuel: e.target.value})} className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent" placeholder="Ex: Gasolina" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Quilometragem</label>
                <input type="text" value={formData.vehicleKm} onChange={e => setFormData({...formData, vehicleKm: e.target.value})} className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent" placeholder="Ex: 5.000" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tipo de Contrato</label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent">
                  <option value="Compra">Compra</option>
                  <option value="Venda">Venda</option>
                  <option value="Consignação">Consignação</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tipo de Estoque</label>
                <select value={formData.stockType} onChange={e => setFormData({...formData, stockType: e.target.value})} className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent">
                  <option value="Estoque Próprio">Estoque Próprio</option>
                  <option value="Consignado">Consignado</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Valor (R$)</label>
                <input required type="text" value={formData.value} onChange={e => setFormData({...formData, value: e.target.value})} className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent" placeholder="Ex: R$ 500.000,00" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent">
                  <option value="Rascunho">Rascunho</option>
                  <option value="Assinado">Assinado</option>
                  <option value="Concluído">Concluído</option>
                </select>
              </div>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg font-medium hover:bg-slate-100 dark:hover:bg-slate-800">Cancelar</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-white font-bold">{editingContract ? 'Salvar Alterações' : 'Gerar Contrato'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function Tab({ label, active }: any) {
  return (
    <button className={`flex items-center justify-center border-b-2 px-6 py-4 transition-colors ${active ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-primary'}`}>
      <p className="text-sm font-bold tracking-tight">{label}</p>
    </button>
  );
}

function ContractRow({ contractId, date, customerName, customerEmail, vehicle, stockType, stockColor, type, value, status, statusColor, dotColor, onEdit, onDelete, onPrint }: any) {
  return (
    <tr className="hover:bg-primary/5 transition-colors">
      <td className="px-6 py-5">
        <span className="font-mono text-sm text-primary font-bold">{contractId}</span>
        <p className="text-[10px] text-slate-400 mt-1">{date}</p>
      </td>
      <td className="px-6 py-5">
        <p className="text-sm font-semibold">{customerName}</p>
        <p className="text-xs text-slate-400">{customerEmail}</p>
      </td>
      <td className="px-6 py-5">
        <div className="flex flex-col">
          <span className="text-sm font-medium">{vehicle}</span>
          <div className="flex gap-2 mt-1">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${stockColor}`}>{stockType}</span>
          </div>
        </div>
      </td>
      <td className="px-6 py-5">
        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800">{type}</span>
      </td>
      <td className="px-6 py-5 text-right font-bold text-sm">{value}</td>
      <td className="px-6 py-5">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${statusColor}`}>
          <span className={`size-1.5 rounded-full ${dotColor}`}></span>
          {status}
        </span>
      </td>
      <td className="px-6 py-5 text-right">
        <div className="flex justify-end gap-2">
          <button onClick={onPrint} className="p-2 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-lg transition-colors text-indigo-500" title="Imprimir Contrato">
            <Printer className="size-5" />
          </button>
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
