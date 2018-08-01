import { IMetric, MetricType } from './metric-types/IMetric';

interface ICollector {
  readonly run: () => void;
  readonly gather: () => string;
  readonly addMetric: (
    name: string,
    help: string,
    labelNames: string[],
    type: MetricType
  ) => IMetric;
  readonly removeMetric: (name: string) => void;
  readonly stop: () => void;
}

export { ICollector };
