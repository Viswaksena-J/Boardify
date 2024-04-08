"use client";

import { createBoard } from "@/actions/create-board";


import { useAction } from "@/hooks/use-action";
import { FormInput } from "@/components/form/form-input";
import { FormSubmit } from "@/components/form/form-submit";

export const Form = () => {
    const { execute, fieldErrors } = useAction(createBoard, {
        onSuccess: (data) => {
            console.log(data, "Success");
        },
        onError: (error) => {
            console.log(error, "Error");
        }
    });
    const onSubmit = (formData: FormData) => {
        const title = formData.get("title") as string;

        console.log({title});

        execute({ title });
    }
    return(
        <form action={onSubmit}>
            <div className="flex flex-col space-y-2">
                <FormInput
                    label="Board Title" 
                    errors={fieldErrors}
                    id="title"
                />
            </div>
            <FormSubmit>
                Save
            </FormSubmit>
        </form>
    );
};