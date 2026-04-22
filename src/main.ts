import "./styles.css";
import * as Cesium from "cesium";
import { createViewer, flyToPosition } from "./viewer";
import { generateAlerts, Alert } from "./alerts";
import { renderAlertList } from "./ui";
import { attachPulseEffect, spawnScanWave, ScanWaveHandle } from "./effects";

let viewer: Cesium.Viewer | null = null;
let currentScan: ScanWaveHandle | null = null;

function addAlertEntities(viewer: Cesium.Viewer, alerts: Alert[]) {
  const map = new Map<string, Cesium.Entity>();

  alerts.forEach((a) => {
    const position = Cesium.Cartesian3.fromDegrees(a.lon, a.lat, 0);
    const color =
      a.level === 3
        ? Cesium.Color.RED
        : a.level === 2
        ? Cesium.Color.PURPLE
        : Cesium.Color.CYAN;

    const entity = viewer.entities.add({
      position,
      point: {
        pixelSize: 10,
        color: color.withAlpha(0.9),
        outlineColor: Cesium.Color.WHITE.withAlpha(0.6),
        outlineWidth: 1,
      },
      label: {
        text: a.title,
        font: "12px sans-serif",
        fillColor: Cesium.Color.WHITE,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        outlineWidth: 2,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -12),
        showBackground: true,
        backgroundColor: Cesium.Color.BLACK.withAlpha(0.4),
      },
    });

    // 点脉冲特效
    attachPulseEffect(entity, 8, 6);

    map.set(a.id, entity);
  });

  return map;
}

function init() {
  try {
    viewer = createViewer("cesiumContainer");
  } catch (err) {
    console.error("Viewer 初始化失败", err);
    alert("Cesium 初始化失败，请检查容器或资源路径。");
    return;
  }

  const alerts = generateAlerts(10);
  const entityMap = addAlertEntities(viewer, alerts);

  renderAlertList("alert-list", alerts, (alert) => {
    if (!viewer) return;

    // 相机飞行定位
    flyToPosition(viewer, alert.lon, alert.lat);

    // 清除旧扫描波
    if (currentScan) {
      currentScan.dispose();
      currentScan = null;
    }

    // 创建扫描波
    const entity = entityMap.get(alert.id);
    if (!entity || !entity.position) return;

    const pos =
      entity.position.getValue(Cesium.JulianDate.now()) ||
      Cesium.Cartesian3.fromDegrees(alert.lon, alert.lat, 0);

    currentScan = spawnScanWave(viewer, pos, 2200);
  });

  // 初始视角：对准中段
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(65, 39, 2000000),
    duration: 0,
  });
}

init();