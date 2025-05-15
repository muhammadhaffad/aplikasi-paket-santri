import { useEffect, useState } from "react";

const useFetchStats = ({
    periode = "days",
    time = 7,
    idKategori = null,
} = {}) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshIncrement, setRefreshIncrement] = useState(0);
    const refresh = () => setRefreshIncrement((prev) => prev + 1);

    useEffect(() => {
        setLoading(true);

        const res = axios.get(route('laporan.api.stats', {periode, time, idKategori}));

        res.then(({ data: _data }) => {
            setData(_data);
            setLoading(false);
        });
    }, [periode, time, idKategori, setData, setLoading, refreshIncrement]);

    return [data, loading, refresh];
}

export default useFetchStats;