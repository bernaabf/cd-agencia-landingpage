/** Duas queries reutilizadas; resultados GPU lidos sem bloquear o pipeline. */
export function createGpuTimer(gl: WebGL2RenderingContext) {
  const extension = gl.getExtension("EXT_disjoint_timer_query_webgl2") as {
    TIME_ELAPSED_EXT: number; GPU_DISJOINT_EXT: number;
  } | null;
  const queries = extension ? [gl.createQuery(), gl.createQuery()] : [];
  const pending = [false, false];
  let slot = 0, running = false, milliseconds: number | null = null;
  return {
    begin() {
      if (!extension || gl.isContextLost()) return;
      const query = queries[slot];
      if (!query) return;
      if (pending[slot]) {
        if (!gl.getQueryParameter(query, gl.QUERY_RESULT_AVAILABLE)) return;
        if (!gl.getParameter(extension.GPU_DISJOINT_EXT)) milliseconds = Number(gl.getQueryParameter(query, gl.QUERY_RESULT)) / 1e6;
        pending[slot] = false;
      }
      gl.beginQuery(extension.TIME_ELAPSED_EXT, query); running = true;
    },
    end() {
      if (!extension || !running) return;
      gl.endQuery(extension.TIME_ELAPSED_EXT); pending[slot] = true; slot = 1 - slot; running = false;
    },
    get milliseconds() { return milliseconds; },
    dispose() { for (const query of queries) if (query) gl.deleteQuery(query); },
  };
}
