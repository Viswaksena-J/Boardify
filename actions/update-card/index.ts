"use server";

import { auth } from "@clerk/nextjs";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { UpdateCard } from "./schema";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

const handler = async (data:InputType): Promise<ReturnType> => {
    const {userId, orgId} = auth();

    if(!userId || !orgId){
        return {
            error: "Un Authorized",
        }
    }

    const {id, boardId, ...values} = data;
    let card;

    try {
        // throw new Error("ffcs");
        card = await db.card.update({
            where: {
                id,
                list:{
                    board:{
                        orgId
                    }
                }
            },
            data:{
                ...values
            }
        });

        await createAuditLog({
            entityTitle: card.title,
            entityId: card.id,
            entityType: ENTITY_TYPE.CARD,
            action: ACTION.UPDATE,
        })
    } catch (error) {
        return {
            error: "Failed to update board",
        }
    }

    revalidatePath(`/board/${boardId}`);
    return {data: card};
}

export const updateCard = CreateSafeAction(UpdateCard, handler);