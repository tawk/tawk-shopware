<?php declare(strict_types=1);

namespace Tawk\Subscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Shopware\Core\System\SystemConfig\SystemConfigService;
use Shopware\Storefront\Event\StorefrontRenderEvent;

class TawkWidgetSubscriber implements EventSubscriberInterface
{
    private SystemConfigService $systemConfigService;

    public function __construct(SystemConfigService $systemConfigService)
    {
        $this->systemConfigService = $systemConfigService;
    }

    public static function getSubscribedEvents(): array
    {
        return [
            StorefrontRenderEvent::class => 'onStorefrontRender'
        ];
    }

    public function onStorefrontRender(StorefrontRenderEvent $event): void
    {
        $config = $this->systemConfigService->get('TawkWidget.config');

        $widgetId = $config['widgetId'] ?? null;
        $pageId = $config['pageId'] ?? null;

        $event->setParameter('widget_id', $widgetId);
        $event->setParameter('page_id', $pageId);
    }
}
