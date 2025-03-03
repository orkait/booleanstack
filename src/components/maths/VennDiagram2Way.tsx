import React from 'react'
import TeX from '@matejmazur/react-katex'

const VennDiagram2Way = ({
    set_a_default = 0,
    set_b_default = 0,
    intersection_default = 0,
    renderExplanation = (twoSetUnion: number, setA: number, setB: number, intersection: number) => (
        <div className="rounded-lg flex flex-col">
            <TeX math="|A \cup B| = |A| + |B| - |A \cap B|" />
            <TeX math={`|A \\cup B| = {setA} + {setB} - {intersection} = {twoSetUnion}`} />
        </div>
    )
}) => {
    const [setA, setSetA] = React.useState(set_a_default)
    const [setB, setSetB] = React.useState(set_b_default)
    const [intersection, setIntersection] = React.useState(intersection_default)

    return (
        <>
            <div className="grid md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Set A Size</label>
                    <input
                        type="number"
                        className="w-full px-3 py-2 border rounded-lg"
                        value={setA}
                        onChange={(e) => setSetA(parseInt(e.target.value) || 0)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Set B Size</label>
                    <input
                        type="number"
                        className="w-full px-3 py-2 border rounded-lg"
                        value={setB}
                        onChange={(e) => setSetB(parseInt(e.target.value) || 0)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Intersection Size</label>
                    <input
                        type="number"
                        className="w-full px-3 py-2 border rounded-lg"
                        value={intersection}
                        onChange={(e) => {
                            // intersection cannot be greater than the size of either set
                            const value = parseInt(e.target.value) || 0
                            setIntersection(value > setA || value > setB ? Math.min(setA, setB) : value)
                        }}
                    />
                </div>
            </div>

            <div className="relative h-64 border rounded-lg p-4 dark:bg-white dark:text-black">
                <svg viewBox="0 0 400 200" className="w-full h-full">
                    <circle
                        cx="150"
                        cy="100"
                        r="80"
                        fill="rgba(59, 130, 246, 0.2)"
                        stroke="#3b82f6"
                        strokeWidth="2"
                    />
                    <circle
                        cx="250"
                        cy="100"
                        r="80"
                        fill="rgba(239, 68, 68, 0.2)"
                        stroke="#ef4444"
                        strokeWidth="2"
                    />
                    <text x="100" y="100" fill="#3b82f6" className="text-lg font-bold">
                        A: {setA}
                    </text>
                    <text x="250" y="100" fill="#ef4444" className="text-lg font-bold">
                        B: {setB}
                    </text>
                    <text x="180" y="100" fill="#6b7280" className="text-lg font-bold">
                        ∩: {intersection}
                    </text>
                </svg>
            </div>
            {renderExplanation && renderExplanation(setA + setB - intersection, setA, setB, intersection)}
        </>
    )
}

export default VennDiagram2Way