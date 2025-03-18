"use client";

import type React from "react"
import { useState } from "react"

export default function BinarySearchVisualizer() {
    // Create a sorted array of numbers
    const [array, setArray] = useState(Array.from({ length: 15 }, (_, i) => i * 5 + 5))
    const [target, setTarget] = useState(35)
    const [low, setLow] = useState<number | null>(null)
    const [high, setHigh] = useState<number | null>(null)
    const [mid, setMid] = useState<number | null>(null)
    const [found, setFound] = useState<boolean | null>(null)
    const [steps, setSteps] = useState<string[]>([])
    const [currentStep, setCurrentStep] = useState(0)
    const [isComplete, setIsComplete] = useState(false)

    // Reset the visualization
    const reset = () => {
        setLow(null)
        setHigh(null)
        setMid(null)
        setFound(null)
        setSteps([])
        setCurrentStep(0)
        setIsComplete(false)
    }

    // Initialize the binary search
    const startSearch = () => {
        reset()
        const newSteps: string[] = []
        let lowIndex = 0
        let highIndex = array.length - 1

        newSteps.push(`Initialize: low = 0, high = ${array.length - 1}`)

        while (lowIndex <= highIndex) {
            const midIndex = Math.floor((lowIndex + highIndex) / 2)

            if (array[midIndex] === target) {
                newSteps.push(`Found target ${target} at index ${midIndex}!`)
                break
            } else if (array[midIndex] < target) {
                newSteps.push(
                    `${array[midIndex]} < ${target}, so search right half. low = ${midIndex + 1}, high = ${highIndex}`,
                )
                lowIndex = midIndex + 1
            } else {
                newSteps.push(`${array[midIndex]} > ${target}, so search left half. low = ${lowIndex}, high = ${midIndex - 1}`)
                highIndex = midIndex - 1
            }

            if (lowIndex > highIndex) {
                newSteps.push(`Target ${target} not found in the array.`)
            }
        }

        setSteps(newSteps)
        setLow(0)
        setHigh(array.length - 1)
    }

    // Step through the binary search
    const nextStep = () => {
        if (currentStep >= steps.length - 1) {
            setIsComplete(true)
            return
        }

        const step = steps[currentStep + 1]
        setCurrentStep(currentStep + 1)

        if (step.includes("Found target")) {
            const midIndex = Number.parseInt(step.match(/index (\d+)/)?.[1] || "0")
            setMid(midIndex)
            setFound(true)
            return
        }

        if (step.includes("not found")) {
            setFound(false)
            return
        }

        // Parse the low and high values from the step description
        const lowMatch = step.match(/low = (\d+)/)
        const highMatch = step.match(/high = (\d+)/)

        if (lowMatch && highMatch) {
            const newLow = Number.parseInt(lowMatch[1])
            const newHigh = Number.parseInt(highMatch[1])
            const newMid = Math.floor((newLow + newHigh) / 2)

            setLow(newLow)
            setHigh(newHigh)
            setMid(newMid)
        }
    }

    // Generate a new random target
    const generateRandomTarget = () => {

        const randomIndex = Math.floor(Math.random() * array.length)

        console.log(randomIndex)
        setTarget(array[randomIndex])
        reset()
    }

    // Handle target input change
    const handleTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number.parseInt(e.target.value)
        if (!isNaN(value)) {
            setTarget(value)
            reset()
        }
    }

    return (
        <div className="flex flex-col gap-6 ">
            <div className="dark:bg-white rounded-md dark:text-black">

                {/* Control Panel */}
                <div className=" rounded-lg shadow-md p-6 ">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-2">
                                <label htmlFor="target" className="font-medium">
                                    Target:
                                </label>
                                <input
                                    id="target"
                                    type="number"
                                    value={target}
                                    onChange={handleTargetChange}
                                    className="w-20 px-3 py-2 border dark:text-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <button
                                onClick={generateRandomTarget}
                                className="px-4 py-2 border border-gray-300 rounded-md hover: transition-colors"
                            >
                                <span className="flex items-center gap-2">
                                    <i className="lucide lucide-shuffle"></i>
                                    Random Target
                                </span>
                            </button>
                            <button
                                onClick={startSearch}
                                disabled={steps.length > 0}
                                className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${steps.length > 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                                Start Search
                            </button>
                            <button
                                onClick={nextStep}
                                disabled={steps.length === 0 || isComplete}
                                className={`px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2 ${steps.length === 0 || isComplete ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                                Next Step <i className="lucide lucide-arrow-right"></i>
                            </button>
                            <button
                                onClick={reset}
                                className="px-4 py-2 border border-gray-300 rounded-md hover: transition-colors flex items-center gap-2"
                            >
                                <i className="lucide lucide-rotate-ccw"></i> Reset
                            </button>
                        </div>

                        <div className="text-sm  p-2 bg-gray-50 rounded-md font-bold text-red-800 ">
                            {currentStep < steps.length ? steps[currentStep] : "Click 'Start Search' to begin"}
                        </div>
                    </div>
                </div>

                {/* Array Visualization */}
                <div className="flex flex-wrap gap-2 justify-center my-5">
                    {array.map((num, index) => {
                        let bgColor = ""
                        let textColor = "text-gray-900"

                        if (low !== null && high !== null) {
                            if (index < low || index > high) {
                                bgColor = " opacity-30"
                                textColor = "text-gray-400"
                            } else if (index === mid) {
                                bgColor = found === true ? "bg-green-500" : found === false ? "bg-red-500" : "bg-yellow-500"
                            } else {
                                bgColor = "bg-blue-100"
                                textColor = "text-blue-900"
                            }
                        }

                        return (
                            <div
                                key={index}
                                className={`flex flex-col items-center justify-center w-12 h-12 rounded-md ${bgColor} ${textColor} transition-all duration-300`}
                            >
                                <div className="font-bold">{num}</div>
                                <div className="text-xs">{index}</div>
                            </div>
                        )
                    })}
                </div>

                {/* Status Display */}
                <div className=" rounded-lg shadow-md p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex flex-col items-center">
                            <div className="text-sm font-medium text-gray-500">Low Index</div>
                            <div className="text-xl font-bold">{low !== null ? low : "-"}</div>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="text-sm font-medium text-gray-500">Mid Index</div>
                            <div className="text-xl font-bold">{mid !== null ? mid : "-"}</div>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="text-sm font-medium text-gray-500">High Index</div>
                            <div className="text-xl font-bold">{high !== null ? high : "-"}</div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Explanation */}
            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">How Binary Search Works</h2>
                <ol className="list-decimal pl-5 space-y-2">
                    <li>
                        Start with a <strong>sorted</strong> array.
                    </li>
                    <li>
                        Set <code className=" px-1 rounded">low</code> to the first index (0) and{" "}
                        <code className=" px-1 rounded">high</code> to the last index (length-1).
                    </li>
                    <li>
                        Calculate the middle index:{" "}
                        <code className=" px-1 rounded">mid = Math.floor((low + high) / 2)</code>.
                    </li>
                    <li>If the middle element equals the target, we found it!</li>
                    <li>
                        If the middle element is less than the target, search the right half (
                        <code className=" px-1 rounded">low = mid + 1</code>).
                    </li>
                    <li>
                        If the middle element is greater than the target, search the left half (
                        <code className=" px-1 rounded">high = mid - 1</code>).
                    </li>
                    <li>
                        Repeat steps 3-6 until the element is found or{" "}
                        <code className=" px-1 rounded">low &gt; high</code> (element not in array).
                    </li>
                </ol>
            </div>
        </div>
    )
}

