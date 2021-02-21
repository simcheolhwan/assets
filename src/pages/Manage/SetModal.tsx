import React, { FC } from "react"
import { Button, Modal, Form } from "antd"
import { FormProps } from "antd/lib/form"
import { useModal } from "../../hooks"

interface Props {
  form: FormProps
  type: "add" | "edit"
  submit: () => Promise<void>
}

const SetModal: FC<Props> = ({ form, type, submit, children }) => {
  const { isOpen, open, close } = useModal()

  const onSet = async () => {
    await submit()
    close()
  }

  /* render */
  const button = {
    add: { type: "default" as const, children: "추가하기" },
    edit: { type: "text" as const, children: "편집" },
  }

  return (
    <>
      <Button {...button[type]} onClick={open} />

      <Modal
        title={button[type].children}
        visible={isOpen}
        onOk={onSet}
        onCancel={close}
      >
        <Form {...form} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
          {children}
        </Form>
      </Modal>
    </>
  )
}

export default SetModal
