import { makeQuery } from "../utils/dbQueries";

export async function getRecommendations() {
    const recommendations = [
        {
            image: "https://flowbite.com/docs/images/blog/image-4.jpg",
            title: "ABC",
            synopsis: "Voluptate dolor et ad amet ullamco esse minim nostrud nulla aliquip. Ea consectetur cupidatat Lorem labore. Anim officia cillum et dolor elit in.",
            tags: ["X", "Y", "Z"]
        },
        {
            image: "https://qodeinteractive.com/magazine/wp-content/uploads/2019/08/Featured-Stock.jpg",
            title: "XYZ",
            synopsis: "Quis labore nisi ad pariatur. Magna amet culpa voluptate sint. Cupidatat esse in amet amet voluptate veniam esse. Laboris quis sint laboris est. Ex dolore ipsum quis reprehenderit anim amet est consequat.",
            tags: ["A", "B", "C"]
        },
        {
            image: "https://media.istockphoto.com/id/1345912457/photo/financial-stock-market-graph-selective-focus.jpg?s=612x612&w=0&k=20&c=I-XKq4_2c3rOJPezkG5J6DNbl65OVgmGbX4yrp5T7qQ=",
            title: "PQR",
            synopsis: "Cupidatat consectetur cupidatat in commodo enim officia commodo. Consequat tempor esse culpa elit magna ullamco. Occaecat id eu nisi sint do minim sunt culpa nisi ut. Sunt ex fugiat cillum deserunt quis sunt cillum aute nostrud enim.",
            tags: ["X", "A", "C", "Z"]
        },
    ]

    return recommendations;
}