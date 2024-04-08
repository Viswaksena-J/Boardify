"use server";

import { auth } from "@clerk/nextjs";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { CreateBoard } from "./schema";

const handler = async (data:InputType): Promise<ReturnType> => {
    const {userId, orgId} = auth();

    if(!userId || !orgId){
        return {
            error: "Un Authorized",
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
    } catch (error) {
        return {
            error: "Failed to create board",
        }
    }

    revalidatePath(`/board/${board.id}`);
    return {data: board};
};

export const createBoard = CreateSafeAction(CreateBoard, handler);