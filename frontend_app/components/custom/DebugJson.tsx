"use client";

import React, { useState } from "react";
import ReactJson from "react-json-view";
import { MoonIcon, SunIcon, ClipboardIcon, EyeIcon, EyeClosedIcon } from "lucide-react";

interface DebugJsonProps {
  data: any;
  title?: string;
  collapsed?: boolean | number;
  editable?: boolean;
  hideInProduction?: boolean;
}

const DebugJson: React.FC<DebugJsonProps> = ({
  data,
  title = "Debug Data",
  collapsed = true,
  editable = false,
  hideInProduction = true,
}) => {
  const [isDark, setIsDark] = useState(false);
  const [showData, setShowData] = useState(true);

  // Hide in production if enabled
  if (hideInProduction && process.env.NODE_ENV === "production") {
    return null;
  }

  const toggleDark = () => setIsDark(!isDark);
  const toggleVisibility = () => setShowData(!showData);

  // Tailwind-friendly theme names
  const theme = isDark ? "monokai" : "rjv-default"; // or "tomorrow", "harmonic"

  return (
    <div className="my-6 rounded-xl border bg-white shadow-sm transition-all duration-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-800/50">
        <div className="flex items-center gap-2">
          <EyeIcon className="h-4 w-4 text-gray-500" />
          <h4 className="font-medium text-gray-800 dark:text-gray-200">{title}</h4>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleVisibility}
            className="rounded p-1.5 text-gray-500 transition hover:bg-gray-200 hover:text-gray-800 dark:hover:bg-gray-700 dark:hover:text-gray-200"
            title={showData ? "Hide data" : "Show data"}
          >
            {showData ? (
              <EyeClosedIcon className="h-4 w-4" />
            ) : (
              <EyeIcon className="h-4 w-4" />
            )}
          </button>

          <button
            onClick={toggleDark}
            className="rounded p-1.5 text-gray-500 transition hover:bg-gray-200 hover:text-gray-800 dark:hover:bg-gray-700 dark:hover:text-gray-200"
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? (
              <SunIcon className="h-4 w-4" />
            ) : (
              <MoonIcon className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* JSON Viewer */}
      <div className="overflow-auto p-4">
        {showData ? (
          <ReactJson
            src={data}
            theme={theme}
            collapsed={collapsed}
            name={false}
            displayDataTypes={false}
            displayObjectSize={false}
            enableClipboard={true}
            collapseStringsAfterLength={80}
            indentWidth={2}
            onEdit={editable ? undefined : false}
            onAdd={editable ? undefined : false}
            onDelete={editable ? undefined : false}
            style={{
              fontSize: "0.875rem", // text-sm
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas",
              padding: "0.5rem",
              borderRadius: "0.5rem",
              backgroundColor: isDark ? "#272822" : "#fafafa",
            }}
          />
        ) : (
          <div className="flex h-24 items-center justify-center rounded-lg bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
            <span>Data hidden</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t bg-gray-50 px-4 py-2 text-xs text-gray-500 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400">
        <span>Inspectable JSON object</span>
        <div className="flex items-center gap-1">
          <ClipboardIcon className="h-3.5 w-3.5" />
          <span>Click key/value to copy</span>
        </div>
      </div>
    </div>
  );
};

export default DebugJson;
