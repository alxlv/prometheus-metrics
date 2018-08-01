import * as Prometheus from 'prom-client';
import { ICollector } from './ICollector';
import { IMetric, MetricType } from './metric-types/IMetric';
import { Gauge } from './metric-types/Gauge';
import { Counter } from './metric-types/Counter';

interface PrometheusCollectorParams {
  timeout: number;
}

class PrometheusCollector implements ICollector {
  _interval: any;
  _params: PrometheusCollectorParams;

  constructor(params: PrometheusCollectorParams) {
    this._params = params;
  }

  run(): void {
    this._interval = Prometheus.collectDefaultMetrics({
      timeout: this._params.timeout
    });
  }

  gather(): string {
    return Prometheus.register.metrics();
  }

  addMetric(
    name: string,
    help: string,
    labelNames: string[],
    type: MetricType
  ): IMetric {
    let newMetric: IMetric;

    if (type === 'Counter') {
      newMetric = new Counter(
        new Prometheus.Counter({ name, help, labelNames })
      );
    } else if (type === 'Gauge') {
      newMetric = new Gauge(new Prometheus.Gauge({ name, help, labelNames }));
    } else throw new Error('type is not supported');

    return newMetric;
  }

  removeMetric(name: string): void {
    Prometheus.register.removeSingleMetric(name);
  }

  stop(): void {
    if (this._interval) clearInterval(this._interval);
    Prometheus.register.clear();
  }
}

export { PrometheusCollector, PrometheusCollectorParams };
