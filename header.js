(function() {
    var el = document.getElementById('shared-header');
    if (!el) return;

    var prefix = el.dataset.prefix || '';

    el.outerHTML =
        '<header class="header">' +
            '<nav class="nav container">' +
                '<a href="' + prefix + '/" class="logo">Nobodies Collective</a>' +
                '<button class="nav-toggle" aria-label="Toggle navigation">' +
                    '<span></span><span></span><span></span>' +
                '</button>' +
                '<ul class="nav-links">' +
                    '<li class="nav-dropdown">' +
                        '<a href="' + prefix + '/#event">Event <svg class="nav-chevron" width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></a>' +
                        '<ul class="nav-dropdown-menu">' +
                            '<li><a href="' + prefix + '/art-grants.html">Art Grants</a></li>' +
                            '<li><a href="' + prefix + '/consent.html">Consent</a></li>' +
                            '<li><a href="' + prefix + '/survival-guide.html">Survival Guide</a></li>' +
                        '</ul>' +
                    '</li>' +
                    '<li><a href="' + prefix + '/#principles">Principles</a></li>' +
                    '<li><a href="' + prefix + '/faq.html">FAQ</a></li>' +
                    '<li><a href="' + prefix + '/transparency.html">Transparency</a></li>' +
                    '<li><a href="' + prefix + '/#useful-links">Links</a></li>' +
                    '<li><a href="https://tickets.nobodies.team/events/nobodiescollective/2089167" class="btn btn-primary btn-nav" target="_blank" rel="noopener noreferrer">Tickets</a></li>' +
                '</ul>' +
            '</nav>' +
        '</header>';
})();
