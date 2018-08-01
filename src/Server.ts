import express from 'express';

import {
  PrometheusCollector,
  PrometheusCollectorParams
} from './collectors/Prometheus';
import { ICollector } from './collectors/ICollector';
import { IMetric } from './collectors/metric-types/IMetric';

interface ServerParams {
  serviceName: string;
  prometheusParams: PrometheusCollectorParams;
}

class Server {
  _app: any;
  _server: any;
  _port: number;

  _params: ServerParams;
  _prometheusCollector: ICollector;

  constructor(params: ServerParams) {
    this._port = 9103;
    this._params = params;
    this._prometheusCollector = new PrometheusCollector(
      params.prometheusParams
    );
    this._init();
  }

  _init(): void {
    this._app = express();

    this._app.get('/metrics', (req: any, res: any) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });

      const prometheusMetricsResult = this._prometheusCollector.gather();
      res.write(prometheusMetricsResult);

      res.end();
    });
  }

  addCounter(name: string, help?: string, labelNames?: string[]): IMetric {
    return this._prometheusCollector.addMetric(
      name,
      help,
      labelNames,
      'Counter'
    );
  }

  addGauge(name: string, help?: string, labelNames?: string[]): IMetric {
    return this._prometheusCollector.addMetric(name, help, labelNames, 'Gauge');
  }

  removeMetric(name: string): void {
    return this._prometheusCollector.removeMetric(name);
  }

  async run(): Promise<any> {
    return new Promise(resolve => {
      this._server = this._app.listen(this._port, async () => {
        await this._prometheusCollector.run();
        resolve();
      });
    });
  }

  stop(): void {
    this._server.close();
    this._prometheusCollector.stop();
  }
}

export { Server, ServerParams };
