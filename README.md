🚀 Smart POS: Minimalist, Offline-First Retail Engine
A streamlined Point of Sale (POS) solution tailored for mid-level business owners who need speed, reliability, and mobility. This application bridges the gap between a lightweight PWA and a heavy enterprise ERP, focusing on a "less is more" user experience.

✨ Key Features
📱 Mobile-First PWA: Optimized for smartphones and tablets. Installable as an app with full offline functionality using Angular Service Workers and IndexedDB.

⚡ Intelligent Input:

Predictive Population: Manual product entries are cached. Next time you type, fields auto-populate based on previous history to save time.

QR Code Ready: Instant checkout via QR scanning for pre-registered products.

📄 Dynamic Receipts:

Edit line items, quantities, and prices on the fly during the checkout process.

WhatsApp Integration: Upon submission, the app triggers a WhatsApp redirect to send the digital receipt link directly to the customer.

📉 Simplified Reporting: High-level sales summaries and SKU-based filtering without the clutter of traditional accounting software.

🇵🇰 FBR Hybrid Mode:

Online Mode: Real-time synchronization with FBR fiscal endpoints.

Force Offline: A dedicated setting to bypass FBR integration during internet outages, allowing the business to keep moving. Data syncs automatically once reconnected.

🛠 Technical Stack
Frontend: Angular (SPA/PWA)

State & Storage: RxJS, IndexedDB (Dexie.js) for offline persistence.

Backend: .NET 8 Web API

Database: Entity Framework Core (SQL Server/PostgreSQL)

Compliance: FBR Fiscal API Integration

🔄 Offline-Sync Logic
The app utilizes a "Local-First" approach. Every sale is first committed to the device's internal database. A background synchronization service monitors connectivity and "pushes" pending receipts to the .NET backend, which handles the heavy lifting of FBR reporting and permanent cloud storage.

📦 Installation & Setup
Prerequisites: Node.js (v18+), .NET 8 SDK.

Frontend: cd client && npm install && ng serve

Backend: cd server && dotnet run

PWA: Build with ng build and serve over HTTPS to enable Service Worker features.
