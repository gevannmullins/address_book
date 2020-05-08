var Shortcuts = function () {

    /*

     alt + d   = Dashboard Page [Admin + Loyalty]
     alt + c   = Campaigns - List Page [Admin + Loyalty]
     alt + c + n  = Campaign - Creation Page [Loyalty]
     alt + c + h  = Channels Page [Admin + Loyalty]
     alt + c + h + n = Channels Page [Admin + Loyalty]
     alt + p   = Products Page [Loyalty]
     alt + p + n  = Products Page [Loyalty]
     alt + c + u  = Customers Page [Loyalty]
     alt + i + s  = Insights - Store Page [Admin + Loyalty]
     alt + i + c  = Insights - Campaign Page [Admin + Loyalty]
     alt + u   = Users Page [Admin]
     alt + u + n  = Users Page [Admin]
     alt + b + r  = Batch Rewards Page [Admin + Loyalty]
     alt + b + r + n = Batch Rewards Page [Admin + Loyalty]
     alt + s + o  = Store Owners Page [Admin]

     */


    var addGlobalShortcuts = function() {
        Shortcuts.add("alt+n", function (e) {
            $('#btn-create')[0].click();
        }).add("alt+d", function (e) {
            window.location = BASE_URL;
        }).add("alt+c", function (e) {
            window.location = BASE_URL + '/campaigns';
        }).add("alt+n+c", function (e) {
            window.location = BASE_URL + '/campaigns/create';
        }).add("alt+p", function (e) {
            window.location = BASE_URL + '/products';
        }).add("alt+d", function (e) {
            window.location = BASE_URL;
        }).add("alt+d", function (e) {
            window.location = BASE_URL;
        }).add("alt+d", function (e) {
            window.location = BASE_URL;
        });
    }

    return {

        init: function () {
            addGlobalShortcuts();
        },

        add: function (key, callback) {
            Mousetrap.bind(key, function (e) {
                callback();
            });
            return this;
        },

        addCrudShortcut: function (item, route, action) {
            var shortCut = item.id.toString();

            Mousetrap.bind('e ' + shortCut.split('').join(' '), function (e) {
                window.location = BASE_URL + '/' + route + '/' + item.id + '/' + action;
            });
            Mousetrap.bind('o ' + shortCut.split('').join(' '), function (e) {
                window.location = BASE_URL + '/' + route + '/' + item.id + '/overview';
            });
        },

        addModalShortcut: function (item, callback) {
            var shortCut = item.id.toString();
            Mousetrap.bind('e ' + shortCut.split('').join(' '), function (e) {
                callback();
            });
        }
    }

}();

Shortcuts.init();