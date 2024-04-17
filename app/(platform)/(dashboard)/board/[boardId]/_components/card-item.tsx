"use client";

import { useCardModel } from "@/hooks/use-card-model";
import { Draggable } from "@hello-pangea/dnd";
import { Card } from "@prisma/client";

interface CardItemProps{
    data: Card;
    index: number;
}

export const CardItem = ({
    data,
    index
}:CardItemProps) => {
    const cardModel = useCardModel()

    return(
        <Draggable
            draggableId={data.id}
            index={index}
        >
            {(provided) => (
                <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    role="button"
                    onClick={() => cardModel.onOpen(data.id)}
                    className="truncate border-2 border-transparent hover:border-black py-2 px-3 text-sm bg-white rounded-md shadow-sm"
                >
                    {data.title}
                </div>
            )}
        </Draggable>
    )
}