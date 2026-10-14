import React, { useState, useEffect } from 'react';
import { 
  Newspaper, Vote, AlertCircle, User, CheckCircle2, 
  Send, Plus, Trash2, Edit2, ShieldAlert, BookOpen, 
  ChevronRight, Lock, LogOut, Check, ArrowRight,
  Filter, Calendar, Clock, AlertTriangle, Sparkles, X, Eye, Users
} from 'lucide-react';

// Classi ufficiali Liceo Scientifico F. Vercelli
const VERCELLI_CLASSES = [
  '1A', '2A', '3A', '4A', '5A',
  '1B', '2B', '3B', '4B', '5B',
  '1C', '2C', '3C', '4C', '5C',
  '1D', '2D', '3D', '4D', '5D',
  '1E', '2E', '3E', '4E', '5E',
  '1F', '2F', '3F', '4F', '5F',
  '1G', '2G', '3G', '4G', '5G',
  '1H', '2H', '3H', '4H'
];

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('news');
  const [vpAdmin, setVpAdmin] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [showVademecumModal, setShowVademecumModal] = useState(false);

  // Registrazione / Auth state
  const [email, setEmail] = useState('');
  const [userClass, setUserClass] = useState('3A');
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [authError, setAuthError] = useState('');

  // Contenuti Vademecum
  const [vademecum, setVademecum] = useState([
    {
      id: 1,
      title: "Diritto di Assemblea di Classe",
      category: "Diritti",
      description: "Ogni classe ha diritto a 2 ore al mese di assemblea negli orari di lezione. La richiesta va presentata al Preside almeno 5 giorni prima.",
      source: "Statuto degli Studenti - Art. 3"
    },
    {
      id: 2,
      title: "Giustificazione Assenze e Ritardi",
      category: "Regolamento",
      description: "Le assenze devono essere giustificate entro 3 giorni tramite registro elettronico. Oltre i 5 giorni di malattia consecutivi occorre certificato.",
      source: "Regolamento d'Istituto Vercelli"
    },
    {
      id: 3,
      title: "Uso dei Dispositivi Mobili",
      category: "Regolamento",
      description: "È vietato l'uso dello smartphone durante le ore di lezione se non espressamente autorizzato dal docente per fini didattici.",
      source: "Circolare Interna 2023/24"
    }
  ]);

  // Modale per Vademecum CRUD
  const [showVadeForm, setShowVadeForm] = useState(false);
  const [editingVadeId, setEditingVadeId] = useState(null);
  const [vadeForm, setVadeForm] = useState({ title: '', category: 'Diritti', description: '', source: '' });

  // News
  const [news, setNews] = useState([
    {
      id: 1,
      title: "Incontro per la Giornata dell'Arte",
      author: "VP Rappresentanti",
      date: "Oggi",
      content: "Ci vediamo domani nell'Aula Magna dopo la 4a ora per pianificare i laboratori artistici del Vercelli!",
      target: "Tutti"
    }
  ]);
  const [newNewsTitle, setNewNewsTitle] = useState('');
  const [newNewsContent, setNewNewsContent] = useState('');
  const [newsTarget, setNewsTarget] = useState('Tutti');

  // Sondaggi
  const [polls, setPolls] = useState([
    {
      id: 1,
      question: "Sondaggio Merendine: cosa aggiungere ai distributori?",
      target: "Tutti",
      options: [
        { id: 'a', text: "Opzioni senza glutine", votes: 42 },
        { id: 'b', text: "Frutta fresca", votes: 18 },
        { id: 'c', text: "Snack proteici", votes: 35 }
      ],
      userVoted: null,
      expiryDate: "2026-10-31"
    }
  ]);
  const [newPollQuestion, setNewPollQuestion] = useState('');
  const [newPollOptions, setNewPollOptions] = useState(['', '']);
  const [pollExpiry, setPollExpiry] = useState('');

  // Segnalazioni
  const [reports, setReports] = useState([]);
  const [reportText, setReportText] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);

  // Gestione Auth OTP Demo
  const handleRegister = (e) => {
    e.preventDefault();
    if (!email.toLowerCase().endsWith('@scientifico.asti.it')) {
      setAuthError('Utilizza la tua mail scolastica ufficiale (@scientifico.asti.it)');
      return;
    }
    setAuthError('');
    setOtpStep(true);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otpCode === '1234' || otpCode.length === 4) {
      setCurrentUser({
        email,
        userClass,
        name: email.split('@')[0].replace('.', ' ')
      });
    } else {
      setAuthError('Codice OTP non valido (Usa 1234 per la Demo)');
    }
  };

  // Sblocco Admin VP
  const handleAdminUnlock = (e) => {
    e.preventDefault();
    if (pinInput === 'VP2026') {
      setVpAdmin(true);
      setPinError('');
    } else {
      setPinError('PIN non corretto. (PIN Demo: VP2026)');
    }
  };

  // Vademecum CRUD handlers
  const handleOpenAddVade = () => {
    setEditingVadeId(null);
    setVadeForm({ title: '', category: 'Diritti', description: '', source: '' });
    setShowVadeForm(true);
  };

  const handleOpenEditVade = (item) => {
    setEditingVadeId(item.id);
    setVadeForm({ title: item.title, category: item.category, description: item.description, source: item.source });
    setShowVadeForm(true);
  };

  const handleSaveVade = (e) => {
    e.preventDefault();
    if (!vadeForm.title || !vadeForm.description) return;
    if (editingVadeId) {
      setVademecum(vademecum.map(v => v.id === editingVadeId ? { ...v, ...vadeForm } : v));
    } else {
      setVademecum([...vademecum, { id: Date.now(), ...vadeForm }]);
    }
    setShowVadeForm(false);
  };

  const handleDeleteVade = (id) => {
    if (window.confirm("Rimuovere questa voce dal Vademecum?")) {
      setVademecum(vademecum.filter(v => v.id !== id));
    }
  };

  // Votazione Sondaggio
  const handleVote = (pollId, optionId) => {
    setPolls(polls.map(p => {
      if (p.id === pollId) {
        return {
          ...p,
          userVoted: optionId,
          options: p.options.map(opt => opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt)
        };
      }
      return p;
    }));
  };

  // Invio Segnalazione
  const handleSendReport = (e) => {
    e.preventDefault();
    if (!reportText.trim()) return;
    setReports([
      {
        id: Date.now(),
        text: reportText,
        author: isAnonymous ? "Anonimo" : currentUser.name,
        date: "Oggi",
        status: "In gestione"
      },
      ...reports
    ]);
    setReportText('');
    alert('Segnalazione inviata con successo al VP!');
  };

  // Vista Login/Registrazione
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-center px-6 py-12">
        <div className="sm:mx-auto sm:w-full sm:max-w-md bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 mb-4 border border-emerald-500/20">
              <Sparkles className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Only<span className="text-emerald-400">VP</span></h1>
            <p className="text-slate-400 text-sm mt-1">Liceo Scientifico F. Vercelli - Asti</p>
          </div>

          {authError && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {!otpStep ? (
            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Email Scolastica</label>
                <input
                  type="email"
                  required
                  placeholder="nome.cognome@scientifico.asti.it"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Classe di Appartenenza</label>
                <select
                  value={userClass}
                  onChange={(e) => setUserClass(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-white"
                >
                  {VERCELLI_CLASSES.map(cls => (
                    <option key={cls} value={cls}>Classe {cls}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2"
              >
                Invia Codice OTP <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Codice di Verifica OTP</label>
                <p className="text-xs text-slate-400 mb-2">Inserito codice OTP demo: <span className="text-emerald-400 font-mono font-bold">1234</span></p>
                <input
                  type="text"
                  required
                  maxLength={4}
                  placeholder="1234"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-center text-xl font-mono tracking-widest focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl transition"
              >
                Accedi a OnlyVP
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col pb-20">
      {/* Header top bar */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-extrabold border border-emerald-500/30">
            VP
          </div>
          <div>
            <h1 className="font-bold text-base leading-tight">OnlyVP</h1>
            <p className="text-[10px] text-slate-400">Liceo Vercelli • {currentUser.userClass}</p>
          </div>
        </div>

        {vpAdmin && (
          <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
            <Lock className="w-3 h-3" /> Admin VP
          </span>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-lg w-full mx-auto p-4 space-y-6">
        
        {/* Tab 1: News / Comunicazioni */}
        {activeTab === 'news' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Bacheca Notizie</h2>
              {vpAdmin && (
                <button className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Nuovo Post
                </button>
              )}
            </div>

            {news.map(item => (
              <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                    Destinato a: {item.target}
                  </span>
                  <span className="text-xs text-slate-500">{item.date}</span>
                </div>
                <h3 className="font-bold text-lg">{item.title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{item.content}</p>
                <div className="text-xs text-slate-500 pt-2 border-t border-slate-800/60 flex justify-between items-center">
                  <span>Pubblicato da: {item.author}</span>
                  {vpAdmin && (
                    <button 
                      onClick={() => setNews(news.filter(n => n.id !== item.id))}
                      className="text-red-400 hover:text-red-300 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Sondaggi */}
        {activeTab === 'polls' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Sondaggi Studenteschi</h2>
            {polls.map(poll => (
              <div key={poll.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1"><Users className="w-3 h-3"/> Target: {poll.target}</span>
                  <span className="flex items-center gap-1 text-amber-400"><Clock className="w-3 h-3"/> Scade: {poll.expiryDate}</span>
                </div>
                <h3 className="font-semibold text-base">{poll.question}</h3>
                <div className="space-y-2 pt-1">
                  {poll.options.map(option => (
                    <button
                      key={option.id}
                      onClick={() => handleVote(poll.id, option.id)}
                      className={`w-full text-left p-3 rounded-lg border text-sm transition flex justify-between items-center ${
                        poll.userVoted === option.id 
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' 
                          : 'bg-slate-800/60 border-slate-700/60 hover:border-slate-600'
                      }`}
                    >
                      <span>{option.text}</span>
                      <span className="text-xs font-mono font-bold text-slate-400">{option.votes} voti</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Segnalazioni / Helpdesk */}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Segnalazioni Dirette al VP</h2>
            <form onSubmit={handleSendReport} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
              <label className="block text-xs text-slate-400">Descrivi il problema o la richiesta d'aiuto:</label>
              <textarea
                rows={3}
                required
                placeholder="Inserisci i dettagli qui..."
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm focus:outline-none focus:border-emerald-500 text-white"
              />
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-0"
                  />
                  Invia in modo Anonimo
                </label>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Invia
                </button>
              </div>
            </form>

            {reports.length > 0 && (
              <div className="space-y-2 pt-2">
                <h3 className="text-xs font-bold uppercase text-slate-400">Le tue segnalazioni recenti</h3>
                {reports.map(r => (
                  <div key={r.id} className="bg-slate-900/50 border border-slate-800 rounded-lg p-3 text-sm flex justify-between items-center">
                    <div>
                      <p className="text-slate-200">{r.text}</p>
                      <span className="text-[10px] text-slate-500">{r.date} • {r.author}</span>
                    </div>
                    <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded">
                      {r.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Profilo & Vademecum */}
        {activeTab === 'profile' && (
          <div className="space-y-5">
            {/* User Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold border border-slate-700">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base capitalize">{currentUser.name}</h3>
                <p className="text-xs text-slate-400">{currentUser.email}</p>
                <span className="inline-block mt-1 text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                  Classe {currentUser.userClass}
                </span>
              </div>
            </div>

            {/* Vademecum Trigger Card */}
            <div 
              onClick={() => setShowVademecumModal(true)}
              className="bg-gradient-to-r from-emerald-900/30 to-slate-900 border border-emerald-500/30 rounded-xl p-4 cursor-pointer hover:border-emerald-500/50 transition flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Vademecum & Diritti Studenti</h4>
                  <p className="text-xs text-slate-400">Consulta il regolamento e i tuoi diritti scolastici</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500" />
            </div>

            {/* Admin Unlock Box */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" /> Sblocco Funzioni Rappresentante (VP)
              </h4>
              {!vpAdmin ? (
                <form onSubmit={handleAdminUnlock} className="space-y-2">
                  <p className="text-xs text-slate-400">Inserisci il Master PIN per gestire i contenuti dell'app:</p>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      placeholder="PIN Master (VP2026)"
                      value={pinInput}
                      onChange={(e) => setPinInput(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="submit"
                      className="bg-amber-600 hover:bg-amber-500 text-white text-xs px-4 py-2 rounded-lg font-semibold"
                    >
                      Sblocca
                    </button>
                  </div>
                  {pinError && <p className="text-xs text-red-400">{pinError}</p>}
                </form>
              ) : (
                <p className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Sbloccato come Rappresentante VP. Ora puoi creare e modificare post e Vademecum.
                </p>
              )}
            </div>

            <button
              onClick={() => setCurrentUser(null)}
              className="w-full bg-slate-900 hover:bg-red-500/10 border border-slate-800 hover:border-red-500/30 text-red-400 text-xs py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
            >
              <LogOut className="w-4 h-4" /> Disconnetti Account
            </button>
          </div>
        )}
      </main>

      {/* Modal Vademecum */}
      {showVademecumModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg h-[85vh] sm:h-auto max-h-[90vh] rounded-t-2xl sm:rounded-2xl flex flex-col overflow-hidden">
            
            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base">Vademecum Studenti</h3>
              </div>
              <button 
                onClick={() => setShowVademecumModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto space-y-4">
              {vpAdmin && (
                <button
                  onClick={handleOpenAddVade}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold py-2.5 rounded-lg flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Aggiungi Articolo / Diritto
                </button>
              )}

              {vademecum.map(item => (
                <div key={item.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                    {vpAdmin && (
                      <div className="flex gap-2">
                        <button onClick={() => handleOpenEditVade(item)} className="text-slate-400 hover:text-white">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDeleteVade(item.id)} className="text-red-400 hover:text-red-300">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-white">{item.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>
                  <p className="text-[10px] text-slate-500 italic">Fonte: {item.source}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal Form Aggiungi/Modifica Vademecum */}
      {showVadeForm && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md p-5 rounded-xl space-y-4">
            <h3 className="font-bold text-base">{editingVadeId ? 'Modifica Voce Vademecum' : 'Nuova Voce Vademecum'}</h3>
            <form onSubmit={handleSaveVade} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Titolo</label>
                <input
                  type="text"
                  required
                  value={vadeForm.title}
                  onChange={(e) => setVadeForm({ ...vadeForm, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Categoria</label>
                <select
                  value={vadeForm.category}
                  onChange={(e) => setVadeForm({ ...vadeForm, category: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                >
                  <option value="Diritti">Diritti Studenteschi</option>
                  <option value="Regolamento">Regolamento d'Istituto</option>
                  <option value="Organi Collegiali">Organi Collegiali</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Descrizione / Spiegazione</label>
                <textarea
                  rows={3}
                  required
                  value={vadeForm.description}
                  onChange={(e) => setVadeForm({ ...vadeForm, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Riferimento / Fonte di Legge</label>
                <input
                  type="text"
                  placeholder="Es. Art. 3 Regolamento"
                  value={vadeForm.source}
                  onChange={(e) => setVadeForm({ ...vadeForm, source: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowVadeForm(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-4 py-2 rounded-lg font-semibold"
                >
                  Salva
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 max-w-lg mx-auto">
        <div className="grid grid-cols-4 h-16">
          <button
            onClick={() => setActiveTab('news')}
            className={`flex flex-col items-center justify-center gap-1 ${
              activeTab === 'news' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Newspaper className="w-5 h-5" />
            <span className="text-[10px] font-medium">News</span>
          </button>

          <button
            onClick={() => setActiveTab('polls')}
            className={`flex flex-col items-center justify-center gap-1 ${
              activeTab === 'polls' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Vote className="w-5 h-5" />
            <span className="text-[10px] font-medium">Sondaggi</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`flex flex-col items-center justify-center gap-1 ${
              activeTab === 'reports' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertCircle className="w-5 h-5" />
            <span className="text-[10px] font-medium">Segnalazioni</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center justify-center gap-1 ${
              activeTab === 'profile' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] font-medium">Profilo</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
