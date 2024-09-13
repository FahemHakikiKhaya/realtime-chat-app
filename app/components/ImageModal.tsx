"use client";

import React from "react";
import Modal, { ModalProps } from "./Modal";
import Image from "next/image";

interface ImageModalProps extends ModalProps {
  image?: string | null;
}

const ImageModal: React.FC<ImageModalProps> = ({ image, opened, onClose }) => {
  if (!image) {
    return null;
  }
  console.log({ image });

  return (
    <Modal opened={opened} onClose={onClose} noPadding>
      <div className="w-full h-80 relative">
        <Image
          alt="image"
          className="absolute top-0 object-cover"
          layout="fill"
          src={image}
        />
      </div>
    </Modal>
  );
};

export default ImageModal;
