import { getAuthUserId } from '@convex-dev/auth/server';
import { v } from 'convex/values';

import { query, mutation } from './_generated/server';

const TABLE = 'workspaces';

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query(TABLE).collect();
  },
});

export const getById = query({
  args: {
    id: v.id(TABLE),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) throw new Error('Unauthorized');

    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) throw new Error('Unauthorized');

    const joinCode = '123456'; // TODO: Create a proper method

    const workspaceId = await ctx.db.insert(TABLE, {
      name: args.name,
      userId,
      joinCode,
    });

    return workspaceId;
  },
});
