import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

interface IParams {
  conversationId: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    const { conversationId } = params;

    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      return new NextResponse("Unauthorized", { status: 400 });
    }

    const existingConversation = await prisma.conversation.findFirstOrThrow({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
      },
    });

    const deletedConversation = await prisma.conversation.delete({
      where: {
        id: conversationId,
        userIds: {
          has: currentUser.id,
        },
      },
    });
    return NextResponse.json(deletedConversation);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
