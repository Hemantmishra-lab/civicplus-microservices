function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [inlineError, setInlineError] = useState('');
  const [toast, setToast] = useState(null);       // { message, type } | null
  const inputRef = useRef(null);

  const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  const isLoading = status === 'loading';

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (status === 'error') {
      setStatus('idle');
      setInlineError('');
    }
  };

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (isLoading) return;

    setInlineError('');

    if (!isValidEmail(email)) {
      setStatus('error');
      setInlineError('Please enter a valid email address.');
      inputRef.current?.focus();
      return;
    }

    setStatus('loading');
    try {
      await subscribeToNewsletter(email.trim());
      setStatus('success');
      setEmail('');
      setToast({
        type: 'success',
        message:
          'Thank you for subscribing! You will now receive the latest city updates directly in your inbox.',
      });
    } catch (err) {
      setStatus('error');
      setInlineError('Something went wrong. Please try again shortly.');
      setToast({
        type: 'error',
        message: 'We could not process your subscription. Please try again.',
      });
    }
  };

  const showInlineError = status === 'error' && !!inlineError;

  return (
    <>
      <div className="pt-2 space-y-3">
        {/* Heading */}
        <div>
          <h5 className="text-base font-bold text-white tracking-tight mb-1">
            Stay Updated on City &amp; Civic News
          </h5>
          <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
            Subscribe to get real-time updates on community projects, resolved issues, and local news.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="flex gap-2 max-w-sm">
            {/* Email input */}
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                ref={inputRef}
                id="newsletter-email-input"
                type="email"
                value={email}
                onChange={handleChange}
                placeholder="Enter your email address"
                disabled={isLoading}
                aria-label="Email address for newsletter subscription"
                aria-describedby={showInlineError ? 'newsletter-inline-error' : undefined}
                className={`w-full pl-9 pr-4 py-2.5 text-sm text-white rounded-xl
                  bg-white/10 border backdrop-blur-sm transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-orange-500/60
                  placeholder-slate-400
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${showInlineError
                    ? 'border-red-500/60 ring-1 ring-red-500/30'
                    : 'border-white/10 hover:border-white/25'
                  }`}
              />
            </div>

            {/* Submit button - Removed onClick={handleSubmit} */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.05 }}
              whileTap={{ scale: isLoading ? 1 : 0.95 }}
              className={`relative flex items-center justify-center w-10 h-10 rounded-xl
                shadow-lg shadow-orange-500/20 flex-shrink-0 overflow-hidden
                transition-colors duration-200 cursor-pointer
                ${isLoading
                  ? 'bg-orange-500/70 cursor-not-allowed'
                  : 'bg-orange-500 hover:bg-orange-600 active:bg-orange-700'
                }`}
              aria-label={isLoading ? 'Subscribing…' : 'Subscribe to newsletter'}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isLoading ? (
                  <motion.span
                    key="spinner"
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.18 }}
                  >
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="arrow"
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 6 }}
                    transition={{ duration: 0.18 }}
                  >
                    <ArrowRight className="w-5 h-5 text-white" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Inline error message */}
          <AnimatePresence>
            {showInlineError && (
              <motion.p
                id="newsletter-inline-error"
                role="alert"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-1.5 mt-2 text-xs text-red-400 font-medium"
              >
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                {inlineError}
              </motion.p>
            )}
          </AnimatePresence>
        </form>
      </div>

      {/* Toast notification */}
      <AnimatePresence>
        {toast && (
          <Toast
            key="newsletter-toast"
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}