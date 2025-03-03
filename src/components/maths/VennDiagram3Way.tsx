import React, { useMemo } from 'react'
import TeX from '@matejmazur/react-katex'


const CONSTANTS = {
    INT_12: 'Intersection 1∩2',
    INT_13: 'Intersection 1∩3',
    INT_23: 'Intersection 2∩3',
    INT_123: 'Intersection 1∩2∩3',
}

const VennDiagram3Way = ({
    set1_default = 0,
    set2_default = 0,
    set3_default = 0,
    int12_default = 0,
    int13_default = 0,
    int23_default = 0,
    int123_default = 0,
    renderExplanation = (threeSetUnion: number, set1: number, set2: number, set3: number, int12: number, int13: number, int23: number, int123: number) => (
        <div className="rounded-lg flex flex-col">
            <TeX math="|A \cup B \cup C| = |A| + |B| + |C| - |A \cap B| - |A \cap C| - |B \cap C| + |A \cap B \cap C|" />
            <TeX math={`|A \\cup B \\cup C| = {set1} + {set2} + {set3} - {int12} - {int13} - {int23} + {int123} = {threeSetUnion}`} />
        </div>
    )
}) => {
    const [set1, setSet1] = React.useState(set1_default)
    const [set2, setSet2] = React.useState(set2_default)
    const [set3, setSet3] = React.useState(set3_default)
    const [int12, setInt12] = React.useState(int12_default)
    const [int13, setInt13] = React.useState(int13_default)
    const [int23, setInt23] = React.useState(int23_default)
    const [int123, setInt123] = React.useState(int123_default)



    const threeSetUnion = useMemo(() => {
        return set1 + set2 + set3 - int12 - int13 - int23 + int123
    }, [set1, set2, set3, int12, int13, int23, int123])

    return (
        <>
            <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                    {[
                        { label: 'Set 1 Size', value: set1, setter: setSet1 },
                        { label: 'Set 2 Size', value: set2, setter: setSet2 },
                        { label: 'Set 3 Size', value: set3, setter: setSet3 },
                    ].map(({ label, value, setter }) => (
                        <div key={label}>
                            <label className="block text-sm font-medium mb-1">{label}</label>
                            <input
                                type="number"
                                className="w-full px-3 py-2 border rounded-lg"
                                value={value}
                                onChange={(e) => setter(parseInt(e.target.value) || 0)}
                            />
                        </div>
                    ))}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    {[
                        { label: CONSTANTS.INT_12, value: int12, setter: setInt12 },
                        { label: CONSTANTS.INT_13, value: int13, setter: setInt13 },
                        { label: CONSTANTS.INT_23, value: int23, setter: setInt23 },
                        { label: CONSTANTS.INT_123, value: int123, setter: setInt123 },
                    ].map(({ label, value, setter }) => (
                        <div key={label}>
                            <label className="block text-sm font-medium mb-1">{label}</label>
                            <input
                                type="number"
                                className="w-full px-3 py-2 border rounded-lg"
                                value={value}
                                onChange={(e) => {
                                    if (label === CONSTANTS.INT_12) {
                                        // Intersection 1∩2 cannot be greater than the size of set 1 or set 2
                                        if (parseInt(e.target.value) <= set1 && parseInt(e.target.value) <= set2) {
                                            setter(parseInt(e.target.value) || 0)
                                        }
                                    }

                                    if (label === CONSTANTS.INT_13) {
                                        // Intersection 1∩3 cannot be greater than the size of set 1 or set 3
                                        if (parseInt(e.target.value) <= set1 && parseInt(e.target.value) <= set3) {
                                            setter(parseInt(e.target.value) || 0)
                                        }
                                    }

                                    if (label === CONSTANTS.INT_23) {
                                        // Intersection 2∩3 cannot be greater than the size of set 2 or set 3
                                        if (parseInt(e.target.value) <= set2 && parseInt(e.target.value) <= set3) {
                                            setter(parseInt(e.target.value) || 0)
                                        }
                                    }

                                    if (label === CONSTANTS.INT_123) {
                                        // Intersection 1∩2∩3 cannot be greater than the size of set 1, set 2 or set 3
                                        if (parseInt(e.target.value) <= set1 && parseInt(e.target.value) <= set2 && parseInt(e.target.value) <= set3) {
                                            setter(parseInt(e.target.value) || 0)
                                        }
                                    }
                                }}
                            />
                        </div>
                    ))}
                </div>

                <div className="flex flex-col items-center justify-center dark:bg-white dark:text-black dark:rounded-md ">
                    {/* Venn Diagram Container */}
                    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto p-4 ">
                        <div className="w-full aspect-square max-w-[500px]">
                            <svg viewBox="0 0 400 400" className="w-full h-full">
                                {/* Circles */}
                                <circle cx="150" cy="150" r="100" fill="#EF4444" fillOpacity="0.1" stroke="#EF4444" strokeWidth="2" />
                                <circle cx="250" cy="150" r="100" fill="#3B82F6" fillOpacity="0.1" stroke="#3B82F6" strokeWidth="2" />
                                <circle cx="200" cy="250" r="100" fill="#22C55E" fillOpacity="0.1" stroke="#22C55E" strokeWidth="2" />

                                {/* Set Labels */}
                                <text x="80" y="150" className="font-bold text-sm " fill="#EF4444">A: {set1}</text>
                                <text x="270" y="150" className="font-bold text-sm " fill="#3B82F6">B: {set2}</text>
                                <text x="180" y="300" className="font-bold text-sm " fill="#22C55E">C: {set3}</text>

                                {/* Intersection Labels */}
                                <text x="170" y="120" className="font-bold text-sm " >A∩B: {int12}</text>
                                <text x="120" y="230" className="font-bold text-sm " >A∩C: {int13}</text>
                                <text x="230" y="230" className="font-bold text-sm " >B∩C: {int23}</text>
                                <text x="160" y="180" className="font-bold text-sm " >A∩B∩C: {int123}</text>
                            </svg>
                        </div>

                    </div>
                </div>
                {renderExplanation && renderExplanation(threeSetUnion, set1, set2, set3, int12, int13, int23, int123)}
            </div>
        </>
    )
}

export default VennDiagram3Way