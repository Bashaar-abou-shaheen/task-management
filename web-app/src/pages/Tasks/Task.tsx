import React, { useState } from "react";
import { RadioChangeEvent } from "antd";

import ButtonMenu from "../../components/ButtonMenu";
import AddTask from "./AddTask";
import IF from "../../components/IF";
import Tasks from "./Tasks";

const Task = () => {
  const [activeTab, setActiveTab] = useState("1");

  const handleMenuClick = (menuEvent: RadioChangeEvent) => {
    const selectedMenuValue = menuEvent.target.value;
    setActiveTab(selectedMenuValue);
  };

  return (
    <div style={{ width: "100%", padding: 0, margin: 0 }}>
      <div className="w-full flex justify-center mt-8">
        <ButtonMenu
          options={[
            { label: "Tasks", value: "1" },
            { label: "Add Task", value: "2" },
          ]}
          onChange={(value) => handleMenuClick(value)}
          value={activeTab}
        />
      </div>

      <IF
        condition={activeTab === "1"}
        trueComponent={
          <div style={{ width: "100%", minHeight: "100vh", padding: 0, margin: 0 }}>
            <Tasks />
          </div>
        }
      />

      <IF
        condition={activeTab === "2"}
        trueComponent={
          <div style={{ width: "100%", padding: 0, margin: 0 }}>
            <AddTask />
          </div>
        }
      />
    </div>
  );
};

export default Task;
