import { auth } from "@/auth";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

export async function DELETE(
  req: NextRequest,
  { params }: { params: {} }
) {
  const session = await auth();
  
  if (!session || !session.user) {
    return new Response("Not authenticated or Invalid user", { status: 401 });
  }

  try {
    await prisma.user.delete({
      where: {
        id: session.user.id,
      },
    });
    return new Response("User deleted successfully!", { status: 200 });
  } catch (error) {
    return new Response("Internal server error", { status: 500 });
  }
}