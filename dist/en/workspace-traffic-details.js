(() => {
  'use strict';

  const day = 86_400_000;
  const offset = 8 * 3_600_000;
  const domainLimit = 500;
  const byteKeys = ['totalBytes', 'downloadBytes', 'uploadBytes'];
  const countryColors = ['#f28187', '#f5af78', '#a9a9ff', '#7dd4cf', '#e693c3', '#bac789', '#d8b6a4', '#85b6e5'];
  const isCount = value => Number.isSafeInteger(value) && value >= 0;

  window.RedRockTrafficDetails = ({productId, release, preview, loadDaily, drawChart, byteLabel, appendRow, number}) => {
    const $ = id => document.getElementById(id);
    const root = $('traffic-analytics');
    if (!root) return null;
    const method = 'loadTrafficDetails';
    const load = release?.has(method) ? query => release.call(method,query) : preview?.[method];
    if (!load && loadDaily) {
      root.hidden = true;
      $('traffic-daily-fallback').hidden = false;
      return null;
    }

    const form = $('traffic-detail-query');
    const from = $('traffic-detail-from');
    const to = $('traffic-detail-to');
    const interval = $('traffic-detail-interval');
    const status = $('traffic-detail-status');
    const sort = $('traffic-detail-sort');
    const size = $('traffic-detail-page-size');
    const prev = $('traffic-detail-prev');
    const next = $('traffic-detail-next');
    const chartToggles = [...root.querySelectorAll('[data-traffic-detail-chart]')];
    const language = document.documentElement.lang;
    const percentage = new Intl.NumberFormat(language, {style:'percent',maximumFractionDigits:1});
    const regions = new Intl.DisplayNames([language],{type:'region'});
    const table = $('traffic-detail-domain-table');
    let content = null;
    let index = 0;
    let chart = 'bytes';
    let started = false;
    let request = 0;

    const localInput = time => new Date(time + offset).toISOString().slice(0,16);
    const fromLocalInput = value => value ? Date.parse(value + '+08:00') : NaN;
    const now = Date.now();
    from.value = localInput(now - 7*day);
    to.value = localInput(now);
    for (const element of form.elements) element.disabled = !load;

    function normalize(response) {
      const {summary, points, countries, domains} = response || {};
      const counters = [...byteKeys, 'requests','successfulRequests','rateLimitedRequests'];
      if (!counters.every(key => isCount(summary?.[key])) ||
          summary.successfulRequests > summary.requests || summary.rateLimitedRequests > summary.requests ||
          ![points,countries,domains].every(Array.isArray)) throw new Error('Invalid traffic details');

      const series = points.map(point => ({...point, time:Date.parse(point?.at)}));
      if (series.some(point => !Number.isFinite(point.time) || ![...byteKeys,'requests'].every(key => isCount(point[key])))) {
        throw new Error('Invalid traffic series');
      }
      series.sort((a,b) => a.time-b.time);
      const countryRows = countries.filter(row => typeof row?.code === 'string' && /^[A-Z]{2}$/.test(row.code) && isCount(row.bytes) && row.bytes > 0);
      countryRows.sort((a,b) => b.bytes-a.bytes);
      const domainRows = domains.slice(0,domainLimit).filter(row =>
        typeof row?.host === 'string' && row.host.trim() && ['successfulRequests','totalBytes','requests'].every(key => isCount(row[key])));
      return {summary,series,countryRows,domainRows,notice:typeof response.notice === 'string' ? response.notice : ''};
    }

    function showTrend() {
      const series = content?.series || [];
      const traffic = chart === 'bytes';
      for (const toggle of chartToggles) {
        toggle.disabled = !series.length;
        toggle.setAttribute('aria-pressed',String(toggle.dataset.trafficDetailChart === chart));
      }
      $('traffic-detail-traffic-legend').hidden = !series.length || !traffic;
      $('traffic-detail-requests-legend').hidden = !series.length || traffic;
      $('traffic-detail-no-trend').hidden = Boolean(series.length);
      drawChart('traffic-detail-trend',series,traffic ? byteKeys : ['requests'],
        traffic ? byteLabel : value => number.format(value));
    }

    function showCountries() {
      const rows = content?.countryRows || [];
      const list = $('traffic-detail-countries');
      const donut = $('traffic-detail-donut');
      const total = rows.reduce((sum,row) => sum+row.bytes,0);
      $('traffic-detail-no-countries').hidden = Boolean(total);
      donut.hidden = !total;
      list.replaceChildren();
      if (!total) return;
      const stops = [];
      let degrees = 0;
      rows.forEach((row,index) => {
        const color = countryColors[index % countryColors.length];
        const end = index === rows.length-1 ? 360 : Math.min(360,degrees + 360*row.bytes/total);
        const entry = document.createElement('li');
        const swatch = document.createElement('i');
        swatch.setAttribute('aria-hidden','true');
        swatch.style.backgroundColor = color;
        const label = document.createElement('span');
        const name = row.code === 'ZZ' ? 'Unknown region' : regions.of(row.code);
        label.textContent = name + ' · ' + byteLabel(row.bytes);
        const share = document.createElement('strong');
        share.textContent = percentage.format(row.bytes/total);
        entry.append(swatch,label,share);
        list.append(entry);
        stops.push(`${color} ${degrees}deg ${end}deg`);
        degrees = end;
      });
      donut.style.backgroundImage = 'conic-gradient(' + stops.join(',') + ')';
    }

    function showDomains() {
      const domains = content?.domainRows || [];
      const hasDomains = Boolean(domains.length);
      const count = Number(size.value);
      const pages = Math.max(1,Math.ceil(domains.length/count));
      index = Math.min(index,pages-1);
      const sorted = [...domains].sort((a,b) => b[sort.value]-a[sort.value] || a.host.localeCompare(b.host,language));
      const body = $('traffic-detail-domain-rows');
      body.replaceChildren();
      for (const row of sorted.slice(index*count,(index+1)*count)) {
        appendRow(body,[row.host,number.format(row.successfulRequests),byteLabel(row.totalBytes),number.format(row.requests)]);
      }
      table.hidden = !hasDomains;
      table.scrollTop = 0;
      $('traffic-detail-no-domains').hidden = hasDomains;
      $('traffic-detail-pagination').hidden = !hasDomains;
      $('traffic-detail-domain-count').textContent = `${number.format(domains.length)} hosts (up to 500)`;
      $('traffic-detail-page').textContent = `${index+1} / ${pages}`;
      prev.disabled = index === 0;
      next.disabled = index+1 >= pages;
      sort.disabled = !hasDomains;
    }

    function render() {
      const summary = content?.summary;
      $('traffic-detail-total').textContent = summary ? byteLabel(summary.totalBytes) : '—';
      $('traffic-detail-directions').textContent = summary ? '↑ ' + byteLabel(summary.uploadBytes) + ' / ↓ ' + byteLabel(summary.downloadBytes) : '';
      $('traffic-detail-requests').textContent = summary ? number.format(summary.requests) : '—';
      $('traffic-detail-rate').textContent = summary?.requests ? percentage.format(summary.successfulRequests/summary.requests) : '—';
      $('traffic-detail-limited').textContent = summary ? number.format(summary.rateLimitedRequests) : '—';
      showTrend();
      showCountries();
      showDomains();
    }

    async function submit() {
      if (!load || !form.reportValidity()) return;
      const start = fromLocalInput(from.value);
      const end = fromLocalInput(to.value);
      if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start || end-start > 30*day) {
        status.textContent = 'Choose a valid range of up to 30 days. End time must be after the start time.';
        return;
      }
      const current = ++request;
      started = true;
      content = null;
      index = 0;
      render();
      status.textContent = 'Loading traffic usage…';
      $('traffic-detail-data').setAttribute('aria-busy','true');
      try {
        const query = {productId,from:new Date(start).toISOString(),to:new Date(end).toISOString(),interval:interval.value};
        const response = await load(query);
        if (current !== request) return;
        content = normalize(response);
        render();
        status.textContent = content.notice;
      } catch {
        if (current === request) status.textContent = 'Could not load traffic usage. Try again.';
      } finally {
        if (current === request) $('traffic-detail-data').removeAttribute('aria-busy');
      }
    }

    form.addEventListener('submit', event => {
      event.preventDefault();
      submit();
    });
    $('traffic-detail-refresh').addEventListener('click',submit);
    interval.addEventListener('change',submit);
    for (const toggle of chartToggles) {
      toggle.addEventListener('click',() => {
        chart = toggle.dataset.trafficDetailChart;
        showTrend();
      });
    }
    for (const field of [sort,size]) {
      field.addEventListener('change',() => {
        index = 0;
        showDomains();
      });
    }
    prev.addEventListener('click',() => {
      --index;
      showDomains();
    });
    next.addEventListener('click',() => {
      ++index;
      showDomains();
    });
    return {activate:() => {
      if (load && !started) submit();
    }};
  };
})();
