export const ENV = {
    MODE: import.meta.env.MODE,
    PYTHON_CODE_RUNNER_ENDPOINT: import.meta.env.PUBLIC_PYTHON_CODE_RUNNER_ENDPOINT
}

export const ENDPOINT_MAPPING = {
    DEV: 'http://localhost:4321',
    PROD: 'https://booleanstack.com',
    STAGING: 'https://staging--booleanstack.com',
}

export const GET_ENDPOINT = (ENV: keyof typeof ENDPOINT_MAPPING) => ENDPOINT_MAPPING[ENV]