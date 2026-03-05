# Web App Gereja

Deskripsi singkat: Aplikasi berbasis web untuk manajemen data jemaat dan akses literatur rohani (Alkitab & Buku Ende) yang dirancang dengan antarmuka modern dan responsif.

## Teknologi yang Digunakan

* **Core**: [React.js](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
* **Build Tool**: [Vite](https://vitejs.dev/)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/)
* **Icons**: [Lucide React](https://lucide.dev/)
* **CI/CD**: GitHub Actions

## Fitur Utama

* **E-Bible & Songbook**: Akses cepat ke data Alkitab dan Buku Ende secara digital.
* **Manajemen Data**: Formulir input data jemaat yang terstruktur.
* **Multi-Layout**: Tampilan yang dioptimalkan khusus untuk perangkat Desktop dan Mobile.
* **Integrasi Pembayaran**: Siap untuk tampilan QRIS dan GPN.

## Struktur Folder Penting

* `src/components/cards`: Berisi komponen kartu untuk fitur utama (Alkitab, Form Data, dll).
* `src/assets`: Berisi database JSON untuk konten aplikasi dan aset gambar.

## Cara Instalasi & Menjalankan

1.  **Clone Repositori**
    ```bash
    git clone [https://github.com/username/webperum2.git](https://github.com/username/webperum2.git)
    cd webperum2
    ```

2.  **Instal Dependencies**
    ```bash
    npm install
    ```

3.  **Jalankan Mode Pengembangan**
    ```bash
    npm run dev
    ```
    Buka `http://localhost:5173` di browser Anda.

4.  **Build untuk Produksi**
    ```bash
    npm run build
    ```

## Crafted with ❤️ by Mulmed Team HKBP Perumnas 2 Bekasi