export type AlertLevel = 1 | 2 | 3;

export type Alert = {
  id: string;
  title: string;
  level: AlertLevel;
  lon: number;
  lat: number;
  createdAt: number;
};

const rand = (min: number, max: number) => Math.random() * (max - min) + min;

function randomId(prefix = "A") {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * 生成模拟告警：
 * - 70% 在瓶颈区域（山口/隘口）
 * - 30% 在走廊两端
 */
export function generateAlerts(count = 10): Alert[] {
  const alerts: Alert[] = [];
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const useBottleneck = Math.random() < 0.7;

    let lon: number, lat: number;

    if (useBottleneck) {
      // 瓶颈区域（中段小盒）
      lon = rand(64, 67);
      lat = rand(38, 40);
    } else {
      // 走廊两端
      const end = Math.random() < 0.5 ? "east" : "west";
      if (end === "east") {
        lon = rand(75, 85);
        lat = rand(35, 41);
      } else {
        lon = rand(45, 55);
        lat = rand(32, 38);
      }
    }

    const level: AlertLevel = pick([1, 2, 3]);
    const title = pick([
      "异常靠近通道",
      "通道阻断风险",
      "目标丢失后重现",
      "疑似越界行为",
      "风险目标聚集",
    ]);

    alerts.push({
      id: randomId(),
      title,
      level,
      lon,
      lat,
      createdAt: now - Math.floor(Math.random() * 1000 * 60 * 30),
    });
  }

  return alerts;
}