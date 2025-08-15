import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { ScoringResult, PERSONALITY_TYPES } from '../services/scoringService';
import styles from './BreakdownChart.module.css';

interface BreakdownChartProps {
  result: ScoringResult;
}

export const BreakdownChart = ({ result }: BreakdownChartProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const renderChart = () => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous chart

    // Get container width for responsive design
    const containerWidth = svgRef.current.parentElement?.clientWidth || 800;
    const isMobile = containerWidth < 768;
    const isLargeScreen = containerWidth > 1200;
    
    const margin = { 
      top: isLargeScreen ? 40 : 20, 
      right: isMobile ? 10 : isLargeScreen ? 40 : 20, 
      bottom: isMobile ? 80 : isLargeScreen ? 100 : 60, 
      left: isMobile ? 40 : isLargeScreen ? 80 : 60 
    };
    const width = Math.min(containerWidth - 80, isLargeScreen ? 1000 : 800) - margin.left - margin.right;
    const height = isMobile ? 300 : isLargeScreen ? 600 : 500 - margin.top - margin.bottom;

    const chart = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Sort data by percentage descending
    const data = result.breakdown.sort((a, b) => b.percentage - a.percentage);

    // Create scales
    const x = d3.scaleBand()
      .domain(data.map(d => d.type))
      .range([0, width])
      .padding(isLargeScreen ? 0.3 : 0.2);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.percentage) || 100])
      .range([height, 0]);

    // Add bars
    chart.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.type) || 0)
      .attr('y', d => y(d.percentage))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.percentage))
      .attr('fill', d => {
        const type = PERSONALITY_TYPES.find(t => t.id === d.type);
        return type?.color || '#ccc';
      })
      .attr('rx', 4)
      .attr('ry', 4);

    // Add percentage labels on bars
    chart.selectAll('.bar-label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'bar-label')
      .attr('x', d => (x(d.type) || 0) + x.bandwidth() / 2)
      .attr('y', d => y(d.percentage) - 10)
      .attr('text-anchor', 'middle')
      .attr('fill', '#241E1B')
      .attr('font-family', 'ChiswickSans, sans-serif')
      .attr('font-size', isMobile ? '12px' : isLargeScreen ? '18px' : '14px')
      .attr('font-weight', '600')
      .text(d => `${d.percentage}%`);

    // Add x-axis
    chart.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', isMobile ? 'rotate(-90)' : 'rotate(-45)')
      .attr('text-anchor', isMobile ? 'end' : 'end')
      .attr('font-family', 'ChiswickSans, sans-serif')
      .attr('font-size', isMobile ? '10px' : isLargeScreen ? '16px' : '12px')
      .attr('fill', '#241E1B')
      .text((d: any) => {
        const type = PERSONALITY_TYPES.find(t => t.id === d);
        return type?.name || d;
      });

    // Add y-axis
    chart.append('g')
      .call(d3.axisLeft(y).ticks(isMobile ? 4 : isLargeScreen ? 8 : 5).tickFormat(d => `${d}%`))
      .selectAll('text')
      .attr('font-family', 'ChiswickSans, sans-serif')
      .attr('font-size', isMobile ? '10px' : isLargeScreen ? '16px' : '12px')
      .attr('fill', '#241E1B');

    // Add y-axis label (only on desktop)
    if (!isMobile) {
      chart.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left)
        .attr('x', 0 - (height / 2))
        .attr('dy', '1em')
        .attr('text-anchor', 'middle')
        .attr('font-family', 'ChiswickSans, sans-serif')
        .attr('font-size', isLargeScreen ? '18px' : '14px')
        .attr('fill', '#241E1B')
        .text('Percentage Score');
    }
  };

  useEffect(() => {
    renderChart();
    
    // Add resize listener for responsive design
    const handleResize = () => {
      renderChart();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [result]);

  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.chartTitle}>Your Personality Breakdown</h3>
      <p className={styles.chartDescription}>
        See how you scored across all personality types
      </p>
      <svg
        ref={svgRef}
        width="100%"
        height="auto"
        viewBox="0 0 1000 600"
        preserveAspectRatio="xMidYMid meet"
        className={styles.chart}
      />
    </div>
  );
};
