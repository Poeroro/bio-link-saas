"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

type State = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="rounded-[1.75rem] border border-rose-200 bg-rose-50 p-6 text-center dark:border-rose-500/20 dark:bg-rose-500/5">
          <AlertTriangle className="mx-auto size-8 text-rose-500" />
          <p className="mt-3 text-sm font-semibold text-rose-700 dark:text-rose-300">
            Something went wrong
          </p>
          {this.state.error?.message && (
            <p className="mt-1 break-all font-mono text-xs text-rose-600/70 dark:text-rose-400/50">
              {this.state.error.message}
            </p>
          )}
          <button
            type="button"
            onClick={this.handleRetry}
            className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700"
          >
            <RefreshCw className="size-4" />
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
