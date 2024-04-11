"use client";

import { useEffect, useState } from "react";
import { ListWithCards } from "@/types"; 
import { ListForm } from "./list-form";
import { ListItem } from "./list-item";

interface ListContainerProps {
    data: ListWithCards[];
    boardId: string;
}

export const ListContainer = ({
    data,
    boardId
}:ListContainerProps) => {
    const [orderedData, setOrderedData] = useState(data);

    // This will make the drag and drop more optimistic
    useEffect(() => {
        setOrderedData(data);
    }, [data]);

    return(
        <ol className="flex gap-x-3 h-full">
            {orderedData.map((list,index) =>{
                return(
                    <ListItem
                        key = {list.id}
                        index = {index}
                        data = {list}
                    />
                )
            })}
            <ListForm />
            <div className="w-1 flex-shrink-0"/>
        </ol>
    )
}
