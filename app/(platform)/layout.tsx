import { ModelProvider } from "@/components/providers/model-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

const PlatformLayout = ({
    children
}:{
    children: React.ReactNode
}) => {
    return(
        <ClerkProvider>
            <QueryProvider>
                <Toaster />
                <ModelProvider />
                {children}
            </QueryProvider>
        </ClerkProvider>
    )
}

export default PlatformLayout;