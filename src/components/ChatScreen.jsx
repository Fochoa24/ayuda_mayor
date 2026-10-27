import { useState, useCallback, useRef, useEffect } from 'react';
import { PROCEDURE_TYPES, INSTITUTIONS, getTips } from '../data/institutions';
import Header from './Header';

let msgId = 0;
function msg(role, content, type = 'text', data = null) {
  return { id: ++msgId, role, content, type, data };
}

function BotBubble({ m }) {
  if (m.type === 'link') {
    return (
      <div className="flex gap-2 mb-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="w-8 h-8 bg-azul-600 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0 mt-1">🤝</div>
        <div className="bg-white rounded-2xl rounded-tl-sm p-4 max-w-[85%] shadow-sm border border-gris-100 space-y-3">
          <p className="text-base text-gris-800 leading-relaxed">{m.content}</p>
          <a
            href={m.data.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-azul-600 hover:bg-azul-700 active:bg-azul-800
                       text-white font-bold text-center py-3.5 px-4 rounded-xl
                       transition-all duration-150 active:scale-[0.98] cursor-pointer"
          >
            {m.data.icon} Abrir {m.data.name}
          </a>
          <p className="text-xs text-gris-400 text-center">{m.data.url.replace('https://', '')}</p>
        </div>
      </div>
    );
  }

  if (m.type === 'tip') {
    return (
      <div className="flex gap-2 mb-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="w-8 flex-shrink-0" />
        <div className="bg-naranja-50 border border-naranja-200 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%]">
          <p className="text-sm font-bold text-naranja-600 mb-1">💡 Consejo</p>
          <p className="text-base text-gris-700 leading-relaxed">{m.content}</p>
        </div>
      </div>
    );
  }

  if (m.type === 'tips_list') {
    return (
      <div className="flex gap-2 mb-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="w-8 h-8 bg-azul-600 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0 mt-1">🤝</div>
        <div className="bg-white rounded-2xl rounded-tl-sm p-4 max-w-[85%] shadow-sm border border-gris-100 space-y-2">
          <p className="text-sm font-bold text-gris-600">Al entrar, busca esto:</p>
          {m.data.map((t, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-lg mt-0.5">{t.icon}</span>
              <span className="text-base text-gris-700">{t.text}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (m.type === 'success') {
    return (
      <div className="flex gap-2 mb-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="w-8 flex-shrink-0" />
        <div className="bg-verde-50 border border-verde-200 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%] text-center">
          <div className="text-3xl mb-1">🎉</div>
          <p className="text-base font-bold text-verde-700">{m.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2 mb-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="w-8 h-8 bg-azul-600 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0 mt-1">🤝</div>
      <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%] shadow-sm border border-gris-100">
        <p className="text-base text-gris-800 leading-relaxed whitespace-pre-wrap">{m.content}</p>
      </div>
    </div>
  );
}

function UserBubble({ m }) {
  return (
    <div className="flex justify-end mb-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-azul-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%] shadow-sm">
        <p className="text-base leading-relaxed">{m.content}</p>
      </div>
    </div>
  );
}

function Typing() {
  return (
    <div className="flex gap-2 mb-3">
      <div className="w-8 h-8 bg-azul-600 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0 mt-1">🤝</div>
      <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gris-100">
        <div className="flex gap-1">
          {[0, 150, 300].map(d => (
            <div key={d} className="w-2 h-2 bg-gris-300 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Buttons({ items, onAction }) {
  if (!items?.length) return null;
  return (
    <div className="flex flex-wrap gap-2 mb-4 pl-10 animate-in fade-in duration-300">
      {items.map((b, i) => (
        <button
          key={i}
          onClick={() => onAction(b)}
          className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 cursor-pointer select-none active:scale-[0.97] ${
            b.style === 'primary'
              ? 'bg-azul-600 text-white hover:bg-azul-700 shadow-sm'
              : 'bg-white text-azul-600 border border-azul-300 hover:bg-azul-50'
          }`}
        >
          {b.icon && <span className="mr-1">{b.icon}</span>}
          {b.label}
        </button>
      ))}
    </div>
  );
}

export default function ChatScreen({ onBack }) {
  const [messages, setMessages] = useState([
    msg('bot', '¡Hola! 👋 Soy tu asistente de Guía Mayor.\n\nTe ayudo a hacer trámites en línea. Es muy fácil: solo presiona los botones.'),
    msg('bot', '¿Qué quieres hacer hoy?'),
  ]);
  const [buttons, setButtons] = useState(
    PROCEDURE_TYPES.map(p => ({ label: `${p.icon} ${p.title}`, action: 'pick_procedure', data: p.id, style: 'primary' }))
  );
  const [selectedProcedure, setSelectedProcedure] = useState(null);
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);

  const scrollDown = useCallback(() => {
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 80);
  }, []);

  const push = useCallback((...newMsgs) => {
    setMessages(prev => [...prev, ...newMsgs]);
    scrollDown();
  }, [scrollDown]);

  const botSay = useCallback((content, delay = 600) => {
    setTyping(true);
    return new Promise(res => {
      setTimeout(() => {
        setTyping(false);
        push(msg('bot', content));
        res();
      }, delay);
    });
  }, [push]);

  const handle = useCallback(async (b) => {
    push(msg('user', b.label));
    setButtons([]);

    if (b.action === 'pick_procedure') {
      const proc = PROCEDURE_TYPES.find(p => p.id === b.data);
      setSelectedProcedure(proc);
      await botSay(`Perfecto. Vamos a hacer: **${proc.title}** ${proc.icon}`, 500);

      const question = proc.institutionKey === 'bank' ? '¿En qué banco tienes tu cuenta?'
        : proc.institutionKey === 'clinic' ? '¿En qué clínica u hospital te atiendes?'
        : '¿En cuál AFP estás afiliado?';

      await botSay(question, 500);

      const instList = INSTITUTIONS[proc.institutionKey];
      setButtons(instList.map(inst => ({
        label: `${inst.icon} ${inst.name}`,
        action: 'pick_institution',
        data: inst.id,
        style: 'default',
      })));
      return;
    }

    if (b.action === 'pick_institution') {
      const instList = INSTITUTIONS[selectedProcedure.institutionKey];
      const inst = instList.find(i => i.id === b.data);

      await botSay(`Aquí tienes el link de **${inst.name}**. Presiona el botón para abrirlo:`, 500);

      push(msg('bot', `Abre ${inst.name} en tu navegador:`, 'link', {
        url: inst.loginUrl || inst.url,
        name: inst.name,
        icon: inst.icon,
      }));

      await new Promise(r => setTimeout(r, 400));

      const tips = getTips(selectedProcedure.id);
      push(msg('bot', '', 'tips_list', tips));

      await new Promise(r => setTimeout(r, 300));

      await botSay(`¿Necesitas algo más?`, 500);
      setButtons([
        { label: 'Hacer otro trámite', icon: '🔄', action: 'restart', style: 'primary' },
        { label: 'Elegir otra institución', icon: '🏦', action: 'change_inst', style: 'default' },
      ]);
      return;
    }

    if (b.action === 'change_inst') {
      await botSay('¿En cuál te atiendes ahora?', 400);
      const instList = INSTITUTIONS[selectedProcedure.institutionKey];
      setButtons(instList.map(inst => ({
        label: `${inst.icon} ${inst.name}`,
        action: 'pick_institution',
        data: inst.id,
        style: 'default',
      })));
      return;
    }

    if (b.action === 'restart') {
      setSelectedProcedure(null);
      await botSay('¿Qué quieres hacer ahora?', 400);
      setButtons(PROCEDURE_TYPES.map(p => ({
        label: `${p.icon} ${p.title}`,
        action: 'pick_procedure',
        data: p.id,
        style: 'primary',
      })));
      return;
    }
  }, [selectedProcedure, push, botSay]);

  return (
    <div className="min-h-screen bg-gris-100 flex flex-col screen-enter">
      <Header title="Asistente Guía Mayor" showBack={true} onBack={onBack} />

      <div className="flex-1 overflow-y-auto px-4 py-4" style={{ maxHeight: 'calc(100vh - 140px)' }}>
        <div className="max-w-lg mx-auto">
          {messages.map(m => (
            m.role === 'bot' ? <BotBubble key={m.id} m={m} /> : <UserBubble key={m.id} m={m} />
          ))}
          {typing && <Typing />}
          <Buttons items={buttons} onAction={handle} />
          <div ref={endRef} />
        </div>
      </div>
    </div>
  );
}
