import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

interface IParams {
  conversationId?: string;
}

export async function POST(request: Request, { params }: { params: IParams }) {
  try {
    const currentUser = await getCurrentUser();

    const { conversationId } = params;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const updatedMessages = await prisma.message.updateMany({
      where: {
        conversationId,
        NOT: {
          seendIds: {
            has: currentUser.id,
          },
        },
      },
      data: {
        seendIds: {
          push: currentUser.id,
        },
      },
    });

    return NextResponse.json(updatedMessages);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
