import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';

export function useDialog(ref, active, close) {
  const closeRef = useRef(close);
  const pending = useRef(null);
  useEffect(() => { closeRef.current = close; }, [close]);
  const requestClose = useCallback(() => {
    if (pending.current !== null) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { closeRef.current(); return; }
    ref.current.classList.add('closing');
    pending.current = setTimeout(() => { pending.current = null; closeRef.current(); }, 150);
  }, [ref]);
  useLayoutEffect(() => {
    if (!active) return;
    const dialog = ref.current;
    const origin = document.activeElement;
    const cancel = (event) => { event.preventDefault(); requestClose(); };
    dialog.addEventListener('cancel', cancel);
    document.documentElement.classList.add('dialog-open');
    dialog.showModal();
    return () => {
      dialog.removeEventListener('cancel', cancel);
      clearTimeout(pending.current);
      pending.current = null;
      dialog.classList.remove('closing');
      dialog.close();
      document.documentElement.classList.remove('dialog-open');
      requestAnimationFrame(() => { if (origin?.isConnected && origin.getClientRects().length) origin.focus({ preventScroll: true }); });
    };
  }, [ref, active, requestClose]);
  return requestClose;
}
