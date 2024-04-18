"use server";

import { auth } from "@clerk/nextjs";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { CreateBoard } from "./schema";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { hasAvailableCount, incrementAvailableCount } from "@/lib/org-limit";

const handler = async (data:InputType): Promise<ReturnType> => {
    const {userId, orgId} = auth();

    if(!userId || !orgId){
        return {
            error: "Un Authorized",
        }
    }

    const canCreate = await hasAvailableCount();
    if(!canCreate){
        return{
            error: "You have reached the maximum limit of boards. Please upgrade your plan to create more boards."
        }
    }

    const {title, image} = data;

    const [ 
        imageId,
        imageThumbUrl,
        imageFullUrl,
        imageLinkHTML,
        imageUserName
    ] = image.split("|")
    // console.log({imageId, imageThumbUrl, imageFullUrl, imageLinkHTML, imageUserName});

    if(!imageId || !imageThumbUrl || !imageFullUrl || !imageLinkHTML || !imageUserName){
        return {
            error: "Missing field. Failed to create board",
        }
    }

    let board;

    try {
        // throw new Error("ffcs");
        board = await db.board.create({
            data: {
                title,
                orgId,
                imageId,
                imageThumbUrl,
                imageFullUrl,
                imageUserName,
                imageLinkHTML,
            }
        });

        await incrementAvailableCount();
        
        await createAuditLog({
            entityId: board.id,
            entityType: ENTITY_TYPE.BOARD,
            entityTitle: board.title,
            action: ACTION.CREATE,
        });

    } catch (error) {
        return {
            error: "Failed to create board",
        }
    }

    revalidatePath(`/board/${board.id}`);
    return {data: board};
};

export const createBoard = CreateSafeAction(CreateBoard, handler);