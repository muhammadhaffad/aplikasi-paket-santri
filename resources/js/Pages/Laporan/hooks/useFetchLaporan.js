import { useEffect, useState } from "react";

const useFetchLaporan = ({
    pagination: { limit = 10, skip = 0 } = {},
    sorting: { field = "id", order = "DESC" } = {},
    rentangTanggal: { column = "tanggal_diterima", start = null, end = null } = {},
    jenisPaket = "masuk",
    kategoriPakets = [],
    isDisita = null,
} = {}) => {
    const [data, setData] = useState([]);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [refreshIncrement, setRefreshIncrement] = useState(0);
    const refresh = () => setRefreshIncrement((prev) => prev + 1);

    useEffect(() => {
        setLoading(true);

        const res = axios.get(route('laporan.api.index'), {
            params: {
                limit,
                skip,
                rentang: {
                    column,
                    start,
                    end,
                },
                jenis_paket: jenisPaket,
                kategori_pakets: kategoriPakets,
                is_disita: isDisita,
                sortField: field,
                sortOrder: order,
            },
        });

        res.then(({ data: { items: _data, meta: { total: _count } } }) => {
            setData(_data);
            setCount(_count);
            setLoading(false);
        });
    }, [limit, skip, setData, setLoading, refreshIncrement, field, order, column, start, end, jenisPaket, kategoriPakets, isDisita]);

    return [data, setData, count, setCount, loading, refresh];
}

export default useFetchLaporan;