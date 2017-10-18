// https://github.com/tamirz/ngGridFlexibleHeightPlugin
// edited by Marc to make sure heights are not undefined

function ngGridFlexibleHeightPlugin(opts) {
    var self = this;
    self.grid = null;
    self.scope = null;
    self.init = function (scope, grid, services) {
        self.domUtilityService = services.DomUtilityService;
        self.grid = grid;
        self.scope = scope;
        var recalcHeightForData = function () { setTimeout(innerRecalcForData, 1); };
        var innerRecalcForData = function () {
            var gridId = self.grid.gridId,
                footerPanelSel = '.' + gridId + ' .ngFooterPanel',
                footerPanelSelHeight = $(footerPanelSel).height() || 0,
                topPanelHeight = !$.isEmptyObject(self.grid.$topPanel) && self.grid.$topPanel.height() ? self.grid.$topPanel.height() : 0,
                topCanvasHeight = !$.isEmptyObject(self.grid.$canvas) && self.grid.$canvas.height() ? self.grid.$canvas.height() : 0,
                extraHeight = topPanelHeight + footerPanelSelHeight,
                naturalHeight = topCanvasHeight + 1,
                newViewportHeight;

            if (opts != null) {
                if (opts.minHeight != null && (naturalHeight + extraHeight) < opts.minHeight) {
                    naturalHeight = opts.minHeight - extraHeight - 2;
                }
                if (opts.maxHeight != null && (naturalHeight + extraHeight) > opts.maxHeight) {
                    naturalHeight = opts.maxHeight;
                }
            }

            newViewportHeight = naturalHeight + 3; 

            if (!self.scope.baseViewportHeight || self.scope.baseViewportHeight !== newViewportHeight) {
                self.grid.$viewport.css('height', newViewportHeight + 'px');
                self.grid.$root.css('height', (newViewportHeight + extraHeight) + 'px');
                self.scope.baseViewportHeight = newViewportHeight;
                self.domUtilityService.RebuildGrid(self.scope, self.grid);
            }
        };
        self.scope.catHashKeys = function () {
            var hash = '',
            idx;
            for (idx in self.scope.renderedRows) {
                hash += self.scope.renderedRows[idx].$$hashKey;
            }
            return hash;
        };
        self.scope.$watch('catHashKeys()', innerRecalcForData);
        self.scope.$watch(self.grid.config.data, recalcHeightForData);
    };
}
