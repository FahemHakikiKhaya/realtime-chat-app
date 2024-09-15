import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";

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

    const messagesToUpdate = await prisma.message.findMany({
      where: {
        conversationId,
        NOT: {
          seendIds: {
            has: currentUser.id,
          },
        },
      },
    });

    const updatedMessages = await Promise.all(
      messagesToUpdate.map((message) =>
        prisma.message.update({
          where: { id: message.id },
          data: {
            seendIds: {
              push: currentUser.id,
            },
          },
          include: {
            sender: true,
            seen: true,
          },
        })
      )
    );

    await pusherServer.trigger(
      conversationId!,
      "messages:update",
      updatedMessages
    );

    return NextResponse.json(updatedMessages);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
