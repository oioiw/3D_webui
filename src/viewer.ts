import * as Cesium from "cesium";

export function createViewer(containerId: string): Cesium.Viewer {
  const el = document.getElementById(containerId);
  if (!el) throw new Error(`容器 #${containerId} 未找到`);

  // Cesium 静态资源路径
  // @ts-ignore
  window.CESIUM_BASE_URL = (window as any).CESIUM_BASE_URL || "/cesium";

  const viewer = new Cesium.Viewer(el, {
    animation: false,
    timeline: false,
    infoBox: false,
    fullscreenButton: false,
    baseLayerPicker: false,
    geocoder: false,
    sceneModePicker: false,
    navigationHelpButton: false,
    homeButton: false,
    selectionIndicator: false,
  });

  viewer.scene.globe.enableLighting = false;
  viewer.scene.globe.depthTestAgainstTerrain = false;
  viewer.scene.skyAtmosphere.show = true;

  return viewer;
}

export function flyToPosition(
  viewer: Cesium.Viewer,
  lon: number,
  lat: number
) {
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(lon, lat, 500000),
    duration: 1.5,
  });
}