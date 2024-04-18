import { ActivityItem } from "@/components/activity-item";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation";

export const ActivityList = async () => {
    const {orgId} = auth();

    if(!orgId){
        redirect('/select-org')
    }

    const auditLogs = await db.auditLog.findMany({
        where:{
            orgId,
        },
        orderBy:{
            createdAt:"desc",
        }
    })
    return(
        <ol className="space-y-4 mt-4">
            <p className="hidden last:block text-xs text-center text-muted-foregrounds">
                No Activity Found in this organization
            </p>
            {auditLogs.map((log) => (
                <ActivityItem
                    key={log.id}
                    data={log}
                />
            ))}
        </ol>
    )
};

ActivityList.Skeleton = function ActivityListSkeleton () {
    return(
        <ol className="space-y-4 mt-4">
            <Skeleton className="h-14 w-[80%]"/>
            <Skeleton className="h-14 w-[50%]"/>
            <Skeleton className="h-14 w-[70%]"/>
            <Skeleton className="h-14 w-[60%]"/>
            <Skeleton className="h-14 w-[85%]"/>
            <Skeleton className="h-14 w-[75%]"/>
            <Skeleton className="h-14 w-[80%]"/>
        </ol>
    )
}