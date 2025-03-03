import React, { useState } from 'react';
import TeX from '@matejmazur/react-katex';
import VennDiagram3Way from '../maths/VennDiagram3Way';
import VennDiagram2Way from '../maths/VennDiagram2Way';

const IEPVisualization = () => {
    // Tab management
    const [activeTab, setActiveTab] = useState('two-sets');

    return (
        <div className="w-full rounded-lg shadow-md">
            <div className="p-6">
                {/* Tab Controls */}
                <div className="join mb-6">
                    <button
                        className={`join-item border-[1px] border-primary btn btn-outline rounded-md ${activeTab === 'two-sets' ? 'bg-primary text-primary-content' : ''
                            }`}
                        onClick={() => setActiveTab('two-sets')}
                    >
                        Two Sets
                    </button>
                    <button
                        className={`join-item border-[1px] border-primary btn btn-outline rounded-md ${activeTab === 'three-sets' ? 'bg-primary text-primary-content' : ''
                            }`}
                        onClick={() => setActiveTab('three-sets')}
                    >
                        Three Sets
                    </button>
                </div>

                {/* Two Sets Content */}
                {activeTab === 'two-sets' && (
                    <div className="space-y-6">
                        <VennDiagram2Way
                            set_a_default={3}
                            set_b_default={4}
                            intersection_default={2}
                            renderExplanation={(twoSetUnion, setA, setB, intersection) => (
                                <>
                                    <h2 className="m-0">Wait... What does this mean?</h2>
                                    <p className="mt-0">
                                        The union of Set A and Set B will have <strong>{twoSetUnion}</strong> elements in total.
                                        This is because the intersection of Set A and Set B has <strong>{intersection}</strong> elements,
                                        which are counted twice when we add the sizes of Set A and Set B. So, we subtract the size
                                        of the intersection to avoid double counting.
                                    </p>
                                    <div className="rounded-lg flex flex-col">
                                        <TeX math="|A \cup B| = |A| + |B| - |A \cap B|" />
                                        <TeX math={`|A \\cup B| = {setA} + {setB} - {intersection}`} />
                                        <TeX math={`|A \\cup B| = ${setA} + ${setB} - ${intersection}`} />
                                        <TeX math={`|A \\cup B| = ${twoSetUnion}`} />
                                    </div>
                                </>
                            )}
                        />


                    </div>
                )}

                {/* Three Sets Content */}
                {activeTab === 'three-sets' && (
                    <>
                        <VennDiagram3Way
                            set1_default={3}
                            set2_default={4}
                            set3_default={5}
                            int12_default={2}
                            int13_default={1}
                            int23_default={3}
                            int123_default={1}
                            renderExplanation={(threeSetUnion, set1, set2, set3, int12, int13, int23, int123) => (
                                <>
                                    <div className="flex flex-col ml-5">
                                        <TeX math="|A \cup B \cup C| = |A| + |B| + |C| - |A \cap B| - |A \cap C| - |B \cap C| + |A \cap B \cap C|" />
                                        <TeX math={`|A \\cup B \\cup C| = ${set1} + ${set2} + ${set3} - ${int12} - ${int13} - ${int23} + ${int123}`} />

                                        {/* Substituting values */}
                                        <TeX math={`|A \\cup B \\cup C| = ${set1} + ${set2} + ${set3} - (${int12} + ${int13} + ${int23}) + ${int123} = ${threeSetUnion}`} />
                                    </div>

                                    <h2>What does this formula really mean? 🤔</h2>

                                    <p>
                                        The formula ensures that we count each unique element exactly once. Here's how:
                                    </p>

                                    <ul className="list-disc pl-6">
                                        <li>First, we add all three sets: <strong>{set1} + {set2} + {set3}</strong>.</li>
                                        <li>
                                            But now, the elements in the intersections <strong>A ∩ B</strong>, <strong>A ∩ C</strong>, and <strong>B ∩ C</strong>&nbsp;
                                            are counted twice! So, we subtract them: <strong>-({int12} + {int13} + {int23})</strong>.
                                        </li>
                                        <li>
                                            However, the elements in the triple intersection <strong>A ∩ B ∩ C</strong> were subtracted too many times—
                                            once in each of the pairwise subtractions. So, we add them back: <strong>+{int123}</strong>.
                                        </li>
                                    </ul>

                                    <p>
                                        After applying all these corrections, the total number of unique elements in the union of sets A, B, and C is <strong>{threeSetUnion}</strong>.
                                    </p>
                                </>
                            )}

                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default IEPVisualization;
