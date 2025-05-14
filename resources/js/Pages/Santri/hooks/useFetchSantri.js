import { useEffect, useState } from "react";

const useFetchSantri = ({
    pagination: { limit = 10, skip = 0 } = {},
    sort: { field = "id", order = "ASC" } = {},
    search = "",
} = {}) => {
    const [data, setData] = useState([]);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [refreshIncrement, setRefreshIncrement] = useState(0);
    const refresh = () => setRefreshIncrement((prev) => prev + 1);

    useEffect(() => {
        setLoading(true);

        const res = axios.get(route('santris.api.index'), {
            params: {
                limit,
                skip,
                sortField: field,
                sortOrder: order,
                search,
            },
        });

        res.then(({ data: { items: _data, meta: { total: _count } } }) => {
            setData(_data);
            setCount(_count);
            setLoading(false);
        });
    }, [limit, skip, field, order, setData, setLoading, search, refreshIncrement]);

    return [data, setData, count, setCount, loading, refresh];
}

export default useFetchSantri;