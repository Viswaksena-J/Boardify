import { useState, useCallback } from "react";

import { ActionState, FieldErrors } from "@/lib/create-safe-action";
import { set } from "zod";

type Action<TInput, TOutput> = (data: TInput) => Promise<ActionState<TInput, TOutput>>;

interface useActionOptions<TOutput>{
    onSuccess?: (data: TOutput) => void;
    onError?: (error: string) => void;
    onCompleted?: () => void;
};

export const useAction = <TInput, TOutput>(
    action: Action<TInput, TOutput>,
    options: useActionOptions<TOutput> = {}
) => {
    const [fieldErrors, setFieldErrors] = useState<FieldErrors<TInput> | undefined>(
        undefined
    );
    const [error, setError] = useState<string | undefined>(undefined);
    const [data, setData] = useState<TOutput | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const execute = useCallback(
        async (input: TInput) => {
            setIsLoading(true);

            try {
                const result = await action(input);

                if(!result){
                    return;
                }

                if(result.fieldErrors){
                    setFieldErrors(result.fieldErrors);
                }

                if(result.error){
                    setError(result.error);
                    options.onError?.(result.error);
                }

                if(result.data){
                    setData(result.data);
                    options.onSuccess?.(result.data);
                }
            } finally{
                setIsLoading(false);
                options.onCompleted?.();
            }
        },
        [action, options]
    );

    return {
        execute,
        fieldErrors,
        error,
        data,
        isLoading,
    }
}