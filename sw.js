// sw.js (Service Worker)

self.addEventListener('install', (event) => {
    console.log('Service Worker installed.');
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker activated.');
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/') // Redirect to your application
    );
});

let notificationScheduled = false;

async function scheduleNotification(data) {
    const delay = data.delay || 0;

    if (notificationScheduled) return; // Prevent scheduling if already done

    notificationScheduled = true;

    setTimeout(async () => {
        await self.registration.showNotification(data.title, {
            body: data.body,
            icon: data.icon,
        });
        notificationScheduled = false; // Reset after the notification is shown
    }, delay);
}

// Listen for messages from the main thread
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'schedule-notification') {
        scheduleNotification(event.data.payload);
    }
});