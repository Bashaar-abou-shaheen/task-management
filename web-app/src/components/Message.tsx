// src/components/showMessage.ts
import { message } from "antd";

type MessageType = "success" | "error" | "info" | "warning" | "loading";

const showMessage = (
  type: MessageType,
  content: string,
  duration: number = 50
) => {
  console.log("Message:", content);
  message.open({
    type,
    content,
    duration,
    style: {
      marginTop: "90px",
      fontWeight: 500,
      fontSize: "26px",
    },
  });
};

export default showMessage;
