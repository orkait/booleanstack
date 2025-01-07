export const injectCode = (str = "") => {

    let minIndent = -1;
    let maxIndent = -1;
    let isIndentByTabs = false;

    const lines = str?.split("\n") || [];
    let finalStr = str;

    if (finalStr.length > 0) {
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmedLine = line?.trim();
            if (trimmedLine?.length === 0) {
                continue;
            }

            const indent = line.indexOf(trimmedLine);
            if (minIndent === -1 || indent < minIndent) {
                minIndent = indent;
            }

            if (maxIndent === -1 || indent > maxIndent) {
                maxIndent = indent;
            }
        }

        // find out if the code is indented by tabs
        if (str.includes("\t")) {
            isIndentByTabs = true;
        }

        // remove all indentation of minIndent
        const allLines = lines?.map((line) => {
            if (isIndentByTabs) {
                return line?.replace("\t", "");
            }
            return line?.slice(minIndent);
        });

        // check if 1st line is empty
        while (allLines[0]?.trim().length === 0) {
            allLines.shift();
        }

        // check if last line is empty
        while (allLines[allLines.length - 1]?.trim().length === 0) {
            allLines.pop();
        }

        finalStr = allLines.join("\n");
    }
    return finalStr;
};

