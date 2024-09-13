"use client";

import useConversation from "@/app/hooks/useConversation";
import axios from "axios";
import { CldUploadButton } from "next-cloudinary";
import {
  FieldValue,
  FieldValues,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { HiPaperAirplane, HiPhoto } from "react-icons/hi2";

const Form = () => {
  const { conversationId } = useConversation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      message: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setValue("message", "", { shouldValidate: true });

    axios.post("/api/messages", {
      ...data,
      conversationId,
    });
  };

  const handleUpload = (result: any) => {
    axios.post("/api/messages", {
      image: result?.info?.secure_url,
      conversationId,
    });
  };

  return (
    <div className="py-4 px-4 bg-white border-t flex items-center gap-2 lg:gap-4 w-full">
      <CldUploadButton
        options={{ maxFiles: 1 }}
        uploadPreset="qupzearc"
        onSuccess={handleUpload}
      >
        {" "}
        <HiPhoto size={30} className="text-primary cursor-pointer" />{" "}
      </CldUploadButton>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center gap-2 lg:gap-4 w-full"
      >
        <input
          type="text"
          placeholder="Write a message"
          className="input input-bordered input-md w-full rounded-full "
          {...register("message", { required: true })}
        />
        <button
          type="submit"
          className="btn btn-primary btn-outline btn-circle"
        >
          <HiPaperAirplane size={18} />
        </button>
      </form>
    </div>
  );
};

export default Form;
