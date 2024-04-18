import { auth } from "@clerk/nextjs";
import { db } from "./db";

const DAY_IN_MS = 84_400_000;

export const Subscription = async() => {
    const {orgId} = auth();

    if(!orgId){
        return false;
    }

    const orgSubscription = await db.orgSubscription.findUnique({
        where:{
            orgId,
        },
        select:{
            stripeSubscriptionId:true,
            stripeCustomerId:true,
            stripeCurrentPeriodEnd:true,
            stripePriceId:true,
        }
    });

    if(!orgSubscription){
        return false;
    }

    const isValid = 
        orgSubscription.stripePriceId &&
        orgSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now();

    return !!isValid; // return true if valid, false if not(boolean)
}