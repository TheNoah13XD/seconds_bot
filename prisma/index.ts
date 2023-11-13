import { PrismaClient, User } from '@prisma/client';
import Chance from "chance";

import { calculateEarnings, DOLLAR_TO_GEMS } from "./helpers.js";

export const db = new PrismaClient();
const chance = Chance();

const createLinks = (username: string): any[] => [
    {
        name: username,
        type: "TWITTER",
        url: `https://twitter.com/${username}`,
    },
    {
        name: username,
        type: "FACEBOOK",
        url: `https://facebook.com/${username}`,
    },
    {
        name: username,
        type: "YOUTUBE",
        url: `https://youtube.com/${username}`,
    },
    {
        name: username,
        type: "TIKTOK",
        url: `https://twitter.com/${username}`,
    },
    {
        name: username,
        type: "INSTAGRAM",
        url: `https://instagram.com/${username}`,
    },
    {
        name: "website",
        type: "OTHER",
        url: `https://example.com/`,
    },
];

const createUser = async (params: Partial<Omit<User, "kycData">> = {}): Promise<User> => {
    const hashedPassword = "seconds123";
    const username = params.username || chance.word({ syllables: 3 });

    const user = await db.user.upsert({
        where: {
            username,
        },
        create: {
            username,
            hashedPassword,
            email: chance.email(),
            name: chance.name(),
            kycVerifiedAt: null,
            birthdate: chance.date({
                year: chance.integer({
                    min: 1950,
                    max: 2000,
                }),
            }),
            price: chance.integer({
                min: 10,
                max: 10000,
            }),
            role: "USER",
            links: {
                createMany: {
                    data: createLinks(username),
                },
            },
            ...params,
        },
        update: {},
    });

    return user;
};

export const main = async () => {
    const user = await createUser({
        name: "Antoine Ordonez",
        username: "antoine",
        email: "antoine@seconds.app",
        birthdate: new Date(Date.parse("1990-01-01")),
        role: "CREATOR",
    });

    for (let i = 0; i < 10; i++) {
        await createUser({
            role: "CREATOR",
        });
    }

    const users: User[] = [];
    for (let i = 0; i < 10; i++) {
        const user = await createUser();
        users.push(user);
    }

    for (let i = 0; i < 10; i++) {
        const amount = chance.integer({ min: 1, max: 100 });
        await db.transaction.create({
            data: {
                sid: chance.guid(),
                amount,
                gems: amount * 100,
                source: chance.cc(),
                currency: "USD",
                userId: user.id,
                type: "DEPOSIT",
                createdAt: chance.date({
                    year: new Date().getFullYear(),
                }),
            },
        });
        await db.transaction.create({
            data: {
                sid: chance.guid(),
                amount,
                gems: amount * 100,
                source: chance.cc(),
                currency: "USD",
                userId: user.id,
                type: "WITHDRAWAL",
                createdAt: chance.date({
                    year: new Date().getFullYear(),
                }),
            },
        });
    }

    for (let i = 0; i < 10; i++) {
        const createdAt = chance.date({
            month: chance.integer({
                min: 1,
                max: 12,
            }),
            day: chance.integer({
                min: 1,
                max: new Date().getDate(),
            }),
            year: new Date().getFullYear(),
            string: false,
        }) as Date;

        const duration = chance.floating({ min: 10, max: 3600 });
        const completedAt = new Date(createdAt.getTime() + duration * DOLLAR_TO_GEMS);

        const { price, earnings, fee } = calculateEarnings(500, duration);

        await db.call.create({
            data: {
                author: {
                    connect: {
                        id: user.id,
                    },
                },
                sid: chance.guid(),
                createdAt,
                updatedAt: completedAt,
                completedAt,
                duration,
                price,
                fee,
                earnings,
                participant: {
                    connect: {
                        id: chance.pickone(users).id,
                    },
                },
            },
        });

        {
            const { price, earnings, fee } = calculateEarnings(500, duration);

            await db.call.create({
                data: {
                    author: {
                        connect: {
                            id: chance.pickone(users).id,
                        },
                    },
                    sid: chance.guid(),
                    createdAt,
                    updatedAt: createdAt,
                    completedAt,
                    duration,
                    price,
                    fee,
                    earnings,
                    participant: {
                        connect: {
                            id: user.id,
                        },
                    },
                },
            });
        }
    }
};
