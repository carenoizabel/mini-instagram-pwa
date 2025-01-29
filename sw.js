import { offlineFallback, warmStrategyCache } from 'workbox-recipes';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { registerRoute } from 'workbox-routing';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';

// Configurando o cache
const pageCache = new CacheFirst({
  cacheName: 'mini-instagram-pwa',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60, 
    }),
  ],
});

// Indicando o cache de página
warmStrategyCache({
  urls: ['/index.html', '/'], 
  strategy: pageCache,
});

// Registrando a rota 
registerRoute(
  ({ request }) => request.mode === 'navigate', 
  pageCache
);

// Configuração para assets 
registerRoute(
    ({ request }) =>  ['style', 'script', 'worker']
    .includes(request.destination),
    new StaleWhileRevalidate({
      cacheName: 'asset-cache',
      plugins: [
        new CacheableResponsePlugin({
          statuses: [0, 200],
        }),
      ],
    })
  );
  
  // Configurando offline fallback
  offlineFallback({
    pageFallback: '/offline.html',
  });
  
  registerRoute(
    ({ request }) => request.destination === 'image',
    new CacheFirst({
      cacheName: 'images',
      plugins: [
        new ExpirationPlugin({ maxAgeSeconds: 60 * 60 * 24 * 30 }),
      ],
    })
  );