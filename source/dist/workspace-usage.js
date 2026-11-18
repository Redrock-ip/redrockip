(() => {
  'use strict';
  const end = Date.UTC(2026, 10, 18), dayLength = 86400000;
  // Fixed, local sample series. These values never represent account activity.
  const series = {
    residential: [85,120,165,0,140,190,130,220,180,210,155,245,175,260,205,120,290,180,240,150,310,220,185,270,340,230,290,210,320,260],
    mobile: [35,60,45,80,0,70,95,55,90,75,120,85,65,110,90,130,70,115,95,150,110,75,160,105,140,95,180,125,155,120]
  };
  function sampleRows(type, days) {
    return series[type].map((amount, index) => ({
      date: new Date(end - (29 - index) * dayLength).toISOString().slice(0, 10),
      amount
    })).slice(-days);
  }

  const floatingFormat = '流量示例，仅用于预览。';
  window.RedRockUsagePreview = {
    loadUsage({productId, days}) {
      return {
        notice: floatingFormat,
        rows: sampleRows(productId === 'mobile' ? 'mobile' : 'residential', days)
          .map(({date, amount}) => ({date,gb:amount/1000}))
      };
    },
    loadTrafficDetails({productId, from, to, interval}) {
      const start = Date.parse(from);
      const duration = Date.parse(to)-start;
      const bucket = interval === 'day' ? dayLength : dayLength/24;
      const count = Math.ceil(duration/bucket);
      const points = Array.from({length:count},(_,index) => {
        const requests = index%6 === 0 ? 0 : (productId === 'mobile' ? 6 : 11)+index%13;
        const uploadBytes = requests*1731;
        const downloadBytes = requests*(8200+index%91*101);
        return {at:new Date(start+index*bucket).toISOString(),totalBytes:uploadBytes+downloadBytes,uploadBytes,downloadBytes,requests};
      });
      const summary = points.reduce((sum,point) => ({
        totalBytes:sum.totalBytes+point.totalBytes,
        uploadBytes:sum.uploadBytes+point.uploadBytes,
        downloadBytes:sum.downloadBytes+point.downloadBytes,
        requests:sum.requests+point.requests
      }),{totalBytes:0,uploadBytes:0,downloadBytes:0,requests:0});
      summary.rateLimitedRequests = Math.floor(summary.requests/110);
      summary.successfulRequests = Math.floor(summary.requests*0.917);
      const us = Math.floor(summary.totalBytes*0.64);
      const sg = Math.floor(summary.totalBytes*0.27);
      const countries = [{code:'US',bytes:us},{code:'SG',bytes:sg},{code:'DE',bytes:summary.totalBytes-us-sg}];
      const domainCount = Math.min(38,summary.requests);
      const share = (value,index) => Math.floor(value/domainCount) + (index < value%domainCount ? 1 : 0);
      const domains = Array.from({length:domainCount},(_,index) => ({
        host:`service-${String(index+1).padStart(2,'0')}.example:443`,
        requests: share(summary.requests,index),
        successfulRequests: share(summary.successfulRequests,index),
        totalBytes: share(summary.totalBytes,domainCount-1-index)
      }));
      return {notice:floatingFormat,summary,points,countries,domains};
    },
    loadUnlimitedKeys() {
      return {
        notice: '密钥列表示例，仅用于预览。',
        keys: [
          {id:'sample-current',label:'示例密钥 ••••01',status:'使用中',purchasedAt:'2026-11-18T17:00:00Z'},
          {id:'sample-past',label:'示例密钥 ••••02',status:'已到期',purchasedAt:'2026-11-16T13:30:00Z'}
        ]
      };
    },
    loadUnlimitedUsage({keyId, range}) {
      if (keyId === 'sample-past') {
        return {notice:floatingFormat,totalBytes:0,uploadBytes:0,downloadBytes:0,averageMbps:0,peakMbps:0,maxConnections:0,points:[]};
      }
      const rangeHours = {'1h':1,'2h':2,'24h':24,'3d':72}[range];
      const samples = [5,7,6,12,10,8,15,9,17,13,7,11];
      const points = samples.map((amount,index) => ({
        at: new Date(end + 19*3600000 - rangeHours*3600000*(1-index/(samples.length-1))).toISOString(),
        bandwidthMbps:amount, downloadMbps:amount*0.8, uploadMbps:amount*0.2,
        maxConnections:amount*2, activeConnections:amount
      }));
      const averageMbps = samples.reduce((sum,value) => sum+value,0)/samples.length;
      const totalBytes = Math.round(averageMbps*1000000*rangeHours*3600/8);
      const uploadBytes = Math.round(totalBytes*0.2);
      return {notice:floatingFormat,totalBytes,uploadBytes,downloadBytes:totalBytes-uploadBytes,
        averageMbps,peakMbps:Math.max(...samples),maxConnections:Math.max(...samples)*2,points};
    }
  };

  const page = document.querySelector('main[data-workspace-page="usage"]');
  if (!page) return;
  const $ = selector => page.querySelector(selector);
  const type = $('#usage-type'), mode = $('#usage-mode'), exportButton = $('#usage-export');
  const rangeButtons = [...page.querySelectorAll('[data-usage-days]')];
  const svgNS = 'http://www.w3.org/2000/svg';
  const labels = { residential: '住宅流量', mobile: '移动流量' };
  let sampleMode = true, days = 7;
  const rows = () => sampleRows(type.value, days);
  const amountGB = value => (value / 1000).toFixed(3);
  function svgElement(tag, attributes, text) {
    const element = document.createElementNS(svgNS, tag);
    Object.entries(attributes).forEach(([name,value]) => element.setAttribute(name, String(value)));
    if (text !== undefined) element.textContent = text;
    return element;
  }
  function drawChart(data, total, peak) {
    const grid = $('#usage-grid'), axis = $('#usage-axis');
    grid.replaceChildren(); axis.replaceChildren();
    const left = 58, right = 735, top = 26, bottom = 234;
    const scaleMax = Math.max(100, Math.ceil(peak.amount / 100) * 100);
    const x = index => left + index * (right - left) / Math.max(1, data.length - 1);
    const y = value => bottom - value * (bottom - top) / scaleMax;
    for (let tick = 0; tick <= 4; tick++) {
      const amount = scaleMax * tick / 4, yy = y(amount);
      grid.append(svgElement('line', {x1:left,y1:yy,x2:right,y2:yy,class:'ws-usage-grid-line'}));
      axis.append(svgElement('text', {x:left-12,y:yy+4,'text-anchor':'end',class:'ws-usage-axis-label'}, (amount/1000).toFixed(2)));
    }
    [0, Math.floor((data.length - 1) / 2), data.length - 1].forEach((index, position) => {
      axis.append(svgElement('text', {x:x(index),y:bottom+27,'text-anchor':position===0?'start':position===2?'end':'middle',class:'ws-usage-axis-label'}, data[index].date.slice(5)));
    });
    const path = data.map((row,index) => `${index?'L':'M'}${x(index).toFixed(2)},${y(row.amount).toFixed(2)}`).join(' ');
    $('#usage-line').setAttribute('d', path);
    $('#usage-area').setAttribute('d', `${path} L${right},${bottom} L${left},${bottom} Z`);
    const peakIndex = data.findIndex(row => row.amount === peak.amount);
    $('#usage-peak-dot').setAttribute('cx', x(peakIndex));
    $('#usage-peak-dot').setAttribute('cy', y(peak.amount));
    $('#usage-chart-title').textContent = `${labels[type.value]} · ${days} 天示例走势`;
    $('#usage-chart-desc').textContent = `区间总用量 ${amountGB(total)} GB，单日峰值 ${amountGB(peak.amount)} GB，发生于 ${peak.date}。每日数值见下方明细。`;
  }
  function render(announce = true) {
    const data = rows(), total = data.reduce((sum,row) => sum + row.amount, 0);
    const peak = data.reduce((best,row) => row.amount > best.amount ? row : best, data[0]);
    const active = data.filter(row => row.amount > 0).length;
    mode.setAttribute('aria-pressed', String(sampleMode));
    mode.textContent = sampleMode ? '查看未接入状态' : '查看示例数据';
    $('#usage-preview-note').textContent = sampleMode ? '示例数据 · 非真实账户。图表和记录用于展示统计界面，未查询账户用量。' : '未接入账户数据。请前往原站查看真实用量，当前页面不会读取或更新账户。';
    $('#usage-period').textContent = `${data[0].date} — ${data.at(-1).date}`;
    $('#usage-total').textContent = sampleMode ? amountGB(total) : '—';
    $('#usage-average').textContent = sampleMode ? amountGB(total / days) : '—';
    $('#usage-peak').textContent = sampleMode ? amountGB(peak.amount) : '—';
    $('#usage-peak-date').textContent = sampleMode ? peak.date : '等待用量记录';
    $('#usage-active').textContent = sampleMode ? String(active) : '—';
    $('#usage-active-caption').textContent = sampleMode ? `${days} 天统计区间` : '所选统计区间';
    $('#usage-series-label').textContent = sampleMode ? `${labels[type.value]} · 示例` : '未接入';
    $('#usage-chart-caption').textContent = sampleMode ? '所选区间的每日流量，单位 GB。' : '真实用量尚未接入，图表暂不显示。';
    $('#usage-chart-wrap').hidden = !sampleMode;
    $('#usage-empty').hidden = sampleMode;
    $('#usage-table-wrap').hidden = !sampleMode;
    $('#usage-table-empty').hidden = sampleMode;
    $('#usage-row-count').textContent = sampleMode ? `${data.length} 条示例记录` : '等待用量数据';
    $('#usage-table-total').textContent = sampleMode ? amountGB(total) : '—';
    type.disabled = !sampleMode; exportButton.disabled = !sampleMode;
    rangeButtons.forEach(button => { button.disabled = !sampleMode; button.setAttribute('aria-pressed', String(Number(button.dataset.usageDays) === days)); });
    const body = $('#usage-table-body');body.replaceChildren();
    if (sampleMode) {
      drawChart(data, total, peak);
      data.forEach(row => {
        const tr = document.createElement('tr');
        [row.date, labels[type.value], amountGB(row.amount)].forEach(value => {const cell=document.createElement('td');cell.textContent=value;tr.append(cell);});
        tr.lastElementChild.className = 'ws-records-number';body.append(tr);
      });
    }
    if (announce) $('#usage-status').textContent = sampleMode ? `已显示 ${days} 天${labels[type.value]}示例，合计 ${amountGB(total)} GB。` : '已切换到未接入状态，未查询任何真实账户信息。';
  }
  type.addEventListener('change', () => render());
  rangeButtons.forEach(button => button.addEventListener('click', () => {days=Number(button.dataset.usageDays);render();}));
  mode.addEventListener('click', () => {sampleMode=!sampleMode;render();});
  exportButton.addEventListener('click', () => {
    if (!sampleMode) return;
    if (typeof URL.createObjectURL !== 'function') {$('#usage-status').textContent='当前浏览器不支持本地 CSV 导出，请查看下方每日明细。';return;}
    const data = rows();
    const csvRows = [['数据来源','示例数据 · 非真实账户'],['日期','产品类型','用量（GB）'],...data.map(row=>[row.date,labels[type.value],amountGB(row.amount)])];
    const quote = value => '"' + String(value).replaceAll('"','""') + '"';
    const text = '\uFEFF' + csvRows.map(row=>row.map(quote).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([text],{type:'text/csv;charset=utf-8'}));
    const link = document.createElement('a');link.href=url;link.download=`redrock-sample-usage-${type.value}-${days}d.csv`;document.body.append(link);link.click();link.remove();
    window.setTimeout(()=>URL.revokeObjectURL(url),0);
    $('#usage-status').textContent='已导出当前筛选范围的示例 CSV。文件不包含真实账户数据。';
  });
  render(false);
})();
