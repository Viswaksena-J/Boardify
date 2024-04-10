"use client";

import { ListWithCards } from "@/types"; 
import { ListForm } from "./list-form";

interface ListContainerProps {
    data: ListWithCards[];
    boardId: string;
}

export const LisContainer = ({
    data,
    boardId
}:ListContainerProps) => {
    return(
        <ol>
            <ListForm />
            <div className="w-1 flex-shrink-0"/>
        </ol>
    )
}