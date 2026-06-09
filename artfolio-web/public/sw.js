const CACHE_NAME = "artfolio-v3";
const OFFLINE_URL = "/offline";

const STATIC_ASSETS = [
  "/",
  OFFLINE_URL,
  "/manifest.json",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await Promise.allSettled(
        STATIC_ASSETS.map((asset) => cache.add(asset))
      );
    })
  );

  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    )
  );

  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  const isNavigationRequest = event.request.mode === "navigate";

  if (isNavigationRequest) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(
          `
          <!doctype html>
          <html lang="vi">
            <head>
              <meta charset="utf-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <title>Bạn đang ngoại tuyến | Artfolio</title>
              <style>
                * {
                  box-sizing: border-box;
                }

                body {
                  margin: 0;
                  min-height: 100vh;
                  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, "Helvetica Neue", sans-serif;
                  background: #f8fafc;
                  color: #0f172a;
                  text-rendering: optimizeLegibility;
                  -webkit-font-smoothing: antialiased;
                }

                header {
                  height: 72px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  border-bottom: 1px solid #e2e8f0;
                  background: #ffffff;
                }

                .brand {
                  display: flex;
                  align-items: center;
                  gap: 10px;
                  font-weight: 800;
                  color: #0f172a;
                }

                .logo {
                  width: 34px;
                  height: 34px;
                  border-radius: 10px;
                  display: grid;
                  place-items: center;
                  background: #4f46e5;
                  color: white;
                  font-weight: 800;
                }

                main {
                  min-height: calc(100vh - 72px);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  padding: 32px 16px;
                }

                .card {
                  width: 100%;
                  max-width: 520px;
                  text-align: center;
                  padding: 42px 34px;
                  border: 1px solid #e2e8f0;
                  border-radius: 28px;
                  background: #ffffff;
                  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.12);
                }

                .icon {
                  width: 82px;
                  height: 82px;
                  margin: 0 auto 24px;
                  border-radius: 999px;
                  display: grid;
                  place-items: center;
                  background: #f1f5f9;
                  color: #64748b;
                }
                
                .icon svg {
                  width: 42px;
                  height: 42px;
                  stroke: currentColor;
                }

                h1 {
                  margin: 0;
                  font-size: 32px;
                  line-height: 1.35;
                  font-weight: 800;
                  letter-spacing: -0.02em;
                }

                .subtitle {
                  margin: 12px 0 0;
                  color: #64748b;
                  font-size: 16px;
                }

                .desc {
                  margin: 26px auto 0;
                  max-width: 360px;
                  color: #334155;
                  line-height: 1.7;
                  font-size: 15px;
                }

                .actions {
                  display: flex;
                  justify-content: center;
                  gap: 12px;
                  flex-wrap: wrap;
                  margin-top: 28px;
                }

                button,
                a {
                  border: 0;
                  border-radius: 12px;
                  padding: 12px 20px;
                  font-weight: 700;
                  font-size: 15px;
                  cursor: pointer;
                  text-decoration: none;
                }

                button {
                  background: #4f46e5;
                  color: white;
                }

                a {
                  border: 1px solid #cbd5e1;
                  color: #0f172a;
                  background: white;
                }

                .tips {
                  margin: 34px auto 0;
                  max-width: 330px;
                  text-align: left;
                  padding: 18px 20px;
                  border-radius: 16px;
                  border: 1px solid #e2e8f0;
                  background: #f8fafc;
                  color: #64748b;
                  font-size: 14px;
                  line-height: 1.8;
                }

                .tips strong {
                  color: #0f172a;
                }
              </style>
            </head>

            <body>
              <header>
                <div class="brand">
                  <div class="logo">A</div>
                  <span>Artfolio</span>
                </div>
              </header>

              <main>
                <section class="card">
                  <div class="icon" aria-hidden="true">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M12 20h.01" />
                      <path d="M8.5 16.5a5 5 0 0 1 7 0" />
                      <path d="M5 13a10 10 0 0 1 3.3-2.2" />
                      <path d="M15.7 10.8A10 10 0 0 1 19 13" />
                      <path d="M2 8.8a15 15 0 0 1 4.8-3" />
                      <path d="M12 5a15 15 0 0 1 10 3.8" />
                      <path d="M2 2l20 20" />
                    </svg>
                  </div>

                  <h1>Bạn đang ngoại tuyến</h1>

                  <p class="subtitle">
                    Vui lòng kiểm tra kết nối Internet của bạn
                  </p>

                  <p class="desc">
                    Artfolio hiện không thể kết nối mạng. Hãy bật lại Internet rồi thử lại để tiếp tục.
                  </p>

                  <div class="actions">
                    <button onclick="window.location.reload()">↻ Thử lại</button>
                    <a href="/">⌂ Trang chủ</a>
                  </div>

                  <div class="tips">
                    <strong>Mẹo:</strong><br />
                    ✓ Kiểm tra WiFi hoặc dữ liệu di động<br />
                    ✓ Vô hiệu hóa VPN hoặc proxy nếu có<br />
                    ✓ Khởi động lại thiết bị của bạn
                  </div>
                </section>
              </main>
            </body>
          </html>
          `,
          {
            status: 200,
            headers: {
              "Content-Type": "text/html; charset=utf-8",
            },
          }
        );
      })
    );

    return;
  }

  const canCache =
    event.request.destination === "style" ||
    event.request.destination === "script" ||
    event.request.destination === "image" ||
    event.request.destination === "font";

  if (!canCache) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }

          const responseToCache = networkResponse.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return networkResponse;
        })
        .catch(() => cachedResponse);
    })
  );
});