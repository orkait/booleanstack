import axios from 'axios';
import { injectCode } from "@src/utils/blog-utils";
import fs from "fs";

const BASE_API = "https://python-worker.python-worker.workers.dev";

async function runPythonCode(code: string) {
    try {
        const response = await axios.post(BASE_API, {
            code: injectCode(code),
            language: "python"
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log(response.data.output);
        return {
            status: response.status,
            data: response.data
        };
    } catch (error) {
        console.error("Error running Python code:", error);

        // save response to a file
        fs.writeFileSync("error.html", error.response.data);
        return {
            status: error.response.status,
            data: error.response.data
        };
    }
}

export default runPythonCode;