import { clerkClient } from '@clerk/nextjs/server';
import User from '@/models/User';
import connectDB from '@/config/db';

export async function getOrCreateUser(userId) {
    await connectDB();
    let user = await User.findById(userId);
    
    // If user exists but is missing required fields, or doesn't exist at all, we sync from Clerk
    const isCorrupt = user && (!user.name || !user.email || !user.imageUrl);
    
    if (!user || isCorrupt) {
        try {
            const client = await clerkClient();
            const clerkUser = await client.users.getUser(userId);
            
            const name = clerkUser.fullName || `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'User';
            const email = clerkUser.emailAddresses[0]?.emailAddress || '';
            const imageUrl = clerkUser.imageUrl || '';
            
            if (isCorrupt) {
                user.name = name;
                user.email = email;
                user.imageUrl = imageUrl;
                await user.save();
            } else {
                user = await User.create({
                    _id: userId,
                    name,
                    email,
                    imageUrl,
                    cartItems: {},
                    wishlist: []
                });
            }
        } catch (error) {
            console.error("Failed to sync/create user from Clerk in DB:", error);
            // If it was corrupt, rethrow so the API handles it
            if (isCorrupt) throw error;
        }
    }
    return user;
}
