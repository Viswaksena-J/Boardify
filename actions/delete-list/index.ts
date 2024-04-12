"use server";

import { auth } from "@clerk/nextjs";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { DeleteList } from "./schema";

const handler = async (data:InputType): Promise<ReturnType> => {
    const {userId, orgId} = auth();

    if(!userId || !orgId){
        return {
            error: "Un Authorized",
        }
    }

    const {id,boardId} = data;
    let list;

    try {
        // throw new Error("ffcs");
        list = await db.list.delete({
            where: {
                id,
                boardId,
                board:{
                    orgId,
                }
            },
        });
    } catch (error) {
        return {
            error: "Failed to delete list",
        }
    }

    revalidatePath(`/board/${boardId}`);
    return {data: list};
}

export const deleteList = CreateSafeAction(DeleteList, handler);