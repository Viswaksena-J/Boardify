import {string, z} from "zod";

export const DeleteList = z.object({
    id: z.string(),
    boardId: z.string(),
})