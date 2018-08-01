type MetricType = 'Counter' | 'Gauge';

interface IMetric {
  readonly get: () => number;
  readonly inc: (value?: number, timestamp?: boolean) => void;
  readonly dec: (value?: number, timestamp?: boolean) => void;
  readonly set: (value?: number, timestamp?: boolean) => void;
  readonly setLabels: (
    labelValues: string[],
    value?: number,
    timestamp?: boolean
  ) => void;
  readonly reset: () => void;
  readonly value: () => any;
}

export { IMetric, MetricType };
