"use client";

import { FC, useState } from "react";
import Modal, { ModalProps } from "../Modal";
import { User } from "@prisma/client";
import Avatar from "../Avatar";
import { useRouter } from "next/navigation";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { CldUploadButton } from "next-cloudinary";

interface SettingsModalProps extends ModalProps {
  currentUser: User | null;
}

const SettingsModal: FC<SettingsModalProps> = ({
  opened,
  currentUser,
  onClose,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: currentUser?.name,
      image: currentUser?.image,
    },
  });

  const image = watch("image");

  const handleUpload = (result: any) => {
    setValue("image", result?.info?.secure_url, {
      shouldValidate: true,
    });
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    try {
      await axios.post("/api/settings", data);

      router.refresh();
      onClose();
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      action={
        <>
          <button onClick={onClose}>Cancel</button>
          <button className="btn btn-neutral" onClick={handleSubmit(onSubmit)}>
            Change
          </button>
        </>
      }
      title="Profile"
      description="Edit your public information"
    >
      <div className="mt-4 space-y-4">
        <label className="form-control w-full gap-2">
          <span className="label-text font-semibold">Name</span>
          <input
            disabled={isLoading}
            required
            {...register("name", { required: true })}
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full bg-inherit"
          />
        </label>
        <p className="label-text mb-2 font-semibold">Photo</p>
        <div className="flex flex-row space-x-4 items-center">
          <Avatar image={image || currentUser?.image} />
          <CldUploadButton
            options={{ maxFiles: 1 }}
            uploadPreset="qupzearc"
            onSuccess={handleUpload}
          >
            <p className="label-text font-semibold cursor-pointer">Change</p>
          </CldUploadButton>
        </div>
      </div>
    </Modal>
  );
};

export default SettingsModal;
