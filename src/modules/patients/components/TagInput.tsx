// src/components/patients/tag-input.tsx
"use client";

import { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";

type TagInputProps = {
  name: string; // used for the hidden input's `name` attribute
  label: string;
  placeholder?: string;
  defaultValue?: string[];
};

export function TagInput({
  name,
  label,
  placeholder,
  defaultValue = [],
}: TagInputProps) {
  const [tags, setTags] = useState<string[]>(defaultValue);
  const [inputValue, setInputValue] = useState("");

  function addTag() {
    const trimmed = inputValue.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setInputValue("");
  }

  function removeTag(tagToRemove: string) {
    setTags(tags.filter((t) => t !== tagToRemove));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
      // quick-remove the last chip when backspacing on an empty input
      setTags(tags.slice(0, -1));
    }
  }

  return (
    <div>
      <label className='block text-sm font-medium mb-1'>{label}</label>

      <div className='flex flex-wrap gap-2 rounded-md border p-2'>
        {tags.map((tag) => (
          <span
            key={tag}
            className='flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800'
          >
            {tag}
            <button
              type='button'
              onClick={() => removeTag(tag)}
              aria-label={`Remove ${tag}`}
            >
              <X size={14} />
            </button>
          </span>
        ))}

        <input
          type='text'
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag} // capture a typed value if they click away instead of pressing Enter
          placeholder={placeholder}
          className='flex-1 min-w-30 border-none outline-none text-sm'
        />
      </div>

      {/* This is what the server action actually reads via formData.get(name) */}
      <input type='hidden' name={name} value={JSON.stringify(tags)} />
    </div>
  );
}
