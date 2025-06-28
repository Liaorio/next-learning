import { auth } from '@/auth';

/**
 * Get the current logged-in user ID
 * @throws {Error} If user is not logged in or session has no userId
 * @returns {Promise<string>} User ID
 */
export async function getCurrentUserId(): Promise<string> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error('Not logged in or session has no userId');
  return userId;
} 