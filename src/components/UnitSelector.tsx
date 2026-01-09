"use client";

import { useState } from "react";
import { EUnitType, UNIT_COLORS, UNIT_KOREAN_NAMES } from "@/types/card";
import { getAllUnits } from "@/data/cards";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

interface UnitSelectorProps {
    selectedUnits: EUnitType[];
    onToggleUnit: (unit: EUnitType) => void;
    onSelectAll: () => void;
    onClearAll: () => void;
}

export default function UnitSelector({
    selectedUnits,
    onToggleUnit,
    onSelectAll,
    onClearAll,
}: UnitSelectorProps) {
    const [isOpen, setIsOpen] = useState(true);
    const units = getAllUnits();

    return (
        <div className="flex flex-col gap-2 p-3 md:p-4 bg-gray-800 border-b border-gray-700 transition-all duration-300">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                    >
                        <span>유닛 선택 ({selectedUnits.length})</span>
                        {isOpen ? (
                            <FaChevronUp className="text-xs" />
                        ) : (
                            <FaChevronDown className="text-xs" />
                        )}
                    </button>

                    <div
                        className={`flex gap-2 transition-opacity duration-200 ${
                            isOpen
                                ? "opacity-100"
                                : "opacity-0 pointer-events-none"
                        }`}
                    >
                        <button
                            onClick={onSelectAll}
                            className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors"
                        >
                            전체
                        </button>
                        <button
                            onClick={onClearAll}
                            className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors"
                        >
                            해제
                        </button>
                    </div>
                </div>
            </div>

            <div
                className={`
        overflow-hidden transition-all duration-300 ease-in-out
        ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}
      `}
            >
                <div className="flex flex-wrap gap-1.5 md:gap-2 pt-1">
                    {units.map((unit) => {
                        const isSelected = selectedUnits.includes(unit);
                        return (
                            <button
                                key={unit}
                                onClick={() => onToggleUnit(unit)}
                                className={`
                  px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-medium text-xs md:text-sm
                  transition-all duration-200 flex items-center gap-1
                  ${
                      isSelected
                          ? "ring-2 ring-offset-1 md:ring-offset-2 ring-offset-gray-800"
                          : "opacity-40 hover:opacity-70"
                  }
                `}
                                style={{
                                    backgroundColor: UNIT_COLORS[unit],
                                    color:
                                        unit === "Ninja"
                                            ? "#fff"
                                            : unit === "Thor"
                                            ? "#000"
                                            : "#fff",
                                    boxShadow: isSelected
                                        ? `0 0 10px ${UNIT_COLORS[unit]}50`
                                        : "none",
                                }}
                            >
                                {UNIT_KOREAN_NAMES[unit]}
                                {isSelected && (
                                    <span className="text-[10px] md:text-xs">
                                        ✓
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
