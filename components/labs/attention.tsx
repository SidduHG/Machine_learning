'use client';
import { useState } from 'react';
import { attentionWeights, tokenNames, tokenVectors } from '@/lib/algorithms';
import { Range, Stat } from './controls';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
export function AttentionLab() {
  const [query, setQuery] = useState(2),
    [temperature, setTemperature] = useState(1),
    [causal, setCausal] = useState(false);
  const rows = tokenNames.map((_, i) =>
      attentionWeights(i, temperature, causal),
    ),
    weights = rows[query];
  const values = [0.1, 0.4, 0.8, 1],
    context = weights.reduce((s, w, i) => s + w * values[i], 0);
  return (
    <>
      <div className="lab-main">
        <div className="lab-stage attention-stage">
          <p className="attention-caption">
            Query → key attention · each row sums to 1
          </p>
          <Table className="attention-matrix" aria-label="Attention weights">
            <TableHeader>
              <TableRow className="matrix-row">
                <TableHead>Q / K</TableHead>
                {tokenNames.map((t) => (
                  <TableHead key={t}>{t}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, i) => (
                <TableRow
                  className={
                    'matrix-row ' + (i === query ? 'selected-row' : '')
                  }
                  key={i}
                >
                  <TableHead scope="row">{tokenNames[i]}</TableHead>
                  {row.map((v, j) => (
                    <TableCell
                      key={j}
                      style={{
                        background:
                          causal && j > i
                            ? '#162d49'
                            : `rgba(100,160,255,${0.1 + v * 0.8})`,
                      }}
                    >
                      {causal && j > i ? 'masked' : v.toFixed(3)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="attention-bars">
            {weights.map((v, i) => (
              <div key={i}>
                <span>{tokenNames[i]}</span>
                <div>
                  <i style={{ width: v * 100 + '%' }} />
                </div>
                <strong>{(v * 100).toFixed(1)}%</strong>
              </div>
            ))}
          </div>
        </div>
        <div className="lab-controls">
          <div className="eyebrow">CHOOSE WHAT TO LOOK FOR</div>
          <label className="select-label" htmlFor="query-token">
            Query token
          </label>
          <NativeSelect
            id="query-token"
            value={query}
            onChange={(e) => setQuery(Number(e.target.value))}
          >
            {tokenNames.map((t, i) => (
              <NativeSelectOption key={t} value={i}>
                {t}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          <Range
            label="Temperature"
            value={temperature}
            min={0.1}
            max={2}
            step={0.1}
            onChange={setTemperature}
          />
          <div className="switch-control">
            <label htmlFor="causal-mask">Causal mask</label>
            <Switch
              id="causal-mask"
              checked={causal}
              onCheckedChange={setCausal}
            />
          </div>
          <p className="control-note">
            Illustrative query/key vectors:
            <br />
            {tokenNames.map((t, i) => (
              <span key={t}>
                {t}: [{tokenVectors[i].join(', ')}]<br />
              </span>
            ))}
            <br />
            Values are [{values.join(', ')}]. The output is their
            attention-weighted average.
          </p>
        </div>
      </div>
      <div className="lab-stats" aria-live="polite">
        <Stat label="Selected query" value={tokenNames[query]} />
        <Stat
          label="Weight sum"
          value={weights.reduce((a, b) => a + b, 0).toFixed(4)}
        />
        <Stat label="Weighted context value" value={context.toFixed(4)} />
      </div>
    </>
  );
}
