import { auth } from "@/auth";

import { prisma } from "@/lib/db";

export const DELETE = auth(async (req) => {
  if (!req.auth || !req.auth.user) {
    // If no authentication or user is found, immediately return a 401 error
    return new Response("Not authenticated or Invalid user", { status: 401 });
  }

  try {
    await prisma.user.delete({
      where: {
        id: req.auth.user.id,
      },
    });
    return new Response("User deleted successfully!", { status: 200 });
  } catch (error) {
    // Return a 500 error if something goes wrong in the deletion process
    return new Response("Internal server error", { status: 500 });
  }
});
