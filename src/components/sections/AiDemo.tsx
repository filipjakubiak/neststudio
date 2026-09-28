'use client';

import { useId, useState } from 'react';
import type { Content, NodeType } from '@/content/types';
import { Button } from '@/components/ui/Button';
import { Lightning, Eye, FunnelSimple, PencilSimpleLine, CheckCircle, AddressBook, EnvelopeSimple, FileText, CalendarBlank, BellSimple } from '@phosphor-icons/react/dist/ssr';

const ICONS: Record<NodeType, React.ComponentType<{ size?: number; weight?: 'light' | 'regular' }>> = {
  trigger: Lightning, read: Eye, classify: FunnelSimple, draft: PencilSimpleLine, review: CheckCircle,
  crm: AddressBook, email: EnvelopeSimple, document: FileText, calendar: CalendarBlank, notify: BellSimple,
};

export type RunState = 'ready' | 'running' | 'done';

export function AiDemo({ c }: { c: Content }) {
  const [presetId, setPresetId] = useState(c.aiDemo.presets[0].id);
  const [state, setState] = useState<RunState>('ready');
  const [active, setActive] = useState(-1);
  const logId = useId();
  const preset = c.aiDemo.presets.find((p) => p.id === presetId) ?? c.aiDemo.presets[0];

  const run = () => {
    if (state === 'running') return;
    setState('running');
    setActive(0);
    let i = 0;
    const tick = () => {
      i += 1;
      if (i < preset.steps.length) { setActive(i); window.setTimeout(tick, 700); }
      else { setState('done'); window.setTimeout(() => { setState('ready'); setActive(-1); }, 2400); }
    };
    window.setTimeout(tick, 700);
  };

  const choose = (id: string) => { setPresetId(id); setState('ready'); setActive(-1); };

  return (
    <section className="aidemo section" data-section="ai" aria-labelledby="ai-title">
      <div className="wrap">
        <h2 id="ai-title" className="t-h1">{c.aiDemo.title}</h2>
        <p className="t-lead measure text-ink-soft aidemo-lead">{c.aiDemo.lead}</p>
        <div className="aidemo-presets" role="group" aria-label={c.aiDemo.lead}>
          {c.aiDemo.presets.map((p) => (
            <button key={p.id} type="button" className="chip aidemo-chip" aria-pressed={p.id === presetId} onClick={() => choose(p.id)}>{p.label}</button>
          ))}
        </div>
        <div className="aidemo-surface" data-state={state}>
          <ol className="flow" aria-label={preset.label}>
            {preset.steps.map((s, i) => {
              const Icon = ICONS[s.node];
              const status = state === 'ready' ? 'idle' : i < active ? 'done' : i === active ? (state === 'done' ? 'done' : 'active') : 'idle';
              return (
                <li className="flow-node" key={`${preset.id}-${i}`} data-status={status} data-node={s.node}>
                  <span className="flow-node-pill">
                    <span className="flow-node-icon" aria-hidden="true"><Icon size={16} weight="light" /></span>
                    <span className="t-label">{c.aiDemo.nodeLabels[s.node]}</span>
                  </span>
                  <span className="t-small flow-node-text">{s.text}</span>
                </li>
              );
            })}
          </ol>
          <div className="aidemo-bar">
            <Button onClick={run} disabled={state === 'running'} icon={false}>{c.aiDemo.run}</Button>
            <span className="t-mono t-caption aidemo-status" role="status" aria-live="polite">
              <span className="aidemo-dot" aria-hidden="true" />
              {state === 'ready' ? c.aiDemo.status.ready : state === 'running' ? c.aiDemo.status.running : c.aiDemo.status.done}
            </span>
          </div>
          <ol id={logId} className="aidemo-log t-mono t-caption" aria-label={c.aiDemo.logAria} aria-live="polite">
            {state !== 'ready' && preset.steps.slice(0, Math.max(0, Math.min(active + 1, preset.steps.length))).map((s, i) => (
              <li key={i}>{s.text}</li>
            ))}
          </ol>
        </div>
        <p className="t-caption text-ink-soft aidemo-note">{c.aiDemo.note}</p>
      </div>
    </section>
  );
}
