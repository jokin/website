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
                    '<li><a href="' + prefix + '/#event">Event</a></li>' +
                    '<li><a href="' + prefix + '/#principles">Principles</a></li>' +
                    '<li><a href="' + prefix + '/faq.html">FAQ</a></li>' +
                    '<li><a href="' + prefix + '/transparency.html">Transparency</a></li>' +
                    '<li><a href="' + prefix + '/#useful-links">Links</a></li>' +
                    '<li><a href="' + prefix + '/#tickets" class="btn btn-primary btn-nav">Get Tickets</a></li>' +
                '</ul>' +
            '</nav>' +
        '</header>';
})();
