import 'server-only';
import { and, eq } from 'drizzle-orm';
import { auth } from '@/auth';
import { db } from '@/app/server/db';
import { users, watchlist, ratings } from '@/app/server/db/schema';

export async function postUser(name: string, email: string, image: string) {
    if (!email) {
        throw new Error('Email is required');
    }

    await db.insert(users).values({ name, email, image });
}

export async function getRatings(id: string) {
    const session = await auth();
    const user = session?.user;
    if (!user) {
        throw new Error('Unauthorized');
    }

    const ratings = await db.query.ratings.findMany({
        where: (model, { eq }) => eq(model.userID, id),
        orderBy: (model, { desc }) => desc(model.id),
    });

    return ratings;
}

export async function getWatchlist(id: string) {
    const session = await auth();
    const user = session?.user;
    if (!user) {
        throw new Error('Unauthorized');
    }

    const watchlist = await db.query.watchlist.findMany({
        where: (model, { eq }) => eq(model.userID, id),
        orderBy: (model, { desc }) => desc(model.id),
    });

    return watchlist;
}

export async function patchRatings(id: string, newRating: number) {
    const session = await auth();
    const user = session?.user;
    if (!user) {
        throw new Error('Unauthorized');
    }

    const patchedRatings = await db.update(ratings)
        .set({ rating: newRating })
        .where(and(eq(ratings.movieID, id), eq(ratings.userID, users.id)));

    return patchedRatings;
}

export async function deleteMovieFromRatings(id: number) {
    const session = await auth();
    const user = session?.user;
    if (!user) {
        throw new Error('Unauthorized')
    }

    await db
        .delete(ratings)
        .where(and(eq(ratings.id, id), eq(ratings.userID, users.id)));
}

export async function deleteMovieFromWatchlist(id: number) {
    const session = await auth();
    const user = session?.user;
    if (!user) {
        throw new Error('Unauthorized')
    }

    await db
        .delete(watchlist)
        .where(and(eq(watchlist.id, id), eq(watchlist.userID, users.id)));
}
