const BASE_URL = 'https://plugins.tawk.to';

Shopware.Component.register('tawk-widget-selection', {
    template : `
        <div>
            <iframe
                id="tawk_widget_customization"
                ref="tawkIframe"
                style="border:none; width:100%; margin: 0; padding: 0; margin-top: 24px; min-height: 300px"
                :src="iframeUrl">
            </iframe>
        </div>
    `,
    inject : ['systemConfigApiService'],
    data() {
        return {
            iframeUrl: ''
        };
    },
    async created() {
        const currentValues = await this.getCurrentValues();
        const widgetId = currentValues['TawkWidget.config.widgetId'] || '';
        const pageId = currentValues['TawkWidget.config.pageId'] || '';

        this.iframeUrl = BASE_URL +
            '/generic/widgets?currentWidgetId=' + widgetId +
            '&currentPageId=' + pageId +
            '&transparentBackground=1&pltf=shopware&pltfv=' + Shopware.Context.app.config.version +
            '&parentDomain=' + window.location.origin;
    },
    mounted() {
        window.addEventListener('message', (e) => {
            if (e.origin !== BASE_URL) {
                return;
            }
            if (e.data.action === 'setWidget') {
                this.setWidget(e);
            }
            if (e.data.action === 'removeWidget') {
                this.removeWidget(e);
            }
            if (e.data.action === 'reloadHeight') {
                this.reloadHeight(e);
            }
        });
    },
    methods : {
        async getCurrentValues() {
            return this.systemConfigApiService.getValues('TawkWidget.config');
        },
        async setWidget(e) {
            return this.systemConfigApiService.saveValues({
                'TawkWidget.config.pageId' : e.data.pageId,
                'TawkWidget.config.widgetId' : e.data.widgetId
            }).then(() => {
                e.source.postMessage({
                    action : 'setDone'
                }, BASE_URL);
            }).catch((error) => {
                console.error(error);

                e.source.postMessage({
                    action : 'setFail'
                }, BASE_URL);
            });
        },
        async removeWidget(e) {
            return this.systemConfigApiService.saveValues({
                'TawkWidget.config.pageId' : '',
                'TawkWidget.config.widgetId' : ''
            }).then(() => {
                e.source.postMessage({
                    action : 'removeDone'
                }, BASE_URL);
            }).catch((error) => {
                console.error(error);

                e.source.postMessage({
                    action : 'removeFail'
                }, BASE_URL);
            });
        },
        reloadHeight(e) {
            const height = e.data.height;

            if (!height) {
                return;
            }

            if (!this.$refs.tawkIframe.style.height.endsWith('px')) {
                return;
            }

            if (height.toString() === this.$refs.tawkIframe.style.height.replace('px', '')) {
                return;
            }

            this.$refs.tawkIframe.style.height = height + 'px';
        }
    }
});
