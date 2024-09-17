"use client";

import Modal, { ModalProps } from "@/app/components/Modal";
import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FC, useMemo, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ReactSelect from "react-select";

interface AddConversationModalProps extends ModalProps {
  users: User[];
}

const AddConversationModal: FC<AddConversationModalProps> = ({
  opened,
  onClose,
  users,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const userOptions = useMemo(() => {
    return users.map(({ id, name }) => ({ value: id, label: name }));
  }, [users]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      members: [],
    },
  });

  const members = watch("members");

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    try {
      const res = await axios.post("/api/conversations", {
        ...data,
        isGroup: true,
      });

      router.refresh();
      onClose();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Start a Group Chat"
      description="Requires 3 or more participants to begin"
      action={
        <>
          <button onClick={onClose}>Cancel</button>
          <button
            className="btn btn-outline"
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            Create
          </button>
        </>
      }
    >
      <label className="form-control w-full gap-2 mt-4">
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
      <label className="form-control w-full gap-2 mt-4">
        <span className="label-text font-semibold">Users</span>
        <ReactSelect
          isMulti
          value={members}
          onChange={(value) =>
            setValue("members", value, { shouldValidate: true })
          }
          options={userOptions}
          menuPortalTarget={document.body}
          styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
        />
      </label>
    </Modal>
  );
};

export default AddConversationModal;
