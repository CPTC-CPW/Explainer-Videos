// Topic filter for the landing page.
// Each .explainer-card has data-topic; each filter button has data-topic-filter ("all" or a topic).
// This script fills in the counts, hides topics with no explainers, shows or hides cards, and keeps
// the selected topic in the URL as ?topic=<topic> so a filtered list can be shared.
(function () {
  var bar = document.querySelector('[data-filter]');
  if (!bar) return;

  var statusEl = document.querySelector('[data-filter-status]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.explainer-card[data-topic]'));
  var buttons = Array.prototype.slice.call(bar.querySelectorAll('[data-topic-filter]'));

  function cardsFor(topic) {
    if (topic === 'all') return cards;
    return cards.filter(function (c) { return c.dataset.topic === topic; });
  }

  function label(button) {
    return button.querySelector('[data-label]').textContent;
  }

  // Counts; a topic with no explainers yet gets no button.
  buttons.forEach(function (b) {
    var n = cardsFor(b.dataset.topicFilter).length;
    b.querySelector('[data-count]').textContent = n;
    b.hidden = n === 0;
  });
  var topics = buttons.filter(function (b) { return !b.hidden; });

  function select(topic, announce) {
    var shown = cardsFor(topic);
    cards.forEach(function (c) { c.hidden = shown.indexOf(c) === -1; });
    topics.forEach(function (b) {
      b.setAttribute('aria-pressed', b.dataset.topicFilter === topic ? 'true' : 'false');
    });

    var url = new URL(location.href);
    if (topic === 'all') url.searchParams.delete('topic'); else url.searchParams.set('topic', topic);
    if (url.href !== location.href) history.replaceState(null, '', url.href);

    if (announce) {
      var noun = shown.length === 1 ? ' explainer' : ' explainers';
      statusEl.textContent = topic === 'all'
        ? 'Showing all ' + shown.length + noun
        : 'Showing ' + shown.length + ' ' + label(topics.filter(function (b) {
            return b.dataset.topicFilter === topic;
          })[0]) + noun;
    }
  }

  topics.forEach(function (b) {
    b.addEventListener('click', function () { select(b.dataset.topicFilter, true); });
  });

  var wanted = new URLSearchParams(location.search).get('topic');
  var known = topics.some(function (b) { return b.dataset.topicFilter === wanted; });
  select(known ? wanted : 'all', false);
  bar.hidden = false;
})();
