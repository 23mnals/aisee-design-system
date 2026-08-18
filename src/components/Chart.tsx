import { useId, useMemo, type HTMLAttributes, type ReactNode } from 'react';

export interface ChartPoint {
  label: string;
  value: number;
}

export interface LineChartProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  data: ChartPoint[];
  title?: ReactNode;
  description?: ReactNode;
  valueFormatter?: (value: number) => string;
}

export function LineChart({
  data,
  title,
  description,
  valueFormatter = (value) => String(value),
  className = '',
  ...props
}: LineChartProps) {
  const gradientId = `aisee-chart-${useId().replace(/:/g, '')}`;
  const chart = useMemo(() => {
    const width = 640;
    const height = 240;
    const left = 36;
    const right = 16;
    const top = 16;
    const bottom = 36;
    if (!data.length) return { width, height, left, right, top, bottom, points: [], line: '', area: '', min: 0, max: 0 };
    const values = data.map((point) => point.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const points = data.map((point, index) => ({
      ...point,
      x: left + (data.length === 1 ? 0 : index * (width - left - right) / (data.length - 1)),
      y: top + (max - point.value) * (height - top - bottom) / range,
    }));
    const line = points.map((point) => `${point.x},${point.y}`).join(' ');
    const area = points.length ? `${left},${height - bottom} ${line} ${points.at(-1)?.x},${height - bottom}` : '';
    return { width, height, left, right, top, bottom, points, line, area, min, max };
  }, [data]);

  return <figure {...props} className={`aisee-chart ${className}`.trim()}>
    {(title || description) && <figcaption>{title && <strong>{title}</strong>}{description && <span>{description}</span>}</figcaption>}
    {data.length ? <svg viewBox={`0 0 ${chart.width} ${chart.height}`} role="img" aria-label={typeof title === 'string' ? title : 'Line chart'}>
      <defs><linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="var(--aisee-module-primary)" stopOpacity=".36" /><stop offset="1" stopColor="var(--aisee-module-primary)" stopOpacity="0" /></linearGradient></defs>
      {[0, .5, 1].map((ratio) => {
        const y = chart.top + ratio * (chart.height - chart.top - chart.bottom);
        const value = chart.max - ratio * (chart.max - chart.min);
        return <g key={ratio}><line className="aisee-chart__grid" x1={chart.left} x2={chart.width - chart.right} y1={y} y2={y} /><text className="aisee-chart__axis-label" x={0} y={y + 4}>{valueFormatter(value)}</text></g>;
      })}
      <polygon className="aisee-chart__area" points={chart.area} fill={`url(#${gradientId})`} />
      <polyline className="aisee-chart__line" points={chart.line} />
      {chart.points.map((point) => {
        const tooltipX = Math.min(Math.max(point.x - 45, chart.left), chart.width - chart.right - 90);
        return <g key={point.label} className="aisee-chart__point" tabIndex={0} aria-label={`${point.label}: ${valueFormatter(point.value)}`}>
          <circle cx={point.x} cy={point.y} r="4" />
          <g className="aisee-chart__tooltip" aria-hidden="true"><rect x={tooltipX} y={point.y - 36} width="90" height="24" rx="6" /><text x={tooltipX + 45} y={point.y - 20}>{valueFormatter(point.value)}</text></g>
          <text className="aisee-chart__x-label" x={point.x} y={chart.height - 10}>{point.label}</text>
        </g>;
      })}
    </svg> : <p className="aisee-chart__empty">No chart data</p>}
  </figure>;
}
