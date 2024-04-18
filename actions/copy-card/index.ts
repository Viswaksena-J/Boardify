"use server";

import { auth } from "@clerk/nextjs";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { CopyCard } from "./schema";

const handler = async (data:InputType): Promise<ReturnType> => {
    const {userId, orgId} = auth();

    if(!userId || !orgId){
        return {
            error: "Un Authorized",
        }
    }

    const {id,boardId} = data;
    let card;

    try {
       const cardToCopy = await db.card.findUnique({
        where:{
            id,
            list:{
                board:{
                    orgId,
                }
            }
        },
       });

       if(!cardToCopy){
           return {
               error: "Card not found",
           }
       }

       const lastCard = await db.card.findFirst({
           where:{
               listId: cardToCopy.listId,
           },
           orderBy:{
               order:"desc",
           },
           select:{
               order:true,
           }
       });

       const newOrder = lastCard ? lastCard.order + 1 : 1;

       card = await db.card.create({
            data:{
                title: `${cardToCopy.title} - Copy`,
                order: newOrder,
                description: cardToCopy.description,
                listId: cardToCopy.listId,
            },
       })

    } catch (error) {
        return {
            error: "Failed to copy card",
        }
    }

    revalidatePath(`/board/${boardId}`);
    return {data: card};
}

export const copyCard = CreateSafeAction(CopyCard, handler);