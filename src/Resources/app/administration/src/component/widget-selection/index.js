const BASE_URL = 'https://plugins.tawk.to';

Shopware.Component.register('tawk-widget-selection', {
    template : `
        <div>
            <iframe
                id="tawk_widget_customization"
                ref="tawkIframe"
                style="border:none; width:100%; margin: 0; padding: 0; margin-top: 24px; min-height: 300px"
                :src="baseUrl + '/generic/widgets?currentWidgetId=' + widgetId + '&currentPageId=' + pageId + '&transparentBackground=1&pltf=shopware&pltfv=' + platformVersion + '&parentDomain=' + hostname">
            </iframe>
        </div>
    `,
    inject : ['systemConfigApiService'],
    data() {
        return {
            baseUrl : BASE_URL,
            platformVersion : Shopware.Context.app.config.version,
            hostname : window.location.origin,
            widgetId : '',
            pageId : ''
        }
    },
    async created() {
        const currentValues = await this.getCurrentValues();

        this.widgetId = currentValues['TawkWidget.config.widgetId'];
        this.pageId = currentValues['TawkWidget.config.pageId'];
    },
    mounted() {
        window.addEventListener('message', (e) => {
            if (e.origin === BASE_URL) {
                if (e.data.action === 'setWidget') {
                    this.setWidget(e);
                }
                if (e.data.action === 'removeWidget') {
                    this.removeWidget(e);
                }
                if (e.data.action === 'reloadHeight') {
                    this.reloadHeight(e);
                }
            }
        });
    },
    methods : {
        async getCurrentValues() {
            return this.systemConfigApiService.getValues('TawkWidget.config');
        },
        async setWidget(e) {
            await this.systemConfigApiService.saveValues({
                'TawkWidget.config.pageId' : e.data.pageId
            });
            await this.systemConfigApiService.saveValues({
                'TawkWidget.config.widgetId' : e.data.widgetId
            });

            e.source.postMessage({
                action : 'setDone'
            }, BASE_URL);
        },
        async removeWidget(e) {
            await this.systemConfigApiService.saveValues({
                'TawkWidget.config.pageId' : ''
            });
            await this.systemConfigApiService.saveValues({
                'TawkWidget.config.widgetId' : ''
            });

            e.source.postMessage({
                action : 'removeDone'
            }, BASE_URL);
        },
        reloadHeight(e) {
            const height = e.data.height;

            if (!height) {
                return;
            }

            if (height.toString() === this.$refs.tawkIframe.style.height.replace('px', '')) {
                return;
            }

            this.$refs.tawkIframe.style.height = height + 'px';
        }
    }
});
