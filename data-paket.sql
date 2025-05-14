INSERT INTO pakets (
  kategori_id, santri_nis, asrama_id, nama, pengirim, penerima,
  tanggal_diterima, keterangan_disita, status, created_at, updated_at, jenis_paket
) VALUES
(1, 'S20250001', 1, 'Paket Makanan Basah 1', 'Ibunya Ahmad', NULL, '2025-05-10 10:15:00', '', 'belum diambil', NOW(), NOW(), 'masuk'),
(2, 'S20250002', 2, 'Paket Makanan Kering 1', 'Ayahnya Budi', NULL, '2025-05-09 14:00:00', '', 'diambil', NOW(), NOW(), 'masuk'),
(3, 'S20250003', 3, 'Paket Non Makanan 1', 'Tantenya Cici', NULL, '2025-05-08 09:30:00', 'Disita karena ada barang tajam', 'belum diambil', NOW(), NOW(), 'masuk'),
(1, 'S20250004', 1, 'Paket Keluar 1', NULL, 'Pak Ustadz Hasan', '2025-05-07 11:45:00', '', 'diambil', NOW(), NOW(), 'keluar'),
(2, 'S20250005', 2, 'Paket Keluar 2', NULL, 'Ibunya Dede', '2025-05-07 13:20:00', '', 'diambil', NOW(), NOW(), 'keluar'),
(3, 'S20250006', 3, 'Paket Non Makanan 2', 'Pamannya Eka', NULL, '2025-05-06 15:50:00', '', 'belum diambil', NOW(), NOW(), 'masuk'),
(1, 'S20250007', 1, 'Paket Makanan Basah 2', 'Ibunya Fikri', NULL, '2025-05-05 10:00:00', '', 'diambil', NOW(), NOW(), 'masuk'),
(2, 'S20250008', 2, 'Paket Makanan Kering 2', 'Ayahnya Gina', NULL, '2025-05-04 12:30:00', '', 'diambil', NOW(), NOW(), 'masuk'),
(3, 'S20250009', 3, 'Paket Keluar 3', NULL, 'Kakaknya Hana', '2025-05-03 16:10:00', '', 'belum diambil', NOW(), NOW(), 'keluar'),
(1, 'S20250010', 1, 'Paket Keluar 4', NULL, 'Pak RT', '2025-05-03 08:40:00', '', 'diambil', NOW(), NOW(), 'keluar'),
(2, 'S20250011', 2, 'Paket Makanan Kering 3', 'Ibunya Ilham', NULL, '2025-05-02 17:00:00', '', 'belum diambil', NOW(), NOW(), 'masuk'),
(3, 'S20250012', 3, 'Paket Non Makanan 3', 'Kakaknya Joko', NULL, '2025-05-01 09:00:00', '', 'belum diambil', NOW(), NOW(), 'masuk'),
(1, 'S20250013', 1, 'Paket Keluar 5', NULL, 'Bu Lurah', '2025-04-30 14:15:00', '', 'diambil', NOW(), NOW(), 'keluar'),
(2, 'S20250014', 2, 'Paket Makanan Kering 4', 'Ayahnya Kiki', NULL, '2025-04-29 10:10:00', '', 'diambil', NOW(), NOW(), 'masuk');
