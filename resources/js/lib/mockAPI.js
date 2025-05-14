import { useEffect, useState } from "react"

const EPISODES = [
    {
        id: 1,
        episode: "S1E01",
        title: "To You, in 2000 Years: The Fall of Shiganshina, Part 1",
    },
    {
        id: 2,
        episode: "S1E02",
        title: "That Day: The Fall of Shiganshina, Part 2",
    },
    {
        id: 3,
        episode: "S1E03",
        title: "A Dim Light Amid Despair: Humanity's Comeback, Part 1",
    },
    {
        id: 4,
        episode: "S1E04",
        title: "The Night of the Closing Ceremony: Humanity's Comeback, Part 2",
    },
    {
        id: 5,
        episode: "S1E05",
        title: "First Battle: The Struggle for Trost, Part 1",
    },
    {
        id: 6,
        episode: "S1E06",
        title: "The World the Girl Saw: The Struggle for Trost, Part 2",
    },
    {
        id: 7,
        episode: "S1E07",
        title: "Small Blade: The Struggle for Trost, Part 3",
    },
    {
        id: 8,
        episode: "S1E08",
        title: "I Can Hear His Heartbeat: The Struggle for Trost, Part 4",
    },
    {
        id: 9,
        episode: "S1E09",
        title: "Whereabouts of His Left Arm: The Struggle for Trost, Part 5",
    },
    {
        id: 10,
        episode: "S1E10",
        title: "Response: The Struggle for Trost, Part 6",
    },
    { id: 11, episode: "S1E11", title: "Idol: The Struggle for Trost, Part 7" },
    { id: 12, episode: "S1E12", title: "Wound: The Struggle for Trost, Part 8" },
    {
        id: 13,
        episode: "S1E13",
        title: "Primal Desire: The Struggle for Trost, Part 9",
    },
    {
        id: 14,
        episode: "S1E14",
        title: "Can't Look into His Eyes Yet: Eve of the Counterattack, Part 1",
    },
    {
        id: 15,
        episode: "S1E15",
        title: "Special Operations Squad: Eve of the Counterattack, Part 2",
    },
    {
        id: 16,
        episode: "S1E16",
        title: "What Needs to be Done Now: Eve of the Counterattack, Part 3",
    },
    {
        id: 17,
        episode: "S1E17",
        title: "Female Titan: The 57th Exterior Scouting Mission, Part 1",
    },
    {
        id: 18,
        episode: "S1E18",
        title: "Forest of Giant Trees: The 57th Exterior Scouting Mission, Part 2",
    },
    {
        id: 19,
        episode: "S1E19",
        title: "Bite: The 57th Exterior Scouting Mission, Part 3",
    },
    {
        id: 20,
        episode: "S1E20",
        title: "Erwin Smith: The 57th Exterior Scouting Mission, Part 4",
    },
    {
        id: 21,
        episode: "S1E21",
        title: "Crushing Blow: The 57th Exterior Scouting Mission, Part 5",
    },
    {
        id: 22,
        episode: "S1E22",
        title: "The Defeated: The 57th Exterior Scouting Mission, Part 6",
    },
    { id: 23, episode: "S1E23", title: "Smile: Assault on Stohess, Part 1" },
    { id: 24, episode: "S1E24", title: "Mercy: Assault on Stohess, Part 2" },
    { id: 25, episode: "S1E25", title: "Wall: Assault on Stohess, Part 3" },
    { id: 26, episode: "S2E01", title: "Beast Titan" },
    { id: 27, episode: "S2E02", title: "I'm Home" },
    { id: 28, episode: "S2E03", title: "Southwestward" },
    { id: 29, episode: "S2E04", title: "Soldier" },
    { id: 30, episode: "S2E05", title: "Historia" },
    { id: 31, episode: "S2E06", title: "Warrior" },
    { id: 32, episode: "S2E07", title: "Close Combat" },
    { id: 33, episode: "S2E08", title: "The Hunters" },
    { id: 34, episode: "S2E09", title: "Opening" },
    { id: 35, episode: "S2E10", title: "Children" },
    { id: 36, episode: "S2E11", title: "Charge" },
    { id: 37, episode: "S2E12", title: "Scream" },
    { id: 38, episode: "S3E01", title: "Smoke Signal" },
    { id: 39, episode: "S3E02", title: "Pain" },
    { id: 40, episode: "S3E03", title: "Old Story" },
    { id: 41, episode: "S3E04", title: "Trust" },
    { id: 42, episode: "S3E05", title: "Reply" },
    { id: 43, episode: "S3E06", title: "Sin" },
    { id: 44, episode: "S3E07", title: "Wish" },
    { id: 45, episode: "S3E08", title: "Outside the Walls of Orvud District" },
    { id: 46, episode: "S3E09", title: "Ruler of the Walls" },
    { id: 47, episode: "S3E10", title: "Friends" },
    { id: 48, episode: "S3E11", title: "Bystander" },
    { id: 49, episode: "S3E12", title: "Night of the Battle to Retake the Wall" },
    { id: 50, episode: "S3E13", title: "The Town Where Everything Began" },
    { id: 51, episode: "S3E14", title: "Thunder Spears" },
    { id: 52, episode: "S3E15", title: "Descent" },
    { id: 53, episode: "S3E16", title: "Perfect Game" },
    { id: 54, episode: "S3E17", title: "Hero" },
    { id: 55, episode: "S3E18", title: "Midnight Sun" },
    { id: 56, episode: "S3E19", title: "The Basement" },
    { id: 57, episode: "S3E20", title: "That Day" },
    { id: 58, episode: "S3E21", title: "Attack Titan" },
    { id: 59, episode: "S3E22", title: "The Other Side of the Wall" },
    { id: 60, episode: "S4E01", title: "The Other Side of the Sea" },
    { id: 61, episode: "S4E02", title: "Midnight Train" },
    { id: 62, episode: "S4E03", title: "The Door of Hope" },
    { id: 63, episode: "S4E04", title: "From One Hand to Another" },
    { id: 64, episode: "S4E05", title: "Declaration of War" },
    { id: 65, episode: "S4E06", title: "The War Hammer Titan" },
    { id: 66, episode: "S4E07", title: "Assault" },
    { id: 67, episode: "S4E08", title: "Assassin's Bullet" },
    { id: 68, episode: "S4E09", title: "Brave Volunteers" },
    { id: 69, episode: "S4E10", title: "A Sound Argument" },
    { id: 70, episode: "S4E11", title: "Deceiver" },
    { id: 71, episode: "S4E12", title: "Guides" },
    { id: 72, episode: "S4E13", title: "Children of the Forest" },
    { id: 73, episode: "S4E14", title: "Savagery" },
    { id: 74, episode: "S4E15", title: "Sole Salvation" },
    { id: 75, episode: "S4E16", title: "Above and Below" },
    { id: 76, episode: "S4E17", title: "Judgment" },
    { id: 77, episode: "S4E18", title: "Sneak Attack" },
    { id: 78, episode: "S4E19", title: "Two Brothers" },
    { id: 79, episode: "S4E20", title: "Memories of the Future" },
    { id: 80, episode: "S4E21", title: "From You, 2,000 Years Ago" },
    { id: 81, episode: "S4E22", title: "Thaw" },
    { id: 82, episode: "S4E23", title: "Sunset" },
    { id: 83, episode: "S4E24", title: "Pride" },
    { id: 84, episode: "S4E25", title: "Night of the End" },
    { id: 85, episode: "S4E26", title: "Traitor" },
    { id: 86, episode: "S4E27", title: "Retrospective" },
    { id: 87, episode: "S4E28", title: "The Dawn of Humanity" },
    { id: 88, episode: "S4E29", title: "THE FINAL CHAPTERS Special 1" },
    { id: 89, episode: "S4E30", title: "THE FINAL CHAPTERS Special 2" },
];

export function mockAPI({
    pagination: { limit = 10, skip = 0 } = {},
    sort: { field = "id", order = "ASC" } = {},
    search = "",
} = {}) {
    console.info(limit, skip, field, order, search);
    const episodes = [
        ...EPISODES.filter((episode) => {
            return episode.title.toLowerCase().includes(search.toLowerCase());
        }).sort((a, b) => {
            const [first, second] =
                order === "ASC" ? [a[field], b[field]] : [b[field], a[field]];
            if (typeof first === "string" && typeof second === "string") {
                return first.localeCompare(second);
            }
            return first - second;
        }),
    ].slice(skip, skip + limit);

    let timeoutId;

    const res = new Promise((resolve) => {
        timeoutId = setTimeout(() => {
            resolve([episodes, EPISODES.length]);
        }, 1000);
    });

    return { res, abort: () => clearTimeout(timeoutId) };
}

export function useMockAPI(
    query = "",
    {
        pagination: { limit = 10, skip = 0 } = {},
        sort: { field = "id", order = "ASC" } = {},
        search = "",
    } = {},
) {
    const [data, setData] = useState([]);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true);

        const { res, abort } = mockAPI({
            pagination: {
                limit,
                skip,
            },
            sort: {
                field,
                order,
            },
            search,
        });

        res.then(([_data, _count]) => {
            setData(_data);
            setCount(_count);
            setLoading(false);
        });

        return () => abort();
    }, [limit, skip, field, order, setData, setLoading, search]);

    return [data, count, loading];
}
