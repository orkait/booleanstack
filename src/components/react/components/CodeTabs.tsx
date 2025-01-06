import React, { useState } from "react";

const CodeTabs = ({ tabs }) => {
    const [activeTab, setActiveTab] = useState(Object.keys(tabs)[0]); // Default to the first language tab

    return (
        <div>
            {/* Tab Navigation */}
            <div className="tabs">
                {Object.keys(tabs).map((lang) => (
                    <button
                        key={lang}
                        className={`tab ${activeTab === lang ? "active" : ""}`}
                        onClick={() => setActiveTab(lang)}
                    >
                        {lang.toUpperCase()}
                    </button>
                ))}
            </div>

            {/* Code Block */}
            <div className="code-block">
                <pre>
                    <code className={`language-${activeTab}`}>{tabs[activeTab]}</code>
                </pre>
            </div>
        </div>
    );
};

export default CodeTabs;
