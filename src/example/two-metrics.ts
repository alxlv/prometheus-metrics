import { IMetric } from '../collectors/metric-types/IMetric';
import { PrometheusCollectorParams } from '../collectors/Prometheus';
import { Server, ServerParams } from '../Server';

const prometheusCollectorParams: PrometheusCollectorParams = {
  timeout: 2000
};

const serverParams: ServerParams = {
  serviceName: 'test',
  prometheusParams: prometheusCollectorParams
};

const server: Server = new Server(serverParams);
const counter: IMetric = server.addCounter(
  'test_counter',
  'test counter help',
  ['test_counter_label']
);

const counterInterval = setInterval(() => {
  console.log(`counter current value ${counter.get()}`);
  counter.inc();
  counter.inc(2, true);
}, 5000);

server.run();

const gauge: IMetric = server.addGauge('test_gauge', 'test gauge help', [
  'test_gauge_label'
]);

let isGaugeReset: boolean = false;

const gaugeInterval = setInterval(() => {
  console.log('gauge');
  gauge.inc(10);
  gauge.dec(5);

  if (gauge.get() > 50) {
    if (!isGaugeReset) {
      // Clear all gauge values
      gauge.reset();
      isGaugeReset = true;
      // Add new label value
      gauge.setLabels(['moreThan50'], 51);
    } else {
      gauge.setLabels(['moreThan50'], gauge.get() + 1);
    }
  } else {
    // Add group of label values
    gauge.setLabels(['average'], gauge.get() + 1);
    gauge.setLabels(['getExchanges'], gauge.get() + 1);
    gauge.setLabels(['getPairs'], gauge.get() + 1);
  }

  try {
    gauge.inc(1, true);
  } catch (err) {
    console.log(`gauge current value: ${gauge.get()}`);
    gauge.set(gauge.get() + 1, true);
  }
}, 2000);

const removeMetricInterval = setInterval(() => {
  server.removeMetric('test_gauge');
}, 80000);

setTimeout(() => {
  counter.reset();
  gauge.reset();
  clearInterval(removeMetricInterval);
  clearInterval(gaugeInterval);
  clearInterval(counterInterval);
  server.stop();
}, 180000);
