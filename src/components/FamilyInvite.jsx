import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { generateInviteCode, updateProfile } from '../lib/supabase';

export default function FamilyInvite({ onDone }) {
  const { profile, refreshProfile } = useAuth();
  const [inviteCode, setInviteCode] = useState(profile?.invite_code || '');
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);

  const inviteLink = inviteCode ? `${window.location.origin}?invite=${inviteCode}` : '';

  const handleGenerateCode = async () => {
    setGenerating(true);
    try {
      const updated = await generateInviteCode(profile.id);
      setInviteCode(updated.invite_code);
      await refreshProfile();
    } catch (err) {
      console.error('Error generating code:', err);
    }
    setGenerating(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = inviteLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Guía Mayor - Invitación',
          text: 'Hola! Te invito a usar Guía Mayor para aprender trámites en línea. Haz click en el link:',
          url: inviteLink,
        });
      } catch {}
    } else {
      handleCopyLink();
    }
  };

  const handleSetAsElderly = async () => {
    try {
      await updateProfile(profile.id, { role: 'elderly' });
      await refreshProfile();
      onDone?.();
    } catch (err) {
      console.error('Error setting role:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gris-50 flex flex-col items-center justify-center px-6 py-12 screen-enter">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-3">
          <div className="text-5xl">👨‍👩‍👦</div>
          <h1 className="text-3xl font-bold text-gris-900">
            {profile?.role === 'elderly' ? 'Mi perfil' : 'Invitar familiar'}
          </h1>
          <p className="text-lg text-gris-500">
            {profile?.role === 'elderly'
              ? 'Configura tu perfil para comenzar'
              : 'Comparte este link con tu familiar para vincularlo'
            }
          </p>
        </div>

        {profile?.role === 'elderly' && !profile?.linked_to ? (
          <div className="space-y-4">
            <div className="card bg-azul-50 border-azul-200 text-center space-y-3">
              <p className="text-lg text-azul-700">
                Tu familiar te invitó a usar Guía Mayor
              </p>
              <button
                onClick={handleSetAsElderly}
                className="btn-primary w-full"
              >
                Comenzar a aprender
              </button>
            </div>
          </div>
        ) : profile?.role === 'elderly' ? (
          <div className="card text-center space-y-3">
            <div className="text-4xl">✅</div>
            <p className="text-lg text-gris-700 font-semibold">
              Ya estás vinculado a tu familiar
            </p>
            <button onClick={onDone} className="btn-primary w-full">
              Continuar
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {!inviteCode ? (
              <button
                onClick={handleGenerateCode}
                disabled={generating}
                className="btn-primary w-full"
              >
                {generating ? 'Generando...' : 'Generar código de invitación'}
              </button>
            ) : (
              <>
                <div className="card space-y-4">
                  <div className="text-center">
                    <p className="text-sm text-gris-400 mb-2">Tu código de invitación</p>
                    <p className="text-2xl font-bold text-azul-600 font-mono tracking-wider">
                      {inviteCode}
                    </p>
                  </div>

                  <div className="bg-gris-50 rounded-xl p-3">
                    <p className="text-xs text-gris-400 truncate">{inviteLink}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleCopyLink}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    {copied ? (
                      <>✅ Link copiado</>
                    ) : (
                      <>📋 Copiar link de invitación</>
                    )}
                  </button>

                  <button
                    onClick={handleShare}
                    className="btn-secondary w-full flex items-center justify-center gap-2"
                  >
                    📤 Compartir por WhatsApp
                  </button>
                </div>

                <div className="card bg-naranja-50 border-naranja-200">
                  <h4 className="font-bold text-naranja-600 mb-2">¿Cómo funciona?</h4>
                  <ol className="space-y-1 text-sm text-gris-600 list-decimal list-inside">
                    <li>Copia el link y envíalo a tu familiar</li>
                    <li>Tu familiar hace click en el link</li>
                    <li>Entra con su cuenta de Google</li>
                    <li>Queda vinculado automáticamente</li>
                    <li>Tú puedes ver su progreso aquí</li>
                  </ol>
                </div>

                <button onClick={onDone} className="btn-secondary w-full">
                  Volver al dashboard
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
