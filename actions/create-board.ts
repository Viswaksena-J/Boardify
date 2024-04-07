"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export type State = {
    errors?: {
        title?: string[];
    };
    message?: string | null;
}

const CreateBoard = z.object({
    title: z.string().min(3, {
        message: "Title must be at least 3 characters long",
    }),
})

export async function create(prevState: State, formData: FormData){
    const validatedFields = CreateBoard.safeParse({
        title: formData.get("title"),
    })

    if(!validatedFields.success){
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields."
        }
    }

    const { title } = validatedFields.data;

    try{
        await db.board.create({
            data:{
                title,
            }
        });
    } catch(error){
        return{
            message: "Database Error. Please try again later."
        }
    }

    revalidatePath("/organization/org_2edCRQtHNey7122AIAFbj03QMJC")
    redirect("/organization/org_2edCRQtHNey7122AIAFbj03QMJC")
}