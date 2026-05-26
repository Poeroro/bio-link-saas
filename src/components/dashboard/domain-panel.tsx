'use client';

import {
  Globe2,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';

type CustomDomain = {
  id: string;
  domain: string;
  verified: boolean;
  createdAt: string;
};

export function DomainPanel() {
  const { data: session } = useSession();
  const [domains, setDomains] = useState<CustomDomain[]>([]);
  const [newDomain, setNewDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copied, setCopied] = useState(false);

  const fetchDomains = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/domains');
      if (!res.ok) throw new Error('Failed to load domains');
      const json = await res.json();
      setDomains(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDomains();
  }, [fetchDomains]);

  const addDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain.trim()) return;

    setAdding(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/domains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: newDomain.trim().toLowerCase() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to add domain');
      setDomains((prev) => [...prev, json]);
      setNewDomain('');
      setSuccess('Domain added! Configure DNS to verify.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setAdding(false);
    }
  };

  const deleteDomain = async (id: string) => {
    setError('');
    try {
      const res = await fetch(`/api/domains?id=${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete domain');
      setDomains((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const cnameTarget = 'bio-link-saas.vercel.app';

  const handleCopy = () => {
    navigator.clipboard.writeText(cnameTarget);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid gap-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-400">
          Domains
        </p>
        <h2 className="mt-1 text-lg font-semibold text-white">
          Custom domains
        </h2>
        <p className="mt-1 text-sm text-zinc-400">
          Use your own domain for your bio page.
        </p>
      </div>

      {/* Add domain form */}
      <form
        onSubmit={addDomain}
        className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
      >
        <input
          type="text"
          value={newDomain}
          onChange={(e) => setNewDomain(e.target.value)}
          placeholder="yourdomain.com"
          className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
        />
        <button
          type="submit"
          disabled={adding || !newDomain.trim()}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {adding ? (
            <div className="size-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
          ) : (
            <Plus className="size-4" />
          )}
          Add
        </button>
      </form>

      {/* Messages */}
      {error && (
        <div className="flex items-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-300">
          <AlertCircle className="size-4 shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300">
          <CheckCircle2 className="size-4 shrink-0" />
          {success}
        </div>
      )}

      {/* Domains list */}
      {loading ? (
        <div className="grid h-24 place-items-center rounded-2xl border border-white/10 bg-white/5">
          <div className="size-6 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
        </div>
      ) : domains.length > 0 ? (
        <div className="grid gap-3">
          {domains.map((domain) => (
            <div
              key={domain.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <div className="flex min-w-0 items-center gap-3">
                <Globe2 className="size-5 shrink-0 text-zinc-400" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">
                    {domain.domain}
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-500">
                    Added{' '}
                    {new Date(domain.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
                    domain.verified
                      ? 'bg-emerald-400/15 text-emerald-400'
                      : 'bg-amber-400/15 text-amber-400',
                  )}
                >
                  {domain.verified ? (
                    <>
                      <CheckCircle2 className="size-3" />
                      Verified
                    </>
                  ) : (
                    <>
                      <AlertCircle className="size-3" />
                      Pending
                    </>
                  )}
                </span>
                <button
                  type="button"
                  onClick={() => deleteDomain(domain.id)}
                  className="grid size-9 place-items-center rounded-xl text-zinc-500 transition hover:bg-rose-500/15 hover:text-rose-400"
                  aria-label={`Delete ${domain.domain}`}
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid place-items-center rounded-2xl border border-dashed border-white/10 py-10">
          <Globe2 className="size-8 text-zinc-600" />
          <p className="mt-3 text-sm text-zinc-500">
            No custom domains yet
          </p>
        </div>
      )}

      {/* DNS Setup instructions */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <p className="text-sm font-semibold text-white">
          DNS Setup Instructions
        </p>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          To connect your custom domain, add a{' '}
          <strong className="text-white">CNAME record</strong> in your
          DNS provider settings:
        </p>

        <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-wider text-zinc-500">
                <th className="px-4 py-2.5 text-left font-semibold">
                  Type
                </th>
                <th className="px-4 py-2.5 text-left font-semibold">
                  Name
                </th>
                <th className="px-4 py-2.5 text-left font-semibold">
                  Value
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-3 font-mono text-cyan-400">
                  CNAME
                </td>
                <td className="px-4 py-3 font-mono text-zinc-300">
                  @
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-zinc-300">
                      {cnameTarget}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="text-zinc-500 transition hover:text-cyan-400"
                      aria-label="Copy CNAME target"
                    >
                      {copied ? (
                        <CheckCircle2 className="size-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="size-3.5" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 space-y-2 text-xs text-zinc-500">
          <p>
            1. Log in to your domain registrar (Namecheap, Cloudflare,
            GoDaddy, etc.)
          </p>
          <p>
            2. Navigate to DNS settings for your domain
          </p>
          <p>
            3. Add a CNAME record pointing{' '}
            <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-zinc-300">
              @
            </code>{' '}
            to{' '}
            <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-zinc-300">
              {cnameTarget}
            </code>
          </p>
          <p>
            4. DNS propagation may take up to 48 hours. Verification is
            automatic.
          </p>
        </div>

        <a
          href="https://vercel.com/docs/projects/custom-domains"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
        >
          Learn more about custom domains
          <ExternalLink className="size-3" />
        </a>
      </div>
    </div>
  );
}
