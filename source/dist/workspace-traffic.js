(() => {
  'use strict';

  function init() {
    const page = document.querySelector('main[data-workspace-page="service"]');
    const tablist = page?.querySelector('.service-tabs');
    if (!tablist) return;
    const $ = id => document.getElementById(id);
    const productId = page.dataset.serviceProduct;
    const unlimited = productId === 'unlimited';
    const release = window.RedRockRelease;
    const preview = window.RedRockUsagePreview;
    const method = unlimited ? 'loadUnlimitedUsage' : 'loadUsage';
    const load = release?.has(method) ? data => release.call(method, data) : preview?.[method];
    const loadKeys = release?.has('loadUnlimitedKeys')
      ? () => release.call('loadUnlimitedKeys', {})
      : preview?.loadUnlimitedKeys;
    const tabs = [...tablist.querySelectorAll('[role="tab"]')];
    const ranges = [...page.querySelectorAll('[data-traffic-range]')];
    const results = $('traffic-results');
    const status = $('traffic-status');
    const refresh = $('traffic-refresh');
    const keySelect = $('traffic-key');
    const number = new Intl.NumberFormat(document.documentElement.lang, {maximumFractionDigits: 3});
    const dateTime = new Intl.DateTimeFormat(document.documentElement.lang, {
      timeZone: 'Asia/Shanghai', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
    });
    let range = ranges[0].dataset.trafficRange;
    let generation = 0;
    let loaded = false;
    let keysRequest;
    tablist.hidden = false;

    function appendRow(parent, values) {
      const row = document.createElement('tr');
      for (const value of values) {
        const cell = document.createElement('td');
        cell.textContent = value;
        row.append(cell);
      }
      parent.append(row);
    }

    function updateKeys() {
      if (keysRequest || !loadKeys) return;
      const info = $('traffic-key-status');
      info.textContent = '正在加载密钥列表…';
      keysRequest = Promise.resolve().then(loadKeys).then(response => {
        if (!Array.isArray(response?.keys)) throw new Error('Invalid key list');
        const keys = response.keys.filter(key => typeof key?.id === 'string' && key.id && typeof key.label === 'string');
        for (const key of keys) {
          const option = document.createElement('option');
          option.value = key.id;
          option.textContent = key.label;
          keySelect.append(option);
          const stamp = new Date(key.purchasedAt ?? NaN);
          appendRow($('traffic-key-rows'), [
            key.label, typeof key.status === 'string' ? key.status : '—',
            Number.isFinite(stamp.valueOf()) ? dateTime.format(stamp) : '—'
          ]);
        }
        keySelect.disabled = !load || !keys.length;
        $('traffic-key-results').hidden = !keys.length;
        info.textContent = keys.length ? (response.notice || '') : '暂无已购买的密钥。';
      }).catch(() => {
        keysRequest = null;
        info.textContent = '密钥列表加载失败，请稍后重试。';
      });
    }

    function renderDaily(response) {
      if (!Array.isArray(response?.rows)) throw new Error('Invalid traffic rows');
      const rows = [...response.rows];
      if (rows.some(row => !/^\d{4}-\d{2}-\d{2}$/.test(row?.date) || !validNumber(row.gb))) {
        throw new Error('Invalid traffic row');
      }
      if (!rows.length) {
        status.textContent = '所选范围内暂无流量记录。';
        return;
      }
      const total = rows.reduce((sum, row) => sum + row.gb, 0);
      $('traffic-total').textContent = number.format(total) + ' GB';
      const body = $('traffic-rows');
      body.replaceChildren();
      rows.sort((a,b) => b.date.localeCompare(a.date));
      for (const row of rows) appendRow(body, [row.date, number.format(row.gb)]);
      results.hidden = false;
      status.textContent = response.notice || '';
    }

    function validNumber(value) {
      return Number.isFinite(value) && value >= 0;
    }

    function byteLabel(bytes) {
      const units = ['B', 'KB', 'MB', 'GB', 'TB'];
      let index = 0;
      while (bytes >= 1000 && index < units.length - 1) {
        bytes /= 1000;
        index++;
      }
      return number.format(bytes) + ' ' + units[index];
    }

    function drawChart(id, points, keys, formatTick = value => number.format(value), minimumScale = 4) {
      const parent = $(id);
      parent.replaceChildren();
      if (!points.length) return;
      const width = 540, height = 206, left = 55, right = 503, top = 12, bottom = 168;
      const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
      svg.setAttribute('role','img');
      svg.setAttribute('aria-labelledby',id + '-title');
      const add = (tag, attributes, value) => {
        const node = document.createElementNS(svg.namespaceURI,tag);
        for (const [name, attribute] of Object.entries(attributes)) node.setAttribute(name,attribute);
        if (value !== undefined) node.textContent = value;
        svg.append(node);
      };
      const maximum = points.reduce((max,point) => keys.reduce((m,key) => Math.max(m,point[key]),max),0);
      const scale = Math.max(minimumScale, Math.ceil(maximum/4)*4);
      for (let tick = 0; tick <= 4; tick++) {
        const y = bottom - tick/4*(bottom-top);
        add('line',{x1:left,x2:right,y1:y,y2:y,class:'service-traffic-grid'});
        add('text',{x:left-9,y:y+4,'text-anchor':'end'},formatTick(scale*tick/4));
      }
      const start = points[0].time;
      const period = Math.max(1,points.at(-1).time-start);
      const x = point => points.length === 1 ? (left+right)/2 : left + (point.time-start)/period*(right-left);
      const y = value => bottom - value/scale*(bottom-top);
      const ticks = points.length > 1 ? [0,0.5,1] : [0.5];
      for (const tick of ticks) {
        const time = points.length > 1 ? start + period*tick : start;
        add('text',{x:left + tick*(right-left),y:bottom+23,'text-anchor':'middle'},dateTime.format(time));
      }
      keys.forEach((key,index) => {
        const style = `service-traffic-line service-traffic-series-${index+1}`;
        if (points.length === 1) {
          add('circle',{cx:x(points[0]),cy:y(points[0][key]),r:4,class:style});
        } else {
          add('polyline',{points:points.map(point => `${x(point)},${y(point[key])}`).join(' '),class:style});
        }
      });
      parent.append(svg);
    }

    function renderUnlimited(response) {
      const summaryFields = ['totalBytes','uploadBytes','downloadBytes','averageMbps','peakMbps','maxConnections'];
      const bandwidth = ['bandwidthMbps','downloadMbps','uploadMbps'];
      const connections = ['maxConnections','activeConnections'];
      if (!Array.isArray(response?.points) || !summaryFields.every(field => validNumber(response[field]))) {
        throw new Error('Invalid usage summary');
      }
      const points = response.points.map(point => ({...point,time:Date.parse(point?.at)}));
      if (points.some(point => !Number.isFinite(point.time) || [...bandwidth,...connections].some(key => !validNumber(point[key])))) {
        throw new Error('Invalid trend point');
      }
      points.sort((a,b) => a.time-b.time);
      $('traffic-total').textContent = byteLabel(response.totalBytes);
      $('traffic-directions').textContent = '↑ ' + byteLabel(response.uploadBytes) + ' / ↓ ' + byteLabel(response.downloadBytes);
      $('traffic-average').textContent = number.format(response.averageMbps) + ' Mbps';
      $('traffic-peak').textContent = number.format(response.peakMbps) + ' Mbps';
      $('traffic-max-connections').textContent = number.format(response.maxConnections);
      drawChart('traffic-bandwidth',points,bandwidth);
      drawChart('traffic-connections',points,connections);
      page.querySelector('.service-traffic-charts').hidden = !points.length;
      $('traffic-chart-empty').hidden = Boolean(points.length);
      results.hidden = false;
      status.textContent = response.notice || '';
    }

    async function updateUsage() {
      if (!load) return;
      const request = ++generation;
      loaded = false;
      results.hidden = true;
      status.textContent = '正在加载流量明细…';
      $('traffic-usage').setAttribute('aria-busy','true');
      if (!unlimited) refresh.hidden = true;
      if (unlimited) updateKeys();
      try {
        const input = unlimited ? {keyId:keySelect.value || null, range} : {productId,days:Number(range)};
        const response = await load(input);
        if (request !== generation) return;
        if (unlimited) renderUnlimited(response);
        else renderDaily(response);
        loaded = true;
      } catch {
        if (request !== generation) return;
        status.textContent = '流量明细加载失败，请重试。';
        refresh.hidden = false;
      } finally {
        if (request === generation) $('traffic-usage').removeAttribute('aria-busy');
      }
    }

    const analytics = window.RedRockTrafficDetails?.({
      productId, release, preview, loadDaily: load, drawChart, byteLabel, appendRow, number
    });

    function activate(tab) {
      for (const item of tabs) {
        const selected = item === tab;
        item.setAttribute('aria-selected', String(selected));
        item.tabIndex = selected ? 0 : -1;
        $(item.getAttribute('aria-controls')).hidden = !selected;
      }
      if (tab.id === 'traffic-usage-tab') {
        if (analytics) analytics.activate();
        else if (!loaded) updateUsage();
      }
      if (tab.id === 'traffic-keys-tab') updateKeys();
    }

    function selectTab(tab) {
      const panel = tab.getAttribute('aria-controls');
      const url = new URL(window.location.href);
      if (panel === 'traffic-config' && !['#traffic-usage','#traffic-keys'].includes(url.hash)) {
        activate(tab);
        return;
      }
      url.hash = panel === 'traffic-config' ? '' : panel;
      if (url.href !== window.location.href) window.history.pushState(null,'',url);
      activateFromLocation();
    }

    function activateFromLocation() {
      const tab = tabs.find(item => '#' + item.getAttribute('aria-controls') === window.location.hash);
      activate(tab || tabs[0]);
      const language = document.querySelector('[data-language-switch]');
      if (language) {
        const target = new URL(language.href);
        language.setAttribute('href',target.pathname + target.search + window.location.hash);
      }
    }

    tabs.forEach((tab,index) => {
      tab.addEventListener('click', () => selectTab(tab));
      tab.addEventListener('keydown',event => {
        const target = {
          ArrowRight:(index+1)%tabs.length, ArrowLeft:(index+tabs.length-1)%tabs.length,
          Home:0, End:tabs.length-1
        }[event.key];
        if (target === undefined) return;
        event.preventDefault();
        tabs[target].focus();
        selectTab(tabs[target]);
      });
    });
    for (const button of ranges) {
      button.disabled = !load;
      button.addEventListener('click', () => {
        range = button.dataset.trafficRange;
        for (const item of ranges) item.setAttribute('aria-pressed',String(item === button));
        updateUsage();
      });
    }
    refresh.disabled = !load;
    refresh.addEventListener('click',updateUsage);
    keySelect?.addEventListener('change',updateUsage);
    window.addEventListener('popstate',activateFromLocation);
    window.addEventListener('hashchange',activateFromLocation);
    activateFromLocation();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
