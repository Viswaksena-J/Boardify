// "use server";

// import { auth } from "@clerk/nextjs";
// import { InputType, ReturnType } from "./types";
// import { db } from "@/lib/db";
// import { revalidatePath } from "next/cache";
// import { CreateSafeAction } from "@/lib/create-safe-action";
// import { CreateList } from "./schema";

// const handler = async (data:InputType): Promise<ReturnType> => {
//     const {userId, orgId} = auth();

//     if(!userId || !orgId){
//         return {
//             error: "Un Authorized",
//         }
//     }

//     const {title, boardId} = data;
//     let list;

//     try {
//         const board = await db.board.findUnique({
//             where:{
//                 id: boardId,
//                 orgId,
//             }
//         })

//         if(!board){
//             return{
//                 error: "Board not found",
//             };
//         }

//         const lastList = await db.list.findFirst({
//             where:{
//                 boardId: boardId,
//             },
//             orderBy:{
//                 order: "desc",
//             },
//             select:{
//                 order: true,
//             }
//         });

//         const newOrder = lastList ? lastList.order + 1 : 1;

//         // throw new Error("ffcs");
//         list = await db.list.create({
//             data:{
//                 title,
//                 boardId,
//                 order: newOrder,
//             }
//         });
//     } catch (error) {
//         return {
//             error: "Failed to create list",
//         }
//     }

//     revalidatePath(`/board/${boardId}`);
//     return {data: list};
// }

// export const createList = CreateSafeAction(CreateList, handler);


'use server'

import { auth } from '@clerk/nextjs'
import { revalidatePath } from 'next/cache'

import { db } from '@/lib/db'
import { CreateSafeAction } from '@/lib/create-safe-action'

import { CreateList } from './schema'
import { InputType, ReturnType } from './types'
// import { createAuditLog } from '@/lib/create-audit-log'
// import { ACTION, ENTITY_TYPE } from '@prisma/client'

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth()

    if (!userId || !orgId) {
        return {
            error: 'Unauthorized',
        }
    }

    const { title, boardId } = data
    let list

    try {
        const board = await db.board.findUnique({
            where: {
                id: boardId,
                orgId,
            },
        })

        if (!board) {
            return {
                error: 'Board not found',
            }
        }

        const lastList = await db.list.findFirst({
            where: { boardId: boardId },
            orderBy: { order: 'desc' },
            select: { order: true },
        })

        const newOrder = lastList ? lastList.order + 1 : 1

        list = await db.list.create({
            data: {
                title,
                boardId,
                order: newOrder,
            },
        })

        // await createAuditLog({
        //     entityTitle: list.title,
        //     entityId: list.id,
        //     entityType: ENTITY_TYPE.LIST,
        //     action: ACTION.CREATE,
        // })
    } catch (error) {
        return {
            error: 'Failed to create.',
        }
    }

    revalidatePath(`/board/${boardId}`)
    return { data: list }
}

export const createList = CreateSafeAction(CreateList, handler)