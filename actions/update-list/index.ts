"use server";

import { auth } from "@clerk/nextjs";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { UpdateList } from "./schema";

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
    } catch (error) {
        return {
            error: "Failed to update board",
        }
    }

    revalidatePath(`/board/${boardId}`);
    return {data: list};
}

export const updateList = CreateSafeAction(UpdateList, handler);