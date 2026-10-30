"use client";

import { Component, ReactNode } from "react";
import { useCopy } from "@/components/CopyProvider";
import type { Copy } from "@/content/copy";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface InnerProps extends Props {
  /** The error text from /admin/copy (site.errorBoundary). */
  text: Copy["site"]["errorBoundary"];
}

interface State {
  hasError: boolean;
  error?: Error;
}

// A class component can't use hooks, so the wrapper below reads the editable
// text and hands it down.
class ErrorBoundaryInner extends Component<InnerProps, State> {
  constructor(props: InnerProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // TODO: Send to error monitoring service (Sentry, etc.)
    // if (typeof window !== 'undefined' && window.Sentry) {
    //   window.Sentry.captureException(error);
    // }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 mx-auto mb-6 text-red-500">
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                className="w-full h-full"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="font-serif text-2xl text-[#1A1A1A] mb-2">
              {this.props.text.title}
            </h2>
            <p className="text-[#1A1A1A]/60 mb-6">
              {this.props.text.message}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={this.handleRetry}
                className="px-6 py-3 bg-[#1A1A1A] text-white font-medium hover:bg-[#1A1A1A]/90 transition-colors"
              >
                {this.props.text.retry}
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 border border-[#1A1A1A]/20 font-medium hover:border-[#1A1A1A]/40 transition-colors"
              >
                {this.props.text.reload}
              </button>
            </div>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-sm text-[#1A1A1A]/60 cursor-pointer">
                  Tekniske detaljer
                </summary>
                <pre className="mt-2 p-4 bg-gray-100 text-xs overflow-auto rounded">
                  {this.state.error.message}
                  {"\n\n"}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function ErrorBoundary({ children, fallback }: Props) {
  const text = useCopy().site.errorBoundary;
  return (
    <ErrorBoundaryInner text={text} fallback={fallback}>
      {children}
    </ErrorBoundaryInner>
  );
}
