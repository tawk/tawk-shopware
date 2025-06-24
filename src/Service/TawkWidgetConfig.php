<?php declare(strict_types=1);

namespace Tawk\Service;

use Shopware\Core\System\SystemConfig\SystemConfigService;

class TawkWidgetConfig
{
    private SystemConfigService $_systemConfigService;

    public function __construct(SystemConfigService $systemConfigService)
    {
        $this->_systemConfigService = $systemConfigService;
    }

    public function getConfig(): array
    {
        return $this->_systemConfigService->get('TawkWidget.config');
    }

    public function removeConfig(): void
    {
        $this->_systemConfigService->delete('TawkWidget.config.propertyId');
        $this->_systemConfigService->delete('TawkWidget.config.widgetId');
    }
}
