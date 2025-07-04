import { useState } from 'react';
import Plotly from 'plotly.js-dist-min';

const worker = new Worker(new URL('../worker/pyWorker.js', import.meta.url), { type: 'module' });

export function PcaLab() {
  const [pcs, setPcs] = useState(null);
  const [varExp, setVarExp] = useState(null);
  const [loading, setLoading] = useState(false);

  const demo = [
    // tiny 4-sample, 4-feature toy matrix
    [2.5, 2.4, 1.2, 0.9],
    [0.5, 0.7, 0.3, 0.2],
    [2.2, 2.9, 1.1, 1.0],
    [1.9, 2.2, 0.9, 0.8],
  ];

  const run = () => {
    setLoading(true);
    worker.postMessage({ matrix: demo, nComp: 3, center: true, scale: true });
  };

  worker.onmessage = ({ data }) => {
    setLoading(false);
    if (!data.ok) return alert(data.error);
    setPcs(data.payload.pcs);
    setVarExp(data.payload.variance);
  };

  return (
    <div className="my-6 rounded-xl border p-4 bg-white dark:bg-slate-800">
      <button
        onClick={run}
        className="rounded bg-brand px-4 py-2 text-white font-semibold hover:bg-brand-light"
        disabled={loading}
      >
        {loading ? 'Running…' : 'Run PCA on demo data'}
      </button>

      {varExp && (
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {/* Scree */}
          <Plot id="scree" title="Explained variance (%)" xs={Array.from({ length: varExp.length }, (_, i) => i + 1)} ys={varExp} />
          {/* 3-D Scatter */}
          <Plot id="scatter" title="PC1 / PC2 / PC3" pcs={pcs} />
        </div>
      )}
    </div>
  );
}

/* Helper component renders plotly either bar or 3D scatter */
function Plot({ id, title, xs, ys, pcs }) {
  return (
    <div id={id} className="h-64" ref={el => {
      if (!el) return;
      if (pcs) {
        const [x, y, z] = [0, 1, 2].map(i => pcs.map(r => r[i]));
        Plotly.newPlot(el, [{ x, y, z, mode: 'markers', type: 'scatter3d', marker: { size: 4 } }], { title }, {displayModeBar:false, responsive:true});
      } else if (xs && ys) {
        Plotly.newPlot(el, [{ x: xs, y: ys, type: 'bar' }], { title, xaxis: { title: 'PC' } }, {displayModeBar:false, responsive:true});
      }
    }} />
  );
}
