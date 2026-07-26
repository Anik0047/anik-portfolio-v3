'use client';
import { Check, Copy, Mail } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { SOCIAL_LINKS } from '@/components/layout/contents';
import SectionContainer from '@/components/layout/section-container';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CornerBracket } from '@/components/ui/corner-brackets';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { trackEvent } from '@/lib/analytics';
import { cn } from '@/lib/utils';

interface FormState {
  success?: boolean;
  error?: string;
  message?: string;
  fieldErrors?: Record<string, string>;
  values?: Record<string, string>;
}

const RECAPTCHA_ACTION = 'contact_form_submit';

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (
        siteKey: string,
        options: { action: string },
      ) => Promise<string>;
    };
  }
}

function loadRecaptchaScript(siteKey: string) {
  return new Promise<void>((resolve, reject) => {
    if (window.grecaptcha) {
      resolve();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src^="https://www.google.com/recaptcha/api.js?render=${siteKey}"]`,
    );

    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject();
    document.head.appendChild(script);
  });
}

function hideRecaptchaBadge() {
  const badge = document.querySelector<HTMLElement>('.grecaptcha-badge');
  if (!badge) return;

  badge.style.visibility = 'hidden';
  badge.style.opacity = '0';
  badge.style.pointerEvents = 'none';
  badge.setAttribute('aria-hidden', 'true');
}

// ─── Field wrapper ────────────────────────────────────────────────────────────
function Field({
  id,
  label,
  error,
  children,
  className,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('group flex flex-col gap-2', className)}>
      <Label
        htmlFor={id}
        className='text-xs font-bold transition-colors group-focus-within:text-foreground'
      >
        {label}
      </Label>
      {children}
      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className='text-xs text-destructive'
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Contact() {
  const [state, setState] = useState<FormState>({});
  const [isPending, setIsPending] = useState(false);
  const [isEmailCopied, setIsEmailCopied] = useState(false);
  const [captchaToken, setCaptchaToken] = useState('');
  const [isCaptchaVerifying, setIsCaptchaVerifying] = useState(false);
  const [clientError, setClientError] = useState('');
  const contactEmail = 'anik.barua.dev@gmail.com';
  const shouldReduceMotion = useReducedMotion();
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const emailjsServiceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const emailjsTemplateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
  const emailjsPublicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
  const shouldUseRecaptcha = Boolean(recaptchaSiteKey);
  const formRef = useRef<HTMLFormElement | null>(null);
  const shouldBypassCaptchaSubmitRef = useRef(false);

  useEffect(() => {
    if (!isEmailCopied) return;
    const timeoutId = window.setTimeout(() => {
      setIsEmailCopied(false);
    }, 1800);
    return () => window.clearTimeout(timeoutId);
  }, [isEmailCopied]);

  useEffect(() => {
    if (!shouldUseRecaptcha || !recaptchaSiteKey) return;

    loadRecaptchaScript(recaptchaSiteKey).catch(() => {
      setClientError(
        'Failed to load spam protection. Please refresh and try again.',
      );
    });

    hideRecaptchaBadge();
    const observer = new MutationObserver(() => hideRecaptchaBadge());
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, [shouldUseRecaptcha, recaptchaSiteKey]);

  useEffect(() => {
    if (state.success) {
      setClientError('');
      setCaptchaToken('');
      trackEvent('contact_form_submit_success', {
        location: 'landing_contact_section',
      });
    }
  }, [state.success]);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contactEmail);
      setIsEmailCopied(true);
    } catch {
      setIsEmailCopied(false);
    }
  };

  const getRecaptchaToken = async () => {
    if (!recaptchaSiteKey) return '';
    await loadRecaptchaScript(recaptchaSiteKey);

    if (!window.grecaptcha) {
      throw new Error('reCAPTCHA unavailable');
    }

    return new Promise<string>((resolve, reject) => {
      window.grecaptcha?.ready(() => {
        window.grecaptcha
          ?.execute(recaptchaSiteKey, { action: RECAPTCHA_ACTION })
          .then(resolve)
          .catch(reject);
      });
    });
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    if (shouldUseRecaptcha) {
      if (shouldBypassCaptchaSubmitRef.current) {
        shouldBypassCaptchaSubmitRef.current = false;
      } else {
        event.preventDefault();
        setClientError('');
        setIsCaptchaVerifying(true);

        try {
          const token = await getRecaptchaToken();
          if (!token) {
            setClientError('Spam check failed. Please try again.');
            return;
          }

          setCaptchaToken(token);
        } catch {
          setClientError('Spam check failed. Please try again.');
          return;
        } finally {
          setIsCaptchaVerifying(false);
        }
      }
    } else {
      event.preventDefault();
    }

    setIsPending(true);
    setClientError('');
    setState({});

    if (!emailjsServiceId || !emailjsTemplateId || !emailjsPublicKey) {
      setIsPending(false);
      setState({
        error:
          'Email service is not configured. Add the EmailJS env vars to your local .env file and restart the dev server.',
      });
      return;
    }

    if (!formRef.current) {
      setIsPending(false);
      setState({
        error: 'The contact form is not ready yet. Please try again.',
      });
      return;
    }

    try {
      await emailjs.sendForm(
        emailjsServiceId,
        emailjsTemplateId,
        formRef.current,
        {
          publicKey: emailjsPublicKey,
        },
      );

      setState({ success: true, message: 'Message sent successfully!' });
      formRef.current?.reset();
    } catch (err) {
      console.error('EmailJS error:', err);
      setState({ error: 'Failed to send message. Please try again.' });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <SectionContainer
      id='contact'
      innerClassName='relative grid grid-cols-1 md:grid-cols-2 gap-6'
    >
      <div className='flex flex-col md:flex-row' data-animate-stagger>
        <Card className='rounded-none flex flex-col justify-between size-full'>
          <CornerBracket
            position='top-right'
            className='opacity-100 text-primary'
            offset={10}
          />
          <CornerBracket
            position='bottom-left'
            className='opacity-100 text-primary'
            offset={10}
          />

          <div className='flex flex-col justify-between h-full gap-20'>
            <p className='text-sm typo-mono typo-code'>
              <span className='text-primary'>$</span>
              <span className='text-muted-foreground'> contact --open </span>
            </p>

            <div>
              <h2
                className='text-4xl xxs:text-5xl typo-display'
                data-animate-heading
              >
                Let&apos;s ship
                <span className='block typo-display-outline text-primary'>
                  your idea
                </span>
              </h2>

              <h2 className='typo-mono typo-label text-base dark:text-primary text-muted-foreground mt-2'>
                You imagine it. I build it.
              </h2>
            </div>

            {/* <p className="text-base typo-body typo-subtle">
                            Email me directly for a quick chat, or submit the form with your
                            goals and timeline. I&apos;ll reply with clear next steps.
                        </p> */}

            <div className='space-y-4'>
              <div className='border border-dashed p-4'>
                <p className='text-[11px] typo-mono uppercase tracking-[0.14em] text-muted-foreground'>
                  primary email
                </p>
                <div className='mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                  <a
                    href={`mailto:${contactEmail}`}
                    className='inline-flex items-center gap-2 text-sm sm:text-base text-foreground break-all select-all truncate'
                  >
                    <Mail className='size-4 text-primary shrink-0' />
                    {contactEmail}
                  </a>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={handleCopyEmail}
                    className='w-full sm:w-auto'
                  >
                    {isEmailCopied ? (
                      <Check className='size-4' />
                    ) : (
                      <Copy className='size-4' />
                    )}
                    {isEmailCopied ? 'Copied' : 'Copy email'}
                  </Button>
                </div>
              </div>

              <div className='space-y-3 pt-1'>
                <div className='flex items-center justify-between gap-4 border-b border-dashed pb-3' />

                <div className='flex items-center justify-between gap-4 border-b border-dashed pb-3 last:border-b-0 last:pb-0'>
                  <p className='text-xs typo-mono uppercase tracking-[0.14em] text-muted-foreground'>
                    social
                  </p>
                  <div className='flex items-center gap-2'>
                    {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                      <Link
                        key={label}
                        href={href}
                        target='_blank'
                        rel='noopener noreferrer'
                        title={label}
                        className='inline-flex size-8 items-center justify-center border border-dashed text-foreground/80 hover:text-foreground hover:border-primary/60 transition-colors'
                      >
                        <Icon className='size-3.5' />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <span
              className='pointer-events-none text-2xl typo-display-outline top-5 right-8 absolute typo-ghost text-muted-foreground/70'
              data-animate-float
            >
              AB_REQ
            </span>
          </div>
        </Card>
      </div>

      <Card
        className='rounded-none bg-card/90 backdrop-blur-sm'
        data-animate-stagger
      >
        <motion.form
          ref={formRef}
          onSubmit={handleFormSubmit}
          className='space-y-7'
          noValidate
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 0.45, ease: [0.16, 1, 0.3, 1] }
          }
        >
          <input type='hidden' name='captchaToken' value={captchaToken} />
          <div className='flex items-center justify-between border-b border-dashed pb-4'>
            <div>
              <p className='text-xs typo-mono typo-label uppercase tracking-[0.16em] text-muted-foreground'>
                message composer
              </p>
              <p className='mt-2 text-2xl typo-display-cond lowercase'>
                start a project
              </p>
            </div>
          </div>

          <div className='grid grid-cols-1 gap-6' data-animate-stagger>
            <Field id='name' label='Full name' error={state.fieldErrors?.name}>
              <Input
                id='name'
                name='name'
                type='text'
                placeholder='John Doe'
                required
                disabled={isPending}
                autoComplete='name'
                defaultValue={state.values?.name ?? ''}
                className='h-12 rounded-none border focus-visible:border-primary'
              />
            </Field>

            <Field
              id='email'
              label='Email address'
              error={state.fieldErrors?.email}
            >
              <Input
                id='email'
                name='email'
                type='email'
                placeholder='you@example.com'
                required
                disabled={isPending}
                autoComplete='email'
                defaultValue={state.values?.email ?? ''}
                className='h-12 rounded-none border focus-visible:border-primary'
              />
            </Field>
          </div>

          <Field
            id='subject'
            label='Subject'
            error={state.fieldErrors?.subject}
          >
            <Input
              id='subject'
              name='subject'
              type='text'
              placeholder='What would you like to discuss?'
              required
              disabled={isPending}
              defaultValue={state.values?.subject ?? ''}
              className='h-12 rounded-none border focus-visible:border-primary'
            />
          </Field>

          <Field
            id='message'
            label='Message'
            error={state.fieldErrors?.message}
          >
            <Textarea
              id='message'
              name='message'
              placeholder='Tell me about your project, timeline, budget, or just say hi.'
              required
              disabled={isPending}
              defaultValue={state.values?.message ?? ''}
              rows={4}
              className='min-h-32 rounded-none border resize-none focus-visible:border-primary'
            />
          </Field>

          <div className='flex flex-col-reverse items-start gap-4 sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-dashed'>
            <div className='text-sm min-h-5 pt-4' aria-live='polite'>
              <AnimatePresence mode='wait' initial={false}>
                {clientError && (
                  <motion.p
                    key='client-error'
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
                    className='text-destructive'
                  >
                    {clientError}
                  </motion.p>
                )}
                {state.success && state.message && (
                  <motion.p
                    key='success'
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
                    className='text-green-500 flex items-center gap-1.5'
                  >
                    <span>✓</span>
                    <span>{state.message}</span>
                  </motion.p>
                )}
                {state.error && (
                  <motion.p
                    key='error'
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
                    className='text-destructive'
                  >
                    {state.error}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <Button
              type='submit'
              disabled={isPending || isCaptchaVerifying}
              className='group min-w-24 relative overflow-hidden border bg-primary text-primary-foreground typo-label'
            >
              <span
                className={cn(
                  'transition-opacity duration-200',
                  (isPending || isCaptchaVerifying) && 'opacity-0',
                )}
              >
                Send
              </span>

              {(isPending || isCaptchaVerifying) && (
                <span className='absolute inset-0 flex items-center justify-center gap-1.5'>
                  <span className='h-1 w-1 animate-bounce rounded-full bg-current [animation-delay:0ms]' />
                  <span className='h-1 w-1 animate-bounce rounded-full bg-current [animation-delay:150ms]' />
                  <span className='h-1 w-1 animate-bounce rounded-full bg-current [animation-delay:300ms]' />
                </span>
              )}
            </Button>
          </div>

          {shouldUseRecaptcha && (
            <p className='text-[11px] typo-mono leading-relaxed text-muted-foreground'>
              This site is protected by reCAPTCHA and the Google{' '}
              <a
                href='https://policies.google.com/privacy'
                target='_blank'
                rel='noopener noreferrer'
                className='underline underline-offset-2 hover:text-foreground'
              >
                Privacy Policy
              </a>{' '}
              and{' '}
              <a
                href='https://policies.google.com/terms'
                target='_blank'
                rel='noopener noreferrer'
                className='underline underline-offset-2 hover:text-foreground'
              >
                Terms of Service
              </a>{' '}
              apply.
            </p>
          )}
        </motion.form>
      </Card>
    </SectionContainer>
  );
}
