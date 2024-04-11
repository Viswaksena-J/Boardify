"use client";

import { ListWithCards } from "@/types"
import { ListHeader } from "./list-header";

interface ListItemProps{
    data: ListWithCards;
    index: number;
}

export const ListItem = ({
    data,
    index
}:ListItemProps) => {
    return(
        <li className="h-full shrink-0 w-[272px] select-none">
            <div className="w-full rounded-md bg-[#f1f2f4] shadow-md pb-2">
                <ListHeader data={data}/>
            </div>
        </li>
    )
}

// export const ListItem = () => {
//     return(
//         <li className="h-full shrink-0 w-[272px] select-none">
//             <div className="w-full rounded-md bg-[#1f1f2f4] shadow-md pb-2">
//                 <ListHeader/>
//             </div>
//         </li>
//     )
// }