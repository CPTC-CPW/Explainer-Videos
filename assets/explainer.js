// Step-through engine shared by every explainer.
// Each explainer page contains <section class="step" data-chapter data-chapter-label data-title hidden>
// elements inside [data-explainer]; this script builds the chapter tabs and progress bar,
// wires Back / Next / Replay, arrow-key navigation and #step-N links.
(function () {
  var root = document.querySelector('[data-explainer]');
  if (!root) return;

  var steps = Array.prototype.slice.call(root.querySelectorAll('.step'));
  var total = steps.length;
  var current = -1;

  var tabsEl = document.querySelector('[data-chapters]');
  var segsEl = document.querySelector('[data-segments]');
  var eyebrowEl = document.querySelector('[data-eyebrow]');
  var prevBtn = document.querySelector('[data-prev]');
  var nextBtn = document.querySelector('[data-next]');
  var nextLabel = document.querySelector('[data-next-label]');
  var replayBtn = document.querySelector('[data-replay]');

  // Chapters, in order, with the index of their first step.
  var chapters = [];
  steps.forEach(function (step, i) {
    var n = step.dataset.chapter;
    if (!chapters.length || chapters[chapters.length - 1].n !== n) {
      chapters.push({ n: n, label: step.dataset.chapterLabel, first: i });
    }
  });

  var tabs = chapters.map(function (c) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'tab';
    b.innerHTML = '<span class="mono" style="opacity: 0.7"></span><span></span>';
    b.children[0].textContent = c.n;
    b.children[1].textContent = c.label;
    b.addEventListener('click', function () { go(c.first); });
    tabsEl.appendChild(b);
    return b;
  });

  var segs = steps.map(function (step, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'seg';
    if (i > 0 && step.dataset.chapter !== steps[i - 1].dataset.chapter) b.classList.add('ch-start');
    var label = 'Step ' + (i + 1) + ': ' + step.dataset.title;
    b.setAttribute('aria-label', label);
    b.title = label;
    b.appendChild(document.createElement('span'));
    b.addEventListener('click', function () { go(i); });
    segsEl.appendChild(b);
    return b;
  });

  function stepFromHash() {
    var m = /^#step-(\d+)$/.exec(location.hash);
    return m ? Math.min(total, Math.max(1, parseInt(m[1], 10))) - 1 : 0;
  }

  function go(i, opts) {
    i = Math.max(0, Math.min(total - 1, i));
    if (i === current) return;
    current = i;
    var step = steps[i];

    steps.forEach(function (s, j) { s.hidden = j !== i; });
    tabs.forEach(function (t, j) {
      var active = chapters[j].n === step.dataset.chapter;
      if (active) t.setAttribute('aria-current', 'step'); else t.removeAttribute('aria-current');
    });
    segs.forEach(function (s, j) {
      s.classList.toggle('current', j === i);
      s.classList.toggle('done', j < i);
    });

    eyebrowEl.textContent = step.dataset.chapter + ' · ' + step.dataset.chapterLabel +
      ' — step ' + (i + 1) + ' of ' + total;
    prevBtn.disabled = i === 0;
    nextLabel.textContent = i === total - 1 ? 'Start over' : 'Next';

    if (location.hash !== '#step-' + (i + 1)) {
      history.replaceState(null, '', '#step-' + (i + 1));
    }
    if (!(opts && opts.keepScroll)) window.scrollTo(0, 0);
  }

  function replay() {
    var step = steps[current];
    step.hidden = true;
    void step.offsetWidth; // force a reflow so the CSS animations restart
    step.hidden = false;
  }

  prevBtn.addEventListener('click', function () { go(current - 1); });
  nextBtn.addEventListener('click', function () { go(current === total - 1 ? 0 : current + 1); });
  replayBtn.addEventListener('click', replay);

  document.addEventListener('keydown', function (e) {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    var t = e.target;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); go(current + 1); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(current - 1); }
    else if (e.key === 'Home') { e.preventDefault(); go(0); }
    else if (e.key === 'End') { e.preventDefault(); go(total - 1); }
  });

  window.addEventListener('hashchange', function () { go(stepFromHash()); });

  go(stepFromHash(), { keepScroll: true });
})();
