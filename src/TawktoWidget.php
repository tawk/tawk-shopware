<?php declare(strict_types=1);

namespace Tawk;

use Shopware\Core\Framework\Plugin;
use Shopware\Core\Framework\Plugin\Context\UninstallContext;
use Shopware\Core\System\SystemConfig\SystemConfigService;

use Tawk\Service\TawkWidgetConfig;

class TawktoWidget extends Plugin
{
    public function uninstall(UninstallContext $uninstallContext): void
    {
        parent::uninstall($uninstallContext);

        if ($uninstallContext->keepUserData()) {
            return;
        }

        $this->getTawkWidgetConfig()->removeConfig();
    }

    private function getTawkWidgetConfig(): TawkWidgetConfig
    {
        if ($this->container->has(TawkWidgetConfig::class)) {
            return $this->container->get(TawkWidgetConfig::class);
        }

        return new TawkWidgetConfig(
            $this->container->get(SystemConfigService::class)
        );
    }
}
