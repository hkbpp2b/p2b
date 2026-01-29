import re


def clean_css_keep_last(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Regex untuk mengambil blok CSS (selector dan isinya)
        # Pattern ini menangkap: selector { properties }
        pattern = re.compile(r'([^{}]+\{[^{}]+\})')
        all_blocks = pattern.findall(content)

        # Dictionary untuk menyimpan blok unik
        # Key: Selector yang sudah dinormalisasi
        # Value: Full block kode CSS-nya
        unique_blocks = {}

        for block in all_blocks:
            # Ambil bagian selector saja (sebelum kurung kurawal '{')
            selector = block.split('{')[0].strip()
            # Normalisasi selector (hapus spasi berlebih) untuk perbandingan
            normalized_selector = " ".join(selector.split())

            # Simpan/Timpa ke dictionary.
            # Karena looping dari atas ke bawah, yang terakhir masuk akan otomatis menimpa yang lama.
            unique_blocks[normalized_selector] = block.strip()

        # Gabungkan semua value dari dictionary (urutannya tetap terjaga di Python 3.7+)
        final_css = "\n\n".join(unique_blocks.values())

        # Timpa file asli
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(final_css)

        print(f"Berhasil membersihkan '{file_path}'!")
        print(f"Blok duplikat dihapus, mempertahankan aturan paling bawah.")

    except FileNotFoundError:
        print(f"Error: File '{file_path}' tidak ditemukan.")
    except Exception as e:
        print(f"Terjadi kesalahan: {e}")


# Jalankan script
clean_css_keep_last('app.css')
