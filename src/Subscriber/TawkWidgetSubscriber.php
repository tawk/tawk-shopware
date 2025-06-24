<?php declare(strict_types=1);

namespace Tawk\Subscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Shopware\Storefront\Event\StorefrontRenderEvent;

use Tawk\Service\TawkWidgetConfig;

class TawkWidgetSubscriber implements EventSubscriberInterface
{
    private TawkWidgetConfig $_tawkWidgetConfig;

    public function __construct(TawkWidgetConfig $tawkWidgetConfig)
    {
        $this->_tawkWidgetConfig = $tawkWidgetConfig;
    }

    public static function getSubscribedEvents(): array
    {
        return [
            StorefrontRenderEvent::class => 'onStorefrontRender'
        ];
    }

    public function onStorefrontRender(StorefrontRenderEvent $event): void
    {
        $config = $this->_tawkWidgetConfig->getConfig();

        if (!is_array($config)) {
            return;
        }

        $widgetId = $config['widgetId'] ?? null;
        $propertyId = $config['propertyId'] ?? null;

        $event->setParameter('widget_id', $widgetId);
        $event->setParameter('property_id', $propertyId);
    }
}
