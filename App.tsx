
import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { 
  Sparkles, 
  Phone, 
  User, 
  Eye, 
  AlertCircle, 
  Baby, 
  Glasses, 
  Heart, 
  CheckCircle2,
  Send,
  Camera,
  Scissors
} from 'lucide-react';

// --- Types ---
interface AnamneseData {
  nome: string;
  telefone: string;
  fezAnteriormente: string;
  alergias: string;
  sensibilidade: string;
  lentes: string;
  problemaOcular: string;
  gestante: string;
  tipoCilios: string;
  observacoes: string;
  autorizacao: boolean;
}

const INITIAL_STATE: AnamneseData = {
  nome: '',
  telefone: '',
  fezAnteriormente: 'Não',
  alergias: 'Não',
  sensibilidade: 'Não',
  lentes: 'Não',
  problemaOcular: 'Não',
  gestante: 'Não',
  tipoCilios: '',
  observacoes: '',
  autorizacao: false,
};

// --- Components ---

const Header: React.FC = () => (
  <header className="py-8 px-4 text-center border-b border-bege/20 bg-white/50 sticky top-0 z-50 backdrop-blur-md">
    <h1 className="font-serif text-3xl md:text-4xl text-dark tracking-wide font-bold">
      Yeda Lash Designer
    </h1>
    <p className="text-rose font-mont text-sm uppercase tracking-[0.2em] mt-2">
      Lash Lifting & Estética Premium
    </p>
    <p className="text-gray-500 italic text-sm mt-4 font-light">
      “Beleza, cuidado e profissionalismo em cada detalhe.”
    </p>
  </header>
);

const RadioGroup: React.FC<{
  label: string;
  name: keyof AnamneseData;
  value: string;
  icon: React.ReactNode;
  onChange: (name: keyof AnamneseData, val: string) => void;
}> = ({ label, name, value, icon, onChange }) => (
  <div className="flex flex-col space-y-3 p-4 rounded-xl bg-nude/10 border border-bege/20">
    <div className="flex items-center gap-2 text-dark/80 font-medium">
      {icon}
      <span className="text-sm">{label}</span>
    </div>
    <div className="flex gap-4">
      {['Sim', 'Não'].map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(name, option)}
          className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all duration-300 ${
            value === option
              ? 'bg-rose text-white shadow-md scale-105'
              : 'bg-white text-dark/60 border border-bege/30 hover:bg-nude/20'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  </div>
);

const App: React.FC = () => {
  const [formData, setFormData] = useState<AnamneseData>(INITIAL_STATE);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePhoneMask = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.replace(/^(\2)(\d)/g, "($1) $2");
    value = value.replace(/(\d)(\d{4})$/, "$1-$2");
    if (value.length > 15) value = value.substring(0, 15);
    setFormData(prev => ({ ...prev, telefone: value }));
  };

  const updateRadioValue = (name: keyof AnamneseData, val: string) => {
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const generatePDF = async () => {
    if (!formData.autorizacao) {
      alert("Por favor, autorize o procedimento para continuar.");
      return;
    }

    setIsGenerating(true);
    const doc = new jsPDF();
    const date = new Date().toLocaleString('pt-BR');

    // Header styling
    doc.setFillColor(245, 235, 224); // Nude color
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(26, 26, 26);
    doc.setFont('playfair', 'bold');
    doc.setFontSize(22);
    doc.text('Yeda Lash Designer', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('montserrat', 'normal');
    doc.text('ANAMNESE - PROCEDIMENTO DE CÍLIOS', 105, 30, { align: 'center' });

    // Content
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Data de Emissão: ${date}`, 20, 50);

    let y = 65;
    const addField = (label: string, value: string) => {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(165, 120, 100); // Rose-ish text
      doc.text(`${label}:`, 20, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(40, 40, 40);
      doc.text(`${value || 'Não informado'}`, 70, y);
      y += 10;
    };

    addField('Nome Completo', formData.nome);
    addField('Telefone', formData.telefone);
    addField('Já fez cílios antes?', formData.fezAnteriormente);
    addField('Alergia a cola/cosméticos', formData.alergias);
    addField('Sensibilidade nos olhos', formData.sensibilidade);
    addField('Usa lentes de contato', formData.lentes);
    addField('Problema ocular', formData.problemaOcular);
    addField('Gestante/Amamentando', formData.gestante);
    addField('Tipo de Cílios desejado', formData.tipoCilios);
    
    y += 5;
    doc.setFont('helvetica', 'bold');
    doc.text('Observações:', 20, y);
    y += 7;
    doc.setFont('helvetica', 'normal');
    const splitObs = doc.splitTextToSize(formData.observacoes || 'Sem observações adicionais.', 170);
    doc.text(splitObs, 20, y);
    
    y += (splitObs.length * 7) + 15;
    doc.setDrawColor(213, 189, 175);
    doc.line(20, y, 190, y);
    y += 10;
    doc.setFontSize(8);
    doc.text('Confirmo que as informações acima são verdadeiras e autorizo o procedimento.', 105, y, { align: 'center' });

    doc.save(`Anamnese_YedaLash_${formData.nome.replace(/\s/g, '_')}.pdf`);

    setTimeout(() => {
      const msg = encodeURIComponent("Olá! Segue minha anamnese preenchida para o procedimento de cílios 💕");
      window.location.href = `https://wa.me/5547984751455?text=${msg}`;
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen pb-20">
      <Header />

      <main className="max-w-3xl mx-auto px-4 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <section className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-rose/10 text-rose text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles size={14} />
            Exclusividade e Cuidado
          </div>
          <h2 className="font-serif text-3xl text-dark mb-4">
            Anamnese para Procedimento de Cílios
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto leading-relaxed">
            Sua segurança é nossa prioridade. Preencha os campos abaixo com atenção para garantirmos o melhor resultado para o seu olhar.
          </p>
        </section>

        <form className="glass-card rounded-3xl p-6 md:p-10 shadow-xl shadow-rose/5 space-y-8" onSubmit={(e) => e.preventDefault()}>
          {/* Identificação Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-bege/30 pb-2">
              <User size={20} className="text-rose" />
              <h3 className="font-serif text-xl">Identificação</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col space-y-1">
                <label className="text-xs font-mont text-gray-400 uppercase tracking-widest pl-1">Nome Completo</label>
                <input
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  placeholder="Ex: Maria Silva"
                  className="input-elegant py-3 text-lg font-light"
                  required
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-xs font-mont text-gray-400 uppercase tracking-widest pl-1">WhatsApp</label>
                <input
                  name="telefone"
                  value={formData.telefone}
                  onChange={handlePhoneMask}
                  placeholder="(00) 00000-0000"
                  className="input-elegant py-3 text-lg font-light"
                  required
                />
              </div>
            </div>
          </div>

          {/* Saúde Section */}
          <div className="space-y-6 pt-4">
            <div className="flex items-center gap-3 border-b border-bege/30 pb-2">
              <Heart size={20} className="text-rose" />
              <h3 className="font-serif text-xl">Saúde e Sensibilidade</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <RadioGroup 
                label="Já realizou extensão/lifting?" 
                name="fezAnteriormente" 
                value={formData.fezAnteriormente} 
                icon={<Eye size={16} />} 
                onChange={updateRadioValue}
              />
              <RadioGroup 
                label="Alergia a cola ou cosméticos?" 
                name="alergias" 
                value={formData.alergias} 
                icon={<AlertCircle size={16} />} 
                onChange={updateRadioValue}
              />
              <RadioGroup 
                label="Sensibilidade nos olhos?" 
                name="sensibilidade" 
                value={formData.sensibilidade} 
                icon={<Sparkles size={16} />} 
                onChange={updateRadioValue}
              />
              <RadioGroup 
                label="Usa lentes de contato?" 
                name="lentes" 
                value={formData.lentes} 
                icon={<Glasses size={16} />} 
                onChange={updateRadioValue}
              />
              <RadioGroup 
                label="Possui algum problema ocular?" 
                name="problemaOcular" 
                value={formData.problemaOcular} 
                icon={<AlertCircle size={16} />} 
                onChange={updateRadioValue}
              />
              <RadioGroup 
                label="Gestante ou amamentando?" 
                name="gestante" 
                value={formData.gestante} 
                icon={<Baby size={16} />} 
                onChange={updateRadioValue}
              />
            </div>
          </div>

          {/* Preferências Section */}
          <div className="space-y-6 pt-4">
            <div className="flex items-center gap-3 border-b border-bege/30 pb-2">
              <Scissors size={20} className="text-rose" />
              <h3 className="font-serif text-xl">Desejos e Observações</h3>
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-xs font-mont text-gray-400 uppercase tracking-widest pl-1">Tipo de Cílios Desejado</label>
              <input
                name="tipoCilios"
                value={formData.tipoCilios}
                onChange={handleInputChange}
                placeholder="Ex: Efeito natural, Boneca, Gatinho..."
                className="input-elegant py-3 text-lg font-light"
              />
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-xs font-mont text-gray-400 uppercase tracking-widest pl-1">Observações Adicionais</label>
              <textarea
                name="observacoes"
                value={formData.observacoes}
                onChange={handleInputChange}
                rows={3}
                placeholder="Conte-nos algo importante sobre sua saúde ou preferência..."
                className="input-elegant py-3 text-lg font-light resize-none"
              />
            </div>
          </div>

          {/* Footer Form */}
          <div className="pt-6 space-y-6 border-t border-bege/30">
            <label className="flex items-start gap-4 cursor-pointer group">
              <div className="relative mt-1">
                <input
                  type="checkbox"
                  name="autorizacao"
                  checked={formData.autorizacao}
                  onChange={handleInputChange}
                  className="peer sr-only"
                />
                <div className="w-6 h-6 border-2 border-bege rounded-md peer-checked:bg-rose peer-checked:border-rose transition-all flex items-center justify-center">
                  <CheckCircle2 size={16} className="text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                </div>
              </div>
              <span className="text-sm text-gray-600 leading-relaxed group-hover:text-dark transition-colors">
                Autorizo o procedimento e confirmo que todas as informações prestadas são verdadeiras e completas.
              </span>
            </label>

            <button
              type="button"
              onClick={generatePDF}
              disabled={isGenerating}
              className={`w-full py-5 rounded-2xl flex items-center justify-center gap-3 text-white font-mont font-semibold tracking-widest transition-all duration-500 shadow-xl ${
                isGenerating 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-dark hover:bg-rose hover:scale-[1.02] active:scale-95 shadow-rose/20'
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  PROCESSANDO...
                </>
              ) : (
                <>
                  <Send size={20} />
                  GERAR ANAMNESE EM PDF
                </>
              )}
            </button>
          </div>
        </form>

        <footer className="mt-12 text-center text-gray-400 text-xs tracking-widest uppercase pb-10">
          © {new Date().getFullYear()} Yeda Lash Designer • Joinville/SC
        </footer>
      </main>
    </div>
  );
};

export default App;
