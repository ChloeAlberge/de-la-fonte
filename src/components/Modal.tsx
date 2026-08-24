import { useEffect, useState, type ReactNode } from 'react';

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
  variant?: 'terminal' | 'hud';
}

export function Modal({ onClose, children, variant = 'terminal' }: ModalProps) {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') requestClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  function requestClose() {
    setIsClosing(true);
    setTimeout(onClose, 800);
  }

  const variantClass = variant === 'hud' ? 'hud-modal' : 'terminal-modal';

  return (
    <div className="modal-overlay" onClick={requestClose}>
      <div
        className={`modal-content ${variantClass} ${isClosing ? 'modal-closing' : 'modal-opening'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={requestClose} aria-label="Fermer">
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}