"use server";

import { auth } from "@clerk/nextjs";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { DeleteBoard } from "./schema";
import { redirect } from "next/navigation";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { decreaseAvailableCount } from "@/lib/org-limit";

const handler = async (data:InputType): Promise<ReturnType> => {
    const {userId, orgId} = auth();

    if(!userId || !orgId){
        return {
            error: "Un Authorized",
        }
    }

    const {id} = data;
    let board;

    try {
        // throw new Error("ffcs");
        board = await db.board.delete({
            where: {
                id,
                orgId,
            },
        });

        await decreaseAvailableCount();

        await createAuditLog({
            entityTitle: board.title,
            entityId: board.id,
            entityType: ENTITY_TYPE.BOARD,
            action: ACTION.DELETE,
        })
        
    } catch (error) {
        return {
            error: "Failed to delete board",
        }
    }

    revalidatePath(`/organization/${orgId}`);
    redirect(`/organization/${orgId}`);
}

export const deleteBoard = CreateSafeAction(DeleteBoard, handler);