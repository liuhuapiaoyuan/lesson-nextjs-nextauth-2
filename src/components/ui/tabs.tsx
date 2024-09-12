"use client";
import React, { useEffect, useState } from "react";

// 定义 TabItem 的类型
interface TabItem {
  title: string;
  value: string;
  content: React.ReactNode;
}

// 定义 Tab 组件的 Props 类型
interface TabProps {
  options: TabItem[];
  activeTab?: string; // 外部可控的 activeTab
  onChange?: (value: string) => void; // 当 Tab 切换时触发的回调
}

const Tab: React.FC<TabProps> = ({ options, activeTab, onChange }) => {
  // 内部状态，用于管理当前选中的 Tab
  const [internalActiveTab, setInternalActiveTab] = useState(
    activeTab || options[0].value
  );

  // 当外部传入的 activeTab 变化时，更新内部状态
  useEffect(() => {
    if (activeTab) {
      setInternalActiveTab(activeTab);
    }
  }, [activeTab]);

  // 处理 Tab 点击事件
  const handleTabClick = (value: string) => {
    setInternalActiveTab(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className="tab-container">
      <div className="tab-header flex gap-4  mb-4 border-b-[1px] border-gray-500">
        {options.map((option) => (
          <button
            type="button"
            key={option.value}
            className={`py-2  border-b-[2px] flex-1 px-4 ${
              internalActiveTab === option.value
                ? "border-blue-500 text-blue-500"
                : " border-[transparent] text-gray-500"
            }`}
            onClick={() => handleTabClick(option.value)}
          >
            {option.title}
          </button>
        ))}
      </div>
      <div className="tab-content">
        {options.find((option) => option.value === internalActiveTab)?.content}
      </div>
    </div>
  );
};

export default Tab;
