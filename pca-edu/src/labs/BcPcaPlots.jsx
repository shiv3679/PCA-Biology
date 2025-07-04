import { useEffect, useRef, useState } from 'react';
import Plotly from 'plotly.js-dist-min';

/* ---------- singleton worker & cache ---------- */
const worker  = new Worker(new URL('../worker/pyBcWorker.js', import.meta.url));
let   cache   = null;            // holds the dataset once loaded
const listeners = new Set();     // components waiting for data

worker.addEventListener('message', e => {
  cache = e.data;
  listeners.forEach(fn => fn(cache));   // notify all waiting components
});
worker.postMessage('load');

/* ---------- shared hook ----------------------- */
function useBcData() {
  const [data, setData] = useState(cache);

  useEffect(() => {
    if (cache) return;          // already loaded, nothing to wait for
    listeners.add(setData);
    return () => listeners.delete(setData);   // cleanup on unmount
  }, []);

  return data;
}

/* ---------- helper ---------------------------- */
function draw(div, fig) {
  Plotly.react(div, fig.data, fig.layout,
               { displayModeBar: false, responsive: true });
}

/* ================================================== */
/*                1 · Gene-gene scatter                */
/* ================================================== */
export function GeneScatter() {
  const data         = useBcData();
  const [xIdx, setX] = useState(0);
  const [yIdx, setY] = useState(1);
  const ref          = useRef(null);

  useEffect(() => {
    if (!data) return;
    const { matrix, feature_names, target } = data;
    const colors = target.map(t => t ? 'rgb(34,197,94)' : 'rgb(239,68,68)');
    const labels = target.map(t => t ? 'benign' : 'malignant');

    draw(ref.current, {
      data: [{
        x: matrix.map(r => r[xIdx]),
        y: matrix.map(r => r[yIdx]),
        text: labels,
        mode: 'markers',
        marker: { color: colors, size: 6 },
        hovertemplate: '%{text}<extra></extra>',
      }],
      layout: {
        title: 'Raw gene × gene scatter',
        height: 380,
        xaxis: { title: feature_names[xIdx] },
        yaxis: { title: feature_names[yIdx] },
        margin: { t: 40, r: 10, l: 60, b: 60 },
      }
    });
  }, [data, xIdx, yIdx]);

  if (!data) return <p className="italic">Loading demo dataset…</p>;

  return (
    <div className="not-prose space-y-4">
      <div className="flex flex-wrap gap-3">
        <select className="rounded border px-2 py-1" value={xIdx} onChange={e => setX(+e.target.value)}>
          {data.feature_names.map((f, i) => <option key={f} value={i}>{f}</option>)}
        </select>
        <select className="rounded border px-2 py-1" value={yIdx} onChange={e => setY(+e.target.value)}>
          {data.feature_names.map((f, i) => <option key={f} value={i}>{f}</option>)}
        </select>
      </div>
      <div ref={ref} />
    </div>
  );
}

/* ================================================== */
/*                2 · PC1 vs PC2 scatter               */
/* ================================================== */
export function PCScatter() {
  const data = useBcData();
  const ref  = useRef(null);

  useEffect(() => {
    if (!data) return;
    const { pcs, variance, target } = data;
    const colors = target.map(t => t ? 'rgb(34,197,94)' : 'rgb(239,68,68)');
    const labels = target.map(t => t ? 'benign' : 'malignant');

    draw(ref.current, {
      data: [{
        x: pcs.map(r => r[0]),
        y: pcs.map(r => r[1]),
        text: labels,
        mode: 'markers',
        marker: { color: colors, size: 6 },
        hovertemplate: '%{text}<extra></extra>',
      }],
      layout: {
        title: 'PC1 vs PC2',
        height: 380,
        xaxis: { title: `PC1 (${variance[0]} %)` },
        yaxis: { title: `PC2 (${variance[1]} %)` },
        margin: { t: 40, r: 10, l: 60, b: 60 },
      }
    });
  }, [data]);

  return data ? <div ref={ref} className="not-prose" /> : <p className="italic">Loading…</p>;
}

/* ================================================== */
/*                3 · Scree bar plot                   */
/* ================================================== */
export function ScreePlot() {
  const data = useBcData();
  const ref  = useRef(null);

  useEffect(() => {
    if (!data) return;
    draw(ref.current, {
      data: [{
        x: data.variance.map((_, i) => `PC${i + 1}`),
        y: data.variance,
        type: 'bar',
        marker: { color: 'rgb(16,185,129)' },
      }],
      layout: {
        title: 'Scree – % variance per PC',
        height: 300,
        yaxis: { title: '% variance' },
        margin: { t: 40, r: 10, l: 60, b: 60 },
      }
    });
  }, [data]);

  return data ? <div ref={ref} className="not-prose" /> : <p className="italic">Loading…</p>;
}
