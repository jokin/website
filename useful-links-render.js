(function () {
    var container = document.getElementById('useful-links-content');
    if (!container || typeof USEFUL_LINKS_CATEGORIES === 'undefined') return;

    var html = '';

    USEFUL_LINKS_CATEGORIES.forEach(function (category) {
        html += '<div class="useful-links-category anim anim-fade-up">';
        html += '<h3 class="useful-links-category-title">' + category.label + '</h3>';
        html += '<div class="useful-links-grid">';

        category.cards.forEach(function (card) {
            var isDisabled = card.comingSoon || !card.url;
            var classes = 'link-card';
            if (card.featured) classes += ' link-card--featured';
            if (isDisabled) classes += ' link-card--disabled';
            var accentAttr = ' style="--card-accent: ' + card.accent + '"';

            if (!isDisabled) {
                html += '<a href="' + card.url + '" class="' + classes + '"' + accentAttr + ' target="_blank" rel="noopener noreferrer">';
            } else {
                html += '<div class="' + classes + '"' + accentAttr + '>';
            }

            html += '<span class="link-card-icon" aria-hidden="true">' + card.icon + '</span>';
            html += '<div class="link-card-body">';
            html += '<h4 class="link-card-title">' + card.title + '</h4>';
            html += '<p class="link-card-desc">' + card.description + '</p>';

            if (card.note) {
                html += '<span class="link-card-note">' + card.note + '</span>';
            }
            if (isDisabled) {
                html += '<span class="link-card-badge">Coming soon</span>';
            }

            html += '</div>';

            if (!isDisabled) {
                html += '</a>';
            } else {
                html += '</div>';
            }
        });

        html += '</div>';
        html += '</div>';
    });

    container.innerHTML = html;
})();
