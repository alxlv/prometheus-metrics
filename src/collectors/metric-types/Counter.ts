import { IMetric } from './IMetric';

class Counter implements IMetric {
  _metric: any;

  get value(): any {
    return this._metric;
  }

  constructor(metric: any) {
    this._metric = metric;
  }

  get(): number {
    if (
      this._metric.get().values.length > 0 &&
      this._metric.get().values[0].value
    ) {
      return this._metric.get().values[0].value;
    }

    return 0;
  }

  inc(value: number = 1, timestamp: boolean = false): void {
    if (timestamp === false) this._metric.inc(value);
    else this._metric.inc(value, Date.now());
  }

  dec(value: number = 1, timestamp: boolean = false): void {
    throw new Error('not supported');
  }

  set(value: number = 0, timestamp: boolean = false): void {
    if (timestamp === false) this._metric.set(value);
    else this._metric.set(value, Date.now());
  }

  setLabels(
    labelValues: string[],
    value: number = 0,
    timestamp: boolean = false
  ): void {
    if (timestamp === false) this._metric.labels(labelValues).set(value);
    else this._metric.labels(labelValues).set(value, Date.now());
  }

  reset(): void {
    this._metric.reset();
  }
}

export { Counter };
