import * as Cesium from "cesium";

export type PulseHandle = {
  entity: Cesium.Entity;
};

export type ScanWaveHandle = {
  entity: Cesium.Entity;
  dispose: () => void;
};

export function attachPulseEffect(entity: Cesium.Entity, base = 8, amp = 6) {
  const start = Date.now();
  entity.point = entity.point || new Cesium.PointGraphics();
  entity.point.pixelSize = new Cesium.CallbackProperty(() => {
    const t = (Date.now() - start) / 500;
    const s = Math.sin(t) * 0.5 + 0.5;
    return base + amp * s;
  }, false);

  entity.point.color = new Cesium.CallbackProperty(() => {
    const t = (Date.now() - start) / 500;
    const a = 0.6 + 0.4 * (Math.sin(t) * 0.5 + 0.5);
    return Cesium.Color.CYAN.withAlpha(a);
  }, false);

  return { entity };
}

export function spawnScanWave(
  viewer: Cesium.Viewer,
  position: Cesium.Cartesian3,
  durationMs = 2500
): ScanWaveHandle {
  const start = Date.now();
  const maxRadius = 80000;

  const wave = viewer.entities.add({
    position,
    ellipse: {
      semiMajorAxis: new Cesium.CallbackProperty(() => {
        const t = (Date.now() - start) / durationMs;
        return maxRadius * Math.min(t, 1);
      }, false),
      semiMinorAxis: new Cesium.CallbackProperty(() => {
        const t = (Date.now() - start) / durationMs;
        return maxRadius * Math.min(t, 1);
      }, false),
      material: new Cesium.CallbackProperty(() => {
        const t = (Date.now() - start) / durationMs;
        const alpha = Math.max(0, 0.6 * (1 - t));
        return Cesium.Color.AQUA.withAlpha(alpha);
      }, false),
      outline: true,
      outlineColor: Cesium.Color.AQUA.withAlpha(0.8),
      outlineWidth: 2,
      height: 0,
    },
  });

  const dispose = () => {
    if (!viewer.entities.contains(wave)) return;
    viewer.entities.remove(wave);
  };

  // 自动销毁
  setTimeout(dispose, durationMs + 200);

  return { entity: wave, dispose };
}