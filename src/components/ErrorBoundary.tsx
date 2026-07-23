import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Link } from 'wouter';

interface Props  { children: ReactNode; }
interface State  { hasError: boolean; errorMessage?: string; }

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error?.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // In production you would log to Sentry/Datadog here
    console.error('[Carve] Runtime error caught by boundary:', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        style={{
          minHeight: '100dvh',
          background: '#FAFAF8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          textAlign: 'center',
          padding: '48px 24px',
        }}
      >
        {/* Gold rule */}
        <div style={{ width: 40, height: 1, background: '#C9A96E', marginBottom: 40 }} />

        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(28px, 5vw, 40px)',
            fontStyle: 'italic',
            fontWeight: 300,
            color: '#1A1A1A',
            marginBottom: 16,
          }}
        >
          Something went quietly wrong.
        </h1>

        <p
          style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: 13,
            color: '#6B6560',
            letterSpacing: '0.04em',
            lineHeight: 1.7,
            maxWidth: 340,
            marginBottom: 40,
          }}
        >
          An unexpected error has occurred. Our team has been informed. Please refresh the page or return home.
        </p>

        {/* Gold rule */}
        <div style={{ width: 40, height: 1, background: '#C9A96E', marginBottom: 40 }} />

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={() => { this.setState({ hasError: false }); window.location.reload(); }}
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: 10,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              background: '#1A1A1A',
              color: '#FAFAF8',
              border: 'none',
              padding: '16px 32px',
              cursor: 'pointer',
            }}
          >
            Refresh Page
          </button>
          <a
            href="/"
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: 10,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: '#1A1A1A',
              border: '1px solid #E8E4DE',
              padding: '16px 32px',
              textDecoration: 'none',
            }}
          >
            Return Home
          </a>
        </div>

        {process.env.NODE_ENV === 'development' && this.state.errorMessage && (
          <pre
            style={{
              marginTop: 40,
              padding: 16,
              background: '#F5F3EF',
              border: '1px solid #E8E4DE',
              fontSize: 11,
              color: '#6B6560',
              textAlign: 'left',
              maxWidth: 600,
              overflow: 'auto',
              borderRadius: 2,
            }}
          >
            {this.state.errorMessage}
          </pre>
        )}
      </div>
    );
  }
}
