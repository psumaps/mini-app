/// <reference types="vite-plugin-svgr/client" />
import type { Meta, StoryObj } from "@storybook/react";
import Modal from "../../web/src/pages/modal/modal";
import Button from "../../shared/components/common/button";
import FilterIcon from "../assets/filter.svg?react";
import React, { useState } from "react";

const meta = {
  title: "modal/Modal",
  component: Modal,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export function ModalEventFilter() {
  const [modalActive, setModalActive] = useState(false);
  return (
    <div>
      <div>
        <Button
          className={`h-10 w-10 rounded-forty `}
          children={<FilterIcon />}
          onClick={() => setModalActive(true)}
        ></Button>
        <Modal active={modalActive} setActive={setModalActive} />
      </div>
    </div>
  );
}
