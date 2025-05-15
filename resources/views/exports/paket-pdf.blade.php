<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Paket Data Export</title>
    <style>
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
            font-size: 12px;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 10px;
        }
        .header h1 {
            color: #333;
            margin: 0;
            padding: 0;
            font-size: 24px;
        }
        .metadata {
            margin-bottom: 20px;
            font-size: 10px;
            color: #666;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        table, th, td {
            border: 1px solid #ddd;
        }
        th {
            background-color: #f2f2f2;
            font-weight: bold;
            text-align: left;
            padding: 8px;
        }
        td {
            padding: 8px;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 10px;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 10px;
        }
        .page-number {
            text-align: right;
            font-size: 10px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Paket Data {{ Str::ucfirst($jenisPaket) }} Export</h1>
        <p>Generated on: {{ date('Y-m-d H:i:s') }}</p>
    </div>
    
    <div class="metadata">
        <p>Total Records: {{ count($data) }}</p>
        <!-- You can add more metadata here -->
    </div>
    
    @if(count($data) > 0)
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>NIS</th>
                    <th>Asrama</th>
                    <th>Gedung</th>
                    <th>Penerima</th>
                    <th>Pengirim</th>
                    <th>Nama Paket</th>
                    <th>Kategori</th>
                    <th>Tanggal Diterima</th>
                    <th>Keterangan Disita</th>
                    <th>Status</th>
                    <th>Ditambahkan Pada</th>
                </tr>
            </thead>
            <tbody>
                @foreach($data as $item)
                    <tr>
                        <td>{{ $item->id }}</td>
                        <td>{{ $item->santri->nis }}</td>
                        <td>{{ $item->asrama->nama }}</td>
                        <td>{{ $item->asrama->gedung }}</td>
                        <td>{{ $item->penerima }}</td>
                        <td>{{ $item->pengirim }}</td>
                        <td>{{ $item->nama }}</td>
                        <td>{{ $item->paketKategori->nama }}</td>
                        <td>{{ $item->tanggal_diterima }}</td>
                        <td>{{ $item->keterangan_disita }}</td>
                        <td>{{ $item->status }}</td>
                        <td>{{ $item->created_at }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <p>No records found.</p>
    @endif
    
    <div class="footer">
        <p>This report is confidential and generated for internal use only.</p>
    </div>
    
    <script type="text/php">
        if (isset($pdf)) {
            $text = "Page {PAGE_NUM} of {PAGE_COUNT}";
            $size = 10;
            $font = $fontMetrics->getFont("Helvetica");
            $width = $fontMetrics->get_text_width($text, $font, $size) / 2;
            $x = ($pdf->get_width() - $width) / 2;
            $y = $pdf->get_height() - 35;
            $pdf->page_text($x, $y, $text, $font, $size);
        }
    </script>
</body>
</html>