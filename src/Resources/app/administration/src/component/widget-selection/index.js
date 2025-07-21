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
        const {
            widgetId,
            propertyId
        } = await this.getCurrentValues();

        this.iframeUrl = BASE_URL +
            '/generic/widgets?currentWidgetId=' + widgetId +
            '&currentPageId=' + propertyId +
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
            const config = await this.systemConfigApiService.getValues('TawktoWidget.config');

            return {
                widgetId : config['TawktoWidget.config.widgetId'] || '',
                propertyId : config['TawktoWidget.config.propertyId'] || ''
            };
        },
        async setWidget(e) {
            return this.systemConfigApiService.saveValues({
                'TawktoWidget.config.propertyId' : e.data.pageId,
                'TawktoWidget.config.widgetId' : e.data.widgetId
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
                'TawktoWidget.config.propertyId' : null,
                'TawktoWidget.config.widgetId' : null
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
