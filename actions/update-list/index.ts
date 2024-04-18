"use server";

import { auth } from "@clerk/nextjs";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { UpdateList } from "./schema";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

const handler = async (data:InputType): Promise<ReturnType> => {
    const {userId, orgId} = auth();

    if(!userId || !orgId){
        return {
            error: "Un Authorized",
        }
    }

    const {title, id, boardId} = data;
    let list;

    try {
        // throw new Error("ffcs");
        list = await db.list.update({
            where: {
                id,
                boardId,
                board:{
                    orgId
                }
            },
            data:{
                title,
            }
        });
        await createAuditLog({
            entityTitle: list.title,
            entityId: list.id,
            entityType: ENTITY_TYPE.LIST,
            action: ACTION.UPDATE,
        })
    } catch (error) {
        return {
            error: "Failed to update board",
        }
    }

    revalidatePath(`/board/${boardId}`);
    return {data: list};
}

export const updateList = CreateSafeAction(UpdateList, handler);