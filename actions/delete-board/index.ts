"use server";

import { auth } from "@clerk/nextjs";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { DeleteBoard } from "./schema";
import { redirect } from "next/navigation";

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
    } catch (error) {
        return {
            error: "Failed to delete board",
        }
    }

    revalidatePath(`/organization/${orgId}`);
    redirect(`/organization/${orgId}`);
}

export const deleteBoard = CreateSafeAction(DeleteBoard, handler);