// Cloudflare Turnstile for the website's call-back form.
//
// While TURNSTILE_SITE_KEY is empty everything here is a no-op: the form renders
// no widget, loads no Cloudflare script and posts exactly what it always has.
// With a key set, an invisible widget ("interaction-only": it only shows itself
// when Cloudflare wants a click) earns a single-use token that each submit sends
// as `captchaToken`. Flowance decides what a missing or bad token means for this
// clinic (its per-clinic captcha switch on the call-back form).
//
// The site key is public by design. The SECRET key never belongs in this repo:
// it goes in Flowance, Secrets & Keys.
import { useCallback, useRef } from 'react';

// Paste the Cloudflare Turnstile SITE key between the quotes.
export const TURNSTILE_SITE_KEY: string = '0x4AAAAAAFPvo12jAH5zsG23';

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
const ACTION = 'callback'; // must match the action Flowance checks for the call-back form
const TOKEN_WAIT_MS = 8000; // how long a submit waits for a token still being issued

export const CAPTCHA_RETRY_MESSAGE = 'Please complete the verification and try again.';

type TurnstileApi = {
    render(el: HTMLElement, options: Record<string, unknown>): string;
    reset(widgetId: string): void;
    remove(widgetId: string): void;
};

declare global {
    interface Window {
        turnstile?: TurnstileApi;
    }
}

type Widget = {
    id: string | null;
    token: string;
    waiting: Array<(token: string) => void>;
    started: boolean;
    removed: boolean;
    observer: IntersectionObserver | null;
};

const widgets = new Map<HTMLElement, Widget>();
let scriptLoad: Promise<TurnstileApi> | null = null;

function loadScript(): Promise<TurnstileApi> {
    if (window.turnstile) return Promise.resolve(window.turnstile);
    if (!scriptLoad) {
        scriptLoad = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = SCRIPT_SRC;
            script.async = true;
            script.defer = true;
            script.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error('Turnstile did not initialise')));
            script.onerror = () => {
                scriptLoad = null; // a blocked or flaky load may be retried by the next submit
                reject(new Error('Turnstile script failed to load'));
            };
            document.head.appendChild(script);
        });
    }
    return scriptLoad;
}

function settle(widget: Widget, token: string) {
    widget.waiting.splice(0).forEach((resolve) => resolve(token));
}

function start(slot: HTMLElement, widget: Widget) {
    if (widget.started || widget.removed) return;
    widget.started = true;
    widget.observer?.disconnect();
    widget.observer = null;
    loadScript()
        .then((turnstile) => {
            if (widget.removed) return;
            widget.id = turnstile.render(slot, {
                sitekey: TURNSTILE_SITE_KEY,
                action: ACTION,
                appearance: 'interaction-only',
                'refresh-expired': 'auto',
                callback: (token: string) => {
                    widget.token = token;
                    settle(widget, token);
                },
                'expired-callback': () => {
                    widget.token = '';
                },
                'error-callback': () => {
                    widget.token = '';
                },
            });
        })
        .catch((err) => {
            console.error('Verification widget unavailable:', err);
            widget.started = false; // the next submit tries again
            settle(widget, '');
        });
}

// The widget is rendered as the form nears the viewport, not on page load, so a
// page whose form is never reached never loads the Cloudflare script.
function attach(slot: HTMLElement) {
    if (!TURNSTILE_SITE_KEY || widgets.has(slot)) return;
    const widget: Widget = { id: null, token: '', waiting: [], started: false, removed: false, observer: null };
    widgets.set(slot, widget);
    if (!('IntersectionObserver' in window)) {
        start(slot, widget);
        return;
    }
    widget.observer = new IntersectionObserver(
        (entries) => {
            if (entries.some((entry) => entry.isIntersecting)) start(slot, widget);
        },
        { rootMargin: '300px' },
    );
    widget.observer.observe(slot);
}

function detach(slot: HTMLElement) {
    const widget = widgets.get(slot);
    if (!widget) return;
    widget.removed = true;
    widgets.delete(slot);
    widget.observer?.disconnect();
    settle(widget, '');
    if (widget.id !== null && window.turnstile) {
        try {
            window.turnstile.remove(widget.id);
        } catch {
            // already gone with its form
        }
    }
}

// The token to send with this submit, or '' when the captcha is off or none
// arrives in time. A form without a token is still sent: whether that is
// acceptable is the clinic's switch in Flowance, not the page's decision.
function getToken(slot: HTMLElement | null): Promise<string> {
    if (!TURNSTILE_SITE_KEY || !slot) return Promise.resolve('');
    const widget = widgets.get(slot);
    if (!widget) return Promise.resolve('');
    if (widget.token) return Promise.resolve(widget.token);
    start(slot, widget);
    return new Promise((resolve) => {
        const timer = setTimeout(() => resolve(''), TOKEN_WAIT_MS);
        widget.waiting.push((token) => {
            clearTimeout(timer);
            resolve(token);
        });
    });
}

// Tokens are single-use: start a fresh one after every submit.
function resetToken(slot: HTMLElement | null) {
    const widget = slot ? widgets.get(slot) : undefined;
    if (!widget || widget.id === null || !window.turnstile) return;
    widget.token = '';
    try {
        window.turnstile.reset(widget.id);
    } catch (err) {
        console.error('Verification widget reset failed:', err);
    }
}

// Did Flowance turn this submit away for its captcha (rather than any other error)?
export async function isCaptchaRejection(response: Response): Promise<boolean> {
    if (response.status !== 422) return false;
    try {
        const body = await response.clone().json();
        return Boolean(body?.fieldErrors?.captcha);
    } catch {
        return false;
    }
}

// In a form:
//   const { slot: captchaSlot, token: getCaptchaToken, reset: resetCaptcha } = useCaptcha();
// render `{TURNSTILE_SITE_KEY ? <div ref={captchaSlot} /> : null}` inside the form, then
// `await getCaptchaToken()` before sending and `resetCaptcha()` after.
export function useCaptcha() {
    const slotRef = useRef<HTMLElement | null>(null);
    const slot = useCallback((el: HTMLElement | null) => {
        // React 18 calls a ref with null when the form goes away; React 19 calls
        // the cleanup returned below instead. Either way the old widget is removed.
        if (slotRef.current && slotRef.current !== el) detach(slotRef.current);
        slotRef.current = el;
        if (!el) return undefined;
        attach(el);
        return () => {
            detach(el);
            if (slotRef.current === el) slotRef.current = null;
        };
    }, []);
    const token = useCallback(() => getToken(slotRef.current), []);
    const reset = useCallback(() => resetToken(slotRef.current), []);
    return { slot, token, reset };
}
